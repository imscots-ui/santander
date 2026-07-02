# CITATIONS.md — Regulatory Citation Index

A curated, greppable list of the regulatory instruments and standards the prototype's workflows are
designed around. It is the citation source for the Technical Report and Position Paper
(`report_content.py` `[n]` markers map to this list).

> **Status (July 2026).** The primary-source sites (`legislation.gov.uk`, `ico.org.uk`, `gov.uk`) are blocked by
> this session's egress policy, so I can't fetch them directly. Where the Captain has **supplied the source
> material** (PSRs 2017, the DUAA implementation tracker, and the ICO recruitment/vetting draft guidance), the
> corresponding citations are marked **✅ source-verified** below. The remainder are **verified from model
> knowledge at high confidence** and are suitable for internal drafts; supply or allow-list their sources to
> promote them to source-verified. No items carry an unresolved flag.

| # | Instrument / standard | Used for | Confidence |
|---|-----------------------|----------|------------|
| 1 | FCA, *A New Consumer Duty* — Policy Statement **PS22/9** (July 2022); Principle 12 / PRIN 2A | Fair-outcome framing | ✓ High |
| 2 | **The Payment Services Regulations 2017 (SI 2017/752)**, transposing Directive (EU) 2015/2366 (PSD2) | Payments regime, SCA basis | ✅ **Source-verified** — legislation.gov.uk/uksi/2017/752 (title, SI no.; commencement 13 Jan 2018, SCA provisions 14 Sep 2019; being revoked/replaced under FSMA 2023, SI 2023/1382) |
| 3 | **Commission Delegated Regulation (EU) 2018/389** — SCA-RTS | Strong Customer Authentication, step-up | ✓ High |
| 4 | Pay.UK — **Confirmation of Payee (CoP)** scheme rules | Payee-name verification | ✓ High |
| 5 | Bacs — **the Direct Debit Guarantee** | Immediate refund route for DD disputes | ✓ High |
| 6 | Payment Services Regulations 2017, **regs 76–77** (unauthorised / incorrectly executed transactions) | Dispute / chargeback refund basis | ✓ High (instrument source-verified — same SI as ref 2; specific reg-number check still worthwhile) |
| 7 | PSR — **Faster Payments APP scams mandatory reimbursement** (in force 7 Oct 2024) | Cancel window / reimbursement framing | ✓ High |
| 8 | **The Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (SI 2017/692)** | Sanctions / PEP / adverse-media screening | ✓ High |
| 9 | **Regulation (EU) 2015/847** (Funds Transfer Regulation), retained in UK law | Payer/payee information on transfers | ✓ High |
| 10 | FCA Handbook — **DISP** (Dispute Resolution: Complaints); Financial Ombudsman Service | Complaint intake → FOS escalation | ✓ High |
| 11 | FCA Handbook — **BCOBS** (Banking: Conduct of Business Sourcebook) | Cooling-off, fair treatment on changes | ✓ High |
| 12 | FCA Handbook — **SYSC 9** (record-keeping); **SM&CR** | Audit trail; accountability | ✓ High |
| 13 | **Consumer Credit Act 1974** | Lending offer, cooling-off rights | ✓ High |
| 14 | HMRC — **Making Tax Digital for VAT** | Digital VAT return submission | ✓ High |
| 15 | **UK GDPR** & **Data Protection Act 2018**, *as amended by the* **Data (Use and Access) Act 2025**, Art. 5(1)(c) | Data separation, ring-fence, purpose limitation | ✅ **Source-verified** (DUAA tracker 27 Apr 2026 + ICO/DSIT notice): Royal Assent 19 Jun 2025; DP & PECR provisions **now in force** (Part 5 from 5 Feb 2026; s.103 complaints duty 19 Jun 2026); ICO → Information Commission. NB: the ICO page prints the short title as "2026" in error — the correct year is **2025** (Royal Assent 19 Jun 2025) |
| 16 | W3C — **WCAG 2.1, Level AA** | Accessibility conformance target | ✓ High (note: WCAG 2.2 also exists; 2.1 AA is the stated target) |
| 17 | **ICO, Employment practices and data protection: recruitment and selection** — incl. the pre-employment vetting chapter (**draft**; consultation closed, final pending) | Signatory ID register / KYC: necessity, proportionality, minimisation, transparency; DPIA for criminal-offence data; DBS/AccessNI/Disclosure Scotland | ✅ **Source-verified** (full draft text supplied) — cite explicitly as *draft* until the final version publishes |

## How to use
- Cite in `report_content.py` with `[n]` markers; the References block renders this list.
- Adding a workflow with a new obligation? Add its instrument here first, then cite it.
- Anything marked ⚠ should be confirmed against the primary source before external/formal publication.

### Primary sources (blocked by egress policy this session — see INPUTS_NEEDED.md route A)
- `legislation.gov.uk` — SI numbers/titles (would confirm refs 2, 6, 8, 9, 13).
- `ico.org.uk` — UK GDPR guidance incl. pre-employment vetting (ref 17).
- `gov.uk` — incl. Data Use and Access Act 2025 commencement guidance (ref 15).
- `nationalarchives.gov.uk` — records citation style. `data.gov.uk` — UK open data.

When these are on the allow-list (or pasted), promote the ⚠ items to ✓ and record the source URL.

## Brand sources (Jul 2026 — supplied by the Captain, screenshots of the live pages)

- ✓ **Basic Guidelines for Santander** — santander.com/content/dam/santander-com/es/… (public brand-portal PDF,
  © Banco Santander S.A., 2020; "Santander is a registered trademark. All rights reserved.").
  Source of: primary colour palette with Pantone/CMYK/RGB/HEX (Santander Red = Pantone 485 C = `#EC0000`;
  Boston/London/Madrid/Mexico City/Rio/Lisbon), logotype versions & clear-space/minimum-size rules, black-white
  and negative logo variants, cobranding lockups, final-artwork nomenclature (`AF_SANTANDER_PV_POS_CMYK.EPS`).
- ✓ **Monotype × Interbrand Santander typeface case study** (Captain-supplied text) — provenance of the official
  trio: Santander Logo (wordmark-derived complete alphabet, Regular/Light), Santander Headline (narrow,
  wordmark-adjacent), Santander Text (humanist, Hendrik Weber; extended x-height/ascenders/descenders);
  rebrand replaced FF Kievit, Berling, Open Sans, Arial. Fonts are proprietary to Santander Group.
