# Independent product verification 5 — FAIL

- Date: 2026-08-29 UTC
- Work order: `explanation-lab-verify-5`
- Candidate and checked-out commit: `10c0d6cf2c8f1cc4fa65a9eb3f83f19d67eedd2d`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**FAIL — do not release this candidate.** The deployment is healthy, matches the candidate build byte-for-byte, and the core learning workflow works. The release is blocked by an unlisted visitor-facing deletion claim. Independent QA also found a sub-44px mobile navigation target and a raw parser error that does not tell a learner how to recover. These are product defects, not a deployment-only failure.

No product code was changed during verification.

## Mandatory first-read and demo gate — PASS

A cold, service-worker-free 1440×900 browser context returned HTTP 200 with no console or page errors. The first screen plainly answers all three required questions:

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps in their understanding.”
- What to click first: “Try it with sample data,” beside “Opens a due explanation and two recent examples.”

The action is visible in the first 390×844 screen. One click opens `/?demo=1`, where three realistic examples are already populated. The persistent banner states “Demo — sample data, nothing is saved to your work” and provides **Reset demo** and **Start for real**.

Evidence: `verification-5-evidence/first-read-desktop.png`, `live-cold-mobile-390.png`, and `live-demo-desktop.png`.

## Claims gate — FAIL

`.factory/claims.json` exists with 17 entries. Every ID occurs exactly once as `@claim:<id>` in `tests/app.spec.ts`. The first attempt made before any other repository work could not load `@playwright/test` because a clean clone has no installed dependencies. After the required `npm ci`, every exact command from the manifest passed from fresh Playwright contexts.

| Claim | Installed result |
| --- | --- |
| `one-click-demo` | Pass, desktop + mobile |
| `demo-isolation` | Pass, desktop + mobile |
| `demo-reset-exit` | Pass, desktop + mobile |
| `four-part-revisit` | Pass, desktop + mobile |
| `four-prompt-practice` | Pass, desktop + mobile |
| `json-export` | Pass, desktop + mobile |
| `json-import` | Pass, desktop + mobile |
| `atomic-import-validation` | Pass, desktop + mobile |
| `duplicate-import-decision` | Pass, desktop + mobile |
| `audio-backup` | Pass, desktop + mobile |
| `local-private` | Pass, desktop + mobile |
| `manual-no-sync` | Pass, desktop + mobile |
| `no-tracking` | Pass, desktop + mobile |
| `free-no-account` | Pass, desktop + mobile |
| `offline-reload` | Pass, desktop + mobile |
| `mobile-ready` | Pass, mobile |
| `site-data-clear` | Pass, desktop + mobile |

That is 33 passing claim-test executions. However, the live Privacy page promises, “You can also delete individual explanations there.” There is no deletion entry in `.factory/claims.json` and no `@claim:` deletion test. A repository search found the statement and implementation but no claim tag. Manual live QA confirmed both cancel and confirm currently work; the release still fails the supplied rule that every visitor-reliant claim must be declared and continuously proved.

## Clean-checkout quality gates

| Check | Fresh result |
| --- | --- |
| Identity | `git rev-parse HEAD` exactly matched the requested candidate |
| Install | `npm ci`: 22 packages; 0 vulnerabilities |
| Every manifest command | 17/17 commands passed; 33 browser executions |
| Full suite | `CI=1 npm test`: 53 passed, 3 intended desktop skips |
| Accessibility suite | `CI=1 npm run test:a11y`: 2/2 passed |
| Typecheck | `npm run typecheck`: passed |
| Lint | `npm run lint`: passed |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities |
| Exact production build | `npm run build`: passed; `dist/index.html` and `dist/404.html` produced |

Production payloads are within the supplied budgets: JavaScript 33,856 bytes raw / 11,597 gzip; CSS 18,462 bytes raw / 4,679 gzip; mobile hero 27,210 bytes; no font payloads. Fresh live mobile Lighthouse scored 98 performance, 100 accessibility, 100 best practices, and 100 SEO; FCP 1.2 s, LCP 1.3 s, TBT 180 ms, CLS 0, total transfer 53 KiB. Lighthouse lab data does not provide field INP.

## Independent end-to-end results

### Passing behavior

- Created and completed a realistic four-prompt demo explanation. It returned to the queue with 4/4 prompts and the exact seven-day date, 5 September 2026.
- Reset demo removed the temporary record and restored exactly three bundled samples.
- A fresh real workspace showed its useful empty state and start action. Empty required topic input was blocked and focused; a two-character topic showed the three-character correction. Topic and response limits enforced 100 and 6,000 characters.
- Exported real work, parsed the downloaded JSON, and found the saved topic. A malformed file did not lock the library; an invalid date made no partial write and remained recoverable after reload. Duplicate IDs required explicit skip or replace decisions.
- Delete cancellation preserved the named explanation; confirmation removed it.
- A fake microphone recorded successfully, and route navigation changed its track from `live` to `ended`. Forced permission denial explained that text remained available and left the textarea editable.
- Work and import results survived route navigation and reload within their local browser profile. Demo and real data remained separate in the claim suite.

