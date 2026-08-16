import { useEffect, useRef, useState } from 'react'

/** Every outbound link on this page goes through here, so the rel never drifts. */
export function ExternalLink({ href, children, className = '', ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  )
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
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
 * Counts from 0 to a target once the element scrolls into view.
 * Accepts strings like "513+", "647,652" — the numeric core animates,
 * separators and suffixes are preserved. Reduced motion skips straight
 * to the final value.
 */
export function CountUp({ value, duration = 1600, className = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const match = String(value).match(/^([\d,]+)(.*)$/)
    if (!match || reduced || typeof IntersectionObserver === 'undefined') {
      setDisplay(value)
      return
    }

    const target = parseInt(match[1].replace(/,/g, ''), 10)
    const suffix = match[2] || ''
    const hasSeparators = match[1].includes(',')
    const node = ref.current
    if (!node || Number.isNaN(target)) return

    setDisplay(`0${suffix}`)

    let raf
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 4)
          const current = Math.round(target * eased)
          const text = hasSeparators ? current.toLocaleString('en-US') : String(current)
          setDisplay(`${text}${suffix}`)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [value, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

/**
 * The sapin-sapin motif: stacked strata of colour, thinning as they rise.
 * Decorative only — hidden from assistive tech.
 */
export function LayerDivider({ className = '' }) {
  const layers = [
    'bg-ube/30 dark:bg-ube-bright/35',
    'bg-pandan/35 dark:bg-pandan-bright/30',
    'bg-coconut dark:bg-coconut/25',
  ]

  return (
    <div aria-hidden="true" className={`mx-auto w-full max-w-page px-6 ${className}`}>
      <div className="flex flex-col gap-[3px]">
        {layers.map((layer, i) => (
          <div
            key={i}
            className={`h-[3px] rounded-full ${layer}`}
            style={{ width: `${100 - i * 18}%` }}
          />
        ))}
      </div>
    </div>
  )
}

/** Section wrapper: consistent rhythm and a labelled landmark for screen readers. */
export function Section({ id, title, eyebrow, intro, children, className = '' }) {
  const headingId = `${id}-heading`

  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-24 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-page px-6">
        <Reveal>
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h2
            id={headingId}
            className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight"
          >
            {title}
          </h2>
          {intro && (
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/70 dark:text-coconut/70">
              {intro}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export function Button({ href, variant = 'primary', children }) {
  return (
    <ExternalLink href={href} className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}>
      {children}
    </ExternalLink>
  )
}

/** Small arrow; decorative, the link text carries meaning. */
export function ArrowIcon({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`arrow-nudge h-4 w-4 ${className}`}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

/** Copies text to the clipboard with visible confirmation. */
export function CopyButton({ text, label = 'Copy code' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      /* Clipboard unavailable (http, permissions) — button simply does nothing. */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      className="inline-flex items-center gap-1.5 rounded-md border border-coconut/20 px-2.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-coconut/70 transition-colors hover:border-coconut/45 hover:text-coconut"
    >
      {copied ? (
        <>
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-pandan-bright">
            <path d="M3 8.5l3.5 3.5L13 4.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5v5A1.5 1.5 0 0 0 4 10h1.5" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}
