import { Award } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type AchievementCardProps = {
  courseCount: number
  projectCount: number
  challengeCount: number
  latest: string
  recent?: string[]
  delay?: number
}

export function AchievementCard({
  courseCount,
  projectCount,
  challengeCount,
  latest,
  recent = [],
  delay = 0.24,
}: AchievementCardProps) {
  return (
    <BentoCard className="sp-span-4" tone="yellow" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text" style={{ flexDirection: 'row', gap: '0.55rem', alignItems: 'center' }}>
          <span className="sp-continue__icon" aria-hidden="true" style={{ background: 'rgba(32,35,31,0.08)' }}>
            <Award size={16} />
          </span>
          <div>
            <p className="sp-eyebrow">Completed quests</p>
            <h2 className="sp-card-title">Recent wins</h2>
          </div>
        </div>
      </div>

      <p className="sp-metric">{courseCount}+ done</p>

      <div className="sp-inset">
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
          <StudentPill variant="neutral" size="sm">
            {projectCount} projects
          </StudentPill>
          <StudentPill variant="neutral" size="sm">
            {challengeCount} challenges
          </StudentPill>
        </div>
        <p className="sp-muted" style={{ marginBottom: '0.35rem' }}>
          Latest · {latest}
        </p>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {recent.map((item) => (
            <StudentPill key={item} variant="mint" size="sm">
              {item}
            </StudentPill>
          ))}
        </div>
      </div>
    </BentoCard>
  )
}
