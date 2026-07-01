#!/usr/bin/env python3
"""
Shared content for the Technical Report and Position Paper.

Single source of truth: prose, tables and references are defined once here and
rendered to both .docx and .pdf by the two builders, so the documents cannot
diverge. Clean-room — original structure and wording; factual description of
the front-end concept prototype only.

Block grammar consumed by the renderers:
  ('eyebrow', text)              small red section kicker
  ('h1', num, title)            numbered section heading
  ('h2', title)                 sub-heading
  ('p', text)                   body paragraph (supports [n] citation markers)
  ('lead', text)                emphasised opening paragraph
  ('ul', [items])               bullet list
  ('callout', lead, text)       shaded pull-box
  ('table', headers, rows, widths_mm)
  ('refs', [ (n, text) ])       numbered references
  ('spacer', pts)
"""

FOOTER_NOTE = ("Concept prototype — front-end only. No backend, no live system connections, "
               "and no real customer, account or payment data. Prepared for internal discussion.")

# ── Shared reference list (cited by [n] in both documents) ──────────────────
REFERENCES = [
    (1,  "FCA, A New Consumer Duty — Policy Statement PS22/9 (July 2022); FCA Principle 12 and PRIN 2A."),
    (2,  "The Payment Services Regulations 2017 (SI 2017/752), transposing Directive (EU) 2015/2366 (PSD2); "
         "main provisions in force from 13 January 2018 and the secure-communication / SCA provisions from "
         "14 September 2019. Now within the repeal-and-replace programme under the Financial Services and "
         "Markets Act 2023."),
    (3,  "Commission Delegated Regulation (EU) 2018/389 — Regulatory Technical Standards for Strong Customer "
         "Authentication and common and secure open standards of communication (SCA-RTS)."),
    (4,  "Pay.UK — Confirmation of Payee (CoP) scheme rules."),
    (5,  "Bacs — the Direct Debit Guarantee."),
    (6,  "The Payment Services Regulations 2017, regs 76–77 (unauthorised and incorrectly executed transactions)."),
    (7,  "PSR — Faster Payments APP scams mandatory reimbursement requirement (in force 7 October 2024)."),
    (8,  "The Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) "
         "Regulations 2017 (SI 2017/692)."),
    (9,  "Regulation (EU) 2015/847 on information accompanying transfers of funds (the Funds Transfer "
         "Regulation), as retained in UK law."),
    (10, "FCA Handbook — Dispute Resolution: Complaints (DISP); the Financial Ombudsman Service."),
    (11, "FCA Handbook — Banking: Conduct of Business Sourcebook (BCOBS)."),
    (12, "FCA Handbook — Senior Management Arrangements, Systems and Controls (SYSC 9 record-keeping); "
         "the Senior Managers and Certification Regime (SM&CR)."),
    (13, "Consumer Credit Act 1974."),
    (14, "HMRC — Making Tax Digital for VAT."),
    (15, "UK GDPR and the Data Protection Act 2018, as amended by the Data (Use and Access) Act 2025 "
         "(Royal Assent 19 June 2025; principal data-protection reforms in Part 5 in force from 5 February 2026; "
         "a data-subject complaints-handling duty under s.103 from 19 June 2026; the regulator is being "
         "reconstituted as the Information Commission). Article 5(1)(c) — data minimisation and purpose limitation."),
    (16, "W3C — Web Content Accessibility Guidelines (WCAG) 2.1, Level AA."),
    (17, "ICO — guidance on the pre-employment vetting of candidates: necessity, proportionality and data "
         "minimisation when verifying individuals (relevant to the signatory ID register)."),
]

# ═══════════════════════════════════════════════════════════════════════════
# TECHNICAL REPORT
# ═══════════════════════════════════════════════════════════════════════════
TECH_META = dict(
    classification="INTERNAL · CONFIDENTIAL",
    title="Santander Business Banking",
    subtitle="Concept Prototype — Technical Report",
    tagline="A front-end exploration of paperless, compliant-by-design service journeys",
    running="Business Banking Concept Prototype — Technical Report",
    control=[
        ("Author", "Alan Davidson"),
        ("Document owner", "Alan Davidson"),
        ("Classification", "Internal · Confidential"),
        ("Version", "2.0"),
        ("Date", "July 2026"),
        ("Status", "Concept prototype — for internal discussion and customer research"),
        ("Distribution", "Business Banking product, design, and risk & compliance stakeholders"),
    ],
    contents=[
        "1  Executive summary", "2  Context and problem statement", "3  Objectives, scope and non-goals",
        "4  System architecture", "5  Workflow catalogue", "6  Regulatory control mapping",
        "7  Engineering and quality approach", "8  Accessibility", "9  Limitations and assumptions",
        "10  Indicative next steps", "References",
    ],
)

