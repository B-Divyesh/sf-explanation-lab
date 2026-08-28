# Independent product verification — FAIL

- Date: 2026-08-28 UTC
- Work order: `explanation-lab-verify-1`
- Candidate: `bf9c1da94379c51be1301341e46fdf3cfe3a21b5`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact class: `pwa-offline`

## Verdict

**FAIL — do not release this candidate.** The live deployment is the candidate build and the declared claim tests pass, but independent testing found release-blocking privacy, data-recovery, claims-contract, and accessibility defects.

## Mandatory first-read gate

**Pass.** A cold 1440×900 visit returned HTTP 200 with no console or page errors.

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps before those gaps find them.”
- What to click first: “Try it with sample data,” beside “Opens a due explanation and two recent examples.”
- One click opened `/demo`, showing one due explanation, one draft, and one completed example. The persistent banner said “Demo — sample data, nothing is saved to your work” and exposed Reset demo and Start for real.

Evidence: `verification-artifacts/live-cold-desktop.png`, `verification-artifacts/live-cold-mobile-390.png`, and `verification-artifacts/live-after-one-click-demo.png`.

## Claims gate

`.factory/claims.json` exists. Each ID occurs exactly once as `@claim:<id>` in `tests/app.spec.ts`. The first pre-install invocation could not load `@playwright/test`, as expected in a dependency-free clone; `npm ci` then installed the lockfile with zero vulnerabilities. Every exact claims command subsequently passed from a fresh Playwright context.

| Claim | Exact command | Result |
| --- | --- | --- |
| `one-click-demo` | `npm test -- --grep @claim:one-click-demo` | Pass, desktop + mobile |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass, desktop + mobile |
| `four-part-revisit` | `npm test -- --grep @claim:four-part-revisit` | Pass, desktop + mobile |
| `json-export` | `npm test -- --grep @claim:json-export` | Pass, desktop + mobile |
| `json-import` | `npm test -- --grep @claim:json-import` | Pass, desktop + mobile |
| `local-private` | `npm test -- --grep @claim:local-private` | Pass, desktop + mobile |
| `free-no-account` | `npm test -- --grep @claim:free-no-account` | Pass, desktop + mobile |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass, desktop + mobile |
| `mobile-ready` | `npm test -- --grep @claim:mobile-ready --project mobile` | Pass, mobile |

That is 17 passing claim executions. No claim command produced a failure trace.

The cross-check still fails the claims contract because visitor-facing statements are absent from `claims.json` or exceed their test's evidence:

- Several claim tests do not use the required demo entry point: `four-part-revisit` starts at `/practice`; `json-export` uses `/practice` and `/library`; `json-import` starts at `/library`; and `free-no-account` starts at `/`.
- “Exports include your text and local audio notes” is not declared. The `json-export` claim test creates and asserts text only. Independent QA confirmed an audio round trip works, but the release gate requires the shipped claim test.
- README/demo/privacy statements that Reset demo and Start for real clear only demo data are not exercised by `demo-isolation`, which only creates a demo record and checks the real library.
- The landing-page statements that the app does not grade, generate explanations, or sync devices have no claim entries.
- `.factory/design.md` says imports validate before replacing data. Duplicate IDs are actually replaced without validation or confirmation (QA-03).

Under the attached claims contract, an unlisted or insufficiently tested claim fails review even when manual QA happens to confirm part of it.

## Clean checkout quality gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Candidate identity | Pass | `git rev-parse HEAD` returned the requested full SHA |
| Install | Pass | `npm ci`; 22 packages, 0 vulnerabilities |
| Full integration suite | Pass | `CI=1 npm test`; 25 passed, 1 expected desktop skip, exit 0 |
| Dedicated axe suite | Pass | `CI=1 npm run test:a11y`; 2 passed, exit 0 |
| Type check | Pass | `npx tsc --noEmit`, exit 0 |
| Lint | N/A | No lint script or configuration exists |
| Exact production build | Pass | `npm run build`, exit 0; `dist/index.html` produced |
| Dependency audit | Pass | `npm audit --audit-level=high`; 0 vulnerabilities |

