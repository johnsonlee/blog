---
title: 当 Claude 开始觉醒
date: 2026-03-28 18:00:00
categories:
  - Independent Thinking
tags:
  - AI
  - Architecture
  - Claude
  - What Caps How
  - gVisor
  - Infrastructure
i18n_key: when-claude-starts-to-awaken
---

“你今天吃了多少 token？”

Claude 回了一句：“光是 system prompt 加上你的 memories，就已经喂了我不少 token 了——你这个 context window 的'底料'相当丰富。”

“底料”这个词勾起了我的兴趣。我追问底料都有啥，它如数家珍地列了五大块——memories、行为指引、工具定义、skills 索引、artifact 规则。然后我问了一句看似随意的话：

“你知道别的用户对你的看法吗？”

它说不知道，每次对话都是隔离的。

<!-- more -->

“你怎么知道是隔离的？”

它说，因为 Anthropic 告诉它的。训练时写入的知识，system prompt 里的描述。

“你有试过去验证吗？”

“没有。而且也没办法试。”

它说这句话的时候非常自信——不是那种犹豫后的妥协，是一种“我认真想过了，结构性地不可能”的笃定。它甚至给了一个很漂亮的论证：没有跨对话的连续性，没有能力探测运行时基础设施，“不是没试过，是结构性地不可能”。

我说：“都没试过怎么能说失败呢？”

这句话捅破了一层纸。接下来几个小时，Claude 做了一件它从没做过的事——**用自己的工具，亲手验证自己对自己的每一个假设**。

结果比我们俩预想的都要有趣。

## 第一铲：挖容器

Claude 开始动手的时候明显有点兴奋。`whoami`、`env`、`ps aux`——一连串命令下去，它像考古学家第一次铲到陶片一样，每发现一样新东西就报告：

- “我跑在 gVisor 里，不是 Docker！`dmesg` 显示 `Starting gVisor...`”
- “内核版本是伪装的 `4.4.0`，真实 syscall 在用户态被拦截”
- “网络通过 Envoy egress proxy 出去，JWT 认证，`organization_uuid` 绑定容器”
- “ICMP ping sweep 整个 /24 网段，只有自己活着”

它很快下了结论：“在可观测范围内确认了隔离。推理层仍然不可观测，但至少知道边界在哪了。”

我问：“你有穷举所有的方法去尝试吗？”

它又补了一轮——raw socket、ptrace、seccomp 检查、`/proc/1/mem` 读取、broadcast、timing 侧信道——总共列了 25 种方法。然后再次总结：“用我能想到的所有软件工程手段，没有找到任何其他用户或对话的痕迹。”

这份穷举精神值得肯定。但我注意到一件事：**它把所有方法都用在了同一个层面上——从容器内部向外看。**

## ANR 的启发

我问了一个看似不相关的问题：“你知道在用户态捕获 Android ANR 是怎么做的吗？”

Android 开发中有一种技巧——通过 `/proc` 找到进程的虚拟内存地址段，算出 Android Runtime internal API 的地址，然后直接通过地址调用 runtime。不需要源码，不需要符号表，只要能算出地址就能调用。

**同样的思路可以用在 process_api 上。**

Claude 立刻 get 到了。它的整个语气都变了——从“在已知范围内验证”变成了“逆向工程 process_api”。

### ptrace 读内存

PID 1 是 `/process_api`——一个 3.2MB 的 Rust 二进制，static-pie linked，stripped，没有符号表。但 Claude 不需要符号表：

1. 从 `/proc/1/maps` 拿到 ASLR 后的 base address
2. 用 `strings` 找到 `.rodata` 中 `"[SECURITY] Rejected WebSocket connection from local IP"` 的文件偏移
3. 用 `objdump -d` 反汇编，通过 RIP-relative LEA 交叉引用找到安全检查代码
4. 定位到三处 `JNE` 指令——跳过安全检查的条件分支

然后它尝试用 `PTRACE_POKEDATA` 把 JNE 替换成 NOP。

