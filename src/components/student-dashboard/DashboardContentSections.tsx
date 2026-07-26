import { useMemo } from 'react'
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  Clock3,
  GraduationCap,
  ListChecks,
} from 'lucide-react'

import type { StageProgressRecord, UpcomingDeadlines, UpcomingSession } from '@/lib/api'
import type { CareerJourneySummary } from '@/lib/career-local-summary'
import {
  bucketDeadlines,
  deriveStageJourneyFallback,
  formatSessionDate,
  formatTime,
  mergeDeadlines,
  toIsoDate,
  type DeadlineItem,
} from '@/lib/dashboard-derive'
import {
  formatLastPracticeLabel,
  type PracticeAreaSummary,
} from '@/lib/practice-progress-summary'
import { cn } from '@/lib/utils'

import { CQActionButton, CQCard, CQInlineLink, CQProgressBar } from './cq/CQKit'
import {
  CQ_BODY,
  CQ_BODY_STRONG,
  CQ_CHIP,
  CQ_LABEL,
  CQ_META,
  CQ_METRIC,
  CQ_METRIC_LG,
  CQ_SECTION_HEAD,
  CQ_SECTION_SUB,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
  CQ_TONE_SOFT,
  type CQTone,
} from './cq/cqTheme'

function CQSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#0A1020]/8', className)} aria-hidden />
}

/* --------------------------------------------------------- Glance strip */

/** Compact rhythm — paired cards match height without tall empty voids. */
const GLANCE_CARD = 'flex h-full min-h-0 min-w-0 flex-col'
const PANEL_CARD = 'flex h-full min-h-[11rem] min-w-0 flex-col'

const PRACTICE_DOT: Record<string, string> = {
  blue: 'bg-[#2563EB]',
  violet: 'bg-[#7C3AED]',
  teal: 'bg-[#14B8A6]',
}

function GlanceCardShell({
  title,
  icon,
  action,
  metric,
  metricSub,
  barValue,
  detail,
  interactive = false,
  onOpen,
  loading,
}: {
  title: string
  icon: React.ReactNode
  action: string
  metric: string
  metricSub: string
  barValue?: number | null
  detail: string
  interactive?: boolean
  onOpen?: () => void
  loading?: boolean
}) {
  return (
    <CQCard interactive={interactive} className={GLANCE_CARD}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className={cn(CQ_SECTION_TITLE, 'flex min-w-0 items-center gap-2')}>
          <span className="shrink-0 text-[#0A1020]/70">{icon}</span>
          <span className="truncate">{title}</span>
        </h3>
        {onOpen ? (
          <CQInlineLink onClick={onOpen} className="shrink-0">
            {action}
          </CQInlineLink>
        ) : (
          <span className="invisible shrink-0 text-[13px] font-semibold" aria-hidden>
            {action}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <CQSkeleton className="h-7 w-24" />
          <CQSkeleton className="h-1.5 w-full" />
          <CQSkeleton className="h-4 w-4/5" />
        </div>
      ) : (
        <div className="flex min-h-0 flex-col">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <span className={cn(CQ_METRIC, 'truncate')}>{metric}</span>
            <span className={cn(CQ_META, 'truncate')}>{metricSub}</span>
          </div>
          {typeof barValue === 'number' ? (
            <CQProgressBar value={barValue} showValue={false} className="mt-2" />
          ) : (
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#0A1020]/8" aria-hidden />
          )}
          <p className={cn('mt-2 line-clamp-2', CQ_META)}>{detail}</p>
        </div>
      )}
    </CQCard>
  )
}

