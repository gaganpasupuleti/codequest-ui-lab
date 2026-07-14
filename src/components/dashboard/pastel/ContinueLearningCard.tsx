import { Clock3, BookMarked, Database, Code2 } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'
import { motion, useReducedMotion } from 'framer-motion'

type ContinueLearningCardProps = {
  title: string
  lesson: string
  progress: number
  lessonsDone: number
  lessonsTotal: number
  duration: string
  href: string
  nextPreview: string
  relatedLabel?: string
  delay?: number
}

export function ContinueLearningCard({
  title,
  lesson,
  progress,
  lessonsDone,
  lessonsTotal,
  duration,
  href,
  nextPreview,
  relatedLabel = 'Python Lab',
  delay = 0,
}: ContinueLearningCardProps) {
  const reduce = useReducedMotion()

  return (
    <BentoCard className="sp-span-4" tone="blue" delay={delay}>
      <div className="sp-continue">
        <div className="sp-card-head">
          <div className="sp-card-head__text" style={{ flexDirection: 'row', gap: '0.65rem', alignItems: 'flex-start' }}>
            <span className="sp-continue__icon" aria-hidden="true">
              <Database size={16} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
                <p className="sp-eyebrow">Continue learning</p>
                <StudentPill variant="primary" size="sm">
                  In progress
                </StudentPill>
              </div>
              <h2 className="sp-card-title">{title}</h2>
              <p className="sp-body" style={{ marginTop: 2 }}>
                {lesson}
              </p>
            </div>
          </div>
        </div>

        <div className="sp-continue__sql" aria-hidden="true">
          <code>
            SELECT u.name, c.title FROM users u
            <br />
            JOIN courses c ON c.user_id = u.id;
          </code>
        </div>

        <div className="sp-inset">
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <StudentPill variant="neutral" size="sm" icon={BookMarked}>
              {lessonsDone}/{lessonsTotal} lessons
            </StudentPill>
            <StudentPill variant="neutral" size="sm" icon={Clock3}>
              {duration}
            </StudentPill>
          </div>
          <div className="sp-progress-meta">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div
            className="sp-progress sp-progress--thick"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} progress`}
          >
            <motion.span
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.7, delay: delay + 0.1 }}
              style={{ background: 'var(--student-primary)' }}
            />
          </div>
          <p className="sp-body" style={{ marginTop: '0.5rem', fontWeight: 650, color: 'var(--student-ink)' }}>
            Next: {nextPreview}
          </p>
        </div>

        <div className="sp-continue__related-row">
          <span className="sp-continue__related-icon" aria-hidden="true">
            <Code2 size={14} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="sp-card-title" style={{ fontSize: '0.875rem' }}>
              {relatedLabel}
            </p>
            <p className="sp-muted" style={{ margin: 0 }}>
              Related · Lists &amp; loops
            </p>
          </div>
          <StudentPill variant="mint" size="sm">
            28%
          </StudentPill>
        </div>

        <div className="sp-card-foot">
          <StudentAction href={href} showArrow>
            Continue
          </StudentAction>
        </div>
      </div>
    </BentoCard>
  )
}
