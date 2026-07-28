import { useRef } from 'react'

import { LandingGlyph } from '@/components/landing/shared/LandingGlyph'
import { LANDING_FEATURES, LANDING_SECTION_IDS, QUEST_ARENAS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'
import { cn } from '@/lib/utils'

/** Each block gets its own surface and footprint so this never reads as an icon grid. */
const FEATURE_LAYOUT: Record<string, { surface: string; span: string; wide: boolean }> = {
  'guided-learning': { surface: 'landing-feature--soft', span: 'lg:col-span-2', wide: true },
  'practice-grounds': { surface: 'landing-feature--ink', span: 'lg:col-span-1', wide: false },
  'project-quests': { surface: 'landing-feature--paper', span: 'lg:col-span-1', wide: false },
  'progress-proof': { surface: 'landing-feature--deep', span: 'lg:col-span-1', wide: false },
  'resume-career': { surface: 'landing-feature--paper', span: 'lg:col-span-1', wide: false },
  'job-discovery': { surface: 'landing-feature--soft', span: 'lg:col-span-3', wide: true },
}

const PRACTICE_TOPICS = QUEST_ARENAS.map((arena) => arena.title)

export function FeaturesSection() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const blocks = gsap.utils.toArray<HTMLElement>('[data-feature-block]', root)

      blocks.forEach((block) => {
        gsap.from(block, {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: block, start: 'top 92%', toggleActions: 'play none none none' },
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.features}
      className="landing-surface-paper relative"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <p className="landing-label landing-label--offset mb-5">05 — What you get</p>
          <h2 id="features-heading" className="landing-h2 mb-4">
            Features ... obviously ...
          </h2>
          <p className="landing-lede max-w-[52ch]">
            Because every platform needs a feature section. Ours is at least useful.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => {
            const layout = FEATURE_LAYOUT[feature.id] ?? {
              surface: 'landing-feature--paper',
              span: 'lg:col-span-1',
              wide: false,
            }

            return (
              <article
                key={feature.id}
                data-feature-block
                className={cn('landing-feature p-5 sm:p-6', layout.surface, layout.span)}
              >
                <div
                  className={cn(
                    'flex h-full gap-4',
                    layout.wide ? 'flex-col sm:flex-row sm:items-center sm:gap-8' : 'flex-col',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="landing-label">{feature.numeral}</span>
                      <span className="landing-divider-dot h-1.5 w-1.5 rounded-full" aria-hidden="true" />
                    </div>

                    <h3 className={cn('landing-h3 mb-2.5', layout.wide && 'sm:max-w-[22ch]')}>
                      {feature.title}
                    </h3>
                    <p className="landing-copy max-w-[46ch]">{feature.body}</p>

                    {feature.id === 'practice-grounds' && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {PRACTICE_TOPICS.map((topic) => (
                          <li key={topic} className="landing-chip">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <LandingGlyph
                    name={feature.visual}
                    className={cn(
                      'shrink-0',
                      layout.wide ? 'h-16 w-16 sm:h-24 sm:w-24' : 'h-12 w-12 self-end',
                    )}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="landing-rule landing-rule--strong" />
    </section>
  )
}
