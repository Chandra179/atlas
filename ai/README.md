# AI/ML Knowledge Map

Suggested reading order. Each file lists its prerequisites — follow this chain.

## Foundation (read first)

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 1 | [`ml.md`](ml.md) | Neurons, activation functions, gradient descent, backpropagation, training pipeline, optimizers, overfitting, transfer learning, scaling laws, alignment, prompting, **embeddings & vector representations**, **model evaluation & benchmarks** | Calculus, linear algebra |
| 2 | [`architectures.md`](architectures.md) | CNN, RNN/LSTM, Transformer (self-attention, multi-head, cross-attention), generative models (GANs, VAE, diffusion), Mixture of Experts, self-supervised learning | `ml.md` |

## How Models Generate Text

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 3 | [`transformer-inference.md`](transformer-inference.md) | Autoregressive decoding, KV cache, tokenization, softmax/temperature, positional encodings, FFN stack | `ml.md` |

## Deployment & Optimization

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 4 | [`quantization.md`](quantization.md) | Quantization math (affine formula, calibration, group size), formats (AWQ, GPTQ, GGUF, FP8), accuracy impact, vLLM support | `ml.md` |
| 5 | [`fine-tuning.md`](fine-tuning.md) | LoRA, QLoRA, PEFT methods, dataset curation, hyperparameters, Axolotl/Unsloth/TRL workflow | `ml.md` |
| 6 | [`ai-infra.md`](ai-infra.md) | vLLM, continuous batching, PagedAttention, prefix caching, speculative decoding, parallelism strategies, HuggingFace Hub | `ml.md` |
| 7 | [`inference-engines.md`](inference-engines.md) | vLLM vs SGLang vs TensorRT-LLM vs TGI vs Ollama vs llama.cpp — comparison and decision guide | `ai-infra.md` |
| 8 | [`modal-gemma4-h200.md`](modal-gemma4-h200.md) | Concrete deployment on Modal + H200: cold starts, GPU memory snapshots, vLLM config, cost model | `ai-infra.md` |

## Advanced Architecture

| Order | File | What you'll learn | Prerequisites |
|---|---|---|---|
| 9 | [`deepseek-v4-flash.md`](deepseek-v4-flash.md) | MLA (Multi-Head Latent Attention), hybrid attention (SWA/CSA/HCA), DeepSeekMoE, MTP, GRPO, FP8 training, DualPipe, FlashMLA, DeepGEMM, serving architecture, benchmarks | `ml.md`, `transformer-inference.md`, `architectures.md` |

## Directory

```
ai/
├── README.md                 ← this file (learning path)
├── ml.md                     ML fundamentals + embeddings + evaluation
├── architectures.md          Neural network architectures
├── transformer-inference.md  How Transformers generate text
├── quantization.md           Quantization algorithm & formats
├── fine-tuning.md            Fine-tuning practical guide
├── ai-infra.md               vLLM & deployment infrastructure
├── inference-engines.md      Inference engine comparison
├── modal-gemma4-h200.md      Gemma 4 on Modal deployment case study
├── deepseek-v4-flash.md      DeepSeek V4-Flash (architecture + infra + benchmarks)
```
