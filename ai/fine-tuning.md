---
title: "Fine-Tuning Large Language Models"
aliases: []
tags: [ml, ai, deep-learning]
created: "2026-06-16"
---

# Fine-Tuning Large Language Models

> **Before reading**: understand the training pipeline, transfer learning, VRAM constraints, quantization, and QLoRA all covered in [Machine Learning](ml.md).

You've been prompting GPT-4 to classify customer support tickets: "urgent," "billing," "technical," "general." It works on 95% of tickets. But the other 5% tickets with unusual phrasing, edge-case topics, or mixed intent consistently misclassify. You've tried elaborate system prompts, few-shot examples, chain-of-thought. The edge cases persist.

This is when you fine-tune. Prompt engineering shifts the distribution; fine-tuning changes the model.

## When to Fine-Tune vs Prompt-Engineer

| Factor | Favor Prompt Engineering | Favor Fine-Tuning |
|--------|-------------------------|-------------------|
| Task complexity | Simple, well-defined | Nuanced, domain-specific |
| Latency requirements | Tougher model = better prompt | Smaller fine-tuned model beats big prompted model |
| Cost per inference | Big model pricing | Small model, many calls |
| Data availability | <10 examples | 50–1000+ examples |
| Need for constant iteration | Re-deploy prompts instantly | Train → evaluate → deploy cycle |
| Model behavior consistency | Varies with prompt phrasing | Consistent across phrasings |

Decision rule: start with prompt engineering. If you've hit diminishing returns after iterating on prompt design, collect the failure cases and fine-tune.

## Full Fine-Tuning

Full fine-tuning updates every parameter of the model. For a 7B model at FP16: 14 GB weights + 14 GB gradients + 28 GB optimizer states (Adam) = ~56 GB VRAM. For a 70B model: ~560 GB you need 8× H100s or a high-end cluster.

Full fine-tuning is the most expressive method every weight adapts. It's worth the cost when:
- You're adapting to a fundamentally different domain (code → medical knowledge).
- You have a large dataset (10K+ examples) and want maximum quality.
- You have the compute budget and the task justifies it.

For most practical use cases, parameter-efficient methods (next section) get you 95% of the quality at 10–30% of the VRAM cost.

## LoRA (Low-Rank Adaptation)

LoRA freezes the original model weights and inserts small trainable matrices ("adapters") into attention layers. Instead of updating a `d × d` weight matrix, LoRA learns two smaller matrices: `d × r` and `r × d`, where `r` (rank) is typically 8–64.

The math: original output is `h = W·x`. With LoRA: `h = W·x + (B·A)·x` where `A` is `r × d` and `B` is `d × r`. Only `A` and `B` are trained. The rank-r update captures the task-specific adaptation while the base model remains frozen.

**Practical numbers for a 7B model (FP16)**:
- Full fine-tuning: ~56 GB
- LoRA (r=16): ~15 GB (weights) + 2 GB (adapters) = ~17 GB fits on a single 24 GB consumer GPU

**Rank selection** Higher rank = more capacity to adapt, but diminishing returns. r=16 is a safe default. For simple tasks (binary classification), r=4–8 suffices. For complex generation (writing in a specific style), r=32–64 may help.

**Target modules** Apply LoRA to query and value projection matrices (`q_proj`, `v_proj`) as a minimum. Full attention (`q_proj`, `k_proj`, `v_proj`, `o_proj`) plus feed-forward layers gives best results but 2–3× more adapter params.

## QLoRA (Quantized LoRA)

QLoRA quantizes the base model to 4-bit (NF4 format) and adds LoRA adapters on top. The base model's 4-bit weights are dequantized to BF16 on the fly during the forward pass you never store the full-precision weights in memory.

**VRAM comparison for fine-tuning**:

