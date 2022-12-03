---
title: Booster 4.15.0 版本发布
date: 2022-12-02 23:00:00
categories: Booster
tags:
  - Booster
  - ReleaseNote
---

Booster 又双叒叕发布了新的版本—— v4.15.0，本次更新内容如下：

- 修复 [#387](https://github.com/didi/booster/issues/387) by [@HelloVass](https://github.com/HelloVass)
- 修复 [#381](https://github.com/didi/booster/issues/381)
- 升级 Kotlin API 版本至 *1.5.0*
- 兼容 AGP 7.3

## 升级注意事项

1. Kotlin 版本兼容性问题

    由于 Booster 的 Kotlin 版本已经升级到 1.5，如果使用 Booster 的工程 Kotlin 低于 1.5 的话，可能会存在 API 兼容性问题，建议升级 Kotlin 至 1.5.31

## FAQ

1. `NoSuchMethodError: 'void kotlin.jvm.internal.FunctionReferenceImpl.<init>(int, java.lang.Class, java.lang.String, java.lang.String, int)'`

    造成该问题的根本原因是由于 Kotlin 1.3 和 Kotlin 1.5 的编译器对于「方法引用」的处理方式不同导致，解决该问题的方法是加上编译选项 `-Xno-optimized-callable-references`，例如：

    ```gradle
    compileKotlin {
        kotlinOptions{
            jvmTarget = JavaVersion.VERSION_1_8
            apiVersion = "1.5"
            freeCompilerArgs = ["-Xno-optimized-callable-references"]
        }
    }
    ```

    或者：

    ```kotlin
    tasks.withType<KotlinCompile> {
        kotlinOptions {
            jvmTarget = "1.8"
            apiVersion = "1.5"
            freeCompilerArgs = listOf("-Xno-optimized-callable-references")
        }
    }
    ```

> 参见：[Release Notes](https://github.com/didi/booster/blob/master/RELEASE-NOTES.md#v4150)
> 参见：[API Rereference](https://reference.johnsonlee.io/booster)
> 参见：[深入理解 Booster](https://booster.johnsonlee.io)
