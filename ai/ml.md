---
title: "Machine Learning"
aliases: []
tags: [ml]
created: "2026-06-13"
---

# Machine Learning

> **Before reading**: you should be comfortable with Python (code blocks assume basic literacy), [partial derivatives and the chain rule](math/calculus.md), and [basic linear algebra](math/linear-algebra.md) (vectors, matrices, tensors). If any of these feel rusty, review them first the later sections build directly on this math.

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

### Activation Functions

The activation function shapes what the neuron can express:

| Function | Range | Used For | Tradeoff |
|----------|-------|----------|----------|
| Sigmoid | (0, 1) | Binary classification output | Saturates → vanishing gradients |
| Tanh | (-1, 1) | Hidden layers (older nets) | Same saturation problem |
| ReLU | [0, ∞) | Hidden layers (default) | Dead neurons if input < 0 |
| GELU | (-∞, ∞) | Transformers | Non-zero gradient for negative inputs (~0.1 at -1), avoids dead neurons [^1] |
| Swish | (-∞, ∞) | Deep CNNs | Self-gated, smoother gradient landscape |

The choice affects gradient flow because backpropagation multiplies derivatives through every layer via the chain rule:

$$\text{Total Gradient} = \text{Layer 3 Gradient} \times \text{Layer 2 Gradient} \times \text{Activation Derivative}$$

If any activation derivative is zero, the entire gradient chain collapses to zero — the weight freezes and stops learning.

Sigmoid squashes everything between 0 and 1 — great for "yes/no" outputs, but deep networks lose signal because gradients approach zero at the extremes (vanishing gradients). ReLU fixed this by being linear for positive inputs (gradient = 1), but neurons with permanently negative inputs output exactly 0, whose derivative is 0 — multiplying the gradient chain by 0 kills it. This is the **Dead ReLU** problem: the weight update becomes $w_{\text{new}} = w_{\text{old}} - 0$ and the neuron freezes permanently.

GELU avoids this by maintaining a non-zero gradient for negative inputs (e.g., ~0.1 at -1 [^1]). That tiny curve instead of a flat line lets a fraction of the gradient leak backward even through negative neurons, keeping all 100+ layers trainable. This is why modern Transformers use GELU.

### Loss: Measuring How Wrong We Are

A model makes a prediction. The loss function puts a number on how far off it was:

- **MSE** (Mean Squared Error) regression. "How many dollars off was the house price prediction?"
- **Cross-Entropy** classification. "How confident was the wrong answer vs. the right one?"
- **Binary Cross-Entropy** two classes (spam/not spam).
- **Categorical Cross-Entropy** multi-class (dog vs. cat vs. bird).
- **Hinge Loss** max-margin classification (SVMs).

The loss is the number the entire training process tries to minimize.

### Gradient Descent: Walking Downhill

If loss is a landscape, gradient descent finds the lowest valley. Imagine a U-shaped valley where height = Loss (how wrong the AI is) and horizontal position = a specific weight value. Calculus finds the slope at your current position:

- **Negative slope** (downhill to the right) → increase the weight.
- **Positive slope** (uphill to the right) → decrease the weight.

The weight update follows:

$$w_{\text{new}} = w_{\text{old}} - (\alpha \times \text{Gradient})$$

Where $\alpha$ is the **Learning Rate** — a small multiplier (e.g., 0.001) controlling step size. Too large: overshoot the valley, oscillate, diverge. Too small: training takes forever.

### Backpropagation: Assigning Blame

How do we know which weight to change by how much? Backpropagation applies the chain rule from calculus:

1. Forward pass: compute prediction → compute loss.
2. Backward pass: start at the loss, work backward through every operation, computing how much each weight contributed to the error.
3. Update: each weight gets nudged proportionally to its contribution.

The chain rule means `d(loss)/d(weight) = d(loss)/d(output) × d(output)/d(net_input) × d(net_input)/d(weight)`. Each layer's gradient depends on the layer after it hence "back" propagation.^[The same principle applies regardless of depth gradients flow backward through every differentiable operation in the computation graph.]

