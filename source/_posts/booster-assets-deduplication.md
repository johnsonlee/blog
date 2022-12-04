---
title: Booster Assets 去重
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - 性能优化
date: 2019-06-22 20:00:00
---

一般 assets 出现大量重复的情况是不多见的，只有多业务线的大体量 APP 才有可能遇到。然而非常不幸的是，我们就遇到了这样的问题，虽然对包体积的影响不是很明显（也就几百 KB），但是几百 KB 对于做包体积优化的同学来说，蚊子肉也是肉啊。

## 如何去重？

去重的关键在于拦截对 assets 的访问，没错，就是 `AssetManager`，Booster 的方案就是通过 *Transformer* 替换 `AssetManager` 的方法调用指令为 Booster 注入的 `ShadowAssetManager`，不啰嗦了，先上代码：

```java
public final class ShadowAssetManager {

    /**
     * Shadow Asset => Real Asset
     */
    private static final Map<String, String> DUPLICATED_ASSETS = new ArrayMap<String, String>();

    public static InputStream open(final AssetManager am, final String shadow) throws IOException {
        final String name = DUPLICATED_ASSETS.get(shadow);
        return am.open(null != name && name.trim().length() > 0 ? name : shadow);
    }

    private ShadowAssetManager() {
    }

}
```

就这么简单么？当然不是，上面的 `DUPLICATED_ASSETS` 还是空的呢，接下来就需要在构建期间构建这个重复 assets 映射表了：

```kotlin
fun BaseVariant.removeDuplicatedAssets(): Map<String, String> {
    val output = mergeAssets.outputDir
    val assets = output.search().groupBy(File::md5).values.filter {
        it.size > 1
    }.map { duplicates ->
        val head = duplicates.first()
        duplicates.takeLast(duplicates.size - 1).map {
            it to head
        }.toMap(mutableMapOf())
    }.reduce { acc, map ->
        acc.putAll(map)
        acc
    }

    assets.keys.forEach {
        it.delete()
    }

    return assets.map {
        it.key.toRelativeString(output) to it.value.toRelativeString(output)
    }.toMap()
}
```

然后，在 *Transformer* 中修改 `ShadowAssetManager`，在它的 *clinit* 中将上面构建好的 assets 映射表添加到 *DUPLICATED_ASSETS* 中：

```kotlin
class ShadowAssetManagerTransformer : ClassTransformer {

    private lateinit var mapping: Map<String, String>

    override fun transform(context: TransformContext, klass: ClassNode): ClassNode {
        if (klass.name == SHADOW_ASSET_MANAGER) {
            klass.methods.find {
                "${it.name}${it.desc}" == "<clinit>()V"
            }?.let { clinit ->
                klass.methods.remove(clinit)
            }

            klass.defaultClinit.let { clinit ->
                clinit.instructions.apply {
                    add(TypeInsnNode(Opcodes.NEW, "java/util/HashMap"))
                    add(InsnNode(Opcodes.DUP))
                    add(MethodInsnNode(Opcodes.INVOKESPECIAL, "java/util/HashMap", "<init>", "()V", false))
                    add(VarInsnNode(Opcodes.ASTORE, 0))
                    mapping.forEach { shadow, real ->
                        add(VarInsnNode(Opcodes.ALOAD, 0))
                        add(LdcInsnNode(shadow))
                        add(LdcInsnNode(real))
                        add(MethodInsnNode(Opcodes.INVOKEVIRTUAL, "java/util/HashMap", "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;", false))
                        add(InsnNode(Opcodes.POP))
                    }
                    add(VarInsnNode(Opcodes.ALOAD, 0))
                    add(MethodInsnNode(Opcodes.INVOKESTATIC, "java/util/Collections", "unmodifiableMap", "(Ljava/util/Map;)Ljava/util/Map;", false))
                    add(FieldInsnNode(Opcodes.PUTSTATIC, SHADOW_ASSET_MANAGER, "DUPLICATED_ASSETS", "Ljava/util/Map;"))
                    add(InsnNode(Opcodes.RETURN))
                }
            }
        } else {
            klass.methods.forEach { method ->
                method.instructions?.iterator()?.asSequence()?.filterIsInstance(MethodInsnNode::class.java)?.filter {
                    ASSET_MANAGER == it.owner && "open(Ljava/lang/String;)Ljava/io/InputStream;" == "${it.name}${it.desc}"
                }?.forEach {
                    it.owner = SHADOW_ASSET_MANAGER
                    it.desc = "(L$ASSET_MANAGER;Ljava/lang/String;)Ljava/io/InputStream;"
                    it.opcode = Opcodes.INVOKESTATIC
                }
            }
        }

        return klass
    }
}
```

以上 `ShadowAssetManagerTransformer` 的作用便是改写 `ShadowAssetManager` 的静态块，往 `DUPLICATED_ASSETS` 中添加重复 assets 的映射关系，反编译后的代码如下：

```java
public final class ShadowAssetManager {

    private static final Map<String, String> DUPLICATED_ASSETS;

    static {
        Map<String, String> var0 = new HashMap<String, String>();

        var0.put("assets-1-1", "assets-1");
        var0.put("assets-1-2", "assets-1");
        var0.put("assets-1-3", "assets-1");

        var0.put("assets-2-1", "assets-2");
        var0.put("assets-2-2", "assets-2");

        ......

        var0.put("assets-N-1", "assets-N");
        var0.put("assets-N-2", "assets-N");
        ......
        var0.put("assets-N-n", "assets-N");

        DUPLICATED_ASSETS = Collections.unmodifiableMap(var0)
    }

}
```

## 美中不足

本方案能解决大部分的重复 assets 问题，但是字体除外——因为字体的加载并不是通过 Java 层的 `AssetManager` 完成的，有兴趣的同学可以研究一下 [Typeface](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/graphics/java/android/graphics/Typeface.java)。

## 总结

Booster 的 assets 去重方案主要分为以下 3 步：

1. 根据 assets 的 *md5sum* 进行分组，建立重复 assets 的映射关系；
1. 替换所有类中调用 `AssetManager.open(String): InputStream` 的指令为调用 `ShadowAssetManager.open(AssetManager, String): InputStream`；
1. 修改 `ShadowAssetManager` 的静态块，将重复 assets 的映射关系加入到 `ShadowAssetManager.DUPLICATED_ASSETS` 中；

## 扩展用法

通过拦截 `AssetManager.open(String): InputStream` 不仅可以实现 assets 的去重，还能对 assets 进行压缩，达到减小包体积的目的，原理很简单，主要是利用了 `AssetManager.open(String)` 方法的返回值是 `InputStream` 的特点，完全可以用 `ZipInputStream` 替代，具体思路如下：

1. 在 *mergeAssets* 之后，对 assets 进行 ZIP 压缩；
1. 拦截 `AssetManager.open()` 方法，在 `ShadowAssetManager.open()` 方法中返回 `ZipInputStream`；

以上整个过程对于 APP 来说完全透明，简直完美！
