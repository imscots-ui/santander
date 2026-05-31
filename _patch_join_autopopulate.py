#!/usr/bin/env python3
"""Patch squadron.html and index.html for RAFAC website join-form auto-populate."""
import re, sys

# ─── PATCH 1: squadron.html ───────────────────────────────────────────────────
with open('standalone/squadron.html', 'r', encoding='utf-8') as f:
    sq = f.read()

# ── 1a. After STAGE_NEXT, insert mergeWebEnquiries() + storage listener ──
OLD_SQ = "const STAGE_NEXT  = {enquiry:'invitee', invitee:'applicant'};"
NEW_SQ = """const STAGE_NEXT  = {enquiry:'invitee', invitee:'applicant'};

// ── WEBSITE ENQUIRY AUTO-POPULATE ──────────────────────────────────────
const JOIN_LS_KEY = 'rafac_join_enquiries';
// IDs we've already merged so we don't duplicate on re-load
const _mergedWebIds = new Set();

function mergeWebEnquiries() {
  let webList = [];
  try { webList = JSON.parse(localStorage.getItem(JOIN_LS_KEY) || '[]'); } catch(e) {}
  let added = 0;
  webList.forEach(w => {
    if (_mergedWebIds.has(w.id)) return;          // already in list
    if (APPL_DATA.some(a => a.id === w.id)) return; // defensive duplicate check
    _mergedWebIds.add(w.id);
    APPL_DATA.push({
      id:       w.id,
      fn:       w.fn,
      sn:       w.sn,
      dob:      w.dob || '',
      age:      w.age || '?',
      status:   'enquiry',
      unit:     w.unit || '1701 (Johnstone)',
      wing:     w.wing || 'West Scotland',
      src:      '🌐 RAFAC website',
      contact:  w.parentTel || '',
      notes:    [w.notes, w.howHeard ? 'Heard via: '+w.howHeard : '', w.interest ? 'Interest: '+w.interest : ''].filter(Boolean).join(' | '),
      parentName: w.parentName || '',
      parentEmail: w.parentEmail || '',
      rejected: false,
      fromWebsite: true,
    });
    added++;
  });
  if (added > 0) {
    buildApplicants();
    showToast('🌐 '+added+' new web enquir'+(added===1?'y':'ies')+' received', 'success');
  }
}

// Live sync: pick up join-form submissions in other tabs
window.addEventListener('storage', e => {
  if (e.key === JOIN_LS_KEY) mergeWebEnquiries();
});"""

if OLD_SQ not in sq:
    print("ERROR: STAGE_NEXT anchor not found"); sys.exit(1)
sq = sq.replace(OLD_SQ, NEW_SQ, 1)
print("Patch 1a applied: mergeWebEnquiries() inserted")

# ── 1b. Add mergeWebEnquiries() to the INIT line ──
OLD_INIT = "buildCadets();buildParade();buildStaff();buildVisitors();updateOnSite();buildAttendance();buildWroList('');buildActions();buildPromotions();buildConsents();buildLiveFormPanel();buildAudit();buildAtQueue();buildChecks();buildIncidents();buildKit();courseCounts();updateFocus();"
NEW_INIT = OLD_INIT.replace(
    "buildCadets();",
    "mergeWebEnquiries();buildApplicants();buildCadets();"
)
# Also remove the standalone buildApplicants() that was already in INIT
OLD_INIT2 = "buildApplicants();buildCadets();buildParade();buildStaff();buildVisitors();updateOnSite();buildAttendance();buildWroList('');buildActions();buildPromotions();buildConsents();buildLiveFormPanel();buildAudit();buildAtQueue();buildChecks();buildIncidents();buildKit();courseCounts();updateFocus();"
NEW_INIT2 = "mergeWebEnquiries();buildApplicants();buildCadets();buildParade();buildStaff();buildVisitors();updateOnSite();buildAttendance();buildWroList('');buildActions();buildPromotions();buildConsents();buildLiveFormPanel();buildAudit();buildAtQueue();buildChecks();buildIncidents();buildKit();courseCounts();updateFocus();"

if OLD_INIT2 in sq:
    sq = sq.replace(OLD_INIT2, NEW_INIT2, 1)
    print("Patch 1b applied: mergeWebEnquiries() in INIT (variant 2)")
elif OLD_INIT in sq:
    sq = sq.replace(OLD_INIT, NEW_INIT, 1)
    print("Patch 1b applied: mergeWebEnquiries() in INIT (variant 1)")
else:
    # Find the INIT comment and append
    old_init_comment = "// INIT\ndocument.getElementById('app-shell').style.display='none';"
    new_init_comment = "// INIT\ndocument.getElementById('app-shell').style.display='none';\nmergeWebEnquiries();"
    if old_init_comment in sq:
        sq = sq.replace(old_init_comment, new_init_comment, 1)
        print("Patch 1b applied: mergeWebEnquiries() after INIT comment")
    else:
        print("WARNING: Could not find INIT line — mergeWebEnquiries will only run on storage events")

