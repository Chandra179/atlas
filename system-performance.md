# System Performance

## Scenario: The Creeping P99 Spike in the Audit Service

### Context

You manage a high-throughput Go microservice (`audit-aggregator`) ingesting streaming JSON events over HTTP/2, processing them, and flushing them to S3 in 5-minute batches.

### Symptoms (Grafana & PagerDuty)

**Memory Footprint:** Resident Set Size (RSS) steadily climbs over a 36-hour period until the container approaches OOM limits.

**Latency Spikes:** P95 latency remains low (~4ms), but P99 latency degrades from 5ms to 900ms, accompanied by CPU spikes reaching 80-90% utilization.

**Garbage Collector Behavior:** CPU profiling via `pprof` shows `runtime.gcDrain` and `runtime.scanobject` taking up ~45% of total CPU time during latency spikes.

**Heap Profile:** `go tool pprof` reports live heap memory is unexpectedly small (around 350 MB), yet GC mark-and-sweep phases are thrashing CPU.

### Implementation Snippet

**Buffer Processing:** To avoid allocation overhead, the team uses a `sync.Pool` of 64 KB `[]byte` buffers (`reqBuffer`) to read incoming HTTP request bodies.

**Metadata Cache:** To deduplicate events before flushing, the service maintains an in-memory cache:

```go
type AuditCache struct {
    mu    sync.RWMutex
    items map[string]*EventMetadata
}
```

The map key is extracted directly: `eventID := string(reqBuffer[12:44])`.

**Payload Storage:** `EventMetadata` stores metadata alongside a slice reference to the payload bytes for batch processing:

```go
type EventMetadata struct {
    ReceivedAt time.Time
    Payload    []byte // Sliced directly via reqBuffer[44:payloadLen]
}
```

Lock contention is usually the first suspect in Go latency issues, but in this scenario the bottleneck lies deeper: Go's slice backing array mechanics and how the GC scans maps containing pointers.

### Root Cause 1: Slice Backing Array Pinning (Memory Retention)

In Go, slicing an existing buffer does not allocate new memory; it creates a 24-byte `reflect.SliceHeader` pointing into the original backing array:

```
Slice Header [ Pointer | Length | Capacity ]
                  │
                  ▼
Original 64 KB Array: [ 0 ... 44 |────── Payload ──────| ... 65535 ]
                                 ▲
                                 │ Pointer points here
```

- **Pointer:** memory address offset 44 inside the original 64 KB array
- **Length:** `payloadLen - 44`
- **Capacity:** `65536 - 44` (remaining space in the original array)

The Go GC operates at the **allocation boundary**, not the slice header boundary. When `sync.Pool` or `make([]byte, 65536)` allocates, the runtime marks that entire 64 KB block as a single heap object. Storing the payload slice in the map holds a live pointer into that block, so the GC cannot free it, even if only 100 bytes are referenced.

**The Impact:** If the cache holds 10,000 events, you aren't storing 10,000 × 100 B (~1 MB). You are pinning 10,000 × 64 KB (~640 MB) of RAM. Because those buffers are pinned by the map, `sync.Pool` cannot recycle them and is forced to continuously allocate new 64 KB buffers, causing steady RSS growth.

Note that this is not one shared 64 KB slab: `sync.Pool` manages a collection of **individual, separate** 64 KB allocations. Each request gets its own buffer, and each map entry pins a different one:

- Request 1 gets Buffer A, slices 100 B into `EventMetadata`, map pins A.
- Request 2 gets Buffer B, slices 100 B, map pins B.
- Request 10,000 gets Buffer #10,000, slices 100 B, map pins #10,000.

Every map entry references a different 64 KB heap allocation, so the GC cannot free a single one: `10,000 items × 64 KB = 640 MB`.

With copying, the server reuses the **same few dozen buffers** across all requests instead of allocating 10,000 distinct ones:

- Request 1 gets Buffer A, copies 100 B into a new tiny slice, stores that in the map, returns Buffer A via `pool.Put()`.
- Request 2's `pool.Get()` reuses Buffer A!

Result: `10,000 × 100 B in map` plus a handful of pooled 64 KB buffers, ≈ 1 MB total.

### Root Cause 2: Map Pointer Scanning (GC Latency Spikes)

Go's tri-color mark-and-sweep collector traces every pointer on the heap during every GC cycle to determine reachability.

