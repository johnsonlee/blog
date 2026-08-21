---
title: When Compute Becomes a Gigawatt Business
date: 2026-08-21 22:54:04
lang: en
i18n_key: ai-data-center-bottleneck-migration
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Power
  - Infrastructure
  - Agent
  - Investing
---

In August 2026, OpenAI put the PORTS-Pike project in Ohio on the table: roughly 8 IT-GW, with the first 800MW expected in 2028 and the full buildout running to 2032. The supporting system is not a few more buildings. It is at least 10GW of new generation, $4.2 billion of regional grid infrastructure, NVIDIA credit support for the first 4.25 IT-GW, a 20-year lease, permits, environmental review, financing, and six years of construction.

The press release talks about investment and jobs. The bottleneck framework translates it into a harder question: AI demand has arrived at software speed; can data center supply replicate at industrial speed?

<!-- more -->

In the previous post, "Replication Speed Is the Real Bottleneck", I used a Bottleneck Migration Network: D0 is the root demand, D1 is a subsystem, D2 is a route, D3 is equipment, components, process, and qualification, and D4 is shared physical capacity. Depth stays fixed. The red light moves.

This post zooms in on one D0 root: Data Center.

For AI data centers, I would start with three questions:

1. What layers make a data center capable of supplying AI power capacity, and who charges tolls at each layer?
2. In the public GW numbers, how much is IT load, and how much is generation, PPA, clean attributes, or a future development framework?
3. Once Agent traffic scales, how wide does the gap get between demand arrival time and usable compute delivery time?

The core equation is simple:

```text
Replication gap = time needed to replicate supply - time needed for demand to arrive

Bottleneck intensity ∝ demand shock × supply rigidity × replication gap
```

AI data centers are hard because demand behaves like software while supply behaves like power engineering.

## The Data Center D0 Root

