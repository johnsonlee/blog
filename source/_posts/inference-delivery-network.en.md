---
title: "Inference Networks Both Schedule GPUs and Deliver Results"
date: 2026-08-23 13:00:00
lang: en
i18n_key: inference-delivery-network
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

The GPU has generated the first token. The user's screen in Seoul is still blank.

There is no contradiction. Finishing the computation only means that the result can leave the inference worker. The token must still cross the data center network, Inference Gateway, Regional Front Door, and backbone, then return through an edge, ISP, and last mile before it becomes the first word on the screen.

The cluster finishing its work does not mean that the result has been delivered.

<!-- more -->

## Where Does the First Token Actually Wait?

The clock starts when the user clicks send. The request crosses DNS, connection setup, TLS, edge ingress, and the backbone. Inside the target region, it still has to pass authentication, rate limiting, policy checks, model routing, and a queue before the GPU can begin prefill.

The clock does not stop when the first token is generated. That token still has to travel back along the response path to the client.

![What contributes to first-token wait time](/images/inference-ttft-budget.en.svg)

[NVIDIA defines TTFT](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html) as the time from query submission until the client receives the first non-empty token. It generally includes queueing, prefill, and network latency. Measuring only the interval after an inference server receives the prompt removes both the ingress path the user has already waited through and the return path after generation.

Network latency is not one number either. Client to edge runs over the public Internet and last mile. Edge to region may enter a provider backbone. Inside the region, traffic still crosses load balancers, gateways, service networks, and rack networks. A slower TTFT can come from a GPU queue, proxy buffering, a cross-region detour, or packet loss in the last mile.

Server-side TTFT can therefore look healthy while the model feels slower to the user. Finding the cause requires splitting client-observed TTFT into edge ingress, backbone, gateway, queue, prefill, and first-chunk return instead of charging the entire wait to the GPU.

## How Many Networks Does One Request Cross?

The user sees one domain, not one endpoint. DNS or Anycast first brings the connection to an edge. The edge handles DDoS protection, TLS termination, and traffic steering, then sends the request to a region that can serve the target model. A Regional Front Door applies API policy and service routing before an Inference Gateway selects a model pool and worker.

![The complete path from user to GPU and back](/images/inference-delivery-path.en.svg)

[AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html) takes traffic onto the AWS global network at an edge close to the user, then routes it to regional endpoints based on proximity, endpoint health, and configured weights. [Google's AI inference networking architecture](https://docs.cloud.google.com/architecture/networking-for-ai-inference) separates the global endpoint, regional load balancer, API management, guardrails, and model backends. The implementations differ, but the purpose is the same: users should not need to know which GPU is working, and the entry point must hide a constantly changing capacity pool.

None of those middle layers disappears on the return trip. A proxy that buffers streaming chunks can make the response stall even when the GPU decodes on time. Request and response paths may also diverge because of traffic policy, failover, or Internet routing.

Cluster to user spans at least three networks: the cluster fabric inside the data center, the service network inside a region, and the delivery network connecting edges, backbones, ISPs, and last miles. The first two organize GPUs. The last one turns compute into a service the user can perceive.

## If the Edge Is Close, Why Is the GPU Still in a Region?

Deploying a stateless proxy at the edge needs racks, CPUs, and connectivity. Moving a frontier model there also means replicating accelerators, power, cooling, model weights, serving runtimes, spare capacity, and on-call operations. An edge PoP can be close to the user without having the physical plant to host a large model.

Keeping GPUs in fewer regions also improves utilization. Every region needs headroom for peak traffic, model mix, and failures. The more capacity is fragmented into small pools, the harder it is to borrow idle capacity. Model weights must also remain in accelerator memory. Spreading a low-volume model across many edges can leave expensive GPUs waiting for enough requests to form a batch.

The trade-off does not disappear. More concentration improves batching, model density, and utilization. More distribution reduces network RTT, residency distance, and regional failure blast radius. The edge shortens the user's first hop into the network; it does not move the GPU next door.

## Why Can't a CDN Deliver It Like Video?

A video is uploaded once and read repeatedly. After a segment reaches an edge cache, another user can fetch it without returning to origin. An inference response may depend on the prompt, conversation state, retrieved data, tool results, model version, sampling parameters, policies, and user permissions. If one field differs, it may no longer be the same result.

![Caching boundaries for static assets, identical prompts, and personalized inference](/images/inference-cache-boundary.en.svg)

[Cloudflare AI Gateway caching](https://developers.cloudflare.com/ai-gateway/features/caching/) returns an existing response only for an identical request and is better suited to workloads with limited prompt options and non-dynamic content. FAQs and fixed classification tasks can benefit. Responses with private context, live data, or random sampling have a very different reuse boundary.

Inference can still reuse work, but at several layers. CDN caches hold static assets. Retrieval caches reuse search results. Prompt caches and KV caches reuse prefill for a shared prefix. They live at the edge, application, storage, and GPU memory layers, with different privacy boundaries, invalidation rules, and billing events.

AI traffic therefore does not simply reproduce video CDN economics. Text responses may carry few bytes, while each personalized request still has to return to the place that holds model state and accelerator capacity. The delivery network's first job is not moving more gigabytes. It is finding the right region and worker quickly.

## Why Can't an Ordinary Load Balancer Understand a GPU?

A normal web load balancer often routes by connections, request count, CPU, or response latency. An inference worker also has a loaded model, remaining KV cache, prefix overlap, batch position, prefill or decode role, context length, adapters, and an SLO.

Two GPUs can both show 70% utilization while facing very different costs for the same request.

![State an Inference Gateway needs when choosing a worker](/images/inference-gateway-routing.en.svg)

[NVIDIA Dynamo's KV-aware routing](https://docs.nvidia.com/dynamo/dev/kubernetes/kv-aware-routing/overview) uses KV cache events and active load published by workers to select the worker most likely to hold a prompt prefix, reducing repeated prefill. [Google's Multi-Cluster Inference Gateway](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/about-elastic-cross-region-high-availability) also uses inference-specific signals such as KV cache utilization rather than balancing only by request rate.

Choosing only the nearest region can find the longest queue. Choosing only the emptiest worker can discard an already-computed prefix. Chasing only a cache hit can overload a hot worker. The router must trade off network distance, queue depth, cache locality, model availability, cost, residency, and failure domains in real time.

An Inference Gateway is therefore more than a thin proxy beside the entry point. It determines how much prefill a request repeats, how much cross-region traffic it creates, and which GPU pool achieves higher utilization. It is the scheduler connecting network capacity with compute capacity.

## Why Isn't the Nearest Region Always the Fastest?

Seoul is the nearest region for a user in Seoul, but the target model may have a warm replica only in Tokyo, and Tokyo may already be at peak load. Oregon might have the shortest queue but adds network RTT. If an enterprise requires EU regional processing, none of the three belongs to the eligible set.

![The three constraints on regional inference routing](/images/regional-inference-trilemma.en.svg)

A router does not select from every GPU in the world. It first applies model, geography, service tier, residency policy, and SLO constraints to produce an eligible region set. Only then can it compare network distance, queues, and cache locality.

Every added model, region, service tier, or processing boundary fragments what looked like one global capacity pool. Idle GPUs somewhere else do not mean that the current request can use them.

That is why total global megawatts cannot explain inference availability. Deliverable capacity is the capacity that still satisfies `Model × Geography × Tier × Policy × SLO` at that moment.

## Why Can't Idle GPUs Be Borrowed?

When a primary region is congested, spilling a request into another region sounds straightforward. The destination, however, must already have the target model, serving stack, accelerators, quota, guardrails, logging, and on-call operations. Otherwise the router has found an empty address, not backup capacity.

![Spillover across a single region, geographic pool, and global pool](/images/cross-region-spillover.en.svg)

[Amazon Bedrock cross-Region inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html) uses inference profiles to route requests across regions. Geographic profiles keep processing within boundaries such as the US, EU, or APAC. Global profiles can use a larger set of commercial regions. The larger capacity pool comes with a wider processing geography.

Spillover stretches state and dependencies too. Tools, retrieval data, or private endpoints that remain in the source region may still be called repeatedly by a model request running elsewhere. A backup region without reserved warm capacity can enter the same queue as the primary region during a regional failure.

Opening another region is therefore not a DNS change. Accelerators, backbone connectivity, model artifacts, serving stacks, policies, observability, and failure handling all have to be replicated. Production traffic must then validate TTFT, stream continuity, residency, and failback. An endpoint can exist before its capacity is borrowable.

## When Is a Stream Complete?

A non-streaming API returns after the complete response has been generated. Streaming starts sending events or chunks after the first token. It reduces perceived latency and turns a short request-response exchange into a connection that must remain healthy.

![Connection, chunk, and guardrail timing for a streaming response](/images/inference-streaming-path.en.svg)

Every later chunk still crosses proxies, buffers, timeouts, and the client connection. If the connection breaks, the system must decide whether it can resume, replay, or regenerate. A retry can make the GPU recompute content that was generated but never fully received.

Guardrails change the delivery boundary as well. [Amazon Bedrock streaming guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-streaming.html) can synchronously buffer a group of chunks before checking them or asynchronously send them before the check completes. The first adds chunk latency. The second reduces the wait but can deliver partial content before a policy decision.

HTTP 200 therefore means that a connection was established, not that a response was delivered. A streaming service still needs first event, inter-event gap, connection duration, disconnect, reconnect, partial completion, and final acceptance. For voice, code completion, and agent progress, continuity is part of the SLO.

## What Counts as One Delivery?

A request should leave a trace from the client through the eligible region set, edge ingress, selected route, model pool, gateway queue, prefill, decode, stream, and egress. It becomes an SLO-qualified delivery only when the response arrives in full before the deadline, without a policy error, and the client accepts it.

![The ledger from request to SLO-qualified delivery](/images/inference-delivery-ledger.en.svg)

The ledger must record compute and network together. Cross-region spillover can reduce queue time while increasing backbone distance. A KV-aware route may travel farther inside the region but avoid an entire prefill. A closer region may improve average TTFT while its smaller pool worsens P99.

[Google Cloud network pricing](https://cloud.google.com/vpc/network-pricing) charges separately for intra-region, inter-region, Interconnect, and Internet data transfer. Contract prices vary, but the billing boundaries show that network is not a free attachment already included in the GPU price.

More importantly, a network failure can disqualify compute that has already been paid for. A token generated but not delivered within the SLO consumes capacity without necessarily creating a billable delivery.

## Who Can Get Paid Along This Path?

A hyperscaler can own the region, backbone, edge, load balancer, interconnect, and GPU cloud, then bundle cross-region routing, premium networking, and inference capacity. An independent edge network controls Internet ingress, security, peering, and the last delivery segment. A carrier controls the last mile and enterprise private connectivity. An Inference Gateway decides which compute pool finally receives the request.

Pricing power depends on what the customer loses by routing around a layer. The public Internet can replace a premium backbone at the cost of latency, jitter, and failure control. CDNs can replace one another, but ordinary traffic steering cannot see model, KV, and queue state. A cloud-native gateway sees the backend best, yet its value may disappear into a cloud bundle.

Demand will not reach every layer equally. More text tokens first increase model invocations and long-lived connections, not necessarily egress gigabytes. Multimodal output expands storage, backbone, and delivery bytes together. Regional processing replicates endpoints and spare capacity while shrinking the pool each region can share.

The commercial events worth tracking are specific: cross-region request volume, premium backbone and private interconnect attach, load-balancing, gateway, and egress revenue per successful delivery, and whether that revenue covers backbone, PoP, traffic-acquisition, and spare-capacity costs.

## Is This Business Already Priced In?

**The answer is not verifiable.** The market already assigns a high expectation to AI networking, but disclosures do not bridge that expectation to inference-delivery earnings.

Cloudflare offers a useful example. [Second-quarter 2026 revenue grew 36% to $696 million](https://www.cloudflare.net/news/news-details/2026/Cloudflare-Announces-Second-Quarter-2026-Financial-Results/default.aspx), and the company explicitly connected its growth narrative to AI answer engines and agent-driven traffic. Multiplying the [$293.14 closing price on August 21](https://www.nasdaq.com/market-activity/stocks/net/historical) by the roughly 354 million weighted-average shares in the earnings release gives an approximate equity value of $104 billion. Dividing that by the $2.864 billion to $2.870 billion 2026 revenue guidance gives about **36 times current-year revenue**. That is not a valuation for a traditional CDN alone.

Yet the 36 times figure cannot reveal how much inference delivery is priced in. Cloudflare reports platform-wide revenue, not AI Gateway traffic, cross-region requests, successful deliveries, revenue per delivered task, and the corresponding network cost. AWS also reports only the whole AWS segment. [Second-quarter 2026 AWS revenue grew 37% to $42.2 billion](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Second-Quarter-Results/default.aspx), with no way to isolate inference-driven backbone, load-balancing, and egress revenue.

Bridging price back to earnings requires at least:

`Delivered Tasks × Network Revenue per Task - Backbone / PoP / Spare Capacity Cost`

Public data shows the AI demand narrative on the left and company-level revenue and valuation on the right. It does not disclose all four terms in the middle. The defensible conclusion is that platform-level AI expectations are already high. It is not possible to say how much profit inference delivery contributes or to attribute the full 36 times revenue multiple to this path.

The next evidence to watch is not token growth by itself. It is the network share of client-observed TTFT, cross-region ratio, stream disconnects, egress bytes per successful task, network revenue per delivered task, and incremental gross margin. Only when those metrics rise together does Inference Delivery turn from a traffic story into verifiable earnings.

## Why Is the User Still Waiting After the GPU Finishes?

Because the user never bought a completed GPU operation. The user bought a complete result delivered within the promised region, policy, and SLO.

The edge only brings the user into the network. The gateway must find eligible model capacity. The backbone must carry the request and response to the right region. The stream must remain intact until the final chunk is accepted. A failure anywhere along that path prevents the GPU work already consumed from becoming a successful delivery.

Viewed from this path, one pool called “global compute” splits into `Model × Geography × Tier × Policy × SLO`. An idle GPU that cannot be borrowed is not supply. A generated token that cannot reach the user is not delivery.
