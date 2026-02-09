---
title: 软件工程的最后一次范式革命
date: 2026-02-10 09:00:00
categories:
  - Computer Science
  - Engineering
tags:
  - AI
  - Agent
  - Claude
---

最近这一年，AI 辅助编程工具如雨后春笋般涌现，从 GitHub Copilot 到 Cursor，再到 Claude Code，每一个都号称能让程序员的效率翻倍。作为一个在代码世界里摸爬滚打了 20 多年的老兵，我不禁开始思考：当 AI 能够理解我们的意图并自主完成任务时，我们的角色是否也应该随之改变？

答案是肯定的。

当 Programming 逐渐被 AI 接管，人类工程师的价值将越来越多地体现在 **Engineering** 层面 —— 系统设计、架构决策、约束定义、质量把控。我称这种新的工程范式为 **Agent-Oriented Engineering（面向智能体工程）**。

## Programming vs Engineering

在继续之前，我想先厘清一个概念：**Programming** 和 **Engineering** 的区别。

**Programming** 关注的是"怎么做"—— 写代码、调试、优化算法。这是 AI 正在快速掌握的领域。Claude Code 已经能够理解需求、生成代码、修复 bug，甚至进行重构。

**Engineering** 关注的是"做什么"和"为什么"—— 系统架构、技术选型、约束条件、质量标准、风险评估。这是需要人类判断力和经验的领域。

```plantuml
@startuml engineering-vs-programming
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial
skinparam defaultFontSize 14

skinparam rectangle {
    BackgroundColor<<human>> #E3F2FD
    BackgroundColor<<ai>> #FFF3E0
    BackgroundColor<<task>> white
    BorderColor #666666
    RoundCorner 10
}

rectangle "**Engineering** (人类主导)" as eng <<human>> {
    rectangle "架构设计" as arch <<task>>
    rectangle "约束定义" as cons <<task>>
    rectangle "质量标准" as qual <<task>>
    rectangle "风险评估" as risk <<task>>
}

rectangle "**Programming** (AI 主导)" as prog <<ai>> {
    rectangle "代码生成" as code <<task>>
    rectangle "调试修复" as debug <<task>>
    rectangle "重构优化" as refactor <<task>>
    rectangle "测试编写" as test <<task>>
}

eng -[#666666,thickness=2]-> prog : "  目标 + 约束  "

@enduml
```

这不是说人类不再需要理解代码 —— 恰恰相反，我们需要更深刻地理解代码和系统，才能有效地指导 AI Agent。但我们的主要精力将从"写代码"转向"设计系统"和"定义约束"。

## 为什么是现在？

在过去的几十年里，人类与计算机的交互方式经历了一个有趣的演变：

```plantuml
@startuml interface-evolution
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 15
    BorderColor #333333
}

rectangle "**命令行**\nCommand Line" as cli #B3E5FC
rectangle "**图形界面**\nGUI" as gui #C8E6C9
rectangle "**专有软件**\nSpecialized Software" as soft #FFE0B2
rectangle "**自然语言**\nNatural Language" as nl #F8BBD9

cli -right-> gui : ""
gui -right-> soft : ""
soft -right-> nl : ""

note bottom of cli
  学习门槛高
  需要记忆命令
end note

note bottom of gui
  直观但受限
  功能由开发者预设
end note

note bottom of soft
  功能强大
  但需要专业培训
  (PS, Excel, IDE...)
end note

note bottom of nl
  **零门槛**
  说人话就行
end note

@enduml
```

过去，想要让计算机完成一项任务，你必须学习它的"语言"—— 无论是命令行、图形界面还是专有软件的操作逻辑。想做个海报？学 Photoshop。想分析数据？学 Excel。想开发应用？学编程语言。

每一种专有软件都是一道门槛，每一门编程语言都是一堵墙。

但现在，这一切正在改变。

当 AI 能够理解自然语言，人类终于可以用**最自然的方式**——说话——来表达需求。不需要学习任何专有软件，不需要掌握任何编程语言，只需要清晰地描述你想要什么。

