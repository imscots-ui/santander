import { useState } from 'react';
import Overview        from './pages/Overview.jsx';
import CadetRegister   from './pages/CadetRegister.jsx';
import Applicants      from './pages/Applicants.jsx';
import Consents        from './pages/Consents.jsx';
import Parade          from './pages/Parade.jsx';
import KitStores       from './pages/KitStores.jsx';
import Comms           from './pages/Comms.jsx';
import Budget          from './pages/Budget.jsx';
import Training        from './pages/Training.jsx';
import Programme       from './pages/Programme.jsx';
import Classification  from './pages/Classification.jsx';
import DofE            from './pages/DofE.jsx';
import RiskAssessment  from './pages/RiskAssessment.jsx';
import Promotions      from './pages/Promotions.jsx';
import Band            from './pages/Band.jsx';
import Shooting        from './pages/Shooting.jsx';
import AEF             from './pages/AEF.jsx';
import Staff           from './pages/Staff.jsx';
import Awards          from './pages/Awards.jsx';
import Compliance      from './pages/Compliance.jsx';
import Safeguarding    from './pages/Safeguarding.jsx';
import AuditLog        from './pages/AuditLog.jsx';

const navy = '#00264D', gold = '#C8A032';

const NAV = [
  { section:'ADMINISTRATION' },
  { id:'overview',       icon:'📊', label:'Overview' },
  { id:'cadets',         icon:'👥', label:'Cadet Register' },
  { id:'applicants',     icon:'📬', label:'Applicants' },
  { id:'parade',         icon:'🪖', label:'Parade Night' },
  { id:'kit',            icon:'🎒', label:'Kit & Stores' },
  { id:'comms',          icon:'📨', label:'Communications' },
  { id:'budget',         icon:'💷', label:'Budget & Finance' },
  { section:'TRAINING & DEVELOPMENT' },
  { id:'consents',       icon:'📝', label:'Forms & Consents' },
  { id:'training',       icon:'🏕️', label:'Training & AT' },
  { id:'programme',      icon:'📅', label:'Training Programme' },
  { id:'classification', icon:'🏆', label:'Classification' },
  { id:'dofe',           icon:'🥾', label:'Duke of Edinburgh' },
  { id:'riskassessment', icon:'⚠️', label:'Risk Assessments' },
  { id:'promotions',     icon:'🎖️', label:'Promotions' },
  { id:'band',           icon:'🥁', label:'Band & Music' },
  { id:'shooting',       icon:'🎯', label:'Shooting Register' },
  { id:'aef',            icon:'✈️', label:'AEF & Flying' },
  { section:'COMPLIANCE & RECORDS' },
  { id:'staff',          icon:'👮', label:'Staff Register' },
  { id:'awards',         icon:'🏅', label:'Awards & Honours' },
  { id:'compliance',     icon:'🛡️', label:'Compliance' },
  { id:'safeguarding',   icon:'🧒', label:'Safeguarding' },
  { id:'audit',          icon:'📋', label:'Audit Log' },
];

const INITIAL_AUDIT = [
  { ts:'2026-06-14T09:12:00', user:'OC Harris', action:'Session started', category:'General' },
];

export default function SquadronShell({ showToast }) {
  const [page, setPage] = useState('overview');
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT);

  function addAudit(action, category = 'General', user = 'OC Harris') {
    setAuditLog(prev => [{
      ts: new Date().toISOString(),
      user,
      action,
      category,
    }, ...prev]);
  }

  function renderPage() {
    switch (page) {
      case 'overview':       return <Overview       showToast={showToast} auditLog={auditLog} navigate={setPage} />;
      case 'cadets':         return <CadetRegister  showToast={showToast} />;
      case 'applicants':     return <Applicants     showToast={showToast} />;
      case 'consents':       return <Consents       showToast={showToast} />;
      case 'parade':         return <Parade         showToast={showToast} addAudit={addAudit} />;
      case 'kit':            return <KitStores      showToast={showToast} addAudit={addAudit} />;
      case 'comms':          return <Comms          showToast={showToast} addAudit={addAudit} />;
      case 'budget':         return <Budget         showToast={showToast} addAudit={addAudit} />;
      case 'training':       return <Training       showToast={showToast} addAudit={addAudit} />;
      case 'programme':      return <Programme      showToast={showToast} addAudit={addAudit} />;
      case 'classification': return <Classification showToast={showToast} addAudit={addAudit} />;
      case 'dofe':           return <DofE           showToast={showToast} addAudit={addAudit} />;
      case 'riskassessment': return <RiskAssessment showToast={showToast} addAudit={addAudit} />;
      case 'promotions':     return <Promotions     showToast={showToast} addAudit={addAudit} />;
      case 'band':           return <Band           showToast={showToast} addAudit={addAudit} />;
      case 'shooting':       return <Shooting       showToast={showToast} addAudit={addAudit} />;
      case 'aef':            return <AEF            showToast={showToast} addAudit={addAudit} />;
      case 'staff':          return <Staff          showToast={showToast} addAudit={addAudit} />;
      case 'awards':         return <Awards         showToast={showToast} addAudit={addAudit} />;
      case 'compliance':     return <Compliance     showToast={showToast} addAudit={addAudit} />;
      case 'safeguarding':   return <Safeguarding   showToast={showToast} addAudit={addAudit} />;
      case 'audit':          return <AuditLog       auditLog={auditLog} />;
      default:               return null;
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
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 18px', background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? 'white' : 'rgba(255,255,255,0.6)', border:'none', cursor:'pointer', fontSize:13, fontWeight: active ? 700 : 500, borderLeft: active ? `3px solid ${gold}` : '3px solid transparent', fontFamily:'Barlow,sans-serif', textAlign:'left' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
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
