---
title: Booster 为系统 bug 兜底
date: 2019-07-02 20:16:35
categories: Booster
tags:
  - booster
  - android
  - performance
  - optimization
  - gradle
  - bug
---

许多 Android 开发者可能经常遇到这样的情况：测试的时候好好的，一上线，各种系统的 crash 就报上来了，而且很多是偶现的，比如：

- `WindowManager$BadTokenException`
- `Resources.NotFoundException`
- `NullPointerException`
- `SecurityException`
- `IllegalArgumentException`
- `RuntimeException`
- ......

很多情况下，这些异常崩溃并不是由 APP 导致的，而且堆栈中也没有半点 APP 的影子，就拿 `WindowManager$BadTokenException` 来说，一部分是 Android 7.1 的 bug，一部分可能是操作 Dialog 或者 Fragment 导致，如果是 APP 代码逻辑的问题，很容易就能在堆栈中发现，那如果是因为系统导致的崩溃，我们是不是就无能为力了呢？

## 修复系统 Bug

还是拿 `WindowManager$BadTokenException` 来举例子，如果是因为 `Toast` 导致的，很多人的第一反应就是自定义 `Toast`，当然，这完全能解决问题，但是 Booster 提供了另一种完全不一样的解决方案 —— 在构建期间将代码中所有对 `Toast.show(...)` 方法的调用指令替换为 `ShadowToast.show(Toast)`：

```java
public class ShadowToast {

    /**
     * Fix {@code WindowManager$BadTokenException} for Android N
     *
     * @param toast
     *         The original toast
     */
    public static void show(final Toast toast) {
        if (Build.VERSION.SDK_INT == 25) {
            workaround(toast).show();
        } else {
            toast.show();
        }
    }

    private static Toast workaround(final Toast toast) {
        final Object tn = getFieldValue(toast, "mTN");
        if (null == tn) {
            Log.w(TAG, "Field mTN of " + toast + " is null");
            return toast;
        }

        final Object handler = getFieldValue(tn, "mHandler");
        if (handler instanceof Handler) {
            if (setFieldValue(handler, "mCallback", new CaughtCallback((Handler) handler))) {
                return toast;
            }
        }

        final Object show = getFieldValue(tn, "mShow");
        if (show instanceof Runnable) {
            if (setFieldValue(tn, "mShow", new CaughtRunnable((Runnable) show))) {
                return toast;
            }
        }

        Log.w(TAG, "Neither field mHandler nor mShow of " + tn + " is accessible");
        return toast;
    }

}
```

这样做的好处是，所有代码（包括依赖的第三方 Library）都会被替换，而且完全无不侵入，再也不用担心 `Toast` 会崩溃了。

除了 Toast 会导致 `WindowManager$BadTokenException` 外，在 `Activity` 的生命周期回调中也经常出现，Booster 又有什么样的解决方案呢？—— 拦截 `ActivityThread`。

```java
public class ActivityThreadHooker {

    private volatile static boolean hooked;

    public static void hook() {
        if (hooked) {
            return;
        }

        Object thread = null;
        try {
            thread = android.app.ActivityThread.currentActivityThread();
        } catch (final Throwable t1) {
            Log.w(TAG, "ActivityThread.currentActivityThread() is inaccessible", t1);
            try {
                thread = getStaticFieldValue(android.app.ActivityThread.class, "sCurrentActivityThread");
            } catch (final Throwable t2) {
                Log.w(TAG, "ActivityThread.sCurrentActivityThread is inaccessible", t1);
            }
        }

        if (null == thread) {
            Log.w(TAG, "ActivityThread instance is inaccessible");
            return;
        }

        try {
            final Handler handler = getHandler(thread);
            if (null == handler || !(hooked = setFieldValue(handler, "mCallback", new ActivityThreadCallback(handler)))) {
                Log.i(TAG, "Hook ActivityThread.mH.mCallback failed");
            }
        } catch (final Throwable t) {
            Log.w(TAG, "Hook ActivityThread.mH.mCallback failed", t);
        }
        if(hooked) {
            Log.i(TAG, "Hook ActivityThread.mH.mCallback success!");
        }
    }

    private static Handler getHandler(final Object thread) {
        Handler handler;

        if (null != (handler = getFieldValue(thread, "mH"))) {
            return handler;
        }

        if (null != (handler = invokeMethod(thread, "getHandler"))) {
            return handler;
        }

        try {
            if (null != (handler = getFieldValue(thread, Class.forName("android.app.ActivityThread$H")))) {
                return handler;
            }
        } catch (final ClassNotFoundException e) {
            Log.w(TAG, "Main thread handler is inaccessible", e);
        }

        return null;
    }
}
```

有人可能会问，如果跟处理 `Toast` 的崩溃一样，直接用 `try-catch` 大法这样粗暴的处理方式的话，那 APP 本身的 bug 是不是就不能及时发现了呢？—— 确实是这样！

正是基于这样的考虑，Booster 并不是简单粗暴的一起兜住，虽然这样做可以让崩溃率变得更好看，但是，APP 本身的问题也就被掩盖了，咱们可是对技术有追求的，这种掩耳盗铃的事情咱们怎么可能会干呢，那到底是如何甄别异常是由 APP 引起的呢？—— 堆栈信息

