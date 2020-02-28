---
title: Booster v1.1.0 发布
date: 2020-01-08 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v1.1.0，本次更新内容如下：

1. 将 *booster-task-compression* 拆分成为 4 个子模块，并对原有功能进行优化

  - [booster-task-compression-cwebp](https://github.com/didi/booster/blob/master/booster-task-compression-cwebp)
  - [booster-task-compression-pngquant](https://github.com/didi/booster/blob/master/booster-task-compression-pngquant)
  - [booster-task-compression-processed-res](https://github.com/didi/booster/blob/master/booster-task-compression-processed-res)
  - [booster-task-resource-deredundancy](https://github.com/didi/booster/blob/master/booster-task-resource-deredundancy)

1. 重构 [booster-transform-spi](https://github.com/didi/booster/blob/master/booster-transform-spi)

  便于对 [Transformer]() 进行单元测试，新增了 [AbstractTransformContext](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/AbstractTransformContext.kt) 和 [AbstractKlassPool](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/AbstractKlassPool.kt)
  
另外，新 feature 的开发将在 [johnsonlee/booster](https://github.com/johnsonlee/booster) 中进行，想尝鲜的朋友可以从 [develop](https://github.com/johnsonlee/booster/tree/develop/) 分支下载最新代码
