---
title: "What's New in Java 11"
lang: en
i18n_key: java-11-new-features
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 11:00:00
---

Java 11 was released on September 25, 2018 and is currently open for bug fixes. It provides LTS (Long-Term Support), which is why newer versions of *IntelliJ IDEA* and *Android Studio* have upgraded their bundled JDK to Java 11.

## Local-Variable Syntax for Lambda Parameters

Local variable type inference was introduced in Java 10 but only supported regular variable declarations. Java 11 extends this with more powerful type inference that supports *Lambda* parameters:

```java
(var x, var y) -> x.process(y);
```

This is equivalent to:

```java
(x, y) -> x.process(y);
```

Note that when using `var` to declare parameter types, all parameters must use `var`. The following examples are invalid:

```java
(var x, y) -> x.process(y);
(var x, int y) -> x.process(y);
```

## Launch Single-File Source-Code Programs

Since Java 9 introduced *jshell*, Java has been evolving toward scripting capabilities. In Java 11, you can run a single *java* file directly on Unix-like systems using a *shebang* directive:

```java
#!/usr/bin/java --source 11

public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java 11!");
    }
}
```

Then run it directly from the command line:

```shell
chmod +x hello
./hello
```

> Note: The shebang file must not have a *.java* extension, or the Java Launcher will treat it as a regular Java source file and report `error: illegal character: '#'`

## Unicode 10

