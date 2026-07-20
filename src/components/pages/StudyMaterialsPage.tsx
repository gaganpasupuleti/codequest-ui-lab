import { BookOpen, ChevronLeft, ChevronRight, List } from 'lucide-react'
import { marked } from 'marked'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  CQActionButton,
  CQCard,
  CQProgressBar,
} from '@/components/student-dashboard/cq/CQKit'
import {
  CQ_BODY,
  CQ_CHIP,
  CQ_LABEL,
  CQ_META,
  CQ_METRIC,
  CQ_PAGE_BG,
  CQ_PAGE_PAD,
  CQ_SECTION_TITLE,
  CQ_STACK_GAP,
} from '@/components/student-dashboard/cq/cqTheme'
import { useStudentNavCollapsed } from '@/hooks/useStudentNavCollapsed'
import { NavToggleButton } from '@/components/shells/StudentShell'
import { JOB_ROLE_CATALOG, roleName } from '@/data/jobRoleCatalog'
import {
  BOOK_REPORTS_CATALOG,
  countReportsForRole,
  getCatalogReports,
  getCoverUrl,
  getFamilyName,
  getReportRoleIds,
  loadStudyReportById,
  totalChapterCount,
} from '@/lib/bookReports'
import { cn } from '@/lib/utils'
import type { BookReportChapter, CatalogReport, ReportType, StudyReport } from '@/types/bookReports'
import { REPORT_TYPE_LABELS } from '@/types/bookReports'

const PROGRESS_KEY = 'cq-study-report-progress'

