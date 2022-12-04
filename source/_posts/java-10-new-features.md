---
title: Java 10 新特性
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 10:00:00
---

Java 10 根据 *JSR 383* 所开发，于 2018 年 3 月 20 日正式发布。Oracle 提供 GPL 下可用于生产的二进制文件，此次发布包含了十二项新特性。

## Local-Variable Type Inference

为了提高开发者体验，同时保持 Java 对静态类型安全的承诺，JDK 10 允许开发者省去平常不必要的本地变量类型声明，从而改善开发人员的体验。 例如：

```java
var list = new ArrayList<String>();  // infers ArrayList<String>
var stream = list.stream();          // infers Stream<String>
```

在上面的例子中，标识符 `var` 不是一个关键字，而是一个保留的类型名称，这样`var` 作为变量、方法包或者包名也不会受影响。

>  本地变量类型推导仅限于带有初始化器的局部变量、增强 `for-loop` 中的索引以及用传统的 `for` 循环声明的局部变量；不能用于方法、构造函数、方法返回值、字段、`catch` 或其它任何类型的变量声明。

## Consolidate the JDK Forest into a Single Repository

这个新的 Java 10 功能是关于内部管理的，它将把 JDK 众多代码库合并成一个代码库。

## Garbage-Collector Interface

在 JDK 10 增加了不同垃圾回收器的代码隔离，并引入了一个干净的接口，这意味着从 JDK 构建中排除 GC 更容易，同时也更容易增加新的 GC 而不影响代码库。关于 G1 垃圾回收以及 G1 与并发标记清除垃圾回收器的差异，请参考 [Java 内存管理](https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/garbage_collect.html)。

## Parallel Full GC for G1

在 JDK 10 中还有一个有趣的特性，它通过全量并发 GC 来改善 G1 在最坏情况下的延迟。如果你还记得 Java 9 的发布，G1 被设计为 JVM 的默认 GC，用于避免全量 GC。但是当并发回收不能快速的回收内存时，它最终会回落到全量 GC  上，这就产生了一个问题。这种改变使全量 GC 算法并行化，以便在不太可能出现 G1 全量 GC 的情况下，可以在并发回收时使用相同数量的线程来提高整体性能。

## Application Class-Data Sharing

类数据共享早在 Java 5 中就已经被引入，它允许将一组类被预处理成一个共享的存档文件，然后在运行时进行内存映射，以减少启动时间，当多个 JVM 共享相同的存档文件时，它还可以减少动态内存的占用。

## Thread-Local Handshakes

Thread-Local 握手这个功能为提高虚拟机性能奠定了基础，因为它可以在不执行全局 VM 保存点的情况下，在应用程序的线程上执行一个回调。这意味着 JVM 可以停止单独的线程，而不仅仅是所有的线程。

## Remove the Native-Header Generation Tool (javah)

*javah* 是在编译 JNI 代码时，用于生成头文件的工具，在 Java 10 被移除，并由 *javac* 取而代之。

## Additional Unicode Language-Tag Extensions

在 Java SE 9 中支持的 *BCP 47 Unicode* 语言标记的扩展名是 *ca* 和 *nu* ，在 Java 10 中，增加了对以下附加扩展的支持：

- cu (currency type) - 货币类型
- fw (first day of week) - 每周第一天
- rg (region override) - 区域覆盖
- tz (time zone) - 时区

为了支持这些附加扩展，Java 10 对下面 API 进行了更改：

- `java.text.DateFormat::get*Instance` 返回基于 `ca`， `rg`， `tz` 扩展的实例
- `java.text.DateFormatSymbols::getInstance` 返回基于 `rg `扩展的实例
- `java.text.DecimalFormatSymbols::getInstance` 返回基于 `rg` 扩展的实例
- `java.text.NumberFormat::get*Instance` 返回基于 `nu`，`rg` 扩展的实例
- `java.time.format.DateTimeFormatter::localizedBy` 返回基于 `ca`，`rg`，`tz` 扩展的实例
- `java.time.format.DateTimeFormatterBuilder::getLocalizedDateTimePattern` 返回基于 `rg` 扩展的模式字符串
- `java.time.format.DecimalStyle::of` 返回基于 `nu`，`rg` 扩展的 `DecimalStyle` 实例
- `java.time.temporal.WeekFields::of` 返回基于 `fw`，`rg` 扩展的 `WeekFields` 实例
- `java.util.Calendar::{getFirstDayOfWeek,getMinimalDaysInWeek}` 返回基于 `fw`，`rg` 扩展的值
- `java.util.Currency::getInstance` 返回基于 `cu`，`rg` 扩展的 `Currency` 实例
- `java.util.Locale::getDisplayName` 返回包含这些 Unicode 扩展的 `display name` 的字符串
- `java.util.spi.LocaleNameProvider` 有新的 SPI 作为这些 Unicode 扩展的键和类型

## Heap Allocation on Alternative Memory Devices

这听起来是一个非常酷的功能，它允许 HotSpot 虚拟机将 Java 对象堆分配到由用户指定的替代内存设备上。这一特性可以在多 JVM 环境中指定低优先级进程使用 *NV-DIMM* 内存，而将 *DRAM* 分配给高优先级进程。

## Experimental Java-Based JIT Compiler

基于 Java 的 JIT 编译器 [Graal](https://www.graalvm.org/) 是 Java 9 中引入的实验性 AOT(Ahead-of-Time) 编译器，它使用 Java 9 引入的 JVM 编译器接口。作为一个实验性的 JIT 编译器，*Graal* 主要用于测试和调试工作，通过下面的 JVM 参数即可开启 *Graal*：

```
-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler
```

## Root Certificates

这是 Java 10 带来的另一个重要变化。 它将提供一组默认的根证书颁发机构，使 Open JDK 更吸引开发者。它还旨在减小 Open JDK 和 Oracle JDK 之间的差异，像 TLS 这样关键的安全组件将在 Open JDK 中默认工作。

## Time-Based Release Versioning

随着 JDK 10 的发布，Java 已经采用了一种新的发布节奏ーー每六个月。 关于这是否是一种切实可行的方法，人们有很多争论。 很多人说每六个月就有新功能是好事，尽管很多人抱怨采用 JDK 的时间太少了。

> 更多详情，请参考：https://www.oracle.com/java/technologies/javase/10-relnote-issues.html#NewFeature