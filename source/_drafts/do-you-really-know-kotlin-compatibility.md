---
title: Kotlin 填坑记之兼容性
date: 2022-12-05 01:25:14
tags:
  - Kotlin
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

| #    | 方案                  |
|:----:|:---------------------:|
| API  | `sourceCompatibility` |
| ABI  | `targetCompatibility` |

## Kotlin 的解决方案


