---
title: What's New in Java 6
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 06:00:00
lang: en
i18n_key: java-6-new-features
---

Java 6, codenamed *Mustang*, was released on December 11, 2006. *Sun* renamed *"J2SE"* to *"Java SE"* and dropped *".0"* from the version number, while the internal developer version remained *1.6.0*. This release was developed under *JSR 270*.

## Scripting

*Java SE 6.0* added support for scripting languages. The scripting framework supports third-party script engines through a service discovery mechanism, and ships with a *JavaScript* engine based on *Mozilla Rhino* as the default, making it possible to call *JavaScript* from *Java*:

```java
import javax.script.*;
public class EvalScript {
    public static void main(String[] args) throws Exception {
        ScriptEngineManager factory = new ScriptEngineManager();
        ScriptEngine engine = factory.getEngineByName("JavaScript");
        engine.eval("print('Hello, World')");
    }
}
```

## Java Compiler API

Many applications dynamically generate and compile code at runtime, such as *JSP web servers*. Before *Java SE 6.0*, there were only two ways to dynamically generate code:

1. Generate a temporary `.java` file and call `javac` via `Runtime.exec()` -- quite inelegant
1. Hack into `javac`'s internals and use the Java interface -- this worked but was undocumented, unsupported, and incompatible with third-party compilers

In fact, *Sun* had already provided a *Java Compiler API* in *Java SE 5.0*, but it was non-standard. In *Java SE 6.0*, the *Java Compiler API* was standardized:

```java
public class Compiler {
    public static void main(String[] args) throws Exception {
        String fullQuanlifiedFileName = "compile" + java.io.File.separator + "Target.java";
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        FileOutputStream err = new FileOutputStream("err.txt");
        int compilationResult = compiler.run(null, null, err, fullQuanlifiedFileName);
        if (compilationResult == 0) {
            System.out.println("Done");
        } else {
            System.out.println("Fail");
        }
    }
}
```

## JDBC 4.0

Key features of *JDBC 4.0*:

- New `javax.sql.DataSource` implementations
- Automatic JDBC driver loading -- starting from *Java SE 6.0*, you no longer need to manually call `Class.forName(String)` to load drivers; `DriverManager` automatically finds the appropriate *JDBC* driver when a connection is requested
- New, more descriptive `SQLException` subclasses
- Introduction of the concept of wrapped JDBC objects, allowing applications to look up vendor-specific extensions in standard JDBC objects such as `Connections`, `Statement`, and `ResultSets`
- `Statement` events that allow connection pools to listen for `Statement` close and error events
- *Streaming API* for `CallableStatement`, `PreparedStatement`, and `ResultSet`

## Collection Framework Enhancements

### New Interfaces

