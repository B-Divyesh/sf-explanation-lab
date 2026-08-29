# Independent product verification 6 — PASS

- Date: 2026-08-29 UTC
- Work order: `explanation-lab-verify-6`
- Candidate and checked-out commit: `885f177cbe597b5f7f76f9a16cabf16b5b9b9dd4`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**PASS — accept this candidate for release.** The live deployment is healthy,
matches the candidate production build byte-for-byte, and fulfills the
researched job: a learner can practise a mechanism, boundary, example, and
counterexample, keep text or audio locally, and receive an exact seven-day
revisit. No critical, high, medium, or low product defect was found.

No product code was changed during verification.

## Mandatory first-read and demo gate — PASS

A cold, service-worker-blocked 1440×900 context returned HTTP 200 with no
console or page error. The first screen answers the required questions in plain
words:

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps in their
  understanding.”
- What to click first: “Try it with sample data,” beside “Opens a due
  explanation and two recent examples.”

The action is visible at 390×844. One click opens the isolated sample library
with three realistic explanations. Its persistent banner says, “Demo — sample
data, nothing is saved to your work,” and provides **Reset demo** and **Start
for real**.

Evidence: `verification-6-evidence/first-read-desktop.png`,
`live-cold-mobile-390.png`, and `live-demo-desktop.png`.

## Claims gate — PASS

`.factory/claims.json` exists with 18 entries. Every claim ID has exactly one
`@claim:<id>` tag. As required, every manifest command was invoked before other
repository QA. The literal pre-install probe could not load
`@playwright/test` because a clean clone has no `node_modules`; after the
required `npm ci`, every exact command passed from fresh browser contexts.

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
| `individual-delete` | Pass, desktop + mobile |

That is 18/18 commands and 35 passing browser executions. A cross-check of the
landing page, legal pages, README, and implementation found no undeclared
visitor-reliant capability or privacy claim.

## Clean-checkout quality gates

| Check | Fresh result |
| --- | --- |
| Identity | HEAD exactly matched the requested candidate |
| Install | `npm ci`: 22 packages; 0 vulnerabilities |
| Full suite | `CI=1 npm test`: 55 passed, 3 intended desktop skips |
| Accessibility suite | `npm run test:a11y`: 2/2 passed |
| Typecheck | `npm run typecheck`: passed |
| Lint | `npm run lint`: passed |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities |
| Exact production build | `npm run build`: passed; `dist/` produced |

Playwright is pinned to 1.58.2 as required.

## Independent end-to-end results

- Completed a new explanation on live production with all four prompt types.
  The library showed 4/4 and the exact revisit date, 5 September 2026.
- Reset the demo and confirmed exactly three bundled samples returned while the
  new demo record disappeared. The claim suite independently proved real/demo
  namespace isolation and preservation of real work.
- Empty required topic input was blocked and focused. A two-character topic
  received an actionable three-character correction. Topic and response limits
  enforced 100 and 6,000 characters.
- Exported real work, parsed the downloaded JSON, and found the saved topic.
  Malformed JSON produced the repaired plain recovery instruction. An invalid
  date caused no partial write and remained recoverable after reload. Duplicate
  IDs required explicit skip or replace decisions.
- Delete cancellation kept the named explanation; confirmation removed only
  that explanation.
- Fake microphone media recorded successfully; route navigation changed the
  captured track from `live` to `ended`. Forced permission denial explained
  the text fallback and left the textarea editable.
- A separate Tab/Enter-only run created and completed a 4/4 explanation. Every
  reached control displayed a solid focus outline, and no keyboard trap was
  encountered.

Machine-readable results are in `verification-6-evidence/live-qa.json`.

## Accessibility, mobile, and visual QA

- Live axe scans on `/`, both demo forms, practice, library, privacy, terms,
  visual notes, and the designed 404 found zero serious or critical findings.
