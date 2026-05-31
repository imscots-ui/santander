#!/usr/bin/env python3
"""Fix all standalone HTML files so they open directly from the filesystem (file://)."""
import re

# ─── 1. cadet.html ────────────────────────────────────────────────────────────
# Problems:
#  a) <script type="module" crossorigin>  → Chrome blocks module scripts on file://
#  b) <link rel="icon" href="./favicon-BuHq5HVh.svg" />  → missing file, console error
#  c) <link rel="manifest" href="./manifest-DFroslCm.json" />  → missing file, console error

with open('standalone/cadet.html', 'r', encoding='utf-8') as f:
    cadet = f.read()

# a) Strip type="module" and crossorigin from <script> tags
cadet = cadet.replace('<script type="module" crossorigin>', '<script>')
cadet = cadet.replace("<script type='module' crossorigin>", '<script>')
cadet = cadet.replace('<script type="module">', '<script>')

# b) Remove broken favicon link
cadet = re.sub(r'\s*<link rel="icon"[^>]*favicon[^>]*/>\s*', '\n    ', cadet)

# c) Remove broken manifest link
cadet = re.sub(r'\s*<link rel="manifest"[^>]*/>\s*', '\n    ', cadet)

with open('standalone/cadet.html', 'w', encoding='utf-8') as f:
    f.write(cadet)
print("cadet.html fixed ✓")

# ─── 2. Verify other files have no module scripts ─────────────────────────────
for name in ['squadron.html', 'wing.html', 'portal.html', 'join.html', 'index.html']:
    with open(f'standalone/{name}', 'r', encoding='utf-8') as f:
        txt = f.read()
    if 'type="module"' in txt:
        print(f"WARNING: {name} still has type=\"module\"")
    else:
        print(f"{name}: OK ✓")

print("\nAll fixes applied.")
