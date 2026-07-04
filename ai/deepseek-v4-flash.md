---
title: "DeepSeek V4-Flash"
aliases: []
tags: [ml, ai, deepseek, deep-learning]
created: "2026-07-01"
audience: Engineers who want to understand the DeepSeek V4-Flash model — architecture, training infrastructure, and serving.
prerequisites:
  - ai/ml.md
  - ai/transformer-inference.md
  - ai/architectures.md
---

# DeepSeek V4-Flash

## Prerequisites

This document assumes you understand the Transformer architecture. If you need a refresher:
- **[ai/ml.md](ml.md)** — ML fundamentals, RNN vs Transformer comparison.
- **[ai/transformer-inference.md](transformer-inference.md)** — How Transformers generate text, KV cache, attention mechanics.
- **[ai/architectures.md](architectures.md)** — MoE, attention mechanisms, architectural patterns.

---

## 1. Introduction & Context

### 1.1 The Transformer Bottleneck

A vanilla Transformer costs O(N²) per layer — every token attends to every other token. At 128K context, that's 16 billion attention computations per layer. For a 284-billion-parameter model, the naive approach is not merely expensive; it is infeasible. The KV cache alone would demand terabytes of high-bandwidth memory per request.

DeepSeek V4-Flash solves this through a three-part strategy:

1. **Compress** — reduce what you store (MLA compresses KV cache, mHC strengthens residual connections)
2. **Route** — activate only what you need (MoE keeps ~4.6% of params active per token)
3. **Prune** — skip irrelevant computation (sparse attention via CSA/HCA, auxiliary-loss-free load balancing)

The result: a 284B-parameter model with per-token cost closer to a 13B dense model.

### 1.2 DeepSeek Lineage

| Generation | Total Params | Active Params | Key Innovations | Training Tokens |
|---|---|---|---|---|---|
| DeepSeek 67B (V1) | 67B | 67B (dense) | Baseline dense model | — |
| DeepSeek-V2 (May 2024) | 236B | 21B | MLA, DeepSeekMoE, GRPO | 8.1T |
| DeepSeek-V3 (Dec 2024) | 671B | 37B | Aux-loss-free load balancing, MTP, FP8 training, DualPipe | 14.8T |
| DeepSeek-R1 (Jan 2025) | 671B | 37B | Long CoT reasoning, reinforcement learning from reasoning traces | — |
| **DeepSeek V4-Flash** | **284B** | **13B** | Hybrid attention (CSA+HCA), mHC, Muon optimizer, FP4 QAT | 32T |

Sources: [DeepSeek-V2, arXiv:2405.04434], [DeepSeek-V3, arXiv:2412.19437], [DeepSeek-R1, arXiv:2501.12948]

V4-Flash is not strictly a larger model than V3. The "Flash" designation signals a shift in design philosophy: smarter allocation of compute per token rather than more parameters. Where V3 maximized total capacity (671B params), V4-Flash optimizes for inference efficiency — fewer total parameters (284B) but more aggressive attention sparsity and better hardware utilization.

### 1.3 Design Philosophy

V4-Flash's architecture rests on four axioms:

1. **Attention must be sub-quadratic.** Not merely optimized, but structurally incapable of O(N²) cost.
2. **Most parameters should stay silent.** Each token needs specialists, not generalists. MoE is not optional.
3. **Computation and communication must overlap.** The GPU should never wait for data.
4. **Residual paths must be stable.** mHC constrains residual mappings to prevent signal degradation across deep layers.
5. **Precision is a lever, not a ceiling.** FP4 QAT for experts, FP8 elsewhere — bit-width is a resource to allocate, not a constraint to accept.

### 1.4 Document Structure

- **Sections 2-9** — Model architecture: specification, MLA, mHC, attention composition, MoE, MTP, GRPO, data pipeline, FP4 QAT & training.
- **Sections 10-13** — Infrastructure and serving: inference-time compute, parallelism, custom kernels, serving architecture, benchmarks.

---

## 2. Model Specification

### 2.1 Architecture Parameters

| Parameter | Value | Notes |
|---|---|---|---|
| Total parameters | 284B | |
| Active parameters per token | 13B | ~4.6% of total |
| Transformer layers | 43 | |
| Hidden dimension (d_model) | 4096 | |
| Attention heads (n_heads) | 64 | |
| Head dimension (d_head) | 512 | |
| Query compression dimension (d_c) | 1024 | |
| Feed-forward hidden dimension (expert) | 2048 | |
| Vocabulary size | 128K | BPE tokenizer |
| Max context length | 1M tokens | |
| Training tokens | 32T | |
| Pre-training compute | ~2.8M H800 GPU hours | |

### 2.2 MoE Configuration

| Parameter | Value |
|---|---|
| Number of experts | 256 |
| Shared experts | 1 |
| Active routed experts per token | 6 |
| Expert hidden dimension | 2048 |
| Hash-routed MoE layers (first 3) | Use hash routing by token ID |

### 2.3 Attention Allocation

| Attention Type | Layers | Compression | Tokens Attended |
|---|---|---|---|---|
| Sliding Window Attention | 1-2 | W=128 | 128 nearest neighbors |
| Interleaved CSA + HCA | 3-43 | CSA: 4:1, Top-K=512; HCA: 128:1 | CSA: 512 blocks → 512 selected; HCA: all super-blocks |

