import { CalendarDays, Clock } from 'lucide-react'

import type { UpcomingSession } from '@/lib/api'
import type { DayLearningPlan } from '@/lib/learning-planner-derive'
import { formatSessionDate, formatTime, toIsoDate } from '@/lib/dashboard-derive'
import {
  getDemoAssignmentsForDate,
  getDemoNotesForDate,
  getDemoResourcesForDate,
} from '@/components/student-calendar/calendar-demo-data'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_BODY_STRONG,
  CQ_CHIP,
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface SelectedDaySummaryProps {
  selectedDate: string
  sessions: UpcomingSession[]
  dayPlan: DayLearningPlan | null
  loading: boolean
}

function formatLongDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SelectedDaySummary({
  selectedDate,
  sessions,
  dayPlan,
  loading,
}: SelectedDaySummaryProps) {
  const today = toIsoDate(new Date())
  const session = sessions.find((s) => s.session_date === selectedDate)
  const relativeLabel = formatSessionDate(selectedDate)
  const note = getDemoNotesForDate(selectedDate)
  const assignmentCount = getDemoAssignmentsForDate(selectedDate).length
  const resourceCount = getDemoResourcesForDate(selectedDate).length

  const hasClass = Boolean(session)
  const hasFocus = Boolean(dayPlan?.topic || note)
  const hasWork = assignmentCount > 0 || resourceCount > 0

  return (
    <CQCard>
      {loading ? (
        <div className="space-y-2.5" aria-hidden>
          <div className="h-5 w-2/3 animate-pulse rounded bg-[#0A1020]/8" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[#0A1020]/8" />
          <div className="h-14 w-full animate-pulse rounded-xl bg-[#0A1020]/8" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={CQ_LABEL}>Selected day</p>
              <h2 className={cn(CQ_SECTION_TITLE, 'mt-1 text-[17px] sm:text-[18px]')}>
                {formatLongDate(selectedDate)}
              </h2>
              <p className={cn(CQ_META, 'mt-0.5')}>
                {relativeLabel}
                {selectedDate === today ? ' · Today' : ''}
              </p>
            </div>
            <CalendarDays className="h-6 w-6 shrink-0 text-[#0A1020]/55" aria-hidden />
          </div>

          {session ? (
            <div className="mt-3 rounded-xl border border-[#708090]/15 bg-[#FAF3E0]/70 px-3 py-2.5">
              <p className={CQ_BODY_STRONG}>{session.title}</p>
              {session.topic && <p className={cn('mt-0.5', CQ_BODY)}>{session.topic}</p>}
              <p className={cn('mt-1.5 inline-flex items-center gap-1.5', CQ_META)}>
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {formatTime(session.start_time)} – {formatTime(session.end_time)}
              </p>
            </div>
          ) : (
            <p className={cn('mt-3', CQ_BODY)}>No live class scheduled for this day.</p>
          )}

          {(hasFocus || hasWork) && (
            <dl className={cn('mt-3 grid grid-cols-2 sm:grid-cols-3', CQ_STACK_GAP)}>
              {dayPlan?.topic && (
                <div className="rounded-lg border border-[#708090]/15 bg-[#FAF3E0]/60 px-2.5 py-2">
                  <dt className={CQ_META}>Focus</dt>
                  <dd className={cn('mt-0.5 truncate', CQ_BODY_STRONG)}>{dayPlan.topic}</dd>
                </div>
              )}
              {note && !dayPlan?.topic && (
                <div className="rounded-lg border border-[#708090]/15 bg-[#FAF3E0]/60 px-2.5 py-2">
                  <dt className={CQ_META}>Notes</dt>
                  <dd className={cn('mt-0.5 truncate', CQ_BODY_STRONG)}>{note.title}</dd>
                </div>
              )}
              <div className="rounded-lg border border-[#708090]/15 bg-[#FAF3E0]/60 px-2.5 py-2">
                <dt className={CQ_META}>Assignments</dt>
                <dd className={cn(CQ_CHIP, 'mt-1 bg-[#F3DFA0]/55 tabular-nums text-[#92400E]')}>
                  {assignmentCount}
                </dd>
              </div>
              <div className="rounded-lg border border-[#708090]/15 bg-[#FAF3E0]/60 px-2.5 py-2">
                <dt className={CQ_META}>Resources</dt>
                <dd className={cn(CQ_CHIP, 'mt-1 bg-[#B8C9E8]/45 tabular-nums text-[#1D4ED8]')}>
                  {resourceCount}
                </dd>
              </div>
            </dl>
          )}

          {!hasClass && !hasFocus && !hasWork && (
            <p className={cn('mt-3 rounded-xl border border-dashed border-[#708090]/30 px-3 py-3', CQ_META)}>
              Pick another date to see class notes, assignments, and materials.
            </p>
          )}
        </>
      )}
    </CQCard>
  )
}
