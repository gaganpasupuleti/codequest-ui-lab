import { Link } from 'react-router-dom'
import { sidebarItems } from '@/components/layout/sidebarItems'
import { K3_SECTION } from './k3Theme'

export function K3Services() {
  return (
    <section id="services" className="border-b border-white/10 px-4 py-20 md:px-8">
      <div className="mb-12">
        <p className={K3_SECTION}>All</p>
        <h2 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase leading-none text-white">
          Modules
        </h2>
      </div>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {sidebarItems.map((item, index) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="group flex items-center gap-6 py-5 transition-colors hover:bg-white/[0.02]"
            >
              <span className="w-8 shrink-0 font-mono text-xs text-white/35">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white">
                {item.label}
              </span>
              <span className="max-w-md truncate text-sm text-white/40 group-hover:text-white/70">
                Open module, practice quests, and track progress →
              </span>
              <span className="text-white/40 group-hover:text-white">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
