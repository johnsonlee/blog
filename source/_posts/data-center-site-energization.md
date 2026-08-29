---
title: 262MW 园区永久送电时预计用 4MW
date: 2026-08-23 03:15:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Power Grid
i18n_key: data-center-site-energization
---

Virginia 的一座数据中心原本希望在 2025 年 7 月送电，永久变电站却要到 2027 年 7 月才能投运。Dominion 给出的办法，是先从附近的 Cranes Corner Substation 引出 bridging power：一路 7MVA，再加一路 11MVA。等 Centreport Substation 建好，园区再切到永久供电路径。

可这个项目最终申请的是 262MW。2027 年永久供电投运时，预计 summer peak 只有 4MW；262MW 要到 2037 年才爬满。

同一座园区于是同时出现 7MVA、11MVA、4MW 和 262MW。新闻里一句“数据中心已经送电”，到底有多少已经变成可用算力？

<!-- more -->

## 262MW 为什么只能先拿到 18MVA？

Cranes Corner 和 Garrisonville 是离园区最近的两座既有 substation。地图上虽然都有电线，把 262MW 全部接进去以后，两边却都会出现 transformer overload 和 reliability violation。

Dominion 的 Facility Interconnection Requirements 还规定，超过 100MW 的 load interconnection 要采用 four-breaker ring bus。Cranes Corner 和 Garrisonville 当初都没有按这个规模建造，不能直接接住 262MW。Cranes Corner 的 18MVA bridging power 之所以能先送，是因为规模仍小，而且已经有一项 2027 年完工的永久方案来消除约束。Dominion 也写明，2026 年以后若想把临时容量提高到 18MVA 以上，还要增加 distribution infrastructure。

![Centreport 的临时供电、永久供电与负荷爬坡](/images/ai-site-energization-ramp.svg)

2027 年 7 月，service path 会从临时线路切到 Centreport Substation。Dominion 当时对 2027 summer peak 的预测只有 4MW，随后才按园区楼栋、IT deployment 和获批 load increment 逐年增加，2037 年到 262MW full buildout。

**18MVA 是临时供电上限，4MW 是某一年的预计实际峰值，262MW 是十年后的 full-buildout demand。** 三个数字描述的不是同一种 capacity。把 contract capacity 直接当成已经 energized 的负荷，再把 energized load 当成 available compute，会连续高估两次。

## 送电到底送到了哪里？

Regional transmission 把 bulk power 送到目标区域，Site Energization 再从 transmission owner 与园区的电气边界往下走：regional transmission 进入 interconnection substation，utility 与客户各自完成连接设施、保护、计量和通信，电力最终到达 service delivery point。

这一步不包括机房内部的 transformer、switchgear、UPS、PDU、busway 和 power shelf。它们属于下一段供配电链。Site Energization 只回答一件事：**园区在什么条件下，获准从电网取得多少负荷。**

![从输电边界到园区交付点](/images/ai-site-energization-boundary.svg)

Initial Energization 是 utility 第一次给客户设施施加电压，可能只用于 station service、设备启动、load bank 或 commissioning。Commercial service 是合同约定的服务开始，billing、minimum demand 和其他义务可能从这里生效。Ready for Service（RFS）还要等 facility 完成 commissioning 并可以交付。三者的日期可以相同，也可以相差几个月。

所以，“energized 1GW”仍然缺少四个坐标：哪一个 Point of Interconnection（POI）、核准了多少 MW、处于哪一级 load ramp、使用临时还是永久电源。少了这些坐标，energized capacity 不能直接计入 available compute。

## 变电站建好为什么还不能合闸？

设备安装完成，只能证明 physical completion，不能替代 utility 的 energization authorization。AEP 的 interconnection requirements 把最后这段交付拆成了 station、equipment、protection、SCADA、metering、telecommunications、station service 和 transmission line。它们来自不同团队，却要在同一个时刻同时成立。

AEP 对 5MVA 及以上的 interconnection facilities 要求实时 telemetry。控制中心需要看到 voltage、current、real power、reactive power、breaker 与 switch status 以及 alarms；AEP-owned interconnection facilities 还要具备完整的 SCADA、RTU/IED 和远程操作能力。AEP 的表述很直接：缺少足够的 situational awareness 与 control，就不接受新的 connection。

