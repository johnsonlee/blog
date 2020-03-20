---
title: Booster v1.5.0 发布
date: 2020-03-20 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

经过不懈的努力，Booster 又双叒叕发布了新的版本—— v1.5.0，本次更新内容如下：

1. 修复 *AGP 3.6.0* 兼容性问题 [#145](https://github.com/didi/booster/issues/145)
1. 修复 *Transform* 增量编译的问题
1. 优化 [booster-transform-activity-thread](https://github.com/didi/booster/blob/master/booster-transform-activity-thread)，支持自定义堆栈包名白名单过滤
1. 增加 [booster-task-analyser](https://github.com/didi/booster/blob/master/booster-task-analyser) 用于替代原来的 *booster-transform-lint* ，不仅在特性上更加丰富，性能表现也是更胜一筹：

    - 全新的类继承分析 *CHA (Class Hierarchy Analysis)* ，分析结果更精准
    - 新增 *AnalyserTask* ，移除 *LintTransformer* ，通过运行单独的 *Task* 进行静态分析，详见：[README.md](https://github.com/didi/booster/blob/master/booster-task-analyser/README.md) 
    - 支持 XML layout 分析，检测 layout 中不存在的 class，避免线上崩溃
    - 支持 `@UiThread` 和 `@MainThread`
    - 支持 *EventBus* `@Subscribe`
    - 支持自定义黑名单和白名单

1. 新增 [booster-api](https://github.com/didi/booster/blob/master/booster-api) 模块，便于 feature 开发和单元测试
