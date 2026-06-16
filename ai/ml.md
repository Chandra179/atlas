---
title: "Machine Learning"
aliases: []
tags: [ml]
created: "2026-06-13"
---

# Machine Learning

> **Before reading**: you should be comfortable with Python (code blocks assume basic literacy), [partial derivatives and the chain rule](math/calculus.md), and [basic linear algebra](math/linear-algebra.md) (vectors, matrices, tensors). If any of these feel rusty, review them first — the later sections build directly on this math.

## What Is Machine Learning?

Traditional programming: you write explicit rules for every case. `if temperature > 100 then alert("overheat")`. Machine learning flips this: you give the computer examples (inputs + correct outputs), and it learns the rules itself.

The computer finds patterns in data that you didn't know existed — and that you couldn't hand-code at scale. A spam filter with hand-written rules needs thousands of conditions and still misses clever spam. A trained classifier catches patterns a human never thought to encode.

At its core, ML is about **learning a function** that maps inputs to outputs by minimizing error over many examples.

## How a Single Neuron Learns

### The Perceptron

The simplest building block: take weighted inputs, add a bias, pass through an activation function, produce an output.

```python
output = activation(w1*x1 + w2*x2 + ... + wn*xn + bias)
```

The weights control how much each input matters. The bias lets the neuron fire even when all inputs are zero. The activation function decides whether and how strongly the neuron fires.

### Activation Functions

The activation function shapes what the neuron can express:

| Function | Range | Used For | Tradeoff |
|----------|-------|----------|----------|
| Sigmoid | (0, 1) | Binary classification output | Saturates → vanishing gradients |
| Tanh | (-1, 1) | Hidden layers (older nets) | Same saturation problem |
| ReLU | [0, ∞) | Hidden layers (default) | Dead neurons if input < 0 |
| GELU | (-∞, ∞) | Transformers | Non-zero gradient for negative inputs (~0.1 at -1), avoids dead neurons [^1] |
| Swish | (-∞, ∞) | Deep CNNs | Self-gated, smoother gradient landscape |

The choice affects gradient flow. Sigmoid squashes everything between 0 and 1 — great for "yes/no" at the output, but deep networks lose signal because gradients approach zero at the extremes. ReLU fixed this by being linear for positive inputs (gradient = 1), but neurons with permanently negative inputs "die" and stop learning. GELU and Swish avoid the dead-neuron problem by maintaining a non-zero gradient for negative inputs (e.g., GELU ~0.1 at -1 [^1]), enabling consistent gradient flow in very deep networks.

### Loss: Measuring How Wrong We Are

A model makes a prediction. The loss function puts a number on how far off it was:

- **MSE** (Mean Squared Error) — regression. "How many dollars off was the house price prediction?"
- **Cross-Entropy** — classification. "How confident was the wrong answer vs. the right one?"
- **Binary Cross-Entropy** — two classes (spam/not spam).
- **Categorical Cross-Entropy** — multi-class (dog vs. cat vs. bird).
- **Hinge Loss** — max-margin classification (SVMs).

The loss is the number the entire training process tries to minimize.

### Gradient Descent: Walking Downhill

If loss is a landscape, gradient descent finds the lowest valley. At each step:

1. Compute the gradient — which direction is uphill? (partial derivative of loss w.r.t. each weight)
2. Take a step in the **opposite** direction (downhill).
3. Step size = learning rate.

Too large a step: overshoot the valley, oscillate, diverge. Too small: training takes forever.

### Backpropagation: Assigning Blame

How do we know which weight to change by how much? Backpropagation applies the chain rule from calculus:

1. Forward pass: compute prediction → compute loss.
2. Backward pass: start at the loss, work backward through every operation, computing how much each weight contributed to the error.
3. Update: each weight gets nudged proportionally to its contribution.

The chain rule means `d(loss)/d(weight) = d(loss)/d(output) × d(output)/d(net_input) × d(net_input)/d(weight)`. Each layer's gradient depends on the layer after it — hence "back" propagation.^[The same principle applies regardless of depth — gradients flow backward through every differentiable operation in the computation graph.]

> **Key things**: (1) Forward pass computes predictions and loss. (2) Backward pass applies the chain rule from the loss back to each weight. (3) Each weight is updated via SGD in proportion to its contribution to the error.

## From One Neuron to Deep Networks

### Multilayer Perceptron (MLP)