TECH_BODY = [
    ('eyebrow', 'Section 1'), ('h1', '1', 'Executive summary'),
    ('lead',
     "Business banking retains a striking dependence on paper. Mandate variations, account closures, beneficiary "
     "onboarding and dispute handling still routinely require posted forms, wet-ink signatures and branch "
     "attendance — processes that impose days of latency, measurable operational cost, and inconsistent "
     "application of controls at exactly the points where regulatory rigour matters most."),
    ('p',
     "This report describes a self-initiated concept prototype that reframes seventeen such service events as "
     "guided, digitally-signed, self-serve journeys. The distinguishing idea is that the controls each journey "
     "must satisfy — Strong Customer Authentication [3], Confirmation of Payee [4], sanctions and politically-"
     "exposed-person screening [8], cooling-off, and record-keeping [12] — are expressed inside the flow rather "
     "than appended through manual back-office process. Control thereby becomes an enabler of a better experience "
     "instead of the reason to retain paper."),
    ('p',
     "The prototype is deliberately a front-end artefact. It holds no customer data, connects to no live system, "
     "and is not a release candidate. Its purpose is to make a service proposition tangible enough to test — with "
     "colleagues, with risk and compliance, and with business customers — before any commitment to build."),
    ('table', ['Dimension', 'Summary'], [
        ['Workflows', 'Seventeen end-to-end paperless journeys'],
        ['Entity coverage', 'Seven business types (sole trader, partnership, limited company, LLP, charity, club, society)'],
        ['Platform', 'Single-file React front end, compiled to one self-contained HTML bundle'],
        ['Regulatory framing', 'PSD2/SCA, CoP, PSR 2017, MLR 2017, FCA DISP/BCOBS/SYSC, Consumer Duty, UK GDPR, MTD'],
        ['Scope', 'Front-end concept only — no backend, no real data, not production-hardened'],
    ], [40, 118]),

    ('eyebrow', 'Section 2'), ('h1', '2', 'Context and problem statement'),
    ('p',
     "The friction in business-banking servicing is not primarily a technology gap; it is a process gap. The "
     "underlying capabilities — digital identity, strong authentication, Confirmation of Payee and real-time "
     "payments — are mature and, in several cases, mandated. Yet the service events that sit on top of them are "
     "frequently still discharged on paper, for three connected reasons: the controls are treated as separate "
     "from the customer journey; the journeys are owned by different teams; and no single artefact makes the "
     "end-to-end experience concrete enough to challenge."),
    ('p',
     "The cost of that gap is cumulative. Postal round-trips convert minutes of decision-making into days of "
     "elapsed time. Manual re-keying introduces error and rework. And discretionary, manually-applied controls "
     "are, by construction, harder to evidence consistently — a growing concern under the FCA Consumer Duty [1], "
     "which expects firms to demonstrate good outcomes rather than assert them."),
    ('callout', 'The core question',
     "What would these service events look like if they were re-imagined as in-app, self-serve, "
     "compliant-by-design journeys — with each regulatory check built into the flow, applied consistently, and "
     "recorded automatically?"),

    ('eyebrow', 'Section 3'), ('h1', '3', 'Objectives, scope and non-goals'),
    ('p',
     "The prototype was built to answer that question in a form that can be reviewed and tested, not merely "
     "described. Its objectives are therefore evidential rather than technical:"),
    ('ul', [
        "Demonstrate credible paperless equivalents for the most paper-heavy business-banking service events.",
        "Express, within each journey, the specific regulatory control it must satisfy — so reviewers can see "
        "where an obligation is met rather than infer it.",
        "Provide a single, clickable artefact for internal review and structured customer research.",
        "Establish a consistent design language and a measurable accessibility standard for the journeys.",
    ]),
    ('h2', 'Non-goals (explicitly out of scope)'),
    ('p',
     "Equally important is what the prototype is not, so that its evidence is read correctly:"),
    ('ul', [
        "No backend, database, or integration with live banking systems.",
        "No real customer, account, or payment data — every figure and reference is illustrative and fictional.",
        "No production security hardening; this is a concept artefact, not a release candidate.",
        "No processing of real payments, identity documents, or regulatory submissions.",
    ]),

    ('eyebrow', 'Section 4'), ('h1', '4', 'System architecture'),
    ('p',
     "The prototype is implemented as a single React component compiled by Vite into one self-contained HTML "
     "bundle. This is an unusual choice for production software but a deliberate one for a concept artefact: it "
     "keeps the entire product readable top-to-bottom, removes build-and-deploy friction, and lets the whole "
     "experience be shared as a single file. The trade-off — that all state lives in one component — is "
     "acceptable precisely because the artefact is not intended to scale as a codebase."),
    ('table', ['Architectural choice', 'Rationale'], [
        ['Single-file React front end', 'Whole product legible in one place; no module navigation to review it'],
        ['Compiled to one HTML artefact', 'Frictionless to deploy, host, or hand to a colleague'],
        ['Two shells, shared state (mobile & desktop)', 'Demonstrates responsive parity without a second codebase'],
        ['Workflow-overlay model', 'Each journey is a self-contained, multi-step wizard over the main app'],
        ['Entity system (7 business types)', 'Accounts, mandate rules, labels and required documents reconfigure per type'],
    ], [58, 100]),
    ('h2', 'Mandate and authorisation model'),
    ('p',
     "Authorisation is modelled explicitly. Each account carries a signing rule — any-one, any-two, or all "
     "signatories — and every workflow resolves the strictest applicable rule across the accounts it touches. "
     "That resolved rule determines whether an instruction can proceed immediately, requires a co-signatory, or "
     "enters a cooling-off period. Encoding authorisation as data rather than as bespoke per-journey logic is "
     "what allows the same seventeen journeys to behave correctly across all seven entity types."),

    ('eyebrow', 'Section 5'), ('h1', '5', 'Workflow catalogue'),
    ('p',
     "The prototype implements seventeen end-to-end workflows. Each replaces an identifiable paper or branch-based "
     "process and surfaces the control that governs it."),
    ('table', ['Workflow', 'What it replaces / does', 'Primary control'], [
        ['Account closure', 'Posted closure request; in-credit and cooling-off checks', 'BCOBS [11]'],
        ['Business details update', 'Change of name/address/contact with proof of address', 'KYB [8]'],
        ['Mandate changes', 'Paper mandate variation; add/remove signatories, signing rule', 'SM&CR [12]'],
        ['Bulk payments / wages', 'BACS paper schedule; payee book with per-payee CoP', 'CoP [4]'],
        ['Pre-approved lending', 'Facility request by phone/post; offer and draw-down', 'CCA 1974 [13]'],
        ['International FX payment', 'Faxed instruction; rate and fee disclosure', 'FTR [9]'],
        ['Dormant reactivation', 'Branch reactivation of a dormant account', 'Dormancy handling'],
        ['Personal / business unlink', 'Manual separation of personal data from a relationship', 'UK GDPR [15]'],
        ['Credit ring-fence', 'Excludes personal data from business credit decisioning', 'UK GDPR Art. 5(1)(c) [15]'],
        ['Signatory ID register', 'Paper KYC/KYB across identity and address evidence', 'MLR 2017 [8]; ICO [17]'],
        ['MTD VAT submission', 'Manual VAT return; categorise, review, submit', 'HMRC MTD [14]'],
        ['Complaint handling', 'Paper complaint; intake, triage, decision, FOS route', 'FCA DISP [10]'],
        ['Standing orders & DDs', 'Paper mandate / cancellation letter', 'Direct Debit Guarantee [5]'],
        ['Transaction dispute', 'Paper dispute form; chargeback / fraud / DD routes', 'PSR 2017 regs 76–77 [6]'],
        ['Intl. beneficiary onboarding', 'Faxed IBAN and wet-ink verification; screening', 'MLR 2017 [8], sanctions/PEP'],
        ['Balance certificate', 'Written request with postal wait; sealed certificate', 'Evidence document'],
        ['Trusted devices & sessions', 'Branch visit to reset access; device/session control', 'SCA [3], SYSC [12]'],
    ], [40, 78, 40]),

    ('eyebrow', 'Section 6'), ('h1', '6', 'Regulatory control mapping'),
    ('p',
     "The workflows are designed around the controls a production implementation would require. The prototype "
     "surfaces each control in the user experience so that a reviewer can locate where an obligation is "
     "discharged. The mapping below is indicative of intent, not a statement of certified compliance."),
    ('table', ['Framework', 'Obligation reflected', 'Ref'], [
        ['Consumer Duty', 'Demonstrable good outcomes; fair treatment designed into journeys', '[1]'],
        ['PSD2 / SCA-RTS', 'Strong Customer Authentication and risk-based step-up before sensitive actions', '[2][3]'],
        ['Confirmation of Payee', 'Account-name verification before a first payment to a new payee', '[4]'],
        ['Direct Debit Guarantee', 'Immediate, guaranteed refund route for Direct Debit disputes', '[5]'],
        ['PSR 2017 (regs 76–77)', 'Refund of unauthorised transactions; correction of errors', '[6]'],
        ['APP reimbursement', 'Cancel window and reimbursement framing on outbound payments', '[7]'],
        ['MLR 2017 / FTR', 'Sanctions, PEP and adverse-media screening; payer/payee information', '[8][9]'],
        ['FCA DISP', 'Complaint intake, decision, and escalation to the Financial Ombudsman', '[10]'],
        ['FCA SYSC 9', 'Material actions recorded to an audit trail', '[12]'],
        ['HMRC MTD', 'Digital preparation and submission of VAT returns', '[14]'],
        ['UK GDPR', 'Data separation, ring-fencing and purpose limitation', '[15]'],
    ], [42, 96, 20]),
    ('p',
     "The data-protection references reflect the UK regime as reshaped by the Data (Use and Access) Act 2025, "
     "whose principal reforms took effect on 5 February 2026; a data-subject complaints-handling duty follows on "
     "19 June 2026 [15]. A production build would need to track that transition — including the regulator's "
     "reconstitution as the Information Commission — as configurable policy rather than fixed assumptions."),

    ('eyebrow', 'Section 7'), ('h1', '7', 'Engineering and quality approach'),
    ('p',
     "Although a concept artefact, the prototype is produced through a disciplined, repeatable pipeline. The "
     "pipeline exists because the failure modes of a large single-file front end are predictable, and because a "
     "credible artefact must actually work when demonstrated — not merely compile. Four stages are kept distinct:"),
    ('ul', [
        "Scaffold — new workflows are generated from a template that encodes the file conventions and forecloses "
        "the recurring defects (state reset, dual-shell wiring, input handling).",
        "Review — a parallel, multi-lens review examines each change for architecture, security, engineering, "
        "design-system and state-integrity concerns before it is accepted.",
        "Gate — an automated pre-commit check blocks accessibility, colour-token, markup and build regressions "
        "from ever leaving the working tree.",
        "Runtime verification — the built application is driven headlessly through real journeys, and audited "
        "against WCAG 2.1 AA [16] on each run, so that behaviour is proven rather than assumed.",
    ]),
    ('callout', 'Why this matters',
     "Static review confirms that code exists and is well-formed; only driving the running application confirms "
     "that a control actually fires. The pipeline is designed so that the artefact demonstrated to stakeholders "
     "is the artefact that has been verified."),
    ('h2', 'Design system'),
    ('p',
     "A single visual language governs spacing, colour, typography and interaction: a fixed spacing scale, the "
     "Santander brand red reserved for the primary action on any screen, a warm neutral palette, tabular figures "
     "for every monetary value, and exactly one primary call-to-action per view. Consistency here is not "
     "decoration; it is what makes seventeen distinct journeys feel like one coherent product."),

    ('eyebrow', 'Section 8'), ('h1', '8', 'Accessibility'),
    ('p',
     "Accessibility is treated as a build gate rather than a closing audit. Interactive controls carry visible "
     "focus states and accessible names; status is never signalled by colour alone; and the interface is measured "
     "against WCAG 2.1 AA [16] using an automated engine on every verification run. Where the automated audit "
     "identified shortfalls — colour-contrast on small text and unnamed icon-only controls — they were corrected "
     "and re-measured to zero on the core screens. Full conformance, including assistive-technology testing, is "
     "identified as a pre-production activity."),

    ('eyebrow', 'Section 9'), ('h1', '9', 'Limitations and assumptions'),
    ('p',
     "The prototype should be read with its boundaries in mind, so that its evidence is neither over- nor "
     "under-weighted:"),
    ('ul', [
        "It is front-end only: no data is stored, transmitted or processed, and no control is enforced server-side.",
        "All names, figures, accounts and references are illustrative and fictional.",
        "Regulatory behaviours are represented to communicate intent, not certified for production use.",
        "It has not been security-tested, load-tested, or assured to production standards.",
    ]),

    ('eyebrow', 'Section 10'), ('h1', '10', 'Indicative next steps'),
    ('p',
     "Should the proposition be endorsed, a proportionate path from concept to pilot would be:"),
    ('ul', [
        "Prioritise the highest-value journeys — by volume, cost-to-serve and customer friction — for a "
        "backend-integrated pilot.",
        "Validate the shortlisted journeys with business customers through structured research, using the "
        "prototype as the discussion artefact.",
        "Complete a full WCAG 2.1 AA conformance review [16], including assistive-technology testing.",
        "Define the integration, security, resilience and data-protection requirements for a production build, "
        "and the target operating model to support it.",
    ]),

    ('eyebrow', 'References'), ('h1', None, 'References'),
    ('refs', REFERENCES),
]

