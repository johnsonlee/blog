---
title: Long-Term Memory Is Making Agents Dumber
date: 2026-05-20 09:10:55
lang: en
categories:
  - Independent Thinking
tags:
  - AI Agent
  - LLM
  - Memory
  - Software Engineering
i18n_key: faulty-agent-memory
---

The paper title reads almost like bait: *Useful Memories Become Faulty When Continuously Updated by LLMs*.

Here's the experiment that made me stop: GPT-5.4 could solve a set of ARC-AGI puzzles at 100% accuracy. Researchers fed it the correct answers and asked it to consolidate those experiences into long-term memory. After 10 rounds of updates, accuracy dropped to 52.6%.

This isn't a case of failing to learn. It's a case of knowing the answer, then systematically unlearning it through its own memory updates.

<!-- more -->

## Memory consolidation is cloning your best

In my earlier post on [why nature never clones its best](/2026/04/22/why-nature-never-clones-its-best/), the argument was: in a multimodal fitness landscape, copying your current best to every subsequent generation doesn't make the population smarter — it creates a genetic bottleneck and collapses exploration.

Agent memory has the same failure mode.

A raw trajectory isn't an oracle. It's a snapshot of how an agent and environment interacted under a specific set of conditions. Memory isn't the asset itself — it's the impression the environment left behind.

The invariant from that post: **Centralize feedback, decentralize exploration**. Best can inform future runs. It can't become the genome of all future runs.

Consolidated memory is your current best summary. That's the problem. Every time you run consolidation, you're asking a model to select the most reasonable current interpretation of a set of experiences. Then you use that interpretation as the input for the next round. You're not learning from experience anymore — you're learning from the previous summary of experience.

Memory consolidation is just cloning your current best explanation in the space of knowledge.

## We trust summaries too much

The natural design for agent memory goes like this: agent completes a task, produces a trajectory with inputs, reasoning, actions, feedback, successes and failures. LLM summarizes the trajectory into a lesson. Lesson goes into the memory bank. Future similar tasks retrieve relevant lessons.

This feels right because it mirrors how humans work. We don't remember every moment verbatim — we abstract, generalize, build schemas. So the assumption is that agents should do the same, and that building good summaries is building good memory.

In demos, it works. First run fails, write a reflection. Second run uses the reflection, succeeds. Conclusion: memory helps.

But the paper asks a harder question: what if this process keeps going?

## Summaries create epistemic bottlenecks

Many forms of human suffering trace back to this mechanism. Survival strategies from childhood keep running on autopilot decades later. Protective reactions formed in one context become the walls in another. The problem isn't that those strategies were wrong when they formed — they were correct for the conditions that produced them. The problem is that long after those conditions changed, they kept running as if they hadn't.

Agent memory has the same structure. A memory that was correct in the environment where it was generated becomes noise when that environment shifts — and it's still being retrieved to guide behavior.

Cloning best creates a genetic bottleneck. Continuous summarization creates an epistemic bottleneck. Both compress something important. The shared problem isn't the compression itself — it's that it happens too early, too confidently, and with no way back.

WebShop, ALFWorld, AppWorld, ARC-AGI — the strategy spaces here are all multimodal. A successful trajectory doesn't reveal universal rules. A clean summary doesn't mean you've captured actual structure.

**In a multimodal task space, early abstraction is early convergence.**

## Memory isn't an archive — it rewrites history

The paper's critical observation: memory consolidation isn't an append-only log. It's a rewrite.

Each batch of new experiences doesn't get appended to a store. The LLM rewrites the existing memory: merging, generalizing, dropping edge cases, adjusting phrasing, generating new rules. It looks like housekeeping. It's actually history revision.

One rewrite is fine. After ten, fifty, a hundred — boundary conditions from the original experience get smoothed away, useful details get lost, patterns that only held in narrow conditions get encoded as universal rules, and early bad abstractions become the foundation for the next bad abstraction.

