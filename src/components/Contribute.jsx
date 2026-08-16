import { Section, Reveal, ExternalLink, ArrowIcon, CopyButton } from './Primitives.jsx'
import { contributePaths } from '../content.js'

/** Terminal-style code block, dark in both themes for contrast and familiarity. */
function CodeBlock({ code }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-ink/20 bg-[#211A2E] dark:border-coconut/15">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[0.85rem] leading-relaxed text-coconut">
          <span className="text-pandan-bright">from</span> datasets{' '}
          <span className="text-pandan-bright">import</span> load_dataset{'\n\n'}
          ds = <span className="text-ube-bright">load_dataset</span>(
          <span className="text-coconut/80">"sapinsapin/pld"</span>)
        </code>
      </pre>
    </div>
  )
}

export default function Contribute() {
  return (
    <Section
      id="contribute"
      eyebrow="How to contribute"
      title="Three ways in."
      intro="This only works as a commons. Whether you have a GPU, an afternoon, or a hard drive of recordings, there is a way to help."
    >
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {contributePaths.map((path, i) => (
          <Reveal key={path.title} delay={i * 100} className="h-full">
            <article className="card card-hover flex h-full flex-col p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ube/25 font-display text-lg font-semibold text-ube dark:border-ube-bright/30 dark:text-ube-bright">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{path.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-ink/75 dark:text-coconut/75">
                {path.body}
              </p>

              {path.code && <CodeBlock code={`from datasets import load_dataset\n\nds = load_dataset("sapinsapin/pld")`} />}

              <p className="mt-6">
                <ExternalLink
                  href={path.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ube underline-offset-4 hover:underline dark:text-ube-bright"
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
