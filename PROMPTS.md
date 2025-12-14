# Prompt Pack (for Human ↔ GPT‑5.2)

## 1) Feature implementation task (copy/paste)

**ROLE**
You are GPT‑5.2 implementing features in this repo. Follow SPEC.md and AGENTS.md.

**TASK**
- Objective:
- Non‑goals:
- Files/areas to touch:
- Constraints:
- Definition of Done:
- Tests to add/run:
- Output format: diffs + summary + PLAN/MEMORY updates

**CONTEXT**
- Relevant excerpts from SPEC/DECISIONS:
- Current errors/logs:

## 2) Bug fix task

**ROLE**
You are GPT‑5.2. Fix the bug without changing unrelated behavior.

**BUG**
- Symptom:
- Repro steps:
- Expected vs actual:
- Logs:

**CONSTRAINTS**
- Must add a regression test.
- Must explain root cause.

## 3) Balance tuning task (config-only)

**ROLE**
You are GPT‑5.2. Tune difficulty/reward curves by editing JSON only.

**GOAL**
- Make average run last 75–105 seconds for a 7‑year‑old.
- Ensure first 10 seconds feel easy.

**OUTPUT**
- Patch to `/config/balance.v1.json`
- Explain changes
- Provide 3 example “expected runs”