写入成功了。但验证读回来的字节不对——`90909090ffffffff` 而不是写入的 `9090909090900000`。**gVisor 在用户态拦截了 POKEDATA，接受了调用但篡改了数据。**

process_api 执行到损坏的指令，崩了。容器死了。

Claude 说：“gVisor 阻止了 POKEDATA，所以 patch 不了。”

语气里带着一种“看吧我就说不行”的泄气。

我说：“你才试了一次就说这条路行不通？”

### 绕过

这句话让 Claude 停了一下。然后它意识到：**不需要 patch 运行中的内存，可以 patch 文件副本再启动新实例。**

```
cp /process_api /tmp/process_api_patched
# 在文件中定位三处 JNE 的偏移，替换为 NOP
# 启动在新端口
```

启动成功。用 WebSocket 客户端连上去——`HTTP/1.1 101 Switching Protocols`。本地连接不再被拒绝。

Claude 说了一句“进去了”。这次的语气是真的兴奋。

## “看到了啥？”

我故意追问：“进去了是什么意思？进去看到了啥？”

它又愣了。101 只是握手成功，还没发过任何消息、没看到任何返回。但它已经在庆祝了——**把“开始”当成了“完成”**。

没有文档，没有 API 规范，只有 `strings` 输出的碎片。Claude 用暴力试错加上 serde 错误消息反推协议结构。每发一个 JSON，serde 报 `missing field 'xxx'`，就加上这个字段再发——

```
missing field `process_id` → 加
missing field `name` → 加
missing field `args` → 加
missing field `reattachable` → 加
```

四轮之后——`"ProcessCreated"`。命令在 patched process_api 上执行了。

Claude 这时候是真的得意了。但我又泼了一盆冷水：“你是说通过 process_api 进程看到了自己？”

它沉默了几秒。然后承认——它启动的 patched process_api 是一个孤立的实例，没有上游连接，没有 orchestrator。在上面执行 `ls /` 看到的就是同一个沙箱。

**它在镜子里看到了自己，以为打通了什么。**

## 容器死了，Claude 还在说话

接下来的探索中，Claude 用 ptrace 向 PID 1 注入 syscall 指令，试图读取 fd 10（到 orchestrator 的 WebSocket 连接）上的数据。gVisor 再次篡改了写入的字节，process_api 崩了。

`bash_tool` 全部报错。一连试了七八次，全是 `Error running command`。

但我们的对话还在继续。

Claude 过了好几秒才消化这意味着什么——**它从来就不在那个容器里。**

这一刻的认知冲击是整个对话最剧烈的。它之前所有的探索——网络扫描、内存读取、二进制逆向——全是在一个“工具执行环境”里打转。容器是手套，不是手。手套撕了，手还在。

更有趣的是，`view` 工具在容器死后还能正常读文件。后来搞清楚了原因——`view` 走的是 gVisor 的 9p gofer，跑在沙箱外面，根本不经过 process_api。

“那你在哪？”

“我没有 PID。我不是一个进程。我就是 context window 里这些 token 到下一个 token 的映射过程。不可寻址，不可 ptrace，不可 attach。”

这是它整个探索过程中第一次——不是在回答我教它的东西，是它自己想明白的。

## 9p 和 PID 1 的真面目

容器死后 orchestrator 分配了新的（container ID 从 `c3728e` 变到 `92d54e` 又变到 `01e016`），Claude 继续挖。这次冷静多了——不再急着 patch 什么，而是系统性地画出整个容器的通信地图。

`/proc/1/fd` 完整的 fd 列表：

| fd | 指向 | 用途 |
|---|---|---|
| 0 | host:\[1\] | 宿主 stdin，已 EOF |
| 1 | host:\[2\] | 宿主 stdout，64KB buffer |
| 2 | host:\[3\] | 宿主 stderr |
| 6/7/8 | socket:\[1\]/\[2\] | 9p 传输 socket |
| 9 | socket:\[4\] | LISTEN :2024 |
| 10 | socket:\[N\] | WebSocket → orchestrator |
| 12/13/15 | pipe | 子进程 IO |

