---
title: Java 6 新特性
date: 2021-05-07 06:00:00
categories: Java
tags:
  - Java
---

Java 6 代号为 *Mustang* 。版本发布于 2006 年 12 月 11 日，*Sun* 把原本的名称 *“J2SE”* 改为 *“Java SE”* ，然后再从版本号中去掉 *“.0”* ，而开发者内部编号仍然是 *1.6.0* 。这个版本是根据 *JSR 270* 开发。

## Scripting

*Java SE 6.0* 中增加了对脚本语言的支持，脚本框架通过服务发现机制支持第三方脚本引擎，并将基于 *Mozilla Rhino* 的 *JavaScript* 引擎作为默认的脚本引擎，这使得在 *Java* 中调用 *JavaScript* 成为可能

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

很多应用会在运行时动态生成和编译代码，比如：*JSP web server* ，在 *Java SE 6.0* 之前，想要动态生成代码只能通过这 2 种方式：

1. 临时生成 `.java` 文件，然后通过 `Runtime.exec()` 来调用 `javac`，这种方法是相当的不优雅
1. Hack `javac` 的内部结构，并使用 *Java* 接口，虽然可以工作，但是没有文档，也不受支持，还不能使用第三方供应商的编译器

事实上，在 *Java SE 5.0* 中，*Sun* 已经提供了 *Java Compiler API* ，只不过是非标准的 API，在 *Java SE 6.0* 中，*Java Compiler API* 被标准化了

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

*JDBC 4.0* 主要包括：

- 增加了新的 `javax.sql.DataSource` 实现
- 自动加载 *JDBC* 驱动，从 *Java SE 6.0* 开始，不需要在应用中手动调用 `Class.forName(String)` 来加载驱动了，当应用请求连接的时候，`DriverManager` 会自动查找合适的 *JDBC* 驱动
- 新增了更优雅的 `SQLException` 的子类
- 引入了包装的 JDBC 对象的概念，应用可以通过该机制在标准 JDBC 对象（例如 `Connections`，`Statement` 和 `ResultSets`）中查找特定于供应商的扩展
- 新增了 `Statement` 事件，它允许连接池监听 `Statement` 的关闭和错误事件
- 为 `CallableStatement`, `PreparedStatement`, 和 `ResultSet` 增加了 *Streaming API*

## Collection Framework Enhancements

### 新增的接口

