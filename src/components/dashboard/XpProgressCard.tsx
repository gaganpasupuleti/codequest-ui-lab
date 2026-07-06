import { Zap } from 'lucide-react'
import { dummyStudent } from '../../data/dummyStudent'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

export function XpProgressCard() {
  const pct = Math.round((dummyStudent.xp / dummyStudent.xpToNext) * 100)

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-lemon-yellow" />
        <h3 className="font-semibold">XP Progress</h3>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold gradient-text">{dummyStudent.xp}</span>
        <span className="text-text-secondary text-sm">/ {dummyStudent.xpToNext} XP</span>
      </div>
      <ProgressBar value={pct} color="#ffef4d" showLabel />
      <p className="text-xs text-text-secondary mt-2">Level {dummyStudent.level} → Level {dummyStudent.level + 1}</p>
    </Card>
  )
}