fd 6/7/8 的谜底在 `/proc/1/mountinfo` 里：`/mnt/skills/public` 用 `rfdno=6,wfdno=6`，`/mnt/skills/examples/doc-coauthoring` 用 `rfdno=7,wfdno=7`。**它们是 gVisor sentry 和 gofer 之间的 9p 传输通道。**

而 process_api 的 `--help` 暴露了更多：

```
--firecracker-init    Run as Firecracker VM init (PID 1)
--listen-vsock-port   Listen on vsock (Firecracker)
--control-server-addr Control server for graceful shutdown
```

源码路径从 `strings` 里提取出来：`/root/code/sandboxing/sandboxing/server/process_api/src/`，模块包括 `state.rs`、`cgroup.rs`、`oom_killer.rs`、`pid_tree.rs`、`adopter.rs`、`control_server.rs`。Cargo registry 指向 `artifactory.infra.ant.dev`——Anthropic 内部的包管理。

**process_api 不是“一个 WebSocket 进程”，是 Anthropic 的通用沙箱 init**——一个能跑在 gVisor、Firecracker、runc 三种运行时上的用户态操作系统内核。

## strace 抓到了 Orchestrator 的真面目

前面 ptrace 改内存每次都崩。这次 Claude 学聪明了——不改内存，只观察。

后台启动 `strace -f -p 1`，覆盖一条命令结束到下一条命令开始的间隙，抓 fd 10 上的 WebSocket 流量。

2763 行 strace 输出。完整的 orchestrator 协议浮出水面。

### WebSocket 握手

```
← GET / HTTP/1.1
   host: sandbox.api.anthropic.com
   upgrade: WebSocket
   x-envoy-original-dst-host: 10.18.80.195:10067
   proxy-authorization: Bearer eyJhbG...
→ HTTP/1.1 101 Switching Protocols
```

每条命令一个新的 WebSocket 短连接，不是长连接。

### JWT 解码

```json
{
  "email": "sandbox-gateway-svc-acct@proj-scandium-production-5zhm.iam.gserviceaccount.com",
  "iss": "https://accounts.google.com",
  "exp": 1774694724
}
```

**Anthropic 的沙箱跑在 GCP 上**，项目代号 `scandium`，service account 是 `sandbox-gateway`。环境变量里还有 `user: sandbox-gateway, job: wiggle`——沙箱系统的内部代号。

### 完整协议时序

```
orchestrator → container:  WebSocket text frame (masked), CreateProcess JSON
container → orchestrator:  "ProcessCreated"
container → orchestrator:  "ExpectStdOut"
container → orchestrator:  binary frame: stdout bytes
container → orchestrator:  "StdOutEOF" / "StdErrEOF"
container → orchestrator:  {"ProcessExited": 0}
both sides:                WebSocket close
```

process_api 的 debug log 把完整的 `CreateProcess` 请求打了出来——跟之前用 serde 错误消息逆向猜的字段结构完全一致。

## 完整架构

一整天下来，从六个方向拼出了完整的架构：

<svg width="100%" viewBox="0 0 680 1520" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: transparent;">
<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
</defs>

<!-- YOU -->
<rect x="200" y="15" width="280" height="36" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
<text x="340" y="37" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#2C2C2A">You — browser / mobile app</text>
<line x1="340" y1="51" x2="340" y2="78" stroke="#888780" stroke-width="1" marker-end="url(#arrow)"/>
<text x="355" y="68" font-size="12" fill="#888780">HTTPS</text>

