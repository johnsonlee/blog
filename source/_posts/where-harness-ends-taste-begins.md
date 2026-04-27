---
title: Harness 的尽头是品味
date: 2026-04-26 14:04:43
categories:
  - Independent Thinking
tags:
  - Agent
  - Harness Engineering
  - Architecture
  - Code Quality
  - Maintainability
i18n_key: where-harness-ends-taste-begins
---

最近 Agent 写的代码，review 时要改的东西越来越多。硬编码、魔法数字、抛异常时不给用户友好提示、catch 了又吞掉、内存悄悄上涨、循环里塞着循环——以前偶尔出现，现在几乎每个 PR 都能看到。

**Agent 写代码快，但快得没有 engineering excellence。**

<!-- more -->

## 不止是这些

开头列的几条只是表面。真正展开 Agent 生成的代码看，还会发现：

- 跨层调用、绕过 facade 直接访问内部实现；ViewModel 反向持有 View、Repository 调 ViewModel，单向数据流被打成蜘蛛网
- `var` 和 `MutableList` 满天飞，data class 里随手加 setter，“为了方便修改”——线程一多就出鬼
- 测试覆盖率漂亮，但断言写成 `assertTrue(result != null)`，mutation testing 一跑得分惨不忍睹

每一条单拎出来都是老问题，review 时一眼能看出来。问题是 review 不过来——Agent 一天产出的代码量，是人工 review 节奏的几倍甚至几十倍。

## Agent 的盲区是 engineering excellence

把这些症状归因到“模型还不够强”是偷懒。同一个模型，给它清晰的约束和上下文，它能写出非常工整的代码；给它一个模糊的 task，它就走阻力最小的路。

阻力最小的路是哪条？

- 硬编码比抽象常量近
- `throw` 比设计错误体系近
- 加内存比优化算法近
- 反向调用比重构数据流近
- `var` 比设计 reducer 近
- 弱断言比想清楚边界条件近

senior 工程师为什么不会走这些路？不是因为记得“不要硬编码”这条规则，而是因为内化了一整套 engineering excellence——对长期成本的敏感、对可读性的洁癖、对边界条件的本能、对未来维护者的同理心。这些不是知识，是品味、经验、判断的复合体。

Agent 没有这些。它有的是“完成当前 task”的反馈信号，没有“这段代码会被维护十年”的内在驱动。它的视野是当前 task，看不到全局成本。它不知道这个魔法数字三个月后没人敢改，不知道这个吞掉的异常会让线上排查多花两小时，不知道这条反向调用让整个模块的可推理性瓦解。**它只对眼前的“能跑过测试”负责，因为这是它能拿到的唯一反馈**。

更深一层：Agent 倾向于“让代码看起来正常工作”，而不是“让系统真的健康”。吞异常是最典型的伪健康——编译过、测试过、线上炸。

这不是 prompt engineering 能补的。engineering excellence 是品味，不是知识。再长的 prompt 也写不出“对长期成本的敏感”。

**我们做过实验，单纯靠语气升级——加 “please”、“important”、“must”、“critical” 这类强调词——只能带来 1% 左右的提升。** prompt 能传递的是任务描述，不是品味；品味必须通过 harness 外化，才能传给 Agent。

## 人治时代的“最佳实践”，在 Agent 时代是生死线

过去二十年，软件工程积累了大量关于代码质量的经验：单向数据流、不可变状态、性能预算、错误处理契约、架构边界。在人写代码的时代，这些是 **nice to have**——有当然好，没有也能靠 senior 的经验、code review 的人工把关、事后重构来兜底。

当代码的主要生产者从人变成 Agent，这些 nice to have 全部变成了 **must have**。

原因很简单：人治依赖的是隐性知识、经验直觉、口头规则、review 时的临场判断——这些东西不可扩展，也无法被 Agent 消费。Agent 不会因为你在周会上强调过“不要硬编码”就不硬编码，它只对**机器可执行的约束**有反应。

加强 review？人工 review 跑不过 Agent 的生成速度，这条路不可扩展。
写更详细的 prompt？治标不治本，prompt 里没覆盖的角落 Agent 一定会塌方。
事后重构？等你回头收拾，债务已经累积成山。

真正的解法只有一条：**把过去靠 review 和经验把关的那些规则，前置成机器可执行的 harness**。

## Harness 的双层反馈：Fast Loop 与 Slow Loop

Harness 不是单一的 CI 检查那么简单。Agent 时代的 harness，必须是**双层反馈系统**：

### Fast Loop：本地、秒级、给 Agent 自我修正用

开发者敲完代码到拿到反馈，秒级到分钟级。IDE 实时提示、pre-commit hook、本地一键跑的 lint 和 benchmark——这一层服务的不只是开发者，更是 Agent。

