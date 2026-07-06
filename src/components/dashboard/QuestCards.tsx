import { Link } from 'react-router-dom'
import { ArrowRight, Swords } from 'lucide-react'
import { currentQuests } from '../../data/dummyQuests'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

export function QuestCards() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-neon-blue" />
          <h3 className="font-semibold">Current Quests</h3>
        </div>
        <Link to="/practice" className="text-xs text-neon-blue hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-4">
        {currentQuests.map((quest) => (
          <Link key={quest.id} to={quest.href} className="block p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-text-secondary mb-1">{quest.category}</p>
                <h4 className="font-semibold text-sm">{quest.title}</h4>
              </div>
              <Badge variant="neon">{quest.badge}</Badge>
            </div>
            <p className="text-xs text-text-secondary mb-3">{quest.description}</p>
            <ProgressBar value={quest.progress} color="#00f0ff" showLabel />
            <p className="text-xs text-lemon-yellow mt-1">+{quest.xp} XP on completion</p>
          </Link>
        ))}
      </div>
    </Card>
  )
}
