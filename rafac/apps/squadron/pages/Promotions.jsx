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

  function printPromotionRegister() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const rankColors = { 'Cdt':'#5A7090','LCdt':'#2E6B9E','Cpl':'#1B6B3A','Sgt':'#7A4A00','FS':'#6B2E7A','WO':'#8B2000' };
    const rows = CADETS.map((c, i) => {
      const idx = RANK_ORDER.indexOf(c.rank);
      const pct = Math.round((idx / (RANK_ORDER.length - 1)) * 100);
      const nextRank = idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : '—';
      return `<tr style="background:${i%2?'#FAFCFE':'white'}">
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;">${c.sn}, ${c.fn}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${rankColors[c.rank]||'#5A7090'};color:white;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700;white-space:nowrap;">${c.rank}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;">
          <div style="background:#E8EEF5;border-radius:4px;height:8px;width:100%;"><div style="background:#C8A032;width:${pct}%;height:8px;border-radius:4px;"></div></div>
          <div style="font-size:9px;color:#5A7090;margin-top:2px;">${pct}% to WO</div>
        </td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:#EAF4FF;color:#003D80;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700;">${c.pts}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;">${c.badges}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${nextRank}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Promotion Register — 1701 Sqn</title>
    <style>
      @page { size: A4 landscape; margin: 12mm 14mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:11px; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">
      <tr>
        <td style="width:50px;">
          <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg>
        </td>
        <td style="padding-left:12px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;line-height:1.1;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">PROMOTION & PROGRESSION REGISTER</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">As at ${today}</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">Total cadets: ${CADETS.length}</div>
          <div style="font-size:10px;color:#5A7090;">Pending recommendations: ${RECOMMENDATIONS.filter(r=>r.eligible).length}</div>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CADET</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CURRENT RANK</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">RANK PROGRESSION</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">PTS CLASSIFICATION</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">BADGES</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">NEXT RANK</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:28px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:20px;">
      ${['Commanding Officer','Wing Commander Cadets','Sqn Admin Officer','Date'].map((l,i) => `
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${l}</div>
          <div style="font-size:11px;color:#00264D;margin-top:2px;">${i===0?'Sqn Ldr Harris':i===3?today:''}&nbsp;</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:14px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · Promotions governed by AP 1919 Section 7 · Retain 3 years from date of promotion
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Promotion Register printed', 'Promotions', `Printed by Sqn Ldr Harris on ${today}`);
    showToast('🖨️ Promotion register sent to printer');
  }

  function printPromotionLetter(rec) {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Promotion Letter — ${rec.name}</title>
    <style>
      @page { size: A4 portrait; margin: 18mm 20mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:12px; line-height:1.6; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;border-bottom:3px solid #00264D;padding-bottom:12px;">
      <tr>
        <td style="width:56px;">
          <svg width="50" height="50" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg>
        </td>
        <td style="padding-left:14px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#00264D;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-size:10px;color:#5A7090;">Johnston Leisure Centre, Ludovic Square, Johnstone PA5 8EG</div>
        </td>
        <td style="text-align:right;vertical-align:top;font-size:11px;color:#5A7090;">
          ${today}
        </td>
      </tr>
    </table>
    <p style="font-size:11px;color:#5A7090;margin-bottom:20px;">RAFAC / 1701 / PROMO / ${today.replace(/ /g,'-')}</p>
    <p><strong>${rec.name}</strong><br>1701 (Johnstone) Squadron ATC</p>
    <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;color:#00264D;margin:20px 0 10px;">PROMOTION NOTIFICATION — ${rec.from.toUpperCase()} TO ${rec.to.toUpperCase()}</h2>
    <p>Dear ${rec.name.split(',')[1]?.trim() || rec.name},</p>
    <p>I am pleased to inform you that, having met all the criteria for promotion within the Air Training Corps, you have been promoted to the rank of <strong>${rec.to}</strong> with effect from ${today}.</p>
    <p>This promotion has been recommended by <strong>${rec.recommender}</strong> and authorised by the Commanding Officer under two-officer sign-off procedures in accordance with AP 1919 Section 7.</p>
    <p>You should wear the insignia of your new rank with immediate effect. Your record will be updated on the squadron's management system within 5 working days, and your Wing HQ will be notified.</p>
    <p>Please take a moment to review the responsibilities that accompany this promotion and speak to your Flight Commander if you have any questions.</p>
    <p>Congratulations on this achievement — it reflects your hard work, dedication, and commitment to the Air Training Corps.</p>
    <div style="margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:30px;">
      <div>
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Commanding Officer</div>
          <div style="font-size:12px;color:#00264D;margin-top:2px;">Sqn Ldr Harris</div>
          <div style="font-size:10px;color:#5A7090;">1701 (Johnstone) Squadron ATC</div>
        </div>
      </div>
      <div>
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Date</div>
          <div style="font-size:12px;color:#00264D;margin-top:2px;">${today}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:30px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · This letter is an official record of promotion · Retain on personal file (AP 1919 Section 7)
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Promotion letter printed', rec.name, `${rec.from} → ${rec.to} · printed by Sqn Ldr Harris on ${today}`);
    showToast(`🖨️ Promotion letter for ${rec.name} sent to printer`);
  }

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
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={printPromotionRegister}
            style={{ padding:'8px 16px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
            📄 Print Register
          </button>
          <button onClick={() => { setTab('recommendations'); showToast('+ New promotion recommendation'); }}
            style={{ padding:'8px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>
            + New Recommendation
          </button>
        </div>
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
                        {!st && <button onClick={() => defer(r.id)} style={{ padding:'5px 12px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer', marginRight:4 }}>Defer</button>}
                        {st === 'authorised' && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                            <Pill bg='#D4EDDA' color='#0F4020'>✅ Authorised</Pill>
                            <button onClick={() => printPromotionLetter(r)} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:10, background:'white', cursor:'pointer', fontWeight:600 }}>📄 Print Letter</button>
                          </span>
                        )}
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
