# Explanation Lab v1 handoff

## What was built

- A Vite + TypeScript offline PWA for four-part explanation practice.
- A complete text and local-audio workflow for mechanism, boundary, example, and counterexample prompts.
- Draft saving, completion, seven-day revisit scheduling, a due queue, deletion, and dated records.
- IndexedDB storage with JSON import and export, including audio data.
- A one-click `/demo` with three realistic samples in the isolated `demo:explanation-lab` database.
- Demo reset and exit controls. Leaving the demo clears only demo data.
- Real `/practice`, `/library`, `/privacy`, `/terms`, and designed 404 routes with History API navigation and route focus.
- A service worker, offline fallback, update notice, install manifest, maskable icon, canonical metadata, social image, sitemap, robots file, and static-host security headers.
- A product-specific neo-brutalist workbench system and one generated tabletop apparatus. Provenance and the exact prompt are recorded in `.factory/design.md` and `assets/src/`.
- Plain-language landing copy and a complete audit in `.factory/copy-audit.md`.

## How to run

```sh
npm install
npm run dev
```

Use `http://localhost:5173/demo` for the seeded sandbox.

## How to verify

```sh
npm test
npm run build
```

Final local results on 2026-08-28:

- `npm test`: 19 passed; one expected skip because the 390px-only check runs only in the mobile project.
- `npm run build`: passed; output written to `dist/` with `dist/index.html` at its root.
- Production bundle: 10.30 KB JavaScript gzip and 4.59 KB CSS gzip.
- Mobile hero: 27 KB WebP; wide hero: 59 KB WebP.
- `npm audit`: 0 vulnerabilities.
- Axe through Playwright: no serious or critical findings on `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, or the 404 route.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, one h1, `lang=en`, main landmark, no missing alt text, no unlabeled buttons, and no console errors.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse lab metrics: FCP 1.0 s, LCP 1.6 s, CLS 0, total blocking time 20 ms.
- Offline claim: Playwright loaded `/demo`, waited for the service worker, disabled the network, reloaded, and found the full sample workspace.

Claim definitions and their exact commands are in `.factory/claims.json`. Demo behavior is documented in `.factory/demo.md`.

## Known gaps

- Audio encoding depends on the browser's `MediaRecorder` format. Export preserves that format, but another browser may not play every imported format.
- There is no transcription. Text entry remains available beside every recording, and no audio leaves the browser.
- The app does not sync devices or send background reminders. The revisit queue appears when the learner opens the app.
- Browser storage can be cleared by the user or operating system. The JSON backup is the recovery path.

## Next steps

- Observe whether learners finish four prompts or abandon a specific prompt.
- If user research supports it, add an optional local transcription path only where the browser can guarantee on-device processing.
- Consider a printable comparison view after learners complete several revisits.