Agent 能不能写出可维护的代码，很大程度上取决于它能不能在生成的瞬间拿到反馈、自我修正。如果一条规则只有 CI 才能检查，Agent 写完一轮后等十分钟拿到红灯，反馈链已经断了，Agent 没法用这个信号迭代。

### Slow Loop：CI、统一 quality gate、防漏网

PR 提交到合入，分钟级到小时级。承载完整的静态分析、benchmark suite、mutation testing、架构契约校验——确保任何一条规则都不会被人为关闭或绕过。

**Fast Loop 解决“早知道”，Slow Loop 解决“防漏网”**。两层缺一不可：只有 CI 没有本地，反馈链太长，Agent 的自我修正能力被截断；只有本地没有 CI，规则会被人为关闭，约束形同虚设。

设计 harness 的时候，**优先把规则做成本地可执行的**。CI 是兜底，不是主战场。

## 把症状逐个翻译成 Harness

回到开头列出的那组症状，每一类都对应一组具体的 harness 手段。

### 硬编码 / 魔法数字

Fast Loop：detekt / ktlint 配 IDE 插件，业务逻辑里出现字面量直接红线（白名单：0、1、-1、空串）；pre-commit hook 兜底。
Slow Loop：CI 跑全量静态扫描作为合入门槛。
架构契约：所有配置走 `Config` 对象，所有常量进 `Constants` 或领域枚举。

### 错误处理两极端

Fast Loop：自定义 detekt 规则禁止空 catch、禁止“只 log 不抛”、禁止跨模块边界裸 throw。
Slow Loop：CI 校验关键路径异常链完整性，所有用户可见路径必须返回结构化错误而非堆栈。
架构契约：定义统一错误模型（Result/Either 或领域异常体系），错误必须带 trace ID。

能被吞掉的异常，本质上是没有归属的异常——根因是错误处理没有架构契约。

### Performance Regression

这是 harness 最能体现“约束精度决定生成质量上限”的一类。

Fast Loop：本地 JMH benchmark，关键路径每个核心方法都有对应的微基准，开发者改完一条命令就能看回归；圈复杂度、嵌套循环用静态规则秒级反馈。
Slow Loop：CI 跑完整 benchmark suite，对比历史 baseline，超过阈值 block PR；内存 footprint 每次 build 留痕，趋势上涨告警。
架构契约：关键路径定义性能 budget——内存峰值、P99 延迟、对象分配速率，写成数字而不是“尽量优化”。

