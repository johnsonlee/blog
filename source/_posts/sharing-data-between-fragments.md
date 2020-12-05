---
title: 如何在Fragment之间共享数据?
date: 2020-12-05 21:00:00
categories: Android
tags:
  - MVVM
  - JetPack
---

在日常的需求迭代中，我们经常会遇到 `Fragment` 之间共享数据的需求，比如 `Fragment A` 的数据需要给 `Fragment B` ，有什么样的方案可以实现呢？

## 普通的解决方案

对于这个问题，一般很容易想到在 `Activity` 中加一个字段来解决，比如：

### MainActivity.kt

```kotlin
class MainActivity : FragmentActivity() {

    var sharedData: SharedData? = null

}
```

这样就可以在 `Fragment` 中通过 `MainActivity` 来拿到共享的数据了，例如：

### Fragment1.kt

在 `Fragment1` 中，从 *API* 获取数据，然后，更新到 `MainActivity` 中：

```kotlin
class Fragment1 : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val activity = (requireActivity() as? MainActivity)
        // ...
        findViewById(R.id.button).onClickListener {
            fetchSharedData() {
                activity?.sharedData = it
            }
        }
    }

}
```

### Fragment2.kt

在创建 `Fragment2` 时，从 `MainActivity` 中获取由 `Fragment1` 共享的数据，然后更新 *UI* ，例如：

```kotlin
class Fragment2 : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        val sharedData = (requireActivity() as? MainActivity)?.sharedData
        updateUI(sharedData)       
    }

}
```

这样确实能解决数据共享问题，但是，大家有没有发现这个方案的弊端？

1. `SharedData` 其实是由 `Fragment1` 来维护的，如果把 `SharedData` 放到 `MainActivity` 里，就会导致维护 `SharedData` 的职责不清晰；

1. 如果还有别的数据需要在其它的 `Fragment` 之间共享，都往 `MainActivity` 里加的话，无疑给 `MainActivity` 带来了过多的不必要的负担，而且，这也不是 `MainActiivty` 的职责所在；

1. 如果 `Fragment1` 不仅在 `MainActivity` 里用到，而且还在其它的 `Activity` 用到，那如何将 `Fragment1` 在不同的 `Activity` 复用而又增加因为复用给 `Activity` 带来额外的维护成本？

## 优雅的解决方案

对于前面的方案的弊端，主要在于两个方面：

1. 职责范围 - Responsibility
1. 可扩展性 - Scalability

对于上面的需求，理想的方案应该是：

1. `SharedData` 只应由 `Fragment1` 维护
1. 不需要修改 `MainActivity`

如果要满足上面的条件的话，`Fragment1` 大概是长这样：

```kotlin
class Fragment1 : Fragment() {

    var sharedData: SharedData? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        findViewById(R.id.button).onClickListener {
            fetchSharedData() {
                sharedData = it
            }
        }
    }

}
```

但如果是这样的话，会有几个问题：

1. `Fragment2` 如何方便的从 `Fragment1` 拿到 `SharedData` 的引用呢？
1. 如果 `Fragment1` 被销毁了，那 `SharedData` 也就拿不到了，如何让 `SharedData` 跟 `MainActivity` 的生命周期绑定呢？

针对上面的问题，我们可以采用下面的方案：

### LifecycleScope.kt

```kotlin
object LifecycleScope : LifecycleObserver {

    internal val shared: MutableMap<LifecycleOwner, MutableMap<Any, Any>> = mutableMapOf()

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun onDestroy(source: LifecycleOwner) {
        source.lifecycle.removeObserver(this)
        shared.remove(source)
    }

}

fun <K : Any, V : Any> LifecycleOwner.getShared(key: K): V? {
    return LifecycleScope.shared[this]?.get(key) as? V
}

fun <K : Any, V : Any> LifecycleOwner.putShared(key: K, value: V) {
    LifecycleScope.shared.getOrPut(this) {
        lifecycle.addObserver(LifecycleScope)
        mutableMapOf()
    }[key] = value
}
```

### Fragment1.kt

```kotlin
class Fragment1 : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        findViewById(R.id.button).onClickListener {
            fetchSharedData() {
                requireActivity().putShared(SharedData::class.java, it)
            }
        }
    }

}
```

### Fragment2.kt

```kotlin
class Fragment2 : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        val sharedData: SharedData? = requireActivity().getShared(SharedData::class.java)
        updateUI(sharedData)       
    }

}
```

这样，既不用修改 `MainActivity`，`Activity` 也完全不关心 `Fragment` 之间的共享行为，这样 `Fragment` 变得更内聚，而且在其它 `Activity` 中无成本复用 `Fragment`。

## 完美的解决方案

上面的方案虽然优雅，但需要额外的增加 `LifecycleScope` 这个类，而且，`LifecycleScope` 是一个单例，虽然性能上不会有太大问题，但总是感觉不够完美，那有没有更完美的解决方案呢？

其实 *Android* 官方已经提供了现成的方案 —— `ViewModel`，如果采用 `ViewModel` 来实现上面的需求，应该长啥样呢？

### SharedViewModel.kt

```kotlin
class SharedViewModel : ViewModel() {
}
```

### Fragment1.kt

```kotlin
class Fragment1 : Fragment() {

    private val sharedViewModel: SharedViewModel by activityViewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        findViewById(R.id.button).onClickListener {
            fetchSharedData() {
                sharedViewModel.sharedData = it
            }
        }
    }

}
```

### Fragment2.kt

```kotlin
class Fragment2 : Fragment() {

    private val sharedViewModel: SharedViewModel by activityViewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        updateUI(sharedViewModel.sharedData)       
    }

}
```

一般情况下，在 `Fragment` 中使用 `ViewModel` 都是调用 `viewModels()` 这个扩展方法，并通过 `by` 来创建一个 `ViewModel` 的 *Delegate* ，然后这个 `ViewModel` 的 *Delegate* 是跟 `Fragment` 的生命周期绑定的，如果要在 `Fragment` 销毁后依赖能共享给其它的 `Fragment` 就需要调用 `activityViewModels()` 来将 `ViewModel` 的 *Delegate* 跟 `Activity` 的生命周期绑定。
