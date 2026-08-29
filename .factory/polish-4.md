# Perfection-loop polish 4

- Reviewed candidate: `4c2bc69b1b98aed5415dcc23b8cc747552473d92`
- Cumulative review record: `bb258aa581e7a44ac86026f2f1b21717325155b9`
- Product repair: `15e28ce28b6bf760a447f6f5a1d02b79f97860ac`
- Static deployment: `65c32f8f-e92d-436d-8bde-06c4cd47bf11`
- Live URL: <https://explanation-lab.sociobot.in>

## Finding map

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the declared `four-prompt-practice` claim and its one observable demo-entry test. | Clean-clone `@claim:four-prompt-practice` passed; live sample exposes all four prompt tabs at <https://explanation-lab.sociobot.in/?demo=1&id=sample-doppler>. |
| F-1-2 | Kept the direct section headings “Four prompts in each explanation,” “Three steps to practise and revisit,” and “What Explanation Lab does not do.” | Clean-clone `@claim:one-click-demo` passed; cold landing checked in [live-qa.json](repair-evidence/polish-4/live-qa.json). |
| F-1-3 | Kept the direct audience sentence ending “gaps in their understanding.” | Clean-clone `@claim:one-click-demo` passed; live `/` check passed. |
| F-1-4 | Kept the linked `/visual-notes` provenance route in the footer. | Live `/visual-notes` returned 200 with its title, h1, and zero serious/critical axe findings. |
| F-2-1 | Kept the concrete topic and revisit instructions without the earlier “sharper” metaphors. | `plain-language copy gives concrete study and backup instructions` passed; live `/` check passed. |
| F-2-2 | Kept “Use your own words; completing all four answers matters more than writing style.” | Same plain-language regression and live landing check passed. |
| F-2-3 | Kept the README privacy statement that explanations and audio are not sent to another website. | Clean-clone `@claim:local-private` passed in desktop and mobile. |
| F-2-4 | Kept whole-backup validation and replace-or-keep wording without storage jargon. | Clean-clone `@claim:atomic-import-validation` and `@claim:duplicate-import-decision` passed. |
| F-3-1 | Preserved the two-row phone navigation, including visible 44px Privacy control. | Clean-clone `@claim:mobile-ready` passed; live 390px route check passed. |
| F-3-2 | Kept “State where the idea applies” in the preview and workbench. | Clean-clone `@claim:four-prompt-practice` passed; live sample check passed. |
| F-4-1 | The landing action now opens `/?demo=1&id=sample-doppler` directly. The first viewport contains the named siren explanation and a populated “Saved sample response” panel. | Expanded `@claim:one-click-demo` passes in desktop and mobile. [Live desktop](repair-evidence/polish-4/live-demo-desktop.png) and [390px](repair-evidence/polish-4/live-demo-mobile-390.png) screenshots; live URL <https://explanation-lab.sociobot.in/?demo=1&id=sample-doppler>. |
| F-4-2 | Demo mode now follows every product route. Wordmark, header, footer, Back/Forward, and demo Practice/Library links retain `demo=1`; direct real routes and Start for real await demo disposal. A new session reseeds the three bundled records. Privacy, README, demo docs, manifest, and test now state the same boundary. | Expanded `@claim:demo-reset-exit` creates real/demo records and covers wordmark, header, footer, Back/Forward, direct routes, reset, and explicit exit in both projects. Live `demoBoundaries: true` in [live-qa.json](repair-evidence/polish-4/live-qa.json). |
| F-4-3 | Replaced the Privacy h1 with “How Explanation Lab stores your work.” | Plain-language regression and live `/privacy` route check passed. |
| F-4-4 | Standardised the verb spelling to “Practise” in initial title, route metadata, description, Open Graph, Twitter, and manifest. “Practice” remains only where it is a noun. | `@claim:one-click-demo` asserts title/metadata; cold live `/` title is “Explanation Lab — Practise explaining hard ideas.” |
| F-4-5 | Renamed the README link “Try the sample demo.” | Plain-language regression rejects “One-click sandbox”; README audit is updated. |
| QA-01 / QA2-01 | Preserved recorder cleanup during render, route change, page hide, and hidden-tab paths. | `route navigation immediately stops an active microphone track` passed in both browser projects. |
| QA-02 / QA2-02 | Preserved import date validation before the write transaction. | Clean-clone `@claim:atomic-import-validation` passed. |
| QA-03 / QA2-03 | Preserved the explicit replace-or-skip decision for matching import IDs. | Clean-clone `@claim:duplicate-import-decision` passed. |
| QA-04 / QA2-04 | Preserved 200% text reflow for landing, legal pages, demo, and populated workbench. | Mobile reflow regression passed; live 390px sample has no horizontal overflow. |
| QA-05 / QA2-05 / QA3-01 | Repaired the reopened demo-boundary claims gap. The manifest now names the populated first viewport and whole demo-navigation behavior; every manifest ID has exactly one tag. | All 18 literal commands passed from a clean clone; tag-count audit printed `CLAIM_TAG_COUNTS_OK 18`. |
| QA-06 / QA2-06 / QA5-02 | Preserved 44px repeated mobile navigation, footer, and workbench-back targets. | Mobile target-size regression and `@claim:mobile-ready` passed. |
| QA-07 / QA2-07 | Preserved the carbon focus treatment with at least 3:1 contrast. | Focus-contrast regression passed in both browser projects. |
| QA-08 / QA2-08 | Preserved host-level designed HTTP 404 behavior. | Live `/polish-4-live-missing` returned HTTP 404 and the recovery h1; recorded in [live-qa.json](repair-evidence/polish-4/live-qa.json). |
| QA-09 / QA2-09 | Preserved immutable caching only for hashed build files, revalidation for stable assets, and `sw.js` no-cache. | Static-host policy regression passed; production config deployed with the static build. |
| QA-10 / QA2-10 | Updated the footer build identity to `v1.0 · build polish-4`. | Footer regression passed in both browser projects and live screenshots show the deployed build. |
| QA5-01 | Preserved individual delete cancel/confirm behavior. | Clean-clone `@claim:individual-delete` passed. |
| QA5-03 | Preserved invalid-JSON recovery without locking the Library. | Clean-clone `@claim:json-import` passed. |

