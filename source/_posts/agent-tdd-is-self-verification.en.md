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

## TDD Was Solving a Human Problem

Two things often get bundled together under TDD: tests, and a way of writing code.

Tests are useful. They record behavior, protect against regressions, and make refactoring safer. But Red-Green-Refactor is first of all a way to help humans think. Writing the test first makes us look at the interface from the caller's side. Moving one small step at a time keeps the problem from overflowing our heads. Each green light gives us enough confidence to take the next step.

Kent Beck described TDD as a way to manage fear. Agents do not feel fear, and they do not hesitate because a problem looks too large. Given a complete requirement, an Agent is usually planning the tests and implementation together. Making it write the test file first changes the order in which text lands on disk. It does not mean the Agent went through the same thinking a human does.

It is like asking an excavator to stretch its wrists before work. The motion is fine. The machine does not have those muscles.

**The value TDD gives humans cannot be copied into an Agent with a prompt.**

## A Red Test Can Still Be Wrong

The usual argument for making an Agent show Red first is simple: if the test failed before the implementation, at least we know it is not decorative.

Red only proves that the test and code disagreed. It says nothing about why. Maybe the implementation is missing. Maybe the import is broken, the fixture is wrong, or the test asserts a requirement that never existed. If the same Agent writes both test and implementation, they can share the same misunderstanding.

The article includes a particularly clear example: a test called the implementation logic again to calculate the expected value, then compared the two results. Of course it went green. Watching that test fail before writing the implementation would not have moved it any closer to the real requirement.

That is why I care more about mutation testing. Deliberately break the implementation and see whether the tests notice. At least that proves the net is real. But even a high mutation score only proves that tests detect changes in code. It does not prove that the expected answer is correct.

**What matters most is not when the test was written, but where its answer came from.**

## TDD May Be Getting in the Agent's Way

[Birgitta Böckeler's experiment](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html) ran five batches. In the small and medium tasks, non-TDD solutions repeatedly took the top two spots while TDD solutions landed in the bottom two. On the large task, TDD finished in the middle. Mutation scores showed no meaningful gap.

After reading the execution traces, Opus suggested an explanation. Without TDD instructions, the Agent tended to think through the data model, edge cases, contracts, and overall design before writing anything. Under TDD, it kept making locally minimal changes around the first test. The early design hardened quickly, and the Agent rarely returned for the kind of serious Refactor a human would do.

That is the opposite of our familiar experience. Humans use small steps to discover a design. Agents may be better at seeing the whole problem and generating a reasonably complete solution in one pass. Forcing baby steps on them may simply impose a human cognitive limit on a machine.

The experiment was small. Every task was greenfield, and another LLM judged quality. It cannot prove that TDD always makes Agents worse. Cache hits also mean three times the tokens does not mean three times the bill.

But it is enough to ask: if quality did not improve and token use went up, why are we treating this workflow as the default?

## Keep the Tests Outside the Agent Loop

I am not arguing that we should throw away TDD. I am arguing that we should take it apart.

If a human writes the test, it carries human judgment, and having the Agent implement against it is valuable. If the Agent writes a test and a human confirms that it describes the right behavior before implementation continues, that is useful too. The suspicious case is the third one: the Agent writes the test, watches it fail, adds the implementation, and watches it pass, all inside its own Loop with no outside judgment.

All three look like TDD. The real difference is **whether the test and implementation came from the same source of answers**.

Examples supplied by stakeholders, regression cases from production incidents, golden outputs from a legacy system, protocol schemas, and performance budgets all sit closer to ground truth. They may not look like unit tests, but each tells the Agent what it must not ship.

This is [What Caps How](https://johnsonlee.io/2026/03/10/what-caps-how.en/) applied to testing. A test should be an executable What. If the Agent defines the What and then uses its own How to satisfy it, the whole exercise becomes self-verification.

## I Do Not Care How the Agent Writes It

The faster Agents produce code, the more I need regression tests, architecture tests, static analysis, mutation testing, and benchmarks. But these should be external gates, not a process log the Agent uses to prove that it worked diligently.

If tests cannot kill mutations, improve the tests. If module boundaries drift, add an architecture rule. If a real sample exposes a missed edge case, put it into the regression corpus. Whether the Agent wrote the test or the implementation first does not matter to me.

Refactoring does not have to follow every Green step either. Complexity, dependency direction, change spread, and performance regression can trigger a review directly. Fixing an observable bad result is more reliable than reminding the Agent in a prompt that "now it is time to Refactor carefully."

This is the same argument I made in ["From Prompt to Harness"](https://johnsonlee.io/2026/05/15/from-prompt-to-harness.en/): telling an Agent how to work can only change the probability that it gets the answer right. A Harness is what stops the wrong answer from getting through.

TDD is not obsolete. It is still a good thinking tool when humans write code, and a good collaboration model when humans write tests and Agents write the implementation.

What should disappear is the unwatched Red-Green-Refactor performance inside the Agent Loop.

The next time an Agent says, "Strictly followed TDD," do not relax just yet. Ask one question: **who supplied the answers in those tests?**
