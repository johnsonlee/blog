---
title: Booster v1.0.0 发布
date: 2020-01-01 00:14:06
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v1.0.0（一改原来 0.x.x 的版本命名，以表示对新年的庆祝），此次更新的内容也是相当的给力：

1. 优化 *transform* 处理过程，性能提升 50%

  在之前的版本中，针对 *JAR* 文件中的 *class* 的 *transform* 一直是串行执行的，*JAR* 读/写操作属于 I/O 密集型任务，*transformClassesWithBoosterForXxx* 任务的耗时往往占了构建时间的很大一部分，为了提升构建效率，此版本采用了并行读/写 *JAR* 的方式，性能提升了 50%+，以下是 *Benchmark* 结果：

  | Benchmark                                              | Mode | Cnt |  Score |  Error | Units |
  |--------------------------------------------------------|------|-----|--------|--------|-------|
  | JarFileTransformBenchmark.transformJarFileParallelly   | avgt |  10 | 31.310 | ±8.916 | ms/op |
  | JarFileTransformBenchmark.transformJarFileSequentially | avgt |  10 | 66.343 | ±2.902 | ms/op |

  *Benchmark* 源码：[JarFileTransformBenchmark.java](https://github.com/johnsonlee/booster-benchmark/blob/master/jar-file-transform/src/jmh/kotlin/io/johnsonlee/booster/benchmark/JarFileTransformBenchmark.kt)

1. 优化 [booster-task-compression](https://github.com/didi/booster/tree/master/booster-task-compression)

  在压缩 *resources-xxx.ap_* 文件时，也涉及 *ZIP* 文件的读/写操作，同样采用了并行读/写 *ZIP* 的方式

1. [booster-transform-thread](https://github.com/didi/booster/tree/master/booster-transform-thread) 支持禁用线程池优化

  由于该模块包含「线程重命名」和「线程池优化」两个功能，为了避免线程池优化带来的副作用，于是增加了 *booster.transform.thread.optimization.enabled* 属性，用于禁用线程池优化，仅启用「线程重命名」功能。详细用法请参考：[README.md](https://github.com/didi/booster/blob/master/booster-transform-thread/README.md)

1. 修复 [booster-transform-shared-preferences](https://github.com/didi/booster/blob/master/booster-transform-shared-preferences) 相关的 bug

