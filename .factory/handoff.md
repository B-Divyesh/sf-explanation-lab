# Explanation Lab independent verification 10 handoff

## Outcome

**PASS.** Candidate `5b885064362f00e9814118806a1201e845ea58d4` was independently verified on 2026-08-29 against <https://explanation-lab.sociobot.in>. No product code was changed. The live deployment matches all 16 candidate runtime files by SHA-256, every declared claim test passes, and no release defect was found.

The detailed evidence is in `.factory/verification-10.md`.

## How to run and verify

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm audit --audit-level=high
npm run build
```

Use `/?demo=1&id=sample-doppler` for the direct populated sandbox. Reset demo and Start for real operate only on the separate `demo:explanation-lab` IndexedDB database.

## Exact verification summary

- All 18 literal `.factory/claims.json` commands passed: 35 desktop/mobile executions, zero failures; every ID has one matching test tag.
- Full suite: 57 passed and 3 intentional desktop-only skips. Separate axe suite: 2 passed. Typecheck, lint, audit, and build passed.
- Production build: 35.15 KB raw / 11.94 KB gzip JS; 19.06 KB raw / 4.76 KB gzip CSS; 27,210-byte phone hero.
- Fresh live normal, boundary, invalid-input, missing-prompt, import-error, microphone-denial, empty-state, and recovery flows passed at desktop and 390px.
- Live axe on ten states found zero violations. Keyboard, visible focus, 44px targets, 200% text, reduced motion, route metadata, 404, and link checks passed.
- Request capture during text and audio use was same-origin plus a local blob URL only. Browser security headers and cache policies match the repository configuration.
- Service-worker control, update check, and offline direct-demo reload passed.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.2s, CLS 0, TBT 10ms, 54 KiB transfer. A 4× CPU-throttled interaction measured 56ms.
- This static PWA has no API, unlock call, backend, billing, or sign-in. Rate-limit/429, concurrency/health, and Entra checks are not applicable.

## Defects and next steps

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Known gaps: none.
- Next step: factory deployment may continue from the verified candidate.
