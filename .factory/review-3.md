# Adversarial first-read review 3 — Explanation Lab

Date: 2026-08-29 UTC  
Live URL: <https://explanation-lab.sociobot.in>  
Candidate: `4647d85c50fa913c14974129bfd68707ef40fc46`  
Method: fresh 390×844 and 1440×900 browser contexts, live request capture, live route/link crawl, and a clean local clone. No product code was changed.

## Verdict: FAIL

There are no blocking findings. Two minor findings remain: the 390px header omits the Privacy link required by the supplied site skeleton, and one prompt heading uses a misleading metaphor. The work order permits `PASS` only with zero findings.

## First 30 seconds

Before scrolling, both fresh contexts answered all three questions:

- **What it does:** It helps a learner explain one hard idea through four prompts in their own words.
- **For whom:** “For STEM and programming learners who want to find gaps in their understanding.”
- **What to click first:** “Try it with sample data.” The adjacent sentence says, “Opens a due explanation and two recent examples.”

The headline, audience, primary action, outcome sentence, and three facts were visible at 390×844. The action started at 411px from the top and had a 366×48px box. The page had no horizontal overflow or cold-load console error. The cold-read gate passes.

## Findings

### F-3-1 — Minor — the phone header hides Privacy

**Location / exact behavior:** Live header at 390×844. It shows “Demo,” “Practice,” and “Library,” but not “Privacy.” In `src/styles.css`, the `@media (max-width: 820px)` rule sets `.nav-secondary { display: none !important; }`; the Privacy link has that class.

**Why this matters:** The supplied site-structure contract requires a consistent header with Privacy. The omission happens on the phone layout, where the product prominently asks visitors to trust browser-only storage and microphone handling. Privacy remains in the footer, but that does not make the header skeleton consistent.

**Concrete fix:** Keep Privacy visible at 390px. Use a four-column nav or a clearly designed second row, retain 44×44px targets, and add a mobile assertion that the header Privacy link is visible and operable.

### F-3-2 — Minor — “Draw the boundary” is metaphorical and implies an unavailable input mode

**Location / exact copy:** Landing four-prompt preview and the second workbench prompt: “Draw the boundary.”

**Why this matters:** The workbench accepts text or audio, not drawing. “Draw” is therefore a metaphor and can make a first-time visitor expect a drawing control. The next sentence already states the concrete task: “What must be true? Where does this idea stop applying?”

**Concrete fix:** Replace the heading in both locations with “State where the idea applies” or “State the limits.” Add a copy regression that rejects “Draw the boundary.”

## Copy audit

