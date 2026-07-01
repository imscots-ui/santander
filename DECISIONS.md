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

## Deliverable standard (standing instruction — Jul 2026)

**Default audience for every report, PDF and PowerPoint is senior management.** When the Captain says
"write a report" / "make a PDF" / "make a PowerPoint", pitch it at senior-management level unless told otherwise.

What that means in practice:
- **Register:** decision-oriented and evidence-led — argue the reasoning and trade-offs, don't just assert;
  lead with an executive summary; be concise and confident, not verbose or "school-kid".
- **Substance:** real citations with a References section (see `CITATIONS.md`); state assumptions, scope and
  non-goals; make the recommendation and the decision it supports explicit.
- **Design:** proper document furniture — cover with a document-control block, contents, running header/footer
  with page numbers, callout boxes, styled tables (the `build_reports_docx.py` / `build_reports_pdf.py` house
  style). Decks: INTERNAL·CONFIDENTIAL classification, clean panels, zero overflow (`scripts/deck-qa.py`).
- **Bar:** the rewritten Technical Report / Position Paper (v2.0) are the reference standard to match or beat.

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

## Brand assets — authorised internal use

The author is a **Santander employee**; this is an **internal concept / customer-research prototype**. Using
Santander brand assets (logo, licensed fonts, official palette) for this internal work is **authorised employee
use — not an IP/trademark breach**. The guidelines themselves state brand use requires authorisation/licence —
employee internal use qualifies; keep the "concept prototype · internal discussion" framing until the project is
formally sanctioned. External-facing use would need separate sign-off. No logo distortion/recolouring.

## Brand tokens — OFFICIAL (Jul 2026, from *Basic Guidelines for Santander*, santander.com, © Banco Santander S.A. 2020)

