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

export default function Applicants({ showToast, addAudit }) {
  const [applicants, setApplicants] = useState(() => mergeWebEnquiries(INITIAL_APPLICANTS));
  const [search, setSearch]         = useState('');
  const [showRej, setShowRej]       = useState(false);
  const [stageFilter, setStageFilter] = useState(null);
  const [selected, setSelected]     = useState(null);
  const [showNew, setShowNew]       = useState(false);
  const [viewMode, setViewMode]     = useState('list');
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

  function exportApplicantCSV() {
    const stageLabels = { enquiry:'Enquiry', invitee:'Invitee', applicant:'Applicant' };
    const header = 'Stage,Surname,Forename,Age,Unit,Wing,Source,Contact,Notes\n';
    const rows = applicants.filter(a => !a.rejected).map(a =>
      [stageLabels[a.status]||a.status, a.sn, a.fn, a.age, a.unit, a.wing, a.src, a.contact, a.notes||'']
        .map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '1701-applicants.csv';
    a.click();
    URL.revokeObjectURL(url);
    addAudit?.('Applicants exported to CSV', 'Applicants', `${applicants.filter(a=>!a.rejected).length} active`);
    showToast('📊 Applicants CSV downloaded');
  }

  function printApplicantReport() {
    const dateStr = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const active = applicants.filter(a => !a.rejected);
    const stageOrder = ['enquiry','invitee','applicant'];
    const stageLabels = { enquiry:'Enquiry', invitee:'Invitee', applicant:'Applicant' };
    const stageBg = { enquiry:'#EAF4FF', invitee:'#FFF8E7', applicant:'#E6F4EA' };
    const stageColor = { enquiry:'#003D80', invitee:'#7A4A00', applicant:'#065F46' };
    const rows = stageOrder.flatMap(stage => {
      const group = active.filter(a => a.status === stage);
      if (group.length === 0) return [];
      return group.map((a, idx) => `
        <tr style="border-bottom:1px solid #D0DCF0;background:${idx%2?'#fafcfe':'white'}">
          <td style="padding:8px 12px">
            <span style="background:${stageBg[a.status]};color:${stageColor[a.status]};padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700">${stageLabels[a.status]}</span>
          </td>
          <td style="padding:8px 12px;font-weight:700;color:#0D1B2E">${a.fn} ${a.sn}</td>
          <td style="padding:8px 12px;color:#5A7090">${a.age}</td>
          <td style="padding:8px 12px;font-size:11px;color:#5A7090">${a.unit}</td>
          <td style="padding:8px 12px;font-size:11px;color:#5A7090">${a.wing}</td>
          <td style="padding:8px 12px;font-size:11px;color:#5A7090">${a.src || '—'}</td>
          <td style="padding:8px 12px;font-size:11px">${a.contact || '—'}</td>
          <td style="padding:8px 12px;font-size:11px;color:#5A7090">${a.notes || '—'}</td>
        </tr>`);
    }).join('');
    const summaryTiles = stageOrder.map(st => `
      <div style="background:${stageBg[st]};border:1px solid ${stageBg[st]};border-radius:8px;padding:12px 18px;text-align:center;min-width:120px">
        <div style="font-family:Barlow Condensed,sans-serif;font-size:32px;font-weight:800;color:${stageColor[st]}">${counts[st]}</div>
        <div style="font-size:11px;font-weight:700;color:${stageColor[st]};text-transform:uppercase;letter-spacing:0.06em">${stageLabels[st]}s</div>
      </div>`).join('');
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Applicants Pipeline — 1701 Sqn</title>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box}body{margin:0;background:white;font-family:Barlow,sans-serif}@page{size:A4 portrait;margin:14mm 16mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
      </head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:14px">
          <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg>
          <div>
            <div style="font-family:Barlow Condensed,sans-serif;font-size:22px;font-weight:800;color:#00264D">APPLICANTS PIPELINE REPORT</div>
            <div style="font-size:11px;color:#5A7090;letter-spacing:0.07em">1701 (JOHNSTONE) SQUADRON · ROYAL AIR FORCE AIR CADETS · WEST SCOTLAND WING</div>
          </div>
        </div>
        <div style="text-align:right;font-size:11px;color:#5A7090;line-height:1.7">
          <strong style="color:#0D1B2E">Printed:</strong> ${dateStr}<br>
          <strong style="color:#0D1B2E">Active applicants:</strong> ${active.length}
        </div>
      </div>
      <div style="border-top:3px solid #00264D;margin-bottom:16px"></div>

      <div style="display:flex;gap:14px;margin-bottom:20px">${summaryTiles}</div>

      <div style="font-family:Barlow Condensed,sans-serif;font-size:14px;font-weight:800;color:#00264D;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">▸ Pipeline Detail — Active Applicants</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px">
        <thead>
          <tr style="background:#F4F7FB">
            ${['Stage','Name','Age','Unit','Wing','Source','Contact','Notes'].map(h=>`<th style="padding:8px 12px;text-align:left;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #D0DCF0">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="8" style="padding:20px;text-align:center;color:#5A7090">No active applicants</td></tr>'}</tbody>
      </table>

      <div style="border-top:1.5px solid #00264D;padding-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;margin-bottom:12px">
        ${[['OC 1701 Squadron','Sqn Ldr J. Harris'],['Admin Officer','Admin Off T. Murray'],['Date','']].map(([role,name])=>`
          <div>
            <div style="font-size:11px;font-weight:700;color:#00264D;margin-bottom:4px">${role}</div>
            <div style="border-top:1px solid #0D1B2E;padding-top:5px;margin-top:36px;font-size:10px;color:#5A7090">${name}</div>
          </div>`).join('')}
      </div>
      <div style="font-size:9px;color:#9AACBF;border-top:1px solid #D0DCF0;padding-top:8px">
        OFFICIAL-SENSITIVE · Applicant data retained 1 year from last contact under AP 1919 Section 3. DPA 2018 / GDPR applies. Do not leave unattended or share outside the squadron admin team.
      </div>
      </body></html>`;
    const w = window.open('', '_blank', 'width=800,height=900');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
    addAudit?.('Applicant pipeline report printed', 'Applicants', `${active.length} active`);
    showToast('📄 Applicant pipeline report opened');
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
          <div style={{ display:'flex', border:`1.5px solid ${border}`, borderRadius:7, overflow:'hidden' }}>
            {[['list','☰ List'],['board','⬛ Board']].map(([id,label]) => (
              <button key={id} onClick={() => setViewMode(id)}
                style={{ padding:'7px 14px', border:'none', background: viewMode===id ? navy : 'white', color: viewMode===id ? 'white' : muted, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={exportApplicantCSV} style={{ padding:'8px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📊 Export CSV</button>
          <button onClick={printApplicantReport} style={{ padding:'8px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📄 Print Report</button>
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

      {/* Board view */}
      {viewMode === 'board' && (() => {
        const COLS = [
          { key:'enquiry',   label:'Enquiries',  bg:'#EAF4FF', border:'#B3D4F0', color:'#003D80', nextLabel:'Invite →' },
          { key:'invitee',   label:'Invitees',   bg:'#FFF8E7', border:'#F0C84A', color:'#7A4A00', nextLabel:'Apply →' },
          { key:'applicant', label:'Applicants', bg:'#E6F4EA', border:'#6EE7B7', color:'#065F46', nextLabel:'✅ Enrol' },
        ];
        return (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:20 }}>
            {COLS.map(col => {
              const colItems = applicants.filter(a => !a.rejected && a.status === col.key &&
                (!search || (a.fn+' '+a.sn).toLowerCase().includes(search.toLowerCase())));
              return (
                <div key={col.key} style={{ background:col.bg, border:`1.5px solid ${col.border}`, borderRadius:10, overflow:'hidden' }}>
                  <div style={{ padding:'10px 14px', borderBottom:`1.5px solid ${col.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:12, fontWeight:800, color:col.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>{col.label}</div>
                    <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:col.color }}>{colItems.length}</div>
                  </div>
                  <div style={{ padding:10, minHeight:120 }}>
                    {colItems.length === 0 && (
                      <div style={{ fontSize:12, color:'rgba(0,0,0,0.3)', textAlign:'center', padding:'20px 0', fontStyle:'italic' }}>No applicants at this stage</div>
                    )}
                    {colItems.map(a => (
                      <div key={a.id} style={{ background:'white', border:`1px solid ${col.border}`, borderRadius:8, padding:'10px 12px', marginBottom:8, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                          <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E' }}>{a.fn} {a.sn}</div>
                          {a.fromWebsite && <span style={{ background:'#EAF4FF', color:'#00386B', borderRadius:6, padding:'1px 5px', fontSize:9, fontWeight:700 }}>🌐</span>}
                        </div>
                        <div style={{ fontSize:11, color:muted, marginBottom:8 }}>Age {a.age} · {a.src || '—'}</div>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => setSelected(a)}
                            style={{ flex:1, padding:'5px', background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:navy }}>
                            👁 View
                          </button>
                          {STAGE_NEXT[a.status] && (
                            <button onClick={() => { advance(a.id); }}
                              style={{ flex:2, padding:'5px', background: col.key==='applicant' ? '#1B6B3A' : navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                              {col.nextLabel}
                            </button>
                          )}
                          {col.key === 'applicant' && !STAGE_NEXT[a.status] && (
                            <button onClick={() => enrol(a.id)}
                              style={{ flex:2, padding:'5px', background:'#1B6B3A', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                              ✅ Enrol
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Filters (list view only) */}
      {viewMode === 'list' && <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…"
          style={{ padding:'8px 12px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'inherit', width:200 }} />
        <label style={{ fontSize:13, color:muted, display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
          <input type="checkbox" checked={showRej} onChange={e => setShowRej(e.target.checked)} />
          Show rejected
        </label>
        {stageFilter && <button onClick={() => setStageFilter(null)} style={{ fontSize:12, color:navy, fontWeight:700, background:'#EAF4FF', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer' }}>✕ Clear filter</button>}
      </div>}

      {/* Table (list view only) */}
      {viewMode === 'list' && <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
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
      </div>}

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
