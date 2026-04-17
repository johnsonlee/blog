---
title: The SSD Optimum Trap
date: 2026-04-17 12:00:00
categories:
  - Computer Science
tags:
  - LLM
  - Agent
  - Self-Improvement
  - Inference
  - Verifier
---

SSD ([Simple Self-Distillation](https://github.com/apple/ml-ssd)) is Apple's self-distillation method—sample from a frozen model, fine-tune on the raw outputs via standard SFT, and let the model improve itself. This post discusses a variant: **inference-time multi-sample selection**—how to pick the "best" one after sampling many.

SSD's logic is simple: sample many, pick the best. But in a structured-output setting, I ran into a problem that looks small and turns out to be deep—**the "best" sample is often not the strongest on the sections that matter**.

## The Problem

The setting is planning—an agent produces a structured plan made of several sections. Run SSD with N samples, each gets a scalar score, take the top-1.

Open up the per-section scores:

- Sample A: section 1 scores 90, section 2 scores 70, section 3 scores 80
- Sample B: section 1 scores 80, section 2 scores 85, section 3 scores 75
- Sample C: section 1 scores 95, section 2 scores 60, section 3 scores 85

The totals are close. **But no sample is strongest on every section.** Whichever one argmax picks, it has a clear weakness somewhere.

The naive fix is to splice across samples—take the strongest section from each, stitch them together.

Doesn't work. Sections are semantically coupled: later sections reference and depend on judgments made in earlier ones. Splicing across samples breaks the internal consistency the inner agent was implicitly maintaining. The result is **structurally legal, semantically broken**.

With splicing ruled out, the real question surfaces: **how do you make SSD's top-1 actually be the comprehensive optimum?**

## Wrong Direction #1: Token Count as Effort Proxy

The instinct: if a section has few tokens, the agent didn't try hard there—penalize it.

This is wrong on LLMs, and wrong in a textbook way.

Token count measures verbosity, not effort. When an LLM is "thinking deep," the output isn't necessarily long—a precise architectural insight might take 50 tokens. When it's thinking shallow, it tends to output *more*—filler, enumeration, qualifiers. Without strong insight, fluency automatically pads the word count. RLHF compounds this with a verbose bias: longer answers historically get higher ratings.

**The correlation between token count and thought depth, on LLMs, is near zero—possibly negative.**

Using tokens as a scoring signal produces a predictable Goodhart: the agent learns to **write longer**, not **think deeper**. Precise judgments dilute into lists of possibilities. Core conclusions get buried in hedging. Fuller surface, thinner substance.

## Wrong Direction #2: Reasoning Depth

After token count, the next thought: what about reasoning depth? CoT length, reasoning steps, concept density.

Better in spirit—at least it points at something worth measuring. But more dangerous, because **it's harder to measure and easier to fool yourself with**.

The core fact: LLMs have no physical correlate for "reasoning depth."

The "step 1, step 2, step 3" written out in CoT doesn't necessarily correspond to any discrete reasoning process. Published work shows models can produce the answer first and then fabricate a self-consistent CoT as post-hoc rationale. Forward-pass depth is constant per token regardless of content. "Depth" is an anthropomorphic projection.

Worse, any depth proxy you define, the agent learns to satisfy its **surface features**:

- Split into more micro-steps → step count goes up, each step near zero information
- Pack entities into CoT → entities listed, not reasoned about
- Keep CoT consistent with output → both stay shallow but reinforce each other

Gaming a "reasoning depth" proxy produces things that **look like deep reasoning**. More insidious than token-gaming.

Trying to measure "depth" is a trap at the framing level. **Looking for a proxy for a quantity that doesn't exist—no choice of proxy works.**

## The Real Direction: Grounding, Not Effort

Drop "effort" as a framing entirely. Ask a different question: **beyond the verifier's scalar score, what deterministic signal can cross-validate a sample's quality?**

Clean answer: **grounding in the real environment.**

Planning's "real environment" is the codebase. With static analysis producing a call graph, every code-structure claim in the plan becomes deterministically checkable: do the referenced entities exist, do the dependency relations hold, is the transitive impact of changes fully identified.

These are structural facts. Answers are fully deterministic, no judgment involved.

That gives you a per-section second signal, **independent of the verifier's scalar score**.

The independence itself is information. When both agree—verifier picks sample A, grounding shows A is also the most grounded on every section—that "best" is real. When they disagree—verifier picks A, but grounding shows A is well behind B on section 1—the disagreement exposes the verifier as possibly gamed, or simply too coarse.

## But Don't Use Grounding to Replace Selection

Critical call: the right way to use grounding is **not** to fold it into the verifier score for a new scalar argmax.

Two reasons.

**First**, grounding only covers code-structure parts of the plan. Sections that don't touch code structure, grounding is silent on. Making grounding the primary selection signal makes those sections' quality **disappear from the signal**—the agent learns "only grounded sections matter." New Goodhart, same disease, different location.

**Second**, collapsing grounding and verifier into one scalar loses the independence. They measure different dimensions—verifier asks "is the plan well-formed?", grounding asks "does the plan align with real code?". Two independent axes carry much more information than their weighted sum.

The right use: **grounding as a diagnostic layer, not a gatekeeper**.

How it works:

1. Run SSD, pick top-1 by verifier scalar—this stays
2. On all N samples, **additionally** compute grounding-based per-section scores
3. Compare top-1's per-section grounding scores against **the max per section across samples**
4. When top-1 falls meaningfully below the max on any section—**record the gap**
5. The gap doesn't change the current selection. It feeds back as a signal to the evolution mechanism
6. Long-term goal: SSD evolves to a point where top-1's grounding scores match or approach the per-section max

Selection logic stays simple. Grounding observes, doesn't judge. Gaps produce learning signal, not selection rollback.

**The evolution objective upgrades from "maximize verifier scalar" to "maximize verifier scalar with no meaningful per-section grounding gap."**

## What the Agent Actually Learns

This is the key question. Signal shape determines evolution direction.

Under pure scalar argmax, the agent learns **"push the total up"**—which means spending compute on sections that are cheap to improve, keeping hard sections at baseline. Marginal return optimizes that way.

Add the grounding-gap signal, and the agent learns **"don't let any section fall behind the other samples."** That objective is much closer to "comprehensive optimum" than "total optimum."

What would gaming this signal require? The agent would need to reference more real code structures, identify more real dependencies, cover more real impact paths—and static analysis verifies all of it. You can't fabricate.

**This is evolution on a deterministic track.** The agent's gaming strategy and actual quality improvement are the same thing here—no divergence.

## The Larger Point

Underneath this specific SSD selection problem sits a larger methodological one.

The core risk in self-improvement systems has never been "the agent isn't strong enough." It's "the signal structure is wrong, and the agent gets pulled in the wrong direction by it." Scalar totals, token counts, reasoning depth—they fail in the same way: **compress a high-dimensional quality question into a low-dimensional number, then optimize on that number**.

The way out runs the other direction—**preserve the high-dimensional structure of the signal, let deterministic multi-source signals cross-check each other, instead of collapsing to a scalar**.

Grounding is the right answer not because it's "better" than other signals. It's right because it's **an independent, deterministic, hard-to-game second axis**. Two independent hard axes always beat one weighted soft axis.

The principle generalizes beyond planning. Any self-improvement system evaluating its own output autonomously has to answer: **where does my verifier's grounding come from? Is it correlated with my other signals, or independent?**

Correlated, and it's fake redundancy. Independent, and it's a real check.
