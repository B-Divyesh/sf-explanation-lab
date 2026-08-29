import './styles.css';
import {
  clearExplanations,
  getExplanation,
  importExplanations,
  listExplanations,
  makeExport,
  parseImport,
  removeExplanation,
  saveExplanation,
  seedDemo
} from './storage';
import {emptyExplanation, STEP_DETAILS, STEP_KEYS, type Explanation, type StepKey} from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
if (!app) throw new Error('The app container is missing.');

let activeStep: StepKey = 'mechanism';
let recorder: MediaRecorder | undefined;
let recorderStream: MediaStream | undefined;
let audioChunks: Blob[] = [];
let recordingFor: {demo: boolean; id: string; step: StepKey} | undefined;
let recordingRequest = 0;
const objectUrls: string[] = [];
const UPDATE_READY_MESSAGE = 'An update is ready. Reload to use it.';
let updateReady = false;
let toastTimeout: number | undefined;

const pageDetails: Record<string, {title: string; description: string}> = {
  '/': {title: 'Explanation Lab — Practice explaining hard ideas', description: 'Practice a mechanism, boundary, example, and counterexample. Your work stays in this browser.'},
  '/demo': {title: 'Demo — Explanation Lab', description: 'Try Explanation Lab with isolated sample explanations.'},
  '/practice': {title: 'Practice — Explanation Lab', description: 'Write or record a four-part explanation.'},
  '/library': {title: 'Your explanations — Explanation Lab', description: 'Revisit, export, or import explanations saved in this browser.'},
  '/privacy': {title: 'Privacy — Explanation Lab', description: 'How Explanation Lab stores your work in this browser.'},
  '/terms': {title: 'Terms — Explanation Lab', description: 'Terms for using the free Explanation Lab utility.'},
  '/visual-notes': {title: 'Visual notes — Explanation Lab', description: 'See how the original Explanation Lab illustration was made.'},
  '/404': {title: 'Page not found — Explanation Lab', description: 'Return to Explanation Lab.'}
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character] ?? character));
}

function dateLabel(value?: string): string {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat(undefined, {day: 'numeric', month: 'short', year: 'numeric'}).format(date);
}

function isDue(item: Explanation): boolean {
  return item.status === 'complete' && Boolean(item.revisitAt) && new Date(item.revisitAt as string).getTime() <= Date.now();
}

function completionCount(item: Explanation): number {
  return STEP_KEYS.filter((key) => item.responses[key].text.trim() || item.responses[key].audio).length;
}

function pagePath(): string {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' && new URLSearchParams(location.search).get('demo') === '1') return '/demo';
  if (['/', '/demo', '/practice', '/library', '/privacy', '/terms', '/visual-notes'].includes(path)) return path;
  return '/404';
}

function applyMeta(path: string): void {
  const details = pageDetails[path] ?? pageDetails['/404'];
  const canonicalPath = path === '/demo' ? '/?demo=1' : path === '/404' ? location.pathname : path;
  const canonicalUrl = `https://explanation-lab.sociobot.in${canonicalPath}`;
  document.title = details.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', details.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', details.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', details.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', details.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', details.description);
}

function demoHref(parameters = ''): string {
  return `/?demo=1${parameters ? `&${parameters}` : ''}`;
}

function header(demo: boolean): string {
  return `
    ${demo ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved to your work</strong><span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="leave-demo">Start for real</button></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark route-link" href="/" aria-label="Explanation Lab home"><span aria-hidden="true" class="wordmark-grid"><i></i><i></i><i></i><i></i></span><span>Explanation<br>Lab</span></a>
      <nav aria-label="Main navigation">
        <a class="route-link" href="/?demo=1">Demo</a>
        <a class="route-link" href="/practice">Practice</a>
        <a class="route-link" href="/library">Library</a>
        <a class="route-link" href="/privacy">Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer"><p><strong>Explanation Lab</strong> uses four prompts for each explanation.</p><div><a class="route-link" href="/privacy">Privacy</a><a class="route-link" href="/terms">Terms</a><a class="route-link" href="/visual-notes">Visual notes</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></div><p class="build">v1.0 · build polish-3</p></footer>`;
}

