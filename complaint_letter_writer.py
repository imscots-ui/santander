#!/usr/bin/env python3
"""
Santander Complaint Writer — Evelyn workflow (Angus format)
============================================================
Usage:  python3 complaint_letter_writer.py

Trigger phrases (select at the menu):
  1. evidence to support complaint stage 1
  2. evidence to support complaint escalation
  3. Uphold - stage 1 letter
  4. Declined - stage 1 letter
  5. Escalation - resolution changed
  6. Escalation - no change in original resolution
  7. Escalation - no change in escalated complaint
  8. Dual mode: evidence to support complaint stage 1 + Uphold - stage 1 letter
  9. Dual mode: evidence to support complaint stage 1 + Declined - stage 1 letter

Output: [REF]_[SURNAME]_[TRIGGER]_[DATE].docx
"""

import sys, re
from datetime import date, timedelta
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ── Brand ──────────────────────────────────────────────────────────────────────
RED   = RGBColor(0xC8, 0x10, 0x2E)
BLACK = RGBColor(0x1A, 0x1A, 0x1A)
GREY  = RGBColor(0x66, 0x66, 0x66)
LGREY = RGBColor(0xAA, 0xAA, 0xAA)

# ── Bank holidays (England & Wales 2025–2027) ──────────────────────────────────
BH = {
    date(2025,1,1), date(2025,4,18), date(2025,4,21),
    date(2025,5,5), date(2025,5,26), date(2025,8,25),
    date(2025,12,25), date(2025,12,26),
    date(2026,1,1), date(2026,4,3), date(2026,4,6),
    date(2026,5,4), date(2026,5,25), date(2026,8,31),
    date(2026,12,25), date(2026,12,28),
    date(2027,1,1), date(2027,3,26), date(2027,3,29),
    date(2027,5,3), date(2027,5,31), date(2027,8,30),
    date(2027,12,27), date(2027,12,28),
}

def biz_add(d, n):
    while n:
        d += timedelta(1)
        if d.weekday() < 5 and d not in BH:
            n -= 1
    return d

MONTHS = ["January","February","March","April","May","June",
          "July","August","September","October","November","December"]

def fdate(d):
    return f"{d.day} {MONTHS[d.month-1]} {d.year}"

def fmoney(n):
    if n == 0: return "£0.00"
    if n == int(n): return f"£{int(n):,}"
    return f"£{n:,.2f}"

# ── Terminal helpers ───────────────────────────────────────────────────────────

def hr():  print("\n" + "═" * 64)
def hr2(): print("─" * 64)
def h(t):  hr(); print(f"  {t}"); hr2()

def ask(prompt, default=None):
    hint = f" [{default}]" if default else ""
    v = input(f"  {prompt}{hint}: ").strip()
    return v if v else (default or "")

def pick(prompt, options):
    print(f"\n  {prompt}")
    for i, o in enumerate(options, 1):
        print(f"  {i:>2}.  {o}")
    while True:
        raw = input("  Choice: ").strip()
        if raw.isdigit() and 1 <= int(raw) <= len(options):
            n = int(raw) - 1
            return n, options[n]
        print("  → Invalid.")

def getdate(prompt, default=None):
    d0 = default or date.today()
    while True:
        v = input(f"  {prompt} (DD/MM/YYYY) [{d0:%d/%m/%Y}]: ").strip()
        if not v: return d0
        try:
            p = v.split("/")
            return date(int(p[2]), int(p[1]), int(p[0]))
        except:
            print("  → DD/MM/YYYY  e.g. 10/06/2026")

def getmoney(prompt):
    while True:
        v = input(f"  {prompt} £").strip().replace(",", "")
        if not v: return 0.0
        try:    return float(v)
        except: print("  → Number e.g. 150.00  (or press Enter for £0)")

def yn(prompt):
    return input(f"  {prompt} (y/n): ").strip().lower().startswith("y")

