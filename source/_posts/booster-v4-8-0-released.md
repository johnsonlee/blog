---
title: Booster 4.8.0 版本发布
date: 2022-05-05 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v4.8.0，本次更新内容如下：

1. 修复 [#311](https://github.com/didi/booster/issues/311)
1. 新增 API [BaseVariant.mergeNativeLibsTaskProvider](https://github.com/didi/booster/blob/v4.8.0/booster-android-gradle-api/src/main/kotlin/com/didiglobal/booster/gradle/BaseVariant.kt#L69) by [punkisnotdead3](https://github.com/punkisnotdead3)
1. 新增 [booster-graph](https://github.com/didi/booster/blob/v4.8.0/booster-graph/) 模块用于构建和生成 `dot` 格式的图
1. 优化 [booster-task-check-snapshot](https://github.com/didi/booster/blob/v4.8.0/booster-task-check-snapshot), [booster-task-list-artifact](https://github.com/didi/booster/blob/v4.8.0/booster-task-list-artifact), [booster-task-list-permission](https://github.com/didi/booster/blob/v4.8.0/booster-task-list-permission), [booster-task-list-shared-library](https://github.com/didi/booster/blob/v4.8.0/booster-task-list-shared-library)
1. 调整 [booster-task-graph](https://github.com/didi/booster/blob/v4.8.0/booster-task-graph/) 生成的图的方向

> 参见：[Release Notes](https://github.com/didi/booster/blob/v4.8.0/RELEASE-NOTES.md#v480)
> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)
