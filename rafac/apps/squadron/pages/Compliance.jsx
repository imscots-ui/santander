import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', green = '#1B6B3A', red = '#8B1A1A';

const CHECKS = [
  { id:'c1', category:'Fire Safety',    task:'Fire extinguisher inspection',      freq:'Monthly',  lastDone:'2026-05-14', nextDue:'2026-06-14', doneBy:'Sgt Thomas, M.' },
  { id:'c2', category:'Fire Safety',    task:'Emergency exit walkthrough',        freq:'Weekly',   lastDone:'2026-06-07', nextDue:'2026-06-14', doneBy:'OC Harris' },
  { id:'c3', category:'Fire Safety',    task:'Fire alarm test',                   freq:'Weekly',   lastDone:'2026-06-07', nextDue:'2026-06-14', doneBy:'OC Harris' },
  { id:'c4', category:'Premises',       task:'First aid kit stockcheck',          freq:'Monthly',  lastDone:'2026-05-10', nextDue:'2026-06-10', doneBy:'CI Morrison' },
  { id:'c5', category:'Premises',       task:'Risk assessment review (HQ)',       freq:'Quarterly',lastDone:'2026-04-01', nextDue:'2026-07-01', doneBy:'OC Harris' },
  { id:'c6', category:'Premises',       task:'PAT testing (electrical equipment)',freq:'Annual',   lastDone:'2025-11-20', nextDue:'2026-11-20', doneBy:'External contractor' },
  { id:'c7', category:'Safeguarding',   task:'Safeguarding briefing for cadets',  freq:'Annual',   lastDone:'2026-01-12', nextDue:'2027-01-12', doneBy:'CI Morrison' },
  { id:'c8', category:'Safeguarding',   task:'Review safeguarding policy',        freq:'Annual',   lastDone:'2025-09-01', nextDue:'2026-09-01', doneBy:'OC Harris' },
  { id:'c9', category:'Administration', task:'GDPR data audit',                   freq:'Annual',   lastDone:'2025-12-01', nextDue:'2026-12-01', doneBy:'OC Harris' },
  { id:'c10',category:'Administration', task:'Insurance certificates on display', freq:'Annual',   lastDone:'2026-01-08', nextDue:'2027-01-08', doneBy:'OC Harris' },
];

const STAFF = [
  { id:'s1', name:'Sqn Ldr Harris, J.',   role:'OC',              dbs:'Enhanced', dbsExp:'2027-03-14', rvo:'Cleared', safeguard:'2026-01-12', ref:'Complete' },
  { id:'s2', name:'Flt Lt Baxter, R.',    role:'Adj',             dbs:'Enhanced', dbsExp:'2026-11-30', rvo:'Cleared', safeguard:'2025-11-15', ref:'Complete' },
  { id:'s3', name:'CI Morrison, K.',      role:'CI',              dbs:'Enhanced', dbsExp:'2026-08-22', rvo:'Cleared', safeguard:'2026-01-12', ref:'Complete' },
  { id:'s4', name:'CI Sinclair, P.',      role:'CI',              dbs:'Enhanced', dbsExp:'2025-12-01', rvo:'Pending', safeguard:'2025-10-01', ref:'1 missing'  },
  { id:'s5', name:'SSgt Fletcher, L.',    role:'PI (Drums)',       dbs:'Standard', dbsExp:'2027-06-30', rvo:'N/A',     safeguard:'2026-02-01', ref:'Complete' },
];

const INCIDENTS = [
  { id:'i1', date:'2026-05-22', type:'Near miss',  desc:'Cadet tripped on loose step near stores room; no injury. Step repaired same day.',       action:'Step repaired. RA updated.',         status:'Closed',  reportedBy:'Sgt Thomas, M.' },
  { id:'i2', date:'2026-03-10', type:'First aid',  desc:'Minor cut to hand during fieldcraft exercise. Treated on site with first aid kit.',     action:'Parents informed, first aid applied.', status:'Closed',  reportedBy:'CI Morrison, K.' },
  { id:'i3', date:'2025-12-01', type:'Safeguarding concern', desc:'Cadet disclosed home situation to CI. Referred to Wing SCC per AP1919.',    action:'Wing SCC informed, case reviewed.',   status:'Closed',  reportedBy:'CI Morrison, K.' },
  { id:'i4', date:'2026-06-05', type:'Near miss',  desc:'Power cut during ATC night exercise; backup lighting activated. No injuries.',           action:'Investigating UPS options.',          status:'Open',    reportedBy:'OC Harris' },
];

