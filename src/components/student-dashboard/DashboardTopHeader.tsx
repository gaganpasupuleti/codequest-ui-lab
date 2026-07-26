import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  Flame,
  FileText,
  Map as MapIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import { CQActionButton } from './cq/CQKit'

interface DashboardTopHeaderProps {
  firstName: string
  pathTitle: string
  progressPct: number
  currentStreak: number
  practicedToday: boolean
  daysRemaining: number | null
  nextLessonTitle: string | null
  loading: boolean
  continueLabel?: string
  onContinuePractice: () => void
  onOpenCareer: () => void
  onOpenCalendar: () => void
  onOpenResume: () => void
  onOpenJobs: () => void
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatusChip({
  icon,
  children,
  highlight = false,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold',
        highlight
          ? 'border-[#14B8A6]/45 bg-[#14B8A6]/15 text-[#5EEAD4]'
          : 'border-[#F4F5F7]/20 bg-[#F4F5F7]/8 text-[#F4F5F7]/85',
      )}
    >
      <span className="shrink-0">{icon}</span>
      {children}
    </span>
  )
}

function QuickLink({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#F4F5F7]/18 bg-[#F4F5F7]/8 px-2 text-[12px] font-semibold text-[#F4F5F7] transition-colors hover:bg-[#F4F5F7]/14',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F5F7]/40',
      )}
    >
      <span className="shrink-0 text-[#F4F5F7]/80">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

export function DashboardTopHeader({
  firstName,
  pathTitle,
  progressPct,
  currentStreak,
  practicedToday,
  daysRemaining,
  nextLessonTitle,
  loading,
  continueLabel = 'Continue practice',
  onContinuePractice,
  onOpenCareer,
  onOpenCalendar,
  onOpenResume,
  onOpenJobs,
}: DashboardTopHeaderProps) {
  const initials = firstName.slice(0, 2).toUpperCase()
  const streakLabel =
    currentStreak > 0 ? `${currentStreak}-day streak` : 'Start your streak'

  return (
    <header className="relative min-w-0 overflow-hidden rounded-lg border border-[#0A1020]/15 bg-[#0A1020] px-4 py-4 text-[#F4F5F7] shadow-[0_18px_44px_-28px_rgba(10,16,32,0.8)] sm:px-5 md:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#2563EB]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-10 h-56 w-56 rounded-full bg-[#14B8A6]/15 blur-3xl"
      />

      <div className="relative grid min-w-0 grid-cols-1 gap-4 @min-[720px]/dash:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] @min-[720px]/dash:items-end @min-[720px]/dash:gap-6">
        <div className="min-w-0 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F4F5F7]/12 text-[11px] font-semibold text-[#F4F5F7] ring-1 ring-[#F4F5F7]/20">
              {initials}
            </span>
            <p className="text-[13px] font-medium text-[#F4F5F7]/70">
              {greeting()}, {firstName}
            </p>
          </div>

          <div className="min-w-0">
            <h1 className="text-[clamp(1.2rem,2.4vw,1.55rem)] font-semibold leading-tight tracking-tight text-[#F4F5F7]">
              Your learning command center
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-[#F4F5F7]/70">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{pathTitle}</span>
              </span>
              <button
                type="button"
                onClick={onOpenCareer}
                className="shrink-0 text-[12px] font-medium text-[#F4F5F7]/55 underline-offset-4 transition-colors hover:text-[#F4F5F7]/85 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F5F7]/35"
              >
                Career Map
              </button>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <StatusChip icon={<span className="h-2 w-2 rounded-full bg-[#5EEAD4]" />} highlight>
              {loading ? '…' : `${progressPct}% complete`}
            </StatusChip>
            <StatusChip icon={<Flame className="h-3.5 w-3.5" />}>
              {streakLabel}
              {practicedToday && currentStreak > 0 ? ' · today ✓' : ''}
            </StatusChip>
            {daysRemaining !== null && (
              <StatusChip icon={<CalendarDays className="h-3.5 w-3.5" />}>
                {daysRemaining} days left
              </StatusChip>
            )}
          </div>

          {nextLessonTitle ? (
            <p className="flex items-start gap-2 text-[13px] text-[#F4F5F7]/75">
              <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span>
                Today&apos;s focus:{' '}
                <span className="font-semibold text-[#F4F5F7]">{nextLessonTitle}</span>
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2">
          <CQActionButton
            variant="ghost"
            onClick={onContinuePractice}
            className="h-10 w-full justify-between border-transparent bg-[#F4F5F7] px-4 text-[13px] text-[#0A1020] hover:bg-white"
          >
            {continueLabel}
            <ArrowRight className="h-4 w-4" />
          </CQActionButton>
          <div className="grid grid-cols-3 gap-1.5">
            <QuickLink icon={<CalendarDays className="h-3.5 w-3.5" />} label="Calendar" onClick={onOpenCalendar} />
            <QuickLink icon={<FileText className="h-3.5 w-3.5" />} label="Resume" onClick={onOpenResume} />
            <QuickLink icon={<Briefcase className="h-3.5 w-3.5" />} label="Jobs" onClick={onOpenJobs} />
          </div>
        </div>
      </div>
    </header>
  )
}
