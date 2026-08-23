---
title: 10GW 发电为什么只对应 8 IT-GW？
date: 2026-08-23 02:45:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-power-generation
---

PORTS-Pike 的公告把两个数字放在了一起：[至少 10GW 新建发电，对应 8 IT-GW 的 AI factory capacity](https://sbenergy.com/nvidia-ai-compute-ports-pike-ohio/)。

10 比 8 多 25%。最顺手的解释是，多出来的 2GW 留作备用。可真把两边的单位拆开，这 2GW 的“备用”根本算不出来。

<!-- more -->

## 少掉的 2GW 去哪了？

[美国能源部最早公布 PORTS-Pike 时](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf)，写的是 10GW 新建发电支撑 10GW data center development，其中至少 9.2GW 来自天然气。到了 OpenAI 与 NVIDIA 的公告里，数据中心容量变成了 8 IT-GW。

两份公告并不矛盾，它们量的是不同边界。

10GW 在发电侧，指新建电源的 capacity；8 IT-GW 已经走到了机房内部，指服务器、网络和存储等 IT equipment 能够使用的功率。电从电厂出来以后，还要经过厂用电、出力折减、电网和数据中心供配电，最后才有一部分落到 IT load。直接用 10 减 8，等于把沿途所有边界都当成了同一个电表。

![10GW 新建发电与 8 IT-GW 之间的容量边界](/images/ports-pike-power-equation.svg)

公开信息目前只钉住了两端。中间每一项是多少，PORTS-Pike 都还没有披露。这意味着 2GW 不能先被命名成 reserve，更不能据此判断供电设计已经留足余量。

先从最接近 IT load 的一层往回算。

## PUE 能解释这 2GW 吗？

GPU 并不是园区里唯一用电的设备。冷却系统、水泵、风机、UPS 损耗、变压器损耗和照明都在同一只 utility meter 后面。

[美国能源部对 PUE 的定义](https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design_0.pdf)是数据中心总能耗除以 IT equipment 能耗。假设 PORTS-Pike 的 PUE 分别为 1.10、1.15 和 1.20，8 IT-GW 会对应 8.8GW、9.2GW 和 9.6GW 的 facility demand。原来看起来有 2GW 的差额，只剩 1.2GW、0.8GW 或 0.4GW。

![8 IT-GW 对应的 PUE 敏感性](/images/ports-pike-pue-sensitivity.svg)

这只是 sensitivity，不是 PORTS-Pike 的设计参数。OpenAI 披露了 closed-loop、air-cooled cooling system，却没有公布 PUE，也没有公布 8 IT-GW 同时满载时 utility meter 会看到多少 peak demand。PUE 本身还是按年度能耗定义的比率，拿一项年均指标直接替代峰值设计，也会把季节和负载变化抹掉。

PUE 可以解释 2GW 为什么会迅速缩小，却不能证明剩下的余量够不够。因为等式左边的 10GW 也还没有走到“随时可用”。

## 10GW 发电为什么不能全部算成可靠容量？

公告里的 10GW 是规划发电容量。即使这些机组全部建成，电网要承诺可靠供电，看的也不是铭牌数字，而是系统最吃紧的小时里，这些资源还能贡献多少。

机组会检修，也会发生 forced outage；环境温度会改变出力；天然气供应可能在寒潮里同时吃紧；风光则受当时的天气约束。PJM 因此不会把每 1GW nameplate 都按 1GW 计入资源充足性，而是用 Effective Load Carrying Capability（ELCC）折算成 accredited capacity。

[PJM 为 2028/2029 容量市场公布的 class rating](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/28-29-bra-elcc-class-ratings.pdf)里，nuclear 是 96%，gas combined cycle 是 78%，gas combustion turbine 是 67%，4-hour storage 是 59%，tracking solar 只有 10%。这些比例会随资源组合和风险小时变化，也不能直接套到一座尚未公布机型、燃料配置和运行参数的新电厂上。它们说明的是另一件事：**1GW 铭牌容量从来不等于 1GW 可靠容量。**

![PJM 2028/2029 不同电源的可靠容量折算](/images/ports-pike-capacity-credit.svg)

可靠性还要求 reserve。[PJM 为 2027/2028 Delivery Year 批准的 Installed Reserve Margin 是 20%](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/2025-pjm-elcc-rrs.pdf)。这不是 PORTS-Pike 应该机械照搬的 20%，却足以说明电网的账不会停在“负荷 1GW，电厂也建 1GW”。资源的 accredited capacity、系统组合和备用要一起覆盖风险小时。

于是 10GW 与 8 IT-GW 之间不再是一道减法题。需求侧要从 IT load 走到 facility demand，供给侧要从规划容量走到 accredited capacity，两边还要在同一个地点、同一个小时相遇。

## 9.2GW 天然气靠什么持续发电？

PORTS-Pike 已经披露的 10GW 新电源里，[至少 9.2GW 是天然气发电](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf)。这让供给比风光更可调度，也把约束继续往上游推到了天然气管道。

用 EIA 2024 年 natural-gas combined-cycle 的[平均 tested heat rate 7,548 Btu/kWh](https://www.eia.gov/electricity/annual/html/epa_08_02.html)，以及 2025 年 Ohio 天然气[平均热值 1,062 Btu/cubic foot](https://www.eia.gov/dnav/ng/ng_cons_heat_a_EPG0_VGTH_btucf_a.htm)做一笔 sensitivity，9.2GW 机组若连续满发，一天大约需要 1.57Bcf 天然气。这个数字不是 PORTS-Pike 的燃料预测，实际结果取决于机型、效率、出力和燃料品质。它给出了管道的数量级：这不是给园区拉一根普通支线。

![9.2GW 天然气发电对应的燃料流量](/images/ports-pike-gas-supply.svg)

能源部的项目文件也明确写了 new interstate gas pipeline。管道有没有足够 capacity，运输合同是不是 firm，极端天气时燃气轮机能否拿到气，都会决定 9.2GW 规划容量在风险小时还能剩多少。Dual-fuel 可以降低单一燃料中断的风险，但 PORTS-Pike 尚未披露是否采用，也没有公布现场储备或替代燃料设计。

所以发电侧的关键资源不只有 gas turbine。能够把约 1.5Bcf/day 稳定送到机组的燃料路径，也是这 9.2GW 的一部分。

## 第一批 800MW 为什么不用等新电厂？

如果 10GW 新电源与数据中心是一对一的专属供电，第一批机房也应该等电厂先建好。可 OpenAI 给出的计划正好相反：[首批 800MW 预计在 2028 年主要利用 AEP 现有基础设施上线](https://openai.com/index/openai-joins-ports-pike-project/)，后续扩建才需要新电厂、新输电线路和相关设施。

这说明 PORTS-Pike 接入的仍是区域电网。第一批负荷可以先占用系统已有的 generation 与 transmission headroom；新建电厂发出的电也会进入电网重新调度，不会沿一根写着 OpenAI 的专线只流向 GPU。能源部甚至要求多余的 generation 和 transmission capacity 向区域电网开放。

10GW 的作用因此不是给 8 IT-GW 画一个孤立电源池，而是随着后续 7.2 IT-GW 分期上线，向同一个电力系统补进足够的新供给。每一期能不能交付，要分别核对当期 facility demand、已有系统余量、新增 accredited capacity、燃料和输电，而不是等 10GW 全部建完以后一次合闸。

这也解释了为什么发电量对上以后，数据中心仍然可能没有电。新电源能进系统，不代表电网有能力把它送到 Pike County 的负荷节点。那是下一层 transmission 的问题。

## 333 亿美元会变成谁的收入？

[能源部披露的 9.2GW 天然气发电对应 333 亿美元日本资金](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf)。把 333 亿美元直接记到 turbine supplier 的订单里，同样犯了把不同边界相减的错误。

这笔钱首先是 project funding。[PORTS-Pike 网站](https://portscampus.com/)写明新天然气发电将由美国政府持有，SB Energy 与 SoftBank 负责开发和建设；公开材料还没有列出 turbine OEM、EPC、pipeline operator、gas supplier 和各自的合同金额。只有设备厂商拿到不可随意取消的 purchase order，订单才会进入它的 backlog；设备发货、安装或验收以后，才会按合同进入 revenue。

OpenAI 的付款又在另一条链上。SB Energy 将建设、持有和运营数据中心，并与 OpenAI 签 20 年 lease。OpenAI 只在 completed capacity available for lease 以后开始付款。这笔 lease 买的是 land、power 和 shell 共同交付的 capacity，不能直接拆成发电收入。

![PORTS-Pike 的资金、订单与租赁收入边界](/images/ports-pike-commercial-boundaries.svg)

项目资金、供应商订单和 OpenAI lease payment 是三笔不同的 economics。把 333 亿美元 headline 映射到任何一家上市公司以前，至少要先知道谁拿到哪一段 scope，以及付款由哪一道交付事件触发。

## 这笔生意已经 Price In 了吗？

目前还算不出来。

若分析 SoftBank Group，需要从 OpenAI 的 lease payment，扣掉项目运营成本、债务服务、税和 SB Energy 投入的 equity，才能得到归属于 SoftBank 的现金流。公开材料没有披露 lease rate、项目资本结构、SB Energy 的持股比例或分期现金流。

若分析 GE Vernova、Siemens Energy、Mitsubishi Heavy Industries 或其他设备商，先要拿到 PORTS-Pike 的 supplier award，再把 awarded GW 换成设备金额、交付节奏、毛利和服务收入。现在连 OEM 名单都没有，行业 backlog 不能替代项目订单。

因此这篇能给出的 price-in disposition 是 **Unverified**。它不表示市场计入了零，也不表示 333 亿美元还全部留在价格之外；它表示从项目约束到上市公司 earnings 的 bridge 尚未成立，任何百分比都会是编出来的。

下一份真正改变判断的公告，不是再说一次 10GW，而是公布 OEM、EPC、pipeline、项目融资或 lease economics。到那时，才有可能从具体 commercial event 追到 revenue、margin、cash flow，再与当前价格隐含的经营结果比较。

## 10GW 什么时候才能和 8 IT-GW 对上？

回到开头那道看似简单的等式，需求侧应该写成：

```text
8 IT-GW × facility overhead = 分期出现的 facility demand
```

供给侧则是：

```text
新建电源的 accredited capacity + 可用的系统余量
≥ facility demand + reliability requirement
```

这组供给还要有 firm fuel，并且能在对应阶段通过电网送到负荷节点。PORTS-Pike 目前公布了 10GW 发电容量、至少 9.2GW 天然气、首批 800MW 的目标年份和 8 IT-GW 的终点，却没有公布 PUE、机组组合、net output、accredited capacity、firm gas transport 与逐期 COD。公开证据还不足以把两边逐项勾销。

所以没有 2GW 凭空消失。**从一开始，10GW 发电与 8 IT-GW 就不是可以直接相减的两个数字。**

## Sources

- [OpenAI: OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [SB Energy: NVIDIA Secures AI Compute at PORTS-Pike Technology Campus](https://sbenergy.com/nvidia-ai-compute-ports-pike-ohio/)
- [PORTS-Pike Technology Campus](https://portscampus.com/)
- [U.S. Department of Energy: Portsmouth AI Fact Sheet](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf)
- [U.S. Department of Energy: Best Practices Guide for Energy-Efficient Data Center Design](https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design_0.pdf)
- [PJM: ELCC Class Ratings for the 2028/2029 Base Residual Auction](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/28-29-bra-elcc-class-ratings.pdf)
- [PJM: 2025 Effective Load Carrying Capability and Reserve Requirement Study](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/2025-pjm-elcc-rrs.pdf)
- [U.S. Energy Information Administration: Average Tested Heat Rates by Prime Mover and Energy Source](https://www.eia.gov/electricity/annual/html/epa_08_02.html)
- [U.S. Energy Information Administration: Heat Content of Natural Gas Delivered to Consumers](https://www.eia.gov/dnav/ng/ng_cons_heat_a_EPG0_VGTH_btucf_a.htm)
