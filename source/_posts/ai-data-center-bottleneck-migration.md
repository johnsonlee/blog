---
title: 8 IT-GW 之后别再追红灯
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

PORTS-Pike 那条新闻我看了两遍。第一遍看数字：8 IT-GW，至少 10GW 新发电，42 亿美元区域电网基础设施，NVIDIA 给前 4.25 IT-GW 做信用支持。第二遍看日期：第一批 800MW 预计 2028 年可用，完整 buildout 到 2032 年。8 这个数字抢眼，日期更诚实。现在再说电力、变压器、液冷和 powered land 紧张，已经没有什么信息量了。红灯已经亮在屏幕上，也亮在估值里。更值得问的是：这些红灯为了扩产，会把哪一层还没被定价的黄灯点亮？

<!-- more -->

上一篇讲 Bottleneck Migration Network，核心是看复制缺口怎么传播。D0 是根需求，D1 是子系统，D2 是路线，D3 是设备、工艺和 qualification，D4 是底层物理产能。一个 node 变红以后，研究才刚开始。它扩产时会消耗新的设备、材料、工人、许可、测试和资本，下一层黄灯通常就藏在这里。

数据中心是这套框架最好的现场。因为 AI demand 的到达速度越来越像软件，data center capacity 的复制速度仍然像电力工程。

```text
复制缺口 = 供给复制所需时间 - 需求到达所需时间
```

AI 的投资问题不再是“缺不缺 GPU”这么窄。它变成了另一个问题：从新闻稿里的 GW 到客户手上的 token，中间到底漏掉多少？

## 一座数据中心先是一张交付日历

把自己放进 PORTS-Pike 的项目会议里。客户已经签了，芯片供应商也坐在桌上，地方政府希望讲就业，utility 要算负荷，DOE 要看能源和社区影响，开发商要融资，EPC 要排工人，NVIDIA 要保证 rack 到货，OpenAI 要问第一批 workload 什么时候能跑。

