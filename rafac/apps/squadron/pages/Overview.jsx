import { CADETS } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const ACTIONS = [
  { id:'a1', type:'Consent', text:'Mitchell, S — TG21 consent due before 14 Nov', urgency:'high',  btn:'Send Reminder' },
  { id:'a2', type:'Consent', text:'Harper, J — profile incomplete',               urgency:'high',  btn:'View Profile' },
  { id:'a3', type:'Admin',   text:'Khan, A — medical file missing',                urgency:'med',   btn:'Request TG23' },
  { id:'a4', type:'Admin',   text:'Mason, D — NOK details unverified',             urgency:'med',   btn:'Contact Parent' },
  { id:'a5', type:'Info',    text:'Shooting event (Bisley) departs in 7 days',    urgency:'info',  btn:'View Event' },
];

const AUDIT = [
  { ts:'14 Nov 09:42', user:'Sqn Ldr Harris', action:'Approved AT/2026/114 — Shooting (Bisley)' },
  { ts:'13 Nov 16:18', user:'Sgt Reid',        action:'Parade QR closed — 9 cadets checked in' },
  { ts:'11 Nov 11:02', user:'Sqn Ldr Harris',  action:'Khan, A promoted to Leading Cadet' },
  { ts:'7 Nov 10:00',  user:'Fg Off Ahmad',    action:'Monthly attendance report generated' },
];

const urgencyStyle = {
  high: { bg:'#F8D7DA', color:'#8B1A1A', dot:'#C8102E' },
  med:  { bg:'#FFF3CC', color:'#7A4A00', dot:'#C8A032' },
  info: { bg:'#EAF4FF', color:'#003D80', dot:'#3B7DD8' },
};

export default function Overview({ showToast }) {
  const issues   = CADETS.filter(c => c.issue).length;
  const highAtt  = CADETS.filter(c => c.att >= 90).length;
  const strength = CADETS.length;

  return (
    <div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:4 }}>Squadron Overview</div>
      <div style={{ fontSize:12, color:muted, marginBottom:22 }}>1701 (Johnstone) Squadron · West Scotland Sector · {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>

      {/* Stat tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Strength on roll', value:strength, sub:'Active cadets', accent:navy },
          { label:'Actions required', value:ACTIONS.filter(a=>a.urgency==='high').length, sub:'High priority', accent:'#8B1A1A' },
          { label:'Attendance ≥90%', value:highAtt, sub:'Cadets this term', accent:'#1B6B3A' },
          { label:'Record issues', value:issues, sub:'Need attention', accent:'#7A4A00' },
        ].map(t => (
          <div key={t.label} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 18px' }}>
            <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.label}</div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.accent }}>{t.value}</div>
            <div style={{ fontSize:11, color:muted, marginTop:3 }}>{t.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16 }}>
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
                <button onClick={() => showToast(`▶ ${a.btn}: ${a.text.split('—')[0].trim()}`)}
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
          {AUDIT.map((e, i) => (
            <div key={i} style={{ padding:'10px 0', borderBottom: i<AUDIT.length-1 ? `1px solid ${border}` : 'none' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#0D1B2E' }}>{e.action}</div>
              <div style={{ fontSize:11, color:muted, marginTop:2 }}>{e.user} · {e.ts}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
