import { useEffect, useState } from 'react'
import { ExternalLink } from './Primitives.jsx'
import { HF_ORG } from '../content.js'

const NAV = [
  { href: '#problem', id: 'problem', label: 'Why' },
  { href: '#datasets', id: 'datasets', label: 'Datasets' },
  { href: '#models', id: 'models', label: 'Models' },
  { href: '#contribute', id: 'contribute', label: 'Contribute' },
]

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch (e) {
      /* Private browsing: the toggle still works for this session. */
    }
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-pressed={dark}
      className="rounded-full border border-ink/15 p-2.5 text-ink/70 transition-colors hover:border-ink/35 hover:text-ink dark:border-coconut/20 dark:text-coconut/70 dark:hover:border-coconut/45 dark:hover:text-coconut"
    >
      <span className="sr-only">{dark ? 'Switch to light theme' : 'Switch to dark theme'}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="h-4 w-4"
      >
        {dark ? (
          <path d="M16 11.5A6.5 6.5 0 0 1 8.5 4a6.5 6.5 0 1 0 7.5 7.5Z" />
        ) : (
          <>
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 2v1.5M10 16.5V18M18 10h-1.5M3.5 10H2M15.7 4.3l-1 1M5.3 14.7l-1 1M15.7 15.7l-1-1M5.3 5.3l-1-1" />
          </>
        )}
      </svg>
    </button>
  )
}

/** The three-layer mark, echoing the rice cake the project is named for. */
export function Logomark({ className = 'h-6 w-6' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
      <rect x="2" y="14" width="20" height="5" rx="2.5" className="fill-ube dark:fill-ube-bright" />
      <rect x="4" y="8.5" width="16" height="5" rx="2.5" className="fill-pandan" />
      <rect x="6" y="3" width="12" height="5" rx="2.5" className="fill-coconut" />
    </svg>
  )
}

export default function Header() {
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  // Scroll progress bar + condensed header state.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
        setScrolled(window.scrollY > 24)
        // Inside the hero nothing is "current" — clear any stale highlight.
        if (window.scrollY < window.innerHeight * 0.4) setActive('')
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-ink/10 bg-cream/80 shadow-[0_1px_12px_rgba(26,22,19,0.05)] backdrop-blur-md dark:border-coconut/10 dark:bg-night-bg/80'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <Logomark />
          SapinSapin&nbsp;AI
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-ink/[0.07] bg-white/40 p-1 dark:border-coconut/10 dark:bg-white/[0.03]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`block rounded-full px-4 py-1.5 text-sm transition-colors ${
                    active === item.id
                      ? 'bg-ube text-cream dark:bg-ube-bright dark:text-night-bg'
                      : 'text-ink/70 hover:text-ink dark:text-coconut/70 dark:hover:text-coconut'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ExternalLink
            href={HF_ORG}
            className="hidden items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:border-ink/35 hover:text-ink sm:inline-flex dark:border-coconut/20 dark:text-coconut/80 dark:hover:border-coconut/45 dark:hover:text-coconut"
          >
            <span aria-hidden="true">🤗</span> Hugging&nbsp;Face
          </ExternalLink>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile section nav: same pills, horizontally scrollable. */}
      <nav aria-label="Sections" className="px-6 pb-3 md:hidden">
        <ul className="flex items-center gap-1 overflow-x-auto rounded-full border border-ink/[0.07] bg-white/40 p-1 dark:border-coconut/10 dark:bg-white/[0.03]">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                aria-current={active === item.id ? 'true' : undefined}
                className={`block whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active === item.id
                    ? 'bg-ube text-cream dark:bg-ube-bright dark:text-night-bg'
                    : 'text-ink/70 dark:text-coconut/70'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Scroll progress — decorative. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px]">
        <div
          className="h-full origin-left bg-gradient-to-r from-ube via-pandan to-coconut dark:from-ube-bright dark:via-pandan-bright"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  )
}
