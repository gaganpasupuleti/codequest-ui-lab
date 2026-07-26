import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  Circle,
  Code2,
  ListChecks,
  Map,
  Terminal,
} from 'lucide-react'

import { HackerRankPanel } from '@/components/assignments/HackerRankPanel'
import {
  PATH_ASSIGNMENTS,
  PATH_CONTEXT,
  assignmentDueIso,
  type AssignmentKind,
  type AssignmentNavTarget,
  type PathAssignment,
} from '@/components/assignments/assignment-demo-data'
import { QuizPage } from '@/components/pages/QuizPage'
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
import { cn } from '@/lib/utils'

export type AssignmentsNavTarget = AssignmentNavTarget

type HubTab = 'queue' | 'hackerrank' | 'quizzes'

interface AssignmentsPageProps {
  onNavigate: (page: AssignmentsNavTarget) => void
  onBeforeSelectQuiz?: (quizId: string) => boolean
}

const KIND_LABEL: Record<AssignmentKind, string> = {
  hackerrank: 'HackerRank',
  quiz: 'Quiz',
  practice: 'Practice',
  studio: 'Studio',
  project: 'Project',
}

const KIND_TONE: Record<AssignmentKind, string> = {
  hackerrank: 'bg-violet-50 text-violet-800',
  quiz: 'bg-amber-50 text-amber-900',
  practice: 'bg-sky-50 text-sky-800',
  studio: 'bg-zinc-100 text-zinc-700',
  project: 'bg-emerald-50 text-emerald-800',
}

