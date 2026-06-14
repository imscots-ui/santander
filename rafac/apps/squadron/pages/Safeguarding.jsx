import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';

const navy = '#00264D', red = '#8B1A1A', gold = '#C8A032', green = '#1B6B3A';

// ── Seed data ────────────────────────────────────────────────────

const DSL = { name:'Sqn Ldr Harris, J.', role:'OC / DSL', training:'Level 3', trainingDate:'2026-01-12', trainingExpiry:'2027-01-12', tel:'07700 900001' };
const WING_SCC = { name:'Sqn Ldr P. McAlister', role:'Wing SCC — West Scotland Wing', tel:'07700 900555', email:'wg-scc@aircadets.org' };
const LADO = { name:'Renfrewshire LADO', org:'Renfrewshire Council Children\'s Services', tel:'0300 300 1199' };

const SEED_CONCERNS = [
  {
    id:'sg001', cadet:'Mason, D', cadetId:'c06', date:'2026-06-10', time:'19:45',
    type:'Staff observation', status:'Open',
    detail:'Cadet appeared withdrawn during parade, did not engage with peers. When asked if everything was OK, cadet said "it\'s fine" but avoided eye contact. No disclosure made. Bruising observed on left forearm — cadet said it was from football.',
    action:'Spoken to cadet privately. Logged immediately. DSL notified same evening. Welfare check scheduled for next parade.',
    escalation:'DSL notified', reportedBy:'CI Morrison, K.',
    outcome: null,
  },
  {
    id:'sg002', cadet:'Cooper, O', cadetId:'c09', date:'2026-05-15', time:'20:10',
    type:'Disclosure',  status:'Referred',
    detail:'Cadet disclosed that a family member had been making them feel unsafe at home. Exact words recorded separately in secure log. Cadet was calm and seemed relieved to have told someone.',
    action:'Cadet reassured. Not promised confidentiality. Told we would need to share with people who could help. DSL informed within 30 minutes. Cadet not left alone.',
    escalation:'Wing SCC notified · Referral to Renfrewshire Social Services made 16 May 2026',
    reportedBy:'CI Morrison, K.',
    outcome:'Social Services allocated a worker. Case active. Regular updates from Wing SCC.',
  },
  {
    id:'sg003', cadet:'Wright, L', cadetId:'c07', date:'2025-12-01', time:'19:20',
    type:'Disclosure', status:'Closed',
    detail:'Cadet disclosed difficult home situation during one-to-one. Appropriate support pathway followed.',
    action:'Wing SCC informed. Case reviewed and support provided.',
    escalation:'Wing SCC notified · No further statutory referral required',
    reportedBy:'CI Morrison, K.',
    outcome:'Case closed 2026-01-15. Cadet accessing pastoral support through school. Wing SCC signed off.',
  },
];

const SCR_STAFF = [
  { id:'s1', name:'Sqn Ldr Harris, J.',  role:'OC / DSL',    dbsType:'Enhanced', dbsNum:'001234567890', dbsDate:'2024-03-14', barredList:'2024-03-14', idVerified:'2024-03-10', refs:2, refsReq:2, sgLevel:3, sgDate:'2026-01-12', sgExpiry:'2027-01-12' },
  { id:'s2', name:'Flt Lt Baxter, R.',   role:'Adj',          dbsType:'Enhanced', dbsNum:'001234567891', dbsDate:'2023-11-30', barredList:'2023-11-30', idVerified:'2023-11-25', refs:2, refsReq:2, sgLevel:2, sgDate:'2025-11-15', sgExpiry:'2026-11-15' },
  { id:'s3', name:'CI Morrison, K.',     role:'CI / DSL dep', dbsType:'Enhanced', dbsNum:'001234567892', dbsDate:'2023-08-22', barredList:'2023-08-22', idVerified:'2023-08-20', refs:2, refsReq:2, sgLevel:3, sgDate:'2026-01-12', sgExpiry:'2027-01-12' },
  { id:'s4', name:'CI Sinclair, P.',     role:'CI',           dbsType:'Enhanced', dbsNum:'001234567893', dbsDate:'2022-12-01', barredList:null,         idVerified:'2022-11-28', refs:1, refsReq:2, sgLevel:1, sgDate:'2025-10-01', sgExpiry:'2026-10-01' },
  { id:'s5', name:'SSgt Fletcher, L.',   role:'PI (Drums)',   dbsType:'Standard', dbsNum:'001234567894', dbsDate:'2024-06-30', barredList:'2024-06-30', idVerified:'2024-06-28', refs:2, refsReq:2, sgLevel:1, sgDate:'2026-02-01', sgExpiry:'2027-02-01' },
];

