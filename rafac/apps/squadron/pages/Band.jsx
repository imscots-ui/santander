import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

// ── Module-level seed data ─────────────────────────────────────────────────

const INSTRUMENTS = ['Side Drum', 'Bass Drum', 'Tenor Drum', 'Cymbal', 'Bugle', 'Trumpet', 'Flute'];

const MUSICIANS = [
  { id:'mus1', cadetId:'c01', name:'Mitchell, S', ini:'SM', rank:'Cpl',  instrument:'Side Drum',  grade:'Advanced',     joinedBand:'2024-09-01', performances:12, practiceAtt:94, notes:'Section leader. Ready for FS stripe consideration.' },
  { id:'mus2', cadetId:'c02', name:'Thomas, M',   ini:'TM', rank:'Sgt',  instrument:'Flute',       grade:'Intermediate', joinedBand:'2024-01-01', performances:8,  practiceAtt:88, notes:'Good progress. Passed Grade 4 ABRSM Jan 2026.' },
  { id:'mus3', cadetId:'c05', name:'Khan, A',     ini:'AK', rank:'Cdt',  instrument:'Side Drum',  grade:'Beginner',     joinedBand:'2025-09-01', performances:2,  practiceAtt:79, notes:'Learning basic rudimental patterns. Keen attitude.' },
  { id:'mus4', cadetId:'c07', name:'Wright, L',   ini:'LW', rank:'Cdt',  instrument:'Bass Drum',  grade:'Beginner',     joinedBand:'2025-09-01', performances:2,  practiceAtt:85, notes:'Good rhythm and timing. Developing well.' },
  { id:'mus5', cadetId:'c08', name:'Patel, E',    ini:'EP', rank:'Cdt',  instrument:'Tenor Drum', grade:'Beginner',     joinedBand:'2026-01-01', performances:0,  practiceAtt:71, notes:'New to band. Still learning basic stick technique.' },
];

const PRACTICE_LOG = [
  { id:'p1', date:'2026-06-12', type:'Practice Night', present:['mus1','mus2','mus3','mus4','mus5'], notes:'Worked on Pipes & Drums medley. Fletcher noted good improvement in section synchronisation.' },
  { id:'p2', date:'2026-05-29', type:'Practice Night', present:['mus1','mus2','mus4','mus5'],        notes:'Mitchell led warm-up. Khan absent (notified). Focused on parade march tempo.' },
  { id:'p3', date:'2026-05-15', type:'Performance',    present:['mus1','mus2','mus3','mus4'],        notes:'Played at Renfrewshire Armed Forces Day parade. Excellent performance — commended by Wing Commander.' },
];

const PERFORMANCES = [
  { id:'pf1', date:'2026-09-20', name:'Johnstone Civic Parade',        type:'Public Parade',  confirmed:true },
  { id:'pf2', date:'2026-11-08', name:'Remembrance Sunday — Johnstone', type:'Remembrance',    confirmed:true },
  { id:'pf3', date:'2026-12-10', name:'Wing Christmas Concert',         type:'Concert',        confirmed:false },
];

const REPERTOIRE = [
  { id:'r1', title:'Colonel Bogey March',  type:'March',      status:'Performance Ready' },
  { id:'r2', title:'Scotland the Brave',   type:'March',      status:'Performance Ready' },
  { id:'r3', title:'Highland Cathedral',   type:'Slow March', status:'Practice' },
  { id:'r4', title:'Amazing Grace',        type:'Hymn',       status:'Performance Ready' },
  { id:'r5', title:'633 Squadron',         type:'March',      status:'Practice' },
];

// ── Grade colours ──────────────────────────────────────────────────────────

const GRADE_COLOR = {
  Beginner:     { bg:'#F4F7FB', color:'#5A7090' },
  Intermediate: { bg:'#EEF6FF', color:'#1E40AF' },
  Advanced:     { bg:'#D1FAE5', color:'#065F46' },
};

// ── Shared small helpers ───────────────────────────────────────────────────

function Avatar({ ini, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: navy, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800,
      fontFamily: 'Barlow Condensed, sans-serif',
      flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {ini}
    </div>
  );
}

