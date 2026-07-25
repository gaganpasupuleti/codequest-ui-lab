import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { toIsoDate } from '@/lib/calendar-events'
import type { MarkedDatesByType, PlannerTimelineKind } from '@/lib/learning-planner-derive'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { EVENT_DOT, PLANNER_BODY, PLANNER_CARD } from './planner-styles'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

const DOT_ORDER: PlannerTimelineKind[] = ['class', 'quiz', 'project', 'syllabus', 'practice']

interface PlannerMonthCalendarProps {
  viewMonth: Date
  onViewMonthChange: (month: Date) => void
  selectedDate: string
  onSelectDate: (date: string) => void
  markedDates?: Set<string>
  markedDatesByType?: MarkedDatesByType
  density?: 'dashboard' | 'planner'
  theme?: 'default' | 'cq'
  className?: string
}

export function PlannerMonthCalendar({
  viewMonth,
  onViewMonthChange,
  selectedDate,
  onSelectDate,
  markedDates,
  markedDatesByType,
  density = 'planner',
  theme = 'default',
  className,
}: PlannerMonthCalendarProps) {
  const todayIso = toIsoDate(new Date())
  const isPlanner = density === 'planner'
  const isCq = theme === 'cq'

  const { year, month, cells } = useMemo(() => {
    const y = viewMonth.getFullYear()
    const m = viewMonth.getMonth()
    const first = new Date(y, m, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const grid: { iso: string; day: number; inMonth: boolean }[] = []

    const prevMonthDays = new Date(y, m, 0).getDate()
    for (let i = startPad - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      const d = new Date(y, m - 1, day)
      grid.push({ iso: toIsoDate(d), day, inMonth: false })
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day)
      grid.push({ iso: toIsoDate(d), day, inMonth: true })
    }
    while (grid.length % 7 !== 0 || grid.length < 35) {
      const day = grid.length - startPad - daysInMonth + 1
      const d = new Date(y, m + 1, day)
      grid.push({ iso: toIsoDate(d), day, inMonth: false })
    }
    return { year: y, month: m, cells: grid }
  }, [viewMonth])

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const body = (
    <>
      <div className={cn('mb-2.5 flex items-center justify-between gap-2')}>
        <button
          type="button"
          aria-label="Previous month"
          className={cn(
            'grid h-7 w-7 place-items-center rounded-full transition-colors',
            isCq
              ? 'text-[#374151] hover:bg-[#0A1020]/6'
              : 'rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900',
          )}
          onClick={() =>
            onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2
          className={cn(
            isCq
              ? CQ_SECTION_TITLE
              : cn('font-semibold text-slate-900', isPlanner ? 'text-xs' : 'text-sm'),
          )}
        >
          {monthLabel}
        </h2>
        <button
          type="button"
          aria-label="Next month"
          className={cn(
            'grid h-7 w-7 place-items-center rounded-full transition-colors',
            isCq
              ? 'text-[#374151] hover:bg-[#0A1020]/6'
              : 'rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900',
          )}
          onClick={() =>
            onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
          }
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-x-0.5 gap-y-1">
        {WEEKDAYS.map((wd) => (
          <span
            key={wd}
            className={cn(
              'flex h-6 items-center justify-center text-center',
              isCq
                ? CQ_LABEL
                : cn(
                    'font-medium uppercase text-slate-400',
                    isPlanner ? 'text-[9px]' : 'text-[10px]',
                  ),
            )}
          >
            {wd}
          </span>
        ))}
        {cells.map((cell, idx) => {
          const types = markedDatesByType?.get(cell.iso)
          const hasActivity = types?.size || markedDates?.has(cell.iso)
          const isSelected = selectedDate === cell.iso
          const isToday = todayIso === cell.iso
          const dots = types
            ? DOT_ORDER.filter((k) => types.has(k)).slice(0, 3)
            : hasActivity
              ? (['syllabus'] as PlannerTimelineKind[])
              : []

          return (
            <div
              key={`${cell.iso}-${idx}`}
              className={cn(
                'flex items-center justify-center',
                isCq || isPlanner ? 'h-8' : 'h-9',
              )}
            >
              <button
                type="button"
                onClick={() => onSelectDate(cell.iso)}
                className={cn(
                  'relative flex items-center justify-center rounded-full tabular-nums transition-colors',
                  isCq
                    ? 'h-7 w-7 text-[12px]'
                    : cn(
                        isPlanner ? 'h-7 w-7 text-[11px]' : 'h-8 w-8 text-xs',
                      ),
                  !cell.inMonth && (isCq ? 'text-zinc-300' : 'text-slate-300'),
                  cell.inMonth &&
                    !isSelected &&
                    (isCq
                      ? 'font-medium text-[#374151] hover:bg-zinc-100'
                      : 'text-slate-800 hover:bg-slate-50'),
                  isSelected &&
                    (isCq
                      ? 'bg-[#0A1020] font-semibold text-white'
                      : 'bg-blue-600 font-semibold text-white'),
                  isToday &&
                    !isSelected &&
                    (isCq
                      ? 'font-semibold text-[#1D4ED8] ring-1 ring-[#2563EB]/45'
                      : 'ring-1 ring-blue-400'),
                )}
              >
                <span>{cell.day}</span>
                {dots.length > 0 && (
                  <span
                    className="absolute bottom-0.5 left-1/2 flex h-1 -translate-x-1/2 gap-px"
                    aria-hidden
                  >
                    {dots.map((kind) => (
                      <span
                        key={kind}
                        className={cn(
                          'h-1 w-1 rounded-full',
                          isSelected ? (isCq ? 'bg-amber-300' : 'bg-white/90') : EVENT_DOT[kind],
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {isCq && (
        <p className={cn('mt-3 text-center', CQ_META)}>Dots mark class, quiz, or study activity</p>
      )}
    </>
  )

  if (density === 'dashboard') {
    return <div className={className}>{body}</div>
  }

  if (isCq) {
    return (
      <CQCard className={cn('h-full', className)}>
        {body}
      </CQCard>
    )
  }

  return (
    <Card className={cn(PLANNER_CARD, 'h-full overflow-hidden', className)}>
      <div className={cn(PLANNER_BODY, 'h-full')}>{body}</div>
    </Card>
  )
}
