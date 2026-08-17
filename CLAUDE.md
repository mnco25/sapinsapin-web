# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public landing page for SapinSapin AI (https://huggingface.co/sapinsapin), an open
initiative building corpora, benchmarks, and models for Philippine-language AI. It is a
**static React + Vite + Tailwind build with no backend, no database, and no runtime data
fetching** — every figure the page shows is synced from the Hugging Face Hub at build time.
Live at https://sapinsapin-web.vercel.app.

## Commands

```bash
npm install
npm run dev            # Vite dev server (default port 5173)
npm run build           # Static bundle → dist/
npm run preview         # Serve the built bundle locally
npm run sync             # Refresh dataset/model figures from the Hub API → src/data/hubSnapshot.js
npm run prepare:map      # Regenerate hero map geometry from public boundary data
npm run prepare:icons    # Rasterise the brand mark to PNG favicons
```

There is no test suite and no lint script configured in `package.json`.

**Always run `npm run sync` before a deploy build.** It rewrites `src/data/hubSnapshot.js`,
the single source for every count, download figure, task label, and date on the page:

```bash
npm run sync && npm run build
```

## Architecture

### The data pipeline (the core thing to understand)

```
scripts/sync-catalog.mjs   →   src/data/hubSnapshot.js   (generated, do not edit by hand)
                                        ↓
                                 src/data/catalog.js       (editorial copy + merge)
                                        ↓
                                     the page (App.jsx)
```

- `scripts/sync-catalog.mjs` hits the public Hub API for the `sapinsapin` org and writes
  `src/data/hubSnapshot.js`. This runs at **build time**, not in the browser, because the
  Hub API responds with `access-control-allow-origin: https://huggingface.co`, which blocks
  a client-side fetch from `sapinsapin.ai` via CORS. There is no proxy or serverless
  function — syncing on build is the deliberate tradeoff.
- `src/data/catalog.js` holds hand-written descriptions/kickers and merges in every number
  (counts, downloads, tasks, dates, gated flags) from the generated snapshot, so prose and
  figures can't drift apart. Fields the Hub doesn't state are marked `{{VERIFY}}` or "Not
  stated on the Hub" rather than guessed — never fill these in from a repo name, tag, or
  sibling model.
- `downloads` is the Hub's **30-day** figure (matches the org's dashboard Space label
  "Downloads (30d)"). Keep the "30d" wording wherever the number appears.
- `src/data/hubSnapshot.js` and `src/data/philippinesMapPaths.js` are generated — never
  hand-edit them; regenerate via `npm run sync` / `npm run prepare:map`.

### Layout

```
scripts/
  sync-catalog.mjs        Hub API → hubSnapshot.js (run before deploy)
  prepare-map.mjs          GeoJSON → simplified SVG paths + projected anchors
  prepare-icons.mjs        Brand mark → apple-touch-icon.png, favicon-32.png
src/
  components/
    Icons.jsx              Inline SVG icon set and the brand mark
    PhilippinesMap.jsx      Hero map, bearing dial, language readout
  data/
    catalog.js              Editorial copy, merged with the live snapshot
    hubSnapshot.js           Generated — do not edit by hand
    modelNotes.js            Plain-language descriptions for model hover cards
    philippinesMapPaths.js   Generated — do not edit by hand
  App.jsx                    All page sections, nav, theming, citations (single file)
  index.css                  Design tokens, both themes, component styles
```

`App.jsx` is one file containing every section as its own function component (`Hero`,
`Demo`, `Problem`, `Impact`, `Datasets`, `Models`, `Openness`, `Contribute`,
`PartnersAndFaq`, `Footer`, plus shared helpers like `Cite`, `Reveal`, `CountUp`,
`ThemeToggle`, `Nav`) rather than being split into per-file components. Follow that
convention rather than introducing a new components directory for section content.

### Theming

Colors are CSS custom properties holding space-separated RGB channels, switched via
`[data-theme=dark]` on the root:

```css
:root             { --c-ink: 26 22 19; --c-paper: 251 247 240; /* … */ }
[data-theme=dark] { --c-ink: 240 233 222; --c-paper: 18 16 13; /* … */ }
```

`tailwind.config.js` maps its color scale onto those variables (`ink`, `paper`, `ube`,
`pandan`, `cream`, `surface`, `line`), so ordinary utilities like `text-ink/70` follow the
active theme with no `dark:` prefixes anywhere in the markup.

Tailwind only emits a color-opacity modifier (e.g. `/68`) when the value exists in
`theme.opacity`, and the default scale skips most integers. `tailwind.config.js` defines
every integer 0–100 to prevent alpha utilities from silently producing no rule. If you add a
new alpha value in markup, verify it actually renders.

Theme switching uses the View Transitions API for a circular wipe from the toggle, falling
back to a short color-only crossfade elsewhere; both respect `prefers-reduced-motion`. The
footer and the code sample stay dark in both themes and carry their own tokens and
`::selection` colors.

### The hero map

`scripts/prepare-map.mjs` downloads a public Philippine boundary, simplifies it, and
projects it with an equirectangular projection using a `cos(midLat)` correction on
longitude — both axes share one scale (scaling independently stretches the archipelago by
~14%). Language markers in `PhilippinesMap.jsx` are projected through that **same**
transform from real coordinates, so markers can't drift from the geography. Marker area is
proportional to that language's 30-day model downloads (radius scales with the square
root). The bearing dial keeps a fixed north mark and rotates only a separate pointer that
tracks the active language layer (click to step forward, right-click to step back).

### Citations

Research claims carry numbered markers linking to a references block in `App.jsx`
(`References`/`Cite`). Pointer users get a hover card; everyone else follows the link.
Sources are listed in `ATTRIBUTION.md` alongside map and model-description provenance. Keep
citations sparse — one on every sentence reads as noise, not rigor.

## Deployment

Vercel builds from `main` using `vercel.json`. Pushing to `main` deploys. The only manual
step is running `npm run sync` beforehand so the committed snapshot is current.
