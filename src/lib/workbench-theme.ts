/**
 * Shared dark workbench palette — Code Workbench + SQL Practice.
 * Dense chrome so editor/output get the viewport, not padding.
 */

export const wb = {
  root: 'practice-workbench bg-[#0B1020] text-[#E5E7EB]',
  panel: 'bg-[#0F172A]',
  panelHeader: 'border-[#26324A] bg-[#0F172A]',
  editor: 'bg-[#1E1E1E]',
  border: 'border-[#26324A]',
  textPrimary: 'text-[#E5E7EB]',
  textSecondary: 'text-[#CBD5E1]',
  textMuted: 'text-[#94A3B8]',
  sectionLabel:
    'mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]',
  card: 'rounded-md border border-[#26324A] bg-[#111827] p-2.5 text-[13px] leading-relaxed',
  cardMono:
    'rounded-md border border-[#26324A] bg-[#111827] p-2.5 font-mono text-[12px] leading-relaxed text-[#CBD5E1]',
  tabActive: 'border-b-2 border-sky-400 bg-sky-950/25 text-sky-100',
  tabInactive: 'text-[#94A3B8] hover:bg-[#0F172A] hover:text-[#CBD5E1]',
  langActive: 'bg-sky-500 text-white shadow-sm ring-1 ring-sky-300/50',
  langInactive:
    'border border-[#26324A] bg-[#111827] text-[#CBD5E1] hover:border-sky-500/50 hover:bg-[#1a2332] hover:text-[#E5E7EB]',
  langSoon:
    'border border-dashed border-[#26324A] text-[#94A3B8] opacity-75 cursor-not-allowed hover:bg-transparent',
  toolbarBtn:
    'inline-flex items-center gap-1.5 rounded-md border border-[#26324A] bg-[#111827] px-2.5 py-1.5 text-[12px] font-medium text-[#CBD5E1] transition-colors hover:border-[#3d4f6f] hover:bg-[#1a2332] hover:text-[#E5E7EB]',
  questionActive: 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400/40',
  questionInactive:
    'border border-[#26324A] bg-[#111827] text-[#CBD5E1] hover:border-violet-500/50 hover:bg-[#1a2332] hover:text-[#E5E7EB]',
} as const
