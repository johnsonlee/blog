---
title: "How to Make a Gradle Plugin and Library Coexist in One Project"
lang: en
i18n_key: integrate-gradle-plugin-and-library-into-one-project
categories:
  - Computer Science
  - Gradle
tags:
  - Java
  - Android
  - Maven
date: 2021-10-06 23:00:00
---

When developing an __Android Library__ that also needs a corresponding __Gradle Plugin__, it is not easy for Gradle beginners to integrate an __Android Library__, a __Gradle Plugin__, and an __Example App__ all in a single __Gradle__ project. The main issue is that the __Android App__ module cannot reference a __Gradle Plugin__ module within the same project, because the __Gradle Plugin__ must be configured and compiled before all other modules. As a result, many engineers develop and publish the __Gradle Plugin__ as a separate project. For those who frequently develop and debug __Gradle Plugins__, this is extremely painful -- every change to the __Gradle Plugin__ requires publishing to __Maven Local__ first, then debugging across projects. The efficiency is terrible. So is there an elegant solution?

## The buildSrc Module

To let an __Android App__ reference a __Gradle Plugin__ module in the same project, the __Gradle Plugin__ module cannot be a regular module. Fortunately, __Gradle__ provides the __buildSrc__ mechanism -- __Gradle__ automatically compiles and tests the __buildSrc__ directory under the project root as a [Composite Build](https://docs.gradle.org/current/userguide/composite_builds.html#composite_build_intro), and adds its output to the __buildscript__ __classpath__. This makes the __Gradle Plugin__ defined in __buildSrc__ accessible.

Although referencing the __Gradle Plugin__ is solved, publishing the __Gradle Plugin__ module and the __Android Library__ module from the same project is still a problem. For __buildSrc__, even though it is in the same project, __Gradle__ treats it as a completely isolated project. This means:

* __buildSrc__ modules and regular modules cannot be published simultaneously
* All configurations and properties cannot be shared between __buildSrc__ and regular modules, e.g., version numbers

So how do we solve these problems?

## The Shadow Module

To have our cake and eat it too, we must turn the __buildSrc__ module into a regular module. We can create an additional __Java/Kotlin Library__ module to handle the __Gradle Plugin__ publishing problem. The project structure looks like:

```
.
├── app
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── sdk
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── plugin (shadow module)
│   └── build.gradle.kts
├── gradle
│   └── wrapper
├── gradle.properties
├── gradlew
├── gradlew.bat
├── build.gradle.kts
├── buildSrc
│   ├── build.gradle.kts
│   └── src
└── settings.gradle.kts
```

But the question is, how do we let this regular module share code from __buildSrc__?

### Symbolic Links

Those familiar with __Linux__ might think of a convenient approach -- symbolic links (soft links), somewhat like "shortcuts" in __Windows__. We can create a __src__ symlink in the __plugin__ module pointing to __buildSrc/src__ using the `ln` command:

```bash
$ cd plugin
$ ln -s ../buildSrc/src src
```

The project structure then looks like:

```
.
├── app
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── sdk
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src
├── plugin (shadow module)
│   ├── src -> ../buildSrc/src (symlink)
│   └── build.gradle.kts
├── gradle
│   └── wrapper
├── gradle.properties
├── gradlew
├── gradlew.bat
├── build.gradle.kts
├── buildSrc
│   ├── build.gradle.kts
│   └── src
└── settings.gradle.kts
```

This neatly solves the code-sharing problem between a regular __Gradle__ module and the __buildSrc__ module.

### Source Set

Due to cross-platform differences -- for example, it is uncertain whether __Windows__ and __*nix__ systems both handle symlinks well (I have not tested on __Windows__) -- is there a more compatible solution? The answer is yes: __Source Set__. We can configure an additional __SourceSet__ for the __plugin__ module:

```kotlin
sourceSets {
    main {
        java {
            srcDirs("../buildSrc/src/main/java")
        }
    }
}
```

This perfectly solves all the problems. For the version number issue, we can configure it uniformly through `allprojects` or `subprojects` in the root __build.gradle.kts__:

```kotlin
allprojects {
    group = "io.johnsonlee"
    version = "1.0.0"
}
```

So the __plugin__ module handles __Gradle Plugin__ publishing, while __buildSrc__ handles __Gradle Plugin__ referencing within the same project. The __plugin__ module and the __buildSrc__ module share the same code, except for __build.gradle.kts__, which has slight differences:

* Since __buildSrc__ is a completely independent project, using the `plugins` DSL to enable plugins requires specifying the version number
* The __plugin__ module does not need to specify the version number in the `plugins` DSL (because it is already specified in the root __build.gradle.kts__)
* The __buildSrc__ module does not need publishing, so it does not need to enable publishing-related plugins like `maven-publish`

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
