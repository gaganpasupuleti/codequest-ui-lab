import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type BentoCardProps = {
  children: ReactNode
  className?: string
  tone?: 'surface' | 'dark' | 'mint' | 'peach' | 'yellow' | 'blue'
  delay?: number
}

const toneClass = {
  surface: '',
  dark: 'sp-card--dark',
  mint: 'sp-card--mint',
  peach: 'sp-card--peach',
  yellow: 'sp-card--yellow',
  blue: 'sp-card--blue',
} as const

export function BentoCard({ children, className, tone = 'surface', delay = 0 }: BentoCardProps) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -2 }}
      className={cn('sp-card', toneClass[tone], className)}
      style={{ alignSelf: 'start', height: 'fit-content' }}
    >
      {children}
    </motion.article>
  )
}
