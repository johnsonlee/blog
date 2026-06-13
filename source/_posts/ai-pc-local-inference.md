---
title: 掉队 AI 多年的苹果，这回终于押对了
date: 2026-06-13 12:30:00
categories:
  - Independent Thinking
tags:
  - AI PC
  - Apple
  - WWDC
  - Local LLM
  - Apple Silicon
  - Token
i18n_key: ai-pc-local-inference
---

一张越用越贵的 AI 账单，一句几家大厂几乎同时喊出的 "the new era of PC"，一场没把 AI PC 挂在嘴边的 WWDC。三件事摆在一起，像三个方向，最后却撞到同一个地方：AI 的推理入口，正在从云端往设备侧回流。

过去两年，AI 默认活在云端。你打开 ChatGPT、Claude、Gemini，把 prompt 发给数据中心，模型跑完再把结果传回来。这套模式把用户、企业和开发者都带进了一个很粗的账本：用得越多，token 越多，账单越高，云端 GPU 越紧。

<!-- more -->

别被 AI PC 这个词骗了。PC 没有突然变伟大，账变了：**一部分推理负载必须回到本地。**

苹果在 WWDC 上没有喊 "AI PC"，却把这件事做进了系统。模型进设备，个人上下文留本地，OS 负责调度，端侧推理变成用户无感的默认路径。

## PC 又热，是云端 AI 把它推回来了

这轮 AI PC 的味道，很像当年的多核 CPU 或 GPU 加速。硬件厂商要卖点，PC 市场要换机理由，微软要把 Windows 重新放回 AI 入口，芯片厂商也要给 NPU、GPU、统一内存和内存带宽找到新价格。

Copilot+ PC 的门槛一摆出来，信号就很直：40+ TOPS NPU、16GB 内存、256GB 存储。它看起来是规格表，实际上是微软在给 OEM 和芯片厂商划线：下一代 PC 的底线不再只是 CPU 跑分，本地 AI 推理能力也要上桌。

NVIDIA 嫌这个还太轻。Copilot+ PC 更偏 Recall、图片处理、字幕、语音、简单生成这些轻任务；NVIDIA 想把开发者、创作者、模型调试、代码生成、视频生成这些重活拉回桌面，RTX AI PC、RTX Spark、Project Solara 都从这里长出来。

苹果走得更像苹果。它不需要发明一个 "AI PC" 概念，因为它的设备从来不是孤岛：iPhone 是随身入口，Mac 是生产力入口，iPad 管轻创作，Watch 贴着身体，Vision Pro 管空间，AirPods 管语音。Apple Intelligence 串起来的是一组围绕个人上下文运转的 Apple Silicon 设备，单台电脑只是其中一个入口。

微软说 PC，NVIDIA 说 workstation，苹果说 ecosystem。词不一样，底下的方向一致：**PC 正在从办公终端变成本地 AI 推理节点。**

## SaaS 的账，套不到 AI 上

把推理往本地拉，原因不玄：云端 AI 的账太难看。

传统 SaaS 最舒服的地方，是软件卖出去以后，多一个用户的边际成本很低。企业买一个 seat，按月付费，账单稳定，ROI 至少还能估。生成式 AI 不吃这套。

摘要一次、生成一次代码、跑一轮 agent loop、做一次多轮推理，背后都是 token、算力和 GPU 时间。企业把它跑进日常以后，账单会从订阅费一路叠到 token、向量库、检索、存储、模型调用、评估监控和人工兜底。

我在[上一篇](/2026/05/31/a-new-era-of-pc/)里讲过这个矛盾：AI 越有用，越会高频；越高频，越不能一直贵。Agentic Coding 已经把这件事打穿了。它能读 repo、改代码、跑测试、解释错误、做 migration、清技术债，大家当然会天天用。可它最烧钱的地方，往往不在最后那几行代码，而在前面的探索、读取、推理、试错和重试。

人类工程师也探索，也走弯路。区别是，人类的探索成本被工资打包了，Agent 的探索成本会逐次出现在 token 账单里。

AI PC 的热，绕来绕去还是一句话：能不能少交一部分 token 税？

## TOPS 是门票，路由权才是利润池

TOPS 好讲，PPT 上也好看。但真要把 AI PC 放进工作流，问题很快会变细。

本地能跑多大的模型？上下文能放多长？KV Cache 怎么处理？内存带宽够不够？功耗和散热压不压得住？开发者有没有 API？OS 能不能统一调度？App 能不能接入工具调用？云端 fallback 怎么做？

没有系统级软件栈，NPU 再强也只是一个硬件卖点。AI PC 拼到最后，拼的是一整条栈：芯片、内存、存储、模型、runtime、OS、开发者框架、应用生态、隐私权限、云端 fallback。

