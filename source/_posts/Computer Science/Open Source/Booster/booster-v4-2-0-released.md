---
title: Booster 4.2.0 版本发布
date: 2021-12-14 01:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v4.2.0，本次更新内容如下：

1. 增加对运行时字节码注入的支持，开发者可以使用 __Booster__ 提供的 `TransformerClassLoader` 实用类在运行时自动发现 `Transformer` 并进行字节码注入，使 `Transformer` 能够完全复用
2. 修复 `JavassistTransformer` 的 `classpath` 相关的 bug
3. 新增 Android stub APIs

> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
