---
title: 数据中心闭式循环受制于最热一天
date: 2026-08-23 05:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-thermal-path
---

OpenAI 在 [PORTS-Pike 的公告](https://openai.com/index/openai-joins-ports-pike-project/)里并排写了两件事：首批 800MW 预计在 2028 年 available，整座园区采用 closed-loop、air-cooled cooling system，不依赖持续耗水的 cooling tower。

两项承诺之间，隔着一条尚未公开的散热链。假设这 800MW 最终都落在 IT equipment，并且同时满载，接近 800MW 的热量就得持续离开机房。水可以在闭环里反复循环，热却不能。

不用 cooling tower，这条散热链怎样成立？

<!-- more -->

## 水循环，热量不循环

OpenAI 所说的 air-cooled，描述的是热量最终怎样离开园区，不是 GPU 直接靠室外空气降温。

[NVIDIA 的 GB200 hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html)里，CPU 和 GPU 贴着 cold plate，coolant 沿 rack manifold 流过 compute tray；networking、storage 和其它组件仍由 fan 带走热量。同一座 rack 里，液冷与风冷两条路径同时存在。

液冷侧从 cold plate 进入 Technology Cooling System（TCS），再通过 Coolant Distribution Unit（CDU）跨到 facility cooling。风冷侧则从 server fan 进入 hot aisle，由另一套 air-side equipment 接走。两条路径怎样在 rack 之外汇合，取决于园区的 mechanical design；无论采用哪套 topology，热最终都要排到室外环境。

![PORTS-Pike 的热量怎样从 GPU Rack 走到室外空气](/images/data-center-thermal-flow.svg)

[NVIDIA DSX Facilities Infrastructure Reference Design](https://docs.nvidia.com/dsx/facilities-infra/reference-design-overview)给出了一套完整参照：liquid-to-liquid CDU 承接 GPU cold plate，CRAH 承接机架里的剩余风冷负荷，两者通过 Facility Water System（FWS）汇入 Central Utility Building，再由 chiller、pump 与 dry cooler 把热排进大气。Dry cooler 的水走封闭管路，室外风扇吹过 finned-tube heat exchanger，不靠蒸发带走热量。

这不是 PORTS-Pike 已披露的 mechanical design。OpenAI 只公布了 closed-loop、air-cooled 这条原则，并明确说要等 site design finalized 以后再公开预期用水量。DSX 能回答架构怎样成立，不能替 PORTS-Pike 补出设备数量和设计工况。

## 800MW 先要变成 Thermal MW

PORTS-Pike 公告把整个项目定义成约 8 IT-GW，却没有单独说明首批 800MW 位于 utility service、facility 还是 IT boundary。若 800MW 还包含供配电损耗和 cooling plant，进入 rack 的功率会更低。

即使按最有利口径把它当成 800 IT-MW，也只是 capacity，不是每一秒的实际功耗。[ASHRAE 的 Data Center Handbook](https://handbook.ashrae.org/Handbooks/A23/SI/A23_Ch20/a23_ch20_si.aspx)明确提醒，equipment nameplate 不能直接拿来计算 heat release；thermal design 要用具体 configuration 与 workload 下的实际 heat release。

只有当 800MW 是经过验证的 actual IT load，接近 800MW heat 这一步才成立；供配电损耗、pump 和 fan 等 facility load 还会在其它位置继续产生热。接下来要按 rack 的 liquid capture ratio 拆成两本账：

> Liquid Thermal MW = Actual Rack MW × Liquid Capture Ratio
>
> Air Thermal MW = Actual Rack MW − Liquid Thermal MW

PORTS-Pike 会跨越 2028 到 2032 多个 phase，rack generation、TDP、capture ratio 和 workload power policy 都可能变化。没有这些输入，没人能从 800MW 推出 CDU、CRAH、pipe 或 dry cooler 的数量。随手假设“液冷占 80%”，只是把缺失的 design parameter 换成了一个看起来具体的数字。

Thermal MW 确定以后，水量仍取决于 `Q = m × cp × ΔT`。同样搬走 10MW，接近水的 coolant 在 10°C 温升下大约需要 14,300 LPM，温升缩到 5°C，流量就接近 28,700 LPM。NVIDIA DSX 给出的至少 1.5 LPM/kW 只是 reference design flow，不是 PORTS-Pike 的固定换算率。电力侧给出了热量规模，仍没有给出 pipe、pump 与 CDU 怎样搬运这些热量。

## Dry Cooling 仍然需要 Cooling Plant

Cooling tower 会让一部分水蒸发，用潜热把热量带进大气。Dry cooler 或 air-cooled chiller 则让水留在封闭管路里，用 coil 与 fan 把热交给室外空气。PORTS-Pike 减掉的是持续 evaporation makeup water，不是 heat exchanger、pump、fan、chiller 或 controls。

Dry cooling 把蒸发约束换成了温差约束。空气越热，水与空气之间可用的温差越小；温差缩小，同一组 coil 和 fan 能排出的 thermal MW 就会下降。扩大设备面积、提高 airflow 或启用 mechanical chilling 可以补回容量，但会增加占地、用电、噪音和设备成本。

NVIDIA DSX 把 liquid-cooling design point 提到 45°C，正是为了扩大无需 full mechanical chilling 的运行窗口。它的 reference site 仍然保留 chiller，说明 higher-temperature liquid cooling 与 mechanical cooling 不是非此即彼：天气合适时让 dry cooler 多做，最热时再由 chiller 保住 supply temperature。

## 最热那天，800MW 还剩多少

45°C 是 temperature boundary，不是 thermal capacity。要把规定温度的 coolant 送回 GPU，CDU heat exchanger 要留 approach temperature，室外 heat-rejection equipment 也要留 approach；最后剩下的温差，才是室外空气搬走热量的空间。

![室外温度如何压缩可交付 Thermal MW](/images/data-center-cooling-design-day.svg)

天气凉时，dry cooler 可以降低 fan speed，仍然维持 FWS supply。到了 design-day dry-bulb，ambient temperature 上升，fan 已经跑满，设备只能在四个答案里选：增加 coil 与 fan、启用 chiller 或 adiabatic assist、提高 supply temperature，或者降低 IT load。GPU thermal envelope 不允许继续升温时，最后一项就是 workload power cap。

故障条件还要叠加在最热设计日上。一组 N+1 dry cooler、pump 或 CDU，installed nameplate 可以高于 design load；能交付给 rack 的，是任一 required component 退出以后，剩余设备在 design-day ambient 下仍能搬走的 thermal MW。少了 selection curve、entering/leaving fluid temperature、design ambient、redundancy 和 control sequence，“800MW cooling capacity”仍然只是一个没有边界的数字。

## 怎样证明首批 800MW 能持续满载

OpenAI 的公告表明 PORTS-Pike 计划采用低持续用水的 heat-rejection topology，没有证明首批 800MW 能在最热设计日持续满载。要闭合这道题，至少还缺首批 capacity 的 electrical boundary、rack mix 与实际 heat release、liquid capture ratio、TCS/FWS 的 supply-return temperature 与 flow，以及 outdoor equipment 在项目 design ambient 和 required contingency 下的 selection data。

这些设计输入冻结以后，设备到场也不等于 thermal MW 已经 available。TCS、FWS 与 outdoor heat rejection 还要在 full load、design-day 与 required failure scenario 下共同通过 commissioning。只有故障发生时 GPU 仍未越过 thermal limit，这条散热链才算交付。

## 800MW 还不能换成供应商收入

现有披露没有给出 PORTS-Pike 的 cooling basis of design、supplier award、设备数量、价格或 margin。Closed-loop air-cooled 只能把候选设备范围收窄到 CDU、pump、heat exchanger、dry cooler、air-cooled chiller 与 controls，不能把 800MW 直接乘成任何一家公司的 revenue。

同样缺少 revenue bridge，也就没有办法判断这笔需求已经 price in 多少。这里的 company-level economics 与 price-in 只能标成 Unverified。下一条“800MW”新闻不会改变这个结论；需要等到 mechanical design 冻结、equipment award 与供应商订单披露，再看收入增长能否进入 gross margin 与 cash flow。

回到开头，PORTS-Pike 不用 cooling tower，并没有让 800MW 热量消失。水在 TCS 与 FWS 里循环，热量会穿过某种 CDU、CRAH、chiller 与 dry cooler 的组合，最后仍然交给室外空气。尚未公开的是，这条路径在最热设计日与设备故障同时发生时，能不能持续搬走首批 rack 的全部 thermal load。

这道题要等 mechanical design 与 commissioning 来证明。电能送到、热能排出以后，机房仍然只完成了两个子系统；整座 facility 能不能在故障里一起工作，是下一道交付边界。
