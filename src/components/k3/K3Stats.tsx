import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { dummyStudent } from '@/data/dummyStudent'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const STATS = [
  { label: 'Quests Completed', value: 127, suffix: '' },
  { label: 'Day Streak', value: dummyStudent.streak, suffix: '' },
  { label: 'Level Reached', value: dummyStudent.level, suffix: '' },
  { label: 'Placement Ready', value: dummyStudent.careerReadiness, suffix: '%' },
] as const

function useCountUp(ref: React.RefObject<HTMLElement | null>, target: number, suffix: string) {
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.val)}${suffix}`
        },
      })
    },
    { scope: ref },
  )
}

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const numRef = useRef<HTMLSpanElement>(null)
  useCountUp(numRef, value, suffix)

  return (
    <div className="border-t border-white/10 pt-6">
      <span ref={numRef} className="block text-[clamp(2rem,5vw,3.5rem)] font-medium tabular-nums text-white">
        0{suffix}
      </span>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</p>
    </div>
  )
}

export function K3Stats() {
  return (
    <section className="grid grid-cols-2 gap-8 border-b border-white/10 px-4 py-16 md:grid-cols-4 md:px-8">
      {STATS.map((s) => (
        <StatItem key={s.label} {...s} />
      ))}
    </section>
  )
}
