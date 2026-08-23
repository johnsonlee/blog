---
title: 发电够了为什么还要等到 2031？
date: 2026-08-23 03:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-transmission
---

2025 年 11 月，AEP Ohio 给排队中的 36 个 Data Center site 做完了 load study。模型先假设 generation 充足，再把 13,022.7MW 新负荷放进 PJM 的区域电网。

结果是：一座也接不了。第一批要等到 2031 年第四季度，另一批的 planning estimate 已经到了 2033 年。

发电已经不是模型里的瓶颈，为什么还要等六年？

<!-- more -->

## 发电够了为什么还送不到数据中心？

先把 AEP 的假设说完整。“Generation 充足”不是说现实中的电厂已经建好，而是这份研究故意不判断发电够不够。它把 supply 先设成已满足，只看现有 transmission network 能不能可靠承接新增负荷。

即使这样，答案仍然是否定的。因为有电和电能到达目标区域，是两件事。

交流电网也不是从电厂到 Data Center 的专用管道。Generator 在一个节点注入功率，负荷在另一个节点取电，新增潮流会按网络阻抗分摊到多条路径。Operator 可以改变 generation dispatch、network topology 或 power-flow control，却不能指定某 1GW 只沿地图上最短的那条线前进。

![新增负荷怎样改变整张交流电网的潮流](/images/central-ohio-power-flow.svg)

于是，真正的问题不再是附近有没有一条 1GW 线路，而是增加这笔负荷以后，整张网络还有没有一组在正常与故障状态下都成立的潮流解。

## 园区旁边有余量为什么还是不能接？

正常状态下送得过去，只通过了最宽松的一次校核。电网还要假设一条 line 或一台 transformer 退出，也就是 N-1；检修期间稳定下来以后再失去一个设备，还要检查 N-1-1。

