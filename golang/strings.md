---
title: "Strings"
aliases: []
tags: [golang]
created: "2026-06-13"
---

# Strings

A string in Go is an immutable sequence of bytes, typically used for text. This guide covers how to build strings efficiently, how to slice and search them, and how to navigate Go's UTF-8 model.

## Concatenation The Wrong Way

Using `+=` for string concatenation is an **inefficient approach** especially with large or numerous strings. Every `+=` copies the entire growing string, like rewriting a book from scratch each time you add a sentence.

```go
func concat(values []string) string {
 s := ""
 for _, value := range values {
 s += value // Each iteration allocates and copies
 }
 return s
}
```

Each loop iteration:

1. **Allocates** a new backing array big enough for both the old content and the new part.
2. **Copies** every byte from the old string into the new array.
3. **Discards** the old array, leaving it for the garbage collector.

With 10,000 strings, that's 10,000 allocations and roughly 50 million bytes copied most of it work already done and thrown away.

## `strings.Builder` The Right Way

`strings.Builder` manages an internal byte slice that grows on demand. Instead of creating a new string per `+=`, it appends bytes to the same buffer.

```go
import "strings"

func concat(values []string) string {
 var sb strings.Builder
 for _, value := range values {
 sb.WriteString(value)
 }
 return sb.String()
}
```

`WriteString` appends to the buffer. `String()` reads the final buffer as a string no intermediate copies.

### Pre-allocating with `Grow`

If you know the total size ahead of time, call `Grow` to allocate the buffer once:

```go
func concat(values []string) string {
 total := 0
 for _, value := range values {
 total += len(value)
 }

 var sb strings.Builder
 sb.Grow(total)

 for _, value := range values {
 sb.WriteString(value)
 }
 return sb.String()
}
```

This eliminates resizing overhead. One allocation, one final string the optimal path.

## `strings.Join` The Simplest Way for Slices

If you already have a `[]string`, `Join` is even simpler than Builder:

```go
result := strings.Join(values, "")
```

It pre-calculates the total length, allocates once, and fills the buffer all in a single function call. Use this unless you need incremental building (e.g., streaming data).

## Substrings and Slicing

Strings support slicing with the same `s[i:j]` syntax as slices:

```go
s := "hello world"
greeting := s[:5] // "hello"
world := s[6:] // "world"
mid := s[1:4] // "ell"
```

Slicing a string does **not** allocate it creates a new header pointing into the same backing array. This is O(1) and cheap.

## `string` vs `[]byte`

| Type | Mutable? | Use case |
|------|----------|----------|
| `string` | No | Text you read or pass around |
| `[]byte` | Yes | Buffers you build or modify |

Convert between them:

```go
b := []byte("hello") // string → []byte (allocates)
s := string(b) // []byte → string (allocates)
```

Both conversions allocate because `[]byte` is mutable and `string` must remain immutable Go copies the data to break the reference.

## Essential `strings` Package

| Function | What it does |
|----------|-------------|
| `Contains(s, sub)` | Reports whether `sub` is in `s` |
| `Count(s, sub)` | Counts non-overlapping instances |
| `HasPrefix(s, pre)` | Reports whether `s` starts with `pre` |
| `HasSuffix(s, suf)` | Reports whether `s` ends with `suf` |
| `Index(s, sub)` | Returns the first index of `sub`, or -1 |
| `Replace(s, old, new, n)` | Replaces `n` occurrences (`-1` = all) |
| `Split(s, sep)` | Splits into a `[]string` |
| `Trim(s, cutset)` | Removes leading/trailing characters in `cutset` |
| `Fields(s)` | Splits on whitespace |

```go
s := " hello, world! "
strings.Contains(s, "world") // true
strings.Replace(s, "hello", "hi", 1) // " hi, world! "
strings.Trim(s, " ") // "hello, world!"
strings.Fields(s) // ["hello,", "world!"]
```

## Runes and UTF-8

A Go string is a byte sequence, not a character sequence. One Unicode character (a *rune*) can span multiple bytes.

```go
s := "hello"
len(s) // 5 count of bytes
utf8.RuneCountInString(s) // 5 count of runes (same here, ASCII)

emoji := "🚀"
len(emoji) // 4 four bytes
utf8.RuneCountInString(emoji) // 1 one rune
```

Range over a string yields runes automatically:

```go
for i, r := range "hello 🚀" {
 fmt.Printf("%d: %c\n", i, r)
}
// 0: h
// 1: e
// 4: l
// ...
// 6: 🚀
```

If you need individual runes, use `[]rune(s)` to decode but this allocates.
