import {expect, test, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';

function backupItem(id: string, topic: string, overrides: Record<string, unknown> = {}) {
  const now = new Date().toISOString();
  return {
    id, topic, createdAt: now, updatedAt: now, status: 'draft',
    responses: {mechanism: {text: 'A saved explanation.'}, boundary: {text: ''}, example: {text: ''}, counterexample: {text: ''}},
    ...overrides
  };
}

function backupFile(explanations: unknown[]) {
  return {product: 'explanation-lab', version: 1, exportedAt: new Date().toISOString(), explanations};
}

async function enterRealWorkspace(page: Page) {
  await page.goto('/?demo=1');
  await page.getByRole('button', {name: 'Start for real'}).click();
  await expect(page).toHaveURL(/\/practice$/);
}

test('landing page states the job and opens a seeded demo @claim:one-click-demo', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1, name: 'Explain hard ideas in your own words'})).toBeVisible();
  await expect(page.getByText('For STEM and programming learners who want to find gaps in their understanding.')).toBeVisible();
  await expect(page.getByRole('heading', {level: 2, name: 'Write a mechanism, boundary, example, and counterexample'})).toBeVisible();
  await expect(page.getByRole('heading', {level: 2, name: 'What Explanation Lab does not do'})).toBeVisible();
  await expect(page.getByText(/before those gaps find them|blank page with useful pressure|You do the thinking/)).toHaveCount(0);
  await page.getByRole('link', {name: 'Try it with sample data'}).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your work')).toBeVisible();
  await expect(page.getByRole('link', {name: 'Why a passing siren changes pitch'})).toBeVisible();
  await expect(page.locator('.status-label', {hasText: 'Due now'})).toBeVisible();
});

test('sample practice presents four distinct prompts @claim:four-prompt-practice', async ({page}) => {
  await page.goto('/?demo=1&id=sample-doppler');
  const prompts = [
    ['Explain', 'Explain the mechanism'],
    ['Boundary', 'Draw the boundary'],
    ['Example', 'Give an example'],
    ['Counter', 'Find a counterexample']
  ] as const;
  for (const [tab, heading] of prompts) {
    await page.getByRole('button', {name: new RegExp(tab)}).click();
    await expect(page.getByRole('heading', {level: 2, name: heading})).toBeVisible();
  }
});

test('demo work never appears in the real library @claim:demo-isolation', async ({page}) => {
  await page.goto('/?demo=1');
  await page.getByRole('link', {name: 'Start another explanation'}).click();
  await page.getByLabel('What do you want to explain?').fill('Why a heap keeps its smallest value first');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await expect(page.getByRole('heading', {level: 1, name: 'Why a heap keeps its smallest value first'})).toBeVisible();
  await page.goto('/library');
  await expect(page.getByText('Why a heap keeps its smallest value first')).toHaveCount(0);
});

test('a learner can complete all four prompts and get a seven-day revisit @claim:four-part-revisit', async ({page}) => {
  await page.goto('/?demo=1');
  await page.getByRole('link', {name: 'Start another explanation'}).click();
  await page.getByLabel('What do you want to explain?').fill('Why recursion needs a base case');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  const answers = [
    'Each call reduces the input and creates another call. The base case returns a value and stops that chain.',
    'The input must move toward a reachable stopping condition. Otherwise the call stack keeps growing.',
    'Factorial of three calls factorial of two, then one. One returns, and the earlier calls multiply the results.',
    'If factorial calls itself with the same number, it never reaches one. The mechanism fails to stop.'
  ];
  const promptTitles = ['Explain the mechanism', 'Draw the boundary', 'Give an example', 'Find a counterexample'];
  for (let index = 0; index < answers.length; index += 1) {
    await expect(page.getByRole('heading', {level: 2, name: promptTitles[index]})).toBeVisible();
    await page.getByLabel('Your explanation').fill(answers[index]);
    if (index < answers.length - 1) {
      await page.getByRole('button', {name: 'Save and open next prompt'}).click();
      await expect(page.getByRole('heading', {level: 2, name: promptTitles[index + 1]})).toBeVisible();
    }
  }
  await page.getByRole('button', {name: 'Finish and revisit in 7 days'}).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  const row = page.locator('.explanation-row').filter({hasText: 'Why recursion needs a base case'});
  await expect(row).toContainText('4/4 prompts answered');
  const expected = new Intl.DateTimeFormat('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(Date.now() + 7 * 86_400_000));
  await expect(row).toContainText(expected);
});

test('exports local work as a readable JSON backup @claim:json-export', async ({page}) => {
  await enterRealWorkspace(page);
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
  await page.goto('/?demo=1');
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
  await enterRealWorkspace(page);
  await expect(page.getByLabel('What do you want to explain?')).toBeEditable();
  await expect(page.getByText(/sign in|log in|payment|card number/i)).toHaveCount(0);
});

test('imports a valid Explanation Lab JSON backup @claim:json-import', async ({page}) => {
  await enterRealWorkspace(page);
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
  await page.goto('/?demo=1');
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

test('an existing visitor keeps the service worker update notice through route renders', async ({page}) => {
  await page.goto('/?demo=1');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {once: true}));
  });
  await page.reload();
  await expect(page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'})).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', {data: {type: 'UPDATE_READY'}})));
  await expect(page.getByRole('status')).toContainText('An update is ready. Reload to use it.');
  await page.getByRole('link', {name: 'Start another explanation'}).click();
  await expect(page.getByRole('heading', {level: 1, name: 'Start a four-part explanation'})).toBeVisible();
  await page.waitForTimeout(4_100);
  await expect(page.getByRole('status')).toContainText('An update is ready. Reload to use it.');
});

