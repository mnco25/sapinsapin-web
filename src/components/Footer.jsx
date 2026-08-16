import { ExternalLink } from './Primitives.jsx'
import { Logomark } from './Header.jsx'
import { HF_ORG, GITHUB_ORG } from '../content.js'

const linkClass =
  'text-ink/70 transition-colors hover:text-ube dark:text-coconut/70 dark:hover:text-ube-bright'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-16 dark:border-coconut/12">
      <div className="mx-auto w-full max-w-page px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight">
              <Logomark className="h-7 w-7" />
              SapinSapin AI
            </p>
            <p className="mt-4 max-w-sm leading-relaxed text-ink/70 dark:text-coconut/70">
              Open speech and text datasets for Philippine languages. Named for the layered rice
              cake — many languages, one stack.
            </p>
          </div>

          <nav aria-labelledby="footer-build">
            <h2 id="footer-build" className="text-sm font-semibold uppercase tracking-wider">
              Build
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <ExternalLink href={HF_ORG} className={linkClass}>
                  Hugging Face org
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={GITHUB_ORG} className={linkClass}>
                  GitHub org
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  href="https://huggingface.co/spaces/sapinsapin/halohalo-dashboard"
                  className={linkClass}
                >
                  Corpus dashboard
                </ExternalLink>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-sm font-semibold uppercase tracking-wider">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#datasets" className={linkClass}>
                  Datasets
                </a>
              </li>
              <li>
                <a href="#models" className={linkClass}>
                  Models
                </a>
              </li>
              <li>
                <a href="#contribute" className={linkClass}>
                  Contribute
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 space-y-4 border-t border-ink/10 pt-8 text-sm leading-relaxed text-ink/65 dark:border-coconut/12 dark:text-coconut/65">
          <p>
            <strong className="font-semibold text-ink/80 dark:text-coconut/80">Licensing.</strong>{' '}
            There is no single blanket licence across this work. Individual corpora carry different
            terms — several of the halo-* text sets and the Filipino Speech Corpus are MIT, the PLD
            corpus is released under its own terms, and the livestream sets are gated. Check the
            licence on each dataset card before you use it, and treat the card as authoritative
            over anything summarised here.
          </p>
          <p>
            <strong className="font-semibold text-ink/80 dark:text-coconut/80">Credit.</strong> The
            Philippine Language Dataset was collected by the{' '}
            <ExternalLink
              href="https://huggingface.co/datasets/sapinsapin/pld"
              className="underline decoration-ink/25 underline-offset-4 hover:decoration-ube dark:decoration-coconut/25 dark:hover:decoration-ube-bright"
            >
              University of the Philippines Diliman Digital Signal Processing Laboratory
            </ExternalLink>
            , which stewards the corpus. BantayWika derives from the Bantay-Wika corpus of the UP
            Sentro ng Wikang Filipino and the UP DSP Laboratory.
          </p>
          <p className="pt-2 text-ink/50 dark:text-coconut/50">sapinsapin.ai — built in the open.</p>
        </div>
      </div>
    </footer>
  )
}
