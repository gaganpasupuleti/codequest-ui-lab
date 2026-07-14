import { useMemo, useState } from 'react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'
import { motion, useReducedMotion } from 'framer-motion'

type DayPoint = { day: string; xp: number; active: boolean }

type LearningProgressCardProps = {
  points: DayPoint[]
  assignments: number
  courses: number
  lessons: number
  delay?: number
}

export function LearningProgressCard({
  points,
  assignments,
  courses,
  lessons,
  delay = 0.04,
}: LearningProgressCardProps) {
  const reduce = useReducedMotion()
  const [tip, setTip] = useState<{ label: string; x: number; y: number } | null>(null)

  const { path, area, coords, peak, total, w, h } = useMemo(() => {
    const w = 300
    const h = 96
    const padX = 18
    const padY = 12
    const max = Math.max(...points.map((p) => p.xp), 1)
    const coords = points.map((p, i) => {
      const x = padX + (i / Math.max(points.length - 1, 1)) * (w - padX * 2)
      const y = h - padY - (p.xp / max) * (h - padY * 2)
      return { ...p, x, y }
    })
    const path = coords
      .map((c, i) => {
        if (i === 0) return `M ${c.x} ${c.y}`
        const prev = coords[i - 1]
        const cx = (prev.x + c.x) / 2
        return `C ${cx} ${prev.y}, ${cx} ${c.y}, ${c.x} ${c.y}`
      })
      .join(' ')
    const area = `${path} L ${coords[coords.length - 1].x} ${h - padY} L ${coords[0].x} ${h - padY} Z`
    const peak = coords.reduce((a, b) => (b.xp > a.xp ? b : a), coords[0])
    const total = points.reduce((sum, p) => sum + p.xp, 0)
    return { path, area, coords, peak, total, w, h }
  }, [points])

  return (
    <BentoCard className="sp-span-5" tone="dark" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Analytics</p>
          <h2 className="sp-card-title">Learning progress</h2>
        </div>
        <div className="sp-card-head__aside">
          <StudentPill variant="yellow" size="sm">
            {total} XP this week
          </StudentPill>
        </div>
      </div>

      <div className="sp-chart-wrap">
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Weekly XP chart. Peak ${peak.day} with ${peak.xp} XP.`}>
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1="12"
              x2={w - 12}
              y1={14 + t * (h - 28)}
              y2={14 + t * (h - 28)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}
          <motion.path
            d={area}
            fill="url(#xpFill)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay }}
          />
          <defs>
            <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE3A3" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFE3A3" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={path}
            fill="none"
            stroke="#FFE3A3"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, delay: delay + 0.05 }}
          />
          {coords.map((c) => (
            <circle
              key={c.day}
              cx={c.x}
              cy={c.y}
              r={c.day === peak.day ? 5.5 : 3.5}
              fill={c.day === peak.day ? '#FFE3A3' : 'rgba(255,227,163,0.55)'}
              tabIndex={0}
              role="button"
              aria-label={`${c.day}: ${c.xp} XP`}
              onFocus={() => setTip({ label: `${c.day} · ${c.xp} XP`, x: c.x, y: c.y })}
              onBlur={() => setTip(null)}
              onMouseEnter={() => setTip({ label: `${c.day} · ${c.xp} XP`, x: c.x, y: c.y })}
              onMouseLeave={() => setTip(null)}
              style={{ outline: 'none', cursor: 'pointer' }}
            />
          ))}
          {coords.map((c) => (
            <text
              key={`l-${c.day}`}
              x={c.x}
              y={h - 2}
              textAnchor="middle"
              fill="rgba(244,247,244,0.45)"
              fontSize="9"
              fontWeight="600"
            >
              {c.day}
            </text>
          ))}
        </svg>
        <div
          className={`sp-chart-tip${tip ? ' is-on' : ''}`}
          style={tip ? { left: `${(tip.x / w) * 100}%`, top: `${(tip.y / h) * 100}%` } : undefined}
        >
          {tip?.label}
        </div>
      </div>

      <p className="sp-sr-only">
        Weekly XP summary: peak {peak.day} with {peak.xp} XP.
        {[...points].map((p) => `${p.day} ${p.xp}`).join(', ')}.
      </p>

      <div className="sp-inset">
        <p className="sp-eyebrow" style={{ marginBottom: '0.55rem' }}>
          Learning activity
        </p>
        <div className="sp-activity">
          <ActivityRow label="Assignments" value={assignments} color="#BDEFD7" delay={delay} />
          <ActivityRow label="Complete course" value={courses} color="#FFD2C8" delay={delay + 0.05} />
          <ActivityRow label="Viewed lessons" value={lessons} color="#FFE3A3" delay={delay + 0.1} />
        </div>
      </div>
    </BentoCard>
  )
}

function ActivityRow({
  label,
  value,
  color,
  delay,
}: {
  label: string
  value: number
  color: string
  delay: number
}) {
  const reduce = useReducedMotion()
  return (
    <div className="sp-activity-row">
      <div className="sp-activity-row__top">
        <span>{label}</span>
        <StudentPill variant="neutral" size="sm">
          {value}%
        </StudentPill>
      </div>
      <div
        className="sp-progress"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.span
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.55, delay }}
          style={{ background: color }}
        />
      </div>
    </div>
  )
}
