---
title: "DeepSeek V4-Flash"
aliases: []
tags: [ml, ai, deepseek]
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

---

## 1. Introduction & Context

### 1.1 The Transformer Bottleneck

A vanilla Transformer costs O(N²) per layer — every token attends to every other token. At 128K context, that's 16 billion attention computations per layer. For a 284-billion-parameter model, the naive approach is not merely expensive; it is infeasible. The KV cache alone would demand terabytes of high-bandwidth memory per request.

DeepSeek V4-Flash solves this through a three-part strategy:

1. **Compress** — reduce what you store (MLA compresses KV cache 10-20x)
2. **Route** — activate only what you need (MoE keeps 10-20% of params active per token)
3. **Prune** — skip irrelevant computation (sparse attention, auxiliary-loss-free load balancing)

The result: a 284B-parameter model with per-token cost closer to a 30B dense model.

### 1.2 DeepSeek Lineage

| Generation | Total Params | Active Params | Key Innovations | Training Tokens |
|---|---|---|---|---|
| DeepSeek 67B (V1) | 67B | 67B (dense) | Baseline dense model | — |
| DeepSeek-V2 (May 2024) | 236B | 21B | MLA, DeepSeekMoE, GRPO | 8.1T |
| DeepSeek-V3 (Dec 2024) | 671B | 37B | Aux-loss-free load balancing, MTP, FP8 training, DualPipe | 14.8T |
| DeepSeek-R1 (Jan 2025) | 671B | 37B | Long CoT reasoning, reinforcement learning from reasoning traces | — |
| **DeepSeek V4-Flash** | **284B** | **~30B** | Hybrid attention (SWA+CSA+HCA), Lightning Indexer, Attention Sinks | 14.8T |

Sources: [DeepSeek-V2, arXiv:2405.04434], [DeepSeek-V3, arXiv:2412.19437], [DeepSeek-R1, arXiv:2501.12948]

V4-Flash is not strictly a larger model than V3. The "Flash" designation signals a shift in design philosophy: smarter allocation of compute per token rather than more parameters. Where V3 maximized total capacity (671B params), V4-Flash optimizes for inference efficiency — fewer total parameters (284B) but more aggressive attention sparsity and better hardware utilization.

### 1.3 Design Philosophy

V4-Flash's architecture rests on four axioms:

1. **Attention must be sub-quadratic.** Not merely optimized, but structurally incapable of O(N²) cost.
2. **Most parameters should stay silent.** Each token needs specialists, not generalists. MoE is not optional.
3. **Computation and communication must overlap.** The GPU should never wait for data.
4. **Precision is a lever, not a ceiling.** FP8 during training, FP8 during inference — bit-width is a resource to allocate, not a constraint to accept.

### 1.4 Document Structure

- **Sections 2-9** — Model architecture: specification, MLA, attention composition, MoE, MTP, GRPO, data pipeline, FP8 training.
- **Sections 10-13** — Infrastructure and serving: inference-time compute, DualPipe parallelism, custom kernels, serving architecture, benchmarks.

---

## 2. Model Specification

### 2.1 Architecture Parameters

| Parameter | Value | Notes |
|---|---|---|
| Total parameters | 284B | Down from V3's 671B |
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

| Attention Type | Layers | Window/Compression | Tokens Attended |
|---|---|---|---|
| Sliding Window Attention (SWA) | 1-24 | W=128 | 128 nearest neighbors |
| Compressed Sparse Attention (CSA) | 25-52 | 4:1 compression, Top-K=512 | ~2048 blocks → 512 selected |
| Heavily Compressed Attention (HCA) | 53-60 | 128:1 compression, dense | ~8192 super-blocks |
| Full MLA (no sparsity) | 61-67 | None | All tokens (short context) |

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
| Supervised Fine-Tuning | 1.5M conversational sessions | Standard cross-entropy |
| Reasoning distillation | DeepSeek-R1 long-CoT traces | SFT on reasoning traces with reflection patterns |
| Reinforcement Learning | Rule-based + model-based rewards | GRPO (G=8 groups per prompt) |

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

