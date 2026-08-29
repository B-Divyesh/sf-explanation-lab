# Explanation Lab polish 4 handoff

## Outcome

**PASS.** The repair of reviewed candidate `4c2bc69b1b98aed5415dcc23b8cc747552473d92` is implemented in `15e28ce28b6bf760a447f6f5a1d02b79f97860ac` and deployed to <https://explanation-lab.sociobot.in> as Azure Static Web Apps deployment `65c32f8f-e92d-436d-8bde-06c4cd47bf11`.

The landing now opens the populated passing-siren sample in one click. Demo mode persists across every product route until the visitor uses **Start for real**; reset and every real exit discard only the demo database. Privacy copy, README, demo documentation, claims, tests, titles, social metadata, manifest wording, and footer identity match the shipped behavior.

## How to run and verify

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run build
```

Use `/?demo=1&id=sample-doppler` for the direct isolated sample. The banner supplies **Reset demo** and **Start for real**. `/privacy`, `/terms`, and `/visual-notes` are real routes; unknown addresses return the designed HTTP 404 response.

## Exact evidence

- Fresh clone `/tmp/explanation-lab-polish4.X4RaPM` at `15e28ce28b6bf760a447f6f5a1d02b79f97860ac`: `npm ci` passed with 0 vulnerabilities.
- All 18 literal `.factory/claims.json` commands passed (35 browser executions). Every claim has exactly one matching test tag (`CLAIM_TAG_COUNTS_OK 18`).
- `CI=1 npm test`: 57 passed, 3 expected desktop-only skips. `CI=1 npm run test:a11y`: 2 passed. `npm run typecheck`, `npm run lint`, `npm audit --audit-level=high`, and `npm run build` all passed.
- Build output is `dist/` with `index.html`; emitted JavaScript is 35.15 KB raw / 11.94 KB gzip and CSS is 19.06 KB raw / 4.76 KB gzip.
- Cold live checks are in [live-qa.json](repair-evidence/polish-4/live-qa.json): populated one-click demo, all demo route boundaries, metadata, focusable route headings, HTTP 404, same-origin requests, zero valid-route console errors, zero serious/critical axe findings, 390px first viewport, and offline reload all passed.
- Live sample screenshots: [desktop](repair-evidence/polish-4/live-demo-desktop.png) and [390px mobile](repair-evidence/polish-4/live-demo-mobile-390.png). The semantic/browser verifier output is [verify.json](repair-evidence/polish-4/verify-url/verify.json).
- Live Lighthouse report: [lighthouse-live-mobile.json](repair-evidence/polish-4/lighthouse-live-mobile.json), scoring 99 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO.

## Known gaps and next steps

None. The product remains a local-first, offline PWA with no account, tracking, paid service, or runtime AI dependency.