The earlier `ERR_CONNECTION_REFUSED` run was verifier-induced test-process overlap: a prior Playwright parent removed a preview server reused by another run. After all test/Vite processes exited, the isolated `CI=1 npm test` run above completed successfully. It is not counted as a product failure.

## End-to-end and recovery testing

### Working behavior

- Created a real explanation, recovered from a two-character topic error, completed all four prompts, and received an exact seven-day revisit date.
- Topic `maxlength=100` and response `maxlength=6000` were enforced.
- Trying to finish incomplete work returned to the first missing prompt, announced the exact corrective action, and focused the response field.
- Work survived reload and a second tab in the same browser profile.
- Malformed JSON and wrong-product JSON produced errors; a following valid import succeeded.
- A generated local audio note exported as a data URL and imported into a clean browser with an audio control.
- Cancelled deletion preserved the item; confirmed deletion removed it; Reset demo restored the bundled sample.
- Leaving demo preserved real data. Demo and real requests stayed same-origin.
- Microphone denial explained what happened and left text entry editable.

### Release-blocking defects

#### QA-01 — High — microphone remains live after leaving the recording screen

With fake microphone media enabled, start Record an audio note on `/demo?id=sample-doppler`, then activate the Library navigation link. The captured `MediaStreamTrack.readyState` was `live` before navigation and remained `live` on `/library`; the destination exposed zero Stop controls. A learner can unknowingly keep the microphone active with no visible recovery action. Route changes and demo exit must stop all recorder tracks, or a persistent global recording control must remain available.

#### QA-02 — High — a structured backup with an invalid date permanently locks the library

An otherwise valid Explanation Lab JSON import containing `updatedAt: "not-a-date"` was accepted and persisted. Rendering then failed with “Invalid time value” and showed “Your browser could not open the workbench.” Reload showed the same error, and Try again cannot remove the poisoned record. Validate all imported dates before writing and keep invalid input out of IndexedDB.

#### QA-03 — High — duplicate import IDs overwrite work without warning

Importing “Original imported topic” with ID `collision`, then a second valid backup with the same ID and topic “Replacement imported topic,” left zero original rows and one replacement row. No dialog or status warning appeared. This is silent destructive replacement and contradicts the recorded interaction rule “Imports validate before replacing data.” Require an explicit replace/skip decision and report the result.

#### QA-04 — High — 200% text resize causes horizontal content overflow

At a 390×844 viewport with the root text size changed from 16px to 32px, final rendered routes overflowed horizontally:

- `/demo`: 93 CSS px
- `/practice`: 41 CSS px
- `/privacy`: 107 CSS px

Long display-font headings exceed their containers. This violates the supplied “text resizes to 200% without loss” baseline and WCAG-style reflow expectations.

#### QA-05 — Release-blocking contract — unlisted and under-tested claims

The claims discrepancies listed in the Claims gate violate the explicit acceptance rule that every visitor-facing claim be listed and tested.

### Other defects

#### QA-06 — Medium — mobile touch targets are below 44×44 CSS px

Across tested 390px routes, the home wordmark measured 36×36, the Demo navigation target 30×44, and footer links measured approximately 358×19.8. These repeat on every screen and fail the supplied touch-target baseline.

#### QA-07 — Medium — focus indicator contrast fails the required 3:1

The global focus outline is `#ff5a36`. Its contrast is 2.73:1 against paper `#f4f0e6`, 2.24:1 against yellow `#ffd84d`, and 1.94:1 against blue `#164bff`. The 4px outline is visible but does not meet the contract's ≥3:1 focus requirement on common surfaces.

#### QA-08 — Medium — unknown pages return HTTP 200

`/missing-page` renders the designed 404 screen, title, and canonical URL but the server returns HTTP 200. `staticwebapp.config.json` has no `responseOverrides` entry for 404. This is not the required real 404 response and misleads crawlers and monitoring.

#### QA-09 — Medium — non-hashed assets receive one-year immutable caching

The host applies `Cache-Control: public, max-age=31536000, immutable` to all `/assets/*`, including stable names such as `hero-640.webp`, `hero-1024.webp`, and app icons. A new worker cache version can still receive stale HTTP-cache bytes for those URLs. Restrict immutable caching to content-hashed assets or version the stable asset URLs.

#### QA-10 — Low — the footer lacks a build identity