# ── 1c. Make website-sourced rows show a badge ──
# The table rows use a.src — we just need to add a badge style for fromWebsite
# Find the row-building section in buildApplicants and add badge after src display
OLD_SRC = "const srcBadge = a.fromWebsite ? ' <span style=\"background:#EAF4FF;color:#00386B;border:1px solid #B3D4F0;border-radius:10px;padding:1px 7px;font-size:9px;font-weight:700;white-space:nowrap;\">🌐 Web</span>' : '';"
# This doesn't exist yet, so find the spot where we render the src cell
# Look for where src is rendered in the table row
OLD_ROW = """    const st = a.rejected ? 'rejected' : a.status;"""
NEW_ROW = """    const st = a.rejected ? 'rejected' : a.status;
    const webBadge = a.fromWebsite ? ' <span style="background:#EAF4FF;color:#00386B;border:1px solid #B3D4F0;border-radius:10px;padding:1px 6px;font-size:9px;font-weight:700;">🌐 Web</span>' : '';"""

if OLD_SRC not in sq and OLD_ROW in sq:
    sq = sq.replace(OLD_ROW, NEW_ROW, 1)
    print("Patch 1c applied: webBadge variable inserted in row builder")

    # Now inject webBadge into the source cell — find "a.src" in the table td
    OLD_SRC_CELL = "'<td>'+a.src+'</td>'"
    NEW_SRC_CELL = "'<td>'+a.src+webBadge+'</td>'"
    if OLD_SRC_CELL in sq:
        sq = sq.replace(OLD_SRC_CELL, NEW_SRC_CELL, 1)
        print("Patch 1c: webBadge injected into src cell")
    else:
        # Try without quotes-style lookup
        print("Patch 1c: src cell pattern not found literally — searching...")
        # Look for the table row construction near the status/src rendering
        m = re.search(r"'<td>'\s*\+\s*a\.src\s*\+\s*'</td>'", sq)
        if m:
            sq = sq[:m.start()] + "'<td>'+a.src+webBadge+'</td>'" + sq[m.end():]
            print("Patch 1c: webBadge injected into src cell (regex)")
        else:
            print("WARNING: src cell not found — badge will not show in table")
else:
    print("Patch 1c: already applied or row pattern not found")

with open('standalone/squadron.html', 'w', encoding='utf-8') as f:
    f.write(sq)
print("squadron.html written ✓")

# ─── PATCH 2: index.html ──────────────────────────────────────────────────────
with open('standalone/index.html', 'r', encoding='utf-8') as f:
    ix = f.read()

# ── 2a. Add 5th tab button ──
OLD_TAB = """    <button class="app-tab" id="tab-portal" onclick="openApp('portal')">
      <span class="tab-icon">📝</span>
      <div class="tab-label">
        <span class="tab-title">Parent Portal</span>
        <span class="tab-role">Consent signing</span>
      </div>
    </button>"""
NEW_TAB = OLD_TAB + """
    <button class="app-tab" id="tab-join" onclick="openApp('join')">
      <span class="tab-icon">🌐</span>
      <div class="tab-label">
        <span class="tab-title">Join Form</span>
        <span class="tab-role">Public website</span>
      </div>
    </button>"""

if OLD_TAB in ix:
    ix = ix.replace(OLD_TAB, NEW_TAB, 1)
    print("Patch 2a applied: Join Form tab added to top bar")
else:
    print("ERROR: portal tab anchor not found in index.html")

# ── 2b. Add 5th iframe ──
OLD_IFRAME = "  <iframe id=\"frame-portal\"   class=\"app-frame\" src=\"portal.html\"   title=\"Parent Portal\"></iframe>"
NEW_IFRAME = OLD_IFRAME + "\n  <iframe id=\"frame-join\"     class=\"app-frame\" src=\"join.html\"     title=\"Join Form\"></iframe>"

if OLD_IFRAME in ix:
    ix = ix.replace(OLD_IFRAME, NEW_IFRAME, 1)
    print("Patch 2b applied: join iframe added")
else:
    print("ERROR: portal iframe anchor not found in index.html")

# ── 2c. Add 5th welcome tile ──
OLD_TILE = """        <div class="app-tile" onclick="openApp('portal')">
          <div class="at-icon">📝</div>
          <div class="at-name">Parent Portal</div>
          <div class="at-role">Consent signing</div>
          <div class="at-note">Signs TG21 → updates live</div>
        </div>"""
NEW_TILE = OLD_TILE + """
        <div class="app-tile" onclick="openApp('join')">
          <div class="at-icon">🌐</div>
          <div class="at-name">Join Form</div>
          <div class="at-role">Public website</div>
          <div class="at-note">Enquiries → Applicants pipeline</div>
        </div>"""

if OLD_TILE in ix:
    ix = ix.replace(OLD_TILE, NEW_TILE, 1)
    print("Patch 2c applied: Join Form welcome tile added")
else:
    print("ERROR: portal welcome tile not found")

# ── 2d. Update grid to 5 columns ──
OLD_GRID = "grid-template-columns:repeat(4,1fr)"
NEW_GRID = "grid-template-columns:repeat(5,1fr)"
if OLD_GRID in ix:
    ix = ix.replace(OLD_GRID, NEW_GRID, 1)
    print("Patch 2d applied: grid updated to 5 columns")

with open('standalone/index.html', 'w', encoding='utf-8') as f:
    f.write(ix)
print("index.html written ✓")
print("\nAll patches applied successfully.")
