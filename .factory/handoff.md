# Explanation Lab polish 1 handoff — 2026-08-29

## Outcome

Perfection-loop round 1 is complete. Every finding in `.factory/review-1.md`, including its historical regression list, is fixed or reverified. The product remains a Vite + TypeScript local-first offline PWA deployed as static files.

- Live product: <https://explanation-lab.sociobot.in>
- Canonical demo: <https://explanation-lab.sociobot.in/?demo=1>
- Repair commit: `ed1b173`
- Deployment ID: `fa6551f5-cf0c-4277-8200-a0188af92939`

## What changed

- Added the declared `four-prompt-practice` claim and its unique observable Playwright test.
- Rewrote the first-screen audience sentence and every flagged metaphorical heading in direct language.
- Made `/?demo=1` the canonical one-click isolated sample path while preserving `/demo` compatibility.
- Added a linked `/visual-notes` provenance page and complete route title, metadata, focus, sitemap, and host configuration.
- Kept the designed 404 as a real HTTP 404 and rewrote its recovery copy in plain words.
- Updated the footer build identity, service-worker cache version, manifest start version, catalog description, copy audit, README, demo documentation, and claims manifest.
- Preserved the product-specific graph-paper reasoning-workbench identity and original illustration.

## Exact verification

From a clean clone of repair commit `ed1b173` at `/tmp/explanation-lab-clean.B4P8af`:

```sh
npm ci
# Then every exact `test` command in .factory/claims.json
npm run typecheck
npm run lint
CI=1 npm test
CI=1 npm run test:a11y
npm audit --audit-level=high
npm run build
```

Results:

- Claims: all 17 commands passed; 33 browser executions.
- Full browser matrix: 53 passed; 3 intended desktop skips for mobile-only checks.
- Accessibility: 2/2 route-matrix runs passed with no serious or critical axe findings.
- Typecheck and unused-code lint: passed.
- Dependency audit: 0 vulnerabilities.
- Build: passed; `dist/index.html` and `dist/404.html` produced.
- Bundle: JS 33.86 KB raw / 11.61 KB gzip; CSS 18.46 KB raw / 4.66 KB gzip; hero 27.21 KB.
- Local Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 0 ms.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.0 s, CLS 0, TBT 20 ms.

## Live cold verification

- `/`, `/?demo=1`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` return 200 with correct titles, one h1, correct metadata, and zero 390 px overflow.
- `/polish-1-final-missing` returns HTTP 404 with the designed “We could not find this page” recovery screen.
- The landing action reaches `/?demo=1` in one click. The banner, three samples, Reset demo, and Start for real work from a fresh context.
- Reset removes the temporary demo record and restores samples. Start for real clears the demo and opens a banner-free real workspace.
- Offline reload retains the seeded demo after the service worker controls the page.
- Normal routes produced zero console errors, zero cross-origin requests, and zero serious/critical axe findings.
- The deployed JS SHA-256 equals the local production artifact. Cache and security headers match the static host policy.

Evidence and finding-by-finding mapping are in `.factory/polish-1.md`. Screenshots and Lighthouse JSON are under `.factory/verification-artifacts/polish-1/`.

## Remaining work

None against the brief, review, or attached acceptance requirements.
