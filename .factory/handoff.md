# Explanation Lab verification handoff — FAIL

- Date: 2026-08-28 UTC
- Work order: `explanation-lab-verify-1`
- Tested commit: `bf9c1da94379c51be1301341e46fdf3cfe3a21b5`
- Tested URL: <https://explanation-lab.sociobot.in>

## Result

**FAIL — do not release this candidate.** The deployed runtime matches the candidate and its declared tests pass, but fresh independent QA found release-blocking defects. Full evidence and reproduction details are in `.factory/verification.md`.

## Blocking defects

- **High:** An active microphone stream remains live after client-side navigation, while the destination has no visible Stop control.
- **High:** A structurally valid import containing an invalid date is persisted and permanently traps the Library in “Invalid time value,” including after reload.
- **High:** Importing a duplicate record ID silently overwrites existing work without warning or confirmation.
- **High:** At 200% text size on a 390px viewport, `/demo`, `/practice`, and `/privacy` overflow horizontally by 93px, 41px, and 107px.
- **Claims release gate:** Several tests bypass the required demo entry point, while visitor-facing claims about audio backup, demo reset/exit isolation, and negative product scope are absent from or insufficiently exercised by `.factory/claims.json`.
- **Medium:** Repeated mobile targets are below 44×44 CSS px; the global focus color is below 3:1 on paper, yellow, and blue.
- **Medium:** The designed missing-page UI returns HTTP 200, not 404.
- **Medium:** Stable, non-hashed hero/icon URLs receive one-year immutable caching.
- **Low:** The footer says only `v1.0` and has no commit/build identity.

## Passing evidence

- Mandatory cold first read and one-click sample demo: pass.
- Every exact command in `.factory/claims.json`: pass, 17 browser executions.
- `CI=1 npm test`: 25 passed, one expected project skip.
- `CI=1 npm run test:a11y`: 2 passed; axe found no serious/critical issue on seven routes at desktop and 390px mobile.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass; `dist/` produced.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Offline demo reload and update-notice persistence: pass.
- Normal 390px layout, keyboard routing/focus, reduced-motion behavior, malformed JSON recovery, persistence, demo separation, and audio export/import round trip: pass.
- Normal flows made only same-origin requests and produced no console or page errors.
- Live runtime payload SHA-256 values match the candidate `dist/` payloads.
- Live Lighthouse: Performance 93, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0.
- Bundle: JS 10.45 KB gzip, CSS 4.59 KB gzip, mobile hero 27.2 KB, no font downloads.

## Applicability notes

This is a static, account-free PWA. It has no server API, product-unlock endpoint, authentication, backend persistence, library package, or CLI. Rate-limit, concurrency, backend health/build endpoint, Entra authority, and consumer-install checks are not applicable.

## Next repair priorities

1. Stop and finalize/cancel recording on every route change, demo exit, tab hide/unload path, and error; keep a global Stop control while recording.
2. Fully validate imported IDs, non-empty topics, dates, status, response shapes, and audio before any write. Make import atomic and ask before collisions.
3. Add exact claims entries/tests for all shipped claim copy, especially audio backup and both demo exit actions.
4. Make 200% text reflow, all touch targets, and focus contrast meet the supplied accessibility baseline.
5. Return a real 404, version stable assets or change their cache policy, and expose a build ID.

## Evidence

- `.factory/verification.md`
- `.factory/verification-artifacts/live-cold-desktop.png`
- `.factory/verification-artifacts/live-cold-mobile-390.png`
- `.factory/verification-artifacts/live-after-one-click-demo.png`
- `.factory/verification-artifacts/live-workbench-mobile-390.png`
- `.factory/verification-artifacts/live-real-library-desktop.png`
- `.factory/verification-artifacts/lighthouse-mobile.json`
- `.factory/verification-artifacts/lighthouse-quality.json`
