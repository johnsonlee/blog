---
title: Experience-First or Technology-First?
date: 2026-03-19 08:20:00
categories:
  - Independent Thinking
tags:
  - AI
  - Product Strategy
  - Copilot
  - Google
  - Technology
---

Steve Jobs 有一句被引用了无数次的话：

> Start with the customer experience and work backwards to the technology.

过去 20 年，这句话几乎是产品构建的圣经。谁更懂用户，谁就赢。技术是手段，体验是目的。

但如果这句话在 AI 时代是错的呢？

2026 年初的 AI coding tool 市场给出了一个令人不安的反例：交互设计最精良的产品正在被一个 terminal 界面击败。GitHub Copilot——inline suggestion 的先驱、体验打磨的典范——在开发者心目中的 "most loved" 评分只有 9%。而 Claude Code，一个连 GUI 都没有的命令行工具，拿到了 46%。

这不是偶然。这背后是两种产品构建哲学在 AI 时代的胜率逆转。

## 两种哲学

把它们显式化：

**Experience-first**：先定义用户要什么体验，再去找技术来实现。产品经理定义需求，工程师交付。iPhone、Slack、Notion 都是这个路子的赢家。

**Technology-first**：先把核心技术能力推到极限，再看这个能力能支撑什么体验。研究者定义可能性边界，产品团队在边界内找最佳形态。

在消费互联网时代，experience-first 是压倒性的正确策略。底层技术已经高度成熟和商品化——云计算、数据库、前端框架的能力边界是已知的、稳定的。差异化几乎完全来自体验层。Slack 和 HipChat 的技术栈没有本质差异，但 Slack 的体验让它赢了。

AI 打破了这个前提。

## 为什么 AI 颠覆了优先序

传统软件里，你可以先设计一个完美的交互，然后确信工程团队能实现——因为底层能力边界是已知且稳定的。PM 画完 wireframe，工程师一定做得出来。

AI 产品不是这样。模型能力的边界每三到六个月就发生非线性跳变。上季度还做不到的 whole-repo reasoning 这季度突然能做了。上个月还需要人工介入的 multi-step refactoring 这个月模型自己能完成了。

**AI 产品的能力边界不由产品设计决定，而由模型能力决定。**

这意味着体验是模型能力的函数，而不是反过来。先把模型做到世界级，体验层面的设计空间自然会打开。反过来，先设计一个花哨的体验然后期待模型去适配——你就把自己锁死在了一个可能很快过时的能力假设上。

## Copilot：Experience-First 的牺牲品

回溯 Copilot 的时间线，experience-first 思维的痕迹非常清晰。

2021 年，产品团队先定义了体验：开发者在编辑器里敲代码，AI 实时给出 inline suggestion。不打断 flow，tab 键接受建议，自然融入编辑器。体验层面几乎无可挑剔。

然后去找技术来实现——Codex，context window 很小，只能看到光标附近几十行代码。这个技术约束被产品设计吸收了：反正用户只需要 line-level suggestion，不需要 AI 理解整个 codebase。

2024-2025 年，模型能力跳变。百万级 context window，multi-step reasoning，tool use。这些能力支撑的体验形态远超 "inline suggestion" 的框架。Cursor 做了 Composer mode 和 full-repo indexing。Claude Code 更激进——直接放弃 editor-centric 的假设，让 AI 在 terminal 里自主执行多步工作流。

Copilot 呢？它的体验框架是在 Codex 时代的能力上设计的。模型能力跃升之后，这个框架变成了天花板。后续加的 Agent Mode、Workspace、Chat 全是在旧框架上打补丁——不是从新的模型能力出发重新想象体验该是什么样。

**你为 T0 时刻的技术能力设计了最优体验，但这个最优体验到 T1 时刻变成了约束。** 而组织结构、代码架构、用户心智模型都已经围绕 T0 的设计固化了，跳不到 T1 的最优解。

更棘手的是，Copilot 团队不是看不到模型能力在跃升——他们看得很清楚。但 experience-first 的思维惯性让他们的应对方式是“在旧的体验框架里塞进新能力”，而不是“从新能力出发重新设计体验”。前者是连续性改进，后者是非连续性跳变。大组织几乎总是选前者。

## Google：Technology-First 的逆袭

Google 的 AI turnaround 是反面案例。

