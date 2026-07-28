import { ArrowUp } from 'lucide-react'

import { handleSectionAnchorClick } from '@/components/landing/landingSectionNav'
import { CQLogo } from '@/components/landing/shared/CQLogo'
import { LANDING_FOOTER_LINKS } from '@/data/landingContent'

type LandingFooterProps = {
  onStartQuest: () => void
  onHome?: () => void
}

export function LandingFooter({ onStartQuest, onHome }: LandingFooterProps) {
  return (
    <footer className="landing-footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        CodeQuest site footer
      </h2>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
          <div className="max-w-[52ch]">
            <div className="mb-4 flex items-center gap-3">
              <CQLogo size="sm" />
              <span className="landing-h3">CodeQuest</span>
            </div>
            <p className="landing-copy">
              CodeQuest helps students learn, practise, build and prepare for real
              opportunities—without losing the path between them.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 sm:flex-col sm:gap-y-2.5">
              {LANDING_FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={`#${link.target}`}
                    onClick={handleSectionAnchorClick}
                    className="landing-footer-link inline-flex min-h-[2.25rem] items-center"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onStartQuest}
                  className="landing-footer-link inline-flex min-h-[2.25rem] items-center"
                >
                  Login
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="landing-rule mt-10 flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="landing-footer-note text-sm">© 2026 CodeQuest. All rights reserved.</p>
          <button
            type="button"
            onClick={onHome}
            className="landing-footer-link inline-flex min-h-[2.25rem] items-center gap-2 self-start sm:self-auto"
          >
            Back to top
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
