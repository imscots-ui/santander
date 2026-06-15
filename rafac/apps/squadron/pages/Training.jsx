import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const AT_QUEUE = [
  { id:'at1', cadet:'Cpl Mitchell, S.',   svc:'2408773', event:'Shooting (L98 & .22)',  date:'14–16 Nov', tg21:'Signed',  tg23:'On file 🔒', swim:'✅', eligible:true,  status:'pending' },
  { id:'at2', cadet:'LCpl Ahmed, R.',     svc:'2309441', event:'Shooting (L98 & .22)',  date:'14–16 Nov', tg21:'Awaiting',tg23:'None',       swim:'✅', eligible:false, status:'pending', block:'TG21 not signed' },
  { id:'at3', cadet:'Sgt Thomas, M.',     svc:'2308221', event:'Music Camp',             date:'21–23 Nov', tg21:'Signed',  tg23:'None',       swim:'✅', eligible:true,  status:'pending' },
  { id:'at4', cadet:'Cdt Khan, A.',       svc:'2411099', event:'Music Camp',             date:'21–23 Nov', tg21:'Sent',    tg23:'On file 🔒', swim:'✅', eligible:false, status:'pending', block:'TG21 awaiting signature' },
];

const COURSES = [
  { id:'c1',  title:'L3 Sustainability',           ic:'Sqn Ldr G. Hannam', start:'16 Apr 2026', end:'30 Aug 2026', closes:'5 Apr 2026',  status:'open',   type:'cadet',  booked:2 },
  { id:'c2',  title:'Shooting — L98 & .22 (Bisley)',ic:'WO M. Davies',     start:'14 Nov 2026', end:'16 Nov 2026', closes:'7 Nov 2026',  status:'open',   type:'at',     booked:2 },
  { id:'c3',  title:'Music Camp — RAF Cranwell',   ic:'Sqn Ldr A. Smith',  start:'21 Nov 2026', end:'23 Nov 2026', closes:'14 Nov 2026', status:'open',   type:'cadet',  booked:3 },
  { id:'c4',  title:'Hill Walking Bronze',         ic:'WO M. Davies',      start:'5 Dec 2026',  end:'6 Dec 2026',  closes:'28 Nov 2026', status:'open',   type:'at',     booked:3 },
  { id:'c5',  title:'Gold Cyber',                  ic:'Flt Lt D. Reid',    start:'10 Jan 2027', end:'11 Jan 2027', closes:'3 Jan 2027',  status:'open',   type:'cadet',  booked:1 },
  { id:'c6',  title:'JNCO Cadre (Leadership)',     ic:'WO P. Stewart',     start:'15 Jan 2027', end:'16 Jan 2027', closes:'8 Jan 2027',  status:'open',   type:'cadet',  booked:0 },
  { id:'c7',  title:'Kayaking — West Scotland',    ic:'Sqn Ldr T. Burns',  start:'22 Feb 2027', end:'23 Feb 2027', closes:'15 Feb 2027', status:'open',   type:'at',     booked:2 },
  { id:'c8',  title:'Staff MOI Course',            ic:'Wing HQ',           start:'8 Mar 2027',  end:'9 Mar 2027',  closes:'1 Mar 2027',  status:'open',   type:'adult',  booked:1 },
  { id:'c9',  title:'Ideal Home Show 2026 — Day 1',ic:'BADER Automation',  start:'22 May 2026', end:'22 May 2026', closes:'15 May 2026', status:'closed', type:'cadet',  booked:5 },
];

const TYPE_COLORS = {
  cadet: { bg:'#EAF4FF', color:'#00386B', label:'Cadet' },
  at:    { bg:'#D4EDDA', color:'#0F4020', label:'AT' },
  adult: { bg:'#FFF3CC', color:'#7A4A00', label:'Adult/Staff' },
};