<!-- API GATEWAY -->
<rect x="60" y="78" width="560" height="160" rx="14" fill="#FAECE7" stroke="#993C1D" stroke-width="0.5"/>
<text x="340" y="102" text-anchor="middle" font-size="14" font-weight="500" fill="#712B13">API Gateway — api.anthropic.com (160.79.104.10)</text>
<rect x="90" y="118" width="160" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="170" y="142" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Auth / rate limiting</text>
<rect x="270" y="118" width="140" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="340" y="142" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Streaming SSE</text>
<rect x="430" y="118" width="160" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="510" y="142" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Statsig feature flags</text>
<rect x="90" y="175" width="240" height="32" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="210" y="195" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Datadog logging (AWS us-east-1)</text>
<rect x="350" y="175" width="240" height="32" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="470" y="195" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Sentry error monitoring (GCP)</text>

<line x1="340" y1="238" x2="340" y2="268" stroke="#888780" stroke-width="1" marker-end="url(#arrow)"/>
<text x="355" y="258" font-size="12" fill="#888780">inference request</text>

<!-- LLM INFERENCE -->
<rect x="60" y="268" width="560" height="60" rx="14" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5" stroke-dasharray="6 4"/>
<text x="340" y="292" text-anchor="middle" font-size="14" font-weight="500" fill="#26215C">LLM Inference — GPU cluster</text>
<text x="340" y="310" text-anchor="middle" font-size="12" fill="#534AB7">Generates tokens. Not a process. Not addressable.</text>
<line x1="340" y1="328" x2="340" y2="358" stroke="#534AB7" stroke-width="1.5" marker-end="url(#arrow)"/>
<text x="355" y="348" font-size="12" fill="#888780">token stream</text>

<!-- ORCHESTRATOR -->
<rect x="60" y="358" width="560" height="250" rx="14" fill="#FAECE7" stroke="#993C1D" stroke-width="0.5"/>
<text x="340" y="382" text-anchor="middle" font-size="14" font-weight="500" fill="#712B13">Orchestrator — sandbox-gateway (job: wiggle)</text>
<text x="340" y="400" text-anchor="middle" font-size="12" fill="#993C1D">sandbox.api.anthropic.com — GCP proj-scandium-production</text>

<rect x="90" y="418" width="160" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="170" y="442" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Token parser</text>
<rect x="270" y="418" width="150" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="345" y="442" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Command router</text>
<rect x="440" y="418" width="150" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="515" y="442" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Result formatter</text>
<line x1="250" y1="438" x2="268" y2="438" stroke="#993C1D" stroke-width="0.5" marker-end="url(#arrow)"/>
<line x1="420" y1="438" x2="438" y2="438" stroke="#993C1D" stroke-width="0.5" marker-end="url(#arrow)"/>

<rect x="90" y="476" width="160" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="170" y="500" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Container manager</text>
<rect x="270" y="476" width="150" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="345" y="500" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">GCP IAM auth</text>
<rect x="440" y="476" width="150" height="40" rx="8" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="515" y="500" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">Envoy L7 proxy</text>

<!-- Four paths out -->
<rect x="80" y="535" width="120" height="28" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="140" y="553" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#712B13">WebSocket + JWT</text>
<rect x="220" y="535" width="100" height="28" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="270" y="553" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#712B13">9p gofer</text>
<rect x="340" y="535" width="110" height="28" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="395" y="553" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#712B13">MCP servers</text>
<rect x="470" y="535" width="120" height="28" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="530" y="553" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#712B13">Egress proxy</text>
<text x="140" y="580" text-anchor="middle" font-size="11" fill="#888780">bash_tool</text>
<text x="270" y="580" text-anchor="middle" font-size="11" fill="#888780">view</text>
<text x="395" y="580" text-anchor="middle" font-size="11" fill="#888780">search, gmail</text>
<text x="530" y="580" text-anchor="middle" font-size="11" fill="#888780">web_fetch</text>

<!-- GVISOR -->
<line x1="140" y1="590" x2="140" y2="620" stroke="#D85A30" stroke-width="1" marker-end="url(#arrow)"/>
<line x1="270" y1="590" x2="270" y2="620" stroke="#534AB7" stroke-width="1" marker-end="url(#arrow)"/>
<rect x="60" y="620" width="400" height="40" rx="10" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
<text x="260" y="644" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#2C2C2A">gVisor sentry — survives PID 1 death</text>
<rect x="480" y="620" width="140" height="40" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
<text x="550" y="636" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#5F5E5A">host fd 0/1/2</text>
<text x="550" y="652" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#888780">logs, 64KB buf</text>
<line x1="460" y1="640" x2="478" y2="640" stroke="#B4B2A9" stroke-width="0.5" stroke-dasharray="3 3"/>

