# sapinsapin.ai

The public landing page for [SapinSapin AI](https://huggingface.co/sapinsapin) — an open
initiative building corpora, benchmarks, and models for Philippine-language AI.

The page is a static React + Vite + Tailwind build with no backend, no database, and no
runtime data fetching. Every figure it displays is synced from the Hugging Face Hub at
build time.

**Live:** <https://sapinsapin-web.vercel.app>

---

## Quick start

```bash
npm install
npm run dev
```

The dev server runs on the port Vite reports (default `5173`).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Produce the static bundle in `dist/`. |
| `npm run preview` | Serve the built bundle locally. |
| `npm run sync` | Refresh dataset and model figures from the Hub API. |
| `npm run prepare:map` | Regenerate the hero map geometry from public boundary data. |
| `npm run prepare:icons` | Rasterise the brand mark to PNG favicons. |

> [!IMPORTANT]
> Run `npm run sync` before deploying. It rewrites `src/data/hubSnapshot.js`, which is
> where every count, download figure, task label, and date on the page comes from.

```bash
npm run sync && npm run build
```

---

## How the data works

The page shows live org data, but it reads it at **build time** rather than in the browser.

That is a deliberate constraint, not a shortcut. The Hub API responds with:

```http
access-control-allow-origin: https://huggingface.co
```

so a browser on `sapinsapin.ai` cannot call it directly — a client-side fetch is blocked by
CORS. Syncing on build keeps the figures honest on every deploy without needing a proxy or
serverless function. If real-time figures ever become a requirement, that needs a small
server-side proxy and is a separate decision.

### The pipeline

```
scripts/sync-catalog.mjs        →  src/data/hubSnapshot.js   (generated, do not edit)
                                        ↓
                                   src/data/catalog.js       (editorial copy + merge)
                                        ↓
                                   the page
```

`catalog.js` holds the hand-written descriptions and kickers. Every *number* — counts,
downloads, tasks, dates, gated flags — is merged in from the generated snapshot, so the
prose and the figures can never drift apart.

> [!NOTE]
> `downloads` is the Hub's **30-day** figure, which is what the org's own
> [dashboard Space](https://huggingface.co/spaces/sapinsapin/halohalo-dashboard) labels
> "Downloads (30d)". The page says "30d" wherever the number appears — keep that wording.

### Unstated metadata

Where a public Hub card does not state a size or licence, the page renders
*"Not stated on the Hub"* rather than guessing. Do not fill these in from a repo name, tag,
or sibling model — resolve them on the Hub card itself, or leave them.

---

## Project layout

```
index.html                Homepage document
404.html                  Error document (a second Vite entry, not a route)
scripts/
  sync-catalog.mjs        Hub API → hubSnapshot.js (run before deploy)
  sync-space.mjs          Space config → spaceManifest.js (run before deploy)
  prepare-map.mjs         GeoJSON → simplified SVG paths + projected anchors
  prepare-icons.mjs       Brand mark → apple-touch-icon.png, favicon-32.png
src/
  components/
    Icons.jsx             Inline SVG icon set and the brand mark
    ThemeToggle.jsx       The sun/moon button, shared by both page roots
    PhilippinesMap.jsx    Hero map, bearing dial, language readout
    SpeechConsole.jsx     The live demo, lazy-loaded
    SignalTrace.jsx       404 only: the requested URL drawn as a waveform
  lib/
    theme.js              useTheme() — palette state and the view-transition wipe
    spaceClient.js        Every call to the demo Space — queue, prep, errors
    audio.js              Decode/resample/encode to 16 kHz mono WAV
  data/
    catalog.js            Editorial copy, merged with the live snapshot
    hubSnapshot.js        Generated — do not edit by hand
    modelNotes.js         Plain-language descriptions for model hover cards
    philippinesMapPaths.js  Generated — do not edit by hand
    spaceManifest.js      Generated — do not edit by hand
  App.jsx                 Page sections, navigation, theming, citations
  NotFound.jsx            The 404 page: error panel, signal trace, route recovery
  index.css               Design tokens, both themes, component styles
```

### The 404 page

`404.html` is built as a second entry rather than handled by a router, so a bad address
gets a real `404` status and keeps the URL the visitor typed. The page prints that address,
draws it as a deterministic speech-like waveform that decodes to nothing, and fuzzy-matches
it against the site's real destinations to suggest where they meant to go — all in the
browser, with no network requests. Adding a section to the homepage means adding it to the
`destinations` table in `src/NotFound.jsx` so the 404 can suggest it.

---

## Theming

Colours are defined once as CSS custom properties holding space-separated RGB channels:

```css
:root            { --c-ink: 26 22 19; --c-paper: 251 247 240; /* … */ }
[data-theme=dark]{ --c-ink: 240 233 222; --c-paper: 18 16 13; /* … */ }
```

`tailwind.config.js` maps its colour scale onto those variables, so ordinary utilities such
as `text-ink/70` follow the active theme with no `dark:` prefixes anywhere in the markup.

> [!WARNING]
> Tailwind only emits a colour-opacity modifier when the value exists in `theme.opacity`.
> The default scale skips most integers, so `text-ink/68` silently produces **no rule** and
> the element falls back to inheriting full-strength colour. The config defines every
> integer from 0–100 to prevent this. If you add a new alpha, verify it renders.

Theme switching uses the View Transitions API for a circular wipe out of the toggle, and
falls back to a short colour-only crossfade elsewhere. Both paths respect
`prefers-reduced-motion`.

Two surfaces — the footer and the code sample — stay dark in **both** themes, so they carry
their own tokens and their own `::selection` colours.

---

## The hero map

`scripts/prepare-map.mjs` downloads a public Philippine boundary, simplifies it, and
projects it with an equirectangular projection using a `cos(midLat)` correction on
longitude. Both axes share one scale — scaling them independently stretches the archipelago
by roughly 14%.

Language markers are projected through that **same** transform from real coordinates, so a
marker cannot drift away from the geography it describes. Marker area is proportional to
that language's 30-day model downloads (radius scales with the square root).

The bearing dial in the corner keeps a fixed north mark and rotates only a separate pointer,
which tracks the active language layer. Clicking it steps to the next layer; right-click
steps back.

---

## Citations

Research claims carry numbered markers that link to a references block. Pointer users get a
hover card; everyone else follows the link. Sources are listed in
[ATTRIBUTION.md](ATTRIBUTION.md) alongside map and model-description provenance.

Keep these sparse. A citation on every sentence reads as noise rather than rigour.

---

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus styles, labelled links, and native
  disclosure controls for the FAQ and mobile menu.
- Text contrast clears WCAG AA in both themes; the lowest measured ratio is ~4.5:1 on light
  and ~6.2:1 on dark. `/60` is the lowest safe alpha for small text — do not go below it.
- Every animation honours `prefers-reduced-motion`.
- No tracking, no image payload, no runtime data fetching.
- `robots.txt`, `sitemap.xml`, canonical and Open Graph metadata, Organization JSON-LD, and
  DataCatalog JSON-LD are all included.

Run Lighthouse against the deployed URL rather than trusting a claimed score here.

---

## Deployment

Vercel builds from `main` using [`vercel.json`](vercel.json). Pushing to `main` deploys.

The only manual step is running `npm run sync` beforehand so the committed snapshot is
current.
