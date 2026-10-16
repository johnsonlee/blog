---
title: "Agent Compute Must Be Traced Back from Successful Tasks"
date: 2026-08-23 12:00:00
lang: en
i18n_key: agent-task-compute
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

"Find the checkout failure, fix it, run the tests, and open a PR."

The interface shows one task. Behind it, an agent may read the repository and logs, invoke a model to diagnose the problem, run a shell, edit files, wait for tests, and inspect the diff. Any failed step sends a new observation back to the model and starts another turn.

How much compute did that task consume? Request count cannot answer. Runtime cannot answer. Even total tokens capture only half the story. The missing record is how one sentence expands into an execution trace and how many such traces cross the acceptance boundary into results a user can actually use.

<!-- more -->

## Why Isn't One Sentence One Inference?

A chat response can end when the model finishes generating. An agent task may only be getting started. The model sees the goal, tools, permissions, and current context, chooses an action, receives the tool result as a new observation, and chooses again. The loop ends when the task completes, reaches an iteration cap, waits for human approval, or fails.

![How one Agent Task expands into a model-and-tool trace](/images/agent-task-trace.en.svg)

[OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/) records an end-to-end workflow as a trace and task, turn, agent, generation, function tool, guardrail, and handoff operations as spans. That hierarchy exposes what request count hides: one click may produce one generation or dozens of model and tool calls.

The first ledger is therefore not `Request → Token`. It is `Task → Turn → Model Invocation / Tool Call → Accepted Result`. Skip the middle layers and fan-out, context growth, retries, and verification all disappear into a misleading average.

## If an Agent Runs for an Hour, Does a GPU Run for an Hour?

Agent wall-clock time is not model active time. A generation consumes inference capacity. A browser, database, shell, or test runner executes in another system. While the task waits for a tool result or human approval, it remains open, but the GPU can serve other work.

![Agent wall-clock time versus model active time](/images/agent-task-wall-clock.en.svg)

