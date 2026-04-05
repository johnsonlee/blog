---
title: The Last Paradigm Shift in Software Engineering
date: 2026-02-10 09:00:00
categories:
  - Computer Science
  - Engineering
tags:
  - AI
  - Agent
  - Claude
lang: en
i18n_key: agent-oriented-engineering
---

Over the past year, AI-assisted programming tools have emerged en masse -- from GitHub Copilot to Cursor to Claude Code, each claiming to double programmer productivity. As a veteran who's been writing code for over 20 years, I can't help but ask: when AI can understand our intent and autonomously complete tasks, shouldn't our role change accordingly?

The answer is yes.

As Programming is gradually taken over by AI, the value of human engineers will increasingly reside at the **Engineering** level -- system design, architecture decisions, constraint definition, quality control. I call this new engineering paradigm **Agent-Oriented Engineering (AOE)**.

## Programming vs Engineering

Before going further, I want to clarify the distinction between **Programming** and **Engineering**.

**Programming** is about "how" -- writing code, debugging, optimizing algorithms. This is the domain AI is rapidly mastering. Claude Code can already understand requirements, generate code, fix bugs, and even refactor.

**Engineering** is about "what" and "why" -- system architecture, technology selection, constraints, quality standards, risk assessment. This is the domain that requires human judgment and experience.

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

rectangle "**Engineering** (Human-led)" as eng <<human>> {
    rectangle "Architecture Design" as arch <<task>>
    rectangle "Constraint Definition" as cons <<task>>
    rectangle "Quality Standards" as qual <<task>>
    rectangle "Risk Assessment" as risk <<task>>
}

rectangle "**Programming** (AI-led)" as prog <<ai>> {
    rectangle "Code Generation" as code <<task>>
    rectangle "Debugging & Fixing" as debug <<task>>
    rectangle "Refactoring" as refactor <<task>>
    rectangle "Test Writing" as test <<task>>
}

