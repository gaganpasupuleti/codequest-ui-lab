import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

const K3_ITEMS = [
  'Practice',
  'SQL Arena',
  'Python Lab',
  'DSA',
  'Aptitude',
  'Resume Lab',
  'Jobs',
  'Career Map',
  'Materials',
  'Progress',
] as const

type K3MarqueeProps = {
  className?: string
  speed?: number
}

/** K3 Studios ✦ service marquee — https://k3studios.ae/ */
export function K3ServiceMarquee({ className = '', speed = 28 }: K3MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const line = K3_ITEMS.flatMap((item) => [item, '✦']).join(' ')
  const text = `${line} ${line}`

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track) return

      const half = track.scrollWidth / 2
      gsap.set(track, { x: 0 })
      const tween = gsap.to(track, {
        x: -half,
        duration: speed,
        ease: 'none',
        repeat: -1,
      })

      return () => tween.kill()
    },
    { scope: rootRef, dependencies: [speed] },
  )

  return (
    <div
      ref={rootRef}
      className={cn(
        'overflow-hidden border-y border-[color:var(--cq-border-subtle)] bg-bg-primary py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary',
        className,
      )}
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap px-4">
        <span>{text}</span>
        <span className="ml-8">{text}</span>
      </div>
    </div>
  )
}