function formatDue(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function bandFor(due: string, today: string, weekEnd: string): 'today' | 'week' | 'later' | 'done' {
  if (due < today || due === today) return 'today'
  if (due <= weekEnd) return 'week'
  return 'later'
}

function openAssignment(
  item: PathAssignment,
  opts: {
    onNavigate: (page: AssignmentsNavTarget) => void
    setTab: (t: HubTab) => void
    setChallengeId: (id: string | null) => void
  },
) {
  if (item.kind === 'hackerrank' && item.challengeId) {
    opts.setChallengeId(item.challengeId)
    opts.setTab('hackerrank')
    return
  }
  if (item.kind === 'quiz') {
    opts.setTab('quizzes')
    return
  }
  if (item.navTarget) {
    opts.onNavigate(item.navTarget)
  }
}

export function AssignmentsPage({ onNavigate, onBeforeSelectQuiz }: AssignmentsPageProps) {
  const [tab, setTab] = useState<HubTab>('queue')
  const [challengeId, setChallengeId] = useState<string | null>(null)

  const today = iso(new Date())
  const weekEnd = useMemo(() => {
    const end = startOfWeek(new Date())
    end.setDate(end.getDate() + 6)
    return iso(end)
  }, [])

  const enriched = useMemo(
    () =>
      PATH_ASSIGNMENTS.map((a) => ({
        ...a,
        due: assignmentDueIso(a),
      })),
    [],
  )

  const openItems = enriched.filter((a) => a.status === 'open')
  const doneItems = enriched.filter((a) => a.status === 'done')
  const dueToday = openItems.filter((a) => bandFor(a.due, today, weekEnd) === 'today')
  const dueWeek = openItems.filter((a) => bandFor(a.due, today, weekEnd) === 'week')
  const dueLater = openItems.filter((a) => bandFor(a.due, today, weekEnd) === 'later')

  const tabs: { id: HubTab; label: string; count?: number }[] = [
    { id: 'queue', label: 'Path queue', count: openItems.length },
    { id: 'hackerrank', label: 'HackerRank' },
    { id: 'quizzes', label: 'Quiz Zone' },
  ]

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD, 'flex min-h-0 flex-col')}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex min-h-0 flex-1 flex-col', CQ_STACK_GAP)}>
        <header className="shrink-0">
          <h1 className={CQ_PAGE_TITLE}>Assignments</h1>
          <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
            Path work that opens Practice, Studio, HackerRank, and Quiz Zone — one queue, clear next
            step.
          </p>
        </header>

        <CQCard className="shrink-0 !py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={CQ_LABEL}>Learning path</p>
              <p className="mt-0.5 text-[14px] font-semibold text-[#111827]">
                {PATH_CONTEXT.stage} · M{PATH_CONTEXT.month} W{PATH_CONTEXT.week}
              </p>
              <p className={cn(CQ_META, 'mt-0.5')}>{PATH_CONTEXT.focus}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate('roadmapper')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
              >
                <Map className="h-3.5 w-3.5" aria-hidden />
                Career Map
              </button>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
              >
                <ListChecks className="h-3.5 w-3.5" aria-hidden />
                Calendar
              </button>
              <button
                type="button"
                onClick={() => onNavigate('practice-studio')}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
              >
                <Beaker className="h-3.5 w-3.5" aria-hidden />
                Practice Studio
              </button>
            </div>
          </div>
        </CQCard>

        <div
          className="flex shrink-0 gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1"
          role="tablist"
          aria-label="Assignment sections"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors',
                tab === t.id
                  ? 'bg-[#111827] text-white'
                  : 'text-[#4B5563] hover:bg-zinc-50',
              )}
            >
              {t.id === 'hackerrank' ? <Terminal className="h-3.5 w-3.5" aria-hidden /> : null}
              {t.id === 'quizzes' ? <ListChecks className="h-3.5 w-3.5" aria-hidden /> : null}
              {t.id === 'queue' ? <Code2 className="h-3.5 w-3.5" aria-hidden /> : null}
              {t.label}
              {typeof t.count === 'number' ? (
                <span
                  className={cn(
                    'tabular-nums text-[11px]',
                    tab === t.id ? 'text-white/70' : 'text-zinc-400',
                  )}
                >
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === 'queue' && (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12 lg:items-start">
            <CQCard className="lg:col-span-8 !p-0 overflow-hidden">
              <div className="border-b border-[#E5E7EB] px-4 py-3">
                <h2 className={CQ_SECTION_TITLE}>Due from your path</h2>
                <p className={cn(CQ_META, 'mt-0.5')}>
                  Open an item to jump into HackerRank, Quiz Zone, or a practice module.
                </p>
              </div>
              <AssignmentGroup
                title="Due today"
                items={dueToday}
                empty="Nothing due today"
                onOpen={(item) =>
                  openAssignment(item, { onNavigate, setTab, setChallengeId })
                }
              />
              <AssignmentGroup
                title="This week"
                items={dueWeek}
                empty="Clear for the rest of the week"
                onOpen={(item) =>
                  openAssignment(item, { onNavigate, setTab, setChallengeId })
                }
              />
              {dueLater.length > 0 ? (
                <AssignmentGroup
                  title="Upcoming"
                  items={dueLater}
                  empty=""
                  onOpen={(item) =>
                    openAssignment(item, { onNavigate, setTab, setChallengeId })
                  }
                />
              ) : null}
            </CQCard>

            <div className="flex flex-col gap-3 lg:col-span-4">
              <CQCard>
                <p className={CQ_LABEL}>How this connects</p>
                <ul className={cn(CQ_BODY, 'mt-2 space-y-2 text-[#111827]')}>
                  <li>
                    <span className="font-semibold">Path</span> sets the week focus (Career Map /
                    Planner).
                  </li>
                  <li>
                    <span className="font-semibold">Assignments</span> turn that focus into due
                    work.
                  </li>
                  <li>
                    <span className="font-semibold">Practice Studio</span> is where drills live —
                    assignments deep-link you in.
                  </li>
                  <li>
                    <span className="font-semibold">HackerRank</span> is graded code submit for
                    path challenges.
                  </li>
                </ul>
              </CQCard>
              <CQCard className="!p-0 overflow-hidden">
                <div className="border-b border-[#E5E7EB] px-4 py-2.5">
                  <h2 className={CQ_SECTION_TITLE}>Completed</h2>
                </div>
                {doneItems.length === 0 ? (
                  <p className={cn(CQ_META, 'px-4 py-6 text-center')}>No completions yet</p>
                ) : (
                  <ul className="divide-y divide-[#E5E7EB]">
                    {doneItems.map((item) => (
                      <li key={item.id} className="flex items-start gap-2 px-4 py-2.5">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className={cn(CQ_BODY, 'text-zinc-400 line-through')}>{item.title}</p>
                          <p className={CQ_META}>{item.pathLabel}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CQCard>
            </div>
          </div>
        )}

        {tab === 'hackerrank' && (
          <HackerRankPanel
            initialChallengeId={challengeId}
            onClearedInitial={() => setChallengeId(null)}
          />
        )}

        {tab === 'quizzes' && (
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
            <QuizPage
              embedded
              onBeforeSelect={onBeforeSelectQuiz}
              onBack={() => setTab('queue')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function AssignmentGroup({
  title,
  items,
  empty,
  onOpen,
}: {
  title: string
  items: (PathAssignment & { due: string })[]
  empty: string
  onOpen: (item: PathAssignment & { due: string }) => void
}) {
  return (
    <section className="border-b border-[#E5E7EB] last:border-b-0">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <h3 className={CQ_LABEL}>{title}</h3>
        <span className={cn(CQ_CHIP, 'bg-zinc-100 text-zinc-600 tabular-nums')}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className={cn(CQ_META, 'px-4 pb-4')}>{empty}</p>
      ) : (
        <ul className="pb-2">
          {items.map((item) => (
            <li key={item.id} className="px-2 pb-1">
              <button
                type="button"
                onClick={() => onOpen(item)}
                className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-zinc-50"
              >
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#111827]">{item.title}</span>
                    <span className={cn(CQ_CHIP, KIND_TONE[item.kind])}>{KIND_LABEL[item.kind]}</span>
                  </span>
                  <span className={cn(CQ_META, 'mt-0.5 block')}>{item.blurb}</span>
                  <span className={cn(CQ_META, 'mt-1 block')}>
                    {item.pathLabel} · Due {formatDue(item.due)} · {item.minutes} min
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
