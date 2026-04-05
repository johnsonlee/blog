---
title: My Years at DiDi
category: Working as an Architect at DiDi
tags:
  - Career
categories:
  - Career
date: 2019-12-19 00:00:00
lang: en
i18n_key: working-at-didi
---

Of all the stops in my career so far, my time at DiDi was the longest -- over four years. In the end, I still chose to leave. Looking back, it all feels like yesterday. Though I left decisively, the memories remain vivid. Some nostalgia is inevitable, but no regrets. Working with a group of solid, reliable people was one of the great fortunes of my career.

Over those four years, I kept "embracing change" -- from the Shared Platform to Platform Technology, then to Ride-Hailing, and finally to In-Vehicle systems. Most of those moves were changes that embraced me, not the other way around. My office migrated too: from Deshi Building, to Digital Valley, to Winsoft, to Wanliu Building, to Neusoft, to Xinchenghai, and finally back to Wanliu. I'd been to pretty much every office in the area except Diamond Building.

## The Interview

I still remember the interview starting at the Deshi Building. It went smoothly. After two rounds, it was already afternoon. The final round was at Digital Valley. The interviewer said, "Let's do an elementary school problem. An oil seller has a full bucket of 8 kilograms. A customer wants to buy 4 kilograms, but the seller only has an empty 3-kilogram bucket and an empty 5-kilogram bucket -- no other tools. How do you measure out exactly 4 kilograms?" He handed me some scratch paper. I recalled a similar puzzle from a book I'd read as a kid -- *The Wonders of Mathematics*. After some scribbling, I worked it out and passed. The last round was with HR. By the time we finished, it was 8 PM. What impressed me most was HR's efficiency -- I decided to join DiDi right then and there.

## The One

On my first day on the Shared Platform, Da-zuo told us: "We're working on a killer project -- The One. With simple configuration, it can generate a ride-hailing client app." I later learned the project had been underway for 3 months before I joined and was still stuck. The very week I started, the project goals were adjusted back to basics -- solving multi-business-line collaborative release. Leadership had apparently realized the original technical approach was too idealistic to land. So that very first weekend, everyone started crunching. About a month later, through collective effort, the first version of The One was officially delivered.

## One Net

One Net is one of my proudest creations. I've been told that many client engineers at DiDi have studied its code. One Net was born out of the need for seamless API request fallback on the client side. For example, when an API service failure was detected, network requests would automatically switch from HTTP to a TCP-based socket protocol. We had developed a custom `dchat` protocol, but the SDK implementation was a mess. After a week of integration debugging, we gave up. For a long time, One Net only had an HTTP implementation. It wasn't until a dedicated network optimization initiative that we implemented HTTP-to-socket failover. By then, One Net had already unified all client-side networking across the company. I recall a small episode during One Net's design phase: I designed One Net, and another team had designed their own networking library. We went head-to-head, and my design (interface-description + dynamic proxy, similar to `Retrofit`) won. Fun fact: when One Net was born, `Retrofit` hadn't even become popular yet.

## Swarm

After The One's refactoring, the passenger app was completely revamped. But new problems emerged -- tight coupling between core components and the client made integration costs too high. For example, the A/B Test component fetched AppId, user info, and location from the client, and listened for login/logout events. To reduce the integration cost, I built a minimal implementation of [OSGi](https://www.osgi.org) called Swarm. Later, when the Shared Platform and Express teams merged and I moved to the Minibus business, Swarm was shelved.

## Minibus

From my years at DiDi, besides gaining some extra weight, the most lasting souvenir was the surgical scar from being hospitalized due to overwork during the Minibus project (just a minor procedure, though). Everyone was pushing hard during that period. Da-zuo lost his voice repeatedly and was hospitalized. Several teammates on the Minibus side were on the verge of collapse from the overtime. Fortunately, we all persevered, and Minibus finally launched. After a few iterations, I returned to the original Shared Platform -- only to find it no longer existed. It had merged with the Express team to become Platform Technology.

## Architecture Team

After the reorg, I became a member of the Architecture team. Gang-ye said, "Let's build a plugin framework together." Since Swarm had never been realized, I figured why not. So Gang-ye, Tao-ge, and I built [VirtualAPK](https://github.com/didi/VirtualAPK) in a month. As the company's first-ever open source project, it earned Gang-ye plenty of recognition and clout -- he got an S rating that year (that's 8-10 months of bonus). Later, for reasons I'm not entirely sure of, Hai-ge left, and the Architecture team disbanded. Da-shi-xiong went to `R Lab`, Gou-shen went to `Mobile AI` (not artificial intelligence -- it's Android & iOS, haha, just kidding), and I went to the Driver side.

## Internationalization Platform

I went to the Driver side with a mission: bring the driver app experience up to par with the passenger app. For years, the driver app had been overlooked. Everyone's focus was on the passenger side. Drivers didn't earn many "little oranges" either. It wasn't until the driver supply problem became acute that drivers became a focus -- hence *Driver App v5.0*, benchmarked against *Passenger App v5.0*. Then the ride-hailing business went overseas. Brazil was the first stop, followed by Latin America, Asia-Pacific, Australia and New Zealand, and more. The challenges mounted: with international operations sprouting everywhere, how could we quickly spin up a new app? That's how the international driver app platform was born, supporting all international business lines on the driver side. I'd say I turned in a satisfying result.

## Open Source

After the driver platform landed, [Booster](https://github.com/didi/booster) was performing exceptionally well. With the company encouraging open source and Wen-song personally championing it, I submitted the open source application for [Booster](https://github.com/didi/booster). Before open-sourcing, we rewrote all the *Java 8* code in *Kotlin*. That was the moment I fell in love with *Kotlin* -- it was an absolute joy. *Google* was also heavily promoting *Kotlin* at the time. Riding the *Kotlin* wave, [Booster](https://github.com/didi/booster) appeared on the *GitHub Trending* list multiple times, bringing in a lot of stars. Looking back at how [Booster](https://github.com/didi/booster) crossed 1k stars in just a few months, I realized *Kotlin* was a huge factor. Language choice matters for open source projects -- use whatever language is trending. For instance, Flutter was hot recently, and anything related to Flutter attracted significant traffic.

## In-Vehicle

My connection to in-vehicle systems started with moonlighting for their team the year before. After the Hitch safety incident, in-vehicle systems came into the spotlight. But the team was more oriented toward low-level and hardware work, lacking experience in online monitoring and data analytics. So two colleagues and I were pulled in to moonlight for them -- building system monitoring. Year-end brought another reorg, and my department merged into Ride-Hailing. The in-vehicle team extended an offer for an internal transfer, so I joined them the following year. It was a time of staffing gaps. Nobody was handling data visualization, and since I had server-side experience, I dove in with *Kotlin* + *Spring Boot*. The *visualization dashboard* became a highlight. Then came front-end work, where I picked up *TypeScript* along the way. I also tinkered with Node.js + Eureka and discovered that microservice architecture wasn't all that intimidating after all.

## Closing Thoughts

After four years of forging, I feel I've grown considerably. I worked hard and fought alongside a group of great people here -- no regrets. Time flies. Looking at my badge photo from when I joined, the young man chasing the wind has clearly turned into a middle-aged uncle...
