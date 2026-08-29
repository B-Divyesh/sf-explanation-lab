# Independent product verification 7 — FAIL

- Date: 2026-08-29 UTC
- Work order: `explanation-lab-verify-7`
- Candidate and checked-out commit: `fa3868345839b142039ced4325263b449716f991`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**FAIL — do not release this candidate.** The live deployment matches the
candidate, every declared claim passes, and the core learning flow works.
However, the live explanation workbench creates horizontal overflow at 390px
when text is resized to 200%. This violates the supplied non-negotiable
accessibility baseline. The repository's reflow test does not visit a
workbench, so the defect is not covered by the green test suite.

No product code was changed during verification.

## Mandatory first-read and demo gate — PASS

A cold, service-worker-blocked 1440×900 context returned HTTP 200. The first
screen answers all three required questions in plain words:

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps in their
  understanding.”
- What to click first: “Try it with sample data,” beside “Opens a due
  explanation and two recent examples.”

One click opened `/?demo=1`, displayed the persistent “Demo — sample data,
nothing is saved to your work” banner, and loaded the three documented sample
topics. The action was also visible at 390×844.

Evidence: `verification-evidence/first-read-live-desktop.png`,
`live-landing-mobile-390.png`, and `live-demo-desktop.png`.

## Claims gate — PASS

`.factory/claims.json` exists with 18 entries. Before broader QA, every exact
manifest command was run independently from this checkout. All 18 commands and
35 configured browser executions passed. Every claim ID appears exactly once
as `@claim:<id>` in `tests/app.spec.ts`; there are no undeclared claim tags.

| Claim | Result |
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
| `individual-delete` | Pass, desktop + mobile |

A cross-check of the live landing page, demo, library, privacy and terms pages,
README, and implementation found no unlisted visitor-reliant capability or
privacy claim.

## Release-blocking defect

### QA7-01 — High — the workbench does not reflow at 200% text

Reproduction from a fresh browser context:

1. Set the viewport to 390×844.
2. Open
   `https://explanation-lab.sociobot.in/?demo=1&id=sample-doppler`.
3. Set the root text size from 16px to 32px, representing 200% text resize.
4. Compare `document.documentElement.scrollWidth` and `clientWidth`.

Observed: the document is 409px wide in a 390px viewport, producing 19px of
horizontal overflow. The orange progress stamp is the visible cause: its
“prompts answered” label reaches x=406.88px. The page therefore requires
horizontal scrolling at a phone-width reflow breakpoint.

Expected: the complete workbench must reflow within 390px at 200% text without
horizontal scrolling or content loss.

Why the suite misses it: the passing test at `tests/app.spec.ts:304` checks
`/?demo=1`, `/practice`, `/privacy`, and `/visual-notes`; it never opens an
explanation workbench with an `id` query.

Evidence: `verification-evidence/live-workbench-mobile-200pct.png` and the
`QA7-01` finding in `verification-evidence/live-qa.json`.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| Identity | HEAD exactly matched the requested candidate |
| Install | `npm ci`: 22 packages; 0 vulnerabilities |
| Full suite | `CI=1 npm test`: 57 passed, 3 intended desktop skips |
| Accessibility suite | `CI=1 npm run test:a11y`: 2 passed |
| Typecheck | `npm run typecheck`: passed |
| Lint | `npm run lint`: passed |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities |
| Exact production build | `npm run build`: passed; `dist/` produced |

Playwright is pinned to 1.58.2 as required.

## End-to-end and recovery results

- Created a live explanation, answered all four distinct prompts, and received
  the exact seven-day revisit date, 5 September 2026.
- Empty and two-character topics were blocked with focus and a corrective
  message. The browser enforced 100-character topics and 6,000-character
  responses.
- Trying to finish incomplete work opened the first missing prompt and
  announced the required correction in the live region.
- Recorded and retained an audio note. Navigating away changed the captured
  microphone track from `live` to `ended`. Forced permission denial explained
  the text fallback and left the response field editable.
- Reset demo restored exactly three samples. Start for real cleared only the
  demo and opened a blank real workspace.
- Exported real work and parsed its JSON. Malformed JSON and an invalid date
  were rejected without changing saved work. Duplicate IDs required explicit
  skip or replace consent.
