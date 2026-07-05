---
title: "Calculus"
aliases: []
tags: [math, math/calculus]
created: "2026-06-13"
---

# Calculus

## Derivative

Its a way to find the **Instantaneous Rate of Change,** how fast something is moving at one exact moment, rather than an average over time.

Also to do **Optimization**: find the "peak" or "valley" (the best or worst) of any situation.

### Example

Imagine you are walking away from a lamp.

* The Function ($2x^2$): This tells you the length of the shadow (The Total).
* The Derivative ($4x$): This tells you the speed of the shadow (The Jump Rate).

At $x = 10$ feet away from the lamp:

The Total (Where is the shadow?): Use the original formula. $$2(10)^2 = 2 \times 100 = \mathbf{200 \text{ feet}}$$ The Jump Rate (How fast is it moving?): Use the derivative.
$$4(10) = \mathbf{40}$$
Meaning: At this exact spot, for every 1 inch you move, the shadow jumps 40 inches.

#### **The Algebra Way**

Algebra cannot find the jump rate at a single point (3), so we have to use two points and a "nudge."

1. Point A: $(3, 9)$
2. Point B (The Nudge): Let's move to $3.01$. The output is $3.01^2 = 9.0601$.
3. The Calculation:

 $$\frac{\text{Jump}}{\text{Nudge}} = \frac{9.0601 - 9}{3.01 - 3} = \frac{0.0601}{0.01} = \mathbf{6.01}$$
4. The Guess: You have to look at $6.01$ and "guess" that if the nudge was zero, the answer would be 6.

Newton looked at these results: 7, 6.1, 6.01, 6.001... He realized that as the "Nudge" (the distance between points) gets smaller and smaller, the answer is clearly heading toward 6.

The Algebra Way is this process of "Approaching" the truth. You have to do the math over and over with smaller numbers to see where the pattern leads.

### **The Derivative Way**

We use the Power Rule pattern that Newton and Leibniz discovered.

1. The Rule: For $x^2$, the derivative is $2x$.
2. The Calculation: Plug in 3. $$2 \times 3 = \mathbf{6}$$
3. The Result: You get the exact answer (6) instantly, with no "nudging" or guessing required.
