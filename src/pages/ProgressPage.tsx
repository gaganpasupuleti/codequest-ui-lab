import { Award, Calendar, TrendingUp, Zap } from 'lucide-react'
import { weeklyProgress, skillProgress, xpHistory, completedQuests, streakCalendar } from '../data/dummyProgress'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'

export function ProgressPage() {
  const maxXp = Math.max(...weeklyProgress.map((d) => d.xp), 1)

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="neon" className="mb-2">Progress</Badge>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-neon-blue" />
          Progress Tracker
        </h1>
        <p className="text-text-secondary text-sm mt-1">Track your learning journey — dummy data only.</p>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Weekly Progress</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyProgress.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-28">
                <div
                  className={`w-full max-w-[40px] rounded-t-lg transition-all ${day.active ? 'bg-gradient-to-t from-neon-blue to-neon-purple' : 'bg-white/10'}`}
                  style={{ height: `${(day.xp / maxXp) * 100}%`, minHeight: day.xp > 0 ? '8px' : '4px' }}
                />
              </div>
              <span className="text-xs text-text-secondary">{day.day}</span>
              {day.xp > 0 && <span className="text-xs text-lemon-yellow">{day.xp}</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Skill Progress</h3>
          <div className="space-y-4">
            {skillProgress.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.skill}</span>
                  <span className="text-text-secondary">{s.progress}%</span>
                </div>
                <ProgressBar value={s.progress} color={s.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-lemon-yellow" /> XP History
          </h3>
          <ul className="space-y-3">
            {xpHistory.map((x) => (
              <li key={x.id} className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/[0.03]">
                <div>
                  <p className="font-medium">{x.action}</p>
                  <p className="text-xs text-text-secondary">{x.date}</p>
                </div>
                <span className="text-lemon-yellow font-semibold">+{x.xp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-neon-purple" /> Completed Quests
          </h3>
          <ul className="space-y-3">
            {completedQuests.map((q) => (
              <li key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div>
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="text-xs text-text-secondary">{q.completedAt}</p>
                </div>
                <Badge variant="green">+{q.xp} XP</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" /> Streak Calendar
          </h3>
          <div className="grid grid-cols-7 gap-1.5">
            {streakCalendar.map((day) => (
              <div
                key={day.day}
                className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                  day.active ? 'bg-orange-400/30 text-orange-300 border border-orange-400/40' : 'bg-white/5 text-text-muted'
                }`}
              >
                {day.day}
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-3">14-day current streak</p>
        </Card>
      </div>
    </div>
  )
}
