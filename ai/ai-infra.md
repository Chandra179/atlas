---
tags: [ml, ai, infrastructure]
audience: Engineers deploying LLMs on serverless GPUs. Python basics assumed.
style: Reference
prerequisites:
 - ai/ml.md
---

# AI Infrastructure Learnings

This document covers general concepts for deploying large language models (LLMs) on serverless GPU infrastructure using **vLLM**.

The overall system has three pieces:

- **Modal** the serverless GPU platform that provisions hardware and manages containers. See [`modal-gemma4-h200.md`](modal-gemma4-h200.md) for a full deployment case study.
- **vLLM** an open-source library that serves LLMs. It loads model weights into GPU memory, manages the key-value cache, handles request batching, and generates text.
- **HuggingFace Hub** a model repository where pre-trained weights are stored and downloaded.

> **Who this is for** Engineers deploying LLMs on serverless GPUs. Familiarity with Python assumed; no prior vLLM or GPU serving experience needed.
> **Prerequisites** Python basics. Start with the [`modal-gemma4-h200.md`](modal-gemma4-h200.md) case study for a concrete deployment walkthrough, then return here for deeper concepts.

---

## vLLM Deep Dive

The sections below cover vLLM internals. You do not need these to deploy, but they help with performance tuning and debugging.

### Continuous Batching

Static batching waits for all requests in a batch to finish before processing the next batch. One request generating 500 tokens holds up 7 other requests that finished at 10 tokens. Continuous batching solves this by swapping completed requests out and new requests in at every iteration.

vLLM uses **iteration-level scheduling**: at each forward pass, it fills the batch up to `max-num-batched-tokens` with tokens from the active request pool. When a request finishes generating (EOS token or `max_tokens`), its slot is freed immediately not at batch boundary.

| Batching Strategy | How It Works | Throughput | Tail Latency |
|---|---|---|---|
| Static batching | Fill batch, process all to completion, drain | Baseline | Worst one slow request blocks all |
| Continuous batching (vLLM, SGLang) | Swap finished requests out at every iteration | 2-10× vs static [^1] | Low |
| Inflight batching (TRT-LLM) | Continuous + scheduling reordering for efficiency | Slightly better than continuous | Lowest in class |

**Configuration knobs:**
- `--max-num-batched-tokens`: max tokens per forward pass (default 8192). Higher → more parallelism but more memory.
- `--max-num-seqs`: max concurrent sequences. Caps parallel requests regardless of token count per request.
- Chunked prefill (`--enable-chunked-prefill`): splits long prompts into chunks so prefill doesn't starve decode.

Continuous batching reduces the "straggler effect" one long generation no longer blocks all other requests. Throughput improvement is biggest under high concurrency with mixed-length generations. `max-num-batched-tokens` is the primary tuning knob set it to the largest value your GPU memory allows after reserving space for model weights and KV cache.

[^1]: Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention" (vLLM paper), SOSP 2023. [arXiv:2309.06180](https://arxiv.org/abs/2309.06180)

### Observability & Metrics

Without metrics, you don't know if your model is performing well, if it's close to OOM, or if a deployment change made things worse. vLLM exposes a Prometheus endpoint and logs key statistics.

vLLM serves metrics at `/metrics` in Prometheus format. Enable periodic stats logging with `VLLM_LOG_STATS_INTERVAL=N` (seconds between reports to stdout).

| Metric | What It Measures | Why It Matters |
|---|---|---|
| **TTFT** (Time to First Token) | Latency from request arrival to first token | User-perceived responsiveness. <500ms for chat, <2s for batch. |
| **TPOT** (Time per Output Token) | Average latency between consecutive tokens | Reading fluency. <50ms is comfortable. Spikes → queue pressure. |
| **ITL** (Inter-Token Latency) | Max gap between tokens within a request | Detects stragglers per-request. |
| **Throughput** (tok/s) | Total tokens generated per second | Capacity planning. Drop under load → add GPUs or reduce `max-model-len`. |
| **Queue time** | Time request waited before processing | Overload signal. Growing queue → scale out or rate-limit. |
| **KV cache usage (%)** | Fraction of allocated KV cache in use | Memory pressure. >90% → requests may be preempted or rejected. |
| **Running/Swapped/Waiting** | Count of requests in each scheduling state | Running: active. Waiting: queued. Swapped: preempted (memory pressure). |

