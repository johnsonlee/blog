---
title: After 8 IT-GW Stop Chasing the Red Light
date: 2026-08-22 04:34:27
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

I read the PORTS-Pike announcement twice. The first pass was for the number: 8 IT-GW, at least 10GW of new generation, $4.2 billion of regional grid infrastructure, and NVIDIA credit support for the first 4.25 IT-GW. The second pass was for the dates: the first 800MW expected in 2028, full buildout running to 2032. The 8 gets attention. The dates hurt more. Saying power, transformers, liquid cooling, and powered land are tight no longer adds much. The red lights are already on the screen, and many are already in the price. The better question is: as those red lights expand, which unpriced yellow light do they turn on next?

<!-- more -->

The previous post introduced the Bottleneck Migration Network. The point was to track how replication gaps spread. D0 is the root demand, D1 is the subsystem, D2 is the route, D3 is equipment, process, and qualification, and D4 is the underlying physical capacity. When a node turns red, the research has only started. Expansion consumes new equipment, materials, labor, permits, testing, and capital. The next yellow light usually hides there.

Data centers are the best field test for this framework. AI demand is starting to arrive at software speed. Data center capacity still replicates at power-engineering speed.

```text
Replication gap = time needed to replicate supply - time needed for demand to arrive
```

The AI infrastructure question has widened from GPU scarcity to a harsher conversion problem: how much headline GW leaks away before it becomes tokens in a customer's hands?

## A data center starts as a delivery calendar

Put yourself in the PORTS-Pike project room. The customer has signed. The chip supplier is at the table. The local government wants jobs. The utility has to model load. DOE cares about energy access and the community. The developer needs financing. EPC teams need labor. NVIDIA needs racks to land. OpenAI wants to know when the first workload can run.

