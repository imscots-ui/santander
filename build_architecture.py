"""
build_architecture.py
Generates a 12-slide technical architecture report for the
Santander Business Banking prototype using python-pptx.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_AUTO_SIZE

# ---------------------------------------------------------------------------
# Colour constants
# ---------------------------------------------------------------------------
RED        = RGBColor(0xc8, 0x10, 0x2e)   # Santander brand red
DARK       = RGBColor(0x1c, 0x19, 0x17)   # dark stone #1c1917
WHITE      = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GREY = RGBColor(0xE5, 0xE5, 0xE4)   # subtle separator
MID_GREY   = RGBColor(0x78, 0x71, 0x6C)   # stone-500 equivalent
BODY_DARK  = RGBColor(0x1C, 0x19, 0x17)   # near-black body text on white

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def new_prs():
    prs = Presentation()
    prs.slide_width  = Inches(13.33)
    prs.slide_height = Inches(7.5)
    return prs


def blank_slide(prs):
    layout = prs.slide_layouts[6]
    return prs.slides.add_slide(layout)


def set_bg(slide, color):
    bg   = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_textbox(slide, left, top, width, height):
    return slide.shapes.add_textbox(left, top, width, height)


def add_rect(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(1, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_title(slide, text, dark=False):
    tb = add_textbox(slide, Inches(0.6), Inches(0.45), Inches(12.1), Inches(0.75))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = text
    r = p.runs[0]
    r.font.name  = "Calibri"
    r.font.size  = Pt(32)
    r.font.bold  = True
    r.font.color.rgb = WHITE if dark else BODY_DARK
    return tb


def add_red_rule(slide):
    add_rect(slide, Inches(0.6), Inches(1.25), Inches(12.1), Inches(0.03), RED)


def red_bar(slide, top=True):
    bar_h = Inches(0.08)
    top_  = Inches(0) if top else Inches(7.5) - bar_h
    add_rect(slide, Inches(0), top_, Inches(13.33), bar_h, RED)


def bullets_box(slide, bullets, left, top, width, height, size=13):
    tb = add_textbox(slide, left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    first = True
    for bullet in bullets:
        para = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        para.text = bullet
        para.space_before = Pt(5)
        r = para.runs[0]
        r.font.name  = "Calibri"
        r.font.size  = Pt(size)
        r.font.color.rgb = BODY_DARK
    return tb


# ---------------------------------------------------------------------------
# Slide 1 — Cover
# ---------------------------------------------------------------------------
def slide_01_cover(prs):
    slide = blank_slide(prs)
    set_bg(slide, DARK)

    red_bar(slide, top=True)
    red_bar(slide, top=False)

    tb = add_textbox(slide, Inches(0.7), Inches(1.6), Inches(11.9), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Architecture Report"
    r = p.runs[0]
    r.font.name = "Calibri"; r.font.size = Pt(54); r.font.bold = True
    r.font.color.rgb = WHITE

    tb2 = add_textbox(slide, Inches(0.7), Inches(3.85), Inches(11.9), Inches(0.9))
    tf2 = tb2.text_frame
    p2 = tf2.paragraphs[0]
    p2.text = "Santander Business Banking Prototype"
    r2 = p2.runs[0]
    r2.font.name = "Calibri"; r2.font.size = Pt(24)
    r2.font.color.rgb = LIGHT_GREY

    tb3 = add_textbox(slide, Inches(0.7), Inches(4.75), Inches(6), Inches(0.5))
    tf3 = tb3.text_frame
    p3 = tf3.paragraphs[0]
    p3.text = "June 2026"
    r3 = p3.runs[0]
    r3.font.name = "Calibri"; r3.font.size = Pt(14)
    r3.font.color.rgb = RED


# ---------------------------------------------------------------------------
# Slide 2 — The Single-File Architecture
# ---------------------------------------------------------------------------
def slide_02_single_file(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "The Single-File Architecture")
    add_red_rule(slide)

    bullets = [
        "• App.jsx — ~5,700 lines, one React function component",
        "• Intentional choice: read the entire product top-to-bottom without navigating modules",
        "• No backend, no real API calls (except Google Fonts)",
        "• Build output: single self-contained HTML file",
        "• Bundle size: ~870 KB total, ~190 KB gzip",
        "• Deployed to GitHub Pages",
        "• Trade-off: monolith size vs. navigation simplicity for a prototype context",
    ]
    bullets_box(slide, bullets, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.5))


# ---------------------------------------------------------------------------
# Slide 3 — Internal Component Order (dark section divider)
# ---------------------------------------------------------------------------
def slide_03_component_order(prs):
    slide = blank_slide(prs)
    set_bg(slide, DARK)
    red_bar(slide, top=True)

    # Section label
    lbl = add_textbox(slide, Inches(0.6), Inches(0.35), Inches(10), Inches(0.4))
    tf_l = lbl.text_frame
    p_l = tf_l.paragraphs[0]; p_l.text = "INTERNAL STRUCTURE"
    r_l = p_l.runs[0]; r_l.font.name = "Calibri"; r_l.font.size = Pt(10)
    r_l.font.bold = True; r_l.font.color.rgb = RED

    add_title(slide, "Internal Component Order", dark=True)

    items = [
        ("1", "Hooks",                  "lines ~28–685 (120+ state variables)"),
        ("2", "Static data",            "ENTITY_INFO, accounts (useMemo), mtdData, statementsData (useMemo)"),
        ("3", "Inline CSS",             "css template literal: brand colours, animations, glass effects"),
        ("4", "Primitive components",   "ProgressDots, StepFrame, Input, Field, Toggle (closures, no hooks)"),
        ("5", "Workflow renderers",     "renderClosure, renderBiz, renderMandate, renderWages, renderLending, renderFX, renderDormancy, renderUnlink, renderRingfence, renderIdCheck, renderMtdSubmit"),
        ("6", "Screen components",      "HomeScreen, ApproveScreen, AuditScreen, StatementsScreen, MTDScreen"),
        ("7", "Sheet/modal components", "15 sheets: OTPSheet, ComplianceSheet, SavingsSheet, RMSheet, EntitySheet, CancelSheet, ReceiptSheet, PinSheet, OBSheet, VoiceMemoSheet, SequencerSheet, VoiceIdSheet, NotificationsSheet, CounterpartySheet, A11ySheet"),
        ("8", "Main render",            "desktop sidebar + mobile bottom nav code paths"),
    ]

    col1_x = Inches(0.6)
    col2_x = Inches(3.1)
    row_h  = Inches(0.62)
    start_y = Inches(1.6)

    for i, (num, label, desc) in enumerate(items):
        y = start_y + i * row_h

        nb = add_textbox(slide, col1_x, y, Inches(0.4), Inches(0.5))
        tf_nb = nb.text_frame
        p_nb = tf_nb.paragraphs[0]; p_nb.text = num
        p_nb.alignment = PP_ALIGN.CENTER
        r_nb = p_nb.runs[0]; r_nb.font.name = "Calibri"; r_nb.font.size = Pt(11)
        r_nb.font.bold = True; r_nb.font.color.rgb = RED

        lb = add_textbox(slide, Inches(1.05), y, Inches(1.9), Inches(0.5))
        tf_lb = lb.text_frame
        p_lb = tf_lb.paragraphs[0]; p_lb.text = label
        r_lb = p_lb.runs[0]; r_lb.font.name = "Calibri"; r_lb.font.size = Pt(11)
        r_lb.font.bold = True; r_lb.font.color.rgb = WHITE

        db = add_textbox(slide, col2_x, y, Inches(10.1), Inches(0.55))
        tf_db = db.text_frame; tf_db.word_wrap = True
        p_db = tf_db.paragraphs[0]; p_db.text = desc
        r_db = p_db.runs[0]; r_db.font.name = "Calibri"; r_db.font.size = Pt(11)
        r_db.font.color.rgb = LIGHT_GREY


# ---------------------------------------------------------------------------
# Slide 4 — Hook Discipline
# ---------------------------------------------------------------------------
def slide_04_hook_discipline(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Hook Discipline")
    add_red_rule(slide)

    bullets = [
        "• 120+ state variables declared at the top of App (lines ~28–685)",
        "• Strict rule: no hook may appear after line ~744 (the closeWorkflow boundary)",
        "• All renderXxx functions and screen components are closures — they cannot hold their own hooks",
        "• All workflow state must be reset in closeWorkflow() to prevent ghost state between workflows",
        "• useEffect used sparingly: tick timer (30s interval), font loading, scroll resets",
        "• useMemo for accounts and statementsData — derived from entityType and payment history",
    ]
    bullets_box(slide, bullets, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.5))


# ---------------------------------------------------------------------------
# Slide 5 — Navigation Model
# ---------------------------------------------------------------------------
def slide_05_navigation(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Navigation Model")
    add_red_rule(slide)

    ascii_diagram = (
        "┌─────────────────────────────────────────────┐\n"
        "│  tab state (main screen)                    │\n"
        "│  'home' | 'approve' | 'audit' | 'mtd'       │\n"
        "│  | 'statements'                             │\n"
        "└─────────────────────────────────────────────┘\n"
        "              │\n"
        "              ▼\n"
        "┌─────────────────────────────────────────────┐\n"
        "│  workflow state (full-screen overlay)        │\n"
        "│  null | 'closure' | 'biz' | 'mandate'       │\n"
        "│  | 'wages' | 'lending' | 'fx' | 'dormancy' │\n"
        "│  | 'unlink' | 'ringfence' | 'idcheck'       │\n"
        "│  | 'mtd-submit'                             │\n"
        "└─────────────────────────────────────────────┘\n"
        "              │\n"
        "              ▼\n"
        "┌─────────────────────────────────────────────┐\n"
        "│  step state (0-based position in workflow)  │\n"
        "└─────────────────────────────────────────────┘"
    )

    tb_d = add_textbox(slide, Inches(0.6), Inches(1.4), Inches(7.8), Inches(5.7))
    tf_d = tb_d.text_frame; tf_d.word_wrap = False
    first = True
    for line in ascii_diagram.split("\n"):
        para = tf_d.paragraphs[0] if first else tf_d.add_paragraph()
        first = False
        para.text = line
        run = para.runs[0] if para.runs else para.add_run()
        run.font.name  = "Courier New"
        run.font.size  = Pt(10)
        run.font.color.rgb = BODY_DARK

    extra = [
        "• viewMode: 'mobile' (default) | 'desktop'",
        "  → toggles sidebar vs bottom nav layout",
        "",
        "• All state is shared — switching mobile↔desktop",
        "  preserves workflow in progress",
    ]
    tb_e = add_textbox(slide, Inches(8.6), Inches(1.8), Inches(4.5), Inches(3.5))
    tf_e = tb_e.text_frame; tf_e.word_wrap = True
    first = True
    for line in extra:
        para = tf_e.paragraphs[0] if first else tf_e.add_paragraph()
        first = False
        para.text = line; para.space_before = Pt(5)
        run = para.runs[0] if para.runs else para.add_run()
        run.font.name  = "Calibri"
        run.font.size  = Pt(12)
        run.font.color.rgb = BODY_DARK


# ---------------------------------------------------------------------------
# Slide 6 — Entity System
# ---------------------------------------------------------------------------
def slide_06_entity_system(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Entity System")
    add_red_rule(slide)

    bullets = [
        "• 7 entity types: sole-trader, partnership, limited, llp, charity, club, society",
        "• ENTITY_INFO static map (~line 264) — each type configures:",
        "    → Entity object: labels ('director' vs 'trustee'), required documents",
        "    → Registration numbers: Companies House / Charity Commission",
        "    → accounts array (via useMemo ~line 334): different accounts per entity",
        "    → UI copy throughout: mandate rules, workflow steps, compliance requirements",
        "• Active entity: entityType state — switching entity changes everything derived from it",
    ]

    tb2 = add_textbox(slide, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.5))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    first = True
    for bullet in bullets:
        para = tf2.paragraphs[0] if first else tf2.add_paragraph()
        first = False
        para.text = bullet; para.space_before = Pt(6)
        r = para.runs[0]; r.font.name = "Calibri"
        is_indent = bullet.startswith("    ")
        r.font.size  = Pt(11) if is_indent else Pt(13)
        r.font.color.rgb = MID_GREY if is_indent else BODY_DARK


# ---------------------------------------------------------------------------
# Slide 7 — Mandate Rules
# ---------------------------------------------------------------------------
def slide_07_mandate_rules(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Mandate Rules")
    add_red_rule(slide)

    rows = [
        ("• Per-account mandate rule: 'any-1' | 'any-2' | 'all'",                                           False),
        ("• getMandateFor(accountNos) — line ~420 — picks the STRICTEST rule across selected accounts",       False),
        ("• Strictness order: 'all' > 'any-2' > 'any-1'",                                                   False),
        ("• 'any-1'  → single authoriser sufficient",                                                         False),
        ("• 'any-2'  → two authorisers required → triggers co-signer workflow",                               False),
        ("• 'all'    → every signatory must approve → cooling-off period enforced",                            False),
        ("• Impact: determines whether workflow requires co-signer and/or 24h cooling-off",                    True),
    ]

    tb2 = add_textbox(slide, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.5))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    first = True
    for text, highlight in rows:
        para = tf2.paragraphs[0] if first else tf2.add_paragraph()
        first = False
        para.text = text; para.space_before = Pt(7)
        r = para.runs[0]; r.font.name = "Calibri"; r.font.size = Pt(15)
        r.font.bold  = highlight
        r.font.color.rgb = RED if highlight else BODY_DARK


# ---------------------------------------------------------------------------
# Slide 8 — Cooling-off & Stalled Requests
# ---------------------------------------------------------------------------
def slide_08_cooling_stalled(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Cooling-off & Stalled Requests")
    add_red_rule(slide)

    col_w = Inches(5.8)

    # Left: Cooling-off
    hdr1 = add_textbox(slide, Inches(0.6), Inches(1.5), col_w, Inches(0.45))
    p_h1 = hdr1.text_frame.paragraphs[0]; p_h1.text = "Cooling-off"
    r_h1 = p_h1.runs[0]; r_h1.font.name = "Calibri"; r_h1.font.size = Pt(18)
    r_h1.font.bold = True; r_h1.font.color.rgb = RED

    cooling = [
        "• cooling array: requests pending 24h execution delay (working days only)",
        "• tick state refreshes every 30s — keeps progress bars live",
        "• User can Cancel or Fast-Track a cooling request",
    ]
    bullets_box(slide, cooling, Inches(0.6), Inches(2.05), col_w, Inches(2.8), size=14)

    # Right: Stalled
    hdr2 = add_textbox(slide, Inches(7.1), Inches(1.5), col_w, Inches(0.45))
    p_h2 = hdr2.text_frame.paragraphs[0]; p_h2.text = "Stalled"
    r_h2 = p_h2.runs[0]; r_h2.font.name = "Calibri"; r_h2.font.size = Pt(18)
    r_h2.font.bold = True; r_h2.font.color.rgb = RED

    stalled = [
        "• stalled array: co-signer missed the approval window",
        "• System auto-escalates to Relationship Manager (Priya)",
        "• UI shows 'Priya's on it' card with direct 'Call Priya' button",
        "• Escalation path: failed co-sign → RM notification → manual override",
    ]
    bullets_box(slide, stalled, Inches(7.1), Inches(2.05), col_w, Inches(3.0), size=14)

    # Vertical divider
    add_rect(slide, Inches(6.67), Inches(1.45), Inches(0.02), Inches(5.5), LIGHT_GREY)


# ---------------------------------------------------------------------------
# Slide 9 — Workflow Architecture
# ---------------------------------------------------------------------------
def slide_09_workflows(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Workflow Architecture")
    add_red_rule(slide)

    bullets = [
        "• 11 workflows, each a renderXxx closure reading/writing top-level App state",
        "• renderClosure (~1021) — account closure with regulatory compliance steps",
        "• renderBiz (~1332) — business KYC/KYB verification",
        "• renderMandate (~1428) — signatory mandate changes with cooling-off",
        "• renderWages (~1630) — bulk wages payment (CSV import + approval)",
        "• renderLending (~1915) — business lending application",
        "• renderFX (~2018) — foreign exchange payments",
        "• renderDormancy (~2149) — dormant account reactivation",
        "• renderUnlink (~2177) — account unlinking",
        "• renderRingfence (~2310) — ring-fencing workflow",
        "• renderIdCheck (~2390) — identity verification (Voice ID, biometrics)",
        "• renderMtdSubmit (~4998) — Making Tax Digital HMRC submission",
    ]

    tb2 = add_textbox(slide, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.7))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    first = True
    for i, bullet in enumerate(bullets):
        para = tf2.paragraphs[0] if first else tf2.add_paragraph()
        first = False
        para.text = bullet; para.space_before = Pt(5)
        r = para.runs[0]; r.font.name = "Calibri"
        r.font.size  = Pt(14) if i == 0 else Pt(13)
        r.font.bold  = (i == 0)
        r.font.color.rgb = BODY_DARK


# ---------------------------------------------------------------------------
# Slide 10 — Design System
# ---------------------------------------------------------------------------
def slide_10_design_system(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Design System")
    add_red_rule(slide)

    bullets = [
        "• Brand red: #c8102e (CTAs, active states, top bar)",
        "• Background: #faf6ef (warm off-white, page/body)",
        "• Fonts: Fraunces (display headings, Google Fonts), Geist (body), Geist Mono (account numbers)",
        "• Spacing scale: 4·8·12·16·24·32·48·64·96·128 px  →  Tailwind: 1·2·3·4·6·8·12·16·24·32",
        "• Never text-gray-* or text-zinc-* — always text-stone-*",
        "• Never text-stone-400/500 on dark/red surfaces — use text-white/65 or text-red-100",
        "• One primary CTA per view: bg-[#c8102e] or bg-stone-900",
        "• num-tab CSS class: font-variant-numeric: tabular-nums — used on all monetary amounts",
        "• Inline CSS template literal (~line 779): hero-card, cool-card, anim-fade, anim-slide, shimmer, stagger-1 through stagger-7",
    ]
    bullets_box(slide, bullets, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.7))


# ---------------------------------------------------------------------------
# Slide 11 — Tech Stack
# ---------------------------------------------------------------------------
def slide_11_tech_stack(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Tech Stack")
    add_red_rule(slide)

    left_bullets = [
        "• React 18.3 — single large function component, closures as sub-components",
        "• Vite 5 — fast dev server (http://localhost:5173), production build to dist/",
        "• Tailwind CSS 3 — utility-first styling, custom stone-* palette",
        "• viteSingleFile plugin — inlines all JS/CSS into one self-contained HTML file",
        "• Lucide React — icon library",
    ]
    right_bullets = [
        "• python-pptx — documentation tooling only (not in the app)",
        "• Build output: ~870 KB HTML, ~190 KB gzip",
        "• Deployment: GitHub Pages (static hosting)",
        "• No backend, no database, no API server",
        "• Dev commands: npm run dev | npm run build | npm run preview",
    ]

    bullets_box(slide, left_bullets,  Inches(0.6), Inches(1.45), Inches(6.1), Inches(5.5), size=13)
    bullets_box(slide, right_bullets, Inches(7.1), Inches(1.45), Inches(6.1), Inches(5.5), size=13)
    add_rect(slide, Inches(6.67), Inches(1.45), Inches(0.02), Inches(5.5), LIGHT_GREY)


# ---------------------------------------------------------------------------
# Slide 12 — Security & Accessibility
# ---------------------------------------------------------------------------
def slide_12_security(prs):
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    red_bar(slide, top=True)
    add_title(slide, "Security & Accessibility Decisions")
    add_red_rule(slide)

    bullets = [
        "• No dangerouslySetInnerHTML on any dynamic content — static strings only",
        "• No focus:outline-none without focus-visible: — every bare removal is an accessibility breach",
        "• WCAG 2.1 AA compliance target — focus rings preserved for keyboard navigation",
        "• No real credentials, account numbers, API keys, or secrets in source",
        "• No git push --force — ever",
        "• Git hooks: run /ship-ready before every push — one RED finding = stand down and fix",
        "• Prototype data only — all account numbers, names, and amounts are fictional",
        "• Google Fonts is the only external network request in production",
    ]
    bullets_box(slide, bullets, Inches(0.6), Inches(1.45), Inches(12.1), Inches(5.7))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    output_path = "/home/user/santander/Santander_Architecture.pptx"
    prs = new_prs()

    builders = [
        ("Slide 1  — Cover",                     slide_01_cover),
        ("Slide 2  — Single-File Architecture",   slide_02_single_file),
        ("Slide 3  — Internal Component Order",   slide_03_component_order),
        ("Slide 4  — Hook Discipline",            slide_04_hook_discipline),
        ("Slide 5  — Navigation Model",           slide_05_navigation),
        ("Slide 6  — Entity System",              slide_06_entity_system),
        ("Slide 7  — Mandate Rules",              slide_07_mandate_rules),
        ("Slide 8  — Cooling-off & Stalled",      slide_08_cooling_stalled),
        ("Slide 9  — Workflow Architecture",      slide_09_workflows),
        ("Slide 10 — Design System",              slide_10_design_system),
        ("Slide 11 — Tech Stack",                 slide_11_tech_stack),
        ("Slide 12 — Security & Accessibility",   slide_12_security),
    ]

    for label, builder in builders:
        try:
            builder(prs)
            print(f"  [OK] {label}")
        except Exception as exc:
            print(f"  [ERROR] {label}: {exc}")
            import traceback; traceback.print_exc()
            blank_slide(prs)

    prs.save(output_path)
    print(f"\nSaved: {output_path}")
    print(f"Slides: {len(prs.slides)}")


if __name__ == "__main__":
    main()
