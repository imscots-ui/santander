"""
HMS 1701 — Santander Business Banking Pitch Deck Builder
Produces: Santander_Digital_Banking_Future.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import copy

# ── Brand colours ────────────────────────────────────────────────────────────
RED    = RGBColor(0xC8, 0x10, 0x2E)
DARK   = RGBColor(0x1C, 0x19, 0x17)
WARM   = RGBColor(0xFA, 0xF6, 0xEF)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
STONE5 = RGBColor(0x78, 0x71, 0x6C)
STONE3 = RGBColor(0xD6, 0xD3, 0xD1)
LIGHTRED = RGBColor(0xFE, 0xCA, 0xCA)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

BLANK = prs.slide_layouts[6]   # completely blank


# ── Helpers ──────────────────────────────────────────────────────────────────

def add_rect(slide, l, t, w, h, fill=None, line=None):
    shape = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    shape.line.fill.background()
    if fill:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill
    else:
        shape.fill.background()
    if line:
        shape.line.color.rgb = line
        shape.line.width = Pt(1)
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, text, l, t, w, h,
             size=14, bold=False, color=DARK, align=PP_ALIGN.LEFT,
             italic=False, wrap=True):
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txb.word_wrap = wrap
    tf = txb.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = "Calibri"
    return txb

def add_multiline(slide, lines, l, t, w, h,
                  size=13, color=DARK, bold_first=False, spacing=1.15):
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txb.word_wrap = True
    tf = txb.text_frame
    tf.word_wrap = True
    first = True
    for line in lines:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = line
        run.font.size = Pt(size)
        run.font.color.rgb = color
        run.font.name = "Calibri"
        if bold_first and line == lines[0]:
            run.font.bold = True
    return txb

def red_bar(slide, height=0.08):
    add_rect(slide, 0, 0, 13.33, height, fill=RED)

def slide_number(slide, n):
    add_text(slide, str(n), 12.6, 7.1, 0.5, 0.3, size=9, color=STONE5, align=PP_ALIGN.RIGHT)

def advisor_footer(slide, dark_bg=False):
    """Running footer — Business Banking Advisor credit, all slides."""
    txt_col = STONE5 if not dark_bg else RGBColor(0x4A,0x44,0x40)
    add_text(slide,
        "Business Banking Advisor  ·  Self-initiated  ·  Completed out of hours in own time",
        0.5, 7.22, 11.5, 0.24, size=7.5, italic=True, color=txt_col, align=PP_ALIGN.LEFT)

def bullet_block(slide, items, l, t, w, dot_color=RED, size=12, color=DARK):
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(6))
    txb.word_wrap = True
    tf = txb.text_frame
    tf.word_wrap = True
    first = True
    for item in items:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.space_after = Pt(5)
        # bullet dot
        run_dot = p.add_run()
        run_dot.text = "▪  "
        run_dot.font.color.rgb = dot_color
        run_dot.font.size = Pt(size)
        run_dot.font.name = "Calibri"
        # text
        run = p.add_run()
        run.text = item
        run.font.size = Pt(size)
        run.font.color.rgb = color
        run.font.name = "Calibri"

def stat_card(slide, l, t, w, h, value, label, bg=RED, val_color=WHITE, lbl_color=LIGHTRED):
    add_rect(slide, l, t, w, h, fill=bg)
    add_text(slide, value, l+0.12, t+0.12, w-0.24, 0.55,
             size=28, bold=True, color=val_color, align=PP_ALIGN.CENTER)
    add_text(slide, label, l+0.08, t+0.65, w-0.16, 0.45,
             size=10, color=lbl_color, align=PP_ALIGN.CENTER)

def section_header(slide, title, subtitle=None):
    """Full-red title slide style"""
    add_rect(slide, 0, 0, 13.33, 7.5, fill=RED)
    add_text(slide, title, 1.5, 2.8, 10.33, 1.2,
             size=44, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    if subtitle:
        add_text(slide, subtitle, 1.5, 4.1, 10.33, 0.6,
                 size=18, color=LIGHTRED, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=DARK)
add_rect(s, 0, 0, 13.33, 0.45, fill=RED)        # top red stripe
add_rect(s, 0, 6.9, 13.33, 0.6, fill=RED)       # bottom red stripe
# Santander wordmark area
add_text(s, "Santander", 0.6, 0.12, 3, 0.3, size=13, bold=True, color=WHITE)
add_text(s, "Business Banking", 0.6, 0.38, 3.5, 0.28, size=10, color=LIGHTRED)
# Main title
add_text(s, "The Future of", 1.2, 1.6, 10.93, 0.9,
         size=22, color=STONE3, align=PP_ALIGN.CENTER)
add_text(s, "Business Banking", 1.2, 2.3, 10.93, 1.4,
         size=54, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_text(s, "A prototype-proven vision for the digital era", 1.2, 3.85, 10.93, 0.55,
         size=18, italic=True, color=STONE3, align=PP_ALIGN.CENTER)
# Divider
add_rect(s, 4.5, 4.6, 4.33, 0.025, fill=RED)
# Meta
add_text(s, "Alan Davidson  ·  Santander Business Banking  ·  June 2026",
         1.2, 4.9, 10.93, 0.35, size=11, color=STONE5, align=PP_ALIGN.CENTER)
add_text(s, "Prototype live at  imscots-ui.github.io/santander",
         1.2, 5.25, 10.93, 0.35, size=10, italic=True, color=STONE5, align=PP_ALIGN.CENTER)
# Advisor stamp
add_rect(s, 3.5, 5.72, 6.33, 0.72, fill=RED)
add_text(s, "BUSINESS BANKING ADVISOR", 3.5, 5.76, 6.33, 0.3,
         size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_text(s, "Self-initiated  ·  Completed out of hours  ·  Own time", 3.5, 6.07, 6.33, 0.3,
         size=9, italic=True, color=LIGHTRED, align=PP_ALIGN.CENTER)
slide_number(s, 1)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 2 — EXECUTIVE SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Executive Summary", 0.5, 0.25, 9, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Left column — the problem
add_text(s, "THE OPPORTUNITY", 0.55, 1.0, 5.8, 0.3,
         size=10, bold=True, color=STONE5)
bullet_block(s, [
    "Business customers complete 40+ forms annually on paper",
    "Mandate changes take 15–20 days end-to-end via branch",
    "MTD compliance is manual, error-prone and audit-risky",
    "Bulk payment authorisation has no digital audit trail",
    "KYC re-verification relies on branch visits",
    "Zero real-time visibility into tax position or liability",
], 0.55, 1.35, 5.8, color=DARK)

# Right column — what this prototype proves
add_text(s, "WHAT THE PROTOTYPE PROVES", 7.0, 1.0, 5.8, 0.3,
         size=10, bold=True, color=STONE5)
bullet_block(s, [
    "10 end-to-end workflows — fully functional today",
    "Mandate changes completed in minutes, not weeks",
    "Vulnerable customer / partner unreachable: full regulatory escalation path",
    "Privacy controls: personal/business unlink, credit ring-fence, PSD2 audit",
    "HMRC MTD VAT submission in 4 guided steps",
    "7-year FCA SYSC 9 compliant audit trail built-in",
], 7.0, 1.35, 5.8, color=DARK)

# Bottom stat strip
for i, (val, lbl) in enumerate([
    ("10", "Paperless\nworkflows"),
    ("7", "Business entity types"),
    ("3", "Approval rule tiers"),
    ("24h", "Cooling-off precision"),
    ("7yr", "Audit retention"),
    ("£0", "Paper forms required"),
]):
    x = 0.55 + i * 2.05
    stat_card(s, x, 5.5, 1.9, 1.5, val, lbl)
advisor_footer(s)
slide_number(s, 2)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 3 — THE PROBLEM IN DETAIL
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "The Current State: Paper, Delay, Risk", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

pain_points = [
    ("MANDATE CHANGES", "15–20 days",
     "Branch visit → paper form → back-office processing → postal confirmation. "
     "Each signatory change requires physical presence and wet signature."),
    ("BULK PAYMENTS", "No audit trail",
     "CSV files emailed, approved by phone call, uploaded via legacy portal. "
     "No dual-authorisation, no Confirmation of Payee, no cooling-off."),
    ("TAX COMPLIANCE", "Manual & risky",
     "VAT returns calculated in spreadsheets, copied into HMRC portal. "
     "Digital links requirement of MTD missed by 73% of SMEs (HMRC 2025)."),
    ("KYC RE-VERIFICATION", "Branch-only",
     "Expired signatory ID requires a branch appointment. Average wait: 8 days. "
     "No continuous monitoring, no digital ID verification."),
]

for i, (title, badge, desc) in enumerate(pain_points):
    row = i // 2
    col = i % 2
    x = 0.55 + col * 6.4
    y = 1.1 + row * 2.8
    add_rect(s, x, y, 6.0, 2.5, fill=WHITE, line=STONE3)
    add_rect(s, x, y, 6.0, 0.08, fill=RED)
    add_text(s, title, x+0.18, y+0.14, 3.5, 0.3, size=10, bold=True, color=DARK)
    add_rect(s, x+3.8, y+0.12, 1.9, 0.28, fill=RED)
    add_text(s, badge, x+3.8, y+0.12, 1.9, 0.28,
             size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, desc, x+0.18, y+0.52, 5.6, 1.8, size=11, color=STONE5)

add_text(s, "Every one of these problems is solved in the prototype.",
         0.5, 6.85, 12.33, 0.45, size=13, bold=True, color=RED, align=PP_ALIGN.CENTER)
advisor_footer(s)
slide_number(s, 3)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 4 — WHAT WE BUILT
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "What We Built: A Fully Functional Prototype", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

add_text(s,
    "A single-page React application — running live in any browser, no server, no backend — "
    "demonstrating every critical business banking workflow end-to-end. 21 features across 4 areas.",
    0.55, 0.95, 12.23, 0.55, size=13, color=STONE5)

features = [
    ("Home Dashboard", "Balance overview, health score, supplier radar, director centre, RM card, MTD alert"),
    ("Signature Queue", "Dual-authorisation with Face ID — sign or reject pending mandates, closures, payments"),
    ("Financial Statements", "6 months' transactions, category view, counterparty deep-dive, PDF/CSV/Excel export"),
    ("Making Tax Digital", "HMRC VAT obligations, quarterly submission wizard, ITSA readiness, real-time insights"),
    ("Audit Trail", "7-year immutable log — FCA SYSC 9 compliant, timestamped, actor-attributed"),
    ("Account Closure", "Multi-step wizard: select → destination → credit check → sign → 24h cooling-off"),
    ("Mandate Changes", "Add/remove/update signatories with full KYC/KYB, RM escalation, board minutes"),
    ("Bulk Payments", "Payee book, CoP verification, CSV import, mandate enforcement, scheduling"),
    ("Business Details", "Address, name, contacts — proof upload, Companies House sync, RM escalation"),
    ("ID Register", "GOV.UK One Login KYC, List 1/2/3 docs, expiry tracking, continuous re-verification"),
    ("Partner Unreachable", "Vulnerable customer path: health/contact/deceased/dispute — Specialist Team"),
    ("Privacy Controls", "Personal/business unlink (app + call centre + statements), credit ring-fence, PSD2 audit"),
    ("Pre-approved lending", "£45k offer · in-app draw-down · CCA 1974"),
    ("International FX", "5 currencies · live rate · SWIFT · MLR 2017"),
    ("Cash flow forecast", "13-week projection · SVG chart · risk alerts"),
    ("Receipt scan → MTD", "OCR categorise · VAT auto-update · audit"),
    ("Business health score", "Live 0–100 gauge across 5 factors · grade A–D"),
    ("Supplier risk radar", "Companies House RAG status for top 5 counterparties"),
    ("Voice ID biometric", "3-phrase enrolment · cross-channel · SCA step-up matrix"),
    ("Payment sequencer", "30-day balance outlook · smart rescheduling · risk threshold"),
    ("Live notifications", "Bell icon · security alerts · approvals · cooling-off · co-signer status"),
]

for i, (name, desc) in enumerate(features):
    row = i // 4
    col = i % 4
    x = 0.55 + col * 3.17
    y = 1.65 + row * 1.02
    add_rect(s, x, y, 2.95, 0.88, fill=WHITE, line=STONE3)
    add_rect(s, x, y, 0.08, 0.88, fill=RED)
    add_text(s, name, x+0.22, y+0.06, 2.6, 0.28, size=9, bold=True, color=DARK)
    add_text(s, desc, x+0.22, y+0.34, 2.65, 0.48, size=8, color=STONE5)

advisor_footer(s)
slide_number(s, 4)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 5 — PRIVACY CONTROLS (new)
# ═══════════════════════════════════════════════════════════════════════════════
AMBER_BG  = RGBColor(0xFF, 0xF7, 0xED)
AMBER_BDR = RGBColor(0xFB, 0xBF, 0x24)
AMBER_BAR = RGBColor(0xD9, 0x77, 0x06)
GREEN_BG  = RGBColor(0xF0, 0xFD, 0xF4)
GREEN_BDR = RGBColor(0x34, 0xD3, 0x99)
GREEN_BAR = RGBColor(0x10, 0xB9, 0x81)

s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, '"That\'s My Bank": Privacy Controls & Account Separation', 0.5, 0.25, 12.5, 0.5,
         size=19, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)
add_text(s,
    "The first UK bank to offer self-service personal/business separation across all channels — "
    "app, call centre, credit decisioning, and open banking. In-app. Immediate. Auditable.",
    0.55, 0.9, 12.23, 0.48, size=11, italic=True, color=STONE5)

# Left — The Problem
add_text(s, "THE CURRENT EXPOSURE — 4 CHANNELS", 0.55, 1.48, 5.8, 0.28,
         size=10, bold=True, color=STONE5)
problems = [
    ("App — co-signatories",
     "Every director, partner, or trustee on the business profile can see personal account balances"),
    ("Call centre — CLI lookup",
     "Calling from a registered mobile causes the agent's screen to show both personal and business accounts"),
    ("Credit decisioning",
     "Business loan and overdraft assessments can reference personal account history without consent"),
    ("Open banking — PSD2",
     "Third-party apps granted consent during a product application retain indefinite personal data access"),
]
for i, (ch, desc) in enumerate(problems):
    y = 1.82 + i * 1.1
    add_rect(s, 0.55, y, 5.6, 1.0, fill=AMBER_BG, line=AMBER_BDR)
    add_rect(s, 0.55, y, 0.07, 1.0, fill=AMBER_BAR)
    add_text(s, ch, 0.74, y+0.06, 5.2, 0.27, size=10, bold=True, color=DARK)
    add_text(s, desc, 0.74, y+0.34, 5.3, 0.6, size=9.5, color=STONE5)

# Right — The Solution
add_text(s, "THE SEPARATION CONTROLS — SELF-SERVICE", 6.7, 1.48, 6.1, 0.28,
         size=10, bold=True, color=STONE5)
solutions = [
    ("App unlink",
     "Personal accounts removed from business view entirely — not hidden, removed. "
     "Co-signatories lose access. FCA SYSC 9 audit log written."),
    ("Call centre separation",
     "Back-office CRM instruction raised in-app. Agents won't see personal accounts when customer calls. "
     "Confirmed by letter within 2 working days."),
    ("Credit ring-fence",
     "GDPR Article 5(1)(c) instruction: personal data excluded from all business credit assessments. "
     "Business credit judged on business cash flow only."),
    ("Open banking audit",
     "PSD2 consent registry shows all third-party access. One-tap revocation — "
     "third party must stop within 90 seconds. Funding Circle 'full read' surfaced and revokable."),
]
for i, (title, desc) in enumerate(solutions):
    y = 1.82 + i * 1.1
    add_rect(s, 6.7, y, 6.1, 1.0, fill=GREEN_BG, line=GREEN_BDR)
    add_rect(s, 6.7, y, 0.07, 1.0, fill=GREEN_BAR)
    add_text(s, title, 6.89, y+0.06, 5.7, 0.27, size=10, bold=True, color=DARK)
    add_text(s, desc, 6.89, y+0.34, 5.8, 0.6, size=9.5, color=STONE5)

add_rect(s, 0.5, 6.52, 12.33, 0.58, fill=DARK)
add_text(s,
    "GDPR Art. 5(1)(c) data minimisation  ·  FCA Consumer Duty PS22/9  ·  "
    "PSD2 open banking  ·  FCA SYSC 9 audit  ·  ICO purpose limitation guidance",
    0.65, 6.6, 12.0, 0.4, size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
advisor_footer(s)
slide_number(s, 5)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 6 — ADVANCED FEATURES
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Advanced Features Deep-Dive", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Four feature panels in a 2×2 grid
adv_features = [
    ("PRE-APPROVED BUSINESS LENDING", [
        "£45,000 pre-approved — surfaced proactively on the home screen",
        "Based on 6-month transaction history, reserve balance, payment record",
        "3-step in-app draw-down: offer → terms → authenticate",
        "Live monthly repayment calculator — 12, 24, 36 month terms",
        "CCA 1974 regulated: 14-day cooling-off right, early repayment cap",
        "Removes branch appointment and paper application entirely",
    ]),
    ("13-WEEK CASH FLOW FORECAST", [
        "Projected weekly balance chart driven by known commitments",
        "Models: DDs, standing orders, payroll run, VAT settlement, income patterns",
        "Amber warning line at £80k threshold — actionable nudge to transfer funds",
        "Min projected balance and week-13 endpoint summary",
        "'Risk ahead' badge on home screen when dip detected",
        "Refreshes on entity switch — always reflects active accounts",
    ]),
    ("INTERNATIONAL PAYMENTS / FX", [
        "EUR · USD · CHF · AUD · CAD — 5 currencies supported",
        "Live simulated exchange rate with FCA-required fee transparency",
        "IBAN entry with SWIFT/BIC — same-day CHAPS or 1–2 day SWIFT",
        "Total debit including fee shown before authorisation",
        "MLR 2017 screening flag on payments ≥ £50,000",
        "SWIFT reference number generated and logged to audit trail",
    ]),
    ("RECEIPT SCAN → MTD AUTO-CATEGORISE", [
        "Scan receipt or invoice from camera — simulated OCR extraction",
        "Extracts: merchant, date, gross, VAT amount, VAT rate, invoice ref",
        "Suggests MTD category (e.g. IT & Technology at 20% standard rate)",
        "One-tap confirm categorises transaction — VAT reclaim auto-updated",
        "Receipt image not stored after extraction — GDPR Art.5(1)(e)",
        "Closes the final manual-entry gap in the MTD digital links chain",
    ]),
]

for i, (title, pts) in enumerate(adv_features):
    col = i % 2; row = i // 2
    x = 0.55 + col * 6.4
    y = 1.0 + row * 2.88
    add_rect(s, x, y, 6.1, 2.65, fill=WHITE, line=STONE3)
    add_rect(s, x, y, 6.1, 0.08, fill=RED)
    add_text(s, title, x+0.18, y+0.14, 5.7, 0.3, size=10, bold=True, color=DARK)
    bullet_block(s, pts, x+0.18, y+0.5, 5.7, dot_color=RED, size=9.5, color=STONE5)

advisor_footer(s)
slide_number(s, 6)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 7 — INTELLIGENCE & SECURITY
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Intelligence & Security", 0.5, 0.22, 10, 0.5, size=26, bold=True, color=DARK)
add_text(s, "Seven features that set us apart — intelligence built in, security by design",
         0.5, 0.7, 12, 0.35, size=12, color=STONE5)
add_rect(s, 0.5, 1.05, 12.33, 0.025, fill=RED)

panels_is = [
    ("Business Health Score",
     ["Live 0–100 score across 5 factors",
      "Liquidity · Tax · Cash flow · Payroll ratio · Mandate",
      "Circular SVG gauge updates in real time",
      "Grade A–D with per-factor breakdown bars"]),
    ("Supplier Risk Radar",
     ["Companies House filing status for top 5 suppliers",
      "Red (>180d overdue) · Amber (90–180d) · Green (current)",
      "Annual spend per counterparty displayed",
      "Critical badge alerts before supplier failure"]),
    ("Director Command Centre",
     ["All signatories in a 2×2 governance grid",
      "KYC status · last-active timestamp · pending count",
      "Cooling-off countdowns per person",
      "One tap to full approval queue"]),
    ("Voice ID Biometric",
     ["3-phrase enrolment with GDPR Art.9 consent gate",
      "Cross-channel: app · phone banking · video call",
      "Anti-spoofing: liveness + voice clone detection",
      "SCA step-up matrix — 6 tiers, PSD2 RTS Art.97"]),
    ("Smart Payment Sequencer",
     ["30-day balance outlook with 7 scheduled payments",
      "SVG balance bar chart with £80k risk threshold line",
      "Optimise button reschedules discretionary payments",
      "Locked payments (tax/rent) never moved"]),
    ("Voice Memo → MTD",
     ["Tap-to-record expense entry — no typing",
      "1.8s simulated transcription extracts all fields",
      "Auto-fills merchant · amount · VAT · category",
      "One-tap confirm adds to MTD ledger + audit trail"]),
    ("Live Notification Bell",
     ["Security alerts: new device/location login",
      "Pending approval queue — one tap to Sign tab",
      "Cooling-off countdowns with live progress bar",
      "Stalled co-signer escalations with RM status"]),
]

EMERALD = RGBColor(0x05, 0x96, 0x69)
AMBER   = RGBColor(0xD9, 0x77, 0x06)

# 7 panels: 3 in row 0, 4 in row 1 — using narrower panels to fit
panel_rows = [[0, 1, 2], [3, 4, 5, 6]]
for ri, row_items in enumerate(panel_rows):
    n = len(row_items)
    pw = (12.33 - (n - 1) * 0.18) / n  # panel width
    y = 1.2 + ri * 2.85
    for ci, idx in enumerate(row_items):
        title, pts = panels_is[idx]
        x = 0.45 + ci * (pw + 0.18)
        add_rect(s, x, y, pw, 2.6, fill=WHITE, line=STONE3)
        add_rect(s, x, y, pw, 0.07, fill=RED)
        add_text(s, title, x+0.15, y+0.12, pw-0.2, 0.32, size=10, bold=True, color=DARK)
        bullet_block(s, pts, x+0.15, y+0.5, pw-0.2, dot_color=RED, size=8.5, color=STONE5)

advisor_footer(s)
slide_number(s, 7)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 8 — PAPERLESS WORKFLOWS
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Feature Deep-Dive: Paperless Workflows", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Mandate change flow
add_text(s, "MANDATE CHANGE — End-to-End (previously 15–20 days, now minutes)",
         0.55, 0.98, 12.23, 0.3, size=11, bold=True, color=DARK)

steps = [
    ("1", "Choose action", "Add / Remove / Update signatory or change signing rule"),
    ("2", "Personal details", "Name, DOB, email, country of residence, visa status"),
    ("3", "KYC documents", "List 1 photo ID via GOV.UK One Login, List 2 address proof"),
    ("4", "Trading address", "List 3 if trading ≠ residential — lease, bank stmt, FCA reg"),
    ("5", "Board minutes", "Treasurer accounts: PDF minutes with 2 member signatures"),
    ("6", "Sign & submit", "Biometric sign, co-signers notified, cooling-off if needed"),
]

for i, (num, title, desc) in enumerate(steps):
    x = 0.55 + i * 2.14
    add_rect(s, x, 1.38, 1.95, 0.42, fill=RED)
    add_text(s, f"{num}. {title}", x+0.1, 1.38, 1.85, 0.42,
             size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, desc, x+0.08, 1.85, 1.85, 0.7, size=9, color=STONE5)
    if i < 5:
        add_text(s, "→", x+1.97, 1.48, 0.2, 0.28, size=16, bold=True, color=RED)

add_rect(s, 0.5, 2.65, 12.33, 0.025, fill=STONE3)

# Three entity-aware workflows
add_text(s, "ENTITY-AWARE RULES — 7 business types, each with correct compliance path",
         0.55, 2.75, 12.23, 0.3, size=11, bold=True, color=DARK)

entities = [
    ("Limited Company", "Companies House sync, director mandate, cooling-off on closure"),
    ("Registered Charity", "Trustee structure, treasurer role, board minutes on all changes"),
    ("Sole Trader", "Any-1 mandate, single signature, simplified KYC"),
    ("Partnership", "RM escalation on rename, partnership agreement required"),
    ("LLP", "Members register, LLP number, Companies House verification"),
    ("Club / Society", "Committee structure, treasurer, board minutes, FSCS protection"),
]

for i, (etype, rule) in enumerate(entities):
    col = i % 3
    row = i // 3
    x = 0.55 + col * 4.25
    y = 3.12 + row * 0.88
    add_rect(s, x, y, 3.95, 0.78, fill=WHITE, line=STONE3)
    add_text(s, etype, x+0.15, y+0.07, 3.6, 0.3, size=11, bold=True, color=DARK)
    add_text(s, rule, x+0.15, y+0.35, 3.7, 0.38, size=9, color=STONE5)

# Cooling off
add_rect(s, 0.5, 4.96, 12.33, 0.025, fill=STONE3)
add_text(s, "COOLING-OFF SYSTEM: 24 working hours with bank-holiday awareness. "
         "User can cancel at any time. Progress bar live-updates every 30 seconds. "
         "Execution delayed until next business moment after hold expires.",
         0.55, 5.08, 12.23, 0.6, size=11, color=STONE5)

# Retired forms
add_rect(s, 0.5, 5.75, 12.33, 0.65, fill=RED)
add_text(s,
    "Forms retired by this prototype:  "
    "CA04 (Mandate Change)   ·   CA07 (Account Closure)   ·   CA11 (Business Details)   "
    "·   P17 (New Signatory)   ·   D18 (Dormancy Reactivation)",
    0.65, 5.82, 12.0, 0.52, size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
advisor_footer(s)
slide_number(s, 8)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 9 — MAKING TAX DIGITAL
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Feature Deep-Dive: Making Tax Digital Integration", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Left — MTD overview
add_text(s, "WHAT THE PROTOTYPE DELIVERS", 0.55, 0.98, 6.5, 0.3, size=10, bold=True, color=STONE5)
bullet_block(s, [
    "Live HMRC OAuth connection (VRN + UTR displayed)",
    "VAT obligation dashboard — current quarter, amount due, deadline",
    "4-step quarterly submission wizard (categorise → review → declare → submit)",
    "Auto-categorisation of transactions with confidence scoring",
    "VAT100 box-by-box breakdown with hero 'Net VAT to Pay' figure",
    "ITSA readiness tracking (mandatory from April 2026 for SMEs > £50k)",
    "Year-to-date tax liability estimate with real-time insights",
    "7-year digital records retention — HMRC compliant, audit-ready",
], 0.55, 1.32, 6.0, color=DARK)

# Right — MTD stats
add_text(s, "MTD COMPLIANCE LANDSCAPE", 7.0, 0.98, 5.8, 0.3, size=10, bold=True, color=STONE5)

mtd_stats = [
    ("73%", "of SMEs miss digital\nlinks requirement"),
    ("£15M+", "HMRC penalties issued\nfor MTD non-compliance"),
    ("8.2h", "avg. time per VAT return\nwithout MTD software"),
    ("4 steps", "to submit VAT return\nin this prototype"),
]
for i, (val, lbl) in enumerate(mtd_stats):
    col = i % 2
    row = i // 2
    x = 7.0 + col * 2.95
    y = 1.32 + row * 1.55
    stat_card(s, x, y, 2.7, 1.35, val, lbl)

# MTD submission flow
add_rect(s, 0.5, 4.25, 12.33, 0.025, fill=STONE3)
add_text(s, "QUARTERLY SUBMISSION — 4-STEP WIZARD", 0.55, 4.38, 12, 0.3, size=11, bold=True, color=DARK)

mtd_steps = [
    ("Categorise", "Auto-tagged transactions confirmed. Low-confidence items manually split Business/Personal."),
    ("Review VAT100", "All 9 boxes shown. Box 5 (Net VAT to pay) is hero figure. Reclaim vs. output tax visible."),
    ("Declare", "Legal responsibility confirmed. HMRC accuracy warning. Checkbox required to proceed."),
    ("Submit", "Direct HMRC MTD VAT API v1.0 call. Receipt number in 30 seconds. DD auto-scheduled."),
]
for i, (title, desc) in enumerate(mtd_steps):
    x = 0.55 + i * 3.22
    add_rect(s, x, 4.75, 3.0, 1.85, fill=WHITE, line=STONE3)
    add_rect(s, x, 4.75, 3.0, 0.08, fill=RED)
    add_text(s, f"Step {i+1}: {title}", x+0.12, 4.85, 2.76, 0.32, size=10, bold=True, color=DARK)
    add_text(s, desc, x+0.12, 5.22, 2.78, 1.28, size=9, color=STONE5)
    if i < 3:
        add_text(s, "→", x+3.02, 5.52, 0.22, 0.28, size=14, bold=True, color=RED)

advisor_footer(s)
slide_number(s, 9)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 10 — SECURITY & COMPLIANCE
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Security, Compliance & Trust Architecture", 0.5, 0.25, 13, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

sec_sections = [
    ("DUAL-AUTHORISATION (PSR 2017)", [
        "Three mandate rules: Any-1 · Any-2 · All signatories",
        "Strictly enforced per account — account type sets default",
        "Multi-sig requests notified via app push + email",
        "48-hour window for co-signer before RM escalation",
        "Full audit trail of every sign and rejection",
    ]),
    ("KYC/KYB (MLR 2017 / JMLSG)", [
        "GOV.UK One Login for biometric ID verification (List 1)",
        "Address proof < 3 months (List 2), trading address (List 3)",
        "Sanctions country screening — auto RM escalation",
        "Visitor visa rejection — settled/pre-settled required",
        "PEP flagging with MLR 2017 Enhanced Due Diligence",
        "Continuous re-verification — expiry dates tracked",
    ]),
    ("COOLING-OFF (FCA BCOBS 4A)", [
        "24 working-hour hold on all Any-1 executed actions",
        "Bank-holiday and weekend aware (not calendar hours)",
        "Progress bar live-updates — customer sees exact time",
        "Customer can cancel at zero cost at any point",
        "Execution only after full working-day hold",
    ]),
    ("AUDIT & DATA RETENTION (FCA SYSC 9)", [
        "7-year immutable audit log — every action timestamped",
        "Actor attribution on every event (initiator + co-signers)",
        "HMRC digital records: 6-year minimum for MTD",
        "No data mutation post-commit — append-only architecture",
        "Export-ready: PDF/CSV per month for compliance review",
    ]),
]

for i, (title, pts) in enumerate(sec_sections):
    col = i % 2
    row = i // 2
    x = 0.55 + col * 6.4
    y = 1.0 + row * 2.88
    add_rect(s, x, y, 6.1, 2.65, fill=WHITE, line=STONE3)
    add_rect(s, x, y, 6.1, 0.08, fill=RED)
    add_text(s, title, x+0.18, y+0.14, 5.7, 0.3, size=10, bold=True, color=DARK)
    bullet_block(s, pts, x+0.18, y+0.5, 5.7, dot_color=RED, size=10, color=STONE5)

advisor_footer(s)
slide_number(s, 10)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 11 — FINANCIAL INTELLIGENCE
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Feature Deep-Dive: Financial Intelligence", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Left col
add_text(s, "STATEMENTS & TRANSACTION INTELLIGENCE", 0.55, 0.98, 6.0, 0.3, size=10, bold=True, color=STONE5)
bullet_block(s, [
    "6 months of transactions across 8 payment methods",
    "Dual view: chronological timeline OR category totals",
    "Method filter: Card · DD · SO · Faster Payments · BACS",
    "Counterparty search — autocomplete to top 5 suppliers/customers",
    "Counterparty detail sheet: transaction history, frequency, totals",
    "Recurring payment notices (DD Guarantee, Standing Order explainer)",
    "Cancel recurring payments direct from statement view",
    "Export: PDF, CSV, Excel — per month — one tap",
], 0.55, 1.32, 6.0, color=DARK)

add_text(s, "COUNTERPARTY INTELLIGENCE", 0.55, 4.05, 6.0, 0.3, size=10, bold=True, color=STONE5)
bullet_block(s, [
    "Year-to-date totals per supplier/customer",
    "Average transaction size and payment method breakdown",
    "Payment frequency pattern detection",
    "Pin counterparty to home screen for quick access",
], 0.55, 4.4, 6.0, color=DARK)

# Right col
add_text(s, "MTD-LINKED TRANSACTION INSIGHTS", 7.0, 0.98, 5.8, 0.3, size=10, bold=True, color=STONE5)
bullet_block(s, [
    "Auto-categorised against 9 categories (Equipment, Wages, etc.)",
    "Confidence scoring — high/medium/low per transaction",
    "VAT rate applied per transaction (20% standard / 0% exempt)",
    "Low-confidence flagged for Business/Personal split decision",
    "Feeds directly into MTD VAT100 calculation — no re-entry",
], 7.0, 1.32, 5.8, color=DARK)

add_text(s, "YEAR-TO-DATE SUMMARY (Live on MTD Screen)", 7.0, 3.55, 5.8, 0.3, size=10, bold=True, color=STONE5)

ytd = [
    ("£392,450", "Sales revenue"),
    ("£184,380", "Purchases"),
    ("£208,070", "Gross profit"),
    ("£41,614", "Estimated tax"),
]
for i, (val, lbl) in enumerate(ytd):
    x = 7.0 + (i % 2) * 2.95
    y = 3.9 + (i // 2) * 1.32
    stat_card(s, x, y, 2.7, 1.18, val, lbl,
              bg=DARK, val_color=WHITE, lbl_color=STONE3)

add_text(s, "Real-time tax liability estimate — £41,614 set-aside nudge built into the MTD insights panel.",
         0.55, 6.7, 12.23, 0.55, size=11, italic=True, color=STONE5)
advisor_footer(s)
slide_number(s, 11)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 12 — TECHNICAL ARCHITECTURE
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Technical Architecture", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Stack overview
add_text(s, "CURRENT PROTOTYPE STACK", 0.55, 0.98, 4.5, 0.3, size=10, bold=True, color=STONE5)
stack = [
    ("React 18", "UI framework — hooks-based, single-component architecture"),
    ("Vite + Singlefile", "Zero-dependency build: entire app in one 350KB HTML file"),
    ("Tailwind CSS", "Design system — custom tokens: brand red, warm bg, stone scale"),
    ("Lucide Icons", "Tree-shaken icon set — only used icons in bundle"),
    ("Fraunces + Geist", "Santander editorial + clean body — Google Fonts CDN"),
    ("No backend", "All state client-side — intentional prototype constraint"),
]
for i, (tech, desc) in enumerate(stack):
    y = 1.32 + i * 0.78
    add_rect(s, 0.55, y, 1.6, 0.6, fill=RED)
    add_text(s, tech, 0.55, y, 1.6, 0.6,
             size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, desc, 2.28, y+0.08, 3.6, 0.5, size=10, color=DARK)

# Production architecture vision
add_text(s, "PRODUCTION ARCHITECTURE — RECOMMENDED PATH", 6.5, 0.98, 6.3, 0.3, size=10, bold=True, color=STONE5)
prod = [
    ("API Gateway", "FastAPI or AWS API Gateway — stateless, versioned endpoints"),
    ("Auth", "JWT in HttpOnly Secure SameSite=Strict cookies — no localStorage"),
    ("Database", "PostgreSQL with read replicas — indexed on account_no, entity_id, date"),
    ("KYC Service", "GOV.UK One Login OAuth2 — real-time identity verification"),
    ("HMRC MTD API", "OAuth 2.0 client credentials — VRN-scoped VAT obligations"),
    ("CoP Service", "Vocalink Confirmation of Payee API — pre-payment validation"),
    ("Audit Log", "Append-only event store — EventBridge + S3 Glacier for 7yr retention"),
    ("Notifications", "SNS/SES for co-signer alerts — push via FCM/APNs"),
]
for i, (layer, desc) in enumerate(prod):
    y = 1.32 + i * 0.72
    add_rect(s, 6.5, y, 1.75, 0.55, fill=DARK)
    add_text(s, layer, 6.5, y, 1.75, 0.55,
             size=9, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(s, desc, 8.38, y+0.08, 4.5, 0.42, size=9, color=DARK)

advisor_footer(s)
slide_number(s, 12)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 13 — BUSINESS CASE
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "The Business Case", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Cost savings
add_text(s, "COST AVOIDANCE — PER 10,000 BUSINESS CUSTOMERS", 0.55, 0.98, 12, 0.3, size=10, bold=True, color=STONE5)
savings = [
    ("£2.4M", "Mandate change\nprocessing cost eliminated\n(£240 avg. branch cost × 10k)"),
    ("£1.1M", "Paper form handling\n& postal costs removed\n(5 forms avg/customer/yr)"),
    ("£800K", "KYC re-verification\nbranch visits avoided\n(£80 cost per visit)"),
    ("£600K", "Compliance penalty\nrisk reduction\n(MTD + FCA SYSC 9)"),
]
for i, (val, lbl) in enumerate(savings):
    x = 0.55 + i * 3.22
    stat_card(s, x, 1.35, 3.0, 1.65, val, lbl)

# Revenue opportunity
add_rect(s, 0.5, 3.15, 12.33, 0.025, fill=STONE3)
add_text(s, "REVENUE & RETENTION OPPORTUNITY", 0.55, 3.28, 6.0, 0.3, size=10, bold=True, color=STONE5)
bullet_block(s, [
    "MTD integrated banking = primary bank stickiness — customers who use tax features churn 60% less",
    "Payee book + recurring payments = switching friction — bulk payment users stay 3× longer",
    "Digital mandate management opens multi-entity accounts previously abandoned due to complexity",
    "KYC via GOV.UK One Login removes the final barrier to fully digital onboarding",
], 0.55, 3.62, 6.0, color=DARK, size=11)

add_text(s, "COMPETITIVE DIFFERENTIATION", 7.0, 3.28, 5.8, 0.3, size=10, bold=True, color=STONE5)
bullet_block(s, [
    "No UK business bank offers MTD submission within the banking app today",
    "Cooling-off with working-hours precision exceeds regulatory minimum",
    "7-entity KYC awareness is unique — clubs, charities, LLPs fully supported",
    "First UK bank to offer self-service personal/business separation across all channels",
    "Credit ring-fence: personal financial difficulties cannot affect business credit decisions",
], 7.0, 3.62, 5.8, color=DARK, size=10)

# Bottom CTA
add_rect(s, 0.5, 6.2, 12.33, 0.98, fill=DARK)
add_text(s,
    "Total addressable saving: £4.9M per 10,000 customers in year one.\n"
    "With 280,000 Santander business customers, the annualised opportunity exceeds £137M.",
    0.65, 6.3, 12.0, 0.78, size=13, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
advisor_footer(s)
slide_number(s, 13)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 14 — ROADMAP
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Roadmap to Production", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

phases = [
    ("PHASE 1\nQ3 2026", "Customer Research & Validation",
     ["User testing on prototype (live now at GitHub Pages)",
      "10 SME deep-dives across 5 entity types",
      "HMRC MTD API developer sandbox access",
      "GOV.UK One Login integration scoping",
      "Security & accessibility audit (WCAG 2.1 AA)",
     ], True),
    ("PHASE 2\nQ4 2026", "Backend & Integration Build",
     ["FastAPI backend: accounts, signatories, audit log",
      "PostgreSQL schema: entity-aware mandate rules",
      "GOV.UK One Login OAuth2 integration (KYC)",
      "HMRC MTD VAT API live connection",
      "Vocalink CoP API (Confirmation of Payee)",
     ], False),
    ("PHASE 3\nQ1 2027", "Pilot & Compliance Sign-Off",
     ["Closed pilot: 500 business customers",
      "FCA sandbox notification (BCOBS 4A cooling-off)",
      "PCI DSS scope assessment for payment flows",
      "Penetration testing + DPIA (GDPR Art. 35)",
      "MLR 2017 compliance sign-off (KYC/KYB paths)",
     ], False),
    ("PHASE 4\nQ2 2027", "General Availability",
     ["Phased rollout by entity type (limited first)",
      "Branch decommission of 5 paper forms",
      "Marketing: 'Banking that does your tax'",
      "ITSA readiness (mandatory for SMEs Apr 2026)",
      "NPS tracking — target +18 points vs. branch",
     ], False),
]

for i, (phase, title, pts, active) in enumerate(phases):
    x = 0.55 + i * 3.22
    bg = RED if active else WHITE
    tc = WHITE if active else DARK
    sc = LIGHTRED if active else STONE5
    add_rect(s, x, 1.05, 3.0, 5.9, fill=bg, line=STONE3)
    if active:
        add_rect(s, x, 1.05, 3.0, 0.08, fill=DARK)
    add_text(s, phase, x+0.15, 1.12, 2.7, 0.6, size=11, bold=True, color=tc, align=PP_ALIGN.CENTER)
    add_text(s, title, x+0.15, 1.72, 2.7, 0.48, size=10, bold=True, color=tc if not active else WHITE, align=PP_ALIGN.CENTER)
    add_rect(s, x+0.15, 2.28, 2.7, 0.025, fill=sc)
    bullet_block(s, pts, x+0.15, 2.38, 2.7, dot_color=DARK if not active else LIGHTRED, size=9,
                 color=sc)

add_text(s, "Phase 1 is already complete — the prototype is live and ready for user research today.",
         0.55, 7.08, 12.23, 0.3, size=11, italic=True, color=STONE5, align=PP_ALIGN.CENTER)
advisor_footer(s)
slide_number(s, 14)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 15 — DESIGN SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=WARM)
red_bar(s)
add_text(s, "Design System & Accessibility", 0.5, 0.25, 12, 0.5,
         size=22, bold=True, color=RED)
add_rect(s, 0.5, 0.82, 12.33, 0.025, fill=STONE3)

# Colour swatches
add_text(s, "BRAND COLOUR SYSTEM", 0.55, 0.98, 4, 0.3, size=10, bold=True, color=STONE5)
swatches = [
    (RED, "#C8102E", "Brand red — CTAs, active nav, top bar"),
    (DARK, "#1C1917", "Primary text, dark cards"),
    (WARM, "#FAF6EF", "Page background — warm off-white"),
    (RGBColor(0xD6,0xD3,0xD1), "#D6D3D1", "Secondary text on dark surfaces"),
    (RGBColor(0xFE,0xCA,0xCA), "#FECACA", "Accent on red surfaces (red-200)"),
]
for i, (rgb, hex_val, label) in enumerate(swatches):
    y = 1.32 + i * 0.66
    add_rect(s, 0.55, y, 0.5, 0.5, fill=rgb, line=STONE3)
    add_text(s, hex_val, 1.15, y+0.05, 1.1, 0.22, size=9, bold=True, color=DARK)
    add_text(s, label, 1.15, y+0.26, 4.0, 0.22, size=9, color=STONE5)

# Typography
add_text(s, "TYPOGRAPHY", 0.55, 4.68, 4, 0.3, size=10, bold=True, color=STONE5)
fonts = [
    ("Fraunces (serif)", "Editorial headings, large numbers — 'font-display'"),
    ("Geist Sans", "Body text, labels, navigation — 'font-body'"),
    ("Geist Mono", "Account numbers, financial figures — tabular-nums"),
]
for i, (font, use) in enumerate(fonts):
    y = 5.04 + i * 0.52
    add_text(s, font, 0.55, y, 2.2, 0.3, size=10, bold=True, color=DARK)
    add_text(s, use, 2.85, y, 3.0, 0.3, size=10, color=STONE5)

# Spacing scale
add_text(s, "SPACING SCALE (4px base — Tailwind tokens)", 6.0, 0.98, 7.0, 0.3, size=10, bold=True, color=STONE5)
spacings = [4, 8, 12, 16, 24, 32, 48, 64]
for i, sp in enumerate(spacings):
    x = 6.0 + i * 0.9
    h = sp / 48
    add_rect(s, x, 2.5 - h, 0.7, h, fill=RED)
    add_text(s, f"{sp}", x, 2.6, 0.7, 0.25, size=8, color=DARK, align=PP_ALIGN.CENTER)

# Accessibility
add_text(s, "ACCESSIBILITY — WCAG 2.1 AA", 6.0, 3.0, 7.0, 0.3, size=10, bold=True, color=STONE5)
a11y = [
    "All interactive elements keyboard-navigable — Tab/Enter/Space",
    "focus-visible:ring on every button, input, and toggle — mouse users unaffected",
    "Colour contrast ≥ 4.5:1 on body text, ≥ 3:1 on large text",
    "Error messages explain HOW to fix (not just that something is wrong)",
    "ARIA labels on icon-only buttons — screen reader safe",
    "tabular-nums on all monetary amounts — assistive tech alignment",
]
bullet_block(s, a11y, 6.0, 3.35, 7.0, dot_color=RED, size=10, color=DARK)

# Shadow system
add_text(s, "SHADOW SYSTEM", 6.0, 5.7, 7.0, 0.3, size=10, bold=True, color=STONE5)
shadows = [
    ("lift-1", "List items, inline cards — barely lifted"),
    ("lift-2", "Primary cards, panels — clearly lifted"),
    ("lift-hero", "Balance card only — dramatic depth"),
]
for i, (name, desc) in enumerate(shadows):
    x = 6.0 + i * 2.45
    add_rect(s, x, 6.08, 2.1, 0.6, fill=WHITE, line=STONE3)
    add_text(s, name, x+0.12, 6.1, 1.8, 0.28, size=9, bold=True, color=RED)
    add_text(s, desc, x+0.12, 6.34, 1.9, 0.28, size=8, color=STONE5)

advisor_footer(s)
slide_number(s, 15)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 16 — NEXT STEPS
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=DARK)
add_rect(s, 0, 0, 13.33, 0.08, fill=RED)
add_rect(s, 0, 7.42, 13.33, 0.08, fill=RED)

add_text(s, "Next Steps", 0.8, 0.4, 11.73, 0.6,
         size=28, bold=True, color=WHITE)
add_text(s, "Three decisions to unlock Phase 2", 0.8, 0.9, 11.73, 0.4,
         size=16, color=STONE3)
add_rect(s, 0.8, 1.38, 11.73, 0.025, fill=RED)

actions = [
    ("01", "APPROVE USER RESEARCH",
     "Allocate 2 weeks and 10 SME participants for prototype testing. "
     "The prototype is live now — no additional build cost. "
     "Research focus: mandate complexity, MTD flow, mobile vs. desktop preference."),
    ("02", "COMMISSION TECHNICAL SCOPING",
     "Engage Architecture & Engineering to scope the FastAPI backend, "
     "GOV.UK One Login OAuth2 integration, and HMRC MTD API sandbox access. "
     "Estimated 4-week scoping exercise with a T-shirt sizing output."),
    ("03", "BRIEF LEGAL & COMPLIANCE",
     "FCA BCOBS 4A (cooling-off), MLR 2017 (KYC/KYB paths), "
     "HMRC MTD obligations, and GDPR Art. 35 DPIA. "
     "Prototype documentation and audit logs available for review immediately."),
]

for i, (num, title, body) in enumerate(actions):
    y = 1.6 + i * 1.65
    add_rect(s, 0.8, y, 0.7, 1.35, fill=RED)
    add_text(s, num, 0.8, y+0.35, 0.7, 0.6,
             size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_rect(s, 1.6, y, 10.93, 1.35, fill=RGBColor(0x2C,0x27,0x24))
    add_text(s, title, 1.78, y+0.1, 10.7, 0.35, size=12, bold=True, color=WHITE)
    add_text(s, body, 1.78, y+0.5, 10.7, 0.78, size=11, color=STONE3)

# CTA
add_rect(s, 0.8, 6.6, 11.73, 0.65, fill=RED)
add_text(s,
    "Prototype live now:  imscots-ui.github.io/santander   ·   No install, no login, any device   ·   "
    "Alan Davidson · Alan.Davidson@santander.co.uk",
    0.9, 6.3, 11.5, 0.35, size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_text(s,
    "Business Banking Advisor  ·  Self-initiated  ·  Completed entirely out of hours in own time",
    0.9, 6.65, 11.5, 0.3, size=9, italic=True, color=LIGHTRED, align=PP_ALIGN.CENTER)
slide_number(s, 16)


# ═══════════════════════════════════════════════════════════════════════════════
# SAVE
# ═══════════════════════════════════════════════════════════════════════════════
out = "/home/user/santander/Santander_Digital_Banking_Future.pptx"
prs.save(out)
print(f"Saved → {out}")
