---
title: "Kotlin Pitfalls: Metadata"
lang: en
i18n_key: do-you-really-know-kotlin-1
date: 2021-10-29 23:00:00
categories:
  - Computer Science
  - Kotlin
---

I was recently using KAPT to generate Kotlin code and ran into a frustrating problem. The generated Kotlin code needed to call properties annotated with `Annotation` in the source Kotlin code. In theory, you'd just use the `.` operator to access the property, right? Things turned out to be far less straightforward.

## Kotlin Property

In Kotlin, a Property can manifest at the JVM level as either a field or a method, depending on whether there are other JVM-related annotations on the property. For example:

```kotlin
object Data {
  @MyAnnotation
  val value = "Hello, world!"
}
```

As a Property, `value`'s publicly exposed API at the JVM level is actually `getValue(): String`. But in this case:

```kotlin
object Data {
  @JvmField
  @MyAnnotation
  val value = "Hello, world!"
}
```

`value` is exposed at the JVM level as a `static` field. So in generated Kotlin code, if you want to access this `value` property, should you reference the `value` field or call the `getValue()` method?

## Kotlin Metadata

If you've used KAPT, you probably know that it's built on top of APT. KAPT generates corresponding Java stubs for Kotlin code at compile time so that APT can do its thing. But how does the Kotlin compiler resolve the Property access problem? The answer lies in the Java stubs that KAPT generates for Kotlin code.

In the Java stubs, every Class is annotated with a `kotlin.Metadata` annotation, like this:

```java
 @kotlin.Metadata(
  mv={1,5,1},
  k=1,
  xi=48,
  d1={"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\bÆ\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002¢\u0006\u0002\u0010\u0002R\u0010\u0010\u0003\u001a\u00020\u00048\u0006X\u0087D¢\u0006\u0002\n\u0000¨\u0006\u0005"},
  d2={"Lio/johnsonlee/Data;","","()V","value","","dsl_debug"}
)
```

If you've never seen this before, it probably looks like gibberish. What does `d1` mean? What's `d2`? I was equally confused when I first encountered it. How do you decode this blob of encoded symbols? My first instinct was to look for official design documentation from JetBrains. After searching high and low, I found nothing. So I rolled up my sleeves and dug into the Kotlin source code, where I found an interesting class -- [JvmProtobufUtil.kt](https://github.com/JetBrains/kotlin/blob/master/core/metadata.jvm/src/org/jetbrains/kotlin/metadata/jvm/deserialization/JvmProtoBufUtil.kt). In it, there's a method:

```kotlin
@JvmStatic
fun readClassDataFrom(data: Array<String>, strings: Array<String>): Pair<JvmNameResolver, ProtoBuf.Class> =
    readClassDataFrom(BitEncoding.decodeBytes(data), strings)
```

Through the annotated `Element`, we can easily obtain the `Metadata`:

```kotlin
val metadata = ele.getAnnotation(Metadata::class.java)
```

Combining this with the `@kotlin.Metadata` content shown above, what happens if we pass `Metadata`'s `data1` and `data2` as parameters?

```kotlin
fun parseMetadata(ele: Element) {
  val metadata = ele.getAnnotation(Metadata::class.java)
  val (resolver, klass) = JvmProtoBufUtil.readClassDataFrom(metadata.data1, metadata.data2)
  println("${resolver} -> ${klass}")
}
```

I tried it, and it actually parsed successfully! So what's inside `Metadata`? According to the comments in [Metadata.kt](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/jvm/runtime/kotlin/Metadata.kt), the fields are defined as follows:

| Field | Description |
|:---:|------|
| k   | The kind of entity encoded by this annotation: <ul><li>`1`: Class</li><li>`2`: File</li><li>`3`: Synthetic class</li><li>`4`: Multi-file class facade</li><li>`5`: Multi-file class part</li>|
| mv  | Metadata version |
| xi  | Flags |
| d1  | [metadata.proto](https://github.com/JetBrains/kotlin/blob/master/core/metadata/src/metadata.proto) |
| d2  | String constant pool |

With the `JvmNameResolver` and `ProtoBuf.Class` returned by `JvmProtoBufUtil.readClassDataFrom`, you can decode everything encoded in the `Metadata`. For Kotlin Properties specifically, you can use `ProtoBuf.Class`'s `getPropertyList()` to retrieve all properties:

```kotlin
klass.propertyList.forEach {
  val name = resolver.getString(it.name)
  val type = resolver.getQualifiedClassName(it.returnType.className)
  val flags = if (it.hasGetterFlags()) "(getter)" else ""
  println("${name}: ${type} ${flags}")
}
```

## Interoperability

When using KAPT to generate code based on the type of annotated elements, you'll discover that Kotlin's `String` cannot be substituted with Java's `String` -- they are genuinely two different types. For example:

```
object Data {
  @MyAnnotation
  val value = "Hello, World!"
}
```

If you want to generate a wrapper class for `value`, it would look something like:

```kotlin
class ValueWrapper : Wrapper<java.lang.String> {
  override fun get(): java.lang.String = Data.value
}
```

But `ValueWrapper.get()` returning `Data.value` would fail to compile:

```
Type mismatch.
 Required: java.lang.String
 Found:    kotlin.String
```

What?! How is this possible?

In Kotlin, standard library types like `String` are defined as `kotlin.String`. But why do the stub files and bytecode show `java.lang.String`? To find out, we need to dig into the Kotlin source code again -- [ClassMapperLite.kt](https://github.com/JetBrains/kotlin/blob/master/core/metadata.jvm/src/org/jetbrains/kotlin/metadata/jvm/deserialization/ClassMapperLite.kt). It turns out the Kotlin compiler automatically converts Kotlin standard types to Java standard types. So in the stub files, `kotlin.String` has already been converted to `java.lang.String`.

Therefore, if you want to convert Java standard types back to Kotlin standard types in generated code, you need a reverse mapping -- inverting the mappings in [ClassMapperLite.kt](https://github.com/JetBrains/kotlin/blob/master/core/metadata.jvm/src/org/jetbrains/kotlin/metadata/jvm/deserialization/ClassMapperLite.kt). This way, you can generate clean Kotlin code:

```kotlin
class ValueWrapper : Wrapper<kotlin.String> {
  override fun get(): kotlin.String = Data.value
}
```

## Incompatible Kotlin Version

If you're still using a Kotlin version below 1.5.0, you may encounter the following error when importing third-party Kotlin libraries:

```
"Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.5.x, expected version is 1.x.y"
```

Based on what we now know about Kotlin Metadata, we can deduce that Kotlin made backward-incompatible changes to `Metadata` in version 1.5.0. If you encounter this situation, you have two options:

1. Upgrade the Kotlin version used in your project
1. Use an older version of the third-party library (assuming one compiled with a pre-1.5.0 Kotlin version exists)

By now you're probably realizing -- Kotlin has its share of pitfalls! And indeed, Kotlin's version compatibility issues are plentiful.
