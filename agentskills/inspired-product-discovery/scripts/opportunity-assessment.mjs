#!/usr/bin/env node
// opportunity-assessment.mjs
// Score a candidate idea to decide whether it deserves a discovery cycle.
// Usage:
//   node opportunity-assessment.mjs --idea "invite status view" \
//     --problem "admins lose track of pending invites" --customer "B2B team admin"
//
// Prints an opportunity assessment worksheet with a recommendation.

const args = process.argv.slice(2);

function get(name) {
  const i = args.indexOf("--" + name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const idea = get("idea") || "the idea";
const problem = get("problem") || "";
const customer = get("customer") || "";

const questions = [
  {
    q: "Is it a real, frequent, painful problem (or a big new opportunity)?",
    hint: "If it's rare, minor, or nice-to-have, deprioritize.",
  },
  {
    q: "Do customers have a workaround today that they hate?",
    hint: "A hated workaround is strong signal; no workaround means weak pain.",
  },
  {
    q: "Does it fit our product strategy and principles?",
    hint: "If it's off-strategy, it should wait even if valuable.",
  },
  {
    q: "Can we build it (feasibility) and will the business support it (viability)?",
    hint: "Check engineering cost and sales/support/legal/revenue impact.",
  },
  {
    q: "Is the payoff (user value AND business value) worth the discovery effort?",
    hint: "Weight big-opportunity + strategic-fit highest.",
  },
];

const out = `
OPPORTUNITY ASSESSMENT
======================
Idea     : ${idea}
Customer : ${customer || "(not specified)"}
Problem  : ${problem || "(not specified)"}

Rate each 1 (weak) to 5 (strong), then sum your score:
${questions.map((x, i) => `  ${i + 1}. ${x.q}\n      (${x.hint})  SCORE: __/5`).join("\n")}

SCORING GUIDE
-------------
 15-25 : Worth a discovery cycle. Proceed to problem interviews.
 10-14 : Marginal. Do a single cheap interview round before committing.
  <10  : Skip for now. Deprioritize or reconsider the problem framing.

NEXT STEP
---------
If it clears the bar, run the discovery planner:
  node scripts/discovery-planner.mjs --problem "${problem || '<problem>'}" \
    --customer "${customer || '<customer>'}"
`;
console.log(out);