function shell(content: string, demo = false): string {
  return `${header(demo)}${content}${footer()}`;
}

function loadingPage(path: string): string {
  const demo = path === '/demo';
  const title = path === '/demo' ? 'Practice with sample explanations'
    : path === '/library' ? 'Your explanations'
      : 'Start a four-part explanation';
  const detail = demo ? 'Preparing the isolated sample workspace.' : 'Opening your local workspace.';
  return shell(`<main id="main" class="page-main" aria-busy="true"><section class="start-sheet"><p class="eyebrow">Opening workspace</p><h1 id="page-title" tabindex="-1">${title}</h1><p class="lede">${detail}</p></section></main>`, demo);
}

function landing(): string {
  return shell(`<main id="main">
    <section class="hero section-shell" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Four prompts to practise an idea</p>
        <h1 id="page-title" tabindex="-1">Explain hard ideas in your own words</h1>
        <p class="lede">For STEM and programming learners who want to find gaps in their understanding.</p>
        <div class="hero-actions">
          <div><a class="button button-primary route-link" href="/?demo=1">Try it with sample data</a><small>Opens a due explanation and two recent examples.</small></div>
          <div><a class="button button-secondary route-link" href="/practice">Start a blank explanation</a><small>Choose a topic, then answer four prompts.</small></div>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><span aria-hidden="true">↘</span> Work stays in this browser</li>
          <li><span aria-hidden="true">↘</span> Works offline after the first visit</li>
          <li><span aria-hidden="true">↘</span> Free, with no account</li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture><source media="(max-width: 700px)" srcset="/assets/hero-640.webp"><img src="/assets/hero-1024.webp" width="1024" height="683" alt="Four linked tabletop stations show an idea being tested in different ways." fetchpriority="high" decoding="async"></picture>
        <figcaption><b>01–04</b> Mechanism. Boundary. Example. Counterexample.</figcaption>
      </figure>
    </section>
    <section class="tool-preview section-shell" aria-labelledby="preview-title">
      <div class="section-kicker">Four prompts in each explanation</div>
      <div class="preview-grid">
        <div><h2 id="preview-title">Write a mechanism, boundary, example, and counterexample</h2><p>Each prompt asks you to test the idea in a different way. Type your answer or keep a local audio note.</p></div>
        <ol class="mini-steps">
          <li><b>01</b><span>Explain the mechanism</span></li>
          <li><b>02</b><span>State where the idea applies</span></li>
          <li><b>03</b><span>Give an example</span></li>
          <li><b>04</b><span>Find a counterexample</span></li>
        </ol>
      </div>
    </section>
    <section class="how section-shell" aria-labelledby="how-title">
      <p class="section-kicker">How it works</p><h2 id="how-title">Three steps to practise and revisit</h2>
      <ol class="how-list">
        <li><b>1</b><div><h3>Name one hard idea</h3><p>Pick something you almost understand. Choose a narrow topic so you can check one idea at a time.</p></div></li>
        <li><b>2</b><div><h3>Answer all four prompts</h3><p>Write, record, or use both. Use your own words; completing all four answers matters more than writing style.</p></div></li>
        <li><b>3</b><div><h3>Return after seven days</h3><p>Completed work enters a revisit queue. Read your old answer, then improve the least complete part.</p></div></li>
      </ol>
    </section>
    <section class="limits section-shell" aria-labelledby="limits-title">
      <div><p class="section-kicker">Limits</p><h2 id="limits-title">What Explanation Lab does not do</h2></div>
      <div class="limit-copy"><p>Explanation Lab does not grade answers or generate explanations.</p><p>It does not create an account or sync devices.</p><p>Export a JSON backup when you want to move your work.</p></div>
    </section>
  </main>`);
}

