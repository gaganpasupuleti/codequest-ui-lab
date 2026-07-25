import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Brain,
  Briefcase,
  ChartLine,
  CurrencyDollar,
  Lightning,
  MagnifyingGlass,
  Sparkle,
  Timer,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { fetchCareerRoles } from '@/lib/api'
import { careerSeedData } from '@/lib/career-seed-data'
import { useCareerProgress } from '@/hooks/use-career-progress'
import { useSkillAssessments } from '@/hooks/use-skill-assessments'
import { useMLRecommendations } from '@/hooks/use-ml-recommendations'
import type { CareerRole } from '@/types/career'

import { LearningRoadmap } from './LearningRoadmap'
import { SkillGapAnalyzer } from './SkillGapAnalyzer'
import { MLCareerRecommendationCard } from './MLRecommendationCard'
import { RoleCardSelector } from './RoleCardSelector'
import { QuizPage } from '@/components/pages/QuizPage'
import { ProjectLearningPage } from '@/components/pages/ProjectLearningPage'
import {
  CQ_BODY,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

const SELECTED_ROLE_KEY = 'career-mapper-selected-role'

const DOMAIN_ICON: Record<string, React.ReactNode> = {
  Data:   <ChartLine size={16} />,
  AI:     <Brain size={16} />,
  Web:    <Lightning size={16} />,
  DevOps: <Sparkle size={16} />,
}

const DIFF_BADGE_CLASS: Record<string, string> = {
  Beginner:     'text-emerald-800 border-emerald-300 bg-emerald-50',
  Intermediate: 'text-amber-900 border-amber-300 bg-amber-50',
  Advanced:     'text-red-800 border-red-300 bg-red-50',
}

export function CareerMapperPage() {
  const [roles, setRoles]               = useState<CareerRole[]>([])
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(() => {
    try {
      const s = localStorage.getItem(SELECTED_ROLE_KEY)
      return s ? (JSON.parse(s) as CareerRole) : null
    } catch { return null }
  })

  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false)
  const [analyzerOpen, setAnalyzerOpen]           = useState(false)
  const [isLoading, setIsLoading]                 = useState(true)

  // Sub-view routing (quiz / project) inside the mapper frame
  type MapperSubView = 'roadmap' | 'quiz' | 'project'
  const [subView, setSubView]                         = useState<MapperSubView>('roadmap')
  const [activeQuizId, setActiveQuizId]               = useState<string | null>(null)
  const [activeProjectId, setActiveProjectId]         = useState<string | null>(null)
  const [pendingCompleteItemId, setPendingCompleteItemId] = useState<string | null>(null)

  const { progress, toggleItem, markComplete } = useCareerProgress(selectedRole?.id ?? 'none')
  const { skillReports, getReport } = useSkillAssessments()
  const { generateAllCareerRecommendations, getTopCareerRecommendations } = useMLRecommendations()

  const completedSet = useMemo(
    () => new Set<string>(Object.entries(progress.completedItems).filter(([,v]) => v).map(([k]) => k)),
    [progress]
  )

  const currentReport = selectedRole ? getReport(selectedRole.id) : undefined
  const topRecos      = getTopCareerRecommendations(3)

  // Derived counts from assessments
  const profCount  = currentReport?.assessments.filter(a => a.level === 'proficient').length ?? 0
  const partCount  = currentReport?.assessments.filter(a => a.level === 'partial').length ?? 0
  const noneCount  = currentReport?.assessments.filter(a => a.level === 'none').length ?? 0

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const loaded = await fetchCareerRoles()
        setRoles(loaded)
        if (selectedRole) {
          const fresh = loaded.find(r => r.id === selectedRole.id)
          if (fresh) setSelectedRole(fresh)
        }
      } catch {
        toast.error('Failed to load career roles. Using local data.')
        setRoles(careerSeedData.filter((r) => r.isActive).slice(0, 8))
      } finally {
        setIsLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chooseRole = (role: CareerRole) => {
    setSelectedRole(role)
    localStorage.setItem(SELECTED_ROLE_KEY, JSON.stringify(role))
    setInsightsPanelOpen(false)
    setSubView('roadmap')
    setActiveQuizId(null)
    setActiveProjectId(null)
  }

  const clearRole = () => {
    setSelectedRole(null)
    localStorage.removeItem(SELECTED_ROLE_KEY)
    setSubView('roadmap')
  }

  const handleAnalyzerClose = (open: boolean) => {
    setAnalyzerOpen(open)
    if (!open && selectedRole) {
      const report = getReport(selectedRole.id)
      if (report) generateAllCareerRecommendations(roles, Object.values(skillReports))
    }
  }

  const openQuiz = (quizId: string, itemId?: string) => {
    setActiveQuizId(quizId)
    setPendingCompleteItemId(itemId ?? null)
    setSubView('quiz')
  }

  const openProject = (projectId: string, itemId?: string) => {
    setActiveProjectId(projectId)
    setPendingCompleteItemId(itemId ?? null)
    setSubView('project')
  }

  const handleSubViewBack = () => {
    setSubView('roadmap')
    setActiveQuizId(null)
    setActiveProjectId(null)
    setPendingCompleteItemId(null)
  }

  const handleSubViewComplete = (passed?: boolean) => {
    if (pendingCompleteItemId) markComplete(pendingCompleteItemId)
    if (passed !== undefined) {
      toast.success(passed ? 'Quiz passed! Item marked complete.' : 'Quiz finished. Keep practising!')
    } else {
      toast.success('Project complete! Item marked complete.')
    }
    handleSubViewBack()
  }

  // ── Role grid ──────────────────────────────────────────────────────────────
  if (!selectedRole) {
    return (
      <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
        <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
          <div>
            <h1 className={CQ_PAGE_TITLE}>Career Map</h1>
            <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
              Choose a career path, explore your 4-month syllabus, and track your progress with AI insights.
            </p>
            <p className={cn(CQ_META, 'mt-2 max-w-3xl')}>
              <strong className="text-[#111827]">Career Map</strong> (here) is role-centric with syllabus and progress.{' '}
              <strong className="text-[#111827]">Flow Path</strong> in the top nav is topic graphs for browsing skills—use both as needed.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse space-y-3 rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] p-4"
                >
                  <div className="h-4 w-3/5 rounded bg-[#0A1020]/8" />
                  <div className="h-3 w-2/5 rounded bg-[#0A1020]/8" />
                  <div className="h-8 rounded-md bg-[#0A1020]/8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => chooseRole(role)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      chooseRole(role)
                    }
                  }}
                  className="group flex h-full cursor-pointer flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] p-4
                    shadow-[0_8px_22px_-18px_rgba(10,16,32,0.5)] transition-all duration-150
                    hover:border-[#2563EB]/35 hover:shadow-[0_14px_30px_-18px_rgba(10,16,32,0.55)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-indigo-500 shrink-0">
                        {DOMAIN_ICON[role.domain] ?? <Briefcase size={16} />}
                      </span>
                      <span className="text-sm font-bold tracking-tight text-slate-900 leading-snug">
                        {role.title}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 text-[11px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 border ${DIFF_BADGE_CLASS[role.difficulty] ?? 'text-slate-600 border-slate-200 bg-slate-50'}`}
                    >
                      {role.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CurrencyDollar size={14} className="shrink-0" />
                      ${Math.round(role.salaryRangeMin / 1000)}k–${Math.round(role.salaryRangeMax / 1000)}k
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Timer size={14} className="shrink-0" />
                      4 months
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-slate-600 border border-slate-200 rounded px-2 py-0.5 bg-slate-50"
                      >
                        {skill}
                      </span>
                    ))}
                    {role.skills.length > 5 && (
                      <span className="text-xs text-slate-600 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">
                        +{role.skills.length - 5}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      chooseRole(role)
                    }}
                    className="mt-auto w-full rounded-lg border-2 border-[#2563EB]/50 bg-white py-2 text-xs font-bold tracking-wide text-[#2563EB]
                      transition-colors hover:bg-[#2563EB]/5"
                  >
                    Explore Path →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Sub-view full-screen overrides (quiz / project) ──────────────────────
  if (subView === 'quiz' && activeQuizId) {
    return (
      <QuizPage
        initialQuizId={activeQuizId}
        onBack={handleSubViewBack}
        onComplete={(passed) => handleSubViewComplete(passed)}
      />
    )
  }

  if (subView === 'project' && activeProjectId) {
    return (
      <ProjectLearningPage
        projectId={activeProjectId}
        onBack={handleSubViewBack}
        onComplete={() => handleSubViewComplete()}
      />
    )
  }

  // ── Role detail view ───────────────────────────────────────────────────────
  const completionPct = selectedRole.syllabus.length > 0
    ? Math.round((completedSet.size / selectedRole.syllabus.length) * 100)
    : 0

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <button
          type="button"
          onClick={clearRole}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-1"
        >
          <ArrowLeft size={14} weight="bold" /> All Roles
        </button>

        <RoleCardSelector
          roles={roles}
          selectedRoleId={selectedRole.id}
          onSelectRole={chooseRole}
          completedItems={completedSet}
        />

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
              {selectedRole.title}
            </h1>
            <span
              className={`text-[11px] font-bold uppercase tracking-wide rounded px-2 py-0.5 border ${DIFF_BADGE_CLASS[selectedRole.difficulty] ?? 'text-slate-600 border-slate-200 bg-slate-50'}`}
            >
              {selectedRole.difficulty}
            </span>
            <span className="text-xs text-slate-600 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">
              {selectedRole.domain}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{selectedRole.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CurrencyDollar size={14} />
              ${Math.round(selectedRole.salaryRangeMin / 1000)}k–${Math.round(selectedRole.salaryRangeMax / 1000)}k
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer size={14} />
              4-month curriculum
            </span>
            <span className="font-bold text-indigo-600">{completionPct}% complete</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-[width] duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setInsightsPanelOpen((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold border transition-all
              ${insightsPanelOpen
                ? 'border-indigo-400 text-indigo-600 bg-indigo-50'
                : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}`}
          >
            <Brain size={14} /> AI Insights
          </button>
        </div>

        {insightsPanelOpen && (
          <div className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 md:p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MagnifyingGlass size={18} className="text-indigo-500" />
                Skill gap analysis
              </h2>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  {currentReport
                    ? 'Your personalised skill report is ready. Re-run to refresh.'
                    : 'Answer a few questions to get a personalised skill gap report and AI recommendations.'}
                </p>
                <button
                  type="button"
                  onClick={() => setAnalyzerOpen(true)}
                  className="inline-flex items-center gap-2 shrink-0 rounded-lg border-2 border-indigo-400 px-3.5 py-2 text-xs font-bold text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  <Sparkle size={14} />
                  {currentReport ? 'Re-run Assessment' : 'Start Assessment'}
                </button>
              </div>
              {currentReport && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-medium text-emerald-800 border border-emerald-700/30 rounded-md px-2 py-0.5 bg-emerald-50">
                    {profCount} Proficient
                  </span>
                  <span className="text-xs font-medium text-amber-900 border border-amber-700/30 rounded-md px-2 py-0.5 bg-amber-50">
                    {partCount} Partial
                  </span>
                  <span className="text-xs font-medium text-red-800 border border-red-700/30 rounded-md px-2 py-0.5 bg-red-50">
                    {noneCount} To learn
                  </span>
                  {currentReport.canSkipMonths.length > 0 && (
                    <span className="text-xs font-medium text-indigo-800 border border-indigo-300 rounded-md px-2 py-0.5 bg-indigo-50">
                      Skip month {currentReport.canSkipMonths.join(', ')}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 ml-auto font-medium">
                    {currentReport.overallReadiness}% ready
                  </span>
                </div>
              )}
            </section>

            {topRecos.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 px-1">
                  <Brain size={18} className="text-indigo-500" />
                  Top career matches
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3">
                  {topRecos.map((reco, idx) => {
                    const matched = roles.find((r) => r.id === reco.roleId)
                    if (!matched) return null
                    return (
                      <MLCareerRecommendationCard
                        key={reco.roleId}
                        recommendation={reco}
                        role={matched}
                        rank={idx + 1}
                        onView={() => chooseRole(matched)}
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {topRecos.length === 0 && !currentReport && (
              <section className="rounded-lg border border-dashed border-[#E5E7EB] bg-[#FFFFFF] px-4 py-6 text-center">
                <Brain size={32} className="mx-auto mb-2 text-[#6B7280]/50" />
                <p className={cn(CQ_META, 'mx-auto max-w-md')}>
                  Run the skill assessment above to generate personalised career recommendations.
                </p>
              </section>
            )}
          </div>
        )}

        {subView === 'roadmap' && (
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3 md:px-6 md:py-4 bg-slate-50/90">
              <h2 className="text-sm font-bold text-slate-900">Learning roadmap</h2>
              <p className="text-xs text-slate-500 mt-0.5">Syllabus, quizzes, and projects for this role.</p>
            </div>
            <div className="p-4 md:p-6">
              <LearningRoadmap
                role={selectedRole}
                completedItems={completedSet}
                isAuthenticated={true}
                canSkipMonths={currentReport?.canSkipMonths}
                focusMonths={currentReport?.focusMonths}
                onToggleItem={toggleItem}
                onOpenQuiz={openQuiz}
                onOpenProject={openProject}
              />
            </div>
          </section>
        )}

        <SkillGapAnalyzer role={selectedRole} open={analyzerOpen} onOpenChange={handleAnalyzerClose} />
      </div>
    </div>
  )
}
