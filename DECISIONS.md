# DECISIONS.md — Project Facts & Decision Log

Settled facts and deliberate decisions that must survive context resets, so nothing here is
re-litigated, re-derived, or accidentally undone later. If something in this file conflicts with a
fresh instruction, surface the conflict before acting.

_Last updated: July 2026._

---

## Sensitive / do-not-undo

- **Quantum-derived papers were deleted on purpose (Jun–Jul 2026).** Two documents originally built off
  a third party's "Quantum / Beyond Defence" layout (`Santander_Technical_Report`, `Santander_Position_Paper`,
  plus their PDFs and builder scripts) were **removed at the owner's explicit request** because a family member
  was concerned about intellectual-property overlap. The third party's source documents were **only ever in a
  temporary upload area — never committed to this repo**. Removal is "from here forward"; git history still
  contains the old files and two commit messages naming "Quantum" (no force-push was authorised to scrub history).
- **The current Technical Report and Position Paper are clean-room rebuilds.** Original structure and wording,
  factual description of *this* prototype, **no derivation** from any third-party layout. They reuse the deleted
  filenames but the content is new. Do not reintroduce Quantum-derived material.

## Two co-located projects (do not wire together)

1. **Santander Business Banking prototype** — the primary project (`App.jsx`, `main.jsx`, `index.html`,
   `vite.config.js`, `build_*.py`, the decks and reports). Front-end only.
2. **1701 Squadron Uniform Inventory System** — a separate Python FastAPI/SQLAlchemy backend under
   `1701-uniform/backend/` (not tracked in git). The Santander prototype does not use it.

They share only the reference library (`1701-uniform/REFERENCE.md`) and ship doctrine (`SHIP-COMPANY.md`).

## Product state

- **17 workflows** in the prototype (as of Jul 2026). Full list in `CLAUDE.md` → Navigation model.
- **7 entity types**; accounts, mandate rules and copy reconfigure per type.
- Front-end only: no backend, no real data, no live connections. All figures illustrative.

## Brand tokens (currently **approximated** — see INPUTS_NEEDED.md)

- Brand red `#c8102e`; warm background `#faf6ef`; ink `#1c1917`; muted greys `stone-*`.
- Muted status palette: emerald-600 `#059669` / amber-600 `#d97706` / red-600 `#dc2626`
  (with 700-shade **text** variants `#047857` / `#b45309` / `#b91c1c` for small labels — AA contrast).
- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
- Fonts: Fraunces (display) + Geist (body/mono) as **stand-ins** for the real licensed brand fonts.
- `num-tab` on all monetary figures; one primary CTA per view; never `text-gray-*`/`text-zinc-*`.

## Build & quality pipeline

- **Loop:** scaffold (`/new-workflow`) → review (`/muster`, parallel officers, scaled to diff) →
  gate (`scripts/ship-gates.sh`, pre-commit hook) → runtime drive-through (`scripts/verify-flows.mjs`) → push.
- **Ship-gate** (wired as a `PreToolUse` hook in `.claude/settings.json`) blocks a commit/push on five hard REDs
  (bare `focus:outline-none`, `gray/zinc`, `dangerouslySetInnerHTML`, hook-after-`closeWorkflow`, shell-parity)
  and runs `npm run build` on push.
- **Runtime drive-through** launches the built app headless (playwright-core + pre-installed Chromium), drives
  all 13 accordion workflows + the Sign-&-send flow, and runs an axe WCAG 2.1 AA audit. Currently 20/20; core
  screens are AA-clean on colour-contrast and name/role.
- **Deck QA:** `scripts/deck-qa.py` checks pptx overflow + classification banners. All 5 decks: 0 overflow.

## Standing orders (from CLAUDE.md — non-negotiable)

- No `git push --force`, no `--no-verify`, no `rm -rf`, no secrets in source.
- Hooks only at the top of `App`; `closeWorkflow()` must reset all workflow state; keep everything in `App.jsx`.
- Run `/ship-ready` (or rely on the gate) before every push.

## Deployment

- Vercel auto-deploys the working branch (`claude/add-claude-documentation-eaPc5`, PR #4, draft).
- **PR webhook activity is unsubscribed** (Jul 2026) to reduce interruption — check deploy status manually
  when it matters rather than expecting `Building`/`Ready` events.
