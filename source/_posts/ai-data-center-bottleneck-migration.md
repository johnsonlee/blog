---
title: 当算力变成吉瓦生意
date: 2026-08-21 22:54:04
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

2026 年 8 月，OpenAI 把 Ohio 的 PORTS-Pike 项目放到台面上：约 8 IT-GW，首批 800MW 预计 2028 年可用，完整建设一路排到 2032 年。它背后是一整套工业系统：至少 10GW 新发电、42 亿美元区域电网基础设施、NVIDIA 对前 4.25 IT-GW 的信用支持、20 年租约、许可、环评、融资和六年施工。

新闻稿讲投资和就业。瓶颈框架会把它翻译成另一个问题：AI 需求已经按软件速度到达，数据中心供给能不能按工业速度复制？

<!-- more -->

我在上一篇「复制速度才是真正的瓶颈」里用了一个 Bottleneck Migration Network：D0 是根需求，D1 是子系统，D2 是技术路线，D3 是设备、部件、工艺和认证，D4 是共享的物理产能。Depth 不变，红灯会迁移。

这篇只放大其中一颗 D0 根：Data Center。

判断 AI 数据中心，先别问谁签了多少 GW。先问三个更硬的问题：

1. 一座能提供 AI power capacity 的数据中心，到底由哪些层组成，谁在每层收费？
2. 公开的 GW 数字里，多少是 IT load，多少只是发电、PPA、清洁属性或未来开发框架？
3. Agent 流量起来以后，需求到达时间和供给复制时间之间，会差出多少可用算力？

核心公式很简单：

```text
复制缺口 = 供给复制所需时间 - 需求到达所需时间

瓶颈强度 ∝ 需求冲击 × 供给刚性 × 复制缺口
```

AI 数据中心的麻烦在这里：需求侧像软件，供给侧像电力工程。

## 数据中心这颗 D0 根