这时候，“数据中心由哪些部分组成”会从教材问题变成一张交付日历。任何一条线晚三个月，都不会按时变成可收费 token。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 620" role="img" aria-labelledby="delivery-calendar-title" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="delivery-calendar-title">签约 GW 到可收费 token 的交付日历</title>
  <defs>
    <marker id="cal-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="618" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="36" y="45" font-size="24" font-weight="700" fill="#111827">AI 数据中心不是一栋楼，是五条 deadline 同时收敛</text>
    <text x="36" y="75" font-size="14" fill="#64748b">D0 需求签约以后，D1-D4 的复制链开始消耗电网、设备、施工、rack fabric 和运维能力</text>

    <g font-size="12" fill="#64748b" text-anchor="middle">
      <line x1="170" y1="108" x2="900" y2="108" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="170" y="98">2026</text>
      <text x="316" y="98">2027</text>
      <text x="462" y="98">2028</text>
      <text x="608" y="98">2029</text>
      <text x="754" y="98">2030</text>
      <text x="900" y="98">2032</text>
      <circle cx="170" cy="108" r="4" fill="#64748b"/>
      <circle cx="316" cy="108" r="4" fill="#64748b"/>
      <circle cx="462" cy="108" r="4" fill="#64748b"/>
      <circle cx="608" cy="108" r="4" fill="#64748b"/>
      <circle cx="754" cy="108" r="4" fill="#64748b"/>
      <circle cx="900" cy="108" r="4" fill="#64748b"/>
    </g>

    <g font-size="13" font-weight="700">
      <text x="38" y="154" fill="#0f172a">D0 需求承诺</text>
      <text x="38" y="232" fill="#0f172a">D1 电力路径</text>
      <text x="38" y="312" fill="#0f172a">D1 机房路径</text>
      <text x="38" y="392" fill="#0f172a">D1 集群路径</text>
      <text x="38" y="472" fill="#0f172a">D1 收入路径</text>
    </g>

    <g font-size="13" text-anchor="middle">
      <rect x="150" y="128" width="184" height="44" rx="7" fill="#111827"/>
      <text x="242" y="155" fill="#ffffff" font-weight="700">20 年租约 / IT-GW 需求</text>
      <rect x="360" y="128" width="170" height="44" rx="7" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="445" y="155" fill="#075985" font-weight="700">first 800MW 目标</text>
      <rect x="680" y="128" width="214" height="44" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="787" y="155" fill="#166534" font-weight="700">完整 campus 分阶段交付</text>

      <rect x="146" y="204" width="138" height="54" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="215" y="228" fill="#991b1b" font-weight="700">site + utility</text>
      <text x="215" y="248" fill="#991b1b" font-size="12">AEP / RTO / local</text>
      <rect x="312" y="204" width="138" height="54" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="381" y="228" fill="#9a3412" font-weight="700">generation</text>
      <text x="381" y="248" fill="#9a3412" font-size="12">gas / nuclear / PPA</text>
      <rect x="478" y="204" width="160" height="54" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="558" y="228" fill="#991b1b" font-weight="700">substation + grid</text>
      <text x="558" y="248" fill="#991b1b" font-size="12">transformer / switchgear</text>
      <rect x="666" y="204" width="158" height="54" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="745" y="228" fill="#92400e" font-weight="700">firm power rights</text>
      <text x="745" y="248" fill="#92400e" font-size="12">curtailment / dispatch</text>

      <rect x="146" y="284" width="138" height="54" rx="7" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="215" y="308" fill="#075985" font-weight="700">land + shell</text>
      <text x="215" y="328" fill="#075985" font-size="12">developer / EPC</text>
      <rect x="312" y="284" width="150" height="54" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="387" y="308" fill="#92400e" font-weight="700">MEP modules</text>
      <text x="387" y="328" fill="#92400e" font-size="12">UPS / busway / fire</text>
      <rect x="490" y="284" width="150" height="54" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="565" y="308" fill="#92400e" font-weight="700">cooling loop</text>
      <text x="565" y="328" fill="#92400e" font-size="12">CDU / pump / service</text>
      <rect x="668" y="284" width="150" height="54" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="743" y="308" fill="#5b21b6" font-weight="700">commissioning</text>
      <text x="743" y="328" fill="#5b21b6" font-size="12">acceptance MW/month</text>

      <rect x="146" y="364" width="138" height="54" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="215" y="388" fill="#5b21b6" font-weight="700">GPU / ASIC</text>
      <text x="215" y="408" fill="#5b21b6" font-size="12">NVIDIA / AMD / custom</text>
      <rect x="312" y="364" width="138" height="54" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="381" y="388" fill="#5b21b6" font-weight="700">HBM / package</text>
      <text x="381" y="408" fill="#5b21b6" font-size="12">TSMC / memory</text>
      <rect x="478" y="364" width="138" height="54" rx="7" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
      <text x="547" y="388" fill="#155e75" font-weight="700">network</text>
      <text x="547" y="408" fill="#155e75" font-size="12">switch / optics / DCI</text>
      <rect x="644" y="364" width="160" height="54" rx="7" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
      <text x="724" y="388" fill="#155e75" font-weight="700">rack integration</text>
      <text x="724" y="408" fill="#155e75" font-size="12">firmware / burn-in / yield</text>

      <rect x="146" y="444" width="138" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="215" y="468" fill="#166534" font-weight="700">scheduler</text>
      <text x="215" y="488" fill="#166534" font-size="12">routing / batching</text>
      <rect x="312" y="444" width="150" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="387" y="468" fill="#166534" font-weight="700">SRE capacity</text>
      <text x="387" y="488" fill="#166534" font-size="12">failure / repair / spares</text>
      <rect x="490" y="444" width="150" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="565" y="468" fill="#166534" font-weight="700">paid workload</text>
      <text x="565" y="488" fill="#166534" font-size="12">tasks / MW / margin</text>
      <rect x="668" y="444" width="150" height="54" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="743" y="468" fill="#166534" font-weight="700">token capacity</text>
      <text x="743" y="488" fill="#166534" font-size="12">usable and billable</text>
    </g>

    <g stroke="#64748b" stroke-width="1.7" fill="none" marker-end="url(#cal-arrow)">
      <path d="M334 150 H360"/>
      <path d="M530 150 C590 150 620 150 680 150"/>
      <path d="M284 231 H312"/>
      <path d="M450 231 H478"/>
      <path d="M638 231 H666"/>
      <path d="M284 311 H312"/>
      <path d="M462 311 H490"/>
      <path d="M640 311 H668"/>
      <path d="M284 391 H312"/>
      <path d="M450 391 H478"/>
      <path d="M616 391 H644"/>
      <path d="M284 471 H312"/>
      <path d="M462 471 H490"/>
      <path d="M640 471 H668"/>
    </g>

    <g font-size="12">
      <rect x="38" y="542" width="880" height="44" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="60" y="568" fill="#334155">供应链玩家：hyperscaler / neocloud / developer / utility / RTO / generation / electrical OEM / EPC / cooling / chip / memory / network / SRE</text>
    </g>
  </g>
