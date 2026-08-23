---
title: 15TB Checkpoint 为什么只有 5 秒？
date: 2026-08-23 09:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-storage-hierarchy
---

十万个 accelerator 训练一个 1T parameter model，多久保存一次进度才算合理？[MLCommons 给出的答案](https://mlcommons.org/2025/08/storage-2-checkpointing/)是 1.5 分钟。每份 checkpoint 有 15TB，留给它的时间却只有 4.4 秒。

把 15TB 除以 4.4 秒，答案接近 3.6TB/s。看起来只要堆出足够高的 storage bandwidth，问题也就解决了。

可这 4.4 秒不是 SSD 跑分，也不是随手定下的 SLA。它从整个 cluster 多久会坏一次开始，最后卡在 1,024 个 process 里最慢的那一个。**要交付的不是 3.6TB/s，而是一份能让十万 accelerator 训练继续向前走的 recovery point。**

<!-- more -->

## 4.4 秒来自故障，不来自 SSD

单台 server 的故障并不稀奇，换一台继续服务即可。同步训练却把数万块 accelerator 放进同一个 job：每个 rank 都要参与同一轮参数更新，一个节点掉队，其他节点也只能停下来等。

[Meta 训练 Llama 3 405B](https://arxiv.org/abs/2407.21783)时，16,384 块 H100 在 54 天里经历了 419 次非计划中断。MLCommons 用这组现场数据外推 cluster failure rate，再按两次预期故障之间保存约 20 次的规则，得到 16,000 accelerator 每 9.3 分钟保存一次；规模增至 100,000，间隔便缩到 1.5 分钟。

Checkpoint 太少，故障后要重算更多 step；checkpoint 太频繁，GPU 又会把更多时间花在保存而不是训练。若把保存开销限制在总训练时间的 5%，90 秒的 interval 最多只能让出约 4.5 秒。MLCommons 模型给出的精确窗口是 4.4 秒。

![Cluster 越大，Checkpoint 窗口越窄](/images/ai-storage-checkpoint-window.svg)

所以 5 秒不是所有大模型训练都必须遵守的常数。Model size、cluster size、故障率或允许的同步保存开销改变，pause window 都会跟着变。在 synchronous checkpoint 的口径下，方向不会：**cluster 扩得越大，故障来得越密，留给 storage 的暂停时间反而越短。**

## 3.6TB/s 还不是完成条件

15TB 也不是一条从头写到尾的大文件。在 MLPerf Storage 的 1T model workload 里，13.2TB 来自 optimizer state，整份 checkpoint 由 1,024 个 process 并行保存。平均到每个 process，大约是 15GB，必须一起落下去。

这时 aggregate bandwidth 很容易制造错觉。1,023 个 process 在 4 秒内完成，最后一个因为 client、network path、metadata、drive 或 background task 拖到 5 秒，这份 checkpoint 的完成时间就是 5 秒。MLCommons 的计分也按最慢 process，而不是 steady-state average。

![Checkpoint 完成时间由最慢的 Process 决定](/images/ai-storage-checkpoint-tail.svg)

于是 3.6TB/s 只是必要条件。Storage fabric 要把 1,024 路并发分散到足够多的 controller 和 media，filesystem 要处理同时出现的 file 与 metadata operation，client stack 还要避免某个 node 掉出 tail。漂亮的 sequential throughput 无法证明这条路径已经通过。

Load 更不能省略。Save 发生时，job 还在争取少停几秒；真正需要 load 时，整个 cluster 已经停了。写得快却读不回来，或者只有原节点能读，保存下来的只是一批文件，不是 recovery point。

## GPU 继续训练，不等于保存成功

同步 checkpoint 会让训练一直停到 write 完成，4.4 秒直接约束 storage。Async checkpoint 可以先把 training state snapshot 到 host memory 或 local NVMe，让 GPU 提前进入下一轮计算，再在后台 flush 到 shared storage。

前台 pause 的确缩短了，故障边界却没有消失。副本只在故障节点上时，node 或 rack 一起退出，计算进度和 checkpoint 仍可能同时丢掉。[MLCommons 的 local NVMe subset mode](https://mlcommons.org/2025/08/storage-2-checkpointing/)也明确不提供完整 fault tolerance，除非再配一层 storage 或额外软件。

![Checkpoint 从快速快照走到可恢复状态](/images/ai-storage-checkpoint-durability.svg)

一份 checkpoint 因此至少跨过三个状态：snapshot 已离开 accelerator memory，GPU 可以继续；checkpoint data 已进入 shared high-performance storage，另一台 node 可以读取；保留副本再离开 shared HPS 自身的 system 或 site failure domain，进入独立的 protection domain。Async checkpoint 只是把第一个状态提前，并没有删掉后两个状态。

Multi-buffering 可以让上一份 checkpoint 在下一轮 snapshot 到来以后继续 flush，却不能让积压无限增长。100,000 accelerator 的 interval 只有 90 秒；若每轮都写入 15TB，长期 drain rate 仍要追上接近 200GB/s 的产生速度，每天超过 14PB。Burst 被挪到后台以后，capacity、endurance 和持续吞吐照样要付账。

## Object Storage 为什么不在 4.4 秒这条 Hot Path

这也解释了为什么一座 cluster 同时需要 local NVMe、high-performance storage 和 object storage。它们不是同一块容量的三个报价，而是 checkpoint 走向不同故障边界的三段路径。

[NVIDIA 把 DGX SuperPOD 的 high-performance storage 称为 inner ring](https://docs.nvidia.com/dgx-superpod/faq/latest/dgx-superpod.html)，要求使用经过认证的 file storage；object store 或 data lake 则在 outer ring，由客户另行采购。Object storage 适合容量与保留，也可以把副本带离 inner-ring storage 的 system 或 site failure domain；这不等于它已经通过上千个 process 在几秒内同时 save、随后从另一批 node load 的 hot path。

Training dataset 与 KV Cache 也会经过 storage，但不能和 checkpoint 合成一个“AI storage demand”。Dataset 主要消耗持续 read 与 metadata，KV Cache 先受 HBM、host memory 和重算成本约束；只有 checkpoint 会在同一个训练 step 上制造同步 write burst，并把最慢 process 变成整座 cluster 的 pause。

所以容量预测最容易算，交付判断却要看另一组证据：目标 model 与 process 数下的 save duration、最慢 process、load duration、remote readability、连续多轮 checkpoint 后的 buffer 水位，以及故障后能否从同一个 global step 恢复。

## 五秒卖的不是 NAND Bit

沿着这组证据继续往下，storage 什么时候算交付也清楚了。NAND 出货、SSD 到场、filesystem mount 都发生得更早；只有目标 workload 的 save、load 和 recovery 通过 acceptance，这套 storage 才真正进入 cluster capacity。

控制点因此落在一整套 qualified system，而不是单颗 NAND。[NVIDIA 当前的 DGX SuperPOD certified storage 名单](https://docs.nvidia.com/certification-programs/certified-storage/latest/systems-list.html)同时包含 Dell PowerScale、DDN、IBM Storage Scale、NetApp、Everpure FlashBlade、VAST 和 WEKA。认证把没有通过平台验证的方案挡在外面，却没有把客户锁进唯一供应商。

走到这里，price-in 只能写成 **Unverified**。公开资料能够确认哪些 system 通过了 certification，却无法把目标 cluster 的 checkpoint acceptance 继续映射到其中一家公司的 accepted capacity、shipment、ASP、margin 或 backlog。名单里还有多条替代路径，customer、integrator 与 storage vendor 谁控制最终 acceptance 也会随项目改变。在这条链闭合以前，把任意一家公司的估值倒推成 checkpoint earnings，只会把产业相关性误写成价值捕获。

要把 Unverified 改成 Calculated，下一份证据不是另一个 exabyte forecast，而是同一条交付链上的 commercial data：目标 cluster 的 qualified design win、accepted capacity、system ASP、gross margin，以及这些数字在公司 segment 里足够 material。反过来，async checkpoint 大幅降低 shared-storage burst、更多方案快速通过同一套 acceptance，或者 certified capacity 比 cluster deployment 复制得更快，这道约束就会继续向别处迁移。

现在再看 15TB 和 5 秒，它们已经不是一笔简单的容量除法。十万个 accelerator 能不能继续训练，取决于 1,024 个 process 能否全部完成，再从“GPU 可以继续”走到“另一台 node 可以恢复”。Network 把万卡连成一台机器；checkpoint 则决定这台机器坏过以后，还能不能从原来的位置继续向前。
