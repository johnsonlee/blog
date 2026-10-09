---
title: "At the Crest of Another Wave"
date: 2026-10-09 16:30:00
lang: en
categories:
  - Career
tags:
  - AI
  - Agent
  - Agentic Engineering
  - Harness Engineering
  - Eval
  - Career
i18n_key: at-the-crest-of-another-wave
---

Back when I was working on Booster, I wanted to build a dataflow analysis framework based on a code graph. I never had the time to get around to it. Early this year, I needed a tool to check how accurately an agent could find remnants of A/B experiments in code. So one weekend, I picked the idea back up with Opus 4.5, just to see how it would go.

Claude Code took one hour. It wrote everything itself, from the architecture to the tests. I had written this kind of tool by hand before; it would take me at least two weeks. An idea I had put off for so long was now built, just like that. After about twenty years of programming, I had always felt that whatever happened to the industry, I could still count on this craft. Now it could do it too, and so much faster than me. If one day nobody needed me to write code, what would I have left?

<!-- more -->

For the next two weeks, I tested its limits obsessively, trying to find something it could not do. Each attempt left me a little less room to reassure myself. In this industry, 35 is an unspoken threshold. I had worked hard to make it past that point on the experience and craft I had accumulated. Now I looked back and found that the things I had relied on were changing too.

Eventually, even sleep did not interrupt that immersion. In {% post_link tetris-effect-of-ai-conversations.en 'Inception via AI: The Tetris Effect of Conversations' %}, I recorded how, after half a month of intense AI use, I started dreaming about talking to it every night, for many nights in a row. I had rarely dreamed before. The conversations carried on into my sleep. I called it the "Tetris effect" at the time. I was desperate to understand where this change would take me.

Over the next three quarters, I worked intensively on agentic engineering almost every day. That question stayed with me. As I went deeper into the work, my understanding of it gradually changed.

## From writing skills to delivering features

I started by putting my experience with particular tasks into skills, telling agents where to look, what to watch for, and which steps they could not skip. Then I began building agentic workflows, connecting requirements, implementation, checks, and delivery so that an agent could take a feature all the way to production.

At that stage, attention easily falls on process: how to break down tasks, retry failures, carry context forward, and keep the next iteration going. These problems need solving; otherwise the agent stops halfway through and someone still has to watch it constantly. But once it could keep going, another question became harder to ignore: when it says it is done, on what basis do I accept the result?

A successful build and passing tests mean something. But misunderstood requirements, tests that merely confirm the agent's own interpretation, and changes that break other commitments in the larger system do not disappear because the workflow runs. Faster implementation makes the work left to people more visible.

Suppose ten agents submit ten diffs at once, and the team still depends on the same senior engineer to read every line. Faster output means a longer acceptance queue. Running the agents for a few more iterations cannot decide what that engineer should examine. As I wrote in {% post_link fooled-by-loop-engineering.en "Don't Let Loop Engineering Fool You" %}, continuous execution and continuous progress toward correctness are different things.

These problems have not changed my view in {% post_link what-engineers-are-still-for.en 'What Are Engineers Still For?' %} about the replacement of implementation work. What agents can already do will not become scarce again because I miss writing the code myself. I was beginning to see, though, that some work beyond implementation had not passed to the agent along with it.

That work had always been there. It was just mixed in with writing code, making it harder to see on its own.

## Where my effort went once the workflow worked

