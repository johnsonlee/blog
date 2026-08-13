---
title: Agent 真的需要 TDD 吗？
date: 2026-08-13 09:23:00
categories:
  - Independent Thinking
tags:
  - AI
  - Agentic Coding
  - TDD
  - Harness Engineering
  - Testing
i18n_key: agent-tdd-is-self-verification
---

前两天在 Martin Fowler 网站看到一篇文章。作者把同一批任务交给 Sonnet 4.6，一组要求严格按 TDD 做，一组随它写，再让 Opus 4.8 盲评。结果有点打脸：TDD 组没写得更好，Token 至少多烧 3 倍。看到这里，我第一反应不是 TDD 过时了，而是我们可能让 Agent 做了一件看起来很工程、其实很奇怪的事：自己出题，自己答题，再自己宣布通过。

<!-- more -->

## TDD 解决的本来就是人的问题

TDD 有两样东西经常被混在一起：测试，和写代码的方式。

测试当然有用。它记录行为，保护回归，也让重构有底气。但 Red-Green-Refactor 这套流程，本来是在帮人思考。先写测试，逼着我们从调用者的角度看接口；一步只做一点，避免脑子同时装太多东西；每亮一盏绿灯，就敢再往前走一步。

Kent Beck 说 TDD 是用来管理 fear 的。Agent 没有 fear，也不会因为问题太大而不敢下手。它拿到完整需求时，通常已经在同时规划测试和实现。要求它先把测试写进文件，只是换了落盘顺序，不代表它真的经历了人写测试时那段思考。

这就像要求挖掘机开工前先活动手腕。动作没错，机器没有那块肌肉。

**TDD 对人的价值，不能靠一段 prompt 原样搬给 Agent。**

## Red 过，不等于测试对

很多人坚持让 Agent 先跑出 Red，理由也很直接：测试先失败过，至少能证明它不是摆设。

可 Red 只能证明测试和代码不一致，证明不了为什么不一致。可能是实现缺了，也可能是 import 错了、fixture 坏了，甚至测试断言了一个根本不存在的需求。如果测试和实现都来自同一个 Agent，它们还会共享同一份误解。

原文里就出现过一个很典型的例子：测试重新调用实现逻辑计算 expected value，再拿两边结果做比较。它当然会绿。更荒唐的是，哪怕先把这段测试写出来、亲眼看它红过，也不会让它更接近真实需求。

所以我更在意 mutation testing。故意改坏实现，看看测试能不能抓到，至少能证明这张网不是画上去的。但 mutation score 再高，也只能证明测试能发现代码变化，不能证明测试里的答案是对的。

**测试最重要的不是先写，而是答案从哪里来。**

## TDD 反而挡住了 Agent

[Birgitta Böckeler 的实验](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html)一共做了 5 个 batch。小型和中型任务里，非 TDD 实现多次排在前两名，TDD 实现落在后两名；大型任务里，TDD 只排在中间。两组的 mutation score 也没拉开差距。

Opus 看完执行记录后给了一个解释：不受 TDD 限制时，Agent 往往先把数据结构、边界条件和整体设计想一遍；按 TDD 做时，它围着第一个测试不断做局部最小修改，早期设计很快被锁死，后面却没有像人一样认真回头 Refactor。

这和我们熟悉的经验正好相反。人通过小步慢慢发现设计，Agent 却更擅长先看完整问题，再一次性生成一个相对完整的方案。硬逼它走 baby steps，可能是在拿人的认知限制约束机器。

当然，这个实验很小，任务都是从零实现，质量还是由另一个 LLM 评的。它证明不了“Agent 做 TDD 一定更差”。而且缓存会让 3 倍 Token 不等于 3 倍账单。

但已经足够问一句：质量没提升，Token 烧得更多，我们为什么默认这套流程值得保留？

## 测试要放在 Agent Loop 外面

我不是要扔掉 TDD，而是要把它拆开。

如果测试由人来写，里面装的是人的 judgment，Agent 再去补实现，这很有价值。如果 Agent 先写测试，人确认它测的是正确行为，再让 Agent 继续，也有价值。真正可疑的是第三种：Agent 在自己的 Loop 里写测试、看它失败、补实现、看它通过，全程没有外部判断。

三种做法看起来都叫 TDD，差别不在谁先写，而在**测试和实现是不是来自同一个答案源**。

需求方给出的 example、线上事故留下的 regression case、旧系统跑出来的 golden output、协议 schema、性能 budget，这些东西才接近 ground truth。它们不一定长得像 unit test，但都在告诉 Agent 什么结果不能交。

这是 [What Caps How](https://johnsonlee.io/2026/03/10/what-caps-how/) 在测试里的版本。测试应该是可执行的 What。What 也让 Agent 自己定义，接下来无论 How 跑得多勤快，都只是在完成一次自证。

## 我不关心 Agent 怎么写

Agent 产出越快，我越需要 regression test、architecture test、static analysis、mutation testing 和 benchmark。只是这些东西应该成为外部 gate，而不是 Agent 用来证明自己认真工作的过程记录。

测试杀不掉 mutation，就补测试；模块边界开始漂移，就加 architecture rule；真实样本漏了，就把它放进 regression corpus。至于 Agent 是先写测试还是先写实现，我不关心。

Refactor 也不必绑在每次 Green 后面。复杂度、依赖方向、一次改动碰了多少文件、性能有没有退化，都可以直接触发 review。对着坏结果修，比在 prompt 里提醒它“现在该认真 Refactor 了”靠谱。

这和我在[《从 Prompt 到 Harness》](https://johnsonlee.io/2026/05/15/from-prompt-to-harness/)里的判断一样：告诉 Agent 应该怎么做，只能改变它做对的概率；能把错误挡住的，才叫 Harness。

TDD 没过时。人写代码时，它还是很好的思考工具；人写测试、Agent 写实现时，它也是很好的协作方式。

该停掉的，是 Agent 在 Loop 里那场无人观看的 Red-Green-Refactor。

下次 Agent 告诉你“已严格遵循 TDD”，先别急着放心。问一句：**测试里的答案，是谁给的？**
