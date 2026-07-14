import { Zap } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'
import { motion, useReducedMotion } from 'framer-motion'

type TodaysQuestCardProps = {
  title: string
  description: string
  xp: number
  progress: number
  difficulty: string
  completed: number
  total: number
  href: string
  delay?: number
}

export function TodaysQuestCard({
  title,
  description,
  xp,
  progress,
  difficulty,
  completed,
  total,
  href,
  delay = 0.12,
}: TodaysQuestCardProps) {
  const reduce = useReducedMotion()

  return (
    <BentoCard className="sp-span-4" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Daily quest</p>
          <h2 className="sp-card-title">{title}</h2>
        </div>
        <div className="sp-card-head__aside">
          <span className="sp-sql-glyph" aria-hidden="true">
            SELECT
          </span>
        </div>
      </div>

      <p className="sp-body">{description}</p>

      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        <StudentPill variant="yellow" size="sm" icon={Zap}>
          +{xp} XP
        </StudentPill>
        <StudentPill variant="outline" size="sm">
          {difficulty}
        </StudentPill>
        <StudentPill variant="mint" size="sm">
          {completed}/{total} challenges
        </StudentPill>
      </div>

      <div className="sp-inset">
        <div className="sp-progress-meta">
          <span>Quest progress</span>
          <span>{progress}%</span>
        </div>
        <div
          className="sp-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quest progress"
        >
          <motion.span
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay }}
          />
        </div>
      </div>

      <div className="sp-card-foot">
        <StudentAction href={href} showArrow>
          {progress > 0 ? 'Continue' : 'Start'}
        </StudentAction>
      </div>
    </BentoCard>
  )
}