Machine-readable details are in `verification-5-evidence/live-qa.json`; the reproducing script is `verification-5-evidence/live-qa.mjs`.

## Accessibility and responsive behavior

- Live axe scans on `/`, `/?demo=1`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, `/visual-notes`, and the designed 404 found zero serious or critical violations. Every route had one h1, a route-specific title, and no horizontal overflow at 390px.
- Keyboard-only smoke passed: first Tab reached the visible skip link, Enter focused `<main>`, and keyboard navigation to Demo moved focus to its h1. The local focus-contrast regression test passed at 3:1 or better.
- At 200% root text size, demo, practice, privacy, and visual-notes routes retained zero horizontal overflow.
- With reduced motion, `animation-name` was `none`, transition duration was `0.00001s`, and scroll behavior was `auto`.
- Repeated header/footer targets were at least 44px. The workbench’s visible “← Sample overview” target was only 163.77×24.80px, which fails the required 44px target height. Evidence: `verification-5-evidence/touch-target.json` and `live-workbench-mobile-touch.png`.

The product has an explicitly documented single-mode visual thesis. Contrast, semantics, labels, landmarks, alt text, and no-zoom-disable checks passed through axe, the factory smoke check, source inspection, and regression tests.

## Privacy, network, and headers

The complete live demo, real-work, import/export, microphone, legal-route, and offline flows emitted only `https://explanation-lab.sociobot.in` requests. There were zero cross-origin runtime requests, console errors on normal routes, or page errors. Source and build scans found no analytics, advertising, third-party runtime script/font, AI/model endpoint, embedded credential, or product-unlock call.

Live HTML responses carry a self-only CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), geolocation=(), microphone=(self)`, and `Cross-Origin-Opener-Policy: same-origin`. Browser-captured and command-line response headers agreed.

This is a static, account-free PWA. It has no server-side endpoint, billing/unlock request, sign-in, package, or CLI. API allowance/429, concurrency, backend persistence/health/build identity, Entra authority, and consumer-package checks are not applicable.

## PWA, routing, caching, and deployment parity

- The manifest is valid JSON with standalone display, versioned start URL, matching theme/background colors, 192px and 512px icons, and a maskable 512px icon. The apple-touch icon is 180px.
- After service-worker control, a 390px demo reloaded offline with its seeded siren example. Cache `explanation-lab-shell-v4` was present.
- An `UPDATE_READY` service-worker message displayed “An update is ready. Reload to use it.” The notice survived a client-side route render and remained after 4.1 seconds.
- HTML uses `public, must-revalidate, max-age=30`; hashed build assets use `public, max-age=31536000, immutable`; stable assets revalidate; `/sw.js` uses `no-cache`.
- `/`, demo, practice, library, privacy, terms, and visual-notes return 200. An unknown path returns the designed page with HTTP 404. All nine links discoverable from the landing page returned 2xx, including the external Param Factory link.
- SHA-256 matched for all 16 served files between fresh local `dist/` and the live origin. `staticwebapp.config.json` is host-consumed and therefore excluded. The live deployment matches the candidate runtime exactly.
- `/opt/fleet/lib/verify-url.sh` returned HTTP 200 with `Demo — Explanation Lab`, `lang=en`, one h1, a main landmark, zero missing alt attributes, zero unlabeled buttons, and no console errors.

## Defects

### QA5-01 — High, release-blocking — deletion promise is absent from the claims contract

The live `/privacy` page states, “You can also delete individual explanations there.” `.factory/claims.json` has no corresponding entry, and `tests/app.spec.ts` has no `@claim:` deletion test. This violates the explicit every-claim-is-a-test gate even though a manual live cancel/confirm check passes today.

Required remediation: add one deletion claim and one uniquely tagged demo-sandbox test that proves cancel preserves the named record and confirm removes only that record, or remove the visitor-facing promise.

### QA5-02 — Medium, release-blocking baseline — workbench back link is below the 44px touch minimum

At 390×844 on `/?demo=1&id=sample-doppler`, “← Sample overview” measures 163.765625×24.796875 CSS pixels. It is a visible, primary escape from the practice workbench and does not meet the supplied 44×44 touch-target baseline.

Required remediation: give the link at least a 44px interactive height without breaking 200% reflow, and add it to the mobile target regression test.

### QA5-03 — Medium — malformed JSON exposes a raw parser error without a next step

On `/library`, importing a file containing `{bad` displays: `Expected property name or '}' in JSON at position 1 (line 1 column 2)`. This is engine jargon and does not say what to do next. A later valid import works, so data and recovery are not blocked.

Required remediation: catch JSON syntax failures and announce plain copy such as, “This file is not valid JSON. Choose an Explanation Lab JSON backup and try again.” Add a regression assertion for the message and successful retry.

## Release decision

**FAIL.** Fix QA5-01 and QA5-02 before release, address QA5-03, then rerun every exact claim command and the 390px live matrix.
