interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = '#00f0ff',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary mb-1.5">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
