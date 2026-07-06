import { Activity, BookOpen, Briefcase, Users } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { ProgressBar } from '../components/ui/ProgressBar'

const recentActivity = [
  { student: 'Priya S.', action: 'Completed SQL Arena Level 3', time: '5 min ago' },
  { student: 'Rahul M.', action: 'Submitted Resume for review', time: '12 min ago' },
  { student: 'Sneha K.', action: 'Started Aptitude Mock #4', time: '28 min ago' },
  { student: 'Arjun P.', action: 'Earned Python Explorer badge', time: '1h ago' },
]

export function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="purple" className="mb-2">Admin</Badge>
        <h1 className="text-2xl font-bold">Institute Admin View</h1>
        <p className="text-text-secondary text-sm mt-1">Dummy admin dashboard — placeholder only.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="248" icon={Users} color="#00f0ff" subtext="Placeholder data" />
        <StatCard label="Active Learners" value="186" icon={Activity} color="#b026ff" subtext="Last 7 days" />
        <StatCard label="Course Progress" value="67%" icon={BookOpen} color="#82d173" subtext="Avg completion" />
        <StatCard label="Job Readiness" value="54%" icon={Briefcase} color="#ffef4d" subtext="Placement prep" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Course Progress Overview</h3>
          <div className="space-y-4">
            {[
              { name: 'SQL Arena', progress: 72, color: '#00f0ff' },
              { name: 'Python Lab', progress: 58, color: '#b026ff' },
              { name: 'Aptitude Hub', progress: 45, color: '#ffef4d' },
              { name: 'Resume Lab', progress: 38, color: '#82d173' },
            ].map((course) => (
              <div key={course.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{course.name}</span>
                  <span className="text-text-secondary">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} color={course.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm">
                <div>
                  <p className="font-medium">{item.student}</p>
                  <p className="text-xs text-text-secondary">{item.action}</p>
                </div>
                <span className="text-xs text-text-muted">{item.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
