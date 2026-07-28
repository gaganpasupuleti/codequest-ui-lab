import { Suspense, lazy } from 'react'

import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { FinalCtaSection } from '@/components/landing/FinalCtaSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { IntroSection } from '@/components/landing/IntroSection'
import { JourneyMarquee } from '@/components/landing/JourneyMarquee'
import { JourneySection } from '@/components/landing/JourneySection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { PainSection } from '@/components/landing/PainSection'
import { scrollLandingToTop } from '@/components/landing/landingSectionNav'
import { PublicNavbar } from '@/components/layout/PublicNavbar'

/** Below-the-fold product preview — loaded on demand to keep the first paint light. */
const ShowcaseSection = lazy(() =>
  import('@/components/landing/ShowcaseSection').then((module) => ({
    default: module.ShowcaseSection,
  })),
)

type PublicLandingPageProps = {
  onStartQuest: () => void
}

export function PublicLandingPage({ onStartQuest }: PublicLandingPageProps) {
  return (
    <div className="landing-cinematic min-h-dvh overflow-x-clip">
      <PublicNavbar onStartQuest={onStartQuest} onHome={scrollLandingToTop} />

      <main>
        <HeroSection onStartQuest={onStartQuest} />
        <PainSection />
        <IntroSection onStartQuest={onStartQuest} />
        <JourneyMarquee />
        <JourneySection />
        <FeaturesSection />
        <Suspense
          fallback={
            /*
             * Reserved heights track the resolved section as measured per breakpoint
             * (~71rem / 63rem / 54rem / 53rem), so the lazy chunk lands without a jump.
             */
            <div
              className="landing-showcase-skeleton min-h-[71rem] min-[430px]:min-h-[63rem] sm:min-h-[54rem] md:min-h-[53rem]"
              aria-busy="true"
              aria-label="Loading platform preview"
            />
          }
        >
          <ShowcaseSection />
        </Suspense>
        <FinalCtaSection onStartQuest={onStartQuest} />
      </main>

      <LandingFooter onStartQuest={onStartQuest} onHome={scrollLandingToTop} />
    </div>
  )
}
