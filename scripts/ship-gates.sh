#!/usr/bin/env bash
# HMS 1701 — pre-commit ship-gate.
# Wired as a PreToolUse(Bash) hook. Reads the tool payload on stdin; if the
# command is a git commit/push, runs the RED standing-order checks on App.jsx
# and BLOCKS (exit 2) on any breach. All other commands pass straight through.
# Fail-open: any internal error exits 0 so the hook never wedges normal work.

payload="$(cat 2>/dev/null || true)"

# Only gate commits and pushes. Everything else: allow.
case "$payload" in
  *"git commit"*|*"git push"*) ;;
  *) exit 0 ;;
esac

# Resolve repo root (script lives in scripts/).
root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)}"
file="$root/App.jsx"
[ -f "$file" ] || exit 0

fails=""

# RED 1 — bare outline removal without focus-visible (accessibility breach)
bare="$(grep -n "focus:outline-none" "$file" 2>/dev/null | grep -vc "focus-visible:")"
[ "${bare:-0}" -gt 0 ] 2>/dev/null && fails="${fails}\n  - bare focus:outline-none without focus-visible: (${bare})"

# RED 2 — wrong colour tokens
gz="$(grep -c "text-gray-\|text-zinc-" "$file" 2>/dev/null)"
[ "${gz:-0}" -gt 0 ] 2>/dev/null && fails="${fails}\n  - text-gray-/text-zinc- present (${gz}) — this project uses text-stone-*"

# RED 3 — XSS surface
dsi="$(grep -c "dangerouslySetInnerHTML" "$file" 2>/dev/null)"
[ "${dsi:-0}" -gt 0 ] 2>/dev/null && fails="${fails}\n  - dangerouslySetInnerHTML present (${dsi})"

# RED 4 — hook declared after closeWorkflow (breaks the hooks-at-top rule)
cw="$(grep -n "const closeWorkflow" "$file" 2>/dev/null | head -1 | cut -d: -f1)"
if [ -n "${cw:-}" ]; then
  late="$(grep -n "useState\|useEffect\|useMemo" "$file" 2>/dev/null | awk -F: -v b="$cw" '$1>b' | wc -l | tr -d ' ')"
  [ "${late:-0}" -gt 0 ] 2>/dev/null && fails="${fails}\n  - ${late} hook(s) after closeWorkflow (line >${cw}) — hooks must sit in the top block"
fi

if [ -n "$fails" ]; then
  printf "🔴 HMS 1701 ship-gate: STAND DOWN — RED standing-order breach:%b\n" "$fails" >&2
  echo "Fix before commit/push, or run /ship-ready to diagnose. (This gate guards the four hard REDs only.)" >&2
  exit 2
fi

exit 0