def block(prompt):
    """Collect a multi-line text block. Blank line to finish."""
    print(f"\n  {prompt}")
    print("  (blank line when done)")
    lines = []
    while True:
        v = input("  > ").rstrip()
        if not v and lines: break
        if v: lines.append(v)
    return " ".join(lines)

# ── Trigger definitions ────────────────────────────────────────────────────────

TRIGGERS = [
    ("complaint_s1",    "evidence to support complaint stage 1"),
    ("complaint_esc",   "evidence to support complaint escalation"),
    ("letter_uphold",   "Uphold - stage 1 letter"),
    ("letter_decline",  "Declined - stage 1 letter"),
    ("letter_esc_chg",  "Escalation - resolution changed"),
    ("letter_esc_same", "Escalation - no change in original resolution"),
    ("letter_esc_hold", "Escalation - no change in escalated complaint"),
    ("dual_uphold",     "Dual mode: evidence stage 1  +  Uphold letter"),
    ("dual_decline",    "Dual mode: evidence stage 1  +  Declined letter"),
]
TRIGGER_IDS    = [k for k, _ in TRIGGERS]
TRIGGER_LABELS = [l for _, l in TRIGGERS]

# ── Collect: case header (common to all) ──────────────────────────────────────

def collect_header():
    d = {}
    h("CASE HEADER")
    d["received"]    = getdate("Date complaint received")
    d["letter_date"] = getdate("Letter date", default=date.today())

    d3  = biz_add(d["received"],  3)
    d56 = biz_add(d["received"], 56)
    print(f"\n  D+3  summary resolution due:  {fdate(d3)}")
    print(f"  D+56 final response due:      {fdate(d56)}")

    _, d["title"] = pick("Title", ["Mr","Mrs","Ms","Miss","Dr","Mx","Rev"])
    d["first"]         = ask("First name")
    d["last"]          = ask("Last name")
    print("\n  Address (Enter to skip a line):")
    addr = []
    for label in ["Line 1","Line 2","Town / City","County","Postcode"]:
        v = ask(label)
        if v: addr.append(v)
    d["address"]       = addr
    d["account_last4"] = ask("Last 4 digits of account", default="XXXX")
    d["ref"]           = ask("Complaint reference", default=f"COMP-{date.today().year}-001")
    d["handler"]       = ask("Handler name")
    d["team"]          = ask("Team", default="Business Banking Complaints")
    return d

# ── Collect: Stage 1 complaint formation (5 questions) ───────────────────────

def collect_stage1_complaint():
    h("STAGE 1  —  5-QUESTION COMPLAINT RECORD")
    print("  Enter answers to each question. These become the complaint record.")
    q = {}
    q["q1"] = block("1. What is the customer saying has happened?")
    q["q2"] = block("2. What have you done to investigate the issue raised by the customer?")
    q["q3"] = block("3. What actions have you completed for the customer?")
    q["q4"] = block("4. Why did you take the action detailed above?")
    q["q5"] = block("5. Payments  (enter 'None' if no financial remedy)")
    return q

# ── Collect: Escalation complaint formation (4 questions) ────────────────────

def collect_escalation_complaint():
    h("ESCALATION  —  4-QUESTION COMPLAINT RECORD")
    q = {}
    q["q1"] = block("1. Why has the customer come back to discuss this complaint again?")
    q["q2"] = block("2. Why did you contact the customer again?")
    q["q3"] = block("3. What actions have you taken for this customer as a result of their complaint?")
    q["q4"] = block("4. What changes have you made to the resolution, and why?")
    q["q5"] = block("5. Payments  (enter 'None' if no financial remedy)")
    return q

# ── Collect: letter-specific fields ───────────────────────────────────────────

