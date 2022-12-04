---
title: Kotlin 填坑记之 Metadata
categories:
  - Computer Science
  - Kotlin
date: 2021-10-29 23:00:00
---

最近用 __KAPT__ 来生成 __Kotlin__ 代码，遇到了一个头疼的问题，生成的 __Kotlin__ 代码需要调用源 __Kotlin__ 代码中被 `Annotation` 标注的属性，理论上讲，直接用 `.` 操作符来调用属性不就行了吗？然而，事情并没有想象的那么简单。

## Kotlin Property

在 __Kotlin__ 中，__Property__ 在 __JVM__ 层面既有可能是一个字段，也有可能是一个方法，取决于在属性上有没有其它 __JVM__ 相关的注解，例如在下面的例子中：

```kotlin
object Data {
  @MyAnnotation
  val value = "Hello, world!"
}
```

`value` 作为 __Property__，在 __JVM__ 层面对外公开的 __API__ 其实是 `getValue(): String`，但是，在下面的例子中：

```kotlin
object Data {
  @JvmField
  @MyAnnotation
  val value = "Hello, world!"
}
```

`value` 在 __JVM__ 层面对外公开的 __API__ 其实是一个 `static` 字段，对于生成的 __Kotlin__ 代码中，如果要调用这个 `value` 属性，到底应该是调用 `value` 这个字段还是调用 `getValue()` 这个方法？

## Kotlin Metadata

用过 __KAPT__ 的同学或多或少地知道，__KAPT__ 其实是基于 __APT__ 来实现的，只不过会在编译期为 __Kotlin__ 代码生成对的 __Java__ 存根，这样 __APT__ 才有机会发挥作用，那对于 __Kotlin__ 编译器而言，它是如何解决 __Kotlin Property__ 的调用问题的呢？这得从 __KAPT__ 为 __Kotlin__ 代码生成的 __Java__ 存根说起。

在 __Java__ 存根中，每个 __Class__ 上都被标注了一个 `kotlin.Metadata` 的 __Annotation__，如下所示：

```java
 @kotlin.Metadata(
  mv={1,5,1},
  k=1,
  xi=48,
  d1={"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\bÆ\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002¢\u0006\u0002\u0010\u0002R\u0010\u0010\u0003\u001a\u00020\u00048\u0006X\u0087D¢\u0006\u0002\n\u0000¨\u0006\u0005"],
  d2={"Lio/johnsonlee/Data;","","()V","value","","dsl_debug"}
)
```

