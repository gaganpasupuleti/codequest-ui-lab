import { Link } from 'react-router-dom'
import { questGallery } from '@/data/dummyQuests'

const EXTRA_WORK = [
  {
    id: 'g6',
    title: 'DSA Track',
    benefit: 'Arrays, trees, and patterns mapped to placement interview loops.',
    href: '/dsa',
  },
  {
    id: 'g7',
    title: 'Job Board',
    benefit: 'Curated roles with readiness scores and save-for-later tracking.',
    href: '/jobs',
  },
] as const

const SELECTED_WORK = [...questGallery, ...EXTRA_WORK]
import { K3_CARD, K3_SECTION } from './k3Theme'

export function K3SelectedWork() {
  return (
    <section className="border-b border-white/10 px-4 py-20 md:px-8">
      <div className="mb-12">
        <p className={K3_SECTION}>Selected</p>
        <h2 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase leading-none tracking-tight text-white">
          Work
        </h2>
      </div>

      <div className="flex flex-col gap-0">
        {SELECTED_WORK.map((item, index) => (
          <Link
            key={item.id}
            to={item.href}
            className={`${K3_CARD} grid gap-6 border-x-0 border-t-0 border-b md:grid-cols-[80px_1fr_auto] md:items-center`}
          >
            <span className="font-mono text-sm text-white/35">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-xl font-medium uppercase tracking-tight text-white md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">{item.benefit}</p>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-white/50 group-hover:text-white">
              View Quest →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
