import { useState, useEffect, useCallback } from 'react';
import { getFormStatus, FORM_KEY } from '../../data/sync.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const TRACKED = [
  { cId:'c01', eId:'e1' }, { cId:'c03', eId:'e1' },
  { cId:'c02', eId:'e5' }, { cId:'c04', eId:'e5' }, { cId:'c05', eId:'e5' },
];

const SQUADRONS = [
  { id:'1701', name:'1701 (Johnstone)', oc:'Sqn Ldr J. Harris',   strength:24, live:true },
  { id:'342',  name:'342 (Paisley)',    oc:'Flt Lt M. Singh',      strength:31, live:false, comp:91 },
  { id:'1944', name:'1944 (Renfrew)',   oc:'Fg Off C. Wallace',    strength:19, live:false, comp:88 },
  { id:'1138', name:'1138 (Greenock)', oc:'Sqn Ldr T. Burns',     strength:27, live:false, comp:78 },
  { id:'2462', name:'2462 (Port Glasgow)', oc:'Flt Lt A. Docherty',strength:22, live:false, comp:95 },
  { id:'414',  name:'414 (Gourock)',    oc:'Fg Off R. Stewart',    strength:17, live:false, comp:82 },
];

const APPROVALS = [
  { id:'a1', type:'AT Event',      sqn:'1701 (Johnstone)', desc:'Shooting — Bisley 14–16 Nov',   ref:'AT/2026/114', date:'9 Nov 2026',  risk:'Medium' },
  { id:'a2', type:'Staff Warrant', sqn:'342 (Paisley)',    desc:'New CI application — M. Brodie', ref:'CI/2026/089', date:'8 Nov 2026',  risk:'Low' },
  { id:'a3', type:'H&S Review',    sqn:'1138 (Greenock)', desc:'RA update — Urban Orienteering', ref:'HS/2026/042', date:'6 Nov 2026',  risk:'High' },
];

const AUDIT = [
  { ts:'14 Nov 09:42', user:'Wg Cdr T. Elliot',    action:'Approved AT/2026/114 — Shooting (1701)' },
  { ts:'12 Nov 14:18', user:'Admin',                action:'CI/2026/089 submitted for review (342)' },
  { ts:'11 Nov 11:02', user:'Wg Cdr T. Elliot',    action:'Returned HS/2026/042 — awaiting updated RA (1138)' },
  { ts:'9 Nov 16:55',  user:'Sqn Ldr J. Harris',   action:'AT/2026/114 submitted — 1701 Shooting event' },
  { ts:'7 Nov 10:00',  user:'Admin',                action:'Sector compliance report generated — Nov 2026' },
];

function compBand(c) {
  if (c >= 95) return { label:'Compliant',       bg:'#D4EDDA', color:'#0F4020' };
  if (c >= 85) return { label:'Monitor',         bg:'#FFF3CC', color:'#7A4A00' };
  if (c >= 75) return { label:'Watch',           bg:'#FFE0B2', color:'#7A2500' };
  return              { label:'Action Required', bg:'#F8D7DA', color:'#8B1A1A' };
}

function Pill({ label, bg, color }) {
  return <span style={{ background:bg, color, padding:'2px 9px', borderRadius:10, fontSize:10, fontWeight:700 }}>{label}</span>;
}

