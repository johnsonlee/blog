---
title: "Do Agents Still Need to Be Built In-House?"
date: 2026-08-23 21:16:24
lang: en
i18n_key: agent-loop-is-not-the-moat
categories:
  - Harness Engineering
tags:
  - AI
  - Agent
  - Agentic Coding
  - Codex
  - Software Engineering
---

Put an Agent project's backlog from a year ago next to the Codex SDK today, and the comparison is awkward.

Teams used to build their own planner, tool loop, task queue, retries, context summaries, sandbox, and approval flow. OpenAI now packages the Codex harness as an SDK and app-server. Anthropic has done the same with the Claude Code agent loop. An execution layer that once occupied a team is becoming a few lines of initialization code.

Should the first wave of in-house Agent teams shut down?

<!-- more -->

## What Is Left to Build When the SDK Runs the Loop?

The most direct Build / Buy answer appears to be: shut them down.

Early in-house Agents got much of their value from the runtime. Models did not work continuously, so teams wrote loops. Unstable tool calls needed schemas, retries, and recovery. Context overflow required summaries. Execution could cross boundaries, so teams added sandboxes, approvals, and audit logs. That work made sense because companies could not buy it.

Now they can. The [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) can start, continue, and resume Codex threads from application code. [Codex app-server](https://learn.chatgpt.com/docs/app-server) adds authentication, conversation history, approvals, and streamed agent events for deeper integrations. The conversation state, streaming execution, tools, sandboxing, approval policy, and work across turns described in [Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform) look a lot like the runtime backlog of an early Agent team.

Anthropic is packaging the same layer. The [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) exposes the Claude Code agent loop, context management, tools, hooks, subagents, MCP, permissions, and sessions as Python and TypeScript libraries. Call the model API directly and the developer implements the tool loop. Use the Agent SDK and the library runs it.

If a team still spends most of its time designing planners, chaining tool calls, continuing sessions, or pausing and resuming approvals, it is duplicating platform work. Most companies should no longer build this layer from scratch unless the runtime itself is their product.

At this point, the case against building in-house looks complete. But it cannot explain one observation: if a generic loop is becoming easy to obtain, why are the Agents from GitHub, Cursor, and Devin still different products?

## If They Can All Run, Why Do Their Results Differ?

[GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) lives inside a GitHub workflow. It receives work from an issue or PR comment, then uses a GitHub Actions environment to read the repository, create a plan, open a branch, run tests and linters, write commits, open a pull request, and hand control to review. The model's ability to call tools is only the beginning of that chain.

[Cursor Cloud Agents](https://cursor.com/docs/cloud-agent) run in isolated VMs and connect to team-configured MCP servers and hooks. They return pull requests, screenshots, videos, logs, and a remote desktop a person can take over. This covers more than keeping an Agent running. It defines how a person takes control, reviews the change, and inspects the evidence.

[Devin](https://devin.ai/) brings together multi-repo work, code migration, incident triage, Slack, Datadog, Linear, tribal knowledge, and automations. Cognition emphasizes that Devin works in a team's existing codebases and tools because companies are not buying an abstract loop. They are buying an executor that can enter an existing engineering process.

If the loop were the whole Agent product, these differences should not exist. The products use similar foundations, yet their value lands in different places: where tasks enter, what the Agent can see, which actions require approval, what artifact comes back, and who accepts the result.

The original question now needs its first revision. SDKs are commoditizing how a model keeps running. Companies still have to decide what work it runs inside. The first problem belongs to the runtime. The second belongs to the workflow.

Where is the boundary between them? A replacement test is more useful than an architecture debate.

## Remove the In-House Loop. What Survives?

Replace the in-house coding loop with Codex SDK or Claude Agent SDK. If the task sits entirely inside a standard engineering workflow, try a hosted option such as GitHub Copilot cloud agent or Cursor Cloud Agents. Then inspect what remains.

If the project collapses to a few prompts, tool wrappers, and session records, it was filling a runtime gap. Once platforms fill that gap, the project's value shrinks. Further investment means asking an internal team to chase generic capabilities that vendors update every month.

If the system still has a business state machine, permission boundaries, MCP tools, approval policies, eval datasets, golden outputs, artifact schemas, trace graders, cost routers, and contracts for writing back to systems of record, the answer changes. Those assets survive the loop. Every model and runtime still needs them.

This test also explains where the first Agent teams went. Teams maintaining generic planners, memory, retries, sandboxes, and queues are being squeezed. Teams that own the state machine for a ticket, incident, contract, release, or invoice are becoming workflow teams. Teams that encode "done correctly" as datasets, schemas, graders, and tests are building ground truth.

The question has narrowed again: if an SDK does not replace every in-house asset, **which assets must the company own?**

## The Build Boundary Is Not the Code Boundary

OpenAI assigns the application responsibility for the interface, context and tools, and operational boundaries. Codex can run the harness loop, but it does not know how a company defines "this order can be refunded," "the incident is resolved," or "this pull request can merge." Those judgments do not arrive with the SDK.

Consider a `refund_order` tool. To the runtime, it is a tool call. To the business system, it includes operator permissions, refund limits, order state, risk rules, audit records, and compensation after failure. A company can let an SDK make the call. It cannot let the SDK guess those semantics. The company must define its tool and data access layer.

Tools alone are insufficient. The Agent must know whether the current state is draft or approved, investigation or execution, recommendation or action. Many apparent reasoning failures come from a system that never supplied workflow state. The state machine determines when the Agent continues, pauses, rolls back, or hands work to a person. It can only come from the actual business process.

Even with the correct state, the team must answer whether the result is correct. Without evals, improvement is a feeling. Without traces, failure is a chat transcript. Without artifact contracts, nobody can reproduce an Agent's claim that it verified the work. [OpenAI's agent eval docs](https://developers.openai.com/api/docs/guides/agent-evals) connect traces, graders, datasets, and eval runs to turn workflow behavior into comparable evidence. This follows the argument in {% post_link ground-truth-core-competency-of-ai-engineering.en 'Ground Truth: The Most Underrated Competitive Edge in the AI Era' %}: the more an Agent can execute, the more clearly a team must define the standard it answers to.

The last layer is the product surface. Asking a user to start from a blank chat box and letting them click "investigate this alert" on an incident page are not two skins over the same interaction. The incident page can give the Agent the business object, current state, logs, permissions, and allowed next actions together. It can also return the result to the place where the decision is made.

Only now does the Agent system divide naturally into five layers.

| Layer | Should you build it? | Why |
| --- | --- | --- |
| Generic loop / runtime | Prefer buying or reusing | SDKs, CLIs, and cloud agents now cover most generic needs |
| Tool and data access | You must own it | External vendors do not know your system boundaries, data semantics, or permission model |
| Workflow state | You must own it | Business-object state machines, gates, and rollback paths come from the business |
| Ground truth / eval | You must own it | Correctness comes from real samples, historical incidents, schemas, and business constraints |
| Product surface | Depends on whether it is core | If the Agent is part of the product experience, interface, approvals, and artifacts must fit the workflow |

The code in the first layer does not need to belong to the company. The judgment in the other four does. This is the boundary of Harness Engineering. It asks who defines the work object, action space, state transitions, acceptance evidence, and human takeover points, rather than who wrote the loop.

That distinction also changes the meaning of "building in-house." Owning a capability does not require implementing every line of code. Adopting an SDK does not outsource responsibility for the system. Build / Buy should follow ownership of judgment, not repository boundaries.

This matches the argument in {% post_link what-engineers-are-still-for.en 'What Are Engineers Still For?' %}. An Agent can keep executing, but a goal does not become a gate by itself. "Trusted" in a business system, "maintainable" in engineering, and "no leakage" in security must become standards that an engineering system can execute and verify.

## Do Agents Still Need to Be Built In-House?

We can now return to the backlog from the opening.

If the project is still centered on a planner, tool loop, memory layer, approval flow, and sandbox, most teams should migrate to an SDK. Continuing to build a generic runtime will increasingly resemble rewriting the Kubernetes scheduler to prove that the team understands cloud native infrastructure.

If the workflow, tools, permissions, ground truth, evals, and artifact contracts survive a runtime replacement, the system still deserves investment. A more mature design should make the underlying Agent replaceable on purpose. It may use Codex today and Claude or an internal model tomorrow without rewriting business state or acceptance criteria.

The answer is still yes, but "in-house" no longer means what it meant in the opening. The opening asks: now that platforms have Agents, should a company still build one? After the replacement test, the question becomes: **which judgments would cost the company its ability to define how work gets done if they were handed to a platform?**

The first question compares lines of code. The second assigns system responsibility. Codex SDK provides the execution layer. The part a company should own is the harness that constrains any execution layer with the correct state, permissions, and verifiable standards.
