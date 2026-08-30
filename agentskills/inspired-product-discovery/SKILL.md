---
name: inspired-product-discovery
description: Run end-to-end product discovery for tech products using the INSPIRED (Marty Cagan) method. Covers problem framing, customer interviews, the four product risks (value, usability, feasibility, business viability), opportunity assessment, rapid prototyping, and running product discovery with an empowered product team. Use when the user wants to validate an idea, plan discovery experiments, run customer interviews, assess an opportunity, pick a prototyping technique, or structure an empowered product team.
---

# Inspired Product Discovery

Helps you run product discovery the way the best tech companies do: rapid-cycle
testing of the **four product risks** before committing engineering resources,
inside an **empowered product team**.

## Core mental model

- **Product = the product team**, not a single PM. Team = Product Manager +
  Product Designer + Engineers + (optionally) Tech Lead.
- **Empowered teams** own *outcomes* ("increase retention of trial users"); feature
  teams just execute *output* ("ship onboarding checklist"). Discovery only works
  on empowered teams.
- **Discovery answers four risks** before you build the full product:

  | Risk | Question |
  |------|----------|
  | Value | Will users choose to use / buy it? |
  | Usability | Can users figure out how to use it? |
  | Feasibility | Can our engineers build it with our tech? |
  | Business viability | Will our business side support it (sales, support, legal, revenue)? |

- **The discovery mindset**: you do *not* know the problem or the solution. The
  goal of a discovery cycle is to get from "we don't know" to "we know it's worth
  building and we know how to build it" — with evidence, not opinion.

## Workflows

### 1. Frame the problem (before any solution)

1. State the **customer** and the **problem** in their words (quote, not paraphrase).
2. Refuse to jump to solutions. Ask: *What is the underlying job-to-be-done?*
3. Check the **product principles** / strategy of the product for fit.
4. Write an explicit **hypothesis**: "We believe [customer] has [problem]. We
   believe [solution] will achieve [outcome]. We'll know it's true when
   [testable signal]."

### 2. Run customer interviews (problem interviews)

1. Recruit 5–8 users per segment (not friends/family; target the segment).
2. Ask about the **past and behavior**, not opinions about a future feature.
   (e.g. "Tell me about the last time you dealt with X.")
3. Listen for **frequency + pain + alternatives** (what they do today).
4. Do NOT pitch your solution. If they want one, note it and move on.
5. Triangulate across interviews before concluding.

### 3. Plan a discovery cycle (use `scripts/discovery-planner.mjs`)

1. Pick the risk(s) with the most uncertainty.
2. Choose the cheapest prototype that can test that risk (see REFERENCE.md).
3. Define pass/fail criteria before testing (so you can't fool yourself).
4. Run the test, capture results, decide: **iterate, pivot, or kill**.
5. Keep batches small; run many quick cycles, not one big study.

### 4. Assess an opportunity (use `scripts/opportunity-assessment.mjs`)

Use before committing a discovery cycle when you have many candidate ideas, to
filter which are worth the effort.

### 5. Run the empowered team

- Discovery is **collaborative**: PM, designer, and engineers test together weekly.
- Kill bad ideas fast and celebrate it — killing is a success, not failure.
- Hand off only proven ideas to the delivery pipeline.
- Continuously revisit product strategy; discovery serves the strategy.

## Getting started (pick your entry point)

- "I have an idea" → Workflow 1 (frame) then Workflow 4 (assess).
- "I have a problem in mind" → Workflow 2 (interviews).
- "We're mid-build and unsure" → Workflow 3 (discovery cycle).
- "Fix my team/org" → Workflow 5 (empowered team).

## Advanced features

- See [REFERENCE.md](REFERENCE.md) for the discovery principles, the full
  prototyping/technique catalog, and good/bad product patterns.
- See [EXAMPLES.md](EXAMPLES.md) for worked discovery sessions and interview logs.