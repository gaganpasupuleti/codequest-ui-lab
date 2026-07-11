/** K3 Studios design tokens — https://k3studios.ae/ */
export const K3 = {
  bg: '#0a0a0a',
  surface: '#111111',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.45)',
  border: 'rgba(255,255,255,0.12)',
  accent: '#ffffff',
} as const

export const K3_SECTION =
  'font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-white/40'

export const K3_HEADLINE =
  'text-[clamp(2.5rem,8vw,5.5rem)] font-medium uppercase leading-[0.92] tracking-[-0.02em] text-white'

export const K3_CARD =
  'group border border-white/10 bg-[#111] p-6 transition-colors hover:border-white/25'

export const K3_LINK = 'text-sm text-white/70 transition-colors hover:text-white'

export const K3_CTA =
  'inline-flex items-center gap-2 border border-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black'

export const K3_CTA_FILLED =
  'inline-flex items-center gap-2 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90'
