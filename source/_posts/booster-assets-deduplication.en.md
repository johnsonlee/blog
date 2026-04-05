---
title: Booster Assets Deduplication
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-06-22 20:00:00
lang: en
i18n_key: booster-assets-deduplication
---

Duplicate assets are rarely an issue -- unless you're working on a large-scale app with multiple business lines. Unfortunately, that was exactly our situation. The impact on package size wasn't huge (a few hundred KB), but for anyone doing size optimization, every byte counts.

## How to Deduplicate?

The key is intercepting access to assets -- specifically, `AssetManager`. Booster's approach uses a *Transformer* to replace `AssetManager` method call instructions with an injected `ShadowAssetManager`. Here's the code:

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

Is that all? Not quite -- the `DUPLICATED_ASSETS` map above is still empty. The next step is to build this duplicate assets mapping during the build process:

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

Then, in the *Transformer*, we modify `ShadowAssetManager` by injecting the asset mapping into its *clinit* (static initializer), populating `DUPLICATED_ASSETS`:

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

The `ShadowAssetManagerTransformer` above rewrites the static initializer of `ShadowAssetManager` to populate `DUPLICATED_ASSETS` with the duplicate asset mappings. When decompiled, the result looks like this:

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

## A Minor Limitation

This approach handles most duplicate assets, but fonts are an exception -- font loading doesn't go through the Java-layer `AssetManager`. If you're curious, take a look at [Typeface](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/graphics/java/android/graphics/Typeface.java).

## Summary

Booster's asset deduplication works in three steps:

1. Group assets by *md5sum* and build a mapping of duplicates;
1. Replace all `AssetManager.open(String): InputStream` call instructions with `ShadowAssetManager.open(AssetManager, String): InputStream`;
1. Modify the static initializer of `ShadowAssetManager` to populate `ShadowAssetManager.DUPLICATED_ASSETS` with the duplicate mapping;

## Extended Use Cases

Intercepting `AssetManager.open(String): InputStream` opens the door to more than just deduplication -- you can also compress assets to further reduce package size. The idea is straightforward: since `AssetManager.open(String)` returns an `InputStream`, you can substitute it with a `ZipInputStream`. Here's the approach:

1. After *mergeAssets*, ZIP-compress the assets;
1. Intercept `AssetManager.open()` and return a `ZipInputStream` from `ShadowAssetManager.open()`;

The entire process is completely transparent to the app -- seamless.