The full learning loop:

1. **Text → Vectors** — tokens become embeddings.
2. **Vectors × Weights** — stacked Transformer layers transform them.
3. **GELU** — keeps gradients flowing through 100+ layers.
4. **Vocab projection** — final vector dot-producted against vocabulary matrix → logits.
5. **Softmax** — normalizes logits into probabilities.
6. **Loss** — error measured against ground truth.
7. **Gradient descent** — calculus slides weights down the loss curve.

## From One Neuron to Deep Networks

### Multilayer Perceptron (MLP)

Stack perceptrons into layers. The output of one layer becomes the input of the next. With enough layers and neurons, an MLP is a **universal function approximator** it can represent any continuous function on a compact domain to arbitrary precision, provided it has a non-linear activation and sufficient width. [^2]

The magic isn't in any single neuron. It's in the composition: each layer learns progressively more abstract features. Layer 1 detects edges. Layer 2 detects shapes. Layer 3 detects objects.

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

Before training starts, data must be shaped and standardized:

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

> **Practical note**: For fine-tuning large models, the sweet spot is often 1–3 epochs. Beyond that, you transition from generalizing to memorizing, especially when the fine-tuning dataset is small.

## The Modern LLM Era

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

**Few-shot learning** Provide examples in the prompt. Zero-shot (no examples) works for simple tasks. One-shot (1 example) anchors format. Few-shot (3–10 examples) dramatically improves accuracy on classification, translation, and structured extraction. Performance gains diminish after ~5–8 examples for most tasks.

**Chain-of-Thought (CoT)** Instead of asking for the answer directly, prompt: "Let's think step by step." [^24] The model generates intermediate reasoning steps, which improves accuracy on multi-step math, logic, and planning tasks. Zero-shot CoT ("Let's think step by step") alone boosts GSM8K math scores from ~18% to ~41% on un-fine-tuned models.

CoT variants:
- **Tree of Thoughts (ToT)**: explore multiple reasoning branches, evaluate each, backtrack from dead ends. Used when correctness matters more than latency solves problems GPT-4 with standard prompting can't. [^25]
- **Self-Consistency**: sample multiple reasoning paths, pick the majority answer. Works well when CoT alone is unreliable diversity of reasoning compensates for individual errors.
- **ReAct** (Reason + Act): interleave reasoning with tool calls. "I need the weather → call `get_weather("SF")` → result is 72F → therefore no raincoat needed." [^26] Foundation of agentic workflows.

**System prompt design** The system message sets the model's role, tone, constraints, and output format. A well-designed system prompt is the difference between a model that follows instructions and one that improvises. Include: who the model is, what it should do, what it must never do, and the exact output format.

**Structured output** Force the model to emit valid JSON, XML, or function-call syntax. Techniques: JSON mode (grammar-constrained decoding guarantees valid syntax), function calling (model outputs `{"name": "search", "parameters": {...}}`), and constrained sampling (mask tokens that would produce invalid output).

**Token budget** Every prompt competes for the context window. Strategies: truncate oldest messages first, summarize prior conversation, use prompt compression (LLMLingua), or chunk long documents into overlapping windows. The context window is a finite resource treat it like RAM.

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

You search for "fast Python web framework" and get the Flask docs. Not because the page contains those exact words it doesn't but because an embedding model understood that "Flask" is a fast Python web framework and placed its vector near that query in semantic space.

This is the power of embeddings: they capture meaning, not just text matching. And they're the backbone of every modern search, recommendation, and RAG system.

### What Is an Embedding?

An embedding is a dense vector of floating-point numbers typically 768 to 3072 dimensions that represents a piece of text, an image, or any data in a continuous vector space. The key property: semantically similar items are close together. The distance between two embeddings encodes how related their meanings are.

Embeddings are the bridge between discrete symbols (words, tokens) and continuous mathematics (gradients, optimization). Without embeddings, neural networks would operate on integer IDs with no notion of similarity "cat" would be as different from "kitten" as from "concrete."

