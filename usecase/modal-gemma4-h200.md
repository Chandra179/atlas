---
tags: [ml, ai, infrastructure, modal, gemma4, h200]
audience: Engineers deploying Gemma 4 31B on H200 via Modal. Python basics assumed.
style: Deployment case study
---

# Deploying Gemma 4 31B on H200 via Modal

This case study covers a concrete deployment: serving Google's **Gemma 4 31B** on a single **NVIDIA H200** GPU using **Modal** (serverless GPU platform) and **vLLM** (inference engine).

The system has three pieces:

- **Modal** provisions the GPU, builds container images, creates HTTPS endpoints, handles scaling and health checks.
- **vLLM** loads model weights into GPU memory, manages the key-value cache, handles request batching, and generates text.
- **HuggingFace Hub** stores and distributes pre-trained weights (`google/gemma-4-31b-it`).

A **cold start** is what happens when Modal boots a container from scratch for the first time. The container image must be pulled, model weights loaded into GPU memory, GPU kernels compiled, and the model initialized. This document measures each phase and explains how to optimize it.

> **Who this is for** Engineers deploying LLMs on serverless GPUs. Familiarity with Python assumed; no prior Modal, vLLM, or GPU serving experience needed.
> **Prerequisites** [Modal account](https://modal.com), [HuggingFace account](https://huggingface.co) (with Gemma 4 license accepted), Python basics.

---

## Modal Platform Setup

### Step 1: Image Building

Everything your app needs Python packages, environment variables, config files must be baked into the container image before it starts. If you miss a dependency, the container fails at runtime, not at build time.

- **Dependencies**: use `.uv_pip_install("package==version")` on the image chain. Prefer this over raw `pip_install` for consistency with the project's `uv` tooling.
- **Build/Runtime env vars**: use `.env_var("KEY", "value")` on the image chain. Observed in practice: `HF_XET_HIGH_PERFORMANCE=1` (speeds up HuggingFace Xet-backed downloads) and `VLLM_LOG_STATS_INTERVAL=1` (enables periodic vLLM throughput logging).
- **Bundled files**: use `.add_local_file(local_path, remote_path, copy=True)`. Without `copy=True`, files are mounted at container startup (not baked into the image layer), making them unavailable for subsequent image build steps.
- **Decorator params** (`gpu=`, `scaledown_window=`, `volumes=`): these are evaluated at **Python module load time on the deploy host** (your machine), not inside the Modal container. Module-level constants work fine for these.

### Step 2: Path Resolution

File paths that work on your laptop break inside the container because Modal copies your script to a flat directory structure. Hard-coded relative paths (`../../config.yaml`) will not find the file.

Inside a Modal container, `__file__` resolves to `/root/modal_serve.py` (the script is copied flattened into the root). `Path(__file__).parent.parent.parent` does NOT point to your project root. For runtime config files, bundle them into the image and reference the bundled path:

```python
# At module level try the bundled image path first, fall back to local project path
for path in (Path("/opt/config.yaml"), Path(__file__).resolve().parent.parent.parent / "config.yaml"):
 if path.exists():
 cfg = yaml.safe_load(path.read_text(encoding="utf-8"))
 break
```

### Step 3: Deploying to Modal

Understanding the deploy lifecycle prevents confusion when your code changes do not take effect running containers keep using the old deployment.

- **`modal deploy`** pushes a new immutable deployment with the current code + image. Existing live containers continue running the OLD deployment.
- **Killing a container** (`modal app stop`) restarts it from the same old deployment. Code/image changes require `modal deploy` to take effect.
- **Modal endpoints are public HTTPS URLs** with no built-in auth layer. The backend class must skip API key validation (unlike HuggingFace or OpenRouter).
- **Endpoint URL pattern**: `https://{username}--{app-name}--{function-name}.modal.run` (e.g., `chandrafirst67--modal-gemma-serve-dev.modal.run`).
- **Mount paths at deploy**: Modal logs show which local files are mounted useful for confirming config files are picked up (e.g., `🔨 Created mount /home/.../config.yaml`).

---

## Cold Start Anatomy

When Modal boots a container for the first time (a cold start), it goes through several phases: pulling the image, loading 58+ GiB of model weights into GPU memory, compiling GPU kernels, and initializing the inference engine. Each phase has a cost.

Phases explained in plain language:

- **Container init**: Modal pulls the Docker-like image and sets up the environment (~30s).
- **Weights load**: Model weights (58.25 GiB) are copied from a network-attached volume into GPU memory. With a cached volume, this takes ~32s. Without it, downloading from HuggingFace takes 5-10 minutes.
- **torch.compile**: PyTorch compiles the model's operations into GPU kernels optimized for this specific architecture and GPU.^[Just-in-time compilation the first run optimizes for the hardware and caches the result for future starts.] With a cached compilation, ~8s. Without it, ~60s+.
- **CUDA graph capture**: vLLM records sequences of GPU operations (kernel launches) into pre-compiled graphs that replay with near-zero CPU overhead.^[Think of it as recording a macro of GPU operations each inference re-runs the macro instead of dispatching individual kernels.] ~14s whether cached or not (they are always captured fresh).
- **Warm-up query**: A trivial request that forces JIT compilation of remaining GPU kernels before real traffic arrives. Absorbs a 2-3s latency spike that would otherwise hit the first real user.

| Phase | Duration (cached) | Duration (fresh) | Detail |
|-------|-------------------|------------------|--------|
| Container init | ~30s | ~30s | Image pull, env setup |
| Weights load | ~32s | ~5-10 min | from `huggingface-cache` volume vs fresh download (58.25 GiB) |
| torch.compile | ~8s | ~60s+ | from `vllm-cache` volume vs cold compilation |
| CUDA graph capture | ~14s | ~14s | 51 piecewise + 51 full graphs |
| Engine init (rest) | ~10s | ~10s | Profiling, KV cache allocation |
| Engine init total | ~107s | ~107s+download | Includes compile + graph capture |
| Warm-up query | ~7s | ~10s | Absorbs JIT kernel compilation spikes |
| **Total** | **~182s** | **10-15 min** | |

> Phase durations are not strictly additive some phases overlap, and orchestration overhead (scheduling, health checks) is not broken out.^[See [Modal cold start docs](https://modal.com/docs/guide/cold-start) for more on container lifecycle.]

### Key things
- Cached cold start: ~182s (~3 min). Fresh (no cached volumes): 10-15 min.
- Volumes (persistent storage) are the critical optimization they save 5-10 min each on weight download and torch.compile.
- Engine init (~107s) dominates the timeline; warm-up adds ~7s.
- Phase durations overlap totals are guidance, not strict sums.

---

## Optimization

### Volumes (Persistent Storage)

Without volumes, every cold start pays the full weight download and kernel compilation penalty. Volumes cache these across deploys.

Modal [Volumes](https://modal.com/docs/guide/volumes) [^1] are network-attached persistent storage mounted into containers at runtime. Two are critical:

- **`huggingface-cache`** stores model weights via `HF_HOME=/cache`. First deploy downloads 58+ GiB; subsequent deploys read from cache. Without this, every cold start pays the full download penalty.
- **`vllm-cache`** stores torch.compile artifacts and AOT compilation outputs via `VLLM_CACHE_DIR=/root/.cache/vllm`. Reusing compiled graphs saves ~60s+ vs cold compilation.

Volumes persist across deploys; they are NOT wiped when a container scales down.

### Idle Management

You pay per second the container is alive ($4.54/hr for an H200). If the container stays alive after requests stop, you burn money on idle GPU time.

Two competing knobs:

| Knob | Behavior | Cost |
|------|----------|------|
| `keep_warm` | Keeps N containers alive permanently | H200: $4.54/hr × N continuously |
| `scaledown_window` | Kills container after N minutes of no requests | H200: $4.54/hr for those N idle minutes per session end |

For limited budgets (e.g., $240 hackathon credit), **15-minute `scaledown_window`** is the practical sweet spot [^2]. Max idle waste per session: ~$1.14. `keep_warm` is unsustainable (burns credit in ~53 hours).

**When to use each:**

| Approach | Use when | Avoid when |
|----------|----------|------------|
| `keep_warm` | Sub-second cold start is critical; budget allows $4.54/hr/container continuously | Cost is constrained; traffic is bursty or infrequent |
| `scaledown_window` | ~3 min cold start is acceptable; cost is primary concern | Every request must respond in <1s with zero cold start penalty |

### GPU Memory Snapshots (Alpha) [^3] Optional Optimization

Cold starts take 3+ minutes. GPU snapshots cut that to 10-30 seconds by saving and restoring the entire GPU memory state (including compiled kernels and CUDA graphs).

**How it works:**

1. A snapshot-enabled container boots, starts vLLM, runs a warm-up query (triggering JIT compilation), then puts vLLM into sleep mode (`--enable-sleep-mode`) which empties the KV cache and offloads weights to CPU.
2. Modal snapshots the GPU memory and persists it.
3. Future containers boot from the snapshot vLLM wakes from sleep mode in seconds instead of re-compiling.

**Implementation requirements:**

- Refactor from `app.function` to `app.cls` lifecycle hooks are required.
- Add to decorator: `enable_memory_snapshot=True`, `experimental_options={"enable_gpu_snapshot": True}`
- Add env vars: `VLLM_SERVER_DEV_MODE=1`, `TORCHINDUCTOR_COMPILE_THREADS=1` [^4]
- Add vLLM flags: `--enable-sleep-mode`. Constrain `--max-num-seqs` and `--max-model-len` to keep KV cache small/predictable.
- Lifecycle: `@modal.enter(snap=True)` start vLLM, warmup, sleep (triggers snapshot). `@modal.enter(snap=False)` wake from snapshot.
- `@modal.exit()` terminate vLLM subprocess cleanly.

**Tradeoffs:**

| Aspect | Current (no snapshot) | With GPU Snapshot |
|--------|----------------------|-------------------|
| Cold start | ~3-5 min | ~10-30 sec |
| Idle cost | $0 | $0 |
| Complexity | Simple | Medium (refactor to class) |
| Maturity | Stable | Alpha feature |

**Limitations (all acceptable for single-GPU use):**

- Best with single GPU (`N_GPU=1`) fine here.
- Does not speed up weight loading but that is not the bottleneck.
- Alpha feature, but Modal's vLLM example is battle-tested.

#### Key things
- GPU snapshots cut cold start from ~3-5 min to ~10-30 sec by restoring GPU memory state.
- Requires refactor from `app.function` to `app.cls` and `--enable-sleep-mode` on vLLM.
- Alpha maturity, but Modal's vLLM example is battle-tested.
- Best for single-GPU; does not accelerate weight loading.

---

## vLLM Configuration

These are the startup flags that matter for Gemma 4 on a single H200.

### Relevant Startup Flags

| Flag | Value | Reason |
|------|-------|--------|
| `--tensor-parallel-size` | 1 | Single GPU (H200). >1 only for multi-GPU. |
| `--enforce-eager` | omit (default=False) | Let vLLM use CUDA graphs. Eager mode is a debug fallback and hurts throughput. |
| `--async-scheduling` | enabled | Improves throughput for single-request scenarios. |
| `--tool-call-parser` | `gemma4` | Model-specific. Needed for structured output / tool calling. |
| `--reasoning-parser` | `gemma4` | Model-specific. Parses chain-of-thought in responses. |
| `--limit-mm-per-prompt` | `{"image":0,"video":0,"audio":0}` | Force text-only mode. Reduces memory overhead. |
| `--enable-auto-tool-choice` | enabled | Allows the model to decide when to use tools. |
| `--max-model-len` | auto | vLLM auto-detects. Gemma 4 → 262144. |
| `--gpu-memory-utilization` | 0.92 | Leaves headroom for CUDA graphs and KV cache. |
| `--safetensors-load-strategy` | `prefetch` | Can speed up weight loading on network FS; omitted when on 9P (Modal default). |
| `--generation-config` | `vllm` | Override model's `generation_config.json` sampling defaults (see Sampling Defaults below). |

### Gemma4-Specific Architecture Notes

- **Heterogeneous head dimensions**: `head_dim=256`, `global_head_dim=512`. This forces the TRITON_ATTN backend to prevent mixed-backend numerical divergence.^[The model uses two different sizes for attention heads a smaller one for local attention and a larger one for global attention. This is unusual; most models use one size everywhere. vLLM must use the Triton attention backend to handle this correctly.]
- **Multimodal-bidirectional attention**: causes vLLM to force `--disable_chunked_mm_input` automatically.
- **Architecture**: resolved as `Gemma4ForConditionalGeneration`.
- **Context length**: auto-detected as 262,144 tokens.
- **Chunked prefill**: enabled with `max_num_batched_tokens=8192`.^[Processing the input prompt in smaller chunks rather than all at once. This reduces peak GPU memory usage during the first pass through the prompt.]

### Attention Backend

Gemma4's heterogeneous head dimensions trigger automatic selection of `TRITON_ATTN`. vLLM emits a config-time warning and forces this backend:

```
Gemma4 model has heterogeneous head dimensions (head_dim=256, global_head_dim=512).
Forcing TRITON_ATTN backend to prevent mixed-backend numerical divergence.
```

FlashInfer^[An optimized GPU library for sampling operations used here for token selection (top-p, top-k filtering), not for the attention mechanism.] is used only for top-p & top-k sampling (via `topk_topp_sampler.py`), not for attention.

### Sampling Defaults

vLLM warns that the model's `generation_config.json` overrides its built-in defaults:

```
Default vLLM sampling parameters have been overridden by the model's `generation_config.json`:
`{'temperature': 1.0, 'top_k': 64, 'top_p': 0.95}`.
If this is not intended, please relaunch with `--generation-config vllm`.
```

### Chat Template Detection

vLLM auto-detects the chat template format as `openai`. You can override with `--chat-template-content-format`.

---

## Warm-Up

GPU kernels are compiled the first time they are used (JIT compilation). If the first real request triggers compilation, that user pays a 2-3s latency spike. A warm-up query absorbs this cost before traffic arrives.

Sending a trivial chat completion query (`[{"role":"user","content":"Hi"}]`) during startup triggers JIT kernel compilation (Triton^[A GPU programming language by OpenAI vLLM uses it to write custom attention kernels.]) for the first-inference shapes. Without this, the first real user request pays a 2-3s latency spike from JIT compilation. Warm-up absorbs this cost before traffic arrives.

**Known JIT compilation gaps during inference** even after a warm-up query, some Triton kernels compile on first real use:
- `_compute_slot_mapping_kernel`
- `kernel_unified_attention`

Each causes a latency spike. Consider extending the warm-up to cover these shapes/configs if consistent tail latency matters.

### Throughput (H200, 31B dense, single request)

| Metric | Value |
|--------|-------|
| Avg prompt throughput | 244.6 tok/s |
| Avg generation throughput | 55.9 tok/s |

### Startup Timeline (cached)

Timings below are from a separate measurement run. Differences vs. the [Cold Start Anatomy](#cold-start-anatomy) table (~10-20s across phases) reflect normal run-to-run variance.

| Phase | Duration |
|-------|----------|
| Container init | ~30s |
| Model load | ~29s |
| torch.compile (cached) | ~8.8s |
| Profiling/warmup run | ~0.3s |
| CUDA graph capture | ~15s |
| Engine init total | ~117s |
| Warm-up query | ~7s |
| **Total to healthy** | **~202s** |

### Key things
- Omit `--enforce-eager` CUDA graphs significantly improve throughput.
- Always send a warm-up query to absorb JIT compilation latency.
- Two Triton kernels still compile at runtime extend warm-up if tail latency is critical.
- CUDA graph profiling (v0.21.0+) reduces effective GPU memory by ~0.55pp.
- 9P filesystem disables auto-prefetch; force with `--safetensors-load-strategy=prefetch` if needed.

---

## vLLM Deep Dive

### CUDA Graph Memory Profiling (v0.21.0+)

Since v0.21.0, vLLM profiles CUDA graph memory during startup and subtracts it from the GPU memory budget. The effective `--gpu-memory-utilization` is lower than the nominal value:

- **Nominal**: `--gpu-memory-utilization=0.9200`
- **Effective**: `0.9145` (i.e., you lose ~0.55pp to CUDA graph overhead)
- **To maintain the same KV cache size**: increase `--gpu-memory-utilization` to `0.9255`
- **To disable profiling**: set `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=0`

### GPU Memory Breakdown (H200, 31B dense)

| Component | Memory |
|-----------|--------|
| Model weights | 57.91 GiB |
| CUDA graphs (actual) | 0.67 GiB |
| CUDA graphs (estimated) | 0.76 GiB (difference: 13.7%) |
| Available KV cache | 65.94 GiB |
| KV cache capacity | 639,184 tokens |
| Max concurrency (262k-token reqs) | ~2.44x |

The KV cache is where vLLM stores intermediate attention states during text generation.^[Key-Value cache each token generated stores its attention keys and values so previous tokens do not need to be reprocessed. It grows linearly with sequence length and number of concurrent requests.] Its size determines how many concurrent requests your GPU can handle.

### Filesystem & Weight Loading

Modal containers use the **9P** filesystem by default^[A distributed filesystem protocol from the Plan 9 operating system. Modal uses it to serve files into containers without the metadata overhead of NFS.]. vLLM's auto-prefetch detection skips 9P because it is not a recognized network filesystem (NFS/Lustre):

```
Auto-prefetch is disabled because the filesystem (9P) is not a recognized network FS (NFS/Lustre).
If you want to force prefetching, start vLLM with --safetensors-load-strategy=prefetch.
```

Weight loading from `huggingface-cache` volume takes ~27.65s for a 58.25 GiB model (2 safetensors shards).

---

## Cost Model (H200, ~$0.001261/sec → $4.54/hr) [^5]

Every cold start, idle minute, and inference has a dollar cost. Understanding these numbers helps you choose between `keep_warm` and `scaledown_window`, and whether GPU snapshots are worth the engineering effort.

| Event | Cost |
|-------|------|
| Cold start (182s from cache) | ~$0.23 |
| Per inference | ~$0.005-0.01 |
| Idle waste (15 min after last request) | ~$1.14 |
| Keep-warm (per hour) | $4.54 |

---

## Security & API Management

Modal endpoints are public URLs with no built-in auth. Anyone who discovers the URL can send requests and burn your budget. Production deployments need auth, rate limiting, and content controls.

### API Authentication

**Option 1: API key in request header.** Add a shared secret check to your endpoint:

```python
import os
EXPECTED_API_KEY = os.environ["API_KEY"]

@app.function()
@modal.web_endpoint()
def serve(request):
 if request.headers.get("Authorization") != f"Bearer {EXPECTED_API_KEY}":
 return JSONResponse({"error": "Unauthorized"}, status_code=401)
 ...
```

Set `API_KEY` via Modal secrets (not hardcoded).

**Option 2: Reverse proxy.** Place Cloudflare Tunnel, nginx, or an API gateway in front of Modal. The proxy handles auth, Modal only receives authenticated requests. Adds ~5-20ms latency but centralizes auth across services.

**Option 3: Modal's built-in (limited).** Modal supports `@modal.web_endpoint(auth_mode="public")` (default). There is no built-in API key validation you must implement it yourself.

### Rate Limiting

Without rate limiting, a burst of requests can overwhelm a single GPU and cause OOM kills or multi-second queue times.

- **Application-level:** track request count per window via an in-memory counter. Return 429 with `Retry-After` header. Not suitable for multi-replica (each has its own counter).
- **Modal's `max_inputs`:** `@app.function(max_inputs=5)` queues inputs when N are in-flight. Simple burst protection.
- **External rate limiter (production):** Cloudflare Rate Limiting or a Redis-based token bucket. Works across replicas and survives scale-down.

### Content Filtering

vLLM does not filter output layers to add:

- **Input validation:** reject prompts exceeding `max-model-len`, containing disallowed patterns, or embedding injection patterns.
- **Output filtering:** scan generated text for PII or forbidden content before returning to client. Adds ~50-200ms but necessary for compliance.
- **Model-level guardrails:** fine-tuned safety classifiers (Llama Guard, Google Safety) as a separate service.

### Prompt Injection Defense

The simplest effective defense: use the chat template for system/user separation never concatenate strings. Chat templates mark system/user/assistant roles with special tokens the model was trained to respect. String concatenation (`system_prompt + user_input`) bypasses this separation and makes injection trivial.

### Key things
- Modal has no built-in auth implement API key validation in your endpoint handler or use a reverse proxy.
- Rate limit at the application level (429 + Retry-After) for burst protection; external rate limiter for production.
- Use the chat template for system/user separation never concatenate strings.
- Content filtering adds latency; evaluate whether you need it before shipping.

---

## References

[^1]: Modal Volumes [guide](https://modal.com/docs/guide/volumes).
[^2]: Modal `scaledown_window` docs max 20 minutes per [cold start guide](https://modal.com/docs/guide/cold-start). Modal's vLLM [snapshot example](https://modal.com/docs/examples/vllm_snapshot) uses 15 minutes.
[^3]: Modal GPU Memory Snapshots [guide](https://modal.com/docs/guide/memory-snapshots), [alpha feature maturity](https://modal.com/docs/guide/feature-maturity).
[^4]: vLLM sleep mode for GPU snapshots `VLLM_SERVER_DEV_MODE=1`, `TORCHINDUCTOR_COMPILE_THREADS=1` as used in Modal's [vLLM snapshot example](https://modal.com/docs/examples/vllm_snapshot).
[^5]: Modal H200 pricing: [$0.001261/sec (~$4.54/hr)](https://modal.com/pricing).

### Further Reading
- [`ai-infra.md`](../ai/ai-infra.md) general vLLM concepts (batching, caching, decoding, observability).
- [Modal documentation](https://modal.com/docs) container lifecycle, volumes, GPU snapshots.
- [vLLM documentation](https://docs.vllm.ai) startup flags, CUDA graph profiling, model architecture.
