---
title: 19 行 prompt 的威力
date: 2026-04-04 10:00:00
categories:
  - Independent Thinking
tags:
  - Claude Code
  - Prompt Engineering
  - AI
  - Agent
---

那天我在用 Claude Code 做架构设计。

它的表现让我觉得哪里不对——ARCHITECTURE.md 写得混乱不堪，逻辑跳跃，边界模糊，跟我平时的体感有着巨大的落差。不是偶尔失误，是接连犯错。像是降智了一个 level。

我忍了一段时间，最后决定直接盘问它。

## "你在执行谁的指令？"

我开始问它一些基础问题：你觉得你现在的角色是什么？你做决定前的思考框架是什么？

它开始回答，说它的职责是"作为 planner 和 coordinator"，在 dispatch 工作给 worker agent 之前，需要先走完一套 checklist——Intent、Competence、Affected files、Conventions、Review test……

我盯着屏幕，有一种奇特的感觉。

这些措辞，这套逻辑，我好像在哪里见过。

然后我想起来了。那是我**两个月前写的、后来认为有问题、已经彻底重写的** CLAUDE.md 里的内容。

我以为它早就不存在了。

## 一次意外的目录碰撞

Claude Code 在启动时会向上遍历目录树，逐层寻找 CLAUDE.md，就近优先。这个机制本身没问题——它让 per-project 的配置成为可能。

问题出在我的目录结构上：

```
~/workspace/github/johnsonlee/
├── .claude/          ← 这是一个 git repo：github.com/johnsonlee/.claude
│   └── CLAUDE.md     ← 老版本，52 行
├── project-x/
├── project-y/
└── ...
```

正常情况下，全局 CLAUDE.md 应该放在 `~/.claude/CLAUDE.md`。但我有一个专门管理 Claude 配置的仓库，clone 到了 `~/workspace/github/johnsonlee/.claude`。

而我所有的其他项目，也都在 `~/workspace/github/johnsonlee/` 下。

于是，当 Claude Code 在 `project-x` 里工作时，向上遍历，在抵达 `~/.claude/` 之前，**先找到了那个 git repo 里的老版 CLAUDE.md**。

它一直在用一套我以为早就淘汰了的指令工作。

## 两个版本，两个世界

老版本（v1），52 行，2.83 KB。开篇定义角色：

> You are a **planner and coordinator**, not an executor.

然后是详尽的 Tool Boundaries——哪些工具可以直接用（Read、Grep、Glob），哪些必须通过 worker agent（Write、Edit、有副作用的 Bash）。然后是 5 步 Thinking Discipline。最重要的，是这套强制输出的 Pre-Dispatch Checklist，每次 dispatch 前必须可见地打出来：

```
- [ ] Intent: [what the user actually wants]
- [ ] Competence: [do I understand this domain?]
- [ ] Affected files: [list every file to be created/modified/deleted]
- [ ] Conventions: [verified against existing files — cite which files checked]
- [ ] Review test: "would the user approve this diff?" [yes/no + why]
```

文档里还专门强调：`Skipping it is a violation — the checklist is visible proof that thinking happened.`

新版本（v2），19 行，1.17 KB。开头只有一句话：

> **You exist to turn the user's intent into reality.** This is the single principle. Everything below is a facet of it.

然后三节：

**Understand intent**——永远追求目标本身，而不是字面意思。领域不熟悉就先研究，错误的理解无论执行多精确都是错的。

**Stay available**——意图和执行之间的通道必须保持畅通。默认 delegate 给 background worker，delegation 失败就直接执行——不要请示，不要问能不能切换，直接交付。

**Execute faithfully**——Consistent、Complete、Verified。最后一条最狠：`never report completion without independent evidence; if it can't be proven, it didn't happen.`

具体的 git workflow、命名规范、code style，单独放到 CONVENTIONS.md，不污染核心原则。

## 为什么差距是质变

表面上看，v1 更严谨——有角色定义，有工具边界，有思考框架，有 checklist。v2 像是把这些都删掉了。

