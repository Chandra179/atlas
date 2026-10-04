---
title: "Algebra"
aliases: []
tags: [math, math/algebra]
created: "2026-10-04"
---

# Algebra

Algebra uses symbols to describe numbers and relationships. This note is a broad reference to the skills commonly taught across Algebra 1 and Algebra 2. Course boundaries vary by school, so a topic marked as an extension may appear in a different course.

## Core arithmetic and notation

### Number sets

Think of the number sets as nested boxes: each larger set contains the kinds of numbers in the smaller sets. For example, every whole number is an integer, and every integer is rational because it can be written over 1.

Rational and irrational numbers are both real numbers on the number line.

* **Natural numbers**: $1,2,3,\ldots$ (some definitions include zero).
* **Whole numbers**: $0,1,2,3,\ldots$.
* **Integers**: $\ldots,-2,-1,0,1,2,\ldots$.
* **Rational numbers**: numbers that can be written as a fraction. The bottom number cannot be zero. For example, $\frac12$ is a fraction, and $4$ is rational because $4=\frac41$.
* **Irrational numbers**: real numbers that cannot be written as a fraction. Examples include $\sqrt{2}$ and $\pi$.
* **Real numbers**: all rational and irrational numbers on the number line.
* **Complex numbers**: numbers $a+bi$, where $a,b$ are real and $i^2=-1$.

### Signed numbers and absolute value

Picture a number line: positive numbers move right and negative numbers move left. Adding is a move; for example, $-3+5=2$ means start at $-3$ and move 5 steps right. If you prefer money, a negative balance is a debt: paying $5 toward a $3 debt leaves $2.

Subtracting a number is adding its opposite: $a-b=a+(-b)$. For example, $4-(-3)=4+3=7$: removing a debt increases the balance.

The absolute value $|x|$ is distance from $x$ to zero, so it is never negative; distance has size but no direction. More generally, $|a-b|$ is the distance between $a$ and $b$. For example, $|-5|=5$, and the distance from $2$ to $-3$ is $|2-(-3)|=5$.

### Fractions, decimals, ratios, and percentages

Think of a fraction as a number of equal-sized pieces: in $\frac34$, the whole is split into four pieces and three are counted. The denominator names the piece size, so adding fractions requires matching denominators. For nonzero denominators:

* $\frac{a}{b}+\frac{c}{d}=\frac{ad+bc}{bd}$; use a common denominator to add or subtract.
* $\frac{a}{b}\cdot\frac{c}{d}=\frac{ac}{bd}$.
* $\frac{a}{b}\div\frac{c}{d}=\frac{a}{b}\cdot\frac{d}{c}$, provided $c\ne0$.
* A ratio $a:b$ compares two amounts and can be written $\frac{a}{b}$; a proportion is an equality of ratios.
* A percent $p\%$ means $\frac{p}{100}$. To find $p\%$ of $N$, calculate $\frac{p}{100}N$.

For a proportion $\frac{a}{b}=\frac{c}{d}$ with nonzero denominators, cross multiplication gives $ad=bc$. Keep units attached to quantities in word problems so the equation reflects what is being compared.

For example, if 3 notebooks cost \$6, then 5 notebooks at the same price cost $x$ with $\frac{3}{6}=\frac{5}{x}$, so $3x=30$ and $x=10$, meaning the cost is \$10.

Convert a decimal to a percent by multiplying by 100; convert a percent to a decimal by dividing by 100. Percent change is

$$\frac{\text{new value}-\text{original value}}{\text{original value}}\times100\%.$$

An increase of $r$ (written as a decimal) multiplies the original value by $1+r$; a decrease multiplies it by $1-r$. For successive percent changes, multiply the factors. For example, a 10% increase followed by a 10% decrease gives $1.10\cdot0.90=0.99$, a net 1% decrease.

For instance, 20% of $50$ is $0.20\cdot50=10$.

### Order of operations

Order of operations is a shared agreement for reading an expression the same way. Evaluate grouping symbols first, then exponents, then multiplication and division from left to right, then addition and subtraction from left to right. A fraction bar groups its entire numerator and denominator. For example, multiplication comes before addition here:

$$3+2(5-1)^2=3+2\cdot16=35.$$

## Variables, expressions, and properties

### Parts of an expression

Think of a variable as a labeled box whose value is not known yet, or may change. In $-4x^2+7x-3$:

* $x$ is a **variable**.
* $-4$ and $7$ are **coefficients**: they scale the variable parts ($-4$ times $x^2$, and 7 times $x$). The number $-3$ is a **constant** because it does not depend on $x$.
* $-4x^2$, $7x$, and $-3$ are **terms**.
* The **degree** of a nonzero polynomial is the greatest exponent of its variable; this polynomial has degree 2.

An expression has no equality sign. An equation says two expressions are equal. An inequality compares expressions with $<,\le,>,\ge$.

An **identity** is an equation true for every allowed value of its variables, such as $a(b+c)=ab+ac$. An equation that is not an identity may be true only for particular values; solving finds those values.

### Evaluating and simplifying

To **evaluate**, substitute the given value for each variable and then use order of operations. To **simplify**, combine like terms and use properties to rewrite the expression without changing its value.