### 2.4 Training Hyperparameters

| Parameter | Value |
|---|---|---|
| Optimizer | Muon (Jordan et al., 2024; Liu et al., 2025) |
| Learning rate | — |
| Warmup steps | — |
| Batch size | 4M tokens (scheduled, follows V3 strategy) |
| Weight decay | 0.1 |
| Gradient clipping | 1.0 |
| Activation checkpointing | Tensor-level (fine-grained recomputation control) |
| Pipeline parallelism | Contextual parallelism for long-context attention |
| Training hardware | 2048 × H800 (80GB SXM5) |
| Interconnect | NVLink (intra-node) + InfiniBand NDR400 (inter-node) |

### 2.5 Post-Training Configuration

| Stage | Data | Method |
|---|---|---|---|
| Specialist SFT | Domain-specific data (math, code, agent, instruction) | Standard cross-entropy |
| Specialist RL | Domain-specific reward models | GRPO (G groups per prompt) |
| On-policy distillation | Teacher model outputs | Reverse KL divergence, full-vocabulary logit distillation |

---

## 3. Multi-Head Latent Attention (MLA)

MLA is the single most important architectural innovation in the DeepSeek family. It achieves better-than-MHA quality with a fraction of the KV cache.

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

**During inference**, every (k_{j,i}, v_{j,i}) for all past tokens must be cached — that's **2 · n_h · d_h** elements per token per layer. For a model with n_h=64, d_h=128, and 67 layers: 2 × 64 × 128 × 67 = **1,097,728 elements per token** (~4.2 MB at FP16). At 256K context: **~1 TB of KV cache**.

### 3.2 Low-Rank KV Joint Compression

MLA's core insight: the keys and values live in a high-dimensional space (d_h·n_h = 8192) but their intrinsic dimensionality is much lower. Instead of storing full K and V, MLA projects them into a shared latent space and reconstructs on the fly.

**Step 1: Down-project to latent.**

```
c_t^{KV} = W_{DKV} · h_t    where c_t^{KV} ∈ ℝ^{d_c}, d_c << d_h·n_h
```

For a typical MLA configuration: d_c = 512. The input dimension d = 7168 is compressed to 512 — a 14:1 reduction.

**Step 2: Up-project keys and values from the same latent.**

```
k_t^C = W_{UK} · c_t^{KV}    ∈ ℝ^{d_h·n_h}
v_t^C = W_{UV} · c_t^{KV}    ∈ ℝ^{d_h·n_h}
```

Both K and V are reconstructed from the same compressed vector c_t^{KV}. The KV cache is therefore just **d_c** elements per token per layer.

**KV cache comparison:**

| Mechanism | Cache per token per layer | At 256K context (hypothetical 67-layer model) |
|---|---|---|---|
|---|---|---|
| Full MHA | 2 · d_h · n_h | ~1 TB |
| GQA (8 groups) | 2 · d_h · 8 | ~134 GB |
| MQA (1 group) | 2 · d_h · 1 | ~17 GB |
| **MLA** | **d_c = 512** | **~66 GB** |

MLA caches 512 elements vs MHA's 8192 — a 16× reduction.

### 3.3 Weight Absorption During Inference

A key engineering trick: during inference, the up-projection matrices W_{UK} and W_{UV} can be absorbed into earlier matrices. This means we never materialize the full K and V during generation.

**Key absorption into query:** The attention score for head i is:

```
score_i = q_{t,i}^T · k_{j,i}
        = (W_{UQ,i} · W_{DQ} · h_t)^T · (W_{UK,i} · c_j^{KV})
        = h_t^T · (W_{DQ}^T · W_{UQ,i}^T · W_{UK,i}) · c_j^{KV}
```

The product (W_{UQ,i}^T · W_{UK,i}) can be pre-computed into a single matrix.

**Value absorption into output:**

```
u_t = W_O · [v_{t,1}^C; ...; v_{t,n_h}^C]
    = W_O · W_{UV} · c_t^{KV}
    = (W_O · W_{UV}) · c_t^{KV}
```

W_{UV} absorbs into W_O. The attention output is computed directly from the latent c_t^{KV} without ever expanding to full K/V dimensions.

### 3.4 Decoupled RoPE

Rotary Position Embedding (RoPE) is essential for length generalization, but it is incompatible with low-rank KV compression. RoPE applies a rotation matrix that depends on the token's absolute position. If we compress K first and then apply RoPE, the rotation mixes dimensions in the compressed space and the low-rank structure breaks. If we apply RoPE before compression, we lose the ability to absorb W_{UK} into W_Q.

MLA's solution: decouple the RoPE-carrying dimensions from the compressed path.

```
k_t^R = RoPE( W_{KR} · h_t )    ∈ ℝ^{d_h^R}
```

where d_h^R = 64 (half of d_h = 128). The full key becomes:

```
k_{t,i} = [k_{t,i}^C ; k_t^R]
```

**What gets cached (inference):**

- c_t^{KV} ∈ ℝ^{512} — the compressed KV latent
- k_t^R ∈ ℝ^{64} — the decoupled RoPE key (one per layer, not per head)

