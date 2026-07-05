---
title: "Neural Network"
tags: [ml, deep-learning]
audience: "Anyone learning neural networks. Knows ML fundamentals from ml.md."
style: tutorial
prerequisites:
  - ai/ml.md
difficulty: intermediate
created: "2026-07-01"
---

# Neural Network

**Prerequisites**: [Machine Learning](ml.md) — neurons, activation functions, backpropagation, and gradient descent.

Why different architectures? Because different data has different structure. A spreadsheet row, an image, and a sentence are fundamentally different shapes of information and the architecture should reflect that structure.

## Convolutional Neural Networks (CNN) For Spatial Data

Images have **local** structure. A pixel is related to its neighbors, not to pixels far across the image. CNNs exploit this with weight sharing: the same filter slides across the entire image, detecting the same pattern (edge, texture, shape) wherever it appears.

Key operations: convolution (pattern matching), pooling (downsampling, translation invariance), stride (how far the filter moves each step).

**When not to use CNNs**: Avoid CNNs when global position matters more than local structure e.g., tabular data where column order is arbitrary, or graphs where connectivity is non-Euclidean. For those cases, MLPs (tabular) or GNNs (graphs) are better suited.

## RNNs & LSTMs For Sequential Data

Text, audio, and time series have **temporal** structure. Order matters. RNNs process input one step at a time, carrying a hidden state forward. The hidden state is the network's "memory" of everything it has seen so far.

The problem: vanilla RNNs can't learn long-range dependencies. Gradients vanish across time steps. LSTMs solved this with **gating** learnable forget/input/output gates that control what information is kept, added, and emitted from the hidden state. The gates create shortcuts for gradients to flow unchanged across many time steps.

**When not to use RNNs**: Skip RNNs for sequences longer than ~512 tokens gradient issues re-emerge and sequential processing becomes a bottleneck. Transformers handle long-range dependencies and parallelize better.

## RNNs/LSTMs vs Transformers: A Comparison

The training bottleneck distinguishes them even more sharply than the algorithmic difference. RNNs must compute step t before step t+1 — no GPU parallelism across the sequence dimension. Transformers process all tokens simultaneously, parallelizing across thousands of GPU cores. This single difference explains why Transformers, not RNNs, scale to trillion-token corpora.

| Feature | RNN / LSTM | Transformer |
|---|---|---|
| Processing Style | Sequential (one token at a time) | Parallel (all tokens at once) |
| Core Algorithm | Recurrence & Gating Mechanisms | Self-Attention Matrix Calculations |
| Long-Range Memory | Weak; degrades over distance | Strong; direct connections across any distance (attenuated by positional encoding in practice) |
| Training Efficiency | Low (blocked by sequential steps) | Extremely High (ideal for massive GPU scaling) |
| Context Window Limit | Limited by memory degradation | Limited by O(N²) compute cost |

## The Transformer Revolution

The insight that changed everything: instead of processing tokens one at a time (RNN bottleneck), look at **all tokens simultaneously** via attention. [^1]

**Self-Attention** Each token computes how relevant every other token is to understanding it. "The animal didn't cross the street because it was too tired" "it" should attend strongly to "animal." This attention score is a learned weighted sum of all tokens.

**Multi-Head Attention** Run multiple attention operations in parallel. One head might track subject-verb agreement, another tracks pronoun references, another tracks sentiment. Each head captures a different relationship.

**Cross-Attention** One sequence attends to another. In translation: the decoder (generating French) attends to the encoder's representation of the English source. The decoder queries, the encoder provides keys and values.

**Encoder-Decoder Architecture** The encoder processes the input into a dense latent representation. The decoder generates the output from that representation. Backbone of T5, the original Transformer, and most seq2seq tasks. For GPT-style models, the decoder-only variant dominates.

| Mechanism | Purpose |
|-----------|---------|
| Self-Attention | Each token attends to every other token in the same sequence |
| Multi-Head Attention | Multiple parallel attention views, each capturing different relationships |
| Cross-Attention | Decoder attends to encoder's output — query from decoder, keys/values from encoder |
| Encoder-Decoder | Bidirectional encoding → autoregressive decoding |

