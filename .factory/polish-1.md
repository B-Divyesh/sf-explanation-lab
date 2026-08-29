# Perfection-loop polish 1

- Date: 2026-08-29 UTC
- Candidate reviewed: `19d7edaacadabe98472eccf0ab617f087b90e069`
- Review report: `dd6e1c2a6d7e3d798da68d1bfcc42706c60f16a2`
- Repair commit: `ed1b173`
- Live URL: <https://explanation-lab.sociobot.in>

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — missing four-prompt claim | Added `four-prompt-practice` to `.factory/claims.json`. Its single tagged test enters `/?demo=1`, opens the passing-siren sample, selects all four prompt tabs, and verifies the distinct mechanism, boundary, example, and counterexample headings. The landing and footer wording now match the declared claim. | `sample practice presents four distinct prompts @claim:four-prompt-practice` passed in desktop and mobile from the clean clone. Live sample: <https://explanation-lab.sociobot.in/?demo=1&id=sample-doppler>. Screenshot: [live-demo-desktop.png](verification-artifacts/polish-1/live-demo-desktop.png). |
| F-1-2 — metaphorical section headings | Replaced “The workbench”, “A blank page with useful pressure”, “Build, test, then revisit”, “Honest limits”, and “You do the thinking” with section names that state their contents. | `landing page states the job and opens a seeded demo @claim:one-click-demo` asserts the direct headings and absence of the old wording. Live cold read passed. Screenshot: [landing-mobile.png](verification-artifacts/polish-1/live-landing-mobile.png). |
| F-1-3 — metaphorical audience sentence | Rewrote the sentence to “For STEM and programming learners who want to find gaps in their understanding.” | The one-click claim test asserts the exact sentence in desktop and mobile. The 390×844 live screenshot shows it on the first screen: [live-landing-mobile.png](verification-artifacts/polish-1/live-landing-mobile.png). |
| F-1-4 — unreachable visual disclosure | Added the real `/visual-notes` route with asset origin, date, art direction, and production record. Added its route title, description, canonical and social metadata updates, host rewrite, sitemap entry, and a footer link on every page. | `the footer exposes the release build identity and linked visual disclosure`, `routes set titles, canonical metadata, focus, and working legal links`, and the axe route test passed. Live check: <https://explanation-lab.sociobot.in/visual-notes>. Screenshot: [visual-notes-mobile.png](verification-artifacts/polish-1/visual-notes-mobile.png). |

## Required supporting acceptance work

- `/?demo=1` is now the canonical one-click sample URL. It immediately shows three realistic explanations and keeps the persistent demo banner, Reset demo, and Start for real controls. `/demo` remains a compatible deep link.
- Demo reads and writes still use only `demo:explanation-lab`; real work uses only `explanation-lab`. Reset reseeds the demo, while Start for real clears it and opens `/practice`.
- Every route updates title, description, canonical, Open Graph title/description/URL, and Twitter title/description. History navigation moves focus to the new h1 and announces it.
- `/privacy`, `/terms`, and `/visual-notes` are real, linked routes. Unknown routes return HTTP 404 with the designed recovery page.
- Mobile at 390×844 and 200% text has zero horizontal overflow. Touch targets, focus contrast, reduced motion, keyboard order, and serious/critical axe checks pass.
- The direct catalog sentence is 84 characters and starts with a verb. `.factory/copy-audit.md` contains the updated landing copy, word counts, and terminology table.

## Earlier finding regression map

The repository has no earlier `review-*.md` or `polish-*.md` besides `review-1.md`. That review records these historical IDs; all remain fixed:

| Historical IDs | Preserved fix | Evidence |
| --- | --- | --- |
| QA-01 / QA2-01 | Route/render/page-hide paths stop the microphone track. | `route navigation immediately stops an active microphone track` passed in both projects. |
| QA-02 / QA2-02 | Invalid imported dates are rejected before any write. | `@claim:atomic-import-validation` passed from the clean clone. |
| QA-03 / QA2-03 | Matching IDs require an explicit replace-or-skip decision. | `@claim:duplicate-import-decision` passed from the clean clone. |
| QA-04 / QA2-04 | Mobile layouts reflow at 200% text. | `text resized to 200 percent reflows on every reported mobile route` passed with the new visual-notes route included. |
| QA-05 / QA2-05 / QA3-01 | Functional, privacy, reset, audio, and import-safety promises have single tagged claim tests. | All 17 exact commands in `.factory/claims.json` passed; 33 browser executions. |
| QA-06 / QA2-06 | Repeated mobile navigation and footer links are at least 44×44 CSS px. | `repeated mobile navigation and footer targets are at least 44 CSS pixels` passed. |
| QA-07 / QA2-07 | Carbon focus outline meets 3:1 on product surfaces. | `the focus outline has at least 3 to 1 contrast on product surfaces` passed. |
| QA-08 / QA2-08 | Unknown routes retain a real 404 response. | `static host policy serves real 404s...` passed; live `/polish-1-final-missing` returned 404. |
| QA-09 / QA2-09 | Hashed builds are immutable; stable art revalidates; service worker is no-cache. | Live headers: `/build/main-BfbdljgH.js` has one-year immutable caching, hero art revalidates, and `sw.js` is no-cache with shell v4. |
| QA-10 / QA2-10 | Footer exposes the current build identity. | Every live route shows `v1.0 · build polish-1`. |

## Verification evidence

- Clean clone: `/tmp/explanation-lab-clean.B4P8af`, commit `ed1b173`; `npm ci` installed 22 packages with 0 vulnerabilities.
- Every exact claims command: 17/17 passed, representing 33 browser executions.
- Full Playwright matrix: 53 passed and 3 intentional desktop skips; no failures.
- Dedicated accessibility run: 2 passed. Axe covered `/`, `/?demo=1`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, `/visual-notes`, and a missing route.
- Typecheck, unused-code lint, high-severity dependency audit, and production build: passed.
- Build sizes: JS 33.86 KB raw / 11.61 KB gzip; CSS 18.46 KB raw / 4.66 KB gzip; mobile hero 27.21 KB.
- Local URL verifier: HTTP 200 in 520 ms, `lang=en`, title `Demo — Explanation Lab`, one h1, main present, no missing alt, no unlabeled buttons, no console errors.
- Local Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms. Report: [lighthouse-mobile.json](verification-artifacts/polish-1/lighthouse-mobile.json).
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.0 s, CLS 0, TBT 20 ms. Report: [lighthouse-live-mobile.json](verification-artifacts/polish-1/lighthouse-live-mobile.json).
- Live cold audit: all seven normal routes returned 200 with correct titles and h1s, zero overflow, zero normal-route console errors, zero cross-origin requests, and zero serious/critical axe findings. The missing route returned 404. Offline demo reload passed.
- Deployment ID: `fa6551f5-cf0c-4277-8200-a0188af92939`. The deployed JS SHA-256 matches `dist/build/main-BfbdljgH.js` exactly.

No review finding or acceptance item remains unresolved.
