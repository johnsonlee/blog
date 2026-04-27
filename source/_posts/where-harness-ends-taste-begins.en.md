---
title: "Where Harness Ends, Taste Begins"
date: 2026-04-26 14:04:43
categories:
  - Independent Thinking
tags:
  - Agent
  - Harness Engineering
  - Architecture
  - Code Quality
  - Maintainability
lang: en
i18n_key: where-harness-ends-taste-begins
---

Lately, the code my Agent writes needs more and more fixing on review. Hardcoded values, magic numbers, exceptions thrown straight at the user instead of friendly errors, exceptions caught and swallowed, memory creeping up, loops inside loops — what used to show up occasionally now shows up in almost every PR.

**Agents write code fast. Fast without engineering excellence.**

<!-- more -->

## And It Doesn't Stop There

The opening list is just the surface. Dig into Agent-generated code and you'll also find:

- Cross-layer calls, facades bypassed, ViewModels reaching back into Views, Repositories calling ViewModels — unidirectional data flow turned into a spider web
- `var` and `MutableList` everywhere, `setter` casually added to data classes "for convenience" — the moment threads get involved, ghosts come out
- Test coverage looks great, but assertions are written as `assertTrue(result != null)`. Run mutation testing and the score is brutal

Each one of these is an old problem. A senior would catch them at a glance. The problem is that review can't keep up — Agent output volume is several times, sometimes orders of magnitude beyond what human review can handle.

## The Agent's Blind Spot Is Engineering Excellence

Blaming this on "the model isn't strong enough" is lazy. Give the same model clear constraints and good context, and it produces remarkably tidy code. Give it a vague task, and it takes the path of least resistance.

What's the path of least resistance?

- Hardcoding is closer than abstracting a constant
- `throw` is closer than designing an error contract
- Adding memory is closer than optimizing the algorithm
- A reverse call is closer than refactoring the data flow
- `var` is closer than designing a reducer
- A weak assertion is closer than thinking through edge cases

Why doesn't a senior engineer take these paths? Not because they remember the rule "don't hardcode." Because they've internalized an entire body of engineering excellence — sensitivity to long-term cost, an obsession with readability, instincts for edge cases, empathy for whoever maintains the code next. None of this is knowledge. It's a compound of taste, experience, and judgment.

The Agent has none of it. What it has is a feedback signal for "complete the current task," not an internal drive that says "this code will be maintained for ten years." Its field of view is the current task. It can't see the global cost. It doesn't know that magic number will scare every engineer who touches it three months later. It doesn't know that swallowed exception will cost two extra hours in a production incident. It doesn't know that one reverse call has just demolished the reasoning surface of the entire module. **It is only accountable for "passing the tests right now," because that's the only feedback signal it has access to.**

One layer deeper: Agents tend to make code **look like it's working**, not make the system actually healthy. A swallowed exception is the canonical case of fake health — compiles, passes tests, blows up in production.

This isn't something prompt engineering can fix. Engineering excellence is taste, not knowledge. No prompt is long enough to encode "sensitivity to long-term cost."

**In our own experiments, escalating prompt tone alone — adding "please," "important," "must," "critical" — moves the needle by roughly 1%.** Prompts carry task descriptions, not taste. Taste has to be externalized through harness before the Agent can act on it.

## What Used to Be Best Practice Is Now a Survival Line

Over the past two decades, software engineering has accumulated a body of wisdom about code quality: unidirectional data flow, immutability, performance budgets, error contracts, architectural boundaries. In the era of human-written code, these were **nice to have** — having them was good, not having them was survivable, because senior engineers, code review, and post-hoc refactoring filled the gap.

Once Agents become the primary producer of code, every one of these nice-to-haves turns into a **must have**.

The reason is simple: human governance runs on tacit knowledge, intuition, verbal rules, and judgment calls during review. None of that scales, and none of it is consumable by an Agent. The Agent doesn't stop hardcoding because you said "no hardcoding" in a team meeting. It only responds to **machine-executable constraints**.

Tighter review? Human review can't keep up with Agent throughput. Doesn't scale.
Longer prompts? Treats symptoms, not causes. Whatever the prompt didn't cover, the Agent will collapse on.
Refactor later? By the time you come back, the debt is already a mountain.