function emptyPractice(demo = false): string {
  return shell(`<main id="main" class="page-main"><section class="start-sheet"><p class="eyebrow">New practice</p><h1 id="page-title" tabindex="-1">Start a four-part explanation</h1><p class="lede">Choose one idea you can state in a short phrase.</p><form id="topic-form" data-demo="${String(demo)}"><label for="topic">What do you want to explain?</label><div class="topic-row"><input id="topic" name="topic" maxlength="100" required autocomplete="off"><button class="button button-primary" type="submit">Open the four prompts</button></div><p class="field-note">Try “why recursion needs a base case” or “how voltage drives current.”</p><p id="form-error" class="error" role="alert"></p></form></section></main>`, demo);
}

function stepNavigation(item: Explanation): string {
  return `<ol class="step-rail" aria-label="Explanation prompts">${STEP_KEYS.map((key) => {
    const detail = STEP_DETAILS[key];
    const done = Boolean(item.responses[key].text.trim() || item.responses[key].audio);
    return `<li><button class="step-tab ${key === activeStep ? 'active' : ''}" data-action="step" data-step="${key}" ${key === activeStep ? 'aria-current="step"' : ''}><span>${done ? '✓' : detail.number}</span><b>${detail.short}</b><small>${done ? 'Answered' : 'Not answered'}</small></button></li>`;
  }).join('')}</ol>`;
}

function audioMarkup(item: Explanation, key: StepKey): string {
  const note = item.responses[key].audio;
  if (!note) return '';
  const url = URL.createObjectURL(note.blob);
  objectUrls.push(url);
  return `<div class="audio-note"><audio controls src="${url}">Your browser cannot play this audio note.</audio><button class="text-button danger-link" data-action="remove-audio" data-id="${item.id}" data-step="${key}">Remove audio</button></div>`;
}

function workbench(item: Explanation, demo: boolean): string {
  const detail = STEP_DETAILS[activeStep];
  const part = item.responses[activeStep];
  const count = completionCount(item);
  const route = demo ? demoHref() : '/practice';
  return shell(`<main id="main" class="workbench-main">
    <div class="workbench-top"><div><a class="back-link route-link" href="${demo ? demoHref() : '/library'}">← ${demo ? 'Sample overview' : 'Your explanations'}</a><p class="eyebrow">${item.status === 'complete' ? 'Completed explanation' : 'Draft explanation'}</p><h1 id="page-title" tabindex="-1">${escapeHtml(item.topic)}</h1></div><div class="progress-stamp"><b>${count}/4</b><span>prompts answered</span></div></div>
    <section class="workbench" aria-labelledby="prompt-title">
      ${stepNavigation(item)}
      <div class="writing-sheet">
        <div class="prompt-number" aria-hidden="true">${detail.number}</div>
        <p class="step-name">${detail.short}</p><h2 id="prompt-title">${detail.title}</h2><p class="prompt-question">${detail.prompt}</p><p class="prompt-hint">${detail.hint}</p>
        <form id="response-form" data-id="${item.id}" data-demo="${String(demo)}">
          <label for="response">Your explanation</label>
          <textarea id="response" name="response" rows="9" maxlength="6000" placeholder="Put the idea into your own words…">${escapeHtml(part.text)}</textarea>
          <div class="recording-zone">
            <button class="button button-quiet" type="button" data-action="record" data-id="${item.id}" data-step="${activeStep}"><span aria-hidden="true" class="record-dot"></span>${part.audio ? 'Replace audio note' : 'Record an audio note'}</button>
            <p id="record-status">Audio stays in this browser. Text is always optional.</p>
            ${audioMarkup(item, activeStep)}
          </div>
          <div class="sheet-actions"><button class="button button-primary" type="submit">Save this response</button>${activeStep !== 'counterexample' ? `<button class="button button-secondary" type="button" data-action="next-step">Save and open next prompt</button>` : `<button class="button button-secondary" type="button" data-action="finish" data-id="${item.id}">${item.status === 'complete' ? 'Finish this revisit' : 'Finish and revisit in 7 days'}</button>`}</div>
          <p id="save-status" class="save-status" aria-live="polite"></p>
        </form>
      </div>
    </section>
    <aside class="practice-note"><b>Do not check a source yet.</b><span>Finish your attempt first. The gaps are useful evidence.</span></aside>
    <a class="sr-only route-link" href="${route}${demo ? '&' : '?'}id=${encodeURIComponent(item.id)}">Reload this explanation</a>
  </main>`, demo);
}

