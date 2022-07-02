---
title: Booster 4.10.0 版本发布
date: 2022-06-13 09:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v4.10.0，本次更新内容如下：

- 完善 [booster-cha](https://github.com/didi/booster/blob/v4.10.0/booster-cha)，防止内存泄漏，支持从 AAR 加载 class
- 修复 composite build 下 transform 输出冲突的问题
- 完善 [booster-command](https://github.com/didi/booster/blob/v4.10.0/booster-command) 新增 `Command.execute(String[])` API
- [booster-task-analyser](https://github.com/didi/booster/blob/v4.10.0/booster-task-analyser) 新增类引用分析功能
- [booster-graph](https://github.com/didi/booster/blob/v4.10.0/booster-graph) 拆分为 [booster-graph](https://github.com/didi/booster/blob/v4.10.0/booster-graph), [booster-graph-dot](https://github.com/didi/booster/blob/v4.10.0/booster-graph-dot) 和 [booster-graph-json](https://github.com/didi/booster/blob/v4.10.0/booster-graph-json)
- 适配 AGP 7.1 和 7.2

> 参见：[Release Notes](https://github.com/didi/booster/blob/master/RELEASE-NOTES.md#v4100)
> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)
