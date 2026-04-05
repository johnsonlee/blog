---
title: "Are You Using Claude Subagents Right?"
lang: en
i18n_key: claude-code-background-subagent
date: 2026-03-02 22:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Agent
  - Claude
  - Productivity
  - Workflow
---

I've mentioned before that AI's engineering capability has reached Staff Engineer level. But after a few months with Claude Code, I noticed a counterintuitive fact: **this Staff Engineer spends every day painting UI and writing CRUD.** You ask it to modify a file, and it grinds through the entire thing in the main session -- reading code, analyzing dependencies, writing patches, running tests. The context window gets stuffed to the brim. You want to slip in a "while you're at it, check this other bug" -- too bad, you have to wait until it's done. It has people under it, but insists on writing code itself.

## Why Won't It Delegate?

Claude Code has a subagent mechanism -- the main session can delegate tasks to independent child agents, each with its own context window, running in isolation, even in the background. But by default, the main agent won't proactively delegate. Its instinct is "do it myself."

This makes sense. For a general-purpose tool, "do it yourself" is the safest default -- no need to judge what should be delegated, no need to coordinate between subtasks, no need to handle parallel file-write conflicts. Everything happens in one context: simple, controllable, error-free.

**Defaults always serve the lowest common denominator.** Claude Code doesn't know whether you're a power user juggling three tasks at once or a beginner who just wants help with a function. Faced with uncertainty, being conservative is the right call.

But "right" doesn't mean "optimal."

## Planner, not Executor

Since the main agent's default behavior is "do everything yourself," just tell it not to.

Claude Code's CLAUDE.md is the behavioral guide the main agent reads on every startup. I added a convention to the project's CLAUDE.md:

```markdown
- **Planner, not executor**: When handling tasks, default to launching
  subagents for implementation. The main conversation's role is planning,
  coordination, and review -- not direct execution. Always launch subagents
  in the background (`run_in_background: true`) so the main conversation
  stays responsive to user input.
```

The core idea boils down to one sentence: **the main agent's role is planning and coordination, not hands-on execution.**

The effect was immediate. Given a complex task, the main agent no longer buries its head and grinds. Instead, it decomposes the task first, then dispatches subtasks to background subagents. Research tasks run in the background; the main session stays free for you to push other things forward simultaneously.

But there's a catch -- this rule lives in the project's `.claude/CLAUDE.md`, so it only applies to the current project. Switch to a different project, and the main agent reverts to "do everything myself."

Copy it to every project? Not realistic.

## From Project-Level to Global

How do you make this rule apply to all projects?

Simple: move the config from the project directory to the user directory. Claude Code reads `~/.claude/CLAUDE.md` first, then the project-level one. Global config applies to all projects; project-level config can override or supplement it.

That led to [this PR](https://github.com/johnsonlee/-/pull/3) -- putting routing rules and worker agent definitions directly under `~/.claude/`. Routing rules tell the main agent "most tasks should default to background dispatch." Worker agent definitions give the delegated tasks somewhere to land.

There's a subtle wording detail: the worker agent's description needs to include "PROACTIVELY." Claude Code's scheduling logic reads this field to decide whether to proactively delegate. Without that word, the agent is "available" but not "proactive" -- like hiring someone but never assigning them work. It's the same as writing "drives initiatives" versus "supports as needed" in a job description. Wording determines whether the role seeks work or waits for assignments.

While you're at it, set a `CLAUDE_CODE_SUBAGENT_MODEL` environment variable -- Opus for the main session, Sonnet for subagents. Reasoning power and cost, each where it belongs.

This config system, from project-level to global, is fundamentally about building **convention for your AI toolchain** -- the same logic as pushing code style, commit conventions, and CI pipelines in a team. Once the convention is established, every new project inherits it. No starting from scratch.

## A Few Gotchas

### No Interaction in Background

Background subagents don't support interactive confirmation. For tasks involving file writes, Claude Code asks for authorization upfront before launching. Forget to grant permissions, and it stalls.

### Prompts Must Be Self-Explanatory

Subagents have no stepwise plan. They receive a task and execute immediately, with no intermediate output. **Prompts must be crystal clear -- vague instructions plus zero interaction equals disaster.**

### Draw Clear File Boundaries

Multiple subagents writing to the same set of files in parallel will conflict. When delegating, mind the file boundaries -- same as avoiding two people editing the same file when splitting work across a team.

### The Main Agent Occasionally "Forgets"

The main agent occasionally "forgets" to delegate. You can manually press `Ctrl+B` to move the current task to the background, and use `/tasks` to check progress. Not elegant, but it works.

## Usage Itself Is Architecture

Looking back, a single convention written in CLAUDE.md seems like just a config change on the surface. But what you're actually doing is: defining who plans, who executes, when to parallelize, when to serialize, and how to split work between foreground and background.

That's not "configuration." That's architecture.

Traditional architecture is about how code is organized, how modules are split, how interfaces are defined. The subjects of those decisions are unintelligent -- a class won't decide on its own to call another class; a function won't "feel" it should run in the background. You draw the diagram, they follow it to the letter.

But when tools have intelligence, things change. The main agent will judge "I can handle this" and just do it. Leave out one "PROACTIVELY" in a subagent's description, and it really does sit there waiting to be called. Every rule you write, every word you choose, is shaping the behavioral boundaries of a system with autonomous judgment.

**When tools have intelligence, usage itself is architecture.** The tool is the same tool, but you get to decide whether it keeps grinding out features head-down or leads the team.
