---
title: "Why Does the Same 100 MW Produce Different Compute?"
date: 2026-08-23 11:00:00
lang: en
i18n_key: training-vs-inference-ledger
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

After Production Handoff, the scheduler receives a healthy 100 MW block. The facility meter shows one number and the GPU model has not changed, so the cluster should appear to have one answer for how much compute it can provide.

The Training team first asks whether those GPUs form one large partition that can run for weeks. The Inference team asks which regions receive them and how much concurrency they can carry without missing latency targets. **Why does the same 100 MW become different compute when the workload changes?**

<!-- more -->

## Why Can't the Same 100 MW Be Compared Directly?

Megawatts measure input power, not completed computation. Sending 100 MW from the facility meter into GPUs proves that physical resources are in use. What Training and Inference accept as output determines what those resources actually delivered.

A Training workload is largely specified before launch: model, dataset, sequence length, global batch, parallelism, and target quality. A large GPU population is gang-scheduled into one job. When one rank falls behind, the others wait. Its endpoint is not an hour of GPU activity, but a checkpoint that reaches the quality target on schedule.

Inference absorbs requests as they arrive. Prompts and outputs have different lengths, models differ, and each product tolerates a different latency. A GPU can remain busy while responses miss their service objective. That throughput consumed power without becoming deliverable product capacity.

