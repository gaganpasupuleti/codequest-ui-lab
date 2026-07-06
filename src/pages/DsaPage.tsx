import { GitBranch, Layers, Link2, TreePine, Type } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState } from '../components/ui/EmptyState'

const topics = [
  { id: 'd1', title: 'Arrays', icon: Layers, problems: 45, progress: 25, color: '#00f0ff' },
  { id: 'd2', title: 'Strings', icon: Type, problems: 38, progress: 15, color: '#b026ff' },
  { id: 'd3', title: 'Linked Lists', icon: Link2, problems: 30, progress: 10, color: '#ffef4d' },
  { id: 'd4', title: 'Trees', icon: TreePine, problems: 35, progress: 5, color: '#82d173' },
  { id: 'd5', title: 'Graphs', icon: GitBranch, problems: 28, progress: 0, color: '#1944f1' },
]

export function DsaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="purple" className="mb-2">DSA</Badge>
        <h1 className="text-2xl font-bold">Data Structures & Algorithms</h1>
        <p className="text-text-secondary text-sm mt-1">DSA practice placeholder — visualizer coming soon.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} hover>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${topic.color}20` }}
            >
              <topic.icon className="w-6 h-6" style={{ color: topic.color }} />
            </div>
            <h3 className="font-bold mb-1">{topic.title}</h3>
            <p className="text-xs text-text-secondary mb-3">{topic.problems} problems</p>
            <ProgressBar value={topic.progress} color={topic.color} showLabel />
          </Card>
        ))}
      </div>

      <Card>
        <EmptyState
          title="Visualizer Coming Soon"
          description="Interactive algorithm visualizations for arrays, trees, and graphs will be available in a future update."
          icon={<GitBranch className="w-12 h-12" />}
        />
      </Card>
    </div>
  )
}
