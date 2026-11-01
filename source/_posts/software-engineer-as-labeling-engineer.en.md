---
title: "The destination of software engineers—labeling engineers"
date: 2026-11-01 10:00:00
lang: en
categories:
  - Harness Engineering
tags:
  - AI
  - Software Engineering
  - Ground Truth
  - Eval
i18n_key: software-engineer-as-labeling-engineer
---

I recently read the Proton CTO's AI manifesto, “AI @ Proton, Engineering Manifesto.” One sentence was direct: an engineer's job has become helping LLMs write better code faster. The manifesto describes engineers as team leaders, with models and agents as their direct reports.

A different job title came to mind: labeling engineer. **Software engineers end up as labeling engineers. Wherever an LLM cannot obtain ground truth on its own, humans supply the judgment.** That title sounds less prestigious than “managing an AI team,” but it is closer to the work people actually do.

<!-- more -->

## You already label model outputs every day

You ask an agent to build a feature. The first version arrives and you say, “Wrong. This case should return an error.” The second arrives: “The behavior is right, but you cannot introduce that dependency.” The third finally passes, and you click Accept.

Each action is a label. You supplied a negative example, added a constraint, and confirmed an acceptable result. Those judgments used to be embedded in code you wrote yourself. Now the model generates the code, and you deliver the judgment separately.

Requirements clarification works the same way. A user asks to “support revoking access.” You understand that this means more than deleting a database record. Users who are already signed in must lose access too, and cached permissions must not keep granting it. Making those conditions explicit turns a vague intention into checkable behavior.

This also explains why knowing how to code does not necessarily mean knowing how to work with an agent. Previously, you could revise your understanding while implementing it. Many decisions never had to leave your head. Now another executor needs a sufficiently clear signal. “This implementation isn't good enough” still gives the model an assessment without an answer.

Labeling here is broader than assigning categories in a training dataset. It includes expected outcomes, counterexamples, acceptance criteria, and preferences with reasons attached. These may never enter the model's weights, but they change what the next agent run can see and which results get accepted.

## Who supplies the answer after the tests pass?

Suppose an agent implements access revocation. It submits a PR with a Test Report: the revocation endpoint returns success, the permission record is deleted, and all tests pass.

After reading the PR, you try an account that is already signed in and has just accessed the resource. You revoke its permission, but it can still read the resource. The implementation deleted the database record, while the authorization layer kept using the old cached permission. The green checks in the Test Report establish only that the conditions it tested passed.

Asking it to add a “permission deleted” test will not help if the assertion still checks only the database. The misunderstanding simply gains another executable copy. I discussed this in {% post_link agent-tdd-is-self-verification.en 'Does an agent really need TDD?' %}: **what matters most about a test is where its answer comes from, not whether it was written first.**

Here, the answer comes from the access contract: after revocation, a session that previously had access must also be denied. The engineer must bring that condition into the validation environment. The test first accesses the resource to populate the permission cache, revokes access, and then makes another request using the same session to verify that it is denied.

Once that check exists, a person no longer needs to decide every time whether revocation affects existing sessions. The model can run tools, read failures, and repair the implementation until it passes. The Test Report attached to the PR also becomes more specific: it records which scenario and assertion passed on this commit. A human label has become a rule a machine can execute repeatedly.

But the feature has another question. Should revoking access also interrupt a download already in progress? Internal documents and a public asset library may need different answers. The compiler cannot decide this, and the test framework has no such rule. You need to find the users and establish the costs of continued transfer and forced interruption.

**Tools handle what can be verified automatically. Humans work on what has not yet been defined as correct.** That boundary moves. A rule that needs discussion today can enter the product contract tomorrow and become an automated check. Engineers should not spend their careers grading the same question.

## Human labels can be wrong too

In {% post_link ground-truth-core-competency-of-ai-engineering.en 'Ground truth: the most underrated competitive advantage in the AI era' %}, I argued that we cannot keep using human brains as ground truth. Manual review cannot keep pace with generation. Another distinction needs to be explicit here: a human answer is not automatically the truth.

