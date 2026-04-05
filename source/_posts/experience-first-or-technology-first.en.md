---
title: Experience-First or Technology-First?
date: 2026-03-19 08:20:00
categories:
  - Independent Thinking
tags:
  - AI
  - Product Strategy
  - Copilot
  - Google
  - Technology
lang: en
i18n_key: experience-first-or-technology-first
---

Steve Jobs has a quote that has been cited countless times:

> Start with the customer experience and work backwards to the technology.

For the past 20 years, this was practically gospel for product building. Whoever understood users best, won. Technology was the means; experience was the end.

But what if this quote is wrong in the AI era?

The AI coding tool market in early 2026 offers a disturbing counterexample: the product with the most polished interaction design is being beaten by a terminal interface. GitHub Copilot -- the pioneer of inline suggestions, the paragon of experience refinement -- scored only 9% as "most loved" among developers. Claude Code, a command-line tool without even a GUI, scored 46%.

This is not a fluke. Behind it lies a reversal in the win rates of two product-building philosophies in the AI era.

## Two Philosophies

Let's make them explicit:

**Experience-first**: Define what experience users want first, then find the technology to deliver it. Product managers define requirements; engineers deliver. iPhone, Slack, and Notion are all winners of this playbook.

**Technology-first**: Push the core technology to its limits first, then see what experiences that capability can support. Researchers define the boundary of what's possible; product teams find the optimal form within that boundary.

In the consumer internet era, experience-first was the overwhelmingly correct strategy. The underlying technology was already highly mature and commoditized -- the capability boundaries of cloud computing, databases, and frontend frameworks were known and stable. Differentiation came almost entirely from the experience layer. Slack and HipChat had no fundamental difference in their tech stacks, but Slack's experience won.

AI broke that premise.

## Why AI Upended the Priority

In traditional software, you could design a perfect interaction first and be confident your engineering team could build it -- because the underlying capability boundary was known and stable. Once the PM finished the wireframe, the engineers could definitely deliver it.

AI products don't work this way. Model capabilities shift nonlinearly every three to six months. Whole-repo reasoning that was impossible last quarter suddenly works this quarter. Multi-step refactoring that required human intervention last month can be completed by the model on its own this month.

**The capability boundary of AI products is not determined by product design, but by model capability.**

This means experience is a function of model capability, not the other way around. Push the model to world-class first, and the design space at the experience layer naturally opens up. Conversely, design a flashy experience first and expect the model to fit it -- you've locked yourself into a capability assumption that may soon be obsolete.

## Copilot: A Casualty of Experience-First

Tracing Copilot's timeline, the fingerprints of experience-first thinking are unmistakable.

In 2021, the product team defined the experience first: developers typing code in their editor, AI providing real-time inline suggestions. No interruption to flow, tab to accept, naturally integrated into the editor. Nearly flawless at the experience level.

Then they went looking for technology to deliver it -- Codex, with a tiny context window that could only see a few dozen lines around the cursor. This technical constraint was absorbed by the product design: users only need line-level suggestions anyway, no need for the AI to understand the entire codebase.

In 2024-2025, model capabilities leapt forward. Million-token context windows, multi-step reasoning, tool use. The experience forms these capabilities support far exceed the "inline suggestion" framework. Cursor introduced Composer mode and full-repo indexing. Claude Code went further -- abandoning the editor-centric assumption entirely, letting AI autonomously execute multi-step workflows in the terminal.

And Copilot? Its experience framework was designed around Codex-era capabilities. After model capabilities leapt forward, that framework became a ceiling. The subsequent Agent Mode, Workspace, and Chat were all patches on the old framework -- not a reimagination of what experience should look like, starting from the new model capabilities.

**You designed the optimal experience for the capabilities at time T0, but that optimal experience becomes a constraint at T1.** And the organizational structure, code architecture, and user mental models have all solidified around the T0 design, making it impossible to jump to the T1 optimum.

What makes it trickier is that the Copilot team wasn't blind to model capabilities advancing -- they saw it clearly. But the inertia of experience-first thinking meant their response was "stuff new capabilities into the old experience framework" rather than "redesign the experience starting from the new capabilities." The former is continuous improvement; the latter is a discontinuous leap. Large organizations almost always choose the former.

## Google: The Technology-First Comeback

Google's AI turnaround is the opposite case.