There's only one real solution: **take the rules that used to live in review comments and tribal knowledge, and push them forward into machine-executable harness**.

## The Two-Loop Harness: Fast Loop and Slow Loop

A harness isn't just a CI check. In the Agent era, a harness has to be a **two-layer feedback system**:

### Fast Loop: Local, seconds, for self-correction

From keystroke to feedback in seconds to minutes. IDE warnings, pre-commit hooks, locally runnable lint and benchmarks — this layer serves more than just the developer, it serves the Agent.

Whether an Agent can produce maintainable code depends heavily on whether it can see the feedback at the moment of generation and self-correct. If a rule only fires in CI, the Agent finishes a round, waits ten minutes for a red light, and the feedback chain is already severed — the Agent has nothing actionable to iterate on.

### Slow Loop: CI, the unified quality gate

From PR submission to merge, minutes to hours. Full static analysis, complete benchmark suites, mutation testing, architectural contract enforcement — guarantees that no rule gets quietly disabled or bypassed.

**Fast Loop solves "find out early." Slow Loop solves "no escape."** Both are necessary. CI without local means the feedback chain is too long and the Agent loses self-correction. Local without CI means rules get silently turned off and the harness becomes decorative.

When designing a harness, **prioritize making rules locally executable**. CI is the safety net, not the main battleground.

## Translating Symptoms Into Harness

Back to the symptoms at the top. Each maps to a concrete set of harness mechanisms.

### Hardcoding and magic numbers

Fast Loop: detekt / ktlint with IDE plugin — literal in business logic, red line immediately (whitelist: 0, 1, -1, empty string). Pre-commit hook as a backup.
Slow Loop: full static scan in CI as a merge gate.
Architectural contract: all configuration goes through a `Config` object, all constants live in `Constants` or domain enums.

### The two extremes of error handling

Fast Loop: custom detekt rules — no empty catch, no "log only without rethrow," no naked throw across module boundaries.
Slow Loop: CI verifies exception chain integrity on critical paths. Every user-visible path must return a structured error, not a stack trace.
Architectural contract: a unified error model (Result/Either or a domain exception hierarchy). Errors carry trace IDs.

An exception that can be silently swallowed is, fundamentally, an exception with no owner — the root cause is the absence of an architectural contract for error handling.

### Performance regression

This is the category where harness most clearly demonstrates that **the precision of the constraint determines the ceiling of the output**.

Fast Loop: local JMH benchmarks for every core method on critical paths. Developer makes a change, runs one command, sees the regression. Cyclomatic complexity and nested loops caught by static rules in seconds.
Slow Loop: CI runs the full benchmark suite, compares against historical baseline, blocks the PR if the regression crosses threshold. Memory footprint logged on every build, alerts on upward trend.
Architectural contract: critical paths declare a performance budget — peak memory, P99 latency, allocation rate — as numbers, not as "try to optimize."