### How Embeddings Are Trained

Modern text embedding models use a dual-encoder architecture:

1. Two identical Transformer encoders process a pair of texts (query/document, sentence/sentence, or text/image).
2. The final hidden state is pooled (mean, CLS token, or last token) into a single embedding vector.
3. A contrastive loss function pulls similar pairs closer in vector space and pushes dissimilar pairs apart.

The training data creates the signal. For search embeddings: (query, relevant document) pairs. For sentence similarity: naturally occurring paraphrases, or synthetically generated by LLMs. For code embeddings: (docstring, function body) pairs. For multimodal embeddings (CLIP): (image, caption) pairs the model learns to map images and text into a shared embedding space. [^43]

### Popular Embedding Models

| Model | Dimensions | Max Tokens | Strengths | Weaknesses |
|-------|------------|------------|-----------|------------|
| **OpenAI text-embedding-3-small** | 512/1536 | 8191 | Cheap, easy, Matryoshka-compatible | Closed-source, tied to OpenAI API |
| **OpenAI text-embedding-3-large** | 256–3072 | 8191 | Best-in-class on MTEB, Matryoshka [^37] | Expensive (~$0.13/1M tokens) |
| **Voyage voyage-3** | 1024 | 32000 | Long context, strong retrieval | Closed-source, fewer dimensions |
| **Jina embeddings v3** | 1024 | 8192 | Task-specific LoRA adapters, multilingual [^41] | Newer, smaller community |
| **BGE-M3 (BAAI)** | 1024 | 8192 | Dense + sparse + ColBERT, multilingual, open-weight [^38][^39] | Needs careful batching for throughput |
| **Cohere Embed v3** | 1024 | 512 | Compression-aware, good for long docs | Closed-source |
| **E5-mistral-7b-instruct** | 4096 | 32768 | Synthetic data trained, open-weight [^42] | Huge embed dim → expensive vector DB |

The MTEB (Massive Text Embedding Benchmark) leaderboard tracks performance across classification, clustering, pair classification, reranking, retrieval, STS, and summarization. No single model dominates all tasks. Benchmark on your specific data and task type.

### Similarity Measures

Once you have vectors, you need a way to compare them:

| Measure | Formula | Range | When to Use | When It Fails |
|---------|---------|-------|-------------|---------------|
| **Cosine Similarity** | `A·B / (‖A‖‖B‖)` | [-1, 1] | Default for text embeddings | Magnitude matters (rare) |
| **Dot Product** | `A·B` | (-∞, ∞) | Vector DBs with normalized vectors | Unnormalized longer docs score higher |
| **Euclidean Distance** | `‖A − B‖` | [0, ∞) | Clustering, anomaly detection | Embeddings at different scales |

Most embedding models normalize output vectors to unit length, making cosine similarity and dot product equivalent. Use cosine as the default. For unnormalized embeddings (rare), prefer Euclidean distance in clustering where absolute position matters.

L²-normalize your embeddings before storing them in a vector database. It makes dot-product search equivalent to cosine similarity search, which is faster to compute without the normalization denominator.

### Dimensionality Tradeoffs

Higher-dimensional embeddings capture more nuance but cost more:

| Dimensions | Storage per 1M vectors | Approximate Recall | Use Case |
|------------|------------------------|---------------------|----------|
| 256 | ~1 GB (FP32) | 95–97% of full-dim | Budget-sensitive, high-volume |
| 768 | ~3 GB | 98–99% | Good default for most tasks |
| 1024 | ~4 GB | 98–99% | Open-weight model sweet spot |
| 1536 | ~6 GB | 99%+ | Best-in-class retrieval |
| 3072 | ~12 GB | 99%+ | Diminishing returns past 1536 for most tasks |

Storage in a vector database isn't just the raw vectors add index overhead (HNSW graphs, IVF clusters) and metadata. Budget 1.5–2× the raw vector size for the full index. For 10M vectors at 1536 dimensions: ~60 GB raw + ~30 GB index = ~90 GB total.

