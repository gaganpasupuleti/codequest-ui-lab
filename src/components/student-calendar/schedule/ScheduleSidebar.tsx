import { ChevronLeft, ChevronRight } from 'lucide-react'

import { toIsoDate } from '@/lib/calendar-events'
import { CQ_CARD, CQ_LABEL } from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import type { ScheduleCategory, ScheduleFilters } from './schedule-types'
import { CATEGORY_META } from './schedule-types'
import { buildMonthCells, formatMonthYear } from './schedule-utils'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

const FILTER_KEYS: (keyof ScheduleFilters)[] = [
  'class',
  'quiz',
  'project',
  'practice',
  'focus',
]

interface ScheduleSidebarProps {
  viewMonth: Date
  selectedDate: string
  filters: ScheduleFilters
  onViewMonthChange: (date: Date) => void
  onSelectDate: (iso: string) => void
  onFiltersChange: (next: ScheduleFilters) => void
}

export function ScheduleSidebar({
  viewMonth,
  selectedDate,
  filters,
  onViewMonthChange,
  onSelectDate,
  onFiltersChange,
}: ScheduleSidebarProps) {
  const { year, month, cells } = buildMonthCells(viewMonth)
  const todayIso = toIsoDate(new Date())
  const monthLabel = formatMonthYear(new Date(year, month, 1))

  return (
    <aside className={cn(CQ_CARD, 'flex h-full min-h-0 w-full flex-col p-3.5 sm:p-4')}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-[#111827]">{monthLabel}</p>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Previous month"
            className="grid h-7 w-7 place-items-center rounded-md text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
            onClick={() => onViewMonthChange(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="grid h-7 w-7 place-items-center rounded-md text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
            onClick={() => onViewMonthChange(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-0.5 text-center">
        {WEEKDAYS.map((wd) => (
          <span key={wd} className="py-1 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            {wd}
          </span>
        ))}
        {cells.map((cell, idx) => {
          const selected = selectedDate === cell.iso
          const isToday = cell.iso === todayIso
          return (
            <button
              key={`${cell.iso}-${idx}`}
              type="button"
              onClick={() => onSelectDate(cell.iso)}
              className={cn(
                'mx-auto flex h-8 w-8 items-center justify-center rounded-md text-[12px] tabular-nums transition',
                !cell.inMonth && 'text-[#D1D5DB]',
                cell.inMonth && !selected && 'text-[#4B5563] hover:bg-[#F3F4F6]',
                selected && 'bg-[#111827] font-semibold text-white',
                isToday && !selected && cell.inMonth && 'font-semibold text-[#2563EB] ring-1 ring-[#2563EB]/35',
              )}
            >
              {cell.day}
            </button>
          )
        })}
      </div>

      <div className="mt-4 border-t border-[#E5E7EB] pt-3">
        <h3 className={cn(CQ_LABEL, 'mb-2')}>Show</h3>
        <ul className="space-y-1.5">
          {FILTER_KEYS.map((key) => {
            const meta = CATEGORY_META[key as ScheduleCategory]
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] text-[#374151] hover:bg-[#F9FAFB]">
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, [key]: e.target.checked })
                    }
                    className="h-3.5 w-3.5 rounded border-[#D1D5DB] accent-[#2563EB]"
                  />
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.swatch)} aria-hidden />
                  {meta.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