Take [Graphite](https://github.com/johnsonlee/graphite) as an example. It's a SootUp-based JVM bytecode static analysis tool, and every core path (call graph construction, bytecode parsing) has a corresponding JMH benchmark. Add any new feature, run one local command, and you immediately know whether the change has regressed peak memory or throughput. CI runs the full suite again as the unified gate, comparing against baseline, rejecting any merge that breaches the threshold.

This turns "performance must not regress" from a verbal agreement into a machine-verifiable hard constraint. Even if an Agent is allowed to touch core paths, it cannot silently degrade performance — because it sees the benchmark numbers in the Fast Loop itself.

### Architectural contracts: unidirectional data flow + mutability

These two deserve their own section, because they're where Agents fail most often.

Unidirectional data flow is a **global constraint**, but the Agent only sees the local task. The shortest path to "let this button modify that state" is a reverse call — the Agent doesn't know that shortcut just demolished the reasoning surface of the entire system.

Mutability is the same story. Mutating a field is closer than constructing a new object. Adding a setter is closer than designing a reducer. The Agent always takes the closest path. But mutable state is one of the largest single sources of complexity in any system.

Fast Loop:

- Dependency direction encoded as ArchUnit unit tests, locally runnable
- Call-graph tools (like Graphite) analyze data flow locally and visualize reverse edges
- detekt rules enforce `val` over `var`, forbid public APIs from exposing `MutableList` / `MutableMap` / `MutableSet`
- Data classes are immutable by default; mutability requires explicit opt-in with a comment explaining why

Slow Loop: CI enforces dependency direction as architectural tests; any reverse call blocks the PR. Concurrency-critical paths scanned with concurrency-safety rules.

Unidirectional data flow and immutability aren't stylistic preferences. They're **the foundation of system reasonability**. A system that allows reverse calls and free-form mutation is a system whose causality is opaque even to human reviewers — let alone safe for an Agent to modify.

Inversely, a system with one-way data flow and immutable state is exceptionally Agent-friendly — its behavior is locally reasonable. The Agent modifies a function without worrying about side effects propagating across the system.

**A good harness doesn't just constrain the Agent. It liberates the Agent.**

### Test rot

Fast Loop: assertion-strength rules surface in IDE in real time — no `assertTrue(true)`, no empty test methods, minimum assertion count per test.
Slow Loop: CI runs mutation testing (PIT / Pitest). Mutation score becomes a gate. New code must include a failing case proving the test is meaningful.

Tests passing ≠ tests being effective. This is the most overlooked symptom, and the one Agents exploit most.

## Where Harness Ends, Taste Begins

Translating verbal rules into machine-executable harness is a required course in the Agent era. But beware the opposite extreme — treating harness engineering as a universal solvent.

Step back: harness is, at its core, **the externalization of human engineering excellence into contracts the Agent must obey**. A senior doesn't hardcode because they've internalized sensitivity to long-term cost; harness externalizes that sensitivity into "literal in business logic blocks the PR." A senior doesn't swallow exceptions because they've internalized an obsession with system health; harness externalizes that obsession into "empty catch is a hard fail."

But part of engineering excellence cannot be externalized.

Architecture is, fundamentally, a matter of taste. "Should these two modules be merged?" "Is this abstraction premature?" "Where exactly does this boundary belong?" "This trade-off makes sense today, but will it still make sense in three years?" These questions have no static rule that can answer them. They depend on the architect's judgment about the business, the team, and the trajectory of evolution.

What harness can do is translate **the artifacts of taste** into machine-executable contracts. The architect decides "these two modules communicate only through an EventBus" — that's taste. ArchUnit / call-graph tools verifying that the contract isn't broken — that's harness. **Taste defines the direction. Harness guards the direction.**

No horse, no speed. No harness, the horse runs wild. No rider, even a perfectly steady ride is in the wrong direction. The most precise tack in the world won't help if the rider has no judgment. The most discerning rider in the world can't control the horse without tack.

What's truly scarce in the Agent era isn't engineers who can write rules. It's architects who **know which parts of engineering excellence can be externalized into harness, and which must remain the rider's call**. That translation capacity is itself the irreplaceable core competency.

## The Architect's Role Has Changed

In the human-governance era, an architect's primary output was "design" — diagrams, documents, specifications, review comments. These outputs were for humans to read and humans, through their own engineering excellence, to enforce.

In the Agent era, an architect's primary output must be **executable harness** — static rules, performance budgets, architectural tests, call-graph contracts, mutability rules. Because the Agent has no engineering excellence to fall back on. The architect must externalize their own internalized engineering taste into machine-executable contracts before the Agent has anything to follow.

This isn't a downgrade. It's an upgrade. An architectural specification on a wiki affects only the people who read it. A static rule embedded in CI and IDE affects every line of code that gets generated. **The leverage of harness vastly exceeds the leverage of documentation.**

The items that used to live on the team's "best practices" list — unidirectional data flow, immutability, performance budgets, error contracts — used to be a matter of architectural taste. Now they're the survival line of the system. The stronger the Agent, the more critical that line becomes.

The architect's center of gravity shifts from "making good architectural decisions" to "**externalizing internalized engineering excellence into harness the Agent must obey**." The former is taste. The latter is engineering. Neither is dispensable: without taste, the harness itself is wrong; without engineering, even the best taste can't keep up with Agent output.

What truly determines whether a team can ride the Agent isn't how smart the Agent is. It's **how much engineering excellence the team has externalized into harness**.

The real moat is the product of taste and harness.
