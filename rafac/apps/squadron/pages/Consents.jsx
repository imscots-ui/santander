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

export default function Consents({ showToast, addAudit }) {
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

  function printConsentStatus() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const rk = ev => ev.forms.map(f => FORM_KEY_MAP[f] || f.toLowerCase().replace(/\s/g,''));
    const eventBlocks = EVENTS.map(event => {
      const keys = rk(event);
      const rows = event.cadets.map((c,i) => {
        const allDone = keys.every(f => (formDetail[event.id]?.[c.cadetId]?.[f]?.signed || false));
        const formCells = event.forms.map(f => {
          const fk = FORM_KEY_MAP[f] || f;
          const signed = formDetail[event.id]?.[c.cadetId]?.[fk]?.signed || false;
          const det = formDetail[event.id]?.[c.cadetId]?.[fk];
          const date = signed && det?.signedAt ? new Date(det.signedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : '';
          return `<td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${signed?'#D1FAE5':'#F4F7FB'};color:${signed?'#065F46':'#8A9BB0'};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">${signed?'✅ Signed':'—'}</span>${date?`<div style="font-size:9px;color:#5A7090;">${date}</div>`:''}</td>`;
        }).join('');
        return `<tr style="background:${i%2?'#FAFCFE':'white'};${allDone?'':'border-left:3px solid #D97706;'}">
          <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;">${c.name}</td>
          ${formCells}
          <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${allDone?'#D1FAE5':'#FFF3CC'};color:${allDone?'#0F4020':'#7A4A00'};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">${allDone?'✅ Complete':'⏳ Pending'}</span></td>
        </tr>`;
      }).join('');
      const signed = event.cadets.filter(c => keys.every(f => (formDetail[event.id]?.[c.cadetId]?.[f]?.signed||false))).length;
      const formHeaders = event.forms.map(f => `<th style="padding:7px 10px;text-align:center;background:#00264D;color:white;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10px;letter-spacing:0.06em;">${f}</th>`).join('');
      return `
        <div style="margin-bottom:16px;break-inside:avoid;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D;margin-bottom:4px;">${event.name}</div>
          <div style="font-size:10px;color:#5A7090;margin-bottom:6px;">${event.date} · ${event.location} · ${signed}/${event.cadets.length} fully signed</div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;">
            <thead><tr>
              <th style="padding:7px 10px;text-align:left;background:#00264D;color:white;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10px;letter-spacing:0.06em;">CADET</th>
              ${formHeaders}
              <th style="padding:7px 10px;text-align:center;background:#00264D;color:white;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10px;letter-spacing:0.06em;">STATUS</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Consent & Forms Status — 1701 Sqn</title>
    <style>
      @page { size: A4 portrait; margin: 14mm 16mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:11px; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;padding-bottom:10px;border-bottom:3px solid #00264D;">
      <tr>
        <td style="width:50px;"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg></td>
        <td style="padding-left:12px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">FORMS &amp; CONSENTS STATUS — TG21 · TG23 · FLYING MEDICAL</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">As at ${today} · Overall completion: ${compPct}%</div>
        </td>
      </tr>
    </table>
    <div style="background:#EAF4FF;border:1px solid #B3D4F0;border-radius:6px;padding:8px 12px;margin-bottom:14px;font-size:10px;color:#003D80;">
      🔒 OFFICIAL-SENSITIVE · TG21/TG23/Flying Medical data shared with authorised staff only · GDPR DPA 2018 · Medical detail held as special-category data
    </div>
    ${eventBlocks}
    <div style="margin-top:20px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL-SENSITIVE — RAFAC INTERNAL · Retain 3 years post-activity (AP 1919 / DPA 2018)
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Consent status report printed', 'Consents', `Printed on ${today}`);
    showToast('🖨️ Consent status report sent to printer');
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
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Forms & Consents</div>
          <div style={{ fontSize:12, color:muted, marginTop:2 }}>TG21 · TG23 · Flying Medical · Live tracker — syncs with Parent Portal</div>
        </div>
        <button onClick={printConsentStatus}
          style={{ padding:'8px 16px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', flexShrink:0 }}>
          📄 Print Status
        </button>
      </div>
      <div style={{ marginBottom:14 }} />

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
