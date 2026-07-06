import { Brain, Clock, MessageSquare, Calculator } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'

const sections = [
  {
    id: 'a1',
    title: 'Quantitative Aptitude',
    icon: Calculator,
    color: '#00f0ff',
    topics: ['Percentages', 'Ratios', 'Time & Work', 'Profit & Loss'],
    progress: 40,
    mocks: 5,
  },
  {
    id: 'a2',
    title: 'Logical Reasoning',
    icon: Brain,
    color: '#b026ff',
    topics: ['Series', 'Blood Relations', 'Coding-Decoding', 'Puzzles'],
    progress: 30,
    mocks: 4,
  },
  {
    id: 'a3',
    title: 'Verbal Ability',
    icon: MessageSquare,
    color: '#82d173',
    topics: ['Synonyms', 'Reading Comprehension', 'Sentence Correction', 'Para Jumbles'],
    progress: 20,
    mocks: 3,
  },
]

const speedPractice = [
  { id: 's1', title: 'Speed Round — Quant', time: '10 min', questions: 20 },
  { id: 's2', title: 'Speed Round — Logic', time: '10 min', questions: 15 },
]

const mockTests = [
  { id: 'm1', title: 'Full Mock Test #1', duration: '60 min', questions: 50, score: 72 },
  { id: 'm2', title: 'Full Mock Test #2', duration: '60 min', questions: 50, score: null },
  { id: 'm3', title: 'Company-Specific Mock', duration: '45 min', questions: 40, score: null },
]

export function AptitudePage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="yellow" className="mb-2">Aptitude Hub</Badge>
        <h1 className="text-2xl font-bold">Aptitude Hub</h1>
        <p className="text-text-secondary text-sm mt-1">Placement aptitude preparation — dummy UI only.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.id} hover>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${section.color}20` }}
            >
              <section.icon className="w-6 h-6" style={{ color: section.color }} />
            </div>
            <h3 className="font-bold mb-2">{section.title}</h3>
            <ul className="text-sm text-text-secondary space-y-1 mb-4">
              {section.topics.map((t) => <li key={t}>· {t}</li>)}
            </ul>
            <ProgressBar value={section.progress} color={section.color} showLabel />
            <p className="text-xs text-text-secondary mt-2">{section.mocks} mock tests available</p>
            <Button variant="secondary" size="sm" className="mt-4 w-full">Start Practice</Button>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-neon-blue" /> Speed Practice
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {speedPractice.map((sp) => (
            <div key={sp.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{sp.title}</p>
                <p className="text-xs text-text-secondary">{sp.time} · {sp.questions} questions</p>
              </div>
              <Button size="sm">Go</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4">Mock Test Cards</h3>
        <div className="space-y-3">
          {mockTests.map((mock) => (
            <div key={mock.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{mock.title}</p>
                <p className="text-xs text-text-secondary">{mock.duration} · {mock.questions} questions</p>
              </div>
              <div className="flex items-center gap-3">
                {mock.score !== null && (
                  <Badge variant="green">Score: {mock.score}%</Badge>
                )}
                <Button size="sm">{mock.score !== null ? 'Review' : 'Start'}</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
