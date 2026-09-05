---
title: Computing
description: >-
  How computers actually work: CPU caches, memory hierarchies, and the hardware
  fundamentals that explain latency and performance.
aliases: []
tags:
  - cs
  - cs/computing
created: '2026-06-13'
modified: '2026-09-05'
---

# Computing

### CPU Cache (L1, L2, L3)

Your CPU is blindingly fast, but RAM is relatively slow. Every time the CPU has to wait for data to travel across the motherboard from the RAM, it sits idle doing absolutely nothing. This wasted time is called a **latency penalty**.

Ultra-fast pools of memory directly inside the CPU chip itself. These pools are called 
**Caches**. Instead of using the slow technology found in RAM (DRAM), caches use an expensive, lightning-fast technology called **SRAM (Static RAM)**.
```
    [ CPU Core ]
         /\        
        /  \    L1 Cache  (Fastest, Smallest, Private)
       / L1 \      |
      /___ __\     v
     /        \    L2 Cache  (Fast, Medium, Usually Private)
    /    L2    \     |
   /____ _______\    v
  /              \   L3 Cache  (Slower, Largest, Shared across all cores)
 /       L3       \    
/__________________\   
         ||
   [ System RAM ] (Slowest, Massive, Outside the CPU)
```

### Registers

The fastest memory locations in existence, located inside the CPU core.

* **General Purpose:** Holds immediate data being processed (e.g., operands for addition).
* **Program Counter (PC):** Holds the address of the _next_ instruction to be executed.
* **Stack Pointer (SP):** Holds the memory address of the "top" of the stack to manage function calls.

## The Execution Cycle (Fetch-Execute)

```
       ┌────────────────────────┐
       │         FETCH          │ ◄─────────────────────────┐
       │ (Get code from RAM/    │                           │
       │  using Program Counter)│                           │
       └───────────┬────────────┘                           │
                   │                                        │
                   ▼                                        │
       ┌────────────────────────┐                           │
       │         DECODE         │                           │
       │ (Control Unit breaks   │                           │
       │  down the binary code) │                           │
       └───────────┬────────────┘                           │ Loop
                   │                                        │ Continues
                   ▼                                        │ Infinitely
       ┌────────────────────────┐                           │
       │        EXECUTE         │                           │
       │ (ALU does the math or  │                           │
       │  manipulates registers)│                           │
       └───────────┬────────────┘                           │
                   │                                        │
                   ▼                                        │
       ┌────────────────────────┐                           │
       │   STORE (WRITE-BACK)   │                           │
       │ (Save results back to  │───────────────────────────┘
       │  Registers or RAM)     │
       └────────────────────────┘
```

### FETCH: Grabbing the Instruction

Before the CPU can do anything, it has to fetch the next instruction from the program layout in memory.

- **Program Counter (PC):** A internal register that holds the exact memory address of the _next_ instruction waiting to be executed.
    
    - **Memory Address Register (MAR) & Address Bus:** The staging ground and the physical highway.
        
- **The Detailed Process:** 
1. The CPU looks at the **Program Counter**. Let’s say it says address `#1004`. 
2. The CPU copies that address into the **MAR**, which drops it onto the physical **Address Bus**. 
3. The signal travels to the memory (Cache or RAM) to read slot `#1004`. 
4. The RAM spits out the raw binary code stored in that slot, sends it back across the **Data Bus**, and it gets stored in the **Instruction Register (IR)** inside the CPU. 
5. **Crucial Next Step:** The instant the fetch is complete, the **Program Counter automatically increments** (changes to `#1005`) so it is already pointing to the next instruction for the next cycle.

### DECODE: Figuring Out What It Means

At this point, the instruction is just a raw string of 1s and 0s (machine code) sitting in the Instruction Register. The CPU core doesn't know what it means yet.
### EXECUTE: Doing the Heavy Lifting

Now that the CPU knows exactly what is being asked, it actually performs the command.

- **Arithmetic Logic Unit (ALU):** The internal calculator that performs all mathematical operations (addition, subtraction) and logical comparisons (AND, OR, checking if two numbers are equal).

### STORE (WRITE-BACK): Saving the Results

The operation is complete, but the result is currently just floating output on an internal CPU circuit. It needs a permanent home before the next cycle wipes it out.

- **Registers / System RAM:** The destination options.
    
    - **Data Bus:** The highway used if the data needs to leave the CPU chip.
        
- **The Detailed Process:** 
1. The output from the Execution stage is taken and written into its final destination. 
2. **Register Write:** Most often, it's saved right back into an internal CPU register because the next line of code will probably need it immediately. This happens instantly. 
3. **Memory Write:** If the code explicitly says to save it back to the computer's memory (like saving a file), the Memory Controller opens the gateway, sends the data out over the **Data Bus**, and saves it to a permanent address in the RAM.

### Virtual Memory Layout (OS Dependent)

The OS divides a program's virtual address space into specific segments. Each process sees its own private layout, but the structure is defined by the OS kernel.
```
+-----------------------------------+  High Memory Addresses
|      Kernel Space                 |  (Reserved for the OS)
+-----------------------------------+
|      Stack (Grows Downward ↓)     |  (Temporary function data)
|         |                         |
|         v                         |
|                                   |
|         ^                         |
|         |                         |
|      Heap (Grows Upward ↑)        |  (Dynamic, user-managed data)
+-----------------------------------+
|      BSS Segment                  |  (Uninitialized global variables)
+-----------------------------------+
|      Data Segment                 |  (Initialized global variables)
+-----------------------------------+
|      Text (Code) Segment          |  (The actual code instructions)
+-----------------------------------+  Low Memory Addresses
```

