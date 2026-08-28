# Explanation Lab visual thesis

## Direction

**Neo-brutalist utility: the reasoning workbench.** Explanation Lab should feel like a durable lab notebook crossed with a control panel. Thick rules, offset shadows, numbered tabs, and graph-paper marks make each prompt feel like a tool the learner operates. The visual hierarchy is blunt and useful, not ornamental. It fits a product whose job is to expose weak reasoning through four deliberate passes.

The treatment is intentionally single-mode. The warm paper field and carbon ink are part of the product's identity, and all controls paint their own backgrounds.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Background | `--paper` | `#F4F0E6` | page and notebook field |
| Surface | `--sheet` | `#FFFDF7` | writing surfaces |
| Text | `--ink` | `#151515` | primary copy and rules |
| Muted text | `--muted` | `#5C584F` | notes and metadata |
| Accent | `--blue` | `#164BFF` | primary actions and active steps |
| Accent contrast | `--on-blue` | `#FFFFFF` | text on cobalt |
| Annotation | `--orange` | `#FF5A36` | counters, warnings, due marks |
| Success | `--green` | `#146B43` | saved and completed states |
| Warning tint | `--yellow` | `#FFD84D` | labels and focus support on light surfaces |
| Danger | `--red` | `#A52822` | destructive actions and errors |

Carbon ink on paper is above 14:1. Muted ink on paper is above 6:1. White on cobalt is above 7:1. Status never depends on color alone.

## Type

- Display: `Arial Black`, `Arial Narrow Bold`, system sans-serif. Uppercase only for small stamps; headlines stay sentence case.
- Body: `ui-monospace`, `SFMono-Regular`, `Cascadia Code`, `Roboto Mono`, monospace. This evokes notes and source code without a font download.
- Scale: 16, 18, 24, 36, and responsive 64px. Body line-height is 1.55. Long text stays below 68 characters.

System fonts keep the first load small, work offline, and avoid third-party requests.

## Spacing and shape

- Base unit: 8px. Main intervals: 8, 16, 24, 32, 48, 72, 96.
- Borders: 2px carbon; primary panels use 3px.
- Corners: 0–4px. This is a tool, not a soft card deck.
- Shadows: solid 6px offsets, never blurred. Pressed controls translate into their shadow.
- Writing areas group by proximity. Borders appear where they describe a page, step, or instrument.

## Interaction grammar

- A blue numbered rail shows the current prompt. Completed prompts become checked carbon tabs.
- Buttons are rectangular tools with a visible physical press of 2px.
- Save feedback appears beside the action and in a polite live region.
- Keyboard users follow source order: prompt, response, recording, next action. The writing field receives focus when a step opens.
- Destructive actions name their target and require confirmation. Imports validate before replacing data.

## Motion

One signature motion: when moving between prompts, the next graph-paper sheet slides up 12px into registration over 180ms. Buttons depress over 80ms. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are immediate.

## Asset plan and prompt sheet

Hero asset: one generated editorial still-life of a tabletop explanation apparatus. Four connected physical stations represent mechanism, boundary, example, and counterexample. The image contains no readable text, interface mockup, person, logo, or watermark. It will ship as responsive WebP/AVIF if available, with a PNG source retained under `assets/src/` and a prompt sidecar.

**Art direction:** top-down three-quarter view; cream graph paper; black ink lines; cobalt acrylic blocks; safety-orange correction tabs; small wooden ramps, steel ball bearings, hinged gates, and cut-paper boundary shapes; hard midday studio light; tactile paper grain; deep crisp offset shadows; editorial product photography mixed with hand-built educational model.

**Negative list:** no text, letters, numbers, logos, watermark, brands, hands, people, screens, floating gradients, glossy SaaS 3D, illegible symbols, or impossible geometry.

Provenance: generated for Explanation Lab on 2026-08-28 with the factory image deployment through `/opt/fleet/lib/gen-image.sh`. The final exact prompt is stored beside the source image. Generated imagery is original to this product.

## Social image and icons

The 1200×630 social card is composed locally from the generated hero crop and native typography. App icons and the favicon are authored locally as simple four-cell graph-paper marks; they do not imitate an existing mark.

## Responsive intent

At 390px, the illustration moves below the first action, the four prompt tabs become a horizontal strip, and actions stack full-width. Secondary explanatory copy is shortened or moved below the working tool. At wide sizes, the hero uses an asymmetrical 7/5 grid and the lab tool uses a prompt rail beside the writing sheet.
