/** Shared planner accents — aligned with CQ cool neutrals + blue. */

export const PLANNER_CARD =
  'rounded-lg border border-[#E5E7EB] bg-white shadow-sm'
export const PLANNER_BODY = 'p-3.5 sm:p-4'
export const PLANNER_PAGE = 'p-3 sm:p-4'
export const PLANNER_GAP = 'gap-3'
export const PLANNER_SECTION_TITLE =
  'text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]'
export const PLANNER_STAT_CHIP =
  'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums'

export const EVENT_COLORS: Record<string, string> = {
  class: 'border-l-[#2563EB] bg-[#EFF6FF]',
  quiz: 'border-l-[#D97706] bg-[#FFFBEB]',
  project: 'border-l-[#059669] bg-[#ECFDF5]',
  syllabus: 'border-l-[#0284C7] bg-[#F0F9FF]',
  practice: 'border-l-[#4B5563] bg-[#F3F4F6]',
}

export const EVENT_BADGE: Record<string, string> = {
  class: 'bg-[#DBEAFE] text-[#1E40AF]',
  quiz: 'bg-[#FEF3C7] text-[#92400E]',
  project: 'bg-[#D1FAE5] text-[#065F46]',
  syllabus: 'bg-[#E0F2FE] text-[#075985]',
  practice: 'bg-[#F3F4F6] text-[#374151]',
}

export const EVENT_DOT: Record<string, string> = {
  class: 'bg-[#2563EB]',
  quiz: 'bg-[#D97706]',
  project: 'bg-[#059669]',
  syllabus: 'bg-[#0284C7]',
  practice: 'bg-[#6B7280]',
}

export const COUNT_CHIP: Record<string, string> = {
  class: 'bg-[#EFF6FF] text-[#1E40AF] ring-1 ring-[#BFDBFE]',
  practice: 'bg-[#F3F4F6] text-[#374151] ring-1 ring-[#E5E7EB]',
  quiz: 'bg-[#FFFBEB] text-[#92400E] ring-1 ring-[#FDE68A]',
  project: 'bg-[#ECFDF5] text-[#065F46] ring-1 ring-[#A7F3D0]',
  syllabus: 'bg-[#F0F9FF] text-[#075985] ring-1 ring-[#BAE6FD]',
}
