import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3, Brain, Clipboard, Code, Database, GitBranch, Zap,
} from 'lucide-react'
import { practiceModules } from '../data/dummyCourses'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  database: Database,
  code: Code,
  brain: Brain,
  'git-branch': GitBranch,
  clipboard: Clipboard,
  zap: Zap,
  'bar-chart': BarChart3,
}

export function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="neon" className="mb-2">Practice Arena</Badge>
        <h1 className="text-2xl font-bold">Practice Arena</h1>
        <p className="text-text-secondary text-sm mt-1">
          Choose a module to sharpen your skills. No code execution — UI prototype only.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {practiceModules.map((mod, i) => {
          const Icon = iconMap[mod.icon] ?? Code
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={mod.href}>
                <Card hover className={`h-full ${mod.comingSoon ? 'opacity-70' : ''}`}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${mod.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: mod.color }} />
                  </div>
                  <h3 className="font-bold mb-1">{mod.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">{mod.description}</p>
                  {mod.comingSoon ? (
                    <Badge variant="muted">Coming Soon</Badge>
                  ) : (
                    <p className="text-xs text-text-secondary">{mod.questions} questions available</p>
                  )}
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
