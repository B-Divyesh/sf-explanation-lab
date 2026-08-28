# Independent product verification 3 — FAIL

- Date: 2026-08-28 UTC
- Work order: `explanation-lab-verify-3`
- Candidate commit: `13edfeead324f3be3bfbc61590c1b42b7ab0484b`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**FAIL — do not release.** This is not a deployment-only failure: the live deployment is the candidate build and its product behavior is healthy. The candidate fails the supplied claims contract because the README makes a user-reliant import-safety promise with no corresponding `.factory/claims.json` entry and no `@claim:` test. The contract explicitly makes an unlisted claim a release-blocking finding.

## First-read gate — PASS

Fresh cold desktop load of `/` returned HTTP 200, with no console or page errors.

- **What it does:** “Explain hard ideas in your own words,” through mechanism, boundary, example, and counterexample prompts.
- **For whom:** “For STEM and programming learners who want to find gaps before those gaps find them.”
- **First click:** “Try it with sample data”; adjacent copy says it opens a due explanation and two recent examples.

One click opened `/demo` with three realistic seeded explanations and the persistent “Demo — sample data, nothing is saved to your work” banner, including **Reset demo** and **Start for real**. The plain-words/demo gate passes.

## Claims gate — FAIL

`.factory/claims.json` exists and has 14 declared IDs. After `npm ci`, every exact declared command passed from the product demo entry point; the chained run reached the final command under `&&`, so no prior command failed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `one-click-demo` | `npm test -- --grep @claim:one-click-demo` | Pass |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass |
| `demo-reset-exit` | `npm test -- --grep @claim:demo-reset-exit` | Pass |
| `four-part-revisit` | `npm test -- --grep @claim:four-part-revisit` | Pass |
| `json-export` | `npm test -- --grep @claim:json-export` | Pass |
| `json-import` | `npm test -- --grep @claim:json-import` | Pass |
| `audio-backup` | `npm test -- --grep @claim:audio-backup` | Pass |
| `local-private` | `npm test -- --grep @claim:local-private` | Pass |
| `manual-no-sync` | `npm test -- --grep @claim:manual-no-sync` | Pass |
| `no-tracking` | `npm test -- --grep @claim:no-tracking` | Pass |
| `free-no-account` | `npm test -- --grep @claim:free-no-account` | Pass |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass |
| `mobile-ready` | `npm test -- --grep @claim:mobile-ready --project mobile` | Pass |
| `site-data-clear` | `npm test -- --grep @claim:site-data-clear` | Pass |

### QA3-01 — Release-blocking — README makes an unlisted import-safety claim

`README.md` states: “Imports are validated before one atomic write. Matching IDs ask whether to replace or skip the saved explanation.” This is a material promise about data-loss prevention and recovery. No entry in `.factory/claims.json` names or states this claim, and no test tagged `@claim:<id>` proves the atomic-invalid-import and explicit duplicate-ID decision behavior through the demo sandbox.

The untagged Playwright suite does independently exercise malformed dates and duplicate decisions, and those checks pass. That does not satisfy the claims skill: each visitor-facing claim must be listed and have exactly one tagged sandbox test. Add separate claims (for example `atomic-import-validation` and `duplicate-import-decision`) with the existing regression coverage adapted to enter via `/demo`, or remove/narrow the README promise. Until then, the claimed behavior is unlisted and this review fails.

## Clean-checkout quality gates — PASS

| Check | Result |
| --- | --- |
| Candidate identity | `git rev-parse HEAD` = requested `13edfeead324f3be3bfbc61590c1b42b7ab0484b` |
| Install | `npm ci`: 22 packages; `npm audit --audit-level=high`: 0 vulnerabilities |
| Full test matrix | `npm test`: 52 tests executed across desktop/mobile; exit 0 |
| Dedicated accessibility tests | `npm run test:a11y`: 2 passed |
| Typecheck | `npm run typecheck`: pass |
| Lint | `npm run lint`: pass |
| Production build | `npm run build`: pass; `dist/` produced |
| Live URL smoke | `verify-url.sh https://explanation-lab.sociobot.in/demo`: HTTP 200 in 603 ms; title/lang/one h1/main present; 0 missing alts, unlabeled buttons, or console errors |

Build output is within the static-product budgets: JS 32,258 bytes raw / 11,220 bytes gzip; CSS 18,462 bytes raw / 4,660 bytes gzip; mobile hero 27,210 bytes; no downloaded fonts. Lighthouse was not installed in this clean clone, so no new score is claimed.

## End-to-end, recovery, accessibility, and PWA evidence — PASS

- The full suite covers a real four-prompt completion/revisit flow, draft isolation, JSON backup/import including audio, malformed-date recovery, duplicate replace/skip decisions, deletion, local persistence, and microphone cleanup. Fresh live fake-microphone check showed Stop control while recording and zero Stop controls after navigating to Library.
- Fresh boundary checks confirmed `maxlength=100` for a topic and `maxlength=6000` for a response. Required topic validation is browser-native; text-only use remains available if audio is unavailable.
- At 390×844, `/demo` had 0 px horizontal overflow. With reduced-motion emulation, the stylesheet applies instant/near-instant transitions and disables the writing-sheet animation. Keyboard’s first Tab reaches the skip link.
- Fresh live axe scans of `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and the 404 route found no serious or critical violations. Each had one h1; normal routes had no console/page errors. The intentional unknown URL produces a browser 404 network message and was excluded from the normal-route console result.
- After service-worker control, setting the context offline and reloading `/demo` retained “Practice with sample explanations” and its seeded siren record. `sw.js` is `no-cache`; its shell cache is `explanation-lab-shell-v3`.
- Normal live request capture observed same-origin requests only. Source/build scans found no analytics, advertising, third-party scripts/fonts, runtime AI calls, or embedded credentials.

## Deployment, response policy, and privacy — PASS

SHA-256 comparison matched all 16 served public runtime files in local `dist/` to the live custom domain: HTML, JS/CSS, service worker, manifest, offline page, images, icons, favicon, robots, and sitemap. `staticwebapp.config.json` is deliberately host-consumed (its direct URL is 404); observed live behavior verifies its rules.

- `/`, `/demo`, `/practice`, `/library`, `/privacy`, and `/terms`: HTTP 200.
- Unknown `/missing-verify-page`: HTTP 404 and designed 404 document.
- CSP is self-only with the required data/blob media exceptions; `nosniff`, strict-origin referrer policy, microphone-only permissions policy, and same-origin COOP are present.
- Hashed `/build/main-BcWLVhzu.js`: `public, max-age=31536000, immutable`; stable `/assets/hero-640.webp`: `public, max-age=0, must-revalidate`; `/sw.js`: `no-cache`.
- All eight discoverable landing links returned HTTP 200, including the Param Factory external link.

This static, account-free PWA has no server endpoint, authentication, billing/unlock call, backend, package, or CLI. API rate-limit, concurrency/health, Entra authority, and consumer-install checks are not applicable.

## Required remediation

1. Declare the README import-validation and collision-decision promises in `.factory/claims.json`.
2. Add exactly one `@claim:` demo-sandbox test per declaration proving invalid imports make no write and matching IDs require an explicit replace-or-skip choice.
3. Re-run the exact claims commands and independent verification.
