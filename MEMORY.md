# MEMORY (keep short)

## Current milestone
Milestone 0 (Web-first): Repo + agent scaffolding + basic Babylon scene + input abstraction. iOS packaging follows in the next version.

## Key constraints
- Ages 7+; kid‑safe; no tracking/ads/chat/UGC/link‑outs in V1.
- Web V1 must run on iPad Safari; iOS packaging planned later.
- Gameplay core should be engine‑agnostic.

## Architecture snapshot
- `/src/core/*`: engine‑agnostic game logic (state, gifts, scoring, difficulty)
- `/src/platform-web/*`: Babylon.js scene, rendering, input adapters
- `/config/*`: balance/difficulty knobs (JSON)

## Known risks
- Mobile WebGL memory/perf; keep textures/lightweight assets.

## Next 3 tasks
1) Add end-of-run screen with best score persistence + share placeholder.
2) Tune obstacle shapes/colliders + add camera banking for turns.
3) Build deterministic track generator for longer runs and varying density.
