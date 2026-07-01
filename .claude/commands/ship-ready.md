# Ship-Ready Inspection

You are conducting the pre-sailing inspection of HMS 1701. Nothing leaves the dock until every station reports green.

Work through each station in order. Report each as GREEN, AMBER, or RED. A single RED means the ship does not sail — fix it first.

---

## STATION 1 — Architecture (XO checks)

```bash
# Hook placement
grep -n "useState\|useEffect\|useMemo" App.jsx | awk -F: '$1 > 120 {print}' | head -10
# If any output → RED (hook outside top section)

# No hooks in closures — manual review needed
grep -n "const render\|const Home\|const Approve\|const Audit\|const MTD\|const Statement\|const.*Sheet" App.jsx | head -20
```

Report: Hook discipline [GREEN/RED]

---

## STATION 2 — Security Officer checks

```bash
# XSS
grep -n "dangerouslySetInnerHTML" App.jsx && echo "FOUND" || echo "CLEAR"

# Secrets
grep -in "password\s*=\|api_key\s*=\|secret\s*=" App.jsx | grep -v "//.*" && echo "FOUND" || echo "CLEAR"

# Bare outline removal
grep -n "focus:outline-none" App.jsx | grep -v "focus-visible:" && echo "ACCESSIBILITY RISK" || echo "CLEAR"
```

Report: Security [GREEN/AMBER/RED]

---

## STATION 3 — Engineer checks

```bash
# Missing keys in maps — only considers maps that render JSX (an opening tag appears
# in the 8-line window) and lack a key. Skips data-transform maps and tolerates keys
# placed several lines below the .map( call.
grep -n "\.map(" App.jsx | while IFS=: read -r ln _; do
  win=$(sed -n "${ln},$((ln+8))p" App.jsx)
  echo "$win" | grep -q "<[A-Za-z]" || continue          # skip data-transform maps
  echo "$win" | grep -q "key=" || echo "Line $ln: render map without key"
done | head -10

# Always-on intervals — flag only setInterval without a clearInterval cleanup nearby
grep -n "setInterval" App.jsx | while IFS=: read -r ln _; do
  sed -n "${ln},$((ln+4))p" App.jsx | grep -q "clearInterval" || echo "Line $ln: setInterval without cleanup"
done
# Any output → RED (interval must live in useEffect with a clearInterval teardown)

# Build health
npm run build 2>&1 | grep -E "error|Error|✓|built in" | tail -10
```

Report: Engineering [GREEN/AMBER/RED]

> **Map-key check is advisory.** Confirm each remaining hit by eye before judging.
> A hit is RED **only** if a JSX element returned by the map genuinely has no `key`.
> Two legitimate exonerations (→ GREEN): (1) a data-transform map whose JSX comes
> from a *following* statement, e.g. `Math.max(...weeks.map(w => w.bal))` sitting
> just above a `return (<…>)`; (2) a render map whose key sits beyond the 8-line
> window because of intermediate `const` declarations. The interval and build
> checks are authoritative — any output there is RED.

---

## STATION 4 — Bosun checks

```bash
# Arbitrary spacing
grep -n "p-\[.*px\]\|m-\[.*px\]\|gap-\[.*px\]" App.jsx | head -5

# Wrong colour tokens
grep -n "text-gray-\|text-zinc-" App.jsx | head -5

# Multiple primary buttons (count — more than 3 in one view is a flag)
grep -c "bg-\[#DA291C\]" App.jsx
```

Report: UI/Design [GREEN/AMBER]

---

## STATION 5 — Signals checks

```bash
# Direct state mutation
grep -n "state\.\(push\|pop\|splice\)" App.jsx | head -5

# Missing deps pattern
grep -n "useMemo\|useEffect" App.jsx | head -20
```

Report: Signal integrity [GREEN/AMBER/RED]

---

## STATION 6 — Git discipline

```bash
# Uncommitted changes
git status --short

# Branch correct
git branch --show-current

# No unintended files staged
git diff --cached --name-only
```

Report: Git [GREEN/RED]

---

## STATION 7 — Final check: does it run?

```bash
timeout 15 npm run build 2>&1 | tail -5
```

Report: Build [GREEN/RED]

---

## FINAL MUSTER

Present the full station report, then one of:

> **⚓ ALL STATIONS GREEN — SHIP IS READY TO SAIL**

or

> **🔴 STATION [N] RED — SHIP STANDS DOWN: [specific issue and fix]**

Fix all RED findings before committing. AMBER findings are logged and tracked but do not prevent sailing.
