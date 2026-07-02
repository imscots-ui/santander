#!/usr/bin/env python3
"""Render the one-page Executive Brief (board pre-read) to PDF — house style."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
                                Table, TableStyle, Image)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

RED = colors.HexColor('#EC0000'); BOSTON = colors.HexColor('#CC0000'); INK = colors.HexColor('#1c1917')
STONE = colors.HexColor('#57534e'); LIGHT = colors.HexColor('#78716c')
HAIR = colors.HexColor('#e7e5e4'); PANEL = colors.HexColor('#FBF1EA')

ss = getSampleStyleSheet()
def S(n, **k): return ParagraphStyle(n, parent=ss['Normal'], **k)
eyebrow = S('eb', fontName='Helvetica-Bold', fontSize=8, textColor=RED, leading=10)
title   = S('ti', fontName='Helvetica-Bold', fontSize=21, textColor=INK, leading=24, spaceAfter=1)
subtitle= S('su', fontName='Helvetica', fontSize=11.5, textColor=STONE, leading=15, spaceAfter=2)
h2s     = S('h2', fontName='Helvetica-Bold', fontSize=10.5, textColor=INK, spaceBefore=7, spaceAfter=3, leading=13)
body    = S('bd', fontName='Helvetica', fontSize=9.3, textColor=INK, leading=13.2, spaceAfter=4, alignment=TA_LEFT)
statN   = S('sn', fontName='Helvetica-Bold', fontSize=17, textColor=INK, leading=19, alignment=TA_CENTER)
statL   = S('sl', fontName='Helvetica', fontSize=7.3, textColor=STONE, leading=9.5, alignment=TA_CENTER)
askN    = S('an', fontName='Helvetica-Bold', fontSize=10, textColor=RED, leading=13)
askT    = S('at', fontName='Helvetica-Bold', fontSize=9.5, textColor=INK, leading=12.5)
askB    = S('ab', fontName='Helvetica', fontSize=8.8, textColor=STONE, leading=12)
foot    = S('ft', fontName='Helvetica-Oblique', fontSize=7.5, textColor=LIGHT, leading=10)
cls     = S('cs', fontName='Helvetica-Bold', fontSize=7.5, textColor=RED, leading=10)

PAGE_W, PAGE_H = A4
MX = 18 * mm

def stat_strip(stats):
    cells = [[Paragraph(n, statN) for n, _ in stats], [Paragraph(l, statL) for _, l in stats]]
    w = (PAGE_W - 2 * MX) / len(stats)
    t = Table(cells, colWidths=[w] * len(stats))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), PANEL),
        ('LINEABOVE', (0, 0), (-1, 0), 2, RED),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, 0), 8), ('BOTTOMPADDING', (0, 1), (-1, 1), 8),
        ('TOPPADDING', (0, 1), (-1, 1), 0), ('BOTTOMPADDING', (0, 0), (-1, 0), 1)]))
    return t

def rule():
    t = Table([['']], colWidths=[PAGE_W - 2 * MX], rowHeights=[1])
    t.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.5, HAIR),
                           ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    return t

def decision_row(num, head, detail):
    return [Paragraph(num, askN), Paragraph(head, askT), Paragraph(detail, askB)]

doc = BaseDocTemplate('Santander_Executive_Brief.pdf', pagesize=A4,
                      leftMargin=MX, rightMargin=MX, topMargin=14 * mm, bottomMargin=12 * mm,
                      title='Executive Brief — Santander Business Banking Prototype',
                      author='Alan Davidson')
frame = Frame(MX, 12 * mm, PAGE_W - 2 * MX, PAGE_H - 26 * mm, id='f')

def decorate(canv, _doc):
    canv.saveState()
    canv.setFillColor(RED); canv.rect(0, PAGE_H - 4 * mm, PAGE_W, 4 * mm, stroke=0, fill=1)
    canv.setFont('Helvetica-Oblique', 7.5); canv.setFillColor(LIGHT)
    canv.drawString(MX, 7 * mm, 'Alan Davidson · Business Banking Advisor · Self-initiated · Own time')
    canv.setFont('Helvetica-Bold', 7.5); canv.setFillColor(RED)
    canv.drawRightString(PAGE_W - MX, 7 * mm, 'INTERNAL · CONFIDENTIAL')
    canv.restoreState()

doc.addPageTemplates([PageTemplate(id='p', frames=[frame], onPage=decorate)])

logo = Image('brand/santander-logo-red.png', width=40 * mm, height=40 * mm * 519 / 3000)
logo.hAlign = 'LEFT'

story = [
    logo, Spacer(1, 5 * mm),
    Paragraph('BOARD BRIEFING · FRIDAY 3 JULY 2026 · 11:00 · INTERNAL · CONFIDENTIAL', eyebrow),
    Spacer(1, 2),
    Paragraph('Executive Brief — Business Banking, Paperless', title),
    Paragraph('A working prototype that retires paper forms across seventeen banking journeys — live today, at zero build cost.', subtitle),
    Spacer(1, 4),
    stat_strip([('£137M', 'annualised opportunity (280,000 SMB customers)'),
                ('£4.9M', 'cost saving per 10k customers · year 1'),
                ('£0', 'spent to date — self-initiated, own time'),
                ('17', 'paperless workflows, live'),
                ('36', 'features across 4 areas'),
                ('0 days', 'to Phase 2 readiness')]),
    Spacer(1, 7),

    Paragraph('The problem', h2s),
    Paragraph('Every business banking service event — mandate changes, closures, bulk payments, KYC refresh — still runs on '
              'paper forms and phone calls. Each form takes 3–7 days, can be lost or mis-signed, and erodes the '
              'relationship. Tide, Starling and Monzo Business offer instant digital equivalents today.', body),

    Paragraph('What exists — today, not a proposal', h2s),
    Paragraph('A fully working front-end prototype: <b>17 step-based workflows</b> (account closure to balance '
              'certificates), <b>7 business entity types</b> with correct mandate and compliance divergence, '
              '<b>8 regulatory frameworks</b> implemented end-to-end (Consumer Duty, MLR 2017, PSD2 SCA, GDPR, DISP, '
              'SYSC 9, CCA 1974, HMRC MTD), and WCAG 2.1 AA accessibility verified by automated audit on every build. '
              'It runs in any browser with no install: <b>imscots-ui.github.io/santander</b>', body),

    Paragraph('Why now', h2s),
    Paragraph('The underlying capabilities — GOV.UK One Login, Confirmation of Payee, Open Banking consent, HMRC MTD '
              'APIs — are established utilities, not research. The prototype proves the customer experience; Phase 2 '
              'wires it to production services. Every quarter of delay is a quarter of branch visits, postal delays '
              'and competitor switching that need not happen.', body),
    Spacer(1, 2),

    Paragraph('Three decisions sought on Friday', h2s),
]

drows = [
    decision_row('01', 'Walk through the prototype', 'Thirty minutes with the live build — the workflows, the compliance paths, the dual-signature unlock. A view based on evidence, not a slide.'),
    decision_row('02', 'Commission a technical review', 'Share the Architecture deck with engineering leads. The wrap-around pattern, API contracts and 4-phase build plan are documented and ready to challenge.'),
    decision_row('03', 'Decide Phase 2 scope and timing', 'Phase 1 is complete. Phase 2 needs a sponsor, a team, and a timeline — that decision is the only thing between here and production.'),
]
dt = Table(drows, colWidths=[10 * mm, 52 * mm, (PAGE_W - 2 * MX) - 62 * mm])
dt.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LINEBELOW', (0, 0), (-1, -2), 0.5, HAIR),
    ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 8)]))
story += [dt, Spacer(1, 6)]

ev = Table([[Paragraph('EVIDENCE BASE', S('el', fontName='Helvetica-Bold', fontSize=7.5, textColor=RED, leading=10)),
             Paragraph('Technical Report v2.0 · Position Paper v2.0 · Pitch deck (16 slides) · Architecture deck (12) · '
                       'Project Record (14) · Live prototype · All classified INTERNAL · CONFIDENTIAL', foot)]],
           colWidths=[26 * mm, (PAGE_W - 2 * MX) - 26 * mm])
ev.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), PANEL), ('LINEBEFORE', (0, 0), (0, -1), 3, RED),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 9), ('RIGHTPADDING', (0, 0), (-1, -1), 9)]))
story += [ev]

doc.build(story)
print('WROTE Santander_Executive_Brief.pdf')
