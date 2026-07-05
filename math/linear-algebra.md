---
title: Linear Algebra
aliases: []
created: '2026-06-13'
tags:
  - math
---

# Linear Algebra

1D Vector: A single value (a scalar).

2D Vector: A coordinate pair $[x, y]$ used to position a pixel on a screen.

$$Ax = b$$

**Left Hand Side**

The Left Hand Side ($\mathbf{A}\mathbf{x}$) represents the transformation. It’s the combination of your variables ($x\_1, x\_2, \dots$) and your coefficients. In geometry, this side describes the "span" or the space you are working in \[4.1].

**Right Hand Side**

The Right Hand Side ($\mathbf{b}$) represents the target. It is a fixed vector or constant. To find a solution, the target vector must land somewhere within the space described by the LHS \[4.1].

***

### Linear Combination

![Vector addition: combining two vectors geometrically](../.gitbook/assets/vector_addition.png)

Scalar Multiplication

$\vec{v} = \begin{bmatrix} 2 \\ 3 \end{bmatrix}$ and a scalar $c = 2$.

The scalar multiplication $c\vec{v}$ would be:

$$2 \times \begin{bmatrix} 2 \\ 3 \end{bmatrix} = \begin{bmatrix} 2 \times 2 \\ 2 \times 3 \end{bmatrix} = \begin{bmatrix} 4 \\ 6 \end{bmatrix}$$

***

Vector Addition

$\vec{a} = \begin{bmatrix} 4 \\ 6 \end{bmatrix}$ and $\vec{b} = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$

The vector addition $\vec{a} + \vec{b}$ would be:

$$\begin{bmatrix} 4 \\ 6 \end{bmatrix} + \begin{bmatrix} 1 \\ -2 \end{bmatrix} = \begin{bmatrix} 4 + 1 \\ 6 + (-2) \end{bmatrix} = \begin{bmatrix} 5 \\ 4 \end{bmatrix}$$

### Dot Product

dot product is a single number that reveals the relationship between two vectors.

$\vec{A} = [3, 4]$ and $\vec{B} = [1, 2]$

$$(3 \times 1) + (4 \times 2) = 3 + 8 = \mathbf{11}$$

The number 11. It is no longer a point on a graph; it is a "score."

This tells you how intense or strong the data is. example: In music: It’s the Volume. A loud song has a long vector; a quiet song has a short vector.

***

**Schwarz Inequality**

$$|v \cdot w| \leq \|v\| \|w\|$$

***

the length is $|\vec{v}| = \sqrt{x^2 + y^2}$

Length of $\vec{A}$ is 5 (because $\sqrt{3^2 + 4^2} = 5$). The Length of $\vec{B}$ is 2.23.

$|v| |w| = 5 \times 2.23 = \mathbf{11.15}$. (Maximum possible dot product you could get if two specific vectors were perfectly aligned)

***

**Cosine Rule (The Angle)**

$$\text{Similarity} = \frac{\text{Actual Score (Dot Product)}}{\text{Potential Score (Product of Lengths)}}$$

$$\frac{11.0}{11.15} \approx \mathbf{0.986}$$

If a "Loud" song and a "Quiet" song are both Heavy Metal, they will point in the same direction (small angle).

* $\cos(\theta) = 0.986$.
* $\cos^{-1}(0.986)$ $\approx 9.6^\circ$

| If Similarity (Cosine) is... | The Angle (θ) is... | What it means                         |
| ---------------------------- | ------------------- | ------------------------------------- |
| 1.00                         | 0°                  | Perfectly identical direction.        |
| 0.707                        | 45°                 | Halfway between same and different.   |
| 0.00                         | 90°                 | Completely different (Perpendicular). |

***

**Unit Vector**

we often want to keep the direction of a vector but change its length to 1. This is called a Unit Vector ($\mathbf{u}$).

$$\mathbf{u} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$$

$\vec{A} = [3, 4]$ and its length is $5$.

$\mathbf{u} = [3/5, 4/5] = [0.6, 0.8]$.

This "normalizes" data so you can compare different vectors fairly, regardless of how big the numbers started.

***

**Triangle Inequality**

![Triangle inequality: the shortest path between two points is a straight line](../.gitbook/assets/triangle_inequality.png)

It states that the shortest distance between two points is a straight line.

$$\|v + w\| \leq \|v\| + \|w\|$$

Example

