---
title: "The 10X Engineer's First Command"
date: 2026-03-06 20:00:00
categories:
  - Computer Science
tags:
  - Developer Tools
  - Dotfiles
  - Claude Code
  - Productivity
  - AI
lang: en
i18n_key: 10x-engineer-first-command
---

Dotfiles management is nothing new. Shell configs, Vim plugins, Git aliases -- I put all of this into a [Git repo](https://github.com/johnsonlee/-) years ago, one `curl` command to set up a new machine. But recently I realized the most valuable thing in that repo is no longer `.bash_profile` or `.vimrc` -- it's `.claude/`.

<!-- more -->

## The Old Story: Putting ~ in Git

My approach is turning the Home directory into a Git repo:

```bash
curl -sL 'https://sh.johnsonlee.io/setup.sh' | /bin/bash
```

This command initializes `~` as a working tree, pulls all dotfiles, installs Homebrew and runs 40+ formulas, and sets up Vim plugins. When it's done, the new Mac is identical to the old one -- Shell colors, Git aliases, Vim keybindings, all muscle memory instantly restored.

The repo is called [`-`](https://github.com/johnsonlee/-). `~` can't be a repo name, and `-` is the shortest legal alternative.

This setup solves an old problem: **the hidden cost of dev environment setup.** Starting from scratch on every new machine takes two days at minimum. Put it in Git, and one `curl` buys those two days back.

But that's the old story. The new one lives in `.claude/`.

## The New Story: The .claude Directory

Since Claude Code became my primary tool, the configs accumulating in `~/.claude/` have grown increasingly valuable:

```
~/.claude/
├── CLAUDE.md          # Global behavior conventions
├── settings.json      # Permissions and preferences
├── skills/            # Reusable workflows
│   └── blog-writer/   # Complete blog-writing Skill
│       ├── SKILL.md
│       ├── fix_quotes.py
│       └── push_to_github.sh
└── agents/
    └── worker.md      # Worker subagent definition
```

These files define how Claude understands my intent, organizes work, and executes tasks. **In other words, this is your AI assistant's "muscle memory."**

Switch to a new machine, restore Shell and Vim but leave `.claude/` behind -- your Claude is like an amnesiac, remembering no rules, possessing no Skills. Factory reset.

## Skills: Encoding Workflows into Config

Take Blog Writer as an example. This Skill encodes my entire blogging workflow into configuration:

- **SKILL.md**: Defines article format, writing style, narrative techniques, and a list of don'ts -- writing patterns Claude distilled from analyzing 17 of my posts, all captured in this file
- **fix_quotes.py**: Automatically fixes Chinese/English quotation marks (Chinese uses quotation marks, English uses straight quotes)
- **push_to_github.sh**: One-click push to GitHub, triggering auto-deployment

The result? I wrote about it in [AI Writes My Blog](/2026/02/11/ai-writes-my-blog/): **start with one sentence, publish in five minutes.** Not because AI thinks for me, but because every non-thinking step in writing -- formatting, layout, quotes, deployment -- gets absorbed by the Skill.

Without this Skill, every blog post requires re-explaining to Claude: what front matter to use, what tone, what structure, how to deploy. With it, Claude knows from the start.

**A Skill isn't a prompt template -- it's a productized workflow.**

## Convention as Architecture

In `.claude/CLAUDE.md`, I wrote one rule:

> **Core principle: You are a PLANNER, not an executor.**

That single line changed Claude's entire operating mode.

By default, Claude acts like a hands-on Staff Engineer -- takes a task and does everything itself: reads code, writes code, runs tests, all serially in the main session. While it's busy with a time-consuming task, you can only wait.

Add this convention, and it becomes a Tech Lead: breaks down tasks, delegates to background subagents, and focuses on coordination and verification. The main session stays responsive.

I covered this in detail in [Are You Using Claude Subagents Correctly?](/2026/03/02/claude-code-background-subagent/). Here I'll only emphasize one point: **wording determines behavior.**

The worker agent's description must include the word "PROACTIVELY" for Claude to actively delegate work. Without that word, it's like hiring someone but never assigning them tasks. One word's difference determines whether the system is proactive or passive.

**When tools become intelligent, configuration becomes architecture.**

## One curl, Everything Migrated

Looking back at this [dotfiles repo](https://github.com/johnsonlee/-), it manages things on two layers:

### Traditional Layer

Shell config, Vim plugins, Git aliases, Homebrew formulas -- muscle memory between you and the operating system.

### AI Layer

CLAUDE.md (behavior conventions), Skills (workflows), Agent definitions (delegation patterns) -- muscle memory between you and your AI assistant.

One `curl`, both layers migrated. Unbox a new machine, and it's not just Shell and editor that come back -- **your AI assistant comes back too, with all its "memories."**

Most people's Claude configs are still in the "configure as you go" stage -- Skills scattered everywhere, conventions stored in their heads, starting over with every new machine.

Exactly how most people managed dotfiles five years ago.

**The most valuable config is no longer `.vimrc`.**
