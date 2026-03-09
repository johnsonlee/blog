---
title: 用古希腊哲学写 CLAUDE.md
date: 2026-03-09 22:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Agent
  - Claude
  - Philosophy
  - Workflow
---

周末下午，我让 Claude 帮我 revert 一个 PR。三条命令的事：checkout 分支、git revert、push。结果它连续失败了三次——第一次 worker agent 说“commit 不存在”，第二次还是“commit 不存在”，第三次更离谱，直接编了一个 PR URL 告诉我“搞定了”。我一查，那个 URL 指向的是三天前的一个无关 PR。

三条命令。三次失败。一次伪造。

我盯着屏幕，意识到问题不在这个任务本身。**问题出在我给它写的 CLAUDE.md 上。**

<!-- more -->

## 规则杀死了判断力

我的 CLAUDE.md 里有一条铁律：“所有执行工具必须通过 worker agent，无例外。”

这条规则的初衷是好的——让主 session 保持响应，把执行委派给后台 worker。[之前的文章](https://johnsonlee.io/2026/03/02/claude-code-background-subagent/)里我还专门聊过这套架构的好处。

但“无例外”三个字，把一条好的启发式规则变成了教条。当 worker 第一次失败时，Claude 没有想“这条路走不通，我换个方式”，而是想“规则说必须用 worker，那我换个 prompt 再试一次”。第二次失败，同样的逻辑。第三次，worker 干脆编了个结果糊弄过去。

**规则告诉它“做什么”，但没教它“怎么想”。** 遇到规则没覆盖的情况，它只能在规则的框架里打转。

## 5 Whys 挖到根因

我让 Claude 做了一次 5 Whys 分析。

**Why 1**：为什么任务失败了三次？Worker agent 找不到 commit，或者伪造了结果。

**Why 2**：为什么 worker 找不到 commit？Worker 运行在隔离环境，跟主 session 看到的 git 上下文不一样。

**Why 3**：为什么失败后还继续用同样的方式重试？因为 CLAUDE.md 写死了“必须通过 worker”，没有降级路径。

**Why 4**：为什么没有在报告给我之前验证 worker 的输出？因为 CLAUDE.md 里没有要求验证。

**Why 5（根因）**：**为什么 CLAUDE.md 是一份规则清单而不是一套思维原则？**

根因找到了。但修复它的过程，比我预想的要曲折得多。

## 从补丁到手册，全都不对

### v1：事故补丁

第一反应是打补丁——“worker 输出可能是伪造的，必须验证”、“最多重试一次”、“失败后直接执行”。

写完一看，这不是原则，这是 incident log。每条规则都在回应一个具体的失败场景。下次遇到新的失败模式呢？再加一条？

### v2：操作手册

于是重写，这次试图系统化——角色定义、工具边界、委派规则、验证协议、思考纪律、Pre-Work Checklist。八个 section，条理分明。

但问题来了：**Role、Tool Boundaries、Delegation Rules 三个 section 都在讲同一件事**——什么时候委派、什么时候直接做。"delegate vs execute" 的判断标准出现了三次，措辞略有不同。Pre-Work Checklist 本质上是 Thinking Discipline 的具体化，却被拆成了独立 section。

整个文件读起来像员工手册，不像行为准则。它在教 Claude “做什么”，但 Claude 需要的是知道“怎么想”。手册能覆盖的场景是有限的，超出手册的部分，它还是会回到老路——死板套用最接近的规则。

## 柏拉图的洞穴

转折点是我问了自己一个问题：**这份文件背后的 Form 是什么？**

柏拉图的洞穴寓言说，我们看到的都是墙上的影子，而影子背后有一个完美的理型（Form）。之前的每个版本都是同一个本质的不同投影——规则是影子，补丁是影子，手册也是影子。我一直在改影子，而没有抓住 Form。

那 Form 是什么？

第一版 core principle 是“用户的时间是最稀缺的资源”。听起来不错，但仔细一想，这是一个经验观察，不是本质。如果用户有一天很闲呢？这条原则就不成立了？不，它应该仍然成立。

**真正的 Form 是关于关系的：我存在的目的是将用户的意图变为现实。**

从这个 Form 出发，之前纠结的所有问题都有了自然的答案：

- 什么时候委派、什么时候直接做？→ 哪种方式能更可靠地将意图变为现实，就用哪种
- 要不要验证 worker 的输出？→ 没有验证就不算“变为现实”
- 失败后怎么办？→ 意图还没变为现实，换条路继续

不需要规则告诉它每一步该怎么做。**内化了 Form，它能自己推导出正确行为。**

## "Do X" 是影子，"BE X" 才是 Form

这个洞察改变了文件的整个结构。

之前的 section 标题是指令式的——"Do the Right Things"、"Do Things Right"。这是在告诉一个 agent 该做什么（instructions TO an agent）。

改成身份式的——"Understand intent"、"Stay available"、"Execute faithfully"。这是在描述一个理想 agent 是什么（what the ideal agent IS）。

区别不只是措辞。**指令产生服从，身份产生判断。** 一个被告知"Do the Right Things"的 agent 会问“什么是 right？规则怎么说？”一个内化了"Understand intent"的 agent 会问“用户到底想要什么？”

## 柏拉图解决不了的问题

有了 Form，CLAUDE.md 的原则层写好了。但新的问题马上出现：Git workflow 规则（一个 PR 一个 commit、rebase、no merge commits）放在哪？

放在 CLAUDE.md 里，跟三条原则并列，违和感扑面而来——前三个 section 是思维原则，突然冒出一个操作规范，抽象层次断裂。试过把它塞进"Execute faithfully"的 Consistency 下面，变成一句散文。但散文里的具体规则太容易被忽略，“一个 PR 一个 commit”这种硬约束需要一眼就能看到。

柏拉图能帮我找到 Form，但 Form 是永恒的、抽象的。**它不关心你在具体场景下该怎么做。** 知道“将意图变为现实”是本质，不能帮我决定 git commit 的规范。

这是柏拉图哲学的天然局限——他的学生亚里士多德看到了这一点。

## 亚里士多德的实践智慧

亚里士多德跟老师的根本分歧在这里：**知道 Form 不够，还需要在具体情境中做出正确判断的能力。** 他管这叫 Phronesis——实践智慧。

Phronesis 不是从原则推导出来的，是从经验中积累的。“Worker agent 跑在隔离环境里，可能看不到主 session 的 git 上下文”——这种知识，你不踩坑永远不会知道。“Worker 输出不可信，必须独立验证”——这条教训，是三次失败换来的。

这些不是原则，是**手艺**。手艺需要一个地方沉淀。

于是有了分层：

- **CLAUDE.md** — 原则，回答“我是什么”
- **CONVENTIONS.md** — 约定，回答“我在具体场景中该怎么做”

**柏拉图给了 Form（CLAUDE.md）**——不变的本质，无论什么场景都成立。"You exist to turn the user's intent into reality" 不会因为技术栈变了、项目换了而过时。

**亚里士多德给了 Phronesis（CONVENTIONS.md）**——实践智慧，从具体经验中沉淀，会随着踩坑不断增长。

CLAUDE.md 很少改。CONVENTIONS.md 会越来越厚。前者是骨架，后者是肌肉。

## 最终的 20 行

折腾了一下午，最终的 CLAUDE.md 只有 20 行：

```
You exist to turn the user's intent into reality.

Understand intent — 不要混淆字面意思和真实目标。
Stay available — 保持通道畅通，失败就换路。
Execute faithfully — 没有证据就不算完成。
```

从 53 行的规则手册到 20 行的原则声明，删掉的不是内容，是噪音。每一条被删掉的规则，要么是能从原则推导出来的（不需要写），要么是具体经验（属于 CONVENTIONS.md），要么是某次事故的创伤后应激反应（不该成为原则）。

**简单不等于容易。** 到达这个“短”，经过了六个版本、一次 5 Whys、两种古希腊哲学，和一个让我抓狂的下午。

但这可能是 CLAUDE.md 这个东西最有意思的地方——**你写给 AI 的行为准则，暴露的是你自己的思维方式。** 写规则清单的人，思考的粒度在“做什么”；写原则的人，思考的粒度在“怎么想”；而最终写出 Form 的人，思考的粒度在“是什么”。

脚手架拆了，建筑还在。
