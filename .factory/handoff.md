# Explanation Lab handoff — polish 3

## Outcome

**PASS.** All findings from `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, and `polish-2.md` are fixed or regression-verified. The final repair is `e29436f59dd49808f93a667b8389e2c564ec8c1f` and is deployed as Azure Static Web Apps deployment `6428c61a-3bfc-44a7-9bf8-4c28d2c17732`.

The final changes keep Privacy visible and operable in the 390px header, replace the misleading “Draw the boundary” instruction everywhere with “State where the idea applies,” add regressions for both, advance the footer build identity to `polish-3`, and refresh the verb-first catalog description.

## Verification

- Clean clone: `/tmp/explanation-lab-polish3.91kGPC`, commit `e29436f59dd49808f93a667b8389e2c564ec8c1f`; `npm ci` installed 22 packages with 0 vulnerabilities.
- Every literal `.factory/claims.json` command passed from that clone: 18 declared claims, each with exactly one `@claim:` test tag.
- `CI=1 npm test`: 57 passed, 3 intentional desktop skips.
- `CI=1 npm run test:a11y`: 2 passed.
- `npm run typecheck`, `npm run lint`, `npm audit --audit-level=high`, and `npm run build`: passed.
- Build output: `dist/` exists with `index.html` at its root. JS is 34,042 bytes raw / 11,630 bytes gzip; CSS is 18,537 bytes raw / 4,666 bytes gzip.
- Live cold verifier passed at <https://explanation-lab.sociobot.in/?demo=1>. Its report is [verify.json](verification-artifacts/polish-3/verify-demo/verify.json).
- Live browser QA passed the mobile header, one-click demo, reset/exit, isolated `demo:explanation-lab` namespace, copy rewrite, 200% reflow, route titles and landmarks, 404, same-origin-only requests, offline reload, and serious/critical axe scan. Evidence: [live QA](verification-artifacts/polish-3/live-qa.json).
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.0s, CLS 0, TBT 0ms. Evidence: [Lighthouse report](verification-artifacts/polish-3/lighthouse-live-mobile.json).

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
