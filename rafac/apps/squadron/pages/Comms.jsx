import { useState } from 'react';
import { CADETS } from '../../../data/cadets.js';

const navy = '#00264D', gold = '#C8A032', muted = '#5A7090', border = '#D0DCF0';

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SENT_LOG_SEED = [
  {
    id: 'ml1', date: '2026-06-12', time: '18:30', from: 'OC Harris',
    type: 'Announcement', subject: 'Parade Night Reminder — 12 Jun 2026',
    recipients: 'All parents (9)',
    body: 'Reminder: Parade Night this Thursday at 1900hrs. Cadets to arrive by 1850hrs in No.2 dress. Any queries contact the OC.',
  },
  {
    id: 'ml2', date: '2026-06-10', time: '09:15', from: 'OC Harris',
    type: 'Consent Reminder', subject: 'Action Required: TG21 Consent — Summer Camp 2026',
    recipients: 'Mitchell, S — parent/guardian',
    body: 'Dear Parent/Guardian, Consent for Summer Camp 2026 (19–26 Jul, RAF Woodvale) is required by 21 June. Please use the Parent Portal link to complete the TG21 form.',
  },
  {
    id: 'ml3', date: '2026-06-05', time: '16:00', from: 'OC Harris',
    type: 'Event Notice', subject: 'Silver Fieldcraft — Kit List & Timings',
    recipients: 'Fieldcraft attendees (3)',
    body: 'Please find below the confirmed kit list and RV timings for Silver Fieldcraft (WSW) departing 27 Jun from Johnstone Station at 0730hrs.',
  },
  {
    id: 'ml4', date: '2026-05-28', time: '11:00', from: 'OC Harris',
    type: 'Award', subject: 'Congratulations — Thomas, M — Sergeant Promotion',
    recipients: 'Thomas, M — parent/guardian',
    body: 'We are delighted to inform you that Megan has been promoted to the rank of Sergeant. This reflects outstanding commitment and leadership.',
  },
];

const TEMPLATES = [
  {
    id: 't1', icon: '📝', name: 'Consent Reminder',
    subject: 'Action Required: Consent for [EVENT]',
    body: 'Dear Parent/Guardian of [CADET],\n\nConsent for [EVENT] on [DATE] is required by [DEADLINE].\n\nPlease complete the form via the Parent Portal link:\nhttps://1701sqn.rafac.mod.uk/portal\n\nIf you have any questions please contact the squadron office.\n\nYours sincerely,\nSqn Ldr Harris\nOfficer Commanding, 1701 (Johnstone) Sqn ATC',
  },
  {
    id: 't2', icon: '🚫', name: 'Parade Cancellation',
    subject: '1701 Sqn — Parade Night Cancelled [DATE]',
    body: 'Dear Parent/Guardian,\n\nPlease be advised that Parade Night on [DATE] has been cancelled due to [REASON].\n\nThe next scheduled parade is [NEXT DATE] at 1900hrs.\n\nApologies for any inconvenience.\n\nSqn Ldr Harris, OC 1701 Sqn',
  },
  {
    id: 't3', icon: '🪖', name: 'Event Reminder',
    subject: 'Reminder: [EVENT] — Timings & Kit',
    body: 'Dear Parent/Guardian,\n\nThis is a reminder that [CADET] is attending [EVENT] on [DATE].\n\nRV point: [LOCATION] at [TIME]. Collection: [RETURN TIME].\n\nPlease ensure kit list has been checked. Contact OC if any items are unavailable.\n\nSqn Ldr Harris, OC 1701 Sqn',
  },
  {
    id: 't4', icon: '🎒', name: 'Kit Deficiency',
    subject: 'Kit Item Required — [CADET]',
    body: 'Dear Parent/Guardian,\n\nPlease note that [CADET] requires the following before [DATE]:\n\n• [KIT ITEMS]\n\nThis is required for [REASON]. Please contact the squadron if there are any financial difficulties — support is available.\n\nSqn Ldr Harris, OC 1701 Sqn',
  },
  {
    id: 't5', icon: '🏥', name: 'Medical Information',
    subject: 'Medical Information Required — [CADET]',
    body: 'Dear Parent/Guardian,\n\nWe require up-to-date medical information for [CADET] before they can attend [EVENT].\n\nPlease complete the TG23 (Medical Declaration) via the Parent Portal at your earliest convenience.\n\nSqn Ldr Harris, OC 1701 Sqn',
  },
  {
    id: 't6', icon: '🎖️', name: 'Award / Promotion',
    subject: 'Congratulations — [CADET] — [AWARD]',
    body: 'Dear Parent/Guardian,\n\nWe are delighted to inform you that [CADET] has been awarded [AWARD].\n\nThis is a fantastic achievement reflecting their dedication and hard work. We hope you are as proud of them as we are.\n\nYours sincerely,\nSqn Ldr Harris\nOC, 1701 (Johnstone) Sqn ATC',
  },
];