export default function Training({ showToast, addAudit }) {
  const [view, setView]       = useState('queue');   // queue | courses
  const [atStatus, setAtStatus] = useState({});
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch]   = useState('');

  function printATQueue() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const rows = AT_QUEUE.map((a,i) => {
      const st = atStatus[a.id];
      const stBg  = st==='approved'?'#D4EDDA':st==='queried'?'#EAF4FF':'#F4F7FB';
      const stClr = st==='approved'?'#0F4020':st==='queried'?'#003D80':muted;
      const stLbl = st==='approved'?'✅ Approved':st==='queried'?'📧 Queried':a.eligible?'Eligible':'⚠ Blocked';
      const tg21Bg  = a.tg21==='Signed'?'#D4EDDA':a.tg21==='Awaiting'?'#FEE2E2':'#FFF3CC';
      const tg21Clr = a.tg21==='Signed'?'#0F4020':a.tg21==='Awaiting'?'#8B1A1A':'#7A4A00';
      return `<tr style="background:${i%2?'#FAFCFE':'white'};${!a.eligible?'border-left:3px solid #DC2626;':''}">
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;">${a.cadet}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#00264D;">${a.event}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;white-space:nowrap;">${a.date}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${tg21Bg};color:${tg21Clr};padding:2px 7px;border-radius:8px;font-size:9px;font-weight:700;">${a.tg21}</span></td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;font-size:10px;color:#5A7090;">${a.tg23}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;font-size:13px;">${a.swim}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${stBg};color:${stClr};padding:2px 8px;border-radius:8px;font-size:9px;font-weight:700;">${stLbl}</span>${a.block?`<div style="font-size:8px;color:#8B1A1A;margin-top:2px;">${a.block}</div>`:''}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-size:9px;color:#5A7090;font-family:monospace;">${a.svc}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>AT Approval Queue — 1701 Sqn</title>
    <style>
      @page { size: A4 landscape; margin: 12mm 14mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:11px; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;padding-bottom:10px;border-bottom:3px solid #00264D;">
      <tr>
        <td style="width:50px;"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg></td>
        <td style="padding-left:12px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">ADVENTURE TRAINING APPROVAL QUEUE</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">As at ${today} · West Scotland Wing</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">Total cadets: ${AT_QUEUE.length}</div>
          <div style="font-size:10px;color:#7A4A00;font-weight:700;">Pending approval: ${AT_QUEUE.filter(a=>!atStatus[a.id]).length}</div>
        </td>
      </tr>
    </table>
    <div style="background:#EAF4FF;border:1px solid #B3D4F0;border-radius:6px;padding:8px 12px;margin-bottom:12px;font-size:10px;color:#003D80;">
      🔒 TG23 details are special-category data — this register shows only that a TG23 is on file. Actual medical information is held inside the controlled TG23 form on a need-to-know basis.
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CADET</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">ACTIVITY</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DATES</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">TG21</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">TG23</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SWIM</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">STATUS</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SVC No.</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:28px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      ${['Authorising Officer','Wing AT Officer','Date'].map((l,i) => `
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${l}</div>
          <div style="font-size:11px;color:#00264D;margin-top:2px;">${i===0?'Sqn Ldr Harris':i===2?today:''}&nbsp;</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:12px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · AP 1919 · TG21/TG23 data retained 3 years post-activity
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('AT Approval Queue printed', 'Training', `Printed by Sqn Ldr Harris on ${today}`);
    showToast('🖨️ AT approval queue sent to printer');
  }

  function approve(id) {
    setAtStatus(p => ({ ...p, [id]: 'approved' }));
    const a = AT_QUEUE.find(x => x.id === id);
    addAudit?.('AT Approved', a.cadet, `Cleared for ${a.event} · ${a.date}`);
    showToast(`✅ ${a.cadet} approved for ${a.event}`);
  }
  function query(id) {
    setAtStatus(p => ({ ...p, [id]: 'queried' }));
    const a = AT_QUEUE.find(x => x.id === id);
    showToast(`📧 Query sent to parent/NOK re: ${a.cadet}`);
  }

  const pending   = AT_QUEUE.filter(a => !atStatus[a.id]).length;
  const approved  = AT_QUEUE.filter(a => atStatus[a.id] === 'approved').length;
  const queried   = AT_QUEUE.filter(a => atStatus[a.id] === 'queried').length;

  const filteredCourses = COURSES.filter(c => {
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const Pill = ({ children, bg, color }) => (
    <span style={{ background:bg, color, padding:'2px 9px', borderRadius:10, fontSize:10, fontWeight:700 }}>{children}</span>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Training & AT</div>
          <div style={{ fontSize:12, color:muted }}>AT Approval Queue · Course Tracking · West Scotland Wing</div>
        </div>
        {view === 'queue' && (
          <button onClick={printATQueue}
            style={{ padding:'8px 16px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>
            📄 Print Queue
          </button>
        )}
      </div>

      {/* Sub-nav */}
      <div style={{ display:'flex', gap:0, marginBottom:20, borderBottom:`2px solid ${border}` }}>
        {[['queue',`AT Approval Queue (${pending} pending)`],['courses','Course Tracking']].map(([id,label]) => (
          <button key={id} onClick={() => setView(id)}
            style={{ padding:'9px 22px', border:'none', background:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif', fontSize:13, fontWeight: view===id ? 800 : 500, color: view===id ? navy : muted, borderBottom: view===id ? `3px solid ${navy}` : '3px solid transparent', marginBottom:-2 }}>
            {label}
          </button>
        ))}
      </div>

      {/* AT Queue */}
      {view === 'queue' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:18 }}>
            {[{l:'Awaiting approval',v:pending,c:'#7A4A00'},{l:'Approved (MTD)',v:approved,c:'#1B6B3A'},{l:'Queried',v:queried,c:'#003D80'},{l:'Rejected',v:1,c:'#8B1A1A'}].map(t=>(
              <div key={t.l} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px' }}>
                <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.l}</div>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.c }}>{t.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#EAF4FF', border:'1px solid #B3D4F0', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#003D80', display:'flex', gap:10 }}>
            <span>🔒</span><span>Medical details are special-category data. Lists show only that a TG23 is on file — the actual condition is held inside the controlled TG23 form, shown on a need-to-know basis to activity staff only.</span>
          </div>
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                  {['Cadet','Activity','Date','TG21','TG23','Swim','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AT_QUEUE.map((a, i) => {
                  const st = atStatus[a.id];
                  return (
                    <tr key={a.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                      <td style={{ padding:'11px 12px', fontWeight:700 }}>{a.cadet}</td>
                      <td style={{ padding:'11px 12px', fontSize:12 }}>{a.event}</td>
                      <td style={{ padding:'11px 12px', fontSize:12, color:muted, whiteSpace:'nowrap' }}>{a.date}</td>
                      <td style={{ padding:'11px 12px' }}><Pill bg={a.tg21==='Signed'?'#D4EDDA':a.tg21==='Awaiting'?'#F8D7DA':'#FFF3CC'} color={a.tg21==='Signed'?'#0F4020':a.tg21==='Awaiting'?'#8B1A1A':'#7A4A00'}>{a.tg21}</Pill></td>
                      <td style={{ padding:'11px 12px', fontSize:12, color:muted }}>{a.tg23}</td>
                      <td style={{ padding:'11px 12px', fontSize:13 }}>{a.swim}</td>
                      <td style={{ padding:'11px 12px' }}>
                        {!st && (a.eligible
                          ? <Pill bg='#D4EDDA' color='#0F4020'>✅ Eligible</Pill>
                          : <Pill bg='#F8D7DA' color='#8B1A1A'>⚠ {a.block}</Pill>)}
                        {st === 'approved' && <Pill bg='#D4EDDA' color='#0F4020'>✅ Approved</Pill>}
                        {st === 'queried'  && <Pill bg='#EAF4FF' color='#003D80'>📧 Queried</Pill>}
                      </td>
                      <td style={{ padding:'11px 12px', whiteSpace:'nowrap' }}>
                        {!st && <>
                          <button onClick={() => approve(a.id)} style={{ padding:'4px 10px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', marginRight:4 }}>✅ Approve</button>
                          <button onClick={() => query(a.id)} style={{ padding:'4px 10px', background:'#FFF3CC', color:'#7A4A00', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>📧 Query</button>
                        </>}
                        {st && <button onClick={() => showToast('📋 Opening full record…')} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer' }}>View</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Courses */}
      {view === 'courses' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:18 }}>
            {[{l:'Open Courses',v:COURSES.filter(c=>c.status==='open').length,c:navy},{l:'My Cadets Booked',v:COURSES.reduce((s,c)=>s+c.booked,0),c:'#1B6B3A'},{l:'Consents Outstanding',v:4,c:'#7A4A00'},{l:'Cross-Sqn Cadets',v:3,c:muted}].map(t=>(
              <div key={t.l} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px' }}>
                <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.l}</div>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.c }}>{t.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find course…"
              style={{ padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', width:220 }} />
            {['all','cadet','at','adult'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ padding:'7px 14px', border:`1.5px solid ${typeFilter===t?navy:border}`, borderRadius:7, fontSize:12, fontWeight: typeFilter===t?800:500, background: typeFilter===t?navy:'white', color: typeFilter===t?'white':muted, cursor:'pointer' }}>
                {t==='all'?'All':TYPE_COLORS[t]?.label||t}
              </button>
            ))}
            <button onClick={() => showToast('+ Applying for course…')} style={{ padding:'7px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', marginLeft:'auto', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>+ Apply for Course</button>
          </div>

          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                  {['Course','Type','Instructor','Dates','Closes','Booked','Status',''].map(h=>(
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((c, i) => {
                  const tc = TYPE_COLORS[c.type];
                  return (
                    <tr key={c.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                      <td style={{ padding:'11px 12px', fontWeight:700 }}>{c.title}</td>
                      <td style={{ padding:'11px 12px' }}><Pill bg={tc.bg} color={tc.color}>{tc.label}</Pill></td>
                      <td style={{ padding:'11px 12px', fontSize:12, color:muted }}>{c.ic}</td>
                      <td style={{ padding:'11px 12px', fontSize:12, whiteSpace:'nowrap' }}>{c.start}{c.start!==c.end?` – ${c.end}`:''}</td>
                      <td style={{ padding:'11px 12px', fontSize:12, color:muted, whiteSpace:'nowrap' }}>{c.closes}</td>
                      <td style={{ padding:'11px 12px', fontWeight:700, color: c.booked>0?'#1B6B3A':muted }}>{c.booked}</td>
                      <td style={{ padding:'11px 12px' }}>
                        <Pill bg={c.status==='open'?'#D4EDDA':'#E8E8F0'} color={c.status==='open'?'#0F4020':'#555'}>{c.status==='open'?'Open':'Closed'}</Pill>
                      </td>
                      <td style={{ padding:'11px 12px', whiteSpace:'nowrap' }}>
                        <button onClick={() => showToast(`👁 Opening ${c.title} report pack…`)} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer', marginRight:4 }}>📄 Pack</button>
                        <button onClick={() => showToast(`📲 Opening QR check-in for ${c.title}…`)} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer' }}>📲 QR</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize:11, color:muted, marginTop:10 }}>
            Click 📄 Pack to build a course report (Admin Order, Risk Assessments, TG21/TG23). Click 📲 QR to open a check-in session. Data synced from Bader SMS.
          </div>
        </>
      )}
    </div>
  );
}
