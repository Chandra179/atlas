---
title: "Transformer Inference: How They Generate Text"
tags: [ml, ai, transformer, inference, deep-learning]
audience: "Engineers who want to understand how Transformers generate text — autoregressive decoding, KV caching, vocabulary, and token selection."
style: tutorial
prerequisites:
  - ai/neural-network-fundamentals.md
difficulty: intermediate
created: "2026-07-04"
---

# Transformer Inference: How They Generate Text

A Transformer is a stack of identical layers built around a single core computation: scaled dot-product attention. Inference runs through three stages — attention computation, autoregressive decoding, and token selection — to generate each new word.

---

## Transformer Architecture

### Scaled Dot-Product Attention

Every input token enters a Transformer layer as a vector. The layer multiplies that vector by three learned weight matrices — W_Q, W_K, W_V — to produce three new vectors:

- **Query (Q)**: what is this token looking for?
- **Key (K)**: what does this token offer?
- **Value (V)**: what information does this token carry?

The weight matrices are learned during training. They transform the raw input into these three roles. Once Q, K, and V are computed, the attention mechanism follows a single formula:

$$ \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V $$

Four steps:

1. **QK^T** — multiply every Query against every Key. The result is a matrix of raw scores: how much should token i pay attention to token j?
2. **Scale by √d_k** — divide each score by the square root of the key dimension. Without scaling, large vectors produce enormous dot products that push softmax into extreme territory where gradients vanish. The division pulls scores into a range softmax can handle.
3. **Softmax** — normalize each row so it sums to 1. Every token now has a probability distribution over all other tokens.
4. **Multiply by V** — blend the Value vectors according to the attention weights. Tokens with high relevance scores contribute more to the output.

The result: each token's output is a weighted mixture of every token's value, with weights determined by query-key relevance.

### Multi-Head Attention

A single attention computation captures one relationship pattern. Language has many: grammar, coreference, sentiment, factual association. Multi-head attention runs the entire computation multiple times in parallel, each with its own set of W_Q, W_K, W_V matrices.

With h heads (16 to 128), the architecture splits the input vector into h segments, each of dimension d_k = d_model / h. Each head computes attention independently. The model concatenates the h outputs into a single vector of dimension d_model, then multiplies that vector by a learned output projection matrix W_O.

If 32 attention heads look at "The cat sat on the mat," one head tracks subject-verb agreement (cat → sat), another links the article (The → cat), another follows the prepositional chain (on → mat), and a fourth captures spatial relationships. All 32 perspectives combine into a single enriched representation.

### Positional Encodings

Transformers process all words simultaneously and are blind to word order. "The dog ate my homework" and "My homework ate the dog" look identical because they contain the same words.

The fix: a unique mathematical vector is added to each word embedding based on its position. Word 1 gets a specific position vector, word 2 gets another, and so on. This gives the model a sense of chronology without sequential processing.

### Feed-Forward Networks

After attention gathers information from other tokens, each token's blended representation passes through a Feed-Forward Network (FFN) in every layer. The FFN is a two-layer MLP with GELU activation that processes each token independently.

- **Attention's job**: gather information from other tokens (information retrieval).
- **FFN's job**: process that information and apply abstract reasoning.

FFNs hold the bulk of the model's parameters. Attention is the eyes; the FFN is the brain.

### Residual Connections and Layer Normalization

Attention and FFN do not sit side by side. They stack in a precise order, connected by two mechanisms: residual connections and layer normalization.

A single Transformer layer runs four steps:

1. **Multi-Head Self-Attention** computes how each token relates to every other token.
2. **Add & Normalize**: the attention output is added to the layer's input (the residual connection), then layer-normalized.
3. **Feed-Forward Network** processes each token's representation independently.
4. **Add & Normalize**: the FFN output is added to the step-2 result, then normalized. This vector becomes the input to the next layer.

The residual connection — adding the input directly to the output — solves a critical problem. Without it, gradients would vanish as they travel backward through 80 or 100 layers. The skip creates a highway: error signals flow backward through the residual path untouched, bypassing the weight matrices entirely. This is what makes training 100-layer Transformers possible.

Layer normalization rescales each token's vector to have a stable mean and variance. Without it, values would grow or shrink uncontrollably as they pass through each layer. The normalization keeps numbers in a range the next layer can work with.

### The Deep Stack

A Transformer is a tower of these four-step blocks stacked 32 to 100+ layers deep:

- **Lower layers**: spelling, grammar, parts of speech.
- **Middle layers**: logic, sentence structure, immediate context.
- **Higher layers**: abstract concepts, metaphors, coding logic, overarching intent.

Data travels up through all layers, growing more abstract at each step, before hitting the vocabulary projection layer at the top to predict the next word.

