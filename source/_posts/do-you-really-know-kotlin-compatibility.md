---
title: Kotlin 填坑记之 Compatibility
categories:
  - Computer Science
  - Kotlin
tags:
  - Kotlin
  - Compatibility
date: 2022-12-07 00:00:00
---


在前一篇 [Kotlin 填坑记之 FunctionReference](/2022/12/03/do-you-really-know-kotlin-function/) 中有提到关于如何解决 Kotlin 从 1.3 升级到 1.5 时由 [FunctionReference](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/jvm/runtime/kotlin/jvm/internal/FunctionReference.java) 引发的兼容性问题，其实，Kotlin 的兼容性问题远不只这一个，如何系统性的解决 Kotlin 的兼容性问题呢？

## 什么是兼容性问题

软件的兼容性问题大致可以分为两类：API 兼容性和 ABI 兼容性。

### API (Application Programming Interface) 兼容性

简而言之，就是接口的兼容性，大致也分为两类：

#### API 废弃 (Deprecation)

比如：Kotlin 1.5 废弃了 `String.toUpperCase()` API，由 `String.uppercase()` 替代。尽管 API 废弃了，要用还是可以继续用的，只不过编译器会有警告，但不会中断编译过程。

#### API 删除 (Removal)

比如：JDK 11 删除了 `Thread.destroy()` 和 `Thread.stop(Throwable)` API，如果工程里用了 `Thread.destroy()` API 的话，升级到 JDK 11 就编译不过了，要么选择替代方案，要么换其他的实现方式。

### ABI (Application Binary Interface) 兼容性

简而言之，就是二进制的兼容性。对于运行在 JVM 上的语言而言，二进制的兼容性主要是字节码的兼容性，这里也可以分为两类：

#### JVM 字节码的版本兼容性

比较典型的例子是 class 文件的 major version

#### 语言本身的 Runtime 版本兼容性

Kotlin 的一些语言特性是在编译器层面实现的，不同版本的 Kotlin 编译器的实现方式可能有些不一样，虽然对于使用 Kotlin 进行开发的工程师而言，都是调用 Kotlin 标准库，但是 Kotlin 编译器会生成一些字节码甚至 class 来实现让工程师看起来很酷的语法糖，比如：随处可见的 `Function`


## Java 的解决方案

针对兼容性问题，Java 是有系统性的解决方案的，用过 Gradle 的同学应该都记得，Java 编译任务可以配置这两个参数：

1. `sourceCompatibility`
1. `targetCompatibility`

示例如下：

```groovy
java {
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetComaptibility = JavaVersion.VERSION_1_8
}
```

正是前面提到的 *API* 与 *ABI* 两个层面来进行兼容性管理：

| #    | Java Compiler Options | Gradle Compiler Task Options |
|:----:|:---------------------:|:----------------------------:|
| API  | `-source`             | `sourceCompatibility`        |
| ABI  | `-target`             | `targetCompatibility`        |

## Kotlin 的解决方案

Kotlin 也提供编译选项来指定版本：

| #    | Kotlin Compiler Options | Gradle Compiler Task Options |
|:----:|:-----------------------:|:----------------------------:|
| API  | `-language-version`     | `languageVersion`            |
| ABI  | `-api-version`          | `apiVersion`                 |

如下所示：

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions {
        apiVersion = "1.5"
        languageVersion = "1.5"
    }
}
```

值得注意的是：

1. `-api-version` 不能大于 `-language-version`
1. 限制 `-language-version` 就等于同时限制了 `-api-version`

Kotlin 与 Java 编译选项的对应关系如下：

| #    | Kotlin Compiler Options | Java Compiler Options |
|:----:|:-----------------------:|:---------------------:|
| API  | `-language-version`     | `-source`             |
| ABI  | `-api-version`          | `-target`             |

啊哈，原来 Kotlin 的兼容性管理跟 Java 一样如此简单，如果你真这么想，那可就大错特错了，好戏还在后头呢！（不然我写这篇文章干嘛？）

> WTF?! 😲😲😲

## 真正头疼的问题

### 不兼容的字节码

Kotlin 的官方文档 [Compatibility Modes](https://kotlinlang.org/docs/compatibility-modes.html) 写得倒是提好的，然而并没有什么卵用，为什么这么说呢？还记得 [Kotlin 填坑记之 FunctionReference](/2022/12/03/do-you-really-know-kotlin-function/) 中遇到的问题吗？

```kotlin
fun f(fn: (Any) -> Unit) {}

fun ff() {
    f(::println)
}
```

按照 Kotlin 官方的说法，限制 `-language-version` 就可以解决 *API* 和 *ABI* 的问题，然而，如何我们用 `org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.31` 来编译以上代码，无论 `-language-version` 是 `1.5` 还是 `1.4` 或者 `1.3` 都会得到下面的字节码：

```
final synthetic class io/johnsonlee/kotlin/TestKt$ff$1 extends kotlin/jvm/internal/FunctionReferenceImpl implements kotlin/jvm/functions/Function1 {

  // access flags 0x0
  <init>()V
    ALOAD 0
    ICONST_1
    LDC Lkotlin/io/ConsoleKt;.class
    LDC "println"
    LDC "println(Ljava/lang/Object;)V"
    LDC 1
    INVOKESPECIAL kotlin/jvm/internal/FunctionReferenceImpl.<init> (ILjava/lang/Class;Ljava/lang/String;Ljava/lang/String;I)V
    RETURN
    MAXSTACK = 6
    MAXLOCALS = 1

}
```

也就是说，即使指定 `-language-version` 降低了语言和 *API* 版本，也只是在源代码层面解决了兼容性的问题，生成的字节码还是包含了高版本的内容，从而导致其他 Kotlin 低于 1.4 的工程在使用了该字节码后，运行时报错 `NoSuchMethodError`。

### 不兼容的元数据

Kotlin 除了生成 class 字节码，还会生成其它的二进制内容：

1. Metadata (`@Metadata`)
1. Module mapping (`*.kotlin_module`)
1. ......

以上这些二进制内容都包含有版本信息以及版本兼容性约束信息。

以 `@Metadata` 为例，默认的兼容策略是 `x.y` 兼容 `x.{y + 1}`，除非版本有严格的语义。

那这些二进制内容的版本信息是如何确定的呢？

#### Metadata Version

`@Metadata` 的版本信息是由 Kotlin Compiler 的版本决定的，跟 `-api-version` 和 `-language-version` 没有半毛钱关系，对于 Gradle 工程来说，其实就是由 *kotlin-gradle-plugin* 的版本决定。

也就是说，如果想要修改 `@Metadata` 的版本，只能修改 *kotlin-gradle-plugin* 的版本。

#### Module Mapping Version

`*.kotlin_module` 的版本同样也是由 Kotlin Compiler 的版本决定，而且跟 `@Metadata` 的版本是一致，如果出现版本不兼容的情况，编译就会报：

```
Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is a.b.c, expected version is x.y.z.
```

这种情况下，可以通过指定编译选项跳过 metadata 检查，例如：

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xskip-metadata-version-check")
    }
}
```

如果以上方法都解决不了，请确认引入的 *kotlin-gradle-plugin* 版本是否正确，同时关注一下 `kotlin-dsl` 插件的版本。

## 最佳实践

工程中的 Kotlin 版本最好是使用 `embeddedKotlinVersion` (Gradle 内嵌的 Kotlin 版本)，例如：

```kotlin
buildscript {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    dependencies {
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${embeddedKotlinVersion}")
    }
}
```

或者：

```kotlin
plugins {
    kotlin("jvm") version embeddedKotlinVersion
}
```

