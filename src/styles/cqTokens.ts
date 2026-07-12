/**
 * Code Quest shared visual tokens — values live in globals.css :root.
 * Import token NAMES only; do not duplicate hex values here.
 */
export const CQ_TOKEN = {
  bgPage: 'var(--cq-bg-page)',
  bgElevated: 'var(--cq-bg-elevated)',
  bgCard: 'var(--cq-bg-card)',
  bgGlass: 'var(--cq-bg-glass)',
  bgGlassStrong: 'var(--cq-bg-glass-strong)',
  bgOverlay: 'var(--cq-bg-overlay)',
  textPrimary: 'var(--cq-text-primary)',
  textSecondary: 'var(--cq-text-secondary)',
  textMuted: 'var(--cq-text-muted)',
  textDisabled: 'var(--cq-text-disabled)',
  purplePrimary: 'var(--cq-purple-primary)',
  purpleBright: 'var(--cq-purple-bright)',
  lavender: 'var(--cq-lavender)',
  blueAccent: 'var(--cq-blue-accent)',
  success: 'var(--cq-success)',
  warning: 'var(--cq-warning)',
  destructive: 'var(--cq-destructive)',
  borderSubtle: 'var(--cq-border-subtle)',
  borderStrong: 'var(--cq-border-strong)',
  focusRing: 'var(--cq-focus-ring)',
  glowSoft: 'var(--cq-glow-soft)',
  glowStrong: 'var(--cq-glow-strong)',
  shadowCard: 'var(--cq-shadow-card)',
  radiusSm: 'var(--cq-radius-sm)',
  radiusMd: 'var(--cq-radius-md)',
  radiusLg: 'var(--cq-radius-lg)',
  radiusPill: 'var(--cq-radius-pill)',
  durationFast: 'var(--cq-duration-fast)',
  durationNormal: 'var(--cq-duration-normal)',
  durationSlow: 'var(--cq-duration-slow)',
  easeStandard: 'var(--cq-ease-standard)',
} as const

/** K3 shell aliases — same source of truth as CQ_TOKEN */
export const K3 = {
  bg: CQ_TOKEN.bgPage,
  surface: CQ_TOKEN.bgElevated,
  text: CQ_TOKEN.textPrimary,
  muted: CQ_TOKEN.textMuted,
  border: CQ_TOKEN.borderSubtle,
  accent: CQ_TOKEN.textPrimary,
} as const

export const K3_SECTION =
  'font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-[color:var(--cq-text-muted)]'

export const K3_HEADLINE =
  'text-[clamp(2.5rem,8vw,5.5rem)] font-medium uppercase leading-[0.92] tracking-[-0.02em] text-[color:var(--cq-text-primary)]'

export const K3_CARD =
  'group border border-[color:var(--cq-border-subtle)] bg-[color:var(--cq-bg-card)] p-6 transition-colors hover:border-[color:var(--cq-border-strong)]'

export const K3_LINK =
  'text-sm text-[color:var(--cq-text-secondary)] transition-colors hover:text-[color:var(--cq-text-primary)]'

export const K3_CTA =
  'inline-flex items-center gap-2 border border-[color:var(--cq-border-strong)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cq-text-primary)] transition-colors hover:bg-[color:var(--cq-text-primary)] hover:text-[color:var(--cq-bg-page)]'

export const K3_CTA_FILLED =
  'inline-flex items-center gap-2 bg-[color:var(--cq-text-primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cq-bg-page)] transition-opacity hover:opacity-90'