# ═══════════════════════════════════════════════════════════════════════════
# POSITION PAPER
# ═══════════════════════════════════════════════════════════════════════════
POS_META = dict(
    classification="INTERNAL · CONFIDENTIAL",
    title="Paperless Business Banking",
    subtitle="Position Paper",
    tagline="The case for compliant, self-serve service journeys — and a prototype that makes it concrete",
    running="Paperless Business Banking — Position Paper",
    control=[
        ("Author", "Alan Davidson"),
        ("Document owner", "Alan Davidson"),
        ("Classification", "Internal · Confidential"),
        ("Version", "2.0"),
        ("Date", "July 2026"),
        ("Status", "Position paper — for internal discussion"),
        ("Audience", "Business Banking leadership, product, and risk & compliance"),
    ],
    contents=[
        "1  Position in brief", "2  The problem: paper in the critical path",
        "3  The opportunity: compliant self-serve", "4  Why now", "5  Evidence: the prototype",
        "6  Benefits", "7  Risks and mitigations", "8  Recommendation", "References",
    ],
)

POS_BODY = [
    ('eyebrow', 'Position in brief'), ('h1', '1', 'Position in brief'),
    ('lead',
     "Business-banking service events that still depend on paper and branch attendance should be re-imagined as "
     "guided, digitally-signed, self-serve journeys — with the regulatory controls built into the flow. The case "
     "is not merely one of convenience: done well, this model reduces cost and elapsed time, improves the customer "
     "experience, and strengthens compliance by making every control explicit, consistent and automatically "
     "recorded."),
    ('p',
     "This paper sets out the argument in four moves — the problem, the opportunity, the timing, and the evidence "
     "— and closes with a specific recommendation. A working front-end prototype accompanies it and makes the "
     "proposition concrete enough to test."),

    ('eyebrow', 'The problem'), ('h1', '2', 'The problem: paper in the critical path'),
    ('p',
     "Across mandates, payments, closures, disputes and onboarding, too many journeys still sit on posted forms, "
     "wet-ink signatures, faxed details and branch visits. The consequence is not a single large failure but a "
     "steady accumulation of small ones: latency, cost, error and an experience that visibly lags the rest of "
     "digital banking."),
    ('ul', [
        "Latency — postal round-trips convert minutes of decision-making into days of elapsed time.",
        "Cost — paper handling, re-keying and exception management carry real and recurring operational expense.",
        "Risk — manually-applied controls are harder to apply consistently and harder still to evidence [1].",
        "Experience — business customers now expect to self-serve, at any hour, from any device.",
    ]),

    ('eyebrow', 'The opportunity'), ('h1', '3', 'The opportunity: compliant self-serve'),
    ('p',
     "The controls these journeys require — identity, authorisation to the correct mandate, Confirmation of "
     "Payee [4], sanctions and PEP screening [8], cooling-off, and audit [12] — are precisely the tasks software "
     "performs consistently and at scale. Expressed inside the workflow, a control stops being a reason to keep "
     "paper and becomes the mechanism that makes a faster, self-serve journey safe."),
    ('callout', 'The reframing',
     "Compliance and customer experience are usually treated as a trade-off. Building the controls into the flow "
     "collapses that trade-off: the same design that removes the paper is the one that applies the control more "
     "consistently than paper ever did."),

    ('eyebrow', 'Why now'), ('h1', '4', 'Why now'),
    ('p',
     "Three developments make this the right moment rather than merely a good idea:"),
    ('ul', [
        "Regulatory direction rewards it. The Consumer Duty [1] expects demonstrable good outcomes, and the APP "
        "reimbursement regime [7] raises the cost of inconsistent payment controls — both favour controls that "
        "are built in and evidenced.",
        "Expectations have shifted. Business customers increasingly expect parity with the best consumer digital "
        "experiences, and judge the bank against them.",
        "The building blocks are mature. Confirmation of Payee [4], Strong Customer Authentication [3] and "
        "digital identity are established, reusable capabilities rather than research projects.",
    ]),

    ('eyebrow', 'Evidence'), ('h1', '5', 'Evidence: the prototype'),
    ('p',
     "A self-initiated front-end prototype implements seventeen paperless journeys across seven business entity "
     "types, each replacing a specific paper or branch process and surfacing the control that governs it — from "
     "mandate changes and bulk payments to disputes, cross-border beneficiary onboarding, balance certificates "
     "and device management. It is a clickable articulation of this position, deliberately front-end only and "
     "carrying no real data. Its role is to move the conversation from slideware to something colleagues, risk "
     "stakeholders and customers can actually use."),

    ('eyebrow', 'Benefits'), ('h1', '6', 'Benefits'),
    ('p',
     "The value accrues to three parties at once, which is what makes the proposition durable rather than a "
     "cost-shifting exercise:"),
    ('table', ['Stakeholder', 'Benefit'], [
        ['Customer', 'Faster outcomes, self-serve at any time, clear status, and fewer branch visits'],
        ['Bank', 'Lower cost-to-serve, fewer exceptions, consistent control application, and a stronger audit position'],
        ['Risk & compliance', 'Controls made explicit and logged [12]; fair treatment and cooling-off designed in [1]'],
    ], [40, 118]),

    ('eyebrow', 'Risks'), ('h1', '7', 'Risks and mitigations'),
    ('p',
     "The proposition carries real risks; each has a credible mitigation, and none is a reason for inaction:"),
    ('table', ['Risk', 'Mitigation'], [
        ['Digital exclusion', 'Retain assisted and non-digital routes; design to WCAG 2.1 AA [16] from the outset'],
        ['Fraud and social engineering', 'Strong authentication [3], Confirmation of Payee [4], screening [8], and cooling-off windows'],
        ['Regulatory change', 'Model controls as configurable policy rather than hard-coded logic, so rules can move'],
        ['Adoption', 'Validate journeys with customer research before scaling; sequence by value, not by ease'],
    ], [42, 116]),

    ('eyebrow', 'Recommendation'), ('h1', '8', 'Recommendation'),
    ('p',
     "On the strength of the argument and the accompanying prototype, the recommendation is to:"),
    ('ul', [
        "Endorse the paperless, compliant-by-design model as the target for business-banking service journeys.",
        "Select a small set of highest-value journeys for a backend-integrated pilot with defined success measures.",
        "Fund structured customer research using the prototype as the discussion artefact.",
        "Define the production integration, security and data-protection requirements in parallel, so a positive "
        "pilot can proceed without a standing start.",
    ]),

    ('eyebrow', 'References'), ('h1', None, 'References'),
    ('refs', REFERENCES),
]
