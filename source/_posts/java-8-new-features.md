---
title: Java 8 新特性
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 08:00:00
---

Java 8 于 2014 年 3 月 18 日发布，包含了一些原本计划在 Java 7 中发布但后来却推迟的功能。Java 8 不再支持 *Windows XP* ，但 *JDK 8* 第 25 版更新仍然可以在 *Windows XP* 上安装和运行。先前 *JDK 8* 的更新版本可以在 *Windows XP* 中运行，但必须通过强制解压安装程序来进行安装。2014 年 10 月后，Java 8 成为官方网站上默认的下载版本。

## Lambda Expressions

Lambda 表达式算是 Java 8 最大的亮点了，它提供了一种使用表达式来清晰而简明的表示仅有单个方法的接口，同时，Lambda 表达式也提供了相应的集合库来简化对集合的遍历、过滤、提取数据操作，而且，新的并发特性极大的提高了在多线程环境中的性能。

下面是一个 [Runnable](https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html) 的 Lambda 表达式例子：

```java
public class RunnableLambda {
    public static void main(String[] args) {
        Runnable runnable = () -> System.out.println("Hello, world");
    }
}
```

当主体中只有一条语句时，可以省略 `{}` 和 `return`

## Method References

为了能在 Lambda 表达式中使用 JDK 中已经存在的 API 而不是为原有的 API 再实现一个 Lambda 表达式，Java 8 引入了方法引用，使得 Java 8 具备了函数式编程的特性。

静态方法引用语法如下：

```java
Class::staticMethod
```

实例方法引用语法如下：

```java
object::instanceMethod
```

以下是一个简单的例子：

```java
public class MethodReferenceTest1 {
    public static void main(String[] args) {
    	Consumer<String> echo = s -> System.out.println(s);
    	echo("Hello, world!");
    }
}
```

上面的例子还可以用方法引用来实现：

```java
public class MethodReferenceTest2 {
    public static void main(String[] args) {
    	Consumer<String> echo = System.out::println;
    	echo("Hello, world!");
    }
}
```

## Default Methods

