import { Bell, Menu, Search, User } from 'lucide-react'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

type StudentTopbarProps = {
  firstName: string
  questTitle: string
  onOpenMenu: () => void
  continueHref: string
}

export function StudentTopbar({ firstName, questTitle, onOpenMenu, continueHref }: StudentTopbarProps) {
  return (
    <header className="sp-topbar">
      <div className="sp-greeting">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
          <StudentAction
            variant="icon"
            icon={Menu}
            className="sp-menu-btn"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            aria-controls="student-pastel-sidebar"
          />
          <div>
            <h1>Hi {firstName}, ready for your quest?</h1>
            <div className="sp-greeting-row">
              <span className="sp-muted">Current focus</span>
              <StudentPill variant="blue" size="sm">
                {questTitle}
              </StudentPill>
            </div>
          </div>
        </div>
      </div>

      <div className="sp-top-actions">
        <StudentAction variant="icon" icon={Search} disabled title="Search coming soon" aria-label="Search" />
        <StudentAction variant="icon" icon={Bell} title="Notifications" aria-label="Notifications" />
        <StudentAction variant="icon" icon={User} href="/profile" aria-label="Open profile" />
        <StudentAction href={continueHref} showArrow>
          Continue Quest
        </StudentAction>
      </div>
    </header>
  )
}
