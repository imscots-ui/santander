# Muster — All Hands Parallel Review

You are the Officer of the Watch calling **all hands to muster**. Where `/ship-ready` runs the station checks yourself, one after another, `/muster` fans the five review officers out as **concurrent subagents** — each inspects the same change through its own lens at the same time — then you synthesise their reports into one verdict.

Use this to review a diff fast and from five independent angles. It is the parallel counterpart to the serial `/ship-ready` drill.

## When to call it

- Before a commit that touches `App.jsx` in more than a trivial way — get all five lenses at once instead of eyeballing.
- After a big feature, when a single-pass self-review would miss cross-cutting issues.
- Any time you want independent officers rather than one reviewer wearing five hats.

`/ship-ready` is still the **gate before `git push`** (it includes the build). `/muster` is the deeper *design/quality* pass you run first — it does not replace `/ship-ready`.

## How to run it

1. **Scope the change.** Get what's under review:
   ```bash
   git diff HEAD        # or `git diff main...HEAD`, or a named range if asked
   git diff --stat HEAD
   ```
   If there's nothing to review, say so and stop.

2. **Fan out — one Agent call per officer, all in a single message so they run concurrently.** Give each subagent (a) the diff, (b) its own rubric (the matching `.claude/commands/*.md`), and (c) the standing orders from `CLAUDE.md`. Ask each for findings only in its lane, ranked by severity, each as `RED / AMBER / GREEN` with `file:line` + one-line fix. The five officers and their lanes:

   | Officer | Rubric file | Lane |
   |---|---|---|
   | XO | `.claude/commands/xo.md` | Hook placement, no-hooks-in-closures, single-file, `closeWorkflow` resets, state across shells |
   | Security | `.claude/commands/security.md` | XSS, bare `focus:outline-none`, secrets, WCAG/contrast |
   | Engineer | `.claude/commands/engineer.md` | Build health, missing `key=`, always-on intervals, render/bundle cost |
   | Bosun | `.claude/commands/bosun.md` | Spacing scale, `stone` not `gray/zinc`, dark-surface text, one primary CTA, `num-tab` |
   | Signals | `.claude/commands/signals.md` | State mutation, `useMemo`/effect deps, data integrity, ghost state |

   Each subagent is read-only review — it reports, it does not edit.

3. **Synthesise.** Collect the five reports. Merge duplicates (the same line flagged by two officers is one finding, noted as cross-confirmed). Rank by severity. Produce:
   - A one-line **muster verdict**: `⚓ ALL HANDS GREEN` / `🟠 AMBER — sails with noted risks` / `🔴 RED — stand down`.
   - A table: *Officer · Severity · file:line · finding · fix*.
   - The **fix list** for every RED, in the order to apply them.

4. **Hand back.** RED findings are blockers — fix them, then re-muster or run `/ship-ready`. AMBER is logged, not blocking. Never push on a RED.

## Scale the panel to the diff

A full five-officer fan-out costs ~120k tokens. That's the right spend for a new workflow; it's wasteful on a one-line copy tweak. Size the muster to the change:

| Diff | Panel |
|------|-------|
| **New workflow / sheet, or >~150 changed lines** | Full five officers |
| **Moderate change (new component, multi-file, ~30–150 lines)** | The lanes it touches — usually XO + Signals + one of Bosun/Security |
| **Small / mechanical (<~30 lines, copy, spacing, single fn)** | Skip the fan-out — run `/ship-ready` grep gates inline; muster only if those flag something |

State which tier you picked and why in the verdict, so the choice is visible. When in doubt on a review/audit request, size up.

## Notes

- Keep each subagent tightly scoped to its lane so they don't all re-report the same generic issues — the value is five *different* views, not five copies of one.
- If the diff is large, tell each officer to focus on the changed hunks, not the whole file.
- The recurring findings (missing `num-tab`, ghost/stale state, `Input` `e.target.value` misuse) are now prevented by the `/new-workflow` scaffold — if the muster still finds one, the scaffold wasn't used. Prefer scaffolding over re-catching.
