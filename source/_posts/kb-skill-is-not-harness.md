---
title: "KB/SKILL ≠ Harness"
date: 2026-05-15 09:44:41
categories:
  - Independent Thinking
tags:
  - AI
  - Harness Engineering
  - Prompt Engineering
  - Eval
  - Agent
i18n_key: kb-skill-is-not-harness
---

最近我看到一个很有意思的现象。

有人给 Agent 加了一堆 SKILL，接上各种 Knowledge base，工作流满天飞，prompt 里塞满了注意事项、反例、few-shot，然后很认真地说：我们现在也在做 harness engineering。

我的第一反应是：这连门儿都还没摸着，离真正的 Harness Engineering 还远着呢。

SKILL、KB、structured prompt 当然有价值。它们能让模型更懂上下文，更容易按你的预期行动，也能显著降低低级错误。但如果你把这些东西叫 harness，那就把整件事想浅了。

**KB/SKILL 不是 harness，它们最多只是 harness 的输入约束层。**

<!-- more -->

## Prompt 不是缰绳，只是你对马说的话

Harness Engineering 这个词最容易被误解的地方，在于大家听到 "harness"，脑子里自动翻译成“约束”。既然是约束，那我写更长的 prompt、加更多 rules、准备更多 KB，不就是在约束模型吗？

不完全是。

想象一下，你在骑一匹马。你对它说：“往左一点，别跑太快，看到石头绕过去，前面有条河，不要跳。”这当然有用。马听懂了，出错概率会下降。

但这不是 harness。

真正的 harness 是缰绳、马鞍、护栏、路线、检查点，以及摔下来之后能复盘为什么摔的机制。你对马说的话，只是其中最软的一层。

LLM 也是一样。

Prompt 能改变模型输出的概率分布。SKILL 能把一些常见模式提前编码进去。KB 能补充模型缺失的上下文。structured prompt 能减少自由发挥的空间。

这些东西都在做同一件事：**提高正确输出出现的先验概率。**

注意，是概率。

只要执行层还是模型调用，输出就仍然是概率性的。你可以把概率从 60% 提到 80%，从 80% 提到 92%，甚至在某些场景里看起来接近 99%。但它没有变成确定性。

很多人卡在这里。

很多人以为“模型更听话了”就是“系统被约束住了”。不是。马更听话，不等于你有了赛道护栏。

## 真正的 harness 至少有五层

我现在更愿意把 harness 拆成五层看。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 600" role="img" aria-labelledby="harness-layers-title harness-layers-desc" style="max-width: 100%; height: auto;">
  <title id="harness-layers-title">Harness 的五个层次</title>
  <desc id="harness-layers-desc">从输入约束层、执行层、输出验证层、反馈层到复现层，展示如何把概率性模型放进确定性系统。</desc>
  <defs>
    <filter id="harness-shadow-zh" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <marker id="harness-arrow-zh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563"/>
    </marker>
  </defs>
  <rect x="20" y="20" width="880" height="560" rx="8" fill="none" stroke="#cbd5e1"/>
  <text x="460" y="58" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#111827">Harness 的五个层次</text>
  <text x="460" y="86" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#4b5563">Harness = 把概率性模型放进确定性系统的结构</text>

  <g filter="url(#harness-shadow-zh)">
    <rect x="80" y="122" width="500" height="72" rx="6" fill="#fff7ed" stroke="#f97316" stroke-width="2"/>
    <text x="112" y="151" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#9a3412">1. 输入约束层</text>
    <text x="112" y="177" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#7c2d12">SKILL / KB / structured prompt / few-shot：提高先验概率</text>
  </g>
  <g filter="url(#harness-shadow-zh)">
    <rect x="80" y="214" width="500" height="72" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
    <text x="112" y="243" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#1d4ed8">2. 执行层</text>
    <text x="112" y="269" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#1e3a8a">LLM 调用本身：概率性节点不可消除</text>
  </g>
  <g filter="url(#harness-shadow-zh)">
    <rect x="80" y="306" width="500" height="72" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
    <text x="112" y="335" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#047857">3. 输出验证层</text>
    <text x="112" y="361" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#064e3b">schema / test / linter / policy：deterministic gate</text>
  </g>
  <g filter="url(#harness-shadow-zh)">
    <rect x="80" y="398" width="500" height="72" rx="6" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2"/>
    <text x="112" y="427" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#6d28d9">4. 反馈层</text>
    <text x="112" y="453" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#4c1d95">slow-loop eval / human review / golden dataset：校准 ground truth</text>
  </g>
  <g filter="url(#harness-shadow-zh)">
    <rect x="80" y="490" width="500" height="72" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
    <text x="112" y="519" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#b91c1c">5. 复现层</text>
    <text x="112" y="545" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#7f1d1d">seed / model / prompt / tool / KB / dataset snapshot：让结果可比较</text>
  </g>

  <line x1="330" y1="194" x2="330" y2="214" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-zh)"/>
  <line x1="330" y1="286" x2="330" y2="306" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-zh)"/>
  <line x1="330" y1="378" x2="330" y2="398" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-zh)"/>
  <line x1="330" y1="470" x2="330" y2="490" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-zh)"/>

  <path d="M 620 158 C 735 158 735 342 620 342" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="732" y="235" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#334155">概率提升</text>
  <text x="732" y="258" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#475569">不是硬边界</text>

  <path d="M 620 342 C 785 342 785 526 620 526" fill="none" stroke="#111827" stroke-width="2.5"/>
  <text x="760" y="426" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#111827">工程闭环</text>
  <text x="760" y="449" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#374151">挡住、校准、复现</text>

  <rect x="650" y="484" width="190" height="62" rx="6" fill="#ffffff" stroke="#94a3b8"/>
  <text x="745" y="512" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#111827">Harness 的边界</text>
  <text x="745" y="533" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#475569">不是“相信”，而是“挡住”</text>
