---
title: "Machine Learning"
tags: [ml, machine-learning, deep-learning]
audience: "Anyone learning ML from scratch. Comfortable with calculus and linear algebra."
style: tutorial
prerequisites:
  - math/calculus.md
  - math/linear-algebra.md
difficulty: beginner
created: "2026-06-13"
---

# Machine Learning

**Before reading**: you should be comfortable with Python (code blocks assume basic literacy), [partial derivatives and the chain rule](../math/calculus.md), and [basic linear algebra](../math/linear-algebra.md) (vectors, matrices, tensors). If any of these feel rusty, review them first the later sections build directly on this math.

## What Is Machine Learning?

Traditional programming: you write explicit rules for every case. `if temperature > 100 then alert("overheat")`. Machine learning flips this: you give the computer examples (inputs + correct outputs), and it learns the rules itself.

The computer finds patterns in data that you didn't know existed and that you couldn't hand-code at scale. A spam filter with hand-written rules needs thousands of conditions and still misses clever spam. A trained classifier catches patterns a human never thought to encode.

At its core, ML is about **learning a function** that maps inputs to outputs by minimizing error over many examples.

## How a Single Neuron Learns

### The Perceptron

The simplest building block: take weighted inputs, add a bias, pass through an activation function, produce an output.

```python
output = activation(w1*x1 + w2*x2 + ... + wn*xn + bias)
```

The weights control how much each input matters. The bias lets the neuron fire even when all inputs are zero. The activation function decides whether and how strongly the neuron fires.

Together, weights and biases are called **parameters** — the numbers the network learns during training. A small model might have millions; a large one like DeepSeek V4-Flash has 284 billion. Every parameter is a single floating-point number (e.g., `0.1542`, `-2.891`), meaningless in isolation but collectively encoding the network's knowledge.

There are three types of parameters with different roles:

- **Weights** (~99% of all parameters). Store the strength of connections between neurons. A large positive weight (e.g., 3.5) amplifies that input signal; a near-zero weight (0.0001) suppresses it; a negative weight (-1.2) inverts it.
- **Biases** (one per neuron). Set how easily a neuron activates regardless of input. A high bias means the neuron fires readily; a low or negative bias means a strong input signal is required.
- **Embeddings**. A special parameter table at the network's entrance that maps each discrete token (word, subword) to a dense vector of continuous numbers. These vectors are learned during training so that semantically similar words ("king" and "queen") end up with similar vector coordinates.

These parameters are just numbers — what transforms them into a useful output is the activation function, covered next.

### Activation Functions

The activation function shapes what the neuron can express:

| Function | Range | Used For | Key Behavior |
|----------|-------|----------|-------------|
| Sigmoid | (0, 1) | Binary classification output | Compresses any input to a 0-1 range; saturates at extremes |
| Tanh | (-1, 1) | Hidden layers (older nets) | Zero-centered; saturates at extremes |
| ReLU | [0, ∞) | Hidden layers (default) | Passes positive values through, blocks negatives to zero |
| GELU | (-∞, ∞) | Transformers, modern architectures | Smooth curve; non-zero for negative inputs [^1] |
| Swish | (-∞, ∞) | Deep CNNs | Self-gated: input × sigmoid(input); smooth everywhere |

**Sigmoid** squashes any value into a (0, 1) range — useful for outputting probabilities. It's the standard final activation for binary classification.

**Tanh** is zero-centered (range -1 to 1), which helps optimization center around zero. Popular in older recurrent networks and multi-layer perceptrons.

**ReLU** is the default hidden-layer activation. Simple and fast: it passes positive values unchanged and zeroes out negative ones. It's the go-to choice unless you have a reason to use something else.

**GELU** is the modern replacement for ReLU in Transformers and large models. Instead of a hard zero for negatives, it has a smooth curve — so every neuron stays slightly responsive regardless of input. [^1]

**Swish** (also called SiLU) is a self-gated activation where the input is multiplied by its own sigmoid. It produces a smooth, non-monotonic landscape that can help optimization in very deep convolutional networks.

Choosing the right activation depends on where it sits in the network: hidden layers need something that keeps signal flowing (ReLU, GELU), while output layers need a function that maps to the right range (Sigmoid for 0-1, linear for unbounded values).

The activation function gives the neuron a way to express itself. But how do we know if that expression is correct? We need a way to measure how far off the prediction is from the truth — that's the **loss function**.

### Loss: Measuring How Wrong We Are

A model makes a prediction. The loss function puts a number on how far off it was:

- **MSE** (Mean Squared Error) regression. "How many dollars off was the house price prediction?"
- **Cross-Entropy** classification. "How confident was the wrong answer vs. the right one?"
- **Binary Cross-Entropy** two classes (spam/not spam).
- **Categorical Cross-Entropy** multi-class (dog vs. cat vs. bird).
- **Hinge Loss** max-margin classification (SVMs).

