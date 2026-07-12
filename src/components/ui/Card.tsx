import { type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

export function Card({ hover = false, glass = true, className = '', children, ...props }: CardProps) {
  const base = glass ? 'glass rounded-2xl' : 'rounded-2xl bg-[color:var(--cq-bg-glass)] border border-[color:var(--cq-border-subtle)]'

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className={`${base} p-6 ${className}`} {...props}>
          {children}
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`${base} p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}
