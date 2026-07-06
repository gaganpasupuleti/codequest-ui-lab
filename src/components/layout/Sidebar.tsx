import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { sidebarItems } from './sidebarItems'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden lg:flex flex-col glass border-r border-white/8 h-full transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}
      aria-label="Sidebar navigation"
    >
      <div className="p-4 flex items-center justify-between border-b border-white/8">
        {!collapsed && (
          <span className="font-bold text-sm gradient-text">Code Quest</span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/8 px-2 py-2" aria-label="Mobile navigation">
      <div className="flex justify-around">
        {sidebarItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs ${
                isActive ? 'text-neon-blue' : 'text-text-secondary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="truncate max-w-[56px]">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
