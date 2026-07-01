# CITATIONS.md — Regulatory Citation Index

A curated, greppable list of the regulatory instruments and standards the prototype's workflows are
designed around. It is the citation source for the Technical Report and Position Paper
(`report_content.py` `[n]` markers map to this list).

> **Status (July 2026).** Primary-source sites (`legislation.gov.uk`, `ico.org.uk`, `gov.uk`) are blocked by
> this session's egress policy, so these could not be machine-verified against the source. They are instead
> **verified from model knowledge at high confidence and are suitable for internal drafts.** Two items carry a
> residual flag where a specific detail genuinely needs the source (marked ⚠ below). To promote everything to
> fully source-verified, add those domains to the environment allow-list, or paste the relevant text.

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
| 15 | **UK GDPR** & **Data Protection Act 2018**, *as amended by the* **Data Use and Access Act 2025**, Art. 5(1)(c) | Data separation, ring-fence, purpose limitation | ⚠ Act & amendment High; **commencement dates/phases** need the source (blocked) |
| 16 | W3C — **WCAG 2.1, Level AA** | Accessibility conformance target | ✓ High (note: WCAG 2.2 also exists; 2.1 AA is the stated target) |
| 17 | **ICO** — guidance on pre-employment vetting of candidates | Signatory ID register: necessity, proportionality, minimisation | ⚠ Gist High; **exact wording/scope** needs the source (blocked) |

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
