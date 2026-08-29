# Adversarial first-read review 1 — Explanation Lab

Date: 2026-08-29 UTC  
Live URL: <https://explanation-lab.sociobot.in>  
Viewport checks: fresh 390×844 mobile and 1440×900 desktop contexts

## Verdict: FAIL

The product is clear and usable on first view, and the functional, privacy, demo, route, and accessibility checks passed. It still has one claims-contract failure and three copy/disclosure findings. Per the work order, any finding means this is not a PASS.

## First 30 seconds

Before scrolling, both fresh contexts answered all three required questions.

- **What it does:** It helps a learner practise one hard STEM or programming idea using a mechanism, boundary, example, and counterexample, then revisit it after seven days.
- **For whom:** “For STEM and programming learners who want to find gaps before those gaps find them.”
- **What to click:** “Try it with sample data”; the adjacent result text says “Opens a due explanation and two recent examples.”

This passes the cold-read gate. At 390 px, the primary action was visible, full width, and there was no horizontal overflow. The headline is seven words and the supporting sentence is 15 words.

## Findings

### F-1-1 — BLOCKING — core product claims are not listed in `.factory/claims.json`

**Location / exact copy:** landing preview, “Each prompt asks for a different kind of proof.”; landing footer, “Explanation Lab makes you test an idea four ways.”

**Why this fails:** These are visitor-facing functional claims. The manifest declares `four-part-revisit`, but its claim is only “Completed explanations return after seven days.” It does not state the four-prompt/different-kind-of-proof promise. The tagged test happens to exercise four prompts, but the claims contract requires the claim itself to be listed and tested, not inferred from another claim.

**Concrete fix:** Add one `four-prompt-practice` manifest entry and exactly one `@claim:four-prompt-practice` demo-entry test that opens a sample or new demo explanation and confirms all four named prompts are presented as distinct mechanism, boundary, example, and counterexample prompts. Alternatively, replace both sentences with non-claim descriptive copy. Retain the current `four-part-revisit` claim for the seven-day promise.

### F-1-2 — Minor — three headings use mood or metaphor instead of naming their sections

**Location / exact copy:** “The workbench”; “A blank page with useful pressure”; “You do the thinking.”

**Why this fails:** A first-time visitor and a screen-reader heading list receive a metaphor (“workbench”), a mood line (“useful pressure”), and a slogan (“You do the thinking”), rather than a section name. They do not say what content follows. This conflicts with the supplied plain-words requirement that headings name their section and carry information.

**Concrete fix:** Use “Four prompts in each explanation” for the preview section and “What Explanation Lab does not do” for the limits section. Delete “A blank page with useful pressure”, or replace it with “Write a mechanism, boundary, example, and counterexample.”

### F-1-3 — Minor — the hero’s audience sentence uses a metaphor where a direct benefit is clearer

**Location / exact copy:** “For STEM and programming learners who want to find gaps before those gaps find them.”

**Why this fails:** “Before those gaps find them” is a metaphor and makes the outcome less direct on a five-second phone read.

**Concrete fix:** “For STEM and programming learners who want to find gaps in their understanding.”

### F-1-4 — Minor — the footer says a disclosure exists but offers no way to read it

**Location / exact copy:** “Generated illustration disclosed in the visual notes.”

**Why this fails:** There is no “visual notes” route or footer link on the live site. A visitor cannot verify the claimed disclosure or provenance.

**Concrete fix:** Add a linked, public “Visual notes” page containing the asset provenance, or change the footer to a complete statement with a reachable destination, for example “Original generated illustration; see Visual notes.”

## Copy audit

