---
title: "Graphite: Code Is Context"
date: 2026-05-11 20:00:00
categories:
  - Harness Engineering
tags:
  - Graphite
  - AI
  - Agent
  - MCP
  - Bytecode
  - Static Analysis
lang: en
i18n_key: graphite-agent-bytecode-context
---

Many people assume that making an Agent understand code means giving it more source code: a bigger context window, better embeddings, smarter RAG, and a finer AST index. I almost believed that too.

Until I asked an Agent to clean up AB experiment code: it quickly found a bunch of call sites, then said, "Done." The real question was not whether the Agent could read code, but how I could prove it had not missed the 201st call site. For an Agent, context should not just be source text; **code itself should become context that an Agent can query, verify, and reason about.** Graphite is built for exactly this problem.

<!-- more -->

## Source Code Is Not the Truth of a Program

Most "code understanding" tools today still stop at the source level. Tree-sitter parses source code into an AST. Language Servers provide symbols, references, and definitions. Embeddings turn code blocks into vectors. RAG then stuffs the relevant snippets back into the context window. All of this is useful, but it answers "what does the code look like?", not "how does the program run?"

Those are very different questions. Take a simple example: AB experiment IDs are rarely written directly at the call site. An ID might first be defined as a constant, then assigned to a local variable. It might be imported from another module. It might be wrapped in a helper method and only later passed into the real AB SDK. In the source code, you might see:

```kotlin
abClient.getOption(EXPERIMENT_ID)
```

The AST can tell you that there is an identifier named `EXPERIMENT_ID`. But what is its value? It may live in another file, another module, or only reach the argument after several variable assignments. A human can trace that slowly, and an Agent can guess through it slowly, but guessed structure cannot be ground truth.

**Source code is written for humans. Bytecode is what the machine actually executes.**

If an Agent needs to understand a JVM system, it cannot stop at the syntax tree. It has to cross the compiler boundary and see the world after compilation.

## AST Is the Map, Bytecode Is the Terrain

Tree-sitter is good, but it is not static analysis. It can tell you that there is a function here, a call there, and an argument under some node. For editors, syntax highlighting, and local refactoring, that is enough; for Agentic Engineering, it is not. The Agent is not dealing with one file or one class. It is dealing with a long-lived business system.

In a ten-year-old JVM monorepo, the real logic often does not live on the surface of the source code. Experiment IDs may flow through constants. Constants may be defined in another module. Call sites may hide behind helper methods. The same AB SDK may be wrapped by several layers of business APIs. Spring endpoints may come from annotations on a parent class, Jackson field names may be hidden inside annotations, and enum values may have to be recovered from bytecode initialization logic. These are not problems you solve by adding a few more AST queries.

Of course you can ask the Agent to read more source code, but the context window is not magic. The more you read, the more tokens you spend, the more noise you introduce, and the more the conclusion sounds like "I think." **Agents do not lack reading ability. They lack verifiable structure.**

Graphite does something simple: it builds a program graph from compiled bytecode. Nodes are methods, fields, constants, call sites, arguments, and return values. Edges are call relationships, data flow, type relationships, control flow, and annotation relationships. In other words, Graphite turns "how the program is actually connected" into a graph that can be queried. That graph is not hallucinated by an LLM. It comes from compiler output.

## Agents Should Not Discover Structure by Themselves

When we ask Agents to work on code today, we are often betting on one sentence: "Read all these files and tell me what needs to change." That sounds natural, but it hides an assumption: the Agent has to discover the structure by itself. It has to decide who calls whom, where an argument comes from, whether an annotation is inherited, what the type hierarchy is, and whether a constant flows into the target API.

This is absurd. These questions should not be delegated to an LLM in the first place. LLMs are good at semantic reasoning; they are not the right tool for deterministic graph traversal. Asking an LLM to find call sites across millions of tokens is like asking a very smart person to scan a phone book by eye. It can be done. It just should not be.

Graphite creates a cleaner division of labor: the Agent asks the question, Graphite returns facts, and the Agent reasons over those facts. For example, if the Agent wants to know every experiment ID passed into `AbClient.getOption()`, it does not need to read 500 files. It can query the graph:

```cypher
MATCH (c:IntConstant)-[:DATAFLOW*]->(cs:CallSiteNode)
WHERE cs.callee_class = 'com.example.ab.AbClient'
  AND cs.callee_name = 'getOption'
RETURN c.value, cs.caller_class, cs.caller_name
```

The result is not "these might be relevant." The result is that these data-flow paths exist in the graph. That is the kind of context Agentic Engineering needs. **The LLM should not be responsible for discovering structure. It should be responsible for understanding the intent behind structure.**

## 6, or 19

Graphite started as a way to verify AB experiment cleanup. I began with the old tools: grep, AST queries, call-site search, and one more pattern after another. The answer was 6. The problem was not that these tools were useless. It was that pattern-based methods are incomplete by nature: rename a constant, pass an argument through one more layer, wrap the call in a helper, and the pattern breaks. Later, after building a graph from bytecode and tracing from constant nodes along data-flow edges into the target call sites, the number became 19. Not 6.

The extra cases were exactly the ones AST-level approaches tend to miss: local variable propagation, cross-module constants, and indirect calls inside conditional branches. That difference is critical. If you are only doing code search, missing a few spots may not matter. But if you ask an Agent to delete code, change interfaces, migrate frameworks, or clean up dead code automatically, one missed call site can become a production incident.

The more capable Agents become, the more determinism we need. That sounds counterintuitive: many people assume that as models get stronger, tools become less important. The opposite is true. The stronger the model, the more it needs reliable tools to ground its ability in facts. Without structured context like Graphite, the Agent's ceiling is "a smart intern who has read a lot of code." With it, the Agent becomes closer to an engineer who can query the truth of the system at any moment.

## After MCP, Graphite Becomes the Agent's Eyes

Graphite started as a CLI. You can build and query a graph like this:

```bash
brew tap johnsonlee/tap
brew install graphite graphite-explore

graphite build app.jar -o /data/app-graph --include com.example
graphite query /data/app-graph "MATCH (n:CallSiteNode) RETURN n LIMIT 10"
graphite-explore /data/app-graph --port 8080
```

That already solves many static analysis problems, but MCP is where it gets interesting. Expose Graphite through MCP to Claude Code or another Agent, and the Agent no longer needs to load the whole repository into its context window. It can ask the graph directly: which call sites reach this method? Which Controller owns this endpoint? Is this annotation inherited? Where does this constant eventually flow? Which subtypes does this type have? Why is this dead branch unreachable?

In the past, Agents answered these questions by reading source code, guessing structure, and stitching together context. Now they can query the graph. This is not just about saving tokens; it changes the way the work happens. The old code context was text. The next code context is a queryable program graph.

## This Is Not About Replacing Source Code

I do not want to overstate the claim. Graphite will not tell you why the business was designed this way. It will not automatically decide whether an experiment can be deleted. Bytecode can be precise, but it can only answer what structurally happens in the program. That is exactly its value: it does not take work away from the LLM, it removes the work the LLM should not be doing.

Source code still matters. PRs still need review. Business semantics still require humans and Agents to reason together. But before that, we should at least know the real structure of the system. Without that step, every attempt to make Agents "understand code" becomes a long, detailed description built from partial contact with the system. The description may get richer, but you still do not know whether it is complete.

## Start Where the Compiler Ends

The old software toolchain was designed around humans. IDEs help humans jump around, grep helps humans search, ASTs help humans refactor, and documentation helps humans understand. Once Agents enter the workflow, the toolchain has to change, because Agents should not read code the same way humans do. Humans read source because they cannot directly read program structure. Agents do not have that limitation. They can call tools, query graphs, and combine deterministic analysis with probabilistic reasoning.

That is what Graphite is trying to do. It is not another smarter grep. It is a map for Agents that is closer to real execution semantics. Source code is input. Bytecode is fact. A program graph is context the Agent can use. Do not stuff code into a context window. Turn code itself into context the Agent can query, verify, and reason about. That is what "Code Is Context" means.

If every Agent on an engineering team could query call graphs, data flow, type hierarchies, and annotation relationships in real time, then "understanding code" would be redefined. It would no longer mean how many files you have read. It would mean whether you can ask the right questions and get reliable answers. The tools are changing. The work is changing. Code context should change too. Are you still planning to stuff millions of tokens of source code into a context window?

> GitHub: https://github.com/johnsonlee/graphite
