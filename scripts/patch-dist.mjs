// Post-build patch: strip attributes that block file:// opening in Chrome
import { readFileSync, writeFileSync, copyFileSync } from 'fs';

const file = 'dist/index.html';
let html = readFileSync(file, 'utf8');

html = html.replace(/<script type="module"/g, '<script');
html = html.replace(/<style rel="stylesheet" crossorigin>/g, '<style>');
html = html.replace(/<link rel="icon"[^>]*>\s*/g, '');
html = html.replace(/<link rel="manifest"[^>]*>\s*/g, '');

writeFileSync(file, html);

// Also write a consistently-named copy for easy sharing
writeFileSync('dist/RAFAC-1701.html', html);

console.log('dist/index.html patched — ready to open as file://');
console.log('dist/RAFAC-1701.html written — send this file to users');
