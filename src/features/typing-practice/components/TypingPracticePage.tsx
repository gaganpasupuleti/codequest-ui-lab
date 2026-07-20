import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  AlertTriangle,
  Keyboard,
  RotateCcw,
  SkipForward,
  Sparkles,
  Timer,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { wb } from '@/lib/workbench-theme'
import { useIsMobile } from '@/hooks/use-mobile'
import { toast } from 'sonner'
import {
  buildMistakeReviewSample,
  getTypingSampleById,
  pickTypingSample,
} from '../data/typingSamples'
import {
  calculateTypingMetrics,
  finalizeTypingSession,
  getUpcomingPromptSegment,
  resolveFinishTypedText,
} from '../utils/typingMetrics'
import {
  clearTypingMistakes,
  filterMistakesForSnippet,
  getRecentTypingMistakes,
  getRecentTypingSessions,
  recordTypingMistakes,
  recordTypingSession,
} from '../utils/typingMistakes'
import type {
  TypingCodeLanguage,
  TypingCompletionSummary,
  TypingDifficulty,
  TypingPracticeMode,
  TypingSample,
  TypingSessionMistake,
} from '../types/typingPractice.types'
import { TypingPromptDisplay } from './TypingPromptDisplay'

const CODE_LANGUAGES: Array<{ id: TypingCodeLanguage; label: string }> = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'sql', label: 'SQL (typing only)' },
]

const MODES: Array<{ id: TypingPracticeMode; label: string }> = [
  { id: 'text', label: 'Normal text' },
  { id: 'code', label: 'Code typing' },
  { id: 'mistake-review', label: 'Mistake review' },
]

const DIFFICULTIES: Array<{ id: TypingDifficulty; label: string }> = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'mid', label: 'Mid-level' },
]

interface TypingPracticePageProps {
  embedded?: boolean
}

