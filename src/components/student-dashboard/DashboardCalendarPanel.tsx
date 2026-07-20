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
  className,
}: PlannerCardProps) {
  const cells = buildMonthCells(viewMonth)
  const todayIso = toIsoDate(new Date())
  const monthLabel = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <CQCard className={cn('flex flex-col', className)}>
      <div className={CQ_SECTION_HEAD}>
        <h3 className={CQ_SECTION_TITLE}>Planner</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            className={cn('grid h-7 w-7 place-items-center rounded-full text-[#374151] hover:bg-[#0A1020]/6', CQ_FOCUS)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className={cn('min-w-[100px] text-center font-semibold text-[#374151]', CQ_META)}>
            {monthLabel}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            className={cn('grid h-7 w-7 place-items-center rounded-full text-[#374151] hover:bg-[#0A1020]/6', CQ_FOCUS)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={cn('grid grid-cols-7 gap-y-1 text-center', CQ_LABEL)}>
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`} className="py-0.5">
            {d}
          </span>
        ))}
        {cells.map((iso, i) =>
          iso === null ? (
            <span key={`empty-${i}`} />
          ) : (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={cn(
                'relative mx-auto grid h-7 w-7 place-items-center rounded-full text-[12px] transition-colors',
                CQ_FOCUS,
                iso === selectedDate
                  ? 'bg-[#0A1020] font-semibold text-[#FAF3E0]'
                  : iso === todayIso
                    ? 'font-semibold text-[#1D4ED8]'
                    : 'text-[#374151] hover:bg-[#0A1020]/6',
              )}
            >
              {Number(iso.slice(-2))}
              {markedDates.has(iso) && iso !== selectedDate && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#14B8A6]" />
              )}
            </button>
          ),
        )}
      </div>

      <div className="mt-3 rounded-xl border border-[#708090]/15 bg-[#FAF3E0]/60 p-3">
        <p className={CQ_LABEL}>Selected day focus</p>
        {plannerLoading ? (
          <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-[#0A1020]/8" aria-hidden />
        ) : (
          <p className={cn('mt-1 font-medium', CQ_BODY_STRONG)}>
            {dayPlan?.topic ?? 'Select a date to preview'}
          </p>
        )}
        {dayPlan && !plannerLoading && (
          <p className={cn('mt-1', CQ_META)}>{dayPlan.estimatedMinutes} min estimated</p>
        )}
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
    <CQCard className={cn('flex h-full flex-col', className)}>
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <Briefcase className="h-4 w-4 shrink-0 text-[#0A1020]/70" strokeWidth={1.75} />
          Career readiness
        </h3>
        <span className={cn(CQ_CHIP, 'bg-[#C2CDB0]/45 tabular-nums text-[#3F6212]')}>
          {loading ? '…' : `${readiness.overall}%`}
        </span>
      </div>
      <div className={cn('grid flex-1 grid-cols-1 sm:grid-cols-2 sm:gap-x-4', CQ_STACK_GAP)}>
        <CQProgressBar label="Resume" value={readiness.resume} />
        <CQProgressBar label="Skills" value={readiness.skill} />
        <CQProgressBar label="Interview" value={readiness.interview} />
        <CQProgressBar label="ATS" value={readiness.ats} />
      </div>
      <CQActionButton variant="ghost" className="mt-3 w-full sm:w-auto sm:self-start" onClick={onOpenJobs}>
        Explore jobs
        <ArrowRight className="h-3.5 w-3.5" />
      </CQActionButton>
    </CQCard>
  )
}