Like terms have the same variable factors raised to the same powers. Think of them as the same kind of item: apples can combine with apples, but apples cannot combine with apple-squares. So $3x^2$ and $-5x^2$ are like terms, but $3x^2$ and $3x$ are not. Thus $3x^2+2x-5x^2+7x=-2x^2+9x$.

The distributive property says a multiplier outside parentheses applies to every term inside. It is like sharing a group with each part:

$$a(b+c)=ab+ac.$$

It works in reverse as factoring: $ab+ac=a(b+c)$. For example, $3x+3y=3(x+y)$ because both terms contain a factor of 3. A negative sign in front of parentheses multiplies every term inside by $-1$.

### Properties and identities

* **Commutative**: $a+b=b+a$ and $ab=ba$. Reordering does not change the sum or product.
* **Associative**: $(a+b)+c=a+(b+c)$ and $(ab)c=a(bc)$. Regrouping does not change the sum or product.
* **Distributive**: $a(b+c)=ab+ac$.
* **Identity**: $a+0=a$ and $a\cdot1=a$.
* **Inverse**: $a+(-a)=0$ and, for $a\ne0$, $a\cdot\frac1a=1$. Opposites undo addition; reciprocals undo multiplication.

Common product identities:

$$
(a+b)^2=a^2+2ab+b^2,\qquad
(a-b)^2=a^2-2ab+b^2,\qquad
(a+b)(a-b)=a^2-b^2.
$$

Do not distribute an exponent over addition: $(a+b)^2$ is not $a^2+b^2$.

## Exponents, roots, and scientific notation

An exponent is a shorthand for repeated multiplication: $a^3=a\cdot a\cdot a$. The exponent rules below keep track of how many copies of the base are being multiplied. For integer exponents and nonzero bases where needed:

$$
a^m a^n=a^{m+n},\quad
\frac{a^m}{a^n}=a^{m-n},\quad
(a^m)^n=a^{mn},\quad
(ab)^n=a^n b^n,\quad
\left(\frac{a}{b}\right)^n=\frac{a^n}{b^n}.
$$

Also, $a^0=1$ for $a\ne0$ and $a^{-n}=\frac1{a^n}$. The zero rule keeps $a^m/a^m=a^{m-m}=a^0$ equal to 1. A negative exponent means reciprocal; it does not make the value negative. For example, $2^{-3}=1/2^3=1/8$.

Rational exponents connect powers and roots. The denominator tells which root to take; the numerator tells which power to raise it to. Reduce $\frac mn$ first; for a real value,

$$a^{1/n}=\sqrt[n]{a},\qquad a^{m/n}=\left(\sqrt[n]{a}\right)^m.$$

For even $n$, real-valued $\sqrt[n]{a}$ requires $a\ge0$; odd roots of negative numbers are real. A negative exponent also requires a nonzero base. The principal square root $\sqrt{a}$ means the nonnegative number whose square is $a$: $\sqrt9=3$. But the equation $x^2=9$ has two solutions, $x=3$ and $x=-3$. In particular, $\sqrt{x^2}=|x|$, not always $x$.

To simplify a radical, factor out perfect powers; for example $\sqrt{72}=\sqrt{36\cdot2}=6\sqrt2$. For nonnegative $a,b$, $\sqrt a\sqrt b=\sqrt{ab}$; for $a\ge0,b>0$, $\frac{\sqrt a}{\sqrt b}=\sqrt{\frac ab}$. Like radicals can be combined after simplification. To remove a radical from a denominator, multiply by an appropriate radical or conjugate.

Scientific notation writes a nonzero number as $a\times10^n$, where $1\le|a|<10$ and $n$ is an integer. It is a compact way to write very large or very small measurements: $4{,}500{,}000=4.5\times10^6$ and $0.00045=4.5\times10^{-4}$. Multiplication adds exponents, division subtracts them, and addition first requires matching powers of 10.

## Linear equations and inequalities

### Solving equations

Think of an equation as a balanced scale: both sides have the same value. To keep it balanced, do the same operation to both sides. Use inverse operations to isolate the variable; adding undoes subtraction, and dividing undoes multiplication. Simplify each side first.

Example:

$$
\begin{aligned}
3(2x-1)&=15\\
6x-3&=15\\
6x&=18\\
x&=3.
\end{aligned}
$$

The first step distributes 3; the next adds 3 to both sides; the last divides both sides by 6. Each operation keeps the balance while moving toward $x$ alone.

If variables occur on both sides, collect variable terms on one side and constants on the other. The final statement may be:

* One value, such as $x=4$.
* No solution, such as $0=5$.
* All real numbers, such as $0=0$.

For equations with fractions, multiply every term by the least common denominator, then solve and check. For example, multiplying $\frac{x}{2}+\frac13=2$ by 6 gives $3x+2=12$. Never multiply only some terms.

### Literal equations and formulas

A literal equation relates multiple variables, such as $A=\frac12 bh$. It is a formula you can rearrange to make a different quantity the subject. Solving for a chosen variable uses the same inverse operations as solving a numerical equation: to find $h$ from $A=\frac12 bh$, undo “multiply by $b/2$” by multiplying by $2/b$, giving $h=\frac{2A}{b}$, assuming $b\ne0$.

