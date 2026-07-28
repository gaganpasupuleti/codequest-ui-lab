import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import { LandingCtaButton, LandingCtaLink } from '@/components/landing/LandingCtaButton'
import { HeroJourneyDiagram } from '@/components/landing/shared/HeroJourneyDiagram'
import { LANDING_SECTION_IDS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

const HEADLINE_LINES = [
  [
    { text: 'Learning to code is', mark: false },
    { text: 'Hard.', mark: false },
  ],
  [
    { text: 'We make it a', mark: false },
    { text: 'Quest.', mark: true },
  ],
] as const

type HeroSectionProps = {
  onStartQuest: () => void
}

export function HeroSection({ onStartQuest }: HeroSectionProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line-inner]', root)
      const copy = root.querySelector('[data-hero-copy]')
      const ctaGroup = root.querySelector<HTMLElement>('[data-hero-cta-group]')
      const ctas = ctaGroup ? Array.from(ctaGroup.children) : []
      const nodes = gsap.utils.toArray<HTMLElement>('[data-hero-node]', root)
      const kicker = root.querySelector('[data-hero-kicker]')

      /* Kept short and heavily overlapped: every element is settled well under a
         second so the entrance never withholds the headline, copy or CTAs. */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (kicker) tl.from(kicker, { autoAlpha: 0, y: 8, duration: 0.3 }, 0)

      tl.from(lines, { yPercent: 108, duration: 0.6, stagger: 0.08 }, 0.08)

      if (copy) tl.from(copy, { autoAlpha: 0, y: 14, duration: 0.45 }, 0.3)

      if (ctas.length) {
        tl.from(ctas, { autoAlpha: 0, y: 12, duration: 0.35, stagger: 0.06 }, 0.45)
      }

      if (nodes.length) {
        tl.from(nodes, { autoAlpha: 0, x: -16, duration: 0.4, stagger: 0.07 }, 0.35)
      }
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.hero}
      className="landing-surface-paper relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="landing-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-[clamp(6rem,13vh,8rem)] sm:px-6 sm:pb-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-8 lg:pb-24">
        <div>
          <p data-hero-kicker className="landing-label landing-label--offset mb-5">
            01 — Student learning platform
          </p>

          <h1 id="hero-heading" className="landing-display mb-6 max-w-[22ch]">
            {HEADLINE_LINES.map((line, lineIndex) => (
              <span key={lineIndex} className="landing-hero-line">
                <span data-hero-line-inner className="block">
                  {line.map((part) => (
                    <span key={part.text} className="mr-[0.25em] inline-block">
                      {part.mark ? <span className="landing-mark">{part.text}</span> : part.text}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-copy className="landing-lede mb-8 max-w-[54ch]">
            Stop stitching together random tutorials. CodeQuest combines guided learning, real
            practice, projects, career preparation and job discovery in one connected student
            journey.
          </p>

          <div data-hero-cta-group className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingCtaButton size="lg" tone="primary" onClick={onStartQuest}>
              Start Your Quest
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LandingCtaButton>
            <LandingCtaLink size="lg" tone="ghost" href={`#${LANDING_SECTION_IDS.journey}`}>
              See How It Works
            </LandingCtaLink>
          </div>
        </div>

        <HeroJourneyDiagram />
      </div>

      <div className="landing-rule landing-rule--strong" />
    </section>
  )
}
