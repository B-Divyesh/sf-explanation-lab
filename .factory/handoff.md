# Explanation Lab review 4 handoff

## Outcome

**FAIL.** Adversarial review 4 of candidate `4c2bc69b1b98aed5415dcc23b8cc747552473d92` is recorded in [review-4.md](review-4.md). No product code was changed.

The review found two blocking demo issues and three minor copy issues:

1. The one-click demo shows no actual sample record in the initial phone or desktop viewport.
2. Header/footer navigation can silently leave demo mode, retain demo edits, and reach real storage without selecting **Start for real**. This contradicts the Privacy and README “leaving” promise and reopens `QA-05` / `QA2-05` claims coverage.
3. The Privacy h1 is a vague promise.
4. Metadata uses the American verb “Practice” while visible copy uses “practise.”
5. README calls the demo a “sandbox.”

## Verification performed

- Fresh live contexts at 390×844 and 1440×900 for first read, one-click demo, viewport measurements, demo reset/exit paths, real/demo storage, request origins, offline reload, reduced motion, routing, Back/focus, metadata, links, 404, and serious/critical axe checks.
- Clean clone: `/tmp/explanation-lab-review4-claims.LO5C18/clone`.
- Every literal command in `.factory/claims.json`: 18/18 passed; each tag appears exactly once.
- `CI=1 npm test`: 57 passed, 3 expected desktop skips.
- `npm run test:a11y`: 2 passed.
- `npm run typecheck`, `npm run lint`, `npm audit --audit-level=high`, and `npm run build`: passed.
- `dist/index.html` exists. Built JS is 34.04 KB raw / 11.65 KB gzip; CSS is 18.54 KB raw / 4.66 KB gzip.
- `/opt/fleet/lib/verify-url.sh 'https://explanation-lab.sociobot.in/?demo=1' ...`: passed with no console error or basic semantic failure.

## Reproduce the blocking demo exit

1. Open `https://explanation-lab.sociobot.in/?demo=1&new=1` in a fresh browser context.
2. Create “Demo exit persistence probe.”
3. Use the header **Privacy**, **Practice**, or **Library** link; the demo banner disappears.
4. Return to `/?demo=1`; the probe remains and the dashboard has four records, despite the promise that leaving removes the workspace.
5. From the demo, use header **Practice**, create a topic, and open `/library`; that topic is in the real namespace without using **Start for real**.

## Required next work

Implement the concrete fixes in `F-4-1` through `F-4-5`, expand the demo claim assertions to cover initial viewport visibility and all exit routes, deploy, and repeat the full adversarial checklist. No infrastructure, DNS, billing, or deployment action was taken in this review.
