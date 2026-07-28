import { useRef } from 'react'

import { LandingGlyph } from '@/components/landing/shared/LandingGlyph'
import { JOURNEY_STAGES, LANDING_SECTION_IDS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'
import { cn } from '@/lib/utils'

export function JourneySection() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const stages = gsap.utils.toArray<HTMLElement>('[data-journey-stage]', root)
      const spineFill = root.querySelector<HTMLElement>('[data-journey-spine-fill]')
      const list = root.querySelector<HTMLElement>('[data-journey-list]')

      stages.forEach((stage) => {
        gsap.from(stage, {
          autoAlpha: 0,
          y: 26,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: stage, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })

      /* Scrubbed reveal of the connecting spine — scaleY only, no pinning and no
         hardcoded pixel scroll distance, so tall and short viewports behave the same. */
      if (spineFill && list) {
        gsap.fromTo(
          spineFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: list,
              start: 'top 75%',
              end: 'bottom 65%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.journey}
      className="landing-surface-paper relative"
      aria-labelledby="journey-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <p className="landing-label landing-label--offset mb-5">04 — The journey</p>
          <h2 id="journey-heading" className="landing-h2 mb-4">
            One platform. One connected quest.
          </h2>
          <p className="landing-lede max-w-[52ch]">
            Five stages that hand off to each other instead of five tools that never talk.
          </p>
        </div>

        <ol data-journey-list className="relative">
          <span
            className="landing-stage-spine pointer-events-none absolute bottom-6 left-[1.3125rem] top-6 w-[2px] lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          >
            <span
              data-journey-spine-fill
              className="landing-stage-spine-fill absolute inset-0 block"
            />
          </span>

          {JOURNEY_STAGES.map((stage, index) => {
            const isLeft = index % 2 === 0
            const isLast = index === JOURNEY_STAGES.length - 1

            return (
              <li
                key={stage.id}
                data-journey-stage
                className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 pb-6 last:pb-0 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-10 lg:pb-8"
              >
                <span
                  className="landing-stage-node relative z-10 h-11 w-11 shrink-0 lg:order-2"
                  aria-hidden="true"
                >
                  {stage.numeral}
                </span>

                <article
                  className={cn(
                    'landing-stage-card min-w-0 p-4 sm:p-5',
                    isLast && 'landing-stage-card--accent',
                    isLeft ? 'lg:order-1 lg:text-right' : 'lg:order-3',
                  )}
                >
                  <div
                    className={cn(
                      'mb-2 flex items-center gap-3',
                      isLeft && 'lg:flex-row-reverse',
                    )}
                  >
                    <LandingGlyph name={stage.glyph} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
                    <h3 className="landing-h3">{stage.title}</h3>
                  </div>
                  <p className="landing-copy">{stage.body}</p>
                </article>

                {/* Empty counter-column so the card can sit on either side of the spine. */}
                <span
                  className={cn('hidden lg:block', isLeft ? 'lg:order-3' : 'lg:order-1')}
                  aria-hidden="true"
                />
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
