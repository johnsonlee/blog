---
title: Booster Collector API
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
date: 2022-01-16 23:00:00
lang: en
i18n_key: booster-collector-api
---

Booster maintains its high performance through two key mechanisms: parallel I/O and single-pass I/O. What does "single-pass I/O" mean? During the Transform process, Booster reads and writes each input (JAR/DIR) exactly once, processing the entire app's bytecode through a pipeline -- the *Bytecode Transform Pipeline*. This means each `Transformer` gets only one chance to process a *class*. But what if a `Transformer` needs to first collect some information and then write that information as bytecode into a specific *class* during the Transform? That becomes difficult. A classic example is *SPI* optimization. While *R8* can optimize *SPI*, it imposes certain constraints on how code must be written.

## R8's SPI Optimization

Starting from version *1.5.68*, R8 added optimization for `ServiceLoader`. Why? Primarily to address a performance issue in *Kotlin Coroutines* -- [Slow android Dispatchers.Main init](https://github.com/Kotlin/kotlinx.coroutines/issues/878). For more details, see: https://issuetracker.google.com/issues/120436373

*Kotlin Coroutines* uses *SPI* to run different API implementations on different JVM platforms -- for instance, the *Android* implementation differs from the *Java* one since Android needs the *Main Looper*, which doesn't exist in plain *Java*. The Kotlin Coroutines solution was a bit clunky, so R8 introduced an optimization targeting this specific pattern:

```java
ServiceLoader.load(X.class, X.class.getClassLoader()).iterator();
```

After optimization, the code becomes:

```java
Arrays.asList(new X[] { new Y(), ..., new Z() }).iterator()
```

Here, `Y` and `Z` are all implementations of `X` discovered at compile time. For implementation details, see: [ServiceLoaderRewriter.java](https://r8.googlesource.com/r8/+/refs/heads/main/src/main/java/com/android/tools/r8/ir/optimize/ServiceLoaderRewriter.java)

## Limitations of Single-Pass I/O

For this kind of scenario, Booster's single-pass I/O falls short. Modifying `ServiceLoader` calls requires first discovering all implementation classes for each *Service*, which means at least two read passes -- but a `Transformer` only gets one.

There's another problem: during incremental builds, if `X`'s implementations change from `Y` and `Z` to just `Y` (i.e., `Z` is deleted), how does the class that calls `ServiceLoader` detect this change and remove `Z` from the already-optimized code? In other words, transforming:

```java
Arrays.asList(new X[] { new Y(), new Z() }).iterator()
```

into:

```java
Arrays.asList(new X[] { new Y() }).iterator()
```

The first problem -- needing an extra read pass -- is relatively straightforward. The second problem is harder: during incremental builds, the scope of changes extends beyond what AGP considers incremental, because some *JAR/DIR* files haven't changed but were modified by the optimization and need to be re-optimized. This requires yet another read pass. Three reads plus one write versus the original one read and one write -- for a framework obsessed with performance like Booster, that's unacceptable. How can we reduce the unnecessary I/O overhead?

## Booster Collector API

To thoroughly solve these problems, starting from version 4.3.0, Booster provides the [Collector API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt) to merge those two extra read operations. In most cases, you don't need to re-parse *class* files to collect information -- simply iterating over all filenames in the *JAR/DIR* entries is sufficient.

Additionally, Booster provides a [Supervisor API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt#L23) similar to the [Collector API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt). The only difference: the [Collector API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt#L7) results affect the incremental *Transform* scope, while the [Supervisor API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt#L23) does not.

### Collecting SPI Services

For *SPI* information gathering, Booster provides a built-in implementation -- [ServiceSupervisor](https://github.com/didi/booster/blob/master/booster-transform-util/src/main/kotlin/com/didiglobal/booster/transform/util/Supervisors.kt#L55). Here's how to use it:

```kotlin
@AutoService(ClassTransformer::class)
class ServiceRegistryTransformer : ClassTransformer {

    val services = mutableListOf<Pair<String, Collection<String>>>()

    override fun onPreTransform(context: TransformContext) {
        context.registerCollector(ServiceSupervisor() {
            services += it
        })
    }

    override fun transform(context: TransformContext, klass: ClassNode) = klass.apply {
        // TODO ...
    }

}
```

### Generating/Updating ServiceRegistry

Many frameworks generate a service registry at compile time for service registration and discovery. During full builds, [ServiceSupervisor](https://github.com/didi/booster/blob/master/booster-transform-util/src/main/kotlin/com/didiglobal/booster/transform/util/Supervisors.kt#L55) handles this well. But during incremental builds, the `ServiceRegistry` class -- typically baked into framework code as a *JAR/AAR* -- never changes before the *Transform* phase. For the framework to support incremental builds, it needs to update `ServiceRegistry` whenever a *Service* changes. This is where [NameCollector](https://github.com/didi/booster/blob/master/booster-transform-util/src/main/kotlin/com/didiglobal/booster/transform/util/Collectors.kt#L53) comes in, forcing an update on the *JAR* containing `ServiceRegistry`:

```kotlin
@AutoService(ClassTransformer::class)
class ServiceRegistryTransformer : ClassTransformer {

    val services = mutableListOf<Pair<String, Collection<String>>>()

    override fun onPreTransform(context: TransformContext) {
        context.registerCollector(ServiceSupervisor() {
            services += it
        })

        // Once a JAR/DIR contains ${SERVICE_REGISTRY},
        // force the transform flow regardless of full or incremental build
        context.registerCollector(NameCollector(SERVICE_REGISTRY))
    }

    override fun transform(context: TransformContext, klass: ClassNode) = klass.apply {
        when (klass.name) {
            SERVICE_REGISTRY -> {
                val init = methods.find {
                    it.name == "<init>" && it.desc == "()V"
                } ?: defaultInit.apply {
                    methods.add(this)
                }

                init.instructions = InstList().apply {
                    services.forEach { (api, implementations) ->
                        implementations.forEach { implementation ->
                            // class of api
                            add(LdcInsnNode(Type.getObjectType(api)))
                            // class of implementation
                            add(LdcInsnNode(Type.getObjectType(implementation)))
                            // ServiceRegistry.register(interface, implementation)
                            add(MethodInsnNode(Opcodes.INVOKEVIRTUAL, SERVICE_REGISTRY, "register", "(Ljava/lang/Class;Ljava/lang/Class;)"))
                        }
                    }
                    add(InsnNode(Opcodes.RETURN))
                }
            }
        }
    }
}

private const val SERVICE_REGISTRY = "com/your/package/ServiceRegistry.class"
```

The final decompiled code would look something like this:

```java
class ServiceRegistry {

    private static final Map<Class<?>, List<Class<?>> mapping = new HashMap<>();

    private void <T> register(Class<T> api, Class<? extends T> implementation) {
        ...
    }

    private ServiceRegistry() {
        register(A.class, AImpl.class);
        register(B.class, BImpl.class);
        register(C.class, CImpl.class);
        ...
    }

}
```

## References

1. [SPI Performance Optimization](/2020/01/23/service-provider-interface-optimization/)
