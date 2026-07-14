import { Video } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type LiveClassesCardProps = {
  title: string
  teacher: string
  time: string
  duration: string
  delay?: number
}

export function LiveClassesCard({ title, teacher, time, duration, delay = 0.18 }: LiveClassesCardProps) {
  const initials = teacher
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  return (
    <BentoCard className="sp-span-4" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text" style={{ flexDirection: 'row', gap: '0.65rem', alignItems: 'flex-start' }}>
          <span className="sp-continue__icon" aria-hidden="true" style={{ background: 'rgba(25,68,241,0.1)' }}>
            <Video size={15} />
          </span>
          <div style={{ minWidth: 0 }}>
            <p className="sp-eyebrow">Live classes</p>
            <h2 className="sp-card-title">{title}</h2>
          </div>
        </div>
      </div>

      <div className="sp-inset">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="sp-avatar sp-avatar--sm" aria-hidden="true">
            {initials}
          </span>
          <div>
            <p className="sp-body" style={{ margin: 0, fontWeight: 700, color: 'var(--student-ink)' }}>
              {teacher}
            </p>
            <p className="sp-muted" style={{ margin: 0 }}>
              Instructor
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <StudentPill variant="blue" size="sm">
            {time}
          </StudentPill>
          <StudentPill variant="neutral" size="sm">
            {duration}
          </StudentPill>
          <StudentPill variant="disabled" size="sm" title="Live Classes route not available yet">
            Coming soon
          </StudentPill>
        </div>
      </div>

      <div className="sp-card-foot">
        <StudentAction variant="disabled" disabled title="Join unavailable until Live Classes ships">
          Join
        </StudentAction>
        <StudentAction variant="ghost" disabled title="Preview unavailable">
          View details
        </StudentAction>
      </div>
    </BentoCard>
  )
}
