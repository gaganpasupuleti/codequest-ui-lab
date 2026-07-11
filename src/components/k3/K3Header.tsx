import { Link, NavLink } from 'react-router-dom'
import { ExternalLink, Menu, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavMenu } from '@/lib/navMenu'
import { LAB_LOCAL_URL } from '@/lib/labConfig'
import { K3_CTA } from './k3Theme'
import { cqPrimaryNav, cqSecondaryNav } from './cqNav'

const NAV_LINK =
  'shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition-colors'

const PILL_LINK =
  'shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors'

export function K3Header() {
  const { toggleMenu } = useNavMenu()

  return (
    <header className="fixed inset-x-0 top-0 z-[1100] border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md md:pl-0 md:pr-14">
      {/* Row 1 — logo + primary CQ routes */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3.5 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
          <Link
            to="/dashboard"
            className="shrink-0 font-mono text-sm font-bold tracking-[0.25em] text-white"
          >
            CQ
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-5 overflow-x-auto scrollbar-thin md:flex lg:gap-6"
            aria-label="Code Quest primary"
          >
            {cqPrimaryNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/dashboard'}
                className={({ isActive }) =>
                  cn(NAV_LINK, isActive ? 'text-white' : 'text-white/45 hover:text-white')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleMenu}
            className={cn(NAV_LINK, 'hidden text-white/40 hover:text-white lg:block')}
          >
            Explore
          </button>
          <button
            type="button"
            onClick={() => window.open(LAB_LOCAL_URL, '_blank', 'noopener,noreferrer')}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 hover:border-white/40 hover:text-white md:hidden"
            aria-label="Open local dev"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 hover:border-white/40 hover:text-white lg:hidden"
            aria-label="Open all modules"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/practice" className={cn(K3_CTA, 'hidden sm:inline-flex')}>
            Start Practice
          </Link>
        </div>
      </div>

      {/* Row 2 — secondary module pills */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-2.5 scrollbar-thin md:px-8">
          <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-white/30 sm:block">
            Modules
          </span>
          <nav className="flex min-w-0 items-center gap-2" aria-label="Code Quest modules">
            {cqSecondaryNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    PILL_LINK,
                    isActive
                      ? 'border-white/40 bg-white/[0.08] text-white'
                      : 'border-white/12 bg-transparent text-white/55 hover:border-white/25 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export function K3LeftRail() {
  return (
    <aside className="pointer-events-none fixed left-0 top-0 z-[1000] hidden h-screen w-14 flex-col items-center border-r border-white/10 py-6 md:flex">
      <div className="mt-2 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Plus key={i} className="h-3 w-3 text-white/25" strokeWidth={1.25} aria-hidden />
        ))}
      </div>
      <div className="mt-auto flex flex-col items-center gap-6 pb-6 text-center">
        <p className="max-w-[48px] font-mono text-[8px] leading-relaxed text-white/35 [writing-mode:vertical-rl] rotate-180">
          lab@codequest.dev
        </p>
        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 [writing-mode:vertical-rl] rotate-180">
          UI Lab
        </p>
      </div>
    </aside>
  )
}
