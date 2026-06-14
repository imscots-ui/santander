import { useState } from 'react';
import { pushWebEnquiry } from '../../data/sync.js';

const SQUADRONS = [
  { num:'1701', name:'1701 (Johnstone) Squadron',   note:'Meets Thu evenings · Johnstone Town Hall' },
  { num:'342',  name:'342 (Paisley) Squadron',       note:'Meets Wed evenings · Paisley Grammar' },
  { num:'1944', name:'1944 (Renfrew) Squadron',      note:'Meets Tue evenings · Renfrew Community Centre' },
  { num:'1138', name:'1138 (Greenock) Squadron',     note:'Meets Mon evenings · Greenock Drill Hall' },
  { num:'2462', name:'2462 (Port Glasgow) Squadron', note:'Meets Thu evenings · Port Glasgow Academy' },
  { num:'414',  name:'414 (Gourock) Squadron',       note:'Meets Fri evenings · Gourock Sailing Club' },
];

function getAge(dob) {
  if (!dob) return null;
  const d = new Date(dob), now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
  return age;
}

export default function JoinForm({ onToast }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fn:'', sn:'', dob:'', gender:'', sqnNum:'1701',
    parentName:'', parentRel:'Parent / guardian', parentTel:'', parentEmail:'',
    howHeard:'', interest:'', notes:'', consent1:false, consent2:false,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (!form.fn.trim()) e.fn = 'Required';
    if (!form.sn.trim()) e.sn = 'Required';
    if (!form.dob) { e.dob = 'Required'; }
    else {
      const age = getAge(form.dob);
      if (age < 12 || age > 20) e.dob = 'Young person must be 12–20 years old';
    }
    if (!form.parentName.trim()) e.parentName = 'Required';
    if (!form.parentTel.trim()) e.parentTel = 'Required';
    if (!form.consent1) e.consent1 = 'You must agree to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    const age = getAge(form.dob);
    const sqn = SQUADRONS.find(s => s.num === form.sqnNum);
    const enquiry = {
      id: 'web-' + Date.now(),
      fn: form.fn.trim(), sn: form.sn.trim(),
      dob: form.dob, gender: form.gender, age,
      sqnNum: form.sqnNum, unit: sqn?.name || form.sqnNum,
      wing: 'West Scotland',
      parentName: form.parentName.trim(), parentRel: form.parentRel,
      parentTel: form.parentTel.trim(), parentEmail: form.parentEmail.trim(),
      src: '🌐 RAFAC website', howHeard: form.howHeard, interest: form.interest,
      notes: form.notes.trim(), status: 'enquiry', rejected: false,
      submittedAt: new Date().toISOString(), fromWebsite: true,
    };
    pushWebEnquiry(enquiry);
    setSubmitted(true);
    onToast?.('Enquiry submitted — 1701 Sqn will be in touch shortly');
  }

  const F = ({ label, err, children }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#00264D', marginBottom:5 }}>{label}</label>
      {children}
      {err && <div style={{ fontSize:11, color:'#c8102e', marginTop:3 }}>{err}</div>}
    </div>
  );

  const inp = (k, props={}) => (
    <input
      value={form[k]} onChange={ev => set(k, ev.target.value)}
      style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${errors[k] ? '#c8102e' : '#c8d8f0'}`, borderRadius:7, fontSize:14, fontFamily:'inherit', outline:'none' }}
      {...props}
    />
  );

  const sel = (k, opts) => (
    <select
      value={form[k]} onChange={ev => set(k, ev.target.value)}
      style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${errors[k] ? '#c8102e' : '#c8d8f0'}`, borderRadius:7, fontSize:14, fontFamily:'inherit', background:'white' }}
    >
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );

  if (submitted) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(170deg,#003087 0%,#001840 60%,#000D1F 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:16, padding:'40px 36px', maxWidth:560, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:28, fontWeight:800, color:'white', marginBottom:8 }}>Enquiry Received</div>
        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:14, marginBottom:32, lineHeight:1.6 }}>
          Thank you for your interest in the Air Training Corps.<br />A member of staff from 1701 (Johnstone) Squadron will be in touch within a few days.
        </div>
        <div style={{ textAlign:'left' }}>
          {[
            ['1', 'We contact you', 'A staff member will phone or email to introduce the squadron and answer questions.'],
            ['2', 'Visit a parade night', "Come along on a Thursday evening — no commitment. Meet the team and see what we're about."],
            ['3', 'Complete the application', 'If you decide to join, we guide you through the RAFAC online application and medical forms.'],
            ['4', 'Start flying', "Once enrolled you can start working towards your first flight — usually within the first few months."],
          ].map(([n, h, t]) => (
            <div key={n} style={{ display:'flex', gap:14, marginBottom:18, alignItems:'flex-start' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#C8A032', color:'#00264D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:16, flexShrink:0 }}>{n}</div>
              <div>
                <div style={{ color:'white', fontWeight:700, fontSize:14, marginBottom:2 }}>{h}</div>
                <div style={{ color:'rgba(255,255,255,0.55)', fontSize:12, lineHeight:1.5 }}>{t}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setSubmitted(false); setForm({ fn:'',sn:'',dob:'',gender:'',sqnNum:'1701',parentName:'',parentRel:'Parent / guardian',parentTel:'',parentEmail:'',howHeard:'',interest:'',notes:'',consent1:false,consent2:false }); }}
          style={{ marginTop:16, padding:'10px 28px', background:'#C8A032', color:'#00264D', border:'none', borderRadius:8, fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'Barlow Condensed,sans-serif', letterSpacing:'0.04em' }}>
          Submit Another Enquiry
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f4f7fb', fontFamily:'Barlow,sans-serif' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#003087 0%,#001840 100%)', padding:'40px 24px', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,#C8102E 240deg 360deg)', margin:'0 auto 16px', boxShadow:'0 0 0 3px rgba(200,160,50,0.5)' }} />
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:'white', letterSpacing:'0.04em', marginBottom:6 }}>
          Join the Air Training Corps
        </div>
        <div style={{ color:'rgba(255,255,255,0.65)', fontSize:15, marginBottom:20 }}>
          1701 (Johnstone) Squadron · West Scotland Sector · Ages 12–20
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          {['✈️ Flying & Gliding','🏔️ Duke of Edinburgh','🎺 Music & Drill','🌍 Adventurous Training','🎖️ Leadership & Quals'].map(b => (
            <span key={b} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:20, padding:'4px 14px', fontSize:12, color:'white' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth:680, margin:'0 auto', padding:'32px 20px' }}>
        <form onSubmit={submit} noValidate>
          {/* Young person */}
          <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:'24px', marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'#00264D', marginBottom:20, paddingBottom:12, borderBottom:'2px solid #f0f4fa' }}>
              About the Young Person
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <F label="First name *" err={errors.fn}>{inp('fn', { placeholder:'e.g. Jamie' })}</F>
              <F label="Surname *" err={errors.sn}>{inp('sn', { placeholder:'e.g. Campbell' })}</F>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <F label="Date of birth *" err={errors.dob}>{inp('dob', { type:'date', max: new Date(new Date().setFullYear(new Date().getFullYear()-12)).toISOString().split('T')[0] })}</F>
              <F label="Gender (optional)">{sel('gender', [['','Prefer not to say'],['Male','Male'],['Female','Female'],['Non-binary','Non-binary'],['Other','Other / prefer to self-describe']])}</F>
            </div>
          </div>

          {/* Squadron */}
          <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:'24px', marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'#00264D', marginBottom:20, paddingBottom:12, borderBottom:'2px solid #f0f4fa' }}>
              Squadron Preference
            </div>
            <F label="Preferred squadron *">
              <select value={form.sqnNum} onChange={ev => set('sqnNum', ev.target.value)}
                style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #c8d8f0', borderRadius:7, fontSize:14, fontFamily:'inherit', background:'white' }}>
                {SQUADRONS.map(s => <option key={s.num} value={s.num}>{s.name}</option>)}
              </select>
              {form.sqnNum && <div style={{ fontSize:11, color:'#5A7090', marginTop:5 }}>{SQUADRONS.find(s=>s.num===form.sqnNum)?.note}</div>}
            </F>
          </div>

          {/* Parent / guardian */}
          <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:'24px', marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'#00264D', marginBottom:20, paddingBottom:12, borderBottom:'2px solid #f0f4fa' }}>
              Parent / Guardian Details
            </div>
            <F label="Full name *" err={errors.parentName}>{inp('parentName', { placeholder:'e.g. Mrs J. Campbell' })}</F>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <F label="Relationship">{sel('parentRel', [['Parent / guardian','Parent / guardian'],['Mother','Mother'],['Father','Father'],['Stepparent','Stepparent'],['Carer','Legal carer'],['Other','Other']])}</F>
              <F label="Mobile number *" err={errors.parentTel}>{inp('parentTel', { type:'tel', placeholder:'07xxx xxxxxx' })}</F>
            </div>
            <F label="Email address (optional)">{inp('parentEmail', { type:'email', placeholder:'name@example.com' })}</F>
          </div>

          {/* Extra */}
          <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:'24px', marginBottom:20 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'#00264D', marginBottom:20, paddingBottom:12, borderBottom:'2px solid #f0f4fa' }}>
              A Bit More
            </div>
            <F label="How did you hear about us?">
              {sel('howHeard', [['','— please select —'],['School','School / teacher'],['Friend','Friend or family member'],['Social media','Social media'],['RAFAC website','RAFAC website'],['Recruitment stand','Recruitment stand / event'],['Walk past / local','Walked past / local area'],['Other','Other']])}
            </F>
            <F label="Main area of interest">
              {sel('interest', [['','— please select —'],['Flying','Flying & gliding'],['Shooting','Shooting sports'],['DofE',"Duke of Edinburgh's Award"],['Music','Music & band'],['AT','Adventurous training'],['Leadership','Leadership & teamwork'],['STEM','STEM / aviation knowledge'],['All','A bit of everything']])}
            </F>
            <F label="Anything else you'd like to tell us?">
              <textarea value={form.notes} onChange={ev => set('notes', ev.target.value)} rows={3} placeholder="Anything that might help us when we call — special interests, schedule constraints, questions, etc."
                style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #c8d8f0', borderRadius:7, fontSize:14, fontFamily:'inherit', resize:'vertical' }} />
            </F>
          </div>

          {/* Consent */}
          <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:'24px', marginBottom:24 }}>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'#00264D', marginBottom:16, paddingBottom:12, borderBottom:'2px solid #f0f4fa' }}>
              Data Protection
            </div>
            {[
              ['consent1', 'I confirm I am the parent/guardian of the young person named above, and I consent to RAFAC and 1701 Squadron contacting me about this enquiry. I understand my data will be held in accordance with the RAFAC privacy policy and GDPR. *', errors.consent1],
              ['consent2', 'I am happy to receive occasional updates and news from 1701 Squadron by email. (Optional)', null],
            ].map(([k, label, err]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer' }}>
                  <input type="checkbox" checked={form[k]} onChange={ev => set(k, ev.target.checked)} style={{ marginTop:2, flexShrink:0, width:16, height:16 }} />
                  <span style={{ fontSize:13, color:'#0D1B2E', lineHeight:1.5 }}>{label}</span>
                </label>
                {err && <div style={{ fontSize:11, color:'#c8102e', marginTop:3, paddingLeft:26 }}>{err}</div>}
              </div>
            ))}
          </div>

          <button type="submit"
            style={{ width:'100%', padding:'14px', background:'#00264D', color:'white', border:'none', borderRadius:10, fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, letterSpacing:'0.04em', cursor:'pointer' }}>
            Submit Enquiry →
          </button>
        </form>
      </div>
    </div>
  );
}
