import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActionVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'disabled'

type SharedProps = {
  children?: ReactNode
  variant?: ActionVariant
  icon?: LucideIcon
  showArrow?: boolean
  className?: string
  style?: CSSProperties
  title?: string
  'aria-label'?: string
  'aria-controls'?: string
}

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'style'> & {
    href?: undefined
  }

type LinkProps = SharedProps & {
  href: string
  disabled?: boolean
  type?: never
  onClick?: never
}

export function StudentAction(props: ButtonProps | LinkProps) {
  const {
    children,
    variant = 'primary',
    icon: Icon,
    showArrow = false,
    className,
    style,
  } = props

  const resolvedVariant = props.disabled || variant === 'disabled' ? 'disabled' : variant
  const classes = cn('sp-action', `sp-action--${resolvedVariant}`, className)

  const content = (
    <>
      {Icon ? <Icon aria-hidden="true" className="sp-action__icon" /> : null}
      {children ? <span>{children}</span> : null}
      {showArrow ? <ArrowUpRight aria-hidden="true" className="sp-action__arrow" /> : null}
    </>
  )

  if ('href' in props && props.href) {
    if (resolvedVariant === 'disabled') {
      return (
        <span className={classes} style={style} aria-disabled="true" title={props.title}>
          {content}
        </span>
      )
    }
    return (
      <Link
        to={props.href}
        className={classes}
        style={style}
        title={props.title}
        aria-label={props['aria-label']}
      >
        {content}
      </Link>
    )
  }

  const { disabled, type = 'button', onClick, title, ...rest } = props as ButtonProps
  return (
    <button
      type={type}
      className={classes}
      style={style}
      disabled={disabled || resolvedVariant === 'disabled'}
      onClick={onClick}
      title={title}
      aria-label={rest['aria-label']}
      aria-controls={rest['aria-controls']}
    >
      {content}
    </button>
  )
}