- **Santander Red `#EC0000`** (Pantone 485 C · C0 M100 Y100 K0 · R236 G0 B0) — THE brand red for digital.
  Superseded `#DA291C` (which is Pantone's own *print-side* sRGB conversion of the same 485 C — not wrong, but
  the brand book's digital spec is `#EC0000`; Captain confirmed the switch Jul 2026). Before that we used
  `#c8102e` (approximation, retired).
- **Full official palette** — darker: Boston `#CC0000` (Pantone 3620 C), London `#990000` (Pantone 7622 C);
  softer: Madrid `#EA6F5D` (2030 C), Mexico City `#F0B998` (6023 C), Rio `#F5DECF` (4031 C),
  Lisbon `#FBF1EA` (9021 C); plus White and Black. **Only the asterisked tones may be backgrounds:**
  White, Lisbon, Rio, Santander Red.
- **Page background is now Lisbon `#FBF1EA`** (replaced the near-identical `#faf6ef` approximation).
  Ink `#1c1917`; muted greys `stone-*`.
- **AA contrast rule for red:** `#EC0000` passes 4.5:1 on white (4.6:1) but *fails* on Lisbon (4.13:1) —
  so small red **text** on light surfaces uses **Boston `#CC0000`** (5.3:1 on Lisbon); `#EC0000` is for
  fills/CTAs (white text on it = 4.6:1 ✓), bars, icons and large type. Gradient depth anchors: EC0000 → CC0000
  → 990000 (official tones only).
- **Logo rules (from the book):** main version (flame + wordmark) prioritised everywhere; secondary (stacked)
  only under size constraints; symbol only in small spaces (app pictogram). Clear space = flame-symbol width
  (min: half). Minimum sizes: main 25px/3mm · secondary 50px/5mm · symbol 16px/3mm. Black & white and negative
  (white-on-red) variants exist. Cobranding: 4-module gap + 1pt divider.
- **Logo:** official Santander lockups in `brand/` — SVG (`santander-logo-{red,white,black}.svg`, source of
  truth) + rasterised transparent PNGs (3000×519, for docx/pptx which can't embed SVG). Red variants are
  `#EC0000` (Jul 2026). Applied: **red logo in the app header (both shells) and on the report covers.**
  Do not hand-recreate or recolour the mark.
- **Decks:** all 5 recoloured to official `#EC0000` + Lisbon `#FBF1EA` (zip-level XML swap, ~737 refs — covers
  fills *and* visible swatch text); deck builders' source red updated to match. **Official white Santander logo
  on all 5 cover slides.** Deck **body font stays Calibri** — swapping to Santander Text risks unverifiable
  layout reflow. Deck stats **refreshed Jul 2026** (17 workflows, 36 features, 7,400 lines; PR s3 + DBF s7 + Arch
  s9 rebuilt as grids of all 17). The June2026_Changes deck keeps its historical snapshot figures on purpose —
  it's a dated changelog, not current-state (its brand *colours* are kept current, its *stats* are not).
- **Project Record s9 renamed (Jul 2026, Captain's order):** "Reference Library — 1701-uniform/REFERENCE.md" →
  **"Reference Library — Applied Knowledge Base"**; file path, §-section tags and Node.js/C++ jargon removed —
  they referenced the co-located 1701 project, not the Santander build. Don't reintroduce them.
- App top-bar and card gradients standardised on official `#EC0000` with Boston/London depth anchors (Jul 2026;
  the interim `#DA291C` gradients and the pre-brand `#c8102e` are both retired).
- Muted status palette: emerald-600 `#059669` / amber-600 `#d97706` / red-600 `#dc2626`
  (with 700-shade **text** variants `#047857` / `#b45309` / `#b91c1c` for small labels — AA contrast).
- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
- **Typefaces (official trio, custom-built by Monotype with Interbrand for Santander; proprietary):**
  **Santander Logo** (wordmark-derived, Regular/Light), **Santander Headline** (narrow, wordmark-related — for
  headlines/titles), **Santander Text** (humanist sans by Hendrik Weber, adapted from the logo glyphs with
  extended x-height/ascenders/descenders for text sizes). The rebrand replaced FF Kievit, Berling, Open Sans and
  Arial. Applied via **named font-family only** — `.font-display`: `'Santander Headline','Santander Text','Geist'`,
  `.font-body`: `'Santander Text','Geist'` — renders on Santander-managed devices where installed; **Geist** is
  the open-licensed fallback. **Never hotlink** third-party mirrors (wfonts / onlinewebfonts) or commit font
  files — proprietary. The serif Fraunces is **retired** (Santander is a sans-serif brand). NB: a commercial
  *display serif* also named "Santander" (Made Good Designs) is an unrelated name-coincidence — do not use it.
  Reports: docx names Santander Text (Word substitutes if absent); PDF stays Helvetica (reportlab can't embed
  the proprietary font without the licensed file).
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

## Environment / tooling capability

- **LibreOffice headless is broken in this sandbox** — the `soffice`/`soffice.bin` IPC handshake fails, so
  `--convert-to` returns "source file could not be loaded" for *every* file (even `.txt`). The binary itself
  runs (`--version` OK), `/dev/shm` is ample, and clean profile / `HOME` / `SAL_USE_VCLPLUGIN=svp` make no
  difference — it's a sandbox restriction, **not fixable by reinstall** (same binaries). Don't waste time
  retrying it.
- **Deck visual verification: use `scripts/deck_shot.py <deck> <slide> <out.png>`** (wraps `deck_to_html.py` +
  Chromium). Two Chromium blind spots are baked-in fixed there: (1) shape divs must be `overflow:visible` or
  clipped text hides real overflow; (2) sandbox Chromium **paints ~90–100px less than `--window-size`** and pads
  the rest white — a naive 1280×720 shot leaves the slide's bottom strip (footer, last tile row) unverified.
  deck_shot renders at height+160, crops to 720, and hard-fails if the bottom strip comes back blank. Faithful
  for brand colour, text, images/logo, tables and gross layout/overflow; freeform autoshapes render as a filled
  box, gradients use their end stops. Use it to eyeball decks after any change.
- **Report visual verification**: the PDFs render fine via `pdftoppm` (poppler). The app renders via
  headless Chromium + axe (`scripts/verify-flows.mjs`). So every deliverable now has a working visual check.

## Standing orders (from CLAUDE.md — non-negotiable)

- No `git push --force`, no `--no-verify`, no `rm -rf`, no secrets in source.
- Hooks only at the top of `App`; `closeWorkflow()` must reset all workflow state; keep everything in `App.jsx`.
- Run `/ship-ready` (or rely on the gate) before every push.

## Deployment

- Vercel auto-deploys the working branch (`claude/add-claude-documentation-eaPc5`, PR #4, draft).
- **PR webhook activity is unsubscribed** (Jul 2026) to reduce interruption — check deploy status manually
  when it matters rather than expecting `Building`/`Ready` events.