The loss is the number the entire training process tries to minimize.

The two values being compared have standard notation: $\hat{y}$ ("y-hat") for the model's prediction and $y$ for the ground truth. The loss function $L(\hat{y}, y)$ measures the distance between them.

**Concrete example — MSE (regression).** Predicting house prices. Expected price $y = 300{,}000$, predicted price $\hat{y} = 280{,}000$:

$$\text{MSE} = (\hat{y} - y)^2 = (280{,}000 - 300{,}000)^2 = 4 \times 10^9$$

The magnitude tells the network it was far off — and squaring means a $40{,}000$ error hurts four times as much as a $20{,}000$ error.

**Concrete example — Cross-Entropy (classification).** Classifying an image as cat vs dog. Output layer produces probabilities: cat = 0.85, dog = 0.15. The true label is cat: $y = [1.0, 0.0]$. Cross-entropy penalizes the distance between the predicted distribution $[0.85, 0.15]$ and the true distribution $[1.0, 0.0]$:

$$-\sum y_i \ln(\hat{y}_i) = -(1.0 \times \ln(0.85) + 0.0 \times \ln(0.15)) = 0.16$$

A confident correct prediction (cat = 0.99) gives loss near 0. A confident wrong prediction (dog = 0.99) gives a large loss.

The loss tells us we're wrong. But how do we adjust the weights to be less wrong? Enter **gradient descent** — the algorithm that uses calculus to find which direction moves us toward a lower loss.

### Gradient Descent: Walking Downhill

If loss is a landscape, gradient descent finds the lowest valley. Imagine a U-shaped valley where height = Loss (how wrong the AI is) and horizontal position = a specific weight value. Calculus finds the slope at your current position:

- **Negative slope** (downhill to the right) → increase the weight.
- **Positive slope** (uphill to the right) → decrease the weight.

The weight update follows:

$$w_{\text{new}} = w_{\text{old}} - (\alpha \times \text{Gradient})$$

Where $\alpha$ is the **Learning Rate** — a small multiplier (e.g., 0.001) controlling step size. Too large: overshoot the valley, oscillate, diverge. Too small: training takes forever.

Gradient descent adjusts the last layer's weights. But deep networks have many layers — how does an early layer know what to change? That's where **backpropagation** comes in: it traces the error backward through every layer, computing each weight's contribution to the final loss.

### Backpropagation: Assigning Blame

Backpropagation (short for "backward propagation of errors") teaches a network from its mistakes. The forward pass makes a guess; backpropagation checks the answer key, figures out why the guess was wrong, and passes the feedback backward through the layers to adjust the weights.

Without it, a neural network is just a set of random equations throwing wild guesses.

**The 3-step process.**

Imagine a company: entry-level employees (input layer) pass work to managers (hidden layers), who pass it to the executive (output layer), who makes a final decision. If that decision loses money (high loss), backpropagation traces the mistake backward to find who needs to adjust:

1. **Forward pass**: compute prediction → compute loss. Same as the company: the executive makes a call, the result is a profit or loss.
2. **Backward pass**: start at the loss, work backward through every operation, computing how much each weight contributed to the error. Like tracing the bad decision back through the org chart.
3. **Update**: each weight gets nudged proportionally to its contribution. Each person adjusts their workflow based on how much they contributed to the loss.

**The math.** The chain rule is the mechanism for tracing blame backward:

`d(loss)/d(weight) = d(loss)/d(output) × d(output)/d(net_input) × d(net_input)/d(weight)`

Each layer's gradient depends on the layer after it hence "back" propagation.^[The same principle applies regardless of depth gradients flow backward through every differentiable operation in the computation graph.]

**A single layer's two roles.** The same layer participates in both passes, but does completely different work in each. Take Layer 2 during one training cycle:

*Phase 1 — Forward pass (left to right):* Layer 2 receives data from Layer 1, multiplies by its weights, applies its activation function (e.g., ReLU), and sends the output forward to Layer 3. The network finishes the forward pass and calculates the loss at the output.

*Phase 2 — Backward pass (right to left):* Layer 2 waits as the error signal travels backward through Layer 3. It receives the gradient from Layer 3, multiplies it by its own activation derivative to compute its weight adjustments, and passes the remaining gradient backward to Layer 1.

The backward pass cannot run in isolation — the derivative of most activation functions depends on what the input was during the forward pass, so the backward pass must reference the values stored during the forward pass.

### Forward Activation vs Backward Derivative

Are the forward and backward functions the same? No. The forward pass uses the activation function $f(x)$; the backward pass uses its derivative $f'(x)$.

