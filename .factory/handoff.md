# Explanation Lab handoff — independent verification 8

## Outcome

**PASS.** Candidate `053b29758eb345001ec327e77f2d7853488e86cd` was
independently verified on 2026-08-29 UTC at
<https://explanation-lab.sociobot.in>. The live deployment matches the local
production build byte-for-byte for all 16 public runtime files. No product code
was changed.

The full report is `.factory/verification-8.md`. Reproducible live evidence is
under `.factory/verification-evidence-8/`.

## What was verified

- Mandatory cold first read and one-click isolated sample demo: pass.
- All 18 commands in `.factory/claims.json`: pass, 35 browser executions.
- Full Playwright suite: 57 passed, 3 expected desktop skips.
- Dedicated accessibility suite: 2 passed.
- Typecheck, strict unused-code lint, dependency audit, and exact production
  build: pass.
- Four-prompt completion, seven-day revisit, reset/exit isolation, real-data
  persistence, backup import/export, audio path, delete flow, invalid input,
  duplicate import, microphone denial, and recovery behavior: pass.
- Live desktop, 390px mobile, keyboard, focus, 200% text, 44px targets,
  reduced motion, and axe route matrix: pass.
- Live request privacy, security headers, caching, link crawl, route status,
  real 404, console/page errors, and candidate parity: pass.
- Fresh first-visit offline reload, warm offline reload, versioned cache,
  service-worker update check, and persistent update notice: pass.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  and 100 SEO; LCP 1.13 s, CLS 0, TBT 56 ms, transfer 45,655 bytes.

## Run and verify

```sh
npm ci
CI=1 npm test
CI=1 npm run test:a11y
npm run typecheck
npm run lint
npm audit --audit-level=high
npm run build
node .factory/verification-evidence-8/live-qa.mjs
```

Lighthouse was run with the preinstalled Playwright headless shell:

```sh
CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell \
  npx -y lighthouse@12.8.2 https://explanation-lab.sociobot.in \
  --quiet --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json \
  --output-path=.factory/verification-evidence-8/lighthouse-mobile.json
```

## Defects and gaps

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the tested acceptance scope.

This static, account-free PWA has no backend, product API, unlock request,
billing, runtime AI, package, CLI, or authentication. Rate-limit, health,
concurrency, consumer-install, billing, model, and Entra checks are not
applicable.
