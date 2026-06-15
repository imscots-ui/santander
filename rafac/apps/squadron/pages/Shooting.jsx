import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';

// ── Constants ──────────────────────────────────────────────────────────────

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

// ── Module-level seed data ─────────────────────────────────────────────────

const CLASSES = ['Unclassified', '3rd Class', '2nd Class', '1st Class', 'Marksman'];

const CLASS_COLOR = {
  'Unclassified': { bg: '#F4F7FB', color: '#5A7090' },
  '3rd Class':    { bg: '#FEF3C7', color: '#92400E' },
  '2nd Class':    { bg: '#EEF6FF', color: '#1E40AF' },
  '1st Class':    { bg: '#D1FAE5', color: '#065F46' },
  'Marksman':     { bg: '#FFF8E7', color: '#C8A032' },
};

const SHOOTERS = [
  { id: 'sh1', cadetId: 'c01', name: 'Mitchell, S', ini: 'SM', rank: 'Cpl',  class: '1st Class',    classDate: '2025-11-20', totalShots: 240, bestScore: 196, recentScores: [192, 194, 196, 188, 191] },
  { id: 'sh2', cadetId: 'c02', name: 'Thomas, M',   ini: 'TM', rank: 'Sgt',  class: 'Marksman',     classDate: '2025-06-15', totalShots: 410, bestScore: 199, recentScores: [197, 199, 195, 198, 199] },
  { id: 'sh3', cadetId: 'c03', name: 'Ahmed, R',    ini: 'RA', rank: 'LCpl', class: '2nd Class',    classDate: '2026-01-10', totalShots: 160, bestScore: 187, recentScores: [180, 183, 185, 182, 187] },
  { id: 'sh4', cadetId: 'c05', name: 'Khan, A',     ini: 'AK', rank: 'Cdt',  class: '3rd Class',    classDate: '2025-10-01', totalShots: 80,  bestScore: 174, recentScores: [165, 168, 170, 172, 174] },
  { id: 'sh5', cadetId: 'c08', name: 'Patel, E',    ini: 'EP', rank: 'Cdt',  class: 'Unclassified', classDate: null,         totalShots: 20,  bestScore: 152, recentScores: [140, 148, 151, 150, 152] },
];

const COMPETITIONS = [
  {
    id: 'c1', name: 'WTSA Regional Shoot 2026', date: '2026-04-26', location: 'Glasgow Shooting Centre', type: '25m Gallery',
    status: 'Complete', teamScore: 748,
    results: [
      { shooterId: 'sh2', name: 'Thomas, M',   score: 199, position: 1,  notes: 'Perfect 5-bull round. Top score across all squadrons.' },
      { shooterId: 'sh1', name: 'Mitchell, S', score: 191, position: 4,  notes: 'Consistent performance.' },
      { shooterId: 'sh3', name: 'Ahmed, R',    score: 183, position: 11, notes: 'Solid. Improving groupings.' },
      { shooterId: 'sh4', name: 'Khan, A',     score: 175, position: 18, notes: 'Personal best.' },
    ],
  },
  {
    id: 'c2', name: '1701 Internal Classification Shoot', date: '2026-05-30', location: 'Glasgow Shooting Centre', type: '25m Gallery',
    status: 'Complete', teamScore: null,
    results: [
      { shooterId: 'sh2', name: 'Thomas, M',   score: 198, position: null, notes: 'Marksman confirmed.' },
      { shooterId: 'sh1', name: 'Mitchell, S', score: 194, position: null, notes: '1st Class confirmed.' },
      { shooterId: 'sh3', name: 'Ahmed, R',    score: 185, position: null, notes: 'Progressing toward 1st Class.' },
      { shooterId: 'sh4', name: 'Khan, A',     score: 172, position: null, notes: '2nd Class borderline.' },
      { shooterId: 'sh5', name: 'Patel, E',    score: 150, position: null, notes: 'First classification shoot.' },
    ],
  },
  {
    id: 'c3', name: 'Bisley (NCSF) — Cadet Selection', date: '2026-08-01', location: 'Bisley Camp, Surrey', type: '300m Full Bore',
    status: 'Upcoming', teamScore: null,
    results: [],
  },
];

const BISLEY_TEAM = [
  { shooterId: 'sh2', name: 'Thomas, M',   rank: 'Sgt', selected: true, notes: 'Team captain. Marksman class.' },
  { shooterId: 'sh1', name: 'Mitchell, S', rank: 'Cpl', selected: true, notes: 'Consistent 1st Class. Strong team member.' },
];