Total: 576 elements per token per layer.

### 3.5 Query-Side Compression

During training, compress the query to reduce activation memory:

```
c_t^Q = W_{DQ} · h_t          ∈ ℝ^{d_c'}
q_t^C = W_{UQ} · c_t^Q        ∈ ℝ^{d_h·n_h}
```

d_c' = 1536 for V4-Flash — a 4.7:1 compression ratio.

### 3.6 MLA vs Alternatives

| Property | MHA | GQA (8 groups) | MQA | **MLA** |
|---|---|---|---|---|
| KV cache per layer | 2·n_h·d_h | 2·8·d_h | 2·1·d_h | d_c (512) |
| Cache at 256K (67-layer model) | ~1 TB | ~134 GB | ~17 GB | **~66 GB** |
| Quality vs MHA | baseline | slight degradation | significant degradation | **matches or exceeds** |
| RoPE compatible | yes (per head) | yes (per head) | yes (per head) | **requires decoupled** |
| Weight absorption | N/A | N/A | N/A | yes (K→Q, V→O) |

Source: DeepSeek-V2 Appendix D.2. On the MMLU benchmark, MLA (with KV compression dimension 512) achieves 79.1% vs MHA's 79.0%.

### 3.7 MLA Forward Pass (Inference, Autoregressive Decoding)

```
Given: h_t ∈ ℝ^{7168}  (current token hidden state)

1. Compress KV:   c_t^{KV} = W_{DKV} · h_t              (7168 → 512)
2. Compress Q:    c_t^Q    = W_{DQ} · h_t                (7168 → 1536)
3. Decoupled K:   k_t^R    = RoPE(W_{KR} · h_t)          (7168 → 64)
4. Decoupled Q:   q_t^R    = RoPE(W_{QR} · c_t^Q)        (1536 → 64·64)

5. Cache:  append (c_t^{KV}, k_t^R) to running KV cache

6. Compute attention scores (absorbed):
   For each head i:
     score_{t,i} = (q_{t,i}^C)^T · [K_cache_i^C ; K_cache_R]

7. Output (absorbed): u_t = W_O · W_{UV} · c_t^{KV}
```

---

## 3.8 Manifold-Constrained Hyper-Connections (mHC)

V4 series introduce mHC [^7] to strengthen the residual connections between Transformer blocks. Standard residual connections add the layer's output directly to its input. mHC expands the residual stream width by a factor of n_hc (set to 4 for V4-Flash) and constrains the residual mapping to the manifold of doubly stochastic matrices via the Sinkhorn-Knopp algorithm.

**Why it matters:** The doubly stochastic constraint ensures the spectral norm of the residual mapping is bounded by 1, making the transformation non-expansive. This prevents signal explosion or vanishing across 43 layers while preserving expressivity. Training stability improves without sacrificing model quality.

The mHC parameters are dynamically generated per layer: an input-dependent component (computed from the current hidden state) plus a static bias. The three transformations (input mapping, residual transformation, output mapping) are constrained via Sigmoid (for non-negativity) and the Birkhoff polytope projection (for the residual matrix).

Source: [^7]: Xie et al., "Manifold-Constrained Hyper-Connections," 2026.

---

## 4. Attention Composition Across Layers

V4-Flash assigns each layer a specific attention role based on depth, mixing Sliding Window Attention (SWA), Compressed Sparse Attention (CSA), and Heavily Compressed Attention (HCA). All three sit on top of the MLA foundation.

### 4.1 The Locality-to-Globality Principle

| Layer Range | Attention Type | Effective Window | Cost per Token |
|---|---|---|---|---|
| 1-2 | SWA (Sliding Window) | 128 tokens | O(W) = O(128) |
| 3-43 | Interleaved CSA + HCA | CSA: 4:1 compression, Top-K=512; HCA: 128:1 compression | See below |

### 4.2 Sliding Window Attention (SWA) — Layers 1-2

SWA restricts each token to attend to at most W=128 neighboring tokens. Nearly all syntactic dependencies fall within a 50-token window. The MLA key-value cache only needs to keep the most recent W tokens' c^{KV} and k^R vectors.

**Cost:** O(N·W) = O(128N). At 256K context: ~33M operations per layer vs ~66B for full attention.

### 4.3 Compressed Sparse Attention (CSA)

CSA combines compression with sparse selection.

**Step 1: Sequence compression (4:1).** The input sequence is divided into blocks of 4 tokens. Each block is averaged to produce a single block representation.

**Step 2: Lightning Indexer — Top-K block selection.** A lightweight scoring network evaluates each compressed block and assigns a relevance score for the current query. It selects the Top-K most relevant blocks (K=512 by default).

**Step 3: Attend to selected blocks.** Total tokens attended: K × 4 = 2048.

**Cost:** CSA is O(C·K) where C=4 and K=512. At 256K context: ~9M operations vs 66B for full attention.

### 4.4 Heavily Compressed Attention (HCA)

HCA pushes compression to 128:1. The sequence is divided into super-blocks of 128 tokens each. Unlike CSA, HCA attends to all compressed blocks densely.

**Cost:** O(N/128). At 256K context: N/128 = 2048 super-blocks → ~2M operations.

