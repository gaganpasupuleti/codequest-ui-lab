import { ChevronLeft, ChevronRight, Search, Video } from 'lucide-react'

import { CQ_PAGE_TITLE } from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import type { ScheduleView } from './schedule-types'
import { formatMonthYear, formatToolbarDate } from './schedule-utils'

interface ScheduleToolbarProps {
  view: ScheduleView
  anchorDate: Date
  search: string
  onViewChange: (view: ScheduleView) => void
  onSearchChange: (value: string) => void
  onToday: () => void
  onPrev: () => void
  onNext: () => void
  onJoin?: () => void
}

const VIEWS: ScheduleView[] = ['month', 'week', 'day']

export function ScheduleToolbar({
  view,
  anchorDate,
  search,
  onViewChange,
  onSearchChange,
  onToday,
  onPrev,
  onNext,
  onJoin,
}: ScheduleToolbarProps) {
  let title: string
  switch (view) {
    case 'day':
      title = formatToolbarDate(anchorDate)
      break
    case 'week':
      title = `Week of ${anchorDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`
      break
    case 'month':
      title = formatMonthYear(anchorDate)
      break
    default: {
      const _exhaustive: never = view
      throw new Error(`Unhandled schedule view: ${String(_exhaustive)}`)
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h1 className={CQ_PAGE_TITLE}>{title}</h1>
          <button
            type="button"
            onClick={onToday}
            className="h-8 rounded-md border border-[#E5E7EB] bg-white px-2.5 text-[12px] font-semibold text-[#374151] transition hover:bg-[#F9FAFB]"
          >
            Today
          </button>
          <div className="inline-flex items-center">
            <button
              type="button"
              aria-label="Previous"
              onClick={onPrev}
              className="grid h-8 w-8 place-items-center rounded-md text-[#6B7280] transition hover:bg-[#EEF0F3] hover:text-[#111827]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={onNext}
              className="grid h-8 w-8 place-items-center rounded-md text-[#6B7280] transition hover:bg-[#EEF0F3] hover:text-[#111827]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex h-8 rounded-md bg-[#E8ECF1] p-0.5"
            role="tablist"
            aria-label="Calendar view"
          >
            {VIEWS.map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={view === option}
                onClick={() => onViewChange(option)}
                className={cn(
                  'rounded px-2.5 text-[12px] font-semibold capitalize transition',
                  view === option
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]',
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onJoin}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#111827] px-3 text-[12px] font-semibold text-white transition hover:bg-[#0B0E14]"
          >
            <Video className="h-3.5 w-3.5" aria-hidden />
            Join
          </button>
        </div>
      </div>

      <label className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]"
          aria-hidden
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search classes"
          aria-label="Search schedule"
          className="h-8 w-full rounded-md border border-[#E5E7EB] bg-white pr-3 pl-8 text-[13px] text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#2563EB]/20"
        />
      </label>
    </div>
  )
}
