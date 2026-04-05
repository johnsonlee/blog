---
title: "I Won't Pretend Anymore — AI Writes My Blog"
lang: en
i18n_key: ai-writes-my-blog
date: 2026-02-11 10:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Claude
  - Blog
  - Productivity
  - Workflow
---

Last week a friend read my blog and messaged me: "Where do you find the time to write all these long posts?"

I replied with two words: I don't.

That confused him even more.

The truth is, I did "write" these posts -- but I didn't type them out word by word. They're the product of conversations between me and AI. I supply the ideas and judgment; AI turns them into finished articles.

The whole process takes 5 minutes.

I know what you're thinking: aren't AI-written articles just the kind of boilerplate that opens with "as technology continues to evolve" and closes with "let's wait and see"?

Not really. The key is how you make AI write.

## Good tools make good work

If you just tell AI "write me a blog post about XXX," what you get is almost certainly a generic press release. AI doesn't know your writing style, your blog's tech stack, or your front matter format. Having to teach it from scratch every time -- you might as well write it yourself.

So the first thing I did was build Claude a dedicated "Blog Writer Skill."

Think of a Skill as a work manual for AI. It tells AI: what format your blog uses, what your writing style looks like, how articles should be structured, and how to publish them. **Configure once, effective forever.**

The best part: the process of building this Skill is itself just chatting with Claude.

I said "I want to build a Skill for writing blog posts," and Claude started asking me questions: What's the tech stack? Hexo. Front matter format? I pasted an existing post for it to see. Writing language? Primarily Chinese. Where does it push to? GitHub Pages, repo `johnsonlee/blog`, `master` branch.

Just like that, back and forth, and a few minutes later Claude generated a complete Skill with two files:

**SKILL.md** -- the core instruction file, looks like this (excerpt):

```yaml
---
name: blog-writer
description: >
  Write tech blog posts and publish to johnsonlee.io (Hexo + GitHub Pages).
  Use this skill when the user mentions "write a blog", "write a post",
  "publish a post", "blog", "write a tech share", or after discussing
  a topic says "turn this into a blog post".
---
```

It defines the front matter format, file naming conventions, writing style (including tone, structure, and what to avoid), and even the workflow for pushing to GitHub.

**push_to_github.sh** -- a push script that commits the generated Markdown file directly to my blog repo via the GitHub API. No cloning, no local operations -- one API call and done.

## Writing style matters

The part of the Skill I spent the most thought on was defining the writing style.

I pasted several of my previous articles for Claude to analyze my writing characteristics. What it distilled was surprisingly accurate:

- Primarily Chinese, but technical terms stay in English, with natural code-switching
- Conversational but with depth, like talking to a peer
- Fond of using rhetorical questions to drive arguments forward
- Uses scenario imagination to ground abstract concepts
- Bold text highlights core judgments, not decoration

Then it also summarized what I don't do: no "as we all know," no "first... second... finally" textbook structure, no referring to myself as "the author," no PR-speak tone.

**Once these rules are written into the Skill, every future article automatically follows them.** I don't need to remind AI every time to "not sound too formal."

## What writing a blog post in 5 minutes actually looks like

With the Skill in place, the blogging workflow becomes:

**Minute 1: Throw out a topic.**

> "Write a blog post on 'When Agents become the entry point, where do Apps go?'"

One sentence. Claude generates a complete article following the style and structure defined in the Skill.

**Minutes 2-3: Review and adjust.**

The AI-generated first draft usually has sound structure, but some arguments might not be sharp enough, or an example might not quite fit. I give feedback:

> "The argument in section three is too mild, make it more aggressive"
> "Replace the e-commerce example with a food delivery scenario"

Claude revises, I review once more.

**Minute 4: Confirm and publish.**

Claude shows the final version, confirms the filename, tells me which repo and branch it'll push to. I say "ship it," and it pushes the article via the GitHub API.

**Minute 5: GitHub Pages auto-builds, article goes live.**

No editor needed, no `git clone`, no `hexo new post`.

## Is this cheating?

I bet some people will say: isn't this just having AI ghostwrite for you? What's there to show off?

Here's how I see it: **the core of writing has never been typing -- it's thinking.**

The value of a good article lies in its perspective, its insight, its mental framework. AI can't fabricate those -- it just helps me turn what I've already thought through into a format readers can consume.

Just like no one considers using a typewriter "cheating," and no one considers using Word's spell checker "cheating." AI writing simply raises efficiency by another order of magnitude.

And honestly, the process of conversing with AI is itself thinking. I need to be clear about what I want to express, what my core argument is, what I want readers to take away. If I can't articulate these things myself, AI can't write them either.

**AI is an amplifier, not a replacement. What it amplifies is your thinking ability, not your typing speed.**

## You can do it in 5 minutes too

If you have your own tech blog and want this workflow, the steps are simple:

1. **Chat with Claude and build your Blog Writer Skill** -- tell it your blog's tech stack, writing style, and publishing workflow; it'll generate a SKILL.md and push script for you
2. **Generate a Personal Access Token on GitHub** -- go to https://github.com/settings/tokens, check the `repo` permission, dedicated to pushing blog posts
3. **Write blog posts** -- open Claude, say "write a blog post on XXX," review, adjust, push, done

The entire setup takes under 10 minutes. After that, each article takes 5 minutes.

Of course, this workflow assumes you have something worth writing. AI can help you organize language, but it can't generate insight for you. If you have no opinions in your head, AI will just help you produce nonsense more efficiently.

## One last thing

This article itself was written using this exact workflow.

From the moment I told Claude "write a blog post titled 'I won't pretend anymore -- AI writes my blog'" to the article you're reading now, what happened in between? One conversation, a few rounds of adjustment, one API call.

Some might feel something's missing from writing this way -- the ritual of weighing every word, the sense of accomplishment from finishing a long piece.

But I think **spending the saved time thinking about more problems is far more valuable than spending it on formatting and word choice.**

After all, writing is for conveying ideas, not for proving how many words you can type.
