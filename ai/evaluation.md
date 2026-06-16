---
title: "Model Evaluation & Benchmarks"
aliases: []
tags: [ml, ai]
created: "2026-06-16"
---

# Model Evaluation & Benchmarks

> **Before reading**: you should understand loss functions, train/val/test splits, and basic ML training — all covered in [Machine Learning](ml.md).

"Why does my model look great in the playground but fail in production?" You ran a few prompts, the outputs looked reasonable, and you shipped it. Then users started reporting nonsense answers, biased completions, and confident hallucinations.

Evaluation is the difference between "looks good to me" and knowing your model works. Without it, every change — a new fine-tune, a different prompt format, a bigger model — is a coin flip.

## Perplexity

Perplexity measures how "surprised" a model is by text it hasn't seen. It's the exponentiated average negative log-likelihood of each token:

```
Perplexity = exp(-1/N * Σ log P(token_i | token_1...token_{i-1}))
```

Lower perplexity = the model assigns higher probability to the correct next token = it better predicts the test data. A perplexity of 10 means the model is as uncertain as if choosing uniformly among 10 equally likely options at each step.

Perplexity is fast, automatic, and reproducible — no human needed. It's the standard metric during pre-training and fine-tuning for tracking whether loss is still decreasing.

**But it's insufficient alone.** Perplexity rewards a model for being good at next-token prediction on its training distribution. It does not capture factual accuracy, reasoning ability, helpfulness, safety, or instruction following. A model can have low perplexity and still generate confident nonsense. Use perplexity to monitor training, not to evaluate quality.

## Generation Metrics

For tasks with a reference output (translation, summarization, question answering), these metrics compare generated text against a human-written reference:

| Metric | What It Measures | Good For | Blind Spots |
|--------|-----------------|----------|-------------|
| **BLEU** | n-gram overlap with reference(s) | Machine translation | Penalizes valid synonyms, ignores semantics |
| **ROUGE** | Recall of n-grams from reference | Summarization (did we cover the key points?) | Long outputs score higher regardless of quality |
| **METEOR** | Unigram precision + recall + synonym matching | Translation, better correlation with human judgment than BLEU | Slower, language-dependent synonym sets |
| **BERTScore** | Cosine similarity of BERT embeddings between generated and reference | Any generation task | Requires a strong embedding model, computationally heavier |

All n-gram metrics share a fundamental problem: they compare surface form, not meaning. "The cat sat on the mat" and "A feline rested upon the rug" share zero n-grams but are semantically identical. BERTScore partially addresses this by operating in embedding space, where synonyms are close.

## LLM-as-Judge

Instead of n-gram overlap, use a strong LLM to score outputs. The judge model rates each response on dimensions like helpfulness, accuracy, relevance, and safety.

**MT-Bench** — A multi-turn benchmark where GPT-4 scores model responses on a 1–10 scale across 80 questions in 8 categories (writing, reasoning, math, coding, extraction, STEM, humanities, roleplay). GPT-4 judgments correlate well with human preference rankings.

**Chatbot Arena (LMSYS)** — Users submit a prompt, two anonymous models respond, the user votes for the better response. Over 1 million human preference votes collected. Models are ranked using Elo scores — the same system used in chess.

The key insight: strong LLMs are decent evaluators, but they have biases. They prefer longer responses, responses from their own model family, and responses that appear confident. Always validate judge-model evaluations against human judgments on a subset of your data.

## Elo Ratings & Leaderboards

Elo ratings convert pairwise preference data (A beats B) into a global ranking:

1. Every model starts with the same rating (e.g., 1500).
2. When model A beats model B, A gains points from B proportional to how surprising the outcome was.
3. A model expected to win (higher Elo) gains few points for winning and loses many for losing.
4. Over thousands of comparisons, scores stabilize and reflect relative strength.

Chatbot Arena maintains the most widely used LLM Elo leaderboard. It's not perfect — different user populations (developer vs general public) produce different rankings — but it's the closest thing to a ground-truth leaderboard we have.

## Benchmark Suite

