---
title: How to Be an Excellent PPT Engineer
categories:
  - Career
date: 2022-11-13 00:00:00
lang: en
i18n_key: how-to-be-an-excellent-ppt-engineer
---

I've been reviewing a lot of documents written by engineers lately, and the problems are remarkably consistent: walls of text with zero diagrams, or technical roadmaps that are just a pile of tasks with no visible connection to the overall goal. Even senior engineers are guilty of this.

## A Professional Attitude

Right after college, in the thick of the financial crisis, jobs were absurdly hard to find. A week after sending out resumes, the first company to respond was a small team of three -- all newly hired. I was the only fresh grad; the others had years of experience. The interview went smoothly, and I got an offer that same afternoon. Given the crisis, I accepted immediately and showed up the next day.

In my first week, the boss handed me a project: build a system for a bank -- and it had to use JDK 1.4. After the requirements review, I volunteered to write the design document. A few days later, I emailed it to the team for review. At lunch, one of the more senior-looking engineers sidled up to me and asked:

> "Jingsen, how many years have you been working?"

I was caught off guard.

> "Why?"

> "I read your document. It feels really professional!"

I thought to myself: "You've got three years of experience and you're telling a fresh grad his document looks professional? Are you kidding me?"

> "Oh, really? This is my first job."

I have no idea what he thought after hearing that, but I noticed he was noticeably less vocal for a while after.

Was my document really that professional? To borrow a line from Guo Degang: "It's all thanks to how my peers set the bar." How professional can a fresh grad's document really be? But why did it impress a three-year veteran? I've thought about it, and it probably traces back to my university advisor. He was meticulous about details -- in research and in life. He gave off an air of professionalism in everything, and our lab reports were no exception. That's when I developed the habit of making documents as clean as possible:

1. Consistent fonts
1. Different heading levels use different font sizes
1. Uniform font size and color for body text
1. Table of contents and indexes for longer documents
1. Break up long paragraphs -- proper sectioning gives content rhythm and structure
1. No typos

To this day, I remember a comment my teacher left on one of my assignments: "Reading your work is a genuine pleasure."

This applies to code just as much as documents. Before I started working, I rarely used an IDE -- mostly text editors -- so I almost never used auto-formatting. I formatted everything by hand as I wrote. That's why whenever someone asks me to review code, the first thing I scan for is formatting:

1. Is the indentation correct and aligned?
1. Are there spaces where there should be spaces?
1. Are there blank lines where there should be blank lines?

I generally refuse to review code that isn't cleanly formatted.

## A Picture Is Worth a Thousand Words

Before writing a document, I usually start by drawing diagrams. Once the diagrams are done, the structure and outline of the document naturally emerge. Many people think diagramming is an art, but I disagree -- it's a skill you can develop through practice.

### Diagram Structure

Here I'm mainly talking about architecture diagrams. There are many established frameworks and models, such as:

- [UML](http://www.uml.org/)
- [C4](https://c4model.com/)

Compared to [UML](http://www.uml.org/), [C4](https://c4model.com/) is easier to pick up. Regardless of the model, architecture diagrams go from high-level to low-level, like zooming in on a map. The deeper you go, the more detail appears. Remember:

> You don't need to show everything in a single diagram!!!
> You don't need to show everything in a single diagram!!!
> You don't need to show everything in a single diagram!!!

Start with the most abstract, highest-level view. This aligns with how the human brain processes information -- outline first, then details. If you expose too much detail upfront, the brain can't identify what matters. A progressive approach naturally communicates priority.

### PS Skills

Speaking of drawing, this goes back to my school days. My cousin worked in graphic design and often asked me software questions, so I got exposed to Photoshop and CorelDraw early on. With the Web 2.0 wave, building web apps meant you had to know how to slice images. Although Dreamweaver and its siblings existed, I preferred Photoshop. A decent chunk of my idle college hours went into mastering Photoshop cutouts. I wouldn't call myself a virtuoso, but I was quite comfortable -- always helping teachers and classmates with photos. One roommate went through a breakup and had a camera full of photos of his ex. He wanted to organize them and asked me to teach him Photoshop. By the end of summer break, he was proficient. Years later at a reunion, he was still grateful: "Learning that skill from you back then really pays off at work."

Writing documents mainly involves architecture diagrams and doesn't require much Photoshop. But making presentations is different. Great slides need good assets, and some assets need preprocessing -- background removal, color adjustment, and so on. Common PS techniques include:

1. Cutouts and background removal
1. Compositing -- layering and stitching multiple images
1. Color and tone adjustments
1. Resizing, cropping, rounding corners
1. Selective blur and mosaic
1. Portrait touch-ups
1. ...

There are countless PS tutorials online. The common techniques above can be learned in a week by following video tutorials. Back when I was in school, most tutorials were text-and-image only, with relatively few videos, and I still picked them up quickly.

One problem with Photoshop: it's expensive. For an occasional user, spending hundreds on a license just for a presentation isn't worth it. Fortunately, someone built a [web-based PS](https://www.photopea.com/) that's free to use (with ads). I use it regularly -- it supports all the common features and feels almost identical to Photoshop.

### Assets

Thanks to modern search engines, Google solves 80-90% of your needs. For higher-quality or royalty-free assets, here are some useful sources:

- https://fonts.google.com/icons
- https://icons.getbootstrap.com/
- https://www.svgrepo.com/
- https://www.pngrepo.com/
- https://www.uiuxrepo.com/
- https://www.iconsrepo.com/
- https://fontawesome.com/
- https://freeicons.io/
- https://icons8.com/
- https://uxwing.com/

### Color

Whether it's slide assets or document illustrations, color matching is unavoidable. Getting colors right is genuinely an art, but there are plenty of tools to help. If you can't find the right palette, look at how tech companies or communities color their graphics, then use a color picker to sample and apply. Here are the palette generators I use most:

- https://htmlcolorcodes.com/resources/best-color-palette-generators/
- https://color.adobe.com/zh/create/color-wheel

#### Background Color

It seems like ever since Steve Jobs, tech presentations default to black or dark gray backgrounds -- they look premium and mysterious. I like that aesthetic too, but dark backgrounds are very demanding on assets. Most assets look great on white but feel off on black, especially when cutouts aren't clean -- you get white edges and a plastic look. If your cutout skills aren't up to par, stick with white or light backgrounds.

#### Primary Color

Beyond the background, the primary color is the most eye-catching color in your slides. If you're unsure, just pick a suitable color from a built-in PPT or Keynote template.

#### Accent Colors

A single slide with 2-3 colors is the sweet spot -- too many or too few and nothing stands out. My recommendation:

1. Titles in the primary color
1. Subtitles or body content in the accent color
1. Annotations or explanatory text in an even lighter shade

If you really can't decide on colors and you're feeling lazy, go with the classic: black-white-gray, with varying shades of gray.

### Lines

From years of practice, I've found that smooth curves generally look more polished, while sharp straight lines and angular shapes (especially hexagons) amp up the tech feel. Here are some of my guidelines for architecture diagrams.

#### Corners

- Simple blocks: use rounded rectangles
- Blocks with internal elements (like UML component diagrams with exposed ports): use sharp corners for consistency, since ports are too small for rounding

In summary:
- Detail-level blocks: sharp corners
- Abstract-level blocks: rounded corners

#### Connectors

- Short distances: straight lines
- Long distances: curves
- Zigzag lines: I rarely use them

#### Borders

Backgrounds and borders generally don't coexist well:

- Background present: no border
- Border present: no background
- If you need both: make the background semi-transparent or low-opacity

#### Thickness and Spacing

Line thickness matters more than you'd think:

- Default to thin lines -- they feel light and elegant
- Use thick lines sparingly -- they convey weight and emphasis

For line segments or arrows that connect to other shapes, consider leaving a small gap at each end. This depends on whether your tool supports it.

### Length

For presentations, the best practice for controlling length is: more images, fewer words. Remember:

> As a presenter, the goal is not to keep the audience staring at your slides -- it's to keep their eyes on you!
> As a presenter, the goal is not to keep the audience staring at your slides -- it's to keep their eyes on you!
> As a presenter, the goal is not to keep the audience staring at your slides -- it's to keep their eyes on you!

So how do you let the audience know what's coming next while keeping their attention on you? The answer: show an image!

The human brain processes visual information at astonishing speed, but its ability to process text is comparatively glacial. Rather than having your audience read cold text line by line, let them enjoy your animated delivery.

## Professional Tools

### Presentation Tools

As a professional PPT engineer, the go-to tools are:

- Microsoft PowerPoint
- Google Slides
- Keynote

I use Keynote the most -- mainly because it comes with macOS, and native apps just feel better.

### Architecture Diagram Tools

I've used quite a few diagramming tools over the years:

- IBM Rational Rose
- Microsoft Visio
- [Enterprise Architect](http://www.sparxsystems.com/)
- [Lucidchart](https://www.lucidchart.com)
- [OmniGraffle](https://www.omnigroup.com/)
- [PlantUML](https://plantuml.com/)
- [Draw.io (Diagrams.net)](https://app.diagrams.net/)

The best experience? [Lucidchart](https://www.lucidchart.com). You get what you pay for. For my blog, I mostly use [PlantUML](https://plantuml.com/) to render diagrams rather than drawing them by hand.

## Tell a Good Story

I often joke: "Start with one diagram, then wing the rest." The "winging" is really storytelling. Only the storyteller knows what's real and what's embellished. To create a good experience for the audience, you inevitably weave in some fiction -- if everything were strictly true, it wouldn't be a story, it'd be a documentary.

I remember preparing a presentation for an external audience. I sent my slides to the VP for review, and he came back with:

> Johnson, your PPT needs an overhaul.

His assistant (a director-level) then helped me rework it. We opened with a short story to hook the audience, then used that story to naturally introduce the main topic. The entire presentation is essentially one big story, typically composed of two parts: the hook and the main theme. Each can have its own timeline and logical thread -- the key is making the hook's timeline and logic align with the main theme's, weaving them into a cohesive narrative.

I also recall when my boss was preparing a report for the CTO and asked me for materials. I happened to glance at his slides. The title was:

*The Past, Present and Future of Xxx*

That's my boss for you -- the epitome of elegant simplicity. You can tell exactly how he's going to present just from the title.