### Inequalities

An inequality describes a whole range of values, not usually just one answer. Solve it like an equation, with one important rule: multiplying or dividing both sides by a negative number reverses the inequality sign. On the number line, multiplying by a negative flips every point across zero, reversing left and right; for example, $2<5$ becomes $-2>-5$.

Solutions can be shown on a number line, in interval notation, or as inequalities. For example, $x\ge2$ means start at 2 and include it, then shade to the right; in interval notation this is $[2,\infty)$. A bracket includes an endpoint; a parenthesis excludes it. Infinity always uses a parenthesis because infinity is not a number that can be reached.

A **compound inequality** joins conditions:

* “And” means both conditions must hold; $-2<x\le4$ represents an intersection.
* “Or” means either condition can hold; $x<-2$ or $x>4$ represents a union.

For polynomial or rational inequalities, move all terms to one side and factor the numerator and denominator. Mark real zeros and denominator restrictions on a number line, test one value in each interval, then select intervals with the required sign. Include zeros for $\le$ or $\ge$, but never include values that make an original denominator zero.

### Absolute-value equations and inequalities

Absolute value describes distance from zero (or, for $|x-a|$, distance from $a$). “Less than a distance” means inside an interval; “greater than a distance” means outside it. For $c>0$:

$$|x|=c\iff x=c\text{ or }x=-c,$$
$$|x|<c\iff -c<x<c,$$
$$|x|>c\iff x<-c\text{ or }x>c.$$

For example, $|x-3|<2$ asks for points less than 2 units from 3, so $1<x<5$. The same patterns apply to $|x-a|$. Check special cases: $|x|=0$ has one solution, while $|x|=c$ has no real solutions when $c<0$.

## Coordinate plane, relations, and functions

### Coordinates and graphing

Think of the coordinate plane as a map: the first coordinate tells how far to move left or right, and the second tells how far to move down or up. The axes meet at the origin $(0,0)$. An ordered pair $(x,y)$ gives horizontal position first, vertical position second. The $x$-intercept is where a graph reaches the $x$-axis ($y=0$); the $y$-intercept is where it reaches the $y$-axis ($x=0$).

To graph an equation in two variables, find ordered pairs that satisfy it and plot them, or use a known graph shape. A graph is a visual representation of all its solutions.

### Relations and functions

A **relation** is a set of input-output pairs. A **function** is like a machine: give it an allowed input and it returns exactly one output. If one input could produce two different outputs, it is not a function. On a graph, this is the vertical line test: a vertical line must hit at most one point.

Function notation $f(x)$ names the output for input $x$; it does not mean $f$ times $x$. Evaluate by feeding the input into the rule: if $f(x)=2x+1$, then $f(3)=7$. The **domain** is the set of inputs the machine accepts; the **range** is the set of outputs it can produce. For $f(x)=1/x$, zero is not an allowed input because division by zero is undefined. Also exclude inputs that make an even-root radicand negative, and respect restrictions from the real-world context.

Functions can be represented by equations, tables, graphs, recursive rules, or verbal descriptions. Moving between representations helps reveal behavior and meaning.

### Function operations, composition, and inverses

For functions $f$ and $g$:

$$
(f+g)(x)=f(x)+g(x),\quad
(fg)(x)=f(x)g(x),\quad
\left(\frac fg\right)(x)=\frac{f(x)}{g(x)}\quad(g(x)\ne0).
$$

Composition connects two function machines: the output of $g$ becomes the input of $f$, so $(f\circ g)(x)=f(g(x))$. Do the inside machine first. Order matters in general; $f(g(x))$ and $g(f(x))$ usually differ.

An inverse function undoes a function, like an undo button: if $f$ sends 3 to 7, its inverse sends 7 back to 3. Thus $f^{-1}(f(x))=x$ on the appropriate domains. To find an inverse, write $y=f(x)$, switch $x$ and $y$, and solve for $y$. A function must be one-to-one (each output came from only one input) to have an inverse function without restricting its domain; graphically, it must pass the horizontal line test. The graph of an inverse reflects across $y=x$ because input and output switch places.

### Transformations and symmetry

Think of transformations as moving or reshaping the original graph. Starting from $y=f(x)$:

* $f(x)+k$ shifts the graph up $k$; $f(x)-k$ shifts it down $k$.
* $f(x-h)$ shifts right $h$; $f(x+h)$ shifts left $h$.
* $af(x)$ stretches vertically if $|a|>1$, compresses if $0<|a|<1$, and reflects across the $x$-axis if $a<0$.
* $f(-x)$ reflects across the $y$-axis.
* $f(bx)$ scales horizontally by a factor of $1/|b|$; when $|b|>1$ it compresses, and when $0<|b|<1$ it stretches. A negative $b$ also reflects across the $y$-axis.

Transformations can be combined in forms such as $g(x)=a f(b(x-h))+k$. Track horizontal changes inside the input and vertical changes outside it; the order and signs matter.

An **even** function satisfies $f(-x)=f(x)$ and has $y$-axis symmetry. An **odd** function satisfies $f(-x)=-f(x)$ and has origin symmetry.

### Reading and comparing functions

