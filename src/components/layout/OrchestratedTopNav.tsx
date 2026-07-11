import { useRef, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sidebarItems } from './sidebarItems'
import { useOrchestratedNavMotion } from './useOrchestratedNavMotion'
import { useNavCardStagger } from './useNavCardStagger'
import { MissionFeedTicker } from '@/components/theme/MissionFeedTicker'
import { useNavMenu } from '@/lib/navMenu'

const CARD_ACCENTS = [
  'from-white/[0.06] to-[#111]',
  'from-white/[0.04] to-[#0d0d0d]',
  'from-white/[0.05] to-[#111]',
  'from-white/[0.03] to-[#0a0a0a]',
  'from-white/[0.06] to-[#111]',
  'from-white/[0.04] to-[#0d0d0d]',
] as const

/** Full-screen K3 explore overlay — route grid + search */
export function OrchestratedTopNav() {
  const { menuOpen, openMenu, closeMenu } = useNavMenu()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const { overlayRef, panelRef } = useOrchestratedNavMotion(menuOpen)

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sidebarItems
    return sidebarItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q),
    )
  }, [query])

  useNavCardStagger(menuOpen, gridRef, filteredItems.length)

  const handleCloseMenu = () => {
    closeMenu()
    setQuery('')
  }

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    closeMenu()
    setQuery('')
  }, [location.pathname, closeMenu])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return createPortal(
    <div
      id="orch-nav-overlay"
      ref={overlayRef}
      data-open={menuOpen ? 'true' : 'false'}
      className="orch-nav-overlay fixed inset-0 z-[1200] pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!menuOpen}
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div
        ref={panelRef}
        className={cn(
          'orch-nav-panel relative flex h-full w-full flex-col',
          menuOpen ? 'opacity-100' : 'opacity-0',
        )}
      >
        <header className="relative shrink-0 border-b border-white/10 bg-[#0a0a0a]/95 px-4 py-5 backdrop-blur-md sm:px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
            <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-white/40 sm:block">
              Code Quest · Explore
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-[#111] px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-white/50" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={openMenu}
                placeholder="Search routes, labs, quests…"
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
                aria-label="Filter navigation"
              />
            </div>
            <button
              type="button"
              onClick={handleCloseMenu}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#111] text-white/70 hover:border-white/35 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mx-auto mt-3 w-full max-w-6xl font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
            Learning modules · {filteredItems.length} available
          </p>
        </header>

        <div
          ref={gridRef}
          className="orch-nav-grid orch-nav-grid-k3 relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 md:px-8"
        >
          <div className="mx-auto w-full max-w-6xl">
            {filteredItems.length === 0 ? (
              <p className="py-20 text-center font-mono text-sm uppercase tracking-wider text-white/35">
                No routes match your search
              </p>
            ) : (
              <nav
                aria-label="Student navigation"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
              >
                {filteredItems.map((item) => {
                  const index = sidebarItems.findIndex((s) => s.href === item.href)
                  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]

                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={handleCloseMenu}
                      className={({ isActive }) =>
                        cn(
                          'orch-nav-card group block no-underline will-change-transform',
                          isActive && 'is-active',
                        )
                      }
                    >
                      <div
                        className={cn(
                          'relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-4 transition-all duration-200 sm:aspect-[4/3]',
                          accent,
                          'group-hover:-translate-y-0.5 group-hover:border-white/25 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] group-[.is-active]:border-white/40',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0a0a0a]/60 text-white/80 group-hover:border-white/30">
                            <item.icon className="h-5 w-5" />
                          </span>
                          <span className="font-mono text-[11px] tabular-nums text-white/35">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div>
                          <span className="block text-left text-sm font-semibold uppercase leading-tight tracking-tight text-white sm:text-base">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-left font-mono text-[10px] uppercase tracking-wider text-white/35">
                            {item.href.replace('/', '')}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  )
                })}
              </nav>
            )}
          </div>
        </div>

        <MissionFeedTicker
          active={menuOpen}
          label="What's new"
          speed={36}
          className="border-t border-white/10 bg-[#0a0a0a]"
        />
      </div>
    </div>,
    document.body,
  )
}
