---
title: "Distill Your Coworker? Just Distill Yourself"
date: 2026-04-07 09:00:00
lang: en
i18n_key: ssd-redundancy-beats-sophistication
categories:
  - Computer Science
tags:
  - SSD
  - Self-Distillation
  - LLM
  - Code Generation
  - Agent
---

There's a meme going around lately about "distilling your coworker" — using AI to extract a colleague's expertise and make it your own. Jokes aside, Apple dropped a paper last week that seriously answers an even more absurd question:

**Can you distill yourself?**

Turns out, yes. And it works so well the authors were almost embarrassed — the paper is literally called *Embarrassingly Simple Self-Distillation*.

Here's what they did: take a code generation model, have it write solutions to a batch of programming problems at high temperature (T=2.0), don't check if the answers are correct, then train the model on its own outputs. Result: Qwen3-30B jumped from 42.4% to 55.3% pass@1 on LiveCodeBench.

No reward model, no verifier, no teacher, no RL. **The model copied its own homework and got better at it.**

Sounds like magic. But it's not.

## One Person Solving a Problem vs. Ten

Picture this: you ask a programmer to write a sorting function. They'll probably write quick sort, maybe merge sort, and on a rare day, bubble sort. That's their "distribution."

Now ask them to write it ten times. Not copy-paste — start from scratch each time, with some noise thrown in (that's the high-temperature sampling). Among those ten versions you might get quick sort, merge sort, heap sort, and a few that don't even compile.

Here's the key: you mix all ten versions together and have them "review" the batch.

What did they learn? Not any specific correct answer — you never told them which one was right. What they learned is: at the "choose an algorithm" point, several paths are worth taking; but at `if left < right`, all ten versions wrote the same thing — nothing to deliberate about.

**Redundancy itself is signal.**

## The Opposite of Noise Isn't Precision — It's Redundancy

When a model generates code, every step falls into one of two situations:

- **No-choice positions** (the paper calls them *locks*): syntax dictates that only one token makes sense, but the model's probability distribution still drags a long tail of distractors — tokens that shouldn't appear but carry a sliver of probability. Over a sequence, these accumulate and cause drift.
- **Real-choice positions** (the paper calls them *forks*): like deciding between recursion and iteration — both paths are valid, and the model needs to preserve that diversity.

These two types of positions make contradictory demands on temperature. Lowering it suppresses noise at locks but kills diversity at forks. Raising it preserves diversity at forks but lets noise flood back at locks.

Any single temperature is a compromise. The paper ran a full temperature sweep — the base model's pass@1 fluctuated by only 2 percentage points across temperatures. Tuning temperature is basically useless.

What SSD effectively does is this: **let a swarm of "agents" each take a pass, then distill consensus from the group's behavior.**

Ten agents agree at lock positions — consensus automatically suppresses the distractor tail. At fork positions, they each go their own way — diversity is naturally preserved. This isn't some clever algorithm. It's just redundancy. Redundancy inherently separates signal from noise: signal gets reinforced through repetition, noise gets diluted.

## The Answers Don't Even Need to Be Correct

The most counterintuitive experiment is in Section 4.4: they cranked the sampling temperature to the extreme. The generated code was near-gibberish. They trained the model on this gibberish. The model still improved.

This means SSD's gains don't come from "learning correct code." They come from reshaping the distribution — the statistical pattern of agreement at locks and divergence at forks persists even in garbage data.

In communication theory terms: you don't need every message to be correct. You just need enough redundant messages to recover the signal from a noisy channel. Shannon figured this out seventy years ago.

## No New Knowledge, Just Cleaner Old Knowledge

SSD doesn't create new capabilities. Everything the model can write after SSD, it could already write before — it was just buried in noise. SSD washes the model's existing knowledge clean.

This is the same principle as ensembling. Running a model ten times and taking a majority vote improves accuracy — not because the model got smarter, but because redundant voting filters out random errors. SSD bakes this inference-time redundancy into the model weights, saving you from running ten copies at serving time.

## What to Make of This

SSD isn't a new paradigm. Its contribution is using a dead-simple experiment to prove something everyone vaguely suspected but nobody had rigorously tested:

**The bottleneck isn't always lack of capability — sometimes the model just isn't expressing itself cleanly.**

The engineering takeaway is immediate: before you invest in RLHF, reward models, or human annotation, try letting the model sample a batch from itself and train on it. Near-zero cost, potentially surprising returns.

Of course, SSD has a ceiling. It can only clean up existing capabilities, not create new ones. Real evolution needs a closed feedback loop — a compiler to tell you right from wrong, test cases to show you where you fell short.

But as step zero of evolution — using redundancy to clean up the distribution first — it's a no-brainer.
