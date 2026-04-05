---
title: What Does the Deprecation of AGP Transform API Mean?
lang: en
i18n_key: the-deprecation-of-agp-transform-api
categories:
  - Computer Science
  - Mobile
  - Android
tags:
  - Android
  - Build
  - Gradle
date: 2021-08-02 00:00:00
---

AGP 7.0 was officially released a few days ago. Sharp-eyed developers may have noticed that the Transform API, which had been around since AGP 1.3, is now marked as deprecated. The deprecation notice doesn't mention a replacement, which understandably set off some alarm: if even the most stable API in AGP is being deprecated, does this mean bytecode instrumentation is being phased out?

## Early Signs

Starting with AGP 4.2, several new APIs related to bytecode manipulation appeared, including *AsmClassVisitorFactory* under the *com.android.gradle.instrumentation* package. At first glance, I had no idea what it was for. My initial reaction was: did the AGP team build something similar to Booster? After digging into it, I realized I was overthinking it. The AGP team isn't there yet -- they can barely keep up with their own bugs, let alone build a bytecode injection framework. Besides, when it comes to bytecode tricks on Android, Chinese teams are several leagues ahead of everyone else, including Silicon Valley. Developers in China have taken bytecode manipulation to absurd extremes -- literally writing business logic with ASM, competing at a level that even Silicon Valley's mobile teams can only watch from afar.

After further research, things became clearer. The new Instrumentation APIs in AGP actually come from Gradle, not AGP itself. This also explains why AGP's version numbering was aligned with Gradle's, jumping from 4.2 straight to 7.0. It's not just AGP that needs Transform capabilities -- Java projects do too. So it makes sense for Gradle to provide a unified Transform API.

## What Now?

Many teams in China rely heavily on AGP's Transform API for various bytecode hacks. So the question is: what happens if AGP 8.0 removes the Transform API entirely? Especially for projects deeply dependent on bytecode instrumentation. Some teams are saying: "AGP 7.0? We haven't even upgraded to 4.0 yet!"

Although AGP hasn't explicitly named a replacement for the Transform API, the new APIs make the direction clear: use Gradle's [TransformAction](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.transform.TransformAction.html) to replace the old Transform API. In fact, AGP has already been using Gradle's [TransformAction](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.transform.TransformAction.html) to transform dependency artifacts for quite some time.

## TransformAction

Gradle's official documentation already provides detailed guidance on how to use [TransformAction](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.transform.TransformAction.html) -- see [Transforming dependency artifacts on resolution](https://docs.gradle.org/current/userguide/artifact_transforms.html). Similar to AGP, you need to register it first. The difference is that AGP registers *Transforms* through the *Android Extension*, while Gradle registers *TransformActions* through *DependencyHandler*. The gap isn't that big.

For projects using Booster plugins, migrating to AGP 7.0 is nearly zero-cost. Booster has an abstraction layer in between -- whether the underlying implementation uses AGP's Transform API or Gradle's TransformAction, developers don't need to care. As long as the transform works correctly, that's all that matters.