一座 AI 数据中心不是「买 GPU 后找地方插电」。顺序反过来了：先找能按期交付的大块电，再把土地、输电、变电站、壳体、MEP、冷却、rack、网络、存储、调度和运维压进同一个上线日期。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 640" role="img" aria-labelledby="dc-network-title" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="dc-network-title">AI 数据中心的 Bottleneck Migration Network</title>
  <defs>
    <marker id="dc-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
    <marker id="dc-purple-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#7c3aed"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="638" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="38" y="45" font-size="24" font-weight="700" fill="#111827">Data Center 这颗 D0 根，红灯会沿着复制链迁移</text>
    <text x="38" y="75" font-size="14" fill="#64748b">Depth 固定：D0 根需求 → D1 子系统 → D2 路线 → D3 设备/工艺 → D4 共享产能</text>

    <g font-size="12" font-weight="700" text-anchor="middle">
      <rect x="34" y="104" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="125" fill="#334155">D0</text>
      <rect x="34" y="184" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="205" fill="#334155">D1</text>
      <rect x="34" y="286" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="307" fill="#334155">D2</text>
      <rect x="34" y="408" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="429" fill="#334155">D3</text>
      <rect x="34" y="536" width="70" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <text x="69" y="557" fill="#334155">D4</text>
    </g>

    <g stroke="#cbd5e1" stroke-width="1">
      <line x1="120" y1="200" x2="940" y2="200"/>
      <line x1="120" y1="302" x2="940" y2="302"/>
      <line x1="120" y1="424" x2="940" y2="424"/>
      <line x1="120" y1="552" x2="940" y2="552"/>
    </g>

    <g text-anchor="middle" font-size="14">
      <rect x="416" y="96" width="148" height="48" rx="7" fill="#111827"/>
      <text x="490" y="126" fill="#ffffff" font-weight="700">AI 数据中心</text>

      <rect x="128" y="176" width="130" height="48" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="193" y="205" fill="#1e3a8a" font-weight="700">电力</text>
      <rect x="288" y="176" width="130" height="48" rx="7" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
      <text x="353" y="205" fill="#155e75" font-weight="700">土建 MEP</text>
      <rect x="448" y="176" width="130" height="48" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="205" fill="#92400e" font-weight="700">冷却密度</text>
      <rect x="608" y="176" width="130" height="48" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="205" fill="#5b21b6" font-weight="700">集群</text>
      <rect x="768" y="176" width="130" height="48" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="205" fill="#166534" font-weight="700">调度运维</text>

      <rect x="118" y="270" width="150" height="64" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="193" y="296" fill="#991b1b" font-weight="700">firm power</text>
      <text x="193" y="316" fill="#991b1b" font-size="12">并网/输电/变电</text>
      <rect x="286" y="270" width="134" height="64" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="353" y="296" fill="#9a3412" font-weight="700">EPC 交付</text>
      <text x="353" y="316" fill="#9a3412" font-size="12">壳体/消防/验收</text>
      <rect x="446" y="270" width="134" height="64" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="296" fill="#92400e" font-weight="700">液冷路线</text>
      <text x="513" y="316" fill="#92400e" font-size="12">CDU/冷板/水路</text>
      <rect x="606" y="270" width="134" height="64" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="296" fill="#5b21b6" font-weight="700">rack fabric</text>
      <text x="673" y="316" fill="#5b21b6" font-size="12">GPU/HBM/网络</text>
      <rect x="766" y="270" width="134" height="64" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="296" fill="#166534" font-weight="700">可收费任务</text>
      <text x="833" y="316" fill="#166534" font-size="12">利用率/可靠性</text>

      <rect x="118" y="392" width="150" height="64" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="193" y="418" fill="#991b1b" font-weight="700">变压器 switchgear</text>
      <text x="193" y="438" fill="#991b1b" font-size="12">UPS / busway / cable</text>
      <rect x="286" y="392" width="134" height="64" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="353" y="418" fill="#9a3412" font-weight="700">熟练工</text>
      <text x="353" y="438" fill="#9a3412" font-size="12">高压/低压/调试</text>
      <rect x="446" y="392" width="134" height="64" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="418" fill="#92400e" font-weight="700">泵 阀 接头</text>
      <text x="513" y="438" fill="#92400e" font-size="12">leak detection</text>
      <rect x="606" y="392" width="134" height="64" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="418" fill="#5b21b6" font-weight="700">CoWoS optics</text>
      <text x="673" y="438" fill="#5b21b6" font-size="12">switch / storage</text>
      <rect x="766" y="392" width="134" height="64" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="418" fill="#166534" font-weight="700">SRE 调度器</text>
      <text x="833" y="438" fill="#166534" font-size="12">故障/排队/定价</text>

      <rect x="112" y="520" width="162" height="64" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="193" y="546" fill="#991b1b" font-weight="700">铜 电工钢 许可</text>
      <text x="193" y="566" fill="#991b1b" font-size="12">interconnection queue</text>
      <rect x="286" y="520" width="134" height="64" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
      <text x="353" y="546" fill="#9a3412" font-weight="700">劳动力池</text>
      <text x="353" y="566" fill="#9a3412" font-size="12">区域承包商</text>
      <rect x="446" y="520" width="134" height="64" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="513" y="546" fill="#92400e" font-weight="700">水权 噪音 社区</text>
      <text x="513" y="566" fill="#92400e" font-size="12">冷却许可</text>
      <rect x="606" y="520" width="134" height="64" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="673" y="546" fill="#5b21b6" font-weight="700">晶圆 HBM 基板</text>
      <text x="673" y="566" fill="#5b21b6" font-size="12">封装产能</text>
      <rect x="766" y="520" width="134" height="64" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="833" y="546" fill="#166534" font-weight="700">客户工作流</text>
      <text x="833" y="566" fill="#166534" font-size="12">ROI / 付费转化</text>
    </g>

    <g stroke="#64748b" stroke-width="1.8" fill="none" marker-end="url(#dc-arrow)">
      <path d="M490 144 C420 158 250 155 193 176"/>
      <path d="M490 144 C430 166 374 166 353 176"/>
      <path d="M490 144 C500 166 510 166 513 176"/>
      <path d="M490 144 C560 166 632 166 673 176"/>
      <path d="M490 144 C670 158 780 156 833 176"/>
      <path d="M193 224 V270"/>
      <path d="M353 224 V270"/>
      <path d="M513 224 V270"/>
      <path d="M673 224 V270"/>
      <path d="M833 224 V270"/>
      <path d="M193 334 V392"/>
      <path d="M353 334 V392"/>
      <path d="M513 334 V392"/>
      <path d="M673 334 V392"/>
      <path d="M833 334 V392"/>
      <path d="M193 456 V520"/>
      <path d="M353 456 V520"/>
      <path d="M513 456 V520"/>
      <path d="M673 456 V520"/>
      <path d="M833 456 V520"/>
    </g>
    <path d="M240 302 C340 350 555 350 626 302" stroke="#7c3aed" stroke-width="2" stroke-dasharray="7 6" fill="none" marker-end="url(#dc-purple-arrow)"/>
    <text x="430" y="362" font-size="12" fill="#6d28d9" text-anchor="middle">替代路线：换区域、behind-the-meter、自建电源、换芯片/网络架构</text>

    <g font-size="12">
      <rect x="620" y="602" width="18" height="12" rx="3" fill="#fee2e2" stroke="#dc2626"/>
      <text x="646" y="612" fill="#475569">红：当前更可能卡住</text>
      <rect x="770" y="602" width="18" height="12" rx="3" fill="#fef3c7" stroke="#d97706"/>
      <text x="796" y="612" fill="#475569">黄：候选瓶颈</text>
    </g>
  </g>
