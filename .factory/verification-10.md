# Independent product verification 10 — PASS

- Date: 2026-08-29 UTC
- Work order: `explanation-lab-verify-10`
- Candidate and checked-out commit: `5b885064362f00e9814118806a1201e845ea58d4`
- Live URL: <https://explanation-lab.sociobot.in>
- Artifact: local-first offline PWA

## Verdict

**PASS — candidate `5b885064362f00e9814118806a1201e845ea58d4` meets the supplied acceptance contract.** The deployed runtime is byte-for-byte identical to the candidate production build, every declared claim command passes, and fresh independent QA found no release defect. No product code was modified during verification.

## Mandatory first-read and demo gate — PASS

A cold browser visit to `/` returned HTTP 200 without console or page errors. At desktop and 390×844, the first screen states:

- What it does: “Explain hard ideas in your own words.”
- For whom: “For STEM and programming learners who want to find gaps in their understanding.”
- What to click first: “Try it with sample data,” next to “Opens the due siren explanation with a saved sample answer.”

The single click opens `/?demo=1&id=sample-doppler`. After the brief local-workspace loading state, the named due siren explanation, its saved response, 4/4 progress, the persistent “Demo — sample data, nothing is saved to your work” banner, Reset demo, and Start for real are visible. The populated desktop and phone views have no horizontal overflow.

## Claims gate — PASS

`.factory/claims.json` is present with 18 entries. After the clean install, every literal `test` command was run independently through the configured local demo entry point. All passed: 35 browser executions across desktop and mobile, with zero failures.

| Claims that passed |
| --- |
| `one-click-demo`, `demo-isolation`, `demo-reset-exit`, `four-part-revisit`, `four-prompt-practice`, `json-export` |
| `json-import`, `atomic-import-validation`, `duplicate-import-decision`, `audio-backup`, `local-private`, `manual-no-sync` |
| `no-tracking`, `free-no-account`, `offline-reload`, `mobile-ready`, `site-data-clear`, `individual-delete` |

Every manifest ID appears in exactly one `@claim:<id>` test. The landing page, product pages, README, and demo documentation were reconciled against the manifest; no unlisted product claim was found.

## Clean-checkout quality gates — PASS

The checkout was clean at the candidate commit before verification.

```text
npm ci                              # passed; 22 packages; 0 vulnerabilities
CI=1 npm test                       # 57 passed; 3 intentional desktop-only skips
npm run test:a11y                   # 2 passed
npm run typecheck                   # passed
npm run lint                        # passed
npm audit --audit-level=high        # 0 vulnerabilities
npm run build                       # passed; dist/ produced
```

The exact build emitted 35.15 KB raw / 11.94 KB gzip JavaScript and 19.06 KB raw / 4.76 KB gzip CSS. There are no downloaded fonts or production packages. The phone hero is 27,210 bytes. These are within the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB mobile-hero budgets.

## Independent end-to-end product QA — PASS

Fresh browser contexts exercised the live product at 1440×900 and 390×844:

- Started in the isolated demo, opened the populated due sample, and used Start for real.
- Submitted a two-character topic; the form announced “Name the idea in at least three characters” and returned focus to the field.
- Confirmed the topic input enforces its 100-character boundary.
- Created “Why recursion needs a base case,” saved text, and advanced with focus moved to the next response.
- Tried to finish with missing parts; the app opened the first missing prompt, announced the specific error, and focused its response field.
- Completed mechanism, boundary, example, and counterexample. The library showed 4/4 and `Revisit Sep 5, 2026`, exactly seven days after the 2026-08-29 check.
- Imported an invalid product JSON file; the app gave a specific recovery instruction and left the saved explanation unchanged.
- Confirmed an empty library explains what will appear and offers Start an explanation.
- Denied microphone permission; the app explained how to recover and kept the text path enabled.
- Confirmed a response is capped at 6,000 characters.

No console error, page error, or failed network request occurred in these flows. Public routes `/`, `/?demo=1`, `/practice`, `/library`, `/privacy`, `/terms`, and `/visual-notes` return 200. All discovered internal and external links return 200. An unknown route returns a designed HTTP 404 with a route-specific heading and way home.

## Accessibility, keyboard, mobile, and motion — PASS