"What is a data center made of?" turns into a delivery-calendar question in that room. If any line slips by three months, the final product does not become billable token capacity on time.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 620" role="img" aria-labelledby="delivery-calendar-title-en" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="delivery-calendar-title-en">Delivery calendar from contracted GW to billable tokens</title>
  <defs>
    <marker id="cal-arrow-en" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="618" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="36" y="45" font-size="24" font-weight="700" fill="#111827">An AI data center is not a building. It is five deadlines converging.</text>
    <text x="36" y="75" font-size="14" fill="#64748b">After D0 demand is signed, D1-D4 replication consumes grid, equipment, construction, rack fabric, and operating capacity</text>

    <g font-size="12" fill="#64748b" text-anchor="middle">
      <line x1="170" y1="108" x2="900" y2="108" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="170" y="98">2026</text>
      <text x="316" y="98">2027</text>
      <text x="462" y="98">2028</text>
      <text x="608" y="98">2029</text>
      <text x="754" y="98">2030</text>
      <text x="900" y="98">2032</text>
      <circle cx="170" cy="108" r="4" fill="#64748b"/>
      <circle cx="316" cy="108" r="4" fill="#64748b"/>
      <circle cx="462" cy="108" r="4" fill="#64748b"/>
      <circle cx="608" cy="108" r="4" fill="#64748b"/>
      <circle cx="754" cy="108" r="4" fill="#64748b"/>
      <circle cx="900" cy="108" r="4" fill="#64748b"/>
    </g>

    <g font-size="13" font-weight="700">
      <text x="38" y="154" fill="#0f172a">D0 demand</text>
      <text x="38" y="232" fill="#0f172a">D1 power path</text>
      <text x="38" y="312" fill="#0f172a">D1 facility path</text>
      <text x="38" y="392" fill="#0f172a">D1 cluster path</text>
      <text x="38" y="472" fill="#0f172a">D1 revenue path</text>
    </g>

    <g font-size="13" text-anchor="middle">
      <rect x="150" y="128" width="184" height="44" rx="7" fill="#111827"/>
      <text x="242" y="155" fill="#ffffff" font-weight="700">20-year lease / IT-GW</text>
      <rect x="360" y="128" width="170" height="44" rx="7" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="445" y="155" fill="#075985" font-weight="700">first 800MW target</text>
      <rect x="680" y="128" width="214" height="44" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="787" y="155" fill="#166534" font-weight="700">phased campus delivery</text>

      <rect x="146" y="204" width="138" height="54" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="215" y="228" fill="#991b1b" font-weight="700">site + utility</text>
      <text x="215" y="248" fill="#991b1b" font-size="12">AEP / RTO / local</text>
      <rect x="312" y="204" width="138" height="54" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="381" y="228" fill="#9a3412" font-weight="700">generation</text>
      <text x="381" y="248" fill="#9a3412" font-size="12">gas / nuclear / PPA</text>
      <rect x="478" y="204" width="160" height="54" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="558" y="228" fill="#991b1b" font-weight="700">substation + grid</text>
      <text x="558" y="248" fill="#991b1b" font-size="12">transformer / switchgear</text>
      <rect x="666" y="204" width="158" height="54" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="745" y="228" fill="#92400e" font-weight="700">firm power rights</text>
      <text x="745" y="248" fill="#92400e" font-size="12">curtailment / dispatch</text>

      <rect x="146" y="284" width="138" height="54" rx="7" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="215" y="308" fill="#075985" font-weight="700">land + shell</text>
      <text x="215" y="328" fill="#075985" font-size="12">developer / EPC</text>
      <rect x="312" y="284" width="150" height="54" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="387" y="308" fill="#92400e" font-weight="700">MEP modules</text>
      <text x="387" y="328" fill="#92400e" font-size="12">UPS / busway / fire</text>
      <rect x="490" y="284" width="150" height="54" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="565" y="308" fill="#92400e" font-weight="700">cooling loop</text>
      <text x="565" y="328" fill="#92400e" font-size="12">CDU / pump / service</text>
      <rect x="668" y="284" width="150" height="54" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="743" y="308" fill="#5b21b6" font-weight="700">commissioning</text>
      <text x="743" y="328" fill="#5b21b6" font-size="12">accepted MW/month</text>

      <rect x="146" y="364" width="138" height="54" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="215" y="388" fill="#5b21b6" font-weight="700">GPU / ASIC</text>
      <text x="215" y="408" fill="#5b21b6" font-size="12">NVIDIA / AMD / custom</text>
      <rect x="312" y="364" width="138" height="54" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="381" y="388" fill="#5b21b6" font-weight="700">HBM / package</text>
      <text x="381" y="408" fill="#5b21b6" font-size="12">TSMC / memory</text>
      <rect x="478" y="364" width="138" height="54" rx="7" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
      <text x="547" y="388" fill="#155e75" font-weight="700">network</text>
      <text x="547" y="408" fill="#155e75" font-size="12">switch / optics / DCI</text>
      <rect x="644" y="364" width="160" height="54" rx="7" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
      <text x="724" y="388" fill="#155e75" font-weight="700">rack integration</text>
      <text x="724" y="408" fill="#155e75" font-size="12">firmware / burn-in / yield</text>

      <rect x="146" y="444" width="138" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="215" y="468" fill="#166534" font-weight="700">scheduler</text>
      <text x="215" y="488" fill="#166534" font-size="12">routing / batching</text>
      <rect x="312" y="444" width="150" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="387" y="468" fill="#166534" font-weight="700">SRE capacity</text>
      <text x="387" y="488" fill="#166534" font-size="12">failure / repair / spares</text>
      <rect x="490" y="444" width="150" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="565" y="468" fill="#166534" font-weight="700">paid workload</text>
      <text x="565" y="488" fill="#166534" font-size="12">tasks / MW / margin</text>
      <rect x="668" y="444" width="150" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="743" y="468" fill="#166534" font-weight="700">token capacity</text>
      <text x="743" y="488" fill="#166534" font-size="12">usable and billable</text>
    </g>

    <g stroke="#64748b" stroke-width="1.7" fill="none" marker-end="url(#cal-arrow-en)">
      <path d="M334 150 H360"/>
      <path d="M530 150 C590 150 620 150 680 150"/>
      <path d="M284 231 H312"/>
      <path d="M450 231 H478"/>
      <path d="M638 231 H666"/>
      <path d="M284 311 H312"/>
      <path d="M462 311 H490"/>
      <path d="M640 311 H668"/>
      <path d="M284 391 H312"/>
      <path d="M450 391 H478"/>
      <path d="M616 391 H644"/>
      <path d="M284 471 H312"/>
      <path d="M462 471 H490"/>
      <path d="M640 471 H668"/>
    </g>

    <g font-size="12">
      <rect x="38" y="542" width="880" height="44" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="60" y="568" fill="#334155">Players: hyperscaler / neocloud / developer / utility / RTO / generation / electrical OEM / EPC / cooling / chip / memory / network / SRE</text>
    </g>
  </g>