</svg>

D0 不会移动。AI 需要 Data Center 这颗根。会移动的是红灯：2023 年红灯在 GPU，2024 年移到 HBM 和 CoWoS，2025 年开始压到 powered land、并网、电力设备和液冷，2026 年 PORTS-Pike 这样的项目把整条链暴露出来。

一座能提供 AI power capacity 的数据中心，大概有六段复制链。

第一段是 power-ready site。过去选址看土地、税、网络和客户距离；现在先看 utility 能不能给出 300MW、500MW、1GW 的 firm delivery date。CBRE 说 18 到 36 个月内能拿到电的 site 已经很抢手，200MW 以上电力的大地块优先级越来越高。

第二段是发电、输电和并网。PPA 解决长期采购，不能自动解决本地瞬时供电。AI cluster 要的是稳定、可调度、可并网，还要尽量满足碳目标。于是核电、燃气、hydro、geothermal、solar plus battery、behind-the-meter 都被拉进同一张图。

第三段是 shell、MEP 和配电。高压电进站以后，要经过变压器、switchgear、UPS、PDU、busway，最后喂到 rack。NVIDIA DGX GB rack 的功耗量级约 120kW。以前 10-20kW 一个 rack 已经算高密度，现在 100kW 以上才是 AI campus 的起点。

第四段是冷却。高密度 rack 会把 direct-to-chip liquid cooling、CDU、冷板、泵、管路、leak detection、冷机和热交换系统放到关键路径。冷却不是配角，它决定同一块地能塞进多少 IT load。

第五段是 rack fabric。GPU、HBM、NVLink 或 Ethernet fabric、optics、storage、server integration 必须一起到货。单拿到 GPU 还不够，训练 cluster 要 scale-up 和 scale-out 网络，推理 cluster 要成本、延迟、地理分布和利用率。

第六段是运维和收入。客户最终购买的是可用 token capacity：低故障、低延迟、能被调度器吃满，最后能变成付费任务。

所以供应链玩家也要分层看。OpenAI、Microsoft、Amazon、Google、Meta、Oracle、CoreWeave、Crusoe 负责把需求和资本开出来；Equinix、Digital Realty、QTS、CyrusOne 和各类开发商负责 facility 交付；Constellation、Talen、Vistra、Brookfield、AEP、Dominion、PJM、ERCOT 这类电力和电网玩家控制供电路径；Schneider、Eaton、ABB、Siemens、Vertiv、GE Vernova、Quanta、DPR、Turner 这类设备和工程公司卡住机电交付；NVIDIA、AMD、Broadcom、Marvell、Arista、Cisco、TSMC、SK hynix、Micron、Samsung 再把 cluster 填进去。

NVIDIA 仍然重要。只是当项目变成 GW scale，真正稀缺的能力变成：把土地、电、设备、机房和芯片压成同一个可交付日期。

## 公开 GW 合同要走漏斗

截至 2026-08-21，公开市场已经有很多 GW 数字。最大误读，是把所有 GW 直接相加。

GW 有四种常见口径。

