import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const SUBJECTS = [
  { id:'drill',      name:'Drill',         color:'#00264D' },
  { id:'air',        name:'Airmanship',    color:'#1E40AF' },
  { id:'nav',        name:'Navigation',    color:'#166534' },
  { id:'fieldcraft', name:'Fieldcraft',    color:'#92400E' },
  { id:'leadership', name:'Leadership',    color:'#7C3AED' },
  { id:'firstaid',   name:'First Aid',     color:'#991B1B' },
  { id:'comms',      name:'Radio Comms',   color:'#065F46' },
  { id:'band',       name:'Band Practice', color:'#C8A032' },
  { id:'community',  name:'Community',     color:'#5A7090' },
  { id:'assessment', name:'Assessment',    color:'#374151' },
  { id:'event',      name:'Event / AT',    color:'#BE185D' },
  { id:'admin',      name:'Admin / Social',color:'#6B7280' },
];

const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));

const PROGRAMME = [
  // Summer Term 2026
  { id:'w1',  date:'2026-04-17', label:'Parade Night',          term:'Summer 2026', subjects:['drill','air'],               lead:'Flt Lt Reid',     notes:'Term start. Uniform inspection. Airmanship Level 1 recap.' },
  { id:'w2',  date:'2026-04-24', label:'Parade Night',          term:'Summer 2026', subjects:['firstaid','leadership'],     lead:'CI Morrison',     notes:'Cadet First Aid assessment. Leadership Exercise 1 brief.' },
  { id:'w3',  date:'2026-05-01', label:'Parade Night',          term:'Summer 2026', subjects:['nav','fieldcraft'],          lead:'WO Pryce',         notes:'Map reading revision. Fieldcraft patrol techniques.' },
  { id:'w4',  date:'2026-05-08', label:'Parade Night',          term:'Summer 2026', subjects:['air','comms'],               lead:'Flt Lt Reid',     notes:'Airmanship Level 2. Radio procedure practical.' },
  { id:'w5',  date:'2026-05-15', label:'Parade Night',          term:'Summer 2026', subjects:['drill','band'],              lead:'SSgt Fletcher',   notes:'Remembrance rehearsal. Band focused second half.' },
  { id:'w6',  date:'2026-05-22', label:'Parade Night',          term:'Summer 2026', subjects:['leadership','assessment'],   lead:'CI Morrison',     notes:'Leadership Ex 1 debrief. Classification assessments.' },
  { id:'w7',  date:'2026-05-29', label:'Parade Night',          term:'Summer 2026', subjects:['nav','fieldcraft'],          lead:'WO Pryce',         notes:'Night navigation intro. Fieldcraft kit check for Tinto.' },
  { id:'w8',  date:'2026-06-05', label:'Navigation Exercise',   term:'Summer 2026', subjects:['nav','fieldcraft','event'],  lead:'WO Pryce',         notes:'Outdoor navigation exercise — Gleniffer Braes. Full kit required.' },
  { id:'w9',  date:'2026-06-12', label:'Parade Night',          term:'Summer 2026', subjects:['drill','admin'],             lead:'Sqn Ldr Harris',  notes:'Promotions board prep. Summer camp kit list issued. Admin evening.' },
  { id:'w10', date:'2026-06-19', label:'Parade Night',          term:'Summer 2026', subjects:['air','firstaid'],            lead:'Flt Lt Reid',     notes:'Airmanship Level 3 (Senior). First Aid revision for Summer Camp.' },
  { id:'w11', date:'2026-06-26', label:'Parade Night',          term:'Summer 2026', subjects:['band','community'],          lead:'SSgt Fletcher',   notes:'Band practice. Community project planning session.' },
  { id:'w12', date:'2026-07-03', label:'Parade Night',          term:'Summer 2026', subjects:['assessment','drill'],        lead:'Sqn Ldr Harris',  notes:'End of term assessments. Promotions parade.' },
  // Events
  { id:'e1',  date:'2026-06-27', label:'Silver Fieldcraft (WSW)', term:'Summer 2026', subjects:['event','fieldcraft'],     lead:'WO Pryce',         notes:'Tinto Hill, Lanarkshire. Thomas M, Harper J, Wright L attending.' },
  { id:'e2',  date:'2026-07-19', label:'Summer Camp 2026',       term:'Summer 2026', subjects:['event'],                   lead:'Sqn Ldr Harris',  notes:'RAF Woodvale, Merseyside. 26 Jul return. 4 cadets attending.' },
  { id:'e3',  date:'2026-08-03', label:'Gliding Scholarship',    term:'Summer 2026', subjects:['event','air'],             lead:'Flt Lt Reid',     notes:'Dalton Airfield, Yorkshire. Mitchell S, Patel E, Cooper O.' },
  // Autumn Term 2026
  { id:'w13', date:'2026-09-10', label:'Parade Night',           term:'Autumn 2026', subjects:['admin','drill'],           lead:'Sqn Ldr Harris',  notes:'Term start. New intake welcome. Uniform issue.' },
  { id:'w14', date:'2026-09-17', label:'Parade Night',           term:'Autumn 2026', subjects:['air','nav'],               lead:'Flt Lt Reid',     notes:'Airmanship Level 3 continuation. Navigation Level 2.' },
  { id:'w15', date:'2026-09-24', label:'Parade Night',           term:'Autumn 2026', subjects:['fieldcraft','leadership'], lead:'WO Pryce',         notes:'Fieldcraft intermediate. Leadership ex planning.' },
  { id:'pf1', date:'2026-09-20', label:'Civic Parade',           term:'Autumn 2026', subjects:['event','band','drill'],    lead:'Sqn Ldr Harris',  notes:'Johnstone Civic Parade. Full band. Parade uniform.' },
  { id:'pf2', date:'2026-11-08', label:'Remembrance Sunday',     term:'Autumn 2026', subjects:['event','band','drill'],    lead:'Sqn Ldr Harris',  notes:'Johnstone town centre. 1100 parade. Band + honour guard.' },
];

