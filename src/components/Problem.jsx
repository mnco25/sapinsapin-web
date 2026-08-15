import { Section, Reveal } from './Primitives.jsx'
import { problems } from '../content.js'

export default function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Most of the Philippines is missing from the training data."
    >
      <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
        {problems.map((item, i) => (
          <Reveal as="li" key={item.number} delay={i * 90}>
            <p className="font-mono text-sm text-ube dark:text-ube-bright">{item.number}</p>
            <h3 className="mt-3 font-display text-xl leading-snug">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-ink/70 dark:text-coconut/70">{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