An AI data center is not "buy GPUs, then find a place to plug them in". The order has flipped. First you find a large block of power with a delivery date. Then you force land, transmission, substations, shell, MEP, cooling, racks, networking, storage, scheduling, and operations onto the same commissioning calendar.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 640" role="img" aria-labelledby="dc-network-title-en" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="dc-network-title-en">Bottleneck Migration Network for AI data centers</title>
  <defs>
    <marker id="dc-arrow-en" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
    <marker id="dc-purple-arrow-en" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#7c3aed"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="638" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="38" y="45" font-size="24" font-weight="700" fill="#111827">The Data Center D0 root: the red light migrates down the replication chain</text>
    <text x="38" y="75" font-size="14" fill="#64748b">Fixed depth: D0 root demand -> D1 subsystems -> D2 routes -> D3 equipment/process -> D4 shared capacity</text>

    <g font-size="12" font-weight="700" text-anchor="middle">
      <rect x="34" y="104" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="125" fill="#334155">D0</text>
      <rect x="34" y="184" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="205" fill="#334155">D1</text>
      <rect x="34" y="286" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="307" fill="#334155">D2</text>
      <rect x="34" y="408" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="429" fill="#334155">D3</text>
      <rect x="34" y="536" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="557" fill="#334155">D4</text>
    </g>

    <g stroke="#cbd5e1" stroke-width="1">
      <line x1="120" y1="200" x2="940" y2="200"/>
      <line x1="120" y1="302" x2="940" y2="302"/>
      <line x1="120" y1="424" x2="940" y2="424"/>
      <line x1="120" y1="552" x2="940" y2="552"/>
    </g>

    <g text-anchor="middle" font-size="14">
      <rect x="416" y="96" width="148" height="48" rx="7" fill="#111827"/>
      <text x="490" y="126" fill="#ffffff" font-weight="700">AI Data Center</text>

      <rect x="128" y="176" width="130" height="48" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="193" y="205" fill="#1e3a8a" font-weight="700">Power</text>
      <rect x="288" y="176" width="130" height="48" rx="7" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
      <text x="353" y="205" fill="#155e75" font-weight="700">Shell + MEP</text>
      <rect x="448" y="176" width="130" height="48" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="205" fill="#92400e" font-weight="700">Cooling density</text>
      <rect x="608" y="176" width="130" height="48" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="205" fill="#5b21b6" font-weight="700">Cluster</text>
      <rect x="768" y="176" width="130" height="48" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="205" fill="#166534" font-weight="700">Operations</text>

      <rect x="118" y="270" width="150" height="64" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="193" y="296" fill="#991b1b" font-weight="700">firm power</text>
      <text x="193" y="316" fill="#991b1b" font-size="12">grid / transmission</text>
      <rect x="286" y="270" width="134" height="64" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="353" y="296" fill="#9a3412" font-weight="700">EPC delivery</text>
      <text x="353" y="316" fill="#9a3412" font-size="12">shell / fire / QA</text>
      <rect x="446" y="270" width="134" height="64" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="296" fill="#92400e" font-weight="700">liquid cooling</text>
      <text x="513" y="316" fill="#92400e" font-size="12">CDU / cold plates</text>
      <rect x="606" y="270" width="134" height="64" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="296" fill="#5b21b6" font-weight="700">rack fabric</text>
      <text x="673" y="316" fill="#5b21b6" font-size="12">GPU / HBM / network</text>
      <rect x="766" y="270" width="134" height="64" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="296" fill="#166534" font-weight="700">billable work</text>
      <text x="833" y="316" fill="#166534" font-size="12">utilization / uptime</text>

      <rect x="118" y="392" width="150" height="64" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="193" y="418" fill="#991b1b" font-weight="700">transformers</text>
      <text x="193" y="438" fill="#991b1b" font-size="12">switchgear / UPS</text>
      <rect x="286" y="392" width="134" height="64" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="353" y="418" fill="#9a3412" font-weight="700">skilled trades</text>
      <text x="353" y="438" fill="#9a3412" font-size="12">HV / LV / testing</text>
      <rect x="446" y="392" width="134" height="64" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="418" fill="#92400e" font-weight="700">pumps valves</text>
      <text x="513" y="438" fill="#92400e" font-size="12">leak detection</text>
      <rect x="606" y="392" width="134" height="64" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="418" fill="#5b21b6" font-weight="700">CoWoS optics</text>
      <text x="673" y="438" fill="#5b21b6" font-size="12">switch / storage</text>
      <rect x="766" y="392" width="134" height="64" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="418" fill="#166534" font-weight="700">SRE scheduler</text>
      <text x="833" y="438" fill="#166534" font-size="12">failures / pricing</text>

      <rect x="112" y="520" width="162" height="64" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="193" y="546" fill="#991b1b" font-weight="700">copper steel permits</text>
      <text x="193" y="566" fill="#991b1b" font-size="12">queue capacity</text>
      <rect x="286" y="520" width="134" height="64" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="353" y="546" fill="#9a3412" font-weight="700">labor pool</text>
      <text x="353" y="566" fill="#9a3412" font-size="12">regional contractors</text>
      <rect x="446" y="520" width="134" height="64" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="546" fill="#92400e" font-weight="700">water noise community</text>
      <text x="513" y="566" fill="#92400e" font-size="12">cooling permits</text>
      <rect x="606" y="520" width="134" height="64" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="546" fill="#5b21b6" font-weight="700">wafers HBM substrate</text>
      <text x="673" y="566" fill="#5b21b6" font-size="12">packaging capacity</text>
      <rect x="766" y="520" width="134" height="64" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="546" fill="#166534" font-weight="700">customer workflows</text>
      <text x="833" y="566" fill="#166534" font-size="12">ROI / conversion</text>
    </g>

    <g stroke="#64748b" stroke-width="1.8" fill="none" marker-end="url(#dc-arrow-en)">
      <path d="M490 144 C420 158 250 155 193 176"/>
      <path d="M490 144 C430 166 374 166 353 176"/>
      <path d="M490 144 C500 166 510 166 513 176"/>
      <path d="M490 144 C560 166 632 166 673 176"/>
      <path d="M490 144 C670 158 780 156 833 176"/>
      <path d="M193 224 V270"/>
      <path d="M353 224 V270"/>
      <path d="M513 224 V270"/>
      <path d="M673 224 V270"/>
      <path d="M833 224 V270"/>
      <path d="M193 334 V392"/>
      <path d="M353 334 V392"/>
      <path d="M513 334 V392"/>
      <path d="M673 334 V392"/>
      <path d="M833 334 V392"/>
      <path d="M193 456 V520"/>
      <path d="M353 456 V520"/>
      <path d="M513 456 V520"/>
      <path d="M673 456 V520"/>
      <path d="M833 456 V520"/>
    </g>
    <path d="M240 302 C340 350 555 350 626 302" stroke="#7c3aed" stroke-width="2" stroke-dasharray="7 6" fill="none" marker-end="url(#dc-purple-arrow-en)"/>
    <text x="430" y="362" font-size="12" fill="#6d28d9" text-anchor="middle">Alternative routes: relocate, behind-the-meter, self-generation, chip/network architecture shifts</text>

    <g font-size="12">
      <rect x="620" y="602" width="18" height="12" rx="3" fill="#fee2e2" stroke="#dc2626"/>
      <text x="646" y="612" fill="#475569">Red: likely binding now</text>
      <rect x="770" y="602" width="18" height="12" rx="3" fill="#fef3c7" stroke="#d97706"/>
      <text x="796" y="612" fill="#475569">Yellow: candidate bottleneck</text>
    </g>
  </g>