</svg>

### 输入约束层：提高先验概率

这一层包括 SKILL、KB、structured prompt、tool description、few-shot examples、system instruction。

它们的目标不是保证正确，而是让模型在生成之前更容易走到正确轨道上。

比如你告诉 Agent：修改代码前先读 README，提交 PR 前跑测试，遇到不确定的地方不要猜。这些规则很有用，能减少大量低级错误。

但它们本质上还是“告诉模型应该怎么做”。模型可以遵守，也可以漏掉；可以理解对，也可以理解歪；可以在简单场景里表现很好，也可以在长上下文、复杂状态、工具失败之后突然失控。

所以输入约束层的价值要承认，但边界也要承认。

**Prompt 只能让模型更可能正确，不能让系统必须正确。**

### 执行层：概率性不可消除

执行层就是模型调用本身。

只要中间经过 LLM，系统里就有一个概率性节点。这个节点不是 bug，是它的本质。

很多工程师不愿意接受这一点，总想通过更复杂的 prompt 把概率性“调没”。这有点像想通过更好的驾驶手册消除交通事故。手册可以降低事故率，但不能替代刹车、红绿灯和碰撞测试。

模型调用也是这样。

你可以换更强的模型，可以调 temperature，可以增加 thinking token，可以加 chain-of-thought 风格的中间步骤，可以让模型自检。但这些都没有改变一件事：执行层仍然不是 deterministic program。

这也是为什么“让另一个 LLM 检查它”只能算弱验证。它可能有效，但它不是边界。

**概率性输出不能靠概率性审判完成闭环。**

### 输出验证层：deterministic gate 才是第一道硬边界

真正的 harness 从输出验证层开始变硬。

这里的关键词不是"review"，而是 gate。

Gate 的意思是：不通过，就不能继续。不是“模型觉得可以”，不是“人看起来还行”，不是“差不多应该没问题”，而是一个确定性的检查把输出挡住。

这也是我一直强调 fast-loop 的原因。fast-loop 不负责证明世界真理，它负责在每次 Agent 输出之后，立刻用便宜、确定、可重复的方式砍掉明显不合格的结果。

我通常会把 fast-loop gate 拆成 7 条规则：

1. 输出必须满足 schema，不满足直接失败。
2. 所有事实性声明必须能追溯到上下文、工具结果或显式假设。
3. 不能执行超出授权范围的动作，尤其是写文件、发请求、删资源、改配置。
4. 不能把不确定性包装成确定结论。
5. 不能吞掉工具错误，失败必须显式暴露。
6. 修改类任务必须给出可验证 diff，而不是只给“我改好了”。
7. 关键产物必须能被 deterministic checker 复查，比如 parser、linter、test、static analyzer、policy rule。

这 7 条不神秘，也不性感。

但工程系统靠的从来不是性感。工程系统靠的是每次都能挡住同一类错误。

一个 Agent 生成 JSON，如果没有 schema validation，那你只是相信它会生成 JSON。一个 Agent 改代码，如果没有测试和静态检查，那你只是相信它没改坏。一个 Agent 写分析报告，如果没有 citation coverage 和 source boundary，那你只是相信它没幻觉。

相信，不是 harness。

**Harness 的第一性原理，是把“相信”换成“挡住”。**

### 反馈层：slow-loop eval 校准 ground truth

fast-loop 解决的是“这次输出能不能过最低门槛”。但它不解决另一个更大的问题：你的 gate 本身是不是对的？

这就需要 slow-loop eval。

很多团队会建一堆自动检查，然后很快陷入另一个幻觉：只要 check 绿了，系统就好。这个想法同样危险。

因为 checker 也可能检查错东西。

比如你做一个代码生成 Agent，fast-loop 可以检查代码能不能编译、测试能不能过、格式对不对。但这些并不等于业务逻辑正确。你可能测了 happy path，漏了 edge case；你可能让 Agent 修了表层 bug，却引入了架构债；你可能让 eval set 过拟合到一批老问题，结果真实用户一来全线崩盘。

slow-loop eval 的作用，就是定期把系统拉回 ground truth。

它不一定每次都跑，也不一定便宜。它可能需要人工标注、线上样本回放、golden dataset、shadow traffic、真实用户反馈、case study 复盘。它慢，但它校准方向。

fast-loop 是刹车，slow-loop 是地图。