function explanationRows(items: Explanation[], demo: boolean): string {
  const route = demo ? demoHref() : '/practice';
  const separator = demo ? '&' : '?';
  return items.map((item) => `<li class="explanation-row ${isDue(item) ? 'due' : ''}">
    <div class="row-main"><span class="status-label">${isDue(item) ? 'Due now' : item.status === 'draft' ? 'Draft' : `Revisit ${dateLabel(item.revisitAt)}`}</span><h3><a class="route-link" href="${route}${separator}id=${encodeURIComponent(item.id)}">${escapeHtml(item.topic)}</a></h3><p>${completionCount(item)}/4 prompts answered · Updated ${dateLabel(item.updatedAt)}</p></div>
    <div class="row-actions"><a class="button button-small route-link" href="${route}${separator}id=${encodeURIComponent(item.id)}">${isDue(item) ? 'Revisit now' : item.status === 'draft' ? 'Keep writing' : 'Read or edit'}</a><button class="icon-button" data-action="delete" data-id="${item.id}" data-demo="${String(demo)}" aria-label="Delete ${escapeHtml(item.topic)}">×</button></div>
  </li>`).join('');
}

async function dashboard(demo: boolean): Promise<string> {
  if (demo) await seedDemo();
  const items = await listExplanations(demo);
  const due = items.filter(isDue);
  const drafts = items.filter((item) => item.status === 'draft');
  const completed = items.filter((item) => item.status === 'complete');
  const title = demo ? 'Practice with sample explanations' : 'Your explanations';
  return shell(`<main id="main" class="page-main library-page">
    <section class="library-head"><div><p class="eyebrow">${demo ? 'Isolated demo workspace' : 'Local practice library'}</p><h1 id="page-title" tabindex="-1">${title}</h1><p>${demo ? 'Open the due siren explanation or continue the closure draft.' : 'Return to completed ideas after seven days, or continue a draft.'}</p></div><a class="button button-primary route-link" href="${demo ? demoHref('new=1') : '/practice'}">Start another explanation</a></section>
    <section class="stats-strip" aria-label="Practice summary"><div><b>${items.length}</b><span>Total</span></div><div><b>${completed.length}</b><span>Completed</span></div><div><b>${due.length}</b><span>Due now</span></div><div><b>${drafts.length}</b><span>Drafts</span></div></section>
    <section class="queue" aria-labelledby="queue-title"><div class="queue-heading"><div><p class="section-kicker">Revisit queue</p><h2 id="queue-title">${due.length ? `${due.length} explanation${due.length === 1 ? '' : 's'} ready` : 'Nothing is due today'}</h2></div></div>
      ${items.length ? `<ul class="explanation-list">${explanationRows([...due, ...items.filter((item) => !isDue(item))], demo)}</ul>` : `<div class="empty-state"><b>Your explanations will appear here.</b><p>Start one topic and answer the four prompts to fill this list.</p><a class="button button-primary route-link" href="/practice">Start an explanation</a></div>`}
    </section>
    ${demo ? '' : `<section class="data-tools" aria-labelledby="data-title"><div><p class="section-kicker">Your data</p><h2 id="data-title">Move or back up your work</h2><p>Exports include your text and local audio notes.</p></div><div class="data-actions"><button class="button button-secondary" data-action="export">Export JSON</button><label class="button button-quiet file-button">Import JSON<input id="import-file" type="file" accept="application/json,.json"></label><p id="import-status" role="status"></p></div></section>`}
  </main>`, demo);
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return shell(`<main id="main" class="page-main legal-page"><article><p class="eyebrow">Plain-language ${kind}</p><h1 id="page-title" tabindex="-1">${privacy ? 'Your explanations stay with you' : 'Terms for this free utility'}</h1>
    ${privacy ? `<h2>What the app stores</h2><p>Explanation Lab stores topics, written responses, audio notes, and practice dates in this browser.</p><p>The demo uses a separate browser database. Leaving or resetting the demo removes that sample workspace.</p><h2>What leaves your device</h2><p>The app does not send your explanations or audio to a server. It does not use analytics, advertising, or third-party scripts.</p><h2>Your choices</h2><p>Export a JSON copy from the Library page. You can also delete individual explanations there.</p><p>Clearing site data in your browser removes all saved work. We cannot recover it.</p>` : `<h2>Use</h2><p>Explanation Lab is free to use for personal learning and teaching. You are responsible for your own explanations and backups.</p><h2>No grading</h2><p>The prompts help you inspect your understanding. They do not certify accuracy, provide grades, or replace expert advice.</p><h2>Availability</h2><p>The app is provided as is, without warranties. Local browser limits or cleared site data can remove saved work.</p><h2>License</h2><p>The source code is available under the MIT License. These terms were last updated on 28 August 2026.</p>`}
  </article></main>`);
}

