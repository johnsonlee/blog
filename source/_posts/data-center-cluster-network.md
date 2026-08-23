---
title: 万卡集群为什么需要一千台 Switch？
date: 2026-08-23 08:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-cluster-network
---

一座 GB200 NVL72 已经用 NVLink 把 72 块 GPU 连成一个 rack-scale system。128 座 rack 一共 9,216 块 GPU，按照常见的 server network 结构，接进一张高速网络，万卡集群也就连起来了。

可在 NVIDIA 的 reference architecture 里，这 128 座 rack 还要配 512 台 leaf switch、384 台 spine switch 和 144 台 core switch。**GPU rack 只有 128 座，compute-fabric switch 却有 1,040 台。**

在普通 Data Center 里，一台 top-of-rack switch 往往能接住一座 rack 里的几十台 server；到了万卡集群，平均一座 rack 反而要摊上八台以上的 switch。多出来的 switch 到底在解决什么问题？

这张网必须在 9,216 个 400G port 同时交换数据时，仍然尽量不收窄任何一块 GPU 的带宽。“已经连通”远远不够。1,040 台 switch，就是 full non-blocking fat-tree 为这项要求付出的硬件成本。

<!-- more -->

## NVLink 到 Rack 边界就停了

NVLink 已经把一座 NVL72 里的 72 块 GPU 连成一个 scale-up domain，但它停在 rack 边界。短距离铜缆适合在整柜内部提供低延迟和高带宽，继续跨过几排 rack，信号完整性、线缆体积、弯曲半径和维护都会迅速变难。

跨 rack 的 traffic 因此换到另一张网。[每个 GB200 compute tray 有四块 400Gbps ConnectX-7 NIC](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/dgx-superpod-components.html)，对应 tray 里的四块 GPU。一座 rack 有 18 个 compute tray，也就有 72 个 GPU-facing 400G port。

![NVLink 在 Rack 内完成 Scale-up，Compute Fabric 从 Rack 边界重新开始](/images/ai-cluster-network-boundaries.svg)

128 座 rack 一共给出 9,216 个 400G port，单向 injection bandwidth 达到 3.6864 Pbps。问题也从“给每座 rack 找一个 uplink”，变成 9,216 个端点怎样在同一轮 AllReduce 里同时注入流量。

为突发 service traffic 设计的 data center network 常用 oversubscription 换成本，因为并非每台 server 都会同时跑满上行。同步训练不能沿用这个假设。一次 collective 会让数千个 rank 一起交换 gradient、activation 或 parameter；中间哪一层带宽收窄，GPU 就在那里等网络。

## 1,040 台 Switch 是怎样算出来的

[NVIDIA 先把八座 rack、576 块 GPU 组成一个 Scalable Unit（SU）](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/network-fabrics.html)。每个 compute tray 的四块 GPU/NIC 分到四条 rail，同一位置的 GPU 沿相同 rail 接入网络。

每条 rail 在一个 SU 内需要八台 leaf，对应八座 rack；再用六台 spine 承接这些 leaf。四条 rail 合起来，一个 SU 就需要 32 台 leaf 和 24 台 spine。

规模扩到 16 个 SU 时，leaf 与 spine 随 SU 一起复制：

- `32 × 16 = 512` 台 leaf
- `24 × 16 = 384` 台 spine

跨 SU 还要增加六组 core，每组 24 台，一共 144 台。三层相加，才得到 `512 + 384 + 144 = 1,040`。

![9,216 块 GPU 怎样展开成 1,040 台 Compute-fabric Switch](/images/ai-cluster-fat-tree.svg)

