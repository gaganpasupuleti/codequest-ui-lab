import { getStoredUser } from '@/lib/auth'
import { dummyStudent } from '@/data/dummyStudent'
import { learningPaths } from '@/data/dummyCourses'
import { currentQuests } from '@/data/dummyQuests'
import { weeklyProgress, skillProgress, completedQuests, streakCalendar } from '@/data/dummyProgress'
import { StudentDashboardShell } from '@/components/dashboard/pastel/StudentDashboardShell'
import { ContinueLearningCard } from '@/components/dashboard/pastel/ContinueLearningCard'
import { LearningProgressCard } from '@/components/dashboard/pastel/LearningProgressCard'
import { MiniCalendarCard } from '@/components/dashboard/pastel/MiniCalendarCard'
import { PopularTracksCard } from '@/components/dashboard/pastel/PopularTracksCard'
import { TodaysQuestCard } from '@/components/dashboard/pastel/TodaysQuestCard'
import { MentorSupportCard } from '@/components/dashboard/pastel/MentorSupportCard'
import { WeeklyGoalCard } from '@/components/dashboard/pastel/WeeklyGoalCard'
import { LiveClassesCard } from '@/components/dashboard/pastel/LiveClassesCard'
import { ResumeReadinessCard } from '@/components/dashboard/pastel/ResumeReadinessCard'
import { CareerMapCard } from '@/components/dashboard/pastel/CareerMapCard'
import { AchievementCard } from '@/components/dashboard/pastel/AchievementCard'
import { XpStreakCard } from '@/components/dashboard/pastel/XpStreakCard'
import { ILLUSTRATIVE } from '@/components/dashboard/pastel/pastelNav'

export function DashboardPage() {
  const user = getStoredUser()
  const firstName = (user?.full_name ?? dummyStudent.name).split(' ')[0] ?? 'Learner'

  const continuePath = learningPaths[0]
  const todaysQuest = currentQuests[0]
  const resumeSkill = skillProgress.find((s) => s.skill === 'Resume')
  // Keep streak source data; calendar only highlights a sparse important set
  const activeStreakDays = streakCalendar.filter((d) => d.active).map((d) => d.day)
  const todayDay = new Date().getDate()
  const calendarStreakDays = activeStreakDays.filter((d) => d >= todayDay - 4 && d <= todayDay)
  const calendarCompletedDays = activeStreakDays
    .filter((d) => d < todayDay - 4 && d % 5 === 1)
    .slice(0, 4)

  const lessonsTotal = 12
  const lessonsDone = Math.round(((continuePath?.progress ?? 0) / 100) * lessonsTotal)
  const questTotal = 5
  const questDone = Math.round(((todaysQuest?.progress ?? 0) / 100) * questTotal)

  return (
    <StudentDashboardShell
      firstName={firstName}
      questTitle={todaysQuest?.title ?? 'Daily practice'}
      continueHref={todaysQuest?.href ?? '/practice'}
      level={dummyStudent.level}
      xp={dummyStudent.xp}
      xpToNext={dummyStudent.xpToNext}
      streak={dummyStudent.streak}
    >
      <div className="sp-bento">
        <ContinueLearningCard
          title={continuePath?.title ?? 'Learning path'}
          lesson="Joins & nested queries · Module 3"
          progress={continuePath?.progress ?? 0}
          lessonsDone={lessonsDone}
          lessonsTotal={lessonsTotal}
          duration="2:05h"
          href={continuePath?.href ?? '/sql-arena'}
          nextPreview="Advanced JOIN challenge"
          relatedLabel="Python Lab"
          delay={0}
        />
        <LearningProgressCard
          points={weeklyProgress}
          assignments={80}
          courses={60}
          lessons={85}
          delay={0.04}
        />
        <MiniCalendarCard
          streakDays={calendarStreakDays}
          completedDays={calendarCompletedDays}
          delay={0.08}
        />

        <PopularTracksCard delay={0.1} />
        <TodaysQuestCard
          title={todaysQuest?.title ?? "Today's quest"}
          description={todaysQuest?.description ?? 'Complete a practice challenge.'}
          xp={todaysQuest?.xp ?? 100}
          progress={todaysQuest?.progress ?? 0}
          difficulty={todaysQuest?.badge ?? 'Practice'}
          completed={questDone}
          total={questTotal}
          href={todaysQuest?.href ?? '/practice'}
          delay={0.12}
        />
        <MentorSupportCard {...ILLUSTRATIVE.mentor} delay={0.14} />

        <WeeklyGoalCard {...ILLUSTRATIVE.weeklyGoal} delay={0.16} />
        <LiveClassesCard {...ILLUSTRATIVE.liveClass} delay={0.18} />
        <ResumeReadinessCard
          score={resumeSkill?.progress ?? dummyStudent.careerReadiness}
          missing={['Power BI', 'Window functions', 'Portfolio write-up']}
          delay={0.2}
        />

        <CareerMapCard
          role="Data Analyst"
          readiness={dummyStudent.careerReadiness}
          stage="Resume"
          nextStep={dummyStudent.upcomingTasks[1]?.title ?? 'Resume ATS Review'}
          delay={0.22}
        />
        <AchievementCard
          courseCount={completedQuests.length + 25}
          projectCount={6}
          challengeCount={completedQuests.length + 18}
          latest={completedQuests[0]?.title ?? 'Recent quest'}
          recent={completedQuests.slice(0, 2).map((q) => q.title)}
          delay={0.24}
        />
        <XpStreakCard
          xp={dummyStudent.xp}
          level={dummyStudent.level}
          xpToNext={dummyStudent.xpToNext}
          streak={dummyStudent.streak}
          delay={0.26}
        />
      </div>
    </StudentDashboardShell>
  )
}