Stack perceptrons into layers. The output of one layer becomes the input of the next. With enough layers and neurons, an MLP is a **universal function approximator** — it can represent any continuous function on a compact domain to arbitrary precision, provided it has a non-linear activation and sufficient width. [^2]

The magic isn't in any single neuron. It's in the composition: each layer learns progressively more abstract features. Layer 1 detects edges. Layer 2 detects shapes. Layer 3 detects objects.

### Why Deep Networks Used to Fail

Before 2006–2012, training deep networks was nearly impossible. The problem:

- **Vanishing gradients**: Sigmoid/tanh saturate at extremes. Gradient → 0. Early layers stop learning entirely.
- **Exploding gradients**: Weights > 1 compound through layers. Gradient → infinity. Weights oscillate wildly.

Three breakthroughs solved this:

**Weight Initialization** — Start weights in the right range. He initialization (for ReLU) and Xavier/Glorot (for sigmoid/tanh) scale initial weights so variance is preserved through layers. [^3][^4] Before He init, a 50-layer ReLU network's activations vanish to near zero by layer 30. With He init, activation variance stays stable through all 50 layers.

**Batch Normalization** — Normalize each layer's inputs across the mini-batch to mean 0, variance 1. Keeps activations in the unsaturated region of activation functions. [^5] Before BN, a ResNet-50 required careful LR tuning and ~100 epochs to converge. With BN, it reaches comparable accuracy in 30–40 epochs with learning rates up to 0.1.

**Layer Normalization** — Same idea, but normalize across features instead of across the batch. Independent of batch size, making it essential for Transformers where batch size varies. [^6]

### The Bias-Variance Tradeoff

All generalization error decomposes into:

- **Bias** — error from simplifying assumptions. High bias → **underfitting**. Model too simple, failed to learn patterns.
- **Variance** — error from sensitivity to training data noise. High variance → **overfitting**. Model memorized the training set.

## The Training Pipeline

### Data Preparation

Before training starts, data must be shaped and standardized:

**Tensors & Shapes** — All data flows as tensors: multi-dimensional arrays. Shape mismatch is the #1 error in AI code. An image batch: `[batch_size, channels, height, width]`. A text batch: `[batch_size, sequence_length]`.

**Normalization / Scaling** — Features on wildly different scales (age: 0–100, income: 0–1,000,000) cause gradients to pull in unbalanced directions. Squash to a common range: 0–1 (min-max) or z-score (mean 0, std 1).

**Train / Validation / Test Split** — Three separate datasets with distinct purposes:
- Train: what the model learns from.
- Validation: what you use to tune hyperparameters and detect overfitting.
- Test: what you use **once** at the end to honestly measure performance.

**Cross-Validation** — When data is limited, k-fold CV rotates which subset is validation across k training runs. More robust than a single split.

**Data Augmentation** — Artificially expand training data: rotate/crop/flip images, synonym replacement for text, cutout random patches. Teaches the model to be invariant to irrelevant variation.

**Tokenization** — Converting raw text into numbers the model understands. BPE (Byte Pair Encoding, used by GPT), WordPiece (BERT), SentencePiece (T5, LLaMA). Splits text into subword units — "unbelievable" → "un" + "believe" + "able".

**Embeddings** — Dense vector representations learned during training. A word isn't an integer ID — it's a 768-dimensional vector where "king" − "man" + "woman" ≈ "queen". Embeddings capture semantic relationships as geometric distance.

### Optimization Choices

**Mini-Batch Gradient Descent** — Don't compute the gradient over all data (too slow) or one example (too noisy). Use a mini-batch (32–256 examples). Balances speed and gradient quality.

**SGD (Stochastic Gradient Descent)** — Batch size = 1. Extremely noisy but can escape sharp local minima that batch GD gets stuck in.

**Advanced Optimizers:**

| Optimizer | What It Adds | Default For |
|-----------|-------------|-------------|
| Momentum | Velocity — accumulates gradient direction, dampens oscillation | CNNs |
| Adam | Adaptive learning rate per parameter + momentum [^10] | Most tasks (default) |
| AdamW | Adam + decoupled weight decay [^11] | Transformers, LLMs |
| RMSprop | Adaptive rates, normalized by recent gradient magnitude | RNNs, some RL |

Adam is the safe default. AdamW is preferred for Transformers because it separates weight decay from the adaptive learning rate, improving generalization.

