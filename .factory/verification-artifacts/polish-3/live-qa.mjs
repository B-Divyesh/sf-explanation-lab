import {mkdirSync, writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://explanation-lab.sociobot.in';
const evidence = new URL('.', import.meta.url).pathname;
mkdirSync(evidence, {recursive: true});

const report = {base, checkedAt: new Date().toISOString(), checks: {}, routes: [], consoleErrors: [], requests: []};
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

const browser = await chromium.launch();
const desktop = await browser.newContext({viewport: {width: 1440, height: 900}});
const desktopPage = await desktop.newPage();
desktopPage.on('console', (message) => {
  if (message.type() === 'error') report.consoleErrors.push(message.text());
});
desktopPage.on('pageerror', (error) => report.consoleErrors.push(String(error)));
desktopPage.on('request', (request) => report.requests.push(request.url()));

await desktopPage.goto(`${base}/`, {waitUntil: 'networkidle'});
check(await desktopPage.getByRole('heading', {level: 1, name: 'Explain hard ideas in your own words'}).isVisible(), 'Landing headline is missing.');
check(await desktopPage.getByRole('link', {name: 'Try it with sample data'}).isVisible(), 'Landing demo action is missing.');
check(await desktopPage.getByRole('navigation').getByRole('link', {name: 'Privacy'}).isVisible(), 'Desktop header Privacy is missing.');
check((await desktopPage.title()) === 'Explanation Lab — Practice explaining hard ideas', 'Landing title is wrong.');
check((await desktopPage.locator('meta[name="description"]').getAttribute('content'))?.length > 0, 'Landing description is missing.');
check((await desktopPage.locator('link[rel="canonical"]').getAttribute('href')) === `${base}/`, 'Landing canonical is wrong.');
check((await desktopPage.locator('body').innerText()).includes('State where the idea applies'), 'Landing uses the old boundary wording.');
check(!(await desktopPage.locator('body').innerText()).includes('Draw the boundary'), 'Landing still contains the misleading boundary wording.');
await desktopPage.screenshot({path: `${evidence}/live-landing-desktop.png`, fullPage: true});
report.checks.landing = {title: await desktopPage.title(), h1: await desktopPage.locator('h1').count()};

const mobile = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true});
const mobilePage = await mobile.newPage();
mobilePage.on('console', (message) => {
  if (message.type() === 'error') report.consoleErrors.push(message.text());
});
mobilePage.on('pageerror', (error) => report.consoleErrors.push(String(error)));
await mobilePage.goto(`${base}/`, {waitUntil: 'networkidle'});
const privacy = mobilePage.getByRole('navigation').getByRole('link', {name: 'Privacy'});
check(await privacy.isVisible(), '390px header Privacy is not visible.');
const privacyBox = await privacy.boundingBox();
check((privacyBox?.width ?? 0) >= 44 && (privacyBox?.height ?? 0) >= 44, '390px header Privacy target is smaller than 44px.');
check((await overflow(mobilePage)) <= 1, '390px landing has horizontal overflow.');
await mobilePage.screenshot({path: `${evidence}/live-landing-mobile-390.png`, fullPage: true});
await privacy.click();
await mobilePage.waitForURL(`${base}/privacy`);
check((await mobilePage.title()) === 'Privacy — Explanation Lab', 'Mobile header Privacy link does not navigate to the privacy route.');
report.checks.mobileHeader = {privacyBox, overflow: await overflow(mobilePage), titleAfterClick: await mobilePage.title()};

await mobilePage.goto(`${base}/?demo=1`, {waitUntil: 'networkidle'});
check(await mobilePage.getByText('Demo — sample data, nothing is saved to your work').isVisible(), 'Demo banner is missing.');
check(await mobilePage.getByRole('button', {name: 'Reset demo'}).isVisible(), 'Demo reset control is missing.');
check(await mobilePage.getByRole('button', {name: 'Start for real'}).isVisible(), 'Demo exit control is missing.');
check(await mobilePage.getByRole('link', {name: 'Why a passing siren changes pitch'}).isVisible(), 'Demo sample is missing.');
check(await mobilePage.getByRole('link', {name: 'How a JavaScript closure remembers state'}).isVisible(), 'Demo draft is missing.');
check((await overflow(mobilePage)) <= 1, '390px demo has horizontal overflow.');
await mobilePage.screenshot({path: `${evidence}/live-demo-mobile-390.png`, fullPage: true});
const demoDatabases = await mobilePage.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
check(demoDatabases.includes('demo:explanation-lab'), 'Demo did not use the demo storage namespace.');
await mobilePage.getByRole('button', {name: 'Reset demo'}).click();
check(await mobilePage.getByRole('link', {name: 'Why binary search needs sorted data'}).isVisible(), 'Demo reset did not restore the bundled samples.');
await mobilePage.getByRole('button', {name: 'Start for real'}).click();
await mobilePage.waitForURL(`${base}/practice`);
check(await mobilePage.getByRole('heading', {level: 1, name: 'Start a four-part explanation'}).isVisible(), 'Demo exit did not open real practice.');
check((await mobilePage.getByText('Demo — sample data, nothing is saved to your work').count()) === 0, 'Demo banner remained after exit.');
report.checks.demo = {databases: demoDatabases, titleAfterExit: await mobilePage.title()};

