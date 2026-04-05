---
title: "From Compiler to LLM: The Recurring Cycle of Software Layering"
date: 2026-02-25 12:28:00
categories:
  - Independent Thinking
tags:
  - AI
  - LLM
  - Software Engineering
  - Architecture
  - Agent
lang: en
i18n_key: from-compiler-to-llm
---

Both call the Claude API to write code, yet Cursor became a product valued at tens of billions while countless "wrapper" apps died in silence. What's the difference?

This question reminded me of a much older analogy.

<!-- more -->

## An Old Story, New Version

Traditional software engineering has a clear dividing line: **on one side, people who build tools; on the other, people who use tools.**

Tool builders write compilers, runtimes, operating systems -- GCC, JVM, LLVM, Linux. Tool users take these to build business software -- Word, Photoshop, Taobao. The two groups need entirely different skills, their career paths barely overlap, and each forms its own ecosystem.

This dividing line held steady for decades.

Now, the AI era is redrawing it. On one side are people training foundation models -- OpenAI, Anthropic, Google, Meta -- doing pretraining, RLHF, inference optimization, requiring large-scale distributed training, data engineering, and alignment research. On the other side are people building products with models -- Cursor, Perplexity, Harvey -- who need Prompt Engineering, RAG, tool orchestration, and product design.

Two groups, two skill sets, two paths. History repeating itself.

## But This Time Is Different

The analogy holds, but the differences are more worth noting.

### The Interface Is No Longer Deterministic

A compiler's behavior is deterministic. Same source code, same compiler options, same output every time. You can build a complete mental model of compiler behavior, write tests, make assertions, calculate complexity. The entire methodology of software engineering -- unit tests, CI/CD, type systems -- rests on this determinism.

An LLM's "interface" is probabilistic. Same prompt, different temperature, or even the same parameters -- the output can differ. You can't make traditional assertions against a probabilistic system. **This isn't an engineering detail you can work around; it changes the very nature of "development."**

When your infrastructure is probabilistic, application-layer engineering is no longer just writing logic and calling APIs -- it's handling uncertainty: validation, fallbacks, retries, constraints. This makes AI application development feel more like collaborating with a smart but not entirely reliable colleague than calling an API with a well-defined contract.

### The Abstraction Layer Iterates Too Fast

C++ standards come out every few years; the JVM has been backward-compatible for decades. Java knowledge you learned in 2005 mostly still works in 2025. The stability of compilers and language standards gave the application layer ample time to accumulate -- accumulate code, best practices, and engineering expertise.

Foundation models turn over every few months. What the last generation couldn't do, the next suddenly can. A complex Prompt Chain you spent three months building might become completely unnecessary after a model upgrade. The RAG Pipeline you carefully designed might be rendered obsolete by a longer Context Window.

**The application layer's moat is much shallower than in traditional software.** Not because application-layer people aren't smart enough, but because the foundation is moving at an unprecedented pace.

### Boundaries Are Dissolving in Both Directions

In the traditional era, you wouldn't expect GCC to build a web application for you. A compiler is a compiler; it stays in its lane.

But LLMs inherently possess "application capability." Raw Claude can analyze financial reports, write code, and do translations. It doesn't need a shell to work. It's as if the JVM itself could understand user needs, generate results, and deliver them directly -- which massively compresses the reason for an "application layer" to exist.

So we see an interesting phenomenon: foundation model companies are building applications upward (ChatGPT, Claude.ai), and application companies are doing model fine-tuning downward. **The boundary isn't solidifying; it's dissolving.**

## Where Is the Moat for AI Applications?

Given an unstable foundation and blurred boundaries, "wrappers" obviously can't survive. But Cursor survived. Perplexity survived. What did they get right?

The answer isn't on a single dimension -- it's a combination at four levels of depth.

### Context Engineering

LLMs are general-purpose, but users' problems are specific. **Whoever provides the model with more precise context builds the better product.**

The first thing Cursor did wasn't writing a better prompt -- it built Codebase Indexing, enabling the model to understand your entire project. This is a pure engineering problem: how to efficiently index code, how to select relevant context, how to pack the most useful information within token limits.

Model vendors won't do this for you, because they don't know what project your user is working on.

### Workflow Orchestration

Good AI applications don't make users change their habits to accommodate AI; they embed AI into users' existing workflows.

Take Cursor again -- it didn't invent a new way of programming. It added AI on top of VS Code. You're still writing code, reviewing diffs, running tests, except now AI handles some of the steps. **The best AI applications are invisible.**

### Output Constraints and Validation

LLMs make mistakes. In a chat window, users can judge for themselves. But mistakes embedded in a workflow can have serious consequences -- buggy generated code, wrong legal advice, miscalculated financial data.

The application layer must constrain and validate LLM output -- type checking, format validation, business rule fallbacks, human confirmation checkpoints. **This is the most direct arena for traditional software engineering expertise.**

### Domain Knowledge Injection

General-purpose models know a little about everything but aren't deep enough in specialized domains. Harvey was able to establish itself in legal not by being a generic LLM wrapper, but by injecting what law firms actually need: specific legal practice workflows, compliance constraints, document format standards. This knowledge either isn't in the model's pretraining data, or it's there but not precise enough.

**Domain knowledge is the most traditional and most durable moat.** Models will upgrade, but your understanding of an industry won't depreciate because of it.

## The Overlooked Middle Layer

Back to the layering analogy at the start. The traditional era wasn't just two layers of "compiler" and "application." There was a critically important middle layer: runtimes, frameworks, build tools, package managers. JVM, Spring, Gradle, Maven. This layer didn't face users directly, but without it, the application layer couldn't operate efficiently.

The AI era is growing its own middle layer: Agent frameworks, MCP (Model Context Protocol), tool-calling protocols, Prompt management systems, evaluation frameworks.

What this layer does is fundamentally the same as traditional runtimes and build tools -- **bridging the gap between non-deterministic infrastructure and deterministic engineering requirements.**

LLM output needs to be validated, constrained, routed to the right tools, and integrated into existing systems. None of this is what the model itself does, nor is it a detail the final application cares about. It needs a middle layer to handle it.

Interestingly, people who've worked on compilers, static analysis, and bytecode manipulation in traditional software engineering have a natural advantage in this layer. Because the core problem is the same: **understanding a system's inputs and outputs, applying constraints and transformations in the middle, and ensuring the final result meets expectations.** The only difference is that in the past you were constraining bytecode; now you're constraining tokens.

## Cycles and Renewal

Software engineering undergoes a layering restructuring every so often. From assembly to high-level languages, from desktop to web, from monolith to microservices -- each restructuring redraws the boundary of "who builds tools and who uses tools."

AI is the latest round. The logic of layering hasn't changed, but the specifics have: the interface shifted from deterministic to probabilistic, iteration speed from years to months, and boundaries from clear to blurred.

In this landscape, the most valuable position may not be at either end -- not training bigger models, not building flashier applications -- but in the middle: **building bridges between probabilistic intelligence and deterministic engineering.**
