# HMS 1701 — Project Manifest
## Santander Business Banking Digital Prototype
### Complete record of everything built, written, and delivered

**Author:** Alan Davidson · Business Banking Advisor  
**Capacity:** Self-initiated · Completed entirely out of hours · Own time  
**Date:** June 2026  
**Prototype:** https://imscots-ui.github.io/santander/

---

## 1. The Prototype — App.jsx

**Location:** `/App.jsx`  
**Size:** ~5,300 lines · ~300KB · Single React component  
**Purpose:** Fully functional Santander Business Banking prototype — no backend, no real data, browser-only

### Screens (5 main tabs)

| Screen | Key Features |
|--------|-------------|
| Home Dashboard | Balance hero card, business health score gauge, session anomaly alert, supplier risk radar, director command centre, 13-week forecast, cards, pending approvals, cooling-off progress bars, MTD VAT alert, RM card (Priya Desai), accounts list with mandate badges, Voice ID security, demo controls |
| Signature Queue | Dual-authorisation — sign with Face ID or reject pending mandates/closures/payments, status display per item |
| Financial Statements | 6 months transactions, chronological + category views, counterparty search, detail sheets, PDF/CSV/Excel export, method filter |
| Making Tax Digital | HMRC VAT obligations, quarterly submission wizard (4 steps), ITSA readiness, YTD tax estimate, insights panel |
| Audit Trail | 7-year FCA SYSC 9 compliant log, every action timestamped and actor-attributed, immutable |

### Workflows (12 step-based wizards · 5 sheet overlays)

| Workflow | Steps | Key Logic |
|----------|-------|-----------|
| Account Closure | Select → Destination (CoP) → Credit check → Sign | Cooling-off on Any-1 accounts, mandate enforcement. Partnership Any-2: full partner-unreachable escalation path |
| Partner Unreachable Escalation | Reason → Contact log + evidence → Restriction notice → Case ref | 4 regulatory branches: health/welfare, no contact, deceased/probate, dispute. FCA Consumer Duty PS22/9. Case ref SVC-2026-4471 |
| Mandate Changes | Action → Personal details → KYC docs → Board minutes → Sign | KYC/KYB full path, RM escalation triggers, 7 entity types |
| Bulk Payments / Wages | Source account → Payee selection → Review → Sign + Schedule | Payee book, CoP verification, CSV import, one-off/monthly |
| Business Details Update | Select changes → Enter values → Upload proof → Sign | Companies House sync, RM for partnership renames |
| Dormant Reactivation | Single step — select and request | FSCS notice, 12-month inactivity threshold |
| MTD VAT Submission | Categorise → Review VAT100 → Declare → Submit | Auto-categorisation, confidence scoring, HMRC API v1.0 |
| Personal/Business Unlink | Confirm scope → Data separation notice → All-channels + postal toggles → Declaration | Removes personal accounts from React render tree (not CSS hide). unlinkAllChannels triggers CRM back-office update (ref REL-2026-0291, 2 working days) |
| Credit Ring-Fence | Risk overview + legal basis → Declaration | Formal instruction: personal account data excluded from business credit decisioning. GDPR Art.5(1)(c) purpose limitation. Persistent state — survives workflow close |
| Pre-approved Business Lending | Offer/term selector → Terms & cooling-off rights → Confirm & draw down | CCA 1974 regulated. 3 term options 12/24/36 months with live monthly repayment calculator. lendingCompleted persists |
| International FX Payment | Amount + currency + IBAN + beneficiary → Rate & FCA fee disclosure → Confirm & sign | 5 currencies: EUR/USD/CHF/AUD/CAD. MLR 2017 screening flag ≥£50k. SWIFT ref logged to audit trail |
| Complaint Handling | Intake → Escalation triage → Denial → Case outcome | FCA DISP-compliant 4-step flow. Eligible complainant check (DISP 2.7), escalation flag selection, denial reason, optional goodwill gesture. Triggers from Home screen "Log complaint" tile |

### Entity Types (7 — all compliance paths diverge)

