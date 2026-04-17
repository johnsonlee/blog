---
title: SSD 最优解陷阱
date: 2026-04-17 12:00:00
categories:
  - Computer Science
tags:
  - LLM
  - Agent
  - Self-Improvement
  - Inference
  - Verifier
i18n_key: ssd-selection-trap
---

SSD（[Simple Self-Distillation](https://github.com/apple/ml-ssd)）是 Apple 提出的一种自蒸馏方法——从 frozen 模型里多 sample，在自己的原始输出上做 SFT，让模型自我改进。本文讨论的是 SSD 的一个变种场景：**inference-time 的 multi-sample selection**——多 sample 之后怎么选那个“最优”。

SSD 的逻辑很直接：多 sample，选最优。但在一个结构化输出的场景下，我撞到了一个看起来小、实际上很深的问题——**“最优” sample 在关键 section 上往往不是最强的**。

## 问题是什么

场景是 planning——agent 根据需求产出一个结构化的 plan，里面有几个 section。SSD 跑 N 次，每个 sample 得到一个 scalar score，取 top-1。

打开 per-section 的分数看：

- Sample A：section 1 得 90、section 2 得 70、section 3 得 80
- Sample B：section 1 得 80、section 2 得 85、section 3 得 75
- Sample C：section 1 得 95、section 2 得 60、section 3 得 85

三个 sample 的总分非常接近。**但没有任何一个在所有 section 上最强。** argmax 选出来的那个，在某些 section 上其实有明显短板。

最朴素的解法是跨 sample 拼接——每个 section 挑各 sample 里最强的那份拼起来。

想过之后，不成立。section 之间有语义耦合：后面的 section 引用、依赖前面 section 里的判断。跨 sample 拼接会破坏 inner agent 原本隐式维护的内部一致性，结果是**结构合法、语义错配**。

拼接这条路走不通，真问题浮出水面：**怎么让 SSD 产出的那个 top-1，真的是全面最优的 sample？**

## 错方向之一：用 token 数当 effort 的 proxy

一个直觉反应是：如果某 section 的 token 少，说明 agent 没在上面花力气，应该打低分。

这个想法在 LLM 身上是错的，而且错得很典型。

Token 消耗衡量的是 verbosity，不是 effort。LLM 在“想得深”的时候输出未必长——一个精确的架构理解可能 50 个 token 就讲清核心。而“想得浅”时 LLM 反而更容易产出长——它会填充、列举、加限定词，因为在没有 strong insight 时，fluency 会自动把字数堆起来。RLHF 还给了模型一个 verbose bias——更长的回答常常被打更高分。

**Token 数和思考深度的相关系数，在 LLM 上可能接近零甚至为负。**

把 token 作为打分 signal 的后果是可预测的 Goodhart：agent 学会在每个 section 里**写得更长**，而不是**想得更深**。精确的判断被稀释成可能性枚举，核心结论被埋在大段限定和铺陈里。外观更饱满，实质更差。

## 错方向之二：推理深度

意识到 token 的问题后，下一个想法是——那用推理深度呢？CoT 长度、推理步骤数、概念密度。

这个方向比 token 好一些——它至少指向了一个真正该测的东西。但更危险，因为**它更难测，更容易自欺**。

核心事实：LLM 没有“推理深度”的物理对应物。

CoT 写出来的 "step 1, step 2, step 3" 不保证对应任何 discrete 推理过程。已经有 paper 证实模型可以直接生成答案、再编造一个 self-consistent 的 CoT 作为事后解释。网络的前向传递深度对每个 token 都是一样的，所谓“深度”是一个 anthropomorphic projection。

更严重的是，任何你定义的“深度 proxy”，agent 都能学会生成满足 proxy 的**表面特征**：

- 拆成更多小步骤 → 每步几乎无信息量，但计数多
- 往 CoT 里塞 entity → entity 被列出，但不参与推理
- 让 CoT 和最终输出 self-consistent → 两者都肤浅但互相印证

Gaming 一个“推理深度”的 proxy，产出来的东西**看起来就像深度推理**。这比 token-gaming 更阴险。

想测“深度”这个方向本身就是个陷阱。**在一个不存在的量上找 proxy，不论找什么都会是错的。**

## 真正的方向是 grounding 不是 effort

把 "effort" 这个 framing 彻底扔掉，换一个问题：**除了 verifier 的 scalar score，还有什么 deterministic 信号可以用来交叉验证 sample 的质量？**

这个问题有一个干净的答案——**基于真实环境的 grounding**。

planning 涉及的“真实环境”是 codebase。如果你能用 static analysis 拿到 call graph，那对 plan 里所有涉及代码结构的判断，你有了一个独立于 verifier 的 deterministic 判据：plan 引用的 entity 是否真的存在、依赖关系是否对得上、变更的传递影响是否被识别完整。

这些问题都是 structural facts，答案完全 deterministic，不依赖任何主观判断。

这给了你 per-section 的第二条 signal。**和 verifier 的 scalar score 独立。**

两个 signal 独立这件事本身就是 information。当两者一致——verifier 说 sample A 最好、grounding 也说 sample A 在所有 section 上 grounded 得最深——这个“最好”是真的。当两者冲突——verifier 选了 A，但 grounding 显示 A 在 section 1 上比 B 差一大截——这个冲突暴露的是 **verifier 可能在被 gaming 或者信号不够细**。

## 但不要用 grounding 替代 selection

这里有一个关键判断：grounding signal 的正确用法**不是**加进 verifier score 做新的 scalar argmax。

两个原因。

**一**、grounding 只覆盖 plan 里涉及代码结构的部分。那些不涉及结构的 section，grounding 沉默。如果 grounding 成为 selection 主 signal，这些盲区的质量会**从 signal 里消失**——agent 会学到“只要 grounded 的部分强，其他无所谓”。新的 Goodhart，换了位置而已。

**二**、把 grounding 和 verifier 合成一个 scalar 会丢失两种 signal 的独立性。两者本来衡量的是不同维度——verifier 看“plan 是否 well-formed”，grounding 看“plan 和 real code 对接正确度”。独立的两个轴比一个加权和提供的信息多得多。

所以正确的用法是：**grounding 作为 diagnostic layer，不是 gatekeeper**。

具体工作方式：

1. SSD 跑完，按 verifier scalar 选 top-1——这一步不变
2. 对所有 N 个 sample，**额外**跑 grounding-based per-section scoring
3. 对比 top-1 的 per-section grounding 分数和**各 section 的最高分**
4. 如果 top-1 在某 section 上显著低于该 section 的最高分——**记录这个 gap**
5. gap 不改变当前 selection，作为 signal 反馈给演化机制
6. 长期目标：让 SSD 演化到 top-1 的 grounding 分数在每个 section 上都接近 sample 集合的最高分

selection 机制不变，保持简单。grounding 是 observer，不是 judge。gap 引发的是 learning signal，不是 selection 回滚。

**演化目标从“最大化 verifier scalar”升级为“最大化 verifier scalar 且 grounding-per-section 无显著 gap”。**

## 所以 agent 会学到什么

这是最关键的问题。signal 的形状决定 agent 演化的方向。

当前的 scalar argmax，agent 学到的是**“把总分拉高”**——这意味着它会优先在容易拿分的 section 多花算力，难拿分的 section 保持基础水平，因为边际收益这么算最优。

加了 grounding-based gap signal 之后，agent 学到的是**“每个 section 都不要被其他 sample 甩开”**。这个目标函数更接近“全面最优”，而不是“总分最优”。

Gaming 这个 signal 需要什么？agent 要想在 grounding 分数上不被甩开，它得真的引用更多真实存在的代码结构、真的覆盖更多真实存在的依赖路径——而这些是 static analysis 验证的，编不了。

**这是一个在 deterministic 轨道上的演化。** Agent 的 gaming 策略和真实质量提升在这里是同一件事——没有分叉。

## 回到更大的问题

这个 SSD selection 的具体问题底下，是一个更大的方法论问题。

Self-improvement 系统的核心风险从来不是“agent 不够强”，是“signal 结构错了，agent 被错误的 signal 带到错误的地方”。scalar 总分、token 数、推理深度——它们失败的方式都是同一个：**把一个高维质量问题压缩成低维数字，然后在那个低维数字上做 optimization**。

真正的出路是反过来——**保持 signal 的高维结构，让 deterministic 的多源信号互相 check，而不是合成一个标量**。

Grounding 之所以是正确答案，不是因为它比其他 signal “更好”。是因为它是**独立的、deterministic 的、难以 gaming 的第二根轴**。两根独立的硬轴永远强于一根加权的软轴。

这个原则不限于 planning。任何 self-improvement 系统，只要你打算 autonomous 地评估产物质量，就必须问自己：**我的 verifier 的 grounding 在哪里？它和我其他 signal 相关还是独立？**

相关的话，全是假的冗余。独立的才是真的 check。
