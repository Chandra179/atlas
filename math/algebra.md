---
title: Algebra I and II
aliases: []
created: '2026-06-13'
---

# Algebra

This note is a study reference for the main skills commonly taught across Algebra I and Algebra II. Course boundaries vary by school. Sections marked **Precalculus extension** go beyond that core.

**Fundamentals**

### **Number**

**Real number**

![Real number line with integers and fractions marked at regular intervals](<../assets/linear_number_line.png>)

The square of every real number is nonnegative, so $\sqrt{-9}$ is not a real number. Complex numbers extend the real numbers with $i^2=-1$, making $\sqrt{-9}=3i$.

***

**Natural numbers** are counting numbers $1,2,3,\ldots$; some books include 0, so check the convention being used.

**Whole numbers** are $0,1,2,3,\ldots$. **Integers** include whole numbers and their negatives: $\ldots,-2,-1,0,1,2,\ldots$.

**Rational numbers** can be written as $p/q$ for integers $p,q$ with $q\ne0$; their decimal forms terminate or repeat. **Irrational numbers** are real numbers that cannot be written as such a fraction, such as $\sqrt2$, $\pi$, and $e$.

**Real numbers** are all rational and irrational numbers on the number line. **Complex numbers** have the form $a+bi$ for real $a,b$ and $i^2=-1$.

**Variables** (like $x$ or $y$)

**Coefficients** (the number multiplying the variable, like the 3 in $3x^2$)

**Terms** (parts separated by addition/subtraction, like $3x^2$, $-5x$, and $7$)

**Constant** Term (the term with no variable, like 7)

An **expression** has no equality sign; an **equation** says two expressions are equal. In $-4x^2+7x-3$, the terms are $-4x^2$, $7x$, and $-3$. Like terms have identical variable parts, so $3x^2-5x^2+2x=-2x^2+2x$.

Use order of operations: grouping symbols, exponents, multiplication and division from left to right, then addition and subtraction from left to right. For example, $3+2(5-1)^2=35$.

Addition and multiplication are commutative ($a+b=b+a$, $ab=ba$), and have identities 0 and 1 ($a+0=a$, $a\cdot1=a$). The additive inverse $-a$ undoes adding $a$; for $a\ne0$, the reciprocal $1/a$ undoes multiplying by $a$.

***

#### **Distributive Property**

* $a(b + c) = ab + ac$
* $a(b - c) = ab - ac$
* $(a + b)(x + y) = \underbrace{a(x + y)}_{\text{Distribute } a} + \underbrace{b(x + y)}_{\text{Distribute } b}$

Imagine you are buying items for a school trip:

First Group ($\mathbf{a+b}$): The number of people going.
* $a = 10$ students.
* $b = 2$ teachers.
* $\mathbf{a+b = 12}$ people.
Second Group ($\mathbf{x+y}$): The cost per person.
* $x = 5$ dollars for lunch.
* $y = 3$ dollars for a drink/snack.
* $\mathbf{x+y = 8}$ dollars total cost per person.

The total cost is the product of the two: $(10 + 2)(5 + 3)$

|               | Lunch (5 dollars)           | Snack (3 dollars)           |
| ------------- | --------------------------- | --------------------------- |
| Students (10) | $10 \times 5 = \mathbf{50}$ | $10 \times 3 = \mathbf{30}$ |
| Teachers (2)  | $2 \times 5 = \mathbf{10}$  | $2 \times 3 = \mathbf{6}$   |

Total Cost = $50 + 30 + 10 + 6 = \mathbf{96}$ dollars

***

#### **Associative Property**

* $(a + b) + c = a + (b + c)$
* $(ab) c = a (bc)$

Associativity changes grouping; commutativity changes order. Subtraction and division are not commutative or associative.

***

#### Fractions

![Properties of fractions: addition, subtraction, multiplication, and division rules](<../assets/prop_of_fractions.png>)

For nonzero denominators, add or subtract using a common denominator, multiply numerators together and denominators together, and divide by multiplying by the reciprocal. A ratio $a:b$ is $a/b$ when $b\ne0$; a percent $p\%$ means $p/100$. A proportion $a/b=c/d$ with $b,d\ne0$ implies $ad=bc$; for example, $3/4=x/20$ gives $x=15$. A 15% discount on a 40-dollar item is $0.15\cdot40=6$, leaving a sale price of 34 dollars.

***

### **Integer Exponents**

![Laws of exponents: product, quotient, power, and zero exponent rules](<../assets/laws_of_exponent.png>)

A product of identical numbers is usually written in exponential notation

For integer exponents, the quotient rule requires a nonzero base: $x\ne0$ in $x^a/x^b=x^{a-b}$. The quotient $a/b$ in $(a/b)^n$ also requires $b\ne0$. Also, $x^0=1$ and $x^{-n}=1/x^n$ for $x\ne0$. A negative exponent means reciprocal, not a negative value.

* $2^5 = 2 \times 2 \times 2 \times 2 \times 2 = 32$
* $\left(\frac{1}{2}\right)^5 = \frac{1^5}{2^5}$
* $\left(\frac{2}{5}\right)^6 = \frac{2^6}{5^6}$
* $x^a \cdot x^b = x^{a+b}$
* $\frac{x^a}{x^b} = x^{a-b}$
* $\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$
* $(x^a)^b = x^{ab}$

Scientific notation writes a number as $c\times10^n$, where $1\le|c|<10$ and $n$ is an integer. For example, $4{,}500{,}000=4.5\times10^6$ and $0.00045=4.5\times10^{-4}$. When multiplying or dividing, add or subtract the powers of 10; when adding, first rewrite with matching powers.

***

### **Radicals**

![Properties of nth roots: product, quotient, and power rules for radicals](<../assets/prop_of_roots.png>)

The number inside the root _must_ be a result of something being raised to the power of $n$

For real numbers $a,b\ge0$, $\sqrt{ab}=\sqrt a\sqrt b$; more generally, an even root of a real number requires a nonnegative radicand. To simplify, factor out perfect powers. For example, simplify $\sqrt[4]{81x^8y^4}$.

