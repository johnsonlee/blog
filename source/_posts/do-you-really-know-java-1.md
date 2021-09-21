---
title: 你真的会 Java 吗？（一）
date: 2021-09-21 13:00:00
categories: Java
tags:
  - JVM
---

正在开车呢，收到一条微信：“森哥，这段代码为啥输出是 `0`？...”，由于开着车，实在没功夫回信息，过了一会儿，又收到一条微信：“森哥，字节码大神，说下原理呗？[捂脸表情]”

我继续开着车，又收到一条微信：“森哥懒得理我了[捂脸]”

借着等红绿灯的功夫，打开信息一看，原来是这样一段代码：

```java
public static void main(String[] args) {
  int i = 0;
  for (j = 0; j < 50; j++) {
    i = i++;
  }
  System.out.println(i);
}
```

果然是一段“有毒”的代码，我回了一句：“开车呢”。

“专心驾车吧[得意]”

回到家，想起来刚才的问题，其实，很多人会被这个陷阱给迷惑住，虽然关于 `i++` 与 `++i` 的解释一搜一大把，比如：

* `i++` 是先读取 `i` 的值，再自增
* `++i` 是先自增，然后再读取 `i` 的值

但我觉得还是没有说到问题的本质，那什么是问题的本质呢？要解释这一问题，还得从 JVM 的栈（Stack）说起。

## Java Stack

每启动一个线程，Java 虚拟机就会为这个线程创建一个栈（Stack），以前在面试的时候，我经常会问候选人：“一个进程有多少个线程？每个线程有多少个栈？”，对于每个进程所能拥有的线程数会受很多因素的影响，不在今天的讨论范围。对于第 2 个问题，即便是科班出身的程序员，也经常会被问懵，搞不清楚到底是 1 个还是多个。答案就是 —— 每个线程对应一个栈。之所以我们的操作系统能够在多个线程间来回切换，是因为线程的状态信息是存储在栈帧（Stack Frame）中，对于栈帧这个概念，可能不太好容易理解，如果非要举一个例子，我觉得盗梦空间这部电影就挺合适的。

### Stack Frame

如果我们把每个人的梦境活动当成一个线程，我们可以用如下代码来演示梦境与栈桢：

```kotlin
class Human {

  open fun fallInto(dreamland: Dreamland) {
    // 普通人的梦开始的地方

    // do something in dreamland

    // 普通人的梦结束的地方
  }

}

class DreamBuilder : Human {

  private fun buildDreamland(original: Dreamland?, objects: Set<Any>): Dreamland {
    ...
  }

  override fun fallInto(dreamland: Dreamland) {
    // 造梦师的梦开始的地方
    if (isControlledByMySelf(dreamland) && shouldFallIntoDeeper(dreamland)) {
      val objects = prepareObjects(...)
      val newDreamland = buildDreamland(dreamland, objects)
      newDreamland.humans.forEach { human ->
        human.fallInto(dreamland)                     // 一起进入下一层梦境
      }
      // 一起从深层的梦境中回来
    }
    // 造梦师的梦结束的地方
  }

  fun fallIntoDreamland(objects: Set<Any>) {
    val elements = objects + this                     // 把自己作为梦境的一部分
    val dreamland = buildDreamland(null, elements)    // 在现实中构造梦境
    val threads = dreamland.humans.map { human ->
      thread {
       human.fallInto(dreamland)                      // 一起进入梦境
      }
    }
    threads.forEach { thread ->
      thread.join()                                   // 一起回到现实
    }
    // 销毁梦境
  }
}

fun main(args: Array<String>) {
  val dreamBuilder = ...
  val objects = ...
  ...
  dreamBuilder.fallIntoDreamland(objects)
}
```

