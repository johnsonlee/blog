---
title: "Booster: Multi-threading Optimization"
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-06-09 20:00:00
lang: en
i18n_key: booster-transform-thread
---

Thread management has always been one of the most painful problems for developers, especially in apps with complex business logic where each module can have dozens or even hundreds of threads. Every team wants their threads to have the highest priority and get more CPU time slices during scheduling, but too much contention means too many resources wasted on thread scheduling itself.

How do we effectively solve this multi-threading management problem? Most people think of "use a unified thread management library." That is the ideal case, but reality rarely cooperates. As business logic iterates rapidly, technical debt accumulates. Faced with tangled business logic and legacy code, how does an architect cope?

Before this, we used thread monitoring instrumentation and discovered the following:

1. Under certain scenarios, new threads were created without limit, eventually causing OOM.
1. At certain moments, the total number of threads in the app reached hundreds or even thousands.
1. Even when idle, threads in thread pools remained in a *WAITING* state.

These phenomena ultimately led to:

1. OOM
1. Inability to identify which business module owned a thread, making troubleshooting inefficient.

To address these issues with the "unified thread management library" approach, any large-scale refactoring means risk and cost for business teams. Is there a low-cost solution? After careful deliberation, we chose bytecode injection. The core idea:

1. Rename threads

  The primary goal of renaming threads is to identify which module and business line created them, enabling more accurate aggregation in thread monitoring instrumentation.

1. Tune thread pool parameters

  - Limit the thread pool's `minPoolSize` and `maxPoolSize`.
  - Allow core threads to be destroyed automatically when idle.

## Thread Renaming

Through analysis, we found that threads in the app are primarily created in the following ways:

- `Thread` and its subclasses
- `ThreadPoolExecutor` and its subclasses, `Executors`, `ThreadFactory` implementations
- `AsyncTask`
- `Timer` and its subclasses

Taking the `Thread` class as an example, threads can be instantiated through these constructors:

- `Thread()`
- `Thread(runnable: Runnable)`
- `Thread(group: ThreadGroup, runnable: Runnable)`
- `Thread(name: String)`
- `Thread(group: ThreadGroup, name: String)`
- `Thread(runnable: Runnable, name: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String, stackSize: long)`

Our goal is to replace all of these constructor calls with corresponding static methods in `ShadowThread`:

- `Thread()` => `ShadowThread.newThread(prefix: String)`
- `Thread(runnable: Runnable)` => `ShadowThread.newThread(runnable: Runnable, prefix: String)`
- `Thread(group: ThreadGroup, runnable: Runnable)` => `ShadowThread.newThread(group: ThreadGroup, runnable: Runnable, prefix: String)`
- `Thread(name: String)` => `ShadowThread.newThread(name: String, prefix: String)`
- `Thread(group: ThreadGroup, name: String)` => `ShadowThread.newThread(group: ThreadGroup, name: String, prefix: String)`
- `Thread(runnable: Runnable, name: String)` => `ShadowThread.newThread(runnable: Runnable, name: String, prefix: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String)` => `ShadowThread.newThread(group: ThreadGroup, runnable: Runnable, name: String, prefix: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String, stackSize: long)` => `ShadowThread.newThread(group: ThreadGroup, runnable: Runnable, name: String, prefix: String)`

Attentive readers may notice that the `ShadowThread` static methods have one extra parameter compared to the original: `prefix`. This `prefix` is simply the `className` of the class that calls the `Thread` constructor, extracted during the *Transform* pass. Here is a simple example with a `MainActivity` class:

```java
public class MainActivity extends AppCompatActivity {

    public void onCreate(Bundle savedInstanceState) {
        new Thread(new Runnable() {
            public void run() {
                doSomething();
            }
        }).start();
    }

}

```

Before renaming, the thread would be named *Thread-{N}*. To make the name collected by APM become *com.didiglobal.booster.demo.MainActivity#Thread-{N}*, we add a prefix to the thread name. That prefix is where the `ShadowThread` static method's last parameter `prefix` comes from.

![](https://github.com/didi/booster/blob/master/assets/screenshot-booster-transform-thread.png?raw=true)

## Thread Pool Parameter Tuning

Once you understand the thread renaming approach, thread pool parameter tuning follows the same pattern: replace calls to `ThreadPoolExecutor` constructors with static methods in `ShadowThreadPoolExecutor`:

```java
public static ThreadPoolExecutor newThreadPoolExecutor(
        final int corePoolSize,
        final int maxPoolSize,
        final long keepAliveTime,
        final TimeUnit unit,
        final BlockingQueue<Runnable> workQueue,
        final String name) {
    final ThreadPoolExecutor executor = new ThreadPoolExecutor(1, MAX_POOL_SIZE, keepAliveTime, unit, workQueue, new NamedThreadFactory(name));
    executor.allowCoreThreadTimeOut(keepAliveTime > 0);
    return executor;
}
```

In the example above, the core pool size is set to `0`, the maximum pool size is set to `MAX_POOL_SIZE`, and core threads are allowed to be destroyed when idle to avoid wasting memory on idle threads.

## JDK Bug

After applying the thread pool optimizations, we were confident and ready for canary release. But during power consumption testing, we discovered CPU load was abnormally high -- over 60%. After step-by-step investigation, the culprit turned out to be the `minPoolSize` of `ScheduledThreadPool`, which hit two JDK bugs that were not fixed until JDK 9:

- [JDK-8022642](https://bugs.openjdk.java.net/browse/JDK-8022642)
- [JDK-8129861](https://bugs.openjdk.java.net/browse/JDK-8129861)

This is why we set the `minPoolSize` of `ScheduledThreadPool` to `1`.

## Summary

The multi-threading optimization comes down to two key points:

1. Replace target method call instructions with injected static method calls.
1. In those static methods, construct optimized thread and thread pool instances and return them.

Of course, the optimization above is relatively conservative, primarily to minimize side effects. This is also tied to the app's usage scenarios -- you can adjust accordingly based on your own business needs.
