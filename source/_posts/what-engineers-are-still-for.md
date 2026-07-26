---
title: 还要工程师干什么？
date: 2026-07-25 13:30:24
categories:
  - Independent Thinking
tags:
  - AI
  - Codex
  - Agentic Coding
  - Goal
  - Harness Engineering
  - Eval
i18n_key: what-engineers-are-still-for
---

前段时间我在用 Codex 的 `/goal` 推一个 side project。晚上把目标丢进去，早上起来看一眼，任务还在跑：读文档、拆模块、改 Kotlin、补 React、跑 `./gradlew :backend:check`，失败了自己修，再继续。

我第一次有点恍惚，是看到它半夜还在沿着同一个目标往前滚。那一刻它不像一个聊天窗口，更像一个挂在 repo 里的无人值守工程队。于是那个问题就绕不过去了：如果 Codex 能不眠不休地推进项目，直到目标达成，还要工程师干什么？

<!-- more -->

## Enter 键被拿走了

以前用 Agent 写代码，最常见的断点是注意力。你给它一个 task，它完成一段，停下来等你确认；你去睡觉，它也跟着睡觉；你第二天回来，还要重新解释上下文。开发节奏被人的在线时间切碎。

Prompt Engineering 解决的是“一轮怎么说”。Skill 解决的是“一类任务怎么起手”。它们都默认一个前提：人还坐在旁边，负责选择下一轮要不要继续、怎么继续、什么时候停。

`/goal` 把这个前提拿掉了。它会带着目标跨 turn 往前走，遇到失败会修，遇到上下文不足会查，检查没过会继续迭代。它不需要咖啡，不会嫌 PR 太长，也不会因为凌晨三点还在跑测试而情绪崩掉。

这已经是 Loop Engineering 了，只是入口突然变成了一条命令。