硬件、数据、合同和调度因此组成四道门：

![园区合闸前必须同时通过的四组证据](/images/site-energization-authorization-gates.svg)

第一道是 physical completion。POI 两侧的 breaker、disconnect switch、transformer、instrument transformer、surge arrester、station battery、ground grid 和连接线路必须完工，设备 rating 也要和 study 结果一致。

第二道是 protection and data。双方要交换并协调 relay settings，解决 coordination issue；SCADA、telemetry、revenue metering、通信和 dynamic model 都要可用。保护可以在几十毫秒内切掉数百 MW 负荷，不能留到合闸当天临时处理。

第三道是 commercial and regulatory readiness。Interconnection agreement、construction authorization、Electric Service Agreement（ESA）、financial security、Contribution in Aid of Construction（CIAC）、right of way、permit 与必要的 state commission approval 要分别落定。工程建完了，成本责任还没签清，utility 同样不会送电。

第四道是 operational authorization。运行模型必须已经包含这笔负荷，operator contact、switching procedure、outage coordination、load ramp 和控制上限也要明确。在 ERCOT，新建 standalone Large Load 的 energization request 必须先获得 ERCOT 批准，Transmission/Distribution Service Provider 合闸前还要联系 control room。

这四道门是 AND logic。任何一项没有关闭，其他三项做得再快，园区仍然停在 de-energized。

## 哪些工作能并行哪些必须等？

四道门并不意味着四条工作流只能排队。Dominion 明确把 site plan、load letter、short-term and long-term power plan、design、right of way、permitting、material procurement、regulatory filing 和 construction 列为可以并行推进的工作。数据中心 building、utility substation 与 protection design 也可以同时开工。

项目会在这些并行工作重新汇合的接口上停下来。

![园区送电的并行工作与共同依赖](/images/site-energization-interface-dependencies.svg)

第一个汇合点是 design basis。Utility study 决定电压等级、拓扑、fault current、network upgrade 和允许的 load ramp，最终 one-line diagram、equipment rating 与 relay setting 都要以它为输入。客户可以提前采购，但参数押错，返工时间会比等待 study 更长。

第二个汇合点是 notice to proceed。AEP Ohio 的流程要求客户先证明 site control、提交具体位置和 load ramp，并支付 load study fee；service plan 完成后，客户还要签 LOA 和 ESA。没有建设授权、担保或预付款，utility 不会替一个可能消失的项目订 long-lead equipment。

第三个汇合点是现场测试。Utility 一侧和客户一侧可以同时施工，energization 却必须等两边都完成。AEP 会检查从 POI 到第一台 protective fault-interrupting device 之间的设备及 ground system，也会检查 breaker、switch、instrument transformer、relay、station battery 与对应 test results。至少在计划送电前五个工作日，双方还要确认 series equipment 与 SCADA commissioning 已经完成。

最后一个汇合点在 control room。AEP 要求投运通知至少提前 45 天，或者满足 RTO/RTE 更长的时限，用来验证 telemetry、model、communication 与操作流程。工地上的 completion date 只有进入电网的 operating model，才可能变成 energization date。

项目经理管理的是 utility、客户、RTO、设备商和 commissioning team 五张 schedule 的交集。Site Energization 的 critical path 往往不在某一台设备，而在没有共同 owner 的接口。

## 合闸以后为什么还不能拉满？

切到永久供电路径，只解决了电从哪里来。大型园区仍要沿 de-energized、station auxiliary power、initial energization、commissioning load、approved load increment，最后到 full contract capacity 逐级升载。每一步都有自己的 MW ceiling。

NERC 在 2026 年发布的 Emerging Large Loads guideline 里，要求把 load forecasting、day-ahead studies、outage coordination、SCADA/PMU communication、dynamic model verification、ramp ability 和 maximum consumption 放进 commissioning。大型园区的 tiered buildout 可能持续数月甚至数年；每次增加 maximum consumption 或改变 facility configuration，都可能重新触发部分 study 和 commissioning。

电网“有没有足够的电”只是其中一个问题。AI workload 可以在几秒或几分钟内增加数十到数百 MW，也可以一起消失。Balancing Authority 要提前安排 generation、reserve 与 ramp，Transmission Operator 则要知道保护动作和重新接入会怎样改变 voltage 与 power flow。

