---
title: "How /goal Keeps Agents Working 24/7"
date: 2026-08-25 01:30:00
lang: en
i18n_key: how-goal-keeps-agents-working
categories:
  - Harness Engineering
tags:
  - AI
  - Codex
  - Claude Code
  - Agent
  - Harness Engineering
  - Eval
---

Anyone who has handed a long task to an Agent knows the pattern: hand it over before bed and expect it to keep moving overnight. By morning, the Agent has already stopped, but it has left a confident summary behind: task complete. Open the code, and not even 10 percent is done.

Model laziness is only part of the problem. An ordinary Agent is built to produce one answer, so when the answer ends, it treats the task as finished too. `/goal` addresses what happens after the human leaves: who checks whether the original objective is complete, and who starts another turn when it is not?

<!-- more -->

## Why Agents Keep Stopping at 10 Percent

An ordinary prompt governs one turn. The Agent reads the request, changes a few files, runs part of the test suite, writes a summary, and ends the answer. The same Agent usually decides how much of the original task remains.

The Agent is both the worker and the reviewer. A code change, a command that ran, or the outline of a document is often enough material for a convincing summary. At that point, “an answer exists” easily becomes “the task is complete,” even when most requirements remain untouched.

Automatically replying with “continue” only opens another turn. The system has not remembered what completion means, and the next turn does not begin by checking what the last one missed. The problem from {% post_link fooled-by-loop-engineering.en 'Loop Engineering Is Not Enough' %} remains: a loop can press Enter again, but it cannot guarantee that the Agent is still doing the job it was originally given.

A long task does not need an endless turn. It needs an objective that survives across turns and a loop that exits only when the stopping condition is satisfied.

## `/goal` Is a Persistent State Machine, Not a Prompt

