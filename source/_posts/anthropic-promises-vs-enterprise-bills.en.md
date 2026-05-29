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
i18n_key: anthropic-promises-vs-enterprise-bills
---

The boss asked: "How's our AI automated testing going?"

Nobody spoke.

A month earlier, someone had said it out loud — not for the first time.

The warning was clear: AI is unreliable, you can't build automated testing this way. What test systems fear most isn't incapability — it's instability.

Back then, it sounded like an excuse.

From the boss's position, it was genuinely hard to tell.

Is AI actually unreliable, or are your people just not good enough?

That's the most absurd part of the past few months.

In those polished, industry-disrupting demos, Agents could read requirements, write tests, run cases, file bugs, even judge whether a page looked correct. The narrative was frictionless: no more manual clicking, no QA scripts, no engineers filling in test gaps — AI would automate the entire quality system.

It sounded like software engineering was finally entering a new era.

Then the bill arrived.

After burning through millions of dollars, the team reached a conclusion: AI can't handle automated testing. You still need people and scripts.

Wait — we went through all that for *this*?

The surreal part isn't that AI failed to replace testing. It's that enterprises spent millions to rediscover something engineers knew ten years ago: software quality doesn't come from "looks smart." It comes from engineering discipline, stable interfaces, deterministic feedback, and boring-but-reliable automation scripts run over and over.

Anthropic, of course, would never frame it that way.

Anthropic talks about Agents, reasoning, computer use, end-to-end task completion, "every company will have a workforce of digital employees." Sounds impressive. Translated into plain language:

You pay first. Whether it works — that's a problem for the future.

## Anthropic's Real Advantage Isn't the Model — It's the Narrative

To be clear: Anthropic's models aren't weak.

They can write code, read docs, analyze logs, generate test cases, and complete tasks in controlled environments. Many of the capabilities are real, not fabricated.

The problem isn't capability. The problem is packaging.

**Anthropic's greatest strength isn't how powerful it has made the model — it's how well it has packaged "the model can do this once" into "enterprises can depend on this long-term."**

The gap between those two things is enormous.

In a demo, the Agent succeeds once — that's enough. In production, the system needs to succeed ten thousand times. In a demo, failure means a retake. In production, failure means someone takes the blame. In a demo, the environment is clean, the path is scripted, the data is prepped, the user cooperates. In production, the environment is dirty, the path is chaotic, the data is legacy, and users don't follow scripts.

Anthropic knows all of this. But they don't put it on the first slide. They clip the smoothest paths, magnify the smartest moments, and present the most future-looking fragments as inevitable trends. As for the permissions, context limits, false positives, manual review, integration costs, governance overhead, and accountability gaps in between — those all become a breezy:

"These will be solved as model capabilities improve."

Brilliant. Every problem that can't be solved today gets packaged and mailed to the future.

Anthropic doesn't sell certainty. It sells the ability to package uncertainty as certainty. That's where enterprises get caught. Not because leadership is foolish. Not because engineers don't understand. But because the story is too complete. It hits exactly what enterprises want to hear: fewer hires, fewer scripts, less process overhead, less grinding work — let Agents handle everything automatically.

Who wouldn't want to believe it?

<!-- more -->

## In the AI Hype Cycle, Technical Judgment Gets Mistaken for Excuses

A month ago, the engineer said "AI is unreliable."

Nothing wrong with that statement. But in context, it got complicated fast.

How do you know it's a technical fact and not the team resisting change? How do you know AI genuinely can't do it versus your people not knowing how to use it? How do you know the direction is wrong versus execution being the problem? How do you know the model lacks capability versus the prompt being badly written, context insufficient, toolchain improperly connected?

This isn't the boss being foolish. This gray zone appears whenever new technology gets deployed. With AI, the gray zone has been amplified tenfold by players like Anthropic. Every vendor pitches Agents, every demo shows "end-to-end task completion," every investor and analyst says enterprise software is about to be rewritten. Sitting in that seat, you can't help asking:

