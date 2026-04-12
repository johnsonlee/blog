---
title: "One Eval Function, 3.8 Billion Years"
date: 2026-04-12 11:06:00
categories: 
  - Independent Thinking
tags:
  - AI
  - Evolution
  - Self-Evolution
  - Eval Function
  - Biology
---

3.8 billion years ago, the first self-replicating molecule appeared on Earth. Today, we're trying to make AI evolve on its own.

Between these two efforts lies a profoundly underestimated question: **what should the eval function be?**

<!-- more -->

## Carbon-Based Life Has One Eval

Biological evolution has no benchmark suite, no leaderboard, no human preference score. It has exactly one criterion—

Alive, or dead.

This eval is brutally simple: binary signal, zero ambiguity, no labeled data needed, no reward shaping required. If you survive, your genes earn a ticket to the next round. If you don't—no matter how elegant or sophisticated you were—you're erased from the gene pool.

In 3.8 billion years, this function has never changed.

## Complexity Is Not the Goal

If the eval never changes, why did biology become so complex?

Because **the environment does**.

Cyanobacteria survived through photosynthesis—until the oxygen they produced became poison. Single cells were sufficient—until multicellular organisms could devour you. Eyes were unnecessary—until predators with eyes appeared above your head.

**An unchanging eval + a constantly shifting environment = strategy space forced to expand without limit.**

Complexity isn't evolution's goal. It's a byproduct of surviving in a non-stationary environment. Cyanobacteria are still alive today—simplicity works too, as long as your niche isn't squeezed out.

## Complexity Is Evolution's Signature

Follow this logic further, and it hits an unexpected corollary: **complexity itself is indirect proof of evolution.**

The traditional case for evolution is inductive—fossil records, genome comparisons, species distribution, mountains of evidence building toward a conclusion. But the chain above is deductive:

Premise one: the eval function is survival (binary, unchanging).
Premise two: the environment is non-stationary.

Conclusion: complexity must emerge.

No designer needed, because this structure generates complexity on its own.

Critics of evolution often ask: "How could something this complex exist without a designer?"

**The question is backwards. Something this complex is precisely what couldn't have a designer.**

Designers have goals. Goals impose direction. Direction prunes. Every complexity in a human-designed system—chips, software, architecture—exists for a reason, pointing toward some intent. Biological complexity is unpruned. The appendix, wisdom teeth, retrotransposons—genomes are littered with purposeless remnants.

**Purposeful complexity is the signature of design. Purposeless complexity is the signature of evolution.**

Life on Earth is covered in the latter.

## AI's Eval Anxiety

Now look at the AI side.

How many evals have we built? MMLU, HumanEval, MT-Bench, Arena ELO, SWE-bench… Every few months a new benchmark is proposed, then quickly saturated, gamed, and questioned.

The contrast is striking: **carbon-based life has run one eval for 3.8 billion years. Silicon-based systems have run a thousand and still haven't achieved autonomous evolution.**

What's going wrong?

Benchmarks are designed by humans. They measure what humans think matters. But evolution isn't about passing tests—it's about surviving in an environment. Tests can be gamed—teaching to the test, data contamination, overfitting. Survival cannot.

## The Right to Self-Edit

Biological evolution solved another critical problem: **who modifies the system?**

Carbon-based life's answer: the system modifies itself. Mutations are random. Recombination is random. Horizontal gene transfer is random. Natural selection doesn't design solutions—it only decides which modifications survive.

Design and selection, fully decoupled.

AI's "evolution" is stuck here. Most AI iteration is done by humans—tuning prompts, designing rewards, choosing which checkpoint to deploy. This isn't evolution. It's breeding.

What about autoresearch? Letting LLMs generate hypotheses, design experiments, iterate on improvements—isn't that the system editing its own genes? Add LLM-as-judge on top—letting the model evaluate its own outputs—and selection is handed over too.

It looks close to autonomous evolution. But carbon-based life has never once made this mistake in 3.8 billion years: **letting the gene editor and the selector be the same entity.**

Mutations are blind. The environment is indifferent. Neither knows the other exists. It's precisely this unintentional decoupling that generates true diversity. Autoresearch + LLM-as-judge re-couples design and selection—the system edits its own genes, then grades its own homework. The strategy space collapses to the model's own cognitive boundary.

**This isn't autonomous evolution. It's self-circulation.**

True autonomous evolution means the system has the right to modify itself, but the environment that judges those modifications must be independent of the system.

This raises a pointed question: can we hand "self-modification" to AI while still ensuring that "selection" remains independent?

## Time Is the Only Judge

The most overlooked dimension of evolution is time.

Not point-in-time evaluation—run a benchmark, get a score, rank on a leaderboard. But cumulative evaluation—how long can you survive in a continuously changing environment?

Cyanobacteria's strategy is hardly sophisticated, but it has survived for 3.5 billion years. Dinosaurs were spectacularly successful, yet 160 million years of accumulation went to zero when the environment shifted violently.

**Time doesn't judge how smart you are. It only judges whether you can keep being alive.**

AI systems have no such dimension. Models have no concept of "being alive"—they're trained, deployed, replaced. A model doesn't need to survive; the next version can always take its place. This makes AI evolution more Lamarckian—each generation deliberately designed by humans—than Darwinian.

## Finding Silicon's Survival

If carbon-based life's eval is survival, what's the silicon equivalent?

Not "passing more benchmarks." Not "achieving higher Arena ELO." These are point-in-time metrics, not survival signals.

Perhaps the closer answer is: **being continuously needed**.

An AI system that keeps solving real problems in its environment won't be replaced—that's its "survival." Not physical survival, but functional indispensability.

And "being continuously needed" shares the same structural properties as "being alive":

- Simple enough to need no human-defined metrics
- Inherently temporal—not a one-shot evaluation
- The environment changes, so strategy must evolve

## Carbon and Silicon, Side by Side

Put the two threads together:

| | Carbon | Silicon |
|---|---|---|
| Eval function | Survival | Being continuously needed |
| Source of complexity | Unchanging eval + changing environment | Isomorphic |
| Self-editing | Mutation + recombination + natural selection | Design and selection still coupled |
| Role of time | The only judge | Nearly absent |

**Carbon-based evolution proved one thing over 3.8 billion years: you don't need to design intelligence. You just need a good enough eval function and enough time.**

This might be the most important lesson for silicon-based autonomous evolution—not to design smarter systems, but to find the unchanging eval and give it time.

But silicon has one option carbon never had: it can choose its own eval function.

Is that an advantage—or a curse?
