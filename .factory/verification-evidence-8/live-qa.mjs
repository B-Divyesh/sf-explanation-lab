import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = 'https://explanation-lab.sociobot.in';
const evidence = '.factory/verification-evidence-8';
const report = {
  checkedAt: new Date().toISOString(),
  base,
  firstRead: {},
  flow: {},
  requests: [],
  errors: [],
  routes: [],
  mobile: [],
  pwa: {},
};

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function settled(page) {
  await page.waitForFunction(() => !document.querySelector('main[aria-busy="true"]'));
}

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
    serviceWorkers: 'block',
  });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', request => requests.push({ method: request.method(), url: request.url(), resourceType: request.resourceType() }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ url: page.url(), source: 'console', text: message.text() }); });
  page.on('pageerror', error => errors.push({ url: page.url(), source: 'pageerror', text: error.message }));

  const rootResponse = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  check(rootResponse?.status() === 200, `Root returned ${rootResponse?.status()}`);
  await settled(page);
  const heading = await page.locator('h1').innerText();
  const audience = await page.locator('.hero .lede').innerText();
  const primary = page.getByRole('link', { name: 'Try it with sample data' });
  const primaryHelp = await primary.locator('xpath=..').locator('small').innerText();
  check(heading === 'Explain hard ideas in your own words', 'Cold headline did not state the job');
  check(audience.includes('STEM and programming learners'), 'Cold screen did not name its audience');
  check(await primary.isVisible(), 'One-click sample action was not visible');
  check(primaryHelp.includes('due explanation'), 'Primary action did not explain what happens');
  report.firstRead = { heading, audience, primary: await primary.innerText(), primaryHelp, status: rootResponse.status() };
  report.flow.rootHeaders = await rootResponse.allHeaders();
  await page.screenshot({ path: `${evidence}/live-first-read-desktop.png`, fullPage: true });

  await page.keyboard.press('Tab');
  const skipText = await page.evaluate(() => document.activeElement?.textContent?.trim());
  const skipOutline = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return { style: style.outlineStyle, width: style.outlineWidth, color: style.outlineColor };
  });
  check(skipText === 'Skip to main content', `First tab focused ${skipText}`);
  check(skipOutline.style === 'solid' && Number.parseFloat(skipOutline.width) >= 3, 'Skip link lacks a designed focus outline');
  await page.keyboard.press('Enter');
  check(await page.evaluate(() => document.activeElement?.tagName) === 'MAIN', 'Skip link did not focus main');
  let openedDemoByKeyboard = false;
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab');
    const text = await page.evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, ' ').trim());
    if (text === 'Try it with sample data') {
      await page.keyboard.press('Enter');
      openedDemoByKeyboard = true;
      break;
    }
  }
  check(openedDemoByKeyboard, 'Primary demo action was not reachable by keyboard');
  await settled(page);
  check(new URL(page.url()).searchParams.get('demo') === '1', 'Demo action did not enter demo mode');
  check(await page.getByLabel('Demo mode').isVisible(), 'Persistent demo banner was missing');
  check(await page.locator('.explanation-row').count() === 3, 'Demo did not seed three sample explanations');
  report.flow.demoSeedCount = await page.locator('.explanation-row').count();
  report.flow.demoBanner = await page.getByLabel('Demo mode').innerText();
  await page.screenshot({ path: `${evidence}/live-demo-desktop.png`, fullPage: true });

  await page.getByRole('link', { name: 'Start another explanation' }).click();
  await settled(page);
  const topic = page.getByLabel('What do you want to explain?');
  await page.getByRole('button', { name: 'Open the four prompts' }).click();
  report.flow.emptyTopicInvalid = await topic.evaluate(input => !input.validity.valid && document.activeElement === input);
  check(report.flow.emptyTopicInvalid, 'Blank topic was accepted or did not focus the field');
  await topic.fill('ab');
  await page.getByRole('button', { name: 'Open the four prompts' }).click();
  check((await page.getByRole('alert').innerText()).includes('at least three'), 'Short-topic recovery message was missing');
  await topic.fill('x'.repeat(101));
  report.flow.topicLengthAfterBoundaryInput = await topic.inputValue().then(value => value.length);
  check(report.flow.topicLengthAfterBoundaryInput <= 100, 'Topic exceeded its 100-character boundary');
  await topic.fill('Why recursion needs a base case');
  await page.getByRole('button', { name: 'Open the four prompts' }).click();
  await page.waitForURL(url => url.searchParams.has('id'));
  await settled(page);
  check((await page.locator('h1').innerText()) === 'Why recursion needs a base case', 'Normal topic did not open');
  await page.getByLabel('Your explanation').focus();
  await page.keyboard.insertText('x'.repeat(6_001));
  report.flow.responseLengthAfterBoundaryInput = await page.getByLabel('Your explanation').inputValue().then(value => value.length);
  check(report.flow.responseLengthAfterBoundaryInput === 6_000, 'Response exceeded its 6,000-character boundary');
  await page.getByLabel('Your explanation').fill('');

  await page.locator('.step-tab[data-step="counterexample"]').click();
  await page.getByRole('heading', { level: 2, name: 'Find a counterexample' }).waitFor();
  await settled(page);
  await page.getByRole('button', { name: 'Finish and revisit in 7 days' }).click();
  await page.locator('#save-status').filter({ hasText: 'before finishing' }).waitFor();
  await settled(page);
  const missingMessage = await page.locator('#save-status').innerText();
  check(missingMessage.includes('before finishing'), 'Incomplete explanation did not explain recovery');
  check(await page.getByLabel('Your explanation').evaluate(element => element === document.activeElement), 'Incomplete finish did not focus the missing response');
  report.flow.incompleteFinishMessage = missingMessage;

  const answers = [
    'Each recursive call reduces the problem until a stopping condition returns a direct result.',
    'This assumes every path moves toward the stopping condition.',
    'Factorial reaches zero, returns one, and lets earlier calls multiply their results.',
    'A recursive call with no reachable base case keeps adding calls until the stack fails.',
  ];
  for (let index = 0; index < answers.length; index += 1) {
    await page.getByLabel('Your explanation').fill(answers[index]);
    if (index < answers.length - 1) {
      await page.getByRole('button', { name: 'Save and open next prompt' }).click();
      await page.locator('.step-tab[aria-current="step"] b').filter({ hasText: ['Boundary', 'Example', 'Counter'][index] }).waitFor();
      await settled(page);
    } else {
      await page.getByRole('button', { name: 'Finish and revisit in 7 days' }).click();
      await page.getByRole('heading', { level: 1, name: 'Practice with sample explanations' }).waitFor();
      await settled(page);
    }
  }
  check((await page.locator('h1').innerText()) === 'Practice with sample explanations', 'Completed explanation did not return to demo overview');
  check(await page.getByText('Why recursion needs a base case', { exact: true }).isVisible(), 'Completed explanation was not in the demo library');
  report.flow.completedDemoCount = await page.locator('.explanation-row').count();

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.locator('#toast').filter({ hasText: 'Sample data reset.' }).waitFor();
  await settled(page);
  check(await page.locator('.explanation-row').count() === 3, 'Reset demo did not restore exactly three samples');
  check(await page.getByText('Why recursion needs a base case', { exact: true }).count() === 0, 'Reset demo retained created demo work');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(url => url.pathname === '/practice' && !url.searchParams.has('demo'));
  await settled(page);
  check(new URL(page.url()).pathname === '/practice', 'Start for real did not leave the demo');
  await page.goto(`${base}/library`);
  await settled(page);
  check(await page.getByText('Your explanations will appear here.').isVisible(), 'Demo work leaked into the real library');
  report.flow.demoIsolation = true;

  const badImport = JSON.stringify({ product: 'not-explanation-lab', explanations: [] });
  await page.locator('#import-file').setInputFiles({ name: 'wrong.json', mimeType: 'application/json', buffer: Buffer.from(badImport) });
  const importError = await page.getByRole('status').innerText();
  check(importError.includes('not an Explanation Lab export'), 'Invalid import did not provide a recovery instruction');
  report.flow.invalidImportMessage = importError;

  await page.goto(`${base}/practice`);
  await settled(page);
  await page.getByLabel('What do you want to explain?').fill('How voltage drives current');
  await page.getByRole('button', { name: 'Open the four prompts' }).click();
  await page.waitForURL(url => url.pathname === '/practice' && url.searchParams.has('id'));
  await settled(page);
  await page.getByRole('button', { name: 'Record an audio note' }).click();
  await page.locator('#record-status').filter({ hasText: 'type your response' }).waitFor();
  const microphoneMessage = await page.locator('#record-status').innerText();
  check(microphoneMessage.includes('type your response'), 'Denied microphone did not preserve a text recovery path');
  report.flow.microphoneRecovery = microphoneMessage;
  await page.getByLabel('Your explanation').fill('A potential difference creates an electric field that moves charge through a conductor.');
  await page.getByRole('button', { name: 'Save this response' }).click();
  await page.locator('#save-status').filter({ hasText: 'Saved in this browser' }).waitFor();
  check((await page.locator('#save-status').innerText()).includes('Saved in this browser'), 'Save feedback was missing');
  await page.reload({ waitUntil: 'networkidle' });
  await settled(page);
  check((await page.getByLabel('Your explanation').inputValue()).includes('potential difference'), 'Saved text did not survive reload');
  report.flow.realPersistence = true;

  for (const route of ['/', '/?demo=1', '/demo', '/practice', '/library', '/privacy', '/terms', '/visual-notes', '/missing-qa8']) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await settled(page);
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
    const summary = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1: document.querySelectorAll('h1').length,
      main: document.querySelectorAll('main').length,
      missingAlt: [...document.images].filter(image => !image.hasAttribute('alt')).length,
    }));
    check(summary.lang === 'en' && summary.h1 === 1 && summary.main === 1 && summary.missingAlt === 0, `Semantic failure at ${route}`);
    check(serious.length === 0, `Axe serious/critical failure at ${route}: ${serious.map(item => item.id).join(', ')}`);
    report.routes.push({ route, status: response?.status(), ...summary, seriousCriticalAxe: serious.length });
  }

  report.requests = requests;
  report.requestOrigins = [...new Set(requests.map(request => new URL(request.url).origin))];
  check(report.requestOrigins.length === 1 && report.requestOrigins[0] === base, `Unexpected request origins: ${report.requestOrigins.join(', ')}`);
  report.errors = errors;
  report.normalRouteErrors = errors.filter(error => !new URL(error.url).pathname.includes('missing-qa8'));
  check(report.normalRouteErrors.length === 0, `Browser errors: ${JSON.stringify(report.normalRouteErrors)}`);
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const mobile = await mobileContext.newPage();
  const mobileErrors = [];
  mobile.on('console', message => { if (message.type() === 'error') mobileErrors.push(`console: ${message.text()}`); });
  mobile.on('pageerror', error => mobileErrors.push(`pageerror: ${error.message}`));
  for (const route of ['/', '/?demo=1', '/?demo=1&id=sample-doppler', '/practice', '/library', '/privacy', '/terms', '/visual-notes']) {
    await mobile.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await settled(mobile);
    await mobile.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    if (route.includes('sample-doppler')) {
      await mobile.screenshot({ path: `${evidence}/live-workbench-mobile-200pct.png`, fullPage: true });
    }
    const measurement = await mobile.evaluate(() => {
      const interactive = [...document.querySelectorAll('a, button, input, textarea, label.file-button')]
        .filter(element => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.opacity !== '0' && !element.classList.contains('sr-only');
        })
        .map(element => {
          const rect = element.getBoundingClientRect();
          return { name: element.getAttribute('aria-label') || element.textContent?.replace(/\s+/g, ' ').trim() || element.tagName, width: rect.width, height: rect.height };
        });
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        smallTargets: interactive.filter(target => target.width < 44 || target.height < 44),
        h1Visible: Boolean(document.querySelector('h1')?.getClientRects().length),
      };
    });
    check(measurement.scrollWidth - measurement.clientWidth <= 1, `Horizontal overflow at ${route}: ${measurement.scrollWidth - measurement.clientWidth}px`);
    check(measurement.smallTargets.length === 0, `Sub-44px targets at ${route}: ${JSON.stringify(measurement.smallTargets)}`);
    report.mobile.push({ route, ...measurement });
  }
  await mobile.goto(`${base}/?demo=1&id=sample-doppler`, { waitUntil: 'networkidle' });
  await settled(mobile);
  await mobile.screenshot({ path: `${evidence}/live-workbench-mobile-390.png`, fullPage: true });
  check(mobileErrors.length === 0, `Mobile browser errors: ${mobileErrors.join(' | ')}`);
  report.mobileErrors = mobileErrors;
  await mobileContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(`${base}/?demo=1&id=sample-doppler`, { waitUntil: 'networkidle' });
  await settled(reduced);
  report.reducedMotion = await reduced.evaluate(() => ({
    mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    writingAnimation: getComputedStyle(document.querySelector('.writing-sheet')).animationName,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  check(report.reducedMotion.mediaMatches && report.reducedMotion.writingAnimation === 'none', 'Reduced motion did not remove workbench animation');
  await reducedContext.close();

  const coldPwaContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const coldPwa = await coldPwaContext.newPage();
  const coldPwaFailures = [];
  const coldPwaErrors = [];
  coldPwa.on('requestfailed', request => coldPwaFailures.push({ url: request.url(), error: request.failure()?.errorText }));
  coldPwa.on('console', message => { if (message.type() === 'error') coldPwaErrors.push(message.text()); });
  coldPwa.on('pageerror', error => coldPwaErrors.push(error.message));
  await coldPwa.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await settled(coldPwa);
  await coldPwa.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  const coldCacheBeforeOffline = await coldPwa.evaluate(async () => ({
    names: await caches.keys(),
    entries: await caches.open('explanation-lab-shell-v4').then(cache => cache.keys()).then(keys => keys.map(key => new URL(key.url).pathname).sort()),
  }));
  await coldPwaContext.setOffline(true);
  await coldPwa.reload({ waitUntil: 'domcontentloaded' });
  await coldPwa.waitForTimeout(1_000);
  report.pwa.coldFirstVisitOffline = {
    cacheBeforeOffline: coldCacheBeforeOffline,
    heading: await coldPwa.locator('h1').innerText(),
    samples: await coldPwa.locator('.explanation-row').count(),
    styleSheets: await coldPwa.evaluate(() => document.styleSheets.length),
    requestFailures: coldPwaFailures,
    errors: coldPwaErrors,
  };
  report.pwa.coldFirstVisitOffline.passed = report.pwa.coldFirstVisitOffline.heading === 'Practice with sample explanations'
    && report.pwa.coldFirstVisitOffline.samples === 3
    && report.pwa.coldFirstVisitOffline.styleSheets > 0;
  await coldPwaContext.close();

  const pwaContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pwa = await pwaContext.newPage();
  const pwaErrors = [];
  pwa.on('console', message => { if (message.type() === 'error') pwaErrors.push(`console: ${message.text()}`); });
  pwa.on('pageerror', error => pwaErrors.push(`pageerror: ${error.message}`));
  await pwa.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await settled(pwa);
  await pwa.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await pwa.reload({ waitUntil: 'networkidle' });
  await settled(pwa);
  report.pwa.beforeOffline = await pwa.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
    return {
      controlled: Boolean(navigator.serviceWorker.controller),
      activeScript: registration?.active?.scriptURL,
      waiting: Boolean(registration?.waiting),
      cacheNames: await caches.keys(),
      shellEntries: await caches.open('explanation-lab-shell-v4').then(cache => cache.keys()).then(keys => keys.map(key => new URL(key.url).pathname).sort()),
    };
  });
  check(report.pwa.beforeOffline.controlled, 'Service worker did not control the live page');
  check(report.pwa.beforeOffline.activeScript === `${base}/sw.js`, 'Unexpected active service worker');
  check(report.pwa.beforeOffline.cacheNames.includes('explanation-lab-shell-v4'), 'Versioned shell cache was missing');
  await pwa.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', { data: { type: 'UPDATE_READY' } })));
  await pwa.locator('#toast').filter({ hasText: 'An update is ready. Reload to use it.' }).waitFor();
  await pwa.getByRole('link', { name: 'Start another explanation' }).click();
  await pwa.getByRole('heading', { level: 1, name: 'Start a four-part explanation' }).waitFor();
  await pwa.waitForTimeout(4_100);
  report.pwa.updateNoticePersists = (await pwa.locator('#toast').innerText()).includes('An update is ready. Reload to use it.');
  check(report.pwa.updateNoticePersists, 'Service-worker update notice did not persist across route rendering');
  await pwa.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await settled(pwa);
  await pwaContext.setOffline(true);
  await pwa.reload({ waitUntil: 'domcontentloaded' });
  await settled(pwa);
  report.pwa.offline = {
    heading: await pwa.locator('h1').innerText(),
    samples: await pwa.locator('.explanation-row').count(),
    controlled: await pwa.evaluate(() => Boolean(navigator.serviceWorker.controller)),
  };
  check(report.pwa.offline.heading === 'Practice with sample explanations' && report.pwa.offline.samples === 3, 'Offline demo reload lost its shell or sample data');
  await pwaContext.setOffline(false);
  check(pwaErrors.length === 0, `PWA browser errors: ${pwaErrors.join(' | ')}`);
  report.pwa.errors = pwaErrors;
  await pwaContext.close();

  await writeFile(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    firstRead: report.firstRead,
    flow: report.flow,
    requestOrigins: report.requestOrigins,
    requestCount: report.requests.length,
    errors: report.errors.length,
    routes: report.routes,
    mobile: report.mobile.map(({ route, scrollWidth, clientWidth, smallTargets }) => ({ route, overflow: scrollWidth - clientWidth, smallTargets: smallTargets.length })),
    reducedMotion: report.reducedMotion,
    pwa: report.pwa,
  }, null, 2));
} finally {
  await browser.close();
}
