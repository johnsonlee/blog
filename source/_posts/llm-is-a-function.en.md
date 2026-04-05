---
title: "The Essence of LLMs: Functions"
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
lang: en
i18n_key: llm-is-a-function
---

A while back, my son asked me: "Dad, how does ChatGPT know what to say?"

I decided to give a real answer. Not a hand-wavy "it's very smart," but actually break down how LLMs work for him. So I made a slide deck -- [LLM for Kids](https://llm.johnsonlee.io) -- walking through Token, Embedding, Attention, and Transformer, using "the cat sat on the mat" as an example, "report cards" and "pie charts" as analogies.

Making that deck taught me more than I expected. When you're forced to explain a concept so that an elementary schooler can understand it, you're forced to strip away all the jargon and confront the essence.

And that essence is surprisingly simple:

**An LLM is a function.**

Not a metaphor. Not an analogy. A function in the mathematical sense. It takes a sequence of tokens as input and outputs a probability distribution. Every behavior that makes people think "AI seems to be thinking" is just this function calling itself repeatedly.

## Starting from a d-Dimensional Space

Training an LLM begins with positing a d-dimensional space. d could be 4096, 8192 -- the exact number depends on the model design.

Each token -- a word, a subword, a punctuation mark -- is mapped to a vector in this space. This operation is called Embedding, and it's essentially a lookup table: token ID in, d-dimensional vector out.

{% raw %}
$$\text{Embedding}: \text{token{\_}id} \rightarrow \mathbb{R}^d$$
{% endraw %}

Before training, these vectors are randomly initialized. "Cat" and "dog" might be far apart. "Cat" and "interest rate" might be right next to each other. But after training, semantically similar words get pulled closer together -- not by human design, but by gradient descent tuning it on its own.

**A word's "meaning" is its position in high-dimensional space.**

## Attention: Dynamic Routing

But there's a problem: Embedding gives each token a **static, context-independent** position. Whether "apple" appears in "I ate an apple" or "Apple released a new iPhone," the lookup table returns the same vector -- encoding only the average semantics of "apple," with no idea whether it's a fruit or a company in the current sentence.

What Attention does is: **dynamically adjust each token's representation based on context.** Embedding assigns each token a "default identity." Attention lets them communicate with each other and then adjust according to context. Without Attention, every word lives in its own world, unaware of its neighbors.

For each position in the sequence, Attention answers one question: **Who should I pay attention to, and how much?**

Mathematically, it transforms each vector into three roles:

- **Q (Query)**: What am I looking for
- **K (Key)**: What can I offer
- **V (Value)**: My actual content

Then a single formula handles matching and aggregation:

{% raw %}
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
{% endraw %}

{% raw %}$QK^T${% endraw %} computes the relevance score between every pair of positions. {% raw %}$\sqrt{d_k}${% endraw %} is a scaling factor that prevents dot products from growing too large, which would push softmax outputs toward one-hot (vanishing gradients). Softmax normalizes the scores into weights, which are then used to compute a weighted sum over V.

In one sentence: **Attention is a learnable, dynamic weighted sum.**

Multi-Head Attention runs multiple such operations in parallel. Each head learns a different attention pattern -- some focus on syntactic dependencies, some on semantic similarity, some on positional distance. The results from all heads are concatenated and passed through a linear transformation.

## FFN: The Knowledge Store

Inside each Transformer block, right after Attention, there's a Feed-Forward Network (FFN):

{% raw %}
$$\text{FFN}(x) = W_2 \cdot \text{ReLU}(W_1 \cdot x + b_1) + b_2$$
{% endraw %}

Two fully connected layers with an activation function in between. Looks unremarkable, but recent Mechanistic Interpretability research has revealed an interesting division of labor:

**Attention handles information routing -- deciding where to pull information from. FFN handles knowledge storage -- the "facts" the model has memorized are largely encoded in FFN parameters.**

This means when you ask an LLM "What is the capital of France?", Attention connects "France" and "capital," while FFN "recalls" "Paris" from its parameters.

## Training Objective: Almost Too Simple

The entire training process has a single objective: **Next Token Prediction.**

Given the first n tokens, predict the n+1th. Compute the cross-entropy loss between the predicted probability distribution and the ground truth, backpropagate, update parameters.

{% raw %}
$$\mathcal{L} = -\sum_{t=1}^{T} \log P(x_t | x_1, x_2, \ldots, x_{t-1})$$
{% endraw %}

{% raw %}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 670" width="100%" style="max-width:720px" font-family="system-ui, -apple-system, sans-serif">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#555"/>
    </marker>
    <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#c0392b"/>
    </marker>
  </defs>

  <!-- ===== Vocabulary ===== -->
  <rect x="28" y="52" width="130" height="130" rx="8" fill="#f0f4ff" stroke="#4a6fa5" stroke-width="1.5"/>
  <text x="93" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#4a6fa5">Vocab V</text>
  <text x="44" y="92" font-size="11" fill="#555">0 → "the"</text>
  <text x="44" y="108" font-size="11" fill="#555">1 → "apple"</text>
  <text x="44" y="124" font-size="11" fill="#555">2 → "sat"</text>
  <text x="44" y="140" font-size="11" fill="#555">3 → "cat"</text>
  <text x="44" y="158" font-size="11" fill="#999">… 50,000 tokens</text>
  <text x="93" y="176" text-anchor="middle" font-size="10" fill="#888">built by tokenizer</text>

  <!-- Arrow: Vocab → Embedding -->
  <text x="93" y="208" text-anchor="middle" font-size="12" fill="#333">"apple" → id=1</text>
  <line x1="93" y1="215" x2="93" y2="248" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Embedding Table ===== -->
  <rect x="18" y="252" width="150" height="120" rx="8" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="93" y="272" text-anchor="middle" font-size="13" font-weight="bold" fill="#2e7d32">Embedding Table</text>
  <text x="93" y="290" text-anchor="middle" font-size="10" fill="#888">|V| × d matrix (learnable)</text>
  <text x="34" y="310" font-size="10" fill="#555" font-family="monospace">0: [0.12, -0.45, ...]</text>
  <text x="34" y="326" font-size="10" fill="#e65100" font-weight="bold" font-family="monospace">1: [0.83, 0.21, ...]</text>
  <text x="34" y="342" font-size="10" fill="#555" font-family="monospace">2: [-0.31, 0.67, ...]</text>
  <text x="34" y="358" font-size="10" fill="#999" font-family="monospace">…</text>

  <!-- Arrow: Embedding → token vector x -->
  <line x1="168" y1="312" x2="218" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Token Vector x ===== -->
  <rect x="220" y="284" width="120" height="56" rx="8" fill="#fff8e1" stroke="#f57f17" stroke-width="1.5"/>
  <text x="280" y="306" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">Vector x</text>
  <text x="280" y="324" text-anchor="middle" font-size="10" fill="#888">[0.83, 0.21, …] d dims</text>
  <text x="280" y="336" text-anchor="middle" font-size="9" fill="#aaa">static, context-free</text>

  <!-- Arrow: x → Q/K/V Projection -->
  <line x1="340" y1="312" x2="410" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Q/K/V Weight Matrices ===== -->
  <rect x="412" y="230" width="180" height="166" rx="8" fill="#fff3e0" stroke="#e65100" stroke-width="1.5"/>
  <text x="502" y="252" text-anchor="middle" font-size="13" font-weight="bold" fill="#e65100">Linear Projection (learnable)</text>

  <rect x="424" y="262" width="156" height="34" rx="5" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
  <text x="502" y="276" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">W_Q</text>
  <text x="502" y="290" text-anchor="middle" font-size="9" fill="#888">d × d_k → Q = "what I seek"</text>

  <rect x="424" y="302" width="156" height="34" rx="5" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
  <text x="502" y="316" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">W_K</text>
  <text x="502" y="330" text-anchor="middle" font-size="9" fill="#888">d × d_k → K = "what I offer"</text>

  <rect x="424" y="342" width="156" height="34" rx="5" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
  <text x="502" y="356" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">W_V</text>
  <text x="502" y="370" text-anchor="middle" font-size="9" fill="#888">d × d_k → V = "actual content"</text>

  <text x="502" y="392" text-anchor="middle" font-size="9" fill="#999">randomly initialized, updated by gradient</text>

  <!-- Arrow: Q/K/V → Attention -->
  <line x1="592" y1="312" x2="642" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Attention ===== -->
  <rect x="644" y="274" width="130" height="76" rx="8" fill="#fce4ec" stroke="#c62828" stroke-width="1.5"/>
  <text x="709" y="298" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">Attention</text>
  <text x="709" y="316" text-anchor="middle" font-size="10" fill="#888">softmax(QK^T/sqrt(d))·V</text>
  <text x="709" y="332" text-anchor="middle" font-size="10" fill="#888">context fusion</text>
  <text x="709" y="346" text-anchor="middle" font-size="9" fill="#aaa">"apple" → fruit or company?</text>

  <!-- Arrow: Attention → FFN -->
  <line x1="774" y1="312" x2="814" y2="312" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== FFN ===== -->
  <rect x="816" y="284" width="110" height="56" rx="8" fill="#e8eaf6" stroke="#283593" stroke-width="1.5"/>
  <text x="871" y="308" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">FFN</text>
  <text x="871" y="326" text-anchor="middle" font-size="10" fill="#888">knowledge store</text>

  <!-- ×N layers bracket -->
  <rect x="634" y="264" width="302" height="96" rx="12" fill="none" stroke="#bbb" stroke-width="1" stroke-dasharray="5,4"/>
  <text x="785" y="376" text-anchor="middle" font-size="11" fill="#999" font-style="italic">× N layers (12 ~ 96)</text>

  <!-- Arrow: FFN → Output -->
  <line x1="871" y1="340" x2="871" y2="410" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- ===== Output Layer ===== -->
  <rect x="801" y="412" width="140" height="50" rx="8" fill="#f3e5f5" stroke="#6a1b9a" stroke-width="1.5"/>
  <text x="871" y="434" text-anchor="middle" font-size="13" fill="#333">Output Layer</text>
  <text x="871" y="450" text-anchor="middle" font-size="10" fill="#888">→ vocab probability dist.</text>

  <!-- Arrow down -->
  <line x1="871" y1="462" x2="871" y2="498" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Prediction -->
  <rect x="811" y="500" width="120" height="40" rx="8" fill="#e0f7fa" stroke="#00695c" stroke-width="1.5"/>
  <text x="871" y="518" text-anchor="middle" font-size="12" fill="#333">Predict: "sat"</text>
  <text x="871" y="533" text-anchor="middle" font-size="10" fill="#888">P("sat")=0.72</text>

  <!-- Arrow: prediction → loss -->
  <line x1="811" y1="520" x2="700" y2="520" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Ground truth -->
  <rect x="560" y="555" width="120" height="32" rx="6" fill="#f5f5f5" stroke="#999" stroke-width="1"/>
  <text x="620" y="576" text-anchor="middle" font-size="11" fill="#666">Ground truth: "sat"</text>
  <line x1="620" y1="555" x2="620" y2="540" stroke="#555" stroke-width="1" marker-end="url(#arrow)"/>

  <!-- Loss -->
  <rect x="570" y="500" width="120" height="40" rx="8" fill="#ffebee" stroke="#c62828" stroke-width="1.5"/>
  <text x="630" y="518" text-anchor="middle" font-size="13" font-weight="bold" fill="#c62828">Compute Loss</text>
  <text x="630" y="533" text-anchor="middle" font-size="10" fill="#c62828">cross-entropy</text>

  <!-- Arrow: loss → backprop -->
  <line x1="570" y1="520" x2="460" y2="520" stroke="#c0392b" stroke-width="1.5" marker-end="url(#arrow-red)"/>

  <!-- Backprop -->
  <rect x="240" y="500" width="220" height="40" rx="8" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="350" y="518" text-anchor="middle" font-size="12" font-weight="bold" fill="#c62828">Backprop → update all params θ</text>
  <text x="350" y="533" text-anchor="middle" font-size="9" fill="#c62828">Embedding · W_Q · W_K · W_V · W_FFN ...</text>

  <!-- Backprop arrows back to learnable components -->
  <line x1="300" y1="500" x2="135" y2="375" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrow-red)"/>
  <line x1="420" y1="500" x2="502" y2="398" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrow-red)"/>

  <!-- Params theta label -->
  <rect x="28" y="416" width="184" height="50" rx="6" fill="#fff" stroke="#c0392b" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="120" y="436" text-anchor="middle" font-size="11" fill="#c62828" font-weight="bold">Params θ = all learnable weights</text>
  <text x="120" y="452" text-anchor="middle" font-size="9" fill="#c62828">Training = tuning θ so f_θ(X)≈Y</text>

  <!-- Legend (centered) -->
  <g transform="translate(220, 640)">
    <line x1="0" y1="0" x2="30" y2="0" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="38" y="4" font-size="11" fill="#666">Forward pass</text>
    <line x1="130" y1="0" x2="160" y2="0" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrow-red)"/>
    <text x="168" y="4" font-size="11" fill="#c0392b">Backpropagation</text>
    <rect x="270" y="-8" width="14" height="14" rx="3" fill="#ffe0b2" stroke="#e65100" stroke-width="1"/>
    <text x="292" y="4" font-size="11" fill="#666">Learnable params</text>
    <rect x="390" y="-8" width="14" height="14" rx="3" fill="#f0f4ff" stroke="#4a6fa5" stroke-width="1"/>
    <text x="412" y="4" font-size="11" fill="#666">Fixed components</text>
  </g>
