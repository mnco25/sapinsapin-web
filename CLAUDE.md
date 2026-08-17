# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public landing page for SapinSapin AI (https://huggingface.co/sapinsapin), an open
initiative building corpora, benchmarks, and models for Philippine-language AI. It is a
**static React + Vite + Tailwind build with no backend and no database** — every figure the
page shows is synced from the Hugging Face Hub at build time.
Live at https://sapinsapin-web.vercel.app.

The one exception is the live speech demo in the `#demo` section, which calls the
`sapinsapin/halohalo-dashboard` Gradio Space from the browser. It is still the only runtime
fetching on the page; see "The live demo" below for why it is allowed to do that when the
catalog is not.

## Commands

```bash
npm install
npm run dev            # Vite dev server (default port 5173)
npm run build           # Static bundle → dist/
npm run preview         # Serve the built bundle locally
npm run sync             # Both syncs below, in order
npm run sync:catalog     # Dataset/model figures from the Hub API → src/data/hubSnapshot.js
npm run sync:space       # Demo language/voice/clip lists from the Space → src/data/spaceManifest.js
npm run prepare:map      # Regenerate hero map geometry from public boundary data
npm run prepare:icons    # Rasterise the brand mark to PNG favicons
```

There is no test suite and no lint script configured in `package.json`.

**Always run `npm run sync` before a deploy build.** It rewrites `src/data/hubSnapshot.js`,
the single source for every count, download figure, task label, and date on the page, and
`src/data/spaceManifest.js`, the demo's language/voice/clip lists:

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
  sync-space.mjs           Space config → spaceManifest.js (run before deploy)
  prepare-map.mjs          GeoJSON → simplified SVG paths + projected anchors
  prepare-icons.mjs        Brand mark → apple-touch-icon.png, favicon-32.png
src/
  components/
    Icons.jsx              Inline SVG icon set and the brand mark
    PhilippinesMap.jsx      Hero map, bearing dial, language readout
    SpeechConsole.jsx       The live demo: all three capabilities, lazy-loaded
  lib/
    spaceClient.js          Every call to the Space — queue, prep, errors
    audio.js                 Decode/resample/encode to 16 kHz mono WAV
  data/
    catalog.js              Editorial copy, merged with the live snapshot
    hubSnapshot.js           Generated — do not edit by hand
    modelNotes.js            Plain-language descriptions for model hover cards
    philippinesMapPaths.js   Generated — do not edit by hand
    spaceManifest.js         Generated — do not edit by hand
  App.jsx                    All page sections, nav, theming, citations (single file)
  index.css                  Design tokens, both themes, component styles
```

`App.jsx` is one file containing every section as its own function component (`Hero`,
`Demo`, `Problem`, `Impact`, `Datasets`, `Models`, `Openness`, `Contribute`,
`PartnersAndFaq`, `Footer`, plus shared helpers like `Cite`, `Reveal`, `CountUp`,
`ThemeToggle`, `Nav`) rather than being split into per-file components. Follow that
convention rather than introducing a new components directory for section content.
`PhilippinesMap.jsx` and `SpeechConsole.jsx` are the exceptions and not a precedent for
splitting sections: both are self-contained interactive widgets, and the prose around them
still lives in `Hero()` and `Demo()`.

### The live demo

`SpeechConsole.jsx` runs the org's speech models — transcribe, synthesize, convert voice —
against the `sapinsapin/halohalo-dashboard` Space, in the browser, with no proxy. Four facts
about that Space drive the whole design. All four were measured, not read off the docs; the
Space's own API page is wrong about the third.

1. **It permits any origin.** The Space reflects whatever `Origin` asks, on `/config`,
   `/gradio_api/*`, the upload route and the file route. This is the opposite of the Hub API
   (which pins the header to huggingface.co and forces the build-time catalog sync), so the
   demo may call it directly while the catalog may not. Different reason, different answer —
   don't "fix" one to match the other.

2. **It cannot do concurrency.** Two requests in flight at once leave it waiting on a session
   it never finishes, and a few of those make it stop answering for about a minute.
   `spaceClient.js` therefore runs a single FIFO queue with exactly one request in flight;
   waiting jobs report their place rather than appearing stalled. Never call it in parallel,
   including from build scripts.

3. **Dropdown values are validated per session, against a cursor.** Gradio keeps one live
   choice list per dropdown per session, so `/synthesize` rejects a Bikol voice unless
   `/lambda_1(Bikol)` ran in that session first — and preparing Bikol, then Waray, makes
   Bikol invalid again. Preparation is a cursor, not a cache: `withPrepared` re-runs it
   whenever the cursor has moved, inside the same queue slot as the call it protects.
   `/transcribe` and `/convert` need none of this; their dropdowns hold every option already.

4. **It runs on free cpu-basic.** Roughly 8–20s warm, and the first use of a language loads a
   ~1 GB model first. The UI states this up front, holds the result's height from the moment
   a job starts, and only blames a model download once a request has outlasted any warm one
   — warmth is tracked in memory, so a fresh page load cannot tell a cold model from a busy
   Space. Voice conversion is one language-independent model, so one run warms it for every
   language.

`spaceManifest.js` exists only so the controls can render before any request; the Space's own
`choices` outrank it at call time, so drift there degrades to a stale first paint rather than
a failed call. `sync-space.mjs` failing is the signal that the Space's shape changed.

#### What updates on its own, and what does not

The demo is only partly self-healing, and the split is deliberate — knowing which half a
change falls in tells you whether it needs a deploy.

| If the Space changes… | The site… |
|---|---|
| a **clip** is added, renamed or removed | corrects itself — refreshed from `/lambda` when the dropdown is focused |
| a **voice** is added, renamed or removed | corrects itself — refreshed from `/lambda_1`, and a selection that no longer exists falls back to a real one instead of failing at submit |
| an **output shape** changes | keeps working — every result is read positionally through `pick()` with fallbacks |
| the Space **restarts** and forgets the session | recovers — one silent retry on a fresh session |
| a **language** is added | ignores it until `npm run sync`; the model badge is dropped rather than printed as `…-undefined` |
| a **language** is removed | still offers it, and that language's requests fail — needs a sync |
| an **endpoint** is renamed | breaks entirely — needs code, not a sync |
| the **target-voice** list changes | needs a sync (it is only read from the config, never refreshed) |

The lazy refreshes fire on focus rather than on mount on purpose: requests are serialised
one at a time, so confirming lists eagerly would put two round trips ahead of whatever the
visitor actually pressed.

Run `npm run sync` before any deploy and the first four rows never come up. If the Space is
asleep at build time the sync fails loudly — the committed manifest is still on disk, so
`npm run build` alone will still produce a working site with slightly stale lists.

The console is lazy-loaded and gated on approaching the viewport, so it stays off the
first-paint path and a visitor who never scrolls never contacts the Space at all. Feedback
(`/_fn*`) is deliberately left unwired — anonymous landing-page traffic would pollute the
Space's rating store; the "Open in the Space" link is the path for people who want to rate.

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
