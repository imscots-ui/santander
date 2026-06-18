"""
HMS 1701 — Technical Architecture Deep-Dive
Produces: Santander_Architecture.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

RED      = RGBColor(0xC8, 0x10, 0x2E)
DARK     = RGBColor(0x1C, 0x19, 0x17)
WARM     = RGBColor(0xFA, 0xF6, 0xEF)
WHITE    = RGBColor(0xFF, 0xFF, 0xFF)
STONE5   = RGBColor(0x78, 0x71, 0x6C)
STONE3   = RGBColor(0xD6, 0xD3, 0xD1)
STONE1   = RGBColor(0xF5, 0xF5, 0xF4)
LIGHTRED = RGBColor(0xFE, 0xCA, 0xCA)
GREEN    = RGBColor(0x06, 0x6B, 0x3C)
AMBER    = RGBColor(0xD9, 0x77, 0x06)
BLUE     = RGBColor(0x1D, 0x4E, 0xD8)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

def R(slide, l, t, w, h, fill=None, line=None, line_w=1):
    s = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    s.line.fill.background()
    if fill:
        s.fill.solid(); s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if line:
        s.line.color.rgb = line; s.line.width = Pt(line_w)
    else:
        s.line.fill.background()
    return s

def T(slide, text, l, t, w, h, size=12, bold=False, color=DARK,
      align=PP_ALIGN.LEFT, italic=False):
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txb.word_wrap = True
    tf = txb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size); run.font.bold = bold
    run.font.italic = italic; run.font.color.rgb = color
    run.font.name = "Calibri"
    return txb

def BL(slide, items, l, t, w, size=11, color=DARK, dot=RED):
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(5))
    txb.word_wrap = True; tf = txb.text_frame; tf.word_wrap = True
    first = True
    for item in items:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False; p.space_after = Pt(4)
        r1 = p.add_run(); r1.text = "▪  "
        r1.font.color.rgb = dot; r1.font.size = Pt(size); r1.font.name = "Calibri"
        r2 = p.add_run(); r2.text = item
        r2.font.color.rgb = color; r2.font.size = Pt(size); r2.font.name = "Calibri"

def top_bar(slide): R(slide, 0, 0, 13.33, 0.08, fill=RED)
def footer(slide, n):
    T(slide, "Business Banking Advisor  ·  Self-initiated  ·  Own time",
      0.5, 7.22, 10, 0.24, size=7.5, italic=True, color=STONE5)
    T(slide, str(n), 12.6, 7.15, 0.5, 0.28, size=9, color=STONE5, align=PP_ALIGN.RIGHT)

def layer_box(slide, x, y, w, h, label, items, bg=DARK, tc=WHITE, sc=STONE3, lc=LIGHTRED):
    R(slide, x, y, w, h, fill=bg)
    T(slide, label, x+0.1, y+0.07, w-0.2, 0.28, size=9, bold=True, color=tc, align=PP_ALIGN.CENTER)
    R(slide, x+0.1, y+0.38, w-0.2, 0.018, fill=lc)
    BL(slide, items, x+0.12, y+0.42, w-0.24, size=8.5, color=sc, dot=lc)


# ══════════════════════════════════════════════════════════════
# SLIDE 1 — COVER
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=DARK)
R(s, 0, 0, 13.33, 0.45, fill=RED)
R(s, 0, 7.0, 13.33, 0.5, fill=RED)
T(s, "Santander  ·  Business Banking", 0.6, 0.12, 6, 0.3, size=11, bold=True, color=WHITE)
T(s, "TECHNICAL ARCHITECTURE", 1.2, 1.8, 10.93, 0.6,
  size=14, bold=True, color=STONE5, align=PP_ALIGN.CENTER)
T(s, "System Design, Data Flow &\nIntegration Blueprint", 1.2, 2.4, 10.93, 1.4,
  size=42, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
T(s, "HMS 1701 · Santander Business Banking Prototype · June 2026",
  1.2, 4.1, 10.93, 0.4, size=12, color=STONE5, align=PP_ALIGN.CENTER)
R(s, 3.8, 4.65, 5.73, 0.72, fill=RED)
T(s, "BUSINESS BANKING ADVISOR", 3.8, 4.69, 5.73, 0.3,
  size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
T(s, "Self-initiated  ·  Completed out of hours  ·  Own time", 3.8, 5.0, 5.73, 0.28,
  size=9, italic=True, color=LIGHTRED, align=PP_ALIGN.CENTER)
footer(s, 1)


# ══════════════════════════════════════════════════════════════
# SLIDE 2 — CURRENT PROTOTYPE: COMPONENT MAP
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Prototype Architecture: Component Map", 0.5, 0.25, 12, 0.45,
  size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

# Browser box
R(s, 0.4, 0.95, 12.53, 5.9, fill=WHITE, line=STONE3)
T(s, "BROWSER (any device — no install required)", 0.55, 1.0, 8, 0.28,
  size=9, bold=True, color=STONE5)

# Single HTML file
R(s, 0.65, 1.35, 12.03, 5.2, fill=STONE1, line=STONE3)
T(s, "index.html  ·  350KB  ·  Fully self-contained", 0.8, 1.38, 8, 0.28,
  size=9, bold=True, color=DARK)

# React App
R(s, 0.85, 1.72, 11.63, 1.65, fill=RED)
T(s, "React 18 — App.jsx  (~3,200 lines, single component)", 1.0, 1.77, 8, 0.28,
  size=10, bold=True, color=WHITE)
layers_react = [
    ("State Layer (60+ useState)", 1.0, 2.08, 3.3),
    ("useMemo Derivations (6)", 4.4, 2.08, 3.3),
    ("Event Handlers", 7.8, 2.08, 3.5),
]
for lbl, lx, ly, lw in layers_react:
    R(s, lx, ly, lw, 1.15, fill=DARK)
    T(s, lbl, lx+0.1, ly+0.08, lw-0.2, 0.28, size=8.5, bold=True, color=WHITE)

# State detail
for i, item in enumerate(["tab · workflow · step · viewMode",
                           "cooling[] · stalled[] · tick",
                           "entityType · approvalState",
                           "payees[] · wagesSource"]):
    T(s, item, 1.05, 2.42+i*0.21, 3.1, 0.2, size=7.5, color=STONE3)
for i, item in enumerate(["accounts (by entity type)",
                           "statementsData (5 months)",
                           "counterpartyStats",
                           "searchResults"]):
    T(s, item, 4.5, 2.42+i*0.21, 3.1, 0.2, size=7.5, color=STONE3)
for i, item in enumerate(["closeWorkflow() — resets all state",
                           "getMandateFor(accountNos)",
                           "addWorkingHours(date, hrs)",
                           "formatExecuteTime()"]):
    T(s, item, 7.9, 2.42+i*0.21, 3.3, 0.2, size=7.5, color=STONE3)

# Tailwind + CSS
R(s, 0.85, 3.48, 5.6, 0.75, fill=DARK)
T(s, "Tailwind CSS + Inline CSS Block", 0.98, 3.52, 4, 0.28, size=9, bold=True, color=WHITE)
T(s, "Custom tokens: brand-red · warm-bg · stone scale · lift-1/2/hero shadows",
  0.98, 3.78, 5.2, 0.38, size=7.5, color=STONE3)

# Icons + Fonts
R(s, 6.55, 3.48, 2.8, 0.75, fill=DARK)
T(s, "Lucide Icons (tree-shaken)", 6.68, 3.52, 2.5, 0.28, size=9, bold=True, color=WHITE)
T(s, "Only imported icons in bundle", 6.68, 3.78, 2.5, 0.28, size=7.5, color=STONE3)
R(s, 9.45, 3.48, 2.8, 0.75, fill=DARK)
T(s, "Google Fonts CDN", 9.58, 3.52, 2.5, 0.28, size=9, bold=True, color=WHITE)
T(s, "Fraunces · Geist Sans · Geist Mono", 9.58, 3.78, 2.5, 0.28, size=7.5, color=STONE3)

# Screens row
screen_names = ["Home", "Approve", "Statements", "MTD", "Audit"]
for i, name in enumerate(screen_names):
    x = 0.85 + i * 2.34
    R(s, x, 4.35, 2.2, 0.55, fill=RED)
    T(s, name, x, 4.35, 2.2, 0.55, size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Workflows row
wf_names = ["Closure", "Mandate", "Wages", "Biz Details", "Dormancy", "ID Check"]
for i, name in enumerate(wf_names):
    x = 0.85 + i * 1.955
    R(s, x, 5.02, 1.85, 0.48, fill=DARK)
    T(s, name, x, 5.02, 1.85, 0.48, size=9, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Build pipeline
R(s, 0.85, 5.62, 11.63, 0.6, fill=STONE3)
T(s, "BUILD PIPELINE:   Vite 5 + vite-plugin-singlefile  →  Single 350KB HTML  →  "
     "GitHub Pages (gh-pages branch)  →  Vercel (static serve)",
  1.0, 5.68, 11.3, 0.46, size=9, bold=True, color=DARK)

footer(s, 2)


# ══════════════════════════════════════════════════════════════
# SLIDE 3 — DATA & STATE ARCHITECTURE
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Data & State Architecture", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

T(s, "STATE FLOW — UNIDIRECTIONAL", 0.55, 0.9, 4.5, 0.28, size=10, bold=True, color=STONE5)
T(s, "All state lives at the top of App(). "
     "Sub-components are closures — they read and write via captured references. "
     "No prop drilling, no context, no external store. Single source of truth.",
  0.55, 1.22, 5.8, 0.55, size=10, color=DARK)

state_groups = [
    ("NAVIGATION", ["tab — active screen", "workflow — active overlay", "step — wizard position", "viewMode — mobile/desktop"]),
    ("ENTITY & ACCOUNTS", ["entityType — 7 types", "accounts (useMemo, by entity)", "approvalState — sign/reject map", "entity — label/doc config"]),
    ("COOLING-OFF", ["cooling[] — active holds", "stalled[] — timed-out requests", "tick — 30s re-render timer", "pendingCancelId"]),
    ("WORKFLOWS", ["closureSel, closureDest", "mandateAction, newPerson*", "payees[], wagesSource", "mtdReviewedTransactions"]),
    ("UI / OVERLAYS", ["toast, showRMSheet", "showCompliance, showSavings", "showEntitySwitcher", "rmReason"]),
    ("STATEMENTS", ["statementMonth, statementView", "counterpartyQuery, methodFilter", "openCounterparty", "moneyView"]),
]
for i, (grp, items) in enumerate(state_groups):
    col = i % 3; row = i // 2
    x = 0.55 + col * 4.26
    y = 1.88 + row * 1.52
    R(s, x, y, 4.0, 1.38, fill=WHITE, line=STONE3)
    R(s, x, y, 4.0, 0.07, fill=RED)
    T(s, grp, x+0.12, y+0.1, 3.7, 0.25, size=8.5, bold=True, color=DARK)
    BL(s, items, x+0.12, y+0.38, 3.7, size=8.5, color=STONE5)

T(s, "useMEMO DERIVED STATE (never stored, always computed)", 0.55, 5.0, 12, 0.28, size=10, bold=True, color=STONE5)
memos = [
    ("accounts", "Entity-aware account list — mandate rules, balances, account types per entity"),
    ("statementsData", "5 months × N transactions — categories, methods, counterparty rollups"),
    ("counterpartyStats", "Aggregated totals per supplier/customer — YTD amounts, methods, frequency"),
    ("searchResults", "Live-filtered counterparty search — top 5 matches on query change"),
]
for i, (name, desc) in enumerate(memos):
    x = 0.55 + i * 3.22
    R(s, x, 5.32, 3.0, 0.9, fill=DARK)
    T(s, name, x+0.12, 5.38, 2.76, 0.28, size=9, bold=True, color=WHITE)
    T(s, desc, x+0.12, 5.65, 2.78, 0.52, size=8.5, color=STONE3)

T(s, "closeWorkflow() INVARIANT: Every workflow-specific state variable MUST be reset here. "
     "Ghost state between workflows is the primary known failure mode.",
  0.55, 6.32, 12.23, 0.4, size=10, italic=True, bold=True, color=RED)
footer(s, 3)


# ══════════════════════════════════════════════════════════════
# SLIDE 4 — PRODUCTION SYSTEM ARCHITECTURE
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Production System Architecture", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

# Client tier
R(s, 0.4, 0.9, 12.53, 1.08, fill=RGBColor(0xEC,0xFD,0xF5), line=GREEN, line_w=1)
T(s, "CLIENT TIER", 0.55, 0.93, 2, 0.28, size=8.5, bold=True, color=GREEN)
client_boxes = [
    ("Mobile Web (PWA)", "React 18 · Tailwind · Geist · Fraunces"),
    ("Desktop Browser", "Same codebase · Sidebar layout · Wide viewport"),
    ("iOS / Android", "Add-to-home-screen PWA · theme-color #C8102E"),
]
for i, (t1, t2) in enumerate(client_boxes):
    x = 0.55 + i * 4.15
    R(s, x, 1.22, 3.85, 0.65, fill=GREEN)
    T(s, t1, x+0.1, 1.26, 3.6, 0.28, size=9, bold=True, color=WHITE)
    T(s, t2, x+0.1, 1.52, 3.6, 0.28, size=8, color=LIGHTRED)

# Arrow
T(s, "↕  HTTPS + JWT HttpOnly Cookie", 5.5, 2.0, 5, 0.3, size=9, bold=True, color=STONE5, align=PP_ALIGN.CENTER)

# API tier
R(s, 0.4, 2.32, 12.53, 1.28, fill=RGBColor(0xEF,0xF6,0xFF), line=BLUE, line_w=1)
T(s, "API TIER (FastAPI / AWS API Gateway)", 0.55, 2.35, 5, 0.28, size=8.5, bold=True, color=BLUE)
api_boxes = [
    ("Accounts API", "/accounts · /transactions · /statements"),
    ("Mandate API", "/signatories · /rules · /cooling-off"),
    ("Auth API", "/login · /refresh · /logout (JWT)"),
    ("MTD API Proxy", "/mtd/obligations · /mtd/submit"),
    ("KYC Webhook", "/kyc/callback (One Login)"),
]
for i, (t1, t2) in enumerate(api_boxes):
    x = 0.55 + i * 2.48
    R(s, x, 2.68, 2.25, 0.8, fill=BLUE)
    T(s, t1, x+0.1, 2.72, 2.0, 0.26, size=8.5, bold=True, color=WHITE)
    T(s, t2, x+0.1, 2.96, 2.1, 0.46, size=7.5, color=RGBColor(0xBF,0xDB,0xFF))

# Data tier
R(s, 0.4, 3.75, 12.53, 1.32, fill=RGBColor(0xFF,0xF7,0xED), line=AMBER, line_w=1)
T(s, "DATA TIER", 0.55, 3.78, 3, 0.28, size=8.5, bold=True, color=AMBER)
data_boxes = [
    ("PostgreSQL", "Accounts · Signatories · Entities · Mandates\nIndexed: account_no · entity_id · created_at"),
    ("Audit Event Store", "Append-only · EventBridge · S3 Glacier\n7-year retention · FCA SYSC 9"),
    ("Redis Cache", "Session tokens · Rate limiting\nHMRC OAuth tokens"),
    ("HMRC MTD Records", "Digital records 6yr · Obligation history\nVAT100 submissions"),
]
for i, (t1, t2) in enumerate(data_boxes):
    x = 0.55 + i * 3.12
    R(s, x, 4.1, 2.88, 0.88, fill=AMBER)
    T(s, t1, x+0.1, 4.14, 2.6, 0.26, size=8.5, bold=True, color=WHITE)
    T(s, t2, x+0.1, 4.38, 2.7, 0.55, size=7.5, color=DARK)

# External integrations
R(s, 0.4, 5.22, 12.53, 1.48, fill=RGBColor(0xFD,0xF2,0xF8), line=RED, line_w=1)
T(s, "EXTERNAL INTEGRATIONS", 0.55, 5.25, 4, 0.28, size=8.5, bold=True, color=RED)
ext_boxes = [
    ("GOV.UK One Login", "KYC · List 1 biometric ID\nOAuth2 PKCE · JWKS verify"),
    ("HMRC MTD VAT API", "VAT obligations · Submit VAT100\nOAuth2 client_credentials"),
    ("Vocalink CoP", "Confirmation of Payee\nPre-payment account validation"),
    ("SNS / SES", "Co-signer push alerts\nFace ID deep-link"),
    ("Companies House", "Director/member register\nReal-time entity verification"),
]
for i, (t1, t2) in enumerate(ext_boxes):
    x = 0.55 + i * 2.48
    R(s, x, 5.56, 2.25, 1.0, fill=RED)
    T(s, t1, x+0.1, 5.6, 2.0, 0.26, size=8.5, bold=True, color=WHITE)
    T(s, t2, x+0.1, 5.84, 2.1, 0.66, size=7.5, color=LIGHTRED)

footer(s, 4)


# ══════════════════════════════════════════════════════════════
# SLIDE 5 — SECURITY ARCHITECTURE
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Security Architecture", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

sec_cols = [
    ("AUTHENTICATION", [
        "JWT — RS256 signed, 15min access token",
        "HttpOnly · Secure · SameSite=Strict cookies",
        "Refresh token rotation (7-day sliding)",
        "No tokens in localStorage — ever",
        "Face ID via WebAuthn (Biometric Authenticator)",
        "PKCE flow for GOV.UK One Login handoff",
    ]),
    ("AUTHORISATION", [
        "Account-level mandate enforcement (Any-1/2/All)",
        "Signatory role validation server-side",
        "Read-only for non-signatories",
        "Cooling-off state enforced at API layer",
        "PEP / Sanctions check before signatory add",
        "Board minutes required at API for treasurer accts",
    ]),
    ("DATA PROTECTION", [
        "TLS 1.3 in transit — HSTS max-age=31536000",
        "AES-256 at rest (RDS encryption + S3 SSE)",
        "GDPR Art.5 data minimisation on KYC fields",
        "Right to erasure: pseudonymise, not delete (audit reqs)",
        "DPIA (Art.35) required before go-live",
        "PCI DSS scope: no card data stored, SAQ-A eligible",
    ]),
    ("INPUT SECURITY", [
        "No dangerouslySetInnerHTML on user content",
        "All monetary values: Number, not string eval",
        "Sort code / account validated: regex + CoP",
        "Country of residence: whitelist, not freetext",
        "File uploads: MIME type + size check server-side",
        "CSRF protection: SameSite=Strict + Origin header",
    ]),
]
for i, (title, items) in enumerate(sec_cols):
    x = 0.55 + i * 3.2
    R(s, x, 1.0, 2.9, 5.4, fill=WHITE, line=STONE3)
    R(s, x, 1.0, 2.9, 0.07, fill=RED)
    T(s, title, x+0.12, 1.1, 2.65, 0.28, size=9, bold=True, color=DARK)
    BL(s, items, x+0.12, 1.42, 2.68, size=9, color=STONE5)

T(s, "WCAG 2.1 AA ACCESSIBILITY:  focus-visible:ring on all interactive elements  ·  "
     "Colour contrast ≥4.5:1  ·  tabular-nums on all monetary amounts  ·  "
     "Error messages describe how to fix  ·  Screen reader safe",
  0.55, 6.55, 12.23, 0.58, size=10, color=DARK)
footer(s, 5)


# ══════════════════════════════════════════════════════════════
# SLIDE 6 — COMPLIANCE FRAMEWORK
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Regulatory & Compliance Framework", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

regs = [
    ("FCA BCOBS 4A", "COOLING-OFF", "right",
     ["24 working-hour hold on Any-1 actions",
      "Bank holiday + weekend aware (not calendar)",
      "Customer cancel at zero cost, any time",
      "Progress bar: live countdown every 30s",
      "Execution blocked until hold expires server-side"]),
    ("MLR 2017 / JMLSG", "KYC / KYB", "right",
     ["GOV.UK One Login: List 1 photo ID (biometric)",
      "Address proof < 3 months: List 2",
      "Trading address proof: List 3 (if differs)",
      "Sanctions country: auto RM escalation + EDD",
      "PEP: Enhanced Due Diligence, MLR s.35",
      "Visitor visa: rejected — settled status required"]),
    ("FCA SYSC 9", "AUDIT LOG", "left",
     ["7-year immutable event log",
      "Every action: actor · timestamp · action type",
      "Append-only — no mutation post-commit",
      "Export-ready: PDF/CSV per period",
      "FCA on-demand production capability"]),
    ("HMRC MTD", "MAKING TAX DIGITAL", "left",
     ["VAT: mandatory for all VAT-registered businesses",
      "ITSA: mandatory Apr 2026 (SMEs >£50k turnover)",
      "Digital links: bank→HMRC, no copy-paste",
      "Records: 6-year digital retention minimum",
      "HMRC-recognised software badge required"]),
]

for i, (reg, domain, side, pts) in enumerate(regs):
    row = i // 2; col = i % 2
    x = 0.55 + col * 6.4
    y = 1.0 + row * 2.88
    R(s, x, y, 6.1, 2.65, fill=WHITE, line=STONE3)
    R(s, x, y, 6.1, 0.07, fill=RED)
    R(s, x, y+0.1, 1.55, 0.48, fill=RED)
    T(s, reg, x+0.08, y+0.1, 1.45, 0.48, size=9, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    T(s, domain, x+1.72, y+0.14, 4.2, 0.35, size=11, bold=True, color=DARK)
    BL(s, pts, x+0.15, y+0.65, 5.7, size=9.5, color=STONE5)

footer(s, 6)


# ══════════════════════════════════════════════════════════════
# SLIDE 7 — PRIVACY & ACCOUNT SEPARATION ARCHITECTURE
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Privacy & Account Separation Architecture", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

# Left: Problem stack
T(s, "THE GAP — TWO INDEPENDENT LOOKUP SYSTEMS", 0.55, 0.92, 6.0, 0.28, size=10, bold=True, color=STONE5)
prob_items = [
    ("App Layer", "personalLinked flag removes personal accounts from React render tree — JSX conditional, not CSS hide"),
    ("Call Centre CLI", "Inbound call on customer mobile triggers CLI lookup — sees all linked accounts regardless of app flag"),
    ("Credit Decisioning", "Business loan underwriting can pull personal transaction history by default — no firewall between data sets"),
    ("Open Banking", "PSD2 consent granted to third parties (Funding Circle) may include personal + business accounts in same scope"),
]
for i, (label, desc) in enumerate(prob_items):
    y = 1.25 + i * 1.22
    R(s, 0.55, y, 6.0, 1.1, fill=WHITE, line=AMBER, line_w=1)
    R(s, 0.55, y, 6.0, 0.06, fill=AMBER)
    T(s, label, 0.7, y+0.1, 2.5, 0.28, size=9, bold=True, color=DARK)
    T(s, desc, 0.7, y+0.4, 5.6, 0.62, size=8.5, color=STONE5)

# Right: Solution architecture
T(s, "ARCHITECTURE SOLUTION — THREE LAYERS", 6.8, 0.92, 6.0, 0.28, size=10, bold=True, color=STONE5)
sol_items = [
    ("App Separation", "GREEN", "React state: personalLinked=false removes section from DOM. unlinkConfirm + declaration with case ref stored server-side"),
    ("CRM Separation", "GREEN", "unlinkAllChannels toggle triggers back-office CRM update (ref REL-2026-0291). CLI query excludes personal accounts within 2 working days"),
    ("Credit Ring-Fence", "GREEN", "creditRingfenced flag writes formal instruction to credit system. Personal account data excluded from business scorecard. GDPR Art.5(1)(c) purpose limitation"),
    ("PSD2 Consent Audit", "GREEN", "OB consent registry shows scope per app. Funding Circle 'full read' scope flagged. Revocation completes within 90s per PSD2 RTS Art.29"),
]
for i, (label, color, desc) in enumerate(sol_items):
    y = 1.25 + i * 1.22
    R(s, 6.8, y, 6.0, 1.1, fill=WHITE, line=GREEN, line_w=1)
    R(s, 6.8, y, 6.0, 0.06, fill=GREEN)
    T(s, label, 6.95, y+0.1, 2.5, 0.28, size=9, bold=True, color=DARK)
    T(s, desc, 6.95, y+0.4, 5.6, 0.62, size=8.5, color=STONE5)

# Footer regulatory basis
R(s, 0.5, 6.35, 12.33, 0.88, fill=DARK)
T(s, "Regulatory basis:  GDPR Art.5(1)(c) data minimisation  ·  PSD2 RTS Art.29 revocation  ·  "
     "FCA PS22/9 Consumer Duty  ·  ICO Legitimate Interests Assessment",
  0.65, 6.44, 12.0, 0.35, size=9, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
T(s, "Personal financial difficulty cannot affect business credit decisions · "
     "Personal transactions excluded from all business analytics and underwriting",
  0.65, 6.76, 12.0, 0.3, size=8.5, italic=True, color=STONE3, align=PP_ALIGN.CENTER)
footer(s, 7)


# ══════════════════════════════════════════════════════════════
# SLIDE 8 — ENTITY & MANDATE LOGIC
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Entity & Mandate Logic", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

T(s, "7 ENTITY TYPES — EACH WITH DIVERGENT COMPLIANCE PATH", 0.55, 0.92, 12, 0.28, size=10, bold=True, color=STONE5)
entity_data = [
    ("Sole Trader", "Any-1", "Principal", "—", "—", "No"),
    ("Partnership", "Any-1/2", "Partner", "—", "—", "No (RM on rename)"),
    ("Limited Co.", "Any-2", "Director", "Yes", "—", "No"),
    ("LLP", "Any-2", "Member", "Yes (LLP no.)", "—", "No"),
    ("Charity", "All", "Trustee", "—", "Yes (CC no.)", "Yes (all changes)"),
    ("Club", "All", "Committee", "—", "—", "Yes (all changes)"),
    ("Society", "All", "Committee", "—", "—", "Yes (all changes)"),
]
headers = ["Entity Type", "Default Rule", "Principal", "Co. House", "Charity Comm.", "Board Minutes"]
for j, hdr in enumerate(headers):
    x = 0.55 + j * 2.05
    R(s, x, 1.24, 1.95, 0.35, fill=DARK)
    T(s, hdr, x+0.06, 1.26, 1.85, 0.3, size=8.5, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
for i, row_data in enumerate(entity_data):
    bg = RGBColor(0xFF,0xF5,0xF5) if i % 2 == 0 else WHITE
    for j, cell in enumerate(row_data):
        x = 0.55 + j * 2.05
        R(s, x, 1.62+i*0.48, 1.95, 0.45, fill=bg, line=STONE3)
        col = RED if cell in ("Yes", "All") else (DARK if j==0 else STONE5)
        T(s, cell, x+0.08, 1.64+i*0.48, 1.8, 0.4, size=8.5, color=col, align=PP_ALIGN.CENTER,
          bold=(j == 0))

T(s, "MANDATE RULE ENFORCEMENT LOGIC", 0.55, 5.06, 12, 0.28, size=10, bold=True, color=STONE5)
rules = [
    ("Any-1", "Single signature sufficient. Cooling-off triggers automatically after execution.",
     "sole-trader, basic current account"),
    ("Any-2", "2 of N signatories required. Co-signer notified. 48hr window before RM escalation.",
     "limited companies, LLPs, partnerships with 2+ directors"),
    ("All", "Every verified signatory must sign. Treasurer acts last. Board minutes required.",
     "charities, clubs, societies — getMandateFor() returns strictest across accounts"),
]
for i, (rule, desc, example) in enumerate(rules):
    x = 0.55 + i * 4.26
    R(s, x, 5.38, 3.95, 1.65, fill=WHITE, line=STONE3)
    R(s, x, 5.38, 3.95, 0.07, fill=RED)
    T(s, rule, x+0.15, 5.44, 1.2, 0.28, size=12, bold=True, color=DARK)
    T(s, desc, x+0.15, 5.72, 3.65, 0.58, size=9, color=STONE5)
    T(s, f"→ {example}", x+0.15, 6.28, 3.65, 0.65, size=8.5, italic=True, color=RED)

footer(s, 8)


# ══════════════════════════════════════════════════════════════
# SLIDE 9 — API INTEGRATION CONTRACTS
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "API Integration Contracts", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

apis = [
    ("GOV.UK ONE LOGIN", "KYC/AML · Identity verification", [
        "Flow: PKCE OAuth2 → ID assertion JWT → verify JWKS",
        "Scopes: openid · email · phone · address",
        "Returns: VC (Verifiable Credential) with ID confidence P2",
        "Webhook: identity_assurance_completed → trigger List 1 approval",
        "Error states: low_confidence → RM escalation, fraud_signal → block",
    ]),
    ("HMRC MTD VAT API v1.0", "Making Tax Digital submission", [
        "Auth: OAuth2 client_credentials, VRN-scoped",
        "GET /obligations/{vrn} — current quarter, status, deadline",
        "POST /returns/{vrn} — VAT100 boxes 1–9, period key",
        "Response: formBundleNumber (receipt) in < 5 seconds",
        "Fraud headers: Gov-Client-Device-ID · Gov-Client-User-IDs required",
    ]),
    ("VOCALINK CoP API", "Confirmation of Payee · PSR 2017", [
        "Request: account name + sort code + account number",
        "Response: MATCHED · CLOSE_MATCH · NOT_MATCHED · UNAVAILABLE",
        "Timing: pre-payment, non-blocking (shown in payee add flow)",
        "Required for: all CHAPS, FP > £250k, any new payee add",
        "Mismatch: warn user + require explicit override confirmation",
    ]),
    ("COMPANIES HOUSE API", "Director/member register · Entity verification", [
        "GET /company/{number} — registered name, status, officers",
        "Sync on: entity onboarding + mandate add (director check)",
        "Officers list: validate proposed signatory against register",
        "Webhook: company_status_changed → alert RM if dissolved",
        "Rate limit: 600/5min — cache responses 1hr",
    ]),
]
for i, (title, sub, pts) in enumerate(apis):
    col = i % 2; row = i // 2
    x = 0.55 + col * 6.4
    y = 1.0 + row * 3.0
    R(s, x, y, 6.1, 2.72, fill=WHITE, line=STONE3)
    R(s, x, y, 6.1, 0.07, fill=RED)
    T(s, title, x+0.15, y+0.1, 5.7, 0.28, size=10, bold=True, color=DARK)
    T(s, sub, x+0.15, y+0.36, 5.7, 0.24, size=9, italic=True, color=STONE5)
    BL(s, pts, x+0.15, y+0.62, 5.7, size=9, color=STONE5)

footer(s, 9)


# ══════════════════════════════════════════════════════════════
# SLIDE 10 — DESIGN SYSTEM TOKENS
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
R(s, 0, 0, 13.33, 7.5, fill=WARM)
top_bar(s)
T(s, "Design System — Tokens & Patterns", 0.5, 0.25, 12, 0.45, size=20, bold=True, color=RED)
R(s, 0.5, 0.78, 12.33, 0.02, fill=STONE3)

# Colours
T(s, "COLOUR TOKENS", 0.55, 0.92, 3, 0.28, size=10, bold=True, color=STONE5)
swatches = [
    (RED,                              "#C8102E", "brand-red",   "CTAs, active nav, top bar"),
    (RGBColor(0xA0,0x0D,0x24),         "#A00D24", "brand-dark",  "Hover / pressed on red"),
    (DARK,                             "#1C1917", "stone-900",   "Primary text, dark cards"),
    (WARM,                             "#FAF6EF", "warm-bg",     "Page background only"),
    (RGBColor(0x78,0x71,0x6C),         "#78716C", "stone-500",   "Secondary text"),
    (RGBColor(0xA8,0xA2,0x9E),         "#A8A29E", "stone-400",   "Tertiary / placeholder"),
    (RGBColor(0xFE,0xCA,0xCA),         "#FECACA", "red-200",     "Accent on red surfaces"),
    (RGBColor(0xD6,0xD3,0xD1),         "#D6D3D1", "stone-300",   "Accent on dark surfaces"),
]
for i, (rgb, hex_v, token, usage) in enumerate(swatches):
    y = 1.25 + i * 0.56
    R(s, 0.55, y+0.06, 0.42, 0.42, fill=rgb, line=STONE3)
    T(s, hex_v,  1.08, y+0.06, 1.0, 0.2, size=8.5, bold=True, color=DARK)
    T(s, token,  1.08, y+0.26, 1.3, 0.2, size=8,   color=RED)
    T(s, usage,  2.45, y+0.1,  2.5, 0.35, size=8.5, color=STONE5)

# Typography
T(s, "TYPOGRAPHY", 5.2, 0.92, 3, 0.28, size=10, bold=True, color=STONE5)
fonts = [
    ("Fraunces (font-display)", "Serif — editorial headings, large balance numbers"),
    ("Fraunces tight (font-display-tight)", "Fraunces + tight letter-spacing, hero figures"),
    ("Geist Sans (font-body)", "All body text, labels, nav, buttons"),
    ("Geist Mono (font-mono)", "Account numbers, sort codes, financial data"),
    ("num-tab class", "tabular-nums — ALL monetary amounts, ensures alignment"),
]
for i, (name, use) in enumerate(fonts):
    y = 1.25 + i * 0.62
    R(s, 5.2, y, 3.0, 0.52, fill=DARK)
    T(s, name, 5.32, y+0.04, 2.76, 0.26, size=8.5, bold=True, color=WHITE)
    T(s, use, 5.32, y+0.28, 2.76, 0.2, size=7.5, color=STONE3)

# Spacing scale
T(s, "SPACING SCALE (4px base)", 8.4, 0.92, 4.5, 0.28, size=10, bold=True, color=STONE5)
spacings = [(4,"1"),(8,"2"),(12,"3"),(16,"4"),(24,"6"),(32,"8"),(48,"12"),(64,"16")]
for i, (px, tw) in enumerate(spacings):
    x = 8.4 + i * 0.6
    bar_h = px / 72
    R(s, x, 2.6-bar_h, 0.48, bar_h, fill=RED)
    T(s, f"{px}", x, 2.65, 0.48, 0.22, size=7.5, color=DARK, align=PP_ALIGN.CENTER)
    T(s, f"tw-{tw}", x, 2.88, 0.48, 0.2, size=6.5, color=STONE5, align=PP_ALIGN.CENTER)

# Shadow system
T(s, "SHADOW SYSTEM", 8.4, 3.2, 4.5, 0.28, size=10, bold=True, color=STONE5)
shadows = [
    ("lift-1", "1px 2px 4px rgba(0,0,0,.06)", "List items, inline cards"),
    ("lift-2", "0 4px 16px rgba(0,0,0,.10)", "Primary cards, panels"),
    ("lift-hero", "0 20px 60px rgba(0,0,0,.22)", "Balance hero card only"),
]
for i, (name, val, use) in enumerate(shadows):
    y = 3.55 + i * 0.78
    R(s, 8.4, y, 4.4, 0.68, fill=WHITE, line=STONE3)
    T(s, name, 8.54, y+0.06, 1.5, 0.26, size=9, bold=True, color=RED)
    T(s, val, 8.54, y+0.32, 2.5, 0.24, size=7.5, color=STONE5)
    T(s, use, 10.2, y+0.1, 2.5, 0.26, size=8.5, color=DARK)

# Component patterns
T(s, "KEY COMPONENT PATTERNS", 5.2, 4.62, 3, 0.28, size=10, bold=True, color=STONE5)
patterns = [
    ("StepFrame", "Workflow wrapper — back/close/progress/next. No hooks inside."),
    ("Input", "focus-visible:ring-2 — WCAG keyboard visible, mouse unaffected"),
    ("Toggle", "Switch component — focus-visible:ring — screen reader announced"),
    ("Field", "Label + child + hint — uppercase tracking, 11px hint text"),
    ("ProgressDots", "Step indicator — red active, stone complete, stone-300 future"),
]
for i, (name, desc) in enumerate(patterns):
    y = 4.95 + i * 0.55
    R(s, 5.2, y, 2.85, 0.46, fill=DARK)
    T(s, name, 5.32, y+0.06, 2.62, 0.24, size=8.5, bold=True, color=WHITE)
    T(s, desc, 8.15, y+0.1, 5.0, 0.36, size=8.5, color=STONE5)

footer(s, 10)


# ══════════════════════════════════════════════════════════════
# SAVE
# ══════════════════════════════════════════════════════════════
out = "/home/user/santander/Santander_Architecture.pptx"
prs.save(out)
print(f"Saved → {out}")
