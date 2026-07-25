import { useEffect, useState } from 'react'
import { Bell, Shield, User } from 'lucide-react'

import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_LABEL,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import type { AuthUser } from '@/lib/auth'
import { isDemoUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface SettingsPageProps {
  user: AuthUser
}

const NOTIFY_KEY = 'codequest-student-notify-prefs'

type NotifyPrefs = {
  classReminders: boolean
  deadlineAlerts: boolean
  practiceNudges: boolean
}

const DEFAULT_PREFS: NotifyPrefs = {
  classReminders: true,
  deadlineAlerts: true,
  practiceNudges: false,
}

function readPrefs(): NotifyPrefs {
  try {
    const raw = localStorage.getItem(NOTIFY_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<NotifyPrefs>) }
  } catch {
    return DEFAULT_PREFS
  }
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-[#E5E7EB] px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[#111827]">{label}</p>
        <p className={CQ_META}>{description}</p>
      </div>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-[#2563EB] focus:ring-[#2563EB]/40"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

export function SettingsPage({ user }: SettingsPageProps) {
  const [prefs, setPrefs] = useState<NotifyPrefs>(DEFAULT_PREFS)
  const demo = isDemoUser()

  useEffect(() => {
    setPrefs(readPrefs())
  }, [])

  const updatePref = <K extends keyof NotifyPrefs>(key: K, value: NotifyPrefs[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'mx-auto flex max-w-3xl flex-col', CQ_STACK_GAP)}>
        <header>
          <h1 className={CQ_PAGE_TITLE}>Settings</h1>
          <p className={cn(CQ_BODY, 'mt-1')}>Account details and notification preferences.</p>
        </header>

        <CQCard className="flex flex-col gap-3">
          <h2 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
            <User className="h-4 w-4 text-zinc-500" aria-hidden />
            Profile
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className={CQ_LABEL}>Name</p>
              <p className="mt-1 text-[13px] font-medium text-[#111827]">
                {user.full_name || 'Student'}
              </p>
            </div>
            <div>
              <p className={CQ_LABEL}>Email</p>
              <p className="mt-1 break-all text-[13px] font-medium text-[#111827]">
                {user.email || '—'}
              </p>
            </div>
            <div>
              <p className={CQ_LABEL}>User ID</p>
              <p className="mt-1 text-[13px] font-medium tabular-nums text-[#111827]">{user.id}</p>
            </div>
            <div>
              <p className={CQ_LABEL}>Role</p>
              <p className="mt-1 text-[13px] font-medium capitalize text-[#111827]">
                {user.role || 'student'}
              </p>
            </div>
          </div>
        </CQCard>

        <CQCard className="flex flex-col gap-2.5">
          <h2 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
            <Bell className="h-4 w-4 text-zinc-500" aria-hidden />
            Notifications
          </h2>
          <ToggleRow
            label="Class reminders"
            description="Remind me before live sessions"
            checked={prefs.classReminders}
            onChange={(v) => updatePref('classReminders', v)}
          />
          <ToggleRow
            label="Deadline alerts"
            description="Quiz and assignment due dates"
            checked={prefs.deadlineAlerts}
            onChange={(v) => updatePref('deadlineAlerts', v)}
          />
          <ToggleRow
            label="Practice nudges"
            description="Suggestions when practice is quiet"
            checked={prefs.practiceNudges}
            onChange={(v) => updatePref('practiceNudges', v)}
          />
        </CQCard>

        {demo && (
          <CQCard className="flex flex-col gap-2">
            <h2 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
              <Shield className="h-4 w-4 text-zinc-500" aria-hidden />
              Demo account
            </h2>
            <p className={CQ_META}>
              You are signed in with a demo account. Some features are limited and progress may reset
              when the session ends.
            </p>
          </CQCard>
        )}
      </div>
    </div>
  )
}
