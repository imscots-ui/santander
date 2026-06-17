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
# Missing keys in maps
grep -n "\.map(" App.jsx | grep -v "key=" | head -10

# Always-on intervals
grep -n "setInterval" App.jsx

# Build health
npm run build 2>&1 | grep -E "error|Error|✓|built in" | tail -10
```

Report: Engineering [GREEN/AMBER/RED]

---

## STATION 4 — Bosun checks

```bash
# Arbitrary spacing
grep -n "p-\[.*px\]\|m-\[.*px\]\|gap-\[.*px\]" App.jsx | head -5

# Wrong colour tokens
grep -n "text-gray-\|text-zinc-" App.jsx | head -5

# Multiple primary buttons (count — more than 3 in one view is a flag)
grep -c "bg-\[#c8102e\]" App.jsx
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