$\sqrt[4]{81x^8y^4} = \sqrt[4]{81}\sqrt[4]{x^8}\sqrt[4]{y^4}$ This step uses Property 1 ($\sqrt[n]{ab} = \sqrt[n]{a} \cdot \sqrt[n]{b}$) to separate the single radical into a product of three individual radicals.

$$= 3\sqrt[4]{(x^2)^4}|y|$$

This step simplifies each of the three terms separately:

1. Simplifying $\sqrt[4]{81}$ Since $3^4 = 3 \times 3 \times 3 \times 3 = 81$, the fourth root of 81 is 3.
2. Simplifying $\sqrt[4]{x^8}$:

* This is rewritten by expressing $x^8$ as a power of 4: $x^8 = (x^2)^4$.
* The term becomes $\sqrt[4]{(x^2)^4}$.

3. Simplifying $\sqrt[4]{y^4}$

* This uses Property 5 ($\sqrt[n]{a^n} = |a|$, if $n$ is even). Since $n=4$ (even), the fourth root of $y^4$ must be the absolute value of $y$, or $|y|$.

$$= 3x^2|y|$$

Simplifying $\sqrt[4]{(x^2)^4}$

* This uses Property 5 again. The $n$th root cancels the $n$th power, and since $n=4$ is even, we use the absolute value: $\sqrt[4]{(x^2)^4} = |x^2|$.
* However, because any real number squared ($x^2$) is always non-negative, the absolute value signs are not necessary. So, $|x^2|$ simplifies to just $x^2$.

The final simplified expression is $3x^2|y|$.

The key takeaway is that the absolute value signs are essential when simplifying an even root of a variable raised to the same power (like $\sqrt[4]{y^4}$), unless you are certain the result is non-negative (like in the case of $x^2$).

***

#### Rational Exponent

$$a^{\frac{m}{n}} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m$$

$8^{\frac{2}{3}} =(\sqrt[3]{8})^2 = 2^2 = 4.$

For real-valued expressions, reduce $m/n$ first. If $n$ is even, a real principal root requires $a\ge0$; if $n$ is odd, negative bases are allowed. Negative exponents also require a nonzero base.

### Product Formulas

![Special product formulas: difference of squares, perfect square trinomials, cube of binomials](<../assets/product_formulas.png>)

$$(3x + 4)(3x - 4) = (3x)^2 - (4)^2$$

$$(3x + 4)(3x - 4) = 9x^2 - 16$$

$$(2y + 5)^2 = (2y)^2 + 2(2y)(5) + (5)^2$$

$$(2y + 5)^2 = 4y^2 + 20y + 25$$

$$(z - 6)^2 = (z)^2 - 2(z)(6) + (6)^2$$

$$(z - 6)^2 = z^2 - 12z + 36$$

$$(x + 2)^3 = (x)^3 + 3(x)^2(2) + 3(x)(2)^2 + (2)^3$$

$$(x + 2)^3 = x^3 + 6x^2 + 12x + 8$$

$$(2m - 1)^3 = (2m)^3 - 3(2m)^2(1) + 3(2m)(1)^2 - (1)^3$$

$$(2m - 1)^3 = 8m^3 - 3(4m^2)(1) + 3(2m)(1) - 1$$

$$(2m - 1)^3 = 8m^3 - 12m^2 + 6m - 1$$

### Rational

A rational expression is simply a fraction (a ratio) where both the numerator (top) and the denominator (bottom) are polynomials. It is also sometimes referred to as an algebraic fraction.

$\frac{x^2 + 5x + 6}{x^2 - 4} = \frac{(x + 2)(x + 3)}{(x - 2)(x + 2)}$

$$\frac{\cancel{(x + 2)}(x + 3)}{(x - 2)\cancel{(x + 2)}} = \frac{x + 3}{x - 2}$$

The original expression excludes $x=2$ and $x=-2$. Even after cancelling $(x+2)$, both restrictions remain; $x=-2$ is a hole in the simplified graph.

A rational expression can be written in the form $\frac{P(x)}{Q(x)}$, where $P(x)$ and $Q(x)$ are polynomials.

The denominator, $Q(x)$, cannot be equal to zero. Division by zero is undefined.

#### **Greatest Common Factor (GCF)**

* GCF of $10x^4 - 15x^3 + 5x^2$.
* Coefficients (10, 15, 5): The largest number that divides all three is $\mathbf{5}$.
* Variable ($x^4, x^3, x^2$): The lowest power is $\mathbf{x^2}$.
* GCF: $5x^2$

#### Operations and Rational Equations

For rational expressions, first factor numerator and denominator where possible. Multiply straight across; divide by multiplying by the reciprocal. To add or subtract, use a common denominator. Keep the original restrictions: any value that makes an original denominator zero remains excluded after simplifying.

$$\frac{1}{x}+\frac{2}{x+1}=\frac{x+1+2x}{x(x+1)}=\frac{3x+1}{x(x+1)},\qquad x\ne0,-1.$$

For multiplication, factor before cancelling and keep the original restrictions. For example,

$$\frac{x^2-1}{x+2}\cdot\frac{x+2}{x-1}=x+1,\qquad x\ne-2,1.$$

To solve a rational equation, state excluded values first, multiply every term by the least common denominator, solve, and reject any excluded values. For example,

$$\frac{1}{x}+\frac{1}{x+1}=1,\qquad x\ne0,-1.$$

Multiplying by $x(x+1)$ gives $(x+1)+x=x(x+1)$, so $x^2-x-1=0$. Thus $x=\frac{1\pm\sqrt5}{2}$; neither value is excluded, so both are valid.

***

### Factoring

**Greatest Common Factor (GCF)**

This is always the first step. You look for the largest number or variable that divides evenly into every single term.

$$3x^2 + 6x = 3x(x + 2)$$

***

**Difference of Squares**

Used for two terms that are both perfect squares being subtracted.

* $a^2 - b^2 = (a - b)(a + b)$
* The _sum_ of squares ($a^2 + b^2$) cannot be factored using real numbers.

***

**Factoring Trinomials**

($x^2 + bx + c$)

Used for three terms where the $x^2$ coefficient is 1. You look for two numbers that multiply to $c$ and add to $b$.

$x^2 + 5x + 6 = (x + 2)(x + 3)$ (Because $2 \times 3 = 6$ and $2 + 3 = 5$)