**During inference**, every (k_{j,i}, v_{j,i}) for all past tokens must be cached — that's **2 · n_h · d_h** elements per token per layer. For V4-Flash with n_h=64, d_h=128, and 67 layers: 2 × 64 × 128 × 67 = **1,097,728 elements per token** (~4.2 MB at FP16). At 256K context: **~1 TB of KV cache**.

### 3.2 Low-Rank KV Joint Compression

MLA's core insight: the keys and values live in a high-dimensional space (d_h·n_h = 8192) but their intrinsic dimensionality is much lower. Instead of storing full K and V, MLA projects them into a shared latent space and reconstructs on the fly.

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

Both K and V are reconstructed from the same compressed vector c_t^{KV}. The KV cache is therefore just **d_c** elements per token per layer.

**KV cache comparison:**

| Mechanism | Cache per token per layer | At 256K context, 67 layers |
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
| Cache at 256K (67 layers) | ~1 TB | ~134 GB | ~17 GB | **~66 GB** |
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

## 4. Attention Composition Across Layers

V4-Flash assigns each layer a specific attention role based on depth, mixing Sliding Window Attention (SWA), Compressed Sparse Attention (CSA), and Heavily Compressed Attention (HCA). All three sit on top of the MLA foundation.

### 4.1 The Locality-to-Globality Principle

| Layer Range | Attention Type | Effective Window | Cost per Token |
|---|---|---|---|
| 1-24 | SWA (Sliding Window) | 128 tokens | O(W) = O(128) |
| 25-52 | CSA (Compressed Sparse) | 4:1 compression, Top-K=512 | O(C·K) = O(2048) |
| 53-60 | HCA (Heavily Compressed) | 128:1 compression, dense | O(N/128) |
| 61-67 | Full MLA | All tokens (short ctx) | O(N) |

### 4.2 Sliding Window Attention (SWA) — Layers 1-24

SWA restricts each token to attend to at most W=128 neighboring tokens. Nearly all syntactic dependencies fall within a 50-token window. The MLA key-value cache only needs to keep the most recent W tokens' c^{KV} and k^R vectors.

**Cost:** O(N·W) = O(128N). At 256K context: ~33M operations per layer vs ~66B for full attention.

### 4.3 Compressed Sparse Attention (CSA) — Layers 25-52

CSA combines compression with sparse selection.

**Step 1: Sequence compression (4:1).** The input sequence is divided into blocks of 4 tokens. Each block is averaged to produce a single block representation.

**Step 2: Lightning Indexer — Top-K block selection.** A lightweight scoring network evaluates each compressed block and assigns a relevance score for the current query. It selects the Top-K most relevant blocks (K=512 by default).

**Step 3: Attend to selected blocks.** Total tokens attended: K × 4 = 2048.

**Cost:** CSA is O(C·K) where C=4 and K=512. At 256K context: ~9M operations vs 66B for full attention.

### 4.4 Heavily Compressed Attention (HCA) — Layers 53-60

HCA pushes compression to 128:1. The sequence is divided into super-blocks of 128 tokens each. Unlike CSA, HCA attends to all compressed blocks densely.

**Cost:** O(N/128). At 256K context: N/128 = 2048 super-blocks → ~2M operations.

### 4.5 Attention Sinks

Specialized [SINK] tokens are inserted every 1024 tokens during training. The model learns to dump stale context into these sinks. During inference, when the KV cache exceeds a threshold, the oldest non-sink entries are evicted. The sinks remain, preserving the rough state of discarded context.

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
    scores = LightningIndexer(blocks, query_t)
    selected = top_k(scores, K=512)
    attend to tokens in selected blocks only

Layer 53-60 (HCA+MLA):
  for each position t:
    c^{KV}_t = W_{DKV} · x_t
    super_blocks = compress sequence 128:1
    attend to all super_blocks

Layer 61-67 (Full MLA):
  if N < 8192: full self-attention
  else: fall back to HCA
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

Active parameters per token: ~147M per MoE layer × 67 layers = ~9.8B active FFN + ~6B attention + ~14B embedding/other = **~30B active per token**.

---

## 6. Multi-Token Prediction (MTP)

Standard language models predict one token at a time. MTP predicts three future tokens simultaneously (tₙ₊₁, tₙ₊₂, tₙ₊₃). The model must commit to a syntactic and semantic arc before it sees the next word.

