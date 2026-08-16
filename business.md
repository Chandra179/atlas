---
title: "Business Knowledge Map"
description: "A knowledge map of business models, industries, and market trends, organized through a first-principles chain from scarcity to the mechanisms reshaping each industry today."
tags: [business, frameworks]
created: 2026-08-08
---
# Business Knowledge Maps

This framework is a **first-principles taxonomy of modern business and technology**. Instead of viewing industries and software applications as isolated entities, this map traces how every commercial activity, from a local retail POS system to generative AI platforms, stems from a single foundational reality.

---

## Level 0: The Absolute Core

The single irreducible fact: human wants/needs exceed available resources. Time, matter, energy, and labor are finite; wants are not. If resources were infinite, nothing below this line would need to exist.

---

## Level 1: Scarcity Forces a Problem

Once resources are scarce, something has to decide "who gets what?" This is where supply and demand lives, not the core fact itself, but the mechanism that answers it.

---

## Level 2: Allocation Requires Solving Sub-Problems

Making supply/demand work between strangers requires solving four things:

- **Trust**: will the other side hold up their end?
- **Coordination**: how do millions of people transact without chaos?
- **Information**: do both sides know what they're trading?
- **Incentive alignment**: why act honestly instead of cheating?

---

## Level 3: Humans Invent Tools/Institutions

Each Level 2 sub-problem gets solved with its own set of institutions:

| **Sub-problem**       | **Institutions invented to solve it**            |
| ----------------------- | --------------------------------------------------- |
| Trust                    | Money, contracts, reputation, law                   |
| Coordination              | Markets, prices, standards (shipping containers, currencies) |
| Information                | Advertising, reviews, credit scores                |
| Incentives                  | Property rights, competition, regulation           |

---

## Level 4: Tools Applied to Physical/Digital Reality

Level 3 institutions get pointed at real-world problems and turn into applied tools:

| **Level 3 Institution** | **Applied As (Level 4 Tool)**                        |
| -------------------------- | -------------------------------------------------------- |
| Trust (money, contracts)    | Banking, credit, BNPL, payments                          |
| Coordination (markets)      | Trade/exchange: logistics, supply chains                |
| Incentives (property rights) | Property/ownership: ownership models, leasing, subscriptions |
| All of the above, applied to physical output | Production: factories, robotics, automation |

**How deep software has taken over each Level 4 tool.** This is the "software's role" question, asked before any specific industry exists:

| **Level 4 Tool**    | **Software's Role**                                                           |
| ------------------- | ----------------------------------------------------------------------------- |
| Trade/exchange      | Core. Ecommerce platforms and marketplaces literally *are* software.          |
| Money/credit        | Core. Banking, payments, BNPL now run as software systems.                    |
| Property/ownership  | Support. Software tracks/manages; the asset itself is physical/legal.         |
| Production          | Growing core. Software increasingly controls robotics/automation directly.    |
| Movement/logistics  | Core. Routing, tracking, fleet management is almost entirely software-driven. |
| Information systems | Is software. This Level 4 tool and software are effectively the same thing.   |

---

## Level 5: Applied Tools Become Industries

Industries form when one or more Level 4 tools get bundled into a standing business. Because each industry bundles a *different mix* of tools, the question "how software-dependent is this industry?" has to be re-asked at this level; it doesn't just inherit the Level 4 answer above (see core insight, below).

**Software-dependence spectrum** across Level 5 industries:

| **Tier**                                       | **Industries**                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Nearly 100% software-native (business *is* software) | Technology & Software, Media & Entertainment, Financial Services              |
| Heavily software-dependent, physical core remains | Retail & Commerce, Logistics & Supply Chain, Telecommunications                |
| Software-assisted, fundamentally physical/human    | Manufacturing, Energy, Real Estate & Construction, Healthcare, Agriculture     |

