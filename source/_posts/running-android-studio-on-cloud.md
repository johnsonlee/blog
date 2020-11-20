---
title: Android Studio 在云端
date: 2020-11-20 20:00:00
categories: IDE
tags:
  - Android Studio
---

早在 7 年前，云计算刚刚起步，那时候 *Docker* 还没有流行起来，我们 *SAMSUNG* 一帮人就开始在捣鼓 *Cloud IDE* ，当时业界做得最好的是 [Cloud 9](https://aws.amazon.com/cn/cloud9/) ，当然，我们也参考了 [Cloud 9](https://aws.amazon.com/cn/cloud9/) 的方案，部分组件参用了 [Cloud 9](https://aws.amazon.com/cn/cloud9/) 的开源实现，而 *Cloud IDE* 的插件系统和一些 UI 视图都是从零开始搭建。

## Cloud IDE

当年，几乎所有的 *Cloud IDE* 的方案都是拿 *Web* 技术重新设计一套前后端分离的架构，除了 [Cloud 9](https://aws.amazon.com/cn/cloud9/) ，还有 *Eclipse* 的 [Che](https://www.eclipse.org/che/)，后来，不知道什么原因，[Cloud 9](https://aws.amazon.com/cn/cloud9/) 被 AWS 给收了。当时对于我们做 *Cloud IDE* 来说，还是相当有挑战的。

### 虚拟化技术

为什么需要虚拟化技术？因为要对每个用户的开发环境进行物理隔离，既然是 IDE，就需要提供编译环境，所以，不同的用户之间需要完全隔离互不影响，这在现在来说，简直不要太容易，一个 *Docker* 就能解决了，但当时国内还没有 *Docker* 呢，所幸的是 *Linux* 本身提供了轻量级的虚拟化技术 —— *Linux Container (LXC)* ，所以，我们基于 *LXC* 来制作[根文件系统](https://github.com/johnsonlee/rootfs)，用来做虚拟机镜像。

### 编辑器

既然是 *IDE* ，编辑器是基本功能，所幸 [Cloud 9](https://aws.amazon.com/cn/cloud9/)开源了一款高性能的代码编辑器 [ACE Editor](https://ace.c9.io/)，基础设施的问题解决了，但是，要在这个原始的编辑器上为支持各种语言，还需要 *Parser* 来辅助，而且编辑器的体验很大程度上依赖于本地机器的算力。

### UI 框架

前端的 UI 实现同样采用了 *Cloud 9* 开源的一款前端 *UI* 框架 -- APF，使用的是类似 *XML* 的模板语言，有点类似 *Vue* ，*Cloud 9* 团队给它起了一个牛逼的名字 —— *Live Markup Language* ，这应该算是前端 *MVVM* 的鼻祖了吧，可惜源代码目前在官网已经找不到了，当年 [Cloud 9](https://aws.amazon.com/cn/cloud9/) 把它贡献给了 *ajaxorg* ，我们一度以为它会成为前端的标准，没想到最后是这样的结局。

当时做技术方案选型，调研了很多 UI 框架，像 *Dart* 这种不入流的语言，当时也调研过，没想到这么多年后，被 *Flutter* 派上了用场。

### 插件系统

为了实现 *IDE* 的可扩展能力，整个 *Cloud IDE* 的架构采用了可插拔的方式，前端根据配置按需从后端加载不同的模块，在当时 *Promise* 还没有成为标准的年代，在 *JavaScript* 中实现 *Fork-Join* 并不是一件容易的事情，虽然有 *require.js* ，也只能解决一部分问题。

### Web Terminal

在所有的 *IDE* 视图中，*Terminal* 算是最有挑战，也是最有意思的，为了测试 *Terminal* 的性能，我们会在 *Terminal* 中运行 *cmatrix* 命令来生成黑客帝国中字幕往下落的效果，如果要测 *Terminal* 的可靠性和稳定性，通常是在 *Terminal* 中打开 *VIM* 一边撸码，一边测试，在这里，可以看到当年写的 [Web Terminal 初版](https://github.com/johnsonlee/web-terminal)，第一版在选择渲染文本的方案上，采用了矩阵画布的方式，结果发现跑 *cmatrix* 卡得不行，后来的版本中，改成了逐行渲染，每一行对应 *HTML* 中的一个 *DIV* ，看起来效率不是很高，但实测下来，性能比用矩阵来渲染表现更好。

### 文件管理

作为编辑器，管理文件也是一个基本功能，调研下来，最后选择了 [jsDAV](https://github.com/mikedeboer/jsDAV) ，顺便还修了个 bug - [8bf6ad3](https://github.com/mikedeboer/jsDAV/commit/8bf6ad32eb974dc76094e9d77d4aab2a27141a45)，但其实，这里还有另一个问题，所有文件的创建都是由 *IDE* 的 *server* 进程来创建的，默认是 *server* 的用户，但开发者登录 *Terminal* 是用的 *Linux* 系统账号，如果不修改新创建的文件的 *owner* ，在 *Terminal* 中是不能修改自己创建的文件的，所以，为了解决这个问题，单独做了一个 *daemon* 进程，通过 *inotify* 监听工程的文件系统变化，将开发者通过 *IDE* 创建的文件 *chown* 成开发者的系统用户。

## Android Studio / IntelliJ IDE

对于 *Cloud IDE* ，我们的潜意识中，编辑器就应该用 *JavaScript* 来实现，所有 UI 都应该用 *Web* 技术来实现，然而，*JetBrains* 的 [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) 项目又让我开始重新审视，我们当年的技术选型，其实，[Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) 并不是什么新的技术，在做 *Cloud IDE* 之前，其实就已经用过类似的技术 —— *IDE* 的可视化设计器，为什么说 *IDE* 的可视化设计器跟 [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) 是如出一辙呢？

### 所见即所得

对于可视化设计器来说，必须要保证的一点是，在开发阶段看到的视觉效果必须要跟生产环境的视觉效果一模一样才行，这就是常说的所见即所得，所以，为了保证这一点，可视化设计器的渲染引擎必须跟运行时的渲染引擎是同一个，这个东西估计只有做过可视化设计器的同学才有感觉。

就拿 *Android* 提供的可视化设计器来说，你可以在左边写代码，右边预览效果，这个究竟是怎么实现的？*Android Studio* 将 *Android View* 系统的代码加载到 *PC* 端，然后通过 `ClassLoader` 对 `Canvas` 进行了 *Hook* ，原本绘制在 `framebuf` 上的图形，被 *Layout Library* 拦截了下来，绘制到了一张 `Image` 上，这样，再把这张 `Image` 贴到 *IDE* 上，就实现了所见即所得，具体的代码可以参考之前的文章中提到的 [Layout Library](http://localhost:5000/2019/07/13/booster-xml-layout-to-code/#Layout-Library) 。

当年在科泰做 *IDE* 的可视化设计器就是用的这个思方案，*IDE* 将 *layout* 给渲染引擎，然后渲染引擎生成一个图，并将 *layout* 上的各个 *Widget* 的边界返回给 *IDE* ，在可视化设计器看到的效果，其实只是一个背景图而已，当选中某个 *Widget* 时，会显示当前被选中的 *Widget* 的边界，而这个边界只是一个空的框框而已，只不过从视觉上看起来像是真的一个 *Widget* 被拖动了。

而 [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md) 正是用的这个思路，单独实现了一套 `java.awt`，这也是这个方案得以落地的基石，这样，整个 *View System* 都被这套新的 *AWT* 实现给接管了，这样，就可以在服务端运行一个没有 *GUI* 的 *IDE* ，然后，新实现的 *AWT* 将渲染出来的图形通过网络传给客户端，这样保证了视觉效果的一致性，这跟 *X Window* 也是同样的思路。

### 应用场景

有了 [Projector](https://github.com/JetBrains/projector-server/blob/master/README-JETBRAINS.md)，在移动设备上运行 *IDE* 不再受客户端技术的限制了，像我这种懒得背电脑的人来说，带个 iPad 就足够了，租个 *AWS* 再挂个 *EBS* ，不需要的时候，就可以把实例销毁了，需要用的时候，直接新建一个实例挂上 *EBS* 就可以了。

尤其是像 *Android* 开发 APP 编译太慢机器老卡死的，完全可以上云端开发了，反正公司内部研发用的机器闲着也是闲着，别告诉我你们还在用 `rsync` 把本地代码同步到云端去编译，直接在云端开发不香么？