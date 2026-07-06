---
title: "Memory Management"
aliases: []
tags: [golang]
created: "2026-07-06"
---

# Memory Management

## Stack vs Heap

Memory is divided into two regions of RAM, managed differently.

**Stack:** Structured, LIFO. Each goroutine has its own stack. When a function returns, its stack frame is popped instantly — zero cleanup needed. No GC involvement [^1].

**Heap:** Chaotic, any-size allocations at arbitrary addresses. Requires GC to find and free dead objects [^1].

The GC only scans the stack during Mark Preparation (to find root pointers pointing into the heap). After that, it ignores the stack entirely [^1] [^3].

## Escape Analysis

At compile time, the Go compiler decides where a variable lives:

| Condition | Placement |
|---|---|
| Variable never leaves the function scope | Stack |
| Variable is returned from the function | Heap |
| Variable is shared across goroutines | Heap |
| Variable is too large for the stack | Heap |

Kept on the stack = automatically freed, zero GC cost. Escaped to the heap = GC tracks it [^1].

## Memory Layout

**Nested structs as values** are flattened into a single contiguous block of RAM. The GC scans them in one read — no jumps [^4].

```go
type Inventory struct { Slots int }
type Player    struct { Inv Inventory }   // value — flat in RAM
type Game      struct { P   Player }      // value — flat in RAM
```

Reading `Slots` involves zero pointer dereferences.

**Nested structs as pointers** scatter data across the heap:

```go
type Inventory struct { Slots int }
type Player    struct { Inv *Inventory }  // pointer — heap jump
type Game      struct { P   *Player }     // pointer — heap jump
```

Reading `Slots` requires two heap lookups: `Game → Player → Inventory`. Every `*` is a cache-miss risk and a GC scan cost [^2] [^3].

## Pointer Chasing

The GC traverses the heap by following pointers. Every nested pointer adds a latency lookup — the GC pauses at each one, fetches the address from RAM, and continues. With millions of pointer-heavy objects, the GC spends most of its marking time waiting on memory lookups [^2].

This also hurts application code: CPUs cache contiguous memory (cache lines). A flat struct loads into cache in one shot. A pointer chain scatters data across cache lines, causing cache misses that stall the CPU [^3].

## Strings

A `string` in Go is a 16-byte value type: an 8-byte pointer to text data + an 8-byte length [^6]. Copying a string (or a struct containing one) copies only the header, not the underlying text. Strings never need a pointer to stay efficient.

## Arrays vs Slices

| Type | Behavior on copy | GC impact |
|---|---|---|
| `[N]T` (array) | Copies all N elements — expensive for large N [^4] | Stays on stack if small |
| `[]T` (slice) | Copies 24-byte header (ptr + len + cap). Backing array is shared [^5] [^6] | Header on stack, backing array on heap |

A struct containing `[10000]Object` copied by value duplicates all 10,000 objects. Use a pointer for the struct.

A struct containing `[]Object` copied by value only copies the 24-byte slice header — the 10,000 items are not duplicated.

## When to Use Pointers

| Scenario | Use | Why |
|---|---|---|
| Small data (int, bool, small structs) | Value | Stays on stack, no GC cost |
| Large struct (megabytes) | Pointer | Avoids copying megabytes of data |
| Mutation of original | Pointer | Required for modification |
| Passing down into a function (borrowing) | Pointer | Escape analysis keeps it on stack if the pointer never leaves caller scope |
| Nested fields | Value by default | Flat memory, zero pointer chasing |

## GC Impact Summary

The GC cares more about the **number of reachable pointers** than the **total heap size**. A 100 MB flat array of integers is near-free for the GC to scan. A 10 MB web of interconnected pointer-heavy structs is expensive [^2].

## Struct Alignment & Padding

Fields are aligned to their size: `int32` at multiples of 4, `int64` at multiples of 8, pointers at multiples of 8 [^7]. The compiler inserts padding between fields to satisfy alignment. Field order changes struct size:

```go
type Bad struct {      // 24 bytes
    A bool    // 1 byte + 7 padding
    B int64   // 8 bytes
    C bool    // 1 byte + 7 padding
}

type Good struct {     // 16 bytes
    A bool    // 1 byte + 7 padding
    C bool    // 1 byte
    B int64   // 8 bytes
}
```

`Good` reorders fields to pack the two bools together, saving 8 bytes per instance. For a slice of 1M structs, that is 8 MB of wasted RAM. Use `go vet -fieldalignment` or `golang.org/x/tools/go/analysis/passes/fieldalignment` to detect.

## Empty Struct

`struct{}` occupies zero bytes of storage. Two common uses:

- **Set semantics:** `map[string]struct{}` — values cost nothing, only keys matter.
- **Signal-only channels:** `chan struct{}` — sends zero bytes, no payload.

`struct{}` arrays/slices are special: the runtime handles them as a single global address (`zerobase`). A `[1000000]struct{}` is 0 bytes.

## Slice Backing Array Traps

**Reslice doesn't copy.** `s[:0]` keeps the backing array alive. Both slices share the same memory — no data is copied, only a new 24-byte header is created. Hanging on to a small slice of a large allocation pins the entire backing array:

```go
data := make([]byte, 1_000_000)  // backing array: 1 MB
chunk := data[:100]              // no copy — same backing array, chunk is just a 24-byte header
                                 // GC sees the entire 1 MB as reachable via chunk
```

Workaround: copy the portion you need instead of reslicing.

