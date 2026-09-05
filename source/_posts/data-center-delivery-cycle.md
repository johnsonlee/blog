---
title: 数据中心工期为何按 MW 计算？
date: 2026-08-23 00:45:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-delivery-cycle
---

2025 年 7 月，[OpenAI 更新 Abilene 的进度](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)时写下了两个看似冲突的状态：Stargate I 仍在 construction，部分 facility 却已经跑起了 Training 和 Inference workload。

到了 2026 年 6 月，[Oracle 披露整个 campus 已交付 42%](https://www.oracle.com/data-centers/)，剩余容量还要在后续几个季度继续交。它到底是在建、已交付，还是已经投入运行？

它既在建，也已经交付了一部分，甚至已经有 workload 在跑。把整座 campus 只标成一种状态，才是问题。

<!-- more -->

## 一座 Campus 为什么能同时在建和运行？

Abilene 不是一栋装满 GPU 的大楼。整个 campus 有八栋建筑，占地 1,100 acres，总建筑面积约 400 万平方英尺。第一期先建两栋，规模超过 200MW，原计划在 2025 年上半年 energize；第二期再扩六栋，把规划容量推到 1.2GW。[Crusoe 2025 年 3 月公布第二期施工时](https://www.crusoe.ai/resources/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts)，第一期仍在向 energization 推进。

一座 GW 级 campus 会被拆成 phase、building 和 data hall。每个交付单元各自经过 site control、design、permitting、construction、energization、commissioning 和 Ready for Service（RFS）。第一座 data hall 已经交给客户装设备时，隔壁可以还在浇筑基础；第一期已经跑 workload 时，第二期仍在安装变电和冷却设备。

所以一座园区没有唯一状态。**状态属于某一批 MW，而不是整座 campus。**

![数据中心从选址到 RFS 的交付状态](/images/data-center-delivery-state-machine.svg)

Announced 不在交付链上。它是一次公开披露，不是一道工程 gate。项目可以在拿下 site control 时宣布，也可以等到开工、签约甚至部分送电以后再宣布；只看新闻发布日期，无法知道 capacity 已经走到哪里。

能沿时间前进的是下面那条交付链。Site control 说明土地已经能够被项目使用；Development 把设计、许可、电力和施工方案收敛到可执行状态；Construction 把 civil、structural 和 MEP 设备装进现场；Energized 说明电已经到达约定边界；Commissioning 再验证单机、系统和故障场景；走到 RFS，这一 phase 的 contracted IT load 才具备设施交付条件。

这条线只到 facility。GPU、network、storage 和 software stack 的部署与验收还在 RFS 后面，不能提前塞进来。

## “已宣布”为什么不是项目状态？

OpenAI 2025 年为 Stargate 发出的 [site RFP](https://cdn.openai.com/sg/stargate-request-for-proposal-rfp.pdf)，很适合看清公告之前究竟有多少种起点。RFP 里的 Project 可以只包含 land 和 power，也可以再带上 site、shell design 与 fitout。递到 OpenAI 面前的“数据中心项目”，并不处在同一道 gate。

OpenAI 要求每份 proposal 分别写出 2027 年和 2028 年可提供多少 power、2028 年第一季度有多少 IT workload 能 available，还要按 data hall 列出 permitting、civil、structural、equipment、commissioning、IT provisioning 和 handover 的时间。Power available 和 workload available 被分成两个日期：电先到了，不代表算力同时到了。

Selection 只证明需求方选中了位置和合作方，不证明 permitting 已经结束、设备已经下单，更不证明 facility 可以交付。Planned capacity 写的是所有 phase 走完后的终点；Under construction 虽然更近一步，仍然覆盖从场地平整到 integrated testing 之前的巨大区间。把这些状态压成一个“落地”，最关键的时间信息就消失了。

## 谁在决定每一批 MW 的交付日？

如果把一座 data hall 交给项目总负责人，最先拿到的不会是一张从左到右的施工流程图，而是一份 Integrated Master Schedule。土地、许可、电力、设计、设备、土建、供水、光纤、commissioning 和客户 IT 各有一条时间线，任何一条都可能改写 RFS。

参与方也远不止 developer 和 contractor。Owner 决定 capacity、budget、交付单元与 acceptance criteria；utility、transmission provider 和地方主管部门控制电力与许可；architect、engineer、EPC、GC 和 OEM 把设计变成现场；水务、fiber provider、commissioning authority 与客户 IT 团队分别闭合外部接口、系统验证和设备部署。

这些人不在同一条汇报线上，只在 milestone 上彼此依赖。总负责人管理的是接口：谁必须在什么日期交出什么，哪一个设计决定会触发设备下单，哪一项延迟会吃掉 float，哪一道验收不过就不能进入下一阶段。

![AI 数据中心从项目开发到 RFS 的并行计划](/images/data-center-delivery-gantt.svg)

Abilene 没有公开自己的 Integrated Master Schedule，这张图也不替它虚构工期。图里没有月份，只有从 OpenAI RFP 和公开工程边界抽出的依赖关系：哪些 workstream 可以并行，哪些 milestone 必须先到。

Site due diligence、utility study、concept design、permit strategy、water 和 fiber 可以同时启动。Basis of design 稳定以后，长周期设备也可以在 detailed design 完成前先锁产能；外部输电工程、园区土建和设备制造继续并行。Commissioning 也不是等机房建完才进场，它从设计审查、submittal review 和 factory acceptance 就已经开始。

但并行有边界。没有 site control，许可和接入申请没有稳定对象；关键设计没有冻结，长周期设备无法定版；building 没有 dry-in、设备没有到货，机电安装无法收口；utility 工程和现场高压系统没有同时完成，永久电力不能送进来；供配电与散热系统没有逐项完成 startup 和 functional testing，Integrated Systems Testing 就没有测试对象。最后一道故障场景没通过，RFS 不能靠压缩日历提前出现。

Campus 的总体日期可以写在新闻稿里，项目控制必须落到每一栋楼、每一批 MW 和每一个依赖方。这也是 OpenAI 要求 proposal 按 data hall 提交 permitting、civil、structural、equipment、commissioning、IT provisioning 和 handover milestone 的原因。

## 开工以后为什么会出现多条时间轴？

Abilene 把这种分叉展示得很清楚。Crusoe 2024 年 6 月开始建设第一期；2025 年 3 月，第二期六栋建筑已经开工。一个月后，[第一座 data hall 的 core and priority areas 交给 tenant](https://crusoe.ai/pdfs/Crusoe_Impact_Report_2024.pdf)；6 月，Oracle 开始交付第一批 GB200 rack；7 月，[OpenAI 已经跑起早期 workload](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)，但 construction 仍在继续。

![Abilene 数据中心分期建设与交付时间线](/images/abilene-phased-delivery-timeline.svg)

这不是一条被压缩得异常快的直线，而是多条互相重叠的时间轴。第一期从 2024 年 6 月 groundbreaking 到 2025 年 7 月跑起早期 workload，大约 13 个月；第二期在第一期交付前就已开工。当 workload 上线时，campus 的其余容量还在复制。

到了 2026 年 6 月，Oracle 只披露了 42% `delivered`，没有公布这里对应哪份合同、是否等同 RFS，也没有把剩余 58% 分别放进 construction、energized 或 commissioning。这个数字能证明交付按 phase 发生，不能替每一批 MW 补出不存在的状态。

于是“Abilene 已经投运”和“Abilene 仍在建设”都对。前一句描述已经交付的 phase，后一句描述整个 campus。能比较的不是项目名称，而是每一期有多少 MW 分别停在 construction、energized、commissioning 和 RFS。

## 送电为什么还不算设施交付？

Energization 很容易被当成终点，因为在缺电的数据中心市场里，“拿到电”已经足够稀缺。可它只证明某个电气边界已经带电，不证明整条供配电链、散热链和控制系统能在设计负载与故障场景下持续工作。

Abilene 第一期原计划在 2025 年上半年 energize 200MW 以上。电到以后，GB200 rack 才能进场并逐步上电；但 construction、equipment startup 和 commissioning 仍然可以同时发生。Energized 与 RFS 之间还隔着 transformer、switchgear、UPS、busway、cooling 和 integrated systems testing。

Abilene 的客户合同没有公开。Digi Power X 与 Cerebras 在 2026 年披露的另一份 [40MW colocation agreement](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm)，刚好把同一类边界写得很具体：Phase 1 是 15MW，新增 25MW 的 Phase 2 还要先完成融资并取得客户书面批准。每个生效的 phase 都允许客户在 target delivery 前六周 Early Access，提前安装 cabling 与 IT equipment。

Operator 会提供 staging 和 initial energization 所需的 temporary power；这段时间不收 colocation fee、monthly recurring charge 或其它 recurring fee，客户如果上电，只支付实际消耗的电费。

Early Access 甚至可以看起来很像“机房已经能用了”，合同却明确规定它不构成 RFS acceptance。有电、能进场、能装 rack，仍然不是同一件事。

## RFS 为什么能触发收费？

同一份合同对 RFS 的定义是：对应 phase 已完成 construction、commissioning 和 testing，contracted IT load 已经可以供客户设备 energize，并满足约定的 RFS checklist。Operator 发出 RFS Notice 时还要附上 engineer of record 出具的 commissioning report，客户可以检查并提出 material deficiency。

![RFS 如何改变数据中心合同的收费状态](/images/data-center-rfs-contract-gates.svg)

这道 gate 一跨过去，Phase Commencement Date 才成立。按 kW 计价的 colocation fee 从这里开始，annual escalation 的计时也从各 phase 自己的 commencement date 开始；如果 operator 错过 RFS trigger date，合同则按延迟天数计算 Daily RFS Credits。

Digi Power X 后来在 2026 年第二季度 10-Q 里披露了原合同隐藏的价格：每月 195 美元/kW，take-or-pay，每年上涨 3%。15MW Phase 1 对应每月 292.5 万美元，25MW Phase 2 对应 487.5 万美元。可截至 6 月底，整座 facility 仍在 construction，尚未 ready for use；Phase 2 也仍以拿到足够融资为前提。

所以 RFS 不是一个方便写进项目周报的缩写。它把前面的 construction spend、设备安装和 commissioning，切换成可以向客户持续收费的 facility capacity。对客户来说，它也把一份未来 capacity 变成了可以继续部署 IT 的交付物。

RFS 仍然不等于 available compute。合同要求的是 contracted IT load 可以给客户设备上电，不是数万块 GPU 已经通过 fabric validation 与 cluster acceptance。Facility operator 在这里完成交付，compute provider 还要继续往 Production Handoff 走。

## 同一批 MW 为什么会出现在不同账上？

项目状态之所以不能混用，是因为每一道 gate 后面跟着不同的订单和现金流。

对 equipment vendor 和 contractor，design freeze、purchase order、factory acceptance、delivery、installation 与 commissioning 都可能是各自的确认节点。对 facility operator，合同已经签下也不等于 recurring revenue 已经开始；在上面的 40MW 合同里，按 kW 计价的 colocation fee 要等各 phase 跨过 RFS 才启动。

同一笔 capacity，在客户眼里是已经锁定的供给，在 operator 眼里是尚未 commenced 的 backlog，在 transformer 或 cooling supplier 眼里却可能已经进入生产和交付。谁先拿到订单，谁要等到 RFS 才开始收费，谁承担 delay credits，取决于合同把哪一道 gate 写成付款、验收和违约边界。

这也把 Replication Gap 从一句“数据中心建得慢”变成了可以追的数字：Announced 有多少 MW，进入 construction 的有多少，已经 energized 的有多少，跨过 RFS 的又有多少。相邻两道 gate 之间积压得越多、停得越久，约束就越可能藏在那里。

## 40MW 合同已经 price in 多少？

这份合同刚好能把交付状态和价格放在同一张表里。Digi Power X 在 2026 年 8 月 14 日有 1.014 亿股普通股，另有约 708.5 万份 option、RSU 和 warrant。按 8 月 21 日收盘价 4.07 美元计算，fully diluted equity value 约 4.42 亿美元。

6 月底公司持有 1.281 亿美元现金和 1,430 万美元 digital currency，总负债 1,455 万美元。用 fully diluted equity value 减去现金与 digital currency、再加回总负债，得到约 3.14 亿美元的简化 operating value。这个口径不是标准 EV，只是把大量流动资产从股价里剥离，观察市场给现有经营与未来项目合计多少价值。

![Digi Power X 的 RFS price-in 情景](/images/dgxx-rfs-price-in.svg)

如果只有 15MW Phase 1 按时跨过 RFS，第一年 colocation fee 是 3,510 万美元，简化 operating value 是这笔收入的 8.9 倍。40MW 全部交付后，第一年 fee 增至 9,360 万美元，倍数降到 3.4 倍。合同 headline 是 11 亿美元，却要在十年里逐月收取；把十年合同额直接和今天的 equity value 相比，会把 revenue、margin、capex 和时间价值混成一个数字。

这组情景只能把 price-in 限定在一个区间。Digi Power X 第二季度总收入只有 663 万美元，gross loss 为 552 万美元；40MW 的稳定 margin 还没有跑出来。同期普通股从 2025 年底的 6,943 万股增至 9,854 万股，季度后又通过 ATM 增发 285 万股。Phase 2 需要的 project financing、实际建设成本和后续 dilution，都会改变每股能留下多少。

所以当前价格已经不能按“市场还没看到 40MW 合同”来解释。市场看见了合同，也给了 Phase 1 按期 RFS 和 Phase 2 最终交付一部分价值；**还没有被证明的，是 40MW 能否在不继续吞噬现金和每股权益的情况下，变成有稳定毛利的 recurring revenue。**

判断会在四个地方被证伪：Phase 1 没能在 2026 年 12 月 15 日前发出 RFS Notice；Phase 2 融资继续后移；fully diluted share count 增长快于 delivered MW；或者 colocation fee 开始确认以后，公司仍无法把 gross margin 拉回正值。

## 8GW 到底有多少个交付日？

回到《{% post_link ai-data-center-alpha-map '为什么 OpenAI 总是缺算力？' %}》里的 PORTS-Pike。8 IT-GW 是整个 campus 的最终规划容量，不是 2032 年某一天突然打开的总开关。[第一批 800MW 预计在 2028 年 available](https://openai.com/index/openai-joins-ports-pike-project/)，后续 phase 还要依赖新增发电、输电线路和配套设施，六年 buildout 才可能把整座 campus 推到终点。

这 8GW 应该被改写成一列 phase：每一期控制了多少土地，电力方案走到哪里，何时开工，哪天 energize，什么时候完成 commissioning，何时发出 RFS Notice。只有最后一列跨过去的 MW，才是 facility supply。

同一套账本拿去看任何一座数据中心，先问的都不再是“项目建好了吗”，而是哪一批 MW、走到哪一道 gate、拿什么证据证明。状态一旦绑回 phase，8GW 就不再是一个等待兑现的大数字，而是一张按 MW 逐步跨过 gate 的交付账。

Abilene 同时在建、已交付和运行，并不是三个口径互相打架。三个状态分别落在不同 phase、data hall 和 MW 上。项目名称只有一个，每一批容量却有自己的 energization、RFS、收费和 Production Handoff 日期。

数据中心因此没有一个交付日。它有一张不断向右移动的 MW ledger。

## Sources

- [OpenAI, Stargate Advances with Oracle Partnership](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)
- [OpenAI, Stargate Request for Proposal](https://cdn.openai.com/sg/stargate-request-for-proposal-rfp.pdf)
- [OpenAI, OpenAI Joins PORTS-Pike Project](https://openai.com/index/openai-joins-ports-pike-project/)
- [Oracle, Data Centers](https://www.oracle.com/data-centers/)
- [Crusoe, Abilene Campus Expansion](https://www.crusoe.ai/resources/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts)
- [Crusoe, 2024 Impact Report](https://crusoe.ai/pdfs/Crusoe_Impact_Report_2024.pdf)
- [Digi Power X and Cerebras, Colocation Agreement](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm)
- [Digi Power X, Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1854368/000121390026089940/ea0301731-10q_digipower.htm)
- [Yahoo Finance, DGXX Historical Prices](https://finance.yahoo.co.jp/quote/DGXX/history)
