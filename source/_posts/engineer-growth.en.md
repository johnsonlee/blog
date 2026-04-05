---
title: How Engineers Grow
categories:
  - Career
tags:
  - Career
date: 2020-08-09 02:00:00
lang: en
i18n_key: engineer-growth
---

People used to ask me: "How do I become a senior engineer like you?" I'd usually brush it off with two words: "tinker more." Mostly because I was too lazy to give a long answer. But looking back, that wasn't quite fair -- some people genuinely wanted to grow. From my own experience, "tinker more" actually encompasses quite a lot:

1. Experience different corporate cultures
1. Try projects across different tech stacks
1. Build things you enjoy or find fun
1. Start a business
1. ...

## A Reliable Mentor

Many people want to grow but don't have the right conditions -- a poor team culture, unchallenging work (too small-scale or low technical complexity), and so on. For someone fresh out of school, the single most important thing for personal growth is having a reliable mentor who can point out your mistakes and guide you toward the right approach. A good mentor saves you detours and helps you build solid habits that form the foundation for your future career.

Looking back on my own growth, the most memorable period was my time at Kortide. As a non-CS-major engineer, building a complete and vivid understanding of operating systems, virtual machines, and compilers takes enormous time and effort to digest. Kortide had a unique advantage in this regard: before *Android* was even released, they had built their own phone from scratch -- from the *bootloader* to the entire operating system, *Elastos*. The 2009 financial crisis killed the chip manufacturer, and the phone never made it to market. Then *Google* launched *Android*, and *Elastos* lost its direction for a while. My team was responsible for IDE tooling -- *Eclipse* plugins, including a text code editor and a visual designer. For someone who had just graduated and didn't have a CS background, it was genuinely difficult. Interestingly, more than half our team came from non-CS backgrounds -- electronics, mold design, you name it. My *Leader* was one of them. I remember one colleague from the mold-design program who originally got into software because he wanted to hack into a professor's computer to steal exam papers for a girl he liked.

The hardest part of building a text code editor was the *Parser* -- not just parsing the *AST*, but constructing context based on cursor position for things like auto-completion and template code generation. Strongly typed languages like *Java* were relatively manageable, but for a loosely typed, syntactically flexible language like *JavaScript*, building a good editor was a real challenge. For the visual designer, the core was the graphics rendering engine. Before I actually worked on it, I thought visual design tools were deeply mysterious -- but in practice, what you see in the *IDE* is just an image (the rendering result from the *SDK*'s local graphics engine).

The work atmosphere was great. My mentor and *Leader* gave me a lot of help, and that's when I learned to write *Parsers* by hand. I still remember when I was building my first *Android* app (a side project) -- a photo filter feature. I only had one *HTC* phone, and my *Leader* used his connections to borrow two more phones for testing. He even helped me optimize the filter's performance. He once showed me a *demo* he'd made -- a *3x3* Rubik's cube rendered by the *CPU* (with drag-to-rotate support) -- and it gave me a much deeper understanding of graphics systems.

Some people might say: "What if I don't have a reliable mentor?" In other words -- there are no senior engineers on the team, or there are but they won't share. A few options:

1. If there are senior engineers, be humble and proactive in asking for guidance. Show genuine sincerity, and they'll naturally be willing to teach you.
1. If there truly are no senior engineers:

    1. Transfer to another team.
    1. Switch companies -- join a bigger one.

## Contributing to Open Source

For recently graduated engineers, contributing to open source can be challenging. Open source projects tend to involve deeper technical work, and as a contributor you're doing more output than input -- which is hard when you're still in the early stages and need a lot of input to build your skills.

But for engineers with a solid foundation who want to expand their influence, it's an excellent path. Through open source, you get to interact with engineers of all levels. People will file all sorts of issues, and you have to actively respond to questions and suggestions. In the process of engaging with others and handling *issues*, you'll naturally enrich and refine your own knowledge.

## Leading a Commercial Project

Open source is great for deepening technical skills and building influence, but an engineer's growth shouldn't be limited to the technical domain. Many tech company *VPs* and *CEOs* started as engineers. You might get that opportunity someday too -- and even if not at the *VP* or *CEO* level, reaching *GM* is entirely within reach. When you're running a business unit as a *Manager*, the challenge goes well beyond technical ability. You need to know the business inside out -- not just the current state, but the future direction. For an engineer, leading a commercial project means your role isn't just technical implementation; you're responsible for the entire lifecycle, from project initiation and budget planning to development timeline and ultimately profitability.

In leading a commercial project, technical work occupies only a small fraction of the lifecycle. Most of the work is communication, process alignment, and risk management. For engineers, these are far harder than the technical implementation itself. Once you've been through it, you gain a holistic understanding of the logic behind the project, and you'll never say things like:

> I have no idea what those OKRs have to do with me. Just tell me what to build.

For a regular employee, leading a commercial project doesn't require worrying much about the company's financials. If the project succeeds, you might get a bonus; if it fails, the worst that happens is a lower performance review -- the company absorbs the financial impact either way. For *To C* projects, delays don't carry much risk beyond writing a postmortem. But *To B* projects mean contractual obligations -- if the client pushes back, there's real money at stake. The project lead might lose their bonus. And for a startup, the project's success or failure directly determines whether the team lives or dies.

A friend who worked in ERP once told me that ERP consultants charge by the hour -- travel time is billed, lunch breaks are billed, overtime past 8 hours is billed, and it's not cheap. Clients pay because they have to. Why are ERP consultants worth that much? Their implementation experience.

Failed experience is common; successful experience is rare. If you're fortunate enough to lead a commercial project to success with solid profits, that experience creates a gap between you and other engineers. This is the core value of senior engineers -- and it explains why engineers from big companies carry an inherent halo: the experience from major companies is simply worth more.

## Continuous Learning

In my first few years of working, I didn't understand why interviewers would ask:

> What's the latest version of *Java*?

I thought: "What's the point of this question? You can just look it up." Later, when I became an interviewer myself, I finally understood why seemingly "pointless" questions like this are asked.

As an interviewer, the intent is to gauge your engagement with technology: whether you follow the latest developments, whether you dig into the details of new releases, and whether you lean conservative or aggressive in adopting new technology.

Some might ask:

> Even if I know the latest version, what good does it do? Does it make me better than everyone else?

That's missing the point. You have to think long-term. If someone has been continuously learning new technologies since they started working, when measured in years, a quantitative-to-qualitative transformation eventually occurs. That's the deeper meaning of the question.

When you transition from a frontline engineer to a *Leader* or *Manager*, there's even more to learn. You're the team's backbone, the lighthouse, the reliable support everyone counts on. You need to learn far beyond technology and business -- you need to pay attention to every team member's morale, work state, and even personal well-being.

Someone once asked me:

> How do you keep learning continuously?

My method is pretty simple -- take it as a reference:

1. Read consistently (books). Set a goal -- not too aggressive. Persistence matters more than speed.
1. Subscribe to *RSS* feeds. Platforms like *GitHub* and *Twitter* all have *RSS* interfaces. The best approach is to follow industry leaders' activity, or generate *RSS* feeds based on *Twitter* topics. Spend 1-2 hours a day on this.

    - My [GitHub RSS](http://github.com/johnsonlee.atom)
    - My [Blog RSS](http://johnsonlee.io/atom.xml)

1. Hands-on practice. When a new tool or language comes out, build something fun with it (not a *helloworld*-level demo).
1. Build a habit of regular reflection and summarization.
