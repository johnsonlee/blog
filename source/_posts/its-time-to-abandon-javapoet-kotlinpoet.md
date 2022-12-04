---
title: 是时候放弃 JavaPoet/KotlinPoet 了
categories:
  - Computer Science
  - Architecture Design
tags:
  - Java
  - Kotlin
date: 2022-04-10 00:00:00
---

相信大家对于 [JavaPoet](https://github.com/square/javapoet) 和 [KotlinPoet](https://github.com/square/kotlinpoet) 并不陌生，皆出自大名定鼎鼎的 [Square](https://square.github.io/)。一般地，我们在用 [APT (Annotation Processing Toolkit)](https://docs.oracle.com/javase/7/docs/technotes/guides/apt/index.html) 或者 [KAPT](https://kotlinlang.org/docs/kapt.html) 在编译期生成源代码时，一般都会用 [JavaPoet](https://github.com/square/javapoet) 来生成 Java 源代码，而用 [KotlinPoet](https://github.com/square/kotlinpoet) 来生成 Kotlin 源代码，乍一看，哇！好酷，感觉特别有逼格。

## 用 JavaPoet 生成代码

正如 [JavaPoet](https://github.com/square/javapoet) 的介绍，如果要生成下面这样的代码：

```java
package com.example.helloworld;

public final class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, JavaPoet!");
  }
}
```

用 [JavaPoet](https://github.com/square/javapoet) 就得这样写：

```java
MethodSpec main = MethodSpec.methodBuilder("main")
    .addModifiers(Modifier.PUBLIC, Modifier.STATIC)
    .returns(void.class)
    .addParameter(String[].class, "args")
    .addStatement("$T.out.println($S)", System.class, "Hello, JavaPoet!")
    .build();

TypeSpec helloWorld = TypeSpec.classBuilder("HelloWorld")
    .addModifiers(Modifier.PUBLIC, Modifier.FINAL)
    .addMethod(main)
    .build();

JavaFile javaFile = JavaFile.builder("com.example.helloworld", helloWorld)
    .build();

javaFile.writeTo(System.out);
```

## 用 KotlinPoet 生成代码

和 [JavaPoet](https://github.com/square/javapoet) 类似，如果要生成下面这样的代码：

```kotlin
class Greeter(val name: String) {
  fun greet() {
    println("""Hello, $name""")
  }
}

fun main(vararg args: String) {
  Greeter(args[0]).greet()
}
```

用 [KotlinPoet](https://github.com/square/kotlinpoet) 就得这样写：

```kotlin
val greeterClass = ClassName("", "Greeter")
val file = FileSpec.builder("", "HelloWorld")
  .addType(
    TypeSpec.classBuilder("Greeter")
      .primaryConstructor(
        FunSpec.constructorBuilder()
          .addParameter("name", String::class)
          .build()
      )
      .addProperty(
        PropertySpec.builder("name", String::class)
          .initializer("name")
          .build()
      )
      .addFunction(
        FunSpec.builder("greet")
          .addStatement("println(%P)", "Hello, \$name")
          .build()
      )
      .build()
  )
  .addFunction(
    FunSpec.builder("main")
      .addParameter("args", String::class, VARARG)
      .addStatement("%T(args[0]).greet()", greeterClass)
      .build()
  )
  .build()

file.writeTo(System.out)
```

## 代码可读性与可维护性

上面的两个例子还只是简单得不能再简单的例子，包括括号总共不超过 10 行的源代码，用 [JavaPoet](https://github.com/square/javapoet) 和 [KotlinPoet](https://github.com/square/kotlinpoet) 实现起来洋洋写了一大段，如果不告诉你最终生成的源代码长啥样，要从上面代码来读懂最终生成代码的样子恐怕要费些时间，如此简单的例子都如此晦涩难懂，更别提真实而复杂的项目了，即便是自己写的代码，我相信，三个月后看当初自己写的代码都会怀疑是不是自己写的，如果很不幸，要去修改这一段出自其他人之手的代码，我想大部分人会一边看一边骂：

> 这 TM 是哪个 SB 拉的一坨翔！

就这样一边 debug 一边骂，好不容易费了九牛二虎之力才改完，数月之后换了又另一个人接手，这一幕将再次上演，只是换了一个主角。

## 模板引擎

做过前端开发的同学可能对模板引擎比较熟悉，例如：[EJS (Embedded JavaScript template engine)](https://ejs.co/)，像早期的 JSP 技术用到的模板引擎 [Freemarker](https://freemarker.apache.org/) 和 [Velocity](https://velocity.apache.org/) 皆来自大名鼎鼎的 Apache 基金会。大家可能会问，模板引擎跟 [JavaPoet](https://github.com/square/javapoet) 和 [KotlinPoet](https://github.com/square/kotlinpoet) 有什么关系？

明确地说，模板引擎跟 [JavaPoet](https://github.com/square/javapoet) 和 [KotlinPoet](https://github.com/square/kotlinpoet) 并没有什么关系，但跟我们要解决的问题有关系，对于代码生成这件事情而言，我们最终的目的就是「生成源代码」，这跟我们用模板引擎生成 *HTML* 有什么本质区别吗？答案已经很明了，*HTML* 本身也是一种源代码，既然用模板引擎可以生成 *HTML* 源代码，为什么不能用模板引擎来生成 *Java* 代码、*Kotlin* 代码、*Swift* 代码等等？

可能大家会想到另一个问题：

> 为什么要有模板引擎？

作为程序员界的老鸟，我最早接触 *Web* 技术是从 *ASP* 开始的，然后是 *JSP*，当然 *PHP* 也用过，早期的 *Web* 应用开发并没有做到前后端分离，而是前端跟后端的源代码是高度耦合在一起的，加上框架的能力有限，这样导致了前端 UI 开发都是在 *ASP/JSP/PHP* 中嵌入脚本，以 *JSP* 为例，如果想要用 *JSP* 脚本来生成 *HTML*，就得这样写：

```jsp
<%
  out.println("<p>Hello, world!</p>")
%>
```
如果页面内的业务逻辑复杂，页面内就会出现大量的 `<% %>` 代码片段，严重的影响代码的可读性，为了将页面的代码更加接近 *HTML* ，所以才有了 [JavaServer Pages Standard Tag Library (JSTL)](https://www.oracle.com/java/technologies/java-server-tag-library.html)，大名鼎鼎的 [Struts](https://struts.apache.org/) 就是基于这一技术来实现的，用了 *JSTL* 之后，页面上就不再有 `<% %>`，取而代之的是自定义标签，以 [Struts](https://struts.apache.org/) 为例：

```jsp
<%@ taglib prefix="s" uri="/struts-tags" %>

<html>
<head>
    <title>Hello</title>
</head>
<body>

Hello, <s:property value="name"/>

</body>
</html>
```

即便前后端分离已经是当今 *Web* 应用的标准架构，模板引擎也依然很流行，像目前最流行的 *Web* 开发框架之一 —— [Vue.js](https://vuejs.org/)，例如：

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

通过以上的例子，我们可以看到，通过模板引擎，我们可以通过定义模板的方式，将最终要呈现的内容与业务逻辑来解耦，通过模板，我们可以很容易的知道最终呈现的内容长什么样子，而不用在脑海里去模拟代码的执行过程来推演最终生成的源代码的模样。

## 代码可复用性

通过 [JavaPoet](https://github.com/square/javapoet) 和 [KotlinPoet](https://github.com/square/kotlinpoet) 我们不难发现，用它们来生成 *Java* 或者 *Kotlin* 代码，即使是不同的工程，其实有很多的代码都是相似的，例如，我们要先定义 *AnnotationProcessor*，然后还要重写 `init` 和 `process` 方法，可能还要处理 `multi-round` 的问题。

另外，如果我们一旦决定了用 [JavaPoet](https://github.com/square/javapoet) 来生成 *Java* 源代码，如果后续想要切换到 *Kotlin* 源代码，这几乎是要用 [KotlinPoet](https://github.com/square/kotlinpoet) 重新实现一遍，或者前期决定用 [KotlinPoet](https://github.com/square/kotlinpoet) 生成了 *Kotlin* 代码，但实现的过程中因为某些原因要切换到 *Java* 源代码，同样也是需要用 [JavaPoet](https://github.com/square/javapoet) 重新实现一遍，这对于开发者来说完全不合理，因为逻辑都是一样的，只是最终要呈现的语言不一样而已，如果换一种目标语言就要重新实现一遍，那么，这个架构肯定是不对的。

## 基于模板引擎的代码生成框架

为了解决前面提到的问题：

1. 代码可维护性
1. 代码可读性
1. 代码可复用性

我们完全可以将生成源代码的逻辑与源代码的内容进行分离，也就是 —— *模板* + *数据模型*

* 模板 - 定义要生成的源代码
* 数据模型 - 渲染模板需要的数据

这样，我们如果需要在编译期生成源代码的话，只需要将主要的关注点集中在「如何构建数据模型」上，对于模板引擎而言，只要数据模型是对的，我们可以通过切换模板来随意切换目标语言而无须重写逻辑，这就是 [codegen](https://github.com/johnsonlee/codegen) 的设计思路，同时支持 [Mustache](https://mustache.github.io/) 和 [Velocity](https://velocity.apache.org/)，例如，我们要为一个类生成 `Factory` 类：

```kotlin
interface Factory<T> {

    val type: Class<T>

    fun newInstance(pool: ObjectPool): T

}
```

如果想要生成 *Java* 源代码，基于 `mustache` 的模板定义则如下：

```java
package io.johnsonlee.codegen.generated;

import io.johnsonlee.codegen.example.Factory;
import io.johnsonlee.codegen.example.ObjectPool;

class {{simpleName}} implements Factory<{{implementation}}> {
    @Override
    public Class<{{implementation}}> getType() {
        return {{implementation}}.class;
    }

    @Override
    public {{implementation}} newInstance(final ObjectPool pool) {
        return new {{implementation}}(
        {{#args}}
            pool.get({{typeErasure}}.class) {{^isLast}},{{/isLast}}
        {{/args}}
        );
    }

}
```

如果要生成 *Kotlin* 源代码，基于 `mustache` 的模板定义则如下：

```kotlin
package io.johnsonlee.codegen.generated

import io.johnsonlee.codegen.example.Factory
import io.johnsonlee.codegen.example.ObjectPool

class {{simpleName}} : Factory<{{implementation}}> {
    override val type = {{implementation}}::class.java

    override fun newInstance(pool: ObjectPool) = {{implementation}}(
        {{#args}}
            pool.get<{{type}}>() {{^isLast}},{{/isLast}}
        {{/args}}
    );

}
```

这两种不同的模板可以复用同一个数据模型：

```kotlin
data class AutoFactoryModel(
    val implementation: String,
    val args: List<Map<String, Any?>> = emptyList()
) : Model {
```

对于开发者而言，只需要构建好数据模型，然后调用框架提供的 `generate` 方法就行了：

```kotlin
generate(
    "template/AutoFactory", // 模板名称
    AutoFactoryModel(implementation.qualifiedName.toString(), args), // 数据模型
    Language.KOTLIN // 目标语言
)
```

看到这里，你还觉得 [JavaPoet](https://github.com/square/javapoet) 和 [KotlinPoet](https://github.com/square/kotlinpoet) 香吗？

## Codegen

项目地址：https://github.com/johnsonlee/codegen 记得 star 哦 ~
