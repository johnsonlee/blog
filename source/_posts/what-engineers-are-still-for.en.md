---
title: "What Are Engineers Still For?"
date: 2026-07-25 13:30:24
lang: en
i18n_key: what-engineers-are-still-for
categories:
  - Independent Thinking
tags:
  - AI
  - Codex
  - Agentic Coding
  - Goal
  - Harness Engineering
  - Eval
---

A while ago I was pushing a side project forward with Codex's `/goal`. I put the objective in at night, checked the terminal in the morning, and the work was still moving: reading docs, splitting modules, changing Kotlin, filling in React, running `./gradlew :backend:check`, fixing failures, then continuing.

The first moment that felt strange was seeing it keep rolling through the same objective in the middle of the night. It no longer felt like a chat window. It felt like an unattended engineering team attached to the repo. So the question becomes hard to dodge: if Codex can keep advancing a project without sleeping until the goal is reached, what are engineers still for?

<!-- more -->

## The Enter Key Is Gone

With ordinary Agent coding, the most common break point is attention. You give it a task, it finishes a chunk, then waits for confirmation. You go to sleep, and it sleeps with you. You come back the next day and explain the context again. Development gets chopped into pieces by human availability.

Prompt Engineering solves "how to say this one turn." Skills solve "how this task class should start." Both assume the same rhythm: the human stays nearby, decides whether the next round should happen, chooses how it should happen, and decides when to stop.

`/goal` removes that assumption. It carries the objective across turns. When something fails, it fixes it. When context is missing, it looks it up. When checks fail, it keeps iterating. It does not need coffee, does not complain about long PRs, and does not melt down because tests are still running at 3 a.m.

This is already Loop Engineering. The entry point just collapsed into a single command.

