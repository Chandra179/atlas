---
tags: [ml, ai, infrastructure]
audience: Engineers choosing a serving engine for LLM deployment. Knows vLLM basics from ai-infra.md.
style: Reference + Comparison
prerequisites:
  - ai/ai-infra.md
  - ai/ml.md
---

# LLM Inference Engines

The inference engine you pick determines your throughput, latency, hardware compatibility, and operational complexity. vLLM is the default for a reason — but it's not always the best choice. This file compares the six major engines and when to pick each.

> **Prerequisites**: [`ai-infra.md`](ai-infra.md) — vLLM startup, cold start anatomy, continuous batching, prefix caching. [`ml.md`](ml.md) — model architectures, Transformer attention.

---

## Overview

| Engine | Maintainer | Key Innovation | Best For | GPU Required |
|---|---|---|---|---|
| **vLLM** [^1] | UC Berkeley / community | PagedAttention, continuous batching | Production serving, broad model support | Yes |
| **SGLang** [^2] | Stanford / community | RadixAttention, structured generation | Low-latency serving, structured outputs | Yes |
| **TensorRT-LLM** [^3] | NVIDIA | Kernel fusion, inflight batching | Max throughput on NVIDIA hardware | NVIDIA only |
| **TGI** (Text Gen Inf.) [^4] | HuggingFace | Deep HF integration, watermarking | Quick setup from HF Hub | Yes |
| **Ollama** [^5] | Community | One-command local serving, built-in model library | Local dev, demos, CPU+GPU hybrid | Optional (CPU works) |
| **llama.cpp** [^6] | Community | CPU-first, GGUF quantization | CPU inference, edge, laptop | No |

---

## vLLM

The current standard for production LLM serving. Its key innovation is **PagedAttention** — managing the KV cache in non-contiguous pages, similar to virtual memory in operating systems. This eliminates fragmentation and enables near-optimal memory utilization.

**What it does well:**
- Broadest model support of any engine (500+ architectures via HF integration).
- Continuous batching with iteration-level scheduling.
- Automatic Prefix Caching (APC) for shared-prompt workloads.
- Multi-GPU support (TP, PP, DP) with minimal config.
- OpenAI-compatible API (`/v1/chat/completions`, `/v1/embeddings`).
- GPU Memory Snapshots (Modal) for sub-30s cold starts.
- Active development: releases every 2-3 weeks.

**Where it falls short:**
- Python-based scheduling overhead — SGLang and TRT-LLM have lower scheduling latency.
- No structured generation (constrained decoding) built-in — relies on outlines/lm-format-enforcer integrations.
- Guided decoding (JSON mode, regex) is less mature than SGLang.
- Memory overhead from Python runtime (~1-2 GiB).

**See [`ai-infra.md`](ai-infra.md) for deep-dive coverage of vLLM startup, cold starts, and configuration.**

---

## SGLang

Stanford's Structured Generation Language. Built on many of the same ideas as vLLM (PagedAttention, continuous batching) but with a faster scheduler, built-in structured generation, and a domain-specific language for composing LLM calls.

**What it does well:**
- **RadixAttention**: a tree-based prefix cache that handles branching prefixes (different completions from the same prompt) — more general than vLLM's linear prefix cache. Critical for multi-turn chat trees and best-of-N sampling.
- **Structured generation**: first-class support for JSON, regex, grammar-constrained decoding. Faster than vLLM + outlines for constrained generation.
- **Lower scheduling latency**: C++ scheduler yields 5-15% lower latency than vLLM at high concurrency.
- **SGLang DSL**: compose multi-call LLM workflows (chain calls, parallel calls, branching) as Python programs that are optimized by the runtime.

**Where it falls short:**
- Smaller model support library than vLLM (catches up quickly but lags by months).
- Less documentation and community than vLLM.
- Newer project — fewer production war stories, less battle-tested edge case handling.
- Modal integration less mature than vLLM.

**When to pick SGLang over vLLM:**
- Structured generation is critical (JSON mode, function calling, grammar-constrained outputs).
- You have branching prefix patterns (multi-turn chat trees, sampling multiple completions from the same prompt).
- You need every last ms of latency reduction and are willing to trade community stability for it.

---

## TensorRT-LLM (NVIDIA)

