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

  return (
    <div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:4 }}>Squadron Overview</div>
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