def collect_letter_fields(mode):
    """Collect only the fields needed for the selected letter type."""
    lf = {}

    if mode in ("letter_uphold", "dual_uphold"):
        h("UPHOLD LETTER  —  Sorry · Cause · Impact · Fix · Payment")
        lf["sorry"]   = block("Sorry — empathetic opening (what has been frustrating for them?)")
        lf["cause"]   = block("Cause — what actually happened / what we found")
        lf["impact"]  = block("Impact — how did it affect the customer?")
        lf["fix"]     = block("Fix — what have you done / are doing to put it right?")
        lf["payment"] = getmoney("Payment amount (0 if none)")
        if lf["payment"]:
            lf["payment_detail"] = ask("Payment detail (e.g. 'refund of the monthly fee')")
        lf["fos_eligible"] = yn("Include FOS referral rights?")

    elif mode in ("letter_decline", "dual_decline"):
        h("DECLINED LETTER  —  Sorry · Not our fault · One-line reason · Full explanation")
        lf["sorry"]    = block("Sorry — empathetic opening")
        lf["reason1"]  = block("One-line reason — clear single sentence why we can't uphold")
        lf["reason2"]  = block("Full explanation — expanded detail / policy / evidence")
        lf["fos_eligible"] = yn("Include FOS referral rights?")

    elif mode == "letter_esc_chg":
        h("ESCALATION  —  RESOLUTION CHANGED")
        lf["why_back"]   = block("Why has the customer come back / what have they raised?")
        lf["new_view"]   = block("New position — what have you reconsidered and why?")
        lf["new_action"] = block("New action — what are you now doing to put it right?")
        lf["payment"]    = getmoney("Payment amount (0 if none)")
        if lf["payment"]:
            lf["payment_detail"] = ask("Payment detail")
        lf["fos_eligible"] = yn("Include FOS referral rights?")

    elif mode in ("letter_esc_same", "letter_esc_hold"):
        h("ESCALATION  —  NO CHANGE")
        lf["why_back"]    = block("Why has the customer come back / what have they raised?")
        lf["maintain"]    = block("Why you are maintaining the original decision")
        lf["fos_eligible"] = yn("Include FOS referral rights?")

    return lf

# ── Document helpers ───────────────────────────────────────────────────────────

def set_font(run, size=11, bold=False, italic=False, colour=None):
    run.font.name   = "Calibri"
    run.font.size   = Pt(size)
    run.font.bold   = bold
    run.font.italic = italic
    if colour: run.font.color.rgb = colour

def para(doc, text="", size=11, bold=False, italic=False, colour=None,
         align=WD_ALIGN_PARAGRAPH.LEFT, sb=0, sa=6):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(sb)
    p.paragraph_format.space_after  = Pt(sa)
    if text:
        r = p.add_run(text)
        set_font(r, size, bold, italic, colour)
    return p

def rule(doc, colour="C8102E", sz=18):
    p = doc.add_paragraph()
    bdr = OxmlElement("w:pBdr")
    b   = OxmlElement("w:bottom")
    b.set(qn("w:val"),   "single")
    b.set(qn("w:sz"),    str(sz))
    b.set(qn("w:space"), "1")
    b.set(qn("w:color"), colour)
    bdr.append(b)
    p._p.get_or_add_pPr().append(bdr)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(0)

def shade_cell(cell, hex_colour):
    pr = cell._tc.get_or_add_tcPr()
    s  = OxmlElement("w:shd")
    s.set(qn("w:fill"), hex_colour)
    s.set(qn("w:val"),  "clear")
    pr.append(s)

def section_heading(doc, text):
    """Evelyn-style numbered section heading — headings must not change."""
    para(doc, text, size=11, bold=True, colour=RED, sb=10, sa=3)

def answer_block(doc, text):
    para(doc, text, size=11, sb=0, sa=8)

# ── Build: Stage 1 complaint record ───────────────────────────────────────────

