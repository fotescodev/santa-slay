# Santa Slay 3D — Game Spec (V1)

## One‑liner
A high‑fidelity 3D downhill runner where Santa’s sleigh barrels down a snowy mountain. Dodge obstacles, grab gift pickups, and finish with **as many gifts in the sleigh as possible** to beat your best score.

> Naming note: “Slay” means “do awesome” (no violence).

## Target audience
- Ages **7+**
- Plays on **iPad** (primary), iPhone (later), web desktop

## Player fantasy
Fast, funny downhill chaos—*I’m barely holding it together, but I can do better next time.*

## Core loop (60–120s)
1. Start run with baseline gifts (default **20**).
2. Steer left/right to avoid obstacles.
3. Clean passes increase combo and can award extra gifts.
4. Collisions spill gifts (gift count goes down).
5. End when reach finish line or gifts hit **0**.
6. Show score, best score, share, play again.

## Win/lose
- **Win:** Reach finish line with gifts remaining.
- **Lose:** Gifts reach **0**.

## Scoring
- **Final Score = Gifts Remaining** at end of run.
- Secondary stats: max combo, obstacles cleared, run time.

## Controls
- **Primary:** Touch drag / swipe left-right (direct steering).
- **Fallback:** Keyboard (A/D or arrows) for desktop testing.
- Optional later: tilt controls (off by default).

## Camera
Third-person chase camera with strong forward visibility, mild banking on turns.

## Obstacles (V1 initial set)
Start with 3 and expand:
1. Trees (static)
2. Rocks (static, smaller hitbox)
3. Fences (forces lane change)
Later: snowbanks, ice patches, falling icicles.

## Pickups (V1)
- Gift box: +1 or +3 gifts
- Golden gift (rare): +10 gifts

## Reward rules (V1)
- Clean obstacle pass: +1 gift
- Near miss (optional): +2 gifts
- Combo bonus: every 5 clean passes → gift burst (3–8 gifts)

## Difficulty
- Speed ramps smoothly over time.
- Obstacle spawn density increases gradually.
- Introduce new obstacle types one at a time.

## UX screens
1. Title screen: Play, Best score, Settings (sound/music)
2. Tutorial overlays (first run only)
3. In-run HUD: Gift counter (big), combo (small), pause
4. End screen: Score, best, Play Again, Share

## Sharing
- Web V1: Web Share API when available; fallback to copy-to-clipboard.
- iOS: Use native share sheet via wrapper bridge if needed.

## Audio
- Snow swoosh, bell pickup, thud on collision, cheerful stings.
- Music loop with easy mute.

## Art direction
- Bright, toy-like cinematic (stylized PBR)
- Strong silhouettes for obstacles
- Lightweight particles

## Performance targets
- 60fps on iPad-class devices.
- Controlled textures (512–1K typical; 2K only for hero assets).
- Avoid expensive post-processing by default.

## Safety / compliance posture (V1)
- No ads, no tracking, no chat, no UGC, no outbound links.
- Any future link-out or monetization requires human approval + kid safety review.

## Acceptance criteria (V1)
- Playable run loop (start → run → end) in under 2 minutes.
- Clear goal within 10 seconds.
- High score persists locally.
- Share button works (or gracefully falls back).
- Runs on iPad Safari without crashing after repeated runs.