```plantuml
@startuml old-vs-new
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial
skinparam defaultFontSize 12

skinparam package {
    BorderColor #666666
}

skinparam rectangle {
    RoundCorner 8
}

package "传统方式" #FFEBEE {
    rectangle "人类需求" as req1 #FFCDD2
    rectangle "学习专有软件\n(Photoshop/Excel/IDE...)" as learn #FFCDD2
    rectangle "手动操作" as manual #FFCDD2
    rectangle "结果" as result1 #FFCDD2
    
    req1 -right-> learn
    learn -right-> manual
    manual -right-> result1
}

package "AOE 方式" #E8F5E9 {
    rectangle "人类需求\n(自然语言)" as req2 #C8E6C9
    rectangle "AI 理解\n+ Agent 执行" as agent #C8E6C9
    rectangle "结果" as result2 #C8E6C9
    
    req2 -right-> agent
    agent -right-> result2
}

@enduml
```

这就是 Agent-Oriented Engineering 兴起的根本原因：**自然语言成为了新的编程接口**。

当你可以直接说"帮我把这个 AB 实验的代码清理掉，保留 treatment 分支"，而 Agent 能够理解这句话的含义、分析代码库、执行重构、验证结果 —— Programming 这件事本身就被重新定义了。

## 从 OOP 到 AOE 的演进

回顾软件工程的发展历程，我们经历了几次重大的范式转变：

```plantuml
@startuml paradigm-evolution
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 15
    BorderColor #333333
}

skinparam note {
    BackgroundColor #FFFDE7
}

rectangle "**POP**\n过程式编程" as pop #B3E5FC
rectangle "**OOP**\n面向对象" as oop #C8E6C9
rectangle "**AOP**\n面向切面" as aop #FFE0B2
rectangle "**AOE**\n面向智能体" as aoe #F8BBD9

pop -right-> oop : ""
oop -right-> aop : ""
aop -right-> aoe : ""

note bottom of pop
  1970s
  ----
  指令序列
  人类编写每条指令
end note

note bottom of oop
  1990s
  ----
  对象协作
  人类设计对象交互
end note

note bottom of aop
  2000s
  ----
  关注点分离
  人类定义横切关注点
end note

note bottom of aoe
  2020s
  ----
  人机协作
  **人类用自然语言定义目标**
end note

@enduml
```

每一次范式的转变，都伴随着人机交互方式的升级：

| 范式 | 人类职责 | 交互方式 |
|-----|---------|---------|
| POP | 编写每一条指令 | 代码 |
| OOP | 设计对象和交互 | 代码 |
| AOP | 定义横切关注点 | 代码 + 配置 |
| **AOE** | **定义目标和约束** | **自然语言** |

> 那人类工程师到底做什么？

简单来说：**定义问题，而非解决问题**。

我们的工作从"写代码解决问题"转变为"清晰地描述问题让 Agent 去解决"。这听起来简单，实际上对工程师的要求更高了 —— 你需要更深刻地理解问题本质，更精准地描述约束条件，更全面地考虑边界情况。

代码可以模糊，编译器会报错。但自然语言的模糊，会导致 Agent 走向完全错误的方向。**清晰表达的能力，成为了新时代工程师的核心竞争力。**

## 什么是 Agent？

在讨论 Agent-Oriented Engineering 之前，我们需要先明确什么是 Agent。简单来说，Agent 是一个能够**感知环境、做出决策并采取行动**的自主实体。

```plantuml
@startuml agent-loop
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 10
}

skinparam agent {
    BackgroundColor #E8EAF6
    BorderColor #3F51B5
}

skinparam card {
    BackgroundColor #FFF8E1
    BorderColor #FF8F00
}

card "Environment\n环境" as env #E0E0E0

rectangle "**Agent**" as agent #E8EAF6 {
    rectangle "**Goal**\n目标/意图" as goal #BBDEFB
    rectangle "**Perceive**\n感知" as perceive #C8E6C9
    rectangle "**Reason**\n推理决策" as reason #FFF9C4
    rectangle "**Act**\n采取行动" as act #FFCCBC
    rectangle "**Learn**\n学习改进" as learn #E1BEE7
    
    goal -down-> reason
    perceive -right-> reason
    reason -down-> act
    act -down-> learn
    learn -left-> reason : 优化策略
}

env -right-> perceive : 输入
act -right-> env : 输出
env ..> learn : Feedback

@enduml
```