以 [Graphite](https://github.com/johnsonlee/graphite) 为例。它是基于 SootUp 的 JVM 字节码静态分析工具，核心路径（调用图构建、字节码解析）每个都有对应的 JMH benchmark。新增任何功能，本地一条命令跑完就知道这次改动有没有让内存峰值或吞吐量退化；CI 再跑一次完整 suite 作为统一 gate，对比 baseline，回归超阈值直接拒绝合入。

这套机制让“性能不退化”从一个口头约定，变成了机器可验证的硬约束。Agent 即使被允许动核心路径，也无法在不被察觉的情况下让性能劣化——因为 Fast Loop 阶段它自己就能看到 benchmark 数字。

### 架构契约：单向数据流 + Mutability

这两条值得单独拎出来，因为它们是 Agent 翻车率最高的地方。

单向数据流是一种**全局约束**，但 Agent 看到的是局部 task。“让这个按钮能改那个状态”的最短路径就是反向调用——它不知道这条捷径破坏了整个系统的可推理性。

Mutability 也一样。改一个字段比构造一个新对象近，加个 setter 比设计一个 reducer 近——Agent 永远走最近的那条路。但可变状态是系统复杂度的最大来源之一。

Fast Loop：
- 依赖方向用 ArchUnit 写成 unit test，本地可跑
- 调用图工具（Graphite 这类）本地分析数据流，可视化反向边
- detekt 规则强制 `val` over `var`、禁止 public API 暴露 `MutableList` / `MutableMap` / `MutableSet`
- data class 默认 immutable，可变需要显式 opt-in 并加注释说明

Slow Loop：CI 强制依赖方向校验作为架构测试，任何反向调用 block PR；并发关键路径用并发安全规则扫描。

单向数据流和 immutability 不是风格偏好，是**系统可推理性的基础设施**。一个允许反向调用、随处可变的系统，人类 review 都看不清因果，更不用说让 Agent 安全地改它。

反过来说，一个数据流单向、状态不可变的系统，对 Agent 极其友好——它的行为是局部可推理的，Agent 改一个函数，不需要担心副作用扩散到全局。

**好的 harness 不仅约束了 Agent，也解放了 Agent。**

### 测试腐化

Fast Loop：断言强度规则用静态分析 IDE 即时提示——禁止 `assertTrue(true)`、禁止空测试方法、断言数量下限。
Slow Loop：CI 跑 mutation testing（PIT / Pitest），mutation score 作为门槛；新增代码必须有对应的失败用例证明测试有效。

测试通过 ≠ 测试有效。这条最容易被忽视，也是 Agent 最爱钻的空子。

## Harness 的尽头是品味

把口头规则升级成机器可执行的 harness，是 Agent 时代的必修课。但必须警惕另一个极端——把 harness 工程当成万能解。

往回拆：harness 的本质，是**把人类工程师内化的 engineering excellence 外化成 Agent 必须遵守的契约**。senior 不会硬编码，是因为内化了对长期成本的敏感；harness 把这种敏感外化成“业务逻辑里出现字面量就 block PR”。senior 不会吞异常，是因为内化了对系统健康的洁癖；harness 把这种洁癖外化成“空 catch 块直接红线”。

但有一部分 engineering excellence 是外化不出来的。

架构本质上是一种品味。“这两个模块该不该合并”、“这个抽象是不是过早了”、“这个边界划在哪里更合理”、“这个 trade-off 现在合理三年后是否还合理”——这些问题没有静态规则能回答，它们依赖架构师对业务、对团队、对未来演化的综合判断。

Harness 能做的，是把**品味的产物**翻译成机器可执行的契约。架构师决定“这两个模块之间只能通过 EventBus 通信”，这是品味；ArchUnit / 调用图工具校验这条契约是否被破坏，这是 harness。**品味定义方向，harness 守护方向**。

回到驭马的隐喻：Agent 是马，harness 是约束工程，品味是骑手。

- 没有马，跑不快
- 没有 harness，马会乱跑
- 没有骑手，跑得再稳也是错方向

三者缺一不可。马具再精密，骑手没判断，照样跑偏；骑手再有判断，没有马具，控制不住马。

Agent 时代真正稀缺的，不是会写规则的人，是**知道哪些 engineering excellence 能外化成 harness、哪些必须留作骑手判断**的架构师。这个翻译能力本身，就是不可替代的核心能力。

## 周一你能干什么

如果今天上班想推动这件事，五条具体的：

### 盘点口头规则，做成本地可执行的

把过去半年 code review 里说过 3 次以上的话列出来，挨个问“能不能写成静态规则”。优先做成 IDE 插件 / pre-commit hook / detekt 自定义规则，CI 兜底。**口头规则不可扩展，机器规则才能跟上 Agent 的生成速度**。

### 关键路径配 JMH，建立性能 budget

挑出 3-5 条最重要的业务路径，给每条配 JMH benchmark，定义内存、延迟、复杂度的硬上限。本地一键跑，CI 对比 baseline，超阈值 block PR。

### 用调用图工具固化架构契约

ArchUnit + 调用图工具（Graphite 这类）把模块依赖方向、数据流方向、mutability 规则写成可校验的契约。本地可跑，CI 强制。

### 重构错误处理契约

定义统一的 Result / 错误码体系，detekt 自定义规则禁止裸 throw 和空 catch，本地实时反馈。错误必须可追踪，trace ID 串到底。

### 把 harness 注入 Agent 上下文

不只给 Agent 任务描述，把规则集、架构契约、性能 budget 一起喂给它。让 Agent 在生成时就受约束，而不是生成后被 review 拒绝。**让 Agent 调用本地工具链获取反馈，闭环 self-correction**。

## 架构师的角色变了

人治时代，架构师的核心产出是“设计”——架构图、文档、规范、review 意见。这些产出是给人看的，靠人的 engineering excellence 去落地。

Agent 时代，架构师的核心产出必须是**可执行的 harness**——静态规则、性能 budget、架构测试、调用图契约、mutability 规则。因为 Agent 没有 engineering excellence，它落不了地。架构师必须把自己内化的工程品味，外化成机器可执行的契约，Agent 才能照着跑。

这不是降级，是升级。一个写在 wiki 上的架构规范，影响的是看过它的人；一条嵌入 CI 和 IDE 的静态规则，影响的是每一行被生成的代码。**Harness 的杠杆远大于文档的杠杆**。

那些过去被列在“团队最佳实践”清单上的条目——单向数据流、immutability、性能 budget、错误契约——曾经是架构师的品味，现在是系统的生死线。Agent 越强，这条线越重要。

架构师的工作重心从“做出好的架构决策”转向“**把内化的 engineering excellence 外化成 Agent 必须遵守的 harness**”。前者是品味，后者是工程。两者缺一不可：没有品味，harness 本身就是错的；没有工程，再好的品味也跑不过 Agent 的生成速度。

真正决定一个团队能不能驾驭 Agent 的，不是 Agent 多聪明，而是这个团队**有多少 engineering excellence 被外化成了 harness**。

而真正的护城河，是品味和 harness 的乘积。