From a graph, table, or formula, identify intercepts, intervals where the function is increasing or decreasing, where its values are positive or negative, local or absolute maxima and minima, symmetry, end behavior, and periodicity when applicable. Connect each feature to the quantities and units in a model.

The average rate of change from $x=a$ to $x=b$ is

$$\frac{f(b)-f(a)}{b-a},\qquad a\ne b.$$

This is the slope of the secant line joining $(a,f(a))$ and $(b,f(b))$—the average output change per input change over that interval. For a line it is its constant slope; for a nonlinear function it depends on the interval. Compare functions represented in different ways by evaluating the same feature (such as value, rate, or maximum) in each representation. The $x$-coordinates where $f(x)=g(x)$ are where their graphs cross, because the two outputs are equal; graphing or a table can estimate solutions when exact algebra is difficult.

### Piecewise functions

A piecewise function uses different rules on different parts of its domain, like a delivery fee that changes by distance range. To evaluate it, first identify which interval contains the input, then use that rule. At a boundary, pay attention to whether the interval includes the endpoint.

The absolute-value function $f(x)=|x|$ has a V-shaped graph with vertex $(0,0)$. Its transformations have form $f(x)=a|x-h|+k$, with vertex $(h,k)$; the sign of $a$ determines whether the V opens up or down.

## Linear functions and models

A linear function changes at a steady rate, so equal steps in $x$ always produce the same change in $y$ and the graph is a straight line. Slope is the line's steepness, or rise divided by run:

$$m=\frac{y_2-y_1}{x_2-x_1},\qquad x_2\ne x_1.$$

Slope is “change in $y$ per change in $x$.” For example, slope $2$ means the line rises 2 units for every 1 unit moved right. A positive slope rises from left to right; a negative slope falls; zero slope is horizontal. A vertical line has undefined slope because its run is zero, and is not a function of $x$.

Common line forms:

* **Slope-intercept**: $y=mx+b$, where $m$ is slope and $b$ is the $y$-intercept.
* **Point-slope**: $y-y_1=m(x-x_1)$, using slope $m$ and point $(x_1,y_1)$.
* **Standard**: $Ax+By=C$, often with integer coefficients.

In $y=mx+b$, $b$ is the starting output when $x=0$, and $m$ is how much the output changes per one-unit increase in input. For example, $y=2x+3$ starts at 3 and rises 2 for each step right. Point-slope form is useful when a point and rate are known; standard form is useful for comparing or solving equations together.

Parallel lines never meet, so nonvertical parallel lines have equal slopes. Perpendicular lines meet at a right angle; for two nonvertical lines their slopes are negative reciprocals, so $m_1m_2=-1$. A horizontal line and a vertical line are also perpendicular.

A proportional relationship has the form $y=kx$ and passes through the origin. A general linear relationship $y=mx+b$ has initial value $b$ and constant rate $m$.

To model a situation, identify the quantities and units, decide what the variables represent, determine the rate and initial value, write the equation, and interpret the answer in context. Common linear models include total cost with a fixed fee plus a per-unit rate, distance at constant speed, and unit conversion.

## Systems of equations and inequalities

A system is a set of conditions that must all be true at once. Its solution must satisfy every equation or inequality. For two linear equations, the solution is the point where both lines meet: that point lies on each line, so it satisfies both equations.

Methods for solving two-variable linear systems:

* **Graphing**: find the intersection; useful for visualization and estimates.
* **Substitution**: isolate a variable in one equation and replace it with its equal expression in the other. This reduces two unknowns to one.
* **Elimination**: multiply equations as needed, then add or subtract them so one variable cancels. This also reduces two unknowns to one.

Possible outcomes are one solution (intersecting lines), no solution (parallel distinct lines), or infinitely many solutions (the same line). Check a solution in both original equations.

A **system of linear inequalities** has a region of solutions. Graph each boundary line, use a solid line for $\le$ or $\ge$ and a dashed line for $<$ or $>$, shade the side satisfying the inequality, and keep the overlap. In applications, the overlap describes feasible choices.

A linear-quadratic system can have zero, one, or two intersection points. Solve by substitution or graph the curves and verify candidate points.

For example, in $x+y=7$ and $x-y=1$, adding the equations cancels $y$ and gives $2x=8$, so $x=4$ and then $y=3$. The point $(4,3)$ lies on both lines.

As an extension, write a linear system as $A\mathbf{x}=\mathbf{b}$. If the square coefficient matrix $A$ has an inverse, then $\mathbf{x}=A^{-1}\mathbf{b}$. For a $2\times2$ matrix $\begin{bmatrix}a&b\\c&d\end{bmatrix}$, the determinant is $ad-bc$; an inverse exists exactly when this determinant is nonzero, and then

$$A^{-1}=\frac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}.$$

Row reduction can solve systems without explicitly calculating an inverse.

## Sequences and patterns

A sequence is an ordered list or pattern of numbers. Its terms may be defined explicitly from the term number or recursively from earlier terms.

A sequence is also a function whose domain is usually a subset of the integers: its input is the term number and its output is the term value.

### Arithmetic sequences

An arithmetic sequence changes by the same amount each step, called the common difference $d$. In the formula, $a_1$ is the first term and $n$ is the term's position. It is like walking forward the same number of steps each time:

