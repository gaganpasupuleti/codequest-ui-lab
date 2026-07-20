import { BookOpen } from 'lucide-react'

import type { DayLearningPlan } from '@/lib/learning-planner-derive'
import {
  getDemoNotesForDate,
  type CalendarClassNote,
} from '@/components/student-calendar/calendar-demo-data'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_BODY_STRONG,
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_HEAD,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface DayClassNotesProps {
  selectedDate: string
  dayPlan: DayLearningPlan | null
  loading: boolean
}

function NoteContent({ note }: { note: CalendarClassNote }) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className={CQ_BODY_STRONG}>{note.title}</h3>
        <p className={cn('mt-1', CQ_BODY)}>{note.summary}</p>
      </div>
      {note.bullets.length > 0 && (
        <ul className={cn('space-y-1', CQ_BODY)}>
          {note.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="text-[#708090]">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function DayClassNotes({ selectedDate, dayPlan, loading }: DayClassNotesProps) {
  const demoNote = getDemoNotesForDate(selectedDate)

  return (
    <CQCard className="flex h-full flex-col">
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <BookOpen className="h-4 w-4 shrink-0 text-[#0A1020]/70" aria-hidden />
          Class notes
        </h3>
        <span className={CQ_LABEL}>Instructor</span>
      </div>

      {loading ? (
        <div className="space-y-2" aria-hidden>
          <div className="h-4 w-2/3 animate-pulse rounded bg-[#0A1020]/8" />
          <div className="h-3 w-full animate-pulse rounded bg-[#0A1020]/8" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-[#0A1020]/8" />
        </div>
      ) : demoNote ? (
        <NoteContent note={demoNote} />
      ) : dayPlan && dayPlan.objectives.length > 0 ? (
        <div className="space-y-2">
          <p className={CQ_BODY_STRONG}>{dayPlan.topic}</p>
          <ul className={cn('space-y-1', CQ_BODY)}>
            {dayPlan.objectives.map((obj) => (
              <li key={obj} className="flex gap-2">
                <span className="text-[#708090]">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
          {dayPlan.estimatedMinutes > 0 && (
            <p className={cn('tabular-nums', CQ_META)}>~{dayPlan.estimatedMinutes} min planned</p>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#708090]/30 px-3 py-6 text-center">
          <div>
            <p className={cn(CQ_BODY, 'font-medium text-[#374151]')}>No class notes for this day</p>
            <p className={cn('mt-1', CQ_META)}>Notes appear after sessions or when posted.</p>
          </div>
        </div>
      )}
    </CQCard>
  )
}
