---
title: "OpenAI's 30 GW: The Data Center Delivery Gap"
date: 2026-08-22 14:55:27
lang: en
i18n_key: ai-data-center-alpha-map
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Investing
  - Bottleneck
---

[OpenAI had just 0.2 GW of available compute in 2023](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/). That rose to 0.6 GW in 2024 and about 1.9 GW in 2025. Compute increased 9.5 times in two years and still was not enough. In April 2026, OpenAI raised the target again: [30 GW by 2030](https://x.com/OpenAINewsroom/status/2046951726683455866).

Thirty gigawatts is nearly sixteen times OpenAI's available compute in 2025. Four months after announcing that target, OpenAI signed PORTS-Pike, an AI data center planned for roughly 8 IT-GW.

How many data centers has OpenAI already signed? Why does it keep signing more? And how large is 8 GW inside a 30 GW plan?

<!-- more -->

## How many data centers has OpenAI actually signed?

Start in 2023. The first large contract came from Microsoft. That multi-year partnership disclosed neither gigawatts nor the locations of individual Azure supercomputers. It only said the two companies had [built multiple systems used to train all of OpenAI's models](https://openai.com/index/openai-and-microsoft-extend-partnership/).

The 0.2 GW, 0.6 GW, and 1.9 GW figures therefore describe OpenAI's available compute by year. They are not a site inventory that can be pinned to a map. OpenAI has not disclosed how much Azure, OCI, CoreWeave, or AWS contributes, or how many gigawatts sit in each operating data center.

Abilene is the first campus where location, capacity, and operating status can all be pinned down. Construction began in 2024, and AI workloads were running in less than a year. By mid-2026, [42% of its planned 1.2 GW had been delivered to the customer](https://www.oracle.com/data-centers/); the rest remained under construction.

Only then did physical campuses begin to appear one by one. In September 2025, Abilene plus five new sites brought Stargate to [six campuses and nearly 7 GW of planned capacity](https://openai.com/index/five-new-stargate-sites/). [Michigan became the seventh campus](https://openai.com/index/expanding-stargate-to-michigan/) one month later. Georgia's [Project Camellia](https://openai.com/index/building-ai-infrastructure-with-the-effingham-county-community/) and Ohio's [PORTS-Pike](https://openai.com/index/openai-joins-ports-pike-project/) followed in 2026.

![OpenAI U.S. Data Center Delivery Status Since 2023](/images/openai-stargate-campus-map.en.svg)

As of August 22, 2026, Abilene was the only one of the nine campuses already running workloads. Seven others had entered construction. Camellia was still in permitting and had not broken ground. SB Energy had begun developing PORTS-Pike before OpenAI signed on in 2026, and the developer already classified it as [In Early Construction](https://sbenergy.com/digital-infrastructure/). Circle area scales with each site's disclosed full buildout, not gigawatts available today. Abilene's green circle means the campus is in service; only 42% had actually been delivered.

The disclosed gigawatt figures also use different denominators. PORTS-Pike reports IT capacity, Shackelford reports critical IT load, and Doña Ana and Camellia report power capacity. They show the relative size of each buildout, but they cannot be added directly.

The map answers where these nine campuses are and how far each has progressed. It still cannot tell us how many gigawatts OpenAI has secured in total.

The same compute can reappear across four layers of disclosure: sites, cloud capacity, compute systems, and chips. [Oracle's 4.5 GW partnership](https://openai.com/index/stargate-advances-with-partnership-with-oracle/) will land across multiple campuses. [Milam County's 1.2 GW lease](https://openai.com/index/stargate-sb-energy-partnership/) was already included among the five sites announced in 2025. NVIDIA's 10 GW remains a [letter of intent](https://openai.com/index/openai-nvidia-systems-partnership/), while Broadcom's 10 GW is a [system deployment term sheet](https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/). The latter two total 20 GW of systems intended for OpenAI and partner data centers. They are not another 20 GW of new buildings.

[Microsoft, Oracle, AWS, CoreWeave, and Google Cloud](https://openai.com/index/accelerating-the-next-phase-ai/) provide cloud capacity that may sit on the same physical infrastructure. Adding every gigawatt from every press release can count one data center twice or even three times.

That is why the map includes only physical campuses whose location and delivery status can be pinned down. This leaves two capacity boundaries that do not double-count: 1.9 GW available in 2025 and the 30 GW OpenAI plans to have in 2030.

## Where did Anthropic's gigawatts go?

Anthropic looks quiet by comparison. Claude's users and revenue are growing too, so why do we rarely see Anthropic announcing one 5 GW or 8 GW data center after another?

The two companies acquire compute differently. OpenAI brought physical infrastructure under Stargate, so its name stays attached to a campus from site selection through construction. Anthropic spreads compute across AWS Trainium, Google TPU, Azure NVIDIA, Fluidstack, and SpaceX. The cloud provider, chip supplier, or data center developer usually publishes the announcement.

The gigawatts did not disappear. In October 2025, [Google arranged more than 1 GW of TPU capacity for Anthropic to come online in 2026](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services). In April 2026, [AWS signed for up to 5 GW, with nearly 1 GW expected online by the end of 2026](https://www.anthropic.com/news/anthropic-amazon-compute). One month later, [Anthropic took all of Colossus 1's capacity, more than 300 MW](https://www.anthropic.com/news/higher-limits-spacex). Add [1 GW from Azure](https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships) and [Google/Broadcom capacity beginning delivery in 2027](https://www.anthropic.com/news/google-broadcom-partnership-compute), and Anthropic is also locking in years of gigawatt supply. It simply does not package that supply as one Stargate campus map.

The comparison stalls at available compute. As of August 22, 2026, the latest company-level figures on a comparable basis still ended in 2025. OpenAI disclosed 1.9 GW; Anthropic disclosed no total. [An OpenAI memo](https://qz.com/openai-investor-memo-compute-advantage-anthropic-041026) estimated Anthropic at about 1.4 GW. After [Epoch AI incorporated that external anchor into its model](https://github.com/epoch-research/ai-compute-users), its 90% interval ran from 1.0 GW to 1.9 GW, with a 1.38 GW median. Every Anthropic value in the chart is therefore marked as an estimate. It cannot be treated like OpenAI's disclosed number.

![OpenAI and Anthropic Available Compute Outlook](/images/openai-compute-growth-forecast.en.svg)

The 2026 figure can only be estimated too. Add the AWS, Google, and SpaceX capacity announced for 2026 to the 1.4 GW estimate for 2025, and year-end points toward roughly 3.7 GW. That is not Anthropic guidance. Delivery delays or overlapping capacity definitions could change it.

Beyond 2026, OpenAI's memo provides only two ranges: OpenAI expects to enter the low-double-digit gigawatts in 2027, while Anthropic is estimated to reach 7 GW to 8 GW by year-end. OpenAI separately targets 30 GW in 2030. Anthropic has published no company-level available-compute guidance for 2028 through 2030, so the orange line stops in 2027. OpenAI's green dashed line merely connects the 2027 and 2030 anchors; it is not annual guidance. Spreading AWS's maximum 5 GW, Google's 5 GW, and Azure's 1 GW across future years would disguise contract ceilings as a delivery schedule.

Anthropic rarely appears in headlines about giant data centers, yet it is competing for the same gigawatts. OpenAI made the delivery path visible. Anthropic split that path across multiple infrastructure suppliers. Both curves are moving from less than 2 GW toward the 10 GW range.

## What kind of demand needs 30 GW?

The acquisition paths differ, but new capacity ultimately has to be consumed by workloads. OpenAI's 30 GW has to feed two kinds of demand at once.

[Training compute buys the capability of the next model; inference compute delivers today's product](https://openai.com/index/a-scorecard-for-the-ai-age/). More users and more requests increase inference demand. Reasoning models spend more test-time compute on each request. With Agents, one request can unfold into model invocations, tool calls, and retries that [continue for minutes or even hours](https://openai.com/index/how-agents-are-transforming-work/).

OpenAI put three years of data side by side. Available compute grew 9.5 times. ARR rose from $2 billion to more than $20 billion, almost exactly tenfold. OpenAI's conclusion was direct: with more compute, product adoption and revenue would have grown faster. [Compute trains future models and carries today's revenue at the same time](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/).

Better models drive more usage. More usage drives more revenue. Revenue secures the next block of compute. Algorithms and hardware will keep improving performance per watt, but the demand unit is also changing from one answer into a task that runs continuously. New workloads quickly consume the capacity released by efficiency gains.

Thirty gigawatts still sits on a roadmap. Every new agreement OpenAI signs locks in supply years ahead.

## How large is PORTS-Pike's 8 GW?

The PORTS-Pike announcement gave no GPU count and no FLOPS figure. It gave one number: 8 IT-GW. That measures the power capacity available to servers, networking, and storage. It does not tell us how much compute the cluster can produce.

Inside OpenAI's compute footprint, 8 GW equals roughly 4.2 times all of its available compute in 2025 and 27% of its 30 GW target for 2030. One campus accounting for more than a quarter of the long-term target is large by any measure.

But the 8 GW will not arrive at once. [The first 800 MW, or 0.8 GW, is expected to become available in 2028](https://openai.com/index/openai-joins-ports-pike-project/). The full buildout runs for six years, through 2032. OpenAI will not start paying for all 8 GW today either. Lease payments begin as completed capacity becomes deliverable.

The same 8 GW therefore occupies three positions at once. It is PORTS-Pike's final planned capacity, one possible contribution to the 2030 target, and a buildout that may not finish until 2032. Counting it as available compute today has no basis. Even assigning the full 8 GW to the first delivery milestone in 2028 would overstate 800 MW by a factor of ten.

The question changes from "How many more gigawatts does OpenAI need?" to "When do the gigawatts already under contract become available compute?"

## Data Center is still a black box

OpenAI can secure 8 GW in one agreement, yet the first 800 MW will not arrive until 2028. Signing takes a pen. Replicating supply has to pass through site, power, facility, and cluster.

{% post_link the-real-bottleneck-is-replication.en 'Replication Speed Is the Real Bottleneck' %} left a time gap: how quickly OpenAI's demand for 30 GW forms, and how long capacity capable of carrying production workloads takes to replicate. Demand forms quickly while supply expands slowly. Orders, price increases, and excess returns accumulate inside that Replication Gap.

Follow the Replication Gap downstream and AI's bottleneck lands on Data Center. SpaceX takes the more aggressive path: replace the entire ground deployment chain.

But Data Center remains one box in the Bottleneck Migration Network.

The box is too large.

The grid, transformers, switchgear, UPS systems, liquid cooling, GPUs, HBM, switches, optical transceivers, SSDs, construction, and commissioning all collapse into one delivery outcome. Every company can pick one term and call itself an AI infrastructure beneficiary. Knowing that "data centers are constrained" does not tell us who merely benefits from demand and who controls the binding constraint.

The previous essay stopped at Data Center. This series opens that box.

## Installed GPUs can still yield zero compute

Data center supply follows AND logic: every subsystem has to be available at the same time.

GPUs arrive while the site remains unenergized: available compute is zero. The site is energized but the cooling system has not completed integrated commissioning: capacity is still unavailable. The facility finishes construction and testing and reaches Ready for Service (RFS), meaning it can be delivered under the contract, but the GPU cluster's firmware, networking, storage, and software stack have not passed validation: the cluster still cannot carry production workloads.

Equipment entering a warehouse adds inventory. **Available compute increases only after the system passes validation and handoff.**

RFS is the easiest boundary to miscount. A facility moves from Site Selection through permitting, design, procurement, construction, energization, and commissioning before reaching it. Public colocation contracts generally define this state as a facility completed and tested according to the agreement and ready for delivery. It does not mean the GPU cluster has entered production. Both [GDS's project documentation](https://www.sec.gov/Archives/edgar/data/1526125/000110465924053659/tm2412943d1_ex99-1.pdf) and [a public colocation agreement](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm) place commissioning before formal delivery.

After RFS come IT deployment, burn-in, fabric validation, cluster acceptance, and Production Handoff. NVIDIA separates Delivered, Healthy, Reserved, and Active/In-Use as well. Equipment handed to the customer, equipment meeting its health criteria, capacity reserved, and capacity actively serving workloads are four different states. [NVIDIA AI Cloud Requirements](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home) makes those boundaries explicit.

Data center research therefore cannot stop at GPU shipments or place every announced gigawatt in one table. The handoff a project has reached determines whether that supply can be counted.

## Put GW back on a coordinate system

Breaking down PORTS-Pike requires two axes.

The horizontal axis asks: **How far has the project progressed?** A project at Site Selection, energization, RFS, or Production Handoff can carry the same 1 GW label while sitting at a completely different distance from available compute.

The vertical axis asks: **Which system has not been delivered?** Power, thermal, compute, networking, and storage must all be available. One missing layer prevents the preceding gigawatts from becoming production capacity. [NVIDIA's DSX reference architecture](https://docs.nvidia.com/dsx/home) also separates an AI factory into facilities, compute, networking, storage, and operations.

![The AI Data Center Alpha Map](/images/ai-data-center-alpha-map.en.svg)

Once the axes intersect, the number gains coordinates. An announced 1 GW is target capacity. An energized 1 GW can receive power. One gigawatt at RFS is a deliverable facility. A 1 GW cluster at Production Handoff can carry production workloads. All four say 1 GW. They are not the same supply.

Only after identifying which 1 GW we are looking at can pricing and returns enter the analysis.

The chain has a fixed order. First follow the project delivery lifecycle from Site Selection through power and thermal delivery, then commissioning, to RFS. Once the facility is deliverable, assemble compute, networking, and storage into a healthy cluster. After Production Handoff, follow workloads and delivery networks until physical capacity becomes billable service. Finally, put the whole chain back into PORTS-Pike's 8 GW and test which Replication Gap lasts longest and which supplier can turn it into revenue and cash flow.

The chain does not fit into one essay. Grid interconnection, power distribution, thermal management, cluster networking, storage, and workloads are each deep enough for a proper investigation. Forcing them together would collapse Data Center back into the box we just opened.

The series will therefore move through the chain one layer at a time. The titles below mark the route; links will appear as each essay is published.

## First ask how far the data center has been built

OpenAI announces another 1 GW, 5 GW, or 8 GW. How far has that capacity actually progressed? Contracted, under construction, energized, and deliverable sit behind very different gates.

1. **AI Data Center Project Delivery: Site Selection to Facility Handoff**

   Announced, planned, under-construction, energized, and RFS capacity belong on one timeline. The current state, the next gate, and the slowest gate determine when supply can be counted. Once those states are separated, the phrase "has power" becomes suspicious. What exactly has the project secured?

2. **AI Data Center Grid Interconnection: The First Gate**

   A claim that a data center "has power" may mean a signed PPA, an interconnection agreement, or electricity physically reaching the site. Those states can be years apart. Even after power reaches the site, why can the GPUs still not turn on?

3. **AI Data Center Power Distribution: Substation to GPU**

   Power still has to pass through transformers, switchgear, UPS systems, PDUs, busways, power shelves, and VRMs before entering a GPU. One missing segment leaves the GPU waiting. Once electricity enters the GPU, almost every watt becomes heat. Where does that heat go?

4. **AI Data Center Thermal Management: Beyond Liquid Cooling**

   The cold plate is only the start of the thermal path. Manifolds, CDUs, secondary loops, chillers, cooling towers, and dry coolers still have to reject the heat. One missing segment prevents power capacity from becoming sustained compute. If power and thermal systems work and the equipment is installed, why can the facility still not be handed over?

5. **AI Data Center Commissioning: Built Is Not Deliverable**

   Mechanical Completion and RFS are separated by startup, functional testing, L1-L5 commissioning, Integrated Systems Testing, and operational handover. A successful component startup does not prove that the mission-critical system will survive failure scenarios. [Uptime Institute](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/) explains why "built" and "deliverable" are different states. The facility is finally deliverable and the GPUs are inside. Why can available compute still be zero?

## Then ask when GPUs become compute

RFS delivers only the facility. GPU shipments, server shipments, rack deliveries, and cluster capacity then appear on the same progress sheet. Are they really the same number?

6. **AI Data Center Rack Delivery: GPU to Rack**

   GPUs, CPUs, HBM, NICs, and DPUs first become compute trays, which join NVLink switch trays and power shelves inside a rack. Component arrivals do not equal rack deliveries, and rack deliveries do not equal cluster capacity. Once the racks are ready, how do tens of thousands of GPUs become one system?

7. **AI Data Center Superclusters: The Network Ceiling**

   NVLink handles scale-up; InfiniBand or Ethernet handles scale-out; switch ASICs, optical transceivers, lasers, fiber, connectors, and testing determine whether the fabric passes validation. Once the network works, where do training data, model weights, checkpoints, and KV cache live?

8. **AI Data Center Storage: Checkpoint to KV Cache**

   Training data, model weights, checkpoints, local NVMe, parallel file systems, object storage, and KV cache occupy different storage tiers. NAND bits describe capacity; controllers, firmware, reliability, and qualification determine whether enterprise storage can enter service. With compute, networking, and storage installed, who proves the cluster can carry production workloads?

9. **AI Cluster Delivery: Facility Handoff to Production Handoff**

   IT deployment, firmware, provisioning, burn-in, fabric validation, cluster acceptance, and healthy handoff all happen after RFS. Installed GPU counts give way to deployment velocity, cluster yield, and healthy capacity before Production Handoff. Once the healthy cluster exists, does one megawatt produce the same compute under Training and Inference?

## Compute still has one more leg before revenue

Production Handoff delivers physical capacity. How much billable workload it becomes first depends on what job the cluster receives.

10. **Training vs. Inference: Two Data Centers**

    Training pursues large-scale synchronous computation. Inference trades off latency, batching, utilization, and geography. The throughput and economics of the same megawatt therefore diverge. When Inference carries Agent workloads, how much computation can one user request unfold into?

11. **The Agent Compute Bill: Token to Task**

    One user request expands into multiple model invocations plus routing, prefill, decode, retrieval, tool calls, retries, cache behavior, and scheduling. Tokens, requests, tasks, and tasks per megawatt answer different questions. Once the task finishes inside the cluster, how does the result reach the user within its latency SLO?

12. **AI Compute Delivery: Cluster to User**

    DCI, backbone networks, transit, peering, CDNs, edge infrastructure, and metro inference determine whether the result meets its latency SLO. As internal compute expands, the constraint may migrate outside the data center. By this point, the original 8 GW is no longer one capacity number. Which segment is slowest, and who captures the orders and cash flow?

## Test the map with PORTS-Pike's 8 GW

13. **PORTS-Pike: Breaking Down an 8 GW Data Center**

    Put every PORTS-Pike project back into its delivery stage, expand each gigawatt into power, thermal, compute, network, and storage requirements, then trace the next bottleneck candidate through the Bottleneck Migration Network.

The test accepts only evidence that can be checked: contracts, project milestones, lead times, capacity, qualification, orders, and financial data. Which node is already priced in? Which supplier can turn pricing power into margins and cash flow? What evidence would invalidate the thesis?

## The next 100 GW

PORTS-Pike will not be the last large number. Eight gigawatts, 10 GW, and 100 GW will keep appearing, and press releases will keep placing planned, energized, RFS, and production capacity side by side.

A list of "AI data center beneficiaries" can expire in a few months, and bottlenecks migrate. Match project state, system position, and Replication Gap, and the orders, pricing power, and cash flow begin to reveal themselves.

When the next large number appears, do not put it straight into Excel.

How far has it progressed?

## Sources

- [OpenAI plans 30GW of compute by 2030](https://x.com/OpenAINewsroom/status/2046951726683455866)
- [A business that scales with the value of intelligence](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)
- [OpenAI memo compares its compute capacity with Anthropic](https://qz.com/openai-investor-memo-compute-advantage-anthropic-041026)
- [Epoch AI frontier-lab compute model](https://github.com/epoch-research/ai-compute-users)
- [Anthropic expands Google Cloud TPU capacity](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services)
- [Anthropic and Amazon expand collaboration for up to 5GW](https://www.anthropic.com/news/anthropic-amazon-compute)
- [Anthropic adds more than 300MW from SpaceX](https://www.anthropic.com/news/higher-limits-spacex)
- [Microsoft, NVIDIA and Anthropic strategic partnerships](https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships)
- [Anthropic expands Google and Broadcom partnership](https://www.anthropic.com/news/google-broadcom-partnership-compute)
- [OpenAI and Microsoft extend partnership](https://openai.com/index/openai-and-microsoft-extend-partnership/)
- [AWS and OpenAI announce multi-year strategic partnership](https://openai.com/index/aws-and-openai-partnership/)
- [OpenAI partners with Cerebras](https://openai.com/index/cerebras-partnership/)
- [OpenAI, Oracle, and SoftBank expand Stargate with five new AI data center sites](https://openai.com/index/five-new-stargate-sites/)
- [Crusoe's flagship 1.2GW AI data center campus in Abilene](https://crusoe.ai/blog/crusoe-2024-impact-report/)
- [Oracle AI data center construction and delivery status](https://www.oracle.com/data-centers/)
- [Vantage Frontier campus: 1.4GW of critical IT load](https://vantage-dc.com/wp-content/uploads/2025/08/VDC_DataSheet_Frontier.pdf)
- [Project Jupiter: up to 2.45GW of installed fuel-cell capacity](https://www.oracle.com/news/announcement/oracle-borderplex-and-bloom-energy-to-power-project-jupiter-with-fuel-cell-technology-2026-04-27/)
- [Vantage Lighthouse campus: 902MW development](https://blog.vantage-dc.com/2026/03/30/vantage-data-centers-and-partners-host-career-expo-in-port-washington-wisconsin-to-connect-local-talent-with-lighthouse-opportunities/)
- [SB Energy data center construction status](https://sbenergy.com/digital-infrastructure/)
- [Effingham County: Project Camellia review and permitting](https://effinghamcounty.org/m/newsflash/home/detail/466)
- [Expanding Stargate to Michigan](https://openai.com/index/expanding-stargate-to-michigan/)
- [Building AI infrastructure with the Effingham County community](https://openai.com/index/building-ai-infrastructure-with-the-effingham-county-community/)
- [OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [U.S. Department of Energy PORTS-Pike fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [NVIDIA DSX reference architecture](https://docs.nvidia.com/dsx/home)
- [NVIDIA Requirements for AI Clouds](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)
- [Schneider Electric Data Center Projects Commissioning](https://download.schneider-electric.com/files?p_Doc_Ref=SPD_DBOY-6NJNK6_EN)
- [Uptime Institute Improve Project Success Through Mission Critical Commissioning](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/)
