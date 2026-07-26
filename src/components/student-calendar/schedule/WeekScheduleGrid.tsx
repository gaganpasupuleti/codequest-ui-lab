import { toIsoDate } from '@/lib/calendar-events'
import { CQ_CARD } from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import { ScheduleEventBlock } from './ScheduleEventBlock'
import type { ScheduleEvent } from './schedule-types'
import {
  HOUR_END,
  HOUR_START,
  ROW_HEIGHT_PX,
  dayIndexInWeek,
  eventBlockStyle,
  formatDayHeader,
  formatHourLabel,
  minutesNow,
  weekDaysFrom,
} from './schedule-utils'

interface WeekScheduleGridProps {
  weekStart: Date
  selectedDate: string
  events: ScheduleEvent[]
  onSelectDate: (iso: string) => void
  onEventClick: (event: ScheduleEvent, rect: DOMRect) => void
}

const COLS = '56px repeat(7, minmax(0, 1fr))'

export function WeekScheduleGrid({
  weekStart,
  selectedDate,
  events,
  onSelectDate,
  onEventClick,
}: WeekScheduleGridProps) {
  const days = weekDaysFrom(weekStart)
  const todayIso = toIsoDate(new Date())
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)
  const gridHeight = (HOUR_END - HOUR_START) * ROW_HEIGHT_PX
  const now = minutesNow()
  const showNow =
    now >= HOUR_START * 60 &&
    now <= HOUR_END * 60 &&
    days.some((d) => toIsoDate(d) === todayIso)
  const nowTop = ((now - HOUR_START * 60) / 60) * ROW_HEIGHT_PX

  return (
    <div className={cn(CQ_CARD, 'flex min-h-0 flex-1 flex-col overflow-hidden')}>
      <div
        className="grid shrink-0 border-b border-[#E5E7EB] bg-[#FAFBFC]"
        style={{ gridTemplateColumns: COLS }}
      >
        <div className="flex items-end justify-end pb-2.5 pr-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
          IST
        </div>
        {days.map((day) => {
          const iso = toIsoDate(day)
          const { weekday, day: dayNum } = formatDayHeader(day)
          const selected = iso === selectedDate
          const isToday = iso === todayIso
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 border-l border-[#E5E7EB] py-2.5 transition',
                selected ? 'bg-white' : 'hover:bg-white/80',
              )}
            >
              <span
                className={cn(
                  'text-[11px] font-medium capitalize',
                  isToday ? 'text-[#2563EB]' : 'text-[#6B7280]',
                )}
              >
                {weekday}
              </span>
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md text-[14px] font-semibold tabular-nums',
                  selected && 'bg-[#111827] text-white',
                  isToday && !selected && 'bg-[#EFF6FF] text-[#2563EB]',
                  !selected && !isToday && 'text-[#111827]',
                )}
              >
                {dayNum}
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto bg-white [scrollbar-width:thin]">
        <div
          className="relative grid"
          style={{ gridTemplateColumns: COLS, minHeight: gridHeight }}
        >
          <div className="relative border-r border-[#F3F4F6]">
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative border-t border-[#F3F4F6]"
                style={{ height: ROW_HEIGHT_PX }}
              >
                <span className="absolute top-0 right-2 -translate-y-1/2 text-[11px] font-medium text-[#9CA3AF]">
                  {formatHourLabel(hour)}
                </span>
              </div>
            ))}
          </div>

          {days.map((day) => {
            const iso = toIsoDate(day)
            return (
              <div key={iso} className="relative border-r border-[#F3F4F6] last:border-r-0">
                {hours.map((hour) => (
                  <div
                    key={`${iso}-${hour}`}
                    className="border-t border-[#F3F4F6]"
                    style={{ height: ROW_HEIGHT_PX }}
                  />
                ))}
              </div>
            )
          })}

          <div className="pointer-events-none absolute inset-0" style={{ left: 56 }}>
            <div className="relative h-full w-full">
              {events.map((event) => {
                const dayIndex = dayIndexInWeek(event.date, weekStart)
                if (dayIndex < 0) return null
                const { top, height } = eventBlockStyle(event.startMinutes, event.endMinutes)
                return (
                  <div
                    key={event.id}
                    className="pointer-events-auto absolute"
                    style={{
                      top,
                      height,
                      left: `calc(${(dayIndex / 7) * 100}%)`,
                      width: `calc(${100 / 7}%)`,
                    }}
                  >
                    <ScheduleEventBlock
                      event={event}
                      compact={height < 52}
                      style={{ position: 'absolute', inset: '1px 3px' }}
                      onClick={onEventClick}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {showNow ? (
            <div
              className="pointer-events-none absolute right-0 left-14 z-10"
              style={{ top: nowTop }}
              aria-hidden
            >
              <div className="relative h-px bg-[#EF4444]">
                <span className="absolute -top-1.5 -left-1 h-2 w-2 rounded-full bg-[#EF4444]" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