Everyone else is doing it. If we don't, will we fall behind?

So when an engineer says "AI is unreliable," the statement transforms in the conference room. It started as a technical judgment. It lands as a defensive posture — resisting change, avoiding new tools, protecting a comfort zone, pre-loading excuses for execution failure.

**In the AI hype cycle, the hardest thing isn't assessing model capabilities — it's figuring out who's telling the truth.**

The engineer might be right. The boss's skepticism might not be entirely wrong either. Over the past twenty years, too many "technically impossible" claims turned out to mean "that particular team didn't know how." Cloud computing was "insecure." Mobile was "just a toy." Every wave — low-code, Serverless, DevOps, Kubernetes — brought people saying it was unreliable. After hearing this enough times, leaders develop a reflex:

When you say it can't be done, is it that it can't be done, or that you can't do it?

Uncomfortable. But real.

The thing is, AI automated testing eventually proved something different: this time, the person who said "unreliable" wasn't being conservative. They were just stating the most basic constraints of any test system. Testing isn't a demo. Testing isn't magic. Testing isn't giving something smart the freedom to improvise. Testing is encoding "what correct means" as a deterministic contract.

Said a month ago: sounds like an excuse. Said a month later: that's a postmortem. What lies between isn't a gap in understanding — it's millions of dollars.

## AI's Strengths Are Exactly Testing's Weaknesses

LLMs are genuinely capable. They can parse requirements and infer user intent. They can generate tests from code. They can translate error logs into plain language. In simple scenarios, they can act like a junior QA — clicking around, catching obvious bugs. These capabilities are real.

This is also the cleverest part of Anthropic's narrative. It doesn't need to lie. It just needs to take a real capability and push it half a step further. The model can generate test cases — so it implies future tests can be completed automatically. The model can operate a browser — so it implies future regression testing can replace humans. The model can understand a page — so it implies future systems can judge business correctness. The model can complete a demo — so it implies enterprises can hand their entire quality system to an Agent.

Each step seems plausible individually. Connected together, it falls apart.

Because automated testing doesn't need "occasionally looks smart." It needs repeatability, stability, explainability, and replay. Run it 100 times today, get 99 consistent results. When it fails, localize the failure to a specific layer. False positive rate low enough that teams trust it. Cost low enough to run in CI every day.

AI works in the opposite direction. Every run feels like it's reacquainting itself with the world. Change the context slightly — the judgment shifts. The page flickers — the result changes. The requirement wasn't fully specified — it starts improvising. The button label changes — it adapts like a new hire.

**The thing test systems fear most isn't stupidity — it's instability.**

A dumb script that's stable creates value. A smart Agent that's unstable creates noise. Engineering teams don't fear limited tooling. What they fear is when failures look different every time.

When a script fails, it leaves a clear trace: the selector changed, the API went down, data was wrong, environment was broken. Fix it once — one fewer pit next time. When an Agent fails, it's different. Maybe it misread the page. Maybe it missed a business rule. Maybe the context window overflowed. Maybe the model had a bad moment. Maybe one line of the prompt had the wrong weight. Maybe everything was fine and it just made a different call this time.

That kind of failure is the most dangerous. It's not a bug — it behaves like a mood. Engineering systems can handle bugs. They can't handle moods. Because bugs can be reproduced. Moods can only be managed.

## The Agent in the Demo Is an Employee. In Production, It's an Intern.

AI automated testing demos are seductive. Give it a login page, it fills in credentials. Ask it to check the cart, it clicks through to checkout. Hand it a requirement, it generates test steps. Add "in the future, QA just reviews what AI produces" — sounds reasonable. Isn't this exactly what productivity gain looks like?

Real systems are not demos.

Real systems have staging environments, dirty data, permission layers, A/B experiments, pop-ups, fraud detection, flaky networks, legacy debt, and business rules buried in corners. Worse — real systems change every day.