</svg>

The least appreciated work sits near the end: commissioning and the revenue path. Markets count orders and backlog. AI data center supply only exists after commissioning. If a 1GW campus ramps acceptance at 60MW per month instead of 100MW, the press release still says 1GW, but the customer's usable compute has already changed.

That is why the supply chain has to be split one layer deeper. OpenAI, Microsoft, Amazon, Google, Meta, Oracle, CoreWeave, and Crusoe open demand and capital. Equinix, Digital Realty, QTS, CyrusOne, and developers deliver facilities. Constellation, Talen, Vistra, Brookfield, AEP, Dominion, PJM, and ERCOT shape the power path. Schneider, Eaton, ABB, Siemens, Vertiv, GE Vernova, Quanta, DPR, and Turner sit on electrical and engineering delivery. NVIDIA, AMD, Broadcom, Marvell, Arista, Cisco, TSMC, SK hynix, Micron, and Samsung fill the cluster.

The list itself does not create alpha. Delivery yield does. Whoever turns 1GW of headline capacity into 850MW of accepted, operating, billable capacity is the one really charging rent inside the data center.

## Public GW pays a haircut tax first

There are enough public GW numbers now to break a spreadsheet. OpenAI's Stargate has talked about nearly 7GW of planned capacity and a 10GW commitment. PORTS-Pike alone names roughly 8 IT-GW. Microsoft, Meta, Amazon, and Google also have 500MW, 835MW, 1.9GW, 3GW, 6.6GW, and 10.5GW energy figures floating around.

Putting them into one column is dangerous. IT-GW, planned AI capacity, PPA, generation capacity, nuclear development rights, and clean attributes are different units. They all prove hyperscalers are grabbing energy. Only part of that turns into usable AI compute before 2030.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 650" role="img" aria-labelledby="gw-haircut-title-en" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="gw-haircut-title-en">The haircut tax on public GW</title>
  <defs>
    <marker id="haircut-arrow-en" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="648" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="38" y="46" font-size="24" font-weight="700" fill="#111827">Headline GW needs a haircut before it becomes compute</text>
    <text x="38" y="76" font-size="14" fill="#64748b">Before 2030, the farther a number sits from IT load, the heavier the discount to usable AI compute</text>

    <g text-anchor="middle" font-size="13">
      <rect x="54" y="116" width="206" height="74" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="157" y="145" fill="#991b1b" font-weight="700">IT-GW lease</text>
      <text x="157" y="166" fill="#991b1b">schedule haircut</text>
      <text x="157" y="184" fill="#991b1b" font-size="12">2030 usable: 60-75%</text>

      <rect x="54" y="220" width="206" height="74" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="157" y="249" fill="#1e3a8a" font-weight="700">planned AI capacity</text>
      <text x="157" y="270" fill="#1e3a8a">site and power haircut</text>
      <text x="157" y="288" fill="#1e3a8a" font-size="12">2030 usable: 35-55%</text>

      <rect x="54" y="324" width="206" height="74" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="157" y="353" fill="#92400e" font-weight="700">PPA / generation GW</text>
      <text x="157" y="374" fill="#92400e">local delivery haircut</text>
      <text x="157" y="392" fill="#92400e" font-size="12">2030 usable: 5-20%</text>

      <rect x="54" y="428" width="206" height="74" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="157" y="457" fill="#166534" font-weight="700">future nuclear / CFE</text>
      <text x="157" y="478" fill="#166534">timing haircut</text>
      <text x="157" y="496" fill="#166534" font-size="12">mostly option value before 2030</text>
    </g>

    <g stroke="#64748b" stroke-width="1.8" fill="none" marker-end="url(#haircut-arrow-en)">
      <path d="M260 153 C318 153 318 190 370 190"/>
      <path d="M260 257 C318 257 318 230 370 230"/>
      <path d="M260 361 C318 361 318 272 370 272"/>
      <path d="M260 465 C318 465 318 318 370 318"/>
    </g>

    <g text-anchor="middle">
      <path d="M370 150 H860 L800 245 H430 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="615" y="190" font-size="20" fill="#0f172a" font-weight="700">commissioned IT load</text>
      <text x="615" y="216" font-size="13" fill="#334155">PUE / redundancy / substation / MEP / cooling / commissioning</text>

      <path d="M430 275 H800 L746 370 H484 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="615" y="316" font-size="20" fill="#0f172a" font-weight="700">AI-ready cluster</text>
      <text x="615" y="342" font-size="13" fill="#334155">GPU / HBM / network / storage / rack integration</text>

      <path d="M484 400 H746 L706 490 H524 Z" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="615" y="438" font-size="20" fill="#0f172a" font-weight="700">billable token capacity</text>
      <text x="615" y="464" font-size="13" fill="#334155">scheduler utilization / failure rate / paid task conversion</text>
    </g>

    <g font-size="14">
      <rect x="92" y="552" width="796" height="54" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="116" y="584" fill="#0f172a" font-weight="700">Effective GW = headline GW x unit fit x delivery yield x AI-ready fit-out x utilization yield</text>
    </g>
  </g>
