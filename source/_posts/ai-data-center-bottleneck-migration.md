---
title: 8 IT-GW 到付费任务还有多远
date: 2026-08-22 04:34:27
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Power
  - Infrastructure
  - Agent
  - Investing
i18n_key: ai-data-center-bottleneck-migration
---

PORTS-Pike 那条新闻我看了两遍。第一遍记住了 8 IT-GW，第二遍只盯着两个日期：第一批 800MW 预计 2028 年可用，整个建设周期会持续到 2032 年。

今天签下来的 8GW，要经过发电、输电、机电、rack、验收和调度，最后才会出现在客户的账单上。新闻稿按 GW 计数，收入按完成的任务计数，中间隔着一条很长的交付链。

<!-- more -->

## 六年写在同一条新闻里

这座 Ohio campus 的规模确实夸张。OpenAI 约下 8 IT-GW，SB Energy 计划为项目建设 10GW 新发电，AEP Ohio 的输电基础设施投资是 42 亿美元。NVIDIA 除了投资 SB Energy，还会为最初 4.25 IT-GW 的土地、电力和 shell buildout 提供信用支持。

可我反复看的，是 OpenAI 公告里的另一句话：**只有已经完成、可以交付的 capacity，OpenAI 才开始付租金。**

把自己放进项目会议里就明白了。客户签了，芯片供应商也在桌上，utility 要排负荷，EPC 要排工人，设备商要承诺交期，现场团队还得把几万件东西接起来。任何一条线晚三个月，8 IT-GW 这个数字都不会变，收入日期会变。

所以 8GW 更像一张六年交付日历。每翻过一页，数字都会掉一层。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 620" role="img" aria-labelledby="paid-task-funnel-title" style="max-width: 420px; width: 100%; height: auto; display: block; margin: 10px auto 18px;">
  <title id="paid-task-funnel-title">从签约 IT load 到付费任务的五级交付链</title>
  <defs>
    <marker id="paid-task-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M1,1 L9,5 L1,9 Z" fill="#6b7280"/>
    </marker>
  </defs>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" text-anchor="middle">
    <rect x="46" y="20" width="328" height="82" rx="6" fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
    <text x="210" y="54" font-size="20" font-weight="700" fill="#111827">签下 IT load</text>
    <text x="210" y="81" font-size="15" fill="#4b5563">新闻稿里的 GW</text>

    <path d="M210 102 V132" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow)"/>
    <text x="264" y="122" font-size="13" fill="#6b7280">并网和延期</text>

    <rect x="58" y="140" width="304" height="82" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
    <text x="210" y="174" font-size="20" font-weight="700" fill="#111827">电力和机电就绪</text>
    <text x="210" y="201" font-size="15" fill="#4b5563">powered MW</text>

    <path d="M210 222 V252" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow)"/>
    <text x="268" y="242" font-size="13" fill="#6b7280">验收和良率</text>

    <rect x="72" y="260" width="276" height="82" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
    <text x="210" y="294" font-size="20" font-weight="700" fill="#111827">集群通过验收</text>
    <text x="210" y="321" font-size="15" fill="#4b5563">accepted MW</text>

    <path d="M210 342 V372" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow)"/>
    <text x="260" y="362" font-size="13" fill="#6b7280">调度利用率</text>

    <rect x="86" y="380" width="248" height="82" rx="6" fill="#fff1f2" stroke="#f43f5e" stroke-width="2"/>
    <text x="210" y="414" font-size="20" font-weight="700" fill="#111827">任务进入调度</text>
    <text x="210" y="441" font-size="15" fill="#4b5563">utilized MW</text>

    <path d="M210 462 V492" stroke="#6b7280" stroke-width="2" marker-end="url(#paid-task-arrow)"/>
    <text x="260" y="482" font-size="13" fill="#6b7280">付费转化率</text>

    <rect x="100" y="500" width="220" height="82" rx="6" fill="#f0fdfa" stroke="#0f766e" stroke-width="2"/>
    <text x="210" y="534" font-size="20" font-weight="700" fill="#111827">客户完成付费</text>
    <text x="210" y="561" font-size="15" fill="#4b5563">paid tasks</text>
  </g>
</svg>

我把最后剩下来的 capacity 叫作 **paid-task GW**。这是我自己的记账方法，行业里没有这个标准。它只负责一件事：别让 headline 替我算账。

```text
paid-task GW = contract IT-GW
             × 按时交付率
             × 集群良率
             × 调度利用率
             × 付费转化率
```

签约只决定起点。中间四个乘数，决定一座数据中心什么时候开始赚钱，以及到底能赚多少钱。

## Excel 最爱把 GW 加错

过去一年，公开市场里到处都是 GW。PORTS-Pike 的 8 IT-GW、Stargate 接近 7GW 的 planned capacity、Microsoft 和 Brookfield 的 10.5GW renewable framework，放进 Excel 都长得像同一种数字。

经济含义完全不同。IT-GW lease 对应具体客户和场地，planned capacity 还要等项目落地，PPA 和发电框架只解决能源来源。把它们直接相加，就像把餐厅座位、厨房电力和食材采购额度加在一起，然后宣布今晚能卖多少份晚餐。

需求倒是真的大。IEA 估计全球数据中心用电会从 2024 年的 415TWh 增长到 2030 年的 945TWh。JLL 预计全球 data center capacity 会从 103GW 接近翻倍到 200GW，五年新增约 97GW。

规模越大，口径错一点，最后就会差出几十 GW。每个公开数字都该先回答几个朴素的问题：地点在哪里，哪一年可用，谁负责补电和输电，客户什么时候开始付款，capacity 通过什么验收。