Counts use whitespace-separated words. Headings, labels, actions, alt text, and other standalone copy are included because visitors or assistive technology encounter them independently. No item exceeds 22 words and no banned marketing adjective appears. The only copy flag is F-3-2.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| Practice | 1 | Pass — navigation |
| Library | 1 | Pass — navigation |
| Privacy | 1 | F-3-1 — hidden at 390px |
| Four prompts to practise an idea | 6 | Pass |
| Explain hard ideas in your own words | 7 | Pass — job headline |
| For STEM and programming learners who want to find gaps in their understanding. | 13 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a due explanation and two recent examples. | 8 | Pass |
| Start a blank explanation | 4 | Pass — result-naming action |
| Choose a topic, then answer four prompts. | 7 | Pass |
| Work stays in this browser | 5 | Pass — `local-private` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Free, with no account | 4 | Pass — `free-no-account` |
| 01–04 | 1 | Pass — range label |
| Mechanism. | 1 | Pass — named prompt for the stated STEM/programming audience |
| Boundary. | 1 | Pass — named prompt |
| Example. | 1 | Pass — named prompt |
| Counterexample. | 1 | Pass — named prompt for the stated audience |
| Four linked tabletop stations show an idea being tested in different ways. | 12 | Pass — image alt text |
| Four prompts in each explanation | 5 | Pass |
| Write a mechanism, boundary, example, and counterexample | 7 | Pass |
| Each prompt asks you to test the idea in a different way. | 12 | Pass — `four-prompt-practice` |
| Type your answer or keep a local audio note. | 9 | Pass — covered by `audio-backup` and `local-private` |
| Explain the mechanism | 3 | Pass |
| Draw the boundary | 3 | F-3-2 |
| Give an example | 3 | Pass |
| Find a counterexample | 3 | Pass |
| How it works | 3 | Pass |
| Three steps to practise and revisit | 6 | Pass |
| Name one hard idea | 4 | Pass |
| Pick something you almost understand. | 5 | Pass |
| Choose a narrow topic so you can check one idea at a time. | 13 | Pass |
| Answer all four prompts | 4 | Pass |
| Write, record, or use both. | 5 | Pass |
| Use your own words; completing all four answers matters more than writing style. | 13 | Pass |
| Return after seven days | 4 | Pass — `four-part-revisit` |
| Completed work enters a revisit queue. | 6 | Pass — the preceding heading defines the seven-day result |
| Read your old answer, then improve the least complete part. | 10 | Pass |
| Limits | 1 | Pass |
| What Explanation Lab does not do | 6 | Pass |
| Explanation Lab does not grade answers or generate explanations. | 9 | Pass — `manual-no-sync` |
| It does not create an account or sync devices. | 9 | Pass — `manual-no-sync` / `free-no-account` |
| Export a JSON backup when you want to move your work. | 11 | Pass — `json-export` |
| Explanation Lab uses four prompts for each explanation. | 8 | Pass — `four-prompt-practice` |
| Terms | 1 | Pass — footer link |
| Visual notes | 2 | Pass — footer link |
| Built by Param Factory | 4 | Pass — external link |
| external site | 2 | Pass — screen-reader disclosure |
| v1.0 · build polish-2 | 4 | Pass — build identity |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass — title |
| Practise hard ideas with four focused prompts. | 7 | Pass |
| Explanation Lab is for students learning abstract STEM or programming concepts. | 11 | Pass |
| Each explanation uses a mechanism, boundary, example, and counterexample. | 9 | Pass — `four-prompt-practice` |
| Completed explanations return after seven days. | 6 | Pass — `four-part-revisit` |
| The app is free and needs no account. | 8 | Pass — `free-no-account` |
| Text and audio notes stay in this browser's local storage. | 10 | Pass — `local-private` / `audio-backup` |
| It works offline after the first visit. | 7 | Pass — `offline-reload` |
| JSON import and export let learners move or back up their work. | 12 | Pass — `json-import` / `json-export` |
| Live site | 2 | Pass — link label |
| One-click sandbox | 2 | Pass — link label |
| Run locally | 2 | Pass — heading |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| `/?demo=1` loads isolated sample data. | 5 | Pass — `one-click-demo` / `demo-isolation` |
| Test and build | 3 | Pass — heading |
| The exact deployment build command is `npm run build`. | 9 | Pass |
| It writes the static site to `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| The Playwright suite checks the demo, backups, offline use, keyboard use, mobile layout, and serious accessibility errors. | 17 | Pass |
| It also checks 200% text resize. | 6 | Pass |
| Chromium for Playwright is required; the work order pins Playwright 1.58.2. | 11 | Pass |
| Data and privacy | 3 | Pass — heading |
| Real work stays in the browser database named `explanation-lab`. | 9 | Pass — implementation detail |
| Demo work stays in the separate browser database named `demo:explanation-lab`. | 10 | Pass — `demo-isolation` |
| Resetting or leaving the demo clears only demo data. | 9 | Pass — `demo-reset-exit` |
| The app does not send your explanations or audio to another website. | 12 | Pass — `local-private` |
| Clearing this site's browser data removes saved work. | 8 | Pass — `site-data-clear` |
| The app checks the whole backup before saving it, so an invalid file does not change saved explanations. | 18 | Pass — `atomic-import-validation` |
| If a backup includes an explanation already in your library, choose whether to replace it or keep the saved version. | 20 | Pass — `duplicate-import-decision` |
| Read the in-app `/privacy` and `/terms` pages for user-facing details. | 10 | Pass |
| The `/visual-notes` page records illustration provenance. | 7 | Pass |
| Deploy | 1 | Pass — heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| Keep `staticwebapp.config.json` at the deployment root so product routes open `index.html` and unknown routes return the designed 404 page. | 19 | Pass |
| The same file applies security headers. | 6 | Pass |
| The service worker caches the app shell and visited build assets. | 11 | Pass |
| Visual assets | 2 | Pass — heading |
| The tabletop apparatus is original generated imagery. | 7 | Pass — provenance is recorded in the repository |
| Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`. | 10 | Pass |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

