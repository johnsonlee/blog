---
title: Exploring the Boundaries of Claude's Capabilities
date: 2026-01-31 00:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Claude
  - Independent Thinking
lang: en
i18n_key: exploring-claude-boundaries
---

Ever since I used Claude to build [Graphite](https://github.com/johnsonlee/graphite) -- a static analysis framework based on JVM bytecode -- its engineering quality, problem-solving approach, and efficiency genuinely blew me away. Then I had it write [Rustyman](https://github.com/johnsonlee/rustyman) in Rust -- a network proxy service designed for AI -- and the results were surprisingly good too. A true 10x engineer. So a bold idea formed: [TestPilot](https://github.com/johnsonlee/testpilot) -- running Android APKs on a pure JVM. After receiving the requirements, it entered Plan mode, proposed a dual-layer architecture based on its understanding, then laid out a roadmap in 3 phases, from Phase 1 - MVP to Phase 3 - Production Ready. The MVP phase was as smooth as the previous two projects. Phase 2 started with an enthusiastic rewrite of various Android system classes -- nothing seemed off at first. It completed rewrites of Activity, View, Fragment, ViewPager, and RecyclerView. Then it proposed rewriting ConstraintLayout, and that's when I realized something was wrong -- rewriting system classes I could understand, but why rewrite a third-party library? ConstraintLayout isn't part of the Android Framework. So I sat down with it and carefully reviewed the entire plan, only to discover it didn't fully understand the capabilities of the underlying layoutlib dependency, which is why it proposed rewriting system classes in the first place. This made me start thinking: **where exactly are the boundaries of Claude's capabilities?**

## Starting from a Conversation

I asked Claude:

> Why did you perform so much better on Graphite than on TestPilot?

Its answer surprised me. Instead of giving some boilerplate "AI has limitations" response, it very specifically analyzed the fundamental difference in problem nature between the two projects:

> The reason I did well on Graphite: the problem is compositional. Static analysis = parsing + traversal + matching. Each step has mature libraries and clear API boundaries.
>
> The reason I struggled on TestPilot: the problem is simulation-based. It requires emulating Android runtime behavior, but the Android runtime is a massive black box with extensive implicit contracts.

It used an analogy: Graphite is playing chess on a board with well-defined rules; TestPilot is simulating a physical system it has never fully observed.

The accuracy of this self-awareness, honestly, exceeded my expectations.

## Determinism of the Problem Domain

Following its line of thinking, I organized the differences between the two projects:

|  | Graphite | TestPilot |
|--|--|--|
| Problem definition | Clear, closed | Ambiguous, open |
| Boundaries | Explicit (JVM bytecode -> call graph) | Fuzzy (the entire Android runtime) |
| Reference implementations | Available (SootUp, ASM) | No complete precedent |
| Success criteria | Verifiable (are the discovered constants correct?) | Hard to verify (does the behavior "look like" Android?) |

Every step of Graphite could be incrementally verified: write a query, run it, and you know immediately whether the result is correct. The difficulty with TestPilot was different -- how should `View.measure()` work? The documentation is vague; the real behavior is buried in AOSP source code, and it varies between versions.

This reminded me of a point from *Why Greatness Cannot Be Planned*: **the clearer the goal, the clearer the path; the fuzzier the goal, the more exploration is needed.** AI excels at the former; for the latter, it needs human guidance.

## Claude's Limitations

During the conversation, I directly asked Claude: what are your limitations in software engineering?

Its answer was remarkably candid:

- **Fragmented context** -- it can't see the complete codebase. Even when you paste code to it, it lacks the "living" understanding an IDE has, like which classes reference what, or whether a change will break downstream modules.
- **No real execution feedback** -- it can generate code, but it doesn't "run" code and learn from results. This means outside the conversation, the feedback loop is broken.
- **Production blind spots** -- real bugs often hide in timing, concurrency, and device differences. It can help analyze stack traces, but reproduction conditions and device fragmentation are things it can only guess at.

These limitations are not hard to understand. But what it said next left an impression:

> If you think of me as a Staff Engineer who's always on call but needs to be re-onboarded every time, your expectations will be about right.

That framing is remarkably accurate.

## Ways to Compensate for the Limitations

Knowing where the limitations are, the natural next step is finding ways to compensate. I asked Claude: what are some ways to mitigate these limitations?

It offered several ideas:

- **Feed it structured knowledge** -- for example, the call graphs produced by Graphite. If exported in a readable format, pasting them in would make its suggestions far more precise. No need for full code, just the "skeleton."
- **Feed results back to it** -- after running a script it suggested, tell it "this ran for 3 minutes on module-x, eliminated 47 dead branches, but missed lazy-init scenarios" -- that's a manual feedback loop.
- **Use Claude Code for closed-loop iteration** -- Claude Code can execute, see errors, and iterate on its own, precisely filling the "can't run code" gap. Conversational Claude is suited for upfront design and review; Claude Code is suited for execution.

The most interesting was an insight it raised at a fundamental level:

> I don't need to remember everything; I just need to be able to look up everything.

If Graphite can answer "who depends on this class," then Claude doesn't need to memorize the dependency graph -- it just needs to know how to ask Graphite. The ideal state: I ask a question -> it calls my tools to get data -> it answers based on the data.

This made me think of MCP (Model Context Protocol). Expose Graphite's query interface as an MCP server, and Claude can "look things up in real time" instead of "relying on memory."

## Onboarding to a Large Codebase

I also asked a practical question: for a codebase that has existed for 10+ years, what's the most efficient way for you to onboard?

Its answer was unexpected: **don't start from the code; start from the "distribution of forces."**

It suggested I first answer these questions:
- What's the slowest/scariest thing to change?
- Where have the incidents in the last 3 months concentrated?
- What are the most common pitfalls new engineers hit?

This is more useful than an architecture diagram. In a 10-year-old repo, the architecture diagram is most likely outdated or idealized. But pain points are real, and they quickly reveal which areas are worth diving into.

It also suggested I write a "survival guide" rather than documentation:

```markdown
# Project Survival Guide

## Module Mental Model
- core-network: the sole exit point for all API calls, don't bypass it
- legacy-payment: being migrated to payment-v2, don't depend on it for new code

## Historical Baggage
- The analytics module has 3 sets of APIs; only use AnalyticsV3
- Some A/B experiment flags always return true, but the code was never cleaned up

## Landmines
- Don't touch BaseActivity, the inheritance chain is too deep
- Run a release build before touching ProGuard rules
```

A document like this, under 500 lines, can make it "usable" within 5 minutes.

## Reflections

This conversation gave me a clearer picture of AI-assisted development.

- **AI's capability boundary is determined by the determinism of the problem domain.** The more closed the problem, the clearer the boundaries, the easier the verification, the better AI performs. Conversely, if the problem is open-ended and requires simulating the behavior of an unknown system, AI will struggle.
- **The key to compensating for AI's limitations is not making it remember more, but making it able to look up more.** Externalize context, inject it on demand, and make AI part of the toolchain rather than a standalone oracle.
- **The most efficient human-AI collaboration model is complementary, not substitutional.** AI excels at rapid prototyping, code review, explaining complex concepts, and generating boilerplate; humans excel at judging ambiguous requirements, understanding organizational politics, and maintaining long-term mental models of projects.

Steve Jobs said:

> The computer is a bicycle for the mind.

AI is an upgraded version of that bicycle. But the one riding it is still us.