export default function WingApp() {
  const [page, setPage] = useState('overview');
  const [agg1701, setAgg1701] = useState({ signed:0, sent:0, unsent:0, total:0, comp:0 });
  const [approvalStatus, setApprovalStatus] = useState({});
  const [auditLog, setAuditLog] = useState(AUDIT);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const calc1701 = useCallback(() => {
    const fs = getFormStatus();
    let signed=0, sent=0, unsent=0;
    TRACKED.forEach(({ cId, eId }) => {
      const s = fs[eId]?.[cId] || 'unsent';
      if (s === 'signed') signed++;
      else if (s === 'sent') sent++;
      else unsent++;
    });
    const total = TRACKED.length;
    const comp = total ? Math.round((signed / total) * 100) : 0;
    setAgg1701({ signed, sent, unsent, total, comp });
  }, []);

  useEffect(() => {
    calc1701();
    const onStorage = e => { if (e.key === FORM_KEY) calc1701(); };
    const onEvent = () => calc1701();
    window.addEventListener('storage', onStorage);
    window.addEventListener('rafac-form-update', onEvent);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('rafac-form-update', onEvent); };
  }, [calc1701]);

  const squadronsWithLive = SQUADRONS.map(s => {
    if (s.live) {
      const band = compBand(agg1701.comp);
      return { ...s, comp: agg1701.comp, band };
    }
    return { ...s, band: compBand(s.comp) };
  });

  function approve(id) {
    setApprovalStatus(p => ({ ...p, [id]: 'approved' }));
    const item = APPROVALS.find(a => a.id === id);
    setAuditLog(l => [{ ts: new Date().toLocaleString('en-GB', { hour:'2-digit', minute:'2-digit', day:'numeric', month:'short' }), user:'Wg Cdr T. Elliot', action:`Approved ${item.ref} — ${item.desc}` }, ...l]);
    showToast(`✅ ${item.ref} approved`);
  }
  function returnItem(id) {
    setApprovalStatus(p => ({ ...p, [id]: 'returned' }));
    const item = APPROVALS.find(a => a.id === id);
    setAuditLog(l => [{ ts: new Date().toLocaleString('en-GB', { hour:'2-digit', minute:'2-digit', day:'numeric', month:'short' }), user:'Wg Cdr T. Elliot', action:`Returned ${item.ref} — awaiting revision` }, ...l]);
    showToast(`↩ ${item.ref} returned for revision`, 'warn');
  }

  const NAV = [
    { id:'overview',  icon:'📊', label:'Sector Overview' },
    { id:'squadrons', icon:'🏠', label:'Squadron Status' },
    { id:'approvals', icon:'✅', label:'Wing Approvals' },
    { id:'hs',        icon:'🛡️', label:'H&S Compliance' },
    { id:'audit',     icon:'📋', label:'Audit Log' },
  ];

  const Card = ({ children, style={} }) => (
    <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', ...style }}>{children}</div>
  );

  const StatTile = ({ label, value, sub, accent=navy }) => (
    <Card>
      <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:accent }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:muted, marginTop:3 }}>{sub}</div>}
    </Card>
  );

  return (
    <div style={{ display:'flex', height:'100%', fontFamily:'Barlow,sans-serif', background:'#F4F7FB', position:'relative' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:20, right:20, background:navy, color:'white', padding:'10px 18px', borderRadius:8, fontSize:13, fontWeight:600, zIndex:9999, boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width:220, background:navy, display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 12px', borderBottom:`1px solid rgba(255,255,255,0.1)` }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'white' }}>WING HQ</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em' }}>WEST SCOTLAND SECTOR</div>
          <div style={{ marginTop:8, background:'rgba(200,160,50,0.15)', border:'1px solid rgba(200,160,50,0.3)', borderRadius:6, padding:'4px 8px', fontSize:9, color:'rgba(200,160,50,0.9)', fontWeight:700, letterSpacing:'0.06em' }}>
            🔒 OFFICIAL-SENSITIVE
          </div>
        </div>
        <nav style={{ flex:1, padding:'8px 0' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 18px', background: page===n.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: page===n.id ? 'white' : 'rgba(255,255,255,0.6)', border:'none', cursor:'pointer', fontSize:13, fontWeight: page===n.id ? 700 : 500, borderLeft: page===n.id ? `3px solid ${gold}` : '3px solid transparent', fontFamily:'Barlow,sans-serif', textAlign:'left' }}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,0.1)', fontSize:10, color:'rgba(255,255,255,0.35)' }}>
          Wg Cdr T. Elliot · OC West Scotland
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:'auto', padding:24 }}>

        {page === 'overview' && (
          <>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:4 }}>Sector Overview</div>
            <div style={{ fontSize:12, color:muted, marginBottom:20 }}>West Scotland Sector · {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
              <StatTile label="Total Cadets" value={SQUADRONS.reduce((a,s)=>a+s.strength,0)} sub="Across 6 squadrons" />
              <StatTile label="Squadrons" value="6" sub="West Scotland Sector" />
              <StatTile label="Pending Approvals" value={APPROVALS.filter(a=>!approvalStatus[a.id]).length} sub="Require action" accent="#8B1A1A" />
              <StatTile label="1701 Form Compliance" value={`${agg1701.comp}%`} sub={`${agg1701.signed}/${agg1701.total} forms signed · live`} accent={agg1701.comp >= 85 ? '#1B6B3A' : '#8B1A1A'} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
              <Card>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>1701 Live Consent Tracker</div>
                {[
                  { label:'Signed', count:agg1701.signed, color:'#1B6B3A', bg:'#D4EDDA' },
                  { label:'Sent — awaiting', count:agg1701.sent, color:'#7A4A00', bg:'#FFF3CC' },
                  { label:'Not yet sent', count:agg1701.unsent, color:'#8B1A1A', bg:'#F8D7DA' },
                ].map(r => (
                  <div key={r.label} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div style={{ flex:1, fontSize:12, color:'#0D1B2E', fontWeight:600 }}>{r.label}</div>
                    <div style={{ width:140, height:8, background:'#f0f4fa', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ width:`${agg1701.total ? (r.count/agg1701.total)*100 : 0}%`, height:'100%', background:r.color, borderRadius:4 }} />
                    </div>
                    <Pill label={r.count} bg={r.bg} color={r.color} />
                  </div>
                ))}
              </Card>
              <Card>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Pending Approvals</div>
                {APPROVALS.filter(a=>!approvalStatus[a.id]).slice(0,3).map(a => (
                  <div key={a.id} style={{ marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${border}` }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#0D1B2E', marginBottom:2 }}>{a.type}</div>
                    <div style={{ fontSize:11, color:muted }}>{a.sqn} · {a.ref}</div>
                  </div>
                ))}
                {!APPROVALS.some(a=>!approvalStatus[a.id]) && <div style={{ fontSize:12, color:muted }}>All clear — nothing pending</div>}
                <button onClick={() => setPage('approvals')} style={{ marginTop:8, fontSize:12, color:navy, fontWeight:700, background:'none', border:'none', cursor:'pointer', padding:0 }}>View all →</button>
              </Card>
            </div>
          </>
        )}

        {page === 'squadrons' && (
          <>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:20 }}>Squadron Status</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {squadronsWithLive.map(s => (
                <Card key={s.id}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div>
                      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, fontSize:15 }}>{s.name}</div>
                      <div style={{ fontSize:11, color:muted }}>{s.oc}</div>
                    </div>
                    <Pill {...s.band} />
                  </div>
                  <div style={{ display:'flex', gap:16, marginTop:8 }}>
                    <div style={{ fontSize:12, color:muted }}>Strength: <strong style={{ color:'#0D1B2E' }}>{s.strength}</strong></div>
                    <div style={{ fontSize:12, color:muted }}>Forms: <strong style={{ color:'#0D1B2E' }}>{s.comp}%</strong></div>
                    {s.live && <span style={{ fontSize:10, color:'#1B6B3A', fontWeight:700 }}>● LIVE</span>}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {page === 'approvals' && (
          <>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:20 }}>Wing Approvals</div>
            {APPROVALS.map(a => {
              const st = approvalStatus[a.id];
              return (
                <Card key={a.id} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                        <span style={{ background:'#EAF4FF', color:'#00386B', border:'1px solid #B3D4F0', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{a.type}</span>
                        <span style={{ background: a.risk==='High' ? '#F8D7DA' : a.risk==='Medium' ? '#FFF3CC' : '#D4EDDA', color: a.risk==='High' ? '#8B1A1A' : a.risk==='Medium' ? '#7A4A00' : '#0F4020', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>Risk: {a.risk}</span>
                      </div>
                      <div style={{ fontWeight:700, color:'#0D1B2E', marginBottom:2 }}>{a.desc}</div>
                      <div style={{ fontSize:12, color:muted }}>{a.sqn} · Ref: {a.ref} · {a.date}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, marginLeft:16 }}>
                      {!st && <>
                        <button onClick={() => approve(a.id)} style={{ padding:'7px 16px', background:navy, color:'white', border:'none', borderRadius:7, fontWeight:700, fontSize:12, cursor:'pointer' }}>✅ Approve</button>
                        <button onClick={() => returnItem(a.id)} style={{ padding:'7px 16px', background:'white', color:'#8B1A1A', border:'1px solid #F8D7DA', borderRadius:7, fontWeight:700, fontSize:12, cursor:'pointer' }}>↩ Return</button>
                      </>}
                      {st === 'approved' && <Pill label="✅ Approved" bg="#D4EDDA" color="#0F4020" />}
                      {st === 'returned' && <Pill label="↩ Returned" bg="#F8D7DA" color="#8B1A1A" />}
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {page === 'hs' && (
          <>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:20 }}>H&S Compliance</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
              {[{label:'Compliant ≥95%',bg:'#D4EDDA',color:'#0F4020',n:2},{label:'Monitor ≥85%',bg:'#FFF3CC',color:'#7A4A00',n:3},{label:'Watch ≥75%',bg:'#FFE0B2',color:'#7A2500',n:0},{label:'Action Required <75%',bg:'#F8D7DA',color:'#8B1A1A',n:1}].map(b=>(
                <Card key={b.label}><div style={{fontSize:11,color:muted,fontWeight:700,marginBottom:4}}>{b.label}</div><div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:28,fontWeight:800,color:b.color}}>{b.n}</div></Card>
              ))}
            </div>
            <Card>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ borderBottom:`2px solid ${border}` }}>
                  {['Squadron','OC','Strength','Compliance','Band'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {squadronsWithLive.map((s,i)=>(
                    <tr key={s.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                      <td style={{padding:'10px 12px',fontWeight:700}}>{s.name}</td>
                      <td style={{padding:'10px 12px',color:muted,fontSize:12}}>{s.oc}</td>
                      <td style={{padding:'10px 12px'}}>{s.strength}</td>
                      <td style={{padding:'10px 12px',fontWeight:700}}>{s.comp}%{s.live&&<span style={{fontSize:9,color:'#1B6B3A',marginLeft:6,fontWeight:700}}>LIVE</span>}</td>
                      <td style={{padding:'10px 12px'}}><Pill {...s.band} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {page === 'audit' && (
          <>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:20 }}>Audit Log</div>
            <Card>
              {auditLog.map((e, i) => (
                <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom: i<auditLog.length-1 ? `1px solid ${border}` : 'none' }}>
                  <div style={{ fontSize:11, color:muted, whiteSpace:'nowrap', width:130, flexShrink:0 }}>{e.ts}</div>
                  <div>
                    <div style={{ fontSize:13, color:'#0D1B2E', fontWeight:600 }}>{e.action}</div>
                    <div style={{ fontSize:11, color:muted, marginTop:2 }}>{e.user}</div>
                  </div>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