- IT-GW：服务器和 rack 真正吃到的 IT load，最接近可用算力。PORTS-Pike 的 8 IT-GW 属于这个口径，但仍然是分阶段、带条件的未来容量。
- Facility power：数据中心园区或建筑侧用电，含 PUE、冗余和基础设施损耗。
- Generation / PPA GW：发电装机、电力采购或 offtake 框架，解决能源来源，不等于本地 IT load。
- Clean attributes：清洁电力属性、时间匹配和碳目标，能支持 ESG 和长期供电策略，不能当成 GPU 容量。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 610" role="img" aria-labelledby="gw-funnel-title" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="gw-funnel-title">公开 GW 到可用 AI 算力的漏斗</title>
  <defs>
    <marker id="funnel-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L9,5 L1,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="978" height="608" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="40" y="46" font-size="24" font-weight="700" fill="#111827">Headline GW 先分口径，再过交付漏斗</text>
    <text x="40" y="76" font-size="14" fill="#64748b">同一张表里混着 IT-GW、planned capacity、PPA、发电装机和清洁属性，直接相加会错</text>

    <g text-anchor="middle" font-size="13" font-weight="700">
      <rect x="52" y="112" width="180" height="70" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="142" y="141" fill="#991b1b">IT-GW</text>
      <text x="142" y="162" fill="#991b1b" font-size="12">PORTS-Pike 8 IT-GW</text>
      <rect x="282" y="112" width="180" height="70" rx="7" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="372" y="141" fill="#1e3a8a">planned AI capacity</text>
      <text x="372" y="162" fill="#1e3a8a" font-size="12">Stargate 近 7GW</text>
      <rect x="512" y="112" width="180" height="70" rx="7" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="602" y="141" fill="#92400e">PPA / generation</text>
      <text x="602" y="162" fill="#92400e" font-size="12">renewable / nuclear</text>
      <rect x="742" y="112" width="180" height="70" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="832" y="141" fill="#166534">clean attributes</text>
      <text x="832" y="162" fill="#166534" font-size="12">24/7 CFE / carbon</text>
    </g>

    <g stroke="#64748b" stroke-width="1.8" fill="none" marker-end="url(#funnel-arrow)">
      <path d="M142 182 C155 220 225 230 300 246"/>
      <path d="M372 182 C370 212 350 226 330 246"/>
      <path d="M602 182 C572 218 438 226 360 246"/>
      <path d="M832 182 C772 228 498 226 390 246"/>
    </g>

    <path d="M190 246 H790 L724 326 H256 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <path d="M256 342 H724 L664 422 H316 Z" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <path d="M316 438 H664 L610 506 H370 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M370 522 H610 L570 578 H410 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>

    <g text-anchor="middle">
      <text x="490" y="284" font-size="20" font-weight="700" fill="#0f172a">本地 firm power</text>
      <text x="490" y="309" font-size="13" fill="#334155">发电许可 / transmission / interconnection / capacity market</text>
      <text x="490" y="380" font-size="20" font-weight="700" fill="#0f172a">power train 与 facility</text>
      <text x="490" y="405" font-size="13" fill="#334155">变压器 / switchgear / UPS / MEP / commissioning</text>
      <text x="490" y="475" font-size="20" font-weight="700" fill="#0f172a">AI-ready cluster</text>
      <text x="490" y="499" font-size="13" fill="#334155">GPU / HBM / optics / storage / liquid cooling / scheduler</text>
      <text x="490" y="556" font-size="20" font-weight="700" fill="#0f172a">可收费 token capacity</text>
    </g>

    <g fill="#475569" font-size="13">
      <text x="52" y="274">漏损 1：项目重叠</text>
      <text x="52" y="298">漏损 2：跨地区跨年份</text>
      <text x="52" y="382">漏损 3：并网和设备延迟</text>
      <text x="52" y="406">漏损 4：PUE 与冗余</text>
      <text x="52" y="482">漏损 5：rack 到货和良率</text>
      <text x="52" y="506">漏损 6：利用率和收入</text>
    </g>
  </g>
</svg>

公开合同先按口径拆开：

