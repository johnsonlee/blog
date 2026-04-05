---
title: SPI Performance Optimization
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
  - SPI
date: 2020-01-23 00:00:00
lang: en
i18n_key: service-provider-interface-optimization
---

Java developers should be familiar with [SPI (Service Provider Interface)](https://docs.oracle.com/javase/tutorial/ext/basics/spi.html). Whether it's the JDK, Gradle, or various third-party frameworks, SPI is widely used to provide extensibility. So why is it so rarely seen on the Android platform?

I believe there are two reasons:

1. Android and Java applications have different distribution models

    Java applications are distributed as JARs, making them very easy to extend. But once an Android APK is built, it's essentially frozen. Achieving extensibility requires non-standard approaches.

1. SPI performance on Android is concerning

    Since Android devices generally have lower performance than PCs, combined with Android's ANR mechanism, SPI can easily cause jank or even ANR on Android.

## What Is SPI

The official Java definitions are:

### Service

A set of programming interfaces and classes that provide access to specific application functionality and features.

### Service Provider Interface (SPI)

A set of public interfaces and abstract classes defined by the Service.

### Service Provider

An implementation of the SPI.

## SPI's Performance Deficiency

Java's native SPI searches for SPI configuration files under *META-INF/services/* through the *ClassLoader* in the *CLASSPATH*, then reads their contents. This requires parsing JAR files (on Android, parsing APK files), which involves iterating through every entry in the entire JAR/APK. This makes it extremely time-consuming (I've been burned by this before).

## Why Choose SPI Anyway

If SPI performs so poorly on Android, why use it at all?

During application development, architectural requirements inevitably demand compile-time extensibility -- interface-implementation separation, one interface with multiple implementations that need dynamic discovery, reverse dependencies, and so on. Compared to [Dagger](https://github.com/google/dagger), SPI is simple, natively supported by the API, and doesn't require any additional third-party libraries.

## How to Optimize

Having chosen SPI, how do we solve its performance bottleneck on Android? The answer is: eliminate I/O.

The approach is straightforward. Let's walk through it using reverse thinking:

1. Generate a service registry -- *ServiceRegistry* -- during the build phase
1. Replace all `ServiceLoader` invocations in the code with calls to a custom *ShadowServiceLoader*
1. *ShadowServiceLoader* retrieves the *Service Provider Interface* to *Service Provider* mappings from *ServiceRegistry*

But there are several questions:

1. Does *ServiceRegistry* store mappings of *Class&lt;Service&gt;* to *Class&lt;ServiceProvider&gt;*, or something else?

    It could be a *Class* mapping, but instantiating a *Service Provider* would then require reflection.

1. Can *ServiceLoader* completely avoid reflection when loading through *ServiceRegistry*?

    Yes, it can. In that case, *ServiceRegistry* needs to store mappings from *Class&lt;Service&gt;* to *Creator&lt;ServiceProvider&gt;*. The content looks roughly like this:

    ```java
    public class ServiceRegistry {

        static final Map<Class<?>, List<Callable<?>>> registry = new HashMap<>();

    }
    ```

    A *Creator* looks roughly like this:

    ```java
    public class ServiceProviderCreator implements Callable<ServiceProvider> {

        @Override
        public ServiceProvider call() {
            return new ServiceProvider();
        }

    }
    ```

1. How do we register the mappings into *ServiceRegistry*? Using a static initializer block:

    ```java
    public class ServiceRegistry {

        static final Map<Class<?>, List<Callable<?>>> registry = new HashMap<>();

        static {
            register(InterfaceA.class, new InterfaceACreator())
        }

    }
    ```

## Example

### HttpProtocolConfig.kt

```kotlin
interface HttpProtocolConfig {

    fun getProtocol(): String

}
```

### HttpProtocolConfigProvider.kt

```kotlin
@Service(HttpProtocolConfig.class)
class HttpProtocolConfigProvider : HttpProtocolConfig {

    override fun getProtocol() = if (BuildConfig.DEBUG) "http" else "https"

}
```

### HomePresenter.kt

```kotlin
class HomePresenter : Presenter() {

    private val config = ServiceLoader.load(HttpProtocolConfig::class.java).first()

    fun loadConfig() {
        println(config.getProtocol())
    }

}
```

## Source Code

This solution is fully open-sourced at: https://github.com/johnsonlee/service-loader-android

Example code: https://github.com/johnsonlee/service-loader-android/tree/master/example
