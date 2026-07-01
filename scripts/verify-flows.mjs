// HMS 1701 — runtime drive-through. Launches the built app in a phone
// viewport and drives real user journeys, asserting the terminal state
// actually renders (catches "builds & reviews clean but the button is dead").
// Usage: node scripts/verify-flows.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'url';
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

// ---- smoke: each newer workflow at least OPENS to its first step ----
const openChecks = [
  { group: 'Accounts & support', tile: 'Dispute a payment', expect: 'Which payment' },
  { group: 'Accounts & support', tile: 'Balance certificate', expect: 'What do you need' },
  { group: 'Accounts & support', tile: 'Devices & sessions', expect: "signed in" },
  { group: 'Payments', tile: 'Add intl. beneficiary', expect: 'overseas beneficiary' },
];
for (const c of openChecks) {
  try {
    // return home: click the close (X) if in a workflow, else reload
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    await tap(c.group);
    await tap(c.tile);
    const ok = await page.getByText(c.expect, { exact: false }).first().isVisible({ timeout: 3000 }).catch(() => false);
    rec(`opens: ${c.tile}`, ok, ok ? '' : `expected "${c.expect}"`);
  } catch (e) { rec(`opens: ${c.tile}`, false, e.message.split('\n')[0]); }
}

rec('no console/page errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();
const failed = results.filter(r => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
process.exit(failed.length ? 1 : 0);
