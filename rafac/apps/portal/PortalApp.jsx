import { useState, useEffect } from 'react';
import { submitForm, getFormDetail1, DETAIL_KEY } from '../../data/sync.js';

const navy = '#003087', red = '#C8102E', gold = '#C8A032', green = '#1B6B3A';

const CADET  = { name:'Sarah Mitchell', svc:'2408773', rank:'Cadet Corporal', id:'c01', sqn:'1701 (Johnstone)' };
const PARENT = { name:'Mrs K. Mitchell', rel:'Mother' };

const PENDING_FORMS = [
  {
    eventId: 'e1',
    event: 'Summer Camp 2026',
    date: '19–26 Jul 2026',
    location: 'RAF Woodvale',
    deadline: '5 Jul 2026',
    forms: ['tg21','tg23'],
  },
  {
    eventId: 'e6',
    event: 'Gliding Scholarship',
    date: '3–7 Aug 2026',
    location: 'Dalton Airfield',
    deadline: '20 Jul 2026',
    forms: ['tg21','tg23','flying'],
  },
];

const FORM_META = {
  tg21:   { label:'TG21 Activity Consent',      icon:'📋', color:'#003087', steps:3 },
  tg23:   { label:'TG23 Health Declaration',    icon:'🏥', color:'#1B6B3A', steps:3 },
  flying: { label:'Flying Medical Declaration', icon:'✈️', color:'#8B1A1A', steps:3 },
};

function StepBar({ total, current }) {
  return (
    <div style={{ display:'flex', gap:4, padding:'0 20px' }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i <= current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transition:'background 0.3s' }} />
      ))}
    </div>
  );
}

function FormShell({ title, sub, step, total, onBack, onNext, nextLabel='Continue', nextDisabled, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'white', fontFamily:'Barlow,sans-serif' }}>
      <div style={{ background:navy, padding:'14px 20px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
          <button onClick={onBack} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:'white', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16 }}>←</button>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'white', letterSpacing:'0.04em' }}>{title}</div>
        </div>
        <StepBar total={total} current={step} />
        {sub && <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:8, paddingLeft:2 }}>{sub}</div>}
      </div>
      <div style={{ flex:1, padding:'18px 20px 100px' }}>{children}</div>
      <div style={{ padding:'12px 20px 20px', borderTop:'1px solid #E5EAF2', background:'white' }}>
        <button onClick={onNext} disabled={nextDisabled}
          style={{ width:'100%', padding:'14px', borderRadius:10, border:'none',
            background: nextDisabled ? '#D0D8E4' : navy, color:'white',
            fontSize:15, fontWeight:800, cursor: nextDisabled ? 'default' : 'pointer',
            fontFamily:'Barlow Condensed,sans-serif' }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#00264D', marginBottom:4 }}>{label}</div>
      {hint && <div style={{ fontSize:11, color:'#5A7090', marginBottom:6, lineHeight:1.5 }}>{hint}</div>}
      {children}
    </div>
  );
}

function TxtInput({ value, onChange, placeholder, type='text' }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
      style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #D0D8E4', borderRadius:10, fontSize:14, boxSizing:'border-box', fontFamily:'Barlow,sans-serif' }} />
  );
}

