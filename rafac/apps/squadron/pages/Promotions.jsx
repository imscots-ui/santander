import { useState } from 'react';
import { CADETS, RANK_ORDER, RANK_COLOR } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const RECOMMENDATIONS = [
  { id:'r1', cadetId:'c01', ini:'SM', name:'Mitchell, S.', from:'Cpl',  to:'Sgt',  eligible:true,  recommender:'Sgt Reid',    eligNote:'All criteria met' },
  { id:'r2', cadetId:'c03', ini:'RA', name:'Ahmed, R.',    from:'LCpl', to:'Cpl',  eligible:true,  recommender:'Sgt Reid',    eligNote:'All criteria met' },
  { id:'r3', cadetId:'c08', ini:'EP', name:'Patel, E.',    from:'Cdt',  to:'LCdt', eligible:false, recommender:'WO Davies',   eligNote:'Awaiting First Class classification' },
];

const BADGE_AWARDS = [
  { id:'b1', ini:'SM', name:'Mitchell, S.', badge:'Bronze Cyber',          source:'auto', course:'Cyber Gold (QR verified)',       status:'awarded' },
  { id:'b2', ini:'RA', name:'Ahmed, R.',    badge:'Blue Leadership',        source:'auto', course:'Leadership Course (QR verified)', status:'awarded' },
  { id:'b3', ini:'TM', name:'Thomas, M.',   badge:'Senior classification',  source:'auto', course:'Course outcome: Passed',          status:'awarded', external:'301 (Bradford)' },
  { id:'b4', ini:'JH', name:'Harper, J.',   badge:'First Class',            source:'manual', manual:'WO Davies',                    status:'pending' },
];

const CRITERIA = [
  { rank:'Senior Cadet (Cdt SC)', minAge:'—',   cls:'First Class',    time:'—',          other:'OC discretion' },
  { rank:'Lance Corporal (LCdt)',  minAge:'13½', cls:'First Class',    time:'3 months',   other:'JNCO cadre / OC recommendation' },
  { rank:'Corporal (Cpl)',         minAge:'14',  cls:'Leading',        time:'6 months LCdt', other:'Leadership weekend' },
  { rank:'Sergeant (Sgt)',         minAge:'15',  cls:'Senior',         time:'6 months Cpl', other:'SNCO cadre · Gold Leadership' },
  { rank:'Flight Sergeant (FS)',   minAge:'16',  cls:'Senior',         time:'9 months Sgt', other:'Wing board' },
  { rank:'Warrant Officer (WO)',   minAge:'16½', cls:'Master Cadet',   time:'12 months FS', other:'Wing board · exceptional' },
];

