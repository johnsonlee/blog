---
title: "Why Is Multiplying or Dividing by Powers of 10 Almost Effortless?"
lang: en
i18n_key: positional-numeral-system-and-radix-shift
categories:
  - Computer Science
  - Programming
tags:
  - Programming
date: 2025-12-20 10:00:00
mathjax: true
---

While helping my son with homework over the weekend, I noticed he could do 450 / 10 almost without thinking, but the moment he hit 450 / 6, his brow furrowed. It made me suddenly aware of something we all take for granted yet rarely think about:
> Why is multiplying or dividing by powers of 10 nearly effortless, while any other number feels so much harder?

Combining this with the exploration of [Positional Numeral System](https://en.wikipedia.org/wiki/Positional_notation) my son and I had done recently, it clicked -- this is just a shift operation in base 10!

## Why Does Multiplying/Dividing by 10 Require No Thought?

Consider an operation we've known since childhood:

```
45 x 10 = 450
450 / 10 = 45
```

What are you actually doing?

You're not computing:

```
45 x 10 = 10 + 10 + 10 ...
```

What you're doing is shifting every digit one position to the left or right.

This isn't "calculation" -- it's positional rearrangement.

It's just that our elementary education never mentions the word "shift." Teachers simply tell you:
- Multiplying by 10 means appending one 0
- Multiplying by 100 means appending two 0s
- Multiplying by 1000 means appending three 0s
- And so on...

## Is the Shift Really Not a Coincidence?

If you're still skeptical, let's prove mathematically that this is no coincidence.

In base 10, a number can be expressed as:

$$
\begin{align}
12345 &= 1 \times 10^4 + 2 \times 10^3 + 3 \times 10^2 + 4 \times 10^1 + 5 \times 10^0 \\\\
      &= 10,000 + 2,000 + 300 + 40 + 5
\end{align}
$$

Multiply both sides by $10^3$:

$$
\begin{align}
12345 &= (1 \times 10^4 + 2 \times 10^3 + 3 \times 10^2 + 4 \times 10^1 + 5 \times 10^0) \times 10^3 \\\\
      &= 1 \times 10^7 + 2 \times 10^6 + 3 \times 10^5 + 4 \times 10^4 + 5 \times 10^3 \\\\
      &= 10,000,000 + 2,000,000 + 300,000 + 40,000 + 5,000
\end{align}
$$

Using Place Value, we can compare how each digit's place value changes before and after multiplying by $10^3$:

Place | Before x10 | After x10
:----:|----------:|---------:
Ten-thousands | 10,000 | 10,000,000
Thousands | 2,000 | 2,000,000
Hundreds | 300 | 300,000
Tens | 40 | 40,000
Ones | 5 | 5,000

Clearly, every digit has shifted 3 positions to the left.

## Shifting Isn't Exclusive to Binary

For anyone who's studied programming, the word "shift" immediately brings to mind:

- `<<` -- left shift
- `>>` -- right shift

In binary, multiplying or dividing by powers of 2 is often written as a shift operation. For example, computing the horizontal center of a rectangle:

```java
int centerX = width >> 2;
```

In base 2, "shifting right by 1" is equivalent to "dividing by $2^1$":

```java
int centerX = width / 2;
```

And "shifting right by 2" is equivalent to "dividing by $2^2$."

Notice a pattern emerging:

- In base 10, multiplying/dividing by powers of 10 is equivalent to a shift operation
- In base 2, multiplying/dividing by powers of 2 is equivalent to a shift operation

So the question becomes:

> Can we generalize this to any base? That is:
>
> **"Multiplying by the radix to the nth power"** is equivalent to **"shifting left by n positions"**
> **"Dividing by the radix to the nth power"** is equivalent to **"shifting right by n positions"**

## Radix Shift

Yes, this holds in any positional numeral system. It's an important corollary of the [Positional Numeral System](https://en.wikipedia.org/wiki/Positional_notation) -- Radix Shift.

The concept has never been taught in isolation. Instead, it shows up scattered across different contexts:

- Elementary arithmetic: packaged as a "trick" rather than a structural property
- Computer science: rebranded as "bitwise shift"
- Signal processing: renamed "scaling"
- IEEE 754: given yet another name -- "exponent"

## So Why Are "Other Numbers" So Hard?

Because when the multiplier or divisor isn't the radix, you can't just "move positions." You have to fall back to:
* Distributive multiplication
* Additive accumulation

These are arithmetic-level computations, not structural transformations.

In other words, in any base:

- Multiplying/dividing by the radix -> operating on the **representation**
- Multiplying/dividing by anything else -> operating on the **value itself**

The former is a structural transformation; the latter is mere numerical calculation.
