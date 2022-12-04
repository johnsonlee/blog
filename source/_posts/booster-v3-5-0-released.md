---
title: Booster 3.5.0 正式发布
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2021-08-17 23:00:00
---

Booster 又双叒叕发布了新的版本—— v3.5.0，本次更新内容如下：

1. 增加 *booster-transform-service-loader* 模块，支持 `ServiceLoader` 性能优化，使用方法：
    ```kotlin
    val services = ServiceLoader.load(Service::class.java).iterator() // iterator() 是必要的
    ```
1. 优化 *booster-transform-r-inline* 模块，支持 *constraintlayout v2.0*