Counts use whitespace-separated words; standalone labels, headings, and buttons are included because visitors encounter them as independent copy. No landing item exceeds 22 words. `F-1-2` through `F-1-4` identify the flags below; the README has one over-limit sentence.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass |
| Demo | 1 | Pass |
| Practice | 1 | Pass |
| Library | 1 | Pass |
| Privacy | 1 | Pass |
| A four-part reasoning practice | 4 | Jargon-lite; prefer “Four prompts to practise an idea.” |
| Explain hard ideas in your own words | 7 | Pass |
| For STEM and programming learners who want to find gaps before those gaps find them. | 15 | F-1-3 |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a due explanation and two recent examples. | 8 | Pass |
| Start a blank explanation | 4 | Pass — result-naming action |
| Choose a topic, then answer four prompts. | 7 | Pass |
| Work stays in this browser | 5 | Pass — declared privacy claim |
| Works offline after the first visit | 6 | Pass — declared claim |
| Free, with no account | 4 | Pass — declared claim |
| Mechanism. Boundary. Example. Counterexample. | 4 | Pass |
| The workbench | 2 | F-1-2 |
| A blank page with useful pressure | 6 | F-1-2 |
| Each prompt asks for a different kind of proof. | 9 | F-1-1 |
| Type your answer or keep a local audio note. | 9 | Pass |
| Explain the mechanism | 3 | Pass |
| Draw the boundary | 3 | Pass |
| Give an example | 3 | Pass |
| Find a counterexample | 3 | Pass |
| How it works | 3 | Pass |
| Build, test, then revisit | 4 | Pass in context; “Three steps to practise and revisit” is plainer |
| Name one hard idea | 4 | Pass |
| Pick something you almost understand. | 5 | Pass |
| A narrow topic gives you a sharper test. | 8 | Pass |
| Answer all four prompts | 4 | Pass |
| Write, record, or use both. | 5 | Pass |
| Your wording matters more than polish. | 6 | Pass |
| Return after seven days | 4 | Pass |
| Completed work enters a revisit queue. | 6 | Pass — declared claim |
| Read your old answer, then sharpen the weakest part. | 9 | Pass |
| Honest limits | 2 | Pass |
| You do the thinking | 4 | F-1-2 |
| Explanation Lab does not grade answers or generate explanations. | 9 | Pass — declared claim |
| It does not create an account or sync devices. | 9 | Pass — declared claim |
| Export a JSON backup when you want to move your work. | 11 | Pass — declared claim |
| Explanation Lab makes you test an idea four ways. | 9 | F-1-1 |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| Generated illustration disclosed in the visual notes | 7 | F-1-4 |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass |
| Practice explaining hard ideas with a mechanism, boundary, example, and counterexample. | 11 | Pass |
| Explanation Lab is for students learning abstract STEM or programming concepts. | 11 | Pass |
| It turns free-form study notes into a repeatable four-prompt practice. | 10 | Pass |
| Completed explanations return to a revisit queue after seven days. | 10 | Pass — declared claim |
| The app is free and needs no account. | 8 | Pass — declared claim |
| Text and audio notes stay in IndexedDB in the current browser. | 11 | Jargon; prefer “Text and audio notes stay in this browser’s local storage.” |
| It works offline after the first visit. | 7 | Pass — declared claim |
| JSON import and export let learners move or back up their work. | 12 | Pass |
| Live site | 2 | Pass |
| One-click sandbox | 2 | Pass |
| Run locally | 2 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| `/demo` loads isolated sample data. | 5 | Pass |
| Test and build | 3 | Pass |
| The exact deployment build command is `npm run build`. | 9 | Pass |
| It writes the static site to `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| The Playwright suite checks the full four-prompt flow, demo isolation, local audio, JSON import and export, offline reload, 200% text reflow, keyboard use, the 390px layout, and serious accessibility issues. | 30 | Over 22 words. Rewrite: “The test suite checks the demo, backups, offline use, keyboard use, mobile layout, and serious accessibility errors. It also checks 200% text resize.” |
| Chromium for Playwright is required; the work order pins Playwright 1.58.2. | 11 | Pass |
| Data and privacy | 3 | Pass |
| Real work uses the `explanation-lab` IndexedDB database. | 7 | Jargon; pair with plain browser-storage wording |
| Demo work uses the separate `demo:explanation-lab` database. | 7 | Jargon; pair with plain browser-storage wording |
| Resetting or leaving the demo clears only demo data. | 9 | Pass — declared claim |
| The app makes no cross-origin runtime requests. | 7 | Technical but useful; explain as “does not contact another site” first |
| Clearing this site's browser data removes saved work. | 8 | Pass — declared claim |
| Imports are validated before one atomic write. | 7 | Technical; the declared safety claim covers it |
| Matching IDs ask whether to replace or skip the saved explanation. | 11 | Pass — declared claim |
| Read the in-app `/privacy` and `/terms` pages for user-facing details. | 10 | Pass |
| Deploy | 1 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| Keep `staticwebapp.config.json` at the deployment root so deep links fall back to `index.html` and security headers are applied. | 18 | Pass for deployment documentation |
| The service worker caches the app shell and visited build assets. | 11 | Technical but useful in deployment documentation |
| Visual assets | 2 | Pass |
| The tabletop apparatus is original generated imagery. | 7 | Pass; provenance is recorded in the repository |
| Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`. | 10 | Pass |
| License | 1 | Pass |
| MIT. See `LICENSE`. | 3 | Pass |

## Demo, privacy, and sandbox verification

