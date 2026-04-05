---
title: Once You've Tasted the Best, There's No Going Back
lang: en
i18n_key: the-right-tool-matters
date: 2026-02-10 23:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Claude
---

A few days ago I submitted a PR -- an MCP Server implementation. From design to coding to testing, it took about an hour. When my colleague saw the PR, he pinged me on Slack: "That's insanely fast! I've been studying MCP for days and still can't figure out how to wire up the transport."

Curious, I walked over and glanced at his Windsurf. One look at the model config and I nearly lost it -- ChatGPT.

I said, buddy, you picked the wrong model. You should be using Opus 4.6 -- The Best AI in the world!

He looked confused and said ChatGPT was fine, wasn't it? I said, for casual chat, sure. But for engineering code -- especially anything involving protocol comprehension, contextual reasoning, and code architecture -- the gap is night and day. Claude understands the spec you feed it. It gets the JSON-RPC transport layer, the tool registration lifecycle, the edge cases in error handling all in one pass, and the generated code style is remarkably consistent with your existing codebase. No reformatting, no adapting.

He switched models, skeptical. Tried it. Went silent for about five seconds. Then: "Holy shit."

I just smiled.

## Buddy, You Picked the Wrong Tool

This reminded me of an earlier incident. Same guy came over with his laptop, saying he'd written a Spring Boot demo but couldn't get it running in VS Code -- kept getting dependency resolution errors.

I looked at his VS Code. Extensions everywhere -- Java, Kotlin, Spring, a rainbow of them. The `.gradle` file was drowning in red squiggles. The LSP diagnostics didn't match the source at all.

I said, buddy, you picked the wrong tool. IntelliJ IDEA is the best one for Spring projects.

He said VS Code was supposed to be universal. I said VS Code is great for frontend and lightweight projects, but for heavyweight JVM projects like Spring, its Java support is fundamentally a patchwork of plugins. Gradle sync, dependency injection navigation, bean auto-discovery, Spring Boot auto-configuration hints -- IntelliJ supports all of this natively from the ground up. You can't patch that together with a handful of extensions.

He installed IntelliJ. Same code. Opened and ran immediately. He went silent again.

## Choice Is the Biggest Variable

These two incidents seem unrelated, but they're the same problem at their core -- **choice**.

After all these years as an engineer, I'm increasingly convinced that a person's engineering productivity looks like a difference in technical skill on the surface, but is largely determined by the choices they make at key junctures. Which language, which framework, which tool, which model -- these choices seem small, but compounded over time they create orders-of-magnitude gaps.

It's like someone who's gotten used to fine food -- going back to coarse meals is hard to swallow. That's not being spoiled. Your palate has been calibrated. You know what good tastes like, and you can no longer tolerate settling.

Someone who's used Claude Opus for engineering code will feel something is off when they go back to other models. Someone who's used IntelliJ for Spring will feel constrained going back to VS Code. It's not that the other tools are bad -- it's that you've seen better.

> Once You've Tasted the Best, There's No Going Back

## $100

Later, chatting with a colleague, I asked: if everyone knows Claude is better, why do so many people still not use it? What's stopping them from making the better choice?

He thought for a moment and gave me two words:

> Hundred bucks.

I got it immediately. If you're the kind of person who shares a streaming subscription to save money, asking you to pay $100/month for an AI tool feels like cutting off a piece of yourself.

I thought about it. He had a point -- $100 isn't cheap, especially for someone who hasn't experienced the productivity gap firsthand. The money looks like pure consumption. But flip it around: $100 for 10x efficiency -- is that really expensive?

An MCP Server took me 1 hour. He spent days and was still stuck. Convert those days into billable hours, and it's way more than $100. Not to mention the frustration, the mental drain of trial and error, the panic as deadlines approach -- those hidden costs are the truly expensive ones.

**What stops us from making better choices usually isn't the cost of the choice itself, but how we perceive cost.** We're naturally sensitive to visible expenses but numb to invisible losses. The $100 subscription is a real deduction from your account. But spending an extra two or three hours a day grinding with an inferior tool -- that's an invoice nobody bothers to calculate.

## A Good Blade Still Needs a Good Hand

Of course, tools are still just tools. Even the best model needs a capable user to wield it. Claude delivers 10x results in my hands not just because it's smart enough, but because I know how to frame requirements for it, how to decompose tasks, how to review its output. Like a fine blade -- it still depends on who's holding it.

So don't be stingy about investing in tools, and don't stop sharpening your craft of using them.

But the prerequisite -- you have to get your hands on that blade first.