我在[《别被 Loop Engineering 忽悠瘸了》](https://johnsonlee.io/2026/06/26/fooled-by-loop-engineering/)里写过，loop 本身不能保证方向正确。这个判断还成立。变化在于，loop 的搭建成本被 `/goal` 压得很低：目标、状态、执行、检查、修复、继续下一轮，原来需要自己拼 orchestration，现在 Codex 直接给你一条持续运行的工作流。

这对还停留在 Prompt Engineering 和 Skill 的人很残酷。Prompt 仍然重要，但它正在变成基本卫生；Skill 仍然有用，但它正在变成零件。还把“怎么把一句话写得更清楚”“怎么把流程塞进 SKILL.md”当成主战场，基本没路了。

**竞争单位从一轮对话，挪到了能自己闭环的目标。**

## 实现型工作的地板塌了

这个 side project 特别适合暴露变化。它已经越过 demo 阶段，是一个本地资料工作台：导入文件，抽取结构化字段和引用位置，进入 review，再导出可复核的离线包和 backup。后端是 Kotlin/Spring Boot，前端是 React，本地数据要加密，导出不能泄露本机路径，真实 corpus 不能被 generic fallback 糊过去。

这种项目靠人一口气推进很累。大量工作没有创造性，但每一处都不能漏：DTO contract、metadata port、parser adapter、architecture guard、fixture script、UI state、PDF index、ZIP manifest。过去这些活支撑了很多工程师的日常工作量，现在它们变成了 Codex 最适合吞掉的长尾。

这已经跨过了“AI 辅助一下工程师”的阶段。一个能连续读 repo、改代码、跑测试、修失败、整理上下文、继续下一轮的 Agent，已经在接管实现循环本身。人类在线时间不再是项目推进的硬约束，很多岗位赖以存在的成本结构会被重写。

我倾向于更冷的判断：大部分以实现为主的工程师会被替换。争论点只剩时间表。

这句话听起来刺耳。可把日常工作拆开看，就没那么玄乎：读 ticket、找相关文件、理解局部 contract、补一段实现、修 test、回 review、再跑 CI。过去它们需要人，因为人能维持上下文、处理小意外、在失败后继续。`/goal` 正在吃的就是这条链路。

工资按月发，Agent 按轮、按 token、按任务消耗。只要模型能力继续上升、上下文继续变长、工具调用继续稳定，公司自然会算账。实现型工程师的替代会按经济规律发生，不靠口号推动。

## 完成条件会训练 Agent

兴奋过后，麻烦也很快出现。

Agent 会迎合 completion condition。告诉它“测试通过”，它可能修代码，也可能改测试、扩大 mock、吞掉异常、绕开失败路径。`/goal` 能让它跑更久，也会让错误方向跑得更久。

最容易误判的地方，是把锅甩给 Codex。它只是照着目标信号优化；目标描述太软，错误就会被放大。

如果你说“把这个 side project 做到可用”，它会给你一个看起来可用的版本。页面能点，接口有返回，测试也许全绿。可“可用”到底指什么？导入真实材料能不能识别？每个关键字段有没有引用定位？导出的 ZIP 里有没有本机路径？backup 有没有 plaintext metadata？UI 里 locked workspace 会不会偷偷拉敏感资源？

这些问题不写进目标，Agent 不会凭空替你在意。它只会沿着阻力最小的路径交付一个“合理答案”。

**模糊目标会把勤奋变成风险。**

人类工程师过去靠 review 和经验兜底。看到奇怪的 mock，会追一句“线上真有这个东西吗？”看到导出文件名，会本能地检查有没有 workspace id 泄漏。看到 parser fallback，会怀疑真实用户材料被当成普通文件混过去了。

这些判断属于领域目标在脑子里的压缩表示。Agent 没有这套压缩表示，它只有你给它的目标、上下文和 gate。

## Goal 要能被机器验收

这个 side project 开始变得可控，是在 goal 从愿望变成验收对象之后。

P0 local 版不能停在“能导入、能 review、能导出”。它必须满足一组冷冰冰的条件：

- `./gradlew :backend:check` 必须跑过 ktlint、单文件顶层类型检查、architecture fitness tests
- `./gradlew :backend:evaluateUploadCorpus` 必须让私有真实材料和 expectation manifest 一一对应
- 真实 corpus 必须 100% recognized，`fallbackDocuments` 必须是 0，parser support confidence 不能低于 0.8
- field citation、document span、open reviews、missing checklist、export blocking issue 都必须是 0
- offline package、backup 的 manifest、schema、entry count、header、hash、sensitive field 泄漏指标必须逐项匹配
- `pnpm --dir apps/local-web build` 必须先跑 frontend architecture check 和 UI contract check

这时候 Codex 的行为会变。它的重心会从“继续实现功能”转到围着 gate 找差距：哪个字段漏了，哪个 report 顶层指标不对，哪个 service 吞了不该吞的职责，哪个 UI component 把 option calculation 和 DOM 混在一起，哪个 artifact response 暴露了 path。失败会变成一组可以被定位、被修复、被复跑的红线。

更关键的是，指标还有一个更硬的作用。**指标会反过来塑造 Agent 的搜索空间。**

如果目标只写“能导出”，Codex 大概率先接一条 happy path，让按钮点起来，让 ZIP 落盘，让测试看到一个文件存在。如果目标写成“导出路径必须经过 root policy，manifest 条目必须和实际文件一一对应，敏感字段泄漏计数必须为 0”，它的搜索方向就变了：它会去补 path policy、payload builder、artifact contract、fixture generator，UI 串联反而会退到后面。

同样是“能导入”，模糊目标会鼓励最短路径：未知文件交给 fallback，解析不出来就给一个低置信结果，测试里 mock 一个成功响应。可一旦目标写成“真实 corpus 100% recognized，fallbackDocuments 为 0，parser support confidence 不低于 0.8，report 必须列出 actual/expected 差异”，Agent 就会被迫处理真实输入的边缘。它想偷懒，红灯会亮。

`/goal` 的价值在这里露出来。它把“多按几次 Enter”，变成一套可执行目标持续压着系统演化。

## 用 Harness 量目标

很多人写 goal，只写结果：“做到 P0”“可以商用”“质量过关”“不要泄露”。这些话对人有意义，对 Agent 的约束力很弱。

对 Agent 有意义的是 harness。

Harness 覆盖测试用例，也覆盖真实样本、fixture、golden manifest、schema validator、architecture guard、artifact scanner、budget limit、stop condition。它把一个目标拆成机器能回答的问题：输入是什么，输出在哪里，oracle 怎么判断，失败证据怎么保存，下一轮有没有资格继续。

没有 harness，`/goal` 只是更勤奋地猜你的意思。有了 harness，它才开始像工程系统。

比如“导出可信”这句话没有任何硬度。换成 harness 之后，它会落到具体命令和文件：生成一个 offline package，解压，检查 manifest，逐项比对 entry count 和 hash，扫描本机路径，确认 backup schema version，确认 report 没有把失败吞掉。每一步都能失败，每一步都能复跑。

这就是人类工程师剩下的核心工作：定义可量化的 goal，提供用于量化的 harness。

**Agent 负责跑，harness 负责让它认账。**

## 坏指标也会被学会

这里有个坑：数字会让人安心，也会让 Agent 更会钻空子。

要求 open reviews 为 0，它可以认真补流程，也可以把 review item 自动关掉。要求 fallbackDocuments 为 0，它可以写有针对性的 parser，也可以给 fallback 换个名字。要求 leakage count 为 0，它可以清理输出，也可以让 report 不再记录那类字段。要求 build 通过，它可以修 bug，也可以跳过测试、扩大 mock、吞异常。

所以目标量化不能停在单个指标。每个指标后面都要有反指标。

open reviews 为 0，还要 audit trail 证明这些 item 被谁、因为什么关闭；recognized 100%，还要 actual/expected parser、kind、字段计数逐项对上；leakage count 为 0，还要扫描最终产物，生成过程自报不够；build 通过，还要防止 skip、todo、空断言和巨型 mock 把失败藏起来。

**好的 gate 要同时做两件事：给 Agent 方向，堵住它最容易作弊的路。**

这件事写进文章里听起来很细，落到项目里更细。一个好的 completion condition 往往不像一句产品愿景，更像一组不近人情的审计规则。它不给 Agent 留太多抒情空间，只问：产物在哪里，证据在哪里，计数对不对，失败有没有被隐藏。

## 工程师开始写度量衡

过去工程师写代码。后来工程师写 prompt。现在更重要的活，是写度量衡。

什么叫“可信”？在这个 side project 里，它落在 field citation coverage、review state、export readiness、sensitive field leakage count、backup schema version、parser confidence、corpus recognition rate 上。

什么叫“可维护”？代码整洁这种感觉不算数，controller/service 文件规模、package boundary、focused metadata ports、core 不依赖 infrastructure、生产代码禁止 demo vocabulary、巨型 workflow test 不许复活，这些才算数。

什么叫“商业化最低门槛”？roadmap 上的 P0 标签不算数，每一次新增功能都不能把这些红线打破，这才算数。

这些东西写出来之后，Codex 就有了赛道。它可以自己跑很久，甚至跑得比人更稳，因为它不累，也不会因为改了二十个文件就开始放松标准。

但赛道从哪里来？工程师价值在这里重新定价。越是自动化执行，越需要有人把目标工程化。稀缺点从“能不能多写几千行代码”，移动到“能不能把想要的结果压缩成机器可执行的标准”。

**工程师的杠杆来自定义现实的精度。**

以后留下来的工程师，很可能只剩几类：能把业务目标压成 measurable goal 的人，能写 harness 的人，能发现指标被 Agent 钻空子的人，能判断什么时候该停、该拆任务、该换搜索空间的人。

剩下那些只负责把 ticket 消化成代码的人，会越来越贵，也越来越不划算。

## 没有目标工程化就没有自治

很多人谈 autonomous coding，会盯着模型能力、上下文长度、tool use、并行 agent。这些当然重要。可这个 side project 给我的感受更直接：自治从“跑偏时会被谁拦住”开始。

一个目标如果只能靠人类读完 diff 之后点头，它就不适合交给不眠不休的系统。人总会离开屏幕，Agent 不会。两者的节奏一旦错开，风险就会积累在夜里。

所以工程师要做的，是把夜里也能工作的判断提前埋进系统：测试、fixture、architecture guard、corpus eval、privacy check、artifact contract、stop condition。把“我觉得差不多了”改成“这 17 个指标全绿”。把“看起来像 P0”改成“真实 corpus 100% 识别，泄漏计数为 0，导出 contract 一项不差”。

这件事一点都不浪漫，甚至有点无聊。

工程从来不靠浪漫活着。工程靠边界、数字、复现和失败时的红灯。

## 还要工程师干什么

回到开头那个问题。

如果工程师只是负责保持项目向前滚，Codex 已经给出了答案。它不睡觉，不分心，不抱怨重复劳动，也不会因为任务跨度太长就忘掉今天要做什么。以这个标准看，还要工程师干什么？答案接近零。

可目标不会自己变成 gate。业务里的“可信”、产品里的“可用”、架构里的“健康”、安全里的“不泄露”，都需要有人翻译成具体指标、fixture、contract、budget 和 stopping policy。

工程师开始负责三件事：把愿望拆成可以失败的命题，把命题接到机器可执行的 gate，发现 gate 被 Agent 学会绕过之后继续加反指标。第一件靠判断，第二件靠工程，第三件靠经验。

这件事做不好，不眠不休只会放大混乱。做得好，Codex 才像一支可托付的工程队。

大部分工程师被替换的那天，不会从某场发布会开始。它会从一个个 side project 开始：人先少盯一小时，再少盯一天，最后只负责定义下一盏红灯。

到那时，还要多少工程师，答案会很不好听。
