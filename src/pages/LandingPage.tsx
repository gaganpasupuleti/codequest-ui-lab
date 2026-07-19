import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { CinematicHero } from '@/components/landing/CinematicHero'
import { SkillsTicker } from '@/components/landing/SkillsTicker'
import { QuestJourney } from '@/components/landing/QuestJourney'
import { QuestArenas } from '@/components/landing/QuestArenas'
import { CareerMap } from '@/components/landing/CareerMap'
import { PlatformShowcase } from '@/components/landing/PlatformShowcase'
import { FeatureStory } from '@/components/landing/FeatureStory'
import { FinalQuestCTA } from '@/components/landing/FinalQuestCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export function LandingPage() {
  return (
    <div className="landing-cinematic min-h-dvh overflow-x-clip">
      <PublicNavbar variant="landing" />
      <main>
        <CinematicHero />
        <SkillsTicker />
        <QuestJourney />
        <QuestArenas />
        <CareerMap />
        <PlatformShowcase />
        <FeatureStory />
        <FinalQuestCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