</svg>

D0 does not move. AI still needs the Data Center root. What moves is the red light: in 2023 it sat on GPUs, in 2024 it moved to HBM and CoWoS, in 2025 it pressed into powered land, grid connection, electrical equipment, and liquid cooling. By 2026, projects like PORTS-Pike expose the whole chain.

A data center capable of AI power capacity has roughly six replication segments.

First is the power-ready site. Older site selection optimized for land, tax, network, and customer distance. Now the first question is whether the utility can give you 300MW, 500MW, or 1GW with a firm delivery date. CBRE says sites with power access inside 18 to 36 months are highly sought after, and 200MW-plus parcels have moved up the priority list.

Second is generation, transmission, and interconnection. A PPA can solve long-term energy procurement without solving local instantaneous delivery. An AI cluster needs stable, dispatchable, interconnected power, preferably without breaking carbon targets. That pulls nuclear, gas, hydro, geothermal, solar plus battery, and behind-the-meter power into the same map.

Third is shell, MEP, and power distribution. High-voltage power enters the site, then runs through transformers, switchgear, UPS, PDUs, busway, and finally the rack. A NVIDIA DGX GB rack is roughly a 120kW power object. Ten or twenty kW per rack used to sound dense. For an AI campus, 100kW-plus is now the starting point.

Fourth is cooling. High-density racks put direct-to-chip liquid cooling, CDUs, cold plates, pumps, piping, leak detection, chillers, and heat exchangers on the critical path. Cooling is not a supporting character. It determines how much IT load fits on the same land.

Fifth is rack fabric. GPUs, HBM, NVLink or Ethernet fabric, optics, storage, server integration, and firmware all need to arrive together. Owning GPUs is not enough. Training clusters care about scale-up and scale-out networking; inference clusters care about cost, latency, geography, and utilization.

Sixth is operations and revenue. Customers do not buy a building or a card. They buy usable token capacity: low failure rates, low latency, enough scheduling efficiency, and workloads that turn into paid tasks.

The supply chain should be read in layers. OpenAI, Microsoft, Amazon, Google, Meta, Oracle, CoreWeave, and Crusoe open demand and capital. Equinix, Digital Realty, QTS, CyrusOne, and developers deliver facilities. Constellation, Talen, Vistra, Brookfield, AEP, Dominion, PJM, and ERCOT shape the power path. Schneider, Eaton, ABB, Siemens, Vertiv, GE Vernova, Quanta, DPR, and Turner gate the electrical and construction schedule. NVIDIA, AMD, Broadcom, Marvell, Arista, Cisco, TSMC, SK hynix, Micron, and Samsung fill the cluster.