| 公开事项 | 数字 | 时间 | 口径判断 |
| --- | ---: | --- | --- |
| OpenAI / Oracle Stargate | 额外 4.5GW，合计超过 5GW under development | 2025-07 | AI data center capacity，在途，不等于已上线 IT load |
| OpenAI Stargate 五个新站点 | nearly 7GW planned，目标 10GW | 2025-09 | planned capacity，不能和所有后续项目机械相加 |
| OpenAI / SB Energy / NVIDIA PORTS-Pike | 约 8 IT-GW，首批 800MW 预计 2028 | 2026-08 | 最接近可用算力的口径，但完整交付到 2032 |
| Microsoft / Brookfield | 10.5GW new renewable capacity | 2024-05 | 可再生能源 PPA 框架，不是 IT load |
| Microsoft / Constellation CCEC | 约 835MW，20 年 PPA，2028 expected online | 2024-09 | 核电重启和 PJM 电力匹配 |
| Talen / Amazon | 1,920MW nuclear power，full volume by 2032 | 2025-06 | 前表计核电 PPA，支持 AWS Pennsylvania data centers |
| Meta nuclear portfolio | up to 6.6GW by 2035 | 2026-01 | 新旧核电和 advanced nuclear 混合，2030 后为主 |
| Google / Kairos | up to 500MW，首个 SMR 目标 2030 | 2024-10 | advanced nuclear 采购框架 |
| Google / Brookfield hydro | up to 3,000MW，首批 670MW | 2025-07 | hydro PPA framework，偏 24/7 carbon-free energy |

这个表的结论不是「已经签了很多 GW，所以不缺」。它说明 hyperscaler 已经不再相信普通排队能按时满足 AI 需求。它们开始自己锁电、锁地、锁设备，甚至让芯片公司参与 land、power and shell。

需求侧的量级也在往上修。IEA 估计全球数据中心用电从 2024 年 415TWh 到 2030 年 945TWh，增量 530TWh，折成平均负载约 60GW facility power。LBNL 的美国口径更近：美国数据中心用电从 2023 年 176TWh 到 2028 年 325-580TWh，增量折成平均负载约 17-46GW。

McKinsey 用 capacity 口径看，全球 data center demand 从当前约 60GW 到 2030 年 171-219GW，高情景到 298GW。也就是说，2030 年前需要新增 111-159GW demand-serving capacity。JLL 的 2026 outlook 预计 2026-2030 年新增近 100GW，全球 capacity 到 2030 年约 200GW。

口径不同，不能硬减。但用作压力测试足够了：需求中枢比供给计划高，项目延期后缺口会更大。McKinsey 还给出更具体的美国判断：就算已知计划按时交付，美国 2030 年仍可能有超过 15GW data center supply deficit。

现在的缺口不是钱的问题。缺口来自复制链。

- D1 电力接入：primary market 的 grid connection 平均等待超过四年，先进经济体新输电线通常要四到八年。
- D2 并网和本地 firm power：PPA 可以签得很快，RTO/ISO 排队、substation 和 transmission 不能同速复制。
- D3 设备：transformer、switchgear、cable、UPS、busway、gas turbine 都进入长交期，IEA 说 transformer 和 cable 等关键组件等待时间三年内翻倍。
- D3 施工：GW campus 要土建、高压、低压、消防、冷却和 commissioning 同时排产。PORTS-Pike 自己给出的数字是六年 buildout、35,000 construction jobs。
- D3/D4 冷却和水：100kW 以上 rack density 会把 CDU、冷板、泵、管路、噪音、水权和社区许可拉进关键路径。
- D3/D4 集群：GPU 之外还有 HBM、advanced packaging、network switch、optics、storage、PCB、系统集成和运维良率。

公开 GW 越多，越要看它卡在哪一层。签约是 D0/D1 证据，投运才是 D3/D4 通过验收。

## Agent 把需求时钟拨快

未来五年，需求侧最大的变量会从更多人聊天，转向 Agent 把一次请求拆成很多步。