function visualNotesPage(): string {
  return shell(`<main id="main" class="page-main legal-page"><article><p class="eyebrow">Asset provenance</p><h1 id="page-title" tabindex="-1">How the Explanation Lab illustration was made</h1>
    <h2>Original illustration</h2><p>The tabletop explanation apparatus was generated for this product on 28 August 2026. It does not depict a real device or person.</p>
    <h2>Art direction</h2><p>The prompt specified cream graph paper, cobalt blocks, orange correction tabs, wooden ramps, steel balls, and hard studio light.</p>
    <h2>Production record</h2><p>The source image and exact prompt are stored with the project. The shipped WebP files are optimized crops of that source.</p>
  </article></main>`);
}

function notFound(): string {
  return shell(`<main id="main" class="page-main not-found"><div class="error-code" aria-hidden="true">4<span>0</span>4</div><div><p class="eyebrow">Page not found</p><h1 id="page-title" tabindex="-1">We could not find this page</h1><p>The address does not match an Explanation Lab page.</p><a class="button button-primary route-link" href="/">Return home</a></div></main>`);
}

async function render(focus = false): Promise<void> {
  cancelRecording();
  objectUrls.splice(0).forEach((url) => URL.revokeObjectURL(url));
  const path = pagePath();
  applyMeta(path);
  const params = new URLSearchParams(location.search);
  // IndexedDB can resolve after DOMContentLoaded. Render a complete route
  // landmark and its single heading before awaiting storage so a direct URL
  // never exposes an empty application to keyboard or assistive-tech users.
  if (path === '/demo' || path === '/library' || path === '/practice') app.innerHTML = loadingPage(path);
  try {
    if (path === '/') app.innerHTML = landing();
    else if (path === '/privacy' || path === '/terms') app.innerHTML = legalPage(path.slice(1) as 'privacy' | 'terms');
    else if (path === '/visual-notes') app.innerHTML = visualNotesPage();
    else if (path === '/library') app.innerHTML = await dashboard(false);
    else if (path === '/demo') {
      await seedDemo();
      const id = params.get('id');
      if (params.get('new') === '1') app.innerHTML = emptyPractice(true);
      else if (id) {
        const item = await getExplanation(true, id);
        app.innerHTML = item ? workbench(item, true) : await dashboard(true);
      } else app.innerHTML = await dashboard(true);
    } else if (path === '/practice') {
      const id = params.get('id');
      const item = id ? await getExplanation(false, id) : undefined;
      app.innerHTML = item ? workbench(item, false) : emptyPractice();
    } else app.innerHTML = notFound();
  } catch (error) {
    app.innerHTML = shell(`<main id="main" class="page-main"><section class="error-panel"><p class="eyebrow">Storage error</p><h1 id="page-title" tabindex="-1">Your browser could not open the workbench</h1><p>${escapeHtml(error instanceof Error ? error.message : 'Local storage is unavailable.')}</p><button class="button button-primary" data-action="retry">Try again</button></section></main>`, path === '/demo');
  }
  document.querySelector<HTMLElement>('#main')?.setAttribute('tabindex', '-1');
  attachForms();
  if (focus) {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.focus({preventScroll: true});
    document.querySelector('#route-status')!.textContent = heading?.textContent ?? document.title;
    window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }
}

