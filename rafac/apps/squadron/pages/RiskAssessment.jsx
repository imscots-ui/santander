import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const HAZARD_CATEGORIES = ['Physical', 'Environmental', 'Medical', 'Navigation', 'Equipment', 'Behavioural', 'Transport', 'Weather'];

const SEED_ASSESSMENTS = [
  {
    id: 'ra1',
    activity: 'Silver Fieldcraft (WSW)',
    date: '27–28 Jun 2026',
    location: 'Tinto Hill, Lanarkshire',
    type: 'AT',
    status: 'Approved',
    signedBy: 'Sqn Ldr Harris',
    signedDate: '2026-06-10',
    personsAtRisk: ['Cadets (3)', 'Staff (2)'],
    supervisor: 'Sqn Ldr Harris',
    hazards: [
      { id:'h1', hazard:'Twisted ankle / trip on uneven ground', category:'Physical', likelihood:3, severity:3, controls:'Cadets to wear ankle-support boots. Route briefed in advance. First aid kit carried by supervisor. Buddy system enforced.', residualL:2, residualS:2 },
      { id:'h2', hazard:'Exposure / hypothermia', category:'Environmental', likelihood:2, severity:4, controls:'Weather forecast checked 24h before. All cadets to carry waterproofs, spare warm layer, emergency bivvy. Supervisor has group shelter. Activity cancelled if sustained rain + <10°C forecast.', residualL:1, residualS:3 },
      { id:'h3', hazard:'Navigation error / group separation', category:'Navigation', likelihood:2, severity:4, controls:'Cadets briefed on route. Checkpoints at known features. Supervisor to remain in comms range. Emergency RV point established. Mobile phone signal checked at start.', residualL:1, residualS:3 },
      { id:'h4', hazard:'Medical emergency (cadet)', category:'Medical', likelihood:1, severity:5, controls:'TG23 forms reviewed — no known conditions. Emergency contact numbers held. Nearest A&E confirmed (Law Hospital, 18 min). Casualty evacuation route planned.', residualL:1, residualS:4 },
    ],
  },
  {
    id: 'ra2',
    activity: 'Gliding Scholarship',
    date: '3–7 Aug 2026',
    location: 'Dalton Airfield, Yorkshire',
    type: 'Flying',
    status: 'Draft',
    signedBy: null,
    signedDate: null,
    personsAtRisk: ['Cadets (3)', 'Staff (1)'],
    supervisor: 'Flt Lt Baxter',
    hazards: [
      { id:'h5', hazard:'Aircraft incident during flight', category:'Equipment', likelihood:1, severity:5, controls:'All flying conducted by qualified AEF instructors. Aircraft maintained to CAA/MOD standards. Cadets briefed on brace position and emergency exits. Flying Medical (AVMED) completed for all cadets.', residualL:1, residualS:4 },
      { id:'h6', hazard:'Airside vehicle / aircraft ground movement', category:'Transport', likelihood:2, severity:4, controls:'Cadets escorted airside at all times by staff. High-vis vests worn when airside. Briefed on airside rules before entry. Never cross runways without clearance.', residualL:1, residualS:3 },
      { id:'h7', hazard:'Motion sickness during flight', category:'Medical', likelihood:3, severity:2, controls:'Cadets advised to eat lightly before flights. Sick bags available. Flight terminated early if cadet unwell. No flights within 24h of any illness.', residualL:2, residualS:2 },
    ],
  },
];

function riskColor(score) {
  if (score <= 4)  return { bg:'#D1FAE5', color:'#065F46', label:'LOW' };
  if (score <= 9)  return { bg:'#FEF3C7', color:'#92400E', label:'MEDIUM' };
  if (score <= 14) return { bg:'#FEE2E2', color:'#991B1B', label:'HIGH' };
  return { bg:'#7F1D1D', color:'white', label:'CRITICAL' };
}

