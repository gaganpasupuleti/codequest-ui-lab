import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Brain, Briefcase, Code, Database, FileText } from 'lucide-react'
import { learningPaths } from '../../data/dummyCourses'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  database: Database,
  code: Code,
  'bar-chart': BarChart3,
  'file-text': FileText,
  briefcase: Briefcase,
  brain: Brain,
}

export function LearningPaths() {
  return (
    <section id="learning-paths" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <Badge variant="neon" className="mb-4">Learning Paths</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Choose Your Quest Path
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          Structured tracks designed to take you from beginner to placement-ready.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path, i) => {
          const Icon = iconMap[path.icon] ?? Code
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={path.href}>
                <Card hover className="h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: `${path.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: path.color }} />
                    </div>
                    <Badge variant="muted">{path.badge}</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-neon-blue transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">{path.description}</p>
                  <ProgressBar value={path.progress} color={path.color} showLabel />
                  {path.xp > 0 && (
                    <p className="text-xs text-text-secondary mt-2">{path.xp} XP earned</p>
                  )}
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