function showToast(message: string, persistent = false): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  if (toastTimeout !== undefined) window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.hidden = false;
  toastTimeout = undefined;
  if (!persistent) {
    toastTimeout = window.setTimeout(() => {
      if (updateReady) toast.textContent = UPDATE_READY_MESSAGE;
      else toast.hidden = true;
      toastTimeout = undefined;
    }, 4000);
  }
}

function navigate(href: string): void {
  cancelRecording();
  history.pushState({}, '', href);
  activeStep = 'mechanism';
  void render(true);
}

async function saveCurrentResponse(item: Explanation, demo: boolean, moveNext = false): Promise<void> {
  const textarea = document.querySelector<HTMLTextAreaElement>('#response');
  if (!textarea) return;
  item.responses[activeStep].text = textarea.value.trim();
  item.updatedAt = new Date().toISOString();
  await saveExplanation(demo, item);
  const status = document.querySelector<HTMLElement>('#save-status');
  if (status) status.textContent = 'Saved in this browser.';
  if (moveNext) {
    const index = STEP_KEYS.indexOf(activeStep);
    activeStep = STEP_KEYS[Math.min(index + 1, STEP_KEYS.length - 1)];
    await render();
    document.querySelector<HTMLTextAreaElement>('#response')?.focus();
  }
}

async function finishExplanation(item: Explanation, demo: boolean): Promise<void> {
  const textarea = document.querySelector<HTMLTextAreaElement>('#response');
  if (textarea) item.responses[activeStep].text = textarea.value.trim();
  const missing = STEP_KEYS.find((key) => !item.responses[key].text.trim() && !item.responses[key].audio);
  if (missing) {
    activeStep = missing;
    await saveExplanation(demo, {...item, updatedAt: new Date().toISOString()});
    await render();
    const status = document.querySelector<HTMLElement>('#save-status');
    if (status) status.textContent = `Answer “${STEP_DETAILS[missing].title}” with text or audio before finishing.`;
    document.querySelector<HTMLTextAreaElement>('#response')?.focus();
    return;
  }
  const now = new Date();
  item.status = 'complete';
  item.completedAt ??= now.toISOString();
  if (item.revisitAt && new Date(item.revisitAt).getTime() <= now.getTime()) item.lastRevisitedAt = now.toISOString();
  item.revisitAt = new Date(now.getTime() + 7 * 86_400_000).toISOString();
  item.updatedAt = now.toISOString();
  await saveExplanation(demo, item);
  navigate(demo ? demoHref() : '/library');
  showToast('Explanation complete. It will return in seven days.');
}

