# sapinsapin.ai

Landing page for **SapinSapin AI** — a Philippine sovereign-AI initiative building open
speech and text datasets for Philippine languages.

Single-page React + Vite + Tailwind. No backend, no auth, no database, no tracking.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build locally
```

## Deploying to Vercel

Import the repo; `vercel.json` already sets the framework, build command and output
directory. No environment variables are required.

The one manual step: `public/og.png` is referenced by absolute URL
(`https://sapinsapin.ai/og.png`) in `index.html`, because link-preview scrapers do not
resolve relative paths. If the site is served from a different domain, update the
`og:image` and `twitter:image` tags to match.

## Where the content lives

All copy, figures, dataset entries and model links are in **`src/content.js`**. The
components render that data and nothing else, so updating the site after a new corpus
lands means editing one file.

## Figures still needing confirmation

Every number on the page was read off the live Hugging Face cards on **15 Aug 2026**.
The remaining `{{VERIFY}}` placeholders are all licences, not counts:

| Placeholder | Where | What is needed |
|---|---|---|
| `{{VERIFY}} — no license on card` | `halohalo` dataset card | The card carries no `license:` tag. Confirm the intended licence and set it in `src/content.js`, then add it to the HF card. |
| `{{VERIFY}} — no license on card` | `BantayWika` dataset card | No `license:` tag. Derived from the UP-SWF / UP DSP Bantay-Wika corpus, so the upstream terms likely govern — confirm before stating one. |
| `{{VERIFY}} — no license on card` | `halo-bcl` dataset card | No `license:` tag, unlike its siblings `halo-tgl` and `halo-hil`, which are both MIT. Likely MIT too, but unconfirmed. |

### Figures that are confirmed, but will drift

These are correct as of the date above and are worth re-checking whenever the org grows:

- **513+ hours** — 448.2 (pld) + 65.1 (filipinospeechcorpus) + ~0.12 (halo-livestream).
- **647,652 utterances** — 334,268 (pld) + 313,322 (filipinospeechcorpus) + 62 (halo-livestream).
- **10 languages** — the pld card's ten: Bikol, Cebuano, Philippine English, Filipino,
  Hiligaynon, Ilocano, Pangasinan, Kapampangan, Tausug, Waray. Nine Philippine languages
  plus English; the stat is labelled "Languages covered" rather than "Philippine
  languages" for that reason.
- **9 public datasets** — including the two gated `kumu-livestream-*` sets, which are
  listed publicly but require an access request. Both are labelled "Gated" on the page.
- **28 models** — hardcoded in the "See all 28 models" link in `src/components/Models.jsx`.

Two speech corpora are also excluded from the hours/utterance totals on purpose:
`kumu-livestream-raw` is the unsegmented source audio behind `halo-livestream`, so
counting it would double-count.

## Notes on the build

- **Fonts.** One web family (Fraunces, for display) loaded from Google Fonts; body text
  uses the system sans stack. Total JS is ~57 kB gzipped — all motion and interactivity
  (waveform, count-ups, marquee, filters, scroll-spy nav) is hand-rolled CSS/JS with no
  animation libraries.
- **Licensing copy.** The footer states explicitly that the corpora carry *different*
  licences rather than implying one blanket licence, and each dataset card shows its own.
- **Accessibility.** Semantic landmarks, a skip link, labelled sections, visible focus
  rings, and alt/`aria-hidden` handling on the decorative layer motifs. The base ube and
  pandan accents do not clear WCAG AA at body-text sizes, so `pandan-deep` and
  `ube-bright` variants (in `tailwind.config.js`) are used for text; the base tones are
  reserved for large type and decoration.
- **Motion.** Staggered hero entrance, an animated waveform in the brand palette, a
  language marquee (pauses on hover), count-up statistics, scroll-triggered section
  reveals, and card hover lifts. Every one of them is disabled or neutralised under
  `prefers-reduced-motion`, and the marquee content is duplicated `aria-hidden` with a
  screen-reader-only language list alongside.
- **Dark mode.** Follows the system setting, with a manual toggle in the header persisted
  to `localStorage`. An inline script in `index.html` applies the theme before first
  paint to avoid a flash.
- **External links.** All outbound links go through the `ExternalLink` component, which
  sets `target="_blank"` and `rel="noopener noreferrer"` in one place.

## Regenerating the OG image

`public/og.png` was rendered from an HTML template at 1200×630. It is a static asset —
if the headline or the stats change, re-render it so the link preview does not go stale.