function YesNo({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:8 }}>
      {[['yes','Yes'],['no','No']].map(([v,l]) => (
        <button key={v} onClick={() => onChange(v)}
          style={{ flex:1, padding:'11px', borderRadius:10, border:'2px solid', fontSize:14, fontWeight:700, cursor:'pointer',
            borderColor: value===v ? navy : '#D0D8E4',
            background: value===v ? navy : 'white',
            color: value===v ? 'white' : '#5A7090' }}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Declaration({ text }) {
  return (
    <div style={{ background:'#F4F7FB', border:'1px solid #D0D8E4', borderRadius:10, padding:'14px 16px', fontSize:12, color:'#00264D', lineHeight:1.7, marginBottom:16, whiteSpace:'pre-wrap' }}>
      {text}
    </div>
  );
}

// ── TG21 ──────────────────────────────────────────────────────────

function TG21Form({ event, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [nok, setNok] = useState(PARENT.name);
  const [nokRel, setNokRel] = useState(PARENT.rel);
  const [nokTel, setNokTel] = useState('07700 900123');
  const [altTel, setAltTel] = useState('');
  const [sig, setSig] = useState('');
  const [err, setErr] = useState('');

  const SUBS = ['Activity Details', 'Emergency Contact', 'Sign & Consent'];

  function next() {
    if (step === 1 && (!nok.trim() || !nokTel.trim())) { setErr('Please complete required fields'); return; }
    if (step === 2 && !sig.trim()) { setErr('Please type your full name to sign'); return; }
    setErr('');
    if (step < 2) { setStep(s=>s+1); return; }
    submitForm(event.eventId, CADET.id, 'tg21', { sig, nokName:nok, nokTel });
    onComplete('tg21');
  }

  return (
    <FormShell title="TG21 Activity Consent" sub={SUBS[step]} step={step} total={3}
      onBack={step===0 ? onBack : () => { setErr(''); setStep(s=>s-1); }}
      onNext={next} nextLabel={step===2 ? '✅ Submit TG21' : 'Continue'}
      nextDisabled={step===2 && !sig.trim()}>

      {step === 0 && (
        <>
          <div style={{ background:`${navy}10`, border:`1px solid ${navy}25`, borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:navy }}>{event.event}</div>
            <div style={{ fontSize:13, color:'#5A7090', marginTop:4 }}>{event.date} · {event.location}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {[['Cadet',CADET.name],['Service No.',CADET.svc],['Rank',CADET.rank],['Unit',CADET.sqn]].map(([l,v])=>(
              <div key={l} style={{ background:'white', border:'1px solid #E5EAF2', borderRadius:8, padding:'10px 12px' }}>
                <div style={{ fontSize:10, color:'#5A7090', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#00264D', marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
          <Declaration text="You are consenting for the above cadet to take part in this activity organised by the Royal Air Force Air Cadets. The activity has been planned, risk assessed, and approved by the Wing Training Staff." />
          <div style={{ fontSize:12, color:'#5A7090' }}>⏰ Deadline: <strong style={{ color:'#92400E' }}>{event.deadline}</strong></div>
        </>
      )}

      {step === 1 && (
        <>
          <Field label="Parent / Guardian full name *"><TxtInput value={nok} onChange={setNok} placeholder="Full name" /></Field>
          <Field label="Relationship to cadet"><TxtInput value={nokRel} onChange={setNokRel} placeholder="e.g. Mother" /></Field>
          <Field label="Mobile number *" hint="We will call this number in an emergency."><TxtInput value={nokTel} onChange={setNokTel} type="tel" placeholder="07…" /></Field>
          <Field label="Alternative contact" hint="Optional — another parent or responsible adult"><TxtInput value={altTel} onChange={setAltTel} type="tel" placeholder="07… (optional)" /></Field>
          {err && <div style={{ color:red, fontSize:12, marginTop:-10, marginBottom:8 }}>{err}</div>}
        </>
      )}

      {step === 2 && (
        <>
          <Declaration text={`I, ${nok||'the undersigned'}, consent to ${CADET.name} participating in ${event.event} (${event.date}) organised by 1701 (Johnstone) Squadron, Royal Air Force Air Cadets.\n\nI confirm that the emergency contact details are current and correct. I understand that if my child is unwell on the day of departure I will inform the Squadron Commander immediately.\n\nI agree to the cadet travelling by the transport arranged by the RAFAC and to them receiving medical treatment in an emergency if I cannot be contacted.`} />
          <Field label="Type your full name to sign" hint="This acts as your electronic signature">
            <TxtInput value={sig} onChange={v=>{setSig(v);setErr('');}} placeholder="e.g. Karen Mitchell" />
          </Field>
          {err && <div style={{ color:red, fontSize:12, marginTop:-10 }}>{err}</div>}
          <div style={{ fontSize:11, color:'#5A7090', marginTop:10 }}>📅 {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
        </>
      )}
    </FormShell>
  );
}

// ── TG23 ──────────────────────────────────────────────────────────

function TG23Form({ event, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [conditions, setConditions] = useState('no');
  const [condDetail, setCondDetail] = useState('');
  const [meds, setMeds] = useState('no');
  const [medDetail, setMedDetail] = useState('');
  const [swim, setSwim] = useState('yes');
  const [diet, setDiet] = useState('');
  const [gpName, setGpName] = useState('');
  const [gpAddr, setGpAddr] = useState('');
  const [gpTel, setGpTel] = useState('');
  const [sig, setSig] = useState('');
  const [err, setErr] = useState('');

  const SUBS = ['Health & Medical', 'GP Details', 'Declaration & Sign'];

  function next() {
    if (step===1 && (!gpName.trim()||!gpTel.trim())) { setErr('GP name and telephone are required'); return; }
    if (step===2 && !sig.trim()) { setErr('Please type your full name to sign'); return; }
    setErr('');
    if (step<2) { setStep(s=>s+1); return; }
    submitForm(event.eventId, CADET.id, 'tg23', { sig, conditions, condDetail, meds, medDetail, swim, diet, gpName, gpTel });
    onComplete('tg23');
  }

  return (
    <FormShell title="TG23 Health Declaration" sub={SUBS[step]} step={step} total={3}
      onBack={step===0 ? onBack : () => { setErr(''); setStep(s=>s-1); }}
      onNext={next} nextLabel={step===2 ? '✅ Submit TG23' : 'Continue'}
      nextDisabled={step===2 && !sig.trim()}>

      {step === 0 && (
        <>
          <div style={{ fontSize:12, color:'#5A7090', marginBottom:16, lineHeight:1.6, background:'#F4F7FB', borderRadius:8, padding:'10px 12px' }}>
            🔒 Held as <strong>special-category medical data</strong> under GDPR DPA 2018. Accessible only to authorised staff and used solely for cadet safety.
          </div>
          <Field label="Does the cadet have any medical conditions, disabilities, or allergies?">
            <YesNo value={conditions} onChange={setConditions} />
            {conditions==='yes' && (
              <textarea value={condDetail} onChange={e=>setCondDetail(e.target.value)} rows={3}
                placeholder="e.g. Mild asthma — blue inhaler carried at all times"
                style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #D0D8E4', borderRadius:10, fontSize:13, marginTop:10, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
            )}
          </Field>
          <Field label="Is the cadet currently taking any medication?">
            <YesNo value={meds} onChange={setMeds} />
            {meds==='yes' && (
              <textarea value={medDetail} onChange={e=>setMedDetail(e.target.value)} rows={3}
                placeholder="Name · dose · frequency (e.g. Salbutamol 100mcg — 2 puffs as needed)"
                style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #D0D8E4', borderRadius:10, fontSize:13, marginTop:10, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
            )}
          </Field>
          <Field label="Can the cadet swim 50 metres unaided?">
            <YesNo value={swim} onChange={setSwim} />
          </Field>
          <Field label="Dietary requirements" hint="Leave blank if none">
            <TxtInput value={diet} onChange={setDiet} placeholder="e.g. Vegetarian · nut allergy · Halal" />
          </Field>
        </>
      )}

      {step === 1 && (
        <>
          <div style={{ fontSize:12, color:'#5A7090', marginBottom:14, lineHeight:1.6 }}>GP details allow medical staff to access records in an emergency.</div>
          <Field label="GP practice name *"><TxtInput value={gpName} onChange={setGpName} placeholder="e.g. Johnstone Medical Centre" /></Field>
          <Field label="Practice address"><TxtInput value={gpAddr} onChange={setGpAddr} placeholder="e.g. 12 High Street, Johnstone PA5 8AQ" /></Field>
          <Field label="Practice telephone *"><TxtInput value={gpTel} onChange={setGpTel} type="tel" placeholder="01505…" /></Field>
          {err && <div style={{ color:red, fontSize:12, marginTop:-8 }}>{err}</div>}
        </>
      )}

      {step === 2 && (
        <>
          <Declaration text={`I confirm that the medical information provided for ${CADET.name} (Svc ${CADET.svc}) is accurate and complete to the best of my knowledge.\n\nI understand that withholding relevant medical information may affect cadet safety and eligibility. I consent to this information being shared with authorised RAFAC personnel and, in an emergency, with medical professionals.`} />
          <Field label="Type your full name to sign">
            <TxtInput value={sig} onChange={v=>{setSig(v);setErr('');}} placeholder="e.g. Karen Mitchell" />
          </Field>
          {err && <div style={{ color:red, fontSize:12, marginTop:-8 }}>{err}</div>}
          <div style={{ fontSize:11, color:'#5A7090', marginTop:10 }}>📅 {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
        </>
      )}
    </FormShell>
  );
}

// ── Flying Medical ────────────────────────────────────────────────

const FLY_QS = [
  { key:'epilepsy', q:'Has the cadet ever had epilepsy, fits, blackouts, or loss of consciousness?' },
  { key:'diabetes', q:'Does the cadet have diabetes or any condition requiring insulin?' },
  { key:'heart',    q:'Does the cadet have any heart, blood pressure, or circulatory condition?' },
  { key:'ears',     q:'Does the cadet have any ear, nose, or sinus problems (e.g. blocked ears, grommets)?' },
  { key:'vision',   q:'Does the cadet have any uncorrected vision problems or colour blindness?' },
  { key:'psych',    q:'Has the cadet ever been treated for a psychiatric or psychological condition?' },
];

function FlyingMedForm({ event, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState({});
  const [flyMeds, setFlyMeds] = useState('no');
  const [flyMedDetail, setFlyMedDetail] = useState('');
  const [ill48, setIll48] = useState('no');
  const [ill48Detail, setIll48Detail] = useState('');
  const [sig, setSig] = useState('');
  const [err, setErr] = useState('');

  const allAnswered = FLY_QS.every(q => answers[q.key]);
  const yesCount = FLY_QS.filter(q => answers[q.key]==='yes').length;

  const SUBS = ['Health Questions', 'Recent Health', 'Declaration & Sign'];

  function next() {
    if (step===0 && !allAnswered) { setErr('Please answer all questions'); return; }
    if (step===2 && !sig.trim()) { setErr('Please type your full name to sign'); return; }
    setErr('');
    if (step<2) { setStep(s=>s+1); return; }
    submitForm(event.eventId, CADET.id, 'flying', { sig, answers, details, flyMeds, ill48 });
    onComplete('flying');
  }

  return (
    <FormShell title="Flying Medical Declaration" sub={SUBS[step]} step={step} total={3}
      onBack={step===0 ? onBack : () => { setErr(''); setStep(s=>s-1); }}
      onNext={next} nextLabel={step===2 ? '✅ Submit Declaration' : 'Continue'}
      nextDisabled={(step===0 && !allAnswered)||(step===2 && !sig.trim())}>

      {step === 0 && (
        <>
          <div style={{ fontSize:12, color:'#5A7090', marginBottom:14, lineHeight:1.6, background:'#F4F7FB', borderRadius:8, padding:'10px 12px' }}>
            Required for Air Experience Flights and Gliding per JSP 950 and RAFAC AVMED policy. Any "Yes" answer is reviewed by the Wing Medical Officer before flight clearance is issued.
          </div>
          {FLY_QS.map(({key,q}) => (
            <div key={key} style={{ marginBottom:12, background:'#F8FAFF', borderRadius:10, padding:'12px 14px', border:'1px solid #E5EAF2' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#00264D', marginBottom:8 }}>{q}</div>
              <YesNo value={answers[key]} onChange={v => setAnswers(p=>({...p,[key]:v}))} />
              {answers[key]==='yes' && (
                <textarea value={details[key]||''} onChange={e=>setDetails(p=>({...p,[key]:e.target.value}))} rows={2}
                  placeholder="Brief details…"
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #D0D8E4', borderRadius:8, fontSize:12, marginTop:8, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
              )}
            </div>
          ))}
          {yesCount > 0 && (
            <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:8, padding:'10px 12px', fontSize:12, color:'#92400E', marginTop:4 }}>
              ⚠️ {yesCount} condition{yesCount>1?'s':''} flagged — Wing Medical Officer will review. This does not automatically disqualify the cadet.
            </div>
          )}
          {err && <div style={{ color:red, fontSize:12, marginTop:8 }}>{err}</div>}
        </>
      )}

      {step === 1 && (
        <>
          <Field label="Is the cadet currently taking any medication that could cause drowsiness, impaired judgement, or altered consciousness?"
            hint="Includes antihistamines, some antibiotics, anxiety medication, and strong painkillers.">
            <YesNo value={flyMeds} onChange={setFlyMeds} />
            {flyMeds==='yes' && (
              <textarea value={flyMedDetail} onChange={e=>setFlyMedDetail(e.target.value)} rows={2}
                placeholder="Name, dose, and when last taken"
                style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #D0D8E4', borderRadius:8, fontSize:13, marginTop:10, boxSizing:'border-box', resize:'vertical', fontFamily:'Barlow,sans-serif' }} />
            )}
          </Field>
          <Field label="Has the cadet been unwell in the last 48 hours?"
            hint="Cold, earache, vomiting, diarrhoea, headache, or fever.">
            <YesNo value={ill48} onChange={setIll48} />
            {ill48==='yes' && (
              <TxtInput value={ill48Detail} onChange={setIll48Detail} placeholder="Brief description of symptoms" />
            )}
          </Field>
          <div style={{ background:'#EEF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'10px 12px', fontSize:11, color:'#1E40AF' }}>
            ℹ️ Flying with an ear or sinus infection, or after vomiting/diarrhoea, is dangerous. If symptoms develop before the activity, do not allow the cadet to fly and notify the OC immediately.
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Declaration text={`I declare that the information provided for ${CADET.name} (Svc ${CADET.svc}) regarding their fitness to fly is accurate and complete.\n\nI understand that flying with an undisclosed condition may endanger the cadet and others. I accept responsibility for notifying 1701 Squadron of any change in health between now and the activity date.\n\nThis declaration is made in accordance with RAFAC AVMED policy and JSP 950.`} />
          {(ill48==='yes'||flyMeds==='yes') && (
            <div style={{ background:'#FEE2E2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 12px', fontSize:12, color:'#991B1B', marginBottom:14 }}>
              ⚠️ You have indicated conditions that require review. The Wing Medical Officer will contact you before flight clearance is confirmed.
            </div>
          )}
          <Field label="Type your full name to sign">
            <TxtInput value={sig} onChange={v=>{setSig(v);setErr('');}} placeholder="e.g. Karen Mitchell" />
          </Field>
          {err && <div style={{ color:red, fontSize:12, marginTop:-8 }}>{err}</div>}
          <div style={{ fontSize:11, color:'#5A7090', marginTop:10 }}>📅 {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
        </>
      )}
    </FormShell>
  );
}

// ── Main Portal ───────────────────────────────────────────────────

export default function PortalApp({ onToast }) {
  const [view, setView] = useState('home');
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [detail, setDetail] = useState({});

  function refresh() {
    const d = {};
    PENDING_FORMS.forEach(ev => { d[ev.eventId] = getFormDetail1(ev.eventId, CADET.id); });
    setDetail(d);
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('rafac-form-update', handler);
    return () => window.removeEventListener('rafac-form-update', handler);
  }, []);

  function formDone(formType) {
    refresh();
    onToast?.(`✅ ${FORM_META[formType].label} submitted for ${CADET.name}`);
    setView('pick-event');
  }

  const allSigned = ev => ev.forms.every(f => detail[ev.eventId]?.[f]?.signed);
  const signedCount = ev => ev.forms.filter(f => detail[ev.eventId]?.[f]?.signed).length;
  const totalOutstanding = PENDING_FORMS.reduce((n,ev) => n + ev.forms.filter(f => !detail[ev.eventId]?.[f]?.signed).length, 0);

  // Active form
  if (view==='form' && activeEvent && activeForm) {
    const props = { event:activeEvent, onComplete:formDone, onBack:()=>setView('pick-event') };
    if (activeForm==='tg21')   return <TG21Form {...props} />;
    if (activeForm==='tg23')   return <TG23Form {...props} />;
    if (activeForm==='flying') return <FlyingMedForm {...props} />;
  }

  // Event form picker
  if (view==='pick-event' && activeEvent) {
    const ev = activeEvent;
    const evDetail = detail[ev.eventId] || {};
    return (
      <div style={{ minHeight:'100vh', background:'#F4F7FB', fontFamily:'Barlow,sans-serif' }}>
        <div style={{ background:navy, padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={()=>setView('home')} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:'white', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16 }}>←</button>
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'white' }}>{ev.event}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{ev.date} · {ev.location}</div>
          </div>
        </div>
        <div style={{ padding:20 }}>
          <div style={{ fontSize:13, color:'#5A7090', marginBottom:16, lineHeight:1.6 }}>
            Complete all forms below by <strong style={{ color:'#00264D' }}>{ev.deadline}</strong>. Your child cannot attend without all signed forms.
          </div>
          {ev.forms.map(formKey => {
            const meta = FORM_META[formKey];
            const done = evDetail[formKey]?.signed;
            return (
              <div key={formKey} style={{ background:'white', border:`2px solid ${done?'#BBF7D0':'#E5EAF2'}`, borderRadius:12, padding:'16px 18px', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:done?'#D1FAE5':`${meta.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{meta.icon}</div>
                    <div>
                      <div style={{ fontWeight:700, color:'#00264D', fontSize:14 }}>{meta.label}</div>
                      <div style={{ fontSize:11, color:done?'#065F46':'#5A7090', marginTop:2 }}>
                        {done ? `✅ Signed ${new Date(evDetail[formKey].signedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}` : 'Not yet completed'}
                      </div>
                    </div>
                  </div>
                  {done ? <span style={{ fontSize:22 }}>✅</span> : (
                    <button onClick={()=>{ setActiveForm(formKey); setView('form'); }}
                      style={{ padding:'9px 16px', borderRadius:8, border:'none', background:navy, color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                      Complete →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {allSigned(ev) && (
            <div style={{ background:'#D1FAE5', border:'1px solid #6EE7B7', borderRadius:10, padding:'14px 16px', textAlign:'center', marginTop:8 }}>
              <div style={{ fontSize:28 }}>🎉</div>
              <div style={{ fontWeight:700, color:'#065F46', fontSize:14, marginTop:4 }}>All forms complete!</div>
              <div style={{ fontSize:12, color:'#047857', marginTop:2 }}>Squadron Admin has been notified automatically.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Home
  return (
    <div style={{ minHeight:'100vh', background:'#F4F7FB', fontFamily:'Barlow,sans-serif' }}>
      <div style={{ background:navy, padding:'20px 20px 18px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:`conic-gradient(${navy} 0deg 120deg,#fff 120deg 240deg,${red} 240deg 360deg)`, border:'2px solid rgba(255,255,255,0.4)' }} />
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'white' }}>Parent Portal</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>1701 (Johnstone) Squadron · RAFAC</div>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>Cadet</div>
          <div style={{ fontSize:17, fontWeight:800, color:'white', fontFamily:'Barlow Condensed,sans-serif' }}>{CADET.name}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{CADET.rank} · Svc {CADET.svc} · {CADET.sqn}</div>
        </div>
      </div>

      <div style={{ padding:20 }}>
        {totalOutstanding > 0 ? (
          <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:10, padding:'12px 14px', marginBottom:20, display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:24 }}>⏰</span>
            <div>
              <div style={{ fontWeight:700, color:'#92400E', fontSize:14 }}>{totalOutstanding} form{totalOutstanding>1?'s':''} outstanding</div>
              <div style={{ fontSize:12, color:'#78350F', marginTop:2 }}>Your child cannot attend without all signed forms.</div>
            </div>
          </div>
        ) : (
          <div style={{ background:'#D1FAE5', border:'1px solid #6EE7B7', borderRadius:10, padding:'12px 14px', marginBottom:20, display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:24 }}>✅</span>
            <div style={{ fontWeight:700, color:'#065F46', fontSize:14 }}>All forms are up to date</div>
          </div>
        )}

        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'#00264D', marginBottom:12 }}>Upcoming Activities</div>

        {PENDING_FORMS.map(ev => {
          const done = signedCount(ev);
          const total = ev.forms.length;
          const complete = done===total;
          return (
            <div key={ev.eventId} onClick={()=>{ setActiveEvent(ev); setView('pick-event'); }}
              style={{ background:'white', border:`2px solid ${complete?'#BBF7D0':'#E5EAF2'}`, borderRadius:12, padding:'16px 18px', marginBottom:12, cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontWeight:800, color:'#00264D', fontSize:15 }}>{ev.event}</div>
                  <div style={{ fontSize:12, color:'#5A7090', marginTop:2 }}>{ev.date} · {ev.location}</div>
                  <div style={{ fontSize:11, fontWeight:600, marginTop:4, color:complete?'#065F46':'#92400E' }}>
                    {complete ? '✅ All forms complete' : `⏰ Deadline ${ev.deadline}`}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                  <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:24, fontWeight:800, color:complete?'#065F46':'#92400E' }}>{done}/{total}</div>
                  <div style={{ fontSize:10, color:'#5A7090' }}>forms signed</div>
                </div>
              </div>
              <div style={{ marginTop:12, display:'flex', gap:6, flexWrap:'wrap' }}>
                {ev.forms.map(f => {
                  const signed = detail[ev.eventId]?.[f]?.signed;
                  return (
                    <span key={f} style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20,
                      background:signed?'#D1FAE5':'#F4F7FB', color:signed?'#065F46':'#5A7090',
                      border:`1px solid ${signed?'#6EE7B7':'#D0D8E4'}` }}>
                      {signed?'✅ ':''}{FORM_META[f].label}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ fontSize:11, color:'#8A9BB0', textAlign:'center', marginTop:24, lineHeight:1.7 }}>
          🔒 Data held securely under GDPR DPA 2018<br />
          Royal Air Force Air Cadets · 1701 (Johnstone) Squadron
        </div>
      </div>
    </div>
  );
}
