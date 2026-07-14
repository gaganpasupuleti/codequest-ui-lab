import { NavLink } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { PASTEL_NAV } from '@/components/dashboard/pastel/pastelNav'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'
import { cn } from '@/lib/utils'

type StudentSidebarProps = {
  open: boolean
  level: number
  xp: number
  xpToNext: number
  streak: number
  onNavigate?: () => void
}

const UTILITY = new Set(['Progress', 'Settings'])

export function StudentSidebar({ open, level, xp, xpToNext, streak, onNavigate }: StudentSidebarProps) {
  const pct = Math.min(100, Math.round((xp / Math.max(xpToNext, 1)) * 100))
  const primary = PASTEL_NAV.filter((item) => !UTILITY.has(item.label))
  const utility = PASTEL_NAV.filter((item) => UTILITY.has(item.label))

  return (
    <aside
      id="student-pastel-sidebar"
      className={cn('sp-sidebar', open && 'is-open')}
      aria-label="Student navigation"
    >
      <NavLink to="/dashboard" className="sp-brand" onClick={onNavigate}>
        <span className="sp-brand-mark" aria-hidden="true">
          CQ
        </span>
        <span className="sp-brand-text">
          CodeQuest
          <span>Student Lab</span>
        </span>
      </NavLink>

      <nav className="sp-nav">
        {primary.map((item) => (
          <NavItem key={item.label} item={item} onNavigate={onNavigate} />
        ))}
        <div className="sp-nav-divider" aria-hidden="true" />
        {utility.map((item) => (
          <NavItem key={item.label} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="sp-xp-card" aria-label={`Level ${level}, ${xp} of ${xpToNext} XP`}>
        <div className="sp-xp-card-top">
          <StudentPill variant="primary" size="sm">
            Level {level}
          </StudentPill>
          <StudentPill variant="peach" size="sm" icon={Flame} title={`${streak}-day streak`}>
            {streak}d
          </StudentPill>
        </div>
        <strong>{xp.toLocaleString()} XP</strong>
        <p className="sp-xp-detail">
          {xp.toLocaleString()} / {xpToNext.toLocaleString()} to next level
        </p>
        <div
          className="sp-xp-bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="XP toward next level"
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
    </aside>
  )
}

function NavItem({
  item,
  onNavigate,
}: {
  item: (typeof PASTEL_NAV)[number]
  onNavigate?: () => void
}) {
  const Icon = item.icon

  if (item.disabled || !item.href) {
    return (
      <button
        type="button"
        className="sp-nav-link is-disabled"
        disabled
        title={item.hint ?? 'Coming soon'}
        aria-disabled="true"
      >
        <Icon aria-hidden="true" />
        <span className="sp-nav-label">
          {item.label}
          <StudentPill variant="disabled" size="sm">
            Soon
          </StudentPill>
        </span>
      </button>
    )
  }

  return (
    <NavLink
      to={item.href}
      end={item.href === '/dashboard'}
      className={({ isActive }) => cn('sp-nav-link', isActive && 'is-active')}
      onClick={onNavigate}
      title={item.label}
    >
      <Icon aria-hidden="true" />
      <span className="sp-nav-label">{item.label}</span>
    </NavLink>
  )
}