There are already plenty of workflow products to choose from. [LangGraph](https://github.com/langchain-ai/langgraph) provides durable execution, state management, and human intervention. [n8n](https://docs.n8n.io/advanced-ai/) can also orchestrate agents and business tools into workflows. These products have their own limits, but with those capabilities available, I had to ask myself whether to keep spending time on similar mechanisms or work on the questions they had not answered.

My effort gradually shifted toward harnesses, evals, and verification. A harness gives an agent context, tools, an execution environment, and feedback. State persistence, tool interfaces, and returning check results also have plenty of reusable approaches.

[Graphite](https://github.com/johnsonlee/graphite), which I have been building, supplies code context and analysis capabilities within a harness. It builds program graphs from JVM bytecode, turns calls, dependencies, and dataflow into queryable structure, and exposes that structure to agents through MCP. A/B experiment cleanup needs these capabilities. Other tasks that involve understanding code and checking changes can reuse them.

Looking back, why had I revived that shelved tool early in the year? Because the agent had found some experiment code, and I needed a way to check its results. Between its claim that "I found all of these" and my ability to confirm that "nothing was missed within the agreed scope," a piece of evidence was missing.

Even with the graph, the work is not finished. Graphite can tell us which calls a value flows into. That relationship alone cannot determine which branch the business should remove. The same tools can serve different projects; what each project may delete and must preserve still needs to be defined again.

Here the value of eval and verification becomes concrete. Eval defines the task, samples, and criteria clearly enough to assess. Verification obtains trustworthy evidence to determine whether a particular artifact meets the requirements. One makes "what counts as correct" specific enough to evaluate; the other establishes whether this attempt got it right.

In Graphite, I put that sequence into the development process: define the benchmark gate first, then start having agents submit PRs. But deciding what counts as a performance regression already requires judgment. Left to define it, an agent focuses on building, saving, loading, and querying a single graph. Every operation is covered. At first glance, it looks entirely reasonable.

I would not use those measurements to decide whether a change passed the performance gate. Those single-graph operations in Graphite already take very little time in absolute terms. A small fluctuation in the execution environment can become a large percentage regression against the baseline. If the numbers worsen, did the change slow down the system, or did the environment affect the measurement? A PR gate that cannot distinguish the two can send an agent repeatedly optimizing around noise. In this case, the agent did not recognize that measuring every operation still did not mean it had chosen the right workload for assessing performance.

I defined performance regressions using representative load tests involving multiple graphs and large graphs, assessing changes through the metrics under that load. Multiple graphs must actually participate in the measured requests; loading several graphs while querying only one does not qualify. Single-graph tests can remain as correctness checks, while performance acceptance relies on the load tests. I want to understand how the system behaves under that workload. Changes in the duration of an isolated lightweight operation cannot answer that question.

An agent can write the benchmark code. Choosing the workload and deciding which changes warrant blocking a PR require my judgment about the system and the measurements. This made the shift clearer to me: experience accumulated through engineering work was becoming the criteria an agent needed before it started.

There are also general-purpose frameworks for eval and verification. [Braintrust, for example, runs both built-in and custom scorers](https://www.braintrust.dev/blog/custom-scorers). I discussed this boundary in {% post_link is-harness-the-agent-moat.en "Is the Harness Still an Agent's Moat?" %}: the mechanism for running evaluations can be bought. Which samples represent the business, which results deserve acceptance, and what evidence supports delivery still require specific judgment.

**The parts of eval and verification that require understanding the business and the system are where I want to keep investing my effort.** There is still no complete, ready-to-use solution to these questions that holds across businesses, and one would be difficult to build. The answers are scattered across system constraints, business decisions, past incidents, and actual usage. The same output can receive opposite judgments under different compatibility commitments and risk requirements.

At first, I was looking for code the agent could not yet write. Following the work led me increasingly toward questions I needed to answer clearly: why do this, how far must it go before it can ship, and what will establish that it is ready? Looking back at the career path engineers had followed, I realized these questions were familiar.

## Looking back at the career ladder

I spent many years on that path myself. Companies use different names, but the ladder generally runs Junior → Senior → Staff → Principal → Distinguished. Many people understand it as writing better code and solving harder problems. Looking at the responsibilities, a more pronounced change is that you define what counts as correct across a growing scope, and take responsibility for the outcome.

The exact boundaries differ between companies. Following that idea, I would summarize the traditional engineer's R&R (Role & Responsibilities) this way:

| Level | Scope of responsibility | Core responsibilities |
| --- | --- | --- |
| Junior | Tasks already broken down | Understand the given requirements, implement them, and establish completion against existing criteria |
| Senior | A feature or module | Independently clarify boundaries, choose an approach, define success criteria, and own delivery and operational outcomes |
| Staff | Problems shared by multiple teams | Coordinate interfaces and constraints, establish shared metrics and feedback mechanisms, and make the teams' work combine into one outcome |
| Principal | A technical domain or business line | Set technical direction, make tradeoffs between business goals, system evolution, and long-term costs, and define what counts as correct within the domain |
| Distinguished | The company and potentially the industry | Establish standards and methods that influence multiple technical domains and change how organizations solve problems |

A junior engineer's first question on receiving a task is how to implement it. A senior also asks whether requirements are missing, what counts as finished, and what happens if something goes wrong after release. Staff engineers face a more complicated situation: every team may have finished its own tasks, yet the pieces fail to solve the shared problem. Someone needs to redefine the interfaces, metrics, and responsibilities.

Higher up, even the goals can conflict. One team wants to retire an A/B experiment quickly, another needs compatibility with older clients, and a third requires a failure fallback. Each has a reason. Deciding which commitments must hold, which work can wait, and who accepts the remaining risk goes beyond how to write the code.

**An engineering level is fundamentally about the scope across which you define "what counts as correct" and carry that judgment through to outcomes.** Writing criteria is only part of it. Those criteria must be executable, conflicts must be handled, and someone must revisit the decisions when the results are poor.

## Agents bring that responsibility forward

In traditional teams, junior and senior engineers do much of the implementation, while seniors also begin to own the criteria and outcomes for a module. As agents take on more implementation, the judgment once bound up with writing code reaches engineers earlier.

Using the responsibilities above as a reference, I see the starting point of the whole ladder moving up one level. A junior previously worked mainly within criteria someone else supplied. The new entry requirement already includes defining an agent's task boundaries, success criteria, and acceptance methods.

| Level in the agentic era | Core responsibilities | Earlier center of responsibility |
| --- | --- | --- |
| Junior | Define success criteria for a clearly bounded feature or module, delegate implementation to an agent, and obtain evidence of completion | Senior responsibility for module delivery |
| Senior | Define shared metrics, interface contracts, and feedback mechanisms for problems across teams; coordinate delivery by multiple agents and people | Staff responsibility across teams |
| Staff | Define correctness, direction, and tradeoff principles for a technical domain or business line, keeping local automation in service of the overall goals | Principal responsibility for a domain |
| Principal | Establish reusable standards and methods for the company and potentially the industry; decide which capabilities to build together and which judgments must remain within individual businesses | Distinguished responsibility across organizations and the industry |
| Distinguished | Define standards for collaboration between people and agents itself, including responsibility allocation, autonomy boundaries, and how engineers develop | A newly expanded scope of responsibility |

This table expresses my judgment about how the threshold of responsibility is changing. It does not automatically promote anyone. An agent helping someone produce code that once required a senior does not mean that person can already carry a senior's responsibilities. The gap to close is precisely that business understanding, system knowledge, and ability to establish whether the work is acceptable.

Engineers already on this path gain a new use for their experience. You have seen compatibility incidents, know why a default cannot be casually changed, and recognize dependencies that will eventually burden the system. Those judgments can become an agent's task boundaries, acceptance cases, and stop conditions. You do not have to demonstrate their value by personally implementing everything each time.

For newcomers, the requirement becomes more immediate. Teaching coding alone is no longer enough. Starting with small tasks, we also need to teach how to define completion, find evidence, and explain failure. Teams cannot give the opportunities to practice to agents and expect newcomers to develop judgment from nowhere.

What to learn next on this new ladder depends on which level of responsibility you are preparing to take on. Familiarity with more workflow products does not automatically expand that scope. Turning a problem only you could understand into work the team can assess and move forward together is a step up.

## The experience accumulated over those years became useful again

Knowing that responsibilities are changing is one thing; knowing what you can do is another. What gradually reassured me was that many judgments these new responsibilities require come from years of writing code and investigating problems.

Consider A/B experiment cleanup. The following is an acceptance design example, rather than a complete account of that weekend's project. Suppose an experiment is to be retired with the treatment behavior retained. An agent quickly deletes the old branch, the build succeeds, and every test passes. Someone who knows the system will keep asking: has the experiment owner confirmed retirement? Do older clients still depend on the control behavior? Does this switch also provide an emergency fallback? Do other experiments use the shared helper?

Someone who has handled compatibility work thinks of older versions. Someone who has dealt with production failures asks about recovery. Someone who has maintained an experimentation platform knows that assigning all traffic to treatment does not authorize removing the switch. These experiences once helped us write reliable code. Now they can define the conditions an agent must satisfy.

| What experience reminds us to consider | How to turn it into an executable judgment |
| --- | --- |
| Calls may be hidden behind wrappers across modules | List analysis artifacts and entry points; record the disposition of every target reference, and never count unresolved paths as complete |
| Unchanged return values do not guarantee unchanged behavior | Replay samples with experiment assignments fixed, comparing outputs, state writes, and external calls |
| Shared helpers can affect other experiments | Keep independent regression samples for unrelated experiments and check shared callers |
| Changing configuration may not restore behavior after code is deleted | Rehearse rollback in the agreed environment and confirm that old artifacts and configuration remain compatible |

This is the process of defining metrics, acceptance criteria, and acceptance methods. Metrics determine what to observe, criteria determine what to accept, and methods determine which evidence we actually obtain. Writing "zero remaining references" is easy. Knowing that skipping one module makes that zero meaningless requires engineering experience.

In {% post_link ground-truth-core-competency-of-ai-engineering.en 'Ground Truth: The Most Undervalued Competitive Edge in the AI Era' %} and {% post_link graphite-agent-bytecode-context.en 'Graphite: Code Is Context' %}, I emphasized the value of deterministic tools. But reproducibility is not completeness. A tool's conclusions must be understood within the scope of its inputs and models. [SootUp's call graph documentation](https://soot-oss.github.io/SootUp/latest/callgraphs/) distinguishes analysis scope and graph construction algorithms. Its [core concepts documentation](https://soot-oss.github.io/SootUp/latest/concepts/) also explains how dynamic dispatch and reflection complicate analysis.

An agent can write such a tool for me. Understanding what happens when a JAR or an entry point is missing still requires knowledge of program analysis. Without it, you do not even know which programs to use to verify the tool. Things learned over those years become useful again, though they are harder to see directly in the finished work.

In the agentic project, that experience has another direct use: writing lint rules. Just last week, I deleted 10,000 lines from the codebase. Code generation had become so cheap that duplicated and unused code was everywhere. Producing it takes a moment, but whatever stays still needs to be understood, changed, and maintained. Those 10,000 lines gave me a more concrete sense of what "output" means: rapid growth in code does not necessarily mean rapid progress for the project.

After one cleanup, later changes can still bring the same problems back. So when I can define a clear check for a problem, I make it a lint rule and run it on later changes. Identifying duplication and determining whether code is truly unused still require an understanding of the project. Where that judgment can become a rule, tools can apply it repeatedly. I like to call these checks an agent's "compiler": as far as possible, judgments I once voiced during review become feedback the agent receives while it works. That way, I do not have to keep chasing the pace of generation with more cleanup.

Of course, this "compiler" can only check rules that have been specified. [NASA's Systems Engineering Handbook](https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/) distinguishes verification of conformance to requirements from validation of fitness for actual use. Even if every rule passes, the change should not ship if the premise for retiring the experiment is wrong. Engineers must revisit the criteria instead of continually having agents fix code against the wrong ones.

**The value of experience begins to show in what I can define, what I can verify, and what I know remains unproven.** This also explains why simply writing more rules does not help. Rules can become stale, methods can have blind spots, and judgments must be open to refutation by counterexamples. "We have always done it this way" is not enough to carry this responsibility.

Early in the year, I was fixated on that one hour, comparing it with my roughly twenty years of experience. Gradually, I saw that those years had given me an understanding of these problems as well as the craft of producing code. That understanding had not disappeared along with the cost of implementation. It needed to be put to use differently.

## Asking again what to learn next

When engineers around me say they do not know what to learn, I understand the feeling. The familiar path has changed, and new models, frameworks, and tools appear every day. It is easy to feel that falling behind is the price of not chasing them. Over these three quarters, though, I have increasingly ordered my learning around the responsibilities I am preparing to take on.

### First, define completion for one task

To prepare for the new junior responsibilities, choose a clearly bounded task. Write down its inputs, expected results, constraints that must hold, and missing information that would require stopping. After delegating implementation to an agent, you should be able to explain why this result can ship and which situations remain uncovered.

Learn what the task reveals you are missing. If you cannot say which experiment group should remain, find the owner and the business rationale. If you do not know whether wrapped calls can be analyzed, read the program analysis documentation and build a small program to check. If you do not know whether rollback works, understand the relationship between releases and configuration. Domain knowledge, system fundamentals, and verification methods need to connect within the same task.

The answers in tests need a source too. The [test oracle problem](https://discovery.ucl.ac.uk/id/eprint/1471263/) concerns how to determine whether an output is correct. As I wrote in {% post_link agent-tdd-is-self-verification.en 'Does an Agent Really Need TDD?' %}, when implementation and tests share the same misunderstanding, passing everything may amount to self-confirmation. Finding business samples, protocol requirements, or incident records independent of the implementation is an ability to practice here.

For newcomers, predict first, then inspect the agent's implementation, run counterexamples, and explain the differences, with an experienced engineer checking the basis for those judgments. Programming remains an important way to understand systems and test ideas. Agents can reduce manual typing, but we cannot skip the process of understanding the system along with it.

### Then, let the system apply a recurring judgment

Engineers who can already own a module independently can start with the reviews they keep repeating. Whenever something feels wrong, record the reason and a minimal counterexample before fixing the code. When the same kind of failure recurs, it is worth turning that check into something reusable and seeing whether it also judges the next, different change correctly.

This requires learning how to verify the checks themselves. [Mutation testing](https://pitest.org/quickstart/basic_concepts/) can establish whether tests react to certain errors, but cannot prove the requirements are complete. Keeping independent evaluation samples is useful too. However, [Dwork and colleagues' research on holdout reuse](https://arxiv.org/abs/1506.02629) warns that repeatedly tuning against the same held-out samples risks overfitting.

Progress therefore cannot be measured only by test counts and pass rates. Check where the answers come from, whether collection scope has shrunk, whether failing samples have been removed, which artifact version the report covers, and whether old criteria still apply. When evidence is missing, the check should return "unknown" instead of passing by default.

When others can use this feedback to locate and fix problems, you no longer have to inspect every change yourself. Making that possible for a category of tasks is a step toward taking responsibility across teams.

### Apply the criteria across a wider scope

Preparing for the new senior responsibilities means bringing this method across teams. Some people seek faster retirement, some worry about compatibility, and some own recovery. Together they need to determine metrics, boundaries, sequencing, and exceptions. Rigorous checks within one module are not enough to resolve those conflicts.

At Staff, attention must expand to long-term tradeoffs within a domain: which interfaces and data models should be unified, which compatibility commitments must hold, and whether faster local delivery is increasing overall maintenance costs. Principals also need to extend effective methods across domains, distinguishing standards worth unifying from differences that must remain.

Distinguished engineers must keep questioning the collaboration model itself: what evidence permits people to step back, how agents' autonomy boundaries should change, and what work will let the next generation of engineers gain experience. As tools change, someone must keep revising how organizations distribute responsibility and develop people.

Reading a few more articles will not give you these responsibilities. You need to work on problems at the corresponding scope, record the evidence available at the time, the choices you made, and the later outcomes, then use those outcomes to calibrate your judgment. To judge your progress, ask: did I understand one more layer of constraints this time, and take responsibility for something I previously needed someone else to decide?

Every step must also account for cost. A one-off problem that someone can confirm in a few minutes does not justify building a huge harness first. Judgments worth encoding recur, have meaningful consequences, and provide feedback you can obtain reliably. Deciding what to leave undone for now is also part of owning the work independently.

## The times have brought us here again

After these three quarters, I have gradually found an answer to the question that troubled me early in the year. Implementation can go to agents. Understanding problems, defining criteria, and verifying results still need deeper work. The experience I have gained over about twenty years has found a new use, and I know where to put my effort next.

Thinking about it this way, I began to see more than a difficult career transition. There is a rare opportunity here too. AI has brought some things we once lacked the resources or time to finish back within reach. That long-shelved bytecode tool is a small but concrete example for me. Early in the year, I was too busy comparing that hour with my own craft. Now I think about how many more ideas might no longer have to stay on the shelf.

Catching one change of this scale in a career is rare enough. Those of us born in the 1980s caught the mobile internet, and now we find ourselves in the AI wave. To encounter another opportunity to change how we work while we still have energy and already have some experience is an extraordinary piece of luck for our generation of engineers.

Thinking of the earlier wave brings me back to the years I spent working on VirtualAPK and Booster at DiDi. I wrote about those projects in {% post_link working-at-didi.en 'My Years at DiDi' %}. The mobile internet brought new businesses and new engineering problems, giving us opportunities to turn ideas into projects and reach more users through open source. Looking back, it is difficult to separate our growth from the opportunities the era gave us.

Some ideas from my time working on Booster remained unfinished, including that bytecode tool. As I continue building Graphite today, those earlier problems and the experience I gained are finding new uses in the AI era. My own experience connects the two waves.

This time, the wave has carried us somewhere new. I do not know what products will emerge, whom I will work with, or what we will build together. Nor can I offer a list of technologies that will keep anyone employed. Agents will keep improving. Something we need to build ourselves today may become an off-the-shelf product tomorrow.

But I want to keep going. With what I have learned over about twenty years, I want to take another look at the things I once had no time for, or did not dare to try.

We are still here. This time, too, we have a chance to build something worth keeping.