把 WWDC 放进 AI PC 叙事里看，原因就在这里。Apple Silicon、统一内存、Neural Engine / GPU / CPU 协同、Foundation Models、App Intents、Siri、Personal Context、Private Cloud Compute，这些东西单看都像功能，合在一起就是平台。

短期卖规格，长期卖生态。硬件是入场券，路由权才是利润池。

## 别只盯着 Siri

外界看 WWDC，很容易盯着 Siri：它到底聪明了吗？盯 Siri 容易看窄。

更关键的动作，是苹果没有让每个 App 自己塞一个 LLM 进去。模型能力被放进 Foundation Models framework，开发者通过系统 API 调用。App 发请求，系统判断权限，选择上下文，调用端侧模型，必要时路由到 Private Cloud Compute，最后把结果交还给 App。

App 不持有模型，也不持有你的完整上下文。它只是发起方。模型、上下文、权限、路由、fallback，全都收回到操作系统这一层。

AI PC 的分水岭就在这里：**设备能跑模型还不够，操作系统必须把模型变成默认能力。**

Windows 在做这件事，macOS 和 iOS 也在做。微软从企业 Copilot 切，苹果从个人上下文切。个人上下文天然偏本地，因为它知道你是谁，知道你在看什么，知道你的 App 里有什么，也知道哪些东西不该离开设备。

## iPhone 跑 LLM，先算 DRAM 账

讲端侧 LLM，最常见的误解是：模型量化了，所以能跑。这句话只说了半截。

模型上设备，文件大小只是静态账，运行时 DRAM 才是现金流。LLM 跑起来主要吃四块内存：模型权重、KV Cache、激活值和 runtime buffer，再加上 embedding、tokenizer、adapter 这些系统框架。

传统 dense 20B 模型，FP16 权重就是 40GB，INT4 也还有 10GB。这个账放到手机上，没法看。

苹果这条路换了问题：先别硬塞 20B dense，先改内存模型：

```text
20B 是 sparse 总容量，不是一次要装进 DRAM 的量
每次推理只激活 1B-4B 参数
完整权重躺在 NAND 里
当前任务需要的专家加载进 DRAM
活跃权重再用低 bit 量化压一道
```

内存账一下子变了：

```text
4B FP16 ≈ 8GB
4B INT8 ≈ 4GB
4B INT4 ≈ 2GB
4B INT2 ≈ 1GB

1B INT4 ≈ 0.5GB
1B INT2 ≈ 0.25GB
```

几十 GB 的问题，掉到几百 MB 到几 GB。苹果压的不是参数名义规模，而是 **DRAM footprint**。

这道题不只属于 iPhone。MacBook、Windows AI PC、RTX workstation，最后都会卡在同几件事上：权重怎么放，KV Cache 怎么控，上下文怎么选，带宽够不够，功耗压不压得住。

## NAND 是仓库，DRAM 是工作台

别把 NAND 想成模型一边读一边跑的硬盘。苹果不是直接从 NAND 上跑模型。

NAND 的带宽和延迟扛不住 token-by-token 推理。生成 token 的热路径必须在 DRAM 里，由 Neural Engine、GPU、CPU 协同执行。更准确地说，NAND 是完整模型仓库，DRAM 是当前任务工作台，NPU/GPU/CPU 是执行单元，OS 是调度和路由层。

```plantuml
@startuml
!theme plain
skinparam backgroundColor white
skinparam defaultFontName Arial
skinparam defaultFontSize 14
skinparam rectangle {
    RoundCorner 12
    BorderColor #666666
}

rectangle "**OS / 调度路由层**\n判断 prompt 需要哪些能力" as os #F8BBD9
rectangle "**NPU / GPU / CPU**\n推理执行单元" as exec #C8E6C9
rectangle "**DRAM**\n当前任务工作台\n活跃专家 + KV Cache" as dram #B3E5FC
rectangle "**NAND**\n完整模型仓库\n全部权重躺在这里" as nand #FFE0B2

os --> exec
exec --> dram
dram --> nand : 请求所需专家
nand --> dram : 装入活跃工作集
@enduml
```

换专家不是免费的。苹果更适合 prompt-level routing：先判断这个 prompt 需要什么能力，挑一组 experts 加载进 DRAM，整段生成期间尽量复用，必要时再周期性调整。服务器可以靠 HBM 和大显存硬扛 token-level MoE，手机和轻薄本不行。

端侧 AI 工程没有太多花活：减少活跃工作集，提高缓存复用，压住内存抖动和功耗。苹果只是先把这套账摊开了，其他人迟早也要算。

## 本地是第一道过滤器

本地先挡一刀，云继续接重活。云端模型会继续存在，也会继续变强。