When the leading coefficient is not 1, look for factors whose product is $ac$ and whose sum is $b$. For example, $2x^2+7x+3=(2x+1)(x+3)$.

***

**Factor by Grouping**

Group the first two terms and the last two terms. Find the GCF for each pair.

$$(2x^2 + 1x) + (6x + 3)$$

* The GCF of $(2x^2 + 1x)$ is $x$. Result: $x(2x + 1)$
* The GCF of $(6x + 3)$ is $3$. Result: $3(2x + 1)$

Notice that $(2x + 1)$ is now common to both parts. "Pull it out" as one factor.

$$(2x + 1)(x + 3)$$

***

**Sum or Difference of Cubes**

Used for two terms that are perfect cubes.

* Sum: $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$
* Difference: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$

### Equations

![Properties of equality: additive, multiplicative, reflexive, symmetric, and transitive](<../assets/prop_equality.png>)

A linear equation has variables only to the first power. In two variables, its graph is a straight line.

* $y = mx + b$
* $ax + by = c$

Examples of nonlinear equations, which have a variable with exponent greater than 1:

* $y = 3x^2 - 4x + 1$
* $x^3 + y = 7$

Quadratic equations are essential for modeling paths, areas, and optimization problems. Their standard form is $ax^2+bx+c=0$, where $a\ne0$ and $a,b,c$ are coefficients.

#### Solving Linear Equations

An equation stays equivalent when the same operation is applied to both sides. Simplify, collect variable terms on one side, and isolate the variable. For example:

$$\begin{aligned}
3(2x-1)&=15\\
6x-3&=15\\
6x&=18\\
x&=3.
\end{aligned}$$

For equations with fractions, multiply every term by the least common denominator, then solve. Check the result in the original equation. A linear equation can have one solution, no solution (such as $0=5$ after simplification), or every real number as a solution (such as $0=0$).

#### Rearranging Formulas

Treat other letters as constants and use inverse operations to isolate the requested variable. For $A=\frac12 bh$, solving for $h$ gives $h=\frac{2A}{b}$, provided $b\ne0$.

#### Radical Equations

Isolate the radical, raise both sides to the needed power, solve, then check candidates in the original equation because raising to a power can introduce extraneous answers. For example,

$$\sqrt{x+5}=x-1.$$

The right side must be nonnegative, so $x\ge1$. Squaring gives $x+5=(x-1)^2$, or $(x-4)(x+1)=0$. Only $x=4$ meets the restriction and the original equation, so the solution is $x=4$.

### **Discriminant**

$$\mathbf{D = b^2 - 4ac}$$

$$3x^2 + 5x + 1 = 0$$

* $a$: The number in front of $x^2$ (In this case, 3).
* $b$: The number in front of $x$ (In this case, 5).
* $c$: The "constant" number at the end (In this case, 1).

$$25 - 12 = \mathbf{13}$$

The discriminant is $D=b^2-4ac$. If $D>0$, a quadratic has two distinct real roots; if $D=0$, it has one repeated real root; if $D<0$, it has two nonreal complex-conjugate roots. Here $D=13>0$, so $3x^2+5x+1=0$ has two real roots.

### Complex Numbers

Real number + imaginary number

$$a + bi$$

The Real Part ($a$): These are normal numbers like $5$, $-3$

The Imaginary Part ($bi$): This is a real number multiplied by $i$

![Complex number representation in standard form a+bi with real and imaginary parts](<../assets/complex_number_table.png>)

Imagine you are controlling a drone.

* The Real part ($a$) is how far East the drone is.
* The Imaginary part ($bi$) is how far North the drone is.

You want to fly your drone to a specific landmark. You know that:

1. The drone is currently at $3 + 4i$ (3 miles East, 4 miles North).
2. The landmark is located at $5 - 2i$ (5 miles East, 2 miles South).

If you want the drone to fly in a straight line from its current spot to the landmark, what is the "path" (the difference) it needs to take?

To find the path, we subtract the current position from the destination:

$$(5 - 2i) - (3 + 4i)$$

* East/West change: $5 - 3 = 2$ (Go 2 miles further East)
* North/South change: $-2i - 4i = -6i$ (Go 6 miles South)

The Path: The drone needs to move $2 - 6i$

Complex numbers are added by combining real and imaginary parts, and multiplied using $i^2=-1$:

$$ (2+3i)(1-2i)=2-4i+3i-6i^2=8-i. $$

To divide, multiply the numerator and denominator by the denominator's conjugate. For example,

$$\frac{1+i}{2-i}=\frac{(1+i)(2+i)}{(2-i)(2+i)}=\frac{1+3i}{5}.$$

The denominator must be nonzero. A nonzero complex number $a+bi$ has conjugate $a-bi$, and $(a+bi)(a-bi)=a^2+b^2>0$.

If you want to tell that drone to "turn 90 degrees," you don't need a complicated formula; you just multiply its position by $i$.

* Current position: $3 + 4i$
* Rotate 90°: $(3 + 4i) \times i = 3i + 4i^2$
* Since $i^2 = -1$, this becomes $-4 + 3i$.

| Power | Simplified | Rule                          |
| ----- | ---------- | ----------------------------- |
| $i^1$ | $i$        | Remainder of 1                |
| $i^2$ | $-1$       | Remainder of 2                |
| $i^3$ | $-i$       | Remainder of 3                |
| $i^4$ | $1$        | Remainder of 0 (no remainder) |

<img src="../assets/flip_imaginary.png" alt="90-degree rotation of a complex number on the complex plane after multiplying by i" width="375">

**The 180-Degree "Flip"**

Think of the number line. If you are at 1 and you multiply by $-1$, you "flip" over to $-1$.

* Geometrically, this is a 180-degree rotation around the center (zero).
* If you multiply by $-1$ again, you flip back to 1. Another 180 degrees.
* Total rotation for two steps: $180^\circ + 180^\circ = 360^\circ$ (a full circle).

Now, look at the math definition: $i \times i = -1$ This means that doing the "multiply by $i$" action twice is the exact same thing as "multiplying by $-1$" once.

If "multiplying by $-1$" is a 180-degree turn, then "multiplying by $i$" must be half of that turn to make the math work. Half of 180 degrees is 90 degrees.

### Guidelines for Modeling with Equations

