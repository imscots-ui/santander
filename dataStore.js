/**
 * OFFICIAL-SENSITIVE — PERSONAL DATA (DPA 2018 / UK GDPR)
 * 1701 (Johnstone) Squadron — Canonical Data Store
 *
 * Data access tiers — enforce at call-site:
 *   getCadetView(id)      own data only; medical detail stripped to boolean flags
 *   getCadetRoster()      name + rank only; safe for demo switcher / lists
 *   getSquadronData()     full PII incl. NOK and medical — squadron staff only
 *   getWingAggregates()   computed aggregate stats; NO individual identifiers
 *
 * Cross-app bridge:
 *   getFormStatus()       read shared form-signature state from localStorage
 *   updateFormStatus()    write and broadcast to all open tabs
 *   subscribeFormUpdates  listen for updates (returns unsubscribe fn)
 */

const LS_KEY = 'rafac_1701_formStatus';

// ── Squadron metadata ──────────────────────────────────────────────────────────
export const SQUADRON = {
  number: 1701,
  name: '1701 (Johnstone) Squadron',
  region: 'Scotland & N Ireland Wing',
  sector: 'West Scotland Sector',
  oic: 'FS Kenneth Macfarlane',
  email: 'training.1701@rafac.mod.gov.uk',
};

// ── Reference date (prototype is frozen at this date) ─────────────────────────
export const TODAY = new Date('2026-05-18');

// ── Shared helpers ─────────────────────────────────────────────────────────────
export const getAge = (dob) => {
  const d = new Date(dob);
  let age = TODAY.getFullYear() - d.getFullYear();
  if (
    TODAY.getMonth() - d.getMonth() < 0 ||
    (TODAY.getMonth() === d.getMonth() && TODAY.getDate() < d.getDate())
  ) age--;
  return age;
};

export const getMonths = (joinDate) =>
  Math.floor((TODAY - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 30.44));

export const canShoot  = (c) => c.quals.whtL98 && c.quals.wht22 && getAge(c.dob) >= 13;
export const canFly    = (c) => getAge(c.dob) >= 13 && !c.medical.barToFlying;
export const needsTG23 = (c) => !!c.medical.conditions;
export const formsForCadet = (c, hsForm) => needsTG23(c) ? [hsForm, 'TG23'] : [hsForm];

// ── Staff ─────────────────────────────────────────────────────────────────────
export const STAFF = [
  { id:'s1', firstName:'Kenneth',       lastName:'Macfarlane', rank:'FS',      role:'OIC / Adult IC',         dbs:'2027-03-14', ctc:'2028-01-10', quals:['AVIP','AT Bronze','Shooting Range Conducting Officer'] },
  { id:'s2', firstName:'Caroline-Anne', lastName:'Pryde',      rank:'Flt Lt',  role:'Training Officer',        dbs:'2026-09-22', ctc:'2027-06-04', quals:['AVIP','D1 Driving'] },
  { id:'s3', firstName:'Matthew',       lastName:'Hooks',      rank:'Plt Off', role:'Administration Officer',  dbs:'2027-11-30', ctc:'2028-03-18', quals:['AVIP'] },
  { id:'s4', firstName:'Ann',           lastName:'Sweeney',    rank:'CI',      role:'Civilian Instructor',     dbs:'2026-07-05', ctc:'2027-01-22', quals:['AVIP','First Aid Instructor'] },
  { id:'s5', firstName:'Izzy',          lastName:'Young',      rank:'Plt Off', role:'Cdt Liaison Officer',     dbs:'2027-02-19', ctc:'2028-09-11', quals:['AVIP','DofE Supervisor'] },
];

