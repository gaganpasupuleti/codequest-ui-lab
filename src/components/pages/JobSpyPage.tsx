import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobSpyOverviewPanel } from '@/components/jobspy/JobSpyOverviewPanel'
import { JobSpyApiStatusBadge } from '@/components/jobspy/JobSpyApiStatus'
import { JobSpyFilters } from '@/components/jobspy/JobSpyFilters'
import { JobSpyJobCard } from '@/components/jobspy/JobSpyJobCard'
import { JobSpyJobDetail } from '@/components/jobspy/JobSpyJobDetail'
import { SAMPLE_JOBSPY_JOBS } from '@/components/jobspy/sampleJobSpyJobs'
import { useJobSpyJobs, type JobSpyTab } from '@/components/jobspy/useJobSpyJobs'
import {
  CQ_BODY,
  CQ_META,
  CQ_PAGE_BG,
  CQ_PAGE_CONTAINER,
  CQ_PAGE_PAD,
  CQ_PAGE_TITLE,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'
import { jobSpySiteLabel, type JobSpyJobId } from '@/lib/jobspy-api'

const TABS: { id: JobSpyTab; label: string }[] = [
  { id: 'browse', label: 'Browse' },
  { id: 'others', label: 'Others' },
  { id: 'saved', label: 'Saved' },
]

export function JobSpyPage() {
  const {
    apiStatus,
    filters,
    tab,
    setTab,
    savedIds,
    displayJobs,
    total,
    overview,
    overviewLoading,
    loading,
    applying,
    applyNotice,
    setApplyNotice,
    error,
    setError,
    selectedJob,
    setSelectedJob,
    handleFilterChange,
    handleSourceSelect,
    handleSearch,
    openJob,
    handleSave,
    handleUnsave,
    handleApply,
    fetchJobs,
    totalPages,
    setFilters,
  } = useJobSpyJobs()

  const showFilters = tab === 'browse'
  const showSampleBrowse = apiStatus === 'error' && tab === 'browse'
  const listJobs = showSampleBrowse ? SAMPLE_JOBSPY_JOBS : displayJobs

  const handleSelectJob = (id: JobSpyJobId) => {
    if (showSampleBrowse) {
      const sample = SAMPLE_JOBSPY_JOBS.find((job) => job.id === id)
      if (sample) setSelectedJob(sample)
      return
    }
    void openJob(id)
  }

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD)}>
      <div className={cn(CQ_PAGE_CONTAINER, 'flex flex-col', CQ_STACK_GAP)}>
        <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className={CQ_PAGE_TITLE}>Job Alerts</h1>
            <p className={cn(CQ_BODY, 'mt-1 max-w-2xl')}>
              Browse India-based jobs loaded for Code Quest students — internships, fresher, and
              entry-level roles.
            </p>
          </div>
          <JobSpyApiStatusBadge status={apiStatus} />
        </header>

        {apiStatus === 'error' && (
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3.5 py-2.5 text-[13px] text-amber-950">
            <p className="font-semibold">Job service is currently offline.</p>
            <p className={cn(CQ_META, 'mt-0.5 text-amber-900/80')}>
              Showing sample listings so you can preview the board layout. Live jobs will appear when
              the service is back.
            </p>
          </div>
        )}

        {error && (
          <div className="flex justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-800">
            <span>{error}</span>
            <button
              type="button"
              className="shrink-0 text-red-600 hover:underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {applyNotice && (
          <div className="flex justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-[13px] text-blue-900">
            <span>{applyNotice}</span>
            <button
              type="button"
              className="shrink-0 text-blue-700 hover:underline"
              onClick={() => setApplyNotice(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex gap-1 border-b border-[#E5E7EB]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'px-3 py-2 text-[13px] font-semibold border-b-2 -mb-px transition-colors',
                tab === id
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]',
              )}
            >
              {label}
              {id === 'saved' && savedIds.length > 0 && (
                <span className="ml-1.5 text-[12px] text-[#6B7280]">({savedIds.length})</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'others' && (
          <div className="rounded-lg border border-dashed border-[#E5E7EB] bg-[#FFFFFF] px-6 py-10 text-center">
            <p className={CQ_SECTION_TITLE}>Coming soon</p>
            <p className={cn(CQ_META, 'mt-1.5 mx-auto max-w-md')}>
              Curated and specialty job lists will appear here. All current India jobs are available
              under <span className="font-semibold text-[#111827]">Browse</span>.
            </p>
          </div>
        )}

        {tab === 'saved' && (
          <p className="rounded-xl bg-[#0A1020]/5 px-3.5 py-2.5 text-[13px] text-[#4B5563]">
            {apiStatus === 'error'
              ? 'Saved job IDs are stored on this device, but details cannot load while the job service is offline.'
              : `Jobs you bookmarked on this device (${savedIds.length}).`}
          </p>
        )}

        {showFilters && apiStatus === 'ok' && (
          <>
            <JobSpyOverviewPanel
              overview={overview}
              loading={overviewLoading}
              selectedSource={filters.site ?? ''}
              onSelectSource={handleSourceSelect}
            />

            <JobSpyFilters
              filters={filters}
              loading={loading}
              onChange={handleFilterChange}
              onSearch={handleSearch}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#4B5563]">
                {loading ? (
                  'Loading…'
                ) : (
                  <>
                    <span>
                      <span className="font-semibold text-[#111827]">
                        {total.toLocaleString('en-IN')}
                      </span>{' '}
                      jobs
                      {filters.site ? ` from ${jobSpySiteLabel(filters.site)}` : ' matching filters'}
                    </span>
                    {filters.site && (
                      <button
                        type="button"
                        className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[12px] font-medium text-blue-800 hover:bg-blue-100"
                        onClick={() => handleSourceSelect('')}
                      >
                        {jobSpySiteLabel(filters.site)} ×
                      </button>
                    )}
                  </>
                )}
              </div>
              <span className={CQ_META}>India only</span>
            </div>
          </>
        )}

        {showSampleBrowse && (
          <p className={cn(CQ_META, 'rounded-lg bg-[#FFFFFF] px-3 py-2 ring-1 ring-[#708090]/15')}>
            Sample preview · {SAMPLE_JOBSPY_JOBS.length} example roles
          </p>
        )}

        {tab === 'others' ? null : loading && listJobs.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-12 text-[#6B7280]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading jobs…
          </div>
        ) : listJobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#E5E7EB] bg-[#FFFFFF] px-6 py-10 text-center">
            <p className={CQ_SECTION_TITLE}>
              {tab === 'saved'
                ? 'No saved jobs yet'
                : 'No jobs found'}
            </p>
            <p className={cn(CQ_META, 'mt-1.5')}>
              {tab === 'saved'
                ? 'Tap the star on any job card to bookmark it here.'
                : 'No jobs match these filters. Try clearing filters or a different keyword.'}
            </p>
          </div>
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listJobs.map((job) => (
              <JobSpyJobCard
                key={job.id}
                job={job}
                saved={savedIds.includes(job.id)}
                onSelect={handleSelectJob}
                onSave={showSampleBrowse ? undefined : handleSave}
                onUnsave={showSampleBrowse ? undefined : handleUnsave}
              />
            ))}
          </div>
        )}

        {showFilters && totalPages > 1 && apiStatus === 'ok' && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={filters.page === 1 || loading}
              onClick={() => {
                const next = { ...filters, page: (filters.page ?? 1) - 1 }
                setFilters(next)
                void fetchJobs(next)
              }}
            >
              Previous
            </Button>
            <span className="text-[13px] text-[#4B5563]">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={(filters.page ?? 1) >= totalPages || loading}
              onClick={() => {
                const next = { ...filters, page: (filters.page ?? 1) + 1 }
                setFilters(next)
                void fetchJobs(next)
              }}
            >
              Next
            </Button>
          </div>
        )}

        {selectedJob && (
          <JobSpyJobDetail
            job={selectedJob}
            saved={savedIds.includes(selectedJob.id)}
            applying={applying}
            onClose={() => setSelectedJob(null)}
            onApply={() => void handleApply(selectedJob)}
            onSave={showSampleBrowse ? undefined : handleSave}
            onUnsave={showSampleBrowse ? undefined : handleUnsave}
          />
        )}

        <p className={cn(CQ_META, 'pt-1 text-center')}>
          CodeQuest Job Board · Jobs updated daily · Apply via original posting
        </p>
      </div>
    </div>
  )
}
