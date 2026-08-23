---
title: Harness 是 Agent 的壁垒吗？
date: 2026-08-23 21:16:24
categories:
  - Harness Engineering
tags:
  - AI
  - Agent
  - Agentic Coding
  - Codex
  - Software Engineering
i18n_key: is-harness-the-agent-moat
---

过去一年，Agent 圈逐渐形成了一个共识：模型会商品化，Harness 才是壁垒。

这个判断有足够多的证据。相同模型接上不同的 context management、tool routing、memory、subagent、sandbox 和 approval，结果可以差很多。[OpenAI 公布的一个例子](https://developers.openai.com/blog/codex-as-a-platform)很直接：在 ARC-AGI-3 上，保留 reasoning state 和压缩 context，把 GPT-5.6 Sol 的得分从 13.3% 提高到 38.3%，同时把 output token 降到六分之一。

既然 Harness 能制造这么大的差异，它自然应该成为 Agent 团队投入最多、最不愿交给厂商的一层。可就在大家开始谈 Harness Engineering 的时候，厂商也开始把 Harness 做成 SDK。

<!-- more -->

## Harness 为什么会被当成壁垒？

早期的模型 API 只负责一次 input 到 output。要让模型连续工作，团队得自己补 planner、tool loop、任务队列、retry、context summary、sandbox、approval 和 audit log。模型决定单步能力，Harness 决定这些能力能否在一个长任务里保持有效。

这也是 Harness Engineering 会流行的原因。Prompt 很容易复制，模型可以切换，围绕模型搭起来的执行系统看起来更接近产品积累。谁能让 Agent 多跑几十步而不迷路，谁就拥有更好的 Agent。

问题出在“壁垒”这个词。Harness 很重要，是一个工程事实；Harness 无法被替代，才是一个商业判断。两件事并不相等。

第一波 Agent SDK 已经把 agent definition、model call、tools、handoff、run history 和 tracing 变成了库的职责。[OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents/quickstart) 的入门路径就是 define、run，再逐步加入 tools 与 specialist agents。开发者仍然在设计 Agent，但不必重新实现每个 orchestration primitive。

[Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform) 在公布 Harness 对结果的影响之后，紧接着就把 agent loop 称为 reusable part。Conversation state、streaming execution、tool use、sandbox、approval policy 和跨 turn 工作，已经由 [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) 与 [app-server](https://learn.chatgpt.com/docs/app-server) 暴露给应用。Anthropic 也把 Claude Code 的 loop、context management、hooks、subagents、MCP、permissions 和 sessions 放进 [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)。

平台正在把一项重要能力做成标准件。于是第一个矛盾出现了：**如果别人能通过 SDK 获得同一套 Loop，它还是壁垒吗？**

## SDK 会先替代什么？

判断一套自研 Harness 还剩多少价值，可以先做一个替换测试：把 planner、tool loop、retry、context compaction、sandbox 和 approval 换成 Codex SDK 或 Claude Agent SDK，观察产品失去了什么。

如果系统只剩几段 prompt、tool wrapper 和 session 记录，过去的投入主要是在填 runtime 空白。平台补上这个空白以后，团队继续追赶的只是供应商会反复升级的通用机制。

如果 workflow state、业务工具、权限语义、artifact contract 和验收规则仍然存在，产品并不会跟着 Loop 一起消失。OpenAI 对边界的划分也是如此：Harness 可以复用，application 继续拥有 interface、context and tools、operational boundaries。

这里有一个很实用的规律：只要某项能力能跨公司复用，厂商就有动力把它放进 SDK。Planner 如何续跑、context 何时压缩、tool call 怎样恢复、sandbox 如何隔离，都有通用解。公司当然可以继续自研，但“代码在自己仓库里”不会自动产生差异。

过去的 Agent 团队因此开始分化。仍在维护通用 Loop 的团队会被平台挤压；深入 workflow 和业务语义的团队仍有位置；把精力转向 eval 与 ground truth 的团队，看起来离壁垒最远。

可如果 SDK 化会不断向上移动，Eval 会不会成为下一层？

## Verification Loop 也会被 SDK 化吗？

这个过程已经开始。[OpenAI 的 Agent Evals](https://developers.openai.com/api/docs/guides/agent-evals) 把 traces、graders、datasets 和 eval runs 连成一套产品。Trace 记录 model call、tool call、guardrail 和 handoff，grader 负责给行为打分，dataset 和 eval run 负责重复比较不同版本。连根据 dataset 自动改进 prompt，也已经进入 [Prompt Optimizer](https://developers.openai.com/api/docs/guides/prompt-optimizer)。

[LangChain AgentEvals](https://docs.langchain.com/oss/python/langchain/test/evals) 提供的能力更能说明趋势：trajectory 可以做 deterministic matching，也可以交给 LLM-as-judge。团队不用再从零写 trace collector、experiment runner、comparison dashboard 和常见 evaluator。

所以“我们有 Eval”很快也会变成一句分辨率不够高的话。Eval 至少包含两件完全不同的事：

- 运行评测的机制：怎样采集 trace、执行 grader、比较版本、发现 regression。
- 定义正确的依据：什么 case 有代表性、什么结果可以接受、哪种错误代价最高、需要什么证据才能结案。

前一部分正在 SDK 化。后一部分没有通用答案。

一个平台可以提供 `refund_order` 的 tool call trace，却不知道什么订单允许退款；可以提供代码 Agent 的 trajectory grader，却不知道一次 migration 是否保留了公司的兼容性承诺；可以生成 adversarial case，却不知道哪次历史事故必须永远留在 regression suite 里。

**Verification 的机器会商品化，定义“做对了”的权力不会。**

## Ground Truth 只是一份 Dataset 吗？

把壁垒简单移动到 eval dataset 仍然不够。静态 dataset 会过时，会被模型适配，也覆盖不了生产环境不断出现的新 failure mode。比一份静态 dataset 更难复制的，是公司持续生产 Ground Truth 的过程：

> 真实任务 → 生产结果 → 失败归因 → 专家裁决 → Ground Truth → Regression Gate → 下一轮生产结果

这条链从业务系统里的真实后果开始。退款是否造成损失，incident 是否复发，migration 是否引入兼容性问题，PR 上线后是否触发回滚，这些结果只有实际运行 workflow 的公司能看到。

专家裁决同样无法外包。两份看起来都正确的结果，哪一份符合公司的架构约束、风险偏好和服务承诺，需要领域专家作出判断，再把判断压缩成 fixture、golden output、schema、grader、test 或 artifact contract。这个过程和 {% post_link ground-truth-core-competency-of-ai-engineering 'Ground Truth：AI 时代最被低估的竞争力' %} 里讨论的是同一件事，也解释了 {% post_link agent-tdd-is-self-verification 'Agent 真的需要 TDD 吗？' %} 为什么最终落在外部验证，而不是让 Agent 自己宣布完成。

Eval framework 可以采购，grader 可以生成，甚至 case mining 也会逐步自动化。公司仍然要拥有真实结果的访问权、错误代价的定义权，以及把一次失败变成永久约束的能力。这三件事合在一起，才构成 Ground Truth 的生产系统。

## Harness Engineering 的边界在哪里？

走到这里，“Harness 是 Agent 的壁垒”已经不能简单回答 yes 或 no。

如果 Harness 指模型之外的一切，那么 workflow、eval 和 ground truth 都能被装进去，Harness 当然永远重要。但这种定义没有决策价值，它无法告诉团队下一行代码该自己写，还是交给 SDK。

更有用的划分是看一项能力能否被标准化：

| Harness 中的能力 | 会被 SDK 化的部分 | 公司必须保留的部分 |
| --- | --- | --- |
| 执行 | planner、Loop、retry、context、sandbox、approval | workflow state、业务语义、side-effect 边界 |
| 观察 | trace、artifact capture、failure clustering | 哪些行为值得观察，证据保存多久 |
| 评测 | grader runtime、dataset runner、版本比较 | representative case、rubric、threshold、错误成本 |
| 优化 | prompt optimizer、model router、自动 regression | 业务目标、可接受 trade-off、最终发布责任 |

表格左边每前进一步，Build / Buy 边界就向右移动一次。Harness Engineering 要持续识别这条边界，把工程投入放到厂商还无法替你定义的地方。

## 壁垒最后留下了什么？

Agent SDK 化之后是 Loop SDK 化，接下来是 Eval 与 Verification Loop SDK 化。任何可以被描述成通用机制的部分，迟早都会被平台吸收。Harness 对 Agent 的表现依然重要，但 Build / Buy 边界不会因为我们把模型之外的一切统称为 Harness 就停止移动。

每当团队准备自研一层 Harness，都可以先问：如果厂商下个月提供同等能力，系统还剩下什么？答案若只是 planner、trace collector 或 grader runner，这项优势不会持续太久。答案若是生产环境里的真实结果、专家裁决、业务约束，以及把失败写回 regression gate 的闭环，它才不会随着 SDK 升级消失。

**Harness 还是 Agent 的壁垒吗？**
