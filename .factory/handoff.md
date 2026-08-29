# Explanation Lab repair handoff — QA7 remediation

## Outcome

Repaired the sole release-blocking finding from report commit
`5e02b95dbb04f141383587978469e89c882cf5f3` for candidate
`fa3868345839b142039ced4325263b449716f991`. The repair preserves the
researched brief, the reasoning-workbench design, the local-first PWA artifact,
and every behavior that passed independent verification 7.

Repair commit `8567402` is pushed to `origin/main` and deployed at
<https://explanation-lab.sociobot.in>.

## QA7-01 repair

The verifier measured the populated workbench at 409px in a 390px viewport
after setting the root text size to 32px. The fixed 100px mobile progress stamp
remained beside the topic heading, while its resized “prompts answered” words
were wider than the stamp. The label ended at x=406.88 and created 19px of
horizontal overflow.

At the mobile breakpoint, the workbench header now stacks the progress stamp
below the topic. The stamp uses its content width with a 100% ceiling, and its
label is a block. This keeps the complete label visible without clipping or
breaking the desktop layout.

`tests/app.spec.ts` now opens the exact missed route,
`/?demo=1&id=sample-doppler`, at 390×844 with a 32px root font. It asserts both
document reflow and the progress label's viewport bounds. The new test failed
against the candidate with the verifier's exact 19px result, then passed after
the repair.

Live after deployment:

- document client width: 390px
- document scroll width: 390px
- horizontal overflow: 0px
- progress label: x=25.22px through x=257.02px
- serious or critical axe findings: 0
- visible workbench targets below 44×44 CSS px: 0

Evidence:
`.factory/repair-evidence/qa7-live.json`,
`.factory/repair-evidence/qa7-workbench-desktop.png`, and
`.factory/repair-evidence/qa7-workbench-mobile-200pct.png`.

## Local verification

Completed from the work-order checkout with Playwright 1.58.2:

```sh
npm ci
# 22 packages; 0 vulnerabilities

CI=1 npm test
# 57 passed; 3 intended desktop skips

CI=1 npm run test:a11y
# 2 passed; desktop and 390px mobile route matrix

npm run typecheck
npm run lint
npm audit --audit-level=high
npm run build
# all pass; audit reports 0 vulnerabilities; dist/ produced
```

Every exact command in `.factory/claims.json` passed independently: 18/18
commands and 35 configured browser executions. All 18 IDs occur exactly once
as `@claim:<id>` tags, with no undeclared tag.

The full suite covers the one-click isolated demo, all four prompts, exact
seven-day revisit, real/demo separation, JSON and audio backup round trips,
atomic import validation, duplicate decisions, individual deletion,
microphone shutdown and denial recovery, keyboard-only use, focus contrast,
44px targets, route metadata, privacy request logging, service-worker update
notice, and offline reload. The repaired test covers the populated workbench at
390px and 200% text.

`/opt/fleet/lib/verify-url.sh` reported HTTP 200, the route-specific title,
`lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled
buttons, and no console errors.

Production payload:

- JavaScript: 34,034 bytes raw / 11,644 bytes gzip
- CSS: 18,575 bytes raw / 4,693 bytes gzip
- no downloaded fonts or third-party runtime scripts

## Deployment and live verification

Deployment used the work order's existing static configuration:

```sh
/opt/fleet/lib/deploy-static.sh explanation-lab dist
```

Azure Static Web Apps deployment
`7f22c59c-4829-4443-9d56-d0a566ba69e3` succeeded. The custom domain returned
HTTP 200 over managed TLS. Sixteen public runtime files match local `dist/`
byte-for-byte, including HTML, hashed CSS/JS, manifest, service worker, offline
page, images, and icons.

Live checks passed at desktop and 390px mobile:

- all eight product routes return 200, have one h1 and one main, and have no
  horizontal overflow or serious/critical axe findings;
- an unknown route returns the designed page with HTTP 404;
- the repaired workbench has zero overflow at 200% text;
- only `https://explanation-lab.sociobot.in` was requested, with zero console
  or page errors;
- the service worker controls the page, uses
  `explanation-lab-shell-v4`, has no waiting worker, and restores all three
  demo records offline;
- reduced motion removes the workbench animation and smooth scrolling;
- HTML revalidates, hashed assets are immutable, stable images revalidate,
  and `/sw.js` is `no-cache`;
- CSP, HSTS, `nosniff`, referrer, permissions, COOP, and frame protections are
  present.

Fresh live Lighthouse 12.8.2 mobile scores are 100 performance, 100
accessibility, 100 best practices, and 100 SEO. FCP is 0.96s, LCP is 1.05s,
CLS is 0, TBT is 0ms, and total transfer is 54,721 bytes.

## Known gaps and applicability

No known release-blocking or product-QA gaps remain. This is a static,
account-free, local-first PWA with no backend, billing, runtime AI, package, or
CLI. API rate limiting, backend health/concurrency, live model identity, and
package-consumer installation checks are not applicable.
