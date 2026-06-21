---
title: "After Memory, Where Will Smart Money Flow?"
date: 2026-06-21 11:48:25
lang: en
i18n_key: smart-money-after-memory
categories:
  - Investing
tags:
  - AI
  - Semiconductor
  - Data Center
  - Edge AI
  - Memory
  - Investing
---

A friend in China teased me the other day: "Has everyone in Korea tripled their net worth?" Of course he was joking. But in Korea, that joke has already acquired a mythology of its own.

The best-known story is the "legendary SK hynix employee." Around 2008, when people inside the company thought buying its stock was crazy, he put KRW 44.46 million into 5,700 shares at KRW 7,800. Had he held them through January 2026, the stake would have been worth about KRW 4.1 billion.

<!-- more -->

More recently, another post spread across Korean communities. The author claimed to work on an SK hynix design team and said more than half the people around him held over KRW 100 million in company stock, including someone only two years into the job. The internet extended the story from there: "new hires will make KRW 400 million in 2028," accompanied by an AI-generated image titled "SK hynix's 2026 parking lot"—Ferraris as far as the eye could see.

Anonymous posts are not financial statements, but they are excellent sentiment indicators. **When a market starts mass-producing get-rich legends, the most profitable consensus has usually already formed.**

That consensus has a name: memory. SK hynix rose more than threefold from the cycle bottom, while the KOSPI kept setting records. Data centers tightened HBM supply first, then pulled DRAM and enterprise SSDs into the same upcycle. SK hynix, Samsung, and SanDisk went from cyclical stocks to the center of the AI trade. At this point, proving that "AI needs more memory" adds little. The question that matters is: from today's prices, where will smart money flow after memory?

The easiest answer is edge SoCs, AI PCs, and advanced packaging. Data centers bought HBM first. Next, billions of PCs, phones, cars, robots, and glasses begin running models, compute moves from the cloud toward devices, and capital continues down the supply chain. It is a clean story, and an easy one to sell.

But markets do not pay investors in supply-chain order.

A phone adding 4 GB of memory and a stronger NPU is not the same business as a hyperscaler building several gigawatts of new data-center capacity. The first market is measured in billions of devices; the second has only a few dozen major buyers. Yet one buyer's capital spending can rewrite the revenue curve for GPUs, HBM, networking, power, and cooling. Moving directly from "edge AI will become widespread" to "the edge will become AI's largest profit pool" quietly changes the denominator.

The analysis therefore cannot stop at the edge. Training is still expanding, cloud inference is becoming industrialized, and AI PCs and edge devices are only beginning to scale. The real question is how AI compute spreads from data centers into PCs, phones, cars, robots, and glasses—and how much revenue, profit, and free cash flow each layer can actually retain.

> **Unit volume creates the story. Capital intensity, pricing power, and bottlenecks create the profit.**

## Start With the Right Denominator

The "AI market" can include model subscriptions, cloud services, data-center equipment, semiconductors, devices, and software. Put all of them into one number and the edge share becomes meaningless. This article focuses on the two pools that map most directly to public companies: **AI semiconductors and AI infrastructure.**

Omdia's edge AI processor estimate covers ten device categories, including phones, PCs, tablets, robots, and drones. It puts the market at roughly $60 billion in 2028. A separate Omdia forecast puts data-center GPUs and AI accelerators at about $207 billion in 2025 and $286 billion in 2030.

The definitions and years do not line up perfectly, so they cannot produce a precise market-share calculation. Stitching them together only for scale still gives a clear result: **around 2028, edge AI processor value may be roughly one-fifth of data-center AI processor value. Add HBM, networking, storage, power, cooling, and facility construction, and only a range is defensible: the edge may represent roughly 10% to 20% of the overall AI hardware revenue pool, likely toward the lower end.**

