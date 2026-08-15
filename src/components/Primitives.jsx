import { useEffect, useRef, useState } from 'react'

/** Every outbound link on this page goes through here, so the rel never drifts. */
export function ExternalLink({ href, children, className = '', ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  )
}

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Reduced-motion users get the finished state immediately — the CSS neutralises
 * the transition, and we still add the class so nothing stays invisible.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * The sapin-sapin motif: stacked strata of colour, thinning as they rise.
 * Decorative only — hidden from assistive tech.
 */
export function LayerDivider({ className = '' }) {
  const layers = [
    'bg-ube/25 dark:bg-ube-bright/30',
    'bg-pandan/30 dark:bg-pandan-bright/25',
    'bg-coconut dark:bg-coconut/25',
  ]

  return (
    <div aria-hidden="true" className={`mx-auto w-full max-w-page px-6 ${className}`}>
      <div className="flex flex-col gap-[3px]">
        {layers.map((layer, i) => (
          <div key={i} className={`h-[3px] rounded-full ${layer}`} style={{ width: `${100 - i * 18}%` }} />
        ))}
      </div>
    </div>
  )
}

/** Section wrapper: consistent rhythm and a labelled landmark for screen readers. */
export function Section({ id, title, eyebrow, intro, children, className = '' }) {
  const headingId = `${id}-heading`

  return (
    <section id={id} aria-labelledby={headingId} className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-page px-6">
        <Reveal>
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-pandan-deep dark:text-pandan-bright">
              {eyebrow}
            </p>
          )}
          <h2
            id={headingId}
            className="font-display text-3xl leading-tight sm:text-4xl md:text-[2.75rem]"
          >
            {title}
          </h2>
          {intro && (
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink/70 dark:text-coconut/70">
              {intro}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/** Shared button shape for the two hero CTAs and anything else that needs it. */
export function Button({ href, variant = 'primary', children }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-colors'
  const variants = {
    primary:
      'bg-ube text-cream hover:bg-ube/90 dark:bg-ube-bright dark:text-night-bg dark:hover:bg-ube-bright/90',
    secondary:
      'border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/5 dark:border-coconut/25 dark:text-coconut dark:hover:border-coconut/50 dark:hover:bg-coconut/10',
  }

  return (
    <ExternalLink href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </ExternalLink>
  )
}

/** Small arrow that nudges on hover; decorative, the link text carries meaning. */
export function ArrowIcon({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${className}`}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
