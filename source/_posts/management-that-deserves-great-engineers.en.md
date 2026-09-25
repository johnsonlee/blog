---
title: "What Kind of Management Deserves to Lead Great Engineers?"
date: 2026-09-25 10:30:00
lang: en
i18n_key: management-that-deserves-great-engineers
categories:
  - Career
tags:
  - AI
  - Claude Code
  - Engineering Leadership
  - Management
  - Software Engineering
---

A post climbed to the top of r/ClaudeAI this week with a blunt title: [I am done with this shit](https://www.reddit.com/r/ClaudeAI/comments/1wm5c21/i_am_done_with_this_shit/). It reposted a rant from X. Half a month into a new role at a big company, the author found that specs, code, tests, PRDs, tickets, and reports were all produced by Claude Code. Everyone from L1 to L7 did the same thing all day, talking to Claude for 12 to 13 hours, mostly pressing Enter. Management kept asking one question: "Pushing code is not the bottleneck anymore, so why are we slow?"

The comments quickly passed 800. Plenty of them attacked AI, but one judgment met almost no resistance: **this is a management problem, not an AI problem.** The same Claude, on other teams, lets engineers sleep better and get more done. So turn the question around: in the AI era, what kind of management deserves to lead great engineers?

<!-- more -->

The post itself cannot be verified. It came from an anonymous account and names no company. What interests me more is the comment section: hundreds of people recognizing themselves and describing what is happening at their own companies. Put those scenes together and you can see exactly where management loses points.

## Same Claude, Two Kinds of Teams

On the side that is falling apart, the scenes are strikingly similar. My AI parses my coworker's AI-written requirements doc, his AI reads my tweaks and passes them back, and nobody talks to each other anymore. The team receives 50K lines of PRs in a day, a real review would take at least 10 days, and the manager says "use AI to review it." Tasks that used to get 3 days now have to ship in 2 to 3 hours, so they wrote another set of Agents to review and test the code, sometimes using the same model that wrote it.

On the side doing well, the rules sound almost plain. Someone at a startup said all their documents and code are written by AI too, but every single thing has a responsible person who must be able to explain what was done. Another team's rule is that whoever opens a PR is 100% responsible for it; if you don't understand it, you go back to the drawing board. They also deliberately stopped letting oversized PRs through. A senior IC who owns the entire stack at a small finance firm said he has set Claude up with guardrails, testing, and verification, and now works his contracted hours.

The tools on both sides are the same. The difference lies entirely in management decisions: whether there is time to understand, who owns the outcome, whether a PR can be sent back, and what counts as done. One comment called AI an amplifier that magnifies management problems first. Good management gets amplified into leverage. Bad management gets amplified into 12 hours of pressing Enter.

## Missing Where the Bottleneck Moved

"Code is not the bottleneck, so why are we slow?" The first half is correct. The second half reveals a mental model still stuck before AI.

A bottleneck does not disappear. It moves. Code generation got ten times faster, while the speed of understanding code, verifying it, and judging whether it matches intent did not change. Pushing harder on generation only piles output in front of the bottleneck as work-in-progress inventory nobody has read. One commenter said it in a sentence: writing code isn't the bottleneck, reading and evaluating it is.

Management that deserves great engineers puts its effort into capacity at the bottleneck. Limiting PR size, budgeting time for review and verification, and treating defects that escape to production as a core metric are all ways of working on the bottleneck. I have hit this myself. In {% post_link fast-is-the-most-expensive-slow.en 'Fast Is the Most Expensive Slow' %}, a project with green CI and on-target coverage turned out to be unusable once installed, and a two-hour audit saved it. The company in the Reddit post has removed exactly those two hours from the process.

The incentives make it worse. One commenter said their company now requires that pipelines "used AI" before reaching production, so even code written by hand has to be redone with AI. Another asked a manager for help and was told to buy another Claude seat and run two at once. Measure AI usage and you will get AI usage. Goodhart's law does not care which decade it is.

## Responsibility Without Authority

One comment was quoted again and again: technically, you're an organic vessel designed to be held accountable for what Claude is doing, because Claude can't be held accountable.

Madeleine Clare Elish, who studied accidents in automated systems, called this position a moral crumple zone: like the crumple zone of a car, the human in an automated system has little control but absorbs the impact. The engineers in this thread stand exactly there, with no time to read the code, no authority to slow down, and a signature required when things break. One commenter laid out the whole chain: my manager pretends he understood everything, my senior pretends he understood everything, I pretend I grasped the AI-generated code in an hour, and when something breaks we all say "I may have made a mistake."

Responsibility presupposes control. If management wants engineers to own outcomes, it has to give them the authority to refuse: to send back a PR they cannot understand, and to say that a deadline leaves no room for verification. Hand out responsibility without authority, and all you collect is a string of signatures.

"Use AI to review AI" is a variant of the same problem. When the same model writes the code, the review, and the tests, they share the same context and the same blind spots, and the loop never touches a single external fact. In {% post_link what-engineers-are-still-for.en 'What Are Engineers Still For?' %}, I argued that the gates that let an Agent run overnight must be anchored in real samples, rerunnable metrics, and counter-metrics. **When management replaces human judgment with a gate that contains no external facts, the status report says human-in-the-loop while the loop contains nothing but Enter.**

## Punishing Judgment Drives Out the Best People

Two stories in the thread bothered me most. A senior developer who has been on the same project for 15 years was reprimanded for spending time cleaning up AI code and building shared libraries, and was told to "lower my standards" because coding is Claude's job now, while the project has more bugs than ever. Another engineer was handed a post-acquisition platform migration. The product person had AI turn the legacy codebases into a feature and gap report: an HTML file of 100+ pages plus a spreadsheet with 30 tabs. He said it was not fit for human consumption and proposed starting with the high-level gaps, and was treated as if he were not a team player.

In {% post_link what-should-engineering-hiring-evaluate-in-ai-era.en "It's 2026 -- Why Are We Still Testing Algorithms?" %}, I wrote that AI replaces execution, not judgment. In the AI era, nearly all of a great engineer's value is concentrated in judgment: whether this code should go in, where this design will fail, whether anyone can actually read this report. Saying "no" is the most common form judgment takes. Management that punishes "no" is paying for the wrong thing.

Great engineers also have more options than ever. One commenter said that since AI took over, the roughly $10M-a-year company he works for is run by one person with a Max subscription: him. A great engineer can switch companies, go independent, or turn one person into a team. An organization that punishes judgment triggers adverse selection: the people who can leave go first, and the ones who remain are those most willing to press Enter.

## Where Is Management's Own What?

Management that hands the Enter key to engineers has often handed its own work to AI as well. One commenter said the PM's tickets are now 10 times longer but just as poorly considered, contradicting their own goal two or three times in one description while looking more professional. Another said the growth side of the company is being pulled in 10 directions by AI-generated briefs. Another pointed at leaders who expect some magical ROI without ever using these tools themselves.

In {% post_link who-holds-the-reins.en 'Who Holds the Reins?' %}, I wrote that the What is the reins and the How is the horsepower. AI made the How extremely cheap, which makes the What the scarcest thing in the organization: what to build, what not to build, what counts as done, and which metric means things actually got better. Engineers can translate the What into gates and harnesses, but the business goal itself has to come from management. When management outsources its own thinking to AI, engineers are left executing a goal nobody has really thought through, and speed only accelerates them in the wrong direction.

So management that deserves great engineers must first be able to write a goal clear enough to be verified. That is management's own job. Neither AI nor engineers can do it for them.

## Leading While Using AI Less Than the Front Line

There is an unavoidable reality here: management will never spend as much time with AI as frontline engineers do. A director with dozens of reports has a day chopped into meetings and cannot spend hours in a row with an Agent chasing a flaky test. Asking leaders to "understand AI better than the engineers" is an empty demand.

But the problem in this thread comes from where leaders get their information, and has little to do with hours of use. One commenter complained about team leaders whose familiarity with new technology "starts and ends at LinkedIn posts." Another said management mandates AI and measures its use to keep up with their buddies' bragging rights at the 19th hole. Vendor demos, peers showing off, and social media only show success stories, and only the moment of generation, never who is maintaining that code three months later. Decisions built on those channels are really decisions about AI's advertising.

Leaders do not need to use AI more. They need a set of signals that are hard to fake.

First, finish one small real task with your own hands. The goal is not to become an expert but to calibrate your intuition. Skip the demos, pick a real task with acceptance criteria, and carry it all the way to working, including the part where you discover it is wrong and get it right. What I learned that weekend in {% post_link fast-is-the-most-expensive-slow.en 'Fast Is the Most Expensive Slow' %}, that green CI does not mean it works, is worth more than a hundred product launches.

Second, watch the metrics along the outcome chain, not usage. PR size, time waiting for review, revert rate, defects that escape to production, incident recovery time, and how long a new hire takes to fix a bug independently. When understanding gets skipped, these numbers worsen first, regardless of how much AI is used.

Third, pick a merged PR at random and ask its author to walk through what it does and why. It is the cheapest audit there is. If the author cannot explain it, the organization's human-in-the-loop exists in name only; the point is to measure the system, not to punish the individual. By the same logic, leaders should sit in on incident reviews. When it comes to how AI is really being used, an incident is more honest than any status report.

Fourth, treat the people who say "no" as sensors. The engineer who insisted on starting with the high-level gaps and the senior told to lower his standards are exactly the people who actually read the code, and they give off the highest-resolution signal in the organization. The previous section said punishing judgment drives out the best people. It carries a second cost: leaders blindfold themselves.

The reverse also holds: do not treat the heaviest users as the answer key. In {% post_link who-holds-the-reins.en 'Who Holds the Reins?' %}, I wrote about heavy users who cannot stop, and the person using AI the most may be the one being dragged along by the horse. A leader's advantage is precisely distance: seeing several teams at once, and seeing which ways of using AI leave behind assets three months later and which leave behind incidents.

**Leaders do not need to understand AI better than engineers, but they must know better than anyone where their own judgment about AI comes from.**

## Setting Direction When the Capability Boundary Is Unclear

Push one step further: if leaders cannot see AI's capability boundary clearly to begin with, and are not familiar with frontier models, how do they set direction?

Start by admitting that nobody sees the boundary clearly for long. Models turn over every few months. What a frontline heavy user concluded last quarter that "it can't do this" may no longer hold this quarter; in the other direction, the capabilities claimed at a launch event may shrink by half inside your own codebase. **Betting direction on an accurate prediction of model capability is the wrong bet in the first place.**

The most damaging decisions in the thread were exactly this kind of bet: first believe AI can do it, then take an irreversible step. One acquired team was expected to take over a platform the acquirer had staffed with 20+ people using only 5 engineers, after management first thought 1 would be enough, while the company planned to cut from 200+ employees to around 60-70 within two years. An intern said the fintech company was rewriting its business code from Go to Java on the grounds that Codex makes it just as fast, deploying straight to production and leaving users to test for bugs. Layoffs, hiring freezes for juniors, and removing review are one-way doors. Once you walk through, it is hard to come back.

When the boundary is unclear, there are three relatively stable ways to set direction.

First, bet on things that do not change with model versions. Business goals, users, risk limits, and what counts as correct will not change when the next model ships. In {% post_link test-case-is-the-core-asset.en "Test Cases Are Software's Core Asset" %}, I wrote that source code can be regenerated, but the real world captured in test cases cannot. Investing in real samples, evals, harnesses, and verifiable acceptance criteria pays off whichever model wins. It is one of the few no-regret moves.

Second, make the capability boundary something the organization measures, not something leaders believe. Build an eval from your own real tasks and past incidents, and rerun it whenever a new model ships to see how far it gets in your context. Leaders do not need to understand the model. They only need one habit: instead of asking "how good is this model," ask "what does our own eval say."

Third, the blurrier the boundary, the more you should move through two-way doors. Pilot at small scale, write the success and kill criteria in advance, and expand only when results hold up. Irreversible decisions, such as how many people to cut, whether to keep hiring juniors, or whether to drop human review, belong after your own data, not after someone else's launch event.

None of these require leaders to understand models better than engineers. They require an older management skill: under uncertainty, telling apart the judgments that are allowed to be wrong from the ones that are not.

## Where the Next Generation of Engineers Comes From

The last question was asked least in the thread, but it weighs the most.

One commenter said new hires in their first year get almost no mentoring from seniors, yet their tasks are far from easy, and the answer to every question is to ask Claude. Another changed jobs three weeks ago, asked the lead about the business logic and overall architecture, and was told to just use Claude Code and ask. An engineer at a company with about 1,500 engineers said new hires used to spend years building context on the codebase, and now his team is building tools so that AI knows more about the codebase than any single IC.

Today's great engineers were grown over a decade of reading code, stepping on landmines, and debugging incidents in the middle of the night. When management treats understanding as a cost to cut, it saves more than today's review time. It also saves away the person who, five years from now, can understand the system at 3 a.m. That bill ends up on management's desk.

## What "Deserves" Means

Great engineers in the AI era do not need management to hand out work. Agents will break work down more finely than any person. What they need is something else: a clear What, someone who can see where the bottleneck is and knows where their own information comes from, authority that matches responsibility, an environment where saying "no" is not punished, and an organization willing to pay for the next generation's understanding.

None of this is new. Good management should have been doing it ten years ago. AI simply widened the gap. Bad management used to be covered by engineers' diligence and craft. Now diligence is replaced by Agents, craft is told to lower its standards, and nothing is left to cover for it.

Back to the question: if writing code is no longer the bottleneck, why are we slow? Because the only bottleneck left is understanding, and management has forbidden anyone to spend time there. Only management that can answer this deserves the people who know what the system is actually doing.
