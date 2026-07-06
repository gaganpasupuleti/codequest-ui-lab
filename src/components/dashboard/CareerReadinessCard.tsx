import { Link } from 'react-router-dom'
import { Briefcase, TrendingUp } from 'lucide-react'
import { dummyStudent } from '../../data/dummyStudent'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'

export function CareerReadinessCard() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-mantis-green" />
        <h3 className="font-semibold">Career Readiness</h3>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke="#82d173" strokeWidth="3"
              strokeDasharray={`${dummyStudent.careerReadiness} 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {dummyStudent.careerReadiness}%
          </span>
        </div>
        <div>
          <p className="text-sm text-text-secondary mb-1">Placement readiness score</p>
          <p className="text-xs text-text-secondary">Based on skills, resume, and practice</p>
        </div>
      </div>
      <ProgressBar value={dummyStudent.careerReadiness} color="#82d173" />
      <Link to="/career-map" className="block mt-4">
        <Button variant="secondary" size="sm" className="w-full">
          <TrendingUp className="w-4 h-4" />
          View Career Map
        </Button>
      </Link>
    </Card>
  )
}