</svg>

My rough haircuts look like this: for a direct IT-GW lease, I would give 60-75% 2030 usability depending on the project schedule; for planned AI capacity, 35-55%; for PPA and generation GW, only 5-20%, because they solve energy sourcing without guaranteeing local IT load; for nuclear and CFE frameworks that mainly arrive after 2030, I would treat them as option value.

Guardrail first; forecast second. The haircut keeps headline GW in the right bucket. OpenAI / Oracle's additional 4.5GW and Stargate's nearly 7GW planned capacity belong in the in-progress AI capacity bucket. PORTS-Pike's 8 IT-GW is the hardest unit, but full delivery runs to 2032. Microsoft / Brookfield's 10.5GW renewable framework, Meta's up to 6.6GW nuclear portfolio, and Google / Brookfield's up to 3GW hydro framework belong in the energy and carbon-matching bucket. They cannot be added straight to AI IT load.

Demand anchors are colder. IEA estimates global data center electricity use rising from 415TWh in 2024 to 945TWh in 2030, or roughly 60GW of incremental average facility load. McKinsey, using a capacity lens, puts 2030 global data center demand at 171-219GW, with a 298GW high case. JLL expects 97GW of additions from 2025 to 2030 and roughly 200GW of global capacity by 2030.

Those units should not be subtracted with fake precision, but they are useful for a pressure test. If JLL's 97GW of new supply gets through commissioning at 80% and AI-ready fit-out at 80%, the effective new addition is only about 62GW. McKinsey's demand increase is 111-159GW. That leaves a gap measured in tens of GW, possibly close to 100GW. Model efficiency and workload mix pull the number down. Agent adoption pushes it back up.

I would split the 2030 gap into three cases:

| Scenario | Demand assumption | Supply haircut | Usable compute gap around 2030 |
| --- | --- | --- | --- |
| Slow Agent | Agent reliability ramps slowly; inference follows the base path | Few project delays; AI-ready fit-out mostly works | 20-35GW |
| Base | Coding, office, and support move into Agent workflows | 15-25% of capacity gets stuck in grid, equipment, acceptance, and utilization friction | 40-70GW |
| Agent upside | Long context, tool calls, background work, and parallel workers become normal | Supply accelerates, but local grids and commissioning cap conversion yield | 80GW+ |

The gap itself does not automatically create alpha. The market already knows data centers need power. It already knows GEV, VRT, ETN, major memory, and CPO matter. The more useful inference is what those known red lights create as they expand.

## The next yellow light hides in delivery yield

