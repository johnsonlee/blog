---
title: "Why Does a 15 TB Checkpoint Get Only Five Seconds?"
date: 2026-08-23 09:00:00
lang: en
i18n_key: data-center-storage-hierarchy
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

How often should 100,000 accelerators training a one-trillion-parameter model save their progress? [MLCommons calculates](https://mlcommons.org/2025/08/storage-2-checkpointing/) an interval of 1.5 minutes. Each checkpoint is 15 TB, yet its available window is only 4.4 seconds.

Dividing 15 TB by 4.4 seconds gives nearly 3.6 TB/s. The problem appears to disappear once the storage system provides enough bandwidth.

But 4.4 seconds is neither an SSD benchmark nor an arbitrary SLA. It begins with how often the whole cluster fails and ends with the slowest of 1,024 processes. **The deliverable is not 3.6 TB/s. It is a recovery point that lets a 100,000-accelerator training job keep making progress.**

<!-- more -->

## 4.4 Seconds Comes from Failure, Not the SSD

A single server failure is routine because another server can take over its traffic. Synchronous training puts tens of thousands of accelerators inside one job. Every rank participates in the same parameter update, so one missing node can leave all the others waiting.

When [Meta trained Llama 3 405B](https://arxiv.org/abs/2407.21783), 16,384 H100 GPUs encountered 419 unexpected interruptions over 54 days. MLCommons extrapolates cluster failure rates from that field data and targets roughly 20 checkpoints between expected failures. A 16,000-accelerator cluster saves every 9.3 minutes. At 100,000 accelerators, the interval contracts to 1.5 minutes.

Save too rarely and a failure forces the job to repeat more steps. Save too often and the GPUs spend more time checkpointing instead of training. Limiting checkpoint overhead to 5% of a 90-second interval leaves roughly 4.5 seconds. The precise window in the MLCommons model is 4.4 seconds.

![Larger Clusters Leave Narrower Checkpoint Windows](/images/ai-storage-checkpoint-window.en.svg)

Five seconds is therefore not a universal constant for large-model training. Change the model size, cluster size, failure rate, or allowed synchronous-checkpoint overhead, and the pause window changes with them. Under a synchronous-checkpoint model, the direction does not: **as the cluster grows, failures arrive more often while storage gets less pause time.**

## 3.6 TB/s Is Still Not the Completion Condition

The 15 TB checkpoint is not one giant file written from beginning to end. In the MLPerf Storage one-trillion-parameter workload, 13.2 TB is optimizer state, and 1,024 processes save the checkpoint in parallel. Each process is responsible for roughly 15 GB, and they must all finish.

Aggregate bandwidth can now create the wrong impression. Suppose 1,023 processes finish within four seconds while one process takes five because of its client, network path, metadata operation, drive, or background task. The checkpoint takes five seconds. MLCommons scores the slowest process, not the steady-state average.

![Checkpoint Completion Is Set by the Slowest Process](/images/ai-storage-checkpoint-tail.en.svg)

That makes 3.6 TB/s necessary but insufficient. The storage fabric must distribute 1,024 concurrent streams across enough controllers and media. The filesystem must absorb simultaneous file and metadata operations. The client stack must keep any single node from falling into the tail. An impressive sequential-throughput result does not prove this path has passed.

Load cannot be omitted either. During a save, the job is trying to minimize a short pause. When a load is needed, the whole cluster is already stopped. A checkpoint that writes quickly but cannot be read back, or can be read only by the original node, is a collection of files rather than a recovery point.

## Resumed GPUs Do Not Mean a Successful Save

A synchronous checkpoint pauses training until the write completes, so the 4.4-second window applies directly to storage. An asynchronous checkpoint can first snapshot training state into host memory or local NVMe, let the GPUs enter the next iteration, and flush to shared storage in the background.

The foreground pause shrinks, but the failure boundary remains. If the only copy is still on the failed node, losing a node or rack can remove both the computation and its checkpoint. [MLCommons explicitly notes](https://mlcommons.org/2025/08/storage-2-checkpointing/) that its local-NVMe subset mode does not provide full fault tolerance without another storage tier or additional software.

![A Checkpoint Moves from a Fast Snapshot to a Recoverable State](/images/ai-storage-checkpoint-durability.en.svg)

A checkpoint therefore crosses at least three states. The snapshot leaves accelerator memory and the GPUs can resume. The checkpoint data enters shared high-performance storage and becomes readable from another node. A retained copy then leaves the shared HPS system or site failure domain and enters an independent protection domain. Asynchronous checkpointing advances the first state; it does not remove the other two.

Multiple buffers can let an earlier checkpoint keep flushing after the next snapshot arrives, but they cannot absorb a growing backlog forever. At 100,000 accelerators, the interval is only 90 seconds. The long-run drain rate still has to match nearly 200 GB/s of checkpoint generation and more than 14 PB per day. Moving the burst into the background does not erase its capacity, endurance, or sustained-bandwidth bill.

## Why Object Storage Sits Outside the 4.4-Second Hot Path

This is why one cluster needs local NVMe, high-performance storage, and object storage at the same time. They are not three bids for the same pool of capacity. They move a checkpoint across different failure boundaries.

[NVIDIA calls DGX SuperPOD high-performance storage the inner ring](https://docs.nvidia.com/dgx-superpod/faq/latest/dgx-superpod.html) and requires certified file storage there. Object stores and data lakes sit in the outer ring and are procured separately by the customer. Object storage is suited to capacity and retention, and it can move a copy beyond the inner-ring storage system or site failure domain. That does not mean it has passed a hot path in which more than a thousand processes save within seconds and then load from a different set of nodes.

Training datasets and KV cache also pass through storage, but they cannot be combined with checkpoints into one "AI storage demand" number. Datasets primarily consume sustained reads and metadata operations. KV cache is first constrained by HBM, host memory, and recomputation cost. Only checkpoints create a synchronized write burst at one training step and turn the slowest process into a pause for the entire cluster.

Capacity forecasts are therefore easier than delivery judgments. The evidence that matters is save duration at the target model and process count, the slowest process, load duration, remote readability, buffer occupancy after repeated checkpoints, and whether recovery resumes from the same global step.

## Five Seconds Is Not a Sale of NAND Bits

Follow that evidence downstream and the point of delivery becomes clear. NAND shipment, SSD arrival, and filesystem mount all happen earlier. Storage enters cluster capacity only after the target workload passes save, load, and recovery acceptance.

The control point sits in a qualified system, not one NAND die. [NVIDIA's current list of DGX SuperPOD-certified storage](https://docs.nvidia.com/certification-programs/certified-storage/latest/systems-list.html) includes Dell PowerScale, DDN, IBM Storage Scale, NetApp, Everpure FlashBlade, VAST, and WEKA. Certification excludes systems that have not passed platform validation, but it does not lock the customer into one supplier.

At this point, the price-in conclusion can only be **Unverified**. Public evidence identifies which systems passed certification, but it does not map checkpoint acceptance for a target cluster into one company's accepted capacity, shipments, ASP, margin, or backlog. The list also provides several substitute paths, while control of final acceptance can shift among the customer, integrator, and storage vendor by project. Until that chain closes, reversing any one company's valuation into checkpoint earnings would mistake industry relevance for value capture.

Moving from Unverified to Calculated requires something other than another exabyte forecast. It requires commercial data from this same delivery chain: qualified design wins for target clusters, accepted capacity, system ASP, gross margin, and enough materiality to appear in the company's segment results. Conversely, if asynchronous checkpointing sharply reduces shared-storage bursts, more systems pass the same acceptance quickly, or certified capacity replicates faster than cluster deployment, the constraint moves elsewhere.

The 15 TB and five seconds now describe more than a capacity division. Whether 100,000 accelerators can continue training depends on all 1,024 processes finishing, then moving from "the GPUs can resume" to "another node can recover." The network turns thousands of GPUs into one machine. Checkpointing determines whether that machine can continue from where it stopped after something fails.
