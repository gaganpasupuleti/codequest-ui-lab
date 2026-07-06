import { Sparkles } from 'lucide-react'
import { getUser } from '../../lib/auth'
import { dummyStudent } from '../../data/dummyStudent'
import { Card } from '../ui/Card'

export function WelcomeCard() {
  const user = getUser()
  const name = user?.name ?? dummyStudent.name

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-neon-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-lemon-yellow" />
          <span className="text-xs uppercase tracking-widest text-text-secondary">Welcome back</span>
        </div>
        <h2 className="text-2xl font-bold mb-1">Hey, {name}!</h2>
        <p className="text-text-secondary text-sm">
          Level {dummyStudent.level} · {dummyStudent.xp} XP · Keep your streak alive!
        </p>
      </div>
    </Card>
  )
}
