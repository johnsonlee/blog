---
title: Booster 4.0.0 alpha 版本发布
date: 2021-08-17 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 4.0.0 对 AGP 7.0 进行了适配，变更如下：

1. 废弃获取 AGP 内置 Task 的扩展属性，由新增的 *TaskProvider* 相关的 API 替代
1. 由于 Gradle Task API 的兼容性问题，Booster 不再支持 AGP 3.3 以下的版本
1. 资源去重和压缩相关的 Task 的缓存行为发生变化

> 最新的 Alpha 版本为 *4.0.0-alpha2*
