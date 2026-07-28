import type { CSSProperties } from 'react'

import { LandingGlyph } from '@/components/landing/shared/LandingGlyph'
import { JOURNEY_STAGES } from '@/data/landingContent'

type StageVars = CSSProperties & Record<`--${string}`, string>

/**
 * Original editorial hero illustration: a learner's route through the five CodeQuest
 * stages. Built from HTML + hand-drawn line-art glyphs so the labels stay readable at
 * every viewport instead of shrinking with an SVG viewBox.
 */
export function HeroJourneyDiagram() {
  return (
    <figure className="landing-hero-diagram relative m-0">
      <figcaption className="landing-label landing-label--offset mb-4 sm:mb-5">
        The route
      </figcaption>

      <ol className="relative space-y-2.5 sm:space-y-3">
        <span
          className="landing-hero-spine pointer-events-none absolute bottom-5 left-[1.1875rem] top-5"
          aria-hidden="true"
        />

        {JOURNEY_STAGES.map((stage, index) => (
          <li
            key={stage.id}
            data-hero-node
            className="relative flex items-center gap-3 sm:gap-4"
            style={{ '--stage-width': `${70 + index * 7}%` } as StageVars}
          >
            <span className="landing-stage-node relative z-10 h-9 w-9 shrink-0" aria-hidden="true">
              {stage.numeral}
            </span>

            <span
              className={`landing-hero-node-card landing-card flex min-w-0 items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 ${
                index === JOURNEY_STAGES.length - 1 ? 'landing-card--soft' : ''
              }`}
            >
              <LandingGlyph name={stage.glyph} className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
              <span className="landing-h3 truncate">{stage.title}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="landing-label landing-label--flare mt-4 flex items-center gap-2 sm:mt-5">
        <LandingGlyph name="spark" className="h-5 w-5" />
        Ends with real opportunities
      </p>
    </figure>
  )
}
