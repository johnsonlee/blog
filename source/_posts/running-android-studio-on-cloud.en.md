---
title: Android Studio in the Cloud
categories:
  - Computer Science
  - Mobile
  - Android
tags:
  - Android
date: 2020-11-20 20:00:00
lang: en
i18n_key: running-android-studio-on-cloud
---

Seven years ago, when cloud computing was just getting started and *Docker* hadn't yet taken off, a group of us at *SAMSUNG* were already tinkering with *Cloud IDE*. The best product in the industry at the time was [Cloud 9](https://aws.amazon.com/cn/cloud9/). We referenced [Cloud 9](https://aws.amazon.com/cn/cloud9/)'s architecture and adopted some of its open-source components, while building the plugin system and several UI views from scratch.

## Cloud IDE

Back then, virtually every *Cloud IDE* solution used web technologies to build a frontend-backend separated architecture. Besides [Cloud 9](https://aws.amazon.com/cn/cloud9/), there was *Eclipse*'s [Che](https://www.eclipse.org/che/). Today everyone takes *Cloud IDE* for granted, but at the time it was quite challenging for us. Later, for reasons unknown, [Cloud 9](https://aws.amazon.com/cn/cloud9/) was acquired by AWS, and *Eclipse*'s [Che](https://www.eclipse.org/che/) became a dedicated IDE for [Kubernetes](https://kubernetes.io/zh/).

### Virtualization

Why was virtualization needed? Because each user's development environment had to be physically isolated. Since it's an IDE, it needs to provide a build environment, so different users must be completely isolated from each other. Today this is trivially solved with *Docker*, but back then *Docker* wasn't available in China yet. Fortunately, *Linux* itself provided a lightweight virtualization technology -- *Linux Container (LXC)*. So we built [root filesystems](https://github.com/johnsonlee/rootfs) based on *LXC* to use as virtual machine images.

### Editor

An IDE needs an editor. Fortunately, [Cloud 9](https://aws.amazon.com/cn/cloud9/) open-sourced a high-performance code editor called [ACE Editor](https://ace.c9.io/). That solved the infrastructure problem, but supporting various programming languages on top of this primitive editor still required a *Parser*, and the editor experience depended heavily on the local machine's computing power.

### UI Framework

The frontend UI was built using another open-source framework from *Cloud 9* -- APF, which used an *XML*-like template language somewhat similar to *Vue*. The *Cloud 9* team gave it a grand name -- *Live Markup Language*. This was arguably one of the earliest frontend *MVVM* frameworks. Unfortunately, the source code can no longer be found on the official website. Back then, [Cloud 9](https://aws.amazon.com/cn/cloud9/) contributed it to *ajaxorg*. We once thought it would become a frontend standard, but it didn't end that way.

During our technology selection, we researched many UI frameworks. We even evaluated *Dart*, which was considered a niche language at the time -- who would have guessed it'd be put to use years later by *Flutter*.

### Plugin System

To make the *IDE* extensible, the entire *Cloud IDE* architecture adopted a pluggable approach where the frontend loaded different modules from the backend on demand based on configuration. In an era before *Promise* was standardized, implementing *Fork-Join* in *JavaScript* was no easy task. Although *require.js* existed, it only solved part of the problem.

### Web Terminal

Among all the *IDE* views, *Terminal* was the most challenging and the most interesting. To test *Terminal* performance, we'd run the *cmatrix* command to produce the falling-text effect from The Matrix. For reliability and stability testing, we'd open *VIM* inside the *Terminal* and code while testing. You can see the [first version of the Web Terminal](https://github.com/johnsonlee/web-terminal) I wrote back then. The first version used a matrix canvas approach for rendering text, which turned out to be extremely sluggish when running *cmatrix*. In later versions, we switched to line-by-line rendering, where each line corresponds to a *DIV* in *HTML*. It didn't seem efficient in theory, but in practice it performed much better than the matrix approach.

### File Management

Managing files is a basic feature for any editor. After researching our options, we chose [jsDAV](https://github.com/mikedeboer/jsDAV) and even fixed a bug along the way -- [8bf6ad3](https://github.com/mikedeboer/jsDAV/commit/8bf6ad32eb974dc76094e9d77d4aab2a27141a45). But there was another issue: all files were created by the *IDE*'s *server* process, which meant they defaulted to the *server* user's ownership. When developers logged into the *Terminal* with their *Linux* system accounts, they couldn't modify files they'd created through the IDE if the file ownership wasn't changed. To solve this, we built a separate *daemon* process that used *inotify* to watch filesystem changes in the project directory and *chown* IDE-created files to the developer's system user.

## Android Studio / IntelliJ IDE

For *Cloud IDE*, our instinct was that the editor should be built with *JavaScript* and all UI should use *Web* technologies. However, *JetBrains*' [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) project made me re-examine our earlier technology choices. In fact, [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) isn't really new technology. Before working on *Cloud IDE*, I'd already used a similar technique -- the IDE's visual designer. Why do I say the IDE's visual designer and [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) share the same approach?

### WYSIWYG

For a visual designer, one thing must be guaranteed: what you see during development must look exactly the same as what you see in production. This is what we call WYSIWYG (What You See Is What You Get). To ensure this, the visual designer's rendering engine must be the same one used at runtime -- something only people who've built visual designers truly appreciate.

Take *Android*'s visual designer as an example. You can write code on the left and preview the result on the right. How does this actually work? *Android Studio* loads the *Android View* system code on the PC side, then hooks the `Canvas` through a `ClassLoader`. The graphics that would normally be drawn to the `framebuf` are intercepted by the *Layout Library* and drawn onto an `Image` instead. This `Image` is then composited onto the *IDE*, achieving WYSIWYG. For the specific code, refer to [Layout Library](http://localhost:5000/2019/07/13/booster-xml-layout-to-code/#Layout-Library) mentioned in a previous article.

Back when I was building the IDE's visual designer at Kortek, we used exactly this approach. The *IDE* sends the *layout* to the rendering engine, which generates an image and returns the boundaries of each *Widget* in the *layout* back to the *IDE*. What you see in the visual designer is really just a background image. When you select a *Widget*, it displays the selected *Widget*'s boundary -- just an empty rectangle. Visually it looks like you're dragging a real *Widget*, but you're not.

[Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) uses exactly this approach. It provides a custom implementation of `java.awt`, which is the cornerstone that makes the whole solution possible. The entire *View System* is taken over by this new *AWT* implementation, allowing a headless *IDE* to run on the server. The new *AWT* serializes graphics drawing operations as commands, sends them over the network to the client, and the client replays these drawing commands to achieve visual consistency.

### Use Cases

With [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md), running an *IDE* on mobile devices is no longer limited by client-side technology. For someone like me who hates carrying a laptop, an iPad is enough. Rent an *AWS* instance, attach an *EBS* volume, destroy the instance when you don't need it, and spin up a new one with the same *EBS* when you do.

This is especially useful for *Android* developers whose builds are painfully slow and whose machines keep freezing. You could just move to cloud-based development. The company's internal development machines are sitting idle anyway. Don't tell me you're still using `rsync` to sync local code to a remote machine for compilation -- wouldn't it be better to develop directly in the cloud?

## Quick Start

If you're interested, you can download the *Docker* configuration from [johnsonlee/ascloud](https://github.com/johnsonlee/ascloud) and try it out.
