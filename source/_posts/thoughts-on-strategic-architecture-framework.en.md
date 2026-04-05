---
title: Thoughts on a Strategic Architecture Framework
lang: en
i18n_key: thoughts-on-strategic-architecture-framework
categories:
  - Independent Thinking
date: 2023-05-13 20:00:00
---

In the process of architecture design, we frequently invoke the concept of "standardization." Standardization sets best practices and creates unified standards to ensure consistent performance across all business areas. But once standardization is achieved, what comes next? Is there a universal framework that can guide architects and tech leads to further optimize and evolve? After some thinking, a three-stage progression model crystallized in my mind: from **Normalization** to **Standardization** to **Platformization**.

## Normalization

Normalization is the process of systematically organizing a company's processes, operations, and rules to ensure consistency and transparency. In software architecture, normalization typically includes defining and enforcing design principles, coding conventions, review processes, and testing methodologies. The goal is to improve efficiency, quality, and maintainability, reduce risk, and facilitate collaboration and communication across teams.

Normalization serves multiple aspects of corporate strategy. By establishing and following norms, a company can reduce errors and omissions, improving product quality. Normalization improves efficiency because employees can operate according to known rules and processes instead of reinventing the wheel each time. It also enhances predictability, as processes and outcomes become more foreseeable. Finally, normalization helps cultivate a shared, unified company culture -- critical for attracting and retaining talent.

Implementing normalization starts with top-level design. First, define the objectives -- whether improving efficiency, quality, or predictability. Then define the norms: processes, operations, and rules. This likely requires cross-departmental collaboration, since every facet of the company must be considered. Next comes training and education to ensure all employees understand and accept these norms. Finally, monitor and evaluate how well the norms are being followed, and make adjustments as needed.

Challenges during implementation may include employee resistance, process complexity, and the ongoing maintenance of norms. To address these, companies need to provide adequate support and resources -- training, tools, and time. A feedback mechanism should also be established for timely problem identification and resolution.

## Standardization

Standardization is the process by which a company identifies best practices and creates unified standards to ensure consistent performance across all operations. In software architecture, standardization may cover programming language usage, code style, design patterns, database design, API design, testing methods, and more. It helps reduce complexity, improve efficiency, lower error rates, and make it easier for new employees to get up to speed.

The primary purpose of standardization is to boost productivity. If all projects follow the same standards, the entire lifecycle -- from design through implementation, testing, and maintenance -- flows more smoothly, reducing confusion and errors caused by inconsistency. Standardization also raises product quality, since all work is based on proven best practices. Additionally, it improves team collaboration, as everyone follows the same rules and processes.

The key to implementing standardization is finding best practices that fit the company and translating them into executable standards. This may require research and experimentation to discover which methods work best in your specific context. Then codify these best practices into clear standards. Finally, train employees to ensure they understand and follow them.

Challenges may include identifying best practices, getting employees to adopt new standards, and keeping standards up to date. Consider introducing dedicated roles or teams to own standardization, providing ongoing training and support, and regularly evaluating and updating standards.

## Platformization

Platformization is the process of leveraging technology to transform a company's business, services, or products into a scalable platform. This platform can attract more users and partners, achieve network effects, and capture greater market share and higher profits. In software architecture, platformization may include building internal platforms to boost development efficiency, or building external platforms to attract third-party developers and partners.

### Amazon vs Google

When discussing the importance and strategic significance of platformization, we can't skip [Stevey's Google Platforms Rant](https://johnsonlee.io/2023/04/15/steveys-google-platforms-rant/). Written in 2011 by former Google employee Steve Yegge, this blog post described Google's failure at platformization in detail and contrasted it with Amazon's success. Although the post was taken down shortly after publication, its content spread widely and has deeply influenced many companies' platform strategies.

Yegge pointed out that Google's main failure was not building its products and services into a true platform. Instead, each Google product was standalone -- no shared infrastructure, no unified APIs. This prevented Google's products from collaborating effectively and from attracting external developers.

Amazon, by contrast, successfully built its products and services into a powerful platform. Every Amazon service has a unified API that integrates seamlessly with other services. This allows Amazon's services not only to collaborate internally but also to attract a massive external developer community. This is why Amazon was able to take a leading position in the fiercely competitive e-commerce market.

Yegge's story illustrates the power of platformization. A successful platform brings greater efficiency, stronger influence, and higher profits. A failed platform can cost a company its competitive edge -- or even its survival.

For any company that wants to succeed in today's digital, networked world, platformization is no longer optional -- it's a necessity. Only through platformization can a company achieve true economies of scale, attract more users and developers, and gain a competitive advantage.

### Alibaba

Alibaba's "Middle Platform Strategy" is a textbook example of successful platformization. After years of growth, Alibaba realized that its various business lines were duplicating enormous amounts of work in development and operations -- wasting resources and reducing efficiency. To solve this, Alibaba began building various "middle platforms" -- a data middle platform, a technology middle platform, a business middle platform -- abstracting out common, repeated components into unified platform services.

The core idea: centralize shared resources and capabilities into unified platform services that all business lines can consume. Each business line can then focus on its core business without worrying about developing and operating common infrastructure. This dramatically improved efficiency while reducing complexity. The middle platform architecture has three layers: the technology middle platform at the bottom, the data middle platform in the middle, and the business middle platform at the top.

The strategy delivered significant results. By building these middle platforms, Alibaba achieved internal resource and capability sharing, improved efficiency, and reduced complexity. Unified APIs attracted internal developers and further drove innovation. The approach improved both operational efficiency and product quality, giving Alibaba a competitive edge.

The middle platform strategy also yielded additional benefits. The data middle platform enabled big data and AI-powered personalized services, enhancing user experience. The business middle platform allowed Alibaba to rapidly replicate and scale successful business models, accelerating growth.

However, in recent years Alibaba began moving toward "de-middle-platformization" -- a shift that drew widespread industry attention. This doesn't mean abandoning the middle platform concept. Rather, it reflects a deeper understanding of platformization's core principles. The idea is to push middle platform functions down into individual business lines, letting them respond more directly to customer needs and market changes. The original middle platforms still exist, but their role shifts to providing infrastructure and platform services rather than directly participating in business processing.

Alibaba's de-middle-platformization proceeded in three phases: building the middle platforms, expanding their coverage, and then pushing their functions down to business lines. This approach embodies the core principle of platformization -- being user-centric, providing flexible, efficient, and scalable services, while maintaining openness to attract more developers.

## Summary

Whether it's Alibaba's middle platform strategy or its de-middle-platformization, both embody the core principles of platformization: user-centricity, flexible and efficient scalable services, and platform openness to attract developer participation. Both strategies emphasize the key to platformization: centralizing company resources and capabilities to better meet user needs and respond to market changes.

Alibaba's de-middle-platformization also reminds us that platformization is not a static process -- it must continuously adapt to changes in market conditions and corporate strategy. Companies need to flexibly adjust the relationship between middle platforms and business lines based on their own business needs and market environment, to achieve optimal resource allocation and operational efficiency.

Throughout this process, the most important thing is to stay true to platformization's core: user-centricity, flexible and efficient scalable services, and platform openness. Only then can a company maintain its lead in fierce market competition and achieve sustained growth.