eng -[#666666,thickness=2]-> prog : "  Goals + Constraints  "

@enduml
```

This doesn't mean humans no longer need to understand code -- quite the opposite. We need a deeper understanding of code and systems to effectively guide AI Agents. But our primary focus shifts from "writing code" to "designing systems" and "defining constraints."

## Why Now?

Over the past several decades, human-computer interaction has undergone a fascinating evolution:

```plantuml
@startuml interface-evolution
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial

skinparam rectangle {
    RoundCorner 15
    BorderColor #333333
}

rectangle "**Command Line**\nCLI" as cli #B3E5FC
rectangle "**Graphical Interface**\nGUI" as gui #C8E6C9
rectangle "**Specialized Software**\nDomain Tools" as soft #FFE0B2
rectangle "**Natural Language**\nConversation" as nl #F8BBD9

cli -right-> gui : ""
gui -right-> soft : ""
soft -right-> nl : ""

note bottom of cli
  High learning curve
  Must memorize commands
end note

note bottom of gui
  Intuitive but limited
  Features preset by developers
end note

note bottom of soft
  Powerful
  But requires specialized training
  (PS, Excel, IDE...)
end note

note bottom of nl
  **Zero barrier**
  Just speak naturally
end note

@enduml
```

In the past, getting a computer to do something required learning its "language" -- whether command-line, GUI, or the proprietary logic of specialized software. Want a poster? Learn Photoshop. Want data analysis? Learn Excel. Want to build an app? Learn a programming language.

Every piece of specialized software is a hurdle. Every programming language is a wall.

But now, all of this is changing.

When AI can understand natural language, humans can finally express needs in **the most natural way** -- talking. No specialized software to learn, no programming language to master. Just describe clearly what you want.

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

package "Traditional Approach" #FFEBEE {
    rectangle "Human Need" as req1 #FFCDD2
    rectangle "Learn Specialized Software\n(Photoshop/Excel/IDE...)" as learn #FFCDD2
    rectangle "Manual Operation" as manual #FFCDD2
    rectangle "Result" as result1 #FFCDD2

    req1 -right-> learn
    learn -right-> manual
    manual -right-> result1
}

package "AOE Approach" #E8F5E9 {
    rectangle "Human Need\n(Natural Language)" as req2 #C8E6C9
    rectangle "AI Understanding\n+ Agent Execution" as agent #C8E6C9
    rectangle "Result" as result2 #C8E6C9

    req2 -right-> agent
    agent -right-> result2
}

@enduml
```

This is the fundamental reason Agent-Oriented Engineering is emerging: **natural language has become the new programming interface**.

When you can simply say "clean up the AB test code, keep the treatment branch," and the Agent can understand the meaning, analyze the codebase, execute the refactoring, and verify the results -- Programming itself gets redefined.

## From OOP to AOE: The Evolution

Looking back at software engineering's history, we've gone through several major paradigm shifts:

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

rectangle "**POP**\nProcedural" as pop #B3E5FC
rectangle "**OOP**\nObject-Oriented" as oop #C8E6C9
rectangle "**AOP**\nAspect-Oriented" as aop #FFE0B2
rectangle "**AOE**\nAgent-Oriented" as aoe #F8BBD9

pop -right-> oop : ""
oop -right-> aop : ""
aop -right-> aoe : ""

note bottom of pop
  1970s
  ----
  Instruction sequences
  Humans write every instruction
end note

note bottom of oop
  1990s
  ----
  Object collaboration
  Humans design object interactions
end note

note bottom of aop
  2000s
  ----
  Separation of concerns
  Humans define cross-cutting concerns
end note

note bottom of aoe
  2020s
  ----
  Human-AI collaboration
  **Humans define goals in natural language**
end note

@enduml
```

Each paradigm shift came with an upgrade in human-computer interaction:

| Paradigm | Human Responsibility | Interaction Mode |
|----------|---------------------|-----------------|
| POP | Write every instruction | Code |
| OOP | Design objects and interactions | Code |
| AOP | Define cross-cutting concerns | Code + Config |
| **AOE** | **Define goals and constraints** | **Natural Language** |

> So what do human engineers actually do?

Simply put: **define problems, not solve them**.

Our work shifts from "writing code to solve problems" to "clearly describing problems for Agents to solve." This sounds simple, but it actually raises the bar for engineers -- you need deeper understanding of the problem's essence, more precise articulation of constraints, more comprehensive consideration of edge cases.

Code can be ambiguous -- the compiler will flag errors. But ambiguity in natural language sends the Agent in a completely wrong direction. **The ability to express clearly becomes the new-era engineer's core competitive advantage.**

## What Is an Agent?

Before discussing Agent-Oriented Engineering, we need to clarify what an Agent is. Simply put, an Agent is an autonomous entity that can **perceive its environment, make decisions, and take action**.

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

card "Environment" as env #E0E0E0

rectangle "**Agent**" as agent #E8EAF6 {
    rectangle "**Goal**\nIntent" as goal #BBDEFB
    rectangle "**Perceive**\nSensing" as perceive #C8E6C9
    rectangle "**Reason**\nDecision-making" as reason #FFF9C4
    rectangle "**Act**\nTake Action" as act #FFCCBC
    rectangle "**Learn**\nImprove" as learn #E1BEE7

    goal -down-> reason
    perceive -right-> reason
    reason -down-> act
    act -down-> learn
    learn -left-> reason : Optimize strategy
}

env -right-> perceive : Input
act -right-> env : Output
env ..> learn : Feedback

@enduml
```

Unlike traditional functions or services, Agents have these characteristics:

| Characteristic | Traditional Functions/Services | Agent |
|---------------|-------------------------------|-------|
| Autonomy | Passively called, strictly follows instructions | Active decision-making, autonomous path planning |
| Goal-oriented | Executes fixed logic | Flexibly adjusts strategy to achieve goals |
| Environmental awareness | Only processes input parameters | Perceives context and adapts accordingly |
| Continuous learning | Logic is fixed | Improves from experience |

## Core Components of an Agent

A complete Agent system typically contains these core components:

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
    rectangle "**Perception Layer**" as perception #C8E6C9
    rectangle "**Reasoning Engine**" as reasoning #FFF9C4
    rectangle "**Action Executor**" as action #FFCCBC
    rectangle "**Memory System**" as memory #E1BEE7

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

**Perception Layer** -- the Agent's "eyes and ears," gathering information from the environment: user intent, system state, external events.

**Reasoning Engine** -- the Agent's "brain," making decisions based on perceived information. This is the biggest difference between AOE and traditional programming -- decision logic is no longer hardcoded if-else but dynamic reasoning based on goals and context.

**Action Executor** -- the Agent's "hands," translating decisions into actual operations: invoking tools, modifying files, sending requests.

**Memory System** -- the Agent's "experience library," enabling the Agent to learn from past experience rather than starting from scratch every time.

## Practice: Refactoring Tech Debt Cleanup with AOE Thinking

Enough theory -- let's look at a real example. In daily work, tech debt cleanup is a perennial headache.

### Traditional Approach: Humans Drive Everything

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

rectangle "Identify\n(Manual)" as identify
rectangle "Plan\n(Manual)" as plan
rectangle "Execute\n(Manual)" as execute
rectangle "Verify\n(Manual)" as verify

identify -right-> plan
plan -right-> execute
execute -right-> verify

note bottom of identify
  Time-consuming
end note

note bottom of plan
  Prone to omissions
end note

note bottom of execute
  Error-prone
end note

note bottom of verify
  Incomplete
end note

@enduml
```

### AOE Approach: Human-AI Collaboration

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

package "Human Engineer (Engineering)" #E3F2FD {
    rectangle "**Define Goals**\n\n- Clean up AB test code\n- Remove expired feature flags" as goal #BBDEFB
    rectangle "**Set Constraints**\n\n- Don't break existing functionality\n- Must be rollback-capable\n- Maintain code style consistency" as constraint #BBDEFB
    rectangle "**Acceptance Criteria**\n\n- Tests pass\n- Coverage doesn't drop\n- Code Review" as criteria #BBDEFB
}

package "AI Agent (Programming)" #FFF3E0 {
    rectangle "Code Analysis" as analyze #FFE0B2
    rectangle "Impact Assessment" as assess #FFE0B2
    rectangle "Auto Refactoring" as refactor #FFE0B2
    rectangle "Test Verification" as test #FFE0B2

    analyze -right-> assess
    assess -right-> refactor
    refactor -right-> test
    test .up.> analyze : Feedback loop
}

goal -[#1565C0,thickness=2]down-> analyze
constraint -[#1565C0,thickness=2]down-> assess
criteria -[#1565C0,thickness=2]down-> test

@enduml
```

In this model, the human engineer focuses on **Engineering**:

- **Define goals**: Which category of tech debt? AB experiments? Internationalization? Deprecated APIs?
- **Set constraints**: Must not break existing functionality, must maintain test coverage, changes must be rollback-capable
- **Design acceptance criteria**: How do you determine cleanup succeeded?

While the Agent handles **Programming**:

- **Code analysis**: Scan the codebase, identify target code
- **Impact assessment**: Analyze dependencies, evaluate modification impact
- **Auto refactoring**: Generate and execute the refactoring plan
- **Test verification**: Run tests, ensure functional correctness

## Feedback Loop: The Core of Agent Evolution

In Agent-Oriented Engineering, the Feedback Loop is one of the most critical concepts. Unlike traditional static programs, Agents need to continuously learn from execution results and improve.

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

rectangle "**Agent Evolution**" as agent #E8EAF6

card "**Short-term Memory**\nCurrent session" as short #C8E6C9
card "**Mid-term Patterns**\nCross-session patterns" as mid #FFF9C4
card "**Long-term Knowledge**\nPersisted knowledge" as long #FFCCBC

short -down-> agent
mid -down-> agent
long -down-> agent

note right of short
  Short-term learning
  ----
  Adjust strategy from
  single execution results
end note

note right of mid
  Mid-term learning
  ----
  Extract patterns from
  similar tasks
end note

note right of long
  Long-term learning
  ----
  Optimize foundational
  capabilities and knowledge base
end note

@enduml
```

This loop isn't a simple while loop -- it's a continuous evolutionary process. Each execution accumulates experience for the next.

## Collaboration Between Agents

Real-world problems often require multiple Agents working together. This involves communication and coordination between Agents.

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

rectangle "**Coordinator**" as coord #FFE0B2

agent "**Code Agent**\nCode Generation" as code
agent "**Test Agent**\nTest Writing" as test
agent "**Doc Agent**\nDocumentation" as doc

rectangle "**Result**\nIntegrated Output" as result #C8E6C9

coord -down-> code
coord -down-> test
coord -down-> doc

code <-right-> test : Collaborate
test <-right-> doc : Collaborate

code -down-> result
test -down-> result
doc -down-> result

note top of coord
  Human engineer plays
  the "director" role
  ----
  Design collaboration patterns
  Define communication protocols
  Handle conflicts and exceptions
end note

@enduml
```

In multi-Agent systems, the human engineer's role is more like a "director" -- designing collaboration patterns between Agents, defining communication protocols, handling conflicts and exceptions.

## Closing Thoughts

Agent-Oriented Engineering isn't just a new technical paradigm -- it's a redefinition of the engineer's role.

In this transition, what we lose is "the satisfaction of writing code" -- that feeling of typing out lines of code and watching tests turn green. But what we gain is a higher level of creativity -- designing systems, defining constraints, ensuring quality.

The shift from Programming to Engineering follows the same arc. When AI takes over Programming, human engineers can finally focus on what we're truly best at: **understanding the essence of problems, making tradeoff decisions, and bearing engineering responsibility**.

I recall mentioning the concept of "stepping stones" in an earlier post -- discoveries that seem unrelated to the final goal may be the key step toward success. The Agent-Oriented Engineering we're exploring today may well be the stepping stone for the next decade of software engineering.

As Steve Jobs said:

> You can't connect the dots looking forward; you can only connect them looking backwards.

Our understanding and practice of Agents today will ultimately become the foundation of tomorrow's software engineering.
