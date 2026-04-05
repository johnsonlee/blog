---
title: "Ground Truth: The Most Undervalued Competitive Edge in the AI Era"
date: 2026-03-28 08:52:00
categories:
  - Independent Thinking
tags:
  - AI
  - Harness Engineering
  - Ground Truth
  - Agent
  - Software Engineering
lang: en
i18n_key: ground-truth-core-competency-of-ai-engineering
---

I was chatting recently with a friend who builds an AI coding product. He said his team spent three months tuning prompts and raised code generation "pass rate" from 60% to 78%. I asked him: how do you know it is 78%? He paused, then said it was based on manual spot checks.

**That 78% itself is not ground truth.**

## Without Ground Truth, You Cannot Even Tell When You Are Wrong

LLMs are probabilistic. That is not a flaw -- it is their nature. They do not guarantee correctness; they guarantee "looking correct." Most teams realize this, so they add code review, tests, human-in-the-loop.

But these safety nets share one trait: **they all use the human brain as ground truth.**

Manual review of generated code -- the human brain is the ground truth. Manual judgment of PR quality -- the human brain is the ground truth. Manual spot-checking of "pass rate" -- still the human brain.

This does not scale. More precisely, this is the same efficiency bottleneck as before AI -- just in a different spot.

## Ground Truth Must Be Deterministic

In a previous article, I discussed the core metaphor of Harness Engineering -- taming a horse. The rider does not need to run faster than the horse, but needs to know the direction, the boundaries, and the destination.

What are "direction, boundaries, and destination" here? They are ground truth.

But ground truth cannot come from the LLM itself -- **using a probabilistic tool to verify probabilistic output is the same as no verification.** You need deterministic means.

Take my AB experiment cleanup Agent as an example. Large codebases often accumulate mountains of expired AB experiment code. Cleaning them up is grunt work, logically perfect for an Agent. But how does the Agent know which code belongs to a given experiment? How do you confirm nothing was missed or accidentally deleted?

Have the LLM "read" the code? It will miss things, hallucinate, and get lost in complex conditional nesting.

My approach is to use Graphite -- a bytecode static analysis tool built on SootUp -- to compute the call graph first. **Which methods call the experiment API, which branches depend on experiment state, what the upstream and downstream call chains affect -- all deterministic results.** That is ground truth.

With this foundation, the LLM's role becomes clear: it is not responsible for discovering code structure; it is responsible for understanding semantics -- should this experiment's "control group" logic be kept or removed? How should the cleanup PR's commit message be written? These are things LLMs are good at.

**Deterministic tools for discovery, LLMs for interpretation.** This division of labor is not a preference -- it is an engineering constraint.

## The Moat Is Not in the Prompt, but in Verification

Back to my friend's story. He spent three months optimizing the prompt -- essentially optimizing the LLM's input. But no matter how good the input, the output is still probabilistic. Without ground truth for verification, you never know whether you are optimizing in the right direction, or even whether you are regressing.

It is like riding a horse without watching the road. No matter how fast the horse runs, if you do not know where the destination is, speed is meaningless.

Conversely, if you have ground truth:

- You can automatically verify every output from the Agent
- You can quantify the real effect of each prompt adjustment
- You can build a closed-loop in your Agent pipeline: generate, verify, feedback, retry

**Most people are optimizing prompts. A few are optimizing verification. The latter is the real leverage.**

## Building Ground Truth Is a Capability

Saying "we need ground truth" is easy. The hard part is building it.

This requires two layers of capability:

### Identifying What Should Become Ground Truth

Not everything needs ground truth. You need to judge which stages in your Agent pipeline carry the highest cost of error, which are most error-prone, and which can be verified with deterministic means.

In AB experiment cleanup, the call graph is high-value ground truth -- because "does this code belong to a given experiment?" is a question with a definitive answer. But "is this PR description well-written?" is not -- it has no ground truth, and does not need one.

### Engineering It into Existence

Once identified, you need the ability to build it. Graphite is not an off-the-shelf product. I built it on top of SootUp, exposed as an MCP Server for Agents to call. This is pure engineering work -- understanding bytecode analysis, call graph traversal algorithms, and how to structure analysis results into a format Agents can consume.

**This capability cannot be replaced by prompt engineering.** It requires understanding both how AI Agents work and how low-level engineering systems work. That is a rare cross-disciplinary skill.

## The Value of Determinism in an Era of Uncertainty

In a previous article, I wrote that in the LLM era, "the shelf life of determinism is shrinking." Models change, APIs change, best practices change. But one thing does not: **the value of ground truth only increases as AI capabilities grow -- it never decreases.**

The stronger the model, the larger the output space, and the more important verification becomes. In the GPT-3 era, you could eyeball obvious mistakes. But when the model's output "all looks correct," the only thing that can distinguish correct from "looks correct" is ground truth.

So if you are wondering what capability is most worth investing in for the AI era -- it is not prompt engineering, not fine-tuning, not keeping up with the latest models.

**It is the ability to build ground truth.**
