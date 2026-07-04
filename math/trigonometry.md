---
title: Trigonometry
aliases: []
created: '2026-06-13'
tags:
  - math
---

# Trigonometry

![Right triangle with opposite, adjacent, and hypotenuse sides relative to angle theta](../.gitbook/assets/trigonometry.png)

Opposite = height Hypotenuse = diagonal Adjacent = flat line $(\theta)$ = angle degrees

## Sine & Arcsin

$$\sin(\theta) = \frac{\text{Opposite}}{\text{Hypotenuse}}$$

* What it finds: The Height (Vertical).
* Use this when you know the Diagonal length and the angle.
* Real World Example: A kid is flying a kite. He let out 100 feet of string (Hypotenuse). The string is at a $30^\circ$ angle. How high is the kite?
* to find the Height, you move the Diagonal to the other side: $$\text{Height} = 100 \times \sin(30^\circ)$$ $$100 \times 0.5 = \mathbf{50 \text{ feet high}}$$

If you already have the **hypotenuse** and the **opposite** (vertical) side, you are usually trying to find one of two things: the Angle or the Adjacent (horizontal) side.

#### arcsin

$$\theta = \arcsin\left(\frac{\text{Opposite}}{\text{Hypotenuse}}\right)$$

**Finding Adjacent**

$$a^2 + b^2 = c^2$$

$$\text{Adjacent} = \sqrt{\text{Hyp}^2 - \text{Opp}^2}$$

***

## Cosine & Arccos

$$\cos(\theta) = \frac{\text{Adjacent}}{\text{Hypotenuse}}$$

* What it finds: The Base (Horizontal/Flat line).
* Use this when you know the Diagonal length and want to know how far it travels along the ground.
* Real World Example: A 12-foot ladder is leaning against a wall at a $60^\circ$ angle from the ground. How far is the base of the ladder from the wall? $$\text{Distance} = 12 \times \cos(60^\circ)$$ $$12 \times 0.5 = \mathbf{6 \text{ feet from the wall}}$$

#### Arccos

$$\theta = \arccos\left(\frac{\text{Adjacent}}{\text{Hypotenuse}}\right)$$

$$\text{If } \cos(y) = x, \text{ then } y = \arccos(x)$$

***

## Tangent & Arctan

$$\tan(\theta) = \frac{\text{Opposite}}{\text{Adjacent}}$$

