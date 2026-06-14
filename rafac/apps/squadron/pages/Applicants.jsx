import { useState, useEffect } from 'react';
import { INITIAL_APPLICANTS, STATUS_META, STAGE_NEXT } from '../../../data/applicants.js';
import { getWebEnquiries, ENQUIRY_KEY } from '../../../data/sync.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

function mergeWebEnquiries(base) {
  const web = getWebEnquiries();
  const existing = new Set(base.map(a => a.id));
  const toAdd = web.filter(w => !existing.has(w.id)).map(w => ({
    id: w.id, fn: w.fn, sn: w.sn, dob: w.dob || '', age: w.age || '?',
    status: 'enquiry', unit: w.unit || '1701 (Johnstone)', wing: w.wing || 'West Scotland',
    src: '🌐 RAFAC website', contact: w.parentTel || '', notes: w.notes || '',
    parentName: w.parentName || '', rejected: false, fromWebsite: true,
  }));
  return [...base, ...toAdd];
}

export default function Applicants({ showToast }) {
  const [applicants, setApplicants] = useState(() => mergeWebEnquiries(INITIAL_APPLICANTS));
  const [search, setSearch]         = useState('');
  const [showRej, setShowRej]       = useState(false);
  const [stageFilter, setStageFilter] = useState(null);
  const [selected, setSelected]     = useState(null);
  const [showNew, setShowNew]       = useState(false);
  const [newForm, setNewForm]       = useState({ fn:'', sn:'', dob:'', src:'Walk-in / parade night', contact:'', notes:'' });

  // Live-merge web enquiries
  useEffect(() => {
    const sync = () => setApplicants(prev => mergeWebEnquiries(prev));
    window.addEventListener('storage', e => { if (e.key === ENQUIRY_KEY) sync(); });
    window.addEventListener('rafac-join-enquiry', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('rafac-join-enquiry', sync); };
  }, []);

  const counts = { enquiry:0, invitee:0, applicant:0 };
  applicants.filter(a=>!a.rejected).forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });

  const displayed = applicants.filter(a => {
    if (a.rejected && !showRej) return false;
    if (stageFilter && (a.rejected ? 'rejected' : a.status) !== stageFilter) return false;
    if (search && !(a.fn+' '+a.sn).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function advance(id) {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: STAGE_NEXT[a.status] } : a));
    const a = applicants.find(x => x.id === id);
    showToast(`→ ${a.fn} ${a.sn} moved to ${STATUS_META[STAGE_NEXT[a.status]]?.label}`);
  }
  function reject(id) {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, rejected:true } : a));
    const a = applicants.find(x => x.id === id);
    showToast(`✗ ${a.fn} ${a.sn} marked as not progressing`);
  }
  function reinstate(id) {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, rejected:false } : a));
  }
  function enrol(id) {
    const a = applicants.find(x => x.id === id);
    showToast(`✅ ${a.fn} ${a.sn} enrolled as a cadet — Bader record created`);
    setApplicants(prev => prev.filter(x => x.id !== id));
  }
  function saveNew() {
    if (!newForm.fn.trim() || !newForm.sn.trim()) { showToast('Name required', 'warn'); return; }
    const dob = newForm.dob;
    let age = '?';
    if (dob) {
      const d = new Date(dob), now = new Date();
      age = now.getFullYear() - d.getFullYear();
    }
    const rec = { ...newForm, id:'ap-'+Date.now(), age, status:'enquiry', unit:'1701 (Johnstone)', wing:'West Scotland', rejected:false, fn:newForm.fn.trim(), sn:newForm.sn.trim() };
    setApplicants(prev => [rec, ...prev]);
    showToast(`📬 Enquiry for ${rec.fn} ${rec.sn} saved`);
    setShowNew(false);
    setNewForm({ fn:'', sn:'', dob:'', src:'Walk-in / parade night', contact:'', notes:'' });
  }

  const STAGES = [
    { key:'enquiry',   icon:'1', label:'Enquiries',  desc:'Initial interest — contact to follow up' },
    { key:'invitee',   icon:'2', label:'Invitees',   desc:'Formally invited to complete RAFAC application' },
    { key:'applicant', icon:'3', label:'Applicants', desc:'Application in progress — vetting underway' },
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Applicants Pipeline</div>
          <div style={{ fontSize:12, color:muted }}>{applicants.filter(a=>!a.rejected).length} active · mirrors Bader Applicants</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setShowNew(true)} style={{ padding:'8px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>+ New Enquiry</button>
        </div>
      </div>

      {/* Stage tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:18 }}>
        {STAGES.map(s => (
          <div key={s.key} onClick={() => setStageFilter(stageFilter === s.key ? null : s.key)}
            style={{ background:'white', border:`1.5px solid ${stageFilter===s.key ? navy : border}`, borderRadius:9, padding:'14px 16px', cursor:'pointer', transition:'border-color 0.15s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:16, flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:navy }}>{s.label}</div>
                <div style={{ fontSize:10, color:muted }}>Click to filter</div>
              </div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:28, fontWeight:800, color:navy }}>{counts[s.key]}</div>
            </div>
            <div style={{ fontSize:11, color:muted }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…"
          style={{ padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', width:200 }} />
        <label style={{ fontSize:13, color:muted, display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
          <input type="checkbox" checked={showRej} onChange={e => setShowRej(e.target.checked)} />
          Show rejected
        </label>
        {stageFilter && <button onClick={() => setStageFilter(null)} style={{ fontSize:12, color:navy, fontWeight:700, background:'#EAF4FF', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer' }}>✕ Clear filter</button>}
      </div>

      {/* Table */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
              {['Status','First name','Surname','Age','Unit','Wing','Actions'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 && (
              <tr><td colSpan={7} style={{ padding:'24px', textAlign:'center', color:muted, fontSize:13 }}>No records match</td></tr>
            )}
            {displayed.map((a, i) => {
              const stKey = a.rejected ? 'rejected' : a.status;
              const m = STATUS_META[stKey] || STATUS_META.enquiry;
              return (
                <tr key={a.id} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                  <td style={{ padding:'11px 14px' }}><span style={{ background:m.bg, color:m.color, padding:'2px 9px', borderRadius:10, fontSize:10, fontWeight:700 }}>{m.label}</span></td>
                  <td style={{ padding:'11px 14px' }}>{a.fn}</td>
                  <td style={{ padding:'11px 14px' }}>
                    <strong>{a.sn}</strong>
                    {a.fromWebsite && <span style={{ marginLeft:6, background:'#EAF4FF', color:'#00386B', border:'1px solid #B3D4F0', borderRadius:10, padding:'1px 6px', fontSize:9, fontWeight:700 }}>🌐 Web</span>}
                  </td>
                  <td style={{ padding:'11px 14px' }}>{a.age}</td>
                  <td style={{ padding:'11px 14px', fontSize:12, color:muted }}>{a.unit}</td>
                  <td style={{ padding:'11px 14px', fontSize:12, color:muted }}>{a.wing}</td>
                  <td style={{ padding:'11px 14px', whiteSpace:'nowrap' }}>
                    <button onClick={() => setSelected(a)} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer', fontWeight:600, marginRight:4 }}>👁 Review</button>
                    {!a.rejected && STAGE_NEXT[a.status] && (
                      <button onClick={() => advance(a.id)} style={{ padding:'4px 10px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', marginRight:4 }}>
                        → {STATUS_META[STAGE_NEXT[a.status]].label}
                      </button>
                    )}
                    {!a.rejected && a.status === 'applicant' && (
                      <button onClick={() => enrol(a.id)} style={{ padding:'4px 10px', background:'#1B6B3A', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', marginRight:4 }}>✅ Enrol</button>
                    )}
                    {!a.rejected
                      ? <button onClick={() => reject(a.id)} style={{ padding:'4px 10px', background:'#FFF0F0', color:'#8B1A1A', border:'none', borderRadius:6, fontSize:11, cursor:'pointer' }}>✗ Reject</button>
                      : <button onClick={() => reinstate(a.id)} style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer' }}>↩ Reinstate</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'white', borderRadius:12, padding:28, width:460, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:20, fontWeight:800, color:navy }}>{selected.fn} {selected.sn}</div>
              <button onClick={() => setSelected(null)} style={{ border:'none', background:'none', fontSize:22, cursor:'pointer', color:muted }}>×</button>
            </div>
            {[['Age', selected.age],['Unit', selected.unit],['Wing', selected.wing],['Source', selected.src],['Contact', selected.contact || '—'],['Notes', selected.notes || '—']].map(([l,v])=>(
              <div key={l} style={{ display:'flex', gap:12, padding:'8px 0', borderBottom:`1px solid ${border}`, fontSize:13 }}>
                <div style={{ color:muted, width:80, flexShrink:0 }}>{l}</div>
                <div style={{ fontWeight:600, color:'#0D1B2E' }}>{v}</div>
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={() => setSelected(null)} style={{ flex:1, padding:'10px', background:'white', border:`1.5px solid ${border}`, borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Close</button>
              {!selected.rejected && STAGE_NEXT[selected.status] && (
                <button onClick={() => { advance(selected.id); setSelected(null); }} style={{ flex:2, padding:'10px', background:navy, color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  Move to {STATUS_META[STAGE_NEXT[selected.status]].label} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New enquiry modal */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'white', borderRadius:12, padding:28, width:420, maxWidth:'90vw' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:20, fontWeight:800, color:navy, marginBottom:20 }}>New Enquiry</div>
            {[['First name *','fn','text',''],['Surname *','sn','text',''],['Date of birth','dob','date',''],['Contact number','contact','tel','07xxx xxxxxx']].map(([l,k,t,ph])=>(
              <div key={k} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, fontWeight:700, color:navy, display:'block', marginBottom:4 }}>{l}</label>
                <input type={t} value={newForm[k]} onChange={e => setNewForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}
                  style={{ width:'100%', padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }} />
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:700, color:navy, display:'block', marginBottom:4 }}>Source</label>
              <select value={newForm.src} onChange={e => setNewForm(f=>({...f,src:e.target.value}))}
                style={{ width:'100%', padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit' }}>
                {['Walk-in / parade night','RAFAC website','Friend / word of mouth','Recruitment stand','School referral','Parent enquiry','Other'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:700, color:navy, display:'block', marginBottom:4 }}>Notes</label>
              <textarea value={newForm.notes} onChange={e => setNewForm(f=>({...f,notes:e.target.value}))} rows={2}
                style={{ width:'100%', padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', resize:'vertical' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowNew(false)} style={{ flex:1, padding:'10px', background:'white', border:`1.5px solid ${border}`, borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Cancel</button>
              <button onClick={saveNew} style={{ flex:2, padding:'10px', background:gold, color:'#00264D', border:'none', borderRadius:8, fontSize:13, fontWeight:800, cursor:'pointer' }}>Save Enquiry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
