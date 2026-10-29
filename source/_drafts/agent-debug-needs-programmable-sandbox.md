---
title: Agent 工作流需要的是可编程沙盒
date: 2026-10-29 20:30:00
categories:
  - Harness Engineering
tags:
  - AI
  - Agentic Coding
  - Debugging
  - Replay
  - Sandbox
  - Mocking
i18n_key: agent-debug-needs-programmable-sandbox
---

做 Agentic workflow 最折磨人的，是你很难让 Agent 把同一个错误再犯一次。

一次任务跑到第三个 handoff 时出错。你改了一句 prompt，重新跑，错误消失了，却不知道是修复生效，还是模型这次恰好选了另一条路。再跑一次，原来的问题没出现，tool response 又变了。传统 debug 靠固定输入缩小变量，Agent 每次重跑却都在制造新的变量。

Agentic Coding 缺的是一种可编程沙盒。它既隔离 Agent 与真实环境，又接管沙盒内的 model、tool、网络、时间和文件系统等变量，按需返回历史结果或 mock 结果。Agent 仍然调用同一套接口，workflow 不需要为了测试而改写，却能恢复到出错前的状态，只放开一个变量重新运行。

<!-- more -->

## 为什么同一个错误很难再出现

普通程序出了 bug，最重要的第一步是复现。输入相同，环境相同，代码相同，错误最好也相同。这样才能加断点、改一处代码，再确认错误是否真的消失。

Agentic workflow 把这条前提打碎了。模型采样会变，context compaction 会变，tool 返回的网页、数据库和文件会变，retry 次数和并发顺序也会变。哪怕 temperature 设成 0，托管模型的执行也不该被当成 bitwise deterministic。

