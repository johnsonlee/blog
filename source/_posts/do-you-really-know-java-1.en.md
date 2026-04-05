---
title: "Do You Really Know Java? (Part 1)"
lang: en
i18n_key: do-you-really-know-java-1
date: 2021-09-21 13:00:00
categories:
  - Computer Science
  - Java
tags:
  - JVM
---

I was driving when a WeChat message came in: "Hey, why does this code output `0`? ..." Since I was behind the wheel, I didn't have time to reply. A moment later, another message: "Come on, bytecode master, explain the principle? [face-palm emoji]"

I kept driving. Then another one: "Guess you're too lazy to reply [face-palm]"

At the next red light, I opened the messages. It was this piece of code:

```java
public static void main(String[] args) {
  int i = 0;
  for (j = 0; j < 50; j++) {
    i = i++;
  }
  System.out.println(i);
}
```

A classic "toxic" snippet. I replied: "Driving."

"Drive safe [smug face]"

Later at home, I recalled the question. Many people get tripped up by this. Although there are countless explanations of `i++` vs. `++i` out there, such as:

* `i++` reads the value of `i` first, then increments
* `++i` increments first, then reads the value of `i`

I feel these explanations don't get to the root of the problem. So what is the root? To explain this, we need to start with the JVM's Stack.

## Java Stack

Every time a thread starts, the Java Virtual Machine creates a stack for that thread. When I used to interview candidates, I'd often ask: "How many threads does a process have? How many stacks does each thread have?" The number of threads a process can have depends on many factors and is beyond today's scope. For the second question, even CS graduates frequently get confused about whether the answer is one or many. The answer: each thread has exactly one stack. The reason our operating systems can switch between threads is that thread state information is stored in stack frames. Stack frames can be a tricky concept to grasp, so if I had to pick an analogy, I'd go with the movie Inception.

### Stack Frame

If we treat each person's dream activity as a thread, we can demonstrate the relationship between dreams and stack frames with the following code:

```kotlin
class Human {

  open fun fallInto(dreamland: Dreamland) {
    // Where an ordinary person's dream begins

    // do something in dreamland

    // Where an ordinary person's dream ends
  }

}

class DreamBuilder : Human {

  private fun buildDreamland(original: Dreamland?, objects: Set<Any>): Dreamland {
    ...
  }

  override fun fallInto(dreamland: Dreamland) {
    // Where the dream architect's dream begins
    if (isControlledByMySelf(dreamland) && shouldFallIntoDeeper(dreamland)) {
      val objects = prepareObjects(...)
      val newDreamland = buildDreamland(dreamland, objects)

      // Everyone enters the next dream level together
      newDreamland.humans.forEach { human ->
        human.fallInto(dreamland)
      }
      // Everyone returns from the deeper dream together
    }
    // Where the dream architect's dream ends
  }

  fun fallIntoDreamland(objects: Set<Any>) {
    // Include yourself as part of the dream
    val elements = objects + this
    // Build the dream in reality
    val dreamland = buildDreamland(null, elements)
    // Enter the dream together
    val threads = dreamland.humans.map { human ->
      thread {
       human.fallInto(dreamland)
      }
    }
    // Return to reality together
    threads.forEach { thread ->
      thread.join()
    }
    // Destroy the dream
  }
}

fun main(args: Array<String>) {
  val dreamBuilder = ...
  val objects = ...
  ...
  dreamBuilder.fallIntoDreamland(objects)
}
```

The dream architect (`DreamBuilder`) constructs a dream in reality and brings everyone into the first dream level together. Everyone's state before entering the dream is preserved in reality. When they wake up and return, the surrounding environment is exactly the same as before. We can think of reality as dream level 0. When the `fallIntoDreamland` method call takes us from level 0 to level 1, a stack frame is created to record the context. When we go from level 1 to level 2, another stack frame is created. By extension, each dream level produces a stack frame, and correspondingly, each method call produces a stack frame. Method calls are like dreams -- nested layer upon layer. However, in a thread's stack, frames are not actually nested but laid out sequentially. It's the LIFO/FILO nature of the stack that simulates nesting -- which is also why stacks are used to convert recursion into iteration.

The dream architect can keep making everyone dream, taking them from level 0 (reality) all the way to level N. Feels like recursion, doesn't it? Whether they can safely return from deep dream levels depends on whether the dream architect can control the exit condition (terminating the recursion). For a program, the programmer writing the recursion is the dream architect.

For a thread, when you enter a method and then return, the parameters, variables, and context are all in their original state. How does the thread store this information? This brings us to the structure of a stack frame. Each stack frame has its own Local Variable Array, Operand Stack, and a reference to the constant pool of the current method's class. The Local Variable Array stores local variables declared in the method. The Operand Stack stores method parameters (for instance methods, element 0 of the Operand Stack is the `this` reference, while static methods have no instance reference) and return values from other instructions (method calls, expression evaluations, etc.).

## The Root of the Problem

Now that we understand the Java stack structure, let's return to the original question. The crux lies in this line:

```java
i = i++;
```

We can use *javap* to decompile the bytecode generated from this code:

```
iload_1
iinc          1, 1
istore_1
```

These three instructions look fine on the surface. So why doesn't the `iinc` instruction seem to "take effect"? Let's look at the definitions of these three instructions from the [JVM bytecode instruction set](https://en.wikipedia.org/wiki/List_of_Java_bytecode_instructions):

| Mnemonic | Opcode | Other bytes   | Stack     | Description                                          |
|:--------:|:------:|:--------------|:---------:|:-----------------------------------------------------|
| iinc     | 0x84   | 2:index,const |           | increment local variable #index by signed byte const |
| iload_1  | 0x1b   |               | -> value  | load an int value from local variable 1              |
| istore_1 | 0x3c   |               | value ->  | store int value into variable 1                      |

From these definitions, we can see that:

* `iinc` operates on the Local Variable Array
* `iload_1` and `istore_1` operate on the Operand Stack

Now let's trace through the three instructions. Assume that before `iload_1` executes, the stack looks like `...` (left is bottom, right is top):

1. `iload_1` loads the value of Local Variable Array[1] (variable `i`) onto the Operand Stack. The stack goes from `...` to `..., 0`
1. `iinc` directly increments Local Variable Array[1] (variable `i`) to `1`. However, the Operand Stack still holds `..., 0`
1. `istore_1` pops `0` from the top of the stack and stores it into Local Variable Array[1] (variable `i`). The stack returns to `...`

So the root cause is that **`iinc`'s result is not synced back to the Operand Stack**. To fix this, we'd need to execute `iload_1` after `iinc` to reload the updated value of Local Variable Array[1] (variable `i`) onto the Operand Stack:

```
iinc          1, 1
iload_1
istore_1
```
This simply swaps the order of `iinc` and `iload_1`. Decompiled back to Java, it becomes:

```java
i = ++i;
```