**Learning Rate Schedules** — The learning rate shouldn't stay constant:
- Step decay: drop by factor every N epochs.
- Cosine annealing: smoothly decrease following a cosine curve. Common for Transformers.
- Warmup: start with a small LR, ramp up over first N steps. Prevents early instability.
- 1-cycle policy: one cycle of increasing then decreasing LR. Fast convergence on smaller datasets.

**Hyperparameter Tuning** — Learning rate, batch size, dropout rate, layer count, hidden size. Search strategies: grid (exhaustive, expensive), random (surprisingly effective), Bayesian (learns which regions are promising).

> **Key things**: (1) Prepare data — shape tensors correctly, normalize features, split into train/val/test. (2) Choose an optimizer and learning rate schedule. (3) Tune hyperparameters systematically — random search usually beats grid.

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

> **Practical note**: For fine-tuning large models, the sweet spot is often 1–3 epochs. Beyond that, you transition from generalizing to memorizing, especially when the fine-tuning dataset is small.

## The Architecture Zoo

Why different architectures? Because different data has different structure. A spreadsheet row, an image, and a sentence are fundamentally different shapes of information — and the architecture should reflect that structure.

### Convolutional Neural Networks (CNN) — For Spatial Data

Images have **local** structure. A pixel is related to its neighbors, not to pixels far across the image. CNNs exploit this with weight sharing: the same filter slides across the entire image, detecting the same pattern (edge, texture, shape) wherever it appears.

Key operations: convolution (pattern matching), pooling (downsampling, translation invariance), stride (how far the filter moves each step).

> **When not to use CNNs**: Avoid CNNs when global position matters more than local structure — e.g., tabular data where column order is arbitrary, or graphs where connectivity is non-Euclidean. For those cases, MLPs (tabular) or GNNs (graphs) are better suited.

### RNNs & LSTMs — For Sequential Data

Text, audio, and time series have **temporal** structure. Order matters. RNNs process input one step at a time, carrying a hidden state forward. The hidden state is the network's "memory" of everything it has seen so far.

The problem: vanilla RNNs can't learn long-range dependencies. Gradients vanish across time steps. LSTMs solved this with **gating** — learnable forget/input/output gates that control what information is kept, added, and emitted from the hidden state. The gates create shortcuts for gradients to flow unchanged across many time steps.

> **When not to use RNNs**: Skip RNNs for sequences longer than ~512 tokens — gradient issues re-emerge and sequential processing becomes a bottleneck. Transformers handle long-range dependencies and parallelize better.

### The Transformer Revolution

The insight that changed everything: instead of processing tokens one at a time (RNN bottleneck), look at **all tokens simultaneously** via attention. [^8]

**Self-Attention** — Each token computes how relevant every other token is to understanding it. "The animal didn't cross the street because it was too tired" — "it" should attend strongly to "animal." This attention score is a learned weighted sum of all tokens.

**Multi-Head Attention** — Run multiple attention operations in parallel. One head might track subject-verb agreement, another tracks pronoun references, another tracks sentiment. Each head captures a different relationship.

**Cross-Attention** — One sequence attends to another. In translation: the decoder (generating French) attends to the encoder's representation of the English source. The decoder queries, the encoder provides keys and values.

**Encoder-Decoder Architecture** — The encoder processes the input into a dense latent representation. The decoder generates the output from that representation. Backbone of T5, the original Transformer, and most seq2seq tasks. For GPT-style models, the decoder-only variant dominates.

| Mechanism | Purpose |
|-----------|---------|
| Self-Attention | Each token attends to every other token in the same sequence |
| Multi-Head Attention | Multiple parallel attention views, each capturing different relationships |
| Cross-Attention | Decoder attends to encoder's output — query from decoder, keys/values from encoder |
| Encoder-Decoder | Bidirectional encoding → autoregressive decoding |

