---
title: Booster 3.2.0-alpha2 发布
date: 2020-12-29 21:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

*Booster* `3.2.0-alpha2` 版本更新内容如下：

1. 适配 *AGP* `4.2.0-beta02`
1. 修复 *AGP* 版本号比较的 bug
1. 支持 *AGP* `3.4.2` 以上的版本通过属性 `booster.transform.${variant}.enabled` 来禁用 *BoosterTransform* ，默认 `true`
  - 禁用特定的 *Build Type*
    ```properties
    booster.transform.debug.enabled=false
    ```
  - 禁用特定的 *Variant*
    ```properties
    booster.transform.demoDebug.enabled=false
    ```
1. 支持通过属性 `booster.transform.diff` 生成字节码的差异，默认 `false`
1. 更新了 `ClassTransformer` 接口
  - 增加属性 `val name: String`
  - 增加方法 `fun getReport(TransformContext, String): File`
  - 增加方法 `fun getReportDir(TransformContext): File`

## 正式版本发布计划

由于目前 *AGP* `4.2.0` 还处于 *beta* 阶段，等 *AGP* `4.2.0` 正式发布后将在第一时间发布 *Booster* `3.2.0` 正式版本。