def build_complaint_s1(doc, hdr, q):
    rule(doc, "C8102E", 36)
    para(doc, "Santander", size=22, bold=True, colour=RED, sb=6, sa=2)
    para(doc, "Business Banking  ·  Complaint Record  —  Stage 1", size=10, colour=GREY, sa=4)
    rule(doc, "BBBBBB", 4)

    para(doc, f"Reference:  {hdr['ref']}", size=10, sb=8, sa=1)
    para(doc, f"Customer:   {hdr['title']} {hdr['first']} {hdr['last']}  "
              f"  Account: ****{hdr['account_last4']}", size=10, sa=1)
    para(doc, f"Received:   {fdate(hdr['received'])}    "
              f"Handler: {hdr['handler']}", size=10, sa=12)
    rule(doc, "CCCCCC", 4)

    section_heading(doc, "1.  What is the customer saying has happened?")
    answer_block(doc, q["q1"])

    section_heading(doc, "2.  What have you done to investigate the issue raised by the customer?")
    answer_block(doc, q["q2"])

    section_heading(doc, "3.  What actions have you completed for the customer?")
    answer_block(doc, q["q3"])

    section_heading(doc, "4.  Why did you take the action detailed above?")
    answer_block(doc, q["q4"])

    section_heading(doc, "5.  Payments")
    answer_block(doc, q["q5"])

    rule(doc, "C8102E", 8)
    para(doc, f"Handler: {hdr['handler']}  ·  {hdr['team']}  ·  "
              f"Santander UK plc", size=8, colour=LGREY, sb=4, sa=2)

# ── Build: Escalation complaint record ────────────────────────────────────────

def build_complaint_esc(doc, hdr, q):
    rule(doc, "C8102E", 36)
    para(doc, "Santander", size=22, bold=True, colour=RED, sb=6, sa=2)
    para(doc, "Business Banking  ·  Complaint Record  —  Escalation", size=10, colour=GREY, sa=4)
    rule(doc, "BBBBBB", 4)

    para(doc, f"Reference:  {hdr['ref']}", size=10, sb=8, sa=1)
    para(doc, f"Customer:   {hdr['title']} {hdr['first']} {hdr['last']}  "
              f"  Account: ****{hdr['account_last4']}", size=10, sa=1)
    para(doc, f"Received:   {fdate(hdr['received'])}    "
              f"Handler: {hdr['handler']}", size=10, sa=12)
    rule(doc, "CCCCCC", 4)

    section_heading(doc, "1.  Why has the customer come back to discuss this complaint again?")
    answer_block(doc, q["q1"])

    section_heading(doc, "2.  Why did you contact the customer again?")
    answer_block(doc, q["q2"])

    section_heading(doc, "3.  What actions have you taken for this customer as a result of their complaint?")
    answer_block(doc, q["q3"])

    section_heading(doc, "4.  What changes have you made to the resolution, and why?")
    answer_block(doc, q["q4"])

    section_heading(doc, "5.  Payments")
    answer_block(doc, q["q5"])

    rule(doc, "C8102E", 8)
    para(doc, f"Handler: {hdr['handler']}  ·  {hdr['team']}  ·  "
              f"Santander UK plc", size=8, colour=LGREY, sb=4, sa=2)

# ── Build: Letter header block (shared) ───────────────────────────────────────

def letter_header(doc, hdr, label):
    rule(doc, "C8102E", 36)
    para(doc, "Santander", size=22, bold=True, colour=RED, sb=6, sa=2)
    para(doc, f"Business Banking  ·  {label}", size=10, colour=GREY, sa=4)
    rule(doc, "BBBBBB", 4)

    para(doc, "Santander UK plc", size=10, colour=GREY, sb=8, sa=1)
    para(doc, "Complaints Team", size=10, colour=GREY, sa=1)
    para(doc, "PO Box 1109, Bradford  BD1 5WG", size=10, colour=GREY, sa=6)
    para(doc, f"Date:       {fdate(hdr['letter_date'])}", size=10, sa=1)
    para(doc, f"Reference:  {hdr['ref']}", size=10, sa=1)
    para(doc, f"Account:    ****{hdr['account_last4']}", size=10, colour=GREY, sa=14)

    for line in [f"{hdr['title']} {hdr['first']} {hdr['last']}"] + hdr["address"]:
        if line.strip():
            para(doc, line, size=11, sa=2)
    para(doc, "", sa=12)

    para(doc, f"Dear {hdr['title']} {hdr['last']},", size=11, bold=True, sa=10)

