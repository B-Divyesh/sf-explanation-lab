# Adversarial first-read review 2 — Explanation Lab

Date: 2026-08-29 UTC  
Live URL: <https://explanation-lab.sociobot.in>  
Method: fresh desktop (1440×900) and phone (390×844) browser contexts; fresh local dependency install; no product code changed.

## Verdict: FAIL

The product passes the cold-read, demo, claims, privacy, routing, and historical-regression gates. Four minor copy findings remain. The supplied acceptance rule permits `PASS` only with zero findings.

## First 30 seconds

Before scrolling, both fresh contexts answered the required questions.

- **What it does:** It helps someone practise explaining a hard STEM or programming idea through mechanism, boundary, example, and counterexample prompts.
- **For whom:** “For STEM and programming learners who want to find gaps in their understanding.”
- **What to click first:** “Try it with sample data.” The adjacent outcome says, “Opens a due explanation and two recent examples.”

The 390px page showed the headline, audience, primary action, outcome, and three facts without horizontal overflow (390px body width). The main request had HTTP 200 and no console/page error in either cold context. This gate passes.

## Findings

### F-2-1 — Minor — two landing sentences use metaphor instead of direct instructions

**Location / exact copy:** landing “How it works,” “A narrow topic gives you a sharper test.” and “Read your old answer, then sharpen the weakest part.”

**Why this fails:** “Sharper” and “sharpen” are figurative. A first-time visitor needs the concrete action, not a study metaphor. This conflicts with the supplied no-metaphor plain-words rule.

**Concrete fix:** Replace them with “Choose a narrow topic so you can check one idea at a time.” and “Read your old answer, then improve the least complete part.”

### F-2-2 — Minor — landing guidance uses a vague writing-style metaphor

**Location / exact copy:** landing “Your wording matters more than polish.”

**Why this fails:** “Polish” does not name the practical choice the learner should make. It can mean spelling, style, confidence, or detail.

**Concrete fix:** Replace it with “Use your own words; completing all four answers matters more than writing style.”

### F-2-3 — Minor — README privacy statement uses implementation jargon

