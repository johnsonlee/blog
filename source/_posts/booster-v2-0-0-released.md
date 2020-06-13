---
title: Booster 2.0 正式发布，支持 AGP 4.0
date: 2020-06-13 00:09:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

*Andriod Gradle Plugin* 从 `3.5` 开始进行了一系列的重构，一些原来在 `3.5` 中的实验方案，在 `3.6` 版本中开始默认启用，所以，`3.6` 对于大多数 *Gradle* 插件来说，简直就是噩梦一样的存在，*Booster* 的一些模块和特性也受到了影响，如：

1. [booster-aapt2](https://github.com/didi/booster/tree/master/booster-aapt2)
1. [booster-task-compression-cwebp](https://github.com/didi/booster/tree/master/booster-task-compression-cwebp)
1. [booster-task-compression-pngquant](https://github.com/didi/booster/tree/master/booster-task-compression-pngquant)
1. [booster-transform-r-inline](https://github.com/didi/booster/tree/master/booster-transform-r-inline)

在 *Booster* `2.0.0` 版本中，所有模块和特性已完全支持 *Android Gradle Plugin* `4.0`，本次更新内容如下：

1. 修复 *Booster* 在 *Android Gradle Plugin* `3.5` 版本的 bug
1. 适配 *Android Gradle Plugin* `3.6` & `4.0`
1. 重构 `Transformer` 和 `VariantProcessor` 的加载

    - `Transformer` 支持构造方法传递 `ClassLoader`，该特性主要用于支持除 *ASM* 和 *Javassist* 以外的其它字节码框架的集成，如 *Apache BCEL* ：

        ```kotlin
        @AutoService(Transformer::class)
        class BcelTransformer(val classLoader: ClassLoader) : Transformer {

            // 加载自定义 ClassTransformer
            private val transformers = ServiceLoader.load(ClassTransformer::class.java, classLoader).sortedBy {
                it.javaClass.getAnnotation(Priority::class.java)?.value ?: 0
            }

            override fun onPreTransform(context: TransformContext) {
                this.transformers.forEach { transformer ->
                    transformer.onPreTransform(context)
                }
            }

            override fun transform(context: TransformContext, bytecode: ByteArray): ByteArray {
                TODO()
            }

            override fun onPostTransform(context: TransformContext) {
                this.transformers.forEach { transformer ->
                    transformer.onPostTransform(context)
                }
            }
        }
        ```

    - `VariantProcess` 支持构造方法传递 `Project`，例如：

        ```kotlin
        @AutoService(VariantProcessor::class)
        class MyVariantProcessor(val project : Project) : VariantProcessor {

            init {
                // TODO 访问 project 实例
            }

            override fun process(variant: BaseVariant) {
                // TODO
            }

        }
        ```