**Core insight**: no Level 5 industry runs on "its own" software. The same underlying building blocks (compute, storage, AI/ML, networking, payments, communication) recombine in different ratios per industry. AWS powers Netflix, Airbnb, and Robinhood simultaneously; Stripe's payment rails power ecommerce checkout everywhere. AI is the newest such building block, not a new industry, but a new capability every existing Level 5 industry plugs into, which is why it touches everything at once rather than spawning one new "AI industry."

### 5.1 Technology & Software

**Level 4 tool**: information systems. For this industry, the tool *is* the product. Established sub-sectors (the toolkit every other industry below draws from):

| **Sub-sector**             | **Examples**                                                        |
| ----------------------------- | --------------------------------------------------------------------- |
| Enterprise SaaS                | Salesforce, HubSpot, Microsoft 365, Workday, Asana                   |
| Cloud infrastructure           | AWS, Google Cloud, Azure                                             |
| Consumer apps                   | Instagram, TikTok, Google Maps, Uber                                 |
| Cybersecurity                   | Okta, CrowdStrike, Palo Alto Networks, Cloudflare                    |
| Developer tools                  | GitHub, GitLab, Webflow, Bubble, Airtable                            |
| Operating systems/platforms      | iOS, Android, Windows, macOS, App Store, Google Play                 |
| Databases & data infrastructure  | Snowflake, MongoDB, PostgreSQL, Databricks, Palantir                 |
| Communication/collaboration      | Slack, Zoom, Microsoft Teams                                         |
| Gaming engines                    | Unity, Unreal Engine                                                  |

*(AI/ML platforms, OpenAI, Anthropic, Nvidia, Hugging Face, GitHub Copilot, Claude Code, are the Level 6 mechanism reshaping this industry; see 6.1.)*

### 5.2 Financial Services

**Level 4 tool**: money/credit. Established structure: banking, custody, payments, lending. See 6.2 for the mechanisms (neobanks, embedded fintech) currently reshaping how this tool is delivered.

### 5.3 Retail, Commerce & Logistics

**Level 4 tools**: trade/exchange + movement/logistics. Established structure: ecommerce and logistics resolve trade and physical movement through a mix of digital coordination and real-world transport. See 6.3 for the business models and trends currently reshaping this bundle.

### 5.4 Energy

**Level 4 tools**: production + property/ownership, applied to a physical resource. Established structure: energy generation and distribution, the most physical-core industry in this map; software assists but doesn't replace the underlying resource conversion. See 6.4 for the mechanisms currently reshaping it.

---

## Level 6: Categories Evolve via New Mechanisms

A Level 5 industry doesn't stay static; new mechanisms get layered onto the same underlying tool. This is where most of the current market activity actually lives.

### 6.1 Technology & Software: AI/ML as the new capability layer

AI/ML platforms (OpenAI, Anthropic, Nvidia, Hugging Face, GitHub Copilot, Claude Code) aren't a new Level 5 industry; they're a new capability every sub-sector in 5.1 is being rebuilt around.

### 6.2 Financial Services: new ways to deliver money/credit

**Digital Banks / Neobanks: Profitability & Moat by Region:**

| **Region**              | **Leading Players**                                                              | **Net Profit Margin**                                                                                     | **Moat**                                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Europe**               | Revolut, Monzo, N26                                                   | Revolut profitable since 2023 (~19% net margin on ~£1.8B revenue); Monzo turned profitable FY2024; N26 still loss-making, narrowing losses. | Weak. Competes on UX/brand and cross-sell (crypto, FX, subscriptions), no structural lock-in, easily copied by incumbents' "lite" apps.                                       |
| **USA**                  | SoFi, Chime, Varo                                                     | SoFi profitable since 2023; Chime near breakeven, thin interchange-based margins; Varo still loss-making.   | Weak-to-moderate. SoFi's real moat is its B2B banking-as-a-service layer (Galileo/Technisys) sold to other fintechs, not the consumer app itself.                             |
| **Asia (Northeast)**     | WeBank _(CN, Tencent)_, KakaoBank _(KR)_, Rakuten Bank _(JP)_        | All solidly profitable; WeBank ROE often 20-30%+.                                                            | Strong. Embedded inside a dominant super-app (WeChat, KakaoTalk, Rakuten ecosystem), near-zero customer acquisition cost plus proprietary transaction data for underwriting. |
| **SEA**                  | Sea Bank _(ID, Shopee)_, Bank Jago _(ID, GoTo)_, GXS Bank _(SG, Grab)_, Trust Bank _(SG, StanChart/FairPrice)_ | Mostly still loss-making, licenses issued 2020-2022, still in growth-investment phase.                     | Potentially strong but unproven: same ecosystem-embedding logic as Northeast Asia, plus a genuine regulatory moat since SG/MY/PH/HK cap the number of digital banking licenses issued (artificial oligopoly). |