</svg>

最容易被低估的环节在结尾：commissioning 和 revenue path。市场习惯数订单和 backlog，可 AI 数据中心的供给要到 commissioning 之后才成立。一个 1GW campus，如果验收爬坡率从每月 100MW 掉到 60MW，新闻稿里的 GW 没变，客户能用的算力已经变了。

这也是 supply chain 要往下拆的原因。OpenAI、Microsoft、Amazon、Google、Meta、Oracle、CoreWeave 和 Crusoe 是需求和资本；Equinix、Digital Realty、QTS、CyrusOne 和开发商是 facility；Constellation、Talen、Vistra、Brookfield、AEP、Dominion、PJM、ERCOT 是电力路径；Schneider、Eaton、ABB、Siemens、Vertiv、GE Vernova、Quanta、DPR、Turner 是机电和工程；NVIDIA、AMD、Broadcom、Marvell、Arista、Cisco、TSMC、SK hynix、Micron、Samsung 是集群。

这串名字本身不产生 alpha。alpha 来自交付率变化。谁能把 1GW headline capacity 变成 850MW 可验收、可运行、可收费的 capacity，谁才真的在数据中心里收费。

## 公开 GW 要先交折扣税

现在公开的 GW 已经多到容易让人产生错觉。OpenAI 的 Stargate 已经讲到 nearly 7GW planned capacity 和 10GW commitment；PORTS-Pike 单独给出约 8 IT-GW；Microsoft、Meta、Amazon、Google 也都有 500MW、835MW、1.9GW、3GW、6.6GW、10.5GW 这类能源数字。

这些数字放在同一个 Excel 里，会把人带偏。IT-GW、planned AI capacity、PPA、发电装机、核电开发权和 clean attributes 不是一种东西。它们都能证明 hyperscaler 在抢能源，但只有一部分会在 2030 年前变成可用 AI compute。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 650" role="img" aria-labelledby="gw-haircut-title" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="gw-haircut-title">公开 GW 的折扣税</title>
  <defs>
    <marker id="haircut-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="648" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="38" y="46" font-size="24" font-weight="700" fill="#111827">Headline GW 不是答案，折扣率才是判断</text>
    <text x="38" y="76" font-size="14" fill="#64748b">2030 之前，口径越远离 IT load，变成可用 AI compute 的折扣越重</text>

    <g text-anchor="middle" font-size="13">
      <rect x="54" y="116" width="206" height="74" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="157" y="145" fill="#991b1b" font-weight="700">IT-GW lease</text>
      <text x="157" y="166" fill="#991b1b">按项目日历折扣</text>
      <text x="157" y="184" fill="#991b1b" font-size="12">2030 可用：60-75%</text>

      <rect x="54" y="220" width="206" height="74" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="157" y="249" fill="#1e3a8a" font-weight="700">planned AI capacity</text>
      <text x="157" y="270" fill="#1e3a8a">按选址和电力折扣</text>
      <text x="157" y="288" fill="#1e3a8a" font-size="12">2030 可用：35-55%</text>

      <rect x="54" y="324" width="206" height="74" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="157" y="353" fill="#92400e" font-weight="700">PPA / generation GW</text>
      <text x="157" y="374" fill="#92400e">按本地供电折扣</text>
      <text x="157" y="392" fill="#92400e" font-size="12">2030 可用：5-20%</text>

      <rect x="54" y="428" width="206" height="74" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="157" y="457" fill="#166534" font-weight="700">future nuclear / CFE</text>
      <text x="157" y="478" fill="#166534">按投运年份折扣</text>
      <text x="157" y="496" fill="#166534" font-size="12">2030 前多为期权</text>
    </g>

    <g stroke="#64748b" stroke-width="1.8" fill="none" marker-end="url(#haircut-arrow)">
      <path d="M260 153 C318 153 318 190 370 190"/>
      <path d="M260 257 C318 257 318 230 370 230"/>
      <path d="M260 361 C318 361 318 272 370 272"/>
      <path d="M260 465 C318 465 318 318 370 318"/>
    </g>

    <g text-anchor="middle">
      <path d="M370 150 H860 L800 245 H430 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="615" y="190" font-size="20" fill="#0f172a" font-weight="700">commissioned IT load</text>
      <text x="615" y="216" font-size="13" fill="#334155">PUE / 冗余 / 变电 / MEP / cooling / commissioning</text>

      <path d="M430 275 H800 L746 370 H484 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="615" y="316" font-size="20" fill="#0f172a" font-weight="700">AI-ready cluster</text>
      <text x="615" y="342" font-size="13" fill="#334155">GPU / HBM / network / storage / rack integration</text>

      <path d="M484 400 H746 L706 490 H524 Z" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="615" y="438" font-size="20" fill="#0f172a" font-weight="700">billable token capacity</text>
      <text x="615" y="464" font-size="13" fill="#334155">scheduler utilization / failure rate / paid task conversion</text>
    </g>

    <g font-size="14">
      <rect x="92" y="552" width="796" height="54" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="116" y="584" fill="#0f172a" font-weight="700">Effective GW = headline GW × unit fit × delivery yield × AI-ready fit-out × utilization yield</text>
    </g>
  </g>
