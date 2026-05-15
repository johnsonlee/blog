---
title: "KB/SKILL Is Not Harness"
date: 2026-05-15 09:44:41
categories:
  - Independent Thinking
tags:
  - AI
  - Harness Engineering
  - Prompt Engineering
  - Eval
  - Agent
lang: en
i18n_key: kb-skill-is-not-harness
---

Recently I noticed an interesting pattern.

Some people add a stack of SKILLs to an Agent, wire it to all kinds of knowledge bases, build workflows everywhere, stuff the prompt with caveats, counterexamples, and few-shot examples, then say very seriously: we are doing harness engineering now.

My first reaction was: this has barely reached the entrance, and is still far from real Harness Engineering.

SKILLs, KBs, and structured prompts are valuable. They help the model understand context, act closer to your expectations, and avoid plenty of basic mistakes. But if you call these things a harness, you are making the whole problem shallower than it is.

**KB/SKILL is not harness. At most, they are the input constraint layer of a harness.**

<!-- more -->

## Prompt Is Not the Rein, It Is Just What You Say to the Horse

The easiest way to misunderstand Harness Engineering is to hear the word "harness" and immediately translate it into "constraint." If it is about constraints, then writing longer prompts, adding more rules, and preparing more KBs must be constraining the model, right?

Not exactly.

Imagine you are riding a horse. You tell it: "A little to the left, don't run too fast, go around the rocks, there is a river ahead, don't jump." That is useful. If the horse understands, the error rate goes down.

But that is not a harness.

A real harness is the rein, saddle, guardrail, route, checkpoints, and the mechanism that lets you review why you fell after you fall. What you say to the horse is only the softest layer.

LLMs are the same.

Prompts can change the probability distribution of model outputs. SKILLs can encode common patterns in advance. KBs can fill in missing context. Structured prompts can reduce the space for free-form improvisation.

All of these things do the same job: **they increase the prior probability of a correct output.**

The key word is probability.

As long as the execution layer is still a model call, the output remains probabilistic. You can move the probability from 60% to 80%, from 80% to 92%, maybe even make it look close to 99% in some scenarios. But it has not become deterministic.

This is where many people get stuck.

Many people think "the model is more obedient" means "the system is constrained." It does not. A more obedient horse does not mean you have guardrails around the track.

## A Real Harness Has at Least Five Layers

I now prefer to split a harness into five layers.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 600" role="img" aria-labelledby="harness-layers-title-en harness-layers-desc-en" style="max-width: 100%; height: auto;">
  <title id="harness-layers-title-en">The Five Layers of Harness</title>
  <desc id="harness-layers-desc-en">A five-layer view of harness: input constraints, execution, output validation, feedback, and reproducibility.</desc>
  <defs>
    <filter id="harness-shadow-en" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <marker id="harness-arrow-en" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563"/>
    </marker>
  </defs>
  <rect x="20" y="20" width="880" height="560" rx="8" fill="none" stroke="#cbd5e1"/>
  <text x="460" y="58" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#111827">The Five Layers of Harness</text>
  <text x="460" y="86" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#4b5563">Harness = the structure that puts probabilistic models inside deterministic systems</text>

  <g filter="url(#harness-shadow-en)">
    <rect x="80" y="122" width="500" height="72" rx="6" fill="#fff7ed" stroke="#f97316" stroke-width="2"/>
    <text x="112" y="151" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#9a3412">1. Input Constraints</text>
    <text x="112" y="177" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#7c2d12">SKILL / KB / structured prompt / few-shot: raise the prior</text>
  </g>
  <g filter="url(#harness-shadow-en)">
    <rect x="80" y="214" width="500" height="72" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
    <text x="112" y="243" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#1d4ed8">2. Execution Layer</text>
    <text x="112" y="269" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#1e3a8a">The LLM call itself: a probabilistic node remains</text>
  </g>
  <g filter="url(#harness-shadow-en)">
    <rect x="80" y="306" width="500" height="72" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
    <text x="112" y="335" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#047857">3. Output Validation</text>
    <text x="112" y="361" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#064e3b">schema / tests / linters / policy: deterministic gates</text>
  </g>
  <g filter="url(#harness-shadow-en)">
    <rect x="80" y="398" width="500" height="72" rx="6" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2"/>
    <text x="112" y="427" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#6d28d9">4. Feedback Layer</text>
    <text x="112" y="453" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#4c1d95">slow-loop eval / human review / golden dataset: calibrate ground truth</text>
  </g>
  <g filter="url(#harness-shadow-en)">
    <rect x="80" y="490" width="500" height="72" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
    <text x="112" y="519" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#b91c1c">5. Reproducibility Layer</text>
    <text x="112" y="545" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#7f1d1d">seed / model / prompt / tool / KB / dataset snapshots: make results comparable</text>
  </g>

  <line x1="330" y1="194" x2="330" y2="214" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-en)"/>
  <line x1="330" y1="286" x2="330" y2="306" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-en)"/>
  <line x1="330" y1="378" x2="330" y2="398" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-en)"/>
  <line x1="330" y1="470" x2="330" y2="490" stroke="#4b5563" stroke-width="2" marker-end="url(#harness-arrow-en)"/>

  <path d="M 620 158 C 735 158 735 342 620 342" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="732" y="235" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#334155">Probability Boost</text>
  <text x="732" y="258" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#475569">not a hard boundary</text>

  <path d="M 620 342 C 785 342 785 526 620 526" fill="none" stroke="#111827" stroke-width="2.5"/>
  <text x="760" y="426" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#111827">Engineering Loop</text>
  <text x="760" y="449" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#374151">block, calibrate, reproduce</text>

  <rect x="650" y="484" width="190" height="62" rx="6" fill="#ffffff" stroke="#94a3b8"/>
  <text x="745" y="512" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#111827">Harness Boundary</text>
  <text x="745" y="533" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#475569">not "trust it", but "block it"</text>