function PracticeStatusCard({
  summary,
  dot,
  onOpen,
}: {
  summary: PracticeAreaSummary
  dot: keyof typeof PRACTICE_DOT
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] p-4 text-left shadow-[0_8px_22px_-18px_rgba(10,16,32,0.5)] transition-shadow',
        'hover:shadow-[0_14px_30px_-18px_rgba(10,16,32,0.55)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFFFFF]',
        GLANCE_CARD,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className={cn(CQ_SECTION_TITLE, 'flex min-w-0 items-center gap-2')}>
          <span className={cn('h-2 w-2 shrink-0 rounded-full', PRACTICE_DOT[dot])} />
          <span className="truncate">{summary.label}</span>
        </h3>
        <span className={cn(CQ_META, 'shrink-0 tabular-nums')}>{summary.pct}%</span>
      </div>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className={CQ_METRIC}>
          {summary.completed}
          <span className={cn('ml-1 text-[13px] font-semibold text-[#6B7280]')}>
            /{summary.total || 0}
          </span>
        </span>
        <span className={CQ_META}>done</span>
      </div>
      <CQProgressBar value={summary.pct} showValue={false} className="mt-2" />
      <p className={cn('mt-2 line-clamp-2 min-h-[2.4rem]', CQ_META)}>
        {formatLastPracticeLabel(summary.lastPracticeAt)}
      </p>
    </button>
  )
}

function GettingStartedPracticeCard({
  onStartSql,
  onStartCode,
  onStartTyping,
}: {
  onStartSql: () => void
  onStartCode: () => void
  onStartTyping: () => void
}) {
  const items = [
    { label: 'SQL module', hint: 'Queries & joins', onClick: onStartSql, dot: 'blue' as const },
    { label: 'Code challenge', hint: 'Workbench drills', onClick: onStartCode, dot: 'violet' as const },
    { label: 'Typing drill', hint: 'Speed & accuracy', onClick: onStartTyping, dot: 'teal' as const },
  ]

  return (
    <CQCard className="min-w-0 !p-3 sm:!p-4">
      <div className="mb-2.5 min-w-0">
        <h3 className={CQ_SECTION_TITLE}>Getting started with practice</h3>
        <p className={CQ_SECTION_SUB}>Pick an arena — status cards appear after your first session.</p>
      </div>
      <div className="grid min-w-0 w-full grid-cols-1 items-stretch gap-2 @min-[520px]/dash:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={cn(
              'flex min-h-[4.25rem] w-full flex-col justify-center rounded-lg border border-[#E5E7EB] bg-zinc-50 px-3 py-2 text-left transition-colors hover:bg-zinc-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45',
            )}
          >
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111827]">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', PRACTICE_DOT[item.dot])} />
              <span className="truncate">{item.label}</span>
            </span>
            <span className={cn('mt-1 truncate', CQ_META)}>{item.hint}</span>
          </button>
        ))}
      </div>
    </CQCard>
  )
}

