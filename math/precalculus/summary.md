---
title: "Summary"
aliases: []
tags: [math/precalculus]
created: "2026-06-13"
---

# Summary

### **Global Analytical Properties**

_These are the universal lenses used to analyze any graph. While every function is checked for these, the results (like "End Behavior") look different depending on the family._

* Transformations: Horizontal/Vertical shifts, Vertical stretch/shrink, and Reflections ($x$ and $y$ axis).
* Domain & Range: The set of all possible inputs ($x$) and outputs ($y$).
* Intercepts: The points where the graph crosses the $x$-axis (roots/zeros) and $y$-axis.
* Rate of Change: Analyzed as a constant (Slope) or variable (Derivative).
* Inverses: The "undoing" function; requires a One-to-One relationship (often requiring Domain Restriction for Quadratics and Trig).
* Continuity & Discontinuity: Analyzing if the graph is a single unbroken curve or has holes/breaks.
* Symmetry: Checking if a function is Even ($y$-axis symmetry) or Odd (origin symmetry).
* Inequalities: Solving for intervals where $f(x) > 0$, $f(x) < 0$, or other relational conditions.
* Composition of Functions: Combining functions as $f(g(x))$; the output of one becomes the input of another.

***

### **Linear Functions**

* Slope (Rate of Change): The constant steepness; the "m" in $y = mx + b$.
* Monotonicity: The function is strictly increasing or strictly decreasing for its entire domain.
* $x$ and $y$ Intercepts: The single points where the line crosses the axes.
* Parallel Lines: Share the same slope ($m_1 = m_2$).
* Perpendicular Lines: Slopes are negative reciprocals ($m_1 m_2 = -1$).
* Point-Slope Form: $y - y_1 = m(x - x_1)$ for writing equations from a point and slope.

***

### **Quadratic Functions**

* Vertex (Global Max/Min): The absolute highest or lowest point of the parabola.
* Axis of Symmetry: The vertical line $x = h$ that splits the graph perfectly in half.
* Concavity: The graph is always either "concave up" (cup) or "concave down" (frown).
* Discriminant: Using $b^2 - 4ac$ to predict the number and type of roots (Real vs. Complex).
* Turning Points: Always has exactly one turning point.
* Factoring Methods: Greatest Common Factor (GCF), Difference of Squares ($a^2 - b^2$), Factor by Grouping, Trinomial Factoring.
* Completing the Square: Method to convert $ax^2 + bx + c$ to vertex form $a(x-h)^2 + k$.
* Product Formulas: Special patterns including $(a+b)^2 = a^2 + 2ab + b^2$, $(a-b)^2 = a^2 - 2ab + b^2$, and $(a+b)(a-b) = a^2 - b^2$.
* Quadratic Formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ for finding roots.
* Vertex Form: $y = a(x-h)^2 + k$ for identifying the vertex $(h, k)$ directly.

***

### **Polynomial Functions**

* Degree ($n$): The highest exponent, which dictates the maximum number of roots and turning points.
* End Behavior: Determined by the Degree and Leading Coefficient (e.g., "up-up" or "down-up").
* Multiplicity: Determines if the graph crosses the x-axis (odd multiplicity) or bounces (even multiplicity).
* Turning Points: Can have up to $n-1$ turning points.
* Inflection Points: Specific locations where the concavity switches from "up" to "down."
* Polynomial Division: Long Division and Synthetic Division for dividing polynomials.
* Factor Theorem: $(x-c)$ is a factor of $P(x)$ if and only if $P(c) = 0$.
* Remainder Theorem: When $P(x)$ is divided by $(x-c)$, the remainder is $P(c)$.
* Complex Roots: When the discriminant is negative, roots occur in conjugate pairs ($a + bi$ and $a - bi$).
* Rational Root Theorem: Possible rational zeros are of the form $\frac{p}{q}$ where $p$ divides the constant term and $q$ divides the leading coefficient.

***

### **Rational Functions**

* Vertical Asymptotes: "Invisible walls" caused by values that make the denominator zero.
* Horizontal/Slant Asymptotes: Describes the "End Behavior" as $x \to \infty$.
* Holes (Removable Discontinuities): Occur when a factor in the numerator and denominator cancels out.
* Branches: The separate, disconnected curves created by asymptotes.
* Domain Restrictions: Values where $Q(x) = 0$ make the function undefined and must be excluded.
* Simplifying Rational Expressions: Canceling common factors between numerator and denominator (while noting excluded values).

***

### **Exponential Functions**

