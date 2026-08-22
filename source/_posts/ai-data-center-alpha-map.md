---
title: AI 数据中心的 8GW，离可用算力还有多远？
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

OpenAI 前几天宣布，将在 PORTS-Pike [锁定约 8 IT-GW 的容量](https://openai.com/index/openai-joins-ports-pike-project/)。同一份公告里还有两个数字：首批 800MW 预计在 2028 年 available，整个项目的 buildout 将持续六年，直到 2032 年。

先把单位说清楚。GW 是功率单位，1GW 等于 1000MW；IT-GW 指数据中心用于服务器、网络和存储等 IT equipment 的功率容量。它不是 GPU 数量，也不是计算性能。

单位弄清楚，三个数字才接得起来。8GW 是协议锁定的总容量，800MW 是计划在 2028 年交付的首批 capacity，六年是整个项目的 buildout schedule。它们不会在同一天变成可用算力。

这正是问题的起点：8GW 到底走到了哪一步？

是已经拿到的土地，签完的 PPA，送到 site 的电，还是通过 validation、可以跑 production workload 的 GPU cluster？这些状态在新闻稿里都叫“项目进展”，离可用算力却可能差着几年。

分不清这些状态，所有供给分析都会从错误的分母开始。

<!-- more -->

## Data Center 还是一个黑箱

上一篇《[复制速度才是真正的瓶颈](/2026/08/18/the-real-bottleneck-is-replication/)》写到最后，只留下两只时钟：需求多久到，供给多久才能复制出来。需求跑得快，供给爬得慢，中间那段 Replication Gap 才会挤出订单、涨价和超额利润。

沿着这两只时钟往下追，AI 的瓶颈中心落在了 Data Center。SpaceX 更激进，它想把整条地面部署路径换掉。

可在那张 Bottleneck Migration Network 里，Data Center 仍然只是一个方框。

这个方框对投资来说太大了。

电网、变压器、开关柜、UPS、液冷、GPU、HBM、switch、光模块、SSD、施工和 commissioning，全部叠在同一个 delivery outcome 里。每家公司都能从中挑一个词，说自己是 AI infrastructure beneficiary。只知道“数据中心很缺”，根本分不出谁只是需求受益，谁控制着 binding constraint。

上一篇停在 Data Center。这套系列就从这个方框往里拆。

## GPU 装进去以后 算力仍然可能是零

数据中心供给遵循 AND logic：所有子系统必须同时可用。

GPU 到货，但 site 尚未 energize，可用算力为零。Site 已经送电，冷却系统却没有完成 integrated commissioning，容量仍然不可用。Facility 已经 Ready for Service，GPU cluster 的 firmware、network、storage 和 software stack 没有通过 validation，这套 cluster 仍然无法承载 production workload。

设备进仓库，只增加 inventory。**系统通过验证并完成 handoff，才会增加可用算力。**

RFS 是最容易算错的一道线。一座设施从 Site Selection 开始，经过 permitting、design、procurement、construction、energization 和 commissioning，才会走到 Ready for Service。公开 colocation 合同通常把 RFS 定义为设施按约完成建设和测试、具备交付条件；这不等于 GPU 集群已经开始生产。[GDS 的项目文件](https://www.sec.gov/Archives/edgar/data/1526125/000110465924053659/tm2412943d1_ex99-1.pdf)和[一份公开 colocation 合同](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm)都把 commissioning 放在正式交付之前。

RFS 后面还有 IT deployment、burn-in、fabric validation、cluster acceptance 和 Production Handoff。NVIDIA 甚至继续把 Delivered、Healthy、Reserved 与 Active/In-Use 分开：交到客户手里、设备健康、资源被预留、资源正在使用，是四件事。[NVIDIA AI Cloud Requirements](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)把这几道边界写得很清楚。

所以研究数据中心，不能只数 GPU shipment，也不能把 announced GW 全塞进同一张表。项目走到哪一道 handoff，决定这笔供给到底该不该算。

## 把 8GW 放回坐标系

要拆 PORTS-Pike，先得画两条轴。

横轴回答一个问题：**项目走到哪一步了？** 从 Site Selection、energization、RFS 到 Production Handoff，同样写着 1GW 的项目，处在不同位置，离可用算力的时间完全不同。

纵轴回答另一个问题：**哪套系统还没有交付？** 电力、散热、计算、网络和存储必须同时可用，少了任何一层，前面的 GW 都还不能变成 production capacity。NVIDIA 的 [DSX reference architecture](https://docs.nvidia.com/dsx/home)也按 facilities、compute、networking、storage 和 operations 拆开一座 AI factory。

![AI 数据中心 Alpha 地图](/images/ai-data-center-alpha-map.svg)

两条轴一交叉，数字才有坐标。Announced 的 1GW 只是目标容量，energized 的 1GW 已经具备供电条件，RFS 的 1GW 已经具备设施交付条件，走到 Production Handoff 的 1GW 才对应可以承载生产负载的集群。它们都叫 1GW，却不是同一笔供给。

先分清是哪一个 1GW，才轮得到后面的投资问题。

每篇先用一张图把系统接起来。接着往下追：需求单位是什么，到底要复制什么，两只时钟差多久，当前瓶颈松开以后压力会撞向哪里，最后谁能把稀缺变成收入和现金流。

设备科普写到“它怎么工作”就结束了。Investment research 要再往前走一步：**它为什么会缺，缺多久，谁能捕获 economics，股价又算进去了多少。**

这 13 篇的顺序也就定了下来。先把 site 交出来，再把 rack 拼成 cluster，然后让 workload 跑起来，最后把结果送到用户手里。前一篇的终点，就是下一篇的起点。

## 先看 8GW 到底建到了哪里

先从荒地一路追到 RFS。以后看到一家公司宣布 1GW、5GW 或 8GW，至少先知道这个数字离可用算力还有多远。

1. 《AI 数据中心交付：从 Site Selection 到 RFS》

   先把 announced、planned、under construction、energized 和 RFS 放回同一条时间轴。项目现在在哪、下一道 gate 是什么、哪一道最慢，后面的供给判断才有起点。

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

- [OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [U.S. Department of Energy PORTS-Pike fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [NVIDIA DSX reference architecture](https://docs.nvidia.com/dsx/home)
- [NVIDIA Requirements for AI Clouds](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)
- [Schneider Electric Data Center Projects Commissioning](https://download.schneider-electric.com/files?p_Doc_Ref=SPD_DBOY-6NJNK6_EN)
- [Uptime Institute Improve Project Success Through Mission Critical Commissioning](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/)
