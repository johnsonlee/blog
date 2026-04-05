---
title: Android App Build Optimization Guide
categories:
  - Computer Science
  - Mobile
  - Android
tags:
  - Android
  - Build
  - Compiler
date: 2020-11-25 00:00:00
lang: en
i18n_key: android-app-build-optimization-guide
---

Complaining about slow Android builds is nothing new. Even after upgrading to the latest MBP, building a package still takes long enough to smoke a cigarette. It's not that developers are slacking off -- when a local build is running, the machine grinds to a halt and you literally can't do anything else.

## Upgrade Android Gradle Plugin

To improve build speed, the Gradle team and Android team have been working tirelessly -- incremental compilation keeps getting better and better. So why not upgrade to the latest version of Android Gradle Plugin?

Some people say: "We've hacked the Android Gradle Plugin, and upgrading would break all our Gradle plugins." Even worse, some teams hack the Kotlin compiler, then spend their days debugging bizarre issues. To put it nicely, it's "customization"; to put it bluntly, it's reckless modification. When making those changes, did no one think about future upgrades?

## Upgrade Gradle

Android Gradle Plugin has a minimum Gradle version requirement. As long as the minimum is met, consider upgrading Gradle. Here are recent build performance improvements across versions:

1. Gradle 6.7
    - [File-system watching](https://docs.gradle.org/6.5/userguide/gradle_daemon.html#sec:daemon_watch_fs) officially released
    - Continued optimization of Configuration cache
1. Gradle 6.6
    - Configuration cache optimization
    - Runtime classpath cache optimization
    - Dependency management optimization
    - [File-system watching](https://docs.gradle.org/6.5/userguide/gradle_daemon.html#sec:daemon_watch_fs) stability improvements
1. Gradle 6.5
    - Added [File-system watching](https://docs.gradle.org/6.5/userguide/gradle_daemon.html#sec:daemon_watch_fs) (experimental). According to official benchmarks, enabling it yields nearly 20% performance improvement
1. Gradle 6.4
    - Optimized dependency file locking
1. Gradle 6.3
    - (No notable optimizations)
1. Gradle 6.2
    - Added [shared dependency cache](https://docs.gradle.org/6.2/release-notes.html#shared-dependency-cache)
1. Gradle 6.1
    - Added [dependency cache relocation](https://docs.gradle.org/6.1/release-notes.html#gradle's-dependency-cache-can-be-relocated)
1. Gradle 6.0
    - Incremental compilation optimization for Java and Groovy

## Use G1 GC

Most Android development uses Java 8, but Java 8's default GC is Parallel GC. Compared to G1 GC, there's still a noticeable performance gap. You can enable G1 GC by upgrading the JDK version or setting the JVM parameter `-XX:+UseG1GC`. Not recommended if heap size is below 4GB.

## Use Multi-Process Compilation

Gradle provides `forkOptions`, allowing `JavaCompile` tasks to compile in separate processes. The benefit is reduced memory usage. However, multi-process compilation doesn't suit every project -- use profiling tools to analyze your project before adopting it.

## Use Build Cache

There are two ways to enable Build Cache:

1. Command line parameter `--build-cache`
1. Set `org.gradle.caching=true` in `gradle.properties`

As a Gradle Plugin developer, use the Cacheable API whenever possible to create Tasks -- this enables better incremental compilation support.

## Use Build Features Options

Starting from version `4.0.0`, Android Gradle Plugin provides a set of [BuildFeatures](https://developer.android.com/reference/tools/gradle-api/4.1/com/android/build/api/dsl/BuildFeatures) options:

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

You can disable build-performance-affecting features through the [BuildFeatures](https://developer.android.com/reference/tools/gradle-api/4.1/com/android/build/api/dsl/BuildFeatures) DSL or properties options, such as `buildConfig`.

Why does BuildConfig affect build performance? Because BuildConfig generates Java files. Once `BuildConfig.java` needs recompilation, all caches depending on BuildConfig are invalidated. So avoid changes to generated code as much as possible. Typically, switching branches or BuildVariants most easily invalidates the cache. If disk space allows, consider using a separate directory for each branch.

## Use android-cache-fix-gradle-plugin

Various versions of Android Gradle Plugin have quirky bugs with build cache. This plugin exists to fix build cache invalidation issues. Currently known fixable issues include:

1. [Cache invalidation from `CompileLibraryResourcesTask`'s `mergedLibraryResourcesDir` property](https://issuetracker.google.com/issues/155218379)
1. [Cache invalidation from `DexFileDependenciesTask`](https://issuetracker.google.com/160138798)
1. [Cache invalidation from `MergeJavaResourcesTask`'s `projectJavaRes` property](https://issuetracker.google.com/issues/140602655)
1. [Cache invalidation from `MergeNativeLibsTask`'s `projectNativeLibs` property](https://issuetracker.google.com/issues/140602655)
1. [Cache invalidation from `MergeResources`' `rawLocalResources` property](https://issuetracker.google.com/issues/141301405)
1. [Cache invalidation from setting `room.schemaLocation` via `annotationProcessorOptions`](https://issuetracker.google.com/issues/132245929)

Some issues remain unfixed:

1. [`CompileLibraryResourcesTask` relocation issue](https://issuetracker.google.com/issues/155218379)
1. [`DexFileDependenciesTask` caching issue](https://issuetracker.google.com/160138798)
1. [`MergeResources` relocation issue](https://issuetracker.google.com/issues/141301405)
1. [`Room` annotation processor cache invalidation](https://issuetracker.google.com/issues/132245929)

## Use Booster Compatibility Library

If you're unfortunately using non-public APIs from Android Gradle Plugin, don't worry -- [booster-android-gradle-api](https://github.com/didi/booster/tree/master/booster-android-gradle-api) provides compatibility APIs for commonly used Android Gradle Plugin APIs. Defined entirely as Kotlin Extensions, migration cost is very low. Many plugins including [didi/DoraemonKit](https://github.com/didi/DoraemonKit) and [bytedance/ByteX](https://github.com/bytedance/ByteX) are already using it. It currently supports the latest stable Android Gradle Plugin version `4.1.0`. To ensure compatibility and stability, [Booster](https://github.com/didi/booster) has invested significant effort in compatibility testing, running test cases against every version from `3.0.0` to `4.1.0`. If [booster-android-gradle-api](https://github.com/didi/booster/tree/master/booster-android-gradle-api) doesn't cover an API you need, feel free to [open an issue](https://github.com/didi/booster/issues/new) on GitHub.

## Use dagger-reflect

If your project uses `dagger` for dependency injection, APT is unavoidably introduced in every module, significantly slowing down builds. To avoid the build performance hit from APT, consider using [dagger-reflect](https://github.com/JakeWharton/dagger-reflect) during development to eliminate APT's impact.

If your project uses a different DI framework that hasn't been optimized for debug builds, you can reference [dagger-reflect](https://github.com/JakeWharton/dagger-reflect)'s full-reflection approach to eliminating APT.

For details on how APT affects build speed and how Gradle has improved it, see [gradle#1320](https://github.com/gradle/gradle/issues/1320) and [Incremental Annotation Processing](https://github.com/gradle/gradle/files/1659294/Incremental.Annotation.Processing.-.Public.Copy.pdf).

## Use gradle-profiler

[Gradle Profiler](https://github.com/gradle/gradle-profiler) is a tool from the Gradle team for automatically collecting Gradle build profiling and benchmarking information. It can generate files in formats supported by various profiling tools, such as:

- [Gradle build scans](https://gradle.com/)
- [Async Profiler](https://github.com/jvm-profiling-tools/async-profiler)
- [JProfiler](https://www.ej-technologies.com/products/jprofiler/overview.html)
- [YourKit](https://www.yourkit.com/)
- [Java flight recorder](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm#JFRUH170)
- [Chrome trace](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool)

Honestly, among all these tools, [Chrome trace](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) is the most convenient -- mainly because it's free, and since Android's [systrace](https://developer.android.com/studio/profile/systrace) also uses it, it feels very familiar. Generating flame graphs with Chrome trace makes it easy to identify performance bottlenecks.

## Upgrade Hardware

Upgrading to a top-spec MBP is the most straightforward approach and actually the most economical for companies. The math is simple -- don't be shortsighted. Trying to save money by having mid-to-senior engineers hack away at a non-upgradeable version will end up hurting the entire team's development efficiency.

## Android Studio on Cloud

Nothing much to elaborate here -- check out the [johnsonlee/ascloud](https://github.com/johnsonlee/ascloud) project. Run Android Studio directly in the cloud. If your MBP can't handle it, let server hardware pick up the slack.
