# SapinSapin AI homepage

A static React + Vite + Tailwind homepage for SapinSapin AI, designed as a calm, research-first public face for Philippine-language AI.

## Run locally

```bash
npm install
npm run dev
```

Build the static production bundle with:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Import this folder as a new Vercel project.
2. Vercel detects Vite automatically. Use `npm run build` as the build command and `dist` as the output directory.
3. Set `sapinsapin.ai` as the production domain.
4. Before publishing, update the catalog snapshot in `src/data/catalog.js` and the visible date in the page footer.

No server, authentication, database, or environment variables are required.

## Architecture

```
src/
  components/
    HeroVisual.jsx     Abstract, inline-SVG language network
    Icons.jsx          Tiny inline SVG icon set
  data/
    catalog.js         Deliberately static, verified Hub snapshot
  App.jsx              Semantic page sections and content
  index.css            Tailwind layers plus the design system
```

The site uses an inline SVG visual rather than images or a canvas. That keeps the hero crisp, lightweight, and free of stock/AI imagery. CSS supplies the low-cost motion; the reduced-motion media query disables it for visitors who request it.

## Content verification

Catalog facts were verified from the public SapinSapin Hugging Face organization and public dataset/model cards on **16 August 2026**. This was a snapshot, not a live API fetch, on purpose: the homepage remains fast, predictable, and deployable without a backend.

Verified headline counts:

- 513.3 speech hours = 448.2 h in `sapinsapin/pld` + 65.1 h in `sapinsapin/filipinospeechcorpus`.
- 639,514 utterances/segments = 334,268 in PLD + 305,246 in Filipino Speech Corpus.
- 10 Philippine languages in PLD.
- 9 non-private datasets and 28 non-private models returned by the Hugging Face Hub API at the time of verification.

The catalog deliberately lists all nine datasets returned as non-private, including the two access-controlled livestream datasets. The `halo-livestream` display name maps to the Hub repository `sapinsapin/kumu-livestream-segmented`.

### Remaining `{{VERIFY}}` values

These values are visible on the website exactly as `{{VERIFY}}` rather than being inferred:

| Location | Unverified item | Why |
| --- | --- | --- |
| `kumu-livestream-segmented` | size and license | The dataset is access-controlled and its public Hub metadata does not provide these fields. |
| `kumu-livestream-raw` | size and license | The dataset is access-controlled and its public Hub metadata does not provide these fields. |
| `BantayWika`, `halohalo`, `halo-bcl` | license | No license was supplied in the public Hub card metadata inspected for this snapshot. |
| `qwen3vl-balitanlp-news-writer` | task and training dataset | Neither was supplied in the public Hub API metadata inspected for this snapshot. |
| `llama31-8b-balitanlp-IT` | task | It had no public `pipeline_tag` in the inspected Hub metadata. |

Resolve each placeholder against the linked Hub card before a release that requires complete metadata. Do not replace a placeholder by guessing from a name, tag, or related model.

## Design rationale

The visual system borrows the SapinSapin idea at an abstract level: thin stacked rules, restrained layered topography, and quietly nested cards. Deep ube establishes research-grade character; pandan is a sparse signal of growth. The editorial display face makes the mission feel human, while the compact sans-serif carries technical detail. Generous blank space and content-dense catalog cards keep the story confident without drifting into generic AI visual language.

## Accessibility and performance notes

- Semantic landmarks, a visible keyboard focus treatment, link labels, native FAQ disclosure controls, and a mobile navigation disclosure are included.
- Every animated element honors `prefers-reduced-motion`.
- The page contains no animation library, image payload, tracking script, or client-side data fetch.
- `robots.txt`, `sitemap.xml`, canonical metadata, Open Graph/Twitter metadata, Organization JSON-LD, and DataCatalog/Dataset JSON-LD are included.

Run Lighthouse against the deployed URL before launch. Scores depend on Vercel configuration, live font delivery, and any later integrations; the implementation is designed to support the requested 95+ targets, not to claim a score that has not been measured on production.
