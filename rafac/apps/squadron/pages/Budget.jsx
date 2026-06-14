import { useState } from 'react';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

const FY = 'Apr 2026 – Mar 2027';

const BUDGET_LINES = [
  // Income
  { id:'b1',  type:'Income',      category:'Subscriptions',   description:'Cadet annual subscriptions (9 cadets × £60)', amount:540,    date:'2026-04-01', ref:'SUB-2026-01' },
  { id:'b2',  type:'Income',      category:'Wing Grant',      description:'Annual wing capitation grant',                amount:850,    date:'2026-04-15', ref:'WING-CAP-001' },
  { id:'b3',  type:'Income',      category:'Fundraising',     description:'Remembrance Day tin collection — Nov 2025',   amount:312.50, date:'2025-11-12', ref:'FUND-001' },
  { id:'b4',  type:'Income',      category:'Equipment Grant', description:'HQ grant — radio equipment renewal',          amount:400,    date:'2026-05-01', ref:'HQAC-EQ-004' },
  // Expenditure
  { id:'b5',  type:'Expenditure', category:'Kit & Uniform',   description:'Replacement uniform items — 3 cadets',        amount:187.40, date:'2026-04-20', ref:'KIT-001' },
  { id:'b6',  type:'Expenditure', category:'Activity',        description:'Silver Fieldcraft — transport hire',           amount:95.00,  date:'2026-06-10', ref:'ACT-001' },
  { id:'b7',  type:'Expenditure', category:'Admin',           description:'Printing — consent forms and briefing packs', amount:22.15,  date:'2026-05-15', ref:'ADM-001' },
  { id:'b8',  type:'Expenditure', category:'Equipment',       description:'First aid kit restock',                       amount:48.60,  date:'2026-05-28', ref:'EQ-001' },
  { id:'b9',  type:'Expenditure', category:'Activity',        description:'Gliding Scholarship — cadet travel subsidy',  amount:120.00, date:'2026-06-01', ref:'ACT-002' },
  { id:'b10', type:'Expenditure', category:'Band',            description:'Drum heads replacement (3 side drums)',        amount:67.50,  date:'2026-06-05', ref:'BAND-001' },
];

const BUDGET_TARGETS = {
  'Subscriptions':   { income: 600,  expenditure: 0 },
  'Wing Grant':      { income: 850,  expenditure: 0 },
  'Fundraising':     { income: 400,  expenditure: 0 },
  'Equipment Grant': { income: 400,  expenditure: 0 },
  'Kit & Uniform':   { income: 0,    expenditure: 300 },
  'Activity':        { income: 0,    expenditure: 500 },
  'Admin':           { income: 0,    expenditure: 100 },
  'Equipment':       { income: 0,    expenditure: 200 },
  'Band':            { income: 0,    expenditure: 150 },
};

const BANK_BALANCE = 1847.23;
const PETTY_CASH   = 43.85;

const CAT_COLOR = {
  'Subscriptions':   '#1E40AF',
  'Wing Grant':      '#065F46',
  'Fundraising':     '#7C3AED',
  'Equipment Grant': '#00264D',
  'Kit & Uniform':   '#92400E',
  'Activity':        '#166534',
  'Admin':           '#5A7090',
  'Equipment':       '#1E40AF',
  'Band':            '#C8A032',
};

const ALL_CATEGORIES = Object.keys(CAT_COLOR);
const INCOME_CATEGORIES      = ['Subscriptions', 'Wing Grant', 'Fundraising', 'Equipment Grant'];
const EXPENDITURE_CATEGORIES = ['Kit & Uniform', 'Activity', 'Admin', 'Equipment', 'Band'];

const fmt = n => `£${Number(n).toFixed(2)}`;

const fmtDate = d => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

// ── shared styles ────────────────────────────────────────────────────────────

const card = {
  background: 'white',
  border: `1.5px solid ${border}`,
  borderRadius: 10,
  padding: '18px 20px',
};

const sectionTitle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: 15,
  fontWeight: 800,
  color: navy,
  marginBottom: 14,
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: `1.5px solid ${border}`,
  borderRadius: 7,
  fontFamily: 'Barlow, sans-serif',
  fontSize: 13,
  color: '#0D1B2E',
  boxSizing: 'border-box',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 5,
};

// ── sub-components (no hooks) ─────────────────────────────────────────────────

