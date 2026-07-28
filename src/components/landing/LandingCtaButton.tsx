import type { MouseEvent, ReactNode } from 'react'

import { handleSectionAnchorClick } from '@/components/landing/landingSectionNav'
import { cn } from '@/lib/utils'

type CtaTone = 'primary' | 'ghost' | 'flare'
type CtaSize = 'md' | 'lg'

type SharedCtaProps = {
  children: ReactNode
  tone?: CtaTone
  size?: CtaSize
  className?: string
}

function ctaClass(tone: CtaTone, size: CtaSize, className?: string): string {
  return cn('landing-btn', `landing-btn--${tone}`, size === 'lg' && 'landing-btn--lg', className)
}

type LandingCtaButtonProps = SharedCtaProps & {
  onClick: () => void
  ariaLabel?: string
}

/** Editorial CTA for actions (opens the login view, switches previews, etc). */
export function LandingCtaButton({
  children,
  onClick,
  tone = 'primary',
  size = 'md',
  className,
  ariaLabel,
}: LandingCtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={ctaClass(tone, size, className)}
    >
      {children}
    </button>
  )
}

type LandingCtaLinkProps = SharedCtaProps & {
  href: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

/** Editorial CTA for in-page navigation — stays an anchor so it works without JS. */
export function LandingCtaLink({
  children,
  href,
  tone = 'ghost',
  size = 'md',
  className,
  onClick = handleSectionAnchorClick,
}: LandingCtaLinkProps) {
  return (
    <a href={href} onClick={onClick} className={ctaClass(tone, size, className)}>
      {children}
    </a>
  )
}