</svg>
{% endraw %}

That's the only objective. Nobody teaches it grammar, logic, or how to write code. Yet when the model is large enough and the data abundant enough, these capabilities "emerge."

Why? Because to accurately predict the next token, you must understand context. To understand context, you implicitly learn grammar, semantics, logic, common sense, and even world knowledge. **Predicting the next word is the ultimate compression of language understanding.**

## So What Is "Intelligence"?

Back to the opening thesis: an LLM is a function.

{% raw %}
$$f_\theta: \text{Token}^n \rightarrow \mathbb{R}^{|V|}$$
{% endraw %}

Billions to hundreds of billions of parameters {% raw %}$\theta${% endraw %}, trained on massive data, mapping token sequences to probability distributions over the vocabulary. A single forward pass, pure matrix operations, no side effects, deterministic output.

What about conversation? It's just autoregressive invocation of this function -- append the previous output to the input and call it again. Temperature and Top-p sampling introduce randomness, but that's an inference-stage engineering choice, not a property of the model itself.

This isn't diminishing LLMs. Quite the opposite. **The fact that a system "merely" doing function approximation can exhibit behavior that looks like reasoning, like creativity, like understanding -- that is what's truly awe-inspiring.**

Conway's Game of Life is also a function -- a few simple rules that evolve into infinitely complex patterns. LLMs are similar: a simple training objective, through a sufficiently large parameter space and enough data, gives rise to capabilities that exceed intuition.

## The Value of Demystification

Understanding "LLMs are functions" has practical value.

It lets you stop treating LLM errors as "AI is unreliable" and instead understand them as the function's poor fit in certain input regions. It helps you see what Prompt Engineering actually does -- adjusting the input vector's position in high-dimensional space so it lands in a region where the function fits well. It helps you understand why the Context Window has a limit -- it's not just a technical constraint, but a consequence of Attention's $O(n^2)$ computational complexity.

**No need for reverence. No need for fear. What's needed is understanding.** When you know what's under the hood, you can push it to its limits.
