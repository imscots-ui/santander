import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const STATUS_COLOR = {
  'Not Started': { bg: '#F4F7FB', color: '#5A7090' },
  'In Progress':  { bg: '#FEF3C7', color: '#92400E' },
  'Submitted':    { bg: '#EEF2F8', color: '#1E40AF' },
  'Approved':     { bg: '#D1FAE5', color: '#065F46' },
};

const LEVEL_COLOR = { Bronze: '#92400E', Silver: '#5A7090', Gold: '#C8A032' };
const LEVEL_BG    = { Bronze: '#FEF3C7', Silver: '#F4F7FB', Gold: '#FFF8E7' };

const LEVEL_SECTIONS = {
  Bronze: ['Volunteering', 'Physical', 'Skill', 'Expedition'],
  Silver: ['Volunteering', 'Physical', 'Skill', 'Expedition'],
  Gold:   ['Volunteering', 'Physical', 'Skill', 'Expedition', 'Residential'],
};

const LEVEL_REQUIREMENTS = {
  Bronze: {
    Volunteering: '3 months',
    Physical:     '3 months',
    Skill:        '3 months',
    Expedition:   '2 days / 1 night',
  },
  Silver: {
    Volunteering: '6 months',
    Physical:     '6 months (or 3 if new)',
    Skill:        '6 months (or 3 if new)',
    Expedition:   '3 days / 2 nights',
  },
  Gold: {
    Volunteering: '12 months',
    Physical:     '12 months (or 6 if new)',
    Skill:        '12 months (or 6 if new)',
    Expedition:   '4 days / 3 nights',
    Residential:  '5 days away from home',
  },
};

const DOFE_SEED = [
  {
    id: 'd1', cadetId: 'c02', cadet: 'Thomas, M', level: 'Silver', overallStatus: 'In Progress', startDate: '2025-09-01',
    sections: {
      Volunteering: { activity: 'Befriending elderly residents — Johnstone Care Home',     startDate: '2025-09-01', targetDate: '2026-03-01', status: 'Approved',    months: 6 },
      Physical:     { activity: 'Swimming club — competitive training',                     startDate: '2025-09-01', targetDate: '2026-03-01', status: 'Approved',    months: 6 },
      Skill:        { activity: 'Guitar — Grade 3 preparation',                             startDate: '2025-09-01', targetDate: '2026-03-01', status: 'Submitted',   months: 6 },
      Expedition:   { activity: 'Silver qualifying expedition — Tinto Hill, Lanarkshire',   startDate: '2026-06-27', targetDate: '2026-06-28', status: 'In Progress', months: null },
    },
  },
  {
    id: 'd2', cadetId: 'c01', cadet: 'Mitchell, S', level: 'Gold', overallStatus: 'In Progress', startDate: '2025-10-01',
    sections: {
      Volunteering: { activity: 'RAFAC adult volunteer — helping with junior cadets',    startDate: '2025-10-01', targetDate: '2026-10-01', status: 'In Progress', months: 8 },
      Physical:     { activity: 'Cross-country running — Johnstone Harriers',            startDate: '2025-10-01', targetDate: '2026-10-01', status: 'In Progress', months: 8 },
      Skill:        { activity: 'Photography — portfolio development',                   startDate: '2025-10-01', targetDate: '2026-10-01', status: 'In Progress', months: 8 },
      Expedition:   { activity: 'Gold qualifying expedition — Cairngorms',               startDate: '2026-08-10', targetDate: '2026-08-13', status: 'Not Started', months: null },
      Residential:  { activity: 'Pending — National Citizen Service',                   startDate: null,         targetDate: '2026-12-01', status: 'Not Started', months: null },
    },
  },
  {
    id: 'd3', cadetId: 'c03', cadet: 'Ahmed, R', level: 'Bronze', overallStatus: 'Complete', startDate: '2025-01-01',
    sections: {
      Volunteering: { activity: 'Litter picking — Linwood community',          startDate: '2025-01-01', targetDate: '2025-04-01', status: 'Approved', months: 3 },
      Physical:     { activity: 'Football — Johnstone Burgh FC training',      startDate: '2025-01-01', targetDate: '2025-04-01', status: 'Approved', months: 3 },
      Skill:        { activity: 'Cooking — completed 12-week course',          startDate: '2025-01-01', targetDate: '2025-04-01', status: 'Approved', months: 3 },
      Expedition:   { activity: 'Bronze qualifying — Muirshiel Country Park',  startDate: '2025-05-10', targetDate: '2025-05-11', status: 'Approved', months: null },
    },
  },
  {
    id: 'd4', cadetId: 'c05', cadet: 'Khan, A', level: 'Bronze', overallStatus: 'In Progress', startDate: '2026-01-15',
    sections: {
      Volunteering: { activity: 'Reading mentor at Johnstone Primary School', startDate: '2026-01-15', targetDate: '2026-04-15', status: 'Approved',    months: 3 },
      Physical:     { activity: 'Badminton — weekly club sessions',           startDate: '2026-01-15', targetDate: '2026-04-15', status: 'Submitted',   months: 3 },
      Skill:        { activity: 'Knitting — intermediate project',            startDate: '2026-01-15', targetDate: '2026-04-15', status: 'In Progress', months: 2 },
      Expedition:   { activity: 'Not yet planned',                            startDate: null,         targetDate: null,         status: 'Not Started', months: null },
    },
  },
];

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
}

