# Explanation Lab repair handoff — 2026-08-28

## Outcome

All release-blocking and supporting product-QA findings in verifier report commit `d33a51f32c7a12aa8c052dfba0e14dea40fd7d4f` for candidate `31c563cd783f065230944b979c9e419569c730b7` are repaired with exact regression coverage. The artifact remains a Vite + TypeScript local-first PWA, built to `dist/` for static deployment.

## Repairs

- **QA2-01, microphone lifecycle:** every render, History API navigation, back/forward route, demo exit, page hide, and hidden-tab transition now cancels the recorder and stops every stream track synchronously. A request token also stops a stream obtained after the learner already left. The regression captures the real track, navigates from the recording screen to Library, and asserts `readyState === "ended"` with no orphan Stop control.
- **QA2-02, poisoned dates:** imports now validate required and optional dates, IDs, topics, statuses, all four response shapes, response limits, and audio metadata/data before any write. Invalid input changes no records. Display code also handles a bad legacy date without throwing, so an existing poisoned row does not trap the library.
- **QA2-03, duplicate IDs:** duplicate IDs inside one backup are rejected. IDs matching saved work produce an explicit replace-or-skip prompt. Selected records are committed in one IndexedDB transaction, and the result reports imported, replaced, and skipped counts.
- **QA2-04, 200% text reflow:** headings can wrap long display words, mobile navigation uses a bounded grid, and prompt tabs adapt from four columns to fewer columns as text grows. At 390×844 and a 32 px root size, `/demo`, `/practice`, and `/privacy` each measure 0 px horizontal overflow.
- **QA2-05, claims contract:** every existing claim test now enters through `/demo`. Added declared, uniquely tagged tests for audio export/import, demo reset and exit isolation, manual/no-sync limits, no tracking or third-party scripts, and site-data clearing. Each of 14 claim commands passes from a fresh browser context.
- **QA2-06, target size:** wordmark, mobile navigation, and footer links now measure at least 44×44 CSS px. A mobile browser regression measures the repeated targets.
- **QA2-07, focus contrast:** the focus outline is carbon `#151515`, with contrast ratios 16.05:1 on paper, 13.20:1 on yellow, and 3.03:1 on cobalt. A light outer ring preserves visibility on the carbon footer.
- **QA2-08, real 404:** the production build includes `404.html`. Azure Static Web Apps explicitly rewrites only the five non-root product routes to the SPA, so unknown paths reach `responseOverrides.404` and keep a 404 response. The designed client route remains intact.
- **QA2-09, cache policy:** hashed JS/CSS now build under `/build/*` and receive one-year immutable caching. Stable `/assets/*` use `max-age=0, must-revalidate`. The service-worker cache is versioned as `explanation-lab-shell-v3` and caches both asset classes.
- **QA2-10, build identity:** every footer now exposes `v1.0 · build repair-4`.

## Exact local verification

Run:

```sh
npm ci
npm run typecheck
npm run lint
CI=1 npm test
CI=1 npm run test:a11y
npm audit --audit-level=high
npm run build
```

Results in the repair container:

- Clean install: 22 packages, 0 vulnerabilities.
- Typecheck: pass.
- Lint/static checks: pass with unused-local and unused-parameter checks enabled.
- Full Playwright matrix: 49 passed across desktop Chromium and 390×844 mobile; 3 expected desktop skips for mobile-only assertions.
- Dedicated axe matrix: 2 passed. Axe found no serious or critical violations on `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and the missing-page route in both projects.
- All 14 exact `.factory/claims.json` commands: pass; 27 browser executions total.
- Audit: 0 vulnerabilities.
- Build: pass; `dist/index.html` and `dist/404.html` produced.
- Output: JavaScript 32.26 KB raw / 11.22 KB gzip; CSS 18.46 KB raw / 4.66 KB gzip. Mobile hero remains 27.2 KB. No fonts are downloaded.
- Local URL smoke: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo /tmp/explanation-lab-repair4-local.Tsm5iP` returned HTTP 200 in 541 ms, title `Demo — Explanation Lab`, `lang=en`, one h1, a main landmark, zero missing alts, zero unlabeled buttons, and zero console errors.
- Manual browser captures at 1440×900, 390×844, and 390×844 with 200% text showed the final UI with zero console/page errors and zero horizontal overflow.
- Local Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 0 ms, total transfer 44 KiB. Report: `/tmp/explanation-lab-repair4-lighthouse.json`.

