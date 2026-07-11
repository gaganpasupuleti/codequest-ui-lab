import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { clearAuth, getStoredUser } from '@/lib/auth'
import { Button } from '../ui/Button'
import { sidebarItems } from './sidebarItems'

export function Topbar() {
  const user = getStoredUser()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-[#22FF88]/12 bg-[#0A1020]/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <button
          type="button"
          className="lg:hidden p-2 text-text-secondary hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 glass rounded-full px-4 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-secondary" />
          <input
            type="search"
            placeholder="Search quests, skills..."
            className="bg-transparent text-sm text-white placeholder:text-text-muted outline-none flex-1"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-white/10 text-text-secondary relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-blue rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-bg-primary">
            {user?.full_name?.charAt(0) ?? 'Q'}
          </div>
          <span className="text-sm font-medium hidden md:block">{user?.full_name ?? 'Learner'}</span>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 glass-strong border-b border-white/8 z-50 max-h-[70vh] overflow-y-auto">
          <nav className="p-4 grid grid-cols-2 gap-2">
            {sidebarItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => { navigate(item.href); setMobileMenuOpen(false) }}
                className="flex items-center gap-2 p-3 rounded-xl text-sm text-text-secondary hover:bg-white/5 hover:text-white text-left"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