const RECIPIENT_GROUPS = [
  { id: 'all-parents', label: 'All parents / guardians (9 cadets)' },
  { id: 'all-cadets',  label: 'All cadets — cadet app notification' },
  { id: 'sc-camp',     label: 'Summer Camp 2026 — attendees (4)' },
  { id: 'sc-fieldcraft', label: 'Silver Fieldcraft — attendees (3)' },
  { id: 'sc-gliding',  label: 'Gliding Scholarship — attendees (3)' },
  { id: 'staff',       label: 'Staff only' },
];

// Individual cadet parent options built from CADETS array
const CADET_PARENT_GROUPS = CADETS.map(c => ({
  id: `parent-${c.id}`,
  label: `${c.sn}, ${c.fn.charAt(0)} — parent/guardian`,
}));

const ALL_RECIPIENTS = [...RECIPIENT_GROUPS, ...CADET_PARENT_GROUPS];

// Badge colour per message type
const TYPE_BADGE = {
  'Announcement':     { bg: navy,      color: 'white' },
  'Consent Reminder': { bg: '#075985', color: 'white' },
  'Event Notice':     { bg: '#166534', color: 'white' },
  'Award':            { bg: '#5B21B6', color: 'white' },
};

function typeBadgeStyle(type) {
  return TYPE_BADGE[type] || { bg: '#5A7090', color: 'white' };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Comms({ showToast, addAudit }) {
  const [tab, setTab]               = useState('compose');
  const [sentLog, setSentLog]       = useState(SENT_LOG_SEED);
  const [form, setForm]             = useState({ to: 'all-parents', subject: '', body: '' });
  const [expandedMsg, setExpandedMsg] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // ---- helpers ----
  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function loadTemplate(tpl) {
    setActiveTemplate(tpl.id);
    setForm(prev => ({ ...prev, subject: tpl.subject, body: tpl.body }));
    setTab('compose');
  }

  function handleSend() {
    if (!form.subject.trim() || !form.body.trim()) return;
    const recipientLabel = ALL_RECIPIENTS.find(r => r.id === form.to)?.label || form.to;
    const now = new Date();
    const newMsg = {
      id: `ml${Date.now()}`,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      from: 'OC Harris',
      type: 'Announcement',
      subject: form.subject,
      recipients: recipientLabel,
      body: form.body,
    };
    setSentLog(prev => [newMsg, ...prev]);
    if (typeof addAudit === 'function') {
      addAudit({ action: `Message sent: "${form.subject}" → ${recipientLabel}`, category: 'Comms', user: 'Sqn Ldr Harris' });
    }
    if (typeof showToast === 'function') {
      showToast('📧 Message sent successfully');
    }
    setForm({ to: 'all-parents', subject: '', body: '' });
    setActiveTemplate(null);
  }

  function handleClear() {
    setForm({ to: 'all-parents', subject: '', body: '' });
    setActiveTemplate(null);
  }

  function printSentLog() {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const typeColors = {
      'Announcement':     '#00264D',
      'Consent Reminder': '#075985',
      'Event Notice':     '#166534',
      'Award':            '#5B21B6',
    };
    const rows = sentLog.map(msg => {
      const bg = typeColors[msg.type] || '#5A7090';
      const preview = (msg.body || '').slice(0, 110) + (msg.body && msg.body.length > 110 ? '…' : '');
      return `<tr>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0;white-space:nowrap;font-size:12px;color:#00264D;font-weight:700">${msg.date}</td>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0;white-space:nowrap;font-size:11px;color:#5A7090">${msg.time}</td>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0">
          <span style="background:${bg};color:white;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700;letter-spacing:0.04em">${msg.type}</span>
        </td>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0;font-size:12px;color:#0D1B2E;font-weight:600">${msg.subject}</td>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0;font-size:11px;color:#5A7090">${msg.recipients}</td>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0;font-size:11px;color:#5A7090">${msg.from}</td>
        <td style="padding:7px 9px;border-bottom:1px solid #D0DCF0;font-size:11px;color:#4A5A70;word-break:break-word">${preview}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Comms Sent Log — 1701 Sqn</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  @page { size: A4 portrait; margin: 14mm 16mm; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  body { font-family: Barlow, sans-serif; color: #00264D; margin: 0; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #00264D; color: white; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; padding: 8px 9px; text-align: left; letter-spacing: 0.04em; text-transform: uppercase; }
</style>
</head>
<body>
<div style="display:flex;align-items:center;gap:16px;border-bottom:3px solid #00264D;padding-bottom:12px;margin-bottom:20px">
  <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#00264D"/><circle cx="22" cy="22" r="12" fill="#C8A032"/><circle cx="22" cy="22" r="5" fill="#00264D"/></svg>
  <div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00264D;letter-spacing:0.03em">1701 (JOHNSTONE) SQN ATC</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:600;color:#5A7090;letter-spacing:0.06em;text-transform:uppercase">COMMUNICATIONS — SENT LOG</div>
  </div>
  <div style="margin-left:auto;text-align:right">
    <div style="font-size:11px;color:#5A7090;font-weight:600">Printed</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:#00264D">${dateStr}</div>
    <div style="font-size:10px;color:#5A7090;margin-top:2px">${sentLog.length} message${sentLog.length !== 1 ? 's' : ''}</div>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th>Date</th><th>Time</th><th>Type</th><th>Subject</th><th>Recipients</th><th>From</th><th>Message Preview</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<div style="margin-top:28px;padding-top:10px;border-top:1.5px solid #D0DCF0;display:flex;justify-content:space-between;align-items:center">
  <div style="font-size:10px;color:#5A7090">
    <strong>OFFICIAL-SENSITIVE</strong> &mdash; Parent/guardian communications &middot; DPA 2018 compliant &middot; Retain 3 years (AP 3392 Vol 1)
  </div>
  <div style="font-size:10px;color:#5A7090">1701 (Johnstone) Sqn ATC</div>
</div>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
    addAudit?.('Comms sent log printed', 'Comms', `${sentLog.length} messages`);
    showToast?.('📄 Sent log opened for print');
  }

  const canSend = form.subject.trim().length > 0 && form.body.trim().length > 0;

  // ---- tab bar styles ----
  function tabStyle(t) {
    const active = tab === t;
    return {
      padding: '8px 22px',
      border: 'none',
      borderBottom: active ? `3px solid ${navy}` : '3px solid transparent',
      background: 'transparent',
      color: active ? navy : muted,
      fontFamily: 'Barlow Condensed, sans-serif',
      fontSize: 15,
      fontWeight: active ? 800 : 600,
      cursor: 'pointer',
      transition: 'color 0.15s',
      letterSpacing: '0.02em',
    };
  }

  // ============================
  // COMPOSE TAB
  // ============================
  function renderCompose() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ background: 'white', border: `1.5px solid ${border}`, borderRadius: 10, padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 800, color: navy, marginBottom: 18 }}>
            New Message
          </div>

          {/* To */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
              To
            </label>
            <select
              value={form.to}
              onChange={e => updateForm('to', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 13, color: '#0D1B2E', background: 'white', fontFamily: 'Barlow, sans-serif', outline: 'none' }}
            >
              <optgroup label="Groups">
                {RECIPIENT_GROUPS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </optgroup>
              <optgroup label="Individual — parent / guardian">
                {CADET_PARENT_GROUPS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={e => updateForm('subject', e.target.value)}
              placeholder="Message subject…"
              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 13, color: '#0D1B2E', fontFamily: 'Barlow, sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Body */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
              Message
            </label>
            <textarea
              rows={6}
              value={form.body}
              onChange={e => updateForm('body', e.target.value)}
              placeholder="Type your message here…"
              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 13, color: '#0D1B2E', fontFamily: 'Barlow, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.55 }}
            />
          </div>

          {/* Load template pills */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Load template
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => loadTemplate(tpl)}
                  style={{
                    padding: '5px 13px',
                    borderRadius: 20,
                    border: `1.5px solid ${activeTemplate === tpl.id ? navy : border}`,
                    background: activeTemplate === tpl.id ? navy : 'white',
                    color: activeTemplate === tpl.id ? 'white' : navy,
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tpl.icon} {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleSend}
              disabled={!canSend}
              style={{
                padding: '10px 24px',
                background: canSend ? navy : '#B0BECE',
                color: 'white',
                border: 'none',
                borderRadius: 7,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 14,
                fontWeight: 800,
                cursor: canSend ? 'pointer' : 'not-allowed',
                letterSpacing: '0.03em',
                transition: 'background 0.15s',
              }}
            >
              📧 Send Message
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: navy,
                border: `1.5px solid ${border}`,
                borderRadius: 7,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // TEMPLATES TAB
  // ============================
  function renderTemplates() {
    return (
      <div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 800, color: navy, marginBottom: 14 }}>
          Message Templates
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {TEMPLATES.map(tpl => (
            <div
              key={tpl.id}
              style={{ background: 'white', border: `1.5px solid ${border}`, borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{tpl.icon}</span>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 15, fontWeight: 800, color: navy }}>{tpl.name}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: muted, fontStyle: 'italic', lineHeight: 1.4 }}>{tpl.subject}</div>
              <div style={{ fontSize: 12, color: '#4A5A70', lineHeight: 1.5, flexGrow: 1 }}>
                {tpl.body.split('\n').find(l => l.trim().length > 0) || ''}
              </div>
              <button
                onClick={() => loadTemplate(tpl)}
                style={{
                  marginTop: 6,
                  padding: '7px 14px',
                  background: navy,
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Use template →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================
  // SENT LOG TAB
  // ============================
  function renderSentLog() {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 800, color: navy }}>
            Sent Log
          </div>
          <button
            onClick={printSentLog}
            style={{ padding: '7px 14px', background: 'white', color: navy, border: `1.5px solid ${border}`, borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            📄 Print Log
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sentLog.map(msg => {
            const badge = typeBadgeStyle(msg.type);
            const isOpen = expandedMsg === msg.id;
            return (
              <div
                key={msg.id}
                style={{ background: 'white', border: `1.5px solid ${isOpen ? navy : border}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s' }}
              >
                {/* Row header */}
                <div
                  onClick={() => setExpandedMsg(isOpen ? null : msg.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', cursor: 'pointer' }}
                >
                  {/* Date/time */}
                  <div style={{ minWidth: 80, flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700, color: navy }}>{msg.date}</div>
                    <div style={{ fontSize: 11, color: muted }}>{msg.time}</div>
                  </div>

                  {/* Type badge */}
                  <span style={{
                    padding: '3px 9px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    background: badge.bg,
                    color: badge.color,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    fontFamily: 'Barlow Condensed, sans-serif',
                    letterSpacing: '0.04em',
                  }}>
                    {msg.type}
                  </span>

                  {/* Subject + recipients */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>
                      To: {msg.recipients} · From: {msg.from}
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <span style={{ color: muted, fontSize: 13, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${border}`, padding: '14px 18px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Message body
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#1A2A3A',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      background: '#F4F7FB',
                      borderRadius: 7,
                      padding: '12px 14px',
                      border: `1px solid ${border}`,
                      fontFamily: 'Barlow, sans-serif',
                    }}>
                      {msg.body}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {sentLog.length === 0 && (
            <div style={{ fontSize: 13, color: muted, padding: '20px 0' }}>No messages sent yet.</div>
          )}
        </div>
      </div>
    );
  }

  // ============================
  // MAIN RENDER
  // ============================
  return (
    <div>
      {/* Page heading */}
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800, color: navy, marginBottom: 2 }}>
        Communications
      </div>
      <div style={{ fontSize: 12, color: muted, marginBottom: 18 }}>
        Parent messages · Templates · Sent log — 1701 (Johnstone) Sqn ATC
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${border}`, marginBottom: 22, gap: 0 }}>
        <button style={tabStyle('compose')}  onClick={() => setTab('compose')}>Compose</button>
        <button style={tabStyle('templates')} onClick={() => setTab('templates')}>Templates</button>
        <button style={tabStyle('sent')}     onClick={() => setTab('sent')}>Sent Log</button>
      </div>

      {/* Tab content */}
      {tab === 'compose'   && renderCompose()}
      {tab === 'templates' && renderTemplates()}
      {tab === 'sent'      && renderSentLog()}

      {/* Footer note */}
      <div style={{ fontSize: 11, color: muted, marginTop: 22, padding: '10px 14px', background: '#F4F7FB', borderRadius: 8, border: `1px solid ${border}` }}>
        🔒 OFFICIAL-SENSITIVE · Messages sent to parents/guardians via secure channel only · GDPR DPA 2018 compliant · Retain records for 3 years
      </div>
    </div>
  );
}