2024 年初的 Google 和 Copilot 有同样的症状——组织 intent 分裂，产品团队和模型团队隔着组织墙，Bard 做出了让用户吃石头的建议。掉队掉到 Sundar Pichai 的职位安全性被公开质疑。

Pichai 做了一件关键的事：**把决策权从产品侧转移到了模型侧。**

DeepMind 被整合为 Google 的 "engine room"——开发核心 AI 技术，然后分发给公司的各个产品线。Gemini App 团队从 Knowledge & Information 部门划到了 DeepMind 下面。一个竞争对手 AI lab 的人这样总结 Google 的策略转向：

> 他们回到了技术栈本身，先让它达到世界级，然后再考虑它能支撑什么体验——而不是反过来。不是试图构建某种花哨的体验然后让技术去适配。

不是 Search 团队告诉 DeepMind “我们需要一个能回答用户问题的模型”，而是 DeepMind 做出了 Gemini 3，Search 团队看到模型能做什么，据此重新设计了 AI Mode、AI Overviews、Deep Research。

NotebookLM 是一个典型。这个产品不是某个 PM 画了 wireframe 说“用户需要把文档变成 podcast”。它是模型团队在探索 long context + audio generation 能力时，发现了“可以把一百万 token 的文档喂给模型然后生成自然对话”这个能力，产品团队围绕能力构建了 Audio Overviews。

能力在前，体验在后。

结果：2025 年底 Google 股价涨了 56%，市值超过了微软，Gemini 3 登顶 LMArena，Sam Altman 在内部备忘录里说“预计外面的舆论氛围会艰难一阵”。

## 真正的判断标准

所以到底什么时候该 experience-first，什么时候该 technology-first？

答案不是“哪个更高级”——而是**能力边界的可预见性**。

当能力边界可预见时，优化体验。2015 年做一个移动 App，底层技术栈（iOS SDK、REST API、SQLite）的能力边界是清晰且稳定的。你精确地知道什么能做、什么不能做、六个月后这个边界大概在哪。能力边界是常量，体验设计是变量，胜负取决于谁把变量优化得更好。

当能力边界不可预见时，追逐边界。2025 年做一个 AI coding tool，模型能力的边界每三到六个月非线性跳变。把体验设计锚定在当前能力边界上就是在赌边界不动。把模型能力推到极限，体验层面的设计空间自然打开。

这也解释了为什么 Claude Code 的 terminal 界面不是劣势而是优势——它没有被体验框架锁死。每次模型能力提升，价值直接传导给用户，中间没有需要重新设计的交互层。而 Copilot 的精良体验反而成了阻碍——每次模型跳变都需要重新适配 extension API、inline suggestion 的交互范式、VS Code 的 UI 约束。

用一个粗暴的公式：

> **体验投入的 ROI = 能力边界的稳定性 × 体验差异化的空间**

能力边界越稳定，体验投入的 ROI 越高。能力边界越动荡，体验投入越可能变成沉没成本。

## 成功是转换点识别的最大敌人

这两种哲学不是永久对立的。它们之间存在一个转换点，而**识别这个转换点本身是最高阶的战略判断**。

iPhone 刚出来的那几年，核心竞争力是触控交互范式本身——这是技术能力（电容屏 + multi-touch）定义的。Technology-first 是对的。但到了 iPhone 成熟期，硬件差异缩小，竞争重心转向了生态、服务、品牌。Experience-first 重新上位。

AI coding tool 现在处于 "iPhone 2007" 的阶段。模型能力每六个月跃升一次，每次跃升都重新定义可能的体验形态。在这个阶段把赌注压在体验固化上是结构性错误。

但识别转换点的难处在于：**成功会遮蔽信号。** Copilot 的 inline suggestion 在 2022-2023 年是成功的——用户增长很快，市场反馈很正面。成功让组织确信当前范式是正确的，从而错过了范式需要切换的信号。Google 恰恰因为失败——Bard 的灾难、市值被质疑——才被迫重新审视范式假设。

同样的逻辑也适用于当前的 technology-first 赢家。一旦模型能力进入稳态——如果那一天到来——价值竞争会重新回到体验层面。到那时，今天的 technology-first 赢家需要迅速切换到 experience-first，否则会被更会做体验的后来者超越。而他们的成功，又会成为识别那个反向转换点的最大障碍。

所以最终的问题不是 experience-first 还是 technology-first。

**而是：你有没有能力在正确的时刻切换？**
