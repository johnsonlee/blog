---
title: 你真的会 Java 吗？（二）
date: 2021-10-17 15:00:00
categories: Java
tags:
  - JVM
---

是个 __Java/Android__ 工程师都知道，用 `==` 比较其实是比较的两个对象是否是同一个实例，比较实例其实就是比较内存地址是否相等，当我们在打印一个 `Object` 的时候，默认就会输出 `java.lang.Object@xxxxxx` 这样的字符串，`@` 后面的这一串，则是 `Object` 实例在内存中的地址。众所周知，由于 __JVM__ 的垃圾回收机制，会导致实例在运行时内存中的位置被垃圾回收器移动，那么问题来了，当实例被移动位置后，`Object` 的 `hashCode()` 会变吗？

## Hash Code 不会变

首先，我们来看 __Javadoc__ 中对于 `Object.hashCode()` 的注释说明：

> The general contract of hashCode is:
> - Whenever it is invoked on the same object more than once during an execution of a Java application, <u>the hashCode method must consistently return the same integer</u>, provided no information used in equals comparisons on the object is modified. This integer need not remain consistent from one execution of an application to another execution of the same application.
> - If two objects are equal according to the equals(Object) method, then calling the hashCode method on each of the two objects <u>must produce the same integer result</u>.
> - It is not required that if two objects are unequal according to the equals(Object) method, then calling the hashCode method on each of the two objects must produce distinct integer results. However, the programmer should be aware that producing distinct integer results for unequal objects may improve the performance of hash tables.
> - As much as is reasonably practical, the hashCode method defined by class Object does return distinct integers for distinct objects. (<i>This is typically implemented by converting the internal address of the object into an integer, but this implementation technique is not required by the Java™ programming language</i>.)

既然在 __API__ 层面上已经做了明确的定义，那 __JVM__ 和 __ART__ 是如何保证对象实例在被移动后依然返回相同的 `hashCode()` 呢？

## HotSpot 实现

从 __JDK 15__ 的源代码中，我们可以看到 __Object__ 的头部由两个 __word__ 组成 —— `markWord` 和 `_metadata`：

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

对于普通的 `Object`，`markWord` 的结构如下所示：

```c++
class markWord {
 private:
  uintptr_t _value;
}
```

> https://github.com/openjdk/jdk15/blob/e9b8463d3d/src/hotspot/share/oops/markWord.hpp#L94

由此可见，`markWord` 的内存结构其实就是一个 `uintptr_t`， 至于其中的内容，从注释中，我们可以得知，`_value` 的结构在不同的平台上有不同的结构

### 32 位

| Field       | Bits |
|-------------|------|
| hash        | 25   |
| age         | 4    |
| biased_lock | 1    |
| lock        | 2    |

### 64 位

| Field       | Bits |
|-------------|------|
| unused      | 25   |
| hash        | 31   |
| unused_gap  | 1    |
| age         | 4    |
| biased_lock | 1    |
| lock        | 2    |

对于每个普通的 `Object`，在头部的 __1__ 个 `word` 中记录其 `hash` 值，在未调用其 `hashCode()` 之前，是没有值的，一旦调用过，这个 `hash` 值就会被存下来，并将伴随其一生，无论将来这个对象被垃圾回收器移动到哪儿（是不是有点像生物的免疫系统？）

> https://github.com/openjdk/jdk15/blob/master/src/hotspot/share/oops/markWord.hpp

## ART 实现

从 __Android__ 的源码中，我们可以看到 `Object` 类的 `hashCode()` 实现：

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

与 __HotSpot__ 相同，都是用了 1 个 __word__ 来存储其 `hash` 值。

## 重写 `hashCode()`

既然对象的 `hash` 值会被存下来，那重写 `hashCode()` 会导致每个对象的 `hash` 值会不一致吗？比如，一个普通的 __POJO__ 的定义如下：

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

如果运行下面这段代码，会是什么样的结果呢？

```java
public static void main(String[] args) {
  Data data = new Data("1", "Data 1");
  int hash1 = data.hashCode();
  data.setName("New Data 1");
  int hash2 = data.hashCode();
  System.out.println(hash1 == hash2);
}
```

输入结果如下：

```
false
```

前面不是说 `hash` 值会被存在 `Object` 的头部不会变吗？为什么又是 `false` 呢？到底是怎么回事儿？

## System.identityHashCode(Object)

这个问题的根本原因在于，这里有两套 `hash` 值：

* __JVM__ 计算出来的 `hash`，即 `System.identityHashCode(Object)` 计算出来的 `hash`
* 重写 `hashCode(Object)` 计算出来的 `hash`

而 `Object` 头部的 `markWord` 中的 `hash` 是由 __JVM/ART__ 计算出来的 `hash`，用来标识对象在 _runtime_ 的唯一性。

默认情况下，如果未重写 `hashCode(Object)`，这两套 `hash` 值是相同的。

因此，才会出现上述同一个实例前后两次调用 `hashCode()` 的返回值不一样，但是在 _runtime_ 的 `hash` 值却是一致的：

```java
public static void main(String[] args) {
  Data data = new Data("1", "Data 1");
  int hash1 = System.identityHashCode(data);
  data.setName("New Data 1");
  int hash2 = System.identityHashCode(data);
  System.out.println(hash1 == hash2);
}
```

输出结果如下：

```
true
```
