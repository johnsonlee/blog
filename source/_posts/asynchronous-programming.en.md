---
title: Don't Understand Kotlin Coroutines?
categories:
  - Computer Science
  - Kotlin
tags:
  - Kotlin
  - ES5
  - ES6
  - JavaScript
date: 2020-04-01 01:00:00
lang: en
i18n_key: asynchronous-programming
---

I still remember the pre-jQuery era, when I pulled an all-nighter in my college dorm to build a Tree component. It kept me excited for an entire day. From that point on, I felt I'd truly mastered the essence of JavaScript. Years into my career, a project brought me back to JavaScript, and I discovered that Node.js was utterly fascinating -- like an ancient sword unsealed after years of dormancy. Within a week I'd built a front-end plugin framework. Even though this was during the require.js era, require.js still couldn't handle loading plugin modules dynamically in dependency order (because modules contained not just JS but also CSS, JSON, and other resources). So I had no choice but to build my own wheel. (If only webpack had existed back then.)

## Promise vs Callback Hell

The concept of Promise was actually proposed as early as 1976. But it didn't truly gain popularity until [jQuery Deferred Objects](https://api.jquery.com/category/deferred-object/). In 2012, Promise was formalized as a specification and eventually adopted by ES 2015. Why was Promise so popular back then?

Let's look at a simple example first:

```javascript
／**
  * Load resources asynchronously
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
 * Load module asynchronously
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

This is the legendary [Callback Hell](http://callbackhell.com/). Back in the day, even the creator of Node.js couldn't do much about it -- his solution was to change indentation from 4 spaces to 2 (which is why 2-space indentation became so popular in the Node.js world). Now let's see how Promise solves [Callback Hell](http://callbackhell.com/):

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

Refreshing, isn't it? From then on, the JavaScript world was free of that annoying [Callback Hell](http://callbackhell.com/). Seeing how great ES 5's Promise was, Java developers couldn't resist -- why not implement Promise in Java? I tried exactly that back in the day, but without Java 8's lambda, implementing it in Java 7 or earlier was syntactically clunky -- worse than just using Java's native Fork/Join framework. So I gave up. After getting comfortable with Kotlin, its cleaner syntax rekindled my urge to build wheels. One weekend, I built a [Kotlin version of Promise](https://github.com/johnsonlee/promise/tree/demo). The example in [Main.kt](https://github.com/johnsonlee/promise/blob/demo/src/main/kotlin/io/johnsonlee/promise/Main.kt) comes from the [Stargazer](https://github.com/johnsonlee/stargazer/blob/master/src/github/api/v3.js) project (which I used to track [Booster's star trend](https://johnsonlee.github.io/stargazer/#/didi/booster)).

## Generator Function vs Callback Hell

Back when I was writing backends with Node.js, [Express](https://expressjs.com/) was the go-to choice -- couldn't be simpler. But the JavaScript world never runs short on creativity. The author of Express later built a new wheel -- [KOA](https://koajs.com/), claiming to be the "Next generation web framework for node.js." Both are "web framework for node.js," so what's the difference between [KOA](https://koajs.com/) and [Express](https://expressjs.com/)?

This starts with Express. Express has a middleware concept, similar to Java EE's Filter or OkHttp's `Interceptor`, using a [Chain of Responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) pattern to handle requests and responses. In Express, it looks like this:

```javascript
var express = require('express');
var app = express();

/**
 * Add `requestTime` to every request
 */
app.use(function(req, res, next) {
    req.requestTime = new Date();
    next();
});

app.listen(3000);
```

Now look at [KOA](https://koajs.com/)'s black magic:

```javascript
var koa = require('koa');
var app = koa();

app.use(function* (next) {
    this.requestTime = new Date();
    yield next;
});

app.listen(3000);
```

`function*` is the Generator Function introduced in ES 6. [KOA](https://koajs.com/) used it to replace [Express](https://expressjs.com/)'s [Callback Hell](http://callbackhell.com/).

> For API compatibility reasons, Generator Functions and Promises are interconvertible in the JavaScript world

## async/await vs Coroutines

JavaScript's creative spirit goes far beyond this. Although Promise and Generator Functions solved [Callback Hell](http://callbackhell.com/), a new question emerged -- how do you make asynchronous code look synchronous in JavaScript? Enter ES 6's other feature -- async/await. Kotlin developers, does this look familiar? That's right -- it's essentially what Kotlin Coroutines' `suspend` functions do. I've always been suspicious about the naming of "Coroutines," since JavaScript's [Bluebird](http://bluebirdjs.com/) also has a [coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html). How does async/await let you write asynchronous code in a synchronous style? Here's an example:

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

Much cleaner than Promise, right? This is really just ES 6 syntactic sugar. Under the hood, compilers that support ES 6 (such as the TypeScript Compiler) translate async/await into Promise when compiling TypeScript to ES 2015. Now that we understand the JavaScript world's approach to asynchronous programming, let's look at Kotlin Coroutines:

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

After reading this, don't you want to say: "Isn't this just ES 6's async/await!"

## ECMA Script vs Kotlin

Now that we understand asynchronous programming in ES 5, ES 6, and Kotlin, we can draw this conclusion:

| ECMA Script       | Kotlin                                                                                                     |
|-------------------|------------------------------------------------------------------------------------------------------------|
| Promise           | [Flow](https://kotlinlang.org/docs/reference/coroutines/flow.html)                                         |
| Genrator Function | [Sequence](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-sequence-builder/) |
| async/await       | [Suspend Function](https://kotlinlang.org/docs/reference/coroutines/flow.html#suspending-functions)        |

Still think Kotlin Coroutines are hard? Some might ask: all these fancy asynchronous programming patterns -- what are they actually good for?

## Practical Applications of Asynchronous Programming

Mobile developers know this well: once an app reaches a certain level of complexity, it's time for performance optimization. The most common target is startup optimization. During app launch there's simply too much to do -- a pile of SDKs to initialize, a pile of business modules to set up. Someone might say: just defer unnecessary initialization, or run what you can on background threads -- async, right? The idea is correct, but the execution is hard without a good asynchronous programming model. If modules that need initializing during startup have dependency ordering -- some foundational modules (like analytics, networking, A/B testing) must initialize first -- a clean asynchronous programming model frees you from tangled logic so you can focus on business flow. That's exactly why the JavaScript world has produced so many excellent asynchronous programming models.
