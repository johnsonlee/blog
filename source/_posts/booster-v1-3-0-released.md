---
title: Booster v1.3.0 发布
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2020-01-17 00:00:00
---

为了庆祝 Booster 荣获「滴滴 2019 年优秀开源项目」奖项，Booster 又双叒叕发布了新的版本—— v1.3.0，本次更新内容如下：

1. 新增 [booster-command](https://github.com/didi/booster/blob/master/booster-command) 模块，用于执行外部提供的预编译好的命令

  很多优秀的工具采用了 GPL 开源协议授权，不能直接内置到 booster 中，例如：`pngquant`、`7-zip` 等，为了解决这一问题，[booster-command](https://github.com/didi/booster/blob/master/booster-command) 提供了 [CommandProvider](https://github.com/didi/booster/blob/master/booster-command/src/main/kotlin/com/didiglobal/booster/command/CommandProvider.kt) SPI，参考例子：[PngquantProvider](https://github.com/johnsonlee/booster-pngquant-provider/blob/master/src/main/kotlin/io/johnsonlee/booster/command/pngquant/PngquantProvider.kt)，[CwebpProvider](https://github.com/didi/booster/blob/master/booster-task-compression-cwebp/src/main/kotlin/com/didiglobal/booster/task/compression/cwebp/CWebpProvider.kt)

1. 资源压缩优化

  - 保留 `res/raw/` 资源 *[@xwc520](https://github.com/xwc520)*
  - 支持 [booster-task-compression-cweb](https://github.com/didi/booster/blob/master/booster-task-compression-cwebp) 与 [booster-task-compression-pngquant](https://github.com/didi/booster/blob/master/booster-task-compression-pngquant) 同时使用，在 API Level 14 及以上，优先采用 *cwebp* 压缩， *cwebp* 未能压缩的（API Level 14~17 不支持带 alpha 的图片）将采用 *pngquant* 进行压缩

1. [VariantProcessor](https://github.com/didi/booster/blob/master/booster-task-spi/src/main/kotlin/com/didiglobal/booster/task/spi/VariantProcessor.kt) 支持通过 [@Priority](https://github.com/didi/booster/blob/master/booster-annotations/src/main/kotlin/com/didiglobal/booster/annotations/Priority.kt) 进行排序
1. *Transform* 性能优化

另外，与 [booster-task-compression-pngquant](https://github.com/didi/booster/blob/master/booster-task-compression-pngquant) 搭配使用的 [booster-pngquant-provider](https://github.com/johnsonlee/booster-pngquant-provider) 已发布 [v1.0.0](https://github.com/johnsonlee/booster-pngquant-provider/releases/tag/v1.0.0) 版本
