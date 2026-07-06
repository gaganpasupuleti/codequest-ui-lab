import { type LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: string
  subtext?: string
}

export function StatCard({ label, value, icon: Icon, color = '#00f0ff', subtext }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-text-secondary mt-1">{subtext}</p>}
        </div>
        <div
          className="p-2.5 rounded-xl"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </Card>
  )
}