Like a photo repeatedly screenshotted, re-uploaded, and re-compressed. Each copy is "basically the same." After enough iterations, you can't make out the faces.

Forgetting is at least an empty slot. A bad memory gives you a confident, wrong answer.

## The most striking finding: useful experiences become bad memories

What makes this paper worth your time is that it doesn't settle for "LLM summarization produces errors." That's trivially true.

The authors controlled for input quality.

They didn't feed failed trajectories to an agent and observe degradation. That's garbage-in-garbage-out — not interesting. They used demonstrated-useful experiences. Then in the ARC-AGI Stream experiment, they went further: they gave the agent ground-truth solutions directly.

Correct answers. Useful experience. Now summarize, please.

100% → 52.6%.

The experience was useful. The consolidation broke it.

This is the lethal finding for anyone building agent systems. We assumed consolidation was at worst neutral — maybe not helpful, but not actively harmful. That assumption is gone.

## Why streaming updates degrade fastest

The paper compares three update modes.

Static-All: see the full trajectory pool, summarize once. Static-Group: group by task type, summarize each group separately. Stream: the realistic production case — update memory each time a new batch arrives.

Stream degrades fastest. The reason is path dependence.

If early memory gets written slightly wrong, every subsequent update is built on top of that error. The model never sees the full history — only "the summary of history." Next round it summarizes the summary. The system isn't learning from experience anymore. It's learning from the ghost of the previous summary.

This is cache corruption. If source data is intact, you can recompute. If source data is gone and only a corrupted cache remains, every downstream module runs on poisoned state indefinitely.

The paper's repeated conclusion: keep raw trajectories. Don't discard them.

## Raw trajectories are independent lineages

In the evolution framing: raw trajectories are independent lineages.

Not all of them are great. Some episodes are clumsy, some failures look stupid, some paths look like noise. But you don't know which future task will turn that "noise" into critical evidence.

That's the value of independent lineages: **they preserve the system's ability to have second thoughts.**

Once you compress all trajectories into a summary, that space is gone. Future agents don't face multiple original experiences — they face a world that's already been interpreted by a previous version of themselves.

We're not constrained by our experiences. We're constrained by our interpretations of our experiences. An agent that "remembers the past" is fine. An agent that carries a pre-baked explanation of the past into every new context — that's where it gets dangerous.

## Raw trajectories aren't waste

In most agent memory designs, raw trajectories are treated like logs: useful for debugging, expensive in production. The real long-term memory is the compressed lesson, rule, skill, workflow.

This paper's simplest baseline: don't summarize. Just use raw trajectories as in-context demonstrations.

It performs surprisingly well. Across WebShop, ALFWorld, AppWorld, the raw trajectory baseline isn't dominated by lesson-style memory — in many cases it's more stable.

The irony: we spend enormous effort getting LLMs to distill experiences into principles, and the raw experiences turn out to be more reliable.

Why? Because raw trajectories preserve context. They contain: the state when this action was taken, what the feedback was, where the failure occurred, what implicit conditions had to hold for the strategy to work.

A lesson leaves one clean sentence. Clean sentences are the most dangerous form of knowledge. They look like principles. They're lossy compressions masquerading as general truths.

## Three failure modes

The paper categorizes faulty memory into three types. I'd put all three on any agent engineering checklist.

### Misgrouping

Placing experiences from structurally different domains into the same bucket because they look textually similar.

LLMs are very good at surface-level pattern matching. Two tasks with similar descriptions might have completely different underlying structures. Summarize them together and you get a rule that appears valid but mixes two incompatible domains.

### Overgeneralization

Taking a locally valid strategy and stripping the boundary conditions.

Original experience: "strategy X works when condition Y holds."
Consolidated memory: "use strategy X."

Next time the agent retrieves this memory near a task boundary, it executes strategy X with full confidence, and fails. The abstraction's value comes from removing noise. The abstraction's risk is removing preconditions. Current LLMs aren't reliably able to tell the difference.