### 4.5 Forward Pass Through the Attention Stack

```
Input: x ∈ ℝ^{N × 4096}

Layer 1-2 (SWA+MLA):
  for each position t:
    c^{KV}_t = W_{DKV} · x_t                     (MLA compress)
    attend to [t-128, t-1] only                  (sliding window)

Layer 3-43 (interleaved CSA/HCA+MLA):
  for each position t:
    c^{KV}_t = W_{DKV} · x_t
    if layer is CSA:
      blocks = compress sequence 4:1               (N → N/4 blocks)
      scores = LightningIndexer(blocks, query_t)
      selected = top_k(scores, K=512)
      attend to tokens in selected blocks only
    if layer is HCA:
      super_blocks = compress sequence 128:1
      attend to all super_blocks
```

---

## 5. DeepSeekMoE

While MLA makes attention efficient, DeepSeekMoE makes the feed-forward network efficient. Instead of a single dense FFN, MoE splits the FFN into many experts and activates only a subset per token.

### 5.1 Architecture

```
DeepSeekMoE(x) = Σ_{i∈Shared} FFN_i(x) + Σ_{j∈Routed} g_j · FFN_j(x)
```

- **Shared experts** (2): always activated. Capture universally useful knowledge.
- **Routed experts** (256): selectively activated. Router picks 8 per token.

### 5.2 The Router

The router learns which experts to assign to which tokens entirely through backpropagation. Initially random, it sends "Python" to the cooking expert, the expert processes it poorly, the loss spikes, and backpropagation adjusts the router's weights to avoid repeating the mistake. Over billions of tokens, the router's `W_gate` matrix learns the exact "look" of each token type, and each expert simultaneously specializes in the data it receives most often.

```
1. Compute gating scores:
   s(x) = softmax(W_gate · x + b)    ∈ ℝ^{256}

2. Select Top-K experts:
   top_k_indices = argsort(s(x))[:K]              K=8

3. Gating weights: g_j = s(x)_j for j in top_k_indices
```

No token-dropping. Every token is assigned to its top-K experts regardless of load.

### 5.3 Expert Granularity

| Property | Standard MoE (Mixtral) | DeepSeekMoE |
|---|---|---|
| Experts per layer | 8 | 256 |
| Active per token | 2 | 8 |
| Expert hidden dim | 4096 | 2048 |
| Total expert params | ~8B per layer | ~6.5B per layer |

### 5.4 Auxiliary-Loss-Free Load Balancing

Standard MoE uses an auxiliary loss that interferes with the main training objective. V4-Flash replaces this with a dynamic bias term:

```
1. Maintain bias vector: b ∈ ℝ^{256}, initialized to 0.

2. Modified gating: s'(x) = softmax(W_gate · x + b)

3. Top-K selection uses s'(x), but final gating weights use s(x).

4. Bias update (every N steps):
   For each expert j:
     if expert_j is over-loaded:  b_j -= γ
     if expert_j is under-loaded: b_j += γ
```

The bias adjusts expert attractiveness without modifying the router's learned scores. The main loss function is unaffected.

### 5.5 Node-Limited Routing

During training with expert parallelism, first select the Top-M nodes (M=4 out of 64), then select the Top-K experts only from those M nodes. This limits all-to-all communication cost.

### 5.6 MoE Layer Forward Pass

```
Given: x ∈ ℝ^{B × 7168} (B tokens in batch)

1. Shared experts:
   x_shared = FFN_shared_1(x) + FFN_shared_2(x)

2. Router:
   s = softmax(W_gate · x + b)
   indices, weights = top_k(s, K=8)

3. Dispatch:
   x_dispatch = all_to_all(indices, x)

4. Expert computation:
   For each expert j on this GPU:
     x_expert_j = FFN_j(x_dispatch_j)

5. Combine:
   x_routed = all_to_all(x_expert)
   x_routed = weights · x_routed

6. Output: y = x_shared + x_routed
```

Active parameters per token: **~13B active per token** (per the paper: 284B total, 13B activated).

---

## 6. Multi-Token Prediction (MTP)

Standard language models predict one token at a time. MTP predicts one additional future token (tₙ₊₁). The model must commit to a syntactic and semantic arc ahead of time.

### 6.1 MTP Modules

D independent prediction heads (D=1 for Flash, D=3 for V3), each a transformer block:

```
Given: h_t^{(main)} ∈ ℝ^d

For depth d = 1, ..., D:
  h_t^{(d)} = MTPBlock_d( [h_t^{(main)}; h_{t+d-1}^{(d-1)}] )
  p_t^{(d)} = softmax( W_head · h_t^{(d)} )
  Loss: cross_entropy( p_t^{(d)}, token_{t+d} )
```

### 6.2 Training Objective

```
L = L_main + λ · Σ_{d=1}^{D} L_d
```

λ = 0.3.

### 6.3 Why MTP Works

1. Forces planning — biases representations toward syntactic and semantic abstraction.
2. Improves representation quality — features must be useful across multiple time offsets.
3. Provides additional gradient signal — D supervision points per token instead of one.

### 6.4 MTP During Inference

MTP heads enable speculative decoding without a separate draft model:

