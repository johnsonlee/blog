# Hexo 双语发布

仓库中的 `AGENTS.md` 是 post 格式规则的 canonical source。本 reference 补充执行顺序和容易出错的发布边界。

## 交付范围

按 `SKILL.md` 确定本次是草稿、局部改稿、翻译还是完整发布准备，再追踪受影响的文件。仅研究或策划不自动创建 post；草稿放在 `source/_drafts/`，不因完成写作而自动转为 published post。

新建正式文章、草稿转正式文章及完整发布准备，都读取 [visuals.md](visuals.md) 交付 5:2 与 3:4 两套封面，即使正文没有配图。局部改稿检查既有封面和导出文件：只有其标题、事实或视觉受影响才更新，不无条件重做或补齐此前不存在的封面。

已有 SVG 的变化需同步其双语版本及同名 PNG；双语正文的事实、章节、链接或图片变化也须追踪到另一版本。只改措辞时保留其他已成立的段落。所有 published post 的修改仍须满足下面的双语 hard gate。

## 双语是 Hard Gate

任何新增或修改的 published post 都必须同时交付中文和英文版本。缺少任一版本、front matter 不对齐、H2/H3 结构不对应、`<!-- more -->` 缺失、外链集合不一致、图片集合不一致，或英文正文没有引用配套的 `.en.svg`，`npm run check:bilingual` 和 `npm run build` 必须失败。不得用“先发中文、以后补英文”绕过。

## 文件与 Front Matter

中文版使用 `source/_posts/<slug>.md`，英文版使用 `source/_posts/<slug>.en.md`。slug 使用 lowercase kebab-case。

```yaml
---
title: 中文标题
date: YYYY-MM-DD HH:mm:ss
categories:
  - Existing Category
tags:
  - Tag
i18n_key: slug
---
```

```yaml
---
title: "English Title"
date: YYYY-MM-DD HH:mm:ss
lang: en
i18n_key: slug
categories:
  - Existing Category
tags:
  - Tag
---
```

两个版本的 `date`、`categories`、`tags` 和 `i18n_key` 保持一致。category 优先复用仓库已有值，不凭空创建近义分类。

在语义对应的位置放置 `<!-- more -->`。引子应在截断前完整成立，同时避免首页只显示一句或大段正文。

## 站内链接

引用 johnsonlee.io 的其它文章时使用 Hexo `post_link`，不要硬编码生成后的日期 permalink：

```markdown
{% post_link target-slug '中文标题' %}
{% post_link target-slug.en 'English Title' %}
```

第一个参数使用 `source/_posts/` 下不带 `.md` 的 filename。不要把 `post_link` 再包进 Markdown link。外部来源继续使用标准 Markdown link。

修改站内链接后运行 Hexo build，并检查生成 HTML 的 `href`；源码看起来正确不等于最终 permalink 正确。

## 中英文顺序

新稿先稳定中文，再生成英文；纯翻译使用用户指定的稳定原稿，已有英文局部编辑核对配套中文，不重启整篇创作。保持以下内容语义一致：

- 章节层级与论证顺序
- 事实、数字、状态和不确定性
- `<!-- more -->` 的语义位置
- 正文引用、Sources 和图片
- `**加粗**` 所强调的判断

英文不是逐句直译。重写不自然的中文语序、模板连接和过度对称的 `not A, but B`，但不能改变判断强度或证据边界。

## 验证

按仓库实际提供的 scripts 运行检查，通常包括：

```bash
npm run check:bilingual
npm run build
```

`build` 按 `package.json` 执行 agent guidance、双语、post style、Hexo generation 和 quotes 检查。某一项失败时再单独运行对应 script 定位，不要用局部成功替代完整 build。仅修改 skill 文档时验证规则和引用，不要求生成无关文章资产。

需要自动修正引号时运行：

```bash
python3 .agents/skills/blog/scripts/fix_quotes.py <post.md>
```

不要只比较 Sources 数量。至少核对两种语言的 H2/H3 结构、图片引用、正文外链 URL 集合和 Sources URL 集合，并解释确有必要的语言差异。

## GitHub

文件修改遵循当前 workspace 的 git 约定和 `SKILL.md` 中的外部操作授权边界。

PR Summary 要描述文章回答了什么、证据和图示覆盖了什么、代码或发布机制改了什么，以及实际执行的验证。不要把 commit 过程或原始命令输出当作 Summary。
