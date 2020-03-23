---
title: 重新认识 Kotlin
date: 2020-03-24 00:00:00
categories: 架构设计
tags: Kotlin
---

大约在两年前，那时候的 [Booster](https://github.com/didi/booster) 还没有计划开源，第一版也并不是用 *Kotlin* 写的，而是 *Java 8* ，之所以用 *Kotlin* 重写 [Booster](https://github.com/didi/booster) 并不是因为 *Java 8* 不好，虽然 *Java 8* 也有它的问题，但最初的动机，除了完善原有设计上的缺陷外，更主要是为了更好的掌握 *Kotlin* 这门语言。

刚上手 *Kotlin* 就有种如鱼得水的感觉，可能是因为熟悉 *JavaScript* 的缘故，对函数式编程语言有种天然的亲和感，以至于体验是如丝般顺滑，总是一气呵成，很少因为语言本身的缺陷而阻塞流淌的思绪，我想信，大部分初次接触 *Kotlin* 的人都跟我当时的心情一样 —— *Kotlin* 写起来真的太爽了！毋庸置疑，*Kotlin* 用起来是真的爽，爽到什么程度呢？拿重写 [Booster](https://github.com/didi/booster) 来说，原来用 *Java 8* 要一个月才能完成的工作量，*Kotlin* 3 周（甚至更短）的时间就能完成了（然后剩下一周的时间你就可以打酱油了，哈哈哈）

为什么 *Kotlin* 用起来是如此的流畅呢？可能语言设计上占了很大的比例，但在这里，我并不打算讨论编程语言设计，而是以一个“过来人”来分享一下在日常的开发工作中使用 *Kotlin* 的经验和体会。

## 新手眼中的 Kotlin

### 丰富的 API

*Kotlin* 提供了大量的实用型 API，所以，基本上不用自己从头造轮子，就拿处理数据流来说，除了提供了 *Stream API* 以外，还提供了一些非常好用的 API，例如：

- `Iterable.chuncked(Int)`
- `Iterable.windowed(...)`
- `Iterable.withIndex()`
- `Iterable.zipWithNext()`

### 扩展方法

*Kotlin* 提供的丰富的 API 就是基于扩展方法来实现的，想像一下，如果只是一堆 `static` 方法提供给开发者来使用的话，会有这么流畅的编程体验吗？—— 肯定不会有！写过 *JavaScript* 的同学肯定有所体会，虽然 *JavaScript* 界有像 [underscore](https://underscorejs.org/) 这样丰常好用的库，但是，能像 *Kotlin* 这样在不改变 `this` 引用的情况下进行链式调用吗？

### 严格的类型检查

尽管 *Java 8* 提供了 `Optional`，但是用起来也是异常别扭，主要是代码量明显增多了，而且给 API 的设计造成了累赘，*Kotlin* 在语法层面解决了这一问题，在 *Kotlin* 的世界里，从此不再有 `NullPointerException`。

### 强大的编译器

*Java* 自 1.5 支持泛型开始，就一直在优化编译器的类型推导能力，从 *Corvariant Return Type* 到 *Diamond* 符号，再到 *Java 8* 的类型推导，整体来说，并没有太大的变化，只是让你的一行代码从 120 列能缩短到 80 列，而 *Kotlin* 简洁的语法，直接将一行代码缩短到 40 列，对于像我这样习惯了 *JavaScript* 的 `var`／`let` 之类的定义变量的开发者来说，`val` 简直是吊打 Java 繁琐的类型声明。我在写 *Java* 的时候，喜欢在变量前面加 `final`，我认为这是一个很好的编程习惯 —— 不用考虑别的地方会修改这个变量，特别是因为手抖而造成的低级错误简直是不能容忍，而 *Kotlin* 默认就规避了这个问题。

由于 *Kotlin* 的这些特性，让原本臃肿的 *Java* 代码摇身一变，成了君子好逑的窈窕淑女。

## 后端眼中的 Kotlin

去年这会儿正好忙着做业务，人手青黄不接，既然 *Kotlin* 写基于 *JVM* 的代码如此之爽，何不用它来撸一撸服务端？说干就干，花了一周时间基于 *Spring Boot* 用 *Kotlin* 撸了一个后端框架，从框架本身来说，与用 *Java 8* 写相差并不大，但是撸业务代码，*Kotlin* 就要甩 *Java* 好几条街，例如：

- 利用扩展方法对数据进行流式处理
- 利用 *Data Class* 进行数据序列化与反序列化
- 利用 `?:` 和参数默认值实现 *REST API* 参数有效性检查
- 利用 *String Template* 拼 *SQL* 语句
- ...

由于使用 *Kotlin* 极大的提升了开发效率，以至于我一个人完成了几个项目的后端开发。

## 前端眼中的 Kotlin 

在 *JavaScript* 界，流传着一个经典的定律 —— Atwood 定律，由 Jeff Atwood 在 2007 年提出

> Any application that can be written in JavaScript, will eventually be written in JavaScript.

当我用过 *Kotlin* 之后，再去写 *JavaScript* 的时候，就异常痛苦，总想着用 *Kotlin* 代替 *JavaScript* ，而且 *Kotlin* 也支持跨平台，所以就有了用 *Kotlin* 写 *Vue* 应用的想法，这也是 [Kive](https://github.com/johnsonlee/kive) 这个项目的由来，从头撸下来，发现 *Kotlin* 对 *JavaScript* 原生的特性的支持不是很好，尤其是操作 `JSON` 数据，写起来很蛋疼，后来用了自定义 *DSL* 的特性，才勉强看起来像 *JavaScript* ：

```kotlin
fun <T> jsobject(fn: T.() -> Unit) = (js("{}") as T).apply(fn)

val router = VueRouter(jsobject {
    routes = arrayOf(
            jsobject {
                path = "/"
                component = home
            },
            jsobject {
                path = "/settings"
                component = settings
            }
    )
})
```

加上 *Kotlin* 编译成 *JavaScript* 不支持 *ES 6* 规范，只好自定义 *Gradle Plugin* ，算是勉强能写出一个 *Vue* App 了，不过最终还是放弃了，用原生 *JavaScript* 几行代码就搞定的事情用 *Kotlin* 写就像用 *C* 写 *GUI* 程序一样蛋疼。

## 我眼中的 Kotlin

前段时间在写静态分析器，整个框架仅用了不到一周的时候的时间就完成了，大部分的时间都是在优化性能，在这个优化的过程中，让我开始怀念 *Java* 了，渐渐对 *Kotlin* 有了一些新的认识。

### Java 是一门严谨的语言

无论是初学者，还是高级工程师写出的代码，在语法风格上不会有太大的差异，毕竟 *Java* 没有什么高级特性，能写个 *lambda* 就已经是很潮了，但 *Kotlin* 不一样，它的高阶特性容易成为炫技的手段而不注重代码的可读性，就好比 *C++* ，加入了太多的特性，以至于代码读起来晦涩难懂，如果没有强大的 IDE，根本无从理解作者的意图，举个例子：

```kotlin
private val nodesRunOnMainThread = mutableSet<Node>()

// ...

val nodes = entryPoints.map {
    CallGraph.Node(clazz.name, it.name, it.desc)
}
this.nodesRunOnMainThread += nodes
```

咋一看，`this.nodesRunOnMainThread += nodes` 好像很理所当然，但是有谁会关心 `+=` 和 `+` 对于 `Collection` 操作究竟有什么区别呢？

*Kotlin* 官方给出的定义是：

| Expression |  Translated to   |
|------------|------------------|
| a + b      | a.plus(b)        |
| a += b     | a.plusAssign(b)  |

那么，问题来了：

> `a + b` 和 `a += b` 会不会改变 `a` 或者 `b` 原来的内容呢？

貌似官方也没有明确的规范，如果 `operator` 的实现者没有按照约定俗成的规范来实现呢？不可否认，`operator` 确实可以让代码变得更简洁，但是，一味的追求简洁，而不注重代码的可读性，只会让代码变得更加晦涩难懂，而作者还因为别人看不懂而自诩为高深。

再举一个例子 —— 重载操作符，对比下面两段代码：

```kotlin
private val nodesRunOnMainThread = mutableMap<String, MutableSet<Node>>()

// ...

val node = CallGraph.Node(clazz.name, it.name, it.desc)
this.nodesRunOnMainThread[clazz.name] += node
```

```kotlin
private val nodesRunOnMainThread = mutableMap<String, MutableSet<Node>>()

// ...

val nodes = entryPoints.map {
    CallGraph.Node(clazz.name, it.name, it.desc)
}
this.nodesRunOnMainThread[clazz.name] += nodes
```

上面的例子如果不够细心，可能还真看不出有什么区别，其实就是 `+=` 右边的值的类型不一样，一个是 `Node` 对象，一个是 `Collection<Node>`，这有什么问题吗？如果是普通的程序，可能问题不大，但是，当数据量足够大，对于性能要求足够高的情况下，这儿可能就会成为瓶颈，试想一下，静态分析器要在尽可能短的时候内分析数十万个 *class* ，而且每个类中又有成百上千甚至上万的指令，每多一次循环，就会额外增加运算开销，而且这些细节极为隐蔽，很容易被人所忽略。

### Kotlin 表达不够明确

像 *Kotlin* `mutableXxx()` 和 `mutableXxxOf(...)` 以及 `xxxOf()` 等这些创建集合的方法，究竟 *Mutable* 和 *Immutable* 对应的集合类型是什么？我想，只有看过源码才敢回答问题，谁能保证以后的版本会不会改变默认的类型？

就像 `mutableMap()` 实际上是创建的 `LinkedHashMap`，为什么是 `LinkedHashMap` 而不是 `HashMap`？

### Kotlin 标准库的性能问题

我们在对数据进行流式处理的时候，经常会用到 `toList()`，`toMap()`，`toSet()` 等等，请看 `toSet()` 的实现：

```kotlin
public fun <T> Iterable<T>.toSet(): Set<T> {
    if (this is Collection) {
        return when (size) {
            0 -> emptySet()
            1 -> setOf(if (this is List) this[0] else iterator().next())
            else -> toCollection(LinkedHashSet<T>(mapCapacity(size)))
        }
    }
    return toCollection(LinkedHashSet<T>()).optimizeReadOnlySet()
}
```

发现问题了吗？如果 `this` 本身就是 `Set` 类型，还会进行一次内存拷贝，而 *Kotlin* 的标准库中这样的代码不只一两处。

## 新手的困惑

自从 [Booster](https://github.com/didi/booster) 开源后，经常有人问我：

“森哥，看你的 *Kotlin* 代码感觉特别舒服，为什么我自己写总是感觉很别扭呢？“

这一下就把我问懵了，我也不知道怎么来回答这个问题，我一直认为这是个跟艺术细胞相关的问题，终于有一天，我想明白了：”代码看起来舒不舒服，取决于你的代码逻辑的连贯性，如果看起来不舒服，说明代码逻辑的连贯性不够好，就好比新手开车，刹车和油门控制不好，强烈的顿挫感让乘客想吐，老司机启动、停车就很顺滑，完全感觉不到顿挫感，逻辑的不连贯就是代码的顿挫感“。

“怎么理解逻辑的连贯性呢？”

“就好比用对数据进行流式处理，第一步，获取数据，第二步，过滤／去重，第三步，变换，第四步，汇总……，如果用 *Stream API* ，你看着就很舒服，如果用 *Java 7* 或者更早的版本来写，就不如用 *Java 8* 的 *Stream API* 看起来舒服，就因为数据的处理过程是连贯的”

朋友听了，如获至宝，回头就把代码改成了链式调用，为了把两块不相关的逻辑连接起来，又是 `takeIf`，又是 `let`，又是 `apply` 的，简直让人哭笑不得，不要为了保持代码的连贯而故意连贯啊！！！最重要的还是代码的可读性，你的代码不只是自己看的，也是给团队其他人看的，如果要开源，那就是给全世界看的。

最后，给新手的一句忠告：

> 如果简洁和可读性二者不能兼得，那就选择可读性吧。

