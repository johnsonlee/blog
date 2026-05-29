---
title: "Anthropic's Promises Are Landing on Enterprise Balance Sheets"
date: 2026-05-29 10:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Agent
  - Automation
  - Testing
  - ROI
lang: en
i18n_key: ai-automation-testing-bill
---

The boss asked: "How's our AI automated testing going?" Nobody spoke. A month earlier, someone had said it out loud: AI is unreliable, you can't build automated testing this way. Back then, it sounded like an excuse.

## Burned Millions. Conclusion: Still Needs Humans.

In those dazzling, industry-disrupting demos, the Agent could read requirements, write tests, run cases, file bugs, even judge whether a page looked correct. The narrative was frictionless: no more manual clicking, no QA scripts, no engineers filling in test gaps — AI would automate the entire quality system.

It sounded like software engineering was finally entering a new era.

Then the bill arrived.

**After burning through millions of dollars, the team reached a conclusion: AI can't handle automated testing. You still need people and scripts.**

The surreal part isn't that AI failed to replace testing. It's that enterprises spent millions to rediscover something engineers knew ten years ago: software quality doesn't come from "looks smart." It comes from engineering discipline, stable interfaces, deterministic feedback, and boring-but-reliable automation scripts run over and over.

## In the AI Hype Cycle, Technical Judgment Gets Mistaken for Excuses

A month ago, the engineer said "AI is unreliable."

Nothing wrong with the statement itself. But in that context, it got complicated fast.

How do you know it's a technical fact and not the team resisting change? How do you know AI genuinely can't do it versus your people not knowing how to use it? How do you know the direction is wrong versus execution being the problem? How do you know the model lacks capability versus the prompt being poorly written, context insufficient, toolchain improperly connected?

This gray zone appears whenever new technology gets deployed. With AI, the gray zone is ten times larger. Every vendor is pitching Agents, every demo shows "end-to-end task completion," every investor and analyst is saying enterprise software is about to be rewritten. Sitting in that seat, you can't help asking:

Everyone else is doing it. If we don't, will we fall behind?

So when an engineer says "AI is unreliable," the statement transforms in the conference room. It started as a technical judgment. It lands as a defensive posture. Like resisting change, avoiding new tools, protecting a comfort zone, or pre-loading excuses for execution failure.

**In the AI hype cycle, the hardest thing isn't assessing model capabilities — it's figuring out who's telling the truth.**

Over the past twenty years, too many "technically impossible" claims turned out to mean "that particular team didn't know how." Cloud computing was "insecure." Mobile was "just a toy." Every wave — low-code, Serverless, DevOps, Kubernetes — brought people saying it was unreliable. After hearing it enough times, leaders develop a reflex: when you say it can't be done, is it that it can't be done, or that you can't do it?

That's an uncomfortable question. But it's real.

The thing is, AI automated testing eventually proved something different: this time, the person who said "unreliable" wasn't being conservative. They were just stating the most basic constraint of any test system.

Said a month ago, it sounds like an excuse. Said a month later, it's a postmortem. What lies between isn't a gap in understanding — it's millions of dollars.

## AI's Strengths Are Exactly Testing's Weaknesses

LLMs are genuinely capable. They can parse requirements and infer user intent. They can generate tests from code. They can translate error logs into plain language. In simple scenarios, they can act like a junior QA — clicking around, catching obvious bugs. These capabilities are real.

But automated testing doesn't need "occasionally looks smart."

Automated testing needs repeatability, stability, explainability, and replay. Run it 100 times today, get 99 consistent results. When it fails, you can localize the failure to a specific layer. The false positive rate is low enough that teams trust it. The cost is low enough to run in CI every day.

AI works in the opposite direction. Every run feels like it's reacquainting itself with the world. Change the context slightly, the judgment shifts. The page flickers, the result changes. The requirement wasn't fully specified, so it improvises. The button label changes, it adapts like a new hire.

**The thing test systems fear most isn't stupidity — it's instability.**

A dumb script that's stable creates value. A smart Agent that's unstable creates noise.

When a script fails, there's usually a clear trace: the selector changed, the API went down, data was wrong, environment was broken. Fix it once, one fewer pit next time. When an Agent fails, it's different. Maybe it misread the page. Maybe it missed a business rule. Maybe the context window overflowed. Maybe the model had a bad moment. Maybe one line of the prompt had the wrong weight. Maybe everything was fine and it just made a different call this time.

That kind of failure is the most dangerous. It's not a bug — it behaves like a mood. Engineering systems can handle bugs. They can't handle moods. Because bugs can be reproduced. Moods can only be managed.