def letter_footer(doc, hdr, fos_eligible, today, stage="stage1"):
    if fos_eligible:
        para(doc, "", sa=4)
        rule(doc, "EEEEEE", 4)
        para(doc, "Your right to refer to the Financial Ombudsman Service",
             size=10, bold=True, colour=GREY, sb=8, sa=4)

        if stage == "final":
            fos_body = (
                f"As this is our final response, you may now refer your complaint to the "
                f"Financial Ombudsman Service (FOS) if you remain dissatisfied. You must do so "
                f"within six months of the date of this letter ({fdate(today)}). After that "
                f"date the FOS may not be able to consider your complaint."
            )
        else:
            fos_body = (
                "If you remain dissatisfied, you have the right to refer your complaint to "
                "the Financial Ombudsman Service. As we have issued our decision above, you "
                "may refer at any time."
            )
        para(doc, fos_body, size=10, colour=GREY, sa=6)

        tbl = doc.add_table(rows=1, cols=1)
        tbl.style = "Table Grid"
        cell = tbl.rows[0].cells[0]
        shade_cell(cell, "F7F7F7")
        for text, bold_it in [
            ("Financial Ombudsman Service", True),
            ("Freephone: 0800 023 4567", False),
            ("www.financial-ombudsman.org.uk", False),
        ]:
            cp = cell.add_paragraph()
            cp.paragraph_format.space_after = Pt(2)
            r = cp.add_run(text)
            set_font(r, 10, bold=bold_it, colour=GREY)
        para(doc, "", sa=10)

    para(doc, "Yours sincerely,", size=11, sb=4, sa=24)
    para(doc, hdr["handler"], size=11, bold=True, sa=2)
    para(doc, hdr["team"],    size=11, colour=GREY, sa=2)
    para(doc, "Santander UK plc", size=11, colour=GREY, sa=2)
    para(doc,
        "Santander UK plc is authorised by the Prudential Regulation Authority and "
        "regulated by the Financial Conduct Authority and the Prudential Regulation "
        "Authority (FRN: 106054).",
        size=9, colour=LGREY, sa=16)
    rule(doc, "C8102E", 8)
    for line in [
        "Santander UK plc  ·  Registered in England and Wales No. 2294747",
        "Registered Office: 2 Triton Square, Regent's Place, London  NW1 3AN",
    ]:
        para(doc, line, size=8, colour=LGREY, sb=2, sa=1)

# ── Build: Uphold letter ───────────────────────────────────────────────────────

def build_letter_uphold(doc, hdr, lf, subject_suffix=""):
    letter_header(doc, hdr, "Complaints  —  Upheld")

    para(doc, f"Your complaint  —  Reference {hdr['ref']}{subject_suffix}",
         size=12, bold=True, colour=RED, sa=12)

    # Sorry
    para(doc, lf["sorry"], size=11, sa=10)

    # Cause → Impact
    para(doc, lf["cause"], size=11, sa=6)
    para(doc, lf["impact"], size=11, sa=10)

    # Fix
    para(doc, lf["fix"], size=11, sa=10)

    # Payment
    if lf.get("payment", 0):
        pay_text = (
            f"I have arranged for {fmoney(lf['payment'])} to be credited to your account"
        )
        if lf.get("payment_detail"):
            pay_text += f" ({lf['payment_detail']})"
        pay_text += " within 5 working days."
        para(doc, pay_text, size=11, sa=10)

    # Closing
    para(doc,
        "I hope this resolves things for you. If you have any further questions, "
        "please don't hesitate to contact me, quoting your reference above.",
        size=11, sa=10)

    letter_footer(doc, hdr, lf.get("fos_eligible", False), hdr["letter_date"])

