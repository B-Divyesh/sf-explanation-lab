# Explanation Lab repair handoff — 2026-08-28

## Repair summary

- Repaired the direct `/demo` accessibility race from candidate `9a553d0d42cea1d9f2ea25594161ca91902c09d2`.
- Root cause: the initial render awaited IndexedDB demo seeding before it wrote the route `<main>` and `<h1>`. A fast route inspector could therefore see zero headings.
- The app now writes a route-specific loading shell synchronously for every storage-backed route (`/demo`, `/practice`, and `/library`). That shell has exactly one plain-language `<h1>`, and it is replaced by the completed route with exactly one `<h1>`.
- `index.html` now has a single heading-bearing fallback while JavaScript starts. Rendered main landmarks are programmatically focusable so the skip link moves focus to main.
- Added regression coverage for direct `/demo` loads at `domcontentloaded`, completed route renders, route-focus/live-region behavior, keyboard skip-link navigation, and the service-worker update message.

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
npm ci && npm run build && npm test
```

Final local results on 2026-08-28:

- Exact clean verification command `npm ci && npm run build && npm test`: passed; 25 tests passed and one expected skip because the 390px-only check runs only in the mobile project.
- `npm run build`: passed; output written to `dist/` with `dist/index.html` at its root.
- Production bundle: 10.41 KB JavaScript gzip and 4.59 KB CSS gzip.
- Mobile hero: 27 KB WebP; wide hero: 59 KB WebP.
- `npm audit`: 0 vulnerabilities during `npm ci`.
- Route/accessibility regression: each of `/`, `/demo`, `/practice`, `/library`, `/privacy`, `/terms`, and the 404 route has one `<h1>` both at `domcontentloaded` and after any route data renders. Axe through Playwright found no serious or critical violations on either desktop Chromium or the 390px mobile project.
- Keyboard regression: Tab exposes the skip link, Enter moves focus to the main landmark, and keyboard activation of Demo moves focus to its final `<h1>`.
- Offline/update regression: Playwright loaded `/demo`, waited for the service worker, disabled the network, reloaded, and found the full sample workspace; a controlled page also displayed the “An update is ready” toast when it received `UPDATE_READY`.
- Privacy regression: the full sample edit and audio-recording flow observed no cross-origin requests.
- Local production identity check, `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo`: HTTP 200 in 540 ms; title `Demo — Explanation Lab`; `lang=en`; one h1; main landmark; 0 missing image alts; 0 unlabeled buttons; and 0 console errors. Evidence: `/tmp/explanation-lab-verify-local.ZdaGf2` in the repair container.
- Lighthouse 12.8.2 report: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.6 s, CLS 0, total blocking time 0 ms. The Chromium process exited after report generation in this container, but the complete JSON report was written to `/tmp/explanation-lab-lh.p4skyc/report`.
- Deployment: `/opt/fleet/lib/deploy-static.sh explanation-lab dist` deployed the committed static `dist/` to `https://explanation-lab.sociobot.in` using the configured Azure Static Web App.
- Live identity check, `/opt/fleet/lib/verify-url.sh https://explanation-lab.sociobot.in/demo`: HTTP 200 in 611 ms; title `Demo — Explanation Lab`; `lang=en`; one h1; main landmark; 0 missing image alts; 0 unlabeled buttons; and 0 console errors. Evidence: `/tmp/explanation-lab-verify-live.w1TFHB` in the repair container.

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