test('the demo has one heading before storage resolves and route navigation focuses its final heading', async ({page}) => {
  await page.goto('/?demo=1', {waitUntil: 'domcontentloaded'});
  expect(await page.locator('h1').count()).toBe(1);
  await expect(page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'})).toBeVisible();

  await page.getByRole('link', {name: 'Start another explanation'}).click();
  await expect(page).toHaveURL(/\?demo=1&new=1$/);
  const heading = page.getByRole('heading', {level: 1, name: 'Start a four-part explanation'});
  await expect(heading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Start a four-part explanation');
  expect(await page.locator('h1').count()).toBe(1);
});

test('keyboard users can skip to the main landmark and open the demo', async ({page}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Skip to main content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await page.getByRole('link', {name: 'Demo'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', {level: 1, name: 'Practice with sample explanations'})).toBeFocused();
});

test('main routes have no serious accessibility violations @a11y', async ({page}, testInfo) => {
  for (const route of ['/', '/?demo=1', '/demo', '/practice', '/library', '/privacy', '/terms', '/visual-notes', '/missing-page']) {
    await page.goto(route, {waitUntil: 'domcontentloaded'});
    const headings = await page.locator('h1').count();
    expect(headings, `${route} has one h1 before asynchronous storage resolves`).toBe(1);
    await page.waitForFunction(() => !document.querySelector('main[aria-busy="true"]'));
    expect(await page.locator('h1').count(), `${route} has one h1 after route data renders`).toBe(1);
    const results = await new AxeBuilder({page}).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious, `${route}: ${serious.map((item) => `${item.id}: ${item.help}`).join(', ')}`).toEqual([]);
  }
  await testInfo.attach('accessibility-routes', {body: 'Checked /, /?demo=1, /demo, /practice, /library, /privacy, /terms, /visual-notes, and /missing-page with axe.', contentType: 'text/plain'});
});

test('the 390px layout keeps primary controls inside the viewport @claim:mobile-ready', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only layout check');
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Try it with sample data'})).toBeInViewport();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.goto('/?demo=1&id=sample-doppler');
  await expect(page.getByLabel('Your explanation')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('route navigation immediately stops an active microphone track', async ({page}) => {
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...constraints) => {
      const stream = await original(...constraints);
      (globalThis as typeof globalThis & {qaAudioTrack?: MediaStreamTrack}).qaAudioTrack = stream.getAudioTracks()[0];
      return stream;
    };
  });
  await page.goto('/?demo=1&id=sample-doppler');
  await page.getByRole('button', {name: 'Record an audio note'}).click();
  await expect(page.getByRole('button', {name: 'Stop and keep audio'})).toBeVisible();
  expect(await page.evaluate(() => (globalThis as typeof globalThis & {qaAudioTrack?: MediaStreamTrack}).qaAudioTrack?.readyState)).toBe('live');
  await page.getByRole('link', {name: 'Library'}).click();
  await expect(page).toHaveURL(/\/library$/);
  expect(await page.evaluate(() => (globalThis as typeof globalThis & {qaAudioTrack?: MediaStreamTrack}).qaAudioTrack?.readyState)).toBe('ended');
  await expect(page.getByRole('button', {name: /Stop and keep audio/})).toHaveCount(0);
});

test('an invalid imported date changes no records and never locks the library @claim:atomic-import-validation', async ({page}) => {
  await enterRealWorkspace(page);
  await page.goto('/library');
  const invalid = backupFile([
    backupItem('would-be-valid', 'A valid sibling must stay out'),
    backupItem('bad-date', 'An invalid date must stay out', {updatedAt: 'not-a-date'})
  ]);
  await page.locator('#import-file').setInputFiles({name: 'invalid-date.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid))});
  await expect(page.getByRole('status')).toContainText('invalid practice date');
  await expect(page.getByText('A valid sibling must stay out')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', {level: 1, name: 'Your explanations'})).toBeVisible();
  await expect(page.getByText('Invalid time value')).toHaveCount(0);
});

test('duplicate import IDs require an explicit skip or replace decision @claim:duplicate-import-decision', async ({page}) => {
  await enterRealWorkspace(page);
  await page.goto('/library');
  const upload = (name: string, topic: string) => page.locator('#import-file').setInputFiles({
    name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backupFile([backupItem('collision', topic)])))
  });
  await upload('original.json', 'Original imported topic');
  await expect(page.getByRole('link', {name: 'Original imported topic'})).toBeVisible();

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('match existing work');
    await dialog.dismiss();
  });
  await upload('skip.json', 'Skipped replacement topic');
  await expect(page.locator('#toast')).toContainText('Skipped 1 matching explanation');
  await expect(page.getByRole('link', {name: 'Original imported topic'})).toBeVisible();
  await expect(page.getByText('Skipped replacement topic')).toHaveCount(0);

  page.once('dialog', async (dialog) => dialog.accept());
  await upload('replace.json', 'Confirmed replacement topic');
  await expect(page.locator('#toast')).toContainText('Replaced 1 matching explanation');
  await expect(page.getByRole('link', {name: 'Confirmed replacement topic'})).toBeVisible();
  await expect(page.getByText('Original imported topic')).toHaveCount(0);
});

test('text resized to 200 percent reflows on every reported mobile route', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only reflow check');
  for (const route of ['/?demo=1', '/practice', '/privacy', '/visual-notes']) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(1);
  }
});

