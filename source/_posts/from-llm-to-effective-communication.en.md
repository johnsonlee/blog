---
title: From LLMs to Effective Communication
date: 2026-02-26 00:03:00
categories:
  - Independent Thinking
tags:
  - LLM
  - Communication
  - Independent Thinking
  - AI
  - Education
lang: en
i18n_key: from-llm-to-effective-communication
---

Recently I was explaining how LLMs work to my son and put together a [slide deck](https://llm.johnsonlee.io/). When I got to the context window, I reached for an off-the-cuff example:

> If you tell an AI "recommend me a movie," it can only give you a generic answer. But if you say "I like thrillers, prefer nonlinear narratives, just watched *Mulholland Drive* and want something similar but a bit faster-paced" -- the recommendation will be far more precise.

My son asked: why?

I said: because you gave it more feature dimensions. Its understanding of you went from one-dimensional to multi-dimensional, so it can naturally find a better match within a smaller search space.

The moment I finished that sentence, I paused.

Isn't this exactly the underlying logic of how people communicate with each other?

## LLMs Make Communication Patterns Observable

Communication efficiency between people has always been something vaguely "mystical." Some are naturally articulate; others talk for ages and still leave everyone confused. But few can articulate where exactly the gap lies.

LLMs make this quantifiable.

The more precise and dimensionally rich your prompt, the higher the output quality. This isn't mysticism; it's math -- **more feature dimensions mean a smaller search space, less ambiguity, and higher matching precision.**

Conversely, if you give a vague instruction, the model can only "guess" within an enormous possibility space. If it guesses right, that's luck; if it guesses wrong, you conclude "AI isn't good enough."

But is AI really the problem?

## "Low-Dimensional Communication" Between People

Map this logic onto interpersonal communication and you'll find the root cause of most inefficient communication is exactly the same -- **insufficient information dimensions.**

A common workplace example:

> "This page loads too slowly. Optimize it."

How many dimensions does this sentence have? One -- "slow." The engineer receiving this request immediately has at least ten questions swirling: which page? Under what conditions? How slow? First load or every load? Is there profiling data? What's the target? What's the priority?

Now consider a different phrasing:

> "The product detail page takes over 5 seconds for first contentful paint on a weak network (3G), and the bounce rate is 40% higher than on Wi-Fi. Target: get TTI under 3 seconds on weak networks. P1 priority, due this quarter."

Same underlying request -- "optimize page load" -- but the second version adds at least six dimensions: page, scenario, metric, comparison baseline, target, and priority. The recipient can almost start working without a single follow-up question.

**The difference in communication efficiency is fundamentally a difference in feature dimensions.**

## More Dimensions, Less Ambiguity

The way LLMs process language gives this principle an extremely intuitive explanation.

After tokens enter the model, they're mapped into a high-dimensional vector. A single token in isolation could have countless meanings, but when combined with other tokens in context, each added dimension compresses the possible semantic space once more. Eventually the model can "lock onto" your intent within a sufficiently small range.

The human brain processes information similarly. If you say "book me a meeting room," the other person's mind conjures any room at any time. But say "tomorrow, 2 to 3 pm, 6 people, need screen sharing, preferably near a window" -- each additional constraint shrinks the decision space, and execution accuracy goes up a notch.

This isn't a "communication technique." It's information theory.

## Why Don't Most People Do This?

If multi-dimensional communication is so effective, why do most people still default to one-dimensional expression?

Because providing multi-dimensional information has a cognitive cost.

You first have to think things through in your own head -- which dimensions are critical, which are noise, and what level of granularity is appropriate. This requires completing an "internal modeling" step before you speak, transforming a fuzzy feeling into structured information.

Most people skip this step. Not out of laziness, but because they haven't figured it out themselves.

This is also why "prompt engineering" sounds simple yet so many people still can't write a good prompt -- **it's not that they can't talk to AI; it's that they can't talk to themselves.** You cannot output a structure that doesn't exist in your own mind.

## An Unexpected Takeaway from Teaching LLM Fundamentals

Back to the scene of explaining things to my son.

I originally just wanted him to understand how LLMs work, but as I went on I realized the most valuable part of the lesson wasn't the technical principles themselves -- it was the communication patterns they reveal:

- If you want the other party (human or AI) to understand you accurately, you must provide enough effective dimensions
- Effective dimensions are not a pile of information, but **constraints relevant to the goal that shrink the search space**
- The ceiling of your expressive ability is determined by how deeply you understand your own needs

These patterns are instantly verifiable with an LLM -- tweak the prompt, watch the output change, cause and effect crystal clear. In human-to-human communication, feedback is delayed and fuzzy, making precise attribution nearly impossible.

**An LLM is like a communication laboratory.** It turns "the more precise the expression, the better the understanding" from mysticism into a reproducible experiment.

## What Real Communication Ability Is

Many equate communication ability with eloquence, expressiveness, or even emotional intelligence. Those are all means, not the essence.

**Real communication ability is the capacity to transform fuzzy intent in your mind into multi-dimensional structured information.**

The more deeply you understand your own needs, the more effective dimensions you can extract, the less the other party needs to guess, and the more efficient the communication.

This has nothing to do with whether you're talking to a person or an AI. The physics of information transfer don't change just because the receiver is carbon-based or silicon-based.

So next time communication efficiency is low, don't rush to blame the other party for "poor comprehension."

First ask yourself: how many dimensions did I give?
