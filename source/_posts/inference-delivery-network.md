---
title: 推理网络既调度 GPU 也交付结果
date: 2026-08-23 13:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: inference-delivery-network
---

GPU 已经生成第一枚 Token，首尔用户的屏幕仍然是空的。

这并不矛盾。模型完成计算，只说明结果可以离开 inference worker；这枚 Token 还要穿过机房网络、Inference Gateway、Regional Front Door 与 backbone，再从 edge 回到 ISP 和 last mile，才会变成屏幕上的第一个字。

Cluster 算完，不等于结果已经交付。

<!-- more -->

## 第一枚 Token 到底在哪里等？

用户点击发送，计时已经开始。Request 先经过 DNS、connection、TLS、edge ingress 与 backbone；进入目标 Region 后，还要通过 authentication、rate limit、policy、model routing 和 queue，最后才轮到 GPU 做 prefill。

第一枚 Token 生成以后，计时也没有结束。它还要沿 response path 返回 client。

![第一枚 Token 的等待时间由哪些部分组成](/images/inference-ttft-budget.svg)

[NVIDIA 对 TTFT 的定义](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)是从 query 发出到 client 收到第一枚非空 Token，其中包含 queue、prefill 与 network latency。只量 inference server 收到 prompt 以后的时间，会把用户已经等过的入口网络，以及 Token 生成后的返回网络一起删掉。

Network latency 也不是一个数字。Client 到 edge 走 public Internet 与 last mile，edge 到 Region 可能进入 provider backbone，Region 内还要经过 load balancer、gateway、service network 和 rack network。TTFT 变慢，既可能是 GPU queue，也可能是 proxy buffering、跨区绕路或最后一公里丢包。

所以 server-side TTFT 健康，用户仍然可能觉得模型变慢。要找到问题，必须把 client-observed TTFT 拆成 edge ingress、backbone、gateway、queue、prefill 与 first-chunk return，而不是把整段等待都记到 GPU 头上。

## 一次 Request 要穿过多少网络？

用户只看到一个域名，背后却不是一个 endpoint。DNS 或 Anycast 先把 connection 带到 edge；edge 负责 DDoS protection、TLS termination 与 traffic steering，再把 request 送往能够处理目标 model 的 Region。Regional Front Door 完成 API policy 和 service routing，Inference Gateway 才会选择具体的 model pool 与 worker。

![一次 Inference Request 从 User 到 GPU 再返回的完整路径](/images/inference-delivery-path.svg)

[AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html)让 traffic 从靠近用户的 edge 进入 AWS global network，再按 proximity、endpoint health 与 weight 送往 regional endpoint；[Google 的 AI inference networking architecture](https://docs.cloud.google.com/architecture/networking-for-ai-inference)则把 global endpoint、regional load balancer、API management、guardrail 与 model backend 拆成不同层。实现不同，目的相同：用户不需要知道哪台 GPU 正在工作，入口要把不断变化的后端 capacity 藏起来。

Response 返回时，这些中间层一个都不会消失。某个 proxy buffer 住 streaming chunk，GPU 即使按时 decode，用户看到的仍然是停顿。Request 与 response 还可能因为 traffic policy、故障切换或 Internet routing 走上不同路径。

从 Cluster 到 User，至少横跨三张网络：Data Center 内部的 cluster fabric、Region 内部的 service network，以及连接 edge、backbone、ISP 与 last mile 的 delivery network。前两张负责把 GPU 组织起来，最后一张才把算力变成用户能够感知的 service。

## Edge 离用户近为什么 GPU 还在 Region？

把 stateless proxy 部署到 edge，只需要机架、CPU 和网络；把 frontier model 搬过去，还要一起复制 accelerator、power、cooling、model weights、serving runtime、spare capacity 与 on-call operation。Edge PoP 可以离用户很近，却不一定具备承载大模型的物理条件。

GPU 集中在少数 Region，还有 utilization 的原因。每个 Region 都要为 peak traffic、model mix 与 failure 留出 headroom；池子切得越碎，空闲 capacity 越难互借。Model weights 还要常驻 accelerator memory，冷门 model 分散到大量 edge，只会让昂贵的 GPU 等不到足够 request 组成 batch。

这形成了一组无法同时消失的 trade-off：GPU 越集中，batching、model density 与 utilization 越好；GPU 越分散，network RTT、residency 与 regional failure blast radius 越小。Edge 缩短了用户进入网络的第一段，却没有把 GPU 变到用户身边。

## 为什么不能像视频一样交给 CDN？

视频上传一次，可以被不同用户反复读取；同一 segment 命中 edge cache 后，不必再次回到 origin。Inference response 却由 prompt、conversation state、retrieved data、tool result、model version、sampling parameter、policy 与用户权限共同决定。少一个字段相同，都可能不是同一份结果。

![Static Asset、Identical Prompt 与 Personalized Inference 的缓存边界](/images/inference-cache-boundary.svg)

[Cloudflare AI Gateway 的 cache](https://developers.cloudflare.com/ai-gateway/features/caching/)只会为 identical request 返回已有 response，也更适合 prompt 选项有限、内容不动态的场景。FAQ、固定分类可以受益；带私有 context、实时数据与随机 sampling 的 response，命中边界完全不同。

Inference 当然也能复用，只是复用发生在不同层。CDN cache 保存静态 asset，retrieval cache 复用搜索结果，prompt cache 与 KV cache 复用相同 prefix 的 prefill。它们分别位于 edge、application、storage 与 GPU memory，privacy boundary、invalidation 和收费事件都不同。

因此 AI traffic 不会简单复制 video CDN 的 economics。文本 response 的 byte volume 很小，昂贵的是 personalized request 仍要回到拥有 model state 与 accelerator capacity 的地方。Delivery network 的首要任务不是搬运更多 GB，而是尽快找到正确的 Region 和 worker。

## 普通 Load Balancer 为什么看不懂 GPU？

普通 web load balancer 常按 connection、request count、CPU 或 response latency 分流。Inference worker 的状态还包括 model 是否已经加载、剩余 KV cache、prefix overlap、batch position、prefill/decode role、context length、adapter 与 SLO。

两台 GPU utilization 都是 70%，接下同一个 request 的代价可能完全不同。

![Inference Gateway 选择 Worker 时需要看到哪些状态](/images/inference-gateway-routing.svg)

[NVIDIA Dynamo 的 KV-aware routing](https://docs.nvidia.com/dynamo/dev/kubernetes/kv-aware-routing/overview)会读取 worker 发布的 KV cache event 与 active load，把 request 送往最可能已经持有 prompt prefix 的 worker，减少重复 prefill。[Google 的 Multi-Cluster Inference Gateway](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/about-elastic-cross-region-high-availability)也会使用 KV cache utilization 等 inference-specific metric，而不是只按 request rate 做 cross-cluster balancing。

只选最近 Region，可能撞上最长的 queue；只选最空 worker，可能丢掉已经计算过的 prefix；只追 cache hit，又可能把 hot worker 压垮。Router 必须在 network distance、queue、cache locality、model availability、cost、residency 与 failure domain 之间实时取舍。

Inference Gateway 因而不只是入口旁边的一层 proxy。它决定一次 request 会重复多少 prefill、穿过多少跨区网络，以及哪一池 GPU 能获得更高 utilization，本质上是连接 network capacity 与 compute capacity 的 scheduler。

## 最近的 Region 为什么不一定最快？

首尔用户离 Seoul Region 最近，目标 model 却可能只在 Tokyo 有 warm replica；Tokyo 又正好进入 peak。Oregon 的 queue 也许最短，却增加了 network RTT；若企业要求 EU regional processing，三者都不在可选集合里。

![Regional Inference Routing 的三个约束](/images/regional-inference-trilemma.svg)

Router 不是从全球所有 GPU 中挑一台，而是先按 model、geography、service tier、residency policy 与 SLO 切出 eligible region set，再在这个集合内比较 network distance、queue 与 cache locality。

每多一个 model、Region、service tier 或 processing boundary，看似统一的全球 capacity 都会被继续分区。某处还有空闲 GPU，不等于当前 request 可以使用它。

这也是“全球共有多少 MW”解释不了 inference availability 的原因。真正能够交付的单位，是某个时刻仍同时满足 `Model × Geography × Tier × Policy × SLO` 的 capacity。

## 空闲 GPU 为什么借不过来？

Primary Region 拥塞时，把 request spill 到另一个 Region 看起来很自然。可 destination Region 必须提前拥有目标 model、serving stack、accelerator、quota、guardrail、logging 与 on-call operation；否则 router 找到的不是备用 capacity，只是一个空地址。

![Single Region、Geographic Pool 与 Global Pool 的 Spillover](/images/cross-region-spillover.svg)

[Amazon Bedrock 的 cross-Region inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)用 inference profile 在多个 Region 之间路由 request。Geographic profile 把处理范围限制在 US、EU 或 APAC 等边界内，global profile 才能使用更大的 commercial Region 集合。Capacity pool 变大，是以更宽的 processing geography 为代价。

Spillover 还会把 state 与依赖一起拉长。Tool、retrieval data 或 private endpoint 留在 source Region，model request 跨区以后仍可能反复访问远端依赖；backup Region 没有预留 warm capacity，区域故障时也会和 primary Region 一起排队。

所以新增一个 Region 不是改一条 DNS。Accelerator、backbone、model artifact、serving stack、policy、observability 与 failure handling 都要复制，最后还要用 production traffic 验证 TTFT、stream continuity、residency 与 failback。Endpoint 存在，不代表这份 capacity 已经可以被借用。

## Streaming 什么时候才算完成？

Non-streaming API 等完整 response 生成以后一次返回；streaming 在第一枚 Token 生成后持续发送 event 或 chunk。它缩短 perceived latency，也把一次短 request/response 变成一段必须持续保持的 connection。

![Streaming Response 的 Connection、Chunk 与 Guardrail 时序](/images/inference-streaming-path.svg)

此后的每个 chunk 都要穿过 proxy、buffer、timeout 与 client connection。中途断线时，系统还要判断能否 resume、replay，还是重新生成；一次 retry 可能让 GPU 重算已经生成、用户却没有完整收到的内容。

Guardrail 也会改变交付边界。[Amazon Bedrock 的 streaming guardrail](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-streaming.html)可以同步 buffer 一组 chunk 再审核，也可以异步发送后再检查：前者增加 chunk latency，后者降低等待，却可能在 policy 判断完成前已经交付部分内容。

HTTP 200 因此只是连接建立，不是 response 已经交付。Streaming service 还要记录 first event、inter-event gap、connection duration、disconnect、reconnect、partial completion 与 final acceptance。对于 voice、code completion 与 Agent progress，连续性本身就是 SLO。

## 什么才算一次交付？

一笔 request 从 client 发出以后，要依次留下 eligible region set、edge ingress、selected route、model pool、gateway queue、prefill、decode、stream 与 egress。只有 response 在 deadline 内完整到达、没有 policy error，并被 client 接收，才进入 SLO-qualified delivery。

![从 Request 到 SLO-qualified Delivery 的账本](/images/inference-delivery-ledger.svg)

这张账必须同时记录 compute 与 network。Cross-region spillover 可能降低 queue time，却增加 backbone distance；KV-aware route 可能多走一点 Region 内网络，却省掉整段 prefill；closer Region 可能平均 TTFT 更低，却因为 pool 太小让 P99 更差。

[Google Cloud 的 network pricing](https://cloud.google.com/vpc/network-pricing)把 intra-region、inter-region、Interconnect 与 Internet data transfer 分开计费。实际合同价格会不同，收费边界却说明 network 不是已经包含在 GPU 价格里的免费附件。

更重要的是，network failure 会让已经支付的 compute 失去交付资格。Token 算出来，却没有在 SLO 内到达用户，这次计算消耗了 capacity，收费事件却未必成立。

## 谁能从这条交付链收到钱？

Hyperscaler 同时拥有 Region、backbone、edge、load balancer、interconnect 与 GPU cloud，可以把 cross-region routing、premium network 和 inference capacity 打包。独立 edge network 控制 Internet ingress、security、peering 与最后一段 delivery；carrier 控制 last mile 与 enterprise private connectivity；Inference Gateway 则决定 request 最终落在哪一池 compute。

能不能持续定价，取决于客户绕开以后会损失什么。Public Internet 可以替代 premium backbone，但 latency、jitter 与 failure control 可能下降；多个 CDN 可以互相替代，但普通 traffic steering 看不到 model、KV 与 queue state；cloud-native gateway 最懂 backend，也可能把 routing 的价值送进 cloud bundle。

需求也不会平均落到每一层。Text Token 暴增，首先增加 model invocation 与 long-lived connection，不一定同比增加 egress GB；multimodal output 会同时扩大 storage、backbone 与 delivery bytes；regional processing 会复制 endpoint 与 spare capacity，却缩小每个 Region 可以共享的 pool。

真正要追踪的收费事件很具体：cross-region request 是否增加，premium backbone 与 private interconnect attach 是否上升，load balancing、gateway 和 egress revenue 是否随 successful delivery 增长，以及这些收入能否覆盖 backbone、PoP、traffic acquisition 与 spare capacity。

## 这笔生意已经 Price In 了吗？

**结论是无法验证。** 市场已经给 AI network 很高的预期，却没有足够披露把这份预期单独折回 inference delivery 的 earnings。

以 Cloudflare 为例，[2026 年第二季度收入同比增长 36% 至 6.96 亿美元](https://www.cloudflare.net/news/news-details/2026/Cloudflare-Announces-Second-Quarter-2026-Financial-Results/default.aspx)，公司也直接把增长叙事指向 AI answer engine 与 agent-driven traffic。用[8 月 21 日 293.14 美元的收盘价](https://www.nasdaq.com/market-activity/stocks/net/historical)，乘以上述财报中的约 3.54 亿加权平均股数，权益价值粗算约 1,039 亿美元；再除以 2026 年 28.64 至 28.70 亿美元收入指引，约为 **36 倍当年收入**。这显然不是一个只反映传统 CDN 的价格。

但这 36 倍并不能回答 inference delivery 被算进多少。Cloudflare 披露的是整个平台收入，没有单列 AI Gateway traffic、cross-region request、successful delivery、revenue per delivered task 与对应 network cost。AWS 也只披露整个 AWS segment；[2026 年第二季度 AWS 收入同比增长 37% 至 422 亿美元](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Second-Quarter-Results/default.aspx)，其中无法拆出 inference traffic 带来的 backbone、load balancing 与 egress 收入。

要把价格算回 earnings，至少需要这条桥：

`Delivered Tasks × Network Revenue per Task - Backbone / PoP / Spare Capacity Cost`

现在能看到左边的 AI 需求叙事，也能看到公司总收入与估值；中间四项没有被同时披露。于是只能判断平台层面的 AI 预期已经很高，不能判断推理交付网络已经贡献多少利润，更不能把 36 倍收入全部归因于这条链。

后续需要核对的不是 Token 增长本身，而是 client-observed TTFT 中的 network share、cross-region ratio、stream disconnect、egress bytes per successful task、network revenue per delivered task 与增量 gross margin。只有这些指标一起上升，Inference Delivery 才从流量故事变成可验证的 earnings。

## GPU 算完了为什么用户还在等？

因为用户购买的从来不是 GPU 完成了一次计算，而是在约定的 Region、policy 与 SLO 下收到完整结果。

Edge 只负责把用户带进网络，Gateway 要找到真正可用的 model capacity，backbone 要把 request 与 response 送到正确的 Region，Streaming 还要维持到最后一个 chunk 被接收。任何一段失败，前面已经消耗的 GPU 都无法成为一次 successful delivery。

沿这条链往回看，原本统一的“全球算力”也开始分裂成 `Model × Geography × Tier × Policy × SLO`。别处的 GPU 再空闲，借不过来就不是 supply；Token 已经生成，到不了用户也不是交付。