[NVIDIA 把这张 compute fabric 定义为 rail-optimized、balanced、full fat-tree](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/dgx-superpod-components.html#compute-fabric)。Leaf 接住 GPU 的注入，spine 保住一个 SU 内的上行，core 再让 16 个 SU 之间不必挤进一条 oversubscribed path。前面算出的 1,040，正是这三层同时保持带宽对称后的数量。

Switch chassis 也只是表面。每条 GPU-to-leaf、leaf-to-spine 和 spine-to-core link 还要落到 SerDes、port、optical transceiver 或 cable、fiber、connector 与对端 port。1,040 台 switch 把一万块 GPU 变成了几万条必须同时正确的高速链路。

## LinkUp 只排除了断线

端口亮灯，只证明 electrical 或 optical link 建起来了。GPU 2 本来应该接 Rail 2，现场却插到 Rail 3，两端仍然可能显示 LinkUp；只有把 actual neighbor 与 Point-to-Point topology 对比，才能发现它接错了位置。[NVIDIA UFM 的 topology comparison](https://docs.nvidia.com/networking/display/infinibandclusterbringupprocedure/confirming-topology-using-ufm-gui)解决的正是这一层。

Topology 对了，还要看 speed、width、FEC、BER、temperature、flap 和 port counter。边缘 optical module 可能空载正常，压力和温度上来以后才出现 corrected error、retransmission 或降速。

最后才轮到 collective。[NCCL Tests](https://github.com/NVIDIA/nccl-tests)会跑 AllReduce、AllGather、ReduceScatter 和 AlltoAll，但 64-GPU pass 不能替代 576 GPU，更不能替代 16 个 SU。Scope 每扩大一层，traffic 才会经过更多 spine、core 和 optical path，之前没被踩到的坏链路也才会暴露。

![LinkUp 怎样逐层收敛为 Schedulable Network Capacity](/images/ai-cluster-network-validation.svg)

于是 installed GPU、network-discovered GPU、topology-correct GPU、full-rate GPU、collective-qualified GPU 和 schedulable GPU 是六种口径。调度器能交付的是它们的交集，不是其中最大的数字。

这也解释了为什么一座 rack 的 72 块 GPU 都健康，仍可能整柜退出大作业资源池。只要其中几块 GPU 挂在错误 rail 或 marginal link 后面，目标 collective 的最慢 rank 就会拖住所有参与者。丢掉一条链路，最后可能丢掉的是一整块可调度资源。

## 谁控制这一千台 Switch

这 1,040 台 switch 属于 NVIDIA Quantum InfiniBand reference design。QM9700 switch、ConnectX-7 NIC、UFM、routing 和 telemetry 都在 NVIDIA 的平台里，客户采购的也不再是彼此独立的 chassis 与 NIC，而是一套已经规定 rail、topology 和管理面的 compute fabric。

这道 control point 已经进入财务结果。NVIDIA FY2027 Q1 的 Data Center networking revenue 达到 [$14.8B，同比增长 199%，环比增长 35%](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027)，占当季总收入约 18%。网络不再只是卖 GPU 时附带的一小块 BOM。

但这 $14.8B 同时包含 NVLink、InfiniBand、Ethernet、NIC 和 switch，NVIDIA 没有单独披露 QM9700 revenue、shipment 或 networking gross margin。于是证据只能走到“平台控制已经变成一笔足够大的收入”，还不能继续算出这 1,040 台 switch 本身贡献了多少利润。

## Price In 只能算到 NVIDIA 这一层

8 月 21 日，NVIDIA 收于 [$214.72，市值约 $5.20T，过去十二个月 EPS 为 $6.53，对应 32.88 倍 P/E](https://stockanalysis.com/stocks/nvda/)。先固定一组简单假设：五年后回到 25 倍 P/E，期间要求 10% annual return。当前价格要求 company-wide EPS 在五年内保持约 16.1% CAGR，计算为 `(32.88 × 1.1^5 ÷ 25)^(1/5) - 1`，也就是五年后 EPS 要比现在高出一倍以上。

这不是 NVIDIA 的目标价。25 倍 exit multiple 和 10% required return 都只是让隐含预期可复算的 scenario；任一假设改变，16.1% 也会跟着改变。它至少划出了一条公司层面的边界：市场已经要求这个 $5T 以上的平台继续多年扩大 earnings，不能再把网络需求增长当成尚未进入价格的事实。

可这条边界不能倒推成 Quantum switch 的 price-in。Networking revenue 只占 NVIDIA 收入的一部分，QM9700 又只是 networking 的一部分，公司没有披露两层 mix 与 margin。**所以“万卡需要一千台 switch”已经被市场看见，NVIDIA networking 到底 price in 了多少仍然无法验证。** 能改变判断的证据，是 networking mix、shipment 与 margin 足以证明这层 earnings path 比 company-wide 16.1% 更陡，而不是再找一个更大的端口预测。

反过来，Ethernet 方案通过同样规模的 collective 与运维验证，或者新增 switch capacity 跑得比 GPU deployment 更快，供给缺口就会收窄。网络依然不可或缺，平台控制带来的 economics 却会减弱。

现在再看 1,040 台 switch，它们不再是一串夸张的 BOM。它们把 9,216 个 400G port 的同时注入，逐层变成一张可验证、可调度的 fabric。网络通过以后，万卡才第一次像一台机器；可这台机器能不能持续吃到 training data、及时写完 checkpoint，还要继续看 storage。
