import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  CQ_CARD,
  CQ_CARD_BODY,
  CQ_CARD_HOVER,
  CQ_FOCUS,
  CQ_LABEL,
  CQ_LINK,
  CQ_META,
  CQ_METRIC,
  CQ_SECTION_SUB,
  CQ_SECTION_TITLE,
  CQ_TONE_BG,
  type CQTone,
} from './cqTheme'

/**
 * Presentational primitives adapted from the codequest-frontend-kit sample
 * (CQCard / CQStatCard / CQProgressBar / CQSectionTitle / CQActionButton /
 * CQWeeklyChart). Dashboard-scoped only — no runtime import from the kit.
 */

interface CQCardProps {
  tone?: CQTone
  interactive?: boolean
  className?: string
  children: ReactNode
}

export function CQCard({ tone = 'cream', interactive = false, className, children }: CQCardProps) {
  const toneBg = tone === 'cream' ? CQ_CARD : cn(CQ_CARD, CQ_TONE_BG[tone])
  return (
    <div className={cn(toneBg, interactive && CQ_CARD_HOVER, CQ_CARD_BODY, className)}>
      {children}
    </div>
  )
}

interface CQStatCardProps {
  label: string
  value?: ReactNode
  detail?: ReactNode
  detailHighlight?: boolean
  tone?: CQTone
  footer?: ReactNode
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

export function CQStatCard({
  label,
  value,
  detail,
  detailHighlight = false,
  tone = 'yellow',
  footer,
  icon,
  onClick,
  className,
}: CQStatCardProps) {
  const interactive = Boolean(onClick)
  const Wrapper = interactive ? 'button' : 'div'
  return (
    <Wrapper
      {...(interactive ? { type: 'button' as const, onClick } : {})}
      className={cn(
        CQ_CARD,
        CQ_TONE_BG[tone],
        CQ_CARD_BODY,
        'flex h-full flex-col text-left',
        interactive && cn(CQ_CARD_HOVER, CQ_FOCUS, 'cursor-pointer'),
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className={cn(CQ_LABEL, 'normal-case tracking-wide text-[#111827]/70')}>{label}</h3>
        {icon && <span className="shrink-0 text-[#0A1020]/55">{icon}</span>}
      </div>
      {value != null && value !== '' && <p className={CQ_METRIC}>{value}</p>}
      {detail && (
        <p
          className={cn(
            'mt-1',
            CQ_META,
            detailHighlight ? 'font-semibold text-[#0F9488]' : 'text-[#4B5563]',
          )}
        >
          {detail}
        </p>
      )}
      {footer && <div className="mt-auto pt-3">{footer}</div>}
    </Wrapper>
  )
}

interface CQProgressBarProps {
  label?: string
  value: number
  className?: string
  /** When false, hide the trailing percent (use when a large metric already shows it). */
  showValue?: boolean
}

export function CQProgressBar({ label, value, className, showValue }: CQProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  const renderValue = showValue ?? !label
  return (
    <div className={cn('flex min-w-0 items-center gap-1.5', className)}>
      {label ? (
        <span className={cn('w-14 shrink-0 truncate font-medium text-[#374151]', CQ_META)}>
          {label}
        </span>
      ) : null}
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#0A1020]/10">
        <div
          className="h-full rounded-full bg-[#0A1020]/75 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {renderValue ? <span className={cn('w-8 shrink-0 text-right tabular-nums', CQ_META)}>{pct}%</span> : null}
    </div>
  )
}

interface CQSectionTitleProps {
  children: ReactNode
  sub?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function CQSectionTitle({ children, sub, icon, action, className }: CQSectionTitleProps) {
  return (
    <div className={cn('mb-2.5 flex items-start justify-between gap-2', className)}>
      <div className="min-w-0">
        <h2 className={cn(CQ_SECTION_TITLE, 'flex items-center gap-2')}>
          {icon && <span className="shrink-0 text-[#0A1020]/70">{icon}</span>}
          {children}
        </h2>
        {sub && <p className={CQ_SECTION_SUB}>{sub}</p>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  )
}

type CQButtonVariant = 'primary' | 'navy' | 'ghost'

const CQ_BUTTON_VARIANTS: Record<CQButtonVariant, string> = {
  primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]',
  navy: 'bg-[#111827] text-white hover:bg-[#1F2937]',
  ghost:
    'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-zinc-50 hover:text-[#111827]',
}

interface CQActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CQButtonVariant
}

export function CQActionButton({
  variant = 'primary',
  className,
  children,
  ...props
}: CQActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        CQ_BUTTON_VARIANTS[variant],
        CQ_FOCUS,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function CQInlineLink({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(CQ_LINK, CQ_FOCUS, 'inline-flex items-center gap-1 rounded', className)}
      {...props}
    >
      {children}
    </button>
  )
}

/** Display-only weekly activity sparkline (decorative, like the kit). */
export function CQWeeklyChart({ heights }: { heights?: number[] }) {
  const bars = heights && heights.length > 0 ? heights : [35, 50, 42, 58, 68, 55, 72]
  return (
    <div className="my-0.5 flex h-7 items-end gap-1">
      {bars.map((h, i) => (
        <div
          key={i}
          className="min-h-[4px] flex-1 rounded-t-sm bg-[#0A1020]/20"
          style={{ height: `${Math.max(8, Math.min(100, h))}%` }}
        />
      ))}
    </div>
  )
}
