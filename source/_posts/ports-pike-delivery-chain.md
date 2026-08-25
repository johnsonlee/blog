---
title: OpenAI 最大园区容量接近此前六座
date: 2026-08-23 14:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: ports-pike-delivery-chain
---

2025 年 9 月，OpenAI 一口气公布了五座新 site。连同 Abilene 和正在推进的 CoreWeave projects，[Stargate 的 planned capacity 接近 7GW](https://openai.com/index/five-new-stargate-sites/)。

十一个月后，OpenAI 又签下一座 PORTS-Pike：8 IT-GW。

前一轮要把容量摊在 Texas、New Mexico、Wisconsin 和 Ohio，才凑到接近 7GW；这一次，一个 Ohio campus 就装进了 8GW。要么 Data Center 突然学会了十倍速复制，要么 PORTS-Pike 从一开始就不是前面那些 campus 的放大版。

答案藏在这块土地的上一份工作里。

<!-- more -->

## PORTS-Pike 真的比前六座还大吗？

先把比较边界卡住。前一轮“接近 7GW”是 OpenAI 对六座 Stargate campus 与相关项目的 planned capacity 汇总；PORTS-Pike 披露的是 8 IT-GW，指服务器、网络和存储能够使用的功率。各 site 的公开数字有的是 critical IT load，有的是供电或发电容量，不能直接做一张精确加总表。

![PORTS-Pike 与前一轮 Stargate 的容量量级](/images/ports-pike-scale-comparison.svg)

口径不完全相同，并没有消除数量级上的反常。8 IT-GW 约等于 OpenAI [2025 年全部 available compute](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/) 的 4.2 倍，也占 2030 年 30GW 目标的 27%。过去需要一组 site 承接的容量目标，现在被放进了一份 campus agreement。

真正的问题因此不是 8 比 7 多了多少，而是：**什么样的 campus，才能把原本属于 portfolio 的容量装进一个项目？**

## PORTS-Pike 还是一座 Data Center 吗？

[Permitting Council 对它的定义](https://www.permitting.gov/newsroom/press-releases/ports-technology-campus-latest-gain-fast-41-coverage)不是一栋楼，而是由 frontier training AI Data Center 与 new power generation 组成的 infrastructure project。[PORTS-Pike 官网](https://portscampus.com/)披露的边界更大：10GW Data Center complex、10GW 新发电、765kV Transmission、私有土地与 DOE 修复土地，再加上 NVIDIA Compute。

前面的 Stargate campus 多数从“哪块地已有足够 Power，能多快交出一批 Facility”开始。PORTS-Pike 换了一个交付单位：**不再等待电网出现 8GW spare capacity，而是把发电、输电和 Data Center 一起建出来。**

这更像一座以 AI Compute 为最终产品的工业基地。8GW 也不是一栋 Building 的容量，而是六年内分期建设、由多块土地、多栋建筑、多套变电站和多批 Cluster 共同组成的 program ceiling。

一座 campus 能把边界推到这里，并不是因为 Ohio 突然多出了一块空地。

## 为什么偏偏是 Piketon？

1952 年，美国 Atomic Energy Commission 选中 Piketon 建 Portsmouth Gaseous Diffusion Plant。DOE 给出的原因和今天挑 AI campus 很像：大片平整土地、充足水源、劳动力、交通，以及最重要的 reliable electrical power。

![从铀浓缩到 AI Compute，Piketon 两次成为战略用电基地](/images/ports-pike-industrial-reuse.svg)

气体扩散法极其耗电。[Portsmouth 历史资料](https://portsvirtualmuseum.org/history/uranium-enrichment.html)显示，1956 年签订的供电协议要求连续交付 1,950MW；两座专用电厂为它发电，两回 330kV 双回线路把电送入厂区。这个数字比 OpenAI 2025 年 1.9GW available compute 还略大。

铀浓缩在 2001 年停止以后，留下来的不是一座可以直接塞进 GPU 的旧厂房，而是一块为国家级高耗能任务组织过的工业场地：超过 3,700 acres、既有高压电力走廊、水资源、交通、熟练劳动力，以及联邦政府仍在管理和修复的土地。[DOE 的 site background](https://www.energy.gov/pppo/portsmouth-background)把这些条件完整保留在了项目历史里。

PORTS-Pike 的反常规模，首先来自这种 brownfield inheritance。普通 Data Center 选址要分别寻找 Land、Power、Water 和 Community；Piketon 上一次被选中时，就已经为另一种战略算力把这四项组织过一次。

但 1,950MW 的历史，也不能解释今天的 8 IT-GW。剩下的容量仍然要从零复制。

## 10GW 为什么只变成 8 IT-GW？

[NVIDIA 的公告](https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute)把两个数字放在了一起：至少 10GW 新发电能力，最终形成 8 IT-GW AI factory capacity。它们量的是电力系统的两个不同边界。

![PORTS-Pike 的 10GW、8 IT-GW 与 GPU Power 分别量什么](/images/ports-pike-capacity-boundaries.svg)

10GW 在发电侧。电还要经过输电、变电和园区供配电，才能到达 Facility 的 IT power boundary。冷却、泵、风机、照明和安防消耗 Facility power；CPU、Network、Storage 与 Accelerator 再从 IT power 里分配功率。真正落到 GPU 上的数字还会更小。

所以不能拿 10 除以 8，反推出 PORTS-Pike 的 PUE 是 1.25。Planned generation 与 lease target 之间还隔着并网方式、可靠性备用、phase timing 和实际负载曲线。公开资料只能证明 PORTS-Pike 把电源也纳入了项目，不能证明 8 IT-GW 已经有电可用。

同样，写进一份 agreement 的 8GW，也不是一个已经进入同一施工状态的项目。

## 8GW 是一座项目，还是一组项目？

PORTS-Pike 横跨相邻 private land 与 DOE Portsmouth Site。前者的 FAST-41 范围约 1,300 acres，当前只覆盖两栋 Data Center building 及配套道路、变电站和施工场地；后者由 DOE 在环境修复后分批释放。[2026 年 4 月的 Batch 1 文件](https://www.energy.gov/nepa/articles/cx-270956-environmental-site-assessment-esa-batch-1-leased-property-portsmouth)只确认约 189 acres 进入 Environmental Site Assessment。

![PORTS-Pike 的联邦土地、私有土地与许可边界](/images/ports-pike-land-permitting.svg)

因此“一座 PORTS-Pike”只是商业与地理边界。工程上，它是一组有独立 parcel、permit、building、substation、energization 和 acceptance 日期的 phase。Groundbreaking 可以和 permit review 同时发生，首期可以进入 Early Construction，后续土地仍在 assessment，三个状态并不冲突。

这也是 8GW 能一次签下来的第一个原因：合同可以先定义最终 campus ceiling，土地与工程再按 batch 展开。OpenAI 锁定的是长期供给路径，不是今天已经完成设计的每一栋 Building。

真正最接近交付的，只有最前面的 800MW。

## 为什么第一批只有 800MW？

[OpenAI 的交付计划](https://openai.com/index/openai-joins-ports-pike-project/)把 8GW 明确切成两段：首批 800MW 预计从 2028 年开始 available，largely using existing AEP infrastructure；后续开发则需要 new power plants、new transmission lines 和 associated infrastructure。

![PORTS-Pike 首批 800MW 的并行计划与前置依赖](/images/ports-pike-first-phase-gantt.svg)

800MW 不是随手挑出的 10%。它接近今天这块 site 能沿既有电网路径启动的容量，把最难的新建 Generation 与 765kV Transmission 暂时移出了首期 critical path。Site assessment、permit review、Facility design、AEP service study、长周期设备和 NVIDIA system planning 可以并行，最后在 Permanent Power、Facility commissioning 与 Cluster Acceptance 汇合。

即便如此，2028 也不是 800MW 同时亮灯。官方写的是 capacity 从 2028 年开始分期 available；一栋 Building 或一个 Data Hall 先通过，OpenAI 就可能先接收其中一批 MW，其余部分继续施工和 commissioning。

首批 800MW 的作用更像 bridgehead：先证明这块 site 能把 Facility 与 Cluster 交出来，再为后续 7.2GW 建一套完全不同的电力系统。

## 剩余 7.2GW 为什么不是复制九次？

第一批借 existing AEP infrastructure，后续 7.2GW 要自己复制基础设施。[PORTS-Pike 披露的方案](https://portscampus.com/)包括 10GW 新发电，其中 9.2GW 为天然气发电，以及至少 42 亿美元的 AEP Ohio 765kV 输电工程。

![PORTS-Pike 首期 800MW 与后续 7.2GW 的交付路径为什么不同](/images/ports-pike-phase-split.svg)

后续 phase 要同时关闭四条线：Generation 需要 fuel supply、air permit、interconnection、主设备、施工与同步并网；Transmission 需要 system planning、route、right of way、siting、长周期设备和线路施工；Facility 要完成土建、机电与 commissioning；Cluster 再完成 NVIDIA system deployment 与 OpenAI acceptance。

Power Plant 建好了、Transmission 没到，电送不过来；线路到了、Facility 没通过 commissioning，电变不成 lease capacity；Facility 交了、Cluster 没验收，OpenAI 仍然没有可调度算力。

所以 PORTS-Pike 并没有让 Data Center 复制突然加速十倍。它只是把原来分散在多座 campus、多个 utility territory 和多份合同里的依赖，集中进了一个 program。规模变大以后，瓶颈也从“哪里还能找到电”迁移到“能不能按计划新建一整套电力系统”。

## 把 8GW 放在一处，更快还是更脆弱？

集中建设有一套很清楚的规模逻辑。多期项目可以复用 site team、Basis of Design、供应商框架、施工营地、Network routes 和运维组织；10GW Generation 与 765kV Transmission 也不必为每一座小 campus 重新谈一遍。只要第一套 design 与交付节奏跑通，后续 Building 和 Cluster 才有机会形成真正的 replication engine。

可同一套集中也会放大 interface risk。Generation、Transmission、Fuel、Permit 或一条关键设备供应链延期，会同时影响多个 phase；单一 geography 把极端天气、区域电网、光纤路径和社区关系集中到同一张项目表；8GW 的施工还会争夺同一批 transformer、switchgear、turbine、craft labor 和 commissioning resources。

这不等于 8GW 会组成一个没有隔离的技术 failure domain。不同 Building、Substation、Fabric 和 Cluster 可以分区设计。真正被集中的，是 **schedule 与 capital exposure**：一条 765kV 路径晚一年，不只拖一栋楼，而可能把后面多批 MW 一起向右推。

PORTS-Pike 用 portfolio 的规模换取 campus 的复制效率，也把 portfolio 原本分散的风险压回了一张总计划。

## 8GW 为什么可以先签、后建设？

第二个原因藏在合同里。SB Energy 在 20 年 lease 下分期 build、own、operate；OpenAI 只在 completed capacity becomes available for lease 以后开始付款。8GW 定义最终 demand ceiling，却不会在签约当天触发 8GW 的全部租金。

NVIDIA 则向 SB Energy 投入 15 亿美元，并为 initial 4.25 IT-GW 的 Land、Power 和 Shell 提供 Credit Support，同时保留余下 3.75 IT-GW 的 option。前 4.25GW 与后 3.75GW 连 capital commitment 都不是同一状态。

![PORTS-Pike 一批 MW 从下单到 Lease Payment 的现金流节点](/images/ports-pike-payment-gates.svg)

这套结构把一个看似不可融资的 8GW headline 拆成了多批 cash-flow event。Equipment supplier 在 Design Freeze 后拿 PO，EPC 按进度收款，AEP 在输电建设期投入可能进入 Rate Base 的 capital，SB Energy 等 Facility Available 才开始收租，NVIDIA 要等系统 shipment 与 acceptance，OpenAI 最后从 Production workload 回收成本。

Credit Support 增强的是融资能力，不是 4.25 IT-GW 的交付保证。Permit、Generation、Transmission、Facility 与 Cluster 仍要逐项关闭。**能够先签 8GW，是因为付款和风险被分期了，不是因为供给已经复制完成。**

## 2032 年真的会出现完整 8GW 吗？

公开资料只给了两个可靠锚点：首批 800MW 从 2028 年开始 available，六年 buildout 延续到 2032 年。2029、2030 和 2031 各交多少，每一期何时 Power Available、Facility Available、Cluster Accepted，都没有披露。

![PORTS-Pike 已披露的容量时间锚点与未知区间](/images/ports-pike-capacity-timeline.svg)

在这两个锚点之间画一条匀速上升的实线，会把未知的 Generation、Transmission、Facility 和 Compute milestone 伪装成 management guidance。Through 2032 只定义 planned buildout window，不保证 2032 年 12 月 31 日已经有 8 IT-GW Healthy Capacity。

更合理的判断要把首批和后续拆开。首批 800MW 已经有 existing AEP path、site activity 与 2028 年目标，进入了能够逐项核对的执行路径；但 permit、Permanent Power、commissioning 与 Cluster Acceptance 仍未完成。后续 7.2GW 连年度 phase 都没有公开，还依赖尚未建成的新发电与 765kV Transmission。

因此现有证据支持“首批进入可执行路径”，不足以支持“完整 8GW 已经锁定如期交付”。

## 这么大的生意已经 Price In 了吗？

AEP 是公开市场里最容易建立计算边界的一端。公司已经把 Piketon transmission opportunity 放进超过 100 亿美元的增量资本项目视野；[AEP 2026 年第二季度指引](https://www.aep.com/news/stories/view/12135/)把全年 operating EPS 提高到 6.25 至 6.55 美元，并维持 2025 至 2030 年超过 9% 的增长目标。[AEP Investor Relations](https://www.aep.com/investors/)显示，2026 年 8 月 20 日股价为 125.70 美元。

用 125.70 美元除以 EPS 指引中位数 6.40 美元，得到约 **19.6 倍 forward operating earnings**。Piketon 已经进入 management 的 capital-growth narrative，市场也已经看到这项披露；不能再把 42 亿美元 transmission opportunity 全部当成尚未被发现的增量。

[AEP 的历史行情](https://stockanalysis.com/stocks/aep/history/)提供了第二次检验。PORTS-Pike 公告前一个交易日收于 125.60 美元，公告日收于 126.53 美元，上涨 0.74%；到 8 月 20 日又回到 125.70 美元，只比公告前高 0.08%。股价没有出现一段能够单独归因于 PORTS-Pike 的持续重估，但这也不能证明市场给项目的价值是 0——利率、监管和其它 utility earnings 同样每天影响 AEP。

但 PORTS-Pike 单个项目被 Price In 了多少，现有资料仍然算不出来。缺少的 bridge 是：

`PORTS-Pike Rate Base × Allowed ROE × AEP Ownership / Cost Recovery × In-Service Timing → Incremental EPS`

AEP 没有单独披露项目最终 Rate Base、核准回报率、投运节奏和 EPS 贡献；19.6 倍对应的是整家公司，也无法把 Data Center growth 从其它 utility earnings 中剥离。能够确认的是项目已经进入增长预期，公告本身没有带来可辨认的持续重估；不能确认的是股价原本已经给了它多少价值。**PORTS-Pike 独立贡献的 Price In 程度，结论仍是 Unverified。**

## 下一条公告应该证明什么？

PORTS-Pike 已承诺每年发布 progress report。下一条有价值的公告，不是再重复 8GW，而是证明“一座顶六座”的集中模式确实开始复制。

![PORTS-Pike 接下来哪些事件会改变项目状态](/images/ports-pike-evidence-dashboard.svg)

首期先看 FAST-41 permit、Batch 1 executable design、AEP service plan、Substation energization、长周期设备 PO、Building dry-in、commissioning report 与第一批 available-for-lease MW。它们决定 800MW 能不能沿 existing infrastructure 在 2028 年开始交付。

后续再看 Gas Generation 的 site、air permit、fuel 与 interconnection，765kV Transmission 的 route、right of way、equipment order 与 construction，以及 NVIDIA 是否把 3.75 IT-GW option 变成更强的 capital commitment。它们决定 PORTS-Pike 能不能从一个大合同变成持续复制的 campus。

任何一项持续右移，影响的都不只是一个 milestone。集中模式会把它传导到后面多批 MW，2032 年的 8GW 也要随之下修。

## PORTS-Pike 为什么比六座 Stargate 还大？

因为比较的对象已经变了。

前一轮 Stargate 在全美寻找能够尽快交付 Power 与 Facility 的 site，用多座 campus 拼出接近 7GW。PORTS-Pike 则拿下一块曾经连续消耗近 2GW、为国家级高耗能任务建设过的工业场地，再把 10GW Generation、765kV Transmission、Facility、NVIDIA Compute 和 20 年 OpenAI lease 绑进同一个 program。

它不是一座异常巨大的 Data Center，而是一套试图在同一地点复制 Energy-to-Compute 全栈的工业系统。8GW 之所以能先出现，是因为最终容量可以先签，工程、付款与风险按 phase 展开；8GW 最终能不能出现，则取决于这套系统能否把首批 800MW 的 site advantage，变成后续 7.2GW 的 replication advantage。

原本分散在六座 campus 的问题没有消失，只是被压进了一座更大的项目。也正因为这样，下一道真正值得追的 bottleneck，已经从 Data Center building 继续往上游迁移到 Generation、Transmission、Permit 与 Project Finance。