test('repeated mobile navigation and footer targets are at least 44 CSS pixels', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only target-size check');
  await page.goto('/');
  const targets = [page.locator('.wordmark'), page.getByRole('navigation').getByRole('link', {name: 'Demo'}), ...await page.locator('.site-footer a').all()];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('the focus outline has at least 3 to 1 contrast on product surfaces', async ({page}) => {
  await page.goto('/?demo=1');
  const result = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const colors = ['--paper', '--yellow', '--blue'].map((token) => root.getPropertyValue(token).trim());
    const focus = root.getPropertyValue('--focus').trim();
    const luminance = (hex: string) => {
      const channels = hex.match(/[\da-f]{2}/gi)!.map((part) => Number.parseInt(part, 16) / 255).map((part) => part <= .04045 ? part / 12.92 : ((part + .055) / 1.055) ** 2.4);
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    };
    return colors.map((color) => (Math.max(luminance(focus), luminance(color)) + .05) / (Math.min(luminance(focus), luminance(color)) + .05));
  });
  result.forEach((contrast) => expect(contrast).toBeGreaterThanOrEqual(3));
  await page.getByRole('button', {name: 'Reset demo'}).focus();
  await expect(page.getByRole('button', {name: 'Reset demo'})).toHaveCSS('outline-style', 'solid');
});

test('static host policy serves real 404s and separates stable and hashed cache rules', async ({page}) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', {level: 1, name: 'We could not find this page'})).toBeVisible();
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  expect(config.responseOverrides['404'].rewrite).toBe('/404.html');
  for (const route of ['/demo', '/practice', '/library', '/privacy', '/terms', '/visual-notes']) {
    expect(config.routes).toContainEqual({route, rewrite: '/index.html'});
  }
  expect(config.routes).toContainEqual({route: '/build/*', headers: {'Cache-Control': 'public, max-age=31536000, immutable'}});
  expect(config.routes).toContainEqual({route: '/assets/*', headers: {'Cache-Control': 'public, max-age=0, must-revalidate'}});
});