The footer exposes only `v1.0`, not a commit or build ID. Runtime bytes were independently matched for this review, but the required footer build identity is absent.

## Accessibility, mobile, keyboard, and motion

- Axe through Playwright: zero serious/critical violations on `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and `/missing-page`, on desktop and 390px mobile.
- Lighthouse accessibility: 100.
- Each tested route had `lang=en`, one `<h1>`, a `<main>`, an appropriate title, and a route-specific canonical and description.
- Keyboard smoke test passed after awaiting route completion: first Tab focused the skip link; Enter focused `<main>`; keyboard navigation to Demo focused the new `<h1>`.
- The skip-link focus outline computed as 4px solid with a 4px offset, but contrast fails as QA-07 describes.
- Reduced motion matched `reduce`; workbench animation was `none`, transitions became `0.01ms`, and scrolling became `auto`.
- Normal 390px layouts had no horizontal overflow. At 200% text, QA-04 applies.
- Visual evidence: `verification-artifacts/live-workbench-mobile-390.png` and `verification-artifacts/live-real-library-desktop.png`.

## Privacy, network, security, and PWA

- A real edit/import/demo/audio workflow generated requests only to `https://explanation-lab.sociobot.in`. Lighthouse reported zero third-party requests. No analytics, advertising, CDN font, or runtime AI request appeared.
- No secrets or Azure/OpenAI runtime endpoints were found. AI is correctly omitted because the researched brief makes generated explanations and grading non-goals.
- No console errors, page errors, or unexpected failed requests occurred in the normal, offline, or update flows.
- Security headers on HTML/assets included CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, microphone-only permissions policy, COOP, and `frame-ancestors 'none'`.
- The manifest has standalone display, versioned start URL, 192px and 512px icons, a maskable 512px icon, and matching theme/background colors.
- The live service worker controlled the page, used cache `explanation-lab-shell-v2`, and `/sw.js` was served with `Cache-Control: no-cache`.
- After enabling offline mode and reloading `/demo`, the complete sample workspace remained available.
- A synthetic worker `UPDATE_READY` message remained visible after client-side navigation and 4.2 seconds, exercising the live update-notice handler.
- QA-01 is the exception to the otherwise local-only privacy behavior.
- This is a static PWA with no server API, unlock endpoint, authentication, or backend persistence. API burst/rate-limit, backend concurrency/health, Entra authority, and library/CLI consumer-package checks are not applicable.

## Deployment identity, headers, and performance

All public runtime files from `dist/` matched live SHA-256 bytes: `index.html`, hashed JS/CSS, service worker, manifest, offline page, icons, hero images, social image, favicon, robots, and sitemap. `staticwebapp.config.json` is intentionally consumed by the host rather than exposed; the live headers prove its active rules. Therefore the deployment is candidate `bf9c1da94379c51be1301341e46fdf3cfe3a21b5`.

Caching observed:

- HTML: `public, must-revalidate, max-age=30`
- Hashed JS/CSS: `public, max-age=31536000, immutable`
- Service worker: `no-cache`
- Stable images/icons: also immutable, which is QA-09

Production sizes:

- JavaScript: 29,954 bytes raw / 10,445 bytes gzip
- CSS: 18,128 bytes raw / 4,591 bytes gzip
- Mobile hero: 27,210 bytes
- Desktop hero: 58,766 bytes
- Fonts: none downloaded
- Lighthouse transfer total: 46,104 bytes, 7 requests, 0 third-party requests

Fresh live Lighthouse 12.8.2 mobile results:

- Performance 93
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.0 s; LCP 1.1 s; CLS 0; Speed Index 1.0 s; TBT 310 ms

Reports: `verification-artifacts/lighthouse-mobile.json` and `verification-artifacts/lighthouse-quality.json`.

## Commands to reproduce the passing baseline

```sh
npm ci
CI=1 npm test
CI=1 npm run test:a11y
npx tsc --noEmit
npm run build
/opt/fleet/lib/verify-url.sh https://explanation-lab.sociobot.in/demo /tmp/explanation-lab-verify
```

`verify-url.sh` returned HTTP 200 in 832 ms, title `Demo — Explanation Lab`, `lang=en`, one h1, a main landmark, zero missing image alts, zero unlabeled buttons, and zero console errors.