**Location / exact copy:** [README.md](../README.md#L43), “The app makes no cross-origin runtime requests.”

**Why this fails:** “Cross-origin runtime requests” is browser-engineering language, not an explanation of privacy for a learner. The underlying privacy promise is declared and tested as `local-private`, so this is a wording problem rather than an unlisted-claim problem.

**Concrete fix:** Replace it with “The app does not send your explanations or audio to another website.”

### F-2-4 — Minor — README backup guidance exposes storage jargon

**Location / exact copy:** [README.md](../README.md#L45), “Imports are validated before one atomic write. Matching IDs ask whether to replace or skip the saved explanation.”

**Why this fails:** “Atomic write” and “matching IDs” ask a learner to understand database terminology before they can judge whether an import is safe. The underlying behavior is correctly declared and tested as `atomic-import-validation` and `duplicate-import-decision`.

**Concrete fix:** Replace both sentences with “The app checks the whole backup before saving it, so an invalid file does not change saved explanations. If a backup includes an explanation already in your library, choose whether to replace it or keep the saved version.”

## Copy audit

Counts use whitespace-separated words. Headings, labels, and actions are included because they are encountered independently. No landing or README sentence exceeds 22 words. The only flags are `F-2-1` through `F-2-4`; no banned marketing adjective, inconsistent core term, empty heading, or non-result-naming action was found.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass — wordmark |
| Demo / Practice / Library / Privacy | 1 each | Pass — navigation labels |
| Four prompts to practise an idea | 6 | Pass — informative label |
| Explain hard ideas in your own words | 7 | Pass — direct job headline |
| For STEM and programming learners who want to find gaps in their understanding. | 13 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a due explanation and two recent examples. | 8 | Pass |
| Start a blank explanation | 4 | Pass — result-naming action |
| Choose a topic, then answer four prompts. | 7 | Pass |
| Work stays in this browser | 5 | Pass — `local-private` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Free, with no account | 4 | Pass — `free-no-account` |
| Mechanism. Boundary. Example. Counterexample. | 4 | Pass — names the four prompts |
| Four prompts in each explanation | 5 | Pass — section label |
| Write a mechanism, boundary, example, and counterexample | 7 | Pass — section heading |
| Each prompt asks you to test the idea in a different way. | 12 | Pass — `four-prompt-practice` |
| Type your answer or keep a local audio note. | 9 | Pass — audio capability covered by `audio-backup` |
| Explain the mechanism / Draw the boundary / Give an example / Find a counterexample | 3 / 3 / 3 / 3 | Pass — prompt actions |
| How it works | 3 | Pass — section label |
| Three steps to practise and revisit | 6 | Pass — section heading |
| Name one hard idea | 4 | Pass |
| Pick something you almost understand. | 5 | Pass |
| A narrow topic gives you a sharper test. | 8 | F-2-1 |
| Answer all four prompts | 4 | Pass |
| Write, record, or use both. | 5 | Pass |
| Your wording matters more than polish. | 6 | F-2-2 |
| Return after seven days | 4 | Pass — `four-part-revisit` |
| Completed work enters a revisit queue. | 6 | Pass — `four-part-revisit` |
| Read your old answer, then sharpen the weakest part. | 9 | F-2-1 |
| Limits | 1 | Pass — section label |
| What Explanation Lab does not do | 6 | Pass — section heading |
| Explanation Lab does not grade answers or generate explanations. | 9 | Pass — `manual-no-sync` |
| It does not create an account or sync devices. | 9 | Pass — `manual-no-sync` / `free-no-account` |
| Export a JSON backup when you want to move your work. | 11 | Pass — `json-export` |
| Explanation Lab uses four prompts for each explanation. | 8 | Pass — footer / `four-prompt-practice` |
| Terms / Visual notes / Built by Param Factory | 1 / 2 / 4 | Pass — footer labels |
| v1.0 · build polish-1 | 3 | Pass — build identity |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Practise hard ideas with four focused prompts. | 6 | Pass |
| Explanation Lab is for students learning abstract STEM or programming concepts. | 11 | Pass |
| Each explanation uses a mechanism, boundary, example, and counterexample. | 9 | Pass — `four-prompt-practice` |
| Completed explanations return after seven days. | 6 | Pass — `four-part-revisit` |
| The app is free and needs no account. | 8 | Pass — `free-no-account` |
| Text and audio notes stay in this browser's local storage. | 10 | Pass — `local-private` / `audio-backup` |
| It works offline after the first visit. | 7 | Pass — `offline-reload` |
| JSON import and export let learners move or back up their work. | 12 | Pass — `json-import` / `json-export` |
| Live site / One-click sandbox / Run locally / Test and build / Data and privacy / Deploy / Visual assets / License | 2 / 2 / 2 / 3 / 3 / 1 / 2 / 1 | Pass — headings/labels |
| Requirements: Node.js 20 or newer. | 5 | Pass — developer prerequisite |
| Open the local URL printed by Vite. | 7 | Pass — developer instruction |
| `/?demo=1` loads isolated sample data. | 5 | Pass — `one-click-demo` / `demo-isolation` |
| The exact deployment build command is `npm run build`. | 9 | Pass — developer instruction |
| It writes the static site to `dist/`, with `dist/index.html` at its root. | 12 | Pass — developer instruction |
| The Playwright suite checks the demo, backups, offline use, keyboard use, mobile layout, and serious accessibility errors. | 17 | Pass — developer instruction |
| It also checks 200% text resize. | 6 | Pass — developer instruction |
| Chromium for Playwright is required; the work order pins Playwright 1.58.2. | 11 | Pass — developer instruction |
| Real work stays in the browser database named `explanation-lab`. | 9 | Pass — implementation name needed for data removal |
| Demo work stays in the separate browser database named `demo:explanation-lab`. | 10 | Pass — demo namespace |
| Resetting or leaving the demo clears only demo data. | 8 | Pass — `demo-reset-exit` |
| The app makes no cross-origin runtime requests. | 7 | F-2-3 |
| Clearing this site's browser data removes saved work. | 8 | Pass — `site-data-clear` |
| Imports are validated before one atomic write. | 7 | F-2-4 |
| Matching IDs ask whether to replace or skip the saved explanation. | 10 | F-2-4 |
| Read the in-app `/privacy` and `/terms` pages for user-facing details. | 10 | Pass |
| The `/visual-notes` page records illustration provenance. | 7 | Pass |
| Deploy the contents of `dist/` as a static site. | 8 | Pass — developer instruction |
| Keep `staticwebapp.config.json` at the deployment root so product routes open `index.html` and unknown routes return the designed 404 page. | 17 | Pass — deployment instruction |
| The same file applies security headers. | 6 | Pass — deployment instruction |
| The service worker caches the app shell and visited build assets. | 10 | Pass — deployment instruction |
| The tabletop apparatus is original generated imagery. | 7 | Pass — provenance statement |
| Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`. | 10 | Pass — provenance location |
| MIT. See `LICENSE`. | 3 | Pass |

Terminology remains consistent: an **explanation** contains four **prompts**; the isolated sample workspace is **demo**; saved non-demo work is **real work**; a portable file is a **JSON backup**. “Work” is the product’s user-facing collective term.

## Demo, claims, sandbox, and privacy

One click on the landing action opened `/?demo=1` with three realistic explanations: a due siren explanation, a JavaScript closure draft, and a completed binary-search explanation. The first screen therefore showed the product already in use. The persistent banner read “Demo — sample data, nothing is saved to your work” and exposed **Reset demo** and **Start for real**.

Live exercise opened the due sample, showed all four mechanism/boundary/example/counterexample tabs, returned to the overview, and reset back to exactly three samples. The live request log during landing, demo, prompt opening, reset, and exit contained only same-origin document, JS, CSS, and image requests; it had no console or page errors. The source uses separate `demo:explanation-lab` and `explanation-lab` IndexedDB namespaces, and the exact sandbox isolation/reset tests passed.

`.factory/claims.json` contains 18 declarations. After `npm ci`, every literal test command in it passed. Non-mobile commands ran in desktop and mobile projects; `mobile-ready` ran in the stipulated mobile project. Passing IDs: `one-click-demo`, `demo-isolation`, `demo-reset-exit`, `four-part-revisit`, `four-prompt-practice`, `json-export`, `json-import`, `atomic-import-validation`, `duplicate-import-decision`, `audio-backup`, `local-private`, `manual-no-sync`, `no-tracking`, `free-no-account`, `offline-reload`, `mobile-ready`, `site-data-clear`, and `individual-delete`.

Cross-checking landing, demo, footer, README, Privacy, Terms, and Visual notes found no undeclared functional, privacy, pricing, offline, or data-handling claim. The four findings above are wording issues; their underlying claims already have declarations and sandbox tests.

## Earlier findings: live and code regression check

| Earlier finding | Confirmation in this review |
| --- | --- |
| F-1-1 | `four-prompt-practice` is declared once and its tagged test passes; live sample exposed all four distinct prompt tabs. |
| F-1-2 | The former mood headings are absent. Current headings name their sections: “Four prompts in each explanation,” “Three steps to practise and revisit,” and “What Explanation Lab does not do.” |
| F-1-3 | Live hero now says “find gaps in their understanding.” |
| F-1-4 | The footer links to `/visual-notes`; the route returned 200 and carries illustration provenance. |
| QA3-01 | Both import-safety behaviors have their own claims and passing demo-entry tests. |
| QA5-01 | `individual-delete` is declared and its tagged cancel/confirm test passes. |
| QA5-02 | Current CSS/test coverage includes a 44px mobile workbench back target; local full suite passed. |
| QA5-03 | Source catches invalid JSON and presents the plain retry message asserted by the regression suite. |
| QA-01–QA-10 / QA2-01–QA2-10 | Source and passing full regression suite confirm microphone cleanup, atomic import validation, duplicate decision, 200% reflow, claims coverage, 44px repeated targets, focus contrast, real 404, cache policy, and footer build identity. |

None of those earlier IDs is re-opened.

## Structure and quality checks

- `/`, `/?demo=1`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` returned HTTP 200. An unknown path returned HTTP 404 with the designed recovery page.
- Landing and demo have one `h1`; page titles are route-specific, descriptions/canonical/OG/Twitter metadata, SVG favicon, apple touch icon, robots, sitemap, and manifest are present. The SPA sets focus to the destination `h1` and announces route changes; the regression suite covers keyboard and route focus.
- Live header/footer are consistent and expose the skip link, Demo, Practice, Library, Privacy, Terms, Visual notes, and the external Param Factory link. The live crawl found no dead internal link.
- The paper/ink/cobalt graph-paper instrument design is distinct from a generic SaaS template and matches `.factory/design.md`’s neo-brutalist reasoning-workbench thesis.
- `CI=1 npm test`, `npm run test:a11y`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed from this checkout. Build output exists in `dist/`.

## Missed leverage

No finding. The brief calls for deliberately manual explanation practice. An AI drafting or grading feature would conflict with the visible, tested limitation that the app does not generate or grade explanations. JSON import/export is present; device sync is honestly excluded.

## What would make this perfect

Apply the four exact copy rewrites in F-2-1 through F-2-4, add assertions for those phrases to the existing copy regression, then repeat this full review. The functional product, demo sandbox, privacy behavior, visual identity, and delivery mechanics need no expansion.
