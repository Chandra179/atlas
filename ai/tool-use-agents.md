---
title: "Tool Use & AI Agents"
aliases: []
tags: [ml, ai]
created: "2026-06-16"
---

# Tool Use & AI Agents

> **Before reading**: you should understand Transformers, prompting, and the LLM era — all covered in [Machine Learning](ml.md). [Fine-tuning](fine-tuning.md) and [RAG](../rag.md) are helpful context but not required.

You ask an LLM a question, it answers. But ask it to book a flight, and it can only apologize: "I can't do that, but here's how you might..."

The missing piece: the model needs to take action in the world. It needs to call APIs, query databases, read files, send emails. This is tool use — and it's the fundamental building block of AI agents.

## Tool Use (Function Calling)

Tool use lets an LLM output structured calls instead of text. The model receives a list of available tools (names, descriptions, parameter schemas) and decides whether to call one.

The loop:
1. You send a prompt + tool definitions to the model.
2. The model either responds with text or outputs a structured tool call: `{"name": "search_flights", "parameters": {"from": "SFO", "to": "JFK", "date": "2025-04-01"}}`.
3. Your code executes the tool and feeds the result back to the model.
4. The model incorporates the result into its next response.

This is not the model executing code. The model only *requests* that a tool be called. Your application is the executor. The model is the decision-maker.

**Tool definition format (OpenAI-style)**:
```json
{
  "name": "search_knowledge_base",
  "description": "Search internal documentation. Use when the user asks about company policies or product details.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "description": "Natural language search query"},
      "max_results": {"type": "integer", "description": "Max results to return", "default": 5}
    },
    "required": ["query"]
  }
}
```

The description text is critical — it's the model's only guide to when and how to use the tool. Write descriptions that specify what the tool does and when to invoke it. A tool with a vague description will be called incorrectly or not at all.

## The ReAct Pattern

ReAct (Reasoning + Acting) interleaves thought steps with tool calls:

```
Thought: I need to find out the weather in the user's city before recommending an activity.
Action: get_location("user_id")
Observation: {"city": "San Francisco", "lat": 37.77, "lon": -122.42}

Thought: Got the location. Now check today's weather.
Action: get_weather(37.77, -122.42)
Observation: {"temp": 72, "condition": "sunny", "wind_mph": 5}

Thought: Sunny and 72F. Good conditions for outdoor activities. I'll recommend a walk and a picnic.
Answer: It's sunny and 72F in San Francisco today — perfect for outdoor activities. I'd recommend a walk through Golden Gate Park followed by a picnic at Dolores Park.
```

ReAct is the foundation of agentic behavior. The model reasons about what it knows and doesn't know, decides what information it needs, acts to get it, observes the result, and reasons again. This generates a chain of reasoning that's both more accurate and more interpretable than pure generation.

**When ReAct beats pure generation**: tasks requiring multi-step information gathering, tasks where the model must disambiguate user intent, tasks with stateful side effects (database updates, API mutations).

**When pure generation beats ReAct**: simple factual questions, creative writing, tasks with no external dependencies. ReAct adds latency and token cost — don't use it when a single generation suffices.

## Planning

Agents need to decompose complex goals into sequences of actions:

1. **Goal**: "Send a weekly summary of project progress to stakeholders."
2. **Plan**: (a) Query JIRA for issues updated this week → (b) Query Git for merged PRs → (c) Synthesize findings into a summary → (d) Send email to stakeholders list.
3. **Execute**: Run each step, feeding results forward.

Planning fails when the plan itself is wrong. Recovery: after each step, re-evaluate whether the remaining plan still makes sense. If step (b) returns no PRs (unusual — maybe the Git API token expired), the agent should recognize this anomaly and ask the user, not proceed with an empty summary.

**Failures to handle**:
- Tool returns an error → retry with corrected parameters, re-plan if repeated.
- Tool times out → skip non-critical tool, escalate to user if critical.
- Tool returns unexpected data → re-evaluate plan assumptions.
- Model hallucinates tool outputs → detect via output validation (was the tool actually called?).

## Memory

Agents operate across multiple turns and tool calls. They need memory:

**Short-term memory** — The conversation history. All messages, tool calls, and tool results are concatenated into the context window. This is the working memory of the agent. Limits: the context window has a finite size, and very long conversations degrade model attention quality ("lost in the middle" problem).

**Long-term memory** — Information persisted across sessions. Typically a vector database storing embeddings of past interactions, facts about the user, or knowledge the agent has discovered. On each turn: embed the current query, retrieve relevant past memories, inject them into the context window.

**Working memory (scratchpad)** — Internal state the agent maintains during planning. A running to-do list: "Step 1: ✓ done. Step 2: in progress. Step 3: blocked on user input." This prevents the agent from losing track of where it is in a multi-step plan.

## Multi-Agent Systems

Instead of one agent doing everything, assign specialized agents to subtasks:

**Orchestrator → Specialists** — A coordinator agent receives the user request, decomposes it, and delegates to specialists (research agent, writing agent, code-review agent). The orchestrator synthesizes results into a final response.

**Debate** — Two agents argue opposing positions. A judge agent evaluates arguments and produces a decision. Improves reasoning on ambiguous or controversial questions at the cost of 3–5× token consumption.

**Critique → Revise** — A generator agent produces an output, a critic agent reviews it for errors, the generator revises. Iterate until the critic approves or a max-round limit is reached. Common in code generation: write code → lint → fix → re-lint → approve.