NVIDIA still matters. At GW scale, the scarce capability is making land, power, equipment, buildings, and chips share the same delivery date.

## Public GW Must Pass Through a Funnel

As of August 21, 2026, the market has plenty of public GW numbers. The easiest mistake is adding them all together.

There are four common GW units.

- IT-GW: the IT load actually consumed by servers and racks. It is the closest public unit to usable compute. PORTS-Pike's 8 IT-GW belongs here, but it is still phased and conditional future capacity.
- Facility power: data center or campus-side power, including PUE, redundancy, and infrastructure overhead.
- Generation / PPA GW: generation capacity, power procurement, or an offtake framework. It solves energy sourcing. It is not local IT load.
- Clean attributes: clean power attributes, time matching, and carbon goals. These support ESG and long-term supply strategy. They are not GPU capacity.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 610" role="img" aria-labelledby="gw-funnel-title-en" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="gw-funnel-title-en">The funnel from public GW to usable AI compute</title>
  <defs>
    <marker id="funnel-arrow-en" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="608" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="40" y="46" font-size="24" font-weight="700" fill="#111827">Headline GW needs unit cleanup before it enters the delivery funnel</text>
    <text x="40" y="76" font-size="14" fill="#64748b">One table can mix IT-GW, planned capacity, PPA, generation capacity, and clean attributes</text>

    <g text-anchor="middle" font-size="13" font-weight="700">
      <rect x="52" y="112" width="180" height="70" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="142" y="141" fill="#991b1b">IT-GW</text>
      <text x="142" y="162" fill="#991b1b" font-size="12">PORTS-Pike 8 IT-GW</text>
      <rect x="282" y="112" width="180" height="70" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="372" y="141" fill="#1e3a8a">planned AI capacity</text>
      <text x="372" y="162" fill="#1e3a8a" font-size="12">Stargate near 7GW</text>
      <rect x="512" y="112" width="180" height="70" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="602" y="141" fill="#92400e">PPA / generation</text>
      <text x="602" y="162" fill="#92400e" font-size="12">renewable / nuclear</text>
      <rect x="742" y="112" width="180" height="70" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="832" y="141" fill="#166534">clean attributes</text>
      <text x="832" y="162" fill="#166534" font-size="12">24/7 CFE / carbon</text>
    </g>

    <g stroke="#64748b" stroke-width="1.8" fill="none" marker-end="url(#funnel-arrow-en)">
      <path d="M142 182 C155 220 225 230 300 246"/>
      <path d="M372 182 C370 212 350 226 330 246"/>
      <path d="M602 182 C572 218 438 226 360 246"/>
      <path d="M832 182 C772 228 498 226 390 246"/>
    </g>

    <path d="M190 246 H790 L724 326 H256 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <path d="M256 342 H724 L664 422 H316 Z" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <path d="M316 438 H664 L610 506 H370 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M370 522 H610 L570 578 H410 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>

    <g text-anchor="middle">
      <text x="490" y="284" font-size="20" font-weight="700" fill="#0f172a">local firm power</text>
      <text x="490" y="309" font-size="13" fill="#334155">generation permits / transmission / interconnection / capacity market</text>
      <text x="490" y="380" font-size="20" font-weight="700" fill="#0f172a">power train and facility</text>
      <text x="490" y="405" font-size="13" fill="#334155">transformers / switchgear / UPS / MEP / commissioning</text>
      <text x="490" y="475" font-size="20" font-weight="700" fill="#0f172a">AI-ready cluster</text>
      <text x="490" y="499" font-size="13" fill="#334155">GPU / HBM / optics / storage / liquid cooling / scheduler</text>
      <text x="490" y="556" font-size="20" font-weight="700" fill="#0f172a">billable token capacity</text>
    </g>

    <g fill="#475569" font-size="13">
      <text x="52" y="274">Leakage 1: overlap</text>
      <text x="52" y="298">Leakage 2: region/year mix</text>
      <text x="52" y="382">Leakage 3: grid and equipment delay</text>
      <text x="52" y="406">Leakage 4: PUE and redundancy</text>
      <text x="52" y="482">Leakage 5: rack delivery and yield</text>
      <text x="52" y="506">Leakage 6: utilization and revenue</text>
    </g>
  </g>