普通 chat 是一来一回。Agent workflow 是规划、检索、调用工具、读文件、写代码、跑测试、修错、再验证。用户只提交一次任务，后面可能有几十次模型调用。再加上 multimodal input、browser control、long context、parallel worker，token traffic 会比用户数更快。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 620" role="img" aria-labelledby="agent-gap-title" style="max-width: 100%; height: auto; margin: 10px 0 18px;">
  <title id="agent-gap-title">Agent 需求时钟与数据中心复制时钟</title>
  <defs>
    <linearGradient id="agent-gap-fill" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#f97316" stop-opacity="0.06"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="978" height="618" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="42" y="46" font-size="24" font-weight="700" fill="#111827">需求时钟像软件，供给时钟像工业工程</text>
    <text x="42" y="76" font-size="14" fill="#64748b">2030 锚点：McKinsey demand 171-219GW，高情景 298GW；JLL supply 约 200GW before delivery discount</text>

    <line x1="92" y1="430" x2="900" y2="430" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="92" y1="120" x2="92" y2="430" stroke="#94a3b8" stroke-width="1.5"/>
    <g stroke="#e2e8f0" stroke-width="1">
      <line x1="92" y1="368" x2="900" y2="368"/>
      <line x1="92" y1="306" x2="900" y2="306"/>
      <line x1="92" y1="244" x2="900" y2="244"/>
      <line x1="92" y1="182" x2="900" y2="182"/>
      <line x1="92" y1="120" x2="900" y2="120"/>
    </g>
    <g fill="#64748b" font-size="12">
      <text x="72" y="434" text-anchor="end">0</text>
      <text x="72" y="372" text-anchor="end">50</text>
      <text x="72" y="310" text-anchor="end">100</text>
      <text x="72" y="248" text-anchor="end">150</text>
      <text x="72" y="186" text-anchor="end">200</text>
      <text x="72" y="124" text-anchor="end">250GW</text>
    </g>

    <path d="M130 356 L285 326 L440 291 L595 247 L750 195 L870 165" fill="none" stroke="#ef4444" stroke-width="4"/>
    <path d="M130 390 L285 362 L440 330 L595 296 L750 259 L870 244" fill="none" stroke="#2563eb" stroke-width="4"/>
    <path d="M130 402 L285 378 L440 352 L595 326 L750 304 L870 286" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="8 7"/>
    <path d="M595 247 L750 195 L870 165 L870 286 L750 304 L595 326 Z" fill="url(#agent-gap-fill)"/>

    <g fill="#111827" font-size="13" text-anchor="middle">
      <text x="130" y="456">2025</text>
      <text x="285" y="456">2026</text>
      <text x="440" y="456">2027</text>
      <text x="595" y="456">2028</text>
      <text x="750" y="456">2029</text>
      <text x="870" y="456">2030</text>
    </g>

    <g font-size="13">
      <rect x="590" y="104" width="304" height="114" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <line x1="612" y1="132" x2="658" y2="132" stroke="#ef4444" stroke-width="4"/>
      <text x="672" y="137" fill="#334155">Agent upside demand</text>
      <line x1="612" y1="160" x2="658" y2="160" stroke="#2563eb" stroke-width="4"/>
      <text x="672" y="165" fill="#334155">planned data center supply</text>
      <line x1="612" y1="188" x2="658" y2="188" stroke="#64748b" stroke-width="3" stroke-dasharray="8 7"/>
      <text x="672" y="193" fill="#334155">usable AI-ready supply after discount</text>
    </g>

    <g>
      <rect x="64" y="492" width="400" height="86" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="86" y="520" font-size="15" font-weight="700" fill="#111827">需求到达时间</text>
      <text x="86" y="546" font-size="13" fill="#334155">用户 × 任务 × 步骤 × token × retry</text>
      <text x="86" y="568" font-size="13" fill="#334155">产品更新可以在周/月尺度扩散</text>
      <rect x="516" y="492" width="400" height="86" rx="7" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="538" y="520" font-size="15" font-weight="700" fill="#111827">供给复制时间</text>
      <text x="538" y="546" font-size="13" fill="#334155">并网、变压器、施工、冷却、rack、调试</text>
      <text x="538" y="568" font-size="13" fill="#334155">多数字段按年排队和验收</text>
    </g>
  </g>
</svg>

McKinsey 的 workload chart 给了一个可用锚点：全球数据中心 demand 从 2025 年 82.3GW 到 2030 年 219GW；AI inference 从 20.9GW 到 93.3GW，CAGR 约 35%；AI training 从 23.1GW 到 62.2GW，CAGR 约 22%。这不是 Agent forecast，但它说明推理会成为主负载。

OpenAI 的流量也给了方向。2025 年 10 月 Sam Altman 说 ChatGPT 已有 800 million weekly active users，API 每分钟处理超过 6 billion tokens。用户数已经是消费级软件速度。Agent 会把乘数从「用户数」换成「任务步骤数」。

