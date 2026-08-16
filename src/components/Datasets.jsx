import { useState } from 'react'
import { Section, Reveal, ExternalLink, ArrowIcon } from './Primitives.jsx'
import { datasets } from '../content.js'

const FILTERS = ['All', 'Speech', 'Text']

function KindIcon({ kind }) {
  if (kind === 'Speech') {
    return (
      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-3.5 w-3.5">
        <path d="M2 6.5v3M5 4v8M8 2v12M11 4.5v7M14 6.5v3" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-3.5 w-3.5">
      <path d="M2.5 3.5h11M2.5 6.5h11M2.5 9.5h7M2.5 12.5h9" />
    </svg>
  )
}

function DatasetCard({ dataset }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-6">
      {/* Kind-coloured accent stratum along the top edge. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          dataset.kind === 'Speech'
            ? 'bg-gradient-to-r from-ube to-ube/30 dark:from-ube-bright dark:to-ube-bright/30'
            : 'bg-gradient-to-r from-pandan to-pandan/30 dark:from-pandan-bright dark:to-pandan-bright/30'
        }`}
      />

      <div className="flex items-center gap-2">
        <span
          className={`chip gap-1.5 ${
            dataset.kind === 'Speech'
              ? 'bg-ube/10 text-ube dark:bg-ube-bright/15 dark:text-ube-bright'
              : 'bg-pandan/15 text-pandan-deep dark:bg-pandan-bright/15 dark:text-pandan-bright'
          }`}
        >
          <KindIcon kind={dataset.kind} />
          {dataset.kind}
        </span>
        {dataset.gated && (
          <span className="chip gap-1 bg-ink/[0.06] text-ink/60 dark:bg-coconut/10 dark:text-coconut/60">
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            Gated
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-2xl font-semibold leading-snug tracking-tight">
        <ExternalLink
          href={dataset.href}
          className="transition-colors group-hover:text-ube dark:group-hover:text-ube-bright"
        >
          {dataset.name}
          {/* Stretch the link across the card so the whole thing is clickable. */}
          <span className="absolute inset-0" aria-hidden="true" />
        </ExternalLink>
      </h3>
      <p className="mt-0.5 text-sm text-ink/55 dark:text-coconut/55">{dataset.title}</p>

      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/75 dark:text-coconut/75">
        {dataset.description}
      </p>

      <dl className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-sm dark:border-coconut/12">
        <div>
          <dt className="sr-only">Languages</dt>
          <dd className="flex flex-wrap gap-1.5">
            {dataset.languages.map((lang) => (
              <span
                key={lang}
                className="rounded-md bg-ink/[0.05] px-2 py-0.5 text-[0.8rem] text-ink/70 dark:bg-coconut/[0.08] dark:text-coconut/70"
              >
                {lang}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-ink/50 dark:text-coconut/50">Size</dt>
          <dd className="font-medium text-ink/80 dark:text-coconut/80">{dataset.size}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-ink/50 dark:text-coconut/50">License</dt>
          <dd className="text-ink/75 dark:text-coconut/75">{dataset.license}</dd>
        </div>
      </dl>

      <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ube dark:text-ube-bright">
        View on Hugging Face
        <ArrowIcon />
      </p>
    </article>
  )
}

export default function Datasets() {
  const [filter, setFilter] = useState('All')
  const shown = datasets.filter((d) => filter === 'All' || d.kind === filter)

  return (
    <Section
      id="datasets"
      eyebrow="Datasets"
      title="Nine corpora, all on the Hub."
      intro="Speech and text, streamable as Parquet, each with its own card documenting provenance and licence. Start with pld if you want scale, or filipinospeechcorpus if you want studio-clean Filipino."
    >
      <Reveal>
        <div
          role="group"
          aria-label="Filter datasets by type"
          className="mt-10 inline-flex rounded-full border border-ink/10 bg-white/50 p-1 dark:border-coconut/12 dark:bg-white/[0.03]"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-ube text-cream dark:bg-ube-bright dark:text-night-bg'
                  : 'text-ink/65 hover:text-ink dark:text-coconut/65 dark:hover:text-coconut'
              }`}
            >
              {f}
              <span className="ml-1.5 font-mono text-xs opacity-60">
                {f === 'All' ? datasets.length : datasets.filter((d) => d.kind === f).length}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((dataset, i) => (
          <Reveal key={dataset.name} delay={(i % 3) * 80} className="relative h-full">
            <DatasetCard dataset={dataset} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
