---
title: 同样 100MW 为什么算力不一样？
date: 2026-08-23 11:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: training-vs-inference-ledger
---

Production Handoff 以后，scheduler 拿到一片 100MW 的 healthy capacity。电表只有一个读数，GPU 型号也没有变，照理说这片 cluster 能提供多少算力，应该只有一个答案。

Training team 却要先问能不能拼出一块连续运行数周的大 partition；Inference team 关心的是这些 GPU 分到哪些 region，在多大的 concurrency 下还能守住 latency。**同样 100MW，为什么换一种 workload，算力就不一样了？**

<!-- more -->

## 同样 100MW 为什么不能直接比较？

MW 量的是输入功率，不是计算完成了多少工作。把 facility meter 上的 100MW 送进 GPU，只能说明物理资源已经投入；Training 和 Inference 怎样验收这些资源，才决定它们最后交付了什么。

Training 的 workload 在启动前已经大致确定：model、dataset、sequence length、global batch、parallelism 和目标 quality。大批 GPU 被 gang schedule 到同一个 job，任何一个 rank 掉队，其他 rank 都要等。它的终点不是“GPU 跑了一小时”，而是按期得到达到目标质量的 checkpoint。

Inference 接住的则是不断到来的 request。Prompt 和 output 长短不同，模型不同，用户能接受的 latency 也不同。GPU 即使一直在算，只要 response 超过服务目标，这部分 throughput 就没有成为可交付的产品容量。

