---
title: "Data Center Closed-Loop Cooling Is Constrained by the Hottest Day"
date: 2026-08-23 05:00:00
lang: en
i18n_key: data-center-thermal-path
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

OpenAI placed two claims beside each other in its [PORTS-Pike announcement](https://openai.com/index/openai-joins-ports-pike-project/): the first 800 MW is expected to become available in 2028, and the campus will use closed-loop, air-cooled cooling systems instead of cooling towers that continuously consume water.

Between those two claims sits an undisclosed thermal path. If the 800 MW ultimately sits at the IT-equipment boundary and runs at full load, nearly 800 MW of heat must continuously leave the data hall. Water can circulate inside a closed loop. Heat cannot.

Without cooling towers, how does that thermal path work?

<!-- more -->

## Water circulates; heat does not

OpenAI's use of air-cooled describes how heat ultimately leaves the campus. It does not mean GPUs are cooled directly by outdoor air.

In [NVIDIA's GB200 hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html), cold plates cool the CPUs and GPUs while coolant runs through rack manifolds and compute trays. Fans still cool networking, storage, and other components. Liquid and air paths operate together inside the same rack.

On the liquid side, heat moves from cold plates into the Technology Cooling System, then crosses a Coolant Distribution Unit into facility cooling. On the air side, server fans move heat into the hot aisle, where separate air-side equipment receives it. How the two paths meet outside the rack depends on the campus mechanical design. Whatever topology it uses, the heat must ultimately reach the outdoor environment.

![How heat moves from PORTS-Pike GPU racks to ambient air](/images/data-center-thermal-flow.en.svg)

The [NVIDIA DSX Facilities Infrastructure Reference Design](https://docs.nvidia.com/dsx/facilities-infra/reference-design-overview) provides a complete reference architecture. Liquid-to-liquid CDUs serve GPU cold plates. CRAHs carry the rack's residual air load. Both enter a Facility Water System and connect through a Central Utility Building, where chillers, pumps, and dry coolers reject heat to the atmosphere. Water remains inside finned tubes in a dry cooler while outdoor fans move air across them, so heat rejection requires no evaporation.

That is not PORTS-Pike's disclosed mechanical design. OpenAI has published only the closed-loop, air-cooled principle and says expected water use will follow after the site design is finalized. DSX explains how such an architecture can work. It cannot supply PORTS-Pike's equipment count or design conditions.

## The 800 MW has to become thermal megawatts first

The PORTS-Pike announcement defines the full project as approximately 8 IT-GW, but does not separately label the first 800 MW as utility-service, facility, or IT capacity. If it still includes power-distribution losses and the cooling plant, less power reaches the racks.

Even under the favorable assumption that it means 800 IT-MW, capacity is not second-by-second power draw. The [ASHRAE Data Center Handbook](https://handbook.ashrae.org/Handbooks/A23/SI/A23_Ch20/a23_ch20_si.aspx) warns that equipment nameplate should not be used directly to calculate heat release. Thermal design needs realistic heat release for the actual configuration and workload.

Nearly 800 MW of heat follows only when 800 MW is verified actual IT load. Power-distribution losses, pumps, fans, and other facility loads add heat elsewhere. The rack's liquid capture ratio then divides its load between two ledgers:

> Liquid thermal MW = actual rack MW × liquid capture ratio
>
> Air thermal MW = actual rack MW - liquid thermal MW

PORTS-Pike will span phases from 2028 through 2032. Rack generation, TDP, capture ratio, and workload power policy can all change across them. Without those inputs, the 800 MW cannot determine CDU, CRAH, pipe, or dry-cooler quantity. Assuming that liquid captures 80% merely replaces a missing design parameter with a precise-looking number.

Even after thermal MW is established, flow still follows `Q = m × cp × ΔT`. Removing 10 MW with a water-like coolant needs approximately 14,300 LPM at a 10°C temperature rise and almost 28,700 LPM at 5°C. NVIDIA DSX's minimum 1.5 LPM/kW is a reference design flow, not a fixed PORTS-Pike conversion rate. Electrical capacity gives the scale of the heat, but still does not specify how pipes, pumps, and CDUs move it.

## Dry cooling still needs a cooling plant

A cooling tower evaporates part of its water and uses latent heat to reject energy into the atmosphere. A dry cooler or air-cooled chiller keeps water inside a closed circuit and transfers heat through coils and fans. PORTS-Pike removes continuous evaporation makeup water, not heat exchangers, pumps, fans, chillers, or controls.

Dry cooling trades an evaporation constraint for a temperature-difference constraint. Hotter outdoor air reduces the useful temperature difference between water and air. As that difference shrinks, the same coil and fan set rejects fewer thermal megawatts. More heat-exchanger area, higher airflow, or mechanical chilling can restore capacity, but each adds site area, electricity, noise, and equipment cost.

NVIDIA DSX raises its liquid-cooling design point to 45°C to widen the operating window without full mechanical chilling. Its reference site still retains chillers. Higher-temperature liquid cooling and mechanical cooling are not mutually exclusive: dry coolers do more work when weather permits, while chillers protect supply temperature during the hottest conditions.

## How much of the 800 MW remains on the hottest day?

Forty-five degrees is a temperature boundary, not thermal capacity. Returning coolant to the GPU at its required temperature consumes approach temperature across the CDU heat exchanger and again across outdoor heat-rejection equipment. The remaining temperature difference is what lets outdoor air carry the heat away.

![How outdoor temperature compresses deliverable thermal MW](/images/data-center-cooling-design-day.en.svg)

In cooler weather, dry coolers can reduce fan speed and still hold FWS supply temperature. At design-day dry bulb, ambient temperature rises and fans reach full speed. Four options remain: add coil and fan capacity, start chillers or adiabatic assist, raise supply temperature, or reduce IT load. If the GPU thermal envelope cannot move higher, the last option becomes a workload power cap.

Failure conditions have to overlap the hottest design day. An N+1 dry-cooler, pump, or CDU group can have installed nameplate above design load. Deliverable rack capacity is the thermal MW that remains when any required component is unavailable at design-day ambient. Without selection curves, entering and leaving fluid temperatures, design ambient, redundancy, and control sequences, an "800 MW cooling capacity" figure still has no usable boundary.

## What proves the first 800 MW can sustain full load?

OpenAI's announcement states PORTS-Pike's planned low-water heat-rejection topology. It does not prove that the first 800 MW can sustain full load on the hottest design day. Closing that question requires the first phase's electrical boundary, rack mix and actual heat release, liquid capture ratio, TCS and FWS supply-return temperatures and flow, and outdoor-equipment selection data under site design ambient and required contingency.

Even after those inputs freeze and equipment arrives, thermal megawatts are not yet available. TCS, FWS, and outdoor heat rejection must pass commissioning together under full load, design-day conditions, and required failure scenarios. The thermal path is delivered only when GPUs remain inside their thermal limits through those faults.

## The 800 MW cannot yet become supplier revenue

Current disclosures do not identify PORTS-Pike's cooling basis of design, supplier awards, equipment quantities, prices, or margins. Closed-loop air-cooled narrows the candidate equipment classes to CDUs, pumps, heat exchangers, dry coolers, air-cooled chillers, and controls. It cannot multiply 800 MW into any supplier's revenue.

Without a revenue bridge, there is no defensible way to measure how much of this demand is priced in. Company-level economics and price-in therefore remain Unverified. Another 800 MW headline will not change that conclusion. It needs a frozen mechanical design, equipment awards, supplier-disclosed orders, and proof that revenue growth reaches gross margin and cash flow.

PORTS-Pike's decision to omit cooling towers does not make 800 MW of heat disappear. Water circulates through the TCS and FWS; heat crosses some combination of CDUs, CRAHs, chillers, and dry coolers before it finally enters outdoor air. The unanswered question is whether that path can continuously carry the first phase's entire thermal load when the hottest design day and an equipment failure occur together.

Mechanical design and commissioning have to prove it. Once electricity can enter and heat can leave, the facility has still completed only two subsystems. Whether the whole building works through a fault is the next delivery boundary.
