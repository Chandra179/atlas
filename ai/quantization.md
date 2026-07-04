---
tags: [ml, ai, infrastructure, ml-infra]
audience: Engineers deploying LLMs on GPU infrastructure. Knows basic ML concepts from ml.md.
style: Deep dive + Reference
prerequisites:
 - ai/ml.md
 - ai/ai-infra.md
---

# Quantization for LLM Deployment

A 70B-parameter model at FP16 precision needs ~140 GiB of GPU memory more than any single consumer GPU. Quantize it to 4-bit, and it fits on an RTX 4090 (24 GiB). Quantization is the primary knob for trading precision for deployment cost.

> **Prerequisites**: [`ml.md`](ml.md) model architectures, training vs inference. [`ai-infra.md`](ai-infra.md) model serving on GPUs, vLLM startup.

---

## How Quantization Works

Quantization reduces the numerical precision of model weights (and optionally activations) from 16-bit floating point (FP16/BF16) down to 8-bit, 4-bit, or even 2-bit integers. Fewer bits per weight = less memory and faster computation.

**Weight-only quantization**: only model weights are quantized. Activations (intermediate values during inference) stay in FP16/BF16. This is the most common approach it captures the bulk of memory savings while preserving accuracy well.

**Weight + activation quantization (W8A8, W4A8)**: both weights and activations are quantized. Saves memory bandwidth for activations during inference but causes larger accuracy drops. Less common, mostly used on hardware with native INT8 matrix multiplication (e.g., H100 FP8).

### Precision Levels

| Format | Bits per weight | Memory (70B model) | Fits On |
|---|---|---|---|
| FP32 | 32 | ~280 GiB | A100 80GB × 4 |
| FP16/BF16 | 16 | ~140 GiB | H200, A100 80GB × 2 |
| INT8 | 8 | ~70 GiB | A100 80GB × 1 |
| INT4 | 4 | ~35 GiB | RTX 4090 (24 GiB) with offloading |
| INT4 + groupsize 128 | ~4.5 | ~39 GiB | L40S (48 GiB) |
| INT2 | 2 | ~17.5 GiB | RTX 3090 (24 GiB) significant quality loss |

> Lower bits = more aggressive compression. Below 4-bit, quality degrades steeply. 4-bit with groupsize 128 is the practical sweet spot for most models.

---

