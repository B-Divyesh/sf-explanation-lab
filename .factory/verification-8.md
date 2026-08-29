# Independent product verification 8 — PASS

- Date: 2026-08-29 UTC
- Work order: `explanation-lab-verify-8`
- Candidate and checked-out commit: `053b29758eb345001ec327e77f2d7853488e86cd`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**PASS — this candidate meets the supplied acceptance contract.** The live
deployment is byte-for-byte identical to the candidate's production output,
all 18 declared claims pass, the smallest useful four-prompt practice flow
works, the repaired 390px/200% text layout reflows, and no release-blocking
product, accessibility, privacy, PWA, or deployment defect was found.

No product code was changed during verification.

## Mandatory first-read and demo gate — PASS

A cold 1440×900 browser context with service workers blocked returned HTTP
200. Its first screen states all three required facts in plain words:

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps in their
  understanding.”
- What to click first: “Try it with sample data,” beside “Opens a due
  explanation and two recent examples.”

The action is visible on the 390×844 first screen. One keyboard-operated click
opens `/?demo=1`, shows the persistent “Demo — sample data, nothing is saved
to your work” banner, and seeds the three documented explanations. Reset demo
restores those three samples. Start for real discards the demo workspace and
opens an empty real workspace.

Evidence: `verification-evidence-8/live-first-read-desktop.png`,
`verification-evidence-8/live-demo-desktop.png`, and
`verification-evidence-8/verify-url/screenshot-mobile.png`.

## Claims gate — PASS

`.factory/claims.json` exists and contains 18 well-formed entries. After the
required clean `npm ci`, every manifest command was run independently before
the broader suite. All 18 commands passed, representing 35 configured browser
executions. Every manifest ID occurs exactly once as `@claim:<id>` in the test
suite, with no undeclared claim tags.

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

The repository offline test includes a precautionary online reload before it
goes offline. I separately ran the stricter manifest sequence in a completely
fresh live browser profile: load the demo once, wait for service-worker
control, go offline immediately, and reload. It passed with one stylesheet,
three samples, no failed requests, and no browser errors.

## Clean checkout quality gates — PASS

The initial checkout was clean and at the exact candidate commit. Commands and
results:

```text
npm ci
# 22 packages installed; 0 vulnerabilities

CI=1 npm test
# 57 passed; 3 expected desktop skips for mobile-only checks

CI=1 npm run test:a11y
# 2 passed

npm run typecheck
# pass

npm run lint
# pass

npm audit --audit-level=high
# 0 vulnerabilities

npm run build
# pass; dist/ produced
```

The exact build emitted:

- JavaScript: 34,034 bytes raw / 11.66 KB gzip
- CSS: 18,575 bytes raw / 4.68 KB gzip
- Mobile hero: 27,210 bytes
- Fonts and third-party runtime scripts: none

These are below the supplied 200 KB JS, 50 KB CSS, 120 KB fonts, and 300 KB
mobile-hero budgets.

## End-to-end and recovery checks — PASS

Fresh live browser data was used. The independent flow did the following:

- opened the seeded demo by keyboard and confirmed three realistic samples;
- rejected an empty topic with native validation and a two-character topic
  with a focused, plain-language recovery message;
- bounded user input to 100 topic characters and 6,000 response characters;
- opened a new topic and rejected premature completion by naming and focusing
  the missing prompt;
- answered mechanism, boundary, example, and counterexample, then completed
  the explanation and returned to the library;
- reset the demo and confirmed created demo work disappeared;
- entered the real workspace and confirmed no demo record leaked into it;
- rejected a foreign JSON file with a usable recovery instruction;
- denied microphone access and confirmed the text-only path remained usable;
- saved a real written response and confirmed it survived reload.

The repository suite additionally passed JSON export/import, atomic invalid
import, duplicate skip/replace decisions, audio export/import, delete
cancel/confirm, exact seven-day revisit scheduling, clearing site data, and
microphone-track shutdown during navigation.

## Live deployment and routing — PASS

Sixteen public runtime files were downloaded from the live origin and compared
with local `dist/`; all SHA-256 hashes match. This includes both HTML files,
hashed JavaScript and CSS, service worker, manifest, offline page, images,
icons, sitemap, robots file, and favicon. The host-only
`staticwebapp.config.json` is not a public runtime asset.

`/`, `/?demo=1`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and
`/visual-notes` return HTTP 200. An unknown route returns the designed page
with HTTP 404. Every product link and the external Param Factory link resolves
to HTTP 200.

`/opt/fleet/lib/verify-url.sh` reported the correct title, `lang=en`, one h1,
one main landmark, no missing image alternative text, no unlabeled button, and
no console error on the home page.

## Privacy and security — PASS

The live request log covered landing, demo creation and completion, demo reset,
real-work entry, invalid import, microphone denial, save/reload, legal pages,
and the route matrix. All 41 requests used only
`https://explanation-lab.sociobot.in`. There were no analytics, advertisements,
third-party scripts, API calls, explanation uploads, or audio uploads. IndexedDB
uses separate `demo:explanation-lab` and `explanation-lab` databases.

