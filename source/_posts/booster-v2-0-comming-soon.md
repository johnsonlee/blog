---
title: 即将推出 Booster 2.0
date: 2020-06-07 00:00:00
categories: Booster
tags:
  - Booster
---

前不久 *Android* 官方终于正式发布了 *Android Gradle Plugin* `v4.0`，在体验了一把 *Android Studio 4.0* 的构建速度之快后，*Booster* 团队决定加速 *Android Gradle Plugin* 版本适配工作，一方面，为了解决现有的特性在 *Android Gradle Plugin* `v4.0` 上的问题，另一方面，推出自 *Android Gradle Plugin* `v3.0` 以来全版本适配方案，以解决开发者对 *Android Gradle Plugin* 的适配问题。

从 *Andriod Gradle Plugin* `v3.6` 开始发生了很大的变化，例如：

1. 构建中间产物及相关的 API 的变更

    调用 *Android Gradle Plugin* 内部 API 的地方将会受到影响

1. *App* 工程 `R` 的生成

    所有 `R` 相关的类被整体打成 *JAR* 包

1. 资源的合并

    *App* 工程的资源合并后的中间产物只有 *App* 工程本身的资源，不再包含 *Library* 的资源，这会影响到图片资源的压缩和去冗余

1. *AAPT2* 依赖的 *Protobuf* 版本升级

    高版本 *Protobuf* 生成的 *Java* 代码与现有的 *Java* 代码不兼容

1. 增加了 `buildFeature` 对构建进行更细粒度的控制
1. 在没有 `minSdkVersion` 限制的情况下支持 *Java 8 API* ，如：*Stream API* 等

变化太多，就不一一列举，总结下来，*Android Gradle Plugin* `v4.0` 影响到的模块如下：

1. [booster-aapt2](https://github.com/didi/booster/tree/master/booster-aapt2)
1. [booster-task-compression-cwebp](https://github.com/didi/booster/tree/master/booster-task-compression-cwebp)
1. [booster-task-compression-pngquant](https://github.com/didi/booster/tree/master/booster-task-compression-pngquant)
1. [booster-transform-r-inline](https://github.com/didi/booster/tree/master/booster-transform-r-inline)

目前已经完成了 [booster-aapt2](https://github.com/didi/booster/tree/master/booster-aapt2) & [booster-transform-r-inline](https://github.com/didi/booster/tree/master/booster-transform-r-inline) 的适配工作，感兴趣的同学可以参考：[v2.x](https://github.com/didi/booster/tree/v2.x) 分支最新的代码。
