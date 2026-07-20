/**
 * Code Quest dashboard design tokens.
 *
 * Adapted (not imported) from the `codequest-frontend-kit` sample
 * (branch: codequest-dashboard-sample). The kit defines these as Tailwind
 * theme colors; here they are expressed as scoped arbitrary-value classes so
 * the dashboard gets the sample look WITHOUT changing the global Tailwind
 * config or the shared `dashboard-styles.ts` tokens used by frozen pages
 * (Progress, Calendar, Resume).
 *
 * Type scale (one system across the dashboard):
 *   Hero title 24–28px · Section title 15px · Body 13px · Meta 12px · Label 11px
 *   Metric 24px · Metric large 28px
 *
 * Spacing:
 *   Page pad 16–20px · Stack gap 12px · Card pad 16px · Section head mb 10px
 */

export type CQTone = 'yellow' | 'pink' | 'sage' | 'blue' | 'lavender' | 'cream'

export const CQ_TONE_BG: Record<CQTone, string> = {
  yellow: 'bg-[#F3DFA0]',
  pink: 'bg-[#F5D0DE]',
  sage: 'bg-[#C2CDB0]',
  blue: 'bg-[#B8C9E8]',
  lavender: 'bg-[#DDD0F5]',
  cream: 'bg-[#FFF9EA]',
}

/** Soft tints used for inset chips / timeline pills inside cards. */
export const CQ_TONE_SOFT: Record<CQTone, string> = {
  yellow: 'bg-[#F3DFA0]/45',
  pink: 'bg-[#F5D0DE]/50',
  sage: 'bg-[#C2CDB0]/50',
  blue: 'bg-[#B8C9E8]/45',
  lavender: 'bg-[#DDD0F5]/50',
  cream: 'bg-[#FFF9EA]',
}

/**
 * Page background — one warm canvas for the whole dashboard. Slightly deeper
 * cream than the cards so cards read as cards (no muddy same-tone banding).
 * Scoped to the dashboard page wrapper only.
 */
/** Full scroll-area canvas — flex-1 fills the StudentShell main so no white seam. */
export const CQ_PAGE_BG = 'min-h-full flex-1 bg-[#F2EBD6] text-[#111827]'

export const CQ_PAGE_PAD = 'p-4 md:p-5'

/** Consistent gap between dashboard cards / rows. */
export const CQ_STACK_GAP = 'gap-3'

/** Base card surface — near-white warm cream on a slate hairline. */
export const CQ_CARD =
  'rounded-2xl border border-[#708090]/18 bg-[#FFFDF6] shadow-[0_8px_22px_-18px_rgba(10,16,32,0.5)] transition-shadow'

export const CQ_CARD_HOVER =
  'hover:shadow-[0_14px_30px_-18px_rgba(10,16,32,0.55)]'

/** Card padding — one density for every panel. */
export const CQ_CARD_BODY = 'p-4'

/** Section heading row. */
export const CQ_SECTION_HEAD = 'mb-2.5 flex items-center justify-between gap-2'

/** Section heading — editorial serif, charcoal. One size across all sections. */
export const CQ_SECTION_TITLE =
  'font-serif text-[15px] font-semibold tracking-tight text-[#111827]'

export const CQ_SECTION_SUB = 'mt-0.5 text-[12px] leading-snug text-[#708090]'

/** Primary body copy inside cards. */
export const CQ_BODY = 'text-[13px] leading-snug text-[#4B5563]'

export const CQ_BODY_STRONG = 'text-[13px] font-semibold leading-snug text-[#111827]'

/** Secondary meta / timestamps. */
export const CQ_META = 'text-[12px] leading-snug text-[#708090]'

/** Uppercase micro labels. */
export const CQ_LABEL = 'text-[11px] font-semibold uppercase tracking-wider text-[#708090]'

/** Pill chips / badges. */
export const CQ_CHIP =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold'

/** Metric numbers — practice cards and compact stats. */
export const CQ_METRIC = 'text-[24px] font-bold leading-none tabular-nums tracking-tight text-[#111827]'

/** Slightly larger metric for overall progress. */
export const CQ_METRIC_LG =
  'text-[28px] font-bold leading-none tabular-nums tracking-tight text-[#111827]'

/** Inline link styling (cta blue). */
export const CQ_LINK =
  'text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]'

/** Border + muted helpers. */
export const CQ_HAIRLINE = 'border-[#708090]/20'
export const CQ_MUTED = 'text-[#708090]'
export const CQ_INK = 'text-[#111827]'

/** Focus ring consistent with cta accent. */
export const CQ_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFF9EA]'