Codex is open source, and the `/goal` implementation lives in [`codex-rs/ext/goal`](https://github.com/openai/codex/tree/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal). Open the code and the first thing you find is not a prompt telling the model to “try harder.” The Goal has been turned from chat text into persistent state attached to a thread.

When the TUI receives `/goal <objective>`, it calls `thread/goal/set` with the objective and an `active` status. The [`thread_goals` record in SQLite](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/state/src/model/thread_goal.rs#L60-L71) stores the `goal_id`, objective, status, token budget, tokens used, and time used. The six possible states are `active`, `paused`, `blocked`, `usage_limited`, `budget_limited`, and `complete`.

That is the difference. A prompt ends with its turn, while a Goal is saved with the thread. Producing a final answer does not delete it. As long as the Goal remains `active`, ending the current turn does not end the task.

The control path is short:

```text
/goal <objective>
  -> thread/goal/set
  -> SQLite: status = active
  -> worker turn ends; thread becomes idle
  -> GoalExtension::on_thread_idle
  -> GoalRuntimeHandle::continue_if_idle
  -> start_turn_if_idle(continuation prompt)
  -> next turn
```

Two functions pass the work forward: [`on_thread_idle`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/extension.rs#L148-L160) and [`continue_if_idle`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/runtime.rs#L362-L440). Whenever the thread becomes idle, the runtime reloads the Goal. If its status is still `active`, it calls `start_turn_if_idle(...)` and opens another turn. It stops only when the state becomes `complete`, `blocked`, `paused`, or hits a limit.

So 24/7 does not mean one model call runs for 24 hours. **When one turn stops, an external runtime starts another.**

## The Next Turn Receives More Than “Continue”

Codex injects [`continuation.md`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/templates/goals/continuation.md) when it starts a new Goal turn. The prompt includes the original objective and remaining token budget, but it also gives the next turn a concrete operating protocol.

It tells the Agent to:

- treat the current worktree and external state as authoritative instead of trusting the previous summary;
- classify the last turn as progress, a verified wait, or no progress;
- preserve the original scope instead of shrinking it into an easier deliverable;
- derive requirements from the objective, specifications, issues, and user instructions;
- find authoritative evidence for every item in files, command output, test results, runtime behavior, or other current state;
- keep working when evidence is missing, indirect, or narrower than the requirement it claims to prove.

That is not the same as appending “continue.” The next turn cannot simply build on the previous summary. It has to inspect the code, tests, and external state, then answer one question: which part of the original objective still lacks evidence?

Suppose the task is to migrate a JavaScript project to TypeScript while preserving behavior, compiling in strict mode, and keeping rollback available. Getting the compiler to pass completes only one requirement. The next turn still has to add contract tests. If they expose an incompatibility, the Agent keeps fixing it. Rollback must then be rehearsed for real. If any of that evidence is missing, the task is not complete.

The Python SDK also coalesces several physical turns into one logical turn. In [`test_private_goal_operation_coalesces_runtime_continuations`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/sdk/python/tests/test_app_server_goal_operations.py#L18-L90), several model requests and automatic continuations happen underneath, while the caller receives one `turn/started` and one final `turn/completed`. The user does not have to keep typing “continue.” It appears as one task that runs until the Goal ends.

## Codex and Claude Code Take Different Paths

Codex and Claude Code both have `/goal`, but they do not share an implementation. Both separate “the turn ended” from “the Goal ended.” They differ in how they judge completion and start the next turn.

### Codex: Start Another Turn While the State Is Active

Codex does not launch a separate Goal judge. The completion audit is part of the continuation prompt and is still performed by the Agent doing the work.

When the Agent believes the objective has been achieved, it calls [`update_goal({ status: "complete" })`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/spec.rs#L60-L93). The tool only allows the Agent to submit `complete` or `blocked`. If it does not call the tool, the Goal remains `active`, and the runtime starts another turn after the current one ends.

The Agent cannot mark a Goal `blocked` the first time it encounters difficulty. The same blocker must recur for at least three consecutive Goal turns, with no meaningful path forward without user input or an external state change. Work that is merely hard, slow, uncertain, or easier with clarification does not qualify.

These constraints are prompt policy, not formal proof. The [Rust executor for `update_goal`](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal/src/tool.rs#L228-L298) only checks whether the status can be written. It does not rerun the test suite or know whether every requirement in the objective has been met. If the Agent calls `complete` too early, the database accepts it and the runtime stops starting new turns.

### Claude Code: A Fresh Model Evaluates Every Stop

[Claude Code's `/goal`](https://code.claude.com/docs/en/goal) is a session-scoped [prompt-based Stop hook](https://code.claude.com/docs/en/hooks-guide#prompt-based-hooks). Setting a Goal immediately starts the worker. Whenever the worker finishes a turn, Claude Code sends the completion condition and the conversation so far to a fresh evaluator. On the Claude API, the default is Haiku; the configured small fast model can replace it.

```text
/goal <condition>
  -> worker executes one turn
  -> Stop hook launches a fresh evaluator
  -> Not yet met: feed the reason to the worker; start another turn
  -> Met: clear the Goal; record achieved
  -> Impossible: clear the Goal; record failed + reason
```

The evaluator cannot call tools or read files. It can inspect only the evidence the worker put in the conversation. Claude Code therefore recommends a condition with a measurable end state, an explicit verification method, and constraints that must remain true, such as “`npm test` exits 0 and no other test files are modified.” If the worker leaves the complete test result out of the transcript, the evaluator does not know what happened in the code.

Claude Code skips evaluation while a subagent or background shell command is still running. By default, it checks in after 30 minutes, then after one hour and two hours. An idle interactive session can start a check-in turn on its own. If Claude spends several consecutive turns answering the evaluator without using tools, the Stop hook hits its block cap. Control returns to the user while the Goal remains set. Without that cap, two models could keep saying “continue” to each other without doing any work.

Resuming a session restores an active Goal, but the turn count resets and the timer and token-spend baseline start over. `/goal` does not change permission mode. Fully unattended tool use still requires auto mode; otherwise a permission request can stop the task until the user returns.

## Why Codex and Claude Code Chose Different Paths

Open the code and both choices follow the control plane already in place. Codex already manages continuation through thread state and an idle callback, so the shortest path is to let the worker change state through `update_goal`. Claude Code already has Stop hooks and prompt-based hooks, so the shortest path is to call a fresh evaluator whenever the worker tries to stop.

| Comparison | Codex | Claude Code |
| --- | --- | --- |
| Existing extension point | thread state + idle callback | Hook system + Stop event |
| Shortest implementation path | worker changes the Goal state; continue while it remains `active` | Stop hook calls a small model; block exit while the condition is unmet |
| Completion judge | the worker doing the task | a fresh evaluator launched by the Stop hook |
| Evidence available to the judge | the original thread context, plus tools for inspecting the repo | the completion condition and conversation, with no tool or file access |
| First problem it solves | a turn ending must not discard an unfinished Goal | a worker cannot end the Goal with a completion claim alone |
| Main cost | the worker still reviews its own work and may call `complete` too early | the evaluator depends on evidence the worker put in the conversation |

![The Goal control loops in Codex and Claude Code](/images/goal-runtime-comparison.en.svg)

Neither path is universally better. If the larger risk is losing unfinished work at a turn boundary, Codex's persisted state is the more direct answer. If the larger risk is a worker declaring victory too early, Claude Code's extra evaluator is more useful. Codex can still misjudge its own work. Claude Code uses a separate evaluator, but that evaluator can judge only what appears in the transcript.

So `/goal` does not guarantee that the objective will be completed. It changes the default behavior: **an ordinary Agent exits when the answer ends; `/goal` starts another turn while the stopping condition remains unsatisfied.**

## Goal Judgment Versus a Deterministic Verifier

If the Agent performs a completion audit, does Agentic Engineering still need evals and verifiers?

Yes. All three are necessary. `/goal` governs control flow: when to continue and when to stop. A verifier establishes facts: whether a particular condition has been met. An eval defines the standard: which cases, boundaries, and quality thresholds must be checked.

| Component | Question | Typical output |
| --- | --- | --- |
| Eval | What counts as correct? | cases, rubric, thresholds, acceptance criteria |
| Verifier | Does the current result pass this check? | exit code, test report, screenshot, schema diff, human verdict |
| Goal completion audit | Does this evidence cover the full original objective? | continue, complete, impossible, or `blocked` |

A deterministic verifier checks the result directly. A full test-suite exit code, file hash, schema invariant, or layout overflow check can produce a stable, reproducible answer. A completion audit makes a semantic judgment: do those tests cover everything the user asked for? Ten local checks can pass while a deliverable that was never encoded as a test is still missing.

Neither can replace the other. If a stopping condition can be expressed deterministically, give it to a verifier. For “keep fixing the project until the complete test suite exits with code 0,” the most reliable check is software reading the exit code. Requirement coverage, readability, and visual quality cannot be fully formalized, so an Agent still has to judge them against rubrics, visual review, or human feedback.

![The roles of Goal, Eval, and Verifier](/images/goal-control-loop.en.svg)

The Codex continuation prompt counts tests, manifests, verifiers, and green checks as evidence only after their coverage of the relevant requirement has been confirmed. Claude Code's evaluator cannot see tools or files, which makes the other half obvious. Unless a verifier puts the result into the conversation, a fresh model has only the worker's account. Without an eval, a verifier may consistently enforce the wrong standard.

This is the same problem discussed in {% post_link ground-truth-core-competency-of-ai-engineering.en 'Ground Truth: The Most Underrated Competitive Edge in the AI Era' %} and {% post_link agent-tdd-is-self-verification.en 'Does an Agent Really Need TDD?' %}: an Agent can judge whether the evidence covers the objective, but it cannot create ground truth with its own completion summary.

## 24/7 Does Not Mean Running Forever

The “24/7” in `/goal` depends on three things: the Goal survives across turns, an external trigger takes over when a turn ends, and that trigger can start another turn while the stopping condition remains unsatisfied. Codex uses a thread-idle callback; Claude Code uses a Stop hook.

If the computer shuts down or the process exits, local work stops. Both implementations can reload an active Goal when the session resumes. Waking the task at a future time belongs to [OpenAI Scheduled tasks](https://learn.chatgpt.com/docs/automations) or [Claude Code scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks), not to the Goal loop itself.

The loop cannot run forever, either. Codex changes state when it reaches the token budget, usage limit, or a non-recoverable turn error. Claude Code clears a Goal after an authentication failure when it manages its own credentials, exhausted credit, unrecoverable context overflow, or an unavailable model. It pauses the loop after repeated turns with no tool use. The user can also pause, clear, or interrupt the operation at any time.

Return to the task assigned before bed. With an ordinary Agent, a polished summary at 10 percent ends the work. Under `/goal`, a final answer only ends the current turn. If the Goal remains `active`, the runtime sends the original objective, remaining budget, and completion audit into another turn.

The Agent has not suddenly become reliable. The system has stopped accepting a final answer as sufficient reason to walk away. The objective is saved, unfinished work starts another turn, and the stopping rules are explicit. That is why `/goal` can keep a long task moving in the background.

## Sources

This source analysis is based on OpenAI Codex commit [`68301fa`](https://github.com/openai/codex/commit/68301fa45f0d8b692ff821c20073e747fe19250d), dated August 25, 2026.

- [OpenAI Codex: Goal extension](https://github.com/openai/codex/tree/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/ext/goal)
- [OpenAI Codex: persisted Goal state](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/codex-rs/state/src/runtime/goals.rs)
- [OpenAI Codex Python SDK: coalescing physical turns](https://github.com/openai/codex/blob/68301fa45f0d8b692ff821c20073e747fe19250d/sdk/python/src/openai_codex/_goal.py)
- [OpenAI: Long-running work](https://learn.chatgpt.com/docs/long-running-work)
- [OpenAI: Scheduled tasks](https://learn.chatgpt.com/docs/automations)
- [OpenAI: Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- [Anthropic: Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)
- [Anthropic: Prompt-based hooks](https://code.claude.com/docs/en/hooks-guide#prompt-based-hooks)
- [Anthropic: Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)