const PRACTICE_LOG = [
  {
    id: 'pl1', date: '2026-06-12', location: 'Glasgow Shooting Centre', type: 'Gallery (25m)',
    present: ['sh1', 'sh2', 'sh3'], coach: 'CI Morrison, K.',
    notes: 'Focus on trigger control and consistent hold. Thomas achieving near-perfect scores.',
  },
  {
    id: 'pl2', date: '2026-05-29', location: 'Glasgow Shooting Centre', type: 'Gallery (25m)',
    present: ['sh1', 'sh2', 'sh3', 'sh4'], coach: 'CI Morrison, K.',
    notes: 'Classification practice. Khan showing good improvement. Patel first session.',
  },
];

// ── Shared small helpers ───────────────────────────────────────────────────

function Avatar({ ini, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: navy, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800,
      fontFamily: 'Barlow Condensed, sans-serif',
      flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {ini}
    </div>
  );
}

function Badge({ label, bg, color, style = {} }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: 'Barlow Condensed, sans-serif',
      letterSpacing: '0.04em',
      background: bg,
      color,
      ...style,
    }}>
      {label}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${border}`,
      borderRadius: 10,
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, color = navy }) {
  return (
    <Card style={{ padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </Card>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1.5px solid ${border}`, paddingBottom: 0 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '9px 18px',
            background: 'none',
            border: 'none',
            borderBottom: active === t.id ? `2.5px solid ${navy}` : '2.5px solid transparent',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 14,
            fontWeight: active === t.id ? 800 : 600,
            color: active === t.id ? navy : muted,
            cursor: 'pointer',
            marginBottom: -1.5,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// Score colour helpers (scale 0–200)
function scoreColor(score) {
  if (score >= 190) return { color: '#065F46', bg: '#D1FAE5' };
  if (score >= 175) return { color: '#92400E', bg: '#FEF3C7' };
  return { color: muted, bg: '#F4F7FB' };
}

// Mini sparkline bar for a single score (scale 140–200)
function ScoreBar({ score, maxH = 22 }) {
  const pct = Math.max(0, Math.min(1, (score - 140) / 60));
  const h = Math.round(pct * maxH);
  const sc = scoreColor(score);
  return (
    <div title={String(score)} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
      height: maxH, width: 12,
    }}>
      <div style={{ width: 8, height: h || 2, background: sc.color, borderRadius: 2 }} />
    </div>
  );
}

