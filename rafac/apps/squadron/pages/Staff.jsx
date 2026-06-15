import { useState } from 'react';

// ── Palette ────────────────────────────────────────────────────────────────
const navy   = '#00264D';
const gold   = '#C8A032';
const muted  = '#5A7090';
const border = '#D0DCF0';
const red    = '#C8102E';

// ── Seed data ──────────────────────────────────────────────────────────────
const STAFF_DATA = [
  {
    id:'s01', ini:'JH', rank:'Sqn Ldr', name:'Harris, J.',  role:'OC',
    dbs: { expiry:'2027-03-15', status:'current' },
    safeguarding: { expiry:'2027-01-20', status:'current' },
    classification:'Qualified Instructor Specialist',
    avip: true, flyingMed:'current', firstAid:'current',
    phone:'07700 900001', email:'j.harris@rafac.mod.uk',
    training: { macp:true, tgvr:true, firstAidDate:'2025-09-12', supervisorAuth:true },
  },
  {
    id:'s02', ini:'PS', rank:'Plt Off', name:'Smith, P.',   role:'Training Officer',
    dbs: { expiry:'2026-09-01', status:'current' },
    safeguarding: { expiry:'2026-08-10', status:'current' },
    classification:'Qualified Instructor',
    avip: true, flyingMed:'current', firstAid:null,
    phone:'07700 900002', email:'p.smith@rafac.mod.uk',
    training: { macp:true, tgvr:true, firstAidDate:null, supervisorAuth:false },
  },
  {
    id:'s03', ini:'LF', rank:'SSgt', name:'Fletcher, L.', role:'Band PI / Admin',
    dbs: { expiry:'2025-12-01', status:'expired' },
    safeguarding: { expiry:'2026-11-05', status:'current' },
    classification:'Instructor',
    avip: false, flyingMed:null, firstAid:'current',
    phone:'07700 900003', email:'l.fletcher@rafac.mod.uk',
    training: { macp:false, tgvr:true, firstAidDate:'2024-03-20', supervisorAuth:false },
  },
  {
    id:'s04', ini:'RT', rank:'Sgt', name:'Thomas, R.',  role:'Training NCO',
    dbs: { expiry:'2026-07-20', status:'expiring' },
    safeguarding: { expiry:'2026-06-30', status:'expiring' },
    classification:'Qualified Instructor',
    avip: true, flyingMed:null, firstAid:null,
    phone:'07700 900004', email:'r.thomas@rafac.mod.uk',
    training: { macp:true, tgvr:false, firstAidDate:null, supervisorAuth:false },
  },
  {
    id:'s05', ini:'FM', rank:'Cpl', name:'McLeod, F.', role:'Admin Support',
    dbs: { expiry:'2027-01-10', status:'current' },
    safeguarding: { expiry:'2027-01-10', status:'current' },
    classification:'Instructor',
    avip: false, flyingMed:null, firstAid:null,
    phone:'07700 900005', email:'f.mcleod@rafac.mod.uk',
    training: { macp:true, tgvr:false, firstAidDate:null, supervisorAuth:false },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const TODAY = new Date('2026-06-14');

function daysBetween(dateStr) {
  if (!dateStr) return null;
  return Math.floor((new Date(dateStr) - TODAY) / 86400000);
}

function computeStatus(dateStr) {
  const d = daysBetween(dateStr);
  if (d === null) return 'none';
  if (d < 0)   return 'expired';
  if (d < 90)  return 'expiring';
  return 'current';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getUTCDate()).padStart(2,'0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function pillStyle(status) {
  if (status === 'current')  return { background:'#D1FAE5', color:'#065F46', border:'1px solid #A7F3D0' };
  if (status === 'expiring') return { background:'#FEF3C7', color:'#92400E', border:'1px solid #FDE68A' };
  if (status === 'expired')  return { background:'#FEE2E2', color:'#991B1B', border:'1px solid #FECACA' };
  return { background:'#F3F4F6', color:'#6B7280', border:'1px solid #E5E7EB' };
}

function dotColor(status) {
  if (status === 'current')  return '#059669';
  if (status === 'expiring') return '#D97706';
  if (status === 'expired')  return '#DC2626';
  return '#9CA3AF';
}

function rankBadgeStyle(rank) {
  if (rank === 'Sqn Ldr') return { background:'#00264D', color:'white', border:'1px solid #00264D' };
  if (rank === 'Plt Off') return { background:'#1E40AF', color:'white', border:'1px solid #1E40AF' };
  if (rank === 'SSgt')    return { background:'#0D9488', color:'white', border:'1px solid #0D9488' };
  if (rank === 'Sgt')     return { background:'#15803D', color:'white', border:'1px solid #15803D' };
  return { background:'#2563EB', color:'white', border:'1px solid #2563EB' };
}

function classStyle(cls) {
  if (cls === 'Qualified Instructor Specialist') return { background:'#EDE9FE', color:'#5B21B6', border:'1px solid #DDD6FE' };
  if (cls === 'Qualified Instructor')            return { background:'#DBEAFE', color:'#1E40AF', border:'1px solid #BFDBFE' };
  return { background:'#F0FDF4', color:'#166534', border:'1px solid #BBF7D0' };
}

// Count staff with any expired or expiring compliance items
function countComplianceIssues() {
  let count = 0;
  for (const s of STAFF_DATA) {
    if (s.dbs.status === 'expired' || s.dbs.status === 'expiring') count++;
    if (s.safeguarding.status === 'expired' || s.safeguarding.status === 'expiring') count++;
    if (!s.training.macp) count++;
  }
  return count;
}

const COMPLIANCE_ISSUES_COUNT = countComplianceIssues();

// ── Sub-components (no hooks) ──────────────────────────────────────────────
function StatusPill({ status, label }) {
  const icon = status === 'expired' ? '✕ ' : status === 'expiring' ? '⚠ ' : status === 'current' ? '✓ ' : '';
  return (
    <span style={{
      ...pillStyle(status),
      padding:'2px 10px', borderRadius:10, fontSize:11, fontWeight:700,
      fontFamily:'Barlow,sans-serif', whiteSpace:'nowrap', display:'inline-block',
    }}>
      {icon}{label}
    </span>
  );
}

function Dot({ status }) {
  return (
    <span style={{
      display:'inline-block', width:10, height:10, borderRadius:'50%',
      background:dotColor(status), flexShrink:0,
    }} />
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Staff({ showToast, addAudit }) {
  const [tab, setTab]               = useState('register');
  const [expandedId, setExpandedId] = useState(null);
  const [trainingLog, setTrainingLog] = useState([]);
  const [logForm, setLogForm]       = useState({ staffId:'s01', type:'MACP', date:'2026-06-14', ref:'' });
  const [showLogForm, setShowLogForm] = useState(false);

  // ── Print ──────────────────────────────────────────────────────────────
  function printStaffRegister() {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    function fmtD(d) {
      if (!d) return '—';
      const dt = new Date(d);
      const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${String(dt.getUTCDate()).padStart(2,'0')} ${mo[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
    }
    const stBg  = s => s==='current'?'#D1FAE5':s==='expiring'?'#FEF3C7':s==='expired'?'#FEE2E2':'#F3F4F6';
    const stClr = s => s==='current'?'#065F46':s==='expiring'?'#92400E':s==='expired'?'#991B1B':'#6B7280';
    const stLbl = s => s==='current'?'✓ OK':s==='expiring'?'⚠ Expiring':s==='expired'?'✕ Expired':'—';
    const rows = STAFF_DATA.map((s,i) => {
      const dbSt = s.dbs.status, safSt = s.safeguarding.status;
      const hasIssue = dbSt!=='current' || safSt!=='current' || !s.training.macp;
      return `<tr style="background:${i%2?'#FAFCFE':'white'};border-left:3px solid ${dbSt==='expired'?'#DC2626':hasIssue?'#D97706':'transparent'};">
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-weight:700;">${s.rank} ${s.name}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#5A7090;">${s.role}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${stBg(dbSt)};color:${stClr(dbSt)};padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;">${stLbl(dbSt)}</span><div style="font-size:9px;color:#5A7090;">${fmtD(s.dbs.expiry)}</div></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${stBg(safSt)};color:${stClr(safSt)};padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;">${stLbl(safSt)}</span><div style="font-size:9px;color:#5A7090;">${fmtD(s.safeguarding.expiry)}</div></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${s.training.macp?'#D1FAE5':'#FEF3C7'};color:${s.training.macp?'#065F46':'#92400E'};padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;">${s.training.macp?'✓ Done':'⏳ Pending'}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;font-size:10px;color:#00264D;font-weight:600;">${s.classification}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #D0DCF0;text-align:center;"><span style="background:${s.avip?'#D1FAE5':'#F3F4F6'};color:${s.avip?'#065F46':'#6B7280'};padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;">${s.avip?'✓ Eligible':'—'}</span></td>
      </tr>`;
    }).join('');
    const issueCount = STAFF_DATA.reduce((n,s) => n+(s.dbs.status!=='current'?1:0)+(s.safeguarding.status!=='current'?1:0)+(!s.training.macp?1:0), 0);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <title>CFAV Compliance Register — 1701 Sqn</title>
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
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#C8A032;letter-spacing:0.04em;">CFAV COMPLIANCE REGISTER — AP 1919 / RAFAC SAFEGUARDING POLICY</div>
          <div style="font-size:10px;color:#5A7090;margin-top:2px;">As at ${today}</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:10px;color:#5A7090;">Total CFAVs: ${STAFF_DATA.length}</div>
          <div style="font-size:10px;color:${issueCount>0?'#991B1B':'#065F46'};font-weight:700;">${issueCount} issue${issueCount!==1?'s':''} outstanding</div>
        </td>
      </tr>
    </table>
    ${issueCount>0?`<div style="background:#FEE2E2;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#991B1B;font-weight:600;">⚠ Action required — see highlighted rows. Expired DBS holders must be stood down from cadet contact immediately.</div>`:''}
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr style="background:#00264D;color:white;">
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CFAV</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">ROLE</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">DBS CHECK</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">SAFEGUARDING</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">MACP MODULE</th>
        <th style="padding:8px 10px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">CLASSIFICATION</th>
        <th style="padding:8px 10px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:0.06em;">AVIP</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:28px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:20px;">
      ${['Commanding Officer','Wing Admin Officer','Safeguarding DSL','Date'].map((l,i) => `
        <div style="border-top:1.5px solid #00264D;padding-top:6px;">
          <div style="font-size:9px;color:#5A7090;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${l}</div>
          <div style="font-size:11px;color:#00264D;margin-top:2px;">${i===0?'Sqn Ldr Harris':i===3?today:''}&nbsp;</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:12px;padding-top:8px;border-top:1px solid #D0DCF0;font-size:9px;color:#8A9AB5;text-align:center;">
      OFFICIAL — RAFAC INTERNAL · DBS: 3-year renewal cycle · Safeguarding/MACP: annual · Retain 6 years (AP 1919 / DPA 2018)
    </div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 600);
    addAudit?.('CFAV Compliance Register printed', 'Staff', `Printed by Sqn Ldr Harris on ${today}`);
    showToast('🖨️ CFAV compliance register sent to printer');
  }

  // ── Register helpers ────────────────────────────────────────────────────
  const officers = STAFF_DATA.filter(s => s.rank === 'Sqn Ldr' || s.rank === 'Plt Off').length;
  const ncos     = STAFF_DATA.length - officers;

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  function handleRequestRenewal(s, item) {
    showToast(`📧 Renewal request sent for ${s.rank} ${s.name} — ${item}`);
    addAudit?.('Renewal Requested', `${s.rank} ${s.name}`, `${item} renewal requested`);
  }

  // ── Training log helpers ────────────────────────────────────────────────
  function submitLog() {
    if (!logForm.staffId || !logForm.type || !logForm.date) {
      showToast('⚠️ Please complete all required fields');
      return;
    }
    const s = STAFF_DATA.find(x => x.id === logForm.staffId);
    const entry = { id:`tl_${Date.now()}`, ...logForm, staffName:`${s.rank} ${s.name}`, loggedAt:'2026-06-14' };
    setTrainingLog(prev => [...prev, entry]);
    addAudit?.('Training Logged', `${s.rank} ${s.name}`, `${logForm.type} completed ${logForm.date}${logForm.ref ? ` · Ref: ${logForm.ref}` : ''}`);
    showToast(`✅ Training logged for ${s.rank} ${s.name}`);
    setLogForm({ staffId:'s01', type:'MACP', date:'2026-06-14', ref:'' });
    setShowLogForm(false);
  }

  // ── Shared styles ───────────────────────────────────────────────────────
  const card = {
    background:'white', border:`1.5px solid ${border}`, borderRadius:10, overflow:'hidden',
  };

  const sectionTitle = {
    fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy, marginBottom:4,
  };

  const labelStyle = {
    fontSize:10, fontWeight:700, color:muted, textTransform:'uppercase',
    letterSpacing:'0.06em', marginBottom:6,
  };

  const colHeader = {
    fontSize:10, fontWeight:700, color:muted, textTransform:'uppercase', letterSpacing:'0.06em',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TAB 1: Staff Register
  // ─────────────────────────────────────────────────────────────────────────
  function renderRegister() {
    const fletcher = STAFF_DATA.find(s => s.id === 's03');

    return (
      <div>
        {/* Stat tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[
            { label:'Total CFAVs',       value:STAFF_DATA.length, sub:'On establishment',     accent:navy },
            { label:'Officers',          value:officers,          sub:'Commissioned',           accent:'#1E40AF' },
            { label:'NCOs',              value:ncos,              sub:'Non-commissioned',       accent:'#5B21B6' },
            { label:'Compliance Issues', value:COMPLIANCE_ISSUES_COUNT, sub:'Require action',   accent: COMPLIANCE_ISSUES_COUNT > 0 ? '#991B1B' : '#065F46' },
          ].map(t => (
            <div key={t.label} style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'16px 18px' }}>
              <div style={{ ...labelStyle, marginBottom:6 }}>{t.label}</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:34, fontWeight:800, color:t.accent, lineHeight:1 }}>{t.value}</div>
              <div style={{ fontSize:11, color:muted, marginTop:4 }}>{t.sub}</div>
            </div>
          ))}
        </div>

        {/* Fletcher urgent banner */}
        <div style={{ background:'#FEE2E2', border:'1.5px solid #FECACA', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:12 }}>
          <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'#991B1B', letterSpacing:'0.02em' }}>
              Immediate action required — SSgt Fletcher L.
            </div>
            <div style={{ fontSize:12, color:'#7F1D1D', marginTop:3 }}>
              DBS expired 1 Dec 2025. Must be stood down from all cadet contact immediately until renewal is confirmed.
              Contact Wing Admin Officer.
            </div>
          </div>
        </div>

        {/* Staff table */}
        <div style={{ ...card }}>
          {/* Table header */}
          <div style={{
            display:'grid', gridTemplateColumns:'60px 1.8fr 1.5fr 1.5fr 1.5fr 1.8fr',
            padding:'10px 18px', borderBottom:`1px solid ${border}`, background:'#F8FAFF',
            gap:12,
          }}>
            {['Rank','Name','Role','DBS Check','Safeguarding','Classification'].map(h => (
              <div key={h} style={colHeader}>{h}</div>
            ))}
          </div>

          {STAFF_DATA.map(s => {
            const dbsSt  = s.dbs.status;
            const safeSt = s.safeguarding.status;
            const isExpanded = expandedId === s.id;
            const isExpired  = dbsSt === 'expired';
            const hasIssue   = dbsSt !== 'current' || safeSt !== 'current';

            return (
              <div key={s.id} style={{
                borderLeft: isExpired ? '3px solid #C8102E' : hasIssue ? '3px solid #D97706' : '3px solid transparent',
                borderBottom:`1px solid ${border}`,
              }}>
                {/* Row */}
                <div
                  onClick={() => toggleExpand(s.id)}
                  style={{
                    display:'grid', gridTemplateColumns:'60px 1.8fr 1.5fr 1.5fr 1.5fr 1.8fr',
                    padding:'13px 18px', cursor:'pointer', alignItems:'center', gap:12,
                    background: isExpanded ? '#F8FAFF' : 'white',
                    transition:'background 0.15s',
                  }}
                >
                  {/* Rank badge */}
                  <div>
                    <span style={{
                      ...rankBadgeStyle(s.rank),
                      padding:'2px 6px', borderRadius:6, fontSize:10, fontWeight:800,
                      fontFamily:'Barlow Condensed,sans-serif', whiteSpace:'nowrap',
                    }}>
                      {s.rank}
                    </span>
                  </div>

                  {/* Name */}
                  <div style={{ fontWeight:700, fontSize:13, color:'#111', fontFamily:'Barlow,sans-serif' }}>
                    {s.name}
                    <span style={{ fontSize:10, color:muted, marginLeft:6, fontWeight:400 }}>{s.ini}</span>
                  </div>

                  {/* Role */}
                  <div style={{ fontSize:12, color:muted }}>{s.role}</div>

                  {/* DBS */}
                  <StatusPill status={dbsSt} label={formatDate(s.dbs.expiry)} />

                  {/* Safeguarding */}
                  <StatusPill status={safeSt} label={formatDate(s.safeguarding.expiry)} />

                  {/* Classification + expand arrow */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                    <span style={{
                      ...classStyle(s.classification),
                      padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700,
                    }}>
                      {s.classification}
                    </span>
                    <span style={{ color:muted, fontSize:11 }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    borderTop:`1px solid ${border}`,
                    borderLeft: isExpired ? 'none' : 'none',
                    background:'#F8FAFF',
                    padding:'16px 18px 20px',
                  }}>
                    {/* Fletcher expired banner inside row */}
                    {isExpired && (
                      <div style={{ background:'#FEE2E2', border:'1.5px solid #FECACA', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:10 }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>🚫</span>
                        <div>
                          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800, color:'#991B1B' }}>CFAV Stood Down — Immediate Action Required</div>
                          <div style={{ fontSize:12, color:'#7F1D1D', marginTop:3 }}>
                            {s.rank} {s.name} DBS expired {formatDate(s.dbs.expiry)}. This CFAV must not have unsupervised contact with cadets until a valid DBS is confirmed. Contact Wing Admin Officer immediately.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact row */}
                    <div style={{ display:'flex', gap:24, marginBottom:16 }}>
                      <div style={{ fontSize:12, color:muted }}>
                        <span style={{ fontWeight:700, color:navy }}>📞 </span>{s.phone}
                      </div>
                      <div style={{ fontSize:12, color:muted }}>
                        <span style={{ fontWeight:700, color:navy }}>✉ </span>
                        <a href={`mailto:${s.email}`} style={{ color:navy, textDecoration:'none' }}>{s.email}</a>
                      </div>
                    </div>

                    {/* Compliance detail grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                      {/* DBS */}
                      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        <div style={labelStyle}>DBS Enhanced Check</div>
                        <StatusPill status={dbsSt} label={formatDate(s.dbs.expiry)} />
                        <div style={{ fontSize:11, color:muted, margin:'8px 0' }}>3-year renewal cycle. Managed by Volunteer Police.</div>
                        {(dbsSt === 'expired' || dbsSt === 'expiring') && (
                          <button
                            onClick={() => handleRequestRenewal(s, 'DBS Enhanced Check')}
                            style={{ fontSize:11, fontWeight:700, padding:'5px 12px', border:`1.5px solid ${red}`, borderRadius:7, background:'white', color:red, cursor:'pointer' }}>
                            Request renewal
                          </button>
                        )}
                        {dbsSt === 'current' && <span style={{ fontSize:11, color:'#065F46', fontWeight:600 }}>✓ All current</span>}
                      </div>

                      {/* Safeguarding */}
                      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        <div style={labelStyle}>Safeguarding / MACP</div>
                        <StatusPill status={safeSt} label={formatDate(s.safeguarding.expiry)} />
                        <div style={{ fontSize:11, color:muted, margin:'8px 0' }}>Annual online MACP module. Expires 12 months from completion.</div>
                        {(safeSt === 'expired' || safeSt === 'expiring') && (
                          <button
                            onClick={() => handleRequestRenewal(s, 'MACP Safeguarding')}
                            style={{ fontSize:11, fontWeight:700, padding:'5px 12px', border:`1.5px solid #D97706`, borderRadius:7, background:'white', color:'#92400E', cursor:'pointer' }}>
                            Request renewal
                          </button>
                        )}
                        {!s.training.macp && safeSt === 'current' && (
                          <div style={{ fontSize:11, color:'#92400E', fontWeight:600, marginTop:4 }}>⚠ MACP module not recorded</div>
                        )}
                        {s.training.macp && safeSt === 'current' && <span style={{ fontSize:11, color:'#065F46', fontWeight:600 }}>✓ All current</span>}
                      </div>

                      {/* Classification */}
                      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        <div style={labelStyle}>RAFAC Classification</div>
                        <span style={{ ...classStyle(s.classification), padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:700 }}>{s.classification}</span>
                        <div style={{ fontSize:11, color:muted, marginTop:8 }}>Instructor → Qualified Instructor → QI Specialist</div>
                      </div>

                      {/* AVIP */}
                      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        <div style={labelStyle}>AVIP</div>
                        <StatusPill
                          status={s.avip ? 'current' : 'none'}
                          label={s.avip ? 'Eligible' : 'Not eligible'}
                        />
                        <div style={{ fontSize:11, color:muted, marginTop:8 }}>Annual Voluntary Instructor Payment. Requires ≥30 parade nights/year.</div>
                      </div>

                      {/* Flying Med */}
                      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        <div style={labelStyle}>Flying Supervision Medical</div>
                        {s.flyingMed === 'current'
                          ? <StatusPill status='current' label='Current' />
                          : <span style={{ fontSize:11, color:'#6B7280' }}>N/A — not required for role</span>
                        }
                        <div style={{ fontSize:11, color:muted, marginTop:8 }}>Required for AEF flying supervision. Biennial renewal.</div>
                        {(s.flyingMed === 'expired' || s.flyingMed === 'expiring') && (
                          <button
                            onClick={() => handleRequestRenewal(s, 'Flying Medical')}
                            style={{ fontSize:11, fontWeight:700, padding:'5px 12px', border:`1.5px solid ${navy}`, borderRadius:7, background:'white', color:navy, cursor:'pointer', marginTop:6 }}>
                            Request renewal
                          </button>
                        )}
                      </div>

                      {/* First Aid */}
                      <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:8, padding:'12px 14px' }}>
                        <div style={labelStyle}>First Aid</div>
                        {s.firstAid === 'current'
                          ? <StatusPill status='current' label='Current' />
                          : <StatusPill status='none' label='None recorded' />
                        }
                        <div style={{ fontSize:11, color:muted, marginTop:8 }}>Required for designated DSA/role. 3-year certification.</div>
                        {s.training.firstAidDate && (
                          <div style={{ fontSize:11, color:muted, marginTop:4 }}>Last: {formatDate(s.training.firstAidDate)}</div>
                        )}
                        {s.firstAid !== 'current' && (
                          <button
                            onClick={() => handleRequestRenewal(s, 'First Aid')}
                            style={{ fontSize:11, fontWeight:700, padding:'5px 12px', border:`1.5px solid ${navy}`, borderRadius:7, background:'white', color:navy, cursor:'pointer', marginTop:6 }}>
                            Request renewal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TAB 2: Compliance Dashboard
  // ─────────────────────────────────────────────────────────────────────────
  function renderCompliance() {
    // Build issues list
    const issues = [];
    for (const s of STAFF_DATA) {
      if (s.dbs.status === 'expired')
        issues.push({ s, req:'DBS', severity:'expired', detail:`Expired ${formatDate(s.dbs.expiry)}. Must be renewed immediately.` });
      if (s.dbs.status === 'expiring')
        issues.push({ s, req:'DBS', severity:'expiring', detail:`Expires ${formatDate(s.dbs.expiry)} — ${daysBetween(s.dbs.expiry)} days remaining.` });
      if (s.safeguarding.status === 'expired')
        issues.push({ s, req:'Safeguarding', severity:'expired', detail:`MACP expired ${formatDate(s.safeguarding.expiry)}.` });
      if (s.safeguarding.status === 'expiring')
        issues.push({ s, req:'Safeguarding', severity:'expiring', detail:`MACP expires ${formatDate(s.safeguarding.expiry)} — ${daysBetween(s.safeguarding.expiry)} days remaining.` });
      if (!s.training.macp)
        issues.push({ s, req:'MACP Module', severity:'expiring', detail:'MACP module completion not recorded for this training year.' });
    }

    const urgentCount = issues.filter(i => i.severity === 'expired').length;

    return (
      <div>
        {/* Top banner */}
        {urgentCount > 0 && (
          <div style={{ background:'#FEE2E2', border:'1.5px solid #FECACA', borderRadius:10, padding:'12px 18px', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:20 }}>🚨</span>
            <div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'#991B1B' }}>
                {urgentCount} item{urgentCount !== 1 ? 's' : ''} require immediate attention
              </div>
              <div style={{ fontSize:12, color:'#7F1D1D' }}>Expired certifications prevent cadet contact. Act immediately.</div>
            </div>
          </div>
        )}

        {/* As-at subtitle */}
        <div style={{ fontSize:12, color:muted, marginBottom:16 }}>As at 14 Jun 2026</div>

        {/* Per-CFAV compliance matrix */}
        <div style={{ ...card, marginBottom:20 }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'10px 18px', borderBottom:`1px solid ${border}`, background:'#F8FAFF', gap:8 }}>
            {['CFAV','DBS','Safeguarding','MACP Module','First Aid'].map(h => (
              <div key={h} style={colHeader}>{h}</div>
            ))}
          </div>

          {STAFF_DATA.map(s => {
            const dbsSt  = s.dbs.status;
            const safeSt = s.safeguarding.status;
            const macpSt = s.training.macp ? 'current' : 'expiring';
            const faSt   = s.firstAid === 'current' ? 'current' : 'none';
            const hasExpired = dbsSt === 'expired' || safeSt === 'expired';
            const hasIssue   = hasExpired || dbsSt === 'expiring' || safeSt === 'expiring' || !s.training.macp;

            return (
              <div key={s.id} style={{
                borderLeft: hasExpired ? '3px solid #C8102E' : hasIssue ? '3px solid #D97706' : '3px solid transparent',
                borderBottom:`1px solid ${border}`,
              }}>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'13px 18px', alignItems:'center', gap:8 }}>
                  {/* Name */}
                  <div>
                    <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800, color:navy }}>
                      {s.rank} {s.name}
                    </div>
                    <div style={{ fontSize:11, color:muted }}>{s.role}</div>
                  </div>

                  {/* DBS dot */}
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Dot status={dbsSt} />
                    <span style={{ fontSize:11, color: dbsSt === 'expired' ? '#991B1B' : dbsSt === 'expiring' ? '#92400E' : '#065F46' }}>
                      {dbsSt === 'expired' ? 'Expired' : dbsSt === 'expiring' ? 'Expiring' : 'OK'}
                    </span>
                  </div>

                  {/* Safeguarding dot */}
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Dot status={safeSt} />
                    <span style={{ fontSize:11, color: safeSt === 'expired' ? '#991B1B' : safeSt === 'expiring' ? '#92400E' : '#065F46' }}>
                      {safeSt === 'expired' ? 'Expired' : safeSt === 'expiring' ? 'Expiring' : 'OK'}
                    </span>
                  </div>

                  {/* MACP dot */}
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Dot status={macpSt} />
                    <span style={{ fontSize:11, color: s.training.macp ? '#065F46' : '#92400E' }}>
                      {s.training.macp ? 'Done' : 'Pending'}
                    </span>
                  </div>

                  {/* First Aid dot */}
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    {s.firstAid === null
                      ? <><Dot status='none' /><span style={{ fontSize:11, color:'#6B7280' }}>N/A</span></>
                      : <><Dot status={faSt} /><span style={{ fontSize:11, color:'#065F46' }}>OK</span></>
                    }
                  </div>
                </div>

                {/* Expandable issue detail */}
                {hasIssue && (
                  <div style={{ padding:'0 18px 14px', borderTop:`1px solid ${border}` }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10, alignItems:'center' }}>
                      {dbsSt !== 'current' && (
                        <div style={{ fontSize:11, color: dbsSt === 'expired' ? '#991B1B' : '#92400E', fontWeight:600 }}>
                          {dbsSt === 'expired' ? '⛔' : '⚠️'} DBS: {formatDate(s.dbs.expiry)}
                        </div>
                      )}
                      {safeSt !== 'current' && (
                        <div style={{ fontSize:11, color: safeSt === 'expired' ? '#991B1B' : '#92400E', fontWeight:600 }}>
                          {safeSt === 'expired' ? '⛔' : '⚠️'} Safeguarding: {formatDate(s.safeguarding.expiry)}
                        </div>
                      )}
                      {!s.training.macp && (
                        <div style={{ fontSize:11, color:'#92400E', fontWeight:600 }}>⚠️ MACP not completed</div>
                      )}
                      <button
                        onClick={() => {
                          showToast(`📧 Renewal reminder sent to ${s.rank} ${s.name}`);
                          addAudit?.('Reminder Sent', `${s.rank} ${s.name}`, 'Compliance renewal reminder sent');
                        }}
                        style={{ marginLeft:'auto', fontSize:11, fontWeight:700, padding:'5px 14px', border:`1.5px solid ${navy}`, borderRadius:7, background:'white', color:navy, cursor:'pointer' }}>
                        Send renewal reminder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action items list */}
        {issues.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:12 }}>Action Items</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {issues.map((iss, i) => (
                <div key={i} style={{
                  background: iss.severity === 'expired' ? '#FEF2F2' : '#FFFBEB',
                  border:`1px solid ${iss.severity === 'expired' ? '#FECACA' : '#FDE68A'}`,
                  borderLeft:`4px solid ${iss.severity === 'expired' ? '#DC2626' : '#D97706'}`,
                  borderRadius:8, padding:'12px 16px',
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
                }}>
                  <div>
                    <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800, color: iss.severity === 'expired' ? '#991B1B' : '#92400E' }}>
                      {iss.s.rank} {iss.s.name} — {iss.req}
                    </div>
                    <div style={{ fontSize:12, color: iss.severity === 'expired' ? '#7F1D1D' : '#78350F', marginTop:2 }}>{iss.detail}</div>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`📧 Reminder sent to ${iss.s.rank} ${iss.s.name} re: ${iss.req}`);
                      addAudit?.('Reminder Sent', `${iss.s.rank} ${iss.s.name}`, `${iss.req} renewal reminder sent`);
                    }}
                    style={{ flexShrink:0, fontSize:11, fontWeight:700, padding:'6px 14px', border:`1.5px solid ${iss.severity === 'expired' ? '#DC2626' : '#D97706'}`, borderRadius:7, background:'white', color: iss.severity === 'expired' ? '#DC2626' : '#D97706', cursor:'pointer', whiteSpace:'nowrap' }}>
                    Send renewal reminder
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ background:'#F8FAFF', border:`1px solid ${border}`, borderRadius:8, padding:'12px 16px', fontSize:12, color:muted }}>
          📅 <strong>Next compliance review:</strong> 31 Jul 2026 (end of training year)
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TAB 3: Training Record
  // ─────────────────────────────────────────────────────────────────────────
  function renderTraining() {
    const TRAINING_TYPES = ['MACP', 'TG/VR', 'First Aid', 'Flying Medical', 'Other'];

    function trainingCellStatus(s, col) {
      if (col === 'MACP Safeguarding') {
        return s.training.macp ? 'done' : 'pending';
      }
      if (col === 'TG/VR Range Safety') {
        return s.training.tgvr ? 'done' : 'pending';
      }
      if (col === 'First Aid') {
        if (!s.firstAid) return 'na';
        return s.firstAid === 'current' ? 'done' : 'pending';
      }
      if (col === 'Flying Supervision Auth') {
        if (!s.flyingMed) return 'na';
        return s.training.supervisorAuth ? 'done' : 'pending';
      }
      return 'na';
    }

    function CellChip({ status }) {
      if (status === 'done')    return <span style={{ background:'#D1FAE5', color:'#065F46', border:'1px solid #A7F3D0', padding:'2px 9px', borderRadius:8, fontSize:10, fontWeight:700 }}>✓ Done</span>;
      if (status === 'pending') return <span style={{ background:'#FEF3C7', color:'#92400E', border:'1px solid #FDE68A', padding:'2px 9px', borderRadius:8, fontSize:10, fontWeight:700 }}>⏳ Pending</span>;
      return <span style={{ color:'#9CA3AF', fontSize:11 }}>N/A</span>;
    }

    const cols = ['MACP Safeguarding', 'TG/VR Range Safety', 'First Aid', 'Flying Supervision Auth'];

    return (
      <div>
        {/* Training year banner */}
        <div style={{ background:'#EAF4FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'13px 18px', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:20 }}>📅</span>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'#1E40AF' }}>Training Year 2025–2026 · Ends 31 Jul 2026</div>
            <div style={{ fontSize:12, color:'#1E3A8A' }}>All mandatory training must be completed before the training year end date.</div>
          </div>
        </div>

        {/* Log training button */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
          <button
            onClick={() => setShowLogForm(v => !v)}
            style={{ fontSize:13, fontWeight:700, padding:'8px 20px', border:`1.5px solid ${navy}`, borderRadius:8, background: showLogForm ? 'white' : navy, color: showLogForm ? navy : 'white', cursor:'pointer', fontFamily:'Barlow,sans-serif', transition:'all 0.15s' }}>
            {showLogForm ? 'Cancel' : '+ Log Training'}
          </button>
        </div>

        {/* Log form */}
        {showLogForm && (
          <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'20px', marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:16 }}>Log Completed Training</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:16 }}>
              {/* CFAV */}
              <div>
                <label style={{ ...labelStyle, display:'block', marginBottom:5 }}>CFAV *</label>
                <select
                  value={logForm.staffId}
                  onChange={e => setLogForm(p => ({ ...p, staffId:e.target.value }))}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'Barlow,sans-serif', color:navy, background:'white' }}>
                  {STAFF_DATA.map(s => (
                    <option key={s.id} value={s.id}>{s.rank} {s.name}</option>
                  ))}
                </select>
              </div>

              {/* Training type */}
              <div>
                <label style={{ ...labelStyle, display:'block', marginBottom:5 }}>Training Type *</label>
                <select
                  value={logForm.type}
                  onChange={e => setLogForm(p => ({ ...p, type:e.target.value }))}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'Barlow,sans-serif', color:navy, background:'white' }}>
                  {TRAINING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label style={{ ...labelStyle, display:'block', marginBottom:5 }}>Date Completed *</label>
                <input
                  type='date'
                  value={logForm.date}
                  onChange={e => setLogForm(p => ({ ...p, date:e.target.value }))}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'Barlow,sans-serif', color:navy, boxSizing:'border-box' }} />
              </div>

              {/* Ref */}
              <div>
                <label style={{ ...labelStyle, display:'block', marginBottom:5 }}>Certificate Ref</label>
                <input
                  type='text'
                  value={logForm.ref}
                  placeholder='Optional…'
                  onChange={e => setLogForm(p => ({ ...p, ref:e.target.value }))}
                  style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontFamily:'Barlow,sans-serif', color:navy, boxSizing:'border-box' }} />
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={submitLog}
                style={{ fontSize:12, fontWeight:700, padding:'8px 22px', border:`1.5px solid ${navy}`, borderRadius:7, background:navy, color:'white', cursor:'pointer' }}>
                Submit
              </button>
              <button
                onClick={() => { setShowLogForm(false); setLogForm({ staffId:'s01', type:'MACP', date:'2026-06-14', ref:'' }); }}
                style={{ fontSize:12, fontWeight:700, padding:'8px 22px', border:`1.5px solid ${border}`, borderRadius:7, background:'white', color:muted, cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Training matrix */}
        <div style={{ ...card, marginBottom:20 }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:`1.8fr ${cols.map(() => '1fr').join(' ')}`, padding:'10px 18px', borderBottom:`1px solid ${border}`, background:'#F8FAFF', gap:10 }}>
            <div style={colHeader}>CFAV</div>
            {cols.map(c => <div key={c} style={colHeader}>{c}</div>)}
          </div>

          {STAFF_DATA.map(s => (
            <div key={s.id} style={{ borderBottom:`1px solid ${border}` }}>
              <div style={{ display:'grid', gridTemplateColumns:`1.8fr ${cols.map(() => '1fr').join(' ')}`, padding:'13px 18px', alignItems:'center', gap:10 }}>
                <div>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:800, color:navy }}>{s.rank} {s.name}</div>
                  <div style={{ fontSize:11, color:muted }}>{s.role}</div>
                </div>
                {cols.map(c => (
                  <CellChip key={c} status={trainingCellStatus(s, c)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logged entries */}
        {trainingLog.length > 0 && (
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:12 }}>
              Logged Training Entries ({trainingLog.length})
            </div>
            <div style={{ ...card }}>
              {/* Header */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1fr 1fr', padding:'10px 18px', borderBottom:`1px solid ${border}`, background:'#F8FAFF', gap:10 }}>
                {['CFAV','Type','Date','Ref'].map(h => <div key={h} style={colHeader}>{h}</div>)}
              </div>
              {trainingLog.map(entry => (
                <div key={entry.id} style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1fr 1fr', padding:'12px 18px', borderBottom:`1px solid ${border}`, alignItems:'center', gap:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:navy }}>{entry.staffName}</div>
                  <div style={{ fontSize:12, color:muted }}>{entry.type}</div>
                  <div style={{ fontSize:12, color:muted }}>{formatDate(entry.date)}</div>
                  <div style={{ fontSize:12, color:muted, fontFamily:'monospace' }}>{entry.ref || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TAB 4: Roles & Responsibilities
  // ─────────────────────────────────────────────────────────────────────────
  function renderRoles() {
    const fletcher = STAFF_DATA.find(s => s.id === 's03');
    const fletcherDbsExpired = fletcher.dbs.status === 'expired';

    const MANDATORY_POSTS = [
      {
        post:'OC',
        desc:'Commanding Officer — overall command & responsibility',
        staffId:'s01',
        note:'Sqn Ldr Harris',
        status:'filled',
      },
      {
        post:'Adjutant',
        desc:'Administration & correspondence',
        staffId:'s04',
        note:'Sgt Thomas',
        status:'filled',
      },
      {
        post:'Training Officer',
        desc:'Programme management & cadet classification',
        staffId:'s02',
        note:'Plt Off Smith',
        status:'filled',
      },
      {
        post:'Safeguarding DSL',
        desc:'Designated Safeguarding Lead — must hold current MACP',
        staffId:'s01',
        note:'Sqn Ldr Harris',
        status:'filled',
      },
      {
        post:'Band PI',
        desc:'Band programme & parade',
        staffId:'s03',
        note:'SSgt Fletcher',
        status:'dbs-issue',
      },
      {
        post:'Welfare Officer',
        desc:'Cadet & CFAV welfare support',
        staffId:null,
        note:null,
        status:'vacant',
      },
      {
        post:'AVIP Administrator',
        desc:'Attendance records & AVIP claims processing',
        staffId:'s05',
        note:'Cpl McLeod',
        status:'filled',
      },
    ];

    function postBorderColor(status) {
      if (status === 'filled')    return '#059669';
      if (status === 'dbs-issue') return '#D97706';
      if (status === 'vacant')    return red;
      return border;
    }

    function postBg(status) {
      if (status === 'vacant')    return '#FEF2F2';
      return 'white';
    }

    return (
      <div>
        {/* Section header */}
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy, marginBottom:4 }}>
          Mandatory Posts — 1701 (Johnstone) Squadron
        </div>
        <div style={{ fontSize:12, color:muted, marginBottom:20 }}>
          AP1919 Chapter 4 · All posts must be filled at all times
        </div>

        {/* Post cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:24 }}>
          {MANDATORY_POSTS.map(p => {
            const s = STAFF_DATA.find(x => x.id === p.staffId);
            return (
              <div key={p.post} style={{
                background: postBg(p.status),
                border:`1.5px solid ${postBorderColor(p.status)}`,
                borderRadius:10,
                padding:'16px 18px',
              }}>
                <div style={{ fontSize:10, fontWeight:700, color:muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>{p.post}</div>

                {p.status === 'vacant' && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:18 }}>⚠️</span>
                    <div>
                      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:red }}>VACANT</div>
                      <div style={{ fontSize:11, color:'#7F1D1D', marginTop:2 }}>Notify Wing HQ within 7 days</div>
                    </div>
                  </div>
                )}

                {p.status === 'dbs-issue' && s && (
                  <div>
                    <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy, marginBottom:2 }}>
                      {s.rank} {s.name}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                      <StatusPill status='expired' label='DBS Expired' />
                      <span style={{ fontSize:11, color:'#92400E', fontWeight:600 }}>⚠ Stood down pending renewal</span>
                    </div>
                  </div>
                )}

                {p.status === 'filled' && s && (
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy, marginBottom:4 }}>
                    {s.rank} {s.name}
                  </div>
                )}

                <div style={{ fontSize:12, color:muted }}>{p.desc}</div>

                {p.status === 'filled' && (
                  <div style={{ marginTop:8 }}>
                    <span style={{ background:'#D1FAE5', color:'#065F46', border:'1px solid #A7F3D0', padding:'2px 9px', borderRadius:8, fontSize:10, fontWeight:700 }}>
                      ✓ Filled
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Policy note */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'13px 18px', marginBottom:20, fontSize:12, color:'#78350F' }}>
          <strong>Policy:</strong> All mandatory posts must be filled at all times. Vacancies must be notified to Wing HQ within 7 days — AP1919 Chapter 4. If a post-holder is temporarily unavailable, the OC must formally delegate.
        </div>

        {/* Wing HQ contacts */}
        <div style={{ background:'white', border:`1.5px solid ${border}`, borderRadius:10, padding:'18px 22px' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy, marginBottom:14 }}>
            Wing HQ Contacts
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            <div style={{ background:'#F8FAFF', border:`1px solid ${border}`, borderRadius:8, padding:'12px 16px' }}>
              <div style={labelStyle}>Wing Commander</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>Wg Cdr Blackwood</div>
              <div style={{ fontSize:12, color:muted, marginTop:2 }}>West Scotland Wing</div>
            </div>
            <div style={{ background:'#F8FAFF', border:`1px solid ${border}`, borderRadius:8, padding:'12px 16px' }}>
              <div style={labelStyle}>Wing Admin Officer</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>Sqn Ldr P. McAlister</div>
              <div style={{ fontSize:12, color:muted, marginTop:2 }}>07700 900555</div>
            </div>
            <div style={{ background:'#F8FAFF', border:`1px solid ${border}`, borderRadius:8, padding:'12px 16px' }}>
              <div style={labelStyle}>Safeguarding SCC</div>
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:navy }}>Sqn Ldr P. McAlister</div>
              <div style={{ fontSize:12, color:muted, marginTop:2 }}>07700 900555</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Tab bar config ─────────────────────────────────────────────────────
  const TABS = [
    { id:'register',   label:'Staff Register' },
    { id:'compliance', label:'Compliance Dashboard' },
    { id:'training',   label:'Training Record' },
    { id:'roles',      label:'Roles & Responsibilities' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:'Barlow,sans-serif' }}>
      {/* Page header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:24, fontWeight:800, color:navy, marginBottom:3 }}>
            Staff Management
          </div>
          <div style={{ fontSize:12, color:muted }}>
            CFAV Register · Compliance · Training · Roles — 1701 (Johnstone) Squadron
          </div>
        </div>
        <button onClick={printStaffRegister}
          style={{ padding:'8px 16px', background:'white', color:navy, border:`1.5px solid ${border}`, borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', flexShrink:0 }}>
          📄 Print Register
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:0, marginBottom:24, borderBottom:`2px solid ${border}` }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding:'9px 22px', border:'none', background:'none', cursor:'pointer',
              fontFamily:'Barlow,sans-serif', fontSize:13,
              fontWeight: tab === t.id ? 800 : 500,
              color: tab === t.id ? navy : muted,
              borderBottom: tab === t.id ? `3px solid ${navy}` : '3px solid transparent',
              marginBottom:-2, whiteSpace:'nowrap', transition:'color 0.15s',
            }}>
            {t.label}
            {t.id === 'compliance' && COMPLIANCE_ISSUES_COUNT > 0 && (
              <span style={{
                marginLeft:7, background:'#DC2626', color:'white',
                borderRadius:'50%', fontSize:9, fontWeight:800,
                width:16, height:16, display:'inline-flex',
                alignItems:'center', justifyContent:'center', verticalAlign:'middle',
              }}>
                {COMPLIANCE_ISSUES_COUNT}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'register'   && renderRegister()}
      {tab === 'compliance' && renderCompliance()}
      {tab === 'training'   && renderTraining()}
      {tab === 'roles'      && renderRoles()}
    </div>
  );
}
