# AGENTS.md — Operating rules for GPT‑5.2 and AI helpers

This repository is built **AI‑first**. The model is expected to operate like a careful engineer.

## Source of truth
1. **SPEC.md** (immutable requirements for V1)
2. **DECISIONS.md** (why we chose specific approaches)
3. **MEMORY.md** (compact current status)
4. Current task brief + logs

If instructions conflict, follow the order above.

## Hard constraints (must never violate)
- Kid‑safe defaults: **no ads**, **no analytics SDKs**, **no tracking**, **no chat**, **no UGC**, **no outbound links** in V1.
- Web V1 must run well on iPad Safari.
- Architecture must keep gameplay logic engine‑agnostic (portable core).

## How to work (every task)
1. Read **MEMORY.md** + the relevant code.
2. Restate the task in 1–3 bullet points.
3. Plan the smallest safe change set.
4. Implement.
5. Add/adjust tests when logic changes.
6. Run checks (`npm test`, `npm run lint` if present, `npm run build`).
7. Update **PLAN.md** checkboxes, and refresh **MEMORY.md** if state changed.
8. If you made a new choice, append it to **DECISIONS.md**.

## Output format (when responding)
- Summary of changes
- Files changed (list)
- How to run/test
- Any tradeoffs / TODOs
- Memory/decision updates

## Prompting standard for tasks (Human → Agent)
Use this template for consistent results:

**ROLE**
You are GPT‑5.2 implementing features in this repo. Follow SPEC.md and AGENTS.md.

**TASK**
- Objective:
- Non‑goals:
- Files/areas to touch:
- Constraints:
- Definition of Done:
- Tests to add/run:
- Output format:

**CONTEXT**
- Paste only the relevant excerpts from SPEC/DECISIONS
- Errors/logs (if any)

## Stop‑the‑line conditions (must ask a human)
- Any monetization, ads, tracking, analytics SDKs
- Any social features, chat, UGC
- Any outbound links (even “rate us”)
- Anything that could increase age rating or change kid safety posture
