---
title: "Psycho"
aliases: []
tags: [psychology]
created: "2026-06-13"
modified: "2026-07-09"
---

# Psycho

Psycho infers personality traits from text using dictionary-based psycholinguistic analysis. You paste text, upload a file, or fetch a URL — it returns Big Five, Regulatory Focus, Need for Cognition, cognitive style, and value orientation scores, each with confidence intervals and traceable evidence. No data leaves your device.

## Architecture

1. **Ingest & Normalize.** Paste/file/URL input is whitespace-normalised, markup stripped, segmented into sentences, and tagged with source metadata (type, date).

2. **Analyze.** Tokenise against a psycholinguistic dictionary (LIWC or Empath). Compute category percentages, stylometric features, and dictionary coverage rate.

3. **Infer.** Feature vector feeds into Big Five regression (Yarkoni 2010 coefficients), Regulatory Focus (Higgins 1997), Need for Cognition (Cacioppo & Petty 1982), cognitive style markers, and Schwartz value orientation. Every output stores the feature evidence that produced it.

4. **Profile.** Aggregate all scores with confidence intervals. Optionally, a user-configured LLM sidecar (Ollama or cloud API, off by default) synthesises a narrative portrait from the structured scores.

## Key Tradeoffs

**Dictionary-based vs LLM inference.** Dictionary extraction is auditable, deterministic, and costs nothing per query. LLMs produce more fluent narrative but introduce opacity and token cost. Core trait inference is always dictionary-based; LLMs only touch the narrative synthesis step, and only when explicitly enabled.

**Local-only vs SaaS.** Zero data leaves the device. No authentication, no multi-tenancy, no sharing. The tradeoff is no collaboration, no cloud-scale throughput, and a single-user SQLite database that is portable but not network-accessible.

**Published frameworks vs popular typologies.** Only frameworks with published word-to-trait correlations (Big Five, Regulatory Focus, Need for Cognition, Schwartz values) are supported. MBTI, Enneagram, and other typologies without validated linguistic markers are excluded.

## Reference

**Research foundations:** LIWC2015 (Pennebaker et al., 2015), Yarkoni (2010), Pennebaker & King (1999), Higgins (1997), Cacioppo & Petty (1982), Schwartz (1992), Webster & Kruglanski (1994).