[MLPerf Training](https://mlcommons.org/benchmarks/training/) ranks systems by the wall-clock time required to reach a specified quality target. [MLPerf Inference: Datacenter](https://mlcommons.org/benchmarks/inference-datacenter/) separates Server, Offline, and other scenarios, then applies throughput, latency, and whole-system AC-power constraints. Benchmarks are not production workloads, but they establish the boundary: Training's numerator is progress; Inference's numerator is acceptable service. Both can share MW as a denominator, but their outputs cannot be added.

## Why Can Training Slow Down While Every GPU Is Busy?

A GPU dashboard can easily report 95% utilization. That means kernels ran during most sampling intervals. It does not mean that 95% of the time advanced the model.

Within a training step, forward and backward passes create useful computation. All-reduce, all-to-all, and pipeline communication synchronize state across GPUs. Pipeline bubbles, data stalls, stragglers, and load imbalance leave devices waiting. Checkpoints consume compute or I/O, while a node failure can return the job to the last durable checkpoint.

![How Training Wall-clock Becomes Useful Progress](/images/ai-training-goodput.en.svg)

[NVIDIA's Megatron-Core discussion](https://developer.nvidia.com/blog/train-generative-ai-models-more-efficiently-with-new-nvidia-megatron-core-functionalities/) treats fully parallel, asynchronous checkpointing as a throughput problem: copy state to CPU or local storage first, then persist it in the background so synchronous I/O does not hold the main job. The previous article followed the checkpoint storage path. At the workload layer, that path decides whether expensive GPUs advance model state or wait for data to persist.

A Training ledger therefore separates allocated, job-running, and useful training GPU-hours before closing on time to quality. **A busy GPU proves that a resource is occupied. A checkpoint moving toward the quality target proves that Training is delivering.**

## Why Doesn't Twice the GPU Count Halve Training Time?

Suppose a workload takes 60 days on 1,024 GPUs. Expanding it to 2,048 GPUs approaches 30 days only when the additional computation exceeds the additional communication, synchronization, and idle time.

Scaling efficiency measures that loss. Under ideal strong scaling, doubling GPU count doubles throughput. In a real cluster, tensor, pipeline, data, and expert parallelism place different collectives on the critical path. Slow ranks, link flaps, pipeline imbalance, and failures become harder to hide as the job grows.

![Why Training Throughput Falls Below Ideal Scaling](/images/ai-training-scaling-efficiency.en.svg)

[NVIDIA's Megatron scaling experiment](https://developer.nvidia.com/blog/scaling-language-model-training-to-a-trillion-parameters-using-megatron/) includes data loading, optimization, and logging in end-to-end training performance. Its largest 3,072-A100 case reached 52% of theoretical peak FLOPS. That is not a universal efficiency for every model or cluster. It proves that nameplate FLOPS cannot be multiplied directly into training output.

Training capacity therefore also depends on the largest contiguous healthy partition, scaling efficiency on the target topology, checkpoint overhead, failure interval, and restart loss. Scattered GPUs can serve many inference replicas while doing nothing to pull a large training job forward by one day.

## Why Can Higher TPS Make Users Wait Longer?

Inference does not maintain one global job for weeks. It processes many unrelated requests at once. Each request enters a queue, processes all input tokens to produce the first output token, and then decodes one token at a time until the response completes.

![How an Inference Request Accumulates Latency](/images/ai-inference-latency-pipeline.en.svg)

[NVIDIA AIPerf's metric definitions](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html) include network, queueing, and prefill time in Time to First Token (TTFT). Time per Output Token (TPOT), also called Inter-token Latency, measures the average interval between output tokens after the first. As concurrency rises, total Tokens per Second (TPS) initially increases. After the GPU saturates, total TPS can fall, while per-user TPS falls as latency rises.

GPUs prefer larger batches because one execution amortizes model-weight reads and kernel overhead. Users wait for a batch to form and share each decode iteration with other sequences. Longer prompts add prefill work. Longer outputs and higher concurrency consume more HBM for KV cache, leaving room for fewer resident requests.

![How Batch, KV Cache, and SLO Define Inference Capacity](/images/ai-inference-capacity-envelope.en.svg)

[NVIDIA Dynamo's tuning guide](https://docs.nvidia.com/dynamo/kubernetes/operations/performance-tuning) requires comparisons to hold model, input length, output length, concurrency, and service-level objectives constant. It explicitly rejects throughput gains that breach ITL or TPOT targets. Raw TPS becomes SLO-qualified goodput only after passing TTFT, TPOT, error-rate, and quality gates.

That is also why Inference utilization cannot approach 100% without qualification. The system needs headroom for demand spikes, long-context requests, failover, and latency SLOs. Fill average utilization completely and the next request waits in a queue.

## Why Can't Idle GPUs Move Straight Into Training?

When requests fall overnight, idle GPUs appear ready for Training. Small fine-tunes, evaluations, and preemptible batch jobs can fill those valleys. A pretraining run that needs thousands of GPUs for several uninterrupted weeks cannot fit into a few quiet hours.

Time is only one constraint. Training waits for a sufficiently large contiguous partition and keeps data, checkpoints, and collective communication inside a suitable topology. Inference capacity has already been divided by model, region, SLO, and time. Idle GPUs in one region do not move demand out of another, and those fragments do not necessarily form the failure domain a training job needs.

![Centralized Training and Regionally Partitioned Inference](/images/ai-workload-geography.en.svg)

[OpenAI's API data controls](https://developers.openai.com/api/docs/guides/your-data#data-residency) distinguish regional storage from regional processing; when regional processing is selected, inference on customer content remains in the corresponding region. The [AWS Generative AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/genrel05.html) distributes inference requests across regions while balancing reliability, network latency, and operational complexity.

The scheduler therefore cannot ask only how many GPUs are idle. It must ask whether the size, location, topology, and duration of that idle capacity fit the target workload. Equal aggregate utilization does not imply equal usable compute.

## How Much Usable Compute Remains From 100 MW?

Both workloads begin at the facility meter. The 100 MW of IT load first loses unhealthy, maintenance, and unschedulable capacity. Up to that point it remains one physical resource. After allocation, the acceptance paths diverge.

![The Ledger from Facility MW to Training Progress and Billable Inference](/images/ai-workload-capacity-ledger.en.svg)

The Training side records allocated and job-running GPU-hours, removes bubbles, communication, checkpoints, and restart loss to reach useful training hours, and then asks whether an accepted checkpoint reached the quality target on schedule.

The Inference side records provisioned replica-hours, active serving GPU-hours, and raw token throughput, then removes work that missed TTFT, TPOT, error, or quality gates. Only then does it reach a billable request or a service that supports subscription revenue. Both sides also need wall power to calculate energy per accepted checkpoint increment or joules per SLO-qualified token.

Companies do not need to publish identical internal metrics for this ledger to matter. Comparisons do need fixed boundaries. GPU utilization does not reveal Training progress. TPS does not reveal whether Inference met latency. MW does not even reveal workload allocation.

## Why Does the Same 100 MW Map to Different Revenue?

The event that starts billing changes down the stack. A colocation provider bills by MW after capacity passes the contract's delivery conditions. An AI cloud turns that capacity into available GPU instances or committed service. A model provider spends Training capacity on the next model and uses Inference capacity to support subscriptions, API usage, and product revenue.

[CoreWeave's 2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm) reports more than 850 MW of active power, approximately 3.1 GW of contracted power, and $60.7 billion of remaining performance obligations. Those are operating physical capacity, future planned power, and unsatisfied contract value. They are not substitutes. For an AI cloud, contracted MW must become available service on schedule before take-or-pay commitments keep converting into revenue.

At the model-provider layer, higher Training scaling efficiency shortens time to market without automatically creating current-period token revenue. Better Inference batching, KV reuse, and routing expands SLO-qualified throughput without adding MW. [OpenAI reported](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/) available compute growing from 0.2 GW in 2023 to about 1.9 GW in 2025 while ARR grew from $2 billion to more than $20 billion, attributing both to its own compute, research, product, and monetization flywheel. That correlation belongs to OpenAI's disclosure; it is not a universal revenue-per-MW ratio.

[NVIDIA's Dynamo 1.0 announcement](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Enters-Production-With-Dynamo-the-Broadly-Adopted-Inference-Operating-System-for-AI-Factories/default.aspx) claims up to 7x Blackwell inference-performance improvement in selected benchmarks. It is a vendor benchmark, not a production guarantee, but it shows that orchestration software can move the revenue ceiling of the same hardware.

## Are These Economics Already Priced In?

The headline “AI compute needs another 100 MW” cannot answer that question. A price-in analysis for one company must put workload mix, delivery timing, utilization, revenue per available MW, gross margin, contract duration, financing cost, and incremental capex on the same earnings path. This ledger proves why those variables cannot be omitted. It cannot invent data that a company does not disclose.

CoreWeave provides a clear evidence boundary. Its 850 MW of active power, 3.1 GW of contracted power, and $60.7 billion RPO establish operating scale, future deployment, and demand. The 10-K does not split revenue, utilization, and margin between Training and Inference, or map each MW to the same GPU generation, delivery date, and financing structure. Dividing RPO by contracted MW would blend a roughly five-year contract duration, future delivery, hardware refresh, availability credits, and capital cost into a false “value per MW.”

The price-in disposition at this layer is therefore **Unverified**. That does not mean the market has ignored the economics or priced them fully. Public evidence cannot yet isolate how much workload efficiency is embedded in the share price. The next evidence to watch is not another contracted-GW headline, but active-capacity ramp, revenue and gross profit per available MW, contract utilization, capex and debt service, and changes in the Training and Inference mix.

## So How Much Compute Is the Same 100 MW?

Return to the original 100 MW. The meter reading never changed. Training turns it into checkpoints that reach target quality on schedule. Inference turns it into tokens and requests that meet an SLO. Partition continuity, scaling efficiency, request shape, region, and headroom keep changing the usable output on both sides.

One hundred megawatts is therefore not a complete compute answer. It is a physical input. Before asking how much compute exists, add the workload, acceptance unit, and service boundary. Without those three, two data centers labeled 100 MW may not be delivering the same thing at all.
