import { CADETS } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const ACTIONS = [
  { id:'a1', type:'Consent',  text:'Mitchell, S — TG21 consent due before 21 Jun',     urgency:'high', btn:'Send Reminder' },
  { id:'a2', type:'Consent',  text:'Harper, J — profile incomplete',                    urgency:'high', btn:'View Profile' },
  { id:'a3', type:'Admin',    text:'Khan, A — medical file missing',                    urgency:'med',  btn:'Request TG23' },
  { id:'a4', type:'Admin',    text:'Mason, D — NOK details unverified',                 urgency:'med',  btn:'Contact Parent' },
  { id:'a5', type:'Risk',     text:'Gliding Scholarship RA — awaiting OC sign-off',    urgency:'med',  btn:'Sign Off' },
  { id:'a6', type:'DofE',     text:'Mitchell, S — Gold expedition not yet planned',    urgency:'info', btn:'View DofE' },
  { id:'a7', type:'Info',     text:'Silver Fieldcraft (WSW) departs in 13 days',       urgency:'info', btn:'View Event' },
];

const urgencyStyle = {
  high: { bg:'#F8D7DA', color:'#8B1A1A', dot:'#C8102E' },
  med:  { bg:'#FFF3CC', color:'#7A4A00', dot:'#C8A032' },
  info: { bg:'#EAF4FF', color:'#003D80', dot:'#3B7DD8' },
};

const CAT_COLOR = {
  Cadets:'#00264D', Applicants:'#5B21B6', Parade:'#166534',
  Consents:'#075985', Kit:'#854D0E', Training:'#9F1239',
  Promotions:'#92400E', Compliance:'#065F46', Safeguarding:'#991B1B',
  Communications:'#065F46', DofE:'#166534', Band:'#C8A032',
  Budget:'#854D0E', General:'#5A7090',
};

const QUICK_LINKS = [
  { icon:'📨', label:'Compose message',    hint:'Send to all parents',        page:'comms' },
  { icon:'🏆', label:'Classification',     hint:'2 cadets ready to advance',  page:'classification' },
  { icon:'🥾', label:'DofE tracker',       hint:'4 cadets enrolled',          page:'dofe' },
  { icon:'⚠️', label:'Risk assessments',  hint:'1 awaiting sign-off',        page:'riskassessment' },
  { icon:'💷', label:'Budget',             hint:'£1,847 bank balance',        page:'budget' },
  { icon:'🥁', label:'Band',               hint:'Next practice 26 Jun',       page:'band' },
];

const ACTION_NAV = {
  'Send Reminder':'comms', 'View Profile':'cadets', 'Request TG23':'consents',
  'Contact Parent':'comms', 'Sign Off':'riskassessment', 'View DofE':'dofe', 'View Event':'programme',
};

