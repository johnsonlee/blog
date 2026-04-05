---
title: Claude Subagent 你用对了吗？
date: 2026-03-02 22:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Agent
  - Claude
  - Productivity
  - Workflow
i18n_key: claude-code-background-subagent
---

之前聊过，AI 的工程能力已经达到了 Staff Engineer 的水平。但用了几个月 Claude Code，我发现一个反直觉的事实：**这位 Staff Engineer 天天在画 UI 写 CRUD。** 你让它改一个文件，它在主 session 里一路干到底——读代码、分析依赖、写 patch、跑测试。整个 context window 被塞得满满当当，你想插一句"顺便看看另一个 bug"，得等它干完才行。明明手下有人，非要自己撸代码。

## 为什么它不愿意放手？

Claude Code 明明有 subagent 机制——主 session 可以把任务委派给独立的子 agent，每个子 agent 有自己的 context window，互不干扰，还能跑在后台。但默认情况下，主 agent 不会主动委派。它的本能是"自己动手"。

这合理。对于一个通用工具来说，"自己干"是最安全的默认策略——不需要判断哪些该委派，不需要处理子任务之间的协调，不需要考虑并行写文件的冲突。所有事情在一个 context 里完成，简单、可控、不出错。

**默认值永远服务最大公约数。** Claude Code 不知道你是同时推进三件事的老手，还是只想让它帮忙补个函数的初学者。面对不确定性，保守是对的。

但"对"不等于"最优"。

## Planner, not Executor

既然主 agent 的默认行为是"什么都自己干"，那就告诉它别这样。

Claude Code 的 CLAUDE.md 是主 agent 每次启动都会读的行为指南。我在项目的 CLAUDE.md 里加了一条 convention：

```markdown
- **Planner, not executor**: When handling tasks, default to launching
  subagents for implementation. The main conversation's role is planning,
  coordination, and review -- not direct execution. Always launch subagents
  in the background (`run_in_background: true`) so the main conversation
  stays responsive to user input.
```

核心思想就一句话：**主 agent 的角色是规划和协调，不是亲自执行。**

效果立竿见影。给一个复杂任务，主 agent 不再自己闷头干，而是先拆解，再把子任务派发给 background subagent。研究性任务跑后台，主 session 保持空闲，可以同时推进别的事。

但有个问题——这条规则写在项目的 `.claude/CLAUDE.md` 里，只对当前项目生效。换一个项目，主 agent 又变回那个"什么都自己干"的状态。

每个项目都抄一遍？不现实。

## 从项目级到全局级

那怎么让这条规则对所有项目生效？

答案很简单：把配置从项目目录搬到用户目录。Claude Code 会先读 `~/.claude/CLAUDE.md`，再读项目级的。全局配置对所有项目生效，项目级配置可以覆盖或补充。

于是有了[这个 PR](https://github.com/johnsonlee/-/pull/3)——把 routing rules 和 worker agent 定义直接写在 `~/.claude/` 下。routing rules 告诉主 agent"大部分任务优先走 background dispatch"，worker agent 定义让委派有地方落。

这里有个措辞上的细节：worker agent 的 description 里要写 "PROACTIVELY"。Claude Code 的调度逻辑会读这个字段来决定是否主动委派。不加这个词，agent 只是"可用"但不"主动"——相当于雇了个人但从来不派活。这跟在 job description 里写"主动推进"还是"配合完成"一样，措辞决定了角色是找活干还是等分配。

顺手再设一个 `CLAUDE_CODE_SUBAGENT_MODEL` 环境变量，主 session 跑 Opus、subagent 跑 Sonnet，推理能力和成本各取所需。

这套从项目级到全局级的配置体系，本质上是在构建 **AI 工具链的 convention**——跟在团队里推 code style、commit convention、CI pipeline 一个道理。convention 建立了，每个新项目直接继承，不需要从零开始。

## 几个坑

### 后台无法交互

后台 subagent 不支持交互式确认。涉及文件写入的任务，Claude Code 会在启动前统一问你授权。忘了给权限，它会卡住。

### Prompt 必须自解释

subagent 没有 stepwise plan，收到任务直接执行，没有中间输出。**prompt 必须足够清晰——模糊的指令加上没有交互，等于翻车。**

### 文件边界要划清

多个 subagent 并行写同一组文件会冲突。委派时注意文件边界，跟给团队分任务时避免两个人改同一个文件是一回事。

### 主 agent 偶尔"失忆"

主 agent 偶尔还是会"忘记"委派。手动按 `Ctrl+B` 可以把当前任务移到后台，`/tasks` 查看进度。不优雅，但有效。

## 使用方式本身就是架构设计

回头看，一条写在 CLAUDE.md 里的 convention，表面上只是改了个配置。但你在做的事情是：定义谁负责规划、谁负责执行、什么时候并行、什么时候串行、前台和后台怎么分工。

这不是"配置"，这是架构设计。

过去做架构，设计的是代码怎么组织、模块怎么分、接口怎么定义。这些决策的对象是没有智能的——类不会自作主张去调用另一个类，函数不会"觉得"自己应该跑在后台。你画好了图，它们就老老实实地按图执行。

但当工具有了智能，事情就变了。主 agent 会自己判断"这件事我能干"然后就干了。subagent 的 description 里少一个"PROACTIVELY"，它就真的坐在那等着被调用。你写的每一条规则、每一个措辞，都在塑造一个有自主判断能力的系统的行为边界。

**当工具有了智能，使用方式本身就是架构设计。** 工具还是那个工具，但你可以决定它是继续埋头写 feature，还是带团队。