* What it finds: The Height (if you don't have the diagonal).
* Use this when you are standing on the ground and looking up at something tall.
* Real World Example: You are standing 50 feet away from a tree. You look at the top at a $45^\circ$ angle. How tall is the tree? $$\text{Height} = 50 \times \tan(45^\circ)$$ $$50 \times 1 = \mathbf{50 \text{ feet tall}}$$

#### Arctan or $\tan^{-1}$

$$\theta = \arctan\left(\frac{\text{Opposite}}{\text{Adjacent}}\right)$$

* It finds the Angle of elevation or depression.
* Use this when you have the width and height, but no diagonal.
* Example: You are building a wheelchair ramp. The ramp must rise 2 feet (Opposite) over a horizontal distance of 24 feet (Adjacent). What is the angle of the ramp? $$\tan(\theta) = \frac{2}{24} = 0.0833$$$$\theta = \arctan(0.0833)$$$$\theta \approx \mathbf{4.76^\circ}$$

***

## **Unit circle**

Because it is a circle with radius $r = 1$, its equation is derived from the Pythagorean theorem:

$$x^2 + y^2 = 1$$

Because the Hypotenuse ($H$) is 1, the SOH CAH TOA formulas turn into direct values:

$$\text{Opposite} = H \times \sin(\theta) = 1 \times \sin(\theta) = \mathbf{\sin(\theta)}$$

$$\text{Adjacent} = H \times \cos(\theta) = 1 \times \cos(\theta) = \mathbf{\cos(\theta)}$$

![Unit circle with key angles labeled in degrees: 0°, 90°, 180°, 270°](../.gitbook/assets/circle_degrees.png)

The radius ending at (0, 1) on the positive vertical axis has a **90 degrees** angle with the positive horizontal axis.

**Radian**

radian is a measurement of the angle (the "opening" between two lines

**Arc length**

Arc length is the distance along the curved edge (the "crust" of the pizza slice).

**Coterminal Angle**

Keep subtracting full circles ($360^\circ$) until we get a number we recognize between $0^\circ$ and $360^\circ$.

* First Lap: $900^\circ - 360^\circ = 540^\circ$ (Still bigger than a circle).
* Second Lap: $540^\circ - 360^\circ = \mathbf{180^\circ}$.

**Reference Angle**

How far is the angle from the x-axis?

| Where is your angle?   | The Formula          | Logic                                     |
| ---------------------- | -------------------- | ----------------------------------------- |
| Q1 ($0$-$90^\circ$)    | No formula needed.   | The angle is its own reference!           |
| Q2 ($90$-$180^\circ$)  | $180 - \text{Angle}$ | How many degrees _before_ the $180$ line? |
| Q3 ($180$-$270^\circ$) | $\text{Angle} - 180$ | How many degrees _past_ the $180$ line?   |
| Q4 ($270$-$360^\circ$) | $360 - \text{Angle}$ | How many degrees _until_ the $360$ line?  |

***

<img src="../.gitbook/assets/circle_sine_cosine_example.png" alt="Unit circle showing sine and cosine values for an angle in Quadrant II" width="375">

The "Height": $\sin \theta = 0.6$. This tells us that the point on the unit circle is exactly $0.6$ units above the center line.

The "Location": $\frac{\pi}{2} < \theta < \pi$. This tells us the angle is between $90^\circ$ and $180^\circ$. Looking at the circle, this means the point is in the top-left section (Quadrant II).

Since it’s a unit circle, we know the Hypotenuse is 1. As we discussed earlier, every point $(x, y)$ must follow the rule $x^2 + y^2 = 1^2$.

$$\text{(Horizontal Side)}^2 + \text{(Vertical Side)}^2 = \text{Total}^2$$

$$\cos^2 \theta + \sin^2 \theta = 1$$

Because $x$ is $\cos \theta$ and $y$ is $\sin \theta$, the problem uses this formula:

$$(\cos \theta)^2 + (\sin \theta)^2 = 1$$

1. $(\cos \theta)^2 + (0.6)^2 = 1$.
2. $(0.6) \times (0.6) = 0.36$.
3. $(\cos \theta)^2 = 1 - 0.36$, which equals $0.64$.
4. To find $\cos \theta$, you take the square root of $0.64$. This gives you two possible answers: $0.8$ or $-0.8$.

## **Trigonometric Functions of Real Numbers**

On the unit circle, the primary functions are defined as:

* Sine: $\sin(\theta) = y$
* Cosine: $\cos(\theta) = x$
* Tangent: $\tan(\theta) = \frac{y}{x}$ (where $x \neq 0$)

**Reciprocal Trigonometric Formulas**

These functions are the "flipped" versions of the primary ones:

* Cosecant: $\csc(\theta) = \frac{1}{y}$ (where $y \neq 0$)
* Secant: $\sec(\theta) = \frac{1}{x}$ (where $x \neq 0$)
* Cotangent: $\cot(\theta) = \frac{x}{y}$ (where $y \neq 0$)

![Conversion table between degrees and radians for common angles](../.gitbook/assets/degrees_and_radian.png)

![Table of special angle values for sine, cosine, and tangent functions](../.gitbook/assets/special_value_trigonometric_func.png)

## **Domain of trigonometric function**

imagine a "laser pointer" rotating from the center of the circle, there are two specific moments where the Tangent or other value simply doesn't exist.

| Function  | Domain (Input)                                                  | Range (Output)                    |
| --------- | --------------------------------------------------------------- | --------------------------------- |
| $\sin(x)$ | All Real Numbers $(-\infty, \infty)$                            | $\[-1, 1]$                        |
| $\cos(x)$ | All Real Numbers $(-\infty, \infty)$                            | $\[-1, 1]$                        |
| $\tan(x)$ | All $x \neq \frac{\pi}{2} + n\pi$ (Odd multiples of $90^\circ$) | $(-\infty, \infty)$               |
| $\csc(x)$ | All $x \neq n\pi$ (Multiples of $180^\circ$)                    | $(-\infty, -1] \cup \[1, \infty)$ |
| $\sec(x)$ | All $x \neq \frac{\pi}{2} + n\pi$ (Odd multiples of $90^\circ$) | $(-\infty, -1] \cup \[1, \infty)$ |
| $\cot(x)$ | All $x \neq n\pi$ (Multiples of $180^\circ$)                    | $(-\infty, \infty)$               |

Remember that Tangent is the ratio of Vertical ($y$) to Horizontal ($x$):

$$\tan \theta = \frac{\sin \theta}{\cos \theta}$$

As you rotate the radius, you are building that rectangle we talked about earlier.

At $90^\circ$ (The top edge): Your point is at $(0, 1)$. The horizontal width ($x$) is zero.

The Math: $\tan(90^\circ) = \frac{1}{0}$.

<img src="../.gitbook/assets/unit_circle_wave.png" alt="Unit circle mapped to a sine wave, showing the relationship between angle and function value" width="563">

you cannot divide by zero. At this exact angle, the Tangent "breaks" and becomes undefined.

[https://www.desmos.com/calculator/ajd5qthpcw](https://www.desmos.com/calculator/ajd5qthpcw)

## Cosecant

$$\csc(\theta) = \frac{\text{Hypotenuse}}{\text{Opposite}}$$ (The flip of Sine)

* What it finds: The Diagonal length.
* Use this when you know how high you need to go and want to find the diagonal path.
* Real World Example: You want to build a zip-line. The platform is 20 feet high. You want the line at a $30^\circ$ angle. How much cable do you need to buy?$$\text{Cable} = 20 \times \csc(30^\circ)$$ (Note: $\csc$ is $1/0.5 = 2$) $$20 \times 2 = \mathbf{40 \text{ feet of cable}}$$

***

## Secant

$$\sec(\theta) = \frac{\text{Hypotenuse}}{\text{Adjacent}}$$ (The flip of Cosine)

* What it finds: The Diagonal length.
* Use this when you know the flat distance and need to find the diagonal.
* Real World Example: An architect is designing a bridge. The gap to cross is 100 feet wide. The support beam must be at a $30^\circ$ angle. How long is the beam? $$\text{Beam} = 100 \times \sec(30^\circ)$$$$100 \times 1.15 = \mathbf{115 \text{ feet long}}$$

***

## Cotangent

$\cot(\theta) = \frac{\text{Adjacent\}}{\text{Opposite\}}$ (The flip of Tangent)

* What it finds: The Flat distance.
* Use this when you know the Height and want to find the ground distance.
* Real World Example: A lighthouse is 100 feet tall. It spots a boat at a $10^\circ$ angle from the top. How far away is the boat on the water? $$\text{Distance} = 100 \times \cot(10^\circ)$$ The Answer: $$100 \times 5.67 = \mathbf{567 \text{ feet away}}$$

***

## Transformation of Trigonometric Functions

The standard sine wave $y = \sin(x)$ can be stretched, squished, and moved. The general formula is:

$$y = A \sin(B(x - C)) + D$$

#### Amplitude ($A$)

* What it does: Vertical Stretch.
* Visual: Controls the height of the wave peaks.
* Physics: In sound, this is Volume (Loudness).
* Formula: $|A|$ is the distance from the center line to the peak.

#### Period ($B$)

* What it does: Horizontal Squish/Stretch.
* Visual: How fast the wave repeats.
* Physics: In sound, this is Frequency (Pitch). High $B$ = High Pitch.
* Formula: The new Period is $\frac{2\pi}{B}$.

#### Phase Shift ($C$)

* What it does: Horizontal Shift.
* Visual: Moving the start of the wave Left or Right.
* Physics: This is Timing. (e.g., Does the sound start now, or 1 second later?)

#### Vertical Shift ($D$)

* What it does: Vertical Shift.
* Visual: Moving the entire wave Up or Down.
* Math: It changes the "center line" (midline) of the oscillation.

Example:

$$y = 3 \sin(2(x - \pi)) + 5$$

* Amplitude: 3 (The wave goes 3 units up and down from the center).
* Period: $\frac{2\pi}{2} = \pi$ (It oscillates twice as fast as normal).
* Phase Shift: Right by $\pi$.
* Vertical Shift: Up 5 (The center line is now at $y=5$).

## The Law of Sines and the Law of Cosines

These two laws allow you to solve triangles that are not right-angled triangles (Oblique Triangles).

#### The Law of Sines

Use this when you know a "pair" (an angle and the side opposite to it) and one other piece of information.

$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}$$

Two fire towers are 10 miles apart. Tower A spots a fire at a $40^\circ$ angle. Tower B spots the fire at a $60^\circ$ angle. How far is the fire from Tower A?

1. Find the third angle: $180^\circ - 40^\circ - 60^\circ = 80^\circ$ (Angle C).
2. Set up the ratio: $\frac{x}{\sin(60^\circ)} = \frac{10}{\sin(80^\circ)}$
3. Solve: $x = \frac{10 \times 0.866}{0.985} \approx \mathbf{8.79 \text{ miles\}}$.

#### The Law of Cosines

Use this when you don't have a matching pair. Usually when you have SSS (Side-Side-Side) or SAS (Side-Angle-Side). This is basically the Pythagorean Theorem adjusted for non-90-degree angles.

$$c^2 = a^2 + b^2 - 2ab \cos(C)$$

Real World Example: You walk 3 miles North, turn $120^\circ$, and walk 4 miles. How far are you from your starting point?

$$c^2 = 3^2 + 4^2 - 2(3)(4)\cos(120^\circ)$$ $$c^2 = 9 + 16 - 24(-0.5)$$ $$c^2 = 25 + 12 = 37$$ $$c = \sqrt{37} \approx \mathbf{6.08 \text{ miles}}$$

## **Identities**

Use identities to rewrite complex expressions in a simpler form

**Reciprocal and Quotient Identities**

These define how the six functions relate to one another:

Quotient: $$\tan(\theta) = \frac{\sin(\theta)}{\cos(\theta)}$$ and $$\cot(\theta) = \frac{\cos(\theta)}{\sin(\theta)}$$ Reciprocal: $$\csc(\theta) = \frac{1}{\sin(\theta)}$$$$\sec(\theta) = \frac{1}{\cos(\theta)}$$and $$\cot(\theta) = \frac{1}{\tan(\theta)}$$

**Pythagorean Identities**

Based on the Pythagorean theorem ($a^2 + b^2 = c^2$) applied to the unit circle:

$$\sin^2(\theta) + \cos^2(\theta) = 1$$ $$1 + \tan^2(\theta) = \sec^2(\theta)$$ $$1 + \cot^2(\theta) = \csc^2(\theta)$$

**example**

$$f(x) = (\sin x + \cos x)^2 - 2\sin x \cos x$$

First, we use basic algebra to expand the squared part $(a + b)^2 = a^2 + 2ab + b^2$:

$$(\sin x + \cos x)^2 = \sin^2 x + 2\sin x \cos x + \cos^2 x$$

Now, put that back into the full equation:

$$f(x) = (\sin^2 x + 2\sin x \cos x + \cos^2 x) - 2\sin x \cos x$$

1. Notice $+2\sin x \cos x$ and a $-2\sin x \cos x$. They cancel each other out completely.
2. Pythagorean Identity: You are left with $\sin^2 x + \cos^2 x$. As we know from the fundamental identity, this always equals 1.

Result: $f(x) = 1$

Beyond the basics, there are several dozen "advanced" identities used in calculus, physics, and complex engineering:

* Even/Odd Identities (6): Based on the symmetry of the circle (e.g., $\sin(-x) = -\sin x$).
* Cofunction Identities (6): Relating sines to cosines of complementary angles (e.g., $\sin(\frac{\pi}{2} - x) = \cos x$).
* Sum and Difference (6): Formulas for $\sin(A \pm B)$, etc.
* Double-Angle (5+): Formulas for $\sin(2x)$, $\cos(2x)$, and $\tan(2x)$.
* Half-Angle (3): Formulas for $\sin(\frac{x}{2})$, etc.
* Product-to-Sum & Sum-to-Product (8): Used heavily in audio and signal processing.

## Inverse Identities

**Composition Identities (Undoing the function)**

If you take the Sine of an Arcsine, they cancel out, leaving just the number.

$$\sin(\arcsin(x)) = x$$ $$\cos(\arccos(x)) = x$$ $$\tan(\arctan(x)) = x$$

**Complementary Identities**

Since the two non-right angles in a right triangle always add up to $90^\circ (\frac{\pi}{2})$ radians, their inverse functions are linked.

$$\arcsin(x) + \arccos(x) = \frac{\pi}{2}$$ $$\arctan(x) + arccot(x) = \frac{\pi}{2}$$ $$\text{sec}^{-1}(x) + \csc^{-1}(x) = \frac{\pi}{2}$$

**Negative Argument Identities**

What happens if you plug a negative number into the inverse?

* $\arcsin(-x) = -\arcsin(x)$ (The negative moves outside)
* $\arctan(-x) = -\arctan(x)$ (The negative moves outside)
* $\arccos(-x) = \pi - \arccos(x)$ (Special Case: You must subtract from 180 degrees)

## Addition and Subtraction Formulas

These allow you to calculate the sine or cosine of a sum of two angles. This is useful for finding the exact value of angles like $75^\circ$ (which is just $45^\circ + 30^\circ$).

#### The Formulas

* Sine: $$\sin(A + B) = \sin A \cos B + \cos A \sin B$$ $$\sin(A - B) = \sin A \cos B - \cos A \sin B$$
* Cosine: (Remember: signs flip!) $$\cos(A + B) = \cos A \cos B - \sin A \sin B$$ $$\cos(A - B) = \cos A \cos B + \sin A \sin B$$
* Tangent: $$\tan(A + B) = \frac{\tan A + \tan B}{1 - \tan A \tan B}$$

## Double-Angle and Half-Angle Formulas

These are used to simplify calculus problems or calculate exact values for angles without a calculator.

#### Double-Angle Formulas

Used to find the value of $2\theta$ when you know $\theta$.

Sine: $$\sin(2\theta) = 2\sin\theta\cos\theta$$ Cosine: $$\cos(2\theta) = \cos^2\theta - \sin^2\theta$$ _Alt form:_ $$2\cos^2\theta - 1$$ _Alt form:_ $$1 - 2\sin^2\theta$$ Tangent: $$\tan(2\theta) = \frac{2\tan\theta}{1 - \tan^2\theta}$$

#### Half-Angle Formulas

Used to find the value of $\frac{\theta}{2}$ when you know $\theta$. The $\pm$ depends on which quadrant the new half-angle lands in.

* Sine: $$\sin\left(\frac{\theta}{2}\right) = \pm\sqrt{\frac{1 - \cos\theta}{2}}$$
* Cosine: $$\cos\left(\frac{\theta}{2}\right) = \pm\sqrt{\frac{1 + \cos\theta}{2}}$$
* Tangent: $$\tan\left(\frac{\theta}{2}\right) = \frac{1 - \cos\theta}{\sin\theta}$$
