---
title: Booster 4.16.2 版本发布
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2023-05-28 00:00:00
---

Booster v4.16.2 与 v4.15.0 相比，主要的变更如下：

- 修复 [#406](https://github.com/didi/booster/issues/406) : 增量编译时对 Jar 处理的问题
- `cwebp` 支持 Apple M1 chipset
- 修复 `Project.getJarTaskProviders(BaseVariant?)` 访问 Android 工程无法找到 `android` 扩展的问题

  一般由于模块采用以下方式内嵌第三方  AAR 文件导致该模块没有 `android` 扩展：
  ```gradle
  configurations.maybeCreate("default")
  artifacts.add("default", file("xxx.aar"))
  ```
  > https://github.com/brim-borium/spotify_sdk/issues/99#issuecomment-878910598

- 修复 Android SDK 扩展包导致 `AndroidSdk.findPlatform()` 异常
- 新增扩展 API `BaseVariant.localAndroidResources` 获取特定变体的本地 Android 资源列表

> 参见：[Release Notes](https://github.com/didi/booster/blob/master/RELEASE-NOTES.md#v4162)
> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)