| Function | Forward Pass (what it computes) | Backward Pass (what it computes) |
|----------|----------------------------------|----------------------------------|
| ReLU | $f(x) = \max(0, x)$ | $f'(x) = 1$ if $x > 0$, else $0$ |
| Sigmoid | $f(x) = \frac{1}{1 + e^{-x}}$ | $f'(x) = f(x) \times (1 - f(x))$; max value $0.25$ |
| GELU | $f(x) \approx 0.5x(1 + \tanh(\sqrt{2/\pi}(x + 0.044715x^3)))$ | $f'(x) \approx 1$ for $x \gg 0$, approaches $0$ for $x \ll 0$ |

The derivative tells the network how **sensitive** the output is to changes in the input. A steep slope (ReLU for $x > 0$): changing this weight will have a large impact on the final error. A flat slope (ReLU for $x < 0$): don't bother — changing the weight won't change the output at all. This is why dead ReLUs freeze permanently: the derivative is $0$, so the gradient is $0$, so the weight never updates: $w_{\text{new}} = w_{\text{old}} - 0$.

**Why is it an algorithm, not a formula?** Backpropagation caches (saves) the gradient at each layer as it computes them backward. Instead of recalculating the entire network from scratch for every weight, it reuses the cached gradient from the layer ahead. This recursive reuse is what made training deep networks computationally feasible in the 1980s.

Putting it all together, every training step follows the same cycle:

1. **Forward pass**: data enters the input layer, travels through hidden layers (with activation functions like ReLU/GELU), and reaches the output layer to produce a prediction $\hat{y}$.
2. **Calculate error**: the loss function $L(\hat{y}, y)$ compares the prediction against the ground truth $y$.
3. **Backward pass (backpropagation)**: the loss score propagates backward through the network. The chain rule multiplies through the derivatives of each activation function to calculate how much each weight contributed to the error.
4. **Update**: each weight gets nudged in the direction that reduces the loss — gradient descent.

This cycle repeats millions of times across the training dataset, gradually sculpting the weights until the network produces accurate predictions.

The same cycle applies to LLMs, with the concrete steps specialized for text:

1. **Text → Vectors** — tokens become embeddings.
2. **Vectors × Weights** — stacked Transformer layers transform them.
3. **GELU** — keeps gradients flowing through 100+ layers.
4. **Vocab projection** — final vector dot-producted against vocabulary matrix → logits.
5. **Softmax** — normalizes logits into probabilities.
6. **Loss** — error measured against ground truth.
7. **Gradient descent** — calculus slides weights down the loss curve.

## From One Neuron to Deep Networks

### Multilayer Perceptron (MLP)

Stack perceptrons into layers. The output of one layer becomes the input of the next. With enough layers and neurons, an MLP is a **universal function approximator**: it can represent any continuous function on a compact domain to arbitrary precision, provided it has a non-linear activation and sufficient width. [^2]

The magic isn't in any single neuron. It's in the composition: each layer learns progressively more abstract features. Layer 1 detects edges. Layer 2 detects shapes. Layer 3 detects objects.

**What if there are zero hidden layers?** A network with only an input layer and an output layer (no hidden layers) is equivalent to a classic statistical model: **Linear Regression** (if the output activation is linear) or **Logistic Regression** (if the output activation is Sigmoid). It can only solve linearly separable problems — patterns a straight line can separate. This is not enough for recognizing handwritten digits, understanding text, or most real-world tasks.

**The minimum for real AI: one hidden layer.** Add a single hidden layer with a non-linear activation function (ReLU, GELU), and the **Universal Approximation Theorem** applies: such a network can approximate any continuous function on a compact domain to arbitrary precision, given enough neurons. [^2] The theorem explains why depth (even just one hidden layer) transforms a linear model into a general-purpose function learner.

### From Neurons to Vector Math

The explanations so far describe individual neurons, but real implementations never compute one neuron at a time in loops — that would be far too slow for GPUs. Instead, all neurons in a layer are grouped into a **matrix** (a grid of numbers), and the entire layer's computation happens in a single matrix multiplication.

**Forward pass: matrix multiply.** A layer with $n$ input features and $m$ output neurons stores its weights as an $m \times n$ matrix $W$. The entire batch of inputs $X$ (shape $b \times n$, where $b$ is batch size) is multiplied by $W$ in one shot:

$$Z = XW^T + b$$

This single operation computes the weighted sum for every neuron, for every example in the batch, simultaneously. The result $Z$ (shape $b \times m$) then passes through the activation function element-wise — also parallelized.

**Backward pass: Jacobian matrix.** During backpropagation, the network doesn't compute one derivative at a time either. It computes a **Jacobian matrix** — the matrix of all partial derivatives of the layer's outputs with respect to its inputs or weights. The gradient flows backward as a matrix of the same shape as the forward activations, getting multiplied by the Jacobian of each layer's activation function.

Instead of a single stream of numbers, think of massive sheets of data sliding forward (activations) and sliding backward (gradients), with matrix multiplication transforming them at every layer.

### Mixing Activation Functions

Can you use multiple activation functions inside the same layer? Within a single layer, no — every neuron in a given layer uses the same function (all ReLU, all GELU, etc.). This keeps the matrix math efficient for GPU parallelism.