* Home: $(0,0)$
* Grocery Store: Point $(4, 0)$
* Coffee Shop: Point $(4, 3)$

First, you walk from Home to the Store, then from the Store to the Coffee Shop.

1. Vector $\vec{v}$ (Home to Store): You move 4 units East.

* $\vec{v} = [4, 0]$
* Length $|v| = 4$

2. Vector $\vec{w}$ (Store to Coffee): You move 3 units North.

* $\vec{w} = [0, 3]$
* Length $|w| = 3$

Total Distance of Path B: $4 + 3 = \mathbf{7}$

If you had walked straight from Home to the Coffee Shop, you are looking for the length of the vector $\vec{v} + \vec{w}$.

* Combined Vector: $[4+0, 0+3] = [4, 3]$
* Length $|v+w|$: Using Pythagoras: $\sqrt{4^2 + 3^2} = \sqrt{16 + 9} = \sqrt{25} = \mathbf{5}$

Now we plug these numbers into the inequality:

$$\|v + w\| \leq \|v\| + \|w\|$$

$$\mathbf{5} \leq \mathbf{4 + 3}$$

$$\mathbf{5} \leq \mathbf{7}$$

The inequality is True. The straight line ($5$) is shorter than the two-step path ($7$).

If you then walk from the Coffee Shop back to Home, you walk another $5$ units.

* Total Trip with the Store stop: $4 + 3 + 5 = \mathbf{12}$ units.
* Total Trip without the Store stop: $5 + 5 = \mathbf{10}$ units.

### Matrix

If Matrix $A$ is $(m \times n)$ and Matrix $B$ is $(n \times p)$, the resulting Matrix $C$ will be $(m \times p)$.

$$A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}, \quad B = \begin{bmatrix} 7 & 8 \\ 9 & 10 \\ 11 & 12 \end{bmatrix}$$

Top-Left Entry (Row 1 of A $\times$ Column 1 of B)

$$(1 \times 7) + (2 \times 9) + (3 \times 11) = 7 + 18 + 33 = \mathbf{58}$$

Top-Right Entry (Row 1 of A $\times$ Column 2 of B):

$$(1 \times 8) + (2 \times 10) + (3 \times 12) = 8 + 20 + 36 = \mathbf{64}$$

Bottom-Left Entry (Row 2 of A $\times$ Column 1 of B):

$$(4 \times 7) + (5 \times 9) + (6 \times 11) = 28 + 45 + 66 = \mathbf{139}$$

Bottom-Right Entry (Row 2 of A $\times$ Column 2 of B):

$$(4 \times 8) + (5 \times 10) + (6 \times 12) = 32 + 50 + 72 = \mathbf{154}$$

$$C = \begin{bmatrix} 58 & 64 \\ 139 & 154 \end{bmatrix}$$

### Linear Equations

linear equations in matrix form, $Ax = b$

* Matrix $A$ (Coefficient Matrix): Contains only the numbers (coefficients) in front of the variables.
* Vector $x$ (Variable Vector): A column vector of the unknowns (e.g., $x, y, z$).
* Vector $b$ (Constant Vector): A column vector of the answers on the right side of the equals sign.

$$2x + 3y = 8$$

$$5x - y = 1$$

To write this in $Ax = b$ form:

$$\begin{bmatrix} 2 & 3 \\ 5 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 8 \\ 1 \end{bmatrix}$$

***

### Matrix Inner Product

is a way to take two matrices of the same size and produce a single scalar value. Any valid matrix inner product must satisfy four rules:

* Symmetry: $\langle A, B \rangle = \langle B, A \rangle$
* Linearity: $\langle cA, B \rangle = c \langle A, B \rangle$
* Additivity: $\langle A + B, C \rangle = \langle A, C \rangle + \langle B, C \rangle$
* Positivity: $\langle A, A \rangle \ge 0$, and it only equals 0 if $A$ is a zero matrix.

**The Frobenius Inner Product**

For two real-valued matrices $A$ and $B$ of size $m \times n$, the inner product (denoted as $\langle A, B \rangle\_F$) is calculated by multiplying corresponding elements and summing them up.

There are three ways to write the same operation:

1. Element-wise Sum: $\langle A, B \rangle = \sum\_{i,j} A\_{ij} B\_{ij}$
2. Using Trace: $\langle A, B \rangle = \text{tr}(A^T B)$
3. If you "flatten" both matrices into long vectors, their inner product is exactly the same as the standard vector dot product.

