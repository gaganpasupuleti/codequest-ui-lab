import { Flame } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'
import { motion, useReducedMotion } from 'framer-motion'

type XpStreakCardProps = {
  xp: number
  level: number
  xpToNext: number
  streak: number
  delay?: number
}

export function XpStreakCard({ xp, level, xpToNext, streak, delay = 0.26 }: XpStreakCardProps) {
  const reduce = useReducedMotion()
  const pct = Math.min(100, Math.round((xp / Math.max(xpToNext, 1)) * 100))
  const week = Array.from({ length: 7 }, (_, i) => i < Math.min(streak, 7))

  return (
    <BentoCard className="sp-span-4" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">XP & streak</p>
          <h2 className="sp-card-title">Your progress</h2>
        </div>
        <div className="sp-card-head__aside">
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(145deg, var(--student-primary), #4f6fff)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            CQ
          </div>
        </div>
      </div>

      <p className="sp-metric">{xp.toLocaleString()} XP</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        <StudentPill variant="primary" size="sm">
          Level {level}
        </StudentPill>
        <StudentPill variant="peach" size="sm" icon={Flame}>
          {streak}-day streak
        </StudentPill>
      </div>

      <div className="sp-inset">
        <div className="sp-progress-meta">
          <span>To Level {level + 1}</span>
          <span>
            {xp.toLocaleString()} / {xpToNext.toLocaleString()}
          </span>
        </div>
        <div
          className="sp-progress"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress to next level"
        >
          <motion.span
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.65, delay }}
            style={{ background: 'linear-gradient(90deg, var(--student-mint-strong), var(--student-primary))' }}
          />
        </div>
        <div style={{ marginTop: '0.55rem' }}>
          <p className="sp-muted" style={{ marginBottom: '0.3rem' }}>
            This week
          </p>
          <div className="sp-streak-row" aria-label={`${streak} day streak indicator`}>
            {week.map((on, i) => (
              <i key={i} className={on ? 'is-on' : undefined} />
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
