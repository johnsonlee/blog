---
title: AWS 数据中心紧邻核电站为何难扩容？
date: 2026-08-23 02:15:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-grid-interconnection
---

AWS 在 Pennsylvania 买下的 Data Center Campus，就贴着 Susquehanna Nuclear Plant。电不需要跨州，也不用等一条几百公里的输电线；两座核反应堆就在围墙另一边，数据中心已经通过 direct-connect 使用其中 300MW。

可当 Talen 想把这条通道从 300MW 扩到 480MW 时，FERC 仍然拒绝了新的 Interconnection Service Agreement。后来 AWS 需要的容量不但没有缩小，反而翻到 1,920MW，原来的直连方案却被整个换掉：核电先送回 PJM 电网，再由 PPL 把电送给隔壁的数据中心。

电厂明明就在旁边，为什么还要绕回电网？

<!-- more -->

## 一条 Direct Wire 为什么没有把电网绕过去？

把电厂和数据中心画成两个相邻的框，答案似乎很简单：拉一条专线，电从 generator 直接流向 server，PJM 和 PPL 都不必参与。

Susquehanna 最初采用的 Behind-the-Meter（BTM）结构确实接近这幅图。Talen 把 campus 卖给 AWS 后，与 AWS 签下长期 PPA；数据中心先按 120MW 一档逐年增加 minimum commitment，原合同允许在 480MW 停下，也可以继续扩到 960MW。已有 300MW co-located load 放在发电侧，不作为普通 retail load 穿过公用电网。

可物理距离只解决 conductor 有多长，没有回答故障时谁接住负荷。2023 年 11 月，Susquehanna 一台机组意外停机，co-located facility 没有按原设计切到另一台机组，反而从 PJM grid 取电数小时。Talen 后来补交相关费用，修改配置、增加保护设备，并设计 redundant signal 去打开 isolation breaker。

这几小时把 direct-connect 的边界撕开了：**只要数据中心仍与同步电网电气相连，正常时不从电网买电，不等于故障时不会使用电网。**

![Susquehanna 机组故障怎样越过直连边界](/images/susquehanna-grid-outage.svg)

## 300MW 为什么能用，480MW 却被拒绝？

PJM 2024 年提交的 amended ISA，想把允许的 co-located load 从 300MW 提高到 480MW。工程分析认为，480MW 以内不需要新增 transmission upgrade；保护方案也会在 generation loss 时把数据中心从电网隔离。单看设备，这 180MW 并没有卡在一台缺货的 transformer 上。

FERC 拒绝的也不是“核电不够”。它认为 PJM 没有证明这份 non-conforming agreement 为什么应该偏离现有 tariff，以及这种安排怎样处理 transmission service、备用供电、可靠性与其他用户成本。Order 明确写的是 rejected without prejudice：不是永远禁止，而是现有 record 不足以让监管者确认责任边界。

这正是 Grid Interconnection 和 PPA 的区别。PPA 回答谁卖电、卖多少、按什么价格、签多久；ISA 与 utility service 则要回答另外一组问题：

- 哪个 Point of Interconnection 允许多大的 injection 与 withdrawal；
- generator trip、line outage 或 protection failure 时，load 会被切除还是转由 grid 承担；
- metering 怎样区分 direct supply、grid import 与 grid export；
- 谁购买 transmission、distribution、ancillary service 和 backup service；
- 哪些 upgrade 由谁建设、谁付钱，什么时候才能投运。

合同里写着 960MW，不会自动把这五个问题一起签掉。拿到 PPA 是锁住一笔 energy supply；拿到可执行的 grid connection，才是锁住这笔 load 在正常与故障状态下怎样被供电。

## 为什么最后从 480MW 变成了 1,920MW？

FERC 拒绝 480MW 后，Talen 和 AWS 没有继续把所有容量塞进 BTM 结构。2025 年 6 月，双方重签 PPA，把满额容量扩大到 1,920MW，并改成 Front-of-the-Meter（FTM）：Susquehanna 把电送入 PJM，Talen Energy Marketing 作为 retail electric generation supplier，PPL 负责 transmission 与 delivery，AWS campus 则成为电网里的 load。

![Susquehanna 从直连到电网交付的边界变化](/images/data-center-grid-connection-boundary.svg)

看起来绕了一圈，商业上却少了一道最难解释的例外。FTM 不再要求把 1,920MW 写进一份特殊的 co-located-load ISA；发电、输电、零售供电和负荷服务回到各自已有的 tariff 与责任边界。Talen 在给股东的材料里直接把它称为 `de-risks PPA delivery`：取消 AWS 在 480MW 封顶的 option，也消除了旧方案对 FERC approval 的依赖。

代价是“旁边有核电站”不再等于电可以立刻送到。PPL 先要完成 transmission reconfiguration，AWS load 也要进入 PJM 的 load forecast。旧 BTM 结构在过渡期仍维持 300MW；2026 年 4 月切换到 revised PPA，容量再从 240MW、360MW、480MW 一档档 ramp，最晚到 2032 年达到 1,680–1,920MW。

所以 1,920MW 不是把一根更粗的电缆接上去。它换来的是一套可复制的交付模型：发电商可以把同一份 PPA 延伸到 Pennsylvania 其他 AWS site，utility 按标准边界负责 delivery，PJM 也能把这笔 load 放回 planning、capacity 与 reliability 模型。

## 接入协议到底交付了什么？

Grid Interconnection 不是一张“允许用电”的许可证，也不是建设完成的同义词。它先把一组技术和商业边界冻结下来，再让工程沿这些边界施工。

