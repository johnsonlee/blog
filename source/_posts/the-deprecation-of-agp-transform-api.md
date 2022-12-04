---
title: AGP Transform API 被废弃意味着什么？
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

前几天 AGP 7.0 正式发布，细心的同学可能已经发现 从 AGP 1.3 一直存在的 Transform API 被标记为废弃了，但从注释中并没有说明应该用哪个 API 来替代，发现了这个问题，有同学就不淡定了，连 AGP 中最稳定的 Transform API 都被废弃了，以后是不让用字节码插桩了吗？

## 初见端倪

从 AGP 4.2 开始，就出现了几个跟操作字节码相关的新 API ，比如：*com.android.gradle.instrumentation* 包下的 *AsmClassVisitorFactory* ，咋一看，不知道这玩意儿是干啥的，第一次见到这个 API ，我的第一反应是 AGP 不会是搞了个跟 Booster 类似的东西吧，然而研究了一番发现，是我想多了，AGP 团队压根儿就还没到这份儿上呢，自己的 bug 都修不过来，还有心思整字节码注入，况且单从在 Android 上玩字节码这件事情上来看，全球范围内，中国在这方面的经验要甩其他区域甚至硅谷大厂好几条街，都已经丧心病狂到拿 ASM 写业务代码，卷到你开始怀疑人生，这一项技术的应用，连硅谷的移动端团队都望尘莫及。

经过一番研究，终于有了眉目，AGP 新增的这几个跟 Instrumentation 相关的 API 是来自 Gradle，并不是 AGP 原创，这么一来，也就解释了为什么 AGP 的版本要与 Gradle 的版本保持一致，从 4.2 直接跳到 7.0 了，不光是 AGP 需要 Transform，Java 也需要，所以由  Gradle 来提供统一的 Transform API 也合情合理。

## 何去何从

国内很多团队都或多或少的用 AGP 的 Transform API 来搞点儿黑科技，那么问题来了，如果 AGP 8.0 要彻底废弃 Transform API 会怎样？尤其是那些重度依赖字节码插桩的项目，有人说，什么 AGP 7.0，我们连4.0 都还没用上呢！

虽然 AGP 官方没有明确给出 Transform API 的替代品，但从新增的 API 来看，方向已经很明确了，用 Gradle 提供的 [TransformAction](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.transform.TransformAction.html) 来替代原来的 Transform API，而且，AGP 很早就已经开始使用 Gradle [TransformAction](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.transform.TransformAction.html) 来对依赖项进行 transform 了。

## TransformAction

关于 [TransformAction](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.transform.TransformAction.html) 如何使用，Gradle 官方已经提供了很详细的文档--[Transforming dependency artifacts on resolution](https://docs.gradle.org/current/userguide/artifact_transforms.html)，与 AGP 类似，也是需要先注册，只不过 AGP 是通过 *Android Extension* 来注册 *Transform* ，Gradle 是通过 *DependencyHandler* 来注册 *TransformAction* ，差异并不算很大

对于使用了 Booster 的插件来说，迁移到 AGP 7.0 几乎没什么成本，毕竟 Booster 中间抽象了一层，底层是用 AGP 的 Transform API 还是 Gradle 的 TransformAction ，开发者并不需要关心，能正确 transform 就行了。