**Pattern**: net margin and moat move together. Digital banks that are an appendage of a captive super-app (WeChat, KakaoTalk, Shopee, Grab) get low-cost customer acquisition and proprietary underwriting data, a real structural moat. Standalone neobanks (N26, Chime, Varo, Monzo) compete only on brand/UX, which incumbents can replicate, so they grind toward thin profitability at best.

**Embedded Fintech Layer (Asian B2B)**: money/credit dissolved into *other* companies' software rather than standing alone as a bank, same Level 4 tool, different delivery mechanism than the neobanks above.

- **Players**: StoreHub _(MY)_, Brankas _(SG/SEA)_, Sprout _(PH, Earned Wage Access)_
- **Monetization**: subscription base + revenue-share/take-rate on payment gateway fees, loan origination, and credit processing.

### 6.3 Retail, Commerce & Logistics: new mechanisms

**Trends reshaping trade/exchange and movement/logistics (5-10 year horizon):**

| **Trend**                        | **What Changes**                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Warehouse automation              | Robotics + AI inventory management become standard beyond just Amazon-scale players, reaching mid-size retailers.        |
| Last-mile delivery shift          | Drones and autonomous ground robots take dense urban short-range delivery; rural/complex terrain stays human-driven.      |
| Same-day becomes baseline         | Enabled by dark stores and micro-fulfillment centers sited closer to consumers.                                           |
| Social commerce growth            | More purchases happen inside apps (TikTok, Instagram) instead of on dedicated retail sites, see below.                   |
| Supply chain resilience           | Manufacturing diversifies away from China-dependence toward regional/nearshore production, post-disruption.               |
| AI-driven personalization         | Dynamic pricing, predictive restocking, and hyper-targeted recommendations get materially more sophisticated.             |

**Matrix of Winning Asian B2B Business Models.** Each wraps trade/exchange or movement/logistics in a distinct new mechanism:

| **Vertical / Category**                      | **Core Value Proposition**                                                                                                                            | **Leading Asian Examples**                                                               | **Monetization Strategy**                                                                                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Deep Local Compliance**                 | Hardcodes country-specific labor codes, e-invoicing, tax authorities, and legal filings directly into the app.                                        | Mekari _(ID)_, Sprout Solutions _(PH)_, OnlinePajak _(ID)_, Sleek _(SG)_ | Tiered per-employee/month software fees + filing fees. High switching costs because compliance mistakes mean government penalties. |
| **Conversational & Chat-First Workflows** | Meets businesses where they operate (inside WhatsApp, LINE, WeChat, or Zalo) rather than forcing email/web apps.                                      | Omnichat _(HK/SEA)_, SleekFlow _(HK/SG)_, Sirclo / Qontak _(ID)_             | Per-agent seat monthly fees + usage fees based on active conversation volumes / API messages.                                      |
| **POS & Retail Operating Systems**        | Connects physical storefront terminals with inventory, kitchen displays, customer loyalty, and digital payments.                                      | StoreHub _(MY)_, Moka / GoTo _(ID)_, Nanyang/Yaband                          | Hardware package fees + monthly software subscription + payment transaction fees.                                                  |
| **Cross-Border & Regulatory Compliance**  | Navigates multi-currency invoicing, customs clearance, and fragmented tax rules across ASEAN / East Asia.                                             | Anchanto _(SG)_, OneCart _(SG/SEA)_, Lalamove B2B                            | Logistics usage fees, transaction volume pricing, and enterprise integration licenses.                                             |
| **Multi-Channel Inventory Sync**          | Centralizes stock levels and order fulfillment across Shopee, Lazada, TikTok Shop, Tokopedia, and offline stores in real-time to prevent overselling. | OneCart, Jubelio _(ID)_, Jurnal / Mekari _(ID)_, Anchanto                | Tiered subscription based on SKU volume, connected storefront channels, and monthly processed orders.                              |
| **Information & Insight Providers**       | Converts raw news, filings, and market data into causal signals, pattern recognition, and decision triggers (e.g., regulation to supply chain impact to action). Moat is weak unless built on exclusive data sourcing (local-language filings, customs/court records) or embedded into automated customer workflows (auto-reorder, auto-hedge) rather than left as a dashboard. | Katadata Insight _(ID)_, regional trade-intelligence players (Panjiva/ImportGenius-style, SEA-focused) | Subscription/seat fees for dashboards + premium fees for proprietary datasets or API-triggered automated actions. |