造梦师（`DreamBuilder`）在现实中造梦，并将所有人一起带入第 1 层梦境，大家进入梦境前的所有状态都保留在现实中，当大家从梦境中醒来后回到现实），周围环境还是跟进入梦境之前一模一样。我们可以把现实当作第 0 层梦境，当通过 `fallIntoDreamland` 方法调用从第 0 层梦境进入第 1 层梦境时，这时候就会产生一个栈帧用来记录上下文，当从第 1 层梦境进入第 2 层梦境时，又会产生一个栈帧，推而广之，每进入一层梦境都会产生一个栈帧，相应地，每个方法调用都会产生一个栈帧，方法调用就像梦境一样，一层套一层，然而，在线程的栈中，栈帧并不是嵌套的结构，而是平铺的结构，只不过由于栈 LIFO/FILO 的特殊性，可以用来模拟嵌套结构，所以，这也是为什么会用栈来实现递归转非递归。

造梦师可以不断地让大家做梦，把大家从第 0 层梦境（现实）带入第 N 层梦境，是不是有点递归的感觉？能不能从深层次的梦境中顺利出来取决于造梦师能不能控制退出梦境（结束递归）的条件，对于程序来说，编写递归的那个程序员就是那个造梦师。

对于线程来说，当进入一个方法后，再返回的时候，参数、变量等都还是原来的状态，上下文还是原来的上下文，那线程是如何存储这些信息的呢？这得从栈帧的结构说起，每个栈帧都有自己的本地变量（局部）数组（Local Variable Array）、操作数栈（Operand Stack）和对当前方法所属的类的常量池的引用，本地变量数组用于存储方法中声明的本地变量，操作数栈用于存储方法的参数（成员方法的操作数栈中的第 0 个元素为 `this` 引用，而静态方法而没有实例引用）和其它指令的返回值（方法调用、表达式计算等）。

## 问题的本质

了解了 Java 栈的结构，我们再回到前面的问题，这个问题的关键在于这行代码：

```java
i = i++;
```

我们可以通过 *javap* 来反编译这段代码生成的字节码：

```
iload_1
iinc          1, 1
istore_1
```

看起来，这三个指令貌似没什么毛病呀，为什么 `iinc` 指令并没有“生效”呢？我们来看看 [JVM 字节码指令](https://en.wikipedia.org/wiki/List_of_Java_bytecode_instructions) 中关于这 3 个指令的定义：

| Mnemonic | Opcode | Other bytes   | Stack     | Description                                          |
|:--------:|:------:|:--------------|:---------:|:-----------------------------------------------------|
| iinc     | 0x84   | 2:index,const |           | increment local variable #index by signed byte const |
| iload_1  | 0x1b   |               | -> value  | load an int value from local variable 1              |
| istore_1 | 0x3c   |               | value ->  | store int value into variable 1                      |

根据指令的定义，我们不难发现：

* `iinc` 操作的对象是 Local Variable Array
* `iload_1` 和 `istore_1` 操作的对象是 Operand Stack

那么，再来看上面三个指令，似乎答案已经被揭晓了，假设在 `iload_1` 执行之前，栈的结构为 `...`（左边为栈底，右边为栈顶），那么：

1. `iload_1` 将 Local Variable Array [1]（变量 `i`）的值加载到了 Operand Stack 中，栈的结构从 `...` 变为 `..., 0`
1. `iinc` 直接对 Local Variable Array 中对应的变量 `i` 进行自增，变成了 `1`，然而，这时候，Operand Stack 中，栈的结构还是 `..., 0`
1. `istore_1` 将栈顶的 `0` 弹出来，存入 Local Variable Array [1]（变量 `i`）中，栈的结构变为 `...`

所以，问题的根源在于 —— `iinc` 的结果没有同步到 Operand Stack 中！如果要解决这一问题，就需要在 `iinc` 之后，执行 `iload_1` 将 Local Variable Array [1]（变量 `i`）的值加载到 Operand Stack 中，即：

```
iinc          1, 1
iload_1
istore_1
```
其实就是将 `iinc` 与 `iload_1` 调换了一下顺序而已，而反编译成 Java 代码则为：

```java
i = ++i;
```
