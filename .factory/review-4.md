# Adversarial first-read review 4 — Explanation Lab

Date: 2026-08-29 UTC

Live URL: <https://explanation-lab.sociobot.in>

Candidate: `4c2bc69b1b98aed5415dcc23b8cc747552473d92`

Method: fresh 390×844 and 1440×900 browser contexts, live request and route checks, and every claim command from a clean clone. No product code was changed.

## Verdict: FAIL

Two blocking demo findings and three minor copy findings remain. The listed claim commands all pass, but the one-click demo does not expose an actual sample record in the first viewport, and ordinary demo navigation bypasses the explicit exit control, enters real mode, and retains demo edits. The latter contradicts an unlisted Privacy-page claim. The acceptance rule requires zero findings and no untested claim.

## First 30 seconds

Before scrolling, both fresh contexts answered all three required questions:

- **What it does:** It helps a learner explain a hard STEM or programming idea through four prompts in their own words.
- **For whom:** STEM and programming learners who want to find gaps in their understanding.
- **What to click first:** “Try it with sample data.” The adjacent result says, “Opens a due explanation and two recent examples.”

At 390×844, the headline occupied y=250–329, the audience sentence y=353–431, the primary action y=463–511, its result y=519–560, and all three facts ended by y=823. The page stayed 390 px wide. Desktop showed the same information without scrolling. Both cold loads returned 200 with no console or page error. The cold-read gate passes.

## Findings

### F-4-1 — BLOCKING — the one-click demo hides every actual sample record below the first viewport

**Location / exact copy:** Landing action “Try it with sample data” and result “Opens a due explanation and two recent examples.” After the click, the demo says “Practice with sample explanations” and shows summary counts, but the first named record, “Why a passing siren changes pitch,” starts at y=1081 on the 390×844 viewport. On desktop it starts at y=885 in a 900 px viewport, leaving only an unreadable edge visible.

**Why this fails:** The supplied demo contract requires the first screen after one click to show the product already being used with realistic sample data. The phone viewport shows the banner, navigation, heading, a generic reference to a siren and closure, “Start another explanation,” and summary counts. It shows no sample topic row, response, prompt, or sample action. A first-time visitor must scroll before seeing the examples the action says it opens.

**Concrete fix:** Make “Try it with sample data” open the completed siren workbench directly, with a realistic filled response visible, or move a named due sample and its “Revisit now” action above the create action and statistics. Extend `@claim:one-click-demo` to assert that a named sample and its populated product state intersect the initial 390×844 and desktop viewports.

### F-4-2 — BLOCKING — demo navigation silently crosses into real storage and does not discard demo edits

**Location / exact copy and behavior:** The banner offers “Start for real,” implying an explicit boundary. The Privacy page promises, “Leaving or resetting the demo removes that sample workspace.” From a modified demo, the header links “Privacy,” “Practice,” and “Library” each removed the banner and entered a non-demo route. The wordmark and footer Privacy, Terms, and Visual notes links behaved the same way. Returning to `/?demo=1` still showed the added probe and four records instead of the three seeds. Clicking “Practice” from the demo and creating “Unexpected real namespace probe” put that record in the real Library without the visitor choosing “Start for real.” Source navigation at `src/main.ts:478–489` clears demo storage only for the dedicated button; ordinary route links and `popstate` do not.

**Why this fails:** The sandbox boundary is not explicit or complete. A visitor can reasonably treat the header’s “Practice” link as practice inside the visible demo, yet it switches namespaces and can write real data. Demo edits also survive other apparent exits, contradicting the Privacy copy and the supplied rule that leaving demo mode discards demo data. The current `demo-reset-exit` claim only names and tests “Reset demo” and “Start for real,” so the broader live sentence is an unlisted, contradicted claim. This reopens the earlier claims-coverage issue recorded as `QA-05` / `QA2-05`.

**Concrete fix:** While the banner is present, keep every product navigation route in the demo namespace, or await demo deletion before any transition to a non-demo route. Cover the wordmark, header and footer links, browser Back/Forward, direct route transitions, and the explicit exit. Update the Privacy sentence and the `demo-reset-exit` manifest claim to the same exact behavior. Add one tagged test that edits demo data, exercises each exit path, confirms a reseeded three-record demo on return, and confirms that real storage remains unchanged until “Start for real” is deliberately selected.

