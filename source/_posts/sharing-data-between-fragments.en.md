---
title: How to Share Data Between Fragments?
categories:
  - Computer Science
  - Mobile
  - Android
tags:
  - MVVM
  - JetPack
date: 2020-12-05 21:00:00
lang: en
i18n_key: sharing-data-between-fragments
---

In day-to-day feature development, we often encounter the need to share data between `Fragment`s -- for example, passing data from `Fragment A` to `Fragment B`. What approaches can achieve this?

## The Naive Approach

The first thing that comes to mind is adding a field to the `Activity`:

### MainActivity.kt

```kotlin
class MainActivity : FragmentActivity() {

    var sharedData: SharedData? = null

}
```

This way, `Fragment`s can access the shared data through `MainActivity`:

### Fragment1.kt

In `Fragment1`, fetch data from the API, then update it in `MainActivity`:

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

When `Fragment2` is created, retrieve the shared data from `MainActivity` and update the UI:

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

This does solve the data sharing problem, but can you spot the drawbacks?

1. `SharedData` is actually maintained by `Fragment1`. Putting it in `MainActivity` makes the ownership of `SharedData` unclear.

1. If other data needs to be shared between different `Fragment`s, piling everything into `MainActivity` adds unnecessary burden and is outside `MainActivity`'s responsibility.

1. If `Fragment1` is used not only in `MainActivity` but also in other `Activity`s, how do you ensure `Fragment1` can be reused across different `Activity`s without extra maintenance cost?

## The Elegant Approach

The drawbacks of the previous approach boil down to two issues:

1. Responsibility
1. Scalability

The ideal solution should satisfy:

1. `SharedData` should only be maintained by `Fragment1`
1. `MainActivity` should not need any modifications

If we meet these conditions, `Fragment1` would look like this:

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

But this raises a few questions:

1. How can `Fragment2` conveniently get a reference to `SharedData` from `Fragment1`?
1. If `Fragment1` is destroyed, `SharedData` goes with it. How do we bind `SharedData`'s lifecycle to `MainActivity`?

To address these questions, we can use the following approach:

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

This way, `MainActivity` doesn't need any modifications, the `Activity` doesn't care about sharing behavior between `Fragment`s, `Fragment`s become more cohesive, and they can be reused in other `Activity`s at zero cost.

## The Perfect Approach

The elegant approach works, but it requires an extra `LifecycleScope` class, and `LifecycleScope` is a singleton. While it won't cause performance issues, it still feels less than perfect. Is there a better solution?

In fact, *Android* already provides one out of the box -- `ViewModel`. Here's what the implementation looks like using `ViewModel`:

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

Normally, when using `ViewModel` in a `Fragment`, you call the `viewModels()` extension function and create a `ViewModel` delegate via `by`. This delegate is bound to the `Fragment`'s lifecycle. To keep the shared data available even after a `Fragment` is destroyed, you use `activityViewModels()` instead, which binds the `ViewModel` delegate to the `Activity`'s lifecycle.
