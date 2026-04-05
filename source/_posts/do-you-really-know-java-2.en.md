---
title: "Do You Really Know Java? (Part 2)"
lang: en
i18n_key: do-you-really-know-java-2
date: 2021-10-17 15:00:00
categories:
  - Computer Science
  - Java
tags:
  - JVM
---

Any Java/Android engineer knows that comparing with `==` checks whether two objects are the same instance -- essentially comparing memory addresses. When we print an `Object`, the default output looks like `java.lang.Object@xxxxxx`, where the part after `@` is the instance's memory address. As we all know, the JVM's garbage collector can move instances around in memory at runtime. So here's the question: after an instance is relocated by the garbage collector, does `Object.hashCode()` change?

## Hash Code Does Not Change

First, let's look at the Javadoc for `Object.hashCode()`:

> The general contract of hashCode is:
> - Whenever it is invoked on the same object more than once during an execution of a Java application, <u>the hashCode method must consistently return the same integer</u>, provided no information used in equals comparisons on the object is modified. This integer need not remain consistent from one execution of an application to another execution of the same application.
> - If two objects are equal according to the equals(Object) method, then calling the hashCode method on each of the two objects <u>must produce the same integer result</u>.
> - It is not required that if two objects are unequal according to the equals(Object) method, then calling the hashCode method on each of the two objects must produce distinct integer results. However, the programmer should be aware that producing distinct integer results for unequal objects may improve the performance of hash tables.
> - As much as is reasonably practical, the hashCode method defined by class Object does return distinct integers for distinct objects. (<i>This is typically implemented by converting the internal address of the object into an integer, but this implementation technique is not required by the Java programming language</i>.)

Since the API contract is explicit, how do JVM and ART ensure that an object instance still returns the same `hashCode()` after being moved?

## HotSpot Implementation

From the JDK 15 source code, we can see that an Object's header consists of two words -- `markWord` and `_metadata`:

```c++
class oopDesc {
  friend class VMStructs;
  friend class JVMCIVMStructs;
 private:
  volatile markWord _mark;
  union _metadata {
    Klass*      _klass;
    narrowKlass _compressed_klass;
  } _metadata;
```

> https://github.com/openjdk/jdk15/blob/e9b8463/src/hotspot/share/oops/oop.hpp#L52

For an ordinary `Object`, the `markWord` structure looks like this:

```c++
class markWord {
 private:
  uintptr_t _value;
}
```

> https://github.com/openjdk/jdk15/blob/e9b8463d3d/src/hotspot/share/oops/markWord.hpp#L94

So `markWord` is essentially a `uintptr_t` in memory. According to the comments, `_value` has different layouts on different platforms:

### 32-bit

| Field       | Bits |
|-------------|------|
| hash        | 25   |
| age         | 4    |
| biased_lock | 1    |
| lock        | 2    |

### 64-bit

| Field       | Bits |
|-------------|------|
| unused      | 25   |
| hash        | 31   |
| unused_gap  | 1    |
| age         | 4    |
| biased_lock | 1    |
| lock        | 2    |

For every ordinary `Object`, the hash value is recorded in the first word of its header. Before `hashCode()` is called, this field has no value. Once called, the hash value is stored and stays with the object for its entire lifetime, no matter where the garbage collector moves it. (A bit like an immune system, isn't it?)

> https://github.com/openjdk/jdk15/blob/master/src/hotspot/share/oops/markWord.hpp

## ART Implementation

From Android's source code, we can see the `Object` class's `hashCode()` implementation:

```java
public int hashCode() {
  return identityHashCode(this);
}

static int identityHashCode(Object obj) {
  int lockWord = obj.shadow$_monitor_;
  final int lockWordStateMask = 0xC0000000;  // Top 2 bits.
  final int lockWordStateHash = 0x80000000;  // Top 2 bits are value 2 (kStateHash).
  final int lockWordHashMask = 0x0FFFFFFF;  // Low 28 bits.
  if ((lockWord & lockWordStateMask) == lockWordStateHash) {
      return lockWord & lockWordHashMask;
  }
  return identityHashCodeNative(obj);
}
```

Same as HotSpot -- one word is used to store the hash value.

## Overriding `hashCode()`

Since the object's hash value is stored in the header, does overriding `hashCode()` cause inconsistencies? For example, consider a typical POJO:

```java
class Data {

  private String id;
  private String name;

  public Data(String id, String name) {
    this.id = id;
    this.name = name;
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id, this.name);
  }

  @Override
  public boolean equals(Object other) {
    return Objects.equals(this, other);
  }
}
```

What happens if you run this code?

```java
public static void main(String[] args) {
  Data data = new Data("1", "Data 1");
  int hash1 = data.hashCode();
  data.setName("New Data 1");
  int hash2 = data.hashCode();
  System.out.println(hash1 == hash2);
}
```

The output:

```
false
```

Wait -- didn't we just say the hash value is stored in the Object header and never changes? Why is it `false`? What's going on?

## System.identityHashCode(Object)

The root cause is that there are two separate hash values at play:

* The hash computed by the JVM, i.e., what `System.identityHashCode(Object)` returns
* The hash computed by the overridden `hashCode()` method

The `hash` in the Object header's `markWord` is the one computed by the JVM/ART, used to identify the object's uniqueness at runtime.

By default, if `hashCode()` is not overridden, these two hash values are the same.

That's why the same instance can return different values from two successive `hashCode()` calls, while the runtime hash remains consistent:

```java
public static void main(String[] args) {
  Data data = new Data("1", "Data 1");
  int hash1 = System.identityHashCode(data);
  data.setName("New Data 1");
  int hash2 = System.identityHashCode(data);
  System.out.println(hash1 == hash2);
}
```

Output:

```
true
```
