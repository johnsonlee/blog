---
title: Booster v1.2.0 发布
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2020-01-12 00:00:00
---

Booster 又双叒叕发布了新的版本—— v1.2.0，本次更新内容如下：

1. 弃用 `booster-task-all` 和 `booster-transform-all`
1. 修复 [booster-transform-r-inline](https://github.com/didi/booster/blob/master/booster-transform-r-inline) 的 bug [#124](https://github.com/didi/booster/issues/124)
1. 新增 [booster-transform-br-inline](https://github.com/didi/booster/blob/master/booster-transform-br-inline) 支持 data binding 自动生成的 BR 类的字段内联 [@linjiang](https://github.com/whataa)
1. 新增 [booster-transform-verifier](https://github.com/didi/booster/blob/master/booster-transform-verifier) 支持字节码校验
1. 新增 `@Priority` 为 `Transformer` 指定优先级
1. 新增针对 `Transformer` 的 CPU 耗时统计
1. 构建性能优化

  - 多个 *variant transform* 任务共享同一个 *Android Class Loader*，避免多余的性能开销，详见：[BoosterTransform.kt#L36](https://github.com/didi/booster/blob/master/booster-gradle-plugin/src/main/kotlin/com/didiglobal/booster/gradle/BoosterTransform.kt#L36)
  - [ClassLoader#loadClass(String)](https://docs.oracle.com/javase/8/docs/api/java/lang/ClassLoader.html#loadClass-java.lang.String-) 替代 [Class#forName(String,boolean,ClassLoader)](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html#forName-java.lang.String-boolean-java.lang.ClassLoader-)，详见：[AbstractKlassPool.kt#L31](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/AbstractKlassPool.kt#L31)，关于两种不同的类加载方式的性能测试，详见：[ClassLoadBenchmark.kt](https://github.com/johnsonlee/booster-benchmark/blob/master/class-load/src/jmh/kotlin/io/johnsonlee/booster/benchmark/ClassLoadBenchmark.kt)
