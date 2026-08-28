# Independent product verification 2 — FAIL

- Date: 2026-08-28 UTC
- Work order: `explanation-lab-verify-2`
- Candidate: `31c563cd783f065230944b979c9e419569c730b7`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact class: `pwa-offline`

## Verdict

**FAIL — do not release this candidate.** The deployment is healthy and byte-for-byte matches the candidate build, but fresh independent testing reproduced release-blocking microphone, import, data-loss, reflow, and claims-contract defects. This is not a deployment-only failure.

## Mandatory first-read gate

**Pass.** A cold 1440×900 visit returned HTTP 200 with no console or page errors.

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps before those gaps find them.”
- First click: “Try it with sample data,” beside “Opens a due explanation and two recent examples.”
- One click opened `/demo` with a due explanation, a draft, and another completed example. The persistent banner says “Demo — sample data, nothing is saved to your work” and provides Reset demo and Start for real.

Evidence: `verification-artifacts/verify2-live-cold-desktop.png`, `verification-artifacts/verify2-live-cold-mobile-390.png`, and `verification-artifacts/verify2-live-demo-one-click.png`.

## Claims gate

`.factory/claims.json` exists. Every declared ID occurs exactly once in `tests/app.spec.ts`.

The mandated invocations were attempted before any other repository work in the dependency-free clone. All nine commands exited 1 because `@playwright/test` was not installed. After the repository's required `npm ci`, all exact commands passed. The installed result was 17 passing browser executions:

| Claim | Exact command | Installed result |
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

The claims contract still fails:

- `four-part-revisit`, `json-export`, `json-import`, and `free-no-account` bypass the required `/demo` sandbox entry point.
- “Exports include your text and local audio notes” is not a declared claim, and the export claim test asserts text only. A fresh manual audio export/import round trip passed, but the shipped test does not prove the visitor-facing audio claim.
- Claims that Reset demo and Start for real clear only demo data are not exercised by `demo-isolation`. Fresh manual testing passed both actions.
- Visitor-facing statements that the app does not grade, generate explanations, sync, use analytics/advertising/third-party scripts, or send data to a server are absent from `claims.json`.
- README statements about local audio coverage, demo clearing, and clearing site data exceed the declared automated evidence.

Under the supplied acceptance contract, unlisted or under-tested claim copy is release-blocking even where manual testing confirms the behavior.

## Clean-checkout quality gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Candidate identity | Pass | `git rev-parse HEAD` returned the requested SHA |
| Install | Pass | `npm ci`; 22 packages, zero vulnerabilities |
| Full suite | Pass | `CI=1 npm test`; 25 passed, one intentional desktop skip |
| Dedicated axe suite | Pass | `CI=1 npm run test:a11y`; 2 passed |
| Type check | Pass | `npx tsc --noEmit` |
| Lint | N/A | No lint script or configuration exists |
| Production build | Pass | `npm run build`; `dist/index.html` produced |
| Dependency audit | Pass | `npm audit --audit-level=high`; zero vulnerabilities |
| Worker URL smoke test | Pass | `verify-url.sh`; HTTP 200, title/lang/main present, 0 missing alts, 0 unlabeled buttons, 0 console errors |

## End-to-end and recovery results

### Passing behavior

- Created a real explanation, completed all four prompts, and received the exact seven-day revisit date (4 September 2026).
- A two-character topic produced “Name the idea in at least three characters” and returned focus to the field.
- Topic and response limits enforced 100 and 6,000 characters.
- Finishing incomplete work returned to the first missing prompt, announced the correction, and focused the response field.
- Saved work survived reload and a second tab in the same profile.
- Malformed JSON and a wrong-product file produced useful errors; a following valid import succeeded.
- A local fake-microphone recording exported as `audio/webm;codecs=opus`, then imported into a clean profile with a playable audio control.
- Cancelling deletion preserved the item; confirming deletion removed it.
- Reset demo restored three samples. Start for real cleared the demo without changing real data; returning to demo reseeded three samples.
- Microphone denial explained the next step and left text entry editable.
- Normal tested workflows made only same-origin requests and produced no console or page errors.

### Release-blocking defects

#### QA2-01 — High — microphone remains live after route navigation

With a fake microphone granted, open `/demo?id=sample-doppler`, select Record an audio note, and then use the Library navigation link. The captured `MediaStreamTrack.readyState` was `live` before navigation and remained `live` on `/library`. The destination had zero Stop controls. A learner can unknowingly leave the microphone active with no visible recovery action.

#### QA2-02 — High — an invalid imported date permanently locks the library

An otherwise structured Explanation Lab backup with `updatedAt: "not-a-date"` was accepted and persisted. The library immediately rendered “Your browser could not open the workbench” and “Invalid time value.” Reload reproduced the same state; Try again cannot remove the poisoned record. Recovery requires clearing all site data, which also destroys valid work.

Evidence: `verification-artifacts/verify2-invalid-date.png`.

#### QA2-03 — High — duplicate import IDs silently overwrite work

Importing “Original imported topic” with ID `collision`, then importing “Replacement imported topic” with the same ID, left zero original rows and one replacement row. No dialog appeared. This silently replaces user work and contradicts `.factory/design.md`, which says imports validate before replacing data.

#### QA2-04 — High — 200% text resizing breaks mobile reflow

At 390×844 with root text size changed from 16px to 32px, final rendered pages overflowed horizontally:

