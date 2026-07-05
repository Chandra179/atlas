# AI/ML Knowledge Map

Suggested reading order. Each file lists its prerequisites — follow this chain.

## Foundation (read first)

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 1 | [`ml.md`](ml.md) | Neurons, activation functions, gradient descent, backpropagation, training pipeline, optimizers, overfitting, transfer learning, scaling laws, alignment, prompting | Calculus, linear algebra |
| 2 | `architectures.md` | CNN, RNN/LSTM, Transformer (self-attention, multi-head, cross-attention), generative models (GANs, VAE, diffusion), Mixture of Experts, self-supervised learning | `ml.md` |

## How Models Generate Text

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 3 | [`transformer-inference.md`](transformer-inference.md) | Autoregressive decoding, KV cache, tokenization, softmax/temperature, positional encodings, FFN stack | `ml.md`, `architectures.md` |

## Core Competencies

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 4 | [`evaluation.md`](evaluation.md) | Perplexity, generation metrics, LLM-as-Judge, Elo ratings, benchmark suite, human evaluation | `ml.md` |
| 5 | [`embeddings.md`](embeddings.md) | Embedding models, similarity measures, dimensionality tradeoffs, vector DBs, code/image/multimodal embeddings | `ml.md` |

## Deployment & Optimization

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 6 | [`quantization.md`](quantization.md) | Quantization math (affine formula, calibration, group size), formats (AWQ, GPTQ, GGUF, FP8), accuracy impact, vLLM support | `ml.md` |
| 7 | [`fine-tuning.md`](fine-tuning.md) | LoRA, QLoRA, PEFT methods, dataset curation, hyperparameters, Axolotl/Unsloth/TRL workflow | `ml.md` |
| 8 | [`ai-infra.md`](ai-infra.md) | vLLM, continuous batching, PagedAttention, prefix caching, speculative decoding, parallelism strategies, HuggingFace Hub | `ml.md` |
| 9 | [`inference-engines.md`](inference-engines.md) | vLLM vs SGLang vs TensorRT-LLM vs TGI vs Ollama vs llama.cpp — comparison and decision guide | `ai-infra.md` |
| 10 | [`modal-gemma4-h200.md`](modal-gemma4-h200.md) | Concrete deployment on Modal + H200: cold starts, GPU memory snapshots, vLLM config, cost model | `ai-infra.md` |

## Advanced Architecture

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 11 | [`deepseek-v4-flash.md`](deepseek-v4-flash.md) | MLA (Multi-Head Latent Attention), hybrid attention (SWA/CSA/HCA), DeepSeekMoE, MTP, GRPO, FP8 training, DualPipe, FlashMLA, DeepGEMM, serving architecture, benchmarks | `ml.md`, `transformer-inference.md`, `architectures.md` |

## Directory

```
ai/
├── README.md                 ← this file (learning path)
├── INDEX.md                  ← searchable topic index
├── _template.md              ← template for new files (with contribution guidelines)
├── diagrams/                 ← architecture diagrams
├── ml.md                     ML fundamentals
├── neural-network.md         Neural network
├── transformer-inference.md  How Transformers generate text
├── embeddings.md             Embedding models, similarity, vector databases
├── evaluation.md             Model evaluation & benchmarks
├── quantization.md           Quantization algorithm & formats
├── fine-tuning.md            Fine-tuning practical guide
├── ai-infra.md               vLLM & deployment infrastructure
├── inference-engines.md      Inference engine comparison
├── modal-gemma4-h200.md      Gemma 4 on Modal deployment case study
└── deepseek-v4-flash.md      DeepSeek V4-Flash (architecture + infra + benchmarks)
```

## Contributing

See `_template.md` for full contribution guidelines.

Quick rules:
- **New topic?** Create a new file with standardized frontmatter (copy `_template.md`).
- **File >400 lines?** Consider splitting into subtopics.
- **Cross-references?** Use relative paths: `[ml.md](ml.md)`, `[quantization.md](quantization.md)`.
- **Diagrams?** Store in `diagrams/` directory.
- **Updated INDEX.md?** Keep the topic index in sync when adding or renaming files.