</svg>

我的粗略折扣是这样打的：直接 IT-GW lease，按项目日历给 60-75% 的 2030 可用率；planned AI capacity，给 35-55%；PPA 和 generation GW，只能给 5-20%，因为它们解决能源来源，不保证本地 IT load；2030 以后的 nuclear 和 CFE 框架，更多是远期期权。

这个折扣不是精确 forecast，是防止自己被 headline GW 骗。OpenAI / Oracle 的 4.5GW additional 和 Stargate nearly 7GW planned，属于 AI capacity 在途；PORTS-Pike 的 8 IT-GW 是最硬的口径，但完整交付到 2032；Microsoft / Brookfield 的 10.5GW renewable、Meta up to 6.6GW nuclear、Google / Brookfield up to 3GW hydro，更适合放在能源供给和碳匹配那一栏，不能直接加到 AI IT load 里。

需求侧的锚点更冷冰冰。IEA 估计全球数据中心用电从 2024 年 415TWh 到 2030 年 945TWh，增量约等于 60GW 平均 facility load。McKinsey 用 capacity 口径看，全球 data center demand 到 2030 年是 171-219GW，高情景 298GW。JLL 预计 2025-2030 新增 97GW，2030 全球 capacity 约 200GW。

这几个口径不能硬减，但可以做压力测试。假设 JLL 的 97GW 新供给按 80% commissioned、80% AI-ready 通过验收，有效新增只有 62GW 左右。McKinsey 的需求增量是 111-159GW。中间很难只差 10GW，更像几十 GW 到接近 100GW 的量级。模型效率和 workload mix 会把这个数字往回拉，Agent adoption 会把它再往上推。

所以我会把 2030 缺口分成三档：

| 情景 | 需求假设 | 供给折扣 | 2030 左右的可用算力缺口 |
| --- | --- | --- | --- |
| 慢 Agent | Agent 可靠性爬坡慢，推理增长接近基础预测 | 项目延期少，AI-ready fit-out 顺利 | 20-35GW |
| 基准 | coding、office、customer support 进入 Agent workflow | 15-25% capacity 卡在并网、设备、验收和利用率 | 40-70GW |
| Agent upside | 长上下文、tool call、后台任务和并行 worker 成为默认用法 | 供给加速，但转换率被局部电网和 commissioning 锁住 | 80GW+ |

这个缺口本身也不是 alpha。市场已经知道数据中心缺电，已经知道 GEV、VRT、ETN、主流 memory 和 CPO 很重要。更有价值的推演，是看这些已知红灯在扩产时会压出什么新约束。

## 下一盏黄灯藏在交付率里