const TODAY = '2026-06-14';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
}

function getMonth(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { month:'long', year:'numeric' });
}

function isToday(dateStr) {
  return dateStr === TODAY;
}

function isPast(dateStr) {
  return dateStr < TODAY;
}

function getSessionType(session) {
  if (session.subjects.includes('event')) return 'event';
  if (session.label !== 'Parade Night') return 'at';
  return 'parade';
}

const TYPE_BADGE = {
  parade: { label:'Parade Night', bg:'#00264D',   color:'white'    },
  event:  { label:'Event / AT',   bg:'#C8A032',   color:'#00264D'  },
  at:     { label:'Activity',     bg:'#D4EDDA',   color:'#0F4020'  },
};

function SubjectPill({ id }) {
  const s = SUBJECT_MAP[id];
  if (!s) return null;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      background: s.color + '18',
      border: `1px solid ${s.color}40`,
      color: s.color,
      borderRadius:20, padding:'2px 8px', fontSize:11, fontWeight:700,
      whiteSpace:'nowrap',
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0, display:'inline-block' }} />
      {s.name}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px' }}>
      <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color }}>{value}</div>
    </div>
  );
}

export default function Programme({ showToast, addAudit }) {
  const [term, setTerm]       = useState('Summer 2026');
  const [view, setView]       = useState('list');   // 'list' | 'grid'
  const [selected, setSelected] = useState(null);   // session id

  const termSessions = PROGRAMME
    .filter(s => s.term === term)
    .sort((a, b) => a.date.localeCompare(b.date));

  const paradeCount  = termSessions.filter(s => !s.subjects.includes('event') && s.label === 'Parade Night').length;
  const eventCount   = termSessions.filter(s => s.subjects.includes('event')).length;
  const atCount      = termSessions.filter(s => s.subjects.includes('event') && !['Civic Parade','Remembrance Sunday'].includes(s.label)).length;
  const bandCount    = termSessions.filter(s => s.subjects.includes('band') || ['Civic Parade','Remembrance Sunday'].includes(s.label)).length;

  // group by month for grid view
  const byMonth = {};
  termSessions.forEach(s => {
    const m = getMonth(s.date);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(s);
  });

  function handleSelect(id) {
    setSelected(prev => prev === id ? null : id);
  }

  function handleAddNote() {
    showToast('Opening programme notes editor…');
    addAudit?.('Programme', 'Notes', `Opened notes editor for ${term}`);
  }

  function printTonightsProgramme() {
    const tonight = termSessions.find(s => !isPast(s.date) && !isToday(s.date)) || termSessions[0];
    if (!tonight) { showToast('No upcoming sessions found'); return; }
    const subRows = tonight.subjects.map(sid => {
      const s = SUBJECT_MAP[sid];
      if (!s) return '';
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #D0DCF0">
        <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${s.color};margin-right:8px;vertical-align:middle"></span>
        <strong>${s.name}</strong></td>
        <td style="padding:10px 14px;border-bottom:1px solid #D0DCF0;color:#5A7090">—</td>
        <td style="padding:10px 14px;border-bottom:1px solid #D0DCF0;font-family:monospace;font-size:11px;color:#5A7090">20 min</td>
      </tr>`;
    }).join('');
    const dateStr = formatDate(tonight.date);
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
      <title>Programme Card — ${dateStr}</title>
      <style>@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:Barlow,sans-serif;color:#0D1B2E;background:white;padding:24px 32px;font-size:12px;max-width:680px;margin:0 auto}
      .hdr{background:#00264D;color:white;padding:18px 24px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
      .t{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;letter-spacing:0.02em}
      .sub{font-size:10px;opacity:0.5;letter-spacing:0.08em;margin-top:3px}
      .date-pill{background:rgba(200,160,50,0.25);border:1px solid #C8A032;border-radius:8px;padding:8px 14px;text-align:center}
      .date-big{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#C8A032}
      .date-sub{font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px}
      table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:18px}
      th{background:#F4F7FB;padding:9px 14px;text-align:left;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;border-bottom:2px solid #D0DCF0}
      .roundel{width:46px;height:46px;border-radius:50%;background:conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,#c8102e 240deg 360deg);border:2px solid #C8A032;flex-shrink:0}
      .card{border:1.5px solid #D0DCF0;border-radius:8px;padding:12px 16px;margin-bottom:14px}
      .card-title{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#00264D;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px}
      @media print{body{padding:12px 16px}.hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head>
      <body>
      <div class="hdr">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="roundel"></div>
          <div><div class="t">1701 (JOHNSTONE) SQUADRON</div>
          <div class="sub">PARADE NIGHT PROGRAMME · WEST SCOTLAND SECTOR ATC</div></div>
        </div>
        <div class="date-pill">
          <div class="date-big">${dateStr}</div>
          <div class="date-sub">1900–2200 HRS</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Tonight's Session: ${tonight.label}</div>
        <div style="display:flex;gap:16px;font-size:12px;color:#5A7090">
          <span>👤 Instructor in Charge: <strong style="color:#0D1B2E">${tonight.lead}</strong></span>
          ${tonight.notes ? `<span>📋 ${tonight.notes}</span>` : ''}
        </div>
      </div>

      <table>
        <thead><tr><th>Subject</th><th>Activity detail</th><th>Time</th></tr></thead>
        <tbody>
          <tr style="background:#FFF8E7"><td style="padding:10px 14px;border-bottom:1px solid #D0DCF0" colspan="2"><strong>1900–1910 Fall-in, roll call, admin announcements</strong></td><td style="padding:10px 14px;border-bottom:1px solid #D0DCF0;font-family:monospace;font-size:11px">10 min</td></tr>
          ${subRows}
          <tr style="background:#FFF8E7"><td style="padding:10px 14px;border-bottom:1px solid #D0DCF0" colspan="2"><strong>2140–2200 Dismiss, kit away, parent collection</strong></td><td style="padding:10px 14px;border-bottom:1px solid #D0DCF0;font-family:monospace;font-size:11px">20 min</td></tr>
        </tbody>
      </table>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
        <div class="card">
          <div class="card-title">Safety reminders</div>
          <ul style="padding-left:16px;line-height:2;font-size:12px">
            <li>Fire exits: front door and rear fire exit</li>
            <li>Assembly point: car park on Station Road</li>
            <li>First aid kit: stores room, left shelf</li>
            <li>DSL on duty: OC Harris (07700 900001)</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-title">Staff on duty tonight</div>
          <ul style="list-style:none;padding:0;line-height:2;font-size:12px">
            <li>Sqn Ldr J. Harris — OC</li>
            <li>Plt Off P. Smith — Training Officer</li>
            <li>SSgt L. Fletcher — Band PI</li>
          </ul>
        </div>
      </div>

      <div style="border-top:1px solid #D0DCF0;padding-top:10px;display:flex;justify-content:space-between;font-size:9px;color:#9AACBF">
        <span>1701 (Johnstone) Sqn ATC · West Scotland Wing · RAFAC</span>
        <span>OFFICIAL · For staff use — not for public display</span>
      </div></body></html>`;
    const w = window.open('', '_blank', 'width=780,height=650');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
    showToast(`🖨️ Programme card for ${dateStr} — print dialog opening…`);
    addAudit?.(`Programme card printed — ${tonight.label}`, 'Programme');
  }

  function printTermProgramme() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const rows = termSessions.map((s,i) => {
      const past = isPast(s.date);
      const type = getSessionType(s);
      const badge = TYPE_BADGE[type];
      const subNames = s.subjects.map(sid => SUBJECT_MAP[sid]?.name || sid).join(', ');
      return `<tr style="background:${i%2?'#FAFCFE':'white'};opacity:${past?0.7:1};">
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;white-space:nowrap;font-weight:700;color:${past?'#5A7090':'#00264D'};">${formatDate(s.date)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;"><span style="background:${badge.bg};color:${badge.color};padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;">${s.label}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${subNames}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${s.lead}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#00264D;">${s.notes}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>${term} Programme — 1701 Sqn</title>
    <style>
      @page { size: A4 landscape; margin: 12mm 14mm }
      @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      body { font-family:'Barlow',sans-serif; color:#1A1A2E; margin:0; font-size:11px; }
    </style></head><body>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;padding-bottom:10px;border-bottom:3px solid #00264D;">
      <tr>
        <td style="width:50px;"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg></td>
        <td style="padding-left:12px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;">1701 (Johnstone) Squadron ATC</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">${term.toUpperCase()} TRAINING PROGRAMME</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">Printed ${today} · ${termSessions.length} sessions · Wing Inspection Ready</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">Parade nights: ${paradeCount}</div>
          <div style="font-size:10px;color:#5A7090;">Events / AT: ${eventCount}</div>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;white-space:nowrap;">DATE</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SESSION</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SUBJECTS</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">LEAD</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">NOTES</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      ${['Commanding Officer','Wing Training Officer','Date'].map((l,i) => `
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${l}</div>
          <div style="font-size:11px;color:#00264D;margin-top:2px;">${i===0?'Sqn Ldr Harris':i===2?today:''}&nbsp;</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · 1701 (Johnstone) Squadron ATC · West Scotland Wing · AP 1919
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.(`${term} programme printed`, 'Programme', `Printed by Sqn Ldr Harris on ${today}`);
    showToast(`🖨️ ${term} programme sent to printer`);
  }

  const TERMS = ['Summer 2026', 'Autumn 2026'];

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>
            Annual Training Programme
          </div>
          <div style={{ fontSize:12, color:muted, marginTop:2 }}>
            {term} · 1701 (Johnstone) Squadron · Wing Inspection Ready
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          {/* Term selector */}
          <div style={{ display:'flex', gap:0, border:`1.5px solid ${border}`, borderRadius:8, overflow:'hidden' }}>
            {TERMS.map(t => (
              <button key={t} onClick={() => { setTerm(t); setSelected(null); }}
                style={{
                  padding:'7px 16px', border:'none', cursor:'pointer',
                  fontFamily:'Barlow,sans-serif', fontSize:12, fontWeight: term===t ? 800 : 500,
                  background: term===t ? navy : 'white',
                  color: term===t ? 'white' : muted,
                  transition:'background 0.15s, color 0.15s',
                }}>
                {t}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div style={{ display:'flex', gap:0, border:`1.5px solid ${border}`, borderRadius:8, overflow:'hidden' }}>
            {[['list','List'],['grid','Grid']].map(([v,label]) => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  padding:'7px 14px', border:'none', cursor:'pointer',
                  fontFamily:'Barlow,sans-serif', fontSize:12, fontWeight: view===v ? 800 : 500,
                  background: view===v ? gold : 'white',
                  color: view===v ? navy : muted,
                }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={printTermProgramme}
            style={{ padding:'7px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
            📄 Print Term
          </button>
          <button onClick={printTonightsProgramme}
            style={{ padding:'7px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
            🖨️ Print card
          </button>
          <button onClick={handleAddNote}
            style={{ padding:'7px 16px', background:navy, color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>
            + Add Session
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
        <StatCard label="Parade Nights" value={paradeCount} color={navy} />
        <StatCard label="Events / AT" value={eventCount} color='#BE185D' />
        <StatCard label="Adventure Training" value={atCount} color='#166534' />
        <StatCard label="Band / Civic" value={bandCount} color='#C8A032' />
      </div>

      {/* TODAY banner */}
      {termSessions.some(s => isToday(s.date)) && (
        <div style={{
          background:'linear-gradient(90deg, #C8A032 0%, #E8C250 100%)',
          borderRadius:8, padding:'10px 16px', marginBottom:14,
          display:'flex', alignItems:'center', gap:10,
          border:`1.5px solid ${gold}`,
        }}>
          <span style={{ fontSize:18 }}>📅</span>
          <div>
            <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, fontSize:14 }}>
              PARADE NIGHT TONIGHT
            </span>
            {termSessions.filter(s => isToday(s.date)).map(s => (
              <span key={s.id} style={{ fontSize:12, color:navy, marginLeft:8 }}>
                {s.label} · {s.lead}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subject legend */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
        {SUBJECTS.map(s => (
          <span key={s.id} style={{
            display:'inline-flex', alignItems:'center', gap:4,
            background: s.color + '18', border:`1px solid ${s.color}40`,
            color: s.color, borderRadius:20, padding:'2px 8px', fontSize:10, fontWeight:700,
          }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:s.color, display:'inline-block' }} />
            {s.name}
          </span>
        ))}
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
          {termSessions.length === 0 && (
            <div style={{ padding:32, textAlign:'center', color:muted, fontSize:13 }}>No sessions planned for this term yet.</div>
          )}
          {termSessions.map((session, i) => {
            const today    = isToday(session.date);
            const past     = isPast(session.date);
            const open     = selected === session.id;
            const type     = getSessionType(session);
            const badge    = TYPE_BADGE[type];
            const isLast   = i === termSessions.length - 1;

            return (
              <div key={session.id}>
                {/* Row */}
                <div
                  onClick={() => handleSelect(session.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:0,
                    borderBottom: (open || isLast) ? 'none' : `1px solid ${border}`,
                    cursor:'pointer',
                    background: today ? '#FFFBEB' : open ? '#F8FAFF' : i % 2 === 0 ? 'white' : '#FAFCFE',
                    transition:'background 0.1s',
                    borderLeft: today ? `4px solid ${gold}` : past ? `4px solid ${border}` : `4px solid transparent`,
                    position:'relative',
                  }}>

                  {/* Date column */}
                  <div style={{ width:100, flexShrink:0, padding:'14px 12px 14px 16px' }}>
                    <div style={{
                      fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800,
                      color: today ? '#7A4A00' : past ? muted : navy,
                      whiteSpace:'nowrap',
                    }}>
                      {formatDate(session.date)}
                    </div>
                    {today && (
                      <div style={{
                        marginTop:3, display:'inline-block',
                        background:gold, color:navy,
                        fontSize:9, fontWeight:900, padding:'1px 6px', borderRadius:4,
                        letterSpacing:'0.08em', textTransform:'uppercase',
                      }}>
                        TODAY
                      </div>
                    )}
                    {past && !today && (
                      <div style={{ fontSize:9, color:muted, fontWeight:600, marginTop:2, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                        Done
                      </div>
                    )}
                  </div>

                  {/* Type badge */}
                  <div style={{ width:110, flexShrink:0, padding:'0 10px' }}>
                    <span style={{
                      display:'inline-block',
                      background:badge.bg, color:badge.color,
                      borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700,
                      whiteSpace:'nowrap',
                    }}>
                      {session.label !== 'Parade Night' ? session.label.length > 16 ? session.label.substring(0,16)+'…' : session.label : badge.label}
                    </span>
                  </div>

                  {/* Subject pills */}
                  <div style={{ flex:1, display:'flex', flexWrap:'wrap', gap:4, padding:'12px 8px' }}>
                    {session.subjects.map(sid => <SubjectPill key={sid} id={sid} />)}
                  </div>

                  {/* Lead */}
                  <div style={{ width:130, flexShrink:0, padding:'0 12px', fontSize:12, color:muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {session.lead}
                  </div>

                  {/* Notes preview */}
                  <div style={{ width:220, flexShrink:0, padding:'0 14px 0 0', fontSize:12, color: open ? navy : muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {session.notes}
                  </div>

                  {/* Chevron */}
                  <div style={{ width:32, flexShrink:0, textAlign:'center', fontSize:14, color:muted, paddingRight:8, transform: open ? 'rotate(90deg)' : 'none', transition:'transform 0.15s' }}>
                    ›
                  </div>
                </div>

                {/* Expanded detail panel */}
                {open && (
                  <div style={{
                    background: today ? '#FFFDF2' : '#F4F7FB',
                    borderTop:`1px solid ${border}`,
                    borderBottom: isLast ? 'none' : `1px solid ${border}`,
                    padding:'18px 20px 20px 20px',
                    borderLeft: today ? `4px solid ${gold}` : `4px solid transparent`,
                  }}>
                    <div style={{ display:'flex', gap:32, flexWrap:'wrap', marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Session</div>
                        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy }}>{session.label}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Date</div>
                        <div style={{ fontSize:14, fontWeight:700, color:navy }}>{formatDate(session.date)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Lead Instructor</div>
                        <div style={{ fontSize:14, fontWeight:700, color:navy }}>{session.lead}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Term</div>
                        <div style={{ fontSize:14, color:muted }}>{session.term}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Training Subjects</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {session.subjects.map(sid => <SubjectPill key={sid} id={sid} />)}
                      </div>
                    </div>

                    <div style={{ marginBottom:18 }}>
                      <div style={{ fontSize:10, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Session Notes</div>
                      <div style={{ fontSize:13, color:'#0D1B2E', lineHeight:1.6, background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        {session.notes}
                      </div>
                    </div>

                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => showToast(`Editing session: ${session.label} on ${formatDate(session.date)}`)}
                        style={{ padding:'7px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                        Edit Session
                      </button>
                      <button onClick={() => showToast(`Generating risk assessment for ${session.label}…`)}
                        style={{ padding:'7px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                        Risk Assessment
                      </button>
                      <button onClick={() => showToast(`Generating lesson plan for ${session.label}…`)}
                        style={{ padding:'7px 14px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                        Lesson Plan
                      </button>
                      {session.subjects.includes('event') && (
                        <button onClick={() => showToast(`Opening event admin pack for ${session.label}…`)}
                          style={{ padding:'7px 14px', background:gold, color:navy, border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                          Event Pack
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* GRID VIEW — month-by-month columns */}
      {view === 'grid' && (
        <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:8, alignItems:'flex-start' }}>
          {Object.entries(byMonth).map(([month, sessions]) => (
            <div key={month} style={{ minWidth:220, maxWidth:260, flex:'0 0 240px' }}>
              <div style={{
                fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800,
                color:navy, textTransform:'uppercase', letterSpacing:'0.08em',
                marginBottom:10, borderBottom:`2px solid ${border}`, paddingBottom:6,
              }}>
                {month}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {sessions.map(session => {
                  const today  = isToday(session.date);
                  const past   = isPast(session.date);
                  const type   = getSessionType(session);
                  const badge  = TYPE_BADGE[type];
                  const open   = selected === session.id;

                  return (
                    <div key={session.id}
                      onClick={() => handleSelect(session.id)}
                      style={{
                        background: today ? '#FFFBEB' : 'white',
                        border: `1.5px solid ${today ? gold : open ? navy : border}`,
                        borderLeft: today ? `4px solid ${gold}` : `4px solid ${badge.bg}`,
                        borderRadius:10, padding:'12px 13px',
                        cursor:'pointer',
                        transition:'border-color 0.15s, box-shadow 0.15s',
                        boxShadow: open ? `0 0 0 2px ${navy}22` : today ? `0 2px 8px ${gold}44` : 'none',
                        opacity: past && !today ? 0.65 : 1,
                      }}>
                      {/* Date + today badge */}
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                        <span style={{
                          fontFamily:'Barlow Condensed,sans-serif', fontSize:12, fontWeight:800,
                          color: today ? '#7A4A00' : muted, whiteSpace:'nowrap',
                        }}>
                          {formatDate(session.date)}
                        </span>
                        {today && (
                          <span style={{
                            background:gold, color:navy, fontSize:9, fontWeight:900,
                            padding:'1px 5px', borderRadius:4, letterSpacing:'0.08em', textTransform:'uppercase',
                          }}>
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Label */}
                      <div style={{
                        fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800,
                        color:navy, marginBottom:7, lineHeight:1.2,
                      }}>
                        {session.label}
                      </div>

                      {/* Subject pills (compact) */}
                      <div style={{ display:'flex', flexWrap:'wrap', gap:3, marginBottom:8 }}>
                        {session.subjects.map(sid => {
                          const s = SUBJECT_MAP[sid];
                          return s ? (
                            <span key={sid} style={{
                              display:'inline-flex', alignItems:'center', gap:3,
                              background: s.color + '18', color:s.color,
                              borderRadius:20, padding:'1px 6px', fontSize:10, fontWeight:700,
                            }}>
                              <span style={{ width:5, height:5, borderRadius:'50%', background:s.color, display:'inline-block' }} />
                              {s.name}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {/* Lead */}
                      <div style={{ fontSize:11, color:muted }}>{session.lead}</div>

                      {/* Expanded notes inline */}
                      {open && (
                        <div style={{
                          marginTop:10, paddingTop:10, borderTop:`1px solid ${border}`,
                          fontSize:12, color:'#0D1B2E', lineHeight:1.55,
                        }}>
                          {session.notes}
                          <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
                            <button onClick={e => { e.stopPropagation(); showToast(`Editing: ${session.label}`); }}
                              style={{ padding:'4px 10px', background:navy, color:'white', border:'none', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer' }}>
                              Edit
                            </button>
                            {session.subjects.includes('event') && (
                              <button onClick={e => { e.stopPropagation(); showToast(`Event pack: ${session.label}`); }}
                                style={{ padding:'4px 10px', background:gold, color:navy, border:'none', borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer' }}>
                                Event Pack
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer hint */}
      <div style={{ fontSize:11, color:muted, marginTop:16, display:'flex', gap:16, flexWrap:'wrap' }}>
        <span>Click any session to expand full details.</span>
        <span>Sessions with a gold left border fall today.</span>
        <span>Faded rows are past sessions.</span>
        <span>Data reflects {term} as of {formatDate(TODAY)}.</span>
      </div>
    </div>
  );
}