1. Identify the Variable. **Identify the quantity** that the problem asks you to find. This quantity can usually be determined by a careful reading of the question that is posed at the end of the problem. Then introduce notation for the variable (call it x or some other letter).
2. Translate from **Words to Algebra**. Read each sentence in the problem again, and express all the quantities mentioned in the problem in terms of the variable you defined in Step 1. To organize this information, it is sometimes helpful to draw a diagram or make a table.
3. Set Up the Model. Find the crucial fact in the problem that gives a relationship between the expressions you listed in Step 2. Set up an equation (or model) that expresses this relationship.
4. Solve the Equation and Check Your Answer. Solve the equation, check your answer, and state your answer as a sentence.

A car rental company charges 30 dollars per day and 15 cents per mile. A tourist rents a car for two days, and the bill comes to 108 dollars. How many miles was the car driven?

* Let $x$ = the number of miles driven.
* Daily cost: The charge is 30 dollars per day, so two days cost $2 \times 30 = 60$ dollars.
* Mileage cost: At 15 cents per mile, $x$ miles cost $0.15x$ dollars.
* Total bill: 108 dollars.
* $\text{Daily Cost} + \text{Mileage Cost} = \text{Total Bill}$
* $60 + 0.15x = 108$
* Subtracting 60 gives $0.15x=48$; dividing by 0.15 gives $x=320$ miles.

### Systems of Equations

A solution to a system makes every equation true at the same time. Graphically, it is an intersection point. Use substitution when one variable is already isolated; use elimination when adding or subtracting equations removes a variable.

For example, solve $x+y=7$ and $2x-y=5$. Add the equations to eliminate $y$: $3x=12$, so $x=4$. Substitute into $x+y=7$ to get $y=3$. The solution is $(4,3)$.

A system may have one solution, no solution (parallel lines), or infinitely many solutions (the same line). When modeling a real situation, check that the solution also makes sense in context.

A system can also combine a line and a curve. For $y=x^2$ and $y=2x+3$, set the expressions equal: $x^2=2x+3$, so $x=-1$ or $x=3$. The intersection points are $(-1,1)$ and $(3,9)$.

For systems of linear inequalities, graph each boundary and shade the side satisfying that inequality. The solution is the overlap of the shaded regions; use a solid boundary for $\leq$ or $\geq$ and a dashed boundary for $<$ or $>$.

For $y\ge x+1$ and $y<3$, the solution is the region above or on $y=x+1$ and below (but not on) $y=3$. This overlap exists for $x<2$.

### Inequalities

![Rules for solving inequalities: multiplying by a negative flips the inequality sign](<../assets/inequalities_rules.png>)

A one-variable linear inequality has the variable to the first power; its solution is a ray, all real numbers, or the empty set on a number line. A two-variable linear inequality typically has a boundary line and a half-plane of solutions.

* $ax + b < c$ or $y > mx + b$
* $2x + 3 \leq 7$

Subtract 3: $2x \leq 4$. Divide by 2: $x \leq 2$. If both sides are multiplied or divided by a negative number, reverse the inequality sign.

A nonlinear inequality contains a variable with a power other than 1 (like $x^2$, $x^3$), or variables multiplied together, or variables in a denominator.

* Quadratic ($x^2$), Rational ($\frac{1}{x}$), or Absolute Value ($|x|$).
* $x^2 - 4 > 0$

Find the "critical points" where $x^2 - 4 = 0$. This happens at $x = 2$ and $x = -2$.

Test the intervals:

* If $x = 0$ (between -2 and 2): $0^2 - 4 > 0$ is False.
* If $x = 3$ (greater than 2): $3^2 - 4 > 0$ is True.
* If $x = -3$ (less than -2): $(-3)^2 - 4 > 0$ is True. The solution is $x < -2$ or $x > 2$.

### **Intervals**

![Interval notation: open, closed, and half-open intervals with bracket and parenthesis notation](<../assets/interval_notation.png>)

### **Absolute Value**

![Properties of absolute value: definition, distance interpretation, and inequality rules](<../assets/prop_absolute_value.png>)

Absolute value is distance from zero, so $|x|\ge0$. Equations and inequalities can be read as distance statements. For $c>0$:

* $|x|=c$ means $x=c$ or $x=-c$. For example, $|x-2|=3$ gives $x=5$ or $x=-1$.
* $|x|<c$ means $-c<x<c$; $|x|>c$ means $x<-c$ or $x>c$.

For example, $|x-2|<3$ means $-3<x-2<3$, so $-1<x<5$. For $\leq$ or $\geq$, include the boundary points. If $c\le0$, check directly: a strict bound such as $|x|<c$ has no solutions, while $|x|\le0$ gives only $x=0$.

### Coordinate Plane, Graphs of Equations, Line, Circles

<img src="../assets/coordinate_plane.png" alt="Coordinate plane with x-axis, y-axis, quadrants I through IV, and origin" width="563">

**Distance formula** $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$

* The Subtraction $(x_2 - x_1)$: This is just a math way of saying "how many steps did I walk sideways?" If you start at $x=2$ and end at $x=5$, you walked $5 - 2 = 3$ steps.
* The Squaring $(...)^2$: This comes directly from Pythagoras ($a^2 + b^2 = c^2$). Squaring also makes sure that even if you walk "backwards" (negative numbers), the result becomes positive, because distance is always positive.
* The Plus Sign $(+)$: We add the "sideways steps" squared and the "upward steps" squared together, just like $a^2 + b^2$.
* The Square Root $(\sqrt{\dots})$: In the Pythagorean theorem, we have $c^2$. To get just $c$ (the distance), we have to "undo" the square by taking the square root.

**Example**

<img src="../assets/coorplane_example.png" alt="Coordinate plane with points A(5,3), P(1,-2), and Q(8,9) to compare distances" width="375">

The goal is to find which point is closer to $A(5, 3)$. To do that, we find the distance to $P(1, -2)$ and the distance to $Q(8, 9)$.

Distance from $A(5, 3)$ to $P(1, -2)$

* Step 1 (Subtract): $5 - 1 = 4$ and $3 - (-2) = 5$
* Step 2 (Square): $4^2 = 16$ and $5^2 = 25$
* Step 3 (Add): $16 + 25 = 41$
* Step 4 (Root): The distance is $\sqrt{41} \approx \mathbf{6.40}$