与传统的函数或服务不同，Agent 具有以下特征：

| 特征 | 传统函数/服务 | Agent |
|-----|-------------|-------|
| 自主性 | 被动调用，严格按指令执行 | 主动决策，自主规划路径 |
| 目标导向 | 执行固定逻辑 | 为达成目标灵活调整策略 |
| 环境感知 | 只处理输入参数 | 感知上下文并据此调整 |
| 持续学习 | 逻辑固定不变 | 从经验中改进 |

## Agent 的核心组件

一个完整的 Agent 系统通常包含以下核心组件：

```plantuml
@startuml agent-system
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial
skinparam defaultFontSize 13

skinparam package {
    BackgroundColor #FAFAFA
    BorderColor #666666
}

skinparam rectangle {
    RoundCorner 8
}

package "Agent System" {
    rectangle "**Perception Layer**\n感知层" as perception #C8E6C9
    rectangle "**Reasoning Engine**\n推理引擎" as reasoning #FFF9C4
    rectangle "**Action Executor**\n行动执行器" as action #FFCCBC
    rectangle "**Memory System**\n记忆系统" as memory #E1BEE7
    
    perception -right-> reasoning
    reasoning -right-> action
    action -down-> memory
    memory -up-> reasoning
    memory -left-> perception
    
    package "Tool Box" #E3F2FD {
        rectangle "Search" as search #BBDEFB
        rectangle "Code\nEditor" as code #BBDEFB
        rectangle "File\nSystem" as file #BBDEFB
        rectangle "API\nClient" as api #BBDEFB
        rectangle "..." as more #BBDEFB
    }
    
    action -down-> search
    action -down-> code
    action -down-> file
    action -down-> api
}

@enduml
```

**Perception Layer（感知层）** —— Agent 的"眼睛和耳朵"，从环境中获取信息：用户意图、系统状态、外部事件。

**Reasoning Engine（推理引擎）** —— Agent 的"大脑"，根据感知到的信息做出决策。这是 AOE 与传统编程最大的区别 —— 决策逻辑不再是硬编码的 if-else，而是基于目标和上下文的动态推理。

**Action Executor（行动执行器）** —— Agent 的"手"，将决策转化为实际操作：调用工具、修改文件、发送请求。

**Memory System（记忆系统）** —— Agent 的"经验库"，让 Agent 能够从过去的经验中学习，而非每次从零开始。

## 实践：用 AOE 思维重构技术债清理

说了这么多理论，让我们来看一个实际的例子。在日常工作中，技术债清理是一个令人头疼的问题。

### 传统方式：人类主导一切

```plantuml
@startuml traditional-cleanup
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 10
    BackgroundColor #FFCDD2
    BorderColor #C62828
}

skinparam note {
    BackgroundColor #FFEBEE
    BorderColor #EF9A9A
}

rectangle "识别\n(人工)" as identify
rectangle "计划\n(人工)" as plan
rectangle "执行\n(人工)" as execute
rectangle "验证\n(人工)" as verify

identify -right-> plan
plan -right-> execute
execute -right-> verify

note bottom of identify
  ⚠️ 耗时
end note

note bottom of plan
  ⚠️ 易遗漏
end note

note bottom of execute
  ⚠️ 易出错
end note

note bottom of verify
  ⚠️ 不完整
end note

@enduml
```

### AOE 方式：人机协作

```plantuml
@startuml aoe-cleanup
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial
skinparam defaultFontSize 12

skinparam package {
    BorderColor #666666
}

skinparam rectangle {
    RoundCorner 8
}

package "人类工程师 (Engineering)" #E3F2FD {
    rectangle "**定义目标**\n\n• 清理 AB 实验代码\n• 移除过期 Feature Flag" as goal #BBDEFB
    rectangle "**设定约束**\n\n• 不破坏现有功能\n• 可回滚\n• 保持代码风格一致" as constraint #BBDEFB  
    rectangle "**验收标准**\n\n• 测试通过\n• 覆盖率不下降\n• Code Review" as criteria #BBDEFB
}

package "AI Agent (Programming)" #FFF3E0 {
    rectangle "代码分析" as analyze #FFE0B2
    rectangle "影响评估" as assess #FFE0B2
    rectangle "自动重构" as refactor #FFE0B2
    rectangle "测试验证" as test #FFE0B2
    
    analyze -right-> assess
    assess -right-> refactor
    refactor -right-> test
    test .up.> analyze : 反馈循环
}

goal -[#1565C0,thickness=2]down-> analyze
constraint -[#1565C0,thickness=2]down-> assess
criteria -[#1565C0,thickness=2]down-> test

@enduml
```

