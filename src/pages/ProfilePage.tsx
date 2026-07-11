import { Award, Target, Heart } from 'lucide-react'
import { getStoredUser } from '@/lib/auth'
import { dummyStudent } from '../data/dummyStudent'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'

export function ProfilePage() {
  const user = getStoredUser()

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="purple" className="mb-2">Profile</Badge>
        <h1 className="text-2xl font-bold">Student Profile</h1>
      </div>

      <Card className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-3xl font-bold text-bg-primary">
          {(user?.full_name ?? dummyStudent.name).charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">{user?.full_name ?? dummyStudent.name}</h2>
          <p className="text-text-secondary text-sm">{user?.email ?? dummyStudent.email}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <Badge variant="neon">Level {dummyStudent.level}</Badge>
            <Badge variant="yellow">{dummyStudent.xp} XP</Badge>
            <Badge variant="green">{dummyStudent.streak} day streak</Badge>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {dummyStudent.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-full text-sm bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-lemon-yellow" /> Badges
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {dummyStudent.badges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-xl text-center border"
                style={{ borderColor: `${badge.color}30`, background: `${badge.color}10` }}
              >
                <p className="text-sm font-semibold" style={{ color: badge.color }}>{badge.name}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-mantis-green" /> Goals
          </h3>
          <ul className="space-y-2">
            {dummyStudent.goals.map((goal) => (
              <li key={goal} className="text-sm text-text-secondary p-3 rounded-xl bg-white/[0.03] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mantis-green shrink-0" />
                {goal}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-neon-purple" /> Learning Interests
          </h3>
          <div className="space-y-3">
            {dummyStudent.interests.map((interest, i) => (
              <div key={interest}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{interest}</span>
                </div>
                <ProgressBar value={[80, 65, 40, 55][i] ?? 50} color="#b026ff" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
