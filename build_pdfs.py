#!/usr/bin/env python3
"""
Convert the Santander .docx papers to PDF using reportlab (no LibreOffice).
Reads each .docx in document order and renders a faithful PDF: classification
banner, title block, red section rules, red-header zebra tables, bullets,
abstract box and references.

Usage: python3 build_pdfs.py
"""
from xml.sax.saxutils import escape
from docx import Document
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph
from docx.table import Table
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph as P, Spacer,
                                Table as RLTable, TableStyle, HRFlowable)

RED    = colors.HexColor('#C8102E'); DARK = colors.HexColor('#1A1A1A')
GREY   = colors.HexColor('#666666'); LGREY = colors.HexColor('#999999')
ZEBRA  = colors.HexColor('#F7F7F6'); ABFILL = colors.HexColor('#F7F2F0')
GRIDC  = colors.HexColor('#E0DEDB')
CONTENT_W = 16.4 * cm

S = {
    'title':  ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=17, leading=21, textColor=DARK, spaceAfter=6),
    'byname': ParagraphStyle('byname', fontName='Helvetica-Bold', fontSize=10.5, leading=13, textColor=DARK),
    'org':    ParagraphStyle('org', fontName='Helvetica', fontSize=9.5, leading=12, textColor=GREY),
    'doct':   ParagraphStyle('doct', fontName='Helvetica-Oblique', fontSize=9.5, leading=12, textColor=RED, spaceAfter=8),
    'h1':     ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=13.5, leading=16, textColor=DARK, spaceBefore=12, spaceAfter=2),
    'h2':     ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=RED, spaceBefore=8, spaceAfter=2),
    'body':   ParagraphStyle('body', fontName='Helvetica', fontSize=9.5, leading=13, textColor=DARK, spaceAfter=5, alignment=4),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=9.5, leading=13, textColor=DARK, leftIndent=14, spaceAfter=3),
    'kw':     ParagraphStyle('kw', fontName='Helvetica-Oblique', fontSize=8.5, leading=11, textColor=GREY, spaceAfter=6),
    'cap':    ParagraphStyle('cap', fontName='Helvetica-Oblique', fontSize=8, leading=10, textColor=GREY, spaceAfter=8),
    'ab':     ParagraphStyle('ab', fontName='Helvetica', fontSize=9, leading=12.5, textColor=DARK, alignment=4),
    'cellh':  ParagraphStyle('cellh', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white),
    'cell':   ParagraphStyle('cell', fontName='Helvetica', fontSize=8, leading=10, textColor=DARK),
    'ref':    ParagraphStyle('ref', fontName='Helvetica', fontSize=8, leading=10.5, textColor=DARK, leftIndent=16, firstLineIndent=-16, spaceAfter=2),
    'banner': ParagraphStyle('banner', fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=colors.white, alignment=1),
    'foot':   ParagraphStyle('foot', fontName='Helvetica-Oblique', fontSize=7.5, leading=10, textColor=LGREY, alignment=1, spaceBefore=6),
}

def first_run(par):
    for r in par.runs:
        sz = r.font.size.pt if r.font.size else None
        return sz, bool(r.font.bold), bool(r.font.italic)
    return None, False, False

def is_red(par):
    for r in par.runs:
        c = r.font.color
        if c is not None and c.rgb is not None and str(c.rgb).upper() == 'C8102E':
            return True
    return False

def banner_flow(text):
    t = RLTable([[P(escape(text), S['banner'])]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), DARK),
                           ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
    return t

def abstract_flow(text):
    label, _, rest = text.partition('.')
    body = f'<b>{escape(label)}.</b> {escape(rest.strip())}'
    t = RLTable([[P(body, S['ab'])]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),ABFILL),
                           ('LINEBEFORE',(0,0),(0,-1),3,RED),
                           ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),
                           ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10)]))
    return t

