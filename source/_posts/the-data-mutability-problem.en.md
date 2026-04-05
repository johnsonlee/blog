---
title: The Data (Im)mutability Problem
lang: en
i18n_key: the-data-mutability-problem
categories:
  - Computer Science
  - Architecture Design
tags:
  - Android
  - Java
  - Kotlin
date: 2022-04-11 00:00:00
---

Whether data should be mutable or immutable after creation -- despite knowing that Java's *String* benefits enormously from its immutable design, I'd rarely thought about this problem systematically throughout my career. That changed recently when I was reviewing a colleague's code and realized just how serious this issue can be.

## Programming Habits

### The `final` Keyword

I've been writing code for over a decade now, mostly in *Java*. If you've read my code, you've probably noticed I put `final` in front of nearly every variable. Where did this habit come from?

It started early. Back then I was writing not just *Java* but also *C/C++*. In *C*, even a simple operation that's one line in *Java* could take dozens of lines. Early *C* compilers also required variables to be declared at the top of functions, unlike *Java*'s declare-as-you-go approach. In long functions, you couldn't be sure when a variable might get modified -- one slip of the finger and you'd corrupt something. So I learned to be cautious and keep mutations clustered together. When I moved to *Java*, the habit of adding `final` came naturally as a way to prevent accidental modifications. I kept this up for years, initially for two reasons:

1. Preventing accidental mutations
1. Making closures work more naturally

### `Collections.unmodifiableXxxx`

When reviewing code, I often see patterns like this:

```java
class Registry {
  final Map<String, List<Class<*>>> mapping = ...

  public List<Class<*>> getValue(String key) {
    return this.mapping.get(key);
  }
}
```

Looks fine at first glance. But what about this?

```java
public void wtf(Registry registry) {
  registry.get("key").put("wtf", Wtf.class)
}
```

To prevent internal data from being modified externally, I typically write:

```java
public List<Class<*>> getValue(String key) {
  return Collections.unmodifiableList(this.mapping.get(key));
}
```

### Data Snapshots

Another habit I picked up from reading *Swing*'s source code -- in the *Observer* pattern, most people notify listeners like this:

```java
void notifyListeners() {
  for (Listener listener : this.listeners) {
    listener.onStateChange();
  }
}
```

Seems harmless. And in most cases it is. But in a multithreaded environment, this can blow up. So I write it like this:

```java
void notifyListeners() {
  final Listener[] listeners = this.listeners.toArray(new Listener[0]);
  for (Listener listener : listeners) {
    listener.onStateChange();
  }
}
```

## Functional Programming Languages

Speaking of functional programming, [Haskell](https://www.haskell.org/) is the granddaddy. In [Haskell](https://www.haskell.org/)'s world, all data is immutable -- if you want to change something, you copy it. Many people wonder why [Haskell](https://www.haskell.org/) was designed this way. Doesn't copying on every modification hurt performance? If you've used *Java* closures or lambdas, you know the pain: local variables referenced in a closure or lambda must be `final`. Why is that?

Anyone who's written *JavaScript* has probably experienced something like this:

```js
function setupButtons(container) {
  for (var i = 1; i <= 10; i++) {
    const btn = document.createElement("A");
    btn.href = "javascript:void(0)";
    btn.innerText = `${i}`;
    btn.onclick = function() {
      alert(`Button ${i}`);
    }
    container.appendChild(btn)
  }
}
```

The intent is to create 10 `<A>` tags as buttons, where clicking any button shows a dialog with its index. Looks fine. But run it and you'll find every button shows `11`.

> What The Fuck!!??

The root cause: `btn.onclick`'s function creates a closure. Unlike *Java*, *JavaScript* doesn't require closure-captured variables to be `final`. By the time any button is clicked, the loop has finished and `i` equals `11`. The typical fix:

```js
function setupButtons(container) {
  for (var i = 1; i <= 10; i++) {
    (function(index) {
      const btn = document.createElement("A");
      btn.href = "javascript:void(0)";
      btn.innerText = `${index}`;
      btn.onclick = function() {
        alert(`Button ${index}`);
      }
      container.appendChild(btn)
    })(i);
  }
}
```

With the rise of functional programming, immutable objects have become the default choice to avoid problems like this. *Kotlin*, for example, makes method parameters `final` by default, clearly separates immutable and mutable collections, and prohibits inheritance of [Data Classes](https://kotlinlang.org/docs/data-classes.html).

## MVVM

In the MVVM architecture, *Data Models* are generally recommended to be immutable. Since this isn't enforced, developers with different understandings of the architecture end up mixing mutable and immutable *Data Models* inconsistently. Some might ask: what's wrong with mutable objects?

For simple business logic, mutability may not matter much. But once logic gets complex and multiple consumers share the same data, if someone "accidentally" or "unexpectedly" mutates the *Data Model* directly instead of going through `LiveData` or `StateFlow`, a cascade of problems follows:

1. Changes to the *Data Model* become unobservable
1. Data flow and control flow become tangled, and complexity explodes

The tangled dependencies lead to bizarre bugs everywhere. Because the *Data Model* is mutable, every call site must assume something somewhere might modify it. This makes architecture design and development far more complex. Imagine if everything were immutable by default: no need to worry about multithreaded access. But with mutability, you must carefully handle every possible concurrent access scenario -- a real cognitive burden. The situations and edge cases pile up. Every habit I described earlier was learned the hard way, one pitfall at a time. If we can eliminate these problems at the root, development becomes dramatically simpler.

## Is Immutability Really That Good?

After all this praise for *Immutable Objects*, you might ask: is immutability really that wonderful? That's a topic for next time.
