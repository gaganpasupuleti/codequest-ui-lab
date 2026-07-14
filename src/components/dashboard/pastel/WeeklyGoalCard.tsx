import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type WeeklyGoalCardProps = {
  targetHours: number
  completedHours: number
  delay?: number
}

export function WeeklyGoalCard({ targetHours, completedHours, delay = 0.16 }: WeeklyGoalCardProps) {
  const pct = Math.min(100, Math.round((completedHours / Math.max(targetHours, 1)) * 100))
  const remaining = Math.max(0, +(targetHours - completedHours).toFixed(1))

  return (
    <BentoCard className="sp-span-4" tone="mint" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Weekly goal</p>
          <h2 className="sp-card-title">{completedHours}h completed</h2>
        </div>
      </div>

      <div className="sp-inset" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          className="sp-ring"
          style={{ ['--pct' as string]: pct }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Weekly study goal progress"
        >
          {pct}%
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="sp-metric">{completedHours}h / {targetHours}h</p>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <StudentPill variant="neutral" size="sm">
              Target {targetHours}h
            </StudentPill>
            <StudentPill variant="peach" size="sm">
              {remaining}h left
            </StudentPill>
          </div>
          <p className="sp-body" style={{ marginTop: '0.45rem' }}>
            Nice pace — one focused session keeps the streak alive.
          </p>
        </div>
      </div>
    </BentoCard>
  )
}
