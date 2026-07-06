import { useState } from 'react'
import { Database, Lock, Play, Unlock } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'

const challenges = [
  { id: 'c1', title: 'SELECT Basics', difficulty: 'Easy', unlocked: true, completed: true, xp: 50 },
  { id: 'c2', title: 'WHERE Clauses', difficulty: 'Easy', unlocked: true, completed: true, xp: 50 },
  { id: 'c3', title: 'INNER JOINs', difficulty: 'Medium', unlocked: true, completed: false, xp: 75 },
  { id: 'c4', title: 'LEFT JOINs', difficulty: 'Medium', unlocked: true, completed: false, xp: 75 },
  { id: 'c5', title: 'Subqueries', difficulty: 'Hard', unlocked: false, completed: false, xp: 100 },
  { id: 'c6', title: 'Window Functions', difficulty: 'Hard', unlocked: false, completed: false, xp: 100 },
]

const difficultyVariant = (d: string) => {
  if (d === 'Easy') return 'green' as const
  if (d === 'Medium') return 'yellow' as const
  return 'purple' as const
}

export function SqlArenaPage() {
  const [selected, setSelected] = useState(challenges[2])

  const sampleProblem = {
    title: 'Find Top Customers by Revenue',
    description: 'Write a query to return the top 5 customers by total order revenue. Include customer name and total revenue.',
    hint: 'Use JOIN, GROUP BY, and ORDER BY with LIMIT.',
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="neon" className="mb-2">SQL Arena</Badge>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-7 h-7 text-neon-blue" />
          SQL Arena
        </h1>
        <p className="text-text-secondary text-sm mt-1">Practice database queries — frontend placeholder only.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="font-semibold mb-4">Challenges</h3>
          <ul className="space-y-2">
            {challenges.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => c.unlocked && setSelected(c)}
                disabled={!c.unlocked}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                  selected.id === c.id ? 'bg-neon-blue/10 border border-neon-blue/30' : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
                } ${!c.unlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {c.unlocked ? (
                  c.completed ? <Unlock className="w-4 h-4 text-mantis-green shrink-0" /> : <Play className="w-4 h-4 text-neon-blue shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <Badge variant={difficultyVariant(c.difficulty)} className="mt-1">{c.difficulty}</Badge>
                </div>
                <span className="text-xs text-lemon-yellow">+{c.xp}</span>
              </button>
            ))}
          </ul>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="font-semibold mb-2">{sampleProblem.title}</h3>
            <p className="text-sm text-text-secondary mb-3">{sampleProblem.description}</p>
            <p className="text-xs text-text-muted italic">Hint: {sampleProblem.hint}</p>
            <ProgressBar value={selected.completed ? 100 : 40} color="#00f0ff" showLabel className="mt-4" />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">SQL Editor</h3>
              <Badge variant="muted">Placeholder</Badge>
            </div>
            <pre className="p-4 rounded-xl bg-smoky-black/80 border border-white/10 text-sm font-mono text-neon-blue overflow-x-auto">
{`SELECT c.name, SUM(o.amount) AS revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 5;`}
            </pre>
            <Button size="sm" className="mt-3">Run Query (Dummy)</Button>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">Results Panel</h3>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left p-3 text-text-secondary font-medium">name</th>
                    <th className="text-left p-3 text-text-secondary font-medium">revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5"><td className="p-3">Alice Corp</td><td className="p-3 text-mantis-green">₹1,24,500</td></tr>
                  <tr className="border-t border-white/5"><td className="p-3">Beta Ltd</td><td className="p-3 text-mantis-green">₹98,200</td></tr>
                  <tr className="border-t border-white/5"><td className="p-3">Gamma Inc</td><td className="p-3 text-mantis-green">₹87,100</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-mantis-green mt-2">✓ Query executed successfully (dummy result)</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
