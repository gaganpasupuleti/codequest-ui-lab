import { useRef } from 'react'

import { LandingGlyph } from '@/components/landing/shared/LandingGlyph'
import { LANDING_PAIN_POINTS, LANDING_SECTION_IDS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

export function PainSection() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const heading = root.querySelector('[data-pain-heading]')
      const rows = gsap.utils.toArray<HTMLElement>('[data-pain-row]', root)

      if (heading) {
        gsap.from(heading, {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 88%', toggleActions: 'play none none none' },
        })
      }

      rows.forEach((row) => {
        gsap.from(row, {
          autoAlpha: 0,
          y: 28,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none none' },
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.pain}
      className="landing-surface-ink relative"
      aria-labelledby="pain-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div data-pain-heading className="mb-10 max-w-3xl sm:mb-14">
          <p className="landing-label landing-label--flare mb-4">02 — The problem</p>
          <h2 id="pain-heading" className="landing-h2">
            The pain of learning from everywhere
          </h2>
        </div>

        <div>
          {LANDING_PAIN_POINTS.map((point) => (
            <article
              key={point.id}
              data-pain-row
              className="landing-pain-row grid gap-4 py-8 sm:gap-6 sm:py-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start lg:gap-10"
            >
              <p className="landing-numeral landing-pain-numeral lg:w-[5.5ch]">{point.numeral}</p>

              <div className="max-w-[62ch]">
                <h3 className="landing-h3 landing-pain-title mb-2.5">{point.title}</h3>
                <p className="landing-copy">{point.body}</p>
              </div>

              <LandingGlyph
                name={point.glyph}
                className="h-16 w-16 shrink-0 justify-self-start sm:h-20 sm:w-20 lg:justify-self-end"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
