---
title: "It's 2026 -- Why Are We Still Testing Algorithms?"
lang: en
i18n_key: what-should-engineering-hiring-evaluate-in-ai-era
date: 2026-02-12 22:29:00
categories:
  - Independent Thinking
tags:
  - AI
  - Android
  - Software Engineering
  - Hiring
  - Interview
  - Engineering Leadership
---

I was recently invited to help another team with interviews. The format was the usual recipe: two coding rounds, one design, one leadership principles.

On Zoom, the candidate was screen-sharing a hand-written LRU Cache. Meanwhile, my mind was elsewhere: if this person gets the offer, how much of their daily work will have anything to do with the problem in front of them?

The answer is close to zero. In 2026, the engineers around me -- myself included -- spend most of their time pair-programming with AI. Reading AI-generated code, judging whether to use it, making trade-offs in complex systems. **But the way we screen people is still stuck in the pre-AI paradigm.**

This mismatch is worth thinking about seriously.

## AI Replaces Execution, Not Judgment

A baseline assertion: **coding and design are being rapidly commoditized by AI, and most engineers who can only write code will be replaced -- this isn't fearmongering, it's happening now.** The ones who survive are the ones AI can't replace.

So what can't AI replace?

"Translating requirements into code" is approaching zero value. A senior Android engineer's scarcity used to come largely from writing code fast and well. Now? A ViewModel + Coroutine + Flow data-loading pattern you'd spend 30 minutes hand-writing -- Cursor generates a comparable version in ten seconds.

But would you hand an entire project to AI? No. Because the hard part was never "how to write it" -- it was "what to write" and "why write it this way."

That's the difference between execution and judgment. AI has massively accelerated execution, but judgment -- making good technical decisions under uncertainty -- hasn't been replaced. In fact, it's become more important, because AI amplifies the leverage of every decision.

If we agree with this, why are interview processes still heavily testing execution ability?

## What Do Algorithm Questions Actually Measure?

I'm not saying algorithm questions have zero value. They quickly filter out people with weak fundamentals. They're standardized, easy to evaluate, and less prone to interviewer bias.

But **the signal they measure and the signal we actually need are increasingly mismatched.**

A candidate who produces the optimal solution to a LeetCode Hard in 40 minutes -- what does that prove? Strong algorithm fundamentals, high coding fluency, fast output under pressure. In 2015, these were genuinely strong signals -- an engineer's core output was the code itself.

But in 2026, an Android engineer's daily challenges are more likely to look like this:

- AI generates both a Compose UI implementation and a traditional View implementation -- which do you pick? For your specific project? Why?
- A slick modularization refactor -- will it tank build speed or introduce circular dependencies in some way you didn't anticipate?
- The PM says "this page needs to be fast" -- how do you turn that into a quantifiable, trackable performance optimization problem?
- A mess of legacy custom Views -- should you migrate to Compose? Now or later? To what extent?

Algorithm questions don't test a single one of these.

## Does Hiring by Tech Stack Still Make Sense?

Following this logic one step further: if coding itself is being commoditized, should "mastery of a specific tech stack" remain a hard hiring gate?

Job descriptions for Android engineers used to say "proficient in Kotlin, familiar with Jetpack, experience with large-scale app architecture." Perfectly reasonable in 2015 -- mastering a tech stack's details required years of accumulation, which was itself a moat.

But today, a backend engineer with solid engineering fundamentals can ramp up on Android development an order of magnitude faster with AI assistance. Unfamiliar API? Ask AI. Never written Compose? AI teaches while you write. What actually blocks them isn't syntax or frameworks -- it's understanding mobile-specific realities: battery, memory, flaky networks, device fragmentation, users killing your app at any moment.

**These are domain knowledge, not tech-stack knowledge.** Domain knowledge transfers slowly; tech-stack knowledge transfers quickly. What we're heavily screening for in hiring happens to be the part that's transferring faster and faster.

This doesn't mean tech stacks are irrelevant. Someone with zero Android ecosystem knowledge won't be productive in the short term. But the gap between "familiar" and "proficient" is being compressed rapidly by AI. Maybe future JDs should read "has a mobile performance optimization mindset" rather than "5+ years of Android experience."

## What to Actually Evaluate: Five Overlooked Dimensions

If I were redesigning the interview, I'd focus on these areas:

### Problem Framing -- Defining Problems in Ambiguity

Most real engineering problems start out ambiguous. Requirements contradict each other, constraints are incomplete, stakeholders have competing agendas. **Finding the right problem definition in chaos** is one of an engineer's most valuable abilities.

