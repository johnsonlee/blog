---
title: "What Agent Workflows Need Is a Programmable Sandbox"
date: 2026-10-29 20:30:00
lang: en
i18n_key: what-agent-workflow-needs-is-a-programmable-sandbox
categories:
  - Harness Engineering
tags:
  - AI
  - Agentic Coding
  - Debugging
  - Replay
  - Sandbox
  - Mocking
---

The most painful part of building an Agent workflow is debugging the workflow as a whole. A run breaks at the third handoff. You change one line in the prompt and run it again. The failure disappears, but you cannot tell whether the fix worked or the model simply chose another path. On the next run, the original bug stays hidden while a tool returns something different. Traditional debugging narrows variables around a fixed input. Every Agent rerun creates new variables instead.

Agentic Coding needs a programmable sandbox. It isolates the Agent from the real environment while taking control of the model, tools, network, clock, filesystem, and other variables inside. Each boundary can return a recorded result or a mock result. The Agent keeps calling the same interfaces and the workflow does not change for the test, yet the system can restore the state before a failure and rerun with only one variable released.

<!-- more -->

## Why the same failure is hard to reproduce

The first job after a normal program fails is to reproduce the bug. With the same input, environment, and code, the same failure should appear again. Then we can add a breakpoint, change one thing, and verify that the failure is actually gone.

An agentic workflow breaks that assumption. Model sampling changes. Context compaction changes. Tools see different web pages, database rows, and files. Retry counts and concurrent ordering change. Even with temperature set to zero, hosted model execution should not be treated as bitwise deterministic.

[OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/) can already record generations, tool calls, handoffs, and guardrails. That is useful, but a trace answers "what just happened?" After a code change, clicking run executes the model and tools again. The result is a new trajectory, not an experiment on the old one.

Logs help with the autopsy. They do not preserve the scene.

## Rewinding solves only half the problem

