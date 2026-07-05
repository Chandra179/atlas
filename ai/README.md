# AI/ML Knowledge Map

Suggested reading order. Each file lists its prerequisites — follow this chain.

## Foundation (read first)

| Order | File               | What you'll learn                                                                                                                                                | Prerequisites            |
| ----- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1     | [`neural-network-fundamentals.md`](neural-network-fundamentals.md)   | Neurons, activation functions, gradient descent, backpropagation, training pipeline, optimizers, overfitting, transfer learning, scaling laws, alignment         | Calculus, linear algebra |

## How Models Generate Text

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 2 | [`transformer-inference.md`](transformer-inference.md) | Transformer architecture (attention, QKV, multi-head, layer flow), autoregressive decoding, KV cache, tokenization, softmax/temperature | `neural-network-fundamentals.md` |

## Core Competencies

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 3 | [`evaluation.md`](llm/evaluation.md) | Perplexity, generation metrics, LLM-as-Judge, Elo ratings, benchmark suite, human evaluation | `neural-network-fundamentals.md` |
| 4 | [`embeddings.md`](embeddings.md) | Embedding models, similarity measures, dimensionality tradeoffs, vector DBs, code/image/multimodal embeddings | `neural-network-fundamentals.md` |

## Deployment & Optimization

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 5 | [`quantization.md`](llm/quantization.md) | Quantization math (affine formula, calibration, group size), formats (AWQ, GPTQ, GGUF, FP8), accuracy impact, vLLM support | `neural-network-fundamentals.md` |
| 6 | [`fine-tuning.md`](llm/fine-tuning.md) | LoRA, QLoRA, PEFT methods, dataset curation, hyperparameters, Axolotl/Unsloth/TRL workflow | `neural-network-fundamentals.md` |
| 7 | [`llm-deployment.md`](llm/llm-deployment.md) | vLLM, continuous batching, PagedAttention, prefix caching, speculative decoding, parallelism strategies, HuggingFace Hub | `neural-network-fundamentals.md` |
| 8 | [`inference-engines.md`](llm/inference-engines.md) | vLLM vs SGLang vs TensorRT-LLM vs TGI vs Ollama vs llama.cpp — comparison and decision guide | `llm-deployment.md` |
| 9 | [`modal-gemma4-h200.md`](modal-gemma4-h200.md) | Concrete deployment on Modal + H200: cold starts, GPU memory snapshots, vLLM config, cost model | `llm/llm-deployment.md` |

## Advanced Architecture

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 10 | [`deepseek-v4-flash.md`](deepseek-v4-flash.md) | MLA (Multi-Head Latent Attention), hybrid attention (SWA/CSA/HCA), DeepSeekMoE, MTP, GRPO, FP8 training, DualPipe, FlashMLA, DeepGEMM, serving architecture, benchmarks | `neural-network-fundamentals.md`, `transformer-inference.md` |

## Directory

```
ai/
├── README.md                 ← this file (learning path)
├── INDEX.md                  ← searchable topic index
├── _template.md              ← template for new files (with contribution guidelines)
├── diagrams/                 ← architecture diagrams
├── neural-network-fundamentals.md  Neural network fundamentals
├── transformer-inference.md  Transformer architecture + inference
├── embeddings.md             Embedding models, similarity, vector databases
├── modal-gemma4-h200.md      Gemma 4 on Modal deployment case study
├── deepseek-v4-flash.md      DeepSeek V4-Flash (architecture + infra + benchmarks)
├── llm/                      LLM-specific content
│   ├── llm-deployment.md    vLLM & deployment infrastructure
│   ├── evaluation.md         Model evaluation & benchmarks
│   ├── fine-tuning.md        Fine-tuning practical guide
│   ├── inference-engines.md  Inference engine comparison
│   └── quantization.md       Quantization algorithm & formats
```

## Contributing

See `_template.md` for full contribution guidelines.

Quick rules:
- **New topic?** Create a new file with standardized frontmatter (copy `_template.md`).
- **File >400 lines?** Consider splitting into subtopics.
- **Cross-references?** Use relative paths: `[neural-network-fundamentals.md](neural-network-fundamentals.md)`, `[quantization.md](llm/quantization.md)`.
- **Diagrams?** Store in `diagrams/` directory.
- **Updated INDEX.md?** Keep the topic index in sync when adding or renaming files.
