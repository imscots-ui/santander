import { useState } from 'react';
import Overview      from './pages/Overview.jsx';
import CadetRegister from './pages/CadetRegister.jsx';
import Applicants    from './pages/Applicants.jsx';
import Consents      from './pages/Consents.jsx';
import Parade        from './pages/Parade.jsx';
import KitStores     from './pages/KitStores.jsx';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090';

const NAV = [
  { section:'ADMINISTRATION' },
  { id:'overview',    icon:'📊', label:'Overview' },
  { id:'cadets',      icon:'👥', label:'Cadet Register' },
  { id:'applicants',  icon:'📬', label:'Applicants' },
  { id:'parade',      icon:'🪖', label:'Parade Night' },
  { id:'kit',         icon:'🎒', label:'Kit & Stores' },
  { section:'TRAINING & FORMS' },
  { id:'consents',    icon:'📝', label:'Forms & Consents' },
  { id:'training',    icon:'🎯', label:'Training & AT',   placeholder:true },
  { id:'promotions',  icon:'🎖️', label:'Promotions',      placeholder:true },
  { section:'REFERENCE' },
  { id:'compliance',  icon:'🛡️', label:'Compliance',      placeholder:true },
  { id:'audit',       icon:'📋', label:'Audit Log',       placeholder:true },
];

export default function SquadronShell({ showToast }) {
  const [page, setPage] = useState('overview');

  function renderPage() {
    switch(page) {
      case 'overview':   return <Overview    showToast={showToast} />;
      case 'cadets':     return <CadetRegister showToast={showToast} />;
      case 'applicants': return <Applicants  showToast={showToast} />;
      case 'consents':   return <Consents    showToast={showToast} />;
      case 'parade':     return <Parade      showToast={showToast} />;
      case 'kit':        return <KitStores   showToast={showToast} />;
      default:           return <PlaceholderPage page={page} />;
    }
  }

  return (
    <div style={{ display:'flex', height:'100%', background:'#F4F7FB', fontFamily:'Barlow,sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width:224, background:navy, display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'16px 18px 12px', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:800, color:'white' }}>SQUADRON ADMIN</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em' }}>1701 (JOHNSTONE) SQN</div>
          <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'white' }}>JH</div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'white' }}>Sqn Ldr Harris</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)' }}>OC · 1701 Squadron</div>
            </div>
          </div>
        </div>

        <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {NAV.map((item, i) => {
            if (item.section) return (
              <div key={i} style={{ padding:'10px 18px 4px', fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>{item.section}</div>
            );
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} disabled={item.placeholder}
                style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 18px', background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: item.placeholder ? 'rgba(255,255,255,0.25)' : active ? 'white' : 'rgba(255,255,255,0.6)', border:'none', cursor: item.placeholder ? 'default' : 'pointer', fontSize:13, fontWeight: active ? 700 : 500, borderLeft: active ? `3px solid ${gold}` : '3px solid transparent', fontFamily:'Barlow,sans-serif', textAlign:'left' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.placeholder && <span style={{ marginLeft:'auto', fontSize:9, background:'rgba(255,255,255,0.1)', borderRadius:4, padding:'1px 5px' }}>Soon</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,0.1)', fontSize:9, color:'rgba(255,255,255,0.25)', lineHeight:1.4 }}>
          🔒 OFFICIAL-SENSITIVE<br />GDPR DPA 2018 applies
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:'auto', padding:24 }}>
        {renderPage()}
      </div>
    </div>
  );
}

function PlaceholderPage({ page }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', color:'#5A7090', textAlign:'center', gap:12 }}>
      <div style={{ fontSize:48 }}>🚧</div>
      <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, color:'#00264D' }}>{page.charAt(0).toUpperCase()+page.slice(1)}</div>
      <div style={{ fontSize:13 }}>This section is coming soon in the next build</div>
    </div>
  );
}