```
1. Draft: use main model + MTP heads to generate D tokens cheaply.
2. Verify: run main model once on the D-token sequence.
3. If verification matches, accept all D tokens (2-3× speedup).
```

---

## 7. Group Relative Policy Optimization (GRPO)

Standard RLHF uses PPO with a separate critic network. GRPO eliminates the critic entirely.

### 7.1 Standard PPO vs GRPO

**PPO:** For each prompt, generate 1 response, compute reward, train critic V_φ to predict reward, compute advantage A_t = r_t - V_φ(state_t), update policy.

**GRPO:** For each prompt x, generate G responses, score each with reward model, compute group advantage:

```
A_i = (r(y_i) - μ_r) / σ_r
```

No critic needed. G=8 provides stable statistics.

### 7.2 GRPO Objective

```
L_GRPO(θ) = -E[ (1/G) Σ_i ( min( ρ_i(θ) · A_i, clip(ρ_i(θ), 1-ε, 1+ε) · A_i ) - β · KL(π_θ || π_ref) ) ]
```

### 7.3 Reward Formulation

Hybrid reward model:
- **Rule-based** (math, code, factual): exact match, pass@1, verified against database. Zero overhead.
- **Model-based** (open-ended generation): trained reward model (~7B params).

Final reward: r(y) = α · r_rule(y) + (1-α) · r_model(y)

### 7.4 Computational Savings

| Component | PPO | GRPO |
|---|---|---|
| Critic model | ~7B params | **None** |
| Total memory (RL stage) | ~40B equivalent | **~34B equivalent** |
| Training throughput | 1.0× | **1.6-1.8×** |

---

## 8. Synthetic Data Pipeline

### 8.1 Data Composition

| Data Source | Fraction | Purpose |
|---|---|---|
| Web text (filtered) | 50% | General knowledge, fluency |
| Code (GitHub, verified) | 20% | Logical structure, precise syntax |
| Math (synthetic + verified) | 15% | Multi-step reasoning |
| Proofs & formal logic | 10% | Deductive chains |
| Scientific papers | 5% | Domain-specific vocabulary |

Total corpus: 32T tokens (Flash), 33T tokens (Pro).

### 8.2 Synthetic Data Generation

1. Seed extraction from verified sources (LeetCode, MATH, theorem databases)
2. Solution generation via teacher model (DeepSeek-V3)
3. Verification: run tests (code), symbolic verification (math), formal verifier (proofs)
4. Augmentation: rephrase, vary constants, generate analogous problems
5. Filtering: deduplicate via MinHash + embedding similarity
6. Curriculum ordering by difficulty

### 8.3 Curriculum Scheduling

| Phase | Tokens | Data Focus |
|---|---|---|
| Ramp-up | 1T | High-quality web + simple code |
| Core | 10T | Full mix at target ratios |
| Reasoning boost | 2T | Increased math + proof ratio (35%) |
| Alignment prep | 1.8T | Safety, instruction-following, multi-turn |

---

## 9. FP4 Quantization-Aware Training

V4-Flash uses FP4 Quantization-Aware Training (QAT) for the routed expert weights and the indexer QK path. Unlike standard post-training quantization, QAT simulates quantization noise during training so the model learns to compensate. This preserves accuracy better than PTQ at very low bit widths.

### 9.1 The FP4/FP8 Challenge

V4-Flash uses FP4 for routed expert weights and the indexer QK path, while keeping attention and router weights at FP8. FP4 stores 4 bits per weight (16 possible values), offering 4× compression vs FP16.

| Format | Exponent bits | Mantissa bits | Range | Precision |
|---|---|---|---|---|
| E4M3 (FP8) | 4 | 3 | ±448 | 2⁻² ≈ 0.25 |
| E5M2 (FP8) | 5 | 2 | ±57344 | 2⁻¹ ≈ 0.5 |
| FP4 (NV4) | Shared scale | 4 | Per-group range | Variable |

### 9.2 Quantization-Aware Training (QAT)

Unlike post-training quantization (PTQ), which applies quantization as a separate step after training is complete, QAT inserts fake quantization nodes during training. The model learns to produce weights that survive the round-trip through quantization and dequantization with minimal error.

**V4-Flash's QAT pipeline:**
1. Pre-train the model at full precision (FP8/BF16) using the Muon optimizer.
2. Insert quantization nodes after the pre-training checkpoint: expert weights simulated at FP4, indexer QK path at FP4.
3. Continue training with the quantization nodes active. Gradients flow through the straight-through estimator (STE), bypassing the non-differentiable round operation.
4. After QAT, export the quantized FP4 weights for inference.

### 9.3 Block-Wise Quantization

Each group of weights shares a scale factor:

```
For each 128-element block:
  1. Find absmax of block.
  2. Compute scale_factor = absmax / max_representable(FP4).
  3. Quantize: x_q = round(x / scale_factor).
  4. Store: x_q (FP4) + scale_factor (FP32) per block.
```

Overhead: 4 bytes per 128 elements = 3.125%.

### 9.4 Mixed Precision Framework