The first thing an Agent does when it enters a real system isn't test — it gets lost. It doesn't know which accounts have permissions. It doesn't know why a button doesn't render for certain users. It doesn't know if an error toast is expected behavior or a bug. It doesn't know if a slow page is an environment issue or a performance regression. It doesn't know whether a failing case should be retried, skipped, reported, or escalated.

So the team starts patching its context. Account structures, environment docs, page layouts, business rules, exception handling, prompt tuning, eval pipelines, tracing, manual review. And somewhere in that process, everyone realizes something is wrong:

**This thing isn't replacing people. It's an intern who constantly needs the world explained to it, every result double-checked, and who never takes responsibility.**

The Agent's biggest problem isn't that it can't do the work — it's that it doesn't know when it's done it wrong. Testing can't accept this. Because testing isn't writing an essay — you can revise an essay. A bad test leads teams to misjudge quality. A false positive wastes engineering time. A false negative ships a bug to production. An unstable test system ends up being ignored by everyone.

It gets worse. Teams start bending their own workflows to make the Agent appear to function. A problem one Playwright script could solve now requires a prompt. A problem a mock server would handle now requires explaining data state to an Agent. A problem a single assertion would catch now requires asking a model whether "the page looks correct."

You think you're automating testing. You're actually automating the care and feeding of AI.

Anthropic calls this "human-in-the-loop." Sounds sophisticated. But much of the time, it means: when AI can't finish, you clean up; when AI judges wrong, you review; when AI gets lost, you navigate; when AI breaks things, you explain. The bill is still theirs. The accountability is still yours.

## What Enterprises Actually Buy Is a More Expensive Bill

Buying SaaS used to come with at least one guarantee: certainty. Jira standardizes process. GitHub standardizes code collaboration. CI standardizes builds and deploys. These tools don't necessarily make organizations smarter, but they lock in certain behaviors.

AI is different. A lot of AI products sell possibility, not certainty.

"It **might** cut your QA by 50%." "It **might** automatically surface production issues." "It **might** double engineering velocity."

The keyword is "might." This is also the shrewdest part of Anthropic's pitch. Say too much and you get held accountable. Say too little and nobody buys. The optimal play is to let every outcome hover at "might" — might replace, might improve, might restructure, might disrupt. Then charge enterprises a definite price for an uncertain future.

So token costs, platform fees, integration fees, consulting fees, PoC fees, internal headcount — it all adds up. The dashboard looks great: call volume impressive, token burn rate trending, transformation narrative locked in.

But at the end, there are only three questions that actually answer ROI: Who was doing this before? How much less are they doing now? Did the time saved turn into revenue, profit, or stronger organizational capability?

**Most AI automated testing projects die at the second question. Nobody's headcount changed. Script volume didn't drop. Review work didn't decrease. There's just an extra model call in the middle.**

Token is not productivity. Token is a cost unit. Wiring LLMs into every step of your test pipeline doesn't equal automation. In many cases, it converts cheap, deterministic, controllable engineering problems into expensive, uncertain, hard-to-debug AI problems.

Before: script fails, engineer reads the logs. After: Agent fails, engineer guesses what it was thinking. That's not efficiency — that's trading determinism debt for cognitive debt. Technical debt can be localized. Cognitive debt has no boundary. Every problem eventually becomes: try again, adjust the prompt, add more context, switch models, buy more credits. Looks like iteration. Feels like gambling. Just with a rebranded casino called "AI transformation."

## Testing's Core Purpose Is to Eliminate Ambiguity, Not Simulate Intelligence

There's a common misconception about automated testing: that its goal is to simulate a human. Which makes Agents appealing — humans look at pages, Agents look at pages; humans click buttons, Agents click buttons; humans judge whether results are correct, Agents seem to as well.

Anthropic loves this misconception. Because the moment you believe testing means "operating a system like a human would," you naturally start believing a smarter Agent can replace the human.

