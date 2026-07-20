import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'

import type { AuthUser } from '@/lib/auth'
import { deriveStageJourneyFallback } from '@/lib/dashboard-derive'
import { useStudentDashboardSnapshot } from '@/components/student-dashboard/useStudentDashboardSnapshot'
import {
  CQ_BODY,
  CQ_META,
  CQ_METRIC,
  CQ_PAGE_BG,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import {
  buildSkillProgressItems,
  type SkillNavTarget,
} from '@/components/student-progress/skill-progress-items'
import { ProgressJourneyFlow } from '@/components/student-progress/ProgressJourneyFlow'
import { cn } from '@/lib/utils'

interface StudentProgressPageProps {
  user: AuthUser
  onNavigate: (page: SkillNavTarget) => void
}

export function StudentProgressPage({ user, onNavigate }: StudentProgressPageProps) {
  const snapshot = useStudentDashboardSnapshot(user)
  const skillItems = buildSkillProgressItems(snapshot.typingAttempts, {
    submittedProjects: snapshot.submittedProjects,
    careerJourney: snapshot.careerJourney,
    stageRows: snapshot.stageRows,
    catalogSteps: snapshot.catalogSteps,
  })

  const fallback =
    !snapshot.careerJourney && snapshot.stageRows
      ? deriveStageJourneyFallback(snapshot.stageRows)
      : null
  const coursePct = snapshot.careerJourney?.pct ?? fallback?.progressPct ?? 0
  const approvedProjects = snapshot.submittedProjects.filter((p) => p.status === 'approved').length
  const avgQuiz = useMemo(() => {
    const rows = snapshot.stageRows
    if (!rows || rows.length === 0) return null
    return Math.round(rows.reduce((s, r) => s + r.latest_quiz_score, 0) / rows.length)
  }, [snapshot.stageRows])

  const pathTitle = snapshot.careerJourney?.title ?? fallback?.currentStageLabel ?? 'Learning path'

  return (
    <div className={cn(CQ_PAGE_BG, 'flex h-full min-h-0 flex-1 flex-col overflow-hidden')}>
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#708090]/18 bg-[#FFFDF6]/80 px-3 py-2.5 backdrop-blur-sm md:px-4">
        <div className="min-w-0">
          <h1 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2 text-[16px] sm:text-[18px]')}>
            <TrendingUp className="h-4 w-4 shrink-0 text-[#0A1020]/70" aria-hidden />
            Progress map
          </h1>
          <p className={cn(CQ_META, 'mt-0.5 truncate')}>
            {pathTitle}
            {snapshot.loading ? ' · Loading…' : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MetricChip label="Course" value={snapshot.loading ? '…' : `${coursePct}%`} tone="sage" />
          <MetricChip
            label="Quiz avg"
            value={snapshot.loading ? '…' : avgQuiz !== null ? `${avgQuiz}%` : '—'}
            tone="lavender"
          />
          <MetricChip
            label="Projects"
            value={
              snapshot.loading
                ? '…'
                : `${approvedProjects}/${snapshot.submittedProjects.length || 0}`
            }
            tone="yellow"
          />
          <button
            type="button"
            onClick={() => onNavigate('roadmapper')}
            className="inline-flex items-center rounded-full bg-[#0A1020] px-3 py-1.5 text-[12px] font-semibold text-[#FAF3E0] hover:bg-[#121A2E]"
          >
            Career Map
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {snapshot.loading ? (
          <div className="flex h-full items-center justify-center">
            <p className={CQ_BODY}>Building your process map…</p>
          </div>
        ) : (
          <ProgressJourneyFlow
            careerJourney={snapshot.careerJourney}
            stageRows={snapshot.stageRows}
            skillItems={skillItems}
            onNavigate={onNavigate}
          />
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-[#708090]/18 bg-[#FFFDF6]/90 px-3 py-1.5 text-[11px] md:px-4">
        <LegendDot className="bg-[#C2CDB0]" label="Done" />
        <LegendDot className="bg-[#DDD0F5]" label="In progress" />
        <LegendDot className="bg-[#FFFDF6] ring-1 ring-[#708090]/25" label="Up next" />
        <span className={cn('ml-auto', CQ_META)}>Click a node for details · drag to pan · scroll to zoom</span>
      </footer>
    </div>
  )
}

function MetricChip({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'sage' | 'lavender' | 'yellow'
}) {
  const toneClass =
    tone === 'sage'
      ? 'bg-[#C2CDB0]/55'
      : tone === 'lavender'
        ? 'bg-[#DDD0F5]/55'
        : 'bg-[#F3DFA0]/55'

  return (
    <div className={cn('rounded-xl px-2.5 py-1.5', toneClass)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0A1020]/55">{label}</p>
      <p className={cn(CQ_METRIC, 'mt-0.5 text-[18px]')}>{value}</p>
    </div>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', CQ_META)}>
      <span className={cn('h-2.5 w-2.5 rounded-full', className)} />
      {label}
    </span>
  )
}