Once a red light is priced in, it should stop being the conclusion. It becomes the starting point.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 660" role="img" aria-labelledby="next-yellow-title-en" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="next-yellow-title-en">Where known red lights create the next yellow lights</title>
  <rect x="1" y="1" width="978" height="658" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="38" y="46" font-size="24" font-weight="700" fill="#111827">Visible red lights are late work. The yellow lights matter now.</text>
    <text x="38" y="76" font-size="14" fill="#64748b">Known bottlenecks consume more specific capacity that is harder to put into a simple AI story</text>

    <g font-size="13" font-weight="700" text-anchor="middle">
      <rect x="36" y="108" width="190" height="38" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="131" y="133" fill="#991b1b">known red light</text>
      <rect x="262" y="108" width="190" height="38" rx="7" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="357" y="133" fill="#334155">market story</text>
      <rect x="488" y="108" width="220" height="38" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="598" y="133" fill="#92400e">next inference</text>
      <rect x="744" y="108" width="190" height="38" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="839" y="133" fill="#166534">watch metric</text>
    </g>

    <g font-size="12" text-anchor="middle">
      <rect x="36" y="170" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="196" fill="#991b1b" font-weight="700">transformer / switchgear</text>
      <text x="131" y="216" fill="#991b1b">electrical equipment tight</text>
      <rect x="262" y="170" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="196" fill="#334155">orders and backlog</text>
      <text x="357" y="216" fill="#334155">lead times stretch</text>
      <rect x="488" y="170" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="196" fill="#92400e" font-weight="700">modular electrical rooms</text>
      <text x="598" y="216" fill="#92400e">protection / FAT / commissioning</text>
      <rect x="744" y="170" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="196" fill="#166534" font-weight="700">accepted MW/month</text>
      <text x="839" y="216" fill="#166534">acceptance ramp</text>

      <rect x="36" y="252" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="278" fill="#991b1b" font-weight="700">firm power / turbines</text>
      <text x="131" y="298" fill="#991b1b">power and grid tight</text>
      <rect x="262" y="252" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="278" fill="#334155">gas / PPA / nuclear</text>
      <text x="357" y="298" fill="#334155">everyone grabs slots</text>
      <rect x="488" y="252" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="278" fill="#92400e" font-weight="700">load flexibility</text>
      <text x="598" y="298" fill="#92400e">interruptible load / BESS / controls</text>
      <rect x="744" y="252" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="278" fill="#166534" font-weight="700">curtailment terms</text>
      <text x="839" y="298" fill="#166534">power price and dispatch rights</text>

      <rect x="36" y="334" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="360" fill="#991b1b" font-weight="700">liquid cooling hardware</text>
      <text x="131" y="380" fill="#991b1b">CDU / cold plates ramp</text>
      <rect x="262" y="334" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="360" fill="#334155">rack density</text>
      <text x="357" y="380" fill="#334155">100kW+ cabinets</text>
      <rect x="488" y="334" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="360" fill="#92400e" font-weight="700">cooling service loop</text>
      <text x="598" y="380" fill="#92400e">water / spares / leaks / repair windows</text>
      <rect x="744" y="334" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="360" fill="#166534" font-weight="700">uptime per MW</text>
      <text x="839" y="380" fill="#166534">downtime and spares turn</text>

      <rect x="36" y="416" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="442" fill="#991b1b" font-weight="700">GPU / HBM / CPO</text>
      <text x="131" y="462" fill="#991b1b">hardware story crowded</text>
      <rect x="262" y="416" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="442" fill="#334155">compute and bandwidth</text>
      <text x="357" y="462" fill="#334155">market prices it well</text>
      <rect x="488" y="416" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="442" fill="#92400e" font-weight="700">rack acceptance yield</text>
      <text x="598" y="462" fill="#92400e">burn-in / firmware / fabric stability</text>
      <rect x="744" y="416" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="442" fill="#166534" font-weight="700">usable cluster ratio</text>
      <text x="839" y="462" fill="#166534">schedulable GPU share</text>

      <rect x="36" y="498" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="524" fill="#991b1b" font-weight="700">Agent inference</text>
      <text x="131" y="544" fill="#991b1b">inference load grows</text>
      <rect x="262" y="498" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="524" fill="#334155">training campus</text>
      <text x="357" y="544" fill="#334155">remote GW story</text>
      <rect x="488" y="498" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="524" fill="#92400e" font-weight="700">metro powered capacity</text>
      <text x="598" y="544" fill="#92400e">DCI / peering / stateful routing</text>
      <rect x="744" y="498" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="524" fill="#166534" font-weight="700">latency-bound MW</text>
      <text x="839" y="544" fill="#166534">local inference capacity</text>

      <rect x="36" y="580" width="190" height="50" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="610" fill="#991b1b" font-weight="700">capex locked in</text>
      <rect x="262" y="580" width="190" height="50" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="610" fill="#334155">GW becomes depreciation</text>
      <rect x="488" y="580" width="220" height="50" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="610" fill="#92400e" font-weight="700">tasks per MW</text>
      <rect x="744" y="580" width="190" height="50" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="610" fill="#166534" font-weight="700">margin / capex intensity</text>
    </g>
  </g>