答不出来，我就把这个 GW 留在 lead 那一栏，不放进供给。

## 红灯只能当起点

GPU、HBM、变压器、燃机、液冷、powered land 都缺。这些红灯早就写进 earnings call，也写进估值。继续证明它们很重要，不会自动产生新信息。

上一篇写 Bottleneck Migration Network 时，我最在意的是 bottleneck 扩产之后发生什么。一个节点变红，资本和订单会涌进去；它开始复制供给，又会消耗设备、材料、许可、工人、测试和服务。下一处约束往往藏在扩产动作里。

数据中心里最容易漏掉的是 commissioning。电力设备、MEP module、cooling loop 和 rack fabric 全部到场，仍要经过 FAT、SAT、保护整定、load bank、联调和 burn-in。设备到场只会增加库存，通过验收才会增加 accepted MW。

假设一座 1GW campus 原计划每月验收 100MW，后来掉到 60MW。新闻稿里的 1GW 没少，收入曲线已经被向后推了好几个月。此时比 backlog 更有用的指标，是 first power 的日期、accepted MW per month，以及 mechanical completion 到 revenue service 隔了多久。

**交付率是 headline GW 和收入之间的汇率。**

这层工作很 boring。它不如 GPU 型号性感，也很难出现在 AI 发布会里。可一批长交期设备能不能准时变成可运行容量，靠的就是 qualification、现场组织、备件和维修窗口。红灯负责吸引资本，boring middle layer 负责把资本变成收入。

## Agent 把一瓦拆成两种生意

普通 chat 一来一回。一个 coding Agent 接到任务后，会读文件、检索、调用工具、写代码、跑测试、修错，再验证。用户只点一次，背后可能滚过几十次模型调用。

McKinsey 的 workload 预测把这个变化画得很直接。全球 data center demand 从 2025 年的 82.3GW 增长到 2030 年的 219GW；AI inference 从 20.9GW 增长到 93.3GW，training 从 23.1GW 增长到 62.2GW。到 2030 年，inference 会超过 training。

这会把同一瓦电拆成两种生意。训练和后台任务可以排队、批处理，放到远处的大 campus。客服、browser、office 和 coding Agent 的交互任务要保存状态，还要等 tool call 返回；延迟、网络路径和用户附近的容量都会进入体验。

远郊 GW campus 继续吃训练和后台任务，metro 与 near-metro capacity 开始承担低延迟 inference。电力合同也会被重新区分：哪些负载可以中断、可以错峰，哪些请求晚 500ms 就会让用户觉得产品坏了。

因此，未来的缺口不会平均摊在全球 data center 上。它会沿着 workload 的时间敏感度和地点分开。

## 机房之外也会漏

即使集群准时上线，paid-task GW 还会继续缩水。

想象两个跑在同样 1MW 上的 Agent。一个 tool call 成功率高，能命中 cache，知道什么时候用小模型，失败后不会把整条链重跑。另一个不断 retry，把长上下文反复送进大模型，最后还有一部分任务因为太贵、太慢或结果不可靠而没人付钱。

两边的供电、GPU 和 rack 数量完全一样，收入密度可以差很多。scheduler utilization、模型路由、cache hit rate、tool success rate、retry rate 和 paid conversion，开始决定 tasks per MW。

模型会继续变便宜。量化、蒸馏、MoE、speculative decoding 和更好的 scheduler 都会压低单次推理成本。可便宜未必减少总用量。任务成本从 10 美元掉到 1 美元，原来不值得自动化的工作会被整批交给 Agent，Jevons paradox 很可能再次出现。

这也是 paid-task GW 比 token 更接近生意的原因。token 可以因为 retry 暴涨，也可以因为模型降价贬值；完成任务才有机会进入账单。

下一处 bottleneck 甚至可能不在机房里。它可能藏在 workload scheduler、Agent reliability，或者产品有没有能力把算力消耗变成客户 ROI。

## 回到 Ohio

再看 PORTS-Pike，8 IT-GW 仍然很大。但我会先盯 2028 年第一批 800MW 有没有按时可用，再看每个月多少 MW 通过验收，最后看上线的 cluster 跑出了多少付费任务。

这条链上每掉一个乘数，headline 都不会发警报。新闻稿还是 8GW，PPA 还是 10GW，rack 也已经到场。只有交付日期、利用率和收入开始变。

投资研究也该顺着这条链往下走。已经亮红的设备还能赚钱，下一段 alpha 我会去链上继续找：哪个环节不能被绕开，又能把 accepted MW 往 paid tasks 推一格？

**数据中心最后只认一件事：每一瓦被签下来的电，完成了多少客户愿意付钱的任务。**

## 资料

- [OpenAI: OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [NVIDIA: PORTS-Pike Technology Campus press release](https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute)
- [U.S. DOE: PORTS-Pike energy access fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [OpenAI: five new Stargate sites](https://openai.com/index/five-new-stargate-sites/)
- [IEA: Energy and AI executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)
- [McKinsey: The future of AI workloads](https://www.mckinsey.com/featured-insights/charts/the-future-of-ai-workloads)
- [JLL: 2026 Global Data Center Outlook](https://www.jll.com/en-sea/insights/market-outlook/data-center-outlook)
- [Brookfield and Microsoft renewable energy framework](https://bep.brookfield.com/generation/pdf/document-file.pdf?path=%2Fpress-releases%2Fbep%2Fbrookfield-and-microsoft-collaborating-deliver-over-105-gw-new-renewable-power)
