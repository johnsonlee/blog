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

过去一年，很多公司的 Agent 项目第一版长得都差不多：一个 planner，一个工具调用层，一个任务队列，一个 retry 机制，再配几段 prompt，把工作目录、浏览器、企业系统和审批流接起来。那时看起来很先进，因为大家都在从零拼一套能跑起来的 loop。

到 2026 年 8 月再看，公开产品反而越来越像。OpenAI 把 Codex harness、SDK 和 app-server 摆出来，Anthropic 把 Claude Code 的 agent loop 做成 Agent SDK，GitHub 和 Cursor 把后台工程 Agent 接进 branch、PR、artifact 和 review。最早那批自研 Agent 团队没有集体消失，但很多人的问题变了：他们不再缺一个会循环的 Agent，缺的是一个值得循环的工作系统。

<!-- more -->

## 先商品化的是通用 Loop

早期自研 Agent 的价值很大一部分来自 runtime。模型不会自己连续工作，你得写循环；工具调用不稳定，你得写 schema、重试和错误恢复；上下文会爆，你得写 summary；执行会越界，你得写 sandbox、approval 和 audit log。

这些东西当时值得做，因为买不到。

现在情况变了。[Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) 已经能从应用代码里启动、继续和恢复 Codex thread；[Codex app-server](https://learn.chatgpt.com/docs/app-server) 面向更深的产品集成，处理 authentication、conversation history、approvals 和 streamed agent events；OpenAI 在 [Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform) 里直接把 harness 说清楚：conversation state、streaming execution、tools、sandbox、approval policy、跨 turn 工作，这些都属于可复用的 Agent loop。

Anthropic 也在同一方向走。[Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) 把 Claude Code 里的 agent loop、context management、tools、hooks、subagents、MCP、permissions 和 session 暴露成 Python / TypeScript 库。它甚至明确区分了两件事：直接调 API，是你自己实现 tool loop；用 Agent SDK，是库替你跑 loop。

这就是分界线变化的地方。

过去自研 Agent 是在补基础设施空白。现在如果一个团队还把主要精力花在 planner 怎么写、tool call 怎么串、session 怎么续、approval 怎么暂停恢复，就要先问一个残酷的问题：**这套 runtime 是产品差异，还是历史包袱？**

## 活下来的团队都在往 Workflow 里钻

看几个公开形态就很明显。

[GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) 的关键不是它能调用模型，而是它直接生活在 GitHub 里：读 repo、建 plan、开 branch、跑 test 和 linter、写 commit、开 PR、等 review。它的执行环境是 GitHub Actions，入口是 issue、PR comment、GitHub.com、VS Code、Slack 或 automation。

[Cursor Cloud Agents](https://cursor.com/docs/cloud-agent) 也是同一个方向。它们跑在隔离 VM 里，能并行工作，能用 team 配置的 MCP server，能执行 hooks，最后产出 PR、screenshot、video、log 和可远程接管的桌面。这里真正值钱的不是循环，而是 Agent 跑完以后，团队能不能复核它到底改了什么、怎么验证的、有没有带着 artifacts 回来。

[Devin](https://devin.ai/) 的包装更直白：multi-repo、code migration、incident triage、Slack、Datadog、Linear、tribal knowledge、automations。Cognition 自己的网站说 Devin 工作在团队已有的 codebase 和工具里。换句话说，它卖的不是另一个通用聊天框，而是把 Agent 塞进企业工程流程。

这些产品都指向同一件事：**Agent 正在从聊天窗口，搬进真实 workflow 的执行路径里。**

所以那些自研团队现在大概分成三类。

第一类还停在通用 runtime。他们维护 planner、memory、tool registry、retry、sandbox、权限和队列。短期看有用，长期会越来越累，因为模型厂商和开发工具厂商正在把这些能力直接打包成 SDK、CLI、cloud agent 和 app-server。

第二类已经变成 workflow team。他们关心某个业务对象的状态机，知道 ticket、incident、shipment、contract、PR、release、invoice 分别有哪些 gate，哪些 action 需要审批，哪些结果必须回写系统 of record。这类团队反而变重要了。通用 Agent 不知道公司内部 workflow 的真实边界。

第三类在做 ground truth 和 eval。他们不再争论 prompt 哪个更优雅，而是把“做对”翻译成 fixture、golden output、schema、trace grader、privacy scanner、architecture test、mutation test 和 cost budget。这个方向和我之前写的 {% post_link ground-truth-core-competency-of-ai-engineering 'Ground Truth：AI 时代最被低估的竞争力' %} 是同一条线：Agent 越会干活，越需要外部标准让它认账。

把视角拉回那批自建项目，结论不是死了，也不是都赢了。**靠自研 loop 吃饭的团队在被挤压，靠 workflow、context 和 ground truth 吃饭的团队在变成核心平台。**

## Codex SDK 改的是 Build / Buy 边界

Codex SDK 出来以后，最容易得出的朴素结论是：平台都把执行层做出来了，企业没必要再养 Agent 团队。

这个结论对一半。

不该再自研的，是通用 coding Agent runtime。启动任务、维持 thread、读写文件、跑命令、调用工具、处理审批、跨 turn 恢复、流式回传进度，这些能力如果不是你的产品本体，就不应该继续从零造。否则团队会陷入一种很尴尬的状态：你花半年追上别人上个月已经开放的基础设施，追上时对方又把下一层也 SDK 化了。

但这不等于公司不需要自研 Agent 系统。Codex 解决的是执行循环，不替你定义业务边界。

OpenAI 自己在平台文章里也把边界画得很清楚：application 仍然拥有 interface、context and tools、operational boundaries。也就是说，Codex 可以提供 harness loop，产品必须提供业务上下文、工具、权限、审批和结果落点。

这和 {% post_link what-engineers-are-still-for '还要工程师干什么？' %} 里的判断一致。Agent 可以不眠不休地执行，但 goal 不会自己变成 gate。业务里的“可信”、工程里的“可维护”、安全里的“不泄露”，都要有人压缩成机器能执行的标准。

所以问题要换一层：

**你到底在自研 Agent 的哪一层？**

## 不能外包的几层

可以把 Agent 系统拆成五层来看。

| 层级 | 现在该不该自研 | 原因 |
| --- | --- | --- |
| 通用 loop / runtime | 尽量买或复用 | SDK、CLI、cloud agent 已经覆盖大部分通用能力 |
| Tool 和 data access | 必须自己拥有 | 外部厂商不知道你的系统边界、数据口径和权限模型 |
| Workflow state | 必须自己拥有 | 业务对象的状态机、gate 和 rollback 只能从业务里长出来 |
| Ground truth / eval | 必须自己拥有 | “做对”的答案来自真实样本、历史事故、schema 和业务约束 |
| Product surface | 取决于是否核心 | 如果 Agent 是产品体验的一部分，界面、审批和 artifact 必须贴合工作流 |

第一层正在商品化，后四层才是 Harness Engineering 的主战场。

Tool 层看起来只是接 API，其实是业务语义的压缩。一个 `refund_order` 工具不只是 HTTP call，它隐含了谁能退款、金额上限、订单状态、风控规则、审计记录和异常补偿。工具暴露得太粗，Agent 没法做细判断；暴露得太散，Agent 会在动作空间里乱撞。

Workflow state 决定 Agent 在什么时候该继续、暂停、回滚或交给人。很多自研 Agent 翻车，不是模型不会推理，而是系统没有明确告诉它“现在处于哪一个状态”。它把 draft 当成 approved，把 investigation 当成 execution，把 recommendation 当成 action。这不是 prompt 问题，是状态机缺失。

Ground truth 决定团队能不能迭代。没有 eval，所谓效果提升就是体感；没有 trace，失败就只剩一段聊天记录；没有 artifact contract，Agent 说自己验证过也没法复核。[OpenAI 的 agent eval 文档](https://developers.openai.com/api/docs/guides/agent-evals) 也把路径放在 trace、grader、dataset 和 eval run 上。它不是写一份“Agent 表现不错”的报告，而是把一次 workflow 的行为变成可比较的证据。

Product surface 则决定人和 Agent 的关系。让用户从空白聊天框开始写 prompt，和让用户在 incident 页面点“调查这个告警”，给 Agent 的上下文完全不同。前者让人负责拼装任务，后者由产品把对象、状态、日志、权限和下一步动作一起递过去。

**Agent 的差异开始从 loop 本身，转移到 loop 外面的业务现实。**

## 一个判断测试

判断一个自研 Agent 项目该不该继续，有个简单测试：把你们自研的 coding loop 删掉，底层换成 Codex SDK 或 Claude Agent SDK；如果只是工程任务，也可以直接交给 GitHub Copilot cloud agent 或 Cursor Cloud Agents 这类 hosted coding agent。系统还剩多少价值？

如果删掉 loop 以后，剩下的只有几段 prompt、几个工具 wrapper 和一堆 session 记录，那这套系统大概率没有护城河。它只是在模型厂商还没把 runtime 包好之前，临时补了一段脚手架。

如果删掉 loop 以后，剩下的是一整套业务状态机、权限边界、MCP tool、approval policy、eval dataset、golden output、artifact schema、trace grader、cost router 和回写系统 of record 的契约，那它就值得继续做。因为这些东西换任何底层 Agent 都需要。

更进一步，好的自研系统应该主动让底层 Agent 可替换。今天是 Codex，明天可能是 Claude，后天可能是内部模型或某个垂直 Agent。只要 workflow、tools、ground truth 和 artifact contract 稳住，底层 loop 的替换应该像换执行引擎，而不是重写整套系统。

很多团队会在这里误判。他们以为自研 Agent 是为了掌控更多，可一旦把 runtime 和业务系统焊死，系统反而更被动。掌控感不来自全部自己造，而来自知道哪一层必须拥有，哪一层应该随时替换。

## 自研 Agent 的终点不是 Agent

把这条线拉回企业技术决策，Codex SDK 的出现并没有把自研 Agent 这件事清零，它只是改变了自研的对象。

答案是：需要，但目标变了。

如果自研的意思是再写一套通用 planner、tool loop、memory、approval 和 sandbox，那大多数团队都不该继续。那是一条正在被平台吃掉的路，越往后越像自研 Kubernetes scheduler 来证明自己懂云原生。

如果自研的意思是把公司的 workflow、context、tools、permission、ground truth、eval 和 artifact contract 做成一个能让任何强 Agent 安全工作的系统，那不仅需要，而且会越来越重要。

过去 Agent 团队的核心问题是“怎么让模型自己干活”。现在这个问题正在被平台回答。下一层问题更难：**怎么让一个越来越能干的系统，只在正确的边界里干正确的事。**

这才是 Harness Engineering 的位置。

Codex SDK 给的是执行层，不是判断层。真正值得自研的，是那套能定义方向、边界、责任和证据归档的系统。