const WELFARE_FLAGS = [
  { id:'w1', cadetId:'c06', cadet:'Mason, D', reason:'3 consecutive unexplained absences', since:'2026-05-22', status:'Active', checks:[
    { date:'2026-06-05', action:'Parent called — no answer. Left voicemail.', by:'OC Harris' },
    { date:'2026-06-08', action:'Text sent to parent. Reply received: "Daniel not keen on cadets lately." Further follow-up needed.', by:'OC Harris' },
  ]},
  { id:'w2', cadetId:'c09', cadet:'Cooper, O', reason:'Ongoing safeguarding concern — linked to SG002', since:'2026-05-15', status:'Active', checks:[
    { date:'2026-05-22', action:'Regular welfare check at parade. Cadet appeared more settled. Positive engagement noted.', by:'CI Morrison' },
    { date:'2026-06-05', action:'Update received from Wing SCC — Social Services case ongoing. Cadet attending school.', by:'OC Harris' },
    { date:'2026-06-12', action:'Cadet present at parade. Engaged well. No concerns noted.', by:'CI Morrison' },
  ]},
];

const CONCERN_TYPES = ['Disclosure','Staff observation','Parent contact','Third party report','Anonymous report','Online safety concern'];
const ESCALATION_OPTIONS = ['DSL notified','Wing SCC notified','Referral to Social Services','Police contact made','LADO referral','None yet — initial log'];

// ── Helpers ──────────────────────────────────────────────────────

const TODAY = '2026-06-14';

function daysUntil(d) { return Math.round((new Date(d) - new Date(TODAY)) / 86400000); }

