---
tags: [ml, ai, infrastructure]
audience: Engineers deploying LLMs on GPU infrastructure. Knows basic ML concepts from ml.md.
style: Deep dive + Reference
prerequisites:
  - ai/ml.md
  - ai/ai-infra.md
---

# Quantization for LLM Deployment

**Why this matters**: A 70B-parameter model at FP16 precision needs ~140 GiB of GPU memory — more than any single consumer GPU. Quantize it to 4-bit, and it fits on an RTX 4090 (24 GiB). Quantization is the primary knob for trading precision for deployment cost.

> **Prerequisites**: [`ml.md`](ml.md) — model architectures, training vs inference. [`ai-infra.md`](ai-infra.md) — model serving on GPUs, vLLM startup.

---

## How Quantization Works

Quantization reduces the numerical precision of model weights (and optionally activations) from 16-bit floating point (FP16/BF16) down to 8-bit, 4-bit, or even 2-bit integers. Fewer bits per weight = less memory and faster computation.

**Weight-only quantization**: only model weights are quantized. Activations (intermediate values during inference) stay in FP16/BF16. This is the most common approach — it captures the bulk of memory savings while preserving accuracy well.

**Weight + activation quantization (W8A8, W4A8)**: both weights and activations are quantized. Saves memory bandwidth for activations during inference but causes larger accuracy drops. Less common, mostly used on hardware with native INT8 matrix multiplication (e.g., H100 FP8).

### Precision Levels

| Format | Bits per weight | Memory (70B model) | Fits On |
|---|---|---|---|
| FP32 | 32 | ~280 GiB | A100 80GB × 4 |
| FP16/BF16 | 16 | ~140 GiB | H200, A100 80GB × 2 |
| INT8 | 8 | ~70 GiB | A100 80GB × 1 |
| INT4 | 4 | ~35 GiB | RTX 4090 (24 GiB) with offloading |
| INT4 + groupsize 128 | ~4.5 | ~39 GiB | L40S (48 GiB) |
| INT2 | 2 | ~17.5 GiB | RTX 3090 (24 GiB) — significant quality loss |

> Lower bits = more aggressive compression. Below 4-bit, quality degrades steeply. 4-bit with groupsize 128 is the practical sweet spot for most models.

---

## Quantization Formats

### Post-Training Quantization (PTQ)

Applied to a pre-trained model without additional training. Fast, no training data needed. The dominant approach for deployment.

### Quantization-Aware Training (QAT)

Simulates quantization noise during training so the model learns to compensate. Better accuracy than PTQ but requires full training pipeline. Used when every fraction of a percentage point matters.

| Format | Type | Bits | Groupsize | Accuracy vs FP16 | Ecosystem |
|---|---|---|---|---|---|
| **AWQ** [^1] | PTQ | 4 | 128 | ~1% degradation on MMLU | vLLM, TGI, TensorRT-LLM |
| **GPTQ** [^2] | PTQ | 4, 8 | 128 | ~1% degradation | vLLM, TGI, ExLlamaV2 |
| **bitsandbytes (NF4)** [^3] | PTQ | 4 | 64 (fixed) | ~0.5% degradation | HuggingFace transformers, local loading |
| **GGUF** [^4] | PTQ | 2-8 | Varies | K-quant: ~0.5%. Q4_0: ~2% | llama.cpp, Ollama, LM Studio |
| **FP8** [^5] | PTQ | 8 | — | Negligible (<0.1%) | vLLM, TensorRT-LLM (H100/H200 only) |
| **INT8** | PTQ | 8 | Per-channel | ~0.1% | vLLM, TGI, ONNX Runtime |
| **AQLM** [^6] | PTQ | 2 | Additive quantization | ~3-5% | Limited — research format |

### Key Terms

- **Groupsize**: number of weights that share a scaling factor. Smaller groupsize = more scaling factors = better accuracy but higher memory overhead. Groupsize 128 = one float16 scale per 128 weights. Groupsize 32 = higher accuracy, ~2% more memory.
- **Symmetric vs asymmetric**: symmetric centers values around zero (range [-127, 127]). Asymmetric uses the full range ([0, 255]) — higher accuracy, slightly more complex dequantization.
- **Per-channel vs per-tensor**: per-channel assigns a separate scale factor to each output channel (row of a weight matrix). Per-tensor uses one scale for the whole matrix. Per-channel is standard for weight quantization.

---

## When to Use Each Format

| If You Need... | Use | Because |
|---|---|---|
| Fastest setup, HuggingFace integration | bitsandbytes (NF4) | `load_in_4bit=True`, one line of code. Good for prototyping and single-user deployments. |
| Production serving throughput | AWQ or GPTQ | Kernel-fused dequantization. 2-3× faster than bitsandbytes at batch inference. |
| CPU inference / local laptop | GGUF | Runs on CPU with llama.cpp. No GPU required. Offloads layers to GPU if available. |
| Max accuracy with memory savings | FP8 (on H100) | Near-zero quality loss. Hardware-native. The best option if your GPU supports it. |
| Extreme compression (2-bit) | AQLM or GGUF IQ-quants | Specialized formats. Quality loss is significant — benchmark before committing. |
| Mixed-precision fine-tuning | QLoRA (bitsandbytes NF4) | Fine-tuning adapters on 4-bit base model. See [`fine-tuning.md`](fine-tuning.md). |

