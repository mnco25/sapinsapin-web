import { useEffect, useState } from 'react'
import { ExternalLink } from './Primitives.jsx'
import { HF_ORG } from '../content.js'

const NAV = [
  { href: '#problem', label: 'The problem' },
  { href: '#datasets', label: 'Datasets' },
  { href: '#models', label: 'Models' },
  { href: '#contribute', label: 'Contribute' },
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
      className="rounded-full border border-ink/15 p-2 text-ink/70 transition-colors hover:border-ink/35 hover:text-ink dark:border-coconut/20 dark:text-coconut/70 dark:hover:border-coconut/45 dark:hover:text-coconut"
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
function Logomark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
      <rect x="2" y="14" width="20" height="5" rx="2.5" className="fill-ube dark:fill-ube-bright" />
      <rect x="4" y="8.5" width="16" height="5" rx="2.5" className="fill-pandan" />
      <rect x="6" y="3" width="12" height="5" rx="2.5" className="fill-coconut" />
    </svg>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-sm dark:border-coconut/10 dark:bg-night-bg/85">
      <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <Logomark />
          SapinSapin&nbsp;AI
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink/70 transition-colors hover:text-ube dark:text-coconut/70 dark:hover:text-ube-bright"
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
            className="hidden text-sm text-ink/70 transition-colors hover:text-ube sm:inline dark:text-coconut/70 dark:hover:text-ube-bright"
          >
            Hugging&nbsp;Face
          </ExternalLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