### F-4-3 — Minor — the Privacy h1 is a vague promise rather than a section name

**Location / exact copy:** `/privacy`, h1: “Your explanations stay with you.”

**Why this matters:** “Stay with you” is slogan-like and can imply persistence or cross-device availability, while the page later says browser data can be cleared and the product does not sync. It does not name what the page explains.

**Concrete fix:** Replace it with “How Explanation Lab stores your work” or “How your explanations stay in this browser.”

### F-4-4 — Minor — the verb spelling changes between metadata and visible copy

**Location / exact copy:** Live title and source metadata: “Explanation Lab — Practice explaining hard ideas” and “Practice explaining a mechanism…”. Landing and README use British verb spelling: “Four prompts to practise an idea” and “Practise hard ideas with four focused prompts.” The nav label “Practice” is correctly a noun.

**Why this matters:** The same verb is spelled two ways in the same product. This is an avoidable terminology inconsistency in the browser title, search description, Open Graph title, and Twitter title.

**Concrete fix:** Use “Explanation Lab — Practise explaining hard ideas” and “Practise explaining a mechanism…” in `index.html` and the `/` route metadata. Keep “Practice” only where it is a noun.

### F-4-5 — Minor — the README labels the demo with developer jargon

**Location / exact copy:** `README.md`, “One-click sandbox”.

**Why this matters:** “Sandbox” describes an implementation boundary, not what a learner gets after following the link. It is unnecessary jargon in the product’s primary documentation.

**Concrete fix:** Replace it with “Try the sample demo” or “Try it with sample data.”

## Copy audit

Counts are whitespace-separated. Headings, labels, actions, alt text, and accessibility copy are included because visitors encounter them independently. No landing or README item exceeds 22 words, no banned marketing adjective appears, and every landing button names a result. `F-4-5` is the only flag inside these two requested surfaces; `F-4-3` and `F-4-4` concern another live route and metadata.

### Landing page

| Sentence or standalone copy | Words | Audit |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Explanation Lab | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| Practice | 1 | Pass — noun / navigation |
| Library | 1 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| Four prompts to practise an idea | 6 | Pass |
| Explain hard ideas in your own words | 7 | Pass — job headline |
| For STEM and programming learners who want to find gaps in their understanding. | 13 | Pass |
| Try it with sample data | 5 | Pass — result-naming action; viewport result fails F-4-1 |
| Opens a due explanation and two recent examples. | 8 | F-4-1 behavior |
| Start a blank explanation | 4 | Pass — result-naming action |
| Choose a topic, then answer four prompts. | 7 | Pass |
| Work stays in this browser | 5 | Pass — `local-private` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Free, with no account | 4 | Pass — `free-no-account` |
| 01–04 | 1 | Pass — range label |
| Mechanism. | 1 | Pass — named prompt |
| Boundary. | 1 | Pass — named prompt |
| Example. | 1 | Pass — named prompt |
| Counterexample. | 1 | Pass — named prompt |
| Four linked tabletop stations show an idea being tested in different ways. | 12 | Pass — image alt text |
| Four prompts in each explanation | 5 | Pass |
| Write a mechanism, boundary, example, and counterexample | 7 | Pass |
| Each prompt asks you to test the idea in a different way. | 12 | Pass — `four-prompt-practice` |
| Type your answer or keep a local audio note. | 9 | Pass — `audio-backup` / `local-private` |
| 01 | 1 | Pass — step label |
| Explain the mechanism | 3 | Pass |
| 02 | 1 | Pass — step label |
| State where the idea applies | 5 | Pass |
| 03 | 1 | Pass — step label |
| Give an example | 3 | Pass |
| 04 | 1 | Pass — step label |
| Find a counterexample | 3 | Pass |
| How it works | 3 | Pass — section label |
| Three steps to practise and revisit | 6 | Pass |
| Name one hard idea | 4 | Pass |
| Pick something you almost understand. | 5 | Pass |
| Choose a narrow topic so you can check one idea at a time. | 13 | Pass |
| Answer all four prompts | 4 | Pass |
| Write, record, or use both. | 5 | Pass |
| Use your own words; completing all four answers matters more than writing style. | 13 | Pass |
| Return after seven days | 4 | Pass — `four-part-revisit` |
| Completed work enters a revisit queue. | 6 | Pass — `four-part-revisit` |
| Read your old answer, then improve the least complete part. | 10 | Pass |
| Limits | 1 | Pass — section label |
| What Explanation Lab does not do | 6 | Pass |
| Explanation Lab does not grade answers or generate explanations. | 9 | Pass — `manual-no-sync` |
| It does not create an account or sync devices. | 9 | Pass — `manual-no-sync` / `free-no-account` |
| Export a JSON backup when you want to move your work. | 11 | Pass — `json-export` |
| Explanation Lab uses four prompts for each explanation. | 8 | Pass — footer / `four-prompt-practice` |
| Privacy | 1 | Pass — footer link |
| Terms | 1 | Pass — footer link |
| Visual notes | 2 | Pass — footer link |
| Built by Param Factory | 4 | Pass — external link |
| external site | 2 | Pass — screen-reader disclosure |
| v1.0 · build polish-3 | 4 | Pass — build identity |

