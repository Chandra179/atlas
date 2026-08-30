#!/usr/bin/env node
// discovery-planner.mjs
// Plan a discovery cycle from a problem hypothesis. Usage:
//   node discovery-planner.mjs --problem "team admins lose track of pending invites"
//   --risk value --customer "B2B team admin" --outcome "cut rollout delays"
//
// Prints a discovery plan: hypothesis, cheapest prototype, test plan per risk,
// and pass/fail criteria. Guidance-only; no files are written.

const args = process.argv.slice(2);

function get(name) {
  const i = args.indexOf("--" + name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const problem = get("problem") || "a problem we haven't fully defined yet";
const customer = get("customer") || "the target customer";
const outcome = get("outcome") || "a measurable business outcome";
const risk =
  (get("risk") || "value").toLowerCase().replace(/[^a-z]+/g, "");

const RISK_PROTOTYPES = {
  value: ["concierge", "wizard of oz", "live-data prototype", "landing page with real commitment"],
  usability: ["hi-fi clickable prototype", "wireframes"],
  feasibility: ["feasibility prototype using real tech", "technical spike"],
  viability: ["internal stakeholder review", "concierge + mock pricing/policies"],
};

function riskHelp(r) {
  const map = {
    value: "Will users choose to use/buy it?",
    usability: "Can users figure out how to use it?",
    feasibility: "Can our engineers build it?",
    viability: "Will our business side support it?",
  };
  return map[r] || map.value;
}

const prototypes = RISK_PROTOTYPES[risk] || RISK_PROTOTYPES.value;

const out = `
DISCOVERY PLAN
==============
Customer : ${customer}
Problem  : ${problem}
Outcome  : ${outcome}
Risk     : ${risk.toUpperCase()} - ${riskHelp(risk)}

HYPOTHESIS
----------
We believe ${customer} has "${problem}".
We believe solving it will ${outcome}.
We'll know we're right when we see a testable signal from a real behavior test.

CHEAPEST PROTOTYPES TO TRY (in order)
-------------------------------------
${prototypes.map((p) => "  - " + p).join("\n")}

TEST PLAN
---------
1. Start with the cheapest prototype that can answer the ${risk.toUpperCase()} risk.
2. Define pass/fail criteria BEFORE testing (write them here):
   PASS:  ________________________________________
   FAIL:  ________________________________________
3. Recruit 5-8 users from the real segment (not friends/family).
4. Ask about past behavior, not future-feature opinions. Do not pitch.
5. Record frequency, pain, and current workarounds.
6. Decide: ITERATE, PIVOT, or KILL. Killing is a success if the idea was wrong.

REMINDER
--------
The value test is the killer test. If you're unsure about value, run it first.
`;
console.log(out);