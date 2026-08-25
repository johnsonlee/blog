---
title: /goal 如何做到 7×24 小时推进目标？
date: 2026-08-25 01:30:00
categories:
  - Harness Engineering
tags:
  - AI
  - Codex
  - Claude Code
  - Agent
  - Harness Engineering
  - Eval
i18n_key: how-goal-keeps-agents-working
---

所有把长任务交给 Agent 的人，都经历过同一个早晨。

睡觉前把任务交给 Agent，期待它趁人休息时继续推进。第二天醒来，Agent 早就停了，却留下一份煞有介事的总结：任务已经完成。打开代码一看，连 10% 都没做完。

这不是偶发，是每次、每次、每次。问题不只在模型偷懒。普通 Agent 默认只管这一轮回答，回答结束，它就把任务也算作结束。`/goal` 要解决的，是人离开以后，谁来检查原始目标到底完成没有，没完成又由谁启动下一轮。

<!-- more -->

## Agent 为什么总在 10% 的地方停下

普通 prompt 只管当前 turn。Agent 读完要求，改几个文件，跑一部分测试，再写一份总结，这轮回答就结束了。原始目标还剩多少，通常还是它自己说了算。

这等于让干活的人自己验收自己。代码改过、命令跑过、文档搭了框架，只要足够写出一份像样的总结，Agent 就很容易把“已经回答”当成“已经完成”，哪怕九成要求还没做。

自动回复一句“继续”，也只是多开一轮。系统没有记住什么时候才算完成，下一轮也不会先查上一轮漏了什么。{% post_link fooled-by-loop-engineering '《别被 Loop Engineering 忽悠瘸了》' %}里说的就是这个问题：Loop 只会再按一次 Enter，不能保证 Agent 还在做最初交代的事。

长任务不需要一轮回答永远不结束。它需要一个跨 turn 保留下来的目标，并且只有达到停止条件才能退出。

## `/goal` 不是 prompt，而是持久化状态机

