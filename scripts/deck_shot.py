#!/usr/bin/env python3
"""
Screenshot a .pptx slide via deck_to_html.py + headless Chromium — with the
viewport blind spot fixed.

Chromium in this sandbox paints ~90-100px LESS than --window-size claims and
pads the rest of the .png with white; a naive 1280x720 shot silently leaves
the bottom strip of the slide unverified (footers, last tile row). This
wrapper renders at height+160 and crops to the exact slide size, so the whole
slide is genuinely painted and checked.

Usage:  python3 scripts/deck_shot.py <deck.pptx> <slide_index> <out.png>
"""
import subprocess, sys, os, tempfile

CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
W, H = 1280, 720          # deck_to_html.py output size (13.33x7.5in @ 96dpi)
PAD = 160                 # sandbox Chromium under-paints ~90-100px; 160 is margin

deck, idx, out = sys.argv[1], sys.argv[2], sys.argv[3]
html = tempfile.NamedTemporaryFile(suffix='.html', delete=False)
here = os.path.dirname(os.path.abspath(__file__))
subprocess.run([sys.executable, os.path.join(here, 'deck_to_html.py'), deck, idx],
               stdout=html, check=True)
html.close()
subprocess.run([CHROME, '--headless', '--no-sandbox', '--disable-gpu',
                '--hide-scrollbars', f'--window-size={W},{H + PAD}',
                f'--screenshot={out}', f'file://{html.name}'],
               check=True, capture_output=True)
os.unlink(html.name)

from PIL import Image
im = Image.open(out)
if im.size != (W, H):
    im.crop((0, 0, W, H)).save(out)
# hard fail if the bottom strip still came back unpainted (all-white row 715)
px = Image.open(out).convert('RGB').load()
row = {px[x, H - 5] for x in range(0, W, 64)}
if row == {(255, 255, 255)}:
    sys.exit(f'PAINT CHECK FAILED: bottom strip of {deck} s{idx} is blank white — '
             f'raise PAD in deck_shot.py')
print(f'WROTE {out} ({W}x{H}, full-height paint verified)')