红灯一旦被 price in，就不该再当结论。它应该变成起点。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 660" role="img" aria-labelledby="next-yellow-title" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="next-yellow-title">已知红灯会把下一盏黄灯点在哪里</title>
  <rect x="1" y="1" width="978" height="658" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="38" y="46" font-size="24" font-weight="700" fill="#111827">不要追已经亮起的红灯，追它正在制造的黄灯</text>
    <text x="38" y="76" font-size="14" fill="#64748b">已知 bottleneck 的扩产，会消耗下一层更具体、更难讲故事的产能</text>

    <g font-size="13" font-weight="700" text-anchor="middle">
      <rect x="36" y="108" width="190" height="38" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="131" y="133" fill="#991b1b">已知红灯</text>
      <rect x="262" y="108" width="190" height="38" rx="7" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="357" y="133" fill="#334155">市场已经会讲</text>
      <rect x="488" y="108" width="220" height="38" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="598" y="133" fill="#92400e">下一层推测</text>
      <rect x="744" y="108" width="190" height="38" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="839" y="133" fill="#166534">观察指标</text>
    </g>

    <g font-size="12" text-anchor="middle">
      <rect x="36" y="170" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="196" fill="#991b1b" font-weight="700">transformer / switchgear</text>
      <text x="131" y="216" fill="#991b1b">电力设备紧张</text>
      <rect x="262" y="170" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="196" fill="#334155">订单 backlog</text>
      <text x="357" y="216" fill="#334155">lead time 拉长</text>
      <rect x="488" y="170" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="196" fill="#92400e" font-weight="700">modular electrical room</text>
      <text x="598" y="216" fill="#92400e">保护整定 / FAT / commissioning</text>
      <rect x="744" y="170" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="196" fill="#166534" font-weight="700">accepted MW/month</text>
      <text x="839" y="216" fill="#166534">验收爬坡率</text>

      <rect x="36" y="252" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="278" fill="#991b1b" font-weight="700">firm power / turbines</text>
      <text x="131" y="298" fill="#991b1b">电源和并网紧张</text>
      <rect x="262" y="252" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="278" fill="#334155">燃机 / PPA / nuclear</text>
      <text x="357" y="298" fill="#334155">大家都在抢 slot</text>
      <rect x="488" y="252" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="278" fill="#92400e" font-weight="700">load flexibility</text>
      <text x="598" y="298" fill="#92400e">可中断负荷 / BESS / 控制系统</text>
      <rect x="744" y="252" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="278" fill="#166534" font-weight="700">curtailment terms</text>
      <text x="839" y="298" fill="#166534">电价与调度权</text>

      <rect x="36" y="334" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="360" fill="#991b1b" font-weight="700">liquid cooling hardware</text>
      <text x="131" y="380" fill="#991b1b">CDU / 冷板放量</text>
      <rect x="262" y="334" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="360" fill="#334155">rack density</text>
      <text x="357" y="380" fill="#334155">100kW+ 机柜</text>
      <rect x="488" y="334" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="360" fill="#92400e" font-weight="700">cooling service loop</text>
      <text x="598" y="380" fill="#92400e">水质 / 备件 / leak / 维修窗口</text>
      <rect x="744" y="334" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="360" fill="#166534" font-weight="700">uptime per MW</text>
      <text x="839" y="380" fill="#166534">停机小时和备件周转</text>

      <rect x="36" y="416" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="442" fill="#991b1b" font-weight="700">GPU / HBM / CPO</text>
      <text x="131" y="462" fill="#991b1b">硬件叙事拥挤</text>
      <rect x="262" y="416" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="442" fill="#334155">算力和带宽</text>
      <text x="357" y="462" fill="#334155">市场最会定价</text>
      <rect x="488" y="416" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="442" fill="#92400e" font-weight="700">rack acceptance yield</text>
      <text x="598" y="462" fill="#92400e">burn-in / firmware / fabric stability</text>
      <rect x="744" y="416" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="442" fill="#166534" font-weight="700">usable cluster ratio</text>
      <text x="839" y="462" fill="#166534">可调度 GPU 占比</text>

      <rect x="36" y="498" width="190" height="58" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="524" fill="#991b1b" font-weight="700">Agent inference</text>
      <text x="131" y="544" fill="#991b1b">推理负载变大</text>
      <rect x="262" y="498" width="190" height="58" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="524" fill="#334155">training campus</text>
      <text x="357" y="544" fill="#334155">远郊 GW 叙事</text>
      <rect x="488" y="498" width="220" height="58" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="524" fill="#92400e" font-weight="700">metro powered capacity</text>
      <text x="598" y="544" fill="#92400e">DCI / peering / stateful routing</text>
      <rect x="744" y="498" width="190" height="58" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="524" fill="#166534" font-weight="700">latency-bound MW</text>
      <text x="839" y="544" fill="#166534">每城可用推理容量</text>

      <rect x="36" y="580" width="190" height="50" rx="7" fill="#fff1f2" stroke="#fecdd3"/>
      <text x="131" y="610" fill="#991b1b" font-weight="700">capex 已经锁定</text>
      <rect x="262" y="580" width="190" height="50" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="357" y="610" fill="#334155">GW 变成折旧</text>
      <rect x="488" y="580" width="220" height="50" rx="7" fill="#fffbeb" stroke="#f59e0b"/>
      <text x="598" y="610" fill="#92400e" font-weight="700">tasks per MW</text>
      <rect x="744" y="580" width="190" height="50" rx="7" fill="#f0fdf4" stroke="#86efac"/>
      <text x="839" y="610" fill="#166534" font-weight="700">gross margin / capex intensity</text>
    </g>
  </g>
