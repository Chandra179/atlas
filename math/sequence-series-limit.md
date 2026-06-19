---
title: "Sequence, Series, Limit"
aliases: []
tags: [math, math/sequences]
created: "2026-06-13"
---

# Sequence, Series, Limit

### Arithmetic

**Sequence**

Arithmetic math is based on addition. If you graph it, it always forms a perfectly straight line.

$$a_n = a_1 + (n - 1)d$$

Variable Breakdown:

* $a_n$ (The Target): The value of the number at position $n$. (e.g., "What is the 100th number?")
* $a_1$ (The Start): The very first number in your list.
* $n$ (The Position): Which step you are on. We use $(n-1)$ because we don't add the difference to the first term; we only start adding it from the second term onward.
* $d$ (The Common Difference): The amount you add (or subtract) at every step.

You start a job at \$50,000 ($a_1$). You get a guaranteed raise of \$3,000 ($d$) every year. What is your salary in Year 10 ($n$)?

$$a_{10} = 50,000 + (10 - 1)3,000 = \mathbf{\$77,000}$$

**Series**

$$S_n = \frac{n(a_1 + a_n)}{2}$$

Variable Breakdown:

* $S_n$: The "Sum." The total of all numbers from the 1st to the $n$-th.
* $n/2$: This represents the number of "pairs" you have.
* $(a_1 + a_n)$: The sum of the first and last term.

Practical Example: A theater has 20 rows. The 1st row has 30 seats ($a_1$), and the 20th row has 80 seats ($a_{20}$). How many total seats ($S_{20}$) are in the theater?

$$S_{20} = \frac{20(30 + 80)}{2} = 10 \times 110 = \mathbf{1,100 \text{ seats}}$$

***

### Geometric

Geometric math is based on multiplication. It starts slow but "explodes" or "vanishes" very quickly.

**Sequence**

$$a_n = a_1 \cdot r^{n-1}$$

Variable Breakdown:

* $a_1$: The starting value.
* $r$ (Common Ratio): What you multiply by each time.
  * If $r = 2$, it doubles.
  * If $r = 0.5$, it cuts in half.
* $n-1$: The number of times the growth has happened.

A viral post starts with 10 shares ($a_1$). The number of shares triples ($r=3$) every hour. How many shares will occur in Hour 6 ($n$)?

$$a_6 = 10 \cdot 3^{(6-1)} = 10 \cdot 243 = \mathbf{2,430 \text{ shares}}$$

**Series**

$$S_n = a_1 \left( \frac{1 - r^n}{1 - r} \right)$$

Variable Breakdown:

* $r^n$: The total growth factor over $n$ steps.
* $1-r$: The denominator that scales the sum correctly.

You save \$100 this month. Every month you increase your savings by 10% ($r=1.10$). How much total have you saved after 4 months ($n$)?

$$S_4 = 100 \left( \frac{1 - 1.10^4}{1 - 1.10} \right) = 100 \times 4.641 = \mathbf{\$464.10}$$

**Infinite Geometric Series**

This is the "Limit" part of your heading. If a geometric sequence gets smaller and smaller ($|r| < 1$), the total sum doesn't go to infinity—it hits a "wall" or a Limit.

$$S_\infty = \frac{a_1}{1 - r}$$

Variable Breakdown:

* $S_\infty$: The value the sum approaches but never exceeds.
* $1 - r$: The "gap" remaining.

You drop a "Super-Ball" from a height of 10 feet ($a_1$). Each bounce reaches half ($r=0.5$) the height of the previous bounce. If it bounces forever, what is the total vertical distance it travels?

$$S_\infty = \frac{10}{1 - 0.5} = \frac{10}{0.5} = \mathbf{20 \text{ feet}}$$

***

## Limit

A limit describes the value that a function or sequence approaches as the input gets arbitrarily close to some point. Not every expression has a finite value at a given point, but it may approach one.

$$\lim_{x \to a} f(x) = L$$

* $L$: The value $f(x)$ gets closer to as $x$ gets closer to $a$.
* The arrow ($\to$) means "approaches"—$x$ gets arbitrarily close to $a$ without necessarily reaching it.

**Connecting to Sequences**

For sequences, the limit asks: as $n \to \infty$ (the term number goes to infinity), does $a_n$ approach a specific number?

* If $a_n$ settles toward a single value, the sequence **converges** to that limit.
* If $a_n$ grows without bound or oscillates forever, it **diverges**.

The infinite geometric series from the previous section is a classic example. As $n \to \infty$, $r^n \to 0$ (when $|r| < 1$), so the sum approaches the fixed value $\frac{a_1}{1 - r}$.