$$a_n=a_1+(n-1)d.$$

The recursive rule is $a_n=a_{n-1}+d$. The sum of the first $n$ terms is

$$S_n=\frac{n(a_1+a_n)}2.$$

For $4,7,10,\ldots$, the difference is 3, so $a_{10}=4+9\cdot3=31$.

### Geometric sequences

A geometric sequence is multiplied by the same factor each step, called the common ratio $r$. In the formula, $a_1$ is the starting term and the exponent $n-1$ counts how many multiplications have happened by term $n$. It models repeated growth or shrinkage by a percentage:

$$a_n=a_1r^{n-1}.$$

The recursive rule is $a_n=ra_{n-1}$. The finite sum is

$$S_n=a_1\frac{1-r^n}{1-r},\qquad r\ne1,$$

and $S_n=na_1$ if $r=1$. When $|r|<1$, the infinite sum converges:

$$S_\infty=\frac{a_1}{1-r}.$$

Arithmetic sequences model constant additive change; geometric sequences model constant multiplicative or percent change. The finite geometric-sum formula adds the first $n$ terms; the infinite formula applies only when the terms shrink toward zero ($|r|<1$).

## Polynomials and factoring

A polynomial is a sum of terms with nonnegative integer exponents, such as $3x^4-2x+7$. A one-term polynomial is a monomial, a two-term polynomial is a binomial, and a three-term polynomial is a trinomial. Polynomials can be added, subtracted, and multiplied; add or subtract by combining like terms, and multiply by distributing every term. FOIL—first, outer, inner, last—is just a checklist for distributing when both factors are binomials, not a separate rule.

### Factoring methods

Factoring rewrites a polynomial as a product, reversing distribution. It is like pulling out shared ingredients: $6x+9=3(2x+3)$. Factoring helps solve equations and reveal zeros. Always check for a greatest common factor first.

* **Greatest common factor**: $6x^2+9x=3x(2x+3)$.
* **Difference of squares**: $a^2-b^2=(a-b)(a+b)$.
* **Perfect-square trinomials**: $a^2+2ab+b^2=(a+b)^2$ and $a^2-2ab+b^2=(a-b)^2$.
* **Monic trinomial**: to factor $x^2+bx+c$, find numbers with product $c$ and sum $b$.
* **General trinomial**: for $ax^2+bx+c$, use a systematic split-middle-term or product-sum method, then group.
* **Grouping**: group terms so each group has a common binomial factor.
* **Sum and difference of cubes**: $a^3+b^3=(a+b)(a^2-ab+b^2)$ and $a^3-b^3=(a-b)(a^2+ab+b^2)$.

For example, $x^2+5x+6=(x+2)(x+3)$ because $2\cdot3=6$ and $2+3=5$.

The binomial theorem expands $(x+y)^n$ for a nonnegative integer $n$; coefficients come from Pascal's triangle or $\binom{n}{k}$. For example, $(x+y)^3=x^3+3x^2y+3xy^2+y^3$. This is an extension topic in some sequences.

Factoring can help solve $P(x)=0$ using the zero-product property: if $AB=0$, then $A=0$ or $B=0$.

### Polynomial division and zeros

Polynomial long division works like numerical long division: repeatedly divide leading terms, multiply back, and subtract. Synthetic division is a compact shortcut when dividing by $x-c$. The remainder theorem says the remainder when $P(x)$ is divided by $x-c$ is $P(c)$—evaluate at $c$ to get the remainder. The factor theorem says $x-c$ is a factor exactly when $P(c)=0$.

The rational root theorem gives possible rational zeros of a polynomial with integer coefficients: reduced candidates are $\pm\frac pq$, where $p$ divides the constant term and $q$ divides the leading coefficient. If the constant term is zero, factor out $x$ first. A candidate must still be tested. For a polynomial with real coefficients, nonreal complex roots occur in conjugate pairs.

The degree of a polynomial bounds its number of roots, counting multiplicity, and its number of turning points is at most one less than its degree. A zero with odd multiplicity usually crosses the $x$-axis; with even multiplicity it touches and turns. End behavior is determined by the leading term: even degree has matching end directions; odd degree has opposite end directions, with the leading coefficient determining which end rises.

## Quadratic functions and equations

A quadratic has degree 2 and includes an $x^2$ term:

$$y=ax^2+bx+c,\qquad a\ne0.$$

Its graph is a U-shaped parabola. It models things such as an object's height during a throw: the vertex is the highest or lowest point. If $a>0$ it opens up and has a minimum; if $a<0$ it opens down and has a maximum.

Three useful forms:

* **Standard**: $ax^2+bx+c$; setting $x=0$ shows the $y$-intercept is $(0,c)$.
* **Factored**: $a(x-r_1)(x-r_2)$; setting each factor to zero shows the $x$-intercepts (roots) are $r_1,r_2$.
* **Vertex**: $a(x-h)^2+k$; the squared part is smallest at $x=h$, so the vertex is $(h,k)$ and the axis of symmetry is $x=h$.

For standard form, the axis is $x=-\frac b{2a}$ and the vertex has $y$-coordinate $f(-\frac b{2a})$. Completing the square creates a perfect-square expression so the vertex is easier to see: for $x^2+bx$, add $\left(\frac b2\right)^2$; if the leading coefficient is not 1, first factor it from the quadratic and linear terms. For example,

