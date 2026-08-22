---
title: "The AI Data Center Alpha Map"
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

An AI data center announcement lands on the desk: [an 8 IT-GW lease](https://openai.com/index/openai-joins-ports-pike-project/), [10 GW of new generation, and $4.2 billion of transmission investment](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future). Every number is large, and every number is real. Ask how much capacity has passed commissioning and is ready for customer equipment, however, and few people have an answer.

Site secured, under construction, energized, Ready for Service, Delivered, Healthy, and In-Use can all be presented as "project progress." They sit at very different distances from revenue, cash flow, and usable compute. If those states are blurred together, adding the gigawatts only makes the conclusion more confidently wrong.

The harder question comes next: whose orders, revenue, and cash flow will those numbers eventually become?

<!-- more -->

## A data center forces every bottleneck onto one site

{% post_link the-real-bottleneck-is-replication.en 'Replication Speed Is the Real Bottleneck' %} introduced a general framework: compare how quickly demand forms with how long supply takes to replicate, then follow dependencies as the bottleneck migrates. That framework sits outside this series as prior reading for any bottleneck analysis. Drugs, nuclear power, robotics, and space infrastructure can all be mapped onto the same Bottleneck Migration Network whenever demand growth outruns supply replication.

Data centers are the first deep dive because they compress many industrial systems into one delivery outcome.

A GPU without power produces no compute. Power without a commissioned cooling system produces no compute either. Even when a facility is Ready for Service, the customer still lacks production capacity until the GPU cluster, network, storage, and software stack pass validation. Data center delivery follows AND logic. Every condition must hold at the same time.

Equipment entering a warehouse adds inventory. **Data center supply increases only after the whole system passes validation and handoff.**

That changes the starting point for investment research. We cannot begin with labels such as "liquid-cooling leader," "power beneficiary," or "higher optical content" and then fit projects around the story. Map the system first. Find the node controlling delivery speed. Only then evaluate supply elasticity, substitution paths, value capture, and the Price-in Score. Reversing that order turns industry growth into counterfeit company alpha.

## Two axes turn announcements back into systems

The map therefore needs two axes.

The horizontal axis is the **Project Delivery Lifecycle**. A facility moves from Site Selection through permitting, design, procurement, construction, energization, and commissioning before reaching Ready for Service. RFS usually means the facility has been built, tested, and delivered under the contract. It does not mean the GPU cluster is already running production workloads. Both [GDS's description of its project process](https://www.sec.gov/Archives/edgar/data/1526125/000110465924053659/tm2412943d1_ex99-1.pdf) and [a public colocation agreement](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm) place commissioning before formal delivery.

After RFS come IT deployment, cluster validation, and Production Handoff. NVIDIA's AI Cloud Requirements distinguish Delivered, Healthy, Reserved, and Active/In-Use capacity. Equipment handed to a customer, equipment meeting its SLA, reserved resources, and resources running workloads are four different states. [NVIDIA's definitions](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home) show that a full delivery chain still separates a serviceable facility from usable compute.

The vertical axis is the **AI Infrastructure Stack**. Power, thermal management, compute, networking, storage, the Serving Plane, and the Delivery Network each have their own supply chains, scaling cycles, and qualification gates. NVIDIA's DSX reference architecture also treats facilities, compute, networking, storage, and operations as distinct domains. Those domains must work together before an AI factory can operate. [NVIDIA DSX](https://docs.nvidia.com/dsx/home) gives the vertical axis a practical set of system coordinates.

![The AI Data Center Alpha Map](/images/ai-data-center-alpha-map.en.svg)

Once the axes intersect, every number in an announcement has coordinates. When a project announces 1 GW, ask which delivery gate it has reached. When a supplier says orders doubled, ask which layer it controls, how long expansion takes, and whether customers can route around it. **Alpha lives in the time gaps between coordinates, not in the labels.**

The order of this chain cannot be reversed. First follow the project delivery lifecycle from Site Selection to RFS, delivering the site, power, thermal systems, and commissioning. Once the facility is deliverable, assemble compute, networking, and storage into a healthy cluster. After Production Handoff, follow workloads and delivery networks until physical capacity becomes billable service. Finally, put the whole chain back into PORTS-Pike's 8 GW and test which Replication Gap lasts longest and who can turn it into revenue and cash flow.

## Deliver the facility first

The first question is immediate: when OpenAI announces 1 GW, 5 GW, or 8 GW, how far has that capacity actually progressed? Contracted, under construction, energized, and deliverable sit behind very different gates.

### 01 AI Data Center Project Delivery

Announced, planned, under-construction, energized, and RFS capacity belong on one timeline. The current state, the next gate, and the slowest gate determine when supply can be counted. Once those states are separated, the phrase "has power" becomes suspicious. What exactly has the project secured?

### 02 AI Data Center Grid Interconnection

A claim that a data center "has power" may mean a signed PPA, an interconnection agreement, or electricity physically reaching the site. Those states can be years apart. Even after power reaches the site, why can the GPUs still not turn on?

### 03 AI Data Center Power Distribution Architecture

Power still has to pass through transformers, switchgear, UPS systems, PDUs, busways, power shelves, and VRMs before entering a GPU. One missing segment leaves the GPU waiting. Once electricity enters the GPU, almost every watt becomes heat. Where does that heat go?

### 04 AI Data Center Thermal Management

The cold plate is only the start of the thermal path. Manifolds, CDUs, secondary loops, chillers, cooling towers, and dry coolers still have to reject the heat. One missing segment prevents power capacity from becoming sustained compute. If power and thermal systems work and the equipment is installed, why can the facility still not be handed over?

### 05 AI Data Center Commissioning and RFS Handoff

Mechanical Completion and RFS are separated by startup, functional testing, L1-L5 commissioning, Integrated Systems Testing, and operational handover. A successful component startup does not prove that the mission-critical system will survive failure scenarios. [Uptime Institute](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/) explains why "built" and "deliverable" are different states. The facility is finally deliverable and the GPUs are inside. Why can available compute still be zero?

## Turn the facility into production compute

RFS delivers only the facility. GPU shipments, server shipments, rack deliveries, and cluster capacity then appear on the same progress sheet. Are they really the same number?

### 06 AI Data Center Rack-Scale Architecture

GPUs, CPUs, HBM, NICs, and DPUs first become compute trays, which join NVLink switch trays and power shelves inside a rack. Component arrivals do not equal rack deliveries, and rack deliveries do not equal cluster capacity. Once the racks are ready, how do tens of thousands of GPUs become one system?

### 07 AI Data Center Supercluster Networking

NVLink handles scale-up; InfiniBand or Ethernet handles scale-out; switch ASICs, optical transceivers, lasers, fiber, connectors, and testing determine whether the fabric passes validation. Once the network works, where do training data, model weights, checkpoints, and KV cache live?

### 08 AI Data Center Storage Architecture

Training data, model weights, checkpoints, local NVMe, parallel file systems, object storage, and KV cache occupy different storage tiers. NAND bits describe capacity; controllers, firmware, reliability, and qualification determine whether enterprise storage can enter service. With compute, networking, and storage installed, who proves the cluster can carry production workloads?

### 09 AI Data Center Cluster Validation and Handoff

IT deployment, firmware, provisioning, burn-in, fabric validation, cluster acceptance, and healthy handoff all happen after RFS. Installed GPU counts give way to deployment velocity, cluster yield, and healthy capacity before Production Handoff. Once the healthy cluster exists, does one megawatt produce the same compute under Training and Inference?

## Compute still has to cross software and networks

Production Handoff delivers physical capacity. How much billable workload it becomes first depends on what job the cluster receives.

### 10 Training and Inference Data Center Architectures

Training pursues large-scale synchronous computation. Inference trades off latency, batching, utilization, and geography. The throughput and economics of the same megawatt therefore diverge. When Inference carries Agent workloads, how much computation can one user request unfold into?

### 11 AI Data Center Agent Workload Model

One user request expands into multiple model invocations plus routing, prefill, decode, retrieval, tool calls, retries, cache behavior, and scheduling. Tokens, requests, tasks, and tasks per megawatt answer different questions. Once the task finishes inside the cluster, how does the result reach the user within its latency SLO?

### 12 AI Data Center Compute Delivery Networks

DCI, backbone networks, transit, peering, CDNs, edge infrastructure, and metro inference determine whether the result meets its latency SLO. As internal compute expands, the constraint may migrate outside the data center. By this point, the original 8 GW is no longer one capacity number. Which segment is slowest, and who captures the orders and cash flow?

## PORTS-Pike tests the full map

### 13 PORTS-Pike AI Data Center Alpha Case Study

Put every PORTS-Pike project back into its delivery stage, expand each gigawatt into power, thermal, compute, network, and storage requirements, then trace the next bottleneck candidate through the Bottleneck Migration Network.

The test accepts only evidence that can be checked: contracts, project milestones, lead times, capacity, qualification, orders, and financial data. Which node is already priced in? Which supplier can turn pricing power into margins and cash flow? What evidence would invalidate the thesis?

## You should be able to do the breakdown yourself

Not knowing the difference between a transformer, switchgear, and a PDU at the start is fine. Diagrams carry the process, structure, and architecture; the text follows money along the delivery chain.

By the end, a reader should have four abilities: identify the real state of capacity in a project announcement; place supplier demand in the correct system layer; follow dependencies from one shortage into the next bottleneck; and demand an evidence chain covering supply elasticity, value capture, Price-in Score, and invalidation before calling a company an "AI infrastructure beneficiary."

The next time an 8 GW, 10 GW, or 100 GW announcement appears, do not put the number into Excel first.

Put it on the map.

## Sources

- [OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [U.S. Department of Energy PORTS-Pike fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [NVIDIA DSX reference architecture](https://docs.nvidia.com/dsx/home)
- [NVIDIA Requirements for AI Clouds](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)
- [Schneider Electric Data Center Projects Commissioning](https://download.schneider-electric.com/files?p_Doc_Ref=SPD_DBOY-6NJNK6_EN)
- [Uptime Institute Improve Project Success Through Mission Critical Commissioning](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/)
