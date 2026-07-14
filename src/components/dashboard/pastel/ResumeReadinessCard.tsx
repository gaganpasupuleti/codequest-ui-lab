import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type ResumeReadinessCardProps = {
  score: number
  missing: string[]
  delay?: number
}

export function ResumeReadinessCard({ score, missing, delay = 0.2 }: ResumeReadinessCardProps) {
  return (
    <BentoCard className="sp-span-4" tone="yellow" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Resume readiness</p>
          <h2 className="sp-card-title">ATS score</h2>
        </div>
        <div className="sp-card-head__aside">
          <div
            className="sp-ring"
            style={{ ['--pct' as string]: score }}
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Resume readiness"
          >
            {score}%
          </div>
        </div>
      </div>

      <div className="sp-inset">
        <p className="sp-muted" style={{ marginBottom: '0.4rem' }}>
          Missing skills
        </p>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {missing.map((skill) => (
            <StudentPill key={skill} variant="peach" size="sm">
              {skill}
            </StudentPill>
          ))}
        </div>
      </div>

      <div className="sp-card-foot">
        <StudentAction href="/resume-lab" showArrow>
          Resume Quest
        </StudentAction>
      </div>
    </BentoCard>
  )
}