- Every checked route had one h1, a route-specific title, and no horizontal
  overflow at 390px. Four representative routes also reflowed at 200% text.
- The first Tab reached the visible skip link; Enter focused main. Client-side
  route changes moved focus to and announced the destination h1.
- All visible interactive elements on the demo, workbench, practice, and
  library routes met 44px height in an independent mobile sweep. The repaired
  “← Sample overview” link measured 163.77×44 CSS pixels.
- Reduced motion yielded no sheet animation, effectively zero transition time,
  and automatic rather than smooth scrolling.
- The inspected desktop, mobile landing, demo library, workbench, and offline
  states were legible, product-specific, and free of clipping or overlap.
- `/opt/fleet/lib/verify-url.sh` recorded HTTP 200 in 601 ms, `lang=en`, one h1,
  a main landmark, no missing alt text, no unlabeled buttons, and no browser
  errors.

Evidence: `verification-6-evidence/verify-url/`,
`live-workbench-mobile.png`, and the screenshots named above.

## Privacy, network, and response headers

The complete live demo, real-work, import/export, microphone, legal-route,
offline, and error-recovery matrix emitted only
`https://explanation-lab.sociobot.in` requests. It recorded zero cross-origin
requests, console errors, or page errors. Source/build scans found no analytics,
advertising, external script/font, model endpoint, embedded credential, or
product-unlock request.

Browser-captured and command-line headers agree. HTML responses include a
self-only CSP, HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), geolocation=(), microphone=(self)`, and
`Cross-Origin-Opener-Policy: same-origin`.

This is a static, account-free PWA. It has no server-side endpoint, billing or
unlock call, sign-in, package, or CLI. API allowance/429, concurrency, backend
persistence/health/build identity, Entra authority, and clean-consumer package
checks are therefore not applicable.

## PWA, offline, routing, and caching

- The manifest is valid and declares standalone display, a versioned start URL,
  matching theme/background colors, 192px and 512px icons, and a maskable
  512px icon. The apple-touch icon is 180px; the social image is 1200×630.
- The live service worker was activated, controlled the page, and completed an
  explicit `registration.update()` check. Cache `explanation-lab-shell-v4` was
  present. A 390px demo reloaded offline with its bundled siren sample.
- An update-ready worker message displayed “An update is ready. Reload to use
  it.” The notice survived a route render and remained after 4.1 seconds.
- HTML uses `public, must-revalidate, max-age=30`; hashed build assets use a
  one-year immutable policy; stable assets revalidate; `/sw.js` uses
  `no-cache`.
- Product routes return 200, every landing-page link returns 2xx/3xx, and an
  unknown route returns the designed page with HTTP 404.

## Performance and deployment parity

The production build is well inside the supplied payload budgets:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 33,967 B | 11,640 B |
| CSS | 18,496 B | 4,660 B |
| Mobile hero | 27,210 B | n/a |
| Fonts | 0 B | 0 B |

Fresh live mobile Lighthouse 12.8.2 scored **90 performance, 100
accessibility, 100 best practices, and 100 SEO**. FCP was 1.0 s, LCP 1.3 s,
CLS 0, and total transfer 53 KiB. The navigation run does not expose field INP;
a fresh mobile Event Timing interaction sample measured a worst interaction of
48 ms, below the 200 ms budget.

All 16 runtime files served by production match fresh local `dist/` files by
SHA-256, including HTML, JavaScript, CSS, service worker, manifest, icons,
images, robots, sitemap, offline page, and 404. The live deployment therefore
matches candidate `885f177cbe597b5f7f76f9a16cabf16b5b9b9dd4` exactly.

Lighthouse evidence: `verification-6-evidence/lighthouse-live.json`.

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 0 | None |
| Medium | 0 | None |
| Low | 0 | None |

## Release decision

**PASS.** Candidate `885f177cbe597b5f7f76f9a16cabf16b5b9b9dd4` and its
live deployment satisfy the supplied acceptance contract.