2024 年 7 月的一次事故给出了真实尺度。一条 230kV transmission line 发生故障，82 秒内出现六次、每次 42 到 66 毫秒的 voltage depression。约 1,500MW data-center-type load 同时下降，但没有一台 utility breaker 切掉这些负荷；动作来自客户侧 UPS、protection 与 controls。电网按设计清除了故障，客户设备也按自己的设计保护了 IT load，两套“都正确”的控制叠在一起，却制造了一次电网没有预料到的 1.5GW 负荷突变。

能承受正常故障、按约定速度退出，再按约定 ramp 重新接入，才叫 sustainable loading。Initial Energization 只是第一次获得用电许可。

## 谁来证明园区可以继续升载？

Site Energization 没有一张由总包方单独签字的万能证书。每个 owner 只能对自己控制的那一段出具 evidence，再由 utility 与 operator 决定这些 evidence 能不能支持初次合闸或下一次升载。

![园区送电调试与验收矩阵](/images/ai-site-energization-commissioning-matrix.svg)

Primary equipment 与 grounding 由设施 owner 提供 drawings、as-built data 和 test results，utility inspection 决定能否接入。Protection engineer 负责 short-circuit model、relay settings 与跨边界 coordination；NERC PRC-027 要求 electrically joined facilities 的 owner 交换设置，并在实施前解决 coordination issue。

SCADA engineer 要证明 RTU/IED、telemetry、status、alarm 与 remote control 在 control room 端都能正确收发。Metering team 要确认 revenue-quality meter、CT/PT ratio、loss factor、ownership 与 maintenance responsibility。Planning 和 operations team 则核对 steady-state/dynamic model、load forecast、ramp、ride-through、operator contact 与 switching procedure。

其中任何一项发生 material change，旧的 acceptance 都可能失效。换一批 UPS、修改 undervoltage setting、增加 behind-the-meter generation，或者提前拉高 maximum consumption，都会改变电网看到的 load behavior。Commissioning 的作用，就是用 as-built evidence 替换设计假设。

## 哪次签字会触发哪笔钱？

技术 gate 一旦对齐，商业链才看得清。不同 utility 的合同名称并不统一，但付款节点大致沿着同一条风险转移路径移动：客户先为 study 付钱，再为 utility 建设承诺担保，设备商按订单和进度收款，最后从 actual energization 开始承担长期用电义务。

![Site Energization 的合同、付款与验收节点](/images/ai-site-energization-commercial-gates.svg)

AEP Ohio 对 25MW 及以上项目收取一次性 load study fee：25 到 50MW 为 1 万美元，50 到 100MW 为 5 万美元，100MW 及以上为 10 万美元。费用在 45 天内不支付，service request 就视为撤回。

Service plan 完成后，LOA 把 utility buildout risk 转给客户：客户在 target energization date 前取消，或者延误超过 12 个月，要补偿 AEP Ohio 已投入的全部 buildout cost。ESA 则写入 estimated energization date、load ramp 与 contract capacity，合同期限从 actual energization 开始。

信用与流动性达不到门槛的客户，签约时还要提交相当于整个合同期 minimum charges 50% 的 collateral。Load ramp 最长四年，合同容量的最低进度依次是 50%、65%、80% 和 90%；初始合同期等于 ramp period 再加八年。客户最终拉了多少电，不会自动消除为专用基础设施承担的 minimum demand。

Virginia 也在把同一类风险写进 tariff。2027 年以后签约的新 large-load customer 至少承担 14 年服务义务；transmission 与 distribution cost 每月至少支付 85%，信用不足时 collateral 可覆盖整个合同期 minimum charges 的 60%。这些条款的共同目标，是不让一个取消或慢于计划的园区把 stranded grid cost 留给其他 ratepayer。

这些 gate 还没有一套全美通用模板。FERC 在 2026 年 6 月要求 PJM、MISO、SPP、CAISO、ISO-NE 和 NYISO 六个区域电网运营商解释或修改 large-load tariff，范围包括 study process、transmission cost transparency、co-location、flexible service 与 nearby generation。今天看到的 LOA、ESA、minimum demand 和 collateral，都要放回具体 utility、state 与 RTO 才能判断。

