---
title: Agent 真的还需要自研吗？
date: 2026-08-23 21:16:24
categories:
  - Harness Engineering
tags:
  - AI
  - Agent
  - Agentic Coding
  - Codex
  - Software Engineering
i18n_key: agent-loop-is-not-the-moat
---

把一年前的 Agent 项目 backlog 和今天的 Codex SDK 放在一起看，会有点尴尬。

当时团队要自己写 planner、tool loop、任务队列、retry、context summary、sandbox 和 approval。现在 OpenAI 把 Codex 的 harness 做成了 SDK 和 app-server，Anthropic 也把 Claude Code 的 agent loop 做成 Agent SDK。原来要养一支团队才能拼起来的执行层，正在变成几行初始化代码。

那最早那批自研 Agent 的团队，是不是该停了？

<!-- more -->

## SDK 都能跑 Loop 了，还自研什么？

按最直观的 Build / Buy 逻辑，答案似乎很简单：停掉。

早期自研 Agent 的价值很大一部分来自 runtime。模型不会自己连续工作，团队就写循环；工具调用不稳定，就补 schema、重试和错误恢复；上下文会爆，就做 summary；执行可能越界，再加 sandbox、approval 和 audit log。这些东西当时值得做，因为买不到。

现在可以买到了。[Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) 能从应用代码里启动、继续和恢复 Codex thread；[Codex app-server](https://learn.chatgpt.com/docs/app-server) 进一步处理 authentication、conversation history、approvals 和 streamed agent events。OpenAI 在 [Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform) 里列出的 conversation state、streaming execution、tools、sandbox、approval policy 和跨 turn 工作，几乎就是早期 Agent 团队的 runtime backlog。

Anthropic 也在做同一件事。[Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) 把 Claude Code 里的 agent loop、context management、tools、hooks、subagents、MCP、permissions 和 session 暴露成 Python / TypeScript 库。直接调模型 API，开发者自己实现 tool loop；使用 Agent SDK，库替开发者运行 loop。

如果团队仍把主要精力花在 planner 怎么写、tool call 怎么串、session 怎么续、approval 怎么暂停恢复，它确实在和平台重复建设。除非 runtime 本身就是产品，大多数公司都不该继续从零造这一层。

到这里，“不用自研”看起来已经成立了。可它解释不了一个现象：既然通用 loop 越来越容易获得，为什么 GitHub、Cursor 和 Devin 做出来的 Agent 仍然不是同一个东西？

## 同样会跑，为什么做不出同样的结果？

[GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) 生活在 GitHub 的工作流里。它从 issue 或 PR comment 接到任务，在 GitHub Actions 环境里读 repo、建 plan、开 branch、跑 test 和 linter、写 commit、开 PR，再把控制权交给 review。模型会不会调用工具，只是这条链的起点。

[Cursor Cloud Agents](https://cursor.com/docs/cloud-agent) 跑在隔离 VM 里，接入团队配置的 MCP server 和 hooks，最后交回 PR、screenshot、video、log，以及可远程接管的桌面。它解决的不只是“让 Agent 多跑几步”，还包括人怎样接手、怎样复核改动、怎样看到验证证据。

[Devin](https://devin.ai/) 则把 multi-repo、code migration、incident triage、Slack、Datadog、Linear、tribal knowledge 和 automations 放在一起。Cognition 强调 Devin 工作在团队已有的 codebase 和工具里，因为企业买的不是一段抽象的循环，而是一个能进入现有工程流程的执行者。

如果 loop 就是 Agent 产品的全部，这些差异都不该存在。它们已经使用相似的基础能力，价值却落在不同位置：任务从哪里进入，执行时能看见什么，哪些动作需要批准，结果以什么 artifact 返回，又由谁验收。

这时原来的问题第一次需要改写。SDK 商品化的只是“怎么让模型继续跑”，企业面对的是“它在什么工作里跑”。前一个问题属于 runtime，后一个问题属于 workflow。

两者的边界在哪里？最直接的办法不是争论架构，而是做一次替换。

## 把自研 Loop 拔掉，项目还剩什么？

把自研 coding loop 换成 Codex SDK 或 Claude Agent SDK。如果任务只发生在标准工程流程里，甚至可以换成 GitHub Copilot cloud agent 或 Cursor Cloud Agents。然后看系统还剩什么。

如果只剩几段 prompt、几个 tool wrapper 和一堆 session 记录，这个项目过去填补的是 runtime 空白。平台把空白补上以后，它的价值自然会缩水。继续投入，相当于用内部团队追赶供应商每个月都在更新的通用能力。

如果拔掉 loop，系统仍然保留业务对象的状态机、权限边界、MCP tool、approval policy、eval dataset、golden output、artifact schema、trace grader、cost router，以及回写系统 of record 的契约，情况就不同了。这些资产不随底层 Agent 消失，换任何模型和 runtime 都还需要。

这个测试也解释了最早那批团队现在的去向。维护通用 planner、memory、retry、sandbox 和 queue 的团队正在被挤压；掌握 ticket、incident、contract、release 或 invoice 状态机的团队，逐渐变成 workflow team；把“做对”写成 dataset、schema、grader 和 test 的团队，则在建设 ground truth。

于是问题又收窄了一层：既然不是所有自研资产都会被 SDK 替代，**哪些东西必须由公司自己拥有？**

## 自研的边界，不等于代码的边界

OpenAI 在平台文章里把 application 的责任写成 interface、context and tools、operational boundaries。Codex 可以运行 harness loop，却不知道一家公司如何定义“可以退款”“事故已经解除”或“这个 PR 能够合并”。这些判断不会随着 SDK 一起交付。

先看一个 `refund_order` 工具。对 runtime 来说，它只是一次 tool call；对业务系统来说，它同时包含操作者权限、退款上限、订单状态、风控规则、审计记录和失败后的补偿。公司可以让 SDK 负责调用，却不能把这些语义交给 SDK 猜。Tool 和 data access 因此必须由公司定义。

只有工具还不够。Agent 还要知道当前是 draft 还是 approved，是 investigation 还是 execution，是 recommendation 还是 action。很多看起来像推理错误的问题，其实是系统没有提供 workflow state。状态机决定它什么时候继续、暂停、回滚或交给人，也只能从真实业务里长出来。

即使状态正确，团队还需要回答“这次到底做对没有”。没有 eval，效果提升只剩体感；没有 trace，失败只剩聊天记录；没有 artifact contract，Agent 声称验证过也无法复核。[OpenAI 的 agent eval 文档](https://developers.openai.com/api/docs/guides/agent-evals) 把 trace、grader、dataset 和 eval run 连在一起，就是要把一次 workflow 的行为变成可比较的证据。这个方向和 {% post_link ground-truth-core-competency-of-ai-engineering 'Ground Truth：AI 时代最被低估的竞争力' %} 是同一条线：Agent 越会执行，团队越要明确它向什么标准负责。

最后是 product surface。让用户面对空白聊天框写 prompt，和让用户在 incident 页面点击“调查这个告警”，不是两种皮肤。后者能把业务对象、当前状态、日志、权限和允许的下一步一起交给 Agent，也能把结果放回原来的决策现场。

走到这里，Agent 系统才自然拆成五层：

| 层级 | 现在该不该自研 | 原因 |
| --- | --- | --- |
| 通用 loop / runtime | 尽量买或复用 | SDK、CLI、cloud agent 已经覆盖大部分通用能力 |
| Tool 和 data access | 必须自己拥有 | 外部厂商不知道你的系统边界、数据口径和权限模型 |
| Workflow state | 必须自己拥有 | 业务对象的状态机、gate 和 rollback 只能从业务里长出来 |
| Ground truth / eval | 必须自己拥有 | “做对”的答案来自真实样本、历史事故、schema 和业务约束 |
| Product surface | 取决于是否核心 | 如果 Agent 是产品体验的一部分，界面、审批和 artifact 必须贴合工作流 |

第一层的代码可以不属于公司，后四层的判断必须属于公司。这就是 Harness Engineering 的边界。它关心的不是 loop 由谁写，而是谁定义工作对象、动作空间、状态转换、验收证据和人的接管点。

这也修正了对“自研”的理解。拥有一层能力，不等于每行代码都要自己实现；采用 SDK，也不等于把系统责任外包。Build / Buy 决策应该跟着判断权走，而不是跟着代码仓库走。

这和 {% post_link what-engineers-are-still-for '还要工程师干什么？' %} 里的判断一致。Agent 可以持续执行，但 goal 不会自己变成 gate。业务里的“可信”、工程里的“可维护”、安全里的“不泄露”，都要由工程系统压缩成机器可以执行和验证的标准。

## Agent 真的还需要自研吗？

现在可以回到开头那份 backlog 了。

如果项目的核心仍是 planner、tool loop、memory、approval 和 sandbox，大多数团队应该迁移到 SDK。继续自研通用 runtime，越来越像为了证明自己懂云原生而重写 Kubernetes scheduler。

如果替换 runtime 以后，workflow、tools、permission、ground truth、eval 和 artifact contract 仍然成立，这套系统就值得继续投入。更成熟的设计还应该主动让底层 Agent 可替换：今天用 Codex，明天换 Claude 或内部模型，业务状态和验收标准都不必跟着重写。

所以答案仍然是“需要”，但这已经不是开头那个问题里的“自研”。开头的问题是：平台有 Agent 了，公司还要不要自己做一个？做完替换测试以后，问题会变成：**哪些判断一旦交给平台，公司就失去了定义自己工作方式的能力？**

前一个问题在比较代码量，后一个问题在划分系统责任。Codex SDK 给出执行层；值得公司掌握的，是让任何执行层都只能在正确状态、正确权限和可验证标准下工作的 harness。