| Component | Storage Precision | Compute Precision |
|---|---|---|
| Weights (master copy) | BF16/FP32 | — |
| Expert weights (forward) | FP4 (QAT) | FP4 × FP8 |
| Attention weights | FP8 (E4M3) | FP8 |
| Indexer QK weights | FP4 (QAT) | FP4 |
| Activations (forward) | FP8 (E4M3) | FP8 |
| Gradients | FP16 (master) + FP8 (communication) | FP8 |
| Optimizer states (Muon) | FP32 (momentum) | FP32 |

### 9.5 Why QAT Instead of PTQ

At 4 bits, the quantization grid has only 16 levels. Without QAT, the model's weights — optimized for full-precision inference — map poorly onto this coarse grid. QAT allows the weights to adapt during training so the quantization error is baked into the optimization objective. The result: FP4 QAT matches or exceeds FP8 PTQ quality while using half the bits.

### 9.6 Memory Savings

| Component | BF16 Training | FP4/FP8 Training | Savings |
|---|---|---|---|
| Expert weights (forward) | 2 bytes/param | 0.5 bytes/param | 75% |
| Attention weights | 2 bytes/param | 1 byte/param | 50% |
| Activations (per token) | ~5 MB | ~2.5 MB | 50% |
| Optimizer states | 8 bytes/param | 8 bytes/param | 0% |
| **Total per GPU (284B, EP)** | ~78 GB | ~52 GB | **33%** |

---

## 10. Inference-Time Compute (Test-Time Scaling)

The same model, given more time to "think," can outperform a larger model answering immediately. V4-Flash implements a think-loop at the architecture level.

Think and no-think use the **same neural network** — no separate model is loaded. The controller classifier (section 10.3) decides per-token whether to loop again or output. When the loop runs zero times, the model behaves as a standard single-pass transformer; when it runs, the model generates internal reasoning tokens that never reach the user.

### 10.1 The Looping Mechanism

```
1. Generate initial draft answer.
2. Evaluate draft (internal consistency check or external verifier).
3. If confidence < threshold:
     a. Generate critique of draft.
     b. Generate refined answer conditioned on draft + critique.
     c. Go to step 2.
4. Output final answer.
```

### 10.2 Compute Budget Allocation

| Prompt Type | Compute Multiplier | Use Case |
|---|---|---|
| Simple query | 1× (no loop) | "What is the capital of France?" |
| Complex reasoning | 2-4× | Multi-step math, logic puzzles |
| Code generation | 1.5-3× | LeetCode hard, system design |
| Verification | 1.5× | Self-check first draft |

### 10.3 Implementation

The controller is a small classifier trained on data where the model's initial answer was wrong but later self-corrected:

```
Controller: f(h_last) = σ(W_controller · h_last)
  if f > threshold: continue loop
  else: output
```

---

## 11. Infrastructure

### 11.1 Fine-Grained Communication-Computation Overlap

V4 series introduces single fused kernels for MoE modules that fully overlap computation, communication, and memory access. During expert parallelism, each GPU computes its local expert FFN while simultaneously dispatching/receiving tokens from other GPUs. The fused kernel eliminates idle wait time between the all-to-all communication and the expert computation.

**Timeline for one GPU:**

```
Compute:  [→ local expert FFN →] [→ all2all recv → local expert FFN →] ...
Comm:     [← all2all send →]         [← all2all send →]
Overlap:  ^^^^^ local FFN runs during all2all ^^^^^
```

**Key design:**
- Single fused kernel launch for the entire MoE module (dispatch → compute → combine → all2all).
- Double buffering on communication buffers: one buffer transmits while the next fills.
- Prioritizes NVLink for intra-node experts, InfiniBand for cross-node.

### 11.2 Contextual Parallelism for Long-Context Attention

Standard sequence parallelism splits the sequence across GPUs but requires communication for every attention layer. V4 uses two-stage contextual parallelism:

1. **Stage 1 (within CSA/HCA windows):** Each GPU processes its local segment independently — no communication needed for compressed attention within a local range.
2. **Stage 2 (cross-segment):** Compressed KV entries are exchanged between GPUs to enable sparse attention across segment boundaries.

This design avoids the all-to-all attention communication cost that naive sequence parallelism would incur.

### 11.3 Memory Optimization

**Extended autograd checkpointing:** Fine-grained tensor-level recomputation instead of layer-level. Only specific operations (RMSNorm, MLA up-projections) are recomputed during backward. Saves ~3 GB per GPU at ~5% extra compute.

**Hybrid ZeRO for Muon:** The Muon optimizer's momentum states are sharded across GPUs (ZeRO-1), while model weights remain replicated for fast forward pass. Saves ~8 GB per GPU vs naive Muon.

**Weight sharing:** Embedding and output head share the same matrix. Saves ~0.9B parameters.

**Peak memory per GPU:** ~75 GB (out of 80 GB H800).

### 11.4 TileLang Custom Kernels

V4 uses TileLang [^13], a Domain-Specific Language (DSL) for tensor computations, to develop fused GPU kernels:

- **Fused MoE kernel:** single launch for dispatch, expert FFN computation, and combine.
- **MLA fused kernel:** KV cache compression, up-projection, and attention in one kernel.
- **Batch-invariant kernels:** bitwise reproducibility across different batch sizes — critical for debugging and model evaluation.
- **Deterministic kernels:** identical results across training runs with the same inputs, enabling reliable regression testing.

