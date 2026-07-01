# Shipwright's Backlog — HMS 1701 / Santander Prototype

The ship's **living idea log**. Feature candidates survive here across context resets so out-of-the-box thinking isn't lost at compaction. `/shipwright` reads this before generating a slate and appends survivors after; the Captain orders builds from it; shipped items move to **Launched**.

**Legend — demo strength:** ⭐⭐⭐ high · ⭐⭐ medium · ⭐ low.
**Status:** `idea` → `specced` → `building` → `launched` (or `parked`).

---

## Launched

| Feature | Shipped | Note |
|---|---|---|
| Standing Orders & Direct Debits workflow | Jun 2026 | 13th workflow; DD Guarantee cancel + SO set-up |
| Personal-PIN signing option | Jun 2026 | PIN alternative to Face ID in the signature queue |
| Card Controls sheet | Jul 2026 | Limits · contactless/online/abroad/ATM/gambling · report-lost → reissue |
| Transaction dispute / chargeback | Jul 2026 | 14th workflow; fraud (PSR 2017) / DD Guarantee / Visa chargeback routes; passed /muster |

---

## Candidate slate

Each row: *user · paper process it replaces · regulatory hook · demo strength*. Pick from the top, spec with `/shipwright`, gate with the officers.

| # | Feature | User | Replaces | Reg hook | Demo | Status |
|---|---|---|---|---|---|---|
| 3 | **International beneficiary onboarding** | Finance clerk | Faxed IBAN + wet-ink verification | CoP-equivalent, sanctions screening | ⭐⭐⭐ | idea ← recommended next |
| 4 | **Statement / certificate of balance on demand** | Accountant | Written request, 5-day postal wait | — (evidence for MTD/lenders) | ⭐⭐ | idea |
| 7 | **Trusted-device & session management** | Any user | Branch visit to reset access | PSD2 SCA, SYSC | ⭐⭐ | idea |
| 2 | **Business overdraft / limit change** | Director | Phone-and-post facility request | CONC, affordability | ⭐⭐ | idea |
| 6 | **Scheduled payment run approval (dual control)** | Two directors | Cheque-book counter-signing | Mandate `all` / `any-2` rule | ⭐⭐ | idea |

### Out-of-the-box wildcards (widen the search — needn't win)

| # | Idea | What it is | Demo |
|---|---|---|---|
| W1 | **Plain-English mode** | A toggle that rewrites every regulatory step ("Confirmation of Payee", "cooling-off") into one-line plain English inline — accessibility + Consumer Duty story | ⭐⭐⭐ |
| W2 | **Cooling-off time-travel** | A demo-only "fast-forward 24h" control so a presenter can show a cooling-off request maturing live on stage without waiting | ⭐⭐⭐ |
| W3 | **Command palette (⌘K)** | Type-to-jump to any workflow/screen — power-user + shows breadth of the 13 journeys in one keystroke | ⭐⭐ |
| W4 | **Audit-trail export** | One-tap "download my activity" (SYSC 9) rendered as a clean statement — ties the whole paperless story together | ⭐⭐ |
| W5 | **Accessibility-first re-skin** | A high-contrast / large-type view toggled from the A11y sheet — proves the design system flexes to WCAG AAA | ⭐⭐ |

---

## Parked

*(ideas considered and set aside — record why, so they aren't re-proposed)*

- **Add / remove a signatory** — parked Jul 2026: already covered by the `mandate` workflow (Home tile "Change mandate" = add, remove, signing rule). Would duplicate, not add.

---

*Maintained by `/shipwright`. Do not delete launched history — it doubles as a build record.*