/** Schedule pair + practice status (or a single getting-started strip for new users). */
export function DashboardGlanceRow({
  sessions,
  deadlines,
  loading,
  onOpenCalendar,
  sql,
  code,
  typing,
  onPracticeSql,
  onPracticeCode,
  onPracticeTyping,
}: {
  sessions: UpcomingSession[]
  deadlines: UpcomingDeadlines
  loading: boolean
  onOpenCalendar: () => void
  sql: PracticeAreaSummary
  code: PracticeAreaSummary
  typing: PracticeAreaSummary
  onPracticeSql: () => void
  onPracticeCode: () => void
  onPracticeTyping: () => void
}) {
  const nextSession = sessions[0]
  const todayLabel = nextSession ? formatSessionDate(nextSession.session_date) : null
  const isToday = todayLabel === 'Today'
  const nextDeadline = useMemo(
    () => mergeDeadlines(deadlines).find((d) => !d.done) ?? null,
    [deadlines],
  )
  const openDeadlineCount = useMemo(
    () => mergeDeadlines(deadlines).filter((d) => !d.done).length,
    [deadlines],
  )
  const practiceUntouched = !sql.hasActivity && !code.hasActivity && !typing.hasActivity

  return (
    <div className={cn('flex min-w-0 flex-col', CQ_STACK_GAP)}>
      <div
        className={cn(
          'grid min-w-0 w-full auto-rows-fr grid-cols-1 items-stretch',
          '@min-[520px]/dash:grid-cols-2',
          CQ_STACK_GAP,
        )}
      >
        <GlanceCardShell
          title={isToday ? "Today's class" : 'Next class'}
          icon={<CalendarClock className="h-4 w-4" strokeWidth={1.75} />}
          action="Calendar"
          onOpen={onOpenCalendar}
          loading={loading}
          metric={nextSession ? formatTime(nextSession.start_time) : '—'}
          metricSub={nextSession ? (todayLabel ?? 'upcoming') : 'scheduled'}
          detail={
            nextSession
              ? `${nextSession.title}${nextSession.topic ? ` · ${nextSession.topic}` : ''}`
              : 'Nothing on the calendar yet. Check notes and upcoming sessions.'
          }
        />
        <GlanceCardShell
          title="Next deadline"
          icon={<ListChecks className="h-4 w-4" strokeWidth={1.75} />}
          action="Calendar"
          onOpen={onOpenCalendar}
          loading={loading}
          metric={String(openDeadlineCount)}
          metricSub="open"
          detail={
            nextDeadline
              ? `${nextDeadline.title} · due ${formatSessionDate(nextDeadline.due)}`
              : 'Nothing due right now. You are clear on upcoming deadlines.'
          }
        />
      </div>

      {practiceUntouched ? (
        <GettingStartedPracticeCard
          onStartSql={onPracticeSql}
          onStartCode={onPracticeCode}
          onStartTyping={onPracticeTyping}
        />
      ) : (
        <div
          className={cn(
            'grid min-w-0 w-full auto-rows-fr grid-cols-1 items-stretch',
            '@min-[520px]/dash:grid-cols-2 @min-[860px]/dash:grid-cols-3',
            CQ_STACK_GAP,
          )}
        >
          <PracticeStatusCard summary={sql} dot="blue" onOpen={onPracticeSql} />
          <PracticeStatusCard summary={code} dot="violet" onOpen={onPracticeCode} />
          <PracticeStatusCard summary={typing} dot="teal" onOpen={onPracticeTyping} />
        </div>
      )}
    </div>
  )
}

/* --------------------------------------------------------------- Progress */

export function ProgressPanel({
  careerJourney,
  stageRows,
  catalogSteps,
  loading,
  onViewProgress,
}: {
  careerJourney: CareerJourneySummary | null
  stageRows: StageProgressRecord[] | null
  catalogSteps: number | null
  loading: boolean
  onViewProgress: () => void
}) {
  const fallback = !careerJourney && stageRows ? deriveStageJourneyFallback(stageRows) : null
  const progressPct = careerJourney?.pct ?? fallback?.progressPct ?? 0
  const stageLabel = careerJourney?.currentStageLabel ?? fallback?.currentStageLabel ?? 'Program'
  const stageCount = stageRows?.length ?? 0
  const stagesComplete =
    stageRows?.filter((r) => r.total_lessons > 0 && r.lessons_completed >= r.total_lessons).length ??
    0
  const hasModules = stageCount > 0
  const hasCatalog = typeof catalogSteps === 'number' && catalogSteps > 0
  const isFreshStart = !loading && progressPct === 0 && !hasModules && !hasCatalog && !careerJourney

  return (
    <CQCard className="min-w-0">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className={CQ_SECTION_TITLE}>Overall progress</h3>
          <p className={CQ_SECTION_SUB}>
            {isFreshStart ? 'Starts with your first lesson' : stageLabel}
          </p>
        </div>
        <CQInlineLink onClick={onViewProgress} className="shrink-0">
          Details
        </CQInlineLink>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-end">
        <div className="min-w-0">
          <div className="flex items-end gap-2">
            <span className={CQ_METRIC_LG}>{loading ? '…' : `${progressPct}%`}</span>
            <span className={cn('pb-0.5', CQ_META)}>
              {isFreshStart ? 'ready to begin' : 'complete'}
            </span>
          </div>
          <CQProgressBar value={progressPct} showValue={false} className="mt-2" />
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F4F5F7]/60 px-2.5 py-2">
            <dt className={CQ_META}>Modules</dt>
            <dd className={cn('mt-0.5 tabular-nums', CQ_BODY_STRONG)}>
              {loading ? '…' : hasModules ? `${stagesComplete}/${stageCount}` : '0'}
            </dd>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F4F5F7]/60 px-2.5 py-2">
            <dt className={CQ_META}>Catalog</dt>
            <dd className={cn('mt-0.5 tabular-nums', CQ_BODY_STRONG)}>
              {loading ? '…' : hasCatalog ? catalogSteps : '0'}
            </dd>
          </div>
        </dl>
      </div>
      {isFreshStart ? (
        <p className={cn('mt-2', CQ_META)}>Finish one lesson or practice set to unlock richer stats.</p>
      ) : null}
    </CQCard>
  )
}

