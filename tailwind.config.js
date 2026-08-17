/** @type {import('tailwindcss').Config} */

// Colours resolve through CSS variables so every existing utility — including
// alpha variants like `text-ink/65` — follows the active theme without any
// `dark:` prefixes in the markup. The variables hold space-separated RGB
// channels, which is what `<alpha-value>` needs to slot into.
const themed = (variable) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(${variable}))`
    : `rgb(var(${variable}) / ${opacityValue})`

export default {
  content: ['./index.html', './404.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tailwind only emits a colour-opacity modifier when the value exists in
      // this scale. The default scale skips most integers, so utilities like
      // `text-ink/68` silently produced no rule at all and the element fell
      // back to inheriting full-strength colour. Every integer is defined here
      // so the alphas in the markup mean what they say; JIT still only emits
      // the ones actually used.
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, step) => [step, String(step / 100)])),
      colors: {
        ink: themed('--c-ink'),
        paper: themed('--c-paper'),
        ube: themed('--c-ube'),
        pandan: themed('--c-pandan'),
        cream: themed('--c-cream'),
        surface: themed('--c-surface'),
        line: themed('--c-line'),
      },
      // The `… Fallback` faces are declared in index.css: local Georgia and
      // Arial re-cut to the webfonts' metrics, so the swap when the real
      // faces arrive does not reflow the page.
      fontFamily: {
        display: ['Fraunces', 'Fraunces Fallback', 'Georgia', 'serif'],
        sans: ['Inter', 'Inter Fallback', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
