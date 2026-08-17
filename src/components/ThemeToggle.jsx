import { Moon, Sun } from './Icons'

/* Shared by both page roots — the homepage nav and the 404 nav. The crossfade
   between the two faces is in index.css, keyed off [data-theme]. */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return <button
    type="button"
    className="theme-toggle"
    onClick={onToggle}
    aria-pressed={isDark}
    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
  >
    <Sun className="theme-sun h-[1.05rem] w-[1.05rem]" />
    <Moon className="theme-moon h-[1.05rem] w-[1.05rem]" />
  </button>
}