Distance from $A(5, 3)$ to $Q(8, 9)$

* Step 1 (Subtract): $5 - 8 = -3$ and $3 - 9 = -6$
* Step 2 (Square): $(-3)^2 = 9$ and $(-6)^2 = 36$
* Step 3 (Add): $9 + 36 = 45$
* Step 4 (Root): The distance is $\sqrt{45} \approx \mathbf{6.71}$

Since $\sqrt{41}$ is a smaller number than $\sqrt{45}$, Point $P$ is closer to $A$ than Point $Q$ is.

***

<img src="../assets/midpoint_distance.png" alt="Line segment with midpoint labeled between two points on a coordinate plane" width="563">

**Midpoint formula** finds the coordinates of the point that lies exactly halfway between two endpoints.

$$M = \left( \frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2} \right)$$

**Circle equation standard Form (Center-Radius Form)**

This is the most common and useful form because it tells you the center and the radius at a glance.

$$(x - h)^2 + (y - k)^2 = r^2$$

* $(h, k)$: The coordinates of the center.
* $r$: The radius of the circle.
* $(x, y)$: Any point on the edge of the circle.

#### **Intercept**

![X-intercept and y-intercept of a line crossing the axes on a graph](<../assets/intercept.png>)

#### Lines

slope is the measure of steepness

$$slope = rise/run$$

$$m = \frac{y_2 - y_1}{x_2 - x_1}$$

* Numerator ($y_2 - y_1$): This is the Rise. It tells you how much the line goes up or down.
* Denominator ($x_2 - x_1$): This is the Run. It tells you how much the line goes left or right.

![Slope of a line as rise over run with positive, negative, zero, and undefined slopes](<../assets/slope_of_line.png>)

#### Circle Equation

![Equation of a circle in standard form with center (h,k) and radius r graphed on axes](<../assets/circle_eq.png>)

point-slope equation: $y - y_1 = m(x - x_1)$

**Parallel Lines**: Two non-vertical lines are parallel if they have the same slope ($m_1 = m_2$).

**Perpendicular lines** meet at a 90° angle. For nonvertical lines, their slopes are negative reciprocals: $m_1m_2=-1$. A vertical line is perpendicular to a horizontal line.

## Functions

General properties for functions

**Range notation**

If the domain is $A$, then the range is $\{f(x)\mid x\in A\}$, the set of outputs actually attained.

**Domain of function**

$$f(x) = \frac{5}{x-3}$$

* $x - 3 = 0 \rightarrow x = 3$
* Domain: $x \neq 3$ (or $(-\infty, 3) \cup (3, \infty)$)

**4 ways to represent a function**

* verbally (by a description in words)
* algebraically (by an explicit formula)
* visually (by a graph)
* numerically (by a table of values)

**Graph of functions**

If $f$ is a function with domain $A$, then the graph of $f$ is the set of ordered pairs: ${(x, f(x)) \mid x \in A}$ plotted in a coordinate plane. In other words, the graph of $f$ is the set of all points $(x, y)$ such that $y = f(x)$

For a function $f:A\to B$, the domain $A$ is the set of allowed inputs, and the range is the set of outputs actually produced: $\{f(x):x\in A\}$. A graph can be checked with the vertical-line test: each vertical line may intersect it at most once.

### Piecewise Functions and Reading Graphs

A piecewise function uses different rules on different parts of its domain. For example,

$$f(x)=\begin{cases}-x,&x<0,\\x,&x\ge0\end{cases}$$

is the absolute-value function $f(x)=|x|$. When reading a function graph, identify its domain, range, intercepts (zeros and $y$-intercept), intervals where it rises or falls, and any local or global extrema. Read open and closed endpoints carefully; an open circle is not included in the graph.

<img src="../assets/domain_and_range_of_graph.png" alt="Graph of a function with domain and range labeled on x and y axes" width="563">

### Average Rate of Change of a Function

$$\text{AROC} = \frac{f(b) - f(a)}{b - a},\qquad a\ne b.$$

In simple terms:

$$\frac{\text{Change in Output}}{\text{Change in Input}} = \frac{\Delta y}{\Delta x}$$

$$\text{AROC} = \frac{\text{Change in Distance}}{\text{Change in Time}} = \text{Average Speed}$$

### Transformation of Functions

**Transformation of functions** is a set of mathematical operations that change the position, size, or orientation of a graph without losing its fundamental "family" shape.

$$y = a \cdot f(b(x - h)) + k$$

$a$ controls vertical scaling and reflection: $|a|>1$ stretches vertically, $0<|a|<1$ compresses vertically, and $a<0$ reflects across the $x$-axis.

$b$ controls horizontal scaling by a factor of $1/|b|$; if $b<0$, it also reflects across the vertical line $x=h$. Thus $f(cx)$ is horizontally compressed when $|c|>1$ and stretched when $0<|c|<1$. Assume $a,b\ne0$ for these transformations.

$h$ and $k$ shift the graph: $h>0$ moves it right by $h$, and $k>0$ moves it up by $k$; negative values move left or down.

For $f(x)=x^2$, the transformation $y=2f(x-3)+1=2(x-3)^2+1$ shifts the vertex to $(3,1)$, stretches vertically by 2, and opens upward.

### Combining Functions

$$f(g(x))$$

Composition is defined only for inputs where $g(x)$ is in the domain of $f$.

Let’s use $f(x) = x + 5$ and $g(x) = 2x$

If I ask for $(f \circ g)(3)$:

1. Start with the inside: $g(3) = 2 \cdot 3 = \mathbf{6}$
2. Move to the outside: Put that 6 into $f$
3. $f(6) = 6 + 5 = \mathbf{11}$

### One to One function & Inverse

A function $f$ is one-to-one (or injective) if it never takes the same value twice:

If $x_1 \neq x_2$, then $f(x_1) \neq f(x_2)$

**The Horizontal Line Test (HLT)**

The easiest way to tell if a function is one-to-one is to look at its graph.

* Pass: If every horizontal line intersects the graph at most once, the function is one-to-one.
* Fail: If any horizontal line intersects the graph more than once, it is not one-to-one on that domain, so it has no inverse function on the full domain. Restricting the domain may make it one-to-one.