Traditional record-and-replay debuggers have handled a similar problem for years. During recording, [rr](https://rr-project.org/) captures the inputs a process receives from the kernel and nondeterministic CPU effects. During replay, it feeds those results back to the process, allowing the same instruction path to run repeatedly and even in reverse.

Applied to an Agent, the model can be treated as a nondeterministic I/O boundary. A model response is no different in this respect from an HTTP response or a clock read: record the result during the original run and return it directly during replay.

Debugging also needs conditions that never occurred in the original run: make an API time out, make a tool return a malformed result, or run a fixed model implementation while every other boundary keeps returning historical results. Replay fixes what happened. Mocks control which variables may change next.

The recording needs more than the conversation:

- complete inputs, outputs, model version, and parameters for every model call;
- arguments, results, errors, latency, and side-effect receipts for every tool call;
- versions of prompts, Skills, MCP servers, tool schemas, checkers, and orchestration;
- snapshots or content addresses for the filesystem, database, browser, environment variables, and external resources;
- time, random values, retries, concurrency order, and human approvals.

[Temporal workflow replay](https://docs.temporal.io/workflows) provides a useful engineering reference. Workflow code re-executes against an Event History. Completed Activities do not touch the external world again; replay returns their recorded results. LLM invocations, APIs, database queries, and file I/O belong on that nondeterministic boundary.

A programmable sandbox intercepts these boundaries transparently. It can execute a call live, return its historical value, synthesize a value, or inject a failure. The Agent inside still believes it is talking to the real model, tool, and environment. It does not need to know whether a result came from replay or a mock.

**A sandbox does not mock the Agent. It mocks the world the Agent can observe.**

![How a programmable sandbox controls environmental variables without the Agent noticing](/images/agent-programmable-sandbox.en.svg)

The Agent sees an ordinary interface returning an ordinary response. Only the sandbox knows whether that response came from history, live execution, a synthetic mock, or fault injection.

## A sandbox records behavior and environment together

For transparent mocking to work, the sandbox must record two kinds of fact on one timeline:

1. Record the Agent's sequence of actions.
2. Record how those actions changed the environment.

The first kind of record contains observations, model responses, handoffs, tool calls, and approvals. The second contains file diffs, process state, database mutations, DOM changes, network responses, and external side effects. The implementation should not maintain two loosely coupled logs. An action and its environmental changes must be enclosed in the same event:

`t0 Observe(S0) → t1 Decide(A1) → t2 Act(T1) → t3 Delta(S0, S1) → t4 Observe(S1)`

`Act(T1)` must point to the model decision that caused it. `Delta(S0, S1)` must point to the tool call that caused the change. Each event needs a monotonic sequence number, parent event, inputs and outputs, and pre/post state hashes. That lets us answer what the Agent observed, why it acted, exactly what the action changed, and how the new state entered the next context.

An action log alone may show that the Agent called `delete_file`, but not what the file contained or which tests changed afterward. An environment snapshot alone may show two different versions, but not whether the change came from the Agent, a background process, or an external service.

A snapshot answers "what did the world look like at this moment?" An append-only event log answers "how did the world get here?" Snapshots restore the environment. Events reconstruct the causal path between checkpoints and locate the exact historical return value for each mock.

Seen another way, this timeline already looks like a Git commit graph.

## Git versions the sandbox state

Git already provides the time operations that Agent replay needs most:

| Agent sandbox | Git |
| --- | --- |
| What the Agent did | Commit message / action-envelope blob |
| Environment state at one moment | The tree referenced by a commit |
| The action's effect on the environment | The diff between parent and commit |
| Action order and causality | The parent commit |
| Return to a checkpoint | Checkout |
| Try another fix from a historical state | Branch |
| Run several experimental timelines at once | Worktree |

[Git's data model](https://git-scm.com/docs/gitdatamodel.html) is a better fit than the common description of Git as a store of diffs. A commit stores the ID of a complete tree, its parent commit, author, time, and message. Blobs, trees, and commits are immutable and addressed by content hashes. Git does not store the diff in a commit; it calculates one from the parent and child when needed. Its history is already a sequence of immutable snapshots from which state changes can be derived.

After each Agent action, the sandbox can create an agent commit:

- the commit message records an action summary and event ID, while the complete action envelope enters the tree as a blob containing the observation, model response, tool call, approval, and verifier result;
- the same tree stores the workspace after the action and a manifest for database, browser, process, and other external state;
- the parent points to the agent commit before the action, and the diff from parent to the current tree answers "how did the environment change?";
- large objects live in separate content-addressed storage, while the commit keeps their hashes and restore instructions.

Both the action record and environment state now participate in the commit hash and share one commit ID. The replay system does not have to guess which environment snapshot belongs to a tool-call log, and independently written logs cannot drift out of alignment.

**One agent commit is an atomic record of an action and its environmental effect.**

This repository does not have to be the product repository's own `.git` directory. A sandbox could maintain a parallel bare repository or reuse Git's object model for a dedicated event store, keeping observations and tool calls out of the product's commit history.

To reproduce an incident, check out the agent commit before the failure. To test a fix, create a branch from that point. To compare several fixes in parallel, give each one its own [worktree](https://git-scm.com/docs/git-worktree.html). The original failure history remains intact while every experiment grows into a new branch.

If a verifier can return stable pass/fail results for any checkpoint, [git bisect](https://git-scm.com/docs/git-bisect) can even locate the first agent commit that broke an invariant. We use it today to find which code commit introduced a bug. The same operation can identify which Agent action first pushed the environment into a bad state.

Git directly understands files. An ordinary repository does not automatically capture model output, memory, databases, network traffic, or real-world side effects. It supplies the skeleton of the replay sandbox, not the entire implementation. The missing state must be serialized as objects or supplied by replayable external systems through receipts and snapshots.

At this point, Git answers "what state is the world in?" It does not answer "how should the world respond to the next call?" That requires a programmable boundary proxy. It intercepts models, tools, networks, clocks, random values, databases, and filesystems, then chooses live execution, historical data, a synthetic mock, or fault injection for the current experiment.

**Programmable sandbox = Git-backed state + transparent boundary mocks.**

## Every boundary can choose how to respond

Caching every result is not enough. A useful debugging sandbox needs at least three execution policies:

| Policy | How boundaries respond | Question it answers |
| --- | --- | --- |
| Historical | Every boundary returns its recorded result | Can this failure be reproduced reliably? |
| Forked | Every boundary after the checkpoint runs live | What happens if execution restarts here? |
| Programmed | Each boundary independently chooses live, historical, synthetic, or failure | Did this change or hypothesis actually hold? |

In Git terms, historical replay checks out a commit and serves every boundary from historical objects. A forked run creates a new branch from an old commit and runs everything after it live. A programmed run also creates a branch, but every boundary gets its own mock policy.

[LangGraph time travel](https://docs.langchain.com/oss/python/langgraph/use-time-travel) already supports replay and forking from a checkpoint. Nodes before the checkpoint do not execute again, while downstream LLM calls, APIs, and interrupts run live and may return different results. It solves "where should execution resume?" It does not automatically solve "how do we hold every other variable constant?"

A programmed run is what turns this into debugging. Suppose an Agent deletes the wrong file at step 12. The bug may be in the context builder at step 10 or the policy checker at step 11. While fixing the context builder, run only that component live and keep the model output, tool result, and downstream inputs on the recorded path. Then do the same for the checker. The API at step 9 can also be mocked to time out, testing whether the fix holds on the failure path. Changing one variable at a time turns a failure trajectory into an executable experiment.

That is also the operation described by [Chronicle's cut-point replay](https://arxiv.org/abs/2609.20625): record immutable envelopes at nondeterministic boundaries, run new code at selected boundaries, and serve the rest from the recording. Its public experiment is still small, but the operation is much closer to a regression test than "run it again and see."

## Every crash can become the next starting point

What makes *Source Code* interesting is not simply that the protagonist returns to the past. Each loop carries forward what he learned in the previous one. If he fails, he tries again from the same starting point without repeating every mistake he has already ruled out.

An Agent workflow can advance in the same way, except the sandbox must preserve more than memory. Whenever the workflow reaches an intermediate state that passes its verifier, the sandbox stores the action history, environment snapshot, and boundary responses as a checkpoint. If a later step crashes, the next run restores the nearest valid checkpoint before the crash and executes only the remaining path.

This turns a long task from an all-or-nothing run into cumulative exploration. One run may reach step 12; the next starts there and explores step 13. A single failure no longer discards all the tokens, tool calls, and wall-clock time already spent. The sandbox is therefore more than a debugging and mocking tool. It is the save system for an Agent workflow, helping it finish through repeated attempts.

## Isolation keeps mocks from becoming incidents

An Agent sandbox is usually described as permission isolation: prevent the Agent from reading the wrong files, keep the shell inside the workspace, and require approval before dangerous tools run. For debugging, isolation has another purpose. It lets the sandbox take control of environmental variables without allowing an experiment to leak into the real world.

A coding Agent needs a clonable worktree, container image, and dependency cache. A browser Agent needs the DOM, storage, cookies, network responses, and screenshots. A business Agent needs database snapshots, queue events, feature flags, and authorization state. Saving only prompts and responses cannot restore the world the Agent saw.

Side effects are harder. A replay must not issue the same refund, send the same email, or delete the same file again. Writes need to go to shadow services or return from recorded receipts. Any write that must run live needs an idempotency key and an isolated environment. The sandbox keeps the same interface on the inside while containing effects in disposable copies on the outside. The Agent notices no difference, and the real world remains untouched.

Isolation is not an extra feature beside mocking. Calls must stay inside controlled boundaries before the sandbox can safely replace results, inject failures, and fork state.

## Turn one failed trajectory into a Test Case

[OpenAI Agents SDK deterministic testing](https://openai.github.io/openai-agents-python/testing/) already lets a `ScriptedModel` fix the model output for each step while the real tool, handoff, guardrail, and retry paths run. It shows that an Agent workflow can become deterministic once the model boundary is stubbed. The missing step is turning a production failure trace into that script automatically, together with its environment snapshot.

The repair loop can then become:

1. Capture the event log and sandbox snapshot for a real failure.
2. Use the historical policy to confirm stable reproduction.
3. Set a suspicious boundary to live or mock and change only one variable.
4. Use the original verifier to check whether the failure is gone.
5. Commit the trajectory as a regression case, then run the broader eval suite.

The last step matters. One replay proves only that a change fixed one timeline. It does not prove that the Agent improved across similar tasks. Replay turns an intermittent incident into a deterministic regression. A representative eval checks whether the fix pushed the system into a different failure mode.

In {% post_link from-prompt-to-harness.en 'From Prompt to Harness' %}, I placed reproducibility at the last layer of the Harness because it makes eval results comparable across versions. There is one more step to take: reproducibility should serve more than evaluation. It should become the execution model of the Agent Debugger.

Git lets the sandbox restore any version of the environment. Boundary mocks decide which responses remain historical, which calls execute new code, and which failures are injected. Both are necessary. State restoration without variable control is still a random rerun. Mocks without the complete environment do not test the world in which the incident happened.

A failed trajectory should become a Test Case that can be restored, forked, and programmed, not a trace that people can only inspect. A checkpoint that passes its verifier should become the starting point for the next attempt. An Agent workflow needs a programmable sandbox that is transparent on the inside and isolated from the outside.
