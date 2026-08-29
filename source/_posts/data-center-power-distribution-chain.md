---
title: 从变电站到机架：供配电链
date: 2026-08-23 04:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-power-distribution-chain
---

PORTS-Pike 首批 800MW 预计在 2028 年 available，整座园区只会部署 NVIDIA AI compute infrastructure。

一座 GB200 NVL72 rack 有 72 块 GPU，功耗大约 120kW。800,000kW 除以 120kW，再向下取整，最多是 6,666 座 rack、约 48 万块 GPU。

这道除法没有算错。错的是把两个边界不同的 MW 放进了同一道算式。

<!-- more -->

## 6,666 座 Rack 只是静态上限

[OpenAI 的公告](https://openai.com/index/openai-joins-ports-pike-project/)先把 PORTS-Pike 定义成约 8 IT-GW，又说首批 800MW 会在 2028 年 available。上下文指向同一批租赁 capacity，却没有单独说明这 800MW 是 utility service、facility load，还是已经留给 IT equipment 的容量。

[NVIDIA 的 GB200 hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html)给出的 120kW，则是 rack power consumption。它已经走到了机架边界，里面包含 compute tray、NVLink switch tray、power shelf 和 rack 内其它组件。

只有当 800MW 全部位于 rack 边界、全部供给同一种 120kW rack、没有 shared IT load、没有 reserve，而且 required contingency 下仍能完整交付时，6,666 才成立。这个数字因此有用，但它只是一条 static nameplate 上限，不是安装数量。

## 800MW 到 Rack 要跨过四本账

电从 utility service delivery point 进入园区以后，会经过 service transformer、medium-voltage switchgear、facility transformer、low-voltage switchgear、UPS 或其它 ride-through 方案，再通过 busway 和 tap-off 到达 rack。GB200 的 power shelf 最后把 AC 转成约 50–51V DC。

![800MW 从园区容量走到 GPU Rack 的四层口径](/images/data-center-power-path.svg)

同一条电力路径上至少有四种容量：utility 能交付多少，facility 总共消耗多少，IT equipment 能使用多少，GPU rack 最后分到多少。即使按最有利口径把首批 capacity 当作 800 IT-MW，也不能全部分给 GPU rack。

NVIDIA 的 [NCP data center architecture](https://docs.nvidia.com/dsx/ncp/software-reference-guide/data-center-architecture)里，GPU POD 之外还有 Core POD。Control node、general-purpose node、high-speed storage、utility cluster、DC edge 和四套网络都从 IT budget 取电。800 IT-MW 不是 800 GPU-rack MW。

## Rack 也不是一个固定功率单位

120kW 只对应当前 GB200 NVL72 的近似功耗。PORTS-Pike 从 2028 年开始交付，完整 buildout 一直到 2032 年，实际部署会跨越多代 hardware。

NVIDIA 当前的 [DSX Facilities Infrastructure Reference Design](https://docs.nvidia.com/dsx/facilities-infra/reference-design-overview)已经把 cabinet TDP 写成 198kW 到 330kW。仍然做最简单的除法，800MW 可以装 6,666 座 120kW rack、4,040 座 198kW rack，或者 2,424 座 330kW rack。最大值与最小值相差 2.75 倍。

这三个数字都不是 PORTS-Pike 预测。它们只证明一件事：不先知道 rack generation 和 design power，“800MW 能装多少 rack”连分母都没有确定。

Software 还会继续改变这个分母。[NVIDIA DSX MaxLPS](https://docs.nvidia.com/dsx/maxlps/overview)在一个 illustrative Vera Rubin inference scenario 里，通过 dynamic power allocation 和 performance-per-watt optimization，让固定 site-power envelope 最多容纳 40% 更多 GPU。可 training、inference 的 power profile 不同，测试也仍在进行。不能把这 40% 直接加到 PORTS-Pike 的 rack 数上。

## DSX Reference Site 给的是参照系

既然直接除不出来，可以换一套已经把园区、网络、storage 和 compute 一起放进去的 reference design。

NVIDIA 的 250MW-class DSX example site 包含 96 个 Scalable Unit、1,536 座 GPU rack 和 110,592 块 GPU。按同一比例线性放大到 800MW，会得到约 4,915 座 rack、35.4 万块 GPU。

![800MW 在三种口径下对应的 GPU Rack 数量](/images/data-center-power-block-sizing.svg)

4,915 仍然不是 PORTS-Pike 的 rack count。DSX 明确把这组数字称为 sizing reference，actual site 会变化；250MW-class 也不是 PORTS-Pike 已披露的 electrical basis of design。线性放大甚至会得到 307.2 个 Scalable Unit 和 4,915.2 座 rack，现实里不存在 0.2 座 rack。

这次计算没有排除 6,666 这个数字，排除的是仅凭一次除法就把它当成安装数量。DSX 使用的 rack generation、design power 和 shared architecture 与 GB200 算式不同，4,915 与 6,666 之间的差额不能全部归到某一项 overhead。它真正补上的，是一套可以继续追问的 reference architecture：PORTS-Pike 的 design 与它哪里相同，哪里不同，差异又会怎样改变 rack density。

## 冗余设备的 MW 不能拿来装 GPU

容量口径对齐以后，还要问这 800MW 在什么 failure condition 下成立。

假设一座 power block 用 A、B 两条 2N path 保护 N MW critical IT load，两条路径的 installed nameplate 可以接近 2N，任何一路退出后可持续交付的容量仍然只有 N。多出来的 transformer、switchgear、UPS 和 busway 买的是维护与故障期间的 availability，不是第二份 GPU capacity。

![Power Block 的设备铭牌容量怎样变成可安装 Rack 容量](/images/data-center-power-capacity-ledger.svg)

真正能进入 rack 计算的，是 required contingency 下仍可交付的 IT MW，再减去 shared IT、operating reserve 和 block rounding。公式可以写得很短：

> 可安装 Rack = floor((可交付 IT MW − Shared IT MW − Reserve MW) ÷ Rack Design MW)

可每一项都必须来自同一套 single-line、同一个 phase 和同一种 workload policy。拿 utility meter MW、2N equipment nameplate 或整座 campus 的最终 buildout 去做分子，都会把 rack 数算大。

## 800MW 只能按 Power Block 交付

Rack 也不是沿着 800MW 连续填满的。Data hall 会把供电拆成重复的 power block，每个 block 包含 medium-voltage feeder、transformer、switchgear、ride-through、busway 和固定数量的 rack feed。整个 block 完成 commissioning，里面的 rack capacity 才能交付。

于是 800MW 除完以后还要取整。剩下的几 MW 如果装不下完整 Scalable Unit，或者上游某个 transformer、busway 已经到达 continuous rating，就会暂时变成 stranded capacity。不同 phase 使用不同 rack generation，block size 也可能跟着改变。

OpenAI 已经给出下一份关键证据会在哪里出现。OpenAI 与 NVIDIA 会共同发布 PORTS-Pike technical white paper，覆盖 resilient infrastructure design、component qualification、workload management、testing 与 commissioning。等到文件披露 IT boundary、rack generation、Scalable Unit 数量、shared-core budget、redundancy 和 power-management policy，800MW 才能从 headline capacity 变成可以复算的 rack count。

## 800MW 也不能直接乘出设备收入

OpenAI 公告已经明确 SB Energy 负责 build、own 和 operate，NVIDIA 为首期 4.25 IT-GW 提供 $1.5 billion 投资与 credit support。它没有公开 transformer、switchgear、UPS、busway 或 power shelf 的 supplier award、数量、价格和 margin。

同样的 800 IT-MW，可以对应不同 voltage、block size、redundancy 和 ride-through topology。设备 BOM 会随设计一起变化，项目成本也不能直接归到某一家公司的 revenue。NVIDIA 的名字出现在项目里，证明它参与 compute design、testing 与 commissioning，不等于每一美元 power package 都由 NVIDIA 捕获。

所以现有证据只能确认 PORTS-Pike 首期的 project-level capacity。具体设备公司的 revenue bridge 与 price-in 仍是 Unverified。下一道有效证据不是又一个 MW 新闻，而是冻结后的 single-line、equipment award 或供应商披露的对应订单。

回到开头，800MW 除以 120kW，再向下取整为 6,666 座 rack，没有算术问题。它只是把所有尚未公开的设计条件都默认为零。现有资料最多给出三种参照：6,666 座 GB200 rack 的 static nameplate 上限，约 4,915 座 rack 的 DSX reference ratio，以及 198–330kW 下一代 cabinet 下 4,040 到 2,424 座的直接上限。它们不是一个预测区间。PORTS-Pike 与这些参照究竟相差多少，要等 800MW 真正被拆进 power block 才知道。