*Note: StoreHub also appears in 6.2 (embedded fintech); it spans both industries. Anchanto spans both cross-border compliance and inventory sync.*

**Social Commerce Enablers (B2B platforms)**: turns messaging apps into direct-sales channels with automated product catalogs, AI bots, and checkout links inside chat, trade/exchange delivered through the coordination layer of a chat app instead of a dedicated storefront.

- **Players**: Sirclo _(ID)_, Omnichat _(HK/SEA)_, Shopline _(HK/TW)_
- **Monetization**: SaaS platform subscription + percentage cut of social GMV (Gross Merchandise Value).

**Social Commerce, consumer-side mechanics**: buying without leaving the social app, no redirect to a separate retailer site. This is the consumer-facing mechanism that the B2B platforms above build and monetize.

| **Mechanism**            | **How It Works**                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| In-app storefronts         | Brands set up a shop directly on the platform (Instagram Shop, TikTok Shop, Facebook Marketplace); product catalog syncs from inventory system. |
| Shoppable content           | Products tagged in posts, videos, livestreams, ads. A "shop now" tag/button sits on the content itself.                          |
| In-app checkout             | Payment info saved in-app (Instagram Pay, TikTok Pay); tap product, confirm, done. Platform handles the transaction and passes order data to the brand's fulfillment system. |
| Livestream shopping         | Host demos products live; viewers tap to buy in real time, often with limited-time deals. Dominant in China (Taobao Live), growing in the US (TikTok Live). |
| Creator/affiliate links     | Influencers tag products; platform tracks resulting purchases and pays commission. Attribution and payout stay inside the app.    |

**Why brands like it**: removes checkout friction, reuses stored payment/shipping data, raises impulse-buy rate.
**Why platforms like it**: takes a cut of every transaction, keeps users inside the app instead of routing them off-platform.

### 6.4 Energy: new mechanisms

**Trends reshaping how the resource is produced, owned, and distributed (5-10 year horizon):**

| **Trend**                        | **What Changes**                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Renewables scale further         | Solar + battery storage costs keep falling, reaching cost-competitiveness with fossil fuels in most markets. |
| Grid strain from AI/data centers | AI infrastructure power demand becomes a major driver of new energy investment; resurging nuclear interest.  |
| EV adoption continues            | Pace varies by region/policy; charging infrastructure buildout remains the bottleneck.                       |
| Nuclear renaissance              | Small modular reactors (SMRs) move from pilot to early deployment, partly to meet data center demand.        |
| Grid modernization               | Smart grids and storage become essential to absorb renewable intermittency.                                  |
| Geopolitics                      | Critical mineral supply chains (lithium, cobalt, rare earths) shape battery/EV competitive outcomes.         |
