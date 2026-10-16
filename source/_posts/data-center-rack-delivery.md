---
title: AI Rack 交付瓶颈未必是 GPU
date: 2026-08-23 07:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-rack-delivery
---

720 块 GPU 到达工厂，账面上刚好够组十座 GB200 NVL72。可 GPU allocation 只给出了 rack delivery 的上限：NVLink switch tray、power shelf、cable cartridge、busbar、manifold 与 management switch 少了任何一项，十座 rack 都不一定能齐套。

齐套以后还要经过 full-rack burn-in、packing、运输、site installation 和 bring-up。每走过一道 gate，“十座”都可能继续停在 work in process，而不是变成 Rack Ready。

同一批 rack 可以同时出现在 backlog、product revenue、site receipt 和 available capacity 里，四个数字却不一定相等。**AI Rack 怎样完成交付？** 这条链不能只看物流有没有签收，而要看 complete kit、factory pass、control transfer 与 site-ready rack position 分别跨过了哪道边界。

<!-- more -->

## 72 块 GPU 已经不是交付单位

[NVIDIA 的 DGX GB rack hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html)把 GB200 NVL72 定义成一个 72-GPU NVLink domain。它不是 72 块 GPU 装进同一个 metal enclosure 那么简单。

18 个 compute tray 提供 36 颗 Grace CPU 与 72 块 Blackwell GPU。每个 tray 还带四块 400G ConnectX-7 NIC、两块双口 400G BlueField-3 DPU、local NVMe、BMC/HMC、风扇，以及覆盖 CPU 和 GPU 的 cold plate。九个 NVLink switch tray 再提供 18 颗 NVSwitch，把 18 个 compute tray 连成同一个 scale-up fabric。

整柜后部还有四组 passive copper cable cartridge 组成的 NVLink copper backplane、busbar、liquid-cooling manifold 与 cable management；八个 33kW power shelf 把 AC 变成 50-51V DC，并以 N+N 方式支撑约 120kW rack load。两台 management Top-of-Rack switch 和控制软件则把 compute tray、switch tray 与管理服务接进同一个控制面。

![GB200 NVL72 从 Compute Tray 组成 Rack-scale System](/images/ai-rack-anatomy.svg)

GPU allocation 最先受到关注，却已经不是可以单独验收的 system boundary。少一个 switch tray，72 块 GPU 不能形成目标 NVLink topology；power system、busbar 或 liquid loop 没达到项目的 acceptance criteria，整柜也不能在设计负载下通过验证。

## 齐套数量先卡住工厂吞吐量

假设 720 块 GPU 已经到厂，账面上足够组十座 NVL72。工厂能推进多少座 rack，要对所有关键物料分别做除法：完整 compute tray 能支持几座，NVLink switch tray 能支持几座，power shelf、cable cartridge、busbar、manifold 和 management switch 又各自能支持几座。最小的那个数字，才是 complete kit 数量。

这就是 GPU allocation 与 rack throughput 之间的第一道缺口。领先到货的 GPU 会进入 work in process；缺的那一项没有补齐以前，前面的高价值 component 只占用 inventory 与 working capital，无法进入 full-rack test。具体由谁承担库存，仍取决于 title transfer、客户供料和付款条款。