Another comparison makes the gap easier to see. NVIDIA generated $75.2 billion in data-center revenue in its latest quarter, already more than Omdia's annual forecast for the entire edge AI processor market in 2028. IDC expects data-center semiconductor revenue to reach roughly $477.1 billion in 2026, versus about $89.8 billion for the entire mobile semiconductor market.

The categories still do not match perfectly, but the conclusion survives every reasonable adjustment: billions of edge devices do not automatically create the largest profit pool. Include cloud AI services, model subscriptions, and enterprise software in the denominator, and the edge hardware share becomes smaller still.

| Dimension | Data-Center AI | AI PCs, Phones, and Edge Devices |
| --- | --- | --- |
| Device count | Low | Billions |
| Semiconductor value per system | Extremely high | Tens to hundreds of dollars |
| Current revenue visibility | Already in orders and earnings | Mostly feature penetration |
| Main demand driver | Training, inference, agent workloads | Replacement, privacy, latency, continuous sensing |
| Core bottleneck | Accelerators, HBM, interconnect, power | Power, memory, software, price |

**Device count creates imagination. Silicon content and pricing power create profit.**

## Three AI Growth Curves Are Running at Once

The idea that cloud growth ends before the edge takes over misses the most important part of the cycle. Training is still expanding, inference is becoming industrialized, and edge deployment is only beginning. These curves can run in parallel for years.

### Training Expansion: The Most Expensive and Concentrated Layer

Frontier models continue to consume more parameters, data, and compute. Training clusters are moving from tens of thousands of accelerators toward hundreds of thousands. Profit concentrates in GPUs, HBM, advanced packaging, scale-up and scale-out networking, power, and cooling. NVIDIA and SK hynix are the most direct beneficiaries, while TSMC, Broadcom, optical interconnect suppliers, and power infrastructure providers monetize the bottlenecks.

This layer has one great advantage: the revenue is already real. Its risk is equally visible. Can hyperscaler capital spending turn into enough AI revenue and free cash flow? That is the ceiling I examined in my earlier article, "$700 Billion a Year: Who Becomes the Next Motorola?"

### Inference Expansion: From "Can It Run?" to "Can We Afford to Run It?"

Once models enter production, the key metrics shift from training speed to cost per token, latency, and reliability. Inference volume may eventually dwarf training volume, but the hardware mix will change: more custom ASICs, lower-precision compute, richer memory hierarchies, and denser connectivity.

Broadcom and Marvell are already reporting accelerating custom silicon and networking revenue. Smart money has not left the data center. It is spreading inside the data center—from general-purpose GPUs into ASICs, switches, optical links, CXL, and power systems.

**The first phase of AI bought compute. The second buys useful tokens delivered per watt, per dollar, and per second.**

### Inference Distribution: Turning Model Capability Into Billions of Daily Touchpoints

AI PCs, phones, cars, robots, cameras, and glasses will absorb privacy-sensitive, low-latency, always-on, and offline workloads. Heavy reasoning will still return to the cloud. Local systems will handle wake-up, personal context, sensor fusion, and smaller models.

This raises silicon content in NPUs, LPDDR, NAND, sensors, power management, and secure hardware while creating new software entry points. In the near term, however, the edge acts mainly as the distribution layer for cloud AI. Its revenue depends on two questions: do people use these functions frequently, and can that use become higher ASPs or shorter replacement cycles?

## Memory Has a Stronger Thesis—and a More Dangerous One

Once the denominator expands to the entire AI industry, the memory thesis becomes stronger. Data centers drive the current demand; edge devices provide the later increment.

HBM is directly tied to accelerator shipments and memory content per package. Enterprise SSDs benefit from training data, checkpoints, RAG, and inference caching. HBM also absorbs wafer capacity and capital that would otherwise serve commodity DRAM and NAND. AI infrastructure can therefore keep memory tight even while phones and PCs remain weak.

That means smartphone AI penetration alone cannot answer how much upside memory has left.

### HBM Is Structural; NAND Remains Cyclical