---

## Context Handling: RNNs vs Transformers

**RNNs/LSTMs: Fading Memory Loss**
An LSTM is like a person listening to a long, continuous speech. As new words come in, the LSTM has to squeeze that new information into a fixed-size hidden state. To make room, it naturally starts "forgetting" older words. The context isn't chopped off abruptly — it just fades away and becomes blurry the longer the sequence gets.

**Transformers: The Hard Boundary Limit**
A Transformer doesn't suffer from fading memory because Self-Attention lets every word look back at every other word with perfect clarity. However, it has a different limitation: the context window. Because every word must look at every other word, computational cost grows quadratically O(N²) with length. Double the text, quadruple the compute.

Transformers don't fade context, but they do have a hard limit. If a model has an 8,000-token context window, it can recall word 1 and word 8,000 with equal precision — but feed it word 8,001 and word 1 is completely dropped from its view.

| | LSTMs | Transformers |
|---|---|---|
| Maximum length | Theoretically infinite | Fixed context window |
| Effective memory | Short; degrades rapidly | Perfect within window |
| Failure mode | Gradual blurring | Abrupt cutoff |

---

## Autoregressive Decoding

Transformers rely on **autoregressive next-token prediction via Self-Attention**, with **KV Caching** as the crucial speed optimization.

### The Core Algorithm: Autoregressive Prediction

The Transformer looks at your entire prompt and turns every word into three mathematical vectors: **Query (Q)**, **Key (K)**, and **Value (V)**.

**The "Matchmaking" (Self-Attention):** The model takes the Query of the very last word and multiplies it against the Keys of all previous words in the context window. This generates a relevance score for each past word.

**The Prediction:** It multiplies those scores by the Values to get a final representation, runs it through Softmax to get a probability distribution over the vocabulary, and chooses the most likely next word. It attaches that word to the text and repeats.

### How Accuracy Works: Global Context

Because the algorithm lets the current word directly query any past word via matrix multiplication, nothing compresses. If word 1 provides the subject ("The shepherd...") and word 5,000 needs a verb, the model directly multiplies word 5,000's Query with word 1's Key. The context arrives with full mathematical precision — it doesn't travel through 4,999 sequential steps like in an LSTM.

### How Speed Works: The KV Cache Trick

If a Transformer had to look at all 10,000 words every time it generates a single new word, it would get slower with every token.

**The problem without caching:** To predict word 1,001, the model calculates Q, K, and V for words 1–1,000. To predict word 1,002, it would normally re-read the entire text and re-calculate K and V for all 1,001 words — massive wasted effort.

**The KV Cache solution:** Since past text doesn't change, its K and V vectors don't change either.

1. **The prompt:** The model processes your input once and saves all K and V vectors into GPU memory (the KV Cache).
2. **The generation:** When generating the next word, the model only calculates Q for the single newest word.
3. **The lookup:** It compares that single new Query against the cached Keys and produces the answer instantly.

Because of KV Caching, the fresh math per token remains tiny — allowing the model to stream text instantly even with large context windows.

### Real-World Example

Prompt: "The quick brown fox jumps over the..."

The model's goal is to predict the next token. "Autoregressive" means it uses its own past outputs as inputs for the next step.

- **Step 1:** Input "The quick brown fox jumps over the" → predicts "lazy"
- **Step 2:** Input "The quick brown fox jumps over the lazy" → predicts "dog"
- **Step 3:** Input "The quick brown fox jumps over the lazy dog" → predicts "."

Every generated word is fed back into the input to help guess the next one.

### Simplified Math Demo

**Step A — Embeddings:** Every word is mapped to a vector (using 3 numbers per word for simplicity):

```
"the"   → [0.1, 0.8, 0.2]
"over"  → [0.4, 0.3, 0.9]
```

**Step B — Self-Attention (Q × K):** The model computes Q, K, V for each word. To predict the next word, the Query of the last word ("the") is multiplied against the Keys of all previous words. Raw attention scores might look like:

| Past Word | Score from "the" | Reason |
|---|---|---|
| "The" | 1.2 | Lower relevance |
| "quick" | 2.1 | Mild relevance |
| "fox" | 4.5 | High relevance (subject) |
| "jumps" | 5.2 | Highest relevance (action) |
| "over" | 3.8 | High relevance (preposition) |
| "the" | 0.5 | Low relevance |

**Step C — Softmax:** Softmax squashes these raw scores into percentages that add up to 100%. The model might decide: 45% attention to "jumps", 35% to "fox", 20% split among other words. These weights blend all Value vectors into a single context vector.

**Step D — Vocabulary Projection:** The context vector is projected against the model's entire vocabulary (e.g., 50,000 tokens). It outputs a score (logit) for every possible word:

