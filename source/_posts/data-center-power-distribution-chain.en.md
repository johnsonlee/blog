---
title: "From Substation to Rack: The Power Distribution Chain"
date: 2026-08-23 04:00:00
lang: en
i18n_key: data-center-power-distribution-chain
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

The first 800 MW at PORTS-Pike is expected to become available in 2028, and the campus will host NVIDIA AI compute infrastructure exclusively.

A GB200 NVL72 rack contains 72 GPUs and consumes approximately 120 kW. Dividing 800,000 kW by 120 kW and rounding down produces at most 6,666 whole racks, or approximately 480,000 GPUs.

The arithmetic is correct. The mistake is placing two megawatt figures from different boundaries into the same equation.

<!-- more -->

## 6,666 racks is only a static upper bound

[OpenAI's announcement](https://openai.com/index/openai-joins-ports-pike-project/) first defines PORTS-Pike as approximately 8 IT-GW, then says the first 800 MW will become available in 2028. The context points to the same leased capacity, but the announcement does not separately label the 800 MW as utility service, facility load, or capacity already allocated to IT equipment.

[NVIDIA's GB200 hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html) places the 120 kW figure at the rack boundary. It covers compute trays, NVLink switch trays, power shelves, and the other components inside the rack.

The 6,666 result holds only if the full 800 MW sits at that rack boundary, every megawatt serves the same 120 kW rack, there is no shared IT load or reserve, and the full capacity remains deliverable under the required contingency. It is useful as a static nameplate ceiling, not as an installation count.

## The 800 MW crosses four ledgers before reaching a rack

After power enters the campus at the utility service delivery point, it passes through service transformers, medium-voltage switchgear, facility transformers, low-voltage switchgear, UPS or another ride-through design, busway, and tap-offs. The GB200 power shelves finally convert AC to approximately 50-51 V DC.

![The four capacity ledgers between 800 MW of campus capacity and GPU racks](/images/data-center-power-path.en.svg)

At least four capacities exist along that path: what the utility can deliver, what the facility consumes, what IT equipment can use, and what GPU racks finally receive. Even under the favorable assumption that the first phase represents 800 IT-MW, not all of it belongs to GPU racks.

In NVIDIA's [NCP data center architecture](https://docs.nvidia.com/dsx/ncp/software-reference-guide/data-center-architecture), GPU PODs sit beside a Core POD. Control nodes, general-purpose nodes, high-speed storage, the utility cluster, the data center edge, and four networks all draw from the IT budget. Eight hundred IT-MW is not eight hundred GPU-rack MW.

## A rack is not a fixed unit of power

The 120 kW figure applies to the current GB200 NVL72. PORTS-Pike begins delivering capacity in 2028 and continues its buildout through 2032, so the installed hardware will span generations.

NVIDIA's current [DSX Facilities Infrastructure Reference Design](https://docs.nvidia.com/dsx/facilities-infra/reference-design-overview) gives a cabinet TDP range from 198 kW to 330 kW. The same direct division produces 6,666 whole racks at 120 kW, 4,040 racks at 198 kW, or 2,424 racks at 330 kW. The largest result is 2.75 times the smallest.

None is a PORTS-Pike forecast. They establish that the denominator remains unknown until rack generation and design power are specified.

Software can change that denominator again. In an illustrative Vera Rubin inference scenario, [NVIDIA DSX MaxLPS](https://docs.nvidia.com/dsx/maxlps/overview) combines dynamic power allocation with performance-per-watt optimization to fit up to 40% more GPUs inside a fixed site-power envelope. Training and inference have different power profiles, and Vera Rubin testing remains in progress. The 40% cannot simply be added to a PORTS-Pike rack estimate.

## The DSX reference site provides a coordinate system

Instead of dividing by one rack, the calculation can begin with a reference design that already includes campus, network, storage, and compute infrastructure.

NVIDIA's 250 MW-class DSX example site contains 96 Scalable Units, 1,536 GPU racks, and 110,592 GPUs. Scaling the same ratio linearly to 800 MW gives approximately 4,915 racks and 354,000 GPUs.

![GPU rack counts implied by three different 800 MW boundaries](/images/data-center-power-block-sizing.en.svg)

The 4,915 figure is still not the PORTS-Pike rack count. NVIDIA calls the figures a sizing reference and says actual sites vary. The 250 MW-class example is not PORTS-Pike's disclosed electrical basis of design. Linear scaling even produces 307.2 Scalable Units and 4,915.2 racks, neither of which is a buildable configuration.

This calculation does not rule out 6,666 as a number. It rules out treating one division as an installation count. The DSX example uses a different rack generation, design power, and shared architecture, so the gap between 4,915 and 6,666 cannot be assigned entirely to one overhead item. What DSX adds is a reference architecture that supports the next comparison: where PORTS-Pike uses the same design, where it differs, and how those differences change rack density.

## Redundant equipment megawatts cannot power more GPUs

After aligning the capacity boundary, the next question is the failure condition attached to the 800 MW.

Suppose a power block protects N MW of critical IT load with two 2N paths, A and B. Installed equipment nameplate can approach 2N, while continuously deliverable capacity remains N after either path is lost. The second set of transformers, switchgear, UPS systems, and busway buys availability during maintenance and faults. It is not another block of GPU capacity.

![How power-block equipment nameplate becomes installable rack capacity](/images/data-center-power-capacity-ledger.en.svg)

Only IT megawatts that remain deliverable under the required contingency can enter the rack calculation. Shared IT, operating reserve, and block rounding must then be removed:

> Installable racks = floor((deliverable IT MW - shared IT MW - reserve MW) / rack design MW)

Every input must come from the same single-line diagram, project phase, and workload policy. Utility-meter megawatts, 2N equipment nameplate, or final campus buildout used as the numerator will all overstate rack count.

## The 800 MW can only be delivered by power block

Racks do not fill 800 MW continuously. A data hall divides distribution into repeated power blocks. Each block contains a medium-voltage feeder, transformer, switchgear, ride-through system, busway, and a fixed set of rack feeds. Rack capacity becomes deliverable only after the whole block passes commissioning.

The division therefore ends with integer constraints. A few remaining megawatts become stranded capacity if they cannot hold a complete Scalable Unit or if an upstream transformer or busway has reached its continuous rating. Different phases may use different rack generations, changing block size again.

OpenAI has already identified where the next useful evidence should appear. OpenAI and NVIDIA plan to publish a PORTS-Pike technical white paper covering resilient infrastructure design, component qualification, workload management, testing, and commissioning. Once it discloses the IT boundary, rack generation, Scalable Unit count, shared-core budget, redundancy, and power-management policy, the 800 MW can become a reproducible rack count.

## The 800 MW cannot yet be multiplied into supplier revenue

OpenAI has disclosed that SB Energy will build, own, and operate the campus, while NVIDIA will invest $1.5 billion in SB Energy and provide credit support for the initial 4.25 IT-GW. It has not disclosed transformer, switchgear, UPS, busway, or power-shelf awards, quantities, pricing, or margins.

The same 800 IT-MW can use different voltages, block sizes, redundancy, and ride-through topologies. The equipment bill of materials changes with the design, and project cost cannot be assigned directly to one company's revenue. NVIDIA's presence proves its role in compute design, testing, and commissioning. It does not mean NVIDIA captures every dollar in the power package.

The current evidence reaches project-level capacity only. Revenue attribution and price-in for any equipment company remain Unverified. The next valid evidence is not another megawatt announcement. It is a frozen single-line diagram, an equipment award, or a supplier-disclosed order.

The opening division of 800 MW by 120 kW, rounded down to 6,666 whole racks, has no arithmetic error. It silently sets every undisclosed design condition to zero. Public information supports three reference points: a static nameplate ceiling of 6,666 GB200 racks, a DSX reference ratio of approximately 4,915 racks, and direct ceilings from 4,040 to 2,424 racks for 198-330 kW cabinets. They are not a forecast range. PORTS-Pike's distance from each reference will remain unknown until the 800 MW is divided into actual power blocks.