[OpenAI Agents SDK 的 tracing](https://openai.github.io/openai-agents-python/tracing/)已经可以记录 generation、tool call、handoff 和 guardrail。这很有用，但 trace 解决的是“刚才发生了什么”。你改完代码再点一次 run，模型和工具仍会重新执行，得到的是一条新 trajectory，不是旧 trajectory 上的实验。

日志可以帮助尸检，不能替你固定现场。

## 回到过去只解决了一半

传统的 record-and-replay debugger 早就处理过类似问题。[rr](https://rr-project.org/) 在录制阶段捕获进程从 kernel 收到的输入，以及 CPU 的非确定性结果；回放时把这些结果原样喂回去，于是程序可以沿着同一条指令路径反复运行，甚至倒着 debug。

把这个思路搬到 Agent 上，可以直接把模型视为一个非确定性 I/O 边界。一次 model response 和一次 HTTP response、一次系统时间读取没有本质区别：第一次执行时记录结果，回放时直接返回旧结果。

但 debug 不只需要复现过去，还需要构造过去没有发生过的条件：让 API 超时，让 tool 返回 malformed result，让模型使用修复后的实现，同时让其他边界继续返回历史结果。Replay 固定已经发生的事实，mock 控制接下来允许变化的变量。

需要录下来的不只是 conversation：

- 每次 model call 的完整输入、输出、model version 和参数；
- 每次 tool call 的参数、返回值、错误、耗时和 side-effect receipt；
- prompt、Skill、MCP、tool schema、checker 和 orchestration 的版本；
- 文件系统、数据库、浏览器、环境变量和外部资源的 snapshot 或内容地址；
- 时间、随机数、重试、并发顺序与人工 approval。

[Temporal 的 workflow replay](https://docs.temporal.io/workflows)提供了一个很好的工程参照。Workflow code 会根据 Event History 重新执行，已经完成的 Activity 不会再次访问外部世界，而是直接复用历史结果。LLM invocation、API、数据库和文件 I/O 都应该放在这样的非确定性边界之外。

可编程沙盒就在这些边界上做透明拦截。它可以让一次调用 live 执行，也可以返回历史值、合成值或故障。沙盒内的 Agent 仍以为自己在访问真实的 model、tool 和环境，不需要知道结果来自 replay 还是 mock。

**Sandbox mock 的对象不是 Agent，而是 Agent 能观察到的世界。**

![可编程沙盒如何在 Agent 无感的情况下控制环境变量](/images/agent-programmable-sandbox.svg)

Agent 只看到一个正常返回的接口。Sandbox 才知道这次 response 来自历史记录、真实执行、合成 mock 还是 fault injection。

## Sandbox 同时记录行为与环境

为了让这种透明 mock 成立，Sandbox 要在同一条时间轴上记录两种事实：

1. 记录 Agent 的行为序列；
2. 记录这些行为对环境产生的影响。

第一类记录是 observation、model response、handoff、tool call 和 approval。第二类记录是文件 diff、进程状态、数据库 mutation、DOM 变化、network response 和外部 side effect。实现上不应该维护两套松散的日志。一次行为和它产生的环境变化，必须封装在同一个 event 里：

`t0 Observe(S0) → t1 Decide(A1) → t2 Act(T1) → t3 Delta(S0, S1) → t4 Observe(S1)`

`Act(T1)` 要知道它来自哪次 model decision，`Delta(S0, S1)` 也要指向触发它的 tool call。每个 event 都需要 monotonic sequence、parent event、输入输出和 pre/post state hash。这样才能回答：Agent 当时看到了什么，为什么采取这个动作，这个动作具体改变了什么，新状态又怎样进入了下一轮 context。

只记录行为，能看到 Agent 调用了 `delete_file`，却不知道文件当时是什么内容、删完以后哪些测试受了影响。只保存环境 snapshot，能看到两个版本不同，却不知道变化来自 Agent、后台进程还是外部服务。

Snapshot 负责回答“这个时刻世界是什么样”，append-only event log 负责回答“世界怎样走到这里”。前者让环境可以恢复，后者让两个 checkpoint 之间的因果过程可以重建，也为每个 mock 找到准确的历史返回值。

换个角度看，这条时间线已经很像一个 Git commit graph。

## Git 负责版本化沙盒状态

Git 已经提供了 Agent replay 最需要的几种时间操作：

| Agent Sandbox | Git |
| --- | --- |
| Agent 做了什么 | commit message / action envelope blob |
| 某一时刻的环境状态 | commit 指向的 tree |
| 行为对环境产生的影响 | parent 与 commit 之间的 diff |
| 行为的先后与因果关系 | parent commit |
| 回到某个 checkpoint | checkout |
| 从历史节点尝试另一种修复 | branch |
| 同时运行多条实验时间线 | worktree |

[Git 的数据模型](https://git-scm.com/docs/gitdatamodel.html)比通常理解的“保存 diff”更适合这件事。一个 commit 保存完整 tree 的 ID、parent commit、作者、时间和 message；blob、tree 和 commit 创建后都不会再变，内容通过 hash 寻址。Git 并不把 diff 存在 commit 里，而是在需要时比较 parent 与 child。也就是说，它保存的本来就是一串 immutable snapshot，再从相邻 snapshot 推导变化。

Agent 每完成一个 action，Sandbox 就可以生成一个 agent commit：

- commit message 记录 action 摘要和 event ID，完整 action envelope 作为 blob 进入 tree，保存 observation、model response、tool call、approval 和 verifier result；
- tree 同时保存 action 执行后的 workspace，以及数据库、浏览器、进程等外部状态的 manifest；
- parent 指向 action 执行前的 agent commit，parent 与当前 tree 的 diff 回答“对环境产生了什么影响”；
- 大对象放进独立的 content-addressed storage，commit 只保存 hash 和恢复方法。

行为记录与环境状态都参与 commit hash，因此共享同一个 commit ID。回放系统不需要猜一条 tool-call log 对应哪份环境 snapshot，也不会因为两套日志写入时序不同而错位。

**一个 agent commit，就是一次 action 及其 environment effect 的原子记录。**

这座仓库不一定是业务代码自己的 `.git`。更合理的做法可能是由 Sandbox 维护一个平行的 bare repository，或者复用 Git object model 做专用 event store，避免把每次 observation 和 tool call 塞进产品的 commit history。

要重现事故，就 checkout 出错前的 agent commit；要验证修复，就从那里开一个 branch；要并行比较多种修复，就用独立 [worktree](https://git-scm.com/docs/git-worktree.html)。原来的 failure history 不会被覆盖，每一种尝试都长成一条新分支。

只要 verifier 能对任意 checkpoint 给出稳定的 pass/fail，甚至可以用 [git bisect](https://git-scm.com/docs/git-bisect) 找到第一个让约束失效的 agent commit。过去我们用它找“哪次代码提交引入了 bug”，现在可以用它找“Agent 的哪个 action 第一次把环境推入错误状态”。

Git 只直接理解文件，普通 Git 仓库也不会自动记录 model output、内存、数据库、网络和真实世界的 side effect。所以它是 replay sandbox 的骨架，还不是全部实现。缺失的部分，要么序列化成 object，要么由可回放的外部系统提供 receipt 和 snapshot。

到这里，Git 解决的是“世界处于什么状态”，还没有解决“世界怎样响应下一次调用”。后者需要一层可编程的 boundary proxy：它对 model、tool、网络、时间、随机数、数据库和文件系统做统一拦截，再根据当前实验选择 live、历史记录、合成 mock 或 fault injection。

**可编程沙盒 = Git-backed state + transparent boundary mocks。**

## 每个边界都可以选择怎样响应

只把所有结果缓存起来还不够。一个能 debug 的 Sandbox 至少需要三种执行策略：

| 策略 | 边界怎样响应 | 用来回答什么 |
| --- | --- | --- |
| Historical | 所有边界都返回历史记录 | 这个 failure 能否被稳定复现？ |
| Forked | 从 checkpoint 开始，后续边界全部 live | 从这里重新运行会发生什么？ |
| Programmed | 每个边界独立选择 live、历史值、合成值或故障 | 这次修改或假设是否真的成立？ |

放进 Git 的语义里，historical replay 是 checkout 后完全使用历史 object；forked run 是从旧 commit 开新 branch，之后全部 live；programmed run 也是开 branch，但每个 boundary 都有自己的 mock policy。

[LangGraph 的 time travel](https://docs.langchain.com/oss/python/langgraph/use-time-travel)已经支持从 checkpoint replay 和 fork。checkpoint 之前的 node 不再执行，之后的 LLM、API 和 interrupt 会重新运行，所以结果仍可能不同。它解决了“从哪里继续”，还没有自动解决“怎样固定其余变量”。

真正适合 debug 的是 programmed run。假设 Agent 在第 12 步误删了一个文件，问题可能出在第 10 步的 context builder，也可能出在第 11 步的 policy checker。修 context builder 时，只让它 live，模型输出、tool result 和后续输入都先沿用记录；修 checker 时，再只放开 checker。还可以把第 9 步的 API mock 成 timeout，验证修复在异常路径上是否成立。每次只改变一个变量，failure trajectory 才能从事故记录变成可执行实验。

这也是 [Chronicle 提出的 cut-point replay](https://arxiv.org/abs/2609.20625) 所做的事情：在非确定性边界记录 immutable envelope，测试时指定一部分边界运行新代码，其余从记录返回。它的公开实验规模还很小，但这个操作比“再跑一次看看”更接近我们熟悉的 regression test。

## 隔离让 Mock 不会变成事故

Agent sandbox 通常被理解成权限隔离：不让 Agent 读不该读的文件，不让 shell 逃出 workspace，不让危险 tool 无需 approval 就执行。但对于 debug，隔离还有另一层价值：让 Sandbox 可以接管环境变量，而不用担心实验泄漏到真实世界。

代码 Agent 需要可克隆的 worktree、container image 和 dependency cache；浏览器 Agent 需要 DOM、storage、cookie、network response 和 screenshot；业务 Agent 需要数据库 snapshot、queue event、feature flag 和权限状态。光保存 prompt 和 response，无法还原 Agent 当时看到的世界。

side effect 更麻烦。一次 replay 不能真的再发一笔退款、再发一封邮件、再删一次文件。写操作要进入 shadow service，或者根据历史 receipt 返回结果；必须 live 的写操作则需要 idempotency key 和独立环境。Sandbox 对内维持与真实环境一致的接口，对外把影响限制在可丢弃的副本中。Agent 无感，真实世界也不受影响。

这种隔离不是 mock 之外的附加能力。正因为调用被限制在受控边界内，Sandbox 才能安全地替换返回值、注入故障和分叉状态。

## 把失败轨迹变成 Test Case

[OpenAI Agents SDK 的 deterministic testing](https://openai.github.io/openai-agents-python/testing/)已经允许用 `ScriptedModel` 固定每一步 model output，再测试真实的 tool、handoff、guardrail 和 retry。它证明 Agent workflow 可以在模型边界被 stub 以后做确定性测试。还缺的一步，是把生产中的失败 trace 自动转成这样的 script，并附上当时的环境 snapshot。

修复过程于是可以变成：

1. 捕获一次真实 failure 的 event log 和 sandbox snapshot；
2. 使用 historical policy，确认它能稳定重现；
3. 为可疑边界配置 live 或 mock policy，只改变一个变量；
4. 用原来的 verifier 检查 failure 是否消失；
5. 把这条 trajectory 提交成 regression case，再跑更大的 eval suite。

最后一步不能省。一条 replay 只能证明这次修改修好了这一条时间线，不能证明 Agent 在所有相似任务上都变好了。它负责把偶发事故变成确定性 regression；representative eval 负责检查修复有没有把系统推向另一个坑。

我在 {% post_link from-prompt-to-harness '从 Prompt 到 Harness' %} 里把“复现”放在 Harness 的最后一层，当时想的是让不同版本的 eval 可比较。现在再往前走一步，复现不该只服务于评测，它还应该成为 Agent Debugger 的执行模型。

Git 让 Sandbox 恢复任意版本的环境，boundary mock 让它决定哪些响应沿用历史、哪些调用执行新代码、哪些故障被主动注入。两者缺一不可：只有状态恢复，没有变量控制，得到的仍然是一次随机重跑；只有 mock，没有完整环境，测试的又不是事故发生时的世界。

失败的 trajectory 应该变成一个能恢复、分叉和编程的 Test Case，而不只是一条供人围观的 trace。Agent Debug 缺的，就是这样一个对内无感、对外隔离的可编程沙盒。
