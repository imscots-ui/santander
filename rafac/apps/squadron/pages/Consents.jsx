import { useState, useEffect, useCallback } from 'react';
import { EVENTS } from '../../../data/events.js';
import { getFormStatus, setFormStatus, getFormDetail, FORM_KEY, DETAIL_KEY } from '../../../data/sync.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const FORM_KEY_MAP = { 'TG21':'tg21', 'TG23':'tg23', 'Flying Medical':'flying' };
const FORM_ICON    = { tg21:'📋', tg23:'🏥', flying:'✈️' };

function FormPill({ signed, label, icon }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20,
      background: signed ? '#D1FAE5' : '#F4F7FB',
      color: signed ? '#065F46' : '#8A9BB0',
      border:`1px solid ${signed?'#6EE7B7':'#D0D8E4'}` }}>
      {icon} {signed ? '✅' : '—'}
    </span>
  );
}

export default function Consents({ showToast }) {
  const [formStatus, setFs]   = useState(getFormStatus());
  const [formDetail, setFd]   = useState(getFormDetail());
  const [selected, setSelected] = useState(null);

  const refresh = useCallback(() => {
    setFs(getFormStatus());
    setFd(getFormDetail());
  }, []);

  useEffect(() => {
    window.addEventListener('storage', e => { if (e.key === FORM_KEY || e.key === DETAIL_KEY) refresh(); });
    window.addEventListener('rafac-form-update', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('rafac-form-update', refresh); };
  }, [refresh]);

  function getFormSigned(eventId, cadetId, formKey) {
    return formDetail[eventId]?.[cadetId]?.[formKey]?.signed || false;
  }

  function getOverallStatus(eventId, cadetId, requiredForms) {
    const allSigned = requiredForms.every(f => getFormSigned(eventId, cadetId, f));
    if (allSigned) return 'signed';
    return formStatus[eventId]?.[cadetId] || 'unsent';
  }

  function markSent(eventId, cadetId) {
    setFormStatus(eventId, cadetId, 'sent');
    refresh();
    showToast('📧 Link sent — awaiting parent to complete online');
  }

  const requiredKeys = ev => ev.forms.map(f => FORM_KEY_MAP[f] || f.toLowerCase().replace(/\s/g,''));

  const totalForms  = EVENTS.reduce((s,e) => s + e.cadets.length, 0);
  const signedForms = EVENTS.reduce((s,e) => s + e.cadets.filter(c => {
    const rk = requiredKeys(e);
    return rk.every(f => getFormSigned(e.id, c.cadetId, f));
  }).length, 0);
  const compPct = totalForms ? Math.round((signedForms/totalForms)*100) : 0;

  return (
    <div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:4 }}>Forms & Consents</div>
      <div style={{ fontSize:12, color:muted, marginBottom:18 }}>TG21 · TG23 · Flying Medical · Live tracker — syncs with Parent Portal</div>

      {/* Summary bar */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy }}>Overall Completion — {compPct}%</div>
          <div style={{ fontSize:12, color:muted }}>{signedForms} of {totalForms} cadets fully signed</div>
        </div>
        <div style={{ height:10, background:'#f0f4fa', borderRadius:5, overflow:'hidden' }}>
          <div style={{ width:`${compPct}%`, height:'100%', background: compPct>=85?'#1B6B3A':compPct>=60?gold:'#C8102E', borderRadius:5, transition:'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize:10, color:muted, marginTop:5 }}>Updates live when parents sign via the Parent Portal</div>
      </div>

      {/* Events */}
      {EVENTS.map(event => {
        const rk = requiredKeys(event);
        const eventSigned = event.cadets.filter(c => rk.every(f => getFormSigned(event.id, c.cadetId, f))).length;
        const eventTotal  = event.cadets.length;
        const complete    = eventSigned === eventTotal;

        return (
          <div key={event.id} style={{ background:'white', border:`1.5px solid ${selected===event.id?navy:border}`, borderRadius:10, marginBottom:14 }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', cursor:'pointer', borderBottom: selected===event.id?`1px solid ${border}`:'none' }}
              onClick={() => setSelected(selected===event.id ? null : event.id)}>
              <div>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:800, color:navy }}>{event.name}</div>
                <div style={{ fontSize:12, color:muted, marginTop:2 }}>{event.date} · {event.location}</div>
                <div style={{ display:'flex', gap:6, marginTop:6 }}>
                  {event.forms.map(f => (
                    <span key={f} style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20, background:'#EEF2F8', color:navy }}>
                      {FORM_ICON[FORM_KEY_MAP[f]]||'📄'} {f}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                <span style={{ background:complete?'#D4EDDA':'#FFF3CC', color:complete?'#0F4020':'#7A4A00', padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:700 }}>
                  {eventSigned}/{eventTotal} complete
                </span>
                <span style={{ color:muted, fontSize:14 }}>{selected===event.id?'▲':'▼'}</span>
              </div>
            </div>

            {/* Cadets table */}
            {selected === event.id && (
              <div style={{ padding:'0 20px 16px' }}>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:8, margin:'12px 0' }}>
                  <button onClick={() => { event.cadets.forEach(c => { if(getOverallStatus(event.id,c.cadetId,rk)==='unsent') markSent(event.id,c.cadetId); }); }}
                    style={{ padding:'6px 14px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    📧 Send portal link to all outstanding
                  </button>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:`2px solid ${border}` }}>
                        <th style={{ padding:'8px 10px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>Cadet</th>
                        {event.forms.map(f => (
                          <th key={f} style={{ padding:'8px 10px', textAlign:'center', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>
                            {FORM_ICON[FORM_KEY_MAP[f]]||'📄'} {f}
                          </th>
                        ))}
                        <th style={{ padding:'8px 10px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.cadets.map(c => {
                        const allDone = rk.every(f => getFormSigned(event.id, c.cadetId, f));
                        const status  = getOverallStatus(event.id, c.cadetId, rk);
                        return (
                          <tr key={c.cadetId} style={{ borderBottom:`1px solid ${border}` }}>
                            <td style={{ padding:'11px 10px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <div style={{ width:28, height:28, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0 }}>{c.ini}</div>
                                <span style={{ fontWeight:700 }}>{c.name}</span>
                              </div>
                            </td>
                            {event.forms.map(f => {
                              const fk = FORM_KEY_MAP[f] || f;
                              const signed = getFormSigned(event.id, c.cadetId, fk);
                              const det = formDetail[event.id]?.[c.cadetId]?.[fk];
                              return (
                                <td key={f} style={{ padding:'11px 10px', textAlign:'center' }}>
                                  <FormPill signed={signed} icon={FORM_ICON[fk]||'📄'} label={f} />
                                  {signed && det?.signedAt && (
                                    <div style={{ fontSize:9, color:muted, marginTop:2 }}>
                                      {new Date(det.signedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ padding:'11px 10px', whiteSpace:'nowrap' }}>
                              {allDone ? (
                                <span style={{ fontSize:11, color:'#1B6B3A', fontWeight:700 }}>✅ Complete</span>
                              ) : status === 'sent' ? (
                                <span style={{ fontSize:11, color:'#7A4A00', fontWeight:700 }}>📧 Link sent</span>
                              ) : (
                                <button onClick={() => markSent(event.id, c.cadetId)}
                                  style={{ padding:'4px 10px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                                  📧 Send link
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontSize:11, color:muted, marginTop:8, padding:'10px 14px', background:'#F4F7FB', borderRadius:8, border:`1px solid ${border}` }}>
        🔒 OFFICIAL-SENSITIVE · TG21/TG23/Flying Medical data shared with authorised staff only · GDPR DPA 2018 · Medical detail held as special-category data
      </div>
    </div>
  );
}
