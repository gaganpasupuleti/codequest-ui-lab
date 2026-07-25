import { listCodePracticeMistakes } from '@/features/code-practice/utils/codePracticeMistakes'
import { SQL_PRACTICE_QUESTIONS } from '@/features/sql-practice/data/sqlQuestions'
import { getQuestionProgressSummary } from '@/features/sql-practice/utils/sqlPracticeAnalytics'
import { loadSqlProgress } from '@/features/sql-practice/utils/sqlPracticeProgress'
import { loadSqlAttempts, loadSqlMistakes } from '@/features/sql-practice/utils/sqlPracticeStorage'
import {
  getRecentTypingSessions,
  readTypingMistakes,
} from '@/features/typing-practice/utils/typingMistakes'
import { toIsoDate } from '@/lib/dashboard-derive'

const CODE_ATTEMPTS_KEY = 'codequest-code-practice-attempts'

export interface PracticeAreaSummary {
  label: string
  completed: number
  total: number
  pct: number
  detail: string
  /** ISO timestamp of the most recent activity in this area, if any. */
  lastPracticeAt: string | null
  /** True once the learner has any attempts/sessions in this area. */
  hasActivity: boolean
}

/** Relative “Last session …” copy for practice cards. */
export function formatLastPracticeLabel(iso: string | null): string {
  if (!iso) return 'Not started yet'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'Not started yet'
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days <= 0) return 'Last session: today'
  if (days === 1) return 'Last session: yesterday'
  if (days < 14) return `Last session: ${days} days ago`
  return `Last session: ${new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
}

/** Prefer the practice area with the most recent activity; else SQL for new users. */
export function resolveContinuePracticeTarget(
  sql: PracticeAreaSummary,
  code: PracticeAreaSummary,
  typing: PracticeAreaSummary,
): 'practice-sql' | 'practice-code' | 'practice-typing' {
  const ranked = [
    { page: 'practice-sql' as const, at: sql.lastPracticeAt },
    { page: 'practice-code' as const, at: code.lastPracticeAt },
    { page: 'practice-typing' as const, at: typing.lastPracticeAt },
  ]
    .filter((r) => r.at)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
  return ranked[0]?.page ?? 'practice-sql'
}

export interface PracticeStreakSummary {
  currentStreak: number
  bestStreak: number
  practicedToday: boolean
  lastPracticeDate: string | null
}

export interface MistakesSummary {
  sql: number
  code: number
  typing: number
  total: number
}

function readCodeAttempts(): { createdAt: string; passed?: boolean }[] {
  try {
    const raw = localStorage.getItem(CODE_ATTEMPTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { createdAt?: string; attemptedAt?: string; passed?: boolean }[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      createdAt: item.createdAt ?? item.attemptedAt ?? new Date().toISOString(),
      passed: item.passed,
    }))
  } catch {
    return []
  }
}

function collectPracticeDates(): Set<string> {
  const dates = new Set<string>()

  for (const attempt of loadSqlAttempts()) {
    if (attempt.ranAt) dates.add(toIsoDate(new Date(attempt.ranAt)))
  }
  for (const attempt of readCodeAttempts()) {
    dates.add(toIsoDate(new Date(attempt.createdAt)))
  }
  for (const session of getRecentTypingSessions(40)) {
    dates.add(toIsoDate(new Date(session.completedAt)))
  }

  return dates
}

function computeStreakFromDates(sortedDatesDesc: string[]): { current: number; best: number } {
  if (sortedDatesDesc.length === 0) return { current: 0, best: 0 }

  const unique = [...new Set(sortedDatesDesc)].sort((a, b) => b.localeCompare(a))
  const today = toIsoDate(new Date())
  const yesterday = toIsoDate(new Date(Date.now() - 86400000))

  let current = 0
  if (unique[0] === today || unique[0] === yesterday) {
    let cursor = unique[0] === today ? today : yesterday
    for (const date of unique) {
      if (date === cursor) {
        current += 1
        const prev = new Date(cursor + 'T12:00:00')
        prev.setDate(prev.getDate() - 1)
        cursor = toIsoDate(prev)
      } else if (date < cursor) {
        break
      }
    }
  }

  let best = 0
  let run = 0
  const asc = [...unique].sort((a, b) => a.localeCompare(b))
  for (let i = 0; i < asc.length; i++) {
    if (i === 0) {
      run = 1
    } else {
      const prev = new Date(asc[i - 1] + 'T12:00:00')
      prev.setDate(prev.getDate() + 1)
      run = asc[i] === toIsoDate(prev) ? run + 1 : 1
    }
    best = Math.max(best, run)
  }

  return { current, best }
}

export function getPracticeStreakSummary(): PracticeStreakSummary {
  const dates = collectPracticeDates()
  const sorted = [...dates].sort((a, b) => b.localeCompare(a))
  const { current, best } = computeStreakFromDates(sorted)
  const today = toIsoDate(new Date())

  return {
    currentStreak: current,
    bestStreak: best,
    practicedToday: dates.has(today),
    lastPracticeDate: sorted[0] ?? null,
  }
}

export function getSqlPracticeSummary(): PracticeAreaSummary {
  const progress = loadSqlProgress()
  const attempts = loadSqlAttempts()
  const summary = getQuestionProgressSummary(SQL_PRACTICE_QUESTIONS, progress)
  const pct = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0
  const lastPracticeAt =
    attempts
      .map((a) => a.ranAt)
      .filter((v): v is string => Boolean(v))
      .sort((a, b) => b.localeCompare(a))[0] ?? null
  const hasActivity = summary.passed + summary.failed > 0 || attempts.length > 0

  return {
    label: 'SQL Practice',
    completed: summary.passed,
    total: summary.total,
    pct,
    detail: hasActivity
      ? `${summary.failed} need review · ${summary.unattempted} not started`
      : 'Start with your first SQL module',
    lastPracticeAt,
    hasActivity,
  }
}

export function getCodePracticeSummary(): PracticeAreaSummary {
  const attempts = readCodeAttempts()
  const mistakes = listCodePracticeMistakes()
  const passedCount = attempts.filter((a) => a.passed).length
  const pct =
    attempts.length > 0 ? Math.round((passedCount / attempts.length) * 100) : 0
  const lastPracticeAt =
    attempts.map((a) => a.createdAt).sort((a, b) => b.localeCompare(a))[0] ?? null
  const hasActivity = attempts.length > 0

  return {
    label: 'Code Workbench',
    completed: passedCount,
    total: Math.max(attempts.length, hasActivity ? attempts.length : 0),
    pct: hasActivity ? pct : 0,
    detail: hasActivity
      ? `${mistakes.length} mistake${mistakes.length === 1 ? '' : 's'} saved locally`
      : 'Solve your first coding challenge',
    lastPracticeAt,
    hasActivity,
  }
}

export function getTypingPracticeSummary(typingAttemptsWpm: number | null): PracticeAreaSummary {
  const sessions = getRecentTypingSessions(20)
  const avgWpm =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, r) => s + r.wpm, 0) / sessions.length)
      : typingAttemptsWpm

  const pct = avgWpm ? Math.min(100, Math.round((avgWpm / 80) * 100)) : 0
  const lastPracticeAt =
    sessions.map((s) => s.completedAt).sort((a, b) => b.localeCompare(a))[0] ?? null
  const hasActivity = sessions.length > 0

  return {
    label: 'Typing Practice',
    completed: sessions.length,
    total: Math.max(sessions.length, 10),
    pct,
    detail: hasActivity
      ? `Avg ${avgWpm ?? 0} WPM · ${sessions.length} session${sessions.length === 1 ? '' : 's'}`
      : 'Build speed with a short typing drill',
    lastPracticeAt,
    hasActivity,
  }
}

export function getMistakesSummary(): MistakesSummary {
  const sql = loadSqlMistakes().length
  const code = listCodePracticeMistakes().length
  const typing = readTypingMistakes().length

  return { sql, code, typing, total: sql + code + typing }
}
