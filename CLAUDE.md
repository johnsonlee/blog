# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal technical blog by Johnson Lee, powered by **Hexo 6.3.0** and hosted on GitHub Pages at `johnsonlee.io`. Content is primarily in Chinese with English technical terms. Topics include mobile development, software architecture, performance optimization, open source (Booster, VirtualApk), AI/LLM, and career reflections.

## Commands

- `npm start` — Local dev server on port 8000 (includes drafts, debug mode)
- `npm run build` — Generate static site to `public/`
- `npm run clean` — Clean generated files and `db.json`
- `npx hexo new post "title"` — Create a new post
- `npx hexo new draft "title"` — Create a new draft

## Architecture

```
source/_posts/       # Published blog posts (~160 posts, markdown)
source/_drafts/      # Draft posts (visible in dev server only)
source/about/        # About page
themes/maupassant/   # Active theme (Pug templates, SCSS styles)
  layout/            # Page templates (base.pug, post.pug, index.pug, etc.)
  source/            # Theme assets (CSS, JS, fonts)
  _config.yml        # Theme config (Gitalk comments, widgets, menu)
scaffolds/           # Templates for `hexo new` (post.md, draft.md, booster.md)
_config.yml          # Main Hexo config (site settings, permalink, categories, plugins)
.github/workflows/   # CI/CD: auto-deploys to GitHub Pages on push to master
```

## Post Frontmatter Format

```yaml
---
title: Post Title
date: YYYY-MM-DD HH:MM:SS
categories:
  - Category Name
tags:
  - Tag1
  - Tag2
---
```

**Categories** must use names from `category_map` in `_config.yml`: Android, Architecture Design, Biology, Booster, Career, Cloud, Computer Science, DIY, Flutter, Gradle, Graphics, iOS, Java, Kotlin, Life, Mobile, Observability, Open Source, Reading, Survival, Web.

**Tags** are in English (recently unified).

**Post filenames** use lowercase kebab-case: `my-post-title.md`.

**Permalink pattern**: `:year/:month/:day/:title/`

## Enhanced Content Features

- **PlantUML** diagrams via `hexo-filter-plantuml` (rendered server-side)
- **Graphviz** diagrams via `hexo-graphviz`
- **LaTeX math** via `hexo-filter-mathjax`
- Syntax-highlighted code blocks with line numbers

## Deployment

Pushing to `master` triggers GitHub Actions which builds the site and force-pushes to:
- `johnsonlee/johnsonlee.github.io` (CNAME: johnsonlee.io)
- `johnsonlee/blog` gh-pages branch (CNAME: blog.johnsonlee.io)

## Writing Style Guide

写出一篇符合 Johnson 风格的博客，核心是：**像在跟同行聊天，敢下判断，惜字如金。**

### 立场一致性

Johnson 已有的博客观点必须保持一致。涉及他写过的主题（如 AI 对工程师的影响、Agent 经济、投资分析等），先确认之前的立场，不要自作主张给出温和化的结论。如果不确定，问。不要默认写一个"安全的"中间立场。

### 语言

- **中文为主**，技术术语、产品名、缩写保留英文（Token、Agent、API、ROI、App、Feed、trade-off、judgment 等）
- 不要刻意翻译约定俗成的英文术语
- 中英混用是自然的，如"这套逻辑在过去是 work 的"、"这个 mismatch 越来越大了"
- 非技术博客不要强行往技术人身份上靠（不写"作为技术人"、"作为 Android 工程师"之类）；需要图表时用 SVG 内嵌到 markdown
- 技术博客少放代码，多用 PlantUML 图

### 语气和节奏

- **口语化但有深度**，不是论文，不是新闻稿
- 敢下判断，有观点，不两边都不得罪
- **惜字如金，砍掉一切冗余**。能不说的就不说，能少一个字就少一个字。例如："面试工程师"→"面试"；"答案大概是接近零"→"答案接近零"；"日常工作的大部分时间"→"大部分时间"
- 善用反问推进论点："那么，当注意力不再是稀缺资源，什么会取而代之？"
- 善用场景想象让抽象概念具体化："想象一下这个场景：用户对 Agent 说……"
- 段落不要太长，保持呼吸感。一个段落通常 2-4 句话

### 文章结构

整体叙事线：**钩子 → 观察 → 洞察/类比 → 判断**

- **钩子（引子）**：从一个具体的、有画面感的切入点开始——不是从"问题"开始，而是从一个让人想往下读的场景或经历。**开篇到第一个 `##` 之间只用一个段落**，这样 Hexo 生成的 post list 摘要更美观。例子："最近被邀请去帮其他部门面试。" "自从充了 Claude MAX 会员，每天跟 Claude 聊的比跟我老婆聊的都多。"
- **段落推进靠论点**，不是靠"但很快遇到了下一个问题"这种过渡连接词。每个段落自身就是一个推进力
- **`##` 标题要有信息量**（"AI 替代的是 Execution，不是 Judgment"、"注意力经济的黄昏"），不要描述性的"第一点""背景介绍"
- **章节内子要点用 `###` 三级标题**，不要用加粗模拟标题
- **结尾**：回扣开头，给出自己的判断，常以一个发人深省的问题或短句收尾。例子："先问自己：我给了几个维度？" "你准备好成为那个弹药库了吗？"

### 强调方式

- 用 `**加粗**` 突出核心观点和关键句
- 不滥用，一个段落最多一处加粗
- 加粗的应该是完整的判断句，不是单个词
- 中文引号用 `" "`，英文引号用 `" "`

### 禁忌清单

- 不用"首先……其次……最后……"这种教科书结构
- 不用"众所周知"、"不言而喻"、"毋庸置疑"、"让我们拭目以待"这类套话
- 不要每段开头都是"在……的背景下"
- 不要过度使用 emoji
- 不要写成新闻稿或公关文的语气
- 不要自称"笔者"，用"我"
- 不要用加粗文字当标题，用 `###`
- 不写不言自明的修饰语（"面试工程师"的"工程师"、"这个动作的价值"的"这个动作"）
- 不用"一个很大的好处是"、"问题在于"、"我认为"这类注水连接词，直接说
- 不要写"随着技术的不断发展"开头、"让我们拭目以待"结尾的八股文
