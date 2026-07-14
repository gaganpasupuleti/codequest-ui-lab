import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StudentPillVariant =
  | 'neutral'
  | 'primary'
  | 'dark'
  | 'mint'
  | 'peach'
  | 'yellow'
  | 'blue'
  | 'outline'
  | 'success'
  | 'disabled'

export type StudentPillSize = 'sm' | 'md' | 'action'

type StudentPillProps = {
  children: ReactNode
  variant?: StudentPillVariant
  size?: StudentPillSize
  icon?: LucideIcon
  className?: string
  title?: string
}

export function StudentPill({
  children,
  variant = 'neutral',
  size = 'sm',
  icon: Icon,
  className,
  title,
}: StudentPillProps) {
  return (
    <span
      className={cn('sp-pill', `sp-pill--${variant}`, `sp-pill--${size}`, className)}
      title={title}
    >
      {Icon ? <Icon aria-hidden="true" className="sp-pill__icon" /> : null}
      <span className="sp-pill__label">{children}</span>
    </span>
  )
}