设备商的收款时钟更早。Eaton 在 2026 年上半年录得 23.65 亿美元 customer deposits and billings，期末 deferred revenue 为 11.59 亿美元；部分 custom power-distribution contract 按 progress over time 确认收入，其他产品则在 shipment 或交付时确认。它们可以在园区 energization 前进入 backlog、revenue 与 cash flow，但这批数字覆盖 Eaton 多个终端市场，不能全部算成数据中心收入。

## 控制最后一道开关就有定价权吗？

Utility 控制最后的 service gate，客户又绕不开电气边界，看起来最接近这段链上的定价权。可 regulated utility 不是卖一张稀缺的 delivery slot。它先投入 transmission、substation 与 distribution assets，再由 state commission 或 FERC 决定哪些成本可以进入 rate base、允许多少 return、何时从 tariff 收回。

Utility 捕获的 economics 来自 approved investment 带来的 rate-base growth、depreciation、interest recovery 与 allowed equity return，并不等同于设备短缺带来的 gross margin。Customer-funded CIAC、被 regulator 否决的项目、长时间 regulatory lag 和高成本融资，都可能让“控制合闸”无法转化成每股盈利。

EPC 和 commissioning contractor 捕获一次性的 design、construction 与 acceptance revenue；OEM 捕获 purchase order、deposit、shipment 和 service；数据中心 owner 捕获更早获得 usable MW 的时间价值。只有 utility 同时站在 physical gate、commercial contract 与 recurring tariff 三个位置上，但它的回报也最受监管约束。

AEP 正好可以拿来检验这层 economics。公司覆盖美国 11 个州，拥有约 4 万英里 transmission system；同一家公司既发布 interconnection requirements，又通过 AEP Ohio 等 utility 把 study、LOA、ESA、collateral、energization 和 minimum demand 串成一条商业链。

## AEP 的 69GW 股价算进去了多少？

AEP 在 2026 年第二季度披露，2030 年前 contracted load growth 已增至 69GW，2026 到 2030 年资本开支计划为 779.37 亿美元。其中 Vertically Integrated Utilities 为 408.79 亿美元，Transmission and Distribution Utilities 为 225.37 亿美元，AEP Transmission Holdco 为 128.55 亿美元。69GW 包含 data center 与 industrial load，也只是 signed agreements 支撑的计划增量，不是已经 energized 的负荷。

先把估值日锁在 2026 年 8 月 21 日。AEP 股价 120.94 美元，Q2 diluted shares 为 5.506 亿股，对应 equity value 约 665.9 亿美元。6 月底 total debt 为 528.36 亿美元，cash 为 3.75 亿美元，net debt 约 524.61 亿美元，enterprise value 约 1,190.5 亿美元。Debt-to-total-capital 已从 2025 年底的 60.3% 升到 61.4%。

这是一家高杠杆 regulated utility，用 EV/Sales 很难把 rate base、financing 与 per-share dilution 放回同一条线。更直接的做法，是从 operating EPS 与 dividend 反推当前股价要求多少 per-share growth。AEP 把 2026 operating EPS guidance 提高到 6.25 至 6.55 美元，中点是 6.40 美元；季度股息 0.95 美元，年化 3.80 美元。

假设从 FY2026 到 FY2030 共四年，要求 8% annual total return；2027 年全年 dividend 从当前年化 3.80 美元增长 5%，以后每年继续增长 5%，收到后按 8% 再投入；再分别固定 16x、18x 和 20x 的 FY2030 operating P/E：

> Required EPS 2030 = [Current Price × (1 + Required Return)^4 − Future Value of Dividends] ÷ Exit P/E

![AEP Site Energization price-in 反推](/images/aep-site-energization-price-in.svg)

在 16x exit P/E 下，当前价格要求 2030 operating EPS 达到 9.08 美元，四年 CAGR 为 9.1%；18x 对应 8.07 美元和 6.0%；20x 对应 7.26 美元和 3.2%。AEP 给出的长期 operating EPS growth 是 7% 到 9%，对应 2030 EPS 约 8.39 到 9.04 美元。

这组结果没有脱离 exit multiple 的答案。接受 18x，当前股价已经计入了大部分 guidance 低端，却没有要求 69GW 全部兑现；如果 normalized multiple 回到 16x，AEP 几乎必须交出 guidance 上端，现价才能提供 8% total return。**当前价格押注的不是 69GW 这个 headline，而是足够多的签约负荷能按计划 energize，新增资产能及时进入 rate base，融资又不会吃掉 per-share growth。**

