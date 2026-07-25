import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Clock, BarChart2, Lock } from 'lucide-react'
import { canStartDemoProject, recordDemoProjectStart, triggerProjectLockedError } from '@/lib/demo-limits'
import { CatalogProjectSummary, fetchCatalogProjects } from '@/lib/api'
import { isDemoUser } from '@/lib/auth'
import { CQCard } from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_CHIP,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

interface ProjectsPageProps {
  onSelectProject: (projectId: string) => void
}

const SAMPLE_PROJECTS: CatalogProjectSummary[] = [
  {
    id: 'sample-todo-app',
    title: 'Todo App Foundations',
    description: 'Build a CRUD todo list with local state and filtered views.',
    shortDescription: 'CRUD todo list with filters',
    difficulty: 'beginner',
    estimatedTime: '2–3 hrs',
    stepCount: 6,
  },
  {
    id: 'sample-weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Fetch API data and render cards for current conditions and forecasts.',
    shortDescription: 'API-driven weather cards',
    difficulty: 'beginner',
    estimatedTime: '3–4 hrs',
    stepCount: 8,
  },
  {
    id: 'sample-sql-report',
    title: 'SQL Sales Report',
    description: 'Write joins and aggregations to answer business questions.',
    shortDescription: 'Joins and aggregations',
    difficulty: 'beginner',
    estimatedTime: '2 hrs',
    stepCount: 5,
  },
]

export function ProjectsPage({ onSelectProject }: ProjectsPageProps) {
  const [projects, setProjects] = useState<CatalogProjectSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [usingSamples, setUsingSamples] = useState(false)
  const demoMode = isDemoUser()

  const loadProjects = useCallback(() => {
    setLoading(true)
    setLoadError(false)
    fetchCatalogProjects()
      .then((data) => {
        if (data.length === 0) {
          setProjects(SAMPLE_PROJECTS)
          setUsingSamples(true)
        } else {
          setProjects(data)
          setUsingSamples(false)
        }
      })
      .catch(() => {
        setProjects(SAMPLE_PROJECTS)
        setUsingSamples(true)
        setLoadError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <header>
          <h1 className={CQ_PAGE_TITLE}>Projects</h1>
          <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
            Hands-on builds that teach concepts step by step.
          </p>
        </header>

        {(loadError || usingSamples) && (
          <p className={cn(CQ_META, 'rounded-lg border border-[#E5E7EB] bg-white px-3 py-2')}>
            {loadError
              ? 'Catalog offline — showing sample projects for layout preview.'
              : 'Sample projects shown while the catalog is empty.'}
          </p>
        )}

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg border border-[#E5E7EB] bg-white" />
            ))}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const unlocked = usingSamples || !demoMode || canStartDemoProject(project.id)
              return (
                <li key={project.id} className="min-w-0">
                  <CQCard className="flex h-full min-h-[11rem] flex-col">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h2 className="text-[15px] font-semibold text-[#111827] line-clamp-2">
                        {project.title}
                      </h2>
                      {!unlocked && <Lock className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />}
                    </div>
                    <p className={cn(CQ_META, 'line-clamp-2')}>
                      {project.description || project.shortDescription}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={cn(CQ_CHIP, 'bg-zinc-100 text-zinc-700')}>
                        <BarChart2 className="mr-1 inline h-3 w-3" aria-hidden />
                        {project.difficulty}
                      </span>
                      <span className={cn(CQ_CHIP, 'bg-zinc-100 text-zinc-700')}>
                        <Clock className="mr-1 inline h-3 w-3" aria-hidden />
                        {project.estimatedTime}
                      </span>
                      <span className={cn(CQ_CHIP, 'bg-sky-50 text-sky-800')}>
                        {project.stepCount} steps
                      </span>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        'mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold',
                        unlocked
                          ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                          : 'cursor-not-allowed bg-zinc-100 text-zinc-500',
                      )}
                      onClick={() => {
                        if (!unlocked) {
                          triggerProjectLockedError()
                          return
                        }
                        if (demoMode && !usingSamples) recordDemoProjectStart(project.id)
                        onSelectProject(project.id)
                      }}
                    >
                      {unlocked ? (
                        <>
                          Start
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" aria-hidden />
                          Locked
                        </>
                      )}
                    </button>
                  </CQCard>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
