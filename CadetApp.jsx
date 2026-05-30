/**
 * 1701 (Johnstone) Squadron RAF Air Cadets
 * Cadet Interface — phone-first prototype
 */

import { useState } from 'react';
import {
  ChevronRight, Check, X, Plane, Shield, BookOpen,
  AlertTriangle, Trophy, Crosshair, Mountain, Music,
  Radio, Bell, User, Star, Award, Target, Clock,
  ChevronDown, ChevronUp, Zap, Heart, Flag
} from 'lucide-react';

export default function CadetApp() {

  // === ALL STATE AT TOP ===
  const [tab, setTab]                   = useState('home');
  const [selectedId, setSelectedId]     = useState('c01');
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [expandedQual, setExpandedQual] = useState(null);

  // === CONSTANTS ===
  const today = new Date('2026-05-18');

  const CLASS_ORDER = ['none','FC','LC','SC','MAC'];
  const CLASS_META = {
    none: { label:'No Classification', short:'—',    color:'#64748b', bg:'rgba(100,116,139,0.15)' },
    FC:   { label:'First Class',       short:'FC',   color:'#3b82f6', bg:'rgba(59,130,246,0.15)'  },
    LC:   { label:'Leading Cadet',     short:'LC',   color:'#10b981', bg:'rgba(16,185,129,0.15)'  },
    SC:   { label:'Senior Cadet',      short:'SC',   color:'#a78bfa', bg:'rgba(167,139,250,0.15)' },
    MAC:  { label:'Master Air Cadet',  short:'MAC',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)'  },
  };

  // === HELPERS ===
  const getAge = (dob) => {
    const d = new Date(dob);
    let age = today.getFullYear() - d.getFullYear();
    if (today.getMonth() - d.getMonth() < 0 ||
       (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) age--;
    return age;
  };

  const getMonths = (joinDate) =>
    Math.floor((today - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 30.44));

  const canShoot = (c) => c.quals.whtL98 && c.quals.wht22 && getAge(c.dob) >= 13;
  const canFly   = (c) => getAge(c.dob) >= 13 && !c.medical.barToFlying;

  const nextClassInfo = (c) => {
    const idx = CLASS_ORDER.indexOf(c.classification);
    if (idx >= CLASS_ORDER.length - 1) return null;
    const next  = CLASS_ORDER[idx + 1];
    const months = getMonths(c.joinDate);
    const reqs = [];

    if (next === 'FC') {
      reqs.push({ label:'6 months service',           done: months >= 6,           detail:`${months} of 6 months` });
      reqs.push({ label:'First Aid / Heartstart',      done: c.quals.firstAid,      detail:'Required' });
    }
    if (next === 'LC') {
      reqs.push({ label:'12 months service',           done: months >= 12,          detail:`${months} of 12 months` });
      reqs.push({ label:'First Aid',                   done: c.quals.firstAid,      detail:'Required' });
      reqs.push({ label:'At least one WHT',            done: c.quals.whtL98 || c.quals.wht22, detail:'L98 or .22' });
    }
    if (next === 'SC') {
      reqs.push({ label:'24 months service',           done: months >= 24,          detail:`${months} of 24 months` });
      reqs.push({ label:'L98 WHT',                     done: c.quals.whtL98,        detail:'Weapons Handling Test' });
      reqs.push({ label:'.22 WHT',                     done: c.quals.wht22,         detail:'Weapons Handling Test' });
      reqs.push({ label:'DofE Bronze',                 done: c.quals.dofeBronze,    detail:'Duke of Edinburgh' });
      reqs.push({ label:'First Aid',                   done: c.quals.firstAid,      detail:'Required' });
    }
    if (next === 'MAC') {
      reqs.push({ label:'36 months service',           done: months >= 36,          detail:`${months} of 36 months` });
      reqs.push({ label:'BTEC Level 2',                done: c.quals.btecL2,        detail:'BTEC Aerospace' });
      reqs.push({ label:'DofE Silver',                 done: c.quals.dofeSilver,    detail:'Duke of Edinburgh' });
    }

    const done    = reqs.filter(r => r.done).length;
    const pct     = Math.round((done / reqs.length) * 100);
    const eligible = reqs.every(r => r.done);
    return { next, meta: CLASS_META[next], reqs, done, total: reqs.length, pct, eligible };
  };

  // === DEMO CADETS (4 stages of the journey) ===
  const cadets = [
    {
      id:'c01', serviceNo:'SNI-2022-0741', firstName:'Ryan', lastName:'Donnelly', gender:'M',
      dob:'2008-11-05', joinDate:'2022-11-09', rank:'FS', classification:'SC',
      school:'Paisley Grammar',
      attendance:{ parades:58, present:52 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
              dofeBronze:true, dofeSilver:true, dofeGold:false, btecL2:true, btecL3:false, aef:3, gliding:4 },
      medical:{ barToFlying:false, conditions:'Asthma (controlled)',
                medications:[{ name:'Salbutamol (Ventolin)', dosage:'2 puffs as required', storage:'On person at all times' }] },
      nextOfKin:{ name:'Patricia Donnelly', phone:'07700 900781', email:'p.donnelly@gmail.com', rel:'Mother' },
      events:[
        { id:'e1', name:'Shooting — L98 LFMT 6', date:'2026-05-16', status:'signed'  },
        { id:'e3', name:'Bronze Wings Synthetic', date:'2026-05-23', status:'pending' },
      ],
    },
    {
      id:'c03', serviceNo:'SNI-2023-1021', firstName:'Jamie', lastName:'McAllister', gender:'M',
      dob:'2009-03-14', joinDate:'2023-09-06', rank:'Sgt', classification:'LC',
      school:'Johnstone High',
      attendance:{ parades:42, present:38 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
              dofeBronze:true, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:2, gliding:1 },
      medical:{ barToFlying:false, conditions:null, medications:[] },
      nextOfKin:{ name:'Anne McAllister', phone:'07700 900123', email:'anne.mcallister@btinternet.com', rel:'Mother' },
      events:[
        { id:'e1', name:'Shooting — L98 LFMT 6', date:'2026-05-16', status:'pending' },
      ],
    },
    {
      id:'c06', serviceNo:'SNI-2024-1201', firstName:'Caitlin', lastName:'Fraser', gender:'F',
      dob:'2010-07-22', joinDate:'2024-01-17', rank:'Cpl', classification:'FC',
      school:"St. Aidan's High",
      attendance:{ parades:32, present:30 },
      quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
      medical:{ barToFlying:false, conditions:null, medications:[] },
      nextOfKin:{ name:'David Fraser', phone:'07700 900456', email:'d.fraser1972@hotmail.co.uk', rel:'Father' },
      events:[
        { id:'e5', name:'North Region Music Camp', date:'2026-05-22', status:'pending' },
      ],
    },
    {
      id:'c13', serviceNo:'SNI-2025-1421', firstName:'Amy', lastName:'Sinclair', gender:'F',
      dob:'2012-08-19', joinDate:'2025-01-22', rank:'LCdt', classification:'none',
      school:'Johnstone High',
      attendance:{ parades:16, present:15 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null, medications:[] },
      nextOfKin:{ name:'Karen Sinclair', phone:'07700 900774', email:'karensinclair@hotmail.com', rel:'Mother' },
      events:[],
    },
    {
      id:'c17', serviceNo:'SNI-2026-1532', firstName:'Ethan', lastName:'Murray', gender:'M',
      dob:'2013-08-15', joinDate:'2026-01-15', rank:'Cdt', classification:'none',
      school:'Johnstone High',
      attendance:{ parades:8, present:8 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null, medications:[] },
      nextOfKin:{ name:'Sharon Murray', phone:'07700 901118', email:'sharon.murray@gmail.com', rel:'Mother' },
      events:[],
    },
  ];

  const cadet = cadets.find(c => c.id === selectedId) || cadets[0];
  const age   = getAge(cadet.dob);
  const months = getMonths(cadet.joinDate);
  const attPct = Math.round((cadet.attendance.present / cadet.attendance.parades) * 100);
  const nextClass = nextClassInfo(cadet);
  const classIdx  = CLASS_ORDER.indexOf(cadet.classification);

  const ACTIVITIES = [
    { id:'shooting', label:'Shooting (L98)',       icon: Crosshair,
      eligible: canShoot(cadet),
      reason: age < 13 ? 'Minimum age 13' : !cadet.quals.whtL98 ? 'L98 WHT not yet complete' : !cadet.quals.wht22 ? '.22 WHT not yet complete' : '' },
    { id:'aef',      label:'Air Experience Flying',icon: Plane,
      eligible: canFly(cadet),
      reason: age < 13 ? 'Minimum age 13' : cadet.medical.barToFlying ? 'Medical bar to flying' : '' },
    { id:'gliding',  label:'Gliding',              icon: Plane,
      eligible: canFly(cadet),
      reason: age < 13 ? 'Minimum age 13' : cadet.medical.barToFlying ? 'Medical bar' : '' },
    { id:'at',       label:'Adventure Training',   icon: Mountain,
      eligible: age >= 14,
      reason: age < 14 ? `Opens at age 14` : '' },
    { id:'dofe',     label:'DofE Bronze',          icon: Award,
      eligible: age >= 14 && !cadet.quals.dofeBronze,
      reason: age < 14 ? `Opens at age 14` : cadet.quals.dofeBronze ? 'Already achieved!' : '' },
    { id:'music',    label:'Music Camp',           icon: Music,
      eligible: true, reason:'' },
    { id:'radio',    label:'Radio / Cyber',        icon: Radio,
      eligible: cadet.classification !== 'none',
      reason: cadet.classification === 'none' ? 'Need First Class classification first' : '' },
  ];

  const QUALS_ALL = [
    { key:'whtL98',    label:'L98 WHT',              group:'Shooting',      icon:'🎯' },
    { key:'wht22',     label:'.22 WHT',              group:'Shooting',      icon:'🎯' },
    { key:'firstAid',  label:'First Aid',            group:'Medical',       icon:'❤️' },
    { key:'youthFirstAid', label:'Youth First Aid',  group:'Medical',       icon:'❤️' },
    { key:'dofeBronze',label:'DofE Bronze',          group:'Duke of Edinburgh', icon:'🥉' },
    { key:'dofeSilver',label:'DofE Silver',          group:'Duke of Edinburgh', icon:'🥈' },
    { key:'dofeGold',  label:'DofE Gold',            group:'Duke of Edinburgh', icon:'🥇' },
    { key:'btecL2',    label:'BTEC Level 2',         group:'Academic',      icon:'📚' },
    { key:'btecL3',    label:'BTEC Level 3',         group:'Academic',      icon:'📚' },
  ];

  // === INLINE CSS ===
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap');

    * { box-sizing: border-box; }

    .cadet-shell {
      background: #060e1f;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      font-family: 'Geist', system-ui, sans-serif;
    }

    .phone {
      width: 100%;
      max-width: 430px;
      min-height: 100vh;
      background: #0a1628;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .screen-scroll {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 80px;
    }

    /* Bottom nav */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 430px;
      background: rgba(6,14,31,0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255,255,255,0.07);
      display: grid;
      grid-template-columns: repeat(4,1fr);
      padding: 8px 0 16px;
      z-index: 30;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      padding: 4px;
      transition: all 0.15s;
    }

    .nav-item .nav-label {
      font-size: 10px;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
      transition: color 0.15s;
    }

    .nav-item.active .nav-label { color: #cf142b; }
    .nav-item:not(.active) svg  { opacity: 0.35; }

    /* Cards */
    .glass-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 18px;
      padding: 18px;
    }

    .glass-card.glow-red  { border-color: rgba(207,20,43,0.3);  box-shadow: 0 0 24px rgba(207,20,43,0.08); }
    .glass-card.glow-gold { border-color: rgba(200,169,81,0.35); box-shadow: 0 0 24px rgba(200,169,81,0.1); }
    .glass-card.glow-blue { border-color: rgba(0,48,130,0.4);   box-shadow: 0 0 24px rgba(0,48,130,0.12); }

    /* Hero gradient */
    .hero-gradient {
      background: linear-gradient(145deg, #0d2154 0%, #0a1628 60%);
      padding: 20px 20px 0;
      position: relative;
      overflow: hidden;
    }

    .hero-gradient::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 220px; height: 220px;
      background: radial-gradient(circle, rgba(207,20,43,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Rank badge */
    .rank-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(207,20,43,0.15);
      border: 1px solid rgba(207,20,43,0.4);
      border-radius: 20px;
      padding: 5px 14px;
      font-size: 13px;
      font-weight: 700;
      color: #f87171;
      letter-spacing: 0.04em;
    }

    /* Classification pill */
    .class-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    /* Progress ring (SVG based) */
    .prog-ring { transform: rotate(-90deg); }

    /* Qual badge */
    .qual-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 8px;
      border-radius: 14px;
      transition: all 0.15s;
      cursor: default;
    }

    .qual-badge.earned {
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.25);
    }

    .qual-badge.locked {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }

    /* Activity row */
    .act-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 14px;
      margin-bottom: 8px;
      transition: all 0.15s;
    }

    .act-row.eligible  { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); }
    .act-row.ineligible{ background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }

    /* Step indicator */
    .step-dot {
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .step-dot.done    { background: #10b981; color: white; }
    .step-dot.current { background: #cf142b; color: white; box-shadow: 0 0 0 4px rgba(207,20,43,0.2); }
    .step-dot.future  { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1); }

    /* Event card */
    .event-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      margin-bottom: 8px;
    }

    .event-pill.signed  { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); }
    .event-pill.pending { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); }

    /* Switcher */
    .switcher-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(8px);
      z-index: 40;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 20px;
    }

    .switcher-card {
      background: #0d1f44;
      border-radius: 20px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .switcher-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .switcher-row:hover { background: rgba(255,255,255,0.06); }
    .switcher-row.active { background: rgba(207,20,43,0.12); border: 1px solid rgba(207,20,43,0.25); }

    .anim-up {
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }

    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(207,20,43,0.4); }
      70%  { box-shadow: 0 0 0 10px rgba(207,20,43,0); }
      100% { box-shadow: 0 0 0 0 rgba(207,20,43,0); }
    }

    .pulse { animation: pulse-ring 2s infinite; }
  `;

  // === SCREENS (closures — no hooks) ===

  const HomeScreen = () => {
    const m = CLASS_META[cadet.classification];

    return (
      <div>
        {/* Hero */}
        <div className="hero-gradient">
          {/* RAF roundel */}
          <div style={{ position:'absolute', top:16, right:20, width:64, height:64, borderRadius:'50%',
                        background:'#cf142b', display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 0 30px rgba(207,20,43,0.3)' }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'#003082' }} />
            </div>
          </div>

          <div style={{ paddingRight:80 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>
              1701 (Johnstone) Squadron
            </div>
            <div className="rank-badge" style={{ marginBottom:12 }}>
              <Shield size={11} /> {cadet.rank}
            </div>
            <div style={{ fontSize:28, fontWeight:800, color:'white', lineHeight:1.1, marginBottom:6 }}>
              {cadet.firstName}<br />{cadet.lastName}
            </div>
            <div className="class-pill" style={{ background: m.bg, color: m.color, marginBottom:20 }}>
              <Star size={10} /> {m.label}
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1, margin:'0 -20px', background:'rgba(255,255,255,0.05)' }}>
            {[
              { label:'Age',       value: `${age}` },
              { label:'Service',   value: `${months}mo` },
              { label:'Attendance',value: `${attPct}%` },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding:'14px 16px', textAlign:'center', background:'rgba(6,14,31,0.3)' }}>
                <div style={{ fontSize:20, fontWeight:800, color:'white' }}>{value}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:'20px 16px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* Next classification */}
          {nextClass && (
            <div className="glass-card glow-red">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Next Achievement</div>
                  <div style={{ fontSize:18, fontWeight:800, color:'white' }}>{nextClass.meta.label}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:24, fontWeight:800, color: nextClass.eligible ? '#10b981' : nextClass.meta.color }}>
                    {nextClass.pct}%
                  </div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{nextClass.done}/{nextClass.total} done</div>
                </div>
              </div>
              {/* progress bar */}
              <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.08)', overflow:'hidden', marginBottom:14 }}>
                <div style={{ height:'100%', borderRadius:3, width:`${nextClass.pct}%`, transition:'width 0.6s',
                  background: nextClass.eligible ? '#10b981' : nextClass.meta.color }} />
              </div>
              {nextClass.eligible ? (
                <div style={{ fontSize:13, fontWeight:600, color:'#10b981', display:'flex', alignItems:'center', gap:6 }}>
                  <Check size={14} /> All requirements met — speak to your OC!
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {nextClass.reqs.filter(r => !r.done).slice(0,3).map(r => (
                    <div key={r.label} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'rgba(255,255,255,0.55)' }}>
                      <div style={{ width:16, height:16, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <X size={9} color="rgba(255,255,255,0.35)" />
                      </div>
                      {r.label}
                    </div>
                  ))}
                  {nextClass.reqs.filter(r => !r.done).length > 3 && (
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>+ {nextClass.reqs.filter(r=>!r.done).length - 3} more</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Medical alert */}
          {cadet.medical.conditions && (
            <div style={{ display:'flex', gap:10, padding:'12px 14px', borderRadius:12, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', fontSize:12, color:'rgba(255,255,255,0.7)', alignItems:'flex-start' }}>
              <Heart size={14} color="#f59e0b" style={{ flexShrink:0, marginTop:1 }} />
              <div>
                <span style={{ fontWeight:600, color:'#fbbf24' }}>Medical note: </span>
                {cadet.medical.conditions}. Your TG23 is on file and will be included automatically on all activities.
              </div>
            </div>
          )}

          {/* Upcoming events */}
          {cadet.events.length > 0 && (
            <div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                Upcoming Events
              </div>
              {cadet.events.map(ev => (
                <div key={ev.id} className={`event-pill ${ev.status}`}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: ev.status==='signed' ? '#10b981' : '#f59e0b', flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'white' }}>{ev.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>
                      {new Date(ev.date).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
                      {' · '}
                      {ev.status === 'signed'
                        ? <span style={{ color:'#10b981' }}>Forms signed ✓</span>
                        : <span style={{ color:'#f59e0b' }}>Forms awaiting parent signature</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities quick view */}
          <div className="glass-card" style={{ padding:'14px 16px' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
              What I can do
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { label:'Shooting', eligible: canShoot(cadet), icon: Crosshair },
                { label:'Flying',   eligible: canFly(cadet),   icon: Plane     },
                { label:'Gliding',  eligible: canFly(cadet),   icon: Plane     },
                { label:'Radio',    eligible: cadet.classification !== 'none', icon: Radio },
              ].map(({ label, eligible, icon: Icon }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:10,
                    background: eligible ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${eligible ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                  <Icon size={13} color={eligible ? '#10b981' : 'rgba(255,255,255,0.2)'} />
                  <span style={{ fontSize:12, fontWeight:500, color: eligible ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  };

  const ProgressScreen = () => {
    const earnedCount = Object.values(cadet.quals).filter(v => v === true).length;

    return (
      <div style={{ padding:'20px 16px' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>My Progress</div>
        <div style={{ fontSize:22, fontWeight:800, color:'white', marginBottom:20 }}>Cadet Journey</div>

        {/* Classification pathway */}
        <div className="glass-card" style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>Classification Pathway</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
            {/* connecting line */}
            <div style={{ position:'absolute', left:'14px', right:'14px', top:'50%', transform:'translateY(-50%)', height:2, background:'rgba(255,255,255,0.06)', zIndex:0 }} />
            {CLASS_ORDER.filter(c => c !== 'none').map((cls, i) => {
              const isDone    = classIdx > CLASS_ORDER.indexOf(cls);
              const isCurrent = cadet.classification === cls;
              const isFuture  = !isDone && !isCurrent;
              const m = CLASS_META[cls];
              return (
                <div key={cls} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, zIndex:1 }}>
                  <div className={`step-dot ${isDone ? 'done' : isCurrent ? 'current pulse' : 'future'}`}>
                    {isDone ? <Check size={12} /> : isCurrent ? '●' : i + 1}
                  </div>
                  <div style={{ fontSize:9, fontWeight:700, color: isDone ? '#10b981' : isCurrent ? m.color : 'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.05em', textAlign:'center', lineHeight:1.2, maxWidth:36 }}>
                    {m.short}
                  </div>
                </div>
              );
            })}
          </div>

          {nextClass && (
            <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'white' }}>
                  Requirements for <span style={{ color: nextClass.meta.color }}>{nextClass.meta.label}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color: nextClass.eligible ? '#10b981' : 'rgba(255,255,255,0.5)' }}>
                  {nextClass.done}/{nextClass.total}
                </div>
              </div>
              {nextClass.reqs.map(r => (
                <div key={r.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                    background: r.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${r.done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                    {r.done
                      ? <Check size={11} color="#10b981" />
                      : <X     size={10} color="rgba(255,255,255,0.2)" />}
                  </div>
                  <div style={{ flex:1, color: r.done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', fontWeight: r.done ? 500 : 400 }}>
                    {r.label}
                  </div>
                  {r.done && <span style={{ fontSize:10, color:'#10b981', fontWeight:600 }}>✓ Done</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Qualifications grid */}
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
          Qualifications — {earnedCount} earned
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
          {QUALS_ALL.map(q => {
            const earned = !!cadet.quals[q.key];
            return (
              <div key={q.key} className={`qual-badge ${earned ? 'earned' : 'locked'}`}
                onClick={() => setExpandedQual(expandedQual === q.key ? null : q.key)}>
                <div style={{ fontSize:22, filter: earned ? 'none' : 'grayscale(1) opacity(0.3)' }}>{q.icon}</div>
                <div style={{ fontSize:11, fontWeight:600, textAlign:'center', lineHeight:1.2,
                  color: earned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' }}>
                  {q.label}
                </div>
                {earned
                  ? <div style={{ fontSize:9, color:'#10b981', fontWeight:700 }}>EARNED</div>
                  : <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)' }}>LOCKED</div>}
              </div>
            );
          })}
        </div>

        {/* Flying sorties */}
        <div className="glass-card">
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Flying Experience</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { label:'AEF Sorties',    value: cadet.quals.aef,     icon:'✈️', goal:5 },
              { label:'Gliding Sorties',value: cadet.quals.gliding, icon:'🛩️', goal:6 },
            ].map(({ label, value, icon, goal }) => (
              <div key={label} style={{ padding:'14px', background:'rgba(0,48,130,0.15)', border:'1px solid rgba(0,48,130,0.25)', borderRadius:12 }}>
                <div style={{ fontSize:24 }}>{icon}</div>
                <div style={{ fontSize:26, fontWeight:800, color:'white', lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{label}</div>
                <div style={{ marginTop:8, height:3, borderRadius:2, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#003082', width:`${Math.min(100,(value/goal)*100)}%` }} />
                </div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:3 }}>{value} of {goal} target</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActivitiesScreen = () => (
    <div style={{ padding:'20px 16px' }}>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Activities</div>
      <div style={{ fontSize:22, fontWeight:800, color:'white', marginBottom:6 }}>What can I do?</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:20 }}>Based on your age, qualifications, and medical record.</div>

      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {ACTIVITIES.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.id} className={`act-row ${a.eligible ? 'eligible' : 'ineligible'}`}>
              <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                background: a.eligible ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)' }}>
                <Icon size={18} color={a.eligible ? '#10b981' : 'rgba(255,255,255,0.2)'} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color: a.eligible ? 'white' : 'rgba(255,255,255,0.35)' }}>{a.label}</div>
                {a.eligible
                  ? <div style={{ fontSize:12, color:'#10b981', marginTop:1 }}>Eligible ✓</div>
                  : a.reason && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{a.reason}</div>}
              </div>
              <div style={{ width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                background: a.eligible ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)' }}>
                {a.eligible
                  ? <Check size={11} color="#10b981" />
                  : <X     size={10} color="rgba(255,255,255,0.15)" />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(0,48,130,0.12)', border:'1px solid rgba(0,48,130,0.2)', fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>
          <strong style={{ color:'rgba(255,255,255,0.6)' }}>Shooting:</strong> Both the L98 WHT and .22 WHT must be complete before attending any live firing range. Minimum age 13.
        </div>
        <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.6 }}>
          <strong style={{ color:'rgba(255,255,255,0.5)' }}>Join age:</strong> Cadets can join from age 12. Shooting and flying activities open at 13. Some activities are open straight away — music, sports, and classroom training have no age restriction beyond joining.
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div style={{ padding:'20px 16px' }}>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>My Profile</div>
      <div style={{ fontSize:22, fontWeight:800, color:'white', marginBottom:20 }}>Service Record</div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

        <div className="glass-card">
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Cadet Details</div>
          {[
            { label:'Full Name',     value:`${cadet.firstName} ${cadet.lastName}` },
            { label:'Service No.',   value: cadet.serviceNo, mono: true },
            { label:'Date of Birth', value: new Date(cadet.dob).toLocaleDateString('en-GB') },
            { label:'Age',           value: `${age} years` },
            { label:'School',        value: cadet.school },
            { label:'Squadron',      value:'1701 (Johnstone) Squadron' },
            { label:'Wing',          value:'Scotland & Northern Ireland Wing' },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13, gap:12 }}>
              <span style={{ color:'rgba(255,255,255,0.4)', flexShrink:0 }}>{label}</span>
              <span style={{ color:'rgba(255,255,255,0.85)', fontWeight:500, fontFamily: mono ? 'monospace' : 'inherit', textAlign:'right' }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="glass-card">
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Rank &amp; Classification</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { label:'Current Rank', value: cadet.rank },
              { label:'Classification', value: CLASS_META[cadet.classification].label },
              { label:'Service Length', value:`${months} months` },
              { label:'Attendance', value:`${cadet.attendance.present}/${cadet.attendance.parades} (${attPct}%)` },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding:'12px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'white' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Emergency Contact</div>
          {[
            { label:'Name',         value: cadet.nextOfKin.name },
            { label:'Relationship', value: cadet.nextOfKin.rel },
            { label:'Phone',        value: cadet.nextOfKin.phone },
            { label:'Email',        value: cadet.nextOfKin.email },
          ].map(({ label, value }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
              <span style={{ color:'rgba(255,255,255,0.4)' }}>{label}</span>
              <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:500 }}>{value}</span>
            </div>
          ))}
        </div>

        {cadet.medical.conditions && (
          <div style={{ padding:'14px 16px', borderRadius:14, background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize:11, color:'#f59e0b', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Medical Record</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:8 }}>{cadet.medical.conditions}</div>
            {cadet.medical.medications.map((m, i) => (
              <div key={i} style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:3 }}>
                💊 {m.name} — {m.dosage}. {m.storage}
              </div>
            ))}
            <div style={{ fontSize:11, color:'rgba(245,158,11,0.6)', marginTop:8 }}>A TG23 Health Declaration is on file for all activities.</div>
          </div>
        )}
      </div>
    </div>
  );

  // === CADET SWITCHER ===
  const CadetSwitcher = () => (
    <div className="switcher-overlay" onClick={() => setShowSwitcher(false)}>
      <div className="switcher-card anim-up" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.06em' }}>
          Switch Cadet — Demo
        </div>
        {cadets.map(c => {
          const m = CLASS_META[c.classification];
          const mo = getMonths(c.joinDate);
          return (
            <div key={c.id} className={`switcher-row ${selectedId === c.id ? 'active' : ''}`}
              onClick={() => { setSelectedId(c.id); setShowSwitcher(false); setTab('home'); }}>
              <div style={{ width:38, height:38, borderRadius:12, background: selectedId === c.id ? 'rgba(207,20,43,0.2)' : 'rgba(255,255,255,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'white' }}>
                {c.firstName[0]}{c.lastName[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'white' }}>{c.firstName} {c.lastName}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>
                  {c.rank} · <span style={{ color: m.color }}>{m.label}</span> · {mo}mo service
                </div>
              </div>
              {selectedId === c.id && <Check size={16} color="#cf142b" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  const NAV = [
    { id:'home',       label:'Home',     icon: Flag    },
    { id:'progress',   label:'Progress', icon: Trophy  },
    { id:'activities', label:'Activities',icon: Target  },
    { id:'profile',    label:'Profile',  icon: User    },
  ];

  // === MAIN RENDER ===
  return (
    <div className="cadet-shell">
      <style>{css}</style>

      <div className="phone">
        {/* Status bar */}
        <div style={{ background:'#060e1f', padding:'12px 20px 8px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>
            RAF Air Cadets
          </div>
          <button onClick={() => setShowSwitcher(true)}
            style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 12px', cursor:'pointer', fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:500 }}>
            {cadet.firstName} {cadet.lastName[0]}.
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Screens */}
        <div className="screen-scroll">
          {tab === 'home'       && <HomeScreen />}
          {tab === 'progress'   && <ProgressScreen />}
          {tab === 'activities' && <ActivitiesScreen />}
          {tab === 'profile'    && <ProfileScreen />}
        </div>

        {/* Bottom nav */}
        <div className="bottom-nav">
          {NAV.map(n => {
            const I = n.icon;
            return (
              <div key={n.id} className={`nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
                <I size={20} color={tab === n.id ? '#cf142b' : 'white'} />
                <span className="nav-label">{n.label}</span>
              </div>
            );
          })}
        </div>

        {/* Cadet switcher overlay */}
        {showSwitcher && <CadetSwitcher />}
      </div>
    </div>
  );
}
