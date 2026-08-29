---
title: GPU 健康率99%可能只剩28%容量
date: 2026-08-23 10:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-cluster-delivery
---

机房已经达到 Ready for Service（RFS），128 座 GB200 NVL72 rack 全部上电，硬件清单里也出现了 9,216 块 GPU。站在项目进度表上看，rack installation 已经 100% 完成；health dashboard 里有 9,124 块显示 Healthy，约 99%。

沿着硬件清单看，只要把剩下 92 块修好，项目就会得到一座 100% Healthy 的万卡集群。可 Production 仍然不能只接手一个百分比。每块 GPU 分别正常，并不能证明它们之间的 NVLink、scale-out network、storage path 和 scheduler allocation 已经组成一套可以工作的系统。

**GPU 都正常就算万卡集群了吗？** Production 要接手的，是 scheduler 能按什么形状、把多少 GPU 反复交给一个具体 workload。

<!-- more -->

## 机房已经 RFS 为什么还没有万卡集群？

RFS 关闭的是 facility scope：电力、散热、消防和控制系统已经具备交付条件。Rack 上电以后，项目开始交付另一种东西：能够被 workload 使用的 resource。

[NVIDIA 对 AI Cloud 的要求](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home)把 Delivered、Healthy、Reserved 和 Active/In-Use 分成四个指标。GPU 交到了、硬件健康、资源已经预留、workload 正在使用，是四种不同状态。同一份要求还同时记录 per-host health 和 cluster、nodegroup、reservation 等 logical primitive 的聚合状态。

这条状态链没有把同一件事反复验收。每往前一步，交付对象都在变化：rack 属于资产清单，node 属于管理面，topology block 才是 scheduler 能够 reserve 的 resource，job 跑起来以后才进入 Active/In-Use。

## 9,216 块 GPU 为什么还要变成同一种机器？

刚上架的 node 只有 serial number、BMC、MAC、switch port 和 rack position。它们先要与 inventory 对上，再领取所属 category 的 software image，落下 disk layout、kernel、driver、network config 和 scheduler registration。

