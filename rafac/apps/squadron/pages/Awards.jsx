import { useState } from 'react';

const navy  = '#00264D';
const gold  = '#C8A032';
const muted = '#5A7090';
const border = '#D0DCF0';

const PAST_AWARDS = [
  { id: 'aw1', recipient: 'Thomas, M.', type: "Wing Commandant's Commendation", date: 'May 2026', presentedBy: 'Wg Cdr T. Elliot', notes: 'Exceptional leadership at JNCO Cadre', category: 'cadet' },
  { id: 'aw2', recipient: 'Mitchell, S.', type: 'Blue Wings', date: 'Mar 2026', presentedBy: 'VGS 661 CO', notes: 'First solo glide — Dalton Airfield', category: 'cadet' },
  { id: 'aw3', recipient: 'Harris, J. (Sqn Ldr)', type: 'Long Service Medal (12yr)', date: 'Jan 2026', presentedBy: 'Wing Commander', notes: '12 years continuous service', category: 'cfav' },
  { id: 'aw4', recipient: 'Ahmed, R.', type: 'Certificate of Merit', date: 'Nov 2025', presentedBy: 'Sqn Ldr Harris', notes: 'Outstanding performance — Bisley Regional', category: 'cadet' },
  { id: 'aw5', recipient: 'Thomas, M.', type: 'Certificate of Merit', date: 'Sep 2025', presentedBy: 'Sqn Ldr Harris', notes: 'Top cadet — Summer camp 2025', category: 'cadet' },
];

const NOMINATIONS = [
  { id: 'n1', nominee: 'Mitchell, S.', award: "Lord-Lieutenant's Cadet", status: 'draft', submittedTo: null, justification: 'Exceptional leadership, Blue Wings, Gold DofE in progress, community role model.', deadline: '30 Jun 2026', recommender: 'Sqn Ldr Harris' },
  { id: 'n2', nominee: 'Thomas, M.', award: "Wing Commandant's Commendation", status: 'submitted', submittedTo: 'Wing HQ', justification: 'Outstanding leadership at JNCO Cadre and Bisley shooting team.', deadline: '15 Jul 2026', recommender: 'Sqn Ldr Harris' },
];

const AWARD_TYPES = [
  "Lord-Lieutenant's Cadet",
  "Commandant's Commendation",
  "Wing Commandant's Commendation",
  "Lord-Lieutenant's Commendation",
  "Duke of Gloucester's Award",
  "Certificate of Merit",
  "Long Service Medal",
];

const CRITERIA = [
  {
    id: 'll-cadet',
    title: "Lord-Lieutenant's Cadet",
    who: 'OC nominates; countersigned by Wing Commander; selected by Lord-Lieutenant\'s Advisory Panel',
    eligibility: 'Senior classification or above; attendance ≥90%; demonstrated community contribution; leadership exemplar. One award per Lord-Lieutenant\'s area per year.',
    process: 'OC submits nomination to Wing HQ with supporting statement. Wing Commander countersigns and forwards to Lord-Lieutenant\'s office. Selection panel meets annually. Award presented at Lord-Lieutenant\'s parade or civic event.',
    precedents: 'Previous recipients: Cdt Thomas, M. (2024), Cdt Patel, A. (2023). Typically cadets with Blue Wings, DofE Gold, or significant community roles.',
  },
  {
    id: 'wcc',
    title: "Wing Commandant's Commendation",
    who: 'OC nominates to Wing HQ; awarded at Wing Board discretion',
    eligibility: 'No strict criteria — for exceptional contribution over a sustained period. Open to cadets and CFAVs. Awarded quarterly.',
    process: 'OC submits nomination form to Wing Admin Officer. Wing Board reviews at next quarterly meeting. Certificate and letter from Wing Commander issued on approval.',
    precedents: 'Recent example: Cdt Thomas, M. (May 2026) — JNCO Cadre leadership.',
  },
  {
    id: 'merit',
    title: 'Certificate of Merit',
    who: 'OC may award at own discretion; no Wing approval required',
    eligibility: 'Specific achievement such as best cadet at camp, competition result, community service, or exceptional parade performance.',
    process: 'OC completes certificate on RAFAC headed paper, signs, and presents. Log entry made in Bader. No upper limit on frequency.',
    precedents: 'Used for Bisley Regional performance (2025), Summer Camp top cadet (2025).',
  },
  {
    id: 'll-commendation',
    title: "Lord-Lieutenant's Commendation",
    who: 'OC contacts Wing Admin Officer; nomination submitted through Lord-Lieutenant\'s office',
    eligibility: 'Civilian honor for community contribution. Not RAFAC-specific. Recognises voluntary and public service beyond the squadron.',
    process: 'OC to contact Wing Admin Officer for current guidance and nomination proforma. Submission timelines vary by Lord-Lieutenant\'s area.',
    precedents: 'Rarely awarded — contact Wing HQ for historic examples.',
  },
  {
    id: 'lsm',
    title: 'Long Service Medal (CFAVs)',
    who: 'Wing Admin Officer coordinates; no nomination required',
    eligibility: 'Awarded automatically at 12, 18, and 24 years of qualifying service. CFAV must have maintained satisfactory annual assessments throughout.',
    process: 'Wing Admin Officer monitors service records and initiates award process. Medal and citation prepared by Wing. Presented at Wing parade or appropriate ceremony.',
    precedents: 'Sqn Ldr Harris awarded 12-year medal Jan 2026.',
  },
];

