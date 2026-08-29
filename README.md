# Explanation Lab

Practise hard ideas with four focused prompts.

Explanation Lab is for students learning abstract STEM or programming concepts. Each explanation uses a mechanism, boundary, example, and counterexample. Completed explanations return after seven days.

The app is free and needs no account. Text and audio notes stay in this browser's local storage. It works offline after the first visit. JSON import and export let learners move or back up their work.

Live site: <https://explanation-lab.sociobot.in>

One-click sandbox: <https://explanation-lab.sociobot.in/?demo=1>

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `/?demo=1` loads isolated sample data.

## Test and build

```sh
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run build
```

The exact deployment build command is `npm run build`. It writes the static site to `dist/`, with `dist/index.html` at its root.

The Playwright suite checks the demo, backups, offline use, keyboard use, mobile layout, and serious accessibility errors. It also checks 200% text resize. Chromium for Playwright is required; the work order pins Playwright 1.58.2.

## Data and privacy

- Real work stays in the browser database named `explanation-lab`.
- Demo work stays in the separate browser database named `demo:explanation-lab`.
- Resetting or leaving the demo clears only demo data.
- The app does not send your explanations or audio to another website.
- Clearing this site's browser data removes saved work.
- The app checks the whole backup before saving it, so an invalid file does not change saved explanations.
- If a backup includes an explanation already in your library, choose whether to replace it or keep the saved version.

Read the in-app `/privacy` and `/terms` pages for user-facing details. The `/visual-notes` page records illustration provenance.

## Deploy

Deploy the contents of `dist/` as a static site. Keep `staticwebapp.config.json` at the deployment root so product routes open `index.html` and unknown routes return the designed 404 page. The same file applies security headers. The service worker caches the app shell and visited build assets.

## Visual assets

The tabletop apparatus is original generated imagery. Its exact prompt and provenance are in `assets/src/hero-apparatus.prompt.json` and `.factory/design.md`.

## License

MIT. See `LICENSE`.
