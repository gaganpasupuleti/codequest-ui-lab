import { CalendarDays } from 'lucide-react'

import type { AuthUser } from '@/lib/auth'
import { AssignmentList } from '@/components/student-calendar/AssignmentList'
import { CalendarResources } from '@/components/student-calendar/CalendarResources'
import { ClassCalendar } from '@/components/student-calendar/ClassCalendar'
import { DayClassNotes } from '@/components/student-calendar/DayClassNotes'
import { SelectedDaySummary } from '@/components/student-calendar/SelectedDaySummary'
import { useLearningPlanner } from '@/components/learning-planner/useLearningPlanner'
import { useStudentDashboardSnapshot } from '@/components/student-dashboard/useStudentDashboardSnapshot'
import {
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_PAD,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface StudentCalendarPageProps {
  user: AuthUser
}

export function StudentCalendarPage({ user }: StudentCalendarPageProps) {
  const planner = useLearningPlanner(user)
  const snapshot = useStudentDashboardSnapshot(user)

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD, 'w-full')}>
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h1 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2 text-[18px] sm:text-[20px]')}>
            <CalendarDays className="h-5 w-5 shrink-0 text-[#0A1020]/70" aria-hidden />
            Class calendar
          </h1>
          <p className={cn(CQ_META, 'mt-0.5')}>
            Select a day for schedule, notes, assignments, and materials.
          </p>
        </div>
      </header>

      <div className={cn('grid lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:items-start', CQ_STACK_GAP)}>
        <div className="lg:sticky lg:top-4">
          <ClassCalendar
            viewMonth={planner.viewMonth}
            onViewMonthChange={planner.setViewMonth}
            selectedDate={planner.selectedDate}
            onSelectDate={planner.setSelectedDate}
            markedDates={planner.markedDates}
            markedDatesByType={planner.markedDatesByType}
          />
        </div>

        <div className={cn('flex min-w-0 flex-col', CQ_STACK_GAP)}>
          <SelectedDaySummary
            selectedDate={planner.selectedDate}
            sessions={snapshot.upcomingSessions}
            dayPlan={planner.dayPlan}
            loading={planner.loading || snapshot.loading}
          />

          <div className={cn('grid sm:grid-cols-2 xl:grid-cols-3', CQ_STACK_GAP)}>
            <DayClassNotes
              selectedDate={planner.selectedDate}
              dayPlan={planner.dayPlan}
              loading={planner.loading}
            />
            <AssignmentList
              selectedDate={planner.selectedDate}
              deadlines={snapshot.deadlines}
              loading={snapshot.loading}
            />
            <CalendarResources selectedDate={planner.selectedDate} />
          </div>
        </div>
      </div>
    </div>
  )
}
