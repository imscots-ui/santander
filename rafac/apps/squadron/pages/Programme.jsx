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
