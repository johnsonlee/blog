---
title: How to Write Elegant Code
categories:
  - Career
tags:
  - Android
  - iOS
  - Java
  - Kotlin
date: 2021-05-06 00:00:00
lang: en
i18n_key: how-to-write-elegant-code
---

I recently reviewed code from several colleagues. The logic was mostly sound, but the code itself felt far from elegant -- simple operations wrapped in unnecessary convolutions. For architects, the goal isn't to design something so complex that nobody can understand it. Truly great architects produce designs that are remarkably easy to follow. Simplicity is the ultimate sophistication. Designing a complex architecture to solve a complex problem isn't the most impressive feat -- solving a complex problem with a simple architecture is. The same principle applies to coding. So what exactly makes code "elegant"?

## Code Complexity

Code elegance isn't purely subjective -- it can be measured scientifically. The standard metric is Cyclomatic Complexity, a concept introduced by [Thomas J. McCabe, Sr.](https://en.wikipedia.org/w/index.php?title=Thomas_J._McCabe,_Sr.) in 1976. Cyclomatic complexity is calculated from a program's control-flow graph and equals the number of linearly independent paths through the code. In plain terms: the more branches and conditions (`for`, `if-else`, `try-catch`, `&&`, `||`, ...) your code has, the more complex it is. A program's complexity can be defined by this formula:

```
M = E - N + 2P
```

- `M` - complexity
- `E` - number of edges in the control-flow graph
- `N` - number of nodes in the control-flow graph
- `P` - number of connected components (see the definition in [graph theory](https://en.wikipedia.org/wiki/Component_(graph_theory)))

> Reference: https://en.wikipedia.org/wiki/Cyclomatic_complexity

Simplified and translated into code:

```kotlin
class CyclomaticComplexityVisitor : ASTVisitor {

    var cyclomatic = 1

    override fun visit(node: CatchClause) {
        cyclomatic++
    }

    override fun visit(node: ConditionalExpression) {
        cyclomatic++
    }

    override fun visit(node: InfixExpression) {
        cyclomatic++
    }

    override fun visit(node: DoStatement) {
        cyclomatic++
    }

    override fun visit(node: ForStatement) {
        cyclomatic++
    }

    override fun visit(node: IfStatement) {
        cyclomatic++
    }

    override fun visit(node: SwitchCase) {
        cyclomatic++
    }

    override fun visit(node: WhileStatement) {
        cyclomatic++
    }
}
```

> Full source code: [CyclomaticComplexityVisitor](https://github.com/johnsonlee/architecture-evaluation-tool/blob/master/de.cau.cs.se.software.evaluation/src/de/cau/cs/se/software/evaluation/transformation/CyclomaticComplexityVisitor.xtend)

How do you effectively reduce code complexity? The most direct approaches are:

1. Break large methods into smaller ones to reduce the complexity of each individual method
1. Leverage language features to refactor and distill repetitive logic

## Language Features

One of the most important ways to reduce complexity is to use the language's own features to simplify code. To write great code, you need to master the language. Java, for instance, has added new features in nearly every major release from *JDK 1.0* through *Java 17*. The same goes for Kotlin, which makes it even easier to write concise and elegant code -- that's why *SonarQube* defaults to a complexity threshold of *15* for Kotlin versus *30* for Java.

Java 8 introduced *Lambda* expressions, method references, field references, and the *Stream API*, all of which make code more concise and clear. Kotlin offers [Delegation](https://kotlinlang.org/docs/delegation.html), [Scope Functions](https://kotlinlang.org/docs/scope-functions.html) (`let`, `also`, `apply`, `run`, `with`, `takeIf`, `takeUnless`), [Local Functions](https://kotlinlang.org/docs/functions.html#local-functions), the `?:` operator, and many useful extension functions (`lazy`, `use`, `withDefault`), among others.

> For Java language features, see [Java New Features by Version](../../07/java-new-features/).
> For Kotlin language features, see [KEEP (Kotlin Evolution and Enhancement Process)](https://github.com/Kotlin/KEEP).

Of course, don't sacrifice readability just to make code shorter. Showing off obscure features that hurt clarity defeats the purpose. See also: [Rethinking Kotlin](../../../../2020/03/24/reunderstanding-kotlin/)

## Code Readability

Code isn't just for compilers -- it's primarily for humans. Most serious commercial projects involve one or more teams collaborating, and open-source projects may be read by thousands of developers. Obscure, hard-to-follow code increases communication and comprehension costs, dragging down the entire team's productivity. You might say, "I'm the only developer, as long as I can read it." Fair enough on the surface, but human memory has an expiration date -- the forgetting curve is real. Three months later, you may find yourself staring at your own code, struggling to reconstruct the logic, wondering why on earth you wrote it that way.

Readability encompasses several dimensions:

1. Code style
    Every team should have a unified *Code Style* along with formatting configurations or tools to help enforce consistency.
1. Naming conventions
    Naming is one of the most painful challenges every developer faces. Since most programming languages use English, choosing meaningful names genuinely tests your English proficiency. When in doubt, use [Google Translate](https://translate.google.com).
1. Comments
    For code that will be published or released, APIs must be well-documented, especially for complex logic. If you can include text-based design diagrams (such as [draw.io](https://app.diagrams.net/)), even better.
1. Use well-known architectural patterns
    Industry-standard patterns cover the vast majority of software architecture needs: [Service Locator Pattern](https://en.wikipedia.org/wiki/Service_locator_pattern), [Dependency Injection Pattern](https://en.wikipedia.org/wiki/Dependency_injection), [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns), and so on. Well-known patterns are easier for other readers to understand because they've already become industry consensus.

## Unit Tests

You might ask: aren't unit tests for quality assurance? What do they have to do with elegance? Code elegance can be both an objective metric and a subjective impression. I've seen many *Library/SDK* developers submit *Pull Requests* immediately after implementation -- the better ones include a high-level design doc, the worse ones don't even have a proper README. In practice, many *Code Reviewers* aren't directly involved in a project's design and development, so they lack context. Without *Unit Tests*, readers spend significant time tracing the designer's intent and finding entry points. If every public *API* has unit test cases, readers can quickly understand how the *Library/SDK* is used and grasp the overall architecture's workflow, rather than getting lost in implementation details.

## The KISS Principle

KISS (Keep it Simple & Stupid) is inversely proportional to code complexity. Simpler code means lower complexity. Keep your code straightforward -- don't make readers overthink, and certainly don't make users overthink. Ideally, provide a clear README with a *Getting Started* section and a sample project so users can get a demo running in minutes. This is partly why students tend to dislike *Java* (they prefer scripting languages like *Python*): just setting up the environment is a hassle, and running a Hello World requires `javac` followed by `java` on the `.class` file. That's exactly why *Java 9* introduced [The Java Shell](../../07/java-9-new-features/#The-Java-Shell).

## Less Is More

More features isn't always better. Focus on the most pressing problem and strip away everything non-essential.

## [Worse Is Better](https://www.dreamsongs.com/RiseOfWorseIsBetter.html)

In the real world, nearly all software development faces time and resource constraints. It's virtually impossible to have both in abundance. To achieve sustainable delivery, the typical approach is to satisfy 80% of requirements first, get users started -- even if the result isn't perfect -- and then refine the remaining 20% in subsequent iterations.