But testing's purpose isn't to simulate a human. **Testing's purpose is to turn quality judgments into machine-executable contracts.**

A good test isn't "smart like a human" — it hard-codes "what correct means." What does the API return? How does state change? What should be in the database? Did the event fire? How do permission boundaries apply? What's the performance threshold? The more precisely these are defined, the more valuable the test.

AI thrives in ambiguity. It's built to produce plausible answers inside fuzzy inputs. Testing is built to eliminate ambiguity. That's the fundamental conflict.

You can use AI to assist in writing tests — generate skeletons, fill in edge cases, explain failures, cluster log issues. That's genuinely valuable. But you cannot delegate to AI the decision of whether a system is correct. Because "correct" doesn't emerge from a model. It comes from business rules, API contracts, and the shared understanding engineers and QA have built about how the system should behave.

Testing isn't letting the machine improvise. Testing is refusing to let the machine improvise. The more critical the system, the less it can rely on intuition. Payments can't rely on intuition. Permissions can't. Ledgers can't. Deploys can't.

This is why so many AI testing projects eventually land back on Playwright, Cypress, JUnit, pytest, mocks, fixtures, CI, coverage, and contract tests. Not because these tools are glamorous. Because they're reliable. **In engineering, reliable usually beats smart.**

## The Real Cost Is Misdirected Priorities

Burning millions to confirm AI can't take over automated testing stings financially. But the more expensive cost is having priorities hijacked.

This can't be reduced to leadership not understanding technology, or teams executing poorly. More precisely: players like Anthropic have spent two years manufacturing an illusion — that if models keep improving, a lot of foundational engineering work can be skipped.

So when the right move is building test infrastructure, teams ask if they can buy an Agent instead. When the right move is cleaning test data, they wonder if prompt tuning would work instead. When the right move is building a stable environment, they wonder if multimodal page understanding might help. When the right move is defining quality standards, they wonder if the model can self-assess.

This is like studying smart interior design before the foundation is poured. The renovation isn't worthless. The building will collapse.

When AI projects fail, it's tempting to blame "the model isn't strong enough yet." That's the most convenient attribution — it pushes the problem into the future. This year the model isn't capable enough — try again next year. Next year the context window isn't long enough — try again the year after. After that the Agent isn't stable enough — keep waiting.

Who benefits most from this logic? Anthropic, obviously. Because every failure doesn't prove their narrative is flawed — it proves you should buy the next generation. Model not strong enough? Upgrade. Context too short? Upgrade. Tool calls unreliable? Upgrade. Too expensive? Wait for the next version. Results disappointing? Run another PoC.

Every road leads to a bill.

**AI can amplify engineering capability. It cannot replace it.** A team without a stable test system will become more chaotic after adding AI. An organization without clear quality standards will spend more after adding Agents. AI won't automatically fill in the lessons an organization missed — it will just illuminate the gaps more brightly.

## Where AI in Testing Actually Works

This isn't an argument that AI is useless in testing. The opposite. But its highest-value position isn't to take over testing end-to-end — it's to embed inside an existing engineering system and handle the low-risk, high-repetition, verifiable work.

Like recommending which tests need to be added based on a code diff. Like generating boundary cases from an API schema. Like analyzing failure patterns in flaky tests. Like clustering production error logs and attributing them to likely modules. Like helping QA convert natural language scenarios into Playwright skeletons. Like flagging in a PR: "you changed the permission check but didn't add a corresponding test."

These use cases share one property: AI isn't responsible for the final judgment. It proposes, humans confirm. It generates, scripts verify. It explains, the engineering system decides.

**AI works best as co-pilot. It can't be the seatbelt.** The seatbelt has to be certain. The co-pilot can be smart. These two roles cannot be swapped.