### 6.1 MTP Modules

D independent prediction heads (D=3), each a transformer block:

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

Total corpus: 14.8T tokens.

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

## 9. FP8 Mixed Precision Training

### 9.1 The FP8 Challenge

| Format | Exponent bits | Mantissa bits | Range | Precision |
|---|---|---|---|---|
| E4M3 | 4 | 3 | ±448 | 2⁻² ≈ 0.25 |
| E5M2 | 5 | 2 | ±57344 | 2⁻¹ ≈ 0.5 |

E4M3 for weights and activations, E5M2 for gradients.

### 9.2 Block-Wise Quantization

```
For each 128-element block:
  1. Find absmax of block.
  2. Compute scale_factor = absmax / max_representable(E4M3).
  3. Quantize: x_q = round(x / scale_factor).
  4. Store: x_q (FP8) + scale_factor (FP32) per block.
```

Overhead: 4 bytes per 128 elements = 3.125%.

### 9.3 Mixed Precision Framework

| Component | Storage Precision | Compute Precision |
|---|---|---|
| Weights (master copy) | FP32 | — |
| Weights (forward) | FP8 (E4M3) | FP8 |
| Activations (forward) | FP8 (E4M3) | FP8 |
| Gradients | FP16 (master) + FP8 (communication) | FP8 |
| Optimizer states (Adam) | FP32 | FP32 |
| Attention softmax | — | FP32 (always) |

### 9.4 Online Quantization

Scale factors computed from actual tensor values each iteration (not from calibration data). Handles distribution shifts during training.

### 9.5 Memory Savings

| Component | BF16 Training | FP8 Training | Savings |
|---|---|---|---|
| Weights (forward) | 2 bytes/param | 1 byte/param | 50% |
| Activations (per token) | ~10 MB | ~5 MB | 50% |
| Optimizer states | 8 bytes/param | 8 bytes/param | 0% |
| **Total per GPU (284B, EP)** | ~78 GB | ~52 GB | **33%** |

---

## 10. Inference-Time Compute (Test-Time Scaling)

The same model, given more time to "think," can outperform a larger model answering immediately. V4-Flash implements a think-loop at the architecture level.

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

### 11.1 DualPipe: Computation-Communication Overlap

Standard pipeline parallelism wastes 30-50% of compute in pipeline bubbles. DualPipe schedules two independent micro-batches simultaneously — one going forward, one going backward.

**The problem with standard 1F1B:**

```
GPU 0: [F0][F1][B1][B0] ... (idle between F0 and F1)
GPU 1:      [F0][F1][B1][B0] ... (idle between F1 and B1)
```

Bubble ratio ≈ (P-1)/(P+1). For P=4: 60%.

**DualPipe scheduling:**

```
GPU 0: [F_A0][F_B0][B_A1][B_B1][F_A2][F_B2] ...
GPU 1:      [F_A0][F_B0][B_A1][B_B1][F_A2] ...
```

**Computation-communication overlap:**

```
Timeline for one GPU:

Compute:  [ FFN_F(A) ][ ATTN_F(A) ][ FFN_B(A) ][ ATTN_B(A) ]
Comm:     [<-- all2all A -->]              [<-- all2all A -->]
Overlap:  ^^^^^ backward of B runs during all2all A ^^^^^
```

**Pipeline configuration:**

| Parameter | Value |
|---|---|
| Micro-batches per pipeline | 16 |
| Pipeline stages per node | 4 |
| Total pipeline depth | 256 |
| Bubble ratio (standard 1F1B) | ~39% |
| Bubble ratio (DualPipe) | **<5%** |

### 11.2 Cross-Node All-to-All Communication

Custom kernel combining InfiniBand and NVLink bandwidth:
- Packs small expert dispatch messages into larger IB packets.
- Double buffering: one buffer sends while the other fills.
- Prioritizes NVLink for intra-node experts.

### 11.3 Memory Optimization

**Recomputation:** RMSNorm and MLA up-projection recomputed during backward pass. Saves ~3 GB per GPU at ~5% extra compute.

