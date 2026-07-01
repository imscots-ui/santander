# CITATIONS.md — Regulatory Citation Index

A curated, greppable list of the regulatory instruments and standards the prototype's workflows are
designed around. Used as the citation source for the Technical Report and Position Paper
(`report_content.py` references `[n]` map to this list).

> ⚠️ **Provenance note.** These citations are assembled from model knowledge, not yet cross-checked
> against primary sources. They are reliable enough for internal drafts, but **verify each instrument
> (especially SI numbers, dates and clause references) against the primary source before any external
> or formal publication.** This is exactly the gap `INPUTS_NEEDED.md` asks to close.

| # | Instrument / standard | Used for | Verify |
|---|-----------------------|----------|--------|
| 1 | FCA, *A New Consumer Duty* — Policy Statement **PS22/9** (July 2022); Principle 12 / PRIN 2A | Fair-outcome framing across journeys | PS ref, PRIN cite |
| 2 | **The Payment Services Regulations 2017 (SI 2017/752)**, transposing Directive (EU) 2015/2366 (PSD2) | Payments regime, SCA basis | SI number |
| 3 | **Commission Delegated Regulation (EU) 2018/389** — SCA-RTS | Strong Customer Authentication, step-up | Reg number |
| 4 | Pay.UK — **Confirmation of Payee (CoP)** scheme rules | Payee-name verification before first payment | Current scheme doc |
| 5 | Bacs — **the Direct Debit Guarantee** | Immediate refund route for DD disputes | Wording |
| 6 | Payment Services Regulations 2017, **regs 76–77** (unauthorised / incorrectly executed transactions) | Dispute / chargeback refund basis | Reg numbers |
| 7 | PSR — **Faster Payments APP scams mandatory reimbursement** (in force 7 Oct 2024) | Cancel window / reimbursement framing | Date, scope, cap |
| 8 | **The Money Laundering … Regulations 2017 (SI 2017/692)** | Sanctions / PEP / adverse-media screening | SI number, full title |
| 9 | **Regulation (EU) 2015/847** (Funds Transfer Regulation), retained in UK law | Payer/payee information on transfers | Retained-law status |
| 10 | FCA Handbook — **DISP** (Dispute Resolution: Complaints); Financial Ombudsman Service | Complaint intake → FOS escalation | Sourcebook cite |
| 11 | FCA Handbook — **BCOBS** (Banking: Conduct of Business Sourcebook) | Cooling-off, fair treatment on changes | Sourcebook cite |
| 12 | FCA Handbook — **SYSC 9** (record-keeping); **SM&CR** | Audit trail; accountability | Sourcebook cite |
| 13 | **Consumer Credit Act 1974** | Lending offer, cooling-off rights | Section refs if used |
| 14 | HMRC — **Making Tax Digital for VAT** | Digital VAT return submission | Current guidance |
| 15 | **UK GDPR** & **Data Protection Act 2018**, *as amended by the* **Data Use and Access Act 2025**, Art. 5(1)(c) | Data separation, ring-fence, purpose limitation | DUAA commencement dates/phases (guidance was policy-blocked) |
| 16 | W3C — **WCAG 2.1, Level AA** | Accessibility conformance target | Version (2.1 vs 2.2) |
| 17 | **ICO** — guidance on pre-employment vetting of candidates | Signatory ID register: necessity, proportionality, minimisation when verifying a person | ICO page was policy-blocked — confirm exact wording/scope |

### Sources the Captain has pointed to (currently blocked by egress policy — see INPUTS_NEEDED.md route A)
- `legislation.gov.uk` — primary/secondary legislation (authoritative for SI numbers/titles).
- `nationalarchives.gov.uk` — records citation guidance.
- `ico.org.uk` — UK GDPR guidance (incl. pre-employment vetting → ref 17).
- `gov.uk` — incl. Data Use and Access Act 2025 commencement guidance (→ ref 15).
- `data.gov.uk` — UK open data.

Once these domains are on the session allow-list (or the content is pasted), verify refs 15 and 17 in full
and tick the Verify column.

## How to use
- Cite in `report_content.py` with `[n]` markers; the References block renders this list.
- When adding a new workflow that introduces a new obligation, add its instrument here first, then cite it.
- If/when primary sources are supplied (see `INPUTS_NEEDED.md` item 1), tick the **Verify** column and remove
  the provenance caveat above.
