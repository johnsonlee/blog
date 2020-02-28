---
title: 布局：XML vs 代码
date: 2019-07-13 20:00:00
categories: Booster
tags:
  - booster
  - android
  - performance
  - optimization
  - gradle
  - layout
  - anko
---

做过开发的同学都深有体会，用 XML 来撸 UI 的效率简直是吊打手写代码，在 Anko (Kotlin 库) 还没有流行之前，大家对 XML 还是亲睐有加，虽然性能上偶尔会有卡顿，但是总体来说，还是勉强能接受，但是 Anko 的流行，也让我们开始思考，有没有办法既能享受 XML 撸 UI 的快感，又能享受像 Anko 一样的性能呢？

## XML vs 代码

XML 布局是在运行时解析的，由 `XmlPullParser` 一边解析二进制的 XML 文件一边反射构造 View 节点，像 APP 首页一般都是由很多 XML 组成，这样会导致多次「加载-解析」。都说手写代码性能更好，到底有多好呢？以下是  Anko 与 XML 的性能对比数据：

| 机型              | 规格                                                 | Anko   | XML    | 差异 |
|:-----------------:|:----------------------------------------------------:|:------:|:------:|:----:|
| 阿尔卡特One Touch | Mediatek MT6572Dual-core 1.3GHz Cortex-A7512MB RAM   | 169 ms | 608ms  | 359% |
| 华为 Y300         | Qualcomm MSM 8225Dual-core 1.0GHz Cortex-A5512MB RAM | 593 ms | 3435ms | 578% |
| 华为 Y330         | Mediatek MT6572Dual-core 1.3GHz Cortex-A7512MB RAM   | 162 ms | 984ms  | 606% |
| 三星 Galaxy S2    | Exynos 4210Dual-core 1.2GHz Cortex-A91GB RAM         | 207 ms | 753ms  | 363% |

> 以上数据来源：https://android.jlelse.eu/400-faster-layouts-with-anko-da17f32c45dd

## 鱼和熊掌兼得

既然 Booster 是做专门用来做性能优化的，看到这里，大家可能想到了解决方案——将 XML 转译成字节码。没错，就是这样，大家可能会问：转译成字节码会有兼容性问题么？——这得看实现方式。目前来看，有以下两种实现：

1. 手写代码的思路

  在解析 XML 后，根据 XML 元素的属性去调用对应的 API：

  ```java
  RelativeLayout root = new RelativeLayout(context);
  TextView txt = new TextView(context);
  txt.setText(...);
  txt.setTextColor(...);
  txt.setTextSize(...);
  root.addView(txt);
  ```

1. 运行时解析 XML 的思路

  在解析 XML 后，根据 XML 元素的属性去构造 AttributeSet

  ```java
  AttributeSet attr = new AttributeSet(...);
  RelativeLayout root = new RelativeLayout(context, attr);
  TextView txt = new TextView(context, attr);
  ```

从以上两种方案，我们可以发现：

- 方案 1 需要适配所有的 *Layout* ，对于自定义的 *Layout* 或者 *View* ，生成的代码可能与 XML 的呈现不一致
- 方案 2 只要保证 *AttributeSet* 正确性，就能保证最终呈现的 UI 跟 XML 渲染出来的是一致的

因此，Booster 选择了第 2 种方案，至于其中的细节和原理，请参考此[示例工程](https://github.com/johnsonlee/layoutlib)。

## Layout Inflator

Android SDK 提供了 `LayoutInflator` 用于将 XML 转换成 View，读过 AOSP 源码的同学可能会发现 `LayoutInflator` 是一个系统服务，为什么要将 `LayoutInflator` 作为一个系统服务而不是一个工具类呢？我认为，最主要的原因在于提升性能。

「What?! 调用系统服务会涉及到跨进程调用，怎么可能会是为了提升性能呢？」

这得从 XML 解析说起，因为 XML 布局中会引用三类资源：

- 系统资源
- 本 APP 的资源
- 其它 APP 的资源

所以，对于系统资源来说

- 如果每次 *inflate* 时都要去加载一次系统资源，不 ANR 才怪
- 如果引用了其它 *package* 的资源，对于当前 APP 来说，正常情况是无法访问的

因此，基于以上原因，需要有一个更高层次的资源管理，因此作为一个系统服务合情合理。

## Layout Library

为了分析 `LayoutInflator` 构造 `View` 的过程，我们想到了 *Android Studio* 的布局可视化设计器，就是这个[示例工程](https://github.com/johnsonlee/layoutlib)的由来，这样就可以在 IDE 中去单步调试 XML 的渲染过程。

*Layout Library* 由两部分组成：

- *layoutlib-api* ： *layoutlib* 的接口层，随着 Android Studio 一起发布
- *layoutlib* ： *layoutlib-api* 的实现层，随着 Android SDK 一起发布

之所以这么设计，主要还是为了考虑向后兼容。

*Layout Library* 的另一大亮点在于它参用了类似 [Robolectric Shadow](http://robolectric.org/) 的方式，对 Android SDK 中的 API 进行了替换，这样，原本调用 native 的 API 都在 *Layout Library* 中用 Java 实现了：

```java
@LayoutlibDelegate
static void native_drawBitmap(
        Canvas thisCanvas,
        long nativeCanvas,
        Bitmap bitmap,
        float left,
        float top,
        long nativePaintOrZero,
        int canvasDensity,
        int screenDensity,
        int bitmapDensity) {
    Bitmap_Delegate bitmapDelegate = Bitmap_Delegate.getDelegate(bitmap);
    if (bitmapDelegate != null) {
        BufferedImage image = bitmapDelegate.getImage();
        float right = left + (float)image.getWidth();
        float bottom = top + (float)image.getHeight();
        drawBitmap(nativeCanvas, bitmapDelegate, nativePaintOrZero, 0, 0,
                image.getWidth(), image.getHeight(),
                (int)left, (int)top, (int)right, (int)bottom);
    }
}
```

有兴趣的同学可以用单步调式[示例工程](https://github.com/johnsonlee/layoutlib)。

## 总结

了解了 `LayoutInflator` 和 `Layout Library` 的实现原理后，对于 Booster 如何去转换 XML 成为字节码，相信大家已经有了思路了，实现原理如下：

1. 根据 *compileSdk* 加载 Android SDK 中对应 *platform* 中的系统资源（第2步会用到）
1. 在 *mergeRes* 任务之后，加载 APP 资源
1. 解析项目中的布局 xml，并根据解析结果生成对应的代码
1. 在 *compile* 的过程中，将生成的代码一起参与编译
1. 在 *transform* 的过程中，扫描 class 中的以下方法调用替换成调用第3步生成的代码

  - `LayoutInflater.inflate(...)`
  - `Activity.setContentView(int)`
  - `Dialog.setContentView(int)`
  - ......

未完待续......
