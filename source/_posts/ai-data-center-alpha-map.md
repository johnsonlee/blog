---
title: OpenAI 30GW：数据中心交付缺口
date: 2026-08-22 14:55:27
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Investing
  - Bottleneck
i18n_key: ai-data-center-alpha-map
---

[2023 年，OpenAI 的可用算力只有 0.2GW](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)。2024 年升到 0.6GW，2025 年再到约 1.9GW。两年涨了 9.5 倍，仍然不够。2026 年 4 月，OpenAI 又把目标推到了 [2030 年 30GW](https://x.com/OpenAINewsroom/status/2046951726683455866)。

30GW 是 2025 年可用算力的近 16 倍。可就在这个目标公布四个月后，OpenAI 又签下 PORTS-Pike，一座规划容量约 8 IT-GW 的数据中心。

已经签了多少座数据中心，为什么还在继续签，这 8GW 放进 30GW 以后又算多大？

<!-- more -->

## OpenAI 到底签了多少

从 2023 年往后翻，第一份大合同来自 Microsoft。那次 multi-year partnership 没有公布 GW，也没有公布 Azure supercomputer 分别落在哪座数据中心，只说双方已经[建成多套系统，用来训练 OpenAI 的全部模型](https://openai.com/index/openai-and-microsoft-extend-partnership/)。

所以 0.2GW、0.6GW 和 1.9GW 是 OpenAI 各年的 available compute，不是一份可以钉到地图上的 site inventory。Azure、OCI、CoreWeave 和 AWS 分别贡献了多少，每个运行中的 data center 又有多少 GW，OpenAI 没有披露。

第一块能同时钉住位置、容量和运行状态的，是 Abilene。它在 2024 年开工，不到一年就跑起了 AI workload；截至 2026 年中，[1.2GW 规划容量已经向客户交付 42%](https://www.oracle.com/data-centers/)，剩余部分仍在建设。

再往后，physical campus 才开始一座座露出坐标。2025 年 9 月，Abilene 加上五座新 site，把 Stargate 带到[六座 campus、接近 7GW planned capacity](https://openai.com/index/five-new-stargate-sites/)；一个月后，[Michigan 成为第七座](https://openai.com/index/expanding-stargate-to-michigan/)。2026 年又加上 Georgia 的 [Project Camellia](https://openai.com/index/building-ai-infrastructure-with-the-effingham-county-community/) 和 Ohio 的 [PORTS-Pike](https://openai.com/index/openai-joins-ports-pike-project/)。

![OpenAI 自 2023 年以来的美国数据中心交付状态](/images/openai-stargate-campus-map.svg)

截至 2026 年 8 月 22 日，九座里只有 Abilene 已有 workload 在跑，另外七座已经进入 construction，Camellia 仍在 permitting，尚未开工。PORTS-Pike 由 SB Energy 先行开发，OpenAI 2026 年签入时，开发商已经把项目列为 [In Early Construction](https://sbenergy.com/digital-infrastructure/)。圆的面积按各站公开的最终容量缩放，不代表今天已经 available 的 GW；Abilene 的绿色圆也只说明 campus 已经投入使用，真正完成交付的仍是 42%。

各站公开的 GW 口径并不相同：PORTS-Pike 是 IT capacity，Shackelford 是 critical IT load，Doña Ana 和 Camellia 是 power capacity。它们能比较单站 buildout 的量级，不能直接相加。

地图回答了这九座 campus 在哪里、建到哪一步，还不能用来计算 OpenAI 已经锁定了多少 GW。

同一批算力，会在 site、cloud capacity、compute system 和 chip 四层披露里反复出现。[Oracle 的 4.5GW partnership](https://openai.com/index/stargate-advances-with-partnership-with-oracle/) 会落到多座 campus；[Milam County 的 1.2GW lease](https://openai.com/index/stargate-sb-energy-partnership/) 已经包含在 2025 年公布的五座新 site 里；NVIDIA 的 10GW 还是 [letter of intent](https://openai.com/index/openai-nvidia-systems-partnership/)，Broadcom 的 10GW 是一份[系统部署 term sheet](https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/)。后两项合计 20GW，指的是将部署到 OpenAI 及其合作伙伴数据中心里的 systems，不能再算成 20GW 新机房。

[Microsoft、Oracle、AWS、CoreWeave 和 Google Cloud](https://openai.com/index/accelerating-the-next-phase-ai/) 提供 cloud capacity，底下也可能落在同一批 physical infrastructure 上。把每份新闻稿里的 GW 直接相加，同一座数据中心会被算上两遍，甚至三遍。

所以这张图只收录能够钉住位置和交付状态的 physical campus。容量判断回到两个不会重复计算的边界：2025 年已经 available 的 1.9GW，以及 OpenAI 计划在 2030 年拿到的 30GW。

## Anthropic 的 GW 去了哪里

看到这里，Anthropic 反而显得安静。Claude 的用户和收入同样在涨，为什么很少看到 Anthropic 接连宣布一座 5GW、8GW 的 data center？

两家公司拿算力的路径不同。OpenAI 把 physical infrastructure 收进 Stargate，一座 campus 从选址到开工都挂着 OpenAI 的名字。Anthropic 的算力分散在 AWS Trainium、Google TPU、Azure NVIDIA、Fluidstack 和 SpaceX，新闻通常由 cloud provider、chip supplier 或 data center developer 发出来。

GW 并没有消失。2025 年 10 月，[Google 为 Anthropic 安排了 2026 年上线的 1GW 以上 TPU capacity](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services)；2026 年 4 月，[AWS 又签下最高 5GW，其中接近 1GW 会在 2026 年底前上线](https://www.anthropic.com/news/anthropic-amazon-compute)；一个月后，[Anthropic 接走 Colossus 1 的全部 capacity，超过 300MW](https://www.anthropic.com/news/higher-limits-spacex)。再加上 [Azure 的 1GW](https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships) 和 [2027 年开始交付的 Google/Broadcom capacity](https://www.anthropic.com/news/google-broadcom-partnership-compute)，Anthropic 也在提前锁定多年的 GW 供给，只是没有把它们包装成一张 Stargate campus map。

到了 available compute，比较就卡住了。截至 2026 年 8 月 22 日，同一口径下能核对的公司级数据仍停在 2025 年底：OpenAI 披露了 1.9GW，Anthropic 没有披露总量。[一份 OpenAI memo](https://qz.com/openai-investor-memo-compute-advantage-anthropic-041026)估算 Anthropic 约有 1.4GW；[Epoch AI 把这项外部 anchor 放进模型](https://github.com/epoch-research/ai-compute-users)以后，给出的 90% 区间是 1.0GW 到 1.9GW，中位数 1.38GW。图里的 Anthropic 数据因此全部标成 estimate，不能和 OpenAI 的披露值混为一谈。

![OpenAI 与 Anthropic 可用算力趋势](/images/openai-compute-growth-forecast.svg)

2026 年也只能推算。把 2025 年的 1.4GW 估算值，与 AWS、Google 和 SpaceX 已公布的 2026 年新增 capacity 放在一起，年末大约指向 3.7GW。它不是 Anthropic guidance，交付延迟或口径重叠都可能改变结果。

再往后，OpenAI 的 memo 只给了两个区间：OpenAI 预计 2027 年进入 low-double-digit GW，Anthropic 预计在 2027 年底达到 7GW 到 8GW。OpenAI 另有 2030 年 30GW 目标；Anthropic 没有公布 2028 到 2030 年的公司级 available compute guidance，所以蓝线停在 2027 年。绿色虚线也只是连接 2027 与 2030 两个锚点，不是 OpenAI 的逐年 guidance。把 AWS 最高 5GW、Google 5GW 和 Azure 1GW 直接铺到未来各年，会把 contract ceiling 伪装成 delivery schedule。

这张图至少排除了一个误会：Anthropic 很少出现在大型 data center 的标题里，不等于 Anthropic 没有在抢 GW。OpenAI 把交付路径显性化了，Anthropic 则把同一条路径拆给多家基础设施供应商。两条曲线都在从不到 2GW 向 10GW 量级推进。

## 30GW 对应什么需求

拿算力的路径不同，新增 capacity 最终都要被 workload 吃掉。回到 OpenAI 的 30GW，它要同时喂两种需求。

[Training compute 用来购买下一代模型的能力，inference compute 用来交付今天的产品](https://openai.com/index/a-scorecard-for-the-ai-age/)。用户越多，请求越多，inference 就越大；模型开始 reasoning，一次请求会消耗更多 test-time compute；进入 Agent 以后，一次请求还会展开成[持续几分钟甚至几小时](https://openai.com/index/how-agents-are-transforming-work/)的 model invocation、tool call 和 retry。

OpenAI 把三年数据放在一起：可用算力增长 9.5 倍，ARR 也从 20 亿美元增长到 200 亿美元以上，正好 10 倍。OpenAI 的判断很直接：如果当时有更多 compute，产品采用和收入还会更快。[算力既在训练未来的模型，也在承接今天的收入](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)。

于是更好的模型带来更多使用，更多使用带来更多收入，收入再去锁下一批算力。算法和硬件会不断提高 performance per watt，但需求单位也在从一次问答，变成一项持续运行的任务。效率提高释放出来的 capacity，很快又会被新的 workload 吃掉。

30GW 还躺在 roadmap 上。OpenAI 每多签一份，锁定的都是几年后的供给。

## PORTS-Pike 的 8GW 有多大

PORTS-Pike 的公告没有写 GPU 数量，也没有写 FLOPS，只给了一个 8 IT-GW。这个数字量的是服务器、网络和存储能够使用的功率容量，回答不了 cluster 能跑出多少算力。

放回 OpenAI 的算力版图，8GW 约等于 2025 年全部可用算力的 4.2 倍，也相当于 2030 年 30GW 目标的 27%。单个 campus 吃掉超过四分之一的长期目标，当然大。

可这 8GW 不会一起上线。[首批 800MW，也就是 0.8GW，预计 2028 年 available](https://openai.com/index/openai-joins-ports-pike-project/)，整个 buildout 要持续六年，直到 2032 年。OpenAI 今天也不会为 8GW 全额付款，completed capacity 具备交付条件以后，才开始支付 lease 费用。

所以 8GW 同时有三个位置：它是 PORTS-Pike 的最终规划容量，是 2030 年目标里可能兑现的一部分，也是 2032 年才有机会完成的 buildout。把它直接记进今天的 available compute 没有依据；即使放到 2028 年的首批交付节点，也会把 800MW 高估成 8GW。

问题也就从“OpenAI 还要多少 GW”变成了“已经签下来的 GW，什么时候才能变成可用算力”。

## Data Center 还是一个黑箱

OpenAI 可以在一份协议里锁下 8GW，首批 800MW 却要等到 2028 年。签合同只用一支笔，复制供给要穿过 site、power、facility 和 cluster。

上一篇《{% post_link the-real-bottleneck-is-replication '复制速度才是真正的瓶颈' %}》留下的是一个时间差：OpenAI 对 30GW 的需求会在多久内形成，能够承载 production workload 的 capacity 又要多久才能复制出来。需求形成得快，供给扩得慢，中间那段 Replication Gap 才会挤出订单、涨价和超额利润。

顺着 Replication Gap 往下追，AI 的瓶颈中心落在了 Data Center。SpaceX 更激进，它想把整条地面部署路径换掉。

可在那张 Bottleneck Migration Network 里，Data Center 仍然只是一个方框。

这个方框太大了。

电网、变压器、开关柜、UPS、液冷、GPU、HBM、switch、光模块、SSD、施工和 commissioning，全部叠在同一个 delivery outcome 里。每家公司都能从中挑一个词，说自己是 AI infrastructure beneficiary。只知道“数据中心很缺”，根本分不出谁只是需求受益，谁控制着 binding constraint。

上一篇停在 Data Center。这套系列就从这个方框往里拆。

## GPU 装进去以后 算力仍然可能是零

数据中心供给遵循 AND logic：所有子系统必须同时可用。

GPU 到货，但 site 尚未 energize，可用算力为零。Site 已经送电，冷却系统却没有完成 integrated commissioning，容量仍然不可用。Facility 已经 Ready for Service，GPU cluster 的 firmware、network、storage 和 software stack 没有通过 validation，这套 cluster 仍然无法承载 production workload。

设备进仓库，只增加 inventory。**系统通过验证并完成 handoff，才会增加可用算力。**

RFS 是最容易算错的一道线。一座设施从 Site Selection 开始，经过 permitting、design、procurement、construction、energization 和 commissioning，才会走到 Ready for Service。公开 colocation 合同通常把 RFS 定义为设施按约完成建设和测试、具备交付条件；这不等于 GPU 集群已经开始生产。[GDS 的项目文件](https://www.sec.gov/Archives/edgar/data/1526125/000110465924053659/tm2412943d1_ex99-1.pdf)和[一份公开 colocation 合同](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm)都把 commissioning 放在正式交付之前。

RFS 后面还有 IT deployment、burn-in、fabric validation、cluster acceptance 和 Production Handoff。NVIDIA 甚至继续把 Delivered、Healthy、Reserved 与 Active/In-Use 分开：交到客户手里、设备健康、资源被预留、资源正在使用，是四件事。[NVIDIA AI Cloud Requirements](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)把这几道边界写得很清楚。

所以研究数据中心，不能只数 GPU shipment，也不能把 announced GW 全塞进同一张表。项目走到哪一道 handoff，决定这笔供给到底该不该算。

## 把 GW 放回坐标系

要拆 PORTS-Pike，先得画两条轴。

横轴回答一个问题：**项目走到哪一步了？** 从 Site Selection、energization、RFS 到 Production Handoff，同样写着 1GW 的项目，处在不同位置，离可用算力的时间完全不同。

纵轴回答另一个问题：**哪套系统还没有交付？** 电力、散热、计算、网络和存储必须同时可用，少了任何一层，前面的 GW 都还不能变成 production capacity。NVIDIA 的 [DSX reference architecture](https://docs.nvidia.com/dsx/home)也按 facilities、compute、networking、storage 和 operations 拆开一座 AI factory。

![AI 数据中心 Alpha 地图](/images/ai-data-center-alpha-map.svg)

两条轴一交叉，数字才有坐标。Announced 的 1GW 只是目标容量，energized 的 1GW 已经具备供电条件，RFS 的 1GW 已经具备设施交付条件，走到 Production Handoff 的 1GW 才对应可以承载生产负载的集群。它们都叫 1GW，却不是同一笔供给。

先分清是哪一个 1GW，才轮得到后面的定价与收益判断。

每篇先用一张图把系统接起来。接着往下追：需求单位是什么，到底要复制什么，Replication Gap 有多长，当前瓶颈松开以后压力会撞向哪里，最后谁能把稀缺变成收入和现金流。

设备科普写到“它怎么工作”就结束了。把系统讲清楚以后，还要再往前走一步：**它为什么会缺，缺多久，谁能捕获 economics，股价又算进去了多少。**

这 13 篇的顺序也就定了下来。先把 site 交出来，再把 rack 拼成 cluster，然后让 workload 跑起来，最后把结果送到用户手里。前一篇的终点，就是下一篇的起点。

## 先看数据中心建到了哪里

先从荒地一路追到 RFS。以后看到一家公司宣布 1GW、5GW 或 8GW，至少先知道这个数字离可用算力还有多远。

1. 《AI 数据中心交付：从 Site Selection 到 RFS》

   Announced、planned、under construction、energized 和 RFS 要放回同一条时间轴。项目现在在哪、下一道 gate 是什么、哪一道最慢，后面的供给判断才有起点。

2. 《AI 数据中心电网接入：第一道闸门》

   项目状态理清以后，第一个 binding constraint 通常来自 utility side。PPA、interconnection agreement 和 site energization 经常被一句“已经拿到电”混在一起，它们差的可能不是一个流程，而是几年。

3. 《AI 数据中心供配电：从变电站到 GPU》

   Site energization 只把电送到并网点。进入 GPU 之前，电力还要穿过 transformer、switchgear、UPS、PDU、busway、power shelf 和 VRM。这里要找的是 lead time 最长、替代最难、又能捕获增量价值的那一段。

4. 《AI 数据中心散热：液冷之后》

   GPU 消耗的电力最终几乎全部转化为热。Cold plate 只是 thermal path 的起点，后面还有 CDU、secondary loop、chiller、cooling tower 和 dry cooler。液冷放量以后，哪一环会先成为 binding constraint？

5. 《AI 数据中心 Commissioning：建完不等于交付》

   电能送，热能排，仍然不能直接交付。Mechanical Completion 到 RFS 之间还隔着 startup、functional testing、L1-L5 commissioning 和 Integrated Systems Testing。单台设备启动成功，不代表整套 mission-critical system 能通过故障场景验证。[Uptime Institute](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/)解释了这道验证为什么不能省。

## 再看 GPU 什么时候变成算力

RFS 只说明机房可以交。接下来轮到 IT equipment：GPU 搬进去以后，还要从零件、机架、网络和存储一步步变成 healthy cluster。

6. 《AI 数据中心机架交付：从 GPU 到 Rack》

   第一处断层在 GPU 和 rack 之间。GPU shipment、server shipment、rack delivery 和 cluster capacity 是四个数字。把 GPU、CPU、HBM、NIC、DPU、compute tray、NVLink switch tray 和 power shelf 拼成 rack，交付单位已经变了。

7. 《AI 数据中心万卡集群：网络上限》

   Rack delivery 不等于 cluster capacity。万卡集群也不是把 GPU 数量乘一万：NVLink 负责 scale-up，InfiniBand 或 Ethernet 负责 scale-out，switch ASIC、optical transceiver、laser、fiber、connector 和 testing 决定整张 fabric 能否通过 validation。

8. 《AI 数据中心存储：从 Checkpoint 到 KV Cache》

   Fabric 通过 validation，workload 仍然需要完整的数据路径。Training data、model weights、checkpoint、local NVMe、parallel file system、object storage 和 KV cache 分布在不同 storage tier。NAND bit 上来了，controller、firmware 和 qualification 仍然可能卡住 enterprise SSD 上线。

9. 《AI 集群交付：RFS 到 Production Handoff》

   Compute、network 和 storage 完成部署，最后还要通过系统级验证。IT deployment、firmware、provisioning、burn-in、fabric validation 和 cluster acceptance 全发生在这段。安装了多少 GPU 不再重要，deployment velocity、cluster yield 和 healthy capacity 才重要。

## 算力变成收入还差最后一段

Production Handoff 结束，physical capacity 才算交付。它能否转化成 billable workload，还取决于同一 MW 承载的是 Training 还是 Inference，以及 Inference 请求是否会展开成 Agent workload。不同 workload 的吞吐、延迟、利用率和 economics 完全不同，结果还要穿过数据中心之间的网络才能到达用户。

10. 《Training vs Inference：两种数据中心》

    先看 cluster 接到什么工作。Training 追求大规模同步计算，Inference 要在 latency、batching、利用率和地理位置之间取舍。把两种 workload 混在一起，基础设施需求会从第一步就算错。

11. 《Agent 算力账单：从 Token 到 Task》

    Inference 承载 Agent workload 后，一次 user request 会展开成多次 model invocation，以及 routing、prefill、decode、retrieval、tool call、retry、cache 和 scheduling。Token、request、task 与 tasks per MW，哪一个才是连接客户需求和物理容量的单位？

12. 《AI 算力交付：从 Cluster 到 User》

    Task 在 cluster 内完成执行，服务仍然没有交付。DCI、backbone、transit、peering、CDN、edge 和 metro inference 决定结果能否满足 latency SLO。内部 compute capacity 扩张以后，binding constraint 可能迁移到数据中心外部。

## 拿 PORTS-Pike 的 8GW 做一次验算

13. 《PORTS-Pike：拆开 8GW 数据中心》

    从 site 一直走到 user，8GW 已经从单一容量数字展开成一组交付状态和系统需求。最后把 PORTS-Pike 的每个项目放回 delivery stage，把每一 GW 展开成 power、thermal、compute、network 和 storage，再沿着 Bottleneck Migration Network 追踪下一个 bottleneck candidate。

这篇 case study 只接受能核对的东西：合同、项目进度、交期、产能、qualification、订单和财务数据。哪一个 node 已经 price in，哪一个 supplier 拥有定价权并能转化成毛利和现金流，什么事实出现时 thesis 必须作废，都要写清楚。

## 读完以后就该会自己拆了

这套系列默认读者刚进来时，连 transformer、switchgear 和 PDU 有什么区别都不知道。没关系。每篇先放一张流程、结构或架构图，图负责把系统接起来，文字负责把钱追下去。

一张“AI 数据中心受益股名单”几个月就会过期，瓶颈也会迁移。更该留下的是一套可以反复使用的拆法：看到项目新闻，知道 capacity 处在哪个状态；看到供应商订单，知道需求来自系统哪一层；看到一个 node 变红，能继续追下一个 node；看到一只已经涨了几倍的“AI 基建龙头”，还记得问一句市场到底 price in 了多少。

下一次再看到 8GW、10GW 或 100GW，先别急着填进 Excel。

先问一句：它走到哪一步了？

## 资料

- [OpenAI plans 30GW of compute by 2030](https://x.com/OpenAINewsroom/status/2046951726683455866)
- [A business that scales with the value of intelligence](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)
- [OpenAI memo compares its compute capacity with Anthropic](https://qz.com/openai-investor-memo-compute-advantage-anthropic-041026)
- [Epoch AI frontier-lab compute model](https://github.com/epoch-research/ai-compute-users)
- [Anthropic expands Google Cloud TPU capacity](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services)
- [Anthropic and Amazon expand collaboration for up to 5GW](https://www.anthropic.com/news/anthropic-amazon-compute)
- [Anthropic adds more than 300MW from SpaceX](https://www.anthropic.com/news/higher-limits-spacex)
- [Microsoft, NVIDIA and Anthropic strategic partnerships](https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships)
- [Anthropic expands Google and Broadcom partnership](https://www.anthropic.com/news/google-broadcom-partnership-compute)
- [OpenAI and Microsoft extend partnership](https://openai.com/index/openai-and-microsoft-extend-partnership/)
- [AWS and OpenAI announce multi-year strategic partnership](https://openai.com/index/aws-and-openai-partnership/)
- [OpenAI partners with Cerebras](https://openai.com/index/cerebras-partnership/)
- [OpenAI, Oracle, and SoftBank expand Stargate with five new AI data center sites](https://openai.com/index/five-new-stargate-sites/)
- [Crusoe's flagship 1.2GW AI data center campus in Abilene](https://crusoe.ai/blog/crusoe-2024-impact-report/)
- [Oracle AI data center construction and delivery status](https://www.oracle.com/data-centers/)
- [Vantage Frontier campus: 1.4GW of critical IT load](https://vantage-dc.com/wp-content/uploads/2025/08/VDC_DataSheet_Frontier.pdf)
- [Project Jupiter: up to 2.45GW of installed fuel-cell capacity](https://www.oracle.com/news/announcement/oracle-borderplex-and-bloom-energy-to-power-project-jupiter-with-fuel-cell-technology-2026-04-27/)
- [Vantage Lighthouse campus: 902MW development](https://blog.vantage-dc.com/2026/03/30/vantage-data-centers-and-partners-host-career-expo-in-port-washington-wisconsin-to-connect-local-talent-with-lighthouse-opportunities/)
- [SB Energy data center construction status](https://sbenergy.com/digital-infrastructure/)
- [Effingham County: Project Camellia review and permitting](https://effinghamcounty.org/m/newsflash/home/detail/466)
- [Expanding Stargate to Michigan](https://openai.com/index/expanding-stargate-to-michigan/)
- [Building AI infrastructure with the Effingham County community](https://openai.com/index/building-ai-infrastructure-with-the-effingham-county-community/)
- [OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [U.S. Department of Energy PORTS-Pike fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [NVIDIA DSX reference architecture](https://docs.nvidia.com/dsx/home)
- [NVIDIA Requirements for AI Clouds](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)
- [Schneider Electric Data Center Projects Commissioning](https://download.schneider-electric.com/files?p_Doc_Ref=SPD_DBOY-6NJNK6_EN)
- [Uptime Institute Improve Project Success Through Mission Critical Commissioning](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/)