In early 2024, Google exhibited the same symptoms as Copilot -- fragmented organizational intent, product teams and model teams separated by org walls, and Bard giving advice that told users to eat rocks. They fell so far behind that Sundar Pichai's job security was publicly questioned.

Pichai did one crucial thing: **he shifted decision-making power from the product side to the model side.**

DeepMind was consolidated as Google's "engine room" -- developing core AI technology, then distributing it to product lines across the company. The Gemini App team was moved from the Knowledge & Information division under DeepMind. A competitor AI lab summarized Google's strategic pivot this way:

> They went back to the technology stack itself, got it to world-class first, and then considered what experiences it could support -- rather than the other way around. Not trying to build some flashy experience and then making the technology fit.

It wasn't the Search team telling DeepMind "we need a model that can answer user questions." It was DeepMind building Gemini 3, the Search team seeing what the model could do, and redesigning AI Mode, AI Overviews, and Deep Research accordingly.

NotebookLM is a prime example. This product didn't come from some PM drawing a wireframe saying "users need to turn documents into podcasts." It emerged when the model team, exploring long context + audio generation capabilities, discovered that "you can feed a million tokens of documents to the model and generate natural conversation." The product team then built Audio Overviews around that capability.

Capability first, experience second.

The result: by late 2025, Google's stock had risen 56%, its market cap surpassed Microsoft's, Gemini 3 topped LMArena, and Sam Altman wrote in an internal memo to "expect the external narrative to be tough for a while."

## The Real Criterion

So when should you go experience-first, and when technology-first?

The answer isn't "which is superior" -- it's **the predictability of the capability boundary**.

When the capability boundary is predictable, optimize for experience. Building a mobile app in 2015, the capability boundaries of the underlying stack (iOS SDK, REST API, SQLite) were clear and stable. You knew precisely what was possible, what wasn't, and roughly where the boundary would be in six months. The capability boundary was a constant; experience design was the variable; victory depended on who optimized the variable better.

When the capability boundary is unpredictable, chase the boundary. Building an AI coding tool in 2025, model capability boundaries shift nonlinearly every three to six months. Anchoring your experience design to the current capability boundary is betting that the boundary won't move. Push model capabilities to the limit, and the design space at the experience layer naturally opens up.

This also explains why Claude Code's terminal interface is not a weakness but a strength -- it's not locked into an experience framework. Every time model capabilities improve, value flows directly to users with no interaction layer to redesign in between. Copilot's polished experience actually became an obstacle -- every model leap requires re-adapting the extension API, the inline suggestion interaction paradigm, and VS Code's UI constraints.

A rough formula:

> **ROI of experience investment = stability of the capability boundary x space for experience differentiation**

The more stable the capability boundary, the higher the ROI of experience investment. The more volatile the capability boundary, the more likely experience investment becomes a sunk cost.

## Success Is the Greatest Enemy of Recognizing the Inflection Point

These two philosophies are not permanently opposed. An inflection point exists between them, and **recognizing that inflection point is itself the highest-order strategic judgment**.

In the early years after iPhone launched, the core competitive advantage was the touchscreen interaction paradigm itself -- defined by technological capability (capacitive screen + multi-touch). Technology-first was correct. But as iPhone matured, hardware differences narrowed, and competition shifted to ecosystem, services, and brand. Experience-first reclaimed its throne.

AI coding tools are currently in the "iPhone 2007" phase. Model capabilities leap every six months, each leap redefining the possible experience landscape. Betting on a fixed experience in this phase is a structural error.

But the difficulty of recognizing the inflection point is this: **success obscures the signal.** Copilot's inline suggestions were successful in 2022-2023 -- user growth was rapid, market feedback was positive. Success convinced the organization that the current paradigm was correct, causing them to miss the signal that a paradigm shift was needed. Google, precisely because of failure -- the Bard disaster, the market cap questions -- was forced to reexamine its paradigm assumptions.

The same logic applies to today's technology-first winners. Once model capabilities enter a steady state -- if that day comes -- value competition will shift back to the experience layer. At that point, today's technology-first winners will need to switch rapidly to experience-first, or be overtaken by newcomers who are better at crafting experiences. And their success will become the greatest obstacle to recognizing that reverse inflection point.

So the ultimate question is not experience-first or technology-first.

**It's: do you have the ability to switch at the right moment?**
