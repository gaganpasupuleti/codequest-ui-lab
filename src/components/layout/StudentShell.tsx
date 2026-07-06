import { Outlet } from 'react-router-dom'
import { Sidebar, MobileNav } from './Sidebar'
import { Topbar } from './Topbar'

export function StudentShell() {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