Just like the vector dot product tells us about the "relationship" between two arrows in space, the matrix inner product tells us about the relationship between two data structure:

* **Measuring Similarity**: It tells us how "aligned" two matrices are. If the inner product is high, the matrices are similar; if it's zero, the matrices are orthogonal.
* **Defining "Length" (Norm)**: The inner product of a matrix with itself gives the square of its "size," known as the Frobenius Norm:

$$\|A\|_F = \sqrt{\langle A, A \rangle}$$

* **Projection**: In machine learning and signal processing, we use inner products to "project" a data matrix onto a set of basis matrices (like in SVD or JPEG compression).
* **Optimization**: Many loss functions in deep learning (like the cost of weights) are calculated using these types of inner products.

Suppose we have two $2 \times 2$ matrices:

$$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}, \quad B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$$

The inner product is:

$$\langle A, B \rangle = (1 \times 5) + (2 \times 6) + (3 \times 7) + (4 \times 8)$$

$$\langle A, B \rangle = 5 + 12 + 21 + 32 = \mathbf{70}$$

### **Law Of Operations**

| Operation      | Law             | Formula                     |
| -------------- | --------------- | --------------------------- |
| Multiplication | Not Commutative | $AB \neq BA$                |
| Multiplication | Associative     | $A(BC) = (AB)C$             |
| Transpose      | Product Law     | $(AB)^T = B^T A^T$          |
| Inverse        | Product Law     | $(AB)^{-1} = B^{-1} A^{-1}$ |
| Scalar         | Distributive    | $c(A + B) = cA + cB$        |

***

### Identity Matrix

$$I = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

### Permutation Matrix

A permutation matrix $P$ of size $n \times n$ has exactly one entry of 1 in each row and each column, with all other entries being 0.

For example, a $3 \times 3$ permutation matrix might look like this:

$$P = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

### Matrix Elimination

simplifying a complex fraction. make the matrix clean

#### Cost Of Elimination

| Phase               | Operation Count (Approx) | Complexity |
| ------------------- | ------------------------ | ---------- |
| Forward Elimination | $\frac{2}{3}n^3$         | $O(n^3)$   |
| Back-Substitution   | $n^2$                    | $O(n^2)$   |
| Total Solve Cost    | $\frac{2}{3}n^3 + n^2$   | $O(n^3)$   |

### **Augmented Matrix**

Often, when solving these equations by hand (using a method like Gaussian Elimination), we use an Augmented Matrix.

$$\left[ \begin{array}{cc|c} 2 & 3 & 8 \\ 5 & -1 & 1 \end{array} \right]$$

To solve the equation we use

### **Gaussian Elimination**

This method uses "row operations" to simplify the matrix into a form where we can read the answers.

We combine Matrix $A$ and Vector $b$ into one:

$$\left[ \begin{array}{cc|c} 1 & 2 & 5 \\ 3 & 4 & 11 \end{array} \right]$$

We want to eliminate the $3$ in the second row. We can do this by: Row 2 $\to$ Row 2 $- (3 \times$ Row 1).

$$(3 - 3 \times 1) = 0$$

$$(4 - 3 \times 2) = -2$$

$$(11 - 3 \times 5) = -4$$

New Matrix:

$$\left[ \begin{array}{cc|c} 1 & 2 & 5 \\ 0 & -2 & -4 \end{array} \right]$$

**Back-Substitution**

Now we turn the rows back into equations

1. Bottom row: $-2y = -4 \implies \mathbf{y = 2}$
2. Top row: $x + 2y = 5$
3. Substitute y: $x + 2(2) = 5 \implies x + 4 = 5 \implies \mathbf{x = 1}$

Solution: $x = 1, y = 2$

### **Matrix Inverse**

inverse matrix is the mathematical "undo" button. Think of a matrix $A$ as a function that transforms data (moving a character in a game, encrypting a message, or blurring an image), the inverse $A^{-1}$ is the function that reverses that transformation exactly.

($x = A^{-1}b$)

When you multiply a matrix by its inverse, you get the Identity Matrix.

$$A \cdot A^{-1} = I$$

This method is like basic algebra. If $ax = b$, then $x = b/a$. In matrices, we multiply by the inverse instead of dividing.

$$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}, \quad x = \begin{bmatrix} x \\ y \end{bmatrix}, \quad b = \begin{bmatrix} 5 \\ 11 \end{bmatrix}$$

