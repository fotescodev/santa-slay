# PLAN — Santa Slay 3D (Web V1 → iOS)

## Milestone 0 — Repo + playable skeleton
- [x] Add SPEC/AGENTS/PLAN/MEMORY/DECISIONS scaffolding
- [x] Create web project skeleton (Vite + TypeScript)
- [x] Create Babylon.js scene bootstrap
- [ ] Implement input abstraction (touch/drag + keyboard fallback)
- [ ] Add placeholder sleigh that moves left/right
- [ ] Add HUD gift counter

## Milestone 1 — V1 playable loop
- [ ] Procedural track segments (simple repeated ground mesh initially)
- [ ] Obstacles: trees/rocks/fences (3 types to start)
- [ ] Collision → spill gifts
- [ ] Gift pickups (+1/+3) and rare golden gift (+10)
- [ ] Difficulty curve: speed increases, spawn density increases
- [ ] End conditions: finish line OR gifts == 0
- [ ] Score screen + local best
- [ ] Share score (Web Share API + clipboard fallback)

## Milestone 2 — Polish
- [ ] Camera smoothing + banking
- [ ] VFX: snow trail, gift burst
- [ ] Audio: sfx + music + mute toggles
- [ ] Tutorial overlays (first run only)
- [ ] Performance pass (draw calls, texture sizes, LOD)

## Milestone 3 — iOS packaging
- [ ] Wrap web build into iOS app (selected wrapper)
- [ ] Share sheet integration (native bridge if needed)
- [ ] iPhone/iPad testing + perf tuning
- [ ] Release checklist (privacy posture, kid safety review)
