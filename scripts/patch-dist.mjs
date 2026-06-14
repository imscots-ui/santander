// Post-build patch: strip attributes that block file:// opening in Chrome
import { readFileSync, writeFileSync } from 'fs';

const file = 'dist/index.html';
let html = readFileSync(file, 'utf8');

html = html.replace(/<script type="module"/g, '<script');
html = html.replace(/<style rel="stylesheet" crossorigin>/g, '<style>');
html = html.replace(/<link rel="icon"[^>]*>\s*/g, '');
html = html.replace(/<link rel="manifest"[^>]*>\s*/g, '');

writeFileSync(file, html);
console.log('dist/index.html patched — ready to open as file://');