Normal routes produced zero console errors and zero uncaught page errors. The
only captured error-level browser message was the expected failed-document
message while intentionally requesting the HTTP 404 route.

Live responses include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, a
strict-origin referrer policy, microphone-only permissions policy, and COOP.
HTML revalidates after 30 seconds, hashed JS/CSS are immutable for one year,
stable images revalidate, and `/sw.js` is `no-cache`.

This static product has no server-side product endpoint, unlock call, billing,
runtime AI, or authentication. API allowance/429 testing, backend health and
concurrency, and Entra authority checks are therefore not applicable.

## Accessibility and responsive behavior — PASS

- Independent axe runs on nine routes found zero serious or critical issues.
- The first Tab focuses the visible skip link; Enter focuses `<main>`.
- The sample action and full demo flow are keyboard operable.
- Focus uses a solid 4px outline; the repository contrast check passes 3:1 on
  paper, yellow, and cobalt surfaces.
- Each route has `lang=en`, a route-specific title, one h1, one main, and no
  missing image alt text.
- At 390px and 200% root text size, eight routes—including the populated
  workbench—have 0px horizontal overflow and no visible interactive target
  smaller than 44×44 CSS pixels.
- Reduced-motion emulation matches and removes the workbench animation while
  changing smooth scrolling to `auto`.
- Native confirmation dialogs name destructive records; form errors, save
  feedback, import feedback, and route changes use appropriate focus or live
  regions.

Evidence: `verification-evidence-8/live-workbench-mobile-390.png`,
`verification-evidence-8/live-workbench-mobile-200pct.png`, and
`verification-evidence-8/live-qa.json`.

## PWA and offline behavior — PASS

The live service worker controls the page at `/sw.js`, uses the versioned
`explanation-lab-shell-v4` cache, has no stale waiting worker after an update
check, and restores all three demo records offline. The strict first-visit
offline sequence also passed. A simulated service-worker `UPDATE_READY`
message displayed “An update is ready. Reload to use it,” and the notice
survived route rendering and its normal four-second toast interval.

The manifest has a versioned start query, standalone display mode, matching
theme/background colors, and real 192×192 and 512×512 icons; the 512 icon is
declared maskable. The apple-touch icon is 180×180, hero variants are
640×427/1024×683, and the social card is 1200×630.

## Performance — PASS

Fresh Lighthouse 12.8.2 mobile results from the live URL:

- Performance: 100
- Accessibility: 100
- Best practices: 100
- SEO: 100
- FCP: 0.90 s
- LCP: 1.13 s
- CLS: 0
- TBT: 56 ms
- Total transfer: 45,655 bytes
- Third-party requests: 0

INP is not produced for a single-load lab audit; TBT and the exercised browser
flow showed no responsiveness concern.

Evidence: `verification-evidence-8/lighthouse-mobile.json`.

## Product, content, and documentation — PASS

The four constrained prompts, dated completion/revisit queue, local text and
audio, sample sandbox, backup controls, and seven-day revisit match the
researched brief. The app does not add grading, generated explanations, sync,
or a knowledge base. A normal learner would not need an additional AI feature
to complete the stated job; optional import/export is already present.

`.factory/design.md` records the product-specific reasoning-workbench palette,
type, spacing, interaction, responsive, and motion systems. The live result
uses that identity and original generated imagery. Prompt, generation date,
deployment, source asset, responsive exports, and in-product disclosure are
present. The single light treatment is an explicit design decision.

The README covers purpose, audience, local run/test/build, deployment, data,
privacy, and license. MIT `LICENSE`, `/privacy`, `/terms`, `/visual-notes`,
route metadata, canonical tags, 1200×630 social image, sitemap, robots file,
manifest, icons, and designed 404 are present. The first-screen and README
claims are represented by the claims manifest; no release-blocking unlisted
claim was found.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the tested acceptance scope.

## Applicability

This is not a library, CLI, backend, paid product, AI runtime, or sign-in
product. Consumer package installation, CLI exercise, server concurrency and
persistence boundaries, API 429 allowance, billing, model calls, and Microsoft
Entra tenant verification do not apply.

## Evidence index

- `verification-evidence-8/live-qa.json` — independent live flow, request log,
  headers, route/axe matrix, 390px/200% measurements, reduced motion, and PWA
  state
- `verification-evidence-8/live-qa.mjs` — reproducible independent live probe
- `verification-evidence-8/lighthouse-mobile.json` — Lighthouse report
- `verification-evidence-8/live-first-read-desktop.png` — cold first screen
- `verification-evidence-8/live-demo-desktop.png` — seeded demo
- `verification-evidence-8/live-workbench-mobile-390.png` — mobile workbench
- `verification-evidence-8/live-workbench-mobile-200pct.png` — mobile reflow
- `verification-evidence-8/verify-url/` — standard live verifier output
