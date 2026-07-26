import {
  ArrowRight,
  BarChart3,
  Code2,
  Database,
  GitBranch,
  Keyboard,
  ListChecks,
} from 'lucide-react'

import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_CHIP,
  CQ_LABEL,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import {
  formatLastPracticeLabel,
  getCodePracticeSummary,
  getSqlPracticeSummary,
  getTypingPracticeSummary,
} from '@/lib/practice-progress-summary'
import { cn } from '@/lib/utils'

type StudioTarget =
  | 'practice-code'
  | 'practice-sql'
  | 'practice-typing'
  | 'practice-powerbi'
  | 'flow-roadmap'
  | 'assignments'
  | 'calendar'
  | 'roadmapper'

interface PracticeStudioPageProps {
  onNavigate: (page: StudioTarget) => void
}

const MODULES: {
  page: StudioTarget
  title: string
  blurb: string
  icon: typeof Code2
  summaryKey?: 'sql' | 'code' | 'typing'
}[] = [
  {
    page: 'practice-sql',
    title: 'SQL Practice',
    blurb: 'Queries, joins, and analytics drills.',
    icon: Database,
    summaryKey: 'sql',
  },
  {
    page: 'practice-code',
    title: 'Code Workbench',
    blurb: 'Language challenges with run & check.',
    icon: Code2,
    summaryKey: 'code',
  },
  {
    page: 'practice-typing',
    title: 'Typing Practice',
    blurb: 'Speed and accuracy drills for code.',
    icon: Keyboard,
    summaryKey: 'typing',
  },
  {
    page: 'practice-powerbi',
    title: 'Power BI',
    blurb: 'DAX and dashboard practice ground.',
    icon: BarChart3,
  },
  {
    page: 'flow-roadmap',
    title: 'Flow Path',
    blurb: 'Topic graphs for skill browsing.',
    icon: GitBranch,
  },
]

export function PracticeStudioPage({ onNavigate }: PracticeStudioPageProps) {
  const summaries = {
    sql: getSqlPracticeSummary(),
    code: getCodePracticeSummary(),
    typing: getTypingPracticeSummary(null),
  }

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <header>
          <h1 className={CQ_PAGE_TITLE}>Practice Studio</h1>
          <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
            Drill modules for your path. Graded quizzes and HackerRank code submits live under
            Assignments.
          </p>
        </header>

        <CQCard className="!py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={CQ_LABEL}>Path ↔ practice</p>
              <p className="mt-0.5 text-[13px] font-semibold text-[#111827]">
                Career Map sets the week · Assignments schedule work · Studio is where you drill
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate('assignments')}
                className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1D4ED8]"
              >
                <ListChecks className="h-3.5 w-3.5" aria-hidden />
                Open Assignments
              </button>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
              >
                Calendar
              </button>
              <button
                type="button"
                onClick={() => onNavigate('roadmapper')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
              >
                Career Map
              </button>
            </div>
          </div>
        </CQCard>

        <div>
          <h2 className={CQ_SECTION_TITLE}>Modules</h2>
          <p className={cn(CQ_META, 'mt-0.5')}>Local progress on this device.</p>
        </div>

        <ul className="grid min-w-0 auto-rows-fr grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((mod) => {
            const Icon = mod.icon
            const summary = mod.summaryKey ? summaries[mod.summaryKey] : null
            const status = summary
              ? summary.hasActivity
                ? `${summary.pct}% · ${formatLastPracticeLabel(summary.lastPracticeAt)}`
                : 'Not started'
              : 'Open module'

            return (
              <li key={mod.page} className="min-w-0">
                <CQCard className="flex h-full min-h-[8.5rem] flex-col">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-[#111827]">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="truncate text-[15px] font-semibold text-[#111827]">
                        {mod.title}
                      </h3>
                    </div>
                    {summary?.hasActivity ? (
                      <span className={cn(CQ_CHIP, 'shrink-0 bg-sky-50 text-sky-800')}>
                        {summary.pct}%
                      </span>
                    ) : (
                      <span className={cn(CQ_CHIP, 'shrink-0 bg-zinc-100 text-zinc-600')}>New</span>
                    )}
                  </div>
                  <p className={cn(CQ_META, 'line-clamp-2')}>{mod.blurb}</p>
                  <p className={cn(CQ_META, 'mt-2')}>{status}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate(mod.page)}
                    className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    Open
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </CQCard>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
