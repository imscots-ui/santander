// HMS 1701 — runtime drive-through. Launches the built app in a phone
// viewport and drives real user journeys, asserting the terminal state
// actually renders (catches "builds & reviews clean but the button is dead").
// Usage: node scripts/verify-flows.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = 'file://' + path.join(root, 'dist', 'index.html');
const shot = (n) => path.join('/tmp/claude-0/-home-user-santander/329ae9bf-d5a8-553e-9af3-6de874d5eef9/scratchpad', n);

const results = [];
const rec = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} · ${name}${detail ? ' · ' + detail : ''}`); };

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const consoleErrors = [];
// Ignore cosmetic resource failures (Google Fonts can't load over file://) —
// only real JS exceptions matter.
const cosmetic = /Failed to load resource|ERR_CONNECTION|net::|fonts\.g(oogle|static)/i;
page.on('console', m => { if (m.type() === 'error' && !cosmetic.test(m.text())) consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(800);

// 0 — app mounts (some known home text present)
const mounted = await page.getByText('Santander').first().isVisible().catch(() => false);
rec('app mounts (mobile shell)', mounted);
await page.screenshot({ path: shot('vf-home.png') });

// helper: click first visible element containing exact-ish text
async function tap(text, opts = {}) {
  const el = page.getByText(text, { exact: false }).first();
  await el.waitFor({ state: 'visible', timeout: 6000 });
  await el.click({ timeout: 8000, ...opts });
  await page.waitForTimeout(400);
}
// Click the actual <button> that contains the given text (avoids clicking an
// inert text node inside a card).
async function tapButton(text) {
  const btn = page.locator('button', { hasText: text }).first();
  await btn.waitFor({ state: 'visible', timeout: 6000 });
  await btn.click({ timeout: 8000 });
  await page.waitForTimeout(300);
}

// ---- WAGES → Sign & send (the flow whose button was dead in this shell) ----
try {
  await tap('Payments');            // expand the accordion group
  await tap('Bulk payments');       // open wages workflow
  rec('wages: opened', true);
  // step 0 — pick a source account (click the actual button), then Continue
  await tapButton('Operating');
  await tap('Continue');
  // step 1 — payees are pre-selected (9/10); go straight on
  await tap('Continue');
  // step 2 — review, Continue
  await tap('Continue');
  // step 3 — Sign & send
  await tap('Sign & send');
  // ASSERT the paymentPending overlay actually rendered in this shell
  const overlay = await page.getByText(/Confirm payment|Sending payment|PSR cancel window/i).first()
    .isVisible({ timeout: 3000 }).catch(() => false);
  rec('wages: Sign & send fires the confirm overlay', overlay, overlay ? '' : 'overlay did NOT render — the reported bug');
  await page.screenshot({ path: shot('vf-signsend.png') });
} catch (e) {
  rec('wages: Sign & send flow', false, e.message.split('\n')[0]);
  await page.screenshot({ path: shot('vf-signsend-fail.png') });
}

// ---- SMOKE: every accordion-reachable workflow opens to its first step ----
// (lending/unlink/ringfence/mtd-submit use non-accordion entry points and
//  are not in this smoke path — noted, not silently dropped.)
const smoke = [
  { group: 'Payments', tile: 'Bulk payments', expect: 'Source account' },
  { group: 'Payments', tile: 'International', expect: 'International payment' },
  { group: 'Payments', tile: 'Add intl. beneficiary', expect: 'Who are you paying' },
  { group: 'Payments', tile: 'Standing orders', expect: 'Recurring payments' },
  { group: 'Business & people', tile: 'Change mandate', expect: 'What change' },
  { group: 'Business & people', tile: 'Business details', expect: 'What needs updating' },
  { group: 'Business & people', tile: 'ID register', expect: 'Signatory ID register' },
  { group: 'Accounts & support', tile: 'Dormant accounts', expect: 'Dormant accounts' },
  { group: 'Accounts & support', tile: 'Close account', expect: 'Which accounts' },
  { group: 'Accounts & support', tile: 'Log complaint', expect: 'Complaint intake' },
  { group: 'Accounts & support', tile: 'Dispute a payment', expect: 'Which payment' },
  { group: 'Accounts & support', tile: 'Balance certificate', expect: 'What do you need' },
  { group: 'Accounts & support', tile: 'Devices & sessions', expect: 'signed in' },
];
let opened = 0;
for (const c of smoke) {
  try {
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    await tap(c.group);
    await tap(c.tile);
    const ok = await page.getByText(c.expect, { exact: false }).first().isVisible({ timeout: 3000 }).catch(() => false);
    if (ok) opened++;
    rec(`opens: ${c.tile}`, ok, ok ? '' : `expected "${c.expect}"`);
  } catch (e) { rec(`opens: ${c.tile}`, false, e.message.split('\n')[0]); }
}
rec(`smoke: ${opened}/${smoke.length} workflows open`, opened === smoke.length);

// ---- AXE: real WCAG audit (home + one open workflow) ----
const axeSrc = readFileSync(path.join(root, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
async function axeScan(label) {
  await page.evaluate(axeSrc);
  const r = await page.evaluate(async () => await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  }));
  const serious = r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  // color-contrast needs a design decision (muted palette + gradient/opacity
  // surfaces axe can't resolve) — surface it as a WARN, don't fail the run on it.
  const hard = serious.filter(v => v.id !== 'color-contrast');
  const contrast = serious.find(v => v.id === 'color-contrast');
  const detail = hard.slice(0, 5).map(v => `${v.id}(${v.nodes.length})`).join(', ');
  rec(`a11y (${label}): no actionable WCAG violations`, hard.length === 0, detail);
  if (contrast) console.log(`WARN · a11y (${label}): color-contrast on ${contrast.nodes.length} node(s) — needs a design pass`);
  return { hard, contrast };
}
await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(500);
await axeScan('home');
await tap('Accounts & support'); await tap('Devices & sessions'); await page.waitForTimeout(400);
await axeScan('trusted workflow');

rec('no console/page errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();
const failed = results.filter(r => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
process.exit(failed.length ? 1 : 0);
