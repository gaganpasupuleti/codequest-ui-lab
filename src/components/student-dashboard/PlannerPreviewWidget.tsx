import { ArrowRight, CalendarDays } from 'lucide-react'

import { PlannerMonthCalendar } from '@/components/learning-planner/PlannerMonthCalendar'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import type { DayLearningPlan } from '@/lib/learning-planner-derive'
import { cn } from '@/lib/utils'

interface PlannerPreviewWidgetProps {
  dayPlan: DayLearningPlan | null
  viewMonth: Date
  onViewMonthChange: (month: Date) => void
  selectedDate: string
  markedDates: Set<string>
  loading: boolean
  onOpenPlanner: () => void
  onSelectDate: (date: string) => void
}

export function PlannerPreviewWidget({
  dayPlan,
  viewMonth,
  onViewMonthChange,
  selectedDate,
  markedDates,
  loading,
  onOpenPlanner,
  onSelectDate,
}: PlannerPreviewWidgetProps) {
  return (
    <CQCard className="p-3.5 sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-[#2563EB]" aria-hidden />
        <h2 className={CQ_SECTION_TITLE}>Calendar</h2>
      </div>

      <PlannerMonthCalendar
        density="dashboard"
        theme="cq"
        viewMonth={viewMonth}
        onViewMonthChange={onViewMonthChange}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        markedDates={markedDates}
      />

      <div className="mt-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3">
        <p className={CQ_LABEL}>Selected day focus</p>
        {loading ? (
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-[#E5E7EB]" aria-hidden />
        ) : (
          <p className="mt-1 text-[13px] font-semibold text-[#111827]">
            {dayPlan?.topic ?? 'Select a date to preview'}
          </p>
        )}
        {dayPlan && !loading ? (
          <p className={cn(CQ_META, 'mt-1')}>{dayPlan.estimatedMinutes} min estimated</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpenPlanner}
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#374151] transition hover:bg-[#F9FAFB]"
      >
        Open calendar
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </CQCard>
  )
}