async function startRecording(demo: boolean, id: string, step: StepKey): Promise<void> {
  const status = document.querySelector<HTMLElement>('#record-status');
  if (recorder?.state === 'recording') {
    recorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    if (status) status.textContent = 'Audio recording is not available here. Type your response instead.';
    return;
  }
  try {
    const request = ++recordingRequest;
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    if (request !== recordingRequest) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    recorderStream = stream;
    recorder = new MediaRecorder(recorderStream);
    audioChunks = [];
    recordingFor = {demo, id, step};
    recorder.ondataavailable = (event) => { if (event.data.size) audioChunks.push(event.data); };
    recorder.onstop = () => { void keepRecording(); };
    recorder.start();
    const button = document.querySelector<HTMLButtonElement>('[data-action="record"]');
    if (button) button.innerHTML = '<span aria-hidden="true" class="record-dot live"></span>Stop and keep audio';
    if (status) status.textContent = 'Recording now. Select stop when you finish.';
  } catch {
    if (status) status.textContent = 'The microphone did not start. Allow microphone access or type your response.';
  }
}

function cancelRecording(): void {
  recordingRequest += 1;
  if (recorder) {
    recorder.ondataavailable = null;
    recorder.onstop = null;
    if (recorder.state !== 'inactive') {
      try { recorder.stop(); } catch { /* The tracks are stopped below. */ }
    }
  }
  recorderStream?.getTracks().forEach((track) => track.stop());
  recorder = undefined;
  recorderStream = undefined;
  recordingFor = undefined;
  audioChunks = [];
}

async function keepRecording(): Promise<void> {
  recorderStream?.getTracks().forEach((track) => track.stop());
  if (!recordingFor) return;
  const request = recordingRequest;
  const {demo, id, step} = recordingFor;
  const mimeType = recorder?.mimeType || 'audio/webm';
  const chunks = audioChunks;
  recorder = undefined; recorderStream = undefined; recordingFor = undefined; audioChunks = [];
  const item = await getExplanation(demo, id);
  if (item && chunks.length) {
    item.responses[step].audio = {blob: new Blob(chunks, {type: mimeType}), mimeType, createdAt: new Date().toISOString()};
    item.updatedAt = new Date().toISOString();
    await saveExplanation(demo, item);
  }
  if (request !== recordingRequest) return;
  await render();
  showToast('Audio note saved in this browser.');
}

