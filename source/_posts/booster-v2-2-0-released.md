---
title: Booster 2.3.0 正式发布
date: 2020-07-20 00:00:00
categories: Booster
tags:
  - Booster
---

Booster 最近的两个版本主要是以修 bug 为主，所以，未发布正式的 *Release Note* ，本次发布的 `2.3.0` 版本可谓是一个重量级的版本，主要的更新内容如下：

1. 多线程优化

    在之前的版本中，线程优化可能会存在漏掉或者因为指令重排导致字节码注入失效的情况，为了彻底的解决这一问题，在 `2.3.0` 中采用了更可靠、更安全的实现方案，在稳定性方面的表现更加出色，并增加了对 `ForkJoinPool` 的支持

1. *Transform* 产出物校验

    在之前的版本中，如果 *Transformer* 本身有 bug 或者第三库的字节码有问题，会导致构建失败，而且，从堆栈信息根本无法定位具体是哪个 *JAR* 或者哪个 *class* ，因此，为了帮助开发者定位像 `SimException` 这样的构建异常，在 *2.3.0* 中，增加了 `booster.transform.verifiy` 开关（默认为 `false`），当出现 `SimException` 时，可以通过此开关来启用 *Transform* 校验功能

1. 修复了 `WebView` 预加载模块 API 兼容性问题
1. 优化 [booster-transform-shared-preferences](https://github.com/didi/booster/blob/master/booster-transform-shared-preferences) 模块的线程管理
1. 升级注入类库的 *sourceCompatibility* 和 *targetCompatibility* 至 *Java 1.8* ，包括：

    - [booster-android-instrument](https://github.com/didi/booster/blob/master/booster-android-instrument)
    - [booster-android-instrument-activity-thread](https://github.com/didi/booster/blob/master/booster-android-instrument-activity-thread)
    - [booster-android-instrument-finalizer-watchdog-daemon](https://github.com/didi/booster/blob/master/booster-android-instrument-finalizer-watchdog-daemon)
    - [booster-android-instrument-logcat](https://github.com/didi/booster/blob/master/booster-android-instrument-logcat)
    - [booster-android-instrument-media-player](https://github.com/didi/booster/blob/master/booster-android-instrument-media-player)
    - [booster-android-instrument-res-check](https://github.com/didi/booster/blob/master/booster-android-instrument-res-check)
    - [booster-android-instrument-shared-preferences](https://github.com/didi/booster/blob/master/booster-android-instrument-shared-preferences)
    - [booster-android-instrument-thread](https://github.com/didi/booster/blob/master/booster-android-instrument-thread)
    - [booster-android-instrument-toast](https://github.com/didi/booster/blob/master/booster-android-instrument-toast)
    - [booster-android-instrument-webview](https://github.com/didi/booster/blob/master/booster-android-instrument-webview)