- `/demo`: 93 CSS px
- `/practice`: 41 CSS px
- `/privacy`: 107 CSS px

The demo heading is visibly clipped. This violates the supplied “text resizes to 200% without loss” baseline.

Evidence: `verification-artifacts/verify2-mobile-text-200.png`.

#### QA2-05 — Release-blocking contract — claims are unlisted or do not use the demo sandbox

The claims discrepancies in the Claims gate violate the explicit acceptance contract.

### Other defects

#### QA2-06 — Medium — repeated mobile targets are below 44×44 CSS px

At 390px, the home wordmark measured 36×36, the Demo navigation target 30×44, and each footer link about 358×19.8. These repeat across tested routes.

#### QA2-07 — Medium — focus indicator contrast is below 3:1

The 4px focus outline is `#ff5a36`. Its contrast is 2.73:1 against paper, 2.24:1 against yellow, and 1.94:1 against blue. The supplied baseline requires at least 3:1.

#### QA2-08 — Medium — the designed missing page returns HTTP 200

`/fresh-verifier-missing-page` renders the product's 404 UI but returns HTTP 200. `staticwebapp.config.json` has no 404 response override.

#### QA2-09 — Medium — stable asset names receive immutable one-year caching

`/assets/hero-640.webp` and other stable image/icon URLs return `Cache-Control: public, max-age=31536000, immutable`. New deployments can leave returning visitors with stale art or icons. Only content-hashed URLs should receive immutable caching.

#### QA2-10 — Low — footer has no build identity

The footer exposes `v1.0` but no commit or build identifier. Runtime identity had to be established by byte comparison.

## Accessibility, keyboard, mobile, and motion

- Fresh live Playwright axe checks found zero serious/critical violations on `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and an unknown route at both desktop and 390px.
- Fresh Lighthouse accessibility score: 100.
- Every tested route had `lang=en`, one `<h1>`, one `<main>`, a route-specific title and description, canonical URL, and no image missing `alt`.
- First Tab focused the skip link; Enter focused `<main>`. Keyboard navigation to Demo ultimately focused its `<h1>` and announced the same text in the live region.
- Reduced-motion emulation matched `reduce`; workbench animation was `none`, transitions were effectively instant, and scroll behavior was `auto`.
- Normal 390px routes had no horizontal overflow. QA2-04 applies at 200% text.
- Axe does not detect the manual target-size and focus-contrast failures in QA2-06 and QA2-07.

## Privacy, network, security, and PWA

- Live normal, demo, recording, and offline flows requested only `https://explanation-lab.sociobot.in`. Lighthouse reported zero third-party requests.
- Source and built-output scans found no analytics, runtime AI endpoint, embedded secret, external font, or third-party script. AI is correctly omitted because generated explanations and grading are brief non-goals.
- HTML/assets returned CSP, HSTS, `nosniff`, strict-origin referrer policy, microphone-only Permissions Policy, COOP, and `frame-ancestors 'none'`.
- The manifest has standalone display, versioned start URL, 192/512 icons, a maskable icon, and palette-matching colors.
- The active service worker was `/sw.js`, cache `explanation-lab-shell-v2` held the shell and hashed JS/CSS, and `registration.update()` left the current worker activated with no unexpected waiting worker.
- A simulated worker update message stayed visible after route navigation and 4.2 seconds.
- After service-worker control, setting the browser offline and reloading `/demo` preserved the full seeded workspace. Evidence: `verification-artifacts/verify2-live-offline-mobile.png`.
- QA2-01 is the exception to the otherwise local-only privacy behavior.
- This product is a static, account-free PWA with no API, unlock call, authentication, backend persistence, package, or CLI. API rate limiting, backend concurrency/health, Entra authority, and consumer-install checks are not applicable.

## Deployment identity, response policy, links, and performance

All 15 public runtime files in `dist/` matched their live SHA-256 bytes, including HTML, hashed JS/CSS, service worker, manifest, images, icons, robots, and sitemap. The deployment therefore matches candidate `31c563cd783f065230944b979c9e419569c730b7`.

Observed caching:

- HTML: `public, must-revalidate, max-age=30`
- Hashed JS/CSS: `public, max-age=31536000, immutable`
- Service worker: `no-cache`
- Stable `/assets/*`: also immutable (QA2-09)

All 11 discovered internal/external links returned HTTP 200. Sitemap lists all six public product routes. Metadata titles were at most 48 characters and descriptions at most 93 characters.

Production budgets:

- JavaScript: 29,954 bytes raw / 10,448 bytes gzip
- CSS: 18,128 bytes raw / 4,602 bytes gzip
- Mobile hero: 27,210 bytes; desktop hero: 58,766 bytes
- Fonts: none downloaded
- Lighthouse transfer total: 46,116 bytes; zero third-party requests

Fresh Lighthouse 12.8.2 mobile results:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.13 s; LCP 1.36 s; CLS 0; TBT 58.5 ms; Speed Index 1.13 s

Report: `verification-artifacts/lighthouse-verify2.json`.

## Reproduction commands

```sh
npm ci
CI=1 npm test
CI=1 npm run test:a11y
npx tsc --noEmit
npm run build
npm audit --audit-level=high
mkdir -p /tmp/explanation-lab-verify2
/opt/fleet/lib/verify-url.sh https://explanation-lab.sociobot.in/demo /tmp/explanation-lab-verify2
```