</svg>

我会优先看五个还没有被讲烂的方向。

第一是交付率。市场喜欢看 backlog，但 2027-2030 更关键的指标会变成 accepted MW per month。电力设备、MEP module、cooling loop、rack fabric 都到现场以后，还要通过 FAT、SAT、保护整定、load bank、联调和 burn-in。真正拖慢现场的，往往是一堆长交期设备变成可验收容量的组织能力。

第二是负荷可调度性。AI 数据中心拿到电以后，utility 会关心另一个问题：这 500MW 或 1GW 能不能中断，能不能错峰，能不能配 BESS、fuel cell、燃气机组和控制系统。训练负载可以挪时间，Agent inference 的低延迟请求不一定能挪。谁能把 workload 和 power market 接起来，谁就能提高同一份电力合同的有效价值。

第三是 cooling service loop。液冷硬件已经热了，下一步要看服务和可靠性。100kW 以上机柜真正运行起来以后，水质、过滤、腐蚀、接头、备件、leak detection、维修窗口和现场工程师会决定 uptime。硬件卖出去是第一笔钱，减少每 MW 停机小时才是第二笔钱。

第四是 metro inference capacity。训练可以去 Ohio、Texas、Arizona，Agent 推理未必都能去。coding agent、office agent、客服 agent、browser agent 的交互延迟会把一部分需求拉回用户和企业附近。远郊 GW campus 解决训练和后台任务，城市周边的小块 firm power、DCI、peering、stateful routing 可能变成新的稀缺。

第五是 tasks per MW。等 GW 上了资产负债表，问题会从“有没有电”变成“每瓦能产生多少付费任务”。Agent 的 retry rate、tool call 成功率、上下文缓存、模型路由、batching、故障恢复，都会影响同一座数据中心的收入密度。这个 bottleneck 很可能不在机房里，而在调度和产品经济里。

这五个方向的共同点是：它们不太适合放进路演标题。它们更像 boring middle layer。可数据中心的下一段 alpha 大概率就藏在这里，因为已知红灯扩产时，先吃紧的通常是更具体的交付环节。

## Agent 把缺口推向推理地点

普通 chat 是一来一回。Agent workflow 是规划、检索、调用工具、读文件、写代码、跑测试、修错、再验证。用户只提交一次任务，背后可能有几十次模型调用。再加上 multimodal input、browser control、long context、parallel worker，token traffic 会比用户数更快。

McKinsey 的 workload chart 给了一个锚点：全球数据中心 demand 从 2025 年 82.3GW 到 2030 年 219GW；AI inference 从 20.9GW 到 93.3GW，CAGR 约 35%；AI training 从 23.1GW 到 62.2GW，CAGR 约 22%。OpenAI 的流量也已经到消费级软件速度：2025 年 10 月，Sam Altman 说 ChatGPT 有 800 million weekly active users，API 每分钟处理超过 6 billion tokens。

Agent 会把需求拆成两类。后台任务更像训练：可以排队、可以批处理、可以去远处便宜电力。交互任务更像交易系统：对延迟、状态、网络路径和局部容量敏感。未来五年的缺口不会平均摊在全球数据中心上，它会在不同 workload 之间分裂。

```text
Agent demand = active users
             × tasks per user
             × steps per task
             × tokens per step
             × retry rate
             ÷ model efficiency gain
```

```text
Usable compute = commissioned IT load
               × performance per watt
               × rack delivery rate
               × network and storage yield
               × scheduler utilization
               × paid workload conversion
```

