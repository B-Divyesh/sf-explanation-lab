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

Deployment and live custom-domain evidence will be appended after the committed build is uploaded with the work order's static deployment command.

## Known gaps

- Audio encoding depends on the browser's `MediaRecorder` format. Export preserves the MIME type, but another browser may not support every imported codec.
- There is no transcription, device sync, or background reminder. These remain researched non-goals; text entry and the local revisit queue remain available.
- Browser or operating-system storage clearing removes local work. JSON export is the recovery path.
