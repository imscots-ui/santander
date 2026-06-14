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

export default function KitStores({ showToast }) {
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
          <button onClick={() => showToast('📦 Stock report exported')} style={{ padding:'8px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📦 Stock report</button>
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
              <button onClick={() => { awaitingReturn.forEach(k => chaseReturn(k)); }}
                style={{ padding:'6px 14px', background:'#7A4A00', color:'white', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                📧 Chase all
              </button>
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
