---
title: Upgrading an iMac with an SSD
lang: en
i18n_key: upgrade-imac-with-ssd
date: 2022-05-06 00:00:00
categories: DIY
---

A while back, my 7-year-old MacBook Pro (Late 2013) kept running out of disk space. The 256GB SSD just wasn't cutting it anymore. So I figured I'd get an M1. Checked the Apple website -- a maxed-out config came to over 30,000 RMB. Way too expensive. Back in the day, my MacBook Pro was close to top-spec and only cost 17,000. After all these years, aside from the small disk, it had no other issues. Maybe just swap the drive instead.

## DIY Battery Replacement

If it weren't for the experience of cracking open the laptop last year to replace the battery, I probably wouldn't have bothered with a drive swap either. The battery story goes back to last summer. The laptop had always been fine, sitting perfectly flat on the desk. At some point it started wobbling, but it didn't really affect usage so I ignored it. Then one evening, while working on a presentation, the trackpad stopped clicking. I don't use a mouse, so no trackpad meant no work. Looking closely, the trackpad wouldn't press near the keyboard but still worked near the edges. I flipped it over -- the bottom was bulging. Mystery solved: swollen battery.

I looked online for a local MacBook Pro battery replacement service. Couldn't find one, but I found a DIY video that made it look easy. Ordered a compatible battery pack on JD.com for 400-something RMB. Arrived the next day. Following the video, I removed the bottom cover. The battery was puffed up like a balloon -- slightly alarming. Luckily the seller included adhesive remover, so the battery came out without much fuss. Without that remover, I might have punctured it.

New battery in, bottom cover on, flipped it over -- nice and flat again. Tested the trackpad -- worked perfectly. Felt brand new. Before the swap, the battery lasted maybe 30 minutes, so I'd been running it plugged in with the lid closed like a Mac Mini. With the new battery, a full charge easily lasted 2 hours.

## DIY SSD Replacement