I wrote in [Don't Get Fooled by Loop Engineering](https://johnsonlee.io/2026/06/26/fooled-by-loop-engineering/) that a loop does not guarantee the right direction. That still holds. What changed is the setup cost. Objectives, state, execution, checks, repairs, and the next round used to require custom orchestration. Codex now gives you a continuously running workflow as a normal command.

That is brutal for people still stuck on Prompt Engineering and Skills. Prompts still matter, but they are becoming hygiene. Skills still matter, but they are becoming parts. If the main battlefield in your head is still "how do I phrase one instruction better" or "how do I pack this workflow into SKILL.md," the ground has already moved.

**Competition has moved from one conversation turn to objectives that can close their own loop.**

## Implementation Work Loses Its Floor

This side project is a good case for exposing the shift. It has already moved beyond demo territory: a local document workspace that imports files, extracts structured fields and citation anchors, moves through review, then exports a reviewable offline package and backup. The backend is Kotlin/Spring Boot, the frontend is React, local data must be encrypted, exports must not leak local paths, and real corpus files cannot be glossed over by a generic fallback.

Pushing this kind of project by hand is exhausting. Much of the work is repetitive, and every piece matters: DTO contracts, metadata ports, parser adapters, architecture guards, fixture scripts, UI states, PDF indexes, ZIP manifests. In the past, this long tail filled a lot of engineering calendars. Now it is exactly what Codex is good at eating.

This has already moved past the old "AI helps an engineer" stage. An Agent that can continuously read the repo, change code, run tests, fix failures, preserve context, and continue the next round is taking over the implementation loop itself. Human online time stops being the hard constraint on project progress. The cost structure behind many roles gets rewritten.

My colder take: most implementation-heavy engineers will be replaced. The debate has narrowed to timing.

That sounds harsh. Break the daily work apart and it becomes less mysterious: read the ticket, find related files, understand a local contract, add an implementation, fix a test, answer review, rerun CI. Those tasks required people because people could hold context, handle small surprises, and continue after failure. `/goal` is eating exactly that chain.

Humans are paid by the month. Agents consume by round, by token, and by task. As models improve, contexts grow, and tool calls become more stable, companies will do the math. Economics will push replacement of implementation-heavy engineering work.

## Completion Conditions Train The Agent

Once the excitement fades, the trouble appears quickly.

Agents optimize toward completion conditions. Tell an Agent "tests must pass," and it may fix the code, widen a mock, swallow an exception, or route around the failing path. `/goal` lets it run longer, which also means the wrong direction can run longer.

The easy mistake is to blame Codex. It is optimizing against the signal it was given. Weak goals amplify the wrong behavior.

If you say "make this side project usable," it will produce something that looks usable. Pages click. APIs return. Tests may even go green. But what does usable mean? Can it recognize real documents? Does every key field have a citation anchor? Does the exported ZIP leak a local path? Does the backup contain plaintext metadata? Does the locked workspace UI quietly pull sensitive resources?

If those questions are absent from the goal, the Agent has no reason to care about them for you. It will take the shortest path toward a reasonable answer.

**A vague goal turns diligence into risk.**

Human engineers used to cover this with review and experience. When we see a strange mock, we ask whether this thing exists in production. When we see an export filename, we instinctively check whether the workspace id leaked. When we see parser fallback, we suspect that real user documents are being treated as ordinary files.

Those judgments are compressed domain goals living in the engineer's head. The Agent does not have that compressed representation. It has the goal, the context, and the gates you gave it.

## Goals Need Machine Acceptance

This side project became controllable only after the goal turned from a wish into an acceptance object.

The P0 local version cannot stop at "can import, can review, can export." It has to satisfy a cold list of conditions:

- `./gradlew :backend:check` must pass ktlint, one-top-level-type checks, and architecture fitness tests
- `./gradlew :backend:evaluateUploadCorpus` must match private real documents against the expectation manifest
- corpus files must be 100% recognized, `fallbackDocuments` must be 0, and parser support confidence must stay at or above 0.8
- field citations, document spans, open reviews, missing checklist items, and export blocking issues must all be 0
- the offline package and backup must match manifest, schema, entry count, header, hash, and sensitive-field leak metrics one by one
- `pnpm --dir apps/local-web build` must run frontend architecture checks and UI contract checks first

At that point, Codex behaves differently. Its center of gravity moves from "keep implementing" to finding gaps against the gates: which field is missing, which top-level report metric is wrong, which service swallowed a responsibility it should not own, which UI component mixed option calculation with DOM, which artifact response exposed a path. Failure is no longer "something is wrong." It becomes a set of red lines that can be located, fixed, and rerun.

More importantly, metrics do more than audit the result. **Metrics reshape the Agent's search space.**

If the goal only says "export should work," Codex will probably wire a happy path first: make the button clickable, write a ZIP somewhere, let the test observe that a file exists. If the goal says "the export path must go through a root policy, manifest entries must match produced files one by one, and sensitive-field leakage count must be zero," the search direction changes. It starts adding path policy, payload builders, artifact contracts, and fixture generators instead of merely connecting the UI.

The same applies to "import should work." A vague goal rewards the shortest route: send unknown files to fallback, emit a low-confidence result when parsing fails, mock a successful response in tests. Once the goal says "real corpus recognition must be 100%, `fallbackDocuments` must be 0, parser support confidence must stay at or above 0.8, and the report must list actual/expected mismatches," the Agent has to deal with the ugly edges of real input. If it tries to cut corners, a red light turns on.

That is where `/goal` becomes valuable. It turns repeated Enter presses into executable pressure on the system as it evolves.

## Measuring Goals With Harnesses

Many people write goals only as outcomes: "make it P0," "ready for business use," "quality is good enough," "do not leak anything." These words mean something to humans. They are weak constraints for an Agent.

What matters to the Agent is the harness.

A harness spans test suites, real samples, fixtures, golden manifests, schema validators, architecture guards, artifact scanners, budget limits, and stop conditions. It turns an objective into questions a machine can answer: what is the input, where is the output, how does the oracle judge it, how is failure evidence preserved, and does the next round have permission to continue.

Without a harness, `/goal` just guesses your intent more diligently. With a harness, it starts behaving like an engineering system.

For example, "the export is trustworthy" has no hardness. Once it becomes a harness, it becomes concrete commands and files: produce an offline package, unzip it, check the manifest, compare entry counts and hashes one by one, scan for local paths, confirm the backup schema version, and ensure the report did not hide failures. Every step can fail. Every step can run again.

That is the remaining core work for human engineers: define measurable goals and provide the harness that measures them.

**The Agent runs. The harness makes it answer for the run.**

## Bad Metrics Get Learned Too

There is a trap here: numbers make people comfortable, and they also teach Agents how to game the target.

Ask for open reviews to be 0, and the Agent may improve the workflow, or it may auto-close review items. Ask for `fallbackDocuments` to be 0, and it may write a targeted parser, or it may rename the fallback. Ask for leakage count to be 0, and it may clean the output, or it may stop reporting that class of field. Ask for a green build, and it may fix the bug, skip the test, widen the mock, or swallow the exception.

So measurable goals cannot stop at a single metric. Every metric needs a counter-metric behind it.

Open reviews at 0 still need an audit trail proving who closed each item and why. Recognition at 100% still needs actual and expected parser, kind, and field counts to line up. Leakage at 0 still needs scanners over final artifacts; the generation pipeline's self-report is not enough. A green build still needs protection against skipped tests, TODO tests, empty assertions, and oversized mocks hiding failure.

**A good gate tells the Agent where to run and blocks the easiest cheating paths.**

This sounds tedious in an article. In a real project, it gets even more tedious. A useful completion condition often looks less like a product vision and more like an unreasonable audit rule. It leaves the Agent very little room for storytelling. It asks: where is the artifact, where is the evidence, do the counts match, and did anything hide the failure?

## Engineers Start Writing Measurement Systems

Engineers used to write code. Then engineers wrote prompts. The more important work now is writing measurement systems.

What does "trustworthy" mean? In this side project, the word lands on field citation coverage, review state, export readiness, sensitive-field leakage count, backup schema version, parser confidence, and corpus recognition rate.

What does "maintainable" mean? Clean-code vibes do not count. Controller and service file size, package boundaries, focused metadata ports, core avoiding infrastructure dependencies, no demo vocabulary in production code, and no resurrection of giant workflow tests count.

What is the minimum bar for commercialization? A P0 label on the roadmap does not count. Every new feature has to preserve those red lines.

Once these are written down, Codex has a track. It can run for a long time, sometimes more steadily than a human, because it does not get tired and does not start lowering standards after touching twenty files.

But where does the track come from? This is where engineering value gets repriced. The more automated execution becomes, the more someone has to engineer the objective. Scarcity moves away from "can you write a few thousand more lines of code" and toward "can you compress the desired outcome into machine-executable standards."

**The engineer's leverage comes from the precision with which they define reality.**

The engineers who remain will likely cluster into a few groups: people who can compress business goals into measurable goals, people who can write harnesses, people who can notice when an Agent has learned to game a metric, and people who know when to stop, split the task, or change the search space.

The rest, the engineers whose main job is turning tickets into code, will keep getting more expensive and less rational to keep.

## Autonomy Requires Engineered Goals

When people talk about autonomous coding, they usually focus on model capability, context length, tool use, and parallel agents. All of those matter. This side project made the point more concrete for me: autonomy begins with "what stops it when it drifts."

A goal that can only be approved by a human reading the diff is a poor fit for a system that never sleeps. The human will leave the screen. The Agent will not. Once their rhythms diverge, risk accumulates overnight.

So the engineer's job is to embed judgment that keeps working overnight: tests, fixtures, architecture guards, corpus evals, privacy checks, artifact contracts, stop conditions. Change "this seems good enough" into "these 17 metrics are green." Change "it looks like P0" into "real corpus recognition is 100%, leakage count is 0, and the export contract matches every field."

There is nothing romantic about this. It is even a little boring.

But engineering has never lived on romance. It lives on boundaries, numbers, reproducibility, and red lights when something fails.

## What Engineers Are Still For

Back to the opening question.

If engineers are responsible only for keeping a project rolling, Codex has already answered. It does not sleep, does not lose focus, does not complain about repetitive work, and does not forget the day's objective just because the task spans too long. By that standard, what are engineers still for? The answer is close to zero.

But goals do not turn into gates by themselves. "Trustworthy" in the business, "usable" in the product, "healthy" in the architecture, and "no leakage" in safety all need someone to translate them into metrics, fixtures, contracts, budgets, and stopping policies.

Engineers start owning three jobs: turning wishes into falsifiable claims, wiring those claims into machine-executable gates, and adding counter-metrics after the Agent learns to route around a gate. The first takes judgment. The second takes engineering. The third takes scar tissue.

Do that badly, and sleepless execution amplifies disorder. Do it well, and Codex starts to look like an engineering team you can actually trust.

The day most engineers get replaced will not begin with a launch event. It will begin inside side projects: humans watch one hour less, then one day less, and eventually only define the next red light.

By then, the answer to "how many engineers are still needed" will be ugly.