> **Skip to [Quantization Formats](#quantization-formats)** if you already understand the math and just need to pick a format for deployment.

## The Quantization Algorithm

### The Affine Formula

Every quantization scheme rests on one linear transformation:

```
x_q = round(x / scale)                          (symmetric)
x_q = round(x / scale) + zero_point             (asymmetric)
```

`x` is the original FP16 weight. `x_q` is the quantized integer — for INT4, that is one of 16 possible values (-8 to 7). `scale` maps the range between FP16 space and integer space. `zero_point` shifts the range for asymmetric distributions.

The model never computes with `x_q` directly — it **dequantizes** back to approximate FP16 on the fly:

```
x_approx = x_q × scale                          (symmetric)
x_approx = (x_q - zero_point) × scale           (asymmetric)
```

### A Worked Example

Take a tiny weight vector:

```
w = [0.42, -1.35, 0.08, 2.91]
```

**Step 1 — Compute the scale (absmax method).** For symmetric INT4, the quantized range is [-7, 7]:

```
max(|w|) = 2.91
Qmax (INT4) = 2^(4-1) - 1 = 7
scale = 2.91 / 7 = 0.416
```

**Step 2 — Quantize each weight:**

```
w_q[0] = round(0.42 / 0.416)   = round(1.01)  = 1
w_q[1] = round(-1.35 / 0.416)  = round(-3.25) = -3
w_q[2] = round(0.08 / 0.416)   = round(0.19)  = 0
w_q[3] = round(2.91 / 0.416)   = round(7.00)  = 7
```

Result: `w_q = [1, -3, 0, 7]` — 4 values × 4 bits = 16 bits, plus one FP16 scale (16 bits). Original: 4 × 16 = 64 bits. **4× compression.**

**Step 3 — Dequantize to see the error:**

```
w_approx[0] = 1 × 0.416   = 0.416
w_approx[1] = -3 × 0.416  = -1.248
w_approx[2] = 0 × 0.416   = 0.0
w_approx[3] = 7 × 0.416   = 2.912
```

| Original | Quantized | Dequantized | Error |
|---|---|---|---|
| 0.42 | 1 | 0.416 | -0.004 (1%) |
| -1.35 | -3 | -1.248 | +0.102 (7.6%) |
| 0.08 | 0 | 0.0 | -0.08 (100%) |
| 2.91 | 7 | 2.912 | +0.002 (0.1%) |

The small weight (0.08) lost all its value — it quantized to 0. The large weight (2.91) lost almost nothing. This asymmetry is why group size matters.

### How Scale Is Determined (Calibration)

The scale must be computed before quantizing. Three common methods:

| Method | Formula | Best For |
|---|---|---|
| **Absmax** | `scale = max(\|W\|) / Qmax` | Weights (symmetric around zero) |
| **Min-max** | `scale = (max - min) / (Qmax - Qmin)` | Activations (all-positive after ReLU) |
| **Percentile** | Uses the 99.9th percentile instead of absolute max | Data with outliers — clips extremes for better overall precision |

For weight-only quantization, no calibration pass is needed — the weight values are static. For activation quantization, a calibration dataset (a few hundred text samples) is run through the model to observe each layer's activation ranges.

### How Group Size Controls Error

A single scale for a whole 70B-parameter matrix would be useless — the weights span too wide a range. The solution: slice the weight matrix into groups and give each group its own scale.

| Group Size | Scales per 4096×4096 matrix | Memory Overhead | Error Profile |
|---|---|---|---|
| Full matrix | 1 | 0% | All weights share one scale — outliers corrupt every value |
| Per row (channel) | 4096 | 0.02% | Each row adapts to its own range |
| 128 weights | ~131K | ~3% | Standard sweet spot |
| 32 weights | ~524K | ~12% | Better for outlier-prone layers |

**Why groupsize 128 is standard:** Each FP16 scale adds 16 bits of overhead. With groupsize 128, that is 16 / (128 × 4) = 3.1% overhead — the scale is negligible compared to the data. Dropping to groupsize 32 quadruples the scales to ~12% overhead, which eats into the memory savings.

**Concrete comparison:**

| Scenario | Scale | Weight 0.01 | Weight 2.50 |
|---|---|---|---|
| Global scale | 2.50 / 7 = 0.357 | Quantizes to 0. Error = 100% | Quantizes to 7. Error ≈ 0% |
| Group scale (size 4) | 0.02 / 7 = 0.0029 | Quantizes to 3. Error = 13% | Quantizes to 7. Error ≈ 0% |

A small weight that would be erased by a global scale becomes representable with a local scale.

### Symmetric vs Asymmetric

| | Symmetric | Asymmetric |
|---|---|---|
| Formula | `x_q = round(x / scale)` | `x_q = round(x / scale) + zp` |
| Range | [-Qmax, Qmax] | [0, 255] for INT8 |
| Zero | Exactly representable | May map to any integer |
| Weights | Standard (cluster around zero) | Not needed |
| Activations | Wastes half the range | Better (all-positive after ReLU) |

Symmetric quantizes zero to zero exactly — important when zero-padding or masked positions appear. Asymmetric captures the full dynamic range for one-sided distributions.

### Where Dequantization Happens

Quantized weights never return to full FP16 storage — that would defeat the memory savings. Instead:

- **Hardware-native formats (INT8, FP8):** Tensor cores on H100 and RTX 4090 accept INT8 or FP8 inputs directly and accumulate into FP16/FP32. The dequantization is electrical — the circuit interprets the bits differently, no software overhead.

- **Software formats (INT4, INT2):** No GPU has INT4 tensor cores. The runtime loads INT4 weights, multiplies by the per-group scale, promotes to FP16, and feeds the result to FP16 tensor cores. This happens in a **fused dequantization kernel** that overlaps the conversion with the matrix multiply — the GPU does not stall.

- **FP8** is a true floating-point format, not integer quantization (see [`deepseek-v4-flash.md`](deepseek-v4-flash.md) §9 for E4M3 vs E5M2). H100 tensor cores accept FP8 natively — dequantization is free.

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
| **FP8** [^5] | PTQ | 8 | | Negligible (<0.1%) | vLLM, TensorRT-LLM (H100/H200 only) |
| **INT8** | PTQ | 8 | Per-channel | ~0.1% | vLLM, TGI, ONNX Runtime |
| **AQLM** [^6] | PTQ | 2 | Additive quantization | ~3-5% | Limited research format |

### Key Terms

- **Groupsize**: number of weights that share a scaling factor. Smaller groupsize = more scaling factors = better accuracy but higher memory overhead. Groupsize 128 = one float16 scale per 128 weights. Groupsize 32 = higher accuracy, ~2% more memory.
- **Symmetric vs asymmetric**: symmetric centers values around zero (range [-127, 127]). Asymmetric uses the full range ([0, 255]) higher accuracy, slightly more complex dequantization.
- **Per-channel vs per-tensor**: per-channel assigns a separate scale factor to each output channel (row of a weight matrix). Per-tensor uses one scale for the whole matrix. Per-channel is standard for weight quantization.

---

## When to Use Each Format

| If You Need... | Use | Because |
|---|---|---|
| Fastest setup, HuggingFace integration | bitsandbytes (NF4) | `load_in_4bit=True`, one line of code. Good for prototyping and single-user deployments. |
| Production serving throughput | AWQ or GPTQ | Kernel-fused dequantization. 2-3× faster than bitsandbytes at batch inference. |
| CPU inference / local laptop | GGUF | Runs on CPU with llama.cpp. No GPU required. Offloads layers to GPU if available. |
| Max accuracy with memory savings | FP8 (on H100) | Near-zero quality loss. Hardware-native. The best option if your GPU supports it. |
| Extreme compression (2-bit) | AQLM or GGUF IQ-quants | Specialized formats. Quality loss is significant benchmark before committing. |
| Mixed-precision fine-tuning | QLoRA (bitsandbytes NF4) | Fine-tuning adapters on 4-bit base model. See [`fine-tuning.md`](fine-tuning.md). |

---

## Accuracy Impact

Quantization quality is measured by perplexity on a held-out text corpus (e.g., WikiText-2, C4). Lower perplexity = better accuracy.

| Format | Llama-3 70B Perplexity (WikiText-2) | Quality Delta |
|---|---|---|
| BF16 (reference) | 3.92 | |
| FP8 | 3.93 | -0.01 (negligible) |
| AWQ 4-bit g128 | 4.05 | -0.13 |
| GPTQ 4-bit g128 | 4.07 | -0.15 |
| bitsandbytes NF4 | 4.03 | -0.11 |
| GGUF Q4_K_M | 4.15 | -0.23 |
| GGUF Q2_K | 6.84 | -2.92 |

> Numbers are illustrative actual values depend on model, dataset, and calibration. Always benchmark your specific model and workload. 4-bit formats typically lose 1-3% on benchmark scores (MMLU, GSM8K) acceptable for most chat and summarization tasks. 2-bit is reserved for when memory is the hard constraint and quality is secondary.

**When quality loss matters:**
- Coding tasks (HumanEval, SWE-bench): 4-bit loss is noticeable (~3-5% drop on pass@1).
- Math reasoning (GSM8K): mixed some models degrade, others hold.
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

vLLM handles dequantization automatically no code changes to your application. The `--quantization` flag selects the format. Models must be pre-quantized (download quantized weights from HuggingFace) vLLM does not quantize on the fly.

**Performance note:** AWQ and GPTQ use fused dequantization kernels that overlap dequant with matrix multiplication. bitsandbytes uses a separate dequant step lower throughput in vLLM. For production serving, prefer AWQ or GPTQ over bitsandbytes.

---

## Choosing a Quantized Model on HuggingFace

1. Search for `<model>-AWQ` or `<model>-GPTQ` (e.g., `Llama-3-8B-AWQ`).
2. Check the model card for group size (128 is standard), dataset used for calibration (WikiText vs. pile minor impact), and reported perplexity.
3. Verify vLLM compatibility with `--quantization` flag. Most AWQ/GPTQ models are compatible.
4. GPU memory: budget 4 GiB overhead (KV cache, CUDA graphs) on top of quantized weight size.

---

## Key Things

- 4-bit quantization is the sweet spot: ~75% memory reduction with 1-3% quality loss.
- AWQ and GPTQ are the production formats fused dequant kernels for throughput. bitsandbytes is for prototyping and QLoRA fine-tuning.
- FP8 on H100/H200 is near-lossless use it if your hardware supports it.
- Groupsize 128 is standard; smaller groupsizes (32, 64) trade memory for accuracy.
- Quantization preserves training (FP32/BF16) precision for accumulations only weights are stored in low precision, computations happen in higher precision.
- Always benchmark on your specific task. Degradation varies by model, format, and use case. Creative writing tolerates 4-bit well; coding tasks lose more.

---

## References

[^1]: Lin et al., "AWQ: Activation-aware Weight Quantization for On-Device LLM Compression and Acceleration," MLSys 2024. [arXiv:2306.00978](https://arxiv.org/abs/2306.00978)
[^2]: Frantar et al., "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers," ICLR 2023. [arXiv:2210.17323](https://arxiv.org/abs/2210.17323)
[^3]: Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs," NeurIPS 2023. [arXiv:2305.14314](https://arxiv.org/abs/2305.14314)
[^4]: GGUF format. [github.com/ggerganov/ggml/blob/master/docs/gguf.md](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)
[^5]: Micikevicius et al., "FP8 Formats for Deep Learning," arXiv 2022. [arXiv:2209.05433](https://arxiv.org/abs/2209.05433)
[^6]: Egiazarian et al., "Extreme Compression of Large Language Models via Additive Quantization," ICML 2024. [arXiv:2401.06118](https://arxiv.org/abs/2401.06118)