[OpenAI Background mode](https://platform.openai.com/docs/guides/background) runs long tasks asynchronously and lets developers poll their status. It solves connection and task-lifecycle problems; it does not reserve one GPU continuously for the task.

Capacity planning must separate two kinds of concurrency. `In-flight Tasks` are unfinished work. `Active Model Calls` are the load entering the inference queue now. Thousands of tasks waiting on tools do not create thousands of concurrent model calls. If many tool results return together, however, they can wake a large batch of calls within seconds and create a burst.

Charging the full hour as a GPU-hour overstates average occupancy. Counting only the initial API request misses every later wake-up.

## Do More Agents Always Finish the Task Faster?

Only independent branches can run in parallel. Separate searches can go to separate subagents. Edits to the same files, branches waiting on one upstream observation, or workers sharing mutable state eventually serialize at merge, verification, or retry.

![Compute fan-out in single-agent and multi-agent systems](/images/agent-task-fanout.en.svg)

[Anthropic's review of its multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) provides unusual production figures. In its data, agents typically used about four times as many tokens as chat interactions and multi-agent systems about 15 times as many. A system with an Opus 4 lead agent and Sonnet 4 subagents outperformed single-agent Opus 4 by 90.2% on Anthropic's internal research evaluation.

Those figures have a clear boundary. They come from breadth-first research workloads and an internal evaluation. Anthropic also notes that most coding tasks have fewer genuinely parallel branches than research. The 15-times figure shows how quickly fan-out can expand compute demand. It does not show that more agents always finish faster or that every workload receives a 90.2% gain.

Fan-out has to be reconciled with parallel width, coordination tokens, duplicate work, merge failures, and accepted contributions. A branch that neither shortens the critical path nor raises the success rate merely turns one task into more bills.

## Why Does Every Turn Make Context Heavier?

The first model invocation reads instructions, tool schemas, the user's goal, and initial material. Once a tool returns logs, pages, or code, the next invocation must see those observations to continue. As the task grows, conversation history, tool results, intermediate artifacts, and state summaries tend to grow with it.

![How Agent context grows with each model and tool call](/images/agent-context-growth.en.svg)

Longer context increases prefill work, input-token charges, and KV-cache pressure. Keeping every raw output preserves evidence but costs more. Truncating too early can remove a decision. Summarization and compaction shorten the prompt but may omit detail or change the prefix enough to lose cache reuse.

[OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching) requires an exact prompt-prefix match. Stable instructions, tool definitions, and shared context improve reuse. Change an early message, tool schema, or ordering and later invocations may have to process the prefix again.

A context ledger therefore needs more than total tokens. It should separate static prefix, cached input, new observations, compacted state, retrieved context, and output. Any input savings from compaction must be weighed against retries it causes later.

## Why Can One Failure Recompute the Whole Chain?

A tool timeout may support a local retry. A wrong diagnosis can invalidate the following edit and test together. The later verification finds the error, the more model calls, tool calls, and waiting have already become sunk compute.

![How retries and verification amplify Agent Task cost](/images/agent-retry-amplification.en.svg)

[AWS Agentic AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentperf02-bp01.html) notes that each perceive-reason-act iteration typically includes an LLM inference, so iteration count multiplies both latency and cost. Iteration caps, early termination, and retry budgets stop a loop when it no longer converges.

That does not mean more validation is always better. Cheap schema, permission, and deterministic-test gates belong early. Reviews that require full context must remain later. An early gate with too many false rejections creates its own retries. The useful record is first-pass success, accepted after retry, escalated, aborted, rework depth, and the length of the execution path invalidated by each failure.

Verification is not free work after model output. The user buys a result that passes the quality gate, so verification belongs inside the task.

## Why Can Cheaper Tokens Produce a More Expensive Task?

One model costs $0.10 per attempt but needs five attempts and a human correction. Another costs $0.35 and passes once. The first has cheaper tokens and the higher successful-task cost.

The full bill also extends beyond the model. Cached and uncached input, reasoning, and output tokens sit beside search, browser, database, sandbox runtime, storage, network, tracing, evaluation, human review, and rework. Some waits consume little model compute but retain runtime state. Some tool calls use few tokens but charge by request, minute, or outcome.

[OpenAI's AI scorecard](https://openai.com/index/a-scorecard-for-the-ai-age/) gives the denominator plainly: add the full cost of completing the work, count only tasks that met the quality bar, and divide the former by the latter. The source is a model provider, but the denominator is still right. If a customer buys completed work, the ledger cannot stop at tokens.

Each span therefore needs an owner, model, token counts, tool price, active time, wait time, retry cause, and result. After the output passes its quality gate, every span can roll up to the same task ID. Without that trace, there is no way to tell whether a cheaper model saved money or shifted cost to tools, runtime, and people.

## How Does One Task Map Back to Data Center Capacity?

Users see task arrivals per minute and the time each task takes to close. A data center must see how many active model calls those tasks wake at each moment, which models they invoke, how much context and output they carry, and what latency SLO they must meet.

![The ledger from task arrival to successful-task capacity](/images/agent-task-capacity-ledger.en.svg)

A task expands into turns, then model invocations. Each invocation passes through routing, queueing, prefill, and decode and consumes the inference capacity examined in the previous article. A tool wait releases model capacity, a returning result creates another invocation, and parallel agents can expand one task into several active branches at once.

There is no fixed `Tasks per MW` conversion. It depends on the distribution of invocations per task, input and output tokens, cache hits, model mix, parallel width, retry depth, success rate, and latency target. The numerator contains only successful tasks that pass their quality gate before the deadline.

An average is not enough. A P50 task may finish in two turns. A P99 task may run dozens more because of long context, tool timeouts, fan-out, and retries. The scheduler's hardest load may be the instantaneous concurrency created when many tool completions wake branches together, not average token volume.

## Who Gets Paid When Agent Workload Grows?

An expanded task triggers different commercial events. Model providers charge when billable tokens or model invocations occur. Search, browser, database, payment, and code-execution providers charge on API calls, runtime, or actions. Agent platforms may charge by seat, workflow, usage, or enterprise contract.

[AWS guidance on Agent cost](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentcost01.html) separates reasoning loops from multi-agent coordination because hierarchy and handoffs can multiply orchestration cost. Usage does not guarantee retained economics. Model price declines can outrun token growth, tools can be substituted, and model-native features, open-source frameworks, or cloud bundles can push basic orchestration toward zero.

The payment event must be reconciled with the customer outcome. A supplier has a chance to retain profit when it lowers successful-task cost, controls data, permissions, or actions the customer cannot bypass, and turns that control into recurring payment. Anthropic's four-times and 15-times figures show an expanding demand unit; they do not show whether value ultimately stays with the model, tool, platform, or customer.

## Is Agent Economics Already Priced In?

The current answer is **Unverified**.

Public evidence shows that one Agent Task can expand into more model and tool calls and that fan-out, context, and retries change compute demand. Public companies do not disclose Agent Task volume, successful-task rate, compute per successful task, tool attach, human rework, and the corresponding gross margin in one bridge.

Without those inputs, `Task Volume × Revenue per Successful Task - Full Task Cost` cannot be reconciled to company earnings. Anthropic's four-times and 15-times figures come from a specific workload. OpenAI and AWS explain measurement and optimization, but neither source is a public-company segment disclosure. Inferring Agent economics from token growth, Agent users, or a whole-company rerating crosses attribution gaps that public data cannot support.

`Unverified` does not mean the market assigned no value. It means the amount cannot currently be calculated. Moving to a stronger conclusion requires successful tasks by workflow, first-pass success, model, tool, and runtime cost, revenue or attach, gross margin, and retention, followed by a reverse valuation against those earnings.

The falsifiers are equally concrete: task count grows while tokens per successful task fall faster; model prices decline faster than usage expands; multi-agent systems fail to improve acceptance; tools and orchestration become bundled; or customers replace expensive loops with deterministic workflows. Any of them can make compute demand and capturable profit move in different directions.

## So How Much Compute Does One Agent Task Consume?

Return to the coding task at the beginning. It is neither one request nor one hour of GPU time. It is an execution trace made of model, tool, wait, retry, and verification spans.

Its compute can be calculated only after the result passes acceptance: attribute every active model invocation to the same task ID, translate model, context, output, cache, parallel width, and SLO into inference capacity, then divide by successful tasks.

The replication unit of Agent workload has changed. A data center does not ultimately deliver more tokens. It delivers tasks completed by the deadline and accepted by the user. Only this ledger can turn task growth into real capacity demand and then show who received revenue, who retained profit, and how much the market has already counted.
