import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';
import { PARADE_NIGHTS } from '../../../data/events.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const TONIGHT = [
  { time:'1900', activity:'Inspection & Roll Call', lead:'OC' },
  { time:'1910', activity:'Drill — About Turn & Saluting', lead:'Sgt Thomas' },
  { time:'1940', activity:'Airmanship: Aircraft Identification', lead:'Plt Off Smith' },
  { time:'2010', activity:'First Aid refresher — CPR', lead:'Sqn Ldr Harris' },
  { time:'2040', activity:'DofE briefing (Gold nominees)', lead:'OC' },
  { time:'2055', activity:'Dismiss', lead:'OC' },
];

export default function Parade({ showToast, addAudit }) {
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    CADETS.forEach(c => { init[c.id] = 'present'; });
    return init;
  });
  const [qrOpen, setQrOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState('');

  const present  = CADETS.filter(c => attendance[c.id] === 'present').length;
  const absent   = CADETS.filter(c => attendance[c.id] === 'absent').length;
  const apol     = CADETS.filter(c => attendance[c.id] === 'apology').length;

  function toggle(id) {
    setAttendance(prev => {
      const cycle = { present:'absent', absent:'apology', apology:'present' };
      return { ...prev, [id]: cycle[prev[id]] };
    });
  }

  const attStyle = {
    present: { bg:'#D4EDDA', color:'#0F4020', label:'P' },
    absent:  { bg:'#F8D7DA', color:'#8B1A1A', label:'A' },
    apology: { bg:'#FFF3CC', color:'#7A4A00', label:'E' },
  };

  function markAll(status) {
    const next = {};
    CADETS.forEach(c => { next[c.id] = status; });
    setAttendance(next);
  }

  function saveAttendance() {
    const p = CADETS.filter(c => attendance[c.id]==='present').length;
    const a = CADETS.filter(c => attendance[c.id]==='absent').length;
    const e = CADETS.filter(c => attendance[c.id]==='apology').length;
    addAudit?.(`Parade saved: ${p}P / ${a}A / ${e}E — ${Math.round((p/CADETS.length)*100)}% attendance`, 'Parade');
    showToast(`✅ Attendance saved — ${p} present, ${a} absent, ${e} excused`);
    setSaved(true);
  }

  const lowAtt = CADETS.filter(c => c.att < 75);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Parade Night</div>
          <div style={{ fontSize:12, color:muted }}>Thursday 18 June 2026 · 1701 (Johnstone) Squadron</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setQrOpen(true)} style={{ padding:'8px 16px', background:gold, color:'#00264D', border:'none', borderRadius:7, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif' }}>📲 QR Check-in</button>
          <button onClick={() => showToast('📥 Exporting attendance sheet…')} style={{ padding:'8px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer' }}>📥 Export</button>
        </div>
      </div>

      {/* Welfare alert */}
      {lowAtt.length > 0 && (
        <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:10, alignItems:'flex-start' }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, color:'#92400E', fontSize:13, marginBottom:4 }}>Low attendance — welfare check recommended</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {lowAtt.map(c => (
                <span key={c.id} style={{ background:'#FDE68A', color:'#78350F', fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:20 }}>
                  {c.rank} {c.sn} ({c.att}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
        {[
          { label:'On parade', value:present, color:'#1B6B3A', bg:'#D4EDDA' },
          { label:'Absent',    value:absent,  color:'#8B1A1A', bg:'#F8D7DA' },
          { label:'Excused',   value:apol,    color:'#7A4A00', bg:'#FFF3CC' },
          { label:'Strength',  value:CADETS.length, color:navy, bg:'#EAF4FF' },
        ].map(t => (
          <div key={t.label} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:t.color }}>{t.value}</div>
            <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Attendance grid */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy }}>Roll Call</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => markAll('present')} style={{ padding:'5px 12px', background:'#D4EDDA', color:'#0F4020', border:'1px solid #A7D5B4', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>All Present</button>
            <button onClick={() => markAll('absent')} style={{ padding:'5px 12px', background:'#F8D7DA', color:'#8B1A1A', border:'1px solid #F0B0B5', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>All Absent</button>
          </div>
        </div>
        <div style={{ fontSize:11, color:muted, marginBottom:14 }}>Click a cadet to cycle: Present → Absent → Excused</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:10 }}>
          {CADETS.map(c => {
            const st = attStyle[attendance[c.id]];
            return (
              <div key={c.id} onClick={() => toggle(c.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:`1.5px solid ${border}`, borderRadius:8, cursor:'pointer', background:'white', transition:'border-color 0.1s', userSelect:'none' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:st.bg, color:st.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 }}>{st.label}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#0D1B2E' }}>{c.sn}, {c.fn}</div>
                  <div style={{ fontSize:10, color:muted }}>{c.rank}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tonight's programme */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Tonight's Programme</div>
        {TONIGHT.map((t, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 0', borderBottom: i < TONIGHT.length-1 ? `1px solid ${border}` : 'none' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800, color:navy, minWidth:36 }}>{t.time}</div>
            <div style={{ flex:1, fontSize:13, color:'#0D1B2E' }}>{t.activity}</div>
            <div style={{ fontSize:11, color:muted }}>{t.lead}</div>
          </div>
        ))}
      </div>

      {/* Notes + save */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:10 }}>Parade Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Record what was covered tonight, any issues, reminders for next week…"
          style={{ width:'100%', padding:'10px 12px', border:`1.5px solid ${border}`, borderRadius:8, fontSize:13, minHeight:80, resize:'vertical', fontFamily:'Barlow,sans-serif', boxSizing:'border-box', marginBottom:12 }} />
        <button onClick={saveAttendance}
          style={{ padding:'10px 24px', background: saved ? '#1B6B3A' : navy, color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {saved ? '✅ Attendance saved' : '💾 Save tonight\'s attendance'}
        </button>
      </div>

      {/* Historical */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px' }}>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, color:navy, marginBottom:14 }}>Recent Parades</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ borderBottom:`2px solid ${border}` }}>
            {['Date','Activity','Present','Absent','Attendance %'].map(h=><th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {PARADE_NIGHTS.map((p, i) => {
              const pct = Math.round((p.cadets.length / CADETS.length) * 100);
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${border}`, background:i%2?'#fafcfe':'white' }}>
                  <td style={{ padding:'10px 12px', fontWeight:700 }}>{p.date}</td>
                  <td style={{ padding:'10px 12px' }}>{p.label}</td>
                  <td style={{ padding:'10px 12px', color:'#1B6B3A', fontWeight:700 }}>{p.cadets.length}</td>
                  <td style={{ padding:'10px 12px', color:'#8B1A1A' }}>{CADETS.length - p.cadets.length}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ fontWeight:700, color: pct>=85 ? '#1B6B3A' : pct>=70 ? '#7A4A00' : '#8B1A1A' }}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* QR modal */}
      {qrOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'white', borderRadius:12, padding:32, maxWidth:340, width:'100%', textAlign:'center' }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:20, fontWeight:800, color:navy, marginBottom:8 }}>QR Check-in</div>
            <div style={{ fontSize:13, color:muted, marginBottom:20 }}>Cadets scan this code on arrival to mark themselves present</div>
            <div style={{ width:160, height:160, background:'#F4F7FB', border:`2px solid ${border}`, borderRadius:12, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:40 }}>📲</div>
              <div style={{ fontSize:10, color:muted, fontWeight:700 }}>QR CODE</div>
              <div style={{ fontSize:9, color:muted }}>1701 · 18 Jun 2026</div>
            </div>
            <div style={{ background:'#F4F7FB', border:`1px solid ${border}`, borderRadius:8, padding:'10px', fontSize:12, color:muted, marginBottom:20 }}>
              {present} checked in · session active
            </div>
            <button onClick={() => setQrOpen(false)} style={{ padding:'10px 28px', background:navy, color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