**When to alert:**
- TTFT p99 > 2× p50 → queue saturation. Scale or rate-limit.
- KV cache usage > 90% sustained → reduce `max-model-len` or add GPU memory.
- Preemptions (swapped requests) > 0 → memory pressure. Lower `max-num-seqs` or `gpu-memory-utilization`.
- Generation throughput < 50% of benchmark → backend regression or hardware issue.

[^2]: vLLM metrics. [docs.vllm.ai/en/latest/serving/metrics](https://docs.vllm.ai/en/latest/serving/metrics)

### Prefix Caching

Many workloads share a common prefix a system prompt, few-shot examples, or shared conversation history. Without prefix caching, the model recomputes the KV cache for this prefix on every request, wasting GPU compute and delaying responses.

vLLM implements **Automatic Prefix Caching (APC)** [^3]: it hashes KV cache blocks by their token sequence and checks whether a block already exists before computing it. If a prefix of the new request matches a cached prefix, those blocks are reused only the divergent suffix is computed fresh.

Enable with: `--enable-prefix-caching`

| Workload | Prefix Shared? | Cache Hit Rate | Speedup |
|---|---|---|---|
| Chat with long system prompt | System prompt identical per request | 80-95% of prompt tokens | 2-5× TTFT reduction |
| RAG with shared context | Retrieved documents form shared prefix | 50-80% with similar queries | 1.5-3× TTFT reduction |
| Few-shot with examples in prompt | Examples repeated per request | High | 2-4× TTFT reduction |
| Unique prompts (creative writing) | Each prompt is different | ~0% | No benefit |

**Tradeoffs:**
- Memory overhead: ~5-10% of KV cache allocation for the hash table tracking cached blocks.
- Eviction: cached blocks are evicted LRU-style when KV cache is full. Under memory pressure, APC competes with active requests for space.
- Block granularity: vLLM's block size (default 16 tokens) is the minimum cacheable unit. Prefixes shorter than 16 tokens are not cached.
- Hash computation cost: negligible per-token but adds up on very long prefixes.

**When to skip:** unique, non-repeating prompts; extremely memory-constrained deployments; prefixes shorter than 16 tokens.

[^3]: vLLM Automatic Prefix Caching. [docs.vllm.ai/en/latest/automatic_prefix_caching](https://docs.vllm.ai/en/latest/automatic_prefix_caching)

### Speculative Decoding

Autoregressive decoding generates one token per forward pass. Each forward pass reads all model weights from GPU memory weight bandwidth, not compute, is the bottleneck. Speculative decoding produces multiple tokens per forward pass by using a small draft model to guess ahead, then verifying with a single target model pass.

**How it works [^4]:**
1. A small **draft model** (e.g., 0.5B params) generates K candidate tokens cheaply.
2. The **target model** runs a single forward pass on the concatenated (prefix + K candidates) sequence to verify.
3. Accepted tokens are appended. The first rejected token is resampled from the target's distribution.
4. Repeat.

| Draft Quality | Acceptance Rate | Effective Speedup |
|---|---|---|
| Same model family, small draft → large target | 70-85% | 2-4× throughput |
| Different architecture | 40-60% | 1.2-1.5× (marginal) |
| No draft (baseline) | N/A | 1× (one token per pass) |

**Memory cost:** the draft model adds its own weight memory (~1-2 GiB for a 0.5B model). Negligible on high-memory GPUs; may not fit on memory-constrained GPUs.

**vLLM support:** `--speculative-model <model-id>` and `--num-speculative-tokens <K>`. Draft and target must share the tokenizer. vLLM also supports **ngram speculative decoding** (uses previously generated tokens as candidates no separate draft model needed) and **Medusa heads** (additional prediction heads trained on the target model).

**When to use:** latency-bound workloads (TTFT improvement via parallel prefill verification), throughput-bound workloads (higher tokens-per-pass), or small-batch single-user scenarios (ngram/Medusa avoids draft memory). Skip if memory-constrained or draft model acceptance <50%.

[^4]: Leviathan et al., "Fast Inference from Transformers via Speculative Decoding," ICML 2023. [arXiv:2211.17192](https://arxiv.org/abs/2211.17192)

---

## Serving Embedding Models

Embedding model serving is fundamentally different from generative model serving and simpler. No KV cache, no CUDA graphs, no speculative decoding. But different optimizations apply.

**Differences from generative serving:**
- **No autoregressive decoding**: embeddings are a single forward pass. No KV cache needed.
- **Higher throughput**: orders of magnitude faster than generation on the same hardware.
- **Smaller models**: embedding models (BGE, E5, GTE) are typically 100M-7B params. Fit on cheaper GPUs (L4, T4).
- **Pooling step**: after the forward pass, mean/CLS/last-token pooling converts token embeddings to a single vector.

**vLLM embedding endpoint:** vLLM serves embeddings via the `/v1/embeddings` endpoint (OpenAI-compatible). Set `--task embed`. Continuous batching is not needed (no autoregressive loop) static batching works at high throughput.

| Model Type | Relative Throughput | GPU Memory |
|---|---|---|
| Embedding (BGE-M3, ~567M) | ~900× generation | ~2 GiB |
| Generation (large LLM) | Baseline | 10-100+ GiB + KV cache |

For production embedding serving, a mid-range GPU handles thousands of requests per second. High-end generative GPUs are overkill for embeddings alone.

**See also:** [`ml.md`](ml.md) § Embeddings & Vector Representations — vector representations, similarity measures, training.

---

## HuggingFace Hub

Model weights must be downloaded before vLLM can serve them. HuggingFace Hub is the distribution point, and its access controls and download mechanics affect deployment reliability.

### Gated Models

Many popular models require an **accepted license agreement** on HuggingFace before access is granted. Without this, even a valid token returns 401/403.

### Token Access

- **Read access**: a HuggingFace token (`HF_TOKEN`) with READ scope is sufficient for downloading gated models.
- **Inference API**: requests require `Authorization: Bearer <token>` header. Tokens with only READ work for inference endpoints too.
- **Environment variables**: `HF_TOKEN` (auth), `HF_HUB_ENABLE_HF_TRANSFER=1` (fast downloads via hf_transfer Rust library). `HF_HOME` controls the cache directory.

### Model Identity

- Model IDs follow `org/model-name` format (e.g., `google/gemma-4-31b-it`).
- **Revisions**: optional branch/tag/commit hash pin. An invalid revision causes a 404 from the HF Hub. When in doubt, omit it and use the default (`main`).
- Checkpoint format: safetensors^[A safe file format for storing model weights. Unlike Python's pickle, safetensors cannot execute arbitrary code during loading, making it the standard for distributing models.] (one or more shards).

---

## Scaling Beyond a Single GPU

Single GPUs have hard limits. As models grow beyond available GPU memory, or as throughput demands increase, you need multiple GPUs.

### Tensor Parallelism (TP)

Splits individual weight matrices across GPUs. Each GPU holds a shard of each layer. Forward pass: GPUs communicate via all-reduce to combine partial results. **Latency-focused** all GPUs work on the same request.

- `--tensor-parallel-size=N`: split across N GPUs.
- Requires high-bandwidth interconnect (NVLink, NVSwitch). Over PCIe, communication dominates.
- Best for: fitting a model that doesn't fit on one GPU. Beyond 4 GPUs, communication overhead erodes gains.

### Pipeline Parallelism (PP)

Splits the model into sequential layer stages, each on a different GPU. GPU 0 handles layers 1-10, GPU 1 handles 11-20, etc. Forward pass pipelines through stages. **Throughput-focused** processes micro-batches while earlier stages work on the next.

- `--pipeline-parallel-size=N`
- Lower bandwidth requirement than TP (sends only activations at stage boundaries).
- Almost always combined with TP (3D parallelism) for production.

### Data Parallelism (DP)

Replicates the full model on each GPU, shards the request stream. No communication during inference. **Throughput scaling**.

- Run multiple vLLM instances (one per GPU) behind a load balancer.
- Best for: high throughput when individual requests fit on one GPU.

### Expert Parallelism (EP)

For MoE models: each GPU holds a subset of experts. Tokens routed to the GPU hosting the relevant expert. Reduces per-GPU memory since each GPU holds only 1/N of the experts. vLLM handles EP automatically for MoE architectures.

### Choosing a Strategy

| Goal | Strategy | vLLM Flag | Best When |
|---|---|---|---|
| Fit a large model | TP | `--tensor-parallel-size=N` | Single model > GPU memory, low latency needed |
| Max throughput | DP (multi-instance) | Run N instances + LB | Model fits per GPU, many concurrent users |
| Both (3D parallelism) | TP + PP + DP | Combine flags | Largest models (70B+), production scale |
| MoE models | EP (automatic) | None needed | Mixtral, DeepSeek-V3, etc. |

[^5]: Narayanan et al., "Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM," SC 2021. [arXiv:2104.04473](https://arxiv.org/abs/2104.04473)

---

## Jargon Quick Reference

| Term | What It Is |
|------|------------|
| **CUDA graphs** | Pre-recorded sequences of GPU operations (kernel launches) that replay with near-zero CPU overhead makes each inference faster |
| **KV cache** | Key-Value cache stores intermediate attention states during text generation so previous tokens don't need reprocessing. Grows with sequence length and limits concurrency |
| **torch.compile** | PyTorch's JIT compiler that optimizes model operations into GPU-specific kernels the first run compiles, subsequent runs reuse the cached result |
| **Triton** | A GPU programming language by OpenAI vLLM uses it to write custom attention kernels optimized for the model's specific head dimensions |
| **safetensors** | A safe file format for storing model weight tensors that cannot execute arbitrary code during loading (unlike Python pickle) |
| **JIT compilation** | Just-in-time compilation GPU kernels are compiled the first time they are used, causing a latency spike. The compiled result is cached for future use |
| **AOT compilation** | Ahead-of-time compilation kernels are compiled before the model runs and cached, so the first inference does not pay a compilation penalty |
| **Chunked prefill** | Processing the input prompt in smaller chunks rather than all at once reduces peak GPU memory usage during the first pass through the prompt |
| **FlashInfer** | An optimized GPU library for sampling (top-p, top-k filtering) vLLM uses it for token selection, not for the attention mechanism |
| **Continuous batching** | Swapping completed requests out and new requests in at every forward pass iteration avoids one slow generation blocking all other requests |
| **Prefix caching** | Storing and reusing KV cache blocks for shared prompt prefixes (system prompts, few-shot examples) to skip redundant computation |
| **Speculative decoding** | Using a small draft model to guess ahead, then verifying with one target model pass produces 2-4× tokens per forward pass |
| **Tensor parallelism** | Splitting weight matrices across GPUs so each holds a shard fits models larger than single GPU memory |
| **Pipeline parallelism** | Splitting model layers into sequential stages across GPUs throughput-focused, lower communication than TP |
| **Data parallelism** | Replicating the model on each GPU, sharding requests scales throughput linearly without inference-time communication |
| **TTFT** | Time to First Token latency from request arrival to first token generated. User-perceived responsiveness metric |
| **TPOT** | Time per Output Token average latency between consecutive generated tokens. Reading fluency metric |

---

## References

[^1]: Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention" (vLLM paper), SOSP 2023. [arXiv:2309.06180](https://arxiv.org/abs/2309.06180).
[^2]: vLLM metrics. [docs.vllm.ai/en/latest/serving/metrics](https://docs.vllm.ai/en/latest/serving/metrics).
[^3]: vLLM Automatic Prefix Caching. [docs.vllm.ai/en/latest/automatic_prefix_caching](https://docs.vllm.ai/en/latest/automatic_prefix_caching).
[^4]: Leviathan et al., "Fast Inference from Transformers via Speculative Decoding," ICML 2023. [arXiv:2211.17192](https://arxiv.org/abs/2211.17192).
[^5]: Narayanan et al., "Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM," SC 2021. [arXiv:2104.04473](https://arxiv.org/abs/2104.04473).

### Further Reading
- [`modal-gemma4-h200.md`](modal-gemma4-h200.md) concrete deployment: Gemma 4 31B on H200 via Modal.
- [`ml.md`](ml.md) ML concepts and training infrastructure referenced by this file.
- [vLLM documentation](https://docs.vllm.ai) startup flags, CUDA graph profiling, model architecture.
- [HuggingFace Hub docs](https://huggingface.co/docs/hub/) token auth, gated models, model identity.
