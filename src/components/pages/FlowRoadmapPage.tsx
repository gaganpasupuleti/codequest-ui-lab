import { memo, useCallback, useState } from 'react'
import { RoadmapFlow } from '@/components/roadmap/RoadmapFlow'
import { ROADMAP_OPTIONS } from '@/lib/roadmap-options'
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

const MemoRoadmapFlow = memo(RoadmapFlow)

const FEATURED = ['frontend', 'backend', 'devops', 'python', 'ai-engineer']

export function FlowRoadmapPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(
    ROADMAP_OPTIONS.find((r) => r.id === 'frontend') || ROADMAP_OPTIONS[0],
  )

  const handleSelectRoadmap = useCallback((id: string) => {
    const found = ROADMAP_OPTIONS.find((opt) => opt.id === id)
    if (found) setSelectedRoadmap(found)
  }, [])

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <header>
          <h1 className={CQ_PAGE_TITLE}>Flow Path</h1>
          <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
            Topic graphs for browsing skills. For role timelines and syllabus, use Career Map.
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {ROADMAP_OPTIONS.filter((opt) => FEATURED.includes(opt.id)).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectRoadmap(opt.id)}
                className={cn(
                  'min-h-9 rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors',
                  selectedRoadmap.id === opt.id
                    ? 'border-[#2563EB] bg-[#2563EB] text-white'
                    : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-zinc-300',
                )}
              >
                {opt.title}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 items-center gap-2 text-[12px] font-semibold text-[#6B7280] sm:max-w-xs sm:flex-1">
            <span className="shrink-0">All</span>
            <select
              value={selectedRoadmap.id}
              onChange={(e) => handleSelectRoadmap(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-2 text-[13px] font-medium text-[#111827]"
            >
              {ROADMAP_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className={cn(CQ_META, 'rounded-lg border border-[#E5E7EB] bg-white px-3 py-2')}>
          Pan the canvas · zoom with +/− · use the minimap on desktop
        </p>

        <div className="min-h-[min(70dvh,560px)] overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
          <MemoRoadmapFlow key={selectedRoadmap.id} roadmapPath={selectedRoadmap.path} />
        </div>
      </div>
    </div>
  )
}
