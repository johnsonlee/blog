---
title: 如何编写优雅的代码
date: 2021-05-06 00:00:00
categories: 架构师训练营
tags:
  - Android
  - Java
---

最近 review 了几个同学的代码，总的来说，逻辑上没什么大毛病，但是，写出来的代码感觉还不够优雅，一个很简单的逻辑还要绕来绕去，对于架构师来说，并不是设计出来的架构越复杂越难懂才越牛逼，真正优秀的架构师的设计通常都是非常通俗易懂的，正所谓大道至简，设计出一个复杂的架构来解决一个复杂的问题并不是最牛的，而能够把一个复杂的问题用一个简单的架构来解决的才是真正的大牛，对于 coding 也是同样的道理，那究竟什么样的代码才算是优雅的呢？

## 代码复杂度

代码优不优雅，并不只是主观上的感受，是可以通过科学的手段来测量的，一般我们采用循环复杂度 (Cyclomatic Complexity) ，这一概念由 [Thomas J. McCabe, Sr.](https://en.wikipedia.org/w/index.php?title=Thomas_J._McCabe,_Sr.) 在 1976 年提出。循环复杂度根据程序的控制流图 (control-flow graph) 来计算，一个程序的循环复杂度等于其线性独立路径的数量，说人话就是：代码里条件/分支（`for`, `if-else`, `try-catch`, `&&`, `||`, ...）越多，代码越复杂，一个程序的复杂度可以用下面的公式来定义：

```
M = E - N + 2P
```

- `M` - 复杂度
- `E` - 控制流图中的边 (Edge) 的个数
- `N` - 控制流图中的节点 (Node) 的个数
- `P` - 

> 参考：https://en.wikipedia.org/wiki/Cyclomatic_complexity

将上面的公式进行简化后，再翻译成代码就是：

```kotlin
class CyclomaticComplexityVisitor : ASTVisitor {

    var cyclomatic = 1

    override fun visit(node: CatchClause) {
        cyclomatic++
    }

    override fun visit(node: ConditionalExpression) {
        cyclomatic++
    }

    override fun visit(node: InfixExpression) {
        cyclomatic++ 
    }

    override fun visit(node: DoStatement) {
        cyclomatic++
    }

    override fun visit(node: ForStatement) {
        cyclomatic++
    }

    override fun visit(node: IfStatement) {
        cyclomatic++
    }

    override fun visit(node: SwitchCase) {
        cyclomatic++
    }

    override fun visit(node: WhileStatement) {
        cyclomatic++
    }

    override fun visit(node: WhileStatement) {
        cyclomatic++
    }
}
```

> 详细代码请参考：[CyclomaticComplexityVisitor](https://github.com/johnsonlee/architecture-evaluation-tool/blob/master/de.cau.cs.se.software.evaluation/src/de/cau/cs/se/software/evaluation/transformation/CyclomaticComplexityVisitor.xtend)

## 语言特性

如何有效的降低代码复杂度呢？其中最重要的一点就是 —— 尽可能的使用语言自身的特性来简化代码，要写得一手好码，就得掌握一门编程语言，像 Java 这门语言，从 *JDK 1.0* 到 *Java 17* 几乎每个大版本都有增加新的特性。写 *Kotlin* 也是同样的道理，相比之下，*Kotlin* 更容易写出简洁而优雅的代码，这也是为什么 *SonarQube* 默认的 *Kotlin* 的复杂度为 *15* 而 *Java* 是 *30* 。

> 关于 Java 的语言特性，可以参考 [Java 各版本的新特性](../../07/java-new-features/), Kotlin 的语言特性可以参考：[KEEP (Kotlin Evolution and Enhancement Process)](https://github.com/Kotlin/KEEP)

## 代码可读性

代码不仅仅是给编译器看的，更多的时候还要给人看，因为大多数情况下，一个正经的商业项目都是由一个或者多个团队来协作开发的，尤其是开源的项目，会被成千上万的开发者阅读，如果代码写得晦涩难懂，只会增加团队的沟通和理解成本，从而降低整个团队的开发效率，可能有的人会说，整个项目就我一个人开发，我自己能看懂就行了，这听起来貌似没什么毛病，但殊不知作为人类，记忆也是有时间限制，又称之为遗忘曲线，可能三个月过后，自己都看不懂三个月之前写的代码是啥逻辑了，还要花上好一阵来理清思路，可能还会一边看一边想，当时为啥要这么写，怎么写成这 X 样。

可读性主要包括以下几个方面：

1. 代码风格
    每个团队都应该有一套统一的 *Code Style* 以及配套的代码格式化配置或工具，帮助团队成员快速统一代码风格
1. 命名规范
    命名算是每个开发者面临的最头痛的问题之一，而且由限于绝大多数编程语言都是英文，取一个有意义的名字着实考验每个开发者的英文水平，所以，学好英语才是关键，如果实在不知道怎么取名，就用 [Google Translate](https://translate.google.com) 吧
1. 注释
    对于要公开或者发布出去的代码，API 一定要写好注释，尤其是逻辑复杂的设计，如果能配上文本格式的设计图 (如 [draw.io](https://app.diagrams.net/)) 就更好了
1. 使用通用的架构设计模式
    业内总结的架构模式和设计模式基本上能满足绝大部分软件的架构设计了，如 *Service Locator Pattern* , *Dependency Injection Pattern* , *GoF Design Patterns* 等等，通用的架构设计模式更容易被其他的代码阅读所理解，因为这些都已经成为业内共识了。
1. 遵循 KISS (Keep it Simple & Stupid) 原则
    KISS 原则与代码复杂度是一个对立的关系，保持代码简洁、直接，不要让阅读者过度思考
1. Less is more
    并不是功能越多越好，专注于最迫切需要解决的问题上，去除一些非必须的东西
1. [Worse is better](https://www.dreamsongs.com/RiseOfWorseIsBetter.html)
    在现实世界中，绝大多数软件的研发都是有时间和资源限制的，几乎不可能做到时间和资源都充足的情况，为了做到可持续交付，往往都是先满足 80% 的需求，让用户先使用起来，尽管不是很完美，但已经满足了大部分的需求，剩下的 20% 在后续的迭代中逐步完善。

## 单元测试

见过很多 *Library/SDK* 在实现完代码后，就提 *Pull Request* ，虽然有概要设计文档，但很多 *Code Reviewer* 并不直接参与这个项目的设计和开发，没有太多上下文，加上很多开发者没有养成写 *Unit Test* 的习惯，导致需要花很长时间来理清楚设计者的意图和代码的入口，如果能为每个公开的 *API* 提供单元测试用例，这样就能更好的帮助代码阅读者理解 *Library/SDK* 是如何使用的，也就能更快的帮助阅读者理解整个架构的工作流程，而不至于陷入细节而无法看到整个架构的全貌。
