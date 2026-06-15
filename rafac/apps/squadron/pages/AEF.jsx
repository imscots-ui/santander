import { useState } from 'react';

// ── Palette ────────────────────────────────────────────────────────────────

const navy  = '#00264D';
const gold  = '#C8A032';
const muted = '#5A7090';
const border = '#D0DCF0';

// ── Seed data ──────────────────────────────────────────────────────────────

const FLYERS = [
  { id:'c01', name:'Mitchell, S', rank:'Cpl',  aef:2, gif:3, scholarship:'Blue Wings', lastFlight:'2026-03-14', gsNominee:true,  notes:'Blue Wings awarded Mar 2026. GS nominee 2026.' },
  { id:'c02', name:'Thomas, M',  rank:'Sgt',  aef:2, gif:1, scholarship:'GS',         lastFlight:'2025-11-02', gsNominee:false, notes:'GS in progress — 7/10 flights complete.' },
  { id:'c03', name:'Ahmed, R',   rank:'LCpl', aef:1, gif:1, scholarship:null,          lastFlight:'2025-09-20', gsNominee:false, notes:'1 AEF slot remaining this year.' },
  { id:'c04', name:'Harper, J',  rank:'Cdt',  aef:0, gif:0, scholarship:null,          lastFlight:null,         gsNominee:false, notes:'Application incomplete — check profile.' },
  { id:'c05', name:'Khan, A',    rank:'Cdt',  aef:1, gif:0, scholarship:null,          lastFlight:'2025-06-10', gsNominee:false, notes:'GIF booking pending.' },
  { id:'c06', name:'Wright, L',  rank:'Cdt',  aef:0, gif:0, scholarship:null,          lastFlight:null,         gsNominee:false, notes:'No flights yet — nominate for AEF.' },
  { id:'c07', name:'Patel, E',   rank:'Cdt',  aef:1, gif:0, scholarship:null,          lastFlight:'2025-10-04', gsNominee:false, notes:'' },
];

const WING_QUOTA = {
  aef: { allocated:8,  used:7 },
  gif: { allocated:6,  used:5 },
  gs:  { allocated:2,  used:1 },
  fs:  { allocated:1,  used:0 },
};

const AIRCRAFT_OPTS = ['Grob Tutor', 'Grob Prefect', 'Vigilant T1', 'Viking T1', 'Other'];
const FLIGHT_TYPE_OPTS = ['AEF', 'GIF', 'GS Flight', 'FS Flight'];
const SCHOL_OPTS = ['', 'Blue Wings', 'GS', 'FS'];

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(ds) {
  if (!ds) return 'Never';
  const d = new Date(ds + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function scholStyle(s) {
  if (s === 'Blue Wings') return { background: '#1E40AF', color: 'white' };
  if (s === 'GS')         return { background: '#166534', color: 'white' };
  if (s === 'FS')         return { background: '#C8A032', color: '#00264D' };
  return null;
}

// ── Small shared components ────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #D0DCF0',
      borderRadius: 10,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Badge({ label, bg, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: 'Barlow Condensed, sans-serif',
      letterSpacing: '0.04em',
      background: bg,
      color,
    }}>
      {label}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    'Wing Submitted': { bg: '#D1FAE5', color: '#166534' },
    'Draft':          { bg: '#FEF3C7', color: '#92400E' },
    'Approved':       { bg: '#BFDBFE', color: '#1E40AF' },
    'Rejected':       { bg: '#FEE2E2', color: '#DC2626' },
  };
  const s = map[status] || map['Draft'];
  return <Badge label={status} bg={s.bg} color={s.color} />;
}