**When multi-agent helps**:
- Task requires diverse expertise (coding + writing + design).
- Independent verification improves quality (critic pattern).
- Parallel execution reduces wall-clock time (research multiple sources simultaneously).

**When it hurts**: when the task is simple and a single model can handle it. Multi-agent systems add latency, token cost, and coordination failure modes. Start with one agent; add more only when the single agent demonstrably fails.

## Frameworks

| Framework | Approach | Strengths | Weaknesses |
|-----------|----------|-----------|------------|
| **LangChain** | Chain and agent abstractions | Large ecosystem, many integrations | Abstractions obscure model behavior, hard to debug |
| **AutoGen (Microsoft)** | Multi-agent conversations | Good for multi-agent, human-in-the-loop | Complex setup, overkill for simple agents |
| **CrewAI** | Role-based agents | Intuitive role/task definitions | Newer, smaller community |
| **MCP (Anthropic)** | Model Context Protocol — standard interface for tools/resources | Open standard, tool-agnostic | Still maturing, fewer tool implementations |
| **Direct API** | Write the loop yourself | Full control, no abstraction magic | More boilerplate, easier to mess up |

The simplest reliable agent is one you write yourself: a loop that calls the LLM API, checks the response for tool calls, executes them, feeds results back, and repeats until the model produces a text response. This is 50 lines of code and completely transparent. Only reach for a framework when this loop becomes unmanageable.

## Failure Modes

Tool-using agents fail in ways that text-only models don't:

**Hallucinated tool calls** — The model invents a tool name or parameter schema. Mitigation: validate all tool calls against your tool definitions before executing. If the model calls `send_email` with a JSON structure you didn't define, reject it and return an error message to the model.

**Infinite loops** — The agent calls a tool, doesn't like the result, calls it again with slightly different parameters, ad infinitum. Mitigation: hard limit on tool calls per turn (e.g., 10). If the model hasn't produced a text response by the limit, force it to summarize what it knows.

**Permission escalation** — The user asks the agent to "delete old files" and the agent calls `rm -rf /`. Mitigation: every tool should have a permission boundary. Human-in-the-loop for destructive operations. Read-only tools by default; write operations require explicit user confirmation.

**Cost spirals** — Complex agent traces consume 10–100× more tokens than a single generation. A single "research this topic" request with ReAct + multiple search tool calls can burn $0.50–$2.00 in API costs. Monitor token usage per session and set budgets.

**Context window overflow** — Tool call history accumulates and exceeds the context window. Mitigation: summarize older interactions, truncate tool results to relevant excerpts, prune stale branches of reasoning.

## Observability

When an agent fails, you need to see what happened:

- **Trace every decision**: each step records (a) what the model thought, (b) what tool it called, (c) what the tool returned.
- **Token accounting**: how many tokens each step consumed, total session cost.
- **Tool call success rate**: which tools fail and why (timeout, auth error, bad parameters).
- **Session-level metrics**: completion rate, avg steps per session, user feedback score.

Use OpenTelemetry or LangSmith for tracing. Without traces, debugging an agent failure is guesswork — you can't see the chain of decisions that led to a wrong answer.

## When to Use Agents vs a Pipeline

| Factor | Agent (ReAct loop) | Pipeline (fixed steps) |
|--------|---------------------|------------------------|
| Task structure | Unknown at start, must discover | Known, fixed sequence |
| Error recovery | Needs to retry and re-plan | Errors = failure |
| Cost sensitivity | Can tolerate variable cost | Cost must be predictable |
| Latency | Latency-tolerant | Latency-sensitive |
| Reliability need | 90–95% acceptable | 99%+ required |

Most production LLM use cases are pipelines, not agents. An agent adds complexity, cost, and failure modes. Use a pipeline unless the task truly requires adaptive reasoning and multi-step information gathering.

## Key Things

1. **Tool use is a request, not an action.** The model outputs JSON; your code executes. Never let the model run arbitrary code without a sandbox.
2. **ReAct is the foundation of reliable agents.** Reason → Act → Observe loop produces more accurate and interpretable results than pure generation for information-gathering tasks.
3. **Start with no framework.** A 50-line while-loop calling the LLM API is more debuggable and reliable than any framework abstraction.
4. **Human-in-the-loop for destructive operations.** Anything that deletes, sends, or charges money requires explicit confirmation.
5. **Set hard limits on tool calls per turn.** Infinite loops are the most common agent failure mode.
6. **Trace everything.** Without per-step traces, debugging an agent is impossible.
7. **An agent is the last resort, not the first.** Most production use cases are better served by a well-designed pipeline with fixed steps.

## References

- Toolformer: Schick et al., 2023 — *Toolformer: Language Models Can Teach Themselves to Use Tools* — [arXiv](https://arxiv.org/abs/2302.04761)
- ReAct: Yao et al., 2022 — *ReAct: Synergizing Reasoning and Acting in Language Models* — [arXiv](https://arxiv.org/abs/2210.03629)
- OpenAI function calling: https://platform.openai.com/docs/guides/function-calling
- Anthropic tool use: https://docs.anthropic.com/en/docs/tool-use
- MCP (Model Context Protocol): https://modelcontextprotocol.io
- AutoGen: Wu et al., 2023 — *AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation* — [arXiv](https://arxiv.org/abs/2308.08155)
- CrewAI: https://github.com/crewAIInc/crewAI
- LangChain: https://github.com/langchain-ai/langchain
