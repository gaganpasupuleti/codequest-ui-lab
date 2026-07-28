import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import { LandingCtaButton, LandingCtaLink } from '@/components/landing/LandingCtaButton'
import { LandingMeter } from '@/components/landing/shared/LandingMeter'
import {
  CAREER_PROGRESS_DEMO,
  INTRO_MODULES,
  LANDING_SECTION_IDS,
} from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

export function IntroSection({ onStartQuest }: { onStartQuest: () => void }) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const preview = root.querySelector('[data-intro-preview]')
      const tiles = gsap.utils.toArray<HTMLElement>('[data-intro-tile]', root)
      const fills = gsap.utils.toArray<HTMLElement>('[data-meter-fill]', root)

      if (preview) {
        gsap.from(preview, {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: preview, start: 'top 88%', toggleActions: 'play none none none' },
        })
      }

      if (tiles.length) {
        gsap.from(tiles, {
          autoAlpha: 0,
          y: 16,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: tiles[0], start: 'top 92%', toggleActions: 'play none none none' },
        })
      }

      // Reveal only — the meter's final width lives in CSS, so reduced motion needs no fallback.
      fills.forEach((fill) => {
        gsap.from(fill, {
          scaleX: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: fill, start: 'top 95%', toggleActions: 'play none none none' },
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.intro}
      className="landing-surface-paper-deep relative"
      aria-labelledby="intro-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="landing-label landing-label--offset mb-5">
            Learning. Practising. Preparing. Applying!!
          </p>

          <h2 id="intro-heading" className="landing-h2 mb-5 max-w-[20ch]">
            Introducing CodeQuest
          </h2>

          <p className="landing-lede mb-8 max-w-[56ch]">
            CodeQuest is a guided student platform that connects classes, practice, projects,
            progress, resumes and jobs. Stop guessing what to learn next. Follow one path from your
            first lesson to your first serious opportunity.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingCtaButton size="lg" tone="primary" onClick={onStartQuest}>
              Enter CodeQuest
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LandingCtaButton>
            <LandingCtaLink size="lg" tone="ghost" href={`#${LANDING_SECTION_IDS.journey}`}>
              Explore the Journey
            </LandingCtaLink>
          </div>
        </div>

        <div data-intro-preview className="landing-card landing-card--raised overflow-hidden">
          <div className="landing-preview-chrome flex items-center gap-2 px-4 py-3">
            <span className="landing-preview-dot bg-[color:var(--landing-flare)]" aria-hidden="true" />
            <span className="landing-preview-dot bg-[color:var(--landing-blue)]" aria-hidden="true" />
            <span className="landing-preview-dot" aria-hidden="true" />
            <p className="landing-label ml-2 truncate">CodeQuest · connected modules</p>
          </div>

          <div className="p-4 sm:p-5">
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {INTRO_MODULES.map((module, index) => (
                <li
                  key={module.id}
                  data-intro-tile
                  className={`landing-module-tile px-3 py-2.5 ${
                    index === 0 ? 'landing-module-tile--accent sm:col-span-2' : ''
                  }`}
                >
                  <p className="landing-module-index font-mono text-[0.65rem] font-bold tracking-[0.2em]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="font-semibold leading-tight">{module.label}</p>
                  <p className="landing-copy text-[0.8rem] leading-snug">{module.note}</p>
                </li>
              ))}
            </ul>

            <div className="landing-rule mt-5 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {CAREER_PROGRESS_DEMO.map((item) => (
                  <LandingMeter key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
              <p className="landing-copy mt-4 text-[0.78rem]">
                Illustrative preview with demo values — not live student data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-rule landing-rule--strong" />
    </section>
  )
}
