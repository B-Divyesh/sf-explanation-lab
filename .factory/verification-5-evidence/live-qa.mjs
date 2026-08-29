import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE = 'https://explanation-lab.sociobot.in';
const results = [];
const observedRequests = new Set();
const consoleErrors = [];
const pageErrors = [];

async function check(name, work) {
  try {
    const evidence = await work();
    results.push({name, result: 'PASS', evidence});
  } catch (error) {
    results.push({name, result: 'FAIL', error: error instanceof Error ? error.stack : String(error)});
  }
}

function observe(page) {
  page.on('request', (request) => observedRequests.add(request.url()));
  page.on('console', (message) => {
    const expectedMissingDocument = page.url().endsWith('/verification-5-missing') && message.text().includes('status of 404');
    if (message.type() === 'error' && !expectedMissingDocument) consoleErrors.push({url: page.url(), text: message.text()});
  });
  page.on('pageerror', (error) => pageErrors.push({url: page.url(), text: error.message}));
}

function backupItem(id, topic, overrides = {}) {
  const now = new Date().toISOString();
  return {
    id, topic, createdAt: now, updatedAt: now, status: 'draft',
    responses: {
      mechanism: {text: 'A saved explanation.'},
      boundary: {text: ''}, example: {text: ''}, counterexample: {text: ''}
    },
    ...overrides
  };
}

function backupFile(explanations) {
  return {product: 'explanation-lab', version: 1, exportedAt: new Date().toISOString(), explanations};
}

const browser = await chromium.launch({
  headless: true,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
});

await check('live demo, normal completion, and microphone cleanup', async () => {
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, permissions: ['microphone']});
  const page = await context.newPage();
  observe(page);
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...constraints) => {
      const stream = await original(...constraints);
      globalThis.qaAudioTrack = stream.getAudioTracks()[0];
      return stream;
    };
  });
  await page.goto(`${BASE}/?demo=1`, {waitUntil: 'networkidle'});
  assert.match(page.url(), /\?demo=1$/);
  assert.equal(await page.locator('.explanation-row').count(), 3);
  await page.getByText('Demo — sample data, nothing is saved to your work').waitFor();
  await page.screenshot({path: '.factory/verification-5-evidence/live-demo-desktop.png', fullPage: true});

  await page.getByRole('link', {name: 'Start another explanation'}).click();
  const topic = page.getByLabel('What do you want to explain?');
  assert.equal(await topic.getAttribute('maxlength'), '100');
  await topic.fill('ab');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByText('Name the idea in at least three characters.').waitFor();
  assert.equal(await topic.evaluate((element) => element === document.activeElement), true);
  await topic.fill('Why recursion needs a base case — live QA 5');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  const response = page.getByLabel('Your explanation');
  assert.equal(await response.getAttribute('maxlength'), '6000');
  const answers = [
    'Each call reduces the input. The base case returns and stops the chain.',
    'The input must move toward a reachable stopping condition.',
    'Factorial three calls two, then one. One returns and the calls unwind.',
    'Calling again with the same input never reaches the base case.'
  ];
  const titles = ['Explain the mechanism', 'Draw the boundary', 'Give an example', 'Find a counterexample'];
  for (let index = 0; index < answers.length; index += 1) {
    await page.getByRole('heading', {level: 2, name: titles[index]}).waitFor();
    await response.fill(answers[index]);
    if (index < 3) await page.getByRole('button', {name: 'Save and open next prompt'}).click();
  }
  await page.getByRole('button', {name: 'Finish and revisit in 7 days'}).click();
  const row = page.locator('.explanation-row').filter({hasText: 'Why recursion needs a base case — live QA 5'});
  await row.waitFor();
  assert.match(await row.innerText(), /4\/4 prompts answered/);
  const expected = new Intl.DateTimeFormat('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(Date.now() + 7 * 86_400_000));
  assert.match(await row.innerText(), new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

  await page.getByRole('button', {name: 'Reset demo'}).click();
  await page.locator('#toast').filter({hasText: 'Sample data reset'}).waitFor();
  assert.equal(await page.locator('.explanation-row').count(), 3);
  assert.equal(await page.getByText('Why recursion needs a base case — live QA 5').count(), 0);

  await page.goto(`${BASE}/?demo=1&id=sample-doppler`);
  await page.getByRole('button', {name: 'Record an audio note'}).click();
  await page.getByRole('button', {name: 'Stop and keep audio'}).waitFor();
  assert.equal(await page.evaluate(() => globalThis.qaAudioTrack?.readyState), 'live');
  await page.getByRole('link', {name: 'Library'}).click();
  assert.equal(await page.evaluate(() => globalThis.qaAudioTrack?.readyState), 'ended');
  assert.equal(await page.getByRole('button', {name: /Stop and keep audio/}).count(), 0);
  await context.close();
  return {seededRecords: 3, completedPrompts: 4, revisit: expected, microphoneAfterNavigation: 'ended'};
});

