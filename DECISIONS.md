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
use — not an IP/trademark breach**. Source the real assets from Santander's **internal brand portal** (not the
open web), follow the brand guidelines (no logo distortion/recolouring), and keep the "concept prototype ·
internal discussion" framing until the project is formally sanctioned. External-facing use would need separate
sign-off. Until the real kit is dropped in, the tokens below are tasteful **approximations**.

## Brand tokens (currently **approximated** — real kit can replace when supplied; see INPUTS_NEEDED.md)

- **Brand red `#DA291C`** — confirmed from the brand portal (Jul 2026), applied across app + reports.
  (Was approximated as `#c8102e`.) Warm background `#faf6ef`; ink `#1c1917`; muted greys `stone-*`.
- **Logo:** official Santander lockups in `brand/` — SVG (`santander-logo-{red,white,black}.svg`, source of
  truth) + rasterised transparent PNGs (3000×519, for docx/pptx which can't embed SVG). Applied: **red logo in
  the app header (both shells) and on the report covers.** Do not hand-recreate or recolour the mark.
- Still to confirm from portal: full neutral palette, secondary/gradient reds (currently `#ec0000`), and the
  official typeface name.
- **Decks:** all 5 recoloured to `#DA291C` (in-place XML colour swap, 626 refs; 0 overflow, layout untouched);
  deck builders' source red updated to match. The decks' drawn flame mark and Calibri body are **kept** — the
  official logo PNG and Santander Text aren't applied there yet, deliberately: swapping the deck font risks
  layout reflow I can't verify without the installed font. A dedicated deck rebuild can add logo + font later.
- App top-bar and card gradients standardised on `#DA291C` (the older bright `#ec0000` retired).
- Muted status palette: emerald-600 `#059669` / amber-600 `#d97706` / red-600 `#dc2626`
  (with 700-shade **text** variants `#047857` / `#b45309` / `#b91c1c` for small labels — AA contrast).
- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
- **Typeface: Santander Text** — the official corporate font (humanist sans-serif, © 2018 Banco Santander,
  proprietary/all rights reserved). Applied via **named font-family only** (`'Santander Text','Geist',…`) so it
  renders on Santander-managed devices where it's installed; **Geist** is the open-licensed fallback. **Never
  hotlink** third-party mirrors (wfonts / onlinewebfonts) or commit the font file — proprietary. The serif
  Fraunces is **retired** (Santander is a sans-serif brand). NB: a commercial *display serif* also named
  "Santander" (Made Good Designs) is an unrelated name-coincidence — do not use it.
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
- **Deck visual verification** is therefore done via `scripts/deck_to_html.py <deck> <slide>` → HTML →
  Chromium screenshot (bypasses LibreOffice). Faithful for brand colour, text, images/logo, tables and gross
  layout/overflow; freeform autoshapes (the drawn flame) render as a filled box, gradients use their end
  stops. Use it to eyeball decks after any change.
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