| Entity | Mandate Default | Principal | Companies House | Board Minutes |
|--------|----------------|-----------|-----------------|---------------|
| Sole Trader | Any-1 | Sole trader | No | No |
| Partnership | Any-1/2 | Partner | No | No (RM on rename) |
| Limited Company | Any-2 | Director | Yes | No |
| LLP | Any-2 | Member | Yes (LLP no.) | No |
| Registered Charity | All | Trustee | No | Yes — all changes |
| Club | All | Committee member | No | Yes — all changes |
| Society | All | Committee member | No | Yes — all changes |

### Security & Compliance Features Built

| Feature | Regulation | Implementation |
|---------|-----------|----------------|
| 24h cooling-off | FCA BCOBS 4A | Working-hours aware (bank holidays skipped), cancellable, progress bar every 30s |
| Dual-authorisation | PSR 2017 | Any-1 / Any-2 / All per account, co-signer notification, 48h window |
| KYC/KYB | MLR 2017 / JMLSG | GOV.UK One Login List 1, address List 2, trading List 3, sanctions, PEP, visa check |
| Audit trail | FCA SYSC 9 | 7-year retention, append-only, actor/timestamp on every event |
| MTD compliance | HMRC MTD | Digital links, 6-year records, HMRC-recognised software, VAT100 direct API |
| Confirmation of Payee | PSR SI 2019/1215 | Pre-payment verification, mismatch warning, explicit override |
| Accessibility | WCAG 2.1 AA | focus-visible:ring on all elements, contrast ≥4.5:1, tabular-nums, ARIA labels |
| Focus management | WCAG 2.1 SC 2.4.7 | focus:outline-none only with focus-visible: companion — never bare |
| Partner unreachable | FCA Consumer Duty PS22/9 / BCOBS | Documented contact attempts, evidence upload, specialist team referral, account restriction. 4-path regulatory branching |
| Personal/business separation (app) | GDPR Art.5(1)(c) | personalLinked state removes personal section from JSX render tree — not CSS visibility, not display:none |
| Personal/business separation (call centre) | GDPR Art.5(1)(c) | unlinkAllChannels toggle triggers CRM back-office update — CLI lookup excludes personal accounts. Explicit 2-working-day SLA |
| Postal statement separation | GDPR Art.5(1)(c) | unlinkPostal toggle — separate delivery preference per channel |
| Credit ring-fence | GDPR Art.5(1)(c) / ICO LIA | Formal written instruction persisted in state. Personal account history excluded from business loan/overdraft underwriting |
| Open banking PSD2 consent audit | PSD2 RTS Art.29 | OBSheet shows all third-party consents with scope and expiry. Flags personal data exposure (Funding Circle). Revocation within 90 seconds per RTS |
| Receipt scan → MTD | HMRC MTD digital links | Simulated OCR: scan receipt → extract merchant/amount/VAT/category → categorise transaction. Updates audit trail. Closes the manual-entry gap in MTD |
| Voice ID biometric | PSD2 RTS Art.4(30) · GDPR Art.9 · NIST SP 800-63B | 3-phrase voice enrolment with GDPR special-category consent gate. Active across app, phone banking, and video call. Anti-spoofing (liveness + replay detection). voiceIdEnrolled persists |
| SCA step-up matrix | PSD2 RTS Art.97 · FCA PS19/4 | 6-tier dynamic authentication: device passkey → biometric → Voice ID → Voice ID + co-sig + cooling-off. Displayed as interactive info sheet within VoiceIdSheet |
| Session anomaly detection | FCA SYSC 10A · PSD2 RTS Art.2 | Dismissible amber card on HomeScreen. New device/location alert with "This was me" or "Review sessions" paths. Dismissed banner links to Voice ID status sheet |
| Supplier risk radar | Companies House filing obligations | 5 key suppliers shown with CH reg, last filed date, days overdue, annual spend, RAG risk badge. Red = >180d overdue, amber = 90–180d, green = current. Links to CH API |
| Live notification bell | FCA SYSC 10A · PSD2 RTS Art.2 | Bell icon (desktop + mobile) opens NotificationsSheet. Shows: session anomaly alert with CTAs, all unsigned pending approvals with quick-navigate to Sign tab, cooling-off progress bars with hours remaining, stalled co-signer escalations. Empty state for clean days. Badge dot always visible while anomaly or approvals exist |

### Home Screen Intelligence