**Matryoshka embeddings** Train once, use at any dimension. A Matryoshka embedding model produces a single 3072-dim vector, but you can truncate it to 1536, 768, or 256 and keep strong performance. text-embedding-3 and voyage-3 use this technique. [^40] This means you can store full-dim embeddings in cold storage and truncate to 256 dims for a fast approximate index no separate model or re-embedding needed.

### Practical: Storing and Querying

Embeddings are worthless without retrieval. The vector database handles indexing and similarity search at scale (see [Specialized Databases](../database/specialized-databases.md) for pgvector/Pinecone/Milvus).

The pipeline:
1. Embed documents → store vectors + metadata in vector DB
2. Embed user query → search vector DB for nearest neighbors (k-NN or ANN)
3. Retrieve top-k results → feed into LLM context (if RAG) or return directly (if search)

**Chunking matters more than embedding model choice.** A single 10,000-token document produces one embedding that averages all its topics into a single point useless for retrieval. Split into chunks of 256–1024 tokens with 10–20% overlap. Semantic chunking (split at natural boundaries like paragraphs or sentence groups) outperforms fixed-size chunking. Bad chunking makes even text-embedding-3-large look bad.

### Code, Image, and Multimodal Embeddings

**Code embeddings** Models like Voyage-code-2 or CodeBERT embed code snippets for semantic search. "Find all functions that handle file uploads" works because the embedding captures what the code does, not what it's named. Useful for codebase-wide search and RAG over documentation.

**Image embeddings** CLIP embeds images and text into the same space. An image of a dog and the text "a photo of a dog" produce similar vectors. This enables text-to-image search, zero-shot image classification, and multimodal RAG.

**Multimodal embeddings** Jina CLIP v2 and similar models produce a single embedding from an image + its surrounding text. Store these in a vector DB and you can search a PDF with diagrams using natural language.

## Practical Deployment

VRAM is the binding constraint: a 7B FP16 model needs ~14 GB for weights alone; training adds optimizer states and gradients → ~56+ GB. For detailed guidance:
- **[Quantization](quantization.md)** — reduce precision to fit models in limited VRAM (FP16 → INT8 → 4-bit).
- **[Fine-tuning](fine-tuning.md)** — QLoRA for efficient fine-tuning on consumer GPUs.
- **Knowledge Distillation**: train a small "student" model to mimic a large "teacher" using the teacher's output distribution (soft labels). [^15]
- **Model Merging**: combine multiple fine-tuned variants without retraining using SLERP or DARE.

## Model Evaluation & Benchmarks

"Why does my model look great in the playground but fail in production?" You ran a few prompts, the outputs looked reasonable, and you shipped it. Then users started reporting nonsense answers, biased completions, and confident hallucinations.

Evaluation is the difference between "looks good to me" and knowing your model works. Without it, every change a new fine-tune, a different prompt format, a bigger model is a coin flip.

### Perplexity

Perplexity measures how "surprised" a model is by text it hasn't seen. It's the exponentiated average negative log-likelihood of each token:

```
Perplexity = exp(-1/N * Σ log P(token_i | token_1...token_{i-1}))
```

Lower perplexity = the model assigns higher probability to the correct next token = it better predicts the test data. A perplexity of 10 means the model is as uncertain as if choosing uniformly among 10 equally likely options at each step.

Perplexity is fast, automatic, and reproducible no human needed. It's the standard metric during pre-training and fine-tuning for tracking whether loss is still decreasing.

**But it's insufficient alone.** Perplexity rewards a model for being good at next-token prediction on its training distribution. It does not capture factual accuracy, reasoning ability, helpfulness, safety, or instruction following. A model can have low perplexity and still generate confident nonsense. Use perplexity to monitor training, not to evaluate quality.

### Generation Metrics

For tasks with a reference output (translation, summarization, question answering), these metrics compare generated text against a human-written reference:

| Metric | What It Measures | Good For | Blind Spots |
|--------|-----------------|----------|-------------|
| **BLEU** | n-gram overlap with reference(s) [^27] | Machine translation | Penalizes valid synonyms, ignores semantics |
| **ROUGE** | Recall of n-grams from reference [^28] | Summarization (did we cover the key points?) | Long outputs score higher regardless of quality |
| **METEOR** | Unigram precision + recall + synonym matching | Translation, better correlation with human judgment than BLEU | Slower, language-dependent synonym sets |
| **BERTScore** | Cosine similarity of BERT embeddings between generated and reference [^29] | Any generation task | Requires a strong embedding model, computationally heavier |

All n-gram metrics share a fundamental problem: they compare surface form, not meaning. "The cat sat on the mat" and "A feline rested upon the rug" share zero n-grams but are semantically identical. BERTScore partially addresses this by operating in embedding space, where synonyms are close.

### LLM-as-Judge

Instead of n-gram overlap, use a strong LLM to score outputs. The judge model rates each response on dimensions like helpfulness, accuracy, relevance, and safety.

**MT-Bench** A multi-turn benchmark where GPT-4 scores model responses on a 1–10 scale across 80 questions in 8 categories (writing, reasoning, math, coding, extraction, STEM, humanities, roleplay). GPT-4 judgments correlate well with human preference rankings. [^30]

**Chatbot Arena (LMSYS)** Users submit a prompt, two anonymous models respond, the user votes for the better response. Over 1 million human preference votes collected. Models are ranked using Elo scores the same system used in chess. [^31]

The key insight: strong LLMs are decent evaluators, but they have biases. They prefer longer responses, responses from their own model family, and responses that appear confident. Always validate judge-model evaluations against human judgments on a subset of your data.

### Elo Ratings & Leaderboards

Elo ratings convert pairwise preference data (A beats B) into a global ranking:

1. Every model starts with the same rating (e.g., 1500).
2. When model A beats model B, A gains points from B proportional to how surprising the outcome was.
3. A model expected to win (higher Elo) gains few points for winning and loses many for losing.
4. Over thousands of comparisons, scores stabilize and reflect relative strength.

Chatbot Arena maintains the most widely used LLM Elo leaderboard. It's not perfect different user populations (developer vs general public) produce different rankings but it's the closest thing to a ground-truth leaderboard we have.

### Benchmark Suite

| Benchmark | Task | Format | Metric | Why It Matters |
|-----------|------|--------|--------|----------------|
| **MMLU** | 57 subjects (law, medicine, math, history) [^32] | Multiple choice | Accuracy | Broad knowledge the SAT for LLMs |
| **HumanEval** | Python function completion from docstring [^33] | Code generation | pass@k | Measures coding ability, not recall |
| **SWE-bench** | Real GitHub issue → fix + PR [^34] | Software engineering | % resolved | Closest to real-world SWE work |
| **GSM8K** | Grade-school math word problems [^35] | Step-by-step reasoning | Final answer accuracy | Multi-step reasoning, easy to verify |
| **HellaSwag** | Pick the most plausible sentence ending | Multiple choice | Accuracy | Commonsense reasoning, hard for models |
| **MATH** | Competition-level math (AMC/AIME) | Step-by-step reasoning | Final answer accuracy | Frontier reasoning ability |
| **ARC-Challenge** | Grade-school science questions | Multiple choice | Accuracy | Tests reasoning, not retrieval |
| **TruthfulQA** | Questions designed to trigger false beliefs [^36] | Free-text generation | Truthfulness (judge-model) | Measures hallucination resistance |

Benchmarks measure specific capabilities, not overall quality. A model can ace HumanEval and still generate terrible code review feedback. Aggregate scores hide weakness in domains you care about. Pick benchmarks that match your use case don't chase leaderboard position.

### Human Evaluation

When benchmarks and judge-models aren't enough, you need humans:

**Inter-annotator agreement** If two humans disagree on whether a response is good, the evaluation rubric is underspecified. Measure agreement with Cohen's kappa or Krippendorff's alpha. Values below 0.6 mean your evaluation criteria need work, not your model.

**A/B preference** Show two responses side by side. "Which is more helpful?" The gold standard for comparing models. Cheaper and more reliable than absolute ratings because humans are better at relative judgment than absolute scoring.

**Likert scales** Rate on 1–5 scale: "How coherent is this response?" Problematic because raters cluster differently (one person's 3 is another's 4) and disagree on what "coherent" means. Prefer A/B testing over Likert when possible.

Human evaluation is expensive, slow, and noisy. It does not scale. Use it to validate automated metrics and judge-models, then let those automated systems carry the evaluation load.

### Go Deeper

| Path | Start With |
|------|-----------|
| **ML infrastructure** | [AI infra](ai-infra.md) vLLM, HuggingFace, scaling. [Use case: Gemma 4 on Modal](modal-gemma4-h200.md) GPU pricing, cold starts, storage |
| **Architectures** | [architectures.md](architectures.md) CNN, RNN, Transformer, MoE, generative models |
| **Embeddings** | [Embeddings section](#embeddings--vector-representations) in this file, plus [Specialized Databases](../database/specialized-databases.md) for vector storage |
| **Reinforcement Learning** | Sutton & Barto the canonical textbook |
| **Computer Vision** | CNNs → ResNets → ViTs |
| **NLP / LLMs** | Transformer paper → BERT → GPT → LLaMA. See [architectures.md](architectures.md) for the full architecture deep-dive. [^18] |
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
[^27]: Papineni et al., 2002 *BLEU: a Method for Automatic Evaluation of Machine Translation*
[^28]: Lin, 2004 *ROUGE: A Package for Automatic Evaluation of Summaries*
[^29]: Zhang et al., 2020 *BERTScore: Evaluating Text Generation with BERT* [arXiv](https://arxiv.org/abs/1904.09675)
[^30]: Zheng et al., 2024 *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* [arXiv](https://arxiv.org/abs/2306.05685)
[^31]: Chiang et al., 2024 *Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference* [arXiv](https://arxiv.org/abs/2403.04132)
[^32]: Hendrycks et al., 2021 *Measuring Massive Multitask Language Understanding* [arXiv](https://arxiv.org/abs/2009.03300)
[^33]: Chen et al., 2021 *Evaluating Large Language Models Trained on Code* [arXiv](https://arxiv.org/abs/2107.03374)
[^34]: Jimenez et al., 2024 *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?* [arXiv](https://arxiv.org/abs/2310.06770)
[^35]: Cobbe et al., 2021 *Training Verifiers to Solve Math Word Problems* [arXiv](https://arxiv.org/abs/2110.14168)
[^36]: Lin et al., 2021 *TruthfulQA: Measuring How Models Mimic Human Falsehoods* [arXiv](https://arxiv.org/abs/2109.07958)
[^37]: Muennighoff et al., 2023 *MTEB: Massive Text Embedding Benchmark* [arXiv](https://arxiv.org/abs/2210.07316)
[^38]: Xiao et al., 2023 *C-Pack: Packaged Resources To Advance General Chinese Embedding* [arXiv](https://arxiv.org/abs/2309.07597)
[^39]: Chen et al., 2024 *BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity* [arXiv](https://arxiv.org/abs/2402.03216)
[^40]: Kusupati et al., 2022 *Matryoshka Representation Learning* [arXiv](https://arxiv.org/abs/2205.13147)
[^41]: Günther et al., 2024 *jina-embeddings-v3* [arXiv](https://arxiv.org/abs/2409.10173)
[^42]: Wang et al., 2022 *Text Embeddings by Weakly-Supervised Contrastive Pre-training* [arXiv](https://arxiv.org/abs/2212.03533)
[^43]: Radford et al., 2021 *Learning Transferable Visual Models From Natural Language Supervision* [arXiv](https://arxiv.org/abs/2103.00020)
