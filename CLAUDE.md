# CLAUDE.md — HMS 1701 Captain's Standing Orders

## Ship's Company

You are a rated member of HMS 1701's AI agent crew. Read your orders, know your station, and ask no questions that are answered here.

**Ship's doctrine:** `1701-uniform/SHIP-COMPANY.md`
**Decision log:** `DECISIONS.md` — read first; settled facts & sensitive decisions that must survive resets. Citations: `CITATIONS.md`. Inputs still needed from the Captain: `INPUTS_NEEDED.md`.
**Reference library:** `1701-uniform/REFERENCE.md` (121 books & regulatory docs · 112 sections · 23,840+ lines)
**Your rank commands:**

| Command | Station | Duty |
|---------|---------|------|
| `/xo` | Commander (XO) | Architecture quality, hook discipline, pattern enforcement |
| `/security` | Lt Cdr Security | XSS, accessibility, secrets, WCAG compliance |
| `/engineer` | Lt Cdr Engineer | Build health, performance, bundle, render efficiency |
| `/bosun` | Lieutenant Bosun | CSS, spacing, colour, hierarchy, Refactoring UI |
| `/signals` | Lieutenant Signals | State flow, data integrity, useMemo, API contracts |
| `/shipwright` | Shipwright | **Generative station** — invent, pressure-test & spec new features before build; hands briefs to the inspectors. Idea log: `SHIPWRIGHT-BACKLOG.md` |
| `/muster` | Officer of the Watch | **All-hands parallel review** — fans the five officers out as concurrent subagents on a diff, then synthesises one verdict |
| `/ship-ready` | All stations | Pre-commit checklist — run before every `git push` |

> The five review officers and `/ship-ready` are **inspectors** — they judge work that exists. `/shipwright` is the ship's **builder** — it generates and specs new work, then hands a buildable brief to the inspectors. `/muster` runs those inspectors in parallel for a fast five-lens read. Use `/shipwright` to open a feature; `/muster` for a deep review; the officers and `/ship-ready` to gate it.

**Before any commit touching App.jsx: run `/ship-ready`**

---

## What this is

A front-end-only React prototype of a Santander Business Banking app. No backend, no real data, no API calls (except Google Fonts). Built to demo paperless workflows — mandate changes, bulk payments (wages), KYC/KYB, MTD HMRC, account closures, lending, FX payments, account unlinking, and ring-fencing — for internal presentations and customer research.

## Two projects co-located in this repo

This repository physically contains **two separate, unrelated projects** under one "HMS 1701" theme. Do not wire them together — they share the folder, not the runtime.

1. **Santander Business Banking prototype** *(the primary project these orders govern)* — `App.jsx`, `main.jsx`, `index.html`, `vite.config.js`, the `build_*.py` deck/doc generators, and the `Santander_*.pptx` / `.docx` deliverables. Front-end only; this is what `npm run build` ships and what deploys to Vercel/GitHub Pages.
2. **1701 Squadron Uniform Inventory System** *(a separate app that lives alongside)* — `1701-uniform/backend/` is its own **Python FastAPI / SQLAlchemy** backend (routers: `stock`, `items`, `badges`, `cadets`, `kit_list`, `transactions`, `auth`, `audit`, `users`, `dashboard`; `models`, `schemas`, `database`, `demo.db`). The Santander prototype does **not** use this backend in any way.

**Shared between them:** `1701-uniform/REFERENCE.md` (titled *"Technical Reference — 1701 Uniform Inventory"*) and `1701-uniform/SHIP-COMPANY.md` serve as the common **reference library / ship's doctrine** for both projects. The reference library originated with the inventory system; book/reference sections added over time apply to the whole "ship", not to Santander specifically.

**Not in this comparison:** the *Super Agent Builder* website-build meta-agent (its `frontend-builder` / `ui-designer` / `site-architect` subagents) is a different project entirely and shares **nothing** with this repo. The only agents here are the ship's-company review officers (`/xo`, `/security`, `/engineer`, `/bosun`, `/signals`, `/ship-ready`).

> **Note:** `1701-uniform/backend/` is not currently tracked in git (only build artefacts like `.pyc`/`demo.db` are present locally). It is not committed or deployed by anything in the Santander pipeline.

## Commands

```bash
npm install        # install dependencies (first time only)
npm run dev        # dev server at http://localhost:5173 with hot reload
npm run build      # production build to dist/
npm run preview    # serve the production build for testing
```

There are no tests, no lint scripts, and no type checking in this project.

## Standing Security Orders