| Model | Full FT (BF16) | LoRA (BF16) | QLoRA (4-bit, r=16) |
|-------|---------------|-------------|----------------------|
| LLaMA 3 7B | ~56 GB | ~17 GB | ~9 GB |
| LLaMA 3 13B | ~104 GB | ~28 GB | ~14 GB |
| LLaMA 3 34B | ~272 GB | ~60 GB | ~24 GB |
| LLaMA 3 70B | ~560 GB | ~120 GB | ~40 GB |

QLoRA on a 7B model fits on a $300 consumer GPU. QLoRA on a 70B model fits on a single A100 (80 GB). The quality gap between QLoRA and full fine-tuning is typically 0–3% on downstream task metrics negligible for most applications.

**Unsloth** Optimized CUDA kernels that speed up QLoRA training 2–4× and further reduce VRAM by fusing operations. Open-source, supports LLaMA, Mistral, and Phi families. If you're running QLoRA on consumer hardware, use Unsloth.

## Other PEFT Methods

| Method | Mechanism | VRAM vs Full | Quality vs Full | Best For |
|--------|-----------|-------------|-----------------|----------|
| **LoRA** | Low-rank adapters in attention | ~4× less | 95–98% | General fine-tuning |
| **QLoRA** | 4-bit base + LoRA | ~6× less | 93–97% | Consumer GPUs, cost-sensitive |
| **Prefix Tuning** | Learnable prefix vectors prepended to input | ~10× less | 85–92% | Very low VRAM, simple tasks |
| **Prompt Tuning** | Learnable soft prompts (no architecture change) | ~20× less | 80–90% | Multi-task serving, smallest delta |
| **IA3** | Learned scaling vectors on keys, values, FFN | ~10× less | 90–95% | Comparable to LoRA with fewer params |

LoRA is the safe default. QLoRA when VRAM-constrained. Prompt tuning when you need to serve dozens of task-specific variants from one base model (swap soft prompts, not adapters).

## Dataset Curation

Quality trumps quantity. The LIMA paper showed that 1,000 carefully curated examples can produce a fine-tune that matches models trained on 50× more data.

**Format** Each example should match your deployment prompt format exactly:

```
{"messages": [
 {"role": "system", "content": "You classify support tickets."},
 {"role": "user", "content": "My payment won't go through, I've tried 3 cards"},
 {"role": "assistant", "content": "billing"}
]}
```

**Size guidelines**:
- Classification: 50–200 examples of each class
- Structured extraction: 100–500 examples
- Instruct following: 500–1,000 diverse examples
- Style adaptation: 1,000–5,000 examples

**Quality checks**:
- De-duplicate: near-duplicate examples cause overfitting. Cosine-similarity check your training set.
- Balance classes: a 10:1 class imbalance → model learns to always predict the majority class.
- Include failures: the most valuable training examples are the ones your current prompt gets wrong.
- Audit for errors: a single mislabeled example in a 100-example dataset pollutes 1% of your training signal.

## Hyperparameters

| Parameter | Full Fine-Tuning | LoRA/QLoRA | Rationale |
|-----------|-----------------|------------|-----------|
| Learning rate | 1e-5 to 5e-5 | 1e-4 to 5e-4 | LoRA adapters start from zero, need higher LR to converge |
| Epochs | 1–3 | 2–5 | More epochs for LoRA since it's less expressive |
| Batch size | As large as VRAM allows (4–16) | 8–32 effective via gradient accumulation | Larger = more stable gradients |
| LR schedule | Cosine with warmup (10% of steps) | Cosine with warmup (10% of steps) | Warmup prevents early instability |
| Weight decay | 0.01–0.1 | 0.0–0.01 | LoRA barely regularizes; lower is fine |

**The golden rule for epochs**: for fine-tuning datasets under 1,000 examples, 1–3 epochs is almost always enough. Beyond that, the model transitions from generalizing to memorizing loss on training data keeps dropping while validation performance degrades silently.

**Validation during training**: log eval loss every N steps. Generate sample outputs on a held-out set and inspect them manually. A model with lower validation loss can still produce worse outputs the loss only measures next-token prediction, not task quality.

