---
title: Booster Shared Preferences 优化
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-11-12 21:00:00
---

## 背景

在 [booster v0.1.5](https://github.com/didi/booster/releases/tag/v0.1.5) 版本其实就已经提供了针对 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 的优化，只不过优化的幅度比较小，毕竟 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 在 Android 中应用得过于广泛，所以，对它的优化非常非常谨慎，以至于我们经过了线上好几个版本的验证，才推出最新的优化方案。

至于为什么要对 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 做优化，我想做过 Android 开发的同学都清楚 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 的设计一直为人所诟病，其实，[SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 从一开始被 Google 的工程师设计出来并不是像现在这样用的，只不过后来被大家玩儿坏了，以至于出现了各种卡顿、ANR。

## booster v0.1.5 的优化方案

[booster v0.1.5](https://github.com/didi/booster/releases/tag/v0.1.5) 推出的针对 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 的优化，主要是将 [Editor.apply()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#apply()) 替换成 [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) 并在子线程中执行，代码如下：

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

> 至于为什么要将 [Editor.apply()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#apply()) 替换成异步 [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit())，可以看看这篇文章：http://www.cloudchou.com/android/post-988.html

## booster v0.2.0 的优化方案

[booster v0.2.0](https://github.com/didi/booster/releases/tag/v0.2.0) 又进一步对 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 做了优化，当调用了 [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) 但是其返回值如果没使用，就将 [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) 放到子线程中执行，代码如下：

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

## 数据一致性问题

前两种优化方案虽然能一定程度上解决卡顿和 ANR 的问题，但其实是有 bug 的，比如像下面这段代码：

```java
SharedPreferences sp = context.getSharedPreferences("config", Context.MODE_PRIVATE);
Editor editor = sp.edit();
editor.put("key", "value");
editor.commit();
String value = sp.getString("key", null);
```

大家有没有发现？刚 `put` 完，立即 `get`，这时候很有可能是取不到 `put` 的值的，因为 [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) 很有可能还在线程池中排队，只不过一般很少有代码写成这样，但是还是避免不了这样的情况会发生，所以，我们推出了新的优化方案，目的有以下几点：

1. 解决 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 引起的卡顿和 ANR；
1. 解决 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 在进程间的数据共享问题；
1. 修复之前的版本中遗留的数据一致性问题；

## 终极方案

想要彻底解决 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 问题，就需要避开原生实现的各种坑，如：

1. [Editor.apply()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#apply()) 导致的 ANR；
1. [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) 导致主线程卡顿；
1. 频繁异步 [Editor.commit()](https://developer.android.google.cn/reference/android/content/SharedPreferences.Editor.html#commit()) 导致主线程卡顿甚至 ANR；
1. 进程间无法及时同步数据；

所以，针对此问题 booster 的解决方案是—— [BoosterSharedPreferences](https://github.com/didi/booster/blob/master/booster-android-instrument-shared-preferences/src/main/java/com/didiglobal/booster/instrument/sharedpreferences/BoosterSharedPreferences.java)，通过 [SharedPreferencesTransformer](https://github.com/didi/booster/blob/master/booster-transform-shared-preferences/src/main/kotlin/com/didiglobal/booster/transform/sharedpreferences/SharedPreferencesTransformer.kt) 将所有调用 `Context.getSharedPreferences(String, int)` 的指令替换成 `ShadowSharedPreferences.getSharedPreferences(Context, String, int)`，代码如下：

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

在 [BoosterSharedPreferences](https://github.com/didi/booster/blob/master/booster-android-instrument-shared-preferences/src/main/java/com/didiglobal/booster/instrument/sharedpreferences/BoosterSharedPreferences.java) 中，对 [SharedPreferences](https://developer.android.google.cn/reference/android/content/SharedPreferences) 进行了缓存，这样能够大幅的提升性能。

```kotlin
public static SharedPreferences getSharedPreferences(final String name) {
    if (!sSharedPreferencesMap.containsKey(name)) {
        sSharedPreferencesMap.put(name, new BoosterSharedPreferences(name));
    }
    return sSharedPreferencesMap.get(name);
}
```





