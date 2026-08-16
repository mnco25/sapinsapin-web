import { Section, Reveal, ExternalLink, ArrowIcon } from './Primitives.jsx'
import { modelGroups, HF_ORG } from '../content.js'

const GROUP_ICONS = {
  'Speech recognition': (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="7" y="2.5" width="6" height="10" rx="3" />
      <path d="M4 9.5a6 6 0 0 0 12 0M10 15.5v2.5M7 18h6" />
    </svg>
  ),
  'Speech synthesis': (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 8v4h3l4 3.5v-11L6 8H3Z" />
      <path d="M13 7a4 4 0 0 1 0 6M15.5 4.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  ),
  'Language models': (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M10 2.5c4.14 0 7.5 2.91 7.5 6.5s-3.36 6.5-7.5 6.5c-.77 0-1.51-.1-2.2-.29L4 17l1.08-3.24C3.5 12.6 2.5 10.9 2.5 9c0-3.59 3.36-6.5 7.5-6.5Z" />
    </svg>
  ),
}

export default function Models() {
  return (
    <Section
      id="models"
      eyebrow="Models"
      title="Baselines trained on the corpora."
      intro="Proof the data works, and a starting point if you would rather fine-tune than start cold. Every model links back to the dataset it was trained on."
    >
      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {modelGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 100} className="h-full">
            <article className="card card-hover flex h-full flex-col p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ube/10 text-ube dark:bg-ube-bright/15 dark:text-ube-bright">
                  {GROUP_ICONS[group.title]}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{group.title}</h3>
                  <p className="text-sm text-ink/55 dark:text-coconut/55">{group.subtitle}</p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-ink/[0.06] dark:divide-coconut/[0.08]">
                {group.models.map((model) => (
                  <li key={model.name}>
                    <ExternalLink
                      href={model.href}
                      className="group -mx-2 flex items-baseline justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-ube/[0.06] hover:text-ube dark:hover:bg-ube-bright/[0.08] dark:hover:text-ube-bright"
                    >
                      <span className="font-mono text-[0.82rem]">{model.name}</span>
                      <span className="shrink-0 text-right text-xs text-ink/50 dark:text-coconut/50">
                        {model.note}
                      </span>
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-12">
          <ExternalLink
            href={HF_ORG}
            className="group inline-flex items-center gap-1.5 font-semibold text-ube underline-offset-4 hover:underline dark:text-ube-bright"
          >
            See all 28 models on Hugging Face
            <ArrowIcon />
          </ExternalLink>
        </p>
      </Reveal>
    </Section>
  )
}