### README

| Sentence or standalone copy | Words | Audit |
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
| One-click sandbox | 2 | F-4-5 — jargon |
| Run locally | 2 | Pass — heading |
| Requirements: Node.js 20 or newer. | 5 | Pass — developer prerequisite |
| Open the local URL printed by Vite. | 7 | Pass — developer instruction |
| `/?demo=1` loads isolated sample data. | 5 | Pass — `one-click-demo` / `demo-isolation` |
| Test and build | 3 | Pass — heading |
| The exact deployment build command is `npm run build`. | 9 | Pass — developer instruction |
| It writes the static site to `dist/`, with `dist/index.html` at its root. | 12 | Pass — developer instruction |
| The Playwright suite checks the demo, backups, offline use, keyboard use, mobile layout, and serious accessibility errors. | 17 | Pass — developer instruction |
| It also checks 200% text resize. | 6 | Pass — developer instruction |
| Chromium for Playwright is required; the work order pins Playwright 1.58.2. | 11 | Pass — developer prerequisite |
| Data and privacy | 3 | Pass — heading |
| Real work stays in the browser database named `explanation-lab`. | 9 | Pass — implementation detail |
| Demo work stays in the separate browser database named `demo:explanation-lab`. | 10 | Pass — `demo-isolation` |
| Resetting or leaving the demo clears only demo data. | 9 | F-4-2 — contradicted by ordinary demo exits |
| The app does not send your explanations or audio to another website. | 12 | Pass — `local-private` |
| Clearing this site's browser data removes saved work. | 8 | Pass — `site-data-clear` |
| The app checks the whole backup before saving it, so an invalid file does not change saved explanations. | 18 | Pass — `atomic-import-validation` |
| If a backup includes an explanation already in your library, choose whether to replace it or keep the saved version. | 20 | Pass — `duplicate-import-decision` |
| Read the in-app `/privacy` and `/terms` pages for user-facing details. | 10 | Pass |
| The `/visual-notes` page records illustration provenance. | 6 | Pass |
| Deploy | 1 | Pass — heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass — developer instruction |
| Keep `staticwebapp.config.json` at the deployment root so product routes open `index.html` and unknown routes return the designed 404 page. | 19 | Pass — developer instruction |
| The same file applies security headers. | 6 | Pass — developer instruction |
| The service worker caches the app shell and visited build assets. | 11 | Pass — deployment detail |
| Visual assets | 2 | Pass — heading |
| The tabletop apparatus is original generated imagery. | 7 | Pass — provenance statement |
| Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`. | 10 | Pass — provenance location |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

### Terminology

| Concept | Consistent term |
| --- | --- |
| One saved learning unit | explanation |
| Its four parts | prompts |
| Unfinished work | draft |
| Scheduled return | revisit |
| Isolated sample mode | demo |
| Non-demo records | real work |
| Portable file | JSON backup |
| Verb for doing the exercise | practise — except metadata in F-4-4 |

## Demo and sandbox verification

- One click from `/` reached `/?demo=1` and seeded three realistic records: a due passing-siren explanation, a closure draft, and a completed binary-search explanation.
- The persistent banner read “Demo — sample data, nothing is saved to your work” and showed **Reset demo** and **Start for real**.
- The demo dashboard showed totals of three records, two completed, one due, and one draft. F-4-1 records why this still fails the initial-viewport requirement.
- Creating a demo explanation, then using **Reset demo**, removed it and restored exactly the three seeds. The exact reset/explicit-exit claim test also preserved a pre-existing real record.
- A fresh demo used `demo:explanation-lab`; real work used `explanation-lab`. The explicit isolation tests passed.
- Ordinary demo route links bypassed that explicit boundary and retained demo work; the Practice path also allowed a real record without selecting **Start for real**. F-4-2 is blocking.
- A live request log across landing, demo work, reset, exit, routes, and offline preparation recorded 42 requests, all from `https://explanation-lab.sociobot.in`. No analytics, provider API, font CDN, or other origin appeared.
- After service-worker installation, a live 390 px context reloaded `/?demo=1` offline with all three samples and its stylesheet.