## The Agent in the Demo Is an Employee. In Production, It's an Intern.

AI automated testing demos are seductive. Give it a login page, it fills in credentials. Ask it to check the cart, it clicks through to checkout. Hand it a requirement, it generates test steps. "In the future, QA just reviews what AI produces." Sounds reasonable — isn't this what productivity gain looks like?

Real systems are not demos.

Real systems have staging environments, dirty data, permission layers, A/B experiments, pop-ups, fraud detection, flaky networks, legacy debt, and business rules buried in corners. Worse — real systems change every day.

The first thing an Agent does when it enters a real system isn't test — it gets lost. It doesn't know which accounts have permissions. It doesn't know why a button doesn't render for certain users. It doesn't know if an error toast is expected behavior or a bug. It doesn't know if a slow page is an environment issue or a performance regression. It doesn't know whether a failing case should be retried, skipped, reported, or escalated.

So the team starts patching its context. Account structures, environment docs, page layouts, business rules, exception handling, prompt tuning, eval pipelines, tracing, manual review. And somewhere in that process, everyone realizes something is wrong:

This thing isn't replacing people. It's an intern who constantly needs the world explained to it, every result double-checked, and who never takes responsibility.

**The Agent's biggest problem isn't that it can't do the work — it's that it doesn't know when it's done it wrong.**

It gets worse. Teams start bending their own workflows to make the Agent appear to function. A problem that one Playwright script could solve now requires a prompt. A problem a mock server would handle now requires explaining data state to an Agent. A problem a single assertion would catch now requires asking a model whether "the page looks correct."

You think you're automating testing. You're actually automating the care and feeding of AI.

## Token Burn Is Not Productivity

Buying SaaS used to come with at least one guarantee: certainty. Jira standardizes process. GitHub standardizes code collaboration. CI standardizes builds and deploys. These tools don't necessarily make organizations smarter, but they lock in certain behaviors.

AI is different. A lot of AI products sell possibility, not certainty.

"It *might* cut your QA by 50%." "It *might* automatically surface production issues." "It *might* double engineering velocity."

The keyword is "might." So enterprises start paying for that "might." Token costs, platform fees, integration fees, consulting fees, PoC fees, internal headcount — it all adds up. The dashboard looks great: call volume impressive, token burn rate trending, transformation narrative locked in.

But at the end, there are only three questions that answer ROI: Who was doing this before? How much less are they doing now? Did the time saved turn into revenue, profit, or stronger organizational capability?

**Most AI automated testing projects die at the second question. Nobody's headcount changed. Script volume didn't drop. Review work didn't decrease. There's just an extra model call in the middle.**

Token is not productivity. Token is a cost unit. Wiring LLMs into every step of your test pipeline doesn't equal automation. In many cases, it converts cheap, deterministic, controllable engineering problems into expensive, uncertain, hard-to-debug AI problems.

Before: script fails, engineer reads the logs.  
After: Agent fails, engineer guesses what it was thinking.

That's not efficiency — that's trading determinism debt for cognitive debt. Technical debt can be localized. Cognitive debt has no boundary. Every problem eventually becomes: try again, adjust the prompt, add more context, switch models, buy more credits. Looks like iteration. Feels like gambling.

## Testing's Core Purpose Is to Eliminate Ambiguity, Not Simulate Intelligence

There's a common misconception about automated testing: that its goal is to simulate a human. Which makes Agents appealing — humans look at pages, Agents look at pages; humans click buttons, Agents click buttons; humans judge whether results are correct, Agents seem to as well.

But testing's purpose isn't to simulate a human. **Testing's purpose is to turn quality judgments into machine-executable contracts.**

A good test isn't "smart like a human" — it's a hard specification of "what correct means." What does the API return? How does state change? What should be in the database? Did the event fire? How do permission boundaries apply? What's the performance threshold? The more precise these are, the more valuable the test.

AI thrives in ambiguity. It's built to produce plausible answers inside fuzzy inputs. Testing is built to eliminate ambiguity. That's the fundamental conflict.

You can use AI to assist in writing tests — generate skeletons, fill in edge cases, explain failures, cluster log issues. That's genuinely valuable. But you cannot delegate to AI the decision of whether a system is correct. Because "correct" doesn't emerge from a model. It comes from business rules, API contracts, and the shared understanding engineers and QA have built about how the system should behave.

Testing isn't letting the machine improvise. Testing is refusing to let the machine improvise.

