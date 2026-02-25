---
title: LLM 的本质——函数
date: 2026-02-25 12:21:03
categories:
  - Independent Thinking
tags:
  - LLM
  - AI
  - Machine Learning
  - Transformer
  - Deep Learning
mathjax: true
---

前段时间，儿子问我：“爸爸，ChatGPT 是怎么知道该说什么的？”

我决定认真回答这个问题。不是敷衍一句“它很聪明”，而是真的把 LLM 的原理拆给他看。于是做了一套 PPT —— [LLM for Kids](https://llm.johnsonlee.io)，从 Token、Embedding 一路讲到 Attention、Transformer，用“小猫坐在垫子上”当例句，用“成绩单”和“画饼图”当类比。

做完这套 PPT，我自己的收获比预期大得多。当你必须把一个概念解释到小学生能懂的程度，你就被迫剥掉所有术语的包装，直面本质。

而这个本质，简单到让人意外：

**LLM 就是一个函数。**

不是比喻，不是类比，是数学意义上的函数。输入一组 Token，输出一个概率分布。所有让人觉得“AI 好像在思考”的行为，都是这个函数反复调用自身的结果。

## 从一个 d 维空间说起

训练一个 LLM，第一步是假设一个 d 维空间的存在。d 可以是 4096，可以是 8192，具体多少取决于模型设计。

每个 Token——一个词、一个子词、一个标点——被映射成这个空间里的一个向量。这步操作叫 Embedding，本质上就是一张查找表：Token ID 进去，d 维向量出来。

{% raw %}
$$\text{Embedding}: \text{token{\_}id} \rightarrow \mathbb{R}^d$$
{% endraw %}

训练之前，这些向量是随机初始化的。“猫”和“狗”可能离得很远，“猫”和“利率”可能紧挨着。但训练结束后，语义相近的词会被拉到附近——不是人工设定的，是梯度下降自己调出来的。

**词的“意思”，就是它在高维空间里的位置。**

## Attention：动态路由

但这里有个问题：Embedding 给每个 token 的是一个**静态的、与上下文无关的**位置。“苹果”不管出现在“我吃了一个苹果”还是“苹果发布了新 iPhone”，查表拿到的向量是同一个——它只编码了“苹果”的平均语义，不知道在当前这句话里它到底是水果还是公司。

Attention 做的就是：**根据上下文，动态调整每个 token 的表示。** Embedding 是给每个 token 分配一个“默认人设”，Attention 是让它们互相交流之后，根据语境各自调整。没有 Attention，每个词都活在自己的世界里，不知道邻居是谁。

对于序列中的每个位置，Attention 回答一个问题：**我应该关注谁？关注多少？**

数学上，它把每个向量变换成三个角色：

- **Q（Query）**：我在找什么
- **K（Key）**：我能提供什么
- **V（Value）**：我实际的内容

然后用一个公式完成匹配和聚合：

{% raw %}
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
{% endraw %}

{% raw %}$QK^T${% endraw %} 算的是每对位置之间的相关性分数。{% raw %}$\sqrt{d_k}${% endraw %} 是个缩放因子，防止点积过大导致 softmax 输出趋近 one-hot（梯度消失）。softmax 把分数归一化成权重，再用权重对 V 做加权求和。

一句话概括：**Attention 就是一个可学习的、动态的加权求和。**

Multi-Head Attention 则是同时做多组这样的运算。每个 Head 学到不同的关注模式——有的关注语法依赖，有的关注语义相似，有的关注位置距离。最后把多个 Head 的结果拼起来，过一个线性变换。

## FFN：知识仓库

每个 Transformer Block 里，Attention 之后紧跟一个 Feed-Forward Network（FFN）：

{% raw %}
$$\text{FFN}(x) = W_2 \cdot \text{ReLU}(W_1 \cdot x + b_1) + b_2$$
{% endraw %}

两层全连接，中间一个激活函数。看起来平平无奇，但近年来 Mechanistic Interpretability 研究揭示了一个有趣的分工：

**Attention 负责信息路由——决定从哪里取信息。FFN 负责知识存储——模型记住的“事实”大量编码在 FFN 的参数里。**

这意味着当你问 LLM“法国的首都是什么”，Attention 负责把“法国”和“首都”关联起来，FFN 负责从参数里“回忆”出“巴黎”。

## 训练目标：简单到不像话

整个训练过程的目标只有一个：**Next Token Prediction。**

给定前 n 个 Token，预测第 n+1 个。计算预测的概率分布和真实分布之间的交叉熵损失，反向传播，更新参数。

{% raw %}
$$\mathcal{L} = -\sum_{t=1}^{T} \log P(x_t | x_1, x_2, \ldots, x_{t-1})$$
{% endraw %}

{% raw %}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 670" width="960" height="670" font-family="system-ui, -apple-system, sans-serif">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#555"/>
    </marker>
    <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#c0392b"/>
    </marker>
  </defs>

  <!-- ===== 词表 (Vocabulary) ===== -->
  <rect x="28" y="52" width="130" height="130" rx="8" fill="#f0f4ff" stroke="#4a6fa5" stroke-width="1.5"/>
  <text x="93" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#4a6fa5">词表 V</text>
  <text x="44" y="92" font-size="11" fill="#555">0 → "的"</text>
  <text x="44" y="108" font-size="11" fill="#555">1 → "苹果"</text>
  <text x="44" y="124" font-size="11" fill="#555">2 → "坐"</text>
  <text x="44" y="140" font-size="11" fill="#555">3 → "猫"</text>
  <text x="44" y="158" font-size="11" fill="#999">… 50,000 个</text>
  <text x="93" y="176" text-anchor="middle" font-size="10" fill="#888">tokenizer 生成</text>

  <!-- Arrow: 词表 → Embedding -->
  <text x="93" y="208" text-anchor="middle" font-size="12" fill="#333">"苹果" → id=1</text>
  <line x1="93" y1="215" x2="93" y2="248" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Embedding 表 ===== -->
  <rect x="18" y="252" width="150" height="120" rx="8" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="93" y="272" text-anchor="middle" font-size="13" font-weight="bold" fill="#2e7d32">Embedding 表</text>
  <text x="93" y="290" text-anchor="middle" font-size="10" fill="#888">|V| × d 矩阵（可学习）</text>
  <text x="34" y="310" font-size="10" fill="#555" font-family="monospace">0: [0.12, -0.45, ...]</text>
  <text x="34" y="326" font-size="10" fill="#e65100" font-weight="bold" font-family="monospace">1: [0.83, 0.21, ...]</text>
  <text x="34" y="342" font-size="10" fill="#555" font-family="monospace">2: [-0.31, 0.67, ...]</text>
  <text x="34" y="358" font-size="10" fill="#999" font-family="monospace">…</text>

  <!-- Arrow: Embedding → token vector x -->
  <line x1="168" y1="312" x2="218" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Token 向量 x ===== -->
  <rect x="220" y="284" width="120" height="56" rx="8" fill="#fff8e1" stroke="#f57f17" stroke-width="1.5"/>
  <text x="280" y="306" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">向量 x</text>
  <text x="280" y="324" text-anchor="middle" font-size="10" fill="#888">[0.83, 0.21, …] d 维</text>
  <text x="280" y="336" text-anchor="middle" font-size="9" fill="#aaa">静态，与上下文无关</text>

  <!-- Arrow: x → Q/K/V 投影 -->
  <line x1="340" y1="312" x2="410" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Q/K/V 权重矩阵 ===== -->
  <rect x="412" y="230" width="180" height="166" rx="8" fill="#fff3e0" stroke="#e65100" stroke-width="1.5"/>
  <text x="502" y="252" text-anchor="middle" font-size="13" font-weight="bold" fill="#e65100">线性投影（可学习）</text>

  <rect x="424" y="262" width="156" height="34" rx="5" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
  <text x="502" y="276" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">W_Q</text>
  <text x="502" y="290" text-anchor="middle" font-size="9" fill="#888">d × d_k → Q ="我在找什么"</text>

  <rect x="424" y="302" width="156" height="34" rx="5" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
  <text x="502" y="316" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">W_K</text>
  <text x="502" y="330" text-anchor="middle" font-size="9" fill="#888">d × d_k → K ="我能提供什么"</text>

  <rect x="424" y="342" width="156" height="34" rx="5" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
  <text x="502" y="356" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">W_V</text>
  <text x="502" y="370" text-anchor="middle" font-size="9" fill="#888">d × d_k → V ="实际内容"</text>

  <text x="502" y="392" text-anchor="middle" font-size="9" fill="#999">训练前随机初始化，训练中梯度更新</text>

  <!-- Arrow: Q/K/V → Attention -->
  <line x1="592" y1="312" x2="642" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Attention ===== -->
  <rect x="644" y="274" width="130" height="76" rx="8" fill="#fce4ec" stroke="#c62828" stroke-width="1.5"/>
  <text x="709" y="298" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">Attention</text>
  <text x="709" y="316" text-anchor="middle" font-size="10" fill="#888">softmax(QKᵀ/√d)·V</text>
  <text x="709" y="332" text-anchor="middle" font-size="10" fill="#888">上下文融合</text>
  <text x="709" y="346" text-anchor="middle" font-size="9" fill="#aaa">"苹果"→ 水果 or 公司?</text>

  <!-- Arrow: Attention → FFN -->
  <line x1="774" y1="312" x2="814" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== FFN ===== -->
  <rect x="816" y="284" width="110" height="56" rx="8" fill="#e8eaf6" stroke="#283593" stroke-width="1.5"/>
  <text x="871" y="308" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">FFN</text>
  <text x="871" y="326" text-anchor="middle" font-size="10" fill="#888">知识存储</text>

  <!-- ×N layers bracket -->
  <rect x="634" y="264" width="302" height="96" rx="12" fill="none" stroke="#bbb" stroke-width="1" stroke-dasharray="5,4"/>
  <text x="785" y="376" text-anchor="middle" font-size="11" fill="#999" font-style="italic">× N 层（12 ~ 96 层）</text>

  <!-- Arrow: FFN → 输出 -->
  <line x1="871" y1="340" x2="871" y2="410" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== 输出层 ===== -->
  <rect x="801" y="412" width="140" height="50" rx="8" fill="#f3e5f5" stroke="#6a1b9a" stroke-width="1.5"/>
  <text x="871" y="434" text-anchor="middle" font-size="13" fill="#333">输出层</text>
  <text x="871" y="450" text-anchor="middle" font-size="10" fill="#888">→ 词表概率分布</text>

  <!-- Arrow down -->
  <line x1="871" y1="462" x2="871" y2="498" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Prediction -->
  <rect x="811" y="500" width="120" height="40" rx="8" fill="#e0f7fa" stroke="#00695c" stroke-width="1.5"/>
  <text x="871" y="518" text-anchor="middle" font-size="12" fill="#333">预测："坐"</text>
  <text x="871" y="533" text-anchor="middle" font-size="10" fill="#888">P("坐")=0.72</text>

  <!-- Arrow: prediction → loss -->
  <line x1="811" y1="520" x2="700" y2="520" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Ground truth -->
  <rect x="560" y="555" width="120" height="32" rx="6" fill="#f5f5f5" stroke="#999" stroke-width="1"/>
  <text x="620" y="576" text-anchor="middle" font-size="11" fill="#666">真实答案："坐"</text>
  <line x1="620" y1="555" x2="620" y2="540" stroke="#555" stroke-width="1" marker-end="url(#arrow)"/>

  <!-- Loss -->
  <rect x="570" y="500" width="120" height="40" rx="8" fill="#ffebee" stroke="#c62828" stroke-width="1.5"/>
  <text x="630" y="518" text-anchor="middle" font-size="13" font-weight="bold" fill="#c62828">计算损失</text>
  <text x="630" y="533" text-anchor="middle" font-size="10" fill="#c62828">交叉熵</text>

  <!-- Arrow: loss → backprop -->
  <line x1="570" y1="520" x2="460" y2="520" stroke="#c0392b" stroke-width="1.5" marker-end="url(#arrow-red)"/>

  <!-- Backprop -->
  <rect x="240" y="500" width="220" height="40" rx="8" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="350" y="518" text-anchor="middle" font-size="12" font-weight="bold" fill="#c62828">反向传播 → 更新所有参数 θ</text>
  <text x="350" y="533" text-anchor="middle" font-size="9" fill="#c62828">Embedding 表 · W_Q · W_K · W_V · W_FFN ...</text>

  <!-- Backprop arrows back to learnable components -->
  <line x1="300" y1="500" x2="135" y2="375" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrow-red)"/>
  <line x1="420" y1="500" x2="502" y2="398" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrow-red)"/>

  <!-- 参数 theta label -->
  <rect x="28" y="416" width="184" height="50" rx="6" fill="#fff" stroke="#c0392b" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="120" y="436" text-anchor="middle" font-size="11" fill="#c62828" font-weight="bold">参数 θ = 全部可学习的权重</text>
  <text x="120" y="452" text-anchor="middle" font-size="9" fill="#c62828">训练就是在调 θ，让 f_θ(X)≈Y</text>

  <!-- Legend (centered) -->
  <g transform="translate(220, 640)">
    <line x1="0" y1="0" x2="30" y2="0" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="38" y="4" font-size="11" fill="#666">前向传播</text>
    <line x1="130" y1="0" x2="160" y2="0" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrow-red)"/>
    <text x="168" y="4" font-size="11" fill="#c0392b">反向传播</text>
    <rect x="270" y="-8" width="14" height="14" rx="3" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
    <text x="292" y="4" font-size="11" fill="#666">可学习参数</text>
    <rect x="390" y="-8" width="14" height="14" rx="3" fill="#f0f4ff" stroke="#4a6fa5" stroke-width="1"/>
    <text x="412" y="4" font-size="11" fill="#666">固定组件</text>
  </g>