- The first Tab lands on Skip to main content with a visible 4px solid focus outline; Enter focuses `main`. The next Tab reaches Try it with sample data, and Enter opens the populated demo.
- Live Playwright axe checks on ten landing, demo, workbench, legal, library, and 404 states found zero violations at any impact level; serious/critical count is zero.
- `/opt/fleet/lib/verify-url.sh` reported a title, `lang=en`, exactly one h1, a main landmark, zero missing image alternatives, zero unlabeled buttons, and zero console errors.
- Every checked button and button-styled link met the 44×44 CSS-pixel target. The independent focus-contrast test in the full suite passed.
- At 390px, landing, demo overview, populated workbench, practice, library, privacy, terms, visual notes, and 404 all remain exactly 390px wide after simulated 200% text sizing.
- Reduced-motion emulation matches the media query, removes the sheet animation, and changes scrolling to `auto`.
- The document keeps one h1 and correctly labeled forms, live status regions, ordered prompt lists, header/nav/main/footer landmarks, and route-specific titles/canonicals.

The visual result also matches `.factory/design.md`: a distinctive graph-paper reasoning workbench with carbon rules, cobalt controls, orange/yellow status marks, mono body type, hard offset shadows, and original generated apparatus art. The generated source, exact prompt, deployment, date, and in-product disclosure are present.

## Privacy, security, and endpoint applicability — PASS

The complete live text and fake-microphone demo flow produced only:

```text
GET https://explanation-lab.sociobot.in/?demo=1&id=sample-doppler
GET https://explanation-lab.sociobot.in/build/main-B5Laq8TL.js
GET https://explanation-lab.sociobot.in/build/main-Dvh4i3B0.css
GET blob:https://explanation-lab.sociobot.in/...   # local audio playback
```

There were no cross-origin requests, uploads, analytics, ads, third-party scripts, API calls, or runtime AI calls. The audio control appeared after recording, and playback used a local blob URL. Source inspection found no application `fetch`, XHR, WebSocket, authentication, billing, or unlock code; only the same-origin service-worker fetch handler is present.

Browser response headers on the live HTML include:

- CSP restricted to self/data/blob as needed, with `frame-ancestors 'none'` delivered as a header.
- HSTS with includeSubDomains and preload.
- `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), geolocation=(), microphone=(self)` and same-origin COOP.

This product has no server-side product, billing, or factory-unlock endpoint. Therefore an API request allowance, 429/Retry-After enforcement, backend concurrency/health, and server persistence tests are not applicable. It requires no sign-in, so the Microsoft Entra authority check is also not applicable.

## PWA, offline, caching, and deployment identity — PASS

- The manifest declares standalone display, a versioned start URL, product theme/background colors, and real 192×192 and 512×512 maskable icons. The Apple icon is 180×180.
- `/sw.js` controls the live page. `registration.update()` completes with an activated current worker and no waiting or installing worker. The full suite also passes the persistent update-notice scenario.
- After first load, setting the browser offline and reloading the direct populated demo restores the saved sample with no errors.
- HTML revalidates after 30 seconds; hashed JS/CSS use `max-age=31536000, immutable`; `/sw.js` uses `no-cache`. The worker precaches the shell and uses versioned cache `explanation-lab-shell-v4`.
- All 16 public runtime files in `dist/` match the live response bodies by SHA-256. `staticwebapp.config.json` is host configuration rather than a public runtime asset. This proves the live deployment matches candidate `5b885064362f00e9814118806a1201e845ea58d4`.

## Performance — PASS

Fresh live mobile Lighthouse results:

| Category/metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.1 s |
| LCP | 1.2 s |
| TBT | 10 ms |
| CLS | 0 |
| Total transfer | 54 KiB |

A separate first-interaction measurement with 4× CPU throttling recorded 56 ms, below the 200 ms responsiveness budget. A cold 390px browser transferred 12,339 bytes of JS, 5,283 bytes of CSS, 27,510 bytes for the hero, and 1,043 bytes for HTML.

## Product and documentation fit — PASS

The product fulfills the researched smallest useful product: learners create their own mechanism, boundary, example, and counterexample; save dated text or local audio; and revisit completed work after seven days. Text-only use is complete. Import/export gives users ownership of local data. The app honestly excludes AI grading, generated explanations, plagiarism checks, accounts, and sync. The optional-AI review found no missed leverage: outsourcing the learner's explanation would contradict the core job, while the brief-implied import/export is already present.

`.factory/design.md`, `.factory/demo.md`, `.factory/copy-audit.md`, README, MIT license, privacy, terms, manifest, sitemap, robots, designed 404, and original-asset provenance are present and consistent.

This is neither a library nor a CLI, so consumer packing/install checks do not apply.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
