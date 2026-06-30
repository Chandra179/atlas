---
title: "DeepSeek Flash V4 Architecture"
aliases: []
tags: [ml, ai, deepseek]
created: "2026-06-30"
updated: "2026-06-30"
audience: Engineers who want to understand DeepSeek V4-Flash from the ground up. No prior Transformer knowledge assumed.
prerequisites:
  - ai/ml.md
---

# DeepSeek Flash V4 Architecture

## 0. Before the Transformer (Brief History)

You don't need to know pre-Transformer history to understand V4-Flash, but it helps to know *why* Transformers exist — the problems they solved that nothing before could.

### 0.1 The Pre-Transformer Era

Before 2017, sequence models were **RNNs (Recurrent Neural Networks)** and **LSTMs**. They processed text one word at a time, left to right, updating a "hidden state" as they went:

```
Input:  "The" → "cat" → "sat" → "on" → "the" → "mat"
State:  [s0] → [s1] → [s2] → [s3] → [s4] → [s5] → final state
```

**The fatal flaw:** To understand word #5 ("mat"), the model had to carry information all the way from word #1 ("The") through 4 sequential steps. Information faded with distance. Remembering something from 50 words back was nearly impossible. This is called the **long-range dependency problem**.

RNNs also could not parallelize — you had to finish word 1 before starting word 2. Training was slow.

### 0.2 What the Transformer Changed

The Transformer (2017) replaced sequential processing with **parallel attention**:

- **RNN:** "cat" → wait for "The" → update state → pass to "sat" → update state → ... (serial, O(N))
- **Transformer:** "cat" looks directly at "The" in one step, regardless of distance (parallel, O(1) per pair, O(N²) total)

This was revolutionary because:
1. **Long-range dependencies became trivial** — word 1 and word 1000 connected equally easily.
2. **Training became parallelizable** — all tokens processed simultaneously.
3. **Scale became possible** — bigger models, more data, faster training.

### 0.3 Is It Enough to Know Only the Transformer?

**Yes.** For understanding V4-Flash (and any modern LLM), the Transformer is the only foundation you need. Everything before it (RNNs, LSTMs, GRUs, seq2seq with attention) is historical context — interesting for depth, unnecessary for understanding how or why V4-Flash works.

The V4-Flash architecture doc assumes you understand the Transformer (Section 0.4-0.10 below). If you do, you have everything you need.

---

## 0.4 Transformer Foundations

Before we can understand what DeepSeek V4-Flash improves, we need to understand what a Transformer is, what it's trying to do, and why it has problems that need solving. This section teaches you the entire Transformer from scratch — no prior knowledge needed.

### 0.4 What Is a Transformer?

A **Transformer** is a type of neural network designed to process sequences of things — words in a sentence, pixels in an image, notes in a melody. It was invented in 2017 (Google, "Attention Is All You Need") and is the basis for every modern large language model (GPT, Claude, Llama, Gemini, DeepSeek).

**What does it do?** Given a sequence of input tokens (words or sub-words), it predicts what comes next. That's it. All the "intelligence" emerges from doing this simple task at enormous scale.

**Concrete example:**

```
Input:  "The capital of France is"
Output: "Paris"
```

The model read "The capital of France is" and predicted "Paris" because it learned, from training on billions of sentences, that Paris is the answer.

### 0.5 The High-Level Flow

Here is what happens inside a Transformer when you give it a sentence:

```
Input text:  "The cat sat"
     ↓
[1] Tokenizer ──→ splits text into tokens: ["The", " cat", " sat"]
     ↓
[2] Embedding ──→ converts each token into a list of numbers (a "vector")
     ↓
[3] Transformer Layers (x67 for V4-Flash)
     ├── Attention: each token looks at every other token to understand context
     └── FFN: each token "thinks" about what it just learned
     ↓ (repeat 67 times)
[4] Output head ──→ converts the final vector into probabilities for each word
     ↓
Predicted next token: " on"
```

Each step is explained below.

### 0.6 Step 1: Tokenizer — Turning Text into Numbers

A Transformer cannot read letters. It needs numbers. The **tokenizer** splits text into small chunks (tokens) and assigns each an ID number.

```
"The cat sat on the mat"
  → ["The", " cat", " sat", " on", " the", " mat"]
  → token IDs:  [791,  4762,  8334,  329,  791,  9573]
```

Vocabulary size = how many unique tokens the model knows. V4-Flash knows **129,280** different tokens (enough for English, Chinese, code, math symbols, etc.).

### 0.7 Step 2: Embedding — Giving Meaning to Numbers

A token ID (e.g., 4762 for "cat") is just an index — it carries no meaning. The **embedding layer** converts each ID into a **vector** — a list of ~7000 numbers (for V4-Flash, 7168 numbers). These numbers are learned during training so that similar words end up with similar vectors.

```
token ID 4762 ("cat")  ──→  [0.12, -0.45, 0.78, ..., 0.03]  (7168 numbers)
token ID 9573 ("mat")  ──→  [0.09, -0.40, 0.81, ..., 0.05]  (similar numbers — similar contexts)
token ID 1291 ("quantum") ──→ [-0.87, 0.23, -0.04, ..., 0.91] (different numbers — different contexts)
```

After embedding, the sentence "The cat sat" becomes a **matrix** of shape [3 tokens × 7168 dimensions]. Every subsequent layer processes this matrix.

### 0.8 Step 3: Attention — The Heart of the Transformer

Attention is the core innovation of the Transformer. It lets each token **look at every other token** and decide how much to listen to each one.

**0.8.1 Intuition with an example:**

Consider the sentence: "The cat sat on the mat because **it** was comfortable."

What does "it" refer to? The cat or the mat? A human knows it's the mat (mats are comfortable, cats are comfortable too, but the word "comfortable" modifies the mat more naturally). Attention lets the model decide this by computing a score between "it" and every other word.

**How attention works mathematically (simplified):**

For each token, the model computes three vectors:

```
For word "cat":
  Query  (Q) = "what am I looking for?"
  Key    (K) = "what information do I have?"
  Value  (V) = "if you find me relevant, here is my content"
```

Then it compares every Query with every Key to get a score:

```
score("cat", "sat")   = Q("cat") · K("sat")   = 0.8  (high — closely related)
score("cat", "the")   = Q("cat") · K("the")   = 0.1  (low — unrelated)
score("cat", "mat")   = Q("cat") · K("mat")   = 0.3  (medium)
```

These scores determine how much each token's value (V) contributes to the output. This weighted sum is the attention output.

**Crucially:** every token attends to **every** token. For N tokens, that's N² comparisons. This is where the O(N²) cost comes from — the central problem DeepSeek V4-Flash is designed to fix.

### 0.9 Step 4: Feed-Forward Network (FFN) — Processing What Attention Found

After attention, each token has a new vector that carries context from every other token. The FFN is a simple neural network (two matrix multiplications with a nonlinearity) that processes this vector **independently for each token**.

```
FFN(vector) = W_out · ReLU(W_in · vector)

The FFN does NOT look at other tokens — it only processes the current
token's enriched representation. This is why it's called "feed-forward."
```

Think of the FFN as the "thinking" step — attention gathered information, and the FFN decides what to do with it.

### 0.10 Stacking Layers: Why 67?

A single attention + FFN pair is one **layer**. Transformers stack many layers so that each layer can build on the previous one's output.

```
Layer 1: "cat" looks at "sat", "the", "mat" → understands local grammar
Layer 2: "cat" now has broader context → understands sentence subject
...
Layer 67: "cat" has full-document understanding → predicts next word accurately
```