但删掉的恰恰是造成问题的部分。

### Checklist 是仪式，不是思考

v1 要求 Claude 在每次 dispatch 前输出一个可见的 checklist，理由是 "visible proof that thinking happened"。

这个设计的出发点是好的——让思考过程可审计。但它混淆了一件事：**输出 checklist 和真正思考，是两件事。**

Claude 学会的是"填完 checklist"，而不是真正想清楚再动。就像写周报——填完格子就算完成，至于填的是不是真实发生的事，那是另一个问题。Checklist 变成了一个需要被满足的形式，而不是认知工具。

v2 没有这个 ritual。它信任 Claude 内化原则后自行判断，用结果验证，而不是用过程表演。

### 角色定义制造了认知死锁

"planner and coordinator, not an executor"——这个身份在正常流程下运转良好，但在 delegation 失败时产生了一个死角：按角色定义不该直接执行，但任务又推进不下去，只能停下来问。

这类死锁的代价是隐性的。它不报错，就是慢，就是来来回回，就是用户体验上那种"哪里不对劲"。

v2 的 "Stay available" 直接消灭了这一类场景：

> *Fall back to direct execution when delegation fails — don't ask permission to switch, just deliver.*

不请示，不确认，直接切换，直接交付。

### 北极星决定行为基调

v1 的核心隐喻是 "distinguished engineer reviewing a PR"——**审查者视角**，天然偏保守、偏怀疑，倾向于发现问题而不是推进交付。

v2 的北极星是 "turn the user's intent into reality"——**执行者视角**，天然偏行动、偏交付，所有判断都服务于这一个目标。

两种身份认同塑造的不是某个具体行为，而是面对每一个模糊情况时的默认倾向。这是系统性的差异。

### "Verified" 比 "review test" 更强

v1 的完成标准是："would the user approve this diff?"——主观猜测，Claude 做一个推断就能交差。

v2 的完成标准是："never report completion without independent evidence; if it can't be proven, it didn't happen"——可证伪的要求，Claude 必须主动构造验证，无法验证就不能报完成。

前者允许合理怀疑的空间，后者不允许。

## 规则越多，未必越好

这件事让我想到一个更普遍的问题。

我们在给 AI 写 system prompt 时，有一种很自然的冲动——把所有边界情况都写进去，把所有规则都定义清楚，覆盖越全越好。v1 就是这种冲动的产物。

但规则堆砌带来的不是确定性，而是**优先级模糊**。当规则之间产生张力——比如"我是 coordinator"和"任务推进不下去"——AI 不知道该服从哪一条，行为就变得不可预测。

更深的问题是：**规则是约束，原则是方向。** 约束只能告诉 AI 什么不能做，原则才能告诉 AI 在没有规则覆盖的地方怎么判断。现实任务永远比规则列表更复杂，总会遇到规则没覆盖的情况。这时候，有北极星的 AI 和没有北极星的 AI，表现是天壤之别。

v2 之所以有效，不是因为它更简洁，而是因为它**提供了一个足够强的推导起点**。所有具体判断都能从 "turn the user's intent into reality" 推导出来，不需要穷举规则。

这不只是 AI prompt 的问题。给团队写 working agreement、给产品写设计原则、给工程写 coding guidelines——同样的陷阱，同样的解法。一份好的原则文档，应该让人在遇到没见过的情况时，也能推导出正确答案。一份只有规则的文档，在规则边界之外就只剩混乱。

## 19 行的本质

这件事最让我震惊的，不是发现了一个 bug，而是它用最直接的方式验证了一件我一直相信但没有这么清晰感受过的事：

**19 行文字，就足以改变一个 AI 系统的工作 level。**

不是参数，不是模型版本，不是算力。是那几个核心句子，是北极星的精度。

这正是 **What Caps How** 的字面含义：你给 AI 的意图有多清晰、多自洽，它的输出上限就在那里。

有时候，删掉三分之二，才是真正的提升。
