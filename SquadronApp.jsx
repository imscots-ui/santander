/**
 * 1701 (Johnstone) Squadron RAF Air Cadets
 * Squadron Management Interface — Prototype
 */

import { useState, useMemo } from 'react';
import {
  Users, Shield, Star, Award, ChevronRight, Search, X, Check,
  AlertTriangle, Clock, Calendar, FileText, Download, UserCheck,
  BarChart3, Target, Plane, Mountain, Music, Radio, ChevronDown,
  ArrowLeft, Bell, MapPin, Phone, Mail, Info, BookOpen, Upload,
  CircleCheck, AlertCircle, Lock, TrendingUp, Eye, Filter, Zap,
  Flag, Plus, Printer, LayoutDashboard, UserCog, Crosshair
} from 'lucide-react';

export default function SquadronApp() {

  // === ALL STATE AT TOP ===
  const [tab, setTab] = useState('dashboard');
  const [cadetSearch, setCadetSearch] = useState('');
  const [selectedCadet, setSelectedCadet] = useState(null);
  const [rankFilter, setRankFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('shooting-l98');
  const [attendanceDate, setAttendanceDate] = useState('2026-05-18');
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [toast, setToast] = useState(null);
  const [promotionApproved, setPromotionApproved] = useState({});
  const [reportType, setReportType] = useState('shooting');
  const [showD5Modal, setShowD5Modal] = useState(null);
  // { [eventId]: { [cadetId]: 'unsent'|'sent'|'signed' } }
  const [formStatus, setFormStatus] = useState({});
  const [expandedEvent, setExpandedEvent] = useState(null);

  // === CONSTANTS ===
  const SQUADRON = {
    number: 1701,
    name: '1701 (Johnstone) Squadron',
    region: 'Scotland & N Ireland Wing',
    sector: 'West Scotland Sector',
    oic: 'FS Kenneth Macfarlane',
    email: 'training.1701@rafac.mod.gov.uk',
  };

  const RANK_ORDER = ['Cdt','LCdt','Cpl','Sgt','FS','WO'];
  const CLASS_ORDER = ['none','FC','LC','SC','MAC'];

  const CLASS_META = {
    none: { label: 'No Classification', short: '—',   bg: 'bg-stone-100',   text: 'text-stone-500' },
    FC:   { label: 'First Class',        short: 'FC',  bg: 'bg-blue-100',    text: 'text-blue-800'  },
    LC:   { label: 'Leading Cadet',      short: 'LC',  bg: 'bg-emerald-100', text: 'text-emerald-800'},
    SC:   { label: 'Senior Cadet',       short: 'SC',  bg: 'bg-purple-100',  text: 'text-purple-800' },
    MAC:  { label: 'Master Air Cadet',   short: 'MAC', bg: 'bg-amber-100',   text: 'text-amber-800' },
  };

  const today = new Date('2026-05-18');

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

  // SHOOTING: both WHTs required
  const canShoot = (c) => c.quals.whtL98 && c.quals.wht22 && getAge(c.dob) >= 13;

  // AEF/Gliding: 13+, no medical bar
  const canFly = (c) => getAge(c.dob) >= 13 && !c.medical.barToFlying;

  // Classification eligibility — returns { nextClass, eligible, blockers[] }
  const classEligibility = (c) => {
    const currentIdx = CLASS_ORDER.indexOf(c.classification);
    if (currentIdx >= CLASS_ORDER.length - 1) return { nextClass: null, eligible: false, blockers: [] };
    const next = CLASS_ORDER[currentIdx + 1];
    const months = getMonths(c.joinDate);
    const blockers = [];

    if (next === 'FC') {
      if (months < 6)               blockers.push(`${6 - months}mo more service needed`);
      if (!c.quals.firstAid)        blockers.push('First Aid / Heartstart required');
    }
    if (next === 'LC') {
      if (months < 12)              blockers.push(`${12 - months}mo more service needed`);
      if (!c.quals.firstAid)        blockers.push('First Aid required');
      if (!c.quals.whtL98 && !c.quals.wht22) blockers.push('At least one WHT required');
    }
    if (next === 'SC') {
      if (months < 24)              blockers.push(`${24 - months}mo more service needed`);
      if (!c.quals.whtL98)          blockers.push('L98 WHT required');
      if (!c.quals.wht22)           blockers.push('.22 WHT required');
      if (!c.quals.dofeBronze)      blockers.push('DofE Bronze required');
      if (!c.quals.firstAid)        blockers.push('First Aid required');
    }
    if (next === 'MAC') {
      if (months < 36)              blockers.push(`${36 - months}mo more service needed`);
      if (!c.quals.btecL2)          blockers.push('BTEC Level 2 required');
      if (!c.quals.dofeSilver)      blockers.push('DofE Silver required');
    }

    return { nextClass: next, nextLabel: CLASS_META[next].label, eligible: blockers.length === 0, blockers };
  };

  const fireToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // === STATIC DATA ===

  const staff = [
    { id: 's1', firstName: 'Kenneth', lastName: 'Macfarlane', rank: 'FS',     role: 'OIC / Adult IC',        dbs: '2027-03-14', ctc: '2028-01-10', quals: ['AVIP','AT Bronze','Shooting Range Conducting Officer'] },
    { id: 's2', firstName: 'Caroline-Anne', lastName: 'Pryde', rank: 'Flt Lt',role: 'Training Officer',       dbs: '2026-09-22', ctc: '2027-06-04', quals: ['AVIP','D1 Driving'] },
    { id: 's3', firstName: 'Matthew',  lastName: 'Hooks',      rank: 'Plt Off',role: 'Administration Officer', dbs: '2027-11-30', ctc: '2028-03-18', quals: ['AVIP'] },
    { id: 's4', firstName: 'Ann',      lastName: 'Sweeney',    rank: 'CI',     role: 'Civilian Instructor',    dbs: '2026-07-05', ctc: '2027-01-22', quals: ['AVIP','First Aid Instructor'] },
    { id: 's5', firstName: 'Izzy',     lastName: 'Young',      rank: 'Plt Off',role: 'Cdt Liaison Officer',    dbs: '2027-02-19', ctc: '2028-09-11', quals: ['AVIP','DofE Supervisor'] },
  ];

  // medical.conditions: null = none; string = description shown on TG23 (only populated when condition exists)
  const cadets = [
    { id:'c01', serviceNo:'SNI-2022-0741', firstName:'Ryan',    lastName:'Donnelly',
      dob:'2008-11-05', joinDate:'2022-11-09', rank:'FS',   classification:'SC',
      school:'Paisley Grammar', attendance:{ parades:58, present:52 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
              dofeBronze:true, dofeSilver:true, dofeGold:false, btecL2:true, btecL3:false, aef:3, gliding:4 },
      medical:{ barToFlying:false, conditions:'Asthma (controlled) — uses preventer inhaler daily, reliever carried at all times. No activity restrictions.' },
      nextOfKin:{ name:'Patricia Donnelly', phone:'07700 900781', email:'p.donnelly@gmail.com', rel:'Mother' },
      status:'active', notes:'Ready for MAC assessment — needs DofE Silver verified on SMS.' },

    { id:'c02', serviceNo:'SNI-2022-0809', firstName:'Niamh',   lastName:'Gallagher',
      dob:'2007-04-18', joinDate:'2022-09-14', rank:'WO',   classification:'MAC',
      school:'St. Aidan\'s High', attendance:{ parades:61, present:57 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
              dofeBronze:true, dofeSilver:true, dofeGold:true, btecL2:true, btecL3:true, aef:5, gliding:6 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Sean Gallagher', phone:'07700 900302', email:'sean.gallagher77@outlook.com', rel:'Father' },
      status:'active', notes:'Cadet Warrant Officer. Applying for RAFAC scholarship.' },

    { id:'c03', serviceNo:'SNI-2023-1021', firstName:'Jamie',   lastName:'McAllister',
      dob:'2009-03-14', joinDate:'2023-09-06', rank:'Sgt',  classification:'LC',
      school:'Johnstone High', attendance:{ parades:42, present:38 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
              dofeBronze:true, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:2, gliding:1 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Anne McAllister', phone:'07700 900123', email:'anne.mcallister@btinternet.com', rel:'Mother' },
      status:'active', notes:'Both WHTs complete. 24-month mark hit — SC eligible if DofE Bronze confirmed.' },

    { id:'c04', serviceNo:'SNI-2023-1044', firstName:'Erin',    lastName:'Stewart',
      dob:'2009-07-29', joinDate:'2023-09-06', rank:'Sgt',  classification:'SC',
      school:'Johnstone High', attendance:{ parades:41, present:39 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
              dofeBronze:true, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:2, gliding:2 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Moira Stewart', phone:'07700 900544', email:'moira.stewart@sky.com', rel:'Mother' },
      status:'active', notes:'' },

    { id:'c05', serviceNo:'SNI-2023-1102', firstName:'Kyle',    lastName:'Anderson',
      dob:'2009-01-11', joinDate:'2023-11-15', rank:'Sgt',  classification:'LC',
      school:'Paisley Grammar', attendance:{ parades:38, present:31 },
      quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
      medical:{ barToFlying:false, conditions:'Severe nut allergy — EpiPen prescribed and carried at all times. Staff briefed. No dietary risk for range/flying activities.' },
      nextOfKin:{ name:'George Anderson', phone:'07700 900677', email:'george.anderson@gmail.com', rel:'Father' },
      status:'active', notes:'Has L98 WHT only — NOT eligible to shoot until .22 WHT complete.' },

    { id:'c06', serviceNo:'SNI-2024-1201', firstName:'Caitlin', lastName:'Fraser',
      dob:'2010-07-22', joinDate:'2024-01-17', rank:'Cpl',  classification:'FC',
      school:'St. Aidan\'s High', attendance:{ parades:32, present:30 },
      quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'David Fraser', phone:'07700 900456', email:'d.fraser1972@hotmail.co.uk', rel:'Father' },
      status:'active', notes:'L98 WHT complete, .22 WHT pending — cannot go on range yet.' },

    { id:'c07', serviceNo:'SNI-2024-1224', firstName:'Isla',    lastName:'Mackenzie',
      dob:'2010-02-03', joinDate:'2024-01-17', rank:'Cpl',  classification:'LC',
      school:'Johnstone High', attendance:{ parades:31, present:29 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:1 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Fiona Mackenzie', phone:'07700 900311', email:'fiona.mackenzie@gmail.com', rel:'Mother' },
      status:'active', notes:'' },

    { id:'c08', serviceNo:'SNI-2024-1251', firstName:'Sophie',  lastName:'Burns',
      dob:'2011-05-17', joinDate:'2024-03-06', rank:'Cpl',  classification:'FC',
      school:'Linwood Academy', attendance:{ parades:28, present:26 },
      quals:{ whtL98:false, wht22:false, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:'Mild asthma — reliever inhaler (blue) carried as needed. No preventer required. Cleared for all activities by GP.' },
      nextOfKin:{ name:'Carol Burns', phone:'07700 900892', email:'carol.burns@sky.com', rel:'Mother' },
      status:'active', notes:'Neither WHT done — priority for next range day.' },

    { id:'c09', serviceNo:'SNI-2024-1289', firstName:'Ross',    lastName:'Thomson',
      dob:'2010-09-30', joinDate:'2024-03-06', rank:'Cpl',  classification:'FC',
      school:'Johnstone High', attendance:{ parades:27, present:22 },
      quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Jim Thomson', phone:'07700 900113', email:'jimthomson@btinternet.com', rel:'Father' },
      status:'active', notes:'Both WHTs complete — eligible to shoot.' },

    { id:'c10', serviceNo:'SNI-2024-1310', firstName:'Callum',  lastName:'Robertson',
      dob:'2011-12-08', joinDate:'2024-04-10', rank:'LCdt', classification:'FC',
      school:'Paisley Grammar', attendance:{ parades:24, present:21 },
      quals:{ whtL98:false, wht22:false, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Susan Robertson', phone:'07700 900441', email:'srobertson@gmail.com', rel:'Mother' },
      status:'active', notes:'' },

    { id:'c11', serviceNo:'SNI-2024-1341', firstName:'Declan',  lastName:"O'Brien",
      dob:'2011-03-25', joinDate:'2024-04-10', rank:'LCdt', classification:'FC',
      school:'St. Aidan\'s High', attendance:{ parades:23, present:18 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:"Patrick O'Brien", phone:'07700 900552', email:'pobrien_jnst@outlook.com', rel:'Father' },
      status:'active', notes:'Attendance concern — below 80% threshold.' },

    { id:'c12', serviceNo:'SNI-2024-1377', firstName:'Megan',   lastName:'Hamilton',
      dob:'2010-06-14', joinDate:'2024-06-05', rank:'LCdt', classification:'FC',
      school:'Linwood Academy', attendance:{ parades:20, present:19 },
      quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Helen Hamilton', phone:'07700 900663', email:'helen.hamilton@gmail.com', rel:'Mother' },
      status:'active', notes:'L98 done, .22 WHT still outstanding.' },

    { id:'c13', serviceNo:'SNI-2025-1421', firstName:'Amy',     lastName:'Sinclair',
      dob:'2012-08-19', joinDate:'2025-01-22', rank:'LCdt', classification:'none',
      school:'Johnstone High', attendance:{ parades:16, present:15 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Karen Sinclair', phone:'07700 900774', email:'karensinclair@hotmail.com', rel:'Mother' },
      status:'active', notes:'Approaching 6-month mark — First Class eligible in Jul 2025.' },

    { id:'c14', serviceNo:'SNI-2025-1455', firstName:'Liam',    lastName:'Campbell',
      dob:'2012-04-07', joinDate:'2025-03-05', rank:'Cdt',  classification:'none',
      school:'Linwood Academy', attendance:{ parades:10, present:9 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Ian Campbell', phone:'07700 900885', email:'ian.campbell@sky.com', rel:'Father' },
      status:'active', notes:'' },

    { id:'c15', serviceNo:'SNI-2025-1489', firstName:'Connor',  lastName:'MacLeod',
      dob:'2012-11-23', joinDate:'2025-03-05', rank:'Cdt',  classification:'none',
      school:'Johnstone High', attendance:{ parades:10, present:10 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Claire MacLeod', phone:'07700 900996', email:'cmacleod1974@gmail.com', rel:'Mother' },
      status:'active', notes:'100% attendance — model new recruit.' },

    { id:'c16', serviceNo:'SNI-2026-1511', firstName:'Zara',    lastName:'Ahmed',
      dob:'2012-09-02', joinDate:'2026-02-04', rank:'Cdt',  classification:'none',
      school:'Paisley Grammar', attendance:{ parades:6, present:5 },
      quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
              dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
      medical:{ barToFlying:false, conditions:null },
      nextOfKin:{ name:'Fatima Ahmed', phone:'07700 901007', email:'fatima.ahmed@gmail.com', rel:'Mother' },
      status:'active', notes:'New recruit Feb 2026.' },
  ];

  // TG23 is NOT a primary event form — it is generated per-cadet only when medical.conditions is set.
  // Primary forms: TG21 (shooting/range), D5 (flying/gliding), RA (risk assessment for other activities).
  const needsTG23 = (c) => !!c.medical.conditions;

  // Forms needed for a cadet attending an event: primary form + TG23 if medical condition
  const formsForCadet = (c, eventHsForm) => {
    const forms = [eventHsForm];
    if (needsTG23(c)) forms.push('TG23');
    return forms;
  };

  const getFormStatus = (eventId, cadetId) =>
    formStatus[eventId]?.[cadetId] || 'unsent';

  const setOneFormStatus = (eventId, cadetId, status) =>
    setFormStatus(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], [cadetId]: status },
    }));

  const sendAll = (eventId, cadetIds) => {
    const updates = {};
    cadetIds.forEach(id => { if (getFormStatus(eventId, id) === 'unsent') updates[id] = 'sent'; });
    setFormStatus(prev => ({ ...prev, [eventId]: { ...prev[eventId], ...updates } }));
    fireToast(`Forms sent to ${Object.keys(updates).length} parent${Object.keys(updates).length !== 1 ? 's' : ''} for e-signature`);
  };

  const upcomingEvents = [
    { id:'e1', name:'Shooting — L98 LFMT 6', date:'2026-05-16', type:'Shooting',   eligible: (c) => canShoot(c),              hsForm:'TG21', leadStaff:'FS Macfarlane', status:'approved' },
    { id:'e2', name:'Sector 4 AFA Course',   date:'2026-05-23', type:'First Aid',   eligible: (c) => getAge(c.dob) >= 14,      hsForm:'RA',   leadStaff:'CI Sweeney',     status:'pending' },
    { id:'e3', name:'Bronze Wings Synthetic', date:'2026-05-23', type:'Flying',     eligible: (c) => canFly(c),                hsForm:'D5',   leadStaff:'Flt Lt Pryde',   status:'pending' },
    { id:'e4', name:'WSW Road Marching',     date:'2026-05-30', type:'Sport',       eligible: (c) => getAge(c.dob) >= 13,      hsForm:'RA',   leadStaff:'Plt Off Hooks',  status:'draft' },
    { id:'e5', name:'North Region Music Camp',date:'2026-05-22', type:'Music',      eligible: (c) => c.status === 'active',    hsForm:'RA',   leadStaff:'CI Sweeney',     status:'approved' },
    { id:'e6', name:'Cyber Gold QCCD/013',   date:'2026-05-22', type:'Radio/Cyber', eligible: (c) => c.classification !== 'none', hsForm:'RA', leadStaff:'Plt Off Young', status:'approved' },
  ];

  const ACTIVITIES = [
    { id:'shooting-l98', label:'L98 Shooting',        icon: Crosshair, check: (c) => canShoot(c),
      reason: (c) => !c.quals.whtL98 && !c.quals.wht22 ? 'No WHTs completed' : !c.quals.whtL98 ? 'L98 WHT missing' : !c.quals.wht22 ? '.22 WHT missing' : getAge(c.dob) < 13 ? 'Under 13' : '' },
    { id:'aef',          label:'Air Exp. Flying (AEF)',icon: Plane,      check: (c) => canFly(c),
      reason: (c) => getAge(c.dob) < 13 ? 'Under 13' : c.medical.barToFlying ? 'Medical bar to flying' : '' },
    { id:'gliding',      label:'Gliding',              icon: Plane,      check: (c) => canFly(c),
      reason: (c) => getAge(c.dob) < 13 ? 'Under 13' : c.medical.barToFlying ? 'Medical bar' : '' },
    { id:'at',           label:'Adventure Training',   icon: Mountain,   check: (c) => getAge(c.dob) >= 14,
      reason: (c) => getAge(c.dob) < 14 ? 'Must be 14+' : '' },
    { id:'dofe-bronze',  label:'DofE Bronze',          icon: Award,      check: (c) => getAge(c.dob) >= 14 && !c.quals.dofeBronze,
      reason: (c) => getAge(c.dob) < 14 ? 'Must be 14+' : c.quals.dofeBronze ? 'Already achieved' : '' },
    { id:'music',        label:'Music Camp',           icon: Music,      check: (c) => c.status === 'active',
      reason: () => '' },
    { id:'radio',        label:'Radio / Cyber Course', icon: Radio,      check: (c) => c.classification !== 'none',
      reason: (c) => c.classification === 'none' ? 'Classification required' : '' },
  ];

  // === DERIVED / COMPUTED ===
  const activeCadets = cadets.filter(c => c.status === 'active');

  const promotionReady = activeCadets.filter(c => {
    const e = classEligibility(c);
    return e.eligible && !promotionApproved[c.id];
  });

  const dbsAlerts = staff.filter(s => {
    const exp = new Date(s.dbs);
    const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return daysLeft < 90;
  });

  const filteredCadets = useMemo(() => {
    return activeCadets.filter(c => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchSearch = !cadetSearch || name.includes(cadetSearch.toLowerCase()) || c.serviceNo.includes(cadetSearch);
      const matchRank = rankFilter === 'all' || c.rank === rankFilter;
      const matchClass = classFilter === 'all' || c.classification === classFilter;
      return matchSearch && matchRank && matchClass;
    });
  }, [cadetSearch, rankFilter, classFilter, activeCadets]);

  const shootingEligible = activeCadets.filter(c => canShoot(c));
  const flyingEligible   = activeCadets.filter(c => canFly(c));

  const attPct = (c) => c.attendance.parades === 0 ? 0 :
    Math.round((c.attendance.present / c.attendance.parades) * 100);

  // === INLINE CSS ===
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

    body { background: #f0f4f8; }

    .raf-blue    { background: #003082; }
    .raf-red     { background: #cf142b; }
    .raf-gold    { background: #c8a951; }
    .raf-dark    { background: #0d1f44; }

    .sidebar-nav { background: #0d1f44; min-height: 100vh; width: 220px; flex-shrink: 0; }
    .sidebar-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:8px;
                    cursor:pointer; font-size:13px; font-weight:500; color:rgba(255,255,255,0.65);
                    transition:all 0.15s; margin:1px 8px; }
    .sidebar-item:hover  { background:rgba(255,255,255,0.08); color:white; }
    .sidebar-item.active { background:rgba(255,255,255,0.12); color:white; }

    .stat-card { background:white; border-radius:14px; padding:20px 22px;
                 border:1px solid rgba(0,0,0,0.06); }
    .stat-card.alert { border-left:3px solid #cf142b; }
    .stat-card.good  { border-left:3px solid #16a34a; }
    .stat-card.info  { border-left:3px solid #003082; }

    .cadet-row { display:grid; align-items:center; padding:11px 16px;
                 border-bottom:1px solid #f1f5f9; cursor:pointer; transition:background 0.1s;
                 grid-template-columns: 180px 70px 80px 80px 60px 60px 60px 1fr; }
    .cadet-row:hover { background:#f8fafc; }

    .rank-chip { display:inline-flex; align-items:center; padding:2px 8px; border-radius:6px;
                 font-size:11px; font-weight:600; background:#e2e8f0; color:#334155; }
    .rank-chip.senior { background:#0d1f44; color:white; }

    .qual-dot { width:9px; height:9px; border-radius:50%; display:inline-block; }
    .qual-dot.yes { background:#16a34a; }
    .qual-dot.no  { background:#e2e8f0; }
    .qual-dot.warn { background:#f59e0b; }

    .progress-bar { height:6px; border-radius:3px; background:#e2e8f0; overflow:hidden; }
    .progress-fill { height:100%; border-radius:3px; background:#003082; transition:width 0.4s; }
    .progress-fill.good { background:#16a34a; }
    .progress-fill.warn { background:#f59e0b; }
    .progress-fill.danger { background:#cf142b; }

    .badge-mac { background:linear-gradient(135deg,#c8a951,#a87b2a); color:white;
                 padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700; }
    .badge-sc  { background:#7c3aed; color:white; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:600; }
    .badge-lc  { background:#059669; color:white; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:600; }
    .badge-fc  { background:#1d4ed8; color:white; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:600; }
    .badge-none{ background:#e2e8f0; color:#64748b; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:500; }

    .elig-card  { border-radius:12px; padding:14px 16px; border:1px solid #e2e8f0;
                  display:flex; align-items:center; gap:12px; background:white; }
    .elig-card.yes-card { border-color:#bbf7d0; background:#f0fdf4; }
    .elig-card.no-card  { border-color:#fecaca; background:#fff5f5; }

    .event-card { background:white; border-radius:12px; padding:16px 20px;
                  border:1px solid rgba(0,0,0,0.06); margin-bottom:10px; }
    .event-card .status-dot { width:8px; height:8px; border-radius:50%; }
    .event-card .status-dot.approved { background:#16a34a; }
    .event-card .status-dot.pending  { background:#f59e0b; }
    .event-card .status-dot.draft    { background:#94a3b8; }

    .drawer { position:fixed; top:0; right:0; bottom:0; width:480px; background:white;
              box-shadow:-8px 0 40px rgba(0,0,0,0.12); z-index:50; overflow-y:auto; }

    .report-table { width:100%; border-collapse:collapse; font-size:13px; }
    .report-table th { background:#0d1f44; color:white; padding:8px 12px; text-align:left; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; }
    .report-table td { padding:9px 12px; border-bottom:1px solid #f1f5f9; }
    .report-table tr:hover td { background:#f8fafc; }

    .toast-bar { position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
                 background:#0d1f44; color:white; padding:10px 20px; border-radius:10px;
                 font-size:13px; z-index:99; display:flex; align-items:center; gap:8px; }

    .section-head { font-size:10px; text-transform:uppercase; letter-spacing:0.12em;
                    color:#94a3b8; font-weight:600; margin-bottom:8px; }

    .btn-primary { background:#003082; color:white; border:none; padding:8px 18px;
                   border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; }
    .btn-primary:hover { background:#00256a; }
    .btn-sm { padding:5px 12px; font-size:12px; border-radius:6px; }
    .btn-ghost { background:transparent; border:1px solid #e2e8f0; color:#475569;
                 padding:7px 14px; border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.15s; }
    .btn-ghost:hover { background:#f8fafc; border-color:#cbd5e1; }
    .btn-danger { background:#cf142b; color:white; border:none; padding:7px 14px;
                  border-radius:8px; font-size:13px; cursor:pointer; }

    input.search-input { border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px 8px 36px;
                         font-size:13px; outline:none; background:white; width:240px; }
    input.search-input:focus { border-color:#003082; }
    select.filter-select { border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px;
                           font-size:13px; outline:none; background:white; cursor:pointer; }
    select.filter-select:focus { border-color:#003082; }
  `;

  // === PRIMITIVE COMPONENTS ===
  const ClassBadge = ({ cls }) => {
    const m = CLASS_META[cls] || CLASS_META.none;
    const cls2 = cls === 'MAC' ? 'badge-mac' : cls === 'SC' ? 'badge-sc' : cls === 'LC' ? 'badge-lc' : cls === 'FC' ? 'badge-fc' : 'badge-none';
    return <span className={cls2}>{m.short === '—' ? 'None' : m.label}</span>;
  };

  const RankChip = ({ rank }) => {
    const senior = ['Sgt','FS','WO'].includes(rank);
    return <span className={`rank-chip ${senior ? 'senior' : ''}`}>{rank}</span>;
  };

  const AttPct = ({ c }) => {
    const pct = attPct(c);
    const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#f59e0b' : '#cf142b';
    return (
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <div className="progress-bar" style={{ width:48 }}>
          <div className="progress-fill" style={{ width:`${pct}%`, background: color }} />
        </div>
        <span style={{ fontSize:12, color, fontWeight:600 }}>{pct}%</span>
      </div>
    );
  };

  const ShootDots = ({ c }) => (
    <div style={{ display:'flex', gap:4, alignItems:'center' }}>
      <span className={`qual-dot ${c.quals.whtL98 ? 'yes' : 'no'}`} title="L98 WHT" />
      <span className={`qual-dot ${c.quals.wht22 ? 'yes' : 'no'}`} title=".22 WHT" />
    </div>
  );

  // === SCREENS ===

  // ── DASHBOARD ────────────────────────────────────────────
  const DashboardScreen = () => {
    const totalActive = activeCadets.length;
    const shootingCount = shootingEligible.length;
    const flyingCount = flyingEligible.length;
    const avgAtt = Math.round(activeCadets.reduce((s,c) => s + attPct(c), 0) / totalActive);
    const lowAtt = activeCadets.filter(c => attPct(c) < 60).length;

    return (
      <div>
        <div style={{ marginBottom:24 }}>
          <div className="section-head">Squadron Status — {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#0d1f44', margin:0 }}>{SQUADRON.name}</h1>
          <div style={{ fontSize:13, color:'#64748b', marginTop:3 }}>{SQUADRON.sector} · {SQUADRON.region}</div>
        </div>

        {/* Stat cards row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          <div className="stat-card info">
            <div className="section-head" style={{ marginBottom:4 }}>Active Cadets</div>
            <div style={{ fontSize:32, fontWeight:700, color:'#0d1f44' }}>{totalActive}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>of {cadets.length} on strength</div>
          </div>
          <div className={`stat-card ${avgAtt >= 80 ? 'good' : 'alert'}`}>
            <div className="section-head" style={{ marginBottom:4 }}>Avg Attendance</div>
            <div style={{ fontSize:32, fontWeight:700, color: avgAtt >= 80 ? '#15803d' : '#cf142b' }}>{avgAtt}%</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{lowAtt} cadet{lowAtt !== 1 ? 's' : ''} below 60%</div>
          </div>
          <div className="stat-card info">
            <div className="section-head" style={{ marginBottom:4 }}>Shooting Eligible</div>
            <div style={{ fontSize:32, fontWeight:700, color:'#0d1f44' }}>{shootingCount}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Both WHTs complete</div>
          </div>
          <div className="stat-card info">
            <div className="section-head" style={{ marginBottom:4 }}>Flying Eligible</div>
            <div style={{ fontSize:32, fontWeight:700, color:'#0d1f44' }}>{flyingCount}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>AEF / Gliding</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>

          {/* Promotion ready */}
          <div>
            <div className="section-head">Ready for Promotion / Classification</div>
            <div style={{ background:'white', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden' }}>
              {promotionReady.length === 0 ? (
                <div style={{ padding:'20px 16px', color:'#64748b', fontSize:13 }}>No cadets currently eligible for promotion.</div>
              ) : promotionReady.map(c => {
                const e = classEligibility(c);
                return (
                  <div key={c.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #f1f5f9', gap:12 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:'#0d1f44' }}>{c.firstName} {c.lastName}</div>
                      <div style={{ fontSize:12, color:'#64748b', marginTop:1 }}>
                        {c.rank} · <ClassBadge cls={c.classification} /> → <strong>{e.nextLabel}</strong>
                      </div>
                    </div>
                    <button className="btn-primary btn-sm" onClick={() => {
                      setPromotionApproved(p => ({ ...p, [c.id]: true }));
                      fireToast(`${c.firstName} ${c.lastName} promoted to ${e.nextLabel}`);
                    }}>Approve</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WHT gaps */}
          <div>
            <div className="section-head">WHT Status — Shooting Eligibility</div>
            <div style={{ background:'white', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 80px', padding:'8px 16px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                <span>Cadet</span><span>L98</span><span>.22</span><span>Eligible</span>
              </div>
              {activeCadets.filter(c => getAge(c.dob) >= 13).map(c => (
                <div key={c.id} style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 80px', padding:'9px 16px', borderBottom:'1px solid #f1f5f9', alignItems:'center', fontSize:13 }}>
                  <span style={{ fontWeight:500 }}>{c.firstName} {c.lastName}</span>
                  <span>{c.quals.whtL98 ? <CircleCheck size={14} color="#16a34a" /> : <X size={14} color="#cf142b" />}</span>
                  <span>{c.quals.wht22 ? <CircleCheck size={14} color="#16a34a" /> : <X size={14} color="#cf142b" />}</span>
                  <span style={{ fontSize:11, fontWeight:600, color: canShoot(c) ? '#15803d' : '#cf142b' }}>
                    {canShoot(c) ? 'Eligible' : 'NOT eligible'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div>
            <div className="section-head">Upcoming Events — H&S Status</div>
            {upcomingEvents.slice(0,4).map(ev => (
              <div key={ev.id} className="event-card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:8 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <div className={`event-card status-dot ${ev.status}`} />
                    <span style={{ fontWeight:600, fontSize:14, color:'#0d1f44' }}>{ev.name}</span>
                  </div>
                  <div style={{ fontSize:12, color:'#64748b' }}>
                    {new Date(ev.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})} · {ev.attendees} attending · {ev.hsForm} required · {ev.leadStaff}
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:6,
                  background: ev.status==='approved' ? '#dcfce7' : ev.status==='pending' ? '#fef9c3' : '#f1f5f9',
                  color: ev.status==='approved' ? '#15803d' : ev.status==='pending' ? '#a16207' : '#64748b',
                  whiteSpace:'nowrap'
                }}>{ev.status.charAt(0).toUpperCase()+ev.status.slice(1)}</span>
              </div>
            ))}
          </div>

          {/* DBS alerts */}
          <div>
            <div className="section-head">Staff DBS / CTC Alerts</div>
            <div style={{ background:'white', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden' }}>
              {staff.map(s => {
                const dbsDate = new Date(s.dbs);
                const daysLeft = Math.ceil((dbsDate - today) / (1000 * 60 * 60 * 24));
                const warn = daysLeft < 90;
                return (
                  <div key={s.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:'1px solid #f1f5f9', gap:12 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:'#0d1f44' }}>{s.rank} {s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{s.role}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, fontWeight:600, color: warn ? '#cf142b' : '#15803d' }}>
                        DBS {warn ? '⚠ ' : '✓ '}{daysLeft}d
                      </div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{dbsDate.toLocaleDateString('en-GB')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Foundation skills */}
          <div style={{ gridColumn:'1/-1' }}>
            <div className="section-head">Foundation Skills Progress (Unit vs Target)</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {[
                { label:'18 Months Service', count: activeCadets.filter(c => getMonths(c.joinDate) >= 18).length },
                { label:'First Aid / Heartstart', count: activeCadets.filter(c => c.quals.firstAid).length },
                { label:'DofE Bronze', count: activeCadets.filter(c => c.quals.dofeBronze).length },
                { label:'Youth First Aid', count: activeCadets.filter(c => c.quals.youthFirstAid).length },
              ].map(({ label, count }) => {
                const pct = Math.round((count / totalActive) * 100);
                return (
                  <div className="stat-card" key={label}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#475569', marginBottom:8 }}>{label}</div>
                    <div style={{ fontSize:22, fontWeight:700, color:'#0d1f44', marginBottom:6 }}>{count} <span style={{ fontSize:14, color:'#94a3b8' }}>/ {totalActive}</span></div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${pct >= 75 ? 'good' : pct >= 50 ? 'warn' : 'danger'}`} style={{ width:`${pct}%` }} />
                    </div>
                    <div style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  };

  // ── CADETS ────────────────────────────────────────────────
  const CadetsScreen = () => (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div className="section-head">Cadet Roster</div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0d1f44', margin:0 }}>
            {filteredCadets.length} of {activeCadets.length} cadets
          </h2>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
            <input className="search-input" placeholder="Search name or service no." value={cadetSearch} onChange={e => setCadetSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={rankFilter} onChange={e => setRankFilter(e.target.value)}>
            <option value="all">All ranks</option>
            {RANK_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="all">All classifications</option>
            {CLASS_ORDER.map(c => <option key={c} value={c}>{CLASS_META[c].label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden' }}>
        {/* Header */}
        <div className="cadet-row" style={{ background:'#f8fafc', cursor:'default', borderBottom:'2px solid #e2e8f0' }}>
          {['Name','Rank','Class','Attend','L98','  .22','Fly','Notes / Actions'].map(h => (
            <div key={h} style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</div>
          ))}
        </div>
        {filteredCadets.map(c => {
          const e = classEligibility(c);
          const fly = canFly(c);
          return (
            <div key={c.id} className="cadet-row" onClick={() => setSelectedCadet(c)}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:'#0d1f44' }}>{c.firstName} {c.lastName}</div>
                <div style={{ fontSize:11, color:'#94a3b8', fontFamily:'monospace' }}>{c.serviceNo}</div>
              </div>
              <RankChip rank={c.rank} />
              <ClassBadge cls={c.classification} />
              <AttPct c={c} />
              <span className={`qual-dot ${c.quals.whtL98 ? 'yes' : 'no'}`} />
              <span className={`qual-dot ${c.quals.wht22 ? 'yes' : 'no'}`} />
              <span className={`qual-dot ${fly ? 'yes' : 'no'}`} />
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                {e.eligible && !promotionApproved[c.id] && (
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:6, background:'#fef9c3', color:'#a16207' }}>
                    ↑ {e.nextLabel}
                  </span>
                )}
                {attPct(c) < 60 && (
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:6, background:'#fee2e2', color:'#b91c1c' }}>
                    Low att
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize:11, color:'#94a3b8', marginTop:10, display:'flex', gap:16 }}>
        <span>● Green dot = qualified &nbsp; ○ Grey dot = not yet</span>
        <span>L98 = L98 WHT &nbsp; .22 = .22 WHT &nbsp; Fly = AEF eligible</span>
        <strong style={{ color:'#cf142b' }}>Shooting: BOTH dots must be green</strong>
      </div>
    </div>
  );

  // ── CADET PROFILE DRAWER ──────────────────────────────────
  const CadetDrawer = () => {
    if (!selectedCadet) return null;
    const c = selectedCadet;
    const e = classEligibility(c);
    const months = getMonths(c.joinDate);
    const age = getAge(c.dob);
    const shoot = canShoot(c);
    const fly = canFly(c);

    return (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:40 }} onClick={() => setSelectedCadet(null)}>
        <div className="drawer" onClick={ev => ev.stopPropagation()}>
          {/* Header */}
          <div style={{ background:'#0d1f44', padding:'20px 24px', color:'white' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:20, fontWeight:700 }}>{c.firstName} {c.lastName}</div>
                <div style={{ fontSize:12, opacity:0.7, marginTop:2 }}>{c.serviceNo} · {c.school}</div>
                <div style={{ display:'flex', gap:8, marginTop:10 }}>
                  <RankChip rank={c.rank} />
                  <ClassBadge cls={c.classification} />
                </div>
              </div>
              <button onClick={() => setSelectedCadet(null)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'white', borderRadius:8, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16} /></button>
            </div>
          </div>

          <div style={{ padding:'20px 24px' }}>

            {/* Quick stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
              {[
                { label:'Age', value:`${age} yrs` },
                { label:'Service', value:`${months} months` },
                { label:'Attendance', value:`${attPct(c)}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background:'#f8fafc', borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
                  <div style={{ fontSize:20, fontWeight:700, color:'#0d1f44', marginTop:4 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Eligibility summary */}
            <div className="section-head">Activity Eligibility</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              <div className={`elig-card ${shoot ? 'yes-card' : 'no-card'}`}>
                <Crosshair size={16} color={shoot ? '#15803d' : '#cf142b'} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color: shoot ? '#15803d' : '#cf142b' }}>
                    {shoot ? 'Eligible to Shoot' : 'Not eligible'}
                  </div>
                  {!shoot && (
                    <div style={{ fontSize:11, color:'#64748b' }}>
                      {!c.quals.whtL98 && 'L98 WHT missing · '}
                      {!c.quals.wht22 && '.22 WHT missing'}
                      {age < 13 && 'Under 13'}
                    </div>
                  )}
                </div>
              </div>
              <div className={`elig-card ${fly ? 'yes-card' : 'no-card'}`}>
                <Plane size={16} color={fly ? '#15803d' : '#cf142b'} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color: fly ? '#15803d' : '#cf142b' }}>
                    {fly ? 'Eligible to Fly' : 'Not eligible'}
                  </div>
                  {!fly && <div style={{ fontSize:11, color:'#64748b' }}>{age < 13 ? 'Under 13' : 'Medical bar'}</div>}
                </div>
              </div>
            </div>

            {/* Classification progress */}
            <div className="section-head">Classification Progress</div>
            <div style={{ background:'#f8fafc', borderRadius:10, padding:16, marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#0d1f44' }}>
                    Current: <ClassBadge cls={c.classification} />
                  </div>
                  {e.nextClass && (
                    <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>
                      Next: {e.nextLabel} — {e.eligible ? '✓ All criteria met' : `${e.blockers.length} requirement${e.blockers.length > 1 ? 's' : ''} outstanding`}
                    </div>
                  )}
                </div>
                {e.eligible && !promotionApproved[c.id] && (
                  <button className="btn-primary btn-sm" onClick={() => {
                    setPromotionApproved(p => ({ ...p, [c.id]: true }));
                    fireToast(`${c.firstName} ${c.lastName} approved for ${e.nextLabel}`);
                    setSelectedCadet({ ...c, classification: e.nextClass });
                  }}>Approve Promotion</button>
                )}
                {promotionApproved[c.id] && <span style={{ fontSize:12, color:'#15803d', fontWeight:600 }}>✓ Promoted</span>}
              </div>
              {e.blockers.length > 0 && (
                <div style={{ fontSize:12, color:'#64748b' }}>
                  <div style={{ fontWeight:600, marginBottom:4, color:'#475569' }}>Outstanding requirements:</div>
                  {e.blockers.map(b => <div key={b} style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}><AlertCircle size={12} color="#f59e0b" />{b}</div>)}
                </div>
              )}
            </div>

            {/* Qualifications */}
            <div className="section-head">Qualifications & Training</div>
            <div style={{ background:'white', borderRadius:10, border:'1px solid #e2e8f0', overflow:'hidden', marginBottom:20 }}>
              {[
                { label:'L98 WHT (LFMT)',        value: c.quals.whtL98 },
                { label:'.22 WHT',               value: c.quals.wht22 },
                { label:'First Aid / Heartstart', value: c.quals.firstAid },
                { label:'Youth First Aid',        value: c.quals.youthFirstAid },
                { label:'DofE Bronze',            value: c.quals.dofeBronze },
                { label:'DofE Silver',            value: c.quals.dofeSilver },
                { label:'BTEC Level 2',           value: c.quals.btecL2 },
                { label:'AEF Sorties',            value: c.quals.aef > 0, extra: `${c.quals.aef} sorties` },
                { label:'Gliding Sorties',        value: c.quals.gliding > 0, extra: `${c.quals.gliding} sorties` },
              ].map(({ label, value, extra }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', borderBottom:'1px solid #f1f5f9', fontSize:13 }}>
                  <span style={{ color:'#374151' }}>{label}</span>
                  <span style={{ fontWeight:600, color: value ? '#15803d' : '#94a3b8', display:'flex', alignItems:'center', gap:6 }}>
                    {value ? <><CircleCheck size={14} />{extra || 'Complete'}</> : '—'}
                  </span>
                </div>
              ))}
            </div>

            {/* Medical conditions */}
            {needsTG23(c) && (
              <>
                <div className="section-head">Medical Conditions — TG23 Required</div>
                <div style={{ background:'#fffbeb', borderRadius:10, padding:14, marginBottom:20, fontSize:13, border:'1px solid #fde68a' }}>
                  <div style={{ fontWeight:600, color:'#92400e', marginBottom:4 }}>⚕ Condition on record</div>
                  <div style={{ color:'#78350f', lineHeight:1.5 }}>{c.medical.conditions}</div>
                  <div style={{ fontSize:11, color:'#a16207', marginTop:8 }}>A TG23 form will be included automatically when this cadet attends any activity.</div>
                </div>
              </>
            )}

            {/* Next of kin */}
            <div className="section-head">Next of Kin / Parent Contact</div>
            <div style={{ background:'#f8fafc', borderRadius:10, padding:14, marginBottom:20, fontSize:13 }}>
              <div style={{ fontWeight:600, color:'#0d1f44' }}>{c.nextOfKin.name} ({c.nextOfKin.rel})</div>
              <div style={{ color:'#64748b', marginTop:4, display:'flex', gap:16 }}>
                <span>{c.nextOfKin.phone}</span>
                <span style={{ color:'#003082' }}>{c.nextOfKin.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-primary" onClick={() => { setShowD5Modal(c); setSelectedCadet(null); }}>
                Generate D5 (Flying)
              </button>
              <button className="btn-ghost" onClick={() => { setTab('reports'); setSelectedCadet(null); }}>
                View Reports
              </button>
            </div>

            {c.notes && (
              <div style={{ marginTop:16, padding:12, background:'#fef9c3', borderRadius:8, fontSize:12, color:'#713f12' }}>
                <strong>Notes:</strong> {c.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── ELIGIBILITY CHECKER ────────────────────────────────────
  const EligibilityScreen = () => {
    const act = ACTIVITIES.find(a => a.id === selectedActivity);
    const eligible = activeCadets.filter(c => act.check(c));
    const ineligible = activeCadets.filter(c => !act.check(c));

    return (
      <div>
        <div style={{ marginBottom:20 }}>
          <div className="section-head">Course Eligibility Checker</div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0d1f44', margin:0 }}>Select an activity to see who qualifies</h2>
        </div>

        {/* Activity selector */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
          {ACTIVITIES.map(a => {
            const I = a.icon;
            return (
              <button key={a.id} onClick={() => setSelectedActivity(a.id)}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:20,
                  border: selectedActivity === a.id ? 'none' : '1px solid #e2e8f0',
                  background: selectedActivity === a.id ? '#003082' : 'white',
                  color: selectedActivity === a.id ? 'white' : '#374151',
                  fontSize:13, fontWeight:500, cursor:'pointer' }}>
                <I size={14} />{a.label}
              </button>
            );
          })}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>

          {/* Eligible */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <CircleCheck size={16} color="#15803d" />
              <span style={{ fontSize:14, fontWeight:700, color:'#15803d' }}>Eligible — {eligible.length} cadets</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {eligible.map(c => (
                <div key={c.id} className="elig-card yes-card" style={{ cursor:'pointer' }} onClick={() => setSelectedCadet(c)}>
                  <CircleCheck size={14} color="#15803d" />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#0d1f44' }}>{c.firstName} {c.lastName}</div>
                    <div style={{ fontSize:11, color:'#64748b' }}>{c.rank} · <span style={{ fontWeight:500 }}>{CLASS_META[c.classification].label}</span> · Age {getAge(c.dob)}</div>
                  </div>
                </div>
              ))}
              {eligible.length === 0 && <div style={{ color:'#94a3b8', fontSize:13 }}>No cadets currently eligible.</div>}
            </div>
          </div>

          {/* Not eligible */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <AlertCircle size={16} color="#cf142b" />
              <span style={{ fontSize:14, fontWeight:700, color:'#cf142b' }}>Not Eligible — {ineligible.length} cadets</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {ineligible.map(c => (
                <div key={c.id} className="elig-card no-card" style={{ cursor:'pointer' }} onClick={() => setSelectedCadet(c)}>
                  <AlertCircle size={14} color="#cf142b" />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#0d1f44' }}>{c.firstName} {c.lastName}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>{act.reason(c)}</div>
                  </div>
                </div>
              ))}
              {ineligible.length === 0 && <div style={{ color:'#94a3b8', fontSize:13 }}>All cadets eligible!</div>}
            </div>
          </div>

        </div>

        {/* Shooting eligibility note */}
        {selectedActivity === 'shooting-l98' && (
          <div style={{ marginTop:20, padding:14, background:'#fef2f2', borderRadius:10, border:'1px solid #fecaca', fontSize:13, color:'#7f1d1d', display:'flex', gap:10, alignItems:'flex-start' }}>
            <AlertTriangle size={16} style={{ flexShrink:0, marginTop:1 }} />
            <div><strong>Shooting policy:</strong> Both the L98 WHT and the .22 WHT must be fully completed before a cadet may attend any live firing range. Completion of one WHT only does <em>not</em> confer eligibility. This is enforced automatically — cadets with only one WHT show as Not Eligible above.</div>
          </div>
        )}
      </div>
    );
  };

  // ── ATTENDANCE ─────────────────────────────────────────────
  const AttendanceScreen = () => {
    const markAll = (status) => {
      const marks = {};
      activeCadets.forEach(c => { marks[c.id] = status; });
      setAttendanceMarks(marks);
    };
    const presentCount = Object.values(attendanceMarks).filter(v => v === 'present').length;
    const absentCount  = Object.values(attendanceMarks).filter(v => v === 'absent').length;
    const excusedCount = Object.values(attendanceMarks).filter(v => v === 'excused').length;

    return (
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div className="section-head">Parade Night Attendance</div>
            <h2 style={{ fontSize:20, fontWeight:700, color:'#0d1f44', margin:0 }}>Mark Attendance</h2>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
              style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:'7px 12px', fontSize:13 }} />
            <button className="btn-ghost" onClick={() => markAll('present')}>Mark all present</button>
            <button className="btn-primary" onClick={() => {
              fireToast(`Attendance saved — ${presentCount} present, ${absentCount} absent, ${excusedCount} excused`);
            }}>Save Attendance</button>
          </div>
        </div>

        {/* Summary pills */}
        {Object.keys(attendanceMarks).length > 0 && (
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            {[
              { label:`${presentCount} Present`, color:'#dcfce7', text:'#15803d' },
              { label:`${absentCount} Absent`, color:'#fee2e2', text:'#b91c1c' },
              { label:`${excusedCount} Excused`, color:'#fef9c3', text:'#a16207' },
            ].map(({ label, color, text }) => (
              <span key={label} style={{ padding:'4px 12px', borderRadius:20, background:color, color:text, fontSize:12, fontWeight:600 }}>{label}</span>
            ))}
          </div>
        )}

        <div style={{ background:'white', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden' }}>
          {activeCadets.map(c => {
            const mark = attendanceMarks[c.id];
            return (
              <div key={c.id} style={{ display:'flex', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid #f1f5f9', gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:'#0d1f44' }}>{c.firstName} {c.lastName}</div>
                  <div style={{ fontSize:12, color:'#94a3b8' }}>{c.rank} · {attPct(c)}% overall</div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {['present','absent','excused'].map(status => (
                    <button key={status} onClick={() => setAttendanceMarks(m => ({ ...m, [c.id]: status }))}
                      style={{ padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', border:'none',
                        background: mark === status
                          ? status === 'present' ? '#15803d' : status === 'absent' ? '#cf142b' : '#a16207'
                          : '#f1f5f9',
                        color: mark === status ? 'white' : '#64748b'
                      }}>{status.charAt(0).toUpperCase()+status.slice(1)}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── REPORTS ────────────────────────────────────────────────
  const ReportsScreen = () => {
    const shootingList = activeCadets.filter(c => canShoot(c));
    const flyingList   = activeCadets.filter(c => canFly(c));
    const classReport  = activeCadets.map(c => ({ ...c, elig: classEligibility(c) }));

    return (
      <div>
        <div style={{ marginBottom:20 }}>
          <div className="section-head">Reports</div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0d1f44', margin:0 }}>Generate & Export</h2>
        </div>

        {/* Report selector tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:24, background:'#f1f5f9', borderRadius:10, padding:4, width:'fit-content' }}>
          {[
            { id:'shooting', label:'Eligible to Shoot' },
            { id:'flying',   label:'Flying / D5' },
            { id:'classification', label:'Classification' },
            { id:'dbs',      label:'Staff DBS/CTC' },
          ].map(r => (
            <button key={r.id} onClick={() => setReportType(r.id)}
              style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', border:'none',
                background: reportType === r.id ? 'white' : 'transparent',
                color: reportType === r.id ? '#0d1f44' : '#64748b',
                boxShadow: reportType === r.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Report: Eligible to Shoot */}
        {reportType === 'shooting' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'#0d1f44' }}>Eligible to Shoot — L98 & .22</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Both WHTs confirmed complete · {SQUADRON.name} · {new Date().toLocaleDateString('en-GB')}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ padding:'4px 12px', borderRadius:20, background:'#dcfce7', color:'#15803d', fontSize:12, fontWeight:600 }}>{shootingList.length} Eligible</span>
                <span style={{ padding:'4px 12px', borderRadius:20, background:'#fee2e2', color:'#b91c1c', fontSize:12, fontWeight:600 }}>{activeCadets.length - shootingList.length} Not Eligible</span>
                <button className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => fireToast('TG21 exported · TG23 generated for cadets with medical conditions')}><Download size={14} />Export (TG21 + TG23s)</button>
              </div>
            </div>
            <table className="report-table">
              <thead><tr>
                <th>Name</th><th>Service No.</th><th>Rank</th><th>Age</th><th>L98 WHT</th><th>.22 WHT</th><th>Eligible</th><th>TG23</th>
              </tr></thead>
              <tbody>
                {activeCadets.filter(c => getAge(c.dob) >= 13).map(c => (
                  <tr key={c.id} style={{ background: needsTG23(c) ? '#fffbf0' : 'white' }}>
                    <td style={{ fontWeight:500 }}>{c.firstName} {c.lastName}</td>
                    <td style={{ fontFamily:'monospace', fontSize:12 }}>{c.serviceNo}</td>
                    <td><RankChip rank={c.rank} /></td>
                    <td>{getAge(c.dob)}</td>
                    <td style={{ color: c.quals.whtL98 ? '#15803d' : '#cf142b', fontWeight:600 }}>{c.quals.whtL98 ? '✓ Complete' : '✗ Incomplete'}</td>
                    <td style={{ color: c.quals.wht22 ? '#15803d' : '#cf142b', fontWeight:600 }}>{c.quals.wht22 ? '✓ Complete' : '✗ Incomplete'}</td>
                    <td style={{ fontWeight:700, color: canShoot(c) ? '#15803d' : '#cf142b' }}>{canShoot(c) ? 'YES' : 'NO'}</td>
                    <td style={{ fontSize:12 }}>{needsTG23(c) ? <span style={{ color:'#92400e', fontWeight:600 }}>⚕ Required</span> : <span style={{ color:'#94a3b8' }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report: Flying / D5 */}
        {reportType === 'flying' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'#0d1f44' }}>Flying Eligibility — AEF & Gliding</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>D5 forms required per cadet · {SQUADRON.name}</div>
              </div>
              <button className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => fireToast('D5 batch generated for all eligible cadets')}><Download size={14} />Generate All D5s</button>
            </div>
            <table className="report-table">
              <thead><tr>
                <th>Name</th><th>DOB</th><th>Age</th><th>Medical</th><th>AEF Sorties</th><th>Gliding Sorties</th><th>Eligible</th><th>D5</th>
              </tr></thead>
              <tbody>
                {activeCadets.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight:500 }}>{c.firstName} {c.lastName}</td>
                    <td style={{ fontFamily:'monospace', fontSize:12 }}>{new Date(c.dob).toLocaleDateString('en-GB')}</td>
                    <td>{getAge(c.dob)}</td>
                    <td style={{ color: c.medical.barToFlying ? '#cf142b' : '#15803d', fontWeight:600 }}>{c.medical.barToFlying ? 'Bar to flying' : 'Clear'}</td>
                    <td>{c.quals.aef}</td>
                    <td>{c.quals.gliding}</td>
                    <td style={{ fontWeight:700, color: canFly(c) ? '#15803d' : '#cf142b' }}>{canFly(c) ? 'YES' : 'NO'}</td>
                    <td>{canFly(c) && <button className="btn-primary btn-sm" onClick={() => setShowD5Modal(c)}>D5</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report: Classification */}
        {reportType === 'classification' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:16, fontWeight:700, color:'#0d1f44' }}>Classification Report — {SQUADRON.name}</div>
              <button className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => fireToast('Classification report exported')}><Download size={14} />Export</button>
            </div>
            <table className="report-table">
              <thead><tr>
                <th>Name</th><th>Rank</th><th>Classification</th><th>Service</th><th>Next Class</th><th>Status</th>
              </tr></thead>
              <tbody>
                {classReport.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight:500 }}>{c.firstName} {c.lastName}</td>
                    <td><RankChip rank={c.rank} /></td>
                    <td><ClassBadge cls={c.classification} /></td>
                    <td>{getMonths(c.joinDate)}mo</td>
                    <td style={{ fontSize:12, color:'#64748b' }}>{c.elig.nextLabel || '—'}</td>
                    <td>
                      {c.elig.eligible && !promotionApproved[c.id]
                        ? <span style={{ fontWeight:600, color:'#a16207' }}>↑ Ready</span>
                        : promotionApproved[c.id]
                        ? <span style={{ color:'#15803d', fontWeight:600 }}>✓ Promoted</span>
                        : c.elig.blockers.length > 0
                        ? <span style={{ fontSize:11, color:'#64748b' }}>{c.elig.blockers[0]}</span>
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report: Staff DBS/CTC */}
        {reportType === 'dbs' && (
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0d1f44', marginBottom:14 }}>Staff DBS / CTC Status</div>
            <table className="report-table">
              <thead><tr>
                <th>Name</th><th>Rank</th><th>Role</th><th>DBS Expires</th><th>DBS Status</th><th>CTC Expires</th><th>Qualifications</th>
              </tr></thead>
              <tbody>
                {staff.map(s => {
                  const dbsDate = new Date(s.dbs);
                  const ctcDate = new Date(s.ctc);
                  const dbsDays = Math.ceil((dbsDate - today) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight:500 }}>{s.firstName} {s.lastName}</td>
                      <td>{s.rank}</td>
                      <td style={{ fontSize:12, color:'#64748b' }}>{s.role}</td>
                      <td style={{ fontFamily:'monospace', fontSize:12 }}>{dbsDate.toLocaleDateString('en-GB')}</td>
                      <td style={{ fontWeight:600, color: dbsDays < 30 ? '#cf142b' : dbsDays < 90 ? '#a16207' : '#15803d' }}>
                        {dbsDays < 30 ? '⚠ URGENT' : dbsDays < 90 ? '⚠ Expiring' : '✓ Valid'} ({dbsDays}d)
                      </td>
                      <td style={{ fontFamily:'monospace', fontSize:12 }}>{ctcDate.toLocaleDateString('en-GB')}</td>
                      <td style={{ fontSize:12, color:'#64748b' }}>{s.quals.join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ── EVENTS ─────────────────────────────────────────────────
  const EventsScreen = () => (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div className="section-head">Events & H&S</div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0d1f44', margin:0 }}>Upcoming Activities</h2>
        </div>
        <button className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6 }}
          onClick={() => fireToast('New event — forms will auto-populate once cadets are added')}>
          <Plus size={14} />New Event
        </button>
      </div>

      {upcomingEvents.map(ev => {
        const attending = activeCadets.filter(c => ev.eligible(c));
        const needMedical = attending.filter(c => needsTG23(c));
        const isExpanded = expandedEvent === ev.id;

        const sentCount   = attending.filter(c => getFormStatus(ev.id, c.id) === 'sent').length;
        const signedCount = attending.filter(c => getFormStatus(ev.id, c.id) === 'signed').length;
        const unsentCount = attending.filter(c => getFormStatus(ev.id, c.id) === 'unsent').length;

        return (
          <div key={ev.id} className="event-card" style={{ marginBottom:12 }}>
            {/* Event header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                  <div className={`event-card status-dot ${ev.status}`} />
                  <span style={{ fontSize:16, fontWeight:700, color:'#0d1f44' }}>{ev.name}</span>
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:6, background:'#f1f5f9', color:'#64748b' }}>{ev.type}</span>
                  {ev.hsForm === 'TG21' && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:6, background:'#dbeafe', color:'#1d4ed8', fontWeight:600 }}>TG21</span>}
                  {ev.hsForm === 'D5'   && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:6, background:'#f3e8ff', color:'#7c3aed', fontWeight:600 }}>D5</span>}
                </div>
                <div style={{ fontSize:12, color:'#64748b' }}>
                  {new Date(ev.date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · Lead: {ev.leadStaff} · {attending.length} eligible
                  {needMedical.length > 0 && <span style={{ color:'#a16207', fontWeight:600 }}> · {needMedical.length} need TG23</span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:20,
                  background: ev.status==='approved' ? '#dcfce7' : ev.status==='pending' ? '#fef9c3' : '#f1f5f9',
                  color:      ev.status==='approved' ? '#15803d'  : ev.status==='pending' ? '#a16207'  : '#64748b' }}>
                  {ev.status.charAt(0).toUpperCase()+ev.status.slice(1)}
                </span>
              </div>
            </div>

            {/* H&S checklist strip */}
            <div style={{ display:'flex', gap:20, fontSize:12, padding:'10px 12px', background:'#f8fafc', borderRadius:8, marginBottom:10, flexWrap:'wrap' }}>
              {[
                { label:'Risk Assessment', done: ev.status !== 'draft' },
                { label:'OC Sign-off',     done: ev.status === 'approved' },
                { label:'Travel Decl.',    done: ev.status === 'approved' },
                { label:`${ev.hsForm} filed`, done: ev.status === 'approved' },
              ].map(({ label, done }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color: done ? '#15803d' : '#94a3b8', fontWeight:700 }}>{done ? '✓' : '○'}</span>
                  <span style={{ color: done ? '#374151' : '#94a3b8' }}>{label}</span>
                </div>
              ))}
              <button className="btn-ghost" style={{ marginLeft:'auto', fontSize:11, padding:'4px 10px' }}
                onClick={() => fireToast(`${ev.hsForm} generated for ${ev.name}`)}>
                Generate {ev.hsForm}
              </button>
            </div>

            {/* Form dispatch summary + expand toggle */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background: signedCount === attending.length && attending.length > 0 ? '#f0fdf4' : '#fffbeb', borderRadius:8, border:`1px solid ${signedCount === attending.length && attending.length > 0 ? '#bbf7d0' : '#fde68a'}` }}>
              <div style={{ display:'flex', gap:16, fontSize:12 }}>
                <span style={{ color:'#64748b' }}>Parent e-signatures:</span>
                <span style={{ fontWeight:700, color:'#15803d' }}>✓ {signedCount} signed</span>
                {sentCount > 0   && <span style={{ fontWeight:600, color:'#a16207' }}>⏳ {sentCount} awaiting</span>}
                {unsentCount > 0 && <span style={{ fontWeight:600, color:'#94a3b8' }}>○ {unsentCount} not sent</span>}
                {needMedical.length > 0 && <span style={{ fontWeight:600, color:'#a16207' }}>⚕ {needMedical.length} TG23 required</span>}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {unsentCount > 0 && (
                  <button className="btn-primary btn-sm"
                    onClick={() => sendAll(ev.id, attending.map(c => c.id))}>
                    Send all forms
                  </button>
                )}
                <button className="btn-ghost btn-sm"
                  style={{ display:'flex', alignItems:'center', gap:4 }}
                  onClick={() => setExpandedEvent(isExpanded ? null : ev.id)}>
                  {isExpanded ? 'Hide' : 'Manage'} <ChevronDown size={12} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
                </button>
              </div>
            </div>

            {/* Expanded: per-cadet form dispatch */}
            {isExpanded && (
              <div style={{ marginTop:10, border:'1px solid #e2e8f0', borderRadius:10, overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 130px 120px 80px', padding:'8px 14px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  <span>Cadet</span><span>Parent email</span><span>Forms required</span><span>Signature status</span><span>Action</span>
                </div>
                {attending.map(c => {
                  const status = getFormStatus(ev.id, c.id);
                  const forms = formsForCadet(c, ev.hsForm);
                  return (
                    <div key={c.id} style={{ display:'grid', gridTemplateColumns:'1fr 180px 130px 120px 80px', padding:'10px 14px', borderBottom:'1px solid #f1f5f9', fontSize:13, alignItems:'center', background: needsTG23(c) ? '#fffbf0' : 'white' }}>
                      <div>
                        <div style={{ fontWeight:600, color:'#0d1f44' }}>{c.firstName} {c.lastName}</div>
                        <div style={{ fontSize:11, color:'#94a3b8' }}>{c.rank}</div>
                      </div>
                      <div style={{ fontSize:12, color:'#475569', wordBreak:'break-all' }}>{c.nextOfKin.email}</div>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {forms.map(f => (
                          <span key={f} style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4,
                            background: f==='TG21' ? '#dbeafe' : f==='TG23' ? '#fef3c7' : f==='D5' ? '#f3e8ff' : '#f1f5f9',
                            color:      f==='TG21' ? '#1d4ed8' : f==='TG23' ? '#92400e' : f==='D5' ? '#7c3aed' : '#475569' }}>
                            {f}
                          </span>
                        ))}
                        {needsTG23(c) && (
                          <span style={{ fontSize:10, color:'#a16207' }} title={c.medical.conditions}>⚕</span>
                        )}
                      </div>
                      <div>
                        {status === 'signed' && (
                          <span style={{ fontSize:12, fontWeight:700, color:'#15803d', display:'flex', alignItems:'center', gap:4 }}>
                            <CircleCheck size={14} />Signed
                          </span>
                        )}
                        {status === 'sent' && (
                          <span style={{ fontSize:12, fontWeight:600, color:'#a16207', display:'flex', alignItems:'center', gap:4 }}>
                            <Clock size={14} />Awaiting
                          </span>
                        )}
                        {status === 'unsent' && (
                          <span style={{ fontSize:12, color:'#94a3b8' }}>Not sent</span>
                        )}
                      </div>
                      <div style={{ display:'flex', gap:4 }}>
                        {status === 'unsent' && (
                          <button className="btn-primary btn-sm" style={{ fontSize:11 }}
                            onClick={() => { setOneFormStatus(ev.id, c.id, 'sent'); fireToast(`Form sent to ${c.nextOfKin.name} (${c.nextOfKin.email})`); }}>
                            Send
                          </button>
                        )}
                        {status === 'sent' && (
                          <>
                            <button className="btn-ghost btn-sm" style={{ fontSize:11 }}
                              onClick={() => { setOneFormStatus(ev.id, c.id, 'sent'); fireToast(`Resent to ${c.nextOfKin.email}`); }}>
                              Resend
                            </button>
                            <button className="btn-ghost btn-sm" style={{ fontSize:11, color:'#15803d' }}
                              onClick={() => { setOneFormStatus(ev.id, c.id, 'signed'); fireToast(`Marked as signed — ${c.firstName} ${c.lastName}`); }}>
                              ✓ Mark signed
                            </button>
                          </>
                        )}
                        {status === 'signed' && (
                          <button className="btn-ghost btn-sm" style={{ fontSize:11 }}
                            onClick={() => fireToast(`Viewing signed form for ${c.firstName} ${c.lastName}`)}>
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* TG23 medical summary for staff briefing */}
                {needMedical.length > 0 && (
                  <div style={{ padding:'12px 14px', background:'#fffbeb', borderTop:'2px solid #fde68a' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#92400e', marginBottom:8 }}>⚕ TG23 — Medical conditions declared for this activity</div>
                    {needMedical.map(c => (
                      <div key={c.id} style={{ fontSize:12, color:'#78350f', marginBottom:6, display:'flex', gap:8 }}>
                        <span style={{ fontWeight:600, whiteSpace:'nowrap' }}>{c.firstName} {c.lastName}:</span>
                        <span>{c.medical.conditions}</span>
                      </div>
                    ))}
                    <div style={{ fontSize:11, color:'#a16207', marginTop:8 }}>TG23 forms for these cadets have been sent to parents for signature. Print and carry on the activity.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // ── D5 MODAL ───────────────────────────────────────────────
  const D5Modal = () => {
    if (!showD5Modal) return null;
    const c = showD5Modal;
    return (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ background:'white', borderRadius:16, padding:32, width:560, maxHeight:'90vh', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'#0d1f44' }}>Form D5 — Air Experience Flying</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Pre-populated from cadet record</div>
            </div>
            <button onClick={() => setShowD5Modal(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer' }}><X size={16} /></button>
          </div>

          {[
            { label:'Surname',         value: c.lastName },
            { label:'First Name',      value: c.firstName },
            { label:'Date of Birth',   value: new Date(c.dob).toLocaleDateString('en-GB') },
            { label:'Age',             value: `${getAge(c.dob)} years` },
            { label:'Service Number',  value: c.serviceNo },
            { label:'Squadron',        value: SQUADRON.name },
            { label:'Rank',            value: c.rank },
            { label:'Classification',  value: CLASS_META[c.classification].label },
            { label:'School',          value: c.school },
            { label:'Medical Declaration', value: c.medical.barToFlying ? 'BAR TO FLYING — do not authorise' : 'No known bar to flying ✓' },
            { label:'Previous AEF Sorties', value: `${c.quals.aef} sorties` },
            { label:'Previous Gliding',     value: `${c.quals.gliding} sorties` },
            { label:'Next of Kin',     value: `${c.nextOfKin.name} (${c.nextOfKin.rel}) — ${c.nextOfKin.phone}` },
            { label:'OIC Signature',   value: `${SQUADRON.oic} — 1701 (Johnstone) Squadron` },
            { label:'Date',            value: new Date().toLocaleDateString('en-GB') },
          ].map(({ label, value }) => (
            <div key={label} style={{ display:'flex', gap:16, padding:'8px 0', borderBottom:'1px solid #f1f5f9', fontSize:13 }}>
              <div style={{ width:180, flexShrink:0, color:'#64748b', fontWeight:500 }}>{label}</div>
              <div style={{ fontWeight:500, color: label==='Medical Declaration' && c.medical.barToFlying ? '#cf142b' : '#0d1f44' }}>{value}</div>
            </div>
          ))}

          <div style={{ marginTop:20, display:'flex', gap:10 }}>
            <button className="btn-primary" onClick={() => { fireToast(`D5 generated for ${c.firstName} ${c.lastName}`); setShowD5Modal(null); }}>
              Confirm & Download D5
            </button>
            <button className="btn-ghost" onClick={() => setShowD5Modal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // === MAIN RENDER ===
  const NAV = [
    { id:'dashboard',  label:'Dashboard',    icon: LayoutDashboard },
    { id:'cadets',     label:'Cadets',       icon: Users, badge: promotionReady.length },
    { id:'eligibility',label:'Eligibility',  icon: Target },
    { id:'attendance', label:'Attendance',   icon: Calendar },
    { id:'events',     label:'Events / H&S', icon: Flag,  badge: upcomingEvents.filter(e => e.status === 'pending').length },
    { id:'reports',    label:'Reports',      icon: FileText },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Geist', system-ui, sans-serif", fontSize:14, color:'#1a1f2e' }}>
      <style>{css}</style>

      {/* Sidebar */}
      <div className="sidebar-nav" style={{ display:'flex', flexDirection:'column' }}>
        {/* Logo */}
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#cf142b', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', border:'2px solid white' }} />
            </div>
            <div>
              <div style={{ color:'white', fontWeight:700, fontSize:13, lineHeight:1.2 }}>RAF Air Cadets</div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:10, marginTop:1 }}>Squadron Manager</div>
            </div>
          </div>
        </div>

        {/* Squadron info */}
        <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:8 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)', lineHeight:1.3 }}>{SQUADRON.name}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{SQUADRON.sector}</div>
        </div>

        {/* Nav items */}
        {NAV.map(n => {
          const I = n.icon;
          return (
            <div key={n.id} className={`sidebar-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <I size={16} />
              <span style={{ flex:1 }}>{n.label}</span>
              {n.badge > 0 && (
                <span style={{ background:'#cf142b', color:'white', borderRadius:10, padding:'1px 7px', fontSize:10, fontWeight:700 }}>{n.badge}</span>
              )}
            </div>
          );
        })}

        {/* Bottom */}
        <div style={{ marginTop:'auto', padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{SQUADRON.oic}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:1 }}>Logged in as OIC</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflow:'auto', background:'#f0f4f8' }}>
        {/* Top bar */}
        <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'12px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:20 }}>
          <div style={{ fontSize:13, color:'#64748b' }}>
            <span style={{ fontWeight:600, color:'#0d1f44' }}>{NAV.find(n => n.id === tab)?.label}</span>
            {' '}&mdash; {SQUADRON.name}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#16a34a', display:'inline-block' }} />
              Prototype · No live data
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding:'28px 32px', maxWidth:1200 }}>
          {tab === 'dashboard'   && <DashboardScreen />}
          {tab === 'cadets'      && <CadetsScreen />}
          {tab === 'eligibility' && <EligibilityScreen />}
          {tab === 'attendance'  && <AttendanceScreen />}
          {tab === 'events'      && <EventsScreen />}
          {tab === 'reports'     && <ReportsScreen />}
        </div>
      </div>

      {/* Overlays */}
      {selectedCadet && <CadetDrawer />}
      {showD5Modal   && <D5Modal />}

      {/* Toast */}
      {toast && (
        <div className="toast-bar">
          <CircleCheck size={16} color="#4ade80" />
          {toast}
        </div>
      )}
    </div>
  );
}
