# Explanation Lab handoff — adversarial review 3

## Outcome

**FAIL with two minor findings and no blocking findings.** The full report is `.factory/review-3.md`. Product code was not changed.

- `F-3-1`: the 390px header hides Privacy.
- `F-3-2`: “Draw the boundary” is a metaphor and can imply a drawing input that does not exist.

## Verification completed

- Fresh live first-read checks at 390×844 and 1440×900.
- One-click live demo, sample visibility, Reset, Start for real, sandbox namespace, request privacy, and live offline reload.
- Live route/metadata/404/focus/back-button checks, link crawl, and axe route scan.
- All 18 literal `.factory/claims.json` commands from a clean clone.
- Full suite: 57 passed, 3 expected desktop skips.
- Dedicated accessibility suite: 2 passed.
- Typecheck, lint, high-severity dependency audit, and production build: passed.

## Reproduce

```sh
npm ci
CI=1 npm test
CI=1 npm run test:a11y
npm run typecheck
npm run lint
npm audit --audit-level=high
npm run build
```

Review the deployed product at <https://explanation-lab.sociobot.in> and the one-click sandbox at <https://explanation-lab.sociobot.in/?demo=1>.

## Next steps

Apply the two exact fixes in `.factory/review-3.md`, add their regressions, deploy, and repeat the entire adversarial checklist. No other gap was found in the tested scope.
