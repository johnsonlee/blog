---
title: 不懂 Kotlin Coroutines ？
date: 2020-04-01 00:00:00
categories: 架构设计
tags:
  - ES5
  - ES6
  - JavaScript
  - Kotlin
---

还记得在 *jQuery* 还没有诞生的年代，我在大学宿舍用一个通宵撸出了 *Tree* 组件，足足令我兴奋了一整天，自此之后，感觉自己已经深得 *JavaScript* 之精髓，工作多年后，因为项目的缘故，又重拾 *JavaScript* 发现 *Node.js* 竟然如此让人着迷，就好像一把尘封了多年的利剑再现峰芒，一周的时间便撸了一个前端插件化框架，尽管是在 *require.js* 流行的年代，但 *require.js* 依然无法解决按依赖顺序动态加载插件模块的问题（因为模块中不仅仅只有 *js* 代码，还有 *css* ，*json* 等资源），没办法，只好自己动手造轮子了（要是那时候有 *webpack* 该多好啊）。

## Promise vs Callback Hell

其实早在 1976 年，*Promise* 的概念就已被提出来，然而，它真正的流行起来还是因为 [jQuery Deferred Objects](https://api.jquery.com/category/deferred-object/)，在 2012 年的时候，*Promise* 被作为规范提了出来，最终被 *ES 2015* 所采纳，为什么当年 *Promise* 会如此流行呢？

咱们还是先看看下面这个简单的例子：

```javascript
／**
  * 异步加载资源
  *／
function loadResources(res, callback) {
    xhr.get(res, function(e, resp) {
        if (e) {
            callback(e);
        } else {
            callback(resp.responseText);
        }
    })
}

/**
 * 异步加载模块
 */
function loadModule(name, callback) {
    loadResources(name + "/manifest.json", function(manifest) {
        var style = manifest.getStyle();
        var script = manifest.getScript();
        var layout = manifest.getLayout();

        loadResources(layout, function() {
            loadResources(script, function() {
                loadResources(style, function() {
                    'function' === typeof callback && callback();
                });
            });
        });
    });
}
```

这就是传说中的 [Callback Hell](http://callbackhell.com/)，当年 *Node.js* 之父也拿它没办法，只好将代码缩进由 4 个空格变成 2 个空格（这就是为什么 *Node.js* 的世界很流行 2 个空格缩进的原因），咱们再来看看 *Promise* 是如何解决 [Callback Hell](http://callbackhell.com/) 的：

```javascript
function loadResources(res) {
    return new Promise(function(resolve, reject) {
        xhr.get(res, function(e, resp) {
            if (e) {
                reject(e);
            } else {
                resolve(resp.responseText);
            }
        });
    });
}

function loadModule(name) {
    return loadResources(name + "/manifest.json").then(function(manifest) {
        return Promise.all(manifest.getStyle(), manifest.getScript(), manifest.getLayout());
    });
}
```

怎么样？是不是有种耳目一新的感觉？从此，*JavaScript* 的世界里再也没有那烦人的 [Callback Hell](http://callbackhell.com/) 了，看到 *ES 5* 的 *Promise* 这么好用，*Java* 世界的同学就按耐不住了，为何不把 *Promise* 用 *Java* 实现呢？我当年就这么干过，只不过呢那时候还没有 *Java 8* 的 *lambda* ，如果用 *Java 7* 或者更早的版本来实现，语法表达上更是蹩脚，还不如用 *Java* 原生的 *Fork/Join* 框架呢，所以，干脆放弃了。自从玩转了 *Kotlin* ，加上 *Kotlin* 比 *Java* 语法更简洁，又激发了造轮子的欲望，于是，周末的时候，撸了一个 [Kotlin 版的 Promise](https://github.com/johnsonlee/promise/tree/demo)，[Main.kt](https://github.com/johnsonlee/promise/blob/demo/src/main/kotlin/io/johnsonlee/promise/Main.kt) 中的例子来自 [Stargazer](https://github.com/johnsonlee/stargazer/blob/master/src/github/api/v3.js) 这个项目（当时用来监测 [Booster star 趋势](https://johnsonlee.github.io/stargazer/#/didi/booster)）。

## Generator Function vs Callback Hell

在当年用 *Node.js* 写后端，[Express](https://expressjs.com/) 是首选，简直是不要太简单，然而 *JavaScript* 的世界总是不乏创造力，[Express](https://expressjs.com/) 的作者后来又造了一个新的轮子 —— [KOA](https://koajs.com/)，并号称是 "Next generation web framework for node.js"，同样的是 "web framework for node.js"，[KOA](https://koajs.com/) 跟 [Express](https://expressjs.com/) 到底有什么区别呢？

这还得从 *Express* 说起，*Express* 中有一个 *middleware* 的概念，有点类似 *Java EE* 中的 *Filter* 或者 *OkHttp* 中的 `Interceptor`，采用 [Chain of Responsibility（责任链）](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) 的方式处理请求和响应，在 *Express* 中是这样使用的：

```javascript
var express = require('express');
var app = express();

/**
 * 为每个请求加上 `requestTime`
 */
app.use(function(req, res, next) {
    req.requestTime = new Date();
    next();
});

app.listen(3000);
```

再来看看 [KOA](https://koajs.com/) 的黑魔法：

```javascript
var koa = require('koa');
var app = koa();

app.use(function* (next) {
    this.requestTime = new Date();
    yield next;
});

app.listen(3000);
```

`function*` 就是 *ES 6* 推出的 *Generator Function* ，[KOA](https://koajs.com/) 用它替代了 [Express](https://expressjs.com/) 中的 [Callback Hell](http://callbackhell.com/)。

> 考虑到 API 兼容性问题，在 *JavaScript* 的世界里，*Generator Function* 是可以和 *Promise* 互转的

## async/await vs Coroutines

*JavaScript* 的创造精神远不止于此，虽然 *Promise* ，*Generator Function* 解决了 [Callback Hell](http://callbackhell.com/) 的问题，但是新的问题来了 —— 如何在 *JavaScript* 的世界里让异步变成同步呢？—— 这就是 *ES 6* 的另一个特性 —— *async/await* ，看到这里，*Kotlin* 世界的同学是不是有种似曾相识的感觉？—— 没错，就是 *Kotlin Coroutines* 推出的 *suspend* 方法，我对 *Coroutines* 这个命名的来历深表怀疑，因为 *JavaScript* 界的 [Bluebird](http://bluebirdjs.com/) 也有 [coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html)，*async/await* 是如何让大家用同步编程的方式实现异步执行的呢？请看下面的例子：

```javascript
async function loadResources(res) {
    let resp = await fetch(res);
    return await rsponse.json();
}

async function loadModule(name) {
    let manifest = loadResources(name + "/manifest.json")
    await loadResources(manifest.getStyle());
    await loadResources(manifest.getScript());
    await loadResources(manifest.getLayout());
}
```

看起来是不是比 *Promise* 清爽了许多？其实这只是 *ES 6* 语法糖而已，实际上支持 *ES 6* 的编译器（比如：TypeScript Compiler）将 *TypeScript* 编译成 *ES 2015* 时，会将 *async/await* 翻译成 *Promise* 。了解了 *JavaScript* 世界的异步编程方式，再来看 *Kotlin Coroutines* ：

```kotlin
class DownloadAsyncActivity : AppCompatActivity() {

    private suspend fun downloadDataAsync(url): String {
        return suspendCoroutine { cont ->
            val client = OkHttpClient()
            val request = Request.Builder()
                    .url(url)
                    .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    cont.resumeWithException(e)
                }
                override fun onResponse(call: Call, response: Response) {
                    cont.resume(response.body()?.string() ?: "")
                }
            })
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        val textView = findViewById(R.id.text_view)
        val btnDownload = findViewById(R.id.btn_download)

        btnDownload.setOnClickListener {
            launch(UI) {
                textView.text = downloadDataAsync()
            }
        }
    }

}
```

看完是不是想说？这不就是 *ES 6* 的 *async/await* 嘛！

## ECMA Script vs Kotlin

了解了 *ES 5* , *ES 6* 和 *Kotlin* 的异步编程，基本上可以得出这样的结论：

| ECMA Script       | Kotlin                                                                                                     |
|-------------------|------------------------------------------------------------------------------------------------------------|
| Promise           | [Flow](https://kotlinlang.org/docs/reference/coroutines/flow.html)                                         |
| Genrator Function | [Sequence](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-sequence-builder/) |
| async/await       | [Suspend Function](https://kotlinlang.org/docs/reference/coroutines/flow.html#suspending-functions)        |

看到这里，大家还会觉得 *Kotlin Coroutines* 很难吗？可能有人会问，异步编程搞得这么花哨，到底能干什么呢？

## 异步编程的应用

做移动端开发的同学可能深有体会，每当 *App* 工程复杂度达到一定水平时，就要搞一次性能优化，常见的就是 *启动优化* ，因为 *App* 启动阶段，要干的事情太多了，一堆的 *SDK* 要初始化，一堆的业务要初始化，有人会说，把不必要的初始化延后，或者能在子线程初始化的，异步不就行了吗？—— 思路是对的，但是，实现起来是困难的，因为没有一个很好用的异步编程模型，如果在启动阶段，要初始化的模块之间还有依赖顺序，比如有些基础模块就最先初始化（如：埋点、网络、A/B 等），这时候，一个简洁的异步编程模型就能让我们从繁琐的逻辑中释放出来，将注意力集中在业务流程上来，这也是为什么 *JavaScript* 的世界创造了如此多优秀的异步编程模型的原因。