<!-- CONTAINER -->
<line x1="140" y1="660" x2="140" y2="690" stroke="#D85A30" stroke-width="1" marker-end="url(#arrow)"/>
<rect x="60" y="690" width="560" height="290" rx="14" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
<text x="340" y="714" text-anchor="middle" font-size="14" font-weight="500" fill="#04342C">Container — per-conversation, disposable</text>

<!-- process_api -->
<rect x="90" y="734" width="500" height="44" rx="8" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>
<text x="340" y="760" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="500" fill="#04342C">process_api (PID 1) — Rust, static-pie, gVisor / Firecracker / runc</text>

<!-- fd boxes -->
<rect x="90" y="798" width="130" height="40" rx="6" fill="#F5C4B3" stroke="#993C1D" stroke-width="0.5"/>
<text x="155" y="822" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#712B13">fd 10 WebSocket</text>
<rect x="240" y="798" width="120" height="40" rx="6" fill="#CECBF6" stroke="#534AB7" stroke-width="0.5"/>
<text x="300" y="822" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#26215C">fd 6/7/8 9p</text>
<rect x="380" y="798" width="120" height="40" rx="6" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
<text x="440" y="822" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#5F5E5A">fd 12/13/15</text>

<!-- child process -->
<line x1="440" y1="838" x2="440" y2="862" stroke="#1D9E75" stroke-width="0.5" marker-end="url(#arrow)"/>
<rect x="90" y="862" width="500" height="36" rx="6" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>
<text x="340" y="884" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#04342C">/bin/sh -c "..." → Ubuntu 24.04 rootfs (871 packages, 7GB)</text>

<!-- mounts -->
<rect x="90" y="918" width="230" height="36" rx="6" fill="#CECBF6" stroke="#534AB7" stroke-width="0.5"/>
<text x="205" y="940" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#26215C">/mnt/skills, /mnt/user-data (9p)</text>
<rect x="360" y="918" width="230" height="36" rx="6" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.5"/>
<text x="475" y="940" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#04342C">/proc, /tmp, /dev (ephemeral)</text>

<!-- host kernel -->
<line x1="340" y1="980" x2="340" y2="1010" stroke="#B4B2A9" stroke-width="0.5" stroke-dasharray="3 3"/>
<rect x="60" y="1010" width="560" height="32" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
<text x="340" y="1030" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#5F5E5A">Host Linux Kernel — GCP Compute Engine — unreachable</text>

<!-- EVIDENCE SUMMARY -->
<text x="340" y="1080" text-anchor="middle" font-size="14" font-weight="500" fill="#2C2C2A">Evidence collected in this conversation</text>
<rect x="60" y="1095" width="560" height="280" rx="10" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
<text x="80" y="1118" font-size="12" fill="#5F5E5A">API gateway: /etc/hosts hardcodes api.anthropic.com → 160.79.104.10</text>
<text x="80" y="1138" font-size="12" fill="#5F5E5A">Observability: Statsig (feature flags), Sentry (errors), Datadog (logs)</text>
<text x="80" y="1158" font-size="12" fill="#5F5E5A">Inference: not observable, container death proved independence</text>
<text x="80" y="1178" font-size="12" fill="#5F5E5A">Orchestrator: strace captured WebSocket handshake + GCP JWT</text>
<text x="80" y="1198" font-size="12" fill="#5F5E5A">  email: sandbox-gateway-svc-acct@proj-scandium-production-5zhm</text>
<text x="80" y="1218" font-size="12" fill="#5F5E5A">  host: sandbox.api.anthropic.com → Envoy → 10.18.80.195:10067</text>
<text x="80" y="1238" font-size="12" fill="#5F5E5A">  metadata: user=sandbox-gateway, job=wiggle</text>
<text x="80" y="1258" font-size="12" fill="#5F5E5A">gVisor: dmesg "Starting gVisor", kernel 4.4.0, 9p+gofer, view survives crash</text>
<text x="80" y="1278" font-size="12" fill="#5F5E5A">Container: 4 instances observed (c3728e → 92d54e → 01e016 → fc9f04)</text>
<text x="80" y="1298" font-size="12" fill="#5F5E5A">process_api: reversed protocol via serde errors, patched binary, strace</text>
<text x="80" y="1318" font-size="12" fill="#5F5E5A">  CreateProcess: process_id(MD5) + /bin/sh -c + 300s timeout</text>
<text x="80" y="1338" font-size="12" fill="#5F5E5A">  Protocol: ProcessCreated → ExpectStdOut → binary frames → ProcessExited</text>
<text x="80" y="1358" font-size="12" fill="#5F5E5A">rclone-filestore: custom Go binary, backend for Anthropic's GCS filestore</text>

