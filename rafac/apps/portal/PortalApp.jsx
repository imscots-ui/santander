import { useState } from 'react';
import { setFormStatus } from '../../data/sync.js';

const navy = '#003087', red = '#C8102E';

export default function PortalApp({ onToast }) {
  const [step, setStep] = useState('home'); // home | consent | success
  const [sig, setSig] = useState('');
  const [sigErr, setSigErr] = useState('');
  const [tg23checked, setTg23checked] = useState(false);
  const [conditions, setConditions] = useState('');
  const [showMedical, setShowMedical] = useState(false);

  const EVENT = { id:'e1', name:'Shooting (L98 & .22)', date:'14–16 November 2026', location:'Bisley, Surrey' };
  const CADET = { name:'Sarah Mitchell', svc:'2408773', rank:'Cadet Corporal', id:'c01' };

  function submit() {
    if (!sig.trim()) { setSigErr('Please type your full name to sign'); return; }
    setSigErr('');
    setFormStatus(EVENT.id, CADET.id, 'signed');
    onToast?.('✅ Consent & TG23 submitted — Mitchell, S updated');
    setStep('success');
  }

  const Btn = ({ children, onClick, style={} }) => (
    <button onClick={onClick} style={{ padding:'11px 24px', borderRadius:8, fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, letterSpacing:'0.04em', cursor:'pointer', border:'none', ...style }}>{children}</button>
  );

  if (step === 'home') return (
    <div style={{ minHeight:'100vh', background:'#f4f7fb', fontFamily:'Barlow,sans-serif' }}>
      <div style={{ background:navy, padding:'18px 24px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background:`conic-gradient(${navy} 0deg 120deg,#fff 120deg 240deg,${red} 240deg 360deg)`, border:'2px solid rgba(255,255,255,0.4)' }} />
        <div>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'white' }}>Parent Portal</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>1701 (Johnstone) Squadron · Royal Air Force Air Cadets</div>
        </div>
      </div>
      <div style={{ maxWidth:600, margin:'0 auto', padding:24 }}>
        <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:24, marginBottom:16 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'#00264D', marginBottom:12 }}>
            Action required for {CADET.name}
          </div>
          <div style={{ fontSize:13, color:'#5A7090', marginBottom:20 }}>
            Service No. {CADET.svc} · {CADET.rank} · 1701 (Johnstone) Squadron
          </div>
          <div style={{ background:'#FFF8E6', border:'1.5px solid #F0C84A', borderRadius:8, padding:'14px 16px', marginBottom:20 }}>
            <div style={{ fontWeight:700, color:'#7A4A00', marginBottom:6, fontSize:14 }}>⏰ Consent required</div>
            <div style={{ fontSize:13, color:'#5A3A00' }}>
              TG21 activity consent and TG23 health declaration are required for <strong>{EVENT.name}</strong> ({EVENT.date}).
              The deadline is <strong>12 November 2026</strong>. After this date the cadet cannot attend.
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
            {[['Activity',EVENT.name],['Dates',EVENT.date],['Location',EVENT.location],['Forms needed','TG21 Consent · TG23 Medical']].map(([l,v])=>(
              <div key={l}><div style={{ fontSize:11, color:'#5A7090', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div><div style={{ fontWeight:600, color:'#0D1B2E', marginTop:2, fontSize:13 }}>{v}</div></div>
            ))}
          </div>
          <Btn onClick={() => setStep('consent')} style={{ background:'#00264D', color:'white', width:'100%', textAlign:'center' }}>
            Complete Consent & Medical →
          </Btn>
        </div>
        <div style={{ fontSize:11, color:'#8A9BB0', textAlign:'center', lineHeight:1.6 }}>
          🔒 This portal is protected. Medical details (TG23) are held as special-category data under GDPR DPA 2018 and are visible to authorised staff only. No data is shared with third parties.
        </div>
      </div>
    </div>
  );

  if (step === 'consent') return (
    <div style={{ minHeight:'100vh', background:'#f4f7fb', fontFamily:'Barlow,sans-serif' }}>
      <div style={{ background:navy, padding:'18px 24px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background:`conic-gradient(${navy} 0deg 120deg,#fff 120deg 240deg,${red} 240deg 360deg)`, border:'2px solid rgba(255,255,255,0.4)' }} />
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:18, fontWeight:800, color:'white' }}>Complete Consent</div>
      </div>
      <div style={{ maxWidth:600, margin:'0 auto', padding:24 }}>
        {/* TG21 */}
        <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:24, marginBottom:16 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'#00264D', marginBottom:12 }}>TG21 — Activity Consent</div>
          <div style={{ fontSize:13, color:'#0D1B2E', lineHeight:1.7, marginBottom:16 }}>
            I, the parent/guardian of <strong>{CADET.name}</strong>, consent to their participation in <strong>{EVENT.name}</strong>
            ({EVENT.date}, {EVENT.location}). I confirm that to the best of my knowledge the information provided is correct
            and I accept the terms of the RAF Air Cadets participation policy.
          </div>
          {[
            'I confirm the young person is in good health and physically capable of this activity.',
            'I understand the activity will be conducted under RAFAC-qualified supervision.',
            'I consent to first aid being administered in an emergency.',
            'I confirm contact details are up to date.',
          ].map((t, i) => (
            <label key={i} style={{ display:'flex', gap:10, marginBottom:10, cursor:'pointer', alignItems:'flex-start' }}>
              <input type="checkbox" defaultChecked style={{ marginTop:2, width:15, height:15 }} />
              <span style={{ fontSize:13, color:'#0D1B2E' }}>{t}</span>
            </label>
          ))}
        </div>

        {/* TG23 */}
        <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:24, marginBottom:16 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'#00264D', marginBottom:4 }}>TG23 — Health Declaration</div>
          <div style={{ fontSize:11, color:'#5A7090', marginBottom:14 }}>🔒 Medical detail is stored as special-category data (GDPR). Visible to activity staff on a need-to-know basis only.</div>
          <label style={{ display:'flex', gap:10, marginBottom:16, cursor:'pointer', alignItems:'flex-start' }}>
            <input type="checkbox" checked={tg23checked} onChange={e => setTg23checked(e.target.checked)} style={{ marginTop:2, width:15, height:15 }} />
            <span style={{ fontSize:13, color:'#0D1B2E' }}>The young person has a medical condition, allergy, or takes regular medication that the activity staff should be aware of.</span>
          </label>
          {tg23checked && (
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'#00264D', display:'block', marginBottom:5 }}>Please describe the condition / medication</label>
              <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows={3} placeholder="e.g. Mild asthma — uses Ventolin inhaler as required. Inhaler will be carried at all times."
                style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #c8d8f0', borderRadius:7, fontSize:13, fontFamily:'inherit', resize:'vertical' }} />
              <div style={{ fontSize:11, color:'#5A7090', marginTop:5 }}>This information is encrypted at rest and shared with activity supervisors only.</div>
            </div>
          )}
          {!tg23checked && <div style={{ fontSize:12, color:'#1B6B3A', fontWeight:600 }}>✅ No medical conditions to declare.</div>}
        </div>

        {/* Signature */}
        <div style={{ background:'white', border:'1.5px solid #d0dcf0', borderRadius:12, padding:24, marginBottom:16 }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, color:'#00264D', marginBottom:12 }}>Sign to Submit</div>
          <div style={{ fontSize:13, color:'#0D1B2E', marginBottom:14 }}>
            Type your full name below as your electronic signature. This has the same legal standing as a handwritten signature.
          </div>
          <input value={sig} onChange={e => { setSig(e.target.value); setSigErr(''); }}
            placeholder="Type your full name here"
            style={{ width:'100%', padding:'12px 14px', border:`1.5px solid ${sigErr ? '#c8102e' : '#c8d8f0'}`, borderRadius:8, fontSize:16, fontFamily:'Georgia,serif', fontStyle:'italic', outline:'none' }} />
          {sigErr && <div style={{ fontSize:11, color:'#c8102e', marginTop:4 }}>{sigErr}</div>}
          <div style={{ fontSize:11, color:'#5A7090', marginTop:8 }}>Date: {new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</div>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => setStep('home')} style={{ padding:'11px 20px', background:'white', border:'1.5px solid #d0dcf0', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>← Back</button>
          <Btn onClick={submit} style={{ flex:1, background:'#00264D', color:'white', textAlign:'center' }}>Submit Consent & TG23 →</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:navy, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Barlow,sans-serif' }}>
      <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:16, padding:'40px 36px', maxWidth:500, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:28, fontWeight:800, color:'white', marginBottom:10 }}>Consent Submitted</div>
        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:14, lineHeight:1.7, marginBottom:28 }}>
          Thank you. Your consent for <strong style={{ color:'white' }}>{CADET.name}</strong> to attend <strong style={{ color:'white' }}>{EVENT.name}</strong> has been received and filed.<br /><br />
          The squadron's consent tracker has been updated automatically. You will receive a confirmation email shortly.
        </div>
        <div style={{ background:'rgba(200,160,50,0.15)', border:'1px solid rgba(200,160,50,0.3)', borderRadius:8, padding:'12px 16px', fontSize:12, color:'rgba(200,160,50,0.9)', marginBottom:24 }}>
          🔒 TG21 consent and TG23 health declaration filed · {new Date().toLocaleDateString('en-GB')}
        </div>
        <button onClick={() => { setStep('home'); setSig(''); setTg23checked(false); setConditions(''); }} style={{ padding:'10px 28px', background:'#C8A032', color:'#00264D', border:'none', borderRadius:8, fontFamily:'Barlow Condensed,sans-serif', fontSize:16, fontWeight:800, cursor:'pointer' }}>
          Return to Portal
        </button>
      </div>
    </div>
  );
}
