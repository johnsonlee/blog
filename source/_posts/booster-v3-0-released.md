---
title: Booster 3.0 正式发布，支持 AGP 4.1
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2020-11-09 00:08:00
---

在 *Booster* `3.0.0` 版本中，所有模块和特性已完全支持 *Android Gradle Plugin* `4.1.0`，本次更新内容如下：

1. 支持 *Gradle* `plugins` DSL

    ```gradle
    plugins {
        id 'com.didiglobal.booster' version '3.0.0'
    }
    ```

1. 重新设计 *Android Gradle Plugin* 的兼容性适配方案
1. 适配 *Android Gradle Plugin* `4.1.0`
1. 修复以往版本 *Android Gradle Plugin* 兼容性问题
1. 增加 *Android Gradle Plugin* 集成测试，保证 API 的兼容性和稳定性
