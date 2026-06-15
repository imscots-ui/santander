import { useState } from 'react';
import { CADETS, RANK_COLOR } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const SUBJECTS = {
  'First Class': [
    { id:'fc1', name:'Airmanship Levels 1–2', category:'Aviation' },
    { id:'fc2', name:'Drill — Basic Standard', category:'Military' },
    { id:'fc3', name:'Fieldcraft — Basic', category:'AT' },
    { id:'fc4', name:'Navigation — Basic Map Reading', category:'AT' },
    { id:'fc5', name:'Leadership Exercise 1', category:'Leadership' },
    { id:'fc6', name:'First Aid Level 1', category:'Health' },
    { id:'fc7', name:'Radio Communications', category:'Aviation' },
    { id:'fc8', name:'Community Action 1', category:'Community' },
  ],
  'Senior': [
    { id:'sr1', name:'Airmanship Levels 3–4', category:'Aviation' },
    { id:'sr2', name:'Drill — Intermediate', category:'Military' },
    { id:'sr3', name:'Fieldcraft — Intermediate', category:'AT' },
    { id:'sr4', name:'Navigation — Intermediate', category:'AT' },
    { id:'sr5', name:'Leadership Exercise 2', category:'Leadership' },
    { id:'sr6', name:'First Aid Level 2', category:'Health' },
    { id:'sr7', name:'Bronze AT Qualifying Activity', category:'AT' },
    { id:'sr8', name:'Community Action 2', category:'Community' },
  ],
  'Master Cadet': [
    { id:'mc1', name:'Airmanship Level 5', category:'Aviation' },
    { id:'mc2', name:'Leadership Exercise 3', category:'Leadership' },
    { id:'mc3', name:'Silver/Gold AT Activity', category:'AT' },
    { id:'mc4', name:'Flying Scholarship or 5× AEF', category:'Aviation' },
    { id:'mc5', name:'Duke of Edinburgh (any level)', category:'DofE' },
    { id:'mc6', name:'Community Project (lead role)', category:'Community' },
  ],
};

const CAT_COLOR = {
  Aviation:   '#1E40AF',
  Military:   '#00264D',
  AT:         '#166534',
  Leadership: '#7C3AED',
  Health:     '#991B1B',
  Community:  '#92400E',
  DofE:       '#065F46',
};

const SEED_PROGRESS = {
  c01: { fc1:true,fc2:true,fc3:true,fc4:true,fc5:true,fc6:true,fc7:true,fc8:true, sr1:true,sr2:true,sr3:true,sr4:true,sr5:true,sr6:false,sr7:true,sr8:false },
  c02: { fc1:true,fc2:true,fc3:true,fc4:true,fc5:true,fc6:true,fc7:true,fc8:true, sr1:true,sr2:true,sr3:true,sr4:true,sr5:true,sr6:true,sr7:true,sr8:true },
  c03: { fc1:true,fc2:true,fc3:true,fc4:false,fc5:true,fc6:true,fc7:false,fc8:true },
  c04: { fc1:true,fc2:true,fc3:false,fc4:false,fc5:true,fc6:true,fc7:false,fc8:false },
  c05: { fc1:true,fc2:true,fc3:true,fc4:true,fc5:false,fc6:false,fc7:true,fc8:false },
  c06: {},
  c07: { fc1:true,fc2:true,fc3:true,fc4:true,fc5:true,fc6:true,fc7:false,fc8:true },
  c08: { fc1:true,fc2:false,fc3:true,fc4:false,fc5:true,fc6:true,fc7:false,fc8:false },
  c09: {},
};

// Map pts value to canonical classification level
function normaliseLevel(pts) {
  if (pts === 'Leading') return 'Senior';
  return pts;
}

// Given current classification, what level subjects should they be working on next?
const LEVEL_ORDER = ['Recruit', 'First Class', 'Senior', 'Master Cadet'];