> See [Attention Is All You Need, Figure 2](https://arxiv.org/abs/1706.03762) for the original multi-head attention diagram — the parallel structure is much clearer visually than prose can convey. [^8]

> **When not to use Transformers**: Not ideal for small datasets (<10K examples) where simpler models (e.g., CNNs, MLPs) generalize better with less compute. Also avoid when latency is critical on low-end hardware — the quadratic attention cost over sequence length adds up quickly.

### Generative Models

Three families, three approaches to creating new data:

**GANs** — Adversarial game. Generator creates fakes, discriminator tries to spot them. Both improve through competition. Produces sharp images but training is unstable (mode collapse: generator only produces one type of output).

**VAEs** — Learn a compressed latent space, then sample from it. More stable than GANs but outputs tend to be blurrier — the model averages over possibilities rather than picking one sharp output.

**Diffusion Models** — Learn to denoise. Forward: gradually add noise to an image until it's pure noise. Reverse: learn to remove noise step by step. State-of-the-art for image/video generation (Stable Diffusion, DALL-E, Sora). [^17]

### Mixture of Experts (MoE)

Instead of one giant model, have many smaller "expert" sub-networks and a router that decides which experts handle each input. Each token activates only ~2 of 8 experts. Result: massive total capacity (trillions of parameters) with compute proportional to only the active experts. Used in Mixtral, GPT-4. [^16]

### Self-Supervised Learning

The data provide their own labels. No human annotation needed:

- **Autoregressive (AR)**: predict the next token. Given "The cat sat on the", predict "mat." GPT-style.
- **Masked Language Modeling (MLM)**: hide random words, predict them. "The [MASK] sat on the mat" → "cat." BERT-style.
- **Contrastive Learning**: pull similar examples together in embedding space, push dissimilar apart. CLIP (images + captions).

## The Modern LLM Era

### Transfer Learning

The paradigm that made LLMs possible: pre-train on trillions of tokens of general-domain text and code, then fine-tune on your specific task with a fraction of the data (e.g., a few thousand examples vs. the pre-training corpus). The pre-training learns language itself — grammar, facts, reasoning patterns. Fine-tuning adapts those capabilities to your domain.

### Scaling Laws

More compute + more data + bigger model = better performance. But the relationship follows predictable power laws. [^7] The Chinchilla optimal point: for a given compute budget, model size and training tokens should scale proportionally — roughly 20 tokens per parameter. Many earlier models were over-parameterized (e.g., a 7B model trained on only 100B tokens instead of the optimal ~140B); you often get better results training a smaller model on more data. [^7]

### Alignment

Powerful models need to be steerable:

- **RLHF** (Reinforcement Learning from Human Feedback): humans rank model outputs → train a reward model that predicts human preference → use PPO (Proximal Policy Optimization) to fine-tune the model to maximize reward. [^12]
- **Constitutional AI**: the model critiques its own outputs against a set of principles (e.g., "be helpful, harmless, honest") and revises them. No human reward model needed. Used by Claude. [^13]

### Prompting as Programming

In-context learning: the model adapts its behavior based on what's in the prompt, without any weight updates. Few-shot examples, chain-of-thought ("think step by step"), and structured instructions all steer the model through the input alone. The prompt is the new programming interface.

### Model Differences

Despite all sharing Transformer roots, major models differ in:

| Dimension | GPT | Claude | Gemini |
|-----------|-----|--------|--------|
| Training data | Web-scale, broad | Curated, safety-focused | YouTube, Search, proprietary |
| Alignment | RLHF [^12] | Constitutional AI [^13] | RLHF + internal |
| Multimodality | Separate vision model | Text + image | Natively multimodal |

### Frontier Training

Training a top-tier model: 3–6 months, tens of thousands of H100/TPU GPUs interconnected with NVLink/InfiniBand. A single chip failure or network loss spike can corrupt a multi-million dollar training run. Checkpoints occur every 100–1000 steps (minutes apart), each writing terabytes of model state to parallel storage — a single lost checkpoint can lose days of computation. Fault tolerance is an engineering requirement, not a nice-to-have.

## Practical Deployment

### VRAM Is the Constraint

When running models locally, VRAM is everything. It must simultaneously hold:

- **Weights**: the actual model parameters (e.g., 7B params × 2 bytes = 14 GB for FP16).
- **Optimizer states**: Adam stores two momentum buffers per parameter (another 2× memory).
- **Gradients**: one value per parameter during training.
- **Activations**: intermediate values of every layer during the forward pass.

A 7B model at FP16: ~14 GB for weights alone. Training adds optimizer states and gradients → ~56+ GB. This is why training runs on clusters and inference can run on a single consumer GPU.

### Fitting Into Limited VRAM

When your GPU can't fit the full model:

- **Smaller models**: LLaMA 1B or 3B instead of 7B or 70B. [^18]
- **QLoRA** (Quantized Low-Rank Adaptation): freeze the full model in 4-bit, train only tiny adapter matrices. Cuts memory by ~2–3×; fine-tuning a 7B model drops from ~56 GB to ~24 GB. [^14]
- **Unsloth**: optimized CUDA kernels that speed up QLoRA fine-tuning 2–4×.
- **Quantization**: reduce precision. FP16 → INT8 → 4-bit. Each halving roughly halves VRAM. Modern 4-bit quantization loses <1% quality for many use cases.

### Knowledge Distillation

Train a small "student" model to mimic a large "teacher." The student doesn't just learn from data — it learns from the teacher's output distribution (soft labels). [^15] The student compresses the teacher's knowledge into a fraction of the size.

### Model Merging

Combine multiple fine-tuned variants into one model without retraining. SLERP (spherical linear interpolation) blends weights smoothly. DARE (Drop and REscale) randomly drops most delta parameters then rescales the remainder. Useful when you fine-tuned one model for coding and another for creative writing — merge gives you both.

### Where to Go Next

This survey covered the ML fundamentals: from a single neuron up to deploying LLMs. To go deeper:

| Path | Start With |
|------|-----------|
| **ML infrastructure** | [AI infra](ai-infra.md) — GPU pricing, cold starts, storage |
| **Reinforcement Learning** | Sutton & Barto — the canonical textbook |
| **Computer Vision** | CNNs → ResNets → ViTs |
| **NLP / LLMs** | Transformer paper → BERT → GPT → LLaMA [^8][^18] |
| **MLOps** | Production pipelines, monitoring, CI/CD for models |
| **Generative AI** | Diffusion → GANs → autoregressive models |

## References

[^1]: Hendrycks & Gimpel, 2016 — *Gaussian Error Linear Units (GELUs)* — [arXiv](https://arxiv.org/abs/1606.08415)
[^2]: Cybenko, 1989 — *Approximation by Superpositions of a Sigmoidal Function* — [Springer](https://doi.org/10.1007/BF02551274)
[^3]: He et al., 2015 — *Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet* — [arXiv](https://arxiv.org/abs/1502.01852)
[^4]: Glorot & Bengio, 2010 — *Understanding the difficulty of training deep feedforward neural networks* — [PMLR](http://proceedings.mlr.press/v9/glorot10a.html)
[^5]: Ioffe & Szegedy, 2015 — *Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift* — [arXiv](https://arxiv.org/abs/1502.03167)
[^6]: Ba et al., 2016 — *Layer Normalization* — [arXiv](https://arxiv.org/abs/1607.06450)
[^7]: Hoffmann et al., 2022 — *Training Compute-Optimal Large Language Models* (Chinchilla) — [arXiv](https://arxiv.org/abs/2203.15556)
[^8]: Vaswani et al., 2017 — *Attention Is All You Need* — [arXiv](https://arxiv.org/abs/1706.03762)
[^9]: Srivastava et al., 2014 — *Dropout: A Simple Way to Prevent Neural Networks from Overfitting* — [JMLR](https://jmlr.org/papers/v15/srivastava14a.html)
[^10]: Kingma & Ba, 2014 — *Adam: A Method for Stochastic Optimization* — [arXiv](https://arxiv.org/abs/1412.6980)
[^11]: Loshchilov & Hutter, 2017 — *Decoupled Weight Decay Regularization* (AdamW) — [arXiv](https://arxiv.org/abs/1711.05101)
[^12]: Ouyang et al., 2022 — *Training language models to follow instructions with human feedback* (InstructGPT / RLHF) — [arXiv](https://arxiv.org/abs/2203.02155)
[^13]: Bai et al., 2022 — *Constitutional AI: Harmlessness from AI Feedback* — [arXiv](https://arxiv.org/abs/2212.08073)
[^14]: Dettmers et al., 2023 — *QLoRA: Efficient Finetuning of Quantized Language Models* — [arXiv](https://arxiv.org/abs/2305.14314)
[^15]: Hinton et al., 2015 — *Distilling the Knowledge in a Neural Network* — [arXiv](https://arxiv.org/abs/1503.02531)
[^16]: Jiang et al., 2024 — *Mixtral of Experts* — [arXiv](https://arxiv.org/abs/2401.04088)
[^17]: Ho et al., 2020 — *Denoising Diffusion Probabilistic Models* — [arXiv](https://arxiv.org/abs/2006.11239)
[^18]: Touvron et al., 2023 — *LLaMA: Open and Efficient Foundation Language Models* — [arXiv](https://arxiv.org/abs/2302.13971)
