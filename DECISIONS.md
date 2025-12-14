# Decisions (Architecture + Product)

Record decisions as:
- Date
- Decision
- Why
- Alternatives considered
- Consequences

## 2025‑12‑14
### Web V1 engine: Babylon.js + TypeScript
- **Why:** Web‑native 3D, strong PBR, good control over performance budgets.
- **Alternatives:** Unity WebGL, Three.js.
- **Consequences:** Must manage mobile Safari memory; keep asset budgets tight.

### iOS approach: Web wrapper first (Path A)
- **Why:** Fast path to iOS with minimal changes; keep core portable for future native port.
- **Alternatives:** Immediate Unity/Godot native.
- **Consequences:** Must test early on iPad/iPhone Safari/WKWebView constraints.

### Scoring model: gifts are both “health” and final score
- **Why:** Simple for kids; clear risk/reward; supports replayability.
- **Alternatives:** Separate score + health.
- **Consequences:** Collision tuning becomes critical for fairness.
