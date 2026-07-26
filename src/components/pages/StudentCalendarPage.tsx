import { useMemo, useState } from 'react'

import type { AuthUser } from '@/lib/auth'
import { toIsoDate } from '@/lib/calendar-events'
import { ClassCalendar } from '@/components/student-calendar/ClassCalendar'
import { useLearningPlanner } from '@/components/learning-planner/useLearningPlanner'
import {
  CQ_CARD,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import { DayScheduleGrid } from '@/components/student-calendar/schedule/DayScheduleGrid'
import { EventDetailPopover } from '@/components/student-calendar/schedule/EventDetailPopover'
import { ScheduleSidebar } from '@/components/student-calendar/schedule/ScheduleSidebar'
import { ScheduleToolbar } from '@/components/student-calendar/schedule/ScheduleToolbar'
import { WeekScheduleGrid } from '@/components/student-calendar/schedule/WeekScheduleGrid'
import { buildScheduleDemoEvents } from '@/components/student-calendar/schedule/schedule-demo'
import {
  DEFAULT_FILTERS,
  type ScheduleEvent,
  type ScheduleFilters,
  type ScheduleView,
} from '@/components/student-calendar/schedule/schedule-types'
import {
  addDays,
  eventsForDate,
  eventsForWeek,
  filterEvents,
  getMondayOfWeek,
  parseIsoDate,
} from '@/components/student-calendar/schedule/schedule-utils'

type CalendarNavPage =
  | 'calendar'
  | 'practice-studio'
  | 'practice-code'
  | 'practice-sql'
  | 'practice-typing'
  | 'live-classes'
  | 'assignments'
  | 'study-materials'
  | 'settings'
  | 'progress'
  | 'dashboard'
  | 'roadmapper'

interface StudentCalendarPageProps {
  user: AuthUser
  onNavigate: (page: CalendarNavPage) => void
}

export function StudentCalendarPage({ user }: StudentCalendarPageProps) {
  const planner = useLearningPlanner(user)

  const [view, setView] = useState<ScheduleView>('week')
  const [selectedDate, setSelectedDate] = useState(() => planner.selectedDate)
  const [viewMonth, setViewMonth] = useState(() => planner.viewMonth)
  const [filters, setFilters] = useState<ScheduleFilters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState('')
  const [activeEvent, setActiveEvent] = useState<ScheduleEvent | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  const allEvents = useMemo(() => buildScheduleDemoEvents(), [])
  const selected = parseIsoDate(selectedDate)
  const weekStart = useMemo(() => getMondayOfWeek(selected), [selectedDate])

  const visibleEvents = useMemo(() => {
    const filtered = filterEvents(allEvents, filters)
    const q = search.trim().toLowerCase()
    if (!q) return filtered
    return filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(q) ||
        event.subtitle?.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q),
    )
  }, [allEvents, filters, search])

  const weekEvents = useMemo(
    () => eventsForWeek(visibleEvents, weekStart),
    [visibleEvents, weekStart],
  )
  const dayEvents = useMemo(
    () => eventsForDate(visibleEvents, selectedDate),
    [visibleEvents, selectedDate],
  )

  const handleSelectDate = (iso: string) => {
    setSelectedDate(iso)
    setViewMonth(parseIsoDate(iso))
    planner.setSelectedDate(iso)
  }

  const handleToday = () => {
    handleSelectDate(toIsoDate(new Date()))
  }

  const handlePrev = () => {
    if (view === 'day') {
      handleSelectDate(toIsoDate(addDays(selected, -1)))
      return
    }
    if (view === 'week') {
      handleSelectDate(toIsoDate(addDays(weekStart, -7)))
      return
    }
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
    setViewMonth(next)
    handleSelectDate(toIsoDate(next))
  }

  const handleNext = () => {
    if (view === 'day') {
      handleSelectDate(toIsoDate(addDays(selected, 1)))
      return
    }
    if (view === 'week') {
      handleSelectDate(toIsoDate(addDays(weekStart, 7)))
      return
    }
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
    setViewMonth(next)
    handleSelectDate(toIsoDate(next))
  }

  const handleEventClick = (event: ScheduleEvent, rect: DOMRect) => {
    setActiveEvent(event)
    setAnchorRect(rect)
  }

  const toolbarAnchor = view === 'week' ? weekStart : selected

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div
        className={cn(
          CQ_PAGE_CONTAINER,
          'grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]',
          CQ_STACK_GAP,
        )}
      >
        <div className="min-h-0 lg:sticky lg:top-3 lg:self-start">
          <ScheduleSidebar
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            filters={filters}
            onViewMonthChange={setViewMonth}
            onSelectDate={handleSelectDate}
            onFiltersChange={setFilters}
          />
        </div>

        <div className={cn('flex min-h-0 min-w-0 flex-col', CQ_STACK_GAP)}>
          <ScheduleToolbar
            view={view}
            anchorDate={toolbarAnchor}
            search={search}
            onViewChange={setView}
            onSearchChange={setSearch}
            onToday={handleToday}
            onPrev={handlePrev}
            onNext={handleNext}
            onJoin={() => {
              const nextLive = weekEvents.find((event) => event.category === 'class')
              if (nextLive) handleEventClick(nextLive, new DOMRect(120, 120, 0, 0))
            }}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {view === 'week' ? (
              <WeekScheduleGrid
                weekStart={weekStart}
                selectedDate={selectedDate}
                events={weekEvents}
                onSelectDate={handleSelectDate}
                onEventClick={handleEventClick}
              />
            ) : null}

            {view === 'day' ? (
              <DayScheduleGrid
                date={selected}
                events={dayEvents}
                onEventClick={handleEventClick}
              />
            ) : null}

            {view === 'month' ? (
              <div className={cn(CQ_CARD, 'min-h-0 flex-1 overflow-auto p-3.5 sm:p-4')}>
                <ClassCalendar
                  viewMonth={viewMonth}
                  onViewMonthChange={setViewMonth}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  markedDates={planner.markedDates}
                  markedDatesByType={planner.markedDatesByType}
                />
                <p className={cn(CQ_META, 'mt-3')}>
                  {dayEvents.length} class{dayEvents.length === 1 ? '' : 'es'} on{' '}
                  {selected.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                  . Use Week or Day for the timetable.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activeEvent ? (
        <EventDetailPopover
          event={activeEvent}
          anchorRect={anchorRect}
          onClose={() => {
            setActiveEvent(null)
            setAnchorRect(null)
          }}
        />
      ) : null}
    </div>
  )
}
