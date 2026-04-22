---
title: Why Nature Never Clones Its Best
date: 2026-04-22 01:46:00
lang: en
categories:
  - Independent Thinking
tags:
  - AI
  - Agent
  - Self-Distillation
  - Evolution
  - System Design
i18n_key: why-nature-never-clones-its-best
---

When designing an autonomous evolution system, you'll hit a deceptively simple choice.

Each round, you pick the best sample. But when best hasn't passed yet, what do you do next round?

Option A: use best as the base, evolve all samples from it.
Option B: keep each sample on its own lineage. Best influences nobody.

A feels obvious — stand on the shoulders of giants, why start over? That intuition is wrong, and the cost of being wrong is bigger than you think.

But before tearing A apart, one thing has to be said up front.

## Look at the task shape first

Strategy choice isn't universal. It's task-dependent.

If your task is unimodal — say, a high-dimensional boolean coverage grid where the goal is to flip a bunch of flags to 1 — then A is fine. Unimodal means there's only one direction toward the optimum. "Evolve from current best" is just walking straight uphill. Diversity is waste.

But if your task is multimodal — generating code, writing strategies, designing architecture — then the fitness landscape has multiple basins scattered across it. You don't know which basin contains your current best, and you definitely don't know whether that basin contains the global optimum. In this regime, A is a disaster.

**Step one is always identifying which landscape you're on**. Get this wrong and the rest of the discussion is empty.

Everything below assumes a multimodal task. AI agent evolution, LLM-based systems, open-ended problem solving — these are all multimodal by default. If you're certain your task is unimodal, you can close this post.

## Propagating best is a genetic bottleneck

Copying best to all samples compresses your entire population's gene pool down to one individual. In genetics this is called a genetic bottleneck. In nature, it usually happens at the edge of extinction.

Cheetahs went through a severe one. All living cheetahs today share so much genetic material they're essentially clones, which makes the species catastrophically vulnerable to disease. One epidemic could end them.

This isn't a metaphor. It's a structural isomorphism. When your population gets reset to one individual's genes every generation, you are actively building a cheetah population.

Worse: nature never does this. Even the fittest individuals don't have all-cloned offspring. **Sexual reproduction is itself an anti-best-takes-all mechanism**, forcing recombination to maintain diversity. The evolutionary pressure is simple: environments change. Today's best is tomorrow's worst.

Dinosaurs were the optimum, every moment, for 160 million years.

## Eval noise gets amplified

Set biology aside. Back to engineering.

Best is best because it scored highest under the current eval. But eval can be wrong — it might miss a dimension, capture spurious correlation, or just be noisy.

If eval is noisy, best might just be the most-overrated sample. Copying it to the next generation means you're no longer optimizing the real objective — you're optimizing eval's current proxy.

This is the entry point for Goodhart's Law. When a measure becomes the target, it stops being a good measure.

Recent research on LLM self-distillation makes this concrete. Self-distillation works well on small, homogeneous task sets. But when task coverage broadens — say, switching from chemistry to math — the same compression that helped now hurts the model's ability to recover or adapt to unseen structures.

The mechanism is sharper than it sounds. Self-distillation aggressively removes epistemic markers — tokens like "wait", "hmm", "perhaps", "maybe". These aren't filler. They're functional computational steps the model uses to maintain alternative hypotheses and gradually resolve uncertainty.

Strip them away, and out-of-distribution performance can drop by up to 40%.

Translate this back to evolution: when you use "best for all", best's confidence gets copied to every descendant. The population loses the ability to say "I'm not sure" — and with it, the ability to back out of a wrong direction.

## Independent evolution is the antidote to Goodhart

So the better choice is independent evolution. Each lineage goes its own way. Best influences no one.

It looks inefficient. But it does something best-sharing cannot: **preserve multiple basins as live possibilities**.

The fitness landscape in AI agent evolution is almost certainly multi-modal. You don't know which basin contains your current best, and you definitely don't know whether that basin contains the global optimum. Multiple independent lineages mean you're digging in multiple basins at once. Even if only one strikes gold, the system wins.

This idea has a name in evolutionary algorithms — the island model. Multiple subpopulations evolve in geographic isolation. Sometimes they end up as different species entirely.

But the deeper reason isn't algorithmic. It's epistemological.

If your eval can be wrong (and it will be, only the magnitude varies), then "evolve from current best" hardcodes today's epistemic error into tomorrow. Independent evolution preserves the option for later calibration to **overturn** that judgment. It's not a performance optimization. It's leaving the system a path to take it back.

There's an invariant underneath this that shouldn't be broken: **Centralize feedback, decentralize exploration**.

Centralize feedback — the global best, the archive, eval signals — these are the source of convergence. They must be shared. Decentralize exploration — the actual evolution paths, sampling directions, how each lineage interprets the archive — these are the source of diversity. They must stay independent.

Mix these two up and you pay a heavy price. Centralize exploration, and the system loses its ability to find the global optimum — everyone sprints toward the same local one. Decentralize feedback, and the system loses its ability to converge — every lineage wanders blind.

Every engineering decision below — how to preseed, how to use the archive, how to prune — is a concrete instantiation of this invariant.

## But independent evolution has its own trap

So far this might sound like a free lunch. It isn't.

The biggest trap is **silent homogenization**.

If all your lineages share the same initial prompt, the same base model, the same eval rubric, their "independence" is cosmetic. They get pulled by the same attractors — like birds that look like they're flying independently but are all riding the same wind.

LLM-based agents make this much worse. LLMs have strong mode collapse tendencies. Give the same context, different lineages produce remarkably similar reasoning. What you see as "many lineages" might be one lineage in behavior space.

