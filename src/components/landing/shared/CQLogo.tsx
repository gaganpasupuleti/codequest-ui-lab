import { cn } from '@/lib/utils'

type CQLogoProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const sizeMap = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-14 w-14 text-xl',
  lg: 'h-20 w-20 text-3xl',
}

export function CQLogo({ className, size = 'md', animated = false }: CQLogoProps) {
  return (
    <div
      className={cn(
        'cq-logo relative inline-flex items-center justify-center rounded-2xl font-black tracking-tighter',
        'bg-[#1944F1] text-[#FFEF4D] shadow-[0_0_40px_rgba(25,68,241,0.35)]',
        sizeMap[size],
        animated && 'cq-logo--animated',
        className,
      )}
      aria-hidden
    >
      <span className="relative z-10">CQ</span>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
    </div>
  )
}
