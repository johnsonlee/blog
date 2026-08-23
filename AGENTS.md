# AGENTS.md

## Repository

This repository is Johnson Lee's personal Hexo blog, published at `johnsonlee.io`.
Most posts are Chinese with established English technical terms left in place.
Treat post edits as editorial work with a stable author voice, not generic Markdown cleanup.

## Commands

- `npm start`: run the local Hexo server on port 8000 with drafts and debug output.
- `npm run build`: run repo guidance checks, changed-post style checks, Hexo generation, and quote checks.
- `npm run check:agents`: validate this file still contains the repo guidance Codex needs.
- `npm run check:post-style`: check changed posts for overly fragmented mobile-reading rhythm.
- `npm run check:quotes`: check mixed Chinese/English quote handling in source and generated HTML.
- `npm run clean`: remove generated Hexo artifacts.
- `npx hexo new post "title"`: create a published post.
- `npx hexo new draft "title"`: create a draft.

Run `npm run build` before opening a PR when you change posts, theme templates, rendering scripts, or publishing checks.

## Layout

- `source/_posts/`: published Markdown posts.
- `source/_drafts/`: drafts shown by the dev server.
- `source/images/`: post images and SVG diagrams.
- `source/about/`: the about page.
- `themes/maupassant/`: active Hexo theme.
- `scaffolds/`: Hexo templates for new content.
- `tools/`: repository validation scripts.
- `.agents/skills/blog/`: repo-scoped Codex skill for planning, writing, rewriting, translating, and publishing posts.

## Writing Workflow

Use the repo-scoped `$blog` skill for any substantial post planning, research, drafting, rewriting, translation, publishing, or style-sensitive edit. The skill's references are the canonical source for research depth, Johnson's writing style, publishing flow, investing-article rules, visuals, and helper scripts.

When touching posts without invoking the skill, still preserve these baseline rules:

- Keep the author's direct, opinionated, concise voice.
- Do not soften an existing stance to sound safer.
- Check related older posts before changing conclusions on topics Johnson has written about, especially AI, agent economics, investing, and engineering judgment.
- Prefer a concrete hook, observation, insight or analogy, then judgment.
- Use `##` headings that carry information, and `###` for subpoints.
- Use `**bold**` only for core claims or key judgments.
- Do not use bold text as a heading.
- Avoid textbook structures, boilerplate openings, press-release tone, detached author labels, filler connectors, and vague endings.

## Post Format

- Published posts use `source/_posts/<slug>.md`.
- Drafts use `source/_drafts/<slug>.md`.
- Post filenames use lowercase kebab-case.
- Bilingual posts use paired files: `<slug>.md` and `<slug>.en.md`.
- Paired Chinese and English posts share the same `i18n_key`.
- English posts include `lang: en`; Chinese posts do not need `lang`.
- The permalink pattern is `:year/:month/:day/:title/`.
- Tags are English.
- Categories should reuse names from `_config.yml`: Android, Architecture Design, Biology, Booster, Career, Cloud, Computer Science, DIY, Flutter, Gradle, Graphics, iOS, Java, Kotlin, Life, Mobile, Observability, Open Source, Reading, Survival, Investing.

Chinese post front matter:

```yaml
---
title: Post Title
date: YYYY-MM-DD HH:MM:SS
categories:
  - Category Name
tags:
  - Tag1
  - Tag2
i18n_key: post-slug
---
```

English post front matter:

```yaml
---
title: "English Title"
date: YYYY-MM-DD HH:MM:SS
lang: en
i18n_key: post-slug
categories:
  - Category Name
tags:
  - Tag1
  - Tag2
---
```

Keep `date`, `categories`, `tags`, and `i18n_key` aligned between bilingual pairs.

## Excerpts And Rhythm

- Use `<!-- more -->` to control the excerpt shown in post lists.
- Put `<!-- more -->` after a complete short hook, usually after 1-2 short paragraphs.
- Avoid excerpts that show only one line or an overly long intro.
- Put `<!-- more -->` at the corresponding semantic boundary in bilingual pairs.
- Optimize lightly for WeChat/mobile reading without turning posts into WeChat-style motivational prose.
- Avoid three or more consecutive short one-sentence paragraphs unless they are deliberate punchlines, contrasts, questions, or section-closing judgments.

## Links, Media, And Diagrams

- Use Hexo `post_link` for links to other posts instead of hard-coded generated permalinks.
- Technical posts should prefer PlantUML or Graphviz diagrams when a diagram explains the idea better than code.
- Non-technical posts can use embedded SVG when a figure is needed.
- For bilingual posts with visible text in images, keep paired assets such as `name.svg` and `name.en.svg` synchronized.
- Render visual changes before considering them done; SVG source that parses is not enough.

## Deployment

Pushes to `master` trigger GitHub Actions, which builds the site and deploys `public/` to the GitHub Pages targets for `johnsonlee.io` and `blog.johnsonlee.io`.

Do not run `npm run deploy`, push to `master`, or publish generated output unless the user explicitly asks for that external action.
