# Investing 类文章

Investing 类文章先把一笔生意怎样发生讲清楚。文章是否在做 alpha 分析，应由约束、价值捕获、市场隐含预期和证伪条件体现，不靠反复说“投资”“投资者”“机会”或“alpha”。

Economics 必须沿正文的中心对象继续向下追，不能在技术解释结束后突然切换成供应商名单或股票章节。

## 先证明约束能进入一家公司

当前瓶颈不自动等于某家公司的 alpha。研究笔记可以检查需求、复制速度、替代路径、控制力和持续时间，但在正文里只保留推导当前判断所需的部分。

落到公司以前，必须走通：

```text
operational constraint
  -> 具体产品或服务
  -> 客户无法绕开的 control point
  -> 可观察的 commercial event
  -> 公司 segment / product line
  -> revenue、margin、cash flow 或 capital intensity
```

Commercial event 随生意变化，可能是 reservation、design win、purchase order、shipment、installation、acceptance、usage 或 renewal。先确认哪个事件改变经济权利和义务，再看它怎样进入 backlog、revenue recognition 和现金流。

每次公司映射先过 admissibility gate：

- 公司是否直接控制被论证的环节，而非仅与行业相关
- 产品、客户、项目、地域和时间是否与主 case 对得上
- 对应业务在 segment 中是否足够 material，能否追到财务口径
- 证据能否把公司结果反向连接回该约束

任一项走不通，结论应停在产业或项目层。不能为了补齐文章结构，换一个项目、地域或宽口径行业 proxy。

## 再判断 Price-in

Price-in 是当前价格隐含了怎样的未来经营结果，不是“估值很高”“股价涨过”或“市场还没意识到”。只有 company thesis 通过 admissibility gate 后，才进入估值。

根据证据质量，price-in disposition 只能是：

- **Calculated**：可以从当前价格反推关键经营变量，并与 thesis 比较
- **Bounded**：只能给出区间或情景边界，结论随关键参数变化
- **Unverified**：公司映射或公开数据不足，不能可靠判断

`Unverified` 是有效结论。不得用新闻热度、股价走势或 arbitrary multiple 填补缺失链路。

需要计算时，先把产业 thesis 换成同口径 earnings path：

```text
industry demand -> addressable deliveries -> company share
-> revenue -> margin -> cash flow -> valuation
```

再比较：

- **Thesis expectations**：交付能力、份额、价格、成本和持续时间推导出的结果
- **Implied expectations**：当前 equity value / enterprise value 要求公司实现的结果

一个价格不能唯一反推出 growth、share、margin 和 duration。固定非核心变量，再反求 thesis 最关键的一两个变量；固定值使用 consensus、guidance、历史区间或明确基础假设，并说明来源、区间和相关性。

所有输入属于同一 information set。股价、fully diluted shares、net debt、guidance 和 consensus 标注来源与 `as of` 日期；对齐 fiscal/calendar year、币种、GAAP/non-GAAP 与 segment/company 口径，不倒灌估值日之后的信息。

估值方法随生意选择：稳定现金流可用 reverse DCF；周期性或未稳定盈利的公司可用 normalized earnings、EV/Sales、EV/EBITDA、sum-of-the-parts 或情景概率。解释方法为什么对应 earnings path；历史或 peer multiple 只能作参照。

Price-in ledger 应允许读者从 price 复算到 operating assumptions，再回到 equity value：

- valuation date、share price、fully diluted shares、net debt、equity value 与 enterprise value
- guidance / consensus 的 snapshot、年份、样本和利润口径
- thesis、consensus 与 current-price-implied 的关键经营变量
- revenue 到 earnings / cash flow、terminal value 或 exit multiple、discounting、EV-to-equity 的 bridge
- terminal assumption、multiple、discount rate 和关键变量的联合 sensitivity

结论写清当前价格大致隐含什么，thesis 多假设或少假设了什么。合理参数稍变就反转时，结论是判断不稳健；不要挑一组支持 thesis 的参数。

## 放回故事里

不要把上面的链路照抄成固定 H2。只有当读者已经理解约束怎样形成，才会自然追问谁能控制它、何时收费、收入会多大、市场又预期了多少。每一步仍然修正同一个中心问题。

区分公告、意向、合同、在建、交付、验收和使用；区分存量、增量、run rate、目标、估算和合同上限；区分 company、segment、product line 和单一项目。证据无法跨过哪一层，就明确停在哪一层。
