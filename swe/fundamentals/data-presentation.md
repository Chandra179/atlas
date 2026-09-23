## Bits & Bytes

This section explains the relationship between bits, bytes, and common encoding schemes.

A **bit** is the smallest unit of information in computer **0 or 1**.

* 1 bit → 2 possibilities → `0`, `1`
* 2 bits → 2² = 4 possibilities → `00`, `01`, `10`, `11`
* 3 bits → 2³ = 8 possibilities
* 8 bits → 2⁸ = 256 possibilities → **1 byte**

If you have **n bits**, you can represent **2ⁿ unique values**.

| Encoding         | Bits per symbol      | Example characters  |     |
| ---------------- | -------------------- | ------------------- | --- |
| **Base2**        | 1                    | 0,1                 |     |
| **Base16 (hex)** | 4 bits per char      | 0–9, A–F            |     |
| **Base32**       | 5 bits per char      | A–Z, 2–7            |     |
| **Base58**       | \~5.86 bits per char | Bitcoin addresses   |     |
| **Base62**       | \~5.95 bits per char | 0–9, A–Z, a–z       |     |
| **Base64**       | 6 bits per char      | A–Z, a–z, 0–9, +, / |     |

**Example**

If you need to generate 10,000 unique codes per day using Base64 and codes can be at most 8 characters long, each code represents 48 bits, giving 2^48 ≈ 2.8 × 10^14 possible values more than enough for 10,000 per day.
