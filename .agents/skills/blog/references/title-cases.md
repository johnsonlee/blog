# 标题研究与历史失败案例

本文件按需读取，用于追查依据或诊断同类失败，不是每次拟标题的执行清单。当前有效规则见 [titles.md](titles.md)。外部样本、历史措辞和单篇项目限制不自动成为全博客规则；原始案例保留语境，不能把表里的旧建议直接覆盖当前任务。

## 研究依据


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

## 历史失败案例

以下保留历次数据中心及技术标题反馈。阅读时先确认本次任务是否具有相同的对象、口径或读者问题；通用语义错误归并到 `titles.md`，项目限制仅在同项目或同系列适用。

下表记录原项目中的失败原因。是否适用于当前任务，按 `titles.md` 判断；不再执行旧版要求的全表逐项回放。

| 已发生的错误 | 失败样本或症状 | 当时反馈及适用边界 |
|---|---|---|
| 把常识当反常识 | “项目为什么没有统一交付日”“AI Rack 为什么要做两次验证”“确认收入为什么不等于可用算力”“配套电源为什么不能专供园区”“GPU 算完后用户为什么还在等”“不用冷却塔怎么散热”“Token 越便宜 Task 总成本可能越高” | 多供应商、分期交付、买卖双方分别验收、收入与可用状态不同、并网电源参与系统调度、结果还要经过网络传输、Dry Cooler 替代 Cooling Tower、单价乘数量都能被基本常识或一个名词闭合，不能单独承担标题冲突 |
| 把正常速度包装成异常 | “Abilene 为什么开工 13 个月就跑起 Workload” | 先找到同口径 benchmark；13 个月本身不反常，不能靠问句制造惊讶 |
| 混用周期口径 | 用 20MW 以上项目 9–10 个月的 provisioning 对比 1GW campus 从 site selection 到 RFS 的完整周期 | 时间比较必须对齐起点、终点、地域、阶段和交付对象；对不齐就不把数字放进标题 |
| 时间起点没有绑定工程事件 | “一座数据中心送电十年后才满载”既可能从 2025 年 bridging power 起算，也可能从 2027 年 permanent substation 投运起算 | `开工`、`送电`、`投运`、`交付`和`满载`必须落到可验证 milestone；同一项目存在临时与永久路径时，不能用上位词掩盖起点差异 |
| 把案例参数写成适用条件 | “1GW AI 园区为什么要按容量管理工期”暗示只有达到 1GW 才适用 | 案例里的规模、地域和公司只能说明模型在该案例中的表现，不能擅自变成模型成立的门槛 |
| 修掉逻辑错误就当成好标题 | 删掉 `1GW` 后改成“数据中心交付进度看的是容量不是完工率”只剩一句抽象的项目管理原则 | 修正事实边界只是回到候选起点；标题仍要给读者一个能够直接感知的具体 premise 和唯一解释缺口，不能把内部方法总结直接交付给读者 |
| 用抽象模型埋掉正文里的强事实 | “数据中心送电交付的是一条可控负荷曲线”事实正确，却藏掉了同一项目从永久送电到满载相隔十年的规模冲突 | 正文已有同对象、同口径、同时间边界的异常事实时，标题先交付事实，再把负荷曲线等专家模型留给正文解释；不能为了显得专业而降低可感知性 |
| 数量比较省略比较维度 | “OpenAI 最大园区接近此前六座总和”没有说明比较容量、面积、成本还是建筑数量 | 一对多、倍数或总和比较必须写明同一度量对象；读者不能依靠目录或正文猜比较维度 |
| 让数字失去宾语 | “大型数据中心平均十个月”没有说清十个月完成了什么 | 每个数字必须紧贴被度量的事件或对象，读者不能依靠正文补单位和起止边界 |
| 为了严谨把枝节数字塞进标题 | “核电站就在旁边为什么 AWS 数据中心不能直接用 480MW”让读者额外追问为什么偏偏是 480MW | 事实边界优先用准确动词和对象表达；数字只有直接制造主冲突时才进标题，不能把正文里的限定证据全部搬上去 |
| 把作者的分类数量当成读者锚点 | “一座 AI Rack 为什么同时出现在四本交付账上”只有读完正文才知道四本是什么；删掉以后又把供配电标题改成“四本容量账”重复犯错 | `三层`、`四本`、`五步`等数字只有在分类本身已被读者认识或数量关系直接制造冲突时才进入标题；作者为组织正文发明的枚举不能冒充新增信息，同一轮修改还必须全文搜索同类结构，不能只修被指出的一处 |
| 偷换度量对象 | 把 8 IT-GW 写成“8GW 可用算力”；把同一批 GPU 在不同 workload 下的 capacity shape 写成“不是同一种算力” | Power capacity、IT load、GPU count、topology、FLOPS、available compute 和 workload output 必须分开；通俗化和比喻不能改变实际衡量对象 |
| 把模型目标写成实测结果 | 把 MLCommons 推导出的 4.4 秒 checkpoint window 写成“15TB 五秒写完” | Requirement、simulation、sensitivity、target、forecast 和 observed result 必须使用不同措辞；标题不能把“需要做到”写成“已经做到” |
| 把全文缩成局部设备或步骤 | 用 120kW Rack 解释 Project Delivery；用一次断电或一次复测代表 Commissioning | 标题必须覆盖正文的中心对象和完整 subsystem，局部数字只能做证据或开篇 hook |
| 标题与文章对象断裂 | “120kW Rack 为什么会改写数据中心交付”要求读者自行补出两者关系 | 冲突两端之间的因果必须能从标题直接读出，不能把关键桥梁藏进正文 |
| 把专家答案伪装成读者问题 | “核电站就在隔壁为什么 AWS 数据中心还要接入电网”只有理解 service boundary 后才会这样问，普通读者先问的是旁边现成的电为什么不能直接用 | 标题从读者眼前可见的事实和朴素模型起步；正文要解释的机制不能提前替换读者原本的问题，否则问题虽然专业却失去共鸣 |
| 用系列序言再写一遍正文 | “PORTS-Pike 8GW 怎样变成可用算力”重复序对整条交付链的提问 | 单篇必须推进到一个更具体的新模型，不能换个案例重讲系列总问题 |
| 脱离目录就失去对象 | “Project Delivery Lifecycle：一个项目怎样走到 RFS？” | 标题必须独立说明它讨论 Data Center 的哪个问题，同时不能机械重复 `AI 数据中心` 前缀 |
| 用统一前缀代替上下文 | 十几篇都以“AI 数据中心……”开头 | 用项目、数字、系统或结果建立锚点；系列感来自推理顺序，不来自标题模板 |
| 零信息问句 | “1GW 是什么概念？”“到底要多久？” | 问号前先交付 premise；只有话题和疑问的标题直接 FAIL |
| 把常识方向当成规模反差 | “规模更大所以更复杂”“供电更多所以设备更多” | 规模只有落到可比较数量级、fan-out 或系统边界才成立，例如 128 个 Rack 对 1040 台 Switch |
| 把普通决策说成新奇 | “OpenAI 为什么把 8GW 集中在一座园区？” | 集中建设本身不反常；应交付真正的比较基线，例如最大园区接近此前六座总和 |
| 用语气词制造冲突 | 没有“竟然”就不成立的标题 | 先保证事实本身足够反常，再决定是否用语气放大；#10 的 128 对 1040 独立成立 |
| 用转折词捏造因果 | “核电直连被拒后反而签下 1.92GW”暗示 480MW amendment 被拒促成了后续 1.92GW 合同 | `反而`、`因此`、`却`、`于是` 都必须有正文证据支持同一对象之间的因果或明确反转；只有时间先后或方案替换时直接陈述变化，不能用连接词补戏剧性 |
| 标题范围越改越小 | subsystem 文章最后只剩一个验收动作、单台设备或一次事故；把 Site Energization 缩成“验收负荷行为” | 标题可以从具体事实切入，但正文纵深必须仍然能够自然覆盖整个 subsystem；不能用某一道 gate 代替完整交付对象 |
| 两个分句硬拼 | 用逗号连接 premise 和问题，删掉逗号后仍是两句 | 中英文逗号和数字千位分隔符全部禁止；标题必须重写为单一语义主干 |
| 用长句代替取舍 | “为了复制算力 OpenAI 为什么反而把 8GW 集中在一座园区”同时塞进目的、公司、规模、动作和问题 | 标题只保留一个读者锚点和一条新增信息；需要两个以上因果连接词才能成立时，回到正文主判断重新选焦点，不能靠压缩字号容纳研究摘要 |
| 大多数标题超过 20 字 | 每篇都试图在标题里同时交代对象、背景、数字、冲突和问题 | 中文标题正文以 20 个可见字符为 hard gate；压缩时先删正文证据和解释，只保留读者锚点与新增信息，不能删除事实限定后造成夸大 |
| 把 casual 写成低幼问题 | “合同签了数据中心为什么还要等到 2031”把大型项目存在建设周期包装成疑问 | casual 是叙述自然，不是取消基本常识；标题必须尊重读者已经知道合同不等于交付、项目需要建设和验收 |
| 使用尚未建立的缩写充当锚点 | “一个项目怎样走到 RFS”既没有说明项目是数据中心，也要求小白读者先懂 RFS | 标题里的缩写必须是目标读者已经认识的对象，或者与足够清楚的事实放在一起；正文才会建立的术语不能负责吸引点击 |
| 使用内部状态和悬空指代 | “数据中心的 PASS 只对那套配置有效”没有解释 PASS 是哪次测试，也没有说明“那套”指负载、时长、故障位置还是控制逻辑 | 标题必须脱离正文独立成立；`这套`、`那次`、`前者`、`该状态`等指代词在标题内找不到唯一先行词时直接删除或重写，内部状态名也必须换成读者能看见的事件 |
| 先生成再自行宣布通过 | 作者制定规则、生成候选、打分后直接写入正文和 PR | 当时反馈针对未经作者确认就宣称符合口味；自评不能代替作者认可。按当前任务已有授权推进，不从本案例推导额外确认门槛。 |
