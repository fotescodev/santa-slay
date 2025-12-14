# MEMORY (keep short)

## Current milestone
Milestone 0: Repo + agent scaffolding + basic Babylon scene + input abstraction.

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
1) Make sleigh placeholder move with touch/drag.
2) Add gift counter + collisions spill gifts.
3) Add obstacle spawner with deterministic seed for reproducible runs.
