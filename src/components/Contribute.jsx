import { Section, Reveal, ExternalLink, ArrowIcon } from './Primitives.jsx'
import { contributePaths } from '../content.js'

export default function Contribute() {
  return (
    <Section
      id="contribute"
      eyebrow="How to contribute"
      title="Three ways in."
      intro="This only works as a commons. Whether you have a GPU, an afternoon, or a hard drive of recordings, there is a way to help."
    >
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {contributePaths.map((path, i) => (
          <Reveal key={path.title} delay={i * 90} className="h-full">
            <article className="flex h-full flex-col rounded-xl border border-ink/10 bg-cream p-6 dark:border-coconut/12 dark:bg-coconut/[0.03]">
              <h3 className="font-display text-xl">{path.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-ink/75 dark:text-coconut/75">
                {path.body}
              </p>

              {path.code && (
                <pre className="mt-5 overflow-x-auto rounded-lg bg-ink/[0.05] p-3.5 dark:bg-night-bg/60">
                  <code className="font-mono text-[0.82rem] text-ink/85 dark:text-coconut/85">
                    {path.code}
                  </code>
                </pre>
              )}

              <p className="mt-5">
                <ExternalLink
                  href={path.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ube hover:underline underline-offset-4 dark:text-ube-bright"
                >
                  {path.linkLabel}
                  <ArrowIcon />
                </ExternalLink>
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