* Standard Form: $f(x) = a \cdot b^x$ where $a$ is the initial value and $b$ is the base.
* Growth vs. Decay: If $b > 1$, exponential growth; if $0 < b < 1$, exponential decay.
* Growth/Decay Rate Form: $f(t) = a(1 \pm r)^t$ where $r$ is the percentage rate.
* Natural Exponential: $f(x) = e^x$ where $e \approx 2.71828$ (Euler's number).
* Horizontal Asymptote: Typically $y = 0$ (the x-axis) for standard exponential functions.
* Domain & Range: Domain is all real numbers $(-\infty, \infty)$; Range is $(0, \infty)$ for standard form.
* Applications: Compound interest, population growth, radioactive decay.
* One-to-One Property: Always passes the Horizontal Line Test; has an inverse (logarithmic function).

***

### **Logarithmic Functions**

* Definition: $\log_b(x) = y \iff b^y = x$ (logarithm as the inverse of exponentiation).
* Natural Logarithm: $\ln(x) = \log_e(x)$ where the base is $e$.
* Domain Restriction: $x > 0$ (logarithms only defined for positive arguments).
* Range: All real numbers $(-\infty, \infty)$.
* Vertical Asymptote: $x = 0$ (the y-axis) for standard logarithmic functions.
* Logarithm Properties:
 * Product Rule: $\log_b(mn) = \log_b(m) + \log_b(n)$
 * Quotient Rule: $\log_b\left(\frac{m}{n}\right) = \log_b(m) - \log_b(n)$
 * Power Rule: $\log_b(m^p) = p \cdot \log_b(m)$
 * Zero Property: $\log_b(1) = 0$
 * Identity Property: $\log_b(b) = 1$
 * Inverse Property: $b^{\log_b(x)} = x$ and $\log_b(b^x) = x$
* Change of Base Formula: $\log_b(x) = \frac{\log_a(x)}{\log_a(b)}$ for converting between bases.

***

### **Absolute Value Functions**

* Definition: $$|x| = \begin{cases} x & \text{if } x \geq 0 \\ -x & \text{if } x < 0 \end{cases}$$
* V-Shape Graph: Creates a sharp corner at the vertex.
* Standard Form: $f(x) = a|x - h| + k$ where $(h, k)$ is the vertex.
* Piecewise Nature: Can be rewritten as a piecewise function with two linear pieces.
* Solving Absolute Value Equations: $|x| = a$ yields two solutions: $x = a$ or $x = -a$ (if $a > 0$).
* Absolute Value Inequalities: Analyzed by considering both positive and negative cases.

***

### **Piecewise Functions**

* Definition: Functions defined by different expressions on different intervals of the domain.
* Notation: Written with cases showing the formula and corresponding domain for each piece.
* Continuity Analysis: Check if the pieces connect smoothly or have jumps/breaks at boundary points.
* Evaluating: Determine which piece to use based on the input value's interval.

***

### **Circles (Coordinate Geometry)**

* Standard Form (Center-Radius): $(x - h)^2 + (y - k)^2 = r^2$ where $(h, k)$ is the center and $r$ is the radius.
* Pythagorean Connection: Derived from the distance formula and Pythagorean theorem.
* Completing the Square: Used to convert general form to standard form.
* Distance Formula: $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ for finding the distance between two points.
* Midpoint Formula: $M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$ for finding the point halfway between two endpoints.

***

### **Trigonometric Functions**

* Periodicity: The repeating nature of the graph; the distance required to complete one full cycle.
* Amplitude: The vertical "reach" of the wave; the distance from the midline to the peak.
* Phase Shift: The trigonometric term for a horizontal shift.
* Midline (Vertical Shift): The horizontal center line ($y=d$) that the wave oscillates around.
* Domain Restrictions: Essential for defining Inverse Trig functions (Arccosine, Arcsine, etc.).
* Asymptotes: Periodic vertical breaks found in $\tan$, $\cot$, $\sec$, and $\csc$.
* Unit Circle: The foundational circle with radius 1 where $x^2 + y^2 = 1$; coordinates are $(\cos\theta, \sin\theta)$.
* Reference Angles: The acute angle formed with the x-axis; used to find trig values in any quadrant.
* Coterminal Angles: Angles that differ by full rotations ($360°$ or $2\pi$); share the same terminal side.
* Reciprocal Functions: $\csc\theta = \frac{1}{\sin\theta}$, $\sec\theta = \frac{1}{\cos\theta}$, $\cot\theta = \frac{1}{\tan\theta}$.
* Pythagorean Identities:
 * $\sin^2\theta + \cos^2\theta = 1$
 * $1 + \tan^2\theta = \sec^2\theta$
 * $1 + \cot^2\theta = \csc^2\theta$
* Quotient Identities: $\tan\theta = \frac{\sin\theta}{\cos\theta}$ and $\cot\theta = \frac{\cos\theta}{\sin\theta}$.
* Even/Odd Identities: $\sin(-x) = -\sin(x)$ (odd), $\cos(-x) = \cos(x)$ (even).
* Cofunction Identities: $\sin\left(\frac{\pi}{2} - x\right) = \cos(x)$, $\cos\left(\frac{\pi}{2} - x\right) = \sin(x)$.
* Sum and Difference Formulas:
 * $\sin(A \pm B) = \sin A \cos B \pm \cos A \sin B$
 * $\cos(A \pm B) = \cos A \cos B \mp \sin A \sin B$
 * $\tan(A \pm B) = \frac{\tan A \pm \tan B}{1 \mp \tan A \tan B}$
* Double-Angle Formulas:
 * $\sin(2\theta) = 2\sin\theta\cos\theta$
 * $\cos(2\theta) = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta$
 * ...
* Half-Angle Formulas (the $\pm$ depends on the quadrant of $\frac{\theta}{2}$):
 * $\sin\left(\frac{\theta}{2}\right) = \pm\sqrt{\frac{1 - \cos\theta}{2}}$
 * $\cos\left(\frac{\theta}{2}\right) = \pm\sqrt{\frac{1 + \cos\theta}{2}}$
 * $\tan\left(\frac{\theta}{2}\right) = \frac{1 - \cos\theta}{\sin\theta}$
* Law of Sines: $\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}$ for solving oblique triangles when you know angle-side pairs.
* Law of Cosines: $c^2 = a^2 + b^2 - 2ab\cos(C)$ for solving triangles when you know SSS or SAS.
* Inverse Identities:
 * Composition: $\sin(\arcsin(x)) = x$, $\cos(\arccos(x)) = x$, $\tan(\arctan(x)) = x$
 * Complementary: $\arcsin(x) + \arccos(x) = \frac{\pi}{2}$
 * Negative Argument: $\arcsin(-x) = -\arcsin(x)$, $\arctan(-x) = -\arctan(x)$