Across different layers, yes — mixing is standard practice. A binary classifier might use ReLU or GELU in all hidden layers (for healthy gradient flow) and Sigmoid in the output layer (to squash the final logit into a $(0, 1)$ probability). Each activation is chosen for what that layer needs: gradient flow in the depths, output-range control at the surface.

### How Activations Affect Backpropagation

Backpropagation multiplies derivatives through every layer via the chain rule:

$$\text{Total Gradient} = \text{Layer N Gradient} \times \cdots \times \text{Layer 2 Gradient} \times \text{Activation Derivative}$$

If any activation derivative is zero, the entire gradient chain collapses to zero — that weight freezes and stops learning. This is why the choice of activation function has outsized impact on trainability.

The activation function's derivative acts as a **gatekeeper** for the gradient signal during backpropagation:

- **Sigmoid**: derivative caps at $0.25$. Multiply $0.25 \times 0.25 \times 0.25$ backward through three layers and the signal nearly vanishes. Through 100 layers it's effectively zero — early layers stop learning.
- **ReLU**: derivative is $1$ for positive inputs (passes gradient perfectly), $0$ for negative inputs (blocks it entirely — the dead ReLU problem).
- **GELU**: derivative is ~$1$ for positive inputs and a small non-zero value for negative inputs. A fraction of gradient leaks through even negative neurons, keeping all layers trainable.

**Depth multiplies the effect.** Every added layer means one more multiplication by the activation derivative via the chain rule. Three Sigmoid layers multiply three fractions ($0.2 \times 0.2 \times 0.2 = 0.008$) — learning is slow but possible. 100 Sigmoid layers produce a gradient so tiny that early-layer weights never change. This is why deep networks require ReLU or GELU.

### What Happens After the Activation Function?

Depends on where you are in the network:

- **Inside a hidden layer**: the output of the activation function is called an **activation** (or feature representation). It is not the final answer — it immediately becomes the input to the next layer, where it gets multiplied by new weights and biases.
- **At the final output layer**: yes, the activation function's output is the network's prediction — a probability, a class label, or a regressed value.

$$\text{Input} \rightarrow [\text{Weights} \times \text{Input} + \text{Bias}] \rightarrow \text{Activation} \rightarrow \text{Output to next layer (or final prediction)}$$

### Designing the Output Layer

The number of neurons in the output layer depends on the task:

| Goal | Output Neurons | Example | Final Activation |
|------|---------------|---------|-----------------|
| Regression (continuous number) | 1 | House price: \$350,000 | None (linear) |
| Binary classification | 1 | Spam (1) vs Not Spam (0) | Sigmoid |
| Multi-class classification | 1 per class | Cat / Dog / Bird (3 neurons) | Softmax |

The layer before the output is just the last hidden layer. Because it holds the network's final compressed representation before the decision, it's often called the **features layer** or **embedding layer**.

### Customizing the Layer Before the Output

This layer is one of the most powerful customization points in a neural network. By the time data reaches it, earlier layers have stripped away noise and turned raw input into a compact set of abstract features. The output layer simply applies a final math operation (Sigmoid, Softmax) to turn those features into a prediction.

Three common customizations:

**1. Custom size (dimensionality).** A large layer (e.g., 1024 neurons) passes a detailed blueprint to the output. A small layer (e.g., 16 neurons) bottlenecks the data, compressing it to only the most critical features.

**2. Dropout regularization.** Because this layer has outsized influence on the final prediction, applying Dropout here (randomly turning off e.g., 30% of neurons during training) forces the network to be robust and prevents over-reliance on any single feature.

**3. Transfer learning ("chopping off" the output).** Download a pre-trained model (trained on millions of images or billions of tokens), remove its original output layer, and attach your own. The pre-trained feature layer already knows how to extract powerful representations — you only need to train a small new output head on your specific task. This is how industry adapts massive models to niche problems with minimal data and compute.

### Why Deep Networks Used to Fail

Before 2006–2012, training deep networks was nearly impossible. The problem:

- **Vanishing gradients**: Sigmoid/tanh saturate at extremes. Gradient → 0. Early layers stop learning entirely.
- **Exploding gradients**: Weights > 1 compound through layers. Gradient → infinity. Weights oscillate wildly.

Three breakthroughs solved this:

**Weight Initialization** Start weights in the right range. He initialization (for ReLU) and Xavier/Glorot (for sigmoid/tanh) scale initial weights so variance is preserved through layers. [^3][^4] Before He init, a 50-layer ReLU network's activations vanish to near zero by layer 30. With He init, activation variance stays stable through all 50 layers.

**Batch Normalization** Normalize each layer's inputs across the mini-batch to mean 0, variance 1. Keeps activations in the unsaturated region of activation functions. [^5] Before BN, a ResNet-50 required careful LR tuning and ~100 epochs to converge. With BN, it reaches comparable accuracy in 30–40 epochs with learning rates up to 0.1.

