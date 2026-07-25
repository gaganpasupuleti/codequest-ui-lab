import type { AuthUser } from '@/lib/auth'

import { LearningPlannerView } from '@/components/learning-planner/LearningPlannerView'
import type { PlannerNavTarget } from '@/components/learning-planner/PlannerEventDrawer'

interface LearningPlannerPageProps {
  user: AuthUser
  onNavigate: (page: PlannerNavTarget) => void
}

export function LearningPlannerPage({ user, onNavigate }: LearningPlannerPageProps) {
  return (
    <div className="min-w-0 w-full overflow-x-hidden">
      <LearningPlannerView user={user} onNavigate={onNavigate} />
    </div>
  )
}

export type { PlannerNavTarget }
