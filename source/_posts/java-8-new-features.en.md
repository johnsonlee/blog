---
title: What's New in Java 8
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 08:00:00
lang: en
i18n_key: java-8-new-features
---

Java 8 was released on March 18, 2014, incorporating features originally planned for Java 7 but postponed. Java 8 dropped support for *Windows XP*, though *JDK 8* update 25 could still be installed and run on *Windows XP*. Earlier *JDK 8* updates could run on *Windows XP* but required force-extracting the installer. After October 2014, Java 8 became the default download version on the official website.

## Lambda Expressions

Lambda expressions are arguably the biggest highlight of Java 8. They provide a clear and concise way to represent single-method interfaces using expressions. Lambda expressions also come with corresponding collection library support to simplify traversal, filtering, and data extraction operations. The new concurrency features significantly improve performance in multi-threaded environments.

Here is an example of a [Runnable](https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html) lambda expression:

```java
public class RunnableLambda {
    public static void main(String[] args) {
        Runnable runnable = () -> System.out.println("Hello, world");
    }
}
```

When the body contains only a single statement, `{}` and `return` can be omitted.

## Method References

To enable the use of existing JDK APIs in lambda expressions without re-implementing them as lambdas, Java 8 introduced method references, giving Java functional programming capabilities.

Static method reference syntax:

```java
Class::staticMethod
```

Instance method reference syntax:

```java
object::instanceMethod
```

Here is a simple example:

```java
public class MethodReferenceTest1 {
    public static void main(String[] args) {
    	Consumer<String> echo = s -> System.out.println(s);
    	echo("Hello, world!");
    }
}
```

The above can also be written using a method reference:

```java
public class MethodReferenceTest2 {
    public static void main(String[] args) {
    	Consumer<String> echo = System.out::println;
    	echo("Hello, world!");
    }
}
```

## Default Methods

Default methods were introduced in Java 8 to allow existing interfaces to add new methods without requiring any changes to classes that already implement them -- not even recompilation. This also addresses Java's shortcomings in functional programming. For example, JavaScript-style *for-each* loops are now available in Java 8 through the [forEach](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html#forEach-java.util.function.Consumer-) default method added to [Iterable](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html):

```java
public class ForEachTest {
    public static void main(String[] args) {
        Arrays.asList(args).forEach(System.out::println);
    }
}
```

### Stream API

The Stream API is another major highlight of Java 8, designed to provide a more efficient way to process data streams, rather than relying entirely on relational databases for aggregation and batch operations as in J2EE. It offers both serial and parallel modes. The parallel mode is built on Java 7's [Fork/Join Framework](#Fork-Join-Framework), taking full advantage of multi-core processors, making it easy to write high-performance concurrent programs in Java 8.

### filter

Filter a data stream:

```java
Integer[] nums = {1, 2, 3, 4, 5, 6};
Integer[] evens = Stream.of(nums).filter(n -> n % 2 == 0).toArray(Integer[]::new);
```

### map

Map a data stream into a new data stream:

```java
String[] words = { "hello", "java 8", "world" };
List<String> output = Arrays.stream(words)
		.map(String::toUpperCase)
		.collect(Collectors.toList());
```

### flatMap

Flatten a nested data stream:

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

Find an element from a data stream:

```java
String[] words = { "hello", "java 8", "world" };
Optinal<String> result = Arrays.stream(words)
		.filter(it -> it.contains("java"))
		.findAny();
```

### parallelStream

Extract emails from a `Person` stream in parallel:

```java
List<Person> roaster = ...;

List<String> emails = roaster.parallelStream()
		.filter(it -> it.age > 20)
		.map(it -> it.email)
		.collect(Collectors.toList());
```

## Annotations Improvement

Since JDK 1.5, Java has provided the *Annotation* feature, allowing developers to define and use custom *Annotation* types and implement richer functionality through the *Annotation Processing Tool (APT)*. For example, the popular *Spring* framework uses annotations for dependency injection, aspect-oriented programming, and more. To help developers improve code quality, readability, and automated code analysis accuracy, Java 8 introduced *Type Annotation* and *Repeating Annotation*.

### Type Annotation

In Java 8, *Annotations* can be used anywhere a type is used:

```java
@NonNull Map<String, Node> nodes = createNodes();

TreeNode node = (@NonNull TreeNode) nodes.get("root");
```

Defining a custom *Type Annotation*:

```java
@Target({ElementType.TYPE_PARAMETER, ElementType.TYPE_USE})
public  @interface MyAnnotation {
}
```

### Repeating Annotation

Before Java 8, the same *Annotation* could only be applied once at the same location. In Java 8, repeating *Annotations* are supported:

```java
@Schedule(dayOfMonth="last")
@Schedule(dayOfWeek="Fri", hour="23")
public void doPeriodicCleanup() { ... }
```

