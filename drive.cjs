const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fillOTP(page) {
  // Click into first OTP box and paste all 6 digits — triggers the paste handler
  const firstInput = await page.$('input[aria-label="Digit 1"]');
  if (!firstInput) { console.log('OTP input not found'); return false; }
  await firstInput.click({ clickCount: 3 });
  await sleep(100);
  // Use clipboard paste approach via evaluate to fire React onChange with multi-digit value
  await page.evaluate(() => {
    const input = document.querySelector('input[aria-label="Digit 1"]');
    if (!input) return;
    // Simulate paste of 6 digits
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, '123456');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await sleep(500);
  const filled = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input[aria-label^="Digit"]')];
    return inputs.filter(i => i.value !== '').length;
  });
  console.log('OTP boxes filled:', filled);
  return filled === 6;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/root/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome',
    args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'], headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('button', { timeout: 30000 });
  await sleep(500);

  console.log('\n=== TEST 1: OTP on Approve Sign ===');
  // Click Approve/Sign tab
  await page.$$eval('button', btns => {
    const b = btns.find(b => b.textContent.replace(/\d+/g,'').trim() === 'Sign');
    if (b) b.click();
  });
  await sleep(600);
  // Click first "Sign with" button
  const signClicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Sign with'));
    if (b) { b.click(); return true; } return false;
  });
  console.log('Sign button clicked:', signClicked);
  await sleep(600);
  await page.screenshot({ path: '/tmp/ss_otp_1a.png' });
  const otp1Visible = await page.evaluate(() => document.body.innerText.includes("Verify it's you"));
  console.log('OTP sheet visible:', otp1Visible);

  if (otp1Visible) {
    const filled = await fillOTP(page);
    await sleep(300);
    // Click Confirm
    const confirmClicked = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Confirm');
      if (b) { b.click(); return true; }
      const btnTexts = [...document.querySelectorAll('button')].map(b => b.textContent.trim()).join(' | ');
      console.log('Buttons:', btnTexts);
      return false;
    });
    console.log('Confirm clicked:', confirmClicked);
    await sleep(2000);
    await page.screenshot({ path: '/tmp/ss_otp_1b.png' });
    const otp1Gone = await page.evaluate(() => !document.body.innerText.includes("Verify it's you"));
    console.log('OTP dismissed:', otp1Gone);
  }

  console.log('\n=== JS errors so far:', errors.length === 0 ? 'NONE' : errors.join(' | '));
  await browser.close();
  console.log('\nDONE');
})();
