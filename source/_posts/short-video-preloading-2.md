---
title: 短视频预加载技术（二）
categories:
  - Computer Science
  - Mobile
tags:
  - 预加载
date: 2021-03-24 07:00:00
---

 最近有朋友问道：“森哥，你在面试中是如何考察候选人的架构设计能力的？”，这个问题不太方便回答，在 [短视频预加载技术（一）](/2021/02/10/short-video-preloading-1/) 中，我们从架构设计的角度系统性的介绍了短视的预加载技术，如果非要举个例子的话，那我们不妨就以短视频预加载为例吧。

## 面试题

### 条件

1. 给定一个异步文件下载 SDK，API 如下：

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
      * 资源 URL
      */
      val url: String,

      /**
      * 需要下载的 size
      */
      val size: Long,

      /**
      * 超时时间 (ms)
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

1. 给定服务端返回的视频列表格式如下：

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

### 需求

实现一个多源（同一个图片，来自多个 *CDN* ，*URL path* 相同，但 *host* 不同）视频列表的下载功能，并满足以下条件：

- 一次最多只能下载一个视频，即：前一个视频下载完成（或者失败）之后，才能下载下一个
- 默认从第 *0* 个源开始下载，在当前源下载失败后，切换到下一个源进行重试，如果重试完所有源还是失败，则放弃当前视频，继续下载下一个视频

### 进阶

假设 API 是分页的，每页返回 *10* 个视频，实现：

- 第一轮每个视频下载 *200KB* ，每个视频的 *200KB* 都下完后，接着开始第二轮，每个再下 *200K* ，以此类推，直到所有的视频都下载完为止
- 响应 UI 的滑动操作，根据当前视频在视频列表中的索引，预加载当前视频之后的所有视频，下载策略参考上一项

以抖音 app 为例，当滑动到索引为 *1* 的视频时（假设 API 返回的数据是每页 10 条）

  - 如果当前正在下载的视频不是索引为 *2* 的视频，则取消当前正在下载的任务，然后依次下载索引为 *2, 3, 4, 5, 6, 7, 8, 9* 的视频
  - 如果当前正在下载的视频是索引为 *2* 的视频，则继续当前任务，直到当前任务完成后，依次下载索引为 *3, 4, 5, 6, 7, 8, 9* 的视频
