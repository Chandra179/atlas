---
title: "Exchange Rates"
aliases: []
tags: [economy/global]
created: "2026-06-13"
---

# Exchange Rates

## Exchange Rate Regimes

- **Floating (flexible)**: the market determines the exchange rate. The central bank does not intervene. Examples: US dollar, euro, yen.
- **Fixed (pegged)**: the central bank commits to buy or sell its currency at a specific rate against a foreign currency (usually the dollar). Examples: Saudi riyal, Hong Kong dollar.
- **Managed float** (dirty float): the market sets the rate within a band, but the central bank intervenes to smooth volatility or lean against trends. Examples: China's yuan, Singapore dollar.
- **Currency board**: a legislated commitment to exchange domestic currency for a reserve currency at a fixed rate, backed by 100% foreign reserves. Examples: Bulgaria, Hong Kong (historically).
- **Dollarization**: a country abandons its own currency and uses the US dollar exclusively. Examples: Ecuador, El Salvador, Zimbabwe.

The choice of regime involves a trade-off: fixed rates reduce exchange rate risk and anchor inflation expectations but sacrifice independent monetary policy (the impossible trinity see [open-economy.md](../macro/open-economy.md)).

## Purchasing Power Parity

**Absolute PPP**: the exchange rate between two currencies equals the ratio of their price levels:

$$e = \frac{P}{P^*}$$

A basket of goods should cost the same in both countries when measured in the same currency the **law of one price** applied to the aggregate economy.

**Relative PPP**: the percentage change in the exchange rate equals the inflation differential between the two countries:

$$\frac{\Delta e}{e} = \pi - \pi^*$$

PPP holds reasonably well in the long run for tradable goods but fails in the short run due to transport costs, tariffs, non-tradable services, and sticky prices. The **Big Mac Index** (The Economist) illustrates the gap between actual exchange rates and PPP.

## Interest Rate Parity

**Covered interest parity (CIP)** : the difference between domestic and foreign interest rates equals the forward premium, eliminating arbitrage in forward markets. CIP holds tightly in normal times.

**Uncovered interest parity (UIP)** : the expected depreciation of the domestic currency equals the interest rate differential:

$$i = i^* + \frac{E(e_{t+1}) - e_t}{e_t}$$

UIP is the cornerstone of open-economy macro models but performs poorly empirically the **forward premium puzzle**: currencies with high interest rates tend to appreciate rather than depreciate, contrary to UIP.

## Real Effective Exchange Rate

The **real effective exchange rate (REER)** is the trade-weighted average of a country's real exchange rate against its major trading partners:

$$REER = \prod_i \left( \frac{e_i \times P}{P_i} \right)^{w_i}$$

where w_i are trade weights. REER measures a country's international price competitiveness. A rising REER (appreciation) makes exports more expensive and imports cheaper; a falling REER does the opposite.

## Balassa-Samuelson Effect

Countries with higher productivity in tradable goods (manufacturing) have higher price levels for non-tradable goods (services), and therefore higher overall price levels and stronger real exchange rates. This explains why rich countries tend to have more expensive non-tradable goods (haircuts, rent) than poor countries, even when tradable goods (iPhones, cars) cost similar amounts.

A rapidly growing developing economy typically experiences real exchange rate appreciation through this channel not because of monetary policy, but because productivity growth in manufacturing pulls up wages economy-wide.

## Carry Trade and the Forward Premium Puzzle

The **carry trade** borrowing in a low-interest-rate currency and lending in a high-interest-rate currency has historically generated positive average returns. This violates uncovered interest parity, which predicts that high-interest-rate currencies should depreciate enough to offset the interest advantage. The **forward premium puzzle** is the empirical finding that the forward premium systematically mispredicts future spot rate changes.

Carry trade returns are punctuated by crash risk: when risk appetite suddenly vanishes (e.g., 2008, COVID), carry trades unwind violently, and high-yield currencies depreciate sharply against funding currencies (yen, Swiss franc). The positive average return is compensation for this crash risk.

## China Case Study

China operates a **managed float** with the yuan (CNY) traded within a ±2% band against a dollar-centered basket. The **counter-cyclical factor** in the daily midpoint setting dampens herd behavior if the market pushes the yuan down, the formula pushes the midpoint up, discouraging one-way speculative bets.

China maintains a **closed capital account**: individuals face a $50,000 annual foreign exchange quota, companies need government approval for large outward investments, and foreign investors cannot freely move capital in and out. This shields the yuan from speculative attacks but prevents it from becoming a global reserve currency the yuan is ~3% of global reserves versus the dollar's ~58%.
