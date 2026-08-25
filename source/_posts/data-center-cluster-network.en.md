---
title: "128 Racks Need 1040 Switches"
date: 2026-08-23 08:00:00
lang: en
i18n_key: data-center-cluster-network
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

One GB200 NVL72 already uses NVLink to join 72 GPUs into a rack-scale system. Across 128 racks, that is 9,216 GPUs. The familiar server-network model says that connecting those racks to one high-speed fabric should produce a supercluster.

NVIDIA's reference architecture adds 512 leaf switches, 384 spine switches, and 144 core switches. **There are only 128 GPU racks, but the compute fabric needs 1,040 switches.**

In an ordinary data center, one top-of-rack switch often connects dozens of servers in the rack. Here, each GPU rack averages more than eight compute-fabric switches. What are all those additional switches doing?

The fabric must avoid narrowing any GPU's bandwidth when 9,216 400G ports exchange data together. Connectivity alone falls far short. Those 1,040 switches are the hardware cost of that requirement in a full non-blocking fat tree.

<!-- more -->

## NVLink stops at the rack boundary

NVLink turns the 72 GPUs inside an NVL72 into one scale-up domain, but it stops at the rack boundary. Short copper links provide low latency and high bandwidth inside a rack. Extending them across rows of racks quickly creates signal-integrity, cable-volume, bend-radius, and maintenance problems.

Cross-rack traffic therefore changes networks. [Each GB200 compute tray carries four 400 Gbps ConnectX-7 NICs](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/dgx-superpod-components.html), one for each GPU position in the tray. Eighteen compute trays give one rack 72 GPU-facing 400G ports.

![NVLink completes scale-up inside a rack; the compute fabric starts again at the rack boundary](/images/ai-cluster-network-boundaries.en.svg)

Across 128 racks, 9,216 ports expose 3.6864 Pbps of one-way injection bandwidth. This is no longer a question of finding one uplink per rack. It is a question of carrying traffic when 9,216 endpoints inject into the same AllReduce.

A data center network designed for bursty service traffic often trades oversubscription for cost because not every server saturates its uplink at once. Synchronous training cannot rely on that assumption. One collective makes thousands of ranks exchange gradients, activations, or parameters together. Any narrowed layer becomes a place where GPUs wait for the network.

## Where the 1,040-switch count comes from

[NVIDIA first groups eight racks and 576 GPUs into one Scalable Unit, or SU](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/network-fabrics.html). The four GPU and NIC positions in each compute tray enter four rails, keeping the same GPU position aligned across racks.

Within one SU, each rail needs eight leaf switches for the eight racks and six spine switches above them. Across four rails, one SU therefore needs 32 leaf and 24 spine switches.

At 16 SUs, leaf and spine counts replicate with the SU:

- `32 × 16 = 512` leaf switches
- `24 × 16 = 384` spine switches

Traffic between SUs adds six core groups with 24 switches each, or 144 core switches. The three layers produce `512 + 384 + 144 = 1,040`.

![How 9,216 GPUs expand into 1,040 compute-fabric switches](/images/ai-cluster-fat-tree.en.svg)