| Feature | Implementation |
|---------|---------------|
| Pre-approved lending offer | Hero card showing £45,000 pre-approved offer. Disappears after draw-down, replaced by active loan summary chip |
| 13-week cash flow forecast | SVG bar chart (forecastWeeks useMemo) — 13 weekly balance projections from known DDs, payroll, VAT, income patterns. Amber warning line at £80k with actionable nudge |
| Business health score | Circular SVG gauge (0–100) computed live from 5 factors: liquidity (0–20), tax compliance (0–20), cash flow headroom (0–20), payroll ratio (0–20), mandate health (0–20). Each factor shown as a progress bar with colour coding. healthScore useMemo refreshes on accounts/payees/forecast changes |
| Supplier risk radar | 5 key counterparties with Companies House filing status. Red/amber/green risk badge per supplier. Annual spend displayed. Critical badge if any red. SUPPLIER_RISK static data |
| Director command centre | 2×2 grid showing all 4 signatories. Per-director: initials avatar, role, KYC status, last-active timestamp, pending action count (red badge). Links to Approve tab |
| Voice memo → MTD | Tap-to-record expense entry. 1.8s simulated transcription. Extracts merchant, amount, VAT rate, category, reference. One-tap confirm to MTD ledger. voiceMemoAdded Set persists entries |
| Smart payment sequencer | 30-day balance outlook SVG chart (daily bars, red warning line). 7 scheduled payments with type colour coding (tax/fixed/supplier). Optimise button reschedules discretionary payments to maximise minimum balance. Locked payments (tax/rent) unaffected |
| Voice ID biometric setup | 3-phrase enrolment, cross-channel status (app/phone/video), anti-spoofing badge, SCA tier table. GDPR Art.9 consent gate shown on first entry |

### Accessibility Fixes Applied This Session

| Component | Bug | Fix |
|-----------|-----|-----|
| `Input` | Bare `focus:outline-none` — keyboard focus invisible | `focus-visible:ring-2 focus-visible:ring-stone-900/20 focus-visible:border-stone-900` |
| `StepFrame` back button | No focus indicator | `focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900` |
| `StepFrame` close button | No focus indicator | `focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900` |
| `Toggle` | No focus indicator | `focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900` |

### CSS Additions (inline `css` template literal)

| Class | Purpose |
|-------|---------|
| `.skeleton` | Loading state — shimmer animation on placeholder blocks |
| `.focus-ring` | Reusable keyboard-only focus utility |
| `.on-dark` | `color: rgba(255,255,255,0.65)` — text on dark cards (Grey-on-Colour Law) |
| `.on-dark-2` | `color: stone-300` — secondary text on dark surfaces |
| `.on-red` | `color: red-200` — text on red surfaces |

---

## 2. The Ships Company — Agent Architecture

**Location:** `.claude/commands/*.md` + `.claude/settings.json`

### Command Files (slash-invocable in Claude Code)

| File | Command | Officer | Duty |
|------|---------|---------|------|
| `.claude/commands/xo.md` | `/xo` | Commander (XO) | Architecture quality, hook discipline, pattern enforcement, single-file mandate |
| `.claude/commands/security.md` | `/security` | Lt Cdr Security | XSS scan, secrets scan, focus accessibility audit, PII check, dependency review |
| `.claude/commands/engineer.md` | `/engineer` | Lt Cdr Engineer | Bundle analysis, React performance, key props, tick interval, Vite config, CSS delivery |
| `.claude/commands/bosun.md` | `/bosun` | Lieutenant Bosun | Spacing violations, colour violations (stone not gray), shadow system, empty states, hierarchy |
| `.claude/commands/signals.md` | `/signals` | Lieutenant Signals | State signal integrity, useMemo dependency audit, state mutation safety, cooling system |
| `.claude/commands/ship-ready.md` | `/ship-ready` | All stations | 7-station pre-commit checklist — GREEN/AMBER/RED per station |

### Settings — `.claude/settings.json`

**Allow list:** `npm run dev`, `npm run build`, `npm run preview`, `git push -u origin`, `git add`, `git commit`, `git status`, `git diff`, `git log`, `git branch`, `python3`, `node`, `npx vite`

**Deny list:** `rm -rf`, `git push --force`, `git push --no-verify`, `chmod 777`, `curl | bash`, `wget | sh`, `eval`, `exec`

**Hooks:** PreToolUse bash hook — prints standing orders reminder before every shell call

