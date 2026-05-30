/**
 * Scotland & N Ireland Wing — West Scotland Sector
 * Wing HQ Reporting Interface — Prototype
 *
 * OFFICIAL-SENSITIVE
 * Aggregate data only. No individual personal identifiers displayed at Wing tier.
 * Individual records held at squadron level under DPA 2018 / UK GDPR.
 */

import { useState, useEffect } from 'react';
import {
  BarChart3, Shield, Users, AlertTriangle, Check, Clock,
  ChevronRight, Flag, TrendingUp, TrendingDown, Activity,
  Bell, FileText, Calendar, CheckCircle, XCircle, AlertCircle,
  Plane, Crosshair, Mountain, Zap, Info, Eye, Lock, Award
} from 'lucide-react';
import {
  SQUADRON, EVENTS,
  getWingAggregates, subscribeFormUpdates,
} from './dataStore.js';

export default function WingApp() {

  // === ALL STATE AT TOP ===
  const [tab, setTab]             = useState('overview');
  const [approvalState, setApprovalState] = useState({});
  const [toast, setToast]         = useState(null);

  // 1701's live stats — recomputed whenever a form is signed in cadet portal
  const [stats1701, setStats1701] = useState(() => getWingAggregates());

  useEffect(() => {
    return subscribeFormUpdates(() => setStats1701(getWingAggregates()));
  }, []);

  const fireToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // === SECTOR DATA ===
  // Mock aggregates for other West Scotland Sector squadrons (no individual PII)
  const OTHER_SQUADRONS = [
    { number:341,  name:'341 (City of Glasgow)',     oic:'Flt Lt D. Harris',    strength:31, avgAtt:79, hsCompliance:92, dbsAlerts:0, pendingApprovals:1, formsOut:3,  shootEligible:19, flyEligible:25 },
    { number:1435, name:'1435 (Greenock)',            oic:'FS E. Brennan',       strength:14, avgAtt:88, hsCompliance:100,dbsAlerts:1, pendingApprovals:0, formsOut:0,  shootEligible:8,  flyEligible:12 },
    { number:1490, name:'1490 (Bearsden)',            oic:'Flt Lt R. Drummond',  strength:22, avgAtt:83, hsCompliance:87, dbsAlerts:0, pendingApprovals:2, formsOut:5,  shootEligible:14, flyEligible:18 },
    { number:1503, name:'1503 (Dumbarton)',           oic:'Plt Off K. Singh',    strength:18, avgAtt:75, hsCompliance:78, dbsAlerts:2, pendingApprovals:1, formsOut:8,  shootEligible:9,  flyEligible:14 },
    { number:1622, name:'1622 (East Renfrewshire)',  oic:'CI L. MacKay',         strength:26, avgAtt:86, hsCompliance:95, dbsAlerts:0, pendingApprovals:1, formsOut:2,  shootEligible:16, flyEligible:22 },
  ];

  const ALL_SQUADRONS = [
    {
      number: SQUADRON.number, name: SQUADRON.name, oic: SQUADRON.oic,
      strength: stats1701.strength, avgAtt: stats1701.avgAttendance,
      hsCompliance: stats1701.hsCompliance, dbsAlerts: stats1701.staffDbsExpiringSoon,
      pendingApprovals: stats1701.pendingApprovals, formsOut: stats1701.formsOutstanding,
      shootEligible: stats1701.shootingEligible, flyEligible: stats1701.flyingEligible,
      isLive: true,
    },
    ...OTHER_SQUADRONS,
  ];

  // Sector aggregates (Wing-tier — no individual data)
  const totalStrength    = ALL_SQUADRONS.reduce((s, q) => s + q.strength, 0);
  const avgAttendance    = Math.round(ALL_SQUADRONS.reduce((s, q) => s + q.avgAtt, 0) / ALL_SQUADRONS.length);
  const avgCompliance    = Math.round(ALL_SQUADRONS.reduce((s, q) => s + q.hsCompliance, 0) / ALL_SQUADRONS.length);
  const totalPending     = ALL_SQUADRONS.reduce((s, q) => s + q.pendingApprovals, 0);
  const totalDbsAlerts   = ALL_SQUADRONS.reduce((s, q) => s + q.dbsAlerts, 0);
  const lowCompSqns      = ALL_SQUADRONS.filter(q => q.hsCompliance < 85);

  // Pending Wing approvals list (1701 live + mock for others)
  const ALL_APPROVALS = [
    ...EVENTS
      .filter(e => e.status === 'pending')
      .map(e => ({
        id: `1701-${e.id}`, sqnName: SQUADRON.name, sqnNum: SQUADRON.number,
        activity: e.name, date: e.date, type: e.type, leadStaff: e.leadStaff,
      })),
    { id:'341-a1',  sqnName:'341 (City of Glasgow)',    sqnNum:341,  activity:'Mountain Navigation Assessment', date:'2026-06-07', type:'Adventure Training',  leadStaff:'Flt Lt Harris'   },
    { id:'1490-a1', sqnName:'1490 (Bearsden)',           sqnNum:1490, activity:'AEF Allocation — Leuchars',      date:'2026-06-14', type:'Flying',               leadStaff:'Flt Lt Drummond' },
    { id:'1490-a2', sqnName:'1490 (Bearsden)',           sqnNum:1490, activity:'Range Day — .22 Bisley',         date:'2026-05-30', type:'Shooting',             leadStaff:'FS Drummond'     },
    { id:'1503-a1', sqnName:'1503 (Dumbarton)',          sqnNum:1503, activity:'DofE Bronze Expedition',         date:'2026-06-20', type:'Adventure Training',   leadStaff:'Plt Off Singh'   },
    { id:'1622-a1', sqnName:'1622 (East Renfrewshire)', sqnNum:1622,  activity:'STEM / Cyber Gold Course',       date:'2026-06-05', type:'Radio/Cyber',          leadStaff:'CI MacKay'       },
  ];

  const pendingApprovals = ALL_APPROVALS.filter(a => !approvalState[a.id]);
  const approvedCount    = Object.values(approvalState).filter(v => v === 'approved').length;
  const rejectedCount    = Object.values(approvalState).filter(v => v === 'rejected').length;

  // ── Helpers ──
  const compBand = (pct) => {
    if (pct >= 95) return { color:'#16a34a', bg:'#f0fdf4', ring:'#bbf7d0', label:'Compliant'       };
    if (pct >= 85) return { color:'#d97706', bg:'#fffbeb', ring:'#fde68a', label:'Monitor'          };
    if (pct >= 75) return { color:'#ea580c', bg:'#fff7ed', ring:'#fed7aa', label:'Watch'            };
    return              { color:'#dc2626', bg:'#fef2f2', ring:'#fecaca', label:'Action Required'   };
  };

  const attBand = (pct) => {
    if (pct >= 85) return '#16a34a';
    if (pct >= 75) return '#d97706';
    return '#dc2626';
  };

  const typeIcon = (type) => {
    if (type === 'Shooting')           return <Crosshair size={14} />;
    if (type === 'Flying')             return <Plane size={14} />;
    if (type === 'Adventure Training') return <Mountain size={14} />;
    if (type === 'Radio/Cyber')        return <Zap size={14} />;
    return <Calendar size={14} />;
  };

  const typeColor = (type) => {
    if (type === 'Shooting')           return '#ef4444';
    if (type === 'Flying')             return '#3b82f6';
    if (type === 'Adventure Training') return '#10b981';
    if (type === 'Radio/Cyber')        return '#a855f7';
    return '#6b7280';
  };

  // === INLINE CSS ===
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

    body { background: #f1f5f9; margin: 0; }

    .wing-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Geist', system-ui, sans-serif;
      background: #f1f5f9;
    }

    /* Top header */
    .wing-header {
      background: #001f5b;
      color: #fff;
      padding: 0 24px;
      height: 58px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
      border-bottom: 3px solid #cf142b;
    }

    .wing-wordmark {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .wing-sub {
      font-size: 11px;
      opacity: 0.55;
      font-weight: 400;
    }

    .os-badge {
      margin-left: auto;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      background: rgba(200,161,16,0.18);
      border: 1px solid rgba(200,161,16,0.4);
      color: #fbbf24;
      padding: 3px 10px;
      border-radius: 4px;
    }

    /* Tab bar */
    .wing-tabs {
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      padding: 0 24px;
      gap: 2px;
    }

    .wing-tab {
      padding: 14px 18px;
      font-size: 13px;
      font-weight: 500;
      color: #64748b;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      transition: all 0.12s;
      white-space: nowrap;
      position: relative;
      bottom: -1px;
    }

    .wing-tab:hover { color: #001f5b; }
    .wing-tab.active { color: #001f5b; border-bottom-color: #001f5b; font-weight: 600; }

    .tab-badge {
      background: #ef4444;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
    }

    /* Content area */
    .wing-content {
      flex: 1;
      padding: 24px;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
    }

    /* Stat cards */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 900px) {
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .stat-card.alert { border-color: #fca5a5; background: #fff5f5; }
    .stat-card.warn  { border-color: #fde68a; background: #fffdf0; }
    .stat-card.ok    { border-color: #bbf7d0; background: #f0fdf8; }

    .stat-icon {
      width: 36px; height: 36px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 4px;
    }

    .stat-value { font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1; }
    .stat-label { font-size: 12px; color: #64748b; font-weight: 500; }
    .stat-sub   { font-size: 11px; color: #94a3b8; }

    /* Data table */
    .wing-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .wing-table th {
      text-align: left;
      padding: 10px 14px;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .wing-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .wing-table tr:hover td { background: #f8fafc; }

    .wing-table tr:last-child td { border-bottom: none; }

    /* Compliance pill */
    .comp-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Alert panel */
    .alert-panel {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }

    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid #f1f5f9;
    }

    .alert-item:last-child { border-bottom: none; }

    .alert-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }

    /* GDPR notice */
    .gdpr-bar {
      background: #f0f4ff;
      border: 1px solid #c7d7ff;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 12px;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
    }

    /* Live badge */
    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #16a34a;
    }

    .live-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #16a34a;
      animation: livepulse 1.8s ease-in-out infinite;
    }

    @keyframes livepulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.7); }
    }

    /* Toast */
    .wing-toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      animation: slideToast 0.2s ease;
    }

    @keyframes slideToast {
      from { transform: translateY(12px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }

    /* Card */
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }

    .card-head {
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 20px;
      align-items: start;
    }

    @media (max-width: 1000px) {
      .main-layout { grid-template-columns: 1fr; }
    }
  `;

  // === SCREEN COMPONENTS ===

  const OverviewTab = () => {
    const alerts = [];
    if (totalDbsAlerts > 0)
      alerts.push({ level:'warn',  text:`${totalDbsAlerts} staff DBS/CTC record${totalDbsAlerts > 1 ? 's' : ''} expiring within 90 days across sector` });
    if (lowCompSqns.length > 0)
      alerts.push({ level:'alert', text:`${lowCompSqns.map(q => q.name).join(', ')} ${lowCompSqns.length > 1 ? 'are' : 'is'} below 85% H&S form compliance` });
    if (pendingApprovals.length > 0)
      alerts.push({ level:'info',  text:`${pendingApprovals.length} activit${pendingApprovals.length > 1 ? 'ies' : 'y'} across sector awaiting Wing approval` });
    if (stats1701.formsOutstanding > 0)
      alerts.push({ level:'info',  text:`1701: ${stats1701.formsOutstanding} form${stats1701.formsOutstanding > 1 ? 's' : ''} outstanding — parent e-signature pending` });
    if (ALL_SQUADRONS.some(q => q.avgAtt < 78))
      alerts.push({ level:'warn',  text:`1503 (Dumbarton) average attendance at 75% — below 78% threshold` });

    const alertColor = { alert:'#dc2626', warn:'#d97706', info:'#3b82f6' };

    return (
      <>
        <div className="stat-grid">
          <div className="stat-card ok">
            <div className="stat-icon" style={{ background:'#dcfce7' }}>
              <Users size={18} color="#16a34a" />
            </div>
            <div className="stat-value">{totalStrength}</div>
            <div className="stat-label">Sector Strength</div>
            <div className="stat-sub">{ALL_SQUADRONS.length} squadrons</div>
          </div>

          <div className={`stat-card ${avgAttendance >= 82 ? 'ok' : avgAttendance >= 75 ? 'warn' : 'alert'}`}>
            <div className="stat-icon" style={{ background: avgAttendance >= 82 ? '#dcfce7' : '#fffbeb' }}>
              <Activity size={18} color={attBand(avgAttendance)} />
            </div>
            <div className="stat-value" style={{ color: attBand(avgAttendance) }}>{avgAttendance}%</div>
            <div className="stat-label">Avg Attendance</div>
            <div className="stat-sub">Sector parade average</div>
          </div>

          <div className={`stat-card ${avgCompliance >= 90 ? 'ok' : avgCompliance >= 80 ? 'warn' : 'alert'}`}>
            <div className="stat-icon" style={{ background: avgCompliance >= 90 ? '#dcfce7' : '#fffbeb' }}>
              <Shield size={18} color={compBand(avgCompliance).color} />
            </div>
            <div className="stat-value" style={{ color: compBand(avgCompliance).color }}>{avgCompliance}%</div>
            <div className="stat-label">H&S Compliance</div>
            <div className="stat-sub">Signed forms / total</div>
          </div>

          <div className={`stat-card ${pendingApprovals.length === 0 ? 'ok' : 'warn'}`}>
            <div className="stat-icon" style={{ background: pendingApprovals.length === 0 ? '#dcfce7' : '#fffbeb' }}>
              <Clock size={18} color={pendingApprovals.length === 0 ? '#16a34a' : '#d97706'} />
            </div>
            <div className="stat-value" style={{ color: pendingApprovals.length === 0 ? '#16a34a' : '#d97706' }}>
              {pendingApprovals.length}
            </div>
            <div className="stat-label">Pending Approvals</div>
            <div className="stat-sub">{approvedCount} approved · {rejectedCount} rejected</div>
          </div>
        </div>

        <div className="main-layout">
          <div className="card">
            <div className="card-head">
              <BarChart3 size={16} color="#001f5b" />
              Squadron Health Overview
              <span style={{ marginLeft:'auto', fontSize:'11px', color:'#94a3b8', fontWeight:400 }}>
                Aggregate data — no personal identifiers
              </span>
            </div>
            <table className="wing-table">
              <thead>
                <tr>
                  <th>Squadron</th>
                  <th>Strength</th>
                  <th>Avg Att</th>
                  <th>H&S Compliance</th>
                  <th>Forms Out</th>
                  <th>DBS Alert</th>
                </tr>
              </thead>
              <tbody>
                {ALL_SQUADRONS.map(sqn => {
                  const cb = compBand(sqn.hsCompliance);
                  return (
                    <tr key={sqn.number}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontWeight:600, color:'#0f172a' }}>{sqn.name}</span>
                          {sqn.isLive && (
                            <span className="live-badge">
                              <span className="live-dot" />LIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{sqn.oic}</div>
                      </td>
                      <td style={{ fontWeight:600 }}>{sqn.strength}</td>
                      <td>
                        <span style={{ fontWeight:600, color: attBand(sqn.avgAtt) }}>{sqn.avgAtt}%</span>
                      </td>
                      <td>
                        <span className="comp-pill"
                          style={{ background: cb.bg, color: cb.color, border:`1px solid ${cb.ring}` }}>
                          {sqn.hsCompliance}% — {cb.label}
                        </span>
                      </td>
                      <td>
                        {sqn.formsOut > 0
                          ? <span style={{ color:'#d97706', fontWeight:600 }}>{sqn.formsOut} outstanding</span>
                          : <span style={{ color:'#16a34a', fontWeight:500 }}>✓ All signed</span>}
                      </td>
                      <td>
                        {sqn.dbsAlerts > 0
                          ? <span style={{ color:'#dc2626', fontWeight:600 }}>⚠ {sqn.dbsAlerts} expiring</span>
                          : <span style={{ color:'#94a3b8' }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <div className="card">
              <div className="card-head" style={{ color: alerts.some(a => a.level === 'alert') ? '#dc2626' : '#0f172a' }}>
                <Bell size={16} />
                Alerts &amp; Actions
                {alerts.length > 0 && (
                  <span className="tab-badge" style={{ marginLeft:'auto' }}>{alerts.length}</span>
                )}
              </div>
              {alerts.length === 0 ? (
                <div style={{ padding:'24px 18px', textAlign:'center', color:'#94a3b8', fontSize:13 }}>
                  <CheckCircle size={28} color="#16a34a" style={{ marginBottom:8 }} />
                  <div>No current alerts</div>
                </div>
              ) : (
                <div className="alert-panel" style={{ border:'none', borderRadius:0 }}>
                  {alerts.map((a, i) => (
                    <div key={i} className="alert-item">
                      <div className="alert-dot"
                        style={{ background: alertColor[a.level] }} />
                      <div style={{ fontSize:12, color:'#374151', lineHeight:1.5 }}>{a.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ marginTop:16 }}>
              <div className="card-head"><Plane size={16} /> Flying Eligibility</div>
              <div style={{ padding:'14px 18px' }}>
                {ALL_SQUADRONS.map(sqn => (
                  <div key={sqn.number} style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                      <span style={{ color:'#374151', fontWeight:500 }}>{sqn.number}</span>
                      <span style={{ color:'#64748b' }}>{sqn.flyEligible}/{sqn.strength}</span>
                    </div>
                    <div style={{ height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden' }}>
                      <div style={{
                        height:'100%',
                        background: '#3b82f6',
                        width: `${Math.round((sqn.flyEligible / sqn.strength) * 100)}%`,
                        borderRadius: 3,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const SquadronsTab = () => (
    <>
      <div className="gdpr-bar">
        <Lock size={14} color="#3b82f6" />
        Squadron table shows aggregate data only. Individual cadet records are held at squadron level and are not accessible from Wing tier.
      </div>
      <div className="card">
        <div className="card-head"><Users size={16} /> West Scotland Sector — All Squadrons</div>
        <table className="wing-table">
          <thead>
            <tr>
              <th>Squadron</th>
              <th>OC</th>
              <th>Strength</th>
              <th>Avg Attendance</th>
              <th>H&S Compliance</th>
              <th>Shoot Eligible</th>
              <th>Fly Eligible</th>
              <th>DBS Alerts</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {ALL_SQUADRONS.map(sqn => {
              const cb = compBand(sqn.hsCompliance);
              return (
                <tr key={sqn.number} style={{ cursor:'default' }}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div>
                        <div style={{ fontWeight:700, color:'#0f172a', fontSize:13 }}>{sqn.name}</div>
                        {sqn.isLive && (
                          <span className="live-badge">
                            <span className="live-dot" />LIVE DATA
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ color:'#374151', fontSize:12 }}>{sqn.oic}</td>
                  <td style={{ fontWeight:700, fontSize:15 }}>{sqn.strength}</td>
                  <td>
                    <span style={{ fontWeight:600, color: attBand(sqn.avgAtt) }}>{sqn.avgAtt}%</span>
                    {sqn.avgAtt < 78 && (
                      <AlertTriangle size={12} color="#dc2626" style={{ marginLeft:5, verticalAlign:'middle' }} />
                    )}
                  </td>
                  <td>
                    <span className="comp-pill"
                      style={{ background: cb.bg, color: cb.color, border:`1px solid ${cb.ring}` }}>
                      {sqn.hsCompliance}%
                    </span>
                    <div style={{ fontSize:10, color:'#94a3b8', marginTop:2 }}>{cb.label}</div>
                  </td>
                  <td style={{ fontFamily:'Geist Mono, monospace' }}>
                    {sqn.shootEligible} <span style={{ color:'#94a3b8' }}>/{sqn.strength}</span>
                  </td>
                  <td style={{ fontFamily:'Geist Mono, monospace' }}>
                    {sqn.flyEligible} <span style={{ color:'#94a3b8' }}>/{sqn.strength}</span>
                  </td>
                  <td>
                    {sqn.dbsAlerts > 0 ? (
                      <span style={{ color:'#dc2626', fontWeight:600, fontSize:12 }}>
                        ⚠ {sqn.dbsAlerts}
                      </span>
                    ) : (
                      <span style={{ color:'#16a34a' }}>✓</span>
                    )}
                  </td>
                  <td>
                    {sqn.pendingApprovals > 0 ? (
                      <span style={{ color:'#d97706', fontWeight:600, fontSize:12 }}>
                        {sqn.pendingApprovals} event{sqn.pendingApprovals > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span style={{ color:'#94a3b8', fontSize:12 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ padding:'12px 20px', background:'#f8fafc', borderTop:'1px solid #e2e8f0',
          fontSize:11, color:'#94a3b8', display:'flex', gap:20 }}>
          <span>Total sector strength: <strong style={{ color:'#374151' }}>{totalStrength}</strong></span>
          <span>Sector avg attendance: <strong style={{ color:'#374151' }}>{avgAttendance}%</strong></span>
          <span>Sector avg compliance: <strong style={{ color: compBand(avgCompliance).color }}>{avgCompliance}%</strong></span>
        </div>
      </div>
    </>
  );

  const ApprovalsTab = () => {
    const decide = (id, decision) => {
      setApprovalState(prev => ({ ...prev, [id]: decision }));
      const a = ALL_APPROVALS.find(a => a.id === id);
      fireToast(
        `${decision === 'approved' ? 'Approved' : 'Returned'}: ${a?.activity} — ${a?.sqnName}`,
        decision === 'approved' ? 'ok' : 'warn'
      );
    };

    return (
      <>
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {[
            { label:'Awaiting decision', count: pendingApprovals.length, color:'#d97706' },
            { label:'Approved',          count: approvedCount,           color:'#16a34a' },
            { label:'Returned',          count: rejectedCount,           color:'#dc2626' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ flex:1, flexDirection:'row', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:22, fontWeight:700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize:12, color:'#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><FileText size={16} /> Activity Programme Approvals</div>
          <table className="wing-table">
            <thead>
              <tr>
                <th>Squadron</th>
                <th>Activity</th>
                <th>Date</th>
                <th>Type</th>
                <th>Lead Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ALL_APPROVALS.map(a => {
                const state = approvalState[a.id];
                const tc = typeColor(a.type);
                return (
                  <tr key={a.id}>
                    <td>
                      <span style={{ fontWeight:600, fontSize:13 }}>{a.sqnName}</span>
                    </td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ color: tc }}>{typeIcon(a.type)}</span>
                        <span style={{ fontWeight:500 }}>{a.activity}</span>
                      </div>
                    </td>
                    <td style={{ color:'#374151', fontFamily:'Geist Mono, monospace', fontSize:12 }}>
                      {new Date(a.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td>
                      <span style={{ fontSize:11, fontWeight:600, color: tc,
                        background: tc + '18', padding:'2px 8px', borderRadius:10 }}>
                        {a.type}
                      </span>
                    </td>
                    <td style={{ color:'#374151', fontSize:12 }}>{a.leadStaff}</td>
                    <td>
                      {!state ? (
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => decide(a.id, 'approved')}
                            style={{ padding:'5px 14px', background:'#001f5b', color:'#fff',
                              border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            Approve
                          </button>
                          <button onClick={() => decide(a.id, 'rejected')}
                            style={{ padding:'5px 14px', background:'#fff', color:'#dc2626',
                              border:'1px solid #fca5a5', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            Return
                          </button>
                        </div>
                      ) : state === 'approved' ? (
                        <span style={{ color:'#16a34a', fontWeight:600, fontSize:12 }}>
                          <Check size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Approved
                        </span>
                      ) : (
                        <span style={{ color:'#dc2626', fontWeight:600, fontSize:12 }}>
                          <XCircle size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Returned
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const ComplianceTab = () => (
    <>
      <div className="gdpr-bar">
        <Lock size={14} color="#3b82f6" />
        H&S compliance figures show form completion rates by squadron. Form content and individual cadet health data
        are retained at squadron level only and are not transmitted to Wing HQ.
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-head"><Shield size={16} /> H&S Form Compliance by Squadron</div>
        <table className="wing-table">
          <thead>
            <tr>
              <th>Squadron</th>
              <th>TG21 Activity Consent</th>
              <th>TG23 Health Decl.</th>
              <th>AvMed 1 (Flying)</th>
              <th>Overall %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { ...ALL_SQUADRONS.find(s => s.number === SQUADRON.number),
                tg21: stats1701.hsCompliance, tg23: stats1701.formsTotal > 0 ? 100 : 100, avmed: 100, isLive: true },
              { number:341,  name:'341 (City of Glasgow)',    tg21:91, tg23:100, avmed:94, hsCompliance:92 },
              { number:1435, name:'1435 (Greenock)',           tg21:100,tg23:100, avmed:100,hsCompliance:100 },
              { number:1490, name:'1490 (Bearsden)',           tg21:85, tg23:90,  avmed:88, hsCompliance:87 },
              { number:1503, name:'1503 (Dumbarton)',          tg21:76, tg23:82,  avmed:78, hsCompliance:78 },
              { number:1622, name:'1622 (East Renfrewshire)', tg21:95, tg23:100, avmed:92, hsCompliance:95 },
            ].map(row => {
              const cb = compBand(row.hsCompliance ?? row.tg21);
              const cell = (pct) => {
                const c = compBand(pct);
                return (
                  <td key={pct}>
                    <span style={{ fontWeight:600, color: c.color }}>{pct}%</span>
                    <div style={{ height:4, background:'#f1f5f9', borderRadius:2, marginTop:4, width:60 }}>
                      <div style={{ height:'100%', background: c.color, width:`${pct}%`, borderRadius:2, maxWidth:'100%' }} />
                    </div>
                  </td>
                );
              };
              return (
                <tr key={row.number}>
                  <td>
                    <div style={{ fontWeight:600, fontSize:13 }}>{row.name}</div>
                    {row.isLive && <span className="live-badge"><span className="live-dot" />LIVE</span>}
                  </td>
                  {cell(row.tg21)}
                  {cell(row.tg23)}
                  {cell(row.avmed)}
                  <td>
                    <span className="comp-pill"
                      style={{ background: cb.bg, color: cb.color, border:`1px solid ${cb.ring}`, fontSize:13 }}>
                      {row.hsCompliance ?? row.tg21}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize:12, fontWeight:600, color: cb.color }}>{cb.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding:'12px 20px', background:'#f8fafc', borderTop:'1px solid #e2e8f0',
          fontSize:11, color:'#64748b' }}>
          Sector average: <strong style={{ color: compBand(avgCompliance).color }}>{avgCompliance}%</strong>
          &nbsp;·&nbsp; Target threshold: <strong>85%</strong>
          &nbsp;·&nbsp; <span style={{ color:'#dc2626', fontWeight:600 }}>{lowCompSqns.length} squadron{lowCompSqns.length !== 1 ? 's' : ''} below threshold</span>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><Info size={16} /> Form Types Reference</div>
        <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { code:'TG21', name:'Activity Consent Form',     scope:'All regulated activities. Signed by parent/guardian prior to each event.',           sensitive: false },
            { code:'TG23', name:'Health Declaration Form',   scope:'Cadets with a medical condition on record only. Auto-generated from cadet health record.', sensitive: true  },
            { code:'AvMed 1', name:'Aviation Medical Form 1',scope:'Required for all AEF flying and VGS gliding sorties. Valid 12 months from signing.',   sensitive: true  },
          ].map(f => (
            <div key={f.code} style={{ background:'#f8fafc', borderRadius:8, padding:'14px 16px',
              border:`1px solid ${f.sensitive ? '#fee2e2' : '#e2e8f0'}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontWeight:700, fontSize:13, color:'#0f172a' }}>{f.code}</span>
                {f.sensitive && (
                  <span style={{ fontSize:10, fontWeight:700, color:'#dc2626',
                    background:'#fee2e2', padding:'2px 7px', borderRadius:4 }}>SENSITIVE</span>
                )}
              </div>
              <div style={{ fontWeight:600, fontSize:12, color:'#374151', marginBottom:4 }}>{f.name}</div>
              <div style={{ fontSize:11, color:'#64748b', lineHeight:1.5 }}>{f.scope}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // === MAIN RENDER ===
  return (
    <div className="wing-shell">
      <style>{css}</style>

      <header className="wing-header">
        {/* RAF roundel */}
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#cf142b" />
          <circle cx="16" cy="16" r="11" fill="#fff" />
          <circle cx="16" cy="16" r="6"  fill="#003082" />
        </svg>
        <div>
          <div className="wing-wordmark">Scotland &amp; N Ireland Wing — West Scotland Sector</div>
          <div className="wing-sub">RAF Air Cadets · Wing HQ Reporting Interface</div>
        </div>
        <span className="os-badge">OFFICIAL-SENSITIVE</span>
      </header>

      <nav className="wing-tabs">
        {[
          { id:'overview',    label:'Overview',       icon:<BarChart3 size={14} /> },
          { id:'squadrons',   label:'Squadrons',      icon:<Users size={14} />,     badge: null },
          { id:'approvals',   label:'Approvals',      icon:<FileText size={14} />,  badge: pendingApprovals.length || null },
          { id:'compliance',  label:'H&S Compliance', icon:<Shield size={14} />,    badge: lowCompSqns.length || null },
        ].map(t => (
          <button key={t.id} className={`wing-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
            {t.badge ? <span className="tab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </nav>

      <main className="wing-content">
        {tab === 'overview'   && <OverviewTab />}
        {tab === 'squadrons'  && <SquadronsTab />}
        {tab === 'approvals'  && <ApprovalsTab />}
        {tab === 'compliance' && <ComplianceTab />}
      </main>

      {toast && (
        <div className="wing-toast"
          style={{ background: toast.type === 'ok' ? '#16a34a' : '#d97706' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