## Catastrophic Forgetting

Fine-tuning on a narrow task can overwrite general capabilities. The model becomes great at classifying support tickets but forgets how to summarize text or write code.

**Detection**: run a small benchmark (MMLU subset, HumanEval subset, or a custom eval) before and after fine-tuning. A >5% drop in general capabilities means catastrophic forgetting is happening.

**Mitigation**:
- **Data mixing**: add 5–10% general-domain examples to your fine-tuning dataset. The model stays anchored to its original distribution.
- **Lower learning rate**: 1e-5 instead of 5e-5 gentler updates preserve more of the base model.
- **Early stopping**: stop training the moment task accuracy plateaus, not when training loss reaches zero.
- **LoRA implicit regularization**: LoRA naturally resists catastrophic forgetting because it only updates a tiny fraction of parameters. This is an underappreciated advantage of PEFT methods.

## Practical Workflow

**Axolotl** YAML-config-based fine-tuning framework. Define model, dataset, LoRA rank, hyperparameters in a config file. Handles data formatting, distributed training, checkpointing. Good for reproducible experiments.

**Unsloth** Drop-in replacement for HuggingFace Transformers with optimized kernels. 2–4× faster QLoRA, lower VRAM. Use when iterating rapidly on consumer hardware.

**HuggingFace TRL** `SFTTrainer` for supervised fine-tuning, `DPOTrainer` for DPO, `PPOTrainer` for RLHF. The standard library for training loops. Works with Axolotl.

**Typical iteration cycle**: curate 50 examples → QLoRA with Unsloth (r=16, 2 epochs, ~10 minutes on a consumer GPU) → evaluate on held-out set → inspect failure cases → add 20 more examples targeting failures → retrain → repeat until plateau → increase dataset to 500 examples → run overnight with higher rank.

## Key Things

1. **Start with prompting, not fine-tuning.** Fine-tune only when prompt engineering has reached diminishing returns.
2. **QLoRA is the default.** For 95% of use cases, QLoRA on consumer hardware matches full fine-tuning quality. Reserve full FT for specialized domains with 10K+ examples.
3. **50 high-quality examples beat 500 noisy ones.** Curation time is the bottleneck, not GPU time. Audit every example.
4. **1–3 epochs max for datasets under 1,000 examples.** Beyond that you're memorizing, not generalizing.
5. **Validate beyond loss.** Generate sample outputs and inspect them. Loss can decrease while quality degrades.
6. **Test for catastrophic forgetting.** Run a small benchmark suite before and after every fine-tune. Add 5–10% general data if performance drops.
7. **LoRA rank 16 is the safe default.** Higher rank rarely helps for single-task fine-tuning. Lower rank can work for simple tasks.

## References

- LoRA: Hu et al., 2021 *LoRA: Low-Rank Adaptation of Large Language Models* [arXiv](https://arxiv.org/abs/2106.09685)
- QLoRA: Dettmers et al., 2023 *QLoRA: Efficient Finetuning of Quantized Language Models* [arXiv](https://arxiv.org/abs/2305.14314)
- LIMA: Zhou et al., 2023 *LIMA: Less Is More for Alignment* [arXiv](https://arxiv.org/abs/2305.11206)
- Unsloth: https://github.com/unslothai/unsloth
- Axolotl: https://github.com/axolotl-ai-cloud/axolotl
- TRL: https://github.com/huggingface/trl
- Prefix Tuning: Li & Liang, 2021 *Prefix-Tuning: Optimizing Continuous Prompts for Generation* [arXiv](https://arxiv.org/abs/2101.00190)
- Prompt Tuning: Lester et al., 2021 *The Power of Scale for Parameter-Efficient Prompt Tuning* [arXiv](https://arxiv.org/abs/2104.08691)
- IA3: Liu et al., 2022 *Few-Shot Parameter-Efficient Fine-Tuning is Better and Cheaper than In-Context Learning* [arXiv](https://arxiv.org/abs/2205.05638)
