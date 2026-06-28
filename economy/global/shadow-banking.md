---
title: "Shadow Banking"
aliases: []
tags: [economy/global]
created: "2026-06-13"
---

# Shadow Banking

## What Is Shadow Banking?

Shadow banking refers to credit intermediation that takes place outside the traditional banking system, without deposit insurance, without access to central bank lending facilities, and with less regulation. Despite the name, shadow banks are not a hidden conspiracy they include money market funds, securities dealers, special purpose vehicles (SIVs, conduits), finance companies, hedge funds, and private credit funds.

By 2007, roughly 50% of US lending occurred through shadow banks. Their defining vulnerability: they fund long-term, illiquid assets with short-term, runnable liabilities the same maturity transformation that makes banks fragile, but without the safety net.

## The Key Entities

| Institution | How it borrows (liabilities) | What it lends to (assets) |
|------------|-----------------------------|-------------------------|
| **Money market funds** | Overnight shares (demandable at par) | Commercial paper, repo |
| **SIVs / conduits** | 30–90 day commercial paper | Mortgage-backed securities, ABS |
| **Securities dealers** | Overnight repo | Treasuries, MBS, corporate bonds |
| **Private credit funds** | Investor commitments, leverage | Corporate loans, real estate |
| **Hedge funds** | Prime broker leverage, repo | Various strategies |

## Repo and the Wholesale Funding Run

**Repo** (repurchase agreement) is a secured, short-term loan: "I lend you $100M overnight, you give me Treasuries as collateral." It functions like a deposit for institutional investors safe, liquid, and rolled daily.

The vulnerability: if the lender doubts the collateral's value, they demand a higher **haircut** or refuse to roll. When this happens simultaneously across many lenders, a **wholesale funding run** occurs the shadow bank cannot fund its assets and is forced into fire sales.

The 2008 crisis was fundamentally a wholesale funding run. When MBS prices fell, repo lenders demanded Treasuries-only collateral. Hedge funds and dealers were forced to sell assets, driving prices lower and triggering more margin calls (see [financial-crises.md](financial-crises.md) for the full propagation chain).

## Maturity Transformation Without a Backstop

Traditional banks take short-term deposits and make long-term loans. They survive runs because of deposit insurance and the Fed's discount window. Shadow banks do the same transformation but without either protection:

| | Banks | Shadow banks |
|--|-------|-------------|
| Funding source | Insured deposits | Repo, CP, money market shares |
| Insurance | FDIC ($250K per depositor) | None |
| Lender of last resort | Fed discount window | None |
| Capital requirements | Basel III (4.5% CET1 + buffers) | Minimal or none |
| Liquidity requirements | LCR, NSFR | None |

This gap identical economic function, no safety net is why shadow banking was at the center of the 2008 crisis.

## The Shadow Banking System Today

Post-2008 regulation pushed some activity into the regulated banking system but also created new shadow banking channels:

- **Money market funds** were reformed after the Reserve Primary Fund "broke the buck" in 2008 prime institutional MMFs now have floating NAVs
- **Private credit** (direct lending by non-bank funds) has grown dramatically, now managing over $1.5T, funded by insurance companies and pension funds
- **Fintech lenders** originate loans and sell them to asset managers rather than holding them on balance sheets
- **LDI funds** (liability-driven investment by UK pension funds) triggered a crisis in 2022 (see [financial-crises.md](financial-crises.md))

The cycle persists: regulation pushes risk out of the banking system → shadow banking absorbs it → the next crisis exposes the unprotected leverage → more regulation. This is the **regulatory arbitrage cycle**.
