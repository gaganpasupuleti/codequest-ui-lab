import { ArrowRight, Clock, Map } from 'lucide-react'

import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import type {
  DayLearningPlan,
  PlannerTimelineItem,
  ProgramAnchor,
  RoadmapProgress,
} from '@/lib/learning-planner-derive'
import { cn } from '@/lib/utils'

import {
  executePlannerAction,
  type PlannerAction,
  type PlannerNavTarget,
} from './planner-actions'
import { EVENT_BADGE } from './planner-styles'

interface PlannerDayWorkspaceProps {
  selectedDate: string
  dayPlan: DayLearningPlan
  timeline: PlannerTimelineItem[]
  roadmapProgress: RoadmapProgress
  anchor: ProgramAnchor
  loading: boolean
  primaryAction: PlannerAction | null
  needsRole: boolean
  needsCareer: boolean
  onNavigate: (page: PlannerNavTarget) => void
  onSetProgramStart?: () => void
  onEventClick: (item: PlannerTimelineItem) => void
}

function formatLongDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function PlannerDayWorkspace({
  selectedDate,
  dayPlan,
  timeline,
  roadmapProgress,
  anchor,
  loading,
  primaryAction,
  needsRole,
  needsCareer,
  onNavigate,
  onSetProgramStart,
  onEventClick,
}: PlannerDayWorkspaceProps) {
  const practicePreview = dayPlan.practiceTasks.slice(0, 3)

  return (
    <CQCard className="flex h-full min-h-0 flex-col !p-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#E5E7EB] px-4 py-3.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={CQ_LABEL}>Selected day</p>
            <h2 className="mt-0.5 text-[20px] font-semibold tracking-normal text-[#111827]">
              {formatLongDate(selectedDate)}
            </h2>
            <p className={cn(CQ_META, 'mt-0.5')}>
              {roadmapProgress.stageLabel} · Month {roadmapProgress.month} · Week{' '}
              {roadmapProgress.week}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('roadmapper')}
            className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
          >
            <Map className="h-3.5 w-3.5" aria-hidden />
            Career Map
          </button>
        </div>

        {(needsRole || needsCareer) && (
          <p className={cn(CQ_META, 'rounded-lg bg-zinc-50 px-2.5 py-2')}>
            {needsCareer ? (
              <>
                No career path yet —{' '}
                <button
                  type="button"
                  className="font-semibold text-[#2563EB] hover:underline"
                  onClick={() => onNavigate('roadmapper')}
                >
                  choose one
                </button>{' '}
                for syllabus plans.
              </>
            ) : (
              'Assign a role to unlock quiz and project milestones. Classes still show from enrollment.'
            )}
          </p>
        )}

        {anchor.source === 'today' && onSetProgramStart ? (
          <button
            type="button"
            onClick={onSetProgramStart}
            className="text-left text-[12px] font-semibold text-[#2563EB] hover:underline"
          >
            Set today as program start
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-3.5">
        <section>
          <p className={CQ_LABEL}>Focus</p>
          {loading ? (
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-zinc-200" aria-hidden />
          ) : (
            <>
              <p className={cn(CQ_BODY, 'mt-1 font-semibold text-[#111827]')}>{dayPlan.topic}</p>
              <p className={cn(CQ_META, 'mt-1')}>{dayPlan.dailyObjective}</p>
              <p className={cn(CQ_META, 'mt-1.5 inline-flex items-center gap-1')}>
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {dayPlan.estimatedMinutes} min estimated
              </p>
            </>
          )}
        </section>

        <section className="min-h-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className={CQ_SECTION_TITLE}>Agenda</h3>
            <span className={CQ_META}>
              {loading ? '…' : `${timeline.length} item${timeline.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-12 animate-pulse rounded-lg bg-zinc-100" />
              <div className="h-12 animate-pulse rounded-lg bg-zinc-100" />
            </div>
          ) : timeline.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E5E7EB] px-3 py-6 text-center">
              <p className={CQ_META}>
                Nothing scheduled. Use practice tasks below or open Career Map.
              </p>
              {practicePreview.length > 0 ? (
                <ul className="mt-3 space-y-1 text-left">
                  {practicePreview.map((task) => (
                    <li key={task} className={cn(CQ_BODY, 'text-[#111827]')}>
                      · {task}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {timeline.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onEventClick(item)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-left transition-colors',
                      'hover:border-zinc-300 hover:bg-zinc-50',
                      item.status === 'done' && 'opacity-60',
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase',
                        EVENT_BADGE[item.kind] ?? 'bg-zinc-100 text-zinc-600',
                      )}
                    >
                      {item.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-[13px] font-semibold text-[#111827]',
                          item.status === 'done' && 'line-through',
                        )}
                      >
                        {item.title}
                      </span>
                      {item.subtitle ? (
                        <span className={cn(CQ_META, 'block truncate')}>{item.subtitle}</span>
                      ) : null}
                    </span>
                    <span className={cn(CQ_META, 'shrink-0 tabular-nums')}>
                      {item.durationMinutes}m
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-auto border-t border-[#E5E7EB] px-4 py-3">
        <button
          type="button"
          disabled={!primaryAction || loading}
          onClick={() => {
            if (primaryAction) executePlannerAction(primaryAction, onNavigate)
          }}
          className={cn(
            'inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold transition-colors',
            primaryAction && !loading
              ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
              : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
          )}
        >
          {primaryAction ? primaryAction.label : 'Nothing to start'}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
        {primaryAction ? (
          <p className={cn(CQ_META, 'mt-1.5 text-center')}>
            Opens {primaryAction.target === 'practice' ? 'Practice' : primaryAction.target}
          </p>
        ) : null}
      </div>
    </CQCard>
  )
}