在这个模式下，人类工程师专注于 **Engineering**：

- **定义目标**：清理哪类技术债？AB 实验？国际化？过时的 API？
- **设定约束**：不能破坏现有功能、必须保持测试覆盖率、变更需要可回滚
- **设计验收标准**：如何判断清理成功？

而 Agent 负责 **Programming**：

- **代码分析**：扫描代码库，识别目标代码
- **影响评估**：分析依赖关系，评估修改影响
- **自动重构**：生成并执行重构方案
- **测试验证**：运行测试，确保功能正确

## Feedback Loop：Agent 进化的核心

在 Agent-Oriented Engineering 中，Feedback Loop 是最关键的概念之一。与传统的静态程序不同，Agent 需要不断地从执行结果中学习并改进。

```plantuml
@startuml feedback-loop
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 10
}

skinparam card {
    RoundCorner 10
}

rectangle "**Agent 进化**" as agent #E8EAF6

card "**Short-term Memory**\n当前会话" as short #C8E6C9
card "**Mid-term Patterns**\n跨会话模式" as mid #FFF9C4
card "**Long-term Knowledge**\n持久化知识" as long #FFCCBC

short -down-> agent
mid -down-> agent
long -down-> agent

note right of short
  短期学习
  ----
  从单次执行结果
  调整策略
end note

note right of mid
  中期学习
  ----
  从相似任务中
  提取模式
end note

note right of long
  长期学习
  ----
  优化基础能力
  和知识库
end note

@enduml
```

这个循环不是简单的 while 循环，而是一个持续进化的过程。每一次执行都在为下一次执行积累经验。

## Agent 之间的协作

真实世界的问题往往需要多个 Agent 协作完成。这就涉及到 Agent 之间的通信和协调问题。

```plantuml
@startuml multi-agent
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 10
}

skinparam agent {
    BackgroundColor #E8EAF6
    BorderColor #3F51B5
}

rectangle "**Coordinator**\n协调者" as coord #FFE0B2

agent "**Code Agent**\n代码生成" as code
agent "**Test Agent**\n测试编写" as test
agent "**Doc Agent**\n文档生成" as doc

rectangle "**Result**\n整合结果" as result #C8E6C9

coord -down-> code
coord -down-> test
coord -down-> doc

code <-right-> test : 协作
test <-right-> doc : 协作

code -down-> result
test -down-> result
doc -down-> result

note top of coord
  人类工程师扮演
  "导演" 角色
  ----
  设计协作模式
  定义通信协议
  处理冲突异常
end note

@enduml
```

在多 Agent 系统中，人类工程师的角色更像是一个"导演"—— 设计 Agent 之间的协作模式，定义通信协议，处理冲突和异常。

## 写在最后

Agent-Oriented Engineering 不仅仅是一种新的技术范式，更是对工程师角色的重新定义。

在这个转变中，我们失去的是"写代码的成就感"—— 那种亲手敲出一行行代码、看着测试变绿的满足感。但我们获得的是更高层次的创造力 —— 设计系统、定义约束、把控质量。

从 Programming 到 Engineering 的转变也是如此。当 AI 接管了 Programming 的工作，人类工程师终于可以专注于我们真正擅长的事情：**理解问题本质、做出权衡决策、承担工程责任**。

记得在《心之所向，道之所在》一文中，我提到过"垫脚石"的概念 —— 那些看似与最终目标无关的发现，可能是通往成功的关键一步。今天我们探索的 Agent-Oriented Engineering，或许就是软件工程下一个十年的垫脚石。

正如 Steve Jobs 所言：

> You can't connect the dots looking forward; you can only connect them looking backwards.

我们今天对 Agent 的理解和实践，终将成为未来软件工程的基石。
