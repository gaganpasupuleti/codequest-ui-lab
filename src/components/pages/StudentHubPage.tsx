import { useCallback, useEffect, useState } from 'react'
import { Briefcase, BookOpenCheck, ClipboardList, Loader2, Map } from 'lucide-react'
import { toast } from 'sonner'
import { fetchMyStageProgress, fetchUserProgress, type StageProgressRecord } from '@/lib/api'
import { readCareerMapLocalSummary } from '@/lib/career-local-summary'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_LABEL,
  CQ_META,
  CQ_METRIC,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface StudentHubPageProps {
  onOpenJobBoard?: () => void
}

export function StudentHubPage({ onOpenJobBoard }: StudentHubPageProps) {
  const [stageRows, setStageRows] = useState<StageProgressRecord[] | null>(null)
  const [catalogSteps, setCatalogSteps] = useState<number | null>(null)
  const [careerLocal, setCareerLocal] = useState<{ title: string; pct: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setCareerLocal(readCareerMapLocalSummary())
    try {
      const [stages, catalog] = await Promise.all([
        fetchMyStageProgress().catch(() => [] as StageProgressRecord[]),
        fetchUserProgress().catch(() => ({ completedSteps: [] })),
      ])
      const demoStage: StageProgressRecord = {
        stage_id: 1,
        lessons_completed: 2,
        total_lessons: 8,
        exercises_completed_pct: 25,
        latest_quiz_score: 0,
        unlocked: true,
      }
      setStageRows(stages.length > 0 ? stages : [demoStage])
      setCatalogSteps(catalog.completedSteps?.length ?? 0)
      if (!readCareerMapLocalSummary()) {
        setCareerLocal({ title: 'Data Analyst (sample)', pct: 12 })
      }
    } catch {
      toast.error('Could not load hub data. Showing sample progress.')
      setStageRows([
        {
          stage_id: 1,
          lessons_completed: 2,
          total_lessons: 8,
          exercises_completed_pct: 25,
          latest_quiz_score: 0,
          unlocked: true,
        },
      ])
      setCatalogSteps(2)
      setCareerLocal({ title: 'Data Analyst (sample)', pct: 12 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <header>
          <h1 className={CQ_PAGE_TITLE}>Progress hub</h1>
          <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
            Track learning progress across Career Map, catalog projects, and stages.
          </p>
        </header>

        {loading ? (
          <CQCard className="flex min-h-[8rem] items-center gap-2 text-[#6B7280]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className={CQ_META}>Loading your hub…</span>
          </CQCard>
        ) : (
          <>
            <section className={cn('flex flex-col', CQ_STACK_GAP)}>
              <h2 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
                <ClipboardList className="h-4 w-4 text-[#2563EB]" />
                Learning progress
              </h2>
              <div className="grid min-w-0 auto-rows-fr grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <CQCard className="flex h-full min-h-[7.5rem] flex-col">
                  <div className={cn(CQ_LABEL, 'mb-2 flex items-center gap-1.5')}>
                    <Map className="h-3.5 w-3.5" />
                    Career Map
                  </div>
                  {careerLocal ? (
                    <>
                      <p className={CQ_METRIC}>{careerLocal.pct}%</p>
                      <p className={cn(CQ_META, 'mt-auto pt-2 line-clamp-2')}>
                        Role: {careerLocal.title}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={CQ_METRIC}>—</p>
                      <p className={cn(CQ_META, 'mt-auto pt-2')}>
                        Select a role in Career Map to track syllabus completion.
                      </p>
                    </>
                  )}
                </CQCard>
                <CQCard className="flex h-full min-h-[7.5rem] flex-col">
                  <div className={cn(CQ_LABEL, 'mb-2 flex items-center gap-1.5')}>
                    <BookOpenCheck className="h-3.5 w-3.5" />
                    Catalog projects
                  </div>
                  <p className={CQ_METRIC}>{catalogSteps ?? 0}</p>
                  <p className={cn(CQ_META, 'mt-auto pt-2')}>Project steps marked complete</p>
                </CQCard>
                <CQCard className="flex h-full min-h-[7.5rem] flex-col">
                  <div className={cn(CQ_LABEL, 'mb-2')}>Stage tracking</div>
                  <p className={CQ_METRIC}>{stageRows?.length ?? 0}</p>
                  <p className={cn(CQ_META, 'mt-auto pt-2')}>
                    {(stageRows?.length ?? 0) > 0
                      ? 'Stages tracked for your path.'
                      : 'No stage progress yet.'}
                  </p>
                </CQCard>
              </div>
            </section>

            {onOpenJobBoard && (
              <CQCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" />
                  <div>
                    <h2 className={CQ_SECTION_TITLE}>Job Board</h2>
                    <p className={cn(CQ_META, 'mt-1')}>
                      Browse live roles curated for Code Quest students — internships, fresher, and
                      entry-level positions.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenJobBoard}
                  className="shrink-0 rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1D4ED8]"
                >
                  Open Job Board
                </button>
              </CQCard>
            )}
          </>
        )}
      </div>
    </div>
  )
}
