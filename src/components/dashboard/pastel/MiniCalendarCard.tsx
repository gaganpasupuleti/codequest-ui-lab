import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'

type MiniCalendarCardProps = {
  streakDays: number[]
  completedDays?: number[]
  classDays?: number[]
  deadlineDays?: number[]
  delay?: number
}

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function MiniCalendarCard({
  streakDays,
  completedDays = [],
  classDays = [3, 10, 17, 24],
  deadlineDays = [8, 22],
  delay = 0.08,
}: MiniCalendarCardProps) {
  const [today] = useState(() => new Date())
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(() => today.getDate())

  const { label, cells, isCurrentMonth } = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const label = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const firstDow = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
    const cells: { day: number }[] = []
    for (let i = 0; i < firstDow; i++) cells.push({ day: 0 })
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d })
    return { label, cells, isCurrentMonth }
  }, [cursor, today])

  return (
    <BentoCard className="sp-span-3" tone="dark" delay={delay}>
      <div className="sp-cal-nav sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Calendar</p>
          <h2 className="sp-card-title">{label}</h2>
        </div>
        <div className="sp-card-head__aside">
          <StudentAction
            variant="icon"
            icon={ChevronLeft}
            aria-label="Previous month"
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              minHeight: 32,
              background: 'var(--student-dark-soft)',
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#fff',
            }}
          />
          <StudentAction
            variant="icon"
            icon={ChevronRight}
            aria-label="Next month"
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              minHeight: 32,
              background: 'var(--student-dark-soft)',
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#fff',
            }}
          />
        </div>
      </div>

      <div className="sp-cal-grid" role="grid" aria-label="Practice calendar">
        {DOW.map((d, i) => (
          <div key={`${d}-${i}`} className="sp-cal-dow" role="columnheader">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (cell.day === 0) return <span key={`e-${i}`} />
          const isSelected = cell.day === selected
          const isToday = isCurrentMonth && cell.day === today.getDate()
          const isStreak = streakDays.includes(cell.day)
          const isClass = classDays.includes(cell.day)
          const isDeadline = deadlineDays.includes(cell.day)
          const isDone = completedDays.includes(cell.day)
          const showDots = isStreak || isClass || isDeadline

          return (
            <button
              key={cell.day}
              type="button"
              role="gridcell"
              className={[
                'sp-cal-day',
                isSelected || isToday ? 'is-selected' : '',
                isDone && !(isSelected || isToday) ? 'is-done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelected(cell.day)}
              aria-label={`${label} ${cell.day}${isStreak ? ', streak' : ''}${isClass ? ', class' : ''}${isDeadline ? ', deadline' : ''}${isDone ? ', completed' : ''}`}
              aria-current={isSelected ? 'date' : undefined}
            >
              {cell.day}
              {showDots ? (
                <span className="sp-cal-day__dots" aria-hidden="true">
                  {isStreak ? <i className="sp-dot-mint" /> : null}
                  {isClass ? <i className="sp-dot-blue" /> : null}
                  {isDeadline ? <i className="sp-dot-peach" /> : null}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="sp-cal-legend">
        <span className="sp-cal-legend__item">
          <i className="sp-dot-mint" /> Streak
        </span>
        <span className="sp-cal-legend__item">
          <i className="sp-dot-blue" /> Class
        </span>
        <span className="sp-cal-legend__item">
          <i className="sp-dot-peach" /> Deadline
        </span>
      </div>
    </BentoCard>
  )
}