NVIDIA's inference engine. The fastest engine on NVIDIA hardware — period. Achieved through deep kernel fusion (combining multiple operations into a single GPU kernel) and inflight batching (a more aggressive form of continuous batching that reorders scheduled operations for cache efficiency).

**What it does well:**
- **Best throughput on NVIDIA GPUs**: 10-30% faster than vLLM on H100 for most model architectures.
- **Kernel fusion**: merges attention, MLP, layernorm, and residual operations into single GPU kernels — fewer kernel launches, less memory bandwidth waste.
- **FP8 native support**: hardware-accelerated FP8 on H100/H200 with near-zero accuracy loss.
- **Multi-node inference**: supports tensor + pipeline parallelism across GPU nodes (DGX, HGX).

**Where it falls short:**
- **Complex setup**: requires model conversion to TRT-LLM format (build engine from HF checkpoint → compile → optimize). Hours of preparation vs. vLLM's zero-config startup.
- **NVIDIA-only**: no AMD, no CPU, no Apple Silicon.
- **Model support lag**: new architectures arrive on vLLM/HF weeks before TRT-LLM.
- **Closed ecosystem**: harder to debug, profile, or extend than open-source Python engines.
- **Not serverless-friendly**: engine compilation step doesn't fit Modal's on-demand container model well.

**When to pick TensorRT-LLM over vLLM:**
- You're running a dedicated GPU cluster (not serverless) and can absorb the build time.
- Every percentage point of throughput matters (high-traffic production).
- You're on H100/H200 and want native FP8 performance.

---

## TGI (Text Generation Inference)

HuggingFace's inference server. Tightest integration with the HuggingFace Hub — one command to serve any model on the Hub.

**What it does well:**
- **Zero-config from Hub**: `docker run ghcr.io/huggingface/text-generation-inference --model-id <model>` — no flag hunting.
- **Safetensors + weight streaming**: downloads and loads weights in parallel, reducing cold start.
- **Built-in watermarking**: probabilistic watermarking of generated text for provenance.
- **Guidance/constrained decoding**: built-in grammar support.
- **HuggingFace Inference Endpoints**: managed serving with TGI under the hood.

**Where it falls short:**
- **Performance**: generally 10-20% lower throughput than vLLM on equivalent configs.
- **Model support**: HF Hub models only — no custom architectures without conversion.
- **Multi-GPU**: supported but less mature than vLLM or TRT-LLM.
- **Less active development**: slower release cadence, fewer contributors.

**When to pick TGI over vLLM:**
- You're prototyping directly from HF Hub and want zero-config serving.
- You need built-in watermarking.
- You're using HuggingFace Inference Endpoints (TGI is the default backend).

---

## Ollama

One-command local LLM serving: `ollama run llama3`. Built on llama.cpp, wraps it with a user-friendly CLI, model library, and REST API.

**What it does well:**
- **Easiest setup**: `curl -fsSL https://ollama.com/install.sh | sh`, then `ollama run <model>`. Zero config.
- **Built-in model library**: curated, quantized GGUF models — no HuggingFace account needed.
- **CPU+GPU hybrid**: automatically offloads layers to GPU if available, runs remaining on CPU.
- **Local-first**: everything runs on your machine. No cloud, no API keys.
- **REST API**: OpenAI-compatible (`/api/chat`, `/api/generate`).

**Where it falls short:**
- **Performance**: CPU inference is 10-100× slower than GPU. GPU offloading helps but doesn't match vLLM.
- **No continuous batching**: limited concurrency, poor multi-user throughput.
- **GGUF-only**: tied to llama.cpp's quantization ecosystem. No AWQ, no GPTQ, no FP8.
- **Limited production features**: no Prometheus metrics, no prefix caching, no speculative decoding, minimal multi-GPU.

**When to pick Ollama over vLLM:**
- Local dev and testing: run a model on your laptop to test prompts before deploying to Modal.
- Demos and hackathons: zero-setup serving on any machine.
- CPU inference or low-resource edge deployment.
- **Not for production** — use vLLM/SGLang/TensorRT-LLM for anything facing real users.

---

## llama.cpp

The engine that made local LLM inference possible. Pure C/C++ with minimal dependencies. Runs on CPU, GPU (CUDA, Metal, Vulkan, ROCm), and hybrid.