| Benchmark | Task | Format | Metric | Why It Matters |
|-----------|------|--------|--------|----------------|
| **MMLU** | 57 subjects (law, medicine, math, history) | Multiple choice | Accuracy | Broad knowledge — the SAT for LLMs |
| **HumanEval** | Python function completion from docstring | Code generation | pass@k | Measures coding ability, not recall |
| **SWE-bench** | Real GitHub issue → fix + PR | Software engineering | % resolved | Closest to real-world SWE work |
| **GSM8K** | Grade-school math word problems | Step-by-step reasoning | Final answer accuracy | Multi-step reasoning, easy to verify |
| **HellaSwag** | Pick the most plausible sentence ending | Multiple choice | Accuracy | Commonsense reasoning, hard for models |
| **MATH** | Competition-level math (AMC/AIME) | Step-by-step reasoning | Final answer accuracy | Frontier reasoning ability |
| **ARC-Challenge** | Grade-school science questions | Multiple choice | Accuracy | Tests reasoning, not retrieval |
| **TruthfulQA** | Questions designed to trigger false beliefs | Free-text generation | Truthfulness (judge-model) | Measures hallucination resistance |

Benchmarks measure specific capabilities, not overall quality. A model can ace HumanEval and still generate terrible code review feedback. Aggregate scores hide weakness in domains you care about. Pick benchmarks that match your use case — don't chase leaderboard position.

## Human Evaluation

When benchmarks and judge-models aren't enough, you need humans:

**Inter-annotator agreement** — If two humans disagree on whether a response is good, the evaluation rubric is underspecified. Measure agreement with Cohen's kappa or Krippendorff's alpha. Values below 0.6 mean your evaluation criteria need work, not your model.

**A/B preference** — Show two responses side by side. "Which is more helpful?" The gold standard for comparing models. Cheaper and more reliable than absolute ratings because humans are better at relative judgment than absolute scoring.

**Likert scales** — Rate on 1–5 scale: "How coherent is this response?" Problematic because raters cluster differently (one person's 3 is another's 4) and disagree on what "coherent" means. Prefer A/B testing over Likert when possible.

Human evaluation is expensive, slow, and noisy. It does not scale. Use it to validate automated metrics and judge-models, then let those automated systems carry the evaluation load.

## Key Things

1. **Perplexity is for training monitoring, not quality evaluation.** Low perplexity ≠ good model. It means the model memorized its training distribution, not that it reasons or follows instructions.
2. **N-gram metrics (BLEU, ROUGE) are legacy.** They penalize valid paraphrases and ignore semantics. BERTScore or LLM-as-judge are better defaults for generation evaluation.
3. **Judge-models have biases.** They prefer longer answers and answers from related model families. Calibrate against human judgment on your data.
4. **Benchmarks measure capabilities, not overall quality.** A high MMLU score doesn't mean the model is safe, helpful, or good at your specific task. Run your own eval.
5. **Goodhart's law applies.** When a metric becomes a target, it ceases to be a good metric. Training on benchmark data or optimizing prompts for a leaderboard inflates scores without improving real performance.
6. **Human eval validates automated eval.** Not the other way around. If you can't afford human eval, at minimum run LLM-as-judge and check a random sample of judgments manually.

## References

- BLEU: Papineni et al., 2002 — *BLEU: a Method for Automatic Evaluation of Machine Translation*
- ROUGE: Lin, 2004 — *ROUGE: A Package for Automatic Evaluation of Summaries*
- BERTScore: Zhang et al., 2020 — *BERTScore: Evaluating Text Generation with BERT* — [arXiv](https://arxiv.org/abs/1904.09675)
- MT-Bench: Zheng et al., 2024 — *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* — [arXiv](https://arxiv.org/abs/2306.05685)
- Chatbot Arena: Chiang et al., 2024 — *Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference* — [arXiv](https://arxiv.org/abs/2403.04132)
- MMLU: Hendrycks et al., 2021 — *Measuring Massive Multitask Language Understanding* — [arXiv](https://arxiv.org/abs/2009.03300)
- HumanEval: Chen et al., 2021 — *Evaluating Large Language Models Trained on Code* — [arXiv](https://arxiv.org/abs/2107.03374)
- SWE-bench: Jimenez et al., 2024 — *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?* — [arXiv](https://arxiv.org/abs/2310.06770)
- GSM8K: Cobbe et al., 2021 — *Training Verifiers to Solve Math Word Problems* — [arXiv](https://arxiv.org/abs/2110.14168)
- TruthfulQA: Lin et al., 2022 — *TruthfulQA: Measuring How Models Mimic Human Falsehoods* — [arXiv](https://arxiv.org/abs/2109.07958)
