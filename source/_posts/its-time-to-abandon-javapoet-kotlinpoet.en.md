---
title: "It's Time to Abandon JavaPoet/KotlinPoet"
lang: en
i18n_key: its-time-to-abandon-javapoet-kotlinpoet
categories:
  - Computer Science
  - Architecture Design
tags:
  - Java
  - Kotlin
date: 2022-04-10 00:00:00
---

Most Android developers are familiar with [JavaPoet](https://github.com/square/javapoet) and [KotlinPoet](https://github.com/square/kotlinpoet), both from the well-known [Square](https://square.github.io/). Typically, when generating source code at compile time using [APT (Annotation Processing Toolkit)](https://docs.oracle.com/javase/7/docs/technotes/guides/apt/index.html) or [KAPT](https://kotlinlang.org/docs/kapt.html), developers use [JavaPoet](https://github.com/square/javapoet) for Java and [KotlinPoet](https://github.com/square/kotlinpoet) for Kotlin. At first glance, it seems pretty cool and sophisticated.

## Generating Code with JavaPoet

As [JavaPoet](https://github.com/square/javapoet)'s introduction shows, to generate this code:

```java
package com.example.helloworld;

public final class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, JavaPoet!");
  }
}
```

You would write this with [JavaPoet](https://github.com/square/javapoet):

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

## Generating Code with KotlinPoet

Similar to [JavaPoet](https://github.com/square/javapoet), to generate this code:

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

You would write this with [KotlinPoet](https://github.com/square/kotlinpoet):

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

## Readability and Maintainability

The two examples above are about as simple as it gets -- fewer than 10 lines of source code including braces -- yet the [JavaPoet](https://github.com/square/javapoet) and [KotlinPoet](https://github.com/square/kotlinpoet) implementations are already lengthy. Without seeing the target output, figuring out what the generated code looks like from the builder calls alone takes real effort. If examples this trivial are already hard to read, imagine real-world complex projects. Even with code you wrote yourself, come back three months later and you will wonder if it was really you. And if the unlucky task of modifying someone else's code falls on you, most people will read it while muttering:

> What idiot wrote this garbage!

You will debug and curse your way through it, finally finishing after great effort. Months later, someone else takes over, and the scene replays with a different protagonist.

## Template Engines

Frontend developers are likely familiar with template engines -- for example, [EJS (Embedded JavaScript template engine)](https://ejs.co/). The template engines [Freemarker](https://freemarker.apache.org/) and [Velocity](https://velocity.apache.org/) used in early JSP technology both come from the renowned Apache Foundation. You might ask: what do template engines have to do with [JavaPoet](https://github.com/square/javapoet) and [KotlinPoet](https://github.com/square/kotlinpoet)?

To be clear, template engines have no direct relationship with [JavaPoet](https://github.com/square/javapoet) and [KotlinPoet](https://github.com/square/kotlinpoet), but they are related to the problem we are solving. For code generation, the ultimate goal is "generating source code." How is that fundamentally different from using a template engine to generate *HTML*? *HTML* is itself source code. If a template engine can generate *HTML*, why not use it to generate *Java*, *Kotlin*, *Swift*, and so on?

You might think of another question:

> Why do template engines exist in the first place?

As a veteran in the industry, my first exposure to *Web* technology was *ASP*, then *JSP*, and I used *PHP* too. Early *Web* development did not separate frontend and backend -- the source code was tightly coupled. Given the limited framework capabilities, frontend UI development meant embedding scripts in *ASP/JSP/PHP*. Taking *JSP* as an example, to generate *HTML* with a *JSP* script:

```jsp
<%
  out.println("<p>Hello, world!</p>")
%>
```

If the page had complex business logic, it would be full of `<% %>` fragments, severely hurting readability. To make page code closer to *HTML*, [JavaServer Pages Standard Tag Library (JSTL)](https://www.oracle.com/java/technologies/java-server-tag-library.html) was created. The famous [Struts](https://struts.apache.org/) framework was built on this technology. With *JSTL*, the `<% %>` blocks were replaced by custom tags:

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

Even now with frontend-backend separation as the standard architecture, template engines remain popular. Take [Vue.js](https://vuejs.org/), one of the most popular *Web* frameworks today:

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

From these examples, we can see that template engines decouple the final output from business logic through templates. With a template, we can easily see what the output will look like, without mentally simulating code execution to deduce the generated source code.

## Code Reusability

With [JavaPoet](https://github.com/square/javapoet) and [KotlinPoet](https://github.com/square/kotlinpoet), you will notice that even across different projects, much of the code is similar -- defining an *AnnotationProcessor*, overriding `init` and `process` methods, handling `multi-round` issues, and so on.

Furthermore, once you commit to [JavaPoet](https://github.com/square/javapoet) for generating *Java* source code, switching to *Kotlin* later means reimplementing everything with [KotlinPoet](https://github.com/square/kotlinpoet). The same applies in reverse. This is completely unreasonable for developers -- the logic is the same; only the target language differs. If switching the target language requires a full reimplementation, the architecture is fundamentally wrong.

## Template-Engine-Based Code Generation Framework

To address the problems above:

1. Code maintainability
1. Code readability
1. Code reusability

We can fully separate the code generation logic from the source code content -- that is, *template* + *data model*:

* Template - defines the source code to generate
* Data model - the data needed to render the template

This way, when generating source code at compile time, the main focus is on "how to build the data model." With a template engine, as long as the data model is correct, we can switch target languages just by switching templates without rewriting any logic. This is the design philosophy behind [codegen](https://github.com/johnsonlee/codegen), which supports both [Mustache](https://mustache.github.io/) and [Velocity](https://velocity.apache.org/). For example, to generate a `Factory` class for a given type:

```kotlin
interface Factory<T> {

    val type: Class<T>

    fun newInstance(pool: ObjectPool): T

}
```

To generate *Java* source code, the `mustache` template looks like:

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

To generate *Kotlin* source code, the `mustache` template looks like:

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

Both templates can reuse the same data model:

```kotlin
data class AutoFactoryModel(
    val implementation: String,
    val args: List<Map<String, Any?>> = emptyList()
) : Model {
```

For developers, all you need to do is build the data model and call the framework's `generate` method:

```kotlin
generate(
    "template/AutoFactory", // template name
    AutoFactoryModel(implementation.qualifiedName.toString(), args), // data model
    Language.KOTLIN // target language
)
```

After seeing this, do you still think [JavaPoet](https://github.com/square/javapoet) and [KotlinPoet](https://github.com/square/kotlinpoet) are the way to go?

## Codegen

Project repository: https://github.com/johnsonlee/codegen -- don't forget to star it!
