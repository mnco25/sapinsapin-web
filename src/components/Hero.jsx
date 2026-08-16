import { Button, CountUp, ExternalLink } from './Primitives.jsx'
import { HF_ORG, GITHUB_ORG } from '../content.js'

const LANGUAGES = [
  'Filipino',
  'Cebuano',
  'Ilocano',
  'Bikol',
  'Waray',
  'Hiligaynon',
  'Kapampangan',
  'Pangasinan',
  'Tausug',
  'Philippine English',
]

/**
 * An animated waveform whose bars carry the sapin-sapin palette — speech
 * rendered as layers. Heights are deterministic (seeded pattern), the pulse
 * comes from CSS so it costs nothing on the main thread. Decorative only.
 */
function Waveform() {
  const BARS = 56
  const colors = [
    'bg-ube/70 dark:bg-ube-bright/70',
    'bg-pandan/70 dark:bg-pandan-bright/60',
    'bg-coconut dark:bg-coconut/50',
  ]

  return (
    <div aria-hidden="true" className="flex h-20 items-end justify-between gap-[3px] sm:h-28 sm:gap-1">
      {Array.from({ length: BARS }, (_, i) => {
        // Layered sine waves make an organic, symmetric "utterance" shape.
        const t = i / (BARS - 1)
        const envelope = Math.sin(Math.PI * t)
        const detail = 0.55 + 0.45 * Math.sin(i * 1.7) * Math.cos(i * 0.6)
        const height = Math.max(0.08, envelope * detail)
        return (
          <span
            key={i}
            className={`wave-bar w-full rounded-full ${colors[i % 3]}`}
            style={{
              height: `${height * 100}%`,
              '--wave-delay': `${(i % 7) * 0.28}s`,
              '--wave-dur': `${2 + (i % 5) * 0.35}s`,
            }}
          />
        )
      })}
    </div>
  )
}

function StatChip({ value, label, delay }) {
  return (
    <div
      className="hero-enter flex items-baseline gap-2 rounded-full border border-ink/10 bg-white/50 px-4 py-2 backdrop-blur-sm dark:border-coconut/12 dark:bg-white/[0.04]"
      style={{ '--enter-delay': `${delay}ms` }}
    >
      <span className="font-display text-lg font-semibold text-ube dark:text-ube-bright">
        <CountUp value={value} />
      </span>
      <span className="text-sm text-ink/65 dark:text-coconut/65">{label}</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden md:-mt-[73px] md:pt-[73px]">
      {/* Ambient background: dotted paper + drifting warm glows. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-0" />
        <div className="glow-ube glow-drift absolute -top-32 left-[8%] h-[34rem] w-[34rem] rounded-full" />
        <div
          className="glow-pandan glow-drift absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full"
          style={{ animationDelay: '-7s' }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-page flex-col justify-center px-6 pb-10 pt-12 sm:pt-20 md:min-h-[calc(100svh-73px)]">
        <div className="max-w-4xl">
          <p className="hero-enter mb-6 inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/50 py-1.5 pl-2 pr-4 text-sm backdrop-blur-sm dark:border-coconut/12 dark:bg-white/[0.04]">
            <span className="chip bg-ube/10 text-ube dark:bg-ube-bright/15 dark:text-ube-bright">New</span>
            <span className="text-ink/75 dark:text-coconut/75">
              PLD: 448 hours of speech across 10 languages, now on the Hub
            </span>
          </p>

          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight"
          >
            <span className="hero-enter block" style={{ '--enter-delay': '80ms' }}>
              Open AI datasets for
            </span>
            <span className="hero-enter block" style={{ '--enter-delay': '180ms' }}>
              <em className="bg-gradient-to-r from-ube from-30% via-ube via-72% to-pandan-deep bg-clip-text not-italic text-transparent dark:from-ube-bright dark:via-ube-bright dark:to-pandan-bright">
                Philippine languages
              </em>
              .
            </span>
          </h1>

          <p
            className="hero-enter mt-7 max-w-prose text-lg leading-relaxed text-ink/70 sm:text-xl dark:text-coconut/70"
            style={{ '--enter-delay': '280ms' }}
          >
            Almost every speech model on earth is trained on English and ignores the languages tens
            of millions of Filipinos actually speak. We are building the corpora that close the gap
            — and giving them away.
          </p>

          <div
            className="hero-enter mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={{ '--enter-delay': '380ms' }}
          >
            <Button href={HF_ORG}>
              Explore the datasets
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="arrow-nudge h-4 w-4">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Button>
            <Button href={GITHUB_ORG} variant="secondary">
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              Contribute on GitHub
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <StatChip value="513+" label="hours of speech" delay={480} />
            <StatChip value="647,652" label="utterances" delay={540} />
            <StatChip value="10" label="languages" delay={600} />
            <StatChip value="9" label="open datasets" delay={660} />
          </div>
        </div>

        <div className="hero-enter mt-14 sm:mt-16" style={{ '--enter-delay': '560ms' }}>
          <Waveform />
        </div>
      </div>

      {/* Language ribbon — pauses on hover, static under reduced motion. */}
      <div className="relative border-y border-ink/[0.07] bg-white/40 py-4 dark:border-coconut/10 dark:bg-white/[0.02]">
        <p className="sr-only">Languages covered: {LANGUAGES.join(', ')}.</p>
        <div aria-hidden="true" className="marquee overflow-hidden">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {LANGUAGES.map((lang) => (
                  <span key={`${copy}-${lang}`} className="flex items-center">
                    <span className="whitespace-nowrap px-6 font-display text-lg text-ink/55 dark:text-coconut/55">
                      {lang}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-pandan/70 dark:bg-pandan-bright/60" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