export default function Overview({ showToast, auditLog = [], navigate }) {
  const issues   = CADETS.filter(c => c.issue).length;
  const highAtt  = CADETS.filter(c => c.att >= 90).length;
  const strength = CADETS.length;
  const lowAtt   = CADETS.filter(c => c.att < 75).length;
  const avgAtt   = Math.round(CADETS.reduce((s,c) => s + (c.att||0), 0) / CADETS.length);

  const RANK_ORDER = ['Cdt','LCdt','Cpl','Sgt','FS','WO'];
  const rankCounts = RANK_ORDER.map(r => ({ rank:r, n:CADETS.filter(c=>c.rank===r).length }));

  function generateReport() {
    const dateStr = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const rankRows = rankCounts.filter(r=>r.n>0).map(r =>
      `<tr><td>${r.rank}</td><td style="text-align:center">${r.n}</td><td style="text-align:center">${Math.round((r.n/strength)*100)}%</td></tr>`
    ).join('');
    const issueRows = ACTIONS.map(a =>
      `<tr><td style="color:${a.urgency==='high'?'#8B1A1A':a.urgency==='med'?'#7A4A00':'#003D80'};font-weight:700">${a.type}</td><td>${a.text}</td><td>${a.btn}</td></tr>`
    ).join('');
    const auditRows = auditLog.slice(0,8).map(e => {
      const t = e.ts ? new Date(e.ts).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
      return `<tr><td>${t}</td><td>${e.user||''}</td><td>${e.action||''}</td></tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>1701 (Johnstone) Sqn — Term Report ${dateStr}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Barlow,sans-serif;color:#0D1B2E;background:white;padding:24px 32px;font-size:12px}
  .hdr{background:#00264D;color:white;padding:20px 28px;border-radius:8px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center}
  .hdr-title{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;letter-spacing:0.02em}
  .hdr-sub{font-size:11px;opacity:0.6;margin-top:4px;letter-spacing:0.08em}
  .hdr-meta{text-align:right;font-size:11px;opacity:0.7;line-height:1.6}
  .roundel{width:52px;height:52px;border-radius:50%;background:conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,#c8102e 240deg 360deg);border:2px solid #C8A032;flex-shrink:0}
  .section{margin-bottom:22px}
  .section-title{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#00264D;border-bottom:2px solid #00264D;padding-bottom:4px;margin-bottom:12px;letter-spacing:0.03em;text-transform:uppercase}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{background:#F4F7FB;padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:#5A7090;text-transform:uppercase;letter-spacing:0.07em;border-bottom:2px solid #D0DCF0}
  td{padding:8px 12px;border-bottom:1px solid #D0DCF0}
  tr:last-child td{border-bottom:none}
  .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}
  .stat-box{border:1.5px solid #D0DCF0;border-radius:8px;padding:12px 14px}
  .stat-label{font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px}
  .stat-value{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800}
  .stat-sub{font-size:10px;color:#5A7090;margin-top:2px}
  .pill{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700}
  .notice{background:#EAF4FF;border:1px solid #B3D4F0;border-radius:6px;padding:10px 14px;font-size:11px;color:#003D80;margin-bottom:16px}
  .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px}
  .sig-line{border-top:1px solid #0D1B2E;padding-top:6px;margin-top:40px;font-size:11px;color:#5A7090}
  @media print{body{padding:16px 20px}.hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>

<div class="hdr">
  <div style="display:flex;align-items:center;gap:16px">
    <div class="roundel"></div>
    <div>
      <div class="hdr-title">1701 (JOHNSTONE) SQUADRON</div>
      <div class="hdr-sub">ROYAL AIR FORCE AIR CADETS · WEST SCOTLAND WING · TERM REPORT</div>
    </div>
  </div>
  <div class="hdr-meta">
    Generated: ${dateStr}<br>
    Prepared by: Sqn Ldr J. Harris OC<br>
    Classification: OFFICIAL-SENSITIVE
  </div>
</div>

<div class="notice">This report is produced automatically from the 1701 Squadron Administration System. Data is current as of the generation date above. For formal returns, refer to BADER records.</div>

<!-- Strength -->
<div class="section">
  <div class="section-title">1. Squadron Strength</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-label">Total strength</div><div class="stat-value" style="color:#00264D">${strength}</div><div class="stat-sub">Active cadets on roll</div></div>
    <div class="stat-box"><div class="stat-label">Avg attendance</div><div class="stat-value" style="color:#1B6B3A">${avgAtt}%</div><div class="stat-sub">This term</div></div>
    <div class="stat-box"><div class="stat-label">Attendance ≥90%</div><div class="stat-value" style="color:#1B6B3A">${highAtt}</div><div class="stat-sub">High performers</div></div>
    <div class="stat-box"><div class="stat-label">Welfare flags</div><div class="stat-value" style="color:#7A4A00">${lowAtt}</div><div class="stat-sub">Attendance &lt;75%</div></div>
  </div>
  <table>
    <thead><tr><th>Rank</th><th style="text-align:center">Count</th><th style="text-align:center">% of strength</th></tr></thead>
    <tbody>${rankRows}</tbody>
  </table>
</div>

<!-- Cadet roster -->
<div class="section">
  <div class="section-title">2. Cadet Roster</div>
  <table>
    <thead><tr><th>Rank</th><th>Name</th><th>Svc No.</th><th>PTS Class</th><th>Att %</th><th>Status</th></tr></thead>
    <tbody>${CADETS.map(c=>`<tr><td>${c.rank}</td><td>${c.sn}, ${c.fn}</td><td style="font-family:monospace">${c.svc}</td><td>${c.pts}</td><td style="text-align:center">${c.att}%</td><td>${c.issue?`<span class="pill" style="background:#FFF3CC;color:#7A4A00">${c.issue}</span>`:'<span class="pill" style="background:#D1FAE5;color:#065F46">OK</span>'}</td></tr>`).join('')}</tbody>
  </table>
</div>

<!-- DofE -->
<div class="section">
  <div class="section-title">3. Duke of Edinburgh</div>
  <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat-box"><div class="stat-label">Total enrolled</div><div class="stat-value" style="color:#166534">4</div><div class="stat-sub">Active DofE participants</div></div>
    <div class="stat-box"><div class="stat-label">Levels</div><div class="stat-value" style="font-size:16px;color:#C8A032;padding-top:8px">Gold · Silver · 2× Bronze</div></div>
    <div class="stat-box"><div class="stat-label">Next expedition</div><div class="stat-value" style="font-size:16px;color:#166534;padding-top:8px">Silver Fieldcraft</div><div class="stat-sub">27–28 Jun 2026 · Tinto Hill</div></div>
  </div>
</div>

<!-- Training & AT -->
<div class="section">
  <div class="section-title">4. Training & Adventure Training</div>
  <table>
    <thead><tr><th>Event</th><th>Date</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>Silver Fieldcraft (Wing Summer Wing)</td><td>27–28 Jun 2026</td><td><span class="pill" style="background:#D4EDDA;color:#0F4020">CONFIRMED</span></td></tr>
      <tr><td>AEF Day — RAF Turnhouse</td><td>3 Jul 2026</td><td><span class="pill" style="background:#D4EDDA;color:#0F4020">CONFIRMED</span></td></tr>
      <tr><td>Summer Camp — RAF Woodvale</td><td>19–26 Jul 2026</td><td><span class="pill" style="background:#FFF3CC;color:#7A4A00">CONSENT PENDING</span></td></tr>
      <tr><td>Gliding Scholarship</td><td>3–7 Aug 2026</td><td><span class="pill" style="background:#EAF4FF;color:#003D80">ALLOCATING</span></td></tr>
      <tr><td>Hill Walking Bronze (WSW)</td><td>5–6 Dec 2026</td><td><span class="pill" style="background:#F4F7FB;color:#5A7090">BOOKED</span></td></tr>
    </tbody>
  </table>
</div>

<!-- Finance -->
<div class="section">
  <div class="section-title">5. Budget & Finance</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-label">Bank balance</div><div class="stat-value" style="color:#1B6B3A">£1,847</div></div>
    <div class="stat-box"><div class="stat-label">Income vs expenditure</div><div class="stat-value" style="color:#1B6B3A">£+1,310</div><div class="stat-sub">This financial year</div></div>
    <div class="stat-box"><div class="stat-label">Band budget</div><div class="stat-value" style="color:#C8A032">£450</div><div class="stat-sub">Remaining this year</div></div>
    <div class="stat-box"><div class="stat-label">AT budget</div><div class="stat-value" style="color:#C8A032">£820</div><div class="stat-sub">Remaining this year</div></div>
  </div>
</div>

<!-- Outstanding actions -->
<div class="section">
  <div class="section-title">6. Outstanding Actions</div>
  <table>
    <thead><tr><th>Category</th><th>Action required</th><th>Next step</th></tr></thead>
    <tbody>${issueRows}</tbody>
  </table>
</div>

<!-- Recent activity -->
${auditLog.length > 0 ? `
<div class="section">
  <div class="section-title">7. Recent System Activity</div>
  <table>
    <thead><tr><th>Date/Time</th><th>User</th><th>Action</th></tr></thead>
    <tbody>${auditRows}</tbody>
  </table>
</div>` : ''}

<!-- Signature blocks -->
<div class="sig-grid">
  <div>
    <div class="sig-line">Sqn Ldr J. Harris · OC 1701 (Johnstone) Squadron</div>
  </div>
  <div>
    <div class="sig-line">Date: ______________________________</div>
  </div>
</div>

<div style="margin-top:28px;padding-top:12px;border-top:1px solid #D0DCF0;font-size:10px;color:#5A7090;display:flex;justify-content:space-between">
  <span>1701 (Johnstone) Squadron · West Scotland Wing · Royal Air Force Air Cadets</span>
  <span>OFFICIAL-SENSITIVE · GDPR DPA 2018 applies · Do not distribute outside RAFAC</span>
</div>

</body>
</html>`;

    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
    showToast('📄 Term report opened — print dialog launching…');
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Squadron Overview</div>
        <button onClick={generateReport}
          style={{ padding:'8px 16px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'Barlow,sans-serif' }}>
          📄 Term Report
        </button>
      </div>
      <div style={{ fontSize:12, color:muted, marginBottom:22 }}>1701 (Johnstone) Squadron · West Scotland Sector · {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>

      {/* Stat tiles — row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:14 }}>
        {[
          { label:'Strength on roll',  value:strength, sub:'Active cadets',   accent:navy,      page:'cadets' },
          { label:'Actions required',  value:ACTIONS.filter(a=>a.urgency==='high').length, sub:'High priority', accent:'#8B1A1A', page:null },
          { label:'Attendance ≥90%',   value:highAtt,  sub:'Cadets this term', accent:'#1B6B3A', page:'cadets' },
          { label:'Welfare flags',     value:lowAtt,   sub:'Attendance <75%', accent:'#7A4A00',  page:'safeguarding' },
        ].map(t => (
          <div key={t.label} onClick={() => t.page && navigate && navigate(t.page)}
            style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 18px', cursor:t.page?'pointer':'default', transition:'box-shadow 0.15s' }}
            onMouseEnter={e => { if (t.page) e.currentTarget.style.boxShadow='0 2px 10px rgba(0,38,77,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.label}</div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.accent }}>{t.value}</div>
            <div style={{ fontSize:11, color:muted, marginTop:3 }}>{t.sub}{t.page && <span style={{ marginLeft:6, color:`${t.accent}88`, fontSize:10 }}>→</span>}</div>
          </div>
        ))}
      </div>

      {/* Stat tiles — row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'DofE enrolled',     value:4,         sub:'1 Gold · 1 Silver · 2 Bronze', accent:'#166534', page:'dofe' },
          { label:'Band musicians',    value:5,         sub:'Next practice 26 Jun',          accent:'#C8A032', page:'band' },
          { label:'Risk assessments',  value:2,         sub:'1 draft · 1 approved',          accent:'#7A4A00', page:'riskassessment' },
          { label:'Budget position',   value:'£+1,310', sub:'Income over expenditure',       accent:'#1B6B3A', page:'budget' },
        ].map(t => (
          <div key={t.label} onClick={() => t.page && navigate && navigate(t.page)}
            style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 18px', cursor:t.page?'pointer':'default', transition:'box-shadow 0.15s' }}
            onMouseEnter={e => { if (t.page) e.currentTarget.style.boxShadow='0 2px 10px rgba(0,38,77,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.label}</div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:28, fontWeight:800, color:t.accent }}>{t.value}</div>
            <div style={{ fontSize:11, color:muted, marginTop:3 }}>{t.sub}{t.page && <span style={{ marginLeft:6, color:`${t.accent}88`, fontSize:10 }}>→</span>}</div>
          </div>
        ))}
      </div>

      {/* Rank structure mini-chart */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, fontSize:14 }}>Squadron Structure</div>
          <div style={{ fontSize:11, color:muted }}>{strength} cadets · {rankCounts.filter(r=>r.n>0).length} rank levels</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8 }}>
          {[...rankCounts].reverse().map(r => {
            const RCLR = { Cdt:'#5A7090', LCdt:'#3B7DD8', Cpl:'#00264D', Sgt:'#1B6B3A', FS:'#C8A032', WO:'#8B1A1A' };
            const color = RCLR[r.rank] || muted;
            const pct = strength > 0 ? Math.round((r.n / strength) * 100) : 0;
            return (
              <div key={r.rank} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color: r.n > 0 ? color : '#C8D0DC' }}>{r.n}</div>
                <div style={{ height:6, background:'#EEF2F8', borderRadius:3, margin:'5px 0', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:3 }} />
                </div>
                <div style={{ fontSize:11, fontWeight:700, padding:'2px 0', color: r.n > 0 ? color : '#C8D0DC' }}>{r.rank}</div>
                <div style={{ fontSize:10, color:muted }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16, marginBottom:16 }}>
        {/* Actions */}
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Actions Required</div>
          {ACTIONS.map(a => {
            const s = urgencyStyle[a.urgency];
            return (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${border}` }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <span style={{ background:s.bg, color:s.color, fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:6, marginRight:6 }}>{a.type}</span>
                  <span style={{ fontSize:13, color:'#0D1B2E' }}>{a.text}</span>
                </div>
                <button onClick={() => { const pg = ACTION_NAV[a.btn]; if (pg && navigate) navigate(pg); else showToast(`▶ ${a.btn}: ${a.text.split('—')[0].trim()}`); }}
                  style={{ padding:'5px 12px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                  {a.btn}
                </button>
              </div>
            );
          })}
        </div>

        {/* Audit */}
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Recent Activity</div>
          {auditLog.slice(0, 6).map((e, i) => {
            const time = e.ts ? new Date(e.ts).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : '';
            const cat = e.category || 'General';
            return (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'9px 0', borderBottom: i<5 ? `1px solid ${border}` : 'none' }}>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 5px', borderRadius:4, background:'#EEF2F8', color: CAT_COLOR[cat] || '#5A7090', whiteSpace:'nowrap', marginTop:2 }}>{cat.toUpperCase()}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:'#0D1B2E' }}>{e.action}</div>
                  <div style={{ fontSize:10, color:muted, marginTop:1 }}>{e.user} · {time}</div>
                </div>
              </div>
            );
          })}
          {auditLog.length === 0 && <div style={{ fontSize:12, color:muted }}>No activity yet this session</div>}
        </div>
      </div>

      {/* Quick links to new modules */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px' }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Quick Access</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
          {QUICK_LINKS.map(q => (
            <button key={q.label} onClick={() => navigate ? navigate(q.page) : showToast(`Opening: ${q.label}`)}
              style={{ background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:9, padding:'14px 10px', cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:24 }}>{q.icon}</span>
              <div style={{ fontSize:11, fontWeight:700, color:navy }}>{q.label}</div>
              <div style={{ fontSize:10, color:muted }}>{q.hint}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
