import { useRef } from 'react'

import { JOURNEY_MARQUEE_WORDS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

/** Spoken version of the loop — the visual copies stay aria-hidden. */
const SEQUENCE = `${JOURNEY_MARQUEE_WORDS.map((word) => word.toLowerCase()).join(', ')}.`

function MarqueeCopy() {
  return (
    <div className="flex shrink-0 items-center">
      {JOURNEY_MARQUEE_WORDS.map((word, index) => (
        <span key={`${word}-${index}`} className="flex items-center">
          <span className="landing-marquee-word">{word}</span>
          <span className="landing-marquee-arrow">→</span>
        </span>
      ))}
    </div>
  )
}

export function JourneyMarquee() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track) return
      if (!motionAllowed()) return

      /*
       * Two identical copies + xPercent means the loop is defined in relative units:
       * no scrollWidth measurement, so there is no deferred requestAnimationFrame to
       * leak and no resize listener needed for correctness.
       */
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: 'none',
        repeat: -1,
      })

      const pause = () => tween.pause()
      const resume = () => tween.play()

      root.addEventListener('mouseenter', pause)
      root.addEventListener('mouseleave', resume)
      root.addEventListener('focusin', pause)
      root.addEventListener('focusout', resume)

      return () => {
        root.removeEventListener('mouseenter', pause)
        root.removeEventListener('mouseleave', resume)
        root.removeEventListener('focusin', pause)
        root.removeEventListener('focusout', resume)
        tween.kill()
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="landing-marquee py-3.5 sm:py-4">
      <p className="sr-only">The CodeQuest loop: {SEQUENCE}</p>
      {/* Four copies: shifting by 50% lands on identical content, and even ultra-wide
          viewports stay covered for the whole loop. */}
      <div ref={trackRef} className="landing-marquee-track" aria-hidden="true">
        <MarqueeCopy />
        <MarqueeCopy />
        <MarqueeCopy />
        <MarqueeCopy />
      </div>
    </div>
  )
}
