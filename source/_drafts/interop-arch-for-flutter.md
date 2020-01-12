---
title: Flutter 混合开发架构
categories: 架构设计
tags: flutter
---

自 2019 年的 GDD 之后，Flutter 成为了移动端的一颗耀眼的新星，由于其独特的设计，在性能和开发体验上远超 *React Native* 、*Weex* 等一些跨端开发框架，然而，从现有的原生技术栈切到 Flutter 是有一定的成本的，所以，不太可能推翻原有的原生架构，都会先拿非核心业务来试试水。

当 Flutter 与原生技术栈一起混合开发时，跨语言通信是一个大问题，由于 Flutter 采用的是 Dart 语言（2013 年我在 *SAMSUNG* 做 *Cloud IDE* 技术方案调研时发现了它），这门语言最开始是为 Web 而设计的，最初的目标是为了替代 *JavaScript* ，当时也没看上它，后来，经过几年的发展，集成了 *Java* 、*JavaScript* 等一些比较流行的语言的特点，但是，在语言间的互操作性上一直是硬伤。

为了解决跨语言调用的问题，Dart 提供了 FFI (Foreign Function Interface) 支持，允许 Dart 直接调用 C/C++ API，然后提供 Native Extension 支持，允许 C/C++ 直接调用 Dart API。

移动端两大平台中，iOS 的开发语言 Objective-C 本身就是 C 的超集，自然可以很好的实现语言间的通信问题，但是 Android 的开发语言是 Java / Kotlin，要实现 Dart - Java 之间的通讯，得走一些弯路。


## 混合架构方案

### Proxy 模式

为什么会选择 *Proxy* 模式呢？原因有二：

1. 跨语言调用需要有一个公共的规范来约束双方的语言，从开发体验上来看，最好的就是 API
2. 调用的细节没必要对开发者公开

而 *Proxy* 模式正在符合这些特点。

### API Stub

前面提到，API 就是最好的语言规范约束，那怎样才能既满足功能需求的同时，又满足开发者体验需求呢？答案是：APT (Annotation Processing Tool)

以 Java 调 Dart 为例，首先需要 Dart 提供一份 Java 的 API 让 Java 来调，那么，可以通过 APT 来根据 Dart 的代码来生成一份 API Stub：

*Greeting.dart*

```dart
@Interoperable
class Greeting {

    @Interop
    void sayHello() {
        pint("Hello!");
    }

}
```

生成的代码如下：

*Greeting.java*

```java
interface Greeting {

    void sayHello();

    public static class Stub extends Interoperator implements Greeting {

        public void sayHello() {
            super.invoke("sayHello")
        }

    }

}
```

在 Java 代码中就可以这样调用了：

```java
class GreetingDemo {

    public void sayHello() {
        new Greeting.Stub().sayHello();
    }

}
```

反过来，Dart 调 Java 也是同样的原理。

### 基于 Platform Channels 的实现

TBD

### 基于 FFI & Native Extension 的实现

TBD
