# CLAUDE.md — HMS 1701 Captain's Standing Orders

## Ship's Company

You are a rated member of HMS 1701's AI agent crew. Read your orders, know your station, and ask no questions that are answered here.

**Ship's doctrine:** `1701-uniform/SHIP-COMPANY.md`
**Reference library:** `1701-uniform/REFERENCE.md` (41 books · 26 sections · 5,000+ lines)
**Your rank commands:**

| Command | Station | Duty |
|---------|---------|------|
| `/xo` | Commander (XO) | Architecture quality, hook discipline, pattern enforcement |
| `/security` | Lt Cdr Security | XSS, accessibility, secrets, WCAG compliance |
| `/engineer` | Lt Cdr Engineer | Build health, performance, bundle, render efficiency |
| `/bosun` | Lieutenant Bosun | CSS, spacing, colour, hierarchy, Refactoring UI |
| `/signals` | Lieutenant Signals | State flow, data integrity, useMemo, API contracts |
| `/ship-ready` | All stations | Pre-commit checklist — run before every `git push` |

**Before any commit touching App.jsx: run `/ship-ready`**

---

## What this is

A front-end-only React prototype of a Santander Business Banking app. No backend, no real data, no API calls (except Google Fonts). Built to demo paperless workflows — mandate changes, bulk payments, KYC/KYB, MTD HMRC, account closures — for internal presentations and customer research.

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
- **One primary CTA per view** — `bg-[#c8102e]` or `bg-stone-900` appears once per screen
- All monetary amounts use `num-tab` class for tabular figures

## Architecture

The entire prototype lives in a single file: **`App.jsx`** (~3,200 lines). This is intentional — it allows reading the whole product top-to-bottom without navigating modules. Everything imports from there via `main.jsx`.

### Single-component structure

`App` is one large React function component. Its internal structure follows this order:

1. **All hooks at the top** — every `useState`/`useEffect`/`useMemo` call is declared at the top of `App` before any logic, because sub-components are closures (not separate components) and cannot hold their own hooks
2. **Static data** — `ENTITY_INFO`, `signatories`, `accounts` (via `useMemo`), `mtdData`, `statementsData` (via `useMemo`)
3. **Inline CSS** — a `css` template literal variable holds brand-specific styles, animations, and glass effects. Injected via `<style>{css}</style>` in the render
4. **Primitive components** — `ProgressDots`, `StepFrame`, `Input`, `Field`, `Toggle` — small JSX helpers defined as closures. **No hooks inside these.**
5. **Workflow renderers** — `renderClosure`, `renderBiz`, `renderMandate`, `renderWages`, `renderDormancy`, `renderIdCheck`, `renderMtdSubmit` — each returns JSX and reads/writes the top-level state. **No hooks inside these.**
6. **Screen components** — `HomeScreen`, `ApproveScreen`, `MTDScreen`, `StatementsScreen`, `AuditScreen` — also closures. **No hooks inside these.**
7. **Sheet/modal components** — `RMSheet`, `EntitySheet`, `CancelSheet`, `ComplianceSheet`, `SavingsSheet`, `CounterpartySheet` — overlays rendered conditionally from the main return
8. **Main render** — two code paths: `viewMode === 'desktop'` (sidebar layout) and the default mobile shell (bottom nav). Both render the same screen components and workflow overlays with the same state.

### Navigation model

- `tab` state drives the main screen: `'home' | 'approve' | 'audit' | 'mtd' | 'statements'`
- `workflow` state drives full-screen workflow overlays (rendered on top of main content): `null | 'closure' | 'biz' | 'mandate' | 'wages' | 'dormancy' | 'idcheck' | 'mtd-submit'`
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
- **Brand red**: `#c8102e` — used for active states, CTAs, the top red bar
- **Background**: `#faf6ef` — warm off-white used as page/body background
- **Fonts**: `font-display` = Fraunces serif (large editorial headings), `font-body`/default = Geist sans, `font-mono` = Geist Mono (account numbers, financial figures)
- **`num-tab`** CSS class enables tabular figures (`font-variant-numeric: tabular-nums`) — use on all monetary amounts for alignment

## Key data locations in App.jsx

| What | Approximate line |
|------|-----------------|
| All state declarations | ~25–115 |
| `ENTITY_INFO` static data | ~142 |
| `accounts` useMemo | ~162 |
| `payees` state (bulk payments demo data) | ~79 |
| `mtdData` (Making Tax Digital) | ~214 |
| `statementsData` useMemo (transaction history) | ~257 |
| Inline CSS (`css` template literal) | ~490 |
| Primitive components (`StepFrame`, `Input`, etc.) | ~598 |
| `renderClosure` | ~670 |
| `renderBiz` | ~800 |
| `renderMandate` | ~902 |
| `renderWages` | ~1100 |
| `HomeScreen` | ~1617 |
| Desktop shell main render | ~2857 |
| Mobile shell main render | ~3075 |

## Important constraints

**Do not add hooks inside closures.** `renderXxx` functions and screen/sheet components like `HomeScreen` are closures inside `App`, not React components. They cannot call `useState`, `useEffect`, etc. All state must be declared at the top of `App`.

**Keep everything in App.jsx.** The single-file architecture is deliberate. Do not extract components into separate files unless explicitly asked.

**closeWorkflow() must reset everything.** Any new workflow-specific state added to `App` must be reset in `closeWorkflow()`. Ghost state between workflows is a known failure mode.
