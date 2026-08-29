# Explanation Lab repair handoff — QA5 remediation

## Outcome

Repaired every release-blocking finding from independent verification 5
(`ad33c45d5d1bd1285001b499d8dc22b09914158e`) without changing the researched
scope, local-first storage model, PWA artifact class, or previously passing
learning workflow.

## Repairs

1. **QA5-01 — individual deletion claim:** Added the `individual-delete`
   claim to `.factory/claims.json` and one uniquely tagged
   `@claim:individual-delete` Playwright test. From the isolated `/?demo=1`
   workspace it proves cancellation keeps the named siren sample, confirmation
   removes only the named binary-search sample, and the other sample remains.
2. **QA5-02 — 44px Sample overview target:** `.back-link` is now an
   `inline-flex` control with `min-height: 44px`. The existing 390px touch
   target regression now opens `/?demo=1&id=sample-doppler` and measures the
   visible “← Sample overview” link as at least 44×44 CSS pixels.
3. **QA5-03 — actionable malformed-backup recovery:** `parseImport` now
   catches JSON syntax errors at the parsing boundary and returns exactly:
   “This file is not valid JSON. Choose an Explanation Lab JSON backup and try
   again.” The JSON-import claim first attaches the previously failing `{bad`
   file, asserts that instruction, then attaches a valid backup and proves the
   imported explanation appears.

## Reproduction and verification

Before the repair, a production build served locally was given a file containing
`{bad`; `#import-status` returned Chromium’s raw parser message:
`Expected property name or '}' in JSON at position 1 (line 1 column 2)`.

Completed locally after `npm ci`:

```sh
CI=1 npm test -- --grep '@claim:(json-import|individual-delete|mobile-ready)'
# 5 passed, 1 expected desktop skip
CI=1 npm test -- --grep 'repeated mobile navigation and footer targets'
# 1 mobile pass, 1 expected desktop skip
CI=1 npm test
# 55 passed, 3 expected desktop skips
CI=1 npm run test:a11y
# 2 passed; axe found no serious or critical violations on all product routes
npm run typecheck
npm run lint
npm audit --audit-level=high
# 0 vulnerabilities
npm run build
```

The complete suite covers desktop and 390px mobile, keyboard skip/navigation,
the privacy request policy, offline reload, update notice persistence, PWA
routing, and import/export. A mechanical claims-contract check confirms all 18
claim IDs occur exactly once as `@claim:<id>` tags. The production build writes
`dist/index.html` and `dist/404.html`; its current payload is 33,967 bytes raw
JavaScript / 11,640 bytes gzip and 18,496 bytes CSS / 4,660 bytes gzip.

## Deployment

The committed build is deployed with:

```sh
/opt/fleet/lib/deploy-static.sh explanation-lab dist
```

Post-deploy URL verification and live identity evidence are appended after the
deployment completes.

## Known gaps / next steps

None known. This static, account-free PWA has no backend, billing API, package,
or consumer-package integration to test.
