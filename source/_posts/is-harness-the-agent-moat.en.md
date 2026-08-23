---
title: "Is the Harness an Agent's Moat?"
date: 2026-08-23 21:16:24
lang: en
i18n_key: is-harness-the-agent-moat
categories:
  - Harness Engineering
tags:
  - AI
  - Agent
  - Agentic Coding
  - Codex
  - Software Engineering
---

Over the past year, the Agent industry has settled on a working consensus: models will commoditize, while the harness will remain the moat.

There is plenty of evidence for that view. The same model can produce very different results depending on its context management, tool routing, memory, subagents, sandbox, and approval flow. [One result published by OpenAI](https://developers.openai.com/blog/codex-as-a-platform) is unusually clear: on ARC-AGI-3, retained reasoning state and context compaction raised GPT-5.6 Sol's score from 13.3% to 38.3% while cutting output tokens sixfold.

If the harness creates that much difference, it looks like the layer an Agent team should invest in most heavily and be least willing to hand to a vendor. Yet just as Harness Engineering is becoming a discipline, vendors are packaging the harness as an SDK.

<!-- more -->

## Why Did the Harness Look Like a Moat?

Early model APIs handled one input and one output. To make a model work continuously, teams had to add planners, tool loops, task queues, retries, context summaries, sandboxes, approvals, and audit logs. The model determined what one step could do. The harness determined whether that capability survived a long task.

That gap explains the rise of Harness Engineering. Prompts were easy to copy, models could be swapped, and the execution system around the model looked more like durable product work. The team that could keep an Agent on track for dozens of steps had the better Agent.

The problem lies in the word "moat." The importance of a harness is an engineering fact. Its resistance to substitution is a business judgment. Those are different claims.

The first wave of Agent SDKs already made agent definitions, model calls, tools, handoffs, run history, and tracing library responsibilities. The [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents/quickstart) starts with define and run, then adds tools and specialist agents. Developers still design the Agent without reimplementing every orchestration primitive.

After showing how much the harness can change results, [Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform) calls the agent loop the reusable part. Conversation state, streaming execution, tool use, sandboxing, approval policy, and work across turns are exposed through the [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) and [app-server](https://learn.chatgpt.com/docs/app-server). Anthropic likewise puts the Claude Code loop, context management, hooks, subagents, MCP, permissions, and sessions into the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview).

Platforms are turning an important capability into a standard component. That creates the first contradiction: **if another team can get the same loop through an SDK, is the loop still a moat?**

## What Will SDKs Replace First?

A replacement test reveals how much value remains in an in-house harness. Swap the planner, tool loop, retries, context compaction, sandbox, and approval flow for Codex SDK or Claude Agent SDK, then inspect what the product loses.

If the system collapses to a few prompts, tool wrappers, and session records, most of the investment filled a runtime gap. Once the platform fills that gap, the team is left chasing generic mechanisms that the vendor will keep upgrading.

If workflow state, business tools, permission semantics, artifact contracts, and acceptance rules remain, the product does not disappear with the loop. OpenAI draws a similar boundary: the harness can be reused, while the application continues to own its interface, context and tools, and operational boundaries.

There is a useful rule here. If a capability is reusable across companies, vendors have an incentive to put it into an SDK. Planner continuation, context compaction, tool-call recovery, and sandbox isolation all have general solutions. A company may still implement them, but code living in its own repository does not automatically create differentiation.

The first generation of Agent teams is splitting along this boundary. Teams that maintain a generic loop are being squeezed by platforms. Teams that move into workflow and business semantics still have work worth owning. Teams that move into evals and ground truth appear to be furthest from substitution.

But if the SDK boundary keeps moving upward, will evaluation be next?

## Will the Verification Loop Become an SDK Too?

That transition has already started. [OpenAI Agent Evals](https://developers.openai.com/api/docs/guides/agent-evals) connects traces, graders, datasets, and eval runs in one product surface. Traces record model calls, tool calls, guardrails, and handoffs. Graders score behavior. Datasets and eval runs make versions repeatably comparable. Even automatic prompt improvement from a dataset is now part of [Prompt Optimizer](https://developers.openai.com/api/docs/guides/prompt-optimizer).

[LangChain AgentEvals](https://docs.langchain.com/oss/python/langchain/test/evals) makes the direction even clearer. Agent trajectories can be evaluated with deterministic matching or an LLM judge. A team no longer has to build every trace collector, experiment runner, comparison dashboard, and common evaluator from scratch.

Soon, saying "we have evals" will be too imprecise to mean much. Evaluation contains at least two distinct jobs:

- The evaluation mechanism: collecting traces, running graders, comparing versions, and detecting regressions.
- The source of correctness: deciding which cases are representative, what output is acceptable, which error is most expensive, and what evidence closes the task.

The first job is becoming an SDK. The second has no generic answer.

A platform can record the tool-call trace for `refund_order`, but it does not know which orders may be refunded. It can provide a trajectory grader for a coding Agent, but it does not know whether a migration preserved a company's compatibility promise. It can generate adversarial cases, but it does not know which historical incident must remain in the regression suite forever.

**The machinery of verification will commoditize. The authority to define "correct" will not.**

## Is Ground Truth Just a Dataset?

Moving the moat to an eval dataset is still too shallow. A static dataset becomes stale, can be adapted to, and cannot cover new failure modes that emerge in production. The difficult asset is a company's process for continuously producing ground truth:

> Real task → Production outcome → Failure attribution → Expert judgment → Ground truth → Regression gate → Next production outcome

The chain begins with real consequences in a business system. Whether a refund caused a loss, an incident recurred, a migration introduced a compatibility bug, or a pull request triggered a rollback is visible only to the company running the workflow.

Expert judgment cannot be outsourced either. When two outputs both look plausible, a domain expert decides which one satisfies the company's architecture constraints, risk tolerance, and service commitments. That judgment then becomes a fixture, golden output, schema, grader, test, or artifact contract. This follows the argument in {% post_link ground-truth-core-competency-of-ai-engineering.en 'Ground Truth: The Most Underrated Competitive Edge in the AI Era' %}. It also explains why {% post_link agent-tdd-is-self-verification.en 'Does an Agent Really Need TDD?' %} ultimately depends on external verification instead of letting an Agent declare its own work complete.

Eval frameworks can be bought. Graders can be generated. Case mining will become more automated. A company still needs access to real outcomes, authority over the cost of errors, and the ability to turn one failure into a lasting constraint. Together, those capabilities form a ground-truth production system.

## Where Is the Boundary of Harness Engineering?

At this point, "the harness is the Agent's moat" no longer has a simple yes-or-no answer.

If the harness means everything outside the model, it can absorb workflow, evaluation, and ground truth by definition, so it will always look important. That definition does not help a team decide whether to write the next line of code or leave it to an SDK.

The more useful boundary is whether a capability can be standardized:

| Capability in the harness | What will become an SDK | What the company must retain |
| --- | --- | --- |
| Execution | Planner, loop, retries, context, sandbox, approvals | Workflow state, business semantics, side-effect boundaries |
| Observation | Traces, artifact capture, failure clustering | Which behavior matters and how long evidence must be retained |
| Evaluation | Grader runtime, dataset runner, version comparison | Representative cases, rubrics, thresholds, cost of errors |
| Optimization | Prompt optimizer, model router, automated regression | Business objective, acceptable tradeoffs, final release responsibility |

Every advance in the middle column moves the Build / Buy boundary to the right. Harness Engineering must keep finding that boundary and place engineering effort where a vendor still cannot define the answer.

## Is the Harness an Agent's Moat?

The harness is critical to Agent performance, but importance does not create a moat. Agent SDKs are followed by loop SDKs. Eval and verification loops are next. Any component that can be described as a reusable mechanism will eventually be absorbed by a platform.

Before a team builds another harness layer, it can ask what would remain if a vendor shipped the same capability next month. If the answer is a planner, trace collector, or grader runner, the advantage will not last long. If the answer is production outcomes, expert judgments, business constraints, and a feedback loop that turns failures into regression gates, the asset will survive the next SDK release.

**Reusable harness mechanisms will keep commoditizing. The durable moat is a company's ability to keep turning business reality into ground truth.**
