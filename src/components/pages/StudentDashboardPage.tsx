import { useMemo } from 'react'

import { cn } from '@/lib/utils'

import { JobReadinessPanel, PlannerCard } from '@/components/student-dashboard/DashboardCalendarPanel'
import { DashboardTopHeader } from '@/components/student-dashboard/DashboardTopHeader'
import {
  DeadlinesPanel,
  PracticeProgressGrid,
  ProgressPanel,
  SyllabusPanel,
  TodayPanel,
  UpcomingClassesPanel,
} from '@/components/student-dashboard/DashboardContentSections'
import { CQ_PAGE_BG, CQ_PAGE_PAD, CQ_STACK_GAP } from '@/components/student-dashboard/cq/cqTheme'
import { resolveNextLessonTitle } from '@/components/student-dashboard/DashboardHero'
import { useStudentDashboardSnapshot } from '@/components/student-dashboard/useStudentDashboardSnapshot'
import { useLearningPlanner } from '@/components/learning-planner/useLearningPlanner'
import type { AuthUser } from '@/lib/auth'
import { computeDaysRemaining, computeReadinessBreakdown } from '@/lib/dashboard-derive'
import {
  getCodePracticeSummary,
  getPracticeStreakSummary,
  getSqlPracticeSummary,
  getTypingPracticeSummary,
} from '@/lib/practice-progress-summary'
import { storeSelectedDateForPlanner } from '@/lib/learning-planner-derive'

type DashboardNavTarget =
  | 'roadmapper'
  | 'jobspy'
  | 'learning-planner'
  | 'calendar'
  | 'progress'
  | 'resume'
  | 'practice-sql'
  | 'practice-code'
  | 'practice-typing'

interface StudentDashboardPageProps {
  user: AuthUser
  onNavigate: (page: DashboardNavTarget) => void
}

export function StudentDashboardPage({ user, onNavigate }: StudentDashboardPageProps) {
  const snapshot = useStudentDashboardSnapshot(user)
  const plannerPreview = useLearningPlanner(user)
  const firstName = user.full_name.split(' ')[0] ?? user.full_name

  const daysRemaining = useMemo(
    () => computeDaysRemaining(snapshot.deadlines),
    [snapshot.deadlines],
  )

  const nextLessonTitle = useMemo(
    () => resolveNextLessonTitle(snapshot.careerJourney, snapshot.upcomingSessions),
    [snapshot.careerJourney, snapshot.upcomingSessions],
  )

  const readiness = useMemo(
    () =>
      computeReadinessBreakdown({
        submittedProjects: snapshot.submittedProjects,
        careerPct: snapshot.careerJourney?.pct ?? null,
        stageRows: snapshot.stageRows,
        typingAttempts: snapshot.typingAttempts,
        catalogSteps: snapshot.catalogSteps,
      }),
    [
      snapshot.submittedProjects,
      snapshot.careerJourney,
      snapshot.stageRows,
      snapshot.typingAttempts,
      snapshot.catalogSteps,
    ],
  )

  const typingWpm =
    snapshot.typingAttempts.length > 0
      ? Math.round(
          snapshot.typingAttempts.reduce((s, a) => s + a.wpm, 0) / snapshot.typingAttempts.length,
        )
      : null

  const sqlSummary = getSqlPracticeSummary()
  const codeSummary = getCodePracticeSummary()
  const typingSummary = getTypingPracticeSummary(typingWpm)
  const streak = getPracticeStreakSummary()

  const progressPct = snapshot.careerJourney?.pct ?? 0
  const pathTitle = snapshot.careerJourney?.title ?? 'Choose your career path'

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <DashboardTopHeader
        firstName={firstName}
        pathTitle={pathTitle}
        progressPct={progressPct}
        currentStreak={streak.currentStreak}
        practicedToday={streak.practicedToday}
        daysRemaining={daysRemaining}
        nextLessonTitle={nextLessonTitle}
        loading={snapshot.loading}
        onContinuePractice={() => onNavigate('practice-code')}
        onOpenCareer={() => onNavigate('roadmapper')}
        onOpenCalendar={() => onNavigate('calendar')}
        onOpenResume={() => onNavigate('resume')}
        onOpenJobs={() => onNavigate('jobspy')}
      />

      <div className={cn('mt-3 grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start', CQ_STACK_GAP)}>
        <div className={cn('flex min-w-0 flex-col', CQ_STACK_GAP)}>
          <div className={cn('grid lg:grid-cols-[1fr_1.4fr] lg:items-stretch', CQ_STACK_GAP)}>
            <TodayPanel
              sessions={snapshot.upcomingSessions}
              deadlines={snapshot.deadlines}
              loading={snapshot.loading}
              onOpenCalendar={() => onNavigate('calendar')}
            />
            <PracticeProgressGrid
              sql={sqlSummary}
              code={codeSummary}
              typing={typingSummary}
              onPracticeSql={() => onNavigate('practice-sql')}
              onPracticeCode={() => onNavigate('practice-code')}
              onPracticeTyping={() => onNavigate('practice-typing')}
            />
          </div>

          <ProgressPanel
            careerJourney={snapshot.careerJourney}
            stageRows={snapshot.stageRows}
            catalogSteps={snapshot.catalogSteps}
            loading={snapshot.loading}
            onViewProgress={() => onNavigate('progress')}
          />

          <div className={cn('grid lg:grid-cols-2 lg:items-stretch', CQ_STACK_GAP)}>
            <UpcomingClassesPanel sessions={snapshot.upcomingSessions} loading={snapshot.loading} />
            <SyllabusPanel
              careerJourney={snapshot.careerJourney}
              stageRows={snapshot.stageRows}
              loading={snapshot.loading}
              onOpenCareer={() => onNavigate('roadmapper')}
            />
          </div>

          <div className={cn('grid lg:grid-cols-[1.4fr_1fr] lg:items-stretch', CQ_STACK_GAP)}>
            <DeadlinesPanel deadlines={snapshot.deadlines} loading={snapshot.loading} />
            <JobReadinessPanel
              readiness={readiness}
              loading={snapshot.loading}
              onOpenJobs={() => onNavigate('jobspy')}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-4">
          <PlannerCard
            viewMonth={plannerPreview.viewMonth}
            onViewMonthChange={plannerPreview.setViewMonth}
            selectedDate={plannerPreview.selectedDate}
            onSelectDate={(date) => {
              storeSelectedDateForPlanner(date)
              plannerPreview.setSelectedDate(date)
            }}
            markedDates={plannerPreview.markedDates}
            dayPlan={plannerPreview.dayPlan}
            plannerLoading={plannerPreview.loading}
            onOpenPlanner={() => {
              storeSelectedDateForPlanner(plannerPreview.selectedDate)
              onNavigate('calendar')
            }}
          />
        </div>
      </div>
    </div>
  )
}