SK hynix is driven by HBM share, yield, customer qualification, and supply discipline. Its core exposure is structural data-center AI growth. Edge LPDDR is additional upside, not the engine.

Micron spans HBM, server DRAM, data-center SSDs, and client memory. Among U.S.-listed stocks, it maps more directly to the entire AI memory cycle than SanDisk does.

SanDisk has greater sensitivity to NAND pricing, enterprise SSD mix, and supply cuts. More storage per edge device can add a second demand layer, but NAND will also reverse fastest when producers resume expansion.

Samsung spans HBM, DRAM, NAND, foundry, smartphones, and SoCs. In theory, it has the broadest cloud-to-edge exposure. In practice, returns depend on HBM catch-up, advanced-node utilization, and device competitiveness arriving together.

### Memory Still Has Upside, but the Odds Have Changed

Further upside requires three things: continued upward revisions to data-center capital spending, tight supply in HBM and enterprise SSDs, and restraint from the three major memory producers. An edge boom can extend the cycle, but it cannot rescue pricing from uncontrolled supply growth.

Memory companies may keep setting profit records. Stock returns, however, no longer come from a simple valuation recovery. The remaining opportunity is a bet on supply discipline and the duration of earnings upgrades.

**Data centers remain the denominator for the memory cycle. Edge demand can lengthen it; edge demand cannot launch the next cycle by itself.**

## The First Opportunities After Memory Are Still Inside the Data Center

Markets love searching for the "next AI sector," as though capital must abandon whatever has already risen and discover an entirely new category. Reality is rarely that clean. As long as data-center orders and revenue are accelerating, new profit pools will first emerge inside the same system.

### Custom Silicon and Networking

Hyperscalers want lower token costs, less dependence on any single supplier, and silicon tuned to their models. Custom ASIC share will rise, but that does not eliminate demand for advanced nodes, HBM, packaging, or high-speed networking. Broadcom, Marvell, TSMC, EDA and IP vendors, and switch-silicon suppliers all sit on the same growth chain.

Networking becomes more important as clusters scale. A faster accelerator is useless when data cannot move. Scale-up, scale-out, optical interconnect, and CXL are moving from supporting roles into system bottlenecks.

The risks are customer concentration, valuation, and hyperscalers bringing more design work in-house. Large orders do not guarantee that profit will be distributed evenly.

### Power, Cooling, and Facilities

As AI clusters turn from a chip problem into a gigawatt problem, value migrates toward transformers, power distribution, UPS systems, liquid cooling, and thermal management. Data-center commissioning increasingly depends on grid access and cooling capacity, not just accelerator availability.

This layer is relatively agnostic to architecture. GPUs and ASICs both consume power and generate heat. The risks are the capital-spending cycle, project delays, and industrial valuations expanding too far.

### Foundry and Advanced Packaging

NVIDIA GPUs, hyperscaler ASICs, and AI PC SoCs all end up at advanced nodes, chiplet integration, and packaging. TSMC participates in both cloud and edge and comes closest to a pick-and-shovel business that does not require choosing the winning architecture.

Amkor and ASE benefit from rising package complexity, but their businesses are capital intensive. Revenue growth only becomes per-share free cash flow when utilization and pricing power cooperate.

Intel belongs on this map as well. Intel 18A is ramping production, 18A-P has entered risk production, and 14A remains at the PDK and customer test-chip stage. EMIB and Foveros add advanced packaging exposure. Intel therefore spans cloud, AI PCs, foundry, and packaging, while external customers, yield, utilization, and gross margin still require separate proof.

**A working process solves the engineering problem. Customer orders and profitable utilization solve the investment problem.**

## Better Risk-Adjusted Returns May Sit in "Dual Exposure"

Pure data-center companies have the strongest current growth. Pure edge companies have the greatest long-duration torque. For an individual investor, the more forgiving position may sit between them: companies that monetize data-center expansion now and gain a second curve when AI PCs and edge devices scale.

