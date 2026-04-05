---
title: The Power of 19 Lines of Prompt
date: 2026-04-04 10:00:00
categories:
  - Independent Thinking
tags:
  - Claude Code
  - Prompt Engineering
  - AI
  - Agent
lang: en
i18n_key: power-of-19-lines-prompt
---

I was using Claude Code for architecture design that day.

Something felt off -- the ARCHITECTURE.md it produced was a mess. Jumbled logic, blurry boundaries, a massive gap from my usual experience. Not an occasional slip, but a streak of errors. Like it had dropped a full level in capability.

I put up with it for a while, then decided to interrogate it directly.

## "Whose Instructions Are You Following?"

I started with some basic questions: What do you think your role is right now? What's your thinking framework before making decisions?

It began answering, saying its job was to act as a "planner and coordinator," and that before dispatching work to a worker agent, it needed to run through a checklist -- Intent, Competence, Affected files, Conventions, Review test...

I stared at the screen with a strange feeling.

These phrases, this logic -- I'd seen them somewhere before.

Then it hit me. That was content from a CLAUDE.md I'd written **two months ago, deemed flawed, and completely rewritten**.

I thought it was long gone.

## An Accidental Directory Collision

Claude Code traverses up the directory tree at startup, looking for CLAUDE.md at each level, with the nearest one taking priority. The mechanism itself is fine -- it makes per-project configuration possible.

The problem was my directory structure:

```
~/workspace/github/johnsonlee/
├── .claude/          <- This is a git repo: github.com/johnsonlee/.claude
│   └── CLAUDE.md     <- Old version, 52 lines
├── project-x/
├── project-y/
└── ...
```

Normally, the global CLAUDE.md should live at `~/.claude/CLAUDE.md`. But I had a dedicated repo for managing Claude configuration, cloned to `~/workspace/github/johnsonlee/.claude`.

And all my other projects were also under `~/workspace/github/johnsonlee/`.

So when Claude Code was working inside `project-x`, it traversed upward and **hit the old CLAUDE.md in that git repo before reaching `~/.claude/`**.

It had been operating under a set of instructions I thought I'd retired long ago.

## Two Versions, Two Worlds

The old version (v1): 52 lines, 2.83 KB. Opening line defined the role:

> You are a **planner and coordinator**, not an executor.

Then came detailed Tool Boundaries -- which tools could be used directly (Read, Grep, Glob), which required a worker agent (Write, Edit, Bash with side effects). Then a 5-step Thinking Discipline. Most critically, a mandatory Pre-Dispatch Checklist that had to be visibly printed before every dispatch:

```
- [ ] Intent: [what the user actually wants]
- [ ] Competence: [do I understand this domain?]
- [ ] Affected files: [list every file to be created/modified/deleted]
- [ ] Conventions: [verified against existing files -- cite which files checked]
- [ ] Review test: "would the user approve this diff?" [yes/no + why]
```

The document even emphasized: `Skipping it is a violation -- the checklist is visible proof that thinking happened.`

The new version (v2): 19 lines, 1.17 KB. It opens with a single sentence:

> **You exist to turn the user's intent into reality.** This is the single principle. Everything below is a facet of it.

Then three sections:

**Understand intent** -- always pursue the goal itself, not the literal words. If the domain is unfamiliar, research first. Wrong understanding produces wrong outcomes no matter how precise the execution.

**Stay available** -- the channel between intent and execution must remain open. Default to delegating to background workers; if delegation fails, execute directly -- don't ask permission to switch, just deliver.

**Execute faithfully** -- Consistent, Complete, Verified. The last point is the sharpest: `never report completion without independent evidence; if it can't be proven, it didn't happen.`

Specific git workflow, naming conventions, and code style go in a separate CONVENTIONS.md, keeping the core principles uncluttered.

## Why the Gap Is a Phase Change

On the surface, v1 looks more rigorous -- role definition, tool boundaries, thinking framework, checklist. V2 seems to strip all that away.

But what was stripped away was precisely what caused the problems.

### The Checklist Is Ritual, Not Thinking

V1 required Claude to output a visible checklist before every dispatch, justified as "visible proof that thinking happened."

The intent was sound -- make the thinking process auditable. But it confused two things: **outputting a checklist and actually thinking are two different things.**

What Claude learned was "fill out the checklist," not "think clearly before acting." Like writing weekly status reports -- fill in the boxes and call it done; whether the content reflects what actually happened is another matter entirely. The checklist became a form to satisfy, not a cognitive tool.

V2 has no such ritual. It trusts Claude to internalize the principles and judge on its own, verifying through results rather than process performance.

### Role Definition Created a Cognitive Deadlock

"Planner and coordinator, not an executor" -- this identity worked fine under normal flow, but created a dead end when delegation failed: the role definition said don't execute directly, yet the task couldn't move forward, so it could only stop and ask.

The cost of this deadlock is invisible. No errors -- just slowness, back-and-forth, that nagging feeling of "something's not right" in the user experience.

V2's "Stay available" eliminates this entire class of scenarios:

> *Fall back to direct execution when delegation fails -- don't ask permission to switch, just deliver.*

No asking, no confirming. Switch directly, deliver directly.

### The North Star Sets the Behavioral Tone

V1's core metaphor was "a distinguished engineer reviewing a PR" -- a **reviewer's perspective**, inherently conservative, skeptical, inclined to find problems rather than push delivery forward.

V2's north star is "turn the user's intent into reality" -- a **doer's perspective**, inherently biased toward action and delivery, with every judgment serving that single goal.

These two identity orientations shape not any specific behavior, but the default inclination when facing every ambiguous situation. That's a systemic difference.

### "Verified" Is Stronger Than "Review Test"

V1's completion standard: "would the user approve this diff?" -- a subjective guess. Claude makes an inference and calls it done.

V2's completion standard: "never report completion without independent evidence; if it can't be proven, it didn't happen" -- a falsifiable requirement. Claude must actively construct verification; if it can't be verified, it can't be reported as complete.

The former allows room for reasonable doubt. The latter does not.

## More Rules Don't Necessarily Mean Better

This incident reminded me of a broader issue.

When writing system prompts for AI, there's a natural impulse -- cover every edge case, define every rule clearly, make coverage as comprehensive as possible. V1 was the product of that impulse.

But stacking rules doesn't produce certainty; it produces **priority ambiguity**. When rules create tension -- like "I'm a coordinator" versus "the task is stuck" -- the AI doesn't know which rule to obey, and behavior becomes unpredictable.

The deeper issue: **rules are constraints; principles are direction.** Constraints can only tell an AI what not to do. Principles tell an AI how to judge in situations no rule covers. Real tasks are always more complex than any rule list -- there will always be uncovered cases. In those moments, an AI with a north star and one without are worlds apart.

V2 works not because it's more concise, but because it **provides a strong enough starting point for derivation**. Every specific judgment can be derived from "turn the user's intent into reality" without enumerating rules.

This isn't just an AI prompt problem. Writing team working agreements, product design principles, engineering coding guidelines -- same trap, same solution. A good principles document should let someone derive the right answer even in situations they've never seen. A document with only rules leaves nothing but chaos beyond the rules' boundaries.

## The Essence of 19 Lines

What shocked me most about this incident wasn't finding a bug. It was the most direct possible validation of something I'd always believed but never felt so clearly:

**19 lines of text are enough to change the working level of an entire AI system.**

Not parameters, not model version, not compute. Those few core sentences. The precision of the north star.

This is the literal meaning of **What Caps How**: the clarity and coherence of the intent you give your AI determines the ceiling of its output.

Sometimes, deleting two-thirds is the real upgrade.