With that teardown experience under my belt, I thought: a new laptop costs 30,000+, but a 1TB SSD is less than 2,000 -- why not? (If every Mac user thought this way, Apple would've gone bankrupt long ago.) I started looking at SSDs online, only to discover that MacBook Pro SSDs use a different connector than standard ones. Plus, people online warned about counterfeit SSDs. And swapping the SSD means losing the OS. After some deliberation, I decided to find an SSD that came with macOS pre-installed -- saves me the hassle of installing an OS myself. I'd reinstalled Windows a million times, but never macOS, and I wasn't eager to learn. Found a suitable one on JD.com: 1TB, pre-loaded with Catalina, basically plug and play. 1,288 RMB.

Two days later, the SSD arrived. Teardown was routine by now -- remove the bottom cover, unscrew the SSD, swap in the new one, clean out some dust while I was at it, close it up, hit the power button. A nervous few seconds... the Apple logo appeared, followed shortly by the setup screen. The whole thing took about 30 minutes. After configuring the OS and checking "About This Mac" > "Storage" -- 1TB. Beautiful. No more "disk space full" warnings.

Setting up software on the fresh SSD was the next challenge. Good thing I have a [one-line setup script](https://github.com/johnsonlee/-). Run the script, everything installed. Prerequisite: a working VPN.

## DIY iMac Upgrade

My wife uses our 27-inch iMac at home. I'd never paid much attention to it, but after the MacBook Pro SSD swap I couldn't stop itching to tinker. Looking into it, I found the iMac has 4 RAM slots but only 2 were filled with 4GB sticks. So I grabbed two 8GB sticks off Taobao, popped them in, and hit the power button. A series of beeps. I yanked the power cord, opened the memory bay, pressed the new sticks firmly -- click -- they must not have been seated properly. Tried again. No more beeping. Boot was slightly slower, but after logging in, the system felt snappier. No more spinning beach ball after startup. "About This Mac" > "Memory": *24GB Installed*.

After the RAM upgrade, there was still a noticeable speed gap compared to the MacBook Pro. I thought: "Why not swap the stock 1TB mechanical hard drive for a 1TB SSD too?" My wife was skeptical at first: "Can you really do that?" But after the MacBook Pro upgrade, she kept saying "my husband is a genius." A man's confidence often comes from a woman's praise, so I set my sights on her iMac.

> Your iMac still feels a bit slow even with the extra RAM. Want me to swap in a solid-state drive? (She wouldn't know what "SSD" means.)

> How big?

> 1TB.

> How big is 1TB?

> Uh... 1TB is 1,024GB.

> Oh, and the current one?

> Also 1TB.

> Same size -- why swap? (Men and women really don't think on the same wavelength.)

> The current one is a mechanical hard drive. A solid-state drive is much faster.

> Oh, it seems fine to me. I don't feel it's slow.

> Your computer takes forever to boot, and videos aren't smooth. With an SSD, it'll be as fast as my laptop -- instant boot. (Searching for any excuse to justify the swap.)

> Really? How much does a solid-state drive cost?

> The drive is cheap. A 1TB one is just a few hundred RMB. (As long as it doesn't cost too much, she's in.)

> Oh, okay then.

So I researched iMac Late 2013 SSD upgrade videos. Turns out a standard SSD just needs an M.2 NVMe adapter -- 20 RMB on Taobao, free shipping.

Looking back, I realized I'd overpaid for the MacBook Pro SSD. For the same money I could've gotten a 1TB WD SN850 at 1,399 RMB. But since this iMac runs on a SATA bus, even the SN850 couldn't reach its full potential. So I went with a more practical option: the 1TB WD SN750SE.

Although I had plenty of MacBook Pro teardown experience, cracking open an iMac was a different beast. The screen has no screws -- it's held on with adhesive strips. According to other people's teardown notes, the adhesive strips are critical: do it wrong and you'll have gaps that look ugly. To be safe, I bought a set of original adhesive strips plus a screen-removal roller wheel off Taobao.

Before starting, I watched several teardown videos multiple times until I had the steps memorized. Then I went for it:

1. Cut the screen adhesive with the roller wheel
1. Peel off the adhesive strips and remove the screen
1. Remove the left and right speakers
1. Remove the power supply board
1. Remove the internal mechanical hard drive
1. Remove the fan
1. Remove the motherboard
1. Insert the SSD and secure it with a screw
1. Reinstall the motherboard
1. Reinstall the fan
1. Reinstall the mechanical hard drive
1. Reinstall the power supply board
1. Reinstall the left and right speakers
1. Connect the screen and test boot to make sure it works
1. Apply new adhesive strips
1. Reattach the screen

The process went fairly smoothly. After configuring the OS and running my [one-line setup script](https://github.com/johnsonlee/-) to install the usual software, I pulled down the [Booster](https://github.com/didi/booster) source code and ran a full build. On a completely clean machine, build completed in about 2 minutes. Set up IntelliJ IDEA CE, opened Booster, and wrote a few lines of code -- butter smooth. Even though the CPU (3.2 GHz Intel Core i5) is a step below my MacBook Pro, it works perfectly fine as a development machine.

Despite watching the videos multiple times, a few things didn't go perfectly:

1. Before removing the motherboard, you need to remove the hard drive first. Two screws were tricky:
    * One at the junction of the hard drive bracket and the motherboard requires a large hex driver. I'd assumed my screwdriver kit had it covered -- wrong. I dug through my entire toolbox and found a flathead that barely worked.
    * One in the center of the motherboard sits in a deep recess. My interchangeable-tip screwdriver kit's bits weren't long enough. Luckily it came with an extension shaft that just barely reached.
1. The SSD card needs a screw to hold it in place. The MacBook Pro's was built-in. The iMac doesn't include one. I scavenged a screw from an old mechanical hard drive. Not a perfect fit, but it held.
1. After reinstalling the motherboard, I forgot to tighten that annoying center screw.

I thought that was the end of it. But no -- a curveball. I was on the couch scrolling my phone when my wife came over: "The computer screen went black and won't respond to keyboard or mouse." I went to check: the screen was dark but the backlight was on. Nothing I did could wake it. Had to force-restart by holding the power button. It booted fine after that. I didn't think much of it. That evening, I turned on the computer to watch a show -- same thing. Screen wouldn't wake. Black with backlight glowing. Forced restart again. Searched Apple's support community: they said to reset NVRAM/PRAM and SMC. Followed the official steps. Crossed my fingers.

Next morning, tried to use the computer -- same issue. Couldn't wake it. The official fixes were useless. I suspected it might be a dual-boot-drive conflict, but verifying that meant another full teardown -- and each teardown wastes a set of original adhesive strips at several dozen RMB a pop. So I kept digging. Eventually I found an article suggesting a power management parameter fix. Nothing to lose at this point:

```bash
sudo pmset -a standby 0
```

Command ran successfully. No obvious change. But after two days, the screen started waking up normally. Finally, it was truly usable.

## References

### macOS Boot Disk Creation

* Disk imaging tool: [Balena Etcher](https://formulae.brew.sh/cask/balenaetcher)
* Official guide: [How to create a bootable macOS installer](https://support.apple.com/en-us/HT201372)

### Shopping List

| Item                     | Qty | Unit Price | Total |
|:-------------------------|:---:|:----------:|:-----:|
| Western Digital SN750SE  | 1   | 779        | 779   |
| M.2 NVMe Adapter        | 1   | 20         | 20    |
| Adhesive Strips + Roller | 1   | 35         | 35    |
| Hynix 8G DDR3L 1600     | 2   | 118        | 236   |
| *Total*                  | 5   |            | 1,070 |