| Exposure Type | Current Cash Flow | Incremental Edge Upside | Main Risk |
| --- | --- | --- | --- |
| Data-center core | Strong | Limited or indirect | Capex, valuation, customer concentration |
| Cloud-and-edge dual exposure | Medium to strong | Meaningful | Execution, competition, valuation |
| Pure edge option | Weak to medium | Highest | Use cases, replacement cycles, price sensitivity |
| Memory cycle | Strong but volatile | A second demand layer | Expansion, inventory, price reversal |

TSMC manufactures GPUs, ASICs, phone SoCs, and PC chips while operating advanced packaging. Arm IP spans servers, PCs, phones, cars, and IoT. AMD currently grows through data centers while preserving client and embedded edge exposure. Micron sells HBM, server memory, and client memory. None of these companies needs an edge boom tomorrow, yet each gains another growth leg if it arrives.

There is always a price. Arm has excellent growth quality, but valuation can compress future returns. AMD must prove accelerator share and software execution. TSMC carries geopolitical and capital-intensity risks. Micron remains a memory-cycle company.

Qualcomm, MediaTek, and other client SoC suppliers sit closer to pure edge optionality. Their upside is large only when the NPU moves from a standard feature into ASP, margin, and replacement-rate growth. MediaTek's primary listing is in Taiwan, so it is not a normal U.S. equity exposure. Qualcomm has opened a data-center path, but its current earnings are still driven by handsets, automotive, and IoT.

Intel is a special case: dual exposure combined with a high-risk turnaround. Success creates enormous operating leverage. Failure leaves capital spending consuming cash.

**Instead of betting on the exact year edge AI explodes, look for companies that earn money while the cloud expands and add another growth layer when the edge arrives.**

## When Does the Edge Turn From a Feature Into Profit?

AI PC and generative-AI smartphone penetration can rise quickly because new chips naturally enter product lines. Penetration growth does not guarantee incremental unit demand, and it does not prove that buyers will pay a premium.

Gartner once expected AI PCs to represent about 55% of PC shipments in 2026. Reports earlier this year said the forecast had been cut to roughly 49%, citing high premiums, memory shortages, and a lack of must-have software. IDC, meanwhile, expects PC shipments to fall in 2026 while ASPs rise sharply. Hardware capability is spreading; replacement demand is not keeping pace.

The edge has to produce four signals before it reaches the income statement:

1. Monthly active use and task-completion rates keep rising;
2. The local share of inference rises instead of leaving most of the value in cloud offload;
3. NPU, memory, and storage upgrades raise ASP and gross margin;
4. AI pulls replacement demand forward rather than arriving through normal replacement.

AI glasses, robots, and cars need one more signal: multi-device coordination must create a new purchase decision, not just display a phone capability on another screen.

**AI labels count shipments. Task success counts revenue.**

## Smart Money Should Queue by Order of Proof

Stocks should not be ranked by who has risen the least. Past performance records what happened. Future returns depend on incremental free cash flow, probability of delivery, current valuation, and the loss when the thesis fails.

I would organize the research queue into four layers.

### Layer One: Data-Center Bottlenecks Already in the Numbers

GPUs, HBM, custom silicon, networking, power, and cooling have the clearest orders and revenue. The hard part is no longer deciding whether the industry is growing. It is deciding how much growth the valuation already assumes and when capital spending peaks.

### Layer Two: Dual Exposure Across Cloud and Edge

Foundry, advanced packaging, Arm IP, processors that span data center and client, and memory suppliers that serve both can cross all three growth curves. They rarely offer the greatest single-theme torque, but they may offer better risk-adjusted returns.

### Layer Three: Pure Edge Options

Qualcomm, MediaTek, client NPUs, low-power sensors, secure chips, and power management need evidence from usage, ASPs, and replacement cycles. This layer can create the largest expectation gap—and the easiest way to get trapped by a launch-event narrative.

### Layer Four: Cyclical Positions Managed Through Supply