---

## Accuracy Impact

Quantization quality is measured by perplexity on a held-out text corpus (e.g., WikiText-2, C4). Lower perplexity = better accuracy.

| Format | Llama-3 70B Perplexity (WikiText-2) | Quality Delta |
|---|---|---|
| BF16 (reference) | 3.92 | — |
| FP8 | 3.93 | -0.01 (negligible) |
| AWQ 4-bit g128 | 4.05 | -0.13 |
| GPTQ 4-bit g128 | 4.07 | -0.15 |
| bitsandbytes NF4 | 4.03 | -0.11 |
| GGUF Q4_K_M | 4.15 | -0.23 |
| GGUF Q2_K | 6.84 | -2.92 |

> Numbers are illustrative — actual values depend on model, dataset, and calibration. Always benchmark your specific model and workload. 4-bit formats typically lose 1-3% on benchmark scores (MMLU, GSM8K) — acceptable for most chat and summarization tasks. 2-bit is reserved for when memory is the hard constraint and quality is secondary.

**When quality loss matters:**
- Coding tasks (HumanEval, SWE-bench): 4-bit loss is noticeable (~3-5% drop on pass@1).
- Math reasoning (GSM8K): mixed — some models degrade, others hold.
- Creative writing: quality loss is least noticeable in open-ended generation.
- Classification / extraction: near-zero loss even at 4-bit.

---

## vLLM Quantization Support

```bash
# AWQ 4-bit
vllm serve TheBloke/Llama-3-8B-AWQ --quantization awq

# GPTQ 4-bit
vllm serve TheBloke/Llama-3-8B-GPTQ --quantization gptq

# FP8 (H100/H200 only)
vllm serve neuralmagic/Llama-3-8B-FP8 --quantization fp8

# bitsandbytes (least performant in vLLM, better in transformers)
vllm serve meta-llama/Llama-3-8B --quantization bitsandbytes --load-format bitsandbytes
```

vLLM handles dequantization automatically — no code changes to your application. The `--quantization` flag selects the format. Models must be pre-quantized (download quantized weights from HuggingFace) — vLLM does not quantize on the fly.

**Performance note:** AWQ and GPTQ use fused dequantization kernels that overlap dequant with matrix multiplication. bitsandbytes uses a separate dequant step — lower throughput in vLLM. For production serving, prefer AWQ or GPTQ over bitsandbytes.

---

## Choosing a Quantized Model on HuggingFace

1. Search for `<model>-AWQ` or `<model>-GPTQ` (e.g., `Llama-3-8B-AWQ`).
2. Check the model card for group size (128 is standard), dataset used for calibration (WikiText vs. pile — minor impact), and reported perplexity.
3. Verify vLLM compatibility with `--quantization` flag. Most AWQ/GPTQ models are compatible.
4. GPU memory: budget 4 GiB overhead (KV cache, CUDA graphs) on top of quantized weight size.

---

## Key Things

- 4-bit quantization is the sweet spot: ~75% memory reduction with 1-3% quality loss.
- AWQ and GPTQ are the production formats — fused dequant kernels for throughput. bitsandbytes is for prototyping and QLoRA fine-tuning.
- FP8 on H100/H200 is near-lossless — use it if your hardware supports it.
- Groupsize 128 is standard; smaller groupsizes (32, 64) trade memory for accuracy.
- Quantization preserves training (FP32/BF16) precision for accumulations — only weights are stored in low precision, computations happen in higher precision.
- Always benchmark on your specific task. Degradation varies by model, format, and use case. Creative writing tolerates 4-bit well; coding tasks lose more.

---

## References

[^1]: Lin et al., "AWQ: Activation-aware Weight Quantization for On-Device LLM Compression and Acceleration," MLSys 2024. [arXiv:2306.00978](https://arxiv.org/abs/2306.00978)
[^2]: Frantar et al., "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers," ICLR 2023. [arXiv:2210.17323](https://arxiv.org/abs/2210.17323)
[^3]: Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs," NeurIPS 2023. [arXiv:2305.14314](https://arxiv.org/abs/2305.14314)
[^4]: GGUF format. [github.com/ggerganov/ggml/blob/master/docs/gguf.md](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)
[^5]: Micikevicius et al., "FP8 Formats for Deep Learning," arXiv 2022. [arXiv:2209.05433](https://arxiv.org/abs/2209.05433)
[^6]: Egiazarian et al., "Extreme Compression of Large Language Models via Additive Quantization," ICML 2024. [arXiv:2401.06118](https://arxiv.org/abs/2401.06118)