```
Probability("lazy")     = 78%
Probability("sleeping") = 15%
Probability("brown")    = 2%
Probability("banana")   = 0.0001%
```

The algorithm selects "lazy" as the highest-probability token.

### Speed Estimation: Why KV Caching Matters

Let N be the number of words in the context window.

**Without KV cache:** The GPU calculates attention for all pairs of words — O(N²) complexity.
**With KV cache:** K and V for past N-1 words are already in memory. Only Q, K, V for the one new word are computed.

For a 10,000-token sequence:
- **Without cache:** 10,000 × 10,000 = 100,000,000 attention operations per new token
- **With cache:** 1 × 10,000 = 10,000 operations per new token

That's a 10,000× reduction — why Transformers stream text instantly rather than slowing down as conversations get longer.

### Why This Works: The Training Objective

Training taught the model exactly this skill. The training and inference loops run the same algorithm; inference just skips the weight updates.

During training, the model reads a sentence — "The quick brown fox jumps over the lazy dog" — and tries to predict every word from the words before it:

- Given "The" → predict "quick"
- Given "The quick" → predict "brown"
- Given "The quick brown" → predict "fox"

Each prediction produces a loss: the gap between the model's guess and the real next word. Backpropagation adjusts every weight to shrink that gap. After trillions of sentences, the weights settle into the patterns we call understanding.

**The Causal Mask**

One constraint makes this work: the model must never peek ahead. At position 5, it sees only positions 1 through 4. The architecture enforces this with a **causal mask** — a triangular matrix of zeros and negative infinity. When attention computes scores, the mask zeroes out every score between a token and any future token. The model literally cannot look ahead.

The causal mask is what makes the model autoregressive. Without it, every token would attend to every other token, including those that come after. The model would cheat: predicting "fox" while looking at "jumps," "over," "the," "lazy," and "dog" — a trivial task. Enforced blindness forces genuine prediction.

**During inference, the same rules apply.** The causal mask is still there. The KV cache simply preserves what the model already saw. The model generates token by token, each step seeing only the past — exactly as it did during training. The sole difference: no loss is calculated, no weights are updated. The trained model runs forward, nothing more.

---

## Vocabulary, Logits, and Token Selection

### How the Vocabulary is Created (BPE)

Transformers use a strict, fixed vocabulary created before training with **Byte-Pair Encoding (BPE)** or WordPiece.

BPE doesn't list every dictionary word. Instead, it breaks text into sub-words (tokens):

1. Start with basic characters (a, b, c, 1, 2, 3...).
2. Scan a massive dataset for the most frequent character pairs (e.g., "t" + "h" → "th"). Merge them.
3. Repeat millions of times, adding common combinations like "ing", "un", "est", and whole common words like "the" or "fox".

The result: a vocabulary of 32,000–256,000 tokens. An uncommon word like "unfriendliness" might be broken into ["un", "friendli", "ness"].

### Where "Add Up to 1" Happens

The order matters — the "add up to 1" happens *after* the weights, not before.

1. **The vector blend:** Attention blends input vectors into a single context vector (not yet adding to 1).
2. **Vocabulary projection (logits):** The context vector is multiplied by the final weight matrix, producing a raw score (logit) for every token in the vocabulary. These scores can be anything: 4.2, -1.5, 12.8. They do not add up to 1.
3. **Softmax (this makes it add to 1):** Softmax squashes all those raw logits into percentages between 0% and 100% that sum to exactly 1 (100%).

### Does It Choose Randomly?

Once Softmax gives probabilities, the selection depends on **Temperature**:

- **Greedy decoding (Temperature = 0):** Always picks the highest-probability token. Fully deterministic. If "lazy" is 78%, it always picks "lazy".
- **Sampling (Temperature > 0):** Treats the percentages like a weighted lottery. "lazy" has 78 tickets, "sleeping" has 15 — most rolls pick "lazy", but occasionally "sleeping" wins. This is what gives AI its "creativity" and prevents it from repeating the same text forever.

---

## Vector Dimensions, Vocab Size, and Weight Factors

Vector dimensions and vocabulary size determine model quality. Every architecture balances them carefully.

**Vector Dimensions (d_model):** The size of the embedding vector for each token (typically 768 to 4096+). Think of this as the model's conceptual bandwidth. More dimensions let each token store more nuanced information (e.g., "apple" as a fruit, a company, a color, and a stock all at once). Too few dimensions and understanding becomes overly simplistic.

**Vocabulary Size:** The total unique tokens the model knows (e.g., 50,000). If too small, words get chopped into tiny fragments making sequences too long. If too large, the model wastes memory on the final classification layer and rare tokens lack training data.

