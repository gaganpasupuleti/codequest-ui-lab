import { useMemo } from 'react'

import { cn } from '@/lib/utils'

import { JobReadinessPanel, PlannerCard } from '@/components/student-dashboard/DashboardCalendarPanel'
import { DashboardTopHeader } from '@/components/student-dashboard/DashboardTopHeader'
import {
  DashboardGlanceRow,
  DeadlinesPanel,
  ProgressPanel,
  SyllabusPanel,
  UpcomingClassesPanel,
} from '@/components/student-dashboard/DashboardContentSections'
import {
  CQ_DASHBOARD_CONTAINER,
  CQ_PAGE_BG,
  CQ_PAGE_PAD,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
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
  resolveContinuePracticeTarget,
} from '@/lib/practice-progress-summary'
import { storeSelectedDateForPlanner } from '@/lib/learning-planner-derive'

type DashboardNavTarget =
  | 'roadmapper'
  | 'jobspy'
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
  const hasAnyPractice =
    sqlSummary.hasActivity || codeSummary.hasActivity || typingSummary.hasActivity
  const continueTarget = resolveContinuePracticeTarget(sqlSummary, codeSummary, typingSummary)
  const continueLabel = hasAnyPractice ? 'Continue practice' : 'Start practicing'
  const plannerSuggestion = !sqlSummary.hasActivity
    ? 'Start your first SQL module'
    : !codeSummary.hasActivity
      ? 'Try a Code Workbench challenge'
      : !typingSummary.hasActivity
        ? 'Warm up with a typing drill'
        : nextLessonTitle
          ? `Continue: ${nextLessonTitle}`
          : 'Review yesterday\'s practice and push one more set'

  const progressPct = snapshot.careerJourney?.pct ?? 0
  const pathTitle = snapshot.careerJourney?.title ?? 'Choose your career path'

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={CQ_DASHBOARD_CONTAINER}>
        <DashboardTopHeader
          firstName={firstName}
          pathTitle={pathTitle}
          progressPct={progressPct}
          currentStreak={streak.currentStreak}
          practicedToday={streak.practicedToday}
          daysRemaining={daysRemaining}
          nextLessonTitle={nextLessonTitle}
          loading={snapshot.loading}
          continueLabel={continueLabel}
          onContinuePractice={() => onNavigate(continueTarget)}
          onOpenCareer={() => onNavigate('roadmapper')}
          onOpenCalendar={() => onNavigate('calendar')}
          onOpenResume={() => onNavigate('resume')}
          onOpenJobs={() => onNavigate('jobspy')}
        />

        <div className={cn('mt-3 flex min-w-0 flex-col', CQ_STACK_GAP)}>
          <DashboardGlanceRow
            sessions={snapshot.upcomingSessions}
            deadlines={snapshot.deadlines}
            loading={snapshot.loading}
            onOpenCalendar={() => onNavigate('calendar')}
            sql={sqlSummary}
            code={codeSummary}
            typing={typingSummary}
            onPracticeSql={() => onNavigate('practice-sql')}
            onPracticeCode={() => onNavigate('practice-code')}
            onPracticeTyping={() => onNavigate('practice-typing')}
          />

          {/*
            Container queries (not viewport): sidebar width no longer delays the
            two-column layout, and the planner track scales with available space.
          */}
          <div
            className={cn(
              'grid min-w-0 grid-cols-1 items-start',
              '@min-[860px]/dash:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]',
              CQ_STACK_GAP,
            )}
          >
            <div className={cn('flex min-w-0 flex-col', CQ_STACK_GAP)}>
              <ProgressPanel
                careerJourney={snapshot.careerJourney}
                stageRows={snapshot.stageRows}
                catalogSteps={snapshot.catalogSteps}
                loading={snapshot.loading}
                onViewProgress={() => onNavigate('progress')}
              />
              <div
                className={cn(
                  'grid min-w-0 auto-rows-fr grid-cols-1 items-stretch',
                  '@min-[560px]/dash:grid-cols-2',
                  CQ_STACK_GAP,
                )}
              >
                <div className="min-h-0 h-full">
                  <UpcomingClassesPanel
                    sessions={snapshot.upcomingSessions}
                    loading={snapshot.loading}
                  />
                </div>
                <div className="min-h-0 h-full">
                  <SyllabusPanel
                    careerJourney={snapshot.careerJourney}
                    stageRows={snapshot.stageRows}
                    loading={snapshot.loading}
                    onOpenCareer={() => onNavigate('roadmapper')}
                  />
                </div>
                <div className="min-h-0 h-full">
                  <DeadlinesPanel deadlines={snapshot.deadlines} loading={snapshot.loading} />
                </div>
                <div className="min-h-0 h-full">
                  <JobReadinessPanel
                    readiness={readiness}
                    loading={snapshot.loading}
                    onOpenJobs={() => onNavigate('jobspy')}
                  />
                </div>
              </div>
            </div>
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
              emptyDaySuggestion={plannerSuggestion}
              className="@min-[860px]/dash:sticky @min-[860px]/dash:top-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