[NVIDIA specifies a rail-optimized, balanced, full fat tree](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/dgx-superpod-components.html#compute-fabric). Leaf switches accept GPU injection, spines preserve uplink bandwidth within an SU, and cores keep 16 SUs from converging on one oversubscribed path. The 1,040 count is what remains after all three layers preserve that symmetry.

The chassis count is only the visible layer. Every GPU-to-leaf, leaf-to-spine, and spine-to-core link also ends in SerDes, ports, optical transceivers or cables, fibers, connectors, and a port at the other end. One thousand and forty switches turn ten thousand GPUs into tens of thousands of high-speed links that must all be correct at once.

## LinkUp only rules out a broken link

A lit port proves only that an electrical or optical link exists. GPU 2 may be intended for Rail 2 but cabled into Rail 3, and both ends can still report LinkUp. Comparing actual neighbors with the Point-to-Point topology is what exposes the crossed connection. [NVIDIA UFM topology comparison](https://docs.nvidia.com/networking/display/infinibandclusterbringupprocedure/confirming-topology-using-ufm-gui) operates at this layer.

Correct topology still leaves speed, width, FEC, BER, temperature, flaps, and port counters. A marginal optical module can look healthy at idle, then report corrected errors, retransmissions, or a downshift under traffic and heat.

Collective traffic comes last. [NCCL Tests](https://github.com/NVIDIA/nccl-tests) exercises AllReduce, AllGather, ReduceScatter, and AlltoAll, but a 64-GPU pass cannot substitute for 576 GPUs, much less 16 SUs. Each larger scope traverses more spine, core, and optical paths and finally touches bad links that smaller tests never used.

![How LinkUp converges into schedulable network capacity](/images/ai-cluster-network-validation.en.svg)

Installed, network-discovered, topology-correct, full-rate, collective-qualified, and schedulable GPUs are six different counts. The scheduler can deliver their intersection, not the largest number among them.

That is why a rack with 72 healthy GPUs may still leave the resource pool for a large job. A few GPUs behind the wrong rail or a marginal link can create the slowest rank in the target collective. Losing one link can ultimately remove an entire block of schedulable capacity.

## Who controls the thousand switches

The 1,040 switches belong to NVIDIA's Quantum InfiniBand reference design. QM9700 switches, ConnectX-7 NICs, UFM, routing, and telemetry all sit inside NVIDIA's platform. A customer is no longer buying unrelated chassis and NICs. It is buying a compute fabric whose rails, topology, and management plane have already been specified together.

That control point has already reached the financial statements. NVIDIA's Q1 FY2027 Data Center networking revenue reached [$14.8 billion, up 199% year over year and 35% sequentially](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027), or about 18% of total quarterly revenue. Networking is no longer a small bill-of-materials attachment to a GPU sale.

That $14.8 billion includes NVLink, InfiniBand, Ethernet, NICs, and switches. NVIDIA does not disclose QM9700 revenue, shipments, or networking gross margin separately. The evidence therefore reaches "platform control has become material revenue," but it cannot isolate how much profit comes from these 1,040 switches.

## Price-in stops at the NVIDIA boundary

On August 21, NVIDIA closed at [$214.72, with a market capitalization of about $5.20 trillion, trailing-twelve-month EPS of $6.53, and a P/E of 32.88](https://stockanalysis.com/stocks/nvda/). Fix one simple scenario: a 25-times exit P/E in five years and a 10% required annual return. Today's price then requires company-wide EPS to compound at roughly 16.1% for five years: `(32.88 × 1.1^5 ÷ 25)^(1/5) - 1`. Earnings must more than double over that period.

This is not a price target. The 25-times exit multiple and 10% required return are scenario assumptions chosen to make the implied expectation reproducible; change either one and the 16.1% changes with it. The calculation still sets a company-level boundary. The market already expects a platform worth more than $5 trillion to expand earnings for years, so networking growth cannot be treated as an undiscovered fact.

That boundary cannot be reversed into a Quantum-switch price-in estimate. Networking is only part of NVIDIA, and QM9700 is only part of networking; the company discloses neither the two layers of mix nor their margins. **The market has seen that a supercluster needs a thousand switches, but how much NVIDIA networking is priced in remains unverified.** The evidence that could change that conclusion is networking mix, shipments, and margins showing an earnings path steeper than the company-wide 16.1%, not another larger port forecast.

The opposite path is equally clear. If Ethernet designs pass collective and operational validation at the same scale, or switch capacity grows faster than GPU deployments, the supply gap narrows. The network remains necessary while the economics of platform control weaken.

The 1,040 switches now look less like an inflated bill of materials. They turn simultaneous injection from 9,216 400G ports into a fabric that can be validated and scheduled. Once that network passes, ten thousand GPUs first begin to behave like one machine. Keeping that machine fed with training data and writing checkpoints on time moves the next constraint into storage.