</svg>
{% endraw %}

就这么一个目标。没有人教它语法，没有人教它逻辑，没有人教它写代码。但当模型足够大、数据足够多，这些能力就“涌现”了。

为什么？因为要准确预测下一个 Token，你必须理解上下文。要理解上下文，你就得隐式地学会语法、语义、逻辑、常识、甚至世界知识。**预测下一个词，是对语言理解能力的极致压缩。**

## 那“智能”是什么？

回到开头的论点：LLM 就是一个函数。

{% raw %}
$$f_\theta: \text{Token}^n \rightarrow \mathbb{R}^{|V|}$$
{% endraw %}

几十亿到几千亿个参数 {% raw %}$\theta${% endraw %}，通过海量数据训练出来，将 Token 序列映射到词表上的概率分布。单次 forward pass，纯矩阵运算，无副作用，确定性输出。

那对话呢？不过是这个函数的自回归调用——上一步的输出拼到输入末尾，再调一次。Temperature 和 Top-p 采样引入了随机性，但那是推理阶段的工程选择，不是模型本身的属性。

这不是在贬低 LLM。恰恰相反，**一个“仅仅”做函数拟合的系统，能涌现出看起来像推理、像创造、像理解的行为，这件事本身才是真正值得敬畏的。**

Conway 的生命游戏也是函数——几条简单规则，却能演化出无限复杂的图案。LLM 类似：简单的训练目标，通过足够大的参数空间和数据，涌现出超出直觉的能力。

## 去神秘化的意义

理解“LLM 是函数”，有实际价值：

它让你不再把 LLM 的错误当成“AI 不靠谱”，而是理解为函数在某些输入区域的拟合不够好。它让你知道 Prompt Engineering 在做什么——调整输入向量在高维空间中的位置，让它落到函数拟合得好的区域里。它让你理解为什么 Context Window 有上限——不是技术限制那么简单，而是 Attention 的计算复杂度是 $O(n^2)$。

**不需要敬畏，不需要恐惧，需要的是理解。** 当你知道引擎盖下面是什么，你才能把它用到极致。
