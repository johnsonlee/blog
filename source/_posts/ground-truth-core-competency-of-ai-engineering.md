---
title: Ground Truth：AI 时代最被低估的竞争力
date: 2026-03-28 08:52:00
categories:
  - Independent Thinking
tags:
  - AI
  - Harness Engineering
  - Ground Truth
  - Agent
  - Software Engineering
---

最近和一个做 AI Coding 产品的朋友聊天，他说他们团队花了三个月调 prompt，代码生成的“通过率”从 60% 提到了 78%。我问他：你怎么知道是 78%？他愣了一下，说是人工抽查的。

**那这个 78% 本身就不是 ground truth。**

## 没有 Ground Truth，你连“错了”都不知道

LLM 是概率性的，这不是缺点，是本质。它不保证正确，只保证“像正确”。大多数团队意识到了这一点，所以加了 code review、加了测试、加了 human-in-the-loop。

但这些兜底手段有一个共同特征：**它们都在用人脑当 ground truth。**

人工 review 生成的代码——人脑是 ground truth。人工判断 PR 质量——人脑是 ground truth。人工抽查“通过率”——人脑还是 ground truth。

这不 scale。准确说，这跟没用 AI 之前的效率瓶颈是同一个瓶颈，只是换了个位置。

## Ground Truth 必须是确定性的

我在之前的文章里聊过约束工程（Harness Engineering）的核心隐喻——驭马。骑手不需要比马跑得快，但需要知道方向、边界和终点。

这里的“方向、边界和终点”是什么？就是 ground truth。

但 ground truth 不能靠 LLM 自己产出——**用概率性的工具去验证概率性的输出，等于没验证。** 你需要确定性的手段。

拿我做的 AB 实验清理 Agent 举个例子。大型 codebase 里往往有大量过期的 AB 实验代码，清理它们是体力活，逻辑上很适合交给 Agent。但 Agent 怎么知道哪些代码属于某个实验？怎么确认清理后没有遗漏或误删？

靠 LLM “读”代码？它会漏，会幻觉，会在复杂的条件嵌套里迷路。

我的做法是用 Graphite——一个基于 SootUp 的字节码静态分析工具——先把 call graph 跑出来。**哪个方法调用了实验 API、哪些分支依赖实验状态、调用链上下游影响了什么，全是确定性的结果。** 这就是 ground truth。

有了这个基础，LLM 的角色变得清晰：它不负责发现代码结构，它负责理解语义——这个实验的“对照组”逻辑应该保留还是移除？这个清理 PR 的 commit message 怎么写？这些是 LLM 擅长的事。

**确定性工具做发现，LLM 做解释。** 这个分工不是偏好，是工程约束。

## 护城河不在 Prompt，在验证

回到开头那个朋友的故事。他花三个月优化 prompt，其实是在优化 LLM 的输入。但输入再好，输出依然是概率性的。如果没有 ground truth 做验证，你永远不知道优化的方向对不对，甚至不知道有没有退步。

这就像骑马不看路。马跑得再快，如果你不知道目的地在哪，速度毫无意义。

反过来，如果你有 ground truth：

- 你可以自动验证 Agent 的每一次输出
- 你可以量化每次 prompt 调整的真实效果
- 你可以在 Agent pipeline 里做 closed-loop：生成 → 验证 → 反馈 → 重试

**大多数人在优化 prompt，少数人在优化验证。后者才是真正的杠杆。**

## Build Ground Truth 是一种能力

说“需要 ground truth”很容易，难的是把它 build 出来。

这需要两层能力：

### 识别什么该成为 ground truth

不是所有东西都需要 ground truth。你需要判断在你的 Agent pipeline 里，哪些环节的错误代价最高、哪些环节最容易出错、哪些环节的正确性是可以用确定性手段验证的。

AB 实验清理里，call graph 是高价值 ground truth——因为“这段代码是否属于某个实验”是一个有确定答案的问题。但“这个 PR description 写得好不好”不是，它没有 ground truth，也不需要。

### 用工程手段把它造出来

识别了之后，你得有能力把它造出来。Graphite 不是现成的产品，是我基于 SootUp 搭的工具链，暴露为 MCP Server 供 Agent 调用。这是纯工程活——理解字节码分析、理解 call graph 遍历算法、理解怎么把分析结果结构化成 Agent 可消费的格式。

**这种能力没法靠 prompt engineering 补。** 它要求你既懂 AI Agent 的工作方式，又懂底层工程系统。这是稀缺的交叉能力。

## 确定性的价值在不确定性的时代

我在之前一篇文章里写过，LLM 时代“确定性的保质期在缩短”。模型在变、API 在变、best practice 在变。但有一样东西不变：**ground truth 的价值只会随着 AI 能力的增强而增加，不会减少。**

模型越强，输出空间越大，验证就越重要。GPT-3 时代你可能靠肉眼就能看出明显的错误，但当模型的输出“看起来都对”的时候，唯一能区分对和“像对”的东西，就是 ground truth。

所以如果你在想 AI 时代什么能力最值得投资——不是 prompt engineering，不是 fine-tuning，不是跟进最新的模型。

**是 build ground truth 的能力。**