- A fresh click from `/` reached `/demo` in one action. The first demo screen already showed three realistic explanations: a due passing-siren explanation, a binary-search revisit, and a JavaScript-closure draft.
- The visible persistent banner read “Demo — sample data, nothing is saved to your work” and exposed **Reset demo** and **Start for real**.
- In a fresh browser, only `demo:explanation-lab` existed after entering demo. A demo-only topic did not appear in `/library` real work. After the asynchronous action completed, Reset removed it and restored the three seeds; Start for real opened the blank real form without a banner.
- Request capture for landing, demo navigation, and demo work recorded only `https://explanation-lab.sociobot.in` URLs. No third-party, analytics, or AI request was observed.

## Claims verification

After fresh `npm ci`, every command listed in `.factory/claims.json` passed. The final Playwright result file reports `status: passed` and no failed tests.

| Claim IDs with passing exact command |
| --- |
| `one-click-demo`, `demo-isolation`, `demo-reset-exit`, `four-part-revisit` |
| `json-export`, `json-import`, `atomic-import-validation`, `duplicate-import-decision` |
| `audio-backup`, `local-private`, `manual-no-sync`, `no-tracking` |
| `free-no-account`, `offline-reload`, `mobile-ready` (mobile project), `site-data-clear` |

The unlisted landing claims are F-1-1. The earlier README import-safety claims are now correctly listed as `atomic-import-validation` and `duplicate-import-decision`; that prior issue is fixed.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read the existing handoff and verification reports, then checked each historic finding against current source, fresh tests, and/or the live site:

| Earlier finding | Current verification |
| --- | --- |
| QA-01 / QA2-01 microphone track left live | `cancelRecording()` runs for render, route, page-hide, and hidden-tab paths; the current regression passed. |
| QA-02 / QA2-02 poisoned import date | `parseImport()` validates dates before the transaction; `atomic-import-validation` passed. |
| QA-03 / QA2-03 silent duplicate overwrite | The live code asks replace/skip; `duplicate-import-decision` passed. |
| QA-04 / QA2-04 200% mobile overflow | Current mobile reflow regression passed; fresh 390 px live views had 0 px normal-scale overflow. |
| QA-05 / QA2-05 claims coverage | The earlier import, reset, audio, privacy, and tracking gaps have tagged claims and passed. F-1-1 is a new, narrower core-copy claim gap. |
| QA-06 / QA2-06 small touch targets | Current mobile target-size regression passed. |
| QA-07 / QA2-07 low-contrast focus | Current contrast regression passed; source uses carbon focus. |
| QA-08 / QA2-08 soft 404 | Live `/review-1-missing` returned HTTP 404 with its designed recovery page. |
| QA-09 / QA2-09 immutable stable assets | Live stable assets and hashed build assets have distinct cache policy; current regression passed. |
| QA-10 / QA2-10 missing build identity | Live footer includes `v1.0 · build repair-4`. |
| QA3-01 unlisted README import-safety promise | The two relevant claims and tagged demo-entry tests now exist and passed. |

No historic finding is repeated as unfixed or half-fixed.

## Structure and product checks

- All public routes (`/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`) returned 200; all had a unique h1, main landmark, footer, route-specific title, description, and canonical URL. The missing route returned a real 404, title “Page not found — Explanation Lab”, and a recovery link.
- The live document has `lang=en`, favicon and Apple icon, canonical, Open Graph/Twitter social card, robots and sitemap. Its self-only CSP includes a response-header `frame-ancestors 'none'` directive. The navigation, footer, and linked external Param Factory site all resolved successfully.
- The visual system is distinct: graph paper, hard offset shadows, cobalt/orange instrument controls, and the original tabletop asset fit the documented reasoning-workbench direction. It is not a generic SaaS card/gradient treatment.
- No missed AI feature is required by the brief. Grading or generated explanations would conflict with the stated manual-practice purpose; import, export, local audio, offline use, and revisit are already present.

## Quality gates

- `npm ci`: passed; 22 packages installed and audit reported 0 vulnerabilities.
- 16 exact claim commands: passed.
- `CI=1 npm test`: passed (52 checks, with the expected desktop skips for mobile-only checks).
- `CI=1 npm run test:a11y`: passed.
- `npm run typecheck`, `npm run lint`, and `npm run build`: passed.
- Build output includes `dist/index.html` and `dist/404.html`; emitted JavaScript is 32,258 bytes raw and CSS is 18,462 bytes raw.

## What would make this perfect

Add the missing four-prompt claim and test, replace the three non-informational headings and the hero metaphor with direct language, and make the illustration provenance reachable from the live footer. Then re-run this entire checklist; no further product behavior change is currently indicated.
