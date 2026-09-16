# Data


```
MEDIUM
  Physical RAM (a 4 KB page in a DIMM stick)
      │
CACHE / BUFFER
  OS page cache — the 4 KB page is already in RAM (no disk read needed)
      │
STORAGE MECHANISM
  Process virtual memory — the OS maps that physical page into
  your process's address space at, say, 0x7f3a2c000000
      │
ALLOCATION STRATEGY
  HEAP — the allocator (glibc ptmalloc) carved a chunk out of
  the process's heap region via brk/mmap
      │
ALLOCATION UNIT
  One heap chunk — glibc gives you 32 bytes (minimum on 64-bit),
  even though "Hi" is only 2 characters. The other 30 bytes are
  wasted (internal fragmentation).
      │
DATA STRUCTURE
  Dynamic array (e.g., C++ std::string):
    ┌──────────────────────────────────────────────────┐
    │  pointer → 0x7f3a2c000000                        │
    │  size    → 2                                     │
    │  capacity→ 32                                    │
    └──────────────────────────────────────────────────┘
  The actual characters live at the pointed-to buffer:
    [H][i] [wasted space...]
      │
DATA TYPE
  `string` — a sequence of Unicode characters
  (the value is: the abstract sequence "H", "i")
      │
ENCODING
  UTF-8 — the rule that says:
    'H' → 0x48
    'i' → 0x69
  (For ASCII-range chars, UTF-8 is 1 byte per char)
      │
BYTES
  0x48  0x69
  (two bytes, sitting in that 32-byte heap chunk)   
```