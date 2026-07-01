#!/usr/bin/env python3
"""Render the Technical Report and Position Paper to .pdf from report_content."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
                                Table, TableStyle, PageBreak, ListFlowable, ListItem, KeepTogether)
from reportlab.lib.enums import TA_LEFT
import report_content as C

RED = colors.HexColor('#c8102e'); INK = colors.HexColor('#1c1917')
STONE = colors.HexColor('#57534e'); LIGHT = colors.HexColor('#78716c')
HAIR = colors.HexColor('#e7e5e4'); PANEL = colors.HexColor('#faf6ef'); ZEBRA = colors.HexColor('#faf8f5')

ss = getSampleStyleSheet()
def S(n, **k): return ParagraphStyle(n, parent=ss['Normal'], **k)
eyebrow = S('eb', fontName='Helvetica-Bold', fontSize=8, textColor=RED, spaceAfter=1, leading=10)
title   = S('ti', fontName='Helvetica-Bold', fontSize=27, textColor=INK, leading=31, spaceAfter=2)
subtitle= S('su', fontName='Helvetica', fontSize=16, textColor=STONE, leading=20, spaceAfter=3)
tagline = S('tg', fontName='Helvetica-Oblique', fontSize=10.5, textColor=LIGHT, leading=14, spaceAfter=6)
h1s     = S('h1', fontName='Helvetica-Bold', fontSize=14, textColor=INK, spaceBefore=13, spaceAfter=5, leading=17)
h2s     = S('h2', fontName='Helvetica-Bold', fontSize=11, textColor=STONE, spaceBefore=8, spaceAfter=2, leading=14)
body    = S('bd', fontName='Helvetica', fontSize=10, textColor=INK, leading=15, spaceAfter=6, alignment=TA_LEFT)
lead    = S('ld', fontName='Helvetica', fontSize=11.5, textColor=INK, leading=16.5, spaceAfter=7)
foot    = S('ft', fontName='Helvetica-Oblique', fontSize=8, textColor=LIGHT, leading=11, spaceBefore=12)
cellH   = S('ch', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white, leading=11)
cell    = S('cl', fontName='Helvetica', fontSize=8.5, textColor=INK, leading=11)
cellB   = S('cb', fontName='Helvetica-Bold', fontSize=8.5, textColor=INK, leading=11)
coLead  = S('co', fontName='Helvetica-Bold', fontSize=8.5, textColor=RED, leading=11, spaceAfter=2)
coBody  = S('cod', fontName='Helvetica', fontSize=10, textColor=INK, leading=14.5)
toc     = S('toc', fontName='Helvetica', fontSize=10, textColor=STONE, leading=15)
ctlK    = S('ck', fontName='Helvetica-Bold', fontSize=8.5, textColor=STONE, leading=11)
ctlV    = S('cv', fontName='Helvetica', fontSize=8.5, textColor=INK, leading=11)
refn    = S('rn', fontName='Helvetica', fontSize=8.5, textColor=INK, leading=12, spaceAfter=3,
            leftIndent=16, firstLineIndent=-16)

PAGE_W, PAGE_H = A4
MX = 20 * mm

def bullets(items):
    return ListFlowable([ListItem(Paragraph(t, body), leftIndent=12, value='•') for t in items],
                        bulletType='bullet', leftIndent=14, spaceAfter=4)

def tbl(headers, rows, widths):
    data = [[Paragraph(h, cellH) for h in headers]]
    for r in rows:
        data.append([Paragraph(c, cellB if i == 0 else cell) for i, c in enumerate(r)])
    t = Table(data, colWidths=[w * mm for w in widths], hAlign='LEFT', repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), INK), ('GRID', (0, 0), (-1, -1), 0.5, HAIR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7), ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, ZEBRA])]))
    return t

def callout(leadtext, text):
    inner = [Paragraph(leadtext.upper(), coLead), Paragraph(text, coBody)]
    t = Table([[inner]], colWidths=[PAGE_W - 2 * MX], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), PANEL), ('LINEBEFORE', (0, 0), (0, -1), 3, RED),
        ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 11), ('RIGHTPADDING', (0, 0), (-1, -1), 11)]))
    return KeepTogether([t, Spacer(1, 6)])

def cover_flowables(meta):
    fl = [Spacer(1, 58 * mm), Paragraph(meta['classification'], eyebrow), Spacer(1, 6),
          Paragraph(meta['title'], title), Paragraph(meta['subtitle'], subtitle),
          Paragraph(meta['tagline'], tagline), Spacer(1, 14)]
    data = [[Paragraph(k, ctlK), Paragraph(v, ctlV)] for k, v in meta['control']]
    ct = Table(data, colWidths=[43 * mm, 112 * mm], hAlign='LEFT')
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), PANEL), ('LINEABOVE', (0, 0), (-1, 0), 0.5, HAIR),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, HAIR), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8)]))
    fl += [ct, Spacer(1, 20), Paragraph('Contents', h2s)]
    fl += [Paragraph(item, toc) for item in meta['contents']]
    fl.append(PageBreak())
    return fl

def flow(meta, blocks):
    fl = cover_flowables(meta)
    for b in blocks:
        k = b[0]
        if k == 'eyebrow': fl.append(Paragraph(b[1].upper(), eyebrow))
        elif k == 'h1':
            t = (f"{b[1]} " if b[1] else '') + b[2]
            fl.append(Paragraph(t, h1s))
            fl.append(Table([['']], colWidths=[PAGE_W - 2 * MX], style=[('LINEBELOW', (0, 0), (-1, -1), 0.5, HAIR)]))
            fl.append(Spacer(1, 3))
        elif k == 'h2': fl.append(Paragraph(b[1], h2s))
        elif k == 'lead': fl.append(Paragraph(b[1], lead))
        elif k == 'p': fl.append(Paragraph(b[1], body))
        elif k == 'ul': fl.append(bullets(b[1]))
        elif k == 'callout': fl.append(callout(b[1], b[2]))
        elif k == 'table': fl += [tbl(b[1], b[2], b[3]), Spacer(1, 6)]
        elif k == 'refs':
            for n, text in b[1]:
                fl.append(Paragraph(f'<b>[{n}]</b>&nbsp;&nbsp;{text}', refn))
        elif k == 'spacer': fl.append(Spacer(1, b[1]))
    fl.append(Paragraph(C.FOOTER_NOTE, foot))
    return fl

def decorate(meta):
    def _fn(canvas, doc):
        canvas.saveState()
        if doc.page >= 2:  # skip cover
            canvas.setFont('Helvetica', 7.5); canvas.setFillColor(LIGHT)
            canvas.drawString(MX, PAGE_H - 12 * mm, meta['running'])
            canvas.setFont('Helvetica-Bold', 7.5); canvas.setFillColor(RED)
            canvas.drawRightString(PAGE_W - MX, PAGE_H - 12 * mm, meta['classification'])
            canvas.setStrokeColor(HAIR); canvas.setLineWidth(0.5)
            canvas.line(MX, PAGE_H - 13.5 * mm, PAGE_W - MX, PAGE_H - 13.5 * mm)
            canvas.setFont('Helvetica', 7.5); canvas.setFillColor(LIGHT)
            canvas.drawString(MX, 12 * mm, 'Alan Davidson  ·  Internal · Confidential')
            canvas.drawRightString(PAGE_W - MX, 12 * mm, f'Page {doc.page}')
        canvas.restoreState()
    return _fn

def render(meta, blocks, out):
    doc = BaseDocTemplate(out, pagesize=A4, topMargin=20 * mm, bottomMargin=18 * mm,
                          leftMargin=MX, rightMargin=MX)
    frame = Frame(MX, 18 * mm, PAGE_W - 2 * MX, PAGE_H - 36 * mm, id='body')
    doc.addPageTemplates([PageTemplate(id='main', frames=[frame], onPage=decorate(meta))])
    doc.build(flow(meta, blocks))
    print('WROTE', out)

render(C.TECH_META, C.TECH_BODY, 'Santander_Technical_Report.pdf')
render(C.POS_META, C.POS_BODY, 'Santander_Position_Paper.pdf')