相信看到这堆字符的同学会一脸懵逼，一堆字符到底是啥意思，`d1` 是个啥？`d2` 是个啥？我第一次看到它也一脸懵，如何破解这一堆被编码的符号呢？我的第一反应是 —— 从 `Kotlin` 官方渠道找设计文档，结果找了一圈，并没有找到相关的文档说明，那还是老老实实研究一下 __Kotlin__ 源代码吧，结果发现了一个有意思的类 —— [JvmProtobufUtil.kt](https://github.com/JetBrains/kotlin/blob/master/core/metadata.jvm/src/org/jetbrains/kotlin/metadata/jvm/deserialization/JvmProtoBufUtil.kt)，不难发现有这样一个方法：

```kotlin
@JvmStatic
fun readClassDataFrom(data: Array<String>, strings: Array<String>): Pair<JvmNameResolver, ProtoBuf.Class> =
    readClassDataFrom(BitEncoding.decodeBytes(data), strings)
```
通过 __Annotation__ 标注的 `Element`，我们可以很方便的获取到 `Metadata`：

```kotlin
val metadata = ele.getAnnotation(Metadata::class.java)
```

结合上面的 `@kotlin.Metadata` 中的内容，如果把 `Metadata` 的 `data1` 和 `data2` 作为参数传进去会怎么样呢？

```kotlin
fun parseMetadata(ele: Element) {
  val metadata = ele.getAnnotation(Metadata::class.java)
  val (resolver, klass) = JvmProtoBufUtil.readClassDataFrom(metadata.data1, metadata.data2)
  println("${resolver} -> ${klass}")
}
```

试了一下，居然能解析成功！`Metadata` 里的内容到底是啥呢？根据 [Metadata.kt](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/jvm/runtime/kotlin/Metadata.kt) 中的注释，其字段的定义如下：

| 字段 | 描述 |
|:---:|------|
| k   | 本注解编码的类型：<ul><li>`1`: __Class__</li><li>`2`: __File__</li><li>`3`: __Synthetic class__</li><li>`4`: __Multi-file class facade__</li><li>`5`: __Multi-file class part__</li>|
| mv  | __Metadata__ 的版本 |
| xi  | 标志位 |
| d1  | [metadata.proto](https://github.com/JetBrains/kotlin/blob/master/core/metadata/src/metadata.proto) |
| d2  | 字符串常量池 |

通过 `JvmProtoBufUtil.readClassDataFrom` 返回的 `JvmNameResolver` 和 `ProtoBuf.Class`，便可以解析出 `Metadata` 中的编码的所有内容，对于 __Kotlin Property__，便可以通过 `ProtoBuf.Class` 的 `getPropertyList()` 来获取到所有的属性：

```kotlin
klass.propertyList.forEach {
  val name = resolver.getString(it.name)
  val type = resolver.getQualifiedClassName(it.returnType.className)
  val flags = if (it.hasGetterFlags()) "(getter)" else ""
  println("${name}: ${type} ${flags}")
}
```

## Interoperability

如果我们用 __KAPT__ 生成代码的时候要根据 __Annotation__ 标注的元素的类型来生成相应的 __Kotlin__ 代码，就会发现 __Kotlin__ 中的 `String` 不能用 __Java__ 中的 `String` 来代替，因为从类型上来讲，它们确实是两种不同的类型，例如：

```
object Data {
  @MyAnnotation
  val value = "Hello, World!"
}
```

如果要对 `value` 生成一个包装类的话，大概长这样：

```kotlin
class ValueWrapper : Wrapper<java.lang.String> {
  override fun get(): java.lang.String = Data.value
}
```

但是，在 `ValueWrapper.get()` 返回 `Data.value` 会报错：

```
Type mismatch.
 Required: java.lang.String
 Found:    kotlin.String
```

WTF！！！怎么会这样？？？

用 __Kotlin__ 的时候，对于标准库提供的类型，例如：`String`，其定义是 `kotlin.String`，那为什么在存根文件中和字节码层面却是 `java.lang.String` 呢？要一窥究竟，还得去扒 __Kotlin__ 源代码 —— [ClassMapperLite.kt](https://github.com/JetBrains/kotlin/blob/master/core/metadata.jvm/src/org/jetbrains/kotlin/metadata/jvm/deserialization/ClassMapperLite.kt)，原来是 __Kotlin__ 的编译器会将 __Kotlin__ 的标准类型自动转换为 __Java__ 的标准类型，所以，在存根文件中，我们会发现原来定义的 `kotlin.String` 类型都已经被转换为 `java.lang.String` 类型了。

因此，如果想要将生成的代码中的 __Java__ 标准类型变成 __Kotlin__ 标准类型，那就需要逆映射，也就是将 [ClassMapperLite.kt](https://github.com/JetBrains/kotlin/blob/master/core/metadata.jvm/src/org/jetbrains/kotlin/metadata/jvm/deserialization/ClassMapperLite.kt) 中的是映射关系反过来，这样，就可以生成漂亮的 __Kotlin__ 代码了，如下所示：

```kotlin
class ValueWrapper : Wrapper<kotlin.String> {
  override fun get(): kotlin.String = Data.value
}
```

## Incompatible Kotlin Version

还在使用 __Kotlin 1.5.0__ 以下的版本的同学在引入第三方 __Kotlin__ 库的时候，有可能会遇到这样的问题：

```
"Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.5.x, expected version is 1.x.y"
```

根据我们对 __Kotlin Metadata__ 的了解，便可以推断出 —— __Kotlin__ 在 __1.5.0__ 对 `Metadata` 进行的修改不能向后兼容，如果遇到这种情况，那就只有两个选择：

1. 升级工程中使用的 __Kotlin__ 的版本
1. 使用三方库的低版本（前提是三方库有提供用 __Kotlin 1.5.0__ 之前的版本编译的版本）

看到这里，大家是不是觉得 —— 原来 __Kotlin__ 还有这种坑！！！没错，__Kotlin__ 的版本兼容性问题多着呢 😿
