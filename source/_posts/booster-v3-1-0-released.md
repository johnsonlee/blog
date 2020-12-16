---
title: Booster 3.1.0 正式发布
date: 2020-12-16 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

*Booster* `3.1.0` 版本更新内容如下：

1. [booster-task-compression-cwebp](https://github.com/didi/booster/tree/master/booster-task-compression-cwebp) 支持通过 `booster.task.compression.cwebp.ignores` 属性排除不需要压缩的资源
1. [booster-task-compression-pngquant](https://github.com/didi/booster/tree/master/booster-task-compression-pngquant) 支持通过 `booster.task.compression.pngquant.ignores` 属性排除不需要压缩的资源
1. 优化 [booster-transform-activity-thread](https://github.com/didi/booster/tree/master/booster-transform-activity-thread)，将 `ActivityThreadCallback` 从重新抛出的异常的堆栈中剔除，从而消除因 *Booster* 的类名对 *Crash* 堆栈聚合算法产生的影响
