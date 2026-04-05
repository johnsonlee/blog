---
title: The Future of Mobile Apps
lang: en
i18n_key: the-future-of-mobile-app
categories:
  - Computer Science
  - Mobile
tags:
  - Android
  - iOS
date: 2020-12-04 00:00:00
---

I recently tried developing an *Android* app using *Android Studio* in a browser. The experience was genuinely exciting -- not because the entire *IntelliJ* suite can now run in the cloud, but because this architectural model might well be the future of the entire mobile internet.

## Smartphones

When *Apple* launched the first *iPhone* in 2007, it kicked off the mobile internet era. Back then, the *iPhone* felt worlds away -- for a student like me, it was prohibitively expensive. It wasn't until 2010 that I saved up enough for my first smartphone: an *HTC Magic*. That was already ten years ago. Over those ten years, mobile technology evolved at a breathtaking pace, constantly reshaping what we thought was possible.

From pure *Native* to *Hybrid*, then *React Native* and *Weex*, then *Flutter* and *Kotlin Multi-Platform*. From *MVC* to *MVP* to *MVVM*. From *Java* to *Kotlin*. From *Objective-C* to *Swift*. From plugin frameworks to hotfix systems. From *Hard Coding* to *APT* and *KSP*, from *OOP* to *AOP*, from *XML Layout* to *DSL* to *Jetpack Compose*. The *IDE* moved from *Eclipse ADT* to *Android Studio*, the *Android Gradle Plugin* went from *1.0* to *7.0*, and app sizes ballooned from a few *MB* to hundreds of *MB*.

## Technology Convergence

In recent years, cross-platform technologies have proliferated and become a perennial hot topic in mobile development -- *React Native*, *Weex*, *Flutter*, *Kotlin Multi-Platform*, Mini Programs, and more. They all chase the same dream:

> Write once, run anywhere.

Cross-platform isn't new. So why has it become so popular now? A few factors:

### User Scale

Mobile app user bases are orders of magnitude larger than before. In the *Qt* era, *PC* was still king and annual user growth was slow. In 2010, global mobile device users numbered 1.6 billion. By 2020, there were 3.5 billion active smartphone users alone. Add other mobile devices and the number exceeds 4 billion. Over that decade, mobile device users grew at an average rate of *10%* per year.

### Software Iteration Cycles

Before the mobile internet, software release cycles were measured in months. In the mobile era, iteration happens weekly. App factories ship new versions every week. With hotfixes, clients can effectively release daily. For apps that update this frequently, human resources become a critical bottleneck.

### University Enrollment

Looking at domestic university enrollment data: in 2009, national admissions were 6.29 million; by 2019, it was 8.2 million -- barely any growth over a decade. Given the insatiable demand for app development talent, it's easy to see how scarce engineers have been. This is what drove 10%+ annual salary increases in the internet industry, with job-hoppers routinely getting 30%+ bumps.

As the saying goes, what happens in China largely reflects the global internet landscape -- after all, Chinese users make up a quarter of the world's smartphone users. Necessity is the mother of invention: the massive talent gap turned the once lukewarm cross-platform model into the darling of the mobile era. For managers, the benefits are obvious:

1. A task that used to require 3 people can be done by 1 with cross-platform tech, saving 2/3 of headcount. That's significant -- at 50K per person per month, a 10-person team costs 500K monthly, or close to 10M annually at 15 months of pay.
2. One codebase ensures consistent logic and experience across platforms. No more "this bug exists on *Android* but not *iOS*" and vice versa.
3. Smaller teams mean lower management overhead.

## The Technology Dilemma

Global smartphone shipments have been declining in recent years. When not enough new devices replace old ones, the installed base of legacy devices keeps growing. I'm still using a phone from several years ago. Meanwhile, software technology shows no signs of slowing down -- if anything, it's diversifying further. Performance optimization, once an afterthought, has become a major focus in recent years. Engineering complexity grows year over year, with projects routinely spanning over a hundred modules and dependencies. Build times have ballooned from seconds to minutes, sometimes over half an hour. To shrink package sizes, teams resort to extreme measures: resource obfuscation and compression, code shrinking and optimization pushed to absurd levels. To speed up builds, companies invest heavily in CI/CD optimization, creating a vicious cycle between complexity and build speed. Some even hack the build tools and compilers themselves.

On one hand, companies are researching plugin frameworks, dynamic loading, hotfixes, and cross-platform tech. On the other, *App Store* and *Google Play* explicitly prohibit dynamic loading and remain vague about cross-platform approaches. Native development can no longer keep up with the demand for rapid release and updates. How to ship and iterate quickly has become a critical research question for mobile apps.

Under the current model, smartphones face significant limitations in computing power, battery life, and app distribution. For users, any moderately complex app stutters on mid- to low-end devices. Opening an app might take several seconds or even half a minute -- and it's always slowest exactly when you're in a hurry. For developers, any production incident means shipping a new version. Domestic apps can push a hotfix, but *Google Play* and *App Store* don't allow that. Yet user numbers keep growing at 10% annually. How do we meet the ever-increasing demand for content, quality, and experience?

## A New Architecture

I mentioned *Cloud IDE* earlier, and you've probably guessed where I'm going. That's right -- the apps running on future mobile devices, whether phones or watches, will likely run in the cloud. The devices themselves would only need a basic input (keyboard) and output (screen) system. Just like many games today where the client only renders UI, there would be no need for powerful general-purpose computing -- a decent GPU would suffice. OS fragmentation and device compatibility headaches would vanish. When the client is reduced to a screen canvas, there probably won't be many mobile development engineering jobs left.

For users, opening an app would be like connecting to a remote virtual device. Each app provider would supply its own virtual environment. In a way, it would be a return to the browser era -- except this time, the browser is a video player.
