---
title: Reunderstanding Kotlin
categories:
  - Computer Science
  - Kotlin
tags: Kotlin
date: 2020-03-24 00:00:00
lang: en
i18n_key: reunderstanding-kotlin
---

About two years ago, [Booster](https://github.com/didi/booster) wasn't yet planned for open source, and the first version was written in *Java 8*, not *Kotlin*. The decision to rewrite [Booster](https://github.com/didi/booster) in *Kotlin* wasn't because *Java 8* was bad -- though it had its issues. The primary motivation, beyond fixing design flaws, was to truly master *Kotlin* as a language.

*Kotlin* felt like a natural fit from the start. Probably because of my familiarity with *JavaScript* -- I had an innate affinity for functional programming. The experience was silky smooth, always flowing, rarely interrupted by language limitations. I'm sure most people feel the same the first time they use *Kotlin*: it's just so *nice* to write. How nice? Take the [Booster](https://github.com/didi/booster) rewrite: work that took a month in *Java 8* was done in three weeks (or less) with *Kotlin* -- leaving a spare week to slack off.

Why does *Kotlin* flow so smoothly? Language design probably accounts for much of it, but I won't discuss language design here. Instead, I'll share practical experiences and insights from daily development as someone who's been through it.

## Kotlin Through a Beginner's Eyes

### Rich APIs

*Kotlin* provides a massive collection of utility APIs, so you rarely need to reinvent the wheel. Just for data stream processing, beyond the *Stream API*, there are extremely handy functions like:

- `Iterable.chuncked(Int)`
- `Iterable.windowed(...)`
- `Iterable.withIndex()`
- `Iterable.zipWithNext()`

### Extension Functions

*Kotlin*'s rich APIs are built on extension functions. Imagine if they were just a pile of `static` methods -- would the coding experience be this smooth? Absolutely not. Anyone who's written *JavaScript* knows the feeling. While the *JavaScript* ecosystem has great libraries like [underscore](https://underscorejs.org/), can they chain calls without changing the `this` reference like *Kotlin* does?

### Strict Type Checking

Although *Java 8* introduced `Optional`, it's awkward to use -- more code, heavier API signatures. *Kotlin* solves this at the syntax level. In the *Kotlin* world, `NullPointerException` is history.

### Powerful Compiler

Since *Java* 1.5 introduced generics, the compiler's type inference has been incrementally improving -- from *Covariant Return Types* to the *Diamond* operator to *Java 8*'s type inference. Overall, not much changed; it just shrinks a line from 120 columns to 80. *Kotlin*'s concise syntax shrinks it to 40. For someone accustomed to *JavaScript*'s `var`/`let`, *Kotlin*'s `val` absolutely crushes Java's verbose type declarations. When writing *Java*, I always add `final` to variables -- I consider it a good habit that eliminates accidental reassignment bugs. *Kotlin* makes this the default.

Thanks to these features, previously bloated *Java* code transforms into something elegant and approachable.

## Kotlin Through a Backend Developer's Eyes

Last year around this time I was heads-down on business work, short on manpower. Since *Kotlin* was so pleasant for *JVM* code, why not use it for the server side? I spent a week building a backend framework with *Spring Boot* in *Kotlin*. The framework itself wasn't dramatically different from *Java 8*, but for business code, *Kotlin* left *Java* in the dust:

- Stream processing with extension functions
- Data serialization and deserialization with *Data Classes*
- *REST API* parameter validation with `?:` and default parameter values
- Building *SQL* statements with *String Templates*
- ...

*Kotlin*'s productivity boost was so significant that I single-handedly handled the backend development for several projects.

## Kotlin Through a Frontend Developer's Eyes

In the *JavaScript* world, there's a classic law -- Atwood's Law, coined by Jeff Atwood in 2007:

> Any application that can be written in JavaScript, will eventually be written in JavaScript.

After using *Kotlin*, going back to *JavaScript* was painful. I kept wanting to use *Kotlin* instead, and since *Kotlin* supports cross-platform compilation, I got the idea of writing *Vue* apps in *Kotlin*. That's how [Kive](https://github.com/johnsonlee/kive) was born. Building it from scratch, I found that *Kotlin*'s support for native *JavaScript* features was poor -- especially manipulating `JSON` data, which was excruciating. I eventually used custom *DSL* features to make it look somewhat like *JavaScript*:

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

Add in the fact that *Kotlin*-to-*JavaScript* compilation didn't support *ES 6*, and I had to write a custom *Gradle Plugin*. The result was barely functional as a *Vue* App. I eventually abandoned the approach -- what takes a few lines of native *JavaScript* was as painful in *Kotlin* as writing *GUI* programs in *C*.

## Kotlin Through My Eyes

I was recently writing a static analyzer. The entire framework took less than a week, with most of the time spent on performance optimization. That optimization process made me start missing *Java* and gradually formed some new perspectives on *Kotlin*.

### Kotlin Lacks Rigor

Whether a beginner or a senior engineer, *Java* code looks roughly the same stylistically -- there aren't many advanced features to show off. Writing a *lambda* is about as fancy as it gets. *Kotlin* is different. Its advanced features can become vehicles for showing off at the expense of readability. Like *C++* -- too many features, and code becomes inscrutable. Without a powerful IDE, you can't decipher the author's intent. For example:

```kotlin
private val nodesRunOnMainThread = mutableSet<Node>()

// ...

val nodes = entryPoints.map {
    CallGraph.Node(clazz.name, it.name, it.desc)
}
this.nodesRunOnMainThread += nodes
```

At first glance, `this.nodesRunOnMainThread += nodes` seems perfectly natural. But who pauses to consider what `+=` versus `+` actually means for `Collection` operations?

*Kotlin*'s official definitions:

| Expression |  Translated to   |
|------------|------------------|
| a + b      | a.plus(b)        |
| a += b     | a.plusAssign(b)  |

The question is:

> Will `a + b` and `a += b` mutate the original contents of `a` or `b`?

The official spec isn't entirely clear. What if an `operator` implementer doesn't follow convention? Operators do make code more concise, but blindly pursuing conciseness at the expense of readability only makes code more opaque -- while the author prides themselves on being "advanced."

Another example -- operator overloading. Compare these two snippets:

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

Without careful attention, you might not spot the difference: the type on the right side of `+=` differs -- one is a `Node` object, the other a `Collection<Node>`. Does it matter? For typical programs, maybe not. But when data volumes are large enough and performance requirements high enough, this can become a bottleneck. Imagine a static analyzer that must process hundreds of thousands of *classes* as fast as possible, each containing hundreds, thousands, or even tens of thousands of instructions. Every extra loop iteration adds computational overhead, and these details are extremely subtle and easy to overlook.

### Kotlin's Expressions Lack Clarity

Take *Kotlin*'s `mutableXxx()`, `mutableXxxOf(...)`, and `xxxOf()` collection factory methods. What are the actual underlying types for *Mutable* versus *Immutable* collections? Only someone who's read the source code can answer confidently. Who can guarantee a future version won't change the default types?

For instance, `mutableMap()` actually creates a `LinkedHashMap`. Why `LinkedHashMap` instead of `HashMap`?

### Kotlin Standard Library Performance Issues

When processing data streams, we frequently use `toList()`, `toMap()`, `toSet()`, and so on. Look at the implementation of `toSet()`:

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

See the problem? If `this` is already a `Set`, it still performs a memory copy. And the *Kotlin* standard library has more than a few instances of this.

## A Beginner's Confusion

Since [Booster](https://github.com/didi/booster) went open source, people often ask me:

"Your *Kotlin* code feels really comfortable to read. Why does mine always feel awkward?"

That stumped me at first. I'd always thought it was related to artistic sensibility. Then one day it clicked: "Whether code feels comfortable depends on the continuity of its logic. If it feels off, the logic lacks flow. It's like a new driver who can't smoothly control the brakes and gas -- passengers feel every lurch. An experienced driver starts and stops so smoothly you barely notice. Logical discontinuity is the jerkiness in code."

"What does 'logical continuity' mean in practice?"

"Think of stream processing data: step one, get the data; step two, filter and deduplicate; step three, transform; step four, aggregate... With the *Stream API*, it reads beautifully. With *Java 7* or earlier, it's less comfortable -- because the data processing flow isn't continuous."

My friend took this to heart, went back, and converted everything to chained calls. To connect two unrelated pieces of logic, they threw in `takeIf`, `let`, `apply` -- an absolute mess. Don't force continuity for the sake of continuity! What matters most is readability. Your code isn't just for you -- it's for your team. If it's open source, it's for the whole world.

A parting word for beginners:

> If you can't have both conciseness and readability, choose readability.
