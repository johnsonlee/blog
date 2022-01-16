---
title: Booster Collector API
date: 2022-01-16 23:00:00
categories: Booster
tags:
  - Booster
---

Booster 之所以保持着高性能，除了并行 I/O 以外，还有一个很重要的方面 —— 单次 I/O。可能有人会问，什么叫单次 I/O？所谓单次 I/O 是指，在 Transform 的过程中，对于每一个输入 (JAR/DIR) ，Booster 只需要一次读和一次写，便可以实现整个 app 的字节码以流水线的方式进行处理，也就是 *Bytecode Transform Pipeline*。这就意味着，每个 `Transformer` 只有一次机会来处理 *class* ，但如果想要在 `Transformer` 先收集一些信息，再在 *Transform* 的过程中将这些收集到的信息，以字节码的方式写入到某个 *class* 中，就不太容易实现。一个典型的例子便是 *SPI* 优化，虽然 *R8* 可以对 *SPI* 进行化，但是，对写代码的姿势有一定的要求。

## R8 对 SPI 的优化

R8 从 *1.5.68* 开始，增加了对 `ServiceLoader` 的优化，为什么 R8 要增加这样一个优化功能呢？主要是为了解决 *Kotlin Coroutines* 的一个性能问题 —— [Slow android Dispatchers.Main init](https://github.com/Kotlin/kotlinx.coroutines/issues/878)，关于这个 bug 的更详细的内容，请参考：https://issuetracker.google.com/issues/120436373

*Kotlin Coroutines* 之所以要用 *SPI* 是为了解决在不同的 JVM 平台上运行不同的 *Kotlin Coroutines* 相关的 API 实现，比如，*Android* 平台上的实现和 *Java* 平台上的实现是不一样的，*Android* 需要用到 *Main Looper* 但这个在 *Java* 中并不存在，但 *Kotlin Coroutines* 的解决方案有点挫，为了解决这一性能问题，R8 给出了优化方案，针对以下这种写法来进行优化：

```java
ServiceLoader.load(X.class, X.class.getClassLoader()).iterator();
```

优化后的代码长这样：

```java
Arrays.asList(new X[] { new Y(), ..., new Z() }).iterator()
```

其中，`Y`, `Z` 则是在编译期分析出来的所有 `X` 的实现，具体实现细节，可以参考：[ServiceLoaderRewriter.java](https://r8.googlesource.com/r8/+/refs/heads/main/src/main/java/com/android/tools/r8/ir/optimize/ServiceLoaderRewriter.java)

## 单次 I/O 的局限性

针对这种场景，Booster 的单次 I/O 就明显满足不了需求，因为，修改 `ServiceLoader` 的调用需要在分析出每个 *Service* 对应的所有实现类之后，所以，至少需要两次读操作，但是，`Transformer` 只有一次读的机会。

这里还存在另一个问题，在于增量编译的情况下，如果 `X` 的实现类从原来的 `Y`, `Z` 变成了 `Y`，也就是 `Z` 被删除了，对于调用了 `ServiceLoader` 的类来说，如何才能感知到 `X` 的实现类的变化，然后将 `Z` 从原来已经优化过的代码中删除掉，即：

```java
Arrays.asList(new X[] { new Y(), new Z() }).iterator()
```

变成：

```java
Arrays.asList(new X[] { new Y() }).iterator()
```

对于第一个问题，只是多一次读的问题，还比较好解决，但对于第二个问题，即增量编译的情况下，增量的部分就不仅仅是表现在 AGP 的增量的范围了，需要增量更新范围会更大，因为有一些 *JAR/DIR* 并没变化，但是因为优化而被改到了，需要重新对其进行优化，所以，要解决这一问题，还需要一次读操作，如果是三次读加一次写的话，跟之前的一次读一次写，对于追求极致性能的 Booster 显然是无法接受的，有什么办法降低不必要的 I/O 开销呢？

## Booster Collector API

为了彻底的解决前面提到的问题，Booster 从 4.3.0 开始，提供了 [Collector API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt) 来将前面提到的两次额外的读操作进行合并，一般情况下，不需要重新解析 *class* 就能收集到所有的信息，只需要遍历一下所有的 *JAR/DIR* 中的文件名即可。

除此之外，还提供了另一个跟 [Collector API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt) 类似的 [Supervisor API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt#L23)，它们之间唯一的区别在于，[Collector API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt#L7) 的结果会影响增量 *Transform* 的范围，而 [Supervisor API](https://github.com/didi/booster/blob/master/booster-transform-spi/src/main/kotlin/com/didiglobal/booster/transform/Collector.kt#L23) 并不会影响构建。

### SPI Service 收集

针对 *SPI* 的信息收集，Booster 提供了默认的实现 —— [ServiceSupervisor](https://github.com/didi/booster/blob/master/booster-transform-util/src/main/kotlin/com/didiglobal/booster/transform/util/Supervisors.kt#L55)，使用方法如下所示：

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

### 生成/更新 ServiceRegistry

很多框架的实现都是在编译期生成一个服务注册表，用于实现服务的注册与发现，在全量编译下，用 [ServiceSupervisor](https://github.com/didi/booster/blob/master/booster-transform-util/src/main/kotlin/com/didiglobal/booster/transform/util/Supervisors.kt#L55) 就能实现服务接口与实现的注册，但是在增量编译下，由于 `ServiceRegistry` 这个类一般是内置在框架代码中，是再也不会产生变化的，因为已经打成了 *JAR/AAR*，在 *Transform* 之前，是不会被修改了。但对于框架来说，要实现对增量的支持，就需要在 *Service* 有变化的时候，也更新 `ServiceRegistry`，这时候，就需要用到 [NameCollector](https://github.com/didi/booster/blob/master/booster-transform-util/src/main/kotlin/com/didiglobal/booster/transform/util/Collectors.kt#L53) 来针对 `ServiceRegistry` 所在的 *JAR* 进行强制更新，代码如下所示：

```kotlin
@AutoService(ClassTransformer::class)
class ServiceRegistryTransformer : ClassTransformer {

    val services = mutableListOf<Pair<String, Collection<String>>>()

    override fun onPreTransform(context: TransformContext) {
        context.registerCollector(ServiceSupervisor() {
            services += it
        })

        // 一旦有 JAR/DIR 中包含 ${SERVICE_REGISTRY} 这个文件
        // 则强制走 transform 的流程，无论是全量还是增量
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

最终的代码如果反编译过来，应该长这个样子：

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

1. [SPI 性能优化](/2020/01/23/service-provider-interface-optimization/)

