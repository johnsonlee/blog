---
title: Booster v1.6.0 发布
date: 2020-04-18 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v1.6.0，本次更新内容如下：

1. 修复 *ScheduledThreadPoolExecutor* 的优化问题 [#154](https://github.com/didi/booster/issues/154)
1. 修复在 *buildSrc* 中的 *build.gradle* 引用 *booster-transform-asm* 会导致 *classpath* 中引用的其它 *transformer* 失效的问题 [#157](https://github.com/didi/booster/issues/157)
1. 修复因 *ASM* 无法解析 *class* 导致构建失败的问题
1. 将 *CHA* 从 [booster-task-analyser](https://github.com/didi/booster/tree/master/booster-task-analyser) 模块中抽离出来，作为单独的 [booster-cha](https://github.com/didi/booster/tree/master/booster-cha) 模块