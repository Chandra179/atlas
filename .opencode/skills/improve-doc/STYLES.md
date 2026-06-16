# Writing Styles & Structural Patterns

Reference catalog for the improve-doc skill. Use these to identify styles and suggest patterns.

## The Four General Styles

| Style | Hallmark | Good For | Bad For |
|---|---|---|---|
| **Narrative** | Problem → why naive fails → solution → principles | Teaching a concept from scratch. Reader learns *with* the writer. | Quick reference lookup. Skimming for facts. |
| **Reference** | Tables, categories, lookup-oriented. Organized for retrieval. | Encyclopedia, comparison, cheat sheet. Reader knows what they want. | Learning from scratch. Understanding why. |
| **Deep Dive** | Architecture overview → step-by-step walkthrough → key takeaways | Understanding internals of a specific system. | Getting started fast. High-level overview. |
| **Guide** | Step-by-step instructions. "How to accomplish X." | Implementation tasks. Procedures. | Understanding theory. Comparing options. |

### Hybrid Files

Some files blend styles. A tutorial that explains *why* before *how* is guide + narrative. A reference with a decision-tree intro is reference + narrative. The audit should identify what the primary style is and whether the blend works.

## Structural Patterns

When the audit suggests a pattern, name it explicitly from this catalog and specify the line range.

### Opening Patterns

- **Problem Hook** — "You're building X. The naive approach does Y. It fails because Z." Reader sees their own situation and wants the solution. Example: etcd-raft.md "Why Raft? Why not just 'go through quorum' directly?"

- **Question Hook** — "What happens when you type a URL?" Reader is curious about something they do every day. Example: networking.md (after Tier 1 rewrite).

- **Contrast Hook** — "Traditional programming: rules for every case. ML: examples → learned rules." Reader sees the paradigm shift immediately. Example: ml.md (after Tier 1 rewrite).

- **Result Hook** — "This file gets you from zero to a working LLM serving endpoint in one deployment." Reader knows the payoff before the work.

### Body Patterns

- **Chronological Walkthrough** — Follow a request/packet/concept through a system step by step. Reader maintains context because the thread is linear. Example: syncthing.md identity → trust → connection → sync → resilience.

- **"Why X?" Sections** — Before explaining a mechanism, explain why the mechanism exists. What problem did it solve? What was the status quo before it? Reader understands motivation before implementation. Example: postgresql.md "If you're thinking about clustering like InnoDB..."

- **Concrete Example Anchors** — Every abstract claim is followed by a real scenario with numbers. "Cold start: 182s on H200" not "slow to start." "99.9% uptime = 8.7 hours downtime/year" not "high availability matters." Example: ai-infra.md cost model.

- **Before/After Framing** — Show the old way, show the new way, quantify the delta. "Without consistent hashing: 100% cache miss on node change. With it: ~1% miss for 100 nodes." Example: consistent-hashing-distributed-cache.md.

- **Metaphor Bridge** — Map an abstract concept to something physical. "P (Processor) is a cooking station. M (Machine) is the chef. G (Goroutine) is a recipe card." Only works when the metaphor holds under scrutiny. Example: goroutine.md GPM scheduler.

### Summary Patterns

- **"Key things" Bullet Lists** — 3–6 bullets after a dense section. Reinforces the core takeaways. Reader skimming can stop at these and still learn. Example: syncthing.md after every major section.

- **Principle Table** — Numbered principles at the end. "1. Separate consensus from application. 2. Raft is pure in-memory..." Reader walks away with a mental checklist. Example: etcd-raft.md Key Principles.

- **Comparison Table** — Side-by-side comparison of alternatives. "H200: $4.54/hr. A100: $1.20/hr. Latency: 55 tok/s vs. 30 tok/s." Reader can make a decision. Example: ai-infra.md idle management.

- **Decision Tree / "When to Use"** — Explicit guidance on when to choose this approach vs. alternatives. "When to reach for it: X. When not to: Y." Example: postgresql.md closing section.

### Closer Patterns

- **Key Learnings** — What studying this system teaches that generalizes beyond it. Transforms specific knowledge into transferable principles. Example: etcd-raft.md Key Learnings.

- **Further Reading** — Links to primary sources, papers, RFCs, or deeper files in the vault.

- **Source Citations Table** — Repository → file → key functions for deep dives. Reader can verify claims and explore independently. Example: etcd-raft.md Source Citations.

## What Not to Suggest

Avoid suggesting patterns that don't fit the file's purpose:

- Don't suggest a narrative hook for a reference table.
- Don't suggest a chronological walkthrough for a cheat sheet.
- Don't suggest a principle table for a template.
- Don't suggest storytelling scores for files that are purely structural (resumes, templates, indexes).

## Concrete Anchor Examples

Good concrete anchors from the vault:

| Instead of | Use |
|---|---|
| "etc/hosts is small" | "etc/hosts: ~4 KB" |
| "NAT was created for IPv4 exhaustion" | "IPv4: 4.3B addresses. Devices: more than that. Hence NAT." |
| "Scaling is important" | "AWS's largest instance can't serve 100M users" |
| "Uptime matters" | "99.9% = 8.7 hours downtime/year. 99.99% = 52 minutes." |
| "It's fast" | "Sequential I/O on the .log file is why Kafka is fast — writes are pure appends." |
