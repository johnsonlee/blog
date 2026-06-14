# Conventions

This file contains post-format and writing conventions only.

## Scope

- Include rules that affect how posts are named, structured, excerpted, written, or rendered.
- Do not include project overview, repository layout, setup steps, command references, deployment notes, or agent workflow instructions.
- Keep operational documentation in the relevant README, package scripts, or agent instructions instead.

## Post Files

- Published posts live in `source/_posts/`.
- Post filenames use lowercase kebab-case: `my-post-title.md`.
- Bilingual posts use paired files: `<slug>.md` and `<slug>.en.md`.
- The paired Chinese and English posts must share the same `i18n_key`.
- English posts must include `lang: en`; Chinese posts do not need a `lang` field.
- The permalink pattern is `:year/:month/:day/:title/`.

## Front Matter

Use this shape for Chinese posts:

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

Use this shape for English posts:

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

- Categories should reuse existing category names from `_config.yml` and existing posts.
- Tags are in English.
- Keep `date`, `categories`, `tags`, and `i18n_key` aligned between paired Chinese and English posts.

## Excerpts

- Use `<!-- more -->` to control the excerpt shown in post lists.
- Place `<!-- more -->` after the short hook that should appear on the posts list, usually after 1-2 short paragraphs.
- The target excerpt length is about 4-5 rendered lines on the posts list.
- Do not put `<!-- more -->` so early that the list shows only one line.
- Do not push `<!-- more -->` so far down that the list becomes a long intro.
- For bilingual posts, put `<!-- more -->` at the corresponding semantic boundary in both language files.

## WeChat Reading

- Optimize posts lightly for WeChat readers without turning the article into WeChat-style motivational writing.
- Mobile reading is the default assumption for WeChat: paragraphs should usually render as 1-3 lines on a phone.
- Keep sharp judgment sentences as standalone paragraphs when they carry the argument.
- Do not split explanatory progression into a stack of one-sentence paragraphs. If several adjacent sentences explain the same point, merge them into one paragraph.
- Standalone one-sentence paragraphs are allowed only for punchlines, sharp contrasts, explicit questions, or section-closing judgments.
- Three or more consecutive one-sentence paragraphs are a warning sign. Merge them, convert a real enumeration into a list, or deliberately justify the ladder-like rhythm.
- `npm run check:post-style` enforces this on changed posts; fix failures by improving paragraph rhythm, not by gaming punctuation.
- Put the section's conclusion or core tension near the beginning of each section so readers can scan.
- Use bold sparingly for a few key judgments, not as decoration.
- Keep established English technical terms, but avoid packing too many English-heavy terms into one phone screen when a simpler phrasing works.
- The goal is a readable mobile rhythm while preserving the blog's direct, opinionated voice.

## Writing Style

Write in Johnson's style: conversational with peers, opinionated, and concise.

### Stance Consistency

- Keep new posts consistent with Johnson's existing views.
- For topics Johnson has written about before, such as AI's effect on engineers, Agent economics, or investing analysis, check the previous stance before writing.
- Do not soften the conclusion just to make it sound safer.
- If the stance is unclear, ask instead of defaulting to a neutral middle-ground position.

### Language

- Chinese posts should primarily use Chinese while keeping established technical terms, product names, and acronyms in English, such as Token, Agent, API, ROI, App, Feed, trade-off, and judgment.
- Do not force translations for English terms that are already standard in the field.
- Natural code-switching is acceptable in Chinese posts when it matches the author's voice.
- Non-technical posts should not force the author's technical identity into the framing.
- Use embedded SVG for diagrams when needed in non-technical posts.
- Technical posts should use fewer code blocks and more PlantUML diagrams when diagrams communicate the idea better.

### Tone And Rhythm

- Keep the tone conversational but substantive.
- Do not write like an academic paper, press release, or neutral corporate memo.
- Make clear judgments and avoid trying to please both sides.
- Cut filler aggressively. If a word, phrase, or paragraph does not carry the argument, remove it.
- Use questions to move the argument forward.
- Use concrete imagined scenes to make abstract concepts visible.
- Keep paragraphs breathable. A normal paragraph is usually 2-4 sentences, and mobile-facing posts may be shorter.
- Before finalizing a post, scan each section for slide-like rhythm: repeated short standalone lines, repeated sentence openings, or list-shaped prose that is not an actual list. Revise those passages into coherent paragraphs.

### Structure

Overall narrative line: **hook -> observation -> insight / analogy -> judgment**

- Start with a concrete, vivid hook rather than an abstract problem statement.
- The opening should make readers want to continue.
- Let paragraphs advance the argument. Do not rely on empty transition phrases.
- `##` headings must carry information.
- Avoid generic headings such as "First Point" or "Background".
- Do not use punctuation marks in Markdown headings. Rewrite the heading instead of using commas, colons, dashes, question marks, or other punctuation.
- Avoid formulaic heading patterns such as "X is Y", "X is not Y but Z", or their Chinese equivalents. Prefer concrete action, scene, or consequence headings.
- Use `###` for subpoints inside a section. Do not simulate headings with bold text.
- The ending should return to the opening or core tension and make a clear judgment.
- Ending with a sharp question or compressed final sentence is acceptable when it fits the argument.

### Emphasis

- Use `**bold**` for core claims and key judgments.
- Do not overuse bold. One bold phrase or sentence per paragraph is usually the maximum.
- Bold text should usually be a complete judgment, not a single decorative word.
- Use Chinese double quotes `“...”` when the quoted content is Chinese.
- Use English straight double quotes `"..."` when the quoted content is English, even inside a Chinese paragraph.
- Check the generated HTML when using quotation marks in mixed Chinese and English text, and avoid broken smart quotes.

### Avoid

- Do not use textbook structures such as "first, second, finally".
- Do not use empty stock phrases or obvious cliches.
- Do not repeatedly start paragraphs with the same background framing.
- Do not overuse emoji.
- Do not write in a press-release or PR style.
- Do not use a detached author label; use first person when the article needs a personal stance.
- Do not use bold text as a heading. Use `###`.
- Do not keep self-evident modifiers.
- Do not use filler connectors when the sentence can state the point directly.
- Do not start with generic technology-progress boilerplate or end with a vague "wait and see" conclusion.
