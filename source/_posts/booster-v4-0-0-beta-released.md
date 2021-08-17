---
title: Booster 4.0.0 beta 版本发布
date: 2021-08-18 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

*Booster 4.0.0* 对 *AGP 7.0* 进行了适配，变更如下：

1. 开放 [AGPInterface](https://reference.johnsonlee.io/booster/com.didiglobal.booster.gradle/-a-g-p-interface/index.html)
1. 优化 *AGP* 版本适配，避免加载不兼容的 [AGPInterface](https://reference.johnsonlee.io/booster/com.didiglobal.booster.gradle/-a-g-p-interface/index.html) 实现
1. 废弃获取 *AGP* 内置 *Task* 的扩展属性，由新增的 *TaskProvider* 相关的 *API* 替代
1. 由于 *Gradle Task API* 的兼容性问题，*Booster* 不再支持 *AGP 3.3* 以下的版本
1. 资源去重和压缩相关的 *Task* 的缓存行为发生变化

> 最新的版本为 *4.0.0-beta1*, 参见：[API Rereference](https://reference.johnsonlee.io/booster)