齐套也只拿到了测试资格。[Supermicro 公布的 rack integration 流程](https://www.supermicro.com/en/solutions/rack-integration?mlg=0)从 power budget、BOM 与 prototype 开始，经过 rack-and-stack、cabling、full-rack burn-in 和 performance report，最后才进入 packing 与 deployment。任何一步失败，都可能让“已经装完”的 rack 返回 rework。

Supermicro 还披露可以同时给 [80 座 120kW GB200 rack 做 48 小时 burn-in](https://www.supermicro.com/sites/default/files/content_resources/static_resources/channel_training/Supermicro_DLC-2.pdf)。这组数字说明 full-rack test 本身需要专门的 power、cooling 与 network capacity，却不能直接换算成 80 座合格 rack：first-pass yield、retest 和 test-bay 周转仍会决定实际 throughput。

## Factory Pass 到现场还剩下哪些证据

Factory Acceptance Test（FAT）证明的是这座 rack 在工厂配置、负载和测试条件下满足了约定标准。运输不会让 rack 变成另一台机器，却会改变它所在的环境，也可能改变连接状态。

工厂已经验证过的 serial number、BOM、firmware baseline 和 test result 不会因为搬运自动失效。需要重新证明的，是运输有没有改变 frame、connector、cable seating 与 liquid loop，以及目标机房能不能提供这版 rack 所要求的接口。Change record 一旦显示 tray、firmware 或连接发生变化，相应 factory evidence 的适用范围也要重新评估。

[NVIDIA 的 deployment validation checklist](https://docs.nvidia.com/mission-control/docs/rack-bring-up-install/2.0.0/deployment-summary-validation-checklist.html)把现场前提列得很具体：rack 已经安装定位，power 与 cooling capacity 足够，management、provisioning、storage 和 compute network 就绪，18 个 compute tray、九个 NVLink switch tray 与八个 power shelf 都和 BOM 对得上。

![GB200 NVL72 在现场必须同时闭合的 Facility Interface](/images/ai-rack-facility-interface.svg)

这些条件必须落到同一个 rack position。总 MW、冷却容量和 floor space 分别有余量，不代表 A/B power、TCS、network 与服务空间已经同时匹配这一座 rack。项目能否 derate 或分阶段接入，要看设计和 acceptance criteria；若交付目标是完整 120kW NVL72，这些接口没有闭合，bring-up 就不能按目标配置继续。

Facility RFS 和 rack FAT 因而是两条可以并行、却必须在现场汇合的路径。晚到的那一条不一定总在 critical path，但只要它挡住 site connection，就会成为 Rack Ready 的下一项前置依赖。

## Site Receipt 到 Rack Ready 还差什么

设备进入 data hall，只证明物流完成。现场还要把 factory inventory 与实物重新对齐，把 rack 接到 power、cooling 和各张 network，再恢复 management plane。

[NVIDIA 的 rack bring-up guide](https://docs.nvidia.com/mission-control/docs/rack-bring-up-install/2.1.0/rack-bring-up.html)建议先让 NVLink switch 上线并完成配置，再启动 compute tray；否则 compute node 可能需要重启，才能正确加入 NVLink fabric。随后还要确认 BMC access、firmware 与 SBOM 一致、network bond 与 NIC link 正常，以及所有 node 都进入预期状态。

也就是说，FAT evidence 与 site evidence 回答的是两个问题。前者证明同一座 rack 曾在 factory boundary 内通过；后者证明它在目标机房重新获得了 power、liquid cooling、management 与 fabric health。只有现场 acceptance criteria 全部满足，它才从 site receipt 进入 Rack Ready。

![一座 AI Rack 从齐套、FAT 走到 Rack Ready 的证据链](/images/ai-rack-delivery-ledger.svg)

Rack Ready 仍然不是行业统一的会计术语。具体项目可能把 customer acceptance 放在 shipment、delivery、installation 或 bring-up 后；“可用算力”还可能要求 cluster-level validation。研究任何一笔订单时，必须先写清合同、供应商和客户分别在哪个 milestone 记账。

## 161 亿美元到底到了哪一道边界

[Dell 的 Q1 release](https://investors.delltechnologies.com/news-releases/news-release-details/dell-technologies-delivers-first-quarter-fiscal-2027-financial)披露了 244 亿美元 orders 与 161 亿美元 AI server revenue；同日 [earnings call](https://investors.delltechnologies.com/static-files/b63ffff9-b729-403b-a231-c6af05667759)又给出 513 亿美元 backlog。三者对应的不是同一种交付状态。

Orders 说明客户已经下单；backlog 是尚未确认收入的订单余额；product revenue 通常说明 hardware control 已按合同转移。它们属于 Dell 与客户之间的 commercial boundary。机房有没有接上电和水，NVLink fabric 有没有起来，cluster 能不能承载 workload，则发生在另一条 physical boundary 上。

Dell 的 [Annual Report](https://www.sec.gov/Archives/edgar/data/1571996/000157199626000008/dell-20260130.htm)写明，hardware product revenue 通常在设备已经发货、risk of loss 转移、Dell 获得收款权且 customer acceptance 条款满足以后确认。这里的关键词是“typically”：每份合同仍要回到 performance obligation 与 transfer-of-control 条款，不能反推每一美元 AI server revenue 都停在同一个地点。

两条边界并不矛盾。系统厂完成 product performance obligation 时，客户可能还在做 site installation 与 deployment；后者若属于另一项 service obligation，也会按自己的进度确认。**Revenue 回答哪项合同义务已经完成，available capacity 回答哪一段系统已经能够工作。**

因此，vendor 披露的 orders、backlog 与 revenue，不能直接和客户披露的 installed GPU 或 available MW 相加。先对齐 milestone，才能判断 shipment 到 Rack Ready 之间到底积压了多少设备。

## Dell 留下了多少 Economics

161 亿美元 AI server revenue 很大，可高价值 BOM 也会同时穿过 Dell 的账。Dell 在 Q1 earnings call 中说，company non-GAAP gross margin rate 为 18.1%，下降主要来自 AI server mix；AI server profitability 则仍在 [mid-single-digit operating income rate](https://investors.delltechnologies.com/static-files/b63ffff9-b729-403b-a231-c6af05667759)目标附近。收入体量与利润率之间的落差说明，GPU、memory 与 networking 的上游价值大部分只是经过系统厂。

Working capital 也在放大。Dell 的 [Q1 10-Q](https://www.sec.gov/Archives/edgar/data/1571996/000157199626000030/dell-20260501.htm)显示，inventory 从 104 亿美元升到 151 亿美元，accounts receivable 从 176 亿美元升到 259 亿美元。不能把全部变化都归给 AI server，但 management 明确说 working capital 主要受到 AI-optimized server demand 影响。订单越大，kit mismatch、客户机房延迟和 product transition 带来的 inventory risk 也越大。

公开材料还不能把 rack integration 单独映射到 Dell 的 segment margin。要证明这部分能力正在留下 economics，至少要看到 storage、networking、software、deployment 与 service attach 上升，WIP 与 rework 下降，现场责任成为付费收入，而不是无偿整改。目前可验证的结论更窄：Dell 的 AI server volume 很大，AI server operating margin 仍是 mid-single digits，rack integration 在其中留下多少利润尚未披露。

## Rack Integration 被 Price In 了多少

Dell 在 5 月 28 日财报发布前收于 316.53 美元，8 月 21 日收于 [442.08 美元](https://www.nasdaq.com/market-activity/stocks/dell/historical)，涨幅约 39.7%。按 6 月初约 6.481 亿股计算，对应的 equity value 变化约 814 亿美元。同期 Dell 给出的 FY2027 guidance 是 600 亿美元 AI server revenue 与 17.90 美元 non-GAAP EPS；当前价格约为 24.7 倍 guided earnings。

这些数字只能证明 Dell 经历了显著重估，不能证明其中多少来自 rack integration。814 亿美元是整家公司的 equity value 变化，17.90 美元也是包含 storage、传统 server、PC 与 financing 的 company-wide EPS；公开披露又没有拆出 NVL72、完整 rack、standalone server、deployment 与 services 各自的 revenue 和 earnings。把整家公司的股价变化先归到 AI server，再从 AI server 归到 rack integration，需要连续做两次公开数据并不支持的归因。

所以当前的 price-in 结论只能是 **Unverified**。要把它升级成可验证判断，至少要看到 rack-scale product mix、attach rate、deployment/services revenue、对应 margin 与 working-capital intensity，再用这些 earnings 建 reverse valuation。600 亿美元 AI server revenue 可以很大，但没有这组数据，无法知道市场给 factory test 到 site bring-up 之间的 rack integration 能力标了多少价。

回到开头那 720 块 GPU。它们最多支持十座 NVL72，却不能直接推出十座 Rack Ready。完整 rack 的数量先受 complete kit 限制，再经过 full-rack test 的 first-pass yield 与 rework，最后还要和目标机房的 power、cooling、network 与 rack position 一一闭合。

所以 rack delivery 的分子不是 GPU shipment，而是通过现场 acceptance criteria 的完整 rack。FAT 保留下来的 baseline evidence 与 site bring-up 新增的 interface evidence，共同把 complete kit 变成 Rack Ready。到了这里，72-GPU NVLink domain 只完成了当前 gate；数百座这样的机器还要穿过 InfiniBand 或 Ethernet，才能成为一座万卡集群。