export default function Promotions({ showToast, addAudit }) {
  const [tab, setTab]       = useState('progression');
  const [recStatus, setRecStatus] = useState({});
  const [badgeStatus, setBadgeStatus] = useState({});

  function authorise(id) {
    const r = RECOMMENDATIONS.find(x => x.id === id);
    setRecStatus(p => ({ ...p, [id]: 'authorised' }));
    addAudit?.('Promotion AUTHORISED', r.name, `${r.from} → ${r.to} · recommended by ${r.recommender}, authorised by Sqn Ldr Harris`);
    showToast(`✅ ${r.name} promoted to ${r.to} — two-officer authorisation complete`);
  }
  function defer(id) {
    setRecStatus(p => ({ ...p, [id]: 'deferred' }));
    showToast('↩ Recommendation deferred');
  }
  function awardBadge(id) {
    const b = BADGE_AWARDS.find(x => x.id === id);
    setBadgeStatus(p => ({ ...p, [id]: 'awarded' }));
    addAudit?.('Badge AWARDED', b.name, `${b.badge} — manual sign-off · confirmation email sent`);
    showToast(`🎖️ ${b.badge} awarded to ${b.name} — record updated, confirmation email sent`);
  }

  const curRankIdx = c => RANK_ORDER.indexOf(c.rank);
  const pendingRecs = RECOMMENDATIONS.filter(r => !recStatus[r.id]).length;

  const Pill = ({ children, bg, color }) => (
    <span style={{ background:bg, color, padding:'2px 9px', borderRadius:10, fontSize:10, fontWeight:700 }}>{children}</span>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Promotion & Progression</div>
          <div style={{ fontSize:12, color:muted }}>Rank ladder · PTS classification · badge awards · two-officer authorisation</div>
        </div>
        <button onClick={() => { setTab('recommendations'); showToast('+ New promotion recommendation'); }}
          style={{ padding:'8px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>
          + New Recommendation
        </button>
      </div>

      <div style={{ display:'flex', gap:0, marginBottom:20, borderBottom:`2px solid ${border}` }}>
        {[['progression','Progression Overview'],['recommendations',`Recommendations (${pendingRecs})`],['badges','Badge Awards'],['criteria','Promotion Criteria']].map(([id,label])=>(
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:'9px 20px', border:'none', background:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif', fontSize:13, fontWeight: tab===id?800:500, color: tab===id?navy:muted, borderBottom: tab===id?`3px solid ${navy}`:'3px solid transparent', marginBottom:-2, whiteSpace:'nowrap' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Progression */}
      {tab === 'progression' && (
        <>
          <div style={{ background:'#EAF4FF', border:'1px solid #B3D4F0', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#003D80', display:'flex', gap:10 }}>
            <span>🎖️</span><span>Every cadet's rank progression (Cadet → Cadet Warrant Officer) and PTS classification. Badges and classifications are awarded automatically when a cadet completes a course — the outcome flows straight into their record.</span>
          </div>
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'180px 1fr 160px 130px 160px', gap:14, padding:'9px 16px', background:'#F4F7FB', borderBottom:`2px solid ${border}`, fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>
              <div>Cadet</div><div>Rank progression → Cdt WO</div><div>PTS Classification</div><div>Badges</div><div>Next step</div>
            </div>
            {CADETS.map((c, i) => {
              const idx = curRankIdx(c);
              return (
                <div key={c.id} style={{ display:'grid', gridTemplateColumns:'180px 1fr 160px 130px 160px', gap:14, padding:'12px 16px', borderBottom: i<CADETS.length-1?`1px solid ${border}`:'none', background:i%2?'#fafcfe':'white', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0 }}>{c.ini}</div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700 }}>{c.sn}, {c.fn}</div>
                      <span style={{ background: RANK_COLOR[c.rank]||'#5A7090', color:'white', padding:'1px 6px', borderRadius:4, fontSize:9, fontWeight:700 }}>{c.rank}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:0 }}>
                    {RANK_ORDER.map((r, ri) => (
                      <div key={r} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, position:'relative' }}>
                        {ri < RANK_ORDER.length-1 && <div style={{ position:'absolute', top:7, left:'50%', width:'100%', height:2, background: ri<idx?gold:'#E8EEF5', zIndex:1 }} />}
                        <div style={{ width: ri===idx?16:12, height: ri===idx?16:12, borderRadius:'50%', background: ri<=idx?gold:'#E8EEF5', border: ri===idx?`3px solid rgba(200,160,50,0.3)`:'none', zIndex:2, flexShrink:0 }} />
                        <div style={{ fontSize:7, color: ri===idx?gold:muted, fontWeight: ri===idx?800:400, whiteSpace:'nowrap' }}>{r}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:12 }}>
                    <span style={{ background:'#EAF4FF', color:'#003D80', padding:'2px 8px', borderRadius:6, fontWeight:700, fontSize:11 }}>{c.pts}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:navy }}>{c.badges} badge{c.badges!==1?'s':''}</div>
                  <div style={{ fontSize:11, color:muted }}>
                    {idx < RANK_ORDER.length-1
                      ? <span>→ <strong>{RANK_ORDER[idx+1]}</strong></span>
                      : <Pill bg='#D4EDDA' color='#0F4020'>Top rank</Pill>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recommendations */}
      {tab === 'recommendations' && (
        <>
          <div style={{ background:'#FFF8E6', border:'1px solid #F0C84A', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#7A4A00', display:'flex', gap:10 }}>
            <span>✍️</span><span>Promotions require two-officer authorisation. The recommending NCO submits here; the OC or second officer authorises. All actions are locked to the audit log.</span>
          </div>
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                {['Cadet','Current','Proposed','Eligible','Recommender','Action'].map(h=>(
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {RECOMMENDATIONS.map((r, i) => {
                  const st = recStatus[r.id];
                  return (
                    <tr key={r.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                      <td style={{ padding:'12px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800 }}>{r.ini}</div>
                          <strong>{r.name}</strong>
                        </div>
                      </td>
                      <td style={{ padding:'12px 12px' }}><span style={{ background:RANK_COLOR[r.from]||'#5A7090', color:'white', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:700 }}>{r.from}</span></td>
                      <td style={{ padding:'12px 12px' }}><span style={{ background:RANK_COLOR[r.to]||'#5A7090', color:'white', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:700 }}>{r.to}</span></td>
                      <td style={{ padding:'12px 12px' }}>
                        {r.eligible ? <Pill bg='#D4EDDA' color='#0F4020'>✅ {r.eligNote}</Pill> : <Pill bg='#FFF3CC' color='#7A4A00'>⚠ {r.eligNote}</Pill>}
                      </td>
                      <td style={{ padding:'12px 12px', fontSize:12, color:muted }}>{r.recommender}</td>
                      <td style={{ padding:'12px 12px', whiteSpace:'nowrap' }}>
                        {!st && r.eligible && <button onClick={() => authorise(r.id)} style={{ padding:'5px 12px', background:'#1B6B3A', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', marginRight:4 }}>✍️ Authorise (2nd sign-off)</button>}
                        {!st && <button onClick={() => defer(r.id)} style={{ padding:'5px 12px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer' }}>Defer</button>}
                        {st === 'authorised' && <Pill bg='#D4EDDA' color='#0F4020'>✅ Authorised</Pill>}
                        {st === 'deferred'   && <Pill bg='#E8E8F0' color='#555'>↩ Deferred</Pill>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Badges */}
      {tab === 'badges' && (
        <>
          <div style={{ background:'#D4EDDA', border:'1px solid #A8D5B5', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#0F4020', display:'flex', gap:10 }}>
            <span>🔄</span><span><strong>Automatic awards:</strong> when an instructor marks a cadet Passed on a course, the badge is awarded to their record automatically, a confirmation email is sent to the home squadron OC, and the action is written to the audit log — no manual sign-off needed.</span>
          </div>
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                {['Cadet','Badge / Classification','Source','Status',''].map(h=>(
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {BADGE_AWARDS.map((b, i) => {
                  const awarded = badgeStatus[b.id] === 'awarded' || b.status === 'awarded';
                  return (
                    <tr key={b.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                      <td style={{ padding:'12px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800 }}>{b.ini}</div>
                          <strong>{b.name}</strong>
                          {b.external && <span style={{ fontSize:10, background:'#EAF4FF', color:'#003D80', padding:'1px 6px', borderRadius:5, fontWeight:700 }}>External · {b.external}</span>}
                        </div>
                      </td>
                      <td style={{ padding:'12px 12px', fontWeight:700 }}>{b.badge}</td>
                      <td style={{ padding:'12px 12px', fontSize:12 }}>
                        {b.source === 'auto'
                          ? <span style={{ background:'#EAF4FF', color:'#003D80', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:700 }}>🔄 Auto — {b.course}</span>
                          : <span style={{ fontSize:12, color:muted }}>Manual · {b.manual}</span>}
                      </td>
                      <td style={{ padding:'12px 12px' }}>
                        {awarded ? <Pill bg='#D4EDDA' color='#0F4020'>✅ Awarded to record</Pill> : <Pill bg='#FFF3CC' color='#7A4A00'>⏳ Awaiting evidence</Pill>}
                      </td>
                      <td style={{ padding:'12px 12px' }}>
                        {!awarded
                          ? <button onClick={() => awardBadge(b.id)} style={{ padding:'5px 12px', background:'#1B6B3A', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>Award</button>
                          : <button onClick={() => showToast('📋 Opening cadet record…')} style={{ padding:'5px 12px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer' }}>View record</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Criteria */}
      {tab === 'criteria' && (
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
              {['Rank','Min. age','Classification required','Time in rank','Other requirements'].map(h=>(
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {CRITERIA.map((c, i) => (
                <tr key={c.rank} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                  <td style={{ padding:'12px 14px', fontWeight:800, color:navy }}>{c.rank}</td>
                  <td style={{ padding:'12px 14px' }}>{c.minAge}</td>
                  <td style={{ padding:'12px 14px' }}><span style={{ background:'#EAF4FF', color:'#003D80', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:700 }}>{c.cls}</span></td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:muted }}>{c.time}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:muted }}>{c.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
