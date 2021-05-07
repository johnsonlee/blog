---
title: Java 11 新特性
date: 2021-05-07 11:00:00
categories: Java
tags:
  - Java
---

Java 11 于 2018 年 9 月 25 日发布，该版本目前已开放以进行错误修复。它提供 LTS 或长期支持，这也是为什么新版本的 *IntelliJ IDEA* 及 *Android Studio* 都将内置的 JDK 版本升级到了 Java 11 的原因。

## Local-Variable Syntax for Lambda Parameters

早在 Java 10 中就引入了本地变量类型推断，但仅支持普通的变量声明，而在 Java 11 中引入了更强大的类型推断，支持 *Lambda* 参数，如：

```java
(var x, var y) -> x.process(y);
```

等同于：

```java
(x, y) -> x.process(y);
```

⚠️ 值得注意的是，在使用 `var` 声明参数类型的时候，必须所有参数同时都用 `var` 声明，以下是错误的例子：

```java
(var x, y) -> x.process(y);
(var x, int y) -> x.process(y);
```

## Launch Single-File Source-Code Programs

自从 Java 9 引入了 *jshell* ，Java 语言开始朝着脚本语言的方向演化，在 Java 11 中，我们可以在类 Unix 系统上使用 *shebang* 标识符直接运行单个 *.java* 文件，如：

```java
#!/usr/bin/java --source 11

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java 11!);
    }
}
```

然后在命令行中直接执行：

```shell
java Main.java
```

## Unicode 10

