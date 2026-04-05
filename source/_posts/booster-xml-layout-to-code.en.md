---
title: "Layout: XML vs Code"
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-07-13 20:00:00
lang: en
i18n_key: booster-xml-layout-to-code
---

Any developer who has built UIs knows that writing layouts in XML is dramatically more productive than hand-writing code. Before Anko (a Kotlin library) gained traction, XML was the go-to choice. Performance hiccups happened occasionally, but they were generally tolerable. Anko's rise, however, got us thinking: is there a way to enjoy the productivity of XML while getting Anko-level performance?

## XML vs Code

XML layouts are parsed at runtime. `XmlPullParser` reads binary XML files and reflectively constructs View nodes on the fly. A typical app's home screen consists of many XML layouts, resulting in repeated "load-parse" cycles. People say hand-written code performs better -- but how much better? Here is a comparison between Anko and XML:

| Device             | Specs                                                | Anko   | XML    | Diff |
|:------------------:|:----------------------------------------------------:|:------:|:------:|:----:|
| Alcatel One Touch  | Mediatek MT6572Dual-core 1.3GHz Cortex-A7512MB RAM   | 169 ms | 608ms  | 359% |
| Huawei Y300        | Qualcomm MSM 8225Dual-core 1.0GHz Cortex-A5512MB RAM | 593 ms | 3435ms | 578% |
| Huawei Y330        | Mediatek MT6572Dual-core 1.3GHz Cortex-A7512MB RAM   | 162 ms | 984ms  | 606% |
| Samsung Galaxy S2  | Exynos 4210Dual-core 1.2GHz Cortex-A91GB RAM         | 207 ms | 753ms  | 363% |

> Data source: https://android.jlelse.eu/400-faster-layouts-with-anko-da17f32c45dd

## Having It Both Ways

Since Booster is purpose-built for performance optimization, you can probably guess the solution: transpile XML into bytecode. You might ask: does transpiling to bytecode cause compatibility issues? That depends on the implementation. There are two approaches:

1. The hand-written code approach

  After parsing the XML, call the corresponding APIs based on the XML element attributes:

  ```java
  RelativeLayout root = new RelativeLayout(context);
  TextView txt = new TextView(context);
  txt.setText(...);
  txt.setTextColor(...);
  txt.setTextSize(...);
  root.addView(txt);
  ```

1. The runtime XML parsing approach

  After parsing the XML, construct an AttributeSet from the XML element attributes:

  ```java
  AttributeSet attr = new AttributeSet(...);
  RelativeLayout root = new RelativeLayout(context, attr);
  TextView txt = new TextView(context, attr);
  ```

Comparing the two approaches:

- Approach 1 requires adapting every *Layout*. For custom *Layouts* or *Views*, the generated code may not match the XML rendering.
- Approach 2 only needs to ensure the *AttributeSet* is correct to guarantee the resulting UI matches the XML rendering.

Therefore, Booster chose Approach 2. For details on the implementation and underlying principles, see this [sample project](https://github.com/johnsonlee/layoutlib).

## Layout Inflater

The Android SDK provides `LayoutInflater` to convert XML into Views. If you have read the AOSP source code, you may have noticed that `LayoutInflater` is a system service. Why make it a system service instead of a utility class? I believe the primary reason is performance.

"Wait -- system services involve IPC calls. How could that possibly be for performance?"

This goes back to XML parsing. XML layouts can reference three types of resources:

- System resources
- The current app's resources
- Other apps' resources

For system resources:

- If every *inflate* call had to load system resources from scratch, ANR would be inevitable.
- If a layout references resources from another *package*, the current app normally cannot access them.

For these reasons, a higher-level resource management mechanism is needed, making a system service entirely reasonable.

## Layout Library

To analyze how `LayoutInflater` constructs `Views`, we turned to *Android Studio's* visual layout designer, which is the origin of this [sample project](https://github.com/johnsonlee/layoutlib). It allows step-by-step debugging of the XML rendering process in the IDE.

*Layout Library* consists of two parts:

- *layoutlib-api*: The interface layer for *layoutlib*, shipped with Android Studio.
- *layoutlib*: The implementation layer for *layoutlib-api*, shipped with the Android SDK.

This design is primarily for backward compatibility.

Another highlight of *Layout Library* is its use of a [Robolectric Shadow](http://robolectric.org/)-like approach to replace APIs in the Android SDK. This way, APIs that originally called native code are implemented in pure Java within *Layout Library*:

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

Feel free to step through the [sample project](https://github.com/johnsonlee/layoutlib) in a debugger.

## Summary

Now that you understand how `LayoutInflater` and `Layout Library` work, you should have a clear picture of how Booster transpiles XML to bytecode. The process is:

1. Load system resources from the *platform* corresponding to the *compileSdk* in the Android SDK (used in step 2).
1. After the *mergeRes* task, load the app's resources.
1. Parse layout XMLs from the project and generate corresponding code based on the parsing results.
1. During *compilation*, include the generated code in the build.
1. During the *transform* pass, scan classes for the following method calls and replace them with calls to the code generated in step 3:

  - `LayoutInflater.inflate(...)`
  - `Activity.setContentView(int)`
  - `Dialog.setContentView(int)`
  - ......

To be continued...
