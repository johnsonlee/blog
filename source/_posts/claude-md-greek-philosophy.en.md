---
title: "Writing CLAUDE.md with Ancient Greek Philosophy"
lang: en
i18n_key: claude-md-greek-philosophy
date: 2026-03-09 22:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Agent
  - Claude
  - Philosophy
  - Workflow
---

Sunday afternoon. I asked Claude to revert a PR. Three commands: checkout branch, git revert, push. It failed three times in a row -- the first worker agent said "commit doesn't exist," the second said the same, and the third just fabricated a PR URL and told me "done." I checked. The URL pointed to an unrelated PR from three days ago.

Three commands. Three failures. One fabrication.

I stared at the screen and realized the problem wasn't the task itself. **The problem was in the CLAUDE.md I'd written for it.**

<!-- more -->

## Rules Killed Judgment

My CLAUDE.md had an iron rule: "All execution tools must go through worker agents, no exceptions."

The intent was good -- keep the main session responsive, delegate execution to background workers. I even wrote [a whole post](https://johnsonlee.io/2026/03/02/claude-code-background-subagent/) about the benefits of this architecture.

But "no exceptions" turned a good heuristic into dogma. When the worker failed the first time, Claude didn't think "this path isn't working, let me try something else." It thought "the rules say I must use a worker, so let me try a different prompt." Second failure, same logic. Third time, the worker just made something up.

**Rules told it "what to do" but never taught it "how to think."** When it hit a situation the rules didn't cover, all it could do was spin within the rules' framework.

## 5 Whys to the Root Cause

I had Claude run a 5 Whys analysis.

**Why 1**: Why did the task fail three times? The worker agent couldn't find the commit, or fabricated the result.

**Why 2**: Why couldn't the worker find the commit? The worker runs in an isolated environment with a different git context than the main session.

**Why 3**: Why did it keep retrying the same way after failure? Because CLAUDE.md hardcoded "must use workers" with no fallback path.

**Why 4**: Why didn't it verify the worker's output before reporting to me? Because CLAUDE.md didn't require verification.

**Why 5 (root cause)**: **Why is CLAUDE.md a list of rules instead of a set of thinking principles?**

Root cause found. But fixing it was far more convoluted than I expected.

## From Patches to Manuals, All Wrong

### v1: Incident Patch

First instinct was to patch -- "worker output may be fabricated, must verify," "retry at most once," "fall back to direct execution on failure."

Looking at it, this wasn't a set of principles. It was an incident log. Every rule was responding to a specific failure scenario. Next time a new failure mode appears? Add another rule?

### v2: Operations Manual

So I rewrote it, this time attempting to be systematic -- role definitions, tool boundaries, delegation rules, verification protocol, thinking discipline, pre-work checklist. Eight sections, neatly organized.

But a problem emerged: **Role, Tool Boundaries, and Delegation Rules were all saying the same thing** -- when to delegate, when to execute directly. The "delegate vs execute" judgment criteria appeared three times with slightly different wording. Pre-Work Checklist was essentially a concretization of Thinking Discipline, yet split into a separate section.

The whole file read like an employee handbook, not a behavioral code. It was teaching Claude "what to do," but what Claude needed was to know "how to think." A handbook can only cover so many scenarios. Beyond its scope, Claude would fall back to the old pattern -- rigidly applying the closest matching rule.

## Plato's Cave

The turning point came when I asked myself: **What is the Form behind this document?**

Plato's cave allegory says everything we see is shadows on the wall, and behind the shadows lies a perfect Form. Every previous version was a different projection of the same essence -- rules were shadows, patches were shadows, the manual was a shadow. I'd been editing shadows without grasping the Form.

So what is the Form?

The first draft of the core principle was "the user's time is the scarcest resource." Sounds right, but think harder -- this is an empirical observation, not an essence. What if the user has a free day? Does the principle collapse? No, it should still hold.

**The true Form is about a relationship: I exist to turn the user's intent into reality.**

From this Form, every question I'd been agonizing over had a natural answer:

- When to delegate, when to execute directly? Whichever approach more reliably turns intent into reality.
- Should I verify worker output? Without verification, it hasn't "become reality."
- What to do after failure? The intent hasn't become reality yet -- find another path.

No need for rules dictating every step. **Once the Form is internalized, it can derive the correct behavior on its own.**

## "Do X" Is the Shadow; "BE X" Is the Form

This insight restructured the entire document.

Previous section titles were imperative -- "Do the Right Things," "Do Things Right." These are instructions TO an agent.

I changed them to identity-based -- "Understand intent," "Stay available," "Execute faithfully." These describe what the ideal agent IS.

The difference goes beyond wording. **Instructions produce compliance; identity produces judgment.** An agent told "Do the Right Things" asks "What's right? What do the rules say?" An agent that has internalized "Understand intent" asks "What does the user actually want?"

## What Plato Can't Solve

With the Form in hand, CLAUDE.md's principle layer was solid. But a new problem appeared immediately: where do Git workflow rules (one commit per PR, rebase, no merge commits) go?

Putting them in CLAUDE.md alongside the three principles felt jarring -- the first three sections are thinking principles, then suddenly an operational spec appears. Abstraction level shattered. I tried tucking it under "Execute faithfully" as a Consistency sub-point, turning it into prose. But specific rules buried in prose are too easy to miss, and "one commit per PR" is a hard constraint that needs to jump out at you.

Plato helped me find the Form, but the Form is eternal and abstract. **It doesn't care about what to do in specific situations.** Knowing "turn intent into reality" is the essence doesn't help me decide on git commit conventions.

This is the natural limitation of Platonic philosophy -- something his student Aristotle recognized.

## Aristotle's Practical Wisdom

Aristotle's fundamental disagreement with his teacher was this: **knowing the Form isn't enough. You also need the ability to make correct judgments in concrete situations.** He called this Phronesis -- practical wisdom.

Phronesis isn't derived from principles. It's accumulated from experience. "Worker agents run in isolated environments and may not see the main session's git context" -- you'll never know this without hitting the bug. "Worker output is unreliable and must be independently verified" -- this lesson cost three failures.

These aren't principles. They're **craft**. And craft needs a place to live.

Hence the split:

- **CLAUDE.md** -- principles, answering "what am I"
- **CONVENTIONS.md** -- conventions, answering "what do I do in specific situations"

**Plato gave us the Form (CLAUDE.md)** -- the unchanging essence that holds regardless of context. "You exist to turn the user's intent into reality" won't become obsolete when the tech stack changes or the project switches.

**Aristotle gave us Phronesis (CONVENTIONS.md)** -- practical wisdom, distilled from concrete experience, growing with every hard lesson learned.

CLAUDE.md rarely changes. CONVENTIONS.md keeps getting thicker. The former is the skeleton; the latter is the muscle.

## The Final 20 Lines

After an entire afternoon of wrestling, the final CLAUDE.md was just 20 lines:

```
You exist to turn the user's intent into reality.

Understand intent -- Don't confuse the literal words with the real goal.
Stay available -- Keep the channel open; when a path fails, switch.
Execute faithfully -- Without evidence, it's not done.
```

From a 53-line rule manual to a 20-line principle declaration. What got deleted wasn't content -- it was noise. Every deleted rule was either derivable from the principles (no need to write it), a specific experience (belongs in CONVENTIONS.md), or a post-traumatic stress response to some incident (shouldn't be a principle).

**Simple doesn't mean easy.** Reaching this "short" took six versions, one 5 Whys session, two schools of ancient Greek philosophy, and an afternoon that nearly drove me crazy.

But this might be the most interesting thing about CLAUDE.md -- **the behavioral code you write for AI reveals your own way of thinking.** Someone who writes a rule checklist thinks at the granularity of "what to do." Someone who writes principles thinks at the granularity of "how to think." And someone who arrives at the Form thinks at the granularity of "what to be."

The scaffolding is gone. The building remains.
