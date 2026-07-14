import { Clock3 } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type MentorSupportCardProps = {
  name: string
  subject: string
  experience: string
  nextSlot: string
  available: boolean
  delay?: number
}

export function MentorSupportCard({
  name,
  subject,
  experience,
  nextSlot,
  available,
  delay = 0.14,
}: MentorSupportCardProps) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  return (
    <BentoCard className="sp-span-4" tone="mint" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text" style={{ flexDirection: 'row', gap: '0.65rem', alignItems: 'flex-start' }}>
          <span className="sp-avatar" aria-hidden="true">
            {initials}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
              <p className="sp-eyebrow">Mentor support</p>
              <StudentPill variant={available ? 'success' : 'disabled'} size="sm">
                {available ? 'Online' : 'Offline'}
              </StudentPill>
            </div>
            <h2 className="sp-card-title">{name}</h2>
            <p className="sp-body" style={{ marginTop: 2 }}>
              {subject}
            </p>
          </div>
        </div>
      </div>

      <div className="sp-inset">
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
          <StudentPill variant="neutral" size="sm">
            {experience} exp
          </StudentPill>
          <StudentPill variant="blue" size="sm" icon={Clock3}>
            {nextSlot}
          </StudentPill>
          <StudentPill variant="outline" size="sm" title="Booking not available yet">
            Preview
          </StudentPill>
        </div>
        <p className="sp-body">Need help with joins? Let&apos;s walk through a real challenge together.</p>
      </div>

      <div className="sp-card-foot">
        <StudentAction
          variant="disabled"
          disabled
          title="Mentor booking is not available yet"
          aria-label="Book session (coming soon)"
        >
          Book session
        </StudentAction>
      </div>
    </BentoCard>
  )
}