- Cancelled deletion preserved the named explanation; confirmed deletion
  removed only that explanation.
- A separate Tab/Enter-only run created and completed a 4/4 explanation. The
  first Tab reached the skip link, Enter focused main, and reached controls had
  a 4px solid focus outline.

Machine-readable evidence: `verification-evidence/live-qa.json`.

## Accessibility, mobile, and visual QA

- Live Playwright axe scans found zero serious or critical findings on `/`,
  both demo entry forms, a workbench, practice, library, privacy, terms, visual
  notes, and the designed 404, on desktop and 390px mobile.
- All inspected routes had `lang=en`, one h1, a main landmark, appropriate
  titles, and no normal-size horizontal overflow.
- `/opt/fleet/lib/verify-url.sh` returned HTTP 200 in 623ms with title
  `Demo — Explanation Lab`, one h1, a main landmark, no missing image alt text,
  no unlabeled buttons, and no browser errors.
- Every visible interactive target swept across the live mobile routes met the
  44×44 CSS-pixel baseline. The visually hidden file input is represented by
  its full-size visible label and was not treated as a touch target.
- Reduced motion removed the sheet animation, reduced transitions to 0.01ms,
  and changed smooth scrolling to automatic.
- The normal desktop and mobile screens are legible and visually consistent
  with the recorded reasoning-workbench thesis. QA7-01 applies only at 200%
  text on the workbench.

## Privacy, network, headers, and applicability

The complete live demo, real-work, import/export, audio, error, legal-route,
update, and offline matrix emitted zero cross-origin requests. It produced zero
unexpected console errors and zero page errors. The one deliberate unknown
route produced the expected browser 404 resource message.

HTML responses include a self-only CSP, HSTS,
`X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), geolocation=(), microphone=(self)`, and
`Cross-Origin-Opener-Policy: same-origin`.

Source and runtime scans found no analytics, advertising, external script or
font, AI/model endpoint, embedded credential, billing call, or product-unlock
request. This is a static, account-free PWA with no server endpoint. API
allowance/429 behavior, backend concurrency/health, Entra authority, and
library/CLI consumer-package checks are therefore not applicable.

## PWA, routing, and caching

- The manifest declares standalone display, a versioned start URL, matching
  theme/background colors, correct 192px and 512px icons, and a maskable 512px
  icon. The apple-touch icon is 180px and the social card is 1200×630.
- The live service worker controlled the page, completed an explicit update
  check, and used cache `explanation-lab-shell-v4`. Its update-ready notice
  remained visible through a route render.
- The demo reloaded offline with all three sample records.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year
  immutable caching; stable images revalidate; `/sw.js` uses `no-cache`.
- Product routes and every public link returned 200. The designed unknown page
  returned HTTP 404.

## Performance and deployment identity

The production build is inside every supplied payload budget:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 34,034 B | 11.66 KB |
| CSS | 18,496 B | 4.66 KB |
| Mobile hero | 27,210 B | n/a |
| Fonts | 0 B | 0 B |

Two fresh Lighthouse 12.8.2 mobile runs scored 99–100 performance. The full
run scored 100 accessibility, 100 best practices, and 100 SEO, with FCP 1.1s,
LCP 1.3s, CLS 0, TBT 0ms, 46 KiB transferred, and seven requests. A separate
Event Timing sample measured a worst interaction of 32ms, below the 200ms
budget.

All 16 public runtime files served by production matched fresh local `dist/`
files byte-for-byte by SHA-256: HTML, 404, hashed JavaScript and CSS, service
worker, manifest, offline page, icons, images, favicon, robots, and sitemap.
The live deployment therefore matches candidate
`fa3868345839b142039ced4325263b449716f991`.

Evidence: `verification-evidence/lighthouse-live-full.json`,
`lighthouse-live.json`, and `verify-url/verify.json`.

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 1 | QA7-01: workbench overflows by 19px at 390px and 200% text |
| Medium | 0 | None |
| Low | 0 | None |

## Release decision

**FAIL.** Candidate `fa3868345839b142039ced4325263b449716f991`
must not be released until QA7-01 is fixed and a 390px, 200%-text workbench
regression test is added.
