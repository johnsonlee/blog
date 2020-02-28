---
title: SPI 性能优化
date: 2020-01-23 00:00:00
categories: Booster
tags:
  - Booster
  - 性能优化
  - SPI
---

做 Java 开发的同学应该对 [SPI (Service Provider Interface)](https://docs.oracle.com/javase/tutorial/ext/basics/spi.html) 不会陌生，无论是 JDK、Gradle 亦或是一些第三方框架，都或多或少的用它来实现可扩展的能力，为什么在 Android 平台上却鲜为人知呢？

个人认为原因有 2 点：

1. Android 与 Java 应用的分发方式不同

    Java 应用采用 JAR 分发，扩展起来非常容易，而 Android APK 一旦打好包，就相当于固化下来了，实现可扩展需要借助于其它非官方推荐的手段

1. SPI 在 Android 平台上的性能堪忧

  由于 Android 设备的性能普遍低于 PC ，加上 Android 平台特有的 ANR 机制，使得 SPI 很容易在 Android 上发生 卡顿甚至 ANR

## 什么是 SPI

Java 官方的定义是：

### Service

提供访问特定应用功能和特性的一系列编程接口和类

### Service Provider Interface (SPI)

由 Service 定义的一系列公共接口和抽象类

### Service Provider

SPI 的实现

## SPI 的性能缺陷

Java 原生的 SPI 是通过 *ClassLoader* 在 *CLASSPATH* 中搜索 *META-INF/services/* 下 SPI 配置文件，然后读取配置文件中的内容，所以需要解析 JAR 文件（Android 平台是解析 APK），而这个过程需要遍历整个 JAR/APK 中所有的条目，因此非常耗时（当年就被它坑得很惨）

## 选择 SPI 的理由

既然 SPI 在 Android 上表现这么差，为什么还要用它呢？

在应用开发的过程中，难免因为应用架构的原因，需要支持非运行时可扩展能力，比如：接口与实现分离、一个接口对应多个实现需要动态查找、反向依赖等等，相对于 [Dagger](https://github.com/google/dagger) 来说，它简单、原生 API 支持、不需要依赖额外的第三方库。

## 如何优化

既然选择了 SPI，如何解决 SPI 在 Android 平台上的性能瓶颈？——去 I/O

方法其实也很简单，分为如下几个步骤，我们不妨用逆向思维来看：

1. 在构建期间生成一个服务注册表—— *ServiceRegistry*
1. 将代码中所有调用 *ServiceLoader* 的指令替换成调用自定义的 *ShadowServiceLoader*
1. *ShadowServiceLoader* 从 *ServiceRegistry* 中获取 *Service Provider Interface* 与 *Service Provider* 的映射关系

但是这里有几个问题：

1. *ServiceRegistry* 中存储的是 *Class&lt;Service&gt;* 与 *Class&lt;ServiceProvider&gt;* 的映射还是别的映射方式？

  可以是 *Class* 的映射，但是，如果要实例化 *Service Provider* 就得需要反射

1. *ServiceLoader* 通过 *ServiceRegistry* 加载的时候，能否完全避免反射？

  当然是可以的，这样 *ServiceRegistry* 中存储的映射关系就需要调整为 *Class&lt;Service&gt;* 与 *Creator&lt;ServiceProvider&gt;* 之间的映射关系，内容大致如下：

  ```java
  public class ServiceRegistry {

      static final Map<Class<?>, List<Callable<?>>> registry = new HashMap<>();

  }
  ```

  *Creator* 的内容大致如下：

  ```java
  public class ServiceProviderCreator implements Callable<ServiceProvider> {

      @Override
      public ServiceProvider call() {
          return new ServiceProvider();
      }

  }
  ```

1. 如何将映射关系注册到 *ServiceRegistry* 里面呢？——静态代码块，内容大致如下：

  ```java
  public class ServiceRegistry {

      static final Map<Class<?>, List<Callable<?>>> registry = new HashMap<>();

      static {
          register(InterfaceA.class, new InterfaceACreator())
      }

  }
  ```

## 源代码

该方案已经完全开源，项目地址：https://github.com/johnsonlee/service-loader-android
