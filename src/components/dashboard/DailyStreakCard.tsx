import { Flame } from 'lucide-react'
import { dummyStudent } from '../../data/dummyStudent'
import { Card } from '../ui/Card'

export function DailyStreakCard() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-400" />
        <h3 className="font-semibold">Daily Streak</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-orange-400">{dummyStudent.streak}</span>
        <span className="text-text-secondary text-sm">days</span>
      </div>
      <p className="text-xs text-text-secondary mt-2">
        Longest streak: {dummyStudent.longestStreak} days
      </p>
      <div className="flex gap-1 mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${i < dummyStudent.streak % 7 || dummyStudent.streak >= 7 ? 'bg-orange-400' : 'bg-white/10'}`}
          />
        ))}
      </div>
    </Card>
  )
}