/* ------------------------------------------------------ Upcoming classes */

function SessionRow({ session, featured }: { session: UpcomingSession; featured?: boolean }) {
  const dateLabel = formatSessionDate(session.session_date)
  const timeRange = `${formatTime(session.start_time)} – ${formatTime(session.end_time)}`

  if (featured) {
    return (
      <div className="rounded-xl border-l-[3px] border-[#2563EB] bg-[#B8C9E8]/25 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={CQ_BODY_STRONG}>{session.title}</p>
            {session.topic && <p className={cn('mt-1', CQ_BODY)}>{session.topic}</p>}
            <p className={cn('mt-2 inline-flex items-center gap-1', CQ_META)}>
              <Clock3 className="h-3.5 w-3.5" />
              {timeRange}
            </p>
          </div>
          <span className={cn(CQ_CHIP, 'shrink-0 bg-[#0A1020]/8 text-[#374151]')}>{dateLabel}</span>
        </div>
      </div>
    )
  }

  return (
    <li className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] py-2.5 last:border-0">
      <div className="min-w-0">
        <p className={cn('truncate font-medium text-[#111827]', CQ_BODY)}>{session.title}</p>
        {session.topic && <p className={cn('truncate', CQ_META)}>{session.topic}</p>}
      </div>
      <div className={cn('shrink-0 text-right', CQ_META)}>
        <span className="block font-medium text-[#374151]">{dateLabel}</span>
        <span className="tabular-nums">{timeRange}</span>
      </div>
    </li>
  )
}