### 11.5 KV Cache with On-Disk Storage

V4 supports heterogeneous KV cache management:
- Active KV blocks in GPU HBM (high bandwidth memory)
- Inactive prefix blocks paged to SSD (on-disk storage)
- Shared prefix reuse: common prefixes (system prompts, few-shot examples) stored once, referenced by multiple requests
- Compression: KV cache stored at reduced precision where quality impact is minimal

---

## 12. Inference Serving Architecture

### 12.1 Model Distribution

284B parameters in mixed precision (FP4 experts + FP8 attention). With 256 experts across 512 GPUs:

| Component | Memory | Where |
|---|---|---|
| Shared expert (1) | ~14 MB | Every GPU (replicated) |
| Routed experts (256) | ~1.8 GB per expert (FP4) | Distributed across 512 GPUs |
| Attention weights (43 layers) | ~0.8 GB (FP8) | Every GPU (replicated) |
| Embedding + output | ~0.9 GB (FP8) | Every GPU |
| **Total per GPU** | **~3.5 GB (weights) + ~1.5 GB (KV cache)** | |

### 12.2 Prefill vs Decode

**Prefill:** Process entire prompt in parallel. Full MLA attention. Batch multiple prompts.

**Decode:** One token at a time. MLA's compressed KV cache (512 elements per token) keeps memory low. Expert dispatch routes to the 8 GPUs hosting selected experts.

### 12.3 Expert Dynamic Loading

- Hot experts (~50, accounting for 80% of routing) stay in GPU memory.
- Cold experts loaded on-demand from CPU RAM or SSD.
- Prefetch: router predicts next token's expert selection and starts loading before needed.

### 12.4 KV Cache Management

- At 128K context: compressed KV cache per request (MLA + decoupled RoPE).
- At 1M context: on-disk KV cache storage for shared prefixes (inactive blocks paged to SSD, active blocks in GPU memory).
- V4 supports heterogeneous KV cache: different precision for compressed vs full-resolution cache entries.

### 12.5 Batch Scheduling

Iteration-level (continuous batching):

```
For each decode iteration:
  1. Collect pending requests.
  2. Compute router scores → expert set per request.
  3. Group requests by expert set → minimize all-to-all cost.
  4. Dispatch to expert GPUs.
  5. Run expert FFN computation.
  6. Combine results.
  7. Run attention.
  8. Return next token.
```

---

## 13. Benchmarks

### 13.1 General Knowledge

| Benchmark | DeepSeek-V3 (671B) | GPT-4o | Claude 3.5 Sonnet | Llama 3.1 405B |
|---|---|---|---|---|
| MMLU | 87.1 | 87.7 | 88.3 | 85.2 |
| MMLU-Pro | 75.9 | 73.5 | 75.3 | 73.0 |
| GPQA | 59.1 | 58.7 | 61.2 | 50.3 |

### 13.2 Code

| Benchmark | DeepSeek-V3 | GPT-4o | Claude 3.5 Sonnet | Llama 3.1 405B |
|---|---|---|---|---|
| HumanEval | 82.6 | 80.5 | 84.2 | 77.4 |
| LiveCodeBench (pass@1) | 39.2 | 34.8 | 37.8 | 28.4 |
| SWE-Bench Verified | 42.0 | 37.6 | 50.8 | 24.5 |

### 13.3 Math & Reasoning

| Benchmark | DeepSeek-V3 | GPT-4o | o1-preview | Llama 3.1 405B |
|---|---|---|---|---|
| GSM8K | 95.6 | 92.0 | 96.4 | 91.8 |
| MATH-500 | 90.2 | 76.6 | 96.4 | 81.5 |
| AIME 2024 | 39.2 | 9.3 | 79.2 | 23.3 |

### 13.4 Long-Context

| Benchmark | DeepSeek-V3 | GPT-4o | Claude 3.5 Sonnet |
|---|---|---|---|
| RULER (128K) | 87.6 | 85.3 | 88.2 |
| Needle-in-Haystack (256K) | 91.8 | 89.7 | 93.1 |

### 13.5 Inference Efficiency

| Metric | DeepSeek-V3.2 (671B) | V4-Flash (284B) | Source |
|---|---|---|---|
| Active params per token | 37B | 13B | Paper §1 |
| Single-token FLOPs (1M context) | baseline | **10%** of V3.2 | Paper §1, Figure 1 |
| KV cache size (1M context) | baseline | **7%** of V3.2 | Paper §1, Figure 1 |
| Max throughput (H800-8) | ~2,200 tok/s | ~3,500 tok/s | Estimated |
| Time to first token (128K prompt) | ~4.5s | ~1.8s | Estimated |

---

## 14. From MLP to V4-Flash

If you're coming from the [MLP fundamentals](ml.md), here is how each core concept scales to V4-Flash:

### 14.1 Fully Connected → Mixture of Experts

In a standard MLP, every neuron connects to every neuron in the next layer — fully connected. Doubling the layer size quadruples the compute. V4-Flash breaks this with MoE:

- **284B total parameters** — a massive network
- **13B active per token** — only a fraction is used for any single input
- **The router** selects which 6 of 256 expert sub-networks handle each token, activating only ~4.6% of total parameters at once

