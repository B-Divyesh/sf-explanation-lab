# Explanation Lab verification handoff — FAIL

- Date: 2026-08-28 UTC
- Work order: `explanation-lab-verify-2`
- Tested commit: `31c563cd783f065230944b979c9e419569c730b7`
- Tested URL: <https://explanation-lab.sociobot.in>

## Result

**FAIL — do not release this candidate.** The live runtime matches the candidate byte for byte, so this is not a deployment-only failure. Fresh independent QA reproduced release-blocking privacy, import/data-loss, reflow, and claims-contract defects. Full evidence is in `.factory/verification-2.md`.

## Blocking defects

- **High:** An active microphone stream remains live after client-side navigation while the destination provides no Stop control.
- **High:** A structurally valid backup with an invalid date is persisted and permanently traps the Library in “Invalid time value,” including after reload.
- **High:** Importing a duplicate record ID silently overwrites existing work with no warning or confirmation.
- **High:** At 200% text size on a 390px viewport, `/demo`, `/practice`, and `/privacy` overflow horizontally by 93px, 41px, and 107px.
- **Claims gate:** Four claim tests bypass the required demo entry point, while audio export, demo controls, negative product-scope, and several privacy statements are unlisted or under-tested.
- **Medium:** Repeated mobile targets are below 44×44 CSS px, and focus outline contrast is below 3:1 on common surfaces.
- **Medium:** Unknown routes return HTTP 200; stable image/icon URLs receive one-year immutable caching.
- **Low:** The footer lacks a commit/build identity.

## Passing evidence

- Mandatory cold first read and one-click seeded demo: pass.
- After `npm ci`, every exact claims command passed: 17 browser executions.
- `CI=1 npm test`: 25 passed, one intentional desktop skip.
- `CI=1 npm run test:a11y`: 2 passed; fresh live axe checks also found no serious/critical issue on seven routes at desktop and 390px.
- Type check, exact production build, dependency audit, and required URL smoke test: pass.
- Normal four-part completion, input recovery and limits, persistence, delete recovery, demo reset/exit isolation, microphone-denial fallback, and audio export/import round trip: pass.
- Offline demo reload, active service worker, cache population, reduced motion, keyboard skip/routing, route metadata, link crawl, and normal 390px layout: pass.
- Normal flows made only same-origin requests and produced no console/page errors.
- All 15 deployed runtime files match candidate `dist/` bytes.
- Fresh Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.36 s, CLS 0, TBT 58.5 ms.
- Bundle: JS 10.45 KB gzip, CSS 4.60 KB gzip, mobile hero 27.2 KB, no fonts.

## Applicability

This is a static, account-free PWA. It has no API, product-unlock call, authentication, backend persistence, package, or CLI. Rate-limit, backend concurrency/health, Entra authority, and consumer-install checks are not applicable.

## Evidence

- `.factory/verification-2.md`
- `.factory/verification-artifacts/verify2-live-cold-desktop.png`
- `.factory/verification-artifacts/verify2-live-cold-mobile-390.png`
- `.factory/verification-artifacts/verify2-live-demo-one-click.png`
- `.factory/verification-artifacts/verify2-live-offline-mobile.png`
- `.factory/verification-artifacts/verify2-mobile-text-200.png`
- `.factory/verification-artifacts/verify2-invalid-date.png`
- `.factory/verification-artifacts/lighthouse-verify2.json`

## Next repair priorities

1. Stop and clear recorder tracks on every route/demo/page lifecycle transition, or keep a persistent global Stop control.
2. Fully validate imported IDs, topics, dates, status, responses, and audio before an atomic write; require a replace/skip decision for collisions.
3. Move all claim tests through `/demo` and add exact entries/tests for every shipped claim.
4. Fix 200% reflow, target sizes, and focus contrast.
5. Return a real 404, version stable assets or change their cache policy, and expose a build ID.
