import { motion } from 'framer-motion'
import { BookOpen, Briefcase, Code, Target } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

const stats = [
  { icon: Target, label: '5000+ Practice Question Structure', color: '#00f0ff' },
  { icon: BookOpen, label: 'Resume + ATS Lab', color: '#82d173' },
  { icon: Briefcase, label: 'Daily Job Alert Concept', color: '#ffef4d' },
  { icon: Code, label: 'Python + SQL + Analytics Tracks', color: '#b026ff' },
]

export function WhyCodeQuest() {
  return (
    <section id="why-codequest" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="green" className="mb-4">Why Code Quest</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 leading-tight">
            Learning should feel like progress, not pressure.
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Code Quest helps students learn coding, practice SQL and Python, prepare resumes,
            discover jobs, follow roadmaps, and build placement readiness — all in one platform.
            Every quest earns XP, every skill builds toward your career.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-5 h-full">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <p className="text-sm font-semibold text-white-smoke">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