[NVIDIA Base Command Manager](https://docs.nvidia.com/dgx-superpod/administration-guide-dgx-superpod/latest/cluster-management.html)把 software image 定义成 node local filesystem 的 blueprint。Image 可以锁定，也可以重新同步。重点不在第一台能不能 boot，而在第 1 台和第 1,000 台经过同一条 pipeline 后，能否得到可比较、可复现的状态。

仅仅使用同一个 OS image 还不够。GPU、NIC、NVLink switch 与 management controller 的 firmware 也要落在 approved baseline 里。[NVIDIA Mission Control](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.3.0/autonomous-hardware-recovery.html)会把实际 firmware 与 Source of Truth（SOT）file 里的 expected version 逐项比较；测试阈值和其它 expected value 则来自 Golden Config File。版本可以运行，不等于它属于这次 cluster qualification 的 baseline。

走完 provisioning，9,216 块 GPU 才从一批上电的硬件，变成一批 baseline-matched node。这里解决的是一致性，还没有回答这些 node 能组成多少可用 capacity。

## 同样 99% Healthy 为什么容量差 6,480 块 GPU？

假设 health dashboard 里有 9,124 块 GPU 显示 Healthy。最直接的算法，是把这 9,124 块全部算成可用算力。可 scheduler 接到的不是“尽量多给几块 GPU”，而是一个带有 node 数量和 topology 约束的 resource request。

资源不够，job 会继续排队；开启 block topology 后，scheduler 还要把 job 放进能够容纳它的 contiguous block，并尽量减少 fragmentation。[Slurm 的 topology 文档](https://slurm.schedmd.com/topology.html)明确规定，指定 node 与 block placement 冲突时不会获得 allocation，互不相邻的 block 也不能拼成一次请求。

[NVIDIA 的 NVL72 Enterprise Reference Architecture](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/overview.html)把 72 块 GPU 放进同一个 NVLink domain。整个 rack 可以组成一块“massive GPU”，每个 compute tray 也能独立运行。究竟按 tray、node、完整 rack，还是更大的 multi-rack block 交付，取决于 workload 与 acceptance scope。

先取一个最严格、也最容易看清差异的口径：客户要的是完整 NVL72 rack，含 unavailable GPU 的 rack 暂不计入交付。

![相同 GPU 健康率怎样变成不同的完整 Rack 容量](/images/ai-cluster-health-topology.svg)

92 块 unavailable GPU 如果集中在两座 rack，剩下 126 座完整 rack，对应 9,072 块 GPU；如果它们各自落在 92 座 rack，完整 rack 只剩 36 座，对应 2,592 块 GPU。两边都有 9,124 块 Healthy GPU，完整 rack capacity 却相差 6,480 块。

这个算例不预测真实项目的 yield，只用来暴露 health rate 丢掉的信息：故障落在哪里、交付单位多大、job 要求怎样的 topology。Workload 只需要四块 GPU 时，那些不完整的 rack 仍可能贡献大量容量；workload 要跨八座相邻 rack 时，完整 rack 还要继续组合成更大的 contiguous block，fragmentation 又会吃掉一层。

**Cluster capacity 不能脱离 workload 计算。它是 health map、topology 和 allocation shape 共同作用的结果。**

## 单机 Healthy 为什么不能直接相加？

把 18 台 compute node 的 per-host health 加在一起，并不会自动得到一个 Healthy NVLink domain。单机 health check 能发现 GPU memory、temperature、firmware 或 NIC 异常，看不见 node 之间共享的 NVLink；继续扩大到 multi-rack，又会加入 scale-out fabric、storage path 和 scheduler placement。验收方可以不变，验收对象已经从 Node 变成 Rack、Topology Block，最后变成一次完整的 Job Allocation。

Mission Control 因此把 baseline testing 从 compute node 扩到完整 rack 和 multi-rack configuration。Firmware 先与 SOT 对齐，测试参数再落到 Golden Config；Single Rack Testing 通过后，periodic alarm 才会自动启用；再往上，multi-rack test 才能把 scale-out path 和更大的 failure domain 压起来。

![从单机 Healthy 到可交付 Topology Block](/images/ai-cluster-handoff-gates.svg)

每一层验证的对象都在扩大。Per-host health 排除坏 node，rack test 验证一个 NVLink domain，multi-rack test 验证 topology block，representative workload 再验证 scheduler、storage、checkpoint 与 failure recovery 能否同时成立。可交付容量的单位也随之改变。

运行期间也一样。Mission Control 的 Slurm lifecycle checks 在 node 初次确认 healthy 后才能启用，默认并不开启；启用以后，Prolog 失败会把 node 标成 DRAIN，并让 job 重新排队。Dashboard 上的 available GPU 变少了，系统却避免把一个已知异常的 node 塞回 distributed job。少报几块 GPU，不一定是 capacity 变差，也可能是 health gate 终于开始诚实工作。

## Production 到底接手什么？

走到这里，Production 接手的就不能只是一句“9,124 块 GPU 已经 Healthy”。它至少要知道这批资源按什么 topology 组织，哪些 block 已经通过哪种 workload，使用的是哪套 firmware、OS、driver 与 container baseline，哪些 exception 仍然打开，node 退出和重新加入 partition 又要重跑哪一层验证。

![Production Handoff 怎样把容量口径固定下来](/images/ai-cluster-production-handoff.svg)

一份可复查的 handoff，可以写成一句完整的话：在某一版 baseline 下，有多少个指定形状的 topology block，通过了某种 workload 和 failure-recovery threshold，并且能够被 scheduler 重复 reserve。GPU 数量、scope、版本、通过条件和时间必须同时存在，少一个，capacity 就又退回了库存统计。

这也解释了为什么 Production Handoff 不是永久盖章。Firmware、driver、network topology 或 scheduler policy 改了，原来的 acceptance evidence 就只对未改变的 scope 有效。一次 sign-off 能关闭项目交付，持续的 health gate 才能守住 operational capacity。

## 谁能从 Acceptance 留下 Economics？

如果客户买的是完整 topology block，价值会从 server shipment 延伸到 acceptance。控制 golden baseline、跨层 validation、exception closure 和 block rejoin 的一方，离客户等待的结果更近。

但这一步不能直接映射成一只股票。[NVIDIA 的 SuperPOD FAQ](https://docs.nvidia.com/dgx-superpod/faq/latest/dgx-superpod.html)把 SuperPOD 定义成包含 BOM、installation、support 和 guaranteed performance 的 turnkey solution；AI Cloud 模式里，交付方又变成向 NVIDIA 提供 capacity 的 cloud partner。OEM、NVIDIA、system integrator、cloud operator 和客户 Production team 的边界会随合同改变，公开资料并没有统一答案。

这意味着 shipment revenue 不能证明某家公司拿走了 acceptance economics，软件收入也没有单独披露 accepted topology block、first-pass block yield、time-to-handoff 或 recovery SLO。链路在 company segment 之前就断了，当前的 price-in disposition 只能是 **Unverified**。

要把它升级成可计算的判断，至少要看到 acceptance milestone 怎样触发 revenue、每周有多少 topology block 首次通过、返工多久、支持服务怎样收费，以及这些数字能否回到公司的 segment margin 和 cash flow。相反，如果客户在 shipment 时就完成付款，validation 能被标准工具快速自动化，不同 integrator 的 handoff time 逐渐收敛，这个 control point 就很难留下额外 economics。

## 万卡集群到底用什么单位交付？

回到开头的三个数字。9,216 是 installed inventory，9,124 是 per-host Healthy；在完整 NVL72 rack 的交付口径下，同一批 Healthy GPU 可能组成 9,072 块 full-rack capacity，也可能因为故障分散只剩 2,592 块。继续扩大到 multi-rack training job，答案还要再经过 topology placement 与 workload acceptance。

所以 Production Handoff 关闭的问题已经从“GPU 有没有装完”变成：**这批 GPU 能否在指定 baseline 下，按约定的形状，被 scheduler 反复交给约定的 workload。**

到这里，Facility、Rack 和 Cluster 才依次完成交付。同一座 healthy cluster 到了 Training 和 Inference 手里，allocation shape、运行时间与容错方式还会继续改变。下一层需要追的，已经不是有多少 GPU，而是同一 MW 最后能完成多少工作。
