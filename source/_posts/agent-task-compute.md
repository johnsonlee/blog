---
title: Agent 算力账要从成功任务倒推
date: 2026-08-23 12:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: agent-task-compute
---

“找到 checkout failure，修好，跑完测试，开一个 PR。”

界面里，这只是一项 Task。后台却可能先读 repository 和日志，调用模型判断问题，再运行 shell、修改文件、等待 test、检查 diff；任何一步不通过，新的 observation 又会回到模型，开始下一轮。

一项 Task 究竟消耗多少算力？Request 数量答不了，运行时长答不了，连 Token 总量也只回答了一半。真正需要追踪的，是这句话怎样展开成一条 execution trace，最后又有多少 trace 穿过验收边界，变成用户真正接受的结果。

<!-- more -->

## 一句话为什么不是一次 Inference？

一次 Chat response 可以在模型输出以后结束，一项 Agent Task 却可能才刚开始。模型先看到目标、工具、权限和当前 context，决定下一步调用什么；tool result 作为 observation 回来以后，模型再决定下一步，直到任务完成、触发 iteration cap、等待 human approval，或者以失败结束。

![一项 Agent Task 怎样展开成 Model 与 Tool Trace](/images/agent-task-trace.svg)

[OpenAI Agents SDK 的 tracing](https://openai.github.io/openai-agents-python/tracing/)把一项端到端 workflow 记成 trace，再把 task、turn、agent、generation、function tool、guardrail 和 handoff 记成不同 span。这个结构揭开了 request count 藏住的部分：同样一次点击，有的只产生一次 generation，有的会穿过几十次 model 与 tool call。

所以第一本账不是 `Request → Token`，而是 `Task → Turn → Model Invocation / Tool Call → Accepted Result`。少了中间几层，fan-out、context growth、retry 和 verification 都会被摊进一个失真的平均数。

## Agent 跑一小时 GPU 也跑一小时吗？

Agent 的 wall-clock time 不等于 model active time。模型在 generation 期间占用 inference capacity；browser、database、shell 和 test runner 在各自的系统里执行；等待 tool result 或 human approval 时，Task 仍然 open，GPU 却可以服务别的请求。

![Agent Task 的 Wall-clock 与 Model Active Time](/images/agent-task-wall-clock.svg)

[OpenAI Background mode](https://platform.openai.com/docs/guides/background)允许长任务异步执行，开发者再轮询状态。它解决的是 connection 与 task lifecycle，不是把一块 GPU 连续锁给同一项任务。

容量规划因而要分开两种 concurrency。`In-flight Task` 是尚未结束的工作，`Active Model Call` 才是此刻进入 inference queue 的负载。大量 Task 同时等待 tool，并不会形成同等规模的模型负载；可一批 tool result 同时返回，又会在几秒内唤醒大量 model call，形成 burst。

把一小时 runtime 全算成 GPU hour 会高估平均占用，只按最初那次 API request 又会漏掉后续每一次唤醒。

## Agent 越多 Task 就一定越快吗？

只有彼此独立的 branch 才能真正并行。搜索不同资料可以交给多个 subagent；修改同一组文件、等待同一个上游 observation，或者共同写入 mutable state，最终仍要在 merge、verification 或 retry 时串回来。

![Single Agent 与 Multi-agent 的 Compute Fan-out](/images/agent-task-fanout.svg)

[Anthropic 对 multi-agent research system 的复盘](https://www.anthropic.com/engineering/multi-agent-research-system)给出了一组少见的生产口径：它们的数据里，Agent 通常使用约 4 倍于 Chat 的 Token，multi-agent system 约为 Chat 的 15 倍；使用 Opus 4 lead agent 与 Sonnet 4 subagent 的系统，在内部 research eval 上比 single-agent Opus 4 高 90.2%。

这组结果有明确边界：它来自适合 breadth-first search 的 research workload 和 Anthropic 的内部 eval。Anthropic 同时指出，多数 coding task 没有 research 那么多可以真正并行的工作。15 倍 Token 证明的是 fan-out 能迅速放大 compute demand，不是多开 Agent 一定更快，更不是所有任务都能得到 90.2% 的提升。

判断 fan-out 是否值得，要把 parallel width、coordination Token、duplicate work、merge failure 与 accepted contribution 放在一起。增加的 branch 如果没有缩短 critical path，也没有提高成功率，只是把一项 Task 变成了更多账单。

## 每一轮为什么都让 Context 更重？

第一轮 model invocation 读取 instruction、tool schema、用户目标和初始资料。Tool 返回日志、网页或代码以后，下一轮还要看见这些 observation 才能继续。Task 越长，conversation history、tool result、intermediate artifact 与 state summary 越容易一起增长。

![Agent Context 怎样随每一轮 Model 与 Tool Call 增长](/images/agent-context-growth.svg)

Context 变长会增加 prefill、input Token 和 KV cache 压力。保留全部原始输出最完整，也最贵；过早截断可能丢掉决定；summary 与 compaction 能缩短 prompt，却可能漏掉细节，或者改变 prefix 后失去 cache reuse。

[OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching)要求 prompt prefix 精确匹配。Instruction、tool definition 与 shared context 越稳定，越容易复用；改动前面的 message、tool schema 或顺序，后续 invocation 就可能重新处理整段 prefix。

所以 context ledger 不能只报总 Token，还要分 static prefix、cached input、new observation、compacted state、retrieved context 与 output。一次 compaction 省下的 input bill，必须和它以后是否引发更多 retry 一起看。

## 一次失败为什么可能重算整条链？

Tool timeout 也许可以原地 retry，错误的 diagnosis 却会让后续 edit 和 test 一起作废。Verification 越晚发现问题，前面已经发生的 model call、tool call 与等待越多，沉没的 compute 也越大。

![Retry 与 Verification 怎样放大一项 Task 的成本](/images/agent-retry-amplification.svg)

[AWS Agentic AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentperf02-bp01.html)指出，每一轮 perceive-reason-act 通常都包含一次 LLM inference，iteration 数量会同时放大 latency 与 cost。Iteration cap、early termination 和 retry budget 的作用，就是在 loop 不再收敛时及时停下来。

这不等于验证越多越好。Schema、permission 和 deterministic test 适合放在便宜的前置 gate；需要完整上下文的 review 则只能留在后面。前置 gate 误杀过多同样会制造 retry。真正要记录的是 first-pass success、accepted-after-retry、escalated、aborted、rework depth，以及每次失败究竟推翻了多长一段 execution path。

Verification 不是模型输出以后的免费步骤。用户最终接受的是通过 quality gate 的结果，它本来就属于 Task。

## Token 更便宜为什么 Task 反而更贵？

一个模型每次只花 0.10 美元，却要尝试五次再由人修改；另一个模型一次花 0.35 美元，结果直接通过。前者每 Token 更便宜，successful task cost 反而更高。

完整成本也不只来自模型。Cached 与 uncached input、reasoning 和 output Token 之外，还有 search、browser、database、sandbox runtime、storage、network、trace、evaluation、human review 与 rework。有些等待几乎不消耗 model compute，却仍占用 runtime state；有些 tool call Token 很少，却按 request、minute 或 outcome 计费。

[OpenAI 的 AI scorecard](https://openai.com/index/a-scorecard-for-the-ai-age/)把口径写得很直接：把完成工作的全部成本相加，只统计达到质量门槛的 Task，再用前者除以后者。来源虽然是模型提供商，分母却是对的。只要客户买的是完成的工作，账就不能停在 Token。

因此每个 span 都要带上 owner、model、Token、tool price、active time、wait time、retry cause 与 result，等结果通过 quality gate，再汇总到同一个 Task ID。没有 trace，便宜模型究竟省了钱，还是把成本转给 tool、runtime 和人，根本分不出来。

## 一个 Task 怎么折回 Data Center Capacity？

用户侧看到的是每分钟进入多少 Task，以及每项 Task 多久关闭。Data Center 需要看到的却是这些 Task 在每个时刻唤醒多少 active model call，每次调用什么 model、带多长 context、生成多少 Token，又要满足怎样的 latency SLO。

![从 Task Arrival 到 Successful Task Capacity 的账本](/images/agent-task-capacity-ledger.svg)

一项 Task 先展开成 turns，再展开成 model invocation。每次 invocation 经过 routing、queue、prefill 和 decode，消耗上一篇拆过的 inference capacity；tool wait 暂时释放 model capacity，result 返回后又产生下一次 invocation；parallel agent 还会让一项 Task 同时展开成多个 active branch。

所以 `Tasks per MW` 没有固定换算率。它取决于每项 Task 的 invocation 分布、input / output Token、cache hit、model mix、parallel width、retry depth、success rate 与 latency target。真正能进入分子的，是在 deadline 内通过 quality gate 的 successful task。

平均值也不够。P50 Task 可能两轮结束，P99 却会因为 long context、tool timeout、fan-out 和 retry 多跑几十轮。Scheduler 最难处理的，往往不是平均 Token，而是大量 tool completion 同时唤醒 branch 时出现的瞬时并发。

## 谁能从 Agent Workload 收到钱？

一项 Task 展开以后，会触发几类不同的商业事件。Model provider 在 billable Token 或 model invocation 发生时收费；search、browser、database、payment 与 code execution provider 在 API call、runtime 或 action 发生时收费；Agent platform 则可能按 seat、workflow、usage 或 enterprise contract 收费。

[AWS 对 Agent cost 的指导](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentcost01.html)把 reasoning loop 与 multi-agent coordination 分开记录，因为后者会让 orchestration cost 随层级和 handoff 放大。能产生 usage 不等于能留下 economics：模型降价可能吃掉 Token 增长，tool 可以被替代，单纯 orchestration 也可能被模型原生能力、open-source framework 或 cloud bundle 压到接近免费。

真正需要对齐的是付款事件与客户结果。谁能降低 successful task cost，谁控制客户绕不过去的数据、权限或 action，谁又能把这种控制变成持续付费，才有机会留下利润。Anthropic 的 4 倍和 15 倍说明 demand unit 在膨胀，却没有回答价值最终留在模型、工具、平台还是客户自己手里。

## Agent Economics 已经 Price In 了吗？

目前只能给出 **Unverified**。

推导并不复杂。公开资料已经能证明一项 Agent Task 会展开成更多 model 与 tool call，也能证明 fan-out、context 和 retry 会改变 compute demand；但公开公司并没有把 Agent Task 数量、successful-task rate、compute per successful task、tool attach、human rework 与对应 gross margin 放在同一张表里。

缺少这组数据，就无法把 `Task Volume × Revenue per Successful Task - Full Task Cost` 桥接到公司 earnings。Anthropic 的 4 倍和 15 倍来自特定 workload；OpenAI 与 AWS 的材料说明怎样计量和优化，却不是任何一家上市公司的 segment disclosure。拿 Token growth、Agent 用户数或整家公司股价重估反推 Agent economics，都会跨过公开数据没有支持的归因。

`Unverified` 不等于市场没有定价，而是目前无法算出定价了多少。要把判断升级，至少要看到按 workflow 统计的 successful task、first-pass success、model / tool / runtime cost、revenue 或 attach、gross margin 和 retention，再用这些 earnings 做 reverse valuation。

证伪方向也很明确：Task 数量持续增长，Token per successful task 却下降得更快；模型降价快于 usage 扩张；multi-agent 没有提高验收率；tool 与 orchestration 被 bundle；客户把昂贵 loop 改回 deterministic workflow。任何一项都可能让 compute demand 与可捕获利润走向不同方向。

## 一个 Agent Task 到底消耗多少算力？

回到开头那项 coding task。它不是一次 request，也不是一小时 GPU time，而是一条由 model、tool、wait、retry 和 verification span 组成的 execution trace。

这项 Task 消耗多少算力，只能在结果通过验收以后倒推：先把所有 active model invocation 归到同一个 Task ID，再按 model、context、output、cache、parallel width 和 SLO 折成 inference capacity，最后除以 successful task。

于是 Agent workload 的复制单位也变了。Data Center 最终交付的不是更多 Token，而是在约定时间内完成、并且可以被用户接受的 Task。只有沿这条链记账，Task volume 的增长才可能被还原成真正的 capacity demand，也才能继续判断谁拿到了收入，谁留下了利润，市场又算进去了多少。
