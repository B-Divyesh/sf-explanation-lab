# Independent product verification 9 — PASS

- Date: 2026-08-29 UTC
- Work order: `explanation-lab-verify-9`
- Candidate and checked-out commit: `309480d8d8bbcf6b1df7acca3d1a1fa794b5d4fc`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**PASS — release candidate `309480d8d8bbcf6b1df7acca3d1a1fa794b5d4fc` meets the supplied acceptance contract.** No product code was modified during this verification. The deployed runtime is identical to the candidate build, every declared claim command passes, and independent live checks found no critical, high, medium, or low release defect.

## Mandatory first-read and demo gate — PASS

A cold browser visit to `/` returned HTTP 200 without console or page errors. The first screen answers all required questions in plain words:

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps in their understanding.”
- What to click first: “Try it with sample data,” with “Opens a due explanation and two recent examples.” beside it.

The visible one-click action opens `/?demo=1`. It shows the persistent “Demo — sample data, nothing is saved to your work” banner, Reset demo, Start for real, and the three documented realistic samples.

## Claims gate — PASS

`.factory/claims.json` is present with 18 entries. After clean `npm ci`, every literal `test` command in that manifest was run independently, via the configured local demo entry point. All passed: 35 browser executions in total (desktop and mobile where configured).

| Claims that passed |
| --- |
| `one-click-demo`, `demo-isolation`, `demo-reset-exit`, `four-part-revisit`, `four-prompt-practice`, `json-export` |
| `json-import`, `atomic-import-validation`, `duplicate-import-decision`, `audio-backup`, `local-private`, `manual-no-sync` |
| `no-tracking`, `free-no-account`, `offline-reload`, `mobile-ready`, `site-data-clear`, `individual-delete` |

Each manifest ID has exactly one matching `@claim:<id>` test source. Landing-page and README privacy/offline/demo statements correspond to the declared claims; no unlisted claim finding was found.

## Clean-checkout quality gates — PASS

```text
npm ci                              # 22 packages; 0 audit vulnerabilities
CI=1 npm test                       # 57 passed; 3 expected desktop skips
npm run test:a11y                   # 2 passed
npm run typecheck                   # passed
npm run lint                        # passed
npm audit --audit-level=high        # 0 vulnerabilities
npm run build                       # passed; dist/ produced
```

The exact production output is 34,042 bytes JavaScript (11.65 KB gzip) and 18,537 bytes CSS (4.66 KB gzip). No production dependency, third-party script, or web font is shipped. The 640px mobile hero is 27,210 bytes. These are within the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent live product QA — PASS

- A new topic with an empty required field is blocked, focuses the field, and gives the native recovery message “Please fill out this field.”
- A normal text-only explanation can be opened and saved; saved feedback appears. This preserves the required text-only path.
- The broader clean suite also covers four-prompt completion, exact seven-day revisit scheduling, invalid and duplicate backup recovery, JSON/audio round trips, per-record deletion, reset/exit isolation, microphone navigation, and persistence.
- At 390×844, the demo has no horizontal overflow (`390px` scroll width/client width); the visible Reset demo control is 44px tall. Desktop and mobile page errors were zero.
- Keyboard testing: the first Tab reaches “Skip to main content” with a solid 4px focus outline; Enter moves focus to `main`.
- Reduced-motion emulation changes `scroll-behavior` to `auto` and leaves zero active CSS animations.
- Playwright axe found zero serious or critical violations. `/opt/fleet/lib/verify-url.sh` independently reported title, `lang=en`, one h1, main landmark, zero missing image alternatives, zero unlabeled buttons, and zero console errors.

## Privacy, security, PWA, and deployment — PASS

The complete live demo flow request capture made requests only to `https://explanation-lab.sociobot.in`; no explanation/audio upload, analytics, advertising, third-party script, API, runtime AI, or authentication request occurred. This static product has no server-side product endpoints, billing/unlock API, sign-in, or backend, so rate-limit/429, concurrency, persistence-boundary, health endpoint, and Entra checks are not applicable.

The deployed service worker controls the page at `/sw.js`. An explicit registration `update()` check completed with no waiting worker; a fresh browser profile then reloaded the seeded demo offline successfully. The manifest declares standalone display, a versioned start URL, matching colors, and real 192px/512px (maskable) icons.

Live responses have CSP including `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, microphone-only permissions policy, and same-origin COOP. HTML revalidates in 30 seconds; hashed JS/CSS are immutable for one year; `/sw.js` is `no-cache`. Public routes `/`, `/?demo=1`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` return 200. An unknown route returns a designed HTTP 404. All same-origin landing links return 200.

All 16 public runtime files in `dist/` (HTML, JS, CSS, worker, manifest, images, icons, sitemap, robots, and favicon) were downloaded with content decoding and matched the candidate build by SHA-256. The host-only `staticwebapp.config.json` is not a runtime asset.

Fresh live Lighthouse (desktop) reported Performance 100, Accessibility 100, Best Practices 100, and SEO 100; FCP 0.4s, LCP 0.4s, CLS 0, TBT 0ms, and 77 KiB total transfer. The initial direct Lighthouse launch could not start Chromium under the launcher, so Chromium was started with remote debugging and Lighthouse attached to it; the completed audit is the recorded result.

## Product and documentation fit — PASS

The product implements the researched smallest useful product: constrained mechanism/boundary/example/counterexample prompt cards, dated local text/audio notes, a seven-day revisit queue, and a reusable isolated demo. It intentionally does not add AI grading, generated explanations, plagiarism checks, accounts, sync, or a knowledge base. Backup import/export is present. `.factory/design.md`, `.factory/demo.md`, README, MIT license, `/privacy`, `/terms`, PWA metadata, and original-asset provenance are present and consistent with the product.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

