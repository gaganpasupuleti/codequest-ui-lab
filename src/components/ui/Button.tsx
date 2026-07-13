import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-neon-blue to-electric-blue text-bg-primary font-semibold hover:opacity-90 shadow-lg shadow-neon-blue/20',
  secondary:
    'bg-white/10 text-white hover:bg-white/15 border border-white/10',
  ghost: 'text-text-secondary hover:text-white hover:bg-white/5',
  outline:
    'border border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-full',
  md: 'px-5 py-2.5 text-sm rounded-full',
  lg: 'px-7 py-3 text-base rounded-full',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const isFullWidth = className.includes('w-full')
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={isFullWidth ? 'w-full' : 'inline-flex'}
        tabIndex={-1}
      >
        <button
          ref={ref}
          className={`${isFullWidth ? 'w-full flex' : 'inline-flex'} items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
          {...props}
        >
          {children}
        </button>
      </motion.div>
    )
  },
)

Button.displayName = 'Button'