function ProgressBar({ used, allocated }) {
  const pct = allocated === 0 ? 0 : Math.min(100, Math.round((used / allocated) * 100));
  const remaining = allocated - used;
  const barColor = remaining === 0 ? '#DC2626' : remaining === 1 ? '#D97706' : '#166534';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12, color: muted }}>
        <span>{used} used of {allocated} allocated</span>
        <span style={{ fontWeight: 700, color: barColor }}>{remaining} remaining</span>
      </div>
      <div style={{ height: 8, borderRadius: 6, background: '#E9EEF6', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 6, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      color: muted,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      fontFamily: 'Barlow Condensed, sans-serif',
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AEF({ showToast, addAudit }) {
  // ── All state at the top ─────────────────────────────────────────────────
  const [tab, setTab]             = useState('register');
  const [flyers, setFlyers]       = useState(FLYERS);
  const [expandedId, setExpandedId] = useState(null);
  const [flightLog, setFlightLog] = useState([]);
  const [logForm, setLogForm]     = useState({
    cadetId: 'c01', type: 'AEF', date: '2026-06-14',
    aircraft: 'Grob Tutor', location: '', duration: '', notes: '',
  });
  const [nominations, setNominations] = useState([
    { id:'n1', cadetId:'c01', type:'GS', status:'Wing Submitted', submitted:'2026-04-10', justification:'Exceptional aptitude, Blue Wings holder.' },
  ]);
  const [nomForm, setNomForm]         = useState({ cadetId: '', type: 'GS', justification: '' });
  const [showNomForm, setShowNomForm] = useState(false);

  // Per-row edit buffers (not in spec state but needed for expanded panel editing)
  const [editNotes, setEditNotes]   = useState({});
  const [editSchol, setEditSchol]   = useState({});

  // Wing quota (mutable as flights are logged)
  const [quota, setQuota] = useState(WING_QUOTA);

  // ── Computed stats ───────────────────────────────────────────────────────

  const totalAEF     = flyers.reduce((s, f) => s + f.aef, 0);
  const totalGIF     = flyers.reduce((s, f) => s + f.gif, 0);
  const scholHolders = flyers.filter(f => f.scholarship !== null).length;
  const noFlights    = flyers.filter(f => f.aef + f.gif === 0).length;

  // ── Shared style helpers ─────────────────────────────────────────────────

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1.5px solid ${border}`,
    borderRadius: 7,
    fontFamily: 'Barlow, sans-serif',
    fontSize: 14,
    color: navy,
    background: 'white',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: muted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'Barlow Condensed, sans-serif',
    display: 'block',
    marginBottom: 5,
  };

  const smallBtnStyle = {
    background: navy,
    color: 'white',
    border: 'none',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    cursor: 'pointer',
    marginLeft: 6,
    fontFamily: 'Barlow Condensed, sans-serif',
    letterSpacing: '0.03em',
  };

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleAEFIncrement(flyer) {
    setFlyers(prev => prev.map(f =>
      f.id === flyer.id ? { ...f, aef: f.aef + 1, lastFlight: '2026-06-14' } : f
    ));
    setQuota(prev => ({ ...prev, aef: { ...prev.aef, used: prev.aef.used + 1 } }));
    addAudit && addAudit(`AEF logged for ${flyer.rank} ${flyer.name}`, 'Training');
    showToast && showToast(`AEF logged for ${flyer.name}`);
  }

  function handleGIFIncrement(flyer) {
    setFlyers(prev => prev.map(f =>
      f.id === flyer.id ? { ...f, gif: f.gif + 1, lastFlight: '2026-06-14' } : f
    ));
    setQuota(prev => ({ ...prev, gif: { ...prev.gif, used: prev.gif.used + 1 } }));
    addAudit && addAudit(`GIF logged for ${flyer.rank} ${flyer.name}`, 'Training');
    showToast && showToast(`GIF logged for ${flyer.name}`);
  }

  function handleRowSave(flyer) {
    const newSchol = editSchol[flyer.id] !== undefined ? (editSchol[flyer.id] || null) : flyer.scholarship;
    const newNotes = editNotes[flyer.id] !== undefined ? editNotes[flyer.id] : flyer.notes;
    setFlyers(prev => prev.map(f =>
      f.id === flyer.id ? { ...f, scholarship: newSchol, notes: newNotes } : f
    ));
    addAudit && addAudit(`Flying record updated: ${flyer.rank} ${flyer.name}`, 'Training');
    showToast && showToast(`Record saved for ${flyer.name}`);
    setEditSchol(prev => { const n = { ...prev }; delete n[flyer.id]; return n; });
    setEditNotes(prev => { const n = { ...prev }; delete n[flyer.id]; return n; });
  }

  function handleLogFlight(e) {
    e.preventDefault();
    const { cadetId, type, date, aircraft, location, duration, notes } = logForm;
    if (!cadetId) { showToast && showToast('Please select a cadet.'); return; }
    if (!location.trim()) { showToast && showToast('Please enter a location.'); return; }
    const flyer = flyers.find(f => f.id === cadetId);
    const entry = {
      id: `fl${Date.now()}`,
      cadetId,
      cadetName: flyer ? `${flyer.rank} ${flyer.name}` : cadetId,
      type, date, aircraft,
      location: location.trim(),
      duration: duration ? Number(duration) : null,
      notes: notes.trim(),
    };
    setFlightLog(prev => [entry, ...prev]);

    if (type === 'AEF') {
      setFlyers(prev => prev.map(f =>
        f.id === cadetId ? { ...f, aef: f.aef + 1, lastFlight: date } : f
      ));
      setQuota(prev => ({ ...prev, aef: { ...prev.aef, used: prev.aef.used + 1 } }));
    } else if (type === 'GIF') {
      setFlyers(prev => prev.map(f =>
        f.id === cadetId ? { ...f, gif: f.gif + 1, lastFlight: date } : f
      ));
      setQuota(prev => ({ ...prev, gif: { ...prev.gif, used: prev.gif.used + 1 } }));
    }

    addAudit && addAudit(
      `Flight logged: ${flyer ? flyer.name : cadetId} — ${type} at ${location.trim()}`,
      'Training'
    );
    showToast && showToast(`Flight logged: ${flyer ? flyer.name : cadetId} — ${type}`);
    setLogForm({ cadetId: 'c01', type: 'AEF', date: '2026-06-14', aircraft: 'Grob Tutor', location: '', duration: '', notes: '' });
  }

  function handleNominate(e) {
    e.preventDefault();
    const { cadetId, type, justification } = nomForm;
    if (!cadetId) { showToast && showToast('Please select a cadet.'); return; }
    if (!justification.trim()) { showToast && showToast('Please enter a justification.'); return; }
    const flyer = flyers.find(f => f.id === cadetId);
    const nom = {
      id: `n${Date.now()}`,
      cadetId,
      type,
      status: 'Draft',
      submitted: '2026-06-14',
      justification: justification.trim(),
    };
    setNominations(prev => [...prev, nom]);
    addAudit && addAudit(`${type} nomination created: ${flyer ? flyer.name : cadetId}`, 'Training');
    showToast && showToast(`${type} nomination submitted for ${flyer ? flyer.name : cadetId}`);
    setNomForm({ cadetId: '', type: 'GS', justification: '' });
    setShowNomForm(false);
  }

  // ── Tab: Flights Register ────────────────────────────────────────────────

  function renderRegister() {
    return (
      <div>
        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'AEF Flights (Year)',    value: totalAEF,     color: navy },
            { label: 'GIF Flights (Year)',    value: totalGIF,     color: '#1B6B3A' },
            { label: 'Scholarship Holders',   value: scholHolders, color: '#7A4A00' },
            { label: 'No Flights Yet',        value: noFlights,    color: '#8B1A1A' },
          ].map(({ label, value, color }) => (
            <Card key={label} style={{ padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 32, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</div>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1.2fr 2fr',
            padding: '10px 16px',
            borderBottom: `1.5px solid ${border}`,
            gap: 8,
          }}>
            {['Cadet', 'AEF', 'GIF', 'Scholarship', 'Last Flight', 'Notes'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>{h}</div>
            ))}
          </div>

          {flyers.map((flyer, idx) => {
            const isExpanded = expandedId === flyer.id;
            const isLast = idx === flyers.length - 1;
            const ss = scholStyle(flyer.scholarship);

            return (
              <div key={flyer.id}>
                {/* Main row */}
                <div
                  onClick={() => setExpandedId(prev => prev === flyer.id ? null : flyer.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1.2fr 2fr',
                    padding: '11px 16px',
                    gap: 8,
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isExpanded ? '#F6F9FF' : 'white',
                    borderBottom: (isExpanded || isLast) ? 'none' : `1px solid ${border}`,
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Rank + name */}
                  <div>
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 700, color: muted, marginRight: 6 }}>{flyer.rank}</span>
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 14, fontWeight: 800, color: navy }}>{flyer.name}</span>
                  </div>

                  {/* AEF count + button */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: navy, minWidth: 18 }}>{flyer.aef}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleAEFIncrement(flyer); }}
                      style={smallBtnStyle}
                      title="Log AEF flight"
                    >+AEF</button>
                  </div>

                  {/* GIF count + button */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#1B6B3A', minWidth: 18 }}>{flyer.gif}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleGIFIncrement(flyer); }}
                      style={smallBtnStyle}
                      title="Log GIF flight"
                    >+GIF</button>
                  </div>

                  {/* Scholarship badge */}
                  <div>
                    {ss
                      ? <Badge label={flyer.scholarship} bg={ss.background} color={ss.color} />
                      : <span style={{ color: muted, fontSize: 13 }}>—</span>
                    }
                  </div>

                  {/* Last flight */}
                  <div style={{ fontSize: 13, color: flyer.lastFlight ? navy : muted }}>
                    {fmtDate(flyer.lastFlight)}
                  </div>

                  {/* Notes snippet */}
                  <div style={{ fontSize: 12, color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {flyer.notes || '—'}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    borderTop: `1px solid ${border}`,
                    borderBottom: isLast ? 'none' : `1px solid ${border}`,
                    background: '#F6F9FF',
                    padding: '18px 20px',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      {/* Left: flight summary + scholarship */}
                      <div>
                        <SectionLabel>Flight Summary</SectionLabel>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                          {[
                            { label: 'AEF', value: flyer.aef, color: navy },
                            { label: 'GIF', value: flyer.gif, color: '#1B6B3A' },
                          ].map(({ label, value, color }) => (
                            <div key={label} style={{ background: 'white', border: `1px solid ${border}`, borderRadius: 8, padding: '8px 18px', textAlign: 'center', minWidth: 70 }}>
                              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 800, color }}>{value}</div>
                              <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{label}</div>
                            </div>
                          ))}
                          <div style={{ background: 'white', border: `1px solid ${border}`, borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 14, fontWeight: 800, color: navy }}>{fmtDate(flyer.lastFlight)}</div>
                            <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>Last Flight</div>
                          </div>
                        </div>

                        <SectionLabel>Scholarship / Award</SectionLabel>
                        <select
                          value={editSchol[flyer.id] !== undefined ? editSchol[flyer.id] : (flyer.scholarship || '')}
                          onChange={e => setEditSchol(prev => ({ ...prev, [flyer.id]: e.target.value }))}
                          onClick={e => e.stopPropagation()}
                          style={{ ...inputStyle, marginBottom: 0 }}
                        >
                          {SCHOL_OPTS.map(o => <option key={o} value={o}>{o || 'None'}</option>)}
                        </select>
                      </div>

                      {/* Right: notes */}
                      <div>
                        <SectionLabel>Notes</SectionLabel>
                        <textarea
                          value={editNotes[flyer.id] !== undefined ? editNotes[flyer.id] : flyer.notes}
                          onChange={e => setEditNotes(prev => ({ ...prev, [flyer.id]: e.target.value }))}
                          onClick={e => e.stopPropagation()}
                          rows={5}
                          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Barlow, sans-serif' }}
                          placeholder="Notes about this cadet's flying activity…"
                        />
                      </div>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); handleRowSave(flyer); }}
                      style={{
                        padding: '8px 22px',
                        background: navy,
                        color: 'white',
                        border: 'none',
                        borderRadius: 7,
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '0.03em',
                      }}
                    >Save Changes</button>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  // ── Tab: Log Flight ──────────────────────────────────────────────────────

  function renderLog() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Form */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 800, color: navy, marginBottom: 18 }}>Record a New Flight</div>
          <form onSubmit={handleLogFlight}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Cadet</label>
              <select
                value={logForm.cadetId}
                onChange={e => setLogForm(f => ({ ...f, cadetId: e.target.value }))}
                style={inputStyle}
                required
              >
                <option value="">— Select cadet —</option>
                {flyers.map(f => <option key={f.id} value={f.id}>{f.rank} {f.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Flight Type</label>
              <select
                value={logForm.type}
                onChange={e => setLogForm(f => ({ ...f, type: e.target.value }))}
                style={inputStyle}
              >
                {FLIGHT_TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={logForm.date}
                onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Aircraft</label>
              <select
                value={logForm.aircraft}
                onChange={e => setLogForm(f => ({ ...f, aircraft: e.target.value }))}
                style={inputStyle}
              >
                {AIRCRAFT_OPTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                value={logForm.location}
                onChange={e => setLogForm(f => ({ ...f, location: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. RAF Leuchars"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Duration (minutes)</label>
              <input
                type="number"
                value={logForm.duration}
                onChange={e => setLogForm(f => ({ ...f, duration: e.target.value }))}
                style={inputStyle}
                placeholder="45"
                min={0}
                max={480}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                value={logForm.notes}
                onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Barlow, sans-serif' }}
                placeholder="Any observations, first solo, crew, etc."
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px 0',
                background: navy,
                color: 'white',
                border: 'none',
                borderRadius: 7,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >Log Flight</button>
          </form>
        </Card>

        {/* Recent logged flights */}
        <div>
          <SectionLabel>Flights Logged This Session</SectionLabel>
          {flightLog.length === 0 ? (
            <Card style={{ padding: 24, textAlign: 'center', color: muted }}>
              <div style={{ fontSize: 14 }}>No flights logged yet this session.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Use the form to record a new flight.</div>
            </Card>
          ) : (
            <Card>
              {flightLog.map((fl, idx) => (
                <div
                  key={fl.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: idx === flightLog.length - 1 ? 'none' : `1px solid ${border}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, color: navy, fontFamily: 'Barlow Condensed, sans-serif', fontSize: 15 }}>{fl.cadetName}</div>
                    <Badge label={fl.type} bg="#EAF4FF" color={navy} />
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginBottom: 2 }}>
                    {fmtDate(fl.date)} · {fl.aircraft} · {fl.location}
                    {fl.duration ? ` · ${fl.duration} min` : ''}
                  </div>
                  {fl.notes && (
                    <div style={{ fontSize: 12, color: '#3B5270', fontStyle: 'italic' }}>{fl.notes}</div>
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ── Tab: Wing Quota ──────────────────────────────────────────────────────

  function renderQuota() {
    const items = [
      { key: 'aef', label: 'AEF Slots',       description: 'Air Experience Flights — Grob Tutor / Grob Prefect', color: navy },
      { key: 'gif', label: 'GIF Slots',        description: 'Gliding Induction Flights — Volunteer Gliding Squadron', color: '#1B6B3A' },
      { key: 'gs',  label: 'GS Nominations',   description: 'Gliding Scholarship nominations forwarded to Wing', color: '#7A4A00' },
      { key: 'fs',  label: 'FS Nominations',   description: 'Flying Scholarship nominations forwarded to Wing', color: '#4A007A' },
    ];

    return (
      <div>
        {/* Intro */}
        <Card style={{ padding: '14px 18px', marginBottom: 20, background: '#F6F9FF', borderColor: '#C4D4EF' }}>
          <div style={{ fontSize: 14, color: navy, lineHeight: 1.65 }}>
            <strong>Wing Quota System:</strong> Wing HQ allocates flying slots annually across West Scotland Sector squadrons. AEF and GIF slots are strictly quota-limited — once exhausted, no further bookings can be made until reallocation for the following year. GS and FS nominations are subject to Wing and national selection processes.
          </div>
        </Card>

        {/* Quota cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
          {items.map(item => {
            const q = quota[item.key];
            const remaining = q.allocated - q.used;
            let statusText = 'Slots available', statusBg = '#D1FAE5', statusColor = '#166534';
            if (remaining === 0) { statusText = 'Quota exhausted'; statusBg = '#FEE2E2'; statusColor = '#DC2626'; }
            else if (remaining === 1) { statusText = '1 slot remaining'; statusBg = '#FEF3C7'; statusColor = '#92400E'; }

            return (
              <Card key={item.key} style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 800, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{item.description}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 20,
                    background: statusBg, color: statusColor,
                    fontFamily: 'Barlow Condensed, sans-serif',
                    letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  }}>
                    {statusText}
                  </span>
                </div>
                <ProgressBar used={q.used} allocated={q.allocated} />
              </Card>
            );
          })}
        </div>

        {/* Session flight log */}
        <SectionLabel>Session Flight Log</SectionLabel>
        {flightLog.length === 0 ? (
          <Card style={{ padding: 20, textAlign: 'center', color: muted }}>
            <div style={{ fontSize: 14 }}>No flights logged in this session.</div>
          </Card>
        ) : (
          <Card>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 0.9fr 0.9fr 1.1fr 1.1fr 1.5fr',
              padding: '10px 16px',
              borderBottom: `1.5px solid ${border}`,
              gap: 8,
            }}>
              {['Cadet', 'Type', 'Date', 'Aircraft', 'Location', 'Notes'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>{h}</div>
              ))}
            </div>
            {flightLog.map((fl, idx) => (
              <div
                key={fl.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 0.9fr 0.9fr 1.1fr 1.1fr 1.5fr',
                  padding: '10px 16px',
                  gap: 8,
                  alignItems: 'center',
                  borderBottom: idx === flightLog.length - 1 ? 'none' : `1px solid ${border}`,
                }}
              >
                <div style={{ fontWeight: 700, color: navy, fontSize: 14, fontFamily: 'Barlow Condensed, sans-serif' }}>{fl.cadetName}</div>
                <Badge label={fl.type} bg="#EAF4FF" color={navy} />
                <div style={{ fontSize: 13, color: muted }}>{fmtDate(fl.date)}</div>
                <div style={{ fontSize: 13, color: navy }}>{fl.aircraft}</div>
                <div style={{ fontSize: 13, color: navy }}>{fl.location}</div>
                <div style={{ fontSize: 12, color: muted }}>{fl.notes || '—'}</div>
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  }

  // ── Tab: Nominations ─────────────────────────────────────────────────────

  function renderNominations() {
    return (
      <div>
        {/* Header */}
        <Card style={{ padding: '14px 18px', marginBottom: 20, background: '#F6F9FF', borderColor: '#C4D4EF' }}>
          <div style={{ fontSize: 14, color: navy, lineHeight: 1.65 }}>
            <strong>Scholarship Nominations:</strong> Gliding Scholarships (GS) and Flying Scholarships (FS) are nationally competitive awards allocated through Wing HQ. Squadron OCs submit nominations; Wing selects candidates for interview. Submit justifications early — Wing deadlines are typically March each year.
          </div>
        </Card>

        {/* Existing nominations list */}
        {nominations.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Current Nominations</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {nominations.map(nom => {
                const flyer = flyers.find(f => f.id === nom.cadetId);
                const ts = scholStyle(nom.type === 'GS' ? 'GS' : 'FS');
                return (
                  <Card key={nom.id} style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {flyer && (
                          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 15, color: navy }}>
                            {flyer.rank} {flyer.name}
                          </span>
                        )}
                        {ts && <Badge label={nom.type} bg={ts.background} color={ts.color} />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StatusPill status={nom.status} />
                        <span style={{ fontSize: 12, color: muted }}>Submitted {fmtDate(nom.submitted)}</span>
                        <button onClick={e => { e.stopPropagation(); const f = flyers.find(fl => fl.id === nom.cadetId); printNominationLetter(nom, f); }}
                          style={{ padding:'3px 10px', background:navy, color:'white', border:'none', borderRadius:5, fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
                          🖨️ Print Letter
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#3B5270', lineHeight: 1.55 }}>{nom.justification}</div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Nominate button */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setShowNomForm(v => !v)}
            style={{
              padding: '9px 20px',
              background: showNomForm ? '#E9EEF6' : navy,
              color: showNomForm ? navy : 'white',
              border: showNomForm ? `1.5px solid ${border}` : 'none',
              borderRadius: 7,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            {showNomForm ? 'Cancel' : '+ Nominate for Scholarship'}
          </button>
        </div>

        {/* Nomination form */}
        {showNomForm && (
          <Card style={{ padding: 22, marginBottom: 24, borderColor: '#C4D4EF' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 800, color: navy, marginBottom: 16 }}>New Scholarship Nomination</div>
            <form onSubmit={handleNominate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Cadet</label>
                  <select
                    value={nomForm.cadetId}
                    onChange={e => setNomForm(f => ({ ...f, cadetId: e.target.value }))}
                    style={inputStyle}
                    required
                  >
                    <option value="">— Select cadet —</option>
                    {flyers.map(f => <option key={f.id} value={f.id}>{f.rank} {f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Scholarship Type</label>
                  <select
                    value={nomForm.type}
                    onChange={e => setNomForm(f => ({ ...f, type: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="GS">GS — Gliding Scholarship</option>
                    <option value="FS">FS — Flying Scholarship</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Justification</label>
                <textarea
                  value={nomForm.justification}
                  onChange={e => setNomForm(f => ({ ...f, justification: e.target.value }))}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Barlow, sans-serif' }}
                  placeholder="Explain why this cadet should receive a scholarship nomination. Include achievements, aptitude, attendance, and any relevant awards…"
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '9px 24px',
                  background: navy,
                  color: 'white',
                  border: 'none',
                  borderRadius: 7,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                }}
              >Submit Nomination</button>
            </form>
          </Card>
        )}

        {/* Criteria cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ padding: 20, borderColor: '#A7D7C0' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 15, fontWeight: 800, color: '#166534', marginBottom: 10 }}>GS — Gliding Scholarship Criteria</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13, color: '#3B5270', lineHeight: 1.75 }}>
              <li>Minimum Senior Cadet classification</li>
              <li>90%+ parade attendance over preceding 12 months</li>
              <li>Commanding Officer recommendation</li>
              <li>Completed GIF (Gliding Induction Flight)</li>
              <li>Nationally allocated — Wing nominates to HQAC</li>
              <li>10+ scholarship flights culminating in first solo; awards <strong>Blue Wings</strong> on completion</li>
            </ul>
          </Card>
          <Card style={{ padding: 20, borderColor: '#F5D8A0' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 15, fontWeight: 800, color: '#7A4A00', marginBottom: 10 }}>FS — Flying Scholarship Criteria</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13, color: '#3B5270', lineHeight: 1.75 }}>
              <li>Minimum Master Cadet recommended</li>
              <li>Strong academic record and motivation statement</li>
              <li>Medical clearance (Class 2 medical required)</li>
              <li>90%+ parade attendance over preceding 12 months</li>
              <li>Highly competitive — Wing interview required</li>
              <li>Leads toward PPL flying hours at civilian airfield</li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  // ── Print helpers ─────────────────────────────────────────────────────────

  function printFlyingRegister() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const cadetRows = flyers.map((f, i) => {
      const ss = f.scholarship ? `<span style="background:${f.scholarship==='Blue Wings'?'#1E40AF':f.scholarship==='GS'?'#166534':'#C8A032'};color:${f.scholarship==='FS'?'#00264D':'white'};padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700">${f.scholarship}</span>` : '—';
      return `<tr style="background:${i%2?'#fafcfe':'white'}">
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;font-weight:700;color:#00264D;font-size:12px">${f.rank} ${f.name}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:14px;color:#00264D">${f.aef}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;text-align:center;font-weight:800;font-size:14px;color:#1B6B3A">${f.gif}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;text-align:center">${ss}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090;text-align:center">${fmtDate(f.lastFlight)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090">${f.notes||'—'}</td>
      </tr>`;
    }).join('');

    const quotaItems = [
      { label:'AEF Slots', key:'aef', color:'#00264D' },
      { label:'GIF Slots', key:'gif', color:'#1B6B3A' },
      { label:'GS Nominations', key:'gs', color:'#7A4A00' },
      { label:'FS Nominations', key:'fs', color:'#4A007A' },
    ];
    const quotaBoxes = quotaItems.map(item => {
      const q = quota[item.key];
      const rem = q.allocated - q.used;
      const bc = rem===0?'#DC2626':rem===1?'#D97706':'#166534';
      return `<div style="flex:1;border-right:1px solid #D0DCF0;padding:12px 16px;text-align:center">
        <div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">${item.label}</div>
        <div style="font-family:monospace;font-size:20px;font-weight:800;color:${item.color}">${q.used}/${q.allocated}</div>
        <div style="font-size:11px;font-weight:700;color:${bc};margin-top:2px">${rem} remaining</div>
      </div>`;
    }).join('');

    const sessionLog = flightLog.length > 0 ? `
      <div style="margin-top:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D;border-bottom:2px solid #D0DCF0;padding-bottom:5px;margin-bottom:0">Session Flights Logged</div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:#F4F7FB"><th style="padding:7px 10px;text-align:left;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;border-bottom:2px solid #D0DCF0">Cadet</th><th style="padding:7px 10px;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;border-bottom:2px solid #D0DCF0">Type</th><th style="padding:7px 10px;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;border-bottom:2px solid #D0DCF0">Date</th><th style="padding:7px 10px;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;border-bottom:2px solid #D0DCF0">Aircraft</th><th style="padding:7px 10px;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;border-bottom:2px solid #D0DCF0">Location</th><th style="padding:7px 10px;font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;border-bottom:2px solid #D0DCF0">Notes</th></tr></thead>
          <tbody>${flightLog.map(fl=>`<tr><td style="padding:6px 10px;border-bottom:1px solid #E8ECF5;font-weight:600;font-size:12px">${fl.cadetName}</td><td style="padding:6px 10px;border-bottom:1px solid #E8ECF5;font-size:12px">${fl.type}</td><td style="padding:6px 10px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090">${fmtDate(fl.date)}</td><td style="padding:6px 10px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090">${fl.aircraft}</td><td style="padding:6px 10px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090">${fl.location}</td><td style="padding:6px 10px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090">${fl.notes||'—'}</td></tr>`).join('')}</tbody>
        </table>
      </div>` : '';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>AEF Flying Register — 1701 Sqn</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 landscape;margin:14mm 16mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#00264D;background:white;font-size:12px;margin:0}
.hdr{display:flex;align-items:center;gap:16px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:14px}
.sqn{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800}
.sub{font-size:11px;color:#5A7090;margin-top:2px}
.doc-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;margin-left:auto;text-align:right}
.quota-strip{display:flex;border:1.5px solid #D0DCF0;border-radius:8px;overflow:hidden;margin-bottom:14px}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.stat-box{background:#F5F8FF;border:1.5px solid #D0DCF0;border-radius:8px;padding:10px 14px;text-align:center}
.section-title{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;border-bottom:2px solid #D0DCF0;padding-bottom:5px;margin-bottom:0;letter-spacing:.03em}
table{width:100%;border-collapse:collapse}
thead tr{background:#F4F7FB}
th{padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#5A7090;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #D0DCF0}
th.c{text-align:center}
.footer{margin-top:14px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9.5px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="hdr">
  <span style="font-size:40px">✈️</span>
  <div><div class="sqn">1701 (Johnstone) Squadron ATC</div><div class="sub">Air Experience &amp; Flying Register · ${dateStr}</div></div>
  <div class="doc-title">AEF / GIF Flying Register</div>
</div>
<div class="stat-row">
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#00264D">${totalAEF}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">AEF Flights (Year)</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#1B6B3A">${totalGIF}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">GIF Flights (Year)</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#7A4A00">${scholHolders}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">Scholarship Holders</div></div>
  <div class="stat-box"><div style="font-family:monospace;font-size:22px;font-weight:800;color:#8B1A1A">${noFlights}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">No Flights Yet</div></div>
</div>
<div style="margin-bottom:12px"><div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#5A7090;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Wing Quota Status</div>
<div class="quota-strip">${quotaBoxes}</div></div>
<div class="section-title">Cadet Flying Records (${flyers.length} cadets)</div>
<table>
  <thead><tr><th>Cadet</th><th class="c">AEF</th><th class="c">GIF</th><th class="c">Scholarship</th><th class="c">Last Flight</th><th>Notes</th></tr></thead>
  <tbody>${cadetRows}</tbody>
</table>
${sessionLog}
<div class="footer">1701 (Johnstone) Squadron ATC · AEF/GIF Flying Register · OFFICIAL · ${dateStr} · West of Scotland Wing</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit && addAudit(`AEF flying register printed`, 'Training');
    showToast && showToast('📄 Flying register printing…');
  }

  function printNominationLetter(nom, flyer) {
    if (!flyer) return;
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const typeLabel = nom.type === 'GS' ? 'Gliding Scholarship' : 'Flying Scholarship';
    const evidence = [
      `AEF flights completed: ${flyer.aef}`,
      `GIF flights completed: ${flyer.gif}`,
      flyer.scholarship ? `Current scholarship / award: ${flyer.scholarship}` : null,
      flyer.lastFlight ? `Most recent flight: ${fmtDate(flyer.lastFlight)}` : null,
      flyer.gsNominee ? 'Previously identified as a GS Nominee by OC' : null,
    ].filter(Boolean).map(e => `<li style="margin-bottom:4px">${e}</li>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Nomination Letter — ${flyer.rank} ${flyer.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;400i;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:22mm 24mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#1a1a2e;background:white;font-size:13px;line-height:1.7;margin:0}
.letterhead{display:flex;align-items:flex-start;gap:16px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:24px}
.sqn-name{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#00264D}
.sqn-sub{font-size:11px;color:#5A7090;margin-top:2px}
.from-block{margin-bottom:18px;font-size:13px}
.from-block strong{display:block;margin-bottom:2px}
.re-line{background:#F4F7FB;border-left:4px solid #C8A032;padding:10px 16px;font-weight:700;color:#00264D;margin-bottom:20px;font-family:'Barlow Condensed',sans-serif;font-size:15px}
p{margin:0 0 14px 0}
ul{margin:6px 0 14px 0;padding-left:20px}
.sig-section{margin-top:32px}
.sig-line{border-bottom:1px solid #1a1a2e;height:40px;width:260px;margin-bottom:4px}
.sig-label{font-size:11px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.sig-name{font-size:13px;font-weight:700;color:#00264D;margin-top:2px}
.footer{margin-top:24px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9.5px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="letterhead">
  <span style="font-size:44px">✈️</span>
  <div>
    <div class="sqn-name">1701 (Johnstone) Squadron ATC</div>
    <div class="sqn-sub">Royal Air Force Air Cadets · Air Training Corps · West of Scotland Wing</div>
    <div class="sqn-sub" style="margin-top:4px">OC: Flt Lt A. McDonald · Johnstone Town Hall, Renfrewshire</div>
  </div>
  <div style="margin-left:auto;text-align:right;font-size:12px;color:#5A7090">${dateStr}</div>
</div>
<div class="from-block">
  <strong>From:</strong> Flt Lt A. McDonald, OC 1701 (Johnstone) Squadron ATC<br>
  <strong>To:</strong> Wing Commander (Cadets), West of Scotland Wing ATC
</div>
<div class="re-line">Re: ${typeLabel} Nomination — ${flyer.rank} ${flyer.name}, 1701 (Johnstone) Squadron</div>
<p>I write to nominate <strong>${flyer.rank} ${flyer.name}</strong> of 1701 (Johnstone) Squadron ATC for consideration for a ${typeLabel} (${nom.type}) place in the forthcoming allocation cycle.</p>
<p><strong>Justification:</strong><br>${nom.justification}</p>
<p><strong>Supporting evidence:</strong></p>
<ul>${evidence}</ul>
<p>I am satisfied that ${flyer.name.split(',')[0]} meets the criteria for a ${nom.type} nomination and I commend them highly to the Wing selection board. Please do not hesitate to contact me if you require further information or supporting documentation.</p>
<p>Yours sincerely,</p>
<div class="sig-section">
  <div class="sig-line"></div>
  <div class="sig-name">Flt Lt A. McDonald</div>
  <div class="sig-label">Officer Commanding</div>
  <div class="sig-label">1701 (Johnstone) Squadron ATC</div>
</div>
<div class="footer">1701-NOM-${nom.type}-${new Date().getFullYear()} · OFFICIAL · ${dateStr} · West of Scotland Wing ATC</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit && addAudit(`${nom.type} nomination letter printed: ${flyer.rank} ${flyer.name}`, 'Training');
    showToast && showToast(`🖨️ Nomination letter printing for ${flyer.name}…`);
  }

  // ── Tab bar ──────────────────────────────────────────────────────────────

  const TABS = [
    { id: 'register', label: 'Flights Register' },
    { id: 'log',      label: 'Log Flight' },
    { id: 'quota',    label: 'Wing Quota' },
    { id: 'nominations', label: 'Nominations' },
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: 'Barlow, sans-serif', padding: 24, maxWidth: 1120, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 22, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 900, color: navy, letterSpacing: '0.01em', lineHeight: 1.1 }}>
            Air Experience &amp; Flying
          </div>
          <div style={{ fontSize: 13, color: muted, marginTop: 3 }}>
            AEF · GIF · Gliding Scholarship · Flying Scholarship — 1701 (Johnstone) Squadron
          </div>
        </div>
        <button onClick={printFlyingRegister}
          style={{ padding:'8px 16px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif', flexShrink:0, marginTop:2 }}>
          📄 Print Register
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22, borderBottom: `1.5px solid ${border}` }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '9px 18px',
              background: tab === t.id ? navy : 'white',
              color: tab === t.id ? 'white' : muted,
              border: tab === t.id ? 'none' : `1.5px solid ${border}`,
              borderBottom: tab === t.id ? 'none' : `1.5px solid ${border}`,
              borderRadius: tab === t.id ? '7px 7px 0 0' : '7px 7px 0 0',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14,
              fontWeight: tab === t.id ? 800 : 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              marginBottom: -1.5,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'register'    && renderRegister()}
      {tab === 'log'         && renderLog()}
      {tab === 'quota'       && renderQuota()}
      {tab === 'nominations' && renderNominations()}
    </div>
  );
}