function loadProgress(reportId: string): number {
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY}:${reportId}`)
    return raw ? Math.min(100, Math.max(0, Number(raw))) : 0
  } catch {
    return 0
  }
}

function saveProgress(reportId: string, percent: number) {
  try {
    localStorage.setItem(`${PROGRESS_KEY}:${reportId}`, String(Math.round(percent)))
  } catch {
    /* ponytail: localStorage optional */
  }
}

function renderMarkdown(body: string): string {
  return marked.parse(prepareReadingMarkdown(body), { async: false }) as string
}

function prepareReadingMarkdown(body: string): string {
  return body
    .replace(/^\*\*Chapter focus:.*?\*\*[^\n]*\n\n?/i, '')
    .replace(/^Code Reference:\n/m, '### Code reference\n\n')
    .replace(/^What it shows: /m, '> **What it shows:** ')
}

function splitChapterIntoPages(body: string): string[] {
  const prepared = prepareReadingMarkdown(body)
  const parts = prepared
    .split(/\n(?=### )/)
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : [prepared || '']
}

function displayTitle(title: string): string {
  return title.replace(/^(Study|Project) Report:\s*/i, '').trim()
}

function setUrlParams(reportId: string | null, chapter: number | null) {
  const url = new URL(window.location.href)
  if (reportId) url.searchParams.set('report', reportId)
  else url.searchParams.delete('report')
  if (chapter != null && reportId) url.searchParams.set('chapter', String(chapter))
  else url.searchParams.delete('chapter')
  url.searchParams.delete('item')
  window.history.replaceState({}, '', url.toString())
}

export function StudyMaterialsPage() {
  const allReports = useMemo(() => getCatalogReports(), [])
  const [search, setSearch] = useState('')
  const [familyFilter, setFamilyFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [progress, setProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reportParam = params.get('report') ?? params.get('item')
    if (reportParam) {
      setSelectedReportId(reportParam)
      const ch = Number(params.get('chapter'))
      if (ch > 0) setSelectedChapter(ch)
    }
    const next: Record<string, number> = {}
    for (const r of allReports) next[r.id] = loadProgress(r.id)
    setProgress(next)
  }, [allReports])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allReports.filter((report) => {
      if (familyFilter && report.family_id !== familyFilter) return false
      if (roleFilter && !getReportRoleIds(report).includes(roleFilter)) return false
      if (typeFilter && report.report_type !== typeFilter) return false
      if (levelFilter && report.level !== levelFilter) return false
      if (!q) return true
      const haystack = [
        report.title,
        report.author ?? '',
        getFamilyName(report.family_id),
        report.level,
        ...getReportRoleIds(report).map(roleName),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [allReports, search, familyFilter, roleFilter, typeFilter, levelFilter])

  const levels = useMemo(
    () => [...new Set(allReports.map((r) => r.level))].sort(),
    [allReports],
  )

  const selectedReport = useMemo(
    () => (selectedReportId ? loadStudyReportById(selectedReportId) : null),
    [selectedReportId],
  )

  const openReport = useCallback((reportId: string) => {
    setSelectedReportId(reportId)
    setSelectedChapter(1)
    setUrlParams(reportId, 1)
  }, [])

  const closeReport = useCallback(() => {
    setSelectedReportId(null)
    setUrlParams(null, null)
  }, [])

  const markProgress = useCallback((reportId: string, percent: number) => {
    saveProgress(reportId, percent)
    setProgress((prev) => ({ ...prev, [reportId]: percent }))
  }, [])

  if (selectedReport) {
    return (
      <StudyReportReader
        report={selectedReport}
        chapterNumber={selectedChapter}
        progressPercent={progress[selectedReport.id] ?? 0}
        onBack={closeReport}
        onChapterChange={(n) => {
          setSelectedChapter(n)
          setUrlParams(selectedReport.id, n)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onProgress={markProgress}
      />
    )
  }

  const stats = [
    { label: 'Reports', value: allReports.length, tone: 'bg-[#B8C9E8]' },
    { label: 'Chapters', value: totalChapterCount(), tone: 'bg-[#C2CDB0]' },
    { label: 'Families', value: BOOK_REPORTS_CATALOG.families.length, tone: 'bg-[#F3DFA0]' },
    { label: 'Roles', value: JOB_ROLE_CATALOG.length, tone: 'bg-[#DDD0F5]' },
  ] as const

  return (
    <div className={cn(CQ_PAGE_BG, CQ_PAGE_PAD, 'w-full')}>
      <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2 text-[18px] sm:text-[20px]')}>
            <BookOpen className="h-5 w-5 shrink-0 text-[#0A1020]/70" aria-hidden />
            Study Materials
          </h1>
          <p className={cn(CQ_META, 'mt-0.5')}>
            Career paths, book studies, and project guides mapped to your target job.
          </p>
        </div>
        <p className={CQ_BODY}>
          Showing <strong className="text-[#111827]">{filtered.length}</strong> of {allReports.length}
          {roleFilter ? (
            <>
              {' '}
              for <strong className="text-[#111827]">{roleName(roleFilter)}</strong>
            </>
          ) : null}
        </p>
      </header>

      <div className={cn('mb-3 grid grid-cols-2 md:grid-cols-4', CQ_STACK_GAP)}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'flex items-center justify-between rounded-xl border border-[#708090]/18 px-3.5 py-2.5',
              stat.tone,
            )}
          >
            <span className={CQ_LABEL}>{stat.label}</span>
            <span className={cn(CQ_METRIC, 'text-[22px]')}>{stat.value}</span>
          </div>
        ))}
      </div>

      <CQCard tone="cream" className="mb-3 !p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <label className="block space-y-1 sm:col-span-2 lg:col-span-2">
            <span className={CQ_LABEL}>Search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, family, level, or role…"
              className="w-full rounded-lg border border-[#0A1020]/15 bg-white px-3 py-2 text-[13px] text-[#111827] placeholder:text-[#708090] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </label>
          <FilterSelect
            label="Target role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: '', label: 'All roles' },
              ...JOB_ROLE_CATALOG.map((role) => ({
                value: role.role_id,
                label: `${role.role_name} (${countReportsForRole(role.role_id)})`,
              })),
            ]}
          />
          <FilterSelect
            label="Report type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: '', label: 'All types' },
              ...(Object.entries(REPORT_TYPE_LABELS) as [ReportType, string][]).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <FilterSelect
            label="Role family"
            value={familyFilter}
            onChange={setFamilyFilter}
            options={[
              { value: '', label: 'All families' },
              ...BOOK_REPORTS_CATALOG.families.map((f) => ({
                value: f.id,
                label: `${f.name} (${f.report_count})`,
              })),
            ]}
          />
          <FilterSelect
            label="Level"
            value={levelFilter}
            onChange={setLevelFilter}
            options={[
              { value: '', label: 'All levels' },
              ...levels.map((level) => ({ value: level, label: level })),
            ]}
          />
        </div>
      </CQCard>

      {filtered.length === 0 ? (
        <CQCard tone="cream" className="py-10 text-center">
          <p className="font-semibold text-[#111827]">No reports match</p>
          <p className={cn('mt-1', CQ_META)}>Try clearing a filter or changing your search.</p>
        </CQCard>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              progressPercent={progress[report.id] ?? 0}
              onOpen={() => openReport(report.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block min-w-0 space-y-1">
      <span className={CQ_LABEL}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full truncate rounded-lg border border-[#0A1020]/15 bg-white px-2.5 py-2 text-[13px] text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
      >
        {options.map((opt) => (
          <option key={opt.value || '__all'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ReportCard({
  report,
  progressPercent,
  onOpen,
}: {
  report: CatalogReport
  progressPercent: number
  onOpen: () => void
}) {
  const roleIds = getReportRoleIds(report)
  const coverUrl = getCoverUrl(report.path)
  const primaryRole = roleIds[0] ? roleName(roleIds[0]) : getFamilyName(report.family_id)

  return (
    <li className="min-w-0">
      <CQCard interactive tone="cream" className="h-full overflow-hidden !p-0">
        <button
          type="button"
          onClick={onOpen}
          className="flex h-full w-full gap-3 p-3 text-left transition-colors hover:bg-[#FAF3E0]/50"
        >
          <div className="relative h-[7.5rem] w-[5.25rem] shrink-0 overflow-hidden rounded-lg bg-[#0A1020]">
            {coverUrl ? (
              <img src={coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full items-center justify-center text-[#FAF3E0]/40">
                <BookOpen className="h-7 w-7" aria-hidden />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1">
              {report.report_type ? (
                <Badge type={report.report_type}>{REPORT_TYPE_LABELS[report.report_type]}</Badge>
              ) : null}
              <span className={cn(CQ_CHIP, 'bg-[#0A1020]/6 text-[#4B5563]')}>{report.level}</span>
            </div>
            <h2 className="font-serif text-[14px] font-semibold leading-snug tracking-tight text-[#0A1020] line-clamp-2">
              {displayTitle(report.title)}
            </h2>
            <p className={cn(CQ_META, 'truncate')}>
              {primaryRole}
              {roleIds.length > 1 ? ` +${roleIds.length - 1}` : ''} · {report.chapter_count} ch
            </p>
            {progressPercent > 0 ? <CQProgressBar value={progressPercent} className="mt-auto" /> : null}
            <span className="mt-auto pt-1 text-[13px] font-semibold text-[#2563EB]">Read →</span>
          </div>
        </button>
      </CQCard>
    </li>
  )
}

function Badge({
  children,
  type,
}: {
  children: React.ReactNode
  type?: ReportType
}) {
  return (
    <span
      className={cn(
        CQ_CHIP,
        'px-2 py-0.5 text-[10px] uppercase tracking-wide',
        type === 'role_career_path'
          ? 'bg-[#0A1020] text-[#FAF3E0]'
          : type === 'role_book_study'
            ? 'bg-[#2563EB]/12 text-[#1D4ED8]'
            : type === 'role_project'
              ? 'bg-[#0D9488]/12 text-[#0F766E]'
              : 'bg-[#0A1020] text-[#FAF3E0]',
      )}
    >
      {children}
    </span>
  )
}

const READER_PROSE =
  'prose prose-lg max-w-none text-[#2D3748] prose-p:my-3 prose-p:text-[17px] prose-p:leading-[1.8] prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#0A1020] prose-h3:mt-6 prose-h3:mb-2 prose-h3:border-b prose-h3:border-[#0A1020]/10 prose-h3:pb-2 prose-h3:text-lg prose-strong:font-semibold prose-strong:text-[#0A1020] prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:bg-[#0A1020]/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.88em] prose-code:text-[#0A1020] prose-code:before:content-none prose-code:after:content-none prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-[#0A1020]/15 prose-pre:bg-[#0A1020] prose-pre:px-4 prose-pre:py-3 prose-pre:font-mono prose-pre:text-[14px] prose-pre:leading-relaxed prose-pre:text-[#E8E0D4] prose-blockquote:my-4 prose-blockquote:border-l-4 prose-blockquote:border-[#2563EB]/70 prose-blockquote:bg-transparent prose-blockquote:py-0 prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:text-[#374151] prose-li:my-1 prose-li:marker:text-[#2563EB]'

function StudyReportReader({
  report,
  chapterNumber,
  progressPercent,
  onBack,
  onChapterChange,
  onProgress,
}: {
  report: StudyReport
  chapterNumber: number
  progressPercent: number
  onBack: () => void
  onChapterChange: (n: number) => void
  onProgress: (reportId: string, percent: number) => void
}) {
  const [tocOpen, setTocOpen] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const pendingPageRef = useRef<number | null>(null)
  const { hidden: navHidden, toggleHidden: toggleNav } = useStudentNavCollapsed()

  const chapter =
    report.chapters.find((c) => c.number === chapterNumber) ?? report.chapters[0] ?? null
  const contentPages = useMemo(
    () => (chapter ? splitChapterIntoPages(chapter.content) : []),
    [chapter],
  )
  const hasTakeaways = Boolean(chapter?.key_takeaways.length)
  const totalPages = contentPages.length + (hasTakeaways ? 1 : 0)
  const isTakeawaysPage = hasTakeaways && pageIndex === contentPages.length
  const pageHtml =
    !isTakeawaysPage && contentPages[pageIndex]
      ? renderMarkdown(contentPages[pageIndex])
      : ''

  const catalogEntry = getCatalogReports().find((r) => r.id === report.id)
  const coverUrl = catalogEntry ? getCoverUrl(catalogEntry.path) : undefined
  const total = report.chapters.length
  const title = displayTitle(report.title)

  useEffect(() => {
    setTocOpen(false)
    if (pendingPageRef.current != null) {
      setPageIndex(pendingPageRef.current)
      pendingPageRef.current = null
    } else {
      setPageIndex(0)
    }
  }, [chapterNumber])

  useEffect(() => {
    const chapterShare = total > 0 ? 100 / total : 100
    const pageShare = totalPages > 0 ? chapterShare / totalPages : chapterShare
    const base = ((chapterNumber - 1) / total) * 100
    onProgress(report.id, Math.min(100, base + (pageIndex + 1) * pageShare))
  }, [chapterNumber, onProgress, pageIndex, report.id, total, totalPages])

  const goNextPage = useCallback(() => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((p) => p + 1)
      return
    }
    if (chapterNumber < total) onChapterChange(chapterNumber + 1)
    else onProgress(report.id, 100)
  }, [chapterNumber, onChapterChange, onProgress, pageIndex, report.id, total, totalPages])

  const goPrevPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1)
      return
    }
    if (chapterNumber > 1) {
      const prevChapter = report.chapters.find((ch) => ch.number === chapterNumber - 1)
      if (prevChapter) {
        const prevContentPages = splitChapterIntoPages(prevChapter.content)
        const prevTotal = prevContentPages.length + (prevChapter.key_takeaways.length ? 1 : 0)
        pendingPageRef.current = Math.max(0, prevTotal - 1)
        onChapterChange(chapterNumber - 1)
      }
    }
  }, [chapterNumber, onChapterChange, pageIndex, report.chapters])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goNextPage()
      if (event.key === 'ArrowLeft') goPrevPage()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNextPage, goPrevPage])

  const showToc = !tocCollapsed || tocOpen

  return (
    <div className="flex h-[calc(100dvh-3rem)] flex-col overflow-hidden bg-[#FFFDF6] lg:h-[calc(100dvh-2.75rem)]">
      <header className="z-30 shrink-0 border-b border-[#0A1020]/10 bg-[#FFFDF6]">
        <div className="flex items-center gap-2 px-3 py-2 md:px-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-[#2563EB] hover:bg-[#0A1020]/5 hover:text-[#1D4ED8]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-serif text-sm font-semibold text-[#0A1020]">{title}</p>
            <p className="text-[11px] text-[#708090]">
              Ch. {chapterNumber}/{total} · Page {pageIndex + 1}/{totalPages || 1}
            </p>
          </div>

          <NavToggleButton hidden={navHidden} onToggle={toggleNav} className="hidden shrink-0 md:inline-flex" />

          <button
            type="button"
            onClick={() => (window.innerWidth >= 1024 ? setTocCollapsed((v) => !v) : setTocOpen((v) => !v))}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#0A1020]/12 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0A1020] hover:bg-[#FAF3E0]"
            aria-expanded={showToc}
            aria-controls="study-reader-toc"
          >
            <List className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden md:inline">Contents</span>
          </button>
        </div>
        <div className="h-0.5 bg-[#0A1020]/8">
          <div
            className="h-full bg-[#2563EB] transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {showToc ? (
          <aside
            id="study-reader-toc"
            className={cn(
              'shrink-0 overflow-y-auto border-[#0A1020]/10 bg-[#FAF3E0]/40 lg:static lg:max-h-none lg:w-56 lg:border-r lg:shadow-none xl:w-60',
              tocOpen
                ? 'absolute inset-x-0 top-12 z-20 max-h-80 border-b shadow-lg'
                : 'hidden lg:block',
            )}
          >
            <div className="p-3">
              <div className="mb-3 flex gap-2 border-b border-[#0A1020]/8 pb-3">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt=""
                    className="h-16 w-11 shrink-0 rounded object-cover ring-1 ring-[#0A1020]/10"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="font-serif text-xs font-semibold leading-snug text-[#0A1020] line-clamp-3">{title}</p>
                </div>
              </div>
              <nav className="space-y-0.5" aria-label="Chapters">
                {report.chapters.map((ch) => {
                  const active = ch.number === (chapter?.number ?? 0)
                  return (
                    <button
                      key={ch.number}
                      type="button"
                      onClick={() => onChapterChange(ch.number)}
                      className={cn(
                        'group flex w-full gap-2 rounded-lg px-2 py-2 text-left transition-colors',
                        active ? 'bg-[#0A1020]/6' : 'hover:bg-[#0A1020]/4',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1 w-1 shrink-0 rounded-full',
                          active ? 'bg-[#2563EB]' : 'bg-transparent group-hover:bg-[#0A1020]/15',
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span className={cn('block text-[10px] font-semibold uppercase tracking-wider', active ? 'text-[#2563EB]' : 'text-[#708090]')}>
                          Chapter {ch.number}
                        </span>
                        <span className={cn('block text-sm leading-snug', active ? 'font-semibold text-[#0A1020]' : 'text-[#374151]')}>
                          {ch.title}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-3 md:px-8 lg:px-10">
            <div className={cn('mx-auto w-full', showToc ? 'max-w-3xl' : 'max-w-4xl')}>
              {chapter ? (
                <ChapterPage
                  chapter={chapter}
                  html={pageHtml}
                  pageIndex={pageIndex}
                  totalPages={totalPages}
                  isTakeawaysPage={isTakeawaysPage}
                />
              ) : (
                <p className="text-sm text-[#4B5563]">No chapters in this report.</p>
              )}
            </div>
          </div>

          <nav
            className="flex shrink-0 items-center justify-between gap-3 border-t border-[#0A1020]/10 bg-[#FFFDF6] px-4 py-2 md:px-6"
            aria-label="Page navigation"
          >
            <CQActionButton
              variant="ghost"
              disabled={pageIndex <= 0 && chapterNumber <= 1}
              onClick={goPrevPage}
              className="gap-1 px-3 py-1.5 text-xs"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Previous
            </CQActionButton>

            <p className="text-center text-xs text-[#708090]">
              <span className="font-semibold text-[#0A1020]">
                Page {pageIndex + 1}/{totalPages || 1}
              </span>
              <span className="mx-1.5">·</span>
              <span>Ch. {chapterNumber}/{total}</span>
            </p>

            {pageIndex < totalPages - 1 || chapterNumber < total ? (
              <CQActionButton variant="primary" onClick={goNextPage} className="gap-1 px-3 py-1.5 text-xs">
                Next
                <ChevronRight className="h-4 w-4" aria-hidden />
              </CQActionButton>
            ) : (
              <CQActionButton variant="navy" onClick={() => onProgress(report.id, 100)} className="px-3 py-1.5 text-xs">
                Finish
              </CQActionButton>
            )}
          </nav>
        </main>
      </div>
    </div>
  )
}

function ChapterPage({
  chapter,
  html,
  pageIndex,
  totalPages,
  isTakeawaysPage,
}: {
  chapter: BookReportChapter
  html: string
  pageIndex: number
  totalPages: number
  isTakeawaysPage: boolean
}) {
  if (isTakeawaysPage) {
    return (
      <div>
        <header className="mb-4 border-b border-[#0A1020]/10 pb-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#708090]">
            Chapter {chapter.number} · Summary
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-[#0A1020]">Before you move on</h1>
        </header>
        <ul className="space-y-3">
          {chapter.key_takeaways.map((t, i) => (
            <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-[#374151]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A1020] font-serif text-sm font-semibold text-[#FAF3E0]">
                {i + 1}
              </span>
              <span className="pt-0.5">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {pageIndex === 0 ? (
        <header className="mb-5 border-b border-[#0A1020]/10 pb-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#708090]">
            Chapter {chapter.number}
            {chapter.level ? ` · ${chapter.level}` : ''}
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-[#0A1020] md:text-3xl">
            {chapter.title}
          </h1>
        </header>
      ) : (
        <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#708090]">
          {chapter.title} · page {pageIndex + 1}/{totalPages}
        </p>
      )}

      <div className={READER_PROSE} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
