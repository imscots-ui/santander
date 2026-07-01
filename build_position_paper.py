#!/usr/bin/env python3
"""
Santander Business Banking — Position Paper (clean-room, original structure).
A strategy/position argument for a paperless, compliant-by-design service model.
Not derived from any external template. Illustrative prototype content only.
"""
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

RED=RGBColor(0xC8,0x10,0x2E); INK=RGBColor(0x1C,0x19,0x17); STONE=RGBColor(0x57,0x53,0x4E); LIGHT=RGBColor(0x78,0x71,0x6C)
doc=Document()
n=doc.styles['Normal']; n.font.name='Calibri'; n.font.size=Pt(10.5); n.font.color.rgb=INK
n.paragraph_format.space_after=Pt(6); n.paragraph_format.line_spacing=1.18

def shade(cell,h):
    tcPr=cell._tc.get_or_add_tcPr(); sh=OxmlElement('w:shd'); sh.set(qn('w:val'),'clear'); sh.set(qn('w:fill'),h); tcPr.append(sh)
def eyebrow(t):
    p=doc.add_paragraph(); p.paragraph_format.space_after=Pt(1); r=p.add_run(t.upper()); r.font.size=Pt(8); r.font.bold=True; r.font.color.rgb=RED
def h1(t,num=None):
    p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(16); p.paragraph_format.space_after=Pt(4)
    r=p.add_run((f"{num}  " if num else "")+t); r.font.size=Pt(15); r.font.bold=True; r.font.color.rgb=INK
    pPr=p._p.get_or_add_pPr(); pbdr=OxmlElement('w:pBdr'); bt=OxmlElement('w:bottom')
    bt.set(qn('w:val'),'single'); bt.set(qn('w:sz'),'6'); bt.set(qn('w:space'),'4'); bt.set(qn('w:color'),'E7E5E4'); pbdr.append(bt); pPr.append(pbdr)
def h2(t):
    p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(9); p.paragraph_format.space_after=Pt(2)
    r=p.add_run(t); r.font.size=Pt(11.5); r.font.bold=True; r.font.color.rgb=STONE
def body(t):
    p=doc.add_paragraph(); r=p.add_run(t); r.font.size=Pt(10.5); r.font.color.rgb=INK
def bullet(t):
    p=doc.add_paragraph(style='List Bullet'); r=p.add_run(t); r.font.size=Pt(10.5); r.font.color.rgb=INK; p.paragraph_format.space_after=Pt(2)
def table(rows,headers,widths):
    t=doc.add_table(rows=1,cols=len(headers)); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.style='Table Grid'
    hdr=t.rows[0].cells
    for i,ht in enumerate(headers):
        shade(hdr[i],'1C1917'); r=hdr[i].paragraphs[0].add_run(ht); r.font.bold=True; r.font.size=Pt(9); r.font.color.rgb=RGBColor(0xFF,0xFF,0xFF)
    for row in rows:
        cs=t.add_row().cells
        for i,v in enumerate(row):
            r=cs[i].paragraphs[0].add_run(v); r.font.size=Pt(9); r.font.color.rgb=INK
            if i==0: r.font.bold=True
    for i,w in enumerate(widths):
        for c in t.columns[i].cells: c.width=Inches(w)

# COVER
for _ in range(3): doc.add_paragraph()
p=doc.add_paragraph(); r=p.add_run('INTERNAL · CONFIDENTIAL'); r.font.size=Pt(9); r.font.bold=True; r.font.color.rgb=RED
p=doc.add_paragraph(); r=p.add_run('Paperless Business Banking'); r.font.size=Pt(28); r.font.bold=True; r.font.color.rgb=INK; p.paragraph_format.space_after=Pt(0)
p=doc.add_paragraph(); r=p.add_run('Position Paper'); r.font.size=Pt(18); r.font.color.rgb=STONE
p=doc.add_paragraph(); r=p.add_run('The case for compliant, self-serve, paperless service journeys'); r.font.italic=True; r.font.size=Pt(11); r.font.color.rgb=LIGHT
for _ in range(2): doc.add_paragraph()
meta=doc.add_table(rows=4,cols=2)
for (k,v),row in zip([('Author','Alan Davidson'),('Prepared','July 2026'),('Version','1.0'),('Status','Position paper — internal discussion')],meta.rows):
    a=row.cells[0].paragraphs[0].add_run(k); a.font.bold=True; a.font.size=Pt(9); a.font.color.rgb=STONE
    b=row.cells[1].paragraphs[0].add_run(v); b.font.size=Pt(9); b.font.color.rgb=INK
meta.columns[0].cells[0].width=Inches(1.4)
doc.add_page_break()

eyebrow('Position in brief'); h1('Our position','1')
body('Business-banking service events that still rely on paper and branch visits should be re-imagined as '
     'guided, self-serve, digitally-signed journeys inside the banking app — with the regulatory controls built '
     'into the flow. Doing so reduces cost and delay, improves the customer experience, and can strengthen '
     'compliance by making every check explicit, consistent and logged.')
body('This paper sets out the argument and points to a working front-end prototype that makes it concrete.')

eyebrow('The problem'); h1('Paper is still in the critical path','2')
body('Across mandates, payments, closures, disputes and onboarding, too many journeys still depend on posted '
     'forms, wet-ink signatures, faxed details and branch visits. The cost is measured in days of delay, '
     'operational handling, error and rework — and in a customer experience that lags the rest of digital banking.')
for b in ['Delay: postal round-trips and manual processing stretch simple changes into days.',
          'Cost: paper handling, re-keying and exception management carry real operational expense.',
          'Risk: manual steps introduce error and inconsistent application of controls.',
          'Experience: business customers expect to self-serve, at any hour, from any device.']:
    bullet(b)

eyebrow('The opportunity'); h1('Compliant self-serve, paperless by default','3')
body('The controls these journeys require — identity verification, authorisation to the correct mandate, '
     'confirmation of payee, sanctions and PEP screening, cooling-off, audit — are precisely the things software '
     'does consistently and at scale. Expressed inside the workflow, they become an enabler of a better '
     'experience rather than a reason to keep paper.')

eyebrow('Why now'); h1('The timing case','4')
for b in ['Regulatory expectations (Consumer Duty, SCA, APP-fraud reimbursement) reward controls that are consistent and evidenced.',
          'Business customers increasingly expect parity with the best consumer digital experiences.',
          'Confirmation of Payee, digital identity and strong authentication are now mature, reusable building blocks.']:
    bullet(b)

eyebrow('Evidence'); h1('What the prototype demonstrates','5')
body('A front-end concept prototype implements 17 paperless journeys across 7 business entity types, each '
     'replacing a specific paper or branch process and surfacing its regulatory controls in the experience — '
     'from mandate changes and bulk payments to disputes, cross-border beneficiary onboarding, balance '
     'certificates and device/session management. It is a clickable articulation of the position, not a '
     'production system.')

eyebrow('Benefits'); h1('Who benefits, and how','6')
table([
    ['Customer','Faster outcomes, self-serve at any time, clear status, fewer branch visits'],
    ['Bank','Lower handling cost, fewer exceptions, consistent control application, stronger audit'],
    ['Regulatory','Controls made explicit and logged; fair-treatment and cooling-off handled by design'],
], ['Stakeholder','Benefit'], [1.6,4.6])

eyebrow('Risks'); h1('Risks & mitigations','7')
table([
    ['Digital exclusion','Retain assisted and non-digital routes; design for accessibility (WCAG AA).'],
    ['Fraud / social engineering','Strong authentication, Confirmation of Payee, screening, and cooling-off windows.'],
    ['Regulatory change','Model controls as configurable policy rather than hard-coded logic.'],
    ['Adoption','Validate journeys with customer research before scaling; prioritise highest-value flows.'],
], ['Risk','Mitigation'], [1.9,4.3])

eyebrow('Recommendation'); h1('Recommendation','8')
for b in ['Endorse the paperless, compliant-by-design model as the target for business-banking service journeys.',
          'Select a small set of highest-value journeys for a backend-integrated pilot.',
          'Fund structured customer research using the prototype as the discussion artefact.',
          'Define production integration, security and data-protection requirements in parallel.']:
    bullet(b)

doc.add_paragraph()
p=doc.add_paragraph(); r=p.add_run('Prototype only — no backend, no real data, no live system connections. Prepared for internal discussion.')
r.font.size=Pt(8); r.font.italic=True; r.font.color.rgb=LIGHT
doc.save('Santander_Position_Paper.docx')
print('WROTE Santander_Position_Paper.docx')