Kernel Space (The Restricted Zone)
- **What it's for:** This is the top-secret zone reserved exclusively for the core of the Operating System (the Kernel).
- **How it works:** Your program lives in the space below it, but the OS map hooks this section up to the absolute highest address numbers. Your program cannot touch or read this zone directly; if it tries, the computer crashes the program for security.

The Stack (The Fast, Automatic Storage)
- **What it's for:** It stores temporary data used by functions, like local variables or a history of which function called which.
- **How it connects/works:** It starts at the top and **grows downward** toward the middle. It handles things automatically. When a function finishes running, everything it stored on the Stack is instantly wiped away.

The Heap (The Flexible, Manual Storage)
- **What it's for:** This is the big, open pool of memory used for data that needs to outlive a single function—like a massive list of users or a giant image file.
- **How it connects/works:** It starts near the bottom and **grows upward** toward the Stack. Unlike the Stack, the Heap is completely manual. The programmer has to explicitly ask for space here and must remember to clean it up when they are done, otherwise it causes a "memory leak."

BSS & Data Segments (The Global Rooms)
- **What they're for:** They store **Global Variables** (variables that are accessible anywhere in the entire program, not just inside one function).
- **The difference:** * **Data Segment:** For global variables that _have_ a starting value (e.g., `int score = 100;`).
-  **BSS Segment:** For global variables that _don't_ have a starting value yet (e.g., `int score;`). The system automatically sets these to zero when the program boots up.

Text / Code Segment (The Instruction Manual)
- **What it's for:** This contains the literal machine code instructions (the 1s and 0s) compiled from your source code.
- **How it works:** It sits at the absolute bottom of the layout. To prevent a program from accidentally overwriting its own code while running, this segment is strictly **read-only**.

## VRAM vs Physical RAM

**VRAM** (Video RAM) is memory physically located on a graphics card (GPU). **Physical RAM** (system RAM) is attached to the CPU. They serve different purposes and have distinct characteristics.

| Aspect | Physical RAM (DDR4/DDR5) | VRAM (GDDR6 / HBM) |
| -------------------- | -------------------------------- | ----------------------------------------------------------- |
| **Primary user** | CPU | GPU |
| **Latency** | Lower (\~70‑100 ns) | Higher (\~150‑300 ns) |
| **Bandwidth** | Moderate (\~50‑100 GB/s) | Very high (\~500‑2000 GB/s) |
| **Capacity** | Larger (up to 2 TB on servers) | Smaller (typically 4‑24 GB for gaming, up to 80 GB for HPC) |
| **Error correction** | ECC optional (common in servers) | ECC rarely used (except in professional cards) |
| **Access pattern** | Random (caches hide latency) | Sequential / streaming (optimised for throughput) |
| **Voltage** | 1.1‑1.2 V (DDR4) | 1.35‑1.5 V (GDDR6) |

**How CPU and GPU share data**

* **Discrete GPU (dedicated card):** The CPU cannot directly access VRAM. Data must be copied over the PCIe bus using DMA. This copy is slow (≈16‑32 GB/s for PCIe 4.0). Example: game textures are loaded from system RAM → VRAM before rendering.
* **Integrated GPU (iGPU):** The GPU shares system RAM (no separate VRAM). This reduces cost but severely limits bandwidth (system RAM is slower than dedicated VRAM).
* **Unified Memory (Apple M‑series, AMD APU):** Physical RAM is accessible by both CPU and GPU without copying. Hardware cache coherence ensures consistency. This eliminates the PCIe bottleneck.

**When to care about VRAM vs System RAM**

* **Game / 3D rendering:** VRAM capacity and bandwidth determine maximum texture resolution and frame rate.
* **Machine learning (training):** Large models (e.g., LLaMA 70B) require VRAM to hold weights and activations. If VRAM overflows, data spills to system RAM (very slow).
* **Compute (CUDA / OpenCL):** Data resides in VRAM while GPU kernels run. Moving data back and forth should be minimised.

## Bits & Bytes

This section explains the relationship between bits, bytes, and common encoding schemes.

A **bit** is the smallest unit of information in computer **0 or 1**.

* 1 bit → 2 possibilities → `0`, `1`
* 2 bits → 2² = 4 possibilities → `00`, `01`, `10`, `11`
* 3 bits → 2³ = 8 possibilities
* 8 bits → 2⁸ = 256 possibilities → **1 byte**

If you have **n bits**, you can represent **2ⁿ unique values**.

| Encoding | Bits per symbol | Example characters |
| ---------------- | -------------------- | ------------------- |
| **Base2** | 1 | 0,1 |
| **Base16 (hex)** | 4 bits per char | 0–9, A–F |
| **Base32** | 5 bits per char | A–Z, 2–7 |
| **Base58** | \~5.86 bits per char | Bitcoin addresses |
| **Base62** | \~5.95 bits per char | 0–9, A–Z, a–z |
| **Base64** | 6 bits per char | A–Z, a–z, 0–9, +, / |

**Example**

If you need to generate 10,000 unique codes per day using Base64 and codes can be at most 8 characters long, each code represents 48 bits, giving 2^48 ≈ 2.8 × 10^14 possible values more than enough for 10,000 per day.