### Ships Company Doctrine

**File:** `1701-uniform/SHIP-COMPANY.md`

Contents:
- Chain of command (Captain → XO → Security → Engineer → Bosun → Signals)
- Standing orders (6 rules)
- Design system quick reference
- Security protocols (Five Laws + WCAG minimum)
- Reference library table (8 key sections)
- Specialist ranks — when to call them

---

## 3. The Reference Library — REFERENCE.md

**Location:** `1701-uniform/REFERENCE.md`  
**Size:** 23,260 lines · 96 sections · 105 books & regulatory documents · Quick Lookup decision index (Jun 2026)

### Domain Groups (96 sections)

| Domain | Sections | Key sources |
|--------|----------|-------------|
| Core Development | §1–22, §91 | Python, SQL, FastAPI, Docker, Git, React/JS, JWT, HTTP, Linux, Security, Pydantic, async, pytest, System Design Interview (Groks King) |
| AI & Prompt Engineering | §20, §23–25, §58–65, §72–74 | Claude, AI Agents, Copilot, ChatGPT, AI Content Creation, Surveillance AI, Dynamics 365 AI, 600+ prompts |
| Banking · Payments · Regulation | §35–41, §66–70, §84, §86–88 | PSD2, MTD HMRC, FPS/BACS/CHAPS/SWIFT, KYC/AML, Companies House, FCA Consumer Duty, AML MLR, Ring-Fencing, BCOBS, SCA, FCA Compliance (Mills), UK Payment Rail Designation Orders, UK Post-Trade Task Force |
| Prudential & Market Regulation | §87–88 | PRA/PRC (Jenkins PRC questionnaire), PRA SS19/13 Resolution Planning (3 versions: 2013/2018/2026), MREL evolution, CNRF KYC, Deposit Aggregators (Evans Dear CFO), Post-Trade Task Force April 2022 |
| Data Protection | §75, §77 | GDPR/DPDI/Marketing AI (Scheuing, Kogan Page 2024), GDPR for Startups (Martin, Edward Elgar 2023) |
| UI · Frontend · Design | §11, §26, §42, §50–56, §78–81 | React/JS patterns, Refactoring UI, Tailwind CSS v3 (Bocso, De Quattro, Joshi — 3 books), CSS Animation, Vite/TS, React 19, React Hooks in Action (Larsen/Manning), UX, Photoshop, KiCad |
| Digital Banking Transformation | §82, §83, §85 | World's Best Bank — DBS (Speculand 2021), The Autonomous Bank — AI/ML (Dhillon 2025), Driving Digital Transformation — TMRW/UOB (Khoo 2021) |
| Microsoft Ecosystem | §27–33, §64–65, §76, §92 | Power Teams, Power BI (×2), PowerPoint (×3 — incl. PowerPoint 365 Pro / Lemmings), SharePoint, Dynamics 365 BC AL, Azure AI Engineer |
| Document Production & Publishing | §94–96 | LibreOffice Extensions (Weber/TDF), KDP Formatting with LibreOffice (Heliose), PDF→EPUB with Calibre & LibreOffice (Frobnitz) — page styles, print PDF, regex cleanup |
| Employment & Equality Law | §34 | Equality Act 2010, protected characteristics, WCAG legal duty, reasonable adjustments |
| Electronics · Hardware · IoT | §43–49, §54, §57, §89 | MakerSpace, Electronics, Mechatronics, Digital Logic, Devices & Circuits, Arduino/IoT, Embedded Linux, ISO GD&T Geometrical Tolerancing (Green, Elsevier) |
| Engineering Design & Decision Systems | §93 | Computer-Aided Materials Selection During Structural Design (NMAB-467, National Research Council) — knowledge-base / expert-system design, concurrent engineering |
| Quick Lookup Decision Index | — | 70+ answers · 8 themed tables · maps common questions to exact values · spans all 96 sections |

---

## 4. CLAUDE.md — Captain's Standing Orders

**Location:** `/CLAUDE.md`

### Added This Project

