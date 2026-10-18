---
title: 'Night Parade: a Samurai Survivor Game'
description: >-
  A low-poly isometric action survivor: one samurai, one night, a parade of
  yokai.
tags:
  - game-dev
  - godot
  - blender
  - webassembly
links:
  demo: http://alubarna.chan179.com/
created: 2026-10-18T00:00:00.000Z
updated: 2026-10-18T00:00:00.000Z
modified: '2026-10-18'
---

# Night Parade: a Samurai Survivor Game
![Night Parade](https://chan179.com/assets/demo_alubarna.png)

Night Parade is a low-poly isometric action survivor. A lone samurai fights waves of yokai (Japanese folklore monsters) from dusk until dawn.

It is single player, built by one person, and at prototype stage: playable, but not finished. Nothing here claims the game *feels* right; that needs a human playing it.

## The game

A night lasts 3, 5, 10 or 15 minutes. There is also a Duel mode: no horde, just one boss.

```text
Slash the horde -> Orbs and coins drop -> Level up -> Pick 1 of 3 cards -> Boss -> ... -> Dawn
                                                              |
                                          Coins buy permanent upgrades at the shrine
```

| Area | What it is |
|---|---|
| Combat | Hold to chain a 3-hit slash combo, dash through attacks with brief invulnerability, deflect projectiles back |
| Build | Five Rings schools (Earth, Water, Fire, Wind, Void) from Musashi's book; 26 upgrade cards |
| Skills | 7 active skills (Whirlwind, Ofuda Throw, Spirit Vortex, Dragon's Roar, Kekkai, Meteor, Tidal Wave), 4 supports, and the Dawnbreaker ultimate |
| Weapons | Katana, bow, matchlock, giant sword, each with its own signature skill |
| Combos | Pairing certain skills makes a stronger third effect (for example a fire tornado) |
| Enemies | 7 yokai, each with its own behavior: umbrellas, lanterns, kappa, tengu, fox fire, long-neck, spider woman |
| Bosses | Oni, Gashadokuro, Shuten-dōji, and the dragon Ryūjin in the Duel |
| Between runs | A shrine where banked coins buy permanent stats and a revive |

## Demo WASM

Godot can export the whole game to WebAssembly: a compact program format that browsers run at near-native speed. The game then runs inside a web page using WebGL 2, with the simpler Compatibility renderer (the web does not support the desktop one).

- **Single-threaded:** no special server settings are needed, so any static host works.
- **Hosting:** Cloudflare Workers, as plain static files, planned for a custom subdomain.
- **Size:** the engine file is about 38 MiB, over Cloudflare's 25 MiB per-file limit. The build splits it into pieces, and a tiny Worker joins them back into one file when a browser asks.
- **Safety:** there are no accounts, no network calls and no secrets. Saves live in the player's own browser.

## References

- Miyamoto Musashi, *The Book of Five Rings*. The five schools. Public domain.
- Japanese folklore (yokai). The monsters. Public domain as a subject; all designs here are original.
- [Godot Engine](https://godotengine.org/) for the game engine.
- [Blender](https://www.blender.org/) for building characters.
- [Kenney](https://kenney.nl/) for the free CC0 sound packs.
- [WebAssembly](https://webassembly.org/) for running the game in a browser.
