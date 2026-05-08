# Santander Business Banking — Concept Prototype

> A self-initiated concept piece by **Alan Davidson** ([Alan.Davidson@santander.co.uk](mailto:Alan.Davidson@santander.co.uk))
> built outside core working hours to explore how Santander Business Banking
> workflows could move from paper to digital. Prototype only — no backend,
> no real data, no live system connections. Shared for internal discussion
> about where Business Banking goes next.

---

A working code prototype of the rebuilt Santander Business Banking app and website. Mobile and desktop in one, full workflow library, MTD HMRC integration, KYC/KYB compliance, dual-signature unlock for two-sig and all-sig accounts.

## What this is

This is a **prototype** built in React. It runs on your own machine or on any web hosting service. It's not a production app — there's no real banking backend, no real HMRC connection, no real customer data. Everything you see is illustrative, designed to demo the customer experience and validate the design.

**Use it for:** internal demos, board presentations, customer research, design walkthroughs, building shared understanding of what "good" looks like.

**Don't use it for:** anything customer-facing, anything that touches real money or real personal data.

---

## Run it on your own computer (5 minutes)

You need [Node.js](https://nodejs.org) installed (version 18 or newer). If you don't have it, download the LTS version from nodejs.org, run the installer, and you're done.

Then in a terminal:

```bash
cd santander-app
npm install
npm run dev
```

Open the URL it shows (usually `http://localhost:5173`) in your browser.

That's it. The app opens, hot-reloads when you edit any file, and works on any device on the same Wi-Fi if you visit the network address Vite prints (something like `http://192.168.1.42:5173`).

---

## Demo it on a phone or tablet

The fastest path is to run it locally as above, then on your phone visit the network address (the second URL Vite prints, the one starting with your computer's IP). Tap the share button in Safari or Chrome and choose **Add to Home Screen**. The app installs as if it were native — full-screen, app icon, no browser chrome.

This is also how a real Santander Business pilot would work for the first 500 beta customers before App Store / Play Store deployment.

---

## Deploy it to a public URL (10 minutes)

If you want to send a colleague a link they can click without installing anything:

1. Push this folder to a GitHub repository (or use Vercel CLI directly).
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Vercel detects Vite automatically. Click Deploy.
4. After ~60 seconds you have a URL like `santander-prototype.vercel.app`.

Free tier is more than enough for internal demos. The exact same flow works with Netlify or Cloudflare Pages.

---

## What's in here

```
santander-app/
├── src/
│   ├── App.jsx          ← The whole prototype (2,500+ lines, single file)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Tailwind base styles
├── public/
│   ├── manifest.json    ← PWA manifest (home-screen install)
│   └── favicon.svg      ← Santander red brand mark
├── index.html           ← HTML shell
├── package.json         ← Dependencies and scripts
├── vite.config.js       ← Build tool config
├── tailwind.config.js   ← Styling config
└── postcss.config.js    ← CSS processing
```

The whole prototype lives in `src/App.jsx`. All state, all workflows, all visual design. It's deliberately one file so you can read the whole product top-to-bottom without jumping between modules.

---

## What it does

**Mobile and desktop, one app.** Tap "Desktop" in the header to switch shells. State is preserved across the switch — start a workflow on mobile, finish on desktop.

**Seven entity types.** Tap the entity pill on the home screen to switch between sole trader, partnership, limited company, LLP, charity, club, society. Watch the UI adapt: copy changes ("trustees" vs "directors"), required documents change, regulatory references change.

**Per-account mandates.** Each account has its own signing rule. Limited company has Operating (1 sig), Reserve (2 of 5), Payroll (2 of 5), Legacy Trading (all 5). Partnership has all-sign main accounts plus a 2-of-4 drawing account. The app handles all of them.

**Six paperless workflows.** Bulk payments, mandate changes, business detail updates, ID register, dormancy reactivation, account closure. Every one replaces a paper Santander form.

**Statements & transaction intelligence.** Tap "Money" in the bottom nav (or "Statements" in the desktop sidebar). Search by supplier name to find every payment to them, ever — totals, averages, full history. Filter the chronological view by payment method (Card, Direct Debit, Standing Order, Faster Payment, BACS). Each transaction shows its method icon at a glance. Tap any supplier or transaction to drill into the counterparty detail sheet, which shows method breakdown ("4 × Direct Debit, 2 × Card") and surfaces the Direct Debit Guarantee with a one-tap cancel — exactly what FCA Consumer Duty asks for.

**MTD HMRC.** Tap "Tax" in the bottom nav. Live VAT obligation, transaction categorisation, four-step quarterly submission flow, year-to-date sales / purchases / profit / tax owed.

**Cooling-off and stalled requests.** Tap "Demo cooling-off" on the home screen to see the live progress bar, working-day calculator, and confirmation modal. Tap "Simulate timeout" to see the relationship manager escalation card.

**Personal touch.** Priya Desai — the relationship manager — is one tap away from anywhere. Call, book, video. Accessibility footer (BSL relay, Relay UK, large print) on every screen.

---

## What it doesn't do

There's no backend. Authentication, real account balances, real HMRC submission, real Confirmation of Payee, real Companies House sync — all simulated. The prototype proves the design works; building it for real takes about 18 months and the team described in the pitch deck.

CSV upload doesn't actually parse files — it shows what the parsed result would look like.

The Face ID button on signing screens doesn't trigger device biometrics — it simulates the signature.

VAT figures shown on transactions are illustrative only. Real VAT classification needs the supplier's VAT registration status, the customer's VAT scheme (standard / flat-rate / cash accounting), and the merchant category code on cards. The prototype shows zero VAT on wages and HMRC settlements (correct), 20% extracted from gross on standard B2B (correct), and "review" on travel (which mixes zero-rated rail with 20% hotels). Production needs proper accounting integration.

This is intentional. Building the simulated version first lets the team validate the workflows, the copy, the regulatory framing, and the customer experience before committing engineering time to the production build.

---

## Editing it

Open `src/App.jsx` in any text editor. Save the file. The browser auto-reloads with your change.

Some places worth tweaking:

- **Colours** (line ~313 onwards in `<style>{css}`): change `#c8102e` to a different brand red.
- **Entity copy** (line ~88, `ENTITY_INFO`): customise names, principal labels, regulatory cross-references per entity type.
- **Accounts** (line ~108, `accounts useMemo`): change account names, balances, mandate rules.
- **Pending approvals** (line ~165, `pendingApprovals`): demo the "Awaiting your signature" tab with different examples.
- **Payee book** (line ~67, `payees useState`): pre-populate different demo employees for the bulk payments flow.
- **MTD data** (line ~177, `mtdData`): tweak VAT amounts, deadlines, transaction examples.

---

## Browser compatibility

Tested on Safari 17+, Chrome 120+, Firefox 122+, Edge 120+. Should work in any browser supporting ES2020 modules and CSS custom properties — which is anything from the last three years.

---

## Built with

- React 18 (UI framework)
- Vite (build tool, dev server)
- Tailwind CSS (styling)
- Lucide icons (the icon set)
- Fraunces and Geist fonts (loaded from Google Fonts)

No analytics, no tracking, no external API calls beyond Google Fonts. Runs entirely offline once loaded.

---

## Questions

If you want to extend this — add a new entity type, plug in a real backend, deploy as iOS / Android — that's exactly the work the production build covers. The prototype's data model is structured to map directly to the real systems Santander would use: Companies House numbers, FCA registration data, HMRC VRN/UTR fields, FATCA residency, MLR 2017 PEP flags. Nothing is invented; everything has a production counterpart.

— A digital bank with a personal touch.

---

## About

Created by **Alan Davidson** as a self-initiated concept piece, May 2026.
Built outside core working hours to explore what's possible.

If you'd like to discuss any of the ideas, walk through the prototype, or
take any of the thinking forward, get in touch:

[Alan.Davidson@santander.co.uk](mailto:Alan.Davidson@santander.co.uk)
