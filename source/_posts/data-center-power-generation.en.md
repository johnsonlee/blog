---
title: "Why Does 10 GW of Generation Support Only 8 IT-GW?"
date: 2026-08-23 02:45:00
lang: en
i18n_key: data-center-power-generation
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

The PORTS-Pike announcement puts two numbers in the same sentence: [at least 10 GW of new generation will result in 8 IT-GW of AI factory capacity](https://sbenergy.com/nvidia-ai-compute-ports-pike-ohio/).

Ten is 25% larger than eight. The obvious explanation is that the extra 2 GW is reserve. Once the boundaries on both sides are separated, however, that 2 GW reserve cannot be calculated at all.

<!-- more -->

## Where did the missing 2 GW go?

When the [U.S. Department of Energy first announced PORTS-Pike](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf), it described 10 GW of new generation supporting 10 GW of data center development, including at least 9.2 GW of natural gas generation. The OpenAI and NVIDIA announcements later described the data center as 8 IT-GW.

The disclosures are measuring different boundaries.

The 10 GW sits on the generation side. The 8 IT-GW sits inside the facility and measures the power capacity available to servers, networking, storage, and other IT equipment. Between those points are station service, output derating, the grid, and the data center's own power infrastructure. Subtracting eight from ten treats every boundary along that path as the same meter.

![Capacity boundaries between 10 GW of new generation and 8 IT-GW](/images/ports-pike-power-equation.en.svg)

Public disclosures currently anchor only the two endpoints. PORTS-Pike has not published the values in between. The 2 GW cannot be labeled as reserve, much less used to conclude that the design has enough headroom.

The reconciliation has to begin near the IT load and work backward.

## Can PUE explain the 2 GW?

The GPUs are not the only equipment drawing power. Cooling equipment, pumps, fans, UPS losses, transformer losses, and lighting all sit behind the same utility meter.

The [Department of Energy defines PUE](https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design_0.pdf) as total data center energy divided by IT equipment energy. If PORTS-Pike had a PUE of 1.10, 1.15, or 1.20, its 8 IT-GW would correspond to 8.8 GW, 9.2 GW, or 9.6 GW of facility demand. The apparent 2 GW gap would shrink to 1.2 GW, 0.8 GW, or 0.4 GW.

![PUE sensitivity for 8 IT-GW](/images/ports-pike-pue-sensitivity.en.svg)

This is a sensitivity, not a PORTS-Pike design parameter. OpenAI has disclosed a closed-loop, air-cooled cooling system, but it has not disclosed PUE or the peak demand that the utility meter would see if the full 8 IT-GW were loaded at once. PUE is also defined using annual energy. Substituting that annual ratio for a peak planning value would erase seasonal and workload variation.

PUE explains why the 2 GW gap can disappear quickly. It does not prove that the remaining headroom is sufficient, because the 10 GW on the other side has not yet become capacity available on demand.

## Why is 10 GW of generation not 10 GW of reliable capacity?

The announced 10 GW is planned generation capacity. Even if every unit is built, a reliable power system cannot rely on the nameplate total. It needs to know what those resources can still contribute during the hours when the system is under the most stress.

Units undergo maintenance and forced outages. Ambient temperature changes output. Gas supply can become constrained during the same cold weather that drives electric demand higher. Wind and solar output depends on the weather during those hours. PJM therefore does not count every 1 GW of nameplate as 1 GW of resource adequacy. It uses Effective Load Carrying Capability, or ELCC, to convert installed capacity into accredited capacity.

For the [2028/2029 capacity auction, PJM assigned class ratings](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/28-29-bra-elcc-class-ratings.pdf) of 96% to nuclear, 78% to gas combined cycle, 67% to gas combustion turbines, 59% to four-hour storage, and 10% to tracking solar. These ratings change with the resource mix and risk hours. They also cannot be applied directly to a new plant whose turbine configuration, fuel arrangement, and operating parameters have not been disclosed. They demonstrate one narrower point: **1 GW of nameplate is never automatically 1 GW of reliable capacity.**

![PJM 2028/2029 capacity accreditation by resource class](/images/ports-pike-capacity-credit.en.svg)

Reliability also requires reserves. [PJM approved a 20% Installed Reserve Margin for the 2027/2028 Delivery Year](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/2025-pjm-elcc-rrs.pdf). PORTS-Pike cannot simply borrow that 20% as a project design assumption, but the figure shows why grid arithmetic does not stop at "1 GW of load requires 1 GW of plant." Accredited capacity, the system resource mix, and reserves have to cover the hours of risk together.

The 10 GW and 8 IT-GW no longer form a subtraction problem. The demand side must move from IT load to facility demand. The supply side must move from planned capacity to accredited capacity. Both sides must then meet at the same location and hour.

## What keeps 9.2 GW of gas generation running?

Of the 10 GW of new generation disclosed for PORTS-Pike, [at least 9.2 GW will be natural gas generation](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf). That makes the supply more dispatchable than wind or solar, while moving the constraint upstream to the gas network.

Using EIA's 2024 [average tested heat rate of 7,548 Btu/kWh](https://www.eia.gov/electricity/annual/html/epa_08_02.html) for natural gas combined-cycle plants and the 2025 [average heat content of 1,062 Btu per cubic foot](https://www.eia.gov/dnav/ng/ng_cons_heat_a_EPG0_VGTH_btucf_a.htm) for gas delivered in Ohio, 9.2 GW running continuously at full output would consume roughly 1.57 Bcf of gas per day. This is not a PORTS-Pike fuel forecast. The actual number depends on turbine type, efficiency, output, and fuel quality. It establishes the scale of the pipeline requirement. This is not an ordinary campus lateral.

![Fuel flow implied by 9.2 GW of gas generation](/images/ports-pike-gas-supply.en.svg)

The DOE project materials explicitly call for a new interstate gas pipeline. Pipeline capacity, firm transport contracts, and fuel availability during extreme weather all determine how much of the planned 9.2 GW remains available during risk hours. Dual fuel could reduce exposure to a single fuel interruption, but PORTS-Pike has not disclosed whether it will use dual-fuel units or maintain alternate fuel on site.

The critical generation resource is therefore larger than the gas turbine. A fuel path capable of delivering roughly 1.5 Bcf per day is part of the same 9.2 GW system.

## Why can the first 800 MW avoid waiting for new plants?

If the 10 GW of generation were a dedicated one-to-one power supply, the first data halls would have to wait for those plants. OpenAI's plan says the opposite: [the first 800 MW is expected in 2028 largely using existing AEP infrastructure](https://openai.com/index/openai-joins-ports-pike-project/). Later phases require new power plants, transmission lines, and related infrastructure.

PORTS-Pike will still connect to the regional grid. The first phase can use existing generation and transmission headroom. New plants will inject into the same grid and be redispatched with the rest of the system; their electrons will not follow a line labeled OpenAI directly to the GPUs. DOE also says excess generation and transmission capacity must be made available to the regional grid.

The 10 GW is therefore not an isolated power pool reserved for 8 IT-GW. It adds supply to the same electric system as the later 7.2 IT-GW comes online in phases. Each phase has to reconcile its facility demand, existing system headroom, new accredited capacity, fuel, and transmission. The project does not wait for the entire 10 GW to finish and then close a single breaker.

This also explains why sufficient generation can still leave a data center without power. New supply may enter the system while the network remains unable to deliver it to the load node in Pike County. That is the next problem in the transmission layer.

## Whose revenue will the $33 billion become?

[DOE says $33.3 billion of Japanese funding is associated with the 9.2 GW of gas generation](https://www.energy.gov/sites/default/files/2026-03/FACT_SHEET_Portsmouth_AI.pdf). Treating that entire amount as a turbine supplier's order repeats the same boundary error.

The $33.3 billion is project funding first. The [PORTS-Pike site](https://portscampus.com/) says the new gas generation will be owned by the U.S. government, while SB Energy and SoftBank are developing and building the project. Public materials do not identify the turbine OEM, EPC contractor, pipeline operator, gas supplier, or the value of their contracts. A supplier records an order in backlog only after it receives a sufficiently firm purchase order. Revenue follows shipment, installation, or acceptance according to the contract.

OpenAI's payments sit on a separate chain. SB Energy will build, own, and operate the data center under a 20-year lease to OpenAI. OpenAI begins paying only when completed capacity becomes available for lease. That lease buys delivered land, power, and shell capacity together. It cannot be treated as generation revenue by itself.

![The boundaries between PORTS-Pike funding, supplier orders, and lease revenue](/images/ports-pike-commercial-boundaries.en.svg)

Project funding, supplier orders, and OpenAI lease payments are three different sets of economics. Before the $33.3 billion headline can be mapped to a listed company, the awarded scope and the delivery event that triggers payment must be known.

## Is this business already priced in?

The public evidence does not support a calculation yet.

For SoftBank Group, the bridge would begin with OpenAI's lease payments and subtract operating costs, debt service, taxes, and the equity invested through SB Energy. Public disclosures do not provide the lease rate, project capital structure, SB Energy ownership percentages, or phased cash flows.

For GE Vernova, Siemens Energy, Mitsubishi Heavy Industries, or another equipment supplier, the first requirement is a PORTS-Pike supplier award. Awarded gigawatts could then be converted into equipment value, delivery timing, margin, and service revenue. No OEM list has been disclosed, and an industry backlog cannot stand in for a project order.

The defensible price-in disposition is therefore **Unverified**. It does not mean that the market has priced in zero, or that all $33.3 billion remains outside current valuations. It means the bridge from the project constraint to a listed company's earnings does not exist in the public evidence, so any percentage would be fabricated.

The next disclosure that changes the conclusion will identify an OEM, EPC contractor, pipeline contract, project financing terms, or lease economics. Only then can a commercial event be traced into revenue, margin, and cash flow and compared with the operating result implied by a current share price.

## When can 10 GW finally be reconciled with 8 IT-GW?

The demand side of the apparent equation should read:

```text
8 IT-GW x facility overhead = facility demand arriving in phases
```

The supply side should read:

```text
accredited capacity from new generation + available system headroom
>= facility demand + reliability requirement
```

That supply also needs firm fuel and must be deliverable through the grid during the corresponding phase. PORTS-Pike has disclosed 10 GW of headline generation capacity, at least 9.2 GW of gas generation, a target year for the first 800 MW, and an endpoint of 8 IT-GW. It has not disclosed PUE, the generating-unit mix, net output, accredited capacity, firm gas transport, or COD by phase. The public evidence cannot yet reconcile the two sides line by line.

No 2 GW vanished. **The 10 GW of generation and 8 IT-GW were never two numbers that could be subtracted directly.**

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
