# Explanation Lab

Practice explaining hard ideas with a mechanism, boundary, example, and counterexample.

Explanation Lab is for students learning abstract STEM or programming concepts. It turns free-form study notes into a repeatable four-prompt practice. Completed explanations return to a revisit queue after seven days.

The app is free and needs no account. Text and audio notes stay in IndexedDB in the current browser. It works offline after the first visit. JSON import and export let learners move or back up their work.

Live site: <https://explanation-lab.sociobot.in>

One-click sandbox: <https://explanation-lab.sociobot.in/demo>

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `/demo` loads isolated sample data.

## Test and build

```sh
npm test
npm run build
```

The exact deployment build command is `npm run build`. It writes the static site to `dist/`, with `dist/index.html` at its root.

The Playwright suite checks the full four-prompt flow, demo isolation, local audio, JSON import and export, offline reload, the 390px layout, and serious accessibility issues. Chromium for Playwright is required; the work order pins Playwright 1.58.2.

## Data and privacy

- Real work uses the `explanation-lab` IndexedDB database.
- Demo work uses the separate `demo:explanation-lab` database.
- Resetting or leaving the demo clears only demo data.
- The app makes no cross-origin runtime requests.
- Clearing this site's browser data removes saved work.

Read the in-app `/privacy` and `/terms` pages for user-facing details.

## Deploy

Deploy the contents of `dist/` as a static site. Keep `staticwebapp.config.json` at the deployment root so deep links fall back to `index.html` and security headers are applied. The service worker caches the app shell and visited build assets.

## Visual assets

The tabletop apparatus is original generated imagery. Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`.

## License

MIT. See `LICENSE`.