**CPU offloading:** EMA of weights in CPU RAM, synced periodically.

**Weight sharing:** Embedding and output head share the same matrix. Saves ~0.9B parameters.

**Peak memory per GPU:** ~75 GB (out of 80 GB H800). No tensor parallelism needed.

### 11.4 FlashMLA (Custom Attention Kernel)

Optimized for MLA's KV-cache access pattern:
- KV cache layout: [batch, seq_len, d_c] (not [batch, heads, seq_len, head_dim])
- Fused up-project + attend: load c^{KV}, up-project a tile, compute partial attention, accumulate
- RoPE fusion: decoupled RoPE applied during tile load
- Shared memory tiling: c^{KV} (512 elements) fits in fast shared memory

### 11.5 DeepGEMM (Custom MoE Kernel)

Optimized for small, irregular MoE matrices:
- Grouped GEMM: all experts in one kernel launch
- Warp specialization: load, compute, write
- Dynamic tile scheduling for SM utilization balance
- FP8 tensor core utilization without intermediate FP16 conversion

**Performance:** ~2.5× vs cuBLAS on MLA kernels, ~3× on MoE grouped GEMM.

---

## 12. Inference Serving Architecture

### 12.1 Model Distribution

284B parameters in FP8 = 284 GB. With 256 experts across 512 GPUs:

| Component | Memory (FP8) | Where |
|---|---|---|
| Shared experts (2) | ~28 MB | Every GPU (replicated) |
| Routed experts (256) | ~3.6 GB per expert | Distributed across 512 GPUs |
| Attention weights (67 layers) | ~1.2 GB | Every GPU (replicated) |
| Embedding + output | ~0.9 GB | Every GPU |
| **Total per GPU** | **~4.5 GB (weights) + ~2 GB (KV cache)** | |

### 12.2 Prefill vs Decode

**Prefill:** Process entire prompt in parallel. Full MLA attention. Batch multiple prompts.

**Decode:** One token at a time. MLA's compressed KV cache (512 elements per token) keeps memory low. Expert dispatch routes to the 8 GPUs hosting selected experts.

### 12.3 Expert Dynamic Loading

- Hot experts (~50, accounting for 80% of routing) stay in GPU memory.
- Cold experts loaded on-demand from CPU RAM or SSD.
- Prefetch: router predicts next token's expert selection and starts loading before needed.

### 12.4 KV Cache Management

- At 128K context: 576 × 128K × 67 ≈ 4.9 GB per request (FP16).
- At 256K context: 9.8 GB per request.
- With 512 GPUs, 32 concurrent requests at 128K: ~307 MB per GPU.

Memory-efficient prefix caching: shared KV cache for common prefixes.

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

| Metric | DeepSeek-V3 (671B) | V4-Flash (284B, estimated) |
|---|---|---|
| KV cache per token (FP16) | ~10 KB | ~1.1 KB |
| Active params per token | 37B | ~30B |
| Max throughput (H800-8) | ~2,200 tok/s | ~3,500 tok/s |
| Time to first token (128K prompt) | ~4.5s | ~1.8s |

---

## References

1. DeepSeek-AI. "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model." arXiv:2405.04434, May 2024.
2. DeepSeek-AI. "DeepSeek-V3 Technical Report." arXiv:2412.19437, Dec 2024.
3. DeepSeek-AI. "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning." arXiv:2501.12948, Jan 2025.
4. Shao, Zhihong, et al. "DeepSeek-Math: Pushing the Limits of Mathematical Reasoning." arXiv:2402.03300, 2024.
5. Dai, Damai, et al. "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models." arXiv:2401.06066, 2024.
6. Vaswani, Ashish, et al. "Attention Is All You Need." NeurIPS 2017.
7. Su, Jianlin, et al. "RoFormer: Enhanced Transformer with Rotary Position Embedding." arXiv:2104.09864, 2021.
8. Ainslie, Joshua, et al. "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints." EMNLP 2023.
9. Touvron, Hugo, et al. "Llama 2: Open Foundation and Fine-Tuned Chat Models." arXiv:2307.09288, 2023.
10. Schulman, John, et al. "Proximal Policy Optimization Algorithms." arXiv:1707.06347, 2017.
