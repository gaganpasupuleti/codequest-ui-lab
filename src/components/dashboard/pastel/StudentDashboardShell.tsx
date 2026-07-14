import { useState, type ReactNode } from 'react'
import { StudentSidebar } from '@/components/dashboard/pastel/StudentSidebar'
import { StudentTopbar } from '@/components/dashboard/pastel/StudentTopbar'
import '@/styles/student-pastel.css'

type StudentDashboardShellProps = {
  firstName: string
  questTitle: string
  continueHref: string
  level: number
  xp: number
  xpToNext: number
  streak: number
  children: ReactNode
}

export function StudentDashboardShell({
  firstName,
  questTitle,
  continueHref,
  level,
  xp,
  xpToNext,
  streak,
  children,
}: StudentDashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="student-pastel">
      <div className="sp-shell">
        <button
          type="button"
          className={`sp-drawer-backdrop${menuOpen ? ' is-open' : ''}`}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
        <StudentSidebar
          open={menuOpen}
          level={level}
          xp={xp}
          xpToNext={xpToNext}
          streak={streak}
          onNavigate={() => setMenuOpen(false)}
        />
        <div className="sp-workspace">
          <StudentTopbar
            firstName={firstName}
            questTitle={questTitle}
            continueHref={continueHref}
            onOpenMenu={() => setMenuOpen(true)}
          />
          <main className="sp-main" id="student-dashboard-main">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