The `map[string]*EventMetadata` type contains pointers in the key (`string` header contains a pointer to bytes), the value (`*EventMetadata` pointer), and the struct fields (`[]byte` slice pointer).

**The Impact:** During every GC cycle, `runtime.gcDrain` and `runtime.scanobject` must iterate through every single map bucket and dereference every pointer in the cache. As the map grows to hundreds of thousands of items, GC pause times scale linearly with the number of pointers, causing the P99 latency to jump from 5 ms to 900 ms.

### The Fix & Architectural Squeeze

To fix both memory retention and GC scan overhead, apply copy-on-store and pointer-free map structures:

```go
// 1. Copy payload bytes so reqBuffer (64 KB) can be recycled immediately by sync.Pool
payloadCopy := make([]byte, payloadLen-44)
copy(payloadCopy, reqBuffer[44:payloadLen])

// 2. Use pointer-free types for the map key and value
type CompactEvent struct {
    ReceivedAt   int64       // Unix timestamp (no pointer)
    PayloadHash  [16]byte    // Fixed array instead of string/slice (no pointer)
}

type AuditCache struct {
    mu    sync.RWMutex
    items map[[32]byte]CompactEvent // Fixed-array key + value struct with NO pointers
}
```

**Why this works:**

- **Memory:** Unpins the 64 KB buffer, allowing `sync.Pool` to safely reuse memory across requests.
- **GC Latency:** In Go, if a map contains no pointers in its key or value types, the compiler marks the map bucket as pointer-free. The GC skips scanning the map during `runtime.gcDrain`, dropping GC scan time and P99 latency back to under 5 ms.

### Deep Dive: sync.Pool Mechanics

`sync.Pool` is a thread-safe, concurrency-safe temporary object pool designed to reuse heap allocations across goroutines. Instead of allocating new memory on every request and leaving it for the GC to clean up, you fetch a pre-allocated object from the pool and return it when done.

**Object lifetime** is controlled by two forces: explicit `Put()` from your code, and the GC's two-stage victim cache that purges unused objects across two consecutive GC cycles.

**1. When an object is returned (`pool.Put`):**
- **Explicit developer control:** You decide when an object goes back into the pool (usually at the end of a request handler, or via `defer`).
- **Ownership handover:** The instant `pool.Put(obj)` executes, your code yields ownership of that memory. Accessing or modifying `obj` afterward causes race conditions and data corruption, because another goroutine might simultaneously fetch it via `Get()`.

**2. When the GC cleans it up (victim cache mechanism):** Since Go 1.13, `sync.Pool` avoids sudden performance drops using a two-generation victim cache (local and victim pools):
- **GC cycle 1 (demotion):** The GC moves all unused objects from the active local pool into the victim pool and empties local. If traffic arrives right after, `pool.Get()` checks local (empty), falls back to victim, and rescues the object back to the active pool.
- **GC cycle 2 (eviction):** On the next GC run, any objects still in the victim pool that were not rescued by a `Get()` between the two cycles are dropped and reclaimed by heap GC.

| Event | Status of unused pooled object |
|---|---|
| `pool.Put(x)` called | Stored in local pool (active) |
| 1st GC cycle occurs | Moved local → victim (demoted, still retrievable) |
| `pool.Get()` before 2nd GC | Rescued victim → active use (survives) |
| 2nd GC cycle (if unrescued) | Dropped → reclaimed by heap GC |

This two-GC grace period keeps buffer pools warm during frequent GC runs in high-throughput services, while idle services automatically release unused RAM back to the OS.

**Key benefits:**
- **Reduces allocations (allocs/op):** Avoids hitting the heap allocator repeatedly in hot paths.
- **Lowers GC CPU overhead:** Fewer allocations mean less memory for `runtime.gcDrain` to trace.
- **Per-P thread local caches:** Internally uses per-logical-processor (P) local queues, so push/pop incurs zero lock contention in the fast path.

**Critical gotchas:**
- **Not a persistent cache:** Never use `sync.Pool` for database connections, user sessions, or long-term state. Items can be wiped without notice during GC.
- **Dirty state:** You must explicitly reset an object (e.g., `buf.Reset()`) before returning it, or the next goroutine reads stale data.
- **Memory bloat from outliers:** If a pooled buffer grows to 50 MB, returning it retains 50 MB until the next GC cycle. Best practice is to check capacity before returning:

```go
if buf.Cap() <= 64*1024 { // Only pool buffers <= 64 KB
    buf.Reset()
    pool.Put(buf)
}
```