没有 fast-loop，系统每天乱撞。没有 slow-loop，系统会沿着错误的地图一路狂奔。

### 复现层：eval harness 让结果可比较

最后一层最容易被忽略：复现。

你说某个 prompt 版本更好，怎么证明？你说新模型让通过率从 72% 到 81%，怎么证明？你说某个 SKILL 降低了 hallucination，怎么证明？

如果没有 seed、model version、prompt snapshot、tool version、KB snapshot、eval dataset snapshot，你的结论就很难复现。

今天跑出来 81%，明天可能是 74%。你不知道是模型版本变了，还是 tool response 变了，还是 KB 更新了，还是样本随机抽得不一样，还是 prompt 改了一个你忘记记录的小句子。

这时候你不是在做 engineering，你是在做玄学 A/B test。

真正的 eval harness 要记录整个运行环境：输入是什么，模型是什么，prompt 是哪一版，工具返回了什么，外部依赖是什么，checker 怎么判，ground truth 从哪里来。

只有这样，结果才可比较。只有可比较，优化才有意义。

**不能复现的提升，不叫提升，叫运气。**

## 为什么大家会把 SKILL/KB 误认为 harness

这个误区很自然。

因为 SKILL/KB 最容易展示，也最容易卖。

你打开一个 repo，看到一堆精心组织的 markdown、漂亮的 prompt template、复杂的 agent workflow，会觉得这个系统很工程化。它看起来像工程，读起来像规范，demo 起来也确实更稳。

而真正的 harness 往往不好看。

Schema validator 没什么可 demo。日志 snapshot 没什么可炫。eval dataset 很脏，case review 很琐碎，deterministic checker 写起来像苦力活。你花两周时间 build 一个 gate，最后用户看到的只是“这个错误没有发生”。

软件工程里最有价值的东西，很多时候就是让坏事不发生。

但“不发生”很难被看见。

于是大家自然会涌向 prompt engineering。它反馈快，成本低，变化明显，讲起来也顺口。今天改一句 system prompt，明天指标涨几个点，很有成就感。

这没错。

错的是把它当成终点。

Prompt engineering 是入口，不是护城河。SKILL 是经验封装，不是系统边界。KB 是上下文资产，不是正确性保证。

**你可以靠 prompt 起步，但不能靠 prompt 收尾。**

## Harness Engineer 到底在 build 什么

所以真正的 Harness Engineer 在 build 什么？

不是写更长的 prompt，也不是堆更多 SKILL。

真正要 build 的，是一套把概率性模型放进确定性系统的结构。

这句话听起来抽象，拆开就很具体：

模型可以自由生成，但输出必须过 schema。模型可以调用工具，但工具权限必须受控。模型可以写代码，但 diff 必须能被 test 和 static analyzer 检查。模型可以总结文档，但每个关键结论必须能回到 source。模型可以规划任务，但高风险动作必须有 deterministic gate 或 human approval。

这里的关键不是“限制模型”，而是“知道在哪些地方不能相信模型”。

很多人做 Agent 的默认姿势是：模型很聪明，所以我让它多做一点。

Harness Engineer 的默认姿势是：模型很聪明，所以我必须知道它什么时候会把聪明用错地方。

这两种姿势差别极大。

前者是在扩张能力边界。后者是在定义安全边界。没有后者，前者扩得越快，系统越危险。

## 从输入约束到工程闭环

我不是反对 SKILL、KB、Prompt engineering。

恰恰相反，我认为它们是必要的。没有好的输入约束层，Agent 的表现会非常差，后面的 gate 会被垃圾输出淹没。一个完全不懂任务上下文的模型，就算你有再强的 checker，也只是在高效拒绝垃圾。

但必要不等于充分。

SKILL/KB 属于输入约束层。它们把模型带到正确方向附近，让系统开始可用。

继续往后补，才是 harness：执行层承认概率性，输出层建立 deterministic gate，反馈层用 ground truth 校准，复现层让每次优化可比较。

这才是一套完整的工程闭环。

如果一个系统只有 SKILL/KB，没有 gate，没有 eval，没有 snapshot，没有复现，那它最多叫 prompt-augmented agent，不叫 harnessed agent。

这个区别不是咬文嚼字。

它决定了你是在做 demo，还是在做系统。

## 结语：别把门槛当终点

AI 工程现在有点像早期 Web 开发。

有人会写 HTML，就觉得自己在做软件工程。后来大家才慢慢意识到，真正的工程不只是把页面画出来，还包括状态管理、构建系统、测试、监控、灰度、回滚、安全、性能、可维护性。

今天的 Agent 也是一样。

会写 prompt，会整理 KB，会做 SKILL，当然很重要。但这只是把页面画出来。真正难的是：当模型输出错了，你挡不挡得住？当指标变好了，你证不证明得了？当系统上线三个月后行为漂了，你复不复盘得清？

很多人热衷于 SKILL/KB/Prompt engineering，很容易把输入层能力误认为完整的 Harness Engineering。

不是。

**Harness Engineer 的工作，不是让模型更会说，而是让系统更可信。**