***

**Inverse**

If a function $f$ is one-to-one, it has an inverse function $f^{-1}$. The inverse "undoes" what the original function did.

* If $f(x) = y$, then $f^{-1}(y) = x$.
* Domain & Range Swap: The domain of $f$ becomes the range of $f^{-1}$, and the range of $f$ becomes the domain of $f^{-1}$.

To find the inverse formula, follow these four steps:

1. Replace $f(x)$ with $y$.
2. Interchange $x$ and $y$ (swap them).
3. Solve the new equation for $y$.
4. Replace $y$ with $f^{-1}(x)$.

Example: Find the inverse of $f(x) = 2x + 3$.

1. $y = 2x + 3$
2. $x = 2y + 3$
3. $x - 3 = 2y \implies y = \frac{x-3}{2}$
4. $f^{-1}(x) = \frac{x-3}{2}$

notice from + to minus 3 and from multiplication of 2x become x/2

***

#### Bird Flight

<img src="../assets/bird_problem.png" alt="Geometry diagram of a bird flying from an island to a point on the shoreline and then along the coast" width="375">

A bird is released from point A on an island, 5 miles from the nearest point B\
on a straight shoreline. The bird flies to a point C on the shoreline and then flies along the\
shoreline to its nesting area D (see the figure). Suppose the bird requires 10 kcal/mi of\
energy to fly over land and 14 kcal/mi to fly over water.

energy used = energy per mile x miles flown

The bird's journey consists of two segments: flying over water (from A to C) and flying over land (from C to D). Since C lies between B and D, the model's input satisfies $0\le x\le12$.

1. Distance over Water ($AC$):

The path from $A$ to $C$ forms the hypotenuse of a right-angled triangle $ABC$.

* The height ($A$) is 5 miles.
* The base ($BC$) is $x$ miles.

Using the Pythagorean theorem:

$$\text{Distance}_{AC} = \sqrt{x^2 + 5^2} = \sqrt{x^2 + 25}$$

Since energy over water is $14 \text{ kcal/mi}$, the energy used for this segment is:

$$14\sqrt{x^2 + 25}$$ 2. Distance over Land ($CD$):

The total distance from point $B$ to the nesting area $D$ is $12 \text{ miles}$. Since the distance $BC$ is $x$, the remaining distance over land is:

$$\text{Distance}_{CD} = 12 - x$$

Since energy over land is $10 \text{ kcal/mi}$, the energy used for this segment is:

$$10(12 - x)$$

Total Energy $E(x)$:

$$E(x) = 14\sqrt{x^2 + 25} + 10(12 - x)$$

## Quadratic Functions

For $a\ne0$, the equation $ax^2+bx+c=0$ can be solved by factoring, completing the square, or using the quadratic formula:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Choose a method that fits the equation. For example, factoring $x^2-5x+6=0$ gives $(x-2)(x-3)=0$, so $x=2$ or $x=3$. Completing the square gives another route:

$$x^2+6x+5=0\implies(x+3)^2=4\implies x=-1\text{ or }x=-5.$$

If the quadratic formula has a negative discriminant, use $i=\sqrt{-1}$ to write the complex roots. For example, $x^2+2x+5=0$ gives $x=-1\pm2i$.

Vertex form makes the turning point (minimum or maximum) visible:

$$y = a(x - h)^2 + k$$

$$y = 2(x - 3)^2 + 5$$

Extract the Vertex $(h, k)$

Look at the numbers in the spots for $h$ and $k$.

* Inside the parentheses, we see $(x - 3)$. Since the formula has a minus, $h = 3$.
* Outside, we see $+ 5$. So $k = 5$.
* The vertex is at $(3, 5)$.

The vertex $(3, 5)$ is just a single dot in space. But a parabola can be:

* Skinny (like a needle)
* Wide (like a bowl)

Our $a$ is $2$.

* Because it’s positive, it’s a "U" shape.
* If $|a|>1$, the parabola is narrower than $y=x^2$; if $0<|a|<1$, it is wider.

$(h, k)$: This is the Vertex (the peak or valley).

* $h$ is the horizontal "address" (the $x$).
* $k$ is the vertical "address" (the height, or $y$).
* $a$: This is the "Shape Master."
* If $a$ is positive, it’s a U.
* If $a$ is negative, it’s an n.

The Minus Sign ($-h$): This is the "Pusher." Because it is _inside_ the parentheses with $x$, it works backward from what you expect. If you see $(x - 3)$, it actually pushed the graph right to $+3$.

The square is what creates that "U" shape. Because any number squared (positive or negative) becomes positive, the graph mirrors itself on both sides, creating a valley or a hill.

## Polynomial Functions

A nonconstant polynomial of degree $n$ has at most $n-1$ turning points. It may have local maxima or minima. An even-degree polynomial has at least one global minimum or maximum, depending on its leading coefficient; an odd-degree polynomial has no global extrema over all real numbers.

#### Polynomial Operations and Zeros

Add and subtract like powers by combining their coefficients. Multiply by distributing each term:

$$ (2x^2+3x)+(x^2-5x+4)=3x^2-2x+4, $$

$$ (x+2)(x^2-x+3)=x^3+x^2+x+6. $$

The zeros of $p(x)$ are inputs that make $p(x)=0$; they are the $x$-intercepts of $y=p(x)$. Factoring exposes zeros: $x^2-x-6=(x-3)(x+2)$ has zeros $3$ and $-2$. A repeated factor such as $(x-1)^2$ means the graph touches the axis at $x=1$; an odd-multiplicity factor crosses it. The leading coefficient and degree determine end behavior: even degrees have matching end directions, while odd degrees have opposite end directions.

**Polynomial**

Question: Current price: 20 dollars; current sales: 60 units. For each 1-dollar price increase, sales decrease by 2 units.

Find $x$ (price increases) for Max Revenue ($R$)

$$revenue = price \times quantity$$

$$R(x) = (20 + 1x)(60 - 2x)$$

$$R(x) = 1200 - 40x + 60x - 2x^2$$

$$R(x) = -2x^2 + 20x + 1200$$

Finding the Maximum ($x = \frac{-b}{2a}$):