# ── Build: Declined letter ────────────────────────────────────────────────────

def build_letter_decline(doc, hdr, lf, subject_suffix=""):
    letter_header(doc, hdr, "Complaints  —  Declined")

    para(doc, f"Your complaint  —  Reference {hdr['ref']}{subject_suffix}",
         size=12, bold=True, colour=RED, sa=12)

    # Sorry
    para(doc, lf["sorry"], size=11, sa=10)

    # One-line reason
    para(doc, lf["reason1"], size=11, sa=6)

    # Full explanation
    para(doc, lf["reason2"], size=11, sa=10)

    # Standard closing for decline
    para(doc,
        "While I appreciate this isn't the outcome you hoped for, I'm satisfied "
        "we've acted correctly and fairly.",
        size=11, sa=10)

    letter_footer(doc, hdr, lf.get("fos_eligible", False), hdr["letter_date"])

# ── Build: Escalation — resolution changed ────────────────────────────────────

def build_letter_esc_changed(doc, hdr, lf):
    letter_header(doc, hdr, "Complaints  —  Escalation  —  Resolution Changed")

    para(doc, f"Your complaint  —  Reference {hdr['ref']}  —  Escalation response",
         size=12, bold=True, colour=RED, sa=12)

    para(doc,
        "Thank you for coming back to us. I've taken the time to re-review your "
        "complaint in full, including the points you have raised since our last response.",
        size=11, sa=10)

    para(doc, lf["why_back"], size=11, sa=10)

    para(doc,
        "Having reconsidered the information available to me, I've updated my position.",
        size=11, sa=6)
    para(doc, lf["new_view"], size=11, sa=10)

    para(doc, lf["new_action"], size=11, sa=10)

    if lf.get("payment", 0):
        pay_text = (
            f"I have arranged for {fmoney(lf['payment'])} to be credited to your account"
        )
        if lf.get("payment_detail"):
            pay_text += f" ({lf['payment_detail']})"
        pay_text += " within 5 working days."
        para(doc, pay_text, size=11, sa=10)

    para(doc,
        "I'm sorry it has taken this further contact to resolve this for you. "
        "If you have any further questions, please don't hesitate to get in touch.",
        size=11, sa=10)

    letter_footer(doc, hdr, lf.get("fos_eligible", False), hdr["letter_date"],
                  stage="final")

# ── Build: Escalation — no change ────────────────────────────────────────────

def build_letter_esc_same(doc, hdr, lf, label):
    letter_header(doc, hdr, f"Complaints  —  Escalation  —  {label}")

    para(doc, f"Your complaint  —  Reference {hdr['ref']}  —  Escalation response",
         size=12, bold=True, colour=RED, sa=12)

    para(doc,
        "Thank you for coming back to us. I've taken the time to re-review your "
        "complaint in full, including the points you have raised since our last response.",
        size=11, sa=10)

    para(doc, lf["why_back"], size=11, sa=10)

    para(doc, lf["maintain"], size=11, sa=10)

    para(doc,
        "I understand this will be disappointing, but having reviewed everything "
        "available to me, I remain satisfied that our original decision was correct "
        "and that we've acted fairly throughout.",
        size=11, sa=10)

    letter_footer(doc, hdr, lf.get("fos_eligible", False), hdr["letter_date"],
                  stage="final")

# ── Page break between sections (dual mode) ───────────────────────────────────

