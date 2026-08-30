---
title: "Test Cases Are Software's Core Asset"
date: 2026-08-30 22:26:01
lang: en
i18n_key: test-case-is-the-core-asset
categories:
  - Harness Engineering
tags:
  - AI
  - Agentic Coding
  - Graphite
  - Testing
  - Software Engineering
---

Over the past few days, [Graphite](https://github.com/johnsonlee/graphite) merged more than a dozen pull requests. Cross-graph search, large-corpus gates, topology OOMs, query budgets, parallel search, memory, cancellation, and timeouts. Nearly all of them were performance or benchmark work.

At first, this was great fun to watch. Find a slow query, let an Agent locate the hot path, change the implementation, add tests, run the benchmark, and collect a 36x or even 870,000x improvement. Performance work that once took days could now complete a full loop in hours.

But as the PR count rose, the sequence started to look strange. Why did every "optimization complete" need another benchmark PR immediately afterward? Graphite already requires 98% unit-test line coverage across its major modules. What was still going untested?

<!-- more -->

## At first the goal was only to make the query faster

The sequence began with [PR #91](https://github.com/johnsonlee/graphite/pull/91). Production had a broad discovery query that performed fuzzy matching across six properties. The generic path deserialized every node, checked each one, projected and deduplicated the results, and only then applied `LIMIT`. The problem looked straightforward: make that query faster.

The Agent quickly added a mapped-index fast path, then continued the optimization in [PR #95](https://github.com/johnsonlee/graphite/pull/95). On the same Android graph with 5.9 million nodes, broad keyword search became 36x faster. `UNWIND labels(n)` fell from 8.7 seconds to 0.01 milliseconds, an 870,000x improvement.

This loop is addictive. A slow query is the input, a JMH number is the output, and the Agent searches the source code in between. A full scan can become an index lookup. Multi-graph search can gain bounded parallelism. A DATAFLOW query can switch to lazy traversal. One implementation replaces another, and writing code is barely an obstacle anymore.

At the time, the remaining work seemed simple: keep sending the Agent after hot paths.

## Every finish exposed another scenario

The first problem was that the benchmark world was too small. The earlier tests had never run under realistic conditions. They had not even seen ten million nodes. [PR #92](https://github.com/johnsonlee/graphite/pull/92) began replacing the Elasticsearch fixture, which had fewer than one million nodes, with Tika, Hive, and the Kotlin Compiler. It also joined build, save, mapped load, and Cypher query into an end-to-end gate with a 4 GiB heap.

Once the corpora became real, the comparison method stopped looking reliable. [PR #93](https://github.com/johnsonlee/graphite/pull/93) put the base and candidate on the same GitHub runner and reran suspected regressions in reverse order.

The scale was still incomplete. The largest of the three corpora had only 5.9 million nodes, while a real deployment had already reached 80 million. [PR #94](https://github.com/johnsonlee/graphite/pull/94) opened 40 Android-scale graphs at once, taking the logical size past 230 million nodes. The topology query immediately ran out of memory under a 3 GiB heap. Passing several large corpora did not mean multi-graph topology was safe.

By [PR #98](https://github.com/johnsonlee/graphite/pull/98), even "lower latency" needed a new definition. A timed query first had to succeed. Its row count, order, values, and graph provenance had to match the baseline exactly. Otherwise, an early failure, exhausted budget, or partial result could all appear faster than the correct answer.

More cases followed. Parallel search regressed when it used `NCPU`, so it ultimately kept only two workers. Filtered DATAFLOW queries needed their own memory limit. A disconnected client required cancellation. The HTTP server's work budget was eventually replaced with a timeout.

The frustrating part was that most of these optimizations had not lied. Each one really was faster inside its benchmark. Each benchmark simply captured one slice of Production. Change the graph, query, concurrency, cache, heap, or failure mode, and the conclusion could stop holding.

## 98% coverage still had no real-world experience

Graphite requires 98% unit-test line coverage. That number creates a comforting illusion: most of the code has run, so the remaining risk must live in a few edge cases.

This run of PRs broke that illusion. A small graph, one node type, and one query can execute the same lines as Production. Move to tens of millions of nodes, 40 graphs, mixed node types, fuzzy search, concurrent requests, and a constrained heap, and those same lines produce very different system behavior.

The problem was not a shortage of test code. Those tests had only run in a lab. They had never run at Production scale or seen its data distributions and failure modes. Put bluntly, they had not seen the real world.

Coverage answers, "Which lines executed?" A test case must answer a different set of questions. Under which corpus, query shape, concurrency, and resource constraints is a result correct? What is fast enough? What should happen when the system fails?

Test code can keep growing. An Agent is good at adding coverage for a new branch and can write complete JUnit and JMH suites. It cannot infer the next unseen Production scenario from a 98% number.

## Source code answers Test cases ask

Only then did the pattern become clear: these PRs were improving performance while exposing case debt one entry at a time.

The 870,000x number was real. It precisely described one `UNWIND labels(n)` query on a 5.9-million-node fixture switching from a full scan to a metadata fast path. The problem was how easily "this case became 870,000x faster" could be read as "Graphite became 870,000x faster."

**An Agent does not optimize the abstract idea of "the software." It optimizes the given case.** If the case specifies only latency, the Agent searches along that axis. Without a fixed expected result, failure may become the fastest path. Without a Production corpus, the best result on synthetic data may be mistaken for the best result for the product.

This is where source code and test cases begin to have different values. Source code is the current implementation's answer: full scan, index fast path, work budget, or timeout. Any of those can change in the next round. A test case preserves the question and its acceptance criteria: for this corpus and query, inside this resource boundary, what result must the system produce?

Source code is no longer scarce. An Agent can replace an implementation in hours. The missing cases are much harder to recover because nobody has run them, seen them, or made the necessary tradeoffs. That was when the thought landed: **test cases are software's core asset.**

Really?

Turn the question around on Graphite. Delete an implementation but keep the graph model, architecture, and cases, and an Agent can write another version. Delete the cases and keep only the source code, and the Agent can see what the previous implementation did, but not why it must support 80 million nodes, why partial results do not count as success, or which latency and heap limits are product commitments. Source code cannot explain whether an odd branch is a rule, a bug, or an accident.

One version of source code will be replaced by the next. Test cases are not bound to either implementation. They carry constraints learned through real Production costs into the next version. Architecture sets the system's shape. The harness runs the constraints. Test cases preserve what must continue to hold in specific scenarios.

{% post_link agent-tdd-is-self-verification.en 'Does an Agent Really Need TDD?' %} explained how tests and implementation generated by the same Agent from the same vague requirement can share the same misunderstanding. Graphite exposed a more specific version of that problem. Even with plenty of test code, high coverage, and honest benchmarks, an Agent can make a local answer look spectacular when the cases do not cover reality.

## Test Code Can Drift with the Implementation

By [PR #104](https://github.com/johnsonlee/graphite/pull/104), the problem had moved one layer deeper. The PR also left Production code untouched. It did one thing: stop a pull request from weakening its own benchmark gate.

The corpus set must match exactly. Missing, duplicate, invalid, or drifting data all fail closed. Comparator, fixture, and workload configuration come from the PR's base SHA. CODEOWNERS then protects the files that maintain the gate. If an Agent can change the implementation, benchmark, and passing criteria together, a green check has no authority.

The "test case" in the title is therefore not a particular `*Test.kt` file. JUnit, JMH, runners, and GitHub Actions are implementations too, and an Agent can rewrite all of them. The question itself must not drift with the PR: which corpora to use, which queries to run, what result to expect, how much time and memory are allowed, and which Production observation supplied those answers.

Graphite's bytecode graph keeps the same kind of ledger. Eighty Java fixtures are compiled and converted into graphs, then compared with a baseline of more than 11,000 stable facts. New graph facts may appear, but not one old fact may disappear. That baseline still protects only the 80 fixtures it has seen. It cannot make promises for bytecode and queries outside them.

The case set can never be finished in one pass. Each time Production exposes another scenario, the input, expected behavior, resource boundary, and provenance must be recorded. Only then does the ledger move closer to the product itself.

The argument works for Graphite. Disproving it requires one kind of software that an AI can rewrite from existing code without preparing extra cases.

## A Compiler May Be the Only Counterexample

The world already contains an enormous amount of source code. Feed it to old and new compilers, and the ability to compile, emitted diagnostics, and behavior of the resulting program all provide ready-made verification signals. There is no need to design fresh input specifically for the rewrite. Existing codebases are the test cases. **Code is test case.**

But this code is not the compiler's own source. It is the source code being compiled. The former can still be replaced entirely by an AI. The latter is the input corpus that tells the new compiler which behaviors it must preserve.

The compiler counterexample does not overturn the conclusion. It clarifies the boundary. A compiler needs almost no additional cases because the software ecosystem's accumulated source code already serves as its case set. Most software has no such advantage. When Graphite rejects a query, neither the old implementation nor external code can decide whether the rejection is resource policy or a bug. When a result shrinks, they cannot decide whether it was optimized or truncated. Only after someone makes that judgment in a real scenario and records the corpus, expected result, and resource boundary does it become a case for the next implementation.

## Source Code Is Not the SaaS Moat

Looking back at these Graphite PRs, the 36x and 870,000x improvements grabbed attention first. [PR #92](https://github.com/johnsonlee/graphite/pull/92) and [PR #104](https://github.com/johnsonlee/graphite/pull/104) matter more now. The former brought real corpora into the test loop. The latter stopped the judge from moving with the contestant.

Even then, Tika, Hive, and the Kotlin Compiler are only three fixed corpora. The largest has 5.9 million nodes, an order of magnitude below the 80-million-node deployment. The tests have begun to approach reality, but they are nowhere near complete.

Over the past year, capital markets have been reassessing SaaS. [Morgan Stanley](https://www.morganstanley.com/im/publication/insights/articles/article_thesoftwareselloff_ltr.pdf) called it a historic correction in software valuations: several quarters of declines erased roughly $2 trillion in market capitalization. The concern is direct. Will AI break the traditional SaaS business model?

Claude Code made that concern concrete. It became publicly available in May 2025 and [reached $1 billion in run-rate revenue within six months](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone). Product adoption and revenue have proven the value of AI coding. If code can be generated at scale, can a SaaS product be copied in a few months?

[Anthropic's analysis of roughly 400,000 Claude Code sessions](https://www.anthropic.com/research/claude-code-expertise) found the same boundary. People made most of the decisions about what to do, while Claude made most of the decisions about how to do it. Users with more domain expertise succeeded more often. In these Graphite PRs, source code is the "how." Test cases define what counts as correct.

AI can already generate code and add plenty of test code around an existing implementation. It still cannot invent the Production cases that a mature SaaS product accumulated over years: which dirty data must remain compatible, which permission combination must never cross a boundary, whether a failure should retry or stop immediately, and which apparently redundant branch carries a customer promise. These cases did not grow naturally from source code. They came from releases, incidents, complaints, and postmortems.

That is the SaaS moat. Source code can be generated again. The hard-earned lessons cannot. Without test cases, an AI copies only the feature list. To reproduce mature software in a short time, it still has to relearn every painful lesson the previous product already paid for.