[NERC TPL-001-5.1](https://www.nerc.com/pa/Stand/Reliability%20Standards/TPL-001-5.1.pdf)要求规划模型在规定 contingency 下不发生 cascading，并让 facility rating、voltage 与 stability 保持在允许范围内。AEP 对 36 个 site 具体做了 N-1 thermal、N-1-1 thermal、N-1-1 voltage magnitude 和 voltage drop analysis。

Thermal violation 最直观：电流让 conductor 发热、下垂，最先越过 rating 的设备可能在园区旁边，也可能在几百公里外。Voltage constraint 更隐蔽。远距离输送 real power 需要 reactive power 支撑；故障后电压跌得太低，即使导线没有过热，这笔负荷仍然不能接入。

所以 transmission capacity 不是线路铭牌，也不是周边线路余量的总和。**它是把新增负荷放进系统模型以后，所有 contingency 与约束共同留下的最小值。**

## 13GW 到底要等哪一项工程？

AEP 收到的 36 份申请里，32 个 Central Ohio site 合计 9,807.7MW，另外 4 个 site 合计 3,215MW。研究没有给每座园区各排一个日期，而是按区域工程释放的容量分成三个 cluster。

![AEP Ohio 13GW 新负荷怎样分成三个 cluster](/images/central-ohio-load-clusters.svg)

Cluster 1 是 Central Ohio 排位靠前的 5,454.5MW；Cluster 3 是区域外的 3,215MW。两组都要等区域项目 `2025W1-570` 或等效方案，还要并行完成各自的 non-regional 与 local upgrades。Cluster 2 是 Central Ohio 剩下的 4,353.2MW，即使前一项工程完工，还需要另一套尚未选定的区域方案。

这也改变了 queue position 的含义。排位不再直接对应某个开工日，而是先决定进入 Cluster 1 还是 Cluster 2。若前面的客户不签 LOA 与 ESA，后面的项目才可能向前移动。

## 一项输电工程为什么要六年？

AEP 做研究时，PJM 还没有选出区域方案，只是假设 Proposal 570 会中选并在 2031 年第四季度投运。2026 年 2 月 12 日，[PJM 董事会把这套方案批准为 baseline project `b4068`](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260203/20260203-pjm-board-whitepaper-february-2026.pdf)。研究里的假设向现实前进了一步，但“一个项目”随即展开成几十项工程。

西侧要从 Indiana 的 Greentown 经 Teddy 接到 Marysville，另一侧要把 Guernsey、Conesville、West Millersport 和 Adkins 连成新的 765kV 骨干，再配套 Teddy 至 Beatty、Cole 等 345kV 线路、多个 765/345kV substation、STATCOM、breaker、relay 与既有线路改造。

![PJM b4068 不是一条线而是一张区域网络](/images/ohio-seven-year-scope.svg)

[PJM 的 constructability analysis](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260106/20260106-2025-rtep-window-1-constructability-and-cost-analysis-report.pdf)给出的 Proposal 570 scope 是 291.5 miles 新建 765kV、35 miles 新建 345kV，其中 277.4 miles 是 greenfield。申报成本是 27.75 亿美元，PJM independent estimate 是 40.26 亿美元，相差约 45%。

一条 corridor 的 route、state siting、environmental review、right of way 和 easement 必须先收敛，field construction 才能连续推进。与此同时，线路与变电站设计、long-lead equipment、outage plan 可以并行，但最后必须一起通过 protection、SCADA、telecom、phasing 与 energization test。少一段土地、晚一台 breaker，整条路径都不能投运。

## 2031 是承诺还是估算？

它是 projected in-service date，不是保证。

2025 年 11 月，2031 Q4 还是 AEP 对一个未中选方案的建模假设。PJM 董事会后来批准了 `b4068`，[最新 baseline assessment](https://www.pjm.com/-/media/DotCom/planning/rtep-dev/baseline-reports/2025-rtep-baseline-assessment.pdf)也把 Greentown-Teddy、Conesville-West Millersport、West Millersport-Adkins 等关键组件的 projected date 列为 2031-10-31，日期因此比最初多了一层证据。

可同一份 constructability analysis 把 schedule risk 评为 Medium，把 ROW/land acquisition risk 评为 Medium-High；27.75 亿美元 proposal 与 40.26 亿美元 independent estimate 之间也留着巨大的执行空间。

![2031 年投运日期建立在哪些条件上](/images/ohio-seven-year-risk.svg)

而且，AEP 明确提醒：客户签回 LOA 与 ESA 后，正式负荷还要提交 PJM 做后续 RTEP analysis，届时可能识别出更多 upgrades。Cluster 2 的 2033 更只是一项 planning estimate，因为触发下一轮 competitive window 的区域方案尚未确定。

所以 2031 不是倒计时归零后自动出现的 13GW。它是 project selection、route、ROW、equipment、construction 与 system test 全部按计划闭合时，第一批 cluster 才可能跨过的 gate。

## 为什么不能先把现有线路挤一挤？

可以先挖，但要先知道 binding constraint 在哪里。

Dynamic Line Rating 用天气、conductor temperature 和实时监测替代保守的 static rating；冷而有风时，线路散热更快，可以多送一些。Power-flow control 与 topology optimization 能把潮流从拥塞路径移向还有余量的线路。Advanced reconductoring 则复用 tower 与 right of way，更换容量更高的 conductor。

[DOE 汇总的实际部署](https://www.energy.gov/cmei/systems/articles/smart-transmission-tools-modernize-americas-power-grid)里，Oncor 的 DLR sensor 提高了 6% 到 14% 的线路容量，Duquesne Light 的 pilot 提高 25%；PPL 在 31 miles 线路上避免了一项 1,200 万美元 reconductoring，并减少超过 6,400 万美元 congestion cost。

![不同输电约束分别需要什么补救手段](/images/transmission-remedy-matrix.svg)

这些工具能释放被 conservative rating 或潮流分布藏住的 headroom，却不能凭空创造跨区域 transfer path。若真正的约束是 corridor、voltage support 或 N-1-1 下的系统强度，换一条导线、加几个 sensor 都无法替代新的 EHV network。PJM 最终选择 291.5 miles 765kV scope，本身就在说明 Central Ohio 缺的不是某一段线路的几个百分点。

## 27.75 亿美元会先变成谁的收入？

不会在 PJM 批准项目的当天变成 contractor revenue。

PJM 文件先确定 transmission owner、designated entity、cost allocation 和 project scope。Rate base 属于合格输电资产的 owner；engineering、tower、conductor、substation 与 commissioning 则要经过另外的 procurement 和 contract award，才会进入承包商或 OEM 的 backlog。

`b4068` 的公开文件已经列出 Grid Growth Ohio LLC、AEP、ATSI、Dayton 等 designated entity 或 transmission owner，却没有列出 Quanta Services 获得哪一段 EPC scope。27.75 亿美元是 proposal cost estimate，不是 PWR order。

Quanta 仍然值得跟踪，因为它横跨 transmission engineering、substation、line construction 与 skilled labor。可截至 2026 年第二季度，[Electric segment 的 291.1 亿美元 RPO 与 437.9 亿美元 backlog](https://investors.quantaservices.com/news-events/press-releases/detail/402/quanta-services-reports-second-quarter-2026-results)覆盖整个业务，其中 backlog 还包含 146.8 亿美元按历史趋势估算的 MSA 与短期 non-fixed-price orders。没有 project award，就不能从行业需求直接跳到这项工程贡献了多少 earnings。

真正要追的 commercial event 是：route 与监管路径收敛以后，谁拿到 contract award 或 notice to proceed，多少金额进入 RPO，何时按 procurement、construction 与 commissioning milestone 确认 revenue。

## PWR 已经 Price In 了多少？

截至 2026 年 8 月 21 日，PWR 收于 639.34 美元。Quanta 最新 guidance 的 2026 adjusted diluted EPS 是 16.45 至 16.95 美元，中点 16.70 美元，对应 38.3 倍当年 adjusted earnings。

若要求 10% annual return，并把 2030 exit multiple 分别放在 25、30 和 35 倍，当前价格要求的 2030 adjusted EPS 是 37.44、31.20 和 26.74 美元。相对 2026 guidance 中点，四年 CAGR 分别是 22.4%、16.9% 和 12.5%。

![从 b4068 项目到 PWR earnings 还缺哪段证据](/images/pwr-transmission-evidence-bridge.svg)

这给出了比“输电很缺”更明确的结论：**Quanta 的长期增长已经被显著 Price In，`b4068` 对 Quanta 的项目贡献仍然 Unverified。**

即使 2030 年仍给 30 倍 adjusted EPS，Quanta 也要把 earnings 连续四年增长约 17%，才能在 10% required return 下解释今天的价格。若 exit multiple 收到 25 倍，要求升到 22.4%。这条路径包含 Quanta 全部 Electric、Underground and Infrastructure、并购和 margin，不只来自 Data Center transmission。

因此，项目中标只能补上 evidence bridge 的第一段。Awarded scope、RPO conversion、fixed-price execution 与 margin 必须一起超过当前价格隐含的路径，输电瓶颈才会变成预期差。

## 骨干网建好为什么还不能上电？

回到 AEP 的 13,022.7MW。`b4068` 投运以后，解决的是目标区域能否可靠承接新增负荷。它不会替任何一座 campus 完成自己的 high-voltage interconnection、metering、protection、control、test 和 staged energization。

发电侧先回答系统有没有足够的供给，输电侧再回答功率能不能到达目标区域。走到 site 边界，区域网络已经准备好，园区仍然要完成最后一段接入，电才真正出现在数据中心的 bus 上。

## Sources

- [AEP Ohio: DCT Load Study Letter, November 7, 2025](https://www.aepohio.com/lib/docs/ratesandtariffs/ohio/AEP-Ohio_DCT_Load_Study_Letter_25.11.7.pdf)
- [AEP Ohio: Data Center Tariff](https://www.aepohio.com/company/about/rates/data-center-tariff/)
- [PJM: TEAC Recommendations to the PJM Board, February 2026](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260203/20260203-pjm-board-whitepaper-february-2026.pdf)
- [PJM: 2025 RTEP Window 1 Constructability and Cost Analysis](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260106/20260106-2025-rtep-window-1-constructability-and-cost-analysis-report.pdf)
- [PJM: 2025-2040 Baseline Reliability Assessment](https://www.pjm.com/-/media/DotCom/planning/rtep-dev/baseline-reports/2025-rtep-baseline-assessment.pdf)
- [PJM: RTEP Development](https://www.pjm.com/planning/rtep-development)
- [NERC: TPL-001-5.1 Transmission System Planning Performance Requirements](https://www.nerc.com/pa/Stand/Reliability%20Standards/TPL-001-5.1.pdf)
- [U.S. Department of Energy: Smart Transmission Tools Modernize America's Power Grid](https://www.energy.gov/cmei/systems/articles/smart-transmission-tools-modernize-americas-power-grid)
- [Quanta Services: Second-quarter 2026 results](https://investors.quantaservices.com/news-events/press-releases/detail/402/quanta-services-reports-second-quarter-2026-results)
- [Quanta Services: Second-quarter 2026 Form 10-Q](https://investors.quantaservices.com/sec-filings/all-sec-filings/content/0001050915-26-000025/pwr-20260630.htm)
- [Yahoo Finance Japan: Quanta Services historical prices](https://finance.yahoo.co.jp/quote/PWR/history)
