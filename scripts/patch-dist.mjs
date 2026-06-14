// Post-build patch: strip attributes that block file:// opening in Chrome
import { readFileSync, writeFileSync, renameSync, existsSync } from 'fs';

const target = process.argv[2] || 'rafac'; // 'rafac' or 'santander'

// RAFAC build produces dist/index.html → rename to dist/rafac.html
// Santander build produces dist/santander.html → patch in place
const fileMap = {
  rafac:     { src: 'dist/index.html',     dest: 'dist/rafac.html' },
  santander: { src: 'dist/santander.html', dest: 'dist/santander.html' },
};

const { src, dest } = fileMap[target];

let html = readFileSync(src, 'utf8');

// Remove type="module" and crossorigin — bundled code doesn't need module semantics
html = html.replace(/<script type="module"/g, '<script');
html = html.replace(/<style rel="stylesheet" crossorigin>/g, '<style>');

// Remove external asset links that won't exist as a standalone file
html = html.replace(/<link rel="icon"[^>]*>\s*/g, '');
html = html.replace(/<link rel="manifest"[^>]*>\s*/g, '');

writeFileSync(dest, html);
if (src !== dest) {
  // Remove the original so only the renamed file remains
  import('fs').then(({ unlinkSync }) => unlinkSync(src));
}
console.log(`${dest} patched — ready to open as file://`);