## Verification and delivery

- Clean clone: `/tmp/explanation-lab-polish4.X4RaPM` at `15e28ce28b6bf760a447f6f5a1d02b79f97860ac`; `npm ci` installed 22 packages with zero vulnerabilities.
- Every literal `.factory/claims.json` command passed: 18 declared claims and 35 browser executions. The manifest/tag audit found exactly one `@claim:<id>` test for each ID.
- Clean-clone full suite: `CI=1 npm test` passed 57 checks with 3 intentional desktop-only skips; `CI=1 npm run test:a11y` passed 2 checks. Typecheck, lint, high-severity audit, and `npm run build` all passed.
- Production output: 35.15 KB raw JavaScript (11.94 KB gzip) and 19.06 KB raw CSS (4.76 KB gzip). `dist/index.html` is present.
- Static deployment `65c32f8f-e92d-436d-8bde-06c4cd47bf11` completed successfully. The cold live audit confirmed populated one-click demo, every demo boundary, normal routes and route metadata, real 404, same-origin requests, zero valid-route console errors, zero serious/critical axe findings, mobile first-viewport content, and offline demo reload: [live-qa.json](repair-evidence/polish-4/live-qa.json).
- `/opt/fleet/lib/verify-url.sh` passed live on the populated sample: [verify.json](repair-evidence/polish-4/verify-url/verify.json).
- Live mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.50s, LCP 1.70s, CLS 0, TBT 72ms: [report](repair-evidence/polish-4/lighthouse-live-mobile.json).

No finding from reviews 1–4 remains unresolved.
