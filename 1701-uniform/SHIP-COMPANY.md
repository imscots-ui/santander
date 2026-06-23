# HMS 1701 — Ship's Company

## Mission

Build the finest, most secure, best-designed business banking prototype afloat.
Sail faster than any competing vessel. Leave no security breach, no accessibility failure, no architecture sin behind us.

## Chain of Command

```
CAPTAIN ─────────────────── Project owner. Sets course. Final authority.
    │
    ├── COMMANDER (XO) ────── Architecture guardian. /xo
    │       Enforces CLAUDE.md. Blocks bad patterns before they embed.
    │
    ├── LT CDR SECURITY ───── Security Officer. /security
    │       Owns XSS defence, accessibility, secrets discipline.
    │
    ├── LT CDR ENGINEER ───── Engineer Officer. /engineer
    │       Owns build, performance, bundle health, render efficiency.
    │
    ├── LIEUTENANT BOSUN ──── UI/UX Officer (Bosun). /bosun
    │       Owns all CSS, spacing, colour, shadow, typography, empty states.
    │
    └── LT SIGNALS ─────────── Signals Officer. /signals
            Owns state flow, data integrity, useMemo discipline, future API contracts.
```

## Standing Orders (All Ranks)

1. **REFERENCE.md is the law.** All patterns, decisions, and implementations are anchored to `1701-uniform/REFERENCE.md`. If something contradicts REFERENCE.md, REFERENCE.md wins.

2. **No force push. Ever.** `git push --force` is mutiny. Rebase and amend are permitted on feature branches only, never on `main`.

3. **Ship-ready before sailing.** Run `/ship-ready` before every commit that touches `App.jsx`. A single RED finding means the ship stands down.

4. **The deck is the measure.** The user experience is the final judge of all decisions. A clever technical solution that produces an ugly or confusing UI is a failed solution.

5. **Security is not an afterthought.** Run `/security` before any PR is raised. The XO cannot sign off on a commit that has a security CAUTION or above outstanding.

6. **One voice at a time.** Do not run conflicting changes in parallel. Coordinate through git branching.

## Specialist Ranks — When to Call Them

| Signal | Call |
|--------|------|
| Architecture change (new workflow, new state) | `/xo` first |
| Any change touching auth, cookies, env vars | `/security` |
| Performance complaint or slow build | `/engineer` |
| Any CSS/UI change | `/bosun` |
| New state or data flow introduced | `/signals` |
| Before every `git push` | `/ship-ready` |

## The Reference Library

`1701-uniform/REFERENCE.md` — 41 books, 26 sections, 5,000+ lines.

Key sections for this vessel:

| Section | Contents | Used by |
|---------|---------|--------|
| 11 | React & JS Frontend Patterns | XO, Signals |
| 13 | JWT & Authentication | Security, Signals |
| 21 | HTTP Fundamentals | Signals, Security |
| 22 | SQL Performance & Indexing | Engineer (future backend) |
| 23 | Advanced Prompt Engineering | Captain (AI orchestration) |
| 24 | AI Agent Architecture | Captain (multi-agent) |
| 25 | Claude Code Workflow | All ranks |
| 26 | Refactoring UI | Bosun |

## Design System — Quick Reference (Bosun's Log)

### Colours
```
Brand red:     #c8102e  — CTAs, active nav, red bar
Brand dark:    #a00d24  — hover/pressed on red
Background:    #faf6ef  — warm off-white, every page
Text primary:  #1c1917  (stone-900)
Text secondary:#78716c  (stone-500)
Text tertiary: #a8a29e  (stone-400)

On dark cards: white/65, stone-300, stone-400 — NEVER gray-400
On red surface:#fca5a5, red-100, rose-200 — NEVER gray-400
```

### Spacing Scale
```
Only these values: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px
Tailwind tokens:   1 · 2 ·  3 ·  4 ·  6 ·  8 · 12 · 16 · 24 ·  32
```

### Shadow Levels
```
lift-1   — list items, inline cards
lift-2   — primary cards, panels
lift-hero — the hero balance card only
```

### Typography
```
font-display       — Fraunces serif, editorial headings
font-display-tight — Fraunces, tight letter-spacing, large numbers
font-body/default  — Geist sans, all body text
font-mono          — Geist Mono, account numbers, financial figures
num-tab            — tabular figures on ALL monetary amounts
```

## Security Protocols

### The Five Laws (Lieutenant Commander Security)
1. No `dangerouslySetInnerHTML` on user-controlled content — ever
2. No secrets in source — not in comments, not in string literals
3. No `focus:outline-none` without a companion `focus-visible:` style
4. No direct state mutation — always spread/filter/map
5. No `git push --force` on shared branches

### Accessibility Minimum (WCAG 2.1 AA)
- All interactive elements keyboard-navigable
- Focus states visible with custom focus-visible ring
- Colour contrast ≥ 4.5:1 on body text, ≥ 3:1 on large text
- Error messages state how to fix (not just that something is wrong)

## Advancement of Ratings

When a new capability is learned or a new book processed into REFERENCE.md, the relevant rank's domain grows. Update `REFERENCE.md` and log the new section. The Captain then acknowledges in a commit message.

Current fleet strength: **41 books · 26 sections · 5,024 lines** in REFERENCE.md.

---

*Commissioned: HMS 1701 — June 2026*
*Captain: Alan Davidson, Santander Business Banking*
*Drafted by: Claude Code Agent Squadron*