$$a = -2, \quad b = 20$$

$$x = \frac{-(20)}{2(-2)}$$

$$x = \frac{-20}{-4}$$

$$x = 5$$

$$\text{Optimal Price} = 20 + 5 = 25 \text{ dollars}$$

$$\text{Units Sold} = 60 - 2(5) = 50$$

$$R_{max} = 25 \times 50 = 1250 \text{ dollars}$$

#### Long Division Polynomial

<img src="../assets/long_div_polynomial.png" alt="Step-by-step long division of polynomials with quotient and remainder" width="563">

#### Synthetic Division

<img src="../assets/sythetic_division.png" alt="Synthetic division of a polynomial by a linear factor (x - c)" width="375">

#### Factor Theorem

The Remainder Theorem says that dividing $p(x)$ by $x-c$ leaves remainder $p(c)$. Therefore, the Factor Theorem says $(x-c)$ is a factor exactly when $p(c)=0$.

Question: Is $(x-1)$ a factor of $p(x)=x^3-6x^2+11x-6$? Test $c=1$:

$$p(1)=1-6+11-6=0.$$

Therefore $(x-1)$ is a factor, and $1$ is a zero of $p$.

#### Polynomial Inequality

finding the set of values for $x$ that make a polynomial expression greater than, less than, or equal to zero

It typically takes one of the following forms:

* $P(x) > 0$
* $P(x) < 0$
* $P(x) \geq 0$
* $P(x) \leq 0$

Set the polynomial to zero and factor:

$$x^3 - 4x^2 - x + 4 \leq 0$$

$$x^2(x - 4) - 1(x - 4) = 0$$

$$(x^2 - 1)(x - 4) = 0$$

$$(x - 1)(x + 1)(x - 4) = 0$$

Critical values are: $x = -1, 1, 4$.

The roots divide the number line into four open test intervals: $(-\infty,-1)$, $(-1,1)$, $(1,4)$, and $(4,\infty)$. Test one point in each interval; include roots in the final answer only because this inequality allows equality.

* Test $x = -2$: $(-)(-)(-) = \text{negative}$ (Matches $\leq 0$)
* Test $x = 0$: $(-)(+)(-) = \text{positive}$
* Test $x = 2$: $(+)(+)(-) = \text{negative}$ (Matches $\leq 0$)
* Test $x = 5$: $(+)(+)(+) = \text{positive}$

The intervals where the expression is less than or equal to zero are:

$$(-\infty, -1] \cup [1, 4]$$

## Rational Function

$$f(x) = \frac{P(x)}{Q(x)}$$

where $P(x)$ and $Q(x)$ are polynomials, and $Q(x) \neq 0$.

The domain excludes every zero of the original denominator. After reducing common factors, a remaining real denominator zero gives a vertical asymptote; a cancelled factor gives a hole. If the numerator's degree is less than the denominator's, the horizontal asymptote is $y=0$; if the degrees are equal, it is the ratio of leading coefficients. If the numerator's degree is larger, there is no horizontal asymptote.

A company produces custom sneakers. It has a fixed monthly cost of 5,000 dollars and a variable cost of 30 dollars per pair.

If they produce $x$ pairs of sneakers, where $x>0$, the total cost is:

$$T(x) = 5000 + 30x$$

The Average Cost per pair ($A(x)$) is a rational function:

$$A(x) = \frac{5000 + 30x}{x}$$

* Horizontal asymptote ($y=30$): As production increases, the fixed cost of 5,000 dollars is spread across more pairs. The average cost approaches the variable cost of 30 dollars per pair.

![Graph of a rational function with vertical and horizontal asymptotes marked](<../assets/vertical_horizontal_asymptote.png>)

#### Zeros and Domain Restrictions

A rational function $f(x)=P(x)/Q(x)$ is zero at $x=c$ exactly when $P(c)=0$ and $Q(c)\ne0$. A zero of the numerator that also makes the denominator zero is excluded from the domain, even if a common factor cancels.

$$f(x) = \frac{x^2 - 9}{x + 5}$$

* Test $(x - 3)$: Plug in $3$.
* $f(3) = \frac{3^2 - 9}{3 + 5} = \frac{0}{8} = 0$.
* Verdict: $f(3)=0$, so $x=3$ is a zero of the rational function.

***

When a factor appears in both the numerator and denominator, cancelling it may reveal a removable discontinuity (a hole) in the graph.

If you have:

$$f(x) = \frac{(x - 2)(x + 3)}{(x - 2)}$$

* Divide/Cancel: You can divide $(x-2)$ by $(x-2)$, which equals $1$.
* The Result: The function simplifies to $f(x) = x + 3$.
* The Catch: Even though the $(x-2)$ divided out, the original function is still "undefined" at $x=2$. This creates a Hole in the graph at that exact spot.

***

#### Rational Inequality

Solve: $\frac{x-5}{x+1} \geq 0$

* Numerator: $x - 5 = 0 \implies \mathbf{x = 5}$
* Denominator: $x + 1 = 0 \implies \mathbf{x = -1}$

These two numbers create three intervals: $(-\infty, -1), (-1, 5), and (5, \infty)$.

| Interval        | Test Point (x) | Calculation                         | Result | Sign           |
| --------------- | -------------- | ----------------------------------- | ------ | -------------- |
| $(-\infty, -1)$ | $-2$           | $\frac{-2-5}{-2+1} = \frac{-7}{-1}$ | $7$    | Positive (+)   |
| $(-1, 5)$       | $0$            | $\frac{0-5}{0+1} = \frac{-5}{1}$    | $-5$   | Negative ($-$) |
| $(5, \infty)$   | $6$            | $\frac{6-5}{6+1} = \frac{1}{7}$     | $0.14$ | Positive (+)   |

We want the intervals where the result is $\geq 0$ (Positive).

* We include $5$ because it makes the numerator zero (and the inequality allows $\geq$).
* We exclude $-1$ because it makes the denominator zero (undefined).

Solution: $(-\infty, -1) \cup [5, \infty)$

### Arithmetic and Geometric Sequences

A sequence is an ordered list of terms. The index $n$ is a positive integer that identifies a term's position.

#### Arithmetic Sequences and Series

An arithmetic sequence adds the same common difference $d$ each time. Its $n$th term is

