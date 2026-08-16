import { Section, Reveal, ExternalLink, ArrowIcon } from './Primitives.jsx'
import { datasets } from '../content.js'

function DatasetCard({ dataset }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-ink/10 bg-cream p-6 transition-colors hover:border-ube/40 dark:border-coconut/12 dark:bg-coconut/[0.03] dark:hover:border-ube-bright/40">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-ube/10 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-ube dark:bg-ube-bright/15 dark:text-ube-bright">
          {dataset.kind}
        </span>
        {dataset.gated && (
          <span className="rounded-full bg-ink/[0.06] px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-ink/60 dark:bg-coconut/10 dark:text-coconut/60">
            Gated
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl leading-snug">
        <ExternalLink href={dataset.href} className="hover:text-ube dark:hover:text-ube-bright">
          {dataset.name}
          {/* Stretch the link across the card so the whole thing is clickable. */}
          <span className="absolute inset-0" aria-hidden="true" />
        </ExternalLink>
      </h3>
      <p className="mt-0.5 text-sm text-ink/60 dark:text-coconut/60">{dataset.title}</p>

      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/75 dark:text-coconut/75">
        {dataset.description}
      </p>

      <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-5 text-sm dark:border-coconut/12">
        <div>
          <dt className="sr-only">Languages</dt>
          <dd className="flex flex-wrap gap-1.5">
            {dataset.languages.map((lang) => (
              <span
                key={lang}
                className="rounded-md bg-pandan/15 px-2 py-0.5 text-[0.8rem] text-pandan-deep dark:bg-pandan-bright/15 dark:text-pandan-bright"
              >
                {lang}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-ink/50 dark:text-coconut/50">Size</dt>
          <dd className="text-ink/75 dark:text-coconut/75">{dataset.size}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-ink/50 dark:text-coconut/50">License</dt>
          <dd className="text-ink/75 dark:text-coconut/75">{dataset.license}</dd>
        </div>
      </dl>

      <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ube dark:text-ube-bright">
        View on Hugging Face
        <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
      </p>
    </article>
  )
}

export default function Datasets() {
  return (
    <Section
      id="datasets"
      eyebrow="Datasets"
      title="Nine corpora, all on the Hub."
      intro="Speech and text, streamable as Parquet, each with its own card documenting provenance and licence. Start with pld if you want scale, or filipinospeechcorpus if you want studio-clean Filipino."
    >
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {datasets.map((dataset, i) => (
          <Reveal key={dataset.name} delay={(i % 3) * 80} className="relative h-full">
            <DatasetCard dataset={dataset} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