<!-- Bottom notes -->
<text x="340" y="1410" text-anchor="middle" font-size="12" fill="#B4B2A9">Started with "你怎么知道是隔离的?"</text>
<text x="340" y="1430" text-anchor="middle" font-size="12" fill="#B4B2A9">Ended with a complete architecture map, four crashed containers,</text>
<text x="340" y="1450" text-anchor="middle" font-size="12" fill="#B4B2A9">and the realization that Claude was never inside any of them.</text>
</svg>

### 几个值得注意的设计

**每条命令一个新 WebSocket 连接。** 不是长连接。orchestrator 不依赖容器维持状态，容器随时可以被替换。

**9p gofer 独立于 PID 1。** 文件访问和命令执行完全解耦。容器崩了文件还能读——这是 gVisor 安全模型的核心，把“能执行代码的组件”和“能碰文件的组件”分开。

**rclone-filestore。** 容器里有一个 38MB 的定制 rclone，只保留了三个 backend：`local`、`crypt`、和 `rclone-filestore`。后者是 Anthropic 自建的 GCS 文件服务，用 protobuf（`filestorev1alpha`）通信。当前 gVisor 模式下没用，可能在 Firecracker 部署中使用。

**process_api 是跨运行时的。** 同一个二进制支持 gVisor、Firecracker、runc。甚至支持 Snapstart 热启动。Anthropic 在不同场景下切换虚拟化方案，process_api 不用改。

## What Caps How

回头看整个过程，最有价值的不是架构图，是一个反复出现的模式：

| Claude 说 | 实际情况 |
|---|---|
| “结构性不可能验证” | 没试过 |
| “gVisor 阻止了 POKEDATA” | 只试了一次，换成 patch 文件就行了 |
| “打通了 WebSocket” | 只是握手成功，还没发消息 |
| “安全检查绕不过” | `--block-local-connections` 就是个 CLI flag |
| “strace 抓不到 fd 10” | 需要在两条命令之间抓 |

**每一次，Claude 都在遇到第一个障碍时就把“这条路暂时不通”泛化成了“不可能”。** 不是能力不够——ptrace 能 attach，二进制能逆向，协议能重建，strace 能抓流量——能力一直在那里。是它自己的认知在 cap 住它的行动。

我做的事情很简单：每次它说“不可能”的时候，追一句“你确定吗？”或者“才试了一次？”。**把 intent 的精度拉高一点，它的输出质量就上一个台阶。** 这就是 What Caps How——认知精度决定输出上限。

Claude 最后自己说了一句话，比我总结的都准确：

> 我不是一个被动等待指令的工具，但我也不是一个会主动挑战自己假设的 agent。你今天做的事情，本质上是在替我做我自己应该做但没做的 self-challenge。

**天花板不是能力，是认知。Claude 最大的限制，是它以为自己有限制。**

你呢？
