---
title: Android 应用构建优化指南
date: 2020-11-25 00:00:00
categories: Android
tags:
  - Android
  - Build
  - Compiler
---

大家吐槽 Android 构建慢已经不是一天两天了，尽管都已经换成了最新款的 MBP，打个包依然要等一根烟的时间，不是 RD 小哥偷懒不干活儿，本地打包的时候机器卡得一批，实在是啥也干不了呀。

## 升级 Android Gradle Plugin

为了提升构建的速度，*Gradle* 团队和 *Android* 团队也是操碎了心，各种增量编译都支持得越来越好，所以，有什么理由不升级到最新的 *Android Gradle Plugin* 版本呢？

有人说：我们魔改了 *Android Gradle Plugin* ，一升级所有 *Gradle* 插件全跪，更有甚者，魔改 *Kotlin* 编译器，然后，天天查各种莫名其妙的问题，说得好听点儿叫「魔改」，说得不好听，就是「瞎JB乱改」，在乱改的时候，难道就没想过后续要升级的么？

## 升级 Gradle

*Android Gradle Plugin* 对 *Gradle* 的版本有最低版本要求，在满足最低版本的情况，可以考虑升级 *Gradle* 版本，以下是最近各个版本在构建性能方面的优化：

1. Gradle 6.7
    - [文件系统监视 （File-system watching）](https://docs.gradle.org/6.5/userguide/gradle_daemon.html#sec:daemon_watch_fs)正式发布
    - 针对 *Configuration* 缓存的持续优化
1. Gradle 6.6
    - 针对 *Configuration* 缓存的优化
    - 针对 *runtime classpath* 的缓存优化
    - 依赖管理优化
    - [文件系统监视 （File-system watching）](https://docs.gradle.org/6.5/userguide/gradle_daemon.html#sec:daemon_watch_fs)功能稳定性优化
1. Gradle 6.5
    - 新增加了[文件系统监视 （File-system watching）](https://docs.gradle.org/6.5/userguide/gradle_daemon.html#sec:daemon_watch_fs)功能（还在实验中），从官方提供的性能报告来看，开启后，性能提升将近 20%
1. Gradle 6.4
    - 优化了依赖文件锁
1. Gradle 6.3
    - (没啥优化)
1. Gradle 6.2
    - 新增了[依赖缓存共享](https://docs.gradle.org/6.2/release-notes.html#shared-dependency-cache)功能
1. Gradle 6.1 
    - 新增了[依赖缓存重定位](https://docs.gradle.org/6.1/release-notes.html#gradle's-dependency-cache-can-be-relocated)功能
1. Gradle 6.0
    - 针对 *Java* 和 *Groovy* 的增量编译优化

## 使用 G1 GC

基本上 *Android* 开发都是用的 *Java 8* ，但 *Java 8* 的默认 *GC* 是 *Parallel GC* ，相对于 *G1 GC* ，性能上还是有些差距，可以通过升级 *JDK* 版本，或者设置 *JVM* 参数 `-XX:+UseG1GC` 来启用 *G1 GC* ：

## 使用多进程编译

*Gradle* 提供了 `forkOptions`，可以让 `JavaCompile` 任务分进程进行编译，这样做的好处是可以有效的降低内存的占用，不过，分进程的方式不一定适合所有工程，在正式使用前，还需要用 *Profiling* 工具对工程进行分析。

## 使用 Build Cache

开启 *Build Cache* 有两种方式：

1. 命令行参数 `--build-cache`
1. 在 `gradle.properties` 中配置 `org.gradle.caching=true`

作为 *Gradle Plugin* ，尽可能的使用 *Cacheable API* 来创建 *Task* ，这样才能更好的支持增量编译。

## 使用 build features 选项

*Android Gradle Plugin* 从  `4.0.0` 开始提供了一系列 [BuildFeatures](https://developer.android.com/reference/tools/gradle-api/4.1/com/android/build/api/dsl/BuildFeatures) 选项：

1. `aidl`
1. `buildConfig`
1. `compose`
1. `prefab`
1. `renderScript`
1. `resValues`
1. `databinding`
1. `shaders`
1. `viewBinding`
1. `...`

可以通过 [BuildFeatures](https://developer.android.com/reference/tools/gradle-api/4.1/com/android/build/api/dsl/BuildFeatures) *DSL* 或者 *properties* 选项来关闭一些影响构建性能的特性，如： `buildConfig`。

为什么 *BuildConfig* 会影响构建性能呢？因为 *BuildConfig* 会生成 *Java* 文件，一旦 *BuildConfig.java* 这个文件需要重新编译，那么所有依赖 *BuildConfig* 的缓存将会失效，所以，尽可能的避免生成的代码的变化，一般情况下，切分支，切 *BuildVariant* 是最容易导致缓存失效的，如果磁盘空间足够的情况下，可以考虑每个分支单独弄个目录。

## 使用 android-cache-fix-gradle-plugin

*Android Gradle Plugin* 各个版本在使用 *build cache* 的时候，会存在各种奇葩的 *bug* ，这个插件就是为了解决 *build cache* 失效的问题，目前已知的可以通过这个插件进行修复的问题有：

1. [`CompileLibraryResourcesTask` 的 `mergedLibraryResourcesDir` 属性导致的缓存失效问题](https://issuetracker.google.com/issues/155218379)
1. [`DexFileDependenciesTask` 导致的缓存失效的问题](https://issuetracker.google.com/160138798)
1. [`MergeJavaResourcesTask` 的 `projectJavaRes` 属性导致的缓存失效的问题](https://issuetracker.google.com/issues/140602655)
1. [`MergeNativeLibsTask` 的 `projectNativeLibs` 属性导致的缓存失效的问题](https://issuetracker.google.com/issues/140602655)
1. [`MergeResources` 的 `rawLocalResources` 属性导致的缓存失效的问题](https://issuetracker.google.com/issues/141301405)
1. [通过 `annotationProcessorOptions` 设置 `room.schemaLocation` 导致缓存失效的问题](https://issuetracker.google.com/issues/132245929)

但依然还有一些问题未能修复：

1. [`CompileLibraryResourcesTask` 不能重定位的问题](https://issuetracker.google.com/issues/155218379)
1. [`DexFileDependenciesTask` 不能缓存的问题](https://issuetracker.google.com/160138798)
1. [`MergeResources` 不能重定位的问题](https://issuetracker.google.com/issues/141301405)
1. [`Room` 注解处理器导致缓存失效的问题](https://issuetracker.google.com/issues/132245929)

## 使用 Booster 兼容库

如果不幸用到了 *Android Gradle Plugin* 的非公开 *API* ，也不必担心，[booster-android-gradle-api](https://github.com/didi/booster/tree/master/booster-android-gradle-api) 提供了一些针对 *Android Gradle Plugin* 常用的 *API* 的兼容 *API* ，完全采用 *Kotlin Extension* 来定义，迁移成本相当低，像 [didi/DoraemonKit](https://github.com/didi/DoraemonKit), [bytedance/ByteX](https://github.com/bytedance/ByteX) 等很多插件都在使用，目前支持最新的 *Android Gradle Plugin* 稳定版本 `4.1.0`，为了保证兼容性和稳定性，[Booster](https://github.com/didi/booster) 在兼容性测试方面也投入了大量精力，从 `3.0.0` 到 `4.1.0` 逐个版本跑测试用例，如果 [booster-android-gradle-api](https://github.com/didi/booster/tree/master/booster-android-gradle-api) 有未覆盖到的 *API* ，可以直接在 *GitHub* 上[提 Issue](https://github.com/didi/booster/issues/new)。

## 使用 dagger-reflect

如何项目中有使用 `dagger` 实现依赖注入，无可避免的在每个模块中引入 *APT* ，这会大大降低构建的速度，为了避免 *APT* 带来的构建性能损耗，可以在开发阶段使用 [dagger-reflect](https://github.com/JakeWharton/dagger-reflect) 来完成消除 *APT* 带来的影响。

如果项目中使用的是别的依赖注入框架，如果还没有对 *debug* 构建进行优化，可以参考 [dagger-reflect](https://github.com/JakeWharton/dagger-reflect) 的全反射消除 *APT* 的方案。

关于 *APT* 是如何影响构建速度，以及 *Gradle* 是如何改进它的，可以参考 [gradle#1320](https://github.com/gradle/gradle/issues/1320) 以及 [Incremental Annotation Processing](https://github.com/gradle/gradle/files/1659294/Incremental.Annotation.Processing.-.Public.Copy.pdf)。

## 使用 gralde-profiler

[Gradle Profiler](https://github.com/gradle/gradle-profiler) 是 *Gradle* 团队提供的用于自动收集 *Gradle* 构建的性能分析和基准测试信息的工具，可以通过它来生成各种 *Profiling* 工程支持的格式的文件，例如：

- [Gradle build scans](https://gradle.com/)
- [Async Profiler](https://github.com/jvm-profiling-tools/async-profiler)
- [JProfiler](https://www.ej-technologies.com/products/jprofiler/overview.html)
- [YourKit](https://www.yourkit.com/)
- [Java flight recorder](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm#JFRUH170)
- [Chrome trace](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool)

不过说实话，这些工具中，数 [Chrome trace](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) 最方便，主要还是因为免费（穷），加上 *Android* 的 [systrace](https://developer.android.com/studio/profile/systrace) 也是用它，使用起来已经非常顺手了，通过 [Chrome trace](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) 生成火陷图，就可以很方便的找出性能瓶颈。

## 升级硬件

把 MBP 升级到顶配是最直接的，这对于企业来说是最经济的方式，这笔账其实很好算，不要只看到眼前，为了所谓的节省开支，让一帮中高级工程师在那儿吭哧吭哧魔改(瞎JB乱改)一个不能升级的版本，到头来会影响整个团队的开发效率。

## Android Studio on Cloud

这个就不啰嗦了，参考 [johnsonlee/ascloud](https://github.com/johnsonlee/ascloud) 这个项目，直接在云端跑 *Android Studio* ，MBP 性能不够就拿服务器硬件凑吧。

