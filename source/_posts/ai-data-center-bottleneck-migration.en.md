---
title: "How Far Is 8 IT-GW from a Paid Task?"
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

I read the PORTS-Pike announcement twice. The first time, I remembered the 8 IT-GW. The second time, I kept looking at two dates: the first 800 MW is expected in 2028, and the six-year buildout runs through 2032.

Those 8 gigawatts still have to pass through generation, transmission, MEP, racks, commissioning, and scheduling before they show up on a customer's bill. Press releases count gigawatts. Revenue counts completed work. A long delivery chain sits between them.

<!-- more -->

## Six years inside one announcement

The Ohio campus is enormous. OpenAI has contracted for about 8 IT-GW. SB Energy plans to build 10 GW of new generation for the broader project, and the transmission investment with AEP Ohio is $4.2 billion. NVIDIA is investing in SB Energy and providing credit support for the land, power, and shell buildout behind the first 4.25 IT-GW.

One sentence in OpenAI's announcement matters more to me: **OpenAI starts paying only when completed capacity becomes available for lease.**

Picture the project meeting. The customer has signed. The chip supplier is at the table. The utility is scheduling load, the EPC is scheduling crews, vendors are promising delivery dates, and the site team still has to connect tens of thousands of parts. A three-month delay anywhere leaves the 8 IT-GW headline untouched. It moves the revenue date.

The 8 GW is better understood as a six-year delivery calendar. The number gets smaller every time the calendar turns a page.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 620" role="img" aria-labelledby="paid-task-funnel-title-en" style="max-width: 420px; width: 100%; height: auto; display: block; margin: 10px auto 18px;">
  <title id="paid-task-funnel-title-en">The five delivery stages between contracted IT load and paid tasks</title>
  <defs>
    <marker id="paid-task-arrow-en" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M1,1 L9,5 L1,9 Z" fill="#6b7280"/>
    </marker>
  </defs>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" text-anchor="middle">
    <rect x="46" y="20" width="328" height="82" rx="6" fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
    <text x="210" y="54" font-size="20" font-weight="700" fill="#111827">Contracted IT load</text>
    <text x="210" y="81" font-size="15" fill="#4b5563">press-release GW</text>

    <path d="M210 102 V132" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow-en)"/>
    <text x="278" y="122" font-size="13" fill="#6b7280">grid and delays</text>

    <rect x="58" y="140" width="304" height="82" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
    <text x="210" y="174" font-size="20" font-weight="700" fill="#111827">Power and MEP ready</text>
    <text x="210" y="201" font-size="15" fill="#4b5563">powered MW</text>

    <path d="M210 222 V252" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow-en)"/>
    <text x="284" y="242" font-size="13" fill="#6b7280">acceptance and yield</text>

    <rect x="72" y="260" width="276" height="82" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
    <text x="210" y="294" font-size="20" font-weight="700" fill="#111827">Cluster accepted</text>
    <text x="210" y="321" font-size="15" fill="#4b5563">accepted MW</text>

    <path d="M210 342 V372" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow-en)"/>
    <text x="276" y="362" font-size="13" fill="#6b7280">scheduler utilization</text>

    <rect x="86" y="380" width="248" height="82" rx="6" fill="#fff1f2" stroke="#f43f5e" stroke-width="2"/>
    <text x="210" y="414" font-size="20" font-weight="700" fill="#111827">Work enters queue</text>
    <text x="210" y="441" font-size="15" fill="#4b5563">utilized MW</text>

    <path d="M210 462 V492" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow-en)"/>
    <text x="278" y="482" font-size="13" fill="#6b7280">paid conversion</text>

    <rect x="100" y="500" width="220" height="82" rx="6" fill="#f0fdfa" stroke="#0f766e" stroke-width="2"/>
    <text x="210" y="534" font-size="20" font-weight="700" fill="#111827">Customer pays</text>
    <text x="210" y="561" font-size="15" fill="#4b5563">paid tasks</text>
  </g>
</svg>

I call the capacity that survives this chain **paid-task GW**. This is my own accounting shorthand, not an industry metric. Its only job is to keep the headline from doing the accounting for me:

```text
paid-task GW = contracted IT-GW
             × on-time delivery rate
             × cluster yield
             × scheduler utilization
             × paid conversion rate
```

The contract sets the starting point. The other four multipliers determine when a data center begins to earn revenue and how much it can earn.

## Excel adds the wrong gigawatts

Public markets are swimming in gigawatts. PORTS-Pike's 8 IT-GW, Stargate's nearly 7 GW of planned capacity, and the 10.5 GW Microsoft-Brookfield renewable framework all look like the same unit in a spreadsheet.

They do not carry the same economics. An IT-GW lease has a customer and a site. Planned capacity still needs projects behind it. A PPA or generation framework secures an energy source but does not deliver local IT load. Adding them together is like adding restaurant seats, kitchen power, and food purchasing limits, then calling the result tonight's dinner sales.

The demand is real. The IEA expects global data center electricity consumption to rise from 415 TWh in 2024 to 945 TWh in 2030. JLL expects global data center capacity to nearly double from 103 GW to 200 GW, adding about 97 GW over five years.