```java
class ActivityThreadCallback implements Handler.Callback {

    private static final String LOADED_APK_GET_ASSETS = "android.app.LoadedApk.getAssets";

    private static final String ASSET_MANAGER_GET_RESOURCE_VALUE = "android.content.res.AssetManager.getResourceValue";

    private static final String[] SYSTEM_PACKAGE_PREFIXES = {
            "java.",
            "android.",
            "androidx.",
            "dalvik.",
            "com.android.",
            ActivityThreadCallback.class.getPackage().getName() + "."
    };

    private final Handler mHandler;

    public ActivityThreadCallback(final Handler handler) {
        this.mHandler = handler;
    }

    @Override
    public final boolean handleMessage(final Message msg) {
        try {
            this.mHandler.handleMessage(msg);
        } catch (final NullPointerException e) {
            if (hasStackTraceElement(e, ASSET_MANAGER_GET_RESOURCE_VALUE, LOADED_APK_GET_ASSETS)) {
                abort(e);
            }
            rethrowIfNotCausedBySystem(e);
        } catch (final SecurityException
                | IllegalArgumentException
                | AndroidRuntimeException
                | WindowManager.BadTokenException e) {
            rethrowIfNotCausedBySystem(e);
        } catch (final Resources.NotFoundException e) {
            rethrowIfNotCausedBySystem(e);
            abort(e);
        } catch (final RuntimeException e) {
            final Throwable cause = e.getCause();
            if (((Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) && isCausedBy(cause, DeadSystemException.class))
                    || (isCausedBy(cause, NullPointerException.class) && hasStackTraceElement(e, LOADED_APK_GET_ASSETS))) {
                abort(e);
            }
            rethrowIfNotCausedBySystem(e);
        } catch (final Error e) {
            rethrowIfNotCausedBySystem(e);
            abort(e);
        }

        return true;
    }

    private static void rethrowIfNotCausedBySystem(final RuntimeException e) {
        if (!isCausedBySystem(e)) {
            throw e;
        }
    }

    private static void rethrowIfNotCausedBySystem(final Error e) {
        if (!isCausedBySystem(e)) {
            throw e;
        }
    }

    private static boolean isCausedBySystem(final Throwable t) {
        if (null == t) {
            return false;
        }

        for (Throwable cause = t; null != cause; cause = cause.getCause()) {
            for (final StackTraceElement element : cause.getStackTrace()) {
                if (!isSystemStackTrace(element)) {
                    return false;
                }
            }
        }

        return true;
    }

    private static boolean isSystemStackTrace(final StackTraceElement element) {
        final String name = element.getClassName();
        for (final String prefix : SYSTEM_PACKAGE_PREFIXES) {
            if (name.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    private static boolean hasStackTraceElement(final Throwable t, final String... traces) {
        return hasStackTraceElement(t, new HashSet<>(Arrays.asList(traces)));
    }

    private static boolean hasStackTraceElement(final Throwable t, final Set<String> traces) {
        if (null == t || null == traces || traces.isEmpty()) {
            return false;
        }

        for (final StackTraceElement element : t.getStackTrace()) {
            if (traces.contains(element.getClassName() + "." + element.getMethodName())) {
                return true;
            }
        }

        return hasStackTraceElement(t.getCause(), traces);
    }

    @SafeVarargs
    private static boolean isCausedBy(final Throwable t, final Class<? extends Throwable>... causes) {
        return isCausedBy(t, new HashSet<>(Arrays.asList(causes)));
    }

    private static boolean isCausedBy(final Throwable t, final Set<Class<? extends Throwable>> causes) {
        if (null == t) {
            return false;
        }

        if (causes.contains(t.getClass())) {
            return true;
        }

        return isCausedBy(t.getCause(), causes);
    }

    private static void abort(final Throwable t) {
        final int pid = Process.myPid();
        final String msg = "Process " + pid + " is going to be killed";

        if (null != t) {
            Log.w(TAG, msg, t);
        } else {
            Log.w(TAG, msg);
        }

        Process.killProcess(pid);
        System.exit(10);
    }

}
```

以上的异常处理中，包含了有很多细节的问题，比如：Android N 以上的版本在 APP 升级后首次启动找不到 `AssetManager` 等等。所以针对这些异常的处理办法就是 —— 不是系统导致的，通通抛出去，这样，APP 自身的 bug 就能在第一时间被发现了。

## 副作用

在拦截 `ActivityThread` 后，将非系统异常抛出去虽然对于崩溃率来说收益明显，但是给 APM 系统做异常聚合带来了一些麻烦，因为很多 APM 系统的聚合算法也是根据堆栈来聚合的，不巧的是，这些被抛出来的异常最终都会被聚合到 `ActivityThreadCallback` 中。

## 总结

以上的这些解决方案，在 Booster 框架中都提供了现成的模块：

- [booster-transform-finalizer-watchdog-daemon](https://github.com/didi/booster/blob/master/booster-transform-finalizer-watchdog-daemon)
- [booster-transform-media-player](https://github.com/didi/booster/blob/master/booster-transform-media-player)
- [booster-transform-res-check](https://github.com/didi/booster/blob/master/booster-transform-res-check)
- [booster-transform-toast](https://github.com/didi/booster/blob/master/booster-transform-toast)
- [booster-transform-activity-thread](https://github.com/didi/booster/blob/master/booster-transform-activity-thread)

关于如何集成，请参见：https://github.com/didi/booster#system-bug。
