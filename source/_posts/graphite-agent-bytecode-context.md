---
title: "Graphite: Code 即上下文"
date: 2026-05-11 20:00:00
categories:
  - Harness Engineering
tags:
  - Graphite
  - AI
  - Agent
  - MCP
  - Bytecode
  - Static Analysis
i18n_key: graphite-agent-bytecode-context
---

很多人以为，让 Agent 理解代码，就是给它更多源码：更大的 context window，更好的 embedding，更聪明的 RAG，更细的 AST index。我以前也差点信了。

直到我让 Agent 清理 AB 实验代码：它很快扫出一堆调用点，然后说“清完了”。真正的问题不是 Agent 能不能读代码，而是我怎么证明它没有漏掉第 201 个调用点。对 Agent 来说，context 不应该只是源码文本；**Code 本身就应该成为 Agent 可以查询、验证、推理的上下文。** Graphite 就是为这个问题做的。

<!-- more -->

## 源码不是程序的真相

今天大部分“代码理解”工具，都还停在源码层。Tree-sitter 把源码解析成 AST，Language Server 提供 symbol、reference、definition，Embedding 把代码块变成向量，RAG 再把相关片段塞回 context window。这些东西当然有用，但它们解决的是“代码长什么样”，不是“程序会怎么跑”。

这两个问题差很远。举个最简单的例子：AB 实验 ID 很少老老实实写在调用点上。它可能先定义成常量，再赋给局部变量；可能从另一个 module import 过来；也可能被包装进一个 helper method，最后才传给真正的 AB SDK。源码里你看到的是：

```kotlin
abClient.getOption(EXPERIMENT_ID)
```

AST 只能告诉你这里有个标识符叫 `EXPERIMENT_ID`。至于它的值是多少，可能在另一个文件，另一个 module，甚至经过几次变量传递之后才落到参数里。人脑可以慢慢追，Agent 也可以慢慢猜，但猜出来的东西不能当 ground truth。

**源码是给人读的，bytecode 才是机器真正执行的代码。**

Agent 要理解一个 JVM 系统，不能停在语法树那一层。它得越过源码，看见编译器之后的世界。

## AST 是地图，bytecode 是地形

Tree-sitter 很好，但它不是静态分析。它能告诉你这里有一个函数，那里有一个调用，某个节点下面挂着某个参数。对编辑器、语法高亮、局部重构来说，这已经够了；但对 Agentic Engineering 来说，不够。因为 Agent 面对的不是一个文件，也不是一个类，而是一个长期演化的业务系统。

十年历史的 JVM 单体仓库里，真实逻辑往往不在源码表面：实验 ID 可能通过常量传递，常量可能定义在另一个 module，调用点可能藏在 helper method 后面，同一个 AB SDK 可能被封装成几层业务 API。Spring endpoint 可能来自父类注解，Jackson 字段名可能藏在 annotation 里，枚举值可能要从 bytecode 的初始化逻辑里反推。这些东西，不是 AST 上多写几个 query 就能解决的。

你当然可以让 Agent 读更多源码，但 context window 不是魔法。读得越多，token 越贵，噪声越大，结论越像“我觉得”。**Agent 不缺阅读能力，缺的是可验证的结构。**

Graphite 做的事情很简单：从编译后的 bytecode 构建程序图。节点是方法、字段、常量、调用点、参数、返回值；边是调用关系、数据流、类型关系、控制流、注解关系。换句话说，它把“程序真正怎么连在一起”变成一张可以查询的图。这张图不是 LLM 幻觉出来的，它来自编译器产物。

## Agent 不该自己发现结构

过去我们让 Agent 干活，大部分时候是在赌一句话：“你把这些文件都读一遍，然后告诉我哪里要改。”这句话听起来很自然，但里面有个隐藏假设：Agent 必须自己发现结构。它要自己判断谁调用了谁，参数从哪里来，注解有没有继承，类型层次是什么，某个常量有没有流进目标 API。

这其实很荒谬。这些问题本来就不该交给 LLM。LLM 擅长的是语义推理，不是做确定性的图遍历。让它在几百万 token 里找调用点，就像让一个很聪明的人用肉眼翻电话簿：不是不能做，是没必要。

Graphite 的分工更干净：Agent 负责提出问题，Graphite 负责返回事实，Agent 再基于事实做判断。比如 Agent 想知道所有传给 `AbClient.getOption()` 的实验 ID，不需要读 500 个文件，只要查图：