## 什么会证伪这条链？

第一类证伪发生在 energization schedule。Signed load 没有按计划通过 study、construction、commissioning 与 load ramp，或者客户依靠 bridging、behind-the-meter generation、flexible service 和其他 site 绕开原方案，69GW 就不会按原时间表转成 metered demand。

第二类发生在 cost recovery。Regulator 不允许全部 capex 进入 rate base，CIAC 与 customer-funded facilities 占比提高，或者 tariff 的 minimum demand 与 collateral 仍覆盖不了 stranded cost，控制 interconnection gate 也留不下预期回报。

第三类发生在 per-share bridge。AEP 的 779 亿美元计划需要持续发行 debt、hybrid securities 与 common stock。Interest expense、debt ratio 或 dilution 增长快于 rate base，企业规模扩大，EPS 仍可能落在 guidance 以下。

最后一类发生在 price-in。即使 EPS 完成 7% 到 9% 增长，只要利率与 utility valuation 把 exit P/E 压到 16x，今天的价格已经接近把 guidance 上端用完。“市场看见了数据中心”远远不够，earnings path、financing 与 multiple 必须一起成立。

回到 Centreport，7MVA、11MVA、4MW 和 262MW 从来不是互相矛盾的四个数字。它们分别描述临时供电能力、某一年的预计负荷和 full-buildout demand。

把这些数字放回一条时间线，原本模糊的“已送电”就变成一组可以核对的工程状态：哪个 POI、哪一种 service、哪一天获准合闸、当前允许多少 MW、下一次升载还缺什么。只有这些条件同时成立，电才算交给 Data Center。

但它仍然只到了 service delivery point。机架里的 GPU，还没有拿到一瓦电。

## Sources

- [Dominion Energy, Centreport SCC Application](https://www.dominionenergy.com/-/media/content/about/power-line-projects/centreport/pdfs/application-volume-1-of-3-2024-centreport.pdf)
- [Dominion Energy, Data Center Requests](https://www.dominionenergy.com/virginia/large-business-services/data-center-requests)
- [AEP, Requirements for Connection of New Facilities or Changes to Existing Facilities](https://www.aep.com/assets/docs/requiredpostings/TransmissionStudies/Requirements/AEP_Interconnection_Requirements_Rev5.pdf)
- [NERC, FAC-001-4 Facility Interconnection Requirements](https://www.nerc.com/globalassets/standards/reliability-standards/fac/fac-001-4.pdf)
- [NERC, PRC-027-1 Coordination of Protection Systems](https://www.nerc.com/globalassets/standards/reliability-standards/prc/prc-027-1.pdf)
- [NERC, Risk Mitigation for Emerging Large Loads](https://www.nerc.com/globalassets/our-work/guidelines/reliability/RG_Risk-Mitigation-For-Emerging-Large-Loads.pdf)
- [NERC, Incident Review: Considering Simultaneous Voltage-Sensitive Load Reductions](https://www.nerc.com/globalassets/our-work/reports/event-reports/incident_review_large_load_loss.pdf)
- [ERCOT, Large Load Integration](https://www.ercot.com/services/rq/large-load-integration/)
- [ERCOT, PGRR145 Batch Zero Process for Large Load Interconnections](https://www.ercot.com/mktrules/issues/PGRR145)
- [AEP Ohio, Data Center Tariff](https://www.aepohio.com/company/about/rates/data-center-tariff/)
- [Virginia State Corporation Commission, Data Center Initiatives](https://www.scc.virginia.gov/about-the-scc/scc-facts/)
- [FERC, Large Load Integration Orders](https://www.ferc.gov/news-events/news/ferc-launches-aggressive-targeted-action-speed-large-load-integration)
- [Eaton, Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1551182/000155118226000030/etn-20260630.htm)
- [AEP, Q2 2026 Earnings](https://www.aep.com/news/stories/view/12135/)
- [AEP, Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/4904/000000490426000059/aep-20260630.htm)
- [AEP, Stock and Dividends](https://www.aep.com/investors/stock/)
- [Nasdaq, AEP Historical Quotes](https://www.nasdaq.com/market-activity/stocks/aep/historical)