Terminology is otherwise consistent: an **explanation** contains four **prompts**; unfinished work is a **draft**; scheduled return is a **revisit**; isolated sample work is the **demo**; a portable file is a **JSON backup**.

## Demo and sandbox verification

- One click from `/` opened `/?demo=1` and showed a live dashboard with three realistic records: a due passing-siren explanation, a closure draft, and a completed binary-search explanation.
- At 390×844, the first demo screen showed the two named sample topics in the introduction plus live totals for three records, two completed records, one due record, and one draft. It already looked populated before scrolling.
- The persistent banner read “Demo — sample data, nothing is saved to your work” and exposed **Reset demo** and **Start for real**.
- A newly created stack explanation appeared in the demo. Reset removed it and restored exactly the three seed records. Start for real opened `/practice` and removed the demo banner.
- A fresh demo context opened only `demo:explanation-lab`. The exact `demo-isolation` and `demo-reset-exit` tests also created both real and demo work, then confirmed reset/exit changed only demo work and preserved the real record.
- Live request capture across the landing page, demo write/reset/exit, all routes, and offline preparation recorded 45 requests, all to `https://explanation-lab.sociobot.in`. No analytics, provider API, font CDN, or other third-party request occurred.
- After a first live visit, the context went offline and reloaded the demo with HTTP 200 from the service worker. The siren sample remained visible.

The demo gate passes.

## Claims verification

`.factory/claims.json` contains 18 entries. Every literal command was run at candidate `4647d85c50fa913c14974129bfd68707ef40fc46` from `/tmp/explanation-lab-review3.jFx8hQ/clone` after `npm ci`.

| Claim | Exact test | Result |
| --- | --- | --- |
| `one-click-demo` | `npm test -- --grep @claim:one-click-demo` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `demo-reset-exit` | `npm test -- --grep @claim:demo-reset-exit` | PASS |
| `four-part-revisit` | `npm test -- --grep @claim:four-part-revisit` | PASS |
| `four-prompt-practice` | `npm test -- --grep @claim:four-prompt-practice` | PASS |
| `json-export` | `npm test -- --grep @claim:json-export` | PASS |
| `json-import` | `npm test -- --grep @claim:json-import` | PASS |
| `atomic-import-validation` | `npm test -- --grep @claim:atomic-import-validation` | PASS |
| `duplicate-import-decision` | `npm test -- --grep @claim:duplicate-import-decision` | PASS |
| `audio-backup` | `npm test -- --grep @claim:audio-backup` | PASS |
| `local-private` | `npm test -- --grep @claim:local-private` | PASS |
| `manual-no-sync` | `npm test -- --grep @claim:manual-no-sync` | PASS |
| `no-tracking` | `npm test -- --grep @claim:no-tracking` | PASS |
| `free-no-account` | `npm test -- --grep @claim:free-no-account` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `mobile-ready` | `npm test -- --grep @claim:mobile-ready --project mobile` | PASS |
| `site-data-clear` | `npm test -- --grep @claim:site-data-clear` | PASS |
| `individual-delete` | `npm test -- --grep @claim:individual-delete` | PASS |

The landing page, demo, Privacy, Terms, Visual notes, footer, and README were cross-checked against the manifest. No unlisted functional, privacy, price, offline, import/export, storage, or AI claim was found. No claim remains untested.

## Earlier finding verification