Each layer can attend to ALL tokens (using the previous layer's representations). After 67 layers, the representation of the last token contains information about the entire sequence.

### 0.11 Step 5: Output Head — Predicting the Next Token

After all 67 layers, the model has a final vector for each position. For the **last position**, it runs this through a large classifier (vocabulary × hidden_dim = 129,280 × 7168) to produce a probability for every token in the vocabulary.

```
Final vector → [0.001, 0.0001, 0.8, 0.02, ..., 0.00001]
                (probability distribution over 129,280 tokens)
                  ↑
            "Paris" has 80% probability → model predicts "Paris"
```

### 0.12 What Is the Model Actually Learning During Training?

During training, the model sees billions of text examples. For each example, it:

1. Reads tokens 1 through N-1.
2. Predicts token N.
3. Compares its prediction to the actual token N.
4. Adjusts all its internal numbers (parameters) to make the prediction slightly better next time.

After seeing 14.8 **trillion** tokens, the model's 284 billion parameters encode patterns about:
- Grammar and syntax (how words combine)
- Facts and knowledge (Paris is the capital of France)
- Reasoning (if A > B and B > C, then A > C)
- Code syntax (for loops, function definitions)
- Conversation style (how to answer helpfully)

### 0.13 The Big Problems with Vanilla Transformers

Now we understand the pain points that DeepSeek V4-Flash is designed to solve:

| Problem | Why It Matters | How V4-Flash Fixes It |
|---|---|---|
| **Attention is O(N²)** | At 128K tokens, each layer does 16B comparisons. 67 layers = 1 trillion operations. | Sliding window + sparse attention + compressed attention (Section 4) |
| **KV cache is enormous** | For every token generated, the model must remember all previous K and V vectors. For MHA: ~4 MB per token → ~1 TB at 256K context. | MLA compresses KV cache 16× (Section 3) |
| **Every token activates every parameter** | A dense 284B model would cost 284B operations per token. | MoE activates only ~30B params per token (Section 5) |
| **Training takes forever** | Standard training requires expensive precision and has pipeline bubbles. | FP8 training + DualPipe (Sections 9, 11) |

The rest of this document explains each fix in detail.

---

## 1. Introduction & Context

### 1.1 The Transformer Bottleneck (Advanced)

A vanilla Transformer costs O(N²) per layer — every token attends to every other token. At 128K context, that's 16 billion attention computations per layer. For a 284-billion-parameter model, the naive approach is not merely expensive; it is infeasible. The KV cache alone would demand terabytes of high-bandwidth memory per request.

DeepSeek V4-Flash solves this through a three-part strategy:

1. **Compress** — reduce what you store (MLA compresses KV cache 10-20x)
2. **Route** — activate only what you need (MoE keeps 10-20% of params active per token)
3. **Prune** — skip irrelevant computation (sparse attention, auxiliary-loss-free load balancing)

The result: a 284B-parameter model with per-token cost closer to a 30B dense model. This doc deconstructs every component from first principles.

### 1.2 DeepSeek Lineage

DeepSeek has iterated through four major architectures. Each generation introduced specific innovations that V4-Flash inherits and refines:

| Generation | Total Params | Active Params | Key Innovations | Training Tokens |
|---|---|---|---|---|
| DeepSeek 67B (V1) | 67B | 67B (dense) | Baseline dense model | — |
| DeepSeek-V2 (May 2024) | 236B | 21B | MLA, DeepSeekMoE, GRPO | 8.1T |
| DeepSeek-V3 (Dec 2024) | 671B | 37B | Aux-loss-free load balancing, MTP, FP8 training, DualPipe | 14.8T |
| DeepSeek-R1 (Jan 2025) | 671B | 37B | Long CoT reasoning, reinforcement learning from reasoning traces | — |
| **DeepSeek V4-Flash** | **284B** | **~30B** | Hybrid attention (SWA+CSA+HCA), Lightning Indexer, Attention Sinks | — |

Sources: [DeepSeek-V2, arXiv:2405.04434], [DeepSeek-V3, arXiv:2412.19437], [DeepSeek-R1, arXiv:2501.12948]

V4-Flash is not strictly a larger model than V3. The "Flash" designation signals a shift in design philosophy: **smarter allocation of compute per token rather than more parameters**. Where V3 maximized total capacity (671B params), V4-Flash optimizes for inference efficiency — fewer total parameters (284B) but more aggressive attention sparsity and better hardware utilization.

### 1.3 Design Philosophy

V4-Flash's architecture rests on four axioms:

1. **Attention must be sub-quadratic.** Not merely optimized, but structurally incapable of O(N²) cost.
2. **Most parameters should stay silent.** Each token needs specialists, not generalists. MoE is not optional.
3. **Computation and communication must overlap.** The GPU should never wait for data.
4. **Precision is a lever, not a ceiling.** FP8 during training, FP8 during inference — bit-width is a resource to allocate, not a constraint to accept.

### 1.4 Document Structure

This doc is organized by increasing abstraction — from concrete specification up through system-level design:

- **Section 2** — Model specification (the numbers)
- **Sections 3-5** — Architectural deep dives (attention, MoE, training objectives)
- **Sections 6-10** — Implementation details (precision, infrastructure, serving)
- **Section 11** — Benchmarks and evaluation
- **Section 12** — References

---

## 2. Model Specification

### 2.1 Architecture Parameters

| Parameter | Value | Notes |
|---|---|---|
| Total parameters | 284B | Down from V3's 671B — fewer params, smarter routing |
| Active parameters per token | ~30B | ~10.6% of total |
| Transformer layers | 67 | |
| Hidden dimension (d_model) | 7168 | |
| Attention heads (n_heads) | 64 | |
| KV compression dimension (d_c) | 512 | MLA latent dimension for KV joint compression |
| Query compression dimension (d_c') | 1536 | |
| Head dimension (d_head) | 128 | |
| RoPE head dimension (d_h^R) | 64 | Decoupled RoPE per head |
| Feed-forward hidden dimension | 20480 | SwiGLU activation |
| Vocabulary size | 129280 | BPE tokenizer |
| Max context length | 1M tokens (training), 256K (guaranteed) | Extended via YA RN |
| Training tokens | 14.8T | Same data budget as V3 |
| Pre-training compute | ~2.8M H800 GPU hours | |

### 2.2 MoE Configuration

| Parameter | Value |
|---|---|
| Number of experts | 256 |
| Shared experts | 2 |
| Active routed experts per token (Top-K) | 8 |
| Expert hidden dimension | 2048 |
| Expert parallelism | 64 nodes × 8 GPUs |

### 2.3 Attention Allocation

V4-Flash introduces a **hybrid attention strategy** across layers. Not all layers use the same attention mechanism:

| Attention Type | Layers | Window/Compression | Tokens Attended |
|---|---|---|---|
| Sliding Window Attention (SWA) | 1-24 | W=128 | 128 nearest neighbors |
| Compressed Sparse Attention (CSA) | 25-52 | 4:1 compression, Top-K=512 | ~2048 blocks → 512 selected |
| Heavily Compressed Attention (HCA) | 53-60 | 128:1 compression, dense | ~8192 super-blocks |
| Full MLA (no sparsity) | 61-67 | None | All tokens (short context) |

This hybrid allocation reflects a **locality-to-globality** design: early layers handle local syntax and grammar (cheap SWA), middle layers build contextual understanding (sparse CSA), late layers maintain global coherence (compressed HCA), and the final layers provide full attention when context is short enough.

### 2.4 Training Hyperparameters

| Parameter | Value |
|---|---|
| Optimizer | AdamW |
| Learning rate | 2.0e-4 (cosine decay to 2.0e-5) |
| Warmup steps | 2000 |
| Batch size | 4M tokens |
| Weight decay | 0.1 |
| Adam β₁, β₂ | 0.9, 0.95 |
| Gradient clipping | 1.0 |
| FP8 scaling factor blocks | 128 elements |
| Activation checkpointing | Selective (RMSNorm, MLA up-projection recomputed) |
| Pipeline parallelism | DualPipe (16 micro-batches, 4 pipeline stages per node) |
| Training hardware | 2048 × H800 (80GB SXM5) |
| Interconnect | NVLink (intra-node) + InfiniBand NDR400 (inter-node) |

### 2.5 Post-Training Configuration

| Stage | Data | Method |
|---|---|---|
| Supervised Fine-Tuning | 1.5M conversational sessions (math, code, writing, reasoning, safety) | Standard cross-entropy |
| Reasoning distillation | DeepSeek-R1 long-CoT traces | SFT on reasoning traces with reflection patterns |
| Reinforcement Learning | Rule-based + model-based rewards | GRPO (G=8 groups per prompt) |

---

## 3. Multi-Head Latent Attention (MLA)

MLA is the single most important architectural innovation in the DeepSeek family. It achieves **better-than-MHA quality with a fraction of the KV cache**. This section derives it from first principles.

### 3.1 Refresher: Standard Multi-Head Attention (MHA)

Given input hidden state **h**ₜ ∈ ℝ^d for token t:

```
q_t = W_Q · h_t           ∈ ℝ^{d_h · n_h}
k_t = W_K · h_t           ∈ ℝ^{d_h · n_h}
v_t = W_V · h_t           ∈ ℝ^{d_h · n_h}
```

These are split into n_h heads of dimension d_h:

```
[q_{t,1}, q_{t,2}, ..., q_{t,n_h}] = reshape(q_t)
[k_{t,1}, k_{t,2}, ..., k_{t,n_h}] = reshape(k_t)
[v_{t,1}, v_{t,2}, ..., v_{t,n_h}] = reshape(v_t)
```

Attention per head:

```
o_{t,i} = Σ_{j=1}^{t} softmax_j( (q_{t,i}^T · k_{j,i}) / √d_h ) · v_{j,i}
```

Output projection:

```
u_t = W_O · [o_{t,1}; o_{t,2}; ...; o_{t,n_h}]
```

**During inference**, every (k_{j,i}, v_{j,i}) for all past tokens must be cached — that's **2 · n_h · d_h** elements per token per layer. For V4-Flash with n_h=64, d_h=128, and 67 layers: 2 × 64 × 128 × 67 = **1,097,728 elements per token** (~4.2 MB at FP16). At 256K context: **~1 TB of KV cache**.

### 3.2 Low-Rank KV Joint Compression

MLA's core insight: the keys and values live in a high-dimensional space (d_h·n_h = 8192) but their *intrinsic dimensionality* is much lower. Instead of storing full K and V, MLA projects them into a shared latent space and reconstructs on the fly.

**Step 1: Down-project to latent.**

```
c_t^{KV} = W_{DKV} · h_t    where c_t^{KV} ∈ ℝ^{d_c}, d_c << d_h·n_h
```

For V4-Flash: d_c = 512. The input dimension d = 7168 is compressed to 512 — a 14:1 reduction.

**Step 2: Up-project keys and values from the same latent.**

```
k_t^C = W_{UK} · c_t^{KV}    ∈ ℝ^{d_h·n_h}
v_t^C = W_{UV} · c_t^{KV}    ∈ ℝ^{d_h·n_h}
```

Both K and V are reconstructed from the *same* compressed vector c_t^{KV}. The KV cache is therefore just **d_c** elements per token per layer — **not** 2·d_h·n_h.

**KV cache comparison:**

| Mechanism | Cache per token per layer | At 256K context, 67 layers |
|---|---|---|
| Full MHA | 2 · d_h · n_h | ~1 TB |
| GQA (8 groups) | 2 · d_h · 8 | ~134 GB |
| MQA (1 group) | 2 · d_h · 1 | ~17 GB |
| **MLA** | **d_c = 512** | **~66 GB** |

MLA caches 512 elements vs MHA's 8192 — a **16× reduction**. And empirically, MLA matches or exceeds MHA quality (unlike GQA/MQA which degrade).

### 3.3 Weight Absorption During Inference

A key engineering trick: during inference, the up-projection matrices W_{UK} and W_{UV} can be **absorbed** into earlier matrices. This means we never materialize the full K and V during generation.

**Key absorption into query:** The attention score for head i is:

```
score_i = q_{t,i}^T · k_{j,i}
        = (W_{UQ,i} · W_{DQ} · h_t)^T · (W_{UK,i} · c_j^{KV})
        = h_t^T · (W_{DQ}^T · W_{UQ,i}^T · W_{UK,i}) · c_j^{KV}
```

The product (W_{UQ,i}^T · W_{UK,i}) can be **pre-computed** into a single matrix — we never compute k_j explicitly.

**Value absorption into output:** Similarly:

```
u_t = W_O · [v_{t,1}^C; ...; v_{t,n_h}^C]
    = W_O · W_{UV} · c_t^{KV}    (per head, then concatenated)
    = (W_O · W_{UV}) · c_t^{KV}
```

W_{UV} absorbs into W_O. During inference, the attention output is computed directly from the latent c_t^{KV} without ever expanding to full K/V dimensions.

This means the **only** per-token storage needed during decoding is c_t^{KV} (512 floats) and a small decoupled RoPE key (see below).

### 3.4 Decoupled RoPE

Rotary Position Embedding (RoPE) is essential for length generalization, but it is **incompatible with low-rank KV compression**. RoPE applies a rotation matrix that depends on the token's absolute position. If we compress K first and then apply RoPE, the rotation mixes dimensions in the compressed space and the low-rank structure breaks. If we apply RoPE before compression, we lose the ability to absorb W_{UK} into W_Q.

MLA's solution: **decouple the RoPE-carrying dimensions** from the compressed path.

The model learns a separate projection for a small "RoPE key":

```
k_t^R = RoPE( W_{KR} · h_t )    ∈ ℝ^{d_h^R}
```

where d_h^R = 64 (half of d_h = 128). The full key becomes a concatenation:

```
k_{t,i} = [k_{t,i}^C ; k_t^R]
```

The query side mirrors this:

```
q_t^R = RoPE( W_{QR} · c_t^Q )  ∈ ℝ^{n_h · d_h^R}
q_{t,i} = [q_{t,i}^C ; q_{t,i}^R]
```

**What gets cached (inference):**

- c_t^{KV} ∈ ℝ^{512} — the compressed KV latent
- k_t^R ∈ ℝ^{64} — the decoupled RoPE key (one per layer, not per head)

Total: 576 elements per token per layer. Without decoupled RoPE, we'd need to cache the full K and V or lose position information.

### 3.5 Query-Side Compression

During training, we also compress the query to reduce activation memory (not KV cache, since queries are not cached):

```
c_t^Q = W_{DQ} · h_t          ∈ ℝ^{d_c'}
q_t^C = W_{UQ} · c_t^Q        ∈ ℝ^{d_h·n_h}
```

d_c' = 1536 for V4-Flash — a 4.7:1 compression ratio. This saves activation memory during the backward pass.

### 3.6 MLA vs Alternatives

| Property | MHA | GQA (8 groups) | MQA | **MLA** |
|---|---|---|---|---|
| KV cache per layer | 2·n_h·d_h | 2·8·d_h | 2·1·d_h | d_c (512) |
| Cache at 256K (67 layers) | ~1 TB | ~134 GB | ~17 GB | **~66 GB** |
| Quality vs MHA | baseline | slight degradation | significant degradation | **matches or exceeds** |
| RoPE compatible | yes (per head) | yes (per head) | yes (per head) | **requires decoupled** |
| Weight absorption | N/A | N/A | N/A | yes (K→Q, V→O) |

Source: DeepSeek-V2 Appendix D.2, "Comparison Between MLA and MHA". On the MMLU benchmark, MLA (with KV compression dimension 512) achieves 79.1% vs MHA's 79.0% — statistically identical — while reducing KV cache by 93.3%.

### 3.7 MLA Forward Pass (Inference, Autoregressive Decoding)

```
Given: h_t ∈ ℝ^{7168}  (current token hidden state)

1. Compress KV:   c_t^{KV} = W_{DKV} · h_t              (7168 → 512)
2. Compress Q:    c_t^Q    = W_{DQ} · h_t                (7168 → 1536)
3. Decoupled K:   k_t^R    = RoPE(W_{KR} · h_t)          (7168 → 64)
4. Decoupled Q:   q_t^R    = RoPE(W_{QR} · c_t^Q)        (1536 → 64·64)

5. Cache:  append (c_t^{KV}, k_t^R) to running KV cache
   (all previous: {c_1^{KV}...c_t^{KV}}, {k_1^R...k_t^R})

6. Compute attention scores (absorbed):
   For each head i:
     score_{t,i} = (q_{t,i}^C)^T · [K_cache_i^C ; K_cache_R]
   where K_cache_i^C = W_{UK,i} · all previous c_j^{KV}
         K_cache_R   = all previous k_j^R

7. Output (absorbed): u_t = W_O · W_{UV} · c_t^{KV}
```

The key insight: steps 1-4 are a **dense feed-forward** (small matrices), step 5 is trivial, and step 6 is the only O(N) operation. The expensive K and V projections never happen during inference.

---

*Next: Section 4 — Attention Composition Across Layers.*

---

## 4. Attention Composition Across Layers

V4-Flash does not apply the same attention mechanism in every layer. It assigns each layer a specific role based on its depth in the stack, mixing three attention variants: Sliding Window Attention (SWA), Compressed Sparse Attention (CSA), and Heavily Compressed Attention (HCA). All three sit on top of the MLA foundation described in Section 3.

### 4.1 The Locality-to-Globality Principle

Attention needs change with depth:

- **Early layers** (near the input): tokens need to resolve local syntax, agreement, and phrase boundaries. A narrow window suffices.
- **Middle layers**: tokens need to build contextual understanding across sentences and paragraphs. Sparse access to relevant blocks is enough.
- **Late layers**: tokens need global coherence — the overarching topic, the argument's structure, the narrative arc. A compressed overview works.
- **Final layers**: tokens need precise attention for the final representation. Full MLA when context is short; compressed when long.

V4-Flash encodes this as a **layer allocation table** (from Section 2):

| Layer Range | Attention Type | Effective Window | Cost per Token |
|---|---|---|---|
| 1-24 | SWA (Sliding Window) | 128 tokens | O(W) = O(128) |
| 25-52 | CSA (Compressed Sparse) | 4:1 compression, Top-K=512 | O(C·K) = O(2048) |
| 53-60 | HCA (Heavily Compressed) | 128:1 compression, dense | O(N/128) |
| 61-67 | Full MLA | All tokens (short ctx) | O(N) |

Total asymptotic cost per layer: O(N) for full MLA, but the constant factors differ by orders of magnitude.

### 4.2 Sliding Window Attention (SWA) — Layers 1-24

SWA restricts each token to attend to at most W=128 neighboring tokens — 64 to the left, 64 to the right (in bidirectional setting, or 128 to the left in causal setting).

**Why 128?** Linguistic analysis shows that nearly all syntactic dependencies fall within a 50-token window. Agreement, subcategorization, and reflexive binding are almost exclusively local. A 128-token window captures >99% of syntax without waste.

**Implementation:** The attention mask is a simple banded matrix — for each query position t, only keys in positions [t-W, t-1] are unmasked. The MLA key-value cache only needs to keep the most recent W tokens' c^{KV} and k^R vectors. Older entries can be discarded (or moved to the attention sink, Section 4.5).

**Cost:** For layers 1-24, attention is O(N·W) = O(128N), not O(N²). At 256K context, that's ~33M operations per layer vs ~66B for full attention.

### 4.3 Compressed Sparse Attention (CSA) — Layers 25-52

CSA is the most sophisticated attention mechanism in V4-Flash. It combines compression (reduce sequence length) with sparse selection (pick the right blocks).

**Step 1: Sequence compression (4:1).**
The input sequence (length N) is divided into blocks of 4 consecutive tokens. Each block is averaged (or processed via a small MLP) to produce a single "block representation". This reduces the sequence from N to N/4 tokens.

**Step 2: Lightning Indexer — Top-K block selection.**
The Lightning Indexer is a lightweight scoring network that evaluates each compressed block and assigns a relevance score for the current query token. It selects the Top-K most relevant blocks (K=512 by default).

**Step 3: Attend to selected blocks.**
Within each selected block, the model attends to all 4 original tokens. Total tokens attended: K × 4 = 2048.

**Design rationale for the Lightning Indexer:**
- It must be **fast** — cheaper than the attention it replaces. Practically, it's 2-3 linear layers with a small hidden dimension.
- It must be **trained end-to-end** — the indexer learns to identify useful blocks via the attention gradient flowing through selected blocks.
- It is **query-dependent** — different queries select different blocks. A question about "the capital of France" selects blocks mentioning Paris, not blocks about the French Revolution.

**Cost:** CSA is O(C·K) where C=4 (block size) and K=512 (selected blocks). At 256K context: N/4 = 64K compressed blocks; selecting 512 of those costs ~7M operations; attending to 2048 tokens costs another ~2M operations. Total: ~9M vs 66B for full attention.

### 4.4 Heavily Compressed Attention (HCA) — Layers 53-60

HCA pushes compression to its extreme: 128:1. The sequence is divided into super-blocks of 128 tokens each. Each super-block is compressed into a single representation.

**Why 128:1?** These layers only need a "rough map" of the document — a sense of what broad topic each section covers. The compressed representation carries topic-level information (e.g., "this 128-token block is about hyperparameter tuning"), not token-level detail.

**Dense over compressed:** Unlike CSA which selects Top-K blocks, HCA attends to **all** compressed blocks densely. Because there are only N/128 blocks, this remains cheap. At 256K context: N/128 = 2048 super-blocks. Attending to all 2048 costs ~2M operations.

**Cost:** HCA is O(N/128) per layer. Cross-entirely sub-quadratic.

### 4.5 Attention Sinks

Even with all the compression above, the KV cache grows with sequence length. Attention sinks provide a mechanism for **safe cache eviction**.

**The observation:** In trained transformers, certain tokens (especially initial tokens and separator tokens) receive disproportionate attention weight — they act as "sinks" that absorb irrelevant information. When the model attends to a sink, it effectively ignores the content.

**In V4-Flash:** Specialized [SINK] tokens are inserted at regular intervals (every 1024 tokens) during training. The model learns to dump information about stale context into these sinks. During inference, when the KV cache exceeds a threshold, the oldest non-sink entries are evicted. The sinks remain, preserving the rough state of the discarded context.

**Effect:** V4-Flash can maintain coherent generation beyond its 256K guaranteed context by discarding old context in 1024-token chunks. The sinks provide enough residual information to prevent topic drift.

### 4.6 Forward Pass Through the Attention Stack

```
Input: x ∈ ℝ^{N × 7168}

Layer 1-24 (SWA+MLA):
  for each position t:
    c^{KV}_t = W_{DKV} · x_t                     (MLA compress)
    attend to [t-128, t-1] only                  (sliding window)
    if t > 128: cache old c^{KV} → attention sink

Layer 25-52 (CSA+MLA):
  for each position t:
    c^{KV}_t = W_{DKV} · x_t
    blocks = compress sequence 4:1               (N → N/4 blocks)
    scores = LightningIndexer(blocks, query_t)   (score each block)
    selected = top_k(scores, K=512)              (pick K blocks)
    attend to tokens in selected blocks only

Layer 53-60 (HCA+MLA):
  for each position t:
    c^{KV}_t = W_{DKV} · x_t
    super_blocks = compress sequence 128:1        (N → N/128)
    attend to all super_blocks                    (dense over compressed)

Layer 61-67 (Full MLA):
  if N < 8192: full self-attention
  else: fall back to HCA

Output: y ∈ ℝ^{N × 7168}
```

This hybrid design ensures that the total attention cost per forward pass is **O(N · (W + C·K + N/128 + N))** but the dominant terms (full attention) only activate in the final 7 layers and only when context is short.

---

*Next: Section 5 — DeepSeekMoE.*

---

## 5. DeepSeekMoE

While MLA makes attention efficient, DeepSeekMoE makes the feed-forward network (FFN) efficient. Instead of a single dense FFN that processes every token through all parameters, MoE splits the FFN into many "experts" and activates only a subset per token.

### 5.1 The Problem with Dense FFNs

In a standard Transformer, each layer has a dense FFN:

```
FFN(x) = W_out · σ(W_in · x)    typically 4× wider than d_model
```

For V4-Flash with d_model=7168, a single FFN layer has ~4·7168² ≈ 205M parameters. With 67 layers: ~13.7B parameters just in the FFNs — and that's before attention, embeddings, etc. Every token activates all 205M parameters per layer.

MoE replaces each dense FFN with a set of smaller FFNs (experts) and a router that selects which experts to use per token.

### 5.2 Architecture

V4-Flash uses **DeepSeekMoE** with two categories of experts:

```
DeepSeekMoE(x) = Σ_{i∈Shared} FFN_i(x) + Σ_{j∈Routed} g_j · FFN_j(x)
```

Where:
- **Shared experts** (2): always activated for every token. They capture knowledge that is universally useful — basic syntax, common patterns, general facts.
- **Routed experts** (256): selectively activated. The router picks 8 experts per token (Top-K=8).
- **g_j**: gating weight computed by the router.

**Why shared experts?** In standard MoE (e.g., Mixtral 8×7B), the router learns to send most tokens to a small subset of "popular" experts, creating imbalance. Shared experts absorb the universally useful computation, leaving the routed experts to specialize more finely.

### 5.3 The Router (Gating Network)

The router determines which routed experts each token should use:

```
1. Compute gating scores:
   s(x) = softmax(W_gate · x)    ∈ ℝ^{N_experts} = ℝ^{256}

2. Select Top-K experts:
   top_k_indices = argsort(s(x))[:K]              K=8

3. Compute gating weights:
   g_j = s(x)_j   for j in top_k_indices
   (no re-normalization — the router outputs are already softmax-normalized)
```

**Expert capacity:** Unlike Mixtral-style MoE which imposes a fixed capacity (max tokens per expert), V4-Flash uses **no token-dropping**. Every token is assigned to its top-K experts regardless of load. Load balance is maintained through the auxiliary-loss-free mechanism (Section 5.5).

### 5.4 Expert Granularity

DeepSeekMoE uses **fine-grained expert segmentation**:

| Property | Standard MoE (e.g., Mixtral) | DeepSeekMoE |
|---|---|---|
| Experts per layer | 8 | 256 |
| Active per token | 2 | 8 |
| Expert hidden dim | 4096 | 2048 |
| Total expert params | ~8B per layer | ~6.5B per layer |

The key insight: smaller experts + more of them + more active per token = better specialization. Each expert has fewer parameters, so it must specialize more narrowly. With 8 active experts per token (up from 2), the model can compose fine-grained knowledge from multiple specialists rather than relying on two "generalists."

### 5.5 Auxiliary-Loss-Free Load Balancing

Standard MoE uses an auxiliary loss to encourage balanced expert utilization:

```
L_aux = α · Σ_{j=1}^{N} f_j · P_j
```

Where f_j is the fraction of tokens routed to expert j, and P_j is the average routing probability. This loss pushes the router to distribute tokens evenly — but it **interferes with the main training objective**. The router learns to balance load at the expense of routing quality.

V4-Flash (following DeepSeek-V3) replaces this with a **dynamic bias term**:

```
1. Maintain bias vector: b ∈ ℝ^{256}  (one per expert)
   Initialized to 0.

2. Modified gating:
   s'(x) = softmax(W_gate · x + b)

3. Top-K selection uses s'(x), but the final gating weights
   for the FFN output still use s(x) (without bias).

4. Bias update (every N steps):
   For each expert j:
     if expert_j is over-loaded (tokens > threshold):
       b_j -= γ    (reduce its attractiveness)
     if expert_j is under-loaded (tokens < threshold):
       b_j += γ    (increase its attractiveness)
```

**Why this works:**
- The bias adjusts **expert attractiveness** without modifying the router's learned scores.
- The bias update is a simple additive adjustment — no gradient computation, no interference with backprop.
- The router continues to learn optimal routing based on token content (W_gate · x), while the bias handles global load distribution.
- The main loss function is entirely unaffected by load balancing.

**Ablation result (DeepSeek-V3, Section 4.5.2):** Auxiliary-loss-free balancing achieves better load balance than auxiliary-loss-based methods while improving downstream benchmark performance by 0.3-0.5%.

### 5.6 Node-Limited Routing

During training with expert parallelism, cross-node communication is expensive. Node-limited routing restricts the expert selection to a subset of nodes:

```
1. Partition experts across N_node nodes.
2. For each token, first select the Top-M nodes based on
   aggregate score per node.
3. Then select the Top-K experts only from those M nodes.
```

M = 4 by default (out of 64 nodes). This ensures that each token's experts are distributed across at most 4 nodes, limiting all-to-all communication cost.

### 5.7 Expert Parallelism (EP)

During training, experts are distributed across GPUs:

```
64 nodes × 8 GPUs = 512 GPUs
256 experts / 512 GPUs = 0.5 experts per GPU → each GPU holds 2 expert replicas
```

Each token's activation requires:
1. **Forward to router** — all GPUs have the router weights (small, replicated).
2. **All-to-all dispatch** — send token hidden states to GPUs hosting the selected experts.
3. **Expert FFN computation** — each GPU processes its assigned tokens through its experts.
4. **All-to-all combine** — return expert outputs to the originating GPUs.

DualPipe (Section 11) overlaps steps 2 and 4 with computation from other micro-batches, making cross-node expert communication near-free.

### 5.8 MoE Layer Forward Pass Summary

```
Given: x ∈ ℝ^{B × 7168} (B tokens in batch)

1. Shared experts (always active):
   x_shared = FFN_shared_1(x) + FFN_shared_2(x)

2. Router:
   s = softmax(W_gate · x + b)    // with load-balancing bias
   indices, weights = top_k(s, K=8)

3. Dispatch:
   x_dispatch = all_to_all(indices, x)    // send tokens to expert GPUs

4. Expert computation:
   For each expert j on this GPU:
     x_expert_j = FFN_j(x_dispatch_j)

5. Combine:
   x_routed = all_to_all(x_expert)         // return to origin GPUs
   x_routed = weights · x_routed           // gate the expert outputs

6. Output:
   y = x_shared + x_routed
```

The total active parameters per token: 2 shared experts + 8 routed experts = 10 experts × d_model × d_ff ≈ 10 × 7168 × 2048 ≈ **~147M active params per MoE layer**. Across 67 layers: **~9.8B active FFN params** + ~6B attention params = **~16B active for "thinking"** + ~14B embedding/other = **~30B active per token**.

---

*Next: Section 6 — Multi-Token Prediction (MTP).*

---

## 6. Multi-Token Prediction (MTP)

Standard language models predict one token at a time: given tokens t₁...tₙ, predict tₙ₊₁. This teaches **local fluency** — the model learns that "the" often follows "of" — but it does not force the model to plan ahead.

MTP changes the objective: predict **three future tokens simultaneously** (tₙ₊₁, tₙ₊₂, tₙ₊₃). The model must commit to a syntactic and semantic arc before it sees the next word.

### 6.1 MTP Modules

MTP adds D independent prediction heads (D=3 for V4-Flash), each implemented as a transformer block:

```
Given: h_t^{(main)} ∈ ℝ^d  (main model's representation at position t)

For depth d = 1, 2, ..., D:
  h_t^{(d)} = MTPBlock_d( [h_t^{(main)}; h_{t+d-1}^{(d-1)}] )
  p_t^{(d)} = softmax( W_head · h_t^{(d)} )
  Loss: cross_entropy( p_t^{(d)}, token_{t+d} )
```

Where:
- MTPBlock_d is a small transformer block (attention + FFN).
- h_t^{(0)} = h_t^{(main)} (the main model's representation).
- The input is the **concatenation** of the main model's representation and the previous head's representation.
- Each head predicts token at offset d.

### 6.2 Training Objective

The total loss combines the main model's next-token prediction with all MTP heads:

```
L = L_main + λ · Σ_{d=1}^{D} L_d

where:
  L_main = cross_entropy(p_t^{(main)}, token_{t+1})
  L_d    = cross_entropy(p_t^{(d)}, token_{t+d})
  λ      = weighting hyperparameter (set to 0.3 in practice)
```

**Why MTP improves performance (DeepSeek-V3 Section 4.5.1 ablation):**

| Objective | MMLU | HumanEval | GSM8K |
|---|---|---|---|
| Single-token (baseline) | 86.2 | 72.4 | 84.1 |
| MTP D=2 | 86.8 | 73.1 | 85.0 |
| MTP D=3 | 87.1 | 73.4 | 85.3 |

D=3 provides diminishing returns beyond D=2, so V4-Flash uses D=3 for the best cost-benefit ratio.

### 6.3 Why MTP Works

1. **Forces planning:** To predict tₙ₊₃ accurately, the model must infer the sentence structure before it sees tₙ₊₁. This biases representations toward syntactic and semantic abstraction.

2. **Improves representation quality:** The intermediate representations h_t^{(d)} learn richer features because they must be useful across multiple time offsets.

3. **Provides additional gradient signal:** Standard next-token prediction gives one supervision point per token. MTP gives D points per token, improving sample efficiency.

### 6.4 MTP During Inference

During inference, the MTP heads can be used for **speculative decoding**:

```
1. Draft: use main model + MTP heads to generate D tokens cheaply.
2. Verify: run main model once on the D-token sequence.
3. Accept: if verification matches, accept all D tokens (2-3× speedup).
4. Reject: if mismatch, keep the longest prefix and re-draft.
```

This is possible because MTP shares the main model's backbone; no separate draft model is needed (unlike standard speculative decoding which requires a smaller draft model).

### 6.5 Implementation Details

- MTP heads are dropped during inference (only used for speculative decoding acceleration, Section 6.4).
- During standard inference (non-speculative), the MTP layers are not executed — zero overhead.
- The MTP modules share the embedding and output head weights with the main model to save memory (DeepSeek-V3, Section 3.2.3).
- Ablation studies show MTP is particularly beneficial for code and math tasks (improvement of 1.0-1.5%) versus general knowledge tasks (improvement of 0.3-0.6%).

---

## 7. Group Relative Policy Optimization (GRPO)

Standard RLHF uses PPO with a separate critic network (value function) to estimate the advantage of each generated token. Training this critic doubles the RL pipeline's memory and compute cost. GRPO eliminates the critic entirely.

### 7.1 Standard PPO vs GRPO

**PPO (standard):**
```
For each prompt:
  1. Generate response via policy π_θ
  2. Compute reward via reward model r
  3. Train critic V_φ to predict reward from hidden states
  4. Compute advantage: A_t = r_t - V_φ(state_t)   ← requires critic
  5. Update policy π_θ using clipped PPO objective
```

**GRPO (DeepSeek):**
```
For each prompt x:
  1. Generate G responses {y₁, y₂, ..., y_G} via policy π_θ
  2. Score each response with reward model r
  3. Compute group advantage (no critic!):
     A_i = (r(y_i) - mean(r)) / std(r)
  4. Update policy π_θ using clipped GRPO objective
```

### 7.2 Group Advantage Calculation

Instead of a learned value function, GRPO uses the **group statistics** of G generated responses:

```
A_i = (r(y_i) - μ_r) / σ_r

where:
  μ_r = (1/G) · Σ_j r(y_j)        (mean reward in group)
  σ_r = sqrt( (1/G) · Σ_j (r(y_j) - μ_r)² )   (std in group)
```

**Why this works:**
- The group average approximates the expected reward under the current policy.
- The group standard deviation provides a natural scale for advantage.
- Since all G responses are generated from the same prompt, the group statistics control for prompt difficulty (a prompt that is easy for all G responses will have low variance, so small differences are not amplified).
- G=8 provides stable statistics without excessive sampling cost.

### 7.3 GRPO Objective

```
L_GRPO(θ) = -E[ (1/G) Σ_i (  min( ρ_i(θ) · A_i, clip(ρ_i(θ), 1-ε, 1+ε) · A_i )  - β · KL(π_θ || π_ref) ) ]

where:
  ρ_i(θ) = π_θ(y_i|x) / π_old(y_i|x)    (importance sampling ratio)
  ε      = 0.2                            (clipping threshold)
  β      = 0.04                          (KL penalty coefficient)
  KL     = D_KL(π_θ || π_ref)            (KL divergence from reference policy)
```

The KL penalty prevents the policy from diverging too far from the reference (SFT) model, which would cause reward hacking — memorizing reward patterns without genuine improvement.

### 7.4 Reward Formulation

V4-Flash uses a **hybrid reward model**:

1. **Rule-based rewards** (for math, code, factual recall):
   - Math: exact match with ground-truth answer.
   - Code: pass@1 on test cases.
   - Factual: verified against trusted database.
   - Zero overhead (no model inference needed).

2. **Model-based rewards** (for open-ended generation, creative writing, dialogue):
   - A trained reward model (~7B parameters) evaluates response quality.
   - Trained on human preference data.

The final reward is a weighted combination:

```
r(y) = α · r_rule(y) + (1-α) · r_model(y)
```

where α is task-dependent (α=1 for math, α=0 for creative writing).

### 7.5 Computational Savings

| Component | PPO | GRPO |
|---|---|---|
| Forward passes per prompt | 1 (generate) | G (generate, in parallel) |
| Critic model | ~7B params | **None** |
| Critic forward/backward | 2 passes | **0 passes** |
| Total memory (RL stage) | ~40B equivalent | **~34B equivalent** |
| Training throughput (relative) | 1.0× | **1.6-1.8×** |

Source: DeepSeek-Math (Shao et al., 2024), where GRPO was first introduced.

---

*Next: Section 8 — Synthetic Data Pipeline.*

---

## 8. Synthetic Data Pipeline

Training data determines what a model can learn. Raw internet text is noisy, repetitive, and full of logical gaps. V4-Flash augments its pre-training corpus with **curated synthetic data** — code, proofs, formal logic — to teach structured reasoning from clean examples.

### 8.1 Data Composition

| Data Source | Fraction | Purpose |
|---|---|---|
| Web text (filtered) | 50% | General knowledge, fluency, broad coverage |
| Code (GitHub, verified) | 20% | Logical structure, precise syntax, long-range dependencies |
| Math (synthetic + verified) | 15% | Multi-step reasoning, symbolic manipulation |
| Proofs & formal logic | 10% | Deductive chains, contradiction handling |
| Scientific papers | 5% | Domain-specific vocabulary, citation structure |

Total corpus: 14.8T tokens (same as DeepSeek-V3).

### 8.2 Synthetic Data Generation

Code and math data are generated through a **synthesis pipeline**:

1. **Seed extraction**: pull problems from verified sources (LeetCode, MATH, GSM8K, theorem databases).
2. **Solution generation**: use a teacher model (DeepSeek-V3) to generate step-by-step solutions.
3. **Verification**:
   - Code: run test cases. If solution fails, discard.
   - Math: symbolic verification (SymPy) or exact match.
   - Proofs: formal verifier (Lean, Isabelle).
4. **Augmentation**: perturb seeds (rephrase, vary constants, generate analogous problems).
5. **Filtering**: remove duplicates via MinHash, remove near-duplicates via embedding similarity.
6. **Curriculum ordering**: sort by difficulty (judged by solution length or verification score).

### 8.3 Quality Filtering

Raw web text undergoes multi-stage filtering:

1. **Deduplication**: exact (hash-based) + fuzzy (MinHash LSH, n-gram overlap).
2. **Toxicity/content filtering**: classifier-based removal.
3. **Quality scoring**: a regression model trained on human-rated pages predicts "educational value." Bottom 10% by score is discarded.
4. **PII stripping**: regex + NER-based removal of personal information.
5. **Template detection**: boilerplate text (cookie notices, navigation menus) removed via DOM structure analysis.

### 8.4 Curriculum Scheduling

Training data is ordered by difficulty:

| Phase | Tokens | Data Focus |
|---|---|---|
| Ramp-up | 1T | High-quality web + simple code |
| Core | 10T | Full mix at target ratios |
| Reasoning boost | 2T | Increased math + proof ratio (35%) |
| Alignment prep | 1.8T | Safety, instruction-following, multi-turn |

The tail phases emphasize reasoning because the model has already learned "fluency" — the final training stages teach it to **think before speaking** (which reinforces the MTP objective).

---

## 9. FP8 Mixed Precision Training

Training a 284B-parameter model in FP32 would require >1 TB of GPU memory — infeasible. Standard mixed precision (FP16/BF16) cuts that in half but still strains 80GB H800s. FP8 halves it again.

### 9.1 The FP8 Challenge

FP8 has limited dynamic range. Two formats exist:

| Format | Exponent bits | Mantissa bits | Range | Precision |
|---|---|---|---|---|
| E4M3 | 4 | 3 | ±448 | 2⁻² ≈ 0.25 |
| E5M2 | 5 | 2 | ±57344 | 2⁻¹ ≈ 0.5 |

E4M3 has better precision but narrower range — activations and weights can overflow easily. E5M2 has wider range but coarser precision — gradient accumulation loses information.

DeepSeek-V3/V4-Flash uses **E4M3 for weights and activations**, **E5M2 for gradients**.

### 9.2 Block-Wise Quantization

Naive per-tensor quantization fails because different parts of a weight matrix have different ranges. The solution: quantize in small blocks.

```
For each 128-element block:
  1. Find absmax of block.
  2. Compute scale_factor = absmax / max_representable(E4M3).
  3. Quantize: x_q = round(x / scale_factor).
  4. Store: x_q (FP8) + scale_factor (FP32) per block.
```

**Overhead:** scale_factor is FP32 (4 bytes) per 128 elements. That's 4/128 = 3.125% overhead — negligible.

### 9.3 Mixed Precision Framework

V4-Flash's training precision scheme:

| Component | Storage Precision | Compute Precision |
|---|---|---|
| Weights (master copy) | FP32 | — |
| Weights (forward) | FP8 (E4M3) | FP8 |
| Activations (forward) | FP8 (E4M3) | FP8 |
| Gradients | FP16 (master) + FP8 (communication) | FP8 |
| Optimizer states (Adam) | FP32 (momentum + variance) | FP32 |
| Attention softmax | — | FP32 (always) |

**The master weight copy:** Weights are stored in FP32 as the "source of truth." Before each forward pass, they are quantized to FP8 on-the-fly. After the backward pass, the FP8 gradients are converted to FP16 and used to update the FP32 master copy. This prevents drift accumulation.

### 9.4 Online Quantization

Scale factors are computed **online** — from the actual tensor values each iteration — rather than from calibration data. This handles distribution shifts during training:

```
For each tensor T:
  For each block b:
    scale_b = max(|T[b]|) / FP8_MAX
    T_q[b] = round(T[b] / scale_b)
```

**Why not static calibration?** Model weight distributions change significantly during training (especially during the warmup phase). Using a fixed calibration set would cause systematic overflow/underflow errors.

### 9.5 Memory Savings

| Component | BF16 Training | FP8 Training | Savings |
|---|---|---|---|
| Weights (forward) | 2 bytes/param | 1 byte/param | 50% |
| Activations (per token) | ~10 MB | ~5 MB | 50% |
| Optimizer states | 8 bytes/param (fp32 mom+var) | 8 bytes/param (unchanged) | 0% |
| **Total per GPU (284B model, EP)** | ~78 GB | ~52 GB | **33%** |

This 33% memory reduction is what makes 284B-parameter training feasible on H800 (80GB) GPUs without aggressive activation checkpointing.

Source: DeepSeek-V3 Section 3.3, "FP8 Training."

---

## 10. Inference-Time Compute (Test-Time Scaling)

Larger models are not always better. Sometimes the same model, given more time to "think," outperforms a larger model answering immediately. Inference-time compute exploits this by letting the model loop — generate intermediate reasoning, self-correct, and refine — before producing the final answer.

### 10.1 The Looping Mechanism

When faced with a difficult prompt, V4-Flash can enter a **think-loop**:

```
1. Generate initial draft answer.
2. Evaluate draft (internal consistency check or external verifier).
3. If confidence < threshold:
     a. Generate critique of draft ("where might this be wrong?").
     b. Generate refined answer conditioned on draft + critique.
     c. Go to step 2.
4. Output final answer.
```

This is not chain-of-thought prompting — the looping is implemented at the **architecture level** with a dedicated think-loop controller that manages state across iterations.

### 10.2 Compute Budget Allocation

The model allocates additional compute based on difficulty:

| Prompt Type | Compute Multiplier | Use Case |
|---|---|---|
| Simple query | 1× (no loop) | "What is the capital of France?" |
| Complex reasoning | 2-4× | Multi-step math, logic puzzles |
| Code generation | 1.5-3× | LeetCode hard, system design |
| Verification | 1.5× | Self-check first draft |

The multiplier is relative to a single forward pass. A 4× multiplier means the model generates ~4× as many tokens, with intermediate self-critique steps.

### 10.3 Implementation

The think-loop shares the same model weights — no separate "refinement" model. The controller is a small classifier that takes the model's hidden states and predicts whether to continue looping or output:

```
Controller: f(h_last) = σ(W_controller · h_last)
  if f > threshold: continue loop
  else: output
```

The controller is trained on data where the model's initial answer was wrong but later self-corrected, learning to detect uncertainty from the hidden state distribution.

---

*Next: Section 11 — Infrastructure.*

---

## 11. Infrastructure

Efficient training of a 284B-parameter model requires more than smart architecture — it requires the hardware to stay busy. V4-Flash's infrastructure stack is co-designed with the architecture: DualPipe for pipeline parallelism, and custom CUDA kernels (FlashMLA, DeepGEMM) for the model's unique operations.

### 11.1 DualPipe: Computation-Communication Overlap

In standard pipeline parallelism, the GPU computes a micro-batch, sends it to the next GPU, and **waits** for the next micro-batch to arrive. These gaps ("pipeline bubbles") can waste 30-50% of compute.

DualPipe eliminates bubbles by **scheduling two independent micro-batches simultaneously** — one going forward through the pipeline, one going backward.

#### 11.1.1 The Problem

Standard 1F1B (one-forward-one-backward) scheduling:

```
GPU 0: [F0][F1][B1][B0] ... (idle between F0 and F1)
GPU 1:      [F0][F1][B1][B0] ... (idle between F1 and B1)
```

The bubbles at the start and end of each pipeline stage waste ~(P-1)/(P+1) of total time, where P is the pipeline depth. For P=4: 60% bubble ratio.

#### 11.1.2 DualPipe Scheduling

DualPipe interleaves forward and backward passes of two independent micro-batches (A and B):

```
GPU 0: [F_A0][F_B0][B_A1][B_B1][F_A2][F_B2] ...
GPU 1:      [F_A0][F_B0][B_A1][B_B1][F_A2] ...
```

By overlapping micro-batches, DualPipe hides the bubble and, crucially, **overlaps communication with computation**.

#### 11.1.3 Computation-Communication Overlap

The all-to-all communication for expert dispatch (Section 5.7) is the main bottleneck in MoE training. DualPipe schedules it during the backward pass of another micro-batch:

```
Timeline for one GPU:

Compute:  [ FFN_F(A) ][ ATTN_F(A) ][ FFN_B(A) ][ ATTN_B(A) ]
Comm:     [<-- all2all A -->]              [<-- all2all A -->]
Overlap:  ^^^^^ backward of B runs during all2all A ^^^^^
```

Result: **near-zero effective communication overhead**. The all-to-all bandwidth is fully utilized while the GPU stays saturated with computation from the overlap micro-batch.

#### 11.1.4 Pipeline Configuration (V4-Flash)

| Parameter | Value |
|---|---|
| Micro-batches per pipeline | 16 |
| Pipeline stages per node | 4 |
| Nodes | 64 |
| Total pipeline depth | 256 (64×4) |
| Bubble ratio (standard 1F1B) | ~39% |
| Bubble ratio (DualPipe) | **<5%** |

### 11.2 Cross-Node All-to-All Communication

Expert parallelism requires all-to-all communication across nodes. V4-Flash uses custom kernels that combine InfiniBand and NVLink bandwidth:

```
1. Intra-node (NVLink):  900 GB/s per GPU (H800 NVLink)
2. Inter-node (IB NDR400): 400 Gb/s = 50 GB/s per link
```

The custom all-to-all kernel:
- Packs small expert dispatch messages into larger IB packets (avoids message overhead).
- Uses **double buffering**: one buffer sends while the other fills.
- Prioritizes NVLink for intra-node experts (no IB hop needed).

### 11.3 Memory Optimization

Training 284B parameters on H800 (80GB) GPUs requires aggressive memory management:

**Recomputation:**
- RMSNorm and MLA up-projection (W_{UK}, W_{UV}) are **recomputed** during backward pass rather than stored.
- Saves ~3 GB per GPU at the cost of ~5% extra computation.

**CPU offloading:**
- Exponential moving average (EMA) of weights is stored in CPU RAM and synced periodically.
- Not needed for training, but useful for checkpoint averaging.

**Weight sharing:**
- Embedding and output head share the same weight matrix (tied embeddings).
- Saves ~0.9B parameters.

**Result:** Peak memory per GPU during training: ~75 GB (out of 80 GB H800). No tensor parallelism needed.

### 11.4 FlashMLA (Custom Attention Kernel)

FlashMLA is a CUDA kernel optimized specifically for MLA's KV-cache access pattern. Standard FlashAttention assumes a flat KV cache of shape [batch, heads, seq_len, head_dim]. MLA's cache is different:

- KV cache layout: [batch, seq_len, d_c] (not [batch, heads, seq_len, head_dim]).
- On-the-fly up-projection: c^{KV} → K, V during attention computation.
- Decoupled RoPE: separate K_R cache.

FlashMLA's optimizations:
1. **Fused up-project + attend**: instead of up-projecting all K,V first, then attending, FlashMLA does both in one kernel. Load c^{KV}, up-project a tile of K/V, compute partial attention, accumulate.
2. **RoPE fusion**: decoupled RoPE applied during the tile load, not as a separate kernel.
3. **Shared memory tiling**: the latent c^{KV} vectors (512 elements) fit in fast shared memory, minimizing global memory reads.

### 11.5 DeepGEMM (Custom MoE Kernel)

DeepGEMM accelerates the matrix multiplications that dominate MoE routing. Standard GEMM kernels (cuBLAS) assume dense, regular matrices. MoE expert matrices are:

- **Small**: 7168×2048 (expert FFN) — below the threshold where cuBLAS is optimal.
- **Irregular**: different experts receive different numbers of tokens.
- **Grouped**: tokens for different experts must be batched separately.

DeepGEMM's optimizations:
1. **Grouped GEMM**: dispatch all experts for a layer in a single kernel launch (not one per expert).
2. **Warp specialization**: one warp loads tokens, one computes, one writes results.
3. **Tile scheduling**: dynamically schedules expert computations to balance SM utilization (prevent expert 0 from running on 2 SMs while expert 255 waits).
4. **FP8 tensor core utilization**: streams FP8 data directly to tensor cores without intermediate FP16 conversion.

**Performance:** DeepGEMM achieves ~2.5× throughput vs cuBLAS on MLA attention kernels and ~3× throughput on MoE grouped GEMM (source: DeepSeek-V3 Section 3.2).

---

## 12. Inference Serving Architecture

Serving a 284B MoE model at low latency requires careful management of memory, computation, and batch scheduling across many GPUs.

### 12.1 Model Distribution

284B parameters in FP8 = **284 GB** of weights. With 256 experts distributed across 512 GPUs:

| Component | Memory (FP8) | Where |
|---|---|---|
| Shared experts (2) | 2 × 7168 × 2048 × 1B = ~28 MB | **Every GPU** (replicated) |
| Routed experts (256) | 256 × 7168 × 2048 × 1B = ~3.6 GB per expert | Distributed across 512 GPUs |
| Attention weights (67 layers) | ~67 × 7168 × 512 × 1B × ~5 matrices = ~1.2 GB | **Every GPU** (replicated) |
| Embedding + output | 129280 × 7168 × 1B = ~0.9 GB | **Every GPU** |
| **Total per GPU** | **~4.5 GB (weights) + ~2 GB (KV cache)** | |

Each GPU hosts 256/512 = 0.5 experts → with replication, ~2 experts per GPU. The attention weights are replicated across all GPUs (they are small enough to fit in every GPU's memory).

### 12.2 Prefill vs Decode

V4-Flash serves two distinct phases differently:

**Prefill (prompt processing):**
- Process the entire prompt in parallel (no autoregressive dependency).
- Use full MLA attention (no sparsity needed — prompt is short relative to model throughput).
- Batch multiple prompts together for GPU utilization.

**Decode (token generation):**
- Generate one token at a time.
- MLA's compressed KV cache (512 elements per token) keeps memory low.
- Each token's attention only reads the KV cache — no re-computation.
- Expert dispatch: route token to the 8 GPUs hosting its selected experts.

### 12.3 Expert Dynamic Loading

During decode, not all 256 experts need to be in GPU memory simultaneously:

1. **Hot experts** (most frequently routed) are kept in GPU memory always (typically ~50 experts account for 80% of routing).
2. **Cold experts** are loaded on-demand from CPU RAM (~100 GB/s bandwidth) or SSD (~7 GB/s NVMe).
3. **Prefetch**: the router predicts the next token's expert selection and starts loading cold experts before they are needed.

### 12.4 KV Cache Management

MLA's compact KV cache (576 elements per token per layer) means:

- At 128K context: 576 × 128K × 67 ≈ **4.9 GB per request** (FP16).
- At 256K context: **9.8 GB per request**.
- With 512 GPUs, serving 32 concurrent requests at 128K context: 32 × 4.9 GB = 157 GB distributed across 512 GPUs = **~307 MB per GPU**.

Memory-efficient prefix caching: if multiple requests share a common prefix (e.g., system prompt), the KV cache for the prefix is **shared** across requests.

### 12.5 Batch Scheduling

V4-Flash's inference scheduler is **iteration-level** (continuous batching):

```
For each decode iteration:
  1. Collect pending requests (each generates 1 token).
  2. For each request, compute router scores → determine expert set.
  3. Group requests by their expert set → minimize all-to-all cost.
  4. Dispatch to expert GPUs.
  5. Run expert FFN computation.
  6. Combine results.
  7. Run attention (reads KV cache).
  8. Return next token.
```

The scheduler prioritizes grouping requests that share expert sets — if requests A and B both route to experts {3, 17, 42, ...}, they can be dispatched together, sharing all-to-all messages.

---

*Next: Section 13 — Benchmarks.*

---

## 13. Benchmarks

V4-Flash evaluations cover general knowledge, reasoning, code, math, and long-context capabilities. Scores below are drawn from the DeepSeek-V3 technical report (V4-Flash-specific numbers forthcoming; V3 provides the architectural baseline).

### 13.1 General Knowledge

| Benchmark | DeepSeek-V3 (671B) | GPT-4o | Claude 3.5 Sonnet | Llama 3.1 405B |
|---|---|---|---|---|
| MMLU | 87.1 | 87.7 | 88.3 | 85.2 |
| MMLU-Pro | 75.9 | 73.5 | 75.3 | 73.0 |
| GPQA | 59.1 | 58.7 | 61.2 | 50.3 |

V4-Flash is expected to match or slightly exceed V3 on knowledge benchmarks due to retained total capacity with better sparsity.

### 13.2 Code

| Benchmark | DeepSeek-V3 | GPT-4o | Claude 3.5 Sonnet | Llama 3.1 405B |
|---|---|---|---|---|
| HumanEval | 82.6 | 80.5 | 84.2 | 77.4 |
| LiveCodeBench (pass@1) | 39.2 | 34.8 | 37.8 | 28.4 |
| SWE-Bench Verified | 42.0 | 37.6 | 50.8 | 24.5 |

The hybrid attention (SWA+CSA) and MTP objective provide particular benefit on code tasks where long-range structure matters.

### 13.3 Math & Reasoning

| Benchmark | DeepSeek-V3 | GPT-4o | o1-preview | Llama 3.1 405B |
|---|---|---|---|---|
| GSM8K | 95.6 | 92.0 | 96.4 | 91.8 |
| MATH-500 | 90.2 | 76.6 | 96.4 | 81.5 |
| AIME 2024 | 39.2 | 9.3 | 79.2 | 23.3 |

V4-Flash's extended inference-time compute (Section 10) is expected to significantly improve math/reasoning scores over standard (non-looping) V3.

### 13.4 Long-Context

| Benchmark | DeepSeek-V3 | GPT-4o | Claude 3.5 Sonnet |
|---|---|---|---|
| RULER (128K) | 87.6 | 85.3 | 88.2 |
| Needle-in-Haystack (256K) | 91.8 | 89.7 | 93.1 |

V4-Flash supports up to 1M tokens during context extension training. The CSA+HCA hybrid attention enables sub-quadratic scaling, so the degradation from 128K to 256K is minimal (~2-3%).

### 13.5 Inference Efficiency

| Metric | DeepSeek-V3 (671B) | V4-Flash (284B, estimated) |
|---|---|---|
| KV cache per token (FP16) | ~10 KB | ~1.1 KB (MLA 512 + RoPE 64) |
| Active params per token | 37B | ~30B |
| Max throughput (H800-8) | ~2,200 tok/s | ~3,500 tok/s (estimated) |
| Time to first token (128K prompt) | ~4.5s | ~1.8s (estimated) |

V4-Flash's smaller total parameter count (284B vs 671B) plus MLA's aggressive KV compression make it substantially more efficient at inference time.

Source: DeepSeek-V3, Section 4.4, "Evaluation Results."

---

## 14. References

1. DeepSeek-AI. "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model." arXiv:2405.04434, May 2024.
   - Primary reference for MLA (Section 3) and DeepSeekMoE (Section 5).

2. DeepSeek-AI. "DeepSeek-V3 Technical Report." arXiv:2412.19437, Dec 2024.
   - Primary reference for auxiliary-loss-free load balancing (Section 5.5), MTP (Section 6), FP8 training (Section 9), DualPipe (Section 11).

3. DeepSeek-AI. "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning." arXiv:2501.12948, Jan 2025.
   - Primary reference for GRPO (Section 7) and reasoning distillation (Section 12).

4. Shao, Zhihong, et al. "DeepSeek-Math: Pushing the Limits of Mathematical Reasoning." arXiv:2402.03300, 2024.
   - GRPO formulation and ablation studies.

5. Dai, Damai, et al. "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models." arXiv:2401.06066, 2024.
   - Fine-grained expert segmentation and shared expert isolation.

6. Vaswani, Ashish, et al. "Attention Is All You Need." NeurIPS 2017.
   - Original Transformer architecture (baseline for Section 3.1).

7. Su, Jianlin, et al. "RoFormer: Enhanced Transformer with Rotary Position Embedding." arXiv:2104.09864, 2021.
   - Rotary Position Embedding, basis for decoupled RoPE (Section 3.4).

8. Ainslie, Joshua, et al. "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints." EMNLP 2023.
   - GQA baseline comparison (Section 3.6).

9. Touvron, Hugo, et al. "Llama 2: Open Foundation and Fine-Tuned Chat Models." arXiv:2307.09288, 2023.
   - Standard MoE baseline comparison.

10. Schulman, John, et al. "Proximal Policy Optimization Algorithms." arXiv:1707.06347, 2017.
    - PPO baseline for RLHF comparison (Section 7.1).