Java 11 adds support for [Unicode Standard](http://www.unicode.org/standard/standard.html) [Version 10.0](http://unicode.org/versions/Unicode10.0.0/), primarily in the following classes:

- *java.lang* : `Character` and `String`
- *java.awt.font* : `NumericShaper`
- *java.text* : `Bidi`, `BreakIterator`, and `Normalizer`

## HTTP Client (Standard)

The *HTTP Client* introduced in Java 9 has been standardized in Java 11. The implementation was almost entirely rewritten, moving from the blocking HTTP/1.1 implementation to a fully asynchronous design. In the new implementation, data flows are tracked more effectively, greatly reducing the number of concepts and code complexity while maximizing reuse between HTTP/1.1 and HTTP/2.

## Lazy Allocation of Compiler Threads

Java 11 adds a new command-line flag: *-XX:+UseDynamicNumberOfCompilerThreads* for dynamically controlling compiler threads. With tiered compilation enabled by default, the VM would start many compiler threads on multi-CPU systems regardless of available memory or compilation requests. Since threads consume memory even when idle (which is most of the time), this leads to inefficient resource usage.

To address this, Java 11 changed the implementation to start only one compiler thread per compilation type (see: [Understanding Java JIT Compilation with JITWatch, Part 1](https://www.oracle.com/technical-resources/articles/java/architect-evans-pt1.html)) during startup, dynamically managing subsequent thread creation and shutdown. This is controlled by the new flag *-XX:+UseDynamicNumberOfCompilerThreads*, which is enabled by default.

## ZGC - A Scalable Low-Latency Garbage Collector

ZGC is a scalable low-latency garbage collector designed to achieve the following goals:

- Pause times must not exceed 10 milliseconds
- Pause times must not increase with heap size or live set size
- Handle heap sizes ranging from a few hundred megabytes to multi-terabytes

ZGC is a concurrent garbage collector, meaning all heavy lifting (marking, compaction, reference processing, string table cleanup, etc.) happens while Java threads continue executing. This drastically limits the negative impact of garbage collection on application response times.

The benchmark comparison between ZGC and G1 is stunning -- under 2 milliseconds:

|                    |         ZGC          |           G1            |
| -----------------: | :------------------: | :---------------------: |
|                avg | 1.091ms (+/-0.215ms) | 156.806ms (+/-71.126ms) |
|    95th percentile |       1.380ms        |        316.672ms        |
|    99th percentile |       1.512ms        |        428.095ms        |
|  99.9th percentile |       1.663ms        |        543.846ms        |
| 99.99th percentile |       1.681ms        |        543.846ms        |
|                max |       1.681ms        |        543.846ms        |

As an experimental feature in Java 11, enabling ZGC requires combining *-XX:+UnlockExperimentalVMOptions* with *-XX:+UseZGC*. It has the following limitations:

- Only available on Linux/x64.
- Does not support *Compressed Oops*[^2] or *Compressed Class Pointers*[^3]. *-XX:+UseCompressedOops* and *-XX:+UseCompressedClassPointers* are disabled by default.
- Does not support class unloading. *-XX:+ClassUnloading* and *-XX:+ClassUnloadingWithConcurrentMark* are disabled by default.
- Cannot be used with Graal.

## Epsilon - A No-Op Garbage Collector

*Epsilon GC* is a new experimental no-op garbage collector introduced in Java 11. *Epsilon GC* handles memory allocation only and does not implement any memory reclamation. It is very useful for performance testing to compare costs and benefits against other GCs. It can also conveniently assert memory footprint and memory pressure in tests. In extreme cases, it may be useful for very short-lived tasks where memory reclamation occurs at JVM termination, or for achieving the last bit of latency improvement in low-garbage applications.

## Low-Overhead Heap Profiling

Java 11 provides a low-overhead heap allocation profiling mechanism designed to be:

- Low-overhead enough to be continuously enabled by default
- Accessible through a well-defined programmatic interface (JVMTI)
- Capable of sampling all allocations (not limited to a specific heap region or allocation method)
- Defined in an implementation-independent manner (not dependent on any specific GC algorithm or VM implementation)
- Capable of providing information about both live and dead Java objects

## Nest-Based Access Control

In Java SE 11, the JVM supports placing classes and interfaces in a new access control context called a nest. Nests allow classes and interfaces that logically belong to the same code entity -- but are compiled into different class files -- to access each other's private members without the compiler inserting accessibility-broadening bridge methods. Nests are a low-level mechanism of the Java SE platform; the access control rules of the Java programming language are unchanged. By generating new class file attributes that place the top-level class (or interface) and all its nested classes and interfaces in the same nest, *javac* uses nests when compiling nested classes and interfaces in Java source code. The JVM uses these attributes when checking accessibility of private constructors, methods, or fields, including through core reflection and the `java.lang.invoke.MethodHandles.Lookup` API. Nest members are exposed through the `getNestHost` and `getNestMembers` methods of `java.lang.Class`.

Since nest membership is recorded in the top-level class or interface (the nest host) class file, that class file must be present at runtime for access control checks. This is generally not an issue since the top-level class or interface is usually used directly. In code where the top-level class or interface serves only as a holder for nested classes and is not used itself, packaging tools may have removed its class file from the distribution. With nest-based access control, if any nested class or interface needs to access each other's private members, a `NoClassDefFoundError` or `ClassNotFoundException` will be thrown.

## Key Agreement with Curve25519 and Curve448

Java 11 adds an implementation of key agreement using *Curve25519* and *Curve448*, as described in [RFC 7748 - Elliptic Curves for Security](https://tools.ietf.org/html/rfc7748). This implementation is available as a Java Cryptography Architecture service but has not yet been incorporated into the TLS 1.3 implementation.

## ChaCha20 and Poly1305 Cryptographic Algorithms

Java 11 implements the *ChaCha20* and *ChaCha20-Poly1305* ciphers specified in [RFC 7539 - ChaCha20 and Poly1305 for IETF Protocols](https://tools.ietf.org/html/rfc7539). *ChaCha20* is a newer stream cipher that can replace the older, insecure *RC4* stream cipher:

```java
Cipher chaCha20 = Cipher.getInstance("ChaCha20");
Cipher chaCha20Poly1305 = Cipher.getInstance("ChaCha20-Poly1305");
```

## Transport Layer Security (TLS) 1.3

Java 11 includes an implementation of [RFC 8446 - The Transport Layer Security (TLS) Protocol Version 1.3](https://tools.ietf.org/html/rfc8446). For TLS 1.3, the new standard algorithm names are:

- TLS protocol version name: *TLSv1.3*
- `SSLContext` algorithm name: *TLSv1.3*
- TLS cipher suite names for TLS 1.3: *TLS_AES_128_GCM_SHA256*, *TLS_AES_256_GCM_SHA384*
- *keyType* for `X509KeyManager`: *RSASSA-PSS*
- *authType* for `X509TrustManager`: *RSASSA-PSS*

Note that TLS 1.3 is not directly compatible with previous versions. Although TLS 1.3 can be implemented in a backward-compatible mode, there are several compatibility risks to consider when upgrading:

1. TLS 1.3 uses a half-close policy, while TLS 1.2 and prior versions use a duplex-close policy. For applications that depend on the duplex-close policy, there may be compatibility issues when upgrading to TLS 1.3.
2. The signature_algorithms_cert extension requires that pre-defined signature algorithms are used for certificate authentication. In practice, however, an application may use unsupported signature algorithms.
3. The DSA signature algorithm is not supported in TLS 1.3. If a server is configured to only use DSA certificates, it cannot upgrade to TLS 1.3.
4. The supported cipher suites for TLS 1.3 are not the same as TLS 1.2 and prior versions. If an application hard-codes cipher suites which are no longer supported, it may not be able to use TLS 1.3 without modifying the application code.
5. The TLS 1.3 session resumption and key update behaviors are different from TLS 1.2 and prior versions. The compatibility impact should be minimal, but it could be a risk if an application depends on the handshake details of the TLS protocols.

## Removal of Thread.destroy() and Thread.stop(Throwable)

`Thread.destroy()` and `Thread.stop(Throwable)` were deprecated long ago and are finally removed in Java 11.

## Removal of JMC from the Oracle JDK

In Java 11, Java Mission Control (JMC) was removed from the Oracle JDK and released as a standalone package.

## Removal of JavaFX from the Oracle JDK

JavaFX was also removed and released as a standalone package, available at [openjfx.io](https://openjfx.io/).

## Removal of Java EE and CORBA Modules

Java EE and CORBA, deprecated in Java 9, were removed in Java 11.

## Deprecation of Nashorn JavaScript Engine

The *Nashorn JavaScript Engine*, introduced in Java 8, was deprecated in Java 11 and is expected to be removed in a future release.

## Deprecation of Pack200 Tools and API

The *Pack200* tools and their API were deprecated.

## Readonly System Properties

In Java 11, the following system properties are cached at VM startup:

- *java.home*
- *user.home*
- *user.dir*
- *user.name*

Modifying these properties via `System::setProperty` after startup has no effect.

## `java.lang.ref.Reference` Does Not Support Cloning

In Java 11, calling `java.lang.ref.References::clone` throws a `CloneNotSupportedException`.

> For more details, see: https://www.oracle.com/java/technologies/javase/11-relnote-issues.html#NewFeature