Every finding named by `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the prior handoff was checked against the live site and current source. None is re-opened.

| Earlier ID | Current confirmation |
| --- | --- |
| `F-1-1` | `four-prompt-practice` exists; its exact command passed; the live sample exposed four distinct prompt questions. |
| `F-1-2` | “The workbench,” “A blank page with useful pressure,” and “You do the thinking” are absent. Section headings now name their content. |
| `F-1-3` | The live audience sentence ends with “gaps in their understanding.” |
| `F-1-4` | The footer links to `/visual-notes`; it returned 200 and contained the illustration record. |
| `F-2-1` | Both “sharper” sentences are absent; the two approved direct rewrites are live. |
| `F-2-2` | “Your wording matters more than polish” is absent; the approved direct rewrite is live. |
| `F-2-3` | README now says the app does not send explanations or audio to another website. |
| `F-2-4` | README now explains whole-backup validation and the replace-or-keep choice without database jargon. |
| `QA-01` / `QA2-01` | The route-navigation microphone cleanup regression passed in both projects; source cancels recording on render, page hide, and hidden-tab paths. |
| `QA-02` / `QA2-02` | `atomic-import-validation` passed; source validates dates before import writes. |
| `QA-03` / `QA2-03` | `duplicate-import-decision` passed; matching IDs still require an explicit replace/skip decision. |
| `QA-04` / `QA2-04` | The mobile 200% text regression passed across the reported routes and populated workbench. |
| `QA-05` / `QA2-05` | All 18 manifest commands passed; privacy, reset, audio, import, and prompt claims remain covered. |
| `QA-06` / `QA2-06` | The 44px mobile-target regression passed. |
| `QA-07` / `QA2-07` | The focus-contrast regression passed; the carbon focus token remains in source. |
| `QA-08` / `QA2-08` | `/review-3-missing` returned HTTP 404 with the designed recovery page and “Return home.” |
| `QA-09` / `QA2-09` | The cache-policy regression passed; hashed build files are immutable, stable assets revalidate, and live `sw.js` is `no-cache`. |
| `QA-10` / `QA2-10` | The live footer exposes `v1.0 · build polish-2`. |
| `QA3-01` | Both import-safety claims remain declared and both exact commands passed. |
| `QA5-01` | `individual-delete` passed with cancel and confirm behavior. |
| `QA5-02` | The mobile workbench back-target assertion passed. |
| `QA5-03` | Invalid JSON still produces the tested retry message and leaves the library usable. |

## Structure, accessibility, and delivery

- `/`, `/?demo=1`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` returned 200. The missing route returned 404. All crawled internal and external links returned 200 except the deliberately missing route’s own skip-link URL, which correctly returned 404.
- Every route had one `h1`, one `main`, `lang="en"`, a route-specific title and description, canonical URL, Open Graph title/image, Twitter card, favicon, consistent footer, and no horizontal overflow at 390px.
- SPA link navigation focused and announced the destination `h1`; Back restored `/` and focused its `h1`.
- Axe found zero serious or critical violations across all normal routes and the designed 404. The factory URL verifier reported HTTP 200, one h1, main present, no missing image alt, no unlabeled buttons, and no console errors.
- Live headers include a self-only CSP with `frame-ancestors 'none'` as a response header, `nosniff`, a referrer policy, permissions policy, and cross-origin opener policy.
- The graph-paper field, hard rules, offset shadows, cobalt/orange controls, terse mono copy, and original tabletop apparatus match `.factory/design.md`. The result is distinct from a centered gradient/card SaaS template.
- F-3-1 is the only site-skeleton defect. Routing itself is not broken.

## Missed leverage

No finding. JSON import/export, offline work, local audio, and a seven-day revisit are present. The brief is built around the learner producing the explanation; AI drafting or grading would weaken that job and conflict with the visible, tested limits. Device sync is explicitly and honestly excluded.

## Quality gates

- `npm ci`: passed; 22 packages installed, 0 vulnerabilities.
- All 18 exact claim commands: passed.
- `CI=1 npm test`: 57 passed, 3 intentional desktop skips.
- `CI=1 npm run test:a11y`: 2 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- `npm run build`: passed and produced `dist/`; JS is 34,034 bytes raw / 11.66 KB gzip and CSS is 18,575 bytes raw / 4.68 KB gzip.

## What would make this perfect

Keep Privacy visible in the 390px header and replace “Draw the boundary” with a literal instruction in the preview and workbench. Add regressions for both changes, then repeat the complete review. No functional, claims, demo, privacy, accessibility, routing, visual-identity, or build change is otherwise indicated.