export function TypingPracticePage({ embedded = false }: TypingPracticePageProps) {
  const isMobile = useIsMobile()
  const [mode, setMode] = useState<TypingPracticeMode>('text')
  const [language, setLanguage] = useState<TypingCodeLanguage>('python')
  const [difficulty, setDifficulty] = useState<TypingDifficulty>('beginner')
  const [activeSample, setActiveSample] = useState<TypingSample | null>(null)
  const [typedText, setTypedText] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [completionSummary, setCompletionSummary] = useState<TypingCompletionSummary | null>(null)
  const [sessionMistakeCount, setSessionMistakeCount] = useState(0)
  const [oldMistakes, setOldMistakes] = useState(getRecentTypingMistakes(20))
  const [recentSessions, setRecentSessions] = useState(getRecentTypingSessions(8))
  const [selectedRetrySnippetId, setSelectedRetrySnippetId] = useState<string | null>(null)

  const typingAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const recordedMistakePositions = useRef<Set<number>>(new Set())
  const isFinishingRef = useRef(false)

  const sourceText = activeSample?.text ?? ''

  const refreshStoragePanels = useCallback(() => {
    setOldMistakes(getRecentTypingMistakes(20))
    setRecentSessions(getRecentTypingSessions(8))
  }, [])

  const startSample = useCallback((sample: TypingSample | null) => {
    setActiveSample(sample)
    setTypedText('')
    setElapsedSeconds(0)
    setCompletionSummary(null)
    setSessionMistakeCount(0)
    recordedMistakePositions.current = new Set()
    isFinishingRef.current = false
    setIsRunning(Boolean(sample))
    if (sample) {
      window.setTimeout(() => typingAreaRef.current?.focus(), 40)
    }
  }, [])

  const loadNextSample = useCallback(() => {
    if (mode === 'mistake-review') {
      const mistake = oldMistakes.find((item) => item.snippetId === selectedRetrySnippetId) ?? oldMistakes[0]
      if (!mistake) {
        toast.message('No saved mistakes yet. Complete a typing drill to build your review queue.')
        return
      }
      const sample = buildMistakeReviewSample([
        {
          snippetId: mistake.snippetId,
          snippetText: getTypingSampleById(mistake.snippetId)?.text ?? '',
          language: mistake.language,
        },
      ])
      startSample(sample)
      return
    }

    const sampleMode = mode === 'code' ? 'code' : 'text'
    const sample = pickTypingSample(sampleMode, language, difficulty, activeSample ? [activeSample.id] : [])
    if (!sample) {
      toast.error('No typing sample found for the current filters.')
      return
    }
    startSample(sample)
  }, [activeSample, difficulty, language, mode, oldMistakes, selectedRetrySnippetId, startSample])

  const finishSession = useCallback((typedTextOverride?: string) => {
    if (!isRunning || !activeSample || isFinishingRef.current) return
    isFinishingRef.current = true
    setIsRunning(false)

    const resolvedTypedText = resolveFinishTypedText(typedText, typedTextOverride)
    const { mistakePositions, summary } = finalizeTypingSession({
      sourceText,
      typedText: resolvedTypedText,
      elapsedSeconds,
    })
    setCompletionSummary(summary)

    if (mistakePositions.length > 0) {
      recordTypingMistakes(
        mistakePositions.map((mistake) => ({
          snippetId: activeSample.id,
          language: activeSample.language,
          expectedChar: mistake.expectedChar,
          typedChar: mistake.typedChar,
          position: mistake.position,
        })),
      )
    }

    recordTypingSession({
      mode,
      snippetId: activeSample.id,
      snippetTitle: activeSample.title,
      language: activeSample.language,
      difficulty: activeSample.difficulty,
      wpm: summary.wpm,
      accuracy: summary.accuracy,
      mistakeCount: summary.totalMistakes,
      elapsedSeconds: summary.elapsedSeconds,
    })

    refreshStoragePanels()
    toast.success('Typing session saved locally.')
    isFinishingRef.current = false
  }, [
    activeSample,
    elapsedSeconds,
    isRunning,
    mode,
    refreshStoragePanels,
    sourceText,
    typedText,
  ])

  useEffect(() => {
    if (!isRunning) return
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1)
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [isRunning])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault()
        if (activeSample) {
          startSample(activeSample)
          toast.message('Session restarted.')
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeSample, startSample])

  const liveMetrics = useMemo(
    () => calculateTypingMetrics({ sourceText, typedText, elapsedSeconds }),
    [elapsedSeconds, sourceText, typedText],
  )

  const handleTypedChange = (next: string) => {
    if (!isRunning || !activeSample) return

    const previousLength = typedText.length
    setTypedText(next)

    if (next.length > previousLength) {
      const index = next.length - 1
      const expected = sourceText[index]
      const typed = next[index]
      if (expected !== undefined && typed !== expected && !recordedMistakePositions.current.has(index)) {
        recordedMistakePositions.current.add(index)
        setSessionMistakeCount((count) => count + 1)
      }
    }

    if (sourceText.length > 0 && next.length >= sourceText.length) {
      window.setTimeout(() => finishSession(next), 0)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return
    const nextIndex = typedText.length
    const expected = sourceText[nextIndex]
    if (event.key === 'Tab' && expected === '\t') {
      event.preventDefault()
      handleTypedChange(`${typedText}\t`)
    }
  }

  const retryMistake = (mistake: TypingSessionMistake) => {
    setMode('mistake-review')
    setSelectedRetrySnippetId(mistake.snippetId)
    const sample = buildMistakeReviewSample([
      {
        snippetId: mistake.snippetId,
        snippetText: getTypingSampleById(mistake.snippetId)?.text ?? '',
        language: mistake.language,
      },
    ])
    startSample(sample)
  }

  const handleClearMistakes = () => {
    const confirmed = window.confirm('Clear all saved typing mistakes from this browser?')
    if (!confirmed) return
    clearTypingMistakes()
    refreshStoragePanels()
    toast.success('Old typing mistakes cleared.')
  }

  const stats = [
    { label: 'WPM', value: liveMetrics.wpm },
    { label: 'Accuracy', value: `${liveMetrics.accuracy}%` },
    { label: 'Correct', value: liveMetrics.correctChars },
    { label: 'Wrong', value: liveMetrics.wrongChars },
    { label: 'Mistakes', value: sessionMistakeCount },
    { label: 'Elapsed', value: `${liveMetrics.elapsedSeconds}s` },
    { label: 'Complete', value: `${liveMetrics.completionPct}%` },
  ]

  if (embedded) {
    return (
      <div className="space-y-3">
        <TypingPracticeChrome
          mode={mode}
          setMode={setMode}
          language={language}
          setLanguage={setLanguage}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          isRunning={isRunning}
          activeSample={activeSample}
          elapsedSeconds={elapsedSeconds}
          onStart={loadNextSample}
          onRestart={() => activeSample && startSample(activeSample)}
          onFinish={() => finishSession()}
          onNext={loadNextSample}
        />
        <div className="grid gap-3 lg:grid-cols-2">
          <div className={cn('overflow-hidden rounded-lg border', wb.panel, wb.border)}>
            <TypingPromptDisplay source={sourceText} typed={typedText} />
          </div>
          <textarea
            ref={typingAreaRef}
            value={typedText}
            onChange={(event) => handleTypedChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isRunning}
            spellCheck={false}
            className={cn(
              'min-h-[220px] w-full resize-none rounded-lg border p-3 font-mono text-[13px] focus:outline-none disabled:opacity-60',
              wb.panel,
              wb.border,
              wb.textPrimary,
            )}
            placeholder={isRunning ? 'Start typing here…' : 'Press Start to begin'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-1 flex-col overflow-hidden', wb.root)}>
      <TypingPracticeChrome
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        isRunning={isRunning}
        activeSample={activeSample}
        elapsedSeconds={elapsedSeconds}
        onStart={loadNextSample}
        onRestart={() => activeSample && startSample(activeSample)}
        onFinish={() => finishSession()}
        onNext={loadNextSample}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_180px]">
        <section className={cn('flex min-h-[220px] flex-col overflow-hidden border-b lg:min-h-0 lg:border-b-0 lg:border-r', wb.border, wb.panel)}>
          <div className={cn('flex shrink-0 items-center justify-between border-b px-3 py-1.5', wb.border)}>
            <span className={cn('text-[12px] font-semibold', wb.textPrimary)}>Prompt</span>
            <span className={cn('text-[11px]', wb.textMuted)}>{sourceText.length} chars</span>
          </div>
          <TypingPromptDisplay source={sourceText} typed={typedText} className="min-h-0 flex-1" />
        </section>

        <section className={cn('flex min-h-[220px] flex-col overflow-hidden border-b lg:min-h-0 lg:border-b-0 lg:border-r', wb.border, wb.panel)}>
          <div className={cn('flex shrink-0 items-center justify-between border-b px-3 py-1.5', wb.border)}>
            <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-semibold', wb.textPrimary)}>
              <Keyboard size={14} />
              Your typing
            </span>
            <span className={cn('text-[11px]', wb.textMuted)}>{liveMetrics.completionPct}%</span>
          </div>

          {isMobile && sourceText.length > 0 && isRunning ? (
            <div className="shrink-0 border-b border-sky-900/60 bg-sky-950/30 px-3 py-2">
              <p className="text-[10px] font-semibold tracking-wide text-sky-300 uppercase">Next to type</p>
              <pre className="mt-0.5 max-h-20 overflow-auto font-mono text-[12px] leading-5 whitespace-pre-wrap text-sky-100">
                {getUpcomingPromptSegment(sourceText, typedText.length)}
              </pre>
            </div>
          ) : null}

          <textarea
            ref={typingAreaRef}
            value={typedText}
            onChange={(event) => handleTypedChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isRunning}
            spellCheck={false}
            className={cn(
              'min-h-0 w-full flex-1 resize-none border-0 bg-transparent p-3 font-mono text-[13px] leading-relaxed focus:outline-none disabled:opacity-60 md:text-[14px]',
              wb.textPrimary,
            )}
            placeholder={isRunning ? 'Start typing here…' : 'Press Start to begin'}
          />
        </section>

        <aside className={cn('grid grid-cols-4 gap-px overflow-auto border-b lg:grid-cols-1 lg:border-b-0', wb.border, 'bg-[#26324A]')}>
          {stats.map((stat) => (
            <div key={stat.label} className={cn('flex flex-col justify-center px-2.5 py-2 lg:px-3 lg:py-2.5', wb.panel)}>
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider', wb.textMuted)}>{stat.label}</p>
              <p className={cn('mt-0.5 text-[18px] font-bold tabular-nums leading-none', wb.textPrimary)}>{stat.value}</p>
            </div>
          ))}
        </aside>
      </div>

      {completionSummary ? (
        <div className="shrink-0 border-t border-emerald-900/50 bg-emerald-950/25 px-3 py-2">
          <p className="text-[12px] font-semibold text-emerald-200">
            Done — WPM {completionSummary.wpm} · {completionSummary.accuracy}% accuracy ·{' '}
            {completionSummary.totalMistakes} mistakes · {completionSummary.elapsedSeconds}s
          </p>
          <p className={cn('mt-0.5 text-[11px]', wb.textMuted)}>
            Weak chars:{' '}
            {completionSummary.weakCharacters.length > 0
              ? completionSummary.weakCharacters.map((item) => `${item.char}(${item.count})`).join(', ')
              : 'none'}
            {' · '}
            Weak tokens:{' '}
            {completionSummary.weakTokens.length > 0
              ? completionSummary.weakTokens.map((item) => `${item.token}(${item.count})`).join(', ')
              : 'none'}
          </p>
        </div>
      ) : null}

      <div className={cn('grid shrink-0 grid-cols-1 border-t lg:grid-cols-3', wb.border)}>
        <section className={cn('max-h-36 overflow-y-auto border-b px-3 py-2 lg:border-b-0 lg:border-r', wb.border, wb.panel)}>
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className={cn('text-[12px] font-semibold', wb.textPrimary)}>Session mistakes</h3>
            <span className={cn('text-[11px]', wb.textMuted)}>{sessionMistakeCount}</span>
          </div>
          <p className={cn('text-[12px]', wb.textMuted)}>
            {sessionMistakeCount === 0
              ? 'Mistakes appear here as you type.'
              : `${sessionMistakeCount} mistake${sessionMistakeCount === 1 ? '' : 's'} this run — saved when you finish.`}
          </p>
        </section>

        <section className={cn('max-h-36 overflow-y-auto border-b px-3 py-2 lg:border-b-0 lg:border-r', wb.border, wb.panel)}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <h3 className={cn('inline-flex items-center gap-1.5 text-[12px] font-semibold', wb.textPrimary)}>
              <AlertTriangle size={13} />
              Old mistakes
            </h3>
            <button type="button" onClick={handleClearMistakes} className={cn(wb.toolbarBtn, 'px-2 py-1 text-[11px]')}>
              <Trash2 size={12} />
              Clear
            </button>
          </div>
          {oldMistakes.length === 0 ? (
            <p className={cn('text-[12px]', wb.textMuted)}>No saved mistakes yet.</p>
          ) : (
            <ul className="space-y-1">
              {oldMistakes.slice(0, 6).map((mistake) => (
                <li
                  key={mistake.id}
                  className={cn('flex items-center justify-between gap-2 rounded-md border px-2 py-1.5', wb.border, 'bg-[#111827]')}
                >
                  <div className="min-w-0">
                    <p className={cn('truncate text-[12px] font-medium', wb.textSecondary)}>{mistake.snippetId}</p>
                    <p className={cn('truncate text-[10px]', wb.textMuted)}>
                      "{mistake.expectedChar === '\n' ? '\\n' : mistake.expectedChar}" → "
                      {mistake.typedChar === '\n' ? '\\n' : mistake.typedChar}" · {mistake.language}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => retryMistake(mistake)}
                    className={cn(wb.toolbarBtn, 'shrink-0 px-2 py-1 text-[11px]')}
                  >
                    Retry
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedRetrySnippetId ? (
            <p className={cn('mt-1 text-[10px]', wb.textMuted)}>
              Queue: {filterMistakesForSnippet(selectedRetrySnippetId).length} for {selectedRetrySnippetId}
            </p>
          ) : null}
        </section>

        <section className={cn('max-h-36 overflow-y-auto px-3 py-2', wb.panel)}>
          <h3 className={cn('mb-1.5 text-[12px] font-semibold', wb.textPrimary)}>Recent sessions</h3>
          {recentSessions.length === 0 ? (
            <p className={cn('text-[12px]', wb.textMuted)}>Complete a drill to see local progress.</p>
          ) : (
            <table className="w-full text-[11px]">
              <thead>
                <tr className={cn('text-left uppercase tracking-wider', wb.textMuted)}>
                  <th className="pb-1 pr-2 font-semibold">Snippet</th>
                  <th className="pb-1 pr-2 font-semibold">WPM</th>
                  <th className="pb-1 pr-2 font-semibold">Acc</th>
                  <th className="pb-1 font-semibold">Err</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.slice(0, 6).map((session) => (
                  <tr key={session.id} className={wb.textSecondary}>
                    <td className="truncate py-0.5 pr-2 max-w-[9rem]">{session.snippetTitle}</td>
                    <td className="py-0.5 pr-2 tabular-nums">{session.wpm}</td>
                    <td className="py-0.5 pr-2 tabular-nums">{session.accuracy}%</td>
                    <td className="py-0.5 tabular-nums">{session.mistakeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  )
}

function TypingPracticeChrome({
  mode,
  setMode,
  language,
  setLanguage,
  difficulty,
  setDifficulty,
  isRunning,
  activeSample,
  elapsedSeconds,
  onStart,
  onRestart,
  onFinish,
  onNext,
}: {
  mode: TypingPracticeMode
  setMode: (mode: TypingPracticeMode) => void
  language: TypingCodeLanguage
  setLanguage: (language: TypingCodeLanguage) => void
  difficulty: TypingDifficulty
  setDifficulty: (difficulty: TypingDifficulty) => void
  isRunning: boolean
  activeSample: TypingSample | null
  elapsedSeconds: number
  onStart: () => void
  onRestart: () => void
  onFinish: () => void
  onNext: () => void
}) {
  return (
    <header className={cn('shrink-0 border-b px-3 py-2', wb.panelHeader, wb.border)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="shrink-0 text-[12px] font-bold uppercase tracking-wider text-sky-300">
            Typing Practice
          </span>

          <ChipGroup label="Mode">
            {MODES.map((item) => (
              <Chip key={item.id} active={mode === item.id} onClick={() => setMode(item.id)}>
                {item.label}
              </Chip>
            ))}
          </ChipGroup>

          <ChipGroup label="Lang">
            {CODE_LANGUAGES.map((item) => (
              <Chip
                key={item.id}
                active={language === item.id && mode === 'code'}
                disabled={mode !== 'code'}
                onClick={() => setLanguage(item.id)}
              >
                {item.id === 'sql' ? 'SQL' : item.label}
              </Chip>
            ))}
          </ChipGroup>

          <ChipGroup label="Level">
            {DIFFICULTIES.map((item) => (
              <Chip
                key={item.id}
                active={difficulty === item.id && mode !== 'mistake-review'}
                disabled={mode === 'mistake-review'}
                onClick={() => setDifficulty(item.id)}
              >
                {item.label}
              </Chip>
            ))}
          </ChipGroup>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-sky-400"
          >
            <Sparkles size={13} />
            {isRunning ? 'New' : 'Start'}
          </button>
          <button type="button" onClick={onRestart} disabled={!activeSample} className={wb.toolbarBtn}>
            <RotateCcw size={13} />
            Restart
          </button>
          <button type="button" onClick={onFinish} disabled={!isRunning} className={wb.toolbarBtn}>
            Finish
          </button>
          <button type="button" onClick={onNext} disabled={!activeSample} className={wb.toolbarBtn}>
            <SkipForward size={13} />
            Next
          </button>
        </div>
      </div>

      {activeSample ? (
        <div className={cn('mt-1.5 flex flex-wrap items-center gap-2 text-[11px]', wb.textMuted)}>
          <span className={cn('rounded border px-1.5 py-0.5', wb.border)}>{activeSample.title}</span>
          <span>{activeSample.language}</span>
          <span>{activeSample.difficulty}</span>
          <span className="inline-flex items-center gap-1">
            <Timer size={11} />
            {elapsedSeconds}s
          </span>
          <span>Ctrl+Shift+R restart</span>
        </div>
      ) : (
        <p className={cn('mt-1.5 text-[11px]', wb.textMuted)}>
          Code-focused drills · progress stays in this browser · SQL is typing-only
        </p>
      )}
    </header>
  )
}

function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className={cn('text-[10px] font-semibold uppercase tracking-wider', wb.textMuted)}>{label}</span>
      {children}
    </div>
  )
}

function Chip({
  children,
  active,
  disabled,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-md px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-40',
        active ? wb.langActive : wb.langInactive,
      )}
    >
      {children}
    </button>
  )
}
