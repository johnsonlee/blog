---
title: 10X 工程师的第一行命令
date: 2026-03-06 20:00:00
categories:
  - Computer Science
tags:
  - Developer Tools
  - Dotfiles
  - Claude Code
  - Productivity
  - AI
---

Dotfiles 管理不是什么新鲜事。Shell 配置、Vim 插件、Git alias——这套东西我几年前就放进了 [Git 仓库](https://github.com/johnsonlee/-)，一行 `curl` 搞定新电脑。但最近我发现，这个仓库里最值钱的东西，不再是 `.bash_profile` 或 `.vimrc`，而是 `.claude/`。

<!-- more -->

## 旧故事：把 ~ 放进 Git

我的方案是把 Home 目录变成 Git 仓库：

```bash
curl -sL 'https://sh.johnsonlee.io/setup.sh' | /bin/bash
```

这行命令把 `~` 初始化成 working tree，拉取所有 dotfiles，装 Homebrew 跑完 40 多个 formula，初始化 Vim 插件。跑完，新 Mac 和旧 Mac 一模一样——Shell 的配色、Git 的 alias、Vim 的快捷键，所有肌肉记忆瞬间回来。

仓库名叫 [`-`](https://github.com/johnsonlee/-)。`~` 不能做 repo 名，`-` 是最短的合法替代。

这套东西解决了一个老问题：**开发环境搭建的隐形成本。** 每次换电脑从零配起，两天算快的。放进 Git，一行 curl 拿回两天。

但这是旧故事了。新故事在 `.claude/` 里。

## 新故事：.claude 目录

自从 Claude Code 成了我的主力工具，`~/.claude/` 里积累的配置越来越多，也越来越值钱：

```
~/.claude/
├── CLAUDE.md          # 全局行为规范
├── settings.json      # 权限和偏好
├── skills/            # 可复用的工作流
│   └── blog-writer/   # 写博客的完整 Skill
│       ├── SKILL.md
│       ├── fix_quotes.py
│       └── push_to_github.sh
└── agents/
    └── worker.md      # Worker subagent 定义
```

这些文件定义了 Claude 怎么理解我的意图、怎么组织工作、怎么执行任务。**换句话说，这是你 AI 助手的“肌肉记忆”。**

换一台电脑，如果只恢复了 Shell 和 Vim，但 `.claude/` 没带过来——你的 Claude 就像失忆了一样，什么规矩都不记得，什么 Skill 都没有。回到出厂设置。

## Skill：把工作流装进配置

拿 Blog Writer 举例。这个 Skill 把我写博客的整套流程编码成了配置：

- **SKILL.md**：定义了文章格式、写作风格、叙事手法、禁忌清单——Claude 分析了我 17 篇文章后提炼出的写作模式，全在这个文件里
- **fix_quotes.py**：自动修正中英文引号（中文用 " "，英文用 " "）
- **push_to_github.sh**：一键推送到 GitHub，触发自动部署

效果是什么？我在[《不装了，文章都是AI写的》](/2026/02/11/ai-writes-my-blog/)里写过：**一句话起头，五分钟发布。** 不是因为 AI 替我思考了，而是写作中所有非思考的环节——格式、排版、引号、部署——全被 Skill 吃掉了。

没有这个 Skill，每次写博客我得重新告诉 Claude：用什么 front matter、什么语气、什么结构、怎么部署。有了它，Claude 开机就懂。

**Skill 不是提示词模板，是 productized workflow。**

## Convention 即架构

`.claude/CLAUDE.md` 里我写了一条规则：

> **Core principle: You are a PLANNER, not an executor.**

就这一句，改变了 Claude 的整个工作模式。

默认行为下，Claude 像一个事必躬亲的 Staff Engineer——拿到任务自己动手，读代码、写代码、跑测试，全在主会话里串行执行。当它在忙一个耗时任务时，你只能等。

加上这条 convention，它变成 Tech Lead：拆解任务、分派给 background subagent、自己负责协调和验证。主会话始终保持响应。

我在[《Claude Subagent 你用对了吗？》](/2026/03/02/claude-code-background-subagent/)里详细写过这个，这里只强调一点：**措辞决定行为。**

Worker agent 的描述里必须包含 "PROACTIVELY" 这个词，Claude 才会主动派活。少了这个词，就像招了人但从不给他分配工作。一个词的差异，决定了系统是主动还是被动。

**当工具有了智能，配置就是架构设计。**

## 一行 curl，全部搬走

回头看这个 [dotfiles 仓库](https://github.com/johnsonlee/-)，它管理的东西分两层：

### 传统层

Shell 配置、Vim 插件、Git alias、Homebrew formula——你和操作系统之间的肌肉记忆。

### AI 层

CLAUDE.md（行为规范）、Skills（工作流）、Agent 定义（分工模式）——你和 AI 助手之间的肌肉记忆。

一行 curl，两层全部搬走。新电脑开箱，不只是 Shell 和编辑器回来了——**你的 AI 助手也回来了，带着它的全部“记忆”。**

大多数人的 Claude 配置还停留在“随用随配”阶段——写过的 Skill 散落各处，convention 记在脑子里，换台电脑从头来过。

这和五年前大多数人管理 dotfiles 的方式一模一样。

**最值钱的配置，已经不是 `.vimrc` 了。**