await check('live invalid input, import recovery, collision decisions, export, and delete', async () => {
  const context = await browser.newContext({viewport: {width: 1280, height: 900}});
  const page = await context.newPage();
  observe(page);
  await page.goto(`${BASE}/?demo=1`);
  await page.getByRole('button', {name: 'Start for real'}).click();
  await page.goto(`${BASE}/library`);
  await page.getByText('Your explanations will appear here.').waitFor();
  await page.getByRole('link', {name: 'Start an explanation'}).click();
  const topic = page.getByLabel('What do you want to explain?');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  assert.equal(await topic.evaluate((element) => element === document.activeElement), true);
  assert.notEqual(await topic.evaluate((element) => element.validationMessage), '');
  await topic.fill('How a queue preserves arrival order — live QA 5');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  const response = page.getByLabel('Your explanation');
  await response.fill('x'.repeat(6100));
  assert.equal((await response.inputValue()).length, 6000);
  await response.fill('New items enter at the back. Removals happen at the front.');
  await page.getByRole('button', {name: 'Save this response'}).click();
  await page.goto(`${BASE}/library`);

  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export JSON'}).click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  assert.equal(exported.product, 'explanation-lab');
  assert.equal(exported.explanations.some((item) => item.topic === 'How a queue preserves arrival order — live QA 5'), true);

  await page.locator('#import-file').setInputFiles({name: 'malformed.json', mimeType: 'application/json', buffer: Buffer.from('{bad')});
  await page.waitForFunction(() => Boolean(document.querySelector('#import-status')?.textContent?.trim()));
  const malformedMessage = (await page.locator('#import-status').textContent())?.trim();
  const invalid = backupFile([
    backupItem('qa5-valid-sibling', 'A valid sibling must stay out'),
    backupItem('qa5-invalid-date', 'An invalid date must stay out', {updatedAt: 'not-a-date'})
  ]);
  await page.locator('#import-file').setInputFiles({name: 'invalid-date.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid))});
  await page.getByRole('status').filter({hasText: 'invalid practice date'}).waitFor();
  assert.equal(await page.getByText('A valid sibling must stay out').count(), 0);
  await page.reload();
  await page.getByRole('heading', {level: 1, name: 'Your explanations'}).waitFor();
  assert.equal(await page.getByText('Invalid time value').count(), 0);

  const upload = (name, itemTopic) => page.locator('#import-file').setInputFiles({
    name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backupFile([backupItem('qa5-collision', itemTopic)])))
  });
  await upload('original.json', 'Original imported topic QA5');
  await page.getByRole('link', {name: 'Original imported topic QA5'}).waitFor();
  page.once('dialog', (dialog) => dialog.dismiss());
  await upload('skip.json', 'Skipped replacement topic QA5');
  await page.locator('#toast').filter({hasText: 'Skipped 1 matching explanation'}).waitFor();
  assert.equal(await page.getByRole('link', {name: 'Original imported topic QA5'}).count(), 1);
  page.once('dialog', (dialog) => dialog.accept());
  await upload('replace.json', 'Confirmed replacement topic QA5');
  await page.locator('#toast').filter({hasText: 'Replaced 1 matching explanation'}).waitFor();
  await page.getByRole('link', {name: 'Confirmed replacement topic QA5'}).waitFor();

  const deleteButton = page.getByRole('button', {name: 'Delete How a queue preserves arrival order — live QA 5'});
  page.once('dialog', (dialog) => dialog.dismiss());
  await deleteButton.click();
  assert.equal(await deleteButton.count(), 1);
  page.once('dialog', (dialog) => dialog.accept());
  await deleteButton.click();
  await page.getByText('How a queue preserves arrival order — live QA 5').waitFor({state: 'detached'});
  await context.close();
  return {emptyRequired: 'blocked and focused', topicLimit: 100, responseLimit: 6000, malformedMessage, malformedRecovery: true, atomicInvalidImport: true, duplicateSkipReplace: true, exportParsed: true, deleteCancelConfirm: true};
});

await check('microphone denial keeps text entry usable', async () => {
  const context = await browser.newContext({viewport: {width: 1280, height: 900}});
  const page = await context.newPage();
  observe(page);
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Permission denied', 'NotAllowedError'); };
  });
  await page.goto(`${BASE}/?demo=1&id=sample-doppler`);
  await page.getByRole('button', {name: 'Record an audio note'}).click();
  await page.getByText('The microphone did not start. Allow microphone access or type your response.').waitFor();
  assert.equal(await page.getByLabel('Your explanation').isEditable(), true);
  await context.close();
  return {message: 'The microphone did not start. Allow microphone access or type your response.', textFallbackEditable: true};
});

