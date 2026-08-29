# Explanation Lab independent verification 5 handoff — FAIL

## Outcome

Candidate `10c0d6cf2c8f1cc4fa65a9eb3f83f19d67eedd2d` was independently tested against <https://explanation-lab.sociobot.in> on 2026-08-29 UTC.

**FAIL — do not release.** The live deployment matches the candidate runtime and the core PWA works, but the candidate violates the required claims contract and 44px touch-target baseline. A malformed import also exposes an unhelpful parser error.

No product code was changed. Full evidence and reproduction details are in `.factory/verification-5.md` and `.factory/verification-5-evidence/`.

## Release-blocking findings

1. **QA5-01 — High:** `/privacy` promises that users can delete individual explanations, but `.factory/claims.json` has no deletion claim and `tests/app.spec.ts` has no uniquely tagged deletion claim test. Manual live cancel/confirm behavior passes, but the supplied acceptance contract explicitly fails unlisted visitor claims.
2. **QA5-02 — Medium:** at 390×844, the visible “← Sample overview” workbench link measures 163.77×24.80 CSS pixels, below the required 44px touch-target height.

Additional finding:

3. **QA5-03 — Medium:** malformed JSON displays Chromium’s raw `Expected property name or '}'...` parser error and gives no recovery instruction. Selecting a later valid file works.

## What passed

- Mandatory cold first-read and one-click isolated demo gate.
- All 17 exact `.factory/claims.json` commands after `npm ci`: 33 browser executions passed. Every claim ID has exactly one matching tag.
- `CI=1 npm test`: 53 passed, 3 intended desktop skips.
- `CI=1 npm run test:a11y`: 2 passed.
- Typecheck, unused-code lint, dependency audit, and exact production build.
- Full live four-prompt completion and seven-day revisit, demo reset, empty state, validation boundaries, JSON export/import, invalid-import atomicity, duplicate decisions, delete confirmation, microphone cleanup and denial fallback.
- Live route/404 matrix, keyboard focus, 200% reflow, reduced motion, and axe scans with zero serious/critical findings.
- PWA control, `explanation-lab-shell-v4`, offline demo reload, and persistent update notice.
- Privacy request capture: same-origin only; zero normal-route console/page errors.
- All 16 served runtime files matched fresh `dist/` by SHA-256.
- Live Lighthouse: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.3 s, TBT 180 ms, CLS 0.

## Commands used

```sh
npm ci
# Then every exact test command in .factory/claims.json
npm run typecheck
npm run lint
CI=1 npm test
CI=1 npm run test:a11y
npm audit --audit-level=high
npm run build
/opt/fleet/lib/verify-url.sh 'https://explanation-lab.sociobot.in/?demo=1' .factory/verification-5-evidence/verify-url
node .factory/verification-5-evidence/live-qa.mjs
```

## Next steps

1. Declare and uniquely test the deletion claim, or remove that promise.
2. Increase the mobile workbench back-link hit area to at least 44px and extend the touch-target test.
3. Replace raw JSON parser output with a plain-language, actionable error and test recovery.
4. Rerun the exact claim manifest, full suite, production build, live mobile matrix, and deployment parity check.