## Claims verification

The clean clone was `/tmp/explanation-lab-review4-claims.LO5C18/clone` at the candidate commit. `npm ci` installed 22 packages with zero vulnerabilities. Every literal command in `.factory/claims.json` passed, and every claim tag occurs exactly once in `tests/app.spec.ts`.

| Claim ID | Exact command result |
| --- | --- |
| `one-click-demo` | PASS — desktop and mobile |
| `demo-isolation` | PASS — desktop and mobile |
| `demo-reset-exit` | PASS — desktop and mobile; assertion gap in F-4-2 |
| `four-part-revisit` | PASS — desktop and mobile |
| `four-prompt-practice` | PASS — desktop and mobile |
| `json-export` | PASS — desktop and mobile |
| `json-import` | PASS — desktop and mobile |
| `atomic-import-validation` | PASS — desktop and mobile |
| `duplicate-import-decision` | PASS — desktop and mobile |
| `audio-backup` | PASS — desktop and mobile |
| `local-private` | PASS — desktop and mobile |
| `manual-no-sync` | PASS — desktop and mobile |
| `no-tracking` | PASS — desktop and mobile |
| `free-no-account` | PASS — desktop and mobile |
| `offline-reload` | PASS — desktop and mobile |
| `mobile-ready` | PASS — mobile project |
| `site-data-clear` | PASS — desktop and mobile |
| `individual-delete` | PASS — desktop and mobile |

The live Privacy sentence “Leaving or resetting the demo removes that sample workspace” and the README sentence “Resetting or leaving the demo clears only demo data” are broader than the listed `demo-reset-exit` claim and are contradicted by header/footer navigation. They are unlisted claims under F-4-2. No listed claim test failed; no other unlisted functional, price, offline, privacy, import/export, or AI claim was found.

## Earlier finding verification

Every earlier review, polish report, and handoff was read. Current live behavior and source were checked instead of accepting prior “fixed” labels.

