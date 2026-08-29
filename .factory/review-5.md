# Adversarial first-read review 5 — Explanation Lab

Date: 2026-08-29 UTC  
Live URL: <https://explanation-lab.sociobot.in>  
Method: fresh desktop (1440×900) and phone (390×844) browser contexts, plus a fresh local clone at `bd282f2e822e9f55c697061a41d8e4e0fb6de04b`. No product code was changed.

## Verdict: PASS

There are zero findings. The landing answers the job, audience, and first action before scrolling; the one-click demo opens a filled, isolated sample; all declared claims pass from a clean clone; and the earlier defects remain fixed in both source and the live deployment.

## First 30 seconds

Before scrolling, in both fresh contexts:

- **What it does:** It lets STEM and programming learners practise explaining an idea through mechanism, limits, an example, and a counterexample.
- **For whom:** “For STEM and programming learners who want to find gaps in their understanding.”
- **What to click first:** “Try it with sample data.” Its adjacent outcome says, “Opens the due siren explanation with a saved sample answer.”

The 390px first view contained the headline, audience, primary action, secondary real-start action, and all three plain facts without horizontal overflow. The desktop view contained the same information. The populated sample appeared 111 ms after the mobile click and 90 ms after the desktop click in this check; its first rendered view showed the named siren explanation and saved response. The short storage-opening state was not retained once the local sample was ready.

## Findings

None.

## Copy audit

Counts use whitespace-separated words; hyphenated labels count as one word. Headings, labels, actions, footer text, and meaningful image alt text are included because a visitor or assistive technology encounters them independently. No landing or README item exceeds 22 words. No banned marketing adjective, unexplained metaphor, inconsistent core term, context-free heading, or non-result-naming button was found.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| Practice | 1 | Pass — navigation noun |
| Library | 1 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| Four prompts to practise an idea | 6 | Pass — names the product method |
| Explain hard ideas in your own words | 7 | Pass — job headline |
| For STEM and programming learners who want to find gaps in their understanding. | 13 | Pass — audience and benefit |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens the due siren explanation with a saved sample answer. | 10 | Pass — states result |
| Start a blank explanation | 4 | Pass — result-naming action |
| Choose a topic, then answer four prompts. | 7 | Pass — states result |
| Work stays in this browser | 5 | Pass — declared privacy claim |
| Works offline after the first visit | 6 | Pass — declared claim |
| Free, with no account | 4 | Pass — declared claim |
| Four linked tabletop stations show an idea being tested in different ways. | 11 | Pass — useful image alt text |
| Mechanism. Boundary. Example. Counterexample. | 4 | Pass — prompt names |
| Write a mechanism, boundary, example, and counterexample | 7 | Pass — section heading |
| Each prompt asks you to test the idea in a different way. | 12 | Pass — declared four-prompt claim |
| Type your answer or keep a local audio note. | 9 | Pass — available input modes |
| Explain the mechanism | 3 | Pass — prompt label |
| State where the idea applies | 6 | Pass — concrete limit prompt |
| Give an example | 3 | Pass — prompt label |
| Find a counterexample | 3 | Pass — prompt label |
| How it works | 3 | Pass — section label |
| Three steps to practise and revisit | 6 | Pass — section heading |
| Name one hard idea | 4 | Pass — step heading |
| Pick something you almost understand. | 5 | Pass — usable guidance |
| Choose a narrow topic so you can check one idea at a time. | 13 | Pass — usable guidance |
| Answer all four prompts | 4 | Pass — step heading |
| Write, record, or use both. | 5 | Pass — usable guidance |
| Use your own words; completing all four answers matters more than writing style. | 13 | Pass — usable guidance |
| Return after seven days | 4 | Pass — step heading |
| Completed work enters a revisit queue. | 6 | Pass — declared claim |
| Read your old answer, then improve the least complete part. | 11 | Pass — usable guidance |
| Limits | 1 | Pass — section label |
| What Explanation Lab does not do | 6 | Pass — section heading |
| Explanation Lab does not grade answers or generate explanations. | 9 | Pass — declared claim |
| It does not create an account or sync devices. | 9 | Pass — declared claim |
| Export a JSON backup when you want to move your work. | 11 | Pass — declared claim |
| Explanation Lab uses four prompts for each explanation. | 8 | Pass — declared four-prompt claim |
| Terms | 1 | Pass — footer link |
| Visual notes | 2 | Pass — footer link |
| Built by Param Factory | 4 | Pass — external footer link |
| v1.0 · build polish-4 | 4 | Pass — build identity |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Explanation Lab | 2 | Pass |
| Practise hard ideas with four focused prompts. | 7 | Pass |
| Explanation Lab is for students learning abstract STEM or programming concepts. | 11 | Pass |
| Each explanation uses a mechanism, boundary, example, and counterexample. | 9 | Pass — declared four-prompt claim |
| Completed explanations return after seven days. | 6 | Pass — declared claim |
| The app is free and needs no account. | 8 | Pass — declared claim |
| Text and audio notes stay in this browser's local storage. | 10 | Pass — plain privacy wording |
| It works offline after the first visit. | 7 | Pass — declared claim |
| JSON import and export let learners move or back up their work. | 12 | Pass — declared claims |
| Live site | 2 | Pass — link label |
| Try the sample demo | 4 | Pass — link label |
| Run locally | 2 | Pass — heading |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| `/?demo=1` loads isolated sample data. | 5 | Pass — declared demo behavior |
| Test and build | 3 | Pass — heading |
| The exact deployment build command is `npm run build`. | 9 | Pass |
| It writes the static site to `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| The Playwright suite checks the demo, backups, offline use, keyboard use, mobile layout, and serious accessibility errors. | 17 | Pass |
| It also checks 200% text resize. | 6 | Pass |
| Chromium for Playwright is required; the work order pins Playwright 1.58.2. | 11 | Pass |
| Data and privacy | 3 | Pass — heading |
| Real work stays in the browser database named `explanation-lab`. | 8 | Pass — precise documentation |
| Demo work stays in the separate browser database named `demo:explanation-lab`. | 9 | Pass — precise documentation |
| Product navigation stays in demo mode until you choose Start for real. | 11 | Pass — declared demo-boundary claim |
| Resetting the demo removes only sample data. | 6 | Pass — declared demo-boundary claim |
| Start for real removes only sample data and opens real practice. | 11 | Pass — declared demo-boundary claim |
| The app does not send your explanations or audio to another website. | 11 | Pass — declared privacy claim |
| Clearing this site's browser data removes saved work. | 8 | Pass — declared claim |
| The app checks the whole backup before saving it, so an invalid file does not change saved explanations. | 18 | Pass — declared import-safety claim |
| If a backup includes an explanation already in your library, choose whether to replace it or keep the saved version. | 19 | Pass — declared import-safety claim |
| Read the in-app `/privacy` and `/terms` pages for user-facing details. | 10 | Pass |
| The `/visual-notes` page records illustration provenance. | 6 | Pass |
| Deploy | 1 | Pass — heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| Keep `staticwebapp.config.json` at the deployment root so product routes open `index.html` and unknown routes return the designed 404 page. | 19 | Pass |
| The same file applies security headers. | 6 | Pass |
| The service worker caches the app shell and visited build assets. | 10 | Pass |
| Visual assets | 2 | Pass — heading |
| The tabletop apparatus is original generated imagery. | 7 | Pass — provenance is reachable at `/visual-notes` |
| Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`. | 10 | Pass |
| License | 1 | Pass — heading |
| MIT. See `LICENSE`. | 3 | Pass |