```cypher
MATCH (c:IntConstant)-[:DATAFLOW*]->(cs:CallSiteNode)
WHERE cs.callee_class = 'com.example.ab.AbClient'
  AND cs.callee_name = 'getOption'
RETURN c.value, cs.caller_class, cs.caller_name
```

结果不是“可能有这些”，而是图上确实存在这些数据流。这才是 Agentic Engineering 需要的上下文。**LLM 不应该负责发现结构，它应该负责理解结构背后的意图。**

## 6 个，还是 19 个

最早做 Graphite，是为了验证 AB 实验清理。我一开始用的还是老办法：grep、AST query、调用点搜索，一层层补 pattern。结果找到 6 个。不是这些工具没用，而是基于 pattern 的方法天然扫不全：常量换个名字，参数多传一层，调用包进 helper，pattern 就断了。后来把 bytecode 建图，从常量节点沿着数据流一路追到目标调用点，数字变成了 19。不是 6。

多出来的那些，正是 AST 很容易漏掉的地方：局部变量传递、跨 module 常量、条件分支里的间接调用。这类差异很致命。如果你只是做 code search，漏几个点无所谓；但如果你让 Agent 自动删代码、改接口、迁移框架、清理 dead code，漏掉一个点就可能是生产事故。

Agent 越能干，我们越需要确定性。这听起来有点反直觉，很多人以为模型越强，工具越不重要，实际正好相反。模型越强，越需要可靠工具把它的能力约束在事实之上。没有 Graphite 这类结构化上下文，Agent 的上限是“读了很多代码的聪明实习生”；有了它，Agent 才更像一个能随时查询系统真相的工程师。

## MCP 之后，Graphite 变成 Agent 的眼睛

Graphite 最初是 CLI。你可以这样建图：

```bash
brew tap johnsonlee/tap
brew install graphite graphite-explore

graphite build app.jar -o /data/app-graph --include com.example
graphite query /data/app-graph "MATCH (n:CallSiteNode) RETURN n LIMIT 10"
graphite-explore /data/app-graph --port 8080
```

这已经能解决很多静态分析问题，但真正有意思的是 MCP。把 Graphite 通过 MCP 暴露给 Claude Code 或其他 Agent，Agent 就不需要把整个仓库读进 context window，而是可以直接问图：这个方法有哪些调用点？这个 endpoint 来自哪个 Controller？这个 annotation 有没有继承？这个常量最后流向了哪里？这个类型有哪些 subtype？这段 dead branch 为什么不可达？

过去 Agent 回答这些问题，要靠读源码、猜结构、拼上下文；现在它可以查图。这不是简单省 token，而是工作方式变了。以前的代码上下文是文本，以后的代码上下文是可查询的程序图。

## 这不是为了替代源码

我不想把话说得太满。Graphite 不会告诉你业务为什么这么设计，也不会自动判断一个实验能不能删。bytecode 再准确，也只能回答“程序结构上发生了什么”。但这恰恰是它的价值：它不抢 LLM 的活，它把 LLM 不该干的脏活拿走。

源码仍然重要，PR 仍然要 review，业务语义仍然要人和 Agent 一起判断。但在此之前，至少我们应该先知道系统真实的结构是什么。没有这一步，所有“让 Agent 理解代码”的方案，都有点像让人闭着眼摸大象：摸得越久，描述越详细，但你还是不知道它有没有摸全。

## 从编译器结束的地方开始

过去的软件工具链，是围绕人设计的。IDE 帮人跳转，grep 帮人搜索，AST 帮人重构，文档帮人理解。Agent 加进来之后，工具链需要变，因为 Agent 不应该像人一样读代码。人读源码，是因为人没法直接读程序结构；Agent 没这个限制。它可以调用工具，可以查询图，可以把确定性分析和概率推理组合起来。

这也是 Graphite 想做的事。不是再造一个更聪明的 grep，而是给 Agent 一张更接近真实执行语义的地图。源码是输入，bytecode 是事实，program graph 是 Agent 能用的上下文。不是把 code 塞进 context window，而是把 code 本身变成 Agent 可以查询、验证、推理的上下文。这就是“Code 即上下文”。

如果未来的工程团队里，每个 Agent 都能实时查询调用图、数据流、类型层次和注解关系，那么“理解代码”这件事本身就会被重新定义。不是读完多少文件，而是能不能问对问题，并拿到可靠答案。工具在变，工作在变，代码上下文也该变了。你还准备继续把几百万 token 的源码塞进 context window 吗？

> GitHub: https://github.com/johnsonlee/graphite