| Earlier ID | Current confirmation |
| --- | --- |
| `F-1-1` | `four-prompt-practice` remains declared once; its exact test passed and the live sample exposes four distinct questions. |
| `F-1-2` | “The workbench,” “A blank page with useful pressure,” and “You do the thinking” remain absent; landing sections use direct names. |
| `F-1-3` | The live audience sentence ends with “gaps in their understanding.” |
| `F-1-4` | `/visual-notes` returned 200 and remains linked from every footer. |
| `F-2-1` | Both “sharper” metaphors remain absent; the approved direct topic and revisit instructions are live. |
| `F-2-2` | “Your wording matters more than polish” remains absent; the direct completion guidance is live. |
| `F-2-3` | README uses the plain statement that explanations and audio are not sent to another website. |
| `F-2-4` | README explains whole-backup validation and replace-or-keep behavior without “atomic write” or “matching IDs.” |
| `F-3-1` | All four header destinations, including Privacy, are visible and operable at 390 px; each measured at least 179×44 px. |
| `F-3-2` | “Draw the boundary” remains absent; landing and workbench use “State where the idea applies.” |
| `QA-01` / `QA2-01` | The microphone route-cleanup regression passed in desktop and mobile; render, page-hide, and hidden-tab cleanup remains in source. |
| `QA-02` / `QA2-02` | `atomic-import-validation` passed in both projects; invalid dates are checked before writes. |
| `QA-03` / `QA2-03` | `duplicate-import-decision` passed in both projects; replace/skip remains explicit. |
| `QA-04` / `QA2-04` | The 200% mobile reflow regression passed across normal routes and the populated workbench; live checks found zero overflow. |
| `QA-05` / `QA2-05` | **Reopened by F-4-2:** all 18 listed tags are unique and pass, but the broader live/README demo-leaving promise is unlisted and contradicted. |
| `QA-06` / `QA2-06` | The repeated mobile-target regression passed; live 200% checks found no sub-44 px target. |
| `QA-07` / `QA2-07` | The focus-contrast regression passed and live keyboard focus is visible. |
| `QA-08` / `QA2-08` | `/review-4-missing` returned HTTP 404 with the designed recovery page and “Return home.” |
| `QA-09` / `QA2-09` | The cache-policy regression passed; hashed build files are immutable, stable assets revalidate, and `sw.js` is no-cache. |
| `QA-10` / `QA2-10` | Every live footer exposes `v1.0 · build polish-3`. |
| `QA3-01` | Both import-safety claims remain listed separately and both exact commands passed. |
| `QA5-01` | `individual-delete` passed cancel and confirm behavior in both projects. |
| `QA5-02` | The mobile workbench back target remains at least 44 px; the target-size regression passed. |
| `QA5-03` | Malformed/invalid import recovery remains plain and leaves the library usable; import regressions passed. |

No earlier `F-*` finding is reopened. The earlier claims-coverage ID is reopened because F-4-2 exposes a still-untested live promise.

## Structure, accessibility, and delivery

- `/`, `/?demo=1`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` returned 200. `/review-4-missing` returned 404 with the designed page.
- Every route had `lang="en"`, one h1, one main, a route-specific title and description, canonical and social metadata, favicon, Apple icon, and consistent header/footer. F-4-4 is the only metadata-copy issue.
- SPA navigation and browser Back focused the destination h1 and updated the polite route announcement. Deep links and reloads opened their requested state.
- Every crawled internal URL and the external Param Factory link resolved. `robots.txt`, `sitemap.xml`, the favicon, Apple icon, and 1200×630 social image returned 200.
- The live response sends a self-only CSP with `frame-ancestors 'none'` in the header, plus nosniff, referrer, permissions, HSTS, and opener policies. Normal routes produced no console error.
- Live and local axe checks reported zero serious or critical violations. Reduced motion removed the workbench animation; 390 px and 200% text checks found no overflow or undersized repeated target.
- The graph-paper field, hard black rules, cobalt and orange controls, offset shadows, mono text, and original tabletop apparatus match `.factory/design.md`. The site is visually distinct from a centered gradient/card SaaS template.
- The clean full suite passed: 57 tests, 3 intentional desktop skips. Dedicated accessibility tests: 2 passed. Typecheck, unused-code lint, high-severity audit, and production build passed. `dist/` contains `index.html`; JS is 34.04 KB raw / 11.65 KB gzip and CSS is 18.54 KB raw / 4.66 KB gzip.
- `/opt/fleet/lib/verify-url.sh` passed the live demo: HTTP 200, `Demo — Explanation Lab`, `lang=en`, one h1, main present, no missing alt text, no unlabeled button, and no console error.

## Missed leverage

No additional feature finding. The brief centers on the learner writing the explanation. AI drafting or grading would conflict with the product’s visible, tested manual-practice limit. JSON import/export, local audio, offline use, and a revisit queue cover the obvious local-first extensions. Device sync is explicitly excluded rather than implied.

## What would make this perfect

Show a real populated sample in the initial post-click viewport; make every demo exit preserve the sandbox boundary and discard demo work as promised; add viewport and all-exit claim assertions; replace the vague Privacy h1; standardize the verb spelling; and rename the README demo link in learner language. Then repeat the complete review. Nothing else is currently indicated by the functional, accessibility, routing, build, or visual checks.