The page’s visitor-reliant statements map to entries in `.factory/claims.json`: populated demo (`one-click-demo`), demo storage and exits (`demo-isolation`, `demo-reset-exit`), the four prompts and revisit schedule (`four-prompt-practice`, `four-part-revisit`), backup/import behavior, local audio, privacy/no tracking, free access, offline reload, mobile layout, clearing data, and individual deletion. Advice and documentation statements do not promise an untested product outcome. No unlisted claim was found.

## Demo, privacy, and sandbox verification

- One landing click opened `/?demo=1&id=sample-doppler`. The resulting mobile and desktop first view showed “Why a passing siren changes pitch,” a realistic saved explanation, and the four prompt controls.
- The persistent banner read “Demo — sample data, nothing is saved to your work” and included **Reset demo** and **Start for real**.
- The demo browser request log contained only `https://explanation-lab.sociobot.in`; no analytics, third-party script, or AI request was observed.
- From a fresh demo, header Privacy produced `/privacy?demo=1` with the banner; Back restored the filled demo; footer Terms produced `/terms?demo=1` with the banner. This confirms the prior cross-namespace route defect is fixed.
- After service-worker control, the populated demo reloaded offline with its saved sample response visible. The sample is therefore usable offline after the first visit.

## Claims verification

From the fresh clone, all 18 literal commands listed in `.factory/claims.json` passed. Each ID has one matching `@claim:` test tag.

| Claim ID | Result |
| --- | --- |
| `one-click-demo`, `demo-isolation`, `demo-reset-exit` | Pass |
| `four-part-revisit`, `four-prompt-practice` | Pass |
| `json-export`, `json-import`, `atomic-import-validation`, `duplicate-import-decision` | Pass |
| `audio-backup`, `local-private`, `manual-no-sync`, `no-tracking` | Pass |
| `free-no-account`, `offline-reload`, `mobile-ready`, `site-data-clear`, `individual-delete` | Pass |

