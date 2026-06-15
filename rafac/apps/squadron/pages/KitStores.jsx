import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const INITIAL_KIT = [
  { id:'k1', item:'Wedgewood No.2 jacket', to:'c01', toName:'Cpl Mitchell, S.',   date:'14 Sep 2025', size:'170/96',  status:'Held' },
  { id:'k2', item:'Brassard + badges',      to:'c01', toName:'Cpl Mitchell, S.',   date:'14 Sep 2025', size:'—',       status:'Held' },
  { id:'k3', item:'MTP coverall',           to:'c02', toName:'Sgt Thomas, M.',     date:'2 Mar 2025',  size:'180/100', status:'Held' },
  { id:'k4', item:'Beret (blue)',           to:'c03', toName:'LCpl Ahmed, R.',     date:'8 Jan 2026',  size:'58cm',    status:'Held' },
  { id:'k5', item:'Waterproof jacket',      to:'c04', toName:'Cdt Harper, J.',     date:'21 Feb 2026', size:'M',       status:'Held' },
  { id:'k6', item:'Wedgewood No.2 jacket', to:'c09', toName:'Cdt Cooper, O.',    date:'—',           size:'164/88',  status:'Awaiting return' },
  { id:'k7', item:'Boots (patrol)',         to:'c06', toName:'Cdt Mason, D.',      date:'—',           size:'8',       status:'Awaiting return' },
];

const STOCK = [
  { item:'Wedgewood No.2 jacket', total:12, issued:4, sizes:['164/88','170/96','176/100','180/100'] },
  { item:'MTP coverall',          total:8,  issued:2, sizes:['S','M','L','XL'] },
  { item:'Beret (blue)',          total:15, issued:3, sizes:['57cm','58cm','59cm','60cm'] },
  { item:'Waterproof jacket',     total:6,  issued:2, sizes:['XS','S','M','L'] },
  { item:'Boots (patrol)',        total:4,  issued:2, sizes:['6','7','8','9','10'] },
  { item:'Brassard + badges',     total:20, issued:5, sizes:['—'] },
  { item:'Stable belt',           total:3,  issued:0, sizes:['—'] },
];

const CADETS_LIST = [
  { id:'c01', label:'Cpl Mitchell, S.' },
  { id:'c02', label:'Sgt Thomas, M.' },
  { id:'c03', label:'LCpl Ahmed, R.' },
  { id:'c04', label:'Cdt Harper, J.' },
  { id:'c05', label:'Cdt Khan, A.' },
  { id:'c06', label:'Cdt Mason, D.' },
  { id:'c07', label:'Cdt Wright, L.' },
  { id:'c08', label:'Cdt Patel, E.' },
  { id:'c09', label:'Cdt Cooper, O.' },
];

