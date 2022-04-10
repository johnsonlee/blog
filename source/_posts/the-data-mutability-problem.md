---
title: 关于数据的（不）可变性问题
date: 2022-04-11 00:00:00
categories: 架构设计
tags:
  - Android
  - Java
  - Kotlin
---

关于数据的可变性或者不可变性，是指数据在被创建后，到底支不支持可变（修改），尽管我们知道 *Java* 中的 *String* 采用不可变的设计有诸多的优点，但似乎在我过去的职业生涯中，很少系统性地去思考这个问题，直到最近，看其他同学的代码的时候，才意识到这个问题的严重性。

## 编程习惯

### `final` 关键字

屈指一算，我从事编程工作已有十年有余，写过的代码中，*Java* 占了绝大部分，看过我写的代码的同学可能会发现一个现象，就是我喜欢在变量前面加 `final`，为什么会养成这样的习惯呢？

这个习惯很早就养成了，记得当年不光写 *Java* ，也会写 *C/C++* ，尤其是对于 *C* 代码来说，在 *Java* 中一个很简单的操作，在 *C* 中都需要数行甚到数十行代码来实现，而且早期的 *C* 编译器对于变量的声明的位置有一定的要求，不像 *Java* 随用随声明，而是尽可能的在函数的开头声明变量，这样导致的问题是，在代码很长的情况下，不知道变量在什么时候会被修改，很有可能会因为手抖而误改，所以，写起代码来要尤为小心，尽可能的让变量的修改操作更集中。所以，在写 *Java* 的过程中，为了避免非预期的对变量的修改，便自然而然的养成了在变量前加 `final` 的习惯，这样一写就是好多年，当时，我也只是觉得这样写有两个好处：

1. 防止手误
1. 闭包用起来更自然

### `Collections.unmodifiableXxxx`

我在 review 代码的时候，经常会看到这样的写法：

```java
class Registry {
  final Map<String, List<Class<*>>> mapping = ...

  public List<Class<*>> getValue(String key) {
    return this.mapping.get(key);
  }
}
```

乍一看也没什么毛病，但如果这样写呢？

```java
public void wtf(Registry registry) {
  registry.get("key").put("wtf", Wtf.class)
}
```

所以，为了避免内部的数据被外部修改，我一般会这样写：

```java
public List<Class<*>> getValue(String key) {
  return Collections.unmodifiableList(this.mapping.get(key));
}
```

### 数据快照

还有一个习惯是在阅读了 *Swing* 的源代码后养成的 —— *Observer* 模式中通知 *Listener* ，大部分人都是这样写的：

```java
void notifyListeners() {
  for (Listener listener : this.listeners) {
    listener.onStateChange();
  }
}
```

乍一看貌似也没什么毛病啊，嗯，一般情况下没有什么毛病，但在多线程的环境中，就可能会有问题，所以，我一般会这样写：

```java
void notifyListeners() {
  final Listener[] listeners = this.listeners.toArray(new Listener[0]);
  for (Listener listener : listeners) {
    listener.onStateChange();
  }
}
```

## 函数式编程语言

说起函数式编程语言，[Haskell](https://www.haskell.org/) 算是老祖宗了，在 [Haskell](https://www.haskell.org/) 的世界里，数据都是不可变的，如果要修改，就只能 *copy* ，可能很多人无法理解为什么 [Haskell](https://www.haskell.org/) 要这样设计，每次修改都要 *copy* 不会影响性能么？如果用过 *Java* 的闭包或者 *Lambda* ，我想大家都深有体会，在闭包或者 *Lambda* 中引用的局部变量必须是 `final` 的，为什么呢？

我想写过 *JavaScript* 的同学肯定都有过类似于下面的经历：

```js
function setupButtons(container) {
  for (var i = 1; i <= 10; i++) {
    const btn = document.createElement("A");
    btn.href = "javascript:void(0)";
    btn.innerText = `${i}`;
    btn.onclick = function() {
      alert(`Button ${i}`);
    }
    container.appendChild(btn)
  }
}
```

上面这段代码的本意是创建 *10* 个 `<A>` 标签作为按钮，当点击到任意一个按钮时，弹出对话框显示该按钮对应的索引，乍一看没啥毛病，但一运行，发现并不是我们所期望的，实际的情况是 —— 所有按钮弹窗显示的都是 `11`。

> What The Fuck!!??

这个问题的根本原因就在于 `btn.onclick` 对应的 `function` 存在闭包，而 *JavaScript* 中以闭包引用的变量并没有像 *Java* 那样要求必须是 `final`，而 `onclick` 方法中引用的变量 `i` 在循环执行完之后就变成了 `11`，所以，上面的例子实际执行的结果就是 `11`，而不是其对应的索引，为了解决这一问题，一般会这样写：

```js
function setupButtons(container) {
  for (var i = 1; i <= 10; i++) {
    (function(index) {
      const btn = document.createElement("A");
      btn.href = "javascript:void(0)";
      btn.innerText = `${index}`;
      btn.onclick = function() {
        alert(`Button ${index}`);
      }
      container.appendChild(btn)
    })(i);
  }
}
```

随着函数式编程语言的兴起，为了避免类似上面的问题，不可变对象已经成为了首选，像 *Kotlin* 中的方法参数默认就是 `final` 的，不可变集合和可变集合的明确区分，还有 [Data Class](https://kotlinlang.org/docs/data-classes.html) 不允许继承。

## MVVM

在 MVVM 架构中，一般对于 *Data Model* 是推荐用不可变对象，由于并不是强制性的，也就导致了开发者对于架构的理解不一致而出现 *Data Model* 滥用的现象，比如，有的地方用「不可变对象」，而有的地方又是「可变对象」，可能有人会觉得，「可变对象」没什么不好啊？

对于简单的业务逻辑，对象可不可变可能没那么重要，但是，一旦业务逻辑变得复杂，同一份数据存在多个消费方的时候，如果这时候因为「不小心」或者「其它非预期的原因」修改了 *Data Model* 而不是通过 `LiveData` 或者 `StateFlow` 来修改对象，这便会导致一系列的问题：

1. *Data Model* 的修改不可观测
1. 数据流与控制流混乱，代码复杂度急剧增加

因为错综复杂的关系，以至于各种奇怪的 *bug* 满天飞，因为 *Data Model* 是可变的，那我们任何的调用都必须假设有地方会修改它，这就让架构的设计和开发变得更为复杂，试想一下，如果默认就是不可变的话，我们无须考虑多线程访问的情况，但如果是可变的，我们必须小心的处理任何有可能多线程访问的情况，这对于开发者无疑也是一种心理负担，要考虑的情况和场景太多太复杂了，就像前面提到的我的那些编程习惯，都是一个坑一个坑踩出来的，如果能够从根源上避免这些问题，那我们的开发将会变得更简单。

## Immutable 真的香吗？

前面说了那么多 *Immutable Object* 的好处，可能有人会问，*Immutable* 就真的那么香吗？关于这个问题，我们下期再聊～😝
