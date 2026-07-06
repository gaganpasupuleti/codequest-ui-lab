type BadgeVariant = 'default' | 'neon' | 'purple' | 'green' | 'yellow' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white-smoke',
  neon: 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30',
  purple: 'bg-neon-purple/15 text-neon-purple border border-neon-purple/30',
  green: 'bg-mantis-green/15 text-mantis-green border border-mantis-green/30',
  yellow: 'bg-lemon-yellow/15 text-lemon-yellow border border-lemon-yellow/30',
  muted: 'bg-white/5 text-text-secondary border border-white/10',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
