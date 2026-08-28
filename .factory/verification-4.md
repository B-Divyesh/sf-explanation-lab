# Independent product verification 4 — PASS

- Date: 2026-08-28 UTC
- Work order: `explanation-lab-verify-4`
- Candidate and checked-out commit: `19d7edaacadabe98472eccf0ab617f087b90e069`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**PASS — release candidate accepted.** Fresh local and live evidence show this is a functioning, privacy-preserving offline practice tool. The live deployment matches every served runtime file from the candidate build byte-for-byte. No release-blocking defects were found.

## Mandatory first-read and demo gate

Cold desktop load returned HTTP 200 with no console or page errors. The first screen plainly says:

- **What it does:** “Explain hard ideas in your own words.”
- **For whom:** “For STEM and programming learners who want to find gaps before those gaps find them.”
- **What to click first:** “Try it with sample data,” with the outcome “Opens a due explanation and two recent examples.”

One click opened `/demo`, populated three realistic explanations, and showed the persistent “Demo — sample data, nothing is saved to your work” banner with **Reset demo** and **Start for real**. This passes the plain-words and one-click isolated-demo requirements.

## Claims gate

`.factory/claims.json` exists with 16 entries. Source inspection confirmed each declared ID has exactly one `@claim:<id>` test. From this clean checkout, every exact command declared in the manifest passed; non-mobile claims ran in both desktop and 390px projects, and `mobile-ready` ran once in its required mobile project.

Passing IDs: `one-click-demo`, `demo-isolation`, `demo-reset-exit`, `four-part-revisit`, `json-export`, `json-import`, `atomic-import-validation`, `duplicate-import-decision`, `audio-backup`, `local-private`, `manual-no-sync`, `no-tracking`, `free-no-account`, `offline-reload`, `mobile-ready`, and `site-data-clear`.

This includes the previously missing data-safety coverage: invalid structured imports make no write, and a matching ID asks for an explicit skip-or-replace decision. README, landing, privacy, and demo claims were cross-checked against this manifest; no unlisted material visitor claim was found.

## Clean-checkout quality gates

| Check | Fresh result |
| --- | --- |
| Identity | `git rev-parse HEAD` exactly matched the requested SHA |
| Install | `npm ci`: 22 packages, 0 audit vulnerabilities |
| Full suite | `CI=1 npm test`: **49 passed**, 3 expected desktop skips |
| Exact claims commands | All 16 manifest commands passed |
| Accessibility suite | `CI=1 npm run test:a11y`: 2 passed |
| Type check and lint | `npm run typecheck` and `npm run lint`: passed |
| Production build | `npm run build`: passed and produced `dist/` |

The production bundle is within static-PWA budgets: JS 32,258 bytes raw / 11,205 gzip; CSS 18,462 bytes raw / 4,679 gzip; mobile hero 27,210 bytes. No web fonts are downloaded. A fresh Lighthouse CLI attempt could not complete because its Chromium tab crashed after artifact collection in this container; it is not treated as product evidence or a product failure. The bundle checks, live browser checks, and axe runs above completed successfully.

## Functional, accessibility, privacy, and PWA evidence

- Fresh live exercise completed a four-part demo explanation (mechanism, boundary, example, counterexample), returned to the demo overview, and showed 4/4 answers with a seven-day revisit date. Local regression coverage also verified empty/error recovery, invalid imports, duplicate decisions, text-only use, JSON/audio backup round trip, microphone cleanup, deletion confirmation, and persistence boundaries.
- Live `/demo` loaded offline after first visit with its seeded siren explanation present. The live page was controlled by `/sw.js`, using cache `explanation-lab-shell-v3`; `/sw.js` is `no-cache`. After a controller reload, an `UPDATE_READY` message produced “An update is ready. Reload to use it.” and that notice survived route navigation for more than four seconds.
- Playwright axe found zero serious or critical violations on live `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and the designed missing-page route. The local two-project axe suite also passed. Keyboard-only smoke: first Tab focused the skip link, and Enter focused `<main>`. At 390×844, landing, demo, practice, and privacy each had 0px horizontal overflow; at 200% text the demo still had 0px overflow. Reduced motion produced `animation-name: none`, near-zero transition duration, and `scroll-behavior: auto`.
- The live normal demo/text workflow emitted only same-origin requests (`/`, bundled JS/CSS, and local hero asset); no cross-origin request, analytics, advertising, third-party script, font, model endpoint, or page error was observed. The source has no runtime AI feature, correctly matching the brief’s non-goal of generated or graded explanations.
- `/opt/fleet/lib/verify-url.sh https://explanation-lab.sociobot.in/demo …` returned 200 in 701ms with `Demo — Explanation Lab`, `lang=en`, one h1, a main landmark, zero missing image alts, zero unlabeled buttons, and no browser errors.

## Deployment, headers, and caching

SHA-256 comparisons matched all 16 public runtime files from `dist/` to the custom domain: HTML, JS, CSS, images/icons, manifest, offline page, service worker, favicon, robots, and sitemap. The live deployment therefore is the requested candidate.

- `/`, `/demo`, and `/privacy` return 200; an unknown path returns the designed page with HTTP 404.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS uses `public, max-age=31536000, immutable`; stable assets use `public, max-age=0, must-revalidate`; the service worker uses `no-cache`.
- Responses carry self-only CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, same-origin COOP, and a microphone-only permissions policy.
- All discoverable landing links returned 200, including the declared external Param Factory link. Manifest data is valid: standalone display, versioned start URL, 192/512 icons with maskable 512 icon, and matching theme/background colors.

This account-free static PWA has no backend/API endpoint, product-unlock endpoint, billing, sign-in, server persistence, library package, or CLI. Rate-limit, concurrency, Entra authority, and consumer-package checks are therefore not applicable.

## Defects

None found. Earlier verifier findings are superseded by this candidate’s passing regression coverage and fresh live checks.
