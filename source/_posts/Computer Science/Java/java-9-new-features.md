---
title: Java 9 新特性
date: 2021-05-07 09:00:00
categories: Java
tags:
  - Java
---

在 2011 年的 *JavaOne* 中，Oracle 讨论了一些他们希望在 2016 年于 Java 9 中发布的功能。*Java 9* 应当对千兆级堆拥有更好的支持，同时能够更好地集成本机代码，且拥有新的垃圾收集器 *G1* 和能够自我调节的 JVM。2016 年初，Java 9 的发布被重新定为 2017 年 3 月；2017 年 3 月时，发布日期又被拖延至 2017 年 7 月；后来又因 Java 执行委员会对 *Jigsaw* 项目实现的分歧而最终定为 2017 年 9 月 21 日，在此期间 Oracle 回应了部分疑问，并对一些重要的技术问题进行了修正。在 2017 年 6 月的最后几天，JCP 对拟议的模块系统方案达成了共识。Java 9 的首个发布候选版于 2017 年 8 月 9 日发布，首个稳定版于 2017 年 9 月 21 日发布。

## Java Platform Module System

模块化算是 Java 9 的重量级特性了，它提供了类似 OSGi 框架的功能，模块有依赖的概念，可以导出公共 API 并隐藏实现细节。其主要的目的是提供模块化的 JVM，使之能在低端设备上运行，JVM 只能运行应用所需的那些模块和 API，关于模块的详细描述，参见：[Module Summary](http://cr.openjdk.java.net/~mr/jigsaw/ea/module-summary.html)。从 Java 9 开始，像 *com.sun.\** 这些 JVM 内部的 API 在应用程序中不再可访问了。

类似于 *package-info.java*，模块的描述是在 *module-info.java* 中，如：

```java
module com.example.modules.car {
    requires com.example.modules.engines;
    exports com.example.modules.car.handling;
}
```

想要深入了解 Java 9 的模块化，参见：[Project Jigsaw: Module System Quick-Start Guide](http://openjdk.java.net/projects/jigsaw/quick-start)

## New HTTP Client

在 Java 9 中引入了期待已久的 `HttpURLConnection` 的替代方案，新的 API 位于 `java.net.http` 包中，支持 *HTTP/2*  协议和 *Web Socket* 握手，其性能与 *Apache Http Client* 、*Netty* 以及 *Jetty* 相当。

通过新的 *HTTP Client API* ，可以快速创建 `GET` 请求：

```java
HttpRequest request = HttpRequest.newBuilder()
  .uri(new URI("https://postman-echo.com/get"))
  .GET()
  .build();

HttpResponse<String> response = HttpClient.newHttpClient()
  .send(request, HttpResponse.BodyHandler.asString());
```

## Process API

Java 9 中对访问和管理系统进程进行了增强，通过  `java.lang.ProcessHandle` 可以访问更多进程相关的信息：

```java
ProcessHandle self = ProcessHandle.current();
long PID = self.getPid();
ProcessHandle.Info procInfo = self.info();

Optional<String[]> args = procInfo.arguments();
Optional<String> cmd =  procInfo.commandLine();
Optional<Instant> startTime = procInfo.startInstant();
Optional<Duration> cpuUsage = procInfo.totalCpuDuration();
```

通过 `destroy()` 停止运行的子线程：

```java
childProc = ProcessHandle.current().children();
childProc.forEach(procHandle -> {
    assertTrue("Could not kill process " + procHandle.getPid(), procHandle.destroy());
});
```

## The Java Shell

Java 9 引入 了 *jshell* 命令行工具，允许在命令行中直接运行代码片段，而无需将代码放在类里面，类似于其它基于 JVM 的语言，如 Groovy，Scala。之所以推出 *jshell*，其主要原因在 Java 语言相对于其它语言来说，上手的门槛略高，像 *python* 直接在命令行下就能完成 *hello world*，而 Java 还需要打开编辑器，再声明一个类，然后编译完才能运行，实在是太烦琐了，完全不利于 Java 向教学语言的转化。

除了命令行之外，*jshell* 还提供了 API，允许其它工具集成 *jshell* 的功能。

## Multi-Release JAR Files

在 Java 9 中引入了一个比较有趣的特性是支持同一个 jar 针对多个不同的 Java 版本进行发布，通过在 *MANIFEST.MF* 文件中设置 `Multi-Release: true`，该 jar 文件就变成了 *Multi-Release JAR (MRJAR)*，Java 运行时将根据当前的主版本选择合适的 jar 版本。该文件的结构如下：

```
jar root
  - A.class
  - B.class
  - C.class
  - D.class
  - META-INF
    - versions
      - 9
        - A.class
        - B.class
      - 10
        - A.class
```

- 当 JDK < 9 时，只有根目录中的类对 Java 运行时是可见的
- 在 JDK 9 上，*A.class* 和 *B.class* 将从 *root/META-INF/versions/9/* 中加载
- 在 JDK 10 上， *A.class* 将从 *root/META-INF/versions/10/* 中加载

*Multi-Release Jar* 使得项目可以维护针对不同 Java 平台的不同版本的代码，而且分发代码只需要一个 jar，一个版本（Maven artifact 版本）就够了。为了实现这个特性，自然免不了修改处理 JAR 的 API，比如：`JarFile` 和 `URLClassLoader`。此外，许多 JDK 工具为了适应新的格式也被改造过，如：*java*，*javac*，*jar*。

## Multi-Resolution Images

JDK 9 中新增了一个新的接口 [MultiResolutionImage](http://download.java.net/java/jdk9/docs/api/java/awt/image/MultiResolutionImage.html) 及其基础实现类 [BaseMultiResolutionImage](http://download.java.net/java/jdk9/docs/api/java/awt/image/BaseMultiResolutionImage.html)，它可以封装几种不同尺寸的图像变体，当给定了宽高，它可以用于选择最好的图像变体。

## Reactive Stream Flow API

在 JDK 9 中引入了 [java.util.concurrent.Flow](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html) 类，它提供了一套 *Reactive Stream* 相关的标准的接口集，这些接口通过发布-订阅机制让数据流的生产者与消费者之前进行异步通信，类似于 [RxJava](https://github.com/ReactiveX/RxJava)。

## Make G1 the Default Garbage Collector

在 Java 9 之前，服务器上的默认垃圾回收器是并行 GC，客户端的默认垃圾回收器是串行 GC，在 Java 9 中，服务器的默认 的 GC 改为从 Java 7 开始引入的 G1 垃圾回收器。

G1 是一个并行的、低暂停的垃圾回收器，对于具有较大堆空间的多核机器特别适用。关于 G1 垃圾回收器的概述，参见：[Getting Started with the G1 Garbage Collector](http://www.oracle.com/technetwork/tutorials/tutorials-1876574.html)。除此之外，并发标记清除（CMS）回收器已经被废弃。

## Compact Strings

Java 9 对 `String` 类作了内部优化，以减少内存消耗。因为大多数字符串并不需要 2 个字节表示的字符。实现的原理是在将字符数组改为字节数组，并在字节数组中增个一个字节用于表示字节数组的编码：

- Latin-1 占用 1 个字节
- UTF-16 占用 2 个字节

字符串根据要存储的内容确定字节数组的编码。

这个更改是内部的，不影响 `String` 对外的 API 以及其相关的类，如 `StringBuilder`、`StringBuffer` 等。若要禁用字符串压缩，可以使用 *-XX:-CompactStrings*  选项。

## Stack-Walking API

在 Java 9 之前，只能通过 `sun.reflect.Reflection` 遍历线程栈帧，特别是 `sun.reflect.Reflection::getCallerClass()`。有一些库依赖于这个方法，但是已经被废弃掉了，取而代之的是 JDK 9 提供的标准的 API -- [StackWalker](https://docs.oracle.com/javase/9/docs/api/java/lang/StackWalker.html)，它通过延迟访问栈帧来提高性能。应用程序可以通过这个 API 来遍历调用栈，并在类中过滤。这个类中，有两个方法值得注意：

- `public &lt;T&gt; T walk(Function&lt;Stream&lt;StackFrame&gt;, T&gt; function)` - 从顶部帧开始对当前线程栈帧进行遍历，并对栈帧应用指定的 *Function*。
- `public Class<?> getCallerClass()` - 返回调用此方法的类

`StackWalker` 是线程安全的，它可以在多线程环境中使用同一实例遍历线程栈帧。

## Compiler Control

Java 9 提供了一种通过编译器指令选项来控制 Java 虚拟机编译的途径，控制的级别包括：

- 运行时可管理的
- 特定的方法

编译器指令用于告诉 JVM 如何编译，它能精确的控制到方法上下文。指令可以用于编写 JVM 测试程序，而且测试过程中不需要重新启动整个 JVM，对于绕过一些 JVM 的 bug 也是非常的实用。

在程序启动时，通过在命令行可以指定指令文件，如下所示：

```bash
java -XX:+UnlockDiagnosticVMOptions -XX:CompilerDirectivesFile=File_A.json TestProgram
```

还可以通过诊断命令从正在运行的程序中添加或删除指令，也可以在程序启时开启自动打印指令栈[^1]，如下所示：

```bash
java -XX:+UnlockDiagnosticVMOptions -XX:+CompilerDirectivesPrint -XX:CompilerDirectivesFile=File_A.json TestProgram 
```

想要深入了解，请参见：[Oracle JDK 9: Compiler Control](https://docs.oracle.com/javase/9/vm/compiler-control1.htm)。

## Segmented Code Cache

在 Java 9 中，代码缓存由原来的一个堆分成了多个堆，每个堆都包含一个特定类型的编译代码，这样做的好处是能够分离出不同属性的代码，编译代码有 3 种不同的顶级类型：

- JVM internal(non-method) code

  主要包含非方法的代码，如编译器缓冲区和字节码解释器，此代码类型会一直驻存在代码缓存中

- Profiled-Code

  包含了一些经过简单优化的、生命周期很短的方法

- Non-profiled Code

  包含完全优化的，*non-profiled* 方法，可能有很长的生命周期

非方法代码堆的大小固定为 3MB，用于 JVM 内部和编译器缓冲区，编译器缓冲区的大小根据编译器线程 C1/C2 的数量调整，剩下的代码缓存空间则均分给 *profiled* 和 *non-profiled* 代码堆。代码堆的大小也可以通过命令行开关来控制：

- -XX:NonMethodCodeHeapSize

  设置包含非方法代码的代码堆大小

- -XX:ProfiledCodeHeapSize

  设置包含 *profiled* 代码的代码堆大小

- -XX:NonProfiledCodeHeapSize

  设置包含 *non-profiled* 代码的代码堆大小

## Dynamic Linking of Language-Defined Object Models

Java 9 推出动态链接这一特性主要是为 JVM 进程中的多种编程语言提供一种在运行时进行互操作的能力，这样对象可以在不同的 runtime 之间进行传递，由一种语言的编译器发出 `invokedynamic` 调用站点，由其它的语言的链接器来链接，比如，Java 8 推出的 [Nashorn](../java-se-8/#nashorn-javascript-engine)，但 *Nashorn* 的局限性在于它是专门为 *JavaScript* 语言提供的 JVM 引擎，而不能广泛地应用于其它语言，但 *Nashorn* 证明了通过 `invokedynamic` 实现跨语言的互调是可行的。

在 JDK 8 中 *jdk.internal.dynalink.\** 包下的代码作为 *Nashorn* 的内部依赖在 JDK 9 中作为 [jdk.dynalink](https://docs.oracle.com/javase/9/docs/api/jdk.dynalink-summary.html) 模块被公开。

## JVM Compiler Interface

对于做编译器优化的开发者来说，*JVM CI* 无疑是一个很值得期待的特性，它允许 Java 写的编译器能被 JVM 用来进行动态编译。在 Java 9 中，它被当作一个实验性的特性引入。

## Version-String Scheme

在过去的 20 多年里，Java 的版本管理一直比较混乱。 前两个主要版本是 JDK 1.0 和 JDK 1.1。 从 1.2 到 1.5，平台被称为 J2SE (标准版本)。 从 1.5 开始，版本控制变成了 Java 5，然后是 Java 6，等等。 然而，当你使用已安装的 Java 8 运行 Java 版本时，输出仍然是 1.8 而不是 8。 甲骨文收购 Sun 后推出的当前版本版本版本方案如下：

- 对于 *Limited Updates Release*（没有重要的安全修复），版本号是 20 的倍数
- 对于重要补丁更新（修复安全漏洞），版本号的计算方法是在先前的 *Limited Updates Release* 基础上以 5 的倍数递增，当版本号不为奇数的话，再加 1 凑成奇数

### Version Numbers

从 Java 9 开始，版本号的格式改为：*\$MAJOR.\$MINOR.\$SECURITY.\$PATCH*

 - *MAJOR* - 主版本号，对于 JDK 9 来说， *MAJOR = 9*
 - *MINOR* - 次版本号，随着 bug 修复及标准 API 的增强的发布而递增
 - *SECURITY* - 安全级别，随着重要安全修复的发布而递增，当 *MINOR* 递增时，*SECURITY* 会重置为 `0`
 - *PATCH* - 非安全性修复的补丁版本

 ### Version Strings

 版本字符串是由 *Version Number*  加上一些其它信息（如：early-access release identifier 或 build number）组成：

- *\$VNUM(-\$PRE)?\\+\$BUILD(-\$OPT)?*
- *\$VNUM-\$PRE(-\$OPT)?*
- *\$VNUM(+-\$OPT)?*

其中：

- *PRE* - 预发布标识
- *BUILD* - build number
- *OPT* - 其它可选信息，如：时间戳

下面是现有和即将推出的对 JDK 9 进行版本控制的方案对比：

| Release Type | long (Existing) | short (Existing) | long (New) | short (New) |
| ------------ | --------------- | ---------------- | ---------- | ----------- |
| Early Access | 1.9.0-ea-b19    | 9-ea             | 9-ea+19    | 9-ea        |
| Major        | 1.9.0-b100      | 9                | 9+100      | 9           |
| Security #1  | 1.9.0_5-b20     | 9u5              | 9.0.1+20   | 9.0.1       |
| Security #2  | 1.9.0_11-b12    | 9u11             | 9.0.2+12   | 9.0.2       |
| Minor #1     | 1.9.0_20-b62    | 9u20             | 9.1.2+62   | 9.1.2       |
| Security #3  | 1.9.0_25-b15    | 9u25             | 9.1.3+15   | 9.1.3       |
| Security #4  | 1.9.0_31-b08    | 9u31             | 9.1.4+8    | 9.1.4       |
| Minor #2     | 1.9.0_40-b45    | 9u40             | 9.2.4+45   | 9.2.4       |

## Remove the JVM TI hprof Agent

在 Java 9 之前，prof JVM native agent 被用来转储堆、追踪 CPU，之所以移除它是因为有了更好的替代方案 -- [jmap](https://docs.oracle.com/javase/7/docs/technotes/tools/share/jmap.html) 和 [Java VisualVM](https://visualvm.github.io/)。

## Remove the jhat Tool

*jhat* 工具是用来在浏览器中查看堆的 dump 信息，之所以被移除也是因为有了更好的替代方案。

## Compile for Older Platform Versions

在 Java 9 之前是使用 *-source* 选项设置语言规范，用 *-target* 选项生成特定版本的字节码，尽管如此，由于编译器会把已编译的类链接到当前 JDK 版本的平台 API，这会导致运行时的问题（除非重载 bootclasspath）。在 Java 9 中，为能能够编译成旧的版本，这些选项由 *--release* 替代。

*--release* 等价于 *-source N -target N -bootclasspath &lt;bootclasspath-from-N&gt;*

JDK 9 通过维护旧版本的 API 签名数据来实现这一特性，这些签名数据位于：*$JDK_HOME/lib/ct.sym*

## Applet API deprecated

由于 web 浏览器对 Java 插件的支持越来越少，Applet API 在 Java 9 中被废弃，但不确定将来是否会被删除。

## Java 语言的一些小变化

- 允许在私有实例方法上使用 `@SafeVargs`。 `@SafeVarargs` 注释只能应用于不能重写的方法，包括静态方法和最终实例方法。 私有实例方法是 `@SafeVargs` 可以容纳的另一个用例。
- Java SE 7 中的 *try-with-resources* 语句要求对语句管理的每个资源声明一个新的变量，而在 Java SE 9 中 允许有效的 `final` 变量作为资源在 *try-with-resources* 语句中使用。
- 如果参数类型的推导类型是可表示的，则允许带有匿名类的 `<>` 操作符。 由于推导类型使用了具有 `<>` 操作符的匿名类构造函数可能不属于由签名属性支持的一组类型，所以  Java SE 7 中禁止使用带匿名类的 `<>` 操作符。
- 禁止 `_` 作为标识符
- 接口支持 `private` 方法，从而使接口的非抽象方法能够在它们之间共享代码。

> 更多详情，请参考：https://docs.oracle.com/javase/9/whatsnew/toc.htm