const STATUS_STYLE = {
  draft:     { background: '#FEF3C7', color: '#92400E' },
  submitted: { background: '#EEF2F8', color: '#1E40AF' },
  approved:  { background: '#D1FAE5', color: '#065F46' },
  returned:  { background: '#FEE2E2', color: '#991B1B' },
};

const STATUS_LABEL = {
  draft:     'Draft',
  submitted: 'Submitted',
  approved:  'Approved',
  returned:  'Returned',
};

const CATEGORY_BADGE = {
  cadet: { background: navy,  color: 'white' },
  cfav:  { background: gold,  color: navy    },
};

export default function Awards({ showToast, addAudit }) {
  const [tab, setTab]                 = useState('awards');
  const [showNomForm, setShowNomForm] = useState(false);
  const [nomForm, setNomForm]         = useState({ nominee: '', award: 'Certificate of Merit', justification: '', deadline: '' });
  const [nominations, setNominations] = useState(NOMINATIONS);
  const [awards]                      = useState(PAST_AWARDS);
  const [expandedCriteria, setExpandedCriteria] = useState(null);

  // ── Derived counts ───────────────────────────────────────────────────
  const thisYear     = awards.filter(a => a.date.includes('2026'));
  const cadetAwards  = awards.filter(a => a.category === 'cadet' && a.date.includes('2026'));
  const cfavAwards   = awards.filter(a => a.category === 'cfav'  && a.date.includes('2026'));
  const draftCount   = nominations.filter(n => n.status === 'draft').length;

  // ── Handlers ─────────────────────────────────────────────────────────
  function handleSubmitToWing(id) {
    setNominations(prev =>
      prev.map(n =>
        n.id === id ? { ...n, status: 'submitted', submittedTo: 'Wing HQ' } : n
      )
    );
    const nom = nominations.find(n => n.id === id);
    addAudit && addAudit(`Nomination submitted to Wing HQ: ${nom.nominee} — ${nom.award}`);
    showToast && showToast(`Nomination for ${nom.nominee} submitted to Wing HQ`);
  }

  function handleAddNomination() {
    if (!nomForm.nominee.trim()) { showToast && showToast('Nominee name is required'); return; }
    if (!nomForm.justification.trim() || nomForm.justification.trim().length < 20) {
      showToast && showToast('Please provide a justification (minimum 20 characters)'); return;
    }
    const newNom = {
      id: `n${Date.now()}`,
      nominee: nomForm.nominee.trim(),
      award: nomForm.award,
      status: 'draft',
      submittedTo: null,
      justification: nomForm.justification.trim(),
      deadline: nomForm.deadline || 'TBC',
      recommender: 'Sqn Ldr Harris',
    };
    setNominations(prev => [newNom, ...prev]);
    addAudit && addAudit(`New nomination drafted: ${newNom.nominee} — ${newNom.award}`);
    showToast && showToast(`Nomination drafted for ${newNom.nominee}`);
    setNomForm({ nominee: '', award: 'Certificate of Merit', justification: '', deadline: '' });
    setShowNomForm(false);
  }

  // ── Shared styles ─────────────────────────────────────────────────────
  const card = {
    background: 'white',
    border: `1.5px solid ${border}`,
    borderRadius: 10,
    padding: '16px 18px',
    marginBottom: 12,
  };

  const pill = (status) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'Barlow Condensed, sans-serif',
    letterSpacing: 0.3,
    ...(STATUS_STYLE[status] || STATUS_STYLE.draft),
  });

  const badge = (category) => ({
    display: 'inline-block',
    padding: '2px 9px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'Barlow Condensed, sans-serif',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    ...(CATEGORY_BADGE[category] || CATEGORY_BADGE.cadet),
  });

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '8px 10px',
    border: `1.5px solid ${border}`,
    borderRadius: 7,
    fontFamily: 'Barlow, sans-serif',
    fontSize: 14,
    color: navy,
    background: 'white',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: 13,
    color: muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 5,
  };

  // ── Tab bar ───────────────────────────────────────────────────────────
  const TABS = [
    { key: 'awards',      label: 'Awards Register' },
    { key: 'nominations', label: 'Nominations'      },
    { key: 'criteria',    label: 'Criteria & Guidance' },
  ];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'Barlow, sans-serif', color: navy, maxWidth: 760, margin: '0 auto', padding: '0 0 40px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 700, margin: 0, color: navy }}>
          Awards &amp; Nominations
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: muted }}>
          1701 Squadron — awards register, nominations tracking, and eligibility guidance
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22, borderBottom: `2px solid ${border}`, paddingBottom: 0 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: 0.3,
              transition: 'background 0.15s, color 0.15s',
              background: tab === t.key ? navy : '#F4F7FB',
              color:      tab === t.key ? 'white' : muted,
              borderBottom: tab === t.key ? `2px solid ${navy}` : `2px solid transparent`,
              marginBottom: -2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB 1 — Awards Register
      ═══════════════════════════════════════════════════════ */}
      {tab === 'awards' && (
        <div>
          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Awards This Year', value: thisYear.length },
              { label: 'Cadet Awards',            value: cadetAwards.length },
              { label: 'CFAV Awards',             value: cfavAwards.length  },
              { label: 'Nominations Pending',     value: draftCount         },
            ].map(({ label, value }) => (
              <div key={label} style={{ ...card, marginBottom: 0, textAlign: 'center', padding: '14px 10px' }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 32, fontWeight: 700, color: navy, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: 12, color: muted, marginTop: 4, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* This Year's Awards */}
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: navy, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            This Year's Awards
          </h2>
          {awards.filter(a => a.date.includes('2026')).map(a => (
            <div key={a.id} style={{ ...card, borderLeft: `4px solid ${a.category === 'cfav' ? gold : navy}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={badge(a.category)}>{a.category === 'cfav' ? 'CFAV' : 'Cadet'}</span>
                  <span style={{ marginLeft: 8, fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: navy }}>{a.type}</span>
                </div>
                <span style={{ fontSize: 13, color: muted, whiteSpace: 'nowrap', marginLeft: 12 }}>{a.date}</span>
              </div>
              <div style={{ fontSize: 14, color: navy, fontWeight: 600 }}>{a.recipient}</div>
              <div style={{ fontSize: 13, color: muted }}>Presented by: {a.presentedBy}</div>
              {a.notes && (
                <div style={{ fontSize: 13, color: '#374151', background: '#F4F7FB', borderRadius: 6, padding: '6px 10px', marginTop: 2 }}>
                  {a.notes}
                </div>
              )}
            </div>
          ))}

          {/* Previous Years */}
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: navy, margin: '24px 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Previous Years
          </h2>
          {awards.filter(a => !a.date.includes('2026')).map(a => (
            <div key={a.id} style={{ ...card, borderLeft: `4px solid ${a.category === 'cfav' ? gold : navy}`, display: 'flex', flexDirection: 'column', gap: 6, opacity: 0.88 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={badge(a.category)}>{a.category === 'cfav' ? 'CFAV' : 'Cadet'}</span>
                  <span style={{ marginLeft: 8, fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: navy }}>{a.type}</span>
                </div>
                <span style={{ fontSize: 13, color: muted, whiteSpace: 'nowrap', marginLeft: 12 }}>{a.date}</span>
              </div>
              <div style={{ fontSize: 14, color: navy, fontWeight: 600 }}>{a.recipient}</div>
              <div style={{ fontSize: 13, color: muted }}>Presented by: {a.presentedBy}</div>
              {a.notes && (
                <div style={{ fontSize: 13, color: '#374151', background: '#F4F7FB', borderRadius: 6, padding: '6px 10px', marginTop: 2 }}>
                  {a.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 2 — Nominations
      ═══════════════════════════════════════════════════════ */}
      {tab === 'nominations' && (
        <div>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: navy, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Active Nominations
            </h2>
            <button
              onClick={() => setShowNomForm(v => !v)}
              style={{
                background: showNomForm ? '#F4F7FB' : navy,
                color: showNomForm ? navy : 'white',
                border: `1.5px solid ${showNomForm ? border : navy}`,
                borderRadius: 7,
                padding: '7px 16px',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                letterSpacing: 0.3,
              }}
            >
              {showNomForm ? '✕ Cancel' : '+ New Nomination'}
            </button>
          </div>

          {/* New nomination form */}
          {showNomForm && (
            <div style={{ ...card, background: '#F4F7FB', borderLeft: `4px solid ${gold}`, marginBottom: 20 }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 700, color: navy, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                New Nomination
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Nominee</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Smith, J."
                    value={nomForm.nominee}
                    onChange={e => setNomForm(f => ({ ...f, nominee: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Award Type</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={nomForm.award}
                    onChange={e => setNomForm(f => ({ ...f, award: e.target.value }))}
                  >
                    {AWARD_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Justification</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                  placeholder="Provide a clear justification for this nomination (minimum 100 characters recommended)…"
                  value={nomForm.justification}
                  onChange={e => setNomForm(f => ({ ...f, justification: e.target.value }))}
                />
                <div style={{ fontSize: 12, color: nomForm.justification.length >= 100 ? '#065F46' : muted, marginTop: 3 }}>
                  {nomForm.justification.length} chars {nomForm.justification.length < 100 ? `(${100 - nomForm.justification.length} more recommended)` : '✓'}
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Submission Deadline</label>
                <input
                  type="date"
                  style={{ ...inputStyle, maxWidth: 220 }}
                  value={nomForm.deadline}
                  onChange={e => setNomForm(f => ({ ...f, deadline: e.target.value }))}
                />
              </div>
              <button
                onClick={handleAddNomination}
                style={{
                  background: navy,
                  color: 'white',
                  border: 'none',
                  borderRadius: 7,
                  padding: '9px 22px',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                }}
              >
                Save as Draft
              </button>
            </div>
          )}

          {/* Nomination cards */}
          {nominations.length === 0 && (
            <div style={{ ...card, textAlign: 'center', color: muted, fontSize: 14, padding: 32 }}>
              No active nominations. Use "+ New Nomination" to begin.
            </div>
          )}
          {nominations.map(n => (
            <div key={n.id} style={{ ...card, borderLeft: `4px solid ${n.status === 'submitted' ? gold : n.status === 'approved' ? '#065F46' : n.status === 'returned' ? '#991B1B' : '#92400E'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: navy }}>{n.nominee}</span>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 15, color: muted, marginLeft: 10 }}>{n.award}</span>
                </div>
                <span style={pill(n.status)}>{STATUS_LABEL[n.status] || n.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: muted }}>
                  <span style={{ fontWeight: 600, color: navy }}>Recommender:</span> {n.recommender}
                </div>
                <div style={{ fontSize: 13, color: muted }}>
                  <span style={{ fontWeight: 600, color: navy }}>Deadline:</span> {n.deadline}
                </div>
                {n.submittedTo && (
                  <div style={{ fontSize: 13, color: muted }}>
                    <span style={{ fontWeight: 600, color: navy }}>Submitted to:</span> {n.submittedTo}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#374151', background: '#F4F7FB', borderRadius: 6, padding: '8px 10px', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, color: muted, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.4 }}>Justification: </span>
                {n.justification}
              </div>
              {n.status === 'draft' && (
                <button
                  onClick={() => handleSubmitToWing(n.id)}
                  style={{
                    background: navy,
                    color: 'white',
                    border: 'none',
                    borderRadius: 7,
                    padding: '8px 18px',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    letterSpacing: 0.3,
                  }}
                >
                  Submit to Wing →
                </button>
              )}
              {n.status === 'submitted' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1E40AF', fontWeight: 600 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#EEF2F8',
                    border: `2px solid #1E40AF`,
                    textAlign: 'center',
                    lineHeight: '14px',
                    fontSize: 11,
                  }}>✓</span>
                  Awaiting Wing decision
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 3 — Criteria & Guidance
      ═══════════════════════════════════════════════════════ */}
      {tab === 'criteria' && (
        <div>
          <p style={{ fontSize: 14, color: muted, margin: '0 0 18px' }}>
            Reference guide for RAFAC awards eligibility, nomination process, and precedents. Click any award to expand.
          </p>
          {CRITERIA.map(c => {
            const isOpen = expandedCriteria === c.id;
            return (
              <div key={c.id} style={{ ...card, padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setExpandedCriteria(isOpen ? null : c.id)}>
                {/* Card header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: isOpen ? navy : 'white',
                  borderBottom: isOpen ? 'none' : 'none',
                  transition: 'background 0.2s',
                }}>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: isOpen ? 'white' : navy,
                    letterSpacing: 0.3,
                  }}>
                    {c.title}
                  </span>
                  <span style={{ fontSize: 18, color: isOpen ? 'white' : muted, fontWeight: 300, lineHeight: 1 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div style={{ padding: '16px 18px', background: 'white', borderTop: `1.5px solid ${border}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div>
                        <div style={{ ...labelStyle, marginBottom: 4 }}>Who can nominate</div>
                        <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{c.who}</div>
                      </div>
                      <div>
                        <div style={{ ...labelStyle, marginBottom: 4 }}>Eligibility</div>
                        <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{c.eligibility}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ ...labelStyle, marginBottom: 4 }}>Process &amp; Timeline</div>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, background: '#F4F7FB', borderRadius: 6, padding: '8px 12px' }}>{c.process}</div>
                    </div>
                    <div>
                      <div style={{ ...labelStyle, marginBottom: 4 }}>Precedents</div>
                      <div style={{ fontSize: 13, color: muted, lineHeight: 1.5, fontStyle: 'italic' }}>{c.precedents}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