function attachForms(): void {
  const topicForm = document.querySelector<HTMLFormElement>('#topic-form');
  topicForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = topicForm.querySelector<HTMLInputElement>('#topic');
    const error = topicForm.querySelector<HTMLElement>('#form-error');
    const topic = input?.value.trim() ?? '';
    if (topic.length < 3) {
      if (error) error.textContent = 'Name the idea in at least three characters.';
      input?.focus();
      return;
    }
    const demo = topicForm.dataset.demo === 'true';
    const item = emptyExplanation(topic);
    void saveExplanation(demo, item).then(() => navigate(demo ? demoHref(`id=${encodeURIComponent(item.id)}`) : `/practice?id=${encodeURIComponent(item.id)}`));
  });

  const responseForm = document.querySelector<HTMLFormElement>('#response-form');
  responseForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = responseForm.dataset.id;
    const demo = responseForm.dataset.demo === 'true';
    if (id) void getExplanation(demo, id).then((item) => item && saveCurrentResponse(item, demo));
  });

  const importInput = document.querySelector<HTMLInputElement>('#import-file');
  importInput?.addEventListener('change', () => {
    const file = importInput.files?.[0];
    if (!file) return;
    const status = document.querySelector<HTMLElement>('#import-status');
    void file.text().then(parseImport).then(async (items) => {
      const existingIds = new Set((await listExplanations(false)).map((item) => item.id));
      const collisionCount = items.filter((item) => existingIds.has(item.id)).length;
      const replace = collisionCount === 0 || confirm(`${collisionCount} imported explanation${collisionCount === 1 ? '' : 's'} match existing work. Replace ${collisionCount === 1 ? 'it' : 'them'}? Choose Cancel to skip matching explanations.`);
      const selected = replace ? items : items.filter((item) => !existingIds.has(item.id));
      await importExplanations(false, selected);
      return {imported: selected.length, replaced: replace ? collisionCount : 0, skipped: replace ? 0 : collisionCount};
    }).then(async ({imported, replaced, skipped}) => {
      const result = `Imported ${imported} explanation${imported === 1 ? '' : 's'}.${replaced ? ` Replaced ${replaced} matching explanation${replaced === 1 ? '' : 's'}.` : ''}${skipped ? ` Skipped ${skipped} matching explanation${skipped === 1 ? '' : 's'}.` : ''}`;
      if (status) status.textContent = result;
      await render();
      showToast(result);
    }).catch((error: unknown) => {
      if (status) status.textContent = error instanceof Error ? error.message : 'The file could not be imported.';
    });
  });
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const link = target.closest<HTMLAnchorElement>('a.route-link');
  if (link && link.origin === location.origin && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
    event.preventDefault(); navigate(`${link.pathname}${link.search}`); return;
  }
  const button = target.closest<HTMLElement>('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'retry') void render();
  if (action === 'leave-demo') {
    void clearExplanations(true).finally(() => navigate('/practice'));
  }
  if (action === 'reset-demo') {
    void seedDemo(true).then(() => { navigate(demoHref()); showToast('Sample data reset.'); });
  }
  if (action === 'step' && button.dataset.step) {
    activeStep = button.dataset.step as StepKey; void render();
  }
  if (action === 'next-step') {
    const form = document.querySelector<HTMLFormElement>('#response-form');
    const id = form?.dataset.id;
    const demo = form?.dataset.demo === 'true';
    if (id) void getExplanation(demo, id).then((item) => item && saveCurrentResponse(item, demo, true));
  }
  if (action === 'finish' && button.dataset.id) {
    const demo = document.querySelector<HTMLFormElement>('#response-form')?.dataset.demo === 'true';
    void getExplanation(demo, button.dataset.id).then((item) => item && finishExplanation(item, demo));
  }
  if (action === 'record' && button.dataset.id && button.dataset.step) {
    const demo = document.querySelector<HTMLFormElement>('#response-form')?.dataset.demo === 'true';
    void startRecording(demo, button.dataset.id, button.dataset.step as StepKey);
  }
  if (action === 'remove-audio' && button.dataset.id && button.dataset.step) {
    const demo = document.querySelector<HTMLFormElement>('#response-form')?.dataset.demo === 'true';
    void getExplanation(demo, button.dataset.id).then(async (item) => {
      if (!item) return;
      delete item.responses[button.dataset.step as StepKey].audio;
      item.updatedAt = new Date().toISOString();
      await saveExplanation(demo, item); await render(); showToast('Audio note removed.');
    });
  }
  if (action === 'delete' && button.dataset.id) {
    const demo = button.dataset.demo === 'true';
    const name = button.getAttribute('aria-label')?.replace(/^Delete /, '') ?? 'this explanation';
    if (confirm(`Delete “${name}”? This cannot be undone.`)) void removeExplanation(demo, button.dataset.id).then(() => render());
  }
  if (action === 'export') {
    void makeExport(false).then((data) => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}));
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `explanation-lab-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
      URL.revokeObjectURL(url); showToast('JSON backup exported.');
    }).catch(() => showToast('The export failed. Try again.'));
  }
});

window.addEventListener('popstate', () => { activeStep = 'mechanism'; void render(true); });
window.addEventListener('pagehide', cancelRecording);
document.addEventListener('visibilitychange', () => { if (document.hidden) cancelRecording(); });
window.addEventListener('online', () => showToast('You are back online.'));
window.addEventListener('offline', () => showToast('You are offline. Saved work is still available.'));

if ('serviceWorker' in navigator) {
  const hadServiceWorker = Boolean(navigator.serviceWorker.controller);
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'UPDATE_READY' && hadServiceWorker) {
      updateReady = true;
      showToast(UPDATE_READY_MESSAGE, true);
    }
  });
}

void render();
