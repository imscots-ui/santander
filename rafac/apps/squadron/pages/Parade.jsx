import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';
import { PARADE_NIGHTS } from '../../../data/events.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const TONIGHT = [
  { time:'1900', activity:'Inspection & Roll Call', lead:'OC' },
  { time:'1910', activity:'Drill — About Turn & Saluting', lead:'Sgt Thomas' },
  { time:'1940', activity:'Airmanship: Aircraft Identification', lead:'Plt Off Smith' },
  { time:'2010', activity:'First Aid refresher — CPR', lead:'Sqn Ldr Harris' },
  { time:'2040', activity:'DofE briefing (Gold nominees)', lead:'OC' },
  { time:'2055', activity:'Dismiss', lead:'OC' },
];

export default function Parade({ showToast, addAudit }) {
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    CADETS.forEach(c => { init[c.id] = 'present'; });
    return init;
  });
  const [qrOpen, setQrOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState('');

  const present  = CADETS.filter(c => attendance[c.id] === 'present').length;
  const absent   = CADETS.filter(c => attendance[c.id] === 'absent').length;
  const apol     = CADETS.filter(c => attendance[c.id] === 'apology').length;

  function toggle(id) {
    setAttendance(prev => {
      const cycle = { present:'absent', absent:'apology', apology:'present' };
      return { ...prev, [id]: cycle[prev[id]] };
    });
  }

  const attStyle = {
    present: { bg:'#D4EDDA', color:'#0F4020', label:'P' },
    absent:  { bg:'#F8D7DA', color:'#8B1A1A', label:'A' },
    apology: { bg:'#FFF3CC', color:'#7A4A00', label:'E' },
  };

  function markAll(status) {
    const next = {};
    CADETS.forEach(c => { next[c.id] = status; });
    setAttendance(next);
  }

  function saveAttendance() {
    const p = CADETS.filter(c => attendance[c.id]==='present').length;
    const a = CADETS.filter(c => attendance[c.id]==='absent').length;
    const e = CADETS.filter(c => attendance[c.id]==='apology').length;
    addAudit?.(`Parade saved: ${p}P / ${a}A / ${e}E — ${Math.round((p/CADETS.length)*100)}% attendance`, 'Parade');
    showToast(`✅ Attendance saved — ${p} present, ${a} absent, ${e} excused`);
    setSaved(true);
  }

  function printAttendance() {
    const dateStr = 'Thursday 18 June 2026';
    const totalP = CADETS.filter(c => attendance[c.id] === 'present').length;
    const totalA = CADETS.filter(c => attendance[c.id] === 'absent').length;
    const totalE = CADETS.filter(c => attendance[c.id] === 'apology').length;
    const pct = Math.round((totalP / CADETS.length) * 100);
    const rows = CADETS.map(c => {
      const st = attendance[c.id] || 'present';
      const label = st === 'present' ? 'P' : st === 'absent' ? 'A' : 'E';
      const rowBg = st === 'absent' ? 'background:#fee2e2' : st === 'apology' ? 'background:#fef3c7' : '';
      return `<tr style="${rowBg}">
        <td style="padding:7px 10px;font-size:11px;border-bottom:1px solid #E8ECF5;font-family:'Barlow Condensed',sans-serif;font-weight:700">${c.rank}</td>
        <td style="padding:7px 10px;font-size:12px;border-bottom:1px solid #E8ECF5">${c.sn}, ${c.fn}</td>
        <td style="padding:7px 10px;text-align:center;font-weight:700;font-size:13px;border-bottom:1px solid #E8ECF5;font-family:'Barlow Condensed',sans-serif">${label}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;min-width:120px">&nbsp;</td>
      </tr>`;
    }).join('');
    const tonight = TONIGHT.map(t => `<tr>
      <td style="padding:6px 10px;font-weight:700;font-size:12px;border-bottom:1px solid #E8ECF5;font-family:'Barlow Condensed',sans-serif;color:#00264D">${t.time}</td>
      <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #E8ECF5">${t.activity}</td>
      <td style="padding:6px 10px;font-size:11px;border-bottom:1px solid #E8ECF5;color:#5A7090">${t.lead}</td>
    </tr>`).join('');
    const statBox = (label, value, bg, color) =>
      `<div style="background:${bg};border-radius:8px;padding:10px 18px;text-align:center;min-width:80px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:${color};line-height:1">${value}</div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${color};margin-top:3px;opacity:0.8">${label}</div>
      </div>`;
    const html = `<!DOCTYPE html><html><head>
<title>1701 Sqn Attendance — ${dateStr}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 14mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Barlow', sans-serif; color: #0D1B2E; margin: 0; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  .header-title { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 800; color: #00264D; margin: 0; }
  .header-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; color: #5A7090; margin: 3px 0 0; }
  .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 800; color: #00264D; text-transform: uppercase; letter-spacing: 0.06em; margin: 16px 0 8px; }
  th { background: #F4F7FB; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A7090; padding: 8px 10px; text-align: left; border-bottom: 2px solid #D0DCF0; }
  .footer { font-size: 9px; color: #8A9AB8; margin-top: 16px; padding-top: 8px; border-top: 1px solid #E8ECF5; }
  .sig-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A7090; margin-bottom: 3px; }
  .sig-line { border-bottom: 1px solid #5A7090; height: 30px; }
  .sig-name { font-size: 10px; color: #5A7090; margin-top: 4px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>
<div style="display:flex;align-items:center;gap:14px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:14px">
  <div style="font-size:36px;line-height:1">✈️</div>
  <div>
    <div class="header-title">1701 (Johnstone) Squadron ATC</div>
    <div class="header-sub">Parade Night Attendance &middot; ${dateStr}</div>
  </div>
</div>

<div style="display:flex;gap:10px;margin-bottom:16px">
  ${statBox('Present',  totalP, '#D4EDDA', '#0F4020')}
  ${statBox('Absent',   totalA, '#F8D7DA', '#8B1A1A')}
  ${statBox('Excused',  totalE, '#FFF3CC', '#7A4A00')}
  ${statBox('Strength', CADETS.length, '#EAF4FF', '#00264D')}
  ${statBox('Attendance', pct + '%', '#00264D', '#C8A032')}
</div>

<div class="section-label">Roll Call</div>
<table>
  <thead><tr>
    <th style="width:90px">Rank</th>
    <th>Name</th>
    <th style="width:54px;text-align:center">Status</th>
    <th style="width:160px">Signature</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>

<div class="section-label" style="margin-top:20px">Tonight's Programme</div>
<table>
  <thead><tr>
    <th style="width:60px">Time</th>
    <th>Activity</th>
    <th style="width:140px">Lead</th>
  </tr></thead>
  <tbody>${tonight}</tbody>
</table>

${notes ? `<div class="section-label" style="margin-top:18px">Parade Notes</div><div style="font-size:12px;color:#0D1B2E;padding:10px 12px;background:#F4F7FB;border-radius:6px;border:1px solid #D0DCF0">${notes}</div>` : ''}

<div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px">
  <div>
    <div class="sig-label">Officer Commanding</div>
    <div class="sig-line"></div>
    <div class="sig-name">Flt Lt A. McDonald</div>
  </div>
  <div>
    <div class="sig-label">Date</div>
    <div class="sig-line"></div>
    <div class="sig-name">&nbsp;</div>
  </div>
  <div></div>
</div>

<div class="footer">OFFICIAL &nbsp;&middot;&nbsp; GDPR DPA 2018 applies &nbsp;&middot;&nbsp; Printed: ${new Date().toLocaleString('en-GB')}</div>
</body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
    addAudit && addAudit(`Parade attendance sheet printed — ${dateStr}`, 'Parade');
    showToast && showToast('🖨️ Print dialogue opening…');
  }

  function exportCSV() {
    const total = CADETS.length;
    const header = 'Date,Session,Present,Absent,Attendance %\n';
    const rows = PARADE_NIGHTS.map(p => {
      const pct = Math.round((p.cadets.length / total) * 100);
      return `"${p.date}","${p.label}",${p.cadets.length},${total - p.cadets.length},${pct}%`;
    }).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '1701-attendance-history.csv';
    a.click();
    URL.revokeObjectURL(url);
    addAudit?.('Attendance CSV exported', 'Parade', `${PARADE_NIGHTS.length} parades`);
    showToast('📥 CSV downloaded: 1701-attendance-history.csv');
  }

  const lowAtt = CADETS.filter(c => c.att < 75);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Parade Night</div>
          <div style={{ fontSize:12, color:muted }}>Thursday 18 June 2026 · 1701 (Johnstone) Squadron</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setQrOpen(true)} style={{ padding:'8px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>📲 QR Check-in</button>
          <button onClick={printAttendance} style={{ padding:'8px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>🖨️ Print sheet</button>
          <button onClick={exportCSV} style={{ padding:'8px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📥 Export CSV</button>
        </div>
      </div>

      {/* Welfare alert */}
      {lowAtt.length > 0 && (
        <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:10, alignItems:'flex-start' }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, color:'#92400E', fontSize:13, marginBottom:4 }}>Low attendance — welfare check recommended</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {lowAtt.map(c => (
                <span key={c.id} style={{ background:'#FDE68A', color:'#78350F', fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:20 }}>
                  {c.rank} {c.sn} ({c.att}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
        {[
          { label:'On parade', value:present, color:'#1B6B3A', bg:'#D4EDDA' },
          { label:'Absent',    value:absent,  color:'#8B1A1A', bg:'#F8D7DA' },
          { label:'Excused',   value:apol,    color:'#7A4A00', bg:'#FFF3CC' },
          { label:'Strength',  value:CADETS.length, color:navy, bg:'#EAF4FF' },
        ].map(t => (
          <div key={t.label} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.color }}>{t.value}</div>
            <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Attendance grid */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy }}>Roll Call</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => markAll('present')} style={{ padding:'5px 12px', background:'#D4EDDA', color:'#0F4020', border:'1px solid #A7D5B4', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>All Present</button>
            <button onClick={() => markAll('absent')} style={{ padding:'5px 12px', background:'#F8D7DA', color:'#8B1A1A', border:'1px solid #F0B0B5', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>All Absent</button>
          </div>
        </div>
        <div style={{ fontSize:11, color:muted, marginBottom:14 }}>Click a cadet to cycle: Present → Absent → Excused</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:10 }}>
          {CADETS.map(c => {
            const st = attStyle[attendance[c.id]];
            return (
              <div key={c.id} onClick={() => toggle(c.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:`1.5px solid ${border}`, borderRadius:8, cursor:'pointer', background:'white', transition:'border-color 0.1s', userSelect:'none' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:st.bg, color:st.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 }}>{st.label}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#0D1B2E' }}>{c.sn}, {c.fn}</div>
                  <div style={{ fontSize:10, color:muted }}>{c.rank}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tonight's programme */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Tonight's Programme</div>
        {TONIGHT.map((t, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 0', borderBottom: i < TONIGHT.length-1 ? `1px solid ${border}` : 'none' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800, color:navy, minWidth:36 }}>{t.time}</div>
            <div style={{ flex:1, fontSize:13, color:'#0D1B2E' }}>{t.activity}</div>
            <div style={{ fontSize:11, color:muted }}>{t.lead}</div>
          </div>
        ))}
      </div>

      {/* Notes + save */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:10 }}>Parade Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Record what was covered tonight, any issues, reminders for next week…"
          style={{ width:'100%', padding:'10px 12px', border:`1.5px solid ${border}`, borderRadius:8, fontSize:13, minHeight:80, resize:'vertical', fontFamily:'Barlow,sans-serif', boxSizing:'border-box', marginBottom:12 }} />
        <button onClick={saveAttendance}
          style={{ padding:'10px 24px', background: saved ? '#1B6B3A' : navy, color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {saved ? '✅ Attendance saved' : '💾 Save tonight\'s attendance'}
        </button>
      </div>

      {/* Historical */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy }}>Attendance Trend</div>
          <div style={{ fontSize:11, color:muted }}>Last {PARADE_NIGHTS.length} sessions · {CADETS.length} on strength</div>
        </div>

        {/* SVG trend chart */}
        {(() => {
          const total = CADETS.length;
          const pts = [...PARADE_NIGHTS].reverse(); // oldest → newest
          const pcts = pts.map(p => Math.round((p.cadets.length / total) * 100));
          const avgPct = Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length);
          const chartH = 64, chartW = '100%';
          const barW = Math.floor(100 / pts.length);
          return (
            <div style={{ marginBottom:18 }}>
              {/* Bar chart */}
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:68, paddingBottom:18, position:'relative' }}>
                {/* 75% guideline */}
                <div style={{ position:'absolute', bottom:18 + Math.round((75/100)*chartH) - 1, left:0, right:0, borderTop:'1.5px dashed #D0DCF0', zIndex:0 }} />
                {pts.map((p, i) => {
                  const pct = pcts[i];
                  const barH = Math.max(4, Math.round((pct / 100) * chartH));
                  const barColor = pct >= 85 ? '#1B6B3A' : pct >= 70 ? '#C8A032' : '#C8102E';
                  const shortDate = p.date.replace(' 2026', '').replace(' 2026', '');
                  return (
                    <div key={i} title={`${p.date}: ${pct}% (${p.cadets.length}/${total})`}
                      style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'default' }}>
                      <div style={{ fontSize:9, color: pct >= 85 ? '#1B6B3A' : pct >= 70 ? '#7A4A00' : '#8B1A1A', fontWeight:700 }}>{pct}%</div>
                      <div style={{ width:'100%', height:barH, background:barColor, borderRadius:'3px 3px 0 0', minHeight:4 }} />
                      <div style={{ fontSize:8, color:muted, textAlign:'center', lineHeight:1.2, marginTop:2 }}>{shortDate}</div>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div style={{ display:'flex', gap:14, fontSize:10, color:muted, marginTop:4 }}>
                <span>Avg <strong style={{ color:navy }}>{avgPct}%</strong></span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:4, background:'#1B6B3A', borderRadius:2, display:'inline-block' }} /> ≥85%</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:4, background:'#C8A032', borderRadius:2, display:'inline-block' }} /> 70–84%</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:4, background:'#C8102E', borderRadius:2, display:'inline-block' }} /> &lt;70%</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:14, borderTop:'1.5px dashed #D0DCF0', display:'inline-block' }} /> 75% target</span>
              </div>
            </div>
          );
        })()}

        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ borderBottom:`2px solid ${border}` }}>
            {['Date','Session','Present','Absent','Att %'].map(h=><th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {PARADE_NIGHTS.map((p, i) => {
              const pct = Math.round((p.cadets.length / CADETS.length) * 100);
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                  <td style={{ padding:'9px 12px', fontWeight:700, fontSize:12 }}>{p.date}</td>
                  <td style={{ padding:'9px 12px', fontSize:12 }}>{p.label}</td>
                  <td style={{ padding:'9px 12px', color:'#1B6B3A', fontWeight:700 }}>{p.cadets.length}</td>
                  <td style={{ padding:'9px 12px', color:'#8B1A1A' }}>{CADETS.length - p.cadets.length}</td>
                  <td style={{ padding:'9px 12px' }}>
                    <span style={{ fontWeight:700, color: pct>=85 ? '#1B6B3A' : pct>=70 ? '#7A4A00' : '#8B1A1A' }}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* QR modal */}
      {qrOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'white', borderRadius:12, padding:32, maxWidth:340, width:'100%', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:20, fontWeight:800, color:navy, marginBottom:8 }}>QR Check-in</div>
            <div style={{ fontSize:13, color:muted, marginBottom:20 }}>Cadets scan this code on arrival to mark themselves present</div>
            <div style={{ width:160, height:160, background:'#F4F7FB', border:`2px solid ${border}`, borderRadius:12, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:40 }}>📲</div>
              <div style={{ fontSize:10, color:muted, fontWeight:700 }}>QR CODE</div>
              <div style={{ fontSize:9, color:muted }}>1701 · 18 Jun 2026</div>
            </div>
            <div style={{ background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:8, padding:'10px', fontSize:12, color:muted, marginBottom:20 }}>
              {present} checked in · session active
            </div>
            <button onClick={() => setQrOpen(false)} style={{ padding:'10px 28px', background:navy, color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
