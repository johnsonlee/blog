---
title: What's New in Java 9
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 09:00:00
lang: en
i18n_key: java-9-new-features
---

At *JavaOne* 2011, Oracle discussed features they hoped to release with Java 9 in 2016. *Java 9* was expected to offer better support for gigabyte-scale heaps, improved native code integration, a new *G1* garbage collector, and a self-tuning JVM. In early 2016, Java 9's release was rescheduled to March 2017; in March 2017, it was pushed back to July 2017; and it was ultimately set to September 21, 2017, due to disagreements within the Java Executive Committee over the *Jigsaw* project implementation. During this period, Oracle addressed some concerns and made important technical corrections. In the final days of June 2017, the JCP reached consensus on the proposed module system. The first release candidate of Java 9 came out on August 9, 2017, and the first stable release on September 21, 2017.

## Java Platform Module System

The module system is arguably the heavyweight feature of Java 9. It provides functionality similar to the OSGi framework -- modules have dependency concepts and can export public APIs while hiding implementation details. The primary goal is to provide a modular JVM that can run on low-end devices, with the JVM loading only the modules and APIs required by the application. For a detailed description of modules, see: [Module Summary](http://cr.openjdk.java.net/~mr/jigsaw/ea/module-summary.html). Starting from Java 9, internal JVM APIs like *com.sun.\** are no longer accessible from applications.

Similar to *package-info.java*, a module is described in *module-info.java*:

```java
module com.example.modules.car {
    requires com.example.modules.engines;
    exports com.example.modules.car.handling;
}
```

For a deeper dive into Java 9 modularity, see: [Project Jigsaw: Module System Quick-Start Guide](http://openjdk.java.net/projects/jigsaw/quick-start)

## New HTTP Client

Java 9 introduced the long-awaited replacement for `HttpURLConnection`. The new API resides in the `java.net.http` package and supports the *HTTP/2* protocol and *WebSocket* handshake, with performance comparable to *Apache Http Client*, *Netty*, and *Jetty*.

With the new *HTTP Client API*, you can quickly create a `GET` request:

```java
HttpRequest request = HttpRequest.newBuilder()
  .uri(new URI("https://postman-echo.com/get"))
  .GET()
  .build();

HttpResponse<String> response = HttpClient.newHttpClient()
  .send(request, HttpResponse.BodyHandler.asString());
```

## Process API

Java 9 enhanced the ability to access and manage system processes. `java.lang.ProcessHandle` provides access to more process-related information:

```java
ProcessHandle self = ProcessHandle.current();
long PID = self.getPid();
ProcessHandle.Info procInfo = self.info();

Optional<String[]> args = procInfo.arguments();
Optional<String> cmd =  procInfo.commandLine();
Optional<Instant> startTime = procInfo.startInstant();
Optional<Duration> cpuUsage = procInfo.totalCpuDuration();
```

Stopping running child processes via `destroy()`:

```java
childProc = ProcessHandle.current().children();
childProc.forEach(procHandle -> {
    assertTrue("Could not kill process " + procHandle.getPid(), procHandle.destroy());
});
```

## The Java Shell

Java 9 introduced the *jshell* command-line tool, allowing code snippets to be run directly from the command line without wrapping them in a class -- similar to other JVM-based languages like Groovy and Scala. The main motivation was that Java has a higher barrier to entry compared to other languages. *Python*, for instance, can run a *hello world* right from the command line, while Java requires opening an editor, declaring a class, compiling, and then running -- far too tedious to serve as a teaching language.

Beyond the command line, *jshell* also provides an API that allows other tools to integrate *jshell* functionality.

## Multi-Release JAR Files

Java 9 introduced an interesting feature: support for releasing a single jar targeting multiple Java versions. By setting `Multi-Release: true` in the *MANIFEST.MF* file, the jar becomes a *Multi-Release JAR (MRJAR)*, and the Java runtime selects the appropriate version based on the current major version. The file structure looks like this:

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

- When JDK < 9, only the classes in the root directory are visible to the Java runtime
- On JDK 9, *A.class* and *B.class* are loaded from *root/META-INF/versions/9/*
- On JDK 10, *A.class* is loaded from *root/META-INF/versions/10/*

*Multi-Release Jars* allow projects to maintain different versions of code for different Java platforms, while only needing a single jar and a single version (Maven artifact version) for distribution. To enable this feature, the APIs that handle JARs were naturally modified, such as `JarFile` and `URLClassLoader`. Additionally, many JDK tools were adapted to the new format, including *java*, *javac*, and *jar*.

## Multi-Resolution Images

JDK 9 added a new interface [MultiResolutionImage](http://download.java.net/java/jdk9/docs/api/java/awt/image/MultiResolutionImage.html) and its base implementation [BaseMultiResolutionImage](http://download.java.net/java/jdk9/docs/api/java/awt/image/BaseMultiResolutionImage.html). It can encapsulate several image variants of different sizes and, given a width and height, select the best variant.

## Reactive Stream Flow API

JDK 9 introduced the [java.util.concurrent.Flow](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html) class, which provides a set of standard *Reactive Stream* interfaces. These interfaces enable asynchronous communication between data stream producers and consumers through a publish-subscribe mechanism, similar to [RxJava](https://github.com/ReactiveX/RxJava).

## Make G1 the Default Garbage Collector

Before Java 9, the default garbage collector for servers was the parallel GC, and for clients it was the serial GC. In Java 9, the server default was changed to G1, which had been introduced in Java 7.

G1 is a parallel, low-pause garbage collector particularly suited for multi-core machines with large heap spaces. For an overview of the G1 garbage collector, see: [Getting Started with the G1 Garbage Collector](http://www.oracle.com/technetwork/tutorials/tutorials-1876574.html). Additionally, the Concurrent Mark Sweep (CMS) collector was deprecated.

## Compact Strings

Java 9 optimized the `String` class internally to reduce memory consumption, since most strings do not need 2-byte characters. The implementation changes the underlying storage from a character array to a byte array, with an additional byte indicating the encoding:

- Latin-1 uses 1 byte
- UTF-16 uses 2 bytes

The encoding of the byte array is determined by the content being stored.

This change is internal and does not affect `String`'s public API or related classes like `StringBuilder` and `StringBuffer`. To disable string compaction, use the *-XX:-CompactStrings* option.

## Stack-Walking API

Before Java 9, stack frame traversal required `sun.reflect.Reflection`, particularly `sun.reflect.Reflection::getCallerClass()`. Some libraries depended on this method, but it was deprecated. JDK 9 provides a standard replacement -- [StackWalker](https://docs.oracle.com/javase/9/docs/api/java/lang/StackWalker.html), which improves performance through lazy access to stack frames. Applications can use this API to traverse the call stack and filter by class. Two methods are worth noting:

- `public <T> T walk(Function<Stream<StackFrame>, T> function)` - traverses the current thread's stack frames starting from the top and applies the specified *Function*
- `public Class<?> getCallerClass()` - returns the class that called this method

`StackWalker` is thread-safe and can use the same instance to traverse stack frames across multiple threads.

## Compiler Control

Java 9 provides a way to control JVM compilation through compiler directive options. The control levels include:

- Runtime manageable
- Method specific

Compiler directives tell the JVM how to compile and can target individual method contexts. Directives can be used to write JVM test programs without restarting the entire JVM, and are also useful for working around JVM bugs.

At program startup, directive files can be specified on the command line:

```bash
java -XX:+UnlockDiagnosticVMOptions -XX:CompilerDirectivesFile=File_A.json TestProgram
```

Directives can also be added or removed from a running program via diagnostic commands. You can enable automatic printing of the directive stack at startup[^1]:

```bash
java -XX:+UnlockDiagnosticVMOptions -XX:+CompilerDirectivesPrint -XX:CompilerDirectivesFile=File_A.json TestProgram
```

For more details, see: [Oracle JDK 9: Compiler Control](https://docs.oracle.com/javase/9/vm/compiler-control1.htm).

## Segmented Code Cache

In Java 9, the code cache was split from a single heap into multiple heaps, each containing a specific type of compiled code. This allows separation of code with different properties. There are three top-level types of compiled code:

- JVM internal (non-method) code

  Primarily contains non-method code such as compiler buffers and the bytecode interpreter. This code type permanently resides in the code cache.

- Profiled-Code

  Contains lightly optimized, short-lived methods.

- Non-profiled Code

  Contains fully optimized *non-profiled* methods that may have long lifetimes.

The non-method code heap has a fixed size of 3MB for JVM internals and compiler buffers. The compiler buffer size is adjusted based on the number of C1/C2 compiler threads. The remaining code cache space is evenly split between *profiled* and *non-profiled* code heaps. Code heap sizes can also be controlled via command-line switches:

- -XX:NonMethodCodeHeapSize

  Sets the size of the code heap containing non-method code

- -XX:ProfiledCodeHeapSize

  Sets the size of the code heap containing *profiled* code

- -XX:NonProfiledCodeHeapSize

  Sets the size of the code heap containing *non-profiled* code

## Dynamic Linking of Language-Defined Object Models

This feature was introduced in Java 9 to provide interoperability between multiple programming languages within a JVM process at runtime. Objects can be passed between different runtimes, where an `invokedynamic` call site emitted by one language's compiler is linked by another language's linker. For example, [Nashorn](../java-se-8/#nashorn-javascript-engine) introduced in Java 8 proved that cross-language invocation through `invokedynamic` is feasible, though *Nashorn*'s limitation was that it was specific to *JavaScript* rather than broadly applicable to other languages.

In JDK 8, the code under *jdk.internal.dynalink.\** served as an internal dependency of *Nashorn*. In JDK 9, it was made public as the [jdk.dynalink](https://docs.oracle.com/javase/9/docs/api/jdk.dynalink-summary.html) module.

## JVM Compiler Interface

For developers working on compiler optimizations, *JVM CI* is a highly anticipated feature. It allows compilers written in Java to be used by the JVM for dynamic compilation. In Java 9, it was introduced as an experimental feature.

## Version-String Scheme

Over the past 20+ years, Java's versioning has been rather chaotic. The first two major versions were JDK 1.0 and JDK 1.1. From 1.2 to 1.5, the platform was called J2SE (Standard Edition). Starting from 1.5, versioning became Java 5, then Java 6, and so on. However, running `java -version` with an installed Java 8 still outputs 1.8 rather than 8. The versioning scheme after Oracle acquired Sun works as follows:

- For *Limited Update Releases* (without critical security fixes), the version number is a multiple of 20
- For Critical Patch Updates (security vulnerability fixes), the version number is calculated by incrementing from the previous *Limited Update Release* by a multiple of 5, adding 1 if the result is even to make it odd

### Version Numbers

Starting from Java 9, the version number format is: *\$MAJOR.\$MINOR.\$SECURITY.\$PATCH*

 - *MAJOR* - major version number; for JDK 9, *MAJOR = 9*
 - *MINOR* - minor version number, incremented with bug fix and standard API enhancement releases
 - *SECURITY* - security level, incremented with critical security fix releases; resets to `0` when *MINOR* is incremented
 - *PATCH* - patch version for non-security fixes

 ### Version Strings

 A version string consists of the *Version Number* plus additional information (such as early-access release identifier or build number):

- *\$VNUM(-\$PRE)?\\+\$BUILD(-\$OPT)?*
- *\$VNUM-\$PRE(-\$OPT)?*
- *\$VNUM(+-\$OPT)?*

Where:

- *PRE* - pre-release identifier
- *BUILD* - build number
- *OPT* - other optional information, such as a timestamp

Here is a comparison of the existing and new versioning schemes for JDK 9:

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

Before Java 9, the hprof JVM native agent was used for heap dumps and CPU tracing. It was removed because better alternatives exist -- [jmap](https://docs.oracle.com/javase/7/docs/technotes/tools/share/jmap.html) and [Java VisualVM](https://visualvm.github.io/).

## Remove the jhat Tool

The *jhat* tool was used to view heap dump information in a browser. It was also removed in favor of better alternatives.

## Compile for Older Platform Versions

Before Java 9, *-source* was used to set the language specification level and *-target* to generate bytecode for a specific version. However, the compiler would link compiled classes to the current JDK version's platform API, which could cause runtime issues (unless the bootclasspath was overridden). In Java 9, these options are replaced by *--release* for compiling to older versions.

*--release* is equivalent to *-source N -target N -bootclasspath &lt;bootclasspath-from-N&gt;*

JDK 9 implements this by maintaining API signature data from older versions, located at: *$JDK_HOME/lib/ct.sym*

## Applet API deprecated

As web browsers increasingly dropped support for Java plugins, the Applet API was deprecated in Java 9, though it remains uncertain whether it will be removed in the future.

## Small Language Changes

- `@SafeVarargs` can now be used on private instance methods. The `@SafeVarargs` annotation can only be applied to methods that cannot be overridden, including static methods and final instance methods. Private instance methods are another valid use case.
- Java SE 7's *try-with-resources* statement required declaring a new variable for each managed resource. Java SE 9 allows effectively `final` variables to be used as resources in *try-with-resources* statements.
- The `<>` operator is now allowed with anonymous classes when the inferred type is denotable. In Java SE 7, the `<>` operator with anonymous class constructors was prohibited because the inferred type might not belong to the set of types supported by the signature attribute.
- `_` is no longer allowed as an identifier.
- Interfaces now support `private` methods, enabling non-abstract methods within an interface to share code.

> For more details, see: https://docs.oracle.com/javase/9/whatsnew/toc.htm