For a $2 \times 2$ matrix $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$, the inverse is $\frac{1}{ad-bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$.

Determinant: $(1 \times 4) - (2 \times 3) = 4 - 6 = \mathbf{-2}$

Swap and Negate: Swap 1 and 4, make 2 and 3 negative $\to \begin{bmatrix} 4 & -2 \\ -3 & 1 \end{bmatrix}$

Multiply by 1/Det: $A^{-1} = -\frac{1}{2} \begin{bmatrix} 4 & -2 \\ -3 & 1 \end{bmatrix} = \begin{bmatrix} -2 & 1 \\ 1.5 & -0.5 \end{bmatrix}$

$$\begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} -2 & 1 \\ 1.5 & -0.5 \end{bmatrix} \begin{bmatrix} 5 \\ 11 \end{bmatrix} = \begin{bmatrix} (-2 \times 5) + (1 \times 11) \\ (1.5 \times 5) + (-0.5 \times 11) \end{bmatrix} = \mathbf{\begin{bmatrix} 1 \\ 2 \end{bmatrix}}$$

Solution: $x = 1, y = 2$

***

### **Factorization**

**LU Decomposition (**$A = LU$**)**

This is the matrix version of Gaussian Elimination. L stands for Lower Triangular, and U stands for Upper Triangular.

$$A = \begin{bmatrix} 2 & 3 \\ 8 & 15 \end{bmatrix}$$

Identify the Pivot. The first pivot is $2$ (at position Row 1, Column 1).

Eliminate the value below the pivot.

We need to turn that $8$ into a $0$. We do this by subtracting a multiple of Row 1 from Row 2.

* Multiplier ($l\_{21}$): $8 / 2 = 4$.
* Operation: $R\_2 \to R\_2 - (4 \times R\_1)$

$$U = \begin{bmatrix} 2 & 3 \\ 8 - (4 \times 2) & 15 - (4 \times 3) \end{bmatrix} = \begin{bmatrix} 2 & 3 \\ 0 & 3 \end{bmatrix}$$

The $L$ matrix is the "memory" of the elimination. Its job is to store the multipliers you used.

1. Start with the Identity: $L$ always starts as an Identity Matrix (1s on the diagonal, 0s elsewhere).

$$\begin{bmatrix} 1 & 0 \\ ? & 1 \end{bmatrix}$$ 2. Insert the Multiplier: In Phase 1, we used the multiplier 4 to eliminate the value in Row 2, Column 1. We place that 4 in the exact same spot in $L$.

$$L = \begin{bmatrix} 1 & 0 \\ \mathbf{4} & 1 \end{bmatrix}$$

Why is it 0 in the top right? Because we never use Row 2 to eliminate Row 1. We only work "downward," so only the "lower" half of the matrix gets values

Instead of solving $Ax = b$, which is slow, we solve two tiny, easy problems.

Imagine $b = \begin{bmatrix} 7 \\ 31 \end{bmatrix}$. We want to find $x$ in $LUx = b$.

Step 1: Solve $Ly = b$ (Forward Substitution)

$$\begin{bmatrix} 1 & 0 \\ 4 & 1 \end{bmatrix} \begin{bmatrix} y_1 \\ y_2 \end{bmatrix} = \begin{bmatrix} 7 \\ 31 \end{bmatrix}$$

* Row 1: $1y\_1 = 7 \implies \mathbf{y\_1 = 7}$
* Row 2: $4y\_1 + 1y\_2 = 31 \implies 4(7) + y\_2 = 31 \implies 28 + y\_2 = 31 \implies \mathbf{y\_2 = 3}$

Step 2: Solve $Ux = y$ (Back Substitution)

$$\begin{bmatrix} 2 & 3 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 7 \\ 3 \end{bmatrix}$$

* Row 2: $3x\_2 = 3 \implies \mathbf{x\_2 = 1}$
* Row 1: $2x\_1 + 3x\_2 = 7 \implies 2x\_1 + 3(1) = 7 \implies 2x\_1 = 4 \implies \mathbf{x\_1 = 2}$

Final Answer: $x = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$.

***

**QR Decomposition (**$A = QR$**)**

This breaks a matrix into an Orthogonal matrix ($Q$) and an Upper Triangular matrix ($R$). Computers love orthogonal matrices because they don't lose precision during calculations. This is the standard way to solve Least Squares problems (finding the best-fit line in Data Science).

$$A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$$

