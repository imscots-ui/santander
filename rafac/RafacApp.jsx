import { useState, useEffect } from 'react';
import SquadronShell from './apps/squadron/SquadronShell.jsx';
import WingApp       from './apps/wing/WingApp.jsx';
import CadetApp      from './apps/cadet/CadetApp.jsx';
import PortalApp     from './apps/portal/PortalApp.jsx';
import JoinForm      from './apps/join/JoinForm.jsx';

const navy = '#00264D', gold = '#C8A032';

const TABS = [
  { id:'squadron', icon:'🏠', title:'Squadron Admin', role:'Staff · OC · Trg Officer' },
  { id:'wing',     icon:'🏛️', title:'Wing HQ',        role:'West Scotland Sector' },
  { id:'cadet',    icon:'🎖️', title:'Cadet App',       role:'Phone · Cadet view' },
  { id:'portal',   icon:'📝', title:'Parent Portal',   role:'Consent signing' },
  { id:'join',     icon:'🌐', title:'Join Form',       role:'Public website' },
];

const WELCOME_TILES = [
  { id:'squadron', icon:'🏠', name:'Squadron Admin', role:'Staff / OC',         note:'Parade · consent · AT · applicants' },
  { id:'wing',     icon:'🏛️', name:'Wing HQ',        role:'Sector Command',     note:'Aggregates · approvals · H&S' },
  { id:'cadet',    icon:'🎖️', name:'Cadet App',       role:'Phone view',         note:'Progress · events · quals' },
  { id:'portal',   icon:'📝', name:'Parent Portal',   role:'Consent signing',    note:'Signs TG21 → updates live' },
  { id:'join',     icon:'🌐', name:'Join Form',        role:'Public website',     note:'Enquiries → Applicants pipeline' },
];

export default function RafacApp() {
  const [active, setActive] = useState(null);
  const [toast, setToast]   = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  function openApp(id) { setActive(id); }

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', fontFamily:'Barlow, sans-serif', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ background:navy, borderBottom:`2px solid ${gold}`, display:'flex', alignItems:'stretch', flexShrink:0, height:52 }}>
        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0 18px', borderRight:'1px solid rgba(255,255,255,0.12)', flexShrink:0, cursor:'pointer' }} onClick={() => setActive(null)}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,#C8102E 240deg 360deg)', boxShadow:`0 0 0 1.5px ${gold}` }} />
          <div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:800, color:'white', letterSpacing:'0.04em' }}>
              RAFAC <span style={{ color:'#F0C84A' }}>1701</span>
            </div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', letterSpacing:'0.08em' }}>1701 (Johnstone) Squadron</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', alignItems:'stretch', flex:1, overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => openApp(t.id)}
              style={{ display:'flex', alignItems:'center', gap:9, padding:'0 16px', cursor:'pointer', border:'none', background: active===t.id ? 'rgba(255,255,255,0.05)' : 'transparent', color: active===t.id ? 'white' : 'rgba(255,255,255,0.6)', borderBottom: active===t.id ? `3px solid ${gold}` : '3px solid transparent', whiteSpace:'nowrap', flexShrink:0, fontFamily:'Barlow,sans-serif', transition:'background 0.15s' }}>
              <span style={{ fontSize:15 }}>{t.icon}</span>
              <div style={{ textAlign:'left', lineHeight:1.2 }}>
                <div style={{ fontSize:12, fontWeight:700 }}>{t.title}</div>
                <div style={{ fontSize:9, color: active===t.id ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{t.role}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Sync pill */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginRight:14, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'4px 12px', fontSize:10, color:'rgba(255,255,255,0.65)', whiteSpace:'nowrap', flexShrink:0 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', animation:'pulse 2s infinite' }} />
          Cross-app sync live
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        </div>
      </div>

      {/* Frame */}
      <div style={{ flex:1, overflow:'hidden', position:'relative' }}>

        {/* Welcome screen */}
        {!active && (
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(170deg,#00264D 0%,#001530 55%,#000D1F 100%)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'auto', padding:20 }}>
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(200,160,50,0.25)', borderRadius:16, padding:'36px 40px', maxWidth:820, width:'100%', textAlign:'center' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,#C8102E 240deg 360deg)', margin:'0 auto 20px', boxShadow:'0 0 0 3px rgba(200,160,50,0.5),0 0 40px rgba(0,90,158,0.5)' }} />
              <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:32, fontWeight:800, color:'white', letterSpacing:'0.04em', marginBottom:6 }}>
                RAFAC <span style={{ color:'#F0C84A' }}>1701</span> Prototype
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:28 }}>
                1701 (Johnstone) Squadron · West Scotland Sector · Five interfaces, one system
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
                {WELCOME_TILES.map(t => (
                  <div key={t.id} onClick={() => openApp(t.id)}
                    style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'18px 14px', cursor:'pointer', textAlign:'center', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.11)'; e.currentTarget.style.borderColor='rgba(200,160,50,0.5)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='none'; }}>
                    <div style={{ fontSize:32, marginBottom:10 }}>{t.icon}</div>
                    <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'white', marginBottom:3 }}>{t.name}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{t.role}</div>
                    <div style={{ fontSize:10, color:'rgba(200,160,50,0.8)', marginTop:6 }}>{t.note}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', lineHeight:1.7, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:16 }}>
                <strong style={{ color:'rgba(255,255,255,0.5)' }}>Live cross-app sync demo:</strong>{' '}
                Open <strong style={{ color:'rgba(255,255,255,0.5)' }}>Parent Portal</strong> → sign consent → switch to <strong style={{ color:'rgba(255,255,255,0.5)' }}>Squadron Admin → Consents</strong> and <strong style={{ color:'rgba(255,255,255,0.5)' }}>Wing HQ</strong> — tracker updates instantly.{' '}
                Submit via <strong style={{ color:'rgba(255,255,255,0.5)' }}>Join Form</strong> → see the enquiry appear in <strong style={{ color:'rgba(255,255,255,0.5)' }}>Squadron Admin → Applicants</strong> with a 🌐 Web badge.
              </div>
            </div>
          </div>
        )}

        {/* App panels — always mounted to preserve state, shown/hidden */}
        {TABS.map(t => (
          <div key={t.id} style={{ position:'absolute', inset:0, display: active===t.id ? 'block' : 'none', overflow:'hidden' }}>
            {t.id === 'squadron' && <SquadronShell showToast={showToast} />}
            {t.id === 'wing'     && <WingApp />}
            {t.id === 'cadet'    && (
              <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center', background:'#F4F7FB' }}>
                <CadetApp />
              </div>
            )}
            {t.id === 'portal'   && <PortalApp onToast={showToast} />}
            {t.id === 'join'     && <div style={{ height:'100%', overflow:'auto' }}><JoinForm onToast={showToast} /></div>}
          </div>
        ))}
      </div>

      {/* Global toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:20, right:20, background:navy, color:'white', padding:'11px 18px', borderRadius:9, fontSize:13, fontWeight:600, zIndex:9999, boxShadow:'0 6px 24px rgba(0,0,0,0.35)', maxWidth:380, lineHeight:1.4 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
