---
title: "Why Is a Data Center Schedule Measured in MW?"
date: 2026-08-23 00:45:00
lang: en
i18n_key: data-center-delivery-cycle
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

[OpenAI's July 2025 update on Abilene](https://openai.com/index/stargate-advances-with-partnership-with-oracle/) put two seemingly conflicting states in the same paragraph: construction at Stargate I was still progressing, yet parts of the facility were already running training and inference workloads.

By June 2026, [Oracle said 42% of the campus's total capacity had been delivered](https://www.oracle.com/data-centers/), with the rest scheduled for subsequent quarters. Was Abilene under construction, delivered, or operational?

All three answers could be correct. The problem was the question. A data center campus does not have one project-wide state.

<!-- more -->

## Why can one campus be under construction and operating at once?

Abilene is not one building filled with GPUs. The campus spans eight buildings, 1,100 acres, and roughly four million square feet. Phase one began with two buildings and more than 200 MW, targeting energization in the first half of 2025. Phase two added six buildings and raised planned capacity to 1.2 GW. When [Crusoe announced construction of the second phase in March 2025](https://www.crusoe.ai/resources/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts), phase one was still moving toward energization.

A gigawatt-scale campus is divided into phases, buildings, and data halls. Each delivery unit moves independently through site control, design, permitting, construction, energization, commissioning, and Ready for Service (RFS). The first data hall can be open for tenant installation while foundations are still being poured next door. Phase one can run workloads while phase two is still receiving substation and cooling equipment.

A campus therefore has no single state. **State belongs to a specific block of megawatts, not to the campus name.**

![The data center delivery states from site selection to RFS](/images/data-center-delivery-state-machine.en.svg)

Announced sits outside the delivery chain. An announcement is a disclosure event, not an engineering gate. A project may be announced after site control, after a contract is signed, after construction begins, or even after partial energization. The press-release date alone does not locate capacity on the delivery path.

The lower chain contains the states that actually move through time. Site control means the project can use the land. Development turns design, permits, power, and construction plans into an executable package. Construction installs the civil, structural, and MEP scope. Energized means power has reached the agreed boundary. Commissioning then validates components, systems, and failure scenarios. At RFS, the contracted IT load for that phase has reached the facility handoff condition.

This line stops at the facility. GPU, network, storage, and software deployment still sit beyond RFS and should not be counted early.

## Why isn't "announced" a project state?

OpenAI's 2025 [Stargate site RFP](https://cdn.openai.com/sg/stargate-request-for-proposal-rfp.pdf) shows how different the starting points can be before an announcement. A proposed "Project" could contain only land and power, or it could also include site and shell design plus fit-out. Projects reaching OpenAI therefore did not all sit at the same gate.

OpenAI required each proposal to separate power available in 2027 and 2028 from projected IT workload availability in the first quarter of 2028. It also asked for data-hall-level timelines covering permitting, civil work, structures, equipment, commissioning, IT provisioning, and handoff. Power availability and workload availability had different dates because power arriving first does not make compute arrive with it.

Selection confirms that a customer chose a site and partners. It does not prove permitting is complete, equipment is ordered, or a facility is deliverable. Planned capacity describes the destination after every phase is built. Under construction is closer, but still spans everything from early earthwork to the period before integrated testing. Collapse those states into one word such as "live," and the timing information disappears.

## Who determines each MW tranche's delivery date?

Put one data hall under a program director and the first control document will not be a left-to-right construction flowchart. It will be an integrated master schedule. Land, permits, power, design, equipment, civil works, water, fiber, commissioning, and customer IT each run on their own timeline. Any one of them can move RFS.

The dependency map also extends far beyond a developer and a contractor. The owner defines capacity, budget, delivery units, and acceptance criteria. Utilities, transmission providers, and public authorities control power and permits. Architects, engineers, EPCs, general contractors, and OEMs turn design into a facility. Water and fiber providers, the commissioning authority, and the customer's IT team close the external interfaces, system validation, and equipment deployment.

Those parties do not report through one organization. They meet at milestones. The program director manages the interfaces: who must deliver what by which date, which design decision releases an equipment order, which delay consumes schedule float, and which failed acceptance blocks the next phase.

![Parallel plan from data center development to RFS](/images/data-center-delivery-gantt.en.svg)

Abilene has not published its integrated master schedule, and this figure does not invent one. It assigns no calendar duration. It only maps the dependencies visible in OpenAI's RFP and public engineering boundaries: which workstreams can overlap and which milestones must arrive first.

Site due diligence, the utility study, concept design, permitting strategy, water, and fiber can begin in parallel. Once the basis of design is stable, long-lead capacity can be reserved before detailed design is complete. External transmission work, campus construction, and equipment manufacturing continue side by side. Commissioning does not wait until the building is finished; it begins with design reviews, submittal reviews, and factory acceptance.

Parallel work still has hard boundaries. Without site control, permitting and interconnection have no stable project. Without a frozen critical design package, long-lead equipment cannot be finalized. Without building dry-in and delivered equipment, MEP installation cannot close. Permanent power requires both utility work and the site's high-voltage system. Integrated systems testing has nothing to test until electrical and cooling systems complete startup and functional testing. If the final failure scenarios do not pass, RFS cannot be pulled forward by compressing the calendar.

A campus date can fit in a press release. Project control has to land on each building, each tranche of MW, and each dependent party. That is why OpenAI's RFP asks for permitting, civil, structural, equipment, commissioning, IT provisioning, and handover milestones for every data hall.

## Why do timelines split after construction starts?

Abilene makes that branching visible. Crusoe started phase-one construction in June 2024. By March 2025, work had begun on the six buildings in phase two. One month later, [the core and priority areas of the first data hall were handed to the tenant](https://crusoe.ai/pdfs/Crusoe_Impact_Report_2024.pdf). Oracle began delivering the first GB200 racks in June. [OpenAI ran early workloads in July](https://openai.com/index/stargate-advances-with-partnership-with-oracle/) while construction continued.

![Abilene's overlapping construction and delivery timeline](/images/abilene-phased-delivery-timeline.en.svg)

This was not one improbably compressed line. It was several overlapping lines. Phase one moved from its June 2024 groundbreaking to early workloads in July 2025 in roughly 13 months, while phase two began before phase one was handed over. Workloads came online while the rest of the campus was still being replicated.

Oracle's June 2026 update disclosed only that 42% had been `delivered`. It did not identify the governing contract, say whether delivered meant RFS, or distribute the remaining 58% across construction, energized, and commissioning. The ratio proves delivery happens by phase; it does not supply a missing state for every block of megawatts.

"Abilene is operational" and "Abilene is still under construction" were both accurate. The first statement referred to delivered phases; the second referred to the campus. The comparable unit is not the project name. It is the number of megawatts sitting in construction, energized, commissioning, and RFS within each phase.

## Why isn't energization facility delivery?

Energization is easy to mistake for the finish line because power is already scarce in the data center market. It proves that an electrical boundary is live. It does not prove the entire distribution path, thermal path, and control system can sustain design load and survive failure scenarios.

Abilene's initial phase targeted more than 200 MW of energization in the first half of 2025. Once power arrived, GB200 racks could enter and begin turning up. Construction, equipment startup, and commissioning could still continue at the same time. The gap between Energized and RFS still contains transformers, switchgear, UPS systems, busways, cooling equipment, and integrated systems testing.

Abilene's customer contract is not public. A different 2026 [40 MW colocation agreement between Digi Power X and Cerebras](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm) makes the same kind of boundary concrete. Phase 1 covers 15 MW. The additional 25 MW in Phase 2 becomes binding only after financing is secured and the customer approves it in writing. Each effective phase grants the customer Early Access six weeks before the target delivery date to install cabling and IT equipment.

The operator provides temporary power for staging and initial energization. No colocation fee, monthly recurring charge, or other recurring fee accrues during that period; if the customer energizes equipment, it pays only for actual power consumed.

Early Access can look remarkably similar to "the data center is usable," yet the contract explicitly says it does not constitute RFS acceptance. Having power, entering the hall, and installing racks remain three different facts.

## Why does RFS start billing?

The same agreement defines RFS as the point at which the applicable phase has been constructed, commissioned, and tested, with contracted IT load available to energize customer equipment and every RFS checklist requirement met. The operator's RFS Notice must include a commissioning report from the engineer of record, and the customer can inspect the phase and identify material deficiencies.

![How RFS changes the fee state of a data center contract](/images/data-center-rfs-contract-gates.en.svg)

Crossing that gate establishes the Phase Commencement Date. The per-kilowatt colocation fee begins, and each phase starts its own annual escalation clock. If the operator misses the RFS trigger date, Daily RFS Credits accrue with the delay.

Digi Power X later disclosed the contract's redacted price in its second-quarter 2026 Form 10-Q: $195 per kW per month on a take-or-pay basis, escalating 3% annually. Phase 1's 15 MW produces $2.925 million per month; Phase 2's additional 25 MW produces $4.875 million. At June 30, however, the facility remained under construction and was not ready for use. Phase 2 also remained conditional on adequate financing.

RFS is therefore more than a convenient project-reporting acronym. It switches construction spending, equipment installation, and commissioning into facility capacity that can generate recurring fees. For the customer, it turns future capacity into a deliverable on which IT deployment can continue.

RFS still does not equal available compute. The contract requires the IT load to be available for customer equipment. It does not require tens of thousands of GPUs to have passed fabric validation and cluster acceptance. The facility operator finishes here; the compute provider still has to reach Production Handoff.

## Why does the same MW appear on different ledgers?

Project states matter because each gate moves a different order or cash flow.

For equipment vendors and contractors, design freeze, purchase order, factory acceptance, delivery, installation, and commissioning can each be a commercial milestone. For the facility operator, a signed contract does not mean recurring revenue has commenced. In the public 40 MW agreement above, the per-kilowatt colocation fee starts only after each phase crosses RFS.

The same capacity is secured supply to the customer, uncommenced backlog to the operator, and potentially an active production or delivery order to a transformer or cooling supplier. Who receives an order first, who waits for RFS to charge recurring fees, and who owes delay credits depends on the gate the contract uses for payment, acceptance, and default.

That turns the Replication Gap from "data centers take a long time" into a measurable ledger: announced megawatts, megawatts in construction, energized megawatts, and megawatts across RFS. The more capacity that accumulates between two gates, and the longer it stays there, the more likely the binding constraint sits in that interval.

## How much of the 40 MW contract is priced in?

The same contract puts delivery state and market value on one ledger. Digi Power X had 101.4 million common shares outstanding on August 14, 2026, plus roughly 7.1 million options, RSUs, and warrants. At the August 21 close of $4.07, fully diluted equity value was approximately $441.5 million.

At June 30, the company held $128.1 million of cash and $14.3 million of digital currencies against $14.5 million of total liabilities. Subtracting cash and digital currencies from fully diluted equity value, then adding total liabilities, gives a simplified operating value of about $313.6 million. This is not standard enterprise value. It removes the unusually large pool of liquid assets to show what the market is assigning to existing operations and future projects together.

![Digi Power X RFS Price-In Scenarios](/images/dgxx-rfs-price-in.en.svg)

If only the 15 MW Phase 1 reaches RFS on schedule, its first-year colocation fee is $35.1 million and simplified operating value is 8.9 times that revenue. At the full 40 MW, first-year fees rise to $93.6 million and the multiple falls to 3.4 times. The headline contract value is $1.1 billion, but it arrives monthly over ten years. Comparing that ten-year figure directly with today's equity value collapses revenue, margin, capex, and time value into one number.

The scenarios can bound price-in but cannot produce a single answer. Digi Power X generated only $6.6 million of total revenue in the second quarter and reported a $5.5 million gross loss. The steady-state margin on the 40 MW has not been demonstrated. Common shares rose from 69.4 million at year-end 2025 to 98.5 million at June 30, followed by another 2.85 million shares issued through the ATM program. Phase 2 financing, actual construction cost, and further dilution determine how much value remains per share.

The current price therefore cannot be explained by saying the market has not seen the 40 MW contract. The contract is visible, and the market assigns some value to Phase 1 reaching RFS and Phase 2 eventually following. **What remains unproven is whether 40 MW can become recurring revenue with stable gross margin without consuming more cash and per-share ownership along the way.**

Four events would falsify that path: Phase 1 misses its December 15, 2026 RFS target; Phase 2 financing moves farther out; fully diluted share count grows faster than delivered MW; or gross margin remains negative after colocation fees begin.

## How many delivery dates does 8 GW have?

Return to PORTS-Pike in {% post_link ai-data-center-alpha-map.en 'Why Is OpenAI Always Short on Compute?' %}. Its 8 IT-GW is the final planned campus capacity, not a master switch that flips on one day in 2032. [The first 800 MW is expected to become available in 2028](https://openai.com/index/openai-joins-ports-pike-project/). Later phases require new generation, transmission lines, and supporting infrastructure before the six-year buildout can reach its endpoint.

The 8 GW belongs in a phase ledger: land controlled, power plan, construction start, energization, commissioning completion, and RFS Notice. Only megawatts that cross the last column qualify as facility supply.

Apply the same ledger to any data center and the first question is no longer "Is the project finished?" It is which block of megawatts has reached which gate, and what evidence proves it. Once state is attached to phase, 8 GW stops being one large number waiting to arrive. It becomes a delivery ledger in which megawatts cross gates one phase at a time.

Abilene can be under construction, delivered, and operational without those labels contradicting one another. Each state belongs to a different phase, data hall, and block of MW. The project has one name, while every capacity tranche has its own energization, RFS, billing, and Production Handoff dates.

A data center therefore does not have one delivery date. It has an MW ledger that keeps moving to the right.

## Sources

- [OpenAI, Stargate Advances with Oracle Partnership](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)
- [OpenAI, Stargate Request for Proposal](https://cdn.openai.com/sg/stargate-request-for-proposal-rfp.pdf)
- [OpenAI, OpenAI Joins PORTS-Pike Project](https://openai.com/index/openai-joins-ports-pike-project/)
- [Oracle, Data Centers](https://www.oracle.com/data-centers/)
- [Crusoe, Abilene Campus Expansion](https://www.crusoe.ai/resources/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts)
- [Crusoe, 2024 Impact Report](https://crusoe.ai/pdfs/Crusoe_Impact_Report_2024.pdf)
- [Digi Power X and Cerebras, Colocation Agreement](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm)
- [Digi Power X, Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1854368/000121390026089940/ea0301731-10q_digipower.htm)
- [Yahoo Finance, DGXX Historical Prices](https://finance.yahoo.co.jp/quote/DGXX/history)