</svg>

### Input Constraints: Raising the Prior Probability

This layer includes SKILLs, KBs, structured prompts, tool descriptions, few-shot examples, and system instructions.

Their goal is not to guarantee correctness. Their goal is to make the model more likely to get onto the right path before generation starts.

For example, you tell an Agent: read the README before editing code, run tests before submitting a PR, do not guess when uncertain. These rules are useful. They eliminate a lot of basic mistakes.

But in essence, they are still "telling the model what it should do." The model may follow them, or it may miss them. It may understand them correctly, or distort them. It may behave well in simple cases, then suddenly lose control after long context, complex state, or tool failures.

So the value of the input constraint layer should be acknowledged. Its boundary should be acknowledged too.

**A prompt can make the model more likely to be correct. It cannot make the system required to be correct.**

### Execution Layer: Probability Cannot Be Removed

The execution layer is the model call itself.

As long as an LLM sits in the middle, the system contains a probabilistic node. This node is not a bug. It is the nature of the thing.

Many engineers do not want to accept this. They keep trying to "prompt away" probability with more elaborate prompts. That is a bit like trying to eliminate traffic accidents with a better driving manual. The manual can lower the accident rate, but it cannot replace brakes, traffic lights, and crash tests.

Model calls work the same way.

You can switch to a stronger model. You can tune temperature. You can increase thinking tokens. You can add chain-of-thought-style intermediate steps. You can ask the model to self-check. None of this changes the fact that the execution layer is still not a deterministic program.

This is also why "let another LLM check it" is only weak validation. It may help, but it is not a boundary.

**Probabilistic output cannot be closed by probabilistic judgment.**

### Output Validation: A Deterministic Gate Is the First Hard Boundary

A real harness starts to become hard at the output validation layer.

The keyword here is not "review." It is gate.

A gate means: if it does not pass, it cannot continue. Not "the model thinks it is fine," not "it looks okay to a human," not "it should probably be fine," but a deterministic check that blocks the output.

This is why I keep emphasizing the fast-loop. The fast-loop is not responsible for proving the truth of the universe. It is responsible for immediately cutting off obviously unqualified results after each Agent output in a cheap, deterministic, repeatable way.

I usually break a fast-loop gate into seven rules:

1. The output must satisfy the schema. If it does not, fail immediately.
2. Every factual claim must trace back to context, tool results, or an explicit assumption.
3. The Agent must not perform actions beyond its authorization scope, especially writing files, sending requests, deleting resources, or changing configuration.
4. The Agent must not package uncertainty as a certain conclusion.
5. Tool errors must not be swallowed. Failures must be exposed explicitly.
6. Modification tasks must produce a verifiable diff, not just "I changed it."
7. Critical artifacts must be reviewable by deterministic checkers, such as parsers, linters, tests, static analyzers, or policy rules.

These seven rules are not mysterious. They are not sexy either.

But engineering systems do not run on sexiness. They run on blocking the same class of error every time.

If an Agent generates JSON without schema validation, you are merely trusting it to generate JSON. If an Agent edits code without tests and static checks, you are merely trusting that it did not break anything. If an Agent writes an analysis report without citation coverage and source boundaries, you are merely trusting that it did not hallucinate.

Trust is not harness.

**The first principle of harness is replacing "trust it" with "block it."**

### Feedback Layer: Slow-Loop Eval Calibrates Ground Truth

The fast-loop answers "can this output clear the minimum bar this time?" It does not answer a larger question: is your gate itself correct?

That requires slow-loop eval.

Many teams build a pile of automatic checks, then quickly fall into another hallucination: if all checks are green, the system is good. This idea is just as dangerous.

Because a checker can check the wrong thing.

Suppose you are building a code generation Agent. The fast-loop can check whether the code compiles, whether tests pass, and whether formatting is right. But none of that equals correct business logic. You may have tested the happy path and missed edge cases. You may have asked the Agent to fix a surface bug while introducing architectural debt. You may have overfit the eval set to a batch of old problems, then collapse the moment real users arrive.

The job of slow-loop eval is to periodically pull the system back to ground truth.