在 Java 8 中引入默认方法的目的是为了让已经存在的接口可以添加新的方法而不需要让已经实现该接口的类做任何修改，甚至不用重新编译就可以使用该接口的最新版本，同时也弥补了 Java 在函数式编程方面的不足，像在 JavaScript 中的 *for-each* 循环，Java 8 通过为 [Iterable](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html) 增加了 [forEach](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html#forEach-java.util.function.Consumer-) 默认方法实现了。

```java
public class ForEachTest {
    public static void main(String[] args) {
        Arrays.asList(args).forEach(System.out::println);
    }
}
```

### Stream API

Stream API 作为 Java 8 的一大亮点，旨在为数据流处理提供更高效的方式，而不像 J2EE 那样对数据的聚合操作和批量操作完全依赖于关系型数据库。它提供了串行和并行两种模式，并行模式基于 Java 7 提供的  [Fork/Join 框架](#Fork-Join-Framework)，充分利用多核处理器的优势，使得用 Java 8 能轻松的编写高性能的并发程序。

### filter

对数据流进行进滤：

```java
Integer[] nums = {1, 2, 3, 4, 5, 6};
Integer[] evens = Stream.of(nums).filter(n -> n % 2 == 0).toArray(Integer[]::new);
```

### map

将数据流映射成一个新的数据流：

```java
String[] words = { "hello", "java 8", "world" };
List<String> output = Arrays.stream(words)
		.map(String::toUpperCase)
		.collect(Collectors.toList());
```

### flatMap

对数据流进行降维，使其扁平化：

```java
List<List<Integer>> numbers = Arrays.asList(
	Arrays.asList(1),
	Arrays.asList(2, 3),
	Arrays.asList(4, 5, 6)
);
List<Integer> list = numbers.stream()
		.flatMap(Collection::stream)
		.collect(Collectors.toList());
```

### findAny

从数据流中查找元素：

```java
String[] words = { "hello", "java 8", "world" };
Optinal<String> result = Arrays.stream(words)
		.filter(it -> it.contains("java"))
		.findAny();
```

### parallelStream

采用并行方式从 `Person` 数据流中提取 `email`：

```java
List<Person> roaster = ...;

List<String> emails = roaster.parallelStream()
		.filter(it -> it.age > 20)
		.map(it -> it.email)
		.collect(Collectors.toList());
```

## Annotations Improvement

从 JDK 1.5 开始，Java 就提供了 *Annotation* 的功能，允许开发者定义和使用自定义的 *Annotation* 类型，以及通过 *Annotation Processing Tool (APT)* 实现更多丰富的功能。例如，流行的 *Spring* 框架中的依赖注入、切面编程等。为了更好地帮助开发者提升代码的质量和可读性，以及自动化代码分析的准确性，Java 8 对 *Annotation* 引入了 *Type Annotation* 和 *Repeating Annotation* 。

### Type Annotation

在 Java 8 中可以在任何使用类型的地方使用 *Annotation*

```java
@NonNull Map<String, Node> nodes = createNodes();

TreeNode node = (@NonNull TreeNode) nodes.get("root");
```

自定义 *Type Annotation* ：

```java
@Target({ElementType.TYPE_PARAMETER, ElementType.TYPE_USE})
public  @interface MyAnnotation {
}
```

### Repeating Annotation

在 Java 8 之前，同一个 *Annotation* 在同一个地方只能标注一次，而在 Java 8 中，可以使用重复的 *Annotation*

```java
@Schedule(dayOfMonth="last")
@Schedule(dayOfWeek="Fri", hour="23")
public void doPeriodicCleanup() { ... }
```

自定义 *Repeating Annotation* ：

```java
@Repeatable(Schedules.class)
public @interface Schedule {
    String dayOfMonth() default "first";
    String dayOfWeek() default "Mon";
    int hour() default 12;
}
```

声明 *Repeating Annotation* 的容器：

```java
public @interface Schedules {
    Schedule[] value();
}
```

有了 *Type Annotation* 以及可插拔的类型检查器，开发者可以编写更强大的且更不易出错的代码。

## Type Inference

Java 8 的编译器在类型推断方面的增强主要表现在对范型的推断上。

### 范型方法

```java
public class BoxDemo {

    public static <U> void addBox(U u, List<Box<U>> boxes) {
        Box<U> box = new Box<>();
        box.set(u);
        boxes.add(box);
    }

    public static <U> void outputBoxes(java.util.List<Box<U>> boxes) {
        int counter = 0;
        for (Box<U> box: boxes) {
            U content = box.get();
            System.out.println("Box #" + counter + " contains [" + content.toString() + "]");
            counter++;
        }
    }
}
```

有了类型推断，在调用范型方法的时候便可以像调用普通方法一样：

```java
BoxDemo.addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

不用像 Java 8 以前需要在尖括号中指定类型：

```java
BoxDemo.<Integer>addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

### 目标类型

在 Java 7 中编译器就支持利用目标类型来推断泛型方法调用的参数类型，如：

```java
List<String> empty = Collections.emptyList();
```

但是，将范型方法的返回值直接作为另一个方法的范型参数在 Java 8 以前是不支持的，如定义了这样一个方法：

```java
void processStringList(List<String> stringList) {
    ...
}
```

在 Java 7 中得这样调用：

```java
processStringList(Collections.<String>emptyList());
```

而在 Java 8 中，可以像调用普通方法一样：

```java
processStringList(Collections.emptyList());
```

## Method Parameter Reflection

在 Java 8 中，任何方法以及构造函数的形参名称可以通过 [java.lang.reflect.Executable.getParameters](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Executable.html#getParameters--) 来获取，然而，默认情况下，*.class* 文件并不存储形参名称，因为很多工具并不希望包含形参名称的 *.class* 文件占用更多的静态和动态的空间。特别是，这些工具处理的 *.class* 文件会变得更大，Java 虚拟机得使用更多的内存加载 *.class* 文件。

如果要在 *.class* 文件中保留形参名称，并允许 *Reflection API* 能够获取到形参名称，需要在编译源代码的时候为 *javac* 编译器指定 *-parameter* 选项。

## Nashorn JavaScript Engine

在 Java 7 之前，JDK 附带了一个基于 *Mozilla Rhino* 的 *JavaScript* 脚本引擎，在 Java 8 中则附带了一个以 *Oracle Nashorn* 命名的新引擎，该引擎基于 *JSR 292* 和 `invokedynamic` 的实现方式更符合 *ECMA Script* 规范，而且运行时性能更好。深入了解 *Nashorn* ，请参见：[Oracle Nashorn: A Next-Generation JavaScript Engine for the JVM](https://www.oracle.com/technetwork/articles/java/jf14-nashorn-2126515.html)

## Concurrent Accumulators

在 Java 8 中引入并发累加器主要是为了弥补 *Atomic Number* 在高竞争情况下的吞吐量问题，在低竞争的情况下，并发累加器与 *Atomic Number* 几乎没有什么不同。并发累加器一般配合 *Stream API* 使用，譬如在收集统计数据方面，而不是在细粒度的同步控制方面。

## Parallel Operations

在 Java 8 中提供了很多并行操作的 API，如 `Collection.parallelStream()`，`Arrays.parallelSort()` 等，这些 API 都是基于 Java 7 引入的 [Fork/Join 框架](#Fork-Join-Framework)。

## Date and Time API

在 Java 8 中引入的 *java.time* 包提供了一套日期和时间的综合模型，并在 [JSR 310: Date and Time API](http://jcp.org/en/jsr/detail?id=310) 下开发，虽然是基于国际标准化组织（ISO）的日历系统，但也支持常用的全球日历。

## PermGen and Metaspace

为了解决 *java.lang.OutOfMemoryError: PermGen space ...* 的问题， Java 8 彻底移除了永生代，并将类的原数据移到 *Metaspace* 中，用于表示 class 原数据的类也被移除。原有的 *PermSize* 和 *MaxPermSize* 选项也从 JDK 8 中移除，取而代之的是 *MaxMetaspaceSize* 选项，可以通过 *MaxMetaspaceSize* 设置用于类元数据的 *Native* 内存量，默认情况下，*Metaspace* 的大小根据运行时的需要动态调整。一旦类元数据的使用量达到 *MaxMetaspaceSize* 时，将会触发 *dead class* 和 *class loader* 的垃圾回收。显然，为了限制这种垃圾回收的频率和延迟，这种垃圾回收需要进行适当的监测和调整，过多的 *Metaspace* 垃圾回收可能是由于类或者类加载器内存泄漏导致。

## Security Enhancement

- TLS 1.1 and TLS 1.2 默认开启
- 新增 [AccessController.doPrivileged](https://docs.oracle.com/javase/8/docs/api/java/security/AccessController.html#doPrivileged-java.security.PrivilegedAction-java.security.AccessControlContext-java.security.Permission...-)
- 更强的基于 AES 的密码加密算法
  - PBEWithSHA256AndAES_128
  - PBEWithSHA512AndAES_256
- SSL/TLS 服务器名称指示（Server Name Indication）
- 支持 AEAD 算法
- 增强版的 keystore 
- SHA-224 Message Digests
- 加强对国家安全局 B 套件的支持
- 更好的支持高熵随机数生成
- 64-bit PKCS11 for Windows
- 弱加密默认被禁用

> 更多详情，请参考：https://www.oracle.com/java/technologies/javase/8-whats-new.html