***

### **Radicals and Rational Exponents**

* Radical Notation: $\sqrt[n]{x}$ represents the $n$th root of $x$.
* Rational Exponent Form: $a^{\frac{m}{n}} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m$
* Properties of Radicals
* Simplifying Radicals: Factor out perfect powers to simplify expressions.

***

### **Complex Numbers**

* Standard Form: $a + bi$ where $a$ is the real part and $bi$ is the imaginary part.
* Imaginary Unit: $i = \sqrt{-1}$ with the property $i^2 = -1$.
* Powers of $i$: Cycle every 4 powers ($i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$).
* Complex Plane: Real part on x-axis, imaginary part on y-axis; geometric representation.
* Operations: Add/subtract by combining like terms; multiply using distributive property and $i^2 = -1$.
* Complex Conjugate: $a - bi$ is the conjugate of $a + bi$; used for division.
* Geometric Interpretation: Multiplying by $i$ represents a 90° rotation in the complex plane.

***

### **Sequences and Series**

* Arithmetic Sequence: $a_n = a_1 + (n - 1)d$ where $d$ is the common difference.
* Arithmetic Series: $S_n = \frac{n(a_1 + a_n)}{2}$; sums a fixed number of terms.
* Geometric Sequence: $a_n = a_1 \cdot r^{n-1}$ where $r$ is the common ratio.
* Geometric Series: $S_n = a_1\left(\frac{1 - r^n}{1 - r}\right)$; sums $n$ terms.
* Infinite Geometric Series: $S_\infty = \frac{a_1}{1 - r}$ when $|r| < 1$; the sum converges to a finite value.

***

### **Binomial Theorem**

* Expansion: $(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k$ for any positive integer $n$.
* Binomial Coefficient: $\binom{n}{k} = \frac{n!}{k!(n-k)!}$; read as "$n$ choose $k$."
* Generalizes the product formulas $(a + b)^2$ and $(a + b)^3$ to any power.

***

### **Limits**

* Definition: $\lim_{x \to a} f(x) = L$ means $f(x)$ gets arbitrarily close to $L$ as $x$ gets arbitrarily close to $a$.
* Convergence: A sequence or function settles toward a single finite value.
* Divergence: Grows without bound or oscillates without settling.
* Connection: The infinite geometric series $S_\infty$ is the limit of the partial sums as $n \to \infty$.
