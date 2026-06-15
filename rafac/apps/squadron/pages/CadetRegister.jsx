import { useState } from 'react';
import { CADETS, RANK_COLOR } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const PROFILE_EXTRA = {
  c01: { parent:'Mrs K. Mitchell', contact:'07700 900123', dofe:'Gold — In Progress', shooting:'1st Class', aef:'2 AEF · 3 GIF · Blue Wings', attHistory:[100,75,100,90,85,100], forms:'1/2 complete', kit:3 },
  c02: { parent:'Mr G. Thomas',   contact:'07700 900124', dofe:'Silver — In Progress', shooting:'Marksman',   aef:'2 AEF · 1 GIF · GS holder', attHistory:[100,100,100,96,100,100], forms:'2/2 complete', kit:4 },
  c03: { parent:'Mr S. Ahmed',    contact:'07700 900125', dofe:'Bronze — Complete',   shooting:'2nd Class',  aef:'1 AEF · 1 GIF',              attHistory:[88,80,90,88,90,85],  forms:'2/2 complete', kit:2 },
  c04: { parent:'Ms L. Harper',   contact:'07700 900126', dofe:'Not enrolled',         shooting:'Unclassified',aef:'No flights',                attHistory:[70,74,74,70,80,74],  forms:'0/0 complete', kit:1 },
  c05: { parent:'Mr T. Khan',     contact:'07700 900127', dofe:'Bronze — In Progress', shooting:'3rd Class',  aef:'1 AEF · GIF pending',        attHistory:[80,88,85,78,82,80],  forms:'0/0 complete', kit:1 },
  c06: { parent:'Ms A. Mason',    contact:'07700 900128', dofe:'Not enrolled',         shooting:'Unclassified',aef:'No flights',                attHistory:[70,65,70,63,72,70],  forms:'0/0 complete', kit:0 },
  c07: { parent:'Mr D. Wright',   contact:'07700 900129', dofe:'Bronze — In Progress', shooting:'3rd Class',  aef:'No flights',                attHistory:[85,82,88,80,90,85],  forms:'0/0 complete', kit:2 },
  c08: { parent:'Mrs S. Patel',   contact:'07700 900130', dofe:'Not enrolled',         shooting:'Unclassified',aef:'1 AEF',                     attHistory:[77,80,75,78,80,77],  forms:'0/0 complete', kit:1 },
  c09: { parent:'Mr B. Cooper',   contact:'07700 900131', dofe:'Not enrolled',         shooting:'Unclassified',aef:'No flights',                attHistory:[60,65,63,60,66,63],  forms:'0/0 complete', kit:1 },
};

const ISSUE_STYLE = {
  'Consent pending':   { bg:'#FFF3CC', color:'#7A4A00' },
  'Profile incomplete':{ bg:'#F8D7DA', color:'#8B1A1A' },
  'Medical missing':   { bg:'#F8D7DA', color:'#8B1A1A' },
  'NOK unverified':    { bg:'#FFF3CC', color:'#7A4A00' },
  'No GP details':     { bg:'#F8D7DA', color:'#8B1A1A' },
  'Photo missing':     { bg:'#E8E8F0', color:'#3A3A5A' },
  'School outdated':   { bg:'#E8E8F0', color:'#3A3A5A' },
};

