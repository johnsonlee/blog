---
title: Why Do Computers Represent Text and Numbers Differently?
date: 2025-12-19 20:00:00
lang: en
i18n_key: why-computers-represent-text-and-numbers-differently
categories:
  - Computer Science
  - Programming
tags:
  - Programming
mathjax: true
---

I've been teaching my son programming from scratch. While explaining how computers represent text and numbers, he suddenly asked:

> Why do they need different representations? Aren't numbers just text too?

This seemingly naive question nearly stumped me.

Ever since learning C in college, we've taken "strings" and "numeric types" for granted, never pausing to ask "why." When I heard this question, I froze, realizing how opaque my own programming education had been. To give my son a more systematic understanding of how computers work under the hood, I had to restructure the entire knowledge framework.

## The Smallest Unit

### The Smallest Unit of Text

Rather than jumping straight into binary, I started from a different angle.

I asked him:
> If you break text and numbers down to their smallest pieces, what's left of each?

The smallest unit of text is -- a **symbol**.

For text, the smallest unit is a character.
- 'A' is a symbol
- 'B' is a symbol
- '?' is also a symbol

A character carries no inherent concept of "quantity." It's simply something humans have assigned meaning to. All the computer does is map these symbols to codes and store them as-is.

There's no natural mathematical relationship between characters.

### The Smallest Unit of Numbers

Numbers are different.

The smallest unit of a number isn't a "symbol" -- it's a **value**.

When we write 123, we aren't writing three symbols; we're expressing a quantity. This quantity can be decomposed, computed, and combined.

In a string of symbols, each symbol's position has no direct bearing on how the overall text is represented. But in a number, each digit's position itself carries information.

In decimal:
- 3 in the ones place means 3
- 3 in the tens place means 30
- 3 in the hundreds place means 300

The same symbol means completely different things depending on its position.

This is the concept of Place Value -- a profoundly deep abstraction: it means information exists not only in the symbol itself, but also in its position.

And Place Value is a fundamental component of the [Positional Numeral System](https://en.wikipedia.org/wiki/Positional_notation).

## Positional Numeral System

From primary school through university, no textbook ever mentioned this concept. It wasn't until I was preparing materials for my son that I realized how critical it is -- important enough to deserve the first chapter in any programming introduction.

When "symbol + position" jointly determine a number's magnitude, we've entered the Positional Numeral System.

The decimal system we use daily is a positional numeral system:

$$
(123)_{10} = 1 \times 10^{2} + 2 \times 10^{1} + 3 \times 10^{0}
$$

Each digit's "value" depends on:
- Its own **symbol**
- Its **position**

The same applies to binary:

$$
(1011)_{2} = 1 \times 2^{3} + 0 \times 2^{2} + 1 \times 2^{1} + 1 \times 2^{0}
$$

The only differences are:
- How many **symbols** are used
- What **weight** each position carries

Computers chose binary not because it's "advanced," but as a natural mathematical choice:
- Two states -> perfectly matches the physical states of electronic circuits (on/off, high/low voltage), enabling high reliability and stability
- Positional system -> simple arithmetic rules, maximum scalability

## Digitizing Symbols

Characters have no inherent notion of "size" or "quantity."

The letter A is not "1 less than B," and there's no natural mathematical ordering among characters.

So we did something very engineering-minded -- we assigned codes to characters.
- ASCII: A = 65
- Unicode: U+4E2D (for the Chinese character meaning "middle")

Here's the key point:

Text in a computer is "mapped onto numbers."

In other words:
- Numbers -> inherently numeric
- Text -> artificially encoded as numbers

Although both are represented as 0s and 1s at the bottom, their origins are completely different.

## Text vs. Numbers

If you treat "123" as text:
- You can concatenate: "123" + "4" = "1234"
- But you can't compute directly

If you treat 123 as a number:
- You can compute: 123 + 4 = 127
- But it no longer "means" characters

## Why Not Treat Everything the Same?

My son followed up:

> Why not just treat everything as text?

A natural thought, but the answer is straightforward:

> Because that would make computation extremely inefficient, or even impossible.

The significance of the Positional Numeral System isn't that it "can represent" -- it's that it "can compute."
- Addition, multiplication, comparison
- Overflow, precision, sign bits

These capabilities are natively supported by the Positional Numeral System.

Text can only "simulate" these behaviors through layer upon layer of interpretation.

## Conclusion

Looking back at how we traditionally learn programming, the sequence is almost chaotic -- completely unsystematic.

We typically start with binary, variables, types, and syntax, implicitly assuming students "just know" what numbers are, what text is, and how computation happens. Many concepts end up being memorized by rote. But once you truly understand the Positional Numeral System -- the origin of all numerical abstraction -- everything suddenly clicks into place.