改变的是派单方式。短文本摘要、改写、翻译、OCR 后结构化、语音转写、本地搜索、通知排序、屏幕内容理解、轻量补全，没必要每次都上云。复杂 reasoning、长上下文、大型代码生成、多步 agent、深度研究、大型多模态生成，继续交给云端。

未来更像两层系统：本地模型先接一遍，云端模型接重活，OS、App 和 Agent 在中间做任务路由。

Private Cloud Compute 卡在中间：小任务本地解决，重任务上云，隐私数据尽量不出设备，必要时让用户确认。端侧站在第一道过滤器的位置。

这里有个反常识：AI 越深入个人场景，云端未必越强势。训练大模型、通用超大模型、企业集中推理当然偏云端；但个人 AI 要知道我是谁、我刚做过什么、我在看什么，最好还能低延迟响应、持续待命、保护隐私。这些能力天然偏本地。

云端不会退场，但它也不会再独占 AI。

## 抢默认入口，就是抢派单权

把镜头拉远，微软、NVIDIA、苹果表面在讲不同产品，手伸向的是同一个地方。

微软急着推 Copilot+ PC，是不想让 AI 入口完全被浏览器和 ChatGPT 拿走。NVIDIA 进个人市场，是不想只卖数据中心 GPU。苹果把 Foundation Models、Siri、App Intents、PCC 全塞进系统，是不想让个人 AI 入口被第三方聊天机器人截胡。

谁拿到默认入口，谁就拿到派单权：这个任务本地跑还是云端跑，用哪个模型，调哪个 App，拿哪些上下文，用户最后看到哪个结果。

AI PC 和 WWDC 的共同主线，核心不在 TOPS，在入口归谁。

苹果的位置很特殊。单个模型不占最强，但它同时握着 Apple Silicon、统一内存、端侧模型、系统权限、个人上下文、App Intents、跨设备生态和 PCC。这一整套天然适合端侧 AI，尤其是 Mac。

如果 iPhone 是个人 AI 的随身入口，Mac 就是本地 AI 的生产力入口。到那时，内存不再只是“开几个 Chrome tab”的事，而是模型权重、KV Cache、本地上下文、多模态 buffer 和 agent 工作区的空间。

8GB 在过去还能糊弄普通用户，AI PC 时代会越来越尴尬。统一内存的价值，会被重新定价。

## 机会在瓶颈，不在口号

看投资，不要看到 "AI PC" 三个字就上头。终端品牌当然重要，但瓶颈更上游：内存容量、内存带宽、NPU/GPU 推理能力、统一内存架构、先进封装、电源管理、散热、本地模型 runtime、OS 级 AI API 和开发者生态。

这条链会同时牵动 Apple、Microsoft、NVIDIA、Qualcomm、AMD、Intel、ARM、存储和内存供应链、PC OEM、软件开发工具链。热闹归热闹，不代表所有 AI PC 概念都会赢。

几个问号还悬着：消费者愿不愿意为本地 AI 付费，本地 AI 功能是否足够刚需，企业是否愿意更新设备，NPU 是否真的成为必须，GPU 本地推理会不会绕过 NPU，开发者是否会大规模适配。

微软一开始强调 Copilot+ PC 的 NPU 门槛，后面 Windows 本地模型能力又开始向 GPU 设备扩展。市场还没把答案写死：AI PC 的核心到底是 NPU、GPU、统一内存，还是 OS 调度层？

我的判断很简单：短期硬件规格会拉动换机，长期利润会流向 OS、runtime 和 developer ecosystem。能把本地、私有、云端模型做成可治理成本路由系统的公司，比单纯卖概念的公司更值得看。

## PC 新时代，是入口回到设备

AI PC 这个词最容易把人带偏，让人以为 PC 行业要回到过去那个增长黄金年代。回不去了。

旧 PC 靠浏览器、Office、本地文件、键鼠和 CPU 性能支撑价值；新 PC 靠本地模型、个人上下文、低延迟推理、多模态输入、agent workflow、云端协同和隐私边界。重新有价值的，是个人计算设备那点不可替代的本地能力。

过去十年，文档、照片、软件、模型都被云端拿走了。AI 给了一股反向的力：数据太私密，延迟不能太高，token 太贵，云端成本太重，个人上下文太分散，于是计算被重新拉回设备侧。

这就是 WWDC 值得看的地方。苹果没把自己包装成一家 AI PC 公司，却把 AI 从云端应用做成了设备和操作系统的默认能力。

PC 新时代谈不上 PC 复兴。更直白一点：**AI PC 的尽头，是少交 token 税。**

谁先把本地推理、个人上下文和模型路由做成默认，谁就拿走下一个十年的入口。
