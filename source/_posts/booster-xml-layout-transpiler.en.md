---
title: "Booster: The Layout Transpiler"
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-10-30 21:00:00
lang: en
i18n_key: booster-xml-layout-transpiler
---

In the previous article, I introduced the *Layout Transpiler* that Booster was building -- a transpiler that translates XML layout files into *class* files. During implementation, we uncovered all kinds of design pitfalls in the Android system -- massive pitfalls that are nearly impossible to work around. Then Android officially released *JetPack Compose*, and it was exactly the effect I had been trying to achieve, just in a different form.

## The Layout Transpiler

The previous article only sketched the high-level idea of XML-to-class conversion. Many readers said they did not fully understand it, so here I will go deeper into the implementation details.

### Why is building [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) the core of Booster's approach?

Because View constructors require it.

### How does the Android system build [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java)?

At runtime, the [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) passed to `View` constructors is actually a subclass of [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java), such as [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java#91). So Android parses XML and instantiates Views simultaneously at runtime.

### How does Booster build [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java)?

The main steps are:

1. Parse XML at build time using [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java):

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

1. Generate Java code based on the [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java) parsing results:

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

1. Compile the generated Java code into class files.
1. Use a *Transformer* to replace all instructions that access `R.layout.${resId}` in class files.

## The Android Framework Pitfall

The implementation above is nearly perfect. However, we underestimated the Android system's design. In [ResourcesImpl](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/ResourcesImpl.java), there are two places that forcefully cast [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) to [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java). Why would you force-cast an interface to a package-private `final` class? Your guess is as good as mine.

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
            final XmlBlock.Parser parser = (XmlBlock.Parser) set; // <<<=== look here
            mAssets.applyStyle(mTheme, defStyleAttr, defStyleRes, parser, attrs,
                    array.mDataAddress, array.mIndicesAddress);
            array.mTheme = wrapper;
            array.mXml = parser;
            return array;
        }
    }

    static int getAttributeSetSourceResId(@Nullable AttributeSet set) {
        if (set == null || !(set instanceof XmlBlock.Parser)) { // <<<=== look here
            return ID_NULL;
        }
        return ((XmlBlock.Parser) set).getSourceResId(); // <<<=== look here
    }

}
```

You might ask: what exactly is the problem with force-casting [AttributeSet](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/AttributeSet.java) to [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java)?

This goes back to the generated code. Attentive readers may have noticed *AttributeSetImpl*:

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

That is right -- *AttributeSetImpl* is defined by Booster. Here is the rough code:

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

A simplified version of how *Android Framework* natively constructs a `View`:

```java
XmlBlock.Parser parser = new XmlBlock.Parser();
parser.parse(R.layout.main);
...
TextView txt = new TextView(context, parser); // Note: parser is passed as AttributeSet
```

After Booster's optimization, the `View` construction looks like this:

```java
...
AttributeSetImpl attrs = new AttributeSetImpl(...);
TextView txt = new TextView(context, attrs); // Note the difference from native
```

So when *Android Framework* tries to force-cast *AttributeSetImpl* to [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java), it fails. *AttributeSetImpl* is not a subclass of [XmlPullParser](https://android.googlesource.com/platform/libcore/+/master/xml/src/main/java/org/xmlpull/v1/XmlPullParser.java), and it certainly cannot extend a package-private `final` class like [XmlBlock.Parser](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/content/res/XmlBlock.java).

## JetPack Compose

Stuck in the Android Framework pitfall with no way out, I was feeling pretty disheartened -- until *JetPack Compose* caught my eye. Here is the official sample:

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

*JetPack Compose* is similar to *Anko* and *iOS SwiftUI*. Its excellent developer experience comes from two things:

1. Kotlin's powerful syntax
    - Built-in DSL capabilities
    - Extension functions and properties
1. Strong IDE support, enabling WYSIWYG editing

As for how Android Studio achieves WYSIWYG, my educated guess is that it works similarly to the *Layout Lib* described in [Layout: XML vs Code](/2019/07/13/booster-xml-layout-to-code/), except instead of parsing XML it parses Kotlin code or bytecode. The actual implementation would require a closer look at the Android Studio source code.

## Summary

With *JetPack Compose*, the era of describing layouts in XML is coming to an end. Describing layouts directly in code is the future, and with it, the performance problems caused by XML layouts will cease to exist.
