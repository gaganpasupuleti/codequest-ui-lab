import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Briefcase, CalendarClock } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { missionFeedItems, type FeedItemKind, type MissionFeedItem } from '@/data/missionFeedItems'

gsap.registerPlugin(useGSAP)

const KIND_CONFIG: Record<
  FeedItemKind,
  { icon: typeof CalendarClock; href: string; accent: string }
> = {
  deadline: {
    icon: CalendarClock,
    href: '/practice',
    accent: 'border-white/20 bg-white/[0.04] text-white',
  },
  job: {
    icon: Briefcase,
    href: '/jobs',
    accent: 'border-white/25 bg-white/[0.06] text-white',
  },
  book: {
    icon: BookOpen,
    href: '/materials',
    accent: 'border-white/15 bg-white/[0.03] text-white',
  },
}

function FeedPill({ item }: { item: MissionFeedItem }) {
  const cfg = KIND_CONFIG[item.kind]
  const Icon = cfg.icon

  return (
    <Link
      to={cfg.href}
      className={cn(
        'group inline-flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors hover:border-white/40',
        cfg.accent,
      )}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0a] text-white/70">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="flex min-w-0 flex-col text-left">
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {item.badge}
        </span>
        <span className="max-w-[220px] truncate text-sm font-medium leading-tight text-white group-hover:text-white">
          {item.title}
        </span>
        <span className="text-[11px] text-white/45">{item.meta}</span>
      </span>
    </Link>
  )
}

type MissionFeedTickerProps = {
  active?: boolean
  className?: string
  label?: string
  speed?: number
}

/** Single-row moving feed — deadlines, jobs, books */
export function MissionFeedTicker({
  active = true,
  className = '',
  label = 'Live updates',
  speed = 40,
}: MissionFeedTickerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const items = [...missionFeedItems, ...missionFeedItems]

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track || !active) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(track, { x: 0 })
        return
      }

      const half = track.scrollWidth / 2
      gsap.set(track, { x: 0 })

      const tween = gsap.to(track, {
        x: -half,
        duration: speed,
        ease: 'none',
        repeat: -1,
      })

      const onEnter = () => tween.pause()
      const onLeave = () => tween.play()
      root.addEventListener('mouseenter', onEnter)
      root.addEventListener('mouseleave', onLeave)

      return () => {
        root.removeEventListener('mouseenter', onEnter)
        root.removeEventListener('mouseleave', onLeave)
        tween.kill()
      }
    },
    { scope: rootRef, dependencies: [active, speed] },
  )

  if (!active) return null

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative shrink-0 overflow-hidden border-t border-white/10 bg-[#0a0a0a]',
        className,
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3 sm:px-6">
        <p className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 sm:block">
          {label}
        </p>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div ref={trackRef} className="flex w-max items-center gap-3 pr-3">
            {items.map((item, i) => (
              <FeedPill key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
