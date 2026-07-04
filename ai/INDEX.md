# AI Documentation Index

Auto-generated topic index for `ai/`. Each concept links to the files that cover it.

## Foundation

| Topic | Files |
|-------|-------|
| Activation functions | [ml.md](ml.md) |
| Backpropagation | [ml.md](ml.md) |
| Gradient descent / optimizers | [ml.md](ml.md) |
| Loss functions | [ml.md](ml.md) |
| Training pipeline | [ml.md](ml.md) |
| Overfitting / regularization | [ml.md](ml.md) |
| Bias-variance tradeoff | [ml.md](ml.md) |
| Scaling laws | [ml.md](ml.md) |
| Transfer learning | [ml.md](ml.md) |

## Architectures

| Topic | Files |
|-------|-------|
| CNN | [architectures.md](architectures.md) |
| RNN / LSTM | [architectures.md](architectures.md) |
| Transformer (general) | [architectures.md](architectures.md), [transformer-inference.md](transformer-inference.md) |
| Self-attention | [architectures.md](architectures.md), [transformer-inference.md](transformer-inference.md) |
| Multi-head attention | [architectures.md](architectures.md), [transformer-inference.md](transformer-inference.md) |
| Cross-attention | [architectures.md](architectures.md) |
| Mixture of Experts (MoE) | [architectures.md](architectures.md), [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| GANs | [architectures.md](architectures.md) |
| VAEs | [architectures.md](architectures.md) |
| Diffusion models | [architectures.md](architectures.md) |
| Self-supervised learning | [architectures.md](architectures.md) |
| Rotary Position Embedding (RoPE) | [deepseek-v4-flash.md](deepseek-v4-flash.md) |

## Transformer Inference

| Topic | Files |
|-------|-------|
| Autoregressive decoding | [transformer-inference.md](transformer-inference.md) |
| KV cache | [transformer-inference.md](transformer-inference.md), [ai-infra.md](ai-infra.md), [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Tokenization / BPE | [transformer-inference.md](transformer-inference.md) |
| Softmax / temperature | [transformer-inference.md](transformer-inference.md) |
| Positional encodings | [transformer-inference.md](transformer-inference.md) |
| Feed-forward networks | [transformer-inference.md](transformer-inference.md) |
| Vocabulary projection | [transformer-inference.md](transformer-inference.md) |

## Embeddings

| Topic | Files |
|-------|-------|
| Embedding models | [embeddings.md](embeddings.md) |
| Similarity measures (cosine, dot product, Euclidean) | [embeddings.md](embeddings.md) |
| Dimensionality tradeoffs | [embeddings.md](embeddings.md) |
| Matryoshka embeddings | [embeddings.md](embeddings.md) |
| Chunking strategies | [embeddings.md](embeddings.md) |
| Code / image / multimodal embeddings | [embeddings.md](embeddings.md) |
| Vector databases | [embeddings.md](embeddings.md) |

## Evaluation

| Topic | Files |
|-------|-------|
| Perplexity | [evaluation.md](evaluation.md) |
| BLEU / ROUGE / METEOR / BERTScore | [evaluation.md](evaluation.md) |
| LLM-as-Judge | [evaluation.md](evaluation.md) |
| MT-Bench | [evaluation.md](evaluation.md) |
| Chatbot Arena / Elo | [evaluation.md](evaluation.md) |
| MMLU / HumanEval / SWE-bench / GSM8K | [evaluation.md](evaluation.md) |
| Human evaluation | [evaluation.md](evaluation.md) |

## Fine-Tuning

| Topic | Files |
|-------|-------|
| Full fine-tuning | [fine-tuning.md](fine-tuning.md) |
| LoRA | [fine-tuning.md](fine-tuning.md) |
| QLoRA | [fine-tuning.md](fine-tuning.md) |
| PEFT methods (prefix tuning, prompt tuning, IA3) | [fine-tuning.md](fine-tuning.md) |
| Dataset curation | [fine-tuning.md](fine-tuning.md) |
| Hyperparameters | [fine-tuning.md](fine-tuning.md) |
| Catastrophic forgetting | [fine-tuning.md](fine-tuning.md) |
| Tools (Axolotl, Unsloth, TRL) | [fine-tuning.md](fine-tuning.md) |

## Quantization

| Topic | Files |
|-------|-------|
| Affine quantization formula | [quantization.md](quantization.md) |
| Calibration methods | [quantization.md](quantization.md) |
| Group size | [quantization.md](quantization.md) |
| Symmetric vs asymmetric | [quantization.md](quantization.md) |
| AWQ / GPTQ / GGUF / FP8 / NF4 | [quantization.md](quantization.md) |
| PTQ vs QAT | [quantization.md](quantization.md), [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| vLLM quantization support | [quantization.md](quantization.md) |

## Infrastructure & Serving

| Topic | Files |
|-------|-------|
| vLLM | [ai-infra.md](ai-infra.md), [modal-gemma4-h200.md](modal-gemma4-h200.md) |
| Continuous batching | [ai-infra.md](ai-infra.md) |
| PagedAttention | [ai-infra.md](ai-infra.md) |
| Prefix caching | [ai-infra.md](ai-infra.md) |
| Speculative decoding | [ai-infra.md](ai-infra.md) |
| Observability / metrics | [ai-infra.md](ai-infra.md) |
| Tensor / pipeline / data / expert parallelism | [ai-infra.md](ai-infra.md) |
| HuggingFace Hub (gated models, tokens) | [ai-infra.md](ai-infra.md) |
| Embedding model serving | [ai-infra.md](ai-infra.md) |

## Inference Engines

| Topic | Files |
|-------|-------|
| vLLM | [inference-engines.md](inference-engines.md), [ai-infra.md](ai-infra.md) |
| SGLang | [inference-engines.md](inference-engines.md) |
| TensorRT-LLM | [inference-engines.md](inference-engines.md) |
| TGI | [inference-engines.md](inference-engines.md) |
| Ollama | [inference-engines.md](inference-engines.md) |
| llama.cpp | [inference-engines.md](inference-engines.md) |
| Engine comparison / selection | [inference-engines.md](inference-engines.md) |

## Deployment Case Studies

| Topic | Files |
|-------|-------|
| Gemma 4 31B on Modal + H200 | [modal-gemma4-h200.md](modal-gemma4-h200.md) |
| Cold start optimization | [modal-gemma4-h200.md](modal-gemma4-h200.md) |
| GPU memory snapshots | [modal-gemma4-h200.md](modal-gemma4-h200.md) |
| Cost modeling | [modal-gemma4-h200.md](modal-gemma4-h200.md) |
| API security / rate limiting | [modal-gemma4-h200.md](modal-gemma4-h200.md) |

## Advanced Architecture (DeepSeek V4-Flash)

| Topic | Files |
|-------|-------|
| Multi-Head Latent Attention (MLA) | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Manifold-Constrained Hyper-Connections (mHC) | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| SWA / CSA / HCA hybrid attention | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| DeepSeekMoE (256 experts, auxiliary-loss-free) | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Multi-Token Prediction (MTP) | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| GRPO | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| FP4 QAT | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Contextual parallelism | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| TileLang custom kernels | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Inference serving architecture | [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Benchmarks | [deepseek-v4-flash.md](deepseek-v4-flash.md) |

## Cross-Cutting

| Topic | Files |
|-------|-------|
| Attention mechanisms | [architectures.md](architectures.md), [transformer-inference.md](transformer-inference.md), [deepseek-v4-flash.md](deepseek-v4-flash.md) |
| Memory optimization | [quantization.md](quantization.md), [deepseek-v4-flash.md](deepseek-v4-flash.md), [modal-gemma4-h200.md](modal-gemma4-h200.md) |
| Prompting & alignment | [ml.md](ml.md) |
| Training vs inference | [ml.md](ml.md), [transformer-inference.md](transformer-inference.md) |
| VRAM budgeting | [ml.md](ml.md), [quantization.md](quantization.md), [modal-gemma4-h200.md](modal-gemma4-h200.md) |
