---
title: "Booster: Catching System Bugs Before They Crash Your App"
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-07-02 20:16:35
lang: en
i18n_key: booster-prevent-system-from-crash
---

Many Android developers have experienced this: everything works fine during testing, but once the app goes live, all kinds of system crashes start rolling in -- often intermittent ones like:

- `WindowManager$BadTokenException`
- `Resources.NotFoundException`
- `NullPointerException`
- `SecurityException`
- `IllegalArgumentException`
- `RuntimeException`
- ......

In many cases, these crashes aren't caused by the app at all, and there's not a single trace of app code in the stack. Take `WindowManager$BadTokenException` -- some are caused by an Android 7.1 bug, others by Dialog or Fragment operations. If it's an app logic issue, the stack trace reveals it easily. But what about crashes caused by the system itself? Are we simply out of luck?

## Fixing System Bugs

Let's stick with `WindowManager$BadTokenException` as an example. If it's caused by `Toast`, the first instinct for most developers is to create a custom `Toast`. That works, but Booster takes a completely different approach -- during the build, it replaces all `Toast.show(...)` call instructions in the code with `ShadowToast.show(Toast)`:

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

The advantage: all code -- including third-party libraries -- gets replaced, completely non-invasively. No more worrying about `Toast` crashes.

Beyond Toast, `WindowManager$BadTokenException` also frequently appears in `Activity` lifecycle callbacks. Booster's solution for that? Intercepting `ActivityThread`.

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

A fair question: if we just blanket catch-all exceptions like we did with `Toast`, won't that hide real bugs in the app? Yes, exactly.

That's precisely why Booster doesn't blindly swallow everything. Sure, catching all exceptions would make crash rates look better, but it would also mask real issues. We have higher standards than that. So how does Booster distinguish system-caused exceptions from app-caused ones? Stack trace analysis.

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

The exception handling above addresses many edge cases -- for instance, on Android N and above, the `AssetManager` may become unavailable after the first launch following an app upgrade. The strategy is simple: if the exception wasn't caused by the system, rethrow it. This way, real app bugs surface immediately.

## Side Effects

After hooking `ActivityThread`, rethrowing non-system exceptions does wonders for crash rates, but it creates a headache for APM systems doing exception aggregation. Many APM systems aggregate exceptions based on stack traces, and since these rethrown exceptions all end up going through `ActivityThreadCallback`, they get incorrectly grouped together.

## Summary

All of these solutions are available as ready-to-use modules in the Booster framework:

- [booster-transform-finalizer-watchdog-daemon](https://github.com/didi/booster/blob/master/booster-transform-finalizer-watchdog-daemon)
- [booster-transform-media-player](https://github.com/didi/booster/blob/master/booster-transform-media-player)
- [booster-transform-res-check](https://github.com/didi/booster/blob/master/booster-transform-res-check)
- [booster-transform-toast](https://github.com/didi/booster/blob/master/booster-transform-toast)
- [booster-transform-activity-thread](https://github.com/didi/booster/blob/master/booster-transform-activity-thread)

For integration instructions, see: https://github.com/didi/booster#system-bug.
