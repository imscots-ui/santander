import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', red = '#C8102E';

const CADET = { name:'Sarah Mitchell', rank:'Cadet Corporal', svc:'2408773', sqn:'1701 (Johnstone)', pts:'Leading Classification', joined:'September 2023', nextRank:'Sergeant' };

const PROGRESS = [
  { label:'Attendance this term', value:92, max:100, unit:'%', color:'#1B6B3A' },
  { label:'Badges earned', value:3, max:8, unit:'', color:gold },
  { label:'Flying hours', value:4.5, max:10, unit:'h', color:'#003087' },
  { label:'Leadership modules', value:2, max:5, unit:'', color:'#8B1A1A' },
];

const EVENTS = [
  { id:'e1', name:'Shooting (L98 & .22)', date:'14–16 Nov', location:'Bisley', status:'consent_pending', type:'AT' },
  { id:'e5', name:'Music Camp',           date:'21–23 Nov', location:'RAF Cranwell', status:'confirmed', type:'Activity' },
  { id:'e6', name:'Hill Walking Bronze',  date:'5–6 Dec',   location:'Trossachs', status:'open', type:'AT' },
];

const BADGES = [
  { name:'First Class',       awarded:'Oct 2023', icon:'🥈' },
  { name:'Leading Cadet',     awarded:'Mar 2024', icon:'🥇' },
  { name:'Blue Wing',         awarded:'Jun 2024', icon:'✈️' },
];

const RANK_LADDER = ['Cdt','LCdt','Cpl','Sgt','FS','WO'];

function ProgressBar({ value, max, color }) {
  return (
    <div style={{ height:8, background:'rgba(255,255,255,0.1)', borderRadius:4, overflow:'hidden' }}>
      <div style={{ width:`${Math.min(100, (value/max)*100)}%`, height:'100%', background:color, borderRadius:4, transition:'width 0.6s ease' }} />
    </div>
  );
}

const STATUS_MAP = {
  confirmed:       { label:'Confirmed', bg:'#D4EDDA', color:'#0F4020' },
  consent_pending: { label:'Consent pending', bg:'#FFF3CC', color:'#7A4A00' },
  open:            { label:'Spaces available', bg:'#EAF4FF', color:'#003D80' },
};

