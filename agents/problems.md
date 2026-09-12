# Product Ideas

Use this process to move from a real customer problem to a small, testable
product. Each stage must produce evidence before the next stage begins.

## 1. Problem discovery

Find problems in app reviews, Product Hunt, Reddit, Hacker News, forums, social
media, support conversations, and direct interviews.

For every problem, record:

- target customer and situation;
- the customer's own words;
- frequency and severity;
- the consequence of leaving it unsolved;
- the current workaround or competing product; and
- source, date, and evidence strength.

Before building, study how the target customer handles the problem today. Ask
about the last time they faced it, what they did, and what it cost them. Use
interviews, calls, observation, support conversations, or written feedback.
After creating a prototype, observe whether users can understand and complete
the proposed workflow. Treat feature requests as clues, not requirements.

**Required output:** a problem brief with a clear customer, problem, context,
evidence, current alternatives, and unanswered questions.

**Completion condition:** the problem is specific enough to identify the first
customer group and test whether the problem is frequent and important.

## 2. Solution discovery

Research existing solutions. A good opportunity does not need to be completely
new; an existing option may be too expensive, complex, slow, or poorly suited to
a particular customer group.

Describe the remaining gap and why a customer would switch. Compare at least
one alternative, including the current workaround.

Write a testable hypothesis:

> We believe [customer] has [problem]. We believe [solution] will help them
> achieve [outcome]. We will test it with [experiment]. We will consider it
> promising when [observable signal].

Check whether the solution needs special data, energy, algorithms, or compute.
Check whether it applies globally or only to a country, region, province, or
city. Identify regulations, permissions, safety concerns, and a plan for handling
them.

Evaluate four risks before committing to a full build:

| Risk | Question |
|---|---|
| Value | Will the target customer choose to use or pay for it? |
| Usability | Can the customer understand and complete the workflow? |
| Feasibility | Can we build and operate it with the available time, skills, and technology? |
| Viability | Can the business support its cost, operations, legal needs, and revenue model? |

**Required output:** a solution hypothesis, alternatives comparison, risk list,
and a cheap experiment for the riskiest assumption.

**Completion condition:** the next experiment has a defined owner, audience,
method, success signal, failure signal, and decision date.

## 3. Constraints and viability

Estimate the cost before choosing an architecture. Include development time,
servers, CPU, memory, storage, network traffic, backups, observability,
third-party services, maintenance, and support.

Use a back-of-the-envelope estimate with explicit assumptions. Record expected
traffic, data size, retention period, peak load, latency, availability, and
budget. Revisit the estimate when the assumptions change.

Prefer the smallest reliable resource that meets the requirement. An embedded
database may be a better first choice than PostgreSQL for a local, single-node
product; use a service database when availability, concurrency, or shared access
requires it.

**Required output:** an assumptions table, rough cost estimate, regulatory
check, and list of constraints that could change the design.

## 4. MVP

Define the MVP as the smallest complete workflow that solves one important
problem for one target customer group. Do not define it as a list of features
that makes the system technically complete.

1. Choose one customer outcome and one primary workflow.
2. Keep only the features required to complete that workflow.
3. Separate independent work by stable interfaces and clear ownership.
4. Prototype the UI, UX, and mock data before building production behavior.
5. Test whether users understand the workflow and whether it solves the problem.
6. Decide whether to continue, revise, or stop using the results and deadline.

The prototype should answer the riskiest usability or value question. Positive
opinions alone are weak evidence; prefer observed use, repeated use, a committed
pilot, or payment when appropriate.

**Required output:** MVP scope, user flow, prototype, test plan, success
criteria, and a decision record.

**Completion condition:** one target customer can complete the primary workflow,
and the team has evidence for the next decision.

## 5. Technical design and implementation

Choose technology from the workload and constraints:

1. Use Go for a simple, fast backend default. Use Rust when heavy computation,
   memory use, or low-level control justifies its extra complexity.
2. For a web UI, choose React, TypeScript, and Tailwind when they fit the
   product. Use Vite as the development server and build tool; use npm, pnpm,
   yarn, or another package manager separately.
3. Start with a modular monolith unless independent deployment or scale is a
   proven requirement.
4. Prefer the standard library when it is sufficient. For third-party
   libraries, check maintenance activity, security history, license, API fit,
   documentation, and community adoption. Stars are only one signal.
5. Write the system design in `docs`. At minimum, document the requirements,
   data flow, tech stack, capacity assumptions, failure handling, and tradeoffs.
6. Record important choices in `docs/adr` as Architecture Decision Records.
7. Make state changes, retries, jobs, and shared resources safe under
   concurrency. Document idempotency and recovery behavior.
8. Add observability that helps explain user impact: structured logs, useful
   metrics, traces where needed, and actionable alerts.

**Required output:** a working vertical slice, system design, ADRs for major
choices, and checks for correctness, failure recovery, and cost.

**Completion condition:** the slice satisfies the MVP acceptance criteria and
can be operated by the team that owns it.

## 6. After the MVP

Measure the customer outcome and the cost of providing it. Track only metrics
that support a decision, such as activation, successful workflow completion,
repeat use, retention, conversion, latency, error rate, availability, CPU,
memory, storage, and network cost.

1. Compare results with the success criteria.
2. Find the largest product, technical, or operational bottleneck.
3. Improve the bottleneck before adding unrelated features.
4. Recheck architecture, storage, CPU, memory, and network costs as usage grows.
5. Decide whether to continue, iterate, narrow the audience, pivot, or stop.

Scale only when measured demand or reliability requirements justify it. Keep the
architecture simple until the next constraint is clear.

**Required output:** a post-MVP review with results, costs, bottleneck, and the
next decision.

**Completion condition:** the next investment has a measurable reason and a
clear owner.
