# Examples

## Worked discovery session: onboarding dropdown

**Frame.**
> Customer: new team admin in a B2B SaaS.
> Problem (their words): "I can't tell which teammates have actually accepted their invites."
> Job-to-be-done: monitor who's in and who's stuck before the rollout date.
> Hypothesis: "We believe team admins lose track of pending invites. We believe an
> invite-status view in the members page will cut rollout delays. We'll know it's
> true when >50% of test users reference it to plan a rollout."

**Discovery plan** (cheapest first): usability-test a hi-fi clickable prototype
of the members page with the status column; then concierge the invite flow for 3
accounts to test value.

**Findings.** Users loved the status column (value) but the "resend" button was
buried (usability). Engineers said the data was already in the DB (feasibility
trivial). Decision: **iterate** on placement of resend, then hand off. No extra
engineering spend needed before proving value.

**Lesson.** The value test came first and was cheap — a concierge, not a full build.

## Worked discovery session: a feature that died

**Frame.** Feature team wanted a "dark mode" toggle.

**Assessment.** No painful problem (cosmetic). Value risk unproven, payoff small,
not in strategy.

**Discovery.** One 30-minute problem interview: users never mentioned it; their
real pain was contrast in the charts at midday.

**Decision.** **Killed.** Celebrated as a win — saved the team weeks. The real pain
(bright chart colors) became a small follow-up, not a feature.

## Good interview log pattern

```
Segment: B2B team admins
Q: "Walk me through the last time you added a teammate."
A: "I sent invites, then kept opening the app to check... I honestly lost track."
Observation: high frequency, real annoyance, uses workaround (manual checking).
Alternatives today: manual re-login, emailing the person, or just waiting.
New feature worth testing? Yes — status view. Not pitching during interview.
```

## Anti-example (how NOT to discover)

- PM shows a clickable prototype to 6 users and asks "would you use this?" →
  everyone says yes → shipped on that. This is **stated preference**, not evidence.
  No value test, no real behavior, no pass/fail criteria. The feature flops at launch.