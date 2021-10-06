---
title: 如何让 Gradle Plugin 与 Library 共存
date: 2021-10-06 23:00:00
categories: Gradle
tags:
  - Java
  - Android
  - Maven
---

当开发一个 __Android Library__ 时，如果还同时还要提供相应的 __Gradle Plugin__，对于 __Gradle__ 新手来说，要在一个 __Gradle__ 工程中同时集成 __Android Library__，__Gradle Plugin__ 和 __Example App__ 三个模块，并不是一件很容易的事，主要的问题在于 __Android App__ 模块中无法引用同一个工程中的 __Gradle Plugin__ 模块，这是因为 __Gradle Plugin__ 需要先于所有的工程进行配置和编译，所以，很多工程师都会将 __Gradle Plugin__ 作为一个独立的工程进行开发和发布，这对于频繁地开发和调试 __Gradle Plugin__ 的工程师来说，是非常的痛苦，每次修改了 __Gradle Plugin__ 都要先发布到 __Maven Local__，然后再跨工程进行调试，效率极低，那有什么优雅的解决方案呢？

## buildSrc 模块

要让 __Android App__ 能引用到同一个工程中的 __Gradle Plugin__ 模块，那么，这个 __Gradle Plugin__ 模块就不能是一个普通的模块，正好 __Gradle__ 提供了 __buildSrc__ 的机制，__Gradle__ 默认会将工程根目录下的 __buildSrc__ 目录作为 [Composite Build](https://docs.gradle.org/current/userguide/composite_builds.html#composite_build_intro) 自动编译和测试，并将其产物添加到 __buildscript__ 的 __classpath__ 中，这样就可以访问到 __buildSrc__ 中定义的 __Gradle Plugin__ 了。

虽然引用 __Gradle Plugin__ 的问题解决了，但是，想要同时发布同一个工程中的 __Gradle Plugin__ 模块和 __Android Library__ 模块是一个问题，因为对于 __buildSrc__ 来说，虽然是在同一个工程中，但其实在 __Gradle__ 看来，它是一个完全隔离的工程，这就意味着：

__ __buildSrc__ 模块与普通模块不能同时进行发布
__ 所有的配置和属性都不能在 __buildSrc__ 和普通模块间共享，例如：版本号

那如何才能上述的问题呢？

## 影子模块

要想「鱼和熊掌兼得」，就必须将 __buildSrc__ 模块变成一个普通模块，所以，我们可以再创建一个普通的 __Java/Kotlin Library__ 模块，用来解决 __Gradle Plugin__ 的发布问题，工程目录结构如下：

```
.
├── app
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── sdk
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── plugin (影子模块)
│   └── build.gradle.kts
├── gradle
│   └── wrapper
├── gradle.properties
├── gradlew
├── gradlew.bat
├── build.gradle.kts
├── buildSrc
│   ├── build.gradle.kts
│   └── src
└── settings.gradle.kts
```

但问题是，如何让这个普通模块共享 __buildSrc__ 中的代码呢？

### 软链接

熟悉 __Linux__ 的用户可能会想到一个比较便捷的方式 —— 软链接（Soft Link），有点类似于 __Windows__ 中的「快捷方式」，通过 `ln` 命令来创建，我们可以在 __plugin__ 模块下创建一个 __src__ 的软链接到 __buildSrc/src__：

```bash
$ cd plugin
$ ln -s ../buildSrc/src src 
```

工程结构如下所示：

```
.
├── app
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── sdk
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── plugin (影子模块)
│   ├── src -> ../buildSrc/src (软链接)
│   └── build.gradle.kts
├── gradle
│   └── wrapper
├── gradle.properties
├── gradlew
├── gradlew.bat
├── build.gradle.kts
├── buildSrc
│   ├── build.gradle.kts
│   └── src
└── settings.gradle.kts
```

这样就很好的解决了普通 __Gradle__ 模块与 __buildSrc__ 模块共享代码的问题了。

### Source Set

由于存在平台间的差异性，例如 __Windows__ 和 __*nix__ 系统之间是否都能很好的兼容软链接，不是很确定（还未在 __Windows__ 上测试过），有没有一种兼容性更好的方案呢？答案是肯定的 —— __Source Set__，我们可以为 __plugin__ 模块配置额外的 __SourceSet__ ：

```kotlin
sourceSets {
    main {
        java {
            srcDirs("../buildSrc/src/main/java")
        }
    }
}
```

这样就完美的解决了所有问题，对于版本号的问题，我们可以在根目录下的 __build.gradle.kts__ 中通过 `allprojects` 或者 `subprojects` 来统一配置：

```kotlin
allprojects {
    group = "io.johnsonlee"
    version = "1.0.0"
}
```

所以，__plugin__ 模块用来解决 __Gradle Plugin__ 的发布问题，而 __buildSrc__ 用来解决同一个工程中的 __Gradle Plugin__ 的引用问题，__plugin__ 模块与 __buildSrc__ 模块共享同一份代码，但 __build.gradle.kts__ 除外，稍微有点细微的差别：

* 由于 __buildSrc__ 是一个完全独立的工程，如果使用 `plugins` DSL 来启用插件需要指定版本号
* __plugin__ 模块中使用 `plugins` DSL 来启用插件不用指定版本号（因为在根目录中的 __build.gradel.kts__ 已经指定过）
* __buildSrc__ 模块不需要发布，所以，不需要启用 `maven-publish` 等跟发布相关的插件

#### buildSrc/build.gradle.kts

```kotlin
plugins {
    `java-gradle-plugin`
    `kotlin-dsl`
    kotlin("jvm") version "1.5.30"
    kotlin("kapt") version "1.5.30"
}
```

#### plugin/build.gradle.kts

```kotlin
plugins {
    `java-gradle-plugin`
    `maven-publish`
    `signing`
    kotlin("jvm")
    kotlin("kapt")
}
```