You get the intelligence of a 284B-parameter network while paying the "math tax" of a 13B network.

### 14.2 Feed-Forward → Hybrid Attention

An MLP processes input in isolation — no memory of earlier tokens. V4-Flash is a Transformer with a 1M-token context window, built on a hybrid attention stack:

- **Compressed Sparse Attention (CSA)** compress context 4:1, select top-K blocks — keeps O(N) cost
- **Heavily Compressed Attention (HCA)** compress context 128:1 — gives broad coverage at near-zero incremental cost
- Layers alternate between these modes, keeping memory low while maintaining recall across massive documents

### 14.3 Fixed Compute → Adaptive Thinking

In an MLP, every input passes through the same layers at the same cost. V4-Flash scales compute dynamically by query type:

| Query Type | Compute Budget | Example |
|------------|---------------|---------|
| Simple | 1× (no loop) | "What is the capital of France?" |
| Complex reasoning | 2–4× loop | Multi-step math, logic puzzles |
| Code generation | 1.5–3× loop | LeetCode hard, system design |
| Verification | 1.5× loop | Self-check first draft |

### 14.4 Summary

| Dimension | MLP (from ml.md) | V4-Flash |
|-----------|------------------|----------|
| Connectivity | Fully connected (every neuron fires per input) | MoE (6 of 256 experts active per token) |
| Memory | None — processes input in isolation | Hybrid attention (CSA+HCA), 1M-token context |
| Compute cost | Fixed and uniform per input | Adaptive — scales with reasoning difficulty |
| Training | Same backpropagation + gradient descent | Same backpropagation, scaled to 32T tokens on H800 clusters |

Underneath these architectural leaps, the bedrock remains the same: activation functions for non-linearity, cross-entropy loss, and backpropagation to update billions of parameters.

---

## 15. Parameter Types in V4-Flash

V4-Flash's 284B parameters are not all the same — they are divided into three specialized types, each playing a different role:

### 15.1 Expert Parameters (The Knowledge Base)

The majority of the 284B parameters live here: 256 routed experts + 2 shared experts, each a small feed-forward network. They store domain knowledge — one expert specialized for Python code, another for conversational tone, another for mathematical reasoning. Only 8 of 256 routed experts activate per token (plus the 2 shared experts), selected by the router.

### 15.2 Attention Parameters (The Context & Memory)

Unlike experts, these parameters activate for every token. They compute relationships between words — how "it" links to a noun mentioned three paragraphs ago. V4-Flash compresses these via MLA (low-rank KV projection) and sparse attention (CSA, HCA) so they can handle 1M-token context without exhausting memory.

### 15.3 Router Parameters (The Gatekeeper)

A tiny set of parameters at the entrance of each MoE layer. They analyze each incoming token and compute which 6 of 256 experts are the best match. Despite their small size, they control the entire efficiency gain of the MoE architecture.

### 15.4 Mixed Precision Storage

Different parameter types use different numerical precision to balance quality against memory. V4-Flash uses FP4 Quantization-Aware Training (QAT) for expert weights and the indexer QK path:

| Parameter Type | Precision | Purpose |
|---------------|-----------|---------|
| Attention | FP8 | Higher precision preserves context quality |
| Router / gate | FP8 | Preserves routing accuracy |
| Expert weights | FP4 (QAT) | Aggressive compression; experts tolerate lower precision |
| Indexer QK path | FP4 (QAT) | Sparse attention scoring tolerates lower precision |
| Embeddings | FP8 | Vocabulary table needs good precision for token disambiguation |

This mixed-precision scheme is what makes the model "Flash" — the giant expert pool is compressed to 4 bits via QAT, fitting 284B parameters reduced memory footprint so the model can run on fewer GPUs.

---

## References

1. DeepSeek-AI. "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model." arXiv:2405.04434, May 2024.
2. DeepSeek-AI. "DeepSeek-V3 Technical Report." arXiv:2412.19437, Dec 2024.
3. DeepSeek-AI. "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning." arXiv:2501.12948, Jan 2025.
4. DeepSeek-AI. "DeepSeek-V4: Towards Highly Efficient Million-Token Context Intelligence." arXiv:2606.19348, Apr 2026.
5. Shao, Zhihong, et al. "DeepSeek-Math: Pushing the Limits of Mathematical Reasoning." arXiv:2402.03300, 2024.
6. Dai, Damai, et al. "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models." arXiv:2401.06066, 2024.
7. Xie et al. "Manifold-Constrained Hyper-Connections." 2026.
8. Vaswani, Ashish, et al. "Attention Is All You Need." NeurIPS 2017.
9. Su, Jianlin, et al. "RoFormer: Enhanced Transformer with Rotary Position Embedding." arXiv:2104.09864, 2021.
10. Ainslie, Joshua, et al. "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints." EMNLP 2023.
11. Touvron, Hugo, et al. "Llama 2: Open Foundation and Fine-Tuned Chat Models." arXiv:2307.09288, 2023.
12. Schulman, John, et al. "Proximal Policy Optimization Algorithms." arXiv:1707.06347, 2017.
13. Jordan et al. "Muon: An Optimizer for Gradient Compression." 2024.
14. Liu et al. "Scalable Muon Optimization for Large Language Models." 2025.