Codex 已经开源，`/goal` 的实现就在 [`codex-rs/ext/goal`](https://github.com/openai/codex/tree/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal)。打开代码，最先看到的不是一段让模型“更努力”的 prompt，而是 Goal 被写成了 thread 上的持久化状态。

TUI 收到 `/goal <objective>` 后，通过 `thread/goal/set` 写入 objective，并把状态设为 `active`。[SQLite 里的 `thread_goals`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/state/src/model/thread_goal.rs#L60-L71)会保存 `goal_id`、objective、status、token budget、tokens used 和 time used。状态一共有六种：`active`、`paused`、`blocked`、`usage_limited`、`budget_limited`、`complete`。

区别就在这里。Prompt 的作用到当前 turn 为止，Goal 却跟着 thread 保存。模型输出 final answer，不会顺手把 Goal 删掉。只要状态还是 `active`，这一轮结束了，任务也不会跟着结束。

源码里的控制链很短：

```text
/goal <objective>
  -> thread/goal/set
  -> SQLite: status = active
  -> worker turn 结束，thread 进入 idle
  -> GoalExtension::on_thread_idle
  -> GoalRuntimeHandle::continue_if_idle
  -> start_turn_if_idle(continuation prompt)
  -> 下一轮
```

负责接力的是 [`on_thread_idle`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/extension.rs#L148-L160) 和 [`continue_if_idle`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/runtime.rs#L362-L440)。Thread 一空闲，runtime 就重新读取 Goal。状态还是 `active`，便调用 `start_turn_if_idle(...)` 开始下一轮；状态已经变成 `complete`、`blocked`、`paused`，或者碰到限制，才停下来。

所以 `/goal` 所谓的 7×24，并不是一次模型调用连续跑 24 小时。**一轮停下以后，外部 runtime 会再开一轮。**

## 下一轮拿到的不是一句“继续”

新 turn 启动时，Codex 会注入一份 [`continuation.md`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/templates/goals/continuation.md)。它不只包含原始 objective 和剩余 token budget，还给下一轮一套明确的工作协议。

这份协议要求 Agent：

- 以当前 worktree 和外部状态为准，不能只相信上轮总结；
- 先把上一轮归类为有效进展、经过验证的等待，或没有进展；
- 保留原始目标，不能为了方便交付而缩小范围；
- 从 objective、spec、issue 和用户要求中重新拆出逐项验收条件；
- 为每一项找到能够证明它的文件、命令输出、测试结果、运行行为或其他权威证据；
- 证据缺失、间接或范围不匹配时，继续工作，不能宣布完成。

这和自动补一句“继续”不是一回事。下一轮不能照着上轮总结往下编，而要先看代码、测试和外部状态，再回答一个问题：原始目标里还有哪一项拿不出证据？

假设任务是把 JavaScript 项目迁移到 TypeScript，同时要求行为一致、strict mode 编译通过、能够回滚。第一轮让编译通过，只完成了其中一项。下一轮还要补 contract tests；行为测试发现兼容性问题，就继续修；最后还要真的走一遍 rollback。少一项证据，任务就不能算完成。

Python SDK 还会把底层的多个 physical turns 合并成一个 logical turn。测试 [`test_private_goal_operation_coalesces_runtime_continuations`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/sdk/python/tests/test_app_server_goal_operations.py#L18-L90) 里，底层发起了多次模型请求和自动 continuation，调用方却只收到一次 `turn/started` 和最后一次 `turn/completed`。用户不用反复输入“继续”，看到的就是一项持续到 Goal 结束的任务。

## Codex 和 Claude Code 走了两条路

Codex 和 Claude Code 都有 `/goal`，但不是同一套实现。它们都不再把“turn 结束”当成“Goal 结束”，接下来怎么判断、怎么续跑，却走了两条路。

### Codex：状态还 active，就再启动一轮

Codex 没有另起一个 Goal judge。Completion audit 写在 continuation prompt 里，仍由干活的 Agent 自己做。

Agent 认为目标已经达成时，会调用 [`update_goal({ status: "complete" })`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/spec.rs#L60-L93)。这个工具只允许 Agent 写入 `complete` 或 `blocked`。如果 Agent 没有调用它，Goal 保持 `active`，turn 结束后 runtime 就会继续启动下一轮。

第一次遇到困难，也不能马上写 `blocked`。同一个 blocker 必须连续出现至少三个 Goal turns，而且没有用户输入或外部状态变化就确实无法继续，才能标记 `blocked`。只是难、慢、不确定，或者觉得“最好问一下”，都不算。

不过这些限制都写在 prompt policy 里，不是形式化证明。[`update_goal` 的 Rust executor](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/tool.rs#L228-L298) 只检查 status 能不能写，不会替 Agent 重跑测试，也不知道 objective 是否逐项满足。Agent 过早调用 `complete`，数据库照样接受，runtime 也会停止续跑。

### Claude Code：每轮结束，都换一个模型验收

[Claude Code 的 `/goal`](https://code.claude.com/docs/en/goal) 是 session-scoped 的 [prompt-based Stop hook](https://code.claude.com/docs/en/hooks-guide#prompt-based-hooks)。设置 Goal 会立即启动 worker；worker 每次结束 turn，Claude Code 都把 completion condition 和截至当前的 conversation 交给一个 fresh evaluator。Claude API 默认使用 Haiku，也可以通过 small fast model 配置替换。

```text
/goal <condition>
  -> worker 执行一轮
  -> Stop hook 启动 fresh evaluator
  -> Not yet met：reason 交给 worker，开始下一轮
  -> Met：清除 Goal，记录 achieved
  -> Impossible：清除 Goal，记录 failed + reason
```

这个 evaluator 不能调用工具，也不能读文件，只能检查 worker 放进 conversation 的证据。所以 Claude Code 要求 condition 写清 measurable end state、验证方法和不能破坏的约束，例如“`npm test` 返回 0，而且没有修改其他 test files”。Worker 没把完整测试结果放进 transcript，evaluator 就不知道代码里到底发生了什么。

后台任务还在跑时，Claude Code 会跳过这一轮 evaluation。第一次 check-in 默认等 30 分钟，之后拉长到 1 小时、2 小时；interactive session 空闲时，也可以自己发起 check-in turn。反过来，如果 Claude 连续几轮只回答 evaluator，却没有任何 tool use，Stop hook 会触发 block cap，把控制权还给用户，但保留 Goal。否则两个模型可能一直互相说“继续”，什么也没做。

Resume session 会恢复仍然 active 的 Goal，但 turn count 会清零，timer 和 token-spend baseline 也会从恢复时重新起算。`/goal` 不会修改 permission mode。想让工具无人值守地执行，还要打开 auto mode，否则权限确认仍会把任务卡住。

![Codex 与 Claude Code 的 Goal 控制回路](/images/goal-runtime-comparison.svg)

Codex 用持久化状态和 idle callback 做到“不显式 complete 就继续”，完成审计仍由 worker 负责。Claude Code 则在每个 Stop 边界叫来一个 fresh model，单独判断 condition 是否满足。

所以 `/goal` 并不保证目标一定完成。它改变的是默认行为：**以前回答结束就退出；现在停止条件没满足，就再开一轮。**

## Goal 判断和 deterministic verifier 到底差在哪

既然 Agent 会做 completion audit，Agentic Engineering 还需要 eval 和 verifier 吗？

当然需要，而且少一个都不行。`/goal` 管的是控制流：什么时候继续，什么时候停止。Verifier 管的是事实：某个条件到底有没有满足。Eval 管的是标准：哪些样本、边界和质量门槛必须检查。

| 组件 | 回答的问题 | 典型产物 |
| --- | --- | --- |
| Eval | 什么才算做对？ | cases、rubric、threshold、acceptance criteria |
| Verifier | 当前结果是否通过某个检查？ | exit code、测试报告、截图、schema diff、人工结论 |
| Goal completion audit | 这些证据是否覆盖了整个原始目标？ | 继续、完成、不可达或 `blocked` |

Deterministic verifier 直接检查结果。完整 test suite 的 exit code、文件 hash、schema invariant、页面有没有越界，都能给出稳定、可复查的答案。Completion audit 做的是语义判断：这些测试覆盖了用户要求的全部范围吗？十个局部检查全绿，会不会还漏了一个根本没写进测试的交付物？

两者不能互相替代。能写成确定性判断的停止条件，尽量交给 verifier。例如“持续修复，直到完整 test suite 返回 0”，最可靠的办法就是让程序读 exit code。需求有没有覆盖完整、代码是否易读、页面视觉是否合格，这些无法完全形式化的部分，再由 Agent 根据 rubric、视觉 review 或人工反馈来判断。

![Goal、Eval 与 Verifier 的分工](/images/goal-control-loop.svg)

Codex 的 continuation prompt 要求先确认 tests、manifests、verifiers 和 green checks 覆盖了对应 requirement，它们才能算 evidence。Claude Code 的 evaluator 看不到工具和文件，这个问题更明显：没有 verifier 把结果送进 conversation，fresh model 只能听 worker 怎么说。反过来，没有 eval，verifier 也可能一直在检查错误的标准。

这也是{% post_link ground-truth-core-competency-of-ai-engineering '《Ground Truth：AI 时代最被低估的竞争力》' %}和{% post_link agent-tdd-is-self-verification '《Agent 真的需要 TDD 吗？》' %}讨论的同一个问题：Agent 可以判断证据是否覆盖完整，却不能靠一份完成总结制造 ground truth。

## 7×24 不等于永远不停

`/goal` 的“7×24”有三个前提：Goal 能跨 turn 保存；一轮结束后还有外部触发器接手；停止条件没满足，触发器就能启动下一轮。Codex 用 thread idle callback，Claude Code 用 Stop hook。

电脑关机或进程退出，本地任务当然会停。两者都能在 session 恢复后重新载入 active Goal，但如果要求任务在未来某个时间自动醒来，那是 [OpenAI Scheduled tasks](https://learn.chatgpt.com/docs/automations) 或 [Claude Code scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) 的职责，不是 Goal loop 自己能做的事。

它也不会无限跑下去。Codex 碰到 token budget、usage limit 或无法恢复的 turn error 会切换状态；Claude Code 在自行管理凭据时遇到认证失败，或者遇到余额耗尽、无法恢复的 context overflow、模型不可用，会清除 Goal，连续几轮没有 tool use 则暂停 loop。用户也可以随时 pause、clear 或中断。

回到睡觉前交出去的那个任务。普通 Agent 在 10% 的位置写完总结，系统便认为工作结束。`/goal` 下，final answer 只结束当前 turn。只要 Goal 还是 `active`，runtime 就会把原始 objective、剩余预算和完成审计重新送进下一轮。

区别不在 Agent 突然变得可靠，而在系统不再接受它说完就走。目标会被保存，没达到就继续，什么时候停也有明确规则。因此，`/goal` 才能把一个长任务留在后台持续推进。

## Sources

本文源码分析基于 OpenAI Codex commit [`68301fa`](https://github.com/openai/codex/commit/68301fa45f0d8b692ff821c20073e747fe19250d)，2026-08-25。

- [OpenAI Codex: Goal extension](https://github.com/openai/codex/tree/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal)
- [OpenAI Codex: persisted Goal state](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/state/src/runtime/goals.rs)
- [OpenAI Codex Python SDK: coalescing physical turns](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/sdk/python/src/openai_codex/_goal.py)
- [OpenAI: Long-running work](https://learn.chatgpt.com/docs/long-running-work)
- [OpenAI: Scheduled tasks](https://learn.chatgpt.com/docs/automations)
- [OpenAI: Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- [Anthropic: Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)
- [Anthropic: Prompt-based hooks](https://code.claude.com/docs/en/hooks-guide#prompt-based-hooks)
- [Anthropic: Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)
