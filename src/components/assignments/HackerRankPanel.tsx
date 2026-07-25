import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronLeft, Play, Send } from 'lucide-react'
import { toast } from 'sonner'

import { CodeEditor } from '@/components/CodeEditor'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_CHIP,
  CQ_LABEL,
  CQ_META,
  CQ_SECTION_TITLE,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import {
  HACKERRANK_CHALLENGES,
  getChallenge,
  type HackerRankChallenge,
} from './assignment-demo-data'

const SUBMIT_KEY = 'cq-hackerrank-submissions'

function loadSubmitted(): Set<string> {
  try {
    const raw = localStorage.getItem(SUBMIT_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function persistSubmitted(ids: Set<string>) {
  localStorage.setItem(SUBMIT_KEY, JSON.stringify([...ids]))
}

interface HackerRankPanelProps {
  initialChallengeId?: string | null
  onClearedInitial?: () => void
}

export function HackerRankPanel({
  initialChallengeId,
  onClearedInitial,
}: HackerRankPanelProps) {
  const [activeId, setActiveId] = useState<string | null>(initialChallengeId ?? null)
  const [codeById, setCodeById] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Set<string>>(() => loadSubmitted())
  const [runNote, setRunNote] = useState<string | null>(null)

  useEffect(() => {
    if (!initialChallengeId) return
    setActiveId(initialChallengeId)
    onClearedInitial?.()
  }, [initialChallengeId, onClearedInitial])

  const challenge = activeId ? getChallenge(activeId) : undefined
  const code =
    challenge != null
      ? (codeById[challenge.id] ?? challenge.starterCode)
      : ''

  const openChallenge = (c: HackerRankChallenge) => {
    setActiveId(c.id)
    setRunNote(null)
    setCodeById((prev) => (prev[c.id] ? prev : { ...prev, [c.id]: c.starterCode }))
  }

  const handleRun = (source: string) => {
    setRunNote(`Ran locally (${source.split('\n').length} lines). Use Submit when ready.`)
    toast.message('Code ran in the local sandbox preview.')
  }

  const handleSubmit = () => {
    if (!challenge) return
    const source = codeById[challenge.id] ?? challenge.starterCode
    if (!source.includes(challenge.mustInclude)) {
      toast.error(`Submission needs a real solution (hint: use \`${challenge.mustInclude}\`).`)
      return
    }
    const next = new Set(submitted)
    next.add(challenge.id)
    setSubmitted(next)
    persistSubmitted(next)
    toast.success('Assignment submitted. Nice work.')
  }

  if (!challenge) {
    return (
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12">
        <CQCard className="lg:col-span-12 !p-0 overflow-hidden">
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <h2 className={CQ_SECTION_TITLE}>HackerRank</h2>
            <p className={cn(CQ_META, 'mt-0.5')}>
              Coding assignments from your path. Write code, run, then submit.
            </p>
          </div>
          <ul className="divide-y divide-[#E5E7EB]">
            {HACKERRANK_CHALLENGES.map((c) => {
              const done = submitted.has(c.id)
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => openChallenge(c)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-[#111827]">
                        {c.title}
                      </span>
                      <span className={cn(CQ_META, 'block')}>
                        {c.pathLabel} · {c.language} · {c.minutes} min
                      </span>
                    </span>
                    <span
                      className={cn(
                        CQ_CHIP,
                        c.difficulty === 'Easy' && 'bg-emerald-50 text-emerald-800',
                        c.difficulty === 'Medium' && 'bg-amber-50 text-amber-900',
                        c.difficulty === 'Hard' && 'bg-rose-50 text-rose-800',
                      )}
                    >
                      {c.difficulty}
                    </span>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />
                    ) : (
                      <span className={cn(CQ_CHIP, 'bg-sky-50 text-sky-800')}>Open</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </CQCard>
      </div>
    )
  }

  const done = submitted.has(challenge.id)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveId(null)
            setRunNote(null)
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#4B5563] hover:bg-zinc-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          All challenges
        </button>
        <span className={CQ_LABEL}>{challenge.pathLabel}</span>
        {done ? (
          <span className={cn(CQ_CHIP, 'bg-emerald-50 text-emerald-800')}>Submitted</span>
        ) : null}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12 lg:min-h-[min(560px,calc(100dvh-14rem))]">
        <CQCard className="flex min-h-0 flex-col overflow-hidden !p-0 lg:col-span-5">
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <h2 className="text-[16px] font-semibold text-[#111827]">{challenge.title}</h2>
            <p className={cn(CQ_META, 'mt-0.5')}>
              {challenge.difficulty} · {challenge.language} · {challenge.minutes} min
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <section>
              <p className={CQ_LABEL}>Problem</p>
              <p className={cn(CQ_BODY, 'mt-1 text-[#111827]')}>{challenge.prompt}</p>
            </section>
            <section>
              <p className={CQ_LABEL}>Examples</p>
              <ul className="mt-1.5 space-y-2">
                {challenge.examples.map((ex) => (
                  <li
                    key={ex.input}
                    className="rounded-lg border border-[#E5E7EB] bg-zinc-50 px-2.5 py-2 font-mono text-[12px] text-[#111827]"
                  >
                    <div>In: {ex.input}</div>
                    <div className="text-[#4B5563]">Out: {ex.output}</div>
                  </li>
                ))}
              </ul>
            </section>
            {runNote ? <p className={CQ_META}>{runNote}</p> : null}
          </div>
        </CQCard>

        <CQCard className="flex min-h-[320px] flex-col overflow-hidden !p-0 lg:col-span-7 lg:min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] px-3 py-2">
            <p className={CQ_SECTION_TITLE}>Editor</p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleRun(code)}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 text-[12px] font-semibold text-[#111827] hover:bg-zinc-50"
              >
                <Play className="h-3.5 w-3.5" aria-hidden />
                Run
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 text-[12px] font-semibold text-white hover:bg-[#1D4ED8]"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
                Submit
              </button>
            </div>
          </div>
          <div className="min-h-[280px] flex-1 lg:min-h-0 [&_.monaco-editor]:rounded-none">
            <div className="h-full min-h-[280px]">
              <CodeEditor
                language={challenge.language === 'python' ? 'python' : 'javascript'}
                code={code}
                onChange={(value) =>
                  setCodeById((prev) => ({ ...prev, [challenge.id]: value }))
                }
                onRun={handleRun}
                showExecutionControls={false}
                showOutputPanel={false}
                showEditorChrome={false}
                monacoTheme="vs"
                fontSize={13}
                lineHeight={20}
              />
            </div>
          </div>
        </CQCard>
      </div>
    </div>
  )
}