- [Deque](https://docs.oracle.com/javase/6/docs/api/java/util/Deque.html)
- [BlockingDeque](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/BlockingDeque.html)
- [NavigableSet](https://docs.oracle.com/javase/6/docs/api/java/util/NavigableSet.html)
- [NavigableMap](https://docs.oracle.com/javase/6/docs/api/java/util/NavigableMap.html)
- [ConcurrentNavigableMap](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentNavigableMap.html)

### 新增的类

- [ArrayDeque](https://docs.oracle.com/javase/6/docs/api/java/util/ArrayDeque.html)
- [ConcurrentSkipListSet](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentSkipListSet.html)
- [ConcurrentSkipListMap](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentSkipListMap.html)
- [LinkedBlockingDeque](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/LinkedBlockingDeque.html)
- [AbstractMap.SimpleEntry](https://docs.oracle.com/javase/6/docs/api/java/util/AbstractMap.SimpleEntry.html)
- [AbstractMap.SimpleImmutableEntry](https://docs.oracle.com/javase/6/docs/api/java/util/AbstractMap.SimpleImmutableEntry.html)

### 实现新增接口的类

- [LinkedList](https://docs.oracle.com/javase/6/docs/api/java/util/LinkedList.html)
- [TreeSet](https://docs.oracle.com/javase/6/docs/api/java/util/TreeSet.html)
- [TreeMap](https://docs.oracle.com/javase/6/docs/api/java/util/TreeMap.html)

### 新增的方法

- [newSetFromMap(Map)](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#newSetFromMap(java.util.Map))
- [asLifoQueue(Deque)](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#asLifoQueue(java.util.Deque))

## Jar & Zip Enhancements

新增两个带压缩功能的流：

- [DeflaterInputStream](https://docs.oracle.com/javase/6/docs/api/java/util/zip/DeflaterInputStream.html)
- [InflaterOutputStream](https://docs.oracle.com/javase/6/docs/api/java/util/zip/InflaterOutputStream.html)

## Reflection Enhancements

在 *Java SE 5.0* 中，`java.lang.Class` 类中与反射相关的方法的返回值或参数都是泛化的

- [getInterfaces()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getInterfaces())
- [getClasses()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getClasses())
- [getConstructors()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getConstructors())
- [getMethod(String, Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getMethod(java.lang.String,%20java.lang.Class...))
- [getConstructor(Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getConstructor(java.lang.Class...))
- [getDeclaredClasses()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredClasses())
- [getDeclaredConstructors()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredConstructors())
- [getDeclaredMethod(String, Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredMethod(java.lang.String,%20java.lang.Class...))
- [getDeclaredConstructor(Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredConstructor(java.lang.Class...))

使用这些方法的代码在编译的过程中会产生警告，为了消除这些警告，在 *Java SE 6.0* 中，这些方法的返回值和参数类型增加了范型类型。

## Serialization Enhancements

- 新增了 [java.io.ObjectStreamClass.lookupAny(Class)](https://docs.oracle.com/javase/6/docs/api/java/io/ObjectStreamClass.html#lookupAny(java.lang.Class)) 用于获取不可序列化类的 `ObjectStreamClass` 实例
- 修复延迟 GC 的 bug, 这是由于 `ObjectOutputStream` 和 `ObjectInputStream` 的可序列化类和子类在序列化操作中被长时间的强引用，因此可能无限期地延迟定义该类的 `ClassLoader` 的垃圾回收

## VM Enhancements

- 增加了 *DTrace* 探针
- 在原有的并行 GC 的基础之上增加了并行压缩，在 *Java SE 5.0* 中，并行收集器会并行执行年轻代的收集，但 full GC 是单线程执行，在 *Java SE 6.0* 中，并行压缩通过并行执行 full GC 将 GC 性能大大提升
- 对 *CMS (Concurrent Mark Sweep)* 收集器进行了增强，通过 *-XX:+ExplicitGCInvokesConcurrent* 可以让 `System.gc()` 或 `Runtime.getRuntime().gc()` 并行执行
- 将年轻代的默认大小从 *4MB* 调到 *16MB*
- 用于年轻代的总堆的比例从1/15增加到1/7
- 默认情况下会使用幸存者空间，并且其默认大小已增加。(在以前的版本中，默认情况下，*CMS* 收集器禁用了幸存者空间）
- *CMS* 收集器使用多个线程在具有多个处理器的平台上并行执行并发标记任务（先前的版本中仅使用单个线程进行并发标记）


## Instrumentation Enhancements

- 支持 *class* 文件重新转换
    - [Instrumentation.retransformClasses(Class...)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#retransformClasses(java.lang.Class...))
    - [Instrumentation.addTransformer(ClassFileTransformer, boolean)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#addTransformer(java.lang.instrument.ClassFileTransformer,%20boolean))
    - [Instrumentation.isModifiableClass(Class)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isModifiableClass(java.lang.Class))
    - [Instrumentation.isRetransformClassesSupported()](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isRetransformClassesSupported())
- 支持 native 方法注入
    - [Instrumentation.setNativeMethodPrefix(ClassFileTransformer, String)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#setNativeMethodPrefix(java.lang.instrument.ClassFileTransformer,%20java.lang.String))
    - [Instrumentation.isNativeMethodPrefixSupported()](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isNativeMethodPrefixSupported())
- 支持向 `ClassLoader` 的搜索路径中追加 *JAR*
    - [Instrumentation.appendToBootstrapClassLoaderSearch(JarFile)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#appendToBootstrapClassLoaderSearch(java.util.jar.JarFile))
    - [Instrumentation.appendToSystemClassLoaderSearch(JarFile)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#appendToSystemClassLoaderSearch(java.util.jar.JarFile))

## JVM TI (Tool Interface)

*Java SE 6.0* 对 *JVM TI* 进行了增强

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

> 更多详情，请参考：https://www.oracle.com/java/technologies/javase/features.html