### The Exact Matrix Multiplication

The transition from hidden dimension to vocabulary dimension:

| Component | Shape |
|---|---|
| Context Vector | [1 × d_model] (e.g., 1 × 4096) |
| Output Weight Matrix | [d_model × Vocab Size] (e.g., 4096 × 50,000) |
| Logits Output | [1 × Vocab Size] (e.g., 1 × 50,000) |

The hidden dimensions (4096) cancel out via matrix multiplication, leaving one raw score per vocabulary token.

### How Weights Are Learned

Weights aren't designed — they emerge from **backpropagation and gradient descent** during training:

1. **Initialization:** The weight matrix starts with completely random numbers. The model predicts "banana" because the weights are random.
2. **Evaluation (Loss):** The training system compares the bad guess to the actual target text, calculating an error score (Loss).
3. **Adjustment (Optimization):** Calculus determines how to tweak every single weight (4096 × 50,000 of them) to make the correct token's score higher next time.

Over trillions of sentences, these weights tune themselves into "semantic filters." When a context vector representing "a fast animal leaping" passes through, the math naturally lights up the slot for "lazy."

---

## Vocabulary as Vectors: The Dot Product Lookup

The vocabulary is a collection of vectors. The final output weight matrix stores the vector for each token as a column (shape `[d_model × vocab_size]`). Each column is the embedding vector for a specific token.

### The Vocabulary is an Embedding Space

Every token has a unique vector of the same dimension (e.g., 4096):

```
"dog"  → [0.23, -0.45, 0.88, ...]
"lazy" → [-0.11, 0.76, 0.32, ...]
```

Words with similar meanings have similar numbers. "Cat", "dog", and "puppy" cluster together; "banana" sits far away.

### The Lookup: Vector Dot Products

The Context Vector acts as a **Search Query** pointing to a coordinate in this semantic map. The model calculates the **Dot Product** (directional alignment) between the context vector and every vocabulary vector:

```
Context Vector           Vocabulary Vectors          Logits
(Direction of     ⋅     ←Vector for "apple"→   =     Score for "apple": 0.1
 "a slow animal")        ←Vector for "banana"→        Score for "banana": -1.2
                         ←Vector for "lazy"→          Score for "lazy": 14.5
                         ←Vector for "zebra"→         Score for "zebra": 3.2
```

- **High score:** Vectors point in the same direction → large positive number (e.g., 14.5)
- **Low score:** Vectors point in different directions → low or negative number (e.g., -1.2)

Softmax turns these logits into percentages; the model outputs the highest-probability token. The final mapping isn't a translation — it's a geometric calculation of which vocabulary vector is closest to the sentence's meaning.

---

## Speed: Realtime Calculation + Smart Memory

The system combines real-time parallel hardware with smart memory caching.

### Massively Parallel GPUs

Dot products and matrix multiplications aren't done sequentially. They're calculated all at once on GPUs/TPUs:

- **CPU:** Like a genius solving one complex equation at a time.
- **GPU:** Like 10,000 basic calculators working in perfect unison.

To multiply a context vector by a 50,000-word vocabulary matrix, the GPU splits those 50,000 rows across thousands of cores and calculates almost all dot products in a single clock cycle.

### KV Caching (Memory Trick)

The system divides work into two phases:

1. **Prefill Phase (Realtime + Memory Write):** The model reads your prompt all at once, calculates K and V vectors for every word, and stores them in GPU High Bandwidth Memory (HBM).
2. **Generation Phase (Memory Read + Realtime):** The model does NOT re-calculate past tokens. It only calculates the vector for the one new word, reads old vectors from cache, and marries them together.

### Tensor Cores (Dedicated Hardware)

Modern AI chips have physical **Tensor Cores** or **Matrix Multiply Units (MMUs)** — hardwired silicon blocks that do nothing but take two matrices and spit out dot products at a hardware level. The physics of electricity moving through the chip IS the calculation.

**The speed recipe:** Permanent weights in GPU memory + KV Cache (short-term memory for your chat) + Tensor Cores (hardware math) → a fresh token every ~10–30 milliseconds.

---

## Further Reading

- Vaswani et al., 2017 *Attention Is All You Need* [arXiv](https://arxiv.org/abs/1706.03762)
- Brown et al., 2020 *Language Models are Few-Shot Learners* [arXiv](https://arxiv.org/abs/2005.14165)
- Sennrich et al., 2016 *Neural Machine Translation of Rare Words with Subword Units* [arXiv](https://arxiv.org/abs/1508.07909)
- Kwon et al., 2023 *Efficient Memory Management for Large Language Model Serving with PagedAttention* [arXiv](https://arxiv.org/abs/2309.06180)