1. Find $Q$: We use the Gram-Schmidt process to make the columns of $A$ orthonormal.

After normalizing, we get $Q = \begin{bmatrix} 1/\sqrt{2} & 1/\sqrt{2} \\ 1/\sqrt{2} & -1/\sqrt{2} \end{bmatrix}$ 2. Find $R$: $R$ is calculated as $Q^T A$.

$$R = \begin{bmatrix} \sqrt{2} & 1/\sqrt{2} \\ 0 & 1/\sqrt{2} \end{bmatrix}$$

***

### Rank, Nullspace, and Columnspace

**Nullspace**

The Nullspace is the "Garbage Can" of a matrix. It consists of all the input vectors that the matrix "squashes" into zero.

$$Ax = 0$$

If $x$ is in the nullspace, multiplying it by $A$ completely destroys its information, turning it into a vector of zeros

If the Nullspace is empty (only contains the zero vector): The matrix is "perfect." Every unique input gives a unique output. You can reverse the process (Invert the matrix).

If the Nullspace has "stuff" in it: You have a problem. Multiple different inputs can produce the same output.

**Matrix Rank**

rank of a matrix is a single number that tells you how much "real" information is inside that matrix.

* Linearly Independent: This means a row is "unique." You cannot create it by adding or scaling the other rows.
* Linearly Dependent: This means a row is a "copycat." For example, if Row 2 is just Row 1 multiplied by 10, Row 2 is dependent and doesn't count toward the rank.

Look at this matrix:

$$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$

* Row 1: $[1, 2]$
* Row 2: $[2, 4]$

Notice that Row 2 is just $2 \times$ Row 1. It adds no new information to the system. Because there is only one unique row, the Rank = 1.

**Span, Subspace, Columnspace A Unified Example**

We will use 3D vectors where the numbers represent the amount of Cyan, Magenta, and Yellow ($C, M, Y$).

$$A = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{bmatrix}$$

Row 1: Cyan Slot

Row 2: Yellow Slot

Row 3: Magenta Slot

**The Span & Column Space**

Col 1 (Cyan): $\begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$

Col 2 (Yellow A): $\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$

Col 3 (Yellow B): $\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ (Oops! A duplicate of Col 2)

The Column Space is the Span of these three vectors. It represents every color this printer can make. Since we only have Cyan and Yellow ingredients, the span is "Every mix of Cyan and Yellow."

**The Vector Subspace (The "Result")**

Because we have no Magenta ingredient (the middle row of our result will always be 0 for the first and third components in a different setup, or specifically here, the third row is always 0), we are stuck in a 2D Subspace.

We can make $\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$ (Green).

We can never make $\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$ (Pure Magenta) because no combination of our columns can put a number in that bottom slot.

**The Rank (The "Unique Info")**

Look at the columns again.

* Column 1 is unique.
* Column 2 is unique.
* Column 3 is just a copy of Column 2.

Since there are only 2 independent directions, the Rank = 2. Even though we have 3 cartridges, the printer only "sees" 2 dimensions of color.

**The Nullspace (The "Waste")**

The Nullspace is the set of instructions $(x\_1, x\_2, x\_3)$ that tells the printer to use ink, but results in zero color on the page ($Ax = 0$).

Since Column 2 and Column 3 are identical, watch what happens if we use this instruction:

$$x = \begin{bmatrix} 0 \\ 1 \\ -1 \end{bmatrix}$$

This tells the printer: "Use 0 Cyan, 1 unit of Yellow A, and -1 unit of Yellow B."

$$1\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} - 1\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$

The ink cancels out! This vector $\begin{bmatrix} 0 \\ 1 \\ -1 \end{bmatrix}$ is in the Nullspace. It represents a redundant command.

***

### Singular Value Decomposition ($A = U\Sigma V^T$)

SVD is a way of breaking down a complex table of data (a matrix) into its most basic, essential building blocks.

* $U$ (The "Who/What"): It identifies the categories or "latent features" in your data. (e.g., In a movie database, it might find categories like "Sci-Fi fans" or "Rom-Com fans").
* $\Sigma$ (The "How Much"): It tells you the importance of each category. The first value is always the biggest "story" in your data; the last values are usually just random noise.
* $V^T$ (The "Connection"): It shows how the original items in your data relate to those new categories. (e.g., Which specific movies belong to the "Sci-Fi" category).

main purpose is to squint data, see hidden pattern, denoising

***
