---
title: "What's New in Java 10"
lang: en
i18n_key: java-10-new-features
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 10:00:00
---

Java 10, developed under *JSR 383*, was officially released on March 20, 2018. Oracle provides production-ready binaries under the GPL. This release includes twelve new features.

## Local-Variable Type Inference

To improve developer experience while maintaining Java's commitment to static type safety, JDK 10 allows developers to omit unnecessary local variable type declarations. For example:

```java
var list = new ArrayList<String>();  // infers ArrayList<String>
var stream = list.stream();          // infers Stream<String>
```

In the examples above, the identifier `var` is not a keyword but a reserved type name, so using `var` as a variable, method, or package name is unaffected.

> Local variable type inference is limited to local variables with initializers, indexes in enhanced `for-loop` statements, and local variables declared in traditional `for` loops. It cannot be used for method parameters, constructor parameters, method return types, fields, `catch` clauses, or any other type of variable declaration.

## Consolidate the JDK Forest into a Single Repository

This Java 10 feature is about internal housekeeping -- consolidating the many JDK repositories into a single repository.

## Garbage-Collector Interface

JDK 10 improves code isolation between different garbage collectors and introduces a clean interface. This makes it easier to exclude a GC from JDK builds and to add new GCs without affecting the codebase. For details on G1 garbage collection and how G1 differs from CMS, see [Java Memory Management](https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/garbage_collect.html).

## Parallel Full GC for G1

Another interesting feature in JDK 10 improves G1's worst-case latency through parallel full GC. Recall that in Java 9, G1 was made the default GC to avoid full GC. However, when concurrent collection cannot reclaim memory fast enough, it falls back to a full GC, which is a problem. This change parallelizes the full GC algorithm so that in the unlikely event of a G1 full GC, the same number of threads used for concurrent collection can improve overall performance.

## Application Class-Data Sharing

Class-data sharing was introduced back in Java 5. It allows a set of classes to be pre-processed into a shared archive file, which is then memory-mapped at runtime to reduce startup time. When multiple JVMs share the same archive file, it also reduces dynamic memory usage.

## Thread-Local Handshakes

Thread-local handshakes lay the foundation for improved VM performance by enabling callbacks on application threads without a global VM safepoint. This means the JVM can stop individual threads rather than all threads at once.

## Remove the Native-Header Generation Tool (javah)

*javah*, the tool for generating header files when compiling JNI code, was removed in Java 10 and replaced by *javac*.

## Additional Unicode Language-Tag Extensions

Java SE 9 supported the *BCP 47 Unicode* language tag extensions *ca* and *nu*. Java 10 adds support for these additional extensions:

- cu (currency type)
- fw (first day of week)
- rg (region override)
- tz (time zone)

To support these extensions, Java 10 modified the following APIs:

- `java.text.DateFormat::get*Instance` returns instances based on `ca`, `rg`, `tz` extensions
- `java.text.DateFormatSymbols::getInstance` returns instances based on `rg` extension
- `java.text.DecimalFormatSymbols::getInstance` returns instances based on `rg` extension
- `java.text.NumberFormat::get*Instance` returns instances based on `nu`, `rg` extensions
- `java.time.format.DateTimeFormatter::localizedBy` returns instances based on `ca`, `rg`, `tz` extensions
- `java.time.format.DateTimeFormatterBuilder::getLocalizedDateTimePattern` returns pattern strings based on `rg` extension
- `java.time.format.DecimalStyle::of` returns `DecimalStyle` instances based on `nu`, `rg` extensions
- `java.time.temporal.WeekFields::of` returns `WeekFields` instances based on `fw`, `rg` extensions
- `java.util.Calendar::{getFirstDayOfWeek,getMinimalDaysInWeek}` returns values based on `fw`, `rg` extensions
- `java.util.Currency::getInstance` returns `Currency` instances based on `cu`, `rg` extensions
- `java.util.Locale::getDisplayName` returns a string containing the `display name` of these Unicode extensions
- `java.util.spi.LocaleNameProvider` has new SPIs for these Unicode extension keys and types

## Heap Allocation on Alternative Memory Devices

This is a pretty cool feature that allows the HotSpot VM to allocate the Java object heap on a user-specified alternative memory device. In multi-JVM environments, this enables directing lower-priority processes to use *NV-DIMM* memory while allocating *DRAM* to higher-priority processes.

## Experimental Java-Based JIT Compiler

[Graal](https://www.graalvm.org/), a Java-based JIT compiler, was the experimental AOT (Ahead-of-Time) compiler introduced in Java 9 using the JVM compiler interface. As an experimental JIT compiler, *Graal* is primarily used for testing and debugging. It can be enabled with the following JVM flags:

```
-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler
```

## Root Certificates

Another important change in Java 10: it provides a default set of root CA certificates, making OpenJDK more attractive to developers. It also aims to reduce differences between OpenJDK and Oracle JDK. Critical security components like TLS will work by default in OpenJDK.

## Time-Based Release Versioning

With JDK 10, Java adopted a new release cadence -- every six months. There has been much debate about whether this is a viable approach. Many say new features every six months is great, though others complain that it leaves too little time for JDK adoption.

> For more details, see: https://www.oracle.com/java/technologies/javase/10-relnote-issues.html#NewFeature