- [Deque](https://docs.oracle.com/javase/6/docs/api/java/util/Deque.html)
- [BlockingDeque](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/BlockingDeque.html)
- [NavigableSet](https://docs.oracle.com/javase/6/docs/api/java/util/NavigableSet.html)
- [NavigableMap](https://docs.oracle.com/javase/6/docs/api/java/util/NavigableMap.html)
- [ConcurrentNavigableMap](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentNavigableMap.html)

### New Classes

- [ArrayDeque](https://docs.oracle.com/javase/6/docs/api/java/util/ArrayDeque.html)
- [ConcurrentSkipListSet](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentSkipListSet.html)
- [ConcurrentSkipListMap](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentSkipListMap.html)
- [LinkedBlockingDeque](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/LinkedBlockingDeque.html)
- [AbstractMap.SimpleEntry](https://docs.oracle.com/javase/6/docs/api/java/util/AbstractMap.SimpleEntry.html)
- [AbstractMap.SimpleImmutableEntry](https://docs.oracle.com/javase/6/docs/api/java/util/AbstractMap.SimpleImmutableEntry.html)

### Classes Implementing New Interfaces

- [LinkedList](https://docs.oracle.com/javase/6/docs/api/java/util/LinkedList.html)
- [TreeSet](https://docs.oracle.com/javase/6/docs/api/java/util/TreeSet.html)
- [TreeMap](https://docs.oracle.com/javase/6/docs/api/java/util/TreeMap.html)

### New Methods

- [newSetFromMap(Map)](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#newSetFromMap(java.util.Map))
- [asLifoQueue(Deque)](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#asLifoQueue(java.util.Deque))

## Jar & Zip Enhancements

Two new compression streams were added:

- [DeflaterInputStream](https://docs.oracle.com/javase/6/docs/api/java/util/zip/DeflaterInputStream.html)
- [InflaterOutputStream](https://docs.oracle.com/javase/6/docs/api/java/util/zip/InflaterOutputStream.html)

## Reflection Enhancements

In *Java SE 5.0*, the return values and parameters of reflection-related methods in `java.lang.Class` were generified:

- [getInterfaces()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getInterfaces())
- [getClasses()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getClasses())
- [getConstructors()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getConstructors())
- [getMethod(String, Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getMethod(java.lang.String,%20java.lang.Class...))
- [getConstructor(Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getConstructor(java.lang.Class...))
- [getDeclaredClasses()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredClasses())
- [getDeclaredConstructors()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredConstructors())
- [getDeclaredMethod(String, Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredMethod(java.lang.String,%20java.lang.Class...))
- [getDeclaredConstructor(Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredConstructor(java.lang.Class...))

Code using these methods would produce warnings during compilation. To eliminate these warnings, *Java SE 6.0* added generic types to the return values and parameter types of these methods.

## Serialization Enhancements

- Added [java.io.ObjectStreamClass.lookupAny(Class)](https://docs.oracle.com/javase/6/docs/api/java/io/ObjectStreamClass.html#lookupAny(java.lang.Class)) for obtaining `ObjectStreamClass` instances of non-serializable classes
- Fixed a delayed GC bug caused by `ObjectOutputStream` and `ObjectInputStream` holding strong references to serializable classes and subclasses during serialization, potentially indefinitely delaying garbage collection of the `ClassLoader` that defined those classes

## VM Enhancements

- Added *DTrace* probes
- Added parallel compaction on top of the existing parallel GC. In *Java SE 5.0*, the parallel collector performed young generation collection in parallel, but full GC was single-threaded. In *Java SE 6.0*, parallel compaction significantly improved GC performance by executing full GC in parallel
- Enhanced the *CMS (Concurrent Mark Sweep)* collector -- *-XX:+ExplicitGCInvokesConcurrent* enables `System.gc()` or `Runtime.getRuntime().gc()` to run concurrently
- Increased the default young generation size from *4MB* to *16MB*
- Increased the proportion of total heap used for the young generation from 1/15 to 1/7
- Survivor spaces are now enabled by default with increased default sizes (previously, the *CMS* collector disabled survivor spaces by default)
- The *CMS* collector uses multiple threads for concurrent marking on multi-processor platforms (previous versions used only a single thread)


## Instrumentation Enhancements

- Support for class file retransformation
    - [Instrumentation.retransformClasses(Class...)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#retransformClasses(java.lang.Class...))
    - [Instrumentation.addTransformer(ClassFileTransformer, boolean)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#addTransformer(java.lang.instrument.ClassFileTransformer,%20boolean))
    - [Instrumentation.isModifiableClass(Class)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isModifiableClass(java.lang.Class))
    - [Instrumentation.isRetransformClassesSupported()](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isRetransformClassesSupported())
- Support for native method instrumentation
    - [Instrumentation.setNativeMethodPrefix(ClassFileTransformer, String)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#setNativeMethodPrefix(java.lang.instrument.ClassFileTransformer,%20java.lang.String))
    - [Instrumentation.isNativeMethodPrefixSupported()](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isNativeMethodPrefixSupported())
- Support for appending JARs to the `ClassLoader` search path
    - [Instrumentation.appendToBootstrapClassLoaderSearch(JarFile)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#appendToBootstrapClassLoaderSearch(java.util.jar.JarFile))
    - [Instrumentation.appendToSystemClassLoaderSearch(JarFile)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#appendToSystemClassLoaderSearch(java.util.jar.JarFile))

## JVM TI (Tool Interface)

*Java SE 6.0* enhanced the *JVM TI*:

- Support for transformation of class files
- Enhanced heap walking support
    - allows access to primitive values (the value of Strings, arrays, and primitive fields)
    - allows the tag of the referrer to be set, thus enabling more efficient localized reference graph building
    - provides more extensive filtering abilities
    - is extensible, allowing abilities to grow in future versions of JVM TI
- More class information
- Support for instrumenting native methods
- Enhanced support for instrumentation under the system class loader
- Support for early return from a method
- Monitor stack depth information
- Support for resource exhaustion notification

> For more details, see: https://www.oracle.com/java/technologies/javase/features.html
