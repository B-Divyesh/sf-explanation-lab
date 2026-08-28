import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page states the job and opens a seeded demo @claim:one-click-demo', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1, name: 'Explain hard ideas in your own words'})).toBeVisible();
  await page.getByRole('link', {name: 'Try it with sample data'}).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your work')).toBeVisible();
  await expect(page.getByRole('link', {name: 'Why a passing siren changes pitch'})).toBeVisible();
  await expect(page.locator('.status-label', {hasText: 'Due now'})).toBeVisible();
});

test('demo work never appears in the real library @claim:demo-isolation', async ({page}) => {
  await page.goto('/demo');
  await page.getByRole('link', {name: 'Start another explanation'}).click();
  await page.getByLabel('What do you want to explain?').fill('Why a heap keeps its smallest value first');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await expect(page.getByRole('heading', {level: 1, name: 'Why a heap keeps its smallest value first'})).toBeVisible();
  await page.goto('/library');
  await expect(page.getByText('Why a heap keeps its smallest value first')).toHaveCount(0);
});

test('a learner can complete all four prompts and get a seven-day revisit @claim:four-part-revisit', async ({page}) => {
  await page.goto('/practice');
  await page.getByLabel('What do you want to explain?').fill('Why recursion needs a base case');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  const answers = [
    'Each call reduces the input and creates another call. The base case returns a value and stops that chain.',
    'The input must move toward a reachable stopping condition. Otherwise the call stack keeps growing.',
    'Factorial of three calls factorial of two, then one. One returns, and the earlier calls multiply the results.',
    'If factorial calls itself with the same number, it never reaches one. The mechanism fails to stop.'
  ];
  for (let index = 0; index < answers.length; index += 1) {
    await page.getByLabel('Your explanation').fill(answers[index]);
    if (index < answers.length - 1) await page.getByRole('button', {name: 'Save and open next prompt'}).click();
  }
  await page.getByRole('button', {name: 'Finish and revisit in 7 days'}).click();
  await expect(page).toHaveURL(/\/library$/);
  const row = page.locator('.explanation-row').filter({hasText: 'Why recursion needs a base case'});
  await expect(row).toContainText('4/4 prompts answered');
  const expected = new Intl.DateTimeFormat('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(Date.now() + 7 * 86_400_000));
  await expect(row).toContainText(expected);
});

test('exports local work as a readable JSON backup @claim:json-export', async ({page}) => {
  await page.goto('/practice');
  await page.getByLabel('What do you want to explain?').fill('How a queue preserves arrival order');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByLabel('Your explanation').fill('New items enter at the back. Removals happen at the front.');
  await page.getByRole('button', {name: 'Save this response'}).click();
  await page.goto('/library');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export JSON'}).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(exported.product).toBe('explanation-lab');
  expect(exported.explanations.some((item: {topic: string}) => item.topic === 'How a queue preserves arrival order')).toBeTruthy();
});

test('demo sends no cross-origin requests @claim:local-private', async ({page}) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('link', {name: 'Why a passing siren changes pitch'}).click();
  await page.getByRole('button', {name: /Boundary/}).click();
  await page.getByLabel('Your explanation').fill('A changed sample answer that remains inside the demo database.');
  await page.getByRole('button', {name: 'Save this response'}).click();
  await page.getByRole('button', {name: 'Record an audio note'}).click();
  await expect(page.getByRole('button', {name: 'Stop and keep audio'})).toBeVisible();
  await page.waitForTimeout(250);
  await page.getByRole('button', {name: 'Stop and keep audio'}).click();
  await expect(page.locator('audio')).toBeVisible();
  expect(crossOrigin).toEqual([]);
});

test('a visitor can begin without signing in or paying @claim:free-no-account', async ({page}) => {
  await page.goto('/');
  await page.getByRole('link', {name: 'Start a blank explanation'}).click();
  await expect(page.getByLabel('What do you want to explain?')).toBeEditable();
  await expect(page.getByText(/sign in|log in|payment|card number/i)).toHaveCount(0);
});

test('imports a valid Explanation Lab JSON backup @claim:json-import', async ({page}) => {
  await page.goto('/library');
  const now = new Date().toISOString();
  const backup = {
    product: 'explanation-lab', version: 1, exportedAt: now,
    explanations: [{
      id: 'imported-test', topic: 'How a hash table finds a bucket', createdAt: now, updatedAt: now, status: 'draft',
      responses: {mechanism: {text: 'The hash maps a key to a bucket index.'}, boundary: {text: ''}, example: {text: ''}, counterexample: {text: ''}}
    }]
  };
  await page.locator('#import-file').setInputFiles({name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup))});
  await expect(page.getByRole('link', {name: 'How a hash table finds a bucket'})).toBeVisible();
});

test('app reloads with sample data while offline @claim:offline-reload', async ({page, context}) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {once: true}));
  });
  await page.reload();
  await expect(page.getByRole('link', {name: 'Why a passing siren changes pitch'})).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Why a passing siren changes pitch'})).toBeVisible();
  await context.setOffline(false);
});

test('main routes have no serious accessibility violations @a11y', async ({page}, testInfo) => {
  for (const route of ['/', '/demo', '/practice', '/library', '/privacy', '/terms', '/missing-page']) {
    await page.goto(route);
    const headings = await page.locator('h1').count();
    expect(headings, `${route} has one h1`).toBe(1);
    const results = await new AxeBuilder({page}).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious, `${route}: ${serious.map((item) => `${item.id}: ${item.help}`).join(', ')}`).toEqual([]);
  }
  await testInfo.attach('accessibility-routes', {body: 'Checked /, /demo, /practice, /library, /privacy, /terms, and /missing-page with axe.', contentType: 'text/plain'});
});

test('the 390px layout keeps primary controls inside the viewport @claim:mobile-ready', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only layout check');
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Try it with sample data'})).toBeInViewport();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.goto('/demo?id=sample-doppler');
  await expect(page.getByLabel('Your explanation')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