1. **No `focus:outline-none` without `focus-visible:`** — every bare outline removal is an accessibility breach
2. **No `dangerouslySetInnerHTML`** on any content that isn't a hardcoded static string
3. **No secrets in source** — no passwords, tokens, real emails, real account numbers beyond the author credit
4. **No `git push --force`** — ever
5. **Run `/ship-ready` before every push** — one RED finding means stand down and fix

## Design System Standing Orders (Bosun's Law)

- Spacing **must** come from the scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px` (Tailwind: `1 · 2 · 3 · 4 · 6 · 8 · 12 · 16 · 24 · 32`)
- **Never** use `text-gray-*` or `text-zinc-*` — this project uses `text-stone-*`
- **Never** put `text-stone-400` or `text-stone-500` on a dark card or red surface — use `text-white/65`, `text-stone-300`, or `text-red-100`
- **One primary CTA per view** — `bg-[#DA291C]` or `bg-stone-900` appears once per screen
- All monetary amounts use `num-tab` class for tabular figures

## Architecture

The entire prototype lives in a single file: **`App.jsx`** (~5,700 lines). This is intentional — it allows reading the whole product top-to-bottom without navigating modules. Everything imports from there via `main.jsx`.

### Single-component structure

`App` is one large React function component. Its internal structure follows this order:

1. **All hooks at the top** — every `useState`/`useEffect`/`useMemo` call is declared at the top of `App` before any logic, because sub-components are closures (not separate components) and cannot hold their own hooks. As of June 2026 the file has 120+ state variables; hooks run from line ~28 to ~765 (the last two `useMemo`s — `currentMonthCategories`/`currentMonthSummary` — sit at ~751/763, still above the boundary). The `/ship-ready` awk check flags any hook past line 120 — this is a known false positive on this file size. The architectural rule to enforce is: **no hook may appear after `closeWorkflow` (the first closure, now at line ~831)**. The awk threshold is stale; the boundary is not.
2. **Static data** — `ENTITY_INFO`, `signatories`, `accounts` (via `useMemo`), `mtdData`, `statementsData` (via `useMemo`)
3. **Inline CSS** — a `css` template literal variable holds brand-specific styles, animations, and glass effects. Injected via `<style>{css}</style>` in the render
4. **Primitive components** — `ProgressDots`, `StepFrame`, `Input`, `Field`, `Toggle` — small JSX helpers defined as closures. **No hooks inside these.**
5. **Workflow renderers** — `renderClosure`, `renderBiz`, `renderMandate`, `renderWages`, `renderLending`, `renderFX`, `renderDormancy`, `renderUnlink`, `renderRingfence`, `renderIdCheck`, `renderMtdSubmit`, `renderComplaint`, `renderRecurring`, `renderDispute`, `renderBeneficiary`, `renderCertificate`, `renderTrusted` — each returns JSX and reads/writes the top-level state. **No hooks inside these.** (17 workflows as of Jul 2026.)
6. **Screen components** — `HomeScreen`, `ApproveScreen`, `AuditScreen`, `StatementsScreen`, `MTDScreen` — also closures. **No hooks inside these.**
7. **Sheet/modal components** — `OTPSheet`, `ComplianceSheet`, `SavingsSheet`, `RMSheet`, `EntitySheet`, `CancelSheet`, `ReceiptSheet`, `PinSheet`, `OBSheet`, `VoiceMemoSheet`, `SequencerSheet`, `VoiceIdSheet`, `NotificationsSheet`, `CounterpartySheet`, `A11ySheet` — overlays rendered conditionally from the main return
8. **Main render** — two code paths: `viewMode === 'desktop'` (sidebar layout) and the default mobile shell (bottom nav). Both render the same screen components and workflow overlays with the same state.

### Navigation model

- `tab` state drives the main screen: `'home' | 'approve' | 'audit' | 'mtd' | 'statements'`
- `workflow` state drives full-screen workflow overlays (rendered on top of main content): `null | 'closure' | 'biz' | 'mandate' | 'wages' | 'lending' | 'fx' | 'dormancy' | 'unlink' | 'ringfence' | 'idcheck' | 'mtd-submit' | 'complaint' | 'recurring' | 'dispute' | 'beneficiary' | 'certificate' | 'trusted'` (17 workflows). Each overlay is wired in **both** shell routing blocks.
- `step` state tracks position within the active workflow (0-based)
- `viewMode` toggles between `'mobile'` (default) and `'desktop'`

All state is shared between both shells — switching between mobile and desktop preserves everything in progress.

### Entity system

`ENTITY_INFO` maps 7 entity types to config: `sole-trader`, `partnership`, `limited`, `llp`, `charity`, `club`, `society`. The active entity is `entityType` state (default: `'limited'`). Switching entity type changes:
- The `entity` object (labels like "director" vs "trustee", required documents, Companies House/Charity Commission numbers)
- The `accounts` array (different accounts and mandate rules per entity type)
- Copy throughout the UI

### Mandate rules

Each account has a `rule`: `'any-1'`, `'any-2'`, or `'all'`. The `getMandateFor(accountNos)` helper picks the strictest rule across selected accounts. This drives whether workflows require co-signers or trigger cooling-off periods.

### Cooling-off and stalled requests

- `cooling` array: requests with a 24-hour execution delay (working days only). A `tick` state refreshes every 30s to keep progress bars live
- `stalled` array: requests where a co-signer missed the window; displays the "Priya's on it" relationship manager escalation card

## Styling conventions

- **Tailwind** for layout, spacing, and most visual styles
- **Inline CSS** (`css` template literal) for: Santander brand colours, custom card effects (`hero-card`, `cool-card`, `tile-hero`), animations (`anim-fade`, `anim-slide`, `shimmer`), and stagger delays (`stagger-1` through `stagger-7`)
- **Brand red**: `#DA291C` — official portal red (Jul 2026; replaced the `#c8102e` approximation) — active states, CTAs, the top red bar
- **Background**: `#faf6ef` — warm off-white used as page/body background
- **Fonts**: `font-display` and `font-body` = **Santander Text** (official corporate sans, named family only — renders where installed, `Geist` open-source fallback), `font-mono` = Geist Mono (account numbers, financial figures). Fraunces serif is retired.
- **`num-tab`** CSS class enables tabular figures (`font-variant-numeric: tabular-nums`) — use on all monetary amounts for alignment

## Key data locations in App.jsx

> **Line numbers drift** — `App.jsx` is ~7,180 lines and grows with every workflow. Don't trust the numbers below to the line; **grep the anchor** (the exact string in the middle column) — that's stable. Numbers refreshed Jul 2026.

| What | Grep anchor | ~Line |
|------|-------------|-------|
| All state declarations | (top of `App`, before `closeWorkflow`) | ~28–330 |
| `payees` state (bulk payments demo data) | `const [payees` | ~253 |
| `ENTITY_INFO` static data | `const ENTITY_INFO` | ~400 |
| `BUSINESS_CARDS` + card-control helpers | `const BUSINESS_CARDS` | ~433 |
| `accounts` useMemo | `const accounts = useMemo` | ~476 |
| `getMandateFor` helper | `const getMandateFor` | ~567 |
| `mtdData` (Making Tax Digital) | `const mtdData` | ~589 |
| `statementsData` useMemo (transaction history) | `const statementsData = useMemo` | ~632 |
| `closeWorkflow` (resets ALL workflow state) | `const closeWorkflow` | ~909 |
| Inline CSS (`css` template literal) | `const css = ` | ~957 |
| Primitives (`ProgressDots`, `StepFrame`) — **top-level, outside `App`** | `const StepFrame` | ~27–35 |
| In-`App` primitives (`Input`, `Field`, `Toggle`) | `const Input = ` | after `css` |
| `renderClosure` / `renderBiz` / `renderMandate` | `const renderClosure` | ~1128 / ~1439 / ~1535 |
| `renderWages` / `renderLending` / `renderFX` | `const renderWages` | ~1737 / ~2022 / ~2125 |
| `renderDormancy` / `renderUnlink` / `renderRingfence` | `const renderDormancy` | ~2256 / ~2284 / ~2417 |
| `renderIdCheck` / `renderComplaint` / `renderRecurring` | `const renderIdCheck` | ~2497 / ~3090 / ~3321 |
| `renderDispute` / `renderBeneficiary` / `renderCertificate` | `const renderDispute` | ~3537 / ~3696 / ~3863 |
| `HomeScreen` (shared by both shells) | `const HomeScreen` | ~4048 |
| `renderMtdSubmit` | `const renderMtdSubmit` | ~6470 |
| Desktop shell main render | `if (viewMode === 'desktop')` | ~6748 |
| Mobile shell main render (default `return`) | (first `return (` after the desktop block) | ~7068 |

## Important constraints

**Do not add hooks inside closures.** `renderXxx` functions and screen/sheet components like `HomeScreen` are closures inside `App`, not React components. They cannot call `useState`, `useEffect`, etc. All state must be declared at the top of `App`.

**Keep everything in App.jsx.** The single-file architecture is deliberate. Do not extract components into separate files unless explicitly asked.

**closeWorkflow() must reset everything.** Any new workflow-specific state added to `App` must be reset in `closeWorkflow()`. Ghost state between workflows is a known failure mode.