export function UpcomingClassesPanel({
  sessions,
  loading,
}: {
  sessions: UpcomingSession[]
  loading: boolean
}) {
  const [next, ...rest] = sessions
  return (
    <CQCard className={PANEL_CARD}>
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <CalendarClock className="h-4 w-4 shrink-0 text-[#0A1020]/70" strokeWidth={1.75} />
          Upcoming classes
        </h3>
        <span className={cn(CQ_CHIP, 'bg-[#B8C9E8]/40 tabular-nums text-[#1D4ED8]')}>
          {sessions.length}
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <CQSkeleton className="h-16 w-full rounded-xl" />
          <CQSkeleton className="h-8 w-full" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center rounded-xl border border-dashed border-[#E5E7EB] px-3 py-3">
          <p className={cn(CQ_BODY_STRONG)}>No classes on the books</p>
          <p className={cn('mt-1', CQ_META)}>Live sessions will land here when scheduled.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {next && <SessionRow session={next} featured />}
          {rest.length > 0 && (
            <details className="group">
              <summary
                className={cn(
                  'flex cursor-pointer list-none items-center gap-2 font-medium text-[#374151] hover:text-[#111827] [&::-webkit-details-marker]:hidden',
                  CQ_BODY,
                )}
              >
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                {rest.length} more class{rest.length === 1 ? '' : 'es'}
              </summary>
              <ul className="mt-1 pl-1">
                {rest.map((s) => (
                  <SessionRow key={s.id} session={s} />
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </CQCard>
  )
}

/* ------------------------------------------------------------- Deadlines */

function deadlineBorder(item: DeadlineItem, today: string): string {
  if (item.done) return 'border-[#14B8A6]'
  if (item.due < today) return 'border-[#EF4444]'
  if (item.due === today) return 'border-[#FBBF24]'
  return 'border-[#2563EB]'
}

function DeadlineColumn({
  title,
  items,
  today,
  emptyLabel,
}: {
  title: string
  items: DeadlineItem[]
  today: string
  emptyLabel: string
}) {
  return (
    <div className="flex h-full min-h-[6rem] min-w-0 flex-col rounded-lg border border-[#E5E7EB] bg-zinc-50 px-2.5 py-2">
      <h4 className={cn('mb-1.5 flex items-center gap-1', CQ_LABEL)}>
        <span className="truncate">{title}</span>
        {items.length > 0 ? (
          <span className={cn(CQ_CHIP, 'bg-[#0A1020]/8 px-1.5 tabular-nums text-[#374151]')}>
            {items.length}
          </span>
        ) : null}
      </h4>
      {items.length === 0 ? (
        <p className={cn('mt-auto', CQ_META, 'text-[#9CA3AF]')}>{emptyLabel}</p>
      ) : (
        <ul className="flex flex-1 flex-col gap-1.5">
          {items.slice(0, 2).map((item) => (
            <li
              key={item.key}
              className={cn(
                'rounded-md border-l-[3px] bg-white px-2 py-1.5',
                deadlineBorder(item, today),
              )}
            >
              <p
                className={cn(
                  'truncate font-medium',
                  CQ_BODY,
                  item.done ? 'text-[#9CA3AF] line-through' : 'text-[#111827]',
                )}
              >
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function DeadlinesPanel({
  deadlines,
  loading,
}: {
  deadlines: UpcomingDeadlines
  loading: boolean
}) {
  const today = toIsoDate(new Date())
  const buckets = useMemo(() => bucketDeadlines(mergeDeadlines(deadlines)), [deadlines])
  const openCount = buckets.today.length + buckets.thisWeek.length
  const hasAny = buckets.today.length + buckets.thisWeek.length + buckets.completed.length > 0

  return (
    <CQCard className={PANEL_CARD}>
      <div className={CQ_SECTION_HEAD}>
        <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          <ListChecks className="h-4 w-4 shrink-0 text-[#0A1020]/70" strokeWidth={1.75} />
          All deadlines
        </h3>
        <span className={cn(CQ_CHIP, 'bg-[#FBBF24]/25 tabular-nums text-[#92400E]')}>
          {openCount} open
        </span>
      </div>
      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          <CQSkeleton className="h-16" />
          <CQSkeleton className="h-16" />
          <CQSkeleton className="h-16" />
        </div>
      ) : (
        <div className="grid flex-1 auto-rows-fr grid-cols-1 items-stretch gap-2 sm:grid-cols-3">
          <DeadlineColumn
            title="Due today"
            items={hasAny ? buckets.today : []}
            today={today}
            emptyLabel={hasAny ? 'Nothing due today' : 'Clear'}
          />
          <DeadlineColumn
            title="This week"
            items={hasAny ? buckets.thisWeek : []}
            today={today}
            emptyLabel={hasAny ? 'Clear for the week' : 'Clear'}
          />
          <DeadlineColumn
            title="Completed"
            items={hasAny ? buckets.completed : []}
            today={today}
            emptyLabel={hasAny ? 'None yet' : 'Clear'}
          />
        </div>
      )}
    </CQCard>
  )
}

/* -------------------------------------------------------------- Syllabus */

const MAX_VISIBLE_TOPICS = 4

function TopicChip({ label, tone }: { label: string; tone: CQTone }) {
  return (
    <span
      className={cn(
        CQ_CHIP,
        'max-w-full truncate border border-[#E5E7EB] font-medium text-[#374151]',
        CQ_TONE_SOFT[tone],
      )}
    >
      {label}
    </span>
  )
}

export function SyllabusPanel({
  careerJourney,
  stageRows,
  loading,
  onOpenCareer,
}: {
  careerJourney: CareerJourneySummary | null
  stageRows: StageProgressRecord[] | null
  loading: boolean
  onOpenCareer: () => void
}) {
  const fallback = !careerJourney && stageRows ? deriveStageJourneyFallback(stageRows) : null
  const stageLabel = careerJourney?.currentStageLabel ?? fallback?.currentStageLabel ?? 'Getting started'
  const progressPct = careerJourney?.pct ?? fallback?.progressPct ?? 0
  const completedTopics = careerJourney?.completedTopics ?? fallback?.completedTopics ?? []
  const remainingTopics = careerJourney?.remainingTopics ?? fallback?.remainingTopics ?? []

  const visibleCompleted = completedTopics.slice(-MAX_VISIBLE_TOPICS)
  const visibleRemaining = remainingTopics.slice(0, MAX_VISIBLE_TOPICS)
  const hiddenCompleted = Math.max(0, completedTopics.length - visibleCompleted.length)
  const hiddenRemaining = Math.max(0, remainingTopics.length - visibleRemaining.length)
  const empty = completedTopics.length === 0 && remainingTopics.length === 0

  return (
    <CQCard className={PANEL_CARD}>
      <div className={CQ_SECTION_HEAD}>
        <div className="min-w-0">
          <h3 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
            <GraduationCap className="h-4 w-4 shrink-0 text-[#0A1020]/70" strokeWidth={1.75} />
            Syllabus overview
          </h3>
          <p className={CQ_SECTION_SUB}>{stageLabel}</p>
        </div>
        <span className={cn(CQ_CHIP, 'shrink-0 bg-[#B8C9E8]/40 tabular-nums text-[#1D4ED8]')}>
          {loading ? '…' : `${progressPct}%`}
        </span>
      </div>

      <CQProgressBar value={progressPct} showValue={false} className="mb-2.5" />

      {loading ? (
        <div className="space-y-2">
          <CQSkeleton className="h-6 w-full" />
          <CQSkeleton className="h-6 w-2/3" />
        </div>
      ) : empty ? (
        <div className="flex flex-1 flex-col justify-between gap-2 rounded-lg border border-dashed border-[#E5E7EB] px-3 py-3">
          <p className={CQ_META}>
            Choose a career path to unlock syllabus milestones here.
          </p>
          <CQActionButton variant="primary" className="w-full" onClick={onOpenCareer}>
            Open Career Map
            <ArrowRight className="h-3.5 w-3.5" />
          </CQActionButton>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleCompleted.length > 0 && (
            <div>
              <p className={cn('mb-2', CQ_LABEL, 'text-[#0F766E]')}>Completed</p>
              <div className="flex flex-wrap gap-2">
                {visibleCompleted.map((t) => (
                  <TopicChip key={`done-${t}`} label={t} tone="sage" />
                ))}
                {hiddenCompleted > 0 && <TopicChip label={`+${hiddenCompleted} more`} tone="sage" />}
              </div>
            </div>
          )}
          {visibleRemaining.length > 0 && (
            <div>
              <p className={cn('mb-2', CQ_LABEL)}>Up next</p>
              <div className="flex flex-wrap gap-2">
                {visibleRemaining.map((t) => (
                  <TopicChip key={`next-${t}`} label={t} tone="lavender" />
                ))}
                {hiddenRemaining > 0 && <TopicChip label={`+${hiddenRemaining} more`} tone="lavender" />}
              </div>
            </div>
          )}
        </div>
      )}
    </CQCard>
  )
}
