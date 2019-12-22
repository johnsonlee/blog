---
title: Booster 多线程优化
date: 2019-06-09 20:00:00
category:
  - Booster
  - 性能优化
tags:
  - booster
  - android
  - performance
  - optimization
  - gradle
  - transform
  - asm
  - thread
---

## 背景

对于开发者来说，线程管理一直是最头疼的问题之一，尤其是业务复杂的 APP，每个业务模块都有着几十甚至上百个线程，而且，作为业务方，都希望本业务的线程优先级最高，能够在调度的过程中获得更多的 CPU 时间片，然而，过多的竞争意味着过多的资源浪费在了线程调度上。

如何能有效的解决上述的多线程管理问题呢？大多数人可能想到的是「使用统一的线程管理库」，当然，这是最理想的情况，而往往现实并非总是尽如人意。随着业务的高速迭代，积累的技术债也越来越多，面对错综复杂的业务逻辑和历史遗留问题，架构师如何从容应对？

在此之前，我们通过对线程进行埋点监控，发现了以下的现象：

1. 在某种场景下会无限制的创建新线程，最终导致 OOM
1. 在某一时间应用内的线程数达到数百甚至上千
1. 即使在空闲的时候，线程池中的线程一直在 *WAITING*

这些现象最终导致的问题是：

1. OOM
1. 无法分辨出线程所属的业务线，导致排查问题效率低下

针对这些问题，如果采用上面提到的「统一线程管理库」的方案，对于业务方来说，任何大范围的改造都意味着风险和成本，那有没有低成本的解决方案呢？经过反复思考和论证，最终我们选择了字节码注入方案，具体思路是：

1. 对线程进行重命名

  重命名线程的主要目的是为了区分该线程是由哪个模块、哪个业务线创建的，这样，线程监控埋点的聚合能够做到更加精确

1. 对线程池的参数进行调优

  - 限制线程池的 `minPoolSize` 和 `maxPoolSize`
  - 允许核心线程在空闲的时候自动销毁

## 线程重命名

经过分析发现，APP 中的线程创建主要是通过以下几种方式：

- `Thread` 及其子类
- `TheadPoolExecutor` 及其子类、`Executors`、`ThreadFactory` 实现类
- `AsyncTask`
- `Timer` 及其子类

以 `Thread` 类为例，可以通过以下构造方法进行线程的实例化：

- `Thread()`
- `Thread(runnable: Runnable)`
- `Thread(group: ThreadGroup, runnable: Runnable)`
- `Thread(name: String)`
- `Thread(group: ThreadGroup, name: String)`
- `Thread(runnable: Runnable, name: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String, stackSize: long)`

我们的目标就是将以上这些方法调用替换成对应的 `ShadowThread` 的静态方法：

- `Thread()` => `ShadowThread.newThread(prefix: String)`
- `Thread(runnable: Runnable)` => `ShadowThread.newThread(runnable: Runnable, prefix: String)`
- `Thread(group: ThreadGroup, runnable: Runnable)` => `ShadowThread.newThread(group: ThreadGroup, runnable: Runnable, prefix: String)`
- `Thread(name: String)` => `ShadowThread.newThread(name: String, prefix: String)`
- `Thread(group: ThreadGroup, name: String)` => `ShadowThread.newThread(group: ThreadGroup, name: String, prefix: String)`
- `Thread(runnable: Runnable, name: String)` => `ShadowThread.newThread(runnable: Runnable, name: String, prefix: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String)` => `ShadowThread.newThread(group: ThreadGroup, runnable: Runnable, name: String, prefix: String)`
- `Thread(group: ThreadGroup, runnable: Runnable, name: String, stackSize: long)` => `ShadowThread.newThread(group: ThreadGroup, runnable: Runnable, name: String, prefix: String)`

细心的读者可能会发现，`ShadowThread` 类的这些静态方法的参数比替换之前多了一个 `prefix`，其实，这个 `prefix` 就是调用 `Thread` 的构造方法的类的 `className`，而这个类名，是在 *Transform* 的过程中扫描出来的，下面用一个简单的例子来说明，比如我们有一个 `MainActivity` 类：

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

在未重命名之前，其创建的线程的命名是 *Thread-{N}*，为了能让 APM 采集到的名字变成 *com.didiglobal.booster.demo.MainActivity#Thread-{N}* ，我们需要给线程的名字加一个前缀来标识，这个前缀就是 `ShadowThread` 的静态方法的最后一个参数 `prefix` 的来历。

![](https://github.com/didi/booster/blob/master/assets/screenshot-booster-transform-thread.png?raw=true)

## 线程池参数优化

理解了线程重命名的实现原理，线程池参数优化也就能理解了，同样也是将调用 `ThreadPoolExecutor` 类的构造方法替换为 `ShadowThreadPoolExecutor` 的静态方法，如下所示：

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

以上示例中，将线程池的核心线程数设置为 `0`，最大线程数设置为 `MAX_POOL_SIZE`，并且，允许核心线程在空闲时销毁，避免空闲线程占用过多的内存资源。

## JDK Bug

经过以上对线程池的优化后中，我们信心满满的的准备灰度发布，但是，当我们在进行功耗测试时，发现 CPU 负载异常竟然高达 60% 以上，经过一步步排查，最终发现问题出在 `ScheduledThreadPool` 的 `minPoolSize` 上，竟然命中了 JDK 的两个 bug，而且这两个 bug 直到 JDK 9 才修复：

- [JDK-8022642](https://bugs.openjdk.java.net/browse/JDK-8022642)
- [JDK-8129861](https://bugs.openjdk.java.net/browse/JDK-8129861)

这也就是为什么我们将 `ScheduledThreadPool` 的 `minPoolSize` 设置为了 `1` 的原因。

## 总结

针对多线程的优化主要是以下两个关键点：

1. 将目标方法调用指令替换为注入的静态方法调用
1. 在静态方法中构造优化过的线程、线程池实例并返回

当然，以上的优化方案比较偏保守，主要是考虑到尽可能降低优化带来的副作用，这也跟 APP 的应用场景有关，大家可以根据自身的业务需求进行相应的调整。