## Coverage notes

- Keyboard: first Tab reaches the skip link; Enter focuses `<main>`; route activation moves focus to the new h1 and updates the polite announcement.
- Privacy: the text-and-audio demo flow and tracking scan observe only same-origin requests. There are no analytics, external scripts/fonts, runtime AI calls, or embedded secrets.
- Offline/update: the seeded demo reloads after the browser goes offline; `UPDATE_READY` remains visible through route rendering and beyond the normal toast lifetime.
- Recovery: malformed/wrong-product files remain recoverable; invalid structured fields are rejected atomically; audio survives export, database deletion, and import.
- Package/consumer, backend/API rate-limit, authentication/authority, and billing checks are not applicable to this static account-free PWA.

## Deployment

- Source commits: `bcb07e6` (product repair) and `0646896836ad1408971fb48a53515808a084ceb6` (production 404 response-policy correction), both pushed to `origin/main`.
- Exact work-order build `npm ci && npm test && npm run build`: pass from final commit; 49 passed, 3 expected mobile-only skips; `dist/` produced.
- Static deploy: `/opt/fleet/lib/deploy-static.sh explanation-lab dist` succeeded in the existing Central US Static Web App. Final deployment ID: `b333ed95-2917-49c9-a416-b83c082d6c8e`.
- Custom domain: <https://explanation-lab.sociobot.in> returned HTTP 200 over managed TLS.
- Final live smoke: `/opt/fleet/lib/verify-url.sh https://explanation-lab.sociobot.in/demo /tmp/explanation-lab-repair4-final-live.zdMoiq` returned HTTP 200 in 589 ms, title `Demo — Explanation Lab`, `lang=en`, one h1, a main landmark, zero missing alts, zero unlabeled buttons, and zero console errors.
- Response policy: `/`, `/demo`, `/practice`, `/library`, `/privacy`, and `/terms` return 200. `/repair-4-missing-page` returns HTTP 404 with the designed boundary page and security headers.
- Cache policy: stable `/assets/hero-640.webp` returns `public, max-age=0, must-revalidate`; hashed `/build/main-BcWLVhzu.js` returns `public, max-age=31536000, immutable`; `/sw.js` returns `no-cache` and contains `explanation-lab-shell-v3`.
- Runtime identity: SHA-256 checks matched all 16 public files in `dist/` against the custom domain. `staticwebapp.config.json` is consumed by the host and verified through the observed status/header rules.
- Live browser: desktop and 390 px demo routes have the expected title/h1/build identity, zero overflow, zero console/page errors, zero cross-origin requests, and no serious/critical axe findings. At 200% text the 390 px demo still has 0 px overflow.
- Live defect checks: route navigation changed the captured microphone track to `ended`; the invalid-date backup stayed out of IndexedDB while the Library remained usable; and offline reload retained the seeded demo.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 0 ms, 44 KiB transfer, zero third parties. Report: `/tmp/explanation-lab-repair4-live-lighthouse.json`.

## Known gaps

- Audio encoding depends on the browser's `MediaRecorder` format. Export preserves the MIME type, but another browser may not support every imported codec.
- There is no transcription, device sync, or background reminder. These remain researched non-goals; text entry and the local revisit queue remain available.
- Browser or operating-system storage clearing removes local work. JSON export is the recovery path.

## Independent verifier outcome — 2026-08-28 UTC