function sectionProgress(record) {
  const sections = LEVEL_SECTIONS[record.level];
  const total    = sections.length;
  const approved = sections.filter(s => record.sections[s]?.status === 'Approved').length;
  return { approved, total };
}

function allApproved(record) {
  const { approved, total } = sectionProgress(record);
  return approved === total;
}

const Pill = ({ children, bg, color, size = 10 }) => (
  <span style={{ background: bg, color, padding: '2px 9px', borderRadius: 10, fontSize: size, fontWeight: 700, display: 'inline-block' }}>
    {children}
  </span>
);

export default function DofE({ showToast, addAudit }) {
  const [records, setRecords]       = useState(DOFE_SEED);
  const [selected, setSelected]     = useState(null);
  const [showEnrol, setShowEnrol]   = useState(false);
  const [enrolForm, setEnrolForm]   = useState({ cadetId: '', level: 'Bronze' });

  // ── computed ──────────────────────────────────────────────────────────────
  const enrolledCadetIds = new Set(records.map(r => r.cadetId));
  const availableCadets  = CADETS.filter(c => !enrolledCadetIds.has(c.id));

  const counts = {
    total:    records.length,
    Bronze:   records.filter(r => r.level === 'Bronze').length,
    Silver:   records.filter(r => r.level === 'Silver').length,
    Gold:     records.filter(r => r.level === 'Gold').length,
    complete: records.filter(r => r.overallStatus === 'Complete').length,
  };

  const selectedRecord = selected ? records.find(r => r.id === selected) : null;

  // ── actions ───────────────────────────────────────────────────────────────
  function handleEnrol() {
    if (!enrolForm.cadetId) { showToast('Please select a cadet'); return; }
    const cadet = CADETS.find(c => c.id === enrolForm.cadetId);
    const sections = {};
    LEVEL_SECTIONS[enrolForm.level].forEach(s => {
      sections[s] = { activity: '', startDate: null, targetDate: null, status: 'Not Started', months: null };
    });
    const newRecord = {
      id: `d${Date.now()}`,
      cadetId:       enrolForm.cadetId,
      cadet:         `${cadet.sn}, ${cadet.fn[0]}`,
      level:         enrolForm.level,
      overallStatus: 'In Progress',
      startDate:     new Date().toISOString().slice(0, 10),
      sections,
    };
    setRecords(prev => [...prev, newRecord]);
    addAudit?.('DofE Enrolment', `${cadet.sn}, ${cadet.fn}`, `Enrolled at ${enrolForm.level} level`);
    showToast(`${cadet.sn}, ${cadet.fn} enrolled at ${enrolForm.level}`);
    setShowEnrol(false);
    setEnrolForm({ cadetId: '', level: 'Bronze' });
  }

  function handleStatusChange(recordId, sectionName, newStatus) {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      const updated = {
        ...r,
        sections: {
          ...r.sections,
          [sectionName]: { ...r.sections[sectionName], status: newStatus },
        },
      };
      return updated;
    }));
    const rec = records.find(r => r.id === recordId);
    addAudit?.('DofE Section Updated', rec.cadet, `${sectionName} → ${newStatus} (${rec.level})`);
    showToast(`${rec.cadet} · ${sectionName} marked as ${newStatus}`);
  }

  function handleMarkComplete(recordId) {
    setRecords(prev => prev.map(r => r.id !== recordId ? r : { ...r, overallStatus: 'Complete' }));
    const rec = records.find(r => r.id === recordId);
    addAudit?.('DofE Award Complete', rec.cadet, `${rec.level} Award — all sections approved`);
    showToast(`${rec.cadet} — ${rec.level} Award marked complete`);
  }

  // ── print DofE register ───────────────────────────────────────────────────
  function printDofEReport() {
    const dateStr = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const levelColor = { Bronze: '#92400E', Silver: '#5A7090', Gold: '#C8A032' };
    const levelBg    = { Bronze: '#FEF3C7', Silver: '#F4F7FB', Gold: '#FFF8E7' };
    const statusColor = {
      'Not Started': { bg:'#F4F7FB', color:'#5A7090' },
      'In Progress':  { bg:'#FEF3C7', color:'#92400E' },
      'Submitted':    { bg:'#EEF2F8', color:'#1E40AF' },
      'Approved':     { bg:'#D1FAE5', color:'#065F46' },
    };
    const pill = (text, bg, color, size = 9) =>
      `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:10px;font-size:${size}px;font-weight:700;display:inline-block;font-family:'Barlow Condensed',sans-serif">${text}</span>`;
    const statBox = (label, value, accent) =>
      `<div style="background:white;border:1.5px solid #D0DCF0;border-radius:8px;padding:10px 18px;text-align:center;min-width:80px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:${accent};line-height:1">${value}</div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#5A7090;margin-top:3px">${label}</div>
      </div>`;

    const tableRows = records.map(rec => {
      const { approved, total } = sectionProgress(rec);
      const sections = LEVEL_SECTIONS[rec.level];
      const statusBadge = {
        'In Progress': { bg:'#FEF3C7', color:'#92400E' },
        'Complete':    { bg:'#D1FAE5', color:'#065F46' },
        'Not Started': { bg:'#F4F7FB', color:'#5A7090' },
      };
      const sb = statusBadge[rec.overallStatus] || statusBadge['Not Started'];
      const mainRow = `<tr style="background:white">
        <td style="padding:10px 12px;font-size:13px;font-weight:700;border-bottom:1px solid #E8ECF5">${rec.cadet}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E8ECF5">${pill(rec.level, levelBg[rec.level], levelColor[rec.level], 10)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E8ECF5;font-size:12px">${approved}/${total} Approved</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E8ECF5">${pill(rec.overallStatus, sb.bg, sb.color, 10)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090">${rec.startDate ? rec.startDate.split('-').reverse().join('/') : '—'}</td>
      </tr>`;
      const sectionRows = sections.map(s => {
        const sec = rec.sections[s] || {};
        const st  = sec.status || 'Not Started';
        const sc  = statusColor[st];
        return `<tr style="background:#F4F7FB">
          <td style="padding:5px 12px 5px 28px;font-size:11px;color:#5A7090;border-bottom:1px solid #EEF2F8" colspan="2">
            <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;color:#00264D;margin-right:8px">${s}</span>
            <span style="font-size:11px;color:#5A7090">${sec.activity || '—'}</span>
          </td>
          <td style="padding:5px 12px;border-bottom:1px solid #EEF2F8" colspan="3">${pill(st, sc.bg, sc.color, 9)}</td>
        </tr>`;
      }).join('');
      return mainRow + sectionRows;
    }).join('');

    const html = `<!DOCTYPE html><html><head>
<title>1701 Sqn DofE Register — ${dateStr}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 14mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Barlow', sans-serif; color: #0D1B2E; margin: 0; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #F4F7FB; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A7090; padding: 8px 12px; text-align: left; border-bottom: 2px solid #D0DCF0; }
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 800; color: #00264D; text-transform: uppercase; letter-spacing: 0.06em; margin: 18px 0 8px; }
  .sig-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A7090; margin-bottom: 3px; }
  .sig-line { border-bottom: 1px solid #5A7090; height: 30px; }
  .sig-name { font-size: 10px; color: #5A7090; margin-top: 4px; }
  .footer { font-size: 9px; color: #8A9AB8; margin-top: 16px; padding-top: 8px; border-top: 1px solid #E8ECF5; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>
<div style="display:flex;align-items:center;gap:14px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:14px">
  <div style="font-size:36px;line-height:1">✈️</div>
  <div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#00264D;margin:0">1701 (Johnstone) Squadron ATC</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:#5A7090;margin:3px 0 0">Duke of Edinburgh's Award Register &middot; ${dateStr}</div>
  </div>
</div>

<div style="display:flex;gap:10px;margin-bottom:16px">
  ${statBox('Total Enrolled', counts.total,    '#00264D')}
  ${statBox('Bronze',         counts.Bronze,   '#92400E')}
  ${statBox('Silver',         counts.Silver,   '#5A7090')}
  ${statBox('Gold',           counts.Gold,     '#C8A032')}
  ${statBox('Complete',       counts.complete, '#065F46')}
</div>

<table>
  <thead><tr>
    <th style="width:160px">Cadet</th>
    <th style="width:80px">Level</th>
    <th style="width:130px">Section Progress</th>
    <th style="width:110px">Overall Status</th>
    <th>Start Date</th>
  </tr></thead>
  <tbody>${tableRows}</tbody>
</table>

<div class="section-label" style="margin-top:24px">Signatures</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
  <div>
    <div class="sig-label">Officer Commanding</div>
    <div class="sig-line"></div>
    <div class="sig-name">Flt Lt A. McDonald</div>
  </div>
  <div>
    <div class="sig-label">DofE Co-ordinator</div>
    <div class="sig-line"></div>
    <div class="sig-name">&nbsp;</div>
  </div>
  <div>
    <div class="sig-label">Date</div>
    <div class="sig-line"></div>
    <div class="sig-name">&nbsp;</div>
  </div>
</div>

<div class="footer">OFFICIAL &nbsp;&middot;&nbsp; GDPR DPA 2018 applies &nbsp;&middot;&nbsp; Printed: ${new Date().toLocaleString('en-GB')}</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit && addAudit(`DofE register printed — ${records.length} cadets`, 'DofE');
    showToast && showToast('🖨️ Print dialogue opening…');
  }

  // ── overall status pill ───────────────────────────────────────────────────
  function overallPill(status) {
    const map = {
      'In Progress': { bg: '#FEF3C7', color: '#92400E' },
      'Complete':    { bg: '#D1FAE5', color: '#065F46' },
      'Not Started': { bg: '#F4F7FB', color: '#5A7090' },
    };
    const s = map[status] || map['Not Started'];
    return <Pill bg={s.bg} color={s.color} size={11}>{status}</Pill>;
  }

  // ── overview view ─────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 22, fontWeight: 800, color: navy }}>
              Duke of Edinburgh's Award
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
              Bronze · Silver · Gold — 1701 (Johnstone) Squadron
            </div>
          </div>
          <button
            onClick={() => setShowEnrol(true)}
            style={{ padding: '9px 18px', background: gold, color: navy, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Barlow Condensed,sans-serif', letterSpacing: '0.04em' }}>
            + Enrol Cadet
          </button>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          {[
            { label: 'Registered', value: counts.total,    accent: navy },
            { label: 'Bronze',     value: counts.Bronze,   accent: LEVEL_COLOR.Bronze },
            { label: 'Silver',     value: counts.Silver,   accent: LEVEL_COLOR.Silver },
            { label: 'Gold',       value: counts.Gold,     accent: LEVEL_COLOR.Gold },
            { label: 'Complete',   value: counts.complete, accent: '#065F46' },
          ].map(t => (
            <div key={t.label} style={{ background: 'white', border: `1.5px solid ${border}`, borderRadius: 10, padding: '13px 20px', minWidth: 90, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, color: t.accent, lineHeight: 1 }}>{t.value}</div>
              <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{t.label}</div>
            </div>
          ))}
        </div>

        {/* Cadet table */}
        <div style={{ background: 'white', border: `1.5px solid ${border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1.5px solid ${border}`, fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, color: navy, fontSize: 15 }}>
            Registered Cadets
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F4F7FB', borderBottom: `2px solid ${border}` }}>
                {['Cadet', 'Level', 'Overall Status', 'Sections Progress', ''].map(h => (
                  <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => {
                const cadet  = CADETS.find(c => c.id === rec.cadetId);
                const rank   = cadet?.rank || '';
                const { approved, total } = sectionProgress(rec);
                const pct = Math.round((approved / total) * 100);
                return (
                  <tr key={rec.id} style={{ borderBottom: i < records.length - 1 ? `1px solid ${border}` : 'none', background: i % 2 ? '#fafcfe' : 'white' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: navy, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                          {cadet?.ini || rec.cadet.slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{rec.cadet}</div>
                          <div style={{ fontSize: 10, color: muted }}>{rank} · Started {fmtDate(rec.startDate)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <Pill bg={LEVEL_BG[rec.level]} color={LEVEL_COLOR[rec.level]} size={11}>{rec.level}</Pill>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      {overallPill(rec.overallStatus)}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden', minWidth: 80 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#065F46' : gold, borderRadius: 4, transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ fontSize: 11, color: muted, whiteSpace: 'nowrap', minWidth: 48 }}>
                          {approved}/{total} sections
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelected(rec.id)}
                        style={{ padding: '5px 14px', background: navy, color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {records.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: muted, fontSize: 13 }}>
              No cadets enrolled yet. Click "+ Enrol Cadet" to get started.
            </div>
          )}
        </div>

        {/* Enrol modal */}
        {showEnrol && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,20,50,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 12, padding: '28px 32px', width: 400, boxShadow: '0 8px 40px rgba(0,20,50,0.18)', border: `1.5px solid ${border}` }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 18, fontWeight: 800, color: navy, marginBottom: 4 }}>
                Enrol Cadet in DofE
              </div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 22 }}>Select a cadet and award level to begin their programme.</div>

              <label style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Cadet</label>
              <select
                value={enrolForm.cadetId}
                onChange={e => setEnrolForm(p => ({ ...p, cadetId: e.target.value }))}
                style={{ width: '100%', padding: '9px 11px', border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 13, fontFamily: 'inherit', marginBottom: 16, background: 'white', color: navy }}>
                <option value="">— Select cadet —</option>
                {availableCadets.map(c => (
                  <option key={c.id} value={c.id}>{c.rank} {c.sn}, {c.fn}</option>
                ))}
              </select>

              <label style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Award Level</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['Bronze', 'Silver', 'Gold'].map(level => (
                  <button
                    key={level}
                    onClick={() => setEnrolForm(p => ({ ...p, level }))}
                    style={{ flex: 1, padding: '9px 0', border: `2px solid ${enrolForm.level === level ? LEVEL_COLOR[level] : border}`, borderRadius: 8, background: enrolForm.level === level ? LEVEL_BG[level] : 'white', color: enrolForm.level === level ? LEVEL_COLOR[level] : muted, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Barlow Condensed,sans-serif' }}>
                    {level}
                  </button>
                ))}
              </div>

              {enrolForm.cadetId && (
                <div style={{ background: '#F4F7FB', border: `1px solid ${border}`, borderRadius: 7, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: muted }}>
                  <strong style={{ color: navy }}>{enrolForm.level} sections required:</strong>{' '}
                  {LEVEL_SECTIONS[enrolForm.level].join(', ')}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleEnrol}
                  style={{ flex: 1, padding: '10px 0', background: gold, color: navy, border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Barlow Condensed,sans-serif' }}>
                  Enrol
                </button>
                <button
                  onClick={() => { setShowEnrol(false); setEnrolForm({ cadetId: '', level: 'Bronze' }); }}
                  style={{ flex: 1, padding: '10px 0', background: 'white', color: muted, border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── detail view ───────────────────────────────────────────────────────────
  const rec   = selectedRecord;
  const cadet = CADETS.find(c => c.id === rec.cadetId);
  const { approved, total } = sectionProgress(rec);
  const canComplete = allApproved(rec) && rec.overallStatus !== 'Complete';
  const sections    = LEVEL_SECTIONS[rec.level];
  const requirements = LEVEL_REQUIREMENTS[rec.level];

  return (
    <div>
      {/* Back + header */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setSelected(null)}
          style={{ background: 'none', border: 'none', color: muted, fontSize: 13, cursor: 'pointer', padding: '0 0 12px 0', fontFamily: 'Barlow,sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
          ← All Cadets
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: navy, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
              {cadet?.ini || rec.cadet.slice(0, 2)}
            </div>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 22, fontWeight: 800, color: navy, lineHeight: 1.1 }}>
                {cadet ? `${cadet.rank} ${rec.cadet}` : rec.cadet}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <Pill bg={LEVEL_BG[rec.level]} color={LEVEL_COLOR[rec.level]} size={12}>{rec.level} Award</Pill>
                {overallPill(rec.overallStatus)}
                <span style={{ fontSize: 11, color: muted }}>Started {fmtDate(rec.startDate)}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sections approved</div>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 24, fontWeight: 800, color: approved === total ? '#065F46' : navy }}>
                {approved}/{total}
              </div>
            </div>
            {canComplete && (
              <button
                onClick={() => handleMarkComplete(rec.id)}
                style={{ padding: '10px 20px', background: '#065F46', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Barlow Condensed,sans-serif', letterSpacing: '0.03em' }}>
                Mark as Complete ✓
              </button>
            )}
            {rec.overallStatus === 'Complete' && (
              <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 800 }}>
                Award Complete ✓
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, background: 'white', border: `1.5px solid ${border}`, borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Progress</span>
            <span style={{ fontSize: 11, color: muted }}>{Math.round((approved / total) * 100)}%</span>
          </div>
          <div style={{ height: 8, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(approved / total) * 100}%`, height: '100%', background: approved === total ? '#065F46' : gold, borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {sections.map(s => {
              const st = rec.sections[s]?.status || 'Not Started';
              const sc = STATUS_COLOR[st];
              return (
                <span key={s} style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 10 }}>{s}</span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {sections.map(sectionName => {
          const sec = rec.sections[sectionName] || {};
          const st  = sec.status || 'Not Started';
          const sc  = STATUS_COLOR[st];
          const isExpedition  = sectionName === 'Expedition';
          const isResidential = sectionName === 'Residential';
          const showDates = isExpedition || isResidential;

          return (
            <div key={sectionName} style={{ background: 'white', border: `1.5px solid ${border}`, borderRadius: 10, padding: '18px 20px' }}>
              {/* Section header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 800, color: navy }}>{sectionName}</div>
                  <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>Required: {requirements[sectionName]}</div>
                </div>
                <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {st}
                </span>
              </div>

              {/* Activity */}
              <div style={{ fontSize: 13, color: sec.activity ? '#0D1B2E' : muted, marginBottom: 12, lineHeight: 1.45, fontStyle: sec.activity ? 'normal' : 'italic' }}>
                {sec.activity || 'Activity not yet recorded'}
              </div>

              {/* Dates / progress */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {showDates ? (
                  <>
                    <div style={{ background: '#F4F7FB', borderRadius: 7, padding: '8px 11px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Start Date</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy }}>{fmtDate(sec.startDate)}</div>
                    </div>
                    <div style={{ background: '#F4F7FB', borderRadius: 7, padding: '8px 11px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>End Date</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy }}>{fmtDate(sec.targetDate)}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ background: '#F4F7FB', borderRadius: 7, padding: '8px 11px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Started</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy }}>{fmtDate(sec.startDate)}</div>
                    </div>
                    <div style={{ background: '#F4F7FB', borderRadius: 7, padding: '8px 11px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Target</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy }}>{fmtDate(sec.targetDate)}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Months completed (non-expedition sections) */}
              {!showDates && sec.months !== null && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: muted, fontWeight: 700 }}>
                      {sec.months} month{sec.months !== 1 ? 's' : ''} completed
                    </span>
                  </div>
                  <div style={{ height: 5, background: '#E8EEF5', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (sec.months / parseInt(requirements[sectionName])) * 100)}%`,
                      height: '100%',
                      background: st === 'Approved' ? '#065F46' : gold,
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              )}

              {/* Status update dropdown */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>
                  Update Status
                </label>
                <select
                  value={st}
                  onChange={e => handleStatusChange(rec.id, sectionName, e.target.value)}
                  disabled={rec.overallStatus === 'Complete'}
                  style={{ width: '100%', padding: '8px 10px', border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 12, fontFamily: 'inherit', background: rec.overallStatus === 'Complete' ? '#F4F7FB' : 'white', color: navy, cursor: rec.overallStatus === 'Complete' ? 'not-allowed' : 'pointer' }}>
                  {['Not Started', 'In Progress', 'Submitted', 'Approved'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {rec.overallStatus === 'Complete' && (
        <div style={{ marginTop: 18, background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🏅</span>
          <div>
            <div style={{ fontWeight: 800, color: '#065F46', fontSize: 14 }}>{rec.level} Award Complete</div>
            <div style={{ fontSize: 12, color: '#047857' }}>All sections approved. This record is now locked.</div>
          </div>
        </div>
      )}
    </div>
  );
}