const TODAY = new Date('2026-06-14');

function daysUntil(dateStr) {
  const d = new Date(dateStr);
  return Math.round((d - TODAY) / 86400000);
}

function StatusPill({ days }) {
  if (days < 0)  return <span style={{ background:'#FEE2E2', color:'#991B1B', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>OVERDUE {Math.abs(days)}d</span>;
  if (days <= 7) return <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>DUE SOON {days}d</span>;
  return <span style={{ background:'#D1FAE5', color:'#065F46', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>OK {days}d</span>;
}

function DbsPill({ exp }) {
  const days = daysUntil(exp);
  if (days < 0)   return <span style={{ background:'#FEE2E2', color:'#991B1B', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>EXPIRED</span>;
  if (days < 90)  return <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>EXPIRING {days}d</span>;
  return <span style={{ background:'#D1FAE5', color:'#065F46', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>VALID</span>;
}

export default function Compliance({ showToast, addAudit }) {
  const [sub, setSub] = useState('checks');
  const [checks, setChecks] = useState(CHECKS);
  const [incidents, setIncidents] = useState(INCIDENTS);
  const [catFilter, setCatFilter] = useState('All');
  const [incFilter, setIncFilter] = useState('All');
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [newInc, setNewInc] = useState({ type:'Near miss', desc:'', action:'', reportedBy:'OC Harris' });

  const cats = ['All', ...new Set(CHECKS.map(c => c.category))];
  const incTypes = ['All', 'Open', 'Closed'];

  function markDone(id) {
    const today = '2026-06-14';
    setChecks(prev => prev.map(c => {
      if (c.id !== id) return c;
      const freqDays = { Weekly:7, Monthly:30, Quarterly:91, Annual:365 }[c.freq] || 30;
      const next = new Date(TODAY.getTime() + freqDays * 86400000).toISOString().slice(0,10);
      const updated = { ...c, lastDone: today, nextDue: next, doneBy:'OC Harris' };
      addAudit?.(`Compliance: "${c.task}" marked complete`);
      return updated;
    }));
    showToast('Check marked complete', 'success');
  }

  function closeIncident(id) {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status:'Closed' } : i));
    addAudit?.('Incident closed');
    showToast('Incident closed', 'success');
  }

  function submitNewIncident() {
    if (!newInc.desc.trim()) { showToast('Please describe the incident', 'error'); return; }
    const entry = { id:'i'+(incidents.length+1), date:'2026-06-14', type:newInc.type, desc:newInc.desc, action:newInc.action || 'Pending review', status:'Open', reportedBy:newInc.reportedBy };
    setIncidents(prev => [entry, ...prev]);
    addAudit?.(`Incident logged: ${newInc.type}`);
    showToast('Incident logged', 'success');
    setShowNewIncident(false);
    setNewInc({ type:'Near miss', desc:'', action:'', reportedBy:'OC Harris' });
  }

  const filteredChecks = catFilter === 'All' ? checks : checks.filter(c => c.category === catFilter);
  const filteredInc = incFilter === 'All' ? incidents : incidents.filter(i => i.status === incFilter);

  function printComplianceReport() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const checkRows = checks.map((c,i) => {
      const days = daysUntil(c.nextDue);
      const stBg  = days<0?'#FEE2E2':days<=7?'#FEF3C7':'#D1FAE5';
      const stClr = days<0?'#991B1B':days<=7?'#92400E':'#065F46';
      const stLbl = days<0?`OVERDUE ${Math.abs(days)}d`:days<=7?`DUE SOON ${days}d`:`OK ${days}d`;
      return `<tr style="background:${i%2?'#FAFCFE':'white'};${days<0?'border-left:3px solid #DC2626;':days<=7?'border-left:3px solid #D97706;':''}">
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;"><span style="background:#EEF2F8;color:#5A7090;padding:1px 6px;border-radius:4px;font-size:9px;">${c.category}</span></td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;color:#00264D;">${c.task}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${c.freq}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${c.lastDone}<div style="font-size:9px;">${c.doneBy}</div></td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${c.nextDue}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${stBg};color:${stClr};padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;">${stLbl}</span></td>
      </tr>`;
    }).join('');
    const dbsRows = STAFF.map((s,i) => {
      const days = daysUntil(s.dbsExp);
      const dbsBg  = days<0?'#FEE2E2':days<90?'#FEF3C7':'#D1FAE5';
      const dbsClr = days<0?'#991B1B':days<90?'#92400E':'#065F46';
      const dbsLbl = days<0?'EXPIRED':days<90?`EXPIRING ${days}d`:'VALID';
      const hasIssue = days<90 || s.rvo==='Pending' || s.ref!=='Complete';
      return `<tr style="background:${i%2?'#FAFCFE':'white'};${hasIssue?'border-left:3px solid #D97706;':''}">
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;">${s.name}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${s.role}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;">${s.dbs}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${s.dbsExp}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${dbsBg};color:${dbsClr};padding:2px 7px;border-radius:8px;font-size:9px;font-weight:700;">${dbsLbl}</span></td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;font-weight:700;color:${s.rvo==='Cleared'?'#065F46':s.rvo==='N/A'?'#5A7090':'#D97706'};">${s.rvo}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${s.safeguard}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;font-weight:700;color:${s.ref==='Complete'?'#065F46':'#D97706'};">${s.ref}</td>
      </tr>`;
    }).join('');
    const incRows = incidents.map((inc,i) => `<tr style="background:${i%2?'#FAFCFE':'white'};">
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${inc.date}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;"><span style="background:${inc.type==='Safeguarding concern'?'#FEE2E2':inc.type==='Near miss'?'#FEF3C7':'#EEF2F8'};color:${inc.type==='Safeguarding concern'?'#991B1B':inc.type==='Near miss'?'#92400E':'#00264D'};padding:2px 7px;border-radius:6px;font-size:9px;font-weight:700;">${inc.type}</span></td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#00264D;">${inc.desc}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${inc.action}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${inc.status==='Open'?'#FEE2E2':'#D1FAE5'};color:${inc.status==='Open'?'#991B1B':'#065F46'};padding:2px 7px;border-radius:8px;font-size:9px;font-weight:700;">${inc.status}</span></td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${inc.reportedBy}</td>
    </tr>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Compliance Report — 1701 Sqn</title>
    <style>
      @page { size: A4 landscape; margin: 11mm 13mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:11px; }
      h3 { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:800; color:#00264D; text-transform:uppercase; letter-spacing:0.05em; margin:14px 0 6px; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;padding-bottom:10px;border-bottom:3px solid #00264D;">
      <tr>
        <td style="width:50px;"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg></td>
        <td style="padding-left:12px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">COMPLIANCE REPORT — H&amp;S · VETTING · INCIDENTS</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">As at ${today}</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:${overdue>0?'#991B1B':'#5A7090'};font-weight:${overdue>0?700:400};">Overdue checks: ${overdue}</div>
          <div style="font-size:10px;color:#5A7090;">Open incidents: ${incidents.filter(i=>i.status==='Open').length}</div>
        </td>
      </tr>
    </table>
    <h3>Health &amp; Safety Checks</h3>
    <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:16px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:7px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CATEGORY</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">TASK</th>
        <th style="padding:7px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">FREQ</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">LAST DONE</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">NEXT DUE</th>
        <th style="padding:7px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">STATUS</th>
      </tr></thead>
      <tbody>${checkRows}</tbody>
    </table>
    <h3>Staff Vetting &amp; DBS</h3>
    <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:16px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">NAME</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">ROLE</th>
        <th style="padding:7px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DBS TYPE</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">EXPIRES</th>
        <th style="padding:7px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DBS STATUS</th>
        <th style="padding:7px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">RVO</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SG TRAINING</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">REFS</th>
      </tr></thead>
      <tbody>${dbsRows}</tbody>
    </table>
    <h3>Incident Log</h3>
    <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:16px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DATE</th>
        <th style="padding:7px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">TYPE</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DESCRIPTION</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">ACTION TAKEN</th>
        <th style="padding:7px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">STATUS</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">REPORTED BY</th>
      </tr></thead>
      <tbody>${incRows}</tbody>
    </table>
    <div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      ${['Commanding Officer','Health & Safety Officer','Date'].map((l,i) => `
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${l}</div>
          <div style="font-size:11px;color:#00264D;margin-top:2px;">${i===0?'Sqn Ldr Harris':i===2?today:''}&nbsp;</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · AP 1919 · JSP 375 · Retain 3 years minimum (Health & Safety at Work Act 1974)
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Compliance Report printed', 'Compliance', `Printed by Sqn Ldr Harris on ${today}`);
    showToast('🖨️ Compliance report sent to printer');
  }

  const overdue = checks.filter(c => daysUntil(c.nextDue) < 0).length;
  const dueSoon = checks.filter(c => { const d = daysUntil(c.nextDue); return d >= 0 && d <= 7; }).length;
  const dbsIssues = STAFF.filter(s => daysUntil(s.dbsExp) < 90 || s.rvo === 'Pending' || s.ref !== 'Complete').length;
  const openInc = incidents.filter(i => i.status === 'Open').length;

  const TABS = [
    { id:'checks',     label:'H&S Checks' },
    { id:'dbs',        label:'Staff Vetting' },
    { id:'incidents',  label:'Incident Log' },
  ];

  return (
    <div style={{ maxWidth:900 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:26, fontWeight:800, color:navy }}>Compliance</div>
          <div style={{ fontSize:12, color:'#5A7090', marginTop:2 }}>H&amp;S checks · Staff vetting &amp; DBS · Incident log</div>
        </div>
        <button onClick={printComplianceReport}
          style={{ padding:'8px 16px', background:'white', color:navy, border:`1px solid #E5EAF2`, borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', flexShrink:0 }}>
          📄 Print Report
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Overdue checks', value:overdue, color:overdue>0?'#FEE2E2':'#D1FAE5', tc:overdue>0?'#991B1B':green },
          { label:'Due this week',  value:dueSoon, color:dueSoon>0?'#FEF3C7':'#D1FAE5', tc:dueSoon>0?'#92400E':green },
          { label:'Staff issues',   value:dbsIssues, color:dbsIssues>0?'#FEF3C7':'#D1FAE5', tc:dbsIssues>0?'#92400E':green },
          { label:'Open incidents', value:openInc, color:openInc>0?'#FEE2E2':'#D1FAE5', tc:openInc>0?'#991B1B':green },
        ].map(card => (
          <div key={card.label} style={{ background:'white', borderRadius:10, padding:'14px 16px', border:'1px solid #E5EAF2' }}>
            <div style={{ fontSize:24, fontWeight:800, color:card.tc, fontFamily:'Barlow Condensed,sans-serif' }}>{card.value}</div>
            <div style={{ fontSize:11, color:'#5A7090', marginTop:2 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:16, background:'white', padding:4, borderRadius:10, border:'1px solid #E5EAF2', width:'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)}
            style={{ padding:'7px 16px', borderRadius:7, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
              background: sub===t.id ? navy : 'transparent',
              color: sub===t.id ? 'white' : '#5A7090' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* H&S Checks */}
      {sub === 'checks' && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <div style={{ fontSize:11, color:'#5A7090', fontWeight:600 }}>Category:</div>
            {cats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                style={{ padding:'4px 10px', borderRadius:20, border:'1px solid', fontSize:11, fontWeight:600, cursor:'pointer',
                  borderColor: catFilter===c ? navy : '#D0D8E4',
                  background: catFilter===c ? navy : 'white',
                  color: catFilter===c ? 'white' : '#5A7090' }}>
                {c}
              </button>
            ))}
          </div>

          <div style={{ background:'white', borderRadius:12, border:'1px solid #E5EAF2', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#F4F7FB' }}>
                  {['Category','Task','Frequency','Last Done','Next Due','Status',''].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:'#5A7090', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredChecks.map((c, i) => {
                  const days = daysUntil(c.nextDue);
                  return (
                    <tr key={c.id} style={{ borderTop: i>0 ? '1px solid #F0F4F8' : 'none' }}>
                      <td style={{ padding:'11px 14px', color:'#5A7090', fontSize:11 }}>
                        <span style={{ background:'#EEF2F8', borderRadius:4, padding:'2px 6px' }}>{c.category}</span>
                      </td>
                      <td style={{ padding:'11px 14px', fontWeight:600, color:navy }}>{c.task}</td>
                      <td style={{ padding:'11px 14px', color:'#5A7090' }}>{c.freq}</td>
                      <td style={{ padding:'11px 14px', color:'#5A7090' }}>
                        <div>{c.lastDone}</div>
                        <div style={{ fontSize:10, color:'#8A9BB0' }}>{c.doneBy}</div>
                      </td>
                      <td style={{ padding:'11px 14px', color:'#5A7090' }}>{c.nextDue}</td>
                      <td style={{ padding:'11px 14px' }}><StatusPill days={days} /></td>
                      <td style={{ padding:'11px 14px' }}>
                        <button onClick={() => markDone(c.id)}
                          style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${green}`, background:'white', color:green, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                          ✓ Done
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Vetting / DBS */}
      {sub === 'dbs' && (
        <div>
          <div style={{ marginBottom:12, fontSize:12, color:'#5A7090' }}>
            All adult volunteers must hold a current Enhanced DBS, RVO clearance, and up-to-date safeguarding training per AP1919.
          </div>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #E5EAF2', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#F4F7FB' }}>
                  {['Name','Role','DBS Level','DBS Expires','DBS Status','RVO','Safeguard','References'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:'#5A7090', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STAFF.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: i>0 ? '1px solid #F0F4F8' : 'none' }}>
                    <td style={{ padding:'11px 14px', fontWeight:700, color:navy }}>{s.name}</td>
                    <td style={{ padding:'11px 14px', color:'#5A7090' }}>{s.role}</td>
                    <td style={{ padding:'11px 14px', color:'#5A7090' }}>{s.dbs}</td>
                    <td style={{ padding:'11px 14px', color:'#5A7090' }}>{s.dbsExp}</td>
                    <td style={{ padding:'11px 14px' }}><DbsPill exp={s.dbsExp} /></td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ fontWeight:700, color: s.rvo==='Cleared' ? green : s.rvo==='N/A' ? '#5A7090' : '#D97706' }}>{s.rvo}</span>
                    </td>
                    <td style={{ padding:'11px 14px', color:'#5A7090' }}>{s.safeguard}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ fontWeight:700, color: s.ref==='Complete' ? green : '#D97706' }}>{s.ref}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:12, padding:'10px 14px', background:'#FEF3C7', borderRadius:8, fontSize:11, color:'#92400E', border:'1px solid #FDE68A' }}>
            ⚠️ CI Sinclair's RVO clearance is pending and one reference is outstanding. They may not supervise cadets unsupervised until resolved.
          </div>
        </div>
      )}

      {/* Incident Log */}
      {sub === 'incidents' && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <div style={{ display:'flex', gap:4 }}>
              {incTypes.map(t => (
                <button key={t} onClick={() => setIncFilter(t)}
                  style={{ padding:'4px 10px', borderRadius:20, border:'1px solid', fontSize:11, fontWeight:600, cursor:'pointer',
                    borderColor: incFilter===t ? navy : '#D0D8E4',
                    background: incFilter===t ? navy : 'white',
                    color: incFilter===t ? 'white' : '#5A7090' }}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={() => setShowNewIncident(true)}
              style={{ marginLeft:'auto', padding:'7px 14px', borderRadius:8, border:'none', background:navy, color:'white', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              + Log Incident
            </button>
          </div>

          {showNewIncident && (
            <div style={{ background:'#EEF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:16, marginBottom:16 }}>
              <div style={{ fontWeight:700, color:navy, marginBottom:12, fontSize:13 }}>Log New Incident / Near Miss</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:11, color:'#5A7090', fontWeight:600, marginBottom:4 }}>Type</div>
                  <select value={newInc.type} onChange={e => setNewInc(p => ({...p, type:e.target.value}))}
                    style={{ width:'100%', padding:'7px 10px', border:'1px solid #D0D8E4', borderRadius:7, fontSize:12 }}>
                    {['Near miss','First aid','Safeguarding concern','Property damage','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#5A7090', fontWeight:600, marginBottom:4 }}>Reported by</div>
                  <select value={newInc.reportedBy} onChange={e => setNewInc(p => ({...p, reportedBy:e.target.value}))}
                    style={{ width:'100%', padding:'7px 10px', border:'1px solid #D0D8E4', borderRadius:7, fontSize:12 }}>
                    {['OC Harris','Flt Lt Baxter','CI Morrison','CI Sinclair','SSgt Fletcher'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop:10 }}>
                <div style={{ fontSize:11, color:'#5A7090', fontWeight:600, marginBottom:4 }}>Description *</div>
                <textarea value={newInc.desc} onChange={e => setNewInc(p => ({...p, desc:e.target.value}))} rows={3}
                  style={{ width:'100%', padding:'7px 10px', border:'1px solid #D0D8E4', borderRadius:7, fontSize:12, resize:'vertical', boxSizing:'border-box' }}
                  placeholder="What happened, where, who was involved…" />
              </div>
              <div style={{ marginTop:10 }}>
                <div style={{ fontSize:11, color:'#5A7090', fontWeight:600, marginBottom:4 }}>Immediate action taken</div>
                <input value={newInc.action} onChange={e => setNewInc(p => ({...p, action:e.target.value}))}
                  style={{ width:'100%', padding:'7px 10px', border:'1px solid #D0D8E4', borderRadius:7, fontSize:12, boxSizing:'border-box' }}
                  placeholder="e.g. First aid applied, area secured, parents notified…" />
              </div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button onClick={submitNewIncident}
                  style={{ padding:'8px 18px', borderRadius:8, border:'none', background:navy, color:'white', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  Submit
                </button>
                <button onClick={() => setShowNewIncident(false)}
                  style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #D0D8E4', background:'white', color:'#5A7090', fontSize:12, cursor:'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filteredInc.map(inc => (
              <div key={inc.id} style={{ background:'white', borderRadius:10, border:'1px solid #E5EAF2', padding:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                    background: inc.type==='Safeguarding concern' ? '#FEE2E2' : inc.type==='Near miss' ? '#FEF3C7' : '#EEF2F8',
                    color: inc.type==='Safeguarding concern' ? '#991B1B' : inc.type==='Near miss' ? '#92400E' : '#00264D' }}>
                    {inc.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize:11, color:'#5A7090' }}>{inc.date}</span>
                  <span style={{ fontSize:11, color:'#5A7090' }}>· {inc.reportedBy}</span>
                  <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                    background: inc.status==='Open' ? '#FEE2E2' : '#D1FAE5',
                    color: inc.status==='Open' ? '#991B1B' : '#065F46' }}>
                    {inc.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize:13, color:navy, fontWeight:600, marginBottom:6 }}>{inc.desc}</div>
                <div style={{ fontSize:12, color:'#5A7090' }}>
                  <span style={{ fontWeight:700 }}>Action: </span>{inc.action}
                </div>
                {inc.status === 'Open' && (
                  <div style={{ marginTop:10 }}>
                    <button onClick={() => closeIncident(inc.id)}
                      style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${green}`, background:'white', color:green, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                      ✓ Close Incident
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