Java 11 开始支持 [Unicode Standard](http://www.unicode.org/standard/standard.html) [Version 10.0](http://unicode.org/versions/Unicode10.0.0/)，主要包含以下的类：

- *java.lang* : `Character` and `String`
- *java.awt.font* : `NumericShaper`
- *java.text* : `Bidi`, `BreakIterator`, and `Normalizer`

## HTTP Client (Standard)

从 Java 9 开始引入的 *HTTP Client* 在 Java 11 中被标准化，在 Java 11 中，*HTTP Client* 的实现几乎全部重写，由原来 HTTP/1.1 阻塞式的实现改为完全异步。在新的实现中，数据流能够更好的被追踪，大大的降低了概念的数量和代码的复杂度，并使得在 HTTP/1.1 和 HTTP/2 之间的重用性最大化

## Lazy Allocation of Compiler Threads

在 Java 11 中增加了一个新的命令行标志：*-XX:+UseDynamicNumberOfCompilerThreads* 用于动态地控制编译器线程。在默认开启的分层编译模式中，无论可用内存和编译请求的数量如何，虚拟机都会在多 CPU 系统上启动了大量的编译线程。 因为即使是空闲时，线程也会消耗内存（几乎所有时间都是如此），这会导致资源的低效使用。

为了解决这个问题，Java 11 已经更改了实现方式，在启动期间只为每种编译类型（参见：[Understanding Java JIT Compilation with JITWatch, Part 1](https://www.oracle.com/technical-resources/articles/java/architect-evans-pt1.html)）启动一个编译器线程，并动态处理后续线程的启动和关闭。 它由新的命令行标志 *-XX:+UseDynamicNumberOfCompilerThreads* 控制，默认开启。

## ZGC - A Scalable Low-Latency Garbage Collector

ZGC 是一个可伸缩的低延迟垃圾收集器， 它旨在实现以下目标：

- 暂停时间不得超过 10 毫秒
- 暂停时间不会随着堆或实时设置大小而增加
- 处理大小从几百兆到多兆字节不等的信息

ZGC 是一个并发的垃圾收集器，这意味着所有繁重的工作（标记、压缩、参考处理、字符串表清理等）都是在 Java 线程继续执行的时候完成的。 这极大地限制了垃圾收集对应用程序响应时间的负面影响。

从 ZGC 与 G1 的 benchmark 对比来看，简直令人惊叹，仅用了不到 2 毫秒：

|                    |         ZGC          |           G1            |
| -----------------: | :------------------: | :---------------------: |
|                avg | 1.091ms (+/-0.215ms) | 156.806ms (+/-71.126ms) |
|    95th percentile |       1.380ms        |        316.672ms        |
|    99th percentile |       1.512ms        |        428.095ms        |
|  99.9th percentile |       1.663ms        |        543.846ms        |
| 99.99th percentile |       1.681ms        |        543.846ms        |
|                max |       1.681ms        |        543.846ms        |

作为 Java 11 的一个实验特征，开启 ZGC 需要通过 *-XX:+UnlockExperimentalVMOptions* 选项与 *-XX:+UseZGC* 选项结合使用，不过它有如下限制：

- 只能在 linux / x64上使用。
- 不支持 *Compressed Oops*[^2] 和 *Compressed Class Pointers*[^3]，*XX:+UseCompressedOops* 和 *-XX:+UseCompressedClassPointers* 选项默认禁用
- 不支持类卸载，*XX:+*ClassUnloading* 和 *-XX:+ClassUnloadingWithConcurrentMark* 选项默认禁用
- 不支持使用 ZGC 与 Graal 一起使用

## Epsilon - A No-Op Garbage Collector

*Epsilon GC* 是 Java 11 引入的一个新的实验性无操作垃圾收集器。 *Epsilon GC* 仅处理内存分配，并且不实现任何内存回收机制。 它对性能测试非常有用，可以与其他 GC 的成本/收益进行对比。 它可用于在测试中方便地断言内存占用和内存压力。 在极端情况下，它可能对非常短暂的任务很有用，其中内存回收将在 JVM 终止时发生，或者在低垃圾应用程序中获得最后一次延迟改进。

## Low-Overhead Heap Profiling

Java 11 中提供一种低开销的 Java 堆分配方式，旨在实现：

- 低开销足以在默认情况下持续启用
- 可以通过一个定义明确的程序接口（JVMTI）访问
- 可以对所有分配进行采样（不限于在一个特定堆区域或特定方式的分配）
- 可以以一种独立于实现的方式定义（不依赖任何特定的 GC 算法或 VM 实现）
- 可以提供关于活的和死的 Java 对象的信息

## Nest-Based Access Control

在Java SE 11中，Java 虚拟机支持将类和接口放到新的访问控制上下文中，称为嵌套。嵌套允许类和接口在逻辑上属于同一代码实体，但是被编译为不同的类文件，以访问彼此的私有成员，而无需编译器插入可访问性扩展桥接方法。嵌套是 Java SE 平台的低级机制；Java 编程语言的访问控制规则没有变化。通过生成新的类文件属性（将顶级类（或接口）及其所有嵌套类和接口放在同一个嵌套中），*javac* 编译器在编译 Java 源代码中的嵌套类和接口时使用嵌套。在检查私有构造函数，方法或字段的可访问性时，Java 虚拟机则使用这些属性，包括通过核心反射和 `java.lang.invoke.MethodHandles.Lookup` API。嵌套中的成员通过 `java.lang.Class` 的 `getNestHost` 和 `getNestMembers` 方法暴露出来。

由于嵌套成员记录在顶级类或接口（嵌套宿主）的类文件中，因此该类文件必须在运行时存在，以允许执行访问控制检查。 一般情况下都不会有问题，因为通常都是直接使用顶级类或接口。 在某些顶级类或接口仅作为嵌套类或接口的持有者并且未使用的代码中，打包工具可能已经从库或应用程序的分发中删除了该类文件。 使用基于嵌套的访问控制，如果任何嵌套类或接口需要访问彼此的私有成员，将抛出 `NoClassDefFoundError` 或 `ClassNotFoundException`。

## Key Agreement with Curve25519 and Curve448

在 Java 10 中新增了一个使用 *Curve25519* 和 *Curve448* 的密钥协商方案的实现，如 [RFC 7748 - Elliptic Curves for Security](https://tools.ietf.org/html/rfc7748) 所述。 此实现可以作为一个 Java 加密体系结构服务，但尚未纳入 TLS 1.3 实现。

## ChaCha20 and Poly1305 Cryptographic Algorithms

Java 10 实现了 [RFC 7539 - ChaCha20 and Poly1305 for IETF Protocols](https://tools.ietf.org/html/rfc7539) 中指定的 *ChaCha20* 和 *ChaCha20-poly1305* 密码。 *ChaCha20* 是一种更新的流密码，可以替代旧的、不安全的 *RC4* 流密码，示例如下：

```java
Cipher chaCha20 = Cipher.getInstance("ChaCha20");
Cipher chaCha20Poly1305 = Cipher.getInstance("ChaCha20-Poly1305");
```

## Transport Layer Security (TLS) 1.3 

Java 11 中包含了 [RFC 8446 - The Transport Layer Security (TLS) Protocol Version 1.3](https://tools.ietf.org/html/rfc8446) 的实现，对于 TLS 1.3，新的标准算法名称定义如下：

- TLS protocol version name: *TLSv1.3*
- `SSLContext` algorithm name: *TLSv1.3*
- TLS cipher suite names for TLS 1.3: *TLS_AES_128_GCM_SHA256*, *TLS_AES_256_GCM_SHA384*
- *keyType* for `X509KeyManager`: *RSASSA-PSS*
- *authType* for `X509TrustManager`: *RSASSA-PSS*

⚠️ 请注意 TLS 1.3 与之前的版本并不直接兼容。 虽然 TLS 1.3 可以以向后兼容模式实现，但在升级到 TLS 1.3 时仍然需要考虑到几个兼容性风险：

1. TLS 1.3 uses a half-close policy, while TLS 1.2 and prior versions use a duplex-close policy. For applications that depend on the duplex-close policy, there may be compatibility issues when upgrading to TLS 1.3.
2. The signature_algorithms_cert extension requires that pre-defined signature algorithms are used for certificate authentication. In practice, however, an application may use unsupported signature algorithms.
3. The DSA signature algorithm is not supported in TLS 1.3. If a server is configured to only use DSA certificates, it cannot upgrade to TLS 1.3.
4. The supported cipher suites for TLS 1.3 are not the same as TLS 1.2 and prior versions. If an application hard-codes cipher suites which are no longer supported, it may not be able to use TLS 1.3 without modifying the application code.
5. The TLS 1.3 session resumption and key update behaviors are different from TLS 1.2 and prior versions. The compatibility impact should be minimal, but it could be a risk if an application depends on the handshake details of the TLS protocols.

## Removal of Thread.destroy() and Thread.stop(Throwable) 

`Thread.destroy()` 和 `Thread.stop(Throwable)` 在很早之前就被废弃了，在 Java 11 中终于被移除

## Removal of JMC from the Oracle JDK

在 Java 11 中，Java Mission Control (JMC) 被移除，作为一个独立的软件包单独发布

## Removal of JavaFX from the Oracle JDK

JavaFX 也被移除，作为一个独立的软件包单独发布，下载地址：[openjfx.io](https://openjfx.io/)

## Removal of Java EE and CORBA Modules

在 Java 9 中被废弃的 Java EE 和 CORBA 在 Java 11 中被移除

## Deprecation of Nashorn JavaScript Engine

在 Java 8 中此入的 *Nashorn JavaScript Engine* 在 Java 11 中被废弃了，预计在将来的某个版本中移除

## Deprecation of Pack200 Tools and API

*Pack200* 工具及其 API 被废弃

## Readonly System Properties

在 Java 11 中，这些系统属性会在虚拟机启动时被缓存：

- *java.home*
- *user.home*
- *user.dir*
- *user.name*

在启动后通过 `System::setProperty` 修改这些属性并不会生效

## `java.lang.ref.Reference` Does Not Support Cloning

在 Java 11 中，调用 `java.lang.ref.References::clone` 方法会抛出 `CloneNotSupportedException`

> 更多详情，请参考：https://www.oracle.com/java/technologies/javase/11-relnote-issues.html#NewFeature