def page_break(doc):
    p = doc.add_paragraph()
    r = p.add_run()
    r.add_break(OxmlElement("w:br") if False else
                __import__("docx.oxml.ns", fromlist=["qn"]) and None or p.add_run())
    # Use Word page break via XML
    p2 = doc.add_paragraph()
    p2.runs  # ensure paragraph exists
    from docx.oxml import OxmlElement as OE
    br = OE("w:r")
    brEl = OE("w:br")
    brEl.set(qn("w:type"), "page")
    br.append(brEl)
    p2._p.append(br)

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    try:
        print("\n")
        h("SANTANDER COMPLAINT WRITER  ·  Evelyn workflow")
        print()
        print("  Enter case details when prompted. The trigger phrase")
        print("  determines what gets generated.")
        print()

        # Select trigger first so user knows what info they need
        idx, trigger_label = pick("Select trigger phrase", TRIGGER_LABELS)
        mode = TRIGGER_IDS[idx]

        # Header always needed
        hdr = collect_header()

        # Complaint formation
        if mode in ("complaint_s1", "dual_uphold", "dual_decline"):
            q = collect_stage1_complaint()
        elif mode == "complaint_esc":
            q = collect_escalation_complaint()
        else:
            q = None

        # Letter fields
        if mode in ("letter_uphold", "letter_decline",
                    "letter_esc_chg", "letter_esc_same", "letter_esc_hold",
                    "dual_uphold", "dual_decline"):
            lf = collect_letter_fields(mode)
        else:
            lf = None

        # ── Build document ────────────────────────────────────────────────────
        doc = Document()
        for s in doc.sections:
            s.top_margin    = Cm(2.0)
            s.bottom_margin = Cm(2.0)
            s.left_margin   = Cm(2.5)
            s.right_margin  = Cm(2.5)

        if mode == "complaint_s1":
            build_complaint_s1(doc, hdr, q)
            slug = "COMPLAINT_S1"

        elif mode == "complaint_esc":
            build_complaint_esc(doc, hdr, q)
            slug = "COMPLAINT_ESC"

        elif mode == "letter_uphold":
            build_letter_uphold(doc, hdr, lf)
            slug = "UPHOLD"

        elif mode == "letter_decline":
            build_letter_decline(doc, hdr, lf)
            slug = "DECLINED"

        elif mode == "letter_esc_chg":
            build_letter_esc_changed(doc, hdr, lf)
            slug = "ESC_CHANGED"

        elif mode == "letter_esc_same":
            build_letter_esc_same(doc, hdr, lf, "No Change in Original Resolution")
            slug = "ESC_NO_CHANGE"

        elif mode == "letter_esc_hold":
            build_letter_esc_same(doc, hdr, lf, "No Change in Escalated Complaint")
            slug = "ESC_NO_CHANGE_2"

        elif mode == "dual_uphold":
            build_complaint_s1(doc, hdr, q)
            # page break
            p = doc.add_paragraph()
            from docx.oxml import OxmlElement as OE
            run_el = OE("w:r")
            br_el  = OE("w:br")
            br_el.set(qn("w:type"), "page")
            run_el.append(br_el)
            p._p.append(run_el)
            build_letter_uphold(doc, hdr, lf)
            slug = "COMPLAINT_S1_UPHOLD"

        elif mode == "dual_decline":
            build_complaint_s1(doc, hdr, q)
            p = doc.add_paragraph()
            from docx.oxml import OxmlElement as OE
            run_el = OE("w:r")
            br_el  = OE("w:br")
            br_el.set(qn("w:type"), "page")
            run_el.append(br_el)
            p._p.append(run_el)
            build_letter_decline(doc, hdr, lf)
            slug = "COMPLAINT_S1_DECLINED"

        # ── Save ──────────────────────────────────────────────────────────────
        safe_ref  = re.sub(r"[^\w\-]", "", hdr["ref"])
        safe_surn = re.sub(r"\W",      "", hdr["last"]).upper()
        dt        = hdr["letter_date"].strftime("%Y%m%d")
        filename  = f"{safe_ref}_{safe_surn}_{slug}_{dt}.docx"

        doc.save(filename)
        print(f"\n  ✓  Saved: {filename}")
        print(f"     {hdr['title']} {hdr['first']} {hdr['last']}  ·  {hdr['ref']}")
        print(f"     Trigger: {trigger_label}")
        print()

    except (KeyboardInterrupt, EOFError):
        print("\n\n  Cancelled.")
        sys.exit(0)


if __name__ == "__main__":
    main()
