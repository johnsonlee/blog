---
title: Booster 4.12.0 版本发布
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2022-07-09 12:00:00
---

Booster 又双叒叕发布了新的版本—— v4.12.0，本次更新内容如下：

- 优化 CHA 支持 ClassSet 缓存，降低多工程大规模静态分析的内存占用
- 支持 [Gradle configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
- 将 `VariantProcessor` 的初始化提前到 `afterEvaluation` 之前以便于支持在 booster 插件中创建 Gradle extension

> 参见：[Release Notes](https://github.com/didi/booster/blob/master/RELEASE-NOTES.md#v4120)
> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)
