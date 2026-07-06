import { Link } from 'react-router-dom'
import { Award, Calendar, Clock } from 'lucide-react'
import { WelcomeCard } from '../components/dashboard/WelcomeCard'
import { XpProgressCard } from '../components/dashboard/XpProgressCard'
import { DailyStreakCard } from '../components/dashboard/DailyStreakCard'
import { QuestCards } from '../components/dashboard/QuestCards'
import { CareerReadinessCard } from '../components/dashboard/CareerReadinessCard'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { practiceModules } from '../data/dummyCourses'
import { dummyStudent } from '../data/dummyStudent'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <XpProgressCard />
        <DailyStreakCard />
        <CareerReadinessCard />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuestCards />
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-neon-purple" />
              <h3 className="font-semibold">Upcoming Tasks</h3>
            </div>
            <ul className="space-y-3">
              {dummyStudent.upcomingTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-text-secondary">{task.due}</p>
                  </div>
                  <Badge variant="muted">{task.type}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-lemon-yellow" />
              <h3 className="font-semibold">Skill Badges</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dummyStudent.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={{ borderColor: `${badge.color}40`, color: badge.color, background: `${badge.color}15` }}
                >
                  {badge.name}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Recommended Practice</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {practiceModules.slice(0, 3).map((mod) => (
            <Link
              key={mod.id}
              to={mod.href}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-neon-blue/30 transition-colors"
            >
              <p className="font-medium text-sm mb-1">{mod.title}</p>
              <p className="text-xs text-text-secondary">{mod.questions} questions</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-neon-blue" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <ul className="space-y-3">
          {dummyStudent.recentActivity.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <div>
                <span className="text-text-secondary">{item.action}</span>{' '}
                <span className="text-white">{item.item}</span>
              </div>
              <div className="text-right">
                {item.xp > 0 && <span className="text-lemon-yellow text-xs">+{item.xp} XP</span>}
                <p className="text-xs text-text-muted">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