</svg>

I would look first at five directions that have not been talked to death.

The first is delivery yield. Markets like backlog, but from 2027 to 2030 the more important metric may be accepted MW per month. Electrical equipment, MEP modules, cooling loops, and rack fabric still have to pass FAT, SAT, protection settings, load-bank testing, integration, and burn-in. Sites often slow down at the organizational capacity to turn a pile of long-lead equipment into accepted capacity.

The second is load flexibility. Once an AI data center secures power, the utility will ask a sharper question: can this 500MW or 1GW load be interrupted, shifted, paired with BESS, fuel cells, gas units, and control systems? Training can move through time. Low-latency Agent inference cannot always move. The player that connects workload scheduling to power markets raises the value of the same power contract.

The third is the cooling service loop. Liquid-cooling hardware is already a hot story. The next layer is service and reliability. When 100kW-plus racks actually run, water quality, filtration, corrosion, fittings, spares, leak detection, repair windows, and field engineers determine uptime. Selling the hardware is the first dollar. Reducing downtime per MW is the second.

The fourth is metro inference capacity. Training can go to Ohio, Texas, or Arizona. Agent inference may not. Coding agents, office agents, support agents, and browser agents will create interactive latency requirements. Remote GW campuses solve training and background work. Smaller blocks of firm power near cities, DCI, peering, and stateful routing may become scarce.

The fifth is tasks per MW. Once GW sits on the balance sheet, the question shifts from power availability to paid work per watt. Agent retry rate, tool-call success, context cache, model routing, batching, and failure recovery all change the revenue density of the same data center. This bottleneck may live outside the building, inside scheduling and product economics.

These five directions share one trait: they fit poorly into a roadshow headline. They sit in the boring middle. That is exactly why the next leg of data-center alpha may hide there. Known red lights create specific delivery constraints before they create a bigger story.

## Agents push the gap toward inference location

Ordinary chat is a back-and-forth. An Agent workflow plans, retrieves, calls tools, reads files, writes code, runs tests, fixes failures, and verifies again. The user submits one task. Behind it there may be dozens of model calls. Add multimodal input, browser control, long context, and parallel workers, and token traffic can grow faster than users.

McKinsey's workload chart gives one anchor: global data center demand rises from 82.3GW in 2025 to 219GW in 2030; AI inference moves from 20.9GW to 93.3GW, roughly a 35% CAGR; AI training moves from 23.1GW to 62.2GW, roughly a 22% CAGR. OpenAI traffic already moves at consumer-software speed. In October 2025, Sam Altman said ChatGPT had 800 million weekly active users and the API was processing more than 6 billion tokens per minute.

Agents split demand into two buckets. Background work behaves more like training: it can queue, batch, and move to cheaper remote power. Interactive work behaves more like a trading system: it cares about latency, state, network path, and local capacity. The next five-year gap will not spread evenly across global data centers. It will split by workload.

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

Model efficiency will keep improving. Quantization, distillation, MoE, speculative decoding, KV cache improvements, and better schedulers will lower cost per token. AI may still run into Jevons paradox: once tokens get cheaper, people hand models work they previously would not automate. Efficiency pulls demand down. Product diffusion pushes it back up.

By 2030, if the gap lands at 20-35GW, the known red lights still explain much of the market. If it lands at 40-70GW, delivery yield, load flexibility, and the cooling service loop start to reprice. If Agent upside pushes the gap above 80GW, metro inference capacity and tasks per MW become more important constraints. At that point, the market moves from asking who has GW to which kind of GW can run which kind of task.

## Past the red light

Back to Ohio. The 8 IT-GW number is large, but the more useful thing to watch is how many MW get accepted each month before the first 800MW in 2028; how much headline GW turns into AI-ready clusters between 2028 and 2032; and how much of that then turns into paid tasks.

Known bottlenecks can still make money. That does not mean they still hold the most alpha. GPU, HBM, gas turbines, electrical equipment, and liquid cooling have already told a full story. The better question is where their expansion sends orders, risk, and margins next. Which layer turns press-release GW into paid-token GW?

The data center business may collapse into one final metric: **how much contracted power becomes work that customers are willing to pay for.**

The next light probably will not be in the place that tells the cleanest AI story.

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
