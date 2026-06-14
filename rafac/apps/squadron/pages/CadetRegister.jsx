import { useState } from 'react';
import { CADETS, RANK_COLOR } from '../../../data/cadets.js';

const navy = '#00264D', muted = '#5A7090', border = '#D0DCF0';

const ISSUE_STYLE = {
  'Consent pending':   { bg:'#FFF3CC', color:'#7A4A00' },
  'Profile incomplete':{ bg:'#F8D7DA', color:'#8B1A1A' },
  'Medical missing':   { bg:'#F8D7DA', color:'#8B1A1A' },
  'NOK unverified':    { bg:'#FFF3CC', color:'#7A4A00' },
  'No GP details':     { bg:'#F8D7DA', color:'#8B1A1A' },
  'Photo missing':     { bg:'#E8E8F0', color:'#3A3A5A' },
  'School outdated':   { bg:'#E8E8F0', color:'#3A3A5A' },
};

export default function CadetRegister({ showToast }) {
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = CADETS.filter(c => {
    const q = search.toLowerCase();
    const matchName = (c.fn+' '+c.sn).toLowerCase().includes(q) || c.svc.includes(q);
    const matchRank = rankFilter === 'All' || c.rank === rankFilter;
    return matchName && matchRank;
  });

  const Card = selected ? CADETS.find(c => c.id === selected) : null;

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
            <button onClick={() => showToast('📥 Exporting cadet register…')} style={{ padding:'8px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>📥 Export</button>
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
      {Card && (
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:20, alignSelf:'flex-start', position:'sticky', top:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, fontSize:16 }}>Cadet Profile</div>
            <button onClick={() => setSelected(null)} style={{ border:'none', background:'none', fontSize:18, cursor:'pointer', color:muted }}>×</button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${border}` }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800 }}>{Card.ini}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15 }}>{Card.sn}, {Card.fn}</div>
              <div style={{ fontSize:12, color:muted }}>{Card.rank} · Svc {Card.svc}</div>
            </div>
          </div>
          {[['Age', Card.age],['Attendance', `${Card.att}%`],['PTS Classification', Card.pts],['Badges', Card.badges],['Swimming test', Card.swim ? '✅ Passed' : '❌ Not passed']].map(([l,v])=>(
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${border}`, fontSize:13 }}>
              <span style={{ color:muted }}>{l}</span>
              <span style={{ fontWeight:700 }}>{v}</span>
            </div>
          ))}
          {Card.issue && (
            <div style={{ marginTop:14, background:'#FFF3CC', border:'1px solid #F0C84A', borderRadius:8, padding:'10px 12px', fontSize:12, color:'#7A4A00', fontWeight:600 }}>
              ⚠️ {Card.issue}
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:16 }}>
            {['Edit profile','Send message','View forms','Promote'].map(a => (
              <button key={a} onClick={() => showToast(`▶ ${a}: ${Card.rank} ${Card.sn}`)}
                style={{ padding:'8px 10px', background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>{a}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