At this scale, a small error in definitions becomes tens of gigawatts. Every public number needs a few plain answers: Where is it? When is it usable? Who provides the generation and transmission? When does the customer start paying? What acceptance test turns the capacity on?

Without those answers, I leave the gigawatt in the lead column and keep it out of supply.

## A red light is only a starting point

GPUs, HBM, transformers, gas turbines, liquid cooling, and powered land are all constrained. Those red lights already appear in earnings calls and valuations. Proving their importance again does not create much new information.

When I wrote about the Bottleneck Migration Network, the useful question was what happens after a bottleneck starts expanding. Capital and orders flood into the red node. The attempt to copy supply consumes equipment, materials, permits, labor, testing, and service. The next constraint is often hiding inside that expansion.

Commissioning is easy to miss in a data center model. Power equipment, MEP modules, cooling loops, and rack fabric can all be on site, yet the facility still has to pass FAT, SAT, protection settings, load-bank tests, integrated systems tests, and burn-in. Equipment on site adds inventory. Acceptance adds MW.

Suppose a 1 GW campus planned to accept 100 MW per month and slips to 60 MW. The 1 GW headline remains intact while the revenue curve moves several months to the right. First-power dates, accepted MW per month, and the time from mechanical completion to revenue service tell us more than backlog at that point.

**Delivery yield is the exchange rate between headline GW and revenue.**

This work is boring. It does not have the appeal of a new GPU, and it rarely makes an AI keynote. But qualification, site coordination, spares, and repair windows decide whether long-lead equipment becomes running capacity on time. Red lights attract capital. The boring middle turns capital into revenue.

## Agents split one watt into two businesses

A normal chat is a request and a response. A coding agent may read files, search, call tools, write code, run tests, repair failures, and verify the result. The user clicks once while dozens of model calls run behind the task.

McKinsey's workload forecast makes the shift visible. It projects global data center demand rising from 82.3 GW in 2025 to 219 GW in 2030. AI inference grows from 20.9 GW to 93.3 GW, while training grows from 23.1 GW to 62.2 GW. Inference overtakes training by 2030.

That splits a watt into two businesses. Training and background work can wait, batch, and run on a distant campus. Interactive customer-service, browser, office, and coding agents must preserve state and wait on tool calls. Latency, network paths, and capacity near users become part of the product experience.

Remote gigawatt campuses will keep absorbing training and background work. Metro and near-metro capacity will carry more low-latency inference. Power contracts will separate too. Some workloads can pause or shift by an hour; a request that arrives 500 milliseconds late can make an interactive product feel broken.

The future shortage will not spread evenly across the global data center fleet. It will split along workload sensitivity and location.

## Capacity still leaks outside the building

Paid-task GW keeps shrinking after the cluster comes online.

Imagine two agents running on the same 1 MW. One has reliable tool calls, hits its caches, routes simple steps to smaller models, and resumes after a failure. The other retries constantly, resends long contexts to a large model, and ends with work that customers will not pay for because it is too slow, expensive, or unreliable.

The power, GPUs, and rack count are identical. Revenue density can be very different. Scheduler utilization, model routing, cache hit rate, tool success rate, retry rate, and paid conversion determine tasks per MW.

Models will keep getting cheaper. Quantization, distillation, MoE, speculative decoding, and better schedulers all reduce inference cost. Lower cost does not guarantee lower total consumption. When a task falls from $10 to $1, companies hand agents whole categories of work that were not worth automating before. Jevons paradox may show up again.

Paid tasks sit closer to the business than tokens. Retries can inflate token counts, and model pricing can make each token worth less. A completed task at least has a chance to reach an invoice.

The next bottleneck may sit outside the facility. It could be in the workload scheduler, agent reliability, or the product's ability to turn compute spend into customer ROI.

## Back to Ohio

PORTS-Pike's 8 IT-GW is still a huge number. I will watch whether the first 800 MW arrives in 2028, how many megawatts pass acceptance each month, and how many paid tasks the live clusters eventually complete.

None of the multipliers in that chain changes the headline. The press release still says 8 GW. The generation plan still says 10 GW. The racks may already be on site. Only the delivery date, utilization, and revenue move.

Investment research should follow the same chain. The equipment behind today's red lights can still make money. I will look for the next pocket of alpha one step downstream: Which step can customers not bypass, and which one moves accepted MW closer to paid work?

**A data center ultimately answers to one number: how many tasks customers will pay for each watt of contracted power.**

## Sources

- [OpenAI: OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [NVIDIA: PORTS-Pike Technology Campus press release](https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute)
- [U.S. DOE: PORTS-Pike energy access fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [OpenAI: five new Stargate sites](https://openai.com/index/five-new-stargate-sites/)
- [IEA: Energy and AI executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)
- [McKinsey: The future of AI workloads](https://www.mckinsey.com/featured-insights/charts/the-future-of-ai-workloads)
- [JLL: 2026 Global Data Center Outlook](https://www.jll.com/en-sea/insights/market-outlook/data-center-outlook)
- [Brookfield and Microsoft renewable energy framework](https://bep.brookfield.com/generation/pdf/document-file.pdf?path=%2Fpress-releases%2Fbep%2Fbrookfield-and-microsoft-collaborating-deliver-over-105-gw-new-renewable-power)
