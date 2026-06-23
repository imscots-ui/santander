# Santander Business Banking — Concept Prototype

> A self-initiated concept piece by **Alan Davidson** ([Alan.Davidson@santander.co.uk](mailto:Alan.Davidson@santander.co.uk))
> built outside core working hours to explore how Santander Business Banking
> workflows could move from paper to digital. Prototype only — no backend,
> no real data, no live system connections. Shared for internal discussion
> about where Business Banking goes next.

---

A working code prototype of the rebuilt Santander Business Banking app and website. Mobile and desktop in one, full workflow library, MTD HMRC integration, KYC/KYB compliance, dual-signature unlock for two-sig and all-sig accounts, business intelligence, privacy controls, and Voice ID biometrics.

## What this is

This is a **prototype** built in React. It runs on your own machine or on any web hosting service. It's not a production app — there's no real banking backend, no real HMRC connection, no real customer data. Everything you see is illustrative, designed to demo the customer experience and validate the design.

**Use it for:** internal demos, board presentations, customer research, design walkthroughs, building shared understanding of what "good" looks like.

**Don't use it for:** anything customer-facing, anything that touches real money or real personal data.

---

## See it right now — no installation needed

The prototype is live at:

**https://imscots-ui.github.io/santander/**

Open that link on any device — desktop, tablet, phone — and the full app loads instantly. No Node.js, no npm, no installation. This works because the entire prototype (all React, CSS, fonts, and icons) is packaged into a single 832KB HTML file.

Tap the share button in Safari or Chrome and choose **Add to Home Screen** for a full-screen native-feeling experience.

---

## Run it on your own computer (5 minutes)

If you want to edit the prototype and see changes live:

You need [Node.js](https://nodejs.org) installed (version 18 or newer). If you don't have it, download the LTS version from nodejs.org, run the installer, and you're done.

Then in a terminal:

```bash
npm install
npm run dev
```

Open the URL it shows (usually `http://localhost:5173`) in your browser.

The app opens, hot-reloads when you edit any file, and works on any device on the same Wi-Fi if you visit the network address Vite prints (something like `http://192.168.1.42:5173`).

---

## Deploy it to your own URL (10 minutes)

If you want your own shareable link:

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Vercel detects Vite automatically. Click Deploy.
4. After ~60 seconds you have a URL like `santander-prototype.vercel.app`.

Free tier is more than enough for internal demos. The exact same flow works with Netlify or Cloudflare Pages.

---

## What's in here

```
santander-app/
├── src/
│   ├── App.jsx          ← The whole prototype (~5,300 lines, single file)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Tailwind base styles
├── public/
│   ├── manifest.json    ← PWA manifest (home-screen install)
│   └── favicon.svg      ← Santander red brand mark
├── index.html           ← HTML shell
├── package.json         ← Dependencies and scripts
├── vite.config.js       ← Build tool config (uses vite-plugin-singlefile)
├── tailwind.config.js   ← Styling config
└── postcss.config.js    ← CSS processing
```

The whole prototype lives in `src/App.jsx`. All state, all workflows, all visual design. It's deliberately one file so you can read the whole product top-to-bottom without jumping between modules.

---

## What it does

**Mobile and desktop, one app.** Tap "Desktop" in the header to switch shells. State is preserved across the switch — start a workflow on mobile, finish on desktop.

**Seven entity types.** Tap the entity pill on the home screen to switch between sole trader, partnership, limited company, LLP, charity, club, society. The UI adapts completely: copy changes ("trustees" vs "directors"), required documents change, regulatory references change, available workflows change.

**Per-account mandates.** Each account has its own signing rule. Limited company has Operating (1 sig), Reserve (2 of 5), Payroll (2 of 5), Legacy Trading (all 5). Partnership has all-sign main accounts plus a 2-of-4 drawing account. The app enforces all of them.

**Eleven paperless workflows.** Every one replaces a paper Santander form or a phone call:

- **Account closure** — with Confirmation of Payee, credit check, and cooling-off
- **Partner unreachable escalation** — four regulatory branches (health/welfare, no contact, deceased/probate, dispute) following FCA Consumer Duty PS22/9
- **Mandate changes** — full KYC/KYB path, board minutes for charities, RM triggers
- **Bulk payments / wages** — payee book, CSV import, Confirmation of Payee verification, one-off or monthly scheduling
- **Business details update** — Companies House sync, RM escalation for partnership renames
- **Dormant account reactivation** — FSCS notice, 12-month inactivity threshold
- **MTD VAT submission** — auto-categorisation, confidence scoring, VAT100 direct to HMRC API
- **Personal/business account unlink** — removes personal accounts from the React render tree (not CSS hide), triggers CRM back-office update across all channels
- **Credit ring-fence** — formal written instruction excluding personal account history from business loan underwriting; GDPR Art.5(1)(c) purpose limitation; persists in state
- **Pre-approved business lending** — CCA 1974 regulated; 12/24/36-month terms with live repayment calculator; cooling-off rights
- **International FX payment** — EUR/USD/CHF/AUD/CAD; SWIFT reference; MLR 2017 screening flag on amounts ≥£50k; logged to audit trail

**Statements and transaction intelligence.** Six months of transactions, searchable by counterparty name. Filter by payment method (Card, Direct Debit, Standing Order, Faster Payment, BACS). Drill into any supplier to see method breakdown ("4 × Direct Debit, 2 × Card"), annual spend, and Direct Debit Guarantee with one-tap cancel — exactly what FCA Consumer Duty requires.

**Making Tax Digital.** Live VAT obligation display, transaction auto-categorisation, four-step quarterly submission flow, ITSA readiness banner, year-to-date sales / purchases / profit / tax owed.

**Business health score.** A circular gauge (0–100) computed live from five factors: liquidity, tax compliance, cash flow headroom, payroll ratio, and mandate health. Each factor shown as a colour-coded progress bar.

**13-week cash flow forecast.** An SVG bar chart projecting weekly balances from known direct debits, payroll, VAT, and income patterns. Amber warning line at £80k with an actionable nudge when headroom tightens.

**Supplier risk radar.** Five key counterparties shown with their Companies House filing status, days overdue, annual spend, and a RAG risk badge. Red means more than 180 days overdue — a material supply chain risk visible before it becomes a problem.

**Director command centre.** All signatories shown with KYC status, last-active timestamp, and pending action count. One tap to the approval queue per director.

**Smart payment sequencer.** 30-day balance outlook with a visual calendar of seven scheduled payments. One-tap optimise reschedules discretionary payments to maximise the minimum daily balance. Tax and rent payments are locked.

**Voice memo to MTD.** Tap to record an expense. 1.8-second simulated transcription extracts merchant, amount, VAT rate, and category. One tap to confirm into the MTD ledger.

**Receipt scan to MTD.** Simulated OCR scans a receipt image, extracts merchant, amount, VAT rate, and category, and categorises the transaction — closing the manual-entry gap in Making Tax Digital.

**International FX.** Five currency corridors, live indicative rates, FCA fee disclosure, and SWIFT reference generation. MLR 2017 screening triggered automatically on amounts above £50k.

**Pre-approved lending.** A hero card on the home screen showing the pre-approved offer. Three term options with a live monthly repayment calculator. CCA 1974 regulated with cooling-off rights displayed prominently.

**Voice ID biometrics.** Three-phrase voice enrolment with a GDPR Art.9 consent gate. Active across app, phone banking, and video call. Anti-spoofing liveness detection. The SCA step-up authentication matrix shows how Voice ID fits into the six-tier dynamic authentication flow.

**Notification bell.** Bell icon in both desktop and mobile headers opens a live notification sheet: session anomaly alerts with "That was me" / "Review sessions" paths, all unsigned pending approvals with quick navigation to the Sign tab, cooling-off progress bars with hours remaining, and stalled co-signer escalation cards.

**Open banking PSD2 consent audit.** All active third-party consent scopes shown with expiry dates. Flags personal data exposure (e.g. Funding Circle accessing salary data). One-tap revocation within the PSD2 RTS 90-second window.

**Cooling-off and stalled requests.** Live progress bars with working-day calculation (bank holidays skipped). Stalled requests show the relationship manager escalation card.

**Session anomaly detection.** An amber alert card when a new device or location is detected. "That was me" dismisses it; "Review sessions" opens the full security log.

**Audit trail.** Seven-year FCA SYSC 9 compliant log of every action, timestamped and actor-attributed. Immutable and accessible from the main navigation.

**Personal touch.** Priya Desai — the relationship manager — is one tap away from anywhere. Call, book, video. Accessibility footer (BSL relay, Relay UK, large print) on every screen.

---

## What it doesn't do

There's no backend. Authentication, real account balances, real HMRC submission, real Confirmation of Payee, real Companies House sync — all simulated. The prototype proves the design works; building it for real takes about 18 months.

CSV upload doesn't actually parse files — it shows what the parsed result would look like.

Face ID and Voice ID don't trigger device biometrics — they simulate the authentication.

VAT figures shown on transactions are illustrative only. Real VAT classification needs the supplier's VAT registration status, the customer's VAT scheme (standard / flat-rate / cash accounting), and the merchant category code on cards. The prototype shows zero VAT on wages and HMRC settlements (correct), 20% extracted from gross on standard B2B (correct), and "review" on travel (which mixes zero-rated rail with 20% hotels). Production needs proper accounting integration.

This is intentional. Building the simulated version first lets the team validate the workflows, the copy, the regulatory framing, and the customer experience before committing engineering time to the production build.

---

## Editing it

Open `src/App.jsx` in any text editor. Save the file. The browser auto-reloads with your change.

Some places worth tweaking:

- **Colours** (line ~490 onwards in `<style>{css}`): change `#c8102e` to a different brand red.
- **Entity copy** (`ENTITY_INFO`, line ~142): customise names, principal labels, regulatory cross-references per entity type.
- **Accounts** (`accounts useMemo`, line ~162): change account names, balances, mandate rules.
- **Pending approvals** (`pendingApprovals`, line ~165): demo the "Awaiting your signature" tab with different examples.
- **Payee book** (`payees useState`, line ~79): pre-populate different demo employees for the bulk payments flow.
- **MTD data** (`mtdData`, line ~214): tweak VAT amounts, deadlines, transaction examples.
- **Statements data** (`statementsData useMemo`, line ~257): change transaction history, counterparty names, amounts.

---

## Browser compatibility

Tested on Safari 17+, Chrome 120+, Firefox 122+, Edge 120+. Should work in any browser supporting ES2020 modules and CSS custom properties — which is anything from the last three years.

---

## Built with

- React 18 (UI framework)
- Vite (build tool, dev server)
- vite-plugin-singlefile (packages everything into one HTML file)
- Tailwind CSS (styling)
- Lucide icons (the icon set)
- Fraunces and Geist fonts (loaded from Google Fonts)

No analytics, no tracking, no external API calls beyond Google Fonts. Runs entirely offline once loaded.

---

## Questions

If you want to extend this — add a new entity type, plug in a real backend, deploy as iOS / Android — that's exactly the work the production build covers. The prototype's data model is structured to map directly to the real systems Santander would use: Companies House numbers, FCA registration data, HMRC VRN/UTR fields, FATCA residency, MLR 2017 PEP flags, GOV.UK One Login identity verification. Nothing is invented; everything has a production counterpart.

— A digital bank with a personal touch.

---

## About

Created by **Alan Davidson** as a self-initiated concept piece, June 2026.
Built outside core working hours to explore what's possible.

If you'd like to discuss any of the ideas, walk through the prototype, or
take any of the thinking forward, get in touch:

[Alan.Davidson@santander.co.uk](mailto:Alan.Davidson@santander.co.uk)
