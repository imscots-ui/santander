#!/usr/bin/env python3
"""Clean-room PDF renders of the Technical Report and Position Paper (reportlab)."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, ListFlowable, ListItem)
from reportlab.lib.enums import TA_LEFT

RED=colors.HexColor('#c8102e'); INK=colors.HexColor('#1c1917'); STONE=colors.HexColor('#57534e'); LIGHT=colors.HexColor('#78716c')
ss=getSampleStyleSheet()
def S(name,**kw): return ParagraphStyle(name, parent=ss['Normal'], **kw)
eyebrow=S('eb',fontName='Helvetica-Bold',fontSize=8,textColor=RED,spaceAfter=1,leading=10)
title=S('ti',fontName='Helvetica-Bold',fontSize=26,textColor=INK,leading=30,spaceAfter=2)
subtitle=S('su',fontName='Helvetica',fontSize=15,textColor=STONE,leading=19,spaceAfter=4)
tagline=S('tg',fontName='Helvetica-Oblique',fontSize=10.5,textColor=LIGHT,leading=14)
h1=S('h1',fontName='Helvetica-Bold',fontSize=14,textColor=INK,spaceBefore=14,spaceAfter=5,leading=17)
h2=S('h2',fontName='Helvetica-Bold',fontSize=11,textColor=STONE,spaceBefore=8,spaceAfter=2,leading=14)
body=S('bd',fontName='Helvetica',fontSize=10,textColor=INK,leading=14.5,spaceAfter=5,alignment=TA_LEFT)
foot=S('ft',fontName='Helvetica-Oblique',fontSize=8,textColor=LIGHT,leading=11,spaceBefore=10)
cellH=S('ch',fontName='Helvetica-Bold',fontSize=8.5,textColor=colors.white,leading=11)
cell=S('cl',fontName='Helvetica',fontSize=8.5,textColor=INK,leading=11)
cellB=S('cb',fontName='Helvetica-Bold',fontSize=8.5,textColor=INK,leading=11)

def bullets(items):
    return ListFlowable([ListItem(Paragraph(t,body),leftIndent=10,value='•') for t in items],
                        bulletType='bullet', start='•', leftIndent=12)
def tbl(headers,rows,widths):
    data=[[Paragraph(h,cellH) for h in headers]]
    for r in rows: data.append([Paragraph(c,cellB if i==0 else cell) for i,c in enumerate(r)])
    t=Table(data,colWidths=[w*mm for w in widths],hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),INK),('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#d6d3d1')),
        ('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#faf8f5')])]))
    return t

def cover(story,ttl,sub,tag,status):
    story+=[Spacer(1,60*mm),Paragraph('INTERNAL · CONFIDENTIAL',eyebrow),Spacer(1,6),
            Paragraph(ttl,title),Paragraph(sub,subtitle),Paragraph(tag,tagline),Spacer(1,14)]
    story.append(tbl(['Field','Value'],[['Author','Alan Davidson'],['Prepared','July 2026'],
                 ['Version','1.0'],['Status',status]],[35,120]))
    story.append(PageBreak())

def render(path, blocks):
    doc=SimpleDocTemplate(path,pagesize=A4,topMargin=20*mm,bottomMargin=18*mm,leftMargin=20*mm,rightMargin=20*mm)
    story=[]
    for b in blocks:
        k=b[0]
        if k=='cover': cover(story,*b[1:])
        elif k=='eb': story.append(Paragraph(b[1],eyebrow))
        elif k=='h1': story.append(Paragraph(b[1],h1))
        elif k=='h2': story.append(Paragraph(b[1],h2))
        elif k=='p': story.append(Paragraph(b[1],body))
        elif k=='ul': story.append(bullets(b[1]))
        elif k=='tbl': story.append(tbl(b[1],b[2],b[3]))
        elif k=='foot': story.append(Paragraph(b[1],foot))
        elif k=='sp': story.append(Spacer(1,b[1]))
    n=len(story)
    doc.build(story)
    print(f"WROTE {path} ({n} flowables)")

FOOT='Prototype only — no backend, no real data, no live system connections. Prepared for internal discussion.'

# ---- TECHNICAL REPORT ----
tr=[
 ('cover','Santander Business Banking','Concept Prototype — Technical Report',
  'A front-end exploration of paperless workflows for business banking','Prototype — internal discussion'),
 ('eb','Section 1'),('h1','1  Executive summary'),
 ('p','This report describes a self-initiated concept prototype for Santander Business Banking. The prototype is a front-end only application that demonstrates how paper-based business-banking processes — mandate changes, bulk payments, account closures, disputes, cross-border onboarding and more — can be delivered as guided, self-serve, digitally-signed workflows inside the banking app.'),
 ('p','It is a demonstration piece for internal discussion and customer research. It has no backend, uses no real customer data, and makes no live system connections. Its value is as a tangible, clickable articulation of a paperless service model and the regulatory controls that model must respect.'),
 ('tbl',['Dimension','Summary'],[['Workflows','17 end-to-end paperless journeys'],['Entity types','7 business types (sole trader to society)'],['Platform','React single-file front end, one self-contained HTML bundle'],['Scope','Front-end concept only — no backend, no real data']],[38,117]),
 ('eb','Section 2'),('h1','2  Background & problem statement'),
 ('p','Many business-banking service events still depend on paper: posted mandate-variation forms, wet-ink signatures, branch visits to reset access, faxed international payment details, and written requests for balance certificates that take days to arrive. Each step adds delay, cost and operational risk.'),
 ('p','The prototype asks: what would these processes look like re-imagined as in-app, self-serve, compliant-by-design workflows — with the regulatory checks built into the flow rather than bolted on with paper?'),
 ('eb','Section 3'),('h1','3  Objectives & scope'),('h2','Objectives'),
 ('ul',['Demonstrate paperless equivalents for the most paper-heavy business-banking service events.','Show the regulatory controls each workflow must satisfy, expressed inside the user experience.','Provide a clickable artefact for internal review and customer research.','Explore a consistent design language and accessibility standard.']),
 ('h2','Non-goals (out of scope)'),
 ('ul',['No backend, database or integration with live banking systems.','No real customer, account or payment data — all figures are illustrative.','No production security hardening.','No processing of real payments, identity documents or regulatory submissions.']),
 ('eb','Section 4'),('h1','4  System architecture'),
 ('p','The prototype is built as a single React component in one file, compiled by Vite into a single self-contained HTML bundle. This keeps the whole product readable top-to-bottom and trivial to deploy or share.'),
 ('ul',['Single-file React front end; all state held at the top of one component.','Compiled to one self-contained HTML artefact.','Two shells — mobile and desktop — sharing all state.','A workflow-overlay model: each journey is a full-screen, multi-step wizard.','An entity system that reconfigures accounts, mandate rules and copy across 7 business types.']),
 ('h2','Mandate & authorisation model'),
 ('p','Each account carries a signing rule (any-one, any-two, or all). Workflows resolve the strictest applicable rule across the accounts involved, determining whether co-signing or a cooling-off period is required.'),
 ('eb','Section 5'),('h1','5  Workflow catalogue'),
 ('p','The prototype implements 17 end-to-end workflows, each replacing a specific paper or branch-based process.'),
 ('tbl',['Workflow','What it does','Basis'],[
   ['Account closure','In-credit & cooling-off checks','BCOBS'],['Business details','Name/address/contact + proof','KYB'],
   ['Mandate changes','Add/remove signatories, signing rule','SMR'],['Bulk payments','Payee book, CoP, scheduled runs','CoP'],
   ['Pre-approved lending','Offer, calculator, draw-down','CCA 1974'],['International FX','Rate & fee disclosure','Cross-border'],
   ['Dormant reactivation','Reactivate or close','Dormancy'],['Personal/business unlink','Separate personal data','GDPR'],
   ['Credit ring-fence','Exclude personal data from credit','GDPR 5(1)(c)'],['Signatory ID register','KYC/KYB evidence lists','MLR 2017'],
   ['MTD VAT submission','Categorise & submit VAT','HMRC MTD'],['Complaint handling','Intake to FOS escalation','FCA DISP'],
   ['Standing orders & DDs','Set up SO; cancel DD','DD Guarantee'],['Transaction dispute','Chargeback/fraud/DD routes','PSR 2017'],
   ['Intl. beneficiary','Screen & verify a payee','MLR/sanctions'],['Balance certificate','Sealed certificate/reference','Evidence'],
   ['Trusted devices','Devices, activity, sign-out','PSD2 SCA']],[42,72,41]),
 ('eb','Section 6'),('h1','6  Regulatory & compliance mapping'),
 ('p','The workflows are designed around the controls a real implementation would need, surfaced in the experience so reviewers can see where each obligation is met.'),
 ('tbl',['Framework','How the prototype reflects it'],[
   ['SCA / PSD2 RTS','Strong authentication and step-up before sensitive actions'],
   ['Confirmation of Payee','Account-name verification before first payment'],
   ['Direct Debit Guarantee','Immediate refund route for DD disputes'],
   ['PSR 2017','Unauthorised-transaction refund and chargeback handling'],
   ['FCA BCOBS / Consumer Duty','Cooling-off and fair treatment on changes'],
   ['FCA DISP','Complaint intake, decision and Ombudsman escalation'],
   ['FCA SYSC 9','Actions recorded to an audit trail'],
   ['MLR 2017','Sanctions, PEP and adverse-media screening'],
   ['HMRC MTD','Digital VAT return preparation and submission'],
   ['GDPR','Data separation, ring-fencing, purpose limitation']],[45,110]),
 ('eb','Section 7'),('h1','7  Engineering & quality approach'),
 ('p','The prototype is developed through a repeatable pipeline that separates generation, review, gating and runtime verification:'),
 ('ul',['Scaffold — new workflows generated from a template that prevents recurring defects.','Review — parallel multi-lens review of architecture, security, engineering, design and state.','Gate — a pre-commit check blocks accessibility, colour-token, markup and build regressions.','Runtime verification — the built app is driven headlessly through real journeys with an automated WCAG audit.']),
 ('h2','Design system'),
 ('p','A consistent visual language governs spacing, colour, typography and interaction: a defined spacing scale, the Santander brand red for primary actions, a warm neutral palette, tabular figures for monetary values, and one primary call-to-action per screen.'),
 ('eb','Section 8'),('h1','8  Accessibility'),
 ('p','Accessibility is treated as a build gate. Interactive controls carry visible focus states and accessible names; status is never conveyed by colour alone; and the interface is audited against WCAG 2.1 AA using an automated engine as part of the verification run. The core screens pass the automated colour-contrast and name/role checks.'),
 ('eb','Section 9'),('h1','9  Limitations'),
 ('ul',['Front-end only: no data is stored, transmitted or processed.','All names, figures and references are illustrative and fictional.','Regulatory behaviours are represented for demonstration, not certified for production.','Not security-tested to production standards.']),
 ('eb','Section 10'),('h1','10  Indicative next steps'),
 ('ul',['Prioritise the highest-value journeys for a backend-integrated pilot.','Validate the flows with business customers through structured research.','Complete a full accessibility conformance review with assistive-technology testing.','Define integration, security and data-protection requirements for a production build.']),
 ('foot',FOOT),
]
render('Santander_Technical_Report.pdf', tr)

# ---- POSITION PAPER ----
pp=[
 ('cover','Paperless Business Banking','Position Paper',
  'The case for compliant, self-serve, paperless service journeys','Position paper — internal discussion'),
 ('eb','Position in brief'),('h1','1  Our position'),
 ('p','Business-banking service events that still rely on paper and branch visits should be re-imagined as guided, self-serve, digitally-signed journeys inside the banking app — with the regulatory controls built into the flow. Doing so reduces cost and delay, improves the customer experience, and can strengthen compliance by making every check explicit, consistent and logged.'),
 ('p','This paper sets out the argument and points to a working front-end prototype that makes it concrete.'),
 ('eb','The problem'),('h1','2  Paper is still in the critical path'),
 ('p','Across mandates, payments, closures, disputes and onboarding, too many journeys still depend on posted forms, wet-ink signatures, faxed details and branch visits — costing days of delay, operational handling, error and rework.'),
 ('ul',['Delay: postal round-trips stretch simple changes into days.','Cost: paper handling, re-keying and exception management carry real expense.','Risk: manual steps introduce error and inconsistent control application.','Experience: business customers expect to self-serve, any hour, any device.']),
 ('eb','The opportunity'),('h1','3  Compliant self-serve, paperless by default'),
 ('p','The controls these journeys require — identity, authorisation to the correct mandate, confirmation of payee, sanctions and PEP screening, cooling-off, audit — are precisely what software does consistently and at scale. Expressed inside the workflow, they enable a better experience rather than justify keeping paper.'),
 ('eb','Why now'),('h1','4  The timing case'),
 ('ul',['Regulatory expectations (Consumer Duty, SCA, APP-fraud reimbursement) reward consistent, evidenced controls.','Business customers increasingly expect parity with the best consumer digital experiences.','Confirmation of Payee, digital identity and strong authentication are now mature building blocks.']),
 ('eb','Evidence'),('h1','5  What the prototype demonstrates'),
 ('p','A front-end concept prototype implements 17 paperless journeys across 7 business entity types, each replacing a specific paper or branch process and surfacing its regulatory controls — from mandate changes and bulk payments to disputes, cross-border beneficiary onboarding, balance certificates and device management. It is a clickable articulation of the position, not a production system.'),
 ('eb','Benefits'),('h1','6  Who benefits, and how'),
 ('tbl',['Stakeholder','Benefit'],[['Customer','Faster outcomes, self-serve any time, clear status, fewer branch visits'],['Bank','Lower handling cost, fewer exceptions, consistent controls, stronger audit'],['Regulatory','Controls made explicit and logged; fair treatment and cooling-off by design']],[35,120]),
 ('eb','Risks'),('h1','7  Risks & mitigations'),
 ('tbl',['Risk','Mitigation'],[['Digital exclusion','Retain assisted routes; design for accessibility (WCAG AA).'],['Fraud / social engineering','Strong authentication, CoP, screening, cooling-off windows.'],['Regulatory change','Model controls as configurable policy, not hard-coded logic.'],['Adoption','Validate with customer research before scaling; prioritise high-value flows.']],[42,113]),
 ('eb','Recommendation'),('h1','8  Recommendation'),
 ('ul',['Endorse the paperless, compliant-by-design model as the target for service journeys.','Select a small set of highest-value journeys for a backend-integrated pilot.','Fund structured customer research using the prototype as the discussion artefact.','Define production integration, security and data-protection requirements in parallel.']),
 ('foot',FOOT),
]
render('Santander_Position_Paper.pdf', pp)