// ── Cadets (full data — squadron-tier and above only) ─────────────────────────
// medical.conditions: null = none; string = condition text (TG23 required when non-null)
export const CADETS = [
  { id:'c01', serviceNo:'SNI-2022-0741', firstName:'Ryan',    lastName:'Donnelly',   gender:'M',
    dob:'2008-11-05', joinDate:'2022-11-09', rank:'FS',   classification:'SC',
    school:'Paisley Grammar', attendance:{ parades:58, present:52 },
    quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
            dofeBronze:true, dofeSilver:true, dofeGold:false, btecL2:true, btecL3:false, aef:3, gliding:4 },
    medical:{
      barToFlying:false, conditions:'Asthma (controlled)',
      medications:[{ name:'Salbutamol (Ventolin — blue reliever)', dosage:'2 puffs as required', storage:'Carried by cadet at all times in trouser pocket' }],
      normalImpact:'No impact on normal daily activities.',
      strenuousImpact:'May require reliever inhaler before or after sustained exercise. If symptoms persist, should rest immediately.',
      professionalAdvice:'GP confirmed suitability for all cadet activities. Reliever must be available at all times.',
      managementNotes:'Ryan carries his reliever at all times. Adult IC briefed. If using inhaler more than twice in one session, halt activity and contact parent.',
    },
    nextOfKin:{ name:'Patricia Donnelly', phone:'07700 900781', email:'p.donnelly@gmail.com', rel:'Mother' },
    status:'active', notes:'Ready for MAC assessment — needs DofE Silver verified on SMS.' },

  { id:'c02', serviceNo:'SNI-2022-0809', firstName:'Niamh',   lastName:'Gallagher',  gender:'F',
    dob:'2007-04-18', joinDate:'2022-09-14', rank:'WO',   classification:'MAC',
    school:"St. Aidan's High", attendance:{ parades:61, present:57 },
    quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
            dofeBronze:true, dofeSilver:true, dofeGold:true, btecL2:true, btecL3:true, aef:5, gliding:6 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Sean Gallagher', phone:'07700 900302', email:'sean.gallagher77@outlook.com', rel:'Father' },
    status:'active', notes:'Cadet Warrant Officer. Applying for RAFAC scholarship.' },

  { id:'c03', serviceNo:'SNI-2023-1021', firstName:'Jamie',   lastName:'McAllister', gender:'M',
    dob:'2009-03-14', joinDate:'2023-09-06', rank:'Sgt',  classification:'LC',
    school:'Johnstone High', attendance:{ parades:42, present:38 },
    quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
            dofeBronze:true, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:2, gliding:1 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Anne McAllister', phone:'07700 900123', email:'anne.mcallister@btinternet.com', rel:'Mother' },
    status:'active', notes:'Both WHTs complete. 24-month mark hit — SC eligible if DofE Bronze confirmed.' },

  { id:'c04', serviceNo:'SNI-2023-1044', firstName:'Erin',    lastName:'Stewart',    gender:'F',
    dob:'2009-07-29', joinDate:'2023-09-06', rank:'Sgt',  classification:'SC',
    school:'Johnstone High', attendance:{ parades:41, present:39 },
    quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:true,
            dofeBronze:true, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:2, gliding:2 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Moira Stewart', phone:'07700 900544', email:'moira.stewart@sky.com', rel:'Mother' },
    status:'active', notes:'' },

  { id:'c05', serviceNo:'SNI-2023-1102', firstName:'Kyle',    lastName:'Anderson',   gender:'M',
    dob:'2009-01-11', joinDate:'2023-11-15', rank:'Sgt',  classification:'LC',
    school:'Paisley Grammar', attendance:{ parades:38, present:31 },
    quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
    medical:{
      barToFlying:false, conditions:'Severe nut allergy (anaphylaxis risk)',
      medications:[{ name:'Adrenaline auto-injector (EpiPen 300mcg)', dosage:'One dose IM if anaphylaxis suspected — call 999 immediately', storage:'EpiPen 1: carried by Kyle at all times. EpiPen 2: held by Adult IC.' }],
      normalImpact:'No impact provided no exposure to nuts or nut products.',
      strenuousImpact:'No impact from exercise. Risk is allergen exposure only — not exertion.',
      professionalAdvice:'Allergy consultant: avoid all nut products, carry EpiPen at all times, administer immediately if anaphylaxis suspected and call 999.',
      managementNotes:'All staff briefed before every activity. No nut products permitted on any activity. Two EpiPens always present. 999 called immediately if EpiPen used.',
    },
    nextOfKin:{ name:'George Anderson', phone:'07700 900677', email:'george.anderson@gmail.com', rel:'Father' },
    status:'active', notes:'Has L98 WHT only — NOT eligible to shoot until .22 WHT complete.' },

  { id:'c06', serviceNo:'SNI-2024-1201', firstName:'Caitlin', lastName:'Fraser',     gender:'F',
    dob:'2010-07-22', joinDate:'2024-01-17', rank:'Cpl',  classification:'FC',
    school:"St. Aidan's High", attendance:{ parades:32, present:30 },
    quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'David Fraser', phone:'07700 900456', email:'d.fraser1972@hotmail.co.uk', rel:'Father' },
    status:'active', notes:'L98 WHT complete, .22 WHT pending — cannot go on range yet.' },

  { id:'c07', serviceNo:'SNI-2024-1224', firstName:'Isla',    lastName:'Mackenzie',  gender:'F',
    dob:'2010-02-03', joinDate:'2024-01-17', rank:'Cpl',  classification:'LC',
    school:'Johnstone High', attendance:{ parades:31, present:29 },
    quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:1 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Fiona Mackenzie', phone:'07700 900311', email:'fiona.mackenzie@gmail.com', rel:'Mother' },
    status:'active', notes:'' },

  { id:'c08', serviceNo:'SNI-2024-1251', firstName:'Sophie',  lastName:'Burns',      gender:'F',
    dob:'2011-05-17', joinDate:'2024-03-06', rank:'Cpl',  classification:'FC',
    school:'Linwood Academy', attendance:{ parades:28, present:26 },
    quals:{ whtL98:false, wht22:false, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{
      barToFlying:false, conditions:'Mild asthma (reliever only)',
      medications:[{ name:'Salbutamol inhaler (blue reliever)', dosage:'1–2 puffs as required, before sustained exercise', storage:'Carried by Sophie at all times in kit bag' }],
      normalImpact:'No impact on normal daily activities. Asthma is well controlled.',
      strenuousImpact:'May need reliever inhaler before or after sustained exercise. No other restriction.',
      professionalAdvice:'GP has confirmed suitability for all cadet activities. Reliever must be available at all times.',
      managementNotes:'Sophie carries her inhaler at all times. Adult IC to be briefed. If used more than twice in one session, halt activity and contact parent.',
    },
    nextOfKin:{ name:'Carol Burns', phone:'07700 900892', email:'carol.burns@sky.com', rel:'Mother' },
    status:'active', notes:'Neither WHT done — priority for next range day.' },

  { id:'c09', serviceNo:'SNI-2024-1289', firstName:'Ross',    lastName:'Thomson',    gender:'M',
    dob:'2010-09-30', joinDate:'2024-03-06', rank:'Cpl',  classification:'FC',
    school:'Johnstone High', attendance:{ parades:27, present:22 },
    quals:{ whtL98:true, wht22:true, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:1, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Jim Thomson', phone:'07700 900113', email:'jimthomson@btinternet.com', rel:'Father' },
    status:'active', notes:'Both WHTs complete — eligible to shoot.' },

  { id:'c10', serviceNo:'SNI-2024-1310', firstName:'Callum',  lastName:'Robertson',  gender:'M',
    dob:'2011-12-08', joinDate:'2024-04-10', rank:'LCdt', classification:'FC',
    school:'Paisley Grammar', attendance:{ parades:24, present:21 },
    quals:{ whtL98:false, wht22:false, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Susan Robertson', phone:'07700 900441', email:'srobertson@gmail.com', rel:'Mother' },
    status:'active', notes:'' },

  { id:'c11', serviceNo:'SNI-2024-1341', firstName:'Declan',  lastName:"O'Brien",    gender:'M',
    dob:'2011-03-25', joinDate:'2024-04-10', rank:'LCdt', classification:'FC',
    school:"St. Aidan's High", attendance:{ parades:23, present:18 },
    quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:"Patrick O'Brien", phone:'07700 900552', email:'pobrien_jnst@outlook.com', rel:'Father' },
    status:'active', notes:'Attendance concern — below 80% threshold.' },

  { id:'c12', serviceNo:'SNI-2024-1377', firstName:'Megan',   lastName:'Hamilton',   gender:'F',
    dob:'2010-06-14', joinDate:'2024-06-05', rank:'LCdt', classification:'FC',
    school:'Linwood Academy', attendance:{ parades:20, present:19 },
    quals:{ whtL98:true, wht22:false, firstAid:true, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Helen Hamilton', phone:'07700 900663', email:'helen.hamilton@gmail.com', rel:'Mother' },
    status:'active', notes:'L98 done, .22 WHT still outstanding.' },

  { id:'c13', serviceNo:'SNI-2025-1421', firstName:'Amy',     lastName:'Sinclair',   gender:'F',
    dob:'2012-08-19', joinDate:'2025-01-22', rank:'LCdt', classification:'none',
    school:'Johnstone High', attendance:{ parades:16, present:15 },
    quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Karen Sinclair', phone:'07700 900774', email:'karensinclair@hotmail.com', rel:'Mother' },
    status:'active', notes:'Approaching 6-month mark — First Class eligible in Jul 2025.' },

  { id:'c14', serviceNo:'SNI-2025-1455', firstName:'Liam',    lastName:'Campbell',   gender:'M',
    dob:'2012-04-07', joinDate:'2025-03-05', rank:'Cdt',  classification:'none',
    school:'Linwood Academy', attendance:{ parades:10, present:9 },
    quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Ian Campbell', phone:'07700 900885', email:'ian.campbell@sky.com', rel:'Father' },
    status:'active', notes:'' },

  { id:'c15', serviceNo:'SNI-2025-1489', firstName:'Connor',  lastName:'MacLeod',    gender:'M',
    dob:'2012-11-23', joinDate:'2025-03-05', rank:'Cdt',  classification:'none',
    school:'Johnstone High', attendance:{ parades:10, present:10 },
    quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Claire MacLeod', phone:'07700 900996', email:'cmacleod1974@gmail.com', rel:'Mother' },
    status:'active', notes:'100% attendance — model new recruit.' },

  { id:'c16', serviceNo:'SNI-2026-1511', firstName:'Zara',    lastName:'Ahmed',      gender:'F',
    dob:'2012-09-02', joinDate:'2026-02-04', rank:'Cdt',  classification:'none',
    school:'Paisley Grammar', attendance:{ parades:6, present:5 },
    quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Fatima Ahmed', phone:'07700 901007', email:'fatima.ahmed@gmail.com', rel:'Mother' },
    status:'active', notes:'New recruit Feb 2026.' },

  { id:'c17', serviceNo:'SNI-2026-1532', firstName:'Ethan',   lastName:'Murray',     gender:'M',
    dob:'2013-08-15', joinDate:'2026-01-15', rank:'Cdt',  classification:'none',
    school:'Johnstone High', attendance:{ parades:8, present:8 },
    quals:{ whtL98:false, wht22:false, firstAid:false, youthFirstAid:false,
            dofeBronze:false, dofeSilver:false, dofeGold:false, btecL2:false, btecL3:false, aef:0, gliding:0 },
    medical:{ barToFlying:false, conditions:null, medications:[], normalImpact:'', strenuousImpact:'', professionalAdvice:'', managementNotes:'' },
    nextOfKin:{ name:'Sharon Murray', phone:'07700 901118', email:'sharon.murray@gmail.com', rel:'Mother' },
    status:'active', notes:'Joined at age 12 — youngest on strength. 100% attendance.' },
];

// ── Events ─────────────────────────────────────────────────────────────────────
export const EVENTS = [
  { id:'e1', name:'Shooting — L98 LFMT 6',   date:'2026-05-16', type:'Shooting',    eligible:(c) => canShoot(c),                 hsForm:'TG21', leadStaff:'FS Macfarlane', status:'approved' },
  { id:'e2', name:'Sector 4 AFA Course',      date:'2026-05-23', type:'First Aid',   eligible:(c) => getAge(c.dob) >= 14,         hsForm:'RA',   leadStaff:'CI Sweeney',     status:'pending'  },
  { id:'e3', name:'Bronze Wings Synthetic',   date:'2026-05-23', type:'Flying',      eligible:(c) => canFly(c),                   hsForm:'D5',   leadStaff:'Flt Lt Pryde',   status:'pending'  },
  { id:'e4', name:'WSW Road Marching',        date:'2026-05-30', type:'Sport',       eligible:(c) => getAge(c.dob) >= 13,         hsForm:'RA',   leadStaff:'Plt Off Hooks',  status:'draft'    },
  { id:'e5', name:'North Region Music Camp',  date:'2026-05-22', type:'Music',       eligible:(c) => c.status === 'active',       hsForm:'RA',   leadStaff:'CI Sweeney',     status:'approved' },
  { id:'e6', name:'Cyber Gold QCCD/013',      date:'2026-05-22', type:'Radio/Cyber', eligible:(c) => c.classification !== 'none', hsForm:'RA',   leadStaff:'Plt Off Young',  status:'approved' },
];

// ── localStorage bridge ────────────────────────────────────────────────────────
// Shared between SquadronApp, CadetApp, WingApp, and cadet-portal.html.
// Shape: { [eventId]: { [cadetId]: 'unsent' | 'sent' | 'signed' } }

export const getFormStatus = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
};

export const updateFormStatus = (eventId, cadetId, status) => {
  const current = getFormStatus();
  if (!current[eventId]) current[eventId] = {};
  current[eventId][cadetId] = status;
  localStorage.setItem(LS_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('rafac-form-update', { detail: { eventId, cadetId, status } }));
};

// Returns a cleanup function — call it in useEffect's return
export const subscribeFormUpdates = (callback) => {
  const handler = (e) => callback(e.detail);
  window.addEventListener('rafac-form-update', handler);
  return () => window.removeEventListener('rafac-form-update', handler);
};

// ── GDPR-tiered accessors ──────────────────────────────────────────────────────

// Squadron-tier: full personal data
export const getSquadronData = () => CADETS;

// Cadet-tier: own record, medical detail reduced to boolean flags
export const getCadetView = (cadetId) => {
  const c = CADETS.find(c => c.id === cadetId);
  if (!c) return null;
  return {
    id:             c.id,
    serviceNo:      c.serviceNo,
    firstName:      c.firstName,
    lastName:       c.lastName,
    gender:         c.gender,
    dob:            c.dob,
    joinDate:       c.joinDate,
    rank:           c.rank,
    classification: c.classification,
    school:         c.school,
    attendance:     c.attendance,
    quals:          c.quals,
    medical: {
      barToFlying:       c.medical.barToFlying,
      hasCondition:      !!c.medical.conditions,
      conditionSummary:  c.medical.conditions || null,
      hasMedications:    (c.medical.medications || []).length > 0,
    },
    nextOfKin: c.nextOfKin,  // cadet can see their own emergency contact
    status:    c.status,
    notes:     c.notes,
  };
};

// Demo-switcher safe: name + rank only, no PII
export const getCadetRoster = () =>
  CADETS.filter(c => c.status === 'active').map(c => ({
    id: c.id, firstName: c.firstName, lastName: c.lastName,
    rank: c.rank, classification: c.classification,
  }));

// Wing-tier: computed aggregates, NO individual identifiers
export const getWingAggregates = () => {
  const active = CADETS.filter(c => c.status === 'active');
  const attPcts = active.map(c =>
    c.attendance.parades > 0
      ? Math.round((c.attendance.present / c.attendance.parades) * 100)
      : 0
  );
  const avgAttendance = Math.round(attPcts.reduce((s, v) => s + v, 0) / attPcts.length);

  const fs = getFormStatus();
  const allStatuses = Object.values(fs).flatMap(ev => Object.values(ev));
  const signedCount = allStatuses.filter(s => s === 'signed').length;
  const sentCount   = allStatuses.filter(s => s === 'sent').length;
  const hsCompliance = allStatuses.length > 0
    ? Math.round((signedCount / allStatuses.length) * 100)
    : 100;

  const dbsAlerts = STAFF.filter(s => {
    const days = Math.ceil((new Date(s.dbs) - TODAY) / (1000 * 60 * 60 * 24));
    return days < 90;
  }).length;

  return {
    strength:             active.length,
    shootingEligible:     active.filter(canShoot).length,
    flyingEligible:       active.filter(canFly).length,
    withMedicalNote:      active.filter(c => !!c.medical.conditions).length,
    belowAttThreshold:    active.filter(c => attPcts[active.indexOf(c)] < 80).length,
    avgAttendance,
    hsCompliance,
    formsTotal:           allStatuses.length,
    formsSigned:          signedCount,
    formsSent:            sentCount,
    formsOutstanding:     allStatuses.filter(s => s !== 'signed').length,
    pendingApprovals:     EVENTS.filter(e => e.status === 'pending').length,
    staffDbsExpiringSoon: dbsAlerts,
  };
};
