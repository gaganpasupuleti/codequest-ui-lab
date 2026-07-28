import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type MeterVars = CSSProperties & Record<`--${string}`, string>

type LandingMeterProps = {
  label: string
  value: number
  className?: string
}

/**
 * Demo progress meter. The final width comes from the inline custom property so the bar
 * is already correct before (and without) any animation — GSAP only scales the reveal.
 */
export function LandingMeter({ label, value, className }: LandingMeterProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="landing-label truncate">{label}</span>
        <span className="font-mono text-sm font-bold">{value}%</span>
      </div>
      <div
        className="landing-meter"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} — illustrative demo value`}
      >
        <span
          data-meter-fill
          className="landing-meter-fill"
          style={{ '--landing-meter-value': `${value}%` } as MeterVars}
        />
      </div>
    </div>
  )
}