How to test this? Give the candidate a real, deliberately ambiguous scenario -- something like "our app is severely janky on low-end devices, users are complaining, you own this" -- and watch how they ask questions, how they decompose the problem, how they make reasonable assumptions with incomplete information. Do they first ask "which scenarios are janky?" or jump straight to "let's add Baseline Profiles"? The process matters more than the conclusion.

### System-Level Judgment -- Seeing Second-Order Effects

AI-generated code is almost always locally correct. But drop it into an Android project with dozens of modules -- what's the ripple effect? Change a public module's data class from `data class` to `sealed interface` -- will serialization in a dozen downstream feature modules break? Add a seemingly harmless SharedPreferences read on the main thread -- will cold start time degrade by 200ms?

Good engineers always carry a system-wide map in their heads. That map isn't drawn -- it's accumulated through hard-won experience.

### Technical Taste -- Picking the Best Among Multiple "Correct" Answers

In the AI era, solutions are the last thing you're short of. Ask AI a question and it'll give you five implementations, all of which work. But "works" and "should do it this way" are worlds apart.

Technical taste is hard to quantify but critically important. It's the instinct that makes you pick Coil over Glide for image loading, the judgment that chooses type-safe routes over deeplinks for navigation -- behind that instinct is an integrated assessment of performance, maintainability, team capability, and the direction the business is heading.

### Meta-Engineering -- Designing Systems That Make AI Better Over Time

This dimension is relatively new but will become increasingly important. The most valuable future engineers won't be "people who use AI tools" but "people who design mechanisms that make AI continuously better in a specific domain."

For example: how do you design a feedback loop so that corrections to AI-generated code during code review feed back into improving future generation quality? How do you structurally feed your team's coding conventions, module boundary rules, and hard-won ProGuard obfuscation lessons to AI so it truly understands your Android project?

This is engineering on top of AI, not just engineering with AI.

### Ownership Under Uncertainty -- Making Decisions with Incomplete Information

AI doesn't bear consequences. People do. When a production crash affects millions of users, someone needs to make fast calls with incomplete information: emergency hotfix release or server-side degradation? How wide is the crash scope? Should you notify Google Play for expedited review?

The ability to make decisions and own the consequences under pressure can never be replaced by AI.

## Interview Methods Need to Evolve Too

Knowing what to evaluate isn't enough -- how you evaluate matters just as much. A few directions worth trying:

### Code Review-Style Interviews

Instead of having candidates write code from scratch, give them a piece of AI-generated Android code that "looks pretty good" -- say, a data-loading implementation using Coroutine + Flow -- and have them review it. Can they spot lifecycle management pitfalls? Can they identify what "works but will break on configuration change"? Can they propose a better alternative with reasoning?

### Scenario-Based Discussion

Present a real scenario with conflicting constraints -- something like "cold start needs to go from 3 seconds to 1.5, but product wants a new ad SDK initialization during startup, the team has two weeks, and you can't touch the existing initialization framework" -- and watch how the candidate navigates the trade-offs. There's no "standard answer." You're watching the reasoning process.

### Decision History Review

Have the candidate walk through an important technical decision they made. Probe the details: what other options were on the table? Why did you rule them out? If you could go back, would you decide differently? Why?

These methods demand more from interviewers -- you can't grade against a rubric. You need enough judgment yourself to evaluate the candidate's judgment. But that's exactly right: **if an interview method doesn't require the interviewer to think, it probably can't measure whether the candidate thinks either.**

## Not Lowering the Bar -- Shifting It

I know someone will say: aren't you lowering technical standards? Without algorithm questions, how do you ensure fundamentals?

The concern is fair, but it's actually the opposite. **Algorithm questions test a dimension increasingly replaceable by AI, while the dimensions I'm describing are abilities that become more essential the stronger AI gets.** This is shifting the bar to where it actually matters.

Fundamentals still matter, but the definition of "fundamentals" is changing. Android engineering fundamentals used to mean hand-writing custom Views, memorizing the Activity lifecycle, and reciting the Handler message mechanism. Today's fundamentals: can you read the recomposition strategy behind AI-generated Compose code? Can you judge whether dropping this code into your multi-module project will introduce unnecessary dependencies? Do you know when to trust AI's suggestions and when not to?

These are 2026 fundamentals.

## Change Always Starts with a Small Step

I don't expect the entire industry to overhaul its interview process overnight. Standardized algorithm interviews have organizational inertia and valid reasons for existing.

But if you're a technical interviewer with influence, you can start with yourself. In your interview slot, ask one more trade-off question and set one fewer rote algorithm problem. In the debrief, push once more on "what's this candidate's judgment like" and spend less time debating "was their time complexity optimal."

**The tools are changing, the work is changing, but how we screen people hasn't moved.** The wider that gap grows, the further apart the people we hire and the people we actually need will be.