This is why so many AI testing projects eventually land back on Playwright, Cypress, JUnit, pytest, mocks, fixtures, CI, coverage, and contract tests. Not because these tools are glamorous. Because they're reliable. **In engineering, reliable usually beats smart.**

## The Real Cost Is Misdirected Priorities

Burning millions to confirm AI can't take over automated testing stings financially. But the more expensive cost is having your priorities hijacked.

The industry spent the past two years manufacturing an illusion: if models keep improving, a lot of foundational engineering work can be skipped.

So when the right move is building out test infrastructure, teams ask if they can buy an Agent instead. When the move is cleaning test data, they ask if they can adjust the prompt instead. When the move is building a stable environment, they ask if multimodal page understanding might work instead. When the move is defining quality standards, they ask if the model can self-assess instead.

This is like studying smart interior design before the foundation is poured. The renovation isn't worthless. The building will collapse.

When AI projects fail, it's tempting for organizations to blame "the model isn't strong enough yet." That's the most convenient attribution, because it pushes the problem into the future. This year the model isn't capable enough — try again next year. Next year the context window isn't long enough — try again the year after. After that the Agent isn't stable enough — keep waiting. So bills arrive in waves, organizations burn in waves, and everyone acquires a very modern illusion: if models keep improving, engineering discipline can be bypassed.

It can't.

**AI can amplify engineering capability. It cannot replace it.** A team without a stable test system will become more chaotic after adding AI. An organization without clear quality standards will spend more after adding Agents. AI won't automatically fill in the lessons an organization missed — it will just illuminate the gaps more brightly.

## Where AI in Testing Actually Works

This isn't an argument that AI is useless in testing. The opposite is true. But its highest-value position isn't to take over testing end-to-end — it's to embed inside an existing engineering system and handle the low-risk, high-repetition, verifiable work.

Like recommending which tests need to be added based on a code diff. Like generating boundary cases from an API schema. Like analyzing failure patterns in flaky tests. Like clustering production error logs and attributing them to likely modules. Like helping QA convert natural language scenarios into Playwright skeletons. Like flagging in a PR: "you changed the permission check but didn't add a corresponding test."

These use cases share one property: AI isn't responsible for the final judgment. It proposes, humans confirm. It generates, scripts verify. It explains, the engineering system decides.

**AI works best as co-pilot. It can't be the seatbelt.** The seatbelt has to be certain. The co-pilot can be smart. These two roles cannot be swapped.

If an AI testing tool's value proposition is "you won't need to write tests," it's almost certainly a trap. If it's "you'll write reliable tests faster," there might be something there. The first is selling a fantasy. The second is selling a tool. Where enterprises most often go wrong is purchasing the fantasy thinking it's the tool.

## Ask Yourself: Is This Improving Our Quality, or Anthropic's Revenue?

Over the past two years, AI companies told a beautiful story: Agents will take over knowledge work, software will write itself, tests will run themselves. Just plug in the model and you get a digital workforce that never sleeps, scales infinitely, and is always on call.

The story was irresistible. Irresistible enough that many people forgot to ask: what, exactly, has it saved us?

If an AI project burned millions of dollars and ultimately proved "testing still requires people and scripts," it did provide something — an expensive organizational education. It told leadership that AI isn't magic. It told the team that engineering discipline doesn't expire. It told finance that token burn doesn't equal transformation. It told everyone that the future in the demo doesn't directly convert to production productivity.

It was just a very expensive lesson.

The real question isn't whether AI companies overpromised. Sales always pitches the roadmap. Startups always sell the future. Model companies always want you to believe "the next generation will solve everything." The real question is why enterprises were so ready to believe it.

Because "AI replaces humans" is a much sexier story than "go back and build out your automated testing infrastructure." The first sounds like the future. The second sounds like unglamorous work.

But most of what creates lasting value in software engineering is unglamorous. Writing scripts is unglamorous. Filling in test cases is unglamorous. Cleaning data is unglamorous. Stabilizing CI is unglamorous. Defining quality standards is unglamorous. None of this disappears because Agents exist — it just finds different ways to come collect what it's owed.

Some of that bill you can pay to engineers. Some to QA. Some to infrastructure. You can also pay it to a model company. The difference is: after paying the first three, the organization grows capabilities. After paying the last one, you usually just get the next bill.

Next time someone walks into the conference room with an AI automated testing demo, whether you're the boss, the engineer, the QA lead, or the person holding the budget — ask one question first:

**Is this improving our quality, or is it improving Anthropic's revenue?**