export default function CadetApp() {
  const [tab, setTab] = useState('home');

  const TAB = [
    { id:'home',   icon:'🏠', label:'Home' },
    { id:'events', icon:'📅', label:'Events' },
    { id:'quals',  icon:'🎖️', label:'Quals' },
    { id:'me',     icon:'👤', label:'Me' },
  ];

  const curRankIdx = RANK_LADDER.indexOf('Cpl');

  return (
    <div style={{ height:'100%', background:'#0D1B2E', color:'white', fontFamily:'Barlow,sans-serif', display:'flex', flexDirection:'column', maxWidth:420, margin:'0 auto', position:'relative', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#00264D 0%,#001230 100%)', padding:'20px 20px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:3 }}>1701 (Johnstone) Squadron</div>
            <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:22, fontWeight:800, letterSpacing:'0.02em' }}>{CADET.name}</div>
            <div style={{ fontSize:13, color:gold, fontWeight:600 }}>{CADET.rank}</div>
          </div>
          <div style={{ width:44, height:44, borderRadius:'50%', background:`conic-gradient(#003087 0deg 120deg,#fff 120deg 240deg,${red} 240deg 360deg)`, border:`2px solid ${gold}` }} />
        </div>

        {tab === 'home' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['Service No.', CADET.svc],['Classification', CADET.pts],['Joined', CADET.joined],['Next rank', CADET.nextRank]].map(([l,v])=>(
                <div key={l} style={{ background:'rgba(255,255,255,0.06)', borderRadius:8, padding:'10px 12px' }}>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Rank ladder */}
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:8, letterSpacing:'0.06em', textTransform:'uppercase' }}>Rank progression</div>
              <div style={{ display:'flex', gap:0, alignItems:'center' }}>
                {RANK_LADDER.map((r, i) => (
                  <div key={r} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, position:'relative' }}>
                    {i < RANK_LADDER.length - 1 && (
                      <div style={{ position:'absolute', top:9, left:'50%', width:'100%', height:2, background: i < curRankIdx ? gold : 'rgba(255,255,255,0.15)', zIndex:1 }} />
                    )}
                    <div style={{ width: i===curRankIdx ? 18 : 14, height: i===curRankIdx ? 18 : 14, borderRadius:'50%', background: i<=curRankIdx ? gold : 'rgba(255,255,255,0.15)', border: i===curRankIdx ? `3px solid rgba(200,160,50,0.4)` : 'none', zIndex:2, flexShrink:0 }} />
                    <div style={{ fontSize:8, color: i===curRankIdx ? gold : 'rgba(255,255,255,0.35)', fontWeight: i===curRankIdx ? 800 : 500, whiteSpace:'nowrap' }}>{r}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div style={{ flex:1, overflow:'auto', padding:'16px 20px' }}>

        {tab === 'home' && (
          <>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Your Progress</div>
              {PROGRESS.map(p => (
                <div key={p.label} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)' }}>{p.label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.value}{p.unit}</div>
                  </div>
                  <ProgressBar value={p.value} max={p.max} color={p.color} />
                </div>
              ))}
            </div>

            {/* Upcoming events preview */}
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Upcoming</div>
            {EVENTS.slice(0,2).map(e => {
              const st = STATUS_MAP[e.status];
              return (
                <div key={e.id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>{e.name}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>{e.date} · {e.location}</div>
                    </div>
                    <span style={{ background:st.bg, color:st.color, padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700, whiteSpace:'nowrap', marginLeft:8 }}>{st.label}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === 'events' && (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Events & Activities</div>
            {EVENTS.map(e => {
              const st = STATUS_MAP[e.status];
              return (
                <div key={e.id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:16, marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div style={{ fontSize:15, fontWeight:700 }}>{e.name}</div>
                    <span style={{ background:st.bg, color:st.color, padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700 }}>{st.label}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {[['Dates',e.date],['Location',e.location],['Type',e.type]].map(([l,v])=>(
                      <div key={l}><div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div><div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{v}</div></div>
                    ))}
                  </div>
                  {e.status === 'consent_pending' && (
                    <div style={{ marginTop:12, background:'rgba(200,160,50,0.12)', border:'1px solid rgba(200,160,50,0.25)', borderRadius:7, padding:'8px 10px', fontSize:11, color:'rgba(200,160,50,0.9)' }}>
                      ⏰ Parental consent required — remind your parent to check the Parent Portal
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {tab === 'quals' && (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Qualifications & Badges</div>
            {BADGES.map(b => (
              <div key={b.name} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:14, marginBottom:10, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontSize:32 }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{b.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Awarded {b.awarded}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:8, padding:14, background:'rgba(255,255,255,0.03)', border:'1px dashed rgba(255,255,255,0.12)', borderRadius:10, textAlign:'center' }}>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>5 more badges available to earn</div>
            </div>
          </>
        )}

        {tab === 'me' && (
          <div>
            {[['Name', CADET.name],['Service No.', CADET.svc],['Rank', CADET.rank],['Squadron', CADET.sqn],['Classification', CADET.pts],['Joined', CADET.joined]].map(([l,v])=>(
              <div key={l} style={{ padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ background:'#0A1525', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', flexShrink:0 }}>
        {TAB.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'10px 4px 12px', background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:20 }}>{t.icon}</span>
            <span style={{ fontSize:10, color: tab===t.id ? gold : 'rgba(255,255,255,0.35)', fontWeight: tab===t.id ? 700 : 400, fontFamily:'Barlow,sans-serif' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
