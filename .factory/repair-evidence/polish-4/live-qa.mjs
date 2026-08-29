import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync, writeFileSync} from 'node:fs';

const base = process.env.LIVE_URL ?? 'https://explanation-lab.sociobot.in';
const evidence = process.env.EVIDENCE_DIR ?? new URL('.', import.meta.url).pathname;
mkdirSync(evidence, {recursive: true});

function check(value, message) {
  if (!value) throw new Error(message);
}

async function visibleInViewport(locator, viewportHeight) {
  const box = await locator.boundingBox();
  return Boolean(box && box.x >= 0 && box.y >= 0 && box.x < 1440 && box.y < viewportHeight && box.y + box.height > 0);
}

async function waitForCount(page, selector, count) {
  await page.waitForFunction(({selector: target, count: expected}) => document.querySelectorAll(target).length === expected, {selector, count});
}

const browser = await chromium.launch({headless: true});
const report = {base, checks: {}, routes: {}, consoleErrors: [], requestOrigins: []};

try {
  const desktop = await browser.newContext({viewport: {width: 1440, height: 900}});
  const page = await desktop.newPage();
  page.on('pageerror', (error) => report.consoleErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(`console: ${message.text()}`); });
  page.on('request', (request) => {
    const origin = new URL(request.url()).origin;
    if (!report.requestOrigins.includes(origin)) report.requestOrigins.push(origin);
  });

  await page.goto(`${base}/`, {waitUntil: 'networkidle'});
  check(await page.title() === 'Explanation Lab — Practise explaining hard ideas', 'Landing title did not use the approved verb spelling.');
  check(await page.locator('meta[name="description"]').getAttribute('content') === 'Practise a mechanism, boundary, example, and counterexample. Your work stays in this browser.', 'Landing description is wrong.');
  await page.getByRole('link', {name: 'Try it with sample data'}).click();
  await page.waitForURL(`${base}/?demo=1&id=sample-doppler`);
  await page.getByLabel('Demo mode').waitFor();
  await page.getByRole('heading', {level: 1, name: 'Why a passing siren changes pitch'}).waitFor();
  const sampleAnswer = page.getByLabel('Saved sample response');
  await sampleAnswer.waitFor();
  check(await visibleInViewport(sampleAnswer, 900), 'The saved response is below the desktop first viewport.');
  await page.screenshot({path: `${evidence}/live-demo-desktop.png`});
  report.checks.oneClickDemo = true;

  await page.goto(`${base}/?demo=1&new=1`, {waitUntil: 'networkidle'});
  await page.getByLabel('What do you want to explain?').fill('Live demo route boundary probe');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByRole('navigation').getByRole('link', {name: 'Privacy'}).click();
  await page.waitForURL(`${base}/privacy?demo=1`);
  await page.getByLabel('Demo mode').waitFor();
  await page.getByRole('link', {name: 'Terms', exact: true}).last().click();
  await page.waitForURL(`${base}/terms?demo=1`);
  await page.goBack();
  await page.waitForURL(`${base}/privacy?demo=1`);
  await page.getByRole('heading', {level: 1, name: 'How Explanation Lab stores your work'}).waitFor();
  check(new URL(page.url()).searchParams.get('demo') === '1' && await page.getByLabel('Demo mode').isVisible(), 'Back left demo mode.');
  await page.goForward();
  await page.waitForURL(`${base}/terms?demo=1`);
  await page.getByRole('heading', {level: 1, name: 'Terms for this free utility'}).waitFor();
  check(new URL(page.url()).searchParams.get('demo') === '1' && await page.getByLabel('Demo mode').isVisible(), 'Forward left demo mode.');
  await page.getByRole('link', {name: 'Explanation Lab home'}).click();
  await page.waitForURL(`${base}/?demo=1`);
  await page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'}).waitFor();
  await page.getByRole('link', {name: 'Live demo route boundary probe'}).waitFor();
  await page.getByRole('button', {name: 'Reset demo'}).click();
  await waitForCount(page, '.explanation-row', 3);
  check(await page.getByText('Live demo route boundary probe').count() === 0, 'Reset demo retained the edited sample workspace.');
  await page.goto(`${base}/?demo=1&new=1`, {waitUntil: 'networkidle'});
  await page.getByLabel('What do you want to explain?').fill('Live direct-route exit probe');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.goto(`${base}/library`, {waitUntil: 'networkidle'});
  await page.getByRole('heading', {level: 1, name: 'Your explanations'}).waitFor();
  check(await page.getByLabel('Demo mode').count() === 0, 'Direct real route kept the demo banner.');
  check(await page.getByText('Live direct-route exit probe').count() === 0, 'Direct real route retained demo data.');
  await page.goto(`${base}/?demo=1`, {waitUntil: 'networkidle'});
  await page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'}).waitFor();
  await waitForCount(page, '.explanation-row', 3);
  check(await page.getByText('Live direct-route exit probe').count() === 0, 'Returning after a direct exit retained demo edits.');
  await page.getByRole('button', {name: 'Start for real'}).click();
  await page.waitForURL(`${base}/practice`);
  check(await page.getByLabel('Demo mode').count() === 0, 'Start for real kept demo mode.');
  report.checks.demoBoundaries = true;

  for (const [path, title, heading] of [
    ['/', 'Explanation Lab — Practise explaining hard ideas', 'Explain hard ideas in your own words'],
    ['/?demo=1&id=sample-doppler', 'Demo — Explanation Lab', 'Why a passing siren changes pitch'],
    ['/practice', 'Practice — Explanation Lab', 'Start a four-part explanation'],
    ['/library', 'Your explanations — Explanation Lab', 'Your explanations'],
    ['/privacy', 'Privacy — Explanation Lab', 'How Explanation Lab stores your work'],
    ['/terms', 'Terms — Explanation Lab', 'Terms for this free utility'],
    ['/visual-notes', 'Visual notes — Explanation Lab', 'How the Explanation Lab illustration was made']
  ]) {
    const response = await page.goto(`${base}${path}`, {waitUntil: 'networkidle'});
    check(response?.status() === 200, `${path} did not return 200.`);
    check(await page.title() === title, `${path} has the wrong title.`);
    const h1 = page.getByRole('heading', {level: 1, name: heading});
    await h1.waitFor();
    check(await h1.count() === 1, `${path} has the wrong h1.`);
    const axe = await new AxeBuilder({page}).analyze();
    const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    check(serious.length === 0, `${path} has serious axe violations.`);
    report.routes[path] = {status: response?.status(), title, heading, seriousAxe: serious.length};
  }
  const validRouteConsoleErrors = [...report.consoleErrors];
  check(validRouteConsoleErrors.length === 0, `Console errors on valid routes: ${validRouteConsoleErrors.join('; ')}`);
  check(report.requestOrigins.every((origin) => origin === new URL(base).origin), `Unexpected request origins: ${report.requestOrigins.join(', ')}`);
  const notFound = await page.goto(`${base}/polish-4-live-missing`, {waitUntil: 'networkidle'});
  check(notFound?.status() === 404, 'Missing route did not return HTTP 404.');
  check(await page.getByRole('heading', {level: 1, name: 'We could not find this page'}).count() === 1, 'Missing route did not show the designed recovery page.');
  report.notFoundConsoleMessages = report.consoleErrors.slice(validRouteConsoleErrors.length);
  report.consoleErrors = validRouteConsoleErrors;
  report.checks.routesMetadataAnd404 = true;
  await desktop.close();

  const mobile = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true});
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${base}/`, {waitUntil: 'networkidle'});
  await mobilePage.getByRole('link', {name: 'Try it with sample data'}).click();
  await mobilePage.waitForURL(`${base}/?demo=1&id=sample-doppler`);
  const mobileAnswer = mobilePage.getByLabel('Saved sample response');
  await mobileAnswer.waitFor();
  check(await visibleInViewport(mobileAnswer, 844), 'The saved response is below the 390px first viewport.');
  check(await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 1, 'The 390px demo overflows horizontally.');
  await mobilePage.screenshot({path: `${evidence}/live-demo-mobile-390.png`});
  report.checks.mobileFirstViewport = true;

  await mobilePage.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, {once: true}));
  });
  await mobilePage.reload({waitUntil: 'networkidle'});
  await mobile.setOffline(true);
  await mobilePage.reload({waitUntil: 'domcontentloaded'});
  await mobilePage.getByRole('heading', {level: 1, name: 'Why a passing siren changes pitch'}).waitFor();
  await mobile.setOffline(false);
  report.checks.offlineDemo = true;
  await mobile.close();
} finally {
  await browser.close();
}

writeFileSync(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