It does not have to run every time, and it does not have to be cheap. It may require human labeling, online sample replay, golden datasets, shadow traffic, real user feedback, and case study reviews. It is slow, but it calibrates direction.

The fast-loop is the brake. The slow-loop is the map.

Without a fast-loop, the system crashes around every day. Without a slow-loop, the system charges along the wrong map.

### Reproducibility Layer: Eval Harness Makes Results Comparable

The last layer is the easiest to ignore: reproducibility.

You say one prompt version is better. How do you prove it? You say the new model increased pass rate from 72% to 81%. How do you prove it? You say a SKILL reduced hallucination. How do you prove it?

Without seed, model version, prompt snapshot, tool version, KB snapshot, and eval dataset snapshot, your conclusion is hard to reproduce.

You get 81% today and maybe 74% tomorrow. You do not know whether the model version changed, the tool response changed, the KB was updated, the sample was randomly different, or the prompt changed by one small sentence you forgot to record.

At that point, you are not doing engineering. You are doing mystical A/B testing.

A real eval harness records the entire runtime environment: what the input was, what the model was, which prompt version was used, what the tools returned, what the external dependencies were, how the checker judged the result, and where the ground truth came from.

Only then are results comparable. Only when they are comparable does optimization mean anything.

**An improvement that cannot be reproduced is not an improvement. It is luck.**

## Why People Mistake SKILL/KB for Harness

This misconception is natural.

Because SKILL/KB is the easiest thing to show, and the easiest thing to sell.

Open a repo and see a pile of carefully organized markdown, polished prompt templates, and complex agent workflows, and you naturally feel that the system is engineered. It looks like engineering, reads like a specification, and demos more smoothly.

A real harness often does not look good.

Schema validators are not much of a demo. Log snapshots are not much to brag about. Eval datasets are dirty, case reviews are tedious, and writing deterministic checkers feels like labor. You spend two weeks building a gate, and in the end the only thing users see is "this error did not happen."

In software engineering, the most valuable things often make bad things not happen.

But "not happening" is hard to see.

So people naturally flock to prompt engineering. The feedback is fast, the cost is low, the changes are visible, and it is easy to talk about. Change one line in a system prompt today, see the metric rise a few points tomorrow. It feels rewarding.

That is fine.

The mistake is treating it as the destination.

Prompt engineering is the entrance, not the moat. SKILL is packaged experience, not a system boundary. KB is contextual asset, not a correctness guarantee.

**You can start with prompt, but you cannot finish with prompt.**

## What Is a Harness Engineer Actually Building?

So what is a real Harness Engineer building?

Not longer prompts. Not more SKILLs.

The real work is building a structure that puts probabilistic models inside deterministic systems.

That sounds abstract. Split it apart and it becomes concrete:

The model may generate freely, but the output must pass schema. The model may call tools, but tool permissions must be controlled. The model may write code, but the diff must be checkable by tests and static analyzers. The model may summarize documents, but each key conclusion must trace back to source. The model may plan tasks, but high-risk actions must have a deterministic gate or human approval.

The key is not "restricting the model." The key is knowing where the model cannot be trusted.

The default posture of many Agent builders is: the model is smart, so I should let it do more.

The default posture of a Harness Engineer is: the model is smart, so I must know when it will apply that intelligence in the wrong place.

These two postures are worlds apart.

The former expands capability boundaries. The latter defines safety boundaries. Without the latter, the faster the former expands, the more dangerous the system becomes.

## From Input Constraints to an Engineering Loop

I am not against SKILL, KB, or prompt engineering.

Quite the opposite. I think they are necessary. Without a good input constraint layer, an Agent performs terribly, and the gates that follow get flooded by garbage output. If a model has no understanding of the task context, even the strongest checker is just rejecting garbage efficiently.

But necessary does not mean sufficient.

SKILL/KB belongs to the input-constraint layer. This layer brings the model near the right direction and makes the system usable.

A full harness continues from there: the execution layer admits probability, the output layer builds deterministic gates, the feedback layer calibrates against ground truth, and the reproducibility layer makes each optimization comparable.

That is a complete engineering loop.

If a system has only SKILL/KB, with no gate, no eval, no snapshot, and no reproducibility, then at most it is a prompt-augmented agent. It is not a harnessed agent.

This distinction is not wordplay.

It decides whether you are building a demo or building a system.

## Closing: Do Not Mistake the Threshold for the Destination

AI engineering today feels a bit like early Web development.

Someone could write HTML and think they were doing software engineering. Later, people slowly realized that real engineering was not just drawing the page. It also included state management, build systems, testing, monitoring, progressive rollout, rollback, security, performance, and maintainability.

Agents are the same today.

Writing prompts, organizing KBs, and making SKILLs are all important. But that is just drawing the page. The hard part is: when the model produces a wrong output, can you block it? When the metrics get better, can you prove it? When the system drifts after three months in production, can you reconstruct what happened?

Many people are excited about SKILL/KB/prompt engineering. It is easy to mistake input-layer capability for full Harness Engineering.

It is not the same thing.

**A Harness Engineer's job is not to make the model speak better. It is to make the system more trustworthy.**