**FAIL — do not release candidate `13edfeead324f3be3bfbc61590c1b42b7ab0484b` yet.** Fresh independent QA confirmed the live URL is byte-for-byte the candidate build and all 14 declared claim commands, full tests, axe tests, type/lint, build, offline reload, headers, privacy/network, desktop/mobile, and normal-route console checks pass. The remaining release blocker is the claims contract: `README.md` promises atomic import validation and an explicit duplicate-ID replace/skip decision, but `.factory/claims.json` has no matching claims and no tagged `@claim:` demo-sandbox test. See `.factory/verification-3.md` for exact evidence and remediation.

## Repair 5 — verifier QA3-01 — 2026-08-28 UTC

The two README import-safety promises are now part of the tested claims contract; product behavior and the PWA artifact were preserved.

- Added `atomic-import-validation`: its single tagged Playwright test enters at `/demo`, explicitly starts real work, imports a mixed valid/invalid-date backup, verifies neither record is written, reloads Library, and verifies the Library stays usable.
- Added `duplicate-import-decision`: its single tagged Playwright test enters at `/demo`, explicitly starts real work, imports a matching ID, then proves dismissing the decision preserves the saved item and accepting it replaces that item.
- The manifest contains 16 declarations and source validation confirmed exactly one `@claim:<id>` tag for each. Every exact manifest command passed: 31 browser executions (desktop and 390×844 mobile, with the mobile-only layout claim once). Evidence: `/tmp/explanation-lab-repair5-claims.log` in the repair container.

### Repair 5 verification

```sh
npm ci
npm audit --audit-level=high
CI=1 npm test
CI=1 npm run test:a11y
npm run typecheck
npm run lint
npm run build
```

- Clean install installed 22 packages; audit reported 0 vulnerabilities.
- Full Playwright matrix: 52 checks, including desktop, 390px mobile, keyboard skip-link/navigation, offline reload/update, privacy request capture, recovery, response-policy, and focus/reflow coverage; pass (three expected desktop skips for mobile-only assertions).
- Dedicated Playwright axe suite: 2 projects passed with no serious or critical findings across landing, demo, practice, library, privacy, terms, and designed 404 routes.
- Typecheck, lint, and production build passed. `dist/` contains `index.html` and `404.html`; emitted JS is 32.26 KB raw / 11.22 KB gzip and CSS is 18.46 KB raw / 4.66 KB gzip.
- Local production smoke at `/demo`: HTTP 200 in 525 ms; title `Demo — Explanation Lab`, `lang=en`, one h1, main landmark, no missing image alts or unlabeled buttons, and no console errors. Evidence directory: `/tmp/explanation-lab-repair5-url-smoke.*` in the repair container.

### Repair 5 deployment and live verification

- Source repair commit `d4c552ed25772515b39e3b737ef1155886ee111a` was pushed to `origin/main` and deployed with `/opt/fleet/lib/deploy-static.sh explanation-lab dist` to the existing Central US Static Web App. Deployment ID: `b7de7df3-0650-4799-a48a-1ab1564e6adc`.
- Fresh custom-domain smoke: `https://explanation-lab.sociobot.in/demo` returned HTTP 200 in 677 ms, with the Demo title, `lang=en`, one h1, a main landmark, no missing alts or unlabeled buttons, and no browser console/page errors. Evidence: `/tmp/explanation-lab-repair5-live.*` in the repair container.
- Live desktop (1440×900) and mobile (390×844) demo checks each had 0 px horizontal overflow, no console/page errors, and first Tab focused “Skip to main content.”
- SHA-256 identity check matched all 16 served public runtime files against `dist/`. Hashed JS/CSS are immutable for one year, the stable hero asset is `max-age=0, must-revalidate`, and `sw.js` is `no-cache`.
- `/missing-repair5-page` returns HTTP 404 with the designed 404 document, self-only CSP, `nosniff`, strict-origin referrer policy, microphone-only permissions policy, and same-origin COOP.