[MLPerf Training](https://mlcommons.org/benchmarks/training/)按达到指定 quality target 所需的 wall-clock time 排名；[MLPerf Inference: Datacenter](https://mlcommons.org/benchmarks/inference-datacenter/)把 Server、Offline 等 scenario 分开，再分别约束 throughput、latency 和整机 AC power。Benchmark 不是 production workload，却把边界说清楚了：Training 的分子是训练进度，Inference 的分子是满足服务目标的响应。两边可以共享 MW 这个分母，产出却不能直接相加。

## GPU 都在忙为什么训练还会变慢？

一张 GPU dashboard 很容易显示 95% utilization。这个数字只能说明 kernel 大部分时间在运行，不能说明 95% 的时间都在推进模型。

一次 training step 里，forward 与 backward pass 才产生有效计算；all-reduce、all-to-all 与 pipeline communication 负责同步不同 GPU 的状态。Pipeline bubble、data stall、straggler 与 load imbalance 会让部分 GPU 等待，保存 checkpoint 会占用计算或 I/O，node failure 还会把 job 拉回上一个 durable checkpoint。

![Training wall-clock 怎样折算成有效训练进度](/images/ai-training-goodput.svg)

[NVIDIA 对 Megatron-Core 的说明](https://developer.nvidia.com/blog/train-generative-ai-models-more-efficiently-with-new-nvidia-megatron-core-functionalities/)把 fully parallel、asynchronous checkpointing 当作吞吐问题处理：先把 state 复制到 CPU 或 local storage，再在后台写入 stable storage，尽量不让同步 I/O 卡住主训练。前一篇拆过 checkpoint 的 storage path；到了 workload 层，这条 path 决定昂贵的 GPU 是在推进 model state，还是在等待数据落盘。

所以 Training 至少要分开 allocated GPU-hours、job-running GPU-hours 与 useful training GPU-hours，最后再落到 time-to-quality。**GPU 很忙，只能证明资源已经被占用；checkpoint 向目标质量推进，才说明 Training 在交付。**

## GPU 翻倍为什么训练时间不会减半？

假设一项 workload 在 1,024 块 GPU 上要跑 60 天。扩到 2,048 块 GPU，只有新增计算超过新增的通信、同步和空转，完成时间才会接近 30 天。

Scaling efficiency 量的就是这段损耗。理想 strong scaling 下，GPU 数量翻倍，throughput 也翻倍；真实集群里，tensor、pipeline、data 与 expert parallelism 会把不同 collective 放到 critical path。GPU 越多，最慢 rank、link flap、pipeline imbalance 和故障越难隐藏。

![GPU 数量增加后 Training throughput 为什么偏离理想线](/images/ai-training-scaling-efficiency.svg)

[NVIDIA 的 Megatron scaling 实验](https://developer.nvidia.com/blog/scaling-language-model-training-to-a-trillion-parameters-using-megatron/)把 data loading、optimization 和 logging 都放进 end-to-end training performance；最大的一组 3,072 块 A100 达到理论峰值的 52%。这不是所有模型和集群的固定效率，只证明 nameplate FLOPS 不能直接乘成训练产出。

于是 Training capacity 还要看能拼出多大的 contiguous healthy partition、目标 topology 下的 scaling efficiency、checkpoint overhead、failure interval 与 restart loss。零散的 GPU 可以承载许多 inference replica，却未必能让一个大 training job 提前一天完成。

## TPS 更高为什么用户反而等得更久？

Inference 不需要维持一个持续数周的 global job，却要同时处理许多互不相同的 request。每个 request 先排队，再处理全部 input Token，生成第一枚 output Token；随后逐枚 decode，直到 response 完成。

![一个 Inference request 的 latency 怎样形成](/images/ai-inference-latency-pipeline.svg)

[NVIDIA AIPerf 的指标定义](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)把 Time to First Token（TTFT）拆成 network、queue 和 prefill 等时间；Time per Output Token（TPOT，也写作 Inter-token Latency）则看第一枚 Token 以后相邻 output Token 的平均间隔。Concurrency 上升时，总 Tokens per Second（TPS）会先增加；GPU 饱和以后，总 TPS 可能下降，每个用户拿到的 TPS 也会因为 latency 上升而下降。

GPU 喜欢更大的 batch，因为一次执行可以摊薄 model weight 读取和 kernel overhead。用户却要等 batch 形成，还要与其他 sequence 分享每一轮 decode。Prompt 越长，prefill 越重；output 越长、并发越高，KV cache 占掉的 HBM 越多，能够同时留在 GPU 上的 request 就越少。

![Batch、KV Cache 与 SLO 怎样围出 Inference capacity](/images/ai-inference-capacity-envelope.svg)

[NVIDIA Dynamo 的 tuning 文档](https://docs.nvidia.com/dynamo/kubernetes/operations/performance-tuning)要求用同一组 model、input length、output length、concurrency 和 service-level objective 比较配置，并明确拒绝只靠突破 ITL 或 TPOT 目标换来的 throughput。Raw TPS 只有同时通过 TTFT、TPOT、error rate 与 quality gate，才是 SLO-qualified goodput。

这也解释了为什么 Inference utilization 不能无限接近 100%。系统必须为流量波动、long-context request、故障切换和 latency SLO 留出 headroom；平均利用率压满，下一波 request 就只能在 queue 里等。

## 空闲 GPU 为什么不能直接借给 Training？

夜间 request 变少，看起来正好可以把闲置 GPU 借给 Training。小规模 fine-tuning、evaluation 和可中断 batch job 确实可以填谷；需要数千块 GPU 连续运行数周的 pretraining，却装不进几个小时的低谷。

问题还不只在时间。Training 要等足够大的 contiguous partition，并把 data、checkpoint 和同步通信留在适合的 topology 内；Inference 的 capacity 已经按 model、region、SLO 和时段分开。一个 region 的 GPU 空闲，不代表另一个 region 的需求可以迁走，更不代表这些碎片恰好能拼成 training job 需要的 failure domain。

![Training 集中部署与 Inference 分区部署](/images/ai-workload-geography.svg)

[OpenAI 的 API data controls](https://developers.openai.com/api/docs/guides/your-data#data-residency)区分 regional storage 与 regional processing；选择 regional processing 后，customer content 的 inference 也要留在对应 region。[AWS Generative AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/genrel05.html)则要求在多个 region 分配 inference request，同时权衡 reliability、network latency 与 operational complexity。

所以 scheduler 不能只问“还有多少 GPU 空闲”，而要问空闲 capacity 的大小、位置、topology 和持续时间能否装下目标 workload。Aggregate utilization 相同，不代表可用算力相同。

## 100MW 最后剩下多少可用算力？

两种 workload 都从 facility meter 开始。100MW IT load 先扣掉 unhealthy、maintenance 与 scheduler 无法分配的部分，到这里仍是同一种 physical capacity；从 allocation 开始，两条验收路径才真正分开。

![从 Facility MW 到 Training progress 与 billable Inference 的账本](/images/ai-workload-capacity-ledger.svg)

Training 一侧记录 allocated GPU-hours、job-running GPU-hours，扣除 bubble、communication、checkpoint 与 restart loss 后得到 useful training hours，最后看是否按期产出达到目标 quality 的 checkpoint。

Inference 一侧记录 provisioned replica-hours、active serving GPU-hours 与 raw Token throughput，再扣掉没有通过 TTFT、TPOT、error 和 quality gate 的部分，最后才得到能够计费或支撑 subscription 的 request。两边都要同时记录 wall power，才能算 energy per accepted checkpoint increment 或 joules per SLO-qualified Token。

这套 ledger 不要求不同公司公开同一种内部指标，但要求比较时固定边界。只给 GPU utilization，不知道 Training 有没有推进；只给 TPS，不知道 Inference 有没有越过 latency；只给 MW，甚至不知道它被分给了哪种 workload。

## 同一 100MW 为什么对应不同收入？

因为每一层开始收费的事件不同。Colocation provider 在 capacity 通过合同约定的交付条件后按 MW billing；AI cloud 把它变成 available GPU instance 或 committed capacity；model provider 用 Training 换下一代 model capability，再用 Inference 承接 subscription、API 与 usage revenue。

[CoreWeave 2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm)披露了超过 850MW active power、约 3.1GW contracted power 和 $60.7B remaining performance obligations。三者分别是已经运行的物理容量、未来计划部署的电力和尚未履约的合同价值，不能拿来互相替代。对 AI cloud 来说，contracted MW 要按时变成 available service，take-or-pay contract 才会持续转成 revenue。

到了 model provider，Training scaling efficiency 提高会缩短 model time-to-market，却不会自动产生当期 Token revenue；Inference batching、KV reuse 与 routing 提高，则能在不增加 MW 的情况下扩大 SLO-qualified throughput。[OpenAI 披露](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/) available compute 从 2023 年的 0.2GW 增到 2025 年约 1.9GW，同期 ARR 从 $2B 增到 $20B 以上，并把两者归因于自己的 compute、research、product 与 monetization flywheel。这个相关性只属于 OpenAI 的披露，不能外推成所有公司的固定 revenue per MW。

[NVIDIA 对 Dynamo 1.0 的披露](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Enters-Production-With-Dynamo-the-Broadly-Adopted-Inference-Operating-System-for-AI-Factories/default.aspx)称部分 benchmark 中 Blackwell inference performance 最多提高 7 倍。它是 vendor benchmark，不是 production 保证，却足以说明同一批硬件的收入上限会被 orchestration software 改写。

## 这些 Economics 已经 Price In 了吗？

仅凭“AI compute 还缺 100MW”无法回答。要判断一家公司的 price-in，至少要把 workload mix、可交付时间、利用率、revenue per available MW、gross margin、合同期限、融资成本与增量 capex 接到同一张 earnings path 上。这里建立的 ledger 只能证明这些变量为什么不能省略，不能替任何一家公司补出没有披露的数据。

CoreWeave 就是一个边界清楚的例子。850MW active power、3.1GW contracted power 和 $60.7B RPO 能证明需求、合同与部署规模，但 10-K 没有按 Training 与 Inference 拆出 revenue、utilization 和 margin，也没有把每一 MW 对应到同一代 GPU、同一交付时间与同一融资结构。用 RPO 除以 contracted MW 得到一个“每 MW 价值”，会把五年左右的合同期限、未来交付、hardware refresh、availability credit 与资本成本全部揉在一起。

所以这一层的 price-in 结论只能是 **Unverified**。不是市场一定没有计价，也不是已经充分计价，而是公开证据还不足以从股价反推出“同一 MW 的 workload efficiency”被算进了多少。能继续验证这件事的信号，不是又签了多少 GW，而是 active capacity 的 ramp、revenue 与 gross profit per available MW、contract utilization、capex/debt service，以及 Training 与 Inference mix 的变化。

## 同样 100MW 到底是多少算力？

回到最初那片 100MW，电表读数始终没有变。Training 把它变成按期达到目标质量的 checkpoint，Inference 把它变成满足 SLO 的 Token 和 request；partition 是否连续、scaling efficiency、request shape、region 与 headroom，又会继续改变两边的可用产出。

所以 100MW 不是一个完整的算力答案，只是物理输入。问“有多少算力”以前，还要补上 workload、验收单位和服务边界。缺少这三项，两个同样写着 100MW 的数据中心，交付的可能根本不是同一种东西。