export default function KitStores({ showToast, addAudit }) {
  const [kit, setKit]             = useState(INITIAL_KIT);
  const [tab, setTab]             = useState('issued');   // issued | stock | issue
  const [issueForm, setIssueForm] = useState({ cadetId:'c01', item:'', size:'', date: new Date().toLocaleDateString('en-GB') });
  const [search, setSearch]       = useState('');

  const issued          = kit.filter(k => k.status === 'Held');
  const awaitingReturn  = kit.filter(k => k.status === 'Awaiting return');
  const lowStock        = STOCK.filter(s => s.total - s.issued <= 2).length;
  const cadetsKitted    = new Set(kit.map(k => k.to)).size;

  function markReturned(id) {
    setKit(prev => prev.filter(k => k.id !== id));
    showToast('↩ Kit marked returned — stock updated');
  }

  function chaseReturn(k) {
    showToast(`📧 Return reminder sent to ${k.toName}`);
  }

  function issueKit() {
    if (!issueForm.item.trim()) { showToast('Select an item to issue', 'warn'); return; }
    const cadet = CADETS_LIST.find(c => c.id === issueForm.cadetId);
    const newItem = {
      id: 'k-' + Date.now(),
      item: issueForm.item,
      to: issueForm.cadetId,
      toName: cadet?.label || '—',
      date: issueForm.date,
      size: issueForm.size || '—',
      status: 'Held',
    };
    setKit(prev => [newItem, ...prev]);
    showToast(`🎒 ${issueForm.item} issued to ${cadet?.label}`);
    setIssueForm(f => ({ ...f, item:'', size:'' }));
    setTab('issued');
  }

  function printReturnRequests() {
    const byGender = {};
    awaitingReturn.forEach(k => {
      if (!byGender[k.toName]) byGender[k.toName] = [];
      byGender[k.toName].push(k);
    });
    if (Object.keys(byGender).length === 0) { showToast('No items awaiting return'); return; }
    const dateStr = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const letters = Object.entries(byGender).map(([cadetName, items]) => {
      const itemList = items.map(i =>
        `<li style="margin:6px 0">${i.item} (Size: ${i.size}) — originally issued ${i.date}</li>`
      ).join('');
      return `
        <div style="page-break-after:always;padding:40px 48px;font-family:Barlow,sans-serif;max-width:680px;margin:0 auto">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px">
            <div>
              <div style="font-family:Barlow Condensed,sans-serif;font-size:22px;font-weight:800;color:#00264D">1701 (JOHNSTONE) SQUADRON</div>
              <div style="font-size:11px;color:#5A7090;letter-spacing:0.08em;margin-top:2px">ROYAL AIR FORCE AIR CADETS · WEST SCOTLAND WING</div>
            </div>
            <div style="text-align:right;font-size:11px;color:#5A7090">${dateStr}</div>
          </div>
          <div style="border-top:3px solid #00264D;padding-top:20px;margin-bottom:24px">
            <div style="font-size:14px;font-weight:700;color:#0D1B2E">To the parent/guardian of: ${cadetName}</div>
          </div>
          <p style="font-size:13px;line-height:1.7;color:#0D1B2E;margin-bottom:16px">
            Dear Parent / Guardian,
          </p>
          <p style="font-size:13px;line-height:1.7;color:#0D1B2E;margin-bottom:16px">
            Our records show that the following items of RAFAC-owned uniform or equipment are currently held
            by <strong>${cadetName}</strong> and are marked as pending return on our kit management system.
          </p>
          <div style="background:#F4F7FB;border:1px solid #D0DCF0;border-radius:8px;padding:16px 20px;margin:20px 0">
            <div style="font-size:12px;font-weight:700;color:#00264D;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em">Items to be returned</div>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#0D1B2E">${itemList}</ul>
          </div>
          <p style="font-size:13px;line-height:1.7;color:#0D1B2E;margin-bottom:16px">
            Please arrange to return all items listed above to the squadron stores
            <strong>by the next parade night</strong> (or contact us to arrange a convenient time).
            Items should be in clean, serviceable condition.
          </p>
          <p style="font-size:13px;line-height:1.7;color:#0D1B2E;margin-bottom:32px">
            If you believe any item has already been returned, or if there are exceptional circumstances,
            please contact the Squadron Admin Officer at the details below.
          </p>
          <div style="border-top:1px solid #D0DCF0;padding-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
            <div>
              <div style="font-size:12px;font-weight:700;color:#00264D;margin-bottom:8px">OC 1701 Squadron</div>
              <div style="border-top:1px solid #0D1B2E;padding-top:6px;margin-top:40px;font-size:11px;color:#5A7090">Sqn Ldr J. Harris</div>
            </div>
            <div style="font-size:11px;color:#5A7090;line-height:1.8">
              📍 Johnstone Community Centre<br>
              📞 01505 123456<br>
              ✉ 1701sqn@aircadets.org<br>
              Parade: Thursdays 1900–2200
            </div>
          </div>
          <div style="margin-top:20px;font-size:9px;color:#9AACBF;border-top:1px solid #D0DCF0;padding-top:10px">
            OFFICIAL · This letter contains details about a RAFAC cadet. It must only be shared with the cadet and their parent/guardian. GDPR DPA 2018 applies.
          </div>
        </div>`;
    }).join('');
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Kit Return Requests — 1701 Sqn</title>
      <style>@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');*{box-sizing:border-box}body{margin:0;background:white}@media print{body{margin:0}}</style>
      </head><body>${letters}</body></html>`;
    const w = window.open('', '_blank', 'width=800,height=700');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
    showToast(`📄 ${Object.keys(byGender).length} return request letter${Object.keys(byGender).length > 1 ? 's' : ''} opened`);
  }

  function printKitLedger() {
    const dateStr = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const allRows = kit.map(k => {
      const held = k.status === 'Held';
      return `<tr>
        <td style="padding:8px 12px;font-weight:700;color:#0D1B2E">${k.item}</td>
        <td style="padding:8px 12px">${k.toName}</td>
        <td style="padding:8px 12px;color:#5A7090;font-size:11px">${k.date}</td>
        <td style="padding:8px 12px;font-family:monospace;font-size:11px">${k.size}</td>
        <td style="padding:8px 12px"><span style="background:${held?'#D4EDDA':'#FFF3CC'};color:${held?'#0F4020':'#7A4A00'};padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700">${k.status}</span></td>
      </tr>`;
    }).join('');
    const stockRows = STOCK.map(s => {
      const inStores = s.total - s.issued;
      const low = inStores <= 2;
      return `<tr>
        <td style="padding:8px 12px;font-weight:700;color:#0D1B2E">${s.item}</td>
        <td style="padding:8px 12px;text-align:center">${s.total}</td>
        <td style="padding:8px 12px;text-align:center;color:#5A7090">${s.issued}</td>
        <td style="padding:8px 12px;text-align:center;font-weight:800;color:${low?'#8B1A1A':'#1B6B3A'}">${inStores}${low?' ⚠':''}${low?'<span style="margin-left:4px;background:#F8D7DA;color:#8B1A1A;padding:1px 5px;border-radius:5px;font-size:9px;font-weight:700">LOW</span>':''}</td>
        <td style="padding:8px 12px;font-size:11px;color:#5A7090">${s.sizes.join(', ')}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Kit Ledger — 1701 Sqn</title>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box}body{margin:0;background:white;font-family:Barlow,sans-serif}@page{size:A4 landscape;margin:14mm 16mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
      </head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:14px">
          <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg>
          <div>
            <div style="font-family:Barlow Condensed,sans-serif;font-size:22px;font-weight:800;color:#00264D">KIT STORES LEDGER</div>
            <div style="font-size:11px;color:#5A7090;letter-spacing:0.07em">1701 (JOHNSTONE) SQUADRON · ROYAL AIR FORCE AIR CADETS · WEST SCOTLAND WING</div>
          </div>
        </div>
        <div style="text-align:right;font-size:11px;color:#5A7090;line-height:1.7">
          <strong style="color:#0D1B2E">Printed:</strong> ${dateStr}<br>
          <strong style="color:#0D1B2E">Total items issued:</strong> ${kit.length}<br>
          <strong style="color:#0D1B2E">Awaiting return:</strong> ${awaitingReturn.length}
        </div>
      </div>
      <div style="border-top:3px solid #00264D;margin-bottom:16px"></div>

      <div style="font-family:Barlow Condensed,sans-serif;font-size:14px;font-weight:800;color:#00264D;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">▸ Issued Items Register</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px">
        <thead>
          <tr style="background:#F4F7FB">
            ${['Item','Issued to','Date issued','Size','Status'].map(h=>`<th style="padding:8px 12px;text-align:left;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #D0DCF0">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${allRows}</tbody>
      </table>

      <div style="font-family:Barlow Condensed,sans-serif;font-size:14px;font-weight:800;color:#00264D;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">▸ Stock Levels Summary</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px">
        <thead>
          <tr style="background:#F4F7FB">
            ${['Uniform item','Total stock','Issued','In stores','Available sizes'].map(h=>`<th style="padding:8px 12px;text-align:left;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #D0DCF0">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${stockRows}</tbody>
      </table>

      <div style="border-top:1.5px solid #00264D;padding-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;margin-bottom:12px">
        ${[['OC 1701 Squadron','Sqn Ldr J. Harris'],['Admin Officer','Admin Off T. Murray'],['Date checked','']].map(([role,name])=>`
          <div>
            <div style="font-size:11px;font-weight:700;color:#00264D;margin-bottom:4px">${role}</div>
            <div style="border-top:1px solid #0D1B2E;padding-top:5px;margin-top:36px;font-size:10px;color:#5A7090">${name}</div>
          </div>`).join('')}
      </div>
      <div style="font-size:9px;color:#9AACBF;border-top:1px solid #D0DCF0;padding-top:8px">
        OFFICIAL · Kit records retained 3 years post-issue in accordance with AP 1919 stores management policy. DPA 2018 applies to all cadet personal data contained herein.
      </div>
      </body></html>`;
    const w = window.open('', '_blank', 'width=1050,height=750');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
    addAudit?.('Kit ledger printed', 'Kit', `${kit.length} items`);
    showToast('📄 Kit ledger opened for print');
  }

  function exportKitCSV() {
    const header = 'Item,Issued To,Date Issued,Size,Status\n';
    const rows = kit.map(k => [k.item, k.toName, k.date, k.size, k.status].map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '1701-kit-register.csv';
    a.click();
    URL.revokeObjectURL(url);
    addAudit?.('Kit register exported to CSV', 'Kit', `${kit.length} items`);
    showToast('📊 Kit register CSV downloaded');
  }

  const filtered = kit.filter(k =>
    !search || k.item.toLowerCase().includes(search.toLowerCase()) || k.toName.toLowerCase().includes(search.toLowerCase())
  );

  const Pill = ({ status }) => status === 'Held'
    ? <span style={{ background:'#D4EDDA', color:'#0F4020', padding:'2px 9px', borderRadius:10, fontSize:10, fontWeight:700 }}>Held</span>
    : <span style={{ background:'#FFF3CC', color:'#7A4A00', padding:'2px 9px', borderRadius:10, fontSize:10, fontWeight:700 }}>Awaiting return</span>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Kit & Stores</div>
          <div style={{ fontSize:12, color:muted }}>Uniform & equipment issued per cadet · returns tracked automatically</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setTab('issue')} style={{ padding:'8px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>+ Issue Kit</button>
          <button onClick={exportKitCSV} style={{ padding:'8px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📊 Export CSV</button>
          <button onClick={printKitLedger} style={{ padding:'8px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📄 Print Ledger</button>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background:'#EAF4FF', border:'1px solid #B3D4F0', borderRadius:8, padding:'10px 14px', marginBottom:18, display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:'#003D80' }}>
        <span style={{ fontSize:18 }}>🎒</span>
        <div>Tracks what uniform and equipment each cadet holds, so kit is not lost and returns are chased automatically when a cadet leaves — a genuinely paper-heavy job at most squadrons.</div>
      </div>

      {/* KPI tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
        {[
          { label:'Items issued',      value:kit.length,          color:navy },
          { label:'Awaiting return',   value:awaitingReturn.length, color:'#7A4A00' },
          { label:'Low stock lines',   value:lowStock,             color:'#8B1A1A' },
          { label:'Cadets kitted',     value:cadetsKitted,         color:'#1B6B3A' },
        ].map(t => (
          <div key={t.label} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{t.label}</div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.color }}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:16, borderBottom:`2px solid ${border}` }}>
        {[['issued','Issued Items'],['stock','Stock Levels'],['issue','Issue Kit']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:'9px 20px', border:'none', background:'none', cursor:'pointer', fontFamily:'Barlow,sans-serif', fontSize:13, fontWeight: tab===id ? 800 : 500, color: tab===id ? navy : muted, borderBottom: tab===id ? `3px solid ${navy}` : '3px solid transparent', marginBottom:-2 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Issued items tab */}
      {tab === 'issued' && (
        <>
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search item or cadet…"
              style={{ padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', width:240 }} />
          </div>
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                  {['Item','Issued to','Date issued','Size','Status','Action'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:24, textAlign:'center', color:muted }}>No items match</td></tr>
                )}
                {filtered.map((k, i) => (
                  <tr key={k.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                    <td style={{ padding:'11px 14px', fontWeight:700 }}>{k.item}</td>
                    <td style={{ padding:'11px 14px' }}>{k.toName}</td>
                    <td style={{ padding:'11px 14px', color:muted, fontSize:12 }}>{k.date}</td>
                    <td style={{ padding:'11px 14px', fontFamily:'monospace', fontSize:12 }}>{k.size}</td>
                    <td style={{ padding:'11px 14px' }}><Pill status={k.status} /></td>
                    <td style={{ padding:'11px 14px' }}>
                      {k.status === 'Held'
                        ? <button onClick={() => markReturned(k.id)} style={{ padding:'4px 12px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, fontWeight:700, background:'white', cursor:'pointer' }}>↩ Mark returned</button>
                        : <button onClick={() => chaseReturn(k)} style={{ padding:'4px 12px', background:'#FFF3CC', color:'#7A4A00', border:'1px solid #F0C84A', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>📧 Chase</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {awaitingReturn.length > 0 && (
            <div style={{ marginTop:14, background:'#FFF8E6', border:'1.5px solid #F0C84A', borderRadius:8, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:13, color:'#7A4A00', fontWeight:600 }}>⏰ {awaitingReturn.length} item{awaitingReturn.length>1?'s':''} awaiting return</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={printReturnRequests}
                  style={{ padding:'6px 14px', background:'white', color:'#7A4A00', border:'1.5px solid #F0C84A', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  📄 Print return letters
                </button>
                <button onClick={() => { awaitingReturn.forEach(k => chaseReturn(k)); }}
                  style={{ padding:'6px 14px', background:'#7A4A00', color:'white', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  📧 Chase all
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Stock levels tab */}
      {tab === 'stock' && (
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
                {['Uniform item','Total stock','Issued','In stores','Available sizes',''].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STOCK.map((s, i) => {
                const inStores = s.total - s.issued;
                const low = inStores <= 2;
                return (
                  <tr key={s.item} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                    <td style={{ padding:'11px 14px', fontWeight:700 }}>{s.item}</td>
                    <td style={{ padding:'11px 14px' }}>{s.total}</td>
                    <td style={{ padding:'11px 14px', color:muted }}>{s.issued}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ fontWeight:800, color: low ? '#8B1A1A' : '#1B6B3A' }}>{inStores}</span>
                      {low && <span style={{ marginLeft:6, background:'#F8D7DA', color:'#8B1A1A', padding:'1px 6px', borderRadius:6, fontSize:9, fontWeight:700 }}>LOW</span>}
                    </td>
                    <td style={{ padding:'11px 14px', fontSize:11, color:muted }}>{s.sizes.join(', ')}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <button onClick={() => showToast(`📦 Ordering more: ${s.item}`)} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer' }}>Order more</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue kit tab */}
      {tab === 'issue' && (
        <div style={{ maxWidth:520 }}>
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:24 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, fontSize:16, marginBottom:18 }}>Issue Uniform / Equipment</div>

            {[
              { label:'Cadet *', field: (
                <select value={issueForm.cadetId} onChange={e => setIssueForm(f=>({...f,cadetId:e.target.value}))}
                  style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }}>
                  {CADETS_LIST.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              )},
              { label:'Item *', field: (
                <select value={issueForm.item} onChange={e => setIssueForm(f=>({...f,item:e.target.value}))}
                  style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }}>
                  <option value="">— select item —</option>
                  {STOCK.map(s => <option key={s.item} value={s.item}>{s.item} ({s.total - s.issued} in stores)</option>)}
                  <option value="Other (specify in notes)">Other (specify in notes)</option>
                </select>
              )},
              { label:'Size', field: (
                <input value={issueForm.size} onChange={e => setIssueForm(f=>({...f,size:e.target.value}))} placeholder="e.g. 170/96, 58cm, M"
                  style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }} />
              )},
              { label:'Date issued', field: (
                <input type="text" value={issueForm.date} onChange={e => setIssueForm(f=>({...f,date:e.target.value}))}
                  style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }} />
              )},
            ].map(({ label, field }) => (
              <div key={label} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:navy, display:'block', marginBottom:5 }}>{label}</label>
                {field}
              </div>
            ))}

            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setTab('issued')} style={{ flex:1, padding:'10px', background:'white', border:`1.5px solid ${border}`, borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Cancel</button>
              <button onClick={issueKit} style={{ flex:2, padding:'10px', background:gold, color:'#00264D', border:'none', borderRadius:8, fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>Issue Kit</button>
            </div>
          </div>

          <div style={{ marginTop:14, fontSize:11, color:muted, lineHeight:1.6 }}>
            Issued items are recorded against the cadet's profile and must be returned on leaving the squadron. Return reminders are sent automatically after 90 days for items marked "Awaiting return".
          </div>
        </div>
      )}
    </div>
  );
}
