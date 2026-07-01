# INPUTS NEEDED — What Would Make the Work Materially Better

A short report of inputs only you can supply. Each entry says **what**, **why it matters**, **what it
unlocks**, and **the smallest useful version** (so none of these is all-or-nothing). Ranked by impact.

_Prepared July 2026 · Alan Davidson._

---

## 1. Vetted regulatory source material  ·  impact: HIGH

**What:** the actual regulatory texts (or an approved citation list) for the instruments in `CITATIONS.md` —
PSD2/SCA-RTS, PSR 2017, MLR 2017, FCA DISP/BCOBS/SYSC, Consumer Duty, CoP, Direct Debit Guarantee, CCA 1974,
UK GDPR, HMRC MTD, WCAG.

**Status (updated):** the citations are now marked **high-confidence (knowledge-verified)** in `CITATIONS.md`
and are suitable for internal drafts. Only two carry a residual flag: the **Data Use and Access Act 2025
commencement dates** (ref 15) and the **exact wording/scope of the ICO vetting guidance** (ref 17). The primary
sources you pointed to (`legislation.gov.uk`, `ico.org.uk`, `gov.uk`) are **blocked by this session's egress
policy**, so I could not machine-verify against them.

**Why it still matters:** for a document that reaches risk & compliance, **a wrong SI number or clause reference
is worse than none.** Knowledge-verified is fine internally; source-verified is what you'd want before anything
external or formal.

**What it unlocks:** precise, defensible citations in every report and deck; the ability to remove the
"pending verification" caveat in `CITATIONS.md`; and confidence to take a document beyond internal draft.

**Smallest useful version:** even a one-page approved list of "cite these exactly like this" for the top six
instruments (PSD2/SCA, PSR 2017, MLR 2017, DISP, Consumer Duty, WCAG) covers ~90% of what the reports lean on.

---

## 2. Brand kit  ·  impact: RESOLVED (Jul 2026)

**Resolved by the Captain supplying the official *Basic Guidelines for Santander* (santander.com brand portal,
© Banco Santander S.A. 2020) plus the Monotype typeface names.** Now applied and recorded in `DECISIONS.md`:

- **Full official palette** — Santander Red `#EC0000` (Pantone 485 C), Boston `#CC0000`, London `#990000`,
  Madrid `#EA6F5D`, Mexico City `#F0B998`, Rio `#F5DECF`, Lisbon `#FBF1EA`, White, Black. Backgrounds limited
  to the asterisked tones (White, Lisbon, Rio, Santander Red).
- **Logo rules** — main / secondary / symbol versions, clear space from flame width, minimum sizes
  (25px / 50px / 16px), black & white and negative variants, cobranding lockups.
- **Typefaces** — Santander Logo, Santander Headline, Santander Text (custom, Monotype, proprietary).

**Still open (small):** the licensed font *files* themselves (named-family + Geist fallback works meanwhile),
and any in-house report/deck template if one exists.

---

## 3. A one-line brief per deliverable  ·  impact: MEDIUM (costs you a sentence)

**What:** for each report/deck, one line — **who is it for, and what decision should it drive?**

**Why it matters:** the "written like a school kid" feedback on the first report draft was partly me guessing
the audience. "Exec committee, to release pilot funding" and "working note for the design team" are different
documents in register, length and emphasis. I can hit the target far better when I know it.

**What it unlocks:** the right register first time, fewer rewrites, and content pitched at the decision rather
than at everything.

**Smallest useful version:** literally one sentence at the start of the task.

---

## 4. Optional, lower priority

- **Real demo data shape** — if a future version should mirror real account/transaction structures, a
  (fully anonymised, synthetic) example schema would make the prototype more convincing. Not needed while it
  stays illustrative.
- **Target platform for the decks** — if these are presented in PowerPoint proper (not just the generated file),
  confirming the version/venue lets me tune for it.

---

## Already set up on my side (no input needed)

- **Webhook noise removed** — unsubscribed from PR activity, so `Building`/`Ready` events no longer interrupt.
- **`DECISIONS.md`** — a cross-session log of settled facts and sensitive decisions (incl. the Quantum-IP
  deletion), so nothing is re-litigated or accidentally undone after a context reset.
- **`CITATIONS.md`** — a curated, greppable citation index feeding the reports (pending your item 1 to verify).
- **The full build/verify pipeline** — scaffold, parallel review, pre-commit gate, runtime WCAG drive-through,
  and deck QA — all in place and self-checking.

---

**Bottom line:** items **1** and **2** would lift every future report and deck a full grade; item **3** costs
you a sentence and saves me a rewrite. Everything I could set up myself is done.