“The original session can still read the resource after revocation” is a checkable fact. “Even downloads already in progress must stop” is a product choice. “Resource owners would rather interrupt an ongoing download than allow transfer to continue after revocation” is a hypothesis that needs testing. Store all three as a single approved label, and the next agent may treat a hypothesis as an inviolable fact.

Senior engineers can label things incorrectly. The customers they know best may no longer be the main users. A dependency boundary they insist on may have served a migration that ended long ago. Their judgment has a history and an expiration date. Writing it into AGENTS.md does not extend its shelf life.

Useful labels therefore preserve evidence and conditions alongside the conclusion: which user scenario requires this behavior, which incident exposed the problem, and why the tradeoff is acceptable now. When two engineers disagree, there is no need to immediately label one answer correct. First establish whether they are making decisions for different users or different stages of the product.

[Anthropic's guide to agent evals](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) distinguishes code, model, and human graders, noting that model graders require calibration against human judgment. That is a division of evaluation work. Human judgment itself still needs to be checked against actual usage and outcomes.

An LLM may lack ground truth because it lacks tool access, because information has never been recorded, or because the question has no single correct answer. The first two call for access and evidence. The last calls for a decision owner and an explicit tradeoff. “Ask someone to click approve” cannot fill every gap.

## Label it once or label it forever

The same PR and Test Report can produce two ways of working.

In the first, every time the agent submits a PR, you read the code from scratch, check the Test Report, and manually prepare an account, populate the cache, revoke permission, and verify that access is denied. You are diligent and busy. The faster the model generates, the longer your acceptance queue becomes. Eventually, your available time caps the team's output.

In the second, the first failure leaves behind a scenario, the session state, and the expected behavior. You turn them into a regression check in CI. The system catches subsequent instances, and the Test Report traces back to the specific commit and cases actually executed. You handle new situations: ordinary requests are denied, for example, but nobody has yet decided whether an ongoing download should stop.

Both involve labeling, but they accumulate different things. The first accumulates tasks. The second accumulates reusable judgment.

This is why the title still needs the word engineer. Knowing what is wrong gets you only halfway. You must isolate the failure conditions, separate symptoms from causes, and design a check that catches the error without rejecting valid implementations. Requiring a PR to call a particular cache invalidation function may be too strict: it could block a different, correct authorization design. Counting passes in a Test Report is too loose: a hundred tests can pass without a single one checking access after revocation.

The verification mechanism requires engineering judgment too. A model can help implement the check, but someone still has to investigate what that check actually proves.

In the manifesto, the Proton CTO asks engineers to help models do better next time, mentioning repository context, shared skills, and investigations into repeated failures. In this sense, “better next time” can happen without retraining a model at all. An independent sample added to the tests or a new verification tool already changes the agent's operating environment.

## This job will not absorb every programmer

Calling engineers AI team leaders invites a comforting assumption: once we stop writing code ourselves, everyone gets promoted to managing a tireless team.

But if one engineer's checks can serve many agents, the same class of work may need fewer people. More generation does not mean human review should grow proportionally. Reducing repeated judgment is precisely the point of engineering it. Labeling engineer is no employment guarantee achieved by renaming existing jobs.

My assessment of implementation roles in {% post_link what-engineers-are-still-for.en 'What are engineers still for?' %} has not changed. The ability to translate explicit requirements into code is losing its former scarcity. The remaining work requires identifying unstated constraints, finding evidence independent of the model, and delivering those judgments to the system.

That requires understanding implementation. If you cannot follow how authorization requests use the cache, you may never realize that the “permission deleted” test checks the wrong thing. Without understanding session state, you cannot design a regression case that exposes the problem. Implementation knowledge now serves a different purpose: judging whether the model's work is correct and enabling the system to detect when it is not.

Software engineers end up as labeling engineers. That is the shift in the work's center of gravity I mean. Where the model cannot obtain an answer, humans first supply a judgment backed by evidence. Once the judgment can be verified, they hand it over to the machine.

The next time an agent delivers a PR and Test Report, your value is not that you checked everything from scratch again. It is that the error you found last time no longer needs you to find it.