**Layer Normalization** Same idea, but normalize across features instead of across the batch. Independent of batch size, making it essential for Transformers where batch size varies. [^6]

### The Bias-Variance Tradeoff

All generalization error decomposes into:

- **Bias** error from simplifying assumptions. High bias → **underfitting**. Model too simple, failed to learn patterns.
- **Variance** error from sensitivity to training data noise. High variance → **overfitting**. Model memorized the training set.

## The Training Pipeline

### Data Preparation

Shape and standardize data before training starts:

**Tensors & Shapes** All data flows as tensors: multi-dimensional arrays. Shape mismatch is the #1 error in AI code. An image batch: `[batch_size, channels, height, width]`. A text batch: `[batch_size, sequence_length]`.

**Normalization / Scaling** Features on wildly different scales (age: 0–100, income: 0–1,000,000) cause gradients to pull in unbalanced directions. Squash to a common range: 0–1 (min-max) or z-score (mean 0, std 1).

**Train / Validation / Test Split** Three separate datasets with distinct purposes:
- Train: what the model learns from.
- Validation: what you use to tune hyperparameters and detect overfitting.
- Test: what you use **once** at the end to honestly measure performance.

**Cross-Validation** When data is limited, k-fold CV rotates which subset is validation across k training runs. More robust than a single split.

**Data Augmentation** Artificially expand training data: rotate/crop/flip images, synonym replacement for text, cutout random patches. Teaches the model to be invariant to irrelevant variation.

**Tokenization** Converting raw text into numbers the model understands. BPE (Byte Pair Encoding, used by GPT), WordPiece (BERT), SentencePiece (T5, LLaMA). Splits text into subword units "unbelievable" → "un" + "believe" + "able".

**Embeddings** Dense vector representations learned during training. A word isn't an integer ID it's a 768-dimensional vector where "king" − "man" + "woman" ≈ "queen". Embeddings capture semantic relationships as geometric distance.

### Optimization Choices

**Mini-Batch Gradient Descent** Don't compute the gradient over all data (too slow) or one example (too noisy). Use a mini-batch (32–256 examples). Balances speed and gradient quality.

**SGD (Stochastic Gradient Descent)** Batch size = 1. Extremely noisy but can escape sharp local minima that batch GD gets stuck in.

**Advanced Optimizers:**

| Optimizer | What It Adds | Default For |
|-----------|-------------|-------------|
| Momentum | Velocity accumulates gradient direction, dampens oscillation | CNNs |
| Adam | Adaptive learning rate per parameter + momentum [^10] | Most tasks (default) |
| AdamW | Adam + decoupled weight decay [^11] | Transformers, LLMs |
| RMSprop | Adaptive rates, normalized by recent gradient magnitude | RNNs, some RL |

Adam is the safe default. AdamW is preferred for Transformers because it separates weight decay from the adaptive learning rate, improving generalization.

**Learning Rate Schedules** The learning rate shouldn't stay constant:
- Step decay: drop by factor every N epochs.
- Cosine annealing: smoothly decrease following a cosine curve. Common for Transformers.
- Warmup: start with a small LR, ramp up over first N steps. Prevents early instability.
- 1-cycle policy: one cycle of increasing then decreasing LR. Fast convergence on smaller datasets.

**Hyperparameter Tuning** Learning rate, batch size, dropout rate, layer count, hidden size. Search strategies: grid (exhaustive, expensive), random (surprisingly effective), Bayesian (learns which regions are promising).

## Fight Overfitting

Beyond architecture choices, these techniques directly combat overfitting:

| Technique | Mechanism | When to Use |
|-----------|-----------|-------------|
| L₁ (Lasso) | Penalizes absolute weight values → sparse weights | Feature selection |
| L₂ (Ridge / Weight Decay) | Penalizes squared weight values → small weights | Almost always |
| Dropout | Randomly zeroes neurons during training → forces redundancy [^9] | Dense layers, not CNNs |
| Early Stopping | Halt when validation loss stops improving | Always monitor |
| Calibration | Ensures predicted probabilities match real likelihoods | Risk-sensitive apps |
| Distribution Shift | Monitor when deployment data differs from training | Production ML |

Distribution shift is the silent killer of deployed models. Covariate shift (input distribution changes) and concept drift (the relationship between input and output changes) degrade performance without any code change or error message.

**Practical note**: For fine-tuning large models, the sweet spot is often 1–3 epochs. Beyond that, you transition from generalizing to memorizing, especially when the fine-tuning dataset is small.

## The Modern LLM Era

### How LLMs Are Trained

An LLM is a next-token predictor. Given a sequence of tokens, it predicts the next one. Training works exactly like any neural network — the same forward pass, loss calculation, backpropagation, and gradient descent — but specialized for text.

