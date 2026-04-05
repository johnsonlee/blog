---
title: "Short Video Preloading (Part 1)"
categories:
  - Computer Science
  - Mobile
tags:
  - Preloading
date: 2021-02-10 03:00:00
lang: en
i18n_key: short-video-preloading-1
---

In an era where user experience is king, "Video View" count is one of the most important metrics for measuring experience quality in a short video app. From the user's perspective, smoother playback, higher video quality, and more precise recommendations all lead to a higher "Average Played Time." To improve the user experience, the industry pulls out every technical trick in the book. In the video industry, achieving instant playback is considered the bare minimum, and video preloading is one of the most critical techniques for getting there.

## Quality Metrics

Generally, we measure app quality from two dimensions -- Quality of Experience (QoE) and Quality of Service (QoS).

### Quality of Experience (QoE)

QoE approaches quality from the end user's perspective, measuring satisfaction based on subjective perception. Many factors influence user experience, mainly human factors, system factors, and environmental factors. As such, QoE spans emerging multidisciplinary fields including social psychology, cognitive science, economics, and engineering. For short video apps, key QoE metrics include:

- Video View
- Average Played Time
- Play Complete Ratio
- Comment Rate
- Average Stay Duration In Comment
- Like Rate
- Favorite Rate
- Forward Rate
- Follow Rate
- Negative Feedback Rate
- ...

### Quality of Service (QoS)

Compared to QoE, QoS takes a more objective approach, using various parameters to measure overall service performance. For short video apps, key QoS metrics include:

- Transport Latency
- Encode Latency
- Decode Latency
- Time to First Frame
- Frame Per Second
- Sec-Opening Rate
- Cache Hit Ratio
- ...

## Preloading

Which metrics does preloading primarily improve? Before answering that, let's understand the two forms of preloading:

1. Pre-download -- downloading video resources from CDN to local storage in advance
1. Pre-decode -- having the player decode the locally cached video file in advance

Pre-downloading is straightforward -- just download from CDN. But for a feed-style short video app, users watch while swiping up and down. This seemingly simple interaction involves complex flows that require tight coordination between pre-downloading and pre-decoding. For pre-downloading, several questions need to be answered:

1. When to download?
1. How much to download?
1. Which CDN to download from?
1. Which bitrate to download?
1. What's the download task scheduling strategy?
1. What's the retry strategy for failed downloads?
1. How to handle data pagination?
1. How to hand off to the player for pre-decoding once downloaded?

### When to Download

For a full-screen swipe-style short video app like TikTok, except for the first install, the first video is typically already downloaded and has its first frame buffered before the user even enters the playlist page. Starting from the second video, real-time preloading kicks in. For swipe-based apps, the download timing is: when a video is selected as the currently playing video, start downloading the next video in the list (or the previous one, depending on which direction the user swipes).

### How Much to Download

Generally, download volume is measured in two units:

1. By bytes
1. By seconds

The implementation differs slightly for each. Downloading by bytes is simpler -- no additional calculation needed. Downloading by seconds is more involved, as it requires calculation based on bitrate, which comes in two types:

1. Constant bitrate
1. Variable bitrate

For constant bitrate, the calculation only needs to be done once. For variable bitrate, real-time calculation based on the video's metadata is needed, making the implementation more complex than downloading by bytes.

### Choosing a CDN

Typically, the same video resource exists on multiple CDNs (poorly built systems aside). This is commonly called multi-source video -- the same video has multiple sources. From the client's perspective, it may only know the video resource ID (or path) and a list of CDN hosts. Before downloading, it needs to combine the CDN host list with the video resource ID. Since there's usually only one video ID, the number of combinations is simply the size of the CDN host list.

CDN hosts come in two forms:

1. CDN host is an IP address
1. CDN host is a domain name

When the CDN host is an IP address, the client can construct the URL and hand it directly to the download module. For domain names, the client needs to perform DNS resolution to get the IP address first, then construct the URL.

### Choosing a Bitrate

Similar to multi-source video, the same video can exist at multiple bitrates -- known as multi-bitrate video. Why multiple bitrates? Different video content has different temporal and spatial complexity, and client-side device performance varies widely. To maximize user experience, the system needs to adapt based on network conditions, video content, and device capabilities. The industry calls this Adaptive Bitrate Streaming, and its implementation is significantly more complex than multi-source video.

Each multi-bitrate video resource has a *manifest* describing its information across multiple dimensions:

1. Bandwidth
1. Resolution
1. Frame rate
1. CDN list
1. ...

Assuming *M* resolutions and *N* CDNs, these two dimensions alone produce *C(M, N)* download URLs. With more dimensions, the combinations multiply further.

### Download Task Scheduling

For a standalone download module, there are generally two scheduling modes:

1. Parallel -- downloading multiple resources simultaneously
1. Serial -- downloading one resource at a time

Each mode suits different scenarios. For swipe-based short video apps, serial downloading is typically used.

### Download Failure Retry

Downloading video resources is inherently simple. But introducing a retry mechanism makes the entire download flow significantly more complex, especially for multi-source and multi-bitrate videos. The key challenges include:

1. Downloads are serial and asynchronous; retries are only triggered after failure
1. For multi-source and multi-bitrate videos, the retry needs to determine which URL to use
1. Each download corresponds to a download task; should all URL combinations be prepared upfront or created on-the-fly during retry?
1. If all combinations have been exhausted without success, the system needs to move on to the next video

### Data Pagination

Let's first define the concept of a data page -- a list of video information, where each page contains multiple videos and each video is an item in the list, indexed from 0.

For the client, the feed requires pagination. The timing of loading the next page is crucial for preloading hit rate. Suppose a page contains 10 videos. If the next page is only loaded when the user reaches video index 9, and the user only glances at that video before swiping to the next one, the next video most likely hasn't finished preloading. This creates a noticeable pattern -- a stutter every 9 videos, which is a terrible experience. To solve this, the next page needs to be loaded ahead of time, typically 3 items early (i.e., load the next page when the user reaches video index 6).

### Coordinating with Pre-Decoding

Once a pre-download task completes, the video data is cached locally. How does the player load the locally cached video file? Typically, a cache ID is generated for each video. Unlike the resource ID used for CDN downloads, the cache ID is for local caching. The cache ID can be computed in advance when generating the data model. When the player starts playing a video, it retrieves the cache ID from the data model and looks it up in the cache.

## Summary

This article provided a high-level overview of preloading technology from the client's perspective. Through preloading, we can improve the following QoS metrics:

- Time to First Frame
- Frame Per Second
- Sec-Opening Rate
- Cache Hit Ratio

However, this is just the beginning. In practice, various strategies are applied to deeply optimize these metrics. The strategy layer will be covered in detail in subsequent posts.