**What it does well:**
- **Runs anywhere**: CPU-only inference on a laptop, Raspberry Pi, or server.
- **GGUF quantization**: the most flexible quantization ecosystem — K-quants, I-quants, arbitrary bit widths.
- **Minimal dependencies**: single binary. No Python, no Docker, no CUDA toolkit needed.
- **Memory-mapped loading**: model weights are mmap'd — multiple processes share the same weights in RAM.
- **Hardware diversity**: supports CUDA, Metal (Apple Silicon), Vulkan (AMD), ROCm, SYCL (Intel).

**Where it falls short:**
- **Performance on GPU**: no continuous batching, no PagedAttention — throughput is 5-20× lower than vLLM on the same GPU.
- **Limited concurrency**: designed for single-user or few-user scenarios.
- **No production server**: the built-in server mode is bare-bones. Use Ollama (wraps llama.cpp) or llama-cpp-python for HTTP serving.
- **Development velocity**: improvements are steady but slower than vLLM/SGLang.

**When to pick llama.cpp over vLLM:**
- CPU-only inference (server without GPU, Raspberry Pi, Chromebook).
- Apple Silicon: Metal backend on M1/M2/M3 gives respectable performance with GGUF models.
- Embedding tasks on CPU: running a small embedding model (BGE, GTE) on CPU is viable for low-throughput use.
- You need the bleeding edge of GGUF quantization (K-quants, I-quants, TENSOR_SPLIT).

---

## Decision Table

| Scenario | Best Engine | Runner-Up | Reason |
|---|---|---|---|
| Production API, broad model support | **vLLM** | SGLang | Mature, most docs, Modal integration, 500+ models |
| Structured generation (JSON/grammar) | **SGLang** | vLLM + outlines | RadixAttention + first-class constrained decoding |
| Max GPU throughput, dedicated cluster | **TensorRT-LLM** | vLLM | Kernel fusion, inflight batching, FP8 native |
| Quick prototype from HF Hub | **TGI** | Ollama | `--model-id` and you're serving |
| Local dev / laptop testing | **Ollama** | llama.cpp | Easiest setup, built-in model library |
| CPU inference / edge | **llama.cpp** | Ollama | Runs on anything, no GPU needed |
| Apple Silicon (M1/M2/M3) | **llama.cpp** (Metal) | Ollama | Native Metal backend |
| Serverless (Modal) | **vLLM** | SGLang | GPU snapshots, Modal-first docs, volumes |
| Embedding model serving | **vLLM** or TEI | SGLang | vLLM's embeddings endpoint is mature. TEI (HuggingFace's Text Embeddings Inference) is purpose-built if you only do embeddings. |
| MoE models (Mixtral, DeepSeek-V3) | **vLLM** or SGLang | TensorRT-LLM | Expert parallelism handled automatically |

---

## Key Things

- vLLM is the safest default: broadest model support, best Modal integration, most production stories. Start here unless you have a specific reason not to.
- SGLang is vLLM's strongest competitor — faster scheduling, better structured generation. Worth evaluating if those matter.
- TensorRT-LLM has the highest ceiling but the highest floor — only worth the complexity when throughput is the binding constraint and you control the hardware.
- Ollama and llama.cpp are for local/dev use — not for production serverless deployments facing real users.
- Engine migration cost is low: all support the OpenAI API format. Switching from vLLM to SGLang means changing a URL, not rewriting your application.
- Continuous batching is table stakes for production — any engine without it (Ollama, llama.cpp) is not suitable for multi-user serving.

---

## References

[^1]: Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," SOSP 2023. [arXiv:2309.06180](https://arxiv.org/abs/2309.06180)
[^2]: Zheng et al., "SGLang: Efficient Execution of Structured Language Model Programs," NeurIPS 2024. [arXiv:2312.07104](https://arxiv.org/abs/2312.07104)
[^3]: NVIDIA TensorRT-LLM. [github.com/NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)
[^4]: HuggingFace Text Generation Inference. [github.com/huggingface/text-generation-inference](https://github.com/huggingface/text-generation-inference)
[^5]: Ollama. [ollama.com](https://ollama.com)
[^6]: llama.cpp. [github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)
