---
title: "AI's Next Wave: On-Device Intelligence"
date: 2026-06-20 16:55:10
lang: en
i18n_key: on-device-ai-next-wave
categories:
  - Independent Thinking
tags:
  - AI
  - On-device AI
  - AI PC
  - Apple
  - Agent
---

At the end of May, Windows, NVIDIA, and Arm almost simultaneously posted the same line: "A new era of PC." I have already unpacked that phrase in two articles. [The Wintel Era Is Over][wintel] explains why the PC is becoming a compute asset again. [When AI PCs Become the Next Boom, Where Is the Real Opportunity?][ai-pc-opportunity] looks at local runtimes, context layers, and cost-aware execution.

Those articles focused on how a PC could absorb intelligence moving down from the cloud. A little over a week later, Apple unveiled the next generation of Siri AI at WWDC 2026, emphasizing personal context understanding, on-screen awareness, app actions, and actions across apps. It also extended the same conversation across iPhone, iPad, Mac, Apple Watch, and Vision Pro.

<!-- more -->

One side appeared to be talking about PCs, the other about Siri. Put together, they point to the same migration: AI is growing from a brain in the cloud into a nervous system distributed across personal devices.

This article takes the argument one step further. The PC matters, but the board for on-device intelligence is much larger than the PC.

## The Edge Is a Computing Network First

Treating the edge as another word for mobile leaves out half the picture. Treating it as another word for local models leaves out the other half.

The edge includes every nearby device that can sense, compute, or act. A phone sees your current location, screen, messages, and camera. A watch knows whether you are wearing it, whether you are moving, and whether you just confirmed your identity. Earbuds sit next to your voice and surroundings. A PC holds files, code, browser sessions, enterprise accounts, and long-lived working state. Cars, glasses, and home devices understand the physical environment around you.

These devices possess different context and suit different tasks. Copying the same small model onto every machine has limited value. The interesting part begins when they coordinate around the same person.

**The unit of on-device intelligence will ultimately shift from the device to the person.**

The cloud will continue to handle world knowledge and compute-intensive reasoning. The edge handles the scene: what you are looking at, what just happened, which device is currently trusted, and what action can be taken immediately. "Edge" describes a boundary for data and permission. Offline execution is only one possible result.

## The PC Is the Heavy Node in This Network

The previous two articles already covered why the PC has returned to the table: frequent agent use amplifies cloud costs, making local compute an asset again. I will not repeat that calculation here. The PC also has another, more important role.

It is the best place for a personal agent to work for long periods.

A phone is good at capturing intent. It is always nearby and can see notifications, location, photos, and immediate conversations. Complex work, however, accumulates on the PC: dozens of files, a complete repository, email history, design files, financial spreadsheets, terminals, enterprise systems, and authenticated browser sessions. The PC also has stable power, more memory, and better cooling, making it suitable for tasks that run for tens of minutes or even hours.

Imagine this: on the subway, you receive a contract from a client and tell your phone, "Compare this with the previous version, find every clause that conflicts with what we agreed over email, draft a reply, and have it ready before I reach the office."

The phone captures the current email and your intent. The Watch confirms your identity. The Mac at the office reads the project directory and email index. A local model filters sensitive information first, and difficult clauses go to a cloud model. The result returns to the phone.

No single device completed the task by itself. The agent lived in the handoff between them.

**The phone keeps the agent with you. The PC puts it to work.**

This is the deeper meaning of "A new era of PC." The PC is gaining more than a new compute workload. It is beginning to carry heavy computation, long-running tasks, and private working state inside a personal intelligence network.

## Apple Is Building the Control Plane for Personal Intelligence

Seeing WWDC 2026 as the moment Siri finally became more like ChatGPT misses the actual product. Siri is the visible interface. The system layer connecting devices, data, identity, models, and apps is the core.

Apple announced that Siri AI would be deeply integrated across iPhone, iPad, Mac, Apple Watch, and Vision Pro, with conversation history privately synchronized through iCloud. A user can begin on a Mac and continue on an iPhone, iPad, Watch, or Vision Pro.[Apple][apple-siri-sync] That is only the easiest layer to demonstrate.

The hard part is preserving a task across devices: where the intent entered, which context remains valid, which device has the right execution conditions, which action needs confirmation again, when to use the cloud, and which app should complete the final step.

This system looks more like a control plane for personal intelligence. It schedules more than models. It schedules devices, permissions, identity, and actions.

**Models determine how smart an answer is. The control plane determines whether AI can actually work on your behalf.**

That is also Apple's advantage. It controls the chips, operating systems, account system, security hardware, app permissions, and an entire family of personal devices. Apple may not lead when models are evaluated in isolation. When the job is organizing one person's devices into a continuous system, it starts from a position that is difficult to copy.

## Personal Context Is a Real-Time State

"Personal context" is easy to imagine as a larger user database: embed every email, photo, calendar event, and chat record, then retrieve them when the agent needs something.

That is not enough.

Data tells AI what you did in the past. Real-time state tells it what you are doing now: which file is open on screen, whether your earbuds are being worn, whether the Mac is unlocked, whether one of your trusted devices is nearby, which notification just arrived, and whether a payment was confirmed.