</svg>

Once the public contracts are separated by unit, the picture is cleaner:

| Public item | Number | Timing | Unit judgement |
| --- | ---: | --- | --- |
| OpenAI / Oracle Stargate | Additional 4.5GW, more than 5GW under development in total | 2025-07 | AI data center capacity in progress, not live IT load |
| OpenAI five new Stargate sites | Nearly 7GW planned, 10GW target | 2025-09 | Planned capacity, not something to mechanically add to every later announcement |
| OpenAI / SB Energy / NVIDIA PORTS-Pike | About 8 IT-GW, first 800MW expected in 2028 | 2026-08 | Closest public unit to usable compute, with full delivery to 2032 |
| Microsoft / Brookfield | 10.5GW new renewable capacity | 2024-05 | Renewable PPA framework, not IT load |
| Microsoft / Constellation CCEC | About 835MW, 20-year PPA, expected online in 2028 | 2024-09 | Nuclear restart supporting PJM data center power matching |
| Talen / Amazon | 1,920MW nuclear power, full volume by 2032 | 2025-06 | Front-of-meter nuclear PPA supporting AWS Pennsylvania data centers |
| Meta nuclear portfolio | Up to 6.6GW by 2035 | 2026-01 | Mix of existing nuclear and advanced nuclear, mostly post-2030 |
| Google / Kairos | Up to 500MW, first SMR targeted for 2030 | 2024-10 | Advanced nuclear procurement framework |
| Google / Brookfield hydro | Up to 3,000MW, first 670MW | 2025-07 | Hydro PPA framework, closer to 24/7 carbon-free energy |

The table does not say "they signed many GW, so there is no shortage". It says hyperscalers no longer trust normal queues to satisfy AI demand on time. They are locking power, land, equipment, and sometimes bringing the chip company into land, power, and shell.

Demand-side numbers keep moving up. IEA estimates global data center electricity use at 415TWh in 2024 and 945TWh in 2030. The 530TWh increase is roughly 60GW of average facility power. LBNL's U.S. estimate is closer in time: 176TWh in 2023 to 325-580TWh in 2028, or roughly 17-46GW of incremental average load.

McKinsey uses a capacity lens: global data center demand rises from roughly 60GW today to 171-219GW in 2030, with a high case of 298GW. That implies 111-159GW of new demand-serving capacity before 2030. JLL's 2026 outlook expects nearly 100GW of additions between 2026 and 2030, with global capacity around 200GW by 2030.

The units are not identical, so I would not subtract them with fake precision. As a stress test, they are enough: central demand is above planned supply, and delays widen the gap. McKinsey gives one more concrete U.S. datapoint: even if known plans arrive on time, the United States could still have more than 15GW of data center supply deficit in 2030.

The gap is not a shortage of capital. It comes from the replication chain.

- D1 power access: primary-market grid connection often takes more than four years, and new transmission lines in advanced economies typically take four to eight years.
- D2 local firm power: PPAs can be signed quickly. RTO/ISO queues, substations, and transmission cannot replicate at the same speed.
- D3 equipment: transformers, switchgear, cables, UPS, busway, and gas turbines all face long lead times. IEA says wait times for key components such as transformers and cables have doubled in three years.
- D3 construction: a GW campus needs civil work, high voltage, low voltage, fire systems, cooling, and commissioning on the same schedule. PORTS-Pike itself points to a six-year buildout and 35,000 construction jobs.
- D3/D4 cooling and water: 100kW-plus rack density brings CDUs, cold plates, pumps, pipes, noise, water rights, and community approvals onto the critical path.
- D3/D4 cluster: beyond GPUs, delivery depends on HBM, advanced packaging, network switches, optics, storage, PCB, system integration, and operating yield.

