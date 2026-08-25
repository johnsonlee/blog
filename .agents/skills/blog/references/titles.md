# 标题：先交付信息，再留下解释

标题不是正文的第一个问题，也不是目录、摘要或结论的压缩版。它是文章在信息流里的独立交付物：读者还没有读正文，标题就要先让他得到一个清楚的新事实、判断、结果或观察；点击以后再获得原因、机制与影响。

## 证据边界

这套规则使用三类证据：

1. Hacker News 上被 AI 与软件从业者大量讨论的文章，记录其分享标题、points 与 comments。points 受作者、时机和话题影响，不能证明标题单独造成传播，只用于观察高传播样本反复出现的结构。
2. Reddit 用来检查标题或概念是否脱离单次发布后仍被复述。[Bitter Lesson and Tree of Thoughts](https://www.reddit.com/r/MachineLearning/comments/1893ne2/) 把原文概念直接作为新问题的共同语言；[LLMs are eroding my software engineering career and I don't know what to do](https://www.reddit.com/r/theprimeagen/comments/1tzgytg/) 则把同一标题和文章带到另一个技术社区继续讨论。跨平台复述是补充信号，不与 HN points 混成同一排名。
3. 标题 A/B test 与行为研究用来校正直觉。研究结论只能提供一般规律，不能代替 johnsonlee.io 的读者模型与作者风格。

候选集通过 HN Algolia 以 `AI`、`LLM`、`ChatGPT`、`Agent`、`GPT` 和 `Transformer` 检索，再排除只有产品发布、视频、招聘或新闻事件而没有文章正文的结果。以下数据为 2026-08-25 的快照，表中保留了高互动文章以及少数后来成为行业语言的经典文章：

| 分享标题 | HN points | comments | 标题交付了什么 |
|---|---:|---:|---|
| [My AI skeptic friends are all nuts](https://news.ycombinator.com/item?id=44163063) | 2356 | 2826 | 直接判断 |
| [An AI agent published a hit piece on me](https://news.ycombinator.com/item?id=46990729) | 2346 | 951 | 具体事故 |
| [Building a Virtual Machine Inside ChatGPT](https://news.ycombinator.com/item?id=33847479) | 2029 | 908 | 反直觉演示 |
| [I'm Tired of Talking to AI](https://news.ycombinator.com/item?id=48292224) | 2013 | 950 | 具体态度 |
| [Local AI needs to be the norm](https://news.ycombinator.com/item?id=48085821) | 1903 | 749 | 立场与方向 |
| [LLM Inevitabilism](https://news.ycombinator.com/item?id=44567857) | 1773 | 1628 | 命名一种思维模型 |
| [A GPT in 60 Lines of NumPy](https://news.ycombinator.com/item?id=34726115) | 1563 | 146 | 熟悉对象与极端压缩 |
| [LLMs reward expertise](https://news.ycombinator.com/item?id=49161518) | 1416 | 573 | 反转“AI 抹平经验”的判断 |
| [Adding a feature because ChatGPT incorrectly thinks it exists](https://news.ycombinator.com/item?id=44491071) | 1299 | 424 | 荒诞但完整的因果链 |
| [A small number of samples can poison LLMs of any size](https://news.ycombinator.com/item?id=45529587) | 1202 | 439 | 小输入与任意规模之间的反差 |
| [LLMs are eroding my software engineering career and I don't know what to do](https://news.ycombinator.com/item?id=48434312) | 1151 | 1074 | 具体后果与未解决处境 |
| [You should write an agent](https://news.ycombinator.com/item?id=45840088) | 1070 | 395 | 直接主张 |
| [ChatGPT won't let you type until Cloudflare reads your React state](https://news.ycombinator.com/item?id=47566865) | 986 | 614 | 熟悉产品之间的异常依赖 |
| [How I program with LLMs](https://news.ycombinator.com/item?id=42617645) | 919 | 332 | 明确用途 |
| [Why LLMs can't really build software](https://news.ycombinator.com/item?id=44900116) | 862 | 504 | 先给判断，再承诺解释 |
| [Improving 15 LLMs at Coding in One Afternoon. Only the Harness Changed](https://news.ycombinator.com/item?id=46988596) | 832 | 295 | 结果、规模与唯一变量 |
| [I'm Kenyan. I don't write like ChatGPT, ChatGPT writes like me](https://news.ycombinator.com/item?id=46273466) | 800 | 504 | 主客体反转 |
| [ChatGPT is a blurry JPEG of the web](https://news.ycombinator.com/item?id=34724477) | 574 | 305 | 可视化类比 |
| [Software 2.0](https://news.ycombinator.com/item?id=34881881) | 422 | 330 | 给范式命名 |
| [AI as Normal Technology](https://news.ycombinator.com/item?id=43697717) | 239 | 92 | 用一个词改写讨论坐标 |

*The Bitter Lesson* 还显示了标题的第二种传播能力：它不只让人点开，还能被拿去组织新的讨论。原文之后出现了 [The Bitter Lesson Is Misunderstood](https://news.ycombinator.com/item?id=45057283)、[AI founders will learn the bitter lesson](https://news.ycombinator.com/item?id=42672790)、[AI Search: The Bitter-Er Lesson](https://news.ycombinator.com/item?id=40683697) 和 [The bitter lesson is coming for tokenization](https://news.ycombinator.com/item?id=44366494)。这种可复述性比一次点击更接近 johnsonlee.io 想要的标题。

三项行为研究给出必要的反面约束：

- [Titles framed as questions reduce reader engagement](https://doi.org/10.1002/jcpy.70031) 覆盖 53,030 个 Reddit 帖子、3,078,791 篇论文、22,743 组线上标题实验和一项预注册实验；问句标题整体更弱，原因是读者认为它交付的信息更少。问句不是天然的 curiosity gap。
- [When curiosity gaps backfire](https://doi.org/10.1038/s41598-024-81575-9) 分析 8,977 组保持配图一致的标题实验，发现信息太少和信息太满都会降低点击。标题应给出足够具体的 premise，把原因或影响留给正文。
- [Reading dies in complexity](https://doi.org/10.1126/sciadv.adn2555) 使用超过 30,000 组线上实验，发现普通读者更愿意选择用词常见、可读性高的标题；专业写作者没有表现出同样偏好。这正是作者最容易高估术语和压缩表达的地方。

## 高传播标题的五种机制

高传播样本不是同一种模板。它们至少有五种不同工作方式：

1. **交付判断**：`LLMs reward expertise`、`Local AI needs to be the norm`。标题已经说了作者看见什么，正文解释为什么。
2. **呈现异常**：AI Agent 写攻击文章、ChatGPT 的误判反过来进入产品、Cloudflare 读取 React state。标题给出完整异常，只留下机制。
3. **展示不可能的结果**：60 行 NumPy 写出 GPT、在 ChatGPT 里构建 VM、只改 Harness 就同时提高 15 个模型。数字和对象放在同一口径里，读者不用换算也能感到反差。
4. **命名一个模型**：`Software 2.0`、`The Bitter Lesson`、`LLM Inevitabilism`。标题本身成为可引用的概念，适合真正提出新框架的文章，不能给普通解释文强造术语。
5. **承诺明确用途**：`How I program with LLMs`、`Building Effective Agents`。它们不靠冲突，靠作者可信度和读者当下任务传播。

问句只是语法，不是第六种机制。[Can LLMs write better code if you keep asking them to “write better code”?](https://news.ycombinator.com/item?id=42584400) 仍然成立，是因为它在问号以前已经交付了一个具体、可复现实验。一个只问“X 为什么复杂”“Y 到底多大”的标题，没有因此产生张力。

## johnsonlee.io 的标题骨架

johnsonlee.io 近年的标题里，稳定而有辨识度的不是问句，而是**把熟悉对象推向一个意外结果**：

- `长期记忆正在把 Agent 变蠢`
- `复制速度才是真正的瓶颈`
- `疯狂烧 Token 的日子要结束了`
- `19 行 prompt 的威力`
- `还要工程师干什么？`
- `2年涨30%，是什么支撑韩国的房价？`
- `为什么 OpenAI 总是缺算力？`

其中陈述句、短语和问句都有。共同点是：读者在标题里已经得到一个 premise，而不是先被作者考一道题。问句成立时，问的也是读者已经观察到的现象：OpenAI 反复扩算力、房价与人口趋势相反、AI 已经能写大量代码。正文负责解释，不负责补齐标题遗漏的背景。

所以标题与第 0 个问题必须分开：

- **第 0 个问题**控制正文从哪里开始推理。
- **标题**决定读者在点击前先得到什么信息。
- 两者可以是同一句，但没有任何必要必须相同，更没有必要都写成问句。

## 标题契约

拟标题前先写四行，不直接套句式：

```text
读者锚点：目标读者点开前已经知道、见过或相信什么
新增信息：这篇最值得提前交付的事实、判断、结果或模型是什么
未解部分：标题交付新增信息后，读者还会自然追问哪个原因或影响
证据兑现：开篇和正文用哪组核心证据兑现标题，不换对象和口径
```

标题通常只需要“读者锚点 + 新增信息”，把“未解部分”留在读者脑中。不要把四行全塞进标题。

## 一票否决

出现任一项，标题直接 FAIL，不进入打分：

- **零信息问句**：只问“多大、多少、多久、为什么”，却没有在标题里交付值得追问的 premise。
- **常识闭合**：有基本常识的读者不用行业知识就能答完，正文只能把“更多、更慢、更复杂”展开成细节。
- **双重陌生**：冲突两端都是目标读者无法估量的单位、术语或状态，例如只拿 GW、MW、MVA、LPM、RFS 相互比较。
- **标题错焦**：标题抓住正文里的一个局部数字、设备或步骤，文章真正解释的对象却更大。
- **范围空泛**：`X 的全景/逻辑/深度解析` 只描述作者要写什么，没有告诉读者发现了什么。
- **惊讶外包给语气词**：删掉“竟然、真正、没想到、史上最大”以后不再有反差。语气只能放大事实，不能替事实制造冲突。
- **证据越界**：标题的因果、程度、范围或时间超出正文证据，或者用不可比数字拼出反差。
- **目录依赖**：离开系列目录就不知道文章在谈哪个对象。

## 八项评分

通过一票否决后，每项打 0、1、2 分：

| 维度 | 0 分 | 1 分 | 2 分 |
|---|---|---|---|
| 读者锚点 | 需要先读正文 | 部分读者认识 | 目标读者一眼认识 |
| 信息交付 | 只有话题或提问 | 有信息但泛 | 有明确事实、判断、结果或模型 |
| 精准缺口 | 不知道为什么要点 | 泛泛想知道更多 | 自然只剩一个原因、机制或影响 |
| 认知位移 | 只确认常识 | 增加细节 | 迫使读者修正原判断 |
| 证据抓手 | 无法直接验证 | 需要多层转译 | 正文有同口径核心证据可兑现 |
| 文章纵深 | 只够回答一个小点 | 能带出几节 | 能自然覆盖全文主问题 |
| 压缩与口吻 | 像目录、研报或 prompt | 清楚但普通 | 简单、可复述、有作者判断 |
| 事实边界 | 夸大或偷换范围 | 基本准确 | 精确且保留必要限定 |

判定规则：

- 总分至少 13/16。
- “信息交付”“精准缺口”“证据抓手”“事实边界”不得低于 1 分。
- 高分不覆盖一票否决。
- 同一文章保留 3 个来自不同机制的候选，不保留 3 个同句式改写；逐项打分后再选。

## 问句与数字的附加门槛

问句标题只有同时满足以下条件才保留：

- 问号以前已经写出一个明确 premise，而不是让读者猜文章为什么要问。
- 这个疑问来自读者已经见过的现象，或者标题给出的事实本身就足以建立现象。
- 答案不能被常识一次闭合。
- 改成陈述句后没有明显增加信息量；否则优先陈述句。

数字标题只有满足以下任一条件才保留：

- 数字与日常或业内熟悉基线直接比较，如 `128 个 Rack` 对 `1040 台 Switch`。
- 同一标题里出现可直觉理解的比例、时间、倍数或反向结果。
- 数字本身是读者已知事件的一部分，正文解释它为什么成立。

陌生单位不能负责吸引读者。`1GW`、`330kW`、`495 LPM` 可以是正文里完成认知转换的证据，除非标题同时给出读者无需换算就能理解的参照物。

## 前向验证

这套标准必须能够区分“内容正确”和“值得点开”。下表先过一票否决，再按八项评分诊断；触发否决时，分数只用于暴露弱项，不能把标题救回 PASS：

| 标题 | 分数 | 判定 | 原因 |
|---|---:|---|---|
| `长期记忆正在把 Agent 变蠢` | 16 | PASS | 熟悉功能导向相反结果；自然追问机制 |
| `为什么 OpenAI 总是缺算力？` | 15 | PASS | 读者已见过反复扩容；标题交付持续缺口这个现象 |
| `128 个 Rack 竟然要配 1040 台 Switch？` | 15 | PASS | 两端同口径可比较，8 倍数量级本身就是新增信息 |
| `现有数据中心接得住万卡集群吗？` | 9 | FAIL | 零信息问句、常识闭合、标题错焦；没有交付项目周期的新信息 |
| `一座 330kW Rack 每分钟要流过多少冷却液？` | 7 | FAIL | 零信息问句、双重陌生；答案只是另一个无法感知的数字 |
| `OpenAI 最大的数据中心园区有多大？` | 8 | FAIL | 零信息问句；“最大”没有参照，把 8GW 的事实藏了起来 |
| `1GW 是什么概念？` | 5 | FAIL | 零信息问句、双重陌生；词条式问题承载不了项目交付纵深 |
| `120kW Rack 为什么会改写数据中心交付？` | 8 | FAIL | 双重陌生、标题错焦；用局部设备替代项目周期 |

如果标准无法稳定淘汰后四类标题，说明标准仍在奖励“题目正确”，而不是判断读者为什么会点开。

## 工作流

1. 研究与主线稳定后再定正式标题；研究前只能使用 working title。
2. 写标题契约，先确定新增信息，不先选择问句、数字或“为什么”模板。
3. 分别尝试判断、异常、结果、概念命名和明确用途五条路径；不适合的路径直接跳过。
4. 过一票否决和八项评分，再与最近文章标题并排检查重复节奏。
5. 让不了解正文但具备基本常识的人只看标题，说出“已经知道了什么”和“还想知道什么”。前者为空，标题太虚；后者超过两个方向，标题太散。
6. 检查开篇能否立即兑现标题 premise，结尾能否回答标题留下的唯一缺口。不能兑现就改标题或重写主线。