**The task.** Feed the model a prompt like "The cat sat on the". The expected output $y$ is the next token from the training text: "mat". The model's actual output $\hat{y}$ is a probability distribution over the entire vocabulary: "mat" = 60%, "floor" = 20%, "couch" = 10%, etc.

**The loss function.** LLMs use **Cross-Entropy Loss** (Categorical Cross-Entropy) on each token prediction:

$$\text{Loss} = -\ln(P_{\text{correct}})$$

If the model predicts "mat" with 99% confidence, $-\ln(0.99) \approx 0.01$ — nearly zero. If it predicts "mat" with 10% confidence, $-\ln(0.10) \approx 2.3$ — a heavy penalty. A 0% prediction would give infinite loss, so the training objective strongly rewards confident correct predictions.

**Perplexity.** For a sentence of 10 tokens, the model makes 10 separate predictions, each with its own Cross-Entropy loss. The average loss across all token positions is exponentiated to produce **perplexity**:

$$\text{Perplexity} = \exp\left(\frac{1}{N} \sum_{i=1}^{N} -\ln(P_{\text{token}_i})\right)$$

Perplexity answers: "How many tokens is the model effectively choosing between at each step?" Lower is better. A perplexity of 10 means the model is as uncertain as if picking uniformly from 10 options.

**One training step.** The cross-entropy loss over the sequence is calculated, then backpropagation sends gradients backward through every Transformer layer (through every GELU activation) to update the model's billions of weights. This is the same learning cycle described in [Backpropagation](#backpropagation-assigning-blame), just at enormous scale.

**Standard neural network vs LLM training:**

| Dimension | Standard Network | LLM |
|-----------|-----------------|-----|
| Input | House features (sq ft, bedrooms) | Sequence of text tokens |
| Output $\hat{y}$ | Single continuous number ($350{,}000$) | Probability distribution over entire vocabulary |
| Expected $y$ | True selling price ($340{,}000$) | Actual next token in training text |
| Loss function | MSE | Cross-Entropy (per token) |

### How Knowledge and Context Are Stored

An LLM uses two completely different memory systems that collaborate during every prompt:

**Parametric memory (knowledge).** This is the model's permanent encyclopedia — facts, grammar, coding syntax, reasoning patterns. It lives in the **parameters** (weights), frozen after training. Backpropagation decides where each piece of knowledge goes: frequent patterns (basic grammar) settle into early layers; specialized knowledge (Python code, medical diagnosis) routes to specific expert sub-networks in MoE models. Humans never assign knowledge to specific neurons — the gradients carve the structure automatically.

**Non-parametric memory (context).** This is the model's temporary scratchpad — the exact words in your current prompt and conversation history. It lives in the **KV cache** (cached attention keys and values in GPU memory), not in the parameters. If every chat were saved into the weights, the model's permanent knowledge would change after every conversation, causing confusion and catastrophic forgetting.

**How they interact during a prompt.** When you give the model a long document and ask a question:

1. The context (your document) is loaded into the compressed KV cache — a fast temporary buffer.
2. The attention parameters scan the KV cache to find relevant passages.
3. The router (in MoE models) identifies the topic and dispatches tokens to specialized expert parameters.
4. The expert parameters apply their permanent knowledge to generate the answer.
5. When the session ends, the KV cache is discarded. The parameters remain unchanged, ready for the next user.

### Transfer Learning

The paradigm that made LLMs possible: pre-train on trillions of tokens of general-domain text and code, then fine-tune on your specific task with a fraction of the data (e.g., a few thousand examples vs. the pre-training corpus). The pre-training learns language itself grammar, facts, reasoning patterns. Fine-tuning adapts those capabilities to your domain.

### Scaling Laws

More compute + more data + bigger model = better performance. But the relationship follows predictable power laws. [^7] The Chinchilla optimal point: for a given compute budget, model size and training tokens should scale proportionally roughly 20 tokens per parameter. Many earlier models were over-parameterized (e.g., a 7B model trained on only 100B tokens instead of the optimal ~140B); you often get better results training a smaller model on more data. [^7]

### Alignment

Powerful models need to be steerable:

- **RLHF** (Reinforcement Learning from Human Feedback): humans rank model outputs → train a reward model that predicts human preference → use PPO (Proximal Policy Optimization) to fine-tune the model to maximize reward. [^12]
- **Constitutional AI**: the model critiques its own outputs against a set of principles (e.g., "be helpful, harmless, honest") and revises them. No human reward model needed. Used by Claude. [^13]
- **DPO** (Direct Preference Optimization): eliminates the separate reward model entirely. Instead, it directly optimizes the policy from human preference pairs using a classification-style loss. [^19] DPO is simpler to implement (no PPO training loop, no reward model to maintain), more stable, and matches or exceeds RLHF-PPO on many benchmarks. However, RLHF-PPO can still outperform DPO when you have an online reward model that can label new model outputs during training, rather than relying on a fixed dataset of human preferences. [^20]

