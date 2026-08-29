import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = 'https://explanation-lab.sociobot.in';
const results = { startedAt: new Date().toISOString(), checks: {}, requests: [], responses: [], console: [], pageErrors: [], axe: {}, findings: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const check = (name, value = true) => { results.checks[name] = value; };

async function tabTo(page, matcher, limit = 50) {
  const current = await page.evaluate(() => {
    const element = document.activeElement;
    return { text: element?.textContent?.trim() ?? '', id: element?.id ?? '', name: element?.getAttribute('aria-label') ?? '', tag: element?.tagName ?? '' };
  });
  if (matcher(current)) return current;
  for (let index = 0; index < limit; index += 1) {
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => {
      const element = document.activeElement;
      return { text: element?.textContent?.trim() ?? '', id: element?.id ?? '', name: element?.getAttribute('aria-label') ?? '', tag: element?.tagName ?? '' };
    });
    if (matcher(active)) return active;
  }
  throw new Error('Keyboard target was not reached');
}

async function main() {
  const browser = await chromium.launch({headless: true, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']});
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, permissions: ['microphone']});
  const page = await context.newPage();
  page.on('request', request => results.requests.push({method: request.method(), url: request.url(), type: request.resourceType()}));
  page.on('response', async response => {
    if (['document', 'script', 'stylesheet', 'manifest'].includes(response.request().resourceType()) || response.url().endsWith('/sw.js')) {
      results.responses.push({url: response.url(), status: response.status(), headers: await response.allHeaders()});
    }
  });
  page.on('console', message => results.console.push({type: message.type(), text: message.text()}));
  page.on('pageerror', error => results.pageErrors.push(error.message));

  const first = await page.goto(`${base}/`, {waitUntil: 'networkidle'});
  assert(first?.status() === 200, 'Landing did not return 200');
  const firstRead = await page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
    intro: document.querySelector('.lede')?.textContent?.trim(),
    primary: document.querySelector('.hero-actions a')?.textContent?.trim(),
    primaryNote: document.querySelector('.hero-actions small')?.textContent?.trim(),
    facts: [...document.querySelectorAll('.plain-facts li')].map(node => node.textContent?.trim()),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));
  assert(firstRead.h1.length === 1 && firstRead.h1[0] === 'Explain hard ideas in your own words', 'First-read job is unclear');
  assert(firstRead.intro?.includes('STEM and programming learners'), 'First-read audience is unclear');
  assert(firstRead.primary === 'Try it with sample data' && firstRead.primaryNote?.startsWith('Opens'), 'First action is unclear');
  check('firstRead', firstRead);
  await page.screenshot({path: '.factory/verification-evidence/live-landing-desktop.png', fullPage: true});

  await page.getByRole('link', {name: 'Try it with sample data'}).click();
  await page.getByRole('link', {name: 'Why a passing siren changes pitch'}).waitFor();
  assert((await page.getByText('Demo — sample data, nothing is saved to your work').count()) === 1, 'Demo banner missing');
  assert((await page.locator('.explanation-row').count()) === 3, 'Demo did not seed three explanations');
  check('oneClickDemo', {url: page.url(), rows: 3});
  await page.screenshot({path: '.factory/verification-evidence/live-demo-desktop.png', fullPage: true});

  await page.getByRole('link', {name: 'Start another explanation'}).click();
  const topic = page.getByLabel('What do you want to explain?');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  assert(await topic.evaluate(input => input === document.activeElement && input.validity.valueMissing), 'Empty topic was not blocked/focused');
  await topic.focus();
  await page.keyboard.insertText('x'.repeat(101));
  assert((await topic.inputValue()).length === 100, 'Topic maxlength did not enforce 100 characters');
  await topic.fill('');
  await topic.fill('ab');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  assert((await page.getByRole('alert').textContent())?.includes('at least three characters'), 'Short topic lacks recovery message');
  await topic.fill('How induction creates current');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByLabel('Your explanation').focus();
  await page.keyboard.insertText('x'.repeat(6001));
  assert((await page.getByLabel('Your explanation').inputValue()).length === 6000, 'Response maxlength did not enforce 6000 characters');
  await page.getByLabel('Your explanation').fill('A changing magnetic flux induces an electric field that can drive current through a closed conductor.');
  await page.getByRole('button', {name: 'Save and open next prompt'}).click();
  await page.getByRole('button', {name: /Counter/}).click();
  await page.getByRole('button', {name: /Finish and revisit/}).click();
  await page.getByRole('heading', {level: 2, name: 'Draw the boundary'}).waitFor();
  assert((await page.locator('#save-status').textContent())?.includes('before finishing'), 'Missing-answer recovery live-region message absent');
  for (const [tab, answer] of [
    ['Boundary', 'The conductor must form a closed path for a sustained current.'],
    ['Example', 'Moving a magnet through a coil changes flux and lights a connected lamp.'],
    ['Counter', 'A stationary magnet near a stationary coil does not create a continuing current.']
  ]) {
    await page.getByRole('button', {name: new RegExp(tab)}).click();
    await page.getByLabel('Your explanation').fill(answer);
    await page.getByRole('button', {name: 'Save this response'}).click();
  }
  await page.getByRole('button', {name: /Finish and revisit/}).click();
  await page.getByRole('link', {name: 'How induction creates current'}).waitFor();
  const rowText = await page.getByRole('link', {name: 'How induction creates current'}).locator('xpath=../..').textContent();
  assert(rowText?.includes('4/4 prompts answered'), 'Completed explanation is not 4/4');
  const expectedRevisit = new Intl.DateTimeFormat('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(Date.now() + 7 * 86_400_000));
  assert(rowText?.includes(expectedRevisit), `Expected exact seven-day revisit ${expectedRevisit}`);
  check('normalAndRecoveryFlow', {topic: 'How induction creates current', rowText: rowText?.trim(), expectedRevisit, topicLimit: 100, responseLimit: 6000});

  await page.getByRole('link', {name: 'How induction creates current'}).click();
  await page.getByRole('button', {name: /Explain/}).click();
  await page.getByRole('button', {name: 'Record an audio note'}).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', {name: 'Stop and keep audio'}).click();
  await page.locator('audio').waitFor();
  check('microphoneRecording', {audioControls: await page.locator('audio').count()});

  await page.getByRole('button', {name: 'Reset demo'}).click();
  await page.getByRole('link', {name: 'Why a passing siren changes pitch'}).waitFor();
  assert((await page.getByText('How induction creates current').count()) === 0, 'Reset retained custom demo record');
  assert((await page.locator('.explanation-row').count()) === 3, 'Reset did not restore samples');
  await page.getByRole('button', {name: 'Start for real'}).click();
  await page.waitForURL('**/practice');
  assert(new URL(page.url()).pathname === '/practice', 'Start for real did not enter real workspace');
  await page.goto(`${base}/library`);
  assert((await page.getByText('How induction creates current').count()) === 0, 'Demo record leaked into real data');
  check('demoResetIsolation', true);

  await page.goto(`${base}/practice`);
  await page.getByLabel('What do you want to explain?').fill('Why empty sets are subsets');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByLabel('Your explanation').fill('Every element of the empty set belongs to any set because there is no counterexample element.');
  await page.getByRole('button', {name: 'Save this response'}).click();
  await page.goto(`${base}/library`);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export JSON'}).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  assert(exported.explanations.some(item => item.topic === 'Why empty sets are subsets'), 'Export omitted saved topic');
  await page.locator('#import-file').setInputFiles({name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{bad')});
  assert((await page.locator('#import-status').textContent())?.includes('not valid JSON'), 'Malformed import lacks recovery');
  const original = exported.explanations.find(item => item.topic === 'Why empty sets are subsets');
  assert(Boolean(original), 'Exported real item missing');
  const invalid = {...exported, explanations: [{...original, id: 'invalid-live-date', topic: 'Invalid date must stay out', updatedAt: 'not-a-date'}]};
  await page.locator('#import-file').setInputFiles({name: 'invalid-date.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid))});
  await page.getByText(/invalid practice date/i).waitFor();
  assert((await page.getByText('Invalid date must stay out').count()) === 0, 'Invalid dated record was partially imported');

  const replacement = {...exported, explanations: [{...original, topic: 'Replacement should require consent'}]};
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#import-file').setInputFiles({name: 'skip-duplicate.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(replacement))});
  await page.getByText(/Skipped 1 matching explanation/).waitFor();
  assert((await page.getByText('Replacement should require consent').count()) === 0, 'Dismissed duplicate replaced existing work');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-file').setInputFiles({name: 'replace-duplicate.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(replacement))});
  await page.getByText(/Replaced 1 matching explanation/).waitFor();
  await page.getByRole('link', {name: 'Replacement should require consent'}).waitFor();
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', {name: 'Delete Replacement should require consent'}).click();
  await page.getByRole('link', {name: 'Replacement should require consent'}).waitFor();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', {name: 'Delete Replacement should require consent'}).click();
  await page.getByRole('link', {name: 'Replacement should require consent'}).waitFor({state: 'detached'});
  check('exportImportDeleteRecovery', {product: exported.product, version: exported.version, explanations: exported.explanations.length, malformedRejected: true, invalidDateAtomic: true, duplicateSkipAndReplace: true, deleteCancelAndConfirm: true});

  const routeData = {};
  for (const route of ['/', '/?demo=1', '/demo', '/practice', '/library', '/privacy', '/terms', '/visual-notes', '/missing-verification-route']) {
    const response = await page.goto(`${base}${route}`, {waitUntil: 'networkidle'});
    const axe = await new AxeBuilder({page}).analyze();
    const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
    routeData[route] = {
      status: response?.status(), title: await page.title(), h1: await page.locator('h1').allTextContents(),
      main: await page.locator('main').count(), overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      seriousCritical: serious.map(item => item.id)
    };
    assert(routeData[route].h1.length === 1 && routeData[route].main === 1, `${route} landmark/heading failure`);
    assert(serious.length === 0, `${route} has serious/critical axe findings`);
  }
  results.axe.desktop = routeData;
  results.expectedConsole = results.console.filter(item => item.type === 'error' && item.text.includes('status of 404'));
  results.console = results.console.filter(item => !(item.type === 'error' && item.text.includes('status of 404')));

  await page.goto(`${base}/?demo=1`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, {once: true}));
  });
  await page.reload({waitUntil: 'networkidle'});
  const sw = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return {controlled: Boolean(navigator.serviceWorker.controller), scope: registration.scope, caches: await caches.keys()};
  });
  assert(sw.controlled && sw.caches.includes('explanation-lab-shell-v4'), 'Service worker not controlling/cached');
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', {data: {type: 'UPDATE_READY'}})));
  await page.getByText('An update is ready. Reload to use it.').waitFor();
  await page.getByRole('link', {name: 'How a JavaScript closure remembers state'}).click();
  await page.waitForTimeout(4100);
  assert((await page.getByText('An update is ready. Reload to use it.').count()) === 1, 'Update notice did not persist through route render');
  await page.goto(`${base}/?demo=1`);
  await context.setOffline(true);
  await page.reload({waitUntil: 'domcontentloaded'});
  await page.getByRole('link', {name: 'Why a passing siren changes pitch'}).waitFor();
  const offline = {title: await page.title(), url: page.url(), rows: await page.locator('.explanation-row').count()};
  await page.screenshot({path: '.factory/verification-evidence/live-offline-desktop.png', fullPage: false});
  await context.setOffline(false);
  check('serviceWorkerOfflineAndUpdate', {sw, updateNoticePersistent: true, offline});

  const keyboard = await browser.newContext({viewport: {width: 1280, height: 800}});
  const keyboardPage = await keyboard.newPage();
  await keyboardPage.goto(`${base}/`);
  await keyboardPage.keyboard.press('Tab');
  assert((await keyboardPage.evaluate(() => document.activeElement?.textContent?.trim())) === 'Skip to main content', 'Skip link is not first');
  await keyboardPage.keyboard.press('Enter');
  assert(await keyboardPage.locator('main').evaluate(node => node === document.activeElement), 'Skip link did not focus main');
  await tabTo(keyboardPage, active => active.text === 'Try it with sample data');
  const focusStyle = await keyboardPage.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return {outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor};
  });
  assert(focusStyle.outlineStyle === 'solid' && focusStyle.outlineWidth !== '0px', 'Primary focus is not visible');
  await keyboardPage.keyboard.press('Enter');
  await keyboardPage.getByRole('heading', {name: 'Practice with sample explanations'}).waitFor();
  await tabTo(keyboardPage, active => active.text === 'Start another explanation');
  await keyboardPage.keyboard.press('Enter');
  await keyboardPage.getByRole('heading', {name: 'Start a four-part explanation'}).waitFor();
  await tabTo(keyboardPage, active => active.id === 'topic');
  await keyboardPage.keyboard.type('How a queue preserves order');
  await keyboardPage.keyboard.press('Tab');
  await keyboardPage.keyboard.press('Enter');
  await keyboardPage.getByRole('heading', {name: 'How a queue preserves order'}).waitFor();
  const keyboardAnswers = [
    'New items enter at the back and leave from the front.',
    'The ordering applies while operations use the same queue.',
    'A then B enter, so A leaves before B.',
    'Removing from the back would make the structure a stack.'
  ];
  const keyboardPrompts = ['Explain the mechanism', 'Draw the boundary', 'Give an example', 'Find a counterexample'];
  for (let index = 0; index < keyboardAnswers.length; index += 1) {
    await keyboardPage.getByRole('heading', {level: 2, name: keyboardPrompts[index]}).waitFor();
    await tabTo(keyboardPage, active => active.id === 'response');
    await keyboardPage.keyboard.type(keyboardAnswers[index]);
    const action = index < 3 ? 'Save and open next prompt' : 'Finish and revisit in 7 days';
    await tabTo(keyboardPage, active => active.text === action);
    await keyboardPage.keyboard.press('Enter');
  }
  await keyboardPage.getByRole('link', {name: 'How a queue preserves order'}).waitFor();
  const keyboardRow = await keyboardPage.getByRole('link', {name: 'How a queue preserves order'}).locator('xpath=../..').textContent();
  assert(keyboardRow?.includes('4/4 prompts answered'), 'Keyboard-only flow did not complete 4/4 prompts');
  check('keyboardOnly', {url: keyboardPage.url(), focusStyle, completedFourPrompts: true});
  await keyboard.close();

  const activeMic = await browser.newContext({viewport: {width: 1280, height: 800}, permissions: ['microphone']});
  const activeMicPage = await activeMic.newPage();
  await activeMicPage.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...constraints) => {
      const stream = await original(...constraints);
      globalThis.qaAudioTrack = stream.getAudioTracks()[0];
      return stream;
    };
  });
  await activeMicPage.goto(`${base}/?demo=1&id=sample-doppler`);
  await activeMicPage.getByRole('button', {name: /Record an audio note|Replace audio note/}).click();
  await activeMicPage.getByRole('button', {name: 'Stop and keep audio'}).waitFor();
  assert((await activeMicPage.evaluate(() => globalThis.qaAudioTrack?.readyState)) === 'live', 'Microphone track did not become live');
  await activeMicPage.getByRole('link', {name: 'Library'}).click();
  assert((await activeMicPage.evaluate(() => globalThis.qaAudioTrack?.readyState)) === 'ended', 'Route navigation left microphone track live');
  check('activeMicrophoneStopsOnNavigation', true);
  await activeMic.close();

  const denied = await browser.newContext({viewport: {width: 1280, height: 800}});
  const deniedPage = await denied.newPage();
  await deniedPage.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Permission denied', 'NotAllowedError'); };
  });
  await deniedPage.goto(`${base}/?demo=1&id=sample-doppler`);
  await deniedPage.getByRole('button', {name: /audio note/}).click();
  await deniedPage.getByText(/microphone did not start/i).waitFor();
  assert(await deniedPage.getByLabel('Your explanation').isEditable(), 'Text fallback not editable after microphone denial');
  check('microphoneDeniedRecovery', true);
  await denied.close();

  const mobile = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true});
  const mobilePage = await mobile.newPage();
  const mobileRoutes = {};
  for (const route of ['/', '/?demo=1', '/?demo=1&id=sample-doppler', '/practice', '/library', '/privacy', '/terms', '/visual-notes']) {
    await mobilePage.goto(`${base}${route}`, {waitUntil: 'networkidle'});
    const serious = (await new AxeBuilder({page: mobilePage}).analyze()).violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
    mobileRoutes[route] = {
      overflow: await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      h1: await mobilePage.locator('h1').count(), seriousCritical: serious.map(item => item.id)
    };
    assert(mobileRoutes[route].overflow <= 1 && mobileRoutes[route].h1 === 1 && serious.length === 0, `Mobile route failed: ${route}`);
    await mobilePage.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    mobileRoutes[route].overflowAt200Percent = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (mobileRoutes[route].overflowAt200Percent > 1) results.findings.push({severity: 'high', id: 'QA7-01', route, finding: `200% text causes ${mobileRoutes[route].overflowAt200Percent}px horizontal overflow at 390px`});
  }
  await mobilePage.goto(`${base}/`);
  await mobilePage.screenshot({path: '.factory/verification-evidence/live-landing-mobile-390.png', fullPage: true});
  await mobilePage.goto(`${base}/?demo=1&id=sample-doppler`);
  await mobilePage.screenshot({path: '.factory/verification-evidence/live-workbench-mobile-390.png', fullPage: true});
  const targets = await mobilePage.locator('a,button,input,textarea,label.file-button').evaluateAll(nodes => nodes.filter(node => {
    const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); return !node.classList.contains('sr-only') && style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  }).map(node => { const rect = node.getBoundingClientRect(); return {name: node.getAttribute('aria-label') || node.textContent?.trim() || node.id, width: rect.width, height: rect.height}; }));
  const undersized = targets.filter(target => target.width < 44 || target.height < 44);
  if (undersized.length) results.findings.push({severity: 'medium', id: 'QA7-02', finding: 'Visible workbench touch targets below 44x44 CSS px', undersized});
  results.axe.mobile = mobileRoutes;
  check('mobileTargets', {count: targets.length, undersized});
  await mobile.close();

  const reduced = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${base}/?demo=1&id=sample-doppler`);
  const reducedStyle = await reducedPage.locator('.writing-sheet').evaluate(node => {
    const style = getComputedStyle(node); return {animationName: style.animationName, animationDuration: style.animationDuration, transitionDuration: style.transitionDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior};
  });
  assert(reducedStyle.animationName === 'none' && reducedStyle.scrollBehavior === 'auto', 'Reduced motion is not respected');
  check('reducedMotion', reducedStyle);
  await reduced.close();

  results.finishedAt = new Date().toISOString();
  results.summary = {
    crossOriginRequests: [...new Set(results.requests.map(request => request.url).filter(url => new URL(url).origin !== base))],
    consoleErrors: results.console.filter(item => item.type === 'error'),
    pageErrors: results.pageErrors
  };
  assert(results.summary.crossOriginRequests.length === 0, 'Cross-origin request observed');
  assert(results.summary.consoleErrors.length === 0 && results.pageErrors.length === 0, 'Browser errors observed');
  await writeFile('.factory/verification-evidence/live-qa.json', JSON.stringify(results, null, 2));
  await context.close();
  await browser.close();
  console.log(JSON.stringify(results.summary));
}

main().catch(async error => {
  results.failure = error.stack || String(error);
  await writeFile('.factory/verification-evidence/live-qa.json', JSON.stringify(results, null, 2));
  console.error(error);
  process.exit(1);
});
