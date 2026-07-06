import { useState } from 'react'
import { Bookmark, Briefcase, MapPin, Send } from 'lucide-react'
import { dummyJobs } from '../data/dummyJobs'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const readinessVariant = (r: string) => {
  if (r === 'Ready') return 'green' as const
  if (r === 'Almost') return 'yellow' as const
  return 'muted' as const
}

export function JobsPage() {
  const [saved, setSaved] = useState<Set<string>>(new Set(['j1']))

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="yellow" className="mb-2">Jobs Portal</Badge>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-lemon-yellow" />
          Jobs Portal
        </h1>
        <p className="text-text-secondary text-sm mt-1">Dummy jobs — no scraping, no external APIs.</p>
      </div>

      <div className="space-y-4">
        {dummyJobs.map((job) => (
          <Card key={job.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{job.role}</h3>
                  <Badge variant={readinessVariant(job.readiness)}>{job.readiness}</Badge>
                </div>
                <p className="text-text-secondary text-sm">{job.company}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                  <span>{job.type}</span>
                  <span>{job.salary}</span>
                  <span>{job.posted}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neon-blue">{job.matchScore}%</p>
                  <p className="text-xs text-text-secondary">Match</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSave(job.id)}
                    aria-label={saved.has(job.id) ? 'Unsave job' : 'Save job'}
                  >
                    <Bookmark className={`w-4 h-4 ${saved.has(job.id) ? 'fill-lemon-yellow text-lemon-yellow' : ''}`} />
                  </Button>
                  <Button size="sm">
                    <Send className="w-4 h-4" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