$$a_n=a_1+(n-1)d.$$

For example, a job starts at 50,000 dollars in year 1 and pays a 3,000-dollar raise each year. In year 10, the salary is $a_{10}=50{,}000+9(3{,}000)=77{,}000$ dollars.

The sum of the first $n$ terms is

$$S_n=\frac{n(a_1+a_n)}{2}.$$

For 20 rows of seats increasing evenly from 30 in the first row to 80 in the last, the total is $S_{20}=20(30+80)/2=1{,}100$ seats.

#### Geometric Sequences and Series

A geometric sequence multiplies by the same common ratio $r$ each time. Its $n$th term is

$$a_n=a_1r^{n-1}.$$

For example, if a post starts with 10 shares and triples each hour, then after 6 hours the sixth term is $a_6=10\cdot3^5=2{,}430$ shares.

For $r\ne1$, the sum of the first $n$ terms is

$$S_n=a_1\frac{1-r^n}{1-r};$$

if $r=1$, then $S_n=na_1$. If you save 100 dollars in the first month and increase the amount by 10% each month, the four-month total is $S_4=100\frac{1-1.1^4}{1-1.1}=464.10$ dollars.

## Exponential and Logarithmic Functions

### Exponential

$$f(x) = a \cdot b^x$$

* $a$: The initial value (the y-intercept).
* $b$: The base (growth or decay factor).
* If $b > 1$, it is Exponential Growth.
* If $0 < b < 1$, it is Exponential Decay.

For $a>0$, $b>0$, and $b\ne1$, the domain is all real numbers, the range is positive real numbers, and $y=0$ is a horizontal asymptote. To solve $2^{x+1}=16$, rewrite $16=2^4$: then $x+1=4$ and $x=3$. If the bases do not match, take logarithms; $3^x=10$ gives $x=\frac{\ln 10}{\ln 3}$.

**The Growth/Decay Rate Form**

$$f(t) = a(1 \pm r)^t$$

* $r$: The percentage rate of change (written as a decimal).
* $+$: Used for growth when $r>0$ (e.g., $1+0.05$ for 5% growth).
* $-$: Used for decay when $0<r<1$ (e.g., $1-0.05$ for 5% loss).

The **natural exponential function** has base $e$, an irrational number (Euler's number) approximately equal to $2.71828$:

$$f(x) = e^x$$

Continuous compounding at a 100% annual rate turns one unit of principal into $e$ after one year, approximately $2.71828$ units.

### Logarithmic

The most fundamental formula for a logarithm relates the logarithmic form to its exponential form:

$$\log_b(x) = y \iff b^y = x$$

* $b$ (Base): Must be positive ($b > 0$) and not equal to $1$.
* $x$ (Argument): Must be a positive real number ($x > 0$).
* $y$ (Exponent): The result or the "power" itself.

| Rule Name         | Formula                                          |
| ----------------- | ------------------------------------------------ |
| Product Rule      | $\log_b(m \cdot n) = \log_b(m) + \log_b(n)$   |
| Quotient Rule     | $\log_b(\frac{m}{n}) = \log_b(m) - \log_b(n)$ |
| Power Rule        | $\log_b(m^p) = p \cdot \log_b(m)$              |
| Zero Property     | $\log_b(1) = 0$                                 |
| Identity Property | $\log_b(b) = 1$                                 |
| Inverse Property  | $b^{\log_b(x)} = x$ and $\log_b(b^x) = x$      |

The product and quotient rules require positive arguments, and the power rule applies when the logarithm's argument is positive. To solve a logarithmic equation, combine logarithms if useful, convert to exponential form, then check that every argument is positive. For example,

$$\log_2(x-1)=3\implies x-1=2^3\implies x=9,$$

which is valid because $x-1>0$.

**Natural logarithm** is written $\ln(x)$ and uses $e$ as its base.

While a common logarithm (base 10) tells you how many times you multiply 10 to get a number, the natural logarithm tells you how long it takes to reach a certain level of growth if that growth is continuous.

$$\ln(x) = \log_e(x)$$

The natural logarithm has domain $(0,\infty)$, range all real numbers, and vertical asymptote $x=0$.

Because it is the inverse of the exponential function $e^x$, the relationship is:

$$e^y = x \iff \ln(x) = y$$

## Precalculus Extensions

These topics extend the Algebra I–II core and appear in some courses as enrichment or precalculus preparation.

### Infinite Geometric Series

An infinite geometric series has a finite sum only when the common ratio satisfies $|r|<1$. Its sum is the limit of the finite partial sums:

$$S_\infty=\frac{a_1}{1-r}.$$

For example, a ball dropped from 10 feet falls 10 feet initially, then rebounds to 5 feet, 2.5 feet, and so on. The rebound heights form a geometric series with $a_1=5$ and $r=0.5$. Each rebound height is traveled once upward and once downward, so the total distance is

$$10+2\left(\frac{5}{1-0.5}\right)=30\text{ feet}.$$

### Limits

A limit describes the value a function approaches as its input gets arbitrarily close to a point. The function need not be defined at that point, or equal the limit there:

$$\lim_{x\to a}f(x)=L.$$

Here $L$ is the value $f(x)$ approaches as $x$ approaches $a$; $x$ need not equal $a$. For a sequence, a limit asks whether its terms approach one finite number as $n\to\infty$. If they do, the sequence converges; otherwise, it diverges. For a geometric sequence with $|r|<1$, $r^n\to0$, which is why its corresponding infinite geometric series has a finite sum.

### Binomial Theorem

For a nonnegative integer $n$, the theorem expands a binomial power ($0!=1$):

$$(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k,\qquad \binom{n}{k}=\frac{n!}{k!(n-k)!}.$$

For example, $(x+1)^4=x^4+4x^3+6x^2+4x+1$. The coefficients are the binomial coefficients (also found in Pascal's triangle).

### Oblique Asymptotes from Polynomial Division

Polynomial division can reveal a slant asymptote when the numerator's degree is exactly one greater than the denominator's degree:

$$\frac{x^2+3x+5}{x+1}=x+2+\frac{3}{x+1},\qquad x\ne-1.$$

As $|x|$ grows, the remainder term approaches zero, so the graph approaches the line $y=x+2$.
