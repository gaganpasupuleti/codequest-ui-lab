import { CheckCircle, FileText, Target, AlertCircle } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'

const checklist = [
  { id: 'c1', item: 'Contact information complete', done: true },
  { id: 'c2', item: 'Professional summary added', done: true },
  { id: 'c3', item: 'Skills section optimized', done: true },
  { id: 'c4', item: 'Quantified achievements', done: false },
  { id: 'c5', item: 'ATS-friendly formatting', done: false },
  { id: 'c6', item: 'Keywords from job description', done: false },
]

const suggestions = [
  'Add metrics to your project descriptions (e.g., "Improved query performance by 40%")',
  'Include SQL and Python in your skills section with proficiency levels',
  'Tailor your summary for Data Analyst roles',
]

const sections = [
  { name: 'Contact', status: 'complete' },
  { name: 'Summary', status: 'complete' },
  { name: 'Education', status: 'complete' },
  { name: 'Experience', status: 'needs-work' },
  { name: 'Projects', status: 'needs-work' },
  { name: 'Skills', status: 'complete' },
]

export function ResumeLabPage() {
  const atsScore = 78

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="green" className="mb-2">Resume Lab</Badge>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-7 h-7 text-mantis-green" />
          Resume Lab
        </h1>
        <p className="text-text-secondary text-sm mt-1">ATS optimization and resume improvement — dummy UI only.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <h3 className="font-semibold mb-4">ATS Score</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#82d173" strokeWidth="2.5"
                strokeDasharray={`${atsScore} 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-mantis-green">
              {atsScore}
            </span>
          </div>
          <Badge variant="green">Good — Room to improve</Badge>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-blue" /> JD Match Placeholder
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Target Role: <span className="text-white">Junior Data Analyst</span>
          </p>
          <div className="space-y-3">
            {['SQL', 'Python', 'Excel', 'Data Visualization', 'Communication'].map((skill) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill}</span>
                  <span className="text-text-secondary">{skill === 'Excel' ? '60%' : skill === 'Data Visualization' ? '45%' : '85%'}</span>
                </div>
                <ProgressBar
                  value={skill === 'Excel' ? 60 : skill === 'Data Visualization' ? 45 : 85}
                  color={skill === 'Data Visualization' ? '#ffef4d' : '#82d173'}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Resume Checklist</h3>
          <ul className="space-y-3">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <CheckCircle className={`w-4 h-4 shrink-0 ${item.done ? 'text-mantis-green' : 'text-text-muted'}`} />
                <span className={item.done ? 'text-white' : 'text-text-secondary'}>{item.item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-lemon-yellow" /> Improvement Suggestions
          </h3>
          <ul className="space-y-3">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary p-3 rounded-xl bg-white/[0.03] border border-white/5">
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Resume Sections</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((s) => (
            <div key={s.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <span className="text-sm font-medium">{s.name}</span>
              <Badge variant={s.status === 'complete' ? 'green' : 'yellow'}>
                {s.status === 'complete' ? 'Done' : 'Improve'}
              </Badge>
            </div>
          ))}
        </div>
        <Button className="mt-4">Upload Resume (Dummy)</Button>
      </Card>
    </div>
  )
}