await mobilePage.goto(`${base}/?demo=1&id=sample-doppler`, {waitUntil: 'networkidle'});
await mobilePage.getByRole('button', {name: /Boundary/}).click();
const boundaryHeading = mobilePage.getByRole('heading', {level: 2, name: 'State where the idea applies'});
await boundaryHeading.waitFor();
check(await boundaryHeading.isVisible(), 'Workbench boundary prompt was not rewritten.');
check(!(await mobilePage.locator('body').innerText()).includes('Draw the boundary'), 'Workbench still contains the misleading boundary wording.');
await mobilePage.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
check((await overflow(mobilePage)) <= 1, '200% mobile workbench has horizontal overflow.');
await mobilePage.screenshot({path: `${evidence}/live-workbench-mobile-200pct.png`, fullPage: true});
report.checks.workbench = {boundaryHeading: await mobilePage.getByRole('heading', {level: 2}).innerText(), overflowAt200: await overflow(mobilePage)};

const routeTitles = [
  ['/', 'Explanation Lab — Practice explaining hard ideas'],
  ['/?demo=1', 'Demo — Explanation Lab'],
  ['/demo', 'Demo — Explanation Lab'],
  ['/practice', 'Practice — Explanation Lab'],
  ['/library', 'Your explanations — Explanation Lab'],
  ['/privacy', 'Privacy — Explanation Lab'],
  ['/terms', 'Terms — Explanation Lab'],
  ['/visual-notes', 'Visual notes — Explanation Lab']
];
for (const [path, title] of routeTitles) {
  await desktopPage.goto(`${base}${path}`, {waitUntil: 'networkidle'});
  check((await desktopPage.title()) === title, `${path} has the wrong title.`);
  check((await desktopPage.locator('h1').count()) === 1, `${path} does not have exactly one h1.`);
  check((await desktopPage.locator('main').count()) === 1, `${path} does not have exactly one main landmark.`);
  const axe = await new AxeBuilder({page: desktopPage}).analyze();
  const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  check(serious.length === 0, `${path} has serious axe violations: ${serious.map((item) => item.id).join(', ')}`);
  report.routes.push({path, title, h1: await desktopPage.locator('h1').innerText(), seriousAxe: serious.length});
}
const normalConsoleErrors = [...report.consoleErrors];
const missing = await desktopPage.goto(`${base}/polish-3-missing`, {waitUntil: 'networkidle'});
check(missing?.status() === 404, 'Unknown route did not return HTTP 404.');
check(await desktopPage.getByRole('heading', {level: 1, name: 'We could not find this page'}).isVisible(), 'Designed 404 page is missing.');
const missingAxe = await new AxeBuilder({page: desktopPage}).analyze();
check(missingAxe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact)).length === 0, '404 has serious axe violations.');
report.checks.notFound = {status: missing?.status(), title: await desktopPage.title()};

const offline = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true});
const offlinePage = await offline.newPage();
await offlinePage.goto(`${base}/?demo=1`, {waitUntil: 'networkidle'});
await offlinePage.evaluate(async () => {
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) {
    await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, {once: true}));
  }
});
await offlinePage.reload({waitUntil: 'networkidle'});
await offline.setOffline(true);
await offlinePage.reload({waitUntil: 'domcontentloaded'});
const offlineSample = offlinePage.getByRole('link', {name: 'Why a passing siren changes pitch'});
await offlineSample.waitFor();
check(await offlineSample.isVisible(), 'Offline demo reload did not retain the sample.');
await offlinePage.screenshot({path: `${evidence}/live-offline-demo-mobile.png`, fullPage: true});
report.checks.offline = {title: await offlinePage.title(), sampleVisible: true};

check(normalConsoleErrors.length === 0, `Console errors on normal routes: ${normalConsoleErrors.join(' | ')}`);
const foreignRequests = report.requests.filter((url) => new URL(url).origin !== base);
check(foreignRequests.length === 0, `Unexpected cross-origin requests: ${foreignRequests.join(', ')}`);
report.checks.privacy = {requestCount: report.requests.length, foreignRequests};
report.checks.normalConsoleErrors = normalConsoleErrors;

await desktop.close();
await mobile.close();
await offline.close();
await browser.close();
writeFileSync(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
