import { useState } from 'react'

import type { AuthUser } from '@/lib/auth'
import { toIsoDate } from '@/lib/calendar-events'
import type { PlannerTimelineItem } from '@/lib/learning-planner-derive'
import {
  CQ_BODY,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import { PlannerDayWorkspace } from './PlannerDayWorkspace'
import { PlannerEventDrawer, type PlannerNavTarget } from './PlannerEventDrawer'
import { PlannerMonthCalendar } from './PlannerMonthCalendar'
import { PLANNER_PAGE } from './planner-styles'
import { useLearningPlanner } from './useLearningPlanner'

interface LearningPlannerViewProps {
  user: AuthUser
  onNavigate: (page: PlannerNavTarget) => void
  embedded?: boolean
}

export function LearningPlannerView({ user, onNavigate, embedded }: LearningPlannerViewProps) {
  const planner = useLearningPlanner(user)
  const [selectedEvent, setSelectedEvent] = useState<PlannerTimelineItem | null>(null)

  const handleSetProgramStart = () => {
    planner.setProgramStart(toIsoDate(new Date()))
  }

  const needsRole = !planner.enrollment?.selected_role_id && !planner.loading
  const needsCareer = !planner.careerJourney && !planner.loading

  return (
    <div
      className={
        embedded
          ? 'space-y-3'
          : cn(
              CQ_PAGE_BG,
              'flex min-h-0 max-h-[calc(100dvh-4rem)] min-w-0 flex-col overflow-x-hidden overflow-y-auto',
              PLANNER_PAGE,
            )
      }
    >
      <div
        className={
          embedded
            ? undefined
            : cn(CQ_PAGE_CONTAINER, 'mx-auto flex w-full min-w-0 flex-1 flex-col gap-3')
        }
      >
        {!embedded && (
          <header className="shrink-0">
            <h1 className={CQ_PAGE_TITLE}>Learning Planner</h1>
            <p className={cn(CQ_BODY, 'mt-0.5')}>Pick a day. Plan and start from one place.</p>
          </header>
        )}

        <div
          className={cn(
            'grid min-h-0 flex-1 grid-cols-1 gap-3',
            'lg:grid-cols-12 lg:items-stretch',
            embedded ? 'min-h-[420px]' : 'lg:min-h-[min(640px,calc(100dvh-10rem))]',
          )}
        >
          <div className="min-h-0 lg:col-span-5 lg:h-full">
            <PlannerMonthCalendar
              density="planner"
              theme="cq"
              viewMonth={planner.viewMonth}
              onViewMonthChange={planner.setViewMonth}
              selectedDate={planner.selectedDate}
              onSelectDate={planner.setSelectedDate}
              markedDates={planner.markedDates}
              markedDatesByType={planner.markedDatesByType}
              className="h-full"
            />
          </div>
          <div className="min-h-0 lg:col-span-7 lg:h-full">
            <PlannerDayWorkspace
              selectedDate={planner.selectedDate}
              dayPlan={planner.dayPlan}
              timeline={planner.timeline}
              roadmapProgress={planner.roadmapProgress}
              anchor={planner.anchor}
              loading={planner.loading}
              primaryAction={planner.primaryAction}
              needsRole={needsRole}
              needsCareer={needsCareer}
              onNavigate={onNavigate}
              onSetProgramStart={
                planner.anchor.source === 'today' ? handleSetProgramStart : undefined
              }
              onEventClick={setSelectedEvent}
            />
          </div>
        </div>
      </div>

      <PlannerEventDrawer
        item={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onNavigate={onNavigate}
      />
    </div>
  )
}
