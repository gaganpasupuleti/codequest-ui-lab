import { useState } from 'react'
import { Code, Terminal } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'

const topics = [
  { id: 't1', title: 'Variables & Types', exercises: 8, progress: 100, xp: 80 },
  { id: 't2', title: 'Lists & Tuples', exercises: 10, progress: 60, xp: 50 },
  { id: 't3', title: 'Functions', exercises: 12, progress: 25, xp: 0 },
  { id: 't4', title: 'Dictionaries', exercises: 8, progress: 0, xp: 0 },
  { id: 't5', title: 'File Handling', exercises: 6, progress: 0, xp: 0 },
]

export function PythonLabPage() {
  const [activeTopic, setActiveTopic] = useState(topics[2])

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="purple" className="mb-2">Python Lab</Badge>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code className="w-7 h-7 text-neon-purple" />
          Python Lab
        </h1>
        <p className="text-text-secondary text-sm mt-1">Interactive Python practice — frontend placeholder only.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="font-semibold mb-4">Topics</h3>
          <ul className="space-y-2">
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTopic(t)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  activeTopic.id === t.id ? 'bg-neon-purple/10 border border-neon-purple/30' : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                <p className="text-sm font-medium">{t.title}</p>
                <ProgressBar value={t.progress} color="#b026ff" className="mt-2" />
                <p className="text-xs text-text-secondary mt-1">{t.exercises} exercises · {t.xp} XP</p>
              </button>
            ))}
          </ul>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <Card>
            <h3 className="font-semibold mb-2">{activeTopic.title} — Practice</h3>
            <p className="text-sm text-text-secondary">
              Write a function that takes a list of numbers and returns the sum of even numbers only.
            </p>
            <Badge variant="yellow" className="mt-2">+25 XP reward</Badge>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Code className="w-4 h-4" /> Code Editor
              </h3>
              <Badge variant="muted">Placeholder</Badge>
            </div>
            <pre className="p-4 rounded-xl bg-smoky-black/80 border border-white/10 text-sm font-mono text-neon-purple overflow-x-auto">
{`def sum_even(numbers):
    total = 0
    for n in numbers:
        if n % 2 == 0:
            total += n
    return total

print(sum_even([1, 2, 3, 4, 5, 6]))`}
            </pre>
            <Button size="sm" className="mt-3">Run Code (Dummy)</Button>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Output
            </h3>
            <pre className="p-4 rounded-xl bg-smoky-black/80 border border-white/10 text-sm font-mono text-mantis-green">
12
            </pre>
            <p className="text-xs text-mantis-green mt-2">✓ All test cases passed (dummy)</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