function Badge({ label, bg, color, style = {} }) {
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
      ...style,
    }}>
      {label}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${border}`,
      borderRadius: 10,
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, color = navy, bg = '#EAF4FF' }) {
  return (
    <Card style={{ padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </Card>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1.5px solid ${border}`, paddingBottom: 0 }}>
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: '9px 18px',
            background: 'none',
            border: 'none',
            borderBottom: active === t ? `2.5px solid ${navy}` : '2.5px solid transparent',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 14,
            fontWeight: active === t ? 800 : 600,
            color: active === t ? navy : muted,
            cursor: 'pointer',
            marginBottom: -1.5,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Band({ showToast, addAudit }) {
  const [tab, setTab]           = useState('musicians');
  const [selected, setSelected] = useState(null);
  const [practiceLog, setPracticeLog] = useState(PRACTICE_LOG);
  const [repertoire, setRepertoire]   = useState(REPERTOIRE);
  const [musicians, setMusicians]     = useState(MUSICIANS);
  const [pendingGrade, setPendingGrade] = useState({});
  const [performances, setPerformances] = useState(PERFORMANCES);

  const totalMusicians   = musicians.length;

  function printBandRegister() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    const attClr = a => a>=90?'#065F46':a>=80?'#1E40AF':'#8B1A1A';
    const attBg  = a => a>=90?'#D1FAE5':a>=80?'#EEF6FF':'#F8D7DA';
    const gcBg   = g => g==='Advanced'?'#D1FAE5':g==='Intermediate'?'#EEF6FF':'#F4F7FB';
    const gcClr  = g => g==='Advanced'?'#065F46':g==='Intermediate'?'#1E40AF':'#5A7090';
    const rows = musicians.map((m,i) => `<tr style="background:${i%2?'#FAFCFE':'white'};">
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;color:#00264D;">${m.rank} ${m.name}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;">${m.instrument}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${gcBg(m.grade)};color:${gcClr(m.grade)};padding:2px 9px;border-radius:10px;font-size:10px;font-weight:700;">${m.grade}</span></td>
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${attBg(m.practiceAtt)};color:${attClr(m.practiceAtt)};padding:2px 9px;border-radius:10px;font-size:10px;font-weight:700;">${m.practiceAtt}%</span></td>
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;text-align:center;font-weight:700;">${m.performances}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${m.joinedBand}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${m.notes}</td>
    </tr>`).join('');
    const perfRows = performances.map((p,i) => `<tr style="background:${i%2?'#FAFCFE':'white'};">
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;">${p.name}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${p.date}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;">${p.type}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${p.confirmed?'#D1FAE5':'#FFF3CC'};color:${p.confirmed?'#065F46':'#7A4A00'};padding:2px 8px;border-radius:8px;font-size:9px;font-weight:700;">${p.confirmed?'CONFIRMED':'PENDING'}</span></td>
    </tr>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Band Register — 1701 Sqn</title>
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
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">MUSIC SECTION REGISTER — DRUM CORPS &amp; BAND</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">PI: SSgt Fletcher, L. · As at ${today}</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">Musicians: ${musicians.length}</div>
          <div style="font-size:10px;color:#5A7090;">Avg practice att: ${Math.round(musicians.reduce((s,m)=>s+m.practiceAtt,0)/musicians.length)}%</div>
        </td>
      </tr>
    </table>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;">Musicians</div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">MUSICIAN</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">INSTRUMENT</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">GRADE</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">PRACTICE ATT.</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">PERFS</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">JOINED BAND</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">NOTES</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#00264D;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;">Upcoming Performances</div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">PERFORMANCE</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DATE</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">TYPE</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">STATUS</th>
      </tr></thead>
      <tbody>${perfRows}</tbody>
    </table>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;">
      <div style="border-top:1.5px solid #00264D;padding-top:6px;">
        <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Parade Instructor (Drums)</div>
        <div style="font-size:11px;color:#00264D;margin-top:2px;">SSgt Fletcher, L.&nbsp;</div>
      </div>
      <div style="border-top:1.5px solid #00264D;padding-top:6px;">
        <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Date</div>
        <div style="font-size:11px;color:#00264D;margin-top:2px;">${today}&nbsp;</div>
      </div>
    </div>
    <div style="margin-top:12px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · 1701 (Johnstone) Squadron ATC Music Section
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Band Register printed', 'Band', `Printed by SSgt Fletcher on ${today}`);
    showToast('🖨️ Band register sent to printer');
  }
  const avgAtt           = Math.round(musicians.reduce((s, m) => s + m.practiceAtt, 0) / totalMusicians);
  const upcomingCount    = performances.filter(p => new Date(p.date) > new Date('2026-06-14')).length;

  // ── Musicians tab ──────────────────────────────────────────────────────

  function handleGradeChange(musId, val) {
    setPendingGrade(prev => ({ ...prev, [musId]: val }));
  }

  function handleGradeSave(mus) {
    const newGrade = pendingGrade[mus.id];
    if (!newGrade || newGrade === mus.grade) {
      showToast('No change to save.');
      return;
    }
    setMusicians(prev => prev.map(m => m.id === mus.id ? { ...m, grade: newGrade } : m));
    addAudit && addAudit({
      action: 'Band grade updated',
      detail: `${mus.rank} ${mus.name} — ${mus.grade} → ${newGrade}`,
      user: 'SSgt Fletcher, L.',
    });
    setPendingGrade(prev => { const n = { ...prev }; delete n[mus.id]; return n; });
    showToast(`Grade updated: ${mus.name} → ${newGrade}`);
  }

  function MusiciansTab() {
    return (
      <div>
        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard label="Musicians" value={totalMusicians} color={navy} bg="#EAF4FF" />
          <StatCard label="Avg Practice Att." value={`${avgAtt}%`} color="#1B6B3A" bg="#D4EDDA" />
          <StatCard label="Upcoming Events" value={upcomingCount} color="#7A4A00" bg="#FFF3CC" />
        </div>

        {/* Table */}
        <Card>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1.4fr 1.1fr 0.9fr 0.9fr 1fr',
            padding: '10px 16px',
            borderBottom: `1.5px solid ${border}`,
            gap: 8,
          }}>
            {['Musician', 'Instrument', 'Grade', 'Practice Att.', 'Perfs', 'Notes'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Barlow Condensed, sans-serif' }}>{h}</div>
            ))}
          </div>

          {musicians.map((mus, idx) => {
            const isSelected = selected === mus.id;
            const gc = GRADE_COLOR[mus.grade] || GRADE_COLOR.Beginner;
            const attColor = mus.practiceAtt >= 90 ? '#065F46' : mus.practiceAtt >= 80 ? '#1E40AF' : '#8B1A1A';
            const attBg    = mus.practiceAtt >= 90 ? '#D1FAE5' : mus.practiceAtt >= 80 ? '#EEF6FF' : '#F8D7DA';

            return (
              <div key={mus.id}>
                {/* Row */}
                <div
                  onClick={() => setSelected(isSelected ? null : mus.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1.4fr 1.1fr 0.9fr 0.9fr 1fr',
                    padding: '11px 16px',
                    gap: 8,
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: isSelected || idx === musicians.length - 1 ? 'none' : `1px solid ${border}`,
                    background: isSelected ? '#F6F9FF' : 'white',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Name + rank */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar ini={mus.ini} size={32} />
                    <div>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: navy }}>{mus.name}</div>
                      <div style={{ fontSize: 11, color: muted }}>{mus.rank}</div>
                    </div>
                  </div>

                  {/* Instrument */}
                  <div style={{ fontSize: 13, color: '#1A2A40', fontFamily: 'Barlow, sans-serif' }}>{mus.instrument}</div>

                  {/* Grade badge */}
                  <div><Badge label={mus.grade} bg={gc.bg} color={gc.color} /></div>

                  {/* Practice attendance */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 9px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      background: attBg,
                      color: attColor,
                      fontFamily: 'Barlow Condensed, sans-serif',
                    }}>
                      {mus.practiceAtt}%
                    </span>
                  </div>

                  {/* Performances */}
                  <div style={{ fontSize: 13, color: '#1A2A40', fontWeight: 600, fontFamily: 'Barlow, sans-serif' }}>{mus.performances}</div>

                  {/* Notes truncated */}
                  <div style={{ fontSize: 12, color: muted, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Barlow, sans-serif' }}>
                    {mus.notes}
                  </div>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div style={{
                    padding: '14px 20px 16px 20px',
                    background: '#F6F9FF',
                    borderTop: `1px solid ${border}`,
                    borderBottom: idx < musicians.length - 1 ? `1.5px solid ${border}` : 'none',
                  }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Full Notes</div>
                      <div style={{ fontSize: 13, color: '#1A2A40', lineHeight: 1.55, fontFamily: 'Barlow, sans-serif' }}>{mus.notes}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Update Grade:</div>
                      <select
                        value={pendingGrade[mus.id] !== undefined ? pendingGrade[mus.id] : mus.grade}
                        onChange={e => handleGradeChange(mus.id, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          border: `1.5px solid ${border}`,
                          borderRadius: 7,
                          fontSize: 13,
                          fontFamily: 'Barlow, sans-serif',
                          color: navy,
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        {['Beginner', 'Intermediate', 'Advanced'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleGradeSave(mus)}
                        style={{
                          padding: '5px 16px',
                          background: navy,
                          color: 'white',
                          border: 'none',
                          borderRadius: 7,
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: 'Barlow Condensed, sans-serif',
                          cursor: 'pointer',
                          letterSpacing: '0.03em',
                        }}
                      >
                        Save
                      </button>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 12, color: muted }}>
                          <span style={{ fontWeight: 700 }}>Joined band:</span> {mus.joinedBand}
                        </div>
                        <div style={{ fontSize: 12, color: muted }}>
                          <span style={{ fontWeight: 700 }}>Performances:</span> {mus.performances}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  // ── Practice Log tab ───────────────────────────────────────────────────

  function PracticeLogTab() {
    const sorted = [...practiceLog].sort((a, b) => b.date.localeCompare(a.date));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(entry => {
          const isPerf    = entry.type === 'Performance';
          const typeBg    = isPerf ? gold : navy;
          const typeColor = isPerf ? navy : 'white';
          const absentIds = musicians.filter(m => !entry.present.includes(m.id)).map(m => m.name);

          return (
            <Card key={entry.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 15, color: navy }}>{entry.date}</div>
                    <Badge label={entry.type} bg={typeBg} color={typeColor} />
                  </div>
                  <div style={{ fontSize: 13, color: '#1A2A40', lineHeight: 1.55, marginBottom: 8, fontFamily: 'Barlow, sans-serif' }}>{entry.notes}</div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, fontFamily: 'Barlow, sans-serif' }}>
                      <span style={{ fontWeight: 700, color: '#1B6B3A' }}>{entry.present.length}</span>
                      <span style={{ color: muted }}> / {musicians.length} present</span>
                    </div>
                    {absentIds.length > 0 && (
                      <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>
                        <span style={{ fontWeight: 700 }}>Absent: </span>
                        {absentIds.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  minWidth: 52,
                  padding: '8px 10px',
                  background: '#F4F7FB',
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800, color: navy }}>
                    {entry.present.length}
                  </div>
                  <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Present</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // ── Performances tab ───────────────────────────────────────────────────

  function PerformancesTab() {
    function handleConfirm(id) {
      setPerformances(prev => prev.map(p => p.id === id ? { ...p, confirmed: true } : p));
      const perf = performances.find(p => p.id === id);
      addAudit && addAudit({
        action: 'Performance confirmed',
        detail: perf ? `${perf.name} (${perf.date})` : id,
        user: 'SSgt Fletcher, L.',
      });
      showToast('Performance marked as confirmed.');
    }

    const sorted = [...performances].sort((a, b) => a.date.localeCompare(b.date));

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {sorted.map(perf => (
          <Card key={perf.id} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 800, color: navy, lineHeight: 1.2 }}>{perf.name}</div>
              {perf.confirmed
                ? <Badge label="Confirmed" bg="#D1FAE5" color="#065F46" />
                : <Badge label="Pending"   bg="#FFF3CC" color="#7A4A00" />
              }
            </div>
            <div style={{ fontSize: 13, color: muted, fontFamily: 'Barlow, sans-serif' }}>
              <span style={{ fontWeight: 700 }}>Date:</span> {perf.date}
            </div>
            <div style={{ fontSize: 13, color: muted, fontFamily: 'Barlow, sans-serif' }}>
              <span style={{ fontWeight: 700 }}>Type:</span> {perf.type}
            </div>
            {!perf.confirmed && (
              <button
                onClick={() => handleConfirm(perf.id)}
                style={{
                  marginTop: 6,
                  padding: '7px 0',
                  background: gold,
                  color: navy,
                  border: 'none',
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  width: '100%',
                }}
              >
                Mark Confirmed
              </button>
            )}
          </Card>
        ))}
      </div>
    );
  }

  // ── Repertoire tab ─────────────────────────────────────────────────────

  function RepertoireTab() {
    function handleToggle(id) {
      setRepertoire(prev => prev.map(r => {
        if (r.id !== id) return r;
        const next = r.status === 'Performance Ready' ? 'Practice' : 'Performance Ready';
        addAudit && addAudit({
          action: 'Repertoire status updated',
          detail: `"${r.title}" → ${next}`,
          user: 'SSgt Fletcher, L.',
        });
        showToast(`"${r.title}" updated to ${next}`);
        return { ...r, status: next };
      }));
    }

    return (
      <Card>
        {repertoire.map((piece, idx) => {
          const isReady   = piece.status === 'Performance Ready';
          const statusBg  = isReady ? '#D1FAE5' : '#FFF3CC';
          const statusCol = isReady ? '#065F46' : '#7A4A00';

          return (
            <div
              key={piece.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: idx < repertoire.length - 1 ? `1px solid ${border}` : 'none',
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: navy }}>{piece.title}</div>
                <div style={{ fontSize: 12, color: muted, fontFamily: 'Barlow, sans-serif' }}>{piece.type}</div>
              </div>
              <Badge label={piece.status} bg={statusBg} color={statusCol} />
              <button
                onClick={() => handleToggle(piece.id)}
                style={{
                  padding: '5px 14px',
                  background: isReady ? '#FFF3CC' : '#D1FAE5',
                  color: isReady ? '#7A4A00' : '#065F46',
                  border: `1.5px solid ${isReady ? '#F6D88A' : '#6EE7B7'}`,
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}
              >
                {isReady ? 'Mark Practice' : 'Mark Ready'}
              </button>
            </div>
          );
        })}
      </Card>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800, color: navy }}>
            Music Section
          </div>
          <div style={{ fontSize: 12, color: muted }}>1701 (Johnstone) Squadron · Drum Corps &amp; Band</div>
        </div>
        <button
          onClick={printBandRegister}
          style={{
            padding: '8px 16px',
            background: 'white',
            color: navy,
            border: `1.5px solid ${border}`,
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'Barlow Condensed, sans-serif',
            cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          📄 Print Register
        </button>
      </div>

      {/* PI banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: navy,
        borderRadius: 10,
        padding: '12px 18px',
        marginBottom: 22,
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: gold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 800, fontSize: 14, color: navy,
          flexShrink: 0,
        }}>
          FL
        </div>
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '4px 24px', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: 'white' }}>
            Parade Instructor (Drums): <span style={{ color: gold }}>SSgt Fletcher, L.</span>
          </div>
          <div style={{ fontSize: 12, color: '#8AAECF' }}>
            Band strength: <span style={{ color: 'white', fontWeight: 700 }}>5 musicians</span>
          </div>
          <div style={{ fontSize: 12, color: '#8AAECF' }}>
            Next practice: <span style={{ color: 'white', fontWeight: 700 }}>26 Jun 2026</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <TabBar
        tabs={['musicians', 'practice log', 'performances', 'repertoire']}
        active={tab}
        onChange={setTab}
      />

      {/* Tab content */}
      {tab === 'musicians'    && <MusiciansTab />}
      {tab === 'practice log' && <PracticeLogTab />}
      {tab === 'performances' && <PerformancesTab />}
      {tab === 'repertoire'   && <RepertoireTab />}
    </div>
  );
}
