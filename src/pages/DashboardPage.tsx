import { getStoredUser } from '@/lib/auth'
import { dummyStudent } from '@/data/dummyStudent'
import { K3Dashboard } from '@/components/k3/K3Dashboard'

export function DashboardPage() {
  const user = getStoredUser()
  const firstName = (user?.full_name ?? dummyStudent.name).split(' ')[0] ?? 'Learner'

  return <K3Dashboard firstName={firstName} />
}
