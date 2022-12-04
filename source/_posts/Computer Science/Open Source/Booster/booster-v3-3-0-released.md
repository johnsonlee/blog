---
title: Booster 3.3.0 正式发布
date: 2021-05-10 20:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v3.3.0，本次更新内容如下：

1. Fix `constraintlayout` 导致的 *R* 内联的问题 [#187](https://github.com/didi/booster/issues/187) [#226](https://github.com/didi/booster/issues/226)
1. `TransformContext` 接口新增属性 `val dependencies: Collection<String>`，用于在 *transform* 阶段获取工程的依赖树，依赖列表格式如下：
  - activity-1.0.0.aar (androidx.activity:activity:1.0.0)
  - annotation-1.1.0.jar (androidx.annotation:annotation:1.1.0)
  - appcompat-resources-1.2.0.aar (androidx.appcompat:appcompat-resources:1.2.0)
  - annotations-13.0.jar (org.jetbrains:annotations:13.0)
  - ...
