import { useState, useMemo } from 'react';

const navy = '#00264D', gold = '#C8A032';

const SEED_ENTRIES = [
  { id:'a001', ts:'2026-06-14T09:12:00', user:'OC Harris',       action:'Cadet register: Cdt Harper, J. profile updated — school details added', category:'Cadets' },
  { id:'a002', ts:'2026-06-14T08:47:00', user:'Flt Lt Baxter',   action:'Promotion recommended: Cdt Mitchell, S. → LCpl (two-officer auth pending)', category:'Promotions' },
  { id:'a003', ts:'2026-06-13T19:30:00', user:'OC Harris',       action:'Parade night attendance recorded: 7 present, 2 excused, 0 unexplained', category:'Parade' },
  { id:'a004', ts:'2026-06-13T18:55:00', user:'CI Morrison',     action:'AT application approved: Sgt Thomas, M. — Duke of Edinburgh Silver (2026-07-18)', category:'Training' },
  { id:'a005', ts:'2026-06-12T14:22:00', user:'OC Harris',       action:'Kit issued: Boots (patrol) — Cdt Mason, D. (size 8)', category:'Kit' },
  { id:'a006', ts:'2026-06-12T11:10:00', user:'Flt Lt Baxter',   action:'TG21 consent: Cdt Khan, A. — Summer Camp 2026 — SIGNED', category:'Consents' },
  { id:'a007', ts:'2026-06-11T17:44:00', user:'OC Harris',       action:'Applicant status changed: Ahmed, R. → Cadet (svc no. 2309441 allocated)', category:'Applicants' },
  { id:'a008', ts:'2026-06-11T14:00:00', user:'CI Morrison',     action:'AT application queried: Cdt Cooper, O. — incomplete medical form', category:'Training' },
  { id:'a009', ts:'2026-06-10T10:30:00', user:'OC Harris',       action:'Compliance: "Fire extinguisher inspection" marked complete', category:'Compliance' },
  { id:'a010', ts:'2026-06-10T09:15:00', user:'OC Harris',       action:'Badge awarded: Cdt Patel, E. — First Aid (auto via Bader)', category:'Promotions' },
  { id:'a011', ts:'2026-06-07T19:45:00', user:'OC Harris',       action:'Parade night attendance recorded: 8 present, 1 excused, 1 unexplained', category:'Parade' },
  { id:'a012', ts:'2026-06-05T16:20:00', user:'OC Harris',       action:'Incident logged: Near miss — power cut during ATC night exercise', category:'Compliance' },
  { id:'a013', ts:'2026-06-04T11:00:00', user:'Flt Lt Baxter',   action:'Promotion confirmed: Sgt Thomas, M. → FS (two-officer auth complete)', category:'Promotions' },
  { id:'a014', ts:'2026-06-03T14:30:00', user:'CI Morrison',     action:'Kit chased: Cdt Cooper, O. — Wedgewood No.2 jacket overdue return', category:'Kit' },
  { id:'a015', ts:'2026-06-01T09:00:00', user:'OC Harris',       action:'New applicant from RAFAC website: Brown, T. (2026-06-01 enquiry)', category:'Applicants' },
  { id:'a016', ts:'2026-05-30T18:00:00', user:'OC Harris',       action:'Cadet register: Cdt Wright, L. medical consent form received', category:'Cadets' },
  { id:'a017', ts:'2026-05-28T19:30:00', user:'Flt Lt Baxter',   action:'TG23 health form: Cdt Mason, D. — SIGNED', category:'Consents' },
  { id:'a018', ts:'2026-05-22T20:00:00', user:'Sgt Thomas, M.',  action:'Incident closed: Near miss — loose step near stores room; step repaired', category:'Compliance' },
  { id:'a019', ts:'2026-05-20T10:45:00', user:'CI Morrison',     action:'Course enrollment: Cdt Ahmed, R. — BTEC Aerospace (Wing, Sept 2026)', category:'Training' },
  { id:'a020', ts:'2026-05-15T14:00:00', user:'OC Harris',       action:'AT application approved: Cpl Mitchell, S. — Gliding Scholarship (2026-08-03)', category:'Training' },
];

const CATEGORIES = ['All', 'Cadets', 'Applicants', 'Parade', 'Consents', 'Kit', 'Training', 'Promotions', 'Compliance'];

const CAT_COLOR = {
  Cadets:     { bg:'#EEF2F8', color:'#00264D' },
  Applicants: { bg:'#EDE9FE', color:'#5B21B6' },
  Parade:     { bg:'#DCFCE7', color:'#166534' },
  Consents:   { bg:'#E0F2FE', color:'#075985' },
  Kit:        { bg:'#FEF9C3', color:'#854D0E' },
  Training:   { bg:'#FFE4E6', color:'#9F1239' },
  Promotions: { bg:'#FEF3C7', color:'#92400E' },
  Compliance: { bg:'#F0FDF4', color:'#065F46' },
};

function formatTs(ts) {
  const d = new Date(ts);
  const date = d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  return { date, time };
}

export default function AuditLog({ auditLog = [] }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');

  // merge seed + live entries (live entries come in as plain strings from addAudit)
  const allEntries = useMemo(() => {
    const live = auditLog.map((entry, i) => ({
      id: 'live-' + i,
      ts: entry.ts || new Date().toISOString(),
      user: entry.user || 'OC Harris',
      action: entry.action || entry,
      category: entry.category || 'General',
    }));
    return [...live, ...SEED_ENTRIES].sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [auditLog]);

  const users = useMemo(() => ['All', ...new Set(allEntries.map(e => e.user))], [allEntries]);

  const filtered = useMemo(() => allEntries.filter(e => {
    if (catFilter !== 'All' && e.category !== catFilter) return false;
    if (userFilter !== 'All' && e.user !== userFilter) return false;
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [allEntries, catFilter, userFilter, search]);

  function printAuditLog() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const catBg  = cat => { const c = CAT_COLOR[cat]; return c ? c.bg  : '#F4F7FB'; };
    const catClr = cat => { const c = CAT_COLOR[cat]; return c ? c.color : '#00264D'; };
    const rows = filtered.map((e,i) => {
      const { date, time } = formatTs(e.ts);
      return `<tr style="background:${i%2?'#FAFCFE':'white'};">
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;white-space:nowrap;font-size:10px;color:#5A7090;">${date}<br>${time}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;font-weight:700;color:#00264D;">${e.user}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${catBg(e.category)};color:${catClr(e.category)};padding:2px 7px;border-radius:10px;font-size:9px;font-weight:700;">${(e.category||'General').toUpperCase()}</span></td>
        <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#00264D;">${e.action}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Audit Log — 1701 Sqn</title>
    <style>
      @page { size: A4 landscape; margin: 11mm 13mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:11px; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;padding-bottom:10px;border-bottom:3px solid #00264D;">
      <tr>
        <td style="width:50px;"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg></td>
        <td style="padding-left:12px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">AUDIT LOG — GDPR-COMPLIANT ACTIVITY TRAIL</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">Printed ${today}${catFilter!=='All'?` · Category: ${catFilter}`:''}${userFilter!=='All'?` · User: ${userFilter}`:''}${search?` · Search: "${search}"`:''}
          </div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">Total entries: ${allEntries.length}</div>
          <div style="font-size:10px;color:#5A7090;">Filtered: ${filtered.length}</div>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;white-space:nowrap;">DATE / TIME</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">USER</th>
        <th style="padding:7px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CATEGORY</th>
        <th style="padding:7px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">ACTION</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:16px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — GDPR DPA 2018 · Audit records retained 6 years per AP 1919 · 1701 (Johnstone) Squadron ATC
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
  }

  function exportCsv() {
    const rows = [['Timestamp','User','Category','Action'],...filtered.map(e => [e.ts, e.user, e.category, `"${e.action.replace(/"/g,'""')}"`])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = '1701_audit_log.csv';
    a.click();
  }

  // group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      const date = e.ts.slice(0,10);
      if (!map[date]) map[date] = [];
      map[date].push(e);
    });
    return Object.entries(map).sort(([a],[b]) => b.localeCompare(a));
  }, [filtered]);

  return (
    <div style={{ maxWidth:900 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:26, fontWeight:800, color:navy }}>Audit Log</div>
          <div style={{ fontSize:12, color:'#5A7090', marginTop:2 }}>Full squadron activity trail · GDPR-compliant record</div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button onClick={printAuditLog}
            style={{ padding:'8px 14px', borderRadius:8, border:`1px solid #E5EAF2`, background:'white', color:navy, fontSize:12, fontWeight:700, cursor:'pointer' }}>
            🖨️ Print Log
          </button>
          <button onClick={exportCsv}
            style={{ padding:'8px 16px', borderRadius:8, border:`1px solid ${navy}`, background:'white', color:navy, fontSize:12, fontWeight:700, cursor:'pointer' }}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background:'white', borderRadius:12, border:'1px solid #E5EAF2', padding:'14px 16px', marginBottom:16 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search actions or users…"
            style={{ flex:1, minWidth:200, padding:'7px 12px', border:'1px solid #D0D8E4', borderRadius:8, fontSize:12 }} />
          <select value={userFilter} onChange={e => setUserFilter(e.target.value)}
            style={{ padding:'7px 10px', border:'1px solid #D0D8E4', borderRadius:8, fontSize:12 }}>
            {users.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', gap:4, marginTop:10, flexWrap:'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              style={{ padding:'3px 9px', borderRadius:20, border:'1px solid', fontSize:11, fontWeight:600, cursor:'pointer',
                borderColor: catFilter===c ? navy : '#D0D8E4',
                background: catFilter===c ? navy : 'white',
                color: catFilter===c ? 'white' : '#5A7090' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display:'flex', gap:12, marginBottom:16 }}>
        {[
          { label:'Total entries', value:allEntries.length },
          { label:'Filtered', value:filtered.length },
          { label:'Today', value:allEntries.filter(e => e.ts.startsWith('2026-06-14')).length },
          { label:'This week', value:allEntries.filter(e => e.ts >= '2026-06-08').length },
        ].map(s => (
          <div key={s.label} style={{ background:'white', borderRadius:8, padding:'10px 14px', border:'1px solid #E5EAF2', flex:1 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>{s.value}</div>
            <div style={{ fontSize:10, color:'#5A7090', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {grouped.length === 0 ? (
        <div style={{ textAlign:'center', color:'#5A7090', padding:40 }}>No entries match your filters</div>
      ) : grouped.map(([date, entries]) => (
        <div key={date} style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'#5A7090', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8,
            padding:'4px 10px', background:'#F4F7FB', borderRadius:6, display:'inline-block' }}>
            {new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}
          </div>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #E5EAF2', overflow:'hidden' }}>
            {entries.map((e, i) => {
              const { time } = formatTs(e.ts);
              const cc = CAT_COLOR[e.category] || { bg:'#F4F7FB', color:'#00264D' };
              return (
                <div key={e.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 16px',
                  borderTop: i > 0 ? '1px solid #F0F4F8' : 'none' }}>
                  <div style={{ fontSize:11, color:'#8A9BB0', fontVariantNumeric:'tabular-nums', minWidth:40, paddingTop:2 }}>{time}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20,
                        background:cc.bg, color:cc.color }}>
                        {e.category.toUpperCase()}
                      </span>
                      <span style={{ fontSize:11, color:'#5A7090', fontWeight:600 }}>{e.user}</span>
                    </div>
                    <div style={{ fontSize:12, color:navy }}>{e.action}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ textAlign:'center', fontSize:11, color:'#8A9BB0', padding:'16px 0' }}>
        🔒 Audit records are retained for 6 years per GDPR DPA 2018 · RAF Air Cadets AP1919
      </div>
    </div>
  );
}
