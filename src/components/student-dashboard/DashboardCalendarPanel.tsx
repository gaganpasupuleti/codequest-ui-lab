import { ArrowRight, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'

import type { DayLearningPlan } from '@/lib/learning-planner-derive'
import { toIsoDate, type ReadinessBreakdown } from '@/lib/dashboard-derive'
import { cn } from '@/lib/utils'

import { CQActionButton, CQCard, CQProgressBar } from './cq/CQKit'
import {
  CQ_BODY_STRONG,
  CQ_CHIP,
  CQ_FOCUS,
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_HEAD,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from './cq/cqTheme'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

interface PlannerCardProps {
  viewMonth: Date
  onViewMonthChange: (month: Date) => void
  selectedDate: string
  onSelectDate: (date: string) => void
  markedDates: Set<string>
  dayPlan: DayLearningPlan | null
  plannerLoading: boolean
  onOpenPlanner: () => void
  /** Shown when the day has no concrete plan (keeps momentum for new users). */
  emptyDaySuggestion?: string
  className?: string
}

function buildMonthCells(viewMonth: Date): (string | null)[] {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = []
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(toIsoDate(new Date(year, month, d)))
  return cells
}

export function PlannerCard({
  viewMonth,
  onViewMonthChange,
  selectedDate,
  onSelectDate,
  markedDates,
  dayPlan,
  plannerLoading,
  onOpenPlanner,
  emptyDaySuggestion = 'Start your first SQL module',
  className,
}: PlannerCardProps) {
  const cells = buildMonthCells(viewMonth)
  const todayIso = toIsoDate(new Date())
  const monthLabel = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const rawTopic = dayPlan?.topic?.trim() || ''
  const isPlaceholderTopic =
    !rawTopic ||
    rawTopic === 'Self-directed study' ||
    rawTopic === 'Select a date to preview'
  const focusTitle = isPlaceholderTopic ? emptyDaySuggestion : rawTopic
  const focusMeta = isPlaceholderTopic
    ? 'Suggested next step to keep momentum'
    : dayPlan
      ? `${dayPlan.estimatedMinutes} min estimated`
      : null

  return (
    <CQCard className={cn('flex h-full min-w-0 w-full flex-col', className)}>
      <div className={cn(CQ_SECTION_HEAD, 'items-center')}>
        <h3 className={CQ_SECTION_TITLE}>Planner</h3>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            className={cn('grid h-7 w-7 place-items-center rounded-lg text-[#374151] hover:bg-zinc-100', CQ_FOCUS)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className={cn('min-w-[7.5rem] text-center font-semibold text-[#374151]', CQ_META)}>
            {monthLabel}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            className={cn('grid h-7 w-7 place-items-center rounded-lg text-[#374151] hover:bg-zinc-100', CQ_FOCUS)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid w-full grid-cols-7 gap-x-0.5 gap-y-1">
        {WEEKDAYS.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className={cn(CQ_LABEL, 'flex h-6 items-center justify-center text-center')}
          >
            {d}
          </span>
        ))}
        {cells.map((iso, i) =>
          iso === null ? (
            <span key={`empty-${i}`} className="flex aspect-square items-center justify-center" />
          ) : (
            <div key={iso} className="flex aspect-square items-center justify-center">
              <button
                type="button"
                onClick={() => onSelectDate(iso)}
                className={cn(
                  'relative grid h-[1.85rem] w-[1.85rem] max-h-full max-w-full place-items-center rounded-full text-[12px] tabular-nums transition-colors',
                  CQ_FOCUS,
                  iso === selectedDate
                    ? 'bg-[#0A1020] font-semibold text-white'
                    : iso === todayIso
                      ? 'font-semibold text-[#1D4ED8] ring-1 ring-[#2563EB]/45'
                      : 'font-medium text-[#374151] hover:bg-zinc-100',
                )}
              >
                {Number(iso.slice(-2))}
                {markedDates.has(iso) && iso !== selectedDate && (
                  <span
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#14B8A6]"
                    aria-hidden
                  />
                )}
              </button>
            </div>
          ),
        )}
      </div>

      <div className="mt-3 rounded-lg border border-[#E5E7EB] bg-zinc-50 p-3">
        <p className={CQ_LABEL}>Selected day focus</p>
        {plannerLoading ? (
          <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-[#0A1020]/8" aria-hidden />
        ) : (
          <p className={cn('mt-1 font-medium', CQ_BODY_STRONG)}>{focusTitle}</p>
        )}
        {!plannerLoading && focusMeta ? <p className={cn('mt-1', CQ_META)}>{focusMeta}</p> : null}
      </div>

      <CQActionButton variant="ghost" className="mt-3 w-full" onClick={onOpenPlanner}>
        Open full planner
        <ArrowRight className="h-3.5 w-3.5" />
      </CQActionButton>
    </CQCard>
  )
}

interface JobReadinessPanelProps {
  readiness: ReadinessBreakdown
  loading: boolean
  onOpenJobs: () => void
  className?: string
}

export function JobReadinessPanel({
  readiness,
  loading,
  onOpenJobs,
  className,
}: JobReadinessPanelProps) {
  return (
    <CQCard className={cn('flex h-full min-h-[13rem] min-w-0 flex-col', className)}>
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <Briefcase className="h-4 w-4 shrink-0 text-[#0A1020]/70" strokeWidth={1.75} />
          Career readiness
        </h3>
        <span className={cn(CQ_CHIP, 'bg-[#C2CDB0]/45 tabular-nums text-[#3F6212]')}>
          {loading ? '…' : `${readiness.overall}%`}
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 content-start gap-x-3 gap-y-2">
        <CQProgressBar label="Resume" value={readiness.resume} />
        <CQProgressBar label="Skills" value={readiness.skill} />
        <CQProgressBar label="Interview" value={readiness.interview} />
        <CQProgressBar label="ATS" value={readiness.ats} />
      </div>
      <CQActionButton variant="ghost" className="mt-3 h-9 w-full" onClick={onOpenJobs}>
        Explore jobs
        <ArrowRight className="h-3.5 w-3.5" />
      </CQActionButton>
    </CQCard>
  )
}
