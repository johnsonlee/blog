---
title: Booster 2020 Roadmap
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - Performance Optimization
date: 2019-12-24 23:18:42
lang: en
i18n_key: booster-roadmap-2020
---

Booster was open-sourced on April 23, 2019. In less than half a year, it had already hit 2.3k stars -- honestly, that exceeded expectations and gave me endless motivation to keep improving it. I want Booster to solve real problems for people, not just be another open-source vanity project farming stars. Unfortunately, the second half of the year kept me busy with in-vehicle business, so I could only squeeze in the occasional weekend commit, handle PRs from Zhiguo, and find time to write about the ideas and implementation details behind Booster. If I'd had more time to dedicate, we'd probably be past 3k stars by now.

I've finally had the bandwidth to think about what Booster should tackle next year. Based on the feedback and information I've gathered, while Booster's core framework is quite stable, many optimization features have edge cases where they don't quite fit. The plan is to break features into finer-grained modules that better accommodate various scenarios -- truly plug-and-play, and actually pleasant to use.

## Resources

Resource optimization delivers the most visible gains. Compared to bytecode or instruction-level optimization, resource optimization reduces package size faster and is relatively easier to implement. The plan is to split the current resource optimization into these modules:

1. *pngquant* compression for resources
1. *pngquant* compression for assets
1. *webp* compression for resources
1. *webp* compression for assets
1. Resource deduplication
1. Assets deduplication
1. Resource index inlining
1. *ButterKnife* resource index inlining

Due to *pngquant*'s license, all pngquant-related modules will use a *GPL License* separate from the *Apache License*, with *pngquant* bundled inside the *JAR*.

## Threading

Thread optimization is easy to trip over, so the plan is to separate thread renaming into its own module -- renaming alone is extremely valuable for APM sampling. This splits into two modules:

1. Thread renaming
1. Thread pool optimization

## Performance Bottleneck Detection

Static analysis is the hardest part, which is why it's last -- let's knock out the easier wins first (just in case this one proves too tough). Booster's current performance bottleneck detection is fairly rudimentary, with poor support for *Handler*, multithreading, interfaces, and other complex scenarios. The plan is to introduce *IR* (Intermediate Representation) to address these limitations.

## Functionality as a Service

Deploy performance analysis and detection capabilities server-side: upload an APK for analysis, then get a report covering:

1. Existing issues
1. Optimization opportunities with expected gains
1. ...

This feels like enough to keep us busy for a year (maybe more). If there are like-minded developers who want to contribute to the open-source community, that would be fantastic. If you're interested, drop a comment or reach out directly -- looking forward to more contributors joining the effort.