| Method | Reward Model | Training Loop | Stability | Data Needed |
|--------|--------------|---------------|-----------|-------------|
| RLHF-PPO | Separate model | 4-model pipeline (policy, reference, reward, value) | Brittle | Preference pairs + online reward labels |
| Constitutional AI | Principles (text) | Self-critique + revision | Stable | Principles + few examples |
| DPO | None (implicit) | Single model, classification loss | Very stable | Preference pairs only |

### Prompting as Programming

In-context learning: the model adapts its behavior based on what's in the prompt, without any weight updates. The prompt is the new programming interface.

**Few-shot learning** Provide examples in the prompt. Zero-shot (no examples) works for simple tasks. One-shot (1 example) anchors format. Few-shot (3–10 examples) improves accuracy on classification, translation, and structured extraction. Performance gains diminish after ~5–8 examples for most tasks.

**Chain-of-Thought (CoT)** Instead of asking for the answer directly, prompt: "Let's think step by step." [^24] The model generates intermediate reasoning steps, which improves accuracy on multi-step math, logic, and planning tasks. Zero-shot CoT ("Let's think step by step") alone boosts GSM8K math scores from ~18% to ~41% on un-fine-tuned models. [^27]

CoT variants:
- **Tree of Thoughts (ToT)**: explore multiple reasoning branches, evaluate each, backtrack from dead ends. Used when correctness matters more than latency — solves problems GPT-4 with standard prompting can't solve. [^25]
- **Self-Consistency**: sample multiple reasoning paths, pick the majority answer. Works when CoT alone is unreliable diversity of reasoning compensates for individual errors.
- **ReAct** (Reason + Act): interleave reasoning with tool calls. "I need the weather → call `get_weather("SF")` → result is 72F → therefore no raincoat needed." [^26] Foundation of agentic workflows.

**System prompt design** The system message sets the model's role, tone, constraints, and output format. A well-designed system prompt is the difference between a model that follows instructions and one that improvises. Include: who the model is, what it should do, what it must never do, and the exact output format.

**Structured output** Force the model to emit valid JSON, XML, or function-call syntax. Techniques: JSON mode (grammar-constrained decoding guarantees valid syntax), function calling (model outputs `{"name": "search", "parameters": {...}}`), and constrained sampling (mask tokens that would produce invalid output).

**Token budget** Every prompt competes for the context window. Strategies: truncate oldest messages first, summarize prior conversation, use prompt compression (LLMLingua [^28]), or chunk long documents into overlapping windows. The context window is a finite resource — treat it like RAM.

| Technique | When to Use | Cost |
|-----------|-------------|------|
| Zero-shot | Simple tasks, known formats | 1 prompt |
| Few-shot | Classification, extraction, domain-specific tasks | 1 prompt + N examples |
| CoT + few-shot | Multi-step reasoning, math | 1 prompt + N reasoned examples |
| ToT | Planning, puzzles, hard reasoning | 10–100× CoT cost |
| Self-Consistency | When CoT is noisy, accuracy > latency | 5–40× CoT cost |
| ReAct | Tasks requiring tools, search, or environment interaction | Variable per action loop |
| Structured output | API integration, data extraction | Slight latency increase for constrained decoding |

### Model Differences

Despite all sharing Transformer roots, major models differ in:

| Dimension | GPT | Claude | Gemini |
|-----------|-----|--------|--------|
| Training data | Web-scale, broad | Curated, safety-focused | YouTube, Search, proprietary |
| Alignment | RLHF [^12] | Constitutional AI [^13] | RLHF + internal |
| Multimodality | Separate vision model | Text + image | Natively multimodal |

### Frontier Training

Training a top-tier model: 3–6 months, tens of thousands of H100/TPU GPUs interconnected with NVLink/InfiniBand. A single chip failure or network loss spike can corrupt a multi-million dollar training run. Checkpoints occur every 100–1000 steps (minutes apart), each writing terabytes of model state to parallel storage a single lost checkpoint can lose days of computation. Fault tolerance is an engineering requirement, not a nice-to-have.

## Embeddings & Vector Representations

See [embeddings.md](embeddings.md) — embedding models, similarity measures, dimensionality tradeoffs, vector databases, and code/image/multimodal embeddings.

## Practical Deployment

VRAM is the binding constraint: a 7B FP16 model needs ~14 GB for weights alone; training adds optimizer states and gradients → ~56+ GB. For detailed guidance:
- **[Quantization](quantization.md)** — reduce precision to fit models in limited VRAM (FP16 → INT8 → 4-bit).
- **[Fine-tuning](fine-tuning.md)** — QLoRA for efficient fine-tuning on consumer GPUs.
- **Knowledge Distillation**: train a small "student" model to mimic a large "teacher" using the teacher's output distribution (soft labels). [^15]
- **Model Merging**: combine multiple fine-tuned variants without retraining using SLERP or DARE [^29].

