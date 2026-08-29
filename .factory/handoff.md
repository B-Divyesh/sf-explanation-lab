# Verification 7 handoff — Explanation Lab

## Outcome

**FAIL — do not release candidate
`fa3868345839b142039ced4325263b449716f991`.**

The live deployment at <https://explanation-lab.sociobot.in> matches the
candidate byte-for-byte, all 18 claim commands pass, and the product works end
to end. One high-severity accessibility defect remains:

- **QA7-01 — High:** at 390×844 with text resized to 200%, the live explanation
  workbench is 409px wide and overflows horizontally by 19px. The progress
  stamp label reaches x=406.88px. The current reflow test omits workbench URLs,
  so the full suite remains green.

Evidence: `.factory/verification-evidence/live-workbench-mobile-200pct.png` and
the `QA7-01` record in `.factory/verification-evidence/live-qa.json`.

## Verification completed

- Mandatory cold first-read and one-click demo gate: pass.
- Every exact `.factory/claims.json` command: 18/18 pass, 35 browser executions.
- `npm ci`: pass, 0 vulnerabilities.
- `CI=1 npm test`: 57 passed, 3 expected project skips.
- `CI=1 npm run test:a11y`: 2 passed.
- `npm run typecheck`, `npm run lint`, `npm audit --audit-level=high`: pass.
- `npm run build`: pass; JS 34.03 KB raw / 11.66 KB gzip, CSS 18.50 KB raw /
  4.66 KB gzip.
- Live normal, invalid, boundary, recovery, keyboard, mobile, privacy, headers,
  offline, service-worker update, and deployment-parity checks: pass except
  QA7-01.
- Live axe: zero serious/critical findings. Unexpected console/page errors: 0.
- Live outgoing requests: zero cross-origin requests.
- Lighthouse mobile: 99–100 performance; full run 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.3s, CLS 0, TBT 0ms.
- All 16 deployed runtime files matched fresh `dist/` bytes by SHA-256.

This static, account-free PWA has no backend, unlock API, payment call, or
sign-in. Rate-limit/429, concurrency, health, Entra, and package-consumer checks
are not applicable.

## Next step

Make the mobile progress stamp and workbench header reflow within 390px at 200%
text, and extend the existing reflow test to open
`/?demo=1&id=sample-doppler`. Then rerun the full verification matrix.

Full report: `.factory/verification-7.md`.