模型效率会继续提高。量化、蒸馏、MoE、speculative decoding、KV cache 和更好的 scheduler 都会降低单 token 成本。可 AI 很可能遇到 Jevons paradox：token 变便宜以后，大家会把更多原来不舍得自动化的工作交给模型。效率提升抵消一部分需求，产品扩散又把需求放大。

到 2030 年，如果缺口落在 20-35GW，已知红灯还能解释大部分走势；如果落在 40-70GW，交付率、负荷可调度性和 cooling service loop 会开始重新定价；如果 Agent upside 把缺口推到 80GW 以上，metro inference capacity 和 tasks per MW 会变成更重要的约束。那时市场会从“谁有 GW”，转向“哪一类 GW 能跑哪一类任务”。

## 别把红灯当终点

回到 Ohio。8 IT-GW 当然大，但真正值得盯的是第一批 800MW 到 2028 年，中间每个月有多少 MW 通过验收；2028 到 2032 年，多少 headline GW 变成 AI-ready cluster；cluster 上线以后，多少又变成可收费任务。

已知 bottleneck 还能赚钱，不代表还有最多 alpha。GPU、HBM、燃机、电力设备、液冷这些红灯已经把故事讲得很满。接下来更好的问题是：它们为了扩产，会把订单、风险和毛利推给谁？哪一层能把 press-release GW 变成 paid-token GW？

数据中心这门生意，可能会压缩成一个指标：**每一瓦被签下来的电，有多少变成客户愿意付钱的任务。**

下一盏灯，大概率不在最会讲 AI 故事的地方。

## 资料

- [OpenAI: OpenAI joins PORTS-Pike project](https://openai.com/index/openai-joins-ports-pike-project/)
- [NVIDIA: PORTS-Pike Technology Campus press release](https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute)
- [U.S. DOE: PORTS-Pike energy access fact sheet](https://www.energy.gov/articles/fact-sheet-department-energy-ensuring-affordable-energy-access-ohio-while-powering-future)
- [OpenAI: Stargate advances with Oracle](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)
- [OpenAI: five new Stargate sites](https://openai.com/index/five-new-stargate-sites/)
- [OpenAI: Stargate Community](https://openai.com/index/stargate-community/)
- [IEA: Energy and AI executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)
- [IEA: Energy demand from AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai)
- [DOE / LBNL: 2024 U.S. data center energy use](https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers)
- [McKinsey: AI power and data center capacity](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/ai-power-expanding-data-center-capacity-to-meet-growing-demand)
- [McKinsey: The future of AI workloads](https://www.mckinsey.com/featured-insights/charts/the-future-of-ai-workloads)
- [JLL: 2026 Global Data Center Outlook](https://www.jll.com/en-sea/insights/market-outlook/data-center-outlook)
- [CBRE: North America Data Center Trends H1 2025](https://www.cbre.com/insights/reports/north-america-data-center-trends-h1-2025)
- [LBNL: Queued Up interconnection queue data](https://emp.lbl.gov/queues)
- [Grid Strategies: Power Demand Forecasts Revised Up](https://gridstrategiesllc.com/wp-content/uploads/Grid-Strategies-National-Load-Growth-Report-2025.pdf)
- [Brookfield / Microsoft renewable framework](https://bep.brookfield.com/generation/pdf/document-file.pdf?path=%2Fpress-releases%2Fbep%2Fbrookfield-and-microsoft-collaborating-deliver-over-105-gw-new-renewable-power)
- [Constellation / Microsoft Crane Clean Energy Center](https://www.constellationenergy.com/news/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html)
- [Talen / Amazon nuclear PPA](https://ir.talenenergy.com/news-releases/news-release-details/talen-energy-expands-nuclear-energy-relationship-amazon/)
- [Meta nuclear energy projects](https://about.fb.com/news/2026/01/meta-nuclear-energy-projects-power-american-ai-leadership/)
- [Google / Kairos Power nuclear agreement](https://blog.google/company-news/outreach-and-initiatives/sustainability/google-kairos-power-nuclear-energy-agreement/)
- [Brookfield / Google hydro framework](https://bam.brookfield.com/press-releases/brookfield-and-google-sign-hydro-framework-agreement-deliver-3000-mw-homegrown)
- [NVIDIA DGX GB rack hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html)
