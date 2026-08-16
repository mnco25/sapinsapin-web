import { Section, Reveal, ExternalLink, ArrowIcon } from './Primitives.jsx'
import { modelGroups, HF_ORG } from '../content.js'

export default function Models() {
  return (
    <Section
      id="models"
      eyebrow="Models"
      title="Baselines trained on the corpora."
      intro="Proof the data works, and a starting point if you would rather fine-tune than start cold. Every model links back to the dataset it was trained on."
    >
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {modelGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 90} className="h-full">
            <article className="flex h-full flex-col rounded-xl border border-ink/10 bg-cream p-6 dark:border-coconut/12 dark:bg-coconut/[0.03]">
              <h3 className="font-display text-xl">{group.title}</h3>
              <p className="mt-1 text-sm text-ink/60 dark:text-coconut/60">{group.subtitle}</p>

              <ul className="mt-5 divide-y divide-ink/[0.07] dark:divide-coconut/10">
                {group.models.map((model) => (
                  <li key={model.name}>
                    <ExternalLink
                      href={model.href}
                      className="group flex items-baseline justify-between gap-3 py-2.5 hover:text-ube dark:hover:text-ube-bright"
                    >
                      <span className="font-mono text-[0.82rem]">{model.name}</span>
                      <span className="shrink-0 text-right text-xs text-ink/55 dark:text-coconut/55">
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
        <p className="mt-10">
          <ExternalLink
            href={HF_ORG}
            className="inline-flex items-center gap-1.5 font-medium text-ube hover:underline underline-offset-4 dark:text-ube-bright"
          >
            See all 28 models on Hugging Face
            <ArrowIcon />
          </ExternalLink>
        </p>
      </Reveal>
    </Section>
  )
}