// Five recent scores as sparkline bars + text pills
function ScoreSpark({ scores }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
      {scores.map((s, i) => <ScoreBar key={i} score={s} />)}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Shooting({ showToast, addAudit }) {
  const [tab, setTab]               = useState('register');
  const [selected, setSelected]     = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  const [shooters, setShooters]     = useState(SHOOTERS);
  const [pendingClass, setPendingClass] = useState({});

  const TABS = [
    { id: 'register',     label: 'Register' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'practice',     label: 'Practice Log' },
    { id: 'bisley',       label: 'Bisley Team' },
  ];

  // ── Classification update handlers ────────────────────────────────────────

  function handleClassChange(shId, val) {
    setPendingClass(prev => ({ ...prev, [shId]: val }));
  }

  function handleClassSave(shooter) {
    const newClass = pendingClass[shooter.id];
    if (!newClass || newClass === shooter.class) {
      showToast && showToast('No change to save.');
      return;
    }
    setShooters(prev => prev.map(s =>
      s.id === shooter.id
        ? { ...s, class: newClass, classDate: '2026-06-14' }
        : s
    ));
    addAudit && addAudit({
      action: 'Shooting classification updated',
      detail: `${shooter.rank} ${shooter.name} — ${shooter.class} → ${newClass}`,
      user: 'CI Morrison, K.',
    });
    setPendingClass(prev => { const n = { ...prev }; delete n[shooter.id]; return n; });
    showToast && showToast(`Classification updated: ${shooter.name} → ${newClass}`);
  }

  // ── Print helpers ─────────────────────────────────────────────────────────

  function printShootingRegister() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const totalShots = shooters.reduce((s, sh) => s + sh.totalShots, 0);
    const marksmanCount = shooters.filter(s => s.class === 'Marksman').length;
    const firstClassCount = shooters.filter(s => s.class === '1st Class').length;

    const rows = shooters.map((s, i) => {
      const cc = CLASS_COLOR[s.class] || CLASS_COLOR['Unclassified'];
      const recentBars = s.recentScores.map(score => {
        const pct = Math.max(0, Math.min(1, (score - 140) / 60));
        const h = Math.max(2, Math.round(pct * 40));
        const col = score >= 190 ? '#065F46' : score >= 175 ? '#92400E' : '#5A7090';
        return `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;vertical-align:bottom;width:16px"><span style="font-size:8.5px;color:${col};font-weight:700">${score}</span><div style="width:10px;height:${h}px;background:${col};border-radius:2px"></div></span>`;
      }).join('');
      return `<tr style="background:${i%2?'#fafcfe':'white'}">
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;font-weight:700;color:#00264D;font-size:12px">${s.rank} ${s.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center"><span style="background:${cc.bg};color:${cc.color};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">${s.class}</span></td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center;font-size:11px;color:#5A7090">${s.classDate||'—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:15px;color:#00264D">${s.bestScore}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5"><div style="display:flex;align-items:flex-end;gap:3px">${recentBars}</div></td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center;font-size:12px;color:#5A7090">${s.totalShots}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Shooting Register — 1701 Sqn</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 landscape;margin:14mm 16mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#00264D;background:white;font-size:12px;margin:0}
.hdr{display:flex;align-items:center;gap:16px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:14px}
.sqn{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800}
.sub{font-size:11px;color:#5A7090;margin-top:2px}
.doc-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;margin-left:auto;text-align:right}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.stat-box{background:#F5F8FF;border:1.5px solid #D0DCF0;border-radius:8px;padding:11px 14px;text-align:center}
.section-title{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D;border-bottom:2px solid #D0DCF0;padding-bottom:5px;margin-bottom:0;letter-spacing:.03em}
table{width:100%;border-collapse:collapse}
thead tr{background:#F4F7FB}
th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:#5A7090;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #D0DCF0}
th.c{text-align:center}
.sig-row{display:flex;gap:32px;margin-top:16px;padding-top:12px;border-top:2px solid #C8A032}
.sig-block{flex:1}
.sig-line{border-bottom:1px solid #00264D;height:36px;margin-bottom:4px}
.sig-label{font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.sig-name{font-size:12px;font-weight:700;color:#00264D;margin-top:2px}
.footer{margin-top:12px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9.5px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="hdr">
  <span style="font-size:40px">🎯</span>
  <div><div class="sqn">1701 (Johnstone) Squadron ATC</div><div class="sub">Shooting Register · WTSA · NCSF · ${dateStr}</div></div>
  <div class="doc-title">Cadet Shooting Register</div>
</div>
<div class="stat-row">
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#00264D">${shooters.length}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Shooters</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#C8A032">${marksmanCount}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Marksman</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#065F46">${firstClassCount}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">1st Class</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#5A7090">${totalShots.toLocaleString()}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Total Shots</div></div>
</div>
<div class="section-title">Shooter Classification Register (${shooters.length} cadets · ${dateStr})</div>
<table>
  <thead><tr><th>Shooter</th><th class="c">Classification</th><th class="c">Class Date</th><th class="c">Best Score</th><th>Recent 5</th><th class="c">Total Shots</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="sig-row">
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Classification Officer / Shooting Instructor</div><div class="sig-name">CI Morrison, K.</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Officer Commanding</div><div class="sig-name">Flt Lt A. McDonald</div><div class="sig-label">1701 (Johnstone) Squadron ATC</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Date</div><div class="sig-name">${dateStr}</div></div>
</div>
<div class="footer">1701-SHOOT-REG-${new Date().getFullYear()} · OFFICIAL · WTSA / NCSF · ${dateStr} · West of Scotland Wing</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit && addAudit({ action:'Shooting register printed', category:'Training' });
    showToast && showToast('📄 Shooting register printing…');
  }

  function printCompetitionReport(comp) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const hasPos = comp.results.some(r => r.position !== null);
    const rows = comp.results.map((r, i) => {
      const col = r.score >= 190 ? '#065F46' : r.score >= 175 ? '#92400E' : '#5A7090';
      const bg  = r.score >= 190 ? '#D1FAE5' : r.score >= 175 ? '#FEF3C7' : '#F4F7FB';
      return `<tr style="background:${i%2?'#fafcfe':'white'}">
        ${hasPos?`<td style="padding:9px 12px;border-bottom:1px solid #E8ECF5;text-align:center;font-family:monospace;font-size:16px;font-weight:800;color:${r.position===1?'#C8A032':'#00264D'}">${r.position?`#${r.position}`:'—'}</td>`:''}
        <td style="padding:9px 12px;border-bottom:1px solid #E8ECF5;font-weight:700;color:#00264D;font-size:13px">${r.name}</td>
        <td style="padding:9px 12px;border-bottom:1px solid #E8ECF5;text-align:center"><span style="background:${bg};color:${col};padding:4px 12px;border-radius:20px;font-size:14px;font-weight:800;font-family:monospace">${r.score}</span></td>
        <td style="padding:9px 12px;border-bottom:1px solid #E8ECF5;font-size:12px;color:#5A7090;line-height:1.5">${r.notes||'—'}</td>
      </tr>`;
    }).join('');
    const best = comp.results.reduce((a, b) => (b.score > a.score ? b : a), comp.results[0] || { name:'—', score:0 });
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Competition Report — ${comp.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:16mm 20mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#00264D;background:white;font-size:13px;margin:0}
.hdr{display:flex;align-items:center;gap:16px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:18px}
.sqn{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800}
.sub{font-size:11px;color:#5A7090;margin-top:2px}
.comp-name{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;margin-bottom:6px}
.meta{font-size:12px;color:#5A7090;margin-bottom:16px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}
.stat-box{background:#F5F8FF;border:1.5px solid #D0DCF0;border-radius:8px;padding:12px;text-align:center}
.section-title{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D;border-bottom:2px solid #D0DCF0;padding-bottom:5px;margin-bottom:0;letter-spacing:.03em}
table{width:100%;border-collapse:collapse;margin-bottom:18px}
thead tr{background:#F4F7FB}
th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:#5A7090;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #D0DCF0}
th.c{text-align:center}
.sig-row{display:flex;gap:24px;padding-top:12px;border-top:2px solid #C8A032}
.sig-block{flex:1}
.sig-line{border-bottom:1px solid #00264D;height:36px;margin-bottom:4px}
.sig-label{font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.sig-name{font-size:12px;font-weight:700;color:#00264D;margin-top:2px}
.footer{margin-top:14px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9.5px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="hdr">
  <span style="font-size:40px">🎯</span>
  <div><div class="sqn">1701 (Johnstone) Squadron ATC</div><div class="sub">Shooting Competition Report · ${dateStr}</div></div>
</div>
<div class="comp-name">${comp.name}</div>
<div class="meta">${comp.date} · ${comp.location} · ${comp.type} · <strong style="color:#00264D">Status: ${comp.status}</strong>${comp.teamScore?` · Team score: <strong>${comp.teamScore}</strong>`:''}</div>
<div class="stats">
  <div class="stat-box"><div style="font-family:monospace;font-size:24px;font-weight:800;color:#00264D">${comp.results.length}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Entrants</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:24px;font-weight:800;color:#C8A032">${best.score}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Top Score (${best.name.split(',')[0]})</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:24px;font-weight:800;color:#065F46">${comp.results.length>0?Math.round(comp.results.reduce((a,b)=>a+b.score,0)/comp.results.length):'—'}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Squad Average</div></div>
</div>
<div class="section-title">Results</div>
<table>
  <thead><tr>${hasPos?'<th class="c">Pos</th>':''}<th>Shooter</th><th class="c">Score (/200)</th><th>Notes</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="sig-row">
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Shooting Instructor</div><div class="sig-name">CI Morrison, K.</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Officer Commanding</div><div class="sig-name">Flt Lt A. McDonald</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Date</div><div class="sig-name">${dateStr}</div></div>
</div>
<div class="footer">1701-COMP-${comp.id.toUpperCase()}-${new Date().getFullYear()} · OFFICIAL · ${comp.name} · ${dateStr}</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit && addAudit({ action:`Competition report printed: ${comp.name}`, category:'Training' });
    showToast && showToast(`📄 Competition report printing: ${comp.name}…`);
  }

  // ── Register tab ───────────────────────────────────────────────────────

  function RegisterTab() {
    const totalShooters   = shooters.length;
    const marksmanCount   = shooters.filter(s => s.class === 'Marksman').length;
    const firstClassCount = shooters.filter(s => s.class === '1st Class').length;
    const totalShots      = shooters.reduce((acc, s) => acc + s.totalShots, 0);

    return (
      <div>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard label="Shooters" value={totalShooters} color={navy} />
          <StatCard label="Marksman" value={marksmanCount} color={gold} />
          <StatCard label="1st Class" value={firstClassCount} color="#065F46" />
          <StatCard label="Total Shots" value={totalShots.toLocaleString()} color={muted} />
        </div>

        {/* Table */}
        <Card>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.2fr 1.3fr 1fr 1fr 1.4fr 0.9fr',
            padding: '10px 16px',
            borderBottom: `1.5px solid ${border}`,
            gap: 8,
          }}>
            {['Shooter', 'Classification', 'Class Date', 'Best Score', 'Recent (5)', 'Total Shots'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>{h}</div>
            ))}
          </div>

          {shooters.map((shooter, idx) => {
            const isSelected = selected === shooter.id;
            const cc = CLASS_COLOR[shooter.class] || CLASS_COLOR['Unclassified'];
            const bestSc = scoreColor(shooter.bestScore);

            return (
              <div key={shooter.id}>
                {/* Row */}
                <div
                  onClick={() => setSelected(isSelected ? null : shooter.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.2fr 1.3fr 1fr 1fr 1.4fr 0.9fr',
                    padding: '11px 16px',
                    gap: 8,
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: isSelected || idx === shooters.length - 1 ? 'none' : `1px solid ${border}`,
                    background: isSelected ? '#F6F9FF' : 'white',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Name + rank */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar ini={shooter.ini} size={32} />
                    <div>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: navy }}>{shooter.name}</div>
                      <div style={{ fontSize: 11, color: muted }}>{shooter.rank}</div>
                    </div>
                  </div>

                  {/* Classification badge */}
                  <div><Badge label={shooter.class} bg={cc.bg} color={cc.color} /></div>

                  {/* Class date */}
                  <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                    {shooter.classDate ?? '—'}
                  </div>

                  {/* Best score */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'Barlow Condensed, sans-serif',
                      background: bestSc.bg,
                      color: bestSc.color,
                    }}>
                      {shooter.bestScore}
                    </span>
                  </div>

                  {/* Recent scores sparkline */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    <ScoreSpark scores={shooter.recentScores} />
                    <div style={{ marginLeft: 6, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {shooter.recentScores.map((s, i) => {
                        const sc = scoreColor(s);
                        return (
                          <span key={i} style={{
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: 'Barlow Condensed, sans-serif',
                            color: sc.color,
                          }}>
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total shots */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2A40', fontFamily: 'Barlow, sans-serif' }}>
                    {shooter.totalShots}
                  </div>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div style={{
                    padding: '16px 20px',
                    background: '#F6F9FF',
                    borderTop: `1px solid ${border}`,
                    borderBottom: idx < shooters.length - 1 ? `1.5px solid ${border}` : 'none',
                  }}>
                    {/* Score trend */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: 'Barlow Condensed, sans-serif' }}>
                        Score Trend (Recent 5 Shoots)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        {shooter.recentScores.map((s, i) => {
                          const sc = scoreColor(s);
                          const pct = Math.max(0, Math.min(1, (s - 140) / 60));
                          const h = Math.round(pct * 48);
                          return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: sc.color, fontFamily: 'Barlow Condensed, sans-serif' }}>{s}</div>
                              <div style={{
                                width: 28, height: h || 4,
                                background: sc.color,
                                borderRadius: 4,
                                transition: 'height 0.3s',
                              }} />
                              <div style={{ fontSize: 10, color: muted, fontFamily: 'Barlow, sans-serif' }}>#{i + 1}</div>
                            </div>
                          );
                        })}
                        <div style={{ marginLeft: 16, borderLeft: `1.5px solid ${border}`, paddingLeft: 16 }}>
                          <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4, fontFamily: 'Barlow Condensed, sans-serif' }}>Best Score</div>
                          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 800, color: navy }}>{shooter.bestScore}</div>
                          <div style={{ fontSize: 11, color: muted, fontFamily: 'Barlow, sans-serif' }}>out of 200</div>
                        </div>
                      </div>
                    </div>

                    {/* Class history summary */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontFamily: 'Barlow Condensed, sans-serif' }}>
                        Classification History
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        {CLASSES.map((cls, i) => {
                          const cc2 = CLASS_COLOR[cls];
                          const current = cls === shooter.class;
                          const classIdx = CLASSES.indexOf(shooter.class);
                          const achieved = i <= classIdx;
                          return (
                            <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <div style={{
                                padding: '3px 10px',
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: 'Barlow Condensed, sans-serif',
                                background: achieved ? cc2.bg : '#F4F7FB',
                                color: achieved ? cc2.color : '#B0BEC5',
                                border: current ? `1.5px solid ${cc2.color}` : '1.5px solid transparent',
                                opacity: achieved ? 1 : 0.5,
                              }}>
                                {cls}
                                {current && ' ✓'}
                              </div>
                              {i < CLASSES.length - 1 && (
                                <div style={{ color: border, fontSize: 12 }}>›</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {shooter.classDate && (
                        <div style={{ fontSize: 11, color: muted, marginTop: 6, fontFamily: 'Barlow, sans-serif' }}>
                          Current classification awarded: {shooter.classDate}
                        </div>
                      )}
                    </div>

                    {/* Update classification */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Update Classification:
                      </div>
                      <select
                        value={pendingClass[shooter.id] !== undefined ? pendingClass[shooter.id] : shooter.class}
                        onChange={e => handleClassChange(shooter.id, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          border: `1.5px solid ${border}`,
                          borderRadius: 7,
                          fontSize: 13,
                          fontFamily: 'Barlow, sans-serif',
                          color: navy,
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        {CLASSES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleClassSave(shooter)}
                        style={{
                          padding: '5px 16px',
                          background: navy,
                          color: 'white',
                          border: 'none',
                          borderRadius: 7,
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: 'Barlow Condensed, sans-serif',
                          cursor: 'pointer',
                          letterSpacing: '0.03em',
                        }}
                      >
                        Save
                      </button>
                      <div style={{ marginLeft: 'auto', fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                        <span style={{ fontWeight: 700 }}>Total shots:</span> {shooter.totalShots}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  // ── Competitions tab ───────────────────────────────────────────────────

  function CompetitionsTab() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {COMPETITIONS.map(comp => {
          const isOpen = selectedComp === comp.id;
          const statusColor = comp.status === 'Complete'
            ? { bg: '#D1FAE5', color: '#065F46' }
            : { bg: '#FEF3C7', color: '#92400E' };
          const typeColor = comp.type === '25m Gallery'
            ? { bg: '#EEF6FF', color: '#1E40AF' }
            : { bg: '#D1FAE5', color: '#065F46' };

          return (
            <Card key={comp.id} style={{ overflow: 'hidden' }}>
              {/* Header row */}
              <div
                onClick={() => setSelectedComp(isOpen ? null : comp.id)}
                style={{
                  padding: '14px 18px',
                  cursor: 'pointer',
                  background: isOpen ? '#F6F9FF' : 'white',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 16, color: navy }}>
                      {comp.name}
                    </div>
                    <Badge label={comp.type} bg={typeColor.bg} color={typeColor.color} />
                    <Badge label={comp.status} bg={statusColor.bg} color={statusColor.color} />
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                      <span style={{ fontWeight: 700, color: '#1A2A40' }}>{comp.date}</span>
                    </div>
                    <div style={{ fontSize: 13, color: muted, fontFamily: 'Barlow, sans-serif' }}>{comp.location}</div>
                    {comp.teamScore !== null && (
                      <div style={{ fontSize: 13, fontFamily: 'Barlow, sans-serif' }}>
                        <span style={{ fontWeight: 700, color: navy }}>Team score: </span>
                        <span style={{ fontWeight: 800, color: scoreColor(comp.teamScore / (comp.results.length || 1)).color }}>{comp.teamScore}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  fontSize: 18, color: muted, marginTop: 2, flexShrink: 0,
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>
                  ▾
                </div>
              </div>

              {/* Expanded: results */}
              {isOpen && (
                <div style={{ borderTop: `1.5px solid ${border}`, padding: '14px 18px', background: '#FAFCFF' }}>
                  {comp.status === 'Upcoming' ? (
                    <div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: 'Barlow Condensed, sans-serif' }}>
                          Selected Entrants
                        </div>
                        {BISLEY_TEAM.map(member => (
                          <div key={member.shooterId} style={{
                            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                            padding: '8px 12px', background: 'white', borderRadius: 8, border: `1px solid ${border}`,
                          }}>
                            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: navy }}>{member.rank} {member.name}</div>
                            <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>{member.notes}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{
                        padding: '10px 14px',
                        background: '#FEF3C7',
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#92400E',
                        fontFamily: 'Barlow, sans-serif',
                        fontWeight: 600,
                      }}>
                        Upcoming — no results yet. Competition takes place {comp.date}.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, fontFamily: 'Barlow Condensed, sans-serif' }}>
                        Results
                      </div>
                      {/* Results header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: comp.results.some(r => r.position !== null) ? '0.5fr 2fr 1fr 2.5fr' : '2fr 1fr 2.5fr',
                        gap: 10,
                        padding: '6px 10px',
                        borderBottom: `1px solid ${border}`,
                        marginBottom: 4,
                      }}>
                        {comp.results.some(r => r.position !== null) && (
                          <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>Pos</div>
                        )}
                        <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>Shooter</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>Score</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>Notes</div>
                      </div>
                      {comp.results.map((r, i) => {
                        const sc = scoreColor(r.score);
                        const hasPositions = comp.results.some(r2 => r2.position !== null);
                        return (
                          <div key={i} style={{
                            display: 'grid',
                            gridTemplateColumns: hasPositions ? '0.5fr 2fr 1fr 2.5fr' : '2fr 1fr 2.5fr',
                            gap: 10,
                            padding: '8px 10px',
                            borderBottom: i < comp.results.length - 1 ? `1px solid ${border}` : 'none',
                            alignItems: 'center',
                          }}>
                            {hasPositions && (
                              <div style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontWeight: 800,
                                fontSize: 15,
                                color: r.position === 1 ? gold : navy,
                              }}>
                                {r.position !== null ? `#${r.position}` : '—'}
                              </div>
                            )}
                            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: navy }}>{r.name}</div>
                            <div>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: 'Barlow Condensed, sans-serif',
                                background: sc.bg,
                                color: sc.color,
                              }}>
                                {r.score}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif', lineHeight: 1.4 }}>{r.notes}</div>
                          </div>
                        );
                      })}
                      <div style={{ textAlign:'right', paddingTop:10, paddingRight:4 }}>
                        <button onClick={e => { e.stopPropagation(); printCompetitionReport(comp); }}
                          style={{ padding:'5px 14px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
                          📄 Print Results
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  // ── Practice Log tab ───────────────────────────────────────────────────

  function PracticeLogTab() {
    const sorted = [...PRACTICE_LOG].sort((a, b) => b.date.localeCompare(a.date));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(entry => {
          const absentShooters = SHOOTERS.filter(s => !entry.present.includes(s.id));
          const presentShooters = SHOOTERS.filter(s => entry.present.includes(s.id));

          return (
            <Card key={entry.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {/* Date + type */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 15, color: navy }}>
                      {entry.date}
                    </div>
                    <Badge
                      label={entry.type}
                      bg={entry.type.includes('300m') ? '#D1FAE5' : '#EEF6FF'}
                      color={entry.type.includes('300m') ? '#065F46' : '#1E40AF'}
                    />
                    <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                      {entry.location}
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ fontSize: 13, color: '#1A2A40', lineHeight: 1.55, marginBottom: 10, fontFamily: 'Barlow, sans-serif' }}>
                    {entry.notes}
                  </div>

                  {/* Present cadets */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Present:
                    </div>
                    {presentShooters.map(s => (
                      <span key={s.id} style={{
                        fontSize: 12, fontWeight: 600, color: '#065F46',
                        background: '#D1FAE5', padding: '1px 8px', borderRadius: 20,
                        fontFamily: 'Barlow Condensed, sans-serif',
                      }}>
                        {s.rank} {s.name}
                      </span>
                    ))}
                  </div>

                  {/* Absent cadets */}
                  {absentShooters.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: muted, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Absent:
                      </div>
                      {absentShooters.map(s => (
                        <span key={s.id} style={{
                          fontSize: 12, fontWeight: 600, color: '#92400E',
                          background: '#FEF3C7', padding: '1px 8px', borderRadius: 20,
                          fontFamily: 'Barlow Condensed, sans-serif',
                        }}>
                          {s.rank} {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Coach */}
                  <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                    <span style={{ fontWeight: 700 }}>Coach: </span>{entry.coach}
                  </div>
                </div>

                {/* Present count bubble */}
                <div style={{
                  textAlign: 'center',
                  minWidth: 52,
                  padding: '8px 10px',
                  background: '#F4F7FB',
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                  flexShrink: 0,
                }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800, color: navy }}>
                    {entry.present.length}
                  </div>
                  <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Present</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // ── Bisley Team tab ────────────────────────────────────────────────────

  function BisleyTab() {
    const bComp = COMPETITIONS.find(c => c.id === 'c3');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Banner */}
        <div style={{
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${navy} 0%, #003d7a 100%)`,
          borderRadius: 10,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            fontSize: 36,
            flexShrink: 0,
          }}>
            🎯
          </div>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 4, letterSpacing: '0.02em' }}>
              Bisley (NCSF) — National Cadet Shooting
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, fontFamily: 'Barlow, sans-serif', lineHeight: 1.5 }}>
              Bisley is the premier national cadet shooting competition, held annually at Bisley Camp, Surrey. 1701 Squadron cadets compete in the 300m Full Bore category under NCSF rules. Selection is based on classification, recent performance, and consistency.
            </div>
          </div>
        </div>

        {/* Travel / logistics */}
        <Card style={{ padding: '14px 18px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 15, color: navy, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Travel &amp; Logistics
          </div>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {[
              { label: 'Departs', value: '1 Aug 2026' },
              { label: 'Venue', value: 'Bisley Camp, Surrey' },
              { label: 'Returns', value: '6 Aug 2026' },
              { label: 'Duration', value: '5 nights' },
              { label: 'Transport', value: 'Wing minibus (TBC)' },
              { label: 'Accommodation', value: 'On-camp billets' },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: '10px 18px',
                borderLeft: i > 0 ? `1.5px solid ${border}` : 'none',
                minWidth: 120,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif', marginBottom: 3 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: navy }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Selected team */}
        <Card>
          <div style={{
            padding: '12px 18px',
            borderBottom: `1.5px solid ${border}`,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: 15,
            color: navy,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Selected Team</span>
            <Badge label={`${BISLEY_TEAM.length} selected`} bg="#EEF6FF" color="#1E40AF" />
          </div>

          {BISLEY_TEAM.map((member, idx) => {
            const shooter = SHOOTERS.find(s => s.id === member.shooterId);
            const cc = shooter ? CLASS_COLOR[shooter.class] : CLASS_COLOR['Unclassified'];

            return (
              <div key={member.shooterId} style={{
                padding: '14px 18px',
                borderBottom: idx < BISLEY_TEAM.length - 1 ? `1px solid ${border}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                {shooter && <Avatar ini={shooter.ini} size={38} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 15, color: navy }}>
                      {member.rank} {member.name}
                    </div>
                    {shooter && <Badge label={shooter.class} bg={cc.bg} color={cc.color} />}
                    {idx === 0 && (
                      <Badge label="Team Captain" bg={`${gold}22`} color={gold} />
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: muted, fontFamily: 'Barlow, sans-serif', marginBottom: 4 }}>
                    {member.notes}
                  </div>
                  {shooter && (
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                        <span style={{ fontWeight: 700 }}>Best score: </span>
                        <span style={{ color: scoreColor(shooter.bestScore).color, fontWeight: 700 }}>{shooter.bestScore}/200</span>
                      </div>
                      <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                        <span style={{ fontWeight: 700 }}>Total shots: </span>{shooter.totalShots}
                      </div>
                    </div>
                  )}
                </div>

                {shooter && (
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <ScoreSpark scores={shooter.recentScores} />
                    <div style={{ fontSize: 10, color: muted, fontFamily: 'Barlow, sans-serif', textAlign: 'center' }}>Recent form</div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>

        {/* Selection criteria */}
        <Card style={{ padding: '14px 18px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 14, color: navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Selection Criteria
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Minimum 1st Class classification required.',
              'Consistent performance across at least 5 qualification shoots.',
              'Priority given to higher classification (Marksman &gt; 1st Class).',
              'Team captain appointed by OC in consultation with CI Morrison.',
              'All team members must hold valid cadet documentation and parental consent.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#1A2A40', fontFamily: 'Barlow, sans-serif', lineHeight: 1.5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: navy, marginTop: 6, flexShrink: 0 }} />
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        </Card>

        {/* WTSA / NCSF info */}
        <Card style={{ padding: '14px 18px', background: '#F4F7FB' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, color: navy, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Governing Bodies
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, color: '#1E40AF', marginBottom: 2 }}>NCSF</div>
              <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>National Cadet Shooting Federation — organises Bisley and national competitions.</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, color: '#1E40AF', marginBottom: 2 }}>WTSA</div>
              <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>West Scotland Target Shooting Association — organises regional shoots and qualifiers.</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: 'Barlow, sans-serif' }}>
      {/* Page heading */}
      <div style={{ marginBottom: 20, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 24, color: navy, letterSpacing: '0.01em' }}>
            Shooting
          </div>
          <div style={{ fontSize: 13, color: muted, marginTop: 2 }}>
            25m Gallery · 300m Full Bore · WTSA Regional · Bisley NCSF
          </div>
        </div>
        <button onClick={printShootingRegister}
          style={{ padding:'8px 16px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif', flexShrink:0, marginTop:2 }}>
          📄 Print Register
        </button>
      </div>

      {/* Tab bar */}
      <TabBar
        tabs={TABS}
        active={tab}
        onChange={t => { setTab(t); setSelected(null); setSelectedComp(null); }}
      />

      {/* Tab content */}
      {tab === 'register'     && <RegisterTab />}
      {tab === 'competitions' && <CompetitionsTab />}
      {tab === 'practice'     && <PracticeLogTab />}
      {tab === 'bisley'       && <BisleyTab />}
    </div>
  );
}
