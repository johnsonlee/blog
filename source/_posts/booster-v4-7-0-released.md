---
title: Booster 4.7.0 版本发布
date: 2022-04-26 23:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v4.7.0，本次更新内容如下：

1. Fix issue [#304](https://github.com/didi/booster/issues/304): `ScheduledThreadPoolExecutor` transform bug by [@lpw14](https://github.com/lpw14) in https://github.com/didi/booster/pull/305
1. Fix improper task dependencies of compression tool installation, such as `installPngquant` and `installCwebp`
1. Add [booster-task-graph](https://github.com/didi/booster/blob/master/booster-task-graph/) for task graph visualization
1. Add `DotGraph.visualize(...)` for graph visualization

> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)

