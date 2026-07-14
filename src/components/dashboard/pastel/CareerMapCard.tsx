import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type CareerMapCardProps = {
  role: string
  readiness: number
  stage: string
  nextStep: string
  delay?: number
}

const STAGES = ['Skills', 'Practice', 'Projects', 'Resume', 'Jobs'] as const

export function CareerMapCard({ role, readiness, stage, nextStep, delay = 0.22 }: CareerMapCardProps) {
  const activeIdx = Math.max(
    0,
    STAGES.findIndex((s) => s.toLowerCase() === stage.toLowerCase()),
  )

  return (
    <BentoCard className="sp-span-4" tone="blue" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Career map</p>
          <h2 className="sp-card-title">{role}</h2>
        </div>
        <div className="sp-card-head__aside">
          <StudentPill variant="primary" size="sm">
            {readiness}% ready
          </StudentPill>
        </div>
      </div>

      <div className="sp-inset">
        <ol className="sp-path">
          {STAGES.map((s, i) => (
            <li key={s}>
              <StudentPill variant={i === activeIdx ? 'dark' : i < activeIdx ? 'mint' : 'neutral'} size="sm">
                {i + 1}. {s}
              </StudentPill>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: '0.55rem' }}>
          <StudentPill variant="yellow" size="sm">
            Next · {nextStep}
          </StudentPill>
        </div>
      </div>

      <div className="sp-card-foot">
        <StudentAction href="/career-map" showArrow>
          Open map
        </StudentAction>
      </div>
    </BentoCard>
  )
}
