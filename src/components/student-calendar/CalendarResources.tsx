import { FileText, Film, FolderGit2, Presentation } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  getDemoResourcesForDate,
  type CalendarResourceLink,
} from '@/components/student-calendar/calendar-demo-data'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_BODY_STRONG,
  CQ_META,
  CQ_SECTION_HEAD,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface CalendarResourcesProps {
  selectedDate: string
}

const KIND_META: Record<CalendarResourceLink['kind'], { label: string; icon: ReactNode }> = {
  slides: { label: 'Slide deck', icon: <Presentation className="h-4 w-4" aria-hidden /> },
  recording: { label: 'Recording', icon: <Film className="h-4 w-4" aria-hidden /> },
  doc: { label: 'Handout', icon: <FileText className="h-4 w-4" aria-hidden /> },
  repo: { label: 'Code repo', icon: <FolderGit2 className="h-4 w-4" aria-hidden /> },
}

export function CalendarResources({ selectedDate }: CalendarResourcesProps) {
  const resources = getDemoResourcesForDate(selectedDate)

  return (
    <CQCard className="flex h-full flex-col sm:col-span-2 xl:col-span-1">
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <FileText className="h-4 w-4 shrink-0 text-[#0A1020]/70" aria-hidden />
          Resources
        </h3>
      </div>

      {resources.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#708090]/30 px-3 py-6 text-center">
          <div>
            <p className={cn(CQ_BODY, 'font-medium text-[#374151]')}>No resources for this day</p>
            <p className={cn('mt-1', CQ_META)}>Slides and handouts appear when shared.</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {resources.map((resource) => {
            const meta = KIND_META[resource.kind]
            return (
              <li key={resource.label}>
                <div className="flex items-center gap-2.5 rounded-lg border border-[#708090]/15 bg-[#FAF3E0]/60 px-2.5 py-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0A1020]/8 text-[#374151]">
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={cn('truncate', CQ_BODY_STRONG)}>{resource.label}</p>
                    <p className={CQ_META}>{meta.label}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </CQCard>
  )
}
