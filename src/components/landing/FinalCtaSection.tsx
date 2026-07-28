import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import { LandingCtaButton } from '@/components/landing/LandingCtaButton'
import { CQLogo } from '@/components/landing/shared/CQLogo'
import { LANDING_SECTION_IDS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

type FinalCtaSectionProps = {
  onStartQuest: () => void
}

export function FinalCtaSection({ onStartQuest }: FinalCtaSectionProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const beats = gsap.utils.toArray<HTMLElement>('[data-cta-beat]', root)

      gsap.from(beats, {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none none' },
      })
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.finalCta}
      className="landing-surface-ink relative"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div data-cta-beat className="mb-8 flex items-center gap-4">
          <CQLogo size="sm" />
          <p className="landing-label">07 — Last page of the pitch</p>
        </div>

        <h2 id="final-cta-heading" data-cta-beat className="landing-h2 mb-8">
          Convinced?
        </h2>

        <div data-cta-beat className="landing-final-beat p-5 sm:p-7">
          <p className="landing-h3 mb-5 max-w-[30ch]">Start CodeQuest. Build something real.</p>
          <LandingCtaButton size="lg" tone="primary" onClick={onStartQuest}>
            Start Your Quest
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LandingCtaButton>
        </div>

        <div
          data-cta-beat
          className="landing-final-beat landing-final-beat--quiet mt-4 p-5 sm:mt-5 sm:p-7"
        >
          <p className="landing-lede mb-5 max-w-[46ch]">
            Still thinking? That next tutorial tab probably will not change your life.
          </p>
          <LandingCtaButton size="lg" tone="ghost" onClick={onStartQuest}>
            Fine, Show Me the Platform
          </LandingCtaButton>
        </div>
      </div>
    </section>
  )
}
