import { useState, useEffect, useCallback } from 'react';
import { EVENTS } from '../../../data/events.js';
import { getFormStatus, setFormStatus, FORM_KEY } from '../../../data/sync.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const STATUS_STYLE = {
  signed: { label:'Signed',         bg:'#D4EDDA', color:'#0F4020', icon:'✅' },
  sent:   { label:'Sent — awaiting', bg:'#FFF3CC', color:'#7A4A00', icon:'📧' },
  unsent: { label:'Not sent',        bg:'#F8D7DA', color:'#8B1A1A', icon:'⏰' },
};

export default function Consents({ showToast }) {
  const [formStatus, setFs] = useState(getFormStatus());
  const [selected, setSelected] = useState(null);

  const refresh = useCallback(() => setFs(getFormStatus()), []);

  useEffect(() => {
    window.addEventListener('storage', e => { if (e.key === FORM_KEY) refresh(); });
    window.addEventListener('rafac-form-update', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('rafac-form-update', refresh); };
  }, [refresh]);

  function getStatus(eventId, cadetId) {
    return formStatus[eventId]?.[cadetId] || 'unsent';
  }

  function markSent(eventId, cadetId) {
    setFormStatus(eventId, cadetId, 'sent');
    refresh();
    showToast('📧 Reminder sent — awaiting parent signature');
  }

  function markSigned(eventId, cadetId) {
    setFormStatus(eventId, cadetId, 'signed');
    refresh();
    showToast('✅ Marked as signed — record updated');
  }

  const totalForms = EVENTS.reduce((s, e) => s + e.cadets.length, 0);
  const signedForms = EVENTS.reduce((s, e) => s + e.cadets.filter(c => getStatus(e.id, c.cadetId) === 'signed').length, 0);
  const compPct = totalForms ? Math.round((signedForms/totalForms)*100) : 0;

  return (
    <div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy, marginBottom:4 }}>Forms & Consents</div>
      <div style={{ fontSize:12, color:muted, marginBottom:18 }}>TG21 · TG23 · Live tracker — updates sync to Wing HQ and Parent Portal</div>

      {/* Summary bar */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy }}>Overall Compliance — {compPct}%</div>
          <div style={{ display:'flex', gap:16, fontSize:12 }}>
            {Object.entries(STATUS_STYLE).map(([k, s]) => {
              const n = EVENTS.reduce((sum, e) => sum + e.cadets.filter(c => getStatus(e.id, c.cadetId) === k).length, 0);
              return <span key={k} style={{ fontWeight:700, color:s.color }}>{s.icon} {n} {s.label}</span>;
            })}
          </div>
        </div>
        <div style={{ height:10, background:'#f0f4fa', borderRadius:5, overflow:'hidden' }}>
          <div style={{ width:`${compPct}%`, height:'100%', background: compPct >= 85 ? '#1B6B3A' : compPct >= 60 ? gold : '#C8102E', borderRadius:5, transition:'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize:10, color:muted, marginTop:5 }}>{signedForms} of {totalForms} forms signed · syncs live to Wing HQ</div>
      </div>

      {/* Events */}
      {EVENTS.map(event => {
        const eventSigned   = event.cadets.filter(c => getStatus(event.id, c.cadetId) === 'signed').length;
        const eventTotal    = event.cadets.length;
        const eventComplete = eventSigned === eventTotal;
        return (
          <div key={event.id} style={{ background:'white', border:`1.5px solid ${selected===event.id ? navy : border}`, borderRadius:10, marginBottom:14 }}>
            {/* Event header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', cursor:'pointer', borderBottom: selected===event.id ? `1px solid ${border}` : 'none' }}
              onClick={() => setSelected(selected === event.id ? null : event.id)}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:800, color:navy }}>{event.name}</div>
                  <div style={{ fontSize:12, color:muted }}>{event.date} · {event.location} · Forms: {event.forms.join(', ')}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ background: eventComplete ? '#D4EDDA' : '#FFF3CC', color: eventComplete ? '#0F4020' : '#7A4A00', padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:700 }}>
                  {eventSigned}/{eventTotal} signed
                </span>
                <span style={{ color:muted, fontSize:16 }}>{selected===event.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Cadets table */}
            {selected === event.id && (
              <div style={{ padding:'0 20px 16px' }}>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginBottom:12, marginTop:12 }}>
                  <button onClick={() => { event.cadets.forEach(c => { if(getStatus(event.id,c.cadetId)==='unsent') markSent(event.id,c.cadetId); }); }} style={{ padding:'6px 14px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>📧 Send all unsent</button>
                  <button onClick={() => showToast('📦 Generating form pack for '+event.name)} style={{ padding:'6px 14px', background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>📦 Generate pack</button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead><tr style={{ borderBottom:`2px solid ${border}` }}>
                    {['Cadet','Status','Sent','Signed','Actions'].map(h=><th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {event.cadets.map(c => {
                      const st = getStatus(event.id, c.cadetId);
                      const s = STATUS_STYLE[st];
                      return (
                        <tr key={c.cadetId} style={{ borderBottom:`1px solid ${border}` }}>
                          <td style={{ padding:'10px 10px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:28, height:28, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800 }}>{c.ini}</div>
                              <span style={{ fontWeight:700 }}>{c.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:'10px 10px' }}><span style={{ background:s.bg, color:s.color, padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700 }}>{s.icon} {s.label}</span></td>
                          <td style={{ padding:'10px 10px', fontSize:12, color:muted }}>{c.sentAt || '—'}</td>
                          <td style={{ padding:'10px 10px', fontSize:12, color:muted }}>{c.signedAt || '—'}</td>
                          <td style={{ padding:'10px 10px', whiteSpace:'nowrap' }}>
                            {st === 'unsent' && <button onClick={() => markSent(event.id, c.cadetId)} style={{ padding:'4px 10px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', marginRight:4 }}>📧 Send</button>}
                            {st === 'sent'   && <button onClick={() => markSigned(event.id, c.cadetId)} style={{ padding:'4px 10px', background:'#1B6B3A', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', marginRight:4 }}>✅ Mark signed</button>}
                            {st === 'signed' && <span style={{ fontSize:11, color:'#1B6B3A', fontWeight:700 }}>✅ Complete</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontSize:11, color:muted, marginTop:8, padding:'10px 14px', background:'#F4F7FB', borderRadius:8, border:`1px solid ${border}` }}>
        🔒 OFFICIAL-SENSITIVE · TG21/TG23 data shared with authorised staff only · GDPR DPA 2018 · Medical detail held as special-category data
      </div>
    </div>
  );
}
