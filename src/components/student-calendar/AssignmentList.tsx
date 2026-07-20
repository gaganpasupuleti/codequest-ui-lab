import { CheckCircle2, Circle, ListChecks } from 'lucide-react'

import {
  getDemoAssignmentsForDate,
  type CalendarAssignmentDue,
} from '@/components/student-calendar/calendar-demo-data'
import { mergeDeadlines, type DeadlineItem } from '@/lib/dashboard-derive'
import type { UpcomingDeadlines } from '@/lib/api'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_CHIP,
  CQ_META,
  CQ_SECTION_HEAD,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface AssignmentListProps {
  selectedDate: string
  deadlines: UpcomingDeadlines
  loading: boolean
}

const TYPE_LABEL: Record<CalendarAssignmentDue['type'], string> = {
  quiz: 'Quiz',
  project: 'Project',
  practice: 'Practice',
}

function AssignmentRow({
  item,
  type,
}: {
  item: CalendarAssignmentDue | (DeadlineItem & { type?: string })
  type?: CalendarAssignmentDue['type']
}) {
  const done = 'done' in item ? item.done : false
  const title = item.title

  return (
    <li className="flex items-start gap-2 rounded-lg border border-[#708090]/15 bg-[#FAF3E0]/60 px-2.5 py-2">
      {done ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#708090]" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <span className={cn(CQ_BODY, done ? 'text-[#9CA3AF] line-through' : 'font-medium text-[#111827]')}>
          {title}
        </span>
        {type && <span className={cn('mt-0.5 block', CQ_META)}>{TYPE_LABEL[type]}</span>}
      </div>
    </li>
  )
}

export function AssignmentList({ selectedDate, deadlines, loading }: AssignmentListProps) {
  const apiItems = mergeDeadlines(deadlines).filter((d) => d.due === selectedDate)
  const demoItems = getDemoAssignmentsForDate(selectedDate)
  const hasAny = apiItems.length > 0 || demoItems.length > 0
  const count = apiItems.length + demoItems.length

  return (
    <CQCard className="flex h-full flex-col">
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <ListChecks className="h-4 w-4 shrink-0 text-[#0A1020]/70" aria-hidden />
          Assignments
        </h3>
        {count > 0 && (
          <span className={cn(CQ_CHIP, 'bg-[#FBBF24]/25 tabular-nums text-[#92400E]')}>{count}</span>
        )}
      </div>

      {loading ? (
        <ul className="space-y-2" aria-hidden>
          <li className="h-10 animate-pulse rounded-lg bg-[#0A1020]/8" />
          <li className="h-10 animate-pulse rounded-lg bg-[#0A1020]/8" />
        </ul>
      ) : !hasAny ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#708090]/30 px-3 py-6 text-center">
          <div>
            <p className={cn(CQ_BODY, 'font-medium text-[#374151]')}>No assignments due this day</p>
            <p className={cn('mt-1', CQ_META)}>Check nearby dates for quizzes and projects.</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {apiItems.map((item) => (
            <AssignmentRow key={item.key} item={item} />
          ))}
          {demoItems.map((item) => (
            <AssignmentRow key={`demo-${item.title}`} item={item} type={item.type} />
          ))}
        </ul>
      )}
    </CQCard>
  )
}