我会用三个情景看未来五年。这里的缺口是全球可用 AI-ready compute 的 rough order，不是精确 forecast。

| 情景 | 需求路径 | 供给路径 | 2030 左右缺口 |
| --- | --- | --- | --- |
| 受阻 | Agent 可靠性进步慢，推理按基础预测走 | JLL 近 100GW 新供给大体交付，AI-ready 打折较小 | 15-25GW |
| 基准 | coding、office、customer support 的 Agent 渗透，推理 30%+ CAGR | 规划供给上线，但 10-20% 被并网、设备、fit-out 和利用率折掉 | 30-50GW |
| Agent upside | tool call、长上下文、后台任务和并行 worker 快速增长 | 供给加速，但电网和设备仍按工业节奏复制 | 70GW+ |

这些数字的逻辑很朴素。McKinsey 的 2030 demand midpoint 是 219GW，JLL 的 2030 capacity 约 200GW，表面差 19GW。扣掉 delay risk、AI-ready fit-out、局部电网限制、GPU/rack 到货和实际利用率，基准缺口会落到几十 GW。若需求接近 McKinsey 高情景 298GW，而供给仍在 200GW 附近，缺口会迅速上到 70GW 以上。

真正危险的地方在复制时间。

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

模型效率一定会提高。量化、蒸馏、MoE、speculative decoding、KV cache 和更好的 scheduler 都会降低单 token 成本。但 AI 很可能出现 Jevons paradox：token 变便宜，大家会让模型做更多以前舍不得做的事。便宜推理不必然降低总算力需求，它可能释放更大的任务空间。

所以未来五年，AI 的稀缺会从「有没有芯片」迁移到「哪里能把芯片接上电、冷下来、跑满，并且赚回电费和折旧」。

## 红灯会往哪里迁移

用 Bottleneck Migration Network 看，投资研究应该少给 AI 上游贴标签，多追红灯。

第一盏红灯在 power-ready land 和 interconnection certainty。能在 24-36 个月交付 300MW 以上 firm power 的地块，会比普通土地贵得多。这里真正有价值的资产，是并网确定性、utility 协调能力和地方政府执行力。

第二盏红灯在电力设备和高压工程。变压器、switchgear、UPS、busway、cable、substation、transmission contractor 更接近当前物理卡点。GPU 迭代很快，变电站不会靠发布会迭代。

第三盏红灯在 EPC、劳动力和 commissioning。GW campus 的难点是把电气、冷却、消防、结构、网络和 rack deployment 放进一个 schedule。任何一个工种排不上，最后都不会变成 token。

第四盏红灯在 high-density cooling 和低压配电。rack density 上去以后，CDU、冷板、泵、接头、leak detection、busbar、power shelf 会变成小而硬的约束。

第五盏红灯再回到 AI hardware。GPU、ASIC、HBM、CoWoS、networking、optics、storage 仍然是利润池大头。只是市场已经很会给这些资产定价，超额收益更可能来自「哪一个 D3/D4 节点重新变窄」，而不是重复说 AI 需要芯片。

第六盏红灯在运营和利用率。等项目陆续上线，同一瓦电能产生多少成功任务，会变成新的收费站。这个能力在财报里不一定叫调度，它会表现为 gross margin、capex intensity、lease obligation 和 free cash flow。

这里有一个反直觉点：数据中心供应链越往上游，越不容易讲 AI 故事；越不讲 AI 故事，越可能是真卡点。一个 transformer 厂商不会每天说 AGI，但没有它，AGI rack 接不上电。一个 transmission contractor 不会出现在模型发布会，但没有它，10GW 只是 PDF 上的数字。

## 下一道收费站

Ohio 的 8 IT-GW 项目最有价值的地方，不是数字大。它把 AI 基础设施的真实形态摊开了：模型公司、芯片公司、能源公司、utility、DOE、地方社区和资本市场被塞进同一个项目。

软件扩容只要 deploy。AI 扩容要拿地、拿电、拿设备、拿许可、拿工人、拿融资，再把上百万张加速卡放进一个不会过热、不会断电、不会闲置的系统。

过去两年，市场问的是谁有 GPU。接下来几年，更好的问题是：谁能把 GW 变成 token，谁只能把 GW 写进新闻稿？

下一道收费站，不在最热的叙事里，在最慢的交付链条里。

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