SK hynix, Micron, Samsung, and SanDisk cannot be held only because "AI grows for a long time." Positions must change when HBM, DRAM, and NAND supply, inventory, and capital spending change.

This framework will never produce one stock that permanently ranks first. Arm's growth ceiling, Broadcom's current delivery, TSMC's platform position, Qualcomm's edge torque, and Intel's turnaround odds represent different combinations of probability and payoff.

## Six Events Could Reprice the Entire Thesis

### Can Hyperscaler AI Revenue Catch Up With Capex?

Data centers are the largest denominator and the largest source of risk. If AI revenue, utilization, or free cash flow cannot support capital spending, GPUs, HBM, networking, optics, and power equipment will all reset. A long-term edge story cannot save near-term orders.

### Can Inference Volume Outrun Model Efficiency?

Quantization, distillation, sparsity, and custom ASICs reduce the cost of each inference. Lower cost may compress hardware demand, or it may trigger a Jevons effect in which token volume grows even faster. Total inference volume decides the outcome, not how small one model becomes.

### When Does Memory Supply Actually Arrive?

If HBM yield, new fabs, advanced packaging, and NAND expansion improve together, memory prices will turn before demand looks weak. Watch bit supply, customer inventory, long-term agreements, and capital spending instead of waiting for margins to peak.

### Do Agents Cross the Reliability Threshold?

The edge needs persistent, personalized, cross-application execution. If agents still fail on permissions, payments, state, and recovery, AI PCs and phones will complete a specification upgrade without shortening replacement cycles.

### What Is the Real Cloud-versus-Local Cost?

Falling cloud inference prices extend the life of old devices. Privacy, latency, connectivity, and recurring subscription costs push workloads toward local execution. The architecture will be decided by total task cost, not launch-event messaging.

### Power and Geopolitics

Grid access, energy prices, export controls, advanced-node capacity, and regional subsidies can all change the winners. The more capital intensive AI becomes, the harder policy risk is to ignore.

## Different Scenarios Send Money to Different Layers

| Scenario | Industry Path | More Favored | More Exposed |
| --- | --- | --- | --- |
| Base | Data centers keep expanding, inference grows faster than training, edge penetrates through normal replacement | ASICs, networking, foundry, packaging, dual exposure | High-valuation narrative-only names |
| Bull | Agents drive massive inference, the edge finds killer applications, and multi-device demand forms | The full chain, especially edge SoCs, memory, and sensors | Companies dependent on old traffic gateways |
| Bear | Capex ROI weakens, buyers reject edge premiums, and memory supply arrives | Low-cost platforms and cash-generative infrastructure | Memory beta, pure edge options, leveraged expansion |

In the base case, data centers remain the largest AI profit pool for several years, inference infrastructure becomes the clearest second curve, and the edge provides long-duration optionality. The bull case is the one in which phones, AI PCs, glasses, and robots all create incremental hardware demand. In the bear case, edge penetration can still rise, but it becomes a default feature rather than a new supercycle.

## After Memory, the Answer Is Not One Sector

Does memory still have upside? Yes. Data centers remain the primary driver, while the edge can extend the cycle and add a second demand layer. Once supply arrives, however, the risks in NAND and commodity DRAM will surface quickly.

What comes after memory? The clearest second tier still sits inside the data center: custom silicon, networking, optical interconnect, power, cooling, foundry, and advanced packaging. Edge SoCs, AI PCs, and edge devices form the higher-torque third layer.

For an individual investor, dual exposure deserves the closest attention: businesses that monetize cloud capex today and edge deployment tomorrow. They may not produce the fastest rally, but they require fewer fragile assumptions to work.

**Smart money does not hunt for the next asset carrying an AI label. It looks for the next bottleneck where supply is hardest to expand, demand reaches the income statement first, and the price has not already bought the entire future.**

As tokens move from machine rooms into billions of devices, who gets paid once—and who collects a toll twice along the way?