Defining a custom *Repeating Annotation*:

```java
@Repeatable(Schedules.class)
public @interface Schedule {
    String dayOfMonth() default "first";
    String dayOfWeek() default "Mon";
    int hour() default 12;
}
```

Declaring the container for the *Repeating Annotation*:

```java
public @interface Schedules {
    Schedule[] value();
}
```

With *Type Annotations* and pluggable type checkers, developers can write more robust and less error-prone code.

## Type Inference

Type inference improvements in Java 8's compiler mainly relate to generics.

### Generic Methods

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

With type inference, generic methods can be called like regular methods:

```java
BoxDemo.addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

Instead of having to specify the type in angle brackets as required before Java 8:

```java
BoxDemo.<Integer>addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

### Target Types

Java 7's compiler already supported using target types to infer type arguments for generic method invocations:

```java
List<String> empty = Collections.emptyList();
```

However, passing the return value of a generic method directly as a generic argument to another method was not supported before Java 8. Given this method:

```java
void processStringList(List<String> stringList) {
    ...
}
```

In Java 7, you had to call it like this:

```java
processStringList(Collections.<String>emptyList());
```

In Java 8, you can call it like a regular method:

```java
processStringList(Collections.emptyList());
```

## Method Parameter Reflection

In Java 8, formal parameter names of any method or constructor can be obtained via [java.lang.reflect.Executable.getParameters](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Executable.html#getParameters--). However, by default, *.class* files do not store formal parameter names, because many tools prefer not to have *.class* files that take up more static and dynamic space. In particular, the *.class* files processed by these tools would become larger, and the JVM would need more memory to load them.

To retain formal parameter names in *.class* files and allow the *Reflection API* to retrieve them, you must specify the *-parameter* option to the *javac* compiler when compiling source code.

## Nashorn JavaScript Engine

Before Java 7, the JDK shipped with a *JavaScript* engine based on *Mozilla Rhino*. Java 8 ships with a new engine named *Oracle Nashorn*, which is based on *JSR 292* and `invokedynamic`, providing better compliance with the *ECMA Script* specification and improved runtime performance. For a deep dive into *Nashorn*, see: [Oracle Nashorn: A Next-Generation JavaScript Engine for the JVM](https://www.oracle.com/technetwork/articles/java/jf14-nashorn-2126515.html)

## Concurrent Accumulators

Concurrent accumulators were introduced in Java 8 primarily to address throughput issues with *Atomic Numbers* under high contention. Under low contention, concurrent accumulators behave almost identically to *Atomic Numbers*. Concurrent accumulators are typically used alongside the *Stream API* for collecting statistics, rather than for fine-grained synchronization control.

## Parallel Operations

Java 8 provides many parallel operation APIs, such as `Collection.parallelStream()` and `Arrays.parallelSort()`, all built on top of the [Fork/Join Framework](#Fork-Join-Framework) introduced in Java 7.

## Date and Time API

The *java.time* package introduced in Java 8 provides a comprehensive date and time model, developed under [JSR 310: Date and Time API](http://jcp.org/en/jsr/detail?id=310). While based on the ISO calendar system, it also supports commonly used global calendars.

## PermGen and Metaspace

To resolve *java.lang.OutOfMemoryError: PermGen space ...* issues, Java 8 completely removed the permanent generation and moved class metadata to *Metaspace*. The classes used to represent class metadata were also removed. The old *PermSize* and *MaxPermSize* options were removed from JDK 8, replaced by *MaxMetaspaceSize*, which sets the native memory limit for class metadata. By default, *Metaspace* size adjusts dynamically based on runtime needs. When class metadata usage reaches *MaxMetaspaceSize*, garbage collection of dead classes and class loaders is triggered. To limit the frequency and latency of this garbage collection, proper monitoring and tuning are needed. Excessive *Metaspace* garbage collection may indicate class or class loader memory leaks.

## Security Enhancement

- TLS 1.1 and TLS 1.2 enabled by default
- New [AccessController.doPrivileged](https://docs.oracle.com/javase/8/docs/api/java/security/AccessController.html#doPrivileged-java.security.PrivilegedAction-java.security.AccessControlContext-java.security.Permission...-)
- Stronger AES-based encryption algorithms
  - PBEWithSHA256AndAES_128
  - PBEWithSHA512AndAES_256
- SSL/TLS Server Name Indication (SNI)
- AEAD algorithm support
- Enhanced keystore
- SHA-224 Message Digests
- Enhanced support for NSA Suite B
- Better support for high entropy random number generation
- 64-bit PKCS11 for Windows
- Weak encryption disabled by default

> For more details, see: https://www.oracle.com/java/technologies/javase/8-whats-new.html
