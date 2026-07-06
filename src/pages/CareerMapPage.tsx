import { Map, CheckCircle } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'

const roadmaps = [
  {
    id: 'r1',
    role: 'Data Analyst',
    color: '#00f0ff',
    progress: 45,
    steps: ['SQL Fundamentals', 'Excel & Sheets', 'Python Basics', 'Power BI', 'Portfolio Project', 'Interview Prep'],
    duration: '4-6 months',
  },
  {
    id: 'r2',
    role: 'Python Developer',
    color: '#b026ff',
    progress: 30,
    steps: ['Python Core', 'OOP & Modules', 'Web Basics', 'Django/Flask', 'APIs', 'Deployment'],
    duration: '5-7 months',
  },
  {
    id: 'r3',
    role: 'SQL Developer',
    color: '#1944f1',
    progress: 55,
    steps: ['SQL Basics', 'Advanced Queries', 'Stored Procedures', 'Performance Tuning', 'ETL Concepts', 'Certification'],
    duration: '3-5 months',
  },
  {
    id: 'r4',
    role: 'Power BI Analyst',
    color: '#ffef4d',
    progress: 15,
    steps: ['Data Modeling', 'DAX Basics', 'Dashboard Design', 'Power Query', 'Report Publishing', 'Case Studies'],
    duration: '3-4 months',
  },
  {
    id: 'r5',
    role: 'Full Stack Beginner',
    color: '#82d173',
    progress: 10,
    steps: ['HTML/CSS', 'JavaScript', 'React Basics', 'Node.js Intro', 'Database', 'Full Stack Project'],
    duration: '6-9 months',
  },
]

export function CareerMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="purple" className="mb-2">Career</Badge>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="w-7 h-7 text-neon-purple" />
          Career Map
        </h1>
        <p className="text-text-secondary text-sm mt-1">Role-based roadmaps to guide your placement journey.</p>
      </div>

      <div className="space-y-6">
        {roadmaps.map((roadmap) => (
          <Card key={roadmap.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold" style={{ color: roadmap.color }}>{roadmap.role}</h3>
                <p className="text-xs text-text-secondary mt-1">Estimated: {roadmap.duration}</p>
              </div>
              <ProgressBar value={roadmap.progress} color={roadmap.color} showLabel className="sm:w-48" />
            </div>

            <div className="relative">
              <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
              <div className="grid sm:grid-cols-6 gap-4">
                {roadmap.steps.map((step, i) => (
                  <div key={step} className="relative text-center">
                    <div
                      className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 border-2 ${
                        i < Math.ceil(roadmap.progress / 100 * roadmap.steps.length)
                          ? 'border-mantis-green bg-mantis-green/20'
                          : 'border-white/20 bg-white/5'
                      }`}
                    >
                      {i < Math.ceil(roadmap.progress / 100 * roadmap.steps.length) ? (
                        <CheckCircle className="w-5 h-5 text-mantis-green" />
                      ) : (
                        <span className="text-xs font-bold text-text-secondary">{i + 1}</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