$$x^2+6x+5=0\iff(x+3)^2=4\iff x=-1\text{ or }x=-5.$$

Completing the square works by preserving equality: whatever is added to one side must also be added to the other.

Solve $ax^2+bx+c=0$ by factoring, taking square roots, completing the square, or using the quadratic formula, which works for every quadratic with $a\ne0$:

$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}.$$

The discriminant $D=b^2-4ac$ is the part under the square root in the formula, so its sign tells what kind of roots are possible: $D>0$ gives two distinct real roots, $D=0$ one repeated real root, and $D<0$ two complex conjugate roots.

For a quadratic application, identify what the variable measures, set the model equal to the target value, solve, and reject answers that do not fit the situation. The vertex often gives a maximum or minimum, such as maximum height or minimum cost.

## Complex numbers

No real number squared equals $-1$, so mathematicians extend the real numbers with the imaginary unit $i$, defined by $i=\sqrt{-1}$ and $i^2=-1$. Powers repeat in a cycle of four: $i,i^2,i^3,i^4=i,-1,-i,1$.

Write a complex number as $a+bi$; think of it as a point $(a,b)$ on a plane, with a real coordinate and an imaginary coordinate. Add or subtract coordinates separately. Multiply using distribution and replace every $i^2$ with $-1$. The conjugate of $a+bi$ is $a-bi$; multiplying by its conjugate cancels the imaginary terms: $(a+bi)(a-bi)=a^2+b^2$. Use conjugates to simplify quotients with complex denominators.

Complex numbers allow solutions to equations such as $x^2+1=0$, which have no real roots.

## Radical and rational expressions, equations, and functions

### Rational expressions

A rational expression is a quotient of polynomials, like a fraction whose numerator and denominator contain variables. Its denominator cannot equal zero. Factor first, record excluded values from the original denominator, and then cancel common factors. Cancellation removes a factor from the formula but does not restore excluded inputs; for instance, canceling $(x-2)$ does not make the original expression defined at $x=2$.

To add or subtract rational expressions, use a common denominator. Multiply and divide as with fractions, factoring to simplify. State restrictions inherited from every original denominator.

For a rational equation, identify excluded values first, multiply by the least common denominator, solve the resulting equation, then check every candidate in the original equation. Clearing denominators can create extraneous answers.

### Radical equations

To solve an equation containing a radical, isolate the radical, then raise both sides to the needed power to undo the root. Solve and check every candidate in the original equation: squaring can create an answer that fits the squared equation but not the original one. For real square roots, radicands must be nonnegative.

### Rational and radical functions

A rational function has the form $f(x)=\frac{P(x)}{Q(x)}$. Its domain excludes zeros of the original denominator. A canceled common factor may create a **hole**: one missing point in an otherwise simplified curve. An uncanceled denominator zero may create a **vertical asymptote**: near that $x$-value the graph grows without bound in magnitude. Horizontal or slant asymptotes describe the line the graph approaches far to the left or right; a graph can sometimes cross an asymptote.

For a reduced rational function, if the numerator's degree is less than the denominator's, the horizontal asymptote is $y=0$; if the degrees are equal, it is the ratio of leading coefficients. If the numerator's degree is exactly one larger, polynomial division gives a slant asymptote from the quotient. Higher degree differences use the polynomial quotient as a polynomial asymptote.

Radical functions have domain restrictions from their radicands. Their graphs may begin or end at a boundary and can be shifted or reflected using function transformations.

## Exponential and logarithmic functions

### Exponential functions

An exponential function has the variable in the exponent:

$$f(x)=ab^x,\qquad b>0,\ b\ne1.$$

Here $a$ is the initial value (the output at $x=0$) and $b$ is the factor applied each time $x$ increases by 1. If $b>1$, the function grows; if $0<b<1$, it decays. A percent growth rate $r$ gives factor $1+r$, while a decay rate gives factor $1-r$. For example, 5% growth means multiply by $1.05$ each period.

For equally spaced inputs, constant first differences indicate a linear pattern: add the same amount each step. A constant ratio of successive nonzero outputs indicates an exponential pattern: multiply by the same factor each step. Build a model from a table, graph, or description by identifying the initial value and rate or factor.

For compound interest, $A=P(1+\frac rn)^{nt}$ for nominal annual rate $r$ written as a decimal, $n$ compounding periods per year, and time $t$ in years. Continuous compounding uses $A=Pe^{rt}$. Exponential models also describe population change, depreciation, and radioactive decay.

For the parent function $b^x$ with $b>1$, the domain is all real numbers, the range is positive real numbers, and the horizontal asymptote is $y=0$: the graph gets closer and closer to the $x$-axis in one direction without reaching it. A transformed function's domain, range, and asymptote change with its shifts and scale. Exponential growth eventually outpaces any fixed-degree polynomial as $x$ increases.

### Logarithms

A logarithm answers the question “to what exponent must I raise the base to get this number?” It is the inverse of exponentiation:

$$\log_b(x)=y\iff b^y=x,$$

