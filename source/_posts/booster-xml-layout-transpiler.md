---
title: Booster 布局转译器
date: 2019-10-30 21:00:00
categories: Booster
tags:
  - booster
  - android
  - performance
  - optimization
  - gradle
  - layout
  - transpiler
---

在上一篇文章中已经介绍过 booster 正在做的 *Layout Transpiler* —— 将 XML 布局文件翻译成 *class* 的转译器，在实现的过程中发现了 Android 系统在设计上的各种坑，而且是天坑，几乎是绕不过去了，最近 Android 官方发布了 *JetPack Compose* 让我眼前一亮，这不就是我想要达到的效果么，只不过是换了一种形式罢了。

## 布局转译器

在前面的文章中只是大致提了一下实现 XML 转 class 的思路，很多人看了文章之后反馈说没看懂，所以在这里深入介绍一下实现的细节。

### § Booster 的方案最最核心的部分是构建 [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java)，为什么呢？

因为 View 的构造方法需要它

### § Android 系统是如何构建 [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) 的呢？

Android 在运行时调用 `View` 的构造方法时，传递的 [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) 其实是 [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java) 的子类，如： [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java#91)，所以，Android 在运行时是边解析 XML 边实例化 `View`。

### § Booster 是如何构建 [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) 的呢？

主要有以下几个步骤：

1. 在构建期间通过 [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java) 解析 XML；

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
      xmlns:tools="http://schemas.android.com/tools"
      android:layout_width="match_parent"
      android:layout_height="match_parent"
      tools:context="com.didiglobal.booster.app.MainActivity">

      <TextView
          android:id="@+id/activity_main_greeting"
          android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:text="Hello World!"
          android:layout_constraintBottom_toBottomOf="parent"
          android:layout_constraintLeft_toLeftOf="parent"
          android:layout_constraintRight_toRightOf="parent"
          android:layout_constraintTop_toTopOf="parent" />
  </ConstraintLayout>
  ```

1. 根据 [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java) 的解析结果生成 Java 代码；

  ```java
  public class Layout7f0b0000 {

      public static View inflate(Context context) {
          final List<String> nameList1833697623 = new ArrayList<>();
          nameList1833697623.add("layout_width");
          nameList1833697623.add("layout_height");
          nameList1833697623.add("context");

          final List<String> valueList1833697623 = new ArrayList<>();
          valueList1833697623.add("match_parent");
          valueList1833697623.add("match_parent");
          valueList1833697623.add("context", "com.didiglobal.booster.app.MainActivity");

          final List<Integer> nameResourceList1833697623 = new ArrayList<>();
          nameResourceList1833697623.add(16842996);
          nameResourceList1833697623.add(16842997);
          nameResourceList1833697623.add(0);

          final List<String> namespaceList1833697623 = new ArrayList<>();
          namespaceList1833697623.add("http://schemas.android.com/apk/res/android");
          namespaceList1833697623.add("http://schemas.android.com/apk/res/android");
          namespaceList1833697623.add("http://schemas.android.com/tools");

          final Map<String, Map<String, String>> namespaceValueMap1833697623 = new HashMap<>();
          final Map<String, String> namespaceValueMapItem322693759 = new HashMap<>();
          namespaceValueMapItem322693759.put("layout_width", "match_parent");
          namespaceValueMapItem322693759.put("layout_height", "match_parent");
          namespaceValueMap1833697623.put("http://schemas.android.com/apk/res/android", namespaceValueMapItem322693759);

          final Map<String, String> namespaceValueMapItem1238245197 = new HashMap<>();
          namespaceValueMapItem1238245197.put("context", "com.didiglobal.booster.app.MainActivity");
          namespaceValueMap1833697623.put("http://schemas.android.com/tools", namespaceValueMapItem1238245197);

          final Map<String, Object> resourcesValueMap1833697623 = new HashMap<>();
          final AttributeSet attributeSet1833697623 = new AttrtibuteSetImpl(3, nameList1833697623, valueList1833697623, nameResourceList1833697623, namespaceList1833697623, namespaceValueMap1833697623, resourcesValueMap1833697623);
          final android.support.constraint.ConstraintLayout view1833697623 = new android.support.constraint.ConstraintLayout(context, attributeSet1833697623);
          view1833697623.setVisibility(0);

          final List<String> nameList777448400 = new ArrayList<>();
          nameList777448400.add("layout_width");
          nameList777448400.add("layout_height");
          nameList777448400.add("text");
          nameList777448400.add("layout_constraintBottom_toBottomOf");
          nameList777448400.add("layout_constraintLeft_toLeftOf");
          nameList777448400.add("layout_constraintRight_toRightOf");
          nameList777448400.add("layout_constraintTop_toTopOf");

          final List<String> valueList777448400 = new ArrayList<>();
          valueList777448400.add("wrap_content");
          valueList777448400.add("wrap_content");
          valueList777448400.add("Hello World!");
          valueList777448400.add("parent");
          valueList777448400.add("parent");
          valueList777448400.add("parent");
          valueList777448400.add("parent");

          final List<Integer> nameResourceList777448400 = new ArrayList<>();
          nameResourceList777448400.add(16842996);
          nameResourceList777448400.add(16842997);
          nameResourceList777448400.add(16843087);
          nameResourceList777448400.add(0);
          nameResourceList777448400.add(0);
          nameResourceList777448400.add(0);
          nameResourceList777448400.add(0);

          final List<String> namespaceList777448400 = new ArrayList<>();
          namespaceList777448400.add("http://schemas.android.com/apk/res/android");
          namespaceList777448400.add("http://schemas.android.com/apk/res/android");
          namespaceList777448400.add("http://schemas.android.com/apk/res/android");
          namespaceList777448400.add("http://schemas.android.com/apk/res-auto");
          namespaceList777448400.add("http://schemas.android.com/apk/res-auto");
          namespaceList777448400.add("http://schemas.android.com/apk/res-auto");
          namespaceList777448400.add("http://schemas.android.com/apk/res-auto");

          final Map<String, Map<String, String>> namespaceValueMap777448400 = new HashMap<>();
          final Map<String, String> namespaceValueMapItem1412384463 = new HashMap<>();
          namespaceValueMapItem1412384463.put("layout_width", "wrap_content");
          namespaceValueMapItem1412384463.put("layout_height", "wrap_content");
          namespaceValueMapItem1412384463.put("text", "Hello World!");
          namespaceValueMap777448400.put("http://schemas.android.com/apk/res/android", namespaceValueMapItem1412384463);

          final Map<String, String> namespaceValueMapItem1690180792 = new HashMap<>();
          namespaceValueMapItem1690180792.put("layout_constraintBottom_toBottomOf", "parent");
          namespaceValueMapItem1690180792.put("layout_constraintLeft_toLeftOf", "parent");
          namespaceValueMapItem1690180792.put("layout_constraintRight_toRightOf", "parent");
          namespaceValueMapItem1690180792.put("layout_constraintTop_toTopOf", "parent");
          namespaceValueMap777448400.put("http://schemas.android.com/apk/res-auto", namespaceValueMapItem1690180792);

          final Map<String, Object> resourcesValueMap777448400 = new HashMap<>();
          final AttributeSet attributeSet777448400 = new AttrtibuteSetImpl(7, nameList777448400, valueList777448400, nameResourceList777448400, namespaceList777448400, namespaceValueMap777448400,  resourcesValueMap777448400);
          final android.widget.TextView view777448400 = new android.widget.TextView(context, attributeSet777448400);
          view777448400.setVisibility(0);

          final android.view.ViewGroup.LayoutParams layoutParams944291586 = new android.view.ViewGroup.LayoutParams(-2, -2);
          view1833697623.addView(view777448400, layoutParams944291586);
          return view1833697623;
      }
  }
  ```

1. 将生成的 Java 代码编译成 class；
1. 通过 *Transformer* 替换所有 class 中访问 `R.layout.${resId}` 的指令

## Android Framework 的天坑

上面的实现方案几乎是完美的，然而，我们却低估了 Android 系统的设计，在 [ResourcesImpl](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/ResourcesImpl.java) 中，居然有两处把 [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) 强转成 [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java)，为什么要把一个接口强制转换成一个只有包可见而且还是 `final` 的类呢？我也不知道啊。。。

```java
public class ResourcesImpl {

    TypedArray obtainStyledAttributes(@NonNull Resources.Theme wrapper,
            AttributeSet set,
            @StyleableRes int[] attrs,
            @AttrRes int defStyleAttr,
            @StyleRes int defStyleRes) {
        synchronized (mKey) {
            final int len = attrs.length;
            final TypedArray array = TypedArray.obtain(wrapper.getResources(), len);
            // XXX note that for now we only work with compiled XML files.
            // To support generic XML files we will need to manually parse
            // out the attributes from the XML file (applying type information
            // contained in the resources and such).
            final XmlBlock.Parser parser = (XmlBlock.Parser) set; // <<<=== 看这里
            mAssets.applyStyle(mTheme, defStyleAttr, defStyleRes, parser, attrs,
                    array.mDataAddress, array.mIndicesAddress);
            array.mTheme = wrapper;
            array.mXml = parser;
            return array;
        }
    }

    static int getAttributeSetSourceResId(@Nullable AttributeSet set) {
        if (set == null || !(set instanceof XmlBlock.Parser)) { // <<<=== 看这里
            return ID_NULL;
        }
        return ((XmlBlock.Parser) set).getSourceResId(); // <<<=== 看这里
    }

}
```

可能有人会问了，强制将 [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) 转换成 [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java) 到底是个什么样的坑？

这得从上面生成的代码说起，细心的读者可能发现了 *AttributeSetImpl* 这个类：

```java
final AttributeSet attributeSet777448400 = new AttrtibuteSetImpl(
        7,
        nameList777448400,
        valueList777448400,
        nameResourceList777448400,
        namespaceList777448400,
        namespaceValueMap777448400, 
        resourcesValueMap777448400);
```

没错，*AttributeSetImpl* 就是由 Booster 定义的，大致代码如下：

```java
public class AttributeSetImpl implements AttributeSet {
    
    private final int mAttributeCount;
    private final List<String> mNameList;
    private final List<Integer> mValueList;
    private final List<Integer> mNameResourceList;
    private final List<String> mNamespaceList;
    private final Map<String, Map<String, String>> mNamespaceValueMap;
    private final Map<String, Object> mResourcesValueMap;

    public AttributeSetImpl(
            int attributeCount,
            List<String> nameList,
            List<Integer> valueList,
            List<Integer> nameResourceList,
            List<String> namespaceList,
            Map<String, Map<String, String>> namespaceValueMap,
            Map<String, Object> resourcesValueMap) {
        this.mAttributeCount = attributeCount;
        this.mNameList = nameList;
        this.mValueList = valueList;
        this.mNameResourceList = nameResourceList;
        this.mNamespaceList = namespaceList;
        this.mNamespaceValueMap = namespaceValueMap;
        this.mResourcesValueMap = resourcesValueMap;
    }

    // ...

}
```

把 *Android Framework* 原生构造 `View` 的过程简化一下：

```java
XmlBlock.Parser parser = new XmlBlock.Parser();
parser.parse(R.layout.main);
...
TextView txt = new TextView(context, parser); // 注意这里，parser 作为 AttributSet 传递
```

那么经过 Booster 优化后，构造 `View` 的过程则是这样的：

```java
...
AttributeSetImpl attrs = new AttributeSetImpl(...);
TextView txt = new TextView(context, attrs); // 注意这里，跟原生的区别
```

所以，*Android Framework* 要强制将 *AttributeSetImpl* 转换成 [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java) 是转不成功的，因为 *AttributeSetImpl* 本身就不会是 [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java) 的子类，更不可能继承 Framework 中只有包可见而且还是 `final` 的 [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java)。

## JetPack Compose

掉到了 *Android Framework* 的天坑里一直没爬出来，正在我心灰意冷的时候， *JetPack Compose* 让我眼前一亮，以下是官方的示例。

```kotlin
class MainActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      Greeting("Android")
    }
  }
}

@Composable
fun Greeting(name: String) {
    Text (text = "Hello $name!")
}
```

*JetPack Compose* 跟 *Anko* 以及 *iOS SwiftUI* 有点类似，之所以 *JetPack Compose* 的体验如此之好主要得益于两点：

1. Kotlin 强大的语法
    - 与生俱来的 DSL
    - 扩展方法和属性
1. IDE 强力支持，能够做到所见即所得

至于 Android Studio 是如何做到所见即所得，我大胆推测一下，应该跟 [布局：XML vs 代码](/2019/07/13/booster-xml-layout-to-code/) 这篇文章提到的 *Layout Lib* 原理类似，只不过由原来解析 XML 变成了解析 Kotlin 代码或者字节码，至于实际的实现，还得细细研究一下 Android Studio 的源码。

## 总结

所以，有了 *JetPack Compose* ，通过 XML 描述布局的时代即将成为历史，而用代码直接描述布局才是未来，这样，因为 XML 而导致的性能问题也就不复存在了。