The more public GW you see, the more you should ask which layer it has passed. Signing is D0/D1 evidence. Commissioning means D3/D4 survived contact with the field.

## Agents Speed Up the Demand Clock

Over the next five years, the biggest demand-side variable is not more people chatting. It is Agents turning one request into many steps.

Ordinary chat is a back-and-forth. An Agent workflow plans, retrieves, calls tools, reads files, writes code, runs tests, fixes failures, and verifies again. The user submits one task. Behind it, there may be dozens of model calls. Add multimodal input, browser control, long context, and parallel workers, and token traffic can grow faster than users.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 620" role="img" aria-labelledby="agent-gap-title-en" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="agent-gap-title-en">Agent demand clock versus data center replication clock</title>
  <defs>
    <linearGradient id="agent-gap-fill-en" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#f97316" stop-opacity="0.06"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="978" height="618" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="42" y="46" font-size="24" font-weight="700" fill="#111827">Demand clock is software; supply clock is industrial engineering</text>
    <text x="42" y="76" font-size="14" fill="#64748b">2030 anchor: McKinsey demand 171-219GW, high case 298GW; JLL supply about 200GW before delivery discount</text>

    <line x1="92" y1="430" x2="900" y2="430" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="92" y1="120" x2="92" y2="430" stroke="#94a3b8" stroke-width="1.5"/>
    <g stroke="#e2e8f0" stroke-width="1">
      <line x1="92" y1="368" x2="900" y2="368"/>
      <line x1="92" y1="306" x2="900" y2="306"/>
      <line x1="92" y1="244" x2="900" y2="244"/>
      <line x1="92" y1="182" x2="900" y2="182"/>
      <line x1="92" y1="120" x2="900" y2="120"/>
    </g>
    <g fill="#64748b" font-size="12">
      <text x="72" y="434" text-anchor="end">0</text>
      <text x="72" y="372" text-anchor="end">50</text>
      <text x="72" y="310" text-anchor="end">100</text>
      <text x="72" y="248" text-anchor="end">150</text>
      <text x="72" y="186" text-anchor="end">200</text>
      <text x="72" y="124" text-anchor="end">250GW</text>
    </g>

    <path d="M130 356 L285 326 L440 291 L595 247 L750 195 L870 165" fill="none" stroke="#ef4444" stroke-width="4"/>
    <path d="M130 390 L285 362 L440 330 L595 296 L750 259 L870 244" fill="none" stroke="#2563eb" stroke-width="4"/>
    <path d="M130 402 L285 378 L440 352 L595 326 L750 304 L870 286" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="8 7"/>
    <path d="M595 247 L750 195 L870 165 L870 286 L750 304 L595 326 Z" fill="url(#agent-gap-fill-en)"/>

    <g fill="#111827" font-size="13" text-anchor="middle">
      <text x="130" y="456">2025</text>
      <text x="285" y="456">2026</text>
      <text x="440" y="456">2027</text>
      <text x="595" y="456">2028</text>
      <text x="750" y="456">2029</text>
      <text x="870" y="456">2030</text>
    </g>

    <g font-size="13">
      <rect x="590" y="104" width="304" height="114" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <line x1="612" y1="132" x2="658" y2="132" stroke="#ef4444" stroke-width="4"/>
      <text x="672" y="137" fill="#334155">Agent upside demand</text>
      <line x1="612" y1="160" x2="658" y2="160" stroke="#2563eb" stroke-width="4"/>
      <text x="672" y="165" fill="#334155">planned data center supply</text>
      <line x1="612" y1="188" x2="658" y2="188" stroke="#64748b" stroke-width="3" stroke-dasharray="8 7"/>
      <text x="672" y="193" fill="#334155">usable AI-ready supply after discount</text>
    </g>

    <g>
      <rect x="64" y="492" width="400" height="86" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="86" y="520" font-size="15" font-weight="700" fill="#111827">Demand arrival time</text>
      <text x="86" y="546" font-size="13" fill="#334155">users x tasks x steps x tokens x retries</text>
      <text x="86" y="568" font-size="13" fill="#334155">product changes spread in weeks or months</text>
      <rect x="516" y="492" width="400" height="86" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="538" y="520" font-size="15" font-weight="700" fill="#111827">Supply replication time</text>
      <text x="538" y="546" font-size="13" fill="#334155">grid, transformers, construction, cooling, racks</text>
      <text x="538" y="568" font-size="13" fill="#334155">most fields queue and commission by the year</text>
    </g>
  </g>
