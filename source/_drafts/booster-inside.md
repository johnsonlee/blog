---
title: 深入理解 Booster
categories:
  - Computer Science
  - Architecture Design
---

```plantuml
@startuml
skinparam rectangle<<behavior>> {
    roundCorner 25
}
rectangle generateSources    #ffbcbc
rectangle generateResources  #ffbcbc
rectangle generateAssets     #ffbcbc
rectangle mergeResources
rectangle mergeAssets
rectangle processResources
rectangle compileSources     #ffbcbc
rectangle transform          #b7efcd
rectangle mergeDex
rectangle package
rectangle assemble

generateSources   -d-> compileSources : "  *.java"
generateResources -d-> mergeResources
generateAssets    -d-> mergeAssets
mergeResources    -d-> processResources
processResources  -d-> compileSources
compileSources    -d-> transform : "  *.class"
transform         -d-> mergeDex : "  *.class"
transform         -d-> package : "  *.so"
mergeAssets       -d-> package : "  assets/*"
processResources  -d-> package : "  resources-{variant}.ap_"
mergeDex          -d-> package : "  classes{N}.dex"
compileSources    -d-> assemble
transform         ...> assemble
package           -d-> assemble
@enduml
```



```plantuml
@startuml
rectangle mergeRes #b7efcd 
rectangle compressResourcesWithCwebp as "compress{Variant}ResourcesWithCwebp" #ffbcbc 
rectangle compressResourcesWithPngquant as "compress{Variant}ResourcesWithPngquant" #ffbcbc 
rectangle processRes #f2ed6f 

mergeRes -d-> compressResourcesWithCwebp
compressResourcesWithCwebp -d-> compressResourcesWithPngquant
compressResourcesWithPngquant -d-> processRes
@enduml
```

```plantuml
@startuml
rectangle mergeRes #b7efcd 
rectangle compressResourcesWithCwebp as "compress{Variant}ResourcesWithCwebp" #ffbcbc 
rectangle processRes #f2ed6f 

mergeRes -d-> compressResourcesWithCwebp
compressResourcesWithCwebp -d-> processRes
@enduml
```

```plantuml
abstract class CompressImages extends DefaultTask {
    + tool: CompressionTool;
    + variant: BaseVariant;
    + options: CompressionOptions;
    + results: CompressionResults;
    + supplier: Supplier<Collection<File>>;

}

abstract class AbstractCwebpCompressImages extends CompressImages {
    # {abstract} compress(filter: (File) -> Boolean): void
    + run(): void
}

class CwebpCompressImages extends AbstractCwebpCompressImages {
    # compress(filter: (File) -> Boolean): void
}

class CwebpCompressOpaqueImages extends CwebpCompressImages {
    # compress(filter: (File) -> Boolean): void
}

class CwebpCompressFlatImages extends AbstractCwebpCompressImages {
    # compress(filter: (File) -> Boolean): void
}

class CwebpCompressOpaqueFlatImages extends CwebpCompressFlatImages {
    # compress(filter: (File) -> Boolean): void
}
```

```plantuml
@startuml
rectangle mergeRes #b7efcd 
rectangle compressResourcesWithPngquant as "compress{Variant}ResourcesWithPngquant" #ffbcbc 
rectangle processRes #f2ed6f 

mergeRes -d-> compressResourcesWithPngquant
compressResourcesWithPngquant -d-> processRes
@enduml
```


```plantuml
abstract class CompressImages extends DefaultTask {
    + tool: CompressionTool;
    + variant: BaseVariant;
    + options: CompressionOptions;
    + results: CompressionResults;
    + supplier: Supplier<Collection<File>>;

}

abstract class AbstractPngquantCompressImages extends CompressImages {
    # {abstract} compress(): void
    + run(): void
}

class PngquantCompressImages extends AbstractPngquantCompressImages {
    # compress(): void
}

class PngquantCompressFlatImages extends AbstractPngquantCompressImages {
    # compress(): void
}
```

```plantuml
hide footbox
activate LayoutInflator
LayoutInflator -> WebView **
LayoutInflator -> WebView ++ : <init>(...)
WebView -> WebViewChromium **
WebView -> WebViewChromium ++ : init(...)
WebViewChromium -> WebViewChromiumFactoryProvider **
WebViewChromium -> WebViewChromiumFactoryProvider ++ : startYourEngines(boolean)
WebViewChromiumFactoryProvider -> WebViewChromiumAwInit **
WebViewChromiumFactoryProvider -> WebViewChromiumAwInit ++ : startYourEngines(boolean)
WebViewChromiumAwInit -> WebViewChromiumAwInit : ensureChromiumStartedLocked
return
return
return
return
```



```plantuml
hide footbox
== onCreate ==
AMS -> ActivityThread ++ : onCreate()
ActivityThread -> MainActivity++ : onCreate()
MainActivity -> Context ++ : getSharedPreferences()
return SharedPreferences
|||

MainActivity -> SharedPreferences ++ : edit()
return SharedPreferences.Editor

......


MainActivity -> SharedPreferences.Editor ++ : apply()
SharedPreferences.Editor -> SharedPreferencesImpl.EditorImpl ++ : apply()
SharedPreferencesImpl.EditorImpl -> QueuedWork : add(Runnable)
return
return
return
return
......

== onPause ==

AMS -> ActivityThread ++ : onPause()
ActivityThread -> MainActivity : onPause()
ActivityThread -> QueuedWork : waitToFinish()
return

```