**Append past capacity allocates a new backing array.** Any existing references to the old backing array are not updated — they keep pointing to the old array:

```go
a := make([]int, 0, 5)           // backing array A (cap=5)
b := a[:2]                       // b shares backing array A — same memory, no copy
a = append(a, 1, 2, 3, 4, 5, 6) // cap exceeded, allocates new backing array B
                                 // a now points to B, b still points to A — they diverge
```

## Map Memory Never Shrinks

Map memory is **always on the heap** — both the `hmap` header and the bucket array are allocated by `runtime.makemap()` via `newobject`, with no stack allocation code path [^9].

Even a pre-defined literal:
```go
m := map[string]int{"a": 1}  // compiles to makemap() + inserts — heap
```

`map[string]int` can have 0 buckets or a million. Stack frames are fixed at compile time, but maps can always grow — so the compiler can never reserve stack space for them. Compare with arrays where `[^2]int` and `[100000]int` are different types with known sizes at compile time [^14].

Pre-allocating (`make(map[string]int, 10000)`) only pre-sizes the initial buckets to reduce future growth. Buckets are still on the heap [^9].

Deleting map entries (`delete(m, k)`, `clear(m)` [^8]) removes keys from the hash table but never releases the underlying buckets [^9]. A map that grows to 1 GB and then has 99% of entries deleted still uses ~1 GB of RAM [^9]. The only way to release memory is to stop referencing the map and let the GC collect it, or re-create the map from scratch.

## `sync.Pool`

Temporary object cache [^10]. At each GC cycle, the pool's primary cache moves to a victim cache, and the old victim cache is freed [^15]. A pooled object survives up to 2 GC cycles before being reclaimed. Always handle `Get()` returning nil — the pool may have been emptied:

```go
buf := pool.Get()
if buf == nil {
    buf = new(Buffer)
}
// use buf
pool.Put(buf)
```

Lifetime of a pooled object: `Put()` → 1–2 GC cycles. How long that is depends on allocation rate and GOGC pacing. Do not use for long-lived or connection-pool semantics.

## `runtime.KeepAlive`

Prevents the GC from collecting an object too early, specifically when only an `unsafe.Pointer` references the object [^11]:

```go
p = alloc()
runtime.KeepAlive(p)  // ensures p is not freed before this line
```

Needed when passing `&p.field` to C or using `unsafe.Pointer` arithmetic where the GC cannot see the reference. Without `KeepAlive`, the GC can reclaim `p` while your code reads its fields.

## Memory Leak Patterns

| Pattern | Cause | Fix |
|---|---|---|
| Goroutine leak | Goroutine blocked on never-sent chan / never-closed chan. Stack+liveness never freed. | Ensure goroutines always terminate. |
| `time.After` in loop | `time.After` creates a timer that lives until it fires. In a `for` loop, timers accumulate. | Use `time.NewTicker` or `context.WithDeadline`. |
| Hanging slice reference | Small reslice of large array pins the backing array. | Copy the portion. |
| `defer` in loop | Deferred resources accumulate until function return. | Move loop body into a closure, or don't `defer` inside loops. |
| Map growth without shrinking | Map grows large, entries deleted, buckets never freed. | Re-create the map. |

## Diagnostics

**`runtime.ReadMemStats`** dumps all memory stats (HeapAlloc, HeapInuse, NumGC, PauseTotalNs, etc.) [^12]. Incurs a small STW pause — fine for debugging, avoid in production hot paths.

**`runtime/metrics`** (Go 1.16+) is the production-safe alternative [^13]. Reads pre-computed counters with no STW cost:

```go
sample := []metrics.Sample{{Name: "/memory/classes/heap/objects:bytes"}}
metrics.Read(sample)
fmt.Println(sample[0].Value.Uint64())
```

Use `go tool pprof` for allocation profiling (see [gc.md](gc.md)).

## References

[^1]: Go GC Guide, "Where Go Values Live": https://go.dev/doc/gc-guide#Where_Go_Values_Live

[^2]: Go GC Guide, "Understanding costs": https://go.dev/doc/gc-guide#Understanding_costs

[^3]: Getting to Go (ISMM 2018): https://go.dev/blog/ismmkeynote

[^4]: Go Spec, "Representation of values": https://go.dev/ref/spec#Representation_of_values

[^5]: Go Spec, "Array types" / "Slice types": https://go.dev/ref/spec#Array_types

[^6]: Go runtime source, `runtime/string.go`, `runtime/slice.go`: https://go.dev/src/runtime/

[^7]: Go Spec, "Size and alignment guarantees": https://go.dev/ref/spec#Size_and_alignment_guarantees

[^8]: Go Spec, "Clear statement": https://go.dev/ref/spec#Clear_statement

[^9]: Go runtime source, `runtime/map.go` (`makemap` allocates on heap, `mapdelete` does not shrink buckets): https://go.dev/src/runtime/map.go

[^10]: `sync.Pool` docs: https://pkg.go.dev/sync#Pool

[^11]: `runtime.KeepAlive` docs: https://pkg.go.dev/runtime#KeepAlive

[^12]: `runtime.ReadMemStats` docs: https://pkg.go.dev/runtime#ReadMemStats

[^13]: `runtime/metrics` docs: https://pkg.go.dev/runtime/metrics

[^14]: Go Spec, "Map types": https://go.dev/ref/spec#Map_types

[^15]: Go runtime source, `sync/pool.go` (`poolCleanup` runs at the beginning of each GC, moves primary→victim cache): https://go.dev/src/sync/pool.go