function targetLevel(currentClass) {
  const idx = LEVEL_ORDER.indexOf(currentClass);
  if (idx < 0 || idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

function nextNextLevel(currentClass) {
  const idx = LEVEL_ORDER.indexOf(currentClass);
  if (idx < 0 || idx >= LEVEL_ORDER.length - 2) return null;
  return LEVEL_ORDER[idx + 2];
}

function subjectsFor(level) {
  return SUBJECTS[level] || [];
}

function countDone(cadetProgress, subjects) {
  return subjects.filter(s => cadetProgress[s.id]).length;
}

export default function Classification({ showToast, addAudit }) {
  const [progress, setProgress] = useState(SEED_PROGRESS);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('overview');

  function toggleSubject(cadetId, subjectId, subjectName) {
    setProgress(prev => {
      const cadetProg = prev[cadetId] || {};
      const nowDone = !cadetProg[subjectId];
      addAudit?.('Classification subject ' + (nowDone ? 'marked' : 'unmarked') + ': ' + subjectName, 'Training');
      return { ...prev, [cadetId]: { ...cadetProg, [subjectId]: nowDone } };
    });
  }

  function markAllCurrent(cadetId, subjects) {
    setProgress(prev => {
      const cadetProg = prev[cadetId] || {};
      const updated = { ...cadetProg };
      subjects.forEach(s => { updated[s.id] = true; });
      addAudit?.('All current-level subjects marked complete for cadet ' + cadetId, 'Training');
      showToast('All current-level subjects marked complete');
      return { ...prev, [cadetId]: updated };
    });
  }

  function printCertificate(cadet, level, subjects) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const fullName = `${cadet.sn}, ${cadet.fn}`;
    const subjectRows = subjects.map(s => `
      <tr>
        <td style="padding:6px 14px;border-bottom:1px solid #E8ECF5;font-size:13px;color:#1a2b4a;">✓ ${s.name}</td>
        <td style="padding:6px 14px;border-bottom:1px solid #E8ECF5;font-size:11px;color:#5A7090;font-weight:700;text-align:right;">${s.category}</td>
      </tr>`).join('');
    const levelBg = { 'First Class':'#EAF4FF','Senior':'#D4EDDA','Master Cadet':'#FFF3CC' };
    const levelCol = { 'First Class':'#003D80','Senior':'#0F4020','Master Cadet':'#7A4A00' };
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Certificate — ${fullName}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:18mm 20mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#00264D;background:white;margin:0;padding:0}
.cert{max-width:680px;margin:0 auto}
.header{text-align:center;padding:28px 0 18px;border-bottom:3px solid #C8A032;margin-bottom:22px}
.roundel{font-size:56px;margin-bottom:6px}
.sqn{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;letter-spacing:.04em}
.sub{font-size:11px;color:#5A7090;font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:.08em}
.cert-label{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#C8A032;letter-spacing:.14em;text-transform:uppercase;text-align:center;margin:20px 0 6px}
.cert-title{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:800;text-align:center;margin-bottom:18px}
.awarded{text-align:center;font-size:12px;color:#5A7090;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.cadet-name{font-family:'Barlow Condensed',sans-serif;font-size:38px;font-weight:800;text-align:center;margin-bottom:4px}
.cadet-rank{text-align:center;font-size:13px;color:#5A7090;margin-bottom:18px}
.level-wrap{text-align:center;margin-bottom:20px}
.level-badge{display:inline-block;background:${levelBg[level]||'#F4F7FB'};border:2px solid #C8A032;border-radius:10px;padding:11px 30px;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:${levelCol[level]||'#00264D'};letter-spacing:.04em}
.subj-head{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;border-bottom:2px solid #D0DCF0;padding-bottom:6px;margin-bottom:0;letter-spacing:.04em}
table{width:100%;border-collapse:collapse;margin-bottom:28px}
.date-line{font-size:12px;color:#5A7090;text-align:center;margin-bottom:10px}
.statement{font-size:12px;color:#5A7090;text-align:center;margin-bottom:22px;line-height:1.6}
.sigs{display:flex;gap:32px;padding-top:18px;border-top:2px solid #C8A032}
.sig-block{flex:1}
.sig-line{border-bottom:1px solid #00264D;height:38px;margin-bottom:4px}
.sig-label{font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.sig-name{font-size:12px;font-weight:700;color:#00264D;margin-top:2px}
.footer{margin-top:18px;padding-top:10px;border-top:1px solid #D0DCF0;font-size:9.5px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="cert">
  <div class="header">
    <div class="roundel">✈️</div>
    <div class="sqn">1701 (Johnstone) Squadron</div>
    <div class="sub">Air Training Corps · Royal Air Force Air Cadets</div>
  </div>
  <div class="cert-label">Certificate of Achievement</div>
  <div class="cert-title">PTS Classification Award</div>
  <div class="awarded">This is to certify that</div>
  <div class="cadet-name">${fullName}</div>
  <div class="cadet-rank">${cadet.rank} · 1701 (Johnstone) Squadron ATC</div>
  <div class="level-wrap"><div class="level-badge">${level}</div></div>
  <div class="date-line">Date of award: <strong>${dateStr}</strong></div>
  <div class="statement">Has successfully completed all required subjects for the <strong>${level}</strong> classification<br>under the RAFAC Proficiency Training Scheme (PTS)</div>
  <div class="subj-head">Subjects Completed (${subjects.length})</div>
  <table><tbody>${subjectRows}</tbody></table>
  <div class="sigs">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Officer Commanding</div>
      <div class="sig-name">Flt Lt A. McDonald</div>
      <div class="sig-label">1701 (Johnstone) Squadron ATC</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Wing Commander (Cadets)</div>
      <div class="sig-name">Wg Cdr ________</div>
      <div class="sig-label">West of Scotland Wing</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Date</div>
      <div class="sig-name">${dateStr}</div>
    </div>
  </div>
  <div class="footer">RAFAC 1701-CLF-${level.replace(/\s/g,'').toUpperCase()} · OFFICIAL · Proficiency Training Scheme · ${dateStr}</div>
</div></body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.(`Certificate printed: ${fullName} — ${level}`, 'Classification');
    showToast(`🏆 Certificate printing for ${cadet.sn}…`);
  }

  function printClassificationReport() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    const levelCol = { 'Recruit':'#5A7090','First Class':'#003D80','Senior':'#0F4020','Master Cadet':'#7A4A00' };
    const levelBg  = { 'Recruit':'#F4F7FB','First Class':'#EAF4FF','Senior':'#D4EDDA','Master Cadet':'#FFF3CC' };
    const rows = CADETS.map(c => {
      const cc = normaliseLevel(c.pts);
      const cp = progress[c.id] || {};
      const tgt = targetLevel(cc);
      const tgtSubs = tgt ? subjectsFor(tgt) : [];
      const done = countDone(cp, tgtSubs);
      const ready = tgt && tgtSubs.length > 0 && done === tgtSubs.length;
      const pct = tgtSubs.length > 0 ? Math.round((done / tgtSubs.length) * 100) : 100;
      const bar = `<div style="height:5px;background:#E8EEF5;border-radius:3px;overflow:hidden;margin-top:3px;width:80px"><div style="height:100%;width:${pct}%;background:${ready?'#1B6B3A':levelCol[cc]||'#5A7090'};border-radius:3px"></div></div>`;
      const statusBadge = ready
        ? `<span style="background:#D4EDDA;color:#0F4020;padding:2px 9px;border-radius:6px;font-size:10px;font-weight:700">✅ Ready</span>`
        : cc === 'Master Cadet'
        ? `<span style="background:#FFF3CC;color:#7A4A00;padding:2px 9px;border-radius:6px;font-size:10px;font-weight:700">Top level</span>`
        : `<span style="color:#9BA8BC;font-size:11px">In progress</span>`;
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;font-weight:600;color:#00264D">${c.rank} ${c.sn}, ${c.fn}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center"><span style="background:${levelBg[cc]||'#F4F7FB'};color:${levelCol[cc]||'#5A7090'};padding:2px 9px;border-radius:6px;font-size:11px;font-weight:700">${cc}</span></td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center;font-size:12px;color:#5A7090">${tgt||'—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center;font-size:12px">${tgt?`${done}/${tgtSubs.length}`:'—'}${tgt?bar:''}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E8ECF5;text-align:center">${statusBadge}</td>
      </tr>`;
    }).join('');
    const summary = LEVEL_ORDER.map(lv => {
      const n = CADETS.filter(c => normaliseLevel(c.pts) === lv).length;
      return `<div style="flex:1;text-align:center;padding:14px 8px;border-right:1px solid #D0DCF0"><div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:${levelCol[lv]||'#00264D'}">${n}</div><div style="font-size:10px;color:#5A7090;font-weight:700;text-transform:uppercase;margin-top:2px">${lv}</div></div>`;
    }).join('');
    const readyCount = CADETS.filter(c => {
      const cc = normaliseLevel(c.pts); const tgt = targetLevel(cc); const ts = tgt?subjectsFor(tgt):[];
      return tgt && ts.length>0 && countDone(progress[c.id]||{},ts)===ts.length;
    }).length;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Classification Report — 1701 Sqn</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 landscape;margin:14mm}
*{box-sizing:border-box}
body{font-family:'Barlow',sans-serif;color:#00264D;background:white;font-size:12px}
.hdr{display:flex;align-items:center;gap:16px;padding-bottom:12px;border-bottom:3px solid #C8A032;margin-bottom:18px}
.sqn{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800}
.sub{font-size:11px;color:#5A7090;margin-top:2px}
.title{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;margin-left:auto}
.summary{display:flex;border:1.5px solid #D0DCF0;border-radius:8px;overflow:hidden;margin-bottom:18px}
.ready-badge{background:#D4EDDA;color:#0F4020;border-radius:8px;padding:12px 20px;text-align:center;margin-left:auto;display:flex;flex-direction:column;justify-content:center}
table{width:100%;border-collapse:collapse}
thead tr{background:#F4F7FB;border-bottom:2px solid #D0DCF0}
th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#5A7090;white-space:nowrap}
tbody tr:hover{background:#F8FAFD}
.footer{margin-top:14px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#9BA8BC;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="hdr">
  <span style="font-size:36px">✈️</span>
  <div><div class="sqn">1701 (Johnstone) Squadron ATC</div><div class="sub">PTS Classification Register · ${dateStr}</div></div>
  <div class="title">Classification Report</div>
</div>
<div style="display:flex;gap:12px;margin-bottom:18px">
  <div class="summary" style="flex:1">${summary}<div class="ready-badge"><div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:#0F4020">${readyCount}</div><div style="font-size:10px;font-weight:700;color:#0F4020;text-transform:uppercase">Ready to advance</div></div></div>
</div>
<table>
  <thead><tr><th>Cadet</th><th>Current Level</th><th>Working Towards</th><th>Subject Progress</th><th>Status</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">1701 (Johnstone) Squadron ATC · RAFAC PTS Classification Register · OFFICIAL · ${dateStr} · ${CADETS.length} cadets on roll</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('Classification report exported', 'Training');
  }

  const selectedCadet = selected ? CADETS.find(c => c.id === selected) : null;

  // DETAIL VIEW
  if (tab === 'detail' && selectedCadet) {
    const currentClass = normaliseLevel(selectedCadet.pts);
    const target = targetLevel(currentClass);
    const comingNext = nextNextLevel(currentClass);
    const cadetProg = progress[selectedCadet.id] || {};

    const currentSubjects = target ? subjectsFor(target) : [];
    const nextSubjects = comingNext ? subjectsFor(comingNext) : [];
    const doneCount = countDone(cadetProg, currentSubjects);
    const allDone = currentSubjects.length > 0 && doneCount === currentSubjects.length;

    return (
      <div>
        {/* Back + header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => { setTab('overview'); setSelected(null); }}
            style={{ padding:'7px 14px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, background:'white', cursor:'pointer', color:navy, fontFamily:'Barlow,sans-serif' }}>
            ← All Cadets
          </button>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>Classification Progress</div>
            <div style={{ fontSize:12, color:muted }}>Subject-level tracking · PTS</div>
          </div>
        </div>

        {/* Cadet header card */}
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, flexShrink:0 }}>
            {selectedCadet.ini}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:17, color:navy }}>{selectedCadet.sn}, {selectedCadet.fn}</div>
            <div style={{ fontSize:13, color:muted, marginTop:2 }}>
              <span style={{ background: RANK_COLOR[selectedCadet.rank] || muted, color:'white', padding:'2px 8px', borderRadius:5, fontSize:11, fontWeight:700, marginRight:8 }}>{selectedCadet.rank}</span>
              Current classification: <strong style={{ color:navy }}>{currentClass}</strong>
            </div>
          </div>
          {target && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Working towards</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:gold }}>{target}</div>
              <div style={{ fontSize:12, color:muted, marginTop:2 }}>{doneCount} / {currentSubjects.length} subjects</div>
            </div>
          )}
        </div>

        {/* Current level subjects */}
        {target && (
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden', marginBottom:18 }}>
            <div style={{ padding:'14px 18px', borderBottom:`1.5px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:'#F4F7FB' }}>
              <div>
                <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>
                  {target} — Required Subjects
                </div>
                <div style={{ fontSize:12, color:muted, marginTop:2 }}>
                  {doneCount} of {currentSubjects.length} complete
                  {allDone && <span style={{ background:'#D4EDDA', color:'#0F4020', padding:'2px 9px', borderRadius:8, fontSize:10, fontWeight:700, marginLeft:10 }}>✅ Ready to advance</span>}
                </div>
              </div>
              {!allDone && (
                <button onClick={() => markAllCurrent(selectedCadet.id, currentSubjects)}
                  style={{ padding:'7px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
                  Mark all complete
                </button>
              )}
              {allDone && (
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => printCertificate(selectedCadet, target, currentSubjects)}
                    style={{ padding:'7px 14px', background:'#1B6B3A', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
                    🏆 Print Certificate
                  </button>
                  <button onClick={() => showToast(`🎖️ ${selectedCadet.sn} ready for ${target} classification`)}
                    style={{ padding:'7px 14px', background:gold, color:navy, border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>
                    + Award Classification
                  </button>
                </div>
              )}
            </div>

            {currentSubjects.map((subj, i) => {
              const done = !!cadetProg[subj.id];
              const catColor = CAT_COLOR[subj.category] || muted;
              return (
                <div key={subj.id}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 18px', borderBottom: i < currentSubjects.length - 1 ? `1px solid ${border}` : 'none', background: i % 2 ? '#fafcfe' : 'white', cursor:'pointer', transition:'background 0.1s' }}
                  onClick={() => toggleSubject(selectedCadet.id, subj.id, subj.name)}>
                  {/* Checkbox */}
                  <div style={{ width:22, height:22, borderRadius:5, border: done ? 'none' : `2px solid ${border}`, background: done ? '#1B6B3A' : 'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.15s' }}>
                    {done && <span style={{ color:'white', fontSize:13, fontWeight:800, lineHeight:1 }}>✓</span>}
                  </div>
                  {/* Name */}
                  <div style={{ flex:1, fontSize:13, fontWeight: done ? 600 : 500, color: done ? '#1B6B3A' : navy, textDecoration: done ? 'none' : 'none' }}>
                    {subj.name}
                  </div>
                  {/* Category badge */}
                  <span style={{ background: catColor + '18', color: catColor, padding:'2px 9px', borderRadius:8, fontSize:10, fontWeight:700, border:`1px solid ${catColor}30`, whiteSpace:'nowrap' }}>
                    {subj.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Coming next */}
        {comingNext && nextSubjects.length > 0 && (
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden', opacity:0.65 }}>
            <div style={{ padding:'12px 18px', borderBottom:`1px solid ${border}`, background:'#F4F7FB' }}>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:700, color:muted }}>
                Coming next — {comingNext}
              </div>
              <div style={{ fontSize:12, color:muted, marginTop:1 }}>Complete {target} first to unlock these subjects</div>
            </div>
            {nextSubjects.map((subj, i) => {
              const catColor = CAT_COLOR[subj.category] || muted;
              return (
                <div key={subj.id}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 18px', borderBottom: i < nextSubjects.length - 1 ? `1px solid ${border}` : 'none', background: i % 2 ? '#fafcfe' : 'white' }}>
                  <div style={{ width:22, height:22, borderRadius:5, border:`2px solid #D0DCF0`, background:'#F4F7FB', flexShrink:0 }} />
                  <div style={{ flex:1, fontSize:13, color:muted }}>{subj.name}</div>
                  <span style={{ background:'#F0F0F8', color:'#9090A0', padding:'2px 9px', borderRadius:8, fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>
                    {subj.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Recruit: no subjects yet */}
        {!target && (
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'28px 20px', textAlign:'center', color:muted }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🎖️</div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:700, color:navy, marginBottom:4 }}>Top Classification Reached</div>
            <div style={{ fontSize:13 }}>This cadet has completed all available classification levels.</div>
          </div>
        )}
      </div>
    );
  }

  // OVERVIEW TAB
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:navy }}>PTS Classification</div>
          <div style={{ fontSize:12, color:muted }}>Recruit → First Class → Senior → Master Cadet · {CADETS.length} cadets</div>
        </div>
        <button onClick={printClassificationReport}
          style={{ padding:'8px 14px', background:navy, color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>
          📄 Print Report
        </button>
      </div>

      {/* Summary stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:18 }}>
        {LEVEL_ORDER.map(level => {
          const count = CADETS.filter(c => normaliseLevel(c.pts) === level).length;
          const levelColors = {
            'Recruit':      { c:'#5A7090', bg:'#F4F7FB' },
            'First Class':  { c:'#003D80', bg:'#EAF4FF' },
            'Senior':       { c:'#0F4020', bg:'#D4EDDA' },
            'Master Cadet': { c:'#7A4A00', bg:'#FFF3CC' },
          };
          const lc = levelColors[level] || { c:navy, bg:'#F4F7FB' };
          return (
            <div key={level} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'14px 16px' }}>
              <div style={{ fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{level}</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:lc.c }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Main table */}
      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#F4F7FB', borderBottom:`2px solid ${border}` }}>
              {['Cadet', 'Current Level', 'First Class', 'Senior', 'Master Cadet', 'Status', ''].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CADETS.map((c, i) => {
              const currentClass = normaliseLevel(c.pts);
              const cadetProg = progress[c.id] || {};

              // Per-level subject counts
              const levelSubjects = {
                'First Class':  subjectsFor('First Class'),
                'Senior':       subjectsFor('Senior'),
                'Master Cadet': subjectsFor('Master Cadet'),
              };

              // Determine target level (what they're working towards)
              const target = targetLevel(currentClass);

              // Is the cadet ready to advance? (all subjects for target done)
              const targetSubs = target ? levelSubjects[target] : [];
              const readyToAdvance = target && targetSubs.length > 0 && countDone(cadetProg, targetSubs) === targetSubs.length;

              const levelBadgeColors = {
                'Recruit':      { bg:'#F4F7FB', color:'#5A7090' },
                'First Class':  { bg:'#EAF4FF', color:'#003D80' },
                'Senior':       { bg:'#D4EDDA', color:'#0F4020' },
                'Master Cadet': { bg:'#FFF3CC', color:'#7A4A00' },
              };
              const lbc = levelBadgeColors[currentClass] || { bg:'#F4F7FB', color:muted };

              return (
                <tr key={c.id}
                  onClick={() => { setSelected(c.id); setTab('detail'); }}
                  style={{ borderBottom:`1px solid ${border}`, background: i % 2 ? '#fafcfe' : 'white', cursor:'pointer', transition:'background 0.1s' }}>

                  {/* Name */}
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background:navy, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0 }}>{c.ini}</div>
                      <div>
                        <div style={{ fontWeight:700 }}>{c.sn}, {c.fn}</div>
                        <span style={{ background: RANK_COLOR[c.rank] || muted, color:'white', padding:'1px 6px', borderRadius:4, fontSize:9, fontWeight:700 }}>{c.rank}</span>
                      </div>
                    </div>
                  </td>

                  {/* Current level */}
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ background: lbc.bg, color: lbc.color, padding:'3px 10px', borderRadius:7, fontSize:11, fontWeight:700 }}>{currentClass}</span>
                  </td>

                  {/* First Class progress */}
                  {['First Class', 'Senior', 'Master Cadet'].map(level => {
                    const subs = levelSubjects[level];
                    const done = countDone(cadetProg, subs);
                    const total = subs.length;
                    const pct = total > 0 ? (done / total) * 100 : 0;
                    const isCurrentTarget = level === target;
                    const isPast = LEVEL_ORDER.indexOf(currentClass) > LEVEL_ORDER.indexOf(level) || (currentClass === level);
                    const isLocked = !isPast && !isCurrentTarget;

                    return (
                      <td key={level} style={{ padding:'12px 14px' }}>
                        {isLocked ? (
                          <span style={{ color:'#C0C8D8', fontSize:12 }}>—</span>
                        ) : (
                          <div style={{ minWidth:90 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                              <span style={{ fontSize:12, fontWeight: isCurrentTarget ? 800 : 600, color: done === total ? '#1B6B3A' : isCurrentTarget ? navy : muted }}>
                                {done}/{total}
                              </span>
                              {done === total && (
                                <span style={{ fontSize:9, color:'#1B6B3A', fontWeight:700 }}>✓</span>
                              )}
                            </div>
                            <div style={{ height:4, borderRadius:3, background:'#E8EEF5', overflow:'hidden' }}>
                              <div style={{ height:'100%', borderRadius:3, width:`${pct}%`, background: done === total ? '#1B6B3A' : isCurrentTarget ? navy : '#A0B8D0', transition:'width 0.3s' }} />
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Ready to advance status */}
                  <td style={{ padding:'12px 14px' }}>
                    {readyToAdvance ? (
                      <span style={{ background:'#D4EDDA', color:'#0F4020', padding:'3px 10px', borderRadius:8, fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>✅ Ready to advance</span>
                    ) : currentClass === 'Master Cadet' ? (
                      <span style={{ background:'#FFF3CC', color:'#7A4A00', padding:'3px 10px', borderRadius:8, fontSize:10, fontWeight:700 }}>Top level</span>
                    ) : (
                      <span style={{ color:muted, fontSize:12 }}>In progress</span>
                    )}
                  </td>

                  {/* View button */}
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={e => { e.stopPropagation(); setSelected(c.id); setTab('detail'); }}
                      style={{ padding:'4px 10px', border:`1px solid ${border}`, borderRadius:6, fontSize:11, background:'white', cursor:'pointer', fontWeight:600, fontFamily:'Barlow,sans-serif' }}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize:11, color:muted, marginTop:10 }}>
        Click any row to view subject-by-subject progress. Tick subjects as cadets complete them — changes are written to the audit log.
      </div>
    </div>
  );
}