function StatusPill({ status }) {
  const s = { Open:'#FEF3C7:#92400E', Referred:'#FEE2E2:#991B1B', Closed:'#D1FAE5:#065F46', Active:'#FEE2E2:#991B1B', Resolved:'#D1FAE5:#065F46' };
  const [bg, color] = (s[status]||'#EEF2F8:#00264D').split(':');
  return <span style={{ background:bg, color, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{status.toUpperCase()}</span>;
}

function DbsPill({ date }) {
  const days = daysUntil(date);
  if (days < 0)   return <span style={{ background:'#FEE2E2', color:'#991B1B', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>EXPIRED</span>;
  if (days < 365) return <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>RENEW {days}d</span>;
  return              <span style={{ background:'#D1FAE5', color:'#065F46', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>VALID</span>;
}

// ── Main component ───────────────────────────────────────────────

export default function Safeguarding({ showToast, addAudit }) {
  const [sub, setSub] = useState('concerns');
  const [concerns, setConcerns] = useState(SEED_CONCERNS);
  const [welfare, setWelfare] = useState(WELFARE_FLAGS);
  const [expandedConcern, setExpandedConcern] = useState(null);
  const [expandedWelfare, setExpandedWelfare] = useState(null);
  const [showNewConcern, setShowNewConcern] = useState(false);
  const [showNewCheck, setShowNewCheck] = useState(null);
  const [newCheck, setNewCheck] = useState('');
  const [showAddFlag, setShowAddFlag] = useState(false);

  const [nc, setNc] = useState({ cadetId:'', type:'Staff observation', detail:'', action:'', escalation:'None yet — initial log', reportedBy:'OC Harris' });

  const openConcerns = concerns.filter(c => c.status !== 'Closed').length;
  const scrIssues = SCR_STAFF.filter(s => !s.barredList || s.refs < s.refsReq || daysUntil(s.dbsDate + '') < 365 || daysUntil(s.sgExpiry) < 60).length;
  const activeWelfare = welfare.filter(w => w.status === 'Active').length;

  function submitConcern() {
    if (!nc.cadetId || !nc.detail.trim()) { showToast('Please select a cadet and describe the concern', 'error'); return; }
    const cadet = CADETS.find(c => c.id === nc.cadetId);
    const entry = {
      id: 'sg' + (concerns.length + 1).toString().padStart(3,'0'),
      cadet: `${cadet.sn}, ${cadet.fn}`,
      cadetId: nc.cadetId,
      date: TODAY,
      time: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),
      type: nc.type,
      status: 'Open',
      detail: nc.detail,
      action: nc.action || 'Logged. DSL to review.',
      escalation: nc.escalation,
      reportedBy: nc.reportedBy,
      outcome: null,
    };
    setConcerns(p => [entry, ...p]);
    addAudit?.(`Safeguarding concern logged: ${entry.cadet} (${entry.type})`, 'Safeguarding');
    showToast('Concern logged — DSL has been notified', 'success');
    setShowNewConcern(false);
    setNc({ cadetId:'', type:'Staff observation', detail:'', action:'', escalation:'None yet — initial log', reportedBy:'OC Harris' });
  }

  function closeConcern(id) {
    setConcerns(p => p.map(c => c.id===id ? {...c, status:'Closed', outcome:'Closed by DSL — '+TODAY} : c));
    addAudit?.('Safeguarding concern closed', 'Safeguarding');
    showToast('Concern closed and recorded', 'success');
  }

  function addWelfareCheck(wid) {
    if (!newCheck.trim()) return;
    setWelfare(p => p.map(w => w.id===wid ? {...w, checks:[...w.checks, { date:TODAY, action:newCheck, by:'OC Harris' }]} : w));
    addAudit?.('Welfare check recorded', 'Safeguarding');
    showToast('Welfare check logged', 'success');
    setNewCheck('');
    setShowNewCheck(null);
  }

  function resolveFlag(wid) {
    setWelfare(p => p.map(w => w.id===wid ? {...w, status:'Resolved'} : w));
    addAudit?.('Welfare flag resolved', 'Safeguarding');
    showToast('Welfare flag resolved', 'success');
  }

  const TABS = [
    { id:'concerns',  label:`Concern Log${openConcerns>0?` (${openConcerns})`:''}`  },
    { id:'scr',       label:`Single Central Record${scrIssues>0?` ⚠️`:''}`          },
    { id:'welfare',   label:`Welfare Watch${activeWelfare>0?` (${activeWelfare})`:''}`},
    { id:'guidance',  label:'Guidance'                                                },
  ];

  return (
    <div style={{ maxWidth:960 }}>
      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:26, fontWeight:800, color:navy }}>Safeguarding</div>
        <div style={{ fontSize:12, color:'#5A7090', marginTop:2 }}>Concern log · Single Central Record · Welfare watch · Guidance</div>
      </div>

      {/* DSL banner */}
      <div style={{ background:'#00264D', borderRadius:12, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🛡️</div>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'white', letterSpacing:'0.04em' }}>DESIGNATED SAFEGUARDING LEAD</div>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>{DSL.name} · {DSL.role}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>Level {DSL.trainingLevel || 3} Safeguarding · Trained {DSL.trainingDate} · Expires {DSL.trainingExpiry}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 14px', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color: openConcerns>0?'#FCD34D':'#86EFAC' }}>{openConcerns}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>Open concerns</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 14px', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color: activeWelfare>0?'#FCD34D':'#86EFAC' }}>{activeWelfare}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>Welfare flags</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 14px', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color: scrIssues>0?'#FCD34D':'#86EFAC' }}>{scrIssues}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>SCR issues</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:16, background:'white', padding:4, borderRadius:10, border:'1px solid #E5EAF2', width:'fit-content', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)}
            style={{ padding:'7px 14px', borderRadius:7, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
              background: sub===t.id ? navy : 'transparent',
              color: sub===t.id ? 'white' : '#5A7090' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONCERN LOG ── */}
      {sub === 'concerns' && (
        <div>
          <div style={{ background:'#FEE2E2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#991B1B', lineHeight:1.6 }}>
            🔒 <strong>STRICTLY CONFIDENTIAL</strong> — Accessible to DSL and OC only. Entries cannot be deleted. All concerns must be logged even if no further action is taken. Do not discuss concern details outside of the safeguarding chain.
          </div>

          <button onClick={() => setShowNewConcern(true)}
            style={{ marginBottom:16, padding:'9px 18px', borderRadius:8, border:'none', background:red, color:'white', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
            + Log New Concern
          </button>

          {showNewConcern && (
            <div style={{ background:'#FFF8F8', border:'1px solid #FECACA', borderRadius:12, padding:18, marginBottom:18 }}>
              <div style={{ fontWeight:800, color:red, fontSize:14, marginBottom:14, fontFamily:'Barlow Condensed,sans-serif' }}>LOG A SAFEGUARDING CONCERN</div>
              <div style={{ fontSize:12, color:'#991B1B', marginBottom:14, lineHeight:1.6, background:'#FEE2E2', borderRadius:8, padding:'10px 12px' }}>
                Record <strong>exact words used</strong> where possible. Do not add opinion or interpretation. Do not promise confidentiality to the child. Record immediately while details are fresh.
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:navy, marginBottom:4 }}>Cadet *</div>
                  <select value={nc.cadetId} onChange={e=>setNc(p=>({...p,cadetId:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #D0D8E4', borderRadius:8, fontSize:12 }}>
                    <option value="">— Select cadet —</option>
                    {CADETS.map(c => <option key={c.id} value={c.id}>{c.rank} {c.sn}, {c.fn}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:navy, marginBottom:4 }}>Type of concern *</div>
                  <select value={nc.type} onChange={e=>setNc(p=>({...p,type:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #D0D8E4', borderRadius:8, fontSize:12 }}>
                    {CONCERN_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:navy, marginBottom:4 }}>What was seen or heard? (Use exact words where possible) *</div>
                <textarea value={nc.detail} onChange={e=>setNc(p=>({...p,detail:e.target.value}))} rows={4}
                  placeholder="Record factually what you observed, heard, or were told. Include exact words spoken by the child. Do not add interpretation."
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #D0D8E4', borderRadius:8, fontSize:12, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:navy, marginBottom:4 }}>Immediate action taken</div>
                <textarea value={nc.action} onChange={e=>setNc(p=>({...p,action:e.target.value}))} rows={2}
                  placeholder="e.g. Child reassured. Not promised confidentiality. DSL informed at 19:45."
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #D0D8E4', borderRadius:8, fontSize:12, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:navy, marginBottom:4 }}>Escalation</div>
                  <select value={nc.escalation} onChange={e=>setNc(p=>({...p,escalation:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #D0D8E4', borderRadius:8, fontSize:12 }}>
                    {ESCALATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:navy, marginBottom:4 }}>Reported by</div>
                  <select value={nc.reportedBy} onChange={e=>setNc(p=>({...p,reportedBy:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #D0D8E4', borderRadius:8, fontSize:12 }}>
                    {SCR_STAFF.map(s=><option key={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={submitConcern}
                  style={{ padding:'9px 20px', borderRadius:8, border:'none', background:red, color:'white', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
                  Submit Concern
                </button>
                <button onClick={() => setShowNewConcern(false)}
                  style={{ padding:'9px 14px', borderRadius:8, border:'1px solid #D0D8E4', background:'white', fontSize:12, cursor:'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {concerns.map(c => (
              <div key={c.id} style={{ background:'white', borderRadius:12, border:`1.5px solid ${c.status==='Closed'?'#E5EAF2':c.status==='Referred'?'#FECACA':'#FDE68A'}`, overflow:'hidden' }}>
                <div style={{ padding:'14px 18px', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:12, justifyContent:'space-between' }}
                  onClick={() => setExpandedConcern(expandedConcern===c.id?null:c.id)}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                      <StatusPill status={c.status} />
                      <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'#EEF2F8', color:navy }}>{c.type}</span>
                      <span style={{ fontSize:11, color:'#5A7090' }}>{c.date} · {c.time}</span>
                      <span style={{ fontSize:11, color:'#5A7090' }}>· {c.reportedBy}</span>
                    </div>
                    <div style={{ fontWeight:800, color:navy, fontSize:14 }}>{c.cadet}</div>
                    <div style={{ fontSize:12, color:'#5A7090', marginTop:3 }}>{c.escalation}</div>
                  </div>
                  <span style={{ color:'#5A7090', fontSize:14, flexShrink:0 }}>{expandedConcern===c.id?'▲':'▼'}</span>
                </div>

                {expandedConcern === c.id && (
                  <div style={{ padding:'0 18px 16px', borderTop:'1px solid #F0F4F8' }}>
                    <div style={{ marginTop:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#5A7090', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>What was seen / heard</div>
                      <div style={{ fontSize:13, color:navy, background:'#F8FAFF', borderRadius:8, padding:'10px 12px', lineHeight:1.6 }}>{c.detail}</div>
                    </div>
                    <div style={{ marginTop:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#5A7090', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Immediate action</div>
                      <div style={{ fontSize:13, color:navy }}>{c.action}</div>
                    </div>
                    {c.outcome && (
                      <div style={{ marginTop:12 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:'#5A7090', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Outcome</div>
                        <div style={{ fontSize:13, color:navy }}>{c.outcome}</div>
                      </div>
                    )}
                    {c.status !== 'Closed' && (
                      <div style={{ marginTop:14 }}>
                        <button onClick={() => closeConcern(c.id)}
                          style={{ padding:'6px 14px', borderRadius:6, border:`1px solid ${green}`, background:'white', color:green, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                          ✓ Close concern with outcome
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SINGLE CENTRAL RECORD ── */}
      {sub === 'scr' && (
        <div>
          <div style={{ fontSize:12, color:'#5A7090', marginBottom:14, lineHeight:1.6 }}>
            The Single Central Record (SCR) must be maintained for all adults in regulated activity with under-18s. It must be available for inspection at all times. Required per AP1919 and the Children Act 2004.
          </div>
          {SCR_STAFF.filter(s=>!s.barredList||s.refs<s.refsReq).length > 0 && (
            <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#92400E' }}>
              ⚠️ {SCR_STAFF.filter(s=>!s.barredList||s.refs<s.refsReq).length} staff member(s) have incomplete SCR entries. These must be resolved before they can supervise cadets unsupervised.
            </div>
          )}
          <div style={{ background:'white', borderRadius:12, border:'1px solid #E5EAF2', overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
              <thead>
                <tr style={{ background:'#F4F7FB' }}>
                  {['Name / Role','DBS Type','DBS Date','Barred List','ID Verified','References','SG Training','SCR'].map(h=>(
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'#5A7090', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCR_STAFF.map((s,i)=>{
                  const scrOk = s.barredList && s.refs>=s.refsReq && s.idVerified;
                  return (
                    <tr key={s.id} style={{ borderTop:i>0?'1px solid #F0F4F8':'none' }}>
                      <td style={{ padding:'11px 12px' }}>
                        <div style={{ fontWeight:700, color:navy }}>{s.name}</div>
                        <div style={{ fontSize:10, color:'#5A7090' }}>{s.role}</div>
                      </td>
                      <td style={{ padding:'11px 12px', color:'#5A7090' }}>{s.dbsType}</td>
                      <td style={{ padding:'11px 12px' }}><DbsPill date={new Date(s.dbsDate).getTime() + 365*3*86400000 > new Date(TODAY).getTime() ? new Date(new Date(s.dbsDate).getTime()+365*3*86400000).toISOString().slice(0,10) : s.dbsDate} /></td>
                      <td style={{ padding:'11px 12px' }}>
                        {s.barredList ? <span style={{ color:green, fontWeight:700, fontSize:11 }}>✓ {s.barredList}</span> : <span style={{ color:red, fontWeight:700, fontSize:11 }}>⚠ Pending</span>}
                      </td>
                      <td style={{ padding:'11px 12px' }}>
                        {s.idVerified ? <span style={{ color:green, fontWeight:700, fontSize:11 }}>✓ {s.idVerified}</span> : <span style={{ color:red, fontWeight:700, fontSize:11 }}>⚠ Missing</span>}
                      </td>
                      <td style={{ padding:'11px 12px' }}>
                        <span style={{ fontWeight:700, color:s.refs>=s.refsReq?green:red }}>{s.refs}/{s.refsReq}</span>
                      </td>
                      <td style={{ padding:'11px 12px' }}>
                        <span style={{ fontWeight:700, color:navy, fontSize:12 }}>L{s.sgLevel}</span>
                        <div style={{ fontSize:10, color:'#5A7090' }}>{s.sgDate}</div>
                        <DbsPill date={s.sgExpiry} />
                      </td>
                      <td style={{ padding:'11px 12px' }}>
                        {scrOk
                          ? <span style={{ background:'#D1FAE5', color:'#065F46', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>COMPLETE</span>
                          : <span style={{ background:'#FEE2E2', color:'#991B1B', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>INCOMPLETE</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:12, fontSize:11, color:'#5A7090', lineHeight:1.6 }}>
            DBS certificates renewed every 3 years · Barred list check on appointment and when new regulated activity begins · Level 3 safeguarding required for DSL and deputy · SCR available for Wing inspection on request
          </div>
        </div>
      )}

      {/* ── WELFARE WATCH ── */}
      {sub === 'welfare' && (
        <div>
          <div style={{ background:'#EEF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#1E40AF', lineHeight:1.6 }}>
            ℹ️ A cadet missing 3 or more consecutive parades without explanation should trigger a welfare check. Any welfare check must be documented here regardless of outcome.
          </div>

          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:800, color:navy, marginBottom:10 }}>Active Welfare Flags</div>

          {welfare.filter(w=>w.status==='Active').map(w => (
            <div key={w.id} style={{ background:'white', borderRadius:12, border:'1.5px solid #FDE68A', marginBottom:14, overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', cursor:'pointer' }}
                onClick={()=>setExpandedWelfare(expandedWelfare===w.id?null:w.id)}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <StatusPill status={w.status} />
                    <span style={{ fontSize:11, color:'#5A7090' }}>Since {w.since}</span>
                  </div>
                  <div style={{ fontWeight:800, color:navy, fontSize:14 }}>{w.cadet}</div>
                  <div style={{ fontSize:12, color:'#5A7090', marginTop:2 }}>{w.reason}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:11, color:'#5A7090' }}>{w.checks.length} check{w.checks.length!==1?'s':''}</span>
                  <span style={{ color:'#5A7090' }}>{expandedWelfare===w.id?'▲':'▼'}</span>
                </div>
              </div>
              {expandedWelfare===w.id && (
                <div style={{ padding:'0 18px 16px', borderTop:'1px solid #F0F4F8' }}>
                  <div style={{ marginTop:12 }}>
                    {w.checks.map((c,i)=>(
                      <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid #F0F4F8' }}>
                        <div style={{ fontSize:11, color:'#5A7090', whiteSpace:'nowrap', minWidth:70 }}>{c.date}</div>
                        <div style={{ fontSize:12, color:navy, flex:1 }}>{c.action}</div>
                        <div style={{ fontSize:11, color:'#5A7090', whiteSpace:'nowrap' }}>{c.by}</div>
                      </div>
                    ))}
                  </div>
                  {showNewCheck===w.id ? (
                    <div style={{ marginTop:12 }}>
                      <textarea value={newCheck} onChange={e=>setNewCheck(e.target.value)} rows={2}
                        placeholder="Record the welfare check action and outcome…"
                        style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #D0D8E4', borderRadius:8, fontSize:12, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
                      <div style={{ display:'flex', gap:8, marginTop:8 }}>
                        <button onClick={()=>addWelfareCheck(w.id)}
                          style={{ padding:'7px 14px', borderRadius:6, border:'none', background:navy, color:'white', fontSize:11, fontWeight:700, cursor:'pointer' }}>Log check</button>
                        <button onClick={()=>{setShowNewCheck(null);setNewCheck('');}}
                          style={{ padding:'7px 12px', borderRadius:6, border:'1px solid #D0D8E4', background:'white', fontSize:11, cursor:'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:8, marginTop:12 }}>
                      <button onClick={()=>setShowNewCheck(w.id)}
                        style={{ padding:'6px 12px', borderRadius:6, border:`1px solid ${navy}`, background:'white', color:navy, fontSize:11, fontWeight:700, cursor:'pointer' }}>+ Add check</button>
                      <button onClick={()=>resolveFlag(w.id)}
                        style={{ padding:'6px 12px', borderRadius:6, border:`1px solid ${green}`, background:'white', color:green, fontSize:11, fontWeight:700, cursor:'pointer' }}>✓ Resolve</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {welfare.filter(w=>w.status==='Resolved').length > 0 && (
            <>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'#5A7090', marginBottom:10, marginTop:4 }}>Resolved</div>
              {welfare.filter(w=>w.status==='Resolved').map(w=>(
                <div key={w.id} style={{ background:'white', borderRadius:10, border:'1px solid #E5EAF2', padding:'12px 16px', marginBottom:10, opacity:0.7 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <StatusPill status="Resolved" />
                    <span style={{ fontWeight:700, color:navy }}>{w.cadet}</span>
                    <span style={{ fontSize:11, color:'#5A7090' }}>· {w.reason}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Attendance-based auto-flags */}
          <div style={{ marginTop:16, fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:navy, marginBottom:10 }}>Attendance Watch (auto-detected)</div>
          <div style={{ background:'white', borderRadius:10, border:'1px solid #E5EAF2', overflow:'hidden' }}>
            {CADETS.filter(c=>c.att<75).map((c,i)=>(
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderTop:i>0?'1px solid #F0F4F8':'none' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0 }}>{c.ini}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:navy, fontSize:13 }}>{c.rank} {c.sn}, {c.fn}</div>
                  <div style={{ fontSize:11, color:'#5A7090' }}>Attendance: {c.att}% this term</div>
                </div>
                <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>LOW ATTENDANCE</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GUIDANCE ── */}
      {sub === 'guidance' && (
        <div>
          {/* The 4 Rs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { r:'Recognise', color:'#8B1A1A', bg:'#FEE2E2', desc:'Signs of abuse or neglect — physical, emotional, sexual, or exploitation. Changes in behaviour, unexplained injuries, withdrawal.' },
              { r:'Respond', color:'#92400E', bg:'#FEF3C7', desc:'Stay calm. Listen carefully. Do not promise confidentiality. Do not ask leading questions. Reassure the child they did the right thing.' },
              { r:'Record', color:'#065F46', bg:'#D1FAE5', desc:'Write down exact words used. Record facts only — no opinion. Include date, time, who was present. Log immediately, do not wait.' },
              { r:'Refer', color:'#00264D', bg:'#EEF2F8', desc:'Tell the DSL immediately. Do not investigate yourself. If child is in immediate danger, call 999 first, then the DSL.' },
            ].map(item=>(
              <div key={item.r} style={{ background:item.bg, border:`1px solid ${item.color}30`, borderRadius:12, padding:'16px 14px', borderTop:`4px solid ${item.color}` }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:item.color, marginBottom:8 }}>{item.r.toUpperCase()}</div>
                <div style={{ fontSize:12, color:'#00264D', lineHeight:1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Key contacts */}
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:10 }}>Key Contacts</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
            {[
              { label:'Squadron DSL', name:DSL.name, role:DSL.role, tel:DSL.tel, color:navy },
              { label:'Wing SCC', name:WING_SCC.name, role:WING_SCC.role, tel:WING_SCC.tel, color:'#5B21B6' },
              { label:'LADO', name:LADO.name, role:LADO.org, tel:LADO.tel, color:red },
            ].map(c=>(
              <div key={c.label} style={{ background:'white', border:'1px solid #E5EAF2', borderRadius:10, padding:'14px 16px', borderLeft:`4px solid ${c.color}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#5A7090', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{c.label}</div>
                <div style={{ fontWeight:800, color:navy, fontSize:13 }}>{c.name}</div>
                <div style={{ fontSize:11, color:'#5A7090', marginTop:2 }}>{c.role}</div>
                <div style={{ fontSize:13, fontWeight:700, color:c.color, marginTop:8 }}>📞 {c.tel}</div>
              </div>
            ))}
          </div>

          {/* Safe practice rules */}
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:10 }}>Safe Practice Rules</div>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #E5EAF2', overflow:'hidden', marginBottom:16 }}>
            {[
              { icon:'👥', rule:'Never be alone with a single cadet', detail:'Two adults must always be present, or the cadet must be visible to other cadets. No exceptions.' },
              { icon:'📱', rule:'No personal social media contact with cadets', detail:'All contact must be through official RAFAC channels. No WhatsApp, Instagram, TikTok, or personal email.' },
              { icon:'🚗', rule:'No transporting cadets in a personal vehicle', detail:'Unless with written parental consent and a second adult present. Logged in advance.' },
              { icon:'📷', rule:'No photography of cadets without consent', detail:'Official photography only. No personal devices. Images stored securely and never shared publicly without consent.' },
              { icon:'🏠', rule:'No cadets at a staff member\'s home', detail:'Squadron activities must take place at approved venues only.' },
              { icon:'1️⃣', rule:'1:8 ratio minimum for AT activities', detail:'One qualified adult supervisor per 8 cadets for adventure training. More for high-risk activities.' },
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', gap:14, padding:'13px 18px', borderTop:i>0?'1px solid #F0F4F8':'none', alignItems:'flex-start' }}>
                <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight:700, color:navy, fontSize:13 }}>{r.rule}</div>
                  <div style={{ fontSize:12, color:'#5A7090', marginTop:2 }}>{r.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Policy references */}
          <div style={{ background:'#F4F7FB', borderRadius:8, padding:'12px 16px', fontSize:11, color:'#5A7090', lineHeight:1.8 }}>
            <strong style={{ color:navy }}>Policy references:</strong> AP1919 (RAFAC Policy & Procedures) · ACTO 035 (Safeguarding & Child Protection) · Children Act 1989 & 2004 · Working Together to Safeguard Children 2023 · Keeping Children Safe in Education (KCSIE) · JSP 900 (MOD Safeguarding)
          </div>
        </div>
      )}
    </div>
  );
}
