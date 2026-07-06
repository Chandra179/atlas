---
title: "Memory Management"
aliases: []
tags: [golang]
created: "2026-07-06"
---

# Memory Management

## Stack vs Heap

Memory is divided into two regions of RAM, managed differently.

**Stack:** Structured, LIFO. Each goroutine has its own stack. When a function returns, its stack frame is popped instantly — zero cleanup needed. No GC involvement [1].

**Heap:** Chaotic, any-size allocations at arbitrary addresses. Requires GC to find and free dead objects [1].

The GC only scans the stack during Mark Preparation (to find root pointers pointing into the heap). After that, it ignores the stack entirely [1] [3].

## Escape Analysis

At compile time, the Go compiler decides where a variable lives:

| Condition | Placement |
|---|---|
| Variable never leaves the function scope | Stack |
| Variable is returned from the function | Heap |
| Variable is shared across goroutines | Heap |
| Variable is too large for the stack | Heap |

Kept on the stack = automatically freed, zero GC cost. Escaped to the heap = GC tracks it [1].

## Memory Layout

**Nested structs as values** are flattened into a single contiguous block of RAM. The GC scans them in one read — no jumps [4].

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

Reading `Slots` requires two heap lookups: `Game → Player → Inventory`. Every `*` is a cache-miss risk and a GC scan cost [2] [3].

## Pointer Chasing

The GC traverses the heap by following pointers. Every nested pointer adds a latency lookup — the GC pauses at each one, fetches the address from RAM, and continues. With millions of pointer-heavy objects, the GC spends most of its marking time waiting on memory lookups [2].

This also hurts application code: CPUs cache contiguous memory (cache lines). A flat struct loads into cache in one shot. A pointer chain scatters data across cache lines, causing cache misses that stall the CPU [3].

## Strings

A `string` in Go is a 16-byte value type: an 8-byte pointer to text data + an 8-byte length [6]. Copying a string (or a struct containing one) copies only the header, not the underlying text. Strings never need a pointer to stay efficient.

## Arrays vs Slices

| Type | Behavior on copy | GC impact |
|---|---|---|
| `[N]T` (array) | Copies all N elements — expensive for large N [4] | Stays on stack if small |
| `[]T` (slice) | Copies 24-byte header (ptr + len + cap). Backing array is shared [5] [6] | Header on stack, backing array on heap |

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

The GC cares more about the **number of reachable pointers** than the **total heap size**. A 100 MB flat array of integers is near-free for the GC to scan. A 10 MB web of interconnected pointer-heavy structs is expensive [2].

## References

[1] Go GC Guide, "Where Go Values Live": https://go.dev/doc/gc-guide#Where_Go_Values_Live

[2] Go GC Guide, "Understanding costs": https://go.dev/doc/gc-guide#Understanding_costs

[3] Getting to Go (ISMM 2018): https://go.dev/blog/ismmkeynote

[4] Go Spec, "Representation of values": https://go.dev/ref/spec#Representation_of_values

[5] Go Spec, "Array types" / "Slice types": https://go.dev/ref/spec#Array_types

[6] Go runtime source, `runtime/string.go`, `runtime/slice.go`: https://go.dev/src/runtime/
