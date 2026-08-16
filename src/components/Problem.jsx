import { Section, Reveal } from './Primitives.jsx'
import { problems } from '../content.js'

export default function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Most of the Philippines is missing from the training data."
    >
      <ol className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {problems.map((item, i) => (
          <Reveal as="li" key={item.number} delay={i * 100} className="h-full">
            <div className="card card-hover relative h-full overflow-hidden p-7">
              {/* Oversized index digit as a quiet backdrop. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-7 font-display text-[7rem] font-semibold leading-none text-ink/[0.05] dark:text-coconut/[0.06]"
              >
                {item.number}
              </span>
              <p className="font-mono text-sm font-medium text-ube dark:text-ube-bright">{item.number}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink/70 dark:text-coconut/70">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