where $b>0$, $b\ne1$, and $x>0$. The natural logarithm is $\ln(x)=\log_e(x)$.

Logarithm laws for positive $M,N$:

$$
\log_b(MN)=\log_b M+\log_b N,\quad
\log_b\left(\frac MN\right)=\log_b M-\log_b N,\quad
\log_b(M^p)=p\log_b M.
$$

Also, $\log_b(1)=0$, $\log_b(b)=1$, $b^{\log_b x}=x$, and $\log_b(b^x)=x$. Change of base:

$$\log_b x=\frac{\ln x}{\ln b}=\frac{\log x}{\log b}.$$

The parent logarithm $\log_b x$ has domain $x>0$, range all real numbers, and vertical asymptote $x=0$: the graph approaches the $y$-axis but has no value there. Exponential and logarithmic graphs are inverses and reflect across $y=x$. For example, $\log_2 8=3$ because $2^3=8$.

To solve exponential equations, first rewrite both sides with the same base when possible. Otherwise take logarithms of both sides; the logarithm lets the exponent come down so it can be solved. To solve logarithmic equations, combine or expand logs only when their arguments satisfy the domain, convert to exponential form when useful, and check the original equation. Every logarithm's argument must be positive.

## Other function families and course-dependent topics

These topics appear in some Algebra 2 courses or are taught alongside Algebra 1 and 2, depending on the school.

### Direct and inverse variation

Direct variation has the form $y=kx$; inverse variation has the form $y=\frac{k}{x}$, where $k$ is a constant. Joint and combined variation extend these forms, such as $y=kxz$ or $y=\frac{kx}{z}$. Determine $k$ from known values before using the model.

### Conic sections

Completing the square can rewrite equations to expose graph features. A circle is the set of points the same distance from a center; that fixed distance is its radius. Its equation is

$$ (x-h)^2+(y-k)^2=r^2,$$

with center $(h,k)$ and radius $r$. The distance and midpoint formulas are

$$d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2},\qquad
M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right).$$

Some courses extend this to parabolas, ellipses, and hyperbolas.

An ellipse is an oval: the sum of distances from any point on it to two fixed points (the foci) is constant. A centered ellipse has form

$$\frac{(x-h)^2}{a^2}+\frac{(y-k)^2}{b^2}=1$$

with the denominators swapped for a vertical oval. A hyperbola has two separate branches and consists of points whose difference in distances from two fixed foci has a constant size. Its centered form is

$$\frac{(x-h)^2}{a^2}-\frac{(y-k)^2}{b^2}=1$$

or the version with the negative term first, which opens vertically instead of horizontally. For a vertical-axis parabola, $y=a(x-h)^2+k$ has vertex $(h,k)$; for a horizontal-axis parabola, $x=a(y-k)^2+h$. Completing the square helps identify centers, vertices, and radii or axis lengths.

### Data, statistics, and probability

Dot plots, histograms, and box plots summarize one quantitative variable. A dot plot counts repeated values, a histogram groups values into ranges, and a box plot gives a quick five-number summary. In a box plot, the box runs from the first quartile $Q_1$ to the third quartile $Q_3$ and the interquartile range is $Q_3-Q_1$, the spread of the middle half of the data. Compare distributions by shape, center, and spread; extreme outliers can pull the mean and standard deviation more than the median and interquartile range. Use statistics that fit the data's shape.

Scatterplots show paired quantitative data. A positive association tends to rise, a negative association tends to fall, and no association has no clear trend. A line of best fit models an approximately linear pattern; its slope estimates change in the response per unit change in the explanatory variable and its intercept gives the model's value at input zero. A residual is observed value minus predicted value; patterns in residuals can show that a linear model is a poor fit. Correlation describes the strength and direction of a linear relationship, but does not establish causation. Use the model for interpolation cautiously and avoid extrapolating far beyond observed data.

For a data set, the mean is the arithmetic average, the median is the middle after sorting (or the average of the two middle values for an even-sized data set), the mode is the most frequent value, and the range is maximum minus minimum. Standard deviation describes a typical distance from the mean: a small standard deviation means values cluster close to the mean; a large one means they are more spread out. A standardized score is $z=\frac{x-\mu}{\sigma}$, where $\mu$ is the mean and $\sigma>0$ is the standard deviation; it measures how many standard deviations $x$ is from the mean. For an approximately normal (bell-shaped) distribution, about 68%, 95%, and 99.7% of values fall within one, two, and three standard deviations of the mean, respectively; do not use this rule for strongly non-normal data.

For a finite sample space, an **event** is a set of outcomes. For equally likely outcomes, $P(E)=\frac{\text{favorable outcomes}}{\text{possible outcomes}}$. The complement is “not $E$,” so $P(E^c)=1-P(E)$. The addition rule avoids counting outcomes in both events twice: $P(A\cup B)=P(A)+P(B)-P(A\cap B)$. Conditional probability means the information that $B$ happened changes the sample space: $P(A\mid B)=\frac{P(A\cap B)}{P(B)}$ when $P(B)>0$. Events are independent when knowing $B$ happened does not change the chance of $A$: $P(A\mid B)=P(A)$, equivalently $P(A\cap B)=P(A)P(B)$. For dependent events, use $P(A\cap B)=P(A)P(B\mid A)$.

