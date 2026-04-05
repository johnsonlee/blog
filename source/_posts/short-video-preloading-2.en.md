---
title: "Short Video Preloading (Part 2)"
categories:
  - Computer Science
  - Mobile
tags:
  - Preloading
date: 2021-03-24 07:00:00
lang: en
i18n_key: short-video-preloading-2
---

A friend recently asked me: "How do you evaluate a candidate's architecture design skills during interviews?" That's not an easy question to answer directly. In [Short Video Preloading (Part 1)](/2021/02/10/short-video-preloading-1/), we systematically introduced short video preloading from an architecture design perspective. If I had to give an example, short video preloading would be a good one.

## Interview Question

### Given Conditions

1. An asynchronous file download SDK with the following API:

  ```kotlin
  enum class DownloadStatus {
      COMPLETE,
      IN_PROGRESS,
      ERROR,
  }

  interface DownloadCallback {
      fun onProgressChange(task: DownloadTask, status: DownloadStatus) = Unit
  }

  data class DownloadTask(
      /**
      * Resource URL
      */
      val url: String,

      /**
      * Size to download
      */
      val size: Long,

      /**
      * Timeout in milliseconds
      */
      val timeout: Long
  )

  fun download(task: DownloadTask, callback: DownloadCallback)  {
      // ...
  }

  fun cancel(task: DownloadTask) {
      // ...
  }
  ```

1. The video list returned by the server has the following format:

  ```json
  {
    data: [{
        id: "12345",
        path: "12345.mp4",
        cdns: ["1.2.3.4", "2.3.4,5", ...],
        ......
    },{
        id: "23456",
        path: "23456.mp4",
        cdns ["1.2.3.4", "2.3.4,5", ...],
        ......
    }]
  }
  ```

### Requirements

Implement a multi-source (same video available from multiple CDNs -- same URL path but different hosts) video list download feature that satisfies the following conditions:

- Only one video can be downloaded at a time: the next video can only start downloading after the previous one completes (or fails)
- Download starts from CDN source #0 by default. If the current source fails, switch to the next source and retry. If all sources have been exhausted and it still fails, skip the current video and move on to the next one

### Advanced

Assuming the API is paginated, returning 10 videos per page, implement the following:

- In the first round, download 200KB of each video. After all videos have their first 200KB downloaded, start the second round and download another 200KB for each, and so on, until all videos are fully downloaded
- Respond to UI scroll events. Based on the current video's index in the list, preload all videos after the current one using the download strategy described above

Taking the TikTok app as an example, when the user scrolls to the video at index 1 (assuming the API returns 10 items per page):

  - If the video currently being downloaded is NOT the one at index 2, cancel the current download task and then download videos at indices 2, 3, 4, 5, 6, 7, 8, 9 in order
  - If the video currently being downloaded IS the one at index 2, continue the current task. Once it completes, download videos at indices 3, 4, 5, 6, 7, 8, 9 in order