This information changes quickly, expires quickly, and is tightly coupled to permission. Screen state from ten minutes ago may already be invalid. A file readable on an unlocked Mac should not automatically be uploaded because of one voice command from a phone. A confirmation on the Watch should not authorize every later action indefinitely.

Data tells AI who you are. Edge state tells it what you want at this moment.

This is the opening for operating system vendors. A chatbot can only see what the user actively gives it. An OS stands where context is created. The gap between personal agents may eventually depend less on how much they remember and more on whether they can determine which information is still valid and which permissions are still active.

## Apps Will Be Decomposed into Callable Capabilities

Apple's signal to developers is just as clear. App Intents schemas can add app entities to Spotlight's semantic index and expose actions to Siri. View Annotations allow the system to understand the object currently visible on screen.

In the past, an app was a destination. The user found an icon, opened the home screen, moved through several pages, and eventually completed an action.

Once the agent owns the entry point, apps begin to look like capability providers. The user says, "Record this receipt," "Turn the contract risks into project tasks," or "Notify me when registration opens on this page." The system chooses the right app and chains multiple actions together. The entire workflow may finish without opening a single interface.

I call this layer the Intent Store. It may never become a literal store, but it will create a new distribution model:

**The App Store decides whether software enters the device. The Intent Store decides whether it enters the task.**

This matters especially on the PC. IDEs, office suites, design tools, database clients, and enterprise applications contain deep capabilities that have historically been hidden behind menus, commands, and complicated interfaces. Once agents can understand and combine them, PC software will compete on more than what its interface contains. It will also compete on what the system can call.

Software an agent cannot understand can still be opened by a person. It will simply lose its place in automated workflows over time.

## The Giants Are Fighting for the Same Entry Point

Microsoft and NVIDIA are approaching from the PC. They emphasize local agents, unified memory, and continuously running workloads. NVIDIA even describes agents as the future of personal computing.

Apple is approaching from personal context. It is putting Siri on every screen, connecting App Intents to system actions, and combining on-device models with Private Cloud Compute for workloads of different intensity.

The starting points differ, but the destination is converging: a personal AI fabric organized around the user.

Inside that fabric, the PC is the heaviest compute node. The phone is the densest sensing node. The Watch and earbuds provide identity and immediate interaction. Cloud models supply external knowledge and difficult reasoning. The operating system turns them into one completed task.

The next competition therefore cannot be measured only by model capability. Model vendors provide intelligence. Operating systems decide when that intelligence enters a user's life, with what context, and through which device.

The PC is the heaviest piece. On-device intelligence is the whole board.

## The Real Barrier Is the Handoff

Cross-device interaction sounds natural. In practice, it is harder than crossing apps.

iOSWorld tests phone agents using 26 apps and one persistent user identity. The best setup reaches only 52 percent overall and 37 percent on multi-app tasks.[iOSWorld][iosworld] Even on one phone, in a controlled environment, with privileged interfaces, agents still frequently lose their way. Expanding the task to several devices adds network failures, sleep states, expired context, permission elevation, state conflicts, and recovery from partial failure.

Synchronizing a conversation does not mean a piece of work can continue.

A useful personal agent must remember how far the task has progressed, recognize which state has expired, resume after switching devices, and let the user inspect what it has read, what it has done, and what it plans to do. It must support undo, stop before crossing a permission boundary, and avoid silently choosing a more dangerous path when one device goes offline.

The easiest demo is "continue the conversation over there." The real barrier is "continue the work over there"—without getting it wrong.

This is also the biggest test for Apple's approach. A closed ecosystem gives it the ability to connect devices, but it also means one unreliable component can damage the entire experience. If an agent selects the wrong file twice, sends duplicate messages, or forgets an action the user explicitly rejected, the personal intelligence network immediately collapses into a more annoying notification system.

## The Cloud Has a Brain. The Edge Is Growing a Body

Look again at "A new era of PC" and WWDC 2026. They are two parts of the same story.

The first asks where AI's heavy workloads will run. The second asks what gives AI the right to understand and represent a person. The answers are converging in the same place: devices owned by the user.

Cloud models will keep getting larger and will continue to handle the hardest reasoning. But a brain in a data center does not have your screen, files, sensors, identity, or execution permissions. It can answer questions about the world while still struggling to enter daily life.

On-device intelligence gives AI a body. The phone senses. The PC works. The Watch confirms. Apps act. The cloud supplies a stronger brain when necessary. The agent passes through them while keeping the same goal.

**The next AI platform is a set of devices finally beginning to coordinate around the same person.**

When a task can begin on your wrist, finish on your PC, and return to your phone for delivery, will we still describe on-device intelligence as a model running inside a phone?

[wintel]: https://johnsonlee.io/2026/05/31/a-new-era-of-pc/
[ai-pc-opportunity]: https://johnsonlee.io/2026/05/31/ai-pc-real-opportunity/
[apple-siri]: https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/
[apple-siri-sync]: https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/
[apple-intents]: https://developer.apple.com/wwdc26/guides/apple-intelligence/
[windows-rtx-spark]: https://blogs.windows.com/windowsexperience/2026/05/31/introducing-a-powerful-new-chapter-for-windows-pcs-accelerated-by-nvidia-rtx-spark/
[iosworld]: https://arxiv.org/abs/2606.09764