function StatTile({ label, value, sub, accent, mono }) {
  return (
    <div style={{ ...card, padding: '16px 18px' }}>
      <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <div style={{
        fontFamily: mono ? 'monospace' : 'Barlow Condensed, sans-serif',
        fontSize: 28,
        fontWeight: 800,
        color: accent || navy,
        letterSpacing: mono ? '0.02em' : undefined,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function CategoryBadge({ cat }) {
  const color = CAT_COLOR[cat] || muted;
  return (
    <span style={{
      background: color + '18',
      color,
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 6,
      whiteSpace: 'nowrap',
      letterSpacing: '0.04em',
    }}>{cat}</span>
  );
}

function TypeBadge({ type }) {
  const isIncome = type === 'Income';
  return (
    <span style={{
      background: isIncome ? '#D1FAE5' : '#FEE2E2',
      color: isIncome ? '#065F46' : '#991B1B',
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 6,
      whiteSpace: 'nowrap',
      letterSpacing: '0.04em',
    }}>{type}</span>
  );
}

function TableHeader({ cols }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols.map(c => c.width).join(' '),
      gap: 8,
      padding: '8px 12px',
      background: '#F5F8FF',
      borderRadius: '7px 7px 0 0',
      borderBottom: `1.5px solid ${border}`,
    }}>
      {cols.map(c => (
        <div key={c.label} style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: c.align || 'left' }}>
          {c.label}
        </div>
      ))}
    </div>
  );
}

