import { toIsoDate } from '@/lib/calendar-events'
import { CQ_CARD } from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import { ScheduleEventBlock } from './ScheduleEventBlock'
import { SCHEDULE_TRACKS, type ScheduleEvent, type ScheduleTrackId } from './schedule-types'
import {
  HOUR_END,
  HOUR_START,
  ROW_HEIGHT_PX,
  eventBlockStyle,
  formatClockFromMinutes,
  formatHourLabel,
  minutesNow,
} from './schedule-utils'

interface DayScheduleGridProps {
  date: Date
  events: ScheduleEvent[]
  onEventClick: (event: ScheduleEvent, rect: DOMRect) => void
}

export function DayScheduleGrid({ date, events, onEventClick }: DayScheduleGridProps) {
  const halfHours = Array.from(
    { length: (HOUR_END - HOUR_START) * 2 },
    (_, i) => HOUR_START * 60 + i * 30,
  )
  const gridHeight = (HOUR_END - HOUR_START) * ROW_HEIGHT_PX
  const isToday = toIsoDate(date) === toIsoDate(new Date())
  const now = minutesNow()
  const showNow = isToday && now >= HOUR_START * 60 && now <= HOUR_END * 60
  const nowTop = ((now - HOUR_START * 60) / 60) * ROW_HEIGHT_PX

  const byTrack = (trackId: ScheduleTrackId) =>
    events.filter((event) => event.trackId === trackId)

  const cols = `56px repeat(${SCHEDULE_TRACKS.length}, minmax(120px, 1fr))`

  return (
    <div className={cn(CQ_CARD, 'flex min-h-0 flex-1 flex-col overflow-hidden')}>
      <div
        className="grid shrink-0 border-b border-[#E5E7EB] bg-[#FAFBFC]"
        style={{ gridTemplateColumns: cols }}
      >
        <div aria-hidden />
        {SCHEDULE_TRACKS.map((track) => (
          <div
            key={track.id}
            className="flex min-w-0 items-center gap-2 border-l border-[#E5E7EB] px-2.5 py-2.5"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#111827] text-[10px] font-bold text-white">
              {track.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#111827]">{track.label}</p>
              <p className="truncate text-[11px] text-[#6B7280]">{track.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
        <div
          className="relative grid min-w-[860px]"
          style={{ gridTemplateColumns: cols, minHeight: gridHeight }}
        >
          <div className="relative border-r border-[#F3F4F6]">
            {halfHours.map((minute) => {
              const isHour = minute % 60 === 0
              return (
                <div
                  key={minute}
                  className="relative border-t border-[#F3F4F6]"
                  style={{ height: ROW_HEIGHT_PX / 2 }}
                >
                  {isHour ? (
                    <span className="absolute top-0 right-2 -translate-y-1/2 text-[11px] font-medium text-[#9CA3AF]">
                      {formatHourLabel(minute / 60)}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>

          {SCHEDULE_TRACKS.map((track) => (
            <div key={track.id} className="relative border-r border-[#F3F4F6] last:border-r-0">
              {halfHours.map((minute) => (
                <div
                  key={`${track.id}-${minute}`}
                  className="border-t border-[#F3F4F6]"
                  style={{ height: ROW_HEIGHT_PX / 2 }}
                />
              ))}

              {byTrack(track.id).map((event) => {
                const { top, height } = eventBlockStyle(event.startMinutes, event.endMinutes)
                return (
                  <div key={event.id} className="absolute inset-x-0" style={{ top, height }}>
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
          ))}

          {showNow ? (
            <div
              className="pointer-events-none absolute right-0 left-14 z-20"
              style={{ top: nowTop }}
              aria-hidden
            >
              <div className="relative flex items-center">
                <span className="absolute -left-11 rounded bg-[#EF4444] px-1 py-0.5 text-[10px] font-bold text-white tabular-nums">
                  {formatClockFromMinutes(now).replace(' ', '')}
                </span>
                <div className="h-px w-full bg-[#EF4444]" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