def data_table_flow(rows):
    header = [P(escape(c), S['cellh']) for c in rows[0]]
    body = [[P(escape(c), S['cell']) for c in r] for r in rows[1:]]
    data = [header] + body
    weights = [max(4, len(h)) for h in rows[0]]
    tot = sum(weights)
    widths = [CONTENT_W * w / tot for w in weights]
    t = RLTable(data, colWidths=widths, repeatRows=1)
    st = [('BACKGROUND',(0,0),(-1,0),RED),
          ('GRID',(0,0),(-1,-1),0.4,GRIDC),
          ('VALIGN',(0,0),(-1,-1),'TOP'),
          ('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3),
          ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5)]
    for i in range(1, len(data)):
        if i % 2 == 1:
            st.append(('BACKGROUND',(0,i),(-1,i),ZEBRA))
    t.setStyle(TableStyle(st))
    return t

def convert(docx_path, pdf_path):
    doc = Document(docx_path)
    flow = []
    for child in doc.element.body.iterchildren():
        if child.tag == qn('w:p'):
            par = Paragraph(child, doc)
            txt = par.text.strip()
            if not txt:
                continue
            sname = par.style.name if par.style else 'Normal'
            sz, bold, ital = first_run(par)
            red = is_red(par)
            if sname and 'Bullet' in sname:
                flow.append(P('•&nbsp;&nbsp;' + escape(txt), S['bullet']))
            elif sz and sz >= 16:
                flow.append(P(escape(txt), S['title']))
            elif sz and 13 <= sz < 16 and bold:
                flow.append(P(escape(txt), S['h1']))
                flow.append(HRFlowable(width='100%', thickness=1, color=RED, spaceBefore=1, spaceAfter=4))
            elif sz and 11 <= sz < 13 and bold:
                flow.append(P(escape(txt), S['h2'] if red else S['byname']))
            elif sz and 9.0 <= sz <= 10.0 and red and ital:
                flow.append(P(escape(txt), S['doct']))
            elif sz and 9.0 <= sz <= 10.0 and not bold and not red and not ital:
                flow.append(P(escape(txt), S['org']))
            elif ital and sz and sz <= 9 and txt.lower().startswith('keywords'):
                flow.append(P(escape(txt), S['kw']))
            elif txt.startswith('[') and sz and sz <= 8.6:
                flow.append(P(escape(txt), S['ref']))
            elif ital and sz and sz <= 8.2:
                flow.append(P(escape(txt), S['foot']))
            elif ital and sz and sz <= 9:
                flow.append(P(escape(txt), S['cap']))
            else:
                flow.append(P(escape(txt), S['body']))
        elif child.tag == qn('w:tbl'):
            tbl = Table(child, doc)
            rows = [[c.text.strip() for c in row.cells] for row in tbl.rows]
            if len(rows[0]) == 1:
                cell = rows[0][0]
                if 'CONFIDENTIAL' in cell.upper() and len(cell) < 40:
                    flow.append(banner_flow(cell)); flow.append(Spacer(1, 8))
                else:
                    flow.append(abstract_flow(cell)); flow.append(Spacer(1, 6))
            else:
                flow.append(Spacer(1, 2)); flow.append(data_table_flow(rows)); flow.append(Spacer(1, 4))
    d = SimpleDocTemplate(pdf_path, pagesize=A4,
                          leftMargin=2.4*cm, rightMargin=2.4*cm, topMargin=2.0*cm, bottomMargin=1.8*cm,
                          title=docx_path.split('/')[-1].replace('.docx',''), author='Alan Davidson')
    n = len(flow)
    d.build(flow)
    print('PDF →', pdf_path, '(%d flowables)' % n)

if __name__ == '__main__':
    for src, dst in [
        ('/home/user/santander/Santander_Technical_Report.docx', '/home/user/santander/Santander_Technical_Report.pdf'),
        ('/home/user/santander/Santander_Position_Paper.docx',   '/home/user/santander/Santander_Position_Paper.pdf'),
    ]:
        convert(src, dst)
