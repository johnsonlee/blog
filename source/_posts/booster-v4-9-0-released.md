---
title: Booster 4.9.0 版本发布
date: 2022-05-21 00:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v4.9.0，本次更新内容如下：

- 修复漏洞 [CVE-2020-15250](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-15250) In JUnit4 from version 4.7 and before 4.13.1, the test rule `TemporaryFolder` contains a local information disclosure vulnerability
- 修复获取 variant artifacts 时 task 未执行导致任务执行失败的问题
- 修复集成测试用例
- 完善 `booster-graph` 模块，新增 `GroupedNode`, `GraphRenderer.Options` 以及 `JsonGraphRenderer`

> 参见：[Release Notes](https://github.com/didi/booster/blob/v4.9.0/RELEASE-NOTES.md#v490)
> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)