- Ships company command table (all 6 officers + duties)
- Standing Security Orders (5 laws)
- Design System Standing Orders (Bosun's Law — spacing, colour, CTA hierarchy, monetary amounts)
- `closeWorkflow()` invariant reminder
- Architecture section: single-file constraints, hook discipline

---

## 5. Deployment

### GitHub Pages

**Branch:** `gh-pages`  
**URL:** https://imscots-ui.github.io/santander/  
**Contents:** `index.html` (832KB self-contained, all JS/CSS/fonts inlined) + `.nojekyll` + `vercel.json`  
**Fix applied:** `DOMContentLoaded` listener — vite-plugin-singlefile inlines JS into `<head>` as plain `<script>` (no defer), so React mount must wait for DOM ready

### Vercel

**Config:** `vercel.json` on `gh-pages` branch — `buildCommand: null`, `outputDirectory: "."`, `framework: null`  
**Purpose:** Serve the pre-built HTML directly, bypass Vite build step  
**Domains:** `santander-g671k7hgb-imscots-uis-projects.vercel.app`

### Build Configuration

**File:** `vite.config.js`  
**Plugin:** `vite-plugin-singlefile` — inlines all JS, CSS, fonts into single HTML  
**Target:** `esnext` · **Output:** `dist/index.html` (832KB · 182KB gzip)  
**Key fix:** Removed `removeViteModuleLoader: true` — was stripping module type and causing script execution order issue

---

## 6. Presentation Deliverables

### Pitch Deck — `Santander_Digital_Banking_Future.pptx`

16 slides · Santander brand colours throughout · Built with python-pptx

| Slide | Content |
|-------|---------|
| 1 | Title + Business Banking Advisor stamp |
| 2 | Executive summary + 8 headline statistics |
| 3 | The problem — 4 pain points |
| 4 | What we built — 21 features (4-col grid) |
| 5 | Privacy controls — app/call centre separation, credit ring-fence, PSD2 consent audit |
| 6 | Advanced features — pre-approved lending, 13-week forecast, international FX, receipt scan |
| 7 | Intelligence & security — business health score, supplier risk radar, director command centre, Voice ID, payment sequencer, voice memo, notification bell |
| 8 | Paperless workflows deep-dive |
| 9 | Making Tax Digital deep-dive |
| 10 | Security & compliance (4 frameworks) |
| 11 | Financial intelligence features |
| 12 | Technical architecture (current + production) |
| 13 | Business case — £137M annualised opportunity + 5 competitive differentiators |
| 14 | Roadmap — 4 phases Q3 2026→Q2 2027 |
| 15 | Design system & accessibility |
| 16 | Next steps — 3 decisions for senior management |

**Credit on every slide:** "Business Banking Advisor · Self-initiated · Completed out of hours in own time"

### Architecture Deck — `Santander_Architecture.pptx`

10 slides · Technical deep-dive · Built with python-pptx

| Slide | Content |
|-------|---------|
| 1 | Cover |
| 2 | Component map — current prototype |
| 3 | Data & state architecture |
| 4 | Production system architecture (4 tiers) |
| 5 | Security architecture (4 domains) |
| 6 | Regulatory & compliance framework |
| 7 | Privacy & account separation architecture — app/CLI gap, credit ring-fence, PSD2 consent, GDPR basis |
| 8 | Entity & mandate logic (7 types × 3 rules) |
| 9 | API integration contracts (4 APIs) |
| 10 | Design system tokens |

### Project Record — `Santander_Project_Record.pptx`

13 slides · Full manifest as a presentation · Built with python-pptx

| Slide | Content |
|-------|---------|
| 1 | Cover — title, author, prototype link, 4 headline stats |
| 2 | Project overview — tech stack, deployment, live link |
| 3 | Five screens — detailed feature breakdown per tab |
| 4 | Eleven workflows — step counts, logic, regulatory basis |
| 5 | Entity types — 7 types × mandate rules × compliance divergence |
| 6 | Security & compliance part 1 — features 1–10 with regulation |
| 7 | Security & compliance part 2 — features 11–19 + notification bell |
| 8 | Home screen intelligence — all 8 proactive features |
| 9 | Ships company agent architecture — 6 officers, settings, deny list |
| 10 | Reference library — 96 sections, 105 books & regulatory docs, 23,260 lines, Quick Lookup index |
| 11 | Deployment & build — GitHub Pages, Vite config, npm commands, CLAUDE.md |
| 12 | Presentation deliverables — all 3 decks with slide-by-slide index |
| 13 | Business case summary — £137M, metrics, differentiators, phase status |

### Builder Scripts

| File | Purpose |
|------|---------|
| `build_deck.py` | Regenerates pitch deck — run `python3 build_deck.py` |
| `build_architecture.py` | Regenerates architecture deck — run `python3 build_architecture.py` |
| `build_manifest.py` | Regenerates this project record — run `python3 build_manifest.py` |

---

## 7. Complaint Handling Tools

Three standalone tools for FCA DISP-compliant complaint handling, built alongside the in-app workflow.

| File | Purpose |
|------|---------|
| `complaint_letter_writer.py` | Interactive letter writer — Evelyn workflow (Angus format). Trigger-phrase driven: Stage 1 record (5 questions), escalation record (4 questions), upheld/declined/escalation letters, dual mode. Saves `[REF]_[SURNAME]_[TRIGGER]_[DATE].docx` |
| `Santander_Complaint_Guide.docx` | Comprehensive reference guide — 7 complaint types × Stage 1 upheld/declined/escalation scenarios. Full letter templates, interest formula, FCA DISP quick reference. For use on work laptop |
| `build_complaint_guide.py` | Rebuilds `Santander_Complaint_Guide.docx` — run `python3 build_complaint_guide.py` |
| `Evelyn_Complaint_Agent_Angus.md` | Microsoft Copilot instruction file — complete system prompt for the Angus agent. All trigger phrases, verbatim Stage 1/escalation headings, letter templates with exact language patterns, FOS block, sign-off. Paste into Copilot custom instructions or Copilot Studio |

### Trigger Phrases (complaint_letter_writer.py / Angus Copilot agent)

| Trigger | Output |
|---------|--------|
| `evidence to support complaint stage 1` | 5-question Stage 1 complaint record |
| `evidence to support complaint escalation` | 4-question escalation record |
| `Uphold - stage 1 letter` | Letter: Sorry → Cause → Impact → Fix → Payment |
| `Declined - stage 1 letter` | Letter: Sorry → Not our fault → One-line reason → Full explanation |
| `Escalation - resolution changed` | Escalation final response — decision changed |
| `Escalation - no change in original resolution` | Escalation final response — decision maintained |
| `Escalation - no change in escalated complaint` | Escalation final response — escalated decision maintained |
| `evidence to support complaint stage 1 + Uphold - stage 1 letter` | Dual mode: complaint record + upheld letter |
| `evidence to support complaint stage 1 + Declined - stage 1 letter` | Dual mode: complaint record + declined letter |

---

## 8. Git History (this project)

| Commit | Description |
|--------|-------------|
| `71b8d51` | fix: DOMContentLoaded mount + remove vite module loader stripping |
| `d674ea2` | fix: DOMContentLoaded — plain script tag in head needs deferred DOM access |
| `0e19fe9` | feat: implement ships company — agent hierarchy, commands, security hardening |
| `331f262` | feat: REFERENCE.md sections 21–26 (HTTP, SQL, Prompt Eng, AI Agents, Claude Code, Refactoring UI) |
| (prior) | feat: REFERENCE.md sections 1–20 (all technical reference books) |

**Branch:** `claude/add-claude-documentation-eaPc5`  
**Remote:** `imscots-ui/santander`

---

## 9. Business Case Summary

| Metric | Value |
|--------|-------|
| Paperless workflows built | 10 |
| Home screen intelligence features | 2 (forecast, lending offer) |
| Paper forms retired | 5 (CA04, CA07, CA11, P17, D18) |
| Entity types supported | 7 |
| Approval rule tiers | 3 (Any-1, Any-2, All) |
| Compliance frameworks addressed | 8 (FCA BCOBS 4A, MLR 2017, FCA SYSC 9, HMRC MTD, GDPR Art.5, PSD2 RTS, FCA PS22/9, FCA SYSC 10A) |
| Privacy controls built | 3 (personal/business separation, credit ring-fence, PSD2 consent audit) |
| Cost saving per 10k customers | £4.9M year 1 |
| Annualised opportunity (280k customers) | £137M |
| Phase 1 status | **Complete — prototype live** |
| Time to Phase 2 | 0 days — awaiting stakeholder approval |

---

*All work completed self-initiated, out of hours, in own time.*  
*Alan Davidson · Business Banking Advisor · Santander · June 2026*
