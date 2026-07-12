import { Outlet, useLocation } from 'react-router-dom'
import { OrchestratedTopNav } from './OrchestratedTopNav'
import { LabSideRail } from './LabSideRail'
import { K3Header, K3LeftRail } from '@/components/k3/K3Header'
import { cn } from '@/lib/utils'

export function StudentShell() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg-primary md:pl-14 md:pr-14">
      <K3LeftRail />
      <LabSideRail />
      <K3Header />
      <OrchestratedTopNav />
      <main
        className={cn(
          'flex-1 overflow-y-auto bg-bg-primary text-text-primary',
          isDashboard ? 'px-0 pb-0 pt-[7.25rem]' : 'px-4 pb-8 pt-[7.75rem] md:px-8',
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