The same clone also passed `CI=1 npm test` (60 checks with expected desktop skips), `CI=1 npm run test:a11y`, `npm run typecheck`, `npm run lint`, and `npm run build`, which produced `dist/index.html`.

## Earlier finding verification

Every earlier review and polish record was read. The following confirmations are from the current source, clean-clone tests, and live site rather than an earlier “fixed” note.

| Earlier finding | Current confirmation |
| --- | --- |
| `F-1-1` | `four-prompt-practice` is declared and tested; the live sample exposes all four distinct prompts. |
| `F-1-2` | The earlier mood headings are absent; current headings name the preview, steps, and limits sections. |
| `F-1-3` | The live audience sentence says “gaps in their understanding.” |
| `F-1-4` | Every footer contains a working `/visual-notes` link; the live route returned 200. |
| `F-2-1`, `F-2-2` | The earlier “sharper,” “sharpen,” and “polish” metaphors are absent; current instructions are direct. |
| `F-2-3`, `F-2-4` | README retains the plain privacy and whole-backup/replace-or-keep language. |
| `F-3-1` | The 390px header visibly retains Privacy as a 44px target. |
| `F-3-2` | “Draw the boundary” is absent; the second prompt is “State where the idea applies.” |
| `F-4-1` | One click opens the populated siren workbench, not an overview requiring a scroll. |
| `F-4-2` | Header, footer, and Back navigation retain `demo=1`; the clean-clone boundary claim passes. |
| `F-4-3` | Privacy h1 is “How Explanation Lab stores your work.” |
| `F-4-4` | The verb is consistently “Practise” in the landing title and metadata; “Practice” is only the navigation noun. |
| `F-4-5` | README calls the link “Try the sample demo,” not “sandbox.” |
| `QA-01` / `QA2-01` | The full suite passes the route, render, page-hide, and hidden-tab microphone cleanup regression. |
| `QA-02` / `QA2-02`, `QA3-01` | Invalid-date imports are rejected before writes; the dedicated literal claim command passes. |
| `QA-03` / `QA2-03` | Duplicate imports still require explicit replace-or-skip; its literal claim command passes. |
| `QA-04` / `QA2-04` | Mobile/reduced-motion and 200% reflow checks pass; live 390px routes had zero overflow. |
| `QA-05` / `QA2-05` | All current visitor-reliant promises have a manifest entry and passing tagged test; no claim gap recurred. |
| `QA-06` / `QA2-06`, `QA5-02` | Mobile navigation, footer, and workbench controls retain the tested 44px targets. |
| `QA-07` / `QA2-07` | The designed carbon focus treatment remains and accessibility tests pass. |
| `QA-08` / `QA2-08` | `/review-5-missing` returned HTTP 404 with the designed “We could not find this page” recovery view. |
| `QA-09` / `QA2-09` | Current live headers retain the static-host security and cache policy; `sw.js` is served successfully. |
| `QA-10` / `QA2-10` | The live footer displays `v1.0 · build polish-4`. |
| `QA5-01` | Individual delete cancel/confirm behavior remains covered by its passing claim test. |
| `QA5-03` | Malformed JSON recovery and usable Library remain covered by the passing import claim test. |

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` returned 200. The intentional unknown route returned 404. Each normal route had one h1, one main, a route-specific title and meta description, canonical URL, Open Graph/Twitter image, favicon, and no 390px overflow.
- The response CSP is a real header and includes `frame-ancestors 'none'`; it also limits scripts, connections, workers, and media to the product’s own origin as appropriate. `nosniff`, referrer, permissions, HSTS, and opener headers were present.
- The live normal/demo route scan found no serious or critical Axe violation. There were no browser console or page errors during the fresh landing/demo/privacy/terms/offline flow.
- Internal routes, robots, sitemap, favicon, Apple icon, social card, and service worker resolved. Deep links and Back navigation restored the intended state and focus behavior through the tested SPA routes.
- The graph-paper field, hard offset shadows, cobalt/orange controls, mono body face, and original tabletop apparatus are consistent with `.factory/design.md` and distinct from a generic SaaS-template treatment.

## Missed leverage

No missing feature was identified. The brief calls for deliberate manual practice, and generated answers or grading would conflict with the stated limit. Local audio, JSON import/export, a seven-day revisit, offline use, and the isolated sample are already present. Cross-device sync is explicitly out of scope and accurately disclosed.

## What would make this perfect

Keep the current narrow scope and rerun this complete independent checklist after any copy, storage, routing, or service-worker change. There is no currently identified product change needed.