</svg>

McKinsey's workload chart gives a useful anchor: global data center demand rises from 82.3GW in 2025 to 219GW in 2030; AI inference moves from 20.9GW to 93.3GW, roughly a 35% CAGR; AI training moves from 23.1GW to 62.2GW, roughly a 22% CAGR. That is not an Agent forecast, but it shows inference becoming the main load.

OpenAI traffic points in the same direction. In October 2025, Sam Altman said ChatGPT had 800 million weekly active users and the API was processing more than 6 billion tokens per minute. User adoption already moves at consumer software speed. Agents change the multiplier from "users" to "task steps".

I would use three scenarios for the next five years. The gap below is a rough order estimate for global usable AI-ready compute, not a precise forecast.

| Scenario | Demand path | Supply path | Gap around 2030 |
| --- | --- | --- | --- |
| Constrained | Agent reliability improves slowly; inference follows the base path | JLL's nearly 100GW of new supply mostly arrives; AI-ready discount is modest | 15-25GW |
| Base | Agents penetrate coding, office work, and customer support; inference grows 30%+ | Planned supply comes online, but 10-20% is lost to grid, equipment, fit-out, and utilization friction | 30-50GW |
| Agent upside | Tool calls, long context, background work, and parallel workers scale quickly | Supply accelerates, but the grid and equipment still replicate at industrial speed | 70GW+ |

The math is plain. McKinsey's 2030 demand midpoint is 219GW. JLL's 2030 capacity is around 200GW. The surface gap is 19GW. After delay risk, AI-ready fit-out, local grid limits, GPU/rack delivery, and actual utilization, the base gap lands in the tens of GW. If demand approaches McKinsey's 298GW high case while supply remains near 200GW, the gap jumps above 70GW very quickly.

The dangerous part is replication time.

```text
Agent demand = active users
             × tasks per user
             × steps per task
             × tokens per step
             × retry rate
             ÷ model efficiency gain
```

```text
Usable compute = commissioned IT load
               × performance per watt
               × rack delivery rate
               × network and storage yield
               × scheduler utilization
               × paid workload conversion
```

Model efficiency will improve. Quantization, distillation, MoE, speculative decoding, KV cache improvements, and better schedulers will lower cost per token. AI may still run straight into Jevons paradox: cheaper tokens make people use models for work they previously would not spend compute on. Cheap inference does not automatically reduce total compute demand. It may unlock a much larger task space.

Over the next five years, scarcity migrates from "who has chips" to "where can chips be powered, cooled, kept busy, and paid back through real work".

## Where the Red Light Moves

The Bottleneck Migration Network is useful because it keeps the research question narrow. Do not label every AI supplier as a winner. Track the red light.

The first red light is power-ready land and interconnection certainty. Land that can deliver 300MW-plus of firm power in 24 to 36 months is worth far more than ordinary land. The asset is not dirt. It is interconnection certainty, utility coordination, and local execution.

The second red light is electrical equipment and high-voltage work. Transformers, switchgear, UPS, busway, cables, substations, and transmission contractors are close to the current physical constraint. GPUs iterate quickly. Substations do not iterate through product launches.

The third red light is EPC, labor, and commissioning. A GW campus is hard because electrical work, cooling, fire systems, structure, networking, and rack deployment have to share one schedule. If any trade is unavailable, no token capacity appears at the end.

