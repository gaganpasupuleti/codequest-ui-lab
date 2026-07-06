import { PublicNavbar } from '../components/layout/PublicNavbar'
import { Hero } from '../components/landing/Hero'
import { SkillsTicker } from '../components/landing/SkillsTicker'
import { LearningPaths } from '../components/landing/LearningPaths'
import { QuestGallery } from '../components/landing/QuestGallery'
import { WhyCodeQuest } from '../components/landing/WhyCodeQuest'
import { LandingFooter } from '../components/landing/LandingFooter'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PublicNavbar />
      <Hero />
      <SkillsTicker />
      <LearningPaths />
      <QuestGallery />
      <WhyCodeQuest />
      <LandingFooter />
    </div>
  )
}
