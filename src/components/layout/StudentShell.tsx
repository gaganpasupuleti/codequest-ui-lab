import { Outlet, useLocation } from 'react-router-dom'
import { OrchestratedTopNav } from './OrchestratedTopNav'
import { LabSideRail } from './LabSideRail'
import { K3Header, K3LeftRail } from '@/components/k3/K3Header'
import { cn } from '@/lib/utils'

export function StudentShell() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  // Pastel dashboard owns its chrome — keep K3 shell for other authenticated routes.
  if (isDashboard) {
    return (
      <div className="relative h-screen overflow-hidden">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg-primary md:pl-14 md:pr-14">
      <K3LeftRail />
      <LabSideRail />
      <K3Header />
      <OrchestratedTopNav />
      <main className={cn('flex-1 overflow-y-auto bg-bg-primary text-text-primary px-4 pb-8 pt-[7.75rem] md:px-8')}>
        <Outlet />
      </main>
    </div>
  )
}
