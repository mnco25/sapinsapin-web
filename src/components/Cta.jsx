import { Reveal, Button } from './Primitives.jsx'
import { HF_ORG, GITHUB_ORG } from '../content.js'

/** Closing beat: an inverted, ube-washed panel that mirrors the hero. */
export default function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="px-6 pb-24 pt-4 sm:pb-32">
      <Reveal className="mx-auto w-full max-w-page">
        <div className="relative overflow-hidden rounded-3xl bg-ube px-8 py-16 text-center text-cream sm:px-16 sm:py-24 dark:bg-ube-deep">
          {/* Layer strata echo, drawn in light on the dark panel. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/[0.07] blur-2xl" />
            <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-pandan/25 blur-2xl" />
            <div className="absolute inset-x-12 bottom-8 flex flex-col items-center gap-[5px] opacity-25">
              <div className="h-[3px] w-3/5 rounded-full bg-coconut" />
              <div className="h-[3px] w-2/5 rounded-full bg-pandan-bright" />
              <div className="h-[3px] w-1/4 rounded-full bg-cream" />
            </div>
          </div>

          <h2
            id="cta-heading"
            className="relative mx-auto max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight"
          >
            Build something in your language.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/80">
            Every corpus streams straight from the Hub — no sign-up, no gatekeeping. One line of
            Python and you are training.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={HF_ORG}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-cream text-ube hover:bg-white"
            >
              Explore the datasets
            </a>
            <a
              href={GITHUB_ORG}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-cream/40 text-cream hover:border-cream hover:bg-white/10"
            >
              Contribute on GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
