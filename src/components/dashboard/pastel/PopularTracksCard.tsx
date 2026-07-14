import { Link } from 'react-router-dom'
import { Code2, Database, BarChart3, GitBranch, Brain, Sparkles, Star } from 'lucide-react'
import { BentoCard } from '@/components/dashboard/pastel/BentoCard'
import { StudentAction } from '@/components/dashboard/pastel/StudentAction'
import { StudentPill } from '@/components/dashboard/pastel/StudentPill'

const TRACKS = [
  { label: 'Python', href: '/python-lab', icon: Code2, tint: 'rgba(189,239,215,0.75)', meta: 'Beginner' },
  { label: 'SQL', href: '/sql-arena', icon: Database, tint: 'rgba(214,225,255,0.9)', meta: '42 lessons' },
  { label: 'Data Analytics', href: '/materials', icon: BarChart3, tint: 'rgba(255,227,163,0.8)', meta: 'Track' },
  { label: 'DSA', href: '/dsa', icon: GitBranch, tint: 'rgba(255,210,200,0.75)', meta: 'Practice' },
  { label: 'Aptitude', href: '/aptitude', icon: Brain, tint: 'rgba(214,225,255,0.75)', meta: 'Mocks' },
  { label: 'AI Tools', href: '/practice', icon: Sparkles, tint: 'rgba(189,239,215,0.65)', meta: 'Explore' },
] as const

export function PopularTracksCard({ delay = 0.1 }: { delay?: number }) {
  const featured = TRACKS[1]
  const rest = TRACKS.filter((t) => t.label !== featured.label)

  return (
    <BentoCard className="sp-span-4" tone="peach" delay={delay}>
      <div className="sp-card-head">
        <div className="sp-card-head__text">
          <p className="sp-eyebrow">Learning tracks</p>
          <h2 className="sp-card-title">Popular tracks</h2>
        </div>
        <div className="sp-card-head__aside">
          <StudentPill variant="dark" size="sm" icon={Star}>
            Hot
          </StudentPill>
        </div>
      </div>

      <Link to={featured.href} className="sp-track-featured">
        <span
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            display: 'grid',
            placeItems: 'center',
            background: featured.tint,
          }}
        >
          <featured.icon size={15} />
        </span>
        <span>
          <strong>Recommended · {featured.label}</strong>
          <span>{featured.meta} · most started this week</span>
        </span>
      </Link>

      <div className="sp-inset">
        <div className="sp-track-wrap">
          {rest.map((track) => (
            <Link
              key={track.label}
              to={track.href}
              className="sp-track-chip"
              style={{ background: track.tint }}
            >
              <track.icon aria-hidden="true" />
              {track.label}
              <span className="sp-muted" style={{ fontWeight: 600 }}>
                {track.meta}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <StudentAction href="/practice" variant="secondary" showArrow style={{ alignSelf: 'flex-start' }}>
        Explore
      </StudentAction>
    </BentoCard>
  )
}