## Model Evaluation & Benchmarks

See [evaluation.md](evaluation.md) — perplexity, generation metrics, LLM-as-Judge, Elo ratings, benchmark suite, and human evaluation.

### Go Deeper

| Path | Start With |
|------|-----------|
| **ML infrastructure** | [AI infra](ai-infra.md) vLLM, HuggingFace, scaling. [Use case: Gemma 4 on Modal](modal-gemma4-h200.md) GPU pricing, cold starts, storage |
| **Architectures** | [neural-network.md](neural-network.md) CNN, RNN, Transformer, MoE, generative models |
| **Embeddings** | [embeddings.md](embeddings.md) embedding models, similarity, vector DBs. [Specialized Databases](../database/specialized-databases.md) for pgvector/Pinecone/Milvus |
| **Evaluation** | [evaluation.md](evaluation.md) perplexity, benchmarks, LLM-as-Judge, human eval |
| **Reinforcement Learning** | Sutton & Barto — the canonical textbook |
| **Computer Vision** | CNNs → ResNets → ViTs |
| **NLP / LLMs** | Transformer paper → BERT → GPT → LLaMA. See [neural-network.md](neural-network.md) for the full architecture deep-dive. [^18] |
| **MLOps** | Production pipelines, monitoring, CI/CD for models |
| **Generative AI** | Diffusion → GANs → autoregressive models |

## References

[^1]: Hendrycks & Gimpel, 2016 *Gaussian Error Linear Units (GELUs)* [arXiv](https://arxiv.org/abs/1606.08415)
[^2]: Cybenko, 1989 *Approximation by Superpositions of a Sigmoidal Function* [Springer](https://doi.org/10.1007/BF02551274)
[^3]: He et al., 2015 *Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet* [arXiv](https://arxiv.org/abs/1502.01852)
[^4]: Glorot & Bengio, 2010 *Understanding the difficulty of training deep feedforward neural networks* [PMLR](http://proceedings.mlr.press/v9/glorot10a.html)
[^5]: Ioffe & Szegedy, 2015 *Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift* [arXiv](https://arxiv.org/abs/1502.03167)
[^6]: Ba et al., 2016 *Layer Normalization* [arXiv](https://arxiv.org/abs/1607.06450)
[^7]: Hoffmann et al., 2022 *Training Compute-Optimal Large Language Models* (Chinchilla) [arXiv](https://arxiv.org/abs/2203.15556)
[^9]: Srivastava et al., 2014 *Dropout: A Simple Way to Prevent Neural Networks from Overfitting* [JMLR](https://jmlr.org/papers/v15/srivastava14a.html)
[^10]: Kingma & Ba, 2014 *Adam: A Method for Stochastic Optimization* [arXiv](https://arxiv.org/abs/1412.6980)
[^11]: Loshchilov & Hutter, 2017 *Decoupled Weight Decay Regularization* (AdamW) [arXiv](https://arxiv.org/abs/1711.05101)
[^12]: Ouyang et al., 2022 *Training language models to follow instructions with human feedback* (InstructGPT / RLHF) [arXiv](https://arxiv.org/abs/2203.02155)
[^13]: Bai et al., 2022 *Constitutional AI: Harmlessness from AI Feedback* [arXiv](https://arxiv.org/abs/2212.08073)
[^15]: Hinton et al., 2015 *Distilling the Knowledge in a Neural Network* [arXiv](https://arxiv.org/abs/1503.02531)
[^18]: Touvron et al., 2023 *LLaMA: Open and Efficient Foundation Language Models* [arXiv](https://arxiv.org/abs/2302.13971)
[^19]: Rafailov et al., 2023 *Direct Preference Optimization: Your Language Model is Secretly a Reward Model* [arXiv](https://arxiv.org/abs/2305.18290)
[^20]: Xu et al., 2024 *When is DPO Better than PPO?* comparison of offline vs online preference optimization [arXiv](https://arxiv.org/abs/2404.10719)
[^24]: Wei et al., 2022 *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models* [arXiv](https://arxiv.org/abs/2201.11903)
[^25]: Yao et al., 2023 *Tree of Thoughts: Deliberate Problem Solving with Large Language Models* [arXiv](https://arxiv.org/abs/2305.10601)
[^26]: Yao et al., 2022 *ReAct: Synergizing Reasoning and Acting in Language Models* [arXiv](https://arxiv.org/abs/2210.03629)
[^27]: Kojima et al., 2022 *Large Language Models are Zero-Shot Reasoners* [arXiv](https://arxiv.org/abs/2205.11916)
[^28]: Jiang et al., 2023 *LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models* [arXiv](https://arxiv.org/abs/2310.05736)
[^29]: Yadav et al., 2024 *DARE: Diverse Activation Re-Weighting for Model Merging* [arXiv](https://arxiv.org/abs/2311.03099)
