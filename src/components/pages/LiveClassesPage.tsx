import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Clock, Loader2, Video } from 'lucide-react'

import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_CHIP,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { fetchUpcomingSchedule, type UpcomingSession } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'
import {
  blendStudentScheduleDummyIfNeeded,
  DUMMY_UPCOMING_DEADLINES,
  DUMMY_UPCOMING_SESSIONS,
} from '@/lib/student-dashboard-dummy'
import { cn } from '@/lib/utils'

interface LiveClassesPageProps {
  user: AuthUser
}

function formatTime(t: string): string {
  const [h, m] = t.split(':')
  const hour = Number(h)
  if (Number.isNaN(hour)) return t.slice(0, 5)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${(m ?? '00').slice(0, 2)} ${ampm}`
}

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function LiveClassesPage({ user }: LiveClassesPageProps) {
  const [sessions, setSessions] = useState<UpcomingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      try {
        const api = await fetchUpcomingSchedule(20).catch(() => [] as UpcomingSession[])
        if (cancelled) return
        const blend = blendStudentScheduleDummyIfNeeded(user, api, DUMMY_UPCOMING_DEADLINES)
        setSessions(blend.sessions.length > 0 ? blend.sessions : DUMMY_UPCOMING_SESSIONS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const up: UpcomingSession[] = []
    const done: UpcomingSession[] = []
    for (const s of sessions) {
      if (s.session_date < today || s.status === 'completed') done.push(s)
      else up.push(s)
    }
    up.sort((a, b) => a.session_date.localeCompare(b.session_date))
    done.sort((a, b) => b.session_date.localeCompare(a.session_date))
    return { upcoming: up, past: done }
  }, [sessions])

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <header>
          <h1 className={CQ_PAGE_TITLE}>Live Classes</h1>
          <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
            Scheduled cohort sessions. Join opens when the class is live.
          </p>
        </header>

        {loading ? (
          <CQCard className="flex min-h-[6rem] items-center gap-2 text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span className={CQ_META}>Loading schedule…</span>
          </CQCard>
        ) : (
          <>
            <section className={cn('flex flex-col', CQ_STACK_GAP)}>
              <h2 className={CQ_SECTION_TITLE}>Upcoming</h2>
              {upcoming.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#E5E7EB] bg-white px-4 py-6 text-center">
                  <p className={CQ_META}>No upcoming classes on the schedule.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {upcoming.map((session) => (
                    <li key={session.id}>
                      <CQCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className={cn(CQ_CHIP, 'bg-sky-50 text-sky-800')}>
                              {session.status === 'live' ? 'Live' : 'Scheduled'}
                            </span>
                            <span className={cn(CQ_META, 'truncate')}>{session.batch_name}</span>
                          </div>
                          <p className="text-[14px] font-semibold text-[#111827]">{session.title}</p>
                          {session.topic ? (
                            <p className={cn(CQ_META, 'mt-0.5 line-clamp-1')}>{session.topic}</p>
                          ) : null}
                          <div className={cn('mt-2 flex flex-wrap gap-3', CQ_META)}>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                              {formatDate(session.session_date)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" aria-hidden />
                              {formatTime(session.start_time)} – {formatTime(session.end_time)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={session.status !== 'live'}
                          className={cn(
                            'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold',
                            session.status === 'live'
                              ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                              : 'cursor-not-allowed bg-zinc-100 text-zinc-500',
                          )}
                          title={
                            session.status === 'live'
                              ? 'Join live class'
                              : 'Join available when class is live'
                          }
                        >
                          <Video className="h-3.5 w-3.5" aria-hidden />
                          Join
                        </button>
                      </CQCard>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {past.length > 0 && (
              <section className={cn('flex flex-col', CQ_STACK_GAP)}>
                <h2 className={CQ_SECTION_TITLE}>Recent</h2>
                <ul className="flex flex-col gap-2">
                  {past.slice(0, 5).map((session) => (
                    <li key={session.id}>
                      <CQCard className="flex items-start justify-between gap-3 opacity-80">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#111827]">{session.title}</p>
                          <p className={CQ_META}>
                            {formatDate(session.session_date)} · {formatTime(session.start_time)}
                          </p>
                        </div>
                        <span className={cn(CQ_CHIP, 'shrink-0 bg-zinc-100 text-zinc-600')}>Done</span>
                      </CQCard>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
