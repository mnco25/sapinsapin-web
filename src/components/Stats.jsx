import { Reveal, ExternalLink, CountUp } from './Primitives.jsx'
import { stats, HF_ORG } from '../content.js'

export default function Stats() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="relative overflow-hidden border-y border-ink/10 bg-coconut/40 py-20 sm:py-24 dark:border-coconut/10 dark:bg-coconut/[0.05]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="glow-ube absolute -left-24 top-0 h-80 w-80 rounded-full" />
        <div className="glow-pandan absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      </div>

      <div className="relative mx-auto w-full max-w-page px-6">
        <h2 id="stats-heading" className="sr-only">
          What has been built so far
        </h2>

        <dl className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-ink/10 lg:dark:divide-coconut/10">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90} className="lg:px-10 lg:first:pl-0 lg:last:pr-0">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="font-display text-[clamp(2.75rem,4.5vw,4rem)] font-semibold leading-none tracking-tight text-ube dark:text-ube-bright">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-4 font-medium">{stat.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60 dark:text-coconut/60">
                  {stat.note}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal>
          <p className="mt-14 text-sm text-ink/60 dark:text-coconut/60">
            Counts read from the dataset cards on{' '}
            <ExternalLink
              href={HF_ORG}
              className="font-medium underline decoration-ube/40 underline-offset-4 transition-colors hover:decoration-ube dark:decoration-ube-bright/40 dark:hover:decoration-ube-bright"
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
