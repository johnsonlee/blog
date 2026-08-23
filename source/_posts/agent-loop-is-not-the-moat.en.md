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

Over the past year, many company Agent projects started with the same shape: a planner, a tool-calling layer, a task queue, a retry mechanism, and a few prompts wired into a working directory, browser, enterprise systems, and approval flows. At the time, that looked advanced because everyone was assembling a usable loop from scratch.

By August 2026, the public products look more alike than different. OpenAI has exposed the Codex harness, SDK, and app-server. Anthropic has turned the Claude Code agent loop into the Agent SDK. GitHub and Cursor have connected background engineering Agents to branches, pull requests, artifacts, and review. The first teams that built Agents in-house have not disappeared, but their problem has changed: they no longer lack an Agent that can loop. They lack a work system worth looping through.

<!-- more -->

## The Generic Loop Was the First Part to Commoditize

Early in-house Agents got much of their value from the runtime. Models did not work continuously by themselves, so teams wrote loops. Tool calls were unstable, so they wrote schemas, retries, and recovery. Context overflowed, so they wrote summaries. Execution could cross boundaries, so they wrote sandboxes, approvals, and audit logs.

Those things were worth building because they were hard to buy.

That has changed. The [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) can start, continue, and resume Codex threads from application code. [Codex app-server](https://learn.chatgpt.com/docs/app-server) supports deeper product integrations with authentication, conversation history, approvals, and streamed agent events. In [Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform), OpenAI describes the harness directly: conversation state, streaming execution, tools, sandboxing, approval policy, and carrying work across turns are now reusable parts of the Agent loop.

Anthropic is moving in the same direction. The [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) exposes the Claude Code agent loop, context management, tools, hooks, subagents, MCP, permissions, and sessions as Python and TypeScript libraries. Its docs draw the boundary plainly: call the API directly and you implement the tool loop yourself; use the Agent SDK and the library runs the loop.

This is where the boundary changed.

In the past, building an Agent meant filling an infrastructure gap. Today, if a team still spends most of its energy on how to write the planner, chain tool calls, continue sessions, or pause and resume approvals, it should ask a colder question: **is this runtime product differentiation, or legacy burden?**

## The Survivors Move Into the Workflow

The public products make the pattern visible.

The important part of [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) is not that it can call a model. It lives inside GitHub: it reads repositories, creates plans, opens branches, runs tests and linters, writes commits, opens pull requests, and waits for review. Its execution environment is GitHub Actions. Its entry points are issues, PR comments, GitHub.com, VS Code, Slack, and automation.

[Cursor Cloud Agents](https://cursor.com/docs/cloud-agent) follow the same direction. They run in isolated VMs, work in parallel, use team-configured MCP servers, execute hooks, and return with pull requests, screenshots, videos, logs, and a remote desktop you can take over. The value is not that the loop exists. The value is whether the team can review what changed, how it was verified, and what artifacts came back.

[Devin](https://devin.ai/) is even more explicit: multi-repo work, code migration, incident triage, Slack, Datadog, Linear, tribal knowledge, and automations. Cognition says Devin works inside the codebases and tools teams already use. In practice, the pitch is not another generic chat window. It is an Agent embedded into enterprise engineering workflows.

These products point in the same direction: **the Agent is moving out of the chat window and into the execution path of real workflows**.

That means in-house Agent teams now roughly fall into three groups.

The first group is still building generic runtime. They maintain planners, memory, tool registries, retries, sandboxes, permissions, and queues. This is useful in the short term, but increasingly exhausting over time because model vendors and developer-tool vendors are packaging these capabilities as SDKs, CLIs, cloud agents, and app-servers.

The second group has become workflow teams. They understand the state machine of a business object. They know which gates belong to a ticket, incident, shipment, contract, pull request, release, or invoice; which actions require approval; and which results must be written back to the system of record. These teams are becoming more important. A generic Agent does not know the true boundaries of an internal workflow.

The third group is building ground truth and evals. They no longer debate which prompt sounds more elegant. They translate "done correctly" into fixtures, golden outputs, schemas, trace graders, privacy scanners, architecture tests, mutation tests, and cost budgets. This is the same line of thinking as {% post_link ground-truth-core-competency-of-ai-engineering.en 'Ground Truth: The Most Underrated Competitive Edge in the AI Era' %}: the more work Agents can do, the more they need external standards that make them accountable.

Seen through that lens, the conclusion is neither that those early teams died nor that they all won. **Teams that depend on a self-built loop are being squeezed. Teams that own workflow, context, and ground truth are becoming core platforms.**

## Codex SDK Changes the Build / Buy Boundary

The naive conclusion after seeing the Codex SDK is simple: if platforms already provide the execution layer, companies no longer need in-house Agent teams.

That conclusion is half right.

Teams should stop rebuilding generic coding Agent runtime. Starting tasks, maintaining threads, reading and writing files, running commands, calling tools, handling approvals, resuming across turns, and streaming progress are no longer worth building from scratch unless they are the product itself. Otherwise the team ends up in an awkward race: spend six months catching up to infrastructure someone else opened last month, only to watch the next layer become an SDK too.

But this does not mean companies no longer need to build Agent systems. Codex handles the execution loop. It does not define the business boundary.

OpenAI draws the boundary clearly in its platform article: the application still owns the interface, context and tools, and operational boundaries. In other words, Codex can provide the harness loop, while the product must provide business context, tools, permissions, approvals, and the place where results land.

This matches the argument in {% post_link what-engineers-are-still-for.en 'What Are Engineers Still For?' %}. An Agent can execute without sleeping, but a goal does not become a gate by itself. "Trusted" in a business system, "maintainable" in engineering, and "no leakage" in security all have to be compressed into standards a machine can execute.

The question has to move up one layer.

It is: **which layer of the Agent are you building?**

## The Layers You Cannot Outsource

An Agent system can be split into five layers.

| Layer | Should you build it? | Why |
| --- | --- | --- |
| Generic loop / runtime | Prefer buying or reusing | SDKs, CLIs, and cloud agents now cover most generic needs |
| Tool and data access | You must own it | External vendors do not know your system boundaries, data semantics, or permission model |
| Workflow state | You must own it | Business-object state machines, gates, and rollback paths come from the business |
| Ground truth / eval | You must own it | Correctness comes from real samples, historical incidents, schemas, and business constraints |
| Product surface | Depends on whether it is core | If the Agent is part of the product experience, interface, approvals, and artifacts must fit the workflow |

The first layer is commoditizing. The other four are where Harness Engineering lives.

The tool layer looks like API plumbing, but it is really compressed business semantics. A `refund_order` tool is not just an HTTP call. It implies who can issue a refund, the amount limit, order state, risk rules, audit records, and compensation paths. Expose tools too coarsely and the Agent cannot make fine judgments. Expose them too granularly and the Agent thrashes through the action space.

Workflow state tells the Agent when to continue, pause, roll back, or hand the task to a person. Many in-house Agents fail not because the model cannot reason, but because the system never tells the Agent which state it is in. It treats draft as approved, investigation as execution, and recommendation as action. That is not a prompt problem. It is a missing state machine.

Ground truth determines whether the team can iterate. Without evals, improvement is just a feeling. Without traces, failure is just a chat transcript. Without artifact contracts, the Agent can claim it verified the work and nobody can reproduce that claim. [OpenAI's agent eval docs](https://developers.openai.com/api/docs/guides/agent-evals) point toward traces, graders, datasets, and eval runs for a reason. The goal is not to write a report saying the Agent did well. The goal is to turn workflow behavior into comparable evidence.

The product surface defines the relationship between the human and the Agent. Asking the user to start from a blank chat box is very different from letting the user click "investigate this alert" on an incident page. In the first case, the person has to assemble the task. In the second, the product hands the Agent the object, state, logs, permissions, and possible next actions together.

**Agent differentiation is moving from the loop itself into the business reality around the loop.**

## A Simple Test

There is a simple way to judge whether an in-house Agent project should continue: delete your self-built coding loop and replace the lower layer with Codex SDK or Claude Agent SDK. If the work is only an engineering task, hand it to hosted coding agents such as GitHub Copilot cloud agent or Cursor Cloud Agents. How much value is left?

If deleting the loop leaves only a few prompts, some tool wrappers, and session records, the system probably has no moat. It was temporary scaffolding from the period before vendors packaged the runtime.

If deleting the loop leaves a business state machine, permission boundaries, MCP tools, approval policies, eval datasets, golden outputs, artifact schemas, trace graders, cost routers, and contracts for writing back into systems of record, then it is worth continuing. Those pieces are needed no matter which underlying Agent runs the work.

Even better, a good in-house system should make the underlying Agent replaceable. Today it may be Codex. Tomorrow it may be Claude. Later it may be an internal model or a vertical Agent. As long as the workflow, tools, ground truth, and artifact contracts hold, switching the lower-level loop should feel like replacing an execution engine, not rebuilding the whole system.

Many teams misread control here. They think building an Agent means owning more. Once the runtime is welded directly to the business system, the system can become more dependent, not less. Control comes from knowing which layer must be owned and which layer should remain replaceable.

## The Endpoint of Building Agents Is Not an Agent

Seen as an engineering decision, the arrival of Codex SDK does not erase in-house Agent work. It changes what should be built.

The answer is yes, but the target has changed.

If building in-house means writing another generic planner, tool loop, memory layer, approval flow, and sandbox, most teams should stop. That path is being eaten by platforms. Over time it will feel like building your own Kubernetes scheduler to prove you understand cloud native infrastructure.

If building in-house means turning a company's workflow, context, tools, permissions, ground truth, evals, and artifact contracts into a system where any strong Agent can work safely, then it is not only necessary. It will become more important.

The old question for Agent teams was how to make the model do work by itself. Platforms are starting to answer that. The next question is harder: **how do you make an increasingly capable system do the right thing inside the right boundaries?**

That is where Harness Engineering belongs.

Codex SDK gives you the execution layer, not the judgment layer. The part worth building is the system that defines direction, boundaries, accountability, and where the evidence belongs.