export default function RiskAssessment({ showToast, addAudit }) {
  const [assessments, setAssessments] = useState(SEED_ASSESSMENTS);
  const [selected, setSelected] = useState(null);
  const [showNewHA, setShowNewHA] = useState(false);
  const [newHazard, setNewHazard] = useState({ hazard:'', category:'Physical', likelihood:3, severity:3, controls:'', residualL:2, residualS:2 });
  const [showNewRA, setShowNewRA] = useState(false);
  const [newRA, setNewRA] = useState({ activity:'', date:'', location:'', type:'AT', supervisor:'Sqn Ldr Harris' });

  const selectedRA = assessments.find(a => a.id === selected);

  function handleCreateRA() {
    if (!newRA.activity.trim()) { showToast('Activity name is required.'); return; }
    const id = 'ra' + Date.now();
    const created = {
      id,
      activity: newRA.activity.trim(),
      date: newRA.date.trim() || 'TBC',
      location: newRA.location.trim() || 'TBC',
      type: newRA.type,
      status: 'Draft',
      signedBy: null,
      signedDate: null,
      personsAtRisk: [],
      supervisor: newRA.supervisor.trim() || 'TBC',
      hazards: [],
    };
    setAssessments(prev => [created, ...prev]);
    setNewRA({ activity:'', date:'', location:'', type:'AT', supervisor:'Sqn Ldr Harris' });
    setShowNewRA(false);
    showToast(`Draft created: ${created.activity}`);
  }

  function handleAddHazard() {
    if (!newHazard.hazard.trim()) { showToast('Hazard description is required.'); return; }
    if (!newHazard.controls.trim()) { showToast('Control measures are required.'); return; }
    const hazardEntry = {
      id: 'h' + Date.now(),
      hazard: newHazard.hazard.trim(),
      category: newHazard.category,
      likelihood: newHazard.likelihood,
      severity: newHazard.severity,
      controls: newHazard.controls.trim(),
      residualL: newHazard.residualL,
      residualS: newHazard.residualS,
    };
    setAssessments(prev => prev.map(a =>
      a.id === selected ? { ...a, hazards: [...a.hazards, hazardEntry] } : a
    ));
    setNewHazard({ hazard:'', category:'Physical', likelihood:3, severity:3, controls:'', residualL:2, residualS:2 });
    setShowNewHA(false);
    showToast('Hazard added to risk register.');
  }

  function handleApprove() {
    const today = new Date().toISOString().slice(0, 10);
    setAssessments(prev => prev.map(a =>
      a.id === selected ? { ...a, status:'Approved', signedBy:'OC Harris', signedDate: today } : a
    ));
    addAudit?.('Risk Assessment Approved', selectedRA?.activity, `Signed off by OC Harris · ${today}`);
    showToast(`Risk assessment approved and signed off.`);
  }

  function printRA() {
    const ra = selectedRA;
    if (!ra) return;
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const maxScore = ra.hazards.reduce((max, h) => Math.max(max, h.likelihood * h.severity), 0);
    const maxResidual = ra.hazards.reduce((max, h) => Math.max(max, h.residualL * h.residualS), 0);
    const ratingLabel = s => s <= 4 ? 'LOW' : s <= 9 ? 'MEDIUM' : s <= 14 ? 'HIGH' : 'CRITICAL';
    const ratingStyle = s => {
      if (s <= 4)  return 'background:#D1FAE5;color:#065F46';
      if (s <= 9)  return 'background:#FEF3C7;color:#92400E';
      if (s <= 14) return 'background:#FEE2E2;color:#991B1B';
      return 'background:#7F1D1D;color:white';
    };
    const hazardRows = ra.hazards.map((h, i) => {
      const init = h.likelihood * h.severity;
      const resid = h.residualL * h.residualS;
      return `<tr style="background:${i%2?'#fafcfe':'white'};vertical-align:top">
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;font-weight:700;font-size:12px;color:#00264D">${h.hazard}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;white-space:nowrap"><span style="background:#EFF2F7;color:#5A7090;padding:2px 7px;border-radius:7px;font-size:10px;font-weight:700">${h.category}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:15px">${h.likelihood}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:15px">${h.severity}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;white-space:nowrap"><span style="padding:3px 9px;border-radius:7px;font-size:11px;font-weight:800;${ratingStyle(init)}">${init} · ${ratingLabel(init)}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;font-size:11.5px;color:#1E293B;line-height:1.55;max-width:280px">${h.controls}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:15px">${h.residualL}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:15px">${h.residualS}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8ECF5;white-space:nowrap"><span style="padding:3px 9px;border-radius:7px;font-size:11px;font-weight:800;${ratingStyle(resid)}">${resid} · ${ratingLabel(resid)}</span></td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Risk Assessment — ${ra.activity}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 landscape;margin:12mm 14mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#00264D;background:white;font-size:12px;margin:0}
.hdr{display:flex;align-items:flex-start;gap:14px;padding-bottom:10px;border-bottom:3px solid #C8A032;margin-bottom:12px}
.sqn{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:800}
.sub{font-size:11px;color:#5A7090;margin-top:2px}
.doc-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;margin-left:auto;text-align:right}
.meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}
.meta-box{background:#F5F8FF;border:1.5px solid #D0DCF0;border-radius:7px;padding:9px 12px}
.meta-label{font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
.meta-val{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D}
.persons{background:#FFF3CC;border:1px solid #FDE68A;border-radius:7px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#92400E;font-weight:600}
.status-bar{display:flex;align-items:center;gap:12px;padding:8px 14px;border-radius:7px;margin-bottom:12px;font-size:12px;font-weight:700}
.section-title{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#00264D;border-bottom:2px solid #D0DCF0;padding-bottom:5px;margin-bottom:0;letter-spacing:.03em}
table{width:100%;border-collapse:collapse}
thead tr{background:#F4F7FB}
th{padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#5A7090;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #D0DCF0;white-space:nowrap}
th.c{text-align:center}
.legend{display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap}
.sig-row{display:flex;gap:24px;margin-top:14px;padding-top:10px;border-top:2px solid #C8A032}
.sig-block{flex:1}
.sig-line{border-bottom:1px solid #00264D;height:34px;margin-bottom:4px}
.sig-label{font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.sig-name{font-size:11.5px;font-weight:700;color:#00264D;margin-top:2px}
.reg-note{margin-top:10px;padding:8px 12px;background:#EAF4FF;border:1px solid #B3D4F0;border-radius:7px;font-size:10.5px;color:#003D80}
.footer{margin-top:10px;padding-top:7px;border-top:1px solid #D0DCF0;font-size:9px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="hdr">
  <span style="font-size:38px">✈️</span>
  <div>
    <div class="sqn">1701 (Johnstone) Squadron ATC</div>
    <div class="sub">Royal Air Force Air Cadets · Risk Assessment (RA) Form · JSP 375 / RAFAC AP 1919</div>
  </div>
  <div class="doc-title">Risk Assessment<br><span style="font-size:14px;color:#5A7090;font-weight:600">${ra.activity}</span></div>
</div>
<div class="meta-grid">
  <div class="meta-box"><div class="meta-label">Activity</div><div class="meta-val">${ra.activity}</div></div>
  <div class="meta-box"><div class="meta-label">Date(s)</div><div class="meta-val">${ra.date}</div></div>
  <div class="meta-box"><div class="meta-label">Location</div><div class="meta-val">${ra.location}</div></div>
  <div class="meta-box"><div class="meta-label">Supervisor</div><div class="meta-val">${ra.supervisor}</div></div>
</div>
<div class="meta-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:10px">
  <div class="meta-box"><div class="meta-label">Persons at Risk</div><div class="meta-val">${ra.personsAtRisk.join(', ')||'—'}</div></div>
  <div class="meta-box"><div class="meta-label">Max Initial Risk</div><div class="meta-val"><span style="padding:3px 10px;border-radius:7px;font-size:13px;font-weight:800;${ratingStyle(maxScore)}">${maxScore} · ${ratingLabel(maxScore)}</span></div></div>
  <div class="meta-box"><div class="meta-label">Max Residual Risk</div><div class="meta-val"><span style="padding:3px 10px;border-radius:7px;font-size:13px;font-weight:800;${ratingStyle(maxResidual)}">${maxResidual} · ${ratingLabel(maxResidual)}</span></div></div>
</div>
${ra.status === 'Approved' ? `<div class="status-bar" style="background:#D1FAE5;color:#065F46">✅ APPROVED — Signed off by ${ra.signedBy} on ${ra.signedDate}. Activity may proceed.</div>` : `<div class="status-bar" style="background:#FEF3C7;color:#92400E">⚠ DRAFT — This assessment requires OC sign-off before the activity commences.</div>`}
<div class="section-title">Hazard Register (${ra.hazards.length} hazard${ra.hazards.length !== 1 ? 's' : ''})</div>
<table>
  <thead><tr>
    <th>Hazard</th><th>Category</th>
    <th class="c">L</th><th class="c">S</th><th>Initial Rating</th>
    <th>Control Measures</th>
    <th class="c">L</th><th class="c">S</th><th>Residual Rating</th>
  </tr></thead>
  <tbody>${hazardRows || '<tr><td colspan="9" style="padding:14px;text-align:center;color:#5A7090">No hazards logged for this assessment.</td></tr>'}</tbody>
</table>
<div class="legend">
  <span style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase">Rating scale (L × S):</span>
  <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;background:#D1FAE5;color:#065F46">LOW (1–4)</span>
  <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;background:#FEF3C7;color:#92400E">MEDIUM (5–9)</span>
  <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;background:#FEE2E2;color:#991B1B">HIGH (10–14)</span>
  <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;background:#7F1D1D;color:white">CRITICAL (15–25)</span>
  <span style="font-size:10px;color:#5A7090;margin-left:6px">L = Likelihood · S = Severity</span>
</div>
<div class="sig-row">
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Supervisor / Activity Leader</div><div class="sig-name">${ra.supervisor}</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Officer Commanding</div><div class="sig-name">${ra.status === 'Approved' ? ra.signedBy : 'Flt Lt A. McDonald'}</div><div class="sig-label">1701 (Johnstone) Squadron ATC</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Wing AT / Actitivies Officer</div><div class="sig-name">________________________</div><div class="sig-label">West of Scotland Wing ATC</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Date Approved</div><div class="sig-name">${ra.signedDate || dateStr}</div></div>
</div>
<div class="reg-note">This risk assessment is produced in accordance with JSP 375 (MOD Health & Safety Handbook) and RAFAC AP 1919. It must be approved and signed by the OC before the activity commences. A copy must be held at the activity venue and at squadron HQ. Review this assessment if circumstances change.</div>
<div class="footer">1701-RA-${ra.id.toUpperCase()} · OFFICIAL · JSP 375 / RAFAC AP 1919 · ${dateStr} · West of Scotland Wing ATC</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Risk Assessment printed', ra.activity, `Printed by OC · ${dateStr}`);
    showToast && showToast(`🖨️ Risk assessment printing: ${ra.activity}…`);
  }

  const Pill = ({ children, bg, color, fontSize }) => (
    <span style={{ background:bg, color, padding:'2px 9px', borderRadius:10, fontSize: fontSize || 10, fontWeight:700, whiteSpace:'nowrap' }}>{children}</span>
  );

  const RiskBadge = ({ score }) => {
    const rc = riskColor(score);
    return (
      <span style={{ background:rc.bg, color:rc.color, padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:800, letterSpacing:'0.04em', border: score >= 15 ? '1px solid #7F1D1D' : 'none' }}>
        {score} · {rc.label}
      </span>
    );
  };

  const typeColors = {
    AT:      { bg:'#D4EDDA', color:'#0F4020' },
    Flying:  { bg:'#DBEAFE', color:'#1E3A8A' },
    Parade:  { bg:'#EDE9FE', color:'#4C1D95' },
    Other:   { bg:'#F3F4F6', color:'#374151' },
  };

  const SliderRow = ({ label, value, onChange }) => (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
        <label style={{ fontSize:12, fontWeight:700, color:muted }}>{label}</label>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy, minWidth:20, textAlign:'right' }}>{value}</span>
      </div>
      <input type="range" min={1} max={5} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width:'100%', accentColor:navy }} />
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:muted }}>
        <span>1 — Very Low</span><span>5 — Very High</span>
      </div>
    </div>
  );

  // ── OVERVIEW ──────────────────────────────────────────────────────────────────
  if (selected === null) {
    return (
      <div>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Risk Assessments</div>
            <div style={{ fontSize:12, color:muted, marginTop:2 }}>Pre-activity documentation — required before all AT and flying activities</div>
          </div>
          <button
            onClick={() => setShowNewRA(true)}
            style={{ padding:'8px 18px', background:gold, color:navy, border:'none', borderRadius:8, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>
            + New Assessment
          </button>
        </div>

        {/* New RA form */}
        {showNewRA && (
          <div style={{ background:'white', border:`1.5px solid ${gold}`, borderRadius:10, padding:20, marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:14 }}>New Risk Assessment</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>ACTIVITY NAME *</label>
                <input value={newRA.activity} onChange={e => setNewRA(p => ({ ...p, activity:e.target.value }))}
                  placeholder="e.g. Bronze Hill Walking"
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>DATE(S)</label>
                <input value={newRA.date} onChange={e => setNewRA(p => ({ ...p, date:e.target.value }))}
                  placeholder="e.g. 12–13 Sep 2026"
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>LOCATION</label>
                <input value={newRA.location} onChange={e => setNewRA(p => ({ ...p, location:e.target.value }))}
                  placeholder="e.g. Pentland Hills, Edinburgh"
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>TYPE</label>
                <select value={newRA.type} onChange={e => setNewRA(p => ({ ...p, type:e.target.value }))}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }}>
                  {['AT','Flying','Parade','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>SUPERVISING OFFICER</label>
                <input value={newRA.supervisor} onChange={e => setNewRA(p => ({ ...p, supervisor:e.target.value }))}
                  placeholder="e.g. Flt Lt Baxter"
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleCreateRA}
                style={{ padding:'8px 20px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
                Create Draft
              </button>
              <button onClick={() => { setShowNewRA(false); setNewRA({ activity:'', date:'', location:'', type:'AT', supervisor:'Sqn Ldr Harris' }); }}
                style={{ padding:'8px 16px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, background:'white', cursor:'pointer', color:muted }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:18 }}>
          {[
            { l:'Total Assessments', v:assessments.length, c:navy },
            { l:'Approved', v:assessments.filter(a=>a.status==='Approved').length, c:'#065F46' },
            { l:'Draft / Pending', v:assessments.filter(a=>a.status==='Draft').length, c:'#92400E' },
            { l:'Total Hazards Logged', v:assessments.reduce((s,a)=>s+a.hazards.length,0), c:muted },
          ].map(t => (
            <div key={t.l} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px' }}>
              <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.l}</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.c }}>{t.v}</div>
            </div>
          ))}
        </div>

        {/* Assessment cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {assessments.map(ra => {
            const tc = typeColors[ra.type] || typeColors.Other;
            const statusStyle = ra.status === 'Approved'
              ? { bg:'#D1FAE5', color:'#065F46' }
              : { bg:'#FEF3C7', color:'#92400E' };
            const maxScore = ra.hazards.length
              ? Math.max(...ra.hazards.map(h => h.likelihood * h.severity))
              : 0;
            const rc = maxScore ? riskColor(maxScore) : null;
            return (
              <div key={ra.id}
                onClick={() => setSelected(ra.id)}
                style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:16, transition:'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(0,38,77,0.10)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                {/* Left: activity info */}
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>{ra.activity}</span>
                    <Pill bg={tc.bg} color={tc.color}>{ra.type}</Pill>
                    <Pill bg={statusStyle.bg} color={statusStyle.color}>{ra.status}</Pill>
                  </div>
                  <div style={{ fontSize:12, color:muted, marginBottom:2 }}>
                    <span style={{ marginRight:14 }}>📅 {ra.date}</span>
                    <span style={{ marginRight:14 }}>📍 {ra.location}</span>
                    <span>👤 {ra.supervisor}</span>
                  </div>
                  {ra.status === 'Approved' && ra.signedBy && (
                    <div style={{ fontSize:11, color:'#065F46', marginTop:2 }}>Signed off by {ra.signedBy} · {ra.signedDate}</div>
                  )}
                </div>
                {/* Middle: hazard count + max risk */}
                <div style={{ textAlign:'center', minWidth:80 }}>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:28, fontWeight:800, color:navy }}>{ra.hazards.length}</div>
                  <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>Hazards</div>
                  {rc && (
                    <div style={{ marginTop:4 }}>
                      <span style={{ background:rc.bg, color:rc.color, padding:'2px 8px', borderRadius:7, fontSize:10, fontWeight:800 }}>Max: {rc.label}</span>
                    </div>
                  )}
                </div>
                {/* Chevron */}
                <div style={{ color:muted, fontSize:18 }}>›</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ───────────────────────────────────────────────────────────────
  if (!selectedRA) { setSelected(null); return null; }

  const tc = typeColors[selectedRA.type] || typeColors.Other;
  const statusStyle = selectedRA.status === 'Approved'
    ? { bg:'#D1FAE5', color:'#065F46' }
    : { bg:'#FEF3C7', color:'#92400E' };

  return (
    <div>
      {/* Back + header */}
      <div style={{ marginBottom:18 }}>
        <button onClick={() => { setSelected(null); setShowNewHA(false); }}
          style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:13, fontWeight:700, padding:0, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
          ‹ Back to Risk Assessments
        </button>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>{selectedRA.activity}</span>
              <Pill bg={tc.bg} color={tc.color}>{selectedRA.type}</Pill>
              <Pill bg={statusStyle.bg} color={statusStyle.color}>{selectedRA.status}</Pill>
            </div>
            <div style={{ fontSize:12, color:muted }}>
              <span style={{ marginRight:16 }}>📅 {selectedRA.date}</span>
              <span style={{ marginRight:16 }}>📍 {selectedRA.location}</span>
              <span style={{ marginRight:16 }}>👤 {selectedRA.supervisor}</span>
              {selectedRA.personsAtRisk.length > 0 && (
                <span>⚠ Persons at risk: {selectedRA.personsAtRisk.join(', ')}</span>
              )}
            </div>
            {selectedRA.status === 'Approved' && selectedRA.signedBy && (
              <div style={{ fontSize:12, color:'#065F46', fontWeight:700, marginTop:4 }}>
                ✅ Approved by {selectedRA.signedBy} · {selectedRA.signedDate}
              </div>
            )}
          </div>
          <div style={{ display:'flex', gap:10, flexShrink:0 }}>
            {selectedRA.status === 'Draft' && (
              <button onClick={handleApprove}
                style={{ padding:'9px 20px', background:navy, color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.03em' }}>
                ✅ Approve & Sign Off
              </button>
            )}
            <button onClick={printRA}
              style={{ padding:'9px 18px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
              🖨️ Print RA
            </button>
            <button onClick={() => setShowNewHA(v => !v)}
              style={{ padding:'9px 18px', background:gold, color:navy, border:'none', borderRadius:8, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.03em' }}>
              + Add Hazard
            </button>
          </div>
        </div>
      </div>

      {/* Add Hazard form */}
      {showNewHA && (
        <div style={{ background:'white', border:`1.5px solid ${gold}`, borderRadius:10, padding:20, marginBottom:20 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:800, color:navy, marginBottom:14 }}>Add Hazard to Risk Register</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            {/* Left column */}
            <div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>HAZARD DESCRIPTION *</label>
                <input value={newHazard.hazard} onChange={e => setNewHazard(p => ({ ...p, hazard:e.target.value }))}
                  placeholder="e.g. Slip on wet rock surface"
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>CATEGORY</label>
                <select value={newHazard.category} onChange={e => setNewHazard(p => ({ ...p, category:e.target.value }))}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box' }}>
                  {HAZARD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:muted, display:'block', marginBottom:4 }}>CONTROL MEASURES *</label>
                <textarea value={newHazard.controls} onChange={e => setNewHazard(p => ({ ...p, controls:e.target.value }))}
                  placeholder="List all control measures in place to reduce this hazard…"
                  rows={4}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', boxSizing:'border-box', resize:'vertical' }} />
              </div>
            </div>
            {/* Right column */}
            <div>
              <div style={{ background:'#F4F7FB', borderRadius:8, padding:'14px 16px', marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:muted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Initial Risk (before controls)</div>
                <SliderRow label="Likelihood" value={newHazard.likelihood} onChange={v => setNewHazard(p => ({ ...p, likelihood:v }))} />
                <SliderRow label="Severity" value={newHazard.severity} onChange={v => setNewHazard(p => ({ ...p, severity:v }))} />
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8, paddingTop:8, borderTop:`1px solid ${border}` }}>
                  <span style={{ fontSize:12, fontWeight:700, color:muted }}>Initial Rating</span>
                  <RiskBadge score={newHazard.likelihood * newHazard.severity} />
                </div>
              </div>
              <div style={{ background:'#F4F7FB', borderRadius:8, padding:'14px 16px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:muted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Residual Risk (after controls)</div>
                <SliderRow label="Likelihood" value={newHazard.residualL} onChange={v => setNewHazard(p => ({ ...p, residualL:v }))} />
                <SliderRow label="Severity" value={newHazard.residualS} onChange={v => setNewHazard(p => ({ ...p, residualS:v }))} />
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8, paddingTop:8, borderTop:`1px solid ${border}` }}>
                  <span style={{ fontSize:12, fontWeight:700, color:muted }}>Residual Rating</span>
                  <RiskBadge score={newHazard.residualL * newHazard.residualS} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={handleAddHazard}
              style={{ padding:'8px 20px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
              Add to Register
            </button>
            <button onClick={() => { setShowNewHA(false); setNewHazard({ hazard:'', category:'Physical', likelihood:3, severity:3, controls:'', residualL:2, residualS:2 }); }}
              style={{ padding:'8px 16px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, background:'white', cursor:'pointer', color:muted }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Risk Register table */}
      {selectedRA.hazards.length === 0 ? (
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'32px 20px', textAlign:'center', color:muted }}>
          <div style={{ fontSize:32, marginBottom:10 }}>📋</div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, marginBottom:4 }}>No hazards logged yet</div>
          <div style={{ fontSize:13 }}>Click "+ Add Hazard" to build the risk register for this activity.</div>
        </div>
      ) : (
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:800, color:navy }}>Risk Register</span>
            <span style={{ fontSize:12, color:muted }}>{selectedRA.hazards.length} hazard{selectedRA.hazards.length !== 1 ? 's' : ''} identified</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                  {['Hazard', 'Category', 'L', 'S', 'Rating', 'Control Measures', 'Residual'].map(h => (
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRA.hazards.map((h, i) => {
                  const initial = h.likelihood * h.severity;
                  const residual = h.residualL * h.residualS;
                  return (
                    <tr key={h.id} style={{ borderBottom:`1px solid ${border}`, background: i % 2 ? '#fafcfe' : 'white', verticalAlign:'top' }}>
                      <td style={{ padding:'12px 12px', fontWeight:700, maxWidth:220 }}>{h.hazard}</td>
                      <td style={{ padding:'12px 12px', whiteSpace:'nowrap' }}>
                        <span style={{ background:'#EFF2F7', color:muted, padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700 }}>{h.category}</span>
                      </td>
                      <td style={{ padding:'12px 12px', textAlign:'center', fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>{h.likelihood}</td>
                      <td style={{ padding:'12px 12px', textAlign:'center', fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>{h.severity}</td>
                      <td style={{ padding:'12px 12px', whiteSpace:'nowrap' }}><RiskBadge score={initial} /></td>
                      <td style={{ padding:'12px 12px', fontSize:12, color:'#1E293B', lineHeight:1.5, maxWidth:320 }}>{h.controls}</td>
                      <td style={{ padding:'12px 12px', whiteSpace:'nowrap' }}>
                        <div style={{ marginBottom:4 }}>
                          <RiskBadge score={residual} />
                        </div>
                        <div style={{ fontSize:10, color:muted }}>L{h.residualL} × S{h.residualS}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk matrix legend */}
      <div style={{ marginTop:16, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <span style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginRight:4 }}>Rating scale:</span>
        {[
          { label:'LOW', range:'1–4', bg:'#D1FAE5', color:'#065F46' },
          { label:'MEDIUM', range:'5–9', bg:'#FEF3C7', color:'#92400E' },
          { label:'HIGH', range:'10–14', bg:'#FEE2E2', color:'#991B1B' },
          { label:'CRITICAL', range:'15–25', bg:'#7F1D1D', color:'white' },
        ].map(r => (
          <span key={r.label} style={{ background:r.bg, color:r.color, padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:800 }}>{r.label} ({r.range})</span>
        ))}
        <span style={{ fontSize:11, color:muted, marginLeft:8 }}>Rating = Likelihood × Severity</span>
      </div>

      {/* Regulatory footer */}
      <div style={{ background:'#EAF4FF', border:'1px solid #B3D4F0', borderRadius:8, padding:'10px 14px', marginTop:16, fontSize:12, color:'#003D80', display:'flex', gap:10 }}>
        <span>ℹ</span>
        <span>Risk assessments are required under JSP 375 and RAFAC AP 1919. All AT and flying activities must have an approved RA on file before the activity commences. Draft assessments require OC sign-off.</span>
      </div>
    </div>
  );
}
