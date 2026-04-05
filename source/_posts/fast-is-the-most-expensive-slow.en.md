---
title: "Fast Is the Most Expensive Slow"
date: 2026-03-09 21:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Software Engineering
  - Product Management
  - Project Management
lang: en
i18n_key: fast-is-the-most-expensive-slow
---

Over the weekend I was working on a side project -- a macOS voice assistant written in Rust. At the start, I had Claude generate a ROADMAP. The result was beautiful: 7 milestones, each listing specific features, file structures, and dependencies, with module decomposition all figured out for me. Far more systematic than anything I would have planned myself.

So I said: execute this.

<!-- more -->

## Everything Looked Great

AI executed fast. M1 through M7, one after another, lines of code shooting up. I asked: did you write tests? No. Add them; get coverage to 80%. Done quickly too. CI all green, compilation passed, test coverage met the bar.

Everything appeared ready, so I had it build an installer, put it on my machine, and got ready to try it out.

Opened the app -- voice didn't work. Switched to chat mode -- the AI's responses were like a soulless customer service bot, bearing no resemblance to the carefully crafted persona definition I'd written. Checked the system tray -- it wasn't packaged at all; the installer simply didn't include the UI.

**This is what AI told me was "done."**

I had no choice but to start debugging feature by feature myself. The audio capture format didn't match the STT service. The WAV parser assumed a fixed file structure and crashed on macOS's non-standard output. Playback wasn't blocking, so echo cancellation was useless -- every single one of these was invisible on the ROADMAP, and every single one only surfaced when actually running the thing.

As I debugged, the architecture went through major restructuring. By the time I'd fixed each core feature to a working state, I looked back and the code no longer matched the ROADMAP. Some ROADMAP modules had been deleted; some features not on the ROADMAP had been added.

That's when I realized: **the ROADMAP could no longer tell me the state of this project.** I needed something different.

## The Moment the PRD Called My Bluff

After writing the PRD, I ran an audit against it -- checking every functional requirement's completion status line by line.

The results were quite surprising.

**Text REPL was not in the PRD at all.** The PRD was explicit: this is a voice-first application where users interact via voice; "no button press, hotkey, or wake word is needed." Text mode was merely a fallback option in settings, not a core interaction path. But the ROADMAP placed it as the very first item in M1, so it became the first feature I built.

That wasn't even the most absurd part. Continuing the audit, I found more issues:

- The persona definition file had substantial effort poured into it; it was encrypted and compiled into the binary during build -- but the chat path never used it, opting for a hardcoded generic prompt instead
- The UI module code was complete, but the release workflow didn't package it into the app bundle, meaning it wouldn't be installed even on release
- Several functions marked "allow dead code" all traced back to text REPL remnants

**None of these were compilation errors. None would fail CI. But every single one meant the product goals were not met.**

## AI Excels at Planning Execution, Not at Defining Goals

Looking back, the problem wasn't the quality of the ROADMAP itself -- it was genuinely well-crafted, clearly structured, with sensible dependencies and phased delivery. The problem was that **the ROADMAP answers "how to do it" and "in what order," but it doesn't answer "is this the right thing to do."**

When AI generated the ROADMAP, its input was my description of the project. It derived a reasonable execution plan from that information, but it had no ability to judge for me whether "Text REPL actually matters to users." That judgment requires product intuition and understanding of user scenarios, not logical deduction.

More subtly, the AI-generated ROADMAP looked too professional -- so professional it let me drop my guard. **When a plan's form is polished enough, you unconsciously trust its substance.** Every milestone delivered real code output, tests passed, features worked -- but the gap between "it runs" and "it's right" is far wider than most people assume.

This was also a lesson for myself: I'd previously written [Agent-Oriented Engineering](https://johnsonlee.io/2026/02/10/agent-oriented-engineering/), discussing how human engineers need to shift from execution to judgment. Then I turned around and made exactly this mistake -- treating an AI-generated execution plan as a substitute for judgment.

## The PRD Is Your Own Judgment

The value of a PRD lies not in its format or length, but in the fact that it's something you've thought through yourself.

Writing the PRD forced me to answer: "What problem does this product actually solve? In what scenario do users use it? What features are core, and what's nice-to-have?" AI can't help you with these questions, because the answers come from your understanding of user scenarios and your own trade-offs.

With a PRD in hand, the lens for reviewing code changes entirely. The ROADMAP lens asks "was this module built?"; the PRD lens asks "does this feature meet the end-to-end bar?" Take the persona definition file: the ROADMAP lens sees "encrypted compilation done"; the PRD lens sees "AI persona in the chat path doesn't match the definition."

**A ROADMAP is internally consistent -- each milestone can be independently verified. But internal consistency does not equal correctness.** A ROADMAP divorced from product goals can let you efficiently do a pile of wrong things.

## Post-Mortem

When I deleted the text REPL, I didn't feel much regret. What truly bothered me was something else: if I'd written the PRD first and then had AI generate the ROADMAP, that code would never have existed. The weekend hours behind it -- design, coding, testing, debugging -- could have been spent polishing the voice pipeline instead.

Similarly, the persona definition not being used by the chat path -- if I'd validated against the PRD after completing each feature, I would have caught it on the spot. But the corresponding milestone in the ROADMAP only said "implement SSE streaming + conversation history"; check it off and move on, with nobody verifying whether the output content matched the product definition.

## The Right Order

To be clear, I'm not dismissing the value of AI-generated ROADMAPs. They genuinely help you quickly turn fuzzy ideas into executable plans. But the order matters:

- **Write the PRD first** -- think through what to build, what not to build, and what "done" means
- **Then have AI generate the ROADMAP** -- plan the execution path within the PRD's constraints
- **Audit against the PRD regularly** -- stop and recalibrate every few milestones

The PRD is the anchor, the ROADMAP is the course, and the audit is the compass. You need all three, but the anchor must be one you drop yourself -- you can't let AI drop it for you.

## The Cost of Stopping

One last takeaway: **the value of auditing is severely underestimated.**

A single audit took about two hours. The result? It uncovered 6 gaps, 3 of which were on the critical path. If I'd kept charging ahead following the ROADMAP, these issues might not have surfaced until I actually needed the product -- and the cost of fixing them then would be ten times what it is now.

Developers inherently dislike "stopping to look back." Writing new code gives you dopamine; reviewing old code gives you only anxiety. But this experience convinced me: **periodically stopping to recalibrate against the PRD is one of the highest-ROI engineering activities there is.** The cost is two hours of review; the payoff is avoiding further investment in the wrong direction.

What this experience taught me isn't "don't write bad code," but rather "don't go full speed on an ocean with no anchor" -- even if the course was charted by AI and looks flawless.