await check('keyboard, mobile reflow, reduced motion, touch targets, and live axe', async () => {
  const desktop = await browser.newContext({viewport: {width: 1280, height: 900}});
  const keyboardPage = await desktop.newPage();
  observe(keyboardPage);
  await keyboardPage.goto(`${BASE}/`);
  await keyboardPage.keyboard.press('Tab');
  assert.equal(await keyboardPage.getByRole('link', {name: 'Skip to main content'}).evaluate((element) => element === document.activeElement), true);
  await keyboardPage.keyboard.press('Enter');
  assert.equal(await keyboardPage.locator('main').evaluate((element) => element === document.activeElement), true);
  await keyboardPage.getByRole('link', {name: 'Demo'}).focus();
  await keyboardPage.keyboard.press('Enter');
  await keyboardPage.waitForURL(/\?demo=1$/);
  await keyboardPage.waitForFunction(() => document.activeElement === document.querySelector('h1'));
  assert.equal(await keyboardPage.getByRole('heading', {level: 1, name: 'Practice with sample explanations'}).evaluate((element) => element === document.activeElement), true);
  await desktop.close();

  const mobile = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce', hasTouch: true});
  const page = await mobile.newPage();
  observe(page);
  const routeEvidence = [];
  for (const route of ['/', '/?demo=1', '/demo', '/practice', '/library', '/privacy', '/terms', '/visual-notes', '/verification-5-missing']) {
    const response = await page.goto(`${BASE}${route}`, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => !document.querySelector('main[aria-busy="true"]'));
    const h1 = await page.locator('h1').count();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const axe = await new AxeBuilder({page}).analyze();
    const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    assert.equal(h1, 1, `${route} h1`);
    assert.ok(overflow <= 1, `${route} overflow ${overflow}`);
    assert.deepEqual(serious, [], `${route} axe`);
    routeEvidence.push({route, status: response?.status(), h1, overflow, seriousCritical: serious.length, title: await page.title()});
  }
  for (const route of ['/?demo=1', '/practice', '/privacy', '/visual-notes']) {
    await page.goto(`${BASE}${route}`);
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, `${route} 200% overflow ${overflow}`);
  }
  await page.goto(`${BASE}/`);
  const motion = await page.evaluate(() => {
    const sheet = document.querySelector('.hero-copy');
    const style = getComputedStyle(sheet);
    return {matches: matchMedia('(prefers-reduced-motion: reduce)').matches, animationName: style.animationName, transitionDuration: style.transitionDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior};
  });
  assert.equal(motion.matches, true);
  assert.equal(motion.animationName, 'none');
  const targets = [page.locator('.wordmark'), page.getByRole('navigation').getByRole('link', {name: 'Demo'}), ...(await page.locator('.site-footer a').all())];
  const sizes = [];
  for (const target of targets) {
    const box = await target.boundingBox();
    assert.ok(box && box.width >= 44 && box.height >= 44, JSON.stringify(box));
    sizes.push({width: Math.round(box.width), height: Math.round(box.height)});
  }
  await page.screenshot({path: '.factory/verification-5-evidence/live-cold-mobile-390.png', fullPage: true});
  await mobile.close();
  return {routes: routeEvidence, resizedRoutes: 4, motion, touchTargets: sizes, keyboardSkipAndRouteFocus: true};
});

await check('service worker control, offline reload, and update notice', async () => {
  const context = await browser.newContext({viewport: {width: 390, height: 844}});
  const page = await context.newPage();
  observe(page);
  await page.goto(`${BASE}/?demo=1`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, {once: true}));
  });
  await page.reload();
  assert.ok(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)));
  const cachesBefore = await page.evaluate(() => caches.keys());
  assert.ok(cachesBefore.includes('explanation-lab-shell-v4'));
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'}).waitFor();
  await page.getByRole('link', {name: 'Why a passing siren changes pitch'}).waitFor();
  await context.setOffline(false);
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', {data: {type: 'UPDATE_READY'}})));
  await page.getByRole('status').filter({hasText: 'An update is ready. Reload to use it.'}).waitFor();
  await page.getByRole('link', {name: 'Start another explanation'}).click();
  await page.waitForTimeout(4100);
  await page.getByRole('status').filter({hasText: 'An update is ready. Reload to use it.'}).waitFor();
  await page.screenshot({path: '.factory/verification-5-evidence/live-offline-mobile.png', fullPage: true});
  await context.close();
  return {controlled: true, cache: 'explanation-lab-shell-v4', offlineSampleReloaded: true, persistentUpdateNotice: true};
});

await check('all discoverable links respond', async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE}/`);
  const hrefs = [...new Set(await page.locator('a').evaluateAll((links) => links.map((link) => link.href)))];
  const statuses = [];
  for (const href of hrefs) {
    const response = await context.request.get(href);
    statuses.push({href, status: response.status()});
    assert.ok(response.status() >= 200 && response.status() < 400, `${href}: ${response.status()}`);
  }
  await context.close();
  return statuses;
});

const crossOriginRequests = [...observedRequests].filter((url) => new URL(url).origin !== BASE);
const report = {base: BASE, results, requests: [...observedRequests].sort(), crossOriginRequests, consoleErrors, pageErrors};
writeFileSync('.factory/verification-5-evidence/live-qa.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (results.some((result) => result.result === 'FAIL') || crossOriginRequests.length || consoleErrors.length || pageErrors.length) process.exitCode = 1;
