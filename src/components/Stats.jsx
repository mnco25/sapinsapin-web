import { Reveal, ExternalLink } from './Primitives.jsx'
import { stats, HF_ORG } from '../content.js'

export default function Stats() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="border-y border-ink/10 bg-coconut/40 py-16 sm:py-20 dark:border-coconut/10 dark:bg-coconut/[0.06]"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <h2 id="stats-heading" className="sr-only">
          What has been built so far
        </h2>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="font-display text-4xl leading-none text-ube sm:text-5xl dark:text-ube-bright">
                  {stat.value}
                </p>
                <p className="mt-3 font-medium">{stat.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65 dark:text-coconut/65">
                  {stat.note}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal>
          <p className="mt-12 text-sm text-ink/60 dark:text-coconut/60">
            Counts read from the dataset cards on{' '}
            <ExternalLink
              href={HF_ORG}
              className="underline decoration-ube/40 underline-offset-4 hover:decoration-ube dark:decoration-ube-bright/40 dark:hover:decoration-ube-bright"
            >
              huggingface.co/sapinsapin
            </ExternalLink>
            . They grow as corpora land.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
