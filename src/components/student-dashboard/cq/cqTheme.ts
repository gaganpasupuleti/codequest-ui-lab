/**
 * Post-login student surface tokens — dense utilitarian SaaS.
 *
 * Cool neutrals, one accent blue, ≤8px radii. Cards for repeated items /
 * tools / modals only; page sections use the shared rail + stack gap.
 *
 * Type scale:
 *   Page title 20–22px · Section 14–15px · Body 13px · Meta 12px · Label 11px
 *   Metric 22px · Metric large 26px
 *
 * Spacing:
 *   Page pad 12–20px · Stack gap 12px · Card pad 14–16px
 */

export type CQTone = 'yellow' | 'pink' | 'sage' | 'blue' | 'lavender' | 'cream'

/** Soft status tints — cool, low-chroma (not pastel cream). */
export const CQ_TONE_BG: Record<CQTone, string> = {
  yellow: 'bg-amber-50',
  pink: 'bg-rose-50',
  sage: 'bg-emerald-50',
  blue: 'bg-sky-50',
  lavender: 'bg-violet-50',
  cream: 'bg-white',
}

export const CQ_TONE_SOFT: Record<CQTone, string> = {
  yellow: 'bg-amber-100/70',
  pink: 'bg-rose-100/70',
  sage: 'bg-emerald-100/70',
  blue: 'bg-sky-100/70',
  lavender: 'bg-violet-100/70',
  cream: 'bg-zinc-50',
}

/** Full scroll-area canvas — cool zinc, fills StudentShell main. */
export const CQ_PAGE_BG = 'min-h-full min-w-0 flex-1 bg-[#F4F5F7] text-[#111827]'

/** Outer pad; pair with CQ_PAGE_CONTAINER for large-screen centering. */
export const CQ_PAGE_PAD = 'w-full min-w-0 px-3 py-3 sm:px-4 sm:py-4 md:px-5'

/** Centered content rail — stops stretch on ≥1920px displays. */
export const CQ_PAGE_CONTAINER =
  'mx-auto w-full min-w-0 max-w-[1440px] box-border'

/** Consistent gap between panels / rows. */
export const CQ_STACK_GAP = 'gap-3'

export const CQ_GRID_2 = 'grid grid-cols-1 min-w-0 gap-3 sm:grid-cols-2'
export const CQ_GRID_3 = 'grid grid-cols-1 min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3'
export const CQ_GRID_4 =
  'grid grid-cols-1 min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

/** Surface — white, 8px radius, cool hairline. */
export const CQ_CARD =
  'rounded-lg border border-[#E5E7EB] bg-white shadow-sm transition-shadow'

export const CQ_CARD_HOVER = 'hover:border-[#D1D5DB] hover:shadow-md'

export const CQ_CARD_BODY = 'p-3.5 sm:p-4'

export const CQ_SECTION_HEAD = 'mb-2.5 flex items-center justify-between gap-2'

export const CQ_SECTION_TITLE =
  'text-[15px] font-semibold tracking-normal text-[#111827]'

export const CQ_SECTION_SUB = 'mt-0.5 text-[12px] leading-snug text-[#6B7280]'

export const CQ_PAGE_TITLE =
  'text-[20px] font-semibold tracking-normal text-[#111827] sm:text-[22px]'

export const CQ_BODY = 'text-[13px] leading-snug text-[#4B5563]'

export const CQ_BODY_STRONG = 'text-[13px] font-semibold leading-snug text-[#111827]'

export const CQ_META = 'text-[12px] leading-snug text-[#6B7280]'

export const CQ_LABEL = 'text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]'

export const CQ_CHIP =
  'inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold'

export const CQ_METRIC =
  'text-[22px] font-bold leading-none tabular-nums tracking-normal text-[#111827]'

export const CQ_METRIC_LG =
  'text-[26px] font-bold leading-none tabular-nums tracking-normal text-[#111827]'

export const CQ_LINK =
  'text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]'

export const CQ_HAIRLINE = 'border-[#E5E7EB]'
export const CQ_MUTED = 'text-[#6B7280]'
export const CQ_INK = 'text-[#111827]'

export const CQ_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white'

export const CQ_CANVAS = 'bg-[#F4F5F7]'
export const CQ_TOPBAR =
  'border-[#E5E7EB] bg-[#F4F5F7]'