function TableRow({ cols, row, last }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols.map(c => c.width).join(' '),
      gap: 8,
      padding: '9px 12px',
      borderBottom: last ? 'none' : `1px solid ${border}`,
      alignItems: 'center',
    }}>
      {cols.map(c => (
        <div key={c.key} style={{ fontSize: 13, color: '#0D1B2E', textAlign: c.align || 'left', ...c.style }}>
          {c.render ? c.render(row) : row[c.key]}
        </div>
      ))}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function Budget({ showToast, addAudit }) {
  const [lines, setLines]     = useState(BUDGET_LINES);
  const [tab, setTab]         = useState('summary');
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'Expenditure',
    category: 'Activity',
    description: '',
    amount: '',
    date: '2026-06-14',
    ref: '',
  });

  // ── derived ──────────────────────────────────────────────────────────────────
  const totalIncome  = lines.filter(l => l.type === 'Income').reduce((s, l) => s + l.amount, 0);
  const totalExpend  = lines.filter(l => l.type === 'Expenditure').reduce((s, l) => s + l.amount, 0);
  const netPosition  = totalIncome - totalExpend;

  // per-category actuals
  const actualByCategory = {};
  for (const l of lines) {
    actualByCategory[l.category] = (actualByCategory[l.category] || 0) + l.amount;
  }

  const incomeLines  = lines.filter(l => l.type === 'Income').sort((a, b) => b.date.localeCompare(a.date));
  const expendLines  = lines.filter(l => l.type === 'Expenditure').sort((a, b) => b.date.localeCompare(a.date));
  const allSorted    = [...lines].sort((a, b) => b.date.localeCompare(a.date));

  // ── handlers ─────────────────────────────────────────────────────────────────
  function handleAdd() {
    const amt = parseFloat(newEntry.amount);
    if (!newEntry.description.trim()) { showToast('Description is required.'); return; }
    if (isNaN(amt) || amt <= 0)       { showToast('Enter a valid amount.'); return; }
    if (!newEntry.date)               { showToast('Date is required.'); return; }

    const id = `b${Date.now()}`;
    const entry = { ...newEntry, id, amount: amt };
    setLines(prev => [...prev, entry]);
    addAudit && addAudit({ category: 'Budget', action: `Added ${entry.type} — ${entry.description} (${fmt(amt)}) [${entry.ref || 'no ref'}]` });
    showToast(`${entry.type} entry added: ${fmt(amt)}`);
    setNewEntry({ type: 'Expenditure', category: 'Activity', description: '', amount: '', date: '2026-06-14', ref: '' });
    setShowAdd(false);
  }

  // ── tab bar ───────────────────────────────────────────────────────────────────
  const TABS = ['summary', 'income', 'expenditure', 'ledger', 'audit'];
  const TAB_LABELS = { summary:'Summary', income:'Income', expenditure:'Expenditure', ledger:'Ledger', audit:'Audit Trail' };

  // ── ledger table columns ──────────────────────────────────────────────────────
  const fullCols = [
    { key:'date',        label:'Date',        width:'100px', render: r => fmtDate(r.date) },
    { key:'type',        label:'Type',        width:'110px', render: r => <TypeBadge type={r.type} /> },
    { key:'category',    label:'Category',    width:'140px', render: r => <CategoryBadge cat={r.category} /> },
    { key:'description', label:'Description', width:'1fr',   style:{ color: muted, fontSize: 12 } },
    { key:'ref',         label:'Ref',         width:'120px', style:{ fontFamily:'monospace', fontSize:11, color: muted } },
    { key:'amount',      label:'Amount',      width:'90px',  align:'right',
      render: r => (
        <span style={{ fontFamily:'monospace', fontWeight:700, color: r.type === 'Income' ? '#065F46' : '#991B1B' }}>
          {r.type === 'Income' ? '+' : '−'}{fmt(r.amount)}
        </span>
      )
    },
  ];

  const filteredCols = [
    { key:'date',        label:'Date',        width:'100px', render: r => fmtDate(r.date) },
    { key:'category',    label:'Category',    width:'150px', render: r => <CategoryBadge cat={r.category} /> },
    { key:'description', label:'Description', width:'1fr',   style:{ color: muted, fontSize: 12 } },
    { key:'ref',         label:'Ref',         width:'120px', style:{ fontFamily:'monospace', fontSize:11, color: muted } },
    { key:'amount',      label:'Amount',      width:'90px',  align:'right',
      render: r => (
        <span style={{ fontFamily:'monospace', fontWeight:700, color: navy }}>
          {fmt(r.amount)}
        </span>
      )
    },
  ];

  // ── add entry form ────────────────────────────────────────────────────────────
  const filteredCats = newEntry.type === 'Income' ? INCOME_CATEGORIES : EXPENDITURE_CATEGORIES;

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'Barlow, sans-serif' }}>

      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily:'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800, color: navy, marginBottom: 3 }}>
          Budget & Finance
        </div>
        <div style={{ fontSize: 12, color: muted }}>
          1701 (Johnstone) Squadron · Financial Year: {FY}
        </div>
      </div>

      {/* Tab bar + actions */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 18 }}>
        <div style={{ display:'flex', gap: 4, background:'white', border:`1.5px solid ${border}`, borderRadius: 9, padding: 4 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowAdd(false); }}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: 6,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                background: tab === t ? navy : 'transparent',
                color: tab === t ? 'white' : muted,
                transition: 'all 0.15s',
              }}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap: 8 }}>
          {(tab === 'income' || tab === 'expenditure') && (
            <button
              onClick={() => setShowAdd(s => !s)}
              style={{
                padding: '7px 14px',
                background: gold,
                color: navy,
                border: 'none',
                borderRadius: 7,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              + Add Entry
            </button>
          )}
          <button
            onClick={() => showToast('PDF export — available in full version')}
            style={{
              padding: '7px 14px',
              background: navy,
              color: 'white',
              border: 'none',
              borderRadius: 7,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Print / Export
          </button>
        </div>
      </div>

      {/* Add entry form */}
      {showAdd && (tab === 'income' || tab === 'expenditure') && (
        <div style={{ ...card, marginBottom: 18, borderColor: gold }}>
          <div style={{ ...sectionTitle, marginBottom: 16 }}>
            Add {tab === 'income' ? 'Income' : 'Expenditure'} Entry
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={newEntry.category}
                onChange={e => setNewEntry(p => ({ ...p, category: e.target.value }))}
                style={{ ...inputStyle }}
              >
                {filteredCats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Amount (£)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newEntry.amount}
                onChange={e => setNewEntry(p => ({ ...p, amount: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={e => setNewEntry(p => ({ ...p, date: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Description</label>
              <input
                type="text"
                placeholder="Brief description of income / expenditure"
                value={newEntry.description}
                onChange={e => setNewEntry(p => ({ ...p, description: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Reference Number</label>
              <input
                type="text"
                placeholder="e.g. ACT-003"
                value={newEntry.ref}
                onChange={e => setNewEntry(p => ({ ...p, ref: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display:'flex', gap: 10 }}>
            <button
              onClick={handleAdd}
              style={{
                padding: '8px 20px',
                background: navy,
                color: 'white',
                border: 'none',
                borderRadius: 7,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Add Entry
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: muted,
                border: `1.5px solid ${border}`,
                borderRadius: 7,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── SUMMARY TAB ─────────────────────────────────────────────────────── */}
      {tab === 'summary' && (
        <div>
          {/* Stat tiles */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            <StatTile
              label="Total Income"
              value={fmt(totalIncome)}
              sub={`${incomeLines.length} transactions`}
              accent="#065F46"
              mono
            />
            <StatTile
              label="Total Expenditure"
              value={fmt(totalExpend)}
              sub={`${expendLines.length} transactions`}
              accent="#991B1B"
              mono
            />
            <StatTile
              label="Net Position"
              value={fmt(Math.abs(netPosition))}
              sub={netPosition >= 0 ? 'Surplus' : 'Deficit'}
              accent={netPosition >= 0 ? '#065F46' : '#991B1B'}
              mono
            />
            <div style={{ ...card, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Balances
              </div>
              <div style={{ fontFamily:'monospace', fontSize: 22, fontWeight: 800, color: navy, marginBottom: 4 }}>
                {fmt(BANK_BALANCE + PETTY_CASH)}
              </div>
              <div style={{ fontSize: 11, color: muted }}>
                Bank {fmt(BANK_BALANCE)} · Cash {fmt(PETTY_CASH)}
              </div>
            </div>
          </div>

          {/* Budget breakdown by category */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* Income breakdown */}
            <div style={card}>
              <div style={sectionTitle}>Income vs Budget</div>
              {INCOME_CATEGORIES.map(cat => {
                const target  = BUDGET_TARGETS[cat]?.income || 0;
                const actual  = actualByCategory[cat] || 0;
                const pct     = target > 0 ? Math.min(actual / target, 1) : 0;
                const over    = actual > target && target > 0;
                const barColor = over ? '#C8102E' : '#065F46';
                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 5 }}>
                      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                        <CategoryBadge cat={cat} />
                      </div>
                      <div style={{ fontSize: 12, fontFamily:'monospace', color: over ? '#991B1B' : '#0D1B2E', fontWeight: 700 }}>
                        {fmt(actual)} / {fmt(target)}
                      </div>
                    </div>
                    <div style={{ background: '#F0F4FF', borderRadius: 4, height: 8, overflow:'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct * 100}%`,
                        background: barColor,
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                    {over && (
                      <div style={{ fontSize: 10, color:'#991B1B', marginTop: 3, fontWeight: 700 }}>
                        Over target by {fmt(actual - target)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Expenditure breakdown */}
            <div style={card}>
              <div style={sectionTitle}>Expenditure vs Budget</div>
              {EXPENDITURE_CATEGORIES.map(cat => {
                const target  = BUDGET_TARGETS[cat]?.expenditure || 0;
                const actual  = actualByCategory[cat] || 0;
                const pct     = target > 0 ? Math.min(actual / target, 1) : 0;
                const over    = actual > target && target > 0;
                const barColor = over ? '#C8102E' : CAT_COLOR[cat] || navy;
                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 5 }}>
                      <CategoryBadge cat={cat} />
                      <div style={{ fontSize: 12, fontFamily:'monospace', color: over ? '#991B1B' : '#0D1B2E', fontWeight: 700 }}>
                        {fmt(actual)} / {fmt(target)}
                      </div>
                    </div>
                    <div style={{ background: '#F0F4FF', borderRadius: 4, height: 8, overflow:'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct * 100}%`,
                        background: barColor,
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                    {over && (
                      <div style={{ fontSize: 10, color:'#991B1B', marginTop: 3, fontWeight: 700 }}>
                        Over budget by {fmt(actual - target)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer notice */}
          <div style={{
            background: '#F5F8FF',
            border: `1.5px solid ${border}`,
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 11,
            color: muted,
            textAlign: 'center',
          }}>
            Financial year: {FY} · Maintain all receipts for Wing audit · DPA 2018 applies to personal financial data
          </div>
        </div>
      )}

      {/* ── INCOME TAB ──────────────────────────────────────────────────────── */}
      {tab === 'income' && (
        <div style={card}>
          <div style={sectionTitle}>Income Transactions</div>
          {incomeLines.length === 0 ? (
            <div style={{ fontSize: 13, color: muted, textAlign:'center', padding: '24px 0' }}>No income entries recorded.</div>
          ) : (
            <>
              <TableHeader cols={filteredCols} />
              {incomeLines.map((row, i) => (
                <TableRow key={row.id} cols={filteredCols} row={row} last={i === incomeLines.length - 1} />
              ))}
              <div style={{
                display:'flex',
                justifyContent:'flex-end',
                borderTop: `2px solid ${border}`,
                paddingTop: 10,
                marginTop: 4,
              }}>
                <div style={{ fontSize: 13, color: muted, marginRight: 12 }}>Total Income</div>
                <div style={{ fontFamily:'monospace', fontWeight: 800, fontSize: 15, color:'#065F46' }}>
                  {fmt(totalIncome)}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── EXPENDITURE TAB ─────────────────────────────────────────────────── */}
      {tab === 'expenditure' && (
        <div style={card}>
          <div style={sectionTitle}>Expenditure Transactions</div>
          {expendLines.length === 0 ? (
            <div style={{ fontSize: 13, color: muted, textAlign:'center', padding: '24px 0' }}>No expenditure entries recorded.</div>
          ) : (
            <>
              <TableHeader cols={filteredCols} />
              {expendLines.map((row, i) => (
                <TableRow key={row.id} cols={filteredCols} row={row} last={i === expendLines.length - 1} />
              ))}
              <div style={{
                display:'flex',
                justifyContent:'flex-end',
                borderTop: `2px solid ${border}`,
                paddingTop: 10,
                marginTop: 4,
              }}>
                <div style={{ fontSize: 13, color: muted, marginRight: 12 }}>Total Expenditure</div>
                <div style={{ fontFamily:'monospace', fontWeight: 800, fontSize: 15, color:'#991B1B' }}>
                  {fmt(totalExpend)}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── LEDGER TAB ──────────────────────────────────────────────────────── */}
      {tab === 'ledger' && (
        <div style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
            <div style={sectionTitle}>Full Ledger</div>
            <div style={{ fontSize: 12, color: muted }}>{allSorted.length} entries · sorted by date descending</div>
          </div>
          <TableHeader cols={fullCols} />
          {allSorted.map((row, i) => (
            <TableRow key={row.id} cols={fullCols} row={row} last={i === allSorted.length - 1} />
          ))}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
            borderTop: `2px solid ${border}`,
            paddingTop: 12,
            marginTop: 6,
          }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 3 }}>Total In</div>
              <div style={{ fontFamily:'monospace', fontWeight: 800, color:'#065F46' }}>{fmt(totalIncome)}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 3 }}>Total Out</div>
              <div style={{ fontFamily:'monospace', fontWeight: 800, color:'#991B1B' }}>{fmt(totalExpend)}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 3 }}>Net Position</div>
              <div style={{ fontFamily:'monospace', fontWeight: 800, color: netPosition >= 0 ? '#065F46' : '#991B1B' }}>
                {netPosition >= 0 ? '+' : '−'}{fmt(Math.abs(netPosition))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIT TRAIL TAB ─────────────────────────────────────────────────── */}
      {tab === 'audit' && (
        <div style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14 }}>
            <div>
              <div style={sectionTitle}>Audit Trail</div>
              <div style={{ fontSize: 11, color: muted, marginTop: -10, marginBottom: 14 }}>
                Complete transaction record with reference numbers for Wing audit. All figures in GBP.
              </div>
            </div>
            <div style={{
              background: '#FFF7ED',
              border: '1.5px solid #FCD34D',
              borderRadius: 7,
              padding: '6px 12px',
              fontSize: 11,
              color: '#92400E',
              fontWeight: 700,
            }}>
              Wing Audit Ready
            </div>
          </div>

          {/* Audit summary box */}
          <div style={{
            background: '#F5F8FF',
            border: `1.5px solid ${border}`,
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12,
          }}>
            {[
              { label:'Financial Year',   value: FY },
              { label:'Transactions',      value: `${lines.length} entries` },
              { label:'Income',            value: fmt(totalIncome) },
              { label:'Expenditure',       value: fmt(totalExpend) },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 10, color: muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontFamily:'monospace', fontSize: 13, fontWeight: 700, color: navy }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Full table with all columns */}
          <TableHeader cols={fullCols} />
          {allSorted.map((row, i) => (
            <TableRow key={row.id} cols={fullCols} row={row} last={i === allSorted.length - 1} />
          ))}

          {/* Audit footer */}
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: 8,
            padding: '10px 14px',
            marginTop: 16,
            fontSize: 11,
            color: '#065F46',
          }}>
            <strong>Audit note:</strong> All transactions carry a unique reference number. Original receipts and supporting documentation must be retained for a minimum of 6 years in line with MOD and HMRC requirements. DPA 2018 applies to any personal financial data held.
          </div>
        </div>
      )}

    </div>
  );
}