See [Attention Is All You Need, Figure 2](https://arxiv.org/abs/1706.03762) for the original multi-head attention diagram the parallel structure is much clearer visually than prose can convey. [^1]

**When not to use Transformers**: Not ideal for small datasets (<10K examples) where simpler models (e.g., CNNs, MLPs) generalize better with less compute. Also avoid when latency is critical on low-end hardware the quadratic attention cost over sequence length adds up quickly.

## Generative Models

Three families, three approaches to creating new data:

**GANs** Adversarial game. Generator creates fakes, discriminator tries to spot them. Both improve through competition. Produces sharp images but training is unstable (mode collapse: generator only produces one type of output).

**VAEs** Learn a compressed latent space, then sample from it. More stable than GANs but outputs tend to be blurrier the model averages over possibilities rather than picking one sharp output.

**Diffusion Models** Learn to denoise. Forward: gradually add noise to an image until it's pure noise. Reverse: learn to remove noise step by step. State-of-the-art for image/video generation (Stable Diffusion, DALL-E, Sora). [^2]

## Mixture of Experts (MoE)

Data passes through Feed-Forward Networks (FFNs) in every layer to "think." In dense models, every single token passes through every parameter in the FFN — incredibly expensive. MoE is the "split brain" upgrade.

Instead of one massive FFN, a layer contains multiple smaller "expert" FFNs (e.g., 8 experts). A tiny **Router** (gating algorithm) sits in front and decides which experts handle each token:

- When the token "the" comes through, the router says "This is grammar, go to Expert 1 and 2."
- When the token `return x` comes through, the router says "This is Python code, go to Expert 7 and 8."

Each token activates only ~2 of 8 experts. Result: a model can have 1 trillion total parameters, but for any single token it only activates ~100 billion. This makes massive models drastically cheaper and faster to run. Used in Mixtral, reportedly GPT-4 (unofficially rumored), DeepSeek-V3. [^3][^4]

**How routing works** For each token, the router computes a softmax over all experts and selects the top-k (typically k=2). The token is then processed only by the selected experts. This keeps FLOPs per token roughly constant while scaling total parameters.

**Load balancing** Naive top-k routing causes expert collapse: the router learns to send most tokens to 1–2 experts, starving the rest. The fix: an auxiliary loss that penalizes imbalanced expert usage. [^5] Without this, MoE training fails: experts that never receive tokens stop receiving gradients and die permanently.

**Tradeoffs vs dense models:**

| Dimension | Dense (e.g., LLaMA 3 70B) | MoE (e.g., Mixtral 8×7B) |
|-----------|---------------------------|---------------------------|
| Total params | 70B | ~46B (but 8×7B experts) |
| Active params per token | 70B | ~12B (2 of 8 experts) |
| VRAM (inference) | ~140 GB (FP16) | ~93 GB (FP16, all experts loaded) |
| Training stability | Stable | Requires auxiliary loss, expert balancing |
| Throughput | Slower per token | Faster per token (fewer active params) |
| Memory bandwidth | Bottlenecked by loading all weights | Same bottleneck all experts must be in VRAM |

Despite lower active params per token, MoE inference VRAM is still high because all experts must reside in memory. The win is compute speed, not memory savings. DeepSeek-V3 pushes this to extreme: 671B total params, 37B active per token the largest open-weight MoE to date. [^6]

## Self-Supervised Learning

The data provide their own labels. No human annotation needed:

- **Autoregressive (AR)**: predict the next token. Given "The cat sat on the", predict "mat." GPT-style.
- **Masked Language Modeling (MLM)**: hide random words, predict them. "The [MASK] sat on the mat" → "cat." BERT-style.
- **Contrastive Learning**: pull similar examples together in embedding space, push dissimilar apart. CLIP (images + captions).

## References

[^1]: Vaswani et al., 2017 *Attention Is All You Need* [arXiv](https://arxiv.org/abs/1706.03762)
[^2]: Ho et al., 2020 *Denoising Diffusion Probabilistic Models* [arXiv](https://arxiv.org/abs/2006.11239)
[^3]: Jiang et al., 2024 *Mixtral of Experts* [arXiv](https://arxiv.org/abs/2401.04088)
[^4]: Lepikhin et al., 2020 *GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding* [arXiv](https://arxiv.org/abs/2006.16668)
[^5]: Fedus et al., 2022 *Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity* [arXiv](https://arxiv.org/abs/2101.03961)
[^6]: DeepSeek-AI, 2024 *DeepSeek-V3 Technical Report* [arXiv](https://arxiv.org/abs/2412.19437)
