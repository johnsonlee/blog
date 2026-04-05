---
title: "Booster: SharedPreferences Optimization"
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-11-12 21:00:00
lang: en
i18n_key: booster-transform-shared-preferences
---

## Background

[Booster v0.1.5](https://github.com/didi/booster/releases/tag/v0.1.5) actually already included an optimization for [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences), though the scope was modest. Since [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) is so pervasive in Android, we were extremely cautious with it -- it took several production releases to validate before we rolled out the latest optimization.

As for why [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) needs optimization at all, anyone who has done Android development knows its design has long been criticized. In truth, [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) was never designed by Google's engineers to be used the way it is today. It simply got pushed far beyond its intended use case, leading to all sorts of jank and ANR issues.

## The v0.1.5 Optimization

The [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) optimization in [booster v0.1.5](https://github.com/didi/booster/releases/tag/v0.1.5) replaced [Editor.apply()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#apply()) with [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) executed on a background thread:

```java
public class ShadowEditor {

    public static void apply(final SharedPreferences.Editor editor) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            AsyncTask.SERIAL_EXECUTOR.execute(new Runnable() {
                @Override
                public void run() {
                    editor.commit();
                }
            });
        } else {
            editor.commit();
        }
    }

}
```

> For why we replace [Editor.apply()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#apply()) with asynchronous [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()), see this article: http://www.cloudchou.com/android/post-988.html

## The v0.2.0 Optimization

[Booster v0.2.0](https://github.com/didi/booster/releases/tag/v0.2.0) took the [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) optimization further. When [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) is called but its return value is unused, the commit is moved to a background thread:

```kotlin
override fun transform(context: TransformContext, klass: ClassNode): ClassNode {
    if (klass.name == SHADOW_EDITOR) {
        return klass
    }

    klass.methods.forEach { method ->
        method.instructions?.iterator()?.asIterable()?.filterIsInstance(MethodInsnNode::class.java)?.filter {
            it.opcode == Opcodes.INVOKEINTERFACE && it.owner == SHARED_PREFERENCES_EDITOR
        }?.forEach { invoke ->
            when ("${invoke.name}${invoke.desc}") {
                "commit()Z" -> if (Opcodes.POP == invoke.next?.opcode) {
                    // if the return value of commit() does not used
                    // use asynchronous commit() instead
                    invoke.optimize(klass, method)
                    method.instructions.remove(invoke.next)
                }
                "apply()V" -> invoke.optimize(klass, method)
            }
        }
    }
    return klass
}
```

## The Data Consistency Problem

While the first two optimizations addressed jank and ANR to some extent, they actually introduced a bug. Consider this code:

```java
SharedPreferences sp = context.getSharedPreferences("config", Context.MODE_PRIVATE);
Editor editor = sp.edit();
editor.put("key", "value");
editor.commit();
String value = sp.getString("key", null);
```

See the problem? A `put` followed immediately by a `get` -- the value might not be there yet, because [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) could still be queued in the thread pool. While code like this is uncommon, it can still happen. So we introduced a new optimization with the following goals:

1. Fix jank and ANR caused by [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences).
1. Fix cross-process data sharing for [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences).
1. Fix the data consistency issue left over from previous versions.

## The Ultimate Solution

To truly solve the [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) problem, we need to avoid all the pitfalls of the native implementation:

1. ANR caused by [Editor.apply()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#apply()).
1. Main thread jank caused by [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()).
1. Main thread jank or even ANR from frequent asynchronous [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) calls.
1. Inability to synchronize data across processes in a timely manner.

Booster's solution is [BoosterSharedPreferences](https://github.com/didi/booster/blob/master/booster-android-instrument-shared-preferences/src/main/java/com/didiglobal/booster/instrument/sharedpreferences/BoosterSharedPreferences.java). Through [SharedPreferencesTransformer](https://github.com/didi/booster/blob/master/booster-transform-shared-preferences/src/main/kotlin/com/didiglobal/booster/transform/sharedpreferences/SharedPreferencesTransformer.kt), all calls to `Context.getSharedPreferences(String, int)` are replaced with `ShadowSharedPreferences.getSharedPreferences(Context, String, int)`:

```kotlin
public class ShadowSharedPreferences {

    public static SharedPreferences getSharedPreferences(final Context context, String name, final int mode) {
        if (TextUtils.isEmpty(name)) {
            name = "null";
        }
        return BoosterSharedPreferences.getSharedPreferences(name);
    }

    public static SharedPreferences getPreferences(final Activity activity, final int mode) {
        return getSharedPreferences(activity.getApplicationContext(), activity.getLocalClassName(), mode);
    }

}
```

In [BoosterSharedPreferences](https://github.com/didi/booster/blob/master/booster-android-instrument-shared-preferences/src/main/java/com/didiglobal/booster/instrument/sharedpreferences/BoosterSharedPreferences.java), [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) instances are cached, which significantly improves performance:

```kotlin
public static SharedPreferences getSharedPreferences(final String name) {
    if (!sSharedPreferencesMap.containsKey(name)) {
        sSharedPreferencesMap.put(name, new BoosterSharedPreferences(name));
    }
    return sSharedPreferencesMap.get(name);
}
```