### Overfit

Learning surface patterns from a narrow input stream.

A rule that looks stable across seen samples fails on simple variations within the same task family. This is the same mechanism as overfitting in traditional ML. The difference: previously it happened in model parameters. Now it happens in textual memory that's being explicitly written and retrieved.

## Agents don't lack memory. They lack memory management.

This paper is easy to misread as "don't build agent memory."

That's not the conclusion. Long-running agents can't live in a context window. Raw history grows unboundedly, retrieval costs rise, cross-task transfer requires abstraction. Without memory, an agent is a goldfish — permanently living in the present.

The real problem: don't design memory consolidation as an automatic background task that runs silently after every episode.

Most systems today: task completes → auto-summarize → auto-update → trusted by default. That pipeline is too dangerous.

A more defensible design separates memory into layers.

### Episodic memory is the evidence layer

Preserve original episodes: inputs, actions, feedback, environment state, failure paths. They don't need to be in every prompt. But they must be retrievable. Any abstract memory should be able to link back to the evidence that produced it.

A memory with no traceable evidence is a hallucination incubator.

### Semantic memory is the hypothesis layer

Lessons, rules, workflows, skills — treat these as hypotheses, not facts.

A hypothesis has a scope, a confidence level, a source, and known counterexamples. Not:

> "Check inventory before purchasing."

But:

> "In WebShop-style tasks where item pages expose inventory status, checking before checkout reduces invalid purchases. Source: episodes 12, 18, 31. Counterexample: episode 44, where inventory status had an update delay."

Verbose, yes. More expensive, yes. Reliable systems are expensive.

### Consolidation is an action, not a side effect

This is the same question as "is best still useful in independent evolution?" Yes — but best can't produce all future descendants. Summaries are useful — but they can't replace all evidence.

Agents should be able to choose: Retain, Delete, Consolidate. Not every episode deserves summarization. Not every success deserves abstraction. Not every new experience should rewrite existing memory.

The paper's ARC-AGI Stream results show: when agents can choose their memory actions, they default to retaining raw episodes and use abstract memory sparingly. More extreme: disabling consolidation entirely and doing only episodic management can match or beat the full auto mode.

**When abstraction isn't reliable, less abstraction is a capability.**

## Memory is the new state management problem

The AI agent conversation has mostly focused on planning, tool use, and multi-step reasoning. But if agents are meant to run long-term, memory becomes the new state management problem.

State management is never just "save it somewhere." It includes consistency, versioning, rollback, isolation, expiry, auditing, and access control.

Agent memory needs all of the above. Today, most memory systems are at "summarize experience into text, dump into vector store" — a very smart database with no transactions, no versioning, no audit log. Fine in a demo. Breaks in production.

**Agent memory isn't a knowledge base. It's state that influences behavior.** Anything that influences behavior must be managed as state, not as documents.

## Premature convergence is a design defect

This paper and [Why Nature Never Clones Its Best](/2026/04/22/why-nature-never-clones-its-best/) are making the same argument at different layers.

That post: don't let today's best contaminate the entire future population.
This one: don't let today's summary contaminate the entire future memory.

Both are instances of the same principle: in uncertain, complex, multimodal task spaces, **premature convergence is a systemic risk.**

The paper's most important claim isn't "LLMs can't remember." It's something more uncomfortable: LLMs can take useful experience and encode it as bad memory. This is more dangerous than having no memory at all. No memory means a dumb agent. Bad memory means a confident, wrong one.

So when I look at any agent memory design now, my first question is:

**When this memory goes wrong, how does the system know?**

If the answer is "it doesn't" — that's not memory. That's a contamination source.

Nature never clones its best because today's optimum might be tomorrow's dead end. Agents shouldn't clone their memories either, because today's most reasonable interpretation might be tomorrow's biggest bias.

## References

- [Useful Memories Become Faulty When Continuously Updated by LLMs](https://arxiv.org/pdf/2605.12978)