Even more insidious: you might think you've preserved diversity by varying random seeds. But all outputs still cluster in the base model's high-likelihood region. The Verbalized Sampling paper traces the root cause — LLM mode collapse is fundamentally driven by typicality bias in human preference data. That bias is baked into the base model. Sampling temperature can't undo it.

Independent evolution without other safeguards degrades into "looks independent, actually parallel runs of the same evolution".

## Diversity must be observable

The most counterintuitive thing about independent evolution: **its slowness is visible**.

Any single lineage looks slower than the best-sharing alternative. If you're only watching the best-score curve, you'll keep second-guessing yourself, and eventually drift back to best-sharing.

The only way out is to make diversity a first-class signal. Behavioral distance between lineages, population entropy, basin coverage estimates — these need to sit alongside best score, not below it. "Diversity is rising" must be as visible as "score is rising".

Subtle distinction here: diversity is not randomness.

Adding noise to "preserve diversity" floods your population with low-quality variants and leaves the actual directional space underexplored. That's pseudo-diversity. What matters is **meaningful difference**: different problem-solving strategies, different abstraction levels, different trade-off choices — not perturbed copies of the same solution.

Defining "are these two samples really different?" might be harder than designing eval itself. This is an open engineering problem.

## Pruning needs restraint

Independent evolution will produce many "looks bad but secretly cooking" lineages — low scores early, but on the right path, just slow to bloom.

Aggressive early stopping kills these late bloomers. But how do you tell "actual dead end" from "hasn't paid off yet"? There's no cheap answer.

A workable approach: keep elimination thresholds loose, and add a resurrection mechanism. Paused lineages keep their checkpoints. If later calibration shows their direction was right after all, reactivate them.

The underlying lesson: **don't let valuable old states disappear without you noticing**.

## Inject difference actively, don't wait for it

Not pruning aggressively isn't enough. If the population naturally collapses toward a few similar directions, just keeping them around won't save you.

Island-model and deme-based GA literature has two well-tested mechanisms that drop in cleanly here.

### preseed worst

Periodically replace the worst-performing lineage with a **preset seed** — could come from the historical archive (samples that took different paths but got pruned), or from hand-constructed initial states that explicitly target different basins.

This is **targeted difference injection**. Not random noise — known difference. It echoes the earlier point about pseudo-diversity: anyone can add noise; the hard part is adding noise with direction.

For LLM-based evolution, preseeds could be prompts in different reasoning styles, samples drawn at different temperatures, even outputs from different base models. The point is that the difference between seeds is **structural**, not statistical fluctuation.

### restart worst deme

Wipe the worst-performing deme entirely and restart with random or perturbed state.

This targets a different failure mode: not "this individual is weak" but "this whole direction is dead". When a deme is collectively stuck in a local optimum, keeping it alive is just compute waste — better to free up capacity for fresh exploration.

The cost of restart is visible (you lose generations of accumulated state). The benefit is **compute reallocation**. Under fixed compute, holding space for dead directions denies live directions the chance to get more resources.

### They solve different problems

preseed addresses "not enough diversity". restart addresses "compute locked in dead directions".

preseed without restart: the worst lineage keeps getting reseeded, but total population capacity never frees up — you're watering the wasted direction harder.

restart without preseed: new demes spawn from the same initial distribution, with high probability of hitting the same attractor — you're periodically redoing the same mistake.

Both together form a closed loop: preseed ensures the new blood is actually new, restart ensures it has room to grow.

## What's best for, then?

Naturally, you ask: if best can't be used to reproduce, what's it good for?

First, as a reference signal. Each lineage can see best's score and key features without inheriting its structure. Like the archive in NSGA-II — preserved, not propagated.

Second, as a trigger. If best fails to pass for N rounds, that's the signal that calibration should intervene — maybe the eval criteria themselves need rethinking, not more rounds of evolution.

Third, as diagnostic. When best doesn't pass, analyzing "which dimension is it weak in" matters more than "what does it look like". That gap information feeds back into refining the eval rules.

But this immediately raises a new question: if archive is queryable by lineages, and all lineages see the same archive, doesn't their "independent thinking" still get correlated?

Probably yes.

So should archive become "query on demand" — only consulted when a lineage decides it needs to? Should "when to consult archive" become an evolvable meta-capability? Should different lineages get different archive views?

I don't have answers right now.

## Questions I'm leaving for myself

When I started thinking about this, I assumed "independent evolution vs share best" was a binary switch. It isn't, not even close.

The questions below are ones I'm **deliberately not deciding** — not ones I overlooked. The distinction matters. Deliberate hold means I see this as an open space that needs real running data to converge. Oversight means I didn't see it was a question at all. The first is intentional design. The second is a bug.

The real questions are:

- What does "independent" actually mean? Genetic independence (no shared base)? Informational independence (no shared archive)? Or behavioral independence (not pulled by the same attractors)?
- How do you measure diversity? Not output diff — behavioral distance. But how do you compute behavioral distance?
- When the base model itself has mode collapse tendencies, does lineage-level "independence" mean anything? Or do you have to start with base model diversification?
- Is the role of calibration being underestimated? Under independent evolution, no centralized "pick best to reproduce" decision exists — that authority is delegated to each lineage's local eval. Should calibration now also be responsible for detecting which lineage's local eval has drifted?

No standard answers, and forcing answers without running data would be the wrong move. But one thing's certain: **any moment that feels "simple, just copy best" is Goodhart knocking on the door**.

Evolution isn't optimization. It's preserving possibilities under uncertainty. The moment you trade diversity for efficiency, you win this generation and lose every future one.

Worth it?
