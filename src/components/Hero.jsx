import { Button, Reveal } from './Primitives.jsx'
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
]

/**
 * Stacked bands standing in for the layers of a sapin-sapin — the page's only
 * real ornament, and the closest thing it has to a hero image.
 */
function LayerStack() {
  const bands = [
    { color: 'bg-ube/85 dark:bg-ube-bright/80', height: 'h-16 sm:h-20', width: 'w-full' },
    { color: 'bg-pandan/75 dark:bg-pandan-bright/65', height: 'h-12 sm:h-16', width: 'w-[88%]' },
    { color: 'bg-coconut dark:bg-coconut/80', height: 'h-9 sm:h-12', width: 'w-[74%]' },
  ]

  return (
    <div aria-hidden="true" className="flex flex-col items-end gap-2">
      {bands.map((band, i) => (
        <div key={i} className={`rounded-l-xl rounded-r-sm ${band.color} ${band.height} ${band.width}`} />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="pb-16 pt-16 sm:pb-24 sm:pt-24">
      <div className="mx-auto grid w-full max-w-page grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <Reveal>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-pandan-deep dark:text-pandan-bright">
            Philippine sovereign AI
          </p>

          <h1
            id="hero-heading"
            className="font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl"
          >
            Open AI datasets for{' '}
            <span className="text-ube dark:text-ube-bright">Philippine languages</span>.
          </h1>

          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/70 sm:text-xl dark:text-coconut/70">
            Almost every speech model on earth is trained on English and ignores the languages
            tens of millions of Filipinos actually speak — so we are building the corpora that
            close the gap, and giving them away.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href={HF_ORG}>Explore the datasets</Button>
            <Button href={GITHUB_ORG} variant="secondary">
              Contribute on GitHub
            </Button>
          </div>

          <p className="mt-10 text-sm leading-relaxed text-ink/60 dark:text-coconut/60">
            {LANGUAGES.join(' · ')}
          </p>
        </Reveal>

        <Reveal delay={120} className="hidden lg:block">
          <LayerStack />
        </Reveal>
      </div>
    </section>
  )
}