export default function CadetRegister({ showToast, addAudit }) {
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  function printFullRegister() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const rows = CADETS.map((c,i) => {
      const extra = PROFILE_EXTRA[c.id] || {};
      const iss = c.issue ? c.issue : null;
      return `<tr style="background:${i%2?'#FAFCFE':'white'};${iss?'border-left:3px solid #D97706;':''}">
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;"><span style="background:${RANK_COLOR[c.rank]||'#5A7090'};color:white;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:700;">${c.rank}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;">${c.sn}, ${c.fn}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-family:monospace;font-size:10px;color:#5A7090;">${c.svc}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;">${c.age}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="font-weight:700;color:${c.att>=90?'#1B6B3A':c.att>=75?'#7A4A00':'#8B1A1A'};">${c.att}%</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;"><span style="background:#EAF4FF;color:#003D80;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:700;">${c.pts}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;font-size:12px;">${c.swim?'✅':'❌'}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;">${extra.dofe||'—'}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:${iss?'#92400E':'#065F46'};font-weight:${iss?700:400};">${iss||'All current'}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Cadet Register — 1701 Sqn</title>
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
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">CADET REGISTER — BADER SMS EXTRACT</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">As at ${today} · Total: ${CADETS.length} cadets</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">With action items: ${CADETS.filter(c=>c.issue).length}</div>
          <div style="font-size:10px;color:#5A7090;">Swim-passed: ${CADETS.filter(c=>c.swim).length}/${CADETS.length}</div>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">RANK</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">NAME</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SVC NO.</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">AGE</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">ATT %</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">PTS CLASS</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SWIM</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DOFE</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">STATUS</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:28px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      ${['Commanding Officer','Wing Commander Cadets','Date'].map((l,i) => `
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${l}</div>
          <div style="font-size:11px;color:#00264D;margin-top:2px;">${i===0?'Sqn Ldr Harris':i===2?today:''}&nbsp;</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:12px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — GDPR DPA 2018 · Personal data — authorised staff only · Retain to age 25 of youngest cadet or 3 years post-departure (AP 1919 / Bader)
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Cadet Register printed', 'CadetRegister', `Printed by Sqn Ldr Harris on ${today}`);
    showToast('🖨️ Cadet register sent to printer');
  }

  const filtered = CADETS.filter(c => {
    const q = search.toLowerCase();
    const matchName = (c.fn+' '+c.sn).toLowerCase().includes(q) || c.svc.includes(q);
    const matchRank = rankFilter === 'All' || c.rank === rankFilter;
    return matchName && matchRank;
  });

  const Card = selected ? CADETS.find(c => c.id === selected) : null;

  function printProfile(c, extra) {
    const dateStr = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const attBars = extra?.attHistory ? ['J','F','M','A','M','J'].map((m,i) => {
      const pct = extra.attHistory[i];
      const col = pct>=90?'#1B6B3A':pct>=75?'#C8A032':'#C8102E';
      return `<div style="text-align:center;flex:1"><div style="height:${Math.round((pct/100)*40)}px;min-height:4px;border-radius:2px;background:${col};margin-bottom:2px"></div><div style="font-size:9px;color:#5A7090">${m}</div></div>`;
    }).join('') : '';
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
      <title>Cadet Profile — ${c.rank} ${c.sn}, ${c.fn}</title>
      <style>@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:Barlow,sans-serif;color:#0D1B2E;background:white;padding:28px 36px;font-size:12px}
      .hdr{background:#00264D;color:white;padding:18px 24px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
      .t{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800}.sub{font-size:10px;opacity:0.5;letter-spacing:0.08em;margin-top:2px}
      .sec{margin-bottom:18px}.sec-title{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#00264D;text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid #00264D;padding-bottom:3px;margin-bottom:10px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.box{border:1.5px solid #D0DCF0;border-radius:7px;padding:10px 12px}
      .lbl{font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px}.val{font-size:13px;font-weight:700}
      .row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #D0DCF0;font-size:12px}.muted{color:#5A7090}
      .pill{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700}
      .roundel{width:48px;height:48px;border-radius:50%;background:conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,#c8102e 240deg 360deg);border:2px solid #C8A032;flex-shrink:0}
      @media print{body{padding:16px 20px}.hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head>
      <body>
      <div class="hdr">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="roundel"></div>
          <div><div class="t">${c.rank.toUpperCase()} ${c.sn.toUpperCase()}, ${c.fn.toUpperCase()}</div>
          <div class="sub">CADET PROFILE · 1701 (JOHNSTONE) SQUADRON · SVC NO. ${c.svc}</div></div>
        </div>
        <div style="text-align:right;font-size:11px;opacity:0.65">Generated: ${dateStr}<br>Classification: OFFICIAL</div>
      </div>

      <div class="grid" style="margin-bottom:18px">
        <div class="box"><div class="lbl">Rank</div><div class="val">${c.rank}</div></div>
        <div class="box"><div class="lbl">Service No.</div><div class="val" style="font-family:monospace">${c.svc}</div></div>
        <div class="box"><div class="lbl">Age</div><div class="val">${c.age}</div></div>
        <div class="box"><div class="lbl">PTS Classification</div><div class="val">${c.pts}</div></div>
        <div class="box"><div class="lbl">Attendance (this term)</div><div class="val" style="color:${c.att>=90?'#1B6B3A':c.att>=75?'#C8A032':'#C8102E'}">${c.att}%</div></div>
        <div class="box"><div class="lbl">Swimming test</div><div class="val">${c.swim?'Passed ✅':'Not passed ❌'}</div></div>
      </div>

      ${attBars ? `<div class="sec"><div class="sec-title">Attendance trend (Jan–Jun 2026)</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:50px">${attBars}</div></div>` : ''}

      <div class="sec"><div class="sec-title">Qualifications & Activities</div>
        ${[['DofE',extra?.dofe||'—'],['Shooting',extra?.shooting||'—'],['AEF & Flying',extra?.aef||'—'],['Forms/Consents',extra?.forms||'—'],['Kit items held',extra?.kit!==undefined?`${extra.kit} items`:'—']].map(([l,v])=>`<div class="row"><span class="muted">${l}</span><strong>${v}</strong></div>`).join('')}
      </div>

      <div class="sec"><div class="sec-title">Next of Kin</div>
        ${extra?.parent ? `<div class="row"><span class="muted">Parent/Guardian</span><strong>${extra.parent}</strong></div>
        <div class="row"><span class="muted">Contact number</span><strong>${extra.contact}</strong></div>` : '<div class="row"><span class="muted">NOK details</span><strong>— see profile for details</strong></div>'}
      </div>

      ${c.issue ? `<div style="background:#FFF3CC;border:1px solid #F0C84A;border-radius:7px;padding:10px 14px;margin-bottom:18px;font-size:12px;color:#7A4A00;font-weight:600">⚠️ Pending action: ${c.issue}</div>` : ''}

      <div style="border-top:1px solid #D0DCF0;margin-top:20px;padding-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
        <div style="border-top:1px solid #0D1B2E;padding-top:6px;margin-top:40px;font-size:11px;color:#5A7090">OC Signature · Sqn Ldr J. Harris</div>
        <div style="border-top:1px solid #0D1B2E;padding-top:6px;margin-top:40px;font-size:11px;color:#5A7090">Date</div>
      </div>
      <div style="margin-top:16px;font-size:9px;color:#9AACBF;border-top:1px solid #D0DCF0;padding-top:8px">
        OFFICIAL · GDPR DPA 2018 applies · 1701 (Johnstone) Squadron · West Scotland Wing · RAFAC
      </div></body></html>`;
    const w = window.open('', '_blank', 'width=800,height=650');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
    showToast(`📄 Profile printed: ${c.rank} ${c.sn}, ${c.fn}`);
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap:16 }}>
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Cadet Register</div>
            <div style={{ fontSize:12, color:muted }}>{filtered.length} of {CADETS.length} cadets</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or svc no…"
              style={{ padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', width:200 }} />
            <select value={rankFilter} onChange={e => setRankFilter(e.target.value)}
              style={{ padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }}>
              {['All','Cdt','LCdt','Cpl','Sgt','FS','WO'].map(r => <option key={r}>{r}</option>)}
            </select>
            <button onClick={printFullRegister} style={{ padding:'8px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>📄 Print Register</button>
          </div>
        </div>

        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                {['Rank','Name','Svc No.','Age','Att %','PTS Class','Status',''].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isSelected = selected === c.id;
                const iss = c.issue ? ISSUE_STYLE[c.issue] || { bg:'#F0F0F0', color:'#555' } : null;
                return (
                  <tr key={c.id} onClick={() => setSelected(isSelected ? null : c.id)}
                    style={{ borderBottom:`1px solid ${border}`, background: isSelected ? '#EAF4FF' : i%2 ? '#fafcfe' : 'white', cursor:'pointer', transition:'background 0.1s' }}>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ background: RANK_COLOR[c.rank] || '#5A7090', color:'white', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:700 }}>{c.rank}</span>
                    </td>
                    <td style={{ padding:'11px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0 }}>{c.ini}</div>
                        <div>
                          <div style={{ fontWeight:700 }}>{c.sn}, {c.fn}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'11px 14px', fontFamily:'monospace', color:muted, fontSize:12 }}>{c.svc}</td>
                    <td style={{ padding:'11px 14px' }}>{c.age}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ fontWeight:700, color: c.att >= 90 ? '#1B6B3A' : c.att >= 75 ? '#7A4A00' : '#8B1A1A' }}>{c.att}%</span>
                    </td>
                    <td style={{ padding:'11px 14px', fontSize:12 }}>{c.pts}</td>
                    <td style={{ padding:'11px 14px' }}>
                      {iss
                        ? <span style={{ background:iss.bg, color:iss.color, padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700 }}>{c.issue}</span>
                        : <span style={{ background:'#D4EDDA', color:'#0F4020', padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700 }}>All current</span>}
                    </td>
                    <td style={{ padding:'11px 14px' }}>
                      <button onClick={e => { e.stopPropagation(); showToast(`📋 Opening profile: ${c.rank} ${c.sn}, ${c.fn}`); }}
                        style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer', fontWeight:600 }}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {Card && (() => {
        const extra = PROFILE_EXTRA[Card.id] || {};
        return (
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:20, alignSelf:'flex-start', position:'sticky', top:0, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, fontSize:16 }}>Cadet Profile</div>
              <button onClick={() => setSelected(null)} style={{ border:'none', background:'none', fontSize:18, cursor:'pointer', color:muted }}>×</button>
            </div>

            {/* Identity */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${border}` }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, flexShrink:0 }}>{Card.ini}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:'#0D1B2E' }}>{Card.sn}, {Card.fn}</div>
                <div style={{ fontSize:12, color:muted }}>{Card.rank} · Svc {Card.svc} · Age {Card.age}</div>
                {extra.parent && <div style={{ fontSize:11, color:muted, marginTop:2 }}>👤 {extra.parent} · {extra.contact}</div>}
              </div>
            </div>

            {/* Attendance sparkline */}
            {extra.attHistory && (
              <div style={{ marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${border}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:muted, textTransform:'uppercase', letterSpacing:'0.05em' }}>Attendance</div>
                  <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:Card.att>=90?'#1B6B3A':Card.att>=75?'#7A4A00':'#8B1A1A' }}>{Card.att}%</span>
                </div>
                <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:28 }}>
                  {['J','F','M','A','M','J'].map((m,i) => (
                    <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                      <div style={{ width:'100%', height:`${(extra.attHistory[i]/100)*22}px`, borderRadius:2, minHeight:3,
                        background:extra.attHistory[i]>=90?'#1B6B3A':extra.attHistory[i]>=75?gold:'#C8102E' }} />
                      <div style={{ fontSize:8, color:muted }}>{m}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key stats */}
            {[
              ['PTS Class', Card.pts],
              ['Badges', Card.badges],
              ['Swimming', Card.swim ? '✅ Passed' : '❌ Not passed'],
              ['DofE', extra.dofe || '—'],
              ['Shooting', extra.shooting || '—'],
              ['AEF/Flying', extra.aef || '—'],
              ['Forms', extra.forms || '—'],
              ['Kit items', extra.kit !== undefined ? `${extra.kit} items` : '—'],
            ].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${border}`, fontSize:12 }}>
                <span style={{ color:muted }}>{l}</span>
                <span style={{ fontWeight:700, color:'#0D1B2E', textAlign:'right', maxWidth:160 }}>{v}</span>
              </div>
            ))}

            {/* Issue alert */}
            {Card.issue && (
              <div style={{ marginTop:12, background:'#FFF3CC', border:'1px solid #F0C84A', borderRadius:8, padding:'10px 12px', fontSize:12, color:'#7A4A00', fontWeight:600 }}>
                ⚠️ {Card.issue}
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:14 }}>
              {['Edit profile','Send message','View forms','Promote'].map(a => (
                <button key={a} onClick={() => showToast(`▶ ${a}: ${Card.rank} ${Card.sn}`)}
                  style={{ padding:'8px 10px', background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>{a}</button>
              ))}
            </div>
            <button onClick={() => { const extra = PROFILE_EXTRA[Card.id]||{}; printProfile(Card, extra); }}
              style={{ width:'100%', marginTop:8, padding:'9px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              📄 Print Cadet Profile
            </button>
          </div>
        );
      })()}
    </div>
  );
}