对 Susquehanna，旧 ISA 约束 generator 与 transmission system 的连接方式；amendment 试图改变 generator output 留给 co-located load 的上限。对新的 FTM 结构，发电继续通过原有 interconnection 向 PJM 注入，AWS 则通过 PPL 的 service facilities 形成独立 withdrawal。两边在账上由 PPA 对冲，在电气上仍分别服从 grid dispatch、metering 与 protection。

这也是为什么项目里会同时出现几个都像“拿到电”的日期：

1. PPA effective，只说明买卖双方承担了合同义务；
2. Interconnection / service arrangement effective，说明连接方式与责任边界已经获批；
3. Required upgrade completed，说明外部系统具备工程条件；
4. Site energized，说明 utility 已经在 delivery point 合闸；
5. Load ramp accepted，说明新增 MW 可以按计划逐步拉升。

前四项少任何一项，最后那条 ramp 都只是合同里的横坐标。接入的交付物不是一度电，而是**一条在指定故障与运行条件下仍然成立的供电路径**。

## 这道 Gate 谁能变成现金流？

旧 BTM 方案里，Talen 同时控制发电、直连 campus 和 PPA，价值链很短；监管争议也集中在同一个边界。新 FTM 结构把角色拆开：Talen 收发电与长期 PPA 的 contracted margin，PPL 收 transmission 与 delivery 对应的 regulated return，PJM 负责市场与可靠性规则，AWS 承担按 ramp 增长的购买义务。

这里没有一个参与方“拥有接入审批”就能随意定价。更强的 control point 是谁能让方案换一条仍可交付的路径。FERC 拒绝 480MW BTM 后，Talen 没有停在 appeal，而是把产品从“隔壁核电直连”改成“核电 PPA + 标准电网交付”，容量反而扩大四倍。它捕获的不是 ISA 审批费，而是把 1,920MW nuclear output 从 merchant exposure 变成长期 contracted cash flow。

Talen 估计 AWS PPA 在 2026 年贡献约 1.55 美元 Adjusted Free Cash Flow per share，2029 年增至 4.00–5.75 美元，2032 年在 1,680–1,920MW ramp 下达到 7.00–8.25 美元。公司同时披露，即使 AWS 没有实际取满电，shortfall make-whole 的 cap 也可能保留满额 impact 的 50%–65%。这让 interconnection 与 ramp 很重要，却不把全部合同价值压在某一天合闸上。

## 1,920MW 已经 Price In 多少？

2026 年 8 月 21 日，TLN 收于 314.46 美元，market cap 约 144 亿美元。只看 2026 年 1.55 美元的 PPA contribution，它只占股价的 0.5%；但市场买的不是第一档 240MW，而是后面逐年上升的 contracted cash flow。

把公司给出的 2032 年 7.00–8.25 美元增量当作终态，以 10% 折现回 2026 年，再分别给 10、15、20 倍 terminal multiple，AWS PPA 对应的现值约为每股 40–93 美元，相当于当前股价的 13%–30%。这不是目标价，只是把“市场看见了 1,920MW”变成一组可以复算的假设。

![Talen AWS PPA 的 Price-In 情景](/images/talen-aws-price-in.svg)

剩余 70%–87% 不能直接叫作“市场没算进去”。TLN 还包含 Susquehanna 的 merchant / capacity earnings、其他发电资产、新并购项目、资本结构与未来合同。反过来，若把 1,920MW 的 notional revenue 全部加到 market cap，又会忽略 2032 才完成的 ramp、delivery cost、tax、share count 与时间价值。

这条判断会在四个位置被证伪：2026–2028 年实际 ramp 低于 240/360/480MW；PPA 的 per-share FCF contribution 低于公司给出的 1.55/2.00/2.50 美元；到 2032 年仍无法接近 1,680MW minimum volume；或者 acquisition 与 dilution 让 AWS cash flow 无法落到每股。

## “已经拿到电”还剩下多少含义？

Susquehanna 离 AWS campus 只有一道围墙，300MW 也已经实际运行。可一次 generator trip 证明，物理直连没有消除 grid dependency；480MW amendment 被拒，又证明足够的 generation 与 transmission capacity 仍不能替代清晰的 service boundary。

最后跑通的 1,920MW，不是更彻底地绕过电网，而是把发电、输电、delivery 和 load 重新放回电网。PPA 锁住卖家与价格，interconnection 锁住正常和故障状态下的责任，transmission reconfiguration 把纸面结构变成物理路径，site energization 才把电交到园区。

所以看到一座数据中心“拿到 1GW 电”，下一句不能只问电从哪里来。还要问：它拿到的是 PPA、获批的接入结构、完成的外部工程，还是已经可以 ramp 的 utility service？

核电站可以就在旁边，缺的仍然可能是那条被电网承认、也经得住故障的供电路径。

## Sources

- [FERC, PJM Susquehanna Co-Location Proposal, ER24-2172](https://www.ferc.gov/media/er24-2172-pjms-susquehanna-co-location-proposal)
- [FERC, Chairman Phillips Dissent in ER24-2172](https://www.ferc.gov/news-events/news/chairman-phillips-dissent-pjms-susquehanna-co-location-proposal-er24-2172)
- [FERC, Commissioner Christie Concurrence in ER24-2172](https://www.ferc.gov/news-events/news/commissioner-christies-concurrence-pjms-susquehanna-co-location-proposal-er24-2172)
- [Talen Energy, Amazon PPA Business Update](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611talenbusinessup.htm)
- [Talen Energy, Q1 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1622536/000162253626000036/tln-20260331.htm)
- [Talen Energy, 2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1622536/000162253626000017/tln-20251231.htm)
- [Talen Energy, September 2025 Investor Update](https://www.sec.gov/Archives/edgar/data/1622536/000162253625000010/investorupdate090925_vf.htm)
- [Yahoo Finance, TLN Historical Prices](https://finance.yahoo.com/quote/TLN/history/)
