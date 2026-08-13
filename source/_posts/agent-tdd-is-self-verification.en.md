---
title: "Does an Agent Really Need TDD?"
date: 2026-08-13 09:23:00
lang: en
i18n_key: agent-tdd-is-self-verification
categories:
  - Independent Thinking
tags:
  - AI
  - Agentic Coding
  - TDD
  - Harness Engineering
  - Testing
---

A few days ago I came across an experiment on Martin Fowler's site. The author gave the same tasks to Sonnet 4.6, told one group to follow TDD and let the other work however it wanted, then had Opus 4.8 judge the results blind. The result was awkward: TDD did not produce better code, but used at least three times as many tokens. My first thought was not that TDD had become obsolete. It was that we might be asking Agents to do something that looks like engineering but makes little sense: set their own exam, answer it, and declare that they passed.

<!-- more -->

## What Problem Was TDD Originally Solving?

TDD targets a familiar way of building software: write a large chunk of implementation, then verify it much later. By the time a test fails, dozens of things have changed and nobody knows where the mistake came from. Bigger changes create slower feedback. Slower feedback makes people afraid to change the code. The more afraid they become, the less willing they are to refactor it.

Red-Green-Refactor cuts that long feedback chain into small pieces. Define one small behavior, watch it fail, write only enough code to make it pass, then clean up the design. Only one variable changes at a time, so failures are easy to locate. The code stays in a working state, which gives the developer enough confidence to continue.

Kent Beck described TDD as a way to manage fear. That fear is concrete: fear of breaking the code, losing control, or holding a problem too large to fit in your head. Test-first also forces developers to see an interface from the caller's side before disappearing into implementation and producing an API only its author can use.

**The original value of TDD was helping humans control complexity through short feedback loops. Tests are the executable assets those loops leave behind.**

Agents do not feel fear, and they do not hesitate because a problem looks too large. Given a complete requirement, an Agent is usually planning the tests and implementation together. Making it write the test file first changes the order in which text lands on disk. It does not mean the Agent went through the same thinking a human does.

Copying the workflow into an Agent Loop is like asking an excavator to stretch its wrists before work. The motion is fine. The machine does not have those muscles.

## TDD Optimizes Locally; Architecture Design Sets the Direction

Each TDD cycle asks two questions: what is the next failing example, and what is the smallest change that makes it pass? This is local search. It works well when the problem boundary is already clear. On a complex task where the boundary has not been drawn, it can easily confuse a correct next step with a correct direction.

Imagine asking an Agent to rebuild a payment module. The first test covers a single-currency payment, the second adds a coupon, and the third adds a refund. Every step can go Red-Green, and the code keeps running. Then multi-currency, partial refunds, idempotency, and reconciliation arrive together, and it becomes obvious that the original data model was wrong. The green tests did not help. They welded the wrong structure in place.

The first step of a complex task should not be the first test. It should be Architecture Design: where module boundaries sit, who owns state, how data flows, where transactions end, how failures recover, and which constraints may never be broken. These are global questions. They do not naturally emerge from a sequence of local examples.

Architecture Design does not mean writing a fifty-page document before touching code. It means deciding the shape of the system first so that local search happens inside the right boundaries. **Architecture decides where to go. TDD helps each step avoid a pothole.**

[Birgitta Böckeler's experiment](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html) supports this explanation. Across five batches, non-TDD solutions repeatedly took the top two spots on small and medium tasks while TDD solutions landed in the bottom two. TDD finished in the middle on the large task. Mutation scores showed no meaningful gap.

After reading the traces, Opus found that Agents without TDD instructions tended to think through the data model, edge cases, contracts, and overall design before writing anything. Under TDD, they kept making locally minimal changes around the first test. The early design hardened quickly, and the Agents rarely returned for a serious Refactor.

The experiment was small. Every task was greenfield, and another LLM judged quality, so it cannot prove that TDD always makes Agents worse. But it exposes the real issue: **we do not need a more obedient coding loop. We need global design first, then an Agent running inside its boundaries.**

## A Red Test Can Still Be Wrong

The usual argument for making an Agent show Red first is simple: if the test failed before the implementation, at least we know it is not decorative.

Red only proves that the test and code disagreed. It says nothing about why. Maybe the implementation is missing. Maybe the import is broken, the fixture is wrong, or the test asserts a requirement that never existed. If the same Agent writes both test and implementation, they can share the same misunderstanding.

The article includes a particularly clear example: a test called the implementation logic again to calculate the expected value, then compared the two results. Of course it went green. Watching that test fail before writing the implementation would not have moved it any closer to the real requirement.

That is why I care more about mutation testing. Deliberately break the implementation and see whether the tests notice. At least that proves the net is real. But even a high mutation score only proves that tests detect changes in code. It does not prove that the expected answer is correct.

**What matters most is not when the test was written, but where its answer came from.**

## Keep the Tests Outside the Agent Loop

I am not arguing that we should throw away TDD. I am arguing that we should take it apart.

If a human writes the test, it carries human judgment, and having the Agent implement against it is valuable. If the Agent writes a test and a human confirms that it describes the right behavior before implementation continues, that is useful too. The suspicious case is the third one: the Agent writes the test, watches it fail, adds the implementation, and watches it pass, all inside its own Loop with no outside judgment.

All three look like TDD. The real difference is **whether the test and implementation came from the same source of answers**.

Examples supplied by stakeholders, regression cases from production incidents, golden outputs from a legacy system, protocol schemas, and performance budgets all sit closer to ground truth. They may not look like unit tests, but each tells the Agent what it must not ship.

This is [What Caps How](https://johnsonlee.io/2026/03/10/what-caps-how.en/) applied to testing. A test should be an executable What. If the Agent defines the What and then uses its own How to satisfy it, the whole exercise becomes self-verification.

## Once the Boundaries Are Drawn, I Do Not Care How the Agent Writes It

Architecture Design sets the direction. Regression tests, architecture tests, static analysis, mutation testing, and benchmarks guard the boundaries. Once those boundaries are drawn, I do not care whether the Agent writes the test or implementation first.

If tests cannot kill mutations, improve the tests. If module boundaries drift, add an architecture rule. If a real sample exposes a missed edge case, put it into the regression corpus.

Refactoring does not have to follow every Green step either. Complexity, dependency direction, change spread, and performance regression can trigger a review directly. Fixing an observable bad result is more reliable than reminding the Agent in a prompt that "now it is time to Refactor carefully."

This is the same argument I made in ["From Prompt to Harness"](https://johnsonlee.io/2026/05/15/from-prompt-to-harness.en/): telling an Agent how to work can only change the probability that it gets the answer right. A Harness is what stops the wrong answer from getting through.

TDD is not obsolete. It is still a good thinking tool when humans write code, and a good collaboration model when humans write tests and Agents write the implementation. But for a complex task, the order should be Architecture Design, external verification, then Agent implementation—not an immediate dive into Red-Green-Refactor.

What should disappear is the unwatched Red-Green-Refactor performance inside the Agent Loop.

The next time an Agent says, "Strictly followed TDD," do not relax just yet. Ask one question: **who designed the architecture, and who supplied the answers in those tests?**
