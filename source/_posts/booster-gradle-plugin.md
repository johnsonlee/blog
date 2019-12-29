---
title: Booster 质量优化框架
date: 2019-06-04 20:00:00
categories:
  - 性能优化
tags:
  - booster
  - android
  - performance
  - optimization
  - gradle
  - transform
  - asm
---

Booster 是一款专门为移动应用设计的易用、轻量级且可扩展的质量优化框架，其目标主要是为了解决 APP 复杂度的提升而带来的性能、稳定性、包体积等问题。

## 为什么是 Booster?

质量优化是所有应用开发者都要面临的问题，对于 DAU 千万级的 APP 来说，万分之一的崩溃率就意味着上千的用户受到影响，对于长时间在线的司机来说，司机端 APP 的稳定性关乎着司机的安全和收入，所以更是不容小觑。

随着业务的快速发展，业务复杂度不断提升，我们开始思考：

1. 如何持续保证 APP 的质量？
1. 当 APP 崩溃后，如何快速定位问题所属的业务线？
1. 能不能在上线之前提前发现潜在的质量问题？
1. 能不能对 APP 进行无侵入的全局质量优化而不需要推动各个业务线？

基于这些考虑，Booster 应运而生，经过一年多的时间不断打磨，Booster 成绩斐然。由于目前在质量优化方面基于静态分析的开源项目屈指可数，加上质量优化对于 APP 开发者而言门槛偏高，因此，我们选择了将 Booster 开源，希望更多的开发者和用户能从中受益。

## 功能与特性

### 动态加载模块

为了支持差异化的优化需求，Booster 实现了模块的动态加载，以便于开发者能在不使用配置的情况下选择使用指定的模块，详见：booster-task-all、booster-transform-all。

### 第三方类库注入

Booster 在进行优化的过程中，可能需要注入一些特定的类或者类库，为了解决注入类的依赖管理问题，Booster 提供了VariantProcessor SPI 让开发者可以轻松的扩展。

### 性能检测

APP 的卡顿率是衡量应用运行时性能的一个重要指标，为了能提前发现潜在的卡顿问题，Booster 通过静态分析实现了性能检测，并生成可视化的报告帮助开发者定位问题所在，如下图所示：

![](https://github.com/didi/booster/blob/master/assets/com.didiglobal.booster.demo.MainActivity.dot.png?raw=true)

其实现原理是通过分析所有的 class 文件，构建一个全局的 Call Graph, 然后从 Call Graph 中找出在主线程中调用的链路（Application、四大组件、View、Widget等相关的方法），然后再将这些链路以类为单位分别输出报告。

### 多线程优化

业务线众多的 APP 普遍存在线程过载的问题，而线程管理一直是开发者最头疼的问题之一，虽然可以通过制定严格的代码规范来归避此类问题发生，但是对于组织结构复杂的大厂来说，实施起来成本巨大，而对于第三方 SDK 来说，代码规范则有些力不从心。为了彻底的解决这一问题，Booster 通过在编译期间修改字节码实现了全局线程池优化，并对线程进行重命名。

以下是示例代码：

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        getSharedPreferences("demo", MODE_PRIVATE).edit().commit()
    }

    override fun onStart() {
        super.onStart()
        Thread({
            while (true) {
                Thread.sleep(5)
            }
        }, "#Booster").start()
    }

    override fun onResume() {
        super.onResume()
        HandlerThread("Booster").start()
    }
}
```

线程重命名效果如下图所示：

![](https://github.com/didi/booster/blob/master/assets/screenshot-booster-transform-thread.png?raw=true)

### 资源索引内联

资源索引字段在编译完成后，就没有存在的价值了（反射除外），因此，Booster 将对资源索引字段访问的指令替换为常量指令，一方面可以提升运行时性能，另一方面，还能减小包体积，资源索引（R）表面上看起来微不足道，实际上占用不少空间，以滴滴车主为例，资源索引相关的类就有上千个，进行常量字段删除后，减小了 1MB 左右。

### SharedPreferences 优化

对于 Android 开发者来说，SharedPreferences 几乎无处不在，而在主线程中修改 SharedPreferences 会导致卡顿甚至 ANR，为了彻底的解决这一问题，Booster 对 APP 中的指令进行了全局的替换。

### Toast Bug 修复

为了彻底解决在 Android 7.1 中存在的bug: 30150688，Booster 对 APP 中的 `Toast.show()` 方法调用指令进行全局替换。

### 资源压缩

APP 的包体积也是一个非常重要的指标，在 APP 安装中，图片资源占了相当大的比例，通常情况下，图片质量降低 10%-20% 并不会影响视觉效果，因此，Booster 采用有损压缩来降低图片的大小，而且，图像尺寸越小，加载速度越快，占用内存越少。

Booster 提供了两种压缩方案：

1. pngquant 有损压缩（需要自行安装 pngquant 命令行工具）
1. cwebp 有损压缩（已内置）

两种方案各有优缺点，pngquant 的方案不存在兼容性问题，但是压缩率略逊于 WebP，而 WebP 存在系统版本兼容性问题，总的来看，有损压缩的效果非常显著，以滴滴车主为例，APP 包体积减小了 10 MB 左右。

另外，像 Android Support Library 中包含有大量的图片资源，而且支持多种屏幕尺寸，对于 APP 而言，相同的图片资源，保留最大尺寸的即可。以 Android Support Library 为例，去冗余后，APP 包体积减小了 1MB 左右。

### WebView 预加载

为了解决 WebView  初始化导致的卡顿问题，Booster 通过注入指令的方式，在主线程空闲时提前加载 WebView。

除上以上特性外，Booster 还提供了一些辅助开发的功能，如：检查依赖项中是否包含 SNAPSHOT 版本等等。

## 快速上手

在 `buildscript` 的 `classpath` 中引入 Booster 插件，然后启用该插件：

```gradle
buildscript {
    ext.booster_version = '0.27.0'
    repositories {
        google()
        mavenCentral()
        jcenter()
        maven { url 'https://oss.sonatype.org/content/repositories/public' }
    }
    dependencies {
        classpath "com.didiglobal.booster:booster-gradle-plugin:$booster_version"
        classpath "com.didiglobal.booster:booster-task-all:$booster_version"
        classpath "com.didiglobal.booster:booster-transform-all:$booster_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        jcenter()
        maven { url 'https://oss.sonatype.org/content/repositories/public' }
    }
}

apply plugin: 'com.android.application'
apply plugin: 'com.didiglobal.booster'
```

然后通过执行 assemble task 来构建一个优化过的应用包，构建完成后，在 *build/reports/* 目录下会生成相应的报告。

```shell
$ ./gradlew assembleRelease
```

