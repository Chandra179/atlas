---
title: "Export Controls"
aliases: []
tags: [economy/global]
created: "2026-06-13"
---

# Export Controls

Export controls physically **block** what you can buy or sell unlike tariffs (which raise the price) and sanctions (which freeze financial assets).

## The Semiconductor War

### What's Controlled

The US, Netherlands, and Japan formed a coalition to restrict China's access to advanced chip-making technology:

| Item | Who makes it | Why it matters |
|------|-------------|----------------|
| **EUV lithography machines** | ASML (Netherlands) | Required for chips < 7nm. Physically massive (~200 tons), requires ASML service, has remote monitoring |
| **DUV lithography (advanced models)** | ASML | Older tech but can still make 7nm with multi-patterning these are now partially restricted too |
| **Chip design software (EDA)** | Cadence, Synopsys (US) | Needed to design modern processors |
| **Chemical etching equipment** | Tokyo Electron (Japan) | Critical for multi-layer chip fabrication |

### How China Fights Back

**Huawei Mate 60 Pro (2023):** It contained a **7nm chip** (Kirin 9000s) made by **SMIC** (China's largest foundry). This proved China could make advanced chips without the best ASML machines.

**The method multi-patterning:**
- SMIC used older ASML machines (DUV, not banned at the time)
- Each wafer is run through the machine 4x, overlapping exposures to create finer features
- Like printing a high-res image on a low-res printer by printing 4 times and overlapping

| | Normal (TSMC) | SMIC multi-patterning |
|--|---------------|----------------------|
| Yield | 90%+ | ~50-70% |
| Time per wafer | 1x | 4x |
| Cost per chip | Low | High |

### China's Retaliation

China banned export of **rare earth elements** (EV motors, wind turbines, fighter jets, phone screens). China controls ~90% of global rare earth refining. Also restricted **gallium and germanium** (semiconductors, fiber optics).

### The Asymmetry

| | US / Allies | China |
|--|-------------|-------|
| Leverage | Chip *making* tools (hard to replicate) | Rare earth *processing* (hard to replicate) |
| Time horizon | China can't build its own ASML EUV in < 10 years | US/Europe building alternative rare earth supply (5-7 years) |
| Mutual pain | China's AI/military chip development stalls | US EV production, military optics, fighter jets hit |

## Can China Get Around It?

### Transshipment

Routing restricted goods through third countries (Malaysia, Singapore, Hong Kong). The US responded with **foreign direct product rule** if a chip is made with US technology *anywhere in the world*, it's controlled. ASML machines in Taiwan can't be resold to China. TSMC can't make chips for Huawei.

### Reverse Engineering

China has reverse-engineered some older ASML models. But EUV machines require:
- Mirrors so smooth a 1mm bump would be a mountain (atomic-level precision)
- Vacuum chambers the size of a bus
- A supply chain of 5000+ suppliers in Europe

Copying the design isn't enough the *manufacturing ecosystem* can't be replicated quickly.

### Recruiting Talent

ASML engineers being hired by Chinese companies has been reported. But ASML machines have:
- **Remote kill switches** if a machine moves to a banned customer, ASML can shut it down
- **Mandatory service contracts** the machines break without ASML technicians

## Where China Stands Today

| Node | China can do | Dependency |
|------|-------------|-----------|
| 28nm+ (mature) | Yes, abundant | None |
| 14nm | Yes, decent yield | None |
| **7nm** | **Yes (SMIC), low yield, expensive** | DUV lithography (partially restricted) |
| 5nm | No | EUV lithography (fully blocked) |
| 3nm | No | EUV lithography (fully blocked) |
| 2nm | No | EUV lithography (fully blocked) |
| AI chips for military | Limited low yield, low volume | Needs production at scale |

The gap: China can make *some* advanced chips for phones (millions of units), but for data centers and military AI (hundreds of millions), they can't produce efficiently enough. The bottleneck isn't the science it's the **tooling**.

---

## Related

- [Supply Chain Advantages](supply-chain.md) why China's manufacturing ecosystem is hard to replicate
- [Trade & Tariffs](trade.md) how export controls differ from tariffs
- [The Dollar System](dollar-system.md) financial sanctions as a parallel weapon