If an AI testing tool's value proposition is "you won't need to write tests," it's almost certainly a trap. If it's "you'll write reliable tests faster," there might be something there. The first is selling a fantasy. The second is selling a tool.

Anthropic prefers selling the first. Because fantasies have the largest TAM. "Help you write Playwright scripts faster" sounds like a utility. "The future testing team will be rewritten by Agents" sounds like a next-generation platform. Capital markets love the second story. Executive reporting loves it. Headline writers love it. But when it reaches the team doing the actual work, the first saves time and the second burns budget.

## What This Experiment Actually Proved

On its face, the millions-of-dollars conclusion is simple: AI cannot independently take over automated testing.

But that's not the full story. It also proved several harder things to say out loud.

It proved that many enterprises can't distinguish demo from productivity. It proved that many people can't tell apart "the model can do this once" from "the system can run stably long-term." It proved that the ROI of many AI projects was never seriously calculated from day one. And it proved that when a narrative gets hot enough, engineering common sense gets temporarily labeled as conservatism.

A month ago, the person who said "AI is unreliable" might still have been questioned. A month later, the bill proved them right. Does that feel satisfying? It doesn't. Because the organization already paid the tuition.

A mature organization shouldn't need a million-dollar bill to validate common sense. It should allow the team to say the uncomfortable things before the project kicks off. It should allow someone to ask: if this Agent fails, who's accountable? How do we verify the result? Which person does this workflow eliminate? How does this enter CI? Where exactly is this cheaper than our existing scripts?

If those questions can't be answered clearly, the project shouldn't be approved. Not because of being anti-AI. Because of respecting money.

Anthropic won't ask these questions for you. Their sales team won't either. What they hope you ask is: "When can we integrate?" "How many credits do we need?" "Can you support our use case?" But what enterprises really need to ask is: "If this fails, can we explain why?"

Most AI projects can't answer that question. If you can't answer it, you don't have an engineering system. You have an expensive wish machine.

## Anthropic's Promises Are Landing on Enterprise Balance Sheets

Over the past two years, AI companies told a beautiful story: Agents will take over knowledge work, software will write itself, tests will run themselves. Just plug in the model and you get a digital workforce that never sleeps, scales infinitely, and is always on call.

The story was irresistible. Irresistible enough that many people forgot to ask: what, exactly, has it saved us?

If an AI project burned millions of dollars and ultimately proved "testing still requires people and scripts," it did provide something — an expensive organizational education. It told leadership that AI isn't magic. It told the team that engineering discipline doesn't expire. It told finance that token burn doesn't equal transformation. It told everyone that the future in the demo doesn't directly convert to production productivity.

It was just a very expensive lesson.

The real question isn't whether Anthropic has capability. Anthropic clearly has capability. The question is that it describes capability boundaries too lightly, deployment costs too sparsely, and future returns too generously. It packages demo smoothness as production inevitability. It packages the model's occasional flashes of intelligence as productivity enterprises can purchase. It packages enterprise anxiety about cost reduction into an ever-thickening stack of token invoices.

Sales always pitches the roadmap. Startups always sell the future. Model companies always want you to believe "the next generation will solve everything." The real question is why enterprises are so ready to believe it.

Because "AI replaces humans" is a much sexier story than "go back and build out your automated testing infrastructure." The first sounds like the future. The second sounds like grinding work.

But most of what creates lasting value in software engineering is grinding work. Writing scripts. Filling in test cases. Cleaning data. Stabilizing CI. Defining quality standards. None of this disappears because Agents exist — it just finds different ways to come collect what it's owed.

Some of that bill you can pay to engineers. Some to QA. Some to infrastructure. You can also pay it to a model company. The difference is: after paying the first three, the organization grows capabilities. After paying the last one, you usually just grow the next bill.

Next time someone walks into the conference room with an AI automated testing demo — whether you're the boss, the engineer, the QA lead, or the person holding the budget — ask one question first:

**Is this improving our quality, or is it improving Anthropic's revenue?**