The fourth red light is high-density cooling and low-voltage distribution. As rack density rises, CDUs, cold plates, pumps, fittings, leak detection, busbars, and power shelves become small but hard constraints.

The fifth red light returns to AI hardware. GPUs, ASICs, HBM, CoWoS, networking, optics, and storage still hold large profit pools. The market is already good at pricing those assets. The next excess return is more likely to come from the D3/D4 node that quietly gets narrow again.

The sixth red light is operations and utilization. As projects come online, the next toll booth becomes successful work per watt. This may not show up in financials as "scheduling". It will show up as gross margin, capex intensity, lease obligations, and free cash flow.

Here is the counterintuitive part: the farther upstream the data center supplier sits, the less fluent it usually is in AI storytelling; the less it talks about AI, the more likely it may be a real constraint. A transformer supplier does not need to say AGI every day. Without it, the AGI rack cannot connect to power. A transmission contractor does not appear in model launch videos. Without it, 10GW is a number in a PDF.

## The Next Toll Booth

The Ohio 8 IT-GW project matters because it exposes the true shape of AI infrastructure. Model companies, chip companies, energy companies, utilities, DOE, local communities, and capital markets are all in the same project.

Software scales with a deploy. AI scales by securing land, power, equipment, permits, labor, financing, and then putting millions of accelerators into a system that does not overheat, lose power, or sit idle.

For the last two years, the market asked who had GPUs. The better question for the next few years is: who can turn GW into tokens, and who can only put GW into a press release?

The next toll booth is not in the hottest narrative. It is in the slowest delivery chain.

## Sources

- [OpenAI: OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [NVIDIA: PORTS-Pike Technology Campus press release](https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute)
- [U.S. DOE: PORTS-Pike energy access fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [OpenAI: Stargate advances with Oracle](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)
- [OpenAI: five new Stargate sites](https://openai.com/index/five-new-stargate-sites/)
- [OpenAI: Stargate Community](https://openai.com/index/stargate-community/)
- [IEA: Energy and AI executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)
- [IEA: Energy demand from AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai)
- [DOE / LBNL: 2024 U.S. data center energy use](https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers)
- [McKinsey: AI power and data center capacity](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/ai-power-expanding-data-center-capacity-to-meet-growing-demand)
- [McKinsey: The future of AI workloads](https://www.mckinsey.com/featured-insights/charts/the-future-of-ai-workloads)
- [JLL: 2026 Global Data Center Outlook](https://www.jll.com/en-sea/insights/market-outlook/data-center-outlook)
- [CBRE: North America Data Center Trends H1 2025](https://www.cbre.com/insights/reports/north-america-data-center-trends-h1-2025)
- [LBNL: Queued Up interconnection queue data](https://emp.lbl.gov/queues)
- [Grid Strategies: Power Demand Forecasts Revised Up](https://gridstrategiesllc.com/wp-content/uploads/Grid-Strategies-National-Load-Growth-Report-2025.pdf)
- [Brookfield / Microsoft renewable framework](https://bep.brookfield.com/generation/pdf/document-file.pdf?path=%2Fpress-releases%2Fbep%2Fbrookfield-and-microsoft-collaborating-deliver-over-105-gw-new-renewable-power)
- [Constellation / Microsoft Crane Clean Energy Center](https://www.constellationenergy.com/news/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html)
- [Talen / Amazon nuclear PPA](https://ir.talenenergy.com/news-releases/news-release-details/talen-energy-expands-nuclear-energy-relationship-amazon/)
- [Meta nuclear energy projects](https://about.fb.com/news/2026/01/meta-nuclear-energy-projects-power-american-ai-leadership/)
- [Google / Kairos Power nuclear agreement](https://blog.google/company-news/outreach-and-initiatives/sustainability/google-kairos-power-nuclear-energy-agreement/)
- [Brookfield / Google hydro framework](https://bam.brookfield.com/press-releases/brookfield-and-google-sign-hydro-framework-agreement-deliver-3000-mw-homegrown)
- [NVIDIA DGX GB rack hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html)