test('routes set titles, canonical metadata, focus, and working legal links', async ({page}) => {
  await page.goto('/');
  for (const [name, path, title] of [
    ['Privacy', '/privacy', 'Privacy — Explanation Lab'],
    ['Terms', '/terms', 'Terms — Explanation Lab'],
    ['Visual notes', '/visual-notes', 'Visual notes — Explanation Lab']
  ] as const) {
    await page.getByRole('link', {name, exact: true}).last().click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toBeFocused();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://explanation-lab.sociobot.in${path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await page.goto('/');
  }
});

test('the footer exposes the release build identity and linked visual disclosure', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.build')).toContainText('build polish-1');
  await page.getByRole('link', {name: 'Visual notes'}).click();
  await expect(page).toHaveTitle('Visual notes — Explanation Lab');
  await expect(page.getByRole('heading', {level: 1, name: 'How the Explanation Lab illustration was made'})).toBeFocused();
});

test('audio notes survive JSON export and import @claim:audio-backup', async ({page}) => {
  await enterRealWorkspace(page);
  await page.getByLabel('What do you want to explain?').fill('How sound waves carry energy');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByRole('button', {name: 'Record an audio note'}).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', {name: 'Stop and keep audio'}).click();
  await expect(page.locator('audio')).toBeVisible();
  await page.goto('/library');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export JSON'}).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const bytes = Buffer.concat(chunks);
  const exported = JSON.parse(bytes.toString('utf8'));
  const saved = exported.explanations.find((item: {topic: string}) => item.topic === 'How sound waves carry energy');
  expect(saved.responses.mechanism.audio.dataUrl).toMatch(/^data:audio\/.+;base64,/);
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('explanation-lab');
    request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
  }));
  await page.reload();
  await page.locator('#import-file').setInputFiles({name: 'audio-backup.json', mimeType: 'application/json', buffer: bytes});
  await page.getByRole('link', {name: 'How sound waves carry energy'}).click();
  await expect(page.locator('audio')).toBeVisible();
});

test('reset and exit clear only the demo workspace @claim:demo-reset-exit', async ({page}) => {
  await enterRealWorkspace(page);
  await page.getByLabel('What do you want to explain?').fill('A real explanation that must survive');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByLabel('Your explanation').fill('This record belongs to the real workspace.');
  await page.getByRole('button', {name: 'Save this response'}).click();
  await page.goto('/?demo=1&new=1');
  await page.getByLabel('What do you want to explain?').fill('Temporary demo explanation');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await page.getByRole('button', {name: 'Reset demo'}).click();
  await expect(page.getByText('Temporary demo explanation')).toHaveCount(0);
  await expect(page.getByRole('link', {name: 'Why a passing siren changes pitch'})).toBeVisible();
  await page.getByRole('button', {name: 'Start for real'}).click();
  await page.goto('/library');
  await expect(page.getByRole('link', {name: 'A real explanation that must survive'})).toBeVisible();
  await page.goto('/?demo=1');
  await expect(page.getByRole('link', {name: 'Why a passing siren changes pitch'})).toBeVisible();
});

test('the product neither grades nor generates explanations nor syncs devices @claim:manual-no-sync', async ({page}) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url()); });
  await page.goto('/?demo=1');
  await page.goto('/');
  await expect(page.getByText('Explanation Lab does not grade answers or generate explanations.')).toBeVisible();
  await expect(page.getByText('It does not create an account or sync devices.')).toBeVisible();
  expect(crossOrigin).toEqual([]);
});

test('the app loads no analytics advertising or third-party scripts @claim:no-tracking', async ({page}) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url()); });
  await page.goto('/?demo=1');
  await page.goto('/privacy');
  await expect(page.getByText('It does not use analytics, advertising, or third-party scripts.')).toBeVisible();
  expect(crossOrigin).toEqual([]);
});

test('clearing site data removes saved work @claim:site-data-clear', async ({page}) => {
  await enterRealWorkspace(page);
  await page.getByLabel('What do you want to explain?').fill('A record removed with site data');
  await page.getByRole('button', {name: 'Open the four prompts'}).click();
  await expect(page.getByRole('heading', {level: 1, name: 'A record removed with site data'})).toBeVisible();
  await page.goto('/library');
  await expect(page.getByRole('link', {name: 'A record removed with site data'})).toBeVisible();
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('explanation-lab');
    request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
  }));
  await page.reload();
  await expect(page.getByText('A record removed with site data')).toHaveCount(0);
});
