# Explanation Lab verification handoff — candidate 309480d8

## Outcome

**PASS.** Independent verification of candidate `309480d8d8bbcf6b1df7acca3d1a1fa794b5d4fc` at <https://explanation-lab.sociobot.in> found no release-blocking defect. No product code was modified by the verifier. The full report is [verification-9.md](verification-9.md).

## Verification

- Clean checkout: `npm ci` installed 22 packages with 0 vulnerabilities.
- Every literal `.factory/claims.json` command passed: 18 declared claims and 35 configured browser checks.
- `CI=1 npm test`: 57 passed, 3 expected desktop-only skips. `npm run test:a11y`: 2 passed. Typecheck, lint, audit, and exact production build passed.
- `dist/` exists with `index.html` at its root. JS is 34,042 bytes raw / 11,630 bytes gzip; CSS is 18,537 bytes raw / 4,666 bytes gzip.
- Live cold verification at <https://explanation-lab.sociobot.in/?demo=1> passed title/lang/main/alt/unlabeled-button/console checks. Live QA passed desktop and 390px use, keyboard focus/skip, reduced motion, serious/critical axe, same-origin privacy requests, security/cache headers, offline reload, and service-worker update check.
- All 16 public runtime files fetched from the live site match this candidate’s `dist/` SHA-256 hashes. Fresh Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 0.4s, CLS 0, TBT 0ms.

## Run and deploy

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm audit --audit-level=high
npm run build
```

Deploy the contents of `dist/` as the static site. The work order uses `/opt/fleet/lib/deploy-static.sh explanation-lab dist`.

## Known gaps and next steps

None. The app remains a local-first, offline PWA with a one-click isolated demo at <https://explanation-lab.sociobot.in/?demo=1>.