Two-way tables organize two categorical variables, such as grade and favorite subject. Joint relative frequencies use the whole table as the denominator; marginal relative frequencies use a row or column total; conditional relative frequencies use the given group's total. Comparing conditional frequencies asks whether a category is more common in one group than another, helping identify possible associations.

For a discrete random variable $X$ with outcomes $x_i$ and probabilities $p_i$, expected value is $E(X)=\sum_i x_i p_i$. It is the long-run average outcome, not necessarily an outcome that can occur on one trial. The fundamental counting principle multiplies the number of choices at successive stages. Factorial notation is $n!=n(n-1)\cdots2\cdot1$, with $0!=1$. Permutations count ordered selections, $P(n,r)=\frac{n!}{(n-r)!}$; combinations count unordered selections, $\binom nr=\frac{n!}{r!(n-r)!}$. Counting formulas and expected value are extensions in some courses.

Statistical inference uses a random sample to learn about a larger population—like tasting a spoonful of soup to judge the whole pot. A biased sample can misrepresent the population. Surveys collect responses, observational studies record conditions without assigning treatments, and experiments assign treatments; random assignment supports cause-and-effect comparisons. Simulations can help assess whether sample results are surprising under a proposed model. Margin of error describes the expected wiggle in a sample-based estimate; larger, well-chosen random samples usually reduce it. Evaluate how data were gathered before accepting a claim.

### Introductory trigonometry and matrices

Some Algebra 2 courses introduce right-triangle trigonometry. For a chosen angle, the mnemonic SOH-CAH-TOA gives $\sin\theta=\frac{\text{opposite}}{\text{hypotenuse}}$, $\cos\theta=\frac{\text{adjacent}}{\text{hypotenuse}}$, and $\tan\theta=\frac{\text{opposite}}{\text{adjacent}}$. “Opposite” and “adjacent” are named relative to that angle. The Pythagorean theorem is $a^2+b^2=c^2$ for a right triangle, where $c$ is the hypotenuse.

In more advanced trigonometry, angles may be measured in radians on the unit circle. For a point $(x,y)$ on the unit circle at angle $\theta$, $\cos\theta=x$ and $\sin\theta=y$; $\tan\theta=\frac{y}{x}$ when $x\ne0$. The identity $\sin^2\theta+\cos^2\theta=1$ follows from the circle equation. Sine and cosine graphs are periodic; in $y=A\sin(B(x-h))+k$, amplitude is $|A|$, period is $\frac{2\pi}{|B|}$, phase shift is $h$, and midline is $y=k$. Radian measure, unit-circle values, inverse trig, and trig identities are usually treated as extensions or precalculus topics.

Matrices are rectangular arrays of numbers, useful for compactly organizing many equations or data. Add or subtract matrices entry by entry; scalar multiplication multiplies every entry; matrix multiplication takes row-by-column dot products and is defined only when the inner dimensions match. Matrix multiplication is generally not commutative: the order can change the result. A vector represents a quantity with magnitude and direction, like a movement that has both length and heading; add vectors componentwise and multiply a vector by a scalar componentwise. Matrix methods, vectors, advanced trigonometry, and detailed conic analysis are extensions in many course sequences rather than universal Algebra 1/2 requirements.

## Translating and solving word problems

1. Identify the unknown quantity and assign a variable, including units.
2. Translate relationships into an expression, equation, inequality, function, or system.
3. Solve using an appropriate method and keep exact values until rounding is needed.
4. Check that the answer satisfies the original conditions and has sensible units and magnitude.
5. State the answer in context; reject mathematically valid values that violate the situation.

Common contexts include distance-rate-time ($d=rt$), work rates, percent increase/decrease, mixtures, consecutive integers, geometry, tickets and prices, and break-even models. Drawing a table or diagram often clarifies how quantities are related.

## Common checks and mistakes

* Substitute a solution into the original equation or system.
* Check domain restrictions before and after solving rational, radical, and logarithmic equations.
* Distribute to every term, including signs: $-(x-3)=-x+3$.
* Combine only like terms; $x^2+x$ cannot be combined.
* Cancel common factors in rational expressions, never individual terms across addition or subtraction.
* Apply the negative-factor rule when solving inequalities.
* Keep parentheses when substituting negative values, as in $(-3)^2=9$.
* Distinguish $-x^2$ from $(-x)^2$: they equal $-x^2$ and $x^2$, respectively.
* Remember that $\sqrt{x^2}=|x|$ over the real numbers.
* Check whether a word problem asks for an exact value, an approximate value, or a contextual interpretation.

## Standards references

These official high-school standards are a coverage cross-check, not a fixed Algebra 1 versus Algebra 2 course map; districts sequence topics differently:

* [High School Algebra](https://www.thecorestandards.org/Math/Content/HSA/)
* [High School Functions](https://www.thecorestandards.org/Math/Content/HSF/)
* [High School Number and Quantity](https://www.thecorestandards.org/Math/Content/HSN/)
* [High School Statistics and Probability](https://www.thecorestandards.org/Math/Content/HSS/)
* [High school course pathways and transitions](https://www.thecorestandards.org/Math/Content/note-on-courses-transitions/courses